/* ========= MÓDULO 3: PROYECTOS DE INVERSIÓN ========= */

const PROY_URL = './data/modulo3/proyectos.json';
let PROY_CACHE = null;

const MEF_URL = 'https://ofi5.mef.gob.pe/invierte/formato/verFicha?formatoId=';

/* ── helpers ── */
const fmtS = n => (n == null ? '—' : Number(n).toLocaleString('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 0 }));
const fmtN = n => (n == null ? '—' : Number(n).toLocaleString('es-PE'));

function estadoBadge(estado) {
  const s = (estado || '').toLowerCase();
  if (s.includes('concluido'))      return 'ok';
  if (s.includes('en ejecución') || s.includes('en ejecucion')) return 'warn';
  if (s.includes('formulación') || s.includes('formulacion'))   return 'muted';
  if (s.includes('paralizado'))     return 'danger';
  return 'muted';
}

function avanceBar(pct, color) {
  const v = Math.min(100, Math.max(0, Number(pct) || 0));
  return `
    <div style="display:flex;align-items:center;gap:6px">
      <div style="flex:1;height:8px;background:rgba(11,18,32,.08);border-radius:999px;overflow:hidden">
        <div style="width:${v}%;height:100%;background:${color};border-radius:999px;transition:width .4s ease"></div>
      </div>
      <span style="font-size:12px;min-width:32px;text-align:right">${v}%</span>
    </div>`;
}

/* ── carga de datos ── */
async function loadProyectos() {
  if (PROY_CACHE) return PROY_CACHE;
  const r = await fetch(PROY_URL, { cache: 'no-store' });
  if (!r.ok) throw new Error('No se pudo cargar proyectos.json');
  PROY_CACHE = await r.json();
  return PROY_CACHE;
}

/* ── render principal ── */
function renderProyectos(items, filtroEstado = '', filtroCiudad = '') {
  const cont = document.getElementById('proyCards');
  if (!cont) return;

  /* KPIs */
  const total      = items.length;
  const montoTotal = items.reduce((a, p) => a + (Number(p.monto_total) || 0), 0);
  const enEjec     = items.filter(p => (p.estado || '').toLowerCase().includes('en ejecución') || (p.estado || '').toLowerCase().includes('en ejecucion')).length;
  const promFisico = total ? Math.round(items.reduce((a, p) => a + (Number(p.avance_fisico) || 0), 0) / total) : 0;

  const kTotal  = document.getElementById('kPrTotal');
  const kMonto  = document.getElementById('kPrMonto');
  const kEjec   = document.getElementById('kPrEjec');
  const kAvance = document.getElementById('kPrAvance');
  if (kTotal)  kTotal.textContent  = fmtN(total);
  if (kMonto)  kMonto.textContent  = fmtS(montoTotal);
  if (kEjec)   kEjec.textContent   = fmtN(enEjec);
  if (kAvance) kAvance.textContent = promFisico + '%';

  /* Filtrado */
  let rows = [...items];
  if (filtroEstado) rows = rows.filter(p => p.estado === filtroEstado);
  if (filtroCiudad) rows = rows.filter(p => p.ciudad === filtroCiudad);

  if (!rows.length) {
    cont.innerHTML = '<div class="muted" style="padding:16px">No hay proyectos con los filtros seleccionados.</div>';
    return;
  }

  /* Tabla */
  cont.innerHTML = `
    <div style="overflow:auto">
      <table class="table-min">
        <thead>
          <tr>
            <th style="min-width:60px">CUI</th>
            <th style="min-width:260px">Nombre del proyecto</th>
            <th style="min-width:110px">Ciudad</th>
            <th style="min-width:110px">Tipo</th>
            <th style="min-width:130px">Monto (S/)</th>
            <th style="min-width:140px">Av. Físico</th>
            <th style="min-width:140px">Av. Financiero</th>
            <th style="min-width:120px">Estado</th>
            <th style="min-width:90px">Período</th>
            <th style="min-width:160px">Especialista</th>
            <th style="min-width:80px">MEF</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(p => `
            <tr>
              <td><span class="badge">${p.cui || '—'}</span></td>
              <td>
                <div style="font-weight:600;font-size:13px;line-height:1.3">${p.nombre || '—'}</div>
                ${p.observaciones ? `<div style="font-size:11px;color:var(--muted);margin-top:3px">${p.observaciones}</div>` : ''}
              </td>
              <td>${p.ciudad || '—'}</td>
              <td><span class="badge">${p.tipo || '—'}</span></td>
              <td style="font-weight:700">${fmtS(p.monto_total)}</td>
              <td>${avanceBar(p.avance_fisico, '#3b82f6')}</td>
              <td>${avanceBar(p.avance_financiero, '#34d399')}</td>
              <td><span class="badge ${estadoBadge(p.estado)}">${p.estado || '—'}</span></td>
              <td style="font-size:12px">${p.anio_inicio || '—'} – ${p.anio_fin || '—'}</td>
              <td style="font-size:12px">${p.especialista || '—'}<br><span class="muted" style="font-size:11px">${p.fuente || ''}</span></td>
              <td>
                ${p.cui ? `<a class="pill" href="${MEF_URL}${p.cui}" target="_blank" rel="noopener" style="font-size:12px">🔗 Ficha</a>` : '<span class="muted">—</span>'}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
}

/* ── filtros ── */
function buildFiltros(items) {
  const selEstado  = document.getElementById('proyFiltroEstado');
  const selCiudad  = document.getElementById('proyFiltroCiudad');
  if (!selEstado || !selCiudad) return;

  const estados  = [...new Set(items.map(p => p.estado).filter(Boolean))].sort();
  const ciudades = [...new Set(items.map(p => p.ciudad).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));

  selEstado.innerHTML  = '<option value="">Todos los estados</option>'  + estados.map(e  => `<option>${e}</option>`).join('');
  selCiudad.innerHTML  = '<option value="">Todas las ciudades</option>' + ciudades.map(c => `<option>${c}</option>`).join('');

  const onChange = () => renderProyectos(items, selEstado.value, selCiudad.value);
  selEstado.addEventListener('change', onChange);
  selCiudad.addEventListener('change', onChange);
}

/* ── entrada pública ── */
export async function initModProyectos() {
  const cont = document.getElementById('proyCards');
  const tabs = document.getElementById('proyTabs');
  if (!cont) return;

  cont.innerHTML = '<div class="muted" style="padding:16px">Cargando proyectos…</div>';

  try {
    const data = await loadProyectos();
    const items = data?.proyectos || [];
    buildFiltros(items);
    renderProyectos(items);
  } catch (err) {
    console.error(err);
    cont.innerHTML = '<div class="muted" style="padding:16px">No se pudo cargar el listado de proyectos.</div>';
  }
}
