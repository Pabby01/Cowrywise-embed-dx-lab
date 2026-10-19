# YieldNest — Mutual Funds & Micro-Investing Portal Starter

A retail investment web portal starter powered by Cowrywise Embed.

## Features
- **Mutual Fund Discovery:** Query SEC-regulated funds (Money Market, Fixed Income, Balanced, Eurobonds).
- **Interactive Risk Profiler:** Classify customers into Conservative, Moderate, and Aggressive profiles.
- **One-Click Order Purchase:** Execute unit purchases directly from wallet balances with instant transaction receipts.

## Getting Started

1. Navigate into this directory:
   ```bash
   cd starters/investment-portal
   ```
2. Copy environment file:
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
- `GET /api/v1/assets` — Fetch mutual funds catalog and annualized rates
- `POST /api/v1/assets/invest` — Execute unit purchase
- `GET /api/v1/portfolio` — Fetch user holdings and dividend distributions
