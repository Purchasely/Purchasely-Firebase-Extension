import { DateTime } from "luxon";
import { UUID } from "../../../utils/types/uuid.type";
import { PurchaselyAppPlatform } from "./purchasely-app-platform.enum";
import { PurchaselyProductPlanType } from "./purchasely-product-plan-type.enum";
import { PurchaselyStore } from "./purchasely-store.enum";

export interface PurchaselyEventDomain {
  id: UUID;
  name: string;
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
    store: PurchaselyStore;
    app: {
      platform: PurchaselyAppPlatform;
      package_id: string;
    };
    expires_at?: DateTime;
    purchased_at: DateTime;
  };
  received_at: DateTime;
}
