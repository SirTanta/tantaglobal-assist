import assert from "node:assert/strict";
import test from "node:test";

import {
  PUBLIC_ASSISTANT_FAILURE_COPY,
  canRetryPublicAssistant,
  hasPublicAssistantGateway,
  shouldClosePublicAssistant,
} from "../src/lib/public-assistant-ui";

test("the public assistant only treats an explicit gateway key as configured", () => {
  assert.equal(hasPublicAssistantGateway({}), false);
  assert.equal(hasPublicAssistantGateway({ AI_GATEWAY_API_KEY: "   " }), false);
  assert.equal(hasPublicAssistantGateway({ AI_GATEWAY_API_KEY: "configured-key" }), true);
});

test("Escape closes only an open public assistant", () => {
  assert.equal(shouldClosePublicAssistant(true, "Escape"), true);
  assert.equal(shouldClosePublicAssistant(false, "Escape"), false);
  assert.equal(shouldClosePublicAssistant(true, "Enter"), false);
});

test("retry is only available after the current request has settled", () => {
  assert.equal(canRetryPublicAssistant("ready"), true);
  assert.equal(canRetryPublicAssistant("streaming"), false);
  assert.equal(canRetryPublicAssistant("submitted"), false);
});

test("failure copy explicitly preserves the visitor's page access", () => {
  assert.match(PUBLIC_ASSISTANT_FAILURE_COPY, /rest of this page is still available/i);
});
