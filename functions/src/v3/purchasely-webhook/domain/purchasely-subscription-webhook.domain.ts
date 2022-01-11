import {
  PurchaselyOfferType,
  PurchaselyProductPlanType,
  PurchaselyStore,
  PurchaselySubscriptionStatus,
} from "../../purchasely-events";

export interface PurchaselySubscriptionWebhookDomain {
  anonymous_user_id?: string;
  api_version: number;
  auto_resume_at?: string;
  auto_resume_at_ms?: number;
  content_id?: string;
  defer_end_at?: string;
  defer_end_at_ms?: number;
  environment: string;
  event_name: string;
  event_created_at: string;
  event_created_at_ms: number;
  effective_next_renewal_at?: string;
  effective_next_renewal_at_ms?: number;
  grace_period_expires_at?: string;
  grace_period_expires_at_ms?: number;
  is_family_shared?: boolean;
  next_renewal_at?: string;
  next_renewal_at_ms?: number;
  original_purchased_at: string;
  original_purchased_at_ms: number;
  plan?: string;
  offer_type: PurchaselyOfferType;
  previous_offer_type?: PurchaselyOfferType;
  previous_plan?: string;
  product: string;
  purchase_type: PurchaselyProductPlanType.RENEWING_SUBSCRIPTION | PurchaselyProductPlanType.NON_RENEWING_SUBSCRIPTION;
  purchased_at: string;
  purchased_at_ms: number;
  purchasely_subscription_id: string;
  store: PurchaselyStore;
  store_app_bundle_id: string;
  store_country: string;
  store_original_transaction_id: string;
  store_product_id: string;
  store_transaction_id: string;
  subscription_status?: PurchaselySubscriptionStatus;
  transferred_from_user_id?: string;
  transferred_to_user_id?: string;
  transferred_from_anonymous_user_id?: string;
  transferred_to_anonymous_user_id?: string;
  user_id?: string;
};
