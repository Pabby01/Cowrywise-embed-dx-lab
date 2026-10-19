import { loadConfig } from "./config.js";
import { createMockEmbedClient } from "./embed-client.js";
import { runOnboardingScenario } from "./scenarios/onboarding.js";
import { runInvestingScenario } from "./scenarios/investing.js";
import { runWithdrawalsScenario } from "./scenarios/withdrawals.js";
import { runWebhooksScenario } from "./scenarios/webhooks.js";
import { runTroubleshootingScenario } from "./scenarios/troubleshooting.js";

async function main(): Promise<void> {
  const config = loadConfig();
  const client = createMockEmbedClient();

  const args = process.argv.slice(2);
  const scenarioArg = args.find((arg) => arg.startsWith("--scenario="))?.split("=")[1]?.toLowerCase();
  const isHelp = args.includes("--help") || args.includes("-h");

  console.log("================================================================");
  console.log("  COWRYWISE EMBED DEVELOPER EXPERIENCE (DX) LAB & STARTER PACK  ");
  console.log("  Mode: MOCK (Safe In-Memory Architecture, Zero Live Credentials) ");
  console.log("================================================================");

  if (isHelp) {
    console.log("\nUsage:");
    console.log("  npm run dev                     Run full end-to-end integration tour");
    console.log("  npm run dev -- --scenario=onboarding    Run KYC & BVN onboarding scenario");
    console.log("  npm run dev -- --scenario=invest        Run Wallet funding & investment scenario");
    console.log("  npm run dev -- --scenario=withdrawals   Run 24h cooling-off payout scenario");
    console.log("  npm run dev -- --scenario=webhooks      Run HMAC-SHA256 signature verification");
    console.log("  npm run dev -- --scenario=troubleshooting Run Error diagnostics & remediation");
    console.log("  npm run demo                            Launch local 3D Fintech Web Showcase");
    return;
  }

  if (scenarioArg) {
    switch (scenarioArg) {
      case "onboarding":
        await runOnboardingScenario();
        break;
      case "invest":
        await runInvestingScenario();
        break;
      case "withdrawals":
        await runWithdrawalsScenario();
        break;
      case "webhooks":
        await runWebhooksScenario();
        break;
      case "troubleshooting":
        await runTroubleshootingScenario();
        break;
      default:
        console.error(`Unknown scenario: "${scenarioArg}". Run with --help to see available scenarios.`);
        process.exitCode = 1;
        return;
    }
    return;
  }

  // Default: Run the full integration tour
  const portfolio = await client.getPortfolioSummary();
  console.log("\n[Overview: Current Portfolio]");
  console.log(`  Customer: ${portfolio.customerReference}`);
  console.log(`  Available Balance: ${portfolio.currency} ${portfolio.availableBalance.toLocaleString("en-NG")}`);
  console.log(`  Invested Value:    ${portfolio.currency} ${portfolio.investedValue.toLocaleString("en-NG")}`);
  console.log(`  Data Source:       ${portfolio.source}`);

  // Run all scenarios sequentially
  await runOnboardingScenario();
  await runInvestingScenario();
  await runWithdrawalsScenario();
  await runWebhooksScenario();
  await runTroubleshootingScenario();

  console.log("\n================================================================");
  console.log("  ✅ INTEGRATION TOUR COMPLETE!");
  console.log("  Launch the interactive 3D Web Showcase: npm run demo");
  console.log("  Explore full architectural guides: docs/quickstart.md");
  console.log("================================================================\n");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Unexpected error");
  process.exitCode = 1;
});
