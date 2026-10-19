import { splitSalary } from "./payroll-split.js";

async function main() {
  console.log("🏢 Initializing CorpYield B2B Payroll Salary Split Starter...");

  const salary = 600000;
  const split = splitSalary(salary, {
    emergencyPercent: 15,
    eurobondsPercent: 15,
    netCheckingPercent: 70
  });

  console.log(`✓ Monthly Gross Net: ₦${salary.toLocaleString()}`);
  console.log(`✓ 15% to Locked Emergency Savings: ₦${split.emergencyAmount.toLocaleString()}`);
  console.log(`✓ 15% to Sovereign Eurobonds: ₦${split.eurobondsAmount.toLocaleString()}`);
  console.log(`✓ 70% to Bank Checking: ₦${split.netCheckingAmount.toLocaleString()}`);
  console.log("✓ Ready to disburse via Cowrywise Virtual Accounts.");
}

main().catch(console.error);
