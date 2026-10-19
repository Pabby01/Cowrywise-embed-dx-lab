// ==========================================================================
// Cowrywise Embed 3D Fintech Web Showcase & Sandbox Logic
// ==========================================================================

// State management for interactive sandbox
const state = {
  currentTab: "onboarding",
  currentLang: "node",
  account: {
    id: "acc_demo_001",
    name: "Amara Eze",
    email: "amara.eze@example.ng",
    phone: "+2348039876543",
    status: "pending_verification",
    isVerified: false,
    bvn: ""
  },
  wallet: {
    id: "wlt_demo_001",
    currency: "NGN",
    balance: 125000,
    invested: 350000
  },
  activeAsset: "ast_mmf_001",
  investAmount: 50000,
  savingsPlan: {
    name: "Tech Career Emergency Fund",
    target: 500000,
    deposit: 25000,
    months: 6,
    interestRate: 12
  },
  webhook: {
    event: "wallet.funded",
    isTampered: false,
    clientId: "cw_client_sandbox_demo",
    clientSecret: "cw_sec_test_abc123xyz"
  }
};

// Assets catalog
const ASSETS = {
  ast_mmf_001: {
    name: "Cowrywise Money Market Fund",
    category: "Mutual Fund",
    rate: 16.5,
    unitPrice: 100.0,
    currency: "NGN",
    min: 1000
  },
  ast_tbill_002: {
    name: "Federal Govt Treasury Bills (182-Day)",
    category: "Treasury Bill",
    rate: 18.2,
    unitPrice: 1000.0,
    currency: "NGN",
    min: 50000
  },
  ast_eurobond_003: {
    name: "Nigeria Sovereign Eurobond Fund",
    category: "Eurobond",
    rate: 8.75,
    unitPrice: 10.0,
    currency: "USD",
    min: 100
  }
};

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  init3DParallax();
  initTabs();
  initLanguageSwitcher();
  initCopyButtons();
  initSandboxListeners();
  renderAll();
});

// 1. 3D Card Parallax on Mouse Move
function init3DParallax() {
  const scene = document.querySelector(".fintech-3d-scene");
  const card = document.querySelector(".card-3d-wrapper");

  if (!scene || !card) return;

  scene.addEventListener("mousemove", (e) => {
    const rect = scene.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / rect.height) * 22;
    const rotY = (x / rect.width) * 22;

    card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  scene.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  });
}

// 2. Tab Navigation
function initTabs() {
  const tabs = document.querySelectorAll(".sandbox-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      state.currentTab = tab.dataset.tab;
      renderInteractivePanel();
      renderCodePanel();
    });
  });
}

// 3. Language Switcher (Node.js / Python / cURL)
function initLanguageSwitcher() {
  const btns = document.querySelectorAll(".lang-btn");
  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.currentLang = btn.dataset.lang;
      renderCodePanel();
    });
  });
}

// 4. Copy to Clipboard
function initCopyButtons() {
  const copyBtn = document.getElementById("copy-code-btn");
  if (!copyBtn) return;

  copyBtn.addEventListener("click", () => {
    const codeEl = document.getElementById("code-display");
    if (!codeEl) return;
    navigator.clipboard.writeText(codeEl.innerText).then(() => {
      copyBtn.innerText = "✓ Copied!";
      setTimeout(() => (copyBtn.innerText = "Copy Snippet"), 2000);
    });
  });
}

