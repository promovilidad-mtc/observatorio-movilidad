/* ==========================================================================
   COOPERACIÓN TÉCNICA — videos de YouTube
   - Cada <article class="coop-video" data-yt="..."> se muestra solo si tiene código.
     En data-yt puedes pegar el código (11 caracteres) o el enlace completo del video.
   - El reproductor NO se carga hasta que alguien le da clic (la página sigue liviana).
   - Se usa youtube-nocookie.com (sin cookies de seguimiento hasta que se reproduce).
   - Al salir de la página, los videos se detienen.
   ========================================================================== */
(function () {
  'use strict';
  var section = document.getElementById('coopVideosSection');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.coop-video'));
  if (!section || !cards.length) return;

  function extractId(raw) {
    raw = String(raw || '').trim();
    if (!raw) return '';
    var m = raw.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/|\/live\/)([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    return /^[A-Za-z0-9_-]{11}$/.test(raw) ? raw : '';
  }

  function resetCard(card) {
    var poster = card.querySelector('.coop-poster');
    var frame = poster.querySelector('iframe');
    if (frame) frame.remove();
    var img = poster.querySelector('img'), btn = poster.querySelector('.coop-play');
    if (img) img.style.display = '';
    if (btn) btn.style.display = '';
  }

  var shown = 0;
  cards.forEach(function (card) {
    var raw = card.getAttribute('data-yt');
    if (!raw || !raw.trim()) return;                       // sin código: la tarjeta queda oculta
    var id = extractId(raw);
    if (!id) { console.warn('Cooperación técnica: código de YouTube no válido →', raw); return; }

    var poster = card.querySelector('.coop-poster');
    var img = poster.querySelector('img');
    var btn = poster.querySelector('.coop-play');
    var title = (card.querySelector('.coop-video-title') || {}).textContent || 'Video';
    var link = card.querySelector('.coop-yt-link');

    if (link) link.href = 'https://www.youtube.com/watch?v=' + id;
    if (img) {
      img.alt = 'Portada del video: ' + title;
      img.addEventListener('error', function () { img.style.display = 'none'; });   // sin miniatura: queda el fondo con el botón
      img.src = 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
    }
    btn.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
      f.title = title;
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.setAttribute('allowfullscreen', '');
      f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      poster.appendChild(f);
      if (img) img.style.display = 'none';
      btn.style.display = 'none';
    });

    card.hidden = false;
    shown++;
  });

  if (shown) section.hidden = false;

  // al salir de la página, se detienen los videos (si no, seguirían sonando ocultos)
  window.addEventListener('hashchange', function () {
    if (location.hash !== '#mod-cooperacion') cards.forEach(resetCard);
  });
})();
