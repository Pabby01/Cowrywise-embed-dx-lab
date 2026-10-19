// ==========================================================================
// Cowrywise Embed — Official 3D Fintech Web Showcase & Sandbox Engine
// Powered by Three.js & Cowrywise Brand Design System
// ==========================================================================

// Global state
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

// Asset Catalog
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

// ==========================================================================
// 1. Interactive Three.js 3D Isometric Scene
// Recreates Cowrywise's signature architectural structure in 3D WebGL!
// ==========================================================================

function init3DScene() {
  const container = document.getElementById("canvas-container");
  const canvas = document.getElementById("cowrywise-canvas");
  if (!container || !canvas || typeof THREE === "undefined") return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  // Scene setup
  const scene = new THREE.Scene();
  scene.background = null; // Transparent to inherit soft mint gradient

  // Isometric Orthographic Camera
  const aspect = width / height;
  const d = 14;
  const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
  camera.position.set(20, 20, 20);
  camera.lookAt(0, 1.5, 0);

  // WebGL Renderer with antialiasing
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 0.9);
  mainLight.position.set(15, 25, 20);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 1024;
  mainLight.shadow.mapSize.height = 1024;
  scene.add(mainLight);

  // Soft Cowrywise Blue fill light
  const blueFill = new THREE.DirectionalLight(0x0066f5, 0.6);
  blueFill.position.set(-15, 10, -10);
  scene.add(blueFill);

  // Soft Emerald accent bounce light
  const greenBounce = new THREE.DirectionalLight(0x00c48c, 0.35);
  greenBounce.position.set(0, -10, 10);
  scene.add(greenBounce);

  // Group to hold all 3D architectural elements
  const structureGroup = new THREE.Group();
  scene.add(structureGroup);

  // Materials
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3,
    metalness: 0.05
  });

  const blueMat = new THREE.MeshStandardMaterial({
    color: 0x0066f5,
    roughness: 0.25,
    metalness: 0.15
  });

  const blueLightMat = new THREE.MeshStandardMaterial({
    color: 0x1a7aff,
    roughness: 0.2,
    metalness: 0.1
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xffb800,
    roughness: 0.3,
    metalness: 0.4
  });

  const emeraldMat = new THREE.MeshStandardMaterial({
    color: 0x00c48c,
    roughness: 0.2,
    metalness: 0.2,
    transparent: true,
    opacity: 0.85
  });

  const edgeMat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.25
  });

  function addBlock(w, h, depth, x, y, z, mat, parent = structureGroup) {
    const geo = new THREE.BoxGeometry(w, h, depth);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // Subtle edge highlight
    const edges = new THREE.EdgesGeometry(geo);
    const line = new THREE.LineSegments(edges, edgeMat);
    mesh.add(line);

    parent.add(mesh);
    return mesh;
  }

  // 1. Isometric Foundation Base
  const base = addBlock(14, 0.8, 14, 0, -0.4, 0, baseMat);

  // Isometric Grid Lines on Base
  const gridHelper = new THREE.GridHelper(14, 14, 0xd1efe0, 0xd1efe0);
  gridHelper.position.set(0, 0.02, 0);
  structureGroup.add(gridHelper);

  // 2. Iconic Cowrywise Blue Stepped Architectural Blocks (Forming the financial structure)
  // Left Pillar
  addBlock(2.2, 5.5, 2.2, -3.5, 2.75, 1.5, blueMat);
  addBlock(2.2, 7.5, 2.2, -3.5, 3.75, -1.5, blueLightMat);

  // Center Geometric Span
  addBlock(4.5, 2.2, 2.2, 0, 4.5, 0, blueMat);
  addBlock(2.2, 3.8, 2.2, 0, 1.9, 0, blueLightMat);

  // Right Pillar & Stepped Blocks
  addBlock(2.2, 9.0, 2.2, 3.5, 4.5, -1.5, blueMat);
  addBlock(2.2, 6.0, 2.2, 3.5, 3.0, 1.5, blueLightMat);
  addBlock(2.2, 3.0, 2.2, 3.5, 1.5, 3.5, blueMat);

  // 3. Golden Scaffolding & Ladder Bars (Cowrywise Construction Motif)
  const scaffoldGeo = new THREE.CylinderGeometry(0.08, 0.08, 10, 8);
  const pole1 = new THREE.Mesh(scaffoldGeo, goldMat);
  pole1.position.set(5.2, 5, -2.8);
  structureGroup.add(pole1);

  const pole2 = new THREE.Mesh(scaffoldGeo, goldMat);
  pole2.position.set(5.2, 5, 0.2);
  structureGroup.add(pole2);

  // Horizontal rungs
  for (let ry = 1; ry <= 9; ry += 1.2) {
    const rungGeo = new THREE.CylinderGeometry(0.06, 0.06, 3, 8);
    const rung = new THREE.Mesh(rungGeo, goldMat);
    rung.rotation.x = Math.PI / 2;
    rung.position.set(5.2, ry, -1.3);
    structureGroup.add(rung);
  }

  // 4. Floating Green Investment Yield Charts
  const chartGeo = new THREE.PlaneGeometry(3.5, 2.2);
  const chartMesh = new THREE.Mesh(chartGeo, emeraldMat);
  chartMesh.position.set(-2.5, 4.2, 4.2);
  chartMesh.rotation.y = -Math.PI / 5;
  structureGroup.add(chartMesh);

  // 5. Floating Currency Tokens (hovering & rotating)
  const coinGroup = new THREE.Group();
  structureGroup.add(coinGroup);

  const coinGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.2, 24);
  const coin1 = new THREE.Mesh(coinGeo, goldMat);
  coin1.position.set(-4.2, 6.5, 2.5);
  coin1.rotation.x = 0.5;
  coinGroup.add(coin1);

  const coin2 = new THREE.Mesh(coinGeo, blueMat);
  coin2.position.set(2.0, 8.2, 3.5);
  coin2.rotation.z = -0.4;
  coinGroup.add(coin2);

  // Interactive Mouse Parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;
  let isDragging = false;
  let prevMouseX = 0;

  window.addEventListener("mousemove", (e) => {
    const rect = container.getBoundingClientRect();
    if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
      mouseX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      mouseY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      targetRotationY = mouseX * 0.25;
      targetRotationX = mouseY * 0.15;
    }
  });

  // Drag to rotate
  container.addEventListener("mousedown", (e) => {
    isDragging = true;
    prevMouseX = e.clientX;
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  window.addEventListener("mousemove", (e) => {
    if (isDragging) {
      const deltaX = e.clientX - prevMouseX;
      structureGroup.rotation.y += deltaX * 0.008;
      prevMouseX = e.clientX;
    }
  });

  // Animation Loop
  let clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Gentle floating motion
    if (!isDragging) {
      structureGroup.rotation.y += (targetRotationY - structureGroup.rotation.y) * 0.05;
      structureGroup.rotation.x += (targetRotationX - structureGroup.rotation.x) * 0.05;
    }

    // Hover floating coins
    coin1.position.y = 6.5 + Math.sin(elapsedTime * 2.2) * 0.25;
    coin1.rotation.y += 0.02;

    coin2.position.y = 8.2 + Math.cos(elapsedTime * 1.8) * 0.3;
    coin2.rotation.y -= 0.015;

    renderer.render(scene, camera);
  }

  animate();

  // Resize Handler
  window.addEventListener("resize", () => {
    const newW = container.clientWidth;
    const newH = container.clientHeight;
    const newAspect = newW / newH;

    camera.left = -d * newAspect;
    camera.right = d * newAspect;
    camera.top = d;
    camera.bottom = -d;
    camera.updateProjectionMatrix();

    renderer.setSize(newW, newH);
  });
}

