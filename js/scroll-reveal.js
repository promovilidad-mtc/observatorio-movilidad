// scroll-reveal.js
// Efecto de aparición al hacer scroll (fade + slide up), estilo landing page.
// Archivo independiente: no toca app.js ni ningún mod*.js, ni la carga de datos.
// Se repite cada vez que el elemento entra o sale de pantalla (subiendo y bajando).

(function () {
  if (!('IntersectionObserver' in window)) {
    // Navegador sin soporte: mostrar todo directo, sin animar.
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        // Se repite siempre: agrega la clase al entrar, la quita al salir de pantalla.
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  function observeReveals() {
    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  // Al cargar la página
  document.addEventListener('DOMContentLoaded', observeReveals);

  // Por si el router de app.js cambia de vista y aparecen nuevos .reveal
  // (ej. si más adelante agregan la clase en otros módulos), reintenta al
  // cambiar el hash. No interfiere con el routing en sí, solo re-observa.
  window.addEventListener('hashchange', function () {
    setTimeout(observeReveals, 50);
  });
})();