// 5. Sandbox Interactive Listeners
function initSandboxListeners() {
  // Delegated events for dynamic forms
  const panel = document.getElementById("sandbox-interactive-content");
  if (!panel) return;

  panel.addEventListener("click", (e) => {
    // Fill test BVN button
    if (e.target.id === "btn-fill-bvn") {
      const bvnInput = document.getElementById("input-bvn");
      if (bvnInput) bvnInput.value = "22222222281";
    }

    // Submit KYC Verification
    if (e.target.id === "btn-verify-kyc") {
      const bvnInput = document.getElementById("input-bvn");
      const val = bvnInput ? bvnInput.value.trim() : "";
      if (val === "22222222281") {
        state.account.isVerified = true;
        state.account.status = "verified";
        state.account.bvn = val;
        alert("✓ KYC Verified! Investment wallet auto-created on Embed API.");
      } else {
        alert("❌ Error: Invalid BVN. In Sandbox mode, use test BVN '22222222281'.");
      }
      renderAll();
    }

    // Fund Wallet
    if (e.target.id === "btn-fund-wallet") {
      state.wallet.balance += 50000;
      alert("✓ Simulated Top-Up of ₦50,000 received via virtual bank transfer.");
      renderAll();
    }

    // Execute Investment
    if (e.target.id === "btn-execute-invest") {
      const asset = ASSETS[state.activeAsset];
      const amtInput = document.getElementById("input-invest-amt");
      const amt = amtInput ? Number(amtInput.value) : state.investAmount;

      if (!state.account.isVerified) {
        alert("🛑 Error: CW_ERR_ACCOUNT_UNVERIFIED. Complete BVN verification first!");
        return;
      }
      if (amt < asset.min) {
        alert(`🛑 Error: Minimum investment is ${asset.currency} ${asset.min.toLocaleString()}.`);
        return;
      }
      if (state.wallet.balance < amt) {
        alert(`🛑 Error: Insufficient funds. Wallet has ₦${state.wallet.balance.toLocaleString()}. Top up first!`);
        return;
      }

      state.wallet.balance -= amt;
      state.wallet.invested += amt;
      const units = (amt / asset.unitPrice).toFixed(2);
      alert(`🎉 Investment Successful!\nPurchased ${units} units of ${asset.name} for ₦${amt.toLocaleString()}.`);
      renderAll();
    }

    // Create Savings Plan
    if (e.target.id === "btn-create-savings") {
      if (!state.account.isVerified) {
        alert("🛑 Error: Complete BVN KYC first.");
        return;
      }
      if (state.savingsPlan.months < 3) {
        alert("🛑 Error: Minimum duration is 3 months.");
        return;
      }
      alert(`🎉 Savings Plan "${state.savingsPlan.name}" active for ${state.savingsPlan.months} months at 12% p.a.!`);
    }

    // Toggle Tampered Webhook
    if (e.target.id === "btn-toggle-tamper") {
      state.webhook.isTampered = !state.webhook.isTampered;
      renderAll();
    }
  });

  panel.addEventListener("change", (e) => {
    if (e.target.id === "select-asset") {
      state.activeAsset = e.target.value;
      renderCodePanel();
    }
    if (e.target.id === "savings-months-slider") {
      state.savingsPlan.months = Number(e.target.value);
      document.getElementById("months-val-badge").innerText = `${state.savingsPlan.months} Months`;
      renderCodePanel();
    }
    if (e.target.id === "select-webhook-event") {
      state.webhook.event = e.target.value;
      renderAll();
    }
  });
}

// 6. Simple In-Browser HMAC-SHA256 simulation helper
function computeSimpleHMAC(secret, message) {
  // Pure visual representation of SHA256 hex string based on input
  let hash = 0;
  const str = secret + ":" + message;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, "0");
  return (hex + "49c5fe04944bfd8a14b1aa4b99a2aa7a9219c0adda145541").slice(0, 64);
}

// 7. Render All
function renderAll() {
  // Update 3D card display
  const balEl = document.getElementById("hero-card-balance");
  const invEl = document.getElementById("hero-card-invested");
  const statEl = document.getElementById("hero-card-status");

  if (balEl) balEl.innerText = `₦${state.wallet.balance.toLocaleString()}`;
  if (invEl) invEl.innerText = `₦${state.wallet.invested.toLocaleString()}`;
  if (statEl) statEl.innerText = state.account.isVerified ? "Verified (Tier 1)" : "Pending KYC";

  renderInteractivePanel();
  renderCodePanel();
}

