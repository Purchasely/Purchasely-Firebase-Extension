
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import test from "ava";
import { v4 as uuid } from "uuid";

import { PurchaselyNonConsumablesRepository } from "../../../../src/v3/purchasely-non-consumables/repository"

test("Repository Creation should not throw", t => {
  const firebaseAppName = uuid();
  const testApp = initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = getFirestore(testApp);
  const collectionName = uuid();
  const repositoryInit = () => PurchaselyNonConsumablesRepository(collectionName)(db)

  t.notThrows(repositoryInit);
})

test("Repository Creation should not return undefined", t => {
  const firebaseAppName = uuid();
  const testApp = initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = getFirestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselyNonConsumablesRepository(collectionName)(db);

  t.not(repository, undefined)
})
