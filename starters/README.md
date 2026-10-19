# Cowrywise Embed Fintech Starter App Templates

This folder contains production-ready, cloneable application templates designed to accelerate development when embedding Cowrywise wealth features.

---

## Available Starter Applications

| Starter App | Primary Use Case | Recommended Tech Stack | Cowrywise Embed Endpoints |
| :--- | :--- | :--- | :--- |
| **[`/savings-app`](./savings-app)** | Disciplined locked savings, target milestone funds, and maturity locks | Next.js 14, Tailwind CSS, TypeScript | `/savings/create`, `/savings/plans`, `/wallets` |
| **[`/investment-portal`](./investment-portal)** | Mutual fund discovery catalog, risk profiling, 1-click purchases | React + Vite, TypeScript, Chart.js | `/assets`, `/assets/invest`, `/portfolio` |
| **[`/roundup-app`](./roundup-app)** | Spare change round-up savings for e-commerce checkout and card spend | Web Components, Express, Node.js | `/wallets/transfer`, `/assets/invest`, `/webhooks` |
| **[`/payroll-treasury`](./payroll-treasury)** | Automated salary splits into locked vaults and eurobonds on payday | Next.js 14, PostgreSQL, Redis, BullMQ | `/accounts`, `/wallets/virtual-accounts`, `/savings` |
| **[`/wealthpass`](./wealthpass)** | Neobank customer onboarding, BVN/NIN verification, virtual accounts | Next.js 14, Tailwind CSS, TypeScript | `/accounts/create`, `/accounts/verify-bvn`, `/wallets` |
| **[`/eurovest`](./eurovest)** | Sovereign USD Eurobonds and fixed-income dollar treasury portal | React, TypeScript, Chart.js | `/assets`, `/assets/invest`, `/portfolio` |

---

## Quickstart: Cloning a Starter

To clone any specific starter into a standalone project directory:

```bash
# Clone the complete lab repository
git clone https://github.com/Pabby01/Cowrywise-embed-dx-lab.git

# Navigate to your chosen starter project
cd cowrywise-embed-dx-lab/starters/savings-app

# Copy environment variables and install dependencies
cp .env.example .env
npm install
npm run dev
```

---

## Scope & Security
All starter templates in this directory are configured by default to connect to the Cowrywise Embed Sandbox API or our safe local mock engine. Never hardcode live production secrets in client-side code.
