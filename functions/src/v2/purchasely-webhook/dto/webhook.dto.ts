import { PurchaselyProductPlanType } from "../../purchasely-events/domain/purchasely-product-plan-type.enum";

export const PurchaselyWebhookDtoSchema = {
  type: "object",
  properties: {
    properties: {
      type: "object",
      properties: {
        product: {
          type: "object",
          properties: {
            plan: {
              type: "object",
              properties: {
                type: { enum: Object.values(PurchaselyProductPlanType) },
              },
              required: ["type"],
              additionalProperties: true,
            },
          },
          required: ["plan"],
          additionalProperties: true,
        },
      },
      required: [
        "product"
      ],
      additionalProperties: true,
    },
  },
  required: ["properties"],
  additionalProperties: true,
};
