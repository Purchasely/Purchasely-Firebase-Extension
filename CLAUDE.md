# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A **Firebase Extension** — not a regular Firebase project. This means:

- The root defines the extension itself: `extension.yaml` (manifest), `PREINSTALL.md`/`POSTINSTALL.md` (marketplace docs), `firebase.json` (emulator config for local dev).
- All Cloud Functions source lives in `functions/` — this is where the actual code, tests, and build config are.
- Configuration is declared as **extension params** in `extension.yaml` and injected as environment variables at runtime. There is no `.env` file or hardcoded config — Firebase handles param injection when the extension is installed.

The extension receives Purchasely webhook events (in-app purchases & subscriptions), syncs them to Cloud Firestore, and optionally updates Firebase Auth custom claims with subscription status. Published as `purchasely/purchasely-in-app-purchases`.

## Commands

All commands run from `functions/`:

```bash
cd functions

# Build
npm run build              # tsc --build tsconfig.json

# Lint
npm run lint               # eslint '**/*.ts'
npm run lint:fix
npm run prettier           # prettier -c .
npm run prettier:fix

# Test (requires Firestore emulator)
firebase emulators:exec --only firestore "cd ./functions && npm test"
# npm test = nyc --reporter html --reporter text ava --verbose

# Run a single test file
firebase emulators:exec --only firestore "cd ./functions && npx ava --verbose functions/__tests__/v3/Unit/event-signature-validation.test.ts"
```

Tests use **ava** with `ts-node/register`. Integration tests hit the Firestore emulator on `localhost:8080`. Unit tests use sinon stubs.

## Known Issue: tsconfig and ts-node

ICM context: `ignoreDeprecations: "6.0"` in tsconfig.json breaks ts-node (TS5103 error). If added for build fixes, the valid value is `"5.0"`, or better: change `moduleResolution: "node"` to `"node16"`/`"nodenext"` and remove `ignoreDeprecations` entirely.

## Architecture

### Single Cloud Function entry point

`functions/src/functions.ts` — exports `purchaselyWebhookHandler`, an HTTPS Cloud Function that:

1. Validates HMAC signature (`X-PURCHASELY-SIGNATURE` header) against the shared secret
2. Validates request body with AJV JSON Schema
3. Routes to v2 or v3 handler based on `request.body.api_version`
4. Dispatches to the correct controller by `purchase_type` (subscription, consumable, non-consumable)

### Versioned webhook handlers (v2 / v3)

`functions/src/v2/` and `functions/src/v3/` are parallel structures, each containing:

- `purchasely-webhook/` — controllers + DTO schemas + signature validation
- `purchasely-subscriptions/` — domain model, service, Firestore repository
- `purchasely-consumables/` — same pattern
- `purchasely-non-consumables/` — same pattern
- `purchasely-events/` — raw event storage
- `firebase-custom-claims/` — Auth custom claims management
- `customer-users/` — user domain
- `services.ts` — wires repositories and services together

Each module follows: **domain model → service → Firestore repository**, composed via curried factory functions (not classes/DI).

### Configuration

`functions/src/purchasely.config.ts` — reads all config from environment variables set by Firebase Extensions params (`extension.yaml`). Key params: `PURCHASELY_SHARED_SECRET`, collection names, `UPDATE_FIREBASE_AUTH_CUSTOM_CLAIMS`, `LOCATION`.

### Test structure

```
functions/__tests__/
├── _configFactory.ts          # shared config builder
├── v2/ and v3/
│   ├── _webhookEventFactory.ts
│   ├── _requestsFactory.ts
│   ├── _servicesFactory.ts
│   ├── Unit/                  # sinon stubs, no emulator needed
│   └── FirebaseIntegration/   # Firestore emulator CRUD tests
```

### Extension manifest

`extension.yaml` — defines the extension's params, roles (`firebaseauth.admin`, `datastore.user`), and the single Cloud Function resource. Current version: `1.0.9`, runtime: `nodejs22`.

## CI

GitHub Actions (`.github/workflows/`):

- **ci-pr.yml** — build → test (with Firestore emulator) → coverage archive
- **ci-develop.yml** — same + deploy to Purchasely's Firebase project using `FIREBASE_TOKEN` and `PURCHASELY_SHARED_SECRET` secrets
- Node version: `lts/jod` (Node 22)
