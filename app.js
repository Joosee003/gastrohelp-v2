(() => {
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-button');
  const mobileMenu = document.querySelector('.mobile-menu');
  const glow = document.querySelector('.cursor-glow');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const closeMenu = () => {
    mobileMenu?.classList.remove('open');
    mobileMenu?.setAttribute('aria-hidden', 'true');
    menuButton?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  menuButton?.addEventListener('click', () => {
    const open = !mobileMenu?.classList.contains('open');
    mobileMenu?.classList.toggle('open', open);
    mobileMenu?.setAttribute('aria-hidden', String(!open));
    menuButton.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  });

  mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  if (!reduceMotion && glow && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', (event) => {
      glow.style.transform = `translate(${event.clientX - 210}px, ${event.clientY - 210}px)`;
    }, { passive: true });
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

  document.querySelectorAll('.reveal').forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    revealObserver.observe(element);
  });

  const formatNumber = (value, element) => {
    const prefix = element.dataset.prefix || '';
    const suffix = element.dataset.suffix || '';
    return `${prefix}${Math.round(value).toLocaleString('es-ES')}${suffix}`;
  };

  const animateCounter = (element) => {
    if (element.dataset.animated === 'true') return;
    element.dataset.animated = 'true';
    const target = Number(element.dataset.count || 0);
    const start = performance.now();
    const duration = 1100;
    const frame = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = formatNumber(target * eased, element);
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  }, { threshold: 0.55 });
  document.querySelectorAll('[data-count]').forEach((element) => counterObserver.observe(element));

  const moduleData = {
    reservas: {
      label: 'RESERVAS Y SALA',
      title: 'Controla cada turno antes de que empiece.',
      text: 'Reúne reservas web, WhatsApp y manuales. Visualiza ocupación, estados, mesas y disponibilidad desde una única vista.',
      list: ['Calendario y vista diaria', 'Estados y confirmaciones', 'Control de mesas y aforo'],
      visual: `<div class="calendar-ui"><div class="calendar-head"><strong>Reservas · Viernes</strong><span>18 confirmadas</span></div><div class="calendar-row"><b>13:30</b><div><strong>Laura M.</strong><small>4 personas · Mesa 6</small></div><span class="badge blue">Confirmada</span></div><div class="calendar-row"><b>14:00</b><div><strong>Carlos R.</strong><small>2 personas · Terraza</small></div><span class="badge cyan">Web</span></div><div class="calendar-row"><b>21:00</b><div><strong>Marta P.</strong><small>6 personas · Mesa 12</small></div><span class="badge blue">Confirmada</span></div><div class="occupancy"><div><span>Ocupación prevista</span><strong>78%</strong></div><div class="occupancy-bar"><i></i></div></div></div>`
    },
    clientes: {
      label: 'GESTIÓN DE CLIENTES', title: 'Convierte cada visita en información útil.',
      text: 'Consulta el historial de cada cliente, su frecuencia, gasto, preferencias y actividad para saber quién vuelve y quién necesita atención.',
      list: ['Historial y recurrencia', 'Segmentación por actividad', 'Ficha completa de cliente'],
      visual: `<div class="calendar-ui"><div class="calendar-head"><strong>Clientes destacados</strong><span>1.284 activos</span></div><div class="calendar-row"><b>VIP</b><div><strong>Ana González</strong><small>12 visitas · 684 € acumulados</small></div><span class="badge blue">Recurrente</span></div><div class="calendar-row"><b>04</b><div><strong>Javier Costa</strong><small>Última visita hace 8 días</small></div><span class="badge cyan">Activo</span></div><div class="calendar-row"><b>01</b><div><strong>María López</strong><small>Cliente nuevo · Web</small></div><span class="badge blue">Nuevo</span></div><div class="occupancy"><div><span>Tasa de recurrencia</span><strong>68%</strong></div><div class="occupancy-bar"><i style="width:68%"></i></div></div></div>`
    },
    fidelizacion: {
      label: 'FIDELIZACIÓN', title: 'Haz que volver sea la opción más fácil.',
      text: 'Crea puntos, niveles, recompensas y cupones para mantener la relación con el cliente después de cada visita.',
      list: ['Puntos y recompensas', 'Cupones personalizados', 'Niveles y ventajas'],
      visual: `<div class="calendar-ui"><div class="calendar-head"><strong>Programa de fidelización</strong><span>Activo</span></div><div class="calendar-row"><b>★</b><div><strong>Nivel Oro</strong><small>182 clientes · 8% de ventaja</small></div><span class="badge blue">Top</span></div><div class="calendar-row"><b>15%</b><div><strong>Cupón de retorno</strong><small>54 canjes este mes</small></div><span class="badge cyan">Automático</span></div><div class="calendar-row"><b>2x</b><div><strong>Puntos entre semana</strong><small>Martes y miércoles</small></div><span class="badge blue">Activo</span></div><div class="occupancy"><div><span>Clientes que repiten</span><strong>68%</strong></div><div class="occupancy-bar"><i style="width:68%"></i></div></div></div>`
    },
    camarero: {
      label: 'CAMARERO DIGITAL', title: 'Carta QR, pedidos y cocina conectados.',
      text: 'El cliente escanea el QR de su mesa, consulta la carta y envía su pedido. Cocina recibe la comanda y el equipo controla el estado.',
      list: ['Carta QR por mesa', 'Pedidos directos a cocina', 'Productos, categorías y alérgenos'],
      visual: `<div class="calendar-ui"><div class="calendar-head"><strong>Pedidos en cocina</strong><span>6 activos</span></div><div class="calendar-row"><b>M08</b><div><strong>Pedido #1042</strong><small>2 entrantes · 2 principales</small></div><span class="badge blue">Preparando</span></div><div class="calendar-row"><b>M03</b><div><strong>Pedido #1041</strong><small>1 principal · 2 bebidas</small></div><span class="badge cyan">Nuevo</span></div><div class="calendar-row"><b>M12</b><div><strong>Pedido #1039</strong><small>3 postres</small></div><span class="badge blue">Listo</span></div><div class="occupancy"><div><span>Tiempo medio de preparación</span><strong>11 min</strong></div><div class="occupancy-bar"><i style="width:72%"></i></div></div></div>`
    },
    rentabilidad: {
      label: 'RENTABILIDAD', title: 'Conoce el margen real de cada plato.',
      text: 'Relaciona ingredientes, costes, precios y ventas para detectar qué productos impulsan el margen y cuáles necesitan revisión.',
      list: ['Coste por ingrediente', 'Margen por plato', 'Ventas y rendimiento de carta'],
      visual: `<div class="calendar-ui"><div class="calendar-head"><strong>Rentabilidad de carta</strong><span>Este mes</span></div><div class="calendar-row"><b>72%</b><div><strong>Arroz meloso</strong><small>Margen alto · 84 ventas</small></div><span class="badge blue">Estrella</span></div><div class="calendar-row"><b>64%</b><div><strong>Secreto ibérico</strong><small>Margen estable · 61 ventas</small></div><span class="badge cyan">Rentable</span></div><div class="calendar-row"><b>42%</b><div><strong>Tartar de atún</strong><small>Coste elevado · revisar</small></div><span class="badge blue">Atención</span></div><div class="occupancy"><div><span>Margen medio de la carta</span><strong>68,4%</strong></div><div class="occupancy-bar"><i style="width:68.4%"></i></div></div></div>`
    },
    resenas: {
      label: 'REPUTACIÓN', title: 'Convierte la experiencia en más confianza.',
      text: 'Organiza reseñas, detecta pendientes y facilita un seguimiento constante para que la reputación no dependa de la casualidad.',
      list: ['Seguimiento de reseñas', 'Estados y respuestas', 'Visión de reputación'],
      visual: `<div class="calendar-ui"><div class="calendar-head"><strong>Reputación online</strong><span>4,8 / 5</span></div><div class="calendar-row"><b>5★</b><div><strong>“Servicio excelente”</strong><small>Google · hace 2 horas</small></div><span class="badge blue">Nueva</span></div><div class="calendar-row"><b>4★</b><div><strong>“Volveremos pronto”</strong><small>Google · ayer</small></div><span class="badge cyan">Respondida</span></div><div class="calendar-row"><b>5★</b><div><strong>“La carta nos encantó”</strong><small>Web · hace 3 días</small></div><span class="badge blue">Publicada</span></div><div class="occupancy"><div><span>Reseñas positivas</span><strong>94%</strong></div><div class="occupancy-bar"><i style="width:94%"></i></div></div></div>`
    }
  };

  const moduleLabel = document.getElementById('moduleLabel');
  const moduleTitle = document.getElementById('moduleTitle');
  const moduleText = document.getElementById('moduleText');
  const moduleList = document.getElementById('moduleList');
  const moduleVisual = document.getElementById('moduleVisual');

  document.querySelectorAll('.module-tab').forEach((button) => {
    button.addEventListener('click', () => {
      const data = moduleData[button.dataset.module];
      if (!data || !moduleVisual) return;
      document.querySelectorAll('.module-tab').forEach((tab) => {
        const active = tab === button;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-selected', String(active));
      });
      moduleVisual.classList.add('changing');
      window.setTimeout(() => {
        if (moduleLabel) moduleLabel.textContent = data.label;
        if (moduleTitle) moduleTitle.textContent = data.title;
        if (moduleText) moduleText.textContent = data.text;
        if (moduleList) moduleList.innerHTML = data.list.map((item) => `<li>${item}</li>`).join('');
        moduleVisual.innerHTML = data.visual;
        moduleVisual.classList.remove('changing');
      }, 180);
    });
  });

  document.querySelectorAll('.magnetic').forEach((button) => {
    if (reduceMotion || !window.matchMedia('(pointer:fine)').matches) return;
    button.addEventListener('pointermove', (event) => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.12;
      button.style.transform = `translate(${x}px, ${y - 2}px)`;
    });
    button.addEventListener('pointerleave', () => { button.style.transform = ''; });
  });

  if (!reduceMotion) {
    const parallax = document.querySelector('[data-parallax]');
    window.addEventListener('scroll', () => {
      if (!parallax || window.innerWidth < 900) return;
      const factor = Number(parallax.dataset.parallax || 0);
      parallax.style.transform = `translateY(${window.scrollY * factor}px)`;
    }, { passive: true });
  }

  document.querySelectorAll('.faq-list details').forEach((detail) => {
    detail.addEventListener('toggle', () => {
      if (!detail.open) return;
      document.querySelectorAll('.faq-list details').forEach((other) => { if (other !== detail) other.open = false; });
    });
  });

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
