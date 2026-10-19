import {
  generateCowrywiseWebhookSignature,
  verifyCowrywiseWebhookSignature,
  createMockWebhookPayload
} from "../webhook-verifier.js";

export async function runWebhooksScenario(): Promise<void> {
  console.log("\n=======================================================");
  console.log(" 🔔 SCENARIO 4: WEBHOOK EVENTS & HMAC SHA-256 VERIFICATION");
  console.log("=======================================================");
  console.log("Reference: https://developers.cowrywise.com/guides/webhooks");

  const CLIENT_ID = "cw_client_live_789456123";
  const CLIENT_SECRET = "cw_sec_production_secret_key_super_safe";

  // Step 1: Simulate Cowrywise Embed firing a webhook
  console.log("\n[Step 1] Simulating incoming webhook from Cowrywise Embed API...");
  const mockPayload = createMockWebhookPayload(
    "wallet.funded",
    {
      wallet_id: "wlt_demo_001",
      account_id: "acc_demo_001",
      amount: 100_000,
      currency: "NGN",
      channel: "virtual_account_bank_transfer",
      reference: "cw_ref_9876543210"
    },
    CLIENT_ID,
    CLIENT_SECRET
  );

  console.log("✓ Webhook Received:");
  console.log(`  Event: ${mockPayload.event.event}`);
  console.log(`  Timestamp: ${mockPayload.event.timestamp}`);
  console.log(`  Received Signature: ${mockPayload.signature}`);

  // Step 2: Verify the valid signature
  console.log("\n[Step 2] Verifying signature using timing-safe buffer comparison...");
  console.log("  Rule: HMAC-SHA256 where message = CLIENT_ID and key = CLIENT_SECRET");

  const validCheck = verifyCowrywiseWebhookSignature({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    receivedSignature: mockPayload.signature
  });

  console.log(`✓ Verification Result: ${validCheck.isValid ? "✅ VALID (ALLOW EVENT)" : "❌ REJECT"}`);
  console.log(`  Computed Hash: ${validCheck.computedHash}`);

  // Step 3: Simulate Tampered / Spoofed Webhook
  console.log("\n[Step 3] Simulating an attacker attempting a forged webhook...");
  const forgedSignature = "0000000000000000000000000000000000000000000000000000000000000000";
  const tamperedCheck = verifyCowrywiseWebhookSignature({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    receivedSignature: forgedSignature
  });

  console.log(`✓ Tampered Payload Result: ${tamperedCheck.isValid ? "ALLOW" : "🛑 BLOCKED (SECURE)"}`);
  console.log(`  Reason: ${tamperedCheck.reason}`);

  console.log("\n💡 DevRel Note: Preventing Replay & Timing Attacks");
  console.log("  1. Always use crypto.timingSafeEqual() to prevent timing side-channel attacks.");
  console.log("  2. Store processed transaction references in Redis/Postgres to ensure idempotency.");
  console.log("  3. Respond with HTTP 200 within 3 seconds to avoid automatic webhook retries.");
}