// 8. Render Interactive Panel
function renderInteractivePanel() {
  const panel = document.getElementById("sandbox-interactive-content");
  if (!panel) return;

  if (state.currentTab === "onboarding") {
    panel.innerHTML = `
      <h3 style="font-size:1.25rem; margin-bottom:8px; font-weight:700;">1. Account Creation & BVN Identity Check</h3>
      <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:24px;">
        Register your end-user and submit Tier-1 BVN identity verification to auto-create an investment wallet.
      </p>

      <div class="form-group">
        <label class="form-label">Investor Full Name</label>
        <input type="text" class="form-input" value="${state.account.name}" readonly />
      </div>

      <div class="form-group">
        <label class="form-label">Email Address</label>
        <input type="email" class="form-input" value="${state.account.email}" readonly />
      </div>

      <div class="form-group">
        <label class="form-label">Bank Verification Number (BVN)</label>
        <div style="display:flex; gap:8px;">
          <input type="text" id="input-bvn" class="form-input" placeholder="Enter 11-digit BVN" value="${state.account.bvn || ""}" />
          <button id="btn-fill-bvn" class="btn-secondary" type="button" style="white-space:nowrap;">Use Test BVN</button>
        </div>
        <div class="badge-sandbox-hint">Sandbox Test BVN: 22222222281</div>
      </div>

      <div style="display:flex; gap:12px; margin-top:24px;">
        <button id="btn-verify-kyc" class="btn-primary" type="button">
          ${state.account.isVerified ? "✓ Verified Again" : "Submit Identity Verification"}
        </button>
      </div>

      ${state.account.isVerified ? `
        <div style="margin-top:20px; padding:12px; background:rgba(0,196,140,0.1); border:1px solid rgba(0,196,140,0.3); border-radius:8px;">
          <strong style="color:var(--cw-emerald); font-size:0.85rem;">✓ Tier-1 KYC Active</strong>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">
            Wallet ID: <code>${state.wallet.id}</code> auto-provisioned. You may now explore investment products!
          </p>
        </div>
      ` : ""}
    `;
  } else if (state.currentTab === "investing") {
    panel.innerHTML = `
      <h3 style="font-size:1.25rem; margin-bottom:8px; font-weight:700;">2. Investment Products & Wallet Top-up</h3>
      <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:24px;">
        Wallets are the sole funding source. Top up your wallet and buy mutual fund units.
      </p>

      <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:8px; padding:16px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <small style="color:var(--text-dim); text-transform:uppercase; font-size:0.75rem;">Wallet Available Balance</small>
          <div style="font-size:1.4rem; font-weight:800; color:white; font-family:var(--font-code);">₦${state.wallet.balance.toLocaleString()}</div>
        </div>
        <button id="btn-fund-wallet" class="btn-secondary" type="button">+ Fund ₦50,000</button>
      </div>

      <div class="form-group">
        <label class="form-label">Select Investment Product</label>
        <select id="select-asset" class="form-input">
          ${Object.entries(ASSETS).map(([id, a]) => `
            <option value="${id}" ${state.activeAsset === id ? "selected" : ""}>
              ${a.name} (${a.rate}% p.a. - ${a.category})
            </option>
          `).join("")}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Investment Amount (NGN)</label>
        <input type="number" id="input-invest-amt" class="form-input" value="${state.investAmount}" step="5000" />
      </div>

      <button id="btn-execute-invest" class="btn-primary" type="button" style="width:100%;">
        Confirm & Purchase Asset Units
      </button>
    `;
  } else if (state.currentTab === "savings") {
    panel.innerHTML = `
      <h3 style="font-size:1.25rem; margin-bottom:8px; font-weight:700;">3. Goal-Oriented Locked Savings</h3>
      <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:24px;">
        Create disciplined savings with locked tenures (minimum 3 months) and guaranteed annual returns.
      </p>

      <div class="form-group">
        <label class="form-label">Savings Plan Name</label>
        <input type="text" class="form-input" value="${state.savingsPlan.name}" />
      </div>

      <div class="form-group">
        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
          <label class="form-label" style="margin:0;">Duration Tenure</label>
          <span id="months-val-badge" class="badge-sandbox-hint">${state.savingsPlan.months} Months</span>
        </div>
        <input type="range" id="savings-months-slider" min="3" max="24" step="1" value="${state.savingsPlan.months}" style="width:100%; accent-color:var(--cw-blue);" />
        <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-dim); margin-top:4px;">
          <span>3 Months (Min)</span>
          <span>12 Months</span>
          <span>24 Months</span>
        </div>
      </div>

      <div style="background:rgba(0,102,245,0.08); border:1px solid rgba(0,102,245,0.25); border-radius:8px; padding:16px; margin-bottom:20px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <span style="font-size:0.85rem; color:var(--text-muted);">Interest Rate</span>
          <strong style="color:var(--cw-emerald);">12.0% p.a.</strong>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span style="font-size:0.85rem; color:var(--text-muted);">Projected Earnings</span>
          <strong style="color:white; font-family:var(--font-code);">+₦${Math.round(state.savingsPlan.target * 0.12 * (state.savingsPlan.months / 12)).toLocaleString()}</strong>
        </div>
      </div>

      <button id="btn-create-savings" class="btn-primary" type="button" style="width:100%;">
        Create Locked Savings Plan
      </button>
    `;
  } else if (state.currentTab === "webhooks") {
    const computedHash = computeSimpleHMAC(state.webhook.clientSecret, state.webhook.clientId);
    const signature = state.webhook.isTampered ? "000000000000000000000000000000000000000000000000" : computedHash;

    panel.innerHTML = `
      <h3 style="font-size:1.25rem; margin-bottom:8px; font-weight:700;">4. Webhooks & HMAC SHA-256 Verifier</h3>
      <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:20px;">
        Test real-time webhook events and observe constant-time signature validation.
      </p>

      <div class="form-group">
        <label class="form-label">Simulate Event Type</label>
        <select id="select-webhook-event" class="form-input">
          <option value="wallet.funded" ${state.webhook.event === "wallet.funded" ? "selected" : ""}>wallet.funded</option>
          <option value="investment.created" ${state.webhook.event === "investment.created" ? "selected" : ""}>investment.created</option>
          <option value="withdrawal.completed" ${state.webhook.event === "withdrawal.completed" ? "selected" : ""}>withdrawal.completed</option>
          <option value="identity.verified" ${state.webhook.event === "identity.verified" ? "selected" : ""}>identity.verified</option>
        </select>
      </div>

      <div style="background:#050914; border:1px solid var(--border-subtle); border-radius:8px; padding:14px; font-family:var(--font-code); font-size:0.8rem; margin-bottom:16px;">
        <div style="color:var(--text-dim); margin-bottom:4px;">// Inbound Signature Header</div>
        <div style="color:${state.webhook.isTampered ? "var(--cw-crimson)" : "var(--cw-emerald)"}; word-break:break-all;">
          ${signature}
        </div>
      </div>

      <div style="padding:12px; border-radius:8px; margin-bottom:20px; background:${state.webhook.isTampered ? "rgba(255,71,87,0.1)" : "rgba(0,196,140,0.1)"}; border:1px solid ${state.webhook.isTampered ? "rgba(255,71,87,0.3)" : "rgba(0,196,140,0.3)"};">
        <div style="font-weight:700; color:${state.webhook.isTampered ? "var(--cw-crimson)" : "var(--cw-emerald)"}; font-size:0.85rem;">
          ${state.webhook.isTampered ? "🛑 REJECTED: Forged / Tampered Signature" : "✅ VERIFIED: Valid HMAC-SHA256 Match"}
        </div>
        <div style="font-size:0.78rem; color:var(--text-muted); margin-top:4px;">
          ${state.webhook.isTampered ? "Timing-safe comparison detected a signature mismatch. Event safely dropped." : "Matches HMAC(CLIENT_SECRET, CLIENT_ID). Safe to credit balance."}
        </div>
      </div>

      <button id="btn-toggle-tamper" class="btn-secondary" type="button" style="width:100%;">
        ${state.webhook.isTampered ? "Restore Valid Signature" : "Simulate Tampered / Forged Request"}
      </button>
    `;
  }
}

