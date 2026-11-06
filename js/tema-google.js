/* ==========================================================================
   PILOTO DE DISEÑO "GOOGLE" (Material Design 3 + paleta Google Workspace)
   - Abrir con  ?tema=google    → activa el diseño nuevo
   - Abrir con  ?tema=original  → vuelve al diseño de siempre
   - Sin parámetro: se usa la última elección guardada en este navegador;
     si nunca se eligió, se ve el diseño original (los visitantes no notan nada).
   - Cuando se entra una vez con ?tema=..., aparece un botón abajo a la derecha
     para alternar entre los dos diseños en vivo (útil para presentar).
   - Independiente de app.js y shell.js: solo pone clases y escucha el ☰.
   Los estilos están en css/tema-google.css.
   ========================================================================== */
(function () {
  var KEY = 'obs-tema';
  var KEY_PILOTO = 'obs-tema-piloto';
  var root = document.documentElement;
  var DESKTOP = window.matchMedia('(min-width: 1280px)');

  function leer(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function guardar(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento: solo esta visita */ } }

  // 1) ¿Qué diseño toca? (esto corre en <head>, antes de pintar: no hay parpadeo)
  var param = null;
  try { param = new URLSearchParams(location.search).get('tema'); } catch (e) {}
  if (param !== 'google' && param !== 'original') param = null;
  if (param) { guardar(KEY, param); guardar(KEY_PILOTO, '1'); }

  var tema = param || leer(KEY) || 'original';
  var piloto = !!param || leer(KEY_PILOTO) === '1';

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

  // 2) Botón flotante para alternar
  var boton = null;
  function actualizarBoton() {
    if (!boton) return;
    var google = tema === 'google';
    boton.innerHTML = '<i class="fa-solid fa-palette" aria-hidden="true"></i>' +
      (google ? 'Ver diseño actual' : 'Ver diseño Google');
    boton.title = google ? 'Volver al diseño actual del observatorio' : 'Probar el diseño estilo Google (piloto)';
  }

  aplicar(tema);

  document.addEventListener('DOMContentLoaded', function () {
    var body = document.body;

    if (piloto) {
      boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'gt-switch';
      boton.addEventListener('click', function () {
        var nuevo = tema === 'google' ? 'original' : 'google';
        guardar(KEY, nuevo);
        aplicar(nuevo);
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
