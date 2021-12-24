import Ajv from "ajv";
import { Request } from "express";
import { PurchaselySubscriptionWebhookDomain } from "./domain/purchasely-subscription-webhook.domain";
import { PurchaselySubscriptionWebhookDtoSchema } from "./dto/subscription-webhook.dto";

import { PurchaselyEventsServiceInterface as EventsService } from "../purchasely-events/service";
import { PurchaselySubscriptionsServiceInterface as SubscriptionsService } from "../purchasely-subscriptions/service";
import { FirebaseCustomClaimsServiceInterface as CustomClaimsService } from "../firebase-custom-claims/service";
import { PurchaselyEventDomain } from "../purchasely-events/domain/purchasely-event.domain";
import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";
import { PurchaselySubscriptionDomain } from "../purchasely-subscriptions/domain/purchasely-subscription.domain";
import { PurchaselyEventName } from "../purchasely-events/domain/purchasely-event-name.enum";
import { PurchaselyFirebaseCustomClaimsDomain } from "../firebase-custom-claims/domain/purchasely-firebase-custom-claims.domain";

import { Services } from "../utils/types/services.type"

export const saveSubscriptionEvent = (service: EventsService | null) => (webhook: PurchaselySubscriptionWebhookDomain): Promise<PurchaselyEventDomain | null> => {
  if (service === null) {
    console.log("Service is null");
    return Promise.resolve(null);
  }

  var event: PurchaselyEventDomain = {
    id: uuid(),
    ...webhook,
    properties: {
      ...webhook.properties,
      expires_at: webhook.properties.expires_at === undefined ? undefined : DateTime.fromISO(webhook.properties.expires_at),
      purchased_at: DateTime.fromISO(webhook.properties.purchased_at),
    },
    received_at: DateTime.fromISO(webhook.received_at),
  };
  return service.create(event.id, event);
};


export const saveFirebaseCustomClaims = (service: CustomClaimsService | null) => (webhook: PurchaselySubscriptionWebhookDomain): Promise<PurchaselyFirebaseCustomClaimsDomain[] | null> => {
  if (service === null) {
    return Promise.resolve(null);
  }
  if (webhook.user.vendor_id === undefined) {
    return Promise.resolve(null);
  }

  const customClaims: PurchaselyFirebaseCustomClaimsDomain[] = [{
    product: webhook.properties.product.vendor_id,
    plan: webhook.properties.product.plan.vendor_id,
  }];

  if (webhook.name === PurchaselyEventName.SUBSCRIPTION_EXPIRED) {
    return service.delete(webhook.user.vendor_id, customClaims);
  }
  return service.create(webhook.user.vendor_id, customClaims);
}

export const saveSubscription = (service: SubscriptionsService | null) => (webhook: PurchaselySubscriptionWebhookDomain): Promise<PurchaselySubscriptionDomain | null> => {
  if (service === null) {
    return Promise.resolve(null);
  }

  const userId =
    webhook.user.vendor_id !== undefined && webhook.user.vendor_id !== null
      ? webhook.user.vendor_id
      : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      webhook.user.anonymous_id!;

  const subscription: PurchaselySubscriptionDomain = {
    id: `${userId}-${webhook.properties.product.vendor_id}`,
    user: webhook.user,
    properties: {
      product: webhook.properties.product,
      app: webhook.properties.app,
      expires_at: DateTime.fromISO(webhook.properties.expires_at),
      purchased_at: DateTime.fromISO(webhook.properties.purchased_at),
    },
    is_subscribed: webhook.name !== PurchaselyEventName.SUBSCRIPTION_EXPIRED,
    received_at: DateTime.fromISO(webhook.received_at),
  };

  return service.create(subscription.id, subscription);
};

export const purchaselySubscriptionEventController = (ajv: Ajv) => (services: Services) => (request: Request): Promise<void> => {
  if (!ajv.validate(PurchaselySubscriptionWebhookDtoSchema, request.body)) {
    return Promise.reject(ajv.errors);
  }
  const requestDto = request.body as PurchaselySubscriptionWebhookDomain;

  return Promise.all([
    saveSubscriptionEvent(services.events)(requestDto)
      .catch((error) => {
        services.logs.logger.error("Events Destination Failed, with: ", error);
        return Promise.reject(error);
      }),
    saveFirebaseCustomClaims(services.firebaseCustomClaims)(requestDto)
      .catch((error) => {
        services.logs.logger.error("Custom Claims Destination Failed, with: ", error);
        return null;
      }),
    saveSubscription(services.subscriptions)(requestDto)
      .catch((error) => {
        services.logs.logger.error("Subscriptions Destination Failed, with: ", error);
        return Promise.reject(error);
      }),
  ])
    .then(([savedEvent, userCustomClaims, savedSubscription]) => {
      const loggedResult = {
        savedEvent,
        savedSubscription,
        userCustomClaims,
        userId: requestDto.user.vendor_id === undefined ? null : requestDto.user.vendor_id,
      };
      services.logs.logger.info("Result: ", JSON.stringify(loggedResult));
      return
    })
}