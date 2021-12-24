import Ajv from "ajv";
import { Request } from "express";
import { PurchaselyConsumableWebhookDomain } from "./domain/purchasely-consumable-webhook.domain";
import { PurchaselyNonSubscriptionWebhookDtoSchema } from "./dto/non-subscription-webhook.dto";

import { PurchaselyEventsServiceInterface as EventsService } from "../purchasely-events/service";
import { PurchaselyConsumablesServiceInterface as ConsumablesService } from "../purchasely-consumables/service";
import { PurchaselyEventDomain } from "../purchasely-events/domain/purchasely-event.domain";
import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";
import { PurchaselyConsumableDomain } from "../purchasely-consumables/domain/purchasely-consumable.domain";

import { Services } from "../utils/types/services.type"

export const saveConsumableEvent = (service: EventsService | null) => (webhook: PurchaselyConsumableWebhookDomain): Promise<PurchaselyEventDomain | null> => {
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

export const saveConsumable = (service: ConsumablesService | null) => (webhook: PurchaselyConsumableWebhookDomain): Promise<PurchaselyConsumableDomain | null> => {
  if (service === null) {
    return Promise.resolve(null);
  }

  const consumable: PurchaselyConsumableDomain = {
    id: uuid(),
    user: webhook.user,
    properties: {
      product: webhook.properties.product,
      app: webhook.properties.app,
      purchased_at: DateTime.fromISO(webhook.properties.purchased_at),
    },
    received_at: DateTime.fromISO(webhook.received_at),
  };

  return service.create(consumable.id, consumable);
};

export const purchaselyConsumableEventController = (ajv: Ajv) => (services: Services) => (request: Request): Promise<void> => {
  if (!ajv.validate(PurchaselyNonSubscriptionWebhookDtoSchema, request.body)) {
    return Promise.reject(ajv.errors);
  }
  const requestDto = request.body as PurchaselyConsumableWebhookDomain;

  return Promise.all([
    saveConsumableEvent(services.events)(requestDto)
      .catch((error) => {
        services.logs.logger.error("Events Destination Failed, with: ", error);
        return Promise.reject(error);
      }),
    saveConsumable(services.consumables)(requestDto)
      .catch((error) => {
        services.logs.logger.error("Consumables Destination Failed, with: ", error);
        return Promise.reject(error);
      }),
  ])
    .then(([savedEvent, savedConsumable]) => {
      const loggedResult = {
        savedEvent,
        savedConsumable,
        userId: requestDto.user.vendor_id === undefined ? null : requestDto.user.vendor_id,
      };
      services.logs.logger.info("Webhook - Consumable - Result: ", JSON.stringify(loggedResult));
      return
    })
}