import test from "ava";

import { defaultSubscriptionEvent as defaultWebhookEvent, expiredSubscriptionEvent } from "../../_webhookEventFactory";
import { servicesFactory } from "../../_servicesFactory";

import { saveFirebaseCustomClaims } from "../../../../src/v3/purchasely-webhook/subscription-webhook-event.controller"
import { PurchaselyFirebaseCustomClaimsDomain } from "../../../../src/v3/firebase-custom-claims/domain/purchasely-firebase-custom-claims.domain";

test("Custom Claims saving returns null if service is null", async t => {
  const event = defaultWebhookEvent();
  const service = null;
  t.is(await saveFirebaseCustomClaims(service)(event), null);
});

test("Custom Claims saving does not return null if service is not null", async t => {
  const event = defaultWebhookEvent();
  const service = servicesFactory().firebaseCustomClaims;
  t.not(await saveFirebaseCustomClaims(service)(event), null);
});

test("Custom Claims saving returns null if event's user.vendor_id is undefined", async t => {
  const event = {
    ...defaultWebhookEvent(),
    user_id: undefined,
  };
  const service = servicesFactory().firebaseCustomClaims;
  t.is(await saveFirebaseCustomClaims(service)(event), null);
});

test("Custom Claims saving does not return null if event's user.vendor_id is defined", async t => {
  const event = defaultWebhookEvent();
  const service = servicesFactory().firebaseCustomClaims;
  t.not(await saveFirebaseCustomClaims(service)(event), null);
});

test("Custom Claims Service Creation method is invoked", async t => {
  const event = defaultWebhookEvent();
  const factoryService = servicesFactory().firebaseCustomClaims;
  const service = {
    ...factoryService,
    create: (id: string, customClaimsToCreate: PurchaselyFirebaseCustomClaimsDomain[]) => {
      t.pass();
      return factoryService.create(id, customClaimsToCreate);
    }
  };
  t.plan(1);
  await saveFirebaseCustomClaims(service)(event);
});

test("Custom Claims Service Creation method is invoked with the proper custom claims", async t => {
  const event = defaultWebhookEvent();
  const factoryService = servicesFactory().firebaseCustomClaims;
  const service = {
    ...factoryService,
    create: (id: string, customClaimsToCreate: PurchaselyFirebaseCustomClaimsDomain[]) => {
      t.true(Array.isArray(customClaimsToCreate));
      t.is(id, event.user_id);

      const [customClaims] = customClaimsToCreate;
      t.deepEqual(customClaims, { product: event.product, plan: event.plan });
      return factoryService.create(id, customClaimsToCreate);
    }
  };
  t.plan(3);
  await saveFirebaseCustomClaims(service)(event);
});

test("Custom Claims Service Creation method does not duplicate custom claims if already present", async t => {
  const event = defaultWebhookEvent();
  const services = servicesFactory();
  const factoryService = services.firebaseCustomClaims;
  await factoryService.create(event.user_id as string, [{ product: event.product, plan: event.plan as string }]);
  const service = factoryService;
  await saveFirebaseCustomClaims(service)(event);
  const customClaims = await services.customClaimsRepository.get(event.user_id as string);
  t.deepEqual(customClaims.purchasely_subscriptions, [{ product: event.product, plan: event.plan }])
});

test("Custom Claims Service Creation method is not invoked on SUBSCRIPTION_EXPIRED event", async t => {
  const event = expiredSubscriptionEvent();
  const factoryService = servicesFactory().firebaseCustomClaims;
  const service = {
    ...factoryService,
    create: (id: string, customClaimsToCreate: PurchaselyFirebaseCustomClaimsDomain[]) => {
      t.fail();
      return factoryService.create(id, customClaimsToCreate);
    }
  };
  t.plan(0);
  await saveFirebaseCustomClaims(service)(event);
});

test("Custom Claims Service Deletion method is invoked on SUBSCRIPTION_EXPIRED event", async t => {
  const event = expiredSubscriptionEvent();
  const factoryService = servicesFactory().firebaseCustomClaims;
  const service = {
    ...factoryService,
    delete: (id: string, customClaimsToCreate: PurchaselyFirebaseCustomClaimsDomain[]) => {
      t.pass();
      return factoryService.create(id, customClaimsToCreate);
    }
  };
  t.plan(1);
  await saveFirebaseCustomClaims(service)(event);
});

test("Custom Claims Service Deletion method is invoked with the right custom claims on SUBSCRIPTION_EXPIRED event", async t => {
  const event = expiredSubscriptionEvent();
  const factoryService = servicesFactory().firebaseCustomClaims;
  const service = {
    ...factoryService,
    delete: (id: string, customClaimsToDelete: PurchaselyFirebaseCustomClaimsDomain[]) => {
      t.true(Array.isArray(customClaimsToDelete));
      t.is(id, event.user_id);

      const [customClaims] = customClaimsToDelete;
      t.deepEqual(customClaims, { product: event.product, plan: event.plan });
      return factoryService.delete(id, customClaimsToDelete);
    }
  };
  t.plan(3);
  await saveFirebaseCustomClaims(service)(event);
});

test("Custom Claims Service Deletion method correctly deletes the custom claims on SUBSCRIPTION_EXPIRED event", async t => {
  const event = expiredSubscriptionEvent();
  const services = servicesFactory();
  const factoryService = services.firebaseCustomClaims;
  await factoryService.create(event.user_id as string, [{ product: event.product, plan: event.plan  as string }]);
  const service = factoryService;
  await saveFirebaseCustomClaims(service)(event);
  const customClaims = await services.customClaimsRepository.get(event.user_id as string);
  t.deepEqual(customClaims.purchasely_subscriptions, []);
});