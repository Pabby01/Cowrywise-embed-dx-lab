import { createCowrywiseClient } from "./cowrywise-client.js";

async function main() {
  console.log("📈 Initializing YieldNest Mutual Funds Portal Starter...");
  const client = createCowrywiseClient();

  console.log("✓ Connected to Cowrywise Embed client.");
  console.log("✓ Ready to serve mutual fund catalog, risk profiles, and buy orders.");
}

main().catch(console.error);
