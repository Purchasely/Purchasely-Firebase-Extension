import test from "ava";
import { DateTime } from "luxon";

import { defaultSubscriptionEvent as defaultWebhookEvent } from "../../_webhookEventFactory";
import { servicesFactory } from "../../_servicesFactory";

import { saveSubscriptionEvent } from "../../../../src/v2/purchasely-webhook/subscription-webhook-event.controller"
import { PurchaselyEventDomain } from "../../../../src/v2/purchasely-events/domain/purchasely-event.domain";


test("Event saving returns null if service is null", async t => {
  const event = defaultWebhookEvent();
  const service = null;
  t.is(await saveSubscriptionEvent(service)(event), null);
});

test("Event saving does not return null if service is not null", async t => {
  const event = defaultWebhookEvent();
  const service = servicesFactory().events;
  t.not(await saveSubscriptionEvent(service)(event), null);
});

test("Events Service Creation method is invoked", async t => {
  const event = defaultWebhookEvent();
  const factoryService = servicesFactory().events;
  const service = {
    ...factoryService,
    create: (id: string, eventToCreate: PurchaselyEventDomain) => {
      t.pass();
      return factoryService.create(id, eventToCreate);
    }
  };
  t.plan(1);
  await saveSubscriptionEvent(service)(event);
});

test("Events Service Creation method is invoked with the proper event", async t => {
  const event = defaultWebhookEvent();
  const factoryService = servicesFactory().events;
  const service = {
    ...factoryService,
    create: (id: string, eventToCreate: PurchaselyEventDomain) => {
      t.is(typeof eventToCreate.id, "string");
      t.is(eventToCreate.name, event.name);
      t.deepEqual(eventToCreate.user, { anonymous_id: event.user.anonymous_id ?? null, vendor_id: event.user.vendor_id ?? null});
      t.deepEqual(eventToCreate.properties.product, event.properties.product);
      t.is(eventToCreate.properties.store, event.properties.store);
      t.deepEqual(eventToCreate.properties.app, event.properties.app);
      t.not(eventToCreate.properties.expires_at, undefined);
      t.is((eventToCreate.properties.expires_at as DateTime).toISO(), DateTime.fromISO(event.properties.expires_at).toISO());
      t.is(eventToCreate.properties.purchased_at.toISO(), DateTime.fromISO(event.properties.purchased_at).toISO());
      t.is(eventToCreate.received_at.toISO(), DateTime.fromISO(event.received_at).toISO());
      return factoryService.create(id, eventToCreate);
    }
  };
  t.plan(10);
  await saveSubscriptionEvent(service)(event);
});