import { v4 as uuid } from "uuid";

export const configFactory = (sharedSecret: string = uuid()) => ({
  2: {
    destinations: {
      customerUsers: {
        enabled: true,
        collectionName: uuid(),
      },
      firebaseCustomClaims: {
        enabled: true,
      },
      purchaselyConsumables: {
        enabled: true,
        collectionName: uuid(),
      },
      purchaselyNonConsumables: {
        enabled: true,
        collectionName: uuid(),
      },
      purchaselySubscriptions: {
        enabled: true,
        collectionName: uuid(),
      },
      purchaselyEvents: {
        enabled: true,
        collectionName: uuid(),
      },
    }
  },
  3: {
    destinations: {
      customerUsers: {
        enabled: true,
        collectionName: uuid(),
      },
      firebaseCustomClaims: {
        enabled: true,
      },
      purchaselyConsumables: {
        enabled: true,
        collectionName: uuid(),
      },
      purchaselyNonConsumables: {
        enabled: true,
        collectionName: uuid(),
      },
      purchaselySubscriptions: {
        enabled: true,
        collectionName: uuid(),
      },
      purchaselyEvents: {
        enabled: true,
        collectionName: uuid(),
      },
    }
  },
  functions: {
    memory: "3GB",
    region: "europe-west3",
    timeoutSeconds: 300,
  },
  sharedSecret,
})