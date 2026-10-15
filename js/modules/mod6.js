/* ========= MÓDULO 6: GOBERNANZA Y COOPERACIÓN ========= */

/* ── Datos de los 4 ejes ── */
const EJES = [
  {
    id: 'carril',
    numero: 'Eje 01',
    titulo: 'Carril Bus (Piloto)',
    descripcion: 'Estrategia para priorizar el transporte público con señalización y/o segregación de un carril a fin de mejorar la operación.',
    imagen: './assets/img/imagen1.png',
    pills: [
      { label: 'Gestión de tránsito', color: 'blue' },
      { label: 'Transporte público',  color: 'green' },
      { label: 'Paraderos',           color: 'purple' },
      { label: 'Implementación',      color: 'amber' }
    ],
    intro: `Esta iniciativa busca mejorar la movilidad urbana priorizando el transporte público de pasajeros sobre el transporte particular,
            mediante la puesta en operación de un piloto carril bus. Consistirá en la implementación de dispositivos de control de tránsito,
            señalización horizontal y vertical, así como elementos segregadores (conos, bolardos o bloques New Jersey) de requerirse, para delimitar
            el carril exclusivo para el servicio de transporte público de pasajeros.`,
    imagenes: [
      { src: './assets/img/carrilbus1.png', caption: 'Situación actual' },
      { src: './assets/img/carrilbus2.png', caption: 'Situación propuesta' }
    ],
    acordeones: [
      {
        titulo: 'Beneficios esperados',
        contenido: `<ul>
          <li>Reducción de los tiempos de viaje para los usuarios del transporte público.</li>
          <li>Aumento de la velocidad de operación de las rutas de transporte.</li>
          <li>Mayor atractivo del servicio de transporte público, incentivando su uso frente a otros modos.</li>
          <li>Incremento de la frecuencia de operación de las rutas.</li>
          <li>Mayor capacidad de transporte permitiendo movilizar más pasajeros por hora y sentido.</li>
        </ul>`
      },
      {
        titulo: 'Objetivo general',
        contenido: `<ul>
          <li>Mejorar la eficiencia y calidad del servicio de transporte urbano mediante la implementación de carriles exclusivos para vehículos de transporte público de pasajeros.</li>
        </ul>`
      },
      {
        titulo: 'Objetivos específicos',
        contenido: `<ul>
          <li>Reducir los tiempos de viaje mediante carriles exclusivos para el transporte público, permitiendo una circulación más rápida y fluida.</li>
          <li>Fomentar el uso del servicio de transporte público, garantizando horarios más consistentes y predecibles.</li>
        </ul>`
      },
      {
        titulo: 'Hitos y actividades (ACTUALIZAR)',
        contenido: `<div style="overflow:auto;border:1px solid var(--border);border-radius:12px">
          <table class="g6-table">
            <thead><tr><th>Hito</th><th>Actividad</th><th>Tiempo referencial</th></tr></thead>
            <tbody>
              <tr><td>Hito 1</td><td>Presentación de la AT de Piloto Carril Bus</td><td>1–2 semanas</td></tr>
              <tr><td>Hito 2</td><td>Presentación del análisis espacial de la ciudad</td><td>1–3 semanas</td></tr>
              <tr><td>Hito 3</td><td>Desarrollo de la tabla de criterios de selección de vías</td><td>1–3 semanas</td></tr>
              <tr><td>Hito 4</td><td>Definición por parte de la MPC de las vías potenciales</td><td>1–2 semanas</td></tr>
              <tr><td>Hito 5</td><td>Capacitación y recopilación de datos estáticos por parte del GL</td><td>1–2 semanas</td></tr>
              <tr><td>Hito 6</td><td>Definir la vía y tramo de implementación del piloto</td><td>1 semana</td></tr>
              <tr><td>Hito 7</td><td>Recolección de indicadores de línea base</td><td>1 semana</td></tr>
              <tr><td><strong>Hito 8</strong></td><td><strong>Informe Etapa 1</strong></td><td><strong>1–2 semanas</strong></td></tr>
              <tr><td>Hito 9</td><td>Elaboración de la propuesta técnica</td><td>3–4 semanas</td></tr>
              <tr><td><strong>Hito 10</strong></td><td><strong>Informe Etapa 2</strong></td><td><strong>1–2 semanas</strong></td></tr>
              <tr><td>Hito 11</td><td>Emisión de la autorización para la implementación del piloto</td><td>2–4 semanas</td></tr>
              <tr><td>Hito 12</td><td>Ejecución de los trabajos de señalización sobre el carril bus</td><td>2–3 semanas</td></tr>
              <tr><td>Hito 13</td><td>Proceso de socialización y comunicación</td><td>3–6 semanas</td></tr>
              <tr><td>Hito 14</td><td>Puesta en operación del piloto y recolección de indicadores</td><td>1–2 semanas</td></tr>
              <tr><td><strong>Hito 15</strong></td><td><strong>Informe técnico de monitoreo</strong></td><td><strong>1–2 semanas</strong></td></tr>
            </tbody>
          </table>
        </div>`
      },
      {
        titulo: 'Requisitos del municipio',
        contenido: `<div class="g6-req-grid">
          <div class="g6-req-card"><h4>Puntos focales</h4><p>Para las gestiones y reuniones de trabajo de la asistencia técnica.</p></div>
          <div class="g6-req-card"><h4>Información secundaria</h4><p>Para la elaboración del análisis espacial: rutas, paraderos, etc.</p></div>
          <div class="g6-req-card"><h4>Personal de campo</h4><p>Para los trabajos de datos estáticos y recolección de datos de línea base.</p></div>
          <div class="g6-req-card"><h4>Unidad móvil</h4><p>Para la inspección de vías y medición con equipo GPS.</p></div>
          <div class="g6-req-card"><h4>Materiales del GL</h4><p>Pintura, señales verticales y elementos segregadores.</p></div>
        </div>`
      },
      {
        titulo: 'Costo referencial (1.5 km de extensión) (ACTUALIZAR)',
        contenido: `<div style="overflow:auto;border:1px solid var(--border);border-radius:12px">
          <table class="g6-table">
            <thead><tr><th>Ítem</th><th>Materiales</th><th>Subtotal</th></tr></thead>
            <tbody>
              <tr><td>1.1</td><td>Pintura de tráfico blanca</td><td>S/. 32,200.00</td></tr>
              <tr><td>1.2</td><td>Pintura de tráfico amarillo</td><td>S/. 18,400.00</td></tr>
              <tr><td>1.3</td><td>Pintura de tráfico para Carril Bus</td><td>S/. 8,900.00</td></tr>
              <tr><td>1.4</td><td>Diluyente para pintura de tráfico</td><td>S/. 8,950.00</td></tr>
              <tr><td>1.5</td><td>Herramientas diversas</td><td>S/. 2,000.00</td></tr>
              <tr><td>1.6</td><td>Elementos de segregación de Carril Bus</td><td>S/. 48,000.00</td></tr>
              <tr><td>1.7</td><td>Señales verticales</td><td>S/. 13,000.00</td></tr>
              <tr><td><strong>1.8</strong></td><td><strong>TOTAL</strong></td><td><strong>S/. 131,450.00</strong></td></tr>
            </tbody>
          </table>
        </div>`
      },
      {
        titulo: 'Equipo técnico DFPM - PROMOVILIDAD',
        contenido: `<div style="overflow:auto;border:1px solid var(--border);border-radius:12px">
          <table class="g6-table">
            <thead><tr><th>Nombre</th><th>Cargo</th></tr></thead>
            <tbody>
              <tr><td>Ing. Cesar W. Bedón Herrera</td><td>Coordinador de Fortalecimiento y Asistencia Técnica- DFPM</td></tr>
              <tr><td>Ing. Christian D. Barrazueta Mancilla</td><td>Analista en Gestión de la Movilidad</td></tr>
            </tbody>
          </table>
        </div>`
      }
    ],
    descargas: [
      { label: 'CONCEPTO ESTRATEGIA CARRIL BUS (PILOTO)', sub: 'PDF', url: './assets/docs/CONCEPTO ESTRATEGIA CARRIL BUS (PILOTO).pdf', icono: '📄' },
      { label: 'ACTIVIDADES 2024 CARRIL BUS',             sub: 'PDF', url: './assets/docs/ACTIVIDADES 2024 CARRIL BUS.pdf',             icono: '📄' },
      { label: 'ACTIVIDADES 2025 CARRIL BUS',             sub: 'PDF', url: './assets/docs/ACTIVIDADES 2025 CARRIL BUS.pdf',             icono: '📄' },
      { label: 'Solicitar asistencia (modelo de oficio)', sub: 'DOCX', url: './assets/docs/solicitudCARRILBUS.docx',                    icono: '📝' }
    ]
  },

  {
    id: 'ztc',
    numero: 'Eje 02',
    titulo: 'Zonas de Tráfico Calmado (ZTC)',
    descripcion: 'Intervenciones para reducir velocidad (pacificar vías) y mejorar la seguridad vial con enfoque en peatones.',
    imagen: './assets/img/imagen2.png',
    pills: [
      { label: 'Seguridad vial',  color: 'blue' },
      { label: 'Espacio público', color: 'green' },
      { label: 'Diseño urbano',   color: 'amber' }
    ],
    intro: `Las Zonas de Tráfico Calmado (ZTC) son intervenciones urbanas orientadas a reducir la velocidad de los vehículos motorizados
            en zonas específicas de la ciudad, mejorando la seguridad vial y priorizando la movilidad peatonal y ciclista. AGREGAR UN TEXTO DEL COMPROMISO 6`,
    imagenes: [
      { src: './assets/img/ztc1.png', caption: 'Situación actual' },
      { src: './assets/img/ztc2.png', caption: 'Situación propuesta' }
    ],
    acordeones: [
      {
        titulo: 'Beneficios esperados',
        contenido: `<ul>
          <li>Reducción de accidentes de tránsito y atropellos en zonas críticas.</li>
          <li>Mejora de la calidad del espacio público para peatones y ciclistas.</li>
          <li>Reducción de ruido y contaminación vehicular en zonas residenciales.</li>
          <li>Mayor seguridad para los usuarios vulnerables de la vía.</li>
        </ul>`
      },
      {
        titulo: 'Objetivo general',
        contenido: `<ul>
          <li>Implementar medidas de gestión del tráfico para reducir velocidades vehiculares y mejorar la seguridad vial en zonas urbanas críticas.</li>
        </ul>`
      },
      {
        titulo: 'Requisitos del municipio',
        contenido: `<div class="g6-req-grid">
          <div class="g6-req-card"><h4>Puntos focales</h4><p>Para las coordinaciones técnicas y reuniones de trabajo.</p></div>
          <div class="g6-req-card"><h4>Información vial</h4><p>Planos, estudios de tráfico y datos de accidentalidad disponibles.</p></div>
          <div class="g6-req-card"><h4>Personal de campo</h4><p>Para el levantamiento de información y supervisión de obras.</p></div>
          <div class="g6-req-card"><h4>Presupuesto municipal</h4><p>Para la ejecución de obras de señalización e infraestructura.</p></div>
        </div>`
      },
      {
        titulo: 'Costo referencial (1.5 km de extensión) ACTUALIZAR',
        contenido: `<div style="overflow:auto;border:1px solid var(--border);border-radius:12px">
          <table class="g6-table">
            <thead><tr><th>Ítem</th><th>Materiales</th><th>Subtotal</th></tr></thead>
            <tbody>
              <tr><td>1.1</td><td>Pintura de tráfico blanca</td><td>S/. 32,200.00</td></tr>
              <tr><td>1.2</td><td>Pintura de tráfico amarillo</td><td>S/. 18,400.00</td></tr>
              <tr><td>1.3</td><td>Pintura de tráfico para Carril Bus</td><td>S/. 8,900.00</td></tr>
              <tr><td>1.4</td><td>Diluyente para pintura de tráfico</td><td>S/. 8,950.00</td></tr>
              <tr><td>1.5</td><td>Herramientas diversas</td><td>S/. 2,000.00</td></tr>
              <tr><td>1.6</td><td>Elementos de segregación de Carril Bus</td><td>S/. 48,000.00</td></tr>
              <tr><td>1.7</td><td>Señales verticales</td><td>S/. 13,000.00</td></tr>
              <tr><td><strong>1.8</strong></td><td><strong>TOTAL</strong></td><td><strong>S/. 131,450.00</strong></td></tr>
            </tbody>
          </table>
        </div>`
      },
      {
        titulo: 'Equipo técnico DFPM - PROMOVILIDAD AGREGAR A VANESSA',
        contenido: `<div style="overflow:auto;border:1px solid var(--border);border-radius:12px">
          <table class="g6-table">
            <thead><tr><th>Nombre</th><th>Cargo</th></tr></thead>
            <tbody>
              <tr><td>Ing. Cesar W. Bedón Herrera</td><td>Coordinador de Fortalecimiento y Asistencia Técnica- DFPM</td></tr>
              <tr><td>Ing. Christian D. Barrazueta Mancilla</td><td>Analista en Gestión de la Movilidad</td></tr>
            </tbody>
          </table>
        </div>`
      }
    ],
    descargas: [
      { label: 'CONCEPTO ESTRATEGIA ZTC',                 sub: 'PDF',  url: './assets/docs/CONCEPTO ESTRATEGIA ZTC.pdf', icono: '📄' },
      { label: 'ACTIVIDADES 2024 ZTC',                    sub: 'PDF',  url: './assets/docs/ACTIVIDADES 2024 ZTC.pdf',    icono: '📄' },
      { label: 'ACTIVIDADES 2025 ZTC',                    sub: 'PDF',  url: './assets/docs/ACTIVIDADES 2025 ZTC.pdf',    icono: '📄' },
      { label: 'Solicitar asistencia (modelo de oficio)', sub: 'DOCX', url: './assets/docs/solicitudZTC.docx',            icono: '📝' }
    ]
  },

  {
    id: 'prr',
    numero: 'Eje 03',
    titulo: 'Plan Regulador de Rutas (PRR)',
    descripcion: 'Asistencia para planificación y diseño de paraderos, ordenamiento de paradas y mejora de accesibilidad.',
    imagen: './assets/img/imagen3.png',
    pills: [
      { label: 'Infraestructura', color: 'blue' },
      { label: 'Operación',       color: 'green' },
      { label: 'Accesibilidad',   color: 'amber' }
    ],
    intro: `El Plan Regulador de Rutas (PRR) es un instrumento de planificación que permite ordenar, racionalizar y optimizar
            la red de rutas de transporte público urbano, estableciendo criterios técnicos para la operación eficiente del sistema.`,
    imagenes: [
      { src: './assets/mod6/img/prr1.png', caption: 'Situación actual' },
      { src: './assets/mod6/img/prr2.png', caption: 'Situación propuesta' }
    ],
    acordeones: [
      {
        titulo: 'Beneficios esperados',
        contenido: `<ul>
          <li>Ordenamiento de la red de rutas de transporte público.</li>
          <li>Reducción de superposición de rutas y optimización de frecuencias.</li>
          <li>Mejora en la accesibilidad y cobertura del servicio.</li>
          <li>Base técnica para la formalización y regulación del transporte.</li>
        </ul>`
      },
      {
        titulo: 'Objetivo general',
        contenido: `<ul>
          <li>Elaborar un instrumento técnico de planificación que permita ordenar y optimizar la red de rutas de transporte público urbano.</li>
        </ul>`
      },
      {
        titulo: 'Requisitos del municipio',
        contenido: `<div class="g6-req-grid">
          <div class="g6-req-card"><h4>Puntos focales</h4><p>Equipo técnico municipal para las coordinaciones del proceso.</p></div>
          <div class="g6-req-card"><h4>Información de rutas</h4><p>Expedientes técnicos de rutas autorizadas y datos de operación.</p></div>
          <div class="g6-req-card"><h4>Datos de demanda</h4><p>Estudios de origen-destino o información de pasajeros disponible.</p></div>
          <div class="g6-req-card"><h4>Cartografía</h4><p>Planos actualizados de la red vial urbana.</p></div>
        </div>`
      }
    ],
    descargas: [
      { label: 'Concepto PRR', sub: 'PDF', url: './assets/mod6/docs/PRR_concepto.pdf', icono: '📄' },
      { label: 'Solicitar asistencia (modelo de oficio)', sub: 'DOCX', url: './assets/docs/solicitudPRR.docx', icono: '📝' }
    ]
  },

  {
    id: 'via',
    numero: 'Eje 04',
    titulo: 'Vía exclusiva para el transporte público',
    descripcion: 'Implementación de corredores o tramos exclusivos para mejorar la velocidad, confiabilidad y prioridad del transporte público urbano.',
    imagen: './assets/img/imagen4.png',
    pills: [
      { label: 'Gestión de tránsito', color: 'blue' },
      { label: 'Transporte público',  color: 'green' },
      { label: 'Operación',           color: 'amber' }
    ],
    intro: `La vía exclusiva para el transporte público consiste en la designación de corredores o tramos viales de uso exclusivo
            para los vehículos de transporte público, mejorando su velocidad comercial, confiabilidad y prioridad frente al tráfico mixto.`,
    imagenes: [
      { src: './assets/mod6/img/via1.png', caption: 'Situación actual' },
      { src: './assets/mod6/img/via2.png', caption: 'Situación propuesta' }
    ],
    acordeones: [
      {
        titulo: 'Beneficios esperados',
        contenido: `<ul>
          <li>Aumento de la velocidad comercial del transporte público.</li>
          <li>Mayor confiabilidad y puntualidad del servicio.</li>
          <li>Reducción del tiempo de viaje para los usuarios.</li>
          <li>Incentivo al uso del transporte público frente al vehículo privado.</li>
        </ul>`
      },
      {
        titulo: 'Objetivo general',
        contenido: `<ul>
          <li>Implementar corredores o tramos de vía exclusiva para el transporte público que mejoren su eficiencia operativa y competitividad frente a otros modos de transporte.</li>
        </ul>`
      },
      {
        titulo: 'Requisitos del municipio',
        contenido: `<div class="g6-req-grid">
          <div class="g6-req-card"><h4>Puntos focales</h4><p>Equipo técnico para coordinaciones y seguimiento del proceso.</p></div>
          <div class="g6-req-card"><h4>Datos de tráfico</h4><p>Aforos vehiculares y datos de operación del transporte público.</p></div>
          <div class="g6-req-card"><h4>Red vial</h4><p>Planos e información de la jerarquía vial urbana.</p></div>
          <div class="g6-req-card"><h4>Voluntad política</h4><p>Compromiso de la autoridad local para la implementación y fiscalización.</p></div>
        </div>`
      }
    ],
    descargas: [
      { label: 'Concepto Vía Exclusiva', sub: 'PDF', url: './assets/mod6/docs/VIA_EXCLUSIVA_concepto.pdf', icono: '📄' },
      { label: 'Solicitar asistencia (modelo de oficio)', sub: 'DOCX', url: './assets/mod6/docs/solicitudVIAEXCLUSIVA.docx', icono: '📝' }
    ]
  }
];

