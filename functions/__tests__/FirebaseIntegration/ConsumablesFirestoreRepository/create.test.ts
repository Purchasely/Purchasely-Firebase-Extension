
import * as admin from "firebase-admin";
import test from "ava";
import { v4 as uuid } from "uuid";

import { PurchaselyConsumablesRepository } from "../../../src/purchasely-consumables/repository"
import { PurchaselyConsumableDomain } from "../../../src/purchasely-consumables/domain/purchasely-consumable.domain"

import { consumablesFactory, firestoreConsumableToStringDateConsumable } from "./_consumables-factory";

test("Consumable Creation should not throw", async t => {
  const firebaseAppName = uuid();
  const testApp = admin.initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = admin.firestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselyConsumablesRepository(collectionName)(db);
  const consumable: PurchaselyConsumableDomain = consumablesFactory();
  const consumableCreation = async () => await repository.create(consumable.id, consumable);
  t.notThrows(await consumableCreation);
})

test("Consumable Creation should return the right Consumable", async t => {
  const firebaseAppName = uuid();
  const testApp = admin.initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = admin.firestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselyConsumablesRepository(collectionName)(db);
  const consumable: PurchaselyConsumableDomain = consumablesFactory();
  const createdConsumable = await repository.create(consumable.id, consumable);
  t.deepEqual(createdConsumable, consumable);
})

test("Consumable should be retrievable from firestore after creation", async t => {
  const firebaseAppName = uuid();
  const testApp = admin.initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = admin.firestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselyConsumablesRepository(collectionName)(db);
  const consumable: PurchaselyConsumableDomain = consumablesFactory();
  const expectedConsumable = {
    ...consumable,
    properties: {
      ...consumable.properties,
      purchased_at: consumable.properties.purchased_at.setZone("UTC").toISO(),
    },
    received_at: consumable.received_at.setZone("UTC").toISO(),
  };
  await repository.create(consumable.id, consumable);
  const firestoreDoc = await db.collection(collectionName).doc(consumable.id).get();
  const fetchedConsumable = firestoreDoc.data();
  const mappedConsumable = firestoreConsumableToStringDateConsumable(fetchedConsumable);
  t.deepEqual(mappedConsumable, expectedConsumable);
})