import Ajv from "ajv";
import Crypto from "crypto";
import { Request, Response } from "express";
import { PurchaselyWebhookDtoSchema } from "./dto/webhook.dto";
import { PurchaselyConfigInterface } from "../../purchasely.config";
import { PurchaselyProductPlanType } from "../purchasely-events/domain/purchasely-product-plan-type.enum";
import { Services } from "../../utils/types/services.type"

import { purchaselyConsumableEventController as ConsumableWebhookController } from "./consumables-webhook-event.controller"
import { purchaselyNonConsumableEventController as NonConsumableWebhookController } from "./non-consumables-webhook-event.controller"
import { purchaselySubscriptionEventController as SubscriptionWebhookController } from "./subscription-webhook-event.controller"

export const eventHeaderSignatureIsValid = (sharedSecret: string) => (request: Request) => {
  const receivedSignature = request.get("X-PURCHASELY-SIGNATURE") as string;
  const receivedTimestamp = request.get("X-PURCHASELY-TIMESTAMP") as string;

  const dataToSign = sharedSecret + receivedTimestamp;
  const computedSignature = Crypto
    .createHmac("sha256", sharedSecret)
    .update(dataToSign)
    .digest("hex");
  return computedSignature === receivedSignature;
}

const webhookEventsController = (productPlanType: PurchaselyProductPlanType): ((ajv: Ajv) => (services: Services) => (request: Request) => Promise<void>) => {
  switch (productPlanType) {
    case (PurchaselyProductPlanType.RENEWING_SUBSCRIPTION):
      return SubscriptionWebhookController;
    case (PurchaselyProductPlanType.NON_RENEWING_SUBSCRIPTION):
      return SubscriptionWebhookController;
    case (PurchaselyProductPlanType.CONSUMABLE):
      return ConsumableWebhookController;
    case (PurchaselyProductPlanType.NON_CONSUMABLE):
      return NonConsumableWebhookController;
  }
}

export const functions: {
  [keyof: string]: (ajv: Ajv) => (config: PurchaselyConfigInterface) => (services: Services) => (request: Request, response: Response) => Promise<void>;
} = {
  purchaselyWebhookHandler: (ajv: Ajv) => (config) => (services) => async (request: Request, response: Response) => {
    if (!eventHeaderSignatureIsValid(config.sharedSecret)(request)) {
      response.status(401).send();
      return;
    }
    if (!ajv.validate(PurchaselyWebhookDtoSchema, request.body)) {
      response.status(400).send({ errors: ajv.errors });
      return;
    }

    const productPlanType = (request.body as any).properties.product.plan.type as PurchaselyProductPlanType;

    return webhookEventsController(productPlanType)(ajv)(services)(request)
      .then(() => {
        const result = {
          clientType: "PURCHASELY_FIREBASE_EXTENSION",
          clientVersion: "0.0.2",
          handledApiVersion: "2"
        };
        response.status(200).send(result);
      })
      .catch((error) => response.status(500).send(error))
      .then(() => {
        return;
      });
  },
};
