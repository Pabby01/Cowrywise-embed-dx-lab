# Cowrywise Embed Developer Experience Lab

**Independent developer-experience case study + TypeScript starter scaffold**

This repository explores how a developer could approach the Cowrywise Embed integration journey. It is intentionally small and safe to run without Cowrywise credentials.

## Scope and honesty notes

- This project has **not** authenticated against Cowrywise Embed.
- `mock` mode is the default and uses synthetic data.
- The adapter boundary is illustrative; it does not claim the official Cowrywise SDK exposes the methods used here.
- Do not use real customer data or production credentials in this demo.
- Before implementing a live adapter, validate the current API contract, credential process, SDK version, and terms with Cowrywise.

## What this demonstrates

- TypeScript project structure and typed domain objects.
- Safe separation of configuration from code.
- A small service layer that runs in mock mode.
- Tests for predictable demo behavior.
- An evidence-based developer-experience audit and prioritized recommendations.

## Requirements

- Node.js 20+ (LTS recommended)
- npm

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
npm test
npm run typecheck
```

The demo prints a synthetic portfolio summary. It does not call Cowrywise.

## Project structure

```text
src/
  config.ts
  types.ts
  embed-client.ts
  index.ts
test/
  embed-client.test.ts
docs/
  developer-experience-audit.md
  validation-checklist.md
.env.example
```

## Moving from mock to live

Do not simply replace the mock URL and assume integration is complete. A live adapter should only be implemented after obtaining authorized sandbox credentials and confirming the current API contract. Keep `client_secret` server-side, never expose it in browser code, logs, screenshots, or Git history. Test authentication, errors, request/response schemas, and webhook verification against Cowrywise's current official specifications.

## Evidence labels used in the audit

- **Publicly documented:** visible in the public developer materials reviewed.
- **Hypothesis to validate:** plausible friction point requiring a developer test, internal confirmation, or analytics.
- **Recommendation:** proposed action, not a claim that a defect exists.
# Cowrywise-embed-dx-lab
