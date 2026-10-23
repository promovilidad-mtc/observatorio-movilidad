/* ==========================================================================
   ADAPTADOR DE GRÁFICOS — ApexCharts con respaldo a Chart.js

   Los módulos llaman:  window.PVChart(canvas, configChartJs)
   - Traduce la misma configuración de Chart.js (donut / barras / barras horizontales)
     a ApexCharts y dibuja en un <div> al lado del <canvas>.
   - Devuelve un objeto con .destroy(), igual que Chart.js, así los módulos
     no cambian su forma de limpiar los gráficos.
   - ApexCharts se descarga SOLO cuando se dibuja el primer gráfico
     (no pesa en el Inicio).
   - Si ApexCharts no carga o falla, dibuja con Chart.js como antes.

   Opciones extra opcionales dentro de la config:  cfg.pv = {
     height, center:'total'|'first'|'none', fmt:'int'|'pct1', color,
     tooltip:(índice)=>html, apex:{...se mezcla al final...}
   }
   ========================================================================== */
(function () {
  'use strict';

  var APEX_SRC = './assets/vendor/apexcharts/apexcharts.min.js';
  var PALETTE  = ['#2E86DE', '#E74C6F', '#E67E22', '#27AE60', '#8E44AD', '#16A085', '#F1C40F', '#34495E'];
  var INK = '#101C2E', MUTED = '#5B6472', GRID = '#E5E5EA', NAVY = '#16233F';
  var NF = new Intl.NumberFormat('es-PE', { maximumFractionDigits: 1 });
  var apexLoading = null;

  /* ---------- carga perezosa de ApexCharts ---------- */
  function loadApex() {
    if (window.ApexCharts) return Promise.resolve(true);
    if (!apexLoading) {
      apexLoading = new Promise(function (resolve) {
        var s = document.createElement('script');
        s.src = APEX_SRC;
        s.async = true;
        s.onload = function () { resolve(!!window.ApexCharts); };
        s.onerror = function () { apexLoading = null; resolve(false); };
        document.head.appendChild(s);
      });
    }
    return apexLoading;
  }

  /* ---------- utilidades ---------- */
  function fmtFor(kind) {
    if (kind === 'pct1') return function (v) { return Number(v || 0).toFixed(1) + '%'; };
    return function (v) { return NF.format(Number(v || 0)); };
  }

  /* máximo y cantidad de divisiones "redondas" (0, 50, 100, 150, 200) con espacio para el número al final */
  function niceAxis(maxV) {
    var raw = maxV * 1.14;
    if (!(raw > 0)) return null;
    var mag = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10)), best = null;
    [0.1, 1].forEach(function (f) {
      [1, 2, 2.5, 5].forEach(function (m) {
        var step = m * mag * f, ticks = Math.ceil(raw / step);
        if (ticks >= 4 && ticks <= 7) {
          var max = ticks * step;
          if (!best || max < best.max) best = { max: max, ticks: ticks };
        }
      });
    });
    return best;
  }

  function isObj(x) { return x && typeof x === 'object' && !Array.isArray(x); }
  function merge(a, b) {
    if (!isObj(b)) return a;
    Object.keys(b).forEach(function (k) {
      if (isObj(b[k]) && isObj(a[k])) merge(a[k], b[k]); else a[k] = b[k];
    });
    return a;
  }

  /* ---------- traducción Chart.js -> ApexCharts ---------- */
  function build(canvas, cfg, pv) {
    var o      = cfg.options || {};
    var plug   = o.plugins || {};
    var scales = o.scales || {};
    var ds     = (cfg.data.datasets || [])[0] || {};
    var labels = (cfg.data.labels || []).map(String);
    var data   = (ds.data || []).map(function (v) { return Number(v) || 0; });

    var isDonut    = cfg.type === 'doughnut' || cfg.type === 'pie';
    var horizontal = cfg.type === 'bar' && o.indexAxis === 'y';
    var legendOn   = !(plug.legend && plug.legend.display === false);
    var fmt        = fmtFor(pv.fmt);
    var bg         = ds.backgroundColor;

    var height = pv.height;
    if (!height) {
      var p = canvas.parentElement;
      height = (p && p.classList.contains('chartBox') && p.clientHeight) ? p.clientHeight : (isDonut ? 230 : 250);
    }

    var base = {
      chart: {
        height: height,
        fontFamily: 'inherit',
        foreColor: MUTED,
        toolbar: { show: false },
        animations: {
          enabled: true, easing: 'easeinout', speed: 800,
          animateGradually: { enabled: true, delay: 120 },
          dynamicAnimation: { enabled: true, speed: 350 }
        }
      },
      grid: { borderColor: GRID },
      legend: {
        show: legendOn, position: 'bottom', fontSize: '12px',
        labels: { colors: INK },
        markers: { radius: 12 },
        itemMargin: { horizontal: 8, vertical: 2 },
        onItemClick: { toggleDataSeries: false }        /* igual que antes: la leyenda no oculta datos */
      }
    };

    /* ---------- DONUT ---------- */
    if (isDonut) {
      var colors = Array.isArray(bg) ? bg : PALETTE;
      var cutout = parseInt(String(o.cutout || '60%'), 10) || 60;
      var sum    = data.reduce(function (a, b) { return a + b; }, 0);
      var mode   = pv.center || 'total';
      var big    = height >= 220;

      var donutLabels = (mode === 'none') ? { show: false } : {
        show: true,
        name:  { show: true, fontSize: big ? '12px' : '11px', color: MUTED, offsetY: -4 },
        value: { show: true, fontSize: big ? '20px' : '16px', fontWeight: 700, color: NAVY, offsetY: 4, formatter: function (v) { return fmt(v); } },
        total: {
          show: true, showAlways: false,
          label: mode === 'first' ? (labels[0] || '') : 'Total',
          color: MUTED, fontSize: big ? '12px' : '11px',
          formatter: function () { return fmt(mode === 'first' ? data[0] : sum); }
        }
      };

      merge(base, {
        chart: { type: 'donut' },
        series: data,
        labels: labels,
        colors: colors,
        stroke: { width: 2, colors: ['#fff'] },
        dataLabels: { enabled: false },
        plotOptions: { pie: { donut: { size: cutout + '%', labels: donutLabels } } },
        // fondo blanco y texto oscuro: con el color de la porción, las porciones claras ("No") no se leían
        tooltip: { fillSeriesColor: false, y: { formatter: function (v) { return fmt(v); } } }
      });

      if (typeof pv.tooltip === 'function') {
        base.tooltip = {
          custom: function (c) { return '<div class="pv-tip">' + pv.tooltip(c.seriesIndex) + '</div>'; }
        };
      }
      return base;
    }

    /* ---------- BARRAS (verticales / horizontales) ---------- */
    var multi  = Array.isArray(bg) && bg.length > 1;
    var barCol = pv.color ? [pv.color] : (Array.isArray(bg) ? bg : (typeof bg === 'string' ? [bg] : [PALETTE[0]]));
    var maxV   = data.reduce(function (a, b) { return Math.max(a, b); }, 0);
    var showDL = pv.dataLabels !== false && data.length <= 12;
    var intFmt = function (v) { return NF.format(Math.round(v)); };

    merge(base, {
      chart: { type: 'bar' },
      series: [{ name: ds.label || 'Valor', data: data }],
      colors: barCol,
      plotOptions: { bar: {
        horizontal: horizontal, borderRadius: 3, distributed: multi,
        columnWidth: '55%', barHeight: '62%', dataLabels: { position: 'top' }
      } },
      dataLabels: {
        enabled: showDL,
        formatter: function (v) { return fmt(v); },
        offsetY: horizontal ? 0 : -18, offsetX: horizontal ? 24 : 0,
        style: { fontSize: '11px', fontWeight: 700, colors: [INK] }
      },
      legend: { show: false },
      tooltip: { y: { formatter: function (v) { return fmt(v); } } }
    });

    if (horizontal) {
      var hw = (canvas.parentElement && canvas.parentElement.clientWidth) || 600;
      merge(base, {
        xaxis: { categories: labels, min: 0, labels: { formatter: intFmt, style: { fontSize: '11px' } } },
        yaxis: { labels: { maxWidth: Math.max(110, Math.min(340, Math.round(hw * 0.38))), style: { fontSize: '12px', colors: INK } } },
        grid: { borderColor: GRID, padding: { right: 30 } }
      });
      var nice = niceAxis(maxV);
      if (nice) { base.xaxis.max = nice.max; base.xaxis.tickAmount = nice.ticks; }
    } else {
      var xt = scales.x && scales.x.title && scales.x.title.display ? String(scales.x.title.text || '') : '';
      var yt = scales.y && scales.y.title && scales.y.title.display ? String(scales.y.title.text || '') : '';
      merge(base, {
        xaxis: {
          categories: labels,
          labels: { rotate: -45, rotateAlways: false, hideOverlappingLabels: true, trim: true, style: { fontSize: '11px' } }
        },
        yaxis: { min: 0, forceNiceScale: true, labels: { formatter: intFmt } },
        grid: { borderColor: GRID, padding: { top: 22 } }
      });
      var tstyle = { fontSize: '11px', fontWeight: 600, color: MUTED };
      if (xt) base.xaxis.title = { text: xt, style: tstyle };
      if (yt) base.yaxis.title = { text: yt, style: tstyle };
    }
    return base;
  }

  /* ---------- API pública ---------- */
  function PVChart(canvas, cfg) {
    var pv = (cfg && cfg.pv) || {};

    // si ya había un gráfico en este canvas, se limpia
    if (canvas._pvHandle && !canvas._pvHandle._dead) canvas._pvHandle.destroy();

    var handle = { _dead: false, _apex: null, _fallback: null, _host: null, _title: null, _ro: null, _ro2: null };
    canvas._pvHandle = handle;

    // el canvas se oculta de inmediato y el gráfico va en un <div> hermano
    var host = document.createElement('div');
    host.className = 'pv-apex';
    var reserve = pv.height || (canvas.parentElement && canvas.parentElement.classList.contains('chartBox') ? 0 : 200);
    if (reserve) host.style.minHeight = reserve + 'px';
    canvas.style.display = 'none';
    canvas.insertAdjacentElement('afterend', host);
    handle._host = host;

    var tp = (cfg.options && cfg.options.plugins && cfg.options.plugins.title) || null;
    if (tp && tp.display && tp.text) {
      var ttl = document.createElement('div');
      ttl.className = 'pv-title';
      ttl.textContent = String(tp.text);
      host.insertAdjacentElement('beforebegin', ttl);
      handle._title = ttl;
    }

    handle.destroy = function () {
      handle._dead = true;
      try { if (handle._apex) handle._apex.destroy(); } catch (e) {}
      try { if (handle._fallback) handle._fallback.destroy(); } catch (e) {}
      try { if (handle._ro) handle._ro.disconnect(); } catch (e) {}
      try { if (handle._ro2) handle._ro2.disconnect(); } catch (e) {}
      handle._apex = null; handle._fallback = null; handle._ro = null; handle._ro2 = null;
      if (handle._host && handle._host.parentNode) handle._host.parentNode.removeChild(handle._host);
      if (handle._title && handle._title.parentNode) handle._title.parentNode.removeChild(handle._title);
      handle._host = null; handle._title = null;
    };

    function useFallback() {
      if (handle._dead || typeof window.Chart === 'undefined') return;
      if (handle._host && handle._host.parentNode) handle._host.parentNode.removeChild(handle._host);
      if (handle._title && handle._title.parentNode) handle._title.parentNode.removeChild(handle._title);   /* Chart.js dibuja el suyo */
      handle._host = null; handle._title = null;
      canvas.style.display = '';
      var plain = {};
      Object.keys(cfg).forEach(function (k) { if (k !== 'pv') plain[k] = cfg[k]; });
      try { handle._fallback = new window.Chart(canvas, plain); } catch (e) { console.error('Gráfico (respaldo):', e); }
    }

    function drawApex() {
      if (handle._dead) return;
      try {
        var opts = merge(build(canvas, cfg, pv), pv.apex || {});
        handle._apex = new window.ApexCharts(host, opts);
        var r = handle._apex.render();
        if (r && r.catch) r.catch(function (e) {
          console.error('ApexCharts:', e);
          if (!handle._dead) { try { handle._apex.destroy(); } catch (x) {} handle._apex = null; useFallback(); }
        });
        followWidth();
      } catch (e) {
        console.error('ApexCharts:', e);
        handle._apex = null;
        useFallback();
      }
    }

    /* El gráfico acompaña el ancho de su contenedor (ventana, rotación del celular, pestañas) */
    function followWidth() {
      if (typeof ResizeObserver === 'undefined') return;
      var last = host.clientWidth, timer = null;
      var ro = new ResizeObserver(function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          if (handle._dead || !handle._apex) return;
          var w = host.clientWidth;
          if (w > 0 && Math.abs(w - last) > 4) {
            last = w;
            try { handle._apex.updateOptions({ chart: { width: w } }, false, false); } catch (e) {}
          }
        }, 120);
      });
      ro.observe(host);
      handle._ro2 = ro;
    }

    /* Si el panel está oculto (pestaña no activa) el ancho es 0: se espera a que se muestre */
    function drawWhenVisible() {
      if (handle._dead) return;
      if (host.clientWidth > 0 || typeof ResizeObserver === 'undefined') { drawApex(); return; }
      var ro = new ResizeObserver(function () {
        if (handle._dead) { ro.disconnect(); return; }
        if (host.clientWidth > 0) { ro.disconnect(); handle._ro = null; drawApex(); }
      });
      handle._ro = ro;
      ro.observe(host);
    }

    loadApex().then(function (ok) {
      if (handle._dead) return;
      if (!ok) { useFallback(); return; }
      drawWhenVisible();
    });

    return handle;
  }

  window.PVChart = PVChart;
})();
