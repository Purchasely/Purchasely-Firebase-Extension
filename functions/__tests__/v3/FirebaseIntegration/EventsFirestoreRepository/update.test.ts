
import * as admin from "firebase-admin";
import test from "ava";
import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";

import { PurchaselyEventsRepository } from "../../../../src/v3/purchasely-events/repository";
import { PurchaselyEventDomain } from "../../../../src/v3/purchasely-events/domain/purchasely-event.domain";

import { eventsFactory, firestoreEventToStringDateEvent } from "./_events-factory";

test("Event Update should throw", async t => {
  const firebaseAppName = uuid();
  const testApp = admin.initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = admin.firestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselyEventsRepository(collectionName)(db);
  const event: PurchaselyEventDomain = eventsFactory();
  const eventUpdate = () => repository.update(event.id, event);
  await t.throwsAsync(eventUpdate, { message: "Method not implemented" });
})

test("Event should be retrievable from firestore after update", async t => {
  const firebaseAppName = uuid();
  const testApp = admin.initializeApp({ projectId: uuid() }, firebaseAppName)
  const db = admin.firestore(testApp);
  const collectionName = uuid();
  const repository = PurchaselyEventsRepository(collectionName)(db);
  const eventToCreate: PurchaselyEventDomain = eventsFactory();
  const updatedEvent: PurchaselyEventDomain = {
    ...eventToCreate,
    event_created_at: DateTime.now().plus({ minutes: 15 }),
  };
  const expectedEvent = {
    ...eventToCreate,
    auto_resume_at: null,
    defer_end_at: null,
    grace_period_expires_at: null,
    next_renewal_at: null,
    original_purchased_at: null,
    purchased_at: eventToCreate.purchased_at.setZone("UTC").toISO(),
    effective_next_renewal_at: eventToCreate.effective_next_renewal_at?.setZone("UTC").toISO(),
    event_created_at: eventToCreate.event_created_at.setZone("UTC").toISO(),
  };
  await repository.create(eventToCreate.id, eventToCreate);
  try {
    await repository.update(eventToCreate.id, updatedEvent);
  } catch {

  }
  const firestoreDoc = await db.collection(collectionName).doc(eventToCreate.id).get();
  const fetchedEvent = firestoreDoc.data();
  const mappedEvent = firestoreEventToStringDateEvent(fetchedEvent);
  t.deepEqual(mappedEvent, expectedEvent);
})