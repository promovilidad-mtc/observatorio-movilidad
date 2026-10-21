/* ========= MÓDULO 6: ASISTENCIA TÉCNICA (antes Gobernanza y cooperación) ========= */

/* ──────────────────────────────────────────────────────────────────────────
   DATOS DE LOS EJES
   👉 Para agregar una asistencia nueva: copia un bloque { id: ... } completo,
      cambia el id (sin espacios) y llena los campos. Las secciones que dejes
      vacías ([] o '') no se muestran.
   👉 Documentos: url puede ser una ruta local (./assets/docs/...) o un enlace
      de Google Drive. Si url está vacío ('') se muestra "Próximamente".
   👉 nota: texto pendiente de revisión; se muestra como etiqueta amarilla
      junto al título de la sección. Bórrala cuando ya esté revisado.
   ────────────────────────────────────────────────────────────────────────── */
const EJES = [
  {
    id: 'carril',
    numero: 'Eje 01',
    icono: 'fa-bus',
    titulo: 'Carril Bus (Piloto)',
    descripcion: 'Estrategia para priorizar el transporte público con señalización y/o segregación de un carril a fin de mejorar la operación.',
    imagen: './assets/img/imagen1.png',
    etiquetas: ['Gestión de tránsito', 'Transporte público', 'Paraderos', 'Implementación'],
    intro: `Esta iniciativa busca mejorar la movilidad urbana priorizando el transporte público de pasajeros sobre el transporte particular,
            mediante la puesta en operación de carriles preferenciales y/o exclusivos. Consistirá en la implementación de dispositivos de control de tránsito,
            señalización horizontal y vertical, así como elementos segregadores (conos, bolardos o bloques New Jersey) de requerirse, para delimitar
            el carril exclusivo para el servicio de transporte público de pasajeros.`,
    imagenes: [
      { src: './assets/img/carrilbus1.png', caption: 'Situación actual' },
      { src: './assets/img/carrilbus2.png', caption: 'Situación propuesta' }
    ],
    beneficios: [
      'Reducción de los tiempos de viaje para los usuarios del transporte público.',
      'Aumento de la velocidad de operación de las rutas de transporte.',
      'Mayor atractivo del servicio de transporte público, incentivando su uso frente a otros modos.',
      'Incremento de la frecuencia de operación de las rutas.',
      'Mayor capacidad de transporte permitiendo movilizar más pasajeros por hora y sentido.'
    ],
    objetivoGeneral: 'Mejorar la eficiencia y calidad del servicio de transporte urbano mediante la implementación de carriles exclusivos para vehículos de transporte público de pasajeros.',
    objetivosEspecificos: [
      'Reducir los tiempos de viaje mediante carriles exclusivos para el transporte público, permitiendo una circulación más rápida y fluida.',
      'Fomentar el uso del servicio de transporte público, garantizando horarios más consistentes y predecibles.'
    ],
    hitos: {
      nota: 'ACTUALIZAR',
      // informe: true → se resalta como entregable
      items: [
        { hito: 'Hito 1',  actividad: 'Presentación de la Asistencia Técnica de Piloto Carril Bus', tiempo: '1–2 semanas' },
        { hito: 'Hito 2',  actividad: 'Presentación del análisis espacial de la ciudad', tiempo: '1–3 semanas' },
        { hito: 'Hito 3',  actividad: 'Desarrollo de la tabla de criterios de selección de vías', tiempo: '1–3 semanas' },
        { hito: 'Hito 4',  actividad: 'Definición por parte de la Municipalidad Provincial de las vías potenciales', tiempo: '1–2 semanas' },
        { hito: 'Hito 5',  actividad: 'Capacitación y recopilación de datos estáticos por parte del gobierno local', tiempo: '1–2 semanas' },
        { hito: 'Hito 6',  actividad: 'Definir la vía y tramo de implementación del piloto', tiempo: '1 semana' },
        { hito: 'Hito 7',  actividad: 'Recolección de indicadores de línea base', tiempo: '1 semana' },
        { hito: 'Hito 8',  actividad: 'Informe Etapa 1', tiempo: '1–2 semanas', informe: true },
        { hito: 'Hito 9',  actividad: 'Elaboración de la propuesta técnica', tiempo: '3–4 semanas' },
        { hito: 'Hito 10', actividad: 'Informe Etapa 2', tiempo: '1–2 semanas', informe: true },
        { hito: 'Hito 11', actividad: 'Emisión de la autorización para la implementación del piloto por parte del gobierno local', tiempo: '2–4 semanas' },
        { hito: 'Hito 12', actividad: 'Ejecución de los trabajos de señalización sobre el carril bus', tiempo: '2–3 semanas' },
        { hito: 'Hito 13', actividad: 'Proceso de socialización y comunicación', tiempo: '3–6 semanas' },
        { hito: 'Hito 14', actividad: 'Puesta en operación del piloto y recolección de indicadores', tiempo: '1–2 semanas' },
        { hito: 'Hito 15', actividad: 'Informe técnico de monitoreo', tiempo: '1–2 semanas', informe: true }
      ]
    },
    requisitos: [
      { icono: 'fa-user-tie',       titulo: 'Puntos focales',          texto: 'Para las gestiones y reuniones de trabajo de la asistencia técnica.' },
      { icono: 'fa-folder-open',    titulo: 'Información secundaria',  texto: 'Para la elaboración del análisis espacial: rutas, paraderos, etc.' },
      { icono: 'fa-helmet-safety',  titulo: 'Personal de campo',       texto: 'Para los trabajos de datos estáticos y recolección de datos de línea base.' },
      { icono: 'fa-car-side',       titulo: 'Unidad móvil',            texto: 'Para la inspección de vías y medición con equipo GPS.' },
      { icono: 'fa-paint-roller',   titulo: 'Materiales del GL',       texto: 'Pintura, señales verticales y elementos segregadores.' }
    ],
    costo: {
      titulo: 'Costo referencial (1.5 km de extensión)',
      nota: 'ACTUALIZAR',
      items: [
        { item: '1.1', material: 'Pintura de tráfico blanca',              subtotal: 'S/. 32,200.00' },
        { item: '1.2', material: 'Pintura de tráfico amarillo',            subtotal: 'S/. 18,400.00' },
        { item: '1.3', material: 'Pintura de tráfico para Carril Bus',     subtotal: 'S/. 8,900.00' },
        { item: '1.4', material: 'Diluyente para pintura de tráfico',      subtotal: 'S/. 8,950.00' },
        { item: '1.5', material: 'Herramientas diversas',                  subtotal: 'S/. 2,000.00' },
        { item: '1.6', material: 'Elementos de segregación de Carril Bus', subtotal: 'S/. 48,000.00' },
        { item: '1.7', material: 'Señales verticales',                     subtotal: 'S/. 13,000.00' }
      ],
      total: 'S/. 131,450.00'
    },
    equipo: {
      personas: [
        { nombre: 'Ing. Cesar W. Bedón Herrera',          cargo: 'Coordinador de Fortalecimiento y Asistencia Técnica- DFPM' },
        { nombre: 'Ing. Christian D. Barrazueta Mancilla', cargo: 'Analista en Gestión de la Movilidad' }
      ]
    },
    documentos: [
      { titulo: 'CONCEPTO ESTRATEGIA CARRIL BUS (PILOTO)', tipo: 'PDF',  url: './assets/docs/CONCEPTO ESTRATEGIA CARRIL BUS (PILOTO).pdf' },
      { titulo: 'ACTIVIDADES 2024 CARRIL BUS',             tipo: 'PDF',  url: './assets/docs/ACTIVIDADES 2024 CARRIL BUS.pdf' },
      { titulo: 'ACTIVIDADES 2025 CARRIL BUS',             tipo: 'PDF',  url: './assets/docs/ACTIVIDADES 2025 CARRIL BUS.pdf' }
    ],
    oficio: './assets/docs/solicitudCARRILBUS.docx'
  },

  {
    id: 'ztc',
    numero: 'Eje 02',
    icono: 'fa-person-walking',
    titulo: 'Zonas de Tráfico Calmado (ZTC)',
    descripcion: 'Intervenciones para reducir velocidad (pacificar vías) y mejorar la seguridad vial con enfoque en peatones.',
    imagen: './assets/img/imagen2.png',
    etiquetas: ['Seguridad vial', 'Espacio público', 'Diseño urbano'],
    intro: `Las Zonas de Tráfico Calmado (ZTC) son intervenciones urbanas orientadas a reducir la velocidad de los vehículos motorizados
            en zonas específicas de la ciudad, mejorando la seguridad vial y priorizando la movilidad peatonal y ciclista. AGREGAR UN TEXTO DEL COMPROMISO 6`,
    imagenes: [
      { src: './assets/img/ztc1.png', caption: 'Situación actual' },
      { src: './assets/img/ztc2.png', caption: 'Situación propuesta' }
    ],
    beneficios: [
      'Reducción de accidentes de tránsito y atropellos en zonas críticas.',
      'Mejora de la calidad del espacio público para peatones y ciclistas.',
      'Reducción de ruido y contaminación vehicular en zonas residenciales.',
      'Mayor seguridad para los usuarios vulnerables de la vía.'
    ],
    objetivoGeneral: 'Implementar medidas de gestión del tráfico para reducir velocidades vehiculares y mejorar la seguridad vial en zonas urbanas críticas.',
    objetivosEspecificos: [],
    hitos: null,
    requisitos: [
      { icono: 'fa-user-tie',   titulo: 'Puntos focales',        texto: 'Para las coordinaciones técnicas y reuniones de trabajo.' },
      { icono: 'fa-map',        titulo: 'Información vial',      texto: 'Planos, estudios de tráfico y datos de accidentalidad disponibles.' },
      { icono: 'fa-helmet-safety', titulo: 'Personal de campo',  texto: 'Para el levantamiento de información y supervisión de obras.' },
      { icono: 'fa-coins',      titulo: 'Presupuesto municipal', texto: 'Para la ejecución de obras de señalización e infraestructura.' }
    ],
    costo: {
      titulo: 'Costo referencial (1.5 km de extensión)',
      nota: 'ACTUALIZAR',
      items: [
        { item: '1.1', material: 'Pintura de tráfico blanca',              subtotal: 'S/. 32,200.00' },
        { item: '1.2', material: 'Pintura de tráfico amarillo',            subtotal: 'S/. 18,400.00' },
        { item: '1.3', material: 'Pintura de tráfico para Carril Bus',     subtotal: 'S/. 8,900.00' },
        { item: '1.4', material: 'Diluyente para pintura de tráfico',      subtotal: 'S/. 8,950.00' },
        { item: '1.5', material: 'Herramientas diversas',                  subtotal: 'S/. 2,000.00' },
        { item: '1.6', material: 'Elementos de segregación de Carril Bus', subtotal: 'S/. 48,000.00' },
        { item: '1.7', material: 'Señales verticales',                     subtotal: 'S/. 13,000.00' }
      ],
      total: 'S/. 131,450.00'
    },
    equipo: {
      nota: 'AGREGAR A VANESSA',
      personas: [
        { nombre: 'Ing. Cesar W. Bedón Herrera',          cargo: 'Coordinador de Fortalecimiento y Asistencia Técnica- DFPM' },
        { nombre: 'Ing. Christian D. Barrazueta Mancilla', cargo: 'Analista en Gestión de la Movilidad' }
      ]
    },
    documentos: [
      { titulo: 'CONCEPTO ESTRATEGIA ZTC', tipo: 'PDF', url: './assets/docs/CONCEPTO ESTRATEGIA ZTC.pdf' },
      { titulo: 'ACTIVIDADES 2024 ZTC',    tipo: 'PDF', url: './assets/docs/ACTIVIDADES 2024 ZTC.pdf' },
      { titulo: 'ACTIVIDADES 2025 ZTC',    tipo: 'PDF', url: './assets/docs/ACTIVIDADES 2025 ZTC.pdf' }
    ],
    oficio: './assets/docs/solicitudZTC.docx'
  },

  {
    id: 'prr',
    numero: 'Eje 03',
    icono: 'fa-route',
    titulo: 'Plan Regulador de Rutas (PRR)',
    descripcion: 'Asistencia para planificación y diseño de paraderos, ordenamiento de paradas y mejora de accesibilidad.',
    imagen: './assets/img/imagen3.png',
    etiquetas: ['Infraestructura', 'Operación', 'Accesibilidad'],
    intro: `El Plan Regulador de Rutas (PRR) es un instrumento de planificación que permite ordenar, racionalizar y optimizar
            la red de rutas de transporte público urbano, estableciendo criterios técnicos para la operación eficiente del sistema.`,
    // Pendiente: antes apuntaban a ./assets/mod6/img/prr1.png y prr2.png (la carpeta no existe)
    imagenes: [
      { src: '', caption: 'Situación actual' },
      { src: '', caption: 'Situación propuesta' }
    ],
    beneficios: [
      'Ordenamiento de la red de rutas de transporte público.',
      'Reducción de superposición de rutas y optimización de frecuencias.',
      'Mejora en la accesibilidad y cobertura del servicio.',
      'Base técnica para la formalización y regulación del transporte.'
    ],
    objetivoGeneral: 'Elaborar un instrumento técnico de planificación que permita ordenar y optimizar la red de rutas de transporte público urbano.',
    objetivosEspecificos: [],
    hitos: null,
    requisitos: [
      { icono: 'fa-user-tie',           titulo: 'Puntos focales',       texto: 'Equipo técnico municipal para las coordinaciones del proceso.' },
      { icono: 'fa-route',              titulo: 'Información de rutas', texto: 'Expedientes técnicos de rutas autorizadas y datos de operación.' },
      { icono: 'fa-people-group',       titulo: 'Datos de demanda',     texto: 'Estudios de origen-destino o información de pasajeros disponible.' },
      { icono: 'fa-map-location-dot',   titulo: 'Cartografía',          texto: 'Planos actualizados de la red vial urbana.' }
    ],
    costo: null,
    equipo: null,
    documentos: [
      // Pendiente: antes apuntaba a ./assets/mod6/docs/PRR_concepto.pdf (no existe)
      { titulo: 'Concepto PRR', tipo: 'PDF', url: '' }
    ],
    oficio: './assets/docs/solicitudPRR.docx'
  },

  {
    id: 'via',
    numero: 'Eje 04',
    icono: 'fa-road',
    titulo: 'Vía exclusiva para el transporte público',
    descripcion: 'Implementación de corredores o tramos exclusivos para mejorar la velocidad, confiabilidad y prioridad del transporte público urbano.',
    imagen: './assets/img/imagen4.png',
    etiquetas: ['Gestión de tránsito', 'Transporte público', 'Operación'],
    intro: `La vía exclusiva para el transporte público consiste en la designación de corredores o tramos viales de uso exclusivo
            para los vehículos de transporte público, mejorando su velocidad comercial, confiabilidad y prioridad frente al tráfico mixto.`,
    // Pendiente: antes apuntaban a ./assets/mod6/img/via1.png y via2.png (la carpeta no existe)
    imagenes: [
      { src: '', caption: 'Situación actual' },
      { src: '', caption: 'Situación propuesta' }
    ],
    beneficios: [
      'Aumento de la velocidad comercial del transporte público.',
      'Mayor confiabilidad y puntualidad del servicio.',
      'Reducción del tiempo de viaje para los usuarios.',
      'Incentivo al uso del transporte público frente al vehículo privado.'
    ],
    objetivoGeneral: 'Implementar corredores o tramos de vía exclusiva para el transporte público que mejoren su eficiencia operativa y competitividad frente a otros modos de transporte.',
    objetivosEspecificos: [],
    hitos: null,
    requisitos: [
      { icono: 'fa-user-tie',  titulo: 'Puntos focales',    texto: 'Equipo técnico para coordinaciones y seguimiento del proceso.' },
      { icono: 'fa-car-side',  titulo: 'Datos de tráfico',  texto: 'Aforos vehiculares y datos de operación del transporte público.' },
      { icono: 'fa-road',      titulo: 'Red vial',          texto: 'Planos e información de la jerarquía vial urbana.' },
      { icono: 'fa-landmark',  titulo: 'Voluntad política', texto: 'Compromiso de la autoridad local para la implementación y fiscalización.' }
    ],
    costo: null,
    equipo: null,
    documentos: [
      // Pendiente: antes apuntaba a ./assets/mod6/docs/VIA_EXCLUSIVA_concepto.pdf (no existe)
      { titulo: 'Concepto Vía Exclusiva', tipo: 'PDF', url: '' }
    ],
    // Pendiente: antes apuntaba a ./assets/mod6/docs/solicitudVIAEXCLUSIVA.docx (no existe)
    oficio: ''
  }
];

