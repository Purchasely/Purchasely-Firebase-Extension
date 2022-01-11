
import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";
import Firestore from "@google-cloud/firestore"
import { PurchaselyEventDomain } from "../../../../src/v3/purchasely-events/domain/purchasely-event.domain"
import { PurchaselyProductPlanType } from "../../../../src/v3/purchasely-events/domain/purchasely-product-plan-type.enum";
import { PurchaselyStore } from "../../../../src/v3/purchasely-events/domain/purchasely-store.enum";
import { PurchaselyEventName } from "../../../../src/v3/purchasely-events/domain/purchasely-event-name.enum";

export const eventsFactory: () => PurchaselyEventDomain = () => ({
  id: uuid(),
  api_version: 3,
  effective_next_renewal_at: DateTime.now().plus({ hours: 12 }),
  effective_next_renewal_at_ms: DateTime.now().plus({ hours: 12 }).toMillis(),
  environment: "SANDBOX",
  event_name: PurchaselyEventName.ACTIVATE,
  event_created_at: DateTime.now(),
  event_created_at_ms: DateTime.now().toMillis(),
  product: uuid(),
  purchase_type: PurchaselyProductPlanType.RENEWING_SUBSCRIPTION,
  purchased_at: DateTime.now().minus({ minutes: 5 }),
  purchased_at_ms: DateTime.now().minus({ minutes: 5 }).toMillis(),
  store: PurchaselyStore.APPLE_APP_STORE,
  store_app_bundle_id: uuid(),
  store_country: "FR",
  store_original_transaction_id: uuid(),
  store_product_id: uuid(),
  store_transaction_id: uuid(),
  user_id: uuid(),
})

export const firestoreEventToStringDateEvent = (event: Firestore.DocumentData | undefined) => ({
  ...event,
  effective_next_renewal_at: event?.effective_next_renewal_at.toDate().toISOString(),
  event_created_at: event?.event_created_at.toDate().toISOString(),
  purchased_at: event?.purchased_at.toDate().toISOString(),
})

