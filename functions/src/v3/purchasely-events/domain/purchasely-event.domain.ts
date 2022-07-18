import { DateTime } from "luxon";
import { UUID } from "../../../utils/types/uuid.type";

import {
  PurchaselyOfferType,
  PurchaselyProductPlanType,
  PurchaselyStore,
  PurchaselySubscriptionStatus,
} from "./";

export interface PurchaselyEventDomain {
  id: UUID;
  anonymous_user_id: string | null;
  api_version: number;
  auto_resume_at: DateTime | null;
  auto_resume_at_ms: number | null;
  content_id: string | null;
  defer_end_at: DateTime | null;
  defer_end_at_ms: number | null;
  environment: string;
  event_name: string;
  event_created_at: DateTime;
  event_created_at_ms: number;
  effective_next_renewal_at: DateTime | null;
  effective_next_renewal_at_ms: number | null;
  grace_period_expires_at: DateTime | null;
  grace_period_expires_at_ms: number | null;
  is_family_shared: boolean | null;
  next_renewal_at: DateTime | null;
  next_renewal_at_ms: number | null;
  original_purchased_at: DateTime | null;
  original_purchased_at_ms: number | null;
  plan: string;
  offer_type: PurchaselyOfferType | null;
  previous_offer_type: PurchaselyOfferType | null;
  previous_plan: string | null;
  product: string;
  purchase_type: PurchaselyProductPlanType,
  purchased_at: DateTime;
  purchased_at_ms: number;
  purchasely_one_time_purchase_id: string | null;
  purchasely_subscription_id: string | null;
  store: PurchaselyStore;
  store_app_bundle_id: string;
  store_country: string | null;
  store_original_transaction_id: string;
  store_product_id: string;
  store_transaction_id: string;
  subscription_status: PurchaselySubscriptionStatus | null;
  transferred_from_user_id: string | null;
  transferred_to_user_id: string | null;
  transferred_from_anonymous_user_id: string | null;
  transferred_to_anonymous_user_id: string | null;
  user_id: string | null;
};
