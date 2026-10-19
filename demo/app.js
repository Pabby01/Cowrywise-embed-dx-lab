// ==========================================================================
// Cowrywise Embed — Official 3D Fintech Web Showcase & Live Sandbox Engine
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
  },
  lastResponse: {
    status: 200,
    statusText: "OK",
    latency: 114,
    body: {
      message: "Ready to test live requests. Select a flow and click Send Request."
    }
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
// 1. Toast Notification System (Replaces window.alert)
// ==========================================================================

function showToast({ type = "info", title = "", message = "", duration = 4000 }) {
  if (window.trigger3DVaultPulse) {
    if (type === "success") window.trigger3DVaultPulse("success");
    else if (type === "error") window.trigger3DVaultPulse("error");
  }

  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  const iconName = type === "success" ? "check" : type === "error" ? "alert" : "shieldCheck";
  const iconSvg = window.CW_ICONS ? window.CW_ICONS.icon(iconName) : "✓";

  toast.innerHTML = `
    <div class="toast-icon">${iconSvg}</div>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" type="button">${window.CW_ICONS ? window.CW_ICONS.icon("close") : "✕"}</button>
    <div class="toast-progress"></div>
  `;

  const closeBtn = toast.querySelector(".toast-close");
  const dismiss = () => {
    toast.classList.add("toast-fade-out");
    setTimeout(() => toast.remove(), 280);
  };

  closeBtn?.addEventListener("click", dismiss);
  setTimeout(dismiss, duration);

  container.appendChild(toast);
}

// ==========================================================================
// 2. UI Modal System (Custom Interactive Popups)
// ==========================================================================

function openModal({ title, contentHtml, onConfirm, confirmText = "Close" }) {
  let backdrop = document.getElementById("modal-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.id = "modal-backdrop";
    backdrop.className = "modal-backdrop";
    backdrop.innerHTML = `
      <div class="modal-box">
        <div class="modal-header">
          <div class="modal-title" id="modal-title"></div>
          <button class="modal-close-btn" id="modal-close" type="button">${window.CW_ICONS ? window.CW_ICONS.icon("close") : "✕"}</button>
        </div>
        <div class="modal-body" id="modal-body"></div>
        <div class="modal-footer" id="modal-footer"></div>
      </div>
    `;
    document.body.appendChild(backdrop);

    backdrop.querySelector("#modal-close")?.addEventListener("click", closeModal);
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeModal();
    });
  }

  document.getElementById("modal-title").innerHTML = title;
  document.getElementById("modal-body").innerHTML = contentHtml;
  
  const footer = document.getElementById("modal-footer");
  footer.innerHTML = `
    <button class="btn-primary" id="modal-confirm-btn" type="button">${confirmText}</button>
  `;

  document.getElementById("modal-confirm-btn")?.addEventListener("click", () => {
    if (onConfirm) onConfirm();
    closeModal();
  });

  backdrop.classList.add("active");
}

function closeModal() {
  const backdrop = document.getElementById("modal-backdrop");
  if (backdrop) backdrop.classList.remove("active");
}

// ==========================================================================
// 3. Live Console Stream Logger
// ==========================================================================

function logConsole(tag, message) {
  const stream = document.getElementById("console-stream");
  if (!stream) return;

  const now = new Date();
  const timeStr = now.toTimeString().split(" ")[0] + "." + String(now.getMilliseconds()).padStart(3, "0");

  const row = document.createElement("div");
  row.className = "console-row";

  let tagClass = "tag-http";
  if (tag === "WEBHOOK") tagClass = "tag-webhook";
  if (tag === "SECURITY") tagClass = "tag-security";
  if (tag === "ERROR") tagClass = "tag-error";

  row.innerHTML = `
    <span class="console-time">[${timeStr}]</span>
    <span class="console-tag ${tagClass}">${tag}</span>
    <span class="console-msg">${message}</span>
  `;

  stream.appendChild(row);
  stream.scrollTop = stream.scrollHeight;
}

// Clear console
function clearConsole() {
  const stream = document.getElementById("console-stream");
  if (stream) stream.innerHTML = "";
  logConsole("INFO", "Console buffer cleared.");
}

// ==========================================================================
// 4. Three.js 3D Isometric Construction Scene (for Home Hero)
// ==========================================================================

function init3DScene() {
  const container = document.getElementById("canvas-container");
  const canvas = document.getElementById("cowrywise-canvas");
  if (!container || !canvas || typeof THREE === "undefined") return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  const scene = new THREE.Scene();
  scene.background = null;

  const aspect = width / height;
  const d = 14;
  const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
  camera.position.set(20, 20, 20);
  camera.lookAt(0, 1.5, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 0.9);
  mainLight.position.set(15, 25, 20);
  scene.add(mainLight);

  const blueFill = new THREE.DirectionalLight(0x0066f5, 0.6);
  blueFill.position.set(-15, 10, -10);
  scene.add(blueFill);

  const structureGroup = new THREE.Group();
  scene.add(structureGroup);

  const baseMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  const blueMat = new THREE.MeshStandardMaterial({ color: 0x0066f5, roughness: 0.25, metalness: 0.15 });
  const blueLightMat = new THREE.MeshStandardMaterial({ color: 0x1a7aff, roughness: 0.2, metalness: 0.1 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xffb800, roughness: 0.3, metalness: 0.3 });
  const emeraldMat = new THREE.MeshStandardMaterial({ color: 0x00c48c, roughness: 0.2, transparent: true, opacity: 0.85 });
  const edgeMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25 });

  function addBlock(w, h, depth, x, y, z, mat) {
    const geo = new THREE.BoxGeometry(w, h, depth);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    const edges = new THREE.EdgesGeometry(geo);
    mesh.add(new THREE.LineSegments(edges, edgeMat));
    structureGroup.add(mesh);
    return mesh;
  }

  // Base platform
  addBlock(14, 0.8, 14, 0, -0.4, 0, baseMat);
  const gridHelper = new THREE.GridHelper(14, 14, 0xd1efe0, 0xd1efe0);
  gridHelper.position.set(0, 0.02, 0);
  structureGroup.add(gridHelper);

  // Stepped pillars
  addBlock(2.2, 5.5, 2.2, -3.5, 2.75, 1.5, blueMat);
  addBlock(2.2, 7.5, 2.2, -3.5, 3.75, -1.5, blueLightMat);
  addBlock(4.5, 2.2, 2.2, 0, 4.5, 0, blueMat);
  addBlock(2.2, 3.8, 2.2, 0, 1.9, 0, blueLightMat);
  addBlock(2.2, 9.0, 2.2, 3.5, 4.5, -1.5, blueMat);
  addBlock(2.2, 6.0, 2.2, 3.5, 3.0, 1.5, blueLightMat);

  // Scaffolding poles
  const scaffoldGeo = new THREE.CylinderGeometry(0.08, 0.08, 10, 8);
  const pole1 = new THREE.Mesh(scaffoldGeo, goldMat);
  pole1.position.set(5.2, 5, -2.8);
  structureGroup.add(pole1);
  const pole2 = new THREE.Mesh(scaffoldGeo, goldMat);
  pole2.position.set(5.2, 5, 0.2);
  structureGroup.add(pole2);

  for (let ry = 1; ry <= 9; ry += 1.2) {
    const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3, 8), goldMat);
    rung.rotation.x = Math.PI / 2;
    rung.position.set(5.2, ry, -1.3);
    structureGroup.add(rung);
  }

  // Floating green chart plane
  const chart = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 2.2), emeraldMat);
  chart.position.set(-2.5, 4.2, 4.2);
  chart.rotation.y = -Math.PI / 5;
  structureGroup.add(chart);

  // Floating Coins
  const coinGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.2, 24);
  const coin1 = new THREE.Mesh(coinGeo, goldMat);
  coin1.position.set(-4.2, 6.5, 2.5);
  structureGroup.add(coin1);

  const coin2 = new THREE.Mesh(coinGeo, blueMat);
  coin2.position.set(2.0, 8.2, 3.5);
  structureGroup.add(coin2);

  // Interactive mouse sway
  let targetRotY = 0;
  let targetRotX = 0;
  window.addEventListener("mousemove", (e) => {
    const rect = container.getBoundingClientRect();
    if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
      const mx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const my = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      targetRotY = mx * 0.25;
      targetRotX = my * 0.15;
    }
  });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    structureGroup.rotation.y += (targetRotY - structureGroup.rotation.y) * 0.05;
    structureGroup.rotation.x += (targetRotX - structureGroup.rotation.x) * 0.05;

    coin1.position.y = 6.5 + Math.sin(t * 2) * 0.2;
    coin1.rotation.y += 0.02;
    coin2.position.y = 8.2 + Math.cos(t * 1.8) * 0.25;
    coin2.rotation.y -= 0.015;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    const nw = container.clientWidth;
    const nh = container.clientHeight;
    const naspect = nw / nh;
    camera.left = -d * naspect;
    camera.right = d * naspect;
    camera.top = d;
    camera.bottom = -d;
    camera.updateProjectionMatrix();
    renderer.setSize(nw, nh);
  });
}

