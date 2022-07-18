import test from "ava";
import { DateTime } from "luxon";

import { defaultSubscriptionEvent as defaultWebhookEvent, expiredSubscriptionEvent } from "../../_webhookEventFactory";
import { servicesFactory } from "../../_servicesFactory";

import { saveSubscription } from "../../../../src/v2/purchasely-webhook/subscription-webhook-event.controller"
import { PurchaselySubscriptionDomain } from "../../../../src/v2/purchasely-subscriptions/domain/purchasely-subscription.domain";


test("Subscription saving returns null if service is null", async t => {
  const event = defaultWebhookEvent();
  const service = null;
  t.is(await saveSubscription(service)(event), null);
});

test("Subscription saving does not return null if service is not null", async t => {
  const event = defaultWebhookEvent();
  const service = servicesFactory().subscriptions;
  t.not(await saveSubscription(service)(event), null);
});

test("Subscriptions Service Creation method is invoked", async t => {
  const event = defaultWebhookEvent();
  const factoryService = servicesFactory().subscriptions;
  const service = {
    ...factoryService,
    create: (id: string, subscriptionToCreate: PurchaselySubscriptionDomain) => {
      t.pass();
      return factoryService.create(id, subscriptionToCreate);
    }
  };
  t.plan(1);
  await saveSubscription(service)(event);
});

test("Subscriptions Service Creation method is invoked with the proper subscription", async t => {
  const event = defaultWebhookEvent();
  const factoryService = servicesFactory().subscriptions;
  const service = {
    ...factoryService,
    create: (id: string, subscriptionToCreate: PurchaselySubscriptionDomain) => {
      t.is(typeof subscriptionToCreate.id, "string");
      t.deepEqual(subscriptionToCreate.user, { anonymous_id: event.user.anonymous_id ?? null, vendor_id: event.user.vendor_id ?? null });
      t.deepEqual(subscriptionToCreate.properties.product, event.properties.product);
      t.deepEqual(subscriptionToCreate.properties.app, event.properties.app);
      t.is(subscriptionToCreate.properties.expires_at.toISO(), DateTime.fromISO(event.properties.expires_at).toISO());
      t.is(subscriptionToCreate.properties.purchased_at.toISO(), DateTime.fromISO(event.properties.purchased_at).toISO());
      t.is(subscriptionToCreate.received_at.toISO(), DateTime.fromISO(event.received_at).toISO());
      t.true(subscriptionToCreate.is_subscribed);
      return factoryService.create(id, subscriptionToCreate);
    }
  };
  t.plan(8);
  await saveSubscription(service)(event);
});

test("Subscriptions Service Creation method is invoked with a non subscribed subscription on SUBSCRIPTION_EXPIRED event", async t => {
  const event = expiredSubscriptionEvent();
  const factoryService = servicesFactory().subscriptions;
  const service = {
    ...factoryService,
    create: (id: string, subscriptionToCreate: PurchaselySubscriptionDomain) => {
      t.is(subscriptionToCreate.id, `${event.user.vendor_id}-${event.properties.product.vendor_id}`);
      t.is(id, subscriptionToCreate.id);
      t.deepEqual(subscriptionToCreate.user, { anonymous_id: event.user.anonymous_id ?? null, vendor_id: event.user.vendor_id ?? null });
      t.deepEqual(subscriptionToCreate.properties.product, event.properties.product);
      t.deepEqual(subscriptionToCreate.properties.app, event.properties.app);
      t.is(subscriptionToCreate.properties.expires_at.toISO(), DateTime.fromISO(event.properties.expires_at).toISO());
      t.is(subscriptionToCreate.properties.purchased_at.toISO(), DateTime.fromISO(event.properties.purchased_at).toISO());
      t.is(subscriptionToCreate.received_at.toISO(), DateTime.fromISO(event.received_at).toISO());
      t.false(subscriptionToCreate.is_subscribed);
      return factoryService.create(id, subscriptionToCreate);
    }
  };
  t.plan(9);
  await saveSubscription(service)(event);
});