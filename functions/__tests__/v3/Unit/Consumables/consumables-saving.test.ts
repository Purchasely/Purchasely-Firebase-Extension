import test from "ava";
import { DateTime } from "luxon";

import { defaultConsumableEvent as defaultWebhookEvent } from "../../_webhookEventFactory";
import { servicesFactory } from "../../_servicesFactory";

import { saveConsumable } from "../../../../src/v3/purchasely-webhook/consumables-webhook-event.controller"
import { PurchaselyConsumableDomain } from "../../../../src/v3/purchasely-consumables/domain/purchasely-consumable.domain";
import { PurchaselyProductPlanType } from "../../../../src/v3/purchasely-events";


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
      t.is(consumableToCreate.user.vendor_id, event.user_id);
      t.is(consumableToCreate.properties.product.vendor_id, event.product);
      t.is(consumableToCreate.properties.product.plan.type, PurchaselyProductPlanType.CONSUMABLE);
      t.is(consumableToCreate.properties.product.plan.vendor_id, event.plan);
      t.is(consumableToCreate.properties.app.package_id, event.store_app_bundle_id);
      t.is(consumableToCreate.properties.purchased_at.toISO(), DateTime.fromISO(event.purchased_at).toISO());
      t.is(consumableToCreate.received_at.toISO(), DateTime.fromISO(event.event_created_at).toISO());
      return factoryService.create(id, consumableToCreate);
    }
  };
  t.plan(8);
  await saveConsumable(service)(event);
});
