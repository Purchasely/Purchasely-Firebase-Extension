import Ajv from "ajv";
import addFormats from "ajv-formats";
import express from "express";
import bodyParser from "body-parser";
import PurchaselyWebhook from "./src/purchasely-webhook/functions";

import { PurchaselyEventsService } from "./src/purchasely-events/service";
import { PurchaselySubscriptionsService } from "./src/purchasely-subscriptions/service";
import { PurchaselyRepository } from "./src/utils/types/purchasely-repository.type";
import { PurchaselyEventDomain } from "./src/purchasely-events/domain/purchasely-event.domain";
import { PurchaselySubscriptionDomain } from "./src/purchasely-subscriptions/domain/purchasely-subscription.domain";
import { UUID } from "./src/utils/types/uuid.type";
import { PurchaselyConfig } from "./server.config";
import { FirebaseCustomClaimsRepositoryInterface } from "./src/firebase-custom-claims/repository";
import { PurchaselyFirebaseCustomClaimsDomain } from "./src/firebase-custom-claims/domain/purchasely-firebase-custom-claims.domain";
import { FirebaseCustomClaimsService } from "./src/firebase-custom-claims/service";
import { PurchaselyLoggingService } from "./src/purchasely-logging/service";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const repositories: {
  events: PurchaselyRepository<PurchaselyEventDomain>;
  firebaseCustomClaims: FirebaseCustomClaimsRepositoryInterface,
  subscriptions: PurchaselyRepository<PurchaselySubscriptionDomain>;
} = {
  events: {
    create: (id: string, item: PurchaselyEventDomain) => Promise.resolve(item),
    update: (id: string, item: PurchaselyEventDomain) => Promise.resolve(item),
    delete: (id: UUID) => Promise.resolve(),
  },
  firebaseCustomClaims: {
    create: (userId: string, item: PurchaselyFirebaseCustomClaimsDomain[]) => Promise.resolve(item),
    update: (userId: string, item: PurchaselyFirebaseCustomClaimsDomain[]) => Promise.resolve(item),
    delete: (userId: string, item: PurchaselyFirebaseCustomClaimsDomain[]) => Promise.resolve([]),
  },
  subscriptions: {
    create: (id: string, item: PurchaselySubscriptionDomain) => Promise.resolve(item),
    update: (id: string, item: PurchaselySubscriptionDomain) => Promise.resolve(item),
    delete: (id: UUID) => Promise.resolve(),
  },
};

const services = {
  events: PurchaselyConfig.destinations.purchaselyEvents.enabled ? PurchaselyEventsService(repositories.events) : null,
  firebaseCustomClaims: PurchaselyConfig.destinations.firebaseCustomClaims.enabled ? FirebaseCustomClaimsService(repositories.firebaseCustomClaims) : null,
  logs: PurchaselyLoggingService(),
  subscriptions: PurchaselyConfig.destinations.purchaselySubscriptions.enabled ? PurchaselySubscriptionsService(repositories.subscriptions) : null,
};

const port = 2000;
const app = express();

app.use(bodyParser.json());

app.post("/test", PurchaselyWebhook.purchaselyWebhookHandler(ajv)(PurchaselyConfig)(services));
app.use((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.info(`App listening at http://localhost:${port}`);
});
