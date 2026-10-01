// Panel Dashboard de Administración para la Fundación (< 190 líneas)
let dashboardVisible = false;

function toggleAdminDashboard() {
  dashboardVisible = !dashboardVisible;
  let panel = document.getElementById('adminDashboardOverlay');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'adminDashboardOverlay';
    panel.style.cssText = `
      position:fixed; inset:0; z-index:999; background:rgba(10,4,26,0.96);
      display:flex; flex-direction:column; padding:24px; overflow-y:auto; font-family:'Nunito', sans-serif;
    `;
    document.body.appendChild(panel);
  }

  if (dashboardVisible) {
    panel.style.display = 'flex';
    cargarMetricasEnDashboard(panel);
  } else {
    panel.style.display = 'none';
  }
}

async function cargarMetricasEnDashboard(container) {
  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--line); padding-bottom:12px; margin-bottom:16px;">
      <div>
        <h2 style="font-family:'Baloo 2', sans-serif; color:var(--sol); margin:0; font-size:1.5rem;">📊 Panel de Control y Telemetría — Fundación</h2>
        <div style="color:var(--ink-soft); font-size:0.85rem;">Monitoreo en tiempo real del uso de la aplicación y avance por estación</div>
      </div>
      <button onclick="toggleAdminDashboard()" style="background:var(--card2); border:1px solid var(--line); color:var(--ink); padding:8px 16px; border-radius:12px; cursor:pointer; font-weight:700;">Cerrar ✕</button>
    </div>
    <div id="dashContent" style="text-align:center; color:var(--ink-soft); padding:30px;">Cargando métricas desde PostgreSQL... ⏳</div>
  `;

  const resp = await ApiClient.obtenerDashboard();
  const content = document.getElementById('dashContent');
  if (!content) return;

  if (!resp || !resp.success) {
    content.innerHTML = `
      <div style="background:rgba(217,70,181,0.15); border:1px solid var(--rosa); padding:16px; border-radius:14px; color:var(--ink);">
        ⚠️ Backend desconectado o en inicialización. Para persistencia con PostgreSQL, asegúrate de iniciar el backend con <code>npm run start:server</code>.
      </div>
    `;
    return;
  }

  const { resumen, estacionesVisitadas, ultimosPerfiles, ultimosEventos } = resp.data;
  const dbStatus = resp.postgresConectado ? '🟢 PostgreSQL Activo' : '🟡 Modo Fallback Memoria';

  content.innerHTML = `
    <div style="display:flex; justify-content:flex-end; margin-bottom:12px;">
      <span style="font-size:0.82rem; background:var(--card2); border:1px solid var(--line); padding:6px 12px; border-radius:20px; color:var(--ink);">${dbStatus}</span>
    </div>

    <!-- Tarjetas de métricas -->
    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:12px; margin-bottom:20px; text-align:left;">
      <div style="background:var(--card2); border:1px solid var(--line); border-radius:16px; padding:14px;">
        <div style="font-size:0.8rem; color:var(--ink-soft);">Total Niños Registrados</div>
        <div style="font-size:1.8rem; font-weight:800; color:var(--violeta-suave); font-family:'Baloo 2';">${resumen.totalNinos}</div>
        <div style="font-size:0.75rem; color:var(--ink-soft);">6-8 años: ${resumen.ninosGrupoG1} | 9-12 años: ${resumen.ninosGrupoG2}</div>
      </div>
      <div style="background:var(--card2); border:1px solid var(--line); border-radius:16px; padding:14px;">
        <div style="font-size:0.8rem; color:var(--ink-soft);">Interacciones & Eventos</div>
        <div style="font-size:1.8rem; font-weight:800; color:var(--sol); font-family:'Baloo 2';">${resumen.totalEventos}</div>
        <div style="font-size:0.75rem; color:var(--ink-soft);">Trazabilidad activa</div>
      </div>
      <div style="background:var(--card2); border:1px solid var(--line); border-radius:16px; padding:14px;">
        <div style="font-size:0.8rem; color:var(--ink-soft);">Creaciones en Mural</div>
        <div style="font-size:1.8rem; font-weight:800; color:var(--rosa); font-family:'Baloo 2';">${resumen.totalArtefactosMural}</div>
        <div style="font-size:0.75rem; color:var(--ink-soft);">Mariposas, voces y huellas</div>
      </div>
    </div>

    <!-- Avance por Estaciones -->
    <div style="background:var(--card2); border:1px solid var(--line); border-radius:16px; padding:16px; margin-bottom:20px; text-align:left;">
      <h3 style="font-family:'Baloo 2', sans-serif; font-size:1.1rem; color:var(--ink); margin:0 0 12px;">📍 Frecuencia y Uso por Estación</h3>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap:10px;">
        ${Object.entries(estacionesVisitadas).map(([nom, cant]) => `
          <div style="background:var(--card); border:1px solid var(--line); border-radius:12px; padding:10px; text-align:center;">
            <div style="font-size:0.8rem; color:var(--ink-soft);">${nom}</div>
            <div style="font-size:1.4rem; font-weight:800; color:var(--rio); font-family:'Baloo 2';">${cant}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Tabla de Participantes Recientes -->
    <div style="background:var(--card2); border:1px solid var(--line); border-radius:16px; padding:16px; text-align:left;">
      <h3 style="font-family:'Baloo 2', sans-serif; font-size:1.1rem; color:var(--ink); margin:0 0 10px;">🧒 Últimos Participantes</h3>
      <div style="overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; font-size:0.82rem; color:var(--ink-soft);">
          <thead>
            <tr style="border-bottom:1px solid var(--line); text-align:left; color:var(--ink);">
              <th style="padding:8px;">Nombre</th>
              <th style="padding:8px;">Avatar</th>
              <th style="padding:8px;">Edad</th>
              <th style="padding:8px;">Grupo</th>
            </tr>
          </thead>
          <tbody>
            ${ultimosPerfiles.length === 0 ? '<tr><td colspan="4" style="padding:10px; text-align:center;">No hay registros aún</td></tr>' : ultimosPerfiles.map(p => `
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:8px; font-weight:700; color:var(--violeta-suave);">${p.nombre}</td>
                <td style="padding:8px;">${p.avatar}</td>
                <td style="padding:8px;">${p.edad} años</td>
                <td style="padding:8px;">${p.grupo_edad || p.grupoEdad}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
