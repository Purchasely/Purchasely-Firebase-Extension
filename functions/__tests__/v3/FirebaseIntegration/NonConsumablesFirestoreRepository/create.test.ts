
import * as admin from "firebase-admin";
import test from "ava";
import { v4 as uuid } from "uuid";

import { PurchaselyNonConsumablesRepository } from "../../../../src/v3/purchasely-non-consumables/repository"
import { PurchaselyNonConsumableDomain } from "../../../../src/v3/purchasely-non-consumables/domain/purchasely-non-consumable.domain"

import { nonConsumablesFactory, firestoreNonConsumableToStringDateNonConsumable } from "./_non-consumables-factory";

test("Non Consumable Creation should not throw", async t => {
  const firebaseAppName = uuid();
  const testApp = admin.initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = admin.firestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselyNonConsumablesRepository(collectionName)(db);
  const nonConsumable: PurchaselyNonConsumableDomain = nonConsumablesFactory();
  const nonConsumableCreation = async () => await repository.create(nonConsumable.id, nonConsumable);
  t.notThrows(await nonConsumableCreation);
})

test("Non Consumable Creation should return the right Consumable", async t => {
  const firebaseAppName = uuid();
  const testApp = admin.initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = admin.firestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselyNonConsumablesRepository(collectionName)(db);
  const nonConsumable: PurchaselyNonConsumableDomain = nonConsumablesFactory();
  const createdNonConsumable = await repository.create(nonConsumable.id, nonConsumable);
  t.deepEqual(createdNonConsumable, nonConsumable);
})

test("Non Consumable should be retrievable from firestore after creation", async t => {
  const firebaseAppName = uuid();
  const testApp = admin.initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = admin.firestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselyNonConsumablesRepository(collectionName)(db);
  const nonConsumable: PurchaselyNonConsumableDomain = nonConsumablesFactory();
  const expectedNonConsumable = {
    ...nonConsumable,
    properties: {
      ...nonConsumable.properties,
      purchased_at: nonConsumable.properties.purchased_at.setZone("UTC").toISO(),
    },
    received_at: nonConsumable.received_at.setZone("UTC").toISO(),
  };
  await repository.create(nonConsumable.id, nonConsumable);
  const firestoreDoc = await db.collection(collectionName).doc(nonConsumable.id).get();
  const fetchedNonConsumable = firestoreDoc.data();
  const mappedNonConsumable = firestoreNonConsumableToStringDateNonConsumable(fetchedNonConsumable);
  t.deepEqual(mappedNonConsumable, expectedNonConsumable);
})