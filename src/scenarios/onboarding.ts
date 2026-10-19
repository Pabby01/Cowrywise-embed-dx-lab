import { createMockEmbedClient } from "../embed-client.js";

export async function runOnboardingScenario(): Promise<void> {
  const client = createMockEmbedClient();

  console.log("\n=======================================================");
  console.log(" 🚀 SCENARIO 1: CUSTOMER ONBOARDING & BVN IDENTITY KYC");
  console.log("=======================================================");
  console.log("Reference: https://developers.cowrywise.com/guides/creating-an-account");

  // Step 1: Create Account
  console.log("\n[Step 1] Creating new partner user account...");
  const account = await client.accounts.createAccount({
    first_name: "Amara",
    last_name: "Eze",
    email: "amara.eze@example.ng",
    phone_number: "+2348039876543",
    terms_of_use_accepted: true
  });

  console.log(`✓ Account Created: ID = ${account.account_id}`);
  console.log(`  Name: ${account.first_name} ${account.last_name}`);
  console.log(`  Status: ${account.status} (Terms Accepted: YES)`);
  console.log(`  BVN Verified: ${account.is_bvn_verified}`);

  // Step 2: Verify BVN (Identity)
  console.log("\n[Step 2] Submitting Tier-1 KYC verification (BVN)...");
  console.log("  In Sandbox mode, Cowrywise accepts test BVN: '22222222281'");
  
  const kycResult = await client.accounts.updateIdentity(account.account_id, {
    identity_type: "bvn",
    identity_value: "22222222281"
  });

  console.log(`✓ KYC Status: ${kycResult.is_verified ? "VERIFIED" : "FAILED"}`);
  console.log(`  Message: ${kycResult.message}`);
  console.log(`  Verified At: ${kycResult.verified_at}`);

  // Step 3: Inspect Auto-Created Wallet
  console.log("\n[Step 3] Checking auto-provisioned investment wallet...");
  const wallets = await client.wallets.getWallets(account.account_id);
  const primaryWallet = wallets[0];

  if (primaryWallet) {
    console.log(`✓ Primary Wallet Provisioned: ${primaryWallet.wallet_id}`);
    console.log(`  Currency: ${primaryWallet.currency}`);
    console.log(`  Available Balance: ${primaryWallet.currency} ${primaryWallet.balance.toLocaleString()}`);
  }

  console.log("\n💡 DevRel Note:");
  console.log("  On Cowrywise Embed, wallets are the sole funding source and withdrawal destination.");
  console.log("  Wallets are automatically provisioned as soon as BVN verification passes.");
}
