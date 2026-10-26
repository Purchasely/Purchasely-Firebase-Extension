
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import test from "ava";
import { v4 as uuid } from "uuid";

import { PurchaselySubscriptionsRepository } from "../../../../src/v3/purchasely-subscriptions/repository"

test("Repository Creation should not throw", t => {
  const firebaseAppName = uuid();
  const testApp = initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = getFirestore(testApp);
  const collectionName = uuid();
  const repositoryInit = () => PurchaselySubscriptionsRepository(collectionName)(db)

  t.notThrows(repositoryInit);
})

test("Repository Creation should not return undefined", t => {
  const firebaseAppName = uuid();
  const testApp = initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = getFirestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselySubscriptionsRepository(collectionName)(db);

  t.not(repository, undefined)
})
