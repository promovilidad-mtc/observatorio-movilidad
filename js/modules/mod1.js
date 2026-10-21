/* ========= MODULO 1 ========= */
/* Gráficos: usa el adaptador (ApexCharts) y, si no está, Chart.js como antes */
function mkChart(canvas, cfg){
  return (window.PVChart ? window.PVChart(canvas, cfg) : new Chart(canvas, cfg));
}
/* ========= REFERENCIAS BÁSICAS ========= */
const sel   = document.getElementById('citySel');
const title = document.getElementById('title');
const meta  = document.getElementById('meta');
const btnInicioTop = document.getElementById('btnInicioTop');

const kDis  = document.getElementById('kDis');
const kPob  = document.getElementById('kPob');

// Indicadores demográficos
const peaFem  = document.getElementById('peaFem');
const peaMas  = document.getElementById('peaMas');
const disc    = document.getElementById('disc');
const adultos = document.getElementById('adultos');
const menores = document.getElementById('menores');

// Gestión
const convenios = document.getElementById('convenios');
const planes    = document.getElementById('planes');

// Autoridades
const ulAut = document.getElementById('autoridades');

// Charts
const gaugeTotalCanvas = document.getElementById('gaugeTotal');
const gaugeMovCanvas   = document.getElementById('gaugeMov');

// JSON maestro
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxGtEY-WPxG5DE4C-7eaRnrIZmG6vi0y7Xd0uxmjTgpNDIGllnisiQ4Er01yEuG4Rzn/exec';
const ALL_URL = APPS_SCRIPT_URL + '?tipo=indicadores';
const PLANES_URL = APPS_SCRIPT_URL + '?tipo=planes';
let PLANES = null;

// Estado global
let ALL = null;
let currentCityId = null;

// Mapa
let map, layer, limiteLayer;

// Charts
let gaugeTotal, gaugeMov;

// Persistencia
const LS_CITY = 'pd_currentCityId';

/* ========= HELPERS ========= */
const fmt   = n => (n==null ? '—' : Number(n).toLocaleString('es-PE'));
const money = v => (v==null ? '—' : v.toLocaleString('es-PE', { style:'currency', currency:'PEN', maximumFractionDigits:0 }));
const pct   = v => (v==null ? '—' : Number(v).toFixed(2) + '%');
const POLY_STYLE = {color:'#0ea5e9',weight:3,opacity:0.9,fillColor:'#93c5fd',fillOpacity:0.15};

// YYYY-MM-DD -> Date LOCAL (evita desfase UTC)
function parseISOToLocalDate(iso){
  if (!iso) return null;
  const parts = iso.split('-').map(Number);
  if (parts.length !== 3 || !parts[0]) return null;
  const [y, m, d] = parts;
  return new Date(y, m - 1, d);
}

// Formatea 'YYYY-MM-DD' como fecha local (evita desfase por UTC)
function fmtISODateLocal(iso){
  const dt = parseISOToLocalDate(iso);
  if (!dt) return '—';
  return dt.toLocaleDateString('es-PE');
}

// Suma años a una fecha ISO y devuelve 'YYYY-MM-DD'
function addYearsToISO(iso, years){
  const dt = parseISOToLocalDate(iso);
  if (!dt) return null;
  dt.setFullYear(dt.getFullYear() + years);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

// Estado -> clase badge (ÚNICO, sin duplicar)
function badgeEstado(estado){
  const s = (estado||'').toLowerCase();
  if (s.includes('vencid')) return 'danger';
  if (s.includes('por vencer')) return 'warn';
  if (s.includes('vigent')) return 'ok';
  if (s.includes('no vigente')) return 'muted';
  return 'muted';
}

// Cálculo de fin y estado del convenio (Marco o Específico)
function computeConvenioFinEstado(inicioISO, adendaISO){
  const dates = [];
  if (inicioISO) dates.push(inicioISO);
  if (adendaISO) dates.push(adendaISO);

  if (dates.length === 0) {
    return { finISO: null, finLabel: '—', estado: '—' };
  }

  // Base = fecha más reciente (comparación por Date local)
  const baseISO = dates.sort((a, b) => {
    const da = parseISOToLocalDate(a);
    const db = parseISOToLocalDate(b);
    return (db?.getTime?.() ?? 0) - (da?.getTime?.() ?? 0);
  })[0];

  // Fin = base + 3 años
  const finISO = addYearsToISO(baseISO, 3);
  const finDate = parseISOToLocalDate(finISO);
  const today = new Date();
  const diffDays = finDate ? (finDate - today) / (1000 * 60 * 60 * 24) : null;

  let estado;
  if (diffDays == null) {
    estado = '—';
  } else if (diffDays < 0) {
    estado = 'Vencido';
  } else if (diffDays <= 90) {
    estado = 'Por vencer';
  } else {
    estado = 'Vigente';
  }

  return {
    finISO,
    finLabel: fmtISODateLocal(finISO),
    estado
  };
}

function citySlug(s){
  return (s||'')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^\w]+/g, '_')
    .toUpperCase();
}

