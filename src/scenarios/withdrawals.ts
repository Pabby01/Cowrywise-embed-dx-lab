import { createMockEmbedClient } from "../embed-client.js";

export async function runWithdrawalsScenario(): Promise<void> {
  const client = createMockEmbedClient();

  console.log("\n=======================================================");
  console.log(" 💸 SCENARIO 3: LIQUIDATIONS & THE 24-HOUR COOLING-OFF PERIOD");
  console.log("=======================================================");
  console.log("Reference: https://developers.cowrywise.com/guides/withdrawals");

  const accountId = "acc_demo_001";
  const wallets = await client.wallets.getWallets(accountId);
  const wallet = wallets[0];

  console.log(`\n[Step 1] Current Wallet state for "${accountId}":`);
  console.log(`  Available Balance: ${wallet.currency} ${wallet.balance.toLocaleString()}`);

  // Step 2: Request Withdrawal
  console.log("\n[Step 2] Customer initiates payout request of NGN 40,000 to Nigerian commercial bank...");
  const withdrawal = await client.withdrawals.requestWithdrawal({
    wallet_id: wallet.wallet_id,
    amount: 40_000,
    bank_code: "058", // GTBank
    account_number: "0123456789"
  });

  console.log(`✓ Withdrawal Request Logged: ID = ${withdrawal.withdrawal_id}`);
  console.log(`  Amount: ${withdrawal.currency} ${withdrawal.amount.toLocaleString()}`);
  console.log(`  Destination: Bank Code ${withdrawal.bank_code} / Account ${withdrawal.account_number}`);
  console.log(`  Status: ${withdrawal.status.toUpperCase()}`);
  console.log(`  Cooling-Off Window Expires At: ${withdrawal.cooling_off_expires_at}`);

  console.log("\n💡 DevRel Note: The 24-Hour Cooling-Off Rule");
  console.log("  Cowrywise Embed enforces a regulatory 24-hour intent cooling-off security model.");
  console.log("  During these 24 hours, the user can cancel fraud or accidental withdrawal requests.");
  console.log("  Partner apps should NOT mark payouts as completed immediately; instead, listen for");
  console.log("  the asynchronous webhook event: 'withdrawal.completed'.");
}
