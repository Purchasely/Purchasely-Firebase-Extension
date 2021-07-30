
import * as admin from "firebase-admin";
import test from "ava";
import { v4 as uuid } from "uuid";

import { PurchaselyEventsRepository } from "../../../src/purchasely-events/repository"
import { PurchaselyEventDomain } from "../../../src/purchasely-events/domain/purchasely-event.domain";

import { eventsFactory } from "./_events-factory";

test("Event Deletion should not throw if Event exists", async t => {
  const firebaseAppName = uuid();
  const testApp = admin.initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = admin.firestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselyEventsRepository(collectionName)(db);
  const event: PurchaselyEventDomain = eventsFactory();
  await repository.create(event.id, event);
  const eventDeletion = async () => repository.delete(event.id);
  t.notThrows(await eventDeletion);
})

test("Event Deletion should return void", async t => {
  const firebaseAppName = uuid();
  const testApp = admin.initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = admin.firestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselyEventsRepository(collectionName)(db);
  const event: PurchaselyEventDomain = eventsFactory();
  await repository.create(event.id, event);
  const deletedEventResponse = await repository.delete(event.id);
  t.is(deletedEventResponse, undefined);
})

test("Event should not be retrievable from firestore after deletion", async t => {
  const firebaseAppName = uuid();
  const testApp = admin.initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = admin.firestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselyEventsRepository(collectionName)(db);
  const event: PurchaselyEventDomain = eventsFactory();
  await repository.create(event.id, event);
  await repository.delete(event.id);
  const firestoreDoc = await db.collection(collectionName).doc(event.id).get();
  const fetchedEvent = firestoreDoc.data();
  t.deepEqual(fetchedEvent, undefined);
})