import { createMockEmbedClient } from "../embed-client.js";
import { CowrywiseError } from "../errors.js";

export async function runTroubleshootingScenario(): Promise<void> {
  const client = createMockEmbedClient();

  console.log("\n=======================================================");
  console.log(" 🛠️ SCENARIO 5: ERROR HANDLING, DIAGNOSTICS & REMEDIATION");
  console.log("=======================================================");
  console.log("Demonstrating how DevRel engineers structure errors to unblock integrators fast.");

  // Test Case 1: Invalid BVN (10 digits instead of 11)
  console.log("\n[Error Test 1] Attempting BVN verification with invalid length '1234567890'...");
  try {
    const acc = await client.accounts.createAccount({
      first_name: "Tunde",
      last_name: "Bakare",
      email: "tunde.bakare@example.ng",
      phone_number: "+2348022223344",
      terms_of_use_accepted: true
    });
    await client.accounts.updateIdentity(acc.account_id, {
      identity_type: "bvn",
      identity_value: "1234567890" // 10 digits
    });
  } catch (error) {
    if (error instanceof CowrywiseError) {
      console.log(`❌ Caught Expected Error: [${error.errorCode}] ${error.message}`);
      console.log(`   HTTP Status: ${error.statusCode}`);
      console.log(`   💡 Remediation Title:  ${error.remediation.title}`);
      console.log(`   🔍 Underlying Cause:   ${error.remediation.cause}`);
      console.log(`   ⚡ Actionable Solution: ${error.remediation.action}`);
      console.log(`   📖 Official Doc URL:   ${error.remediation.docUrl}`);
    }
  }

  // Test Case 2: Insufficient Wallet Balance
  console.log("\n[Error Test 2] Attempting to invest NGN 500,000 when wallet balance is only NGN 125,000...");
  try {
    await client.assets.investInAsset({
      accountId: "acc_demo_001",
      assetId: "ast_mmf_001",
      amount: 500_000
    });
  } catch (error) {
    if (error instanceof CowrywiseError) {
      console.log(`❌ Caught Expected Error: [${error.errorCode}] ${error.message}`);
      console.log(`   HTTP Status: ${error.statusCode}`);
      console.log(`   💡 Remediation Title:  ${error.remediation.title}`);
      console.log(`   🔍 Underlying Cause:   ${error.remediation.cause}`);
      console.log(`   ⚡ Actionable Solution: ${error.remediation.action}`);
      console.log(`   📖 Official Doc URL:   ${error.remediation.docUrl}`);
    }
  }

  // Test Case 3: Unverified Account Investment Attempt
  console.log("\n[Error Test 3] Attempting to create investment on an unverified account...");
  try {
    const unverifiedAcc = await client.accounts.createAccount({
      first_name: "Kemi",
      last_name: "Adesanya",
      email: "kemi.adesanya@example.ng",
      phone_number: "+2348055556677",
      terms_of_use_accepted: true
    });
    await client.assets.investInAsset({
      accountId: unverifiedAcc.account_id,
      assetId: "ast_mmf_001",
      amount: 5_000
    });
  } catch (error) {
    if (error instanceof CowrywiseError) {
      console.log(`❌ Caught Expected Error: [${error.errorCode}] ${error.message}`);
      console.log(`   HTTP Status: ${error.statusCode}`);
      console.log(`   💡 Remediation Title:  ${error.remediation.title}`);
      console.log(`   🔍 Underlying Cause:   ${error.remediation.cause}`);
      console.log(`   ⚡ Actionable Solution: ${error.remediation.action}`);
      console.log(`   📖 Official Doc URL:   ${error.remediation.docUrl}`);
    }
  }
}
