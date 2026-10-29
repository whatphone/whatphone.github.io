/**
 * WhatPhone — sidebar.js
 * Fixed dynamic sidebar for WhatPhone device testing tools.
 * Theme: Warm Light / Soft Aurora (matches style.css)
 * Includes: tool links from header.js
 */

(function () {
  // ── 1. Tool list (mirrors header.js dropdown + extra useful links) ──
  const toolsList = [
    // Hardware testing tools (from header.js)
    { name: "Camera Test",       icon: "📷", url: "/camera-test",       desc: "Test your device's front and rear camera." },
    { name: "Mic Test",          icon: "🎤", url: "/mic-test",          desc: "Check your microphone input and volume." },
    { name: "Touchscreen Test",  icon: "👆", url: "/touchscreen-test",  desc: "Multi-touch accuracy and gesture testing." },
    { name: "Speaker Test",      icon: "🔊", url: "/speaker-test",      desc: "Test audio output, stereo and left/right channels." },
    { name: "Battery Test",      icon: "🔋", url: "/battery-test",      desc: "Check battery level, drain rate, and health." },
    { name: "Vibration Test",    icon: "📳", url: "/vibration-test",    desc: "Check haptic feedback and vibration motor." },
    { name: "WiFi Speed Test",   icon: "📶", url: "/wifi-speed-test",   desc: "Measure bandwidth, latency and connection quality." },
    { name: "GPS / Compass",     icon: "🧭", url: "/gps-compass-test",  desc: "Test geolocation and device orientation sensors." },

    { name: "Touch Sampling Rate Test", icon: "⚡", url: "/touch-sampling-rate-test", desc: "Swipe on the pad to measure how many times per second your screen read." },
    { name: "Backlight Bleed Test", icon: "🌑", url: "/backlight-bleed-test", desc: "Full-screen black, gray and gradient patterns reveal backlight bleed, ." },
    { name: "Online Ruler", icon: "📏", url: "/online-ruler", desc: "A calibrated on-screen ruler in cm, mm and inches." },
    { name: "PPI Calculator", icon: "📐", url: "/ppi-calculator", desc: "Calculate pixels per inch, dot pitch, true screen size, aspect ratio a." },
    { name: "Charging Time Calculator", icon: "🔌", url: "/charging-time-calculator", desc: "Estimate how long your phone takes to charge from mAh, watts and charg." },
    { name: "Decibel Meter", icon: "🎚️", url: "/decibel-meter", desc: "Use your microphone as a sound level meter with live dB, graph, min, a." },
    { name: "Phone Storage Calculator", icon: "💾", url: "/storage-calculator", desc: "See how many photos, hours of 4K video and songs fit on 64GB to 2TB, w." },
    { name: "Power Bank Calculator", icon: "🔋", url: "/power-bank-calculator", desc: "How many times a power bank charges your phone, mAh to Wh and the 100 Wh flight limit." },
    { name: "Screen Time Calculator", icon: "⏳", url: "/screen-time-calculator", desc: "Turn daily phone hours into days per year, lifetime totals and time you could reclaim." },
    { name: "Photo Print Size Calculator", icon: "🖼️", url: "/photo-print-size-calculator", desc: "Megapixels to the largest sharp print size, with PPI for every common paper size." },

    { name: "Fix My Speaker", icon: "🔈", url: "/fix-my-speaker", desc: "Water eject and dust-clearing speaker cleaner." },

    // WhatPhone-specific pages
    { name: "Detect My Phone",   icon: "📱", url: "/#detect",           desc: "Run a full device detection scan." },
    { name: "Guides",            icon: "📚", url: "/guides",            desc: "Articles about devices and testing." },
  ];

  // ── 2. Inject CSS (warm light aurora, matched to WhatPhone style.css) ──
  const cssStyles = `
    /* ── Floating trigger button ───────────────────────── */
    .wp-tools-trigger {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #ff6b4a 0%, #f5573a 100%);
      color: #ffffff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      border: none;
      box-shadow: 0 8px 24px rgba(255,107,74,0.32), 0 2px 6px rgba(255,107,74,0.2);
      cursor: pointer;
      transition: transform 0.25s cubic-bezier(0.4,0,0.2,1), background 0.25s ease, box-shadow 0.25s ease;
    }
    .wp-tools-trigger:hover {
      transform: scale(1.08) translateY(-2px);
      background: linear-gradient(135deg, #f5573a 0%, #e04428 100%);
      box-shadow: 0 14px 34px rgba(255,107,74,0.42), 0 4px 10px rgba(255,107,74,0.28);
    }
    .wp-tools-trigger.active {
      transform: scale(0.92) rotate(-90deg);
      background: linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%);
      box-shadow: 0 8px 24px rgba(109,40,217,0.35), 0 2px 6px rgba(109,40,217,0.2);
    }

    /* ── Backdrop overlay ──────────────────────────────── */
    .wp-tools-overlay {
      position: fixed;
      inset: 0;
      background: rgba(61,51,40,0.35);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 9999;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }
    .wp-tools-overlay.visible {
      opacity: 1;
      pointer-events: auto;
    }

    /* ── Sidebar container ─────────────────────────────── */
    .wp-tools-sidebar {
      position: fixed;
      top: 0;
      right: -400px;
      width: 380px;
      max-width: 92vw;
      height: 100vh;
      background: #ffffff;
      border-left: 1px solid #ece3d5;
      box-shadow: -12px 0 40px rgba(61,51,40,0.14), -2px 0 12px rgba(61,51,40,0.06);
      z-index: 10000;
      display: flex;
      flex-direction: column;
      transition: right 0.4s cubic-bezier(0.4,0,0.2,1);
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #3d3328;
    }
    .wp-tools-sidebar.open {
      right: 0;
    }

    /* ── Header ────────────────────────────────────────── */
    .wp-sb-header {
      padding: 20px 22px;
      border-bottom: 1px solid #ece3d5;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: linear-gradient(180deg, #fdfbf7 0%, #fff9f2 100%);
      flex-shrink: 0;
      position: relative;
    }
    .wp-sb-header::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 22px;
      right: 22px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,107,74,0.25), rgba(139,92,246,0.18), transparent);
    }
    .wp-sb-header h2 {
      font-family: 'Syne', sans-serif;
      font-size: 1.15rem;
      font-weight: 800;
      color: #1f1810;
      margin: 0;
      letter-spacing: -0.015em;
    }
    .wp-sb-header h2 em {
      font-style: normal;
      background: linear-gradient(135deg, #ff6b4a 0%, #6d28d9 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .wp-sb-close {
      width: 34px;
      height: 34px;
      font-size: 1rem;
      color: #6b5d4a;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      background: #ffffff;
      border: 1px solid #ece3d5;
      font-family: inherit;
      box-shadow: 0 1px 2px rgba(61,51,40,0.04);
    }
    .wp-sb-close:hover {
      color: #ff6b4a;
      background: #fff9f2;
      border-color: rgba(255,107,74,0.35);
      transform: rotate(90deg);
      box-shadow: 0 4px 12px rgba(255,107,74,0.15);
    }

    /* ── Scrollable tool list ──────────────────────────── */
    .wp-sb-body {
      flex: 1;
      overflow-y: auto;
      padding: 14px 16px 22px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      background: #fdfbf7;
    }

    /* ── Category label ────────────────────────────────── */
    .wp-sb-category {
      font-family: 'Space Mono', monospace;
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #948674;
      padding: 16px 8px 8px;
      border-bottom: 1px dashed #ece3d5;
      margin-bottom: 6px;
    }
    .wp-sb-category:first-of-type {
      padding-top: 6px;
    }

    /* ── Individual tool item ──────────────────────────── */
    .wp-sb-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 11px 12px;
      border-radius: 14px;
      border: 1px solid transparent;
      background: transparent;
      transition: all 0.22s ease;
      opacity: 0;
      transform: translateX(18px);
      text-decoration: none;
      color: inherit;
      cursor: pointer;
    }
    .wp-tools-sidebar.open .wp-sb-item {
      animation: wpSlideIn 0.4s cubic-bezier(0.4,0,0.2,1) forwards;
    }
    .wp-sb-item:hover {
      background: #ffffff;
      border-color: rgba(255,107,74,0.28);
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(255,107,74,0.12), 0 1px 3px rgba(61,51,40,0.04);
    }
    .wp-sb-item-icon {
      width: 36px;
      height: 36px;
      border-radius: 11px;
      background: linear-gradient(135deg, rgba(255,107,74,0.1), rgba(139,92,246,0.08));
      border: 1px solid rgba(255,107,74,0.18);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.05rem;
      flex-shrink: 0;
      transition: all 0.2s ease;
    }
    .wp-sb-item:hover .wp-sb-item-icon {
      background: linear-gradient(135deg, rgba(255,107,74,0.2), rgba(139,92,246,0.14));
      border-color: rgba(255,107,74,0.4);
      transform: scale(1.06) rotate(-3deg);
    }
    .wp-sb-item-details {
      flex: 1;
      min-width: 0;
    }
    .wp-sb-item-name {
      font-size: 0.9rem;
      font-weight: 600;
      color: #1f1810;
      margin-bottom: 2px;
      line-height: 1.3;
    }
    .wp-sb-item:hover .wp-sb-item-name {
      color: #f5573a;
    }
    .wp-sb-item-desc {
      font-size: 0.75rem;
      color: #6b5d4a;
      line-height: 1.45;
    }

    /* ── Footer inside sidebar ─────────────────────────── */
    .wp-sb-footer {
      padding: 14px 22px 18px;
      border-top: 1px solid #ece3d5;
      background: linear-gradient(180deg, #fff9f2 0%, #fdfbf7 100%);
      flex-shrink: 0;
      font-family: 'Space Mono', monospace;
      font-size: 0.68rem;
      color: #948674;
      text-align: center;
      letter-spacing: 0.02em;
    }
    .wp-sb-footer a {
      color: #f5573a;
      text-decoration: none;
      font-weight: 700;
      transition: all 0.2s ease;
    }
    .wp-sb-footer a:hover {
      color: #e04428;
      text-decoration: underline;
      text-underline-offset: 3px;
    }

    /* ── Keyframes ─────────────────────────────────────── */
    @keyframes wpSlideIn {
      to { opacity: 1; transform: translateX(0); }
    }

    /* ── Scrollbar ─────────────────────────────────────── */
    .wp-sb-body::-webkit-scrollbar { width: 6px; }
    .wp-sb-body::-webkit-scrollbar-track { background: transparent; }
    .wp-sb-body::-webkit-scrollbar-thumb {
      background: #d9cdb8;
      border-radius: 3px;
    }
    .wp-sb-body::-webkit-scrollbar-thumb:hover { background: #ff6b4a; }

    /* ── Mobile adjustments ────────────────────────────── */
    @media (max-width: 480px) {
      .wp-tools-sidebar { width: 100vw; right: -100vw; }
      .wp-tools-trigger { bottom: 18px; right: 18px; width: 54px; height: 54px; font-size: 1.35rem; }
      .wp-sb-header { padding: 16px 18px; }
      .wp-sb-body { padding: 12px 12px 20px; }
      .wp-sb-footer { padding: 12px 18px 16px; }
    }

    /* ── Reduced motion ───────────────────────────────── */
    @media (prefers-reduced-motion: reduce) {
      .wp-tools-sidebar,
      .wp-tools-overlay,
      .wp-sb-item,
      .wp-sb-item-icon,
      .wp-tools-trigger,
      .wp-sb-close {
        transition-duration: 0.01ms !important;
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
      }
    }
  `;

  const styleEl = document.createElement("style");
  styleEl.textContent = cssStyles;
  document.head.appendChild(styleEl);

  // ── 3. Mount container (auto-create if page doesn't have one) ──
  let rootContainer = document.getElementById("wp-tools-sidebar-root");
  if (!rootContainer) {
    rootContainer = document.createElement("div");
    rootContainer.id = "wp-tools-sidebar-root";
    document.body.appendChild(rootContainer);
  }

  // ── 4. Render structure ──
  rootContainer.innerHTML = `
    <div class="wp-tools-overlay" id="wpToolsOverlay"></div>
    <button class="wp-tools-trigger" id="wpToolsTrigger"
            title="Open device test tools"
            aria-label="Toggle WhatPhone tools sidebar"
            aria-expanded="false"
            aria-controls="wpToolsSidebar">🛠️</button>
    <aside class="wp-tools-sidebar" id="wpToolsSidebar"
           aria-label="WhatPhone tools sidebar"
           aria-hidden="true">
      <div class="wp-sb-header">
        <h2>What<em>Phone</em> Tools</h2>
        <button class="wp-sb-close" id="wpToolsClose" aria-label="Close tools sidebar">✕</button>
      </div>

      <div class="wp-sb-body" id="wpToolsBody"></div>

      <div class="wp-sb-footer">
        © <a href="/" aria-label="WhatPhone home">WhatPhone</a> · Free device tools
      </div>
    </aside>
  `;

  // ── 5. Cache elements ──
  const sidebar   = document.getElementById("wpToolsSidebar");
  const trigger   = document.getElementById("wpToolsTrigger");
  const overlay   = document.getElementById("wpToolsOverlay");
  const closeBtn  = document.getElementById("wpToolsClose");
  const body      = document.getElementById("wpToolsBody");

  // ── 6. Build the tool list with categories ──
  // First 8 items are hardware tests; the rest are WhatPhone pages.
  // (Battery Test is now #5 in the hardware list.)
  const categories = [
    { title: "Hardware Tests", items: toolsList.slice(0, 8) },
    { title: "WhatPhone",      items: toolsList.slice(8) },
  ];

  categories.forEach((cat) => {
    const catEl = document.createElement("div");
    catEl.className = "wp-sb-category";
    catEl.textContent = cat.title;
    body.appendChild(catEl);

    cat.items.forEach((tool) => {
      const a = document.createElement("a");
      a.href = tool.url;
      a.className = "wp-sb-item";
      const globalIdx = toolsList.indexOf(tool);
      a.style.animationDelay = `${globalIdx * 0.035}s`;

      a.innerHTML = `
        <div class="wp-sb-item-icon" aria-hidden="true">${tool.icon}</div>
        <div class="wp-sb-item-details">
          <div class="wp-sb-item-name">${tool.name}</div>
          <div class="wp-sb-item-desc">${tool.desc}</div>
        </div>
      `;
      body.appendChild(a);
    });
  });

  // ── 7. Open / close / toggle handlers ──
  function openSidebar() {
    sidebar.classList.add("open");
    trigger.classList.add("active");
    overlay.classList.add("visible");
    trigger.innerHTML = "✕";
    trigger.setAttribute("aria-expanded", "true");
    sidebar.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";   // lock background scroll
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    trigger.classList.remove("active");
    overlay.classList.remove("visible");
    trigger.innerHTML = "🛠️";
    trigger.setAttribute("aria-expanded", "false");
    sidebar.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function toggleSidebar() {
    if (sidebar.classList.contains("open")) closeSidebar();
    else openSidebar();
  }

  trigger.addEventListener("click", toggleSidebar);
  overlay.addEventListener("click", closeSidebar);
  closeBtn.addEventListener("click", closeSidebar);

  // Close with Escape key
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar.classList.contains("open")) closeSidebar();
  });

  // Close when a tool link is clicked (so the page can navigate cleanly)
  body.querySelectorAll(".wp-sb-item").forEach((link) => {
    link.addEventListener("click", () => {
      // Small timeout so the click registers before close animation
      setTimeout(closeSidebar, 80);
    });
  });
})();
