 /* ========= MODULO 4: Operación y Servicios de Movilidad ========= */
/* Gráficos: usa el adaptador (ApexCharts) y, si no está, Chart.js como antes */
function mkChart(canvas, cfg){
  return (window.PVChart ? window.PVChart(canvas, cfg) : new Chart(canvas, cfg));
}
    const selOperacion   = document.getElementById('citySelOperacion');
    const titleOperacion = document.getElementById('titleOperacion');
   
    const GEI_DATA = {
    TRUJILLO: {
        co2: 44964.74,
        pm25: 7.82,
        trees: 1494414,
        fleet: { Autos:63, Microbuses:1378, Minibuses:436, Omnibus:533 },
        empresas: 40,
        vehiculos: 2410,
        distancia: 43174.59,
        combustibles: ['Diésel','Gasolina','GLP','GNV']
    },
    AREQUIPA: {
        co2: 29888.27,
        pm25: 6.33,
        trees: 2248237,
        fleet: { Microbuses:109, Minibuses:1767, Omnibus:242 },
        empresas: 10,
        vehiculos: 2118,
        distancia: 40765.36,
        combustibles: ['Diésel']
    },
    PIURA: {
        co2: 18785.13,
        pm25: 1.82,
        trees: 939257,
        fleet: { Microbuses:326, Omnibus:137 },
        empresas: 11,
        vehiculos: 463,
        distancia: 71735.71,
        combustibles: ['Diésel','GLP','GNV']
    }
    };

    /* ========= GEI DOM ========= */
    const paneGEI        = document.getElementById('paneGEI');
    const geiMsgNoData = document.getElementById('geiMsgNoData');
    const kGeiCO2        = document.getElementById('kGeiCO2');
    const kGeiPM         = document.getElementById('kGeiPM');
    const kGeiTrees      = document.getElementById('kGeiTrees');
    const kGeiEmpresas     = document.getElementById('kGeiEmpresas');
    const kGeiVehiculos   = document.getElementById('kGeiVehiculos');
    const kGeiDistancia   = document.getElementById('kGeiDistancia');
    const kGeiCombustibles= document.getElementById('kGeiCombustibles');


    const geiBarCanvas   = document.getElementById('geiBarChart');
    const geiFleetCanvas = document.getElementById('geiFleetChart');

    let geiBarChart   = null;
    let geiFleetChart = null;

    // KPIs (pestañas "Indicadores" + "Variables Principales" del Sheet)
    const kDensidadPob      = document.getElementById('kDensidadPob');
    const kPctViajesTP      = document.getElementById('kPctViajesTP');
    const kEmpresasTP10k    = document.getElementById('kEmpresasTP10k');
    const kEmpresasTPAut    = document.getElementById('kEmpresasTPAut');
    const kVelocidadTP      = document.getElementById('kVelocidadTP');
    const kAntiguedadFlota  = document.getElementById('kAntiguedadFlota');
    const kSiniestrosViales = document.getElementById('kSiniestrosViales');
    const kDensidadSem      = document.getElementById('kDensidadSem');
    const kTasaMotorizacion = document.getElementById('kTasaMotorizacion');
    const kFlotaHabilitada  = document.getElementById('kFlotaHabilitada');
    const kKmCiclovias      = document.getElementById('kKmCiclovias');

    // Selector de rutas
    const routeSelOperacion = document.getElementById('routeSelOperacion');

    // Estado local del módulo 4
    const IND_OP_URL = 'https://script.google.com/macros/s/AKfycbxGtEY-WPxG5DE4C-7eaRnrIZmG6vi0y7Xd0uxmjTgpNDIGllnisiQ4Er01yEuG4Rzn/exec?tipo=indicadores';
    let IND_OP = null;
    let IND_OP_PROMISE = null;  // memoización con reintentos
    let currentOpCity = null;

    // KPI de Operación desde Google Sheets (Apps Script — mismo Web App de Mod 1)
    const KPI_OP_URL = 'https://script.google.com/macros/s/AKfycbxGtEY-WPxG5DE4C-7eaRnrIZmG6vi0y7Xd0uxmjTgpNDIGllnisiQ4Er01yEuG4Rzn/exec?tipo=kpiOperacion';
    let KPI_OP = null;
    let KPI_OP_PROMISE = null;

    // Normaliza nombre de ciudad para cruzar con el JSON del Sheet (igual que en el Apps Script)
    function normOp(name){
      return String(name || '')
        .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
        .toUpperCase().trim().replace(/\s+/g,' ');
    }

    async function ensureKpiOpLoaded(){
      if (KPI_OP) return;
      if (KPI_OP_PROMISE) return KPI_OP_PROMISE;

      KPI_OP_PROMISE = (async () => {
        try {
          const r = await fetch(KPI_OP_URL, { cache:'no-store' });
          const data = r.ok ? await r.json() : { ciudades: [] };
          KPI_OP = data.ciudades || [];
        } catch(e){
          console.warn('No se pudo cargar KPI de Operación (Sheet)', e);
          KPI_OP = [];
        }
      })();

      return KPI_OP_PROMISE;
    }

    const fmtKpiOp = v => (v==null ? '—' : Number(v).toLocaleString('es-PE', { maximumFractionDigits:2 }));
    const pctKpiOp = v => (v==null ? '—' : Number(v).toLocaleString('es-PE', { maximumFractionDigits:1 }) + '%');

    async function renderKpiOperacionSheet(cityName){
      await ensureKpiOpLoaded();
      const row = (KPI_OP || []).find(c => normOp(c.ciudad) === normOp(cityName));
      const k = row ? (row.kpis || {}) : {};

      if (kDensidadPob)      kDensidadPob.textContent      = fmtKpiOp(k.densidad_poblacional);
      if (kPctViajesTP)      kPctViajesTP.textContent      = pctKpiOp(k.pct_viajes_tp);
      if (kEmpresasTP10k)    kEmpresasTP10k.textContent    = fmtKpiOp(k.empresas_tp_10k);
      if (kEmpresasTPAut)    kEmpresasTPAut.textContent    = fmtKpiOp(k.empresas_tp_autorizadas);
      if (kVelocidadTP)      kVelocidadTP.textContent      = fmtKpiOp(k.velocidad_tp_punta);
      if (kAntiguedadFlota)  kAntiguedadFlota.textContent  = fmtKpiOp(k.antiguedad_flota);
      if (kSiniestrosViales) kSiniestrosViales.textContent = fmtKpiOp(k.siniestros_viales_10k);
      if (kDensidadSem)      kDensidadSem.textContent      = fmtKpiOp(k.densidad_semaforica);
      if (kTasaMotorizacion) kTasaMotorizacion.textContent = fmtKpiOp(k.tasa_motorizacion);
      if (kFlotaHabilitada)  kFlotaHabilitada.textContent  = fmtKpiOp(k.flota_habilitada);
      if (kKmCiclovias)      kKmCiclovias.textContent      = fmtKpiOp(k.km_ciclovias);
    }

    // Persistencia de ciudad (Mod 4)
    const LS_OP_CITY = 'pd_mod4_city';

    function saveOpCity(v){
      try { localStorage.setItem(LS_OP_CITY, v || ''); } catch(e){}
    }
    function loadOpCity(){
      try { return localStorage.getItem(LS_OP_CITY) || null; } catch(e){ return null; }
    }


    // Helpers Mod 4
    const fmtOp = n => Number(n).toLocaleString('es-PE');
    const cleanStrOp = v => (v==null ? '' : String(v).trim());
    const toNumOp = v => {
      if (v === null || v === undefined) return 0;
      if (typeof v === 'number') return v;
      const s = cleanStrOp(v);
      if (!s || s === '—' || s.toLowerCase() === 'na') return 0;
      const n = Number(s.replace(/[, ]/g,''));
      return Number.isFinite(n) ? n : 0;
    };
    const sumOrDashOp = (rows, key) => {
      const hasNumeric = rows.some(r => toNumOp(r[key]) > 0);
      if (!hasNumeric) {
        const allBlankish = rows.every(r => cleanStrOp(r[key]) === '' || cleanStrOp(r[key]) === '—');
        return allBlankish ? '—' : fmtOp(rows.reduce((a,r)=>a+toNumOp(r[key]),0));
      }
      return fmtOp(rows.reduce((a,r)=>a+toNumOp(r[key]),0));
    };

    // ===== Helpers que faltaban (necesarios en módulo ES) =====
    function citySlug(name){
    return String(name||'')
        .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
        .replace(/[^\w]+/g,'_')
        .toUpperCase()
        .trim();
    }

    async function pickFirstExisting(urls){
    for (const u of (urls || [])){
        if (!u) continue;
        try{
        const r = await fetch(u, { method:'HEAD', cache:'no-store' });
        if (r.ok) return u;
        }catch(e){}
    }
    return null;
    }

    // Para los fallbacks de Siniestros (encuadre por límite/centroide)
    let ALL = null;

    async function ensureDataLoaded(){
    if (ALL) return ALL;
    try{
        const r = await fetch('./data/modulo1/all.json', { cache:'no-store' });
        ALL = r.ok ? await r.json() : { ciudades: [] };
    }catch(e){
        ALL = { ciudades: [] };
    }
    return ALL;
    }

    function renderGEI(){
    if (!currentOpCity) return;

    const key = String(currentOpCity || '')
    .toUpperCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[^A-Z]/g,"");
    const d = GEI_DATA[key];


    // Si la ciudad no es una de las 3
    if (!d){
    // 👉 MOSTRAR mensaje de no data
    if (geiMsgNoData) geiMsgNoData.style.display = 'block';

    // Limpiar KPIs
    if (kGeiCO2) kGeiCO2.textContent = '—';
    if (kGeiPM) kGeiPM.textContent = '—';
    if (kGeiTrees) kGeiTrees.textContent = '—';
    if (kGeiEmpresas)      kGeiEmpresas.textContent = '—';
    if (kGeiVehiculos)    kGeiVehiculos.textContent = '—';
    if (kGeiDistancia)    kGeiDistancia.textContent = '—';
    if (kGeiCombustibles) kGeiCombustibles.textContent = '—';


    // Destruir charts si existen
    if (geiBarChart) { geiBarChart.destroy(); geiBarChart = null; }
    if (geiFleetChart) { geiFleetChart.destroy(); geiFleetChart = null; }

    return;
    }

    // 👉 OCULTAR mensaje cuando sí hay data
    if (geiMsgNoData) geiMsgNoData.style.display = 'none';



    // KPIs
    if (kGeiCO2)   kGeiCO2.textContent   = Number(d.co2).toLocaleString('es-PE');
    if (kGeiPM)    kGeiPM.textContent    = Number(d.pm25).toLocaleString('es-PE');
    if (kGeiTrees) kGeiTrees.textContent = Number(d.trees).toLocaleString('es-PE');
    if (kGeiEmpresas) kGeiEmpresas.textContent = d.empresas.toLocaleString('es-PE');
    if (kGeiVehiculos) kGeiVehiculos.textContent = d.vehiculos.toLocaleString('es-PE');
    if (kGeiDistancia) kGeiDistancia.textContent = d.distancia.toLocaleString('es-PE');
    if (kGeiCombustibles) kGeiCombustibles.textContent = d.combustibles.join(', ');


    // Chart 1: Barras (GEI tCO2eq por ciudad)
    try { if (geiBarChart) { geiBarChart.destroy(); geiBarChart = null; } } catch(e){}
    if (geiBarCanvas){
        geiBarChart = mkChart(geiBarCanvas, {
        pv: { height: 240, fmt: 'int' },
        type: 'bar',
        data: {
            labels: ['TRUJILLO','AREQUIPA','PIURA'],
            datasets: [{
            label: 'tCO₂eq (2021)',
            data: [GEI_DATA.TRUJILLO.co2, GEI_DATA.AREQUIPA.co2, GEI_DATA.PIURA.co2]
            }]
        },
        options: {
            responsive: true,
            plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: { label: (ctx) => ` ${ctx.parsed.y?.toLocaleString('es-PE') || 0}` }
            }
            },
            scales: {
            y: { beginAtZero: true, ticks:{ precision:0 }, title:{ display:true, text:'tCO₂eq' } }
            }
        }
        });

    }

    // Chart 2: Dona (composición flota de ciudad seleccionada)
    try { if (geiFleetChart) { geiFleetChart.destroy(); geiFleetChart = null; } } catch(e){}
    if (geiFleetCanvas){
        const labels = Object.keys(d.fleet || {});
        const values = Object.values(d.fleet || {});
        geiFleetChart = mkChart(geiFleetCanvas, {
        pv: { height: 230, center: 'total', fmt: 'int' },
        type: 'doughnut',
        data: {
            labels,
            datasets: [{ data: values }]
        },
        options: {
            responsive: true,
            plugins: {
            legend: { position: 'bottom' }
            }
        }
        });
    }
    }

    /* ===================== MOD 4: Acoso (GIZ) ===================== */
    const ACOSO_URL = 'https://script.google.com/macros/s/AKfycbxGtEY-WPxG5DE4C-7eaRnrIZmG6vi0y7Xd0uxmjTgpNDIGllnisiQ4Er01yEuG4Rzn/exec?tipo=acoso';

    let ACOSO_DATA = null;
    let ACOSO_PROMISE = null;

    // KPIs
    const kAcoN         = document.getElementById('kAcoN');
    const kAcoSilencio  = document.getElementById('kAcoSilencio'); // NUEVO
    const kAcoDenuncio  = document.getElementById('kAcoDenuncio');
    const kAcoRiesgo    = document.getElementById('kAcoRiesgo');

    // Charts (donuts)
    const acoVictimaCanvas  = document.getElementById('acoVictimaChart');
    const acoDenuncioCanvas = document.getElementById('acoDenuncioChart'); // NUEVO
    const acoInfoCanvas     = document.getElementById('acoInfoChart');     // NUEVO
    const acoCampCanvas     = document.getElementById('acoCampaniaChart'); // NUEVO
    const acoTiposCanvas    = document.getElementById('acoTiposChart');    // NUEVO
    const acoMotivosCanvas  = document.getElementById('acoMotivosChart');  // NUEVO
    const kAcoSeguridad     = document.getElementById('kAcoSeguridad');    // NUEVO
    const kAcoAtencion      = document.getElementById('kAcoAtencion');     // NUEVO

    let acoVictimaChart  = null;
    let acoDenuncioChart = null;
    let acoInfoChart     = null;
    let acoCampChart     = null;
    let acoTiposChart    = null;
    let acoMotivosChart  = null;

    function cleanupAcosoCharts(){
    try { if (acoVictimaChart)  { acoVictimaChart.destroy();  acoVictimaChart = null; } } catch(e){}
    try { if (acoDenuncioChart) { acoDenuncioChart.destroy(); acoDenuncioChart = null; } } catch(e){}
    try { if (acoInfoChart)     { acoInfoChart.destroy();     acoInfoChart = null; } } catch(e){}
    try { if (acoCampChart)     { acoCampChart.destroy();     acoCampChart = null; } } catch(e){}
    try { if (acoTiposChart)    { acoTiposChart.destroy();    acoTiposChart = null; } } catch(e){}
    try { if (acoMotivosChart)  { acoMotivosChart.destroy();  acoMotivosChart = null; } } catch(e){}
    }

    function showAcoLoader(msgTitle = 'Cargando…', msgSub = 'Datos de Acoso (GIZ)') {
      const host = document.getElementById('paneAcoso');
      if (!host) return;

      let overlay = host.querySelector('.aco-loader');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'aco-loader';
        overlay.style.cssText = `
          position:absolute; inset:0;
          display:flex; align-items:center; justify-content:center;
          background:rgba(255,255,255,.65);
          z-index:10000; font-weight:600; border-radius:12px;
        `;
        const box = document.createElement('div');
        box.style.cssText = `
          background:#fff; border:1px solid var(--ring,#e5e7eb); border-radius:14px;
          padding:14px 18px; box-shadow:0 10px 30px rgba(0,0,0,.08); min-width:240px;
          text-align:left; font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu;
        `;
        box.innerHTML = `
          <div style="display:flex;gap:10px;align-items:center">
            <div style="width:20px;height:20px;border:3px solid #e5e7eb;border-top-color:var(--brand,#0ea5e9);border-radius:50%;animation:spin .9s linear infinite"></div>
            <div>
              <div class="t" style="font-weight:700">${msgTitle}</div>
              <div class="s" style="color:#6b7280;font-size:13px">${msgSub}</div>
            </div>
          </div>
        `;
        overlay.appendChild(box);
        if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
        host.appendChild(overlay);
      } else {
        overlay.style.display = 'flex';
      }
    }

    function hideAcoLoader() {
      const overlay = document.querySelector('#paneAcoso .aco-loader');
      if (overlay) overlay.style.display = 'none';
    }

    function hideGEI(){
    if (paneGEI) paneGEI.style.display = 'none';
    if (geiMsgNoData) geiMsgNoData.style.display = 'none';

    // limpiar KPIs (opcional)
    if (kGeiCO2) kGeiCO2.textContent = '—';
    if (kGeiPM) kGeiPM.textContent = '—';
    if (kGeiTrees) kGeiTrees.textContent = '—';
    if (kGeiEmpresas) kGeiEmpresas.textContent = '—';
    if (kGeiVehiculos) kGeiVehiculos.textContent = '—';
    if (kGeiDistancia) kGeiDistancia.textContent = '—';
    if (kGeiCombustibles) kGeiCombustibles.textContent = '—';

    // destruir charts para que NO queden “pegados”
    try { if (geiBarChart) { geiBarChart.destroy(); geiBarChart = null; } } catch(e){}
    try { if (geiFleetChart) { geiFleetChart.destroy(); geiFleetChart = null; } } catch(e){}
  }

    function resetSubtabsOperacion(){
      setOperacionSubtab('rutas');
    }

    function setOperacionSubtab(which){
      const paneRutas = document.getElementById('paneRutas');
      const paneSem   = document.getElementById('paneSemaforos');
      const paneSin   = document.getElementById('paneSiniestros');
      const paneAco   = document.getElementById('paneAcoso');
      const paneGEI   = document.getElementById('paneGEI');

      const routeSelOperacion = document.getElementById('routeSelOperacion');
      const yearSelSiniestros = document.getElementById('yearSelSiniestros');

      const showRutas = (which === 'rutas');
      const showSem   = (which === 'semaforos');
      const showSin   = (which === 'siniestros');
      const showAco   = (which === 'acoso');
      const showGEI   = (which === 'gei');

      // ✅ al salir de GEI: primero limpiar y luego ocultar
      if (!showGEI && typeof hideGEI === 'function') hideGEI();

      // Mostrar/ocultar panes
      if (paneRutas) paneRutas.style.display = showRutas ? '' : 'none';
      if (paneSem)   paneSem.style.display   = showSem   ? '' : 'none';
      if (paneSin)   paneSin.style.display   = showSin   ? '' : 'none';
      if (paneAco)   paneAco.style.display   = showAco   ? '' : 'none';
      if (paneGEI)   paneGEI.style.display   = showGEI   ? '' : 'none';

      // Mostrar/ocultar controles
      if (routeSelOperacion) routeSelOperacion.style.display = showRutas ? '' : 'none';
      if (yearSelSiniestros) yearSelSiniestros.style.display = showSin ? '' : 'none';

      // ✅ al entrar a GEI: render después de mostrar (evita width 0)
      if (showGEI && typeof renderGEI === 'function') {
        requestAnimationFrame(() => renderGEI());
      }

      // ✅ al entrar a Semáforos: cargar puntos
      if (showSem && typeof loadSemaforosForCity === 'function') {
        requestAnimationFrame(() => loadSemaforosForCity(currentOpCity));
      }


      // ✅ al entrar a Siniestros: reset + render (con token)
      if (showSin && typeof renderSiniestros === 'function') {
        SIN_RENDER_SEQ++;
        resetSiniestrosUI();
        requestAnimationFrame(() => renderSiniestros());
      }

      // ✅ al entrar a Acoso: render
      if (showAco && typeof renderAcoso === 'function') {
        requestAnimationFrame(() => renderAcoso());
      }

      // ✅ al entrar a Rutas: ajustar tamaño del mapa
      if (showRutas) {
        setTimeout(() => mapOperacion?.invalidateSize(), 80);
      }
      // Activo el botón
      const subt = document.getElementById('subtabsOperacion');
      if (subt){
        subt.querySelectorAll('.subtab').forEach(b => b.classList.remove('active'));
        const btn = subt.querySelector(`.subtab[data-tab="${which}"]`);
        if (btn) btn.classList.add('active');
      }
    }



    // ======= Carga robusta con reintentos =======
    async function ensureIndicatorsLoaded(){
      if (IND_OP) return;
      if (IND_OP_PROMISE) return IND_OP_PROMISE;

      IND_OP_PROMISE = (async () => {
        const delays = [0, 150, 400]; // 3 intentos
        for (const d of delays){
          if (d) await new Promise(r => setTimeout(r, d));
          try {
            const r = await fetch(IND_OP_URL, { cache: 'no-store' });
            if (r.ok) { IND_OP = (await r.json()).ciudades || []; return; } // ← el Sheet devuelve {version, ciudades:[...]}
          } catch (e) { /* reintenta */ }
        }
        console.warn('No se pudo cargar indicadores desde el Sheet');
        IND_OP = []; // fallback seguro
      })();

      return IND_OP_PROMISE;
    }

    async function ensureAcosoLoaded(){
      if (ACOSO_DATA) return;
      if (ACOSO_PROMISE) return ACOSO_PROMISE;

      ACOSO_PROMISE = (async () => {
        try {
          const r = await fetch(ACOSO_URL, { cache:'no-store' });
          const json = r.ok ? await r.json() : null;
          ACOSO_DATA = json ? json.acoso : null; // ← el Sheet devuelve {version, acoso:{...}}
        } catch(e){
          console.warn('No se pudo cargar datos de Acoso desde el Sheet', e);
          ACOSO_DATA = null;
        }
      })();

      return ACOSO_PROMISE;
    }

    async function loadCitiesForOperacion(){
      await ensureIndicatorsLoaded();

      const cities = [...new Set((IND_OP||[])
        .map(r => r.ciudad)
        .filter(Boolean))]
        .sort((a,b)=> a.localeCompare(b, 'es', {sensitivity:'base'}));

          // Recuperar ciudad guardada (si existe)
      const saved = loadOpCity();
      if (!currentOpCity && saved && cities.includes(saved)) currentOpCity = saved;

        
      if (!cities.length){
        if (selOperacion) selOperacion.innerHTML = '';
        return;
      }

      // poblar selector (idempotente)
      selOperacion.innerHTML = '';
      cities.forEach(city => {
        const opt = document.createElement('option');
        opt.value = city;
        opt.textContent = city.toUpperCase();
        selOperacion.appendChild(opt);
      });

      if (!currentOpCity) currentOpCity = cities[0];
      selOperacion.value = currentOpCity;

      if (!selOperacion._bound){
        selOperacion.addEventListener('change', e => {
        currentOpCity = e.target.value;
        saveOpCity(currentOpCity);
        renderCityOperacion(currentOpCity);

        // refrescar según pestaña activa (evita doble render)
        const activeTab = document.querySelector('#mod-operacion .subtab.active')?.dataset?.tab || 'rutas';

        if (activeTab === 'siniestros' && typeof renderSiniestros === 'function') {
          SIN_RENDER_SEQ++;
          resetSiniestrosUI();
          if (yearSelSiniestros) yearSelSiniestros.value = '';
          renderSiniestros();
        }

        if (activeTab === 'acoso' && typeof renderAcoso === 'function') {
          renderAcoso();
        }

        if (activeTab === 'gei' && typeof renderGEI === 'function') {
          renderGEI();
        }

        if (activeTab === 'semaforos' && typeof loadSemaforosForCity === 'function') {
          loadSemaforosForCity(currentOpCity);
        }

        });
        selOperacion._bound = true;
      }
      }

    async function renderCityOperacion(cityName){
      await ensureIndicatorsLoaded();
      if (!cityName) return;

      showOpLoader('Cargando…', 'Indicadores de la ciudad'); // ← NUEVO: avisa desde el inicio

      titleOperacion.textContent = (cityName || '—').toUpperCase();

      // KPIs (Sheet: Indicadores + Variables Principales)
      await renderKpiOperacionSheet(cityName);

      // Mapa de rutas (sigue igual, se queda con los GeoJSON locales)
      await loadRoutesForOperacion(cityName);
    }

    /* ====== MAPA (Mod 4) ====== */
    let mapOperacion, layerOperacion;

    // === Capa de rutas (GeoJSON por ciudad) ===
    const ROUTES_BASE_OP = './data/modulo4/transporte/';

    // (opcional) alias si el nombre del archivo no coincide 1:1 con la ciudad
    const OP_ROUTES_MAP = {
      'TARAPOTO': 'TARAPOTO.geojson',
      'TRUJILLO': 'TRUJILLO.geojson',
      'TUMBES':   'TUMBES.geojson',
      // agrega más si los nombres difieren
    };

    // Estilos
    const ROUTE_STYLE      = { color:'#0ea5e9', weight:3, opacity:0.9 };
    const ROUTE_DIM_STYLE  = { color:'#94a3b8', weight:2, opacity:0.35 };
    const ROUTE_HL_STYLE   = { color:'#0ea5e9', weight:5, opacity:1 };
    const ROUTE_HIDE_STYLE = { opacity:0, fillOpacity:0, weight:0 }; // invisible

    // Campos candidatos para el nombre/código (prioriza 'layer')
    const ROUTE_KEY_FIELDS = ['layer','Layer','ruta','Ruta','name','Nombre','NOMBRE','codigo','CODIGO'];
    function getRouteKey(feature){
      const p = feature?.properties || {};
      for (const k of ROUTE_KEY_FIELDS){
        const v = p[k];
        if (v != null && String(v).trim() && String(v) !== '—') return String(v).trim();
      }
      return null;
    }

    // Índice de capas por nombre de ruta
    let opRoutesIndex = new Map();   // nombreRuta -> [layers]
    let opAllRoutesGroup = null;     // L.GeoJSON actual

    async function loadRoutesForOperacion(cityName){
      if (!mapOperacion || !layerOperacion) return;

      // ▶️ Mostrar overlay tipo Siniestros
      showOpLoader('Cargando 1 capa…', 'Rutas de transporte');

      // limpiar estado anterior
      layerOperacion.clearLayers();
      opRoutesIndex.clear();
      opAllRoutesGroup = null;

      // reset del selector (si existe en HTML)
      if (routeSelOperacion){
        routeSelOperacion.innerHTML = '<option value="">Todas las rutas</option>';
        routeSelOperacion.disabled = true;
      }

      const pretty = String(cityName || '').trim();
      const slug   = (typeof citySlug === 'function') ? citySlug(pretty) : pretty.toUpperCase();

      const candidates = [
        OP_ROUTES_MAP[pretty.toUpperCase()] ? ROUTES_BASE_OP + OP_ROUTES_MAP[pretty.toUpperCase()] : null,
        `${ROUTES_BASE_OP}${slug}.geojson`,
        `${ROUTES_BASE_OP}${pretty.toUpperCase()}.geojson`,
        `${ROUTES_BASE_OP}${pretty}.geojson`,
      ].filter(Boolean);

      const url = await pickFirstExisting(candidates);
      if (!url){
        console.warn('GeoJSON no encontrado para', cityName, candidates);
        hideOpLoader('Sin datos');
        return;
      }

      try {
        const geo = await fetch(url, {cache:'no-store'}).then(r=>r.json());

        // Dibujar e indexar por nombre de ruta (sin tooltips)
        opAllRoutesGroup = L.geoJSON(geo, {
          style: ROUTE_STYLE,
          pointToLayer: (f, latlng) => L.circleMarker(latlng, {
            radius:5, color:ROUTE_STYLE.color, fillColor:ROUTE_STYLE.color, fillOpacity:0.8, weight:1
          }),
          onEachFeature: (f, l) => {
            const n = getRouteKey(f);
            if (n){
              if (!opRoutesIndex.has(n)) opRoutesIndex.set(n, []);
              opRoutesIndex.get(n).push(l);
            }
          }
        }).addTo(layerOperacion);

        // encuadre total
        try {
          const bb = opAllRoutesGroup.getBounds();
          if (bb && bb.isValid()) mapOperacion.fitBounds(bb, { padding:[16,16] });
        } catch(e){}

        // ✅ Termina OK (mostramos “¡Listo!” y ocultamos)
        hideOpLoader('¡Listo!');
      } catch(e){
        console.error('Error cargando rutas:', e);
        hideOpLoader('Error al cargar');
        return;
      }

      // poblar selector
      if (routeSelOperacion){
        const names = [...opRoutesIndex.keys()].sort((a,b)=> a.localeCompare(b,'es',{sensitivity:'base'}));
        if (names.length){
          for (const name of names){
            const opt = document.createElement('option');
            opt.value = name;
            opt.textContent = name;
            routeSelOperacion.appendChild(opt);
          }
          routeSelOperacion.disabled = false;
        }

        if (!routeSelOperacion._bound){
          routeSelOperacion.addEventListener('change', e => highlightSelectedRoute(e.target.value));
          routeSelOperacion._bound = true;
        }
      }
    }

    function resetAllRouteStyles(){
      if (!opAllRoutesGroup) return;
      opAllRoutesGroup.eachLayer(l => {
        if (l.setStyle) l.setStyle(ROUTE_STYLE);
        if (l.setRadius && l.setStyle) l.setStyle({ color: ROUTE_STYLE.color, fillColor: ROUTE_STYLE.color, opacity: ROUTE_STYLE.opacity });
      });
    }

    function highlightSelectedRoute(name){
      if (!opAllRoutesGroup) return;

      if (!name){
        resetAllRouteStyles();
        try {
          const bb = opAllRoutesGroup.getBounds();
          if (bb && bb.isValid()) mapOperacion.fitBounds(bb, { padding:[16,16] });
        } catch(e){}
        return;
      }

      // Oculta todo
      opAllRoutesGroup.eachLayer(l => {
        if (l.setStyle) l.setStyle(ROUTE_HIDE_STYLE);
        if (l.setRadius) l.setRadius(0);
      });

      // Resalta solo la ruta elegida + bounds
      const layers = opRoutesIndex.get(name) || [];
      let bounds = null;

      layers.forEach(l => {
        if (l.setStyle) l.setStyle(ROUTE_HL_STYLE);
        if (l.setRadius) l.setRadius(5);
        if (l.getBounds) {
          const b = l.getBounds();
          bounds = bounds ? bounds.extend(b) : L.latLngBounds(b.getSouthWest(), b.getNorthEast());
        } else if (l.getLatLng) {
          const p = l.getLatLng();
          bounds = bounds ? bounds.extend(p) : L.latLngBounds(p, p);
        }
      });

      if (bounds && bounds.isValid()) mapOperacion.fitBounds(bounds, { padding:[16,16] });
    }

    export async function initModOperacion(){

      // ▶️ Loader inmediato (antes tardaba ~4s en aparecer)
      showOpLoader('Cargando…', 'Datos de la ciudad');

      // 🔒 Bloquea las pestañas mientras carga, para evitar que entres a
      // Siniestros/Acoso/etc. antes de que la ciudad esté lista
      const subtabButtons = document.querySelectorAll('#subtabsOperacion .subtab');
      subtabButtons.forEach(b => b.disabled = true);

      // crea el mapa si no existe
      if (!mapOperacion){
        mapOperacion = L.map('mapOperacion', { scrollWheelZoom:false }).setView([-9.19,-75.01], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:'© OpenStreetMap'
        }).addTo(mapOperacion);
        layerOperacion = L.layerGroup().addTo(mapOperacion);

        const el = mapOperacion.getContainer();
        mapOperacion.scrollWheelZoom.disable();
        el.addEventListener('mouseenter', () => mapOperacion.scrollWheelZoom.enable(), { passive:true });
        el.addEventListener('mouseleave', () => mapOperacion.scrollWheelZoom.disable(), { passive:true });
      }

      // datos antes de poblar UI
      await ensureIndicatorsLoaded();

      // poblar selector de ciudades
      await loadCitiesForOperacion();

      // si no hay ciudad activa, usa la 1ra disponible
      if (!currentOpCity && selOperacion && selOperacion.options.length){
        currentOpCity = selOperacion.value || selOperacion.options[0].value;
      }

      // por si el contenedor pasó de display:none a block
      setTimeout(() => mapOperacion.invalidateSize(), 50);

      // render de ciudad
      if (currentOpCity){
        await renderCityOperacion(currentOpCity);
      } else {
        if (routeSelOperacion){
          routeSelOperacion.innerHTML = '<option value="">Todas las rutas</option>';
          routeSelOperacion.disabled = true;
        }
        hideOpLoader('Sin datos'); // ← NUEVO: si no hay ciudad, cierra el loader igual
      }

      // 🔓 Vuelve a habilitar las pestañas
      subtabButtons.forEach(b => b.disabled = false);

        // Estado inicial consistente: siempre iniciar en Rutas
        resetSubtabsOperacion();
        setOperacionSubtab('rutas');
        setTimeout(()=> mapOperacion?.invalidateSize(), 60);

    }

