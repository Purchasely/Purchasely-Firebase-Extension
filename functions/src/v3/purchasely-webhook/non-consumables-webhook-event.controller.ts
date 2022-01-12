import Ajv from "ajv";
import { Request } from "express";
import { PurchaselyNonConsumableWebhookDomain } from "./domain/purchasely-non-consumable-webhook.domain";
import { PurchaselyWebhookDtoSchema } from "./dto/webhook.dto";

import { PurchaselyEventsServiceInterface as EventsService } from "../purchasely-events/service";
import { PurchaselyNonConsumablesServiceInterface as NonConsumablesService } from "../purchasely-non-consumables/service";
import {
  PurchaselyEventDomain,
  PurchaselyEventName,
  PurchaselyProductPlanType
} from "../purchasely-events/domain";
import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";
import { PurchaselyNonConsumableDomain } from "../purchasely-non-consumables/domain/purchasely-non-consumable.domain";

import { Services } from "../../utils/types/services.type"
import { appPlatformFromStore } from "../../utils/types/app-platform";

export const deleteNonConsumable = (service: NonConsumablesService | null) => (webhook: PurchaselyNonConsumableWebhookDomain): Promise<void> => {
  if (service === null) {
    return Promise.resolve();
  }
  else if (webhook.event_name !== PurchaselyEventName.DEACTIVATE) {
    return Promise.resolve();
  }

  const userId =
    webhook.user_id !== undefined && webhook.user_id !== null
      ? webhook.user_id
      : webhook.anonymous_user_id;
  
  const nonConsumableId = `${userId}-${webhook.product}`;

  return service.delete(nonConsumableId);
};

export const saveNonConsumableEvent = (service: EventsService | null) => (webhook: PurchaselyNonConsumableWebhookDomain): Promise<PurchaselyEventDomain | null> => {
  if (service === null) {
    console.log("Service is null");
    return Promise.resolve(null);
  }

  const dateFromOptionalDateString = (dateString?: string): DateTime | undefined => dateString === undefined ? undefined : DateTime.fromISO(dateString);

  var event: PurchaselyEventDomain = {
    id: uuid(),
    ...webhook,
    event_created_at: DateTime.fromISO(webhook.event_created_at),
    original_purchased_at: dateFromOptionalDateString(webhook.original_purchased_at),
    purchased_at: DateTime.fromISO(webhook.purchased_at),
  };
  return service.create(event.id, event);
};

export const saveNonConsumable = (service: NonConsumablesService | null) => (webhook: PurchaselyNonConsumableWebhookDomain): Promise<PurchaselyNonConsumableDomain | null> => {
  if (service === null) {
    return Promise.resolve(null);
  }
  else if (webhook.event_name !== PurchaselyEventName.ACTIVATE) {
    return Promise.resolve(null);
  }

  const userId =
    webhook.user_id !== undefined && webhook.user_id !== null
      ? webhook.user_id
      : webhook.anonymous_user_id;

  const nonConsumable: PurchaselyNonConsumableDomain = {
    id: `${userId}-${webhook.product}`,
    user: {
      vendor_id: webhook.user_id
    },
    properties: {
      product: {
        vendor_id: webhook.product,
        plan: {
          type: PurchaselyProductPlanType.NON_CONSUMABLE,
          vendor_id: webhook.plan
        }
      },
      app: {
        platform: appPlatformFromStore(webhook.store),
        package_id: webhook.store_app_bundle_id
      },
      purchased_at: DateTime.fromISO(webhook.purchased_at),
    },
    received_at: DateTime.fromISO(webhook.event_created_at),
  };
  return service.create(nonConsumable.id, nonConsumable);
};

export const purchaselyNonConsumableEventController = (ajv: Ajv) => (services: Services) => (request: Request): Promise<void> => {
  if (!ajv.validate(PurchaselyWebhookDtoSchema, request.body)) {
    return Promise.reject(ajv.errors);
  }
  const requestDto = request.body as PurchaselyNonConsumableWebhookDomain;

  return Promise.all([
    deleteNonConsumable(services.events)(requestDto)
    .catch((error) => {
      services.logs.logger.error("Events Destination Failed, with: ", error);
      return Promise.reject(error);
    }),
    saveNonConsumableEvent(services.events)(requestDto)
      .catch((error) => {
        services.logs.logger.error("Events Destination Failed, with: ", error);
        return Promise.reject(error);
      }),
    saveNonConsumable(services.nonConsumables)(requestDto)
      .catch((error) => {
        services.logs.logger.error("NonConsumables Destination Failed, with: ", error);
        return Promise.reject(error);
      })
  ])
    .then(([_, savedEvent, savedNonConsumable]) => {
      const loggedResult = {
        savedEvent,
        savedNonConsumable,
        userId: requestDto.user_id === undefined ? null : requestDto.user_id,
      };
      services.logs.logger.info("Webhook - NonConsumable - Result: ", JSON.stringify(loggedResult));
      return
    })
}