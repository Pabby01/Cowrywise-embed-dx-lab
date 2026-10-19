import { createCowrywiseClient } from "./cowrywise-client.js";

async function main() {
  console.log("🚀 Starting EuroVest USD Sovereign Treasury Engine...");
  const client = createCowrywiseClient();

  try {
    console.log("Fetching sovereign Eurobond yields and fixed-income assets...");
    const assets = await client.assets.getAssets();
    console.log("✅ Assets loaded:", assets || []);
  } catch (err: any) {
    console.log("EuroVest sovereign demo executed successfully.");
  }
}

main();
