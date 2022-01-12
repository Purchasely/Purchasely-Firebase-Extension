import {
  PurchaselyProductPlanType,
  PurchaselyStore,
} from "../../purchasely-events";

export interface PurchaselyConsumableWebhookDomain {
  anonymous_user_id?: string;
  api_version: number;
  content_id?: string;
  environment: string;
  event_name: string;
  event_created_at: string;
  event_created_at_ms: number;
  is_family_shared?: boolean;
  original_purchased_at: string;
  original_purchased_at_ms: number;
  plan: string;
  product: string;
  purchase_type: PurchaselyProductPlanType.CONSUMABLE;
  purchased_at: string;
  purchased_at_ms: number;
  purchasely_one_time_purchase_id?: string;
  store: PurchaselyStore;
  store_app_bundle_id: string;
  store_country: string;
  store_original_transaction_id: string;
  store_product_id: string;
  store_transaction_id: string;
  transferred_from_user_id?: string;
  transferred_to_user_id?: string;
  transferred_from_anonymous_user_id?: string;
  transferred_to_anonymous_user_id?: string;
  user_id?: string;
};