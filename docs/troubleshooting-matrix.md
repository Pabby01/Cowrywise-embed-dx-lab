# Cowrywise Embed Developer Troubleshooting Matrix

This reference provides rapid diagnostics and actionable remediation steps for the most common integration hurdles encountered when building on the Cowrywise Embed API.

---

## 1. Quick Diagnostic Table

| HTTP Status | Error Code | Common Symptom | Immediate Resolution |
| :--- | :--- | :--- | :--- |
| **400 Bad Request** | `CW_ERR_INVALID_BVN` | BVN verification fails or throws an error. | Ensure BVN is exactly 11 numeric digits. In Sandbox mode, use test BVN `22222222281`. |
| **401 Unauthorized** | `CW_ERR_INVALID_WEBHOOK_SIGNATURE` | Webhook handler returns 401 on inbound requests. | Ensure your listener signs `CLIENT_ID` with `CLIENT_SECRET` using HMAC SHA-256 and compares using constant-time buffers. |
| **401 Unauthorized** | `CW_ERR_TOKEN_EXPIRED` | API calls return unauthorized after a few hours. | Embed tokens expire periodically. Call `await api.refreshToken()` or ensure token auto-refresh is enabled. |
| **403 Forbidden** | `CW_ERR_ACCOUNT_UNVERIFIED` | Cannot create wallets, savings plans, or buy mutual funds. | Call `api.accounts.updateIdentity(accountId, { identity_type: 'bvn', identity_value })` to complete Tier-1 KYC before investing. |
| **422 Unprocessable**| `CW_ERR_INSUFFICIENT_FUNDS` | Investment plan creation fails. | The account's investment wallet has insufficient balance. Call `api.wallets.fundWallet()` or prompt the user to top up. |
| **422 Unprocessable**| `CW_ERR_WITHDRAWAL_LOCKED` | Withdrawal request rejected or funds not received immediately. | Check if the 24-hour intent cooling-off period is still active, or if savings plan is within its 3-month lock window. |

---

## 2. In-Depth Root Cause Analysis & Solutions

### A. Webhook Signature Verification Failures

#### The Problem:
Your webhook endpoint receives notifications, but your signature verification logic always fails or throws errors.

#### The Cause:
Many third-party APIs (like Stripe or GitHub) sign the raw request body. **Cowrywise Embed does not sign the payload body.** Instead, it generates an HMAC SHA-256 hash where:
* **Message / Data:** Your `CLIENT_ID`
* **Secret Key:** Your `CLIENT_SECRET`

#### The Fix (Node.js TypeScript):
```typescript
import crypto from "node:crypto";

export function isSignatureValid(incomingSignature: string, clientId: string, clientSecret: string): boolean {
  if (!incomingSignature || !clientId || !clientSecret) return false;

  const expectedHash = crypto
    .createHmac("sha256", clientSecret)
    .update(clientId)
    .digest("hex");

  const expectedBuf = Buffer.from(expectedHash.toLowerCase(), "utf8");
  const incomingBuf = Buffer.from(incomingSignature.trim().toLowerCase(), "utf8");

  if (expectedBuf.length !== incomingBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, incomingBuf);
}
```

---

### B. Understanding the 24-Hour Withdrawal Cooling-Off Period

#### The Problem:
A developer calls the withdrawal endpoint, but the user reports that money has not reached their commercial bank account after 1 hour.

#### The Cause:
To prevent unauthorized liquidations from compromised user accounts, the Embed API places all initial withdrawal requests into a mandatory **24-hour cooling-off period**.

#### The Fix:
1. When calling `api.withdrawals.requestWithdrawal()`, inspect the returned `cooling_off_expires_at` timestamp.
2. In your UI, display: *"Withdrawal request received. For your security, funds will be disbursed after the 24-hour safety review window concludes."*
3. Rely on the `withdrawal.completed` webhook rather than polling the endpoint.

---

### C. Testing in Sandbox vs Production

| Configuration | Sandbox Environment | Production Environment |
| :--- | :--- | :--- |
| **Base URL** | `https://sandbox.embed.cowrywise.com/api/v1` | `https://embed.cowrywise.com/api/v1` |
| **Test BVN** | `22222222281` (Always passes) | Real 11-digit NIBSS BVN |
| **Wallet Funding** | Simulated instantly via sandbox tools | Real bank transfer or card payment |
| **Withdrawals** | Accelerated simulated cooldowns | Full regulatory 24-hour cooldown |
