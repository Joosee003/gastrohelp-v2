(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.gh-header, .site-header, .header');
  const menuButton = document.querySelector('.gh-menu-button, .menu-button, .menu');
  const mobileMenu = document.querySelector('.gh-mobile-menu, .mobile-menu, .mobile');
  const progress = document.querySelector('.gh-progress span, .scroll-progress span, .progress i');

  const closeMenu = () => {
    mobileMenu?.classList.remove('open');
    mobileMenu?.setAttribute('aria-hidden', 'true');
    menuButton?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('gh-menu-open', 'menu-open');
  };

  const openMenu = () => {
    mobileMenu?.classList.add('open');
    mobileMenu?.setAttribute('aria-hidden', 'false');
    menuButton?.classList.add('open');
    menuButton?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('gh-menu-open');
  };

  menuButton?.addEventListener('click', () => {
    mobileMenu?.classList.contains('open') ? closeMenu() : openMenu();
  });
  mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 900) closeMenu(); }, { passive: true });

  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.gh-nav-links a, .desktop-nav a, .links a')];
  let scrollFrame = 0;
  const updateScrollUi = () => {
    scrollFrame = 0;
    const top = window.scrollY;
    header?.classList.toggle('scrolled', top > 24);
    if (progress) {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      progress.style.width = `${Math.min((top / max) * 100, 100)}%`;
    }
    let activeId = '';
    sections.forEach((section) => { if (section.offsetTop - 180 <= top) activeId = section.id; });
    navLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${activeId}`;
      link.classList.toggle('active', active);
      active ? link.setAttribute('aria-current', 'page') : link.removeAttribute('aria-current');
    });
  };
  const requestScrollUpdate = () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(updateScrollUi);
  };
  updateScrollUi();
  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('pageshow', updateScrollUi);

  const revealItems = document.querySelectorAll('.gh-reveal, .reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((element) => element.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -32px' });
    revealItems.forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`;
      revealObserver.observe(element);
    });
  }

  document.querySelectorAll('.gh-faq-list details, .faq-list details, .article-faq details').forEach((detail) => {
    detail.addEventListener('toggle', () => {
      if (!detail.open) return;
      const group = detail.closest('.gh-faq-list, .faq-list, .article-faq');
      group?.querySelectorAll('details').forEach((other) => { if (other !== detail) other.open = false; });
    });
  });

  document.querySelectorAll('a[href="https://panel.gastrohelp.es/login"],a[href="https://panel.gastrohelp.es/login/"]').forEach((link) => {
    link.setAttribute('href', 'https://panel.gastrohelp.es/login?from=website');
  });

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
