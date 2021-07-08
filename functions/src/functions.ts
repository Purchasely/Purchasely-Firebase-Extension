import Ajv from "ajv";
import addFormats from "ajv-formats";
import * as FirebaseFunctions from "firebase-functions";
import * as admin from "firebase-admin";
import { PurchaselyConfig } from "./purchasely.config";
import { PurchaselyServices } from "./services";

import PurchaselyWebhook from "./purchasely-webhook/functions";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

admin.initializeApp();
const auth = admin.auth();
const firestore = admin.firestore();

const purchaselyServices = PurchaselyServices(PurchaselyConfig)(auth, firestore);

export const purchaselyWebhookHandler =
  FirebaseFunctions
    .handler
    .https.onRequest(
      purchaselyServices.logs.cloudFunctionCrashLogger(PurchaselyWebhook.purchaselyWebhookHandler(ajv)(PurchaselyConfig)(purchaselyServices))
    );
