import crypto from "node:crypto";
import type { WebhookPayload, WebhookVerificationResult, WebhookEvent } from "./types.js";

/**
 * Generates an official Cowrywise Embed HMAC SHA-256 signature.
 *
 * According to Cowrywise Embed documentation:
 * The signature is an HMAC SHA-256 hash where:
 * - Message / Data: YOUR_CLIENT_ID
 * - Secret Key:     YOUR_CLIENT_SECRET
 */
export function generateCowrywiseWebhookSignature(
  clientId: string,
  clientSecret: string
): string {
  if (!clientId || !clientSecret) {
    throw new Error("Both clientId and clientSecret are required to generate webhook signature.");
  }

  return crypto
    .createHmac("sha256", clientSecret)
    .update(clientId)
    .digest("hex");
}

/**
 * Validates an incoming webhook payload using timing-safe comparison to prevent side-channel timing attacks.
 */
export function verifyCowrywiseWebhookSignature(params: {
  clientId: string;
  clientSecret: string;
  receivedSignature?: string;
}): WebhookVerificationResult {
  const { clientId, clientSecret, receivedSignature } = params;

  if (!clientId || !clientSecret) {
    return {
      isValid: false,
      computedHash: "",
      receivedSignature,
      reason: "Missing server-side CLIENT_ID or CLIENT_SECRET in configuration."
    };
  }

  if (!receivedSignature || typeof receivedSignature !== "string") {
    return {
      isValid: false,
      computedHash: "",
      receivedSignature,
      reason: "Missing or invalid signature in incoming webhook request payload."
    };
  }

  const computedHash = generateCowrywiseWebhookSignature(clientId, clientSecret);

  try {
    const computedBuf = Buffer.from(computedHash.toLowerCase(), "utf8");
    const receivedBuf = Buffer.from(receivedSignature.trim().toLowerCase(), "utf8");

    if (computedBuf.length !== receivedBuf.length) {
      return {
        isValid: false,
        computedHash,
        receivedSignature,
        reason: "Signature length mismatch."
      };
    }

    const isValid = crypto.timingSafeEqual(computedBuf, receivedBuf);

    return {
      isValid,
      computedHash,
      receivedSignature,
      reason: isValid ? undefined : "Computed HMAC hash does not match received signature."
    };
  } catch (error) {
    return {
      isValid: false,
      computedHash,
      receivedSignature,
      reason: error instanceof Error ? error.message : "Cryptographic comparison failure."
    };
  }
}

/**
 * Creates a synthetic, cryptographically signed webhook payload for testing.
 */
export function createMockWebhookPayload<T extends Record<string, unknown>>(
  eventType: string,
  data: T,
  clientId = "cw_client_sandbox_demo",
  clientSecret = "cw_sec_test_abc123xyz"
): WebhookPayload<T> {
  const signature = generateCowrywiseWebhookSignature(clientId, clientSecret);
  const event: WebhookEvent<T> = {
    event: eventType,
    data,
    timestamp: new Date().toISOString()
  };

  return {
    signature,
    event
  };
}
