
import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";
import Firestore from "@google-cloud/firestore"
import { PurchaselyNonConsumableDomain } from "../../../../src/v2/purchasely-non-consumables/domain/purchasely-non-consumable.domain"
import { PurchaselyProductPlanType } from "../../../../src/v2/purchasely-events/domain/purchasely-product-plan-type.enum";
import { PurchaselyAppPlatform } from "../../../../src/v2/purchasely-events/domain/purchasely-app-platform.enum";

export const nonConsumablesFactory: () => PurchaselyNonConsumableDomain = () => ({
  id: uuid(),
  user: {
    vendor_id: uuid(),
  },
  properties: {
    product: {
      vendor_id: uuid(),
      plan: {
        type: PurchaselyProductPlanType.NON_CONSUMABLE,
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

export const firestoreNonConsumableToStringDateNonConsumable = (nonConsumable: Firestore.DocumentData | undefined) => ({
  ...nonConsumable,
  properties: {
    ...nonConsumable?.properties,
    purchased_at: nonConsumable?.properties.purchased_at.toDate().toISOString(),
  },
  received_at: nonConsumable?.received_at.toDate().toISOString(),
})