// Footer Component
const Footer = (() => {
  const render = () => {
    const footer = document.getElementById('site-footer');
    if (!footer) return;

    const year = new Date().getFullYear();

    footer.innerHTML = `
      <div class="footer-glow" aria-hidden="true"></div>
      <div class="footer-inner">
        <div class="footer-top">
          <div class="footer-brand">
            <a href="/" class="footer-logo" aria-label="WhatPhone Home">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect x="6" y="1" width="16" height="26" rx="3" stroke="currentColor" stroke-width="2"/>
                <circle cx="14" cy="23" r="1.5" fill="currentColor"/>
                <line x1="10" y1="4" x2="18" y2="4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <rect x="9" y="7" width="10" height="7" rx="1" fill="currentColor" opacity="0.3"/>
              </svg>
              <span>What<strong>Mobile</strong></span>
            </a>
            <p class="footer-tagline">Instant mobile device identification. Know your phone, know your specs.</p>
            <div class="footer-badges">
              <span class="badge"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 1l1.24 2.52L10 3.82l-2 1.95.47 2.74L6 7.15 3.53 8.51 4 5.77 2 3.82l2.76-.3L6 1z" fill="currentColor"/></svg> Free Forever</span>
              <span class="badge">🔒 No Data Stored</span>
              <span class="badge">⚡ Instant Results</span>
            </div>
          </div>

          <nav class="footer-nav" aria-label="Footer navigation">
            <div class="footer-col">
              <h3 class="footer-col-title">Detection</h3>
              <ul role="list">
                <li><a href="/#detect">Detect My Phone</a></li>
                <li><a href="/#specs">View Full Specs</a></li>
                <li><a href="/#compare">Compare Devices</a></li>
                <li><a href="/#advanced">Advanced Info</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h3 class="footer-col-title">Information</h3>
              <ul role="list">
                <li><a href="/#features">Features</a></li>
                <li><a href="/#how-it-works">How It Works</a></li>
                <li><a href="/#faq">FAQ</a></li>
                <li><a href="/#compatibility">Compatibility</a></li>
                <li><a href="/guides">Guides</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h3 class="footer-col-title">Legal</h3>
              <ul role="list">
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/terms">Terms of Use</a></li>
                <li><a href="/cookies">Cookies Policy</a></li>
                <li><a href="/sitemap.xml">Sitemap</a></li>
              </ul>
            </div>
          </nav>
        </div>

        <div class="footer-bottom">
          <p class="footer-copy">&copy; ${year} WhatPhone.github.io &mdash; All rights reserved.</p>
          <p class="footer-note">Detection uses browser APIs only. No personal data is transmitted or stored.</p>
        </div>
      </div>
    `;
  };

  return { render };
})();
