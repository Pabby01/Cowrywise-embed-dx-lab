# CorpYield — B2B Payroll Salary Split & Treasury Starter

An automated payroll wealth disbursement and corporate treasury starter powered by Cowrywise Embed.

## Features
- **Pay Yourself First:** Allow employees to configure automatic percentage splits (Emergency Savings, Mutual Funds, Eurobonds).
- **Virtual Accounts Integration:** Direct disbursement to Cowrywise Embed dedicated virtual accounts.
- **Asynchronous Webhook Settlement:** Listens for `wallet.funded` events to trigger scheduled investment plans.

## Getting Started

1. Navigate into this directory:
   ```bash
   cd starters/payroll-treasury
   ```
2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run development:
   ```bash
   npm run dev
   ```

## Key API Endpoints Used
- `POST /api/v1/accounts/create` — Provision bulk employee investment accounts
- `POST /api/v1/wallets/virtual-accounts` — Issue dedicated payroll deposit accounts
- `POST /webhooks` — Catch `wallet.funded` triggers to allocate funds
