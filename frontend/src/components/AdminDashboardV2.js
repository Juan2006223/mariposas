(function () {
  const scripts = [
    'src/features/telemetria_admin/dominio/AdminDashboardState.js',
    'src/features/telemetria_admin/infraestructura/ui/AdminDashboardView.js',
    'src/features/telemetria_admin/infraestructura/ui/AdminDashboardCharts.js',
    'src/features/telemetria_admin/infraestructura/ui/AdminDashboardParticipants.js',
    'src/features/telemetria_admin/aplicacion/AdminDashboardActions.js',
  ];

  function loadSequentially(index = 0) {
    if (index >= scripts.length) return;
    const script = document.createElement('script');
    script.src = scripts[index];
    script.onload = () => loadSequentially(index + 1);
    document.body.appendChild(script);
  }

  loadSequentially();
})();
