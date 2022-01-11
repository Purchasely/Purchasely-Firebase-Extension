
import * as admin from "firebase-admin";
import test from "ava";
import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";

import { PurchaselySubscriptionsRepository } from "../../../../src/v2/purchasely-subscriptions/repository";
import { PurchaselySubscriptionDomain } from "../../../../src/v2/purchasely-subscriptions/domain/purchasely-subscription.domain";

import { subscriptionsFactory, firestoreSubscriptionToStringDateSubscription } from "./_subscriptions-factory";

test("Subscription Update should throw", async t => {
  const firebaseAppName = uuid();
  const testApp = admin.initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = admin.firestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselySubscriptionsRepository(collectionName)(db);
  const subscription: PurchaselySubscriptionDomain = subscriptionsFactory();
  const subscriptionUpdate = () => repository.update(subscription.id, subscription);
  await t.throwsAsync(subscriptionUpdate, { message: "Method not implemented" });
})

test("Subscription should be retrievable from firestore after creation", async t => {
  const firebaseAppName = uuid();
  const testApp = admin.initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = admin.firestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselySubscriptionsRepository(collectionName)(db);
  const subscriptionToCreate: PurchaselySubscriptionDomain = subscriptionsFactory();
  const updatedSubscription: PurchaselySubscriptionDomain = {
    ...subscriptionToCreate,
    received_at: DateTime.now().plus({ minutes: 15 }),
  };
  const expectedSubscription = {
    ...subscriptionToCreate,
    properties: {
      ...subscriptionToCreate.properties,
      purchased_at: subscriptionToCreate.properties.purchased_at.setZone("UTC").toISO(),
      expires_at: subscriptionToCreate.properties.expires_at.setZone("UTC").toISO(),
    },
    received_at: subscriptionToCreate.received_at.setZone("UTC").toISO(),
  };
  await repository.create(subscriptionToCreate.id, subscriptionToCreate);
  try {
    await repository.update(subscriptionToCreate.id, updatedSubscription);
  } catch {

  }
  const firestoreDoc = await db.collection(collectionName).doc(subscriptionToCreate.id).get();
  const fetchedSubscription = firestoreDoc.data();
  const mappedSubscription = firestoreSubscriptionToStringDateSubscription(fetchedSubscription);
  t.deepEqual(mappedSubscription, expectedSubscription);
})