// ==========================================================================
// 2. UI Interactions, Tabs & Code Switcher
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  init3DScene();
  initTabs();
  initLanguageSwitcher();
  initCopyButton();
  initSandboxListeners();
  initDockScrollSpy();
  renderAll();
});

// Tab Navigation
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

// Language Switcher
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

// Copy Code Snippet
function initCopyButton() {
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

// Floating Bottom Dock ScrollSpy
function initDockScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const dockButtons = document.querySelectorAll(".dock-btn");

  window.addEventListener("scroll", () => {
    let currentId = "";
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) {
        currentId = sec.getAttribute("id") || "";
      }
    });

    dockButtons.forEach((btn) => {
      const href = btn.getAttribute("href")?.replace("#", "");
      if (href === currentId) {
        dockButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      }
    });
  });
}

// Sandbox Interactive Forms Listeners
function initSandboxListeners() {
  const panel = document.getElementById("sandbox-interactive-content");
  if (!panel) return;

  panel.addEventListener("click", (e) => {
    // Fill test BVN
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
        alert("✓ Tier-1 KYC Verified!\nCowrywise auto-provisioned wallet ID: wlt_demo_001.");
      } else {
        alert("❌ Error: CW_ERR_INVALID_BVN. In Sandbox mode, please use test BVN '22222222281'.");
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
        alert(`🛑 Error: Minimum investment for this asset is ${asset.currency} ${asset.min.toLocaleString()}.`);
        return;
      }
      if (state.wallet.balance < amt) {
        alert(`🛑 Error: CW_ERR_INSUFFICIENT_FUNDS. Available balance is ₦${state.wallet.balance.toLocaleString()}. Top up wallet first!`);
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
        alert("🛑 Error: Minimum savings duration on Cowrywise is 3 months.");
        return;
      }
      alert(`🎉 Savings Plan "${state.savingsPlan.name}" active for ${state.savingsPlan.months} months with guaranteed 12% p.a. interest!`);
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
      const valBadge = document.getElementById("months-val-badge");
      if (valBadge) valBadge.innerText = `${state.savingsPlan.months} Months`;
      renderCodePanel();
    }
    if (e.target.id === "select-webhook-event") {
      state.webhook.event = e.target.value;
      renderAll();
    }
  });
}

