/* ==========================================================================
   DISEÑO "GOOGLE" (Material Design 3 + paleta Google Workspace)
   - Es el diseño principal del observatorio: se ve siempre por defecto.
   - ?tema=original  → muestra el diseño anterior solo en esa visita (respaldo).
   - ?tema=google    → diseño Google (igual que sin parámetro).
   - Con cualquier ?tema=... aparece un botón abajo a la derecha para alternar
     entre los dos diseños en vivo. Sin parámetro, el público no ve el botón.
   - Independiente de app.js y shell.js: solo pone clases y escucha el ☰.
   Los estilos están en css/tema-google.css.
   ========================================================================== */
(function () {
  var root = document.documentElement;
  var DESKTOP = window.matchMedia('(min-width: 1280px)');

  // 1) ¿Qué diseño toca? (esto corre en <head>, antes de pintar: no hay parpadeo)
  var param = null;
  try { param = new URLSearchParams(location.search).get('tema'); } catch (e) {}
  if (param !== 'google' && param !== 'original') param = null;

  var tema = param || 'google';
  var mostrarBoton = !!param;

  function cargarFuentes() {
    if (document.getElementById('gtFonts')) return;
    var link = document.createElement('link');
    link.id = 'gtFonts';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap';
    document.head.appendChild(link);
  }

  function aplicar(t) {
    tema = t;
    var google = t === 'google';
    root.classList.toggle('tema-google', google);
    if (google) cargarFuentes();
    if (document.body && !google) document.body.classList.remove('gt-collapsed');
    actualizarBoton();
  }

  // 2) Botón flotante para alternar (solo si se abrió con ?tema=...)
  var boton = null;
  function actualizarBoton() {
    if (!boton) return;
    var google = tema === 'google';
    boton.innerHTML = '<i class="fa-solid fa-palette" aria-hidden="true"></i>' +
      (google ? 'Ver diseño anterior' : 'Ver diseño nuevo');
    boton.title = google ? 'Mostrar el diseño anterior del observatorio' : 'Volver al diseño nuevo';
  }

  aplicar(tema);

  document.addEventListener('DOMContentLoaded', function () {
    var body = document.body;

    if (mostrarBoton) {
      boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'gt-switch';
      boton.addEventListener('click', function () {
        aplicar(tema === 'google' ? 'original' : 'google');
      });
      body.appendChild(boton);
      actualizarBoton();
    }

    // 3) ☰ en escritorio: oculta/muestra la barra lateral (como en Drive).
    //    Se escucha en fase de captura para adelantarse a shell.js, que en
    //    celular sigue abriendo el menú encima como siempre.
    document.addEventListener('click', function (e) {
      if (tema !== 'google' || !DESKTOP.matches) return;
      var burger = e.target.closest && e.target.closest('#obsBurger');
      if (!burger) return;
      e.stopPropagation();
      var oculta = body.classList.toggle('gt-collapsed');
      burger.setAttribute('aria-expanded', oculta ? 'false' : 'true');
      burger.setAttribute('aria-label', oculta ? 'Mostrar menú' : 'Ocultar menú');
    }, true);

    // Al pasar a pantalla chica, la barra vuelve a su comportamiento móvil
    var alCambiar = function () { if (!DESKTOP.matches) body.classList.remove('gt-collapsed'); };
    if (DESKTOP.addEventListener) DESKTOP.addEventListener('change', alCambiar);
    else if (DESKTOP.addListener) DESKTOP.addListener(alCambiar);

    // 4) Sombra suave en la barra superior al bajar
    window.addEventListener('scroll', function () {
      body.classList.toggle('gt-scrolled', window.scrollY > 4);
    }, { passive: true });
  });
})();