// 9. Render Code Panel
function renderCodePanel() {
  const codeEl = document.getElementById("code-display");
  if (!codeEl) return;

  if (state.currentLang === "node") {
    if (state.currentTab === "onboarding") {
      codeEl.innerText = `// 1. Create Account & Submit BVN (Node.js SDK)
import Client from "@cowrywise/embed-node";

const cowrywise = new Client({
  client_id: process.env.COWRYWISE_CLIENT_ID,
  client_secret: process.env.COWRYWISE_CLIENT_SECRET,
  embed_api_base_url: "https://sandbox.embed.cowrywise.com/api/v1"
});

// Create customer account
const account = await cowrywise.accounts.createAccount({
  first_name: "Amara",
  last_name: "Eze",
  email: "amara.eze@example.ng",
  phone_number: "+2348039876543",
  terms_of_use_accepted: true
});

// Submit BVN verification (test BVN: 22222222281)
const kyc = await cowrywise.accounts.updateIdentity(account.account_id, {
  identity_type: "bvn",
  identity_value: "22222222281"
});

console.log("Verified:", kyc.is_verified);`;
    } else if (state.currentTab === "investing") {
      codeEl.innerText = `// 2. Query Assets & Invest (Node.js SDK)
const assets = await cowrywise.assets.getAssets();
const targetAsset = assets.find(a => a.asset_id === "${state.activeAsset}");

// Wallets are the sole funding source
const [wallet] = await cowrywise.wallets.getWallets(accountId);

// Execute investment
const investment = await cowrywise.assets.investInAsset({
  accountId: "${state.account.id}",
  assetId: "${state.activeAsset}",
  amount: ${state.investAmount}
});

console.log("Allocated units:", investment.units);`;
    } else if (state.currentTab === "savings") {
      codeEl.innerText = `// 3. Create Locked Savings Plan (Node.js SDK)
const plan = await cowrywise.savings.createSavingsPlan({
  account_id: "${state.account.id}",
  name: "${state.savingsPlan.name}",
  target_amount: ${state.savingsPlan.target},
  duration_months: ${state.savingsPlan.months}, // Min 3 months
  interest_enabled: true
});

console.log("Maturity Date:", plan.maturity_date);`;
    } else if (state.currentTab === "webhooks") {
      codeEl.innerText = `// 4. Constant-Time Webhook Verification (Node.js)
import crypto from "node:crypto";

export function handleWebhook(req, res) {
  const incomingSignature = req.body.signature;
  
  // Cowrywise signs CLIENT_ID using CLIENT_SECRET as the key
  const computedHash = crypto
    .createHmac("sha256", process.env.COWRYWISE_CLIENT_SECRET)
    .update(process.env.COWRYWISE_CLIENT_ID)
    .digest("hex");

  const valid = crypto.timingSafeEqual(
    Buffer.from(computedHash.toLowerCase()),
    Buffer.from(incomingSignature.toLowerCase())
  );

  if (!valid) return res.status(401).send("Invalid signature");

  // Idempotent processing...
  return res.status(200).send("OK");
}`;
    }
  } else if (state.currentLang === "python") {
    if (state.currentTab === "onboarding") {
      codeEl.innerText = `# 1. Create Account & Submit BVN (embedpy)
from cowrywise import Cowrywise

client = Cowrywise(
    client_id="YOUR_CLIENT_ID",
    client_secret="YOUR_CLIENT_SECRET",
    base_url="https://sandbox.embed.cowrywise.com/api/v1"
)

account = client.accounts.create(
    first_name="Amara",
    last_name="Eze",
    email="amara.eze@example.ng",
    phone_number="+2348039876543",
    terms_of_use_accepted=True
)

kyc = client.accounts.update_identity(
    account["account_id"],
    identity_type="bvn",
    identity_value="22222222281"
)`;
    } else {
      codeEl.innerText = `# Python Webhook Verification
import hmac, hashlib

def verify_signature(signature, client_id, client_secret):
    computed = hmac.new(
        client_secret.encode(),
        client_id.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(computed.lower(), signature.lower())`;
    }
  } else if (state.currentLang === "curl") {
    codeEl.innerText = `curl --request POST "https://sandbox.embed.cowrywise.com/api/v1/accounts" \\
  --header "Authorization: Bearer YOUR_TOKEN" \\
  --header "Content-Type: application/json" \\
  --data '{
    "first_name": "Amara",
    "last_name": "Eze",
    "email": "amara.eze@example.ng",
    "phone_number": "+2348039876543",
    "terms_of_use_accepted": true
  }'`;
  }
}
