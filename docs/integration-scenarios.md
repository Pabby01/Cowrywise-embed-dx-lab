# Real-World Cowrywise Embed Integration Scenarios

This guide details three production architectures showing how different types of tech companies can integrate the Cowrywise Embed API to unlock embedded wealth management.

---

## Scenario 1: Neobank / Consumer Fintech SuperApp

### Context & Goal
A digital banking app with 500,000 active retail accounts wants to increase user retention and deposit stickiness by offering automated high-yield savings and mutual fund investments directly from their primary checking balance.

### Architecture & Data Flow
1. **Unified KYC Propagation:** Since the neobank already performed BVN verification during bank onboarding, the backend can auto-provision a Cowrywise account via `api.accounts.createAccount()` and submit identity via `api.accounts.updateIdentity()` in a background worker, avoiding redundant customer friction.
2. **Automated "Round-Up" Savings:** 
   - Every time a user spends money with their debit card (e.g., spending ₦1,420 at a supermarket), the app rounds up to the nearest ₦100 (₦80 difference).
   - Once accumulated spare change reaches ₦1,000, the app funds the user's investment wallet and triggers an automated investment into the `Cowrywise Money Market Fund`.
3. **In-App Portfolio Card:** The mobile app queries `getPortfolioSummary()` to render a consolidated net-worth widget beside the user's checking balance.

---

## Scenario 2: HR Tech / Payroll & Remuneration Platform

### Context & Goal
A modern B2B SaaS payroll provider wants to empower corporate employees to automatically split their monthly net salaries into disciplined wealth products before the funds hit their retail bank accounts ("Pay Yourself First").

### Architecture & Data Flow
1. **Employee Opt-in & Split Configuration:**
   - In the employee portal, employees configure a monthly wealth allocation (e.g. 10% to Emergency Savings, 15% to Sovereign Eurobonds, 75% to checking account).
2. **Direct Payroll Disbursement via Embed API:**
   - On payday, when payroll executes, the employer disburses the designated 25% directly to Cowrywise Embed wallets via virtual accounts.
   - The platform listens for the `wallet.funded` webhook event.
   - Upon receipt of the webhook, the platform automatically calls `api.savings.createSavingsPlan()` and `api.assets.investInAsset()` on behalf of each employee.
3. **Tax & Regulatory Reporting:**
   - Employees download an annual statement showing interest earnings and capital gains for tax returns.

---

## Scenario 3: E-Commerce & Retail Loyalty Rewards Program

### Context & Goal
A large retail marketplace wants to replace traditional points-based loyalty programs with "Wealthback" — converting merchant cashbacks and reward points into fractional government Treasury Bills and mutual fund units.

### Architecture & Data Flow
1. **Fractional Wealthback Rewards:**
   - When a shopper completes a purchase, the merchant issues 2% cashback.
   - Instead of expiring store credit, the reward balance accumulates in an escrow wallet.
2. **Automatic Threshold Investment:**
   - When the rewards balance crosses the minimum investment threshold (e.g., ₦1,000 for money market funds or ₦5,000 for equity index funds), the system sweeps the balance into the customer's Cowrywise account.
3. **Gamification & Growth Loop:**
   - Users check the retail app weekly to see their cashback grow through compound interest, significantly increasing marketplace daily active users (DAU).

---

## Technical Comparison Matrix

| Scenario | Primary API Resource | Webhook Triggers | Key Risk / Guardrail |
| :--- | :--- | :--- | :--- |
| **Neobank SuperApp** | `/wallets`, `/assets` | `wallet.funded`, `prices.updated` | Handling micro-funding fees and unit allocation rounding |
| **HR / Payroll Split** | `/savings`, `/wallets` | `wallet.funded`, `savings.matured` | Enforcing minimum 3-month savings tenure lock |
| **E-Commerce Wealthback**| `/accounts`, `/assets`| `investment.created`, `identity.verified` | Delaying account creation until cashback threshold is reached |
