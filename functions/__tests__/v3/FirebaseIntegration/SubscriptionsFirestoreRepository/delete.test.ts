
import * as admin from "firebase-admin";
import test from "ava";
import { v4 as uuid } from "uuid";

import { PurchaselySubscriptionsRepository } from "../../../../src/v3/purchasely-subscriptions/repository"
import { PurchaselySubscriptionDomain } from "../../../../src/v3/purchasely-subscriptions/domain/purchasely-subscription.domain";

import { subscriptionsFactory } from "./_subscriptions-factory";

test("Subscription Deletion should not throw if Subscription exists", async t => {
  const firebaseAppName = uuid();
  const testApp = admin.initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = admin.firestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselySubscriptionsRepository(collectionName)(db);
  const subscription: PurchaselySubscriptionDomain = subscriptionsFactory();
  await repository.create(subscription.id, subscription);
  const subscriptionDeletion = async () => repository.delete(subscription.id);
  t.notThrows(await subscriptionDeletion);
})

test("Subscription Deletion should return void", async t => {
  const firebaseAppName = uuid();
  const testApp = admin.initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = admin.firestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselySubscriptionsRepository(collectionName)(db);
  const subscription: PurchaselySubscriptionDomain = subscriptionsFactory();
  await repository.create(subscription.id, subscription);
  const deletedSubscriptionResponse = await repository.delete(subscription.id);
  t.is(deletedSubscriptionResponse, undefined);
})

test("Subscription should not be retrievable from firestore after deletion", async t => {
  const firebaseAppName = uuid();
  const testApp = admin.initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = admin.firestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselySubscriptionsRepository(collectionName)(db);
  const subscription: PurchaselySubscriptionDomain = subscriptionsFactory();
  await repository.create(subscription.id, subscription);
  await repository.delete(subscription.id);
  const firestoreDoc = await db.collection(collectionName).doc(subscription.id).get();
  const fetchedSubscription = firestoreDoc.data();
  t.deepEqual(fetchedSubscription, undefined);
})