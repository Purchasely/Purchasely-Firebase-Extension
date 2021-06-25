import { DateTime } from "luxon";
import { UUID } from "../../utils/types/uuid.type";
import { PurchaselyAppPlatform } from "../../purchasely-events/domain/purchasely-app-platform.enum";

import { PurchaselyProductPlanType } from "../../purchasely-events/domain/purchasely-product-plan-type.enum";

export interface PurchaselySubscriptionDomain {
  id: UUID;
  user: {
    anonymous_id?: string;
    vendor_id?: string;
  };
  properties: {
    product: {
      vendor_id: string;
      plan: {
        type: PurchaselyProductPlanType;
        vendor_id: string;
      };
    };
    app: {
      platform: PurchaselyAppPlatform;
      package_id: string;
    };
    expires_at: DateTime;
    purchased_at: DateTime;
  };
  is_subscribed: boolean;
  received_at: DateTime;
}
