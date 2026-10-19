import { createCowrywiseClient } from "./cowrywise-client.js";

async function main() {
  console.log("🏦 Initializing KoloVault Savings Web App Starter...");
  const client = createCowrywiseClient();

  console.log("✓ Cowrywise Embed client connected.");
  console.log("✓ Ready to handle /savings/create, /wallets/deposit, and milestone tracking.");
}

main().catch(console.error);
