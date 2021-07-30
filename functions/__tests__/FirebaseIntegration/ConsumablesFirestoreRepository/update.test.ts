
import * as admin from "firebase-admin";
import test from "ava";
import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";

import { PurchaselyConsumablesRepository } from "../../../src/purchasely-consumables/repository"
import { PurchaselyConsumableDomain } from "../../../src/purchasely-consumables/domain/purchasely-consumable.domain"

import { consumablesFactory, firestoreConsumableToStringDateConsumable } from "./_consumables-factory";

test("Consumable Update should throw", async t => {
  const firebaseAppName = uuid();
  const testApp = admin.initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = admin.firestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselyConsumablesRepository(collectionName)(db);
  const consumable: PurchaselyConsumableDomain = consumablesFactory();
  const consumableUpdate = () => repository.update(consumable.id, consumable);
  await t.throwsAsync(consumableUpdate, { message: "Method not implemented" });
})

test("Consumable should be retrievable from firestore after creation", async t => {
  const firebaseAppName = uuid();
  const testApp = admin.initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = admin.firestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselyConsumablesRepository(collectionName)(db);
  const consumableToCreate: PurchaselyConsumableDomain = consumablesFactory();
  const updatedConsumable: PurchaselyConsumableDomain = {
    ...consumableToCreate,
    received_at: DateTime.now().plus({ minutes: 15 }),
  };
  const expectedConsumable = {
    ...consumableToCreate,
    properties: {
      ...consumableToCreate.properties,
      purchased_at: consumableToCreate.properties.purchased_at.setZone("UTC").toISO(),
    },
    received_at: consumableToCreate.received_at.setZone("UTC").toISO(),
  };
  await repository.create(consumableToCreate.id, consumableToCreate);
  try {
    await repository.update(consumableToCreate.id, updatedConsumable);
  } catch {

  }
  const firestoreDoc = await db.collection(collectionName).doc(consumableToCreate.id).get();
  const fetchedConsumable = firestoreDoc.data();
  const mappedConsumable = firestoreConsumableToStringDateConsumable(fetchedConsumable);
  t.deepEqual(mappedConsumable, expectedConsumable);
})