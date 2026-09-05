// Header Component — Universal Multi-Language with Language Selector
const Header = (() => {
  // ── Translation Dictionary ──────────────────────────────
  const translations = {
    en: {
      logo: 'What<span class="accent">Phone</span>',
      home: 'Home',
      allTools: 'All Tools',
      cameraTest: 'Camera Test',
      micTest: 'Mic Test',
      touchscreenTest: 'Touchscreen Test',
      speakerTest: 'Speaker Test',
      guides: 'Guides',
      detectCta: 'Detect My Phone',
      toggleLabel: 'Toggle navigation menu',
    },
    de: {
      logo: 'What<span class="accent">Phone</span>',
      home: 'Startseite',
      allTools: 'Alle Tools',
      cameraTest: 'Kamera-Test',
      micTest: 'Mikrofon-Test',
      touchscreenTest: 'Touchscreen-Test',
      speakerTest: 'Lautsprecher-Test',
      guides: 'Anleitungen',
      detectCta: 'Mein Handy erkennen',
      toggleLabel: 'Navigationsmenü umschalten',
    },
    fr: {
      logo: 'What<span class="accent">Phone</span>',
      home: 'Accueil',
      allTools: 'Tous les outils',
      cameraTest: 'Test Caméra',
      micTest: 'Test Micro',
      touchscreenTest: 'Test Écran Tactile',
      speakerTest: 'Test Haut-Parleur',
      guides: 'Guides',
      detectCta: 'Détecter mon téléphone',
      toggleLabel: 'Basculer le menu de navigation',
    },
    es: {
      logo: 'What<span class="accent">Phone</span>',
      home: 'Inicio',
      allTools: 'Todas las herramientas',
      cameraTest: 'Prueba de Cámara',
      micTest: 'Prueba de Micrófono',
      touchscreenTest: 'Prueba de Pantalla Táctil',
      speakerTest: 'Prueba de Altavoz',
      guides: 'Guías',
      detectCta: 'Detectar mi teléfono',
      toggleLabel: 'Alternar menú de navegación',
    },
    it: {
      logo: 'What<span class="accent">Phone</span>',
      home: 'Home',
      allTools: 'Tutti gli strumenti',
      cameraTest: 'Test Fotocamera',
      micTest: 'Test Microfono',
      touchscreenTest: 'Test Schermo Tattile',
      speakerTest: 'Test Altoparlante',
      guides: 'Guide',
      detectCta: 'Rileva il mio telefono',
      toggleLabel: 'Attiva/disattiva menu di navigazione',
    },
  };

  // ── Language Detection ──────────────────────────────────
  const getLang = () => {
    const path = window.location.pathname;
    const match = path.match(/^\/(de|fr|es|it)\//);
    if (match) return match[1];
    return 'en';
  };

  const t = (key) => {
    const lang = getLang();
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  // ── Language Selector Options ──────────────────────────
  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  ];

  const getCurrentLang = () => {
    const path = window.location.pathname;
    const match = path.match(/^\/(de|fr|es|it)\//);
    return match ? match[1] : 'en';
  };

  // ── Render ──────────────────────────────────────────────
  const render = () => {
    const header = document.getElementById('site-header');
    if (!header) return;

    const lang = getLang();
    const langPrefix = lang === 'en' ? '' : `/${lang}`;
    const currentLang = getCurrentLang();
    const currentLangData = languages.find(l => l.code === currentLang) || languages[0];

    header.innerHTML = `
      <nav class="navbar" role="navigation" aria-label="Main navigation">
        <div class="nav-inner">
          <a href="${langPrefix}/" class="nav-logo" aria-label="${t('logo')} - Home">
            <span class="logo-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect x="6" y="1" width="16" height="26" rx="3" stroke="currentColor" stroke-width="2"/>
                <circle cx="14" cy="23" r="1.5" fill="currentColor"/>
                <line x1="10" y1="4" x2="18" y2="4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <rect x="9" y="7" width="10" height="7" rx="1" fill="currentColor" opacity="0.3"/>
                <path d="M9 16h4M9 18h6" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="logo-text">${t('logo')}</span>
          </a>

          <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="navMenu" aria-label="${t('toggleLabel')}">
            <span></span><span></span><span></span>
          </button>

          <ul class="nav-links" id="navMenu" role="list">
            <li><a href="${langPrefix}/" class="nav-link" data-section="detect">${t('home')}</a></li>
            
            <!-- Tools Dropdown -->
            <li class="nav-dropdown">
              <button class="dropdown-toggle" id="dropdownToggle" aria-expanded="false" aria-haspopup="true">
                ${t('allTools')}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" class="dropdown-arrow">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <ul class="dropdown-menu" id="dropdownMenu" role="menu">
                <li><a href="${langPrefix}/camera-test" class="dropdown-link" role="menuitem">${t('cameraTest')}</a></li>
                <li><a href="${langPrefix}/mic-test" class="dropdown-link" role="menuitem">${t('micTest')}</a></li>
                <li><a href="${langPrefix}/touchscreen-test" class="dropdown-link" role="menuitem">${t('touchscreenTest')}</a></li>
                <li><a href="${langPrefix}/speaker-test" class="dropdown-link" role="menuitem">${t('speakerTest')}</a></li>
              </ul>
            </li>
            
            <li><a href="${langPrefix}/guides" class="nav-link" data-section="">${t('guides')}</a></li>
            
            <!-- Language Selector -->
            <li class="nav-dropdown lang-selector">
              <button class="lang-toggle" id="langToggle" aria-expanded="false" aria-haspopup="true">
                <span class="lang-flag">${currentLangData.flag}</span>
                <span class="lang-code">${currentLangData.code.toUpperCase()}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" class="dropdown-arrow">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <ul class="dropdown-menu lang-dropdown" id="langMenu" role="menu">
                ${languages.map(langOption => `
                  <li>
                    <a href="${langOption.code === 'en' ? '/' : '/' + langOption.code + '/'}" 
                       class="dropdown-link ${langOption.code === currentLang ? 'active-lang' : ''}" 
                       role="menuitem"
                       data-lang="${langOption.code}">
                      <span class="lang-flag">${langOption.flag}</span>
                      <span class="lang-label">${langOption.label}</span>
                    </a>
                  </li>
                `).join('')}
              </ul>
            </li>

            <li>
              <a href="${langPrefix}/#detect" class="nav-cta" aria-label="${t('detectCta')}">
                <span>${t('detectCta')}</span>
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

  // ── Navigation Logic ────────────────────────────────────
  const initNav = () => {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    const header = document.getElementById('site-header');
    const dropdownToggle = document.getElementById('dropdownToggle');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const langToggle = document.getElementById('langToggle');
    const langMenu = document.getElementById('langMenu');

    // Mobile toggle
    toggle?.addEventListener('click', (e) => {
      e.stopPropagation();
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      menu?.classList.toggle('open');
      toggle.classList.toggle('active');
    });

    // Tools dropdown toggle
    dropdownToggle?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const expanded = dropdownToggle.getAttribute('aria-expanded') === 'true';
      dropdownToggle.setAttribute('aria-expanded', String(!expanded));
      dropdownMenu?.classList.toggle('open');
      // Close language dropdown if open
      if (langMenu?.classList.contains('open')) {
        langMenu.classList.remove('open');
        langToggle?.setAttribute('aria-expanded', 'false');
      }
    });

    // Language dropdown toggle
    langToggle?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const expanded = langToggle.getAttribute('aria-expanded') === 'true';
      langToggle.setAttribute('aria-expanded', String(!expanded));
      langMenu?.classList.toggle('open');
      // Close tools dropdown if open
      if (dropdownMenu?.classList.contains('open')) {
        dropdownMenu.classList.remove('open');
        dropdownToggle?.setAttribute('aria-expanded', 'false');
      }
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      // Close tools dropdown
      if (dropdownMenu && !e.target.closest('#dropdownToggle') && !e.target.closest('#dropdownMenu')) {
        dropdownMenu.classList.remove('open');
        dropdownToggle?.setAttribute('aria-expanded', 'false');
      }
      // Close language dropdown
      if (langMenu && !e.target.closest('#langToggle') && !e.target.closest('#langMenu')) {
        langMenu.classList.remove('open');
        langToggle?.setAttribute('aria-expanded', 'false');
      }
    });

    // Close dropdowns on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdownMenu?.classList.remove('open');
        dropdownToggle?.setAttribute('aria-expanded', 'false');
        langMenu?.classList.remove('open');
        langToggle?.setAttribute('aria-expanded', 'false');
      }
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
    const links = document.querySelectorAll('.nav-link:not(.dropdown-toggle):not(.lang-toggle)');
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

    // Close mobile menu on link click
    menu?.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle?.classList.remove('active');
        toggle?.setAttribute('aria-expanded', 'false');
        dropdownMenu?.classList.remove('open');
        dropdownToggle?.setAttribute('aria-expanded', 'false');
        langMenu?.classList.remove('open');
        langToggle?.setAttribute('aria-expanded', 'false');
      });
    });
  };

  return { render };
})();
