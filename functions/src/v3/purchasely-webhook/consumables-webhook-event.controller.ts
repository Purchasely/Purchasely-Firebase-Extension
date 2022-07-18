import Ajv from "ajv";
import { Request } from "express";
import { PurchaselyConsumableWebhookDomain } from "./domain/purchasely-consumable-webhook.domain";
import { PurchaselyWebhookDtoSchema } from "./dto/webhook.dto";

import { PurchaselyEventsServiceInterface as EventsService } from "../purchasely-events/service";
import { PurchaselyConsumablesServiceInterface as ConsumablesService } from "../purchasely-consumables/service";
import {
  PurchaselyEventDomain,
  PurchaselyEventName,
  PurchaselyProductPlanType,
} from "../purchasely-events/domain";
import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";
import { PurchaselyConsumableDomain } from "../purchasely-consumables/domain/purchasely-consumable.domain";

import { Services } from "../services.type"
import { appPlatformFromStore } from "../../utils/types/app-platform";
import {
  purchaselyEventPropertiesMapper,
  purchaselyWebhookToEventMapper
} from "./properties-mapper"

export const saveConsumableEvent = (service: EventsService | null) => (webhook: PurchaselyConsumableWebhookDomain): Promise<PurchaselyEventDomain | null> => {
  if (service === null) {
    console.log("Service is null");
    return Promise.resolve(null);
  }

  const event: PurchaselyEventDomain = purchaselyWebhookToEventMapper(webhook);
  return service.create(event.id, event);
};

export const saveConsumable = (service: ConsumablesService | null) => (webhook: PurchaselyConsumableWebhookDomain): Promise<PurchaselyConsumableDomain | null> => {
  if (service === null) {
    return Promise.resolve(null);
  }
  else if (webhook.event_name !== PurchaselyEventName.ACTIVATE) {
    return Promise.resolve(null);
  }

  const consumable: PurchaselyConsumableDomain = {
    id: uuid(),
    user: {
      anonymous_id: null,
      vendor_id: <string>purchaselyEventPropertiesMapper("user_id", webhook.user_id)
    },
    properties: {
      product: {
        vendor_id: webhook.product,
        plan: {
          type: PurchaselyProductPlanType.CONSUMABLE,
          vendor_id: webhook.plan
        }
      },
      app: {
        platform: appPlatformFromStore(webhook.store),
        package_id: webhook.store_app_bundle_id
      },
      purchased_at: <DateTime>purchaselyEventPropertiesMapper("purchased_at", webhook.purchased_at),
    },
    received_at: <DateTime>purchaselyEventPropertiesMapper("received_at", webhook.event_created_at),
  };

  return service.create(consumable.id, consumable);
};

export const purchaselyConsumableEventController = (ajv: Ajv) => (services: Services) => (request: Request): Promise<void> => {
  if (!ajv.validate(PurchaselyWebhookDtoSchema, request.body)) {
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
        userId: requestDto.user_id === undefined ? null : requestDto.user_id,
      };
      services.logs.logger.info("Webhook - Consumable - Result: ", JSON.stringify(loggedResult));
      return
    })
}