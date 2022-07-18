
import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";
import Firestore from "@google-cloud/firestore"
import { PurchaselySubscriptionDomain } from "../../../../src/v3/purchasely-subscriptions/domain/purchasely-subscription.domain"
import { PurchaselyProductPlanType } from "../../../../src/v3/purchasely-events/domain/purchasely-product-plan-type.enum";
import { PurchaselyAppPlatform } from "../../../../src/v3/purchasely-events/domain/purchasely-app-platform.enum";

export const subscriptionsFactory: () => PurchaselySubscriptionDomain = () => ({
  id: uuid(),
  user: {
    anonymous_id: null,
    vendor_id: uuid(),
  },
  properties: {
    product: {
      vendor_id: uuid(),
      plan: {
        type: PurchaselyProductPlanType.RENEWING_SUBSCRIPTION,
        vendor_id: uuid(),
      },
    },
    app: {
      platform: PurchaselyAppPlatform.IOS,
      package_id: uuid(),
    },
    purchased_at: DateTime.now(),
    expires_at: DateTime.now().plus({ hours: 12 }),
  },
  is_subscribed: true,
  received_at: DateTime.now()
})

export const firestoreSubscriptionToStringDateSubscription = (subscription: Firestore.DocumentData | undefined) => ({
  ...subscription,
  properties: {
    ...subscription?.properties,
    purchased_at: subscription?.properties.purchased_at.toDate().toISOString(),
    expires_at: subscription?.properties.expires_at.toDate().toISOString(),
  },
  received_at: subscription?.received_at.toDate().toISOString(),
})