
import * as admin from "firebase-admin";
import test from "ava";
import { v4 as uuid } from "uuid";

import { PurchaselyEventsRepository } from "../../../../src/v2/purchasely-events/repository";
import { PurchaselyEventDomain } from "../../../../src/v2/purchasely-events/domain/purchasely-event.domain";

import { eventsFactory, firestoreEventToStringDateEvent } from "./_events-factory";

test("Event Creation should not throw", async t => {
  const firebaseAppName = uuid();
  const testApp = admin.initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = admin.firestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselyEventsRepository(collectionName)(db);
  const event: PurchaselyEventDomain = eventsFactory();
  const eventCreation = async () => await repository.create(event.id, event);
  t.notThrows(await eventCreation);
})

test("Event Creation should return the right Event", async t => {
  const firebaseAppName = uuid();
  const testApp = admin.initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = admin.firestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselyEventsRepository(collectionName)(db);
  const event: PurchaselyEventDomain = eventsFactory();
  const createdEvent = await repository.create(event.id, event);
  t.deepEqual(createdEvent, event);
})

test("Event should be retrievable from firestore after creation", async t => {
  const firebaseAppName = uuid();
  const testApp = admin.initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = admin.firestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselyEventsRepository(collectionName)(db);
  const event: PurchaselyEventDomain = eventsFactory();
  const expectedEvent = {
    ...event,
    properties: {
      ...event.properties,
      purchased_at: event.properties.purchased_at.setZone("UTC").toISO(),
      expires_at: event.properties.expires_at?.setZone("UTC").toISO(),
    },
    received_at: event.received_at.setZone("UTC").toISO(),
  };
  await repository.create(event.id, event);
  const firestoreDoc = await db.collection(collectionName).doc(event.id).get();
  const fetchedEvent = firestoreDoc.data();
  const mappedEvent = firestoreEventToStringDateEvent(fetchedEvent);
  t.deepEqual(mappedEvent, expectedEvent);
})