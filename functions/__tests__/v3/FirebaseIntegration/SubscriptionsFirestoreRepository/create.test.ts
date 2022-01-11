
import * as admin from "firebase-admin";
import test from "ava";
import { v4 as uuid } from "uuid";

import { PurchaselySubscriptionsRepository } from "../../../../src/v3/purchasely-subscriptions/repository";
import { PurchaselySubscriptionDomain } from "../../../../src/v3/purchasely-subscriptions/domain/purchasely-subscription.domain";

import { subscriptionsFactory, firestoreSubscriptionToStringDateSubscription } from "./_subscriptions-factory";

test("Subscription Creation should not throw", async t => {
  const firebaseAppName = uuid();
  const testApp = admin.initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = admin.firestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselySubscriptionsRepository(collectionName)(db);
  const subscription: PurchaselySubscriptionDomain = subscriptionsFactory();
  const subscriptionCreation = async () => await repository.create(subscription.id, subscription);
  t.notThrows(await subscriptionCreation);
})

test("Subscription Creation should return the right Subscription", async t => {
  const firebaseAppName = uuid();
  const testApp = admin.initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = admin.firestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselySubscriptionsRepository(collectionName)(db);
  const subscription: PurchaselySubscriptionDomain = subscriptionsFactory();
  const createdSubscription = await repository.create(subscription.id, subscription);
  t.deepEqual(createdSubscription, subscription);
})

test("Subscription should be retrievable from firestore after creation", async t => {
  const firebaseAppName = uuid();
  const testApp = admin.initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = admin.firestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselySubscriptionsRepository(collectionName)(db);
  const subscription: PurchaselySubscriptionDomain = subscriptionsFactory();
  const expectedSubscription = {
    ...subscription,
    properties: {
      ...subscription.properties,
      purchased_at: subscription.properties.purchased_at.setZone("UTC").toISO(),
      expires_at: subscription.properties.expires_at.setZone("UTC").toISO(),
    },
    received_at: subscription.received_at.setZone("UTC").toISO(),
  };
  await repository.create(subscription.id, subscription);
  const firestoreDoc = await db.collection(collectionName).doc(subscription.id).get();
  const fetchedSubscription = firestoreDoc.data();
  const mappedSubscription = firestoreSubscriptionToStringDateSubscription(fetchedSubscription);
  t.deepEqual(mappedSubscription, expectedSubscription);
})