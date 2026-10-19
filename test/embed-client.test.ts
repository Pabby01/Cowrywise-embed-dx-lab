import { describe, expect, it } from "vitest";
import { createMockEmbedClient, SYNTHETIC_ASSETS } from "../src/embed-client.js";
import { loadConfig } from "../src/config.js";
import {
  InvalidBvnError,
  InsufficientWalletBalanceError,
  UnverifiedAccountError
} from "../src/errors.js";

describe("Cowrywise Embed Mock Client", () => {
  it("returns clearly labelled synthetic portfolio data", async () => {
    const result = await createMockEmbedClient().getPortfolioSummary();
    expect(result.source).toBe("synthetic-demo-data");
    expect(result.currency).toBe("NGN");
    expect(result.availableBalance).toBeGreaterThanOrEqual(0);
    expect(result.investedValue).toBeGreaterThanOrEqual(0);
  });

  it("defaults to mock mode without requiring credentials", () => {
    expect(loadConfig({}).mode).toBe("mock");
  });

  it("rejects unimplemented live mode rather than implying live support", () => {
    expect(() => loadConfig({ DEMO_MODE: "live" })).toThrow(/only supports DEMO_MODE="mock"/);
  });

  describe("Accounts & Identity Verification (KYC)", () => {
    it("creates an account in pending_verification status", async () => {
      const client = createMockEmbedClient();
      const account = await client.accounts.createAccount({
        first_name: "Folake",
        last_name: "Adeyemi",
        email: "folake@example.ng",
        phone_number: "+2348011112222",
        terms_of_use_accepted: true
      });

      expect(account.account_id).toMatch(/^acc_/);
      expect(account.status).toBe("pending_verification");
      expect(account.is_bvn_verified).toBe(false);
    });

    it("verifies BVN and auto-provisions a wallet", async () => {
      const client = createMockEmbedClient();
      const account = await client.accounts.createAccount({
        first_name: "Folake",
        last_name: "Adeyemi",
        email: "folake@example.ng",
        phone_number: "+2348011112222",
        terms_of_use_accepted: true
      });

      const verification = await client.accounts.updateIdentity(account.account_id, {
        identity_type: "bvn",
        identity_value: "22222222281"
      });

      expect(verification.is_verified).toBe(true);
      const updated = await client.accounts.getAccount(account.account_id);
      expect(updated.status).toBe("verified");
      expect(updated.is_bvn_verified).toBe(true);

      const wallets = await client.wallets.getWallets(account.account_id);
      expect(wallets.length).toBeGreaterThan(0);
      expect(wallets[0].currency).toBe("NGN");
    });

    it("throws InvalidBvnError when BVN is not 11 digits", async () => {
      const client = createMockEmbedClient();
      const account = await client.accounts.createAccount({
        first_name: "Test",
        last_name: "User",
        email: "test@example.ng",
        phone_number: "+2348000000000",
        terms_of_use_accepted: true
      });

      await expect(
        client.accounts.updateIdentity(account.account_id, {
          identity_type: "bvn",
          identity_value: "12345" // invalid length
        })
      ).rejects.toThrow(InvalidBvnError);
    });
  });

  describe("Asset Discovery & Investments", () => {
    it("lists synthetic investment products matching Cowrywise tiers", async () => {
      const client = createMockEmbedClient();
      const assets = await client.assets.getAssets();
      expect(assets.length).toBe(SYNTHETIC_ASSETS.length);
      expect(assets.some((a) => a.category === "mutual_fund")).toBe(true);
      expect(assets.some((a) => a.category === "treasury_bill")).toBe(true);
      expect(assets.some((a) => a.currency === "USD")).toBe(true);
    });

    it("allows investing in assets when wallet has sufficient funds", async () => {
      const client = createMockEmbedClient();
      const accountId = "acc_demo_001"; // pre-seeded verified account with 125,000 NGN balance

      const investment = await client.assets.investInAsset({
        accountId,
        assetId: "ast_mmf_001",
        amount: 25_000
      });

      expect(investment.transaction_id).toMatch(/^txn_/);
      expect(investment.amount).toBe(25_000);
      expect(investment.units).toBe(250); // 25,000 / 100 per unit
    });

    it("throws InsufficientWalletBalanceError if balance is too low", async () => {
      const client = createMockEmbedClient();
      const accountId = "acc_demo_001";

      await expect(
        client.assets.investInAsset({
          accountId,
          assetId: "ast_mmf_001",
          amount: 500_000 // exceeds 125,000 balance
        })
      ).rejects.toThrow(InsufficientWalletBalanceError);
    });
  });

  describe("Savings Plans", () => {
    it("enforces minimum 3-month savings duration", async () => {
      const client = createMockEmbedClient();
      await expect(
        client.savings.createSavingsPlan({
          account_id: "acc_demo_001",
          name: "Too Short Plan",
          target_amount: 50_000,
          duration_months: 2, // invalid: less than 3
          interest_enabled: true
        })
      ).rejects.toThrow(/minimum duration of 3 months/);
    });

    it("creates an active locked savings plan with maturity date", async () => {
      const client = createMockEmbedClient();
      const plan = await client.savings.createSavingsPlan({
        account_id: "acc_demo_001",
        name: "Rent Fund",
        target_amount: 100_000,
        initial_deposit: 10_000,
        duration_months: 6,
        interest_enabled: true
      });

      expect(plan.plan_id).toMatch(/^sp_/);
      expect(plan.duration_months).toBe(6);
      expect(plan.interest_rate_annual_pct).toBe(12.0);
      expect(plan.status).toBe("active");
    });
  });

  describe("Withdrawals & Cooling-Off Period", () => {
    it("creates a withdrawal with a 24-hour cooling-off window", async () => {
      const client = createMockEmbedClient();
      const wallet = (await client.wallets.getWallets("acc_demo_001"))[0];

      const record = await client.withdrawals.requestWithdrawal({
        wallet_id: wallet.wallet_id,
        amount: 10_000,
        bank_code: "058",
        account_number: "0123456789"
      });

      expect(record.status).toBe("cooling_off_period");
      expect(record.amount).toBe(10_000);

      // Verify expiration is ~24 hours from creation
      const createdTime = new Date(record.created_at).getTime();
      const expiresTime = new Date(record.cooling_off_expires_at).getTime();
      const diffHours = (expiresTime - createdTime) / (1000 * 60 * 60);
      expect(Math.round(diffHours)).toBe(24);
    });
  });
});
