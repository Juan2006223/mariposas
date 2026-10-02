let dashboardVisible = false;
const ADMIN_TOKEN_STORAGE_KEY = 'mariposas_admin_token';

function toggleAdminDashboard() {
  dashboardVisible = !dashboardVisible;
  let panel = document.getElementById('adminDashboardOverlay');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'adminDashboardOverlay';
    panel.style.cssText = 'position:fixed;inset:0;z-index:999;background:rgba(10,4,26,.96);display:flex;flex-direction:column;padding:24px;overflow-y:auto;font-family:Nunito,sans-serif;';
    document.body.appendChild(panel);
  }
  panel.style.display = dashboardVisible ? 'flex' : 'none';
  if (dashboardVisible) cargarMetricasEnDashboard(panel);
}

async function cargarMetricasEnDashboard(container) {
  const adminToken = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || '';
  container.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--line);padding-bottom:12px;margin-bottom:16px;"><div><h2 style="font-family:'Baloo 2',sans-serif;color:var(--sol);margin:0;font-size:1.5rem;">Panel de Control y Telemetria - Fundacion</h2><div style="color:var(--ink-soft);font-size:.85rem;">Datos reales por participante: respuestas, dibujos, actividades y mural</div></div><button onclick="toggleAdminDashboard()" style="background:var(--card2);border:1px solid var(--line);color:var(--ink);padding:8px 16px;border-radius:12px;cursor:pointer;font-weight:700;">Cerrar</button></div><div id="dashContent" style="text-align:center;color:var(--ink-soft);padding:30px;">Cargando metricas...</div>`;
  if (!adminToken) return renderAdminLogin(container);
  const [resp, muralResp] = await Promise.all([ApiClient.obtenerDashboard(adminToken), ApiClient.listarMural ? ApiClient.listarMural() : Promise.resolve({ success: false, data: [] })]);
  const content = document.getElementById('dashContent');
  if (!content) return;
  if (!resp || !resp.success) return renderDashboardError(container, resp);
  const { resumen, estacionesVisitadas, ultimosPerfiles, ultimosEventos, progresosRecientes } = resp.data;
  const muralItems = muralResp && muralResp.success ? muralResp.data : [];
  content.innerHTML = `<div style="display:flex;justify-content:flex-end;margin-bottom:12px;"><span style="font-size:.82rem;background:var(--card2);border:1px solid var(--line);padding:6px 12px;border-radius:20px;color:var(--ink);">${resp.postgresConectado ? 'PostgreSQL activo' : 'Modo memoria'}</span></div>${renderSummary(resumen)}${renderStations(estacionesVisitadas)}<div style="background:var(--card2);border:1px solid var(--line);border-radius:16px;padding:16px;text-align:left;"><h3 style="font-family:'Baloo 2',sans-serif;font-size:1.1rem;color:var(--ink);margin:0 0 10px;">Participantes - todo lo que hizo cada niño/a</h3>${renderParticipantCards(ultimosPerfiles || [], ultimosEventos || [], muralItems, progresosRecientes || [])}</div>`;
}

function renderDashboardError(container, resp) {
  if (resp && resp.error === 'No autorizado.') {
    localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
    return renderAdminLogin(container, 'Clave admin incorrecta.');
  }
  document.getElementById('dashContent').innerHTML = `<div style="background:rgba(217,70,181,.15);border:1px solid var(--rosa);padding:16px;border-radius:14px;color:var(--ink);">${escapeHtml((resp && resp.error) || 'Backend desconectado o en despliegue.')}</div>`;
}

function renderSummary(resumen) {
  const cards = [['Total niños', resumen.totalNinos, `${resumen.ninosGrupoG1} de 6-8 | ${resumen.ninosGrupoG2} de 9-12`], ['Eventos', resumen.totalEventos, 'Actividad registrada'], ['Creaciones', resumen.totalArtefactosMural, 'Dibujos y mural']];
  return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:20px;text-align:left;">${cards.map(c => `<div style="background:var(--card2);border:1px solid var(--line);border-radius:16px;padding:14px;"><div style="font-size:.8rem;color:var(--ink-soft);">${c[0]}</div><div style="font-size:1.8rem;font-weight:800;color:var(--sol);font-family:'Baloo 2';">${c[1]}</div><div style="font-size:.75rem;color:var(--ink-soft);">${c[2]}</div></div>`).join('')}</div>`;
}

function renderStations(estaciones) {
  return `<div style="background:var(--card2);border:1px solid var(--line);border-radius:16px;padding:16px;margin-bottom:20px;text-align:left;"><h3 style="font-family:'Baloo 2',sans-serif;font-size:1.1rem;color:var(--ink);margin:0 0 12px;">Uso por estacion</h3><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;">${Object.entries(estaciones || {}).map(([nom, cant]) => `<div style="background:var(--card);border:1px solid var(--line);border-radius:12px;padding:10px;text-align:center;"><div style="font-size:.8rem;color:var(--ink-soft);">${escapeHtml(nom)}</div><div style="font-size:1.4rem;font-weight:800;color:var(--rio);font-family:'Baloo 2';">${cant}</div></div>`).join('')}</div></div>`;
}

