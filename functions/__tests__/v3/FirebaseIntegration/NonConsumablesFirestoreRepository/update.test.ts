
import * as admin from "firebase-admin";
import test from "ava";
import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";

import { PurchaselyNonConsumablesRepository } from "../../../../src/v3/purchasely-non-consumables/repository"
import { PurchaselyNonConsumableDomain } from "../../../../src/v3/purchasely-non-consumables/domain/purchasely-non-consumable.domain"

import { nonConsumablesFactory, firestoreNonConsumableToStringDateNonConsumable } from "./_non-consumables-factory";

test("Non Consumable Update should throw", async t => {
  const firebaseAppName = uuid();
  const testApp = admin.initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = admin.firestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselyNonConsumablesRepository(collectionName)(db);
  const nonConsumable: PurchaselyNonConsumableDomain = nonConsumablesFactory();
  const nonConsumableUpdate = () => repository.update(nonConsumable.id, nonConsumable);
  await t.throwsAsync(nonConsumableUpdate, { message: "Method not implemented" });
})

test("Non Consumable should be retrievable from firestore after creation", async t => {
  const firebaseAppName = uuid();
  const testApp = admin.initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = admin.firestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselyNonConsumablesRepository(collectionName)(db);
  const nonConsumableToCreate: PurchaselyNonConsumableDomain = nonConsumablesFactory();
  const updatedNonConsumable: PurchaselyNonConsumableDomain = {
    ...nonConsumableToCreate,
    received_at: DateTime.now().plus({ minutes: 15 }),
  };
  const expectedNonConsumable = {
    ...nonConsumableToCreate,
    properties: {
      ...nonConsumableToCreate.properties,
      purchased_at: nonConsumableToCreate.properties.purchased_at.setZone("UTC").toISO(),
    },
    received_at: nonConsumableToCreate.received_at.setZone("UTC").toISO(),
  };
  await repository.create(nonConsumableToCreate.id, nonConsumableToCreate);
  try {
    await repository.update(nonConsumableToCreate.id, updatedNonConsumable);
  } catch {

  }
  const firestoreDoc = await db.collection(collectionName).doc(nonConsumableToCreate.id).get();
  const fetchedNonConsumable = firestoreDoc.data();
  const mappedNonConsumable = firestoreNonConsumableToStringDateNonConsumable(fetchedNonConsumable);
  t.deepEqual(mappedNonConsumable, expectedNonConsumable);
})