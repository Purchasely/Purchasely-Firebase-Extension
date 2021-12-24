import { PurchaselyAppPlatform } from "../../purchasely-events/domain/purchasely-app-platform.enum";
import { PurchaselyProductPlanType } from "../../purchasely-events/domain/purchasely-product-plan-type.enum";
import { PurchaselyStore } from "../../purchasely-events/domain/purchasely-store.enum";

export interface PurchaselySubscriptionWebhookDomain {
  name: string;
  user: {
    anonymous_id?: string;
    vendor_id?: string;
  };
  properties: {
    product: {
      vendor_id: string;
      plan: {
        type: PurchaselyProductPlanType.RENEWING_SUBSCRIPTION | PurchaselyProductPlanType.NON_RENEWING_SUBSCRIPTION;
        vendor_id: string;
      };
    };
    store: PurchaselyStore;
    app: {
      platform: PurchaselyAppPlatform;
      package_id: string;
    };
    expires_at: string;
    purchased_at: string;
  };
  received_at: string;
}
