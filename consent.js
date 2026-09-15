(() => {
  'use strict';
  const key = 'gastrohelp-consent-v2';
  const maxAge = 180 * 24 * 60 * 60 * 1000;
  const pixelId = String(window.GH_MARKETING?.pixelId || '');
  const configured = /^\d{10,20}$/.test(pixelId);
  let consent = null;
  let initialized = false;
  let pageViewed = false;
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved && ['accept', 'reject'].includes(saved.choice) && Number.isFinite(saved.timestamp) && Date.now() - saved.timestamp >= 0 && Date.now() - saved.timestamp < maxAge) consent = saved.choice;
  } catch { /* Browsing remains available when storage is restricted. */ }
  let banner = document.getElementById('consent-banner');
  if (!banner) {
    banner = document.createElement('section');
    banner.id = 'consent-banner';
    banner.className = 'consent-banner';
    banner.hidden = true;
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Preferencias de cookies');
    banner.innerHTML = '<div><h2>Tú decides sobre tus cookies.</h2><p>Usamos almacenamiento necesario. Con tu permiso, el píxel de Meta mide visitas y solicitudes para valorar nuestros anuncios. <a href="/cookies">Más información</a></p></div><div class="consent-actions"><button data-consent="reject">Rechazar</button><button data-consent="accept">Aceptar</button></div>';
    document.body.append(banner);
  }
  if (!configured) {
    banner.querySelector('p').innerHTML = 'Ahora solo usamos almacenamiento necesario para recordar tus preferencias. La medición publicitaria está desactivada. <a href="/cookies">Más información</a>';
  }
  const loadPixel = () => {
    if (!configured || consent !== 'accept') return;
    if (!window.fbq) {
      const fbq = function () { fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments); };
      window.fbq = fbq;
      window._fbq = fbq;
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = '2.0';
      fbq.queue = [];
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      script.referrerPolicy = 'strict-origin-when-cross-origin';
      document.head.append(script);
    }
    window.fbq('consent', 'grant');
    if (!initialized) {
      window.fbq('set', 'autoConfig', false, pixelId);
      window.fbq('init', pixelId);
      initialized = true;
    }
    if (!pageViewed) {
      window.fbq('track', 'PageView');
      pageViewed = true;
    }
  };
  const revoke = () => {
    window.fbq?.('consent', 'revoke');
    const domains = ['', location.hostname, `.${location.hostname}`, 'gastrohelp.es', '.gastrohelp.es'];
    for (const name of ['_fbp', '_fbc']) for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${domain ? `; Domain=${domain}` : ''}`;
    }
  };
  const choose = (choice) => {
    consent = choice;
    try { localStorage.setItem(key, JSON.stringify({ choice, timestamp: Date.now() })); } catch { /* Keep the in-memory choice. */ }
    banner.hidden = true;
    if (choice === 'accept') loadPixel();
    else revoke();
  };
  banner.querySelectorAll('[data-consent]').forEach((button) => button.addEventListener('click', () => choose(button.dataset.consent)));
  document.querySelectorAll('[data-cookie-settings], #cookie-settings').forEach((button) => button.addEventListener('click', (event) => {
    event.preventDefault();
    banner.hidden = false;
    banner.querySelector('button').focus({ preventScroll: true });
  }));
  const allowed = new Set(['Lead', 'DemoInterest', 'OpenDemo', 'OpenRestaurantDemo', 'ContactWhatsApp', 'ExploreDemo', 'ExpandDemo']);
  window.GHAnalytics = Object.freeze({
    track(name) {
      if (consent !== 'accept' || !configured || !allowed.has(name)) return;
      loadPixel();
      window.fbq(name === 'Lead' ? 'track' : 'trackCustom', name);
    }
  });
  if (consent === 'accept') loadPixel();
  if (consent === 'reject') revoke();
  if (!consent && configured) banner.hidden = false;
})();
