
import * as admin from "firebase-admin";
import test from "ava";
import { v4 as uuid } from "uuid";

import { PurchaselyConsumablesRepository } from "../../../src/purchasely-consumables/repository"
import { PurchaselyConsumableDomain } from "../../../src/purchasely-consumables/domain/purchasely-consumable.domain"

import { consumablesFactory } from "./_consumables-factory";

test("Consumable Deletion should not throw if Consumable exists", async t => {
  const firebaseAppName = uuid();
  const testApp = admin.initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = admin.firestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselyConsumablesRepository(collectionName)(db);
  const consumable: PurchaselyConsumableDomain = consumablesFactory();
  await repository.create(consumable.id, consumable);
  const consumableDeletion = async () => repository.delete(consumable.id);
  t.notThrows(await consumableDeletion);
})

test("Consumable Deletion should return void", async t => {
  const firebaseAppName = uuid();
  const testApp = admin.initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = admin.firestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselyConsumablesRepository(collectionName)(db);
  const consumable: PurchaselyConsumableDomain = consumablesFactory();
  await repository.create(consumable.id, consumable);
  const deletedConsumableResponse = await repository.delete(consumable.id);
  t.is(deletedConsumableResponse, undefined);
})

test("Consumable should not be retrievable from firestore after deletion", async t => {
  const firebaseAppName = uuid();
  const testApp = admin.initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = admin.firestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselyConsumablesRepository(collectionName)(db);
  const consumable: PurchaselyConsumableDomain = consumablesFactory();
  await repository.create(consumable.id, consumable);
  await repository.delete(consumable.id);
  const firestoreDoc = await db.collection(collectionName).doc(consumable.id).get();
  const fetchedConsumable = firestoreDoc.data();
  t.deepEqual(fetchedConsumable, undefined);
})