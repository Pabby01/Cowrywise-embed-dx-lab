import { describe, expect, it } from "vitest";
import {
  generateCowrywiseWebhookSignature,
  verifyCowrywiseWebhookSignature,
  createMockWebhookPayload
} from "../src/webhook-verifier.js";

describe("Cowrywise Webhook Signature Verifier", () => {
  const CLIENT_ID = "cw_client_test_123456";
  const CLIENT_SECRET = "cw_sec_secret_key_987654";

  it("generates and validates an official HMAC SHA-256 signature", () => {
    const signature = generateCowrywiseWebhookSignature(CLIENT_ID, CLIENT_SECRET);
    expect(signature).toHaveLength(64); // 256 bits in hex is 64 characters

    const result = verifyCowrywiseWebhookSignature({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      receivedSignature: signature
    });

    expect(result.isValid).toBe(true);
    expect(result.computedHash.toLowerCase()).toBe(signature.toLowerCase());
  });

  it("rejects an altered / spoofed signature", () => {
    const forgedSignature = "a".repeat(64);

    const result = verifyCowrywiseWebhookSignature({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      receivedSignature: forgedSignature
    });

    expect(result.isValid).toBe(false);
    expect(result.reason).toContain("does not match");
  });

  it("handles missing credentials gracefully", () => {
    const result = verifyCowrywiseWebhookSignature({
      clientId: "",
      clientSecret: "",
      receivedSignature: "test"
    });

    expect(result.isValid).toBe(false);
    expect(result.reason).toContain("Missing server-side CLIENT_ID or CLIENT_SECRET");
  });

  it("handles missing signature gracefully", () => {
    const result = verifyCowrywiseWebhookSignature({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      receivedSignature: undefined
    });

    expect(result.isValid).toBe(false);
    expect(result.reason).toContain("Missing or invalid signature");
  });

  it("creates a well-formed signed mock webhook payload", () => {
    const payload = createMockWebhookPayload(
      "investment.created",
      {
        plan_id: "sp_12345",
        amount: 50_000,
        currency: "NGN"
      },
      CLIENT_ID,
      CLIENT_SECRET
    );

    expect(payload.signature).toHaveLength(64);
    expect(payload.event.event).toBe("investment.created");
    expect(payload.event.data.amount).toBe(50_000);

    // Verify the generated payload validates cleanly
    const verification = verifyCowrywiseWebhookSignature({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      receivedSignature: payload.signature
    });

    expect(verification.isValid).toBe(true);
  });
});