function renderParticipantCards(profiles, events, muralItems, progressItems) {
  if (!profiles.length) return '<div style="color:var(--ink-soft);">No hay registros aun.</div>';
  return profiles.map((p, i) => {
    const name = p.nombre || 'Sin nombre';
    const pid = p.id || p.nino_id;
    const evs = events.filter(e => sameChild(e.nino_id || e.ninoId, pid) || ((parseMaybeJson(e.detalles).nombre || '').includes(name.split(' ')[0]))).slice(0, 10);
    const arts = muralItems.filter(a => belongsToChild(a, pid, name));
    const answers = progressItems.filter(pr => sameChild(pr.nino_id || pr.ninoId, pid));
    const created = p.creado_en || p.creadoEn || '';
    return `<section style="border:1px solid var(--line);background:var(--card);border-radius:14px;margin-bottom:12px;overflow:hidden;"><div style="padding:14px 16px;display:grid;grid-template-columns:56px 1fr auto auto;gap:12px;align-items:center;text-align:left;"><span style="width:56px;height:56px;border-radius:16px;background:linear-gradient(135deg,var(--violeta),var(--rosa));display:grid;place-items:center;font-size:1.8rem;line-height:1;">${avatarIcon(p.avatar)}</span><span style="min-width:0;"><strong style="display:block;color:var(--violeta-suave);font-size:1.05rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(name)}</strong><small style="color:var(--ink-soft);">${p.edad} años · ${p.grupo_edad || p.grupoEdad || ''} · ${arts.length} dibujo(s) · ${answers.length} respuesta(s)</small></span><button onclick="toggleParticipantDetail(${i})" style="background:rgba(255,200,87,.16);border:1px solid rgba(255,200,87,.4);color:var(--sol);border-radius:999px;padding:10px 14px;font-weight:900;cursor:pointer;">Ver todo</button><button onclick="deleteParticipant('${attrEscape(pid)}','${attrEscape(name)}')" style="background:rgba(217,70,181,.20);border:1px solid rgba(217,70,181,.55);color:var(--ink);border-radius:12px;padding:10px 12px;font-weight:900;cursor:pointer;">Borrar niño/a</button></div><div id="childDetail${i}" style="display:none;border-top:1px solid var(--line);padding:14px 16px;"><div style="color:var(--ink-soft);font-size:.78rem;margin-bottom:12px;">ID: ${escapeHtml(pid || 'sin-id')}${created ? ' · Registro: ' + escapeHtml(formatDate(created)) : ''}</div>${renderChildSpace(evs, arts, answers)}</div></section>`;
  }).join('');
}

function renderChildSpace(events, arts, answers) {
  return `<div style="display:grid;grid-template-columns:1fr;gap:14px;"><div><b style="color:var(--sol);display:block;margin-bottom:8px;">Dibujos y creaciones</b>${arts.length ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,210px));gap:10px;">${arts.map(renderMuralAdminCard).join('')}</div>` : '<div style="color:var(--ink-soft);">Sin dibujos o creaciones guardadas.</div>'}</div><div><b style="color:var(--sol);display:block;margin-bottom:8px;">Respuestas y avances</b>${answers.length ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px;">${answers.map(renderAnswerCard).join('')}</div>` : '<div style="color:var(--ink-soft);">Sin respuestas guardadas.</div>'}</div><div><b style="color:var(--sol);display:block;margin-bottom:8px;">Eventos recientes</b>${events.length ? `<ul style="padding-left:18px;margin:0;">${events.map(renderEventItem).join('')}</ul>` : '<div style="color:var(--ink-soft);">Sin eventos recientes.</div>'}</div></div>`;
}

function renderAnswerCard(item) {
  const data = parseMaybeJson(item.datos_actividad || item.datosActividad || {});
  const title = item.nombre_estacion || item.nombreEstacion || `Estacion ${item.estacion_num || item.estacionNum || ''}`;
  const details = Object.keys(data).length ? Object.entries(data).map(([k, v]) => `<div style="font-size:.78rem;color:var(--ink-soft);"><b style="color:var(--ink);">${escapeHtml(k)}:</b> ${escapeHtml(formatValue(v))}</div>`).join('') : '<div style="font-size:.78rem;color:var(--ink-soft);">Sin detalle adicional.</div>';
  return `<article style="background:var(--card);border:1px solid var(--line);border-radius:12px;padding:10px;"><div style="color:var(--violeta-suave);font-weight:900;margin-bottom:6px;">${escapeHtml(title)}</div>${details}</article>`;
}

function renderEventItem(e) {
  const details = parseMaybeJson(e.detalles || {});
  const label = details.estacion ? `Estacion ${details.estacion}` : (details.tipo || details.autor || e.categoria || '');
  return `<li style="margin:6px 0;color:var(--ink-soft);"><b style="color:var(--ink);">${escapeHtml(e.tipo_evento || e.tipoEvento || 'Evento')}</b> · ${escapeHtml(label)}</li>`;
}