const CORREO = 'promovilidad@mtc.gob.pe';

/* ── Helpers ── */
function esc(s) {
  return String(s ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function notaHtml(nota) {
  return nota ? `<span class="g6-nota"><i class="fa-solid fa-pen" aria-hidden="true"></i>${esc(nota)}</span>` : '';
}

function etiquetasHtml(etiquetas) {
  return (etiquetas || []).map(t => `<span class="g6-tag">${esc(t)}</span>`).join('');
}

/* Ícono según el tipo de documento o si es enlace de Drive */
function docIcono(d) {
  if (/drive\.google|docs\.google/.test(d.url || '')) return 'fa-brands fa-google-drive';
  const t = (d.tipo || '').toUpperCase();
  if (t === 'PDF') return 'fa-solid fa-file-pdf';
  if (t === 'DOCX' || t === 'DOC') return 'fa-solid fa-file-word';
  if (t === 'XLSX' || t === 'XLS') return 'fa-solid fa-file-excel';
  return 'fa-solid fa-file-lines';
}

function docHtml(d) {
  const ico = `<span class="g6-doc-ico"><i class="${docIcono(d)}" aria-hidden="true"></i></span>`;
  const meta = `<span class="g6-doc-meta"><span class="g6-doc-title">${esc(d.titulo)}</span><span class="g6-doc-sub">${esc(d.tipo || 'Documento')}</span></span>`;
  if (!d.url) {
    return `<div class="g6-doc is-soon">${ico}${meta}<span class="g6-doc-soon">Próximamente</span></div>`;
  }
  return `<a class="g6-doc" href="${esc(d.url)}" target="_blank" rel="noopener noreferrer">${ico}${meta}
            <i class="fa-solid fa-arrow-up-right-from-square g6-doc-go" aria-hidden="true"></i></a>`;
}

/* Tarjeta de sección del detalle (vacía → no se muestra) */
function seccion(id, icono, titulo, cuerpo, nota) {
  if (!cuerpo) return '';
  return `
    <section class="g6-sec" id="g6-sec-${id}">
      <h3 class="g6-sec-h">
        <span class="g6-sec-ico"><i class="fa-solid ${icono}" aria-hidden="true"></i></span>
        ${esc(titulo)} ${notaHtml(nota)}
      </h3>
      ${cuerpo}
    </section>`;
}

/* ── Contenido de cada sección ── */
function concepto(eje) {
  if (!eje.imagenes?.length) return '';
  return `<div class="g6-imgs">${eje.imagenes.map((img, i) => `
    <figure class="g6-fig">
      ${img.src
        ? `<img src="${esc(img.src)}" alt="${esc(img.caption)}" loading="lazy" data-g6-zoom="${esc(img.src)}">`
        : `<div class="g6-fig-empty"><i class="fa-regular fa-image" aria-hidden="true"></i>Imagen próximamente</div>`}
      <figcaption><span class="g6-fig-n${i ? ' is-prop' : ''}">${i ? 'Después' : 'Antes'}</span>${esc(img.caption)}</figcaption>
    </figure>`).join('')}
  </div>`;
}

function beneficios(eje) {
  if (!eje.beneficios?.length) return '';
  return `<ul class="g6-check">${eje.beneficios.map(b => `
    <li><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>${esc(b)}</span></li>`).join('')}
  </ul>`;
}

function objetivos(eje) {
  if (!eje.objetivoGeneral && !eje.objetivosEspecificos?.length) return '';
  return `
    ${eje.objetivoGeneral ? `
      <div class="g6-obj-gen">
        <span class="g6-label">Objetivo general</span>
        <p>${esc(eje.objetivoGeneral)}</p>
      </div>` : ''}
    ${eje.objetivosEspecificos?.length ? `
      <span class="g6-label" style="margin-top:14px">Objetivos específicos</span>
      <ol class="g6-obj-list">${eje.objetivosEspecificos.map(o => `<li>${esc(o)}</li>`).join('')}</ol>` : ''}`;
}

function hitos(eje) {
  const items = eje.hitos?.items;
  if (!items?.length) return '';
  return `<ol class="g6-tl">${items.map(h => `
    <li class="g6-tl-item${h.informe ? ' is-informe' : ''}">
      <span class="g6-tl-dot" aria-hidden="true"></span>
      <div class="g6-tl-body">
        <span class="g6-tl-hito">${esc(h.hito)}${h.informe ? ' · Entregable' : ''}</span>
        <span class="g6-tl-act">${esc(h.actividad)}</span>
      </div>
      <span class="g6-tl-time"><i class="fa-regular fa-clock" aria-hidden="true"></i>${esc(h.tiempo)}</span>
    </li>`).join('')}
  </ol>`;
}

function requisitos(eje) {
  if (!eje.requisitos?.length) return '';
  return `<div class="g6-req">${eje.requisitos.map(r => `
    <div class="g6-req-item">
      <i class="fa-solid ${r.icono || 'fa-check'}" aria-hidden="true"></i>
      <div><strong>${esc(r.titulo)}</strong><span>${esc(r.texto)}</span></div>
    </div>`).join('')}
  </div>`;
}

function costo(eje) {
  const c = eje.costo;
  if (!c?.items?.length) return '';
  return `<div class="g6-table-wrap">
    <table class="g6-table">
      <thead><tr><th>Ítem</th><th>Materiales</th><th class="num">Subtotal</th></tr></thead>
      <tbody>${c.items.map(r => `<tr><td>${esc(r.item)}</td><td>${esc(r.material)}</td><td class="num">${esc(r.subtotal)}</td></tr>`).join('')}</tbody>
      ${c.total ? `<tfoot><tr><td></td><td>Total</td><td class="num">${esc(c.total)}</td></tr></tfoot>` : ''}
    </table>
  </div>`;
}

function equipo(eje) {
  const p = eje.equipo?.personas;
  if (!p?.length) return '';
  const iniciales = n => n.replace(/^(Ing\.|Arq\.|Lic\.|Econ\.)\s*/i, '').split(/\s+/).filter(w => /^[A-ZÁÉÍÓÚÑ]/.test(w) && w.length > 2).slice(0, 2).map(w => w[0]).join('');
  return `<div class="g6-team">${p.map(x => `
    <div class="g6-person">
      <span class="g6-avatar" aria-hidden="true">${esc(iniciales(x.nombre))}</span>
      <div><strong>${esc(x.nombre)}</strong><span>${esc(x.cargo)}</span></div>
    </div>`).join('')}
  </div>`;
}

/* ── Render catálogo ── */
function renderCatalogo() {
  const cont = document.getElementById('g6Catalogo');
  if (!cont) return;

  cont.innerHTML = `
    <section class="card g6-hero">
      <span class="h-eyebrow">Fortalecimiento de capacidades</span>
      <h2>Asistencia técnica a gobiernos locales</h2>
      <p class="sit-lead">
        PROMOVILIDAD brinda a los gobiernos locales asistencia técnica en materia de movilidad urbana sostenible.
        Selecciona un eje para ver contenidos, actividades, requisitos y documentos descargables.
      </p>
    </section>

    <section class="card">
      <h3 class="sit-h">Ejes de asistencia técnica</h3>
      <div class="g6-grid">
        ${EJES.map(eje => `
          <button type="button" class="g6-card" data-g6-eje="${eje.id}">
            <div class="g6-media"${eje.imagen ? ` style="background-image:url('${esc(eje.imagen)}')"` : ''}>
              <span class="g6-media-ico"><i class="fa-solid ${eje.icono || 'fa-handshake-angle'}" aria-hidden="true"></i></span>
            </div>
            <div class="g6-card-body">
              <span class="obs-tool-tag">${esc(eje.numero)}</span>
              <h3>${esc(eje.titulo)}</h3>
              <p>${esc(eje.descripcion)}</p>
              <div class="g6-tags">${etiquetasHtml(eje.etiquetas)}</div>
              <span class="g6-go">Ver asistencia <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>
            </div>
          </button>
        `).join('')}
      </div>
    </section>

    <section class="card">
      <h3 class="sit-h">¿Cómo solicitar una asistencia técnica?</h3>
      <div class="g6-steps">
        <div class="g6-step">
          <span class="g6-step-n">1</span>
          <div><strong>Revisa el eje de interés</strong><span>Conoce el alcance, los hitos y los requisitos que debe cumplir el gobierno local.</span></div>
        </div>
        <div class="g6-step">
          <span class="g6-step-n">2</span>
          <div><strong>Descarga el modelo de oficio</strong><span>Lo encuentras dentro de cada eje, en el recuadro «Solicitar esta asistencia».</span></div>
        </div>
        <div class="g6-step">
          <span class="g6-step-n">3</span>
          <div><strong>Envía la solicitud</strong><span>Al correo <a href="mailto:${CORREO}">${CORREO}</a>. El equipo DFPM se comunicará para coordinar.</span></div>
        </div>
      </div>
    </section>
  `;
}

/* ── Render detalle de eje ── */
function renderDetalle(ejeId) {
  const eje = EJES.find(e => e.id === ejeId);
  const cont = document.getElementById('g6Detalle');
  if (!eje || !cont) return;

  const secciones = [
    ['concepto',   'fa-images',          'Concepto de la estrategia', concepto(eje)],
    ['beneficios', 'fa-chart-line',      'Beneficios esperados',      beneficios(eje)],
    ['objetivos',  'fa-bullseye',        'Objetivos',                 objetivos(eje)],
    ['hitos',      'fa-list-check',      'Hitos y actividades',       hitos(eje),       eje.hitos?.nota],
    ['requisitos', 'fa-clipboard-check', 'Requisitos del municipio',  requisitos(eje)],
    ['costo',      'fa-coins',           eje.costo?.titulo || 'Costo referencial', costo(eje), eje.costo?.nota],
    ['equipo',     'fa-users',           'Equipo técnico DFPM - PROMOVILIDAD', equipo(eje), eje.equipo?.nota]
  ].filter(s => s[3]);

  cont.innerHTML = `
    <section class="card g6-hero g6-hero--det">
      <nav class="g6-crumb" aria-label="Ruta">
        <button type="button" class="g6-crumb-link" data-g6-volver><i class="fa-solid fa-arrow-left" aria-hidden="true"></i>Asistencia técnica</button>
        <span aria-hidden="true">/</span><span>${esc(eje.titulo)}</span>
      </nav>
      <div class="g6-hero-row">
        <span class="g6-hero-ico"><i class="fa-solid ${eje.icono || 'fa-handshake-angle'}" aria-hidden="true"></i></span>
        <div>
          <span class="h-eyebrow" style="margin-bottom:4px">${esc(eje.numero)}</span>
          <h2>${esc(eje.titulo)}</h2>
        </div>
      </div>
      <p class="sit-lead">${esc(eje.intro)}</p>
      <div class="g6-tags">${etiquetasHtml(eje.etiquetas)}</div>
      ${secciones.length > 1 ? `
        <div class="g6-toc">
          <span class="sit-chips-label">En esta página</span>
          ${secciones.map(s => `<button type="button" class="sit-chip" data-g6-ir="${s[0]}">${esc(s[2])}</button>`).join('')}
        </div>` : ''}
    </section>

    <div class="g6-det">
      <div class="g6-det-main">
        ${secciones.map(s => seccion(...s)).join('')}
      </div>

      <aside class="g6-det-side">
        <div class="g6-side">
          <h3 class="g6-side-h"><i class="fa-solid fa-folder-open" aria-hidden="true"></i>Documentos</h3>
          <div class="g6-docs">
            ${eje.documentos?.length ? eje.documentos.map(docHtml).join('') : '<p class="muted" style="margin:0;font-size:13px">Sin documentos disponibles aún.</p>'}
          </div>
        </div>

        <div class="g6-side g6-side--cta">
          <h3 class="g6-side-h"><i class="fa-solid fa-paper-plane" aria-hidden="true"></i>Solicitar esta asistencia</h3>
          <p>Envía el oficio de solicitud del gobierno local al correo:</p>
          <a class="g6-mail" href="mailto:${CORREO}?subject=${encodeURIComponent('Solicitud de asistencia técnica - ' + eje.titulo)}">
            <i class="fa-solid fa-envelope" aria-hidden="true"></i>${CORREO}
          </a>
          ${docHtml({ titulo: 'Modelo de oficio', tipo: 'DOCX', url: eje.oficio })}
        </div>
      </aside>
    </div>
  `;

  document.getElementById('g6Catalogo').style.display = 'none';
  cont.style.display = '';
  window.scrollTo(0, 0);
}

function volverCatalogo() {
  document.getElementById('g6Detalle').style.display  = 'none';
  document.getElementById('g6Catalogo').style.display = '';
  window.scrollTo(0, 0);
}

/* ── Clics del módulo (un solo listener) ── */
function initEventos() {
  const root = document.getElementById('mod-gobernanza');
  if (!root || root._g6Bound) return;
  root._g6Bound = true;

  root.addEventListener('click', e => {
    const card = e.target.closest('[data-g6-eje]');
    if (card) return renderDetalle(card.dataset.g6Eje);

    if (e.target.closest('[data-g6-volver]')) return volverCatalogo();

    // Índice "En esta página": botón (no enlace #) para no romper la navegación por hash
    const ir = e.target.closest('[data-g6-ir]');
    if (ir) {
      document.getElementById('g6-sec-' + ir.dataset.g6Ir)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const img = e.target.closest('[data-g6-zoom]');
    if (img) {
      document.getElementById('g6LightboxImg').src = img.dataset.g6Zoom;
      document.getElementById('g6Lightbox').classList.add('active');
    }
  });
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

  /* Estado inicial */
  det.style.display = 'none';
  cat.style.display = '';

  renderCatalogo();
  initEventos();
  initLightbox();
}
