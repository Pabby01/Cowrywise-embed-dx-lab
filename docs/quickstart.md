# Cowrywise Embed Quickstart: 0 to 1 in 5 Minutes

Welcome to the **Cowrywise Embed Developer Quickstart**. This guide is designed to take you from zero to your first successful investment integration using the official `@cowrywise/embed-node` SDK conventions.

---

## 1. Prerequisites

Before writing code:
1. **Developer Portal Account:** Sign up at [developers.cowrywise.com](https://developers.cowrywise.com/).
2. **Sandbox API Credentials:** Request early access to obtain your `client_id` and `client_secret`.
3. **Node.js Environment:** Node.js version 18+ or 20+ (LTS recommended).

> [!SECURITY]
> **Server-Side Only**: Your `client_secret` must **never** be exposed in client-side code (React, Vue, mobile apps, or public Git repos). All calls to the Cowrywise Embed API must be made from your secure backend server.

---

## 2. Installation

Install the official Cowrywise Embed Node.js library:

```bash
npm install @cowrywise/embed-node
# or using yarn
yarn add @cowrywise/embed-node
```

For this starter lab repository, you can run all flows out of the box using our local type-safe mock engine without needing real credentials:

```bash
git clone https://github.com/Pabby01/Cowrywise-embed-dx-lab.git
cd cowrywise-embed-dx-lab
npm install
npm run dev
```

---

## 3. Client Initialization

Configure your API client using your environment variables:

```typescript
import Client from "@cowrywise/embed-node";

const cowrywise = new Client({
  client_id: process.env.COWRYWISE_CLIENT_ID!,
  client_secret: process.env.COWRYWISE_CLIENT_SECRET!,
  embed_api_base_url: process.env.NODE_ENV === "production"
    ? "https://embed.cowrywise.com/api/v1"
    : "https://sandbox.embed.cowrywise.com/api/v1"
});
```

---

## 4. The 4-Step Integration Journey

### Step 1: Create a Customer Investment Account

Every customer requires an investment account before assets can be purchased:

```typescript
const account = await cowrywise.accounts.createAccount({
  first_name: "Chidi",
  last_name: "Okonkwo",
  email: "chidi.okonkwo@example.com",
  phone_number: "+2348012345678",
  terms_of_use_accepted: true // Mandatory
});

console.log("Account created:", account.account_id);
// Status is "pending_verification"
```

### Step 2: Verify Identity (Tier-1 BVN KYC)

Regulatory compliance requires Bank Verification Number (BVN) validation. In the Cowrywise Sandbox environment, use the test BVN `22222222281`:

```typescript
const kyc = await cowrywise.accounts.updateIdentity(account.account_id, {
  identity_type: "bvn",
  identity_value: "22222222281" // Sandbox test BVN
});

console.log("KYC status:", kyc.is_verified); // true
// An investment wallet is automatically provisioned upon successful verification!
```

### Step 3: Fetch Available Assets & Invest

Query investment products (Mutual Funds, Treasury Bills, Eurobonds):

```typescript
// 1. Fetch available investment catalog
const assets = await cowrywise.assets.getAssets();
const moneyMarketFund = assets.find(a => a.category === "mutual_fund");

// 2. Fetch the user's investment wallet
const [wallet] = await cowrywise.wallets.getWallets(account.account_id);

// 3. Purchase mutual fund units from wallet balance
const investment = await cowrywise.assets.investInAsset({
  accountId: account.account_id,
  assetId: moneyMarketFund.asset_id,
  amount: 25_000 // In NGN
});

console.log(`Purchased ${investment.units} units. Txn: ${investment.transaction_id}`);
```

### Step 4: Create a Locked Savings Plan

For goal-based savings with guaranteed annual returns (minimum 3 months duration):

```typescript
const savingsPlan = await cowrywise.savings.createSavingsPlan({
  account_id: account.account_id,
  name: "December Vacation Fund",
  target_amount: 300_000,
  initial_deposit: 20_000,
  duration_months: 6,
  interest_enabled: true
});

console.log(`Plan active until ${savingsPlan.maturity_date}`);
```

---

## 5. Webhook Integration

Cowrywise sends real-time webhooks for asynchronous events (e.g. `wallet.funded`, `withdrawal.completed`).

Always verify the signature with HMAC SHA-256:

```typescript
import crypto from "node:crypto";

function verifyWebhook(req: Request, clientId: string, clientSecret: string) {
  const incomingSignature = req.body.signature;
  
  // Cowrywise signs CLIENT_ID using CLIENT_SECRET as the key:
  const computedHash = crypto
    .createHmac("sha256", clientSecret)
    .update(clientId)
    .digest("hex");

  const valid = crypto.timingSafeEqual(
    Buffer.from(computedHash.toLowerCase()),
    Buffer.from(incomingSignature.toLowerCase())
  );

  return valid;
}
```

---

## Next Steps

* Dive into [Architecture and Sequence Diagrams](file:///Users/admin/Downloads/cowrywise-embed-dx-lab/docs/architecture-and-flows.md)
* Review the [Developer Troubleshooting Matrix](file:///Users/admin/Downloads/cowrywise-embed-dx-lab/docs/troubleshooting-matrix.md)
* Explore real-world fintech use cases in [Integration Scenarios](file:///Users/admin/Downloads/cowrywise-embed-dx-lab/docs/integration-scenarios.md)
