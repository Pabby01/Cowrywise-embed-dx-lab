import { loadConfig } from "./config.js";
import { createMockEmbedClient } from "./embed-client.js";

async function main(): Promise<void> {
  const config = loadConfig();
  const client = createMockEmbedClient();
  const portfolio = await client.getPortfolioSummary();

  console.log("Cowrywise Embed DX Lab — MOCK MODE");
  console.log("No Cowrywise API request was made.");
  console.log(`Mode: ${config.mode}`);
  console.log(`Customer reference: ${portfolio.customerReference}`);
  console.log(`Available balance: ${portfolio.currency} ${portfolio.availableBalance.toLocaleString("en-NG")}`);
  console.log(`Invested value: ${portfolio.currency} ${portfolio.investedValue.toLocaleString("en-NG")}`);
  console.log(`As of: ${portfolio.asOf}`);
  console.log(`Data source: ${portfolio.source}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Unexpected error");
  process.exitCode = 1;
});
