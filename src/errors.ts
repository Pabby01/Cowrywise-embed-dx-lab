/**
 * Cowrywise Embed Developer Error Catalog & Troubleshooting Helpers.
 * Designed to provide clear remediation paths for common integration blockers.
 */

export interface ErrorRemediationGuide {
  title: string;
  cause: string;
  action: string;
  docUrl: string;
}

export class CowrywiseError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly remediation: ErrorRemediationGuide;

  constructor(
    message: string,
    statusCode: number,
    errorCode: string,
    remediation: ErrorRemediationGuide
  ) {
    super(message);
    this.name = "CowrywiseError";
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.remediation = remediation;
  }
}

export class InvalidBvnError extends CowrywiseError {
  constructor(providedBvn: string) {
    super(
      `Invalid Bank Verification Number (BVN): "${providedBvn}". BVN must be an 11-digit numeric string.`,
      400,
      "CW_ERR_INVALID_BVN",
      {
        title: "BVN Validation Failed",
        cause: "The provided BVN format is invalid or could not be verified by NIBSS.",
        action: "In Sandbox mode, use the designated test BVN '22222222281' or verify that the user entered exactly 11 digits.",
        docUrl: "https://developers.cowrywise.com/guides/identity-verification"
      }
    );
  }
}

export class UnverifiedAccountError extends CowrywiseError {
  constructor(accountId: string) {
    super(
      `Account "${accountId}" is unverified. Identity verification (BVN) must be completed before creating wallets or investments.`,
      403,
      "CW_ERR_ACCOUNT_UNVERIFIED",
      {
        title: "Account Verification Required",
        cause: "Embed API regulations require Tier-1 KYC verification before any financial product can be created.",
        action: "Call api.accounts.updateIdentity(accountId, { identity_type: 'bvn', identity_value: '22222222281' }) before attempting investment actions.",
        docUrl: "https://developers.cowrywise.com/guides/creating-an-account"
      }
    );
  }
}

export class InsufficientWalletBalanceError extends CowrywiseError {
  constructor(walletId: string, required: number, available: number, currency = "NGN") {
    super(
      `Insufficient wallet balance in "${walletId}". Required: ${currency} ${required.toLocaleString()}, Available: ${currency} ${available.toLocaleString()}.`,
      422,
      "CW_ERR_INSUFFICIENT_FUNDS",
      {
        title: "Wallet Funding Required",
        cause: "Wallets act as the sole funding source for all investment products on the Embed API.",
        action: "Prompt the user to fund their wallet via bank transfer/debit card before initializing this investment plan.",
        docUrl: "https://developers.cowrywise.com/guides/funding-investments"
      }
    );
  }
}

export class WithdrawalLockedError extends CowrywiseError {
  constructor(planOrWithdrawalId: string, reason: string) {
    super(
      `Withdrawal blocked for "${planOrWithdrawalId}": ${reason}`,
      422,
      "CW_ERR_WITHDRAWAL_LOCKED",
      {
        title: "Cooling-Off or Lock Period Active",
        cause: "Cowrywise Embed enforces a 24-hour intent cooling-off period for withdrawals, or savings plan tenure is not yet mature (minimum 3 months).",
        action: "Inform the customer of the 24-hour safety cooldown window, or check maturity date via api.savings.getSavings().",
        docUrl: "https://developers.cowrywise.com/guides/withdrawals"
      }
    );
  }
}

export class InvalidWebhookSignatureError extends CowrywiseError {
  constructor(reason: string) {
    super(
      `Webhook signature verification failed: ${reason}`,
      401,
      "CW_ERR_INVALID_WEBHOOK_SIGNATURE",
      {
        title: "Webhook Signature Mismatch",
        cause: "Incoming request signature does not match HMAC-SHA256(client_id, client_secret).",
        action: "Ensure your webhook listener computes HMAC SHA-256 using your CLIENT_ID as data and CLIENT_SECRET as the key, comparing securely with timingSafeEqual.",
        docUrl: "https://developers.cowrywise.com/guides/webhooks"
      }
    );
  }
}
