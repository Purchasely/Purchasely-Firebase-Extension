import {
  PurchaselyOfferType,
  PurchaselyStore,
  PurchaselySubscriptionStatus,
} from "../../purchasely-events";

export const PurchaselySubscriptionsWebhookDtoSchema = {
  additionalProperties: true,
  type: "object",
  properties: {
    anonymous_user_id: {
      type: "string",
    },
    api_version: {
      type: "number",
      minimum: 3
    },
    auto_resume_at: {
      type: "string",
      format: "date-time",
    },
    auto_resume_at_ms: {
      type: "number",
    },
    content_id: {
      type: "string",
    },
    defer_end_at: {
      type: "string",
      format: "date-time",
    },
    defer_end_at_ms: {
      type: "number",
    },
    environment: {
      type: "string",
    },
    event_name: {
      type: "string",
    },
    event_created_at: {
      type: "string",
      format: "date-time",
    },
    event_created_at_ms: {
      type: "number",
    },
    effective_next_renewal_at: {
      type: "string",
      format: "date-time",
    },
    effective_next_renewal_at_ms: {
      type: "number",
    },
    grace_period_expires_at: {
      type: "string",
      format: "date-time",
    },
    grace_period_expires_at_ms: {
      type: "number",
    },
    is_family_shared: {
      type: "boolean",
    },
    next_renewal_at: {
      type: "string",
      format: "date-time",
    },
    next_renewal_at_ms: {
      type: "number",
    },
    original_purchased_at: {
      type: "string",
      format: "date-time",
    },
    original_purchased_at_ms: {
      type: "number",
    },
    plan: {
      type: "string",
    },
    offer_type: {
      enum: Object.values(PurchaselyOfferType),
    },
    previous_offer_type: {
      enum: Object.values(PurchaselyOfferType),
    },
    previous_plan: {
      type: "string",
    },
    product: {
      type: "string",
    },
    purchased_at: {
      type: "string",
      format: "date-time",
    },
    purchased_at_ms: {
      type: "number",
    },
    purchasely_one_time_purchase_id: {
      type: "string",
    },
    purchasely_subscription_id: {
      type: "string",
    },
    store: {
      enum: Object.values(PurchaselyStore),
    },
    store_app_bundle_id: {
      type: "string",
    },
    store_country: {
      nullable: true,
      type: "string",
    },
    store_original_transaction_id: {
      type: "string",
    },
    store_product_id: {
      type: "string",
    },
    store_transaction_id: {
      type: "string",
    },
    subscription_status: {
      enum: Object.values(PurchaselySubscriptionStatus),
    },
    transferred_from_user_id: {
      type: "string",
    },
    transferred_to_user_id: {
      type: "string",
    },
    transferred_from_anonymous_user_id: {
      type: "string",
    },
    transferred_to_anonymous_user_id: {
      type: "string",
    },
    user_id: {
      type: "string",
    },
  },
  required: [
    "api_version",
    "effective_next_renewal_at",
    "effective_next_renewal_at_ms",
    "environment",
    "event_name",
    "event_created_at",
    "event_created_at_ms",
    "offer_type",
    "original_purchased_at",
    "original_purchased_at_ms",
    "product",
    "purchased_at",
    "purchased_at_ms",
    "store",
    "store_app_bundle_id",
    "store_original_transaction_id",
    "store_product_id",
    "store_transaction_id",
  ],
};
