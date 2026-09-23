/**
 * WhatPhone — sidebar.js
 * Fixed dynamic sidebar for WhatPhone device testing tools.
 * Theme: Light Futuristic / Digital Blueprint (matches style.css)
 * Includes: 300x250 advertisement at the top + tool links from header.js
 */

(function () {
  // ── 1. Tool list (mirrors header.js dropdown + extra useful links) ──
  const toolsList = [
    // Hardware testing tools (from header.js)
    { name: "Camera Test",       icon: "📷", url: "/camera-test",       desc: "Test your device's front and rear camera." },
    { name: "Mic Test",          icon: "🎤", url: "/mic-test",          desc: "Check your microphone input and volume." },
    { name: "Touchscreen Test",  icon: "👆", url: "/touchscreen-test",  desc: "Multi-touch accuracy and gesture testing." },
    { name: "Speaker Test",      icon: "🔊", url: "/speaker-test",      desc: "Test audio output, stereo and left/right channels." },
    { name: "Vibration Test",    icon: "📳", url: "/vibration-test",    desc: "Check haptic feedback and vibration motor." },
    { name: "WiFi Speed Test",   icon: "📶", url: "/wifi-speed-test",   desc: "Measure bandwidth, latency and connection quality." },
    { name: "GPS / Compass",     icon: "🧭", url: "/gps-compass-test",  desc: "Test geolocation and device orientation sensors." },

    // WhatPhone-specific pages
    { name: "Detect My Phone",   icon: "📱", url: "/#detect",           desc: "Run a full device detection scan." },
    { name: "Guides",            icon: "📚", url: "/guides",            desc: "Articles about devices and testing." },
  ];

  // ── 2. Inject CSS (light-futuristic, matched to WhatPhone style.css) ──
  const cssStyles = `
    /* ── Floating trigger button ───────────────────────── */
    .wp-tools-trigger {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      width: 56px;
      height: 56px;
      background: #3b82f6;
      color: #ffffff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      border: none;
      box-shadow: 0 0 30px rgba(59,130,246,0.45), 0 6px 20px rgba(15,23,42,0.18);
      cursor: pointer;
      transition: transform 0.25s cubic-bezier(0.4,0,0.2,1), background 0.25s ease, box-shadow 0.25s ease;
    }
    .wp-tools-trigger:hover {
      transform: scale(1.08) translateY(-2px);
      background: #2563eb;
      box-shadow: 0 0 40px rgba(59,130,246,0.65), 0 8px 28px rgba(15,23,42,0.22);
    }
    .wp-tools-trigger.active {
      transform: scale(0.92) rotate(-90deg);
      background: #1d4ed8;
    }

    /* ── Backdrop overlay ──────────────────────────────── */
    .wp-tools-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15,23,42,0.45);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
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
      right: -380px;
      width: 360px;
      max-width: 90vw;
      height: 100vh;
      background: #ffffff;
      border-left: 1px solid #e1e7f0;
      box-shadow: -12px 0 40px rgba(15,23,42,0.12);
      z-index: 10000;
      display: flex;
      flex-direction: column;
      transition: right 0.4s cubic-bezier(0.4,0,0.2,1);
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1e293b;
    }
    .wp-tools-sidebar.open {
      right: 0;
    }

    /* ── Header ────────────────────────────────────────── */
    .wp-sb-header {
      padding: 18px 20px;
      border-bottom: 1px solid #e1e7f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f7f9fc;
      flex-shrink: 0;
    }
    .wp-sb-header h2 {
      font-family: 'Syne', sans-serif;
      font-size: 1.15rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
      letter-spacing: -0.01em;
    }
    .wp-sb-header h2 em {
      font-style: normal;
      color: #2563eb;
    }
    .wp-sb-close {
      width: 32px;
      height: 32px;
      font-size: 1rem;
      color: #55617a;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      background: transparent;
      border: none;
      font-family: inherit;
    }
    .wp-sb-close:hover {
      color: #0f172a;
      background: #e4e9f1;
    }

    /* ── Ad slot at the top ────────────────────────────── */
    .wp-sb-ad {
      padding: 14px 20px 6px;
      flex-shrink: 0;
      border-bottom: 1px solid #eef2f7;
      background: #f7f9fc;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
    .wp-sb-ad-label {
      font-family: 'Space Mono', monospace;
      font-size: 0.6rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #7c8aa0;
      align-self: flex-start;
    }
    .wp-sb-ad-slot {
      width: 300px;
      height: 250px;
      max-width: 100%;
      background: #eef3f9;
      border: 1px solid #e1e7f0;
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    /* Placeholder shown until/if the ad iframe loads */
    .wp-sb-ad-slot::before {
      content: 'Advertisement';
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Space Mono', monospace;
      font-size: 0.7rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #94a3b8;
      z-index: 0;
      pointer-events: none;
    }
    .wp-sb-ad-slot iframe {
      position: relative;
      z-index: 1;
      width: 300px;
      height: 250px;
      border: none;
      display: block;
      background: #ffffff;
    }

    /* ── Scrollable tool list ──────────────────────────── */
    .wp-sb-body {
      flex: 1;
      overflow-y: auto;
      padding: 12px 14px 20px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    /* ── Category label ────────────────────────────────── */
    .wp-sb-category {
      font-family: 'Space Mono', monospace;
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #7c8aa0;
      padding: 14px 8px 6px;
      border-bottom: 1px dashed #e1e7f0;
      margin-bottom: 4px;
    }
    .wp-sb-category:first-of-type {
      padding-top: 6px;
    }

    /* ── Individual tool item ──────────────────────────── */
    .wp-sb-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 12px;
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
      background: #eef3f9;
      border-color: #cad3e0;
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(59,130,246,0.08);
    }
    .wp-sb-item-icon {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      background: #eef3f9;
      border: 1px solid #e1e7f0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.05rem;
      flex-shrink: 0;
      transition: background 0.2s ease, border-color 0.2s ease;
    }
    .wp-sb-item:hover .wp-sb-item-icon {
      background: rgba(59,130,246,0.12);
      border-color: rgba(59,130,246,0.35);
    }
    .wp-sb-item-details {
      flex: 1;
      min-width: 0;
    }
    .wp-sb-item-name {
      font-size: 0.88rem;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 2px;
      line-height: 1.3;
    }
    .wp-sb-item-desc {
      font-size: 0.74rem;
      color: #55617a;
      line-height: 1.4;
    }

    /* ── Footer inside sidebar ─────────────────────────── */
    .wp-sb-footer {
      padding: 12px 20px 16px;
      border-top: 1px solid #e1e7f0;
      background: #f7f9fc;
      flex-shrink: 0;
      font-family: 'Space Mono', monospace;
      font-size: 0.68rem;
      color: #7c8aa0;
      text-align: center;
      letter-spacing: 0.02em;
    }
    .wp-sb-footer a {
      color: #2563eb;
      text-decoration: none;
    }
    .wp-sb-footer a:hover {
      text-decoration: underline;
    }

    /* ── Keyframes ─────────────────────────────────────── */
    @keyframes wpSlideIn {
      to { opacity: 1; transform: translateX(0); }
    }

    /* ── Scrollbar ─────────────────────────────────────── */
    .wp-sb-body::-webkit-scrollbar { width: 5px; }
    .wp-sb-body::-webkit-scrollbar-track { background: #eef2f7; }
    .wp-sb-body::-webkit-scrollbar-thumb {
      background: #cad3e0;
      border-radius: 3px;
    }
    .wp-sb-body::-webkit-scrollbar-thumb:hover { background: #3b82f6; }

    /* ── Mobile adjustments ────────────────────────────── */
    @media (max-width: 480px) {
      .wp-tools-sidebar { width: 100vw; right: -100vw; }
      .wp-tools-trigger { bottom: 18px; right: 18px; width: 50px; height: 50px; }
      .wp-sb-ad-slot { width: 100%; max-width: 300px; }
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

      <!-- Ad slot at the top of the sidebar -->
      <div class="wp-sb-ad">
        <span class="wp-sb-ad-label">Advertisement</span>
        <div class="wp-sb-ad-slot" id="wpSbAdSlot" aria-label="Advertisement">
          <!-- Ad script injects iframe here -->
        </div>
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
  const adSlot    = document.getElementById("wpSbAdSlot");

  // ── 6. Inject the 300x250 HighRevenueFormat ad into the sidebar top slot ──
  // The ad loads once, and only when the sidebar is first opened (lazy load).
  let adInjected = false;
  function injectSidebarAd() {
    if (adInjected || !adSlot) return;
    adInjected = true;

    // atOptions must be defined globally for invoke.js to pick it up.
    // We save the previous value (if any) so we don't clobber an existing ad config.
    const prevAtOptions = window.atOptions;

    // Set up the ad options (same key as the popup ad on the homepage)
    const optionsScript = document.createElement("script");
    optionsScript.type = "text/javascript";
    optionsScript.textContent = `
      atOptions = {
        'key' : '81443cd2b70e4089345fae478ec5b90a',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;
    adSlot.appendChild(optionsScript);

    // Load the invoke.js script inside the slot so it renders the iframe in-place
    const invokeScript = document.createElement("script");
    invokeScript.src = "https://www.highrevenueformat.com/81443cd2b70e4089345fae478ec5b90a/invoke.js";
    invokeScript.async = true;
    invokeScript.onload = () => {
      // Restore previous atOptions if we overwrote something meaningful
      if (prevAtOptions !== undefined) window.atOptions = prevAtOptions;
    };
    adSlot.appendChild(invokeScript);
  }

  // ── 7. Build the tool list with categories ──
  const categories = [
    { title: "Hardware Tests", items: toolsList.slice(0, 7) },
    { title: "WhatPhone",      items: toolsList.slice(7) },
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

  // ── 8. Open / close / toggle handlers ──
  function openSidebar() {
    sidebar.classList.add("open");
    trigger.classList.add("active");
    overlay.classList.add("visible");
    trigger.innerHTML = "✕";
    trigger.setAttribute("aria-expanded", "true");
    sidebar.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";   // lock background scroll
    injectSidebarAd();                          // lazy-load the ad once
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
