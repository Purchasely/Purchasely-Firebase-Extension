import Firebase from "firebase-admin"
import { FirebaseCustomClaimsRepository, FirebaseCustomClaimsRepositoryInterface } from "./repository";
import { PurchaselyFirebaseCustomClaimsDomain } from "./domain/purchasely-firebase-custom-claims.domain";

type ServiceDomain = PurchaselyFirebaseCustomClaimsDomain[];

export interface FirebaseCustomClaimsServiceInterface {
  create: (userFirestorId: string, item: ServiceDomain) => Promise<ServiceDomain>;
  delete: (userFirestorId: string, item: ServiceDomain) => Promise<ServiceDomain>;
}

export const FirebaseCustomClaimsService = (
  repository: FirebaseCustomClaimsRepositoryInterface
): FirebaseCustomClaimsServiceInterface => ({
  create: (userFirestorId: string, item: ServiceDomain) =>
    repository
      .get(userFirestorId)
      .then((decodedCustomClaims) => {
        const newSubscriptions = item
          .reduce((acc: ServiceDomain, value) =>
            decodedCustomClaims.purchasely_subscriptions
              .filter((subscription) => subscription.plan !== undefined && subscription.product !== undefined)
              .some((subscription) =>
                value.plan === subscription.plan && value.product === subscription.product
              )
              ? acc
              : acc.concat([value]), []
          );
        return {
          ...decodedCustomClaims,
          purchasely_subscriptions: [
            ...decodedCustomClaims.purchasely_subscriptions,
            ...newSubscriptions,
          ],
        }
      }).then((updatedCustomClaims) =>
        repository.update(userFirestorId, updatedCustomClaims)
          .then((customClaims) => customClaims.purchasely_subscriptions)
      ),
  delete: (userFirestorId: string, item: ServiceDomain) => repository
    .get(userFirestorId)
    .then((decodedCustomClaims) => {
      return {
        ...decodedCustomClaims,
        purchasely_subscriptions: decodedCustomClaims.purchasely_subscriptions.filter(
          (subscription) => !item.some(
            (subscriptionToDelete) => subscriptionToDelete.plan === subscription.plan && subscriptionToDelete.product === subscription.product
          )
        ),
      }
    }).then((updatedCustomClaims) =>
      repository.update(userFirestorId, updatedCustomClaims)
        .then((customClaims) => customClaims.purchasely_subscriptions)
    ),
});

export const FirebaseCustomClaimsServiceInstance =
  (firebaseAuth: Firebase.auth.Auth): FirebaseCustomClaimsServiceInterface =>
    FirebaseCustomClaimsService(FirebaseCustomClaimsRepository(firebaseAuth));
