import { PurchaselyConfigInterface } from "./src/purchasely.config";

export const PurchaselyConfig: PurchaselyConfigInterface = ({
  destinations: {
    customerUsers: {
      enabled: false,
      collectionName: null,
    },
    firebaseCustomClaims: {
      enabled: false,
    },
    purchaselySubscriptions: {
      enabled: false,
      collectionName: null,
    },
    purchaselyEvents: {
      enabled: false,
      collectionName: null,
    },
  },
  functions: {
    memory: "3GB",
    region: "europe-west3",
    timeoutSeconds: 300,
  },
  sharedSecret: "topSecretSharedSecret",
});
