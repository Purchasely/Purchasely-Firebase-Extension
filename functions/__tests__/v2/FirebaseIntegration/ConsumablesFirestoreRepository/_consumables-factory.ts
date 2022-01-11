
import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";
import Firestore from "@google-cloud/firestore"
import { PurchaselyConsumableDomain } from "../../../../src/v2/purchasely-consumables/domain/purchasely-consumable.domain"
import { PurchaselyProductPlanType } from "../../../../src/v2/purchasely-events/domain/purchasely-product-plan-type.enum";
import { PurchaselyAppPlatform } from "../../../../src/v2/purchasely-events/domain/purchasely-app-platform.enum";

export const consumablesFactory: () => PurchaselyConsumableDomain = () => ({
  id: uuid(),
  user: {
    vendor_id: uuid(),
  },
  properties: {
    product: {
      vendor_id: uuid(),
      plan: {
        type: PurchaselyProductPlanType.CONSUMABLE,
        vendor_id: uuid(),
      },
    },
    app: {
      platform: PurchaselyAppPlatform.IOS,
      package_id: uuid(),
    },
    purchased_at: DateTime.now(),
  },
  received_at: DateTime.now()
})

export const firestoreConsumableToStringDateConsumable = (consumable: Firestore.DocumentData | undefined) => ({
  ...consumable,
  properties: {
    ...consumable?.properties,
    purchased_at: consumable?.properties.purchased_at.toDate().toISOString(),
  },
  received_at: consumable?.received_at.toDate().toISOString(),
})