async function pickFirstExisting(urls){
  for (const u of urls){
    try {
      const r = await fetch(u, {cache:'no-store'});
      if (r.ok) return u;
    } catch(e){}
  }
  return null;
}

function renderGauge(canvas, titulo, pctVal, montoTotal, montoAvance, colors){
  if (!canvas) return null;
  const pendiente = (montoTotal!=null && montoAvance!=null) ? (montoTotal - montoAvance) : null;
  if (canvas._chart) canvas._chart.destroy();

  const chart = mkChart(canvas, {
    pv: { height: 205, center: 'first', fmt: 'pct1', tooltip: (i) => `<b>${['Ejecutado','Pendiente'][i]}: ${pct(pctVal==null ? [0,100][i] : [pctVal, 100-pctVal][i])}</b><br>Asignado: ${money(montoTotal)}<br>Ejecutado: ${money(montoAvance)}<br>Pendiente: ${money(pendiente)}` },
    type: 'doughnut',
    data: {
      labels: ['Ejecutado','Pendiente'],
      datasets: [{
        data: pctVal==null ? [0,100] : [pctVal, 100 - pctVal],
        backgroundColor: colors || ['#3b82f6','#ef4444']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          onClick: () => {},
          onHover: (e) => { e.native.target.style.cursor = 'default'; },
          onLeave: (e) => { e.native.target.style.cursor = 'default'; }
        },
        title: { display: true, text: titulo },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ${pct(ctx.raw)}`,
            afterBody: () => [
              `Asignado: ${money(montoTotal)}`,
              `Ejecutado: ${money(montoAvance)}`,
              `Pendiente: ${money(pendiente)}`
            ]
          }
        }
      },
      cutout: '65%'
    }
  });

  canvas._chart = chart;
  return chart;
}

function setCurrentCity(cityId){
  currentCityId = cityId;
  try { localStorage.setItem(LS_CITY, cityId); } catch(e){}
}

function getSavedCity(){
  try { return localStorage.getItem(LS_CITY); } catch(e){ return null; }
}

async function ensureDataLoaded(){
  if (!ALL) {
    ALL = await fetch(ALL_URL, { cache: 'no-store' }).then(r=>r.json());
  }

  // 1) intenta recuperar ciudad guardada
  if (!currentCityId) {
    const saved = getSavedCity();
    if (saved && (ALL?.ciudades || []).some(c => c.city_id === saved)) {
      currentCityId = saved;
    }
  }

  // 2) si sigue vacío, toma la primera por orden alfabético
  if (!currentCityId && ALL?.ciudades?.length){
    const sorted = [...ALL.ciudades].sort((a, b) =>
      (a.ciudad || '').localeCompare((b.ciudad || ''), 'es', { sensitivity: 'base' })
    );
    currentCityId = sorted[0].city_id;
  }
}

async function ensurePlanesLoaded(){
  if (!PLANES){
    try { PLANES = await fetch(PLANES_URL, { cache: 'no-store' }).then(r=>r.json()); }
    catch { PLANES = { planes: [] }; }
  }
}

/* ========= RENDER: CIUDAD (MÓDULO INFO) ========= */
function showModInfoLoader(msgTitle = 'Cargando…', msgSub = 'Datos de la ciudad') {
  const host = document.getElementById('mod-info');
  if (!host) return;
  let overlay = host.querySelector('.mi-loader');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'mi-loader';
    overlay.style.cssText = `
      position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
      background:rgba(255,255,255,.65); z-index:10000; font-weight:600; border-radius:12px;
    `;
    const box = document.createElement('div');
    box.style.cssText = `
      background:#fff; border:1px solid #e5e7eb; border-radius:14px;
      padding:14px 18px; box-shadow:0 10px 30px rgba(0,0,0,.08); min-width:240px;
      text-align:left; font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu;
    `;
    box.innerHTML = `
      <div style="display:flex;gap:10px;align-items:center">
        <div style="width:20px;height:20px;border:3px solid #e5e7eb;border-top-color:#0ea5e9;border-radius:50%;animation:mi-spin .9s linear infinite"></div>
        <div>
          <div class="t" style="font-weight:700">${msgTitle}</div>
          <div class="s" style="color:#6b7280;font-size:13px">${msgSub}</div>
        </div>
      </div>
    `;
    const style = document.createElement('style');
    style.textContent = `@keyframes mi-spin {to {transform:rotate(360deg)}}`;
    box.appendChild(style);
    overlay.appendChild(box);
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    host.appendChild(overlay);
  } else {
    overlay.style.display = 'flex';
  }
}

function hideModInfoLoader() {
  const overlay = document.querySelector('#mod-info .mi-loader');
  if (overlay) overlay.style.display = 'none';
}

async function initModInfo(){
  showModInfoLoader('Cargando…', 'Datos de la ciudad'); // ← NUEVO
  await ensureDataLoaded();
  hideModInfoLoader(); // ← NUEVO

  if (!map) {
    map = L.map('map', { scrollWheelZoom: false }).setView([-9.19, -75.01], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);
    layer = L.layerGroup().addTo(map);

    const mapEl = map.getContainer();
    mapEl.addEventListener('mouseenter', () => map.scrollWheelZoom.enable(), { passive: true });
    mapEl.addEventListener('mouseleave', () => map.scrollWheelZoom.disable(), { passive: true });
  }

  // Llenar selector si está vacío
  if (!sel.options.length){
    const ciudadesOrdenadas = [...(ALL.ciudades||[])].sort((a, b) =>
      (a.ciudad || '').localeCompare((b.ciudad || ''), 'es', { sensitivity: 'base' })
    );

    ciudadesOrdenadas.forEach(c => {
      const o = document.createElement('option');
      o.value = c.city_id;
      o.textContent = c.ciudad;
      sel.appendChild(o);
    });

    sel.onchange = () => renderCity(sel.value);
  }

  if (currentCityId) sel.value = currentCityId;
  renderCity(currentCityId);
}

function renderCity(cityId){
  setCurrentCity(cityId);

  const ind = (ALL.ciudades||[]).find(x=>x.city_id===cityId);
  if(!ind) return;

  // Encabezado
  title.textContent = ind.ciudad || cityId;
  meta.textContent  = `Departamento: ${ind.departamento ?? '—'} • Provincia: ${ind.provincia ?? '—'} • Categoría: ${ind.categoria ?? '—'}`;

  // KPIs principales
  kDis.textContent = fmt(ind.num_distritos);
  kPob.textContent = fmt(ind.poblacion_proyectada);

  // Demografía
  peaFem.textContent  = fmt(ind.demografia?.pea_femenina);
  peaMas.textContent  = fmt(ind.demografia?.pea_masculina);
  disc.textContent    = fmt(ind.demografia?.discapacidad);
  adultos.textContent = fmt(ind.demografia?.adulto_mayor);
  menores.textContent = fmt(ind.demografia?.menores_5);

  // Gestión (KPIs en tarjetas)
  {
    const g = ind.gestion || {};
    // Usamos el conteo que ya manda el Apps Script (excluye "Reemplazado";
    // si hay 2 filas de Marco -Reemplazado + Vigente- cuenta como 1).
    convenios.textContent = fmt(g.convenios_suscritos ?? 0);

    // Planes (carga segura) — solo contamos los que sí existen (Vigente),
    // no los "No cuenta" que ahora también vienen en la lista.
    planes.textContent = '0';
    (async () => {
      try {
        await ensurePlanesLoaded();
        const rows = (PLANES?.planes || []).filter(p =>
          (p.city_id === ind.city_id || (p.ciudad || '').toUpperCase() === (ind.ciudad || '').toUpperCase())
          && (p.estado || '').toLowerCase() !== 'no cuenta'
        );
        planes.textContent = fmt(rows.length);
      } catch (e) {}
    })();
  }

  // Autoridades
  ulAut.innerHTML = '';
  (ind.autoridades||[]).forEach(a=>{
    const div=document.createElement('div');
    div.className = 'autor-card';
    div.innerHTML = `
      <span class="cargo">${a.cargo}</span>
      <span class="nombre">${a.nombre}</span>
    `;
    ulAut.appendChild(div);
  });

  // Charts
  const ej = ind.ejecucion || {};

  if (gaugeTotal) gaugeTotal.destroy();
  if (gaugeMov)   gaugeMov.destroy();

  gaugeTotal = renderGauge(
    gaugeTotalCanvas,
    'Presupuesto total del Gobierno Local 2025',
    ej.total_pct,
    ej.monto_pct,
    ej.avance_pct,
    ['#3b82f6','#ef4444']
  );

  gaugeMov = renderGauge(
    gaugeMovCanvas,
    'Presupuesto para Transporte y Movilidad 2025',
    ej.movilidad_pct,
    ej.monto_movilidad,
    ej.avance_movilidad,
    ['#10b981','#fbbf24']
  );

  // LÍMITE
  (async () => {
    layer.clearLayers();
    if (limiteLayer) { map.removeLayer(limiteLayer); limiteLayer = null; }

    if (ind.centroide?.lat!=null && ind.centroide?.lon!=null){
      L.marker([ind.centroide.lat, ind.centroide.lon]).addTo(layer);
      map.setView([ind.centroide.lat, ind.centroide.lon], 11);
    } else {
      map.setView([-9.19,-75.01], 5);
    }

    const slug = citySlug(ind.city_id || ind.ciudad);
    const candidates = [
      ind.limite_url,
      `./data/modulo1/ciudades/${slug}.geojson`,
      `./data/${slug}/limite.geojson`,
    ].filter(Boolean);

    const url = await pickFirstExisting(candidates);
    if (!url) return;

    const geo = await fetch(url).then(r=>r.json());
    limiteLayer = L.geoJSON(geo, { style: POLY_STYLE }).addTo(map);
    const bb = limiteLayer.getBounds();
    if (bb.isValid()) map.fitBounds(bb, {padding:[10,10]});
  })();
}

/* ========= RENDER: LISTAS (PLANES / CONVENIOS) ========= */
async function renderPlanes(){
  await ensureDataLoaded();
  await ensurePlanesLoaded();

  const ind = (ALL?.ciudades||[]).find(x=>x.city_id===currentCityId) || {};
  document.getElementById('titlePlanes').textContent = ind.ciudad || '—';
  const cont = document.getElementById('listPlanes');
  cont.innerHTML = '';

  const rows = (PLANES?.planes||[]).filter(p =>
    p.city_id === ind.city_id || (p.ciudad||'').toUpperCase() === (ind.ciudad||'').toUpperCase()
  );

  if (!rows.length){
    cont.innerHTML = '<div class="muted">No hay planes cargados para esta ciudad.</div>';
    return;
  }

  const tableWrap = document.createElement('div');
  tableWrap.style.overflow = 'auto';

  const table = document.createElement('table');
  table.className = 'table-min';
  table.innerHTML = `
    <thead>
      <tr>
        <th style="min-width:120px">Tipo de Plan</th>
        <th>Documento de Aprobación (DA)</th>
        <th style="min-width:110px">Año inicio</th>
        <th style="min-width:110px">Año fin</th>
        <th style="min-width:160px">Documento (DA)</th>
        <th style="min-width:140px">Plan</th>
        <th style="min-width:110px">Estado</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = table.querySelector('tbody');

  rows.forEach(p=>{
    const docsHtml = p.doc_url ? `<a href="${p.doc_url}" target="_blank" rel="noopener">🔗 DA</a>` : '<span class="muted">—</span>';
    const planHtml = p.plan_url ? `<a href="${p.plan_url}" target="_blank" rel="noopener">🔗 Plan</a>` : '<span class="muted">—</span>';
    const estCls = `badge ${badgeEstado(p.estado)}`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.tipo || '—'}</td>
      <td>${p.doc_aprob || '—'}</td>
      <td>${p.anio_inicio ?? '—'}</td>
      <td>${p.anio_fin ?? '—'}</td>
      <td class="cell-docs">${docsHtml}</td>
      <td class="cell-docs">${planHtml}</td>
      <td><span class="${estCls}">${p.estado || '—'}</span></td>
    `;
    tbody.appendChild(tr);
  });

  tableWrap.appendChild(table);
  cont.appendChild(tableWrap);
}

async function renderPlanesGlobal(){
  await ensureDataLoaded();
  await ensurePlanesLoaded();

  const cont = document.getElementById('listPlanesGlobal');
  cont.innerHTML = '';

  const rows = (PLANES?.planes || []).map(p => ({
    ...p,
    ciudad: p.ciudad || (ALL.ciudades || []).find(c => c.city_id === p.city_id)?.ciudad || p.city_id
  }));

  if (!rows.length){
    cont.innerHTML = '<div class="muted">No hay planes cargados.</div>';
    return;
  }

  rows.sort((a,b) =>
    (a.ciudad||'').localeCompare(b.ciudad||'') ||
    (a.tipo||'').localeCompare(b.tipo||'')
  );

  const tableWrap = document.createElement('div');
  tableWrap.style.overflow = 'auto';

  const table = document.createElement('table');
  table.className = 'table-min';
  table.innerHTML = `
    <thead>
      <tr>
        <th style="min-width:160px">Ciudad</th>
        <th style="min-width:120px">Tipo de Plan</th>
        <th>Documento de Aprobación (DA)</th>
        <th style="min-width:110px">Año inicio</th>
        <th style="min-width:110px">Año fin</th>
        <th style="min-width:160px">Documento (DA)</th>
        <th style="min-width:140px">Plan</th>
        <th style="min-width:110px">Estado</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = table.querySelector('tbody');

  rows.forEach(p => {
    const docsHtml = p.doc_url  ? `<a href="${p.doc_url}"  target="_blank" rel="noopener">🔗 DA</a>`   : '<span class="muted">—</span>';
    const planHtml = p.plan_url ? `<a href="${p.plan_url}" target="_blank" rel="noopener">🔗 Plan</a>` : '<span class="muted">—</span>';
    const estCls = `badge ${badgeEstado(p.estado)}`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.ciudad || '—'}</td>
      <td>${p.tipo || '—'}</td>
      <td>${p.doc_aprob || '—'}</td>
      <td>${p.anio_inicio ?? '—'}</td>
      <td>${p.anio_fin ?? '—'}</td>
      <td class="cell-docs">${docsHtml}</td>
      <td class="cell-docs">${planHtml}</td>
      <td><span class="${estCls}">${p.estado || '—'}</span></td>
    `;
    tbody.appendChild(tr);
  });

  tableWrap.appendChild(table);
  cont.appendChild(tableWrap);
}

// ========= RENDER: CONVENIOS (DETALLE POR CIUDAD) =========
async function renderConvenios(){
  await ensureDataLoaded();
  const ind = (ALL?.ciudades||[]).find(x=>x.city_id===currentCityId) || {};
  document.getElementById('titleConvenios').textContent = ind.ciudad || '—';
  const cont = document.getElementById('listConvenios');
  cont.innerHTML = '';

  const g = ind.gestion || {};
  const items = Array.isArray(g.convenios_detalle) ? g.convenios_detalle : [];

  if (!items.length){
    cont.insertAdjacentHTML('beforeend','<div class="muted">No hay registros de convenios para esta ciudad.</div>');
    return;
  }

  const tableWrap = document.createElement('div');
  tableWrap.style.overflow = 'auto';

  const table = document.createElement('table');
  table.className = 'table-min';
  table.innerHTML = `
    <thead>
      <tr>
        <th style="min-width:100px">Tipo</th>
        <th>Nombre</th>
        <th style="min-width:120px">Suscripción</th>
        <th style="min-width:120px">Fin</th>
        <th style="min-width:120px">Estado</th>
        <th style="min-width:240px">Documentos</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = table.querySelector('tbody');

  items.forEach(row => {
    const tr = document.createElement('tr');

    const tipo = row.tipo || '—';
    const nombre = row.nombre || '—';

    // El Apps Script ya manda inicio/fin/estado reales del Sheet
    // (Fecha_suscripcion / Fecha_vencimiento / Estado_convenio), ya no hace
    // falta calcular nada acá.
    const fSus = row.inicio ? fmtISODateLocal(row.inicio) : '—';
    const fFin = row.fin ? fmtISODateLocal(row.fin) : '—';
    const est  = row.estado || '—';
    const estCls = `badge ${badgeEstado(est)}`;

    const docs = Array.isArray(row.documentos) ? row.documentos : [];
    const docsHtml = docs.length
      ? docs.map(d => `<a href="${d.url}" target="_blank" rel="noopener">🔗 ${d.label || 'Documento'}</a>`).join('')
      : '<span class="muted">—</span>';

    tr.innerHTML = `
      <td>${tipo}</td>
      <td>${nombre}</td>
      <td>${fSus}</td>
      <td>${fFin}</td>
      <td><span class="${estCls}">${est}</span></td>
      <td class="cell-docs">${docsHtml}</td>
    `;
    tbody.appendChild(tr);
  });

  tableWrap.appendChild(table);
  cont.appendChild(tableWrap);
}

// ========= RENDER: CONVENIOS (VISTA GLOBAL) =========
async function renderConveniosGlobal(){
  await ensureDataLoaded();

  const cont = document.getElementById('listConveniosGlobal');
  cont.innerHTML = '';

  const rows = [];

  (ALL.ciudades || []).forEach(c => {
    const g = c.gestion || {};
    const items = Array.isArray(g.convenios_detalle) ? g.convenios_detalle : [];

    // El Apps Script ya manda inicio/fin/estado reales del Sheet
    items.forEach(cv => {
      rows.push({
        ciudad: c.ciudad || c.city_id,
        tipo: cv.tipo || '—',
        nombre: cv.nombre || '—',
        inicio: cv.inicio ? fmtISODateLocal(cv.inicio) : '—',
        fin:    cv.fin ? fmtISODateLocal(cv.fin) : '—',
        estado: cv.estado || '—',
        documentos: Array.isArray(cv.documentos) ? cv.documentos : []
      });
    });
  });

  if (!rows.length){
    cont.innerHTML = '<div class="muted">No hay registros de convenios.</div>';
    return;
  }

  const tableWrap = document.createElement('div');
  tableWrap.style.overflow = 'auto';

  const table = document.createElement('table');
  table.className = 'table-min';
  table.innerHTML = `
    <thead>
      <tr>
        <th style="min-width:160px">Ciudad</th>
        <th style="min-width:100px">Tipo</th>
        <th>Nombre</th>
        <th style="min-width:120px">Suscripción</th>
        <th style="min-width:120px">Fin</th>
        <th style="min-width:120px">Estado</th>
        <th style="min-width:240px">Documentos</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = table.querySelector('tbody');

  rows.sort((a,b) => (a.ciudad||'').localeCompare(b.ciudad||''));

  rows.forEach(r => {
    const estCls = `badge ${badgeEstado(r.estado)}`;
    const docsHtml = r.documentos.length
      ? r.documentos.map(d => `<a href="${d.url}" target="_blank" rel="noopener">🔗 ${d.label || 'Documento'}</a>`).join('')
      : '<span class="muted">—</span>';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.ciudad}</td>
      <td>${r.tipo}</td>
      <td>${r.nombre}</td>
      <td>${r.inicio}</td>
      <td>${r.fin}</td>
      <td><span class="${estCls}">${r.estado}</span></td>
      <td class="cell-docs">${docsHtml}</td>
    `;
    tbody.appendChild(tr);
  });

  tableWrap.appendChild(table);
  cont.appendChild(tableWrap);
}

export {
  initModInfo,
  renderPlanes,
  renderPlanesGlobal,
  renderConvenios,
  renderConveniosGlobal
};
