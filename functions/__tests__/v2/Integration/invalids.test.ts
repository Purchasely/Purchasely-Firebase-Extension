import test from "ava";
import sinon from 'sinon';

import Ajv from "ajv";
import addFormats from "ajv-formats";
import { v4 as uuid } from "uuid";

import { defaultConsumableEvent as consumableWebhookEvent, defaultSubscriptionEvent as subscriptionWebhookEvent } from "../_webhookEventFactory";
import { configFactory } from "../../_configFactory";
import { servicesFactory } from "../_servicesFactory";
import { requestFactory } from "../_requestsFactory";

import { functions } from "../../../src/v2/purchasely-webhook/functions";
import { PurchaselyProductPlanType } from "../../../src/v2/purchasely-events/domain/purchasely-product-plan-type.enum";

test("Invalid Signature responds with 401", async t => {
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);

  const event = {};
  const config = configFactory();
  const { request, response } = requestFactory("not-a-shared-secret")(event);
  response.status = sinon.spy((_statusCode: number) => response);
  response.send = sinon.spy((_body: any) => response);

  const services = servicesFactory();
  const webhookHandler = functions.purchaselyWebhookHandler(ajv)(config)(services);

  await webhookHandler(request, response);

  t.is((response.status as sinon.SinonSpy<any[], any>).calledOnceWithExactly(401), true);
  t.is((response.send as sinon.SinonSpy<any[], any>).calledOnceWithExactly(), true);
});

test("Invalid Webhook Event Product Plan Type responds with 400", async t => {
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);

  const correctEvent = consumableWebhookEvent();
  const event = {
    ...correctEvent,
    properties: {
      ...correctEvent.properties,
      product: {
        ...correctEvent.properties.product,
        plan: {
          ...correctEvent.properties.product.plan,
          type: uuid(),
        }
      }
    }
  }
  const config = configFactory();
  const { request, response } = requestFactory(config.sharedSecret)(event);

  response.status = sinon.spy((_statusCode: number) => response);
  response.send = sinon.spy((_body: any) => response);

  const services = servicesFactory();
  const webhookHandler = functions.purchaselyWebhookHandler(ajv)(config)(services);
  await webhookHandler(request, response);

  t.is((response.status as sinon.SinonSpy<any[], any>).calledOnceWithExactly(400), true);
  t.is((response.send as sinon.SinonSpy<any[], any>).calledOnce, true);
});

test("Valid Webhook Event with Consumable Event Plan Type but Subscription body responds with 200", async t => {
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);

  const subscriptionEvent = subscriptionWebhookEvent();
  const event = {
    ...subscriptionEvent,
    properties: {
      ...subscriptionEvent.properties,
      product: {
        ...subscriptionEvent.properties.product,
        plan: {
          ...subscriptionEvent.properties.product.plan,
          type: PurchaselyProductPlanType.CONSUMABLE,
        }
      }
    }
  }
  const config = configFactory();
  const { request, response } = requestFactory(config.sharedSecret)(event);

  const expectedBody = {
    clientType: "PURCHASELY_FIREBASE_EXTENSION",
    clientVersion: "0.0.2",
    handledApiVersion: "2"
  };

  response.status = sinon.spy((_statusCode: number) => response);
  response.send = sinon.spy((_body: any) => response);

  const services = servicesFactory();
  const webhookHandler = functions.purchaselyWebhookHandler(ajv)(config)(services);
  await webhookHandler(request, response);

  t.is((response.status as sinon.SinonSpy<any[], any>).calledOnceWithExactly(200), true);
  t.is((response.send as sinon.SinonSpy<any[], any>).calledOnceWithExactly(expectedBody), true);
});

test("Valid Webhook Event with Subscription Event Plan Type but Consumable body responds with 500", async t => {
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);

  const subscriptionEvent = consumableWebhookEvent();
  const event = {
    ...subscriptionEvent,
    properties: {
      ...subscriptionEvent.properties,
      product: {
        ...subscriptionEvent.properties.product,
        plan: {
          ...subscriptionEvent.properties.product.plan,
          type: PurchaselyProductPlanType.RENEWING_SUBSCRIPTION,
        }
      }
    }
  }
  const config = configFactory();
  const { request, response } = requestFactory(config.sharedSecret)(event);

  response.status = sinon.spy((_statusCode: number) => response);
  response.send = sinon.spy((_body: any) => response);

  const services = servicesFactory();
  const webhookHandler = functions.purchaselyWebhookHandler(ajv)(config)(services);
  await webhookHandler(request, response);

  t.is((response.status as sinon.SinonSpy<any[], any>).calledOnceWithExactly(500), true);
  t.is((response.send as sinon.SinonSpy<any[], any>).calledOnce, true);
});

test("Empty body in webhook event responds with 400", async t => {
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);

  const event = {};
  const config = configFactory();
  const { request, response } = requestFactory(config.sharedSecret)(event);

  response.status = sinon.spy((_statusCode: number) => response);
  response.send = sinon.spy((_body: any) => response);

  const services = servicesFactory();
  const webhookHandler = functions.purchaselyWebhookHandler(ajv)(config)(services);
  await webhookHandler(request, response);


  t.is((response.status as sinon.SinonSpy<any[], any>).calledOnceWithExactly(400), true);
  t.is((response.send as sinon.SinonSpy<any[], any>).calledOnce, true);
});

test("Random body in webhook event responds with 400", async t => {
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);

  const event = {
    "random-property": uuid(),
  };
  const config = configFactory();
  const { request, response } = requestFactory(config.sharedSecret)(event);

  response.status = sinon.spy((_statusCode: number) => response);
  response.send = sinon.spy((_body: any) => response);

  const services = servicesFactory();
  const webhookHandler = functions.purchaselyWebhookHandler(ajv)(config)(services);
  await webhookHandler(request, response);


  t.is((response.status as sinon.SinonSpy<any[], any>).calledOnceWithExactly(400), true);
  t.is((response.send as sinon.SinonSpy<any[], any>).calledOnce, true);
});
