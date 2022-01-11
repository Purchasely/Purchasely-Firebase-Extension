import test from "ava";

import { requestFactory } from "../_requestsFactory"

import { eventHeaderSignatureIsValid } from "../../../src/v2/purchasely-webhook/functions"

test("Validation should fail for the wrong sharedSecret", t => {
  const { request } = requestFactory("a_shared_secret")(null);
  t.false(eventHeaderSignatureIsValid("wrong_shared_secret")(request))
})

test("Validation should succeed for the right sharedSecret", t => {
  const { request } = requestFactory("a_shared_secret")(null);
  t.true(eventHeaderSignatureIsValid("a_shared_secret")(request))
})