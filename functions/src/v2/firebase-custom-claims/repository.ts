import Firebase from "firebase-admin"
import { PurchaselyFirebaseCustomClaimsDomain } from "./domain/purchasely-firebase-custom-claims.domain";

export type RepositoryDomain = {
  [key: string]: any;
  purchasely_subscriptions: PurchaselyFirebaseCustomClaimsDomain[];
}

export interface FirebaseCustomClaimsRepositoryInterface {
  get: (userFirestoreId: string) => Promise<RepositoryDomain>;
  update: (userFirestorId: string, item: RepositoryDomain) => Promise<RepositoryDomain>;
  delete: (userFirestorId: string) => Promise<RepositoryDomain>;
}

const decodePurchaselyCustomClaims = (customClaims: { [key: string]: any; } | undefined): RepositoryDomain => {
  if (customClaims === undefined) {
    return {
      purchasely_subscriptions: [],
    };
  }
  try {
    const purchaselySubscriptions = JSON.parse(customClaims.purchasely_subscriptions);
    if (Array.isArray(purchaselySubscriptions)) {
      return {
        ...customClaims,
        purchasely_subscriptions: purchaselySubscriptions,
      }
    } else {
      return {
        ...customClaims,
        purchasely_subscriptions: [],
      }
    }
  } catch (error) {
    return {
      ...customClaims,
      purchasely_subscriptions: [],
    }
  }
}

const updateFirebaseCustomClaims = (firebaseAuth: Firebase.auth.Auth) => (userId: string) => (customClaims: RepositoryDomain) => {
  console.log("Updated Custom Claims: ", JSON.stringify(customClaims));
  const encodedCustomClaims = {
    ...customClaims,
    purchasely_subscriptions: JSON.stringify(customClaims.purchasely_subscriptions),
  }
  return firebaseAuth.setCustomUserClaims(userId, encodedCustomClaims)
    .then(() => customClaims)
}

// TODO: Move the business logic to the service layer. The repository shouldn't do all that
export const FirebaseCustomClaimsRepository = (firebaseAuth: Firebase.auth.Auth): FirebaseCustomClaimsRepositoryInterface => ({
  get: (userFirestoreId: string) =>
    firebaseAuth.getUser(userFirestoreId)
      .then((user) => user.customClaims)
      .then(decodePurchaselyCustomClaims),
  update: (userFirestoreId: string, item: RepositoryDomain) =>
    updateFirebaseCustomClaims(firebaseAuth)(userFirestoreId)(item),
  delete: (userFirestoreId: string) =>
    updateFirebaseCustomClaims(firebaseAuth)(userFirestoreId)({ purchasely_subscriptions: [] }),
});
