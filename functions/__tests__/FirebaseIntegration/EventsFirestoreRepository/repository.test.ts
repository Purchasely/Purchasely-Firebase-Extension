
import * as admin from "firebase-admin";
import test from "ava";
import { v4 as uuid } from "uuid";

import { PurchaselyEventsRepository } from "../../../src/purchasely-events/repository"

test("Repository Creation should not throw", t => {
  const firebaseAppName = uuid();
  const testApp = admin.initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = admin.firestore(testApp);
  const collectionName = uuid();
  const repositoryInit = () => PurchaselyEventsRepository(collectionName)(db)

  t.notThrows(repositoryInit);
})

test("Repository Creation should not return undefined", t => {
  const firebaseAppName = uuid();
  const testApp = admin.initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = admin.firestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselyEventsRepository(collectionName)(db);

  t.not(repository, undefined)
})
