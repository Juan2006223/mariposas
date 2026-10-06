(function () {
  function layout() {
    return `
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--line);padding-bottom:12px;margin-bottom:16px;">
        <div>
          <h2 style="font-family:'Baloo 2',sans-serif;color:var(--sol);margin:0;font-size:1.5rem;">Panel de Control y Telemetría</h2>
          <div style="color:var(--ink-soft);font-size:.85rem;">Datos por participante: respuestas, dibujos, actividades y mural</div>
        </div>
        <button onclick="toggleAdminDashboard()" style="background:var(--card2);border:1px solid var(--line);color:var(--ink);padding:8px 16px;border-radius:8px;cursor:pointer;font-weight:700;">Cerrar</button>
      </div>
      <div id="dashContent" style="text-align:center;color:var(--ink-soft);padding:30px;">Cargando métricas...</div>`;
  }

  function connectionBadge(postgresConectado) {
    const label = postgresConectado ? 'PostgreSQL activo' : 'Modo memoria';
    return `<div style="display:flex;justify-content:flex-end;margin-bottom:12px;"><span style="font-size:.82rem;background:var(--card2);border:1px solid var(--line);padding:6px 12px;border-radius:20px;color:var(--ink);">${label}</span></div>`;
  }

  function error(container, resp) {
    if (resp && resp.error === 'No autorizado.') {
      AdminDashboardState.clearAdminToken();
      return renderAdminLogin(container, 'Clave admin incorrecta.');
    }
    const content = document.getElementById('dashContent');
    if (!content) return;
    content.innerHTML = `<div style="background:rgba(217,70,181,.15);border:1px solid var(--rosa);padding:16px;border-radius:8px;color:var(--ink);">${escapeHtml((resp && resp.error) || 'Backend desconectado o en despliegue.')}</div>`;
  }

  function login(errorMessage = '') {
    const content = document.getElementById('dashContent');
    if (!content) return;
    content.innerHTML = `
      <form id="adminLoginForm" style="max-width:420px;margin:0 auto;text-align:left;background:var(--card2);border:1px solid var(--line);border-radius:8px;padding:18px;">
        <label for="adminTokenInput" style="display:block;color:var(--ink);font-weight:800;margin-bottom:8px;">Clave admin</label>
        <input id="adminTokenInput" type="password" autocomplete="current-password" placeholder="Ingresa tu clave" style="width:100%;box-sizing:border-box;background:var(--card);border:1px solid var(--line);border-radius:8px;color:var(--ink);padding:12px;font:inherit;">
        ${errorMessage ? `<div style="color:var(--rosa);margin-top:8px;font-size:.85rem;">${escapeHtml(errorMessage)}</div>` : ''}
        <button type="submit" style="width:100%;margin-top:14px;background:var(--sol);color:#2a1748;border:0;border-radius:8px;padding:12px;font-weight:900;cursor:pointer;">Entrar</button>
      </form>`;
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, ch => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[ch]));
  }

  function attrEscape(value) {
    return escapeHtml(value).replace(/\\/g, '\\\\');
  }

  window.escapeHtml = window.escapeHtml || escapeHtml;
  window.attrEscape = window.attrEscape || attrEscape;
  window.AdminDashboardView = { connectionBadge, error, layout, login };
})();