// Compute Simple In-Browser HMAC helper for simulation
function computeSimpleHMAC(secret, message) {
  let hash = 0;
  const str = secret + ":" + message;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, "0");
  return (hex + "49c5fe04944bfd8a14b1aa4b99a2aa7a9219c0adda145541").slice(0, 64);
}

// Render All
function renderAll() {
  const heroBal = document.getElementById("hero-stat-balance");
  const heroInv = document.getElementById("hero-stat-invested");
  const heroKyc = document.getElementById("hero-stat-kyc");

  if (heroBal) heroBal.innerText = `₦${state.wallet.balance.toLocaleString()}`;
  if (heroInv) heroInv.innerText = `₦${state.wallet.invested.toLocaleString()}`;
  if (heroKyc) heroKyc.innerText = state.account.isVerified ? "Verified (Tier 1)" : "Pending KYC";

  renderInteractivePanel();
  renderCodePanel();
}

// Render Interactive Panel
function renderInteractivePanel() {
  const panel = document.getElementById("sandbox-interactive-content");
  if (!panel) return;

  if (state.currentTab === "onboarding") {
    panel.innerHTML = `
      <h3 style="font-size:1.3rem; margin-bottom:8px; font-weight:700;">1. Account Creation & BVN Identity Check</h3>
      <p style="color:var(--cw-body); font-size:0.92rem; margin-bottom:24px;">
        Register your customer and submit Tier-1 BVN identity verification to auto-provision an investment wallet.
      </p>

      <div class="form-group">
        <label class="form-label">Customer Full Name</label>
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

      <div style="margin-top:24px;">
        <button id="btn-verify-kyc" class="btn-primary" type="button">
          ${state.account.isVerified ? "✓ BVN Verified" : "Submit Identity Verification"}
        </button>
      </div>

      ${state.account.isVerified ? `
        <div style="margin-top:20px; padding:16px; background:var(--cw-emerald-subtle); border:1px solid var(--cw-emerald-border); border-radius:8px;">
          <strong style="color:#03684B; font-size:0.9rem;">✓ Tier-1 KYC Verified</strong>
          <p style="font-size:0.85rem; color:var(--cw-body); margin-top:4px;">
            Wallet ID: <code>${state.wallet.id}</code> auto-created. Customer is now eligible to purchase mutual funds and savings products.
          </p>
        </div>
      ` : ""}
    `;
  } else if (state.currentTab === "investing") {
    panel.innerHTML = `
      <h3 style="font-size:1.3rem; margin-bottom:8px; font-weight:700;">2. Investment Products & Wallet Top-up</h3>
      <p style="color:var(--cw-body); font-size:0.92rem; margin-bottom:24px;">
        Wallets are the sole funding source and withdrawal destination on the Cowrywise Embed API.
      </p>

      <div style="background:var(--cw-mint-light); border:1px solid var(--cw-mint-border); border-radius:10px; padding:18px; margin-bottom:22px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <small style="color:var(--cw-muted); text-transform:uppercase; font-size:0.75rem; font-weight:600;">Wallet Available Balance</small>
          <div style="font-size:1.5rem; font-weight:800; color:var(--cw-title); font-family:var(--font-code);">₦${state.wallet.balance.toLocaleString()}</div>
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
      <h3 style="font-size:1.3rem; margin-bottom:8px; font-weight:700;">3. Goal-Oriented Locked Savings</h3>
      <p style="color:var(--cw-body); font-size:0.92rem; margin-bottom:24px;">
        Lock funds for fixed periods (minimum 3 months) with guaranteed interest and disciplined withdrawal rules.
      </p>

      <div class="form-group">
        <label class="form-label">Savings Plan Name</label>
        <input type="text" class="form-input" value="${state.savingsPlan.name}" />
      </div>

      <div class="form-group">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <label class="form-label" style="margin:0;">Lock Tenure</label>
          <span id="months-val-badge" class="badge-sandbox-hint">${state.savingsPlan.months} Months</span>
        </div>
        <input type="range" id="savings-months-slider" min="3" max="24" step="1" value="${state.savingsPlan.months}" style="width:100%; accent-color:var(--cw-blue);" />
        <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--cw-muted); margin-top:6px;">
          <span>3 Months (Min)</span>
          <span>12 Months</span>
          <span>24 Months</span>
        </div>
      </div>

      <div style="background:var(--cw-blue-subtle); border:1px solid rgba(0,102,245,0.18); border-radius:10px; padding:18px; margin-bottom:22px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <span style="font-size:0.88rem; color:var(--cw-body);">Annual Interest Rate</span>
          <strong style="color:var(--cw-blue);">12.0% p.a.</strong>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span style="font-size:0.88rem; color:var(--cw-body);">Estimated Interest Earned</span>
          <strong style="color:var(--cw-title); font-family:var(--font-code);">+₦${Math.round(state.savingsPlan.target * 0.12 * (state.savingsPlan.months / 12)).toLocaleString()}</strong>
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
      <h3 style="font-size:1.3rem; margin-bottom:8px; font-weight:700;">4. Webhooks & HMAC SHA-256 Verifier</h3>
      <p style="color:var(--cw-body); font-size:0.92rem; margin-bottom:20px;">
        Verify real-time webhook payloads using constant-time buffer comparisons to prevent timing side-channels.
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

      <div style="background:#060D1A; border:1px solid #1E2D4A; border-radius:8px; padding:14px; font-family:var(--font-code); font-size:0.82rem; margin-bottom:16px;">
        <div style="color:#64748B; margin-bottom:4px;">// Inbound Signature</div>
        <div style="color:${state.webhook.isTampered ? "#FF4757" : "#00C48C"}; word-break:break-all;">
          ${signature}
        </div>
      </div>

      <div style="padding:14px; border-radius:8px; margin-bottom:20px; background:${state.webhook.isTampered ? "#FEE2E2" : "var(--cw-emerald-subtle)"}; border:1px solid ${state.webhook.isTampered ? "#FECACA" : "var(--cw-emerald-border)"};">
        <div style="font-weight:700; color:${state.webhook.isTampered ? "var(--cw-crimson)" : "#03684B"}; font-size:0.9rem;">
          ${state.webhook.isTampered ? "🛑 REJECTED: Forged / Invalid Signature" : "✅ VERIFIED: Valid HMAC SHA-256 Match"}
        </div>
        <div style="font-size:0.82rem; color:var(--cw-body); margin-top:4px;">
          ${state.webhook.isTampered ? "Timing-safe buffer comparison failed. Request safely rejected with HTTP 401." : "Signature matches HMAC(CLIENT_SECRET, CLIENT_ID). Safe to credit user balance."}
        </div>
      </div>

      <button id="btn-toggle-tamper" class="btn-secondary" type="button" style="width:100%;">
        ${state.webhook.isTampered ? "Restore Valid Signature" : "Simulate Forged / Tampered Webhook"}
      </button>
    `;
  }
}

