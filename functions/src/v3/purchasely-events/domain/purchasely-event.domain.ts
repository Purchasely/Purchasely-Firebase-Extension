import { DateTime } from "luxon";
import { UUID } from "../../../utils/types/uuid.type";

import {
  PurchaselyOfferType,
  PurchaselyStore,
  PurchaselySubscriptionStatus,
} from "./";

export interface PurchaselyEventDomain {
  id: UUID;
  anonymous_user_id?: string;
  api_version: number;
  auto_resume_at?: DateTime;
  auto_resume_at_ms?: number;
  content_id?: string;
  defer_end_at?: DateTime;
  defer_end_at_ms?: number;
  environment: string;
  event_name: string;
  event_created_at: DateTime;
  event_created_at_ms: number;
  effective_next_renewal_at?: DateTime;
  effective_next_renewal_at_ms?: number;
  grace_period_expires_at?: DateTime;
  grace_period_expires_at_ms?: number;
  is_family_shared?: boolean;
  next_renewal_at?: DateTime;
  next_renewal_at_ms?: number;
  original_purchased_at?: DateTime;
  original_purchased_at_ms?: number;
  plan?: string;
  offer_type: PurchaselyOfferType;
  previous_offer_type?: PurchaselyOfferType;
  previous_plan?: string;
  product: string;
  purchased_at: DateTime;
  purchased_at_ms: number;
  purchasely_one_time_purchase_id?: string;
  purchasely_subscription_id?: string;
  store: PurchaselyStore;
  store_country: string | null;
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
