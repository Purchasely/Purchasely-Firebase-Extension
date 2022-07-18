import { DateTime } from "luxon";
import { UUID } from "../../../utils/types/uuid.type";
import { PurchaselyAppPlatform } from "../../purchasely-events/domain/purchasely-app-platform.enum";

import { PurchaselyProductPlanType } from "../../purchasely-events/domain/purchasely-product-plan-type.enum";

export interface PurchaselyNonConsumableDomain {
  id: UUID;
  user: {
    anonymous_id: string | null;
    vendor_id: string | null;
  };
  properties: {
    product: {
      vendor_id: string;
      plan: {
        type: PurchaselyProductPlanType.NON_CONSUMABLE;
        vendor_id: string;
      };
    };
    app: {
      platform: PurchaselyAppPlatform;
      package_id: string;
    };
    purchased_at: DateTime;
  };
  received_at: DateTime;
}
