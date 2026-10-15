  /* ========= MODULO 5: REPOSITORIO ========= */
    // CAMBIÓ: antes leía un JSON local (./data/modulo5/repositorio.json).
    // Ahora lee en vivo desde el Apps Script, igual que Mod 1 y Mod 4.
    const REPO_URL = 'https://script.google.com/macros/s/AKfycbxGtEY-WPxG5DE4C-7eaRnrIZmG6vi0y7Xd0uxmjTgpNDIGllnisiQ4Er01yEuG4Rzn/exec?tipo=repositorio';
    let REPO_CACHE = null;

    async function loadRepo(){
      if (REPO_CACHE) return REPO_CACHE;
      const r = await fetch(REPO_URL, { cache:'no-store' });
      if (!r.ok) throw new Error('No se pudo cargar el repositorio');
      REPO_CACHE = await r.json();
      return REPO_CACHE;
    }

    function escapeHtml(s){
      return String(s||'')
        .replaceAll('&','&amp;')
        .replaceAll('<','&lt;')
        .replaceAll('>','&gt;');
    }

    function renderRepo(items){
      const tabs = document.getElementById('repoTabs');
      const cont = document.getElementById('repoCards');
      if (!tabs || !cont) return;

      // Tipos únicos (pestañas) -> vienen ya listos como "Documentos y Guías" / "Bibliografía"
      const tipos = [...new Set((items||[]).map(x => (x.tipo||'').trim()).filter(Boolean))]
        .sort((a,b)=>a.localeCompare(b,'es',{sensitivity:'base'}));

      if (!tipos.length){
        tabs.innerHTML = '';
        cont.innerHTML = `<div class="muted">No hay documentos cargados.</div>`;
        return;
      }

      // Construye pestañas
      tabs.innerHTML = '';
      tipos.forEach((t,i)=>{
        const count = (items||[]).filter(x => (x.tipo||'').trim() === t).length;

        const b = document.createElement('button');
        b.className = 'subtab' + (i===0 ? ' active' : '');
        b.textContent = `${t} (${count})`;
        b.dataset.tipo = t;
        b.type = 'button';
        tabs.appendChild(b);
      });


      function paint(tipo){
        const rows = (items||[]).filter(x => (x.tipo||'').trim() === tipo);

        cont.innerHTML = rows.map(x => `
          <article class="repo-card">
            <div>
              <div class="repo-title">${escapeHtml(x.titulo || '—')}</div>
              ${x.categoria ? `<span class="badge muted" style="margin-bottom:6px;display:inline-block">${escapeHtml(x.categoria)}</span>` : ''}
              <div class="repo-source">${escapeHtml(x.fuente || '')}</div>
            </div>
            <div class="repo-actions">
              <a class="pill" href="${x.link}" target="_blank" rel="noopener">Descargar</a>
            </div>
          </article>
        `).join('') || `<div class="muted">No hay documentos en esta pestaña.</div>`;
      }

      // Click tabs (evita duplicar listener)
      if (!tabs._bound){
        tabs.addEventListener('click', (e)=>{
          const b = e.target.closest('.subtab');
          if (!b) return;
          tabs.querySelectorAll('.subtab').forEach(x => x.classList.toggle('active', x === b));
          paint(b.dataset.tipo);
        });
        tabs._bound = true;
      }

      paint(tipos[0]);
    }

    export async function initModDatos(){

      try{
        const data = await loadRepo();
        renderRepo(data?.items || []);
      }catch(err){
        console.error(err);
        const cont = document.getElementById('repoCards');
        const tabs = document.getElementById('repoTabs');
        if (tabs) tabs.innerHTML = '';
        if (cont) cont.innerHTML = `<div class="muted">No se pudo cargar el repositorio.</div>`;
      }
    }

