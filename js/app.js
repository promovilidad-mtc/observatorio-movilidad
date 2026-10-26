import {initModInfo,renderPlanes,renderPlanesGlobal,renderConvenios,renderConveniosGlobal} from './modules/mod1.js';
import { initModProyectos } from './modules/mod3.js';
import { initModOperacion } from './modules/mod4.js';
import { initModDatos } from './modules/mod5.js';
import { initModGobernanza } from './modules/mod6.js';
import { initModNoticias } from './modules/mod7.js';

/* ========= ROUTER ========= */
const btnInicioTop = document.getElementById('btnInicioTop');
const moduleControls = document.getElementById('moduleControls');

// Estado para “devolver” los controles a su toolbar original
let moved = null;

function activate(hash){
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const t = document.querySelector(hash);
  if (t) t.classList.add('active');
}

/**
 * Mueve el bloque de controles (Atrás + selects) del .toolbar del módulo
 * hacia el header (al lado de “Inicio”), y al salir lo restaura.
 */
function mountModuleControls(hash){
  // 1) restaurar lo anterior si existía
  if (moved){
    try{
      // devuelve el div de controles a su lugar original
      moved.parent.insertBefore(moved.node, moved.nextSibling || null);
      // restaura toolbar
      if (moved.toolbar) moved.toolbar.style.display = moved.toolbarDisplay || '';
    }catch(e){}
    moved = null;
  }

  if (!moduleControls) return;
  moduleControls.innerHTML = '';

  // En home no mostramos nada extra
  if (hash === '#home') return;

  const view = document.querySelector(hash);
  if (!view) return;

  const toolbar = view.querySelector('.toolbar');
  if (!toolbar) return;

  // Tu estructura es: <div class="toolbar"><div style="display:flex..."> ...controles... </div></div>
  const controlsBlock = toolbar.querySelector('div');
  if (!controlsBlock) return;

  // Guardar estado para restaurar luego
  moved = {
    node: controlsBlock,
    parent: controlsBlock.parentNode,
    nextSibling: controlsBlock.nextSibling,
    toolbar,
    toolbarDisplay: toolbar.style.display
  };

  // Mover al header
  moduleControls.appendChild(controlsBlock);

  // Ocultar toolbar del módulo para que no deje espacio arriba
  toolbar.style.display = 'none';
}

async function route(){
  const h = location.hash || '#home';

  if (btnInicioTop) btnInicioTop.style.display = (h === '#home') ? 'none' : '';

  activate(h);

  // ✅ monta controles en header (antes o justo al entrar)
  mountModuleControls(h);

  if (h === '#mod-info')         await initModInfo();
  if (h === '#mod-planes')       await renderPlanes();
  if (h === '#planes-global')    await renderPlanesGlobal();
  if (h === '#mod-convenios')    await renderConvenios();
  if (h === '#convenios-global') await renderConveniosGlobal();
  if (h === '#mod-operacion')    await initModOperacion();
  if (h === '#mod-datos')        await initModDatos();
  if (h === '#mod-proyectos')    await initModProyectos();
  if (h === '#mod-gobernanza') await initModGobernanza();
  if (h === '#mod-noticias')     await initModNoticias();
}

window.addEventListener('hashchange', route);
window.addEventListener('load', route);