// ==========================================================================
// 4b. Three.js Interactive 3D Smart Contract & Ledger Vault (Simulation Header)
// ==========================================================================

let simVaultGroup = null;
let simVaultCore = null;
let simCoreMat = null;
let simShockwaveRing = null;
let simCoins = [];

function initSimulation3D() {
  const canvas = document.getElementById("sim-3d-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  const width = canvas.parentElement?.clientWidth || 140;
  const height = canvas.parentElement?.clientHeight || 90;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  camera.position.set(0, 1.8, 4.6);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  const amb = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(amb);

  const keyLight = new THREE.DirectionalLight(0x0066f5, 1.4);
  keyLight.position.set(4, 5, 4);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x00c48c, 0.9);
  fillLight.position.set(-4, -2, -2);
  scene.add(fillLight);

  simVaultGroup = new THREE.Group();
  scene.add(simVaultGroup);

  // Central Vault Core (Metallic Octagonal Cylinder)
  const coreGeo = new THREE.CylinderGeometry(0.75, 0.85, 0.9, 8);
  simCoreMat = new THREE.MeshStandardMaterial({
    color: 0x0066f5,
    metalness: 0.7,
    roughness: 0.25,
    emissive: 0x002d7a,
    emissiveIntensity: 0.3
  });
  simVaultCore = new THREE.Mesh(coreGeo, simCoreMat);
  simVaultGroup.add(simVaultCore);

  // Core wireframe edges
  const coreEdges = new THREE.EdgesGeometry(coreGeo);
  const lineMat = new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.5 });
  simVaultCore.add(new THREE.LineSegments(coreEdges, lineMat));

  // Outer glowing emerald orbital ring
  const ringGeo = new THREE.TorusGeometry(1.35, 0.035, 16, 64);
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0x00c48c,
    emissive: 0x00c48c,
    emissiveIntensity: 0.6,
    roughness: 0.2
  });
  const outerRing = new THREE.Mesh(ringGeo, ringMat);
  outerRing.rotation.x = Math.PI / 3;
  simVaultGroup.add(outerRing);

  // Inner golden orbital ring
  const ring2Geo = new THREE.TorusGeometry(1.05, 0.025, 16, 64);
  const ring2Mat = new THREE.MeshStandardMaterial({
    color: 0xffb800,
    emissive: 0xffb800,
    emissiveIntensity: 0.5,
    roughness: 0.3
  });
  const innerRing = new THREE.Mesh(ring2Geo, ring2Mat);
  innerRing.rotation.y = Math.PI / 4;
  simVaultGroup.add(innerRing);

  // Top LED beacon gem
  const gemGeo = new THREE.SphereGeometry(0.2, 16, 16);
  const gemMat = new THREE.MeshStandardMaterial({
    color: 0x00c48c,
    emissive: 0x00c48c,
    emissiveIntensity: 0.85
  });
  const gem = new THREE.Mesh(gemGeo, gemMat);
  gem.position.y = 0.55;
  simVaultGroup.add(gem);

  // Shockwave pulse ring
  const shockGeo = new THREE.RingGeometry(0.2, 0.3, 32);
  const shockMat = new THREE.MeshBasicMaterial({
    color: 0x00c48c,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0
  });
  simShockwaveRing = new THREE.Mesh(shockGeo, shockMat);
  simShockwaveRing.rotation.x = Math.PI / 2;
  simShockwaveRing.position.y = 0.55;
  scene.add(simShockwaveRing);

  // Interactive mouse drag to rotate vault
  let isDragging = false;
  let prevX = 0;
  let prevY = 0;

  canvas.addEventListener("mousedown", (e) => {
    isDragging = true;
    prevX = e.clientX;
    prevY = e.clientY;
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging || !simVaultGroup) return;
    const dx = e.clientX - prevX;
    const dy = e.clientY - prevY;
    simVaultGroup.rotation.y += dx * 0.02;
    simVaultGroup.rotation.x += dy * 0.02;
    prevX = e.clientX;
    prevY = e.clientY;
  });

  canvas.addEventListener("touchstart", (e) => {
    if (e.touches.length > 0) {
      isDragging = true;
      prevX = e.touches[0].clientX;
      prevY = e.touches[0].clientY;
    }
  });
  window.addEventListener("touchend", () => { isDragging = false; });
  window.addEventListener("touchmove", (e) => {
    if (!isDragging || !simVaultGroup || e.touches.length === 0) return;
    const dx = e.touches[0].clientX - prevX;
    const dy = e.touches[0].clientY - prevY;
    simVaultGroup.rotation.y += dx * 0.02;
    simVaultGroup.rotation.x += dy * 0.02;
    prevX = e.touches[0].clientX;
    prevY = e.touches[0].clientY;
  });

  // Animation Loop
  let spinSpeed = 0.012;
  function animate() {
    requestAnimationFrame(animate);

    if (!isDragging && simVaultGroup) {
      simVaultGroup.rotation.y += spinSpeed;
      outerRing.rotation.z += 0.015;
      innerRing.rotation.x += 0.012;
    }

    if (spinSpeed > 0.012) {
      spinSpeed += (0.012 - spinSpeed) * 0.04;
    }

    // Animate coins
    for (let i = simCoins.length - 1; i >= 0; i--) {
      const c = simCoins[i];
      c.position.y -= 0.08;
      c.rotation.x += 0.1;
      c.rotation.y += 0.15;
      if (c.position.y <= 0.5) {
        scene.remove(c);
        simCoins.splice(i, 1);
        triggerShockwave(0x00c48c);
      }
    }

    // Animate shockwave
    if (simShockwaveRing && simShockwaveRing.material.opacity > 0) {
      simShockwaveRing.scale.x += 0.08;
      simShockwaveRing.scale.y += 0.08;
      simShockwaveRing.material.opacity -= 0.035;
    }

    renderer.render(scene, camera);
  }
  animate();

  function triggerShockwave(colorHex) {
    if (!simShockwaveRing) return;
    simShockwaveRing.scale.set(1, 1, 1);
    simShockwaveRing.material.color.setHex(colorHex);
    simShockwaveRing.material.opacity = 0.85;
  }

  // Global trigger function for real-time reactivity
  window.trigger3DVaultPulse = function(type) {
    if (!simVaultGroup || !simCoreMat) return;

    if (type === "success") {
      simCoreMat.color.setHex(0x00c48c);
      simCoreMat.emissive.setHex(0x00c48c);
      simCoreMat.emissiveIntensity = 0.85;
      spinSpeed = 0.08;
      triggerShockwave(0x00c48c);
      setTimeout(() => {
        simCoreMat.color.setHex(0x0066f5);
        simCoreMat.emissive.setHex(0x002d7a);
        simCoreMat.emissiveIntensity = 0.3;
      }, 1200);
    } else if (type === "error") {
      simCoreMat.color.setHex(0xff4757);
      simCoreMat.emissive.setHex(0xff4757);
      simCoreMat.emissiveIntensity = 0.9;
      triggerShockwave(0xff4757);

      const origX = simVaultGroup.position.x;
      let count = 0;
      const shakeInterval = setInterval(() => {
        simVaultGroup.position.x = origX + (Math.random() - 0.5) * 0.25;
        count++;
        if (count > 8) {
          clearInterval(shakeInterval);
          simVaultGroup.position.x = origX;
        }
      }, 40);

      setTimeout(() => {
        simCoreMat.color.setHex(0x0066f5);
        simCoreMat.emissive.setHex(0x002d7a);
        simCoreMat.emissiveIntensity = 0.3;
      }, 1200);
    } else if (type === "fund") {
      const coinGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.06, 16);
      const coinMat = new THREE.MeshStandardMaterial({
        color: 0xffb800,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0xffb800,
        emissiveIntensity: 0.4
      });
      const coin = new THREE.Mesh(coinGeo, coinMat);
      coin.position.set(0, 2.5, 0);
      scene.add(coin);
      simCoins.push(coin);
      spinSpeed = 0.06;
    }
  };
}

