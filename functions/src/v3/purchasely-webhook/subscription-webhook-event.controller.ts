import Ajv from "ajv";
import { Request } from "express";
import { PurchaselySubscriptionWebhookDomain } from "./domain/purchasely-subscription-webhook.domain";
import { PurchaselySubscriptionsWebhookDtoSchema } from "./dto";

import { PurchaselyEventsServiceInterface as EventsService } from "../purchasely-events/service";
import { PurchaselySubscriptionsServiceInterface as SubscriptionsService } from "../purchasely-subscriptions/service";
import { FirebaseCustomClaimsServiceInterface as CustomClaimsService } from "../firebase-custom-claims/service";
import {
  PurchaselyAppPlatform,
  PurchaselyEventDomain,
  PurchaselyStore
} from "../purchasely-events/domain";
import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";
import { PurchaselySubscriptionDomain } from "../purchasely-subscriptions/domain/purchasely-subscription.domain";
import { PurchaselyEventName } from "../purchasely-events/domain/purchasely-event-name.enum";
import { PurchaselyFirebaseCustomClaimsDomain } from "../firebase-custom-claims/domain/purchasely-firebase-custom-claims.domain";

import { Services } from "../../utils/types/services.type"

export const saveSubscriptionEvent = (service: EventsService | null) => (webhook: PurchaselySubscriptionWebhookDomain): Promise<PurchaselyEventDomain | null> => {
  if (service === null) {
    console.log("Service is null");
    return Promise.resolve(null);
  }

  const dateFromOptionalDateString = (dateString?: string): DateTime | undefined => dateString === undefined ? undefined : DateTime.fromISO(dateString);

  var event: PurchaselyEventDomain = {
    id: uuid(),
    ...webhook,
    auto_resume_at: dateFromOptionalDateString(webhook.auto_resume_at),
    defer_end_at: dateFromOptionalDateString(webhook.defer_end_at),
    event_created_at: DateTime.fromISO(webhook.event_created_at),
    effective_next_renewal_at: dateFromOptionalDateString(webhook.effective_next_renewal_at),
    grace_period_expires_at: dateFromOptionalDateString(webhook.grace_period_expires_at),
    next_renewal_at: dateFromOptionalDateString(webhook.next_renewal_at),
    original_purchased_at: dateFromOptionalDateString(webhook.original_purchased_at),
    purchased_at: DateTime.fromISO(webhook.purchased_at),
  };
  return service.create(event.id, event);
};


export const saveFirebaseCustomClaims = (service: CustomClaimsService | null) => (webhook: PurchaselySubscriptionWebhookDomain): Promise<PurchaselyFirebaseCustomClaimsDomain[] | null> => {
  if (service === null) {
    return Promise.resolve(null);
  }
  if (webhook.user_id === undefined) {
    return Promise.resolve(null);
  }
  if (webhook.plan === undefined) {
    return Promise.resolve(null);
  }

  const customClaims: PurchaselyFirebaseCustomClaimsDomain[] = [{
    product: webhook.product,
    plan: webhook.plan,
  }];

  if (webhook.event_name === PurchaselyEventName.DEACTIVATE) {
    return service.delete(webhook.user_id, customClaims);
  }
  return service.create(webhook.user_id, customClaims);
}

export const saveSubscription = (service: SubscriptionsService | null) => (webhook: PurchaselySubscriptionWebhookDomain): Promise<PurchaselySubscriptionDomain | null> => {
  if (service === null) {
    return Promise.resolve(null);
  }
  else if (webhook.event_name !== PurchaselyEventName.ACTIVATE && webhook.event_name !== PurchaselyEventName.DEACTIVATE) {
    return Promise.resolve(null);
  }
  if (webhook.plan === undefined) {
    return Promise.resolve(null);
  }
  if (webhook.event_name === PurchaselyEventName.ACTIVATE && webhook.effective_next_renewal_at === undefined) {
    return Promise.resolve(null);
  }
  const userId =
    webhook.user_id !== undefined && webhook.user_id !== null
      ? webhook.user_id
      : webhook.anonymous_user_id;

  const subscription: PurchaselySubscriptionDomain = {
    id: `${userId}-${webhook.product}`,
    user: {
      vendor_id: webhook.user_id
    },
    properties: {
      product: {
        vendor_id: webhook.product,
        plan: {
          type: webhook.purchase_type,
          vendor_id: webhook.plan
        }
      },
      app: {
        platform: webhook.store === PurchaselyStore.APPLE_APP_STORE ? PurchaselyAppPlatform.IOS : PurchaselyAppPlatform.ANDROID,
        package_id: webhook.store_app_bundle_id
      },
      expires_at: DateTime.fromISO(webhook.effective_next_renewal_at as string),
      purchased_at: DateTime.fromISO(webhook.purchased_at),
    },
    is_subscribed: webhook.event_name === PurchaselyEventName.ACTIVATE,
    received_at: DateTime.fromISO(webhook.event_created_at),
  };

  return service.create(subscription.id, subscription);
};

export const purchaselySubscriptionEventController = (ajv: Ajv) => (services: Services) => (request: Request): Promise<void> => {
  if (!ajv.validate(PurchaselySubscriptionsWebhookDtoSchema, request.body)) {
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
        userId: requestDto.user_id === undefined ? null : requestDto.user_id,
      };
      services.logs.logger.info("Result: ", JSON.stringify(loggedResult));
      return
    })
}