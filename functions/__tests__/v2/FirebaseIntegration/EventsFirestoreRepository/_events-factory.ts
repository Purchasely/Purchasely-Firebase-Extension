
import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";
import Firestore from "@google-cloud/firestore"
import { PurchaselyEventDomain } from "../../../../src/v2/purchasely-events/domain/purchasely-event.domain"
import { PurchaselyProductPlanType } from "../../../../src/v2/purchasely-events/domain/purchasely-product-plan-type.enum";
import { PurchaselyAppPlatform } from "../../../../src/v2/purchasely-events/domain/purchasely-app-platform.enum";
import { PurchaselyStore } from "../../../../src/v2/purchasely-events/domain/purchasely-store.enum";
import { PurchaselyEventName } from "../../../../src/v2/purchasely-events/domain/purchasely-event-name.enum";

export const eventsFactory: () => PurchaselyEventDomain = () => ({
  id: uuid(),
  name: PurchaselyEventName.PURCHASE_VALIDATED,
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
    store: PurchaselyStore.APPLE_APP_STORE,
    app: {
      platform: PurchaselyAppPlatform.IOS,
      package_id: uuid(),
    },
    purchased_at: DateTime.now(),
    expires_at: DateTime.now().plus({ hours: 12 }),
  },
  received_at: DateTime.now()
})

export const firestoreEventToStringDateEvent = (event: Firestore.DocumentData | undefined) => ({
  ...event,
  properties: {
    ...event?.properties,
    purchased_at: event?.properties.purchased_at.toDate().toISOString(),
    expires_at: event?.properties.expires_at.toDate().toISOString(),
  },
  received_at: event?.received_at.toDate().toISOString(),
})