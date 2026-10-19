import { calculateRoundUp } from "./roundup-engine.js";

async function main() {
  console.log("🛒 Initializing SpareStash Round-Up Engine Starter...");
  
  const samplePurchase = 4320;
  const spareChange = calculateRoundUp(samplePurchase, 500);

  console.log(`✓ Sample Purchase: ₦${samplePurchase.toLocaleString()}`);
  console.log(`✓ Rounded Up To: ₦${(samplePurchase + spareChange).toLocaleString()} (+₦${spareChange} to wealth stash)`);
  console.log("✓ Ready to sweep accumulated stash via Cowrywise Embed API.");
}

main().catch(console.error);
