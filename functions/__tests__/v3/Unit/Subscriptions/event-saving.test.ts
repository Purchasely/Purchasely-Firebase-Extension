import test from "ava";
import { DateTime } from "luxon";

import { defaultSubscriptionEvent as defaultWebhookEvent } from "../../_webhookEventFactory";
import { servicesFactory } from "../../_servicesFactory";

import { saveSubscriptionEvent } from "../../../../src/v3/purchasely-webhook/subscription-webhook-event.controller"
import { PurchaselyEventDomain } from "../../../../src/v3/purchasely-events/domain/purchasely-event.domain";


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
      t.is(eventToCreate.event_name, event.event_name);
      t.is(eventToCreate.user_id, event.user_id);
      t.is(eventToCreate.product, event.product);
      t.is(eventToCreate.store, event.store);
      t.is(eventToCreate.store_app_bundle_id, event.store_app_bundle_id);
      t.not(eventToCreate.effective_next_renewal_at, undefined);
      t.is((eventToCreate.effective_next_renewal_at as DateTime).toISO(), DateTime.fromISO(event.effective_next_renewal_at as string).toISO());
      t.is(eventToCreate.purchased_at.toISO(), DateTime.fromISO(event.purchased_at).toISO());
      t.is(eventToCreate.event_created_at.toISO(), DateTime.fromISO(event.event_created_at).toISO());
      return factoryService.create(id, eventToCreate);
    }
  };
  t.plan(10);
  await saveSubscriptionEvent(service)(event);
});