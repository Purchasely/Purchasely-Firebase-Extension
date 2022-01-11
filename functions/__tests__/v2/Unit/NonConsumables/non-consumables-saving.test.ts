import test from "ava";
import { DateTime } from "luxon";

import { defaultNonConsumableEvent as defaultWebhookEvent } from "../../_webhookEventFactory";
import { servicesFactory } from "../../_servicesFactory";

import { saveNonConsumable } from "../../../../src/v2/purchasely-webhook/non-consumables-webhook-event.controller"
import { PurchaselyNonConsumableDomain } from "../../../../src/v2/purchasely-non-consumables/domain/purchasely-non-consumable.domain";


test("Non Consumablesaving returns null if service is null", async t => {
  const event = defaultWebhookEvent();
  const service = null;
  t.is(await saveNonConsumable(service)(event), null);
});

test("NonConsumable saving does not return null if service is not null", async t => {
  const event = defaultWebhookEvent();
  const service = servicesFactory().nonConsumables;
  t.not(await saveNonConsumable(service)(event), null);
});

test("NonConsumable Service Creation method is invoked", async t => {
  const event = defaultWebhookEvent();
  const factoryService = servicesFactory().nonConsumables;
  const service = {
    ...factoryService,
    create: (id: string, nonConsumableToCreate: PurchaselyNonConsumableDomain) => {
      t.pass();
      return factoryService.create(id, nonConsumableToCreate);
    }
  };
  t.plan(1);
  await saveNonConsumable(service)(event);
});

test("NonConsumable Service Creation method is invoked with the proper nonConsumable", async t => {
  const event = defaultWebhookEvent();
  const factoryService = servicesFactory().nonConsumables;
  const service = {
    ...factoryService,
    create: (id: string, nonConsumableToCreate: PurchaselyNonConsumableDomain) => {
      t.is(typeof nonConsumableToCreate.id, "string");
      t.deepEqual(nonConsumableToCreate.user, event.user);
      t.deepEqual(nonConsumableToCreate.properties.product, event.properties.product);
      t.deepEqual(nonConsumableToCreate.properties.app, event.properties.app);
      t.is(nonConsumableToCreate.properties.purchased_at.toISO(), DateTime.fromISO(event.properties.purchased_at).toISO());
      t.is(nonConsumableToCreate.received_at.toISO(), DateTime.fromISO(event.received_at).toISO());
      return factoryService.create(id, nonConsumableToCreate);
    }
  };
  t.plan(6);
  await saveNonConsumable(service)(event);
});