/* ── Estado ── */
let ejeActivo = null;

/* ── Helpers ── */
function pillHtml(pills) {
  return pills.map(p => `<span class="g6-pill g6-pill--${p.color}">${p.label}</span>`).join('');
}

function descargasHtml(descargas) {
  if (!descargas?.length) return '<p class="muted" style="font-size:13px">Sin documentos disponibles aún.</p>';
  return descargas.map(d => `
    <a class="g6-dl-card" href="${d.url}" target="_blank" rel="noopener noreferrer">
      <span class="g6-dl-ico">${d.icono}</span>
      <span class="g6-dl-meta">
        <span class="g6-dl-title">${d.label}</span>
        <span class="g6-dl-sub">${d.sub}</span>
      </span>
      <span class="g6-dl-go">↗</span>
    </a>
  `).join('');
}

function imagenesHtml(imagenes) {
  if (!imagenes?.length) return '';
  return `
    <details class="g6-acc" open>
      <summary>Concepto de la estrategia</summary>
      <div class="g6-acc-body">
        <div class="g6-imagenes">
          ${imagenes.map(img => `
            <figure class="g6-figure">
              <img src="${img.src}" alt="${img.caption}" loading="lazy"
                   onclick="document.getElementById('g6Lightbox').classList.add('active');
                            document.getElementById('g6LightboxImg').src='${img.src}'">
              <figcaption>${img.caption}</figcaption>
            </figure>
          `).join('')}
        </div>
      </div>
    </details>`;
}

