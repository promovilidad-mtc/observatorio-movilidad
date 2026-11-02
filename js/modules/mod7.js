import { fetchSheet } from '../sheet-cache.js';
  /* ========= MODULO 7: NOTICIAS ========= */
    // Lee las notas de prensa del Sheet "OBSERVATORIO_NOTICIAS" (Apps Script, ?tipo=noticias).
    // Columnas del Sheet: fecha | titulo | resumen | medio | detalle | link | imagen | ciudad | publicar
    // El Apps Script ya omite las filas sin título o con publicar = NO.
    const NOTICIAS_URL = 'https://script.google.com/macros/s/AKfycbxGtEY-WPxG5DE4C-7eaRnrIZmG6vi0y7Xd0uxmjTgpNDIGllnisiQ4Er01yEuG4Rzn/exec?tipo=noticias';
    let NOTICIAS_CACHE = null;
    const NOTICIAS_VISIBLES = 10; // las demás quedan detrás del botón "Ver más noticias"

    async function loadNoticias(){
      if (NOTICIAS_CACHE) return NOTICIAS_CACHE;
      // Copia guardada al instante; si prensa agregó notas, se repinta solo
      NOTICIAS_CACHE = await fetchSheet(NOTICIAS_URL, { onUpdate: d => { NOTICIAS_CACHE = d; renderNoticias(d?.items || []); } }); // ← el Sheet devuelve {version, items:[...]}
      return NOTICIAS_CACHE;
    }

    function escapeHtml(s){
      return String(s||'')
        .replaceAll('&','&amp;')
        .replaceAll('<','&lt;')
        .replaceAll('>','&gt;')
        .replaceAll('"','&quot;');
    }

    // Solo enlaces http(s) o rutas locales (./assets/...); evita que una celda mal llenada rompa la página
    function safeUrl(u){
      const s = String(u||'').trim();
      return /^(https?:\/\/|\.\/)/i.test(s) ? s : '';
    }

    // Un enlace de Google Drive ("Compartir > Copiar enlace") no es una imagen directa:
    // se convierte al enlace de vista previa de Drive, que sí carga en <img>.
    // Requiere que el archivo esté compartido como "Cualquier persona con el enlace".
    function imgUrl(u){
      const s = safeUrl(u);
      if (!/drive\.google\.com/i.test(s)) return s;
      const id = (s.match(/\/d\/([\w-]+)/) || s.match(/[?&]id=([\w-]+)/) || [])[1];
      return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w1600` : s;
    }

    // 'YYYY-MM-DD' -> '12 oct. 2026'
    function fmtFecha(f){
      const m = String(f||'').match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (!m) return '';
      const d = new Date(+m[1], +m[2]-1, +m[3]);
      return d.toLocaleDateString('es-PE', { day:'numeric', month:'short', year:'numeric' });
    }

    function renderNoticias(items){
      const cont = document.getElementById('noticiasList');
      if (!cont) return;

      // Solo las marcadas para publicar; las más recientes primero
      const rows = (items||[])
        .filter(x => String(x.publicar||'SI').trim().toUpperCase() !== 'NO' && (x.titulo||'').trim())
        .sort((a,b) => String(b.fecha||'').localeCompare(String(a.fecha||'')));

      if (!rows.length){
        cont.innerHTML = `<div class="muted">No hay noticias publicadas.</div>`;
        return;
      }

      // La primera (más reciente) va destacada; el resto en lista tipo diario
      cont.innerHTML = rows.map((x, i) => {
        const link = safeUrl(x.link);
        const img = imgUrl(x.imagen);
        const fecha = fmtFecha(x.fecha);
        const medio = (x.medio||'').trim();
        const detalle = (x.detalle||'').trim();
        const kicker = ['Nota de prensa', x.ciudad].map(s => (s||'').trim()).filter(Boolean).join(' · ');
        return `
          <article class="news-item${i === 0 ? ' news-lead' : ''}"${i >= NOTICIAS_VISIBLES ? ' hidden' : ''}>
            <div class="news-media">
              ${img
                ? `<img src="${escapeHtml(img)}" alt="" loading="lazy" decoding="async">`
                : `<div class="news-clip"><i class="fa-solid fa-quote-left" aria-hidden="true"></i><span>${escapeHtml(medio || 'Prensa')}</span></div>`}
            </div>
            <div class="news-body">
              <div class="news-kicker">${escapeHtml(kicker)}</div>
              <h3 class="news-title">${escapeHtml(x.titulo)}</h3>
              <p class="news-text">${escapeHtml(x.resumen)}</p>
              <div class="news-foot">
                <div class="news-src">
                  ${medio ? `<strong>${escapeHtml(medio)}</strong>` : ''}
                  ${[detalle, fecha].filter(Boolean).map(s => `<span>${escapeHtml(s)}</span>`).join('')}
                </div>
                ${link ? `<a class="news-link" href="${escapeHtml(link)}" target="_blank" rel="noopener">Leer nota completa <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>` : ''}
              </div>
            </div>
          </article>`;
      }).join('');

      // Más de 10: botón que muestra el resto de una vez
      const ocultas = rows.length - NOTICIAS_VISIBLES;
      if (ocultas > 0){
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'news-more';
        btn.innerHTML = `Ver más noticias (${ocultas}) <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>`;
        btn.addEventListener('click', () => {
          cont.querySelectorAll('.news-item[hidden]').forEach(el => el.hidden = false);
          btn.remove();
        });
        cont.appendChild(btn);
      }
    }

    export async function initModNoticias(){
      const cont = document.getElementById('noticiasList');
      if (!NOTICIAS_CACHE && cont) cont.innerHTML = `<div class="muted">Cargando noticias…</div>`;
      try{
        const data = await loadNoticias();
        renderNoticias(data?.items || []);
      }catch(err){
        console.error(err);
        if (cont) cont.innerHTML = `<div class="muted">No se pudo cargar las noticias.</div>`;
      }
    }
