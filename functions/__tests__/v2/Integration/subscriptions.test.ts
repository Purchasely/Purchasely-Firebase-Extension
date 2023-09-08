import test from "ava";
import sinon from 'sinon';

import Ajv from "ajv";
import addFormats from "ajv-formats";

import { defaultSubscriptionEvent as defaultWebhookEvent } from "../_webhookEventFactory";
import { configFactory } from "../../_configFactory";
import { servicesFactory } from "../_servicesFactory";
import { requestFactory } from "../_requestsFactory";

import { functions } from "../../../src/v2/purchasely-webhook/functions";

test("Subscription Webhook Event returns nothing", async t => {
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);

  const event = defaultWebhookEvent();
  const config = configFactory();
  const { request, response } = requestFactory(config.sharedSecret)(event);
  const services = servicesFactory();
  const webhookHandler = functions.purchaselyWebhookHandler(ajv)(config)(services);

  t.is(await webhookHandler(request, response), undefined);
});

test("Subscription Webhook Event only sends a single HTTP Response", async t => {
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);

  const event = defaultWebhookEvent();
  const config = configFactory();
  const { request, response } = requestFactory(config.sharedSecret)(event);

  response.send = sinon.spy();

  const services = servicesFactory();
  const webhookHandler = functions.purchaselyWebhookHandler(ajv)(config)(services);
  await webhookHandler(request, response);

  t.is((response.send as sinon.SinonSpy<any[], any>).calledOnce, true);
});

test("Subscription Webhook Event responds with a 200 HTTP Status Code", async t => {
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);

  const event = defaultWebhookEvent();
  const config = configFactory();
  const { request, response } = requestFactory(config.sharedSecret)(event);

  response.status = sinon.spy((_statusCode: number) => response);

  const services = servicesFactory();
  const webhookHandler = functions.purchaselyWebhookHandler(ajv)(config)(services);
  await webhookHandler(request, response);

  t.is((response.status as sinon.SinonSpy<any[], any>).calledOnceWithExactly(200), true);
});

test("Subscription Webhook Event responds with the expected body", async t => {
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);

  const event = defaultWebhookEvent();
  const expectedBody = {
    clientType: "PURCHASELY_FIREBASE_EXTENSION",
    clientVersion: "1.0.8",
    handledApiVersion: "2"
  };

  const config = configFactory();
  const { request, response } = requestFactory(config.sharedSecret)(event);

  response.send = sinon.spy((_body: any) => response);

  const services = servicesFactory();
  const webhookHandler = functions.purchaselyWebhookHandler(ajv)(config)(services);
  await webhookHandler(request, response);

  t.is((response.send as sinon.SinonSpy<any[], any>).calledOnceWithExactly(expectedBody), true);
});

test("Subscription Webhook Event with the wrong signature responds with a 401 HTTP Status", async t => {
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);

  const event = defaultWebhookEvent();

  const config = configFactory();
  const { request, response } = requestFactory("invalid-secret")(event);

  response.status = sinon.spy((_body: any) => response);

  const services = servicesFactory();
  const webhookHandler = functions.purchaselyWebhookHandler(ajv)(config)(services);
  await webhookHandler(request, response);

  t.is((response.status as sinon.SinonSpy<any[], any>).calledOnceWithExactly(401), true);
});

test("Subscription Webhook Event with the wrong signature does not respond with a body", async t => {
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);

  const event = defaultWebhookEvent();

  const config = configFactory();
  const { request, response } = requestFactory("invalid-secret")(event);

  response.send = sinon.spy((_body: any) => response);

  const services = servicesFactory();
  const webhookHandler = functions.purchaselyWebhookHandler(ajv)(config)(services);
  await webhookHandler(request, response);

  t.is((response.send as sinon.SinonSpy<any[], any>).calledOnceWithExactly(), true);
});
