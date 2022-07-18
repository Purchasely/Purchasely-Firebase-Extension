
import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";
import Firestore from "@google-cloud/firestore"
import { PurchaselyEventDomain } from "../../../../src/v3/purchasely-events/domain/purchasely-event.domain"
import { PurchaselyProductPlanType } from "../../../../src/v3/purchasely-events/domain/purchasely-product-plan-type.enum";
import { PurchaselyStore } from "../../../../src/v3/purchasely-events/domain/purchasely-store.enum";
import { PurchaselyEventName } from "../../../../src/v3/purchasely-events/domain/purchasely-event-name.enum";

export const eventsFactory: () => PurchaselyEventDomain = () => ({
  id: uuid(),
  anonymous_user_id: null,
  api_version: 3,
  auto_resume_at: null,
  auto_resume_at_ms: null,
  content_id: null,
  defer_end_at: null,
  defer_end_at_ms: null,
  environment: "SANDBOX",
  event_name: PurchaselyEventName.ACTIVATE,
  event_created_at: DateTime.now(),
  event_created_at_ms: DateTime.now().toMillis(),
  effective_next_renewal_at: DateTime.now().plus({ hours: 12 }),
  effective_next_renewal_at_ms: DateTime.now().plus({ hours: 12 }).toMillis(),
  grace_period_expires_at: null,
  grace_period_expires_at_ms: null,
  is_family_shared: null,
  next_renewal_at: null,
  next_renewal_at_ms: null,
  original_purchased_at: null,
  original_purchased_at_ms: null,
  plan: uuid(),
  offer_type: null,
  previous_offer_type: null,
  previous_plan: null,
  product: uuid(),
  purchase_type: PurchaselyProductPlanType.RENEWING_SUBSCRIPTION,
  purchased_at: DateTime.now().minus({ minutes: 5 }),
  purchased_at_ms: DateTime.now().minus({ minutes: 5 }).toMillis(),
  purchasely_one_time_purchase_id: null,
  purchasely_subscription_id: null,
  store: PurchaselyStore.APPLE_APP_STORE,
  store_app_bundle_id: uuid(),
  store_country: "FR",
  store_original_transaction_id: uuid(),
  store_product_id: uuid(),
  store_transaction_id: uuid(),
  subscription_status: null,
  transferred_from_user_id: null,
  transferred_to_user_id: null,
  transferred_from_anonymous_user_id: null,
  transferred_to_anonymous_user_id: null,
  user_id: uuid(),
})

export const firestoreEventToStringDateEvent = (event: Firestore.DocumentData | undefined) => ({
  ...event,
  effective_next_renewal_at: event?.effective_next_renewal_at.toDate().toISOString(),
  event_created_at: event?.event_created_at.toDate().toISOString(),
  purchased_at: event?.purchased_at.toDate().toISOString(),
})