/* ===================== MOD 4: Siniestros (pestaña) ===================== */
    const yearSelSiniestros = document.getElementById('yearSelSiniestros');
    const paneRutas   = document.getElementById('paneRutas');
    const paneSin     = document.getElementById('paneSiniestros');
    const paneAco   = document.getElementById('paneAcoso');
    const kSin = document.getElementById('kSin');
    const kFal = document.getElementById('kFal');
    const kLes = document.getElementById('kLes');
    const kVeh = document.getElementById('kVeh'); // NUEVO: Vehículos dañados
    // Canvases y charts (Siniestros)
    const sinTipoCanvas  = document.getElementById('sinTipoChart');   // Zona (existente)
    const sinClaseCanvas = document.getElementById('sinClaseChart');  // NUEVO: Clase de siniestro
    const sinEvoCanvas   = document.getElementById('sinEvoChart');
    let sinTipoChart  = null;
    let sinClaseChart = null; // NUEVO
    let sinEvoChart   = null;


    // NUEVO: ahora hay 2 fuentes -> 'resumen' (KPIs, ya agregado por ciudad/año)
    // y 'detalle' (mapa + gráficas, con coordenadas/zona/clase por siniestro)
    let SIN_RESUMEN = null;
    let SIN_DETALLE = null;
    let mapSin, layerSin;
    const SIN_URL = 'https://script.google.com/macros/s/AKfycbxGtEY-WPxG5DE4C-7eaRnrIZmG6vi0y7Xd0uxmjTgpNDIGllnisiQ4Er01yEuG4Rzn/exec?tipo=siniestros';
    let SIN_RENDER_SEQ = 0;         // contador de renders (token)
    let sinLoading = false;         // flag de carga activa
    let sinDebounceTimer = null;    // para debouncing en cambios rápidos


    // helpers
    const toNumInt = v => Number(v) || 0;

    function isValidLatLon(lat, lon){
      return Number.isFinite(lat) && Number.isFinite(lon) &&
            lat >= -20 && lat <= 2 && lon >= -85 && lon <= -65; // Perú amplio
    }

    // Encadre inteligente: si queda muy lejos por outliers, cae al límite/centro de la ciudad
    async function smartFitMapSin(points, cityName){
      if (!mapSin) return;

      // sin puntos -> Perú
      if (!points || !points.length){
        mapSin.setView([-9.19,-75.01], 5);
        return;
      }

      // 1 punto -> acércate bastante
      if (points.length === 1){
        mapSin.setView(points[0], 12);
        return;
      }

      // varios puntos -> fitBounds con límite de zoom
      const bb = L.latLngBounds(points);
      if (!bb.isValid()){
        mapSin.setView(points[0], 12);
        return;
      }

      // extremos iguales (puntos repetidos -> “caja cero”)
      if (bb.getSouthWest().equals(bb.getNorthEast())){
        mapSin.setView(bb.getSouthWest(), 12);
        return;
      }

      // 1ª pasada
      mapSin.fitBounds(bb, { padding:[16,16], maxZoom: 14 });

      // 👇 Si después de encuadrar el zoom sigue MUY lejos (p.ej. < 8), cae a límite/centro de ciudad
      await new Promise(r => requestAnimationFrame(r));
      const z = mapSin.getZoom();
      if (Number.isFinite(z) && z < 8 && cityName){
        const ok = await fitToCitySmart(cityName); // límites (o centroide si no hay)
        if (!ok) mapSin.fitBounds(bb, { padding:[16,16], maxZoom: 12 });
      }
    }

    // Normaliza lugares: quita tildes, prefijos tipo "PROVINCIA DE", espacios, mayúsculas
    function normPlace(s){
      if (!s) return '';
      return String(s)
        .normalize('NFD').replace(/[\u0300-\u036f]/g,'')  // sin tildes
        .toUpperCase()
        .replace(/\bPROVINCIA\s+DE\b/g, '')              // "PROVINCIA DE "
        .replace(/\bPROV\.?\b/g, '')                     // "PROV."
        .replace(/\bDPT[OO]\b/g, '')                     // "DPTO"
        .replace(/[^\w]+/g, ' ')                         // deja solo alfanum
        .replace(/\s+/g, ' ')                            // espacios múltiples
        .trim();
    }

    // Obtiene alias válidos para la ciudad activa: [ciudad, provincia]
    function getCityAliases(city){
      const u = normPlace(city);
      let prov = '';
      if (IND_OP && city){
        const row = (IND_OP || []).find(r => normPlace(r.ciudad) === u);
        prov = row ? normPlace(row.provincia) : '';
      }
      const set = new Set([u, prov].filter(Boolean));
      return [...set];
    }

    // NUEVO: carga 'resumen' y 'detalle' desde el endpoint único de Apps Script
    async function ensureSiniestrosLoaded(){
      if (SIN_DETALLE && SIN_RESUMEN) return;
      try {
        const r = await fetch(SIN_URL, { cache:'no-store' });
        const j = r.ok ? await r.json() : {};
        SIN_RESUMEN = Array.isArray(j.resumen) ? j.resumen : [];
        SIN_DETALLE = Array.isArray(j.detalle) ? j.detalle : [];
      } catch {
        SIN_RESUMEN = [];
        SIN_DETALLE = [];
      }
    }

    // Resetea completamente la UI de siniestros
    function resetSiniestrosUI(){
      // KPIs en "—"
      kSin.textContent = '—';
      kFal.textContent = '—';
      kLes.textContent = '—';
      if (kVeh) kVeh.textContent = '—';

      // limpiar charts si existen
      try {
        if (sinTipoChart)  { sinTipoChart.destroy();  sinTipoChart  = null; }
        if (sinClaseChart) { sinClaseChart.destroy(); sinClaseChart = null; }
        if (sinEvoChart)   { sinEvoChart.destroy();   sinEvoChart   = null; }
      } catch {}

      // Selector de años: "Todos", deshabilitado
      if (yearSelSiniestros){
        yearSelSiniestros.innerHTML = '<option value="">Todos</option>';
        yearSelSiniestros.value = '';
        yearSelSiniestros.disabled = true;
      }

      // Mapa vacío y vista general Perú
      if (layerSin) layerSin.clearLayers();
      if (mapSin){
        try { mapSin.setView([-9.19,-75.01], 5); } catch(e){}
        setTimeout(()=> mapSin.invalidateSize(), 60);
      }
    }

    /* ===== Loader para pestaña Siniestros (mismo diseño que Rutas) ===== */
    function showSinLoader(msgTitle = 'Cargando 1 capa…', msgSub = 'Siniestros viales') {
      sinLoading = true;

      // deshabilita controles mientras carga
      try {
        const ysel = document.getElementById('yearSelSiniestros');
        if (ysel) ysel.disabled = true;
        const rsel = document.getElementById('routeSelOperacion');
        if (rsel) rsel.disabled = true; // aunque esté oculto en esta pestaña
        const csel = document.getElementById('citySelOperacion');
        if (csel) csel.disabled = true;
      } catch {}

      // ⬇️ ahora anclamos al PANE completo, no solo al mapa
      const host = document.getElementById('paneSiniestros');
      if (!host) return;

      let overlay = host.querySelector('.sin-loader');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sin-loader';
        overlay.style.cssText = `
          position:absolute; inset:0;
          display:flex; align-items:center; justify-content:center;
          background:rgba(255,255,255,.65);
          z-index:10000; font-weight:600; border-radius:12px;
          pointer-events:auto;
        `;
        const box = document.createElement('div');
        box.style.cssText = `
          background:#fff; border:1px solid var(--ring,#e5e7eb); border-radius:14px;
          padding:14px 18px; box-shadow:0 10px 30px rgba(0,0,0,.08); min-width:240px;
          text-align:left; font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu;
        `;
        box.innerHTML = `
          <div style="display:flex;gap:10px;align-items:center">
            <div style="width:20px;height:20px;border:3px solid #e5e7eb;border-top-color:var(--brand,#0ea5e9);border-radius:50%;animation:spin .9s linear infinite"></div>
            <div>
              <div class="t" style="font-weight:700">${msgTitle}</div>
              <div class="s" style="color:#6b7280;font-size:13px">${msgSub}</div>
            </div>
          </div>
        `;
        const style = document.createElement('style');
        style.textContent = `@keyframes spin {to {transform:rotate(360deg)}}`;
        box.appendChild(style);
        overlay.appendChild(box);

        // asegúrate que el pane pueda posicionar hijos absolutos
        if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
        host.appendChild(overlay);
      } else {
        overlay.style.display = 'flex';
        const t = overlay.querySelector('.t'); if (t) t.textContent = msgTitle;
        const s = overlay.querySelector('.s'); if (s) s.textContent = msgSub;
      }

      // bloquear interacción del mapa mientras carga
      try {
        if (mapSin) {
          mapSin.dragging.disable();
          mapSin.scrollWheelZoom.disable();
          mapSin.doubleClickZoom.disable();
          mapSin.boxZoom.disable();
          mapSin.keyboard.disable();
        }
      } catch {}
    }

    function hideSinLoader(okText = null) {
      sinLoading = false;

      // re-habilitar controles
      try {
        const ysel = document.getElementById('yearSelSiniestros');
        if (ysel) ysel.disabled = false;
        const rsel = document.getElementById('routeSelOperacion');
        if (rsel) rsel.disabled = false;
        const csel = document.getElementById('citySelOperacion');
        if (csel) csel.disabled = false;
      } catch {}

      const overlay = document.querySelector('#paneSiniestros .sin-loader');
      if (!overlay) return;

      if (okText) {
        const t = overlay.querySelector('.t'); if (t) t.textContent = okText;
        const s = overlay.querySelector('.s'); if (s) s.textContent = '';
        setTimeout(() => { overlay.style.display = 'none'; }, 650);
      } else {
        overlay.style.display = 'none';
      }

      // restaurar interacción del mapa
      try {
        if (mapSin) {
          mapSin.dragging.enable();
          mapSin.scrollWheelZoom.enable();
          mapSin.doubleClickZoom.enable();
          mapSin.boxZoom.enable();
          mapSin.keyboard.enable();
        }
      } catch {}
    }

    /* ===== Loader para Pestaña Rutas (overlay tipo Siniestros) ===== */
    let opLoading = false;

    function showOpLoader(msgTitle = 'Cargando…', msgSub = 'Rutas de transporte') {
      opLoading = true;

      // deshabilita selects mientras carga
      try {
        document.getElementById('citySelOperacion').disabled  = true;
        const rsel = document.getElementById('routeSelOperacion');
        if (rsel) rsel.disabled = true;
      } catch {}

      const pane = document.getElementById('paneRutas'); // usamos el pane completo (tarjetas + mapa)
      if (!pane) return;

      let overlay = pane.querySelector('.op-loader');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'op-loader';
        overlay.style.cssText = `
          position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
          background:rgba(255,255,255,.65); z-index:10000; font-weight:600; border-radius:12px;
        `;
        const box = document.createElement('div');
        box.style.cssText = `
          background:#fff; border:1px solid var(--ring,#e5e7eb); border-radius:14px;
          padding:14px 18px; box-shadow:0 10px 30px rgba(0,0,0,.08); min-width:240px;
          text-align:left; font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu;
        `;
        box.innerHTML = `
          <div style="display:flex;gap:10px;align-items:center">
            <div style="width:20px;height:20px;border:3px solid #e5e7eb;border-top-color:var(--brand,#0ea5e9);border-radius:50%;animation:spin .9s linear infinite"></div>
            <div>
              <div class="t" style="font-weight:700">${msgTitle}</div>
              <div class="s" style="color:#6b7280;font-size:13px">${msgSub}</div>
            </div>
          </div>
        `;
        const style = document.createElement('style');
        style.textContent = `@keyframes spin {to {transform:rotate(360deg)}}`;
        box.appendChild(style);
        overlay.appendChild(box);

        // el pane está display:block; aseguremos position
        if (getComputedStyle(pane).position === 'static') pane.style.position = 'relative';
        pane.appendChild(overlay);
      } else {
        overlay.style.display = 'flex';
        const t = overlay.querySelector('.t'); if (t) t.textContent = msgTitle;
        const s = overlay.querySelector('.s'); if (s) s.textContent = msgSub;
      }

      // bloquear interacción del mapa mientras carga
      try {
        if (mapOperacion) {
          mapOperacion.dragging.disable();
          mapOperacion.scrollWheelZoom.disable();
          mapOperacion.doubleClickZoom.disable();
          mapOperacion.boxZoom.disable();
          mapOperacion.keyboard.disable();
        }
      } catch {}
    }

    function hideOpLoader(okText = null) {
      opLoading = false;

      // re-habilitar selects
      try {
        document.getElementById('citySelOperacion').disabled  = false;
        const rsel = document.getElementById('routeSelOperacion');
        if (rsel) rsel.disabled = false;
      } catch {}

      const overlay = document.querySelector('#paneRutas .op-loader');
      if (!overlay) return;

      if (okText) {
        const t = overlay.querySelector('.t'); if (t) t.textContent = okText;
        const s = overlay.querySelector('.s'); if (s) s.textContent = '';
        setTimeout(() => { overlay.style.display = 'none'; }, 650);
      } else {
        overlay.style.display = 'none';
      }

      // restaurar interacción del mapa
      try {
        if (mapOperacion) {
          mapOperacion.dragging.enable();
          mapOperacion.scrollWheelZoom.enable();
          mapOperacion.doubleClickZoom.enable();
          mapOperacion.boxZoom.enable();
          mapOperacion.keyboard.enable();
        }
      } catch {}
    }


    // NUEVO: 'detalle' ya trae 'anio' directo desde el Sheet -> ya no hace falta parsear texto de fecha
    function listYearsFor(city){
      const aliases = getCityAliases(city);
      const ys = new Set();
      for (const row of (SIN_DETALLE || [])){
        const prov = normPlace(row.provincia);
        if (!aliases.includes(prov)) continue;
        if (row.anio) ys.add(row.anio);
      }
      return [...ys].sort((a,b)=>a-b);
    }

    // NUEVO: filtra el detalle (mapa + gráficas) por PROVINCIA (igual que antes)
    function filterSinDetalle(city, year){
      const aliases = getCityAliases(city);
      return (SIN_DETALLE||[]).filter(r => {
        const okCity = aliases.includes(normPlace(r.provincia));
        return okCity && (!year || r.anio === year);
      });
    }

    // NUEVO: filtra el resumen (KPIs) -> usa los mismos alias ciudad/provincia por seguridad
    function filterSinResumen(city, year){
      const aliases = getCityAliases(city);
      return (SIN_RESUMEN||[]).filter(r => {
        const okCity = aliases.includes(normPlace(r.ciudad));
        return okCity && (!year || r.anio === year);
      });
    }

    async function fitToCityFallback(cityName){
      const center = await getCityCenterFallback(cityName);
      if (mapSin && center){
        mapSin.setView(center, 11); // 12 si quieres más cerca
        return true;
      }
      return false;
    }

    // ===== Fallbacks de encuadre para Siniestros =====

    // cache simple para no volver a pedir los límites
    const LIMIT_CACHE = new Map();

    function normUp(s){
      return (s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().trim();
    }

    // Devuelve [lat, lon] del centro de ciudad (ALL.ciudades → centroide) o diccionario manual
    async function getCityCenterFallback(cityName){
      try { await ensureDataLoaded(); } catch(e){}
      const cityN = normUp(cityName);

      // 1) por ciudad
      let lat = null, lon = null;
      const hitCity = (ALL?.ciudades||[]).find(c => normUp(c.ciudad) === cityN);
      if (hitCity?.centroide?.lat != null && hitCity?.centroide?.lon != null){
        lat = Number(hitCity.centroide.lat);
        lon = Number(hitCity.centroide.lon);
      }

      // 2) por provincia (a través de IND_OP)
      if ((lat==null || lon==null) && IND_OP?.length){
        const row = IND_OP.find(r => normUp(r.ciudad) === cityN);
        const prov = row?.provincia ? normUp(row.provincia) : '';
        if (prov){
          const hitProv = (ALL?.ciudades||[]).find(c => normUp(c.provincia) === prov);
          if (hitProv?.centroide?.lat != null && hitProv?.centroide?.lon != null){
            lat = Number(hitProv.centroide.lat);
            lon = Number(hitProv.centroide.lon);
          }
        }
      }

      // 3) diccionario manual (agrega aquí las que falten)
      if (lat==null || lon==null){
        const CITY_CENTERS = {
          'ICA':       [-14.0683, -75.7255],
          'CAJAMARCA': [ -7.1617, -78.5128],
          'TRUJILLO':  [ -8.1116, -79.0288],
          'TARAPOTO':  [ -6.4921, -76.3655],
          'TUMBES':    [ -3.5669, -80.4516],
        };
        const p = CITY_CENTERS[cityN];
        if (p){ lat = p[0]; lon = p[1]; }
      }

      return (Number.isFinite(lat) && Number.isFinite(lon)) ? [lat, lon] : null;
    }

    // Devuelve bounds (L.LatLngBounds) del límite de ciudad/provincia (como en Mod 1)
    async function getCityLimitBounds(cityName){
      try { await ensureDataLoaded(); } catch(e){}
      const cityN = normUp(cityName);

      // intenta por ciudad
      let c = (ALL?.ciudades||[]).find(x => normUp(x.ciudad) === cityN);
      // si no, intenta por provincia
      if (!c && IND_OP?.length){
        const row = IND_OP.find(r => normUp(r.ciudad) === cityN);
        const prov = row?.provincia ? normUp(row.provincia) : '';
        if (prov) c = (ALL?.ciudades||[]).find(x => normUp(x.provincia) === prov);
      }
      if (!c) return null;

      const slug = (c.city_id || c.ciudad)
        .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
        .replace(/[^\w]+/g,'_').toUpperCase();

      const candidates = [ c.limite_url,
        `./data/modulo1/ciudades/${slug}.geojson`,
        `./data/${slug}/limite.geojson`
      ].filter(Boolean);

      // cache por slug para no recargar
      for (const u of candidates){
        if (!u) continue;
        if (LIMIT_CACHE.has(u)) return LIMIT_CACHE.get(u);
        try{
          const r = await fetch(u, { cache:'no-store' });
          if (!r.ok) continue;
          const geo = await r.json();
          // construimos bounds sin pintar capa permanente
          let tmp = L.geoJSON(geo);
          const bb = tmp.getBounds();
          if (bb && bb.isValid()){
            LIMIT_CACHE.set(u, bb);
            return bb;
          }
        }catch(e){}
      }
      return null;
    }

    // Intenta encuadrar “inteligente”: primero rutas, luego límite, luego centroide
    async function fitToCitySmart(cityName){
      if (!mapSin) return false;

      // 1) si hay rutas cargadas para esta ciudad, usa sus bounds
      if (opAllRoutesGroup){
        try{
          const bb = opAllRoutesGroup.getBounds();
          if (bb && bb.isValid()){
            mapSin.fitBounds(bb, { padding:[16,16], maxZoom: 13 });
            return true;
          }
        }catch(e){}
      }

      // 2) límite del Módulo 1
      const bb = await getCityLimitBounds(cityName);
      if (bb && bb.isValid()){
        mapSin.fitBounds(bb, { padding:[16,16], maxZoom: 13 });
        return true;
      }

      // 3) centroide (ALL o diccionario)
      const center = await getCityCenterFallback(cityName);
      if (center){
        mapSin.setView(center, 12);
        return true;
      }

      return false;
    }

      function normZona(v){
        const s = String(v||'').trim().toUpperCase();
        if (!s) return 'NO INDICA';
        if (s.includes('URB')) return 'URBANA';
        if (s.includes('RUR')) return 'RURAL';
        return 'NO INDICA';
      }

      // NUEVO: agrupa por CLASE SINIESTRO (choque, despiste, atropello, etc.) para la gráfica nueva
      function buildClaseCounts(rows){
        const counts = {};
        rows.forEach(r => {
          const c = (r.clase || 'NO INDICA').toString().toUpperCase().trim();
          counts[c] = (counts[c] || 0) + 1;
        });
        // de mayor a menor, para que la barra más larga salga arriba
        return Object.entries(counts).sort((a,b) => b[1] - a[1]);
      }

      // NUEVO: 'fecha' ya viene en formato ISO 'YYYY-MM-DD' desde el Sheet -> extraer mes es directo
      function monthFromISO(fechaISO){
        if (!fechaISO) return null;
        const m = String(fechaISO).match(/^\d{4}-(\d{2})-\d{2}$/);
        return m ? Number(m[1]) : null;
      }

      // Serie total: si hay año → por mes; si no → por año
      function buildTimeSeriesTotals(rows, selectedYear){
        if (selectedYear){
          const labels = Array.from({length:12}, (_,i)=> String(i+1).padStart(2,'0'));
          const totals = Array(12).fill(0);
          for (const r of rows){
            const m = monthFromISO(r.fecha);
            if (m) totals[m-1] += 1;
          }
          return { labels, totals, xTitle: `Mes (${selectedYear})` };
        } else {
          const years = [...new Set(rows.map(r => r.anio).filter(Boolean))].sort((a,b)=>a-b);
          const totals = years.map(y => rows.filter(r => r.anio === y).length);
          return { labels: years.map(String), totals, xTitle: 'Año' };
        }
      }

    async function renderSiniestros(){
      // debouncing: si hay llamadas seguidas, esperamos un pelín
      if (sinDebounceTimer) clearTimeout(sinDebounceTimer);
      sinDebounceTimer = setTimeout(async () => {
        showSinLoader();

        // token de render: si cambia, abortamos al final
        const mySeq = ++SIN_RENDER_SEQ;

        // snapshot de la ciudad al inicio para evitar “cambio en medio”
        const city = currentOpCity;
        if (!city){
          resetSiniestrosUI();
          hideSinLoader('Sin datos');
          return;
        }

        await ensureSiniestrosLoaded();
        // si llegó otro render mientras tanto, no sigas
        if (mySeq !== SIN_RENDER_SEQ) return;

        // Asegura mapa instanciado para poder limpiar siempre
        if (!mapSin){
          mapSin = L.map('mapSiniestros', { scrollWheelZoom:false }).setView([-9.19,-75.01], 5);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution:'© OpenStreetMap' }).addTo(mapSin);
          layerSin = L.layerGroup().addTo(mapSin);
          const el = mapSin.getContainer();
          el.addEventListener('mouseenter', ()=> mapSin.scrollWheelZoom.enable(), { passive:true });
          el.addEventListener('mouseleave', ()=> mapSin.scrollWheelZoom.disable(), { passive:true });
        }

        // 1) Poblar años (desde 'detalle', que ya trae 'anio' directo)
        const years = listYearsFor(city);
        const prev = yearSelSiniestros?.value || '';

        if (yearSelSiniestros){
          yearSelSiniestros.innerHTML = '<option value="">Todos</option>' +
            years.map(y => `<option value="${y}">${y}</option>`).join('');

          if (prev && years.includes(Number(prev))) {
            yearSelSiniestros.value = prev;
          } else {
            yearSelSiniestros.value = '';
          }
          yearSelSiniestros.disabled = years.length === 0;
        }

        // si cambiaron el token mientras dibujábamos, aborta
        if (mySeq !== SIN_RENDER_SEQ) return;

        // Si no hay años → limpiar y salir
        if (!years.length){
          resetSiniestrosUI(); // limpia KPIs y mapa
          hideSinLoader('Sin datos');
          return;
        }

        const selectedYear = (yearSelSiniestros?.value ? Number(yearSelSiniestros.value) : null);

        // 2) KPIs desde 'resumen' (ya viene sumado por ciudad/año -> más rápido que sumar el detalle)
        const resumenRows = filterSinResumen(city, selectedYear);
        const total = resumenRows.reduce((a,r)=> a + toNumInt(r.siniestros_fatales), 0);
        const falle = resumenRows.reduce((a,r)=> a + toNumInt(r.fallecidos), 0);
        const lesio = resumenRows.reduce((a,r)=> a + toNumInt(r.lesionados), 0);
        const vehic = resumenRows.reduce((a,r)=> a + toNumInt(r.vehiculos_danados), 0);

        // 3) Filas de 'detalle' para mapa + gráficas (zona, clase, evolución)
        const rows = filterSinDetalle(city, selectedYear);

        // si cambiaron el token mientras filtrábamos, aborta
        if (mySeq !== SIN_RENDER_SEQ) return;

        // 3) Render según haya/no haya filas
        if (!rows.length && !resumenRows.length){
          resetSiniestrosUI();
          hideSinLoader('Sin datos');
          return;
        }

        kSin.textContent = total.toLocaleString('es-PE');
        kFal.textContent = falle.toLocaleString('es-PE');
        kLes.textContent = lesio.toLocaleString('es-PE');
        if (kVeh) kVeh.textContent = vehic.toLocaleString('es-PE');

        // ===== Gráfica 1: Distribución por zona =====
        const zonaCounts = { 'URBANA':0, 'RURAL':0, 'NO INDICA':0 };
        rows.forEach(r => { zonaCounts[normZona(r.zona)]++; });

        if (sinTipoChart) { sinTipoChart.destroy(); }
        if (sinTipoCanvas) {
          sinTipoChart = mkChart(sinTipoCanvas, {
            pv: { height: 230, center: 'total', fmt: 'int' },
            type: 'doughnut',
            data: {
              labels: Object.keys(zonaCounts),
              datasets: [{ data: Object.values(zonaCounts) }]
            },
            options: {
              plugins: {
                legend: { position: 'bottom', onClick:()=>{}, onHover:(e)=>{ e.native.target.style.cursor='default'; }, onLeave:(e)=>{ e.native.target.style.cursor='default'; } },
                title: { display:false },
                tooltip: { callbacks: { label: (ctx)=> `${ctx.label}: ${ctx.parsed.toLocaleString('es-PE')}` } }
              },
              cutout: '55%'
            }
          });
        }

        // ===== Gráfica 2 (NUEVA): Clase de siniestro =====
        const claseEntries = buildClaseCounts(rows);
        if (sinClaseChart) { sinClaseChart.destroy(); }
        if (sinClaseCanvas) {
          sinClaseChart = mkChart(sinClaseCanvas, {
            pv: { height: 240, fmt: 'int' },
            type: 'bar',
            data: {
              labels: claseEntries.map(e => e[0]),
              datasets: [{ label: 'Siniestros', data: claseEntries.map(e => e[1]) }]
            },
            options: {
              indexAxis: 'y',
              responsive: true,
              plugins: {
                legend: { display:false },
                title: { display:false },
                tooltip: { callbacks: { label: (ctx)=> ` ${ctx.parsed.x.toLocaleString('es-PE')}` } }
              },
              scales: {
                x: { beginAtZero:true, ticks:{ precision:0 } }
              }
            }
          });
        }

        // ===== Gráfica 3: Evolución temporal (TOTAL) =====
        const selectedYearVal = (yearSelSiniestros?.value ? Number(yearSelSiniestros.value) : null);
        const tsTot = buildTimeSeriesTotals(rows, selectedYearVal);

        if (sinEvoChart) { sinEvoChart.destroy(); }
        if (sinEvoCanvas) {
          sinEvoChart = mkChart(sinEvoCanvas, {
            pv: { height: 240, fmt: 'int' },
            type: 'bar',
            data: {
              labels: tsTot.labels,
              datasets: [{
                label: 'Total de siniestros',
                data: tsTot.totals
                // sin colores explícitos
              }]
            },
            options: {
              responsive: true,
              plugins: {
                legend: { display: false }, // solo una serie
                title: { display: false },
                tooltip: {
                  mode: 'index',
                  intersect: false,
                  callbacks: {
                    label: (ctx) => ` ${ctx.parsed.y?.toLocaleString('es-PE') || 0}`
                  }
                }
              },
              scales: {
                x: { title:{ display:true, text: tsTot.xTitle } },
                y: { beginAtZero:true, ticks:{ precision:0 }, title:{ display:true, text:'Nº de siniestros' } }
              }
            }
          });
        }


      layerSin.clearLayers();
      const pts = [];
      rows.forEach(r=>{
        const lat = r.lat, lon = r.lon;   // <-- ya vienen limpios desde el Apps Script (coord())
        if (isValidLatLon(lat, lon)){
          L.circleMarker([lat, lon], { radius:5 }).bindPopup(`
            <b>${(r.provincia||'').toString().toUpperCase()}</b><br/>
            ${r.fecha || ''}<br/>
            Clase: ${r.clase || '—'}<br/>
            Zona: ${r.zona || '—'}<br/>
            Fallecidos: ${r.fallecidos || 0}<br/>
            Lesionados: ${r.lesionados || 0}<br/>
            Vehículos dañados: ${r.vehiculos_danados || 0}<br/>
            Causa: ${r.causa || 'No identificada'}
          `).addTo(layerSin);
          pts.push([lat, lon]);
        }
      });



    // Ajuste de zoom cuando el contenedor ya tiene tamaño final (2 pasadas)
    const seqAtPaint = mySeq;
    mapSin.invalidateSize();
    requestAnimationFrame(async () => {
      if (seqAtPaint !== SIN_RENDER_SEQ) return;

      if (pts.length){
        await smartFitMapSin(pts, city);   // ← antes: smartFitMapSin(pts)
      } else {
        const ok = await fitToCitySmart(city);
        if (!ok) mapSin.setView([-9.19,-75.01], 5);
      }

      requestAnimationFrame(async () => {
        if (seqAtPaint !== SIN_RENDER_SEQ) return;
        mapSin.invalidateSize();
        if (pts.length){
          await smartFitMapSin(pts, city); // ← antes: smartFitMapSin(pts)
        }
        hideSinLoader('¡Listo!');
      });
    });

    }, 60); // ← cierra setTimeout (debounce)
    } // ← cierra function renderSiniestros

    // año → re-render
    yearSelSiniestros?.addEventListener('change', () => renderSiniestros());

    // Subtabs click
    // Subtabs click (usa setOperacionSubtab como única fuente de verdad)
    (function initSubtabsOnce(){
      const subt = document.querySelector('#mod-operacion .subtabs');
      if (!subt || subt._bound) return;
      subt._bound = true;

      subt.addEventListener('click', (e)=>{
        const b = e.target.closest('.subtab');
        if (!b) return;
        const which = b.dataset.tab || 'rutas';
        setOperacionSubtab(which);
      });
    })();
    