function renderMuralAdminCard(item) {
  const content = parseMaybeJson(item.contenido || {});
  const icon = escapeHtml(String(content.avatar || avatarIcon(content.avatar)));
  const img = content.src && content.src.length > 80 ? `<img src="${content.src}" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:10px;" onerror="this.replaceWith(fallbackMuralThumb('${attrEscape(icon)}'))">` : `<div style="width:100%;aspect-ratio:1;display:grid;place-items:center;border-radius:10px;background:var(--card);font-size:2rem;">${icon}</div>`;
  return `<div style="background:var(--card);border:1px solid var(--line);border-radius:12px;padding:10px;">${img}<div style="display:flex;justify-content:space-between;align-items:center;gap:6px;margin-top:8px;"><div style="min-width:0;"><div style="color:var(--ink);font-weight:800;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(content.butterflyName || content.nombre || item.tipo || 'mural')}</div><div style="color:var(--ink-soft);font-size:.75rem;">${escapeHtml(item.tipo || 'mural')}</div></div><button onclick="deleteMuralItem('${attrEscape(item.id)}')" style="border:1px solid var(--line);background:rgba(217,70,181,.18);color:var(--ink);border-radius:10px;padding:7px 9px;cursor:pointer;">Borrar</button></div></div>`;
}

function fallbackMuralThumb(icon) {
  const div = document.createElement('div');
  div.style.cssText = 'width:100%;aspect-ratio:1;display:grid;place-items:center;border-radius:10px;background:var(--card);font-size:2rem;';
  div.textContent = icon || 'mariposa';
  return div;
}

function sameChild(a, b) { return a && b && String(a) === String(b); }
function belongsToChild(item, pid, name) {
  const autor = String(item.autor || '').trim().toLowerCase();
  const childName = String(name || '').trim().toLowerCase();
  return sameChild(item.nino_id || item.ninoId, pid) || (autor && autor === childName);
}
function toggleParticipantDetail(i) {
  const el = document.getElementById(`childDetail${i}`);
  if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
}
function avatarIcon(avatar) {
  return { butterfly: '🦋', mariposa_azul: '🦋', mariposa_sol: '🦋', oruga: '🐛', oruga_valiente: '🐛', colibri: '🐦', flor: '✿', perrito: '🐶' }[avatar] || '🦋';
}
function parseMaybeJson(value) {
  if (!value) return {};
  if (typeof value === 'object') return value;
  try { return JSON.parse(value); } catch (e) { return {}; }
}
function formatValue(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
function formatDate(value) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString('es-CO');
}
function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}
function attrEscape(value) {
  return escapeHtml(value).replace(/\\/g, '\\\\');
}
async function deleteMuralItem(id) {
  const token = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || '';
  if (!confirm('¿Borrar esta creacion del mural?')) return;
  const resp = await ApiClient.borrarArtefactoMural(id, token);
  if (!resp || !resp.success) return alert(resp && resp.error ? resp.error : 'No se pudo borrar.');
  const panel = document.getElementById('adminDashboardOverlay');
  if (panel) cargarMetricasEnDashboard(panel);
}
async function deleteParticipant(id, name) {
  const token = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || '';
  if (!id) return alert('Este usuario no tiene id valido para borrar.');
  if (!confirm(`¿Borrar a ${name} y sus actividades/creaciones?`)) return;
  const resp = await ApiClient.borrarPerfil(id, token);
  if (!resp || !resp.success) return alert(resp && resp.error ? resp.error : 'No se pudo borrar el usuario.');
  const panel = document.getElementById('adminDashboardOverlay');
  if (panel) cargarMetricasEnDashboard(panel);
}
function renderAdminLogin(container, errorMessage = '') {
  const content = document.getElementById('dashContent');
  if (!content) return;
  content.innerHTML = `<form id="adminLoginForm" style="max-width:420px;margin:0 auto;text-align:left;background:var(--card2);border:1px solid var(--line);border-radius:16px;padding:18px;"><label for="adminTokenInput" style="display:block;color:var(--ink);font-weight:800;margin-bottom:8px;">Clave admin</label><input id="adminTokenInput" type="password" autocomplete="current-password" placeholder="Ingresa tu clave" style="width:100%;box-sizing:border-box;background:var(--card);border:1px solid var(--line);border-radius:12px;color:var(--ink);padding:12px;font:inherit;">${errorMessage ? `<div style="color:var(--rosa);margin-top:8px;font-size:.85rem;">${errorMessage}</div>` : ''}<button type="submit" style="width:100%;margin-top:14px;background:var(--sol);color:#2a1748;border:0;border-radius:12px;padding:12px;font-weight:900;cursor:pointer;">Entrar</button></form>`;
  const form = document.getElementById('adminLoginForm');
  const input = document.getElementById('adminTokenInput');
  if (input) input.focus();
  if (!form || !input) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const token = input.value.trim();
    if (token) {
      localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
      cargarMetricasEnDashboard(container);
    }
  });
}
