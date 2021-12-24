import Ajv from "ajv";
import addFormats from "ajv-formats";
import { Request, Response } from "express";
import * as FirebaseFunctions from "firebase-functions";
import * as admin from "firebase-admin";
import { PurchaselyConfig } from "./purchasely.config";
import { PurchaselyServices } from "./services";
import { PurchaselyAPIVersions } from './purchaselyApiVersions.enum';
import * as purchaselyV2 from "./v2";
import * as purchaselyV3 from "./v3";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

admin.initializeApp();
const auth = admin.auth();
const firestore = admin.firestore();

const purchaselyServices = PurchaselyServices(PurchaselyConfig)(auth, firestore);

const payloadVersionForRequest: (request: Request) => Promise<PurchaselyAPIVersions> = (request: Request) => {
  if (!request.body.api_version) {
    return PurchaselyAPIVersions.v2;
  }
  if (request.body.api_version === 2) {
    return PurchaselyAPIVersions.v2;
  }
  if (request.body.api_version === 3) {
    return PurchaselyAPIVersions.v3;
  }
  throw new Error(`Unhandled API Version: ${request.body.api_version}`);
}

const webhookHandlerForWebhookPayloadVersion: Record<PurchaselyAPIVersions, (request: Request, response: Response) => Promise<void>> = {
  [PurchaselyAPIVersions.v2]: purchaselyV2.PurchaselyWebhooks.functions.purchaselyWebhookHandler(ajv)(PurchaselyConfig)(purchaselyServices.v2),
  [PurchaselyAPIVersions.v3]: purchaselyV3.PurchaselyWebhooks.functions.purchaselyWebhookHandler(ajv)(PurchaselyConfig)(purchaselyServices.v3),
};

const webhookHandler: (request: Request, response: Response) => Promise<void> = async (request: Request, response: Response): Promise<void> => {
  const payloadVersion = await payloadVersionForRequest(request);
  return webhookHandlerForWebhookPayloadVersion[payloadVersion](request, response);
}

export const purchaselyWebhookHandler =
  FirebaseFunctions
    .handler
    .https.onRequest(
      purchaselyServices.logs.cloudFunctionCrashLogger(webhookHandler)
    );
