import Firebase from "firebase-admin";
import FirebaseFirestore from "@google-cloud/firestore";

import * as purchaselyV2 from "./v2";
import * as purchaselyV3 from "./v3";

import { PurchaselyLoggingService } from "./purchasely-logging/service";
import { PurchaselyConfigInterface } from "./purchasely.config";

export const PurchaselyServices =
  (purchaselyConfig: PurchaselyConfigInterface) =>
    (auth: Firebase.auth.Auth, db: FirebaseFirestore.Firestore) => ({
      logs: PurchaselyLoggingService(),
      v2: purchaselyV2.PurchaselyServices(purchaselyConfig)(auth, db),
      v3: purchaselyV3.PurchaselyServices(purchaselyConfig)(auth, db),
    });