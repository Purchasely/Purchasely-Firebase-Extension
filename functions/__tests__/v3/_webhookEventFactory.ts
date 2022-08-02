import { v4 as uuid } from "uuid";

import {
  PurchaselyEventName,
  PurchaselyOfferType,
  PurchaselyProductPlanType,
  PurchaselyStore
} from "../../src/v3/purchasely-events/domain";
import { PurchaselySubscriptionWebhookDomain } from "../../src/v3/purchasely-webhook/domain/purchasely-subscription-webhook.domain";
import { PurchaselyConsumableWebhookDomain } from "../../src/v3/purchasely-webhook/domain/purchasely-consumable-webhook.domain";
import { PurchaselyNonConsumableWebhookDomain } from "../../src/v3/purchasely-webhook/domain/purchasely-non-consumable-webhook.domain";

export const subscriptionWebhookEventFactory = (eventName: PurchaselyEventName) =>
  (offerType: PurchaselyOfferType) =>
    (store: PurchaselyStore) =>
      (createdAt: Date = new Date()) =>
        (purchasedAt: Date = new Date()): PurchaselySubscriptionWebhookDomain => {
            return {
              anonymous_user_id: undefined,
              auto_resume_at: undefined,
              auto_resume_at_ms: undefined,
              content_id: undefined,
              defer_end_at: undefined,
              defer_end_at_ms: undefined,
              grace_period_expires_at: undefined,
              grace_period_expires_at_ms: undefined,
              is_family_shared: undefined,
              next_renewal_at: undefined,
              next_renewal_at_ms: undefined,
              previous_offer_type: undefined,
              previous_plan: undefined,
              subscription_status: undefined,
              transferred_from_user_id: undefined,
              transferred_to_user_id: undefined,
              transferred_from_anonymous_user_id: undefined,
              transferred_to_anonymous_user_id: undefined,
              api_version: 3,
              effective_next_renewal_at: (new Date()).toISOString(),
              effective_next_renewal_at_ms: (new Date()).getTime(),
              environment: "SANDBOX",
              event_name: eventName,
              event_created_at: createdAt.toISOString(),
              event_created_at_ms: createdAt.getTime(),
              offer_type: offerType,
              original_purchased_at: purchasedAt.toISOString(),
              original_purchased_at_ms: purchasedAt.getTime(),
              plan: uuid(),
              product: uuid(),
              purchase_type: PurchaselyProductPlanType.RENEWING_SUBSCRIPTION,
              purchased_at: purchasedAt.toISOString(),
              purchased_at_ms: purchasedAt.getTime(),
              purchasely_subscription_id: uuid(),
              store: store,
              store_app_bundle_id: uuid(),
              store_country: "FR",
              store_original_transaction_id: uuid(),
              store_product_id: uuid(),
              store_transaction_id: uuid(),
              user_id: uuid(),
            }
          }

export const consumableWebhookEventFactory = (eventName: PurchaselyEventName) =>
  (store: PurchaselyStore) =>
    (purchasedAt: Date = new Date()) =>
      (createdAt: Date = new Date()): PurchaselyConsumableWebhookDomain => {
        return {
          api_version: 3,
          environment: "SANDBOX",
          event_name: eventName,
          event_created_at: createdAt.toISOString(),
          event_created_at_ms: createdAt.getTime(),
          original_purchased_at: purchasedAt.toISOString(),
          original_purchased_at_ms: purchasedAt.getTime(),
          plan: uuid(),
          product: uuid(),
          purchase_type: PurchaselyProductPlanType.CONSUMABLE,
          purchased_at: purchasedAt.toISOString(),
          purchased_at_ms: purchasedAt.getTime(),
          purchasely_one_time_purchase_id: uuid(),
          store: store,
          store_app_bundle_id: uuid(),
          store_country: "FR",
          store_original_transaction_id: uuid(),
          store_product_id: uuid(),
          store_transaction_id: uuid(),
          user_id: uuid(),
        }
      }

export const nonConsumableWebhookEventFactory = (eventName: PurchaselyEventName) =>
  (store: PurchaselyStore) =>
    (purchasedAt: Date = new Date()) =>
      (createdAt: Date = new Date()): PurchaselyNonConsumableWebhookDomain => {
        return {
          api_version: 3,
          environment: "SANDBOX",
          event_name: eventName,
          event_created_at: createdAt.toISOString(),
          event_created_at_ms: createdAt.getTime(),
          original_purchased_at: purchasedAt.toISOString(),
          original_purchased_at_ms: purchasedAt.getTime(),
          plan: uuid(),
          product: uuid(),
          purchase_type: PurchaselyProductPlanType.NON_CONSUMABLE,
          purchased_at: purchasedAt.toISOString(),
          purchased_at_ms: purchasedAt.getTime(),
          purchasely_one_time_purchase_id: uuid(),
          store: store,
          store_app_bundle_id: uuid(),
          store_country: "FR",
          store_original_transaction_id: uuid(),
          store_product_id: uuid(),
          store_transaction_id: uuid(),
          user_id: uuid(),
        }
      }

export const defaultSubscriptionEvent = () => subscriptionWebhookEventFactory(PurchaselyEventName.ACTIVATE)(PurchaselyOfferType.NONE)(PurchaselyStore.APPLE_APP_STORE)()();
export const expiredSubscriptionEvent = () => subscriptionWebhookEventFactory(PurchaselyEventName.DEACTIVATE)(PurchaselyOfferType.NONE)(PurchaselyStore.APPLE_APP_STORE)()();

export const defaultConsumableEvent = () => consumableWebhookEventFactory(PurchaselyEventName.ACTIVATE)(PurchaselyStore.APPLE_APP_STORE)()();
export const defaultNonConsumableEvent = () => nonConsumableWebhookEventFactory(PurchaselyEventName.ACTIVATE)(PurchaselyStore.APPLE_APP_STORE)()();
export const refundedNonConsumableEvent = () => nonConsumableWebhookEventFactory(PurchaselyEventName.DEACTIVATE)(PurchaselyStore.APPLE_APP_STORE)()();