async function renderAcoso(){
      showAcoLoader();
      await ensureAcosoLoaded();
      hideAcoLoader();

    if (!ACOSO_DATA || !currentOpCity){
    kAcoN.textContent = '—';
    if (kAcoSilencio) kAcoSilencio.textContent = '—';
    kAcoDenuncio.textContent = '—';
    kAcoRiesgo.textContent = '—';
    return;
    }


      const city = currentOpCity.toUpperCase();
      const kpi = ACOSO_DATA.kpis?.[city];
      const perc = ACOSO_DATA.percepcion?.[city];

        if (!kpi){
        kAcoN.textContent = '—';
        if (kAcoSilencio) kAcoSilencio.textContent = '—';
        kAcoDenuncio.textContent = '—';
        kAcoRiesgo.textContent = '—';
        if (kAcoSeguridad) kAcoSeguridad.textContent = '—';
        if (kAcoAtencion) kAcoAtencion.textContent = '—';

        const resumen = document.getElementById('acoResumen');
                  if (resumen){
                      const acoMsgNoData = document.getElementById('acoMsgNoData');
          if (acoMsgNoData) acoMsgNoData.style.display = 'block';
          resumen.innerHTML = '—';
        }

        cleanupAcosoCharts(); // evita que se quede el gráfico anterior
        return;
        }

      const acoMsgNoData = document.getElementById('acoMsgNoData');
      if (acoMsgNoData) acoMsgNoData.style.display = 'none';

        // ===== KPIs =====
        const enc = kpi.encuestas ?? null;
        const victimaPct  = Number(kpi.victima_pct ?? 0);
        const denunciaPct = Number(kpi.denuncia_pct ?? 0);
        const silencioPct = Math.max(0, 100 - denunciaPct);
        const infoPct = Number(kpi.vio_info_pct ?? 0);
        const campPct = Number(kpi.campania_pct ?? 0);

        kAcoN.textContent        = (enc != null) ? enc.toLocaleString('es-PE') : '—';
        kAcoDenuncio.textContent = `${denunciaPct.toFixed(1)}%`;
        if (kAcoSilencio) kAcoSilencio.textContent = `${silencioPct.toFixed(1)}%`;

        // Riesgo promedio (viene ya calculado del Sheet)
        kAcoRiesgo.textContent = (perc?.riesgo_lleno != null) ? perc.riesgo_lleno.toFixed(1) : '—';

        // ===== Paleta de colores (Acoso) =====
        const ACOSO_COLORS = {
        // Colores principales (YA LOS TIENES)
        incidencia: '#F4B740', // ámbar
        accion:     '#3BA3EC', // azul
        silencio:   '#FF6B8A', // rosado
        info:       '#4BC0C0', // verde-azulado
        camp:       '#8B5CF6', // morado

        // Colores suaves para "No" (NUEVOS)
        noIncidencia: '#FDEBD0', // ámbar pastel
        noAccion:     '#E8F2FB', // azul pastel
        noInfo:       '#E6FAF8'  // verde pastel
        };

        // ===== Helper: Donut reutilizable =====
        function renderDonut(canvas, existingChart, labels, values, colors){
        if (existingChart) existingChart.destroy();
        if (!canvas) return null;

        return mkChart(canvas, {
            pv: { height: 175, center: 'first', fmt: 'pct1' },
            type: 'doughnut',
            data: {
            labels,
            datasets: [{
                data: values,
                backgroundColor: colors
            }]
            },
            options: {
            radius: '85%',      // tamaño del donut dentro del canvas
            cutout: '68%',
            plugins: {
                legend: {
                position:'bottom',
                labels: {
                    boxWidth: 14,
                    padding: 14,
                    font: { size: 13 }
                }
                },
                tooltip: {
                callbacks: {
                    label: (ctx) => {
                    const v = Number(ctx.parsed ?? 0);
                    return `${ctx.label}: ${v.toFixed(1)}%`;
                    }
                }
                }
            }
            }
        });
        }


      // ===== DONUT 1: ¿Ha sufrido acoso? =====
        acoVictimaChart = renderDonut(
        acoVictimaCanvas,
        acoVictimaChart,
        ['Sí', 'No'],
        [victimaPct, 100 - victimaPct],
        [ACOSO_COLORS.incidencia, ACOSO_COLORS.noIncidencia]
        );



      // ===== DONUT 2: ¿Denunció el hecho? (solo entre víctimas) =====
        acoDenuncioChart = renderDonut(
        acoDenuncioCanvas,
        acoDenuncioChart,
        ['Denunció', 'No denunció'],
        [denunciaPct, 100 - denunciaPct],
        [ACOSO_COLORS.accion, ACOSO_COLORS.noAccion]
        );



      // ===== DONUT 3: ¿Vio información? =====
        acoInfoChart = renderDonut(
        acoInfoCanvas,
        acoInfoChart,
        ['Sí', 'No'],
        [infoPct, Math.max(0, 100 - infoPct)],
        [ACOSO_COLORS.info, ACOSO_COLORS.noInfo]
        );


      // ===== DONUT 4: ¿Participó en campañas? =====
        acoCampChart = renderDonut(
        acoCampCanvas,
        acoCampChart,
        ['Sí', 'No'],
        [campPct, Math.max(0, 100 - campPct)],
        [ACOSO_COLORS.camp, ACOSO_COLORS.noAccion]
        );

        // ===== Helper: barra horizontal reutilizable =====
        function renderBarH(canvas, existingChart, items, color){
          if (existingChart) existingChart.destroy();
          if (!canvas) return null;
          if (!items || !items.length) return null;

          return mkChart(canvas, {
            pv: { fmt: 'int' },
            type: 'bar',
            data: {
              labels: items.map(it => it.label),
              datasets: [{
                data: items.map(it => it.count),
                backgroundColor: color
              }]
            },
            options: {
              indexAxis: 'y',
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: { beginAtZero: true, ticks: { precision: 0 } }
              }
            }
          });
        }

        // ===== BARRAS: Tipos de acoso sufrido (P19) =====
        const tiposItems = ACOSO_DATA.tipos_acoso?.[city] || [];
        acoTiposChart = renderBarH(acoTiposCanvas, acoTiposChart, tiposItems, ACOSO_COLORS.silencio);

        // ===== BARRAS: Motivos por los que no denunció (P27) =====
        const motivosItems = ACOSO_DATA.motivos_no_denuncia?.[city] || [];
        acoMotivosChart = renderBarH(acoMotivosCanvas, acoMotivosChart, motivosItems, ACOSO_COLORS.accion);

        // ===== Percepción del sistema (P28/P29) =====
        if (kAcoSeguridad) kAcoSeguridad.textContent = (perc?.seguridad != null) ? `${perc.seguridad.toFixed(1)}/5` : '—';
        if (kAcoAtencion)  kAcoAtencion.textContent  = (perc?.atencion  != null) ? `${perc.atencion.toFixed(1)}/5`  : '—';

      // ===== Resumen (Mensajes clave) =====
      const resumen = document.getElementById('acoResumen');
      if (resumen){
        const riesgoTxt = (kAcoRiesgo.textContent && kAcoRiesgo.textContent !== '—')
          ? `${kAcoRiesgo.textContent}/5`
          : '—';

        resumen.innerHTML = [
          `• <b>Incidencia reportada:</b> ${victimaPct.toFixed(1)}% reportó haber sufrido acoso.`,
          `• <b>Denuncia:</b> ${denunciaPct.toFixed(1)}% de víctimas declaró haber denunciado.`,
          `• <b>Silencio:</b> ${silencioPct.toFixed(1)}% no denunció.`,
          `• <b>Riesgo percibido:</b> ${riesgoTxt} (escala 1–5).`,
          `• <b>Exposición a información:</b> ${infoPct.toFixed(1)}% vio información.`,
          `• <b>Participación en campañas:</b> ${campPct.toFixed(1)}% participó en campañas/acciones.`
        ].join('<br>');
      }
    }


     window.addEventListener('hashchange', () => {
        const h = (location.hash || '').toLowerCase();

        if (h === '#mod-operacion'){
            // al entrar: resetea vista para evitar que "se quede pegado"
            resetSubtabsOperacion();
            // opcional: re-render de la ciudad actual
            if (currentOpCity) renderCityOperacion(currentOpCity);
        } else {
            // al salir: limpia charts para evitar superposiciones
            cleanupAcosoCharts();
            hideGEI();
            // siniestros: destruir charts + esconder loader + limpiar capa
          try { if (sinTipoChart) { sinTipoChart.destroy(); sinTipoChart = null; } } catch(e){}
          try { if (sinEvoChart)  { sinEvoChart.destroy();  sinEvoChart  = null; } } catch(e){}
          try { hideSinLoader(); } catch(e){}
          try { layerSin?.clearLayers(); } catch(e){}

          // semáforos: limpiar capa si existe
          try { layerSem?.clearLayers(); } catch(e){}

        }
        });


    /* ===================== MOD 4: Semáforos (simple) ===================== */
    const paneSem   = document.getElementById('paneSemaforos');
    const kSemTotal = document.getElementById('kSemTotal');
    const semMsg    = document.getElementById('semMsg');

    let mapSem, layerSem;

    const SEM_BASE = './data/modulo4/semaforos/';

    // (opcional) si alguna ciudad no coincide con el nombre de archivo:
    const SEM_FILES_MAP = {
      // 'CHICLAYO': 'CHICLAYO.geojson',
    };

    function ensureMapSemaforos(){
      if (mapSem) return;

      mapSem = L.map('mapSemaforos', { scrollWheelZoom:false }).setView([-9.19, -75.01], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution:'© OpenStreetMap' }).addTo(mapSem);
      layerSem = L.layerGroup().addTo(mapSem);

      const el = mapSem.getContainer();
      mapSem.scrollWheelZoom.disable();
      el.addEventListener('mouseenter', () => mapSem.scrollWheelZoom.enable(), { passive:true });
      el.addEventListener('mouseleave', () => mapSem.scrollWheelZoom.disable(), { passive:true });
    }

    async function loadSemaforosForCity(cityName){
      if (!paneSem) return;

      ensureMapSemaforos();
      if (!layerSem) return;

      layerSem.clearLayers();

      if (kSemTotal) kSemTotal.textContent = '—';
      if (semMsg) semMsg.textContent = 'Cargando…';

      const pretty = String(cityName || '').trim();
      const slug   = citySlug(pretty); // ya lo tienes en tu mod4.js

      const candidates = [
        SEM_FILES_MAP[pretty.toUpperCase()] ? (SEM_BASE + SEM_FILES_MAP[pretty.toUpperCase()]) : null,
        `${SEM_BASE}${slug}.geojson`,
        `${SEM_BASE}${pretty.toUpperCase()}.geojson`,
        `${SEM_BASE}${pretty}.geojson`,
      ].filter(Boolean);

      const url = await pickFirstExisting(candidates); // ya lo tienes
      if (!url){
        if (semMsg) semMsg.textContent = 'Esta ciudad no tiene GeoJSON de semáforos.';
        try { mapSem.setView([-9.19, -75.01], 5); } catch(e){}
        return;
      }

      try{
        const geo = await fetch(url, { cache:'no-store' }).then(r=>r.json());
        const feats = Array.isArray(geo?.features) ? geo.features : [];
        const total = feats.length;

        const geoLayer = L.geoJSON(geo, {
          pointToLayer: (f, latlng) => L.circleMarker(latlng, { radius:6, weight:1, fillOpacity:0.85 }),
          onEachFeature: (f, l) => {
            const p = f?.properties || {};
            const titulo = p.interseccion || p.nombre || p.name || p.id || 'Semáforo';
            l.bindPopup(`<b>${titulo}</b><br>${pretty}`);
          }
        }).addTo(layerSem);

        if (kSemTotal) kSemTotal.textContent = total.toLocaleString('es-PE');
        if (semMsg) semMsg.textContent = total ? 'Semáforos cargados.' : 'GeoJSON sin puntos.';

        // encuadre
        try{
          const bb = geoLayer.getBounds();
          if (bb && bb.isValid()) mapSem.fitBounds(bb, { padding:[16,16] });
        }catch(e){}

        setTimeout(()=> mapSem.invalidateSize(), 80);

      }catch(e){
        console.error('Error cargando semáforos:', e);
        if (semMsg) semMsg.textContent = 'Error al cargar el GeoJSON de semáforos.';
      }
    }

