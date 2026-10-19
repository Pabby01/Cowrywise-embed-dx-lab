# Cowrywise Embed: The Ultimate Developer Starter Pack & DX Lab

[![CI](https://github.com/Pabby01/Cowrywise-embed-dx-lab/actions/workflows/ci.yml/badge.svg)](https://github.com/Pabby01/Cowrywise-embed-dx-lab/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-729B1B.svg)](https://vitest.dev/)
[![Status](https://img.shields.io/badge/Architecture-Safe%20Mock%20Engine-brightgreen.svg)](#scope-and-honesty-notes)

> **Independent Developer Experience (DX) Case Study, 3D Fintech Web Showcase, and Safe TypeScript Starter Scaffold for the Cowrywise Embed API.**  
> *Prepared by Adeola Lasisi as a Developer Relations & DX Proof of Work.*

---

## 🌟 What This Repository Contains

1. **Interactive 3D Fintech Web Showcase (`npm run demo`):**  
   A modern web experience featuring 3D holographic wealth cards, interactive parallax tilt, live lifecycle simulator (KYC $\rightarrow$ Wallets $\rightarrow$ Mutual Funds $\rightarrow$ Webhooks), and copy-pasteable UI templates.
2. **Interactive CLI Integration Tour (`npm run dev`):**  
   A multi-scenario terminal runner modeling the complete Cowrywise Embed lifecycle with realistic business logic, validation rules, and error troubleshooting advice.
3. **Cryptographic Webhook Verifier (`src/webhook-verifier.ts`):**  
   Production-ready HMAC SHA-256 signature verification matching Cowrywise specifications with `crypto.timingSafeEqual()` protection against side-channel timing attacks.
4. **Developer-First Error Catalog (`src/errors.ts`):**  
   Typed error classes providing instant remediation steps, root causes, and official documentation links for common hurdles like invalid BVNs, insufficient balances, and 24-hour withdrawal cooldowns.
5. **Comprehensive Technical Documentation (`docs/`):**  
   Task-oriented guides, Mermaid sequence diagrams, real-world case studies, and a 90-day DevRel strategic audit.

---

## 🚀 Quick Start (Zero Credentials Required)

```bash
# 1. Clone repository
git clone https://github.com/Pabby01/Cowrywise-embed-dx-lab.git
cd cowrywise-embed-dx-lab

# 2. Install dependencies
npm install

# 3. Launch the 3D Fintech Web Showcase in your browser
npm run demo
# Visit http://localhost:3000

# 4. Run the interactive terminal integration tour
npm run dev

# 5. Execute test suite & typecheck
npm test
npm run typecheck
```

---

## 🕹️ CLI Scenario Runner

Test individual integration flows directly in your terminal:

```bash
# Run customer KYC & BVN verification flow
npm run dev -- --scenario=onboarding

# Run wallet funding & mutual funds investment flow
npm run dev -- --scenario=invest

# Run liquidation & 24-hour cooling-off period flow
npm run dev -- --scenario=withdrawals

# Run HMAC SHA-256 webhook event verification
npm run dev -- --scenario=webhooks

# Run developer error diagnostics and remediation cards
npm run dev -- --scenario=troubleshooting
```

---

## 📚 Architectural & Integration Guides (Markdown & Web Versions)

Every guide is available both as a markdown document in `docs/` and as an interactive, styled web guide on the local demo server (`http://localhost:3000`):

* 📖 **5-Minute Developer Quickstart:** [Web Version](http://localhost:3000/quickstart.html) • [Markdown](docs/quickstart.md) — Get from 0 to 1 with official `@cowrywise/embed-node` SDK patterns.
* 📊 **Architecture & Sequence Diagrams:** [Web Version](http://localhost:3000/flows.html) • [Markdown](docs/architecture-and-flows.md) — Mermaid diagrams detailing asynchronous KYC, wallet funding, liquidations, and webhook loops.
* 💡 **Real-World Integration Scenarios:** [Web Version](http://localhost:3000/integrations.html) • [Markdown](docs/integration-scenarios.md) — Architectural blueprints for Neobanks, HR/Payroll platforms, and E-commerce reward systems.
* 🛠️ **Developer Troubleshooting Matrix:** [Web Version](http://localhost:3000/troubleshooting.html) • [Markdown](docs/troubleshooting-matrix.md) — HTTP error codes, common friction points, and exact code remedies.
* 🔔 **Webhook & HMAC Architecture:** [Web Version](http://localhost:3000/webhooks.html) • [Markdown](docs/webhooks.md) — Deep dive into constant-time verification, idempotency in Redis/PostgreSQL, and local testing.
* 📑 **Developer Experience Audit & 90-Day Strategy:** [Web Version](http://localhost:3000/audit.html) • [Markdown](docs/developer-experience-audit.md) — Strategic DevRel roadmap for Cowrywise Embed.
* ✅ **Pre-Live Validation Checklist:** [Web Version](http://localhost:3000/checklist.html) • [Markdown](docs/validation-checklist.md) — Interactive checks before transitioning from mock mode to live production credentials.

---

## 📦 Cloneable Fintech Web App Starters (`starters/`)

Pre-built, standalone starter projects designed for rapid prototyping:

* **[`starters/savings-app`](starters/savings-app):** **KoloVault** — Disciplined locked savings, target milestones, and maturity lock timers.
* **[`starters/investment-portal`](starters/investment-portal):** **YieldNest** — SEC-regulated mutual funds discovery, risk profiler, and 1-click purchase portal.
* **[`starters/roundup-app`](starters/roundup-app):** **SpareStash** — E-commerce checkout and debit card spare change round-up savings engine.
* **[`starters/payroll-treasury`](starters/payroll-treasury):** **CorpYield** — B2B corporate payroll wealth split and employee benefit dashboard.

---

## 📂 Project Structure

```text
cowrywise-embed-dx-lab/
├── .github/workflows/
│   └── ci.yml                     # Automated testing & typecheck CI
├── demo/                          # Fintech Web Showcase, Sandbox & Web Docs
│   ├── index.html                 # Interactive overview & live console
│   ├── simulation.html            # Dual-pane API cockpit with real-time event logs
│   ├── templates.html             # Cloneable starter apps & interactive app demos
│   ├── quickstart.html            # Web version of 5-minute quickstart guide
│   ├── integrations.html          # Web version of real-world integration scenarios
│   ├── webhooks.html              # Web version of webhook HMAC security guide
│   ├── checklist.html             # Web version of pre-live validation checklist
│   ├── audit.html                 # Web version of 90-day DX strategy & audit
│   ├── flows.html                 # Interactive architecture sequence diagrams
│   ├── troubleshooting.html       # Searchable error catalog & fault injection
│   ├── styles.css                 # Design system, rich 4-column footer & responsive grid
│   └── app.js                     # In-browser state machine & modal app simulators
├── docs/                          # In-depth DevRel & technical guides (Markdown)
│   ├── quickstart.md              # 0 to 1 task-based quickstart
│   ├── architecture-and-flows.md  # Mermaid sequence diagrams
│   ├── integration-scenarios.md   # Neobank, HR, and E-Commerce blueprints
│   ├── troubleshooting-matrix.md  # Error codes & actionable remediation
│   ├── webhooks.md                # HMAC SHA-256 verification & idempotency
│   ├── developer-experience-audit.md # 90-day DevRel roadmap
│   └── validation-checklist.md    # Pre-live integration guardrails
├── starters/                      # Standalone cloneable fintech application starters
│   ├── savings-app/               # KoloVault disciplined locked savings starter
│   ├── investment-portal/         # YieldNest mutual funds portal starter
│   ├── roundup-app/               # SpareStash checkout spare change round-up starter
│   └── payroll-treasury/          # CorpYield B2B payroll wealth split starter
├── scripts/
│   └── serve-demo.ts              # Zero-dependency local preview server
├── src/
│   ├── config.ts                  # Safe configuration loader
│   ├── types.ts                   # Strongly-typed Cowrywise domain models
│   ├── errors.ts                  # Developer error catalog & remediation tips
│   ├── webhook-verifier.ts        # Constant-time HMAC-SHA256 signature verifier
│   ├── embed-client.ts            # In-memory mock engine (Accounts, Wallets, Assets, Savings)
│   ├── index.ts                   # CLI scenario router & integration tour
│   └── scenarios/                 # Modular integration flows
└── test/
    ├── embed-client.test.ts       # Domain logic & business constraint tests
    └── webhook-verifier.test.ts   # Cryptographic verification & tamper tests
```

---

## 🔒 Scope and Honesty Notes

* **Independent Study:** This project is an independent developer relations case study by Adeola Lasisi. It is not affiliated with Cowrywise HQ.
* **Safe In-Memory Architecture:** This repository runs 100% in `mock` mode and uses synthetic data. It does not authenticate against Cowrywise servers or require live API credentials.
* **Security Guardrails:** Never commit production client secrets to version control. Keep all authentication logic strictly server-side.
* **Pre-Flight Validation:** Before implementing a live integration, validate current endpoints, SDK releases, and terms with official Cowrywise developer representatives.
