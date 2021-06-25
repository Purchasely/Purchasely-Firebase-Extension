export interface PurchaselyFirestoreDestinationSettings {
  enabled: boolean;
  collectionName: string | null;
}

export interface PurchaselyConfigInterface {
  destinations: {
    customerUsers: PurchaselyFirestoreDestinationSettings,
    firebaseCustomClaims: {
      enabled: boolean;
    },
    purchaselySubscriptions: PurchaselyFirestoreDestinationSettings,
    purchaselyEvents: PurchaselyFirestoreDestinationSettings
  },
  functions: {
    memory: string;
    region: string;
    timeoutSeconds: number;
  },
  sharedSecret: string;
}

export const PurchaselyConfig: PurchaselyConfigInterface = {
  destinations: {
    customerUsers: {
      enabled: false,
      collectionName: null,
    },
    firebaseCustomClaims: {
      enabled: process.env.UPDATE_FIREBASE_AUTH_CUSTOM_CLAIMS === "YES",
    },
    purchaselySubscriptions: {
      enabled: true,
      collectionName: process.env.PURCHASELY_SUBSCRIPTIONS_COLLECTION as string,
    },
    purchaselyEvents: {
      enabled: process.env.PURCHASELY_EVENTS_COLLECTION !== undefined && process.env.PURCHASELY_EVENTS_COLLECTION !== "",
      collectionName: process.env.PURCHASELY_EVENTS_COLLECTION ?? "",
    },
  },
  functions: {
    memory: "1GB",
    region: process.env.LOCATION as string,
    timeoutSeconds: 300,
  },
  sharedSecret: process.env.PURCHASELY_SHARED_SECRET as string,
}