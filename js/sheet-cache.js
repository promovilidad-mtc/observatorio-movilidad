/* ========= CACHÉ DE DATOS DEL GOOGLE SHEET ========= */
// El Apps Script tarda 1-3 s en responder. fetchSheet() devuelve AL INSTANTE la última
// respuesta guardada en este navegador y, en segundo plano, vuelve a pedirla al Sheet:
//   - si el Sheet cambió, guarda la versión nueva y llama a onUpdate(datos) para repintar;
//   - si no hay copia guardada (primera visita) o tiene más de MAX_AGE, espera a la red.
// Si la red falla y hay copia (aunque sea vieja), se usa la copia.
const PREFIX = 'obsSheet:';
const MAX_AGE = 7 * 24 * 3600 * 1000; // 7 días

function leer(url){
  try {
    const text = localStorage.getItem(PREFIX + url);
    const t = Number(localStorage.getItem(PREFIX + url + ':t')) || 0;
    return text ? { text, t } : null;
  } catch { return null; }
}

function guardar(url, text){
  try {
    localStorage.setItem(PREFIX + url, text);
    localStorage.setItem(PREFIX + url + ':t', String(Date.now()));
  } catch { /* sin espacio o modo privado: se sigue sin caché */ }
}

export async function fetchSheet(url, { onUpdate } = {}){
  const saved = leer(url);

  const red = fetch(url, { cache:'no-store' })
    .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text(); })
    .then(text => { JSON.parse(text); guardar(url, text); return text; }); // valida antes de guardar

  if (saved && Date.now() - saved.t < MAX_AGE){
    red.then(text => { if (text !== saved.text) onUpdate?.(JSON.parse(text)); })
       .catch(err => console.warn('Sheet sin actualizar, se usa la copia guardada', err));
    return JSON.parse(saved.text);
  }

  try {
    return JSON.parse(await red);
  } catch (err) {
    if (saved) return JSON.parse(saved.text);
    throw err;
  }
}

/* ── Para pintar datos del Sheet sin riesgo ── */
// Cualquiera que pueda editar el Sheet escribe en la web: el texto se escapa y los
// enlaces solo se aceptan si son http(s) o rutas locales (./...).
export function escHtml(s){
  return String(s ?? '')
    .replaceAll('&','&amp;').replaceAll('<','&lt;')
    .replaceAll('>','&gt;').replaceAll('"','&quot;');
}

export function safeHref(u){
  const s = String(u ?? '').trim();
  return /^(https?:\/\/|\.\/)/i.test(s) ? escHtml(s) : '#';
}
