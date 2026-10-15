/* ==========================================================================
   SHELL DEL OBSERVATORIO
   - Marca el módulo activo en la barra lateral y pone el título en el topbar
   - Menú lateral desplegable en celular/tablet
   - Botón "Desliza hacia abajo" del Inicio
   - Zoom (lightbox) de los mapas de intervenciones

   Independiente de app.js: NO cambia location.hash ni toca el router.
   Solo escucha el hash para reflejar en qué módulo está el usuario.
   ========================================================================== */
(function () {
  // hash -> qué ítem del menú se enciende, qué grupo se abre, qué título se muestra
  const ROUTES = {
    '#home':                  { nav: 'home',          title: 'Inicio',                                   view: 'home' },
    '#mod-sit':               { nav: 'sit',           title: 'Concepto SIT' },
    '#concepto-promovilidad': { nav: 'home',          title: 'Conoce PROMOVILIDAD',                      view: 'module' },
    '#mod-info':              { nav: 'mod-info',      group: 'indicadores', title: 'Indicadores · Información territorial' },
    '#mod-planes':            { nav: 'mod-info',      group: 'indicadores', title: 'Indicadores · Planes de la ciudad' },
    '#mod-convenios':         { nav: 'mod-info',      group: 'indicadores', title: 'Indicadores · Convenios de la ciudad' },
    '#mod-operacion':         { nav: 'mod-operacion', group: 'indicadores', title: 'Indicadores · Operación y servicios' },
    '#planes-global':         { nav: 'mod-info',      group: 'indicadores', title: 'Indicadores · Planes (todas las ciudades)' },
    '#convenios-global':      { nav: 'mod-info',      group: 'indicadores', title: 'Indicadores · Convenios (todas las ciudades)' },
    '#mod-herramientas':      { nav: 'herramientas',  title: 'Herramientas' },
    '#mod-proyectos':         { nav: 'proyectos',     title: 'Proyectos de inversión' },
    '#mod-datos':             { nav: 'repositorio',   title: 'Repositorio' },
    '#mod-gobernanza':        { nav: 'asistencia',    title: 'Asistencia técnica' },
    '#mod-cooperacion':       { nav: 'cooperacion',   title: 'Cooperación técnica' },
    '#mod-noticias':          { nav: 'noticias',      title: 'Noticias' }
  };

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const body = document.body;
  const sidebar = $('#obsSidebar');
  const burger = $('#obsBurger');
  const scrim = $('#obsScrim');
  const topTitle = $('#obsTopTitle');
  const group = $('.obs-group');
  const groupBtn = $('.obs-group-btn');

  /* ---------- Menú lateral en móvil ---------- */
  function setDrawer(open) {
    body.classList.toggle('obs-open', open);
    if (burger) {
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    }
  }

  /* ---------- Estado según la ruta ---------- */
  function currentRoute() {
    const h = location.hash || '#home';
    return { hash: h, info: ROUTES[h] || { nav: null, title: 'PROMOVILIDAD' } };
  }

  function syncShell() {
    const { info } = currentRoute();

    // 1) ítem activo
    $$('[data-nav]', sidebar).forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-nav') === info.nav);
    });

    // 2) grupo Indicadores: abierto y resaltado cuando estamos dentro
    if (group && groupBtn) {
      const inside = info.group === 'indicadores';
      group.classList.toggle('open', inside);
      groupBtn.setAttribute('aria-expanded', inside ? 'true' : 'false');
      groupBtn.classList.toggle('active', inside);
    }

    // 3) título del topbar y tipo de vista (en el Inicio de escritorio el topbar se oculta)
    if (topTitle) topTitle.textContent = info.title || '';
    body.setAttribute('data-view', info.view || 'module');

    // 4) cerrar el menú móvil
    setDrawer(false);
  }

  /* ---------- Eventos ---------- */
  if (burger) burger.addEventListener('click', () => setDrawer(!body.classList.contains('obs-open')));
  if (scrim) scrim.addEventListener('click', () => setDrawer(false));

  if (groupBtn && group) {
    groupBtn.addEventListener('click', () => {
      const open = !group.classList.contains('open');
      group.classList.toggle('open', open);
      groupBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Al tocar cualquier enlace del menú en móvil, se cierra (los que cambian hash ya lo hacen en syncShell)
  if (sidebar) {
    sidebar.addEventListener('click', e => {
      const a = e.target.closest('a[href]');
      if (a && a.target === '_blank') setDrawer(false);
    });
  }

  window.addEventListener('hashchange', () => {
    syncShell();
    window.scrollTo(0, 0); // cada módulo abre desde arriba
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { setDrawer(false); closeLightbox(); }
  });

  /* ---------- Inicio: botón "Desliza hacia abajo" ---------- */
  const cue = $('#heroScrollBtn');
  const objetivos = $('#objetivos');
  if (cue && objetivos) {
    cue.addEventListener('click', () => objetivos.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }

  /* ---------- Lightbox (zoom de mapas e infografía) ----------
     Las imágenes con data-zoomable se pueden acercar: clic = tamaño grande (se recorre con scroll), otro clic = reducir. */
  const box = $('#obsLightbox');
  const boxImg = $('#obsLightboxImg');
  const boxClose = $('#obsLightboxClose');
  const boxHint = $('#obsLightboxHint');

  function setHint() {
    if (!boxHint) return;
    const z = box.classList.contains('is-zoomable');
    boxHint.hidden = !z;
    if (z) boxHint.textContent = box.classList.contains('zoomed')
      ? 'Clic para reducir · desplázate para recorrer la infografía'
      : 'Clic en la imagen para acercar';
  }
  function openLightbox(src, alt, zoomable) {
    if (!box || !boxImg) return;
    boxImg.src = src;
    boxImg.alt = alt || '';
    box.classList.remove('zoomed');
    box.classList.toggle('is-zoomable', !!zoomable);
    box.classList.add('active');
    box.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';
    box.scrollTop = 0; box.scrollLeft = 0;
    setHint();
  }
  function closeLightbox() {
    if (!box || !box.classList.contains('active')) return;
    box.classList.remove('active', 'zoomed', 'is-zoomable');
    box.setAttribute('aria-hidden', 'true');
    body.style.overflow = '';
    setHint();
  }
  $$('img[data-lightbox]').forEach(img => img.addEventListener('click', () => openLightbox(img.src, img.alt, img.hasAttribute('data-zoomable'))));
  if (box) box.addEventListener('click', closeLightbox);
  if (boxImg) boxImg.addEventListener('click', e => {
    e.stopPropagation();
    if (!box.classList.contains('is-zoomable')) return;
    const r = boxImg.getBoundingClientRect();
    const fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;   // punto donde se hizo clic
    box.classList.toggle('zoomed');
    setHint();
    if (box.classList.contains('zoomed')) {                                           // centra el zoom en ese punto
      requestAnimationFrame(() => {
        box.scrollLeft = fx * boxImg.offsetWidth  - box.clientWidth  / 2;
        box.scrollTop  = fy * boxImg.offsetHeight - box.clientHeight / 2;
      });
    }
  });
  if (boxClose) boxClose.addEventListener('click', closeLightbox);

  /* ---------- Aviso si se abre con doble clic (file://) ----------
     Los módulos usan import/export (ES modules) y fetch de archivos locales:
     el navegador los bloquea fuera de un servidor. Se avisa en vez de dejar la
     página "muerta" sin explicación. */
  if (location.protocol === 'file:') {
    const bar = document.createElement('div');
    bar.className = 'obs-filewarn';
    bar.setAttribute('role', 'alert');
    bar.innerHTML =
      '<span><strong>Abriste el portal con doble clic.</strong> Así los módulos no cargan. ' +
      'Ábrelo con <em>Live Server</em> (VS Code) o súbelo a Netlify.</span>' +
      '<button type="button" aria-label="Cerrar aviso">✕</button>';
    bar.querySelector('button').addEventListener('click', () => bar.remove());
    body.appendChild(bar);
  }

  /* ---------- Arranque ---------- */
  syncShell();
})();
