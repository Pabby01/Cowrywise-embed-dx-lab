import { createMockEmbedClient } from "../embed-client.js";

export async function runInvestingScenario(): Promise<void> {
  const client = createMockEmbedClient();

  console.log("\n=======================================================");
  console.log(" 📈 SCENARIO 2: ASSET DISCOVERY, WALLET FUNDING & INVESTING");
  console.log("=======================================================");
  console.log("Reference: https://developers.cowrywise.com/guides/investment-products");

  // Step 1: Browse catalog of assets
  console.log("\n[Step 1] Querying available investment products from Embed API...");
  const assets = await client.assets.getAssets();

  console.log(`✓ Fetched ${assets.length} investment products:`);
  for (const asset of assets) {
    console.log(
      `  • [${asset.category.toUpperCase()}] ${asset.name} (${asset.provider})` +
      `\n    Est. Return: ${asset.estimated_return_annual_pct}% p.a. | Min: ${asset.currency} ${asset.minimum_investment.toLocaleString()} | Risk: ${asset.risk_level.toUpperCase()}`
    );
  }

  // Step 2: Use default verified demo account
  const accountId = "acc_demo_001";
  const wallets = await client.wallets.getWallets(accountId);
  const wallet = wallets[0];

  console.log(`\n[Step 2] Partner wallet state for demo customer "${accountId}":`);
  console.log(`  Wallet ID: ${wallet.wallet_id}`);
  console.log(`  Initial Balance: ${wallet.currency} ${wallet.balance.toLocaleString()}`);

  // Step 3: Simulate funding the wallet
  console.log("\n[Step 3] Simulating inbound wallet top-up of NGN 100,000 via virtual bank transfer...");
  const fundedWallet = await client.wallets.fundWallet(wallet.wallet_id, 100_000);
  console.log(`✓ Wallet Funded! New Available Balance: ${fundedWallet.currency} ${fundedWallet.balance.toLocaleString()}`);

  // Step 4: Invest in Cowrywise Money Market Fund
  console.log("\n[Step 4] Investing NGN 50,000 into Cowrywise Money Market Fund (ast_mmf_001)...");
  const investment = await client.assets.investInAsset({
    accountId,
    assetId: "ast_mmf_001",
    amount: 50_000
  });

  console.log(`✓ Investment Successful!`);
  console.log(`  Transaction ID: ${investment.transaction_id}`);
  console.log(`  Allocated Units: ${investment.units} units @ NGN 100.00/unit`);

  // Step 5: Create a 6-month goal-oriented locked Savings Plan
  console.log("\n[Step 5] Initializing a 6-month Emergency Fund Savings Plan with 12% p.a. interest...");
  const plan = await client.savings.createSavingsPlan({
    account_id: accountId,
    name: "Tech Career Emergency Fund",
    target_amount: 500_000,
    initial_deposit: 25_000,
    duration_months: 6,
    interest_enabled: true
  });

  console.log(`✓ Savings Plan Created!`);
  console.log(`  Plan ID: ${plan.plan_id}`);
  console.log(`  Target: NGN ${plan.target_amount.toLocaleString()}`);
  console.log(`  Initial Deposit: NGN ${plan.current_balance.toLocaleString()}`);
  console.log(`  Interest Rate: ${plan.interest_rate_annual_pct}% p.a. (Enabled: ${plan.interest_enabled})`);
  console.log(`  Maturity Date: ${plan.maturity_date}`);

  console.log("\n💡 DevRel Note:");
  console.log("  Savings products on Embed API require a minimum lock period of 3 months.");
  console.log("  Once funded, capital is securely locked until maturity to ensure guaranteed returns.");
}
