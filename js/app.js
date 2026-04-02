// WhatPhone — Main Application Logic

const DeviceDetector = (() => {

  // ── UA Parsing ──────────────────────────────────────────────────
  const getUA = () => navigator.userAgent || '';
  const getUAData = () => navigator.userAgentData || null;

  const parseUserAgent = () => {
    const ua = getUA();
    const uaData = getUAData();
    const result = {
      raw: ua,
      brand: 'Unknown',
      model: 'Unknown',
      os: 'Unknown',
      osVersion: 'Unknown',
      browser: 'Unknown',
      browserVersion: 'Unknown',
      deviceType: 'Unknown',
      isMobile: false,
      isTablet: false,
      isDesktop: false,
    };

    // Device Type
    result.isMobile = /Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    result.isTablet = /iPad|Android(?!.*Mobile)|Tablet/i.test(ua) && !result.isMobile;
    result.isDesktop = !result.isMobile && !result.isTablet;
    result.deviceType = result.isMobile ? 'Smartphone' : result.isTablet ? 'Tablet' : 'Desktop / Laptop';

    // OS
    if (/Android/i.test(ua)) {
      result.os = 'Android';
      const m = ua.match(/Android\s([\d.]+)/i);
      result.osVersion = m ? m[1] : 'Unknown';
    } else if (/iPhone|iPad|iPod/i.test(ua)) {
      result.os = /iPad/i.test(ua) ? 'iPadOS' : 'iOS';
      const m = ua.match(/OS\s([\d_]+)/i);
      result.osVersion = m ? m[1].replace(/_/g, '.') : 'Unknown';
    } else if (/Windows NT/i.test(ua)) {
      result.os = 'Windows';
      const versions = { '10.0': '10/11', '6.3': '8.1', '6.2': '8', '6.1': '7' };
      const m = ua.match(/Windows NT ([\d.]+)/i);
      result.osVersion = m ? (versions[m[1]] || m[1]) : 'Unknown';
    } else if (/Mac OS X/i.test(ua)) {
      result.os = 'macOS';
      const m = ua.match(/Mac OS X\s*([\d_]+)/i);
      result.osVersion = m ? m[1].replace(/_/g, '.') : 'Unknown';
    } else if (/Linux/i.test(ua)) {
      result.os = 'Linux';
    } else if (/CrOS/i.test(ua)) {
      result.os = 'ChromeOS';
    }

    // Browser
    if (/EdgA?\/|Edg\//i.test(ua)) {
      result.browser = 'Microsoft Edge';
      const m = ua.match(/Edg(?:A|e)?\/([\d.]+)/i);
      result.browserVersion = m ? m[1] : '';
    } else if (/SamsungBrowser/i.test(ua)) {
      result.browser = 'Samsung Internet';
      const m = ua.match(/SamsungBrowser\/([\d.]+)/i);
      result.browserVersion = m ? m[1] : '';
    } else if (/OPR|Opera/i.test(ua)) {
      result.browser = 'Opera';
      const m = ua.match(/(?:OPR|Opera)\/([\d.]+)/i);
      result.browserVersion = m ? m[1] : '';
    } else if (/FBAN|FBAV/i.test(ua)) {
      result.browser = 'Facebook In-App';
    } else if (/Instagram/i.test(ua)) {
      result.browser = 'Instagram In-App';
    } else if (/Chrome/i.test(ua) && !/Chromium/i.test(ua)) {
      result.browser = 'Google Chrome';
      const m = ua.match(/Chrome\/([\d.]+)/i);
      result.browserVersion = m ? m[1] : '';
    } else if (/Firefox/i.test(ua)) {
      result.browser = 'Mozilla Firefox';
      const m = ua.match(/Firefox\/([\d.]+)/i);
      result.browserVersion = m ? m[1] : '';
    } else if (/Safari/i.test(ua)) {
      result.browser = 'Safari';
      const m = ua.match(/Version\/([\d.]+)/i);
      result.browserVersion = m ? m[1] : '';
    }

    // Brand & Model (expanded)
    const deviceMap = [
      // Apple
      [/iPhone\s?(\d+,\d+)/i, (m) => ({ brand: 'Apple', model: resolveIPhoneModel(m[1]) })],
      [/iPhone/i, () => ({ brand: 'Apple', model: resolveIPhoneFromUA(ua) })],
      [/iPad/i, () => ({ brand: 'Apple', model: 'iPad' })],
      // Samsung
      [/SM-S9\d\d[A-Z]*/i, (m) => ({ brand: 'Samsung', model: `Galaxy S Series (${ua.match(/SM-S9\d+[A-Z]*/i)?.[0]})` })],
      [/SM-S8\d\d[A-Z]*/i, (m) => ({ brand: 'Samsung', model: `Galaxy S Series (${ua.match(/SM-S8\d+[A-Z]*/i)?.[0]})` })],
      [/SM-G99\d[A-Z]*/i, () => ({ brand: 'Samsung', model: 'Galaxy S21 Series' })],
      [/SM-G97\d[A-Z]*/i, () => ({ brand: 'Samsung', model: 'Galaxy S10 Series' })],
      [/SM-G96\d[A-Z]*/i, () => ({ brand: 'Samsung', model: 'Galaxy S21 FE' })],
      [/SM-N\d{3}/i, (m) => ({ brand: 'Samsung', model: `Galaxy Note (${ua.match(/SM-N\d+/i)?.[0]})` })],
      [/SM-F\d{3}/i, (m) => ({ brand: 'Samsung', model: `Galaxy Fold/Flip (${ua.match(/SM-F\d+/i)?.[0]})` })],
      [/SM-A\d{3}/i, (m) => ({ brand: 'Samsung', model: `Galaxy A Series (${ua.match(/SM-A\d+/i)?.[0]})` })],
      [/Samsung|SAMSUNG/i, () => ({ brand: 'Samsung', model: 'Galaxy Device' })],
      // Google Pixel
      [/Pixel\s?(\d+[a-zA-Z\s]*)/i, (m) => ({ brand: 'Google', model: `Pixel ${m[1].trim()}` })],
      // OnePlus
      [/OnePlus\s?([\w\s]+)/i, (m) => ({ brand: 'OnePlus', model: `OnePlus ${m[1].trim()}` })],
      [/(?:IN2|LE2|KB2|HD1|ONEPLUS)/i, () => ({ brand: 'OnePlus', model: 'OnePlus Device' })],
      // Xiaomi
      [/Mi\s?(\d+[a-zA-Z\s]*)/i, (m) => ({ brand: 'Xiaomi', model: `Mi ${m[1].trim()}` })],
      [/Redmi\s?([\w\s]+)/i, (m) => ({ brand: 'Xiaomi', model: `Redmi ${m[1].trim()}` })],
      [/POCO\s?([\w\s]+)/i, (m) => ({ brand: 'Xiaomi', model: `POCO ${m[1].trim()}` })],
      [/Xiaomi/i, () => ({ brand: 'Xiaomi', model: 'Xiaomi Device' })],
      // Huawei
      [/HUAWEI\s?([\w-]+)/i, (m) => ({ brand: 'Huawei', model: m[1] })],
      [/Huawei/i, () => ({ brand: 'Huawei', model: 'Huawei Device' })],
      // Oppo
      [/CPH\d{4}/i, (m) => ({ brand: 'OPPO', model: `OPPO (${ua.match(/CPH\d+/i)?.[0]})` })],
      [/OPPO/i, () => ({ brand: 'OPPO', model: 'OPPO Device' })],
      // Vivo
      [/vivo\s?([\w\s]+)/i, (m) => ({ brand: 'Vivo', model: `Vivo ${m[1].trim()}` })],
      // Motorola
      [/moto\s?([\w\s]+)/i, (m) => ({ brand: 'Motorola', model: `Moto ${m[1].trim()}` })],
      [/Motorola/i, () => ({ brand: 'Motorola', model: 'Motorola Device' })],
      // LG
      [/LG[-\/\s]?([\w]+)/i, (m) => ({ brand: 'LG', model: `LG ${m[1]}` })],
      // Nokia
      [/Nokia\s?([\w\s]+)/i, (m) => ({ brand: 'Nokia', model: `Nokia ${m[1].trim()}` })],
      // Sony
      [/Sony\s?([\w\s]+)/i, (m) => ({ brand: 'Sony', model: `Sony ${m[1].trim()}` })],
      [/Xperia/i, () => ({ brand: 'Sony', model: 'Sony Xperia' })],
    ];

    for (const [regex, resolver] of deviceMap) {
      const m = ua.match(regex);
      if (m) {
        const resolved = resolver(m);
        result.brand = resolved.brand;
        result.model = resolved.model;
        break;
      }
    }

    // Use high-entropy UA data if available
    if (uaData?.brands) {
      const chromium = uaData.brands.find(b => b.brand === 'Chromium');
      if (!chromium) {
        const real = uaData.brands.find(b => b.brand !== 'Not)A;Brand' && b.brand !== 'Not A;Brand');
        if (real) result.browser = real.brand;
      }
    }

    return result;
  };

  const resolveIPhoneModel = (identifier) => {
    const map = {
      '14,4': 'iPhone 13 mini', '14,5': 'iPhone 13',
      '14,2': 'iPhone 13 Pro', '14,3': 'iPhone 13 Pro Max',
      '15,4': 'iPhone 14', '15,5': 'iPhone 14 Plus',
      '15,2': 'iPhone 14 Pro', '15,3': 'iPhone 14 Pro Max',
      '16,1': 'iPhone 15', '16,2': 'iPhone 15 Plus',
      '16,3': 'iPhone 15 Pro', '16,4': 'iPhone 15 Pro Max',
      '17,3': 'iPhone 16', '17,4': 'iPhone 16 Plus',
      '17,1': 'iPhone 16 Pro', '17,2': 'iPhone 16 Pro Max',
    };
    return map[identifier] || `iPhone (${identifier})`;
  };

  const resolveIPhoneFromUA = (ua) => {
    // Screen resolution fallback for iOS
    const w = screen.width * window.devicePixelRatio;
    const h = screen.height * window.devicePixelRatio;
    const key = `${Math.min(w,h)}x${Math.max(w,h)}`;
    const map = {
      '1170x2532': 'iPhone 12/13 (Pro)',
      '1284x2778': 'iPhone 12/13 Pro Max',
      '1179x2556': 'iPhone 14/15 Pro',
      '1290x2796': 'iPhone 14/15 Pro Max',
      '1080x2340': 'iPhone 14/15',
      '750x1334': 'iPhone SE / 8',
      '828x1792': 'iPhone 11 / XR',
      '1125x2436': 'iPhone X / XS / 11 Pro',
      '1242x2688': 'iPhone XS Max / 11 Pro Max',
    };
    return map[key] || 'iPhone';
  };

  // ── Hardware Info ───────────────────────────────────────────────
  const getHardwareInfo = async () => {
    const info = {
      cores: navigator.hardwareConcurrency || 'Unknown',
      memory: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'Unknown',
      touchPoints: navigator.maxTouchPoints || 0,
      online: navigator.onLine,
      language: navigator.language || 'Unknown',
      languages: (navigator.languages || []).join(', '),
      cookiesEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack === '1' ? 'Enabled' : 'Disabled',
      pdfViewerEnabled: navigator.pdfViewerEnabled,
    };

    // Battery
    if ('getBattery' in navigator) {
      try {
        const battery = await navigator.getBattery();
        info.batteryLevel = `${Math.round(battery.level * 100)}%`;
        info.batteryCharging = battery.charging ? 'Yes' : 'No';
        info.batteryChargingTime = battery.chargingTime === Infinity ? 'N/A' : `${Math.round(battery.chargingTime / 60)} min`;
        info.batteryDischargingTime = battery.dischargingTime === Infinity ? 'N/A' : `${Math.round(battery.dischargingTime / 60)} min`;
      } catch {
        info.batteryLevel = 'No access';
      }
    }

    return info;
  };

  // ── Screen Info ─────────────────────────────────────────────────
  const getScreenInfo = () => ({
    width: screen.width,
    height: screen.height,
    availWidth: screen.availWidth,
    availHeight: screen.availHeight,
    colorDepth: `${screen.colorDepth}-bit`,
    pixelDepth: `${screen.pixelDepth}-bit`,
    devicePixelRatio: window.devicePixelRatio,
    orientation: screen.orientation?.type || 'Unknown',
    logicalResolution: `${screen.width} × ${screen.height}`,
    physicalResolution: `${Math.round(screen.width * window.devicePixelRatio)} × ${Math.round(screen.height * window.devicePixelRatio)}`,
    colorGamut: (() => {
      if (window.matchMedia('(color-gamut: rec2020)').matches) return 'Rec. 2020';
      if (window.matchMedia('(color-gamut: p3)').matches) return 'DCI-P3';
      return 'sRGB';
    })(),
    hdrSupport: window.matchMedia('(dynamic-range: high)').matches ? 'Yes' : 'No',
    prefersColorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light',
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'Yes' : 'No',
  });

  // ── Network Info ────────────────────────────────────────────────
  const getNetworkInfo = () => {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!conn) return { type: 'Unknown', effectiveType: 'Unknown', downlink: 'Unknown', rtt: 'Unknown', saveData: 'Unknown' };
    return {
      type: conn.type || 'Unknown',
      effectiveType: conn.effectiveType || 'Unknown',
      downlink: conn.downlink ? `${conn.downlink} Mbps` : 'Unknown',
      rtt: conn.rtt ? `${conn.rtt} ms` : 'Unknown',
      saveData: conn.saveData ? 'Enabled' : 'Disabled',
    };
  };

  // ── Capabilities ────────────────────────────────────────────────
  const getCapabilities = () => ({
    webgl: (() => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        if (!gl) return 'Not supported';
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : 'Supported';
      } catch { return 'Not supported'; }
    })(),
    webgpu: 'gpu' in navigator ? 'Supported' : 'Not supported',
    webrtc: 'RTCPeerConnection' in window ? 'Supported' : 'Not supported',
    bluetooth: 'bluetooth' in navigator ? 'Supported' : 'Not supported',
    usb: 'usb' in navigator ? 'Supported' : 'Not supported',
    nfc: 'NDEFReader' in window ? 'Supported' : 'Not supported',
    geolocation: 'geolocation' in navigator ? 'Supported' : 'Not supported',
    notifications: 'Notification' in window ? (Notification.permission) : 'Not supported',
    vibration: 'vibrate' in navigator ? 'Supported' : 'Not supported',
    camera: 'mediaDevices' in navigator ? 'API Available' : 'Not supported',
    gyroscope: window.DeviceOrientationEvent ? 'API Available' : 'Not supported',
    accelerometer: window.DeviceMotionEvent ? 'API Available' : 'Not supported',
    touchscreen: navigator.maxTouchPoints > 0 ? `Yes (${navigator.maxTouchPoints} points)` : 'No',
    hoverSupport: window.matchMedia('(hover: hover)').matches ? 'Yes' : 'No',
    pointerFine: window.matchMedia('(pointer: fine)').matches ? 'Mouse/Stylus' : 'Touch/Coarse',
    serviceWorker: 'serviceWorker' in navigator ? 'Supported' : 'Not supported',
    pushNotifications: 'PushManager' in window ? 'Supported' : 'Not supported',
    storage: 'storage' in navigator ? 'Supported' : 'Not supported',
    clipboard: 'clipboard' in navigator ? 'Supported' : 'Not supported',
    share: 'share' in navigator ? 'Supported' : 'Not supported',
    payment: 'PaymentRequest' in window ? 'Supported' : 'Not supported',
    wasm: typeof WebAssembly !== 'undefined' ? 'Supported' : 'Not supported',
  });

  // ── High Entropy UA ─────────────────────────────────────────────
  const getHighEntropyData = async () => {
    const uaData = getUAData();
    if (!uaData?.getHighEntropyValues) return null;
    try {
      return await uaData.getHighEntropyValues([
        'architecture', 'bitness', 'model', 'platform', 'platformVersion', 'uaFullVersion', 'fullVersionList', 'mobile'
      ]);
    } catch { return null; }
  };

  // ── Full Detection ──────────────────────────────────────────────
  const detect = async () => {
    const [ua, hardware, highEntropy] = await Promise.all([
      parseUserAgent(),
      getHardwareInfo(),
      getHighEntropyData(),
    ]);

    const screen = getScreenInfo();
    const network = getNetworkInfo();
    const capabilities = getCapabilities();

    // Enrich from high-entropy
    if (highEntropy) {
      if (highEntropy.model && highEntropy.model !== '') ua.model = highEntropy.model;
      if (highEntropy.platform) ua.os = highEntropy.platform;
      if (highEntropy.platformVersion) ua.osVersion = highEntropy.platformVersion;
      if (highEntropy.architecture) hardware.architecture = `${highEntropy.architecture} (${highEntropy.bitness}-bit)`;
    }

    return { ua, hardware, screen, network, capabilities, timestamp: new Date().toISOString() };
  };

  return { detect };
})();

