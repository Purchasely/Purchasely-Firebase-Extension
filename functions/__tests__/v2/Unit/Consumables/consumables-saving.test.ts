import test from "ava";
import { DateTime } from "luxon";

import { defaultConsumableEvent as defaultWebhookEvent } from "../../_webhookEventFactory";
import { servicesFactory } from "../../_servicesFactory";

import { saveConsumable } from "../../../../src/v2/purchasely-webhook/consumables-webhook-event.controller"
import { PurchaselyConsumableDomain } from "../../../../src/v2/purchasely-consumables/domain/purchasely-consumable.domain";


test("Consumable saving returns null if service is null", async t => {
  const event = defaultWebhookEvent();
  const service = null;
  t.is(await saveConsumable(service)(event), null);
});

test("Consumable saving does not return null if service is not null", async t => {
  const event = defaultWebhookEvent();
  const service = servicesFactory().consumables;
  t.not(await saveConsumable(service)(event), null);
});

test("Consumable Service Creation method is invoked", async t => {
  const event = defaultWebhookEvent();
  const factoryService = servicesFactory().consumables;
  const service = {
    ...factoryService,
    create: (id: string, consumableToCreate: PurchaselyConsumableDomain) => {
      t.pass();
      return factoryService.create(id, consumableToCreate);
    }
  };
  t.plan(1);
  await saveConsumable(service)(event);
});

test("Consumable Service Creation method is invoked with the proper consumable", async t => {
  const event = defaultWebhookEvent();
  const factoryService = servicesFactory().consumables;
  const service = {
    ...factoryService,
    create: (id: string, consumableToCreate: PurchaselyConsumableDomain) => {
      t.is(typeof consumableToCreate.id, "string");
      t.deepEqual(consumableToCreate.user, event.user);
      t.deepEqual(consumableToCreate.properties.product, event.properties.product);
      t.deepEqual(consumableToCreate.properties.app, event.properties.app);
      t.is(consumableToCreate.properties.purchased_at.toISO(), DateTime.fromISO(event.properties.purchased_at).toISO());
      t.is(consumableToCreate.received_at.toISO(), DateTime.fromISO(event.received_at).toISO());
      return factoryService.create(id, consumableToCreate);
    }
  };
  t.plan(6);
  await saveConsumable(service)(event);
});