function acordeonesHtml(acordeones) {
  return acordeones.map(a => `
    <details class="g6-acc">
      <summary>${a.titulo}</summary>
      <div class="g6-acc-body">${a.contenido}</div>
    </details>
  `).join('');
}

/* ── Render catálogo ── */
function renderCatalogo() {
  const cont = document.getElementById('g6Catalogo');
  if (!cont) return;

  cont.innerHTML = `
    <div class="g6-intro">
      <h2 style="margin:0 0 6px">Asistencias técnicas y fortalecimiento</h2>
      <p class="muted" style="margin:0 0 16px;line-height:1.55">
        PROMOVILIDAD brinda a los gobiernos locales asistencia técnica en materia de movilidad urbana sostenible.
        Selecciona un eje para ver contenidos, actividades, requisitos y documentos descargables.
      </p>
    </div>
    <div class="g6-grid">
      ${EJES.map(eje => `
        <article class="g6-card" onclick="window._g6OpenEje('${eje.id}')">
          <div class="g6-media" style="${eje.imagen ? `background-image:url('${eje.imagen}')` : ''}">
            <span class="g6-badge">${eje.numero}</span>
          </div>
          <div class="g6-card-body">
            <h3>${eje.titulo}</h3>
            <p>${eje.descripcion}</p>
            <div class="g6-pills">${pillHtml(eje.pills)}</div>
          </div>
        </article>
      `).join('')}
    </div>
    <div class="g6-footer">
      Para solicitar asistencia técnica comunicarse al correo
      <a href="mailto:dfpm@promovilidad.gob.pe" style="font-weight:700;color:var(--accent)">dfpm@promovilidad.gob.pe</a>
    </div>
  `;
}

