// Header Component
const Header = (() => {
  const render = () => {
    const header = document.getElementById('site-header');
    if (!header) return;

    header.innerHTML = `
      <nav class="navbar" role="navigation" aria-label="Main navigation">
        <div class="nav-inner">
          <a href="/" class="nav-logo" aria-label="What Phone - Home">
            <span class="logo-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect x="6" y="1" width="16" height="26" rx="3" stroke="currentColor" stroke-width="2"/>
                <circle cx="14" cy="23" r="1.5" fill="currentColor"/>
                <line x1="10" y1="4" x2="18" y2="4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <rect x="9" y="7" width="10" height="7" rx="1" fill="currentColor" opacity="0.3"/>
                <path d="M9 16h4M9 18h6" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="logo-text">What<span class="accent">Phone</span></span>
          </a>

          <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="navMenu" aria-label="Toggle navigation menu">
            <span></span><span></span><span></span>
          </button>

          <ul class="nav-links" id="navMenu" role="list">
            <li><a href="/" class="nav-link" data-section="detect">Home</a></li>
            <li><a href="/#features" class="nav-link" data-section="features">Features</a></li>
            <li><a href="/#specs" class="nav-link" data-section="specs">Specs</a></li>
            <li><a href="/#compare" class="nav-link" data-section="compare">Compare</a></li>
            <li><a href="/#faq" class="nav-link" data-section="faq">FAQ</a></li>
            <li><a href="/guides">Guides</a></li>
            <li><a href="/about">About</a></li>
            <li>
              <a href="/#detect" class="nav-cta" aria-label="Detect my phone now">
                <span>Detect My Phone</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    `;

    initNav();
  };

  const initNav = () => {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    const header = document.getElementById('site-header');

    // Mobile toggle
    toggle?.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      menu?.classList.toggle('open');
      toggle.classList.toggle('active');
    });

    // Scroll effect
    let lastY = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > 60) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
      if (y > lastY && y > 200) {
        header?.classList.add('hidden');
      } else {
        header?.classList.remove('hidden');
      }
      lastY = y;
    }, { passive: true });

    // Active section highlight
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-link');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(link => link.classList.remove('active'));
          const active = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
          active?.classList.add('active');
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(s => observer.observe(s));

    // Close menu on link click
    menu?.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle?.classList.remove('active');
        toggle?.setAttribute('aria-expanded', 'false');
      });
    });
  };

  return { render };
})();
