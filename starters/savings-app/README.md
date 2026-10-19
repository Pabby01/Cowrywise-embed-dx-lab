# KoloVault — Disciplined Savings Web App Starter

A full-stack disciplined locked savings web application starter powered by Cowrywise Embed.

## Features
- **Target Milestone Funds:** Enable customers to set custom financial goals (e.g. "December Vacation", "House Downpayment").
- **Flexible Lock Tenures:** Enforce 3, 6, or 12-month lock periods with guaranteed annual interest (+12.5% to +15.5% APY).
- **Maturity Countdown & Cooling-off Guardrails:** Protect customer assets from impulsive withdrawals.

## Getting Started

1. Clone or navigate into this folder:
   ```bash
   cd starters/savings-app
   ```
2. Copy the sample environment file:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Key API Endpoints Used
- `POST /api/v1/savings/create` — Create locked or target savings plan
- `GET /api/v1/savings/plans` — Query user plans, maturity dates, and accrued interest
- `POST /api/v1/wallets/deposit` — Fund savings plan from digital wallet
