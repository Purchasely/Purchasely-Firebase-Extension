import test from "ava";
import { DateTime } from "luxon";

import { defaultSubscriptionEvent as defaultWebhookEvent } from "../../_webhookEventFactory";

import { purchaselyWebhookToEventMapper } from '../../../../src/v3/purchasely-webhook/properties-mapper';
import { PurchaselyEventName, PurchaselyOfferType, PurchaselyProductPlanType, PurchaselyStore } from "../../../../src/v3/purchasely-events";

test("Event saving returns null if service is null", async t => {
  const event = defaultWebhookEvent();
  const mappedEvent = purchaselyWebhookToEventMapper(event);
	const expectedResult = {
		id: mappedEvent.id,
		anonymous_user_id: null,
		api_version: 3,
		auto_resume_at: null,
		auto_resume_at_ms: null,
		content_id: null,
		defer_end_at: null,
		defer_end_at_ms: null,
		environment: "SANDBOX",
		event_name: PurchaselyEventName.ACTIVATE,
		event_created_at: DateTime.fromISO(event.event_created_at),
		event_created_at_ms: event.event_created_at_ms,
		effective_next_renewal_at: DateTime.fromISO(event.effective_next_renewal_at as string),
		effective_next_renewal_at_ms: event.effective_next_renewal_at_ms as number,
		grace_period_expires_at: null,
		grace_period_expires_at_ms: null,
		is_family_shared: null,
		next_renewal_at: null,
		next_renewal_at_ms: null,
		original_purchased_at: DateTime.fromISO(event.original_purchased_at),
		original_purchased_at_ms: event.original_purchased_at_ms,
		plan: event.plan,
		offer_type: PurchaselyOfferType.NONE,
		previous_offer_type: null,
		previous_plan: null,
		product: event.product,
		purchase_type: PurchaselyProductPlanType.RENEWING_SUBSCRIPTION,
		purchased_at: DateTime.fromISO(event.purchased_at),
		purchased_at_ms: event.purchased_at_ms,
		purchasely_subscription_id: event.purchasely_subscription_id,
		store: PurchaselyStore.APPLE_APP_STORE,
		store_app_bundle_id:event.store_app_bundle_id,
		store_country: "FR",
		store_original_transaction_id: event.store_original_transaction_id,
		store_product_id: event.store_product_id,
		store_transaction_id: event.store_transaction_id,
		subscription_status: null,
		transferred_from_user_id: null,
		transferred_to_user_id: null,
		transferred_from_anonymous_user_id: null,
		transferred_to_anonymous_user_id: null,
		user_id: event.user_id as string,
	}
  t.deepEqual(mappedEvent as any, expectedResult);
});
