  /* ========= MODULO 7: NOTICIAS ========= */
    // Lee las notas de prensa desde la pestaña "Noticias" del Google Sheet (Apps Script, ?tipo=noticias).
    // Columnas del Sheet: fecha | titulo | resumen | medio | detalle | link | imagen | ciudad | publicar
    // MIENTRAS NO EXISTA la pestaña en el Apps Script, NOTICIAS_URL va vacía y se muestran los datos de ejemplo.
    const NOTICIAS_URL = ''; // luego: 'https://script.google.com/macros/s/AKfycbxGtEY-WPxG5DE4C-7eaRnrIZmG6vi0y7Xd0uxmjTgpNDIGllnisiQ4Er01yEuG4Rzn/exec?tipo=noticias'
    let NOTICIAS_CACHE = null;

    // Datos de ejemplo (misma forma que devolverá el Apps Script)
    const NOTICIAS_EJEMPLO = [
      {
        fecha: '',
        titulo: 'El corredor que cambiará Trujillo',
        resumen: 'El Corredor Vial Norte-Sur de Trujillo mantiene como horizonte el inicio de operaciones en el primer trimestre de 2030. Según Víctor Del Carpio, gerente general de Transporte Metropolitano de Trujillo (TMT), ese es el objetivo establecido en la hoja de ruta que coordinan la Municipalidad Provincial de Trujillo, el Ministerio de Transportes y Comunicaciones, Promovilidad y la Unidad Ejecutora 015.',
        medio: 'Revista Energiminas',
        detalle: 'Págs. 90, 91 y 92',
        link: 'https://go.imedia.pe/5L9An',
        imagen: '',
        ciudad: 'Trujillo',
        publicar: 'SI'
      },
      {
        fecha: '',
        titulo: 'Nota de ejemplo 2 (reemplazar)',
        resumen: 'Aquí va el texto de la nota de prensa tal como lo publica el medio. Se muestra completo; el botón lleva a la nota original.',
        medio: 'Medio de prensa',
        detalle: '',
        link: '#',
        imagen: './assets/img/carrilbus1.png',
        ciudad: 'Juliaca',
        publicar: 'SI'
      },
      {
        fecha: '',
        titulo: 'Nota de ejemplo 3 (reemplazar)',
        resumen: 'Aquí va el texto de la nota de prensa tal como lo publica el medio. Se muestra completo; el botón lleva a la nota original.',
        medio: 'Medio de prensa',
        detalle: '',
        link: '#',
        imagen: './assets/img/ztc1.png',
        ciudad: 'Cusco',
        publicar: 'SI'
      }
    ];

    async function loadNoticias(){
      if (NOTICIAS_CACHE) return NOTICIAS_CACHE;
      if (!NOTICIAS_URL){
        NOTICIAS_CACHE = { items: NOTICIAS_EJEMPLO };
        return NOTICIAS_CACHE;
      }
      const r = await fetch(NOTICIAS_URL, { cache:'no-store' });
      if (!r.ok) throw new Error('No se pudo cargar las noticias');
      NOTICIAS_CACHE = await r.json(); // ← el Sheet devuelve {version, items:[...]}
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
          <article class="news-item${i === 0 ? ' news-lead' : ''}">
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
