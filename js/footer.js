// Footer Component — Universal Multi-Language
const Footer = (() => {
  // ── Translation Dictionary ──────────────────────────────
  const translations = {
    en: {
      tagline: 'Instant mobile device identification. Know your phone, know your specs.',
      badgeFree: 'Free Forever',
      badgePrivacy: '🔒 No Data Stored',
      badgeSpeed: '⚡ Instant Results',
      detection: 'Detection',
      detectMyPhone: 'Detect My Phone',
      viewFullSpecs: 'View Full Specs',
      compareDevices: 'Compare Devices',
      advancedInfo: 'Advanced Info',
      information: 'Information',
      features: 'Features',
      howItWorks: 'How It Works',
      faq: 'FAQ',
      compatibility: 'Compatibility',
      guides: 'Guides',
      legal: 'Legal',
      about: 'About',
      contact: 'Contact',
      privacy: 'Privacy Policy',
      terms: 'Terms of Use',
      cookies: 'Cookies Policy',
      sitemap: 'Sitemap',
      copyright: 'All rights reserved.',
      privacyNote: 'Detection uses browser APIs only. No personal data is transmitted or stored.',
    },
    de: {
      tagline: 'Sofortige mobile Geräteidentifikation. Kennen Sie Ihr Handy, kennen Sie Ihre Spezifikationen.',
      badgeFree: 'Für immer kostenlos',
      badgePrivacy: '🔒 Keine Datenspeicherung',
      badgeSpeed: '⚡ Sofortige Ergebnisse',
      detection: 'Erkennung',
      detectMyPhone: 'Mein Handy erkennen',
      viewFullSpecs: 'Alle Spezifikationen anzeigen',
      compareDevices: 'Geräte vergleichen',
      advancedInfo: 'Erweiterte Informationen',
      information: 'Informationen',
      features: 'Funktionen',
      howItWorks: 'So funktioniert es',
      faq: 'FAQ',
      compatibility: 'Kompatibilität',
      guides: 'Anleitungen',
      legal: 'Rechtliches',
      about: 'Über uns',
      contact: 'Kontakt',
      privacy: 'Datenschutzerklärung',
      terms: 'Nutzungsbedingungen',
      cookies: 'Cookie-Richtlinie',
      sitemap: 'Sitemap',
      copyright: 'Alle Rechte vorbehalten.',
      privacyNote: 'Die Erkennung verwendet nur Browser-APIs. Es werden keine persönlichen Daten übertragen oder gespeichert.',
    },
    fr: {
      tagline: 'Identification instantanée de votre appareil mobile. Connaissez votre téléphone, connaissez ses spécifications.',
      badgeFree: 'Gratuit à vie',
      badgePrivacy: '🔒 Aucune donnée stockée',
      badgeSpeed: '⚡ Résultats instantanés',
      detection: 'Détection',
      detectMyPhone: 'Détecter mon téléphone',
      viewFullSpecs: 'Voir toutes les spécifications',
      compareDevices: 'Comparer les appareils',
      advancedInfo: 'Informations avancées',
      information: 'Informations',
      features: 'Fonctionnalités',
      howItWorks: 'Comment ça fonctionne',
      faq: 'FAQ',
      compatibility: 'Compatibilité',
      guides: 'Guides',
      legal: 'Mentions légales',
      about: 'À propos',
      contact: 'Contact',
      privacy: 'Politique de confidentialité',
      terms: 'Conditions d\'utilisation',
      cookies: 'Politique des cookies',
      sitemap: 'Plan du site',
      copyright: 'Tous droits réservés.',
      privacyNote: 'La détection utilise uniquement les API du navigateur. Aucune donnée personnelle n\'est transmise ou stockée.',
    },
    es: {
      tagline: 'Identificación instantánea de dispositivos móviles. Conoce tu teléfono, conoce sus especificaciones.',
      badgeFree: 'Gratis para siempre',
      badgePrivacy: '🔒 Sin almacenamiento de datos',
      badgeSpeed: '⚡ Resultados instantáneos',
      detection: 'Detección',
      detectMyPhone: 'Detectar mi teléfono',
      viewFullSpecs: 'Ver todas las especificaciones',
      compareDevices: 'Comparar dispositivos',
      advancedInfo: 'Información avanzada',
      information: 'Información',
      features: 'Características',
      howItWorks: 'Cómo funciona',
      faq: 'Preguntas frecuentes',
      compatibility: 'Compatibilidad',
      guides: 'Guías',
      legal: 'Legal',
      about: 'Acerca de',
      contact: 'Contacto',
      privacy: 'Política de privacidad',
      terms: 'Términos de uso',
      cookies: 'Política de cookies',
      sitemap: 'Mapa del sitio',
      copyright: 'Todos los derechos reservados.',
      privacyNote: 'La detección utiliza solo las API del navegador. No se transmiten ni almacenan datos personales.',
    },
  };

  // ── Language Detection ──────────────────────────────────
  const getLang = () => {
    const path = window.location.pathname;
    const match = path.match(/^\/(de|fr|es)\//);
    if (match) return match[1];
    return 'en';
  };

  const t = (key) => {
    const lang = getLang();
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  // ── Render ──────────────────────────────────────────────
  const render = () => {
    const footer = document.getElementById('site-footer');
    if (!footer) return;

    const year = new Date().getFullYear();
    const lang = getLang();
    const langPrefix = lang === 'en' ? '' : `/${lang}`;

    footer.innerHTML = `
      <div class="footer-glow" aria-hidden="true"></div>
      <div class="footer-inner">
        <div class="footer-top">
          <div class="footer-brand">
            <a href="${langPrefix}/" class="footer-logo" aria-label="WhatPhone Home">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect x="6" y="1" width="16" height="26" rx="3" stroke="currentColor" stroke-width="2"/>
                <circle cx="14" cy="23" r="1.5" fill="currentColor"/>
                <line x1="10" y1="4" x2="18" y2="4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <rect x="9" y="7" width="10" height="7" rx="1" fill="currentColor" opacity="0.3"/>
              </svg>
              <span>What<strong>Mobile</strong></span>
            </a>
            <p class="footer-tagline">${t('tagline')}</p>
            <div class="footer-badges">
              <span class="badge"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 1l1.24 2.52L10 3.82l-2 1.95.47 2.74L6 7.15 3.53 8.51 4 5.77 2 3.82l2.76-.3L6 1z" fill="currentColor"/></svg> ${t('badgeFree')}</span>
              <span class="badge">${t('badgePrivacy')}</span>
              <span class="badge">${t('badgeSpeed')}</span>
            </div>
          </div>

          <nav class="footer-nav" aria-label="Footer navigation">
            <div class="footer-col">
              <h3 class="footer-col-title">${t('detection')}</h3>
              <ul role="list">
                <li><a href="${langPrefix}/#detect">${t('detectMyPhone')}</a></li>
                <li><a href="${langPrefix}/#specs">${t('viewFullSpecs')}</a></li>
                <li><a href="${langPrefix}/#compare">${t('compareDevices')}</a></li>
                <li><a href="${langPrefix}/#advanced">${t('advancedInfo')}</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h3 class="footer-col-title">${t('information')}</h3>
              <ul role="list">
                <li><a href="${langPrefix}/#features">${t('features')}</a></li>
                <li><a href="${langPrefix}/#how-it-works">${t('howItWorks')}</a></li>
                <li><a href="${langPrefix}/#faq">${t('faq')}</a></li>
                <li><a href="${langPrefix}/#compatibility">${t('compatibility')}</a></li>
                <li><a href="${langPrefix}/guides">${t('guides')}</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h3 class="footer-col-title">${t('legal')}</h3>
              <ul role="list">
                <li><a href="${langPrefix}/about">${t('about')}</a></li>
                <li><a href="${langPrefix}/contact">${t('contact')}</a></li>
                <li><a href="${langPrefix}/privacy">${t('privacy')}</a></li>
                <li><a href="${langPrefix}/terms">${t('terms')}</a></li>
                <li><a href="${langPrefix}/cookies">${t('cookies')}</a></li>
                <li><a href="${langPrefix}/sitemap.xml">${t('sitemap')}</a></li>
              </ul>
            </div>
          </nav>
        </div>

        <div class="footer-bottom">
          <p class="footer-copy">&copy; ${year} WhatPhone.github.io &mdash; ${t('copyright')}</p>
          <p class="footer-note">${t('privacyNote')}</p>
        </div>
      </div>
    `;
  };

  return { render };
})();