/* ── Render detalle de eje ── */
function renderDetalle(ejeId) {
  const eje = EJES.find(e => e.id === ejeId);
  if (!eje) return;
  ejeActivo = ejeId;

  const cont = document.getElementById('g6Detalle');
  if (!cont) return;

  cont.innerHTML = `
    <div class="g6-detalle-header">
      <button class="btn" id="g6BtnVolver">◀ Volver</button>
      <div>
        <span class="g6-badge-inline">${eje.numero}</span>
        <strong style="font-size:15px;margin-left:8px">${eje.titulo}</strong>
      </div>
      <div class="g6-pills" style="margin-left:auto">${pillHtml(eje.pills)}</div>
    </div>

    <div class="g6-detalle-body">
      <div class="g6-detalle-main">
        <p class="muted" style="line-height:1.6;margin-bottom:16px">${eje.intro}</p>
        ${imagenesHtml(eje.imagenes)}
        ${acordeonesHtml(eje.acordeones)}
      </div>

      <aside class="g6-detalle-side">
        <div class="g6-side-card">
          <div class="g6-side-title">📥 Descargas</div>
          <div class="g6-dl-list">${descargasHtml(eje.descargas)}</div>
        </div>
      </aside>
    </div>
  `;

  /* Botón volver */
  document.getElementById('g6BtnVolver').onclick = () => {
    document.getElementById('g6Detalle').style.display  = 'none';
    document.getElementById('g6Catalogo').style.display = '';
    ejeActivo = null;
  };

  /* Mostrar detalle, ocultar catálogo */
  document.getElementById('g6Catalogo').style.display = 'none';
  document.getElementById('g6Detalle').style.display  = '';
}

/* ── Lightbox interno ── */
function initLightbox() {
  const lb = document.getElementById('g6Lightbox');
  if (!lb || lb._bound) return;
  lb._bound = true;
  lb.addEventListener('click', e => {
    if (e.target === lb) lb.classList.remove('active');
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') lb.classList.remove('active');
  });
}

/* ── Entrada pública ── */
export async function initModGobernanza() {
  const cat = document.getElementById('g6Catalogo');
  const det = document.getElementById('g6Detalle');
  if (!cat || !det) return;

  /* Exponer función al HTML */
  window._g6OpenEje = renderDetalle;

  /* Estado inicial */
  det.style.display = 'none';
  cat.style.display = '';

  renderCatalogo();
  initLightbox();
}
