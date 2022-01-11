import { v4 as uuid } from "uuid";
import { PurchaselyAppPlatform } from "../../src/v2/purchasely-events/domain/purchasely-app-platform.enum";

import { PurchaselyEventName } from "../../src/v2/purchasely-events/domain/purchasely-event-name.enum";
import { PurchaselyProductPlanType } from "../../src/v2/purchasely-events/domain/purchasely-product-plan-type.enum";
import { PurchaselyStore } from "../../src/v2/purchasely-events/domain/purchasely-store.enum";
import { PurchaselySubscriptionWebhookDomain } from "../../src/v2/purchasely-webhook/domain/purchasely-subscription-webhook.domain";
import { PurchaselyConsumableWebhookDomain } from "../../src/v2/purchasely-webhook/domain/purchasely-consumable-webhook.domain";
import { PurchaselyNonConsumableWebhookDomain } from "../../src/v2/purchasely-webhook/domain/purchasely-non-consumable-webhook.domain";

export const subscriptionWebhookEventFactory = (eventName: PurchaselyEventName) =>
  (productPlanType: PurchaselyProductPlanType.RENEWING_SUBSCRIPTION | PurchaselyProductPlanType.NON_RENEWING_SUBSCRIPTION) =>
    (store: PurchaselyStore) => (appPlatform: PurchaselyAppPlatform) =>
      (expiresAt: Date = new Date()) =>
        (purchasedAt: Date = new Date()) =>
          (receivedAt: Date = new Date()): PurchaselySubscriptionWebhookDomain => {
            return {
              name: eventName,
              user: {
                vendor_id: uuid()
              },
              properties: {
                product: {
                  vendor_id: uuid(),
                  plan: {
                    type: productPlanType,
                    vendor_id: uuid(),
                  },
                },
                store,
                app: {
                  platform: appPlatform,
                  package_id: uuid(),
                },
                expires_at: expiresAt.toISOString(),
                purchased_at: purchasedAt.toISOString(),
              },
              received_at: receivedAt.toISOString(),
            }
          }

export const consumableWebhookEventFactory = (eventName: PurchaselyEventName) =>
  (store: PurchaselyStore) => (appPlatform: PurchaselyAppPlatform) =>
    (purchasedAt: Date = new Date()) =>
      (receivedAt: Date = new Date()): PurchaselyConsumableWebhookDomain => {
        return {
          name: eventName,
          user: {
            vendor_id: uuid()
          },
          properties: {
            product: {
              vendor_id: uuid(),
              plan: {
                type: PurchaselyProductPlanType.CONSUMABLE,
                vendor_id: uuid(),
              },
            },
            store,
            app: {
              platform: appPlatform,
              package_id: uuid(),
            },
            purchased_at: purchasedAt.toISOString(),
          },
          received_at: receivedAt.toISOString(),
        }
      }

export const nonConsumableWebhookEventFactory = (eventName: PurchaselyEventName) =>
  (store: PurchaselyStore) => (appPlatform: PurchaselyAppPlatform) =>
    (purchasedAt: Date = new Date()) =>
      (receivedAt: Date = new Date()): PurchaselyNonConsumableWebhookDomain => {
        return {
          name: eventName,
          user: {
            vendor_id: uuid()
          },
          properties: {
            product: {
              vendor_id: uuid(),
              plan: {
                type: PurchaselyProductPlanType.NON_CONSUMABLE,
                vendor_id: uuid(),
              },
            },
            store,
            app: {
              platform: appPlatform,
              package_id: uuid(),
            },
            purchased_at: purchasedAt.toISOString(),
          },
          received_at: receivedAt.toISOString(),
        }
      }

export const defaultSubscriptionEvent = () => subscriptionWebhookEventFactory(PurchaselyEventName.PURCHASE_VALIDATED)(PurchaselyProductPlanType.RENEWING_SUBSCRIPTION)(PurchaselyStore.APPLE_APP_STORE)(PurchaselyAppPlatform.IOS)()()();
export const expiredSubscriptionEvent = () => subscriptionWebhookEventFactory(PurchaselyEventName.SUBSCRIPTION_EXPIRED)(PurchaselyProductPlanType.RENEWING_SUBSCRIPTION)(PurchaselyStore.APPLE_APP_STORE)(PurchaselyAppPlatform.IOS)()()();

export const defaultConsumableEvent = () => consumableWebhookEventFactory(PurchaselyEventName.PURCHASE_VALIDATED)(PurchaselyStore.APPLE_APP_STORE)(PurchaselyAppPlatform.IOS)()();
export const defaultNonConsumableEvent = () => nonConsumableWebhookEventFactory(PurchaselyEventName.PURCHASE_VALIDATED)(PurchaselyStore.APPLE_APP_STORE)(PurchaselyAppPlatform.IOS)()();