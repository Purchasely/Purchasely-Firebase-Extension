import test from "ava";
import { DateTime } from "luxon";

import { defaultSubscriptionEvent as defaultWebhookEvent, expiredSubscriptionEvent } from "../../_webhookEventFactory";
import { servicesFactory } from "../../_servicesFactory";

import { saveSubscription } from "../../../../src/v3/purchasely-webhook/subscription-webhook-event.controller"
import { PurchaselySubscriptionDomain } from "../../../../src/v3/purchasely-subscriptions/domain/purchasely-subscription.domain";
import { PurchaselyProductPlanType } from "../../../../src/v3/purchasely-events";


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
      t.is(subscriptionToCreate.id, `${event.user_id}-${event.product}`);
      t.is(subscriptionToCreate.user.vendor_id, event.user_id);
      t.is(subscriptionToCreate.properties.product.vendor_id, event.product);
      t.is(subscriptionToCreate.properties.product.plan.type, PurchaselyProductPlanType.RENEWING_SUBSCRIPTION);
      t.is(subscriptionToCreate.properties.product.plan.vendor_id, event.plan);
      t.is(subscriptionToCreate.properties.app.package_id, event.store_app_bundle_id);
      t.is(subscriptionToCreate.properties.expires_at.toISO(), DateTime.fromISO(event.effective_next_renewal_at as string).toISO());
      t.is(subscriptionToCreate.properties.purchased_at.toISO(), DateTime.fromISO(event.purchased_at).toISO());
      t.is(subscriptionToCreate.received_at.toISO(), DateTime.fromISO(event.event_created_at).toISO());
      t.true(subscriptionToCreate.is_subscribed);
      return factoryService.create(id, subscriptionToCreate);
    }
  };
  t.plan(10);
  await saveSubscription(service)(event);
});

test("Subscriptions Service Creation method is invoked with a non subscribed subscription on SUBSCRIPTION_DEACTIVATE event", async t => {
  const event = expiredSubscriptionEvent();
  const factoryService = servicesFactory().subscriptions;
  const service = {
    ...factoryService,
    create: (id: string, subscriptionToCreate: PurchaselySubscriptionDomain) => {
      t.is(subscriptionToCreate.id, `${event.user_id}-${event.product}`);
      t.is(subscriptionToCreate.user.vendor_id, event.user_id);
      t.is(subscriptionToCreate.properties.product.vendor_id, event.product);
      t.is(subscriptionToCreate.properties.product.plan.type, PurchaselyProductPlanType.RENEWING_SUBSCRIPTION);
      t.is(subscriptionToCreate.properties.product.plan.vendor_id, event.plan);
      t.is(subscriptionToCreate.properties.app.package_id, event.store_app_bundle_id);
      t.is(subscriptionToCreate.properties.expires_at.toISO(), DateTime.fromISO(event.effective_next_renewal_at as string).toISO());
      t.is(subscriptionToCreate.properties.purchased_at.toISO(), DateTime.fromISO(event.purchased_at).toISO());
      t.is(subscriptionToCreate.received_at.toISO(), DateTime.fromISO(event.event_created_at).toISO());
      t.false(subscriptionToCreate.is_subscribed);
      return factoryService.create(id, subscriptionToCreate);
    }
  };
  t.plan(10);
  await saveSubscription(service)(event);
});