(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const track = (name) => window.GHAnalytics?.track(name);
  const menuButton = $('.menu-toggle');
  const menu = $('#mobile-nav');
  const setMenu = (open) => {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.hidden = !open;
  };
  menuButton?.addEventListener('click', () => setMenu(menu.hidden));
  menu?.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu && !menu.hidden) {
      setMenu(false);
      menuButton.focus();
    }
  });
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.12 });
    document.documentElement.classList.add('js-motion');
    document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
  }

  const screens = {
    dashboard: {
      label: 'Vista general', number: '01',
      title: 'Empieza el servicio sabiendo qué toca.',
      description: 'Consulta tus reservas y las acciones pendientes desde la vista general del restaurante.',
      image: '/assets/dashboard-demo.jpg',
      alt: 'Vista general real del panel de GastroHelp con datos del restaurante demo'
    },
    reservas: {
      label: 'Reservas', number: '02',
      title: 'Cada reserva, con su sitio y su estado.',
      description: 'Revisa el calendario, el número de comensales y los turnos desde la gestión de reservas.',
      image: '/assets/reservas-demo.jpg',
      alt: 'Calendario real de reservas de GastroHelp en el restaurante demo'
    },
    restaurante: {
      label: 'Web del restaurante', number: '03',
      title: 'La experiencia empieza antes de llegar.',
      description: 'Una web propia con carta, ambiente y acceso a reservar. Descubre La Reserva desde el enlace de abajo.',
      image: '/assets/restaurante-demo.jpg',
      alt: 'Web publicada de La Reserva, un restaurante ficticio para mostrar el diseño de GastroHelp'
    }
  };
  let currentScreen = 'dashboard';
  const setLiveLink = (link, key) => {
    const restaurant = key === 'restaurante';
    link.href = restaurant ? 'https://panel.gastrohelp.es/restaurante/la-reserva-demo' : 'https://panel.gastrohelp.es/demo';
    link.textContent = restaurant ? 'Abrir la web de La Reserva ↗' : 'Entrar en la demo completa ↗';
    link.dataset.track = restaurant ? 'OpenRestaurantDemo' : 'OpenDemo';
  };
  const tabs = [...document.querySelectorAll('[data-demo]')];
  const selectScreen = (key) => {
    const screen = screens[key];
    if (!screen) return;
    currentScreen = key;
    tabs.forEach((tab) => {
      const active = tab.dataset.demo === key;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    $('#demo-panel').setAttribute('aria-labelledby', `tab-${key}`);
    $('#screen-number').textContent = screen.number;
    $('#screen-title').textContent = screen.title;
    $('#screen-description').textContent = screen.description;
    $('#demo-image').src = screen.image;
    $('#demo-image').alt = screen.alt;
    setLiveLink($('#demo-live-link'), key);
    track('ExploreDemo');
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectScreen(tab.dataset.demo));
    tab.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      tabs[next].focus();
      selectScreen(tabs[next].dataset.demo);
    });
  });
  const dialog = $('#screen-dialog');
  let screenOpener;
  document.querySelectorAll('[data-screen]').forEach((button) => {
    button.addEventListener('click', () => {
      const screen = screens[button.dataset.screen === 'current' ? currentScreen : button.dataset.screen];
      $('#large-screen').src = screen.image;
      $('#large-screen').alt = screen.alt;
      $('#screen-dialog-title').textContent = screen.label;
      setLiveLink($('#dialog-live-link'), button.dataset.screen === 'current' ? currentScreen : button.dataset.screen);
      screenOpener = button;
      dialog.showModal();
      document.body.classList.add('dialog-open');
      $('.dialog-image-wrap').scrollTo(0, 0);
      track('ExpandDemo');
    });
  });
  $('[data-close-screen]')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog?.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    screenOpener?.focus({ preventScroll: true });
  });
  document.querySelectorAll('[data-track]').forEach((element) => {
    element.addEventListener('click', () => track(element.dataset.track));
  });

  const form = $('#lead-form');
  const startedAt = Date.now();
  const requestId = window.crypto?.randomUUID?.() || `gh-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  let sending = false;
  let submitted = false;
  const feedback = $('#form-feedback');
  form?.addEventListener('input', (event) => event.target.removeAttribute('aria-invalid'));
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending || submitted) return;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());
    ['name', 'restaurant', 'address', 'phone', 'email'].forEach((key) => payload[key] = String(payload[key] || '').trim());
    payload.privacy = data.get('privacy') === 'on';
    payload.startedAt = startedAt;
    payload.requestId = requestId;
    const errors = {
      name: payload.name.length < 2 || payload.name.length > 100,
      restaurant: payload.restaurant.length < 2 || payload.restaurant.length > 140,
      address: payload.address.length < 5 || payload.address.length > 220,
      phone: !/^[+\d\s().-]+$/.test(payload.phone) || payload.phone.replace(/\D/g, '').length < 7 || payload.phone.replace(/\D/g, '').length > 15,
      email: !/^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/.test(payload.email) || payload.email.length > 180,
      privacy: !payload.privacy
    };
    let firstInvalid;
    Object.entries(errors).forEach(([name, invalid]) => {
      const field = form.elements.namedItem(name);
      field.setAttribute('aria-invalid', String(invalid));
      if (invalid && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) {
      feedback.textContent = 'Revisa los campos marcados y acepta la política de privacidad para enviar la solicitud.';
      firstInvalid.focus();
      return;
    }
    const endpoint = window.GH_MARKETING?.leadEndpoint;
    if (!endpoint) {
      feedback.textContent = 'El formulario no está disponible ahora. Escríbenos por WhatsApp y te atendemos.';
      return;
    }
    sending = true;
    const button = $('.form-submit');
    button.disabled = true;
    button.querySelector('span').textContent = 'Enviando tu solicitud…';
    feedback.textContent = '';
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        credentials: 'omit', body: JSON.stringify(payload), signal: controller.signal
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true || result.requestId !== requestId) {
        throw new Error(result.message || 'No se ha podido confirmar el envío. Tus datos siguen aquí; vuelve a intentarlo o escríbenos por WhatsApp.');
      }
      submitted = true;
      form.hidden = true;
      const success = $('#form-success');
      success.hidden = false;
      success.focus({ preventScroll: true });
      success.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
      track('Lead');
    } catch (error) {
      feedback.textContent = error.name === 'AbortError'
        ? 'No hemos podido confirmar el envío a tiempo. Tus datos siguen aquí. Puedes volver a intentarlo o escribirnos por WhatsApp.'
        : (error instanceof TypeError ? 'No se ha podido conectar. Revisa tu conexión o escríbenos por WhatsApp; tus datos siguen aquí.' : error.message);
    } finally {
      window.clearTimeout(timeout);
      sending = false;
      button.disabled = false;
      button.querySelector('span').textContent = 'Quiero mi análisis gratuito';
    }
  });
  $('#year').textContent = String(new Date().getFullYear());
})();