// ==========================================================================
// 5. Interactive Simulation Execution Engine & Live Response Inspector
// ==========================================================================

function initSimulationHandlers() {
  const panel = document.getElementById("sandbox-interactive-content");
  if (!panel) return;

  panel.addEventListener("click", async (e) => {
    // 1. Fill test BVN
    if (e.target.id === "btn-fill-bvn") {
      const bvnInput = document.getElementById("input-bvn");
      if (bvnInput) {
        bvnInput.value = "22222222281";
        showToast({
          type: "info",
          title: "Test BVN Populated",
          message: "Loaded official Sandbox BVN '22222222281' for instant verification."
        });
      }
    }

    // 2. Submit KYC Identity Verification
    if (e.target.id === "btn-verify-kyc") {
      const bvnInput = document.getElementById("input-bvn");
      const nameInput = document.getElementById("input-customer-name");
      const emailInput = document.getElementById("input-customer-email");
      const phoneInput = document.getElementById("input-customer-phone");

      const bvn = bvnInput ? bvnInput.value.trim() : "";
      if (nameInput) state.account.name = nameInput.value;
      if (emailInput) state.account.email = emailInput.value;
      if (phoneInput) state.account.phone = phoneInput.value;

      logConsole("HTTP", `POST /v1/accounts/${state.account.id}/identity - identity_type=bvn`);

      if (bvn === "22222222281") {
        state.account.isVerified = true;
        state.account.status = "verified";
        state.account.bvn = bvn;

        state.lastResponse = {
          status: 200,
          statusText: "OK",
          latency: 122,
          body: {
            account_id: state.account.id,
            identity_type: "bvn",
            is_verified: true,
            status: "verified",
            wallet_id: state.wallet.id,
            verified_at: new Date().toISOString(),
            message: "Identity verified successfully. Investment wallet auto-provisioned."
          }
        };

        logConsole("HTTP", `200 OK — Tier-1 KYC verification successful. Auto-created ${state.wallet.id}.`);
        logConsole("SECURITY", `NIBSS biometric match verified for ${state.account.name}.`);

        showToast({
          type: "success",
          title: "Tier-1 KYC Verified",
          message: `Account is verified! Investment wallet ${state.wallet.id} is ready for deposits.`
        });
      } else {
        state.lastResponse = {
          status: 400,
          statusText: "Bad Request",
          latency: 98,
          body: {
            error_code: "CW_ERR_INVALID_BVN",
            message: `Invalid BVN: "${bvn}". Must be 11 numeric digits matching NIBSS records.`,
            remediation: "In Sandbox mode, always use test BVN '22222222281'."
          }
        };

        logConsole("ERROR", `400 Bad Request — CW_ERR_INVALID_BVN: BVN "${bvn}" failed validation.`);

        showToast({
          type: "error",
          title: "BVN Verification Failed",
          message: "Invalid BVN. In Sandbox mode, use test BVN '22222222281'."
        });
      }

      renderAll();
    }

    // 3. Fund Wallet
    if (e.target.id === "btn-fund-wallet") {
      const amtInput = document.getElementById("input-fund-amount");
      const amt = amtInput ? Number(amtInput.value) : 50000;

      logConsole("HTTP", `POST /v1/wallets/${state.wallet.id}/fund - amount=${amt}`);

      state.wallet.balance += amt;
      const ref = `cw_topup_${Date.now()}`;

      state.lastResponse = {
        status: 200,
        statusText: "OK",
        latency: 145,
        body: {
          wallet_id: state.wallet.id,
          currency: state.wallet.currency,
          previous_balance: state.wallet.balance - amt,
          new_balance: state.wallet.balance,
          topup_amount: amt,
          reference: ref,
          channel: "virtual_account_bank_transfer",
          timestamp: new Date().toISOString()
        }
      };

      logConsole("HTTP", `200 OK — Wallet funded with ₦${amt.toLocaleString()}. Ref: ${ref}`);
      logConsole("WEBHOOK", `Dispatched 'wallet.funded' webhook notification.`);

      if (window.trigger3DVaultPulse) window.trigger3DVaultPulse("fund");

      showToast({
        type: "success",
        title: "Wallet Funded",
        message: `Successfully credited ₦${amt.toLocaleString()} to ${state.wallet.id}.`
      });

      renderAll();
    }

    // 4. Purchase Mutual Funds
    if (e.target.id === "btn-execute-invest") {
      const asset = ASSETS[state.activeAsset];
      const amtInput = document.getElementById("input-invest-amt");
      const amt = amtInput ? Number(amtInput.value) : state.investAmount;

      logConsole("HTTP", `POST /v1/investments - asset_id=${state.activeAsset}, amount=${amt}`);

      if (!state.account.isVerified) {
        state.lastResponse = {
          status: 403,
          statusText: "Forbidden",
          latency: 84,
          body: {
            error_code: "CW_ERR_ACCOUNT_UNVERIFIED",
            message: "Account is unverified. Identity verification (BVN) required before investing.",
            remediation: "Submit BVN verification via api.accounts.updateIdentity() first."
          }
        };

        logConsole("ERROR", `403 Forbidden — CW_ERR_ACCOUNT_UNVERIFIED.`);
        showToast({
          type: "error",
          title: "KYC Required",
          message: "Please complete Tier-1 BVN verification before purchasing investment assets."
        });
        renderAll();
        return;
      }

      if (amt < asset.min) {
        state.lastResponse = {
          status: 400,
          statusText: "Bad Request",
          latency: 90,
          body: {
            error_code: "CW_ERR_BELOW_MINIMUM",
            message: `Amount ₦${amt.toLocaleString()} is below asset minimum ₦${asset.min.toLocaleString()}.`
          }
        };
        showToast({
          type: "error",
          title: "Below Minimum Investment",
          message: `Minimum investment for ${asset.name} is ${asset.currency} ${asset.min.toLocaleString()}.`
        });
        renderAll();
        return;
      }

      if (state.wallet.balance < amt) {
        state.lastResponse = {
          status: 422,
          statusText: "Unprocessable Entity",
          latency: 110,
          body: {
            error_code: "CW_ERR_INSUFFICIENT_FUNDS",
            wallet_id: state.wallet.id,
            required_balance: amt,
            available_balance: state.wallet.balance,
            remediation: "Prompt customer to top up wallet via virtual account transfer."
          }
        };

        logConsole("ERROR", `422 Unprocessable — CW_ERR_INSUFFICIENT_FUNDS in wallet ${state.wallet.id}.`);
        showToast({
          type: "error",
          title: "Insufficient Balance",
          message: `Wallet only has ₦${state.wallet.balance.toLocaleString()}. Top up before buying.`
        });
        renderAll();
        return;
      }

      state.wallet.balance -= amt;
      state.wallet.invested += amt;
      const units = Number((amt / asset.unitPrice).toFixed(4));
      const txnId = `txn_${Date.now()}`;

      state.lastResponse = {
        status: 201,
        statusText: "Created",
        latency: 138,
        body: {
          transaction_id: txnId,
          asset_id: state.activeAsset,
          asset_name: asset.name,
          amount_invested: amt,
          unit_price: asset.unitPrice,
          units_allocated: units,
          created_at: new Date().toISOString()
        }
      };

      logConsole("HTTP", `201 Created — Purchased ${units} units of ${asset.name}. Txn: ${txnId}`);
      logConsole("WEBHOOK", `Dispatched 'investment.created' notification.`);

      showToast({
        type: "success",
        title: "Investment Successful",
        message: `Allocated ${units} units of ${asset.name} for ₦${amt.toLocaleString()}.`
      });

      renderAll();
    }

    // 5. Create Locked Savings Plan
    if (e.target.id === "btn-create-savings") {
      const nameInput = document.getElementById("input-savings-name");
      const targetInput = document.getElementById("input-savings-target");
      const depositInput = document.getElementById("input-savings-deposit");

      if (nameInput) state.savingsPlan.name = nameInput.value;
      if (targetInput) state.savingsPlan.target = Number(targetInput.value);
      if (depositInput) state.savingsPlan.deposit = Number(depositInput.value);

      logConsole("HTTP", `POST /v1/savings - duration_months=${state.savingsPlan.months}`);

      if (!state.account.isVerified) {
        showToast({ type: "error", title: "KYC Required", message: "Complete BVN verification first." });
        return;
      }

      if (state.savingsPlan.months < 3) {
        state.lastResponse = {
          status: 400,
          statusText: "Bad Request",
          latency: 95,
          body: {
            error_code: "CW_ERR_TENURE_TOO_SHORT",
            message: "Savings plans require a minimum tenure lock of 3 months."
          }
        };
        showToast({ type: "error", title: "Invalid Duration", message: "Cowrywise savings plans require at least 3 months lock." });
        renderAll();
        return;
      }

      const planId = `sp_${Date.now()}`;
      const maturity = new Date();
      maturity.setMonth(maturity.getMonth() + state.savingsPlan.months);

      state.lastResponse = {
        status: 201,
        statusText: "Created",
        latency: 142,
        body: {
          plan_id: planId,
          name: state.savingsPlan.name,
          target_amount: state.savingsPlan.target,
          initial_deposit: state.savingsPlan.deposit,
          duration_months: state.savingsPlan.months,
          interest_rate_p_a: "12.0%",
          start_date: new Date().toISOString(),
          maturity_date: maturity.toISOString(),
          status: "active"
        }
      };

      logConsole("HTTP", `201 Created — Locked Savings Plan "${state.savingsPlan.name}" active.`);
      showToast({
        type: "success",
        title: "Savings Plan Initialized",
        message: `Plan active for ${state.savingsPlan.months} months with guaranteed 12% p.a. interest!`
      });

      renderAll();
    }

    // 6. Toggle Webhook Tamper
    if (e.target.id === "btn-toggle-tamper") {
      state.webhook.isTampered = !state.webhook.isTampered;
      logConsole("SECURITY", state.webhook.isTampered ? "Tampered signature mode ACTIVATED." : "Valid signature mode RESTORED.");
      showToast({
        type: state.webhook.isTampered ? "error" : "success",
        title: state.webhook.isTampered ? "Tampered Mode Active" : "Signature Validated",
        message: state.webhook.isTampered ? "Simulating spoofed webhook signature to test rejection." : "Using valid HMAC SHA-256 signature."
      });
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

// ==========================================================================
// 6. Rendering Engine: Tabs, Forms, Responses & Code
// ==========================================================================

function renderAll() {
  const heroBal = document.getElementById("hero-stat-balance");
  const heroKyc = document.getElementById("hero-stat-kyc");

  if (heroBal) heroBal.innerText = `₦${state.wallet.balance.toLocaleString()}`;
  if (heroKyc) heroKyc.innerText = state.account.isVerified ? "Verified (Tier 1)" : "Pending KYC";

  renderInteractivePanel();
  renderResponseBox();
  renderCodePanel();
}

function renderInteractivePanel() {
  const panel = document.getElementById("sandbox-interactive-content");
  if (!panel) return;

  if (state.currentTab === "onboarding") {
    panel.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <h3 style="font-size:1.25rem; font-weight:700;">1. Customer KYC & Identity Verification</h3>
        <span class="badge-sandbox-hint">POST /v1/accounts</span>
      </div>
      <p style="color:var(--cw-body); font-size:0.9rem; margin-bottom:20px;">
        Editable parameters: Update details and submit Tier-1 BVN identity verification.
      </p>

      <div class="form-group">
        <label class="form-label">Customer Full Name</label>
        <input type="text" id="input-customer-name" class="form-input" value="${state.account.name}" />
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input type="email" id="input-customer-email" class="form-input" value="${state.account.email}" />
        </div>
        <div class="form-group">
          <label class="form-label">Phone Number</label>
          <input type="tel" id="input-customer-phone" class="form-input" value="${state.account.phone}" />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Bank Verification Number (BVN)</label>
        <div style="display:flex; gap:8px;">
          <input type="text" id="input-bvn" class="form-input" placeholder="11-digit BVN" value="${state.account.bvn || ""}" />
          <button id="btn-fill-bvn" class="btn-secondary" type="button" style="white-space:nowrap;">Use Test BVN</button>
        </div>
        <div class="badge-sandbox-hint">Sandbox Test BVN: 22222222281</div>
      </div>

      <div style="margin-top:22px;">
        <button id="btn-verify-kyc" class="btn-primary" type="button" style="width:100%;">
          ${window.CW_ICONS ? window.CW_ICONS.icon("send") : ""} Send Verification Request
        </button>
      </div>
    `;
  } else if (state.currentTab === "investing") {
    panel.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <h3 style="font-size:1.25rem; font-weight:700;">2. Wallet Funding & Mutual Funds</h3>
        <span class="badge-sandbox-hint">POST /v1/investments</span>
      </div>
      <p style="color:var(--cw-body); font-size:0.9rem; margin-bottom:20px;">
        Wallets act as the sole funding source and withdrawal destination. Top up balance and buy units.
      </p>

      <div style="background:var(--cw-mint-light); border:1px solid var(--cw-mint-border); border-radius:10px; padding:16px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <small style="color:var(--cw-muted); text-transform:uppercase; font-size:0.75rem; font-weight:700;">Available Wallet Balance</small>
          <div style="font-size:1.4rem; font-weight:800; color:var(--cw-title); font-family:var(--font-code);">₦${state.wallet.balance.toLocaleString()}</div>
        </div>
        <div style="display:flex; gap:8px;">
          <input type="number" id="input-fund-amount" class="form-input" value="50000" step="10000" style="width:120px; padding:8px 12px;" />
          <button id="btn-fund-wallet" class="btn-secondary" type="button" style="padding:8px 14px;">+ Top Up</button>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Select Investment Asset</label>
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
        ${window.CW_ICONS ? window.CW_ICONS.icon("send") : ""} Confirm & Execute Investment
      </button>
    `;
  } else if (state.currentTab === "savings") {
    panel.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <h3 style="font-size:1.25rem; font-weight:700;">3. Goal-Oriented Locked Savings</h3>
        <span class="badge-sandbox-hint">POST /v1/savings</span>
      </div>
      <p style="color:var(--cw-body); font-size:0.9rem; margin-bottom:20px;">
        Fixed tenure savings (minimum 3 months) with guaranteed annual returns.
      </p>

      <div class="form-group">
        <label class="form-label">Plan Name</label>
        <input type="text" id="input-savings-name" class="form-input" value="${state.savingsPlan.name}" />
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
        <div class="form-group">
          <label class="form-label">Target Amount (NGN)</label>
          <input type="number" id="input-savings-target" class="form-input" value="${state.savingsPlan.target}" step="50000" />
        </div>
        <div class="form-group">
          <label class="form-label">Initial Deposit (NGN)</label>
          <input type="number" id="input-savings-deposit" class="form-input" value="${state.savingsPlan.deposit}" step="5000" />
        </div>
      </div>

      <div class="form-group">
        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
          <label class="form-label" style="margin:0;">Lock Duration</label>
          <span id="months-val-badge" class="badge-sandbox-hint">${state.savingsPlan.months} Months</span>
        </div>
        <input type="range" id="savings-months-slider" min="3" max="24" step="1" value="${state.savingsPlan.months}" style="width:100%; accent-color:var(--cw-blue);" />
      </div>

      <button id="btn-create-savings" class="btn-primary" type="button" style="width:100%; margin-top:8px;">
        ${window.CW_ICONS ? window.CW_ICONS.icon("send") : ""} Initialize Savings Plan
      </button>
    `;
  } else if (state.currentTab === "webhooks") {
    const computedHash = computeSimpleHMAC(state.webhook.clientSecret, state.webhook.clientId);
    const signature = state.webhook.isTampered ? "000000000000000000000000000000000000000000000000" : computedHash;

    panel.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <h3 style="font-size:1.25rem; font-weight:700;">4. Webhooks & HMAC Verification</h3>
        <span class="badge-sandbox-hint">HMAC-SHA256</span>
      </div>
      <p style="color:var(--cw-body); font-size:0.9rem; margin-bottom:18px;">
        Test incoming webhook notifications and verify signature security against tampering.
      </p>

      <div class="form-group">
        <label class="form-label">Simulate Event Type</label>
        <select id="select-webhook-event" class="form-input">
          <option value="wallet.funded" ${state.webhook.event === "wallet.funded" ? "selected" : ""}>wallet.funded</option>
          <option value="investment.created" ${state.webhook.event === "investment.created" ? "selected" : ""}>investment.created</option>
          <option value="withdrawal.completed" ${state.webhook.event === "withdrawal.completed" ? "selected" : ""}>withdrawal.completed</option>
        </select>
      </div>

      <div style="background:#060D1A; border:1px solid #1E2D4A; border-radius:8px; padding:12px 14px; font-family:var(--font-code); font-size:0.8rem; margin-bottom:14px;">
        <div style="color:#64748B; margin-bottom:4px;">// Calculated Inbound Signature Header</div>
        <div style="color:${state.webhook.isTampered ? "#FF4757" : "#00C48C"}; word-break:break-all;">
          ${signature}
        </div>
      </div>

      <div style="padding:12px 14px; border-radius:8px; margin-bottom:18px; background:${state.webhook.isTampered ? "#FEE2E2" : "var(--cw-emerald-subtle)"}; border:1px solid ${state.webhook.isTampered ? "#FECACA" : "var(--cw-emerald-border)"}; display:flex; align-items:center; gap:8px;">
        <span style="color:${state.webhook.isTampered ? "var(--cw-crimson)" : "var(--cw-emerald)"}; display:flex; align-items:center;">
          ${state.webhook.isTampered ? window.CW_ICONS?.icon("alert", 16) : window.CW_ICONS?.icon("check", 16)}
        </span>
        <strong style="color:${state.webhook.isTampered ? "var(--cw-crimson)" : "#03684B"}; font-size:0.85rem;">
          ${state.webhook.isTampered ? "REJECTED: Forged Signature Mismatch" : "VERIFIED: HMAC-SHA256 Match"}
        </strong>
      </div>

      <button id="btn-toggle-tamper" class="btn-secondary" type="button" style="width:100%;">
        ${state.webhook.isTampered ? "Restore Valid Signature" : "Simulate Tampered Signature Attack"}
      </button>
    `;
  }
}

function renderResponseBox() {
  const respEl = document.getElementById("response-json-display");
  const statusEl = document.getElementById("response-status-badge");
  const latencyEl = document.getElementById("response-latency");

  if (respEl) {
    respEl.innerText = JSON.stringify(state.lastResponse.body, null, 2);
  }

  if (statusEl) {
    statusEl.className = `status-badge status-${state.lastResponse.status}`;
    statusEl.innerText = `${state.lastResponse.status} ${state.lastResponse.statusText}`;
  }

  if (latencyEl) {
    latencyEl.innerText = `${state.lastResponse.latency}ms`;
  }
}

function renderCodePanel() {
  const codeEl = document.getElementById("code-display");
  if (!codeEl) return;

  if (state.currentLang === "node") {
    if (state.currentTab === "onboarding") {
      codeEl.innerText = `// Node.js: Account Creation & BVN Identity Check
import Client from "@cowrywise/embed-node";

const cowrywise = new Client({
  client_id: process.env.COWRYWISE_CLIENT_ID,
  client_secret: process.env.COWRYWISE_CLIENT_SECRET,
  embed_api_base_url: "https://sandbox.embed.cowrywise.com/api/v1"
});

// 1. Create User
const account = await cowrywise.accounts.createAccount({
  first_name: "${state.account.name.split(" ")[0]}",
  last_name: "${state.account.name.split(" ")[1] || "User"}",
  email: "${state.account.email}",
  phone_number: "${state.account.phone}",
  terms_of_use_accepted: true
});

// 2. Submit BVN (Sandbox test BVN: 22222222281)
const kyc = await cowrywise.accounts.updateIdentity(account.account_id, {
  identity_type: "bvn",
  identity_value: "${state.account.bvn || "22222222281"}"
});`;
    } else if (state.currentTab === "investing") {
      codeEl.innerText = `// Node.js: Purchase Mutual Fund Units
const investment = await cowrywise.assets.investInAsset({
  accountId: "${state.account.id}",
  assetId: "${state.activeAsset}",
  amount: ${state.investAmount}
});

console.log("Allocated units:", investment.units);`;
    } else if (state.currentTab === "savings") {
      codeEl.innerText = `// Node.js: Initialize Locked Savings Plan
const plan = await cowrywise.savings.createSavingsPlan({
  account_id: "${state.account.id}",
  name: "${state.savingsPlan.name}",
  target_amount: ${state.savingsPlan.target},
  duration_months: ${state.savingsPlan.months},
  interest_enabled: true
});`;
    } else {
      codeEl.innerText = `// Node.js: Webhook Signature Verification
import crypto from "node:crypto";

const expected = crypto
  .createHmac("sha256", process.env.COWRYWISE_CLIENT_SECRET)
  .update(process.env.COWRYWISE_CLIENT_ID)
  .digest("hex");

const isValid = crypto.timingSafeEqual(
  Buffer.from(expected.toLowerCase()),
  Buffer.from(req.body.signature.toLowerCase())
);`;
    }
  } else if (state.currentLang === "python") {
    codeEl.innerText = `# Python: Cowrywise Embed Integration
from cowrywise import Cowrywise

client = Cowrywise(
    client_id="YOUR_CLIENT_ID",
    client_secret="YOUR_CLIENT_SECRET",
    base_url="https://sandbox.embed.cowrywise.com/api/v1"
)`;
  } else {
    codeEl.innerText = `curl --request POST "https://sandbox.embed.cowrywise.com/api/v1/accounts" \\
  --header "Authorization: Bearer YOUR_TOKEN" \\
  --header "Content-Type: application/json"`;
  }
}

// Initialise everything on load
document.addEventListener("DOMContentLoaded", () => {
  init3DScene();
  initSimulation3D();
  initSimulationHandlers();

  // Tabs
  document.querySelectorAll(".sandbox-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".sandbox-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      state.currentTab = tab.dataset.tab;
      renderAll();
    });
  });

  // Languages
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".lang-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.currentLang = btn.dataset.lang;
      renderCodePanel();
    });
  });

  // Copy code
  document.getElementById("copy-code-btn")?.addEventListener("click", () => {
    const code = document.getElementById("code-display")?.innerText;
    if (code) {
      navigator.clipboard.writeText(code);
      showToast({ type: "info", title: "Code Copied", message: "Snippet copied to clipboard." });
    }
  });

  // Clear console button
  document.getElementById("btn-clear-console")?.addEventListener("click", clearConsole);

  // Copy buttons for clone commands & doc snippets
  document.querySelectorAll(".btn-clone-copy, .btn-copy-code").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const textToCopy = btn.getAttribute("data-cmd") || btn.getAttribute("data-code") || btn.textContent;
      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast({
          type: "success",
          title: "Copied to Clipboard!",
          message: `Snippet copied: ${textToCopy.slice(0, 48)}...`,
          duration: 3000
        });
      } catch (err) {
        showToast({
          type: "info",
          title: "Command Selected",
          message: textToCopy,
          duration: 4000
        });
      }
    });
  });

  // Interactive Starter Web App Demo Modals
  document.querySelectorAll(".btn-launch-app-demo").forEach((btn) => {
    btn.addEventListener("click", () => {
      const appKey = btn.getAttribute("data-app");

      if (appKey === "kolovault") {
        openModal({
          title: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cw-emerald)" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> KoloVault — Disciplined Savings Simulator`,
          contentHtml: `
            <div style="display:flex; flex-direction:column; gap:16px;">
              <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:10px; padding:16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                  <div>
                    <span style="font-size:0.75rem; color:var(--cw-muted); font-weight:700;">LIVE DEMO WALLET</span>
                    <div style="font-size:1.3rem; font-weight:800; color:var(--cw-title);">₦${state.wallet.balance.toLocaleString()}</div>
                  </div>
                  <span style="font-size:0.75rem; font-weight:700; color:#03684B; background:var(--cw-emerald-subtle); padding:4px 10px; border-radius:99px;">TIER-1 KYC VERIFIED</span>
                </div>
                <div style="font-size:0.85rem; color:var(--cw-body);">
                  Simulate creating a locked target savings vault using Cowrywise Embed <code>/api/v1/savings/create</code>.
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Savings Goal Name</label>
                <input type="text" id="demo-kolo-name" class="form-input" value="Tech Career Milestone Vault" />
              </div>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                <div class="form-group">
                  <label class="form-label">Target Amount (₦)</label>
                  <input type="number" id="demo-kolo-target" class="form-input" value="500000" />
                </div>
                <div class="form-group">
                  <label class="form-label">Initial Deposit (₦)</label>
                  <input type="number" id="demo-kolo-deposit" class="form-input" value="50000" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Lock Tenure & Guaranteed APY</label>
                <select id="demo-kolo-tenure" class="form-input" style="background:white;">
                  <option value="3" data-apy="12.5">3 Months Lock (+12.5% Annualized APY)</option>
                  <option value="6" data-apy="14.0" selected>6 Months Lock (+14.0% Annualized APY)</option>
                  <option value="12" data-apy="15.5">12 Months Lock (+15.5% Annualized APY)</option>
                </select>
              </div>

              <div id="demo-kolo-interest-card" style="background:var(--cw-blue-subtle); border:1px solid rgba(0,102,245,0.2); border-radius:8px; padding:12px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <div style="font-size:0.76rem; color:var(--cw-muted); font-weight:600;">Projected Interest at Maturity</div>
                  <div style="font-size:1.1rem; font-weight:800; color:var(--cw-blue);" id="demo-kolo-interest-val">+₦3,500.00</div>
                </div>
                <span style="font-size:0.75rem; color:#03684B; font-weight:700;">Guaranteed SEC Yield</span>
              </div>

              <button class="btn-primary" id="btn-demo-kolo-submit" style="width:100%; justify-content:center; padding:12px;" type="button">
                Lock Funds in KoloVault (Execute via SDK)
              </button>
            </div>
          `,
          confirmText: "Close Simulator"
        });

        // Recalculate interest live
        const depositInput = document.getElementById("demo-kolo-deposit");
        const tenureSelect = document.getElementById("demo-kolo-tenure");
        const interestVal = document.getElementById("demo-kolo-interest-val");

        const updateInterest = () => {
          const deposit = Number(depositInput.value) || 0;
          const months = Number(tenureSelect.value) || 6;
          const apy = Number(tenureSelect.options[tenureSelect.selectedIndex].getAttribute("data-apy")) || 14.0;
          const interest = (deposit * (apy / 100) * (months / 12)).toFixed(2);
          if (interestVal) interestVal.textContent = `+₦${Number(interest).toLocaleString()}`;
        };

        depositInput?.addEventListener("input", updateInterest);
        tenureSelect?.addEventListener("change", updateInterest);
        updateInterest();

        document.getElementById("btn-demo-kolo-submit")?.addEventListener("click", () => {
          const name = document.getElementById("demo-kolo-name").value;
          const deposit = Number(depositInput.value) || 50000;
          const months = Number(tenureSelect.value) || 6;

          if (deposit > state.wallet.balance) {
            showToast({
              type: "error",
              title: "Insufficient Wallet Balance",
              message: `Cannot lock ₦${deposit.toLocaleString()}. Wallet balance is ₦${state.wallet.balance.toLocaleString()}.`,
              duration: 4000
            });
            return;
          }

          state.wallet.balance -= deposit;
          state.savings.totalSaved += deposit;
          state.savings.targetPlans.push({
            name,
            amount: deposit,
            months,
            date: new Date().toLocaleDateString()
          });

          renderAll();
          if (typeof trigger3DVaultPulse === "function") trigger3DVaultPulse("fund");
          logConsole("HTTP", `POST /api/v1/savings/create 201 Created -> Plan "${name}" locked for ${months} months with ₦${deposit.toLocaleString()}`);

          showToast({
            type: "success",
            title: "Vault Created Successfully!",
            message: `Locked ₦${deposit.toLocaleString()} into "${name}" for ${months} months.`,
            duration: 4500
          });

          closeModal();
        });

      } else if (appKey === "yieldnest") {
        openModal({
          title: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cw-blue)" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> YieldNest — Mutual Funds Portal Simulator`,
          contentHtml: `
            <div style="display:flex; flex-direction:column; gap:16px;">
              <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:10px; padding:16px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <span style="font-size:0.75rem; color:var(--cw-muted); font-weight:700;">AVAILABLE WALLET CASH</span>
                    <div style="font-size:1.3rem; font-weight:800; color:var(--cw-title);">₦${state.wallet.balance.toLocaleString()}</div>
                  </div>
                  <div>
                    <span style="font-size:0.75rem; color:var(--cw-muted); font-weight:700;">HOLDINGS</span>
                    <div style="font-size:1.1rem; font-weight:700; color:var(--cw-emerald);">₦${state.investments.totalUnits.toLocaleString()} units</div>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Select SEC-Regulated Mutual Fund</label>
                <select id="demo-fund-select" class="form-input" style="background:white;">
                  <option value="cw_mmf_01" data-rate="16.5">Cowrywise Money Market Fund (+16.5% Annualized Return)</option>
                  <option value="cw_halal_01" data-rate="14.2">Halal Ethical Fixed Income Fund (+14.2% Return)</option>
                  <option value="cw_eurobond_01" data-rate="7.8">Sovereign Eurobond Dollar Fund (+7.8% USD)</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Investment Amount (₦)</label>
                <input type="number" id="demo-fund-amount" class="form-input" value="25000" />
              </div>

              <div style="background:var(--cw-emerald-subtle); border:1px solid rgba(0,196,140,0.3); border-radius:8px; padding:12px; font-size:0.85rem; color:#03684B;">
                ✓ SEC Regulated Asset Manager: <strong>Stanbic IBTC / Meristem</strong><br>
                ✓ Daily dividend distributions credited directly to wallet balance.
              </div>

              <button class="btn-primary" id="btn-demo-yield-submit" style="width:100%; justify-content:center; padding:12px;" type="button">
                One-Click Buy Units (Execute via SDK)
              </button>
            </div>
          `,
          confirmText: "Close Simulator"
        });

        document.getElementById("btn-demo-yield-submit")?.addEventListener("click", () => {
          const amount = Number(document.getElementById("demo-fund-amount").value) || 25000;
          const fundName = document.getElementById("demo-fund-select").options[document.getElementById("demo-fund-select").selectedIndex].text.split("(")[0].trim();

          if (amount > state.wallet.balance) {
            showToast({
              type: "error",
              title: "Insufficient Wallet Funds",
              message: `You attempted to purchase ₦${amount.toLocaleString()} but your wallet has ₦${state.wallet.balance.toLocaleString()}.`,
              duration: 4000
            });
            return;
          }

          state.wallet.balance -= amount;
          state.investments.totalUnits += amount;
          renderAll();

          if (typeof trigger3DVaultPulse === "function") trigger3DVaultPulse("success");
          logConsole("HTTP", `POST /api/v1/assets/invest 200 OK -> Purchased ₦${amount.toLocaleString()} units of ${fundName}`);

          showToast({
            type: "success",
            title: "Order Fulfilled!",
            message: `Allocated ₦${amount.toLocaleString()} into ${fundName}. Transaction reference: CW_TXN_${Date.now().toString().slice(-6)}`,
            duration: 4500
          });

          closeModal();
        });

      } else if (appKey === "sparestash") {
        openModal({
          title: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cw-emerald)" stroke-width="2"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/></svg> SpareStash — Round-Up Checkout Engine Simulator`,
          contentHtml: `
            <div style="display:flex; flex-direction:column; gap:16px;">
              <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:10px; padding:16px;">
                <div style="font-size:0.75rem; color:var(--cw-muted); font-weight:700;">ECOMMERCE CHECKOUT SIMULATION</div>
                <div style="font-size:1.1rem; font-weight:800; color:var(--cw-title); margin-top:4px;">Supermarket Grocery Cart: ₦4,320.00</div>
              </div>

              <div class="form-group">
                <label class="form-label">Round-Up Threshold</label>
                <select id="demo-roundup-mode" class="form-input" style="background:white;">
                  <option value="100">Round up to Nearest ₦100 (Cart becomes ₦4,400 -> +₦80 spare change)</option>
                  <option value="500" selected>Round up to Nearest ₦500 (Cart becomes ₦4,500 -> +₦180 spare change)</option>
                  <option value="1000">Round up to Nearest ₦1,000 (Cart becomes ₦5,000 -> +₦680 spare change)</option>
                </select>
              </div>

              <div style="background:var(--cw-blue-subtle); border:1px solid rgba(0,102,245,0.2); border-radius:8px; padding:12px;">
                <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:700; color:var(--cw-title); margin-bottom:4px;">
                  <span>Accumulated Spare Stash:</span>
                  <span style="color:var(--cw-blue);">₦14,800.00</span>
                </div>
                <div style="font-size:0.78rem; color:var(--cw-body);">
                  Auto-Sweep Rule: When spare change reaches ₦1,000, funds are automatically swept into Money Market Fund.
                </div>
              </div>

              <button class="btn-primary" id="btn-demo-roundup-submit" style="width:100%; justify-content:center; padding:12px;" type="button">
                Authorize Checkout & Save Spare Change
              </button>
            </div>
          `,
          confirmText: "Close Simulator"
        });

        document.getElementById("btn-demo-roundup-submit")?.addEventListener("click", () => {
          showToast({
            type: "success",
            title: "Transaction Rounded Up!",
            message: "₦180 spare change added to your micro-investing escrow wallet. Auto-sweep triggered!",
            duration: 4000
          });
          logConsole("WEBHOOK", "event: wallet.funded | Spare change +₦180 swept into Cowrywise Money Market Fund.");
          closeModal();
        });

      } else if (appKey === "corpyield") {
        openModal({
          title: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cw-blue)" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> CorpYield — B2B Payroll Salary Split Simulator`,
          contentHtml: `
            <div style="display:flex; flex-direction:column; gap:16px;">
              <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:10px; padding:16px;">
                <div style="font-size:0.75rem; color:var(--cw-muted); font-weight:700;">EMPLOYEE PAYROLL PROFILE</div>
                <div style="font-size:1.2rem; font-weight:800; color:var(--cw-title); margin-top:2px;">Employee: Chidi Okonkwo (Engineer)</div>
                <div style="font-size:0.9rem; color:var(--cw-body);">Net Salary: <strong>₦600,000.00 / month</strong></div>
              </div>

              <div class="form-group">
                <label class="form-label">1. Locked Emergency Savings Allocation (%)</label>
                <input type="range" id="split-emergency" min="0" max="40" value="15" style="width:100%;" />
                <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--cw-muted); margin-top:4px;">
                  <span>Allocated: <strong id="val-split-emergency" style="color:var(--cw-emerald);">15% (₦90,000)</strong></span>
                  <span>Minimum 3 Months Lock</span>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">2. Sovereign Eurobond Dollar Fund Allocation (%)</label>
                <input type="range" id="split-eurobonds" min="0" max="40" value="15" style="width:100%;" />
                <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--cw-muted); margin-top:4px;">
                  <span>Allocated: <strong id="val-split-eurobonds" style="color:var(--cw-blue);">15% (₦90,000)</strong></span>
                  <span>USD Capital Growth</span>
                </div>
              </div>

              <div style="background:#F1F5F9; border-radius:8px; padding:12px; display:flex; justify-content:space-between; font-size:0.88rem;">
                <span style="font-weight:600;">Net Commercial Bank Checking (Take-Home):</span>
                <strong id="val-split-bank">70% (₦420,000)</strong>
              </div>

              <button class="btn-primary" id="btn-demo-payroll-submit" style="width:100%; justify-content:center; padding:12px;" type="button">
                Simulate Monthly Payroll Disbursement
              </button>
            </div>
          `,
          confirmText: "Close Simulator"
        });

        const slEmergency = document.getElementById("split-emergency");
        const slEurobonds = document.getElementById("split-eurobonds");
        const valEmergency = document.getElementById("val-split-emergency");
        const valEurobonds = document.getElementById("val-split-eurobonds");
        const valBank = document.getElementById("val-split-bank");

        const updatePayroll = () => {
          const em = Number(slEmergency.value);
          const eu = Number(slEurobonds.value);
          const bank = Math.max(0, 100 - em - eu);
          if (valEmergency) valEmergency.textContent = `${em}% (₦${((em / 100) * 600000).toLocaleString()})`;
          if (valEurobonds) valEurobonds.textContent = `${eu}% (₦${((eu / 100) * 600000).toLocaleString()})`;
          if (valBank) valBank.textContent = `${bank}% (₦${((bank / 100) * 600000).toLocaleString()})`;
        };

        slEmergency?.addEventListener("input", updatePayroll);
        slEurobonds?.addEventListener("input", updatePayroll);

        document.getElementById("btn-demo-payroll-submit")?.addEventListener("click", () => {
          showToast({
            type: "success",
            title: "Payroll Disbursed via Virtual Accounts!",
            message: "Disbursed ₦600k: ₦90k to Emergency Vault, ₦90k to Eurobonds, ₦420k to Bank Checking.",
            duration: 5000
          });
          logConsole("WEBHOOK", "event: wallet.funded | Cowrywise Virtual Account credited ₦180,000 for employee Chidi Okonkwo.");
          logConsole("HTTP", "POST /api/v1/savings/create 201 Created -> Emergency Payroll Split.");
          closeModal();
        });
      }
    });
  });

  // URL query parameter support for direct tab selection and fault injection
  const urlParams = new URLSearchParams(window.location.search);
  const tabParam = urlParams.get("tab");
  const errorParam = urlParams.get("error");

  if (tabParam) {
    const matchingTab = document.querySelector(`.sandbox-tab[data-tab="${tabParam}"]`);
    if (matchingTab) {
      document.querySelectorAll(".sandbox-tab").forEach((t) => t.classList.remove("active"));
      matchingTab.classList.add("active");
      state.currentTab = tabParam;
    }
  }

  if (errorParam) {
    if (errorParam === "CW_ERR_INVALID_BVN") {
      state.account.bvn = "12345";
      setTimeout(() => {
        showToast({
          type: "error",
          title: "Fault Injection: Invalid BVN",
          message: "Pre-filled invalid 5-digit BVN. Submit verification to inspect the HTTP 400 error response.",
          duration: 5000
        });
        logConsole("WARN", "[FAULT_INJECTION] Pre-filled invalid BVN '12345' into form.");
      }, 350);
    } else if (errorParam === "CW_ERR_INVALID_WEBHOOK_SIGNATURE") {
      state.webhook.isTampered = true;
      setTimeout(() => {
        showToast({
          type: "error",
          title: "Fault Injection: Tampered Webhook",
          message: "Forged HMAC signature injected. Webhook verifier rejected the payload with HTTP 401.",
          duration: 5000
        });
        logConsole("WARN", "[FAULT_INJECTION] Webhook signature forged. Verifier rejection active.");
      }, 350);
    } else if (errorParam === "CW_ERR_WITHDRAWAL_LOCKED") {
      setTimeout(() => {
        showToast({
          type: "error",
          title: "Fault Injection: 24h Holding Lock",
          message: "Mandatory 24-hour holding window is active. Redemption is locked under SEC regulations.",
          duration: 5000
        });
        logConsole("WARN", "[REGULATORY_RULE] 24-hour cooling off lock is active on customer asset holding.");
      }, 350);
    } else if (errorParam === "CW_ERR_INSUFFICIENT_FUNDS") {
      state.wallet.balance = 450;
      setTimeout(() => {
        showToast({
          type: "error",
          title: "Fault Injection: Low Balance",
          message: "Wallet balance dropped to ₦450. Order purchase will fail with CW_ERR_INSUFFICIENT_FUNDS.",
          duration: 5000
        });
        logConsole("WARN", "[FAULT_INJECTION] Wallet balance reduced to ₦450. Order submission encumbered.");
      }, 350);
    }
  }

  renderAll();
  logConsole("INFO", "Cowrywise Embed Developer Sandbox ready. Connected to local mock engine.");
});

window.CW_APP = {
  showToast,
  openModal,
  closeModal,
  logConsole
};
