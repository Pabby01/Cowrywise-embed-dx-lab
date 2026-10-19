# Cowrywise Embed Webhook Architecture & Integration Guide

Webhooks provide real-time notification of events happening asynchronously within the Cowrywise Embed ecosystem.

---

## 1. Supported Event Catalog

| Event Name | Trigger Condition | Common Partner Action |
| :--- | :--- | :--- |
| `account.created` | New investor account registered | Update local user record status |
| `identity.verified` | BVN/NIN identity check passed | Unlock wallet funding & investment UI |
| `wallet.funded` | Deposit received via virtual account | Credit in-app balance & execute pending investments |
| `investment.created` | Mutual fund units or savings plan allocated | Update portfolio visualization & send receipt |
| `withdrawal.requested` | Liquidation/payout initiated | Display 24-hour cooling-off countdown |
| `withdrawal.completed` | Funds disbursed to recipient bank | Mark transaction settled & notify user |

---

## 2. Webhook Payload Anatomy

Every incoming webhook contains the cryptographic `signature` and an `event` envelope:

```json
{
  "signature": "49c5fe04944bfd8a14b1aa4b99a2aa7a9219c0adda145541edf861bde9196f08",
  "event": {
    "event": "wallet.funded",
    "timestamp": "2026-10-19T06:34:44.662Z",
    "data": {
      "wallet_id": "wlt_demo_001",
      "account_id": "acc_demo_001",
      "amount": 100000,
      "currency": "NGN",
      "channel": "virtual_account_bank_transfer",
      "reference": "cw_ref_9876543210"
    }
  }
}
```

---

## 3. Cryptographic Signature Verification

### Node.js / TypeScript Example
```typescript
import crypto from "node:crypto";

export function verifyWebhook(
  incomingSignature: string,
  clientId: string,
  clientSecret: string
): boolean {
  if (!incomingSignature || !clientId || !clientSecret) return false;

  const expectedHash = crypto
    .createHmac("sha256", clientSecret)
    .update(clientId)
    .digest("hex");

  const expectedBuffer = Buffer.from(expectedHash.toLowerCase(), "utf8");
  const incomingBuffer = Buffer.from(incomingSignature.trim().toLowerCase(), "utf8");

  if (expectedBuffer.length !== incomingBuffer.length) return false;
  return crypto.timingSafeEqual(expectedBuffer, incomingBuffer);
}
```

### Python / Flask Example
```python
import hashlib
import hmac
from flask import Flask, jsonify, request, Response

app = Flask(__name__)
CLIENT_ID = "YOUR_CLIENT_ID"
CLIENT_SECRET = "YOUR_CLIENT_SECRET"


@app.route("/api/cowrywise-webhook", methods=["POST"])
def handle_webhook():
  payload = request.get_json()
  signature = payload.get("signature")

  if not signature:
    return Response("Missing signature", status=400)

  # Compute HMAC SHA-256 of CLIENT_ID using CLIENT_SECRET as the key
  computed_hash = hmac.new(
      bytes(CLIENT_SECRET, "utf-8"),
      bytes(CLIENT_ID, "utf-8"),
      hashlib.sha256,
  ).hexdigest()

  if not hmac.compare_digest(computed_hash.lower(), signature.lower()):
    return Response("Invalid signature", status=401)

  event_type = payload.get("event", {}).get("event")
  event_data = payload.get("event", {}).get("data")

  # Process event safely...
  return jsonify({"status": "acknowledged"}), 200
```

---

## 4. Production Engineering Best Practices

1. **Acknowledge Fast (HTTP 200 within 3 seconds):** Do not perform heavy database aggregations or external calls inside the HTTP request handler. Enqueue the event onto a message queue (BullMQ, Celery, SQS, or RabbitMQ) and immediately return `200 OK`.
2. **Idempotency with Unique Event IDs:** Network hiccups can cause webhooks to be delivered more than once. Always record processed transaction references (e.g., `event.data.reference`) in a Redis cache or database table with a unique constraint. If already seen, return `200 OK` without re-crediting balances.
3. **Local Testing with Ngrok / LocalTunnel:** To test webhooks on your local workstation:
   ```bash
   npx localtunnel --port 3000
   # or
   ngrok http 3000
   ```
   Paste the generated public URL into your Cowrywise Embed Developer Dashboard under API Configuration.
