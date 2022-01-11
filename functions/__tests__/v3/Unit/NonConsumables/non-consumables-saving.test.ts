import test from "ava";
import { DateTime } from "luxon";

import { defaultNonConsumableEvent as defaultWebhookEvent, refundedNonConsumableEvent } from "../../_webhookEventFactory";
import { servicesFactory } from "../../_servicesFactory";

import { deleteNonConsumable, saveNonConsumable } from "../../../../src/v3/purchasely-webhook/non-consumables-webhook-event.controller"
import { PurchaselyNonConsumableDomain } from "../../../../src/v3/purchasely-non-consumables/domain/purchasely-non-consumable.domain";
import { PurchaselyProductPlanType } from "../../../../src/v3/purchasely-events";


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
      t.is(nonConsumableToCreate.id, `${event.user_id}-${event.product}`);
      t.is(nonConsumableToCreate.user.vendor_id, event.user_id);
      t.is(nonConsumableToCreate.properties.product.vendor_id, event.product);
      t.is(nonConsumableToCreate.properties.product.plan.type, PurchaselyProductPlanType.NON_CONSUMABLE);
      t.is(nonConsumableToCreate.properties.product.plan.vendor_id, event.plan);
      t.is(nonConsumableToCreate.properties.app.package_id, event.store_app_bundle_id);
      t.is(nonConsumableToCreate.properties.purchased_at.toISO(), DateTime.fromISO(event.purchased_at).toISO());
      t.is(nonConsumableToCreate.received_at.toISO(), DateTime.fromISO(event.event_created_at).toISO());
      return factoryService.create(id, nonConsumableToCreate);
    }
  };
  t.plan(8);
  await saveNonConsumable(service)(event);
});

test("NonConsumable Service Deletion method is invoked with the proper nonConsumable", async t => {
  const event = refundedNonConsumableEvent();
  const factoryService = servicesFactory().nonConsumables;
  const service = {
    ...factoryService,
    delete: (id: string) => {
      t.is(id, `${event.user_id}-${event.product}`);
      return factoryService.delete(id);
    }
  };
  t.plan(1);
  await deleteNonConsumable(service)(event);
});