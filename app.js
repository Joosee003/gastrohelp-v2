(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer:fine)').matches;
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-button');
  const mobileMenu = document.querySelector('.mobile-menu');
  const progress = document.querySelector('.scroll-progress span');
  const glow = document.querySelector('.cursor-glow');

  const closeMenu = () => {
    mobileMenu?.classList.remove('open');
    mobileMenu?.setAttribute('aria-hidden', 'true');
    menuButton?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  menuButton?.addEventListener('click', () => {
    const open = !mobileMenu?.classList.contains('open');
    mobileMenu?.classList.toggle('open', open);
    mobileMenu?.setAttribute('aria-hidden', String(!open));
    menuButton.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  });
  mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.desktop-nav a')];
  const updateScrollUi = () => {
    const top = window.scrollY;
    header?.classList.toggle('scrolled', top > 24);
    if (progress) {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      progress.style.width = `${Math.min((top / max) * 100, 100)}%`;
    }
    let activeId = '';
    sections.forEach((section) => {
      if (section.offsetTop - 180 <= top) activeId = section.id;
    });
    navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`));
  };
  updateScrollUi();
  window.addEventListener('scroll', updateScrollUi, { passive: true });

  if (!reduceMotion && finePointer && glow) {
    window.addEventListener('pointermove', (event) => {
      glow.style.transform = `translate(${event.clientX - 215}px, ${event.clientY - 215}px)`;
    }, { passive: true });
  }

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -45px' });
    document.querySelectorAll('.reveal').forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(index % 4, 3) * 65}ms`;
      revealObserver.observe(element);
    });
  } else {
    document.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
  }

  const moduleData = {
    reservas: {
      label: 'RESERVAS Y SALA',
      title: 'Cada turno empieza con una visión clara.',
      text: 'Centraliza reservas, estados, horarios, mesas y disponibilidad para preparar el servicio antes de que llegue el primer cliente.',
      list: ['Reservas web, WhatsApp y manuales', 'Calendario, turnos y estados', 'Ocupación y control de sala'],
      visual: `
        <div class="flow-visual flow-reservas">
          <div class="flow-source"><span>WEB</span><span>WA</span><span>MANUAL</span></div>
          <div class="flow-line"><i></i></div>
          <div class="flow-core"><small>RESERVAS</small><b>Turno de cena</b><strong>Vista unificada</strong></div>
          <div class="flow-output"><div><i></i><span>Confirmadas</span></div><div><i></i><span>Pendientes</span></div><div><i></i><span>Mesas</span></div></div>
        </div>`
    },
    clientes: {
      label: 'GESTIÓN DE CLIENTES',
      title: 'Cada visita construye una relación.',
      text: 'Organiza el historial, la frecuencia y la actividad de cada cliente para entender quién vuelve, quién se ha alejado y dónde existe una oportunidad.',
      list: ['Ficha e historial de visitas', 'Frecuencia y segmentación', 'Preferencias y actividad'],
      visual: `
        <div class="flow-visual">
          <div class="flow-source"><span>VISITA</span><span>RESERVA</span><span>QR</span></div>
          <div class="flow-line"><i></i></div>
          <div class="flow-core"><small>CLIENTE</small><b>Historial conectado</b><strong>Perfil accionable</strong></div>
          <div class="flow-output"><div><i></i><span>Nuevo</span></div><div><i></i><span>Recurrente</span></div><div><i></i><span>Inactivo</span></div></div>
        </div>`
    },
    fidelizacion: {
      label: 'FIDELIZACIÓN',
      title: 'Volver debe tener un motivo claro.',
      text: 'Crea una experiencia de continuidad con puntos, niveles, recompensas y cupones conectados al comportamiento real de cada cliente.',
      list: ['Puntos y niveles', 'Cupones y recompensas', 'Seguimiento de canjes'],
      visual: `
        <div class="flow-visual">
          <div class="flow-source"><span>VISITA</span><span>PUNTOS</span><span>NIVEL</span></div>
          <div class="flow-line"><i></i></div>
          <div class="flow-core"><small>FIDELIZACIÓN</small><b>Relación continua</b><strong>Motivos para volver</strong></div>
          <div class="flow-output"><div><i></i><span>Cupón</span></div><div><i></i><span>Premio</span></div><div><i></i><span>Retorno</span></div></div>
        </div>`
    },
    camarero: {
      label: 'CAMARERO DIGITAL',
      title: 'Menos pasos entre la mesa y la cocina.',
      text: 'El cliente consulta la carta, envía el pedido y el equipo recibe la información organizada por mesa, producto y estado de preparación.',
      list: ['Carta QR actualizable', 'Pedidos por mesa', 'Flujo hacia cocina'],
      visual: `
        <div class="flow-visual">
          <div class="flow-source"><span>QR</span><span>MESA</span><span>PEDIDO</span></div>
          <div class="flow-line"><i></i></div>
          <div class="flow-core"><small>OPERATIVA</small><b>Pedido conectado</b><strong>Mesa → cocina</strong></div>
          <div class="flow-output"><div><i></i><span>Nuevo</span></div><div><i></i><span>Preparando</span></div><div><i></i><span>Listo</span></div></div>
        </div>`
    },
    reputacion: {
      label: 'REPUTACIÓN',
      title: 'La experiencia también continúa online.',
      text: 'Ordena el seguimiento de reseñas y respuestas para mantener una reputación cuidada sin depender de revisiones esporádicas.',
      list: ['Reseñas centralizadas', 'Pendientes y estados', 'Seguimiento de respuestas'],
      visual: `
        <div class="flow-visual">
          <div class="flow-source"><span>VISITA</span><span>FEEDBACK</span><span>RESEÑA</span></div>
          <div class="flow-line"><i></i></div>
          <div class="flow-core"><small>REPUTACIÓN</small><b>Seguimiento constante</b><strong>Confianza visible</strong></div>
          <div class="flow-output"><div><i></i><span>Nueva</span></div><div><i></i><span>Pendiente</span></div><div><i></i><span>Respondida</span></div></div>
        </div>`
    },
    rentabilidad: {
      label: 'RENTABILIDAD',
      title: 'La carta también debe leerse en márgenes.',
      text: 'Relaciona ingredientes, costes, precios y ventas para entender qué platos impulsan el negocio y cuáles necesitan una revisión.',
      list: ['Coste por ingrediente', 'Margen por plato', 'Rendimiento de la carta'],
      visual: `
        <div class="flow-visual">
          <div class="flow-source"><span>COSTE</span><span>PRECIO</span><span>VENTA</span></div>
          <div class="flow-line"><i></i></div>
          <div class="flow-core"><small>RENTABILIDAD</small><b>Margen real</b><strong>Decisión por plato</strong></div>
          <div class="flow-output"><div><i></i><span>Estrella</span></div><div><i></i><span>Estable</span></div><div><i></i><span>Revisar</span></div></div>
        </div>`
    }
  };

  const moduleLabel = document.getElementById('moduleLabel');
  const moduleTitle = document.getElementById('moduleTitle');
  const moduleText = document.getElementById('moduleText');
  const moduleList = document.getElementById('moduleList');
  const moduleCanvas = document.getElementById('moduleCanvas');
  document.querySelectorAll('.module-tab').forEach((button) => {
    button.addEventListener('click', () => {
      const data = moduleData[button.dataset.module];
      if (!data || !moduleCanvas) return;
      document.querySelectorAll('.module-tab').forEach((tab) => {
        const active = tab === button;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-selected', String(active));
      });
      moduleCanvas.classList.add('changing');
      window.setTimeout(() => {
        if (moduleLabel) moduleLabel.textContent = data.label;
        if (moduleTitle) moduleTitle.textContent = data.title;
        if (moduleText) moduleText.textContent = data.text;
        if (moduleList) moduleList.innerHTML = data.list.map((item) => `<li>${item}</li>`).join('');
        moduleCanvas.innerHTML = data.visual;
        moduleCanvas.classList.remove('changing');
      }, 175);
    });
  });

  if (!reduceMotion && finePointer) {
    document.querySelectorAll('.magnetic').forEach((button) => {
      button.addEventListener('pointermove', (event) => {
        const rect = button.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.11;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.11;
        button.style.transform = `translate(${x}px, ${y - 2}px)`;
      });
      button.addEventListener('pointerleave', () => { button.style.transform = ''; });
    });

    document.querySelectorAll('.tilt-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const rx = ((event.clientY - rect.top) / rect.height - 0.5) * -4;
        const ry = ((event.clientX - rect.left) / rect.width - 0.5) * 5;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });

    const systemVisual = document.querySelector('.system-visual');
    systemVisual?.addEventListener('pointermove', (event) => {
      if (window.innerWidth < 1120) return;
      const rect = systemVisual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      systemVisual.querySelectorAll('[data-depth]').forEach((node) => {
        const depth = Number(node.dataset.depth || 1);
        node.style.translate = `${x * depth * 9}px ${y * depth * 9}px`;
      });
    });
    systemVisual?.addEventListener('pointerleave', () => {
      systemVisual.querySelectorAll('[data-depth]').forEach((node) => { node.style.translate = ''; });
    });

    const parallax = document.querySelector('[data-parallax]');
    window.addEventListener('scroll', () => {
      if (!parallax || window.innerWidth < 1120) return;
      const factor = Number(parallax.dataset.parallax || 0);
      parallax.style.transform = `translateY(${window.scrollY * factor}px)`;
    }, { passive: true });
  }

  document.querySelectorAll('.faq-list details').forEach((detail) => {
    detail.addEventListener('toggle', () => {
      if (!detail.open) return;
      document.querySelectorAll('.faq-list details').forEach((other) => {
        if (other !== detail) other.open = false;
      });
    });
  });

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
