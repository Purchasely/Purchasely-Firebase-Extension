import Ajv from "ajv";
import { Request } from "express";
import { PurchaselyNonConsumableWebhookDomain } from "./domain/purchasely-non-consumable-webhook.domain";
import { PurchaselyNonSubscriptionWebhookDtoSchema } from "./dto/non-subscription-webhook.dto";

import { PurchaselyEventsServiceInterface as EventsService } from "../purchasely-events/service";
import { PurchaselyNonConsumablesServiceInterface as NonConsumablesService } from "../purchasely-non-consumables/service";
import { PurchaselyEventDomain } from "../purchasely-events/domain/purchasely-event.domain";
import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";
import { PurchaselyNonConsumableDomain } from "../purchasely-non-consumables/domain/purchasely-non-consumable.domain";

import { Services } from "../utils/types/services.type"

export const saveNonConsumableEvent = (service: EventsService | null) => (webhook: PurchaselyNonConsumableWebhookDomain): Promise<PurchaselyEventDomain | null> => {
  if (service === null) {
    console.log("Service is null");
    return Promise.resolve(null);
  }

  var event: PurchaselyEventDomain = {
    id: uuid(),
    ...webhook,
    properties: {
      ...webhook.properties,
      purchased_at: DateTime.fromISO(webhook.properties.purchased_at),
    },
    received_at: DateTime.fromISO(webhook.received_at),
  };
  return service.create(event.id, event);
};

export const saveNonConsumable = (service: NonConsumablesService | null) => (webhook: PurchaselyNonConsumableWebhookDomain): Promise<PurchaselyNonConsumableDomain | null> => {
  if (service === null) {
    return Promise.resolve(null);
  }

  const nonConsumable: PurchaselyNonConsumableDomain = {
    id: uuid(),
    user: webhook.user,
    properties: {
      product: webhook.properties.product,
      app: webhook.properties.app,
      purchased_at: DateTime.fromISO(webhook.properties.purchased_at),
    },
    received_at: DateTime.fromISO(webhook.received_at),
  };

  return service.create(nonConsumable.id, nonConsumable);
};

export const purchaselyNonConsumableEventController = (ajv: Ajv) => (services: Services) => (request: Request): Promise<void> => {
  if (!ajv.validate(PurchaselyNonSubscriptionWebhookDtoSchema, request.body)) {
    return Promise.reject(ajv.errors);
  }
  const requestDto = request.body as PurchaselyNonConsumableWebhookDomain;

  return Promise.all([
    saveNonConsumableEvent(services.events)(requestDto)
      .catch((error) => {
        services.logs.logger.error("Events Destination Failed, with: ", error);
        return Promise.reject(error);
      }),
    saveNonConsumable(services.nonConsumables)(requestDto)
      .catch((error) => {
        services.logs.logger.error("NonConsumables Destination Failed, with: ", error);
        return Promise.reject(error);
      }),
  ])
    .then(([savedEvent, savedNonConsumable]) => {
      const loggedResult = {
        savedEvent,
        savedNonConsumable,
        userId: requestDto.user.vendor_id === undefined ? null : requestDto.user.vendor_id,
      };
      services.logs.logger.info("Webhook - NonConsumable - Result: ", JSON.stringify(loggedResult));
      return
    })
}