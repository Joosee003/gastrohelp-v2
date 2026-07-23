(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu');
  const mobileMenu = document.querySelector('.mobile');
  const progress = document.querySelector('.progress span');

  const closeMenu = () => {
    mobileMenu?.classList.remove('open');
    mobileMenu?.setAttribute('aria-hidden', 'true');
    menuButton?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };
  const openMenu = () => {
    mobileMenu?.classList.add('open');
    mobileMenu?.setAttribute('aria-hidden', 'false');
    menuButton?.classList.add('open');
    menuButton?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  };
  menuButton?.addEventListener('click', () => mobileMenu?.classList.contains('open') ? closeMenu() : openMenu());
  mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 900) closeMenu(); }, { passive: true });

  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.desktop-nav a')];
  let frame = 0;
  const updateScroll = () => {
    frame = 0;
    const top = window.scrollY;
    header?.classList.toggle('scrolled', top > 24);
    if (progress) {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      progress.style.width = `${Math.min((top / max) * 100, 100)}%`;
    }
    let activeId = '';
    sections.forEach((section) => { if (section.offsetTop - 180 <= top) activeId = section.id; });
    navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`));
  };
  const onScroll = () => {
    if (frame) return;
    frame = requestAnimationFrame(updateScroll);
  };
  updateScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const revealItems = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((element) => element.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px' });
    revealItems.forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(index % 4, 3) * 50}ms`;
      observer.observe(element);
    });
  }

  document.querySelectorAll('.faq-list details').forEach((detail) => {
    detail.addEventListener('toggle', () => {
      if (!detail.open) return;
      detail.parentElement?.querySelectorAll('details').forEach((other) => { if (other !== detail) other.open = false; });
    });
  });

  const cookieBanner = document.getElementById('cookie-banner');
  const cookieSettings = document.getElementById('cookie-settings');
  const consentKey = 'gastrohelp-cookie-consent-v1';
  const showCookieBanner = () => {
    cookieBanner?.classList.add('show');
    cookieBanner?.setAttribute('aria-hidden', 'false');
  };
  const hideCookieBanner = () => {
    cookieBanner?.classList.remove('show');
    cookieBanner?.setAttribute('aria-hidden', 'true');
  };
  const saveConsent = (value) => {
    localStorage.setItem(consentKey, JSON.stringify({ value, date: new Date().toISOString() }));
    hideCookieBanner();
    window.dispatchEvent(new CustomEvent('gastrohelp:cookie-consent', { detail: value }));
  };
  if (cookieBanner && !localStorage.getItem(consentKey)) window.setTimeout(showCookieBanner, 500);
  cookieBanner?.querySelector('[data-cookie="accept"]')?.addEventListener('click', () => saveConsent('all'));
  cookieBanner?.querySelector('[data-cookie="reject"]')?.addEventListener('click', () => saveConsent('necessary'));
  cookieSettings?.addEventListener('click', showCookieBanner);

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();