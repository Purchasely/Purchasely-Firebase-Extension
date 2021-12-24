import { PurchaselyAppPlatform } from "../../purchasely-events/domain/purchasely-app-platform.enum";
import { PurchaselyProductPlanType } from "../../purchasely-events/domain/purchasely-product-plan-type.enum";
import { PurchaselyStore } from "../../purchasely-events/domain/purchasely-store.enum";

export const PurchaselyNonSubscriptionWebhookDtoSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    user: {
      type: "object",
      properties: {
        anonymous_id: { type: "string" },
        vendor_id: { type: "string" },
      },
      required: [],
      additionalProperties: true,
    },
    properties: {
      type: "object",
      properties: {
        product: {
          type: "object",
          properties: {
            vendor_id: { type: "string" },
            plan: {
              type: "object",
              properties: {
                type: { enum: [PurchaselyProductPlanType.CONSUMABLE, PurchaselyProductPlanType.NON_CONSUMABLE] },
                vendor_id: { type: "string" },
              },
              required: ["type", "vendor_id"],
              additionalProperties: true,
            },
          },
          required: ["vendor_id", "plan"],
          additionalProperties: true,
        },
        store: { enum: Object.values(PurchaselyStore) },
        app: {
          type: "object",
          properties: {
            platform: { enum: Object.values(PurchaselyAppPlatform) },
            package_id: { type: "string" },
          },
          required: ["platform", "package_id"],
          additionalProperties: true,
        },
        purchased_at: {
          type: "string",
          format: "date-time",
        },
      },
      required: [
        "product",
        "store",
        "app",
        "purchased_at",
      ],
      additionalProperties: true,
    },
    received_at: {
      type: "string",
      format: "date-time",
    },
  },
  required: ["name", "user", "properties", "received_at"],
  additionalProperties: true,
};
