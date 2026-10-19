# SpareStash — Spare Change Round-Up Engine Starter

Embed automated micro-investing into shopping checkout carts, point-of-sale flows, or debit card transactions.

## Features
- **Transaction Round-Up:** Rounds retail purchases to the nearest ₦100, ₦500, or ₦1,000.
- **Escrow Stash Buffer:** Accumulates micro-savings without incurring excessive transaction fees.
- **Threshold Auto-Sweep:** Automatically executes mutual fund buy orders when accumulated stash reaches ₦1,000.

## Getting Started

1. Navigate into this directory:
   ```bash
   cd starters/roundup-app
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
- `POST /api/v1/wallets/transfer` — Transfer round-up difference to customer escrow
- `POST /api/v1/assets/invest` — Sweep accumulated spare change into Money Market Fund
- `POST /webhooks` — Listen for debit card spend triggers
