import { PurchaselyAppPlatform } from "../../purchasely-events/domain/purchasely-app-platform.enum";
import { PurchaselyEventName } from "../../purchasely-events/domain/purchasely-event-name.enum";
import { PurchaselyProductPlanType } from "../../purchasely-events/domain/purchasely-product-plan-type.enum";
import { PurchaselyStore } from "../../purchasely-events/domain/purchasely-store.enum";

export const PurchaselyWebhookDtoSchema = {
  type: "object",
  properties: {
    name: {
      enum: Object.values(PurchaselyEventName),
    },
    user: {
      type: "object",
      properties: {
        anonymous_id: { type: "string" },
        vendor_id: { type: "string" },
      },
      required: [],
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
                type: { enum: Object.values(PurchaselyProductPlanType) },
                vendor_id: { type: "string" },
              },
              required: ["type", "vendor_id"],
            },
          },
          required: ["vendor_id", "plan"],
        },
        store: { enum: Object.values(PurchaselyStore) },
        app: {
          type: "object",
          properties: {
            platform: { enum: Object.values(PurchaselyAppPlatform) },
            package_id: { type: "string" },
          },
          required: ["platform", "package_id"],
        },
        expires_at: {
          type: "string",
          format: "date-time",
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
        "expires_at",
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
