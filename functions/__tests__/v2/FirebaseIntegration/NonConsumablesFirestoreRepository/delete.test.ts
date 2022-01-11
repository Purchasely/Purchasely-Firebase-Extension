
import * as admin from "firebase-admin";
import test from "ava";
import { v4 as uuid } from "uuid";

import { PurchaselyNonConsumablesRepository } from "../../../../src/v2/purchasely-non-consumables/repository"
import { PurchaselyNonConsumableDomain } from "../../../../src/v2/purchasely-non-consumables/domain/purchasely-non-consumable.domain"

import { nonConsumablesFactory } from "./_non-consumables-factory";

test("Non Consumable Deletion should not throw if Consumable exists", async t => {
  const firebaseAppName = uuid();
  const testApp = admin.initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = admin.firestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselyNonConsumablesRepository(collectionName)(db);
  const nonConsumable: PurchaselyNonConsumableDomain = nonConsumablesFactory();
  await repository.create(nonConsumable.id, nonConsumable);
  const nonConsumableDeletion = async () => repository.delete(nonConsumable.id);
  t.notThrows(await nonConsumableDeletion);
})

test("Non Consumable Deletion should return void", async t => {
  const firebaseAppName = uuid();
  const testApp = admin.initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = admin.firestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselyNonConsumablesRepository(collectionName)(db);
  const nonConsumable: PurchaselyNonConsumableDomain = nonConsumablesFactory();
  await repository.create(nonConsumable.id, nonConsumable);
  const deletedNonConsumableResponse = await repository.delete(nonConsumable.id);
  t.is(deletedNonConsumableResponse, undefined);
})

test("Non Consumable should not be retrievable from firestore after deletion", async t => {
  const firebaseAppName = uuid();
  const testApp = admin.initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = admin.firestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselyNonConsumablesRepository(collectionName)(db);
  const nonConsumable: PurchaselyNonConsumableDomain = nonConsumablesFactory();
  await repository.create(nonConsumable.id, nonConsumable);
  await repository.delete(nonConsumable.id);
  const firestoreDoc = await db.collection(collectionName).doc(nonConsumable.id).get();
  const fetchedNonConsumable = firestoreDoc.data();
  t.deepEqual(fetchedNonConsumable, undefined);
})