// Render Code Panel
function renderCodePanel() {
  const codeEl = document.getElementById("code-display");
  if (!codeEl) return;

  if (state.currentLang === "node") {
    if (state.currentTab === "onboarding") {
      codeEl.innerText = `// 1. Account Creation & Identity Verification (Node.js)
import Client from "@cowrywise/embed-node";

const cowrywise = new Client({
  client_id: process.env.COWRYWISE_CLIENT_ID,
  client_secret: process.env.COWRYWISE_CLIENT_SECRET,
  embed_api_base_url: "https://sandbox.embed.cowrywise.com/api/v1"
});

// Register customer
const account = await cowrywise.accounts.createAccount({
  first_name: "Amara",
  last_name: "Eze",
  email: "amara.eze@example.ng",
  phone_number: "+2348039876543",
  terms_of_use_accepted: true
});

// Submit BVN verification (Sandbox test BVN: 22222222281)
const kyc = await cowrywise.accounts.updateIdentity(account.account_id, {
  identity_type: "bvn",
  identity_value: "22222222281"
});

console.log("Verified:", kyc.is_verified); // true`;
    } else if (state.currentTab === "investing") {
      codeEl.innerText = `// 2. Query Asset Catalog & Invest (Node.js)
const assets = await cowrywise.assets.getAssets();
const target = assets.find(a => a.asset_id === "${state.activeAsset}");

// Fetch customer wallet
const [wallet] = await cowrywise.wallets.getWallets(accountId);

// Execute investment
const investment = await cowrywise.assets.investInAsset({
  accountId: "${state.account.id}",
  assetId: "${state.activeAsset}",
  amount: ${state.investAmount}
});

console.log("Units allocated:", investment.units);`;
    } else if (state.currentTab === "savings") {
      codeEl.innerText = `// 3. Create Locked Savings Plan (Node.js)
const plan = await cowrywise.savings.createSavingsPlan({
  account_id: "${state.account.id}",
  name: "${state.savingsPlan.name}",
  target_amount: ${state.savingsPlan.target},
  duration_months: ${state.savingsPlan.months}, // Minimum 3 months
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

  const expectedBuf = Buffer.from(computedHash.toLowerCase(), "utf8");
  const receivedBuf = Buffer.from(incomingSignature.toLowerCase(), "utf8");

  if (expectedBuf.length !== receivedBuf.length) {
    return res.status(401).send("Invalid signature length");
  }

  const isValid = crypto.timingSafeEqual(expectedBuf, receivedBuf);
  if (!isValid) return res.status(401).send("Signature mismatch");

  // Idempotent event processing...
  return res.status(200).send("OK");
}`;
    }
  } else if (state.currentLang === "python") {
    codeEl.innerText = `# Cowrywise Embed Python (@cowrywise/embedpy)
from cowrywise import Cowrywise
import hmac, hashlib

client = Cowrywise(
    client_id="YOUR_CLIENT_ID",
    client_secret="YOUR_CLIENT_SECRET",
    base_url="https://sandbox.embed.cowrywise.com/api/v1"
)

# Webhook verification helper
def verify_signature(signature, client_id, client_secret):
    computed = hmac.new(
        client_secret.encode(),
        client_id.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(computed.lower(), signature.lower())`;
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