// ── UI Renderer ─────────────────────────────────────────────────────────────

const UI = (() => {
  let detectionData = null;

  const render = async () => {
    const btn = document.getElementById('detectBtn');
    const resultSection = document.getElementById('resultSection');
    const loader = document.getElementById('detectLoader');

    if (!btn) return;

    btn.addEventListener('click', async () => {
      btn.disabled = true;
      btn.classList.add('loading');
      loader?.classList.add('active');

      await new Promise(r => setTimeout(r, 800)); // UX delay for effect

      detectionData = await DeviceDetector.detect();
      renderResults(detectionData);

      loader?.classList.remove('active');
      btn.disabled = false;
      btn.classList.remove('loading');
      resultSection?.classList.add('visible');
      resultSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Auto-detect on load
    setTimeout(async () => {
      detectionData = await DeviceDetector.detect();
      renderHeroQuickInfo(detectionData);
    }, 300);
  };

  const renderHeroQuickInfo = (data) => {
    const el = document.getElementById('heroQuickInfo');
    if (!el) return;
    el.innerHTML = `
      <span class="quick-chip">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><rect x="2" y="1" width="8" height="10" rx="1.5" stroke="currentColor" stroke-width="1.2"/><line x1="4" y1="8.5" x2="8" y2="8.5" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg>
        ${data.ua.deviceType}
      </span>
      <span class="quick-chip">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.2"/><path d="M6 3v3l2 1" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg>
        ${data.ua.os} ${data.ua.osVersion}
      </span>
      <span class="quick-chip">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 9L6 3l4 6H2z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>
        ${data.ua.browser}
      </span>
    `;
    el.classList.add('loaded');
  };

  const renderResults = (data) => {
    renderDeviceCard(data);
    renderSpecsTabs(data);
    renderCapabilitiesGrid(data);
    renderAdvancedInfo(data);
  };

  const renderDeviceCard = (data) => {
    const el = document.getElementById('deviceCard');
    if (!el) return;

    const brandColors = {
      'Apple': '#555', 'Samsung': '#1428A0', 'Google': '#4285F4',
      'OnePlus': '#F5010C', 'Xiaomi': '#FF6900', 'Huawei': '#CF0A2C',
      'OPPO': '#1D3461', 'Motorola': '#5C2D91', 'Sony': '#000',
      'Nokia': '#124191', 'LG': '#A50034', 'Vivo': '#415FFF',
      'Unknown': '#666',
    };

    const brandColor = brandColors[data.ua.brand] || '#666';
    const batteryLevel = data.hardware.batteryLevel?.replace('%', '') || null;
    const batteryNum = batteryLevel ? parseInt(batteryLevel) : null;

    el.innerHTML = `
      <div class="device-card-header" style="--brand-color: ${brandColor}">
        <div class="device-brand-badge">${data.ua.brand}</div>
        <div class="device-model-name">${data.ua.model}</div>
        <div class="device-type-tag">
          ${getDeviceIcon(data.ua.deviceType)}
          <span>${data.ua.deviceType}</span>
        </div>
        ${batteryNum !== null ? `
        <div class="device-battery">
          <div class="battery-bar">
            <div class="battery-fill" style="width: ${batteryNum}%; background: ${batteryNum > 50 ? '#22c55e' : batteryNum > 20 ? '#f59e0b' : '#ef4444'}"></div>
          </div>
          <span>${data.hardware.batteryLevel}</span>
          ${data.hardware.batteryCharging === 'Yes' ? '<span class="charging-icon">⚡</span>' : ''}
        </div>` : ''}
      </div>
      <div class="device-card-body">
        <div class="card-info-grid">
          ${infoCell('OS', `${data.ua.os} ${data.ua.osVersion}`)}
          ${infoCell('Browser', `${data.ua.browser}${data.ua.browserVersion ? ' ' + data.ua.browserVersion : ''}`)}
          ${infoCell('Screen', `${data.screen.logicalResolution}`)}
          ${infoCell('Resolution', data.screen.physicalResolution)}
          ${infoCell('Pixel Ratio', `${data.screen.devicePixelRatio}x`)}
          ${infoCell('Color Gamut', data.screen.colorGamut)}
          ${infoCell('CPU Cores', data.hardware.cores)}
          ${infoCell('RAM', data.hardware.memory)}
          ${infoCell('Network', data.network.effectiveType)}
          ${infoCell('Touch', data.capabilities.touchscreen)}
          ${infoCell('Language', data.hardware.language)}
          ${infoCell('Theme', data.screen.prefersColorScheme)}
        </div>
        <div class="card-actions">
          <button class="action-btn" onclick="UI.copyResults()" aria-label="Copy all results to clipboard">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="5" y="4" width="9" height="11" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M3 12H2a1 1 0 01-1-1V2a1 1 0 011-1h8a1 1 0 011 1v1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
            Copy Report
          </button>
          <button class="action-btn" onclick="UI.shareResults()" aria-label="Share detection results">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="13" cy="3" r="2" stroke="currentColor" stroke-width="1.4"/><circle cx="3" cy="8" r="2" stroke="currentColor" stroke-width="1.4"/><circle cx="13" cy="13" r="2" stroke="currentColor" stroke-width="1.4"/><path d="M5 7l6-3M5 9l6 3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
            Share
          </button>
          <button class="action-btn" onclick="UI.downloadReport()" aria-label="Download full detection report">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 2v8M5 7l3 3 3-3M2 12h12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Download
          </button>
        </div>
      </div>
    `;
  };

  const infoCell = (label, value) => `
    <div class="info-cell">
      <span class="info-label">${label}</span>
      <span class="info-value">${value || 'Unknown'}</span>
    </div>
  `;

  const getDeviceIcon = (type) => {
    if (type === 'Smartphone') return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="3" y="1" width="10" height="14" rx="2" stroke="currentColor" stroke-width="1.4"/><circle cx="8" cy="12.5" r="1" fill="currentColor"/></svg>`;
    if (type === 'Tablet') return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="1" y="2" width="14" height="12" rx="2" stroke="currentColor" stroke-width="1.4"/><circle cx="13" cy="8" r="0.8" fill="currentColor"/></svg>`;
    return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="1" y="3" width="12" height="8" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M5 11v2M3 13h8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`;
  };

  const renderSpecsTabs = (data) => {
    const el = document.getElementById('specsTabs');
    if (!el) return;

    const tabs = [
      {
        id: 'tab-screen', label: 'Screen', icon: '🖥️',
        content: data.screen,
        fields: [
          ['Logical Resolution', 'logicalResolution'],
          ['Physical Resolution', 'physicalResolution'],
          ['Available Size', (s) => `${s.availWidth} × ${s.availHeight}`],
          ['Device Pixel Ratio', 'devicePixelRatio'],
          ['Color Depth', 'colorDepth'],
          ['Color Gamut', 'colorGamut'],
          ['HDR Support', 'hdrSupport'],
          ['Orientation', 'orientation'],
          ['Prefers Dark Mode', (s) => s.prefersColorScheme === 'Dark' ? 'Yes' : 'No'],
          ['Reduced Motion', 'prefersReducedMotion'],
        ]
      },
      {
        id: 'tab-hardware', label: 'Hardware', icon: '⚙️',
        content: data.hardware,
        fields: [
          ['CPU Cores', 'cores'],
          ['RAM', 'memory'],
          ['Architecture', (h) => h.architecture || 'Unknown'],
          ['Touch Points', 'touchPoints'],
          ['Battery Level', 'batteryLevel'],
          ['Charging', 'batteryCharging'],
          ['Battery Time', 'batteryDischargingTime'],
        ]
      },
      {
        id: 'tab-network', label: 'Network', icon: '📡',
        content: data.network,
        fields: [
          ['Connection Type', 'type'],
          ['Effective Type', 'effectiveType'],
          ['Downlink Speed', 'downlink'],
          ['Round Trip Time', 'rtt'],
          ['Data Saver', 'saveData'],
          ['Online Status', () => navigator.onLine ? 'Online' : 'Offline'],
        ]
      },
      {
        id: 'tab-browser', label: 'Browser', icon: '🌐',
        content: data.ua,
        fields: [
          ['Browser', (u) => `${u.browser} ${u.browserVersion}`],
          ['Language', () => data.hardware.language],
          ['Languages', () => data.hardware.languages],
          ['Cookies', () => data.hardware.cookiesEnabled ? 'Enabled' : 'Disabled'],
          ['Do Not Track', () => data.hardware.doNotTrack],
          ['PDF Viewer', () => data.hardware.pdfViewerEnabled ? 'Built-in' : 'External'],
          ['Service Workers', () => data.capabilities.serviceWorker],
          ['Push API', () => data.capabilities.pushNotifications],
          ['Share API', () => data.capabilities.share],
          ['Payment API', () => data.capabilities.payment],
        ]
      }
    ];

    el.innerHTML = `
      <div class="tabs-nav" role="tablist" aria-label="Device specification categories">
        ${tabs.map((t, i) => `
          <button class="tab-btn${i === 0 ? ' active' : ''}" role="tab" aria-selected="${i === 0}" aria-controls="${t.id}" id="btn-${t.id}" onclick="UI.switchTab('${t.id}', this)">
            <span aria-hidden="true">${t.icon}</span> ${t.label}
          </button>`).join('')}
      </div>
      <div class="tabs-content">
        ${tabs.map((t, i) => `
          <div class="tab-panel${i === 0 ? ' active' : ''}" id="${t.id}" role="tabpanel" aria-labelledby="btn-${t.id}">
            <dl class="specs-dl">
              ${t.fields.map(([label, key]) => {
                const val = typeof key === 'function' ? key(t.content) : t.content[key];
                return `<div class="spec-row"><dt>${label}</dt><dd>${val ?? 'Unknown'}</dd></div>`;
              }).join('')}
            </dl>
          </div>`).join('')}
      </div>
    `;
  };

  const switchTab = (id, btn) => {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    document.getElementById(id)?.classList.add('active');
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
  };

  const renderCapabilitiesGrid = (data) => {
    const el = document.getElementById('capabilitiesGrid');
    if (!el) return;

    const caps = [
      ['WebGL', data.capabilities.webgl],
      ['WebGPU', data.capabilities.webgpu],
      ['WebRTC', data.capabilities.webrtc],
      ['Bluetooth', data.capabilities.bluetooth],
      ['USB', data.capabilities.usb],
      ['NFC', data.capabilities.nfc],
      ['Geolocation', data.capabilities.geolocation],
      ['Notifications', data.capabilities.notifications],
      ['Vibration', data.capabilities.vibration],
      ['Camera', data.capabilities.camera],
      ['Gyroscope', data.capabilities.gyroscope],
      ['Accelerometer', data.capabilities.accelerometer],
      ['Touch Screen', data.capabilities.touchscreen],
      ['WebAssembly', data.capabilities.wasm],
      ['Clipboard API', data.capabilities.clipboard],
    ];

    el.innerHTML = caps.map(([name, val]) => {
      const supported = val && !val.includes('Not supported') && val !== 'Unknown';
      return `
        <div class="cap-card ${supported ? 'supported' : 'unsupported'}" role="listitem">
          <div class="cap-status" aria-label="${name}: ${supported ? 'supported' : 'not supported'}">
            <span class="cap-dot" aria-hidden="true"></span>
          </div>
          <div class="cap-name">${name}</div>
          <div class="cap-val">${val || 'Unknown'}</div>
        </div>
      `;
    }).join('');
  };

  const renderAdvancedInfo = (data) => {
    const el = document.getElementById('advancedInfo');
    if (!el) return;

    const uaStr = data.ua.raw.length > 100 ? data.ua.raw.substring(0, 100) + '...' : data.ua.raw;
    el.innerHTML = `
      <div class="advanced-block">
        <h4>User Agent String</h4>
        <code class="ua-string" title="${data.ua.raw}">${uaStr}</code>
        <button class="copy-btn" onclick="navigator.clipboard.writeText('${data.ua.raw.replace(/'/g, "\\'")}').then(()=>this.textContent='Copied!')" aria-label="Copy user agent string">Copy Full UA</button>
      </div>
      <div class="advanced-block">
        <h4>Detection Timestamp</h4>
        <code>${new Date(data.timestamp).toLocaleString()}</code>
      </div>
      <div class="advanced-block">
        <h4>Raw JSON Data</h4>
        <button class="copy-btn" onclick="UI.copyRawJSON()" aria-label="Copy raw JSON detection data">Copy JSON</button>
      </div>
    `;
  };

  const copyResults = () => {
    if (!detectionData) return;
    const d = detectionData;
    const text = `=== WhatPhone Device Report ===
Brand: ${d.ua.brand}
Model: ${d.ua.model}
OS: ${d.ua.os} ${d.ua.osVersion}
Browser: ${d.ua.browser} ${d.ua.browserVersion}
Device Type: ${d.ua.deviceType}
Screen: ${d.screen.physicalResolution}
CPU Cores: ${d.hardware.cores}
RAM: ${d.hardware.memory}
Network: ${d.network.effectiveType}
Battery: ${d.hardware.batteryLevel || 'N/A'}
Generated: ${new Date().toLocaleString()}
Source: whatphone.github.io`;
    navigator.clipboard.writeText(text).then(() => {
      showToast('📋 Report copied to clipboard!');
    });
  };

  const shareResults = async () => {
    if (!detectionData) return;
    const d = detectionData;
    if (navigator.share) {
      await navigator.share({
        title: 'My Phone Info - WhatPhone',
        text: `My device: ${d.ua.brand} ${d.ua.model} running ${d.ua.os} ${d.ua.osVersion}`,
        url: 'https://whatphone.github.io'
      });
    } else {
      navigator.clipboard.writeText('https://whatphone.github.io');
      showToast('🔗 Link copied to clipboard!');
    }
  };

  const downloadReport = () => {
    if (!detectionData) return;
    const blob = new Blob([JSON.stringify(detectionData, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `whatphone-report-${Date.now()}.json`;
    a.click();
    showToast('📥 Report downloaded!');
  };

  const copyRawJSON = () => {
    if (!detectionData) return;
    navigator.clipboard.writeText(JSON.stringify(detectionData, null, 2));
    showToast('📋 JSON copied!');
  };

  const showToast = (msg) => {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    t.setAttribute('role', 'status');
    t.setAttribute('aria-live', 'polite');
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 2500);
  };

  return { render, switchTab, copyResults, shareResults, downloadReport, copyRawJSON };
})();

// ── Animations & Scroll ──────────────────────────────────────────────────────
const Animations = (() => {
  const init = () => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('[data-animate]').forEach(el => obs.observe(el));

    // Stagger children
    document.querySelectorAll('[data-stagger]').forEach(parent => {
      const children = parent.children;
      Array.from(children).forEach((child, i) => {
        child.style.animationDelay = `${i * 0.08}s`;
        child.setAttribute('data-animate', '');
        obs.observe(child);
      });
    });

    // Counter animations
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

    // Parallax on hero
    window.addEventListener('scroll', () => {
      const hero = document.querySelector('.hero-visual');
      if (hero) {
        const y = window.scrollY * 0.3;
        hero.style.transform = `translateY(${y}px)`;
      }
    }, { passive: true });
  };

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'));
    const duration = 1500;
    const start = performance.now();
    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  return { init };
})();

// ── App Init ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  Header.render();
  Footer.render();
  UI.render();
  Animations.init();
});
