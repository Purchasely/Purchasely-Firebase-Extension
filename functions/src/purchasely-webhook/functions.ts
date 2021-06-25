import Ajv from "ajv";
import Crypto from "crypto";
import { Request, Response } from "express";
import { PurchaselyWebhookDomain } from "./domain/purchasely-webhook.domain";
import { PurchaselyWebhookDtoSchema } from "./dto/webhook.dto";

import { PurchaselyEventsServiceInterface as EventsService } from "../purchasely-events/service";
import { PurchaselySubscriptionsServiceInterface as SubscriptionsService } from "../purchasely-subscriptions/service";
import { FirebaseCustomClaimsServiceInterface as CustomClaimsService } from "../firebase-custom-claims/service";
import { PurchaselyEventDomain } from "../purchasely-events/domain/purchasely-event.domain";
import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";
import { PurchaselySubscriptionDomain } from "../purchasely-subscriptions/domain/purchasely-subscription.domain";
import { PurchaselyEventName } from "../purchasely-events/domain/purchasely-event-name.enum";
import { PurchaselyConfigInterface } from "../purchasely.config";
import { PurchaselyFirebaseCustomClaimsDomain } from "../firebase-custom-claims/domain/purchasely-firebase-custom-claims.domain";
import { PurchaselyLoggingServiceInterface } from "../purchasely-logging/service";

const saveEvent = (service: EventsService | null) => (webhook: PurchaselyWebhookDomain): Promise<PurchaselyEventDomain | null> => {
  if (service === null) {
    console.log("Service is null");
    return Promise.resolve(null);
  }

  const event: PurchaselyEventDomain = {
    id: uuid(),
    ...webhook,
    properties: {
      ...webhook.properties,
      expires_at: DateTime.fromISO(webhook.properties.expires_at),
      purchased_at: DateTime.fromISO(webhook.properties.purchased_at),
    },
    received_at: DateTime.fromISO(webhook.received_at),
  };

  return service.create(event.id, event);
};

const saveFirebaseCustomClaims = (service: CustomClaimsService | null) => (webhook: PurchaselyWebhookDomain): Promise<PurchaselyFirebaseCustomClaimsDomain[] | null> => {
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

  return service.create(webhook.user.vendor_id, customClaims);
}

const saveSubscription = (service: SubscriptionsService | null) => (webhook: PurchaselyWebhookDomain): Promise<PurchaselySubscriptionDomain | null> => {
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

const eventHeaderSignatureIsValid = (sharedSecret: string) => (request: Request) => {
  const receivedSignature = request.get("X-PURCHASELY-SIGNATURE") as string;
  const receivedTimestamp = request.get("X-PURCHASELY-TIMESTAMP") as string;

  const dataToSign = sharedSecret + receivedTimestamp;
  const computedSignature = Crypto
    .createHmac("sha256", sharedSecret)
    .update(dataToSign)
    .digest("hex");
  return computedSignature === receivedSignature;
}

type Services = {
  events: EventsService | null;
  firebaseCustomClaims: CustomClaimsService | null;
  logs: PurchaselyLoggingServiceInterface;
  subscriptions: SubscriptionsService | null;
};

const functions: {
  [keyof: string]: (ajv: Ajv) => (config: PurchaselyConfigInterface) => (services: Services) => (request: Request, response: Response) => Promise<void>;
} = {
  purchaselyWebhookHandler: (ajv: Ajv) => (config) => (services) => async (request: Request, response: Response) => {
    if (!eventHeaderSignatureIsValid(config.sharedSecret)(request)) {
      response.status(401).send();
      return;
    }
    if (!ajv.validate(PurchaselyWebhookDtoSchema, request.body)) {
      response.status(400).send({ errors: ajv.errors });
      return;
    }
    const requestDto = request.body as PurchaselyWebhookDomain;

    return Promise.all([
      saveEvent(services.events)(requestDto)
        .catch((error) => {
          services.logs.logger.error("Events Destination Failed, with: ", error);
          return Promise.reject(error);
        }),
      // TODO: Remove once Purchasely Test Apps stop sending non firebase vendor ids
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
        const result = {
          savedEvent,
          savedSubscription,
          userCustomClaims,
          userId: requestDto.user.vendor_id === undefined ? null : requestDto.user.vendor_id,
        };
        services.logs.logger.info("Result: ", JSON.stringify(result));
        response.status(200).send(result);
      })
      .catch((error) => response.status(500).send(error))
      .then(() => {
        return;
      });
  },
};

export default functions;
