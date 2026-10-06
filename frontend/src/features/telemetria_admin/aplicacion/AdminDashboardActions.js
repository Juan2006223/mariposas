(function () {
  async function cargarMetricasEnDashboard(container, pagina = 1) {
    const token = AdminDashboardState.getAdminToken();
    container.innerHTML = AdminDashboardView.layout();
    if (!token) return renderAdminLogin(container);
    const resp = await ApiClient.obtenerDashboard(token, pagina);
    const content = document.getElementById('dashContent');
    if (!content) return;
    if (!resp || !resp.success) return AdminDashboardView.error(container, resp);
    const { resumen, estacionesVisitadas, ultimosPerfiles, pagina: pageInfo, graficas } = resp.data;
    content.innerHTML = [
      AdminDashboardView.connectionBadge(resp.postgresConectado),
      AdminDashboardCharts.summary(resumen),
      AdminDashboardCharts.charts(estacionesVisitadas, graficas),
      AdminDashboardParticipants.list(ultimosPerfiles || [], pageInfo),
    ].join('');
  }

  function toggleAdminDashboard() {
    const visible = AdminDashboardState.toggleVisible();
    let panel = document.getElementById('adminDashboardOverlay');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'adminDashboardOverlay';
      panel.style.cssText = 'position:fixed;inset:0;z-index:999;background:rgba(10,4,26,.96);display:flex;flex-direction:column;padding:24px;overflow-y:auto;font-family:Nunito,sans-serif;';
      document.body.appendChild(panel);
    }
    panel.style.display = visible ? 'flex' : 'none';
    if (visible) cargarMetricasEnDashboard(panel);
  }

  async function toggleParticipantDetail(id, i) {
    const el = document.getElementById(`childDetail${i}`);
    if (!el) return;
    if (el.style.display !== 'none') { el.style.display = 'none'; return; }
    el.style.display = 'block';
    const result = await ApiClient.obtenerEspacioParticipante(id, AdminDashboardState.getAdminToken());
    if (!result.success) {
      el.innerHTML = `<div style="color:var(--rosa);">${escapeHtml(result.error || 'No se pudo cargar la actividad.')}</div>`;
      return;
    }
    const { artefactos, progresos, eventos } = result.data;
    el.innerHTML = AdminDashboardParticipants.childSpace(eventos, artefactos, progresos);
  }

  async function deleteMuralItem(id) {
    if (!confirm('¿Borrar esta creación del mural?')) return;
    const resp = await ApiClient.borrarArtefactoMural(id, AdminDashboardState.getAdminToken());
    if (!resp || !resp.success) return alert(resp && resp.error ? resp.error : 'No se pudo borrar.');
    const panel = document.getElementById('adminDashboardOverlay');
    if (panel) cargarMetricasEnDashboard(panel);
  }

  async function deleteParticipant(id, name) {
    if (!id) return alert('Este usuario no tiene id válido para borrar.');
    if (!confirm(`¿Borrar a ${name} y sus actividades/creaciones?`)) return;
    const resp = await ApiClient.borrarPerfil(id, AdminDashboardState.getAdminToken());
    if (!resp || !resp.success) return alert(resp && resp.error ? resp.error : 'No se pudo borrar el usuario.');
    const panel = document.getElementById('adminDashboardOverlay');
    if (panel) cargarMetricasEnDashboard(panel);
  }

  function renderAdminLogin(container, errorMessage = '') {
    AdminDashboardView.login(errorMessage);
    const form = document.getElementById('adminLoginForm');
    const input = document.getElementById('adminTokenInput');
    if (input) input.focus();
    if (!form || !input) return;
    form.addEventListener('submit', event => {
      event.preventDefault();
      const token = input.value.trim();
      if (!token) return;
      AdminDashboardState.setAdminToken(token);
      cargarMetricasEnDashboard(container);
    });
  }

  window.cargarMetricasEnDashboard = cargarMetricasEnDashboard;
  window.toggleAdminDashboard = toggleAdminDashboard;
  window.toggleParticipantDetail = toggleParticipantDetail;
  window.deleteMuralItem = deleteMuralItem;
  window.deleteParticipant = deleteParticipant;
  window.renderAdminLogin = renderAdminLogin;
})();
