import Firebase from "firebase-admin";
import FirebaseFirestore from "@google-cloud/firestore";

import {
  PurchaselyEventsServiceFirestoreInstance as EventsInstance,
  PurchaselyEventsServiceInterface as EventsInterface,
} from "./purchasely-events/service";
import {
  PurchaselySubscriptionsServiceFirestoreInstance as SubscriptionsInstance,
  PurchaselySubscriptionsServiceInterface as SusbscriptionsInterface,
} from "./purchasely-subscriptions/service";
import { PurchaselyLoggingService, PurchaselyLoggingServiceInterface } from "./purchasely-logging/service";
import { PurchaselyConfigInterface, PurchaselyFirestoreDestinationSettings } from "./purchasely.config";
import { FirebaseCustomClaimsServiceInstance, FirebaseCustomClaimsServiceInterface } from "./firebase-custom-claims/service";

const servicesSetup = <T>(destinationSettings: PurchaselyFirestoreDestinationSettings) => (serviceSetup: ((collectionName: string) => T | null)) => {
  if (destinationSettings.enabled === false || destinationSettings.collectionName === null) {
    return null;
  }
  return serviceSetup(destinationSettings.collectionName);
}

export const PurchaselyServices =
  (purchaselyConfig: PurchaselyConfigInterface) =>
    (auth: Firebase.auth.Auth, db: FirebaseFirestore.Firestore): {
      events: EventsInterface | null;
      firebaseCustomClaims: FirebaseCustomClaimsServiceInterface | null;
      logs: PurchaselyLoggingServiceInterface;
      subscriptions: SusbscriptionsInterface | null;
    } => ({
      events: servicesSetup<EventsInterface>(purchaselyConfig.destinations.purchaselyEvents)((collectionName) => EventsInstance(collectionName)(db)),
      firebaseCustomClaims: FirebaseCustomClaimsServiceInstance(auth),
      logs: PurchaselyLoggingService(),
      subscriptions: servicesSetup<SusbscriptionsInterface>(purchaselyConfig.destinations.purchaselySubscriptions)((collectionName) => SubscriptionsInstance(collectionName)(db)),
    });