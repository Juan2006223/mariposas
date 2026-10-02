const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../frontend/index.html');
let html = fs.readFileSync(targetPath, 'utf8');

const targetHeader = '<div class="top-label">🦋 Alas de Mariposa</div>\r\n  <div class="top-sub"></div>';
const targetHeaderAlt = '<div class="top-label">🦋 Alas de Mariposa</div>\n  <div class="top-sub"></div>';

const newHeader = `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
    <div class="top-label" style="margin-bottom:0;">🦋 Alas de Mariposa</div>
    <button onclick="toggleAdminDashboard()" style="background:var(--card2); border:1px solid var(--line); color:var(--sol); font-size:0.75rem; padding:6px 12px; border-radius:12px; cursor:pointer; font-weight:700;">📊 Admin Dashboard</button>
  </div>
  <div class="top-sub"></div>`;

if (html.includes(targetHeader)) {
  html = html.replace(targetHeader, newHeader);
} else if (html.includes(targetHeaderAlt)) {
  html = html.replace(targetHeaderAlt, newHeader);
}

const targetScriptEnd = 'render();\r\n</script>';
const targetScriptEndAlt = 'render();\n</script>';

const newScriptEnd = `
// Inyección de componentes desacoplados
const scriptClient = document.createElement('script');
scriptClient.src = 'src/services/ApiClient.js';
document.body.appendChild(scriptClient);

const scriptOnboarding = document.createElement('script');
scriptOnboarding.src = 'src/components/OnboardingModal.js';
scriptOnboarding.onload = () => {
  if (typeof renderOnboardingModal === 'function') {
    renderOnboardingModal();
  }
};
document.body.appendChild(scriptOnboarding);

const scriptAdmin = document.createElement('script');
scriptAdmin.src = 'src/components/AdminDashboardV2.js';
document.body.appendChild(scriptAdmin);

// Telemetría reactiva en cambio de estación
const originalSetStation = window.setStation;
window.setStation = function(n) {
  if (typeof originalSetStation === 'function') originalSetStation(n);
  if (window.ApiClient && typeof ApiClient.registrarMetrica === 'function') {
    ApiClient.registrarMetrica({
      ninoId: window.userId || 'anon',
      tipoEvento: 'CAMBIO_ESTACION',
      categoria: 'estacion',
      detalles: { estacion: n, nombre: userName || 'Anónimo' }
    });
  }
};

render();
</script>`;

if (html.includes(targetScriptEnd)) {
  html = html.replace(targetScriptEnd, newScriptEnd);
} else if (html.includes(targetScriptEndAlt)) {
  html = html.replace(targetScriptEndAlt, newScriptEnd);
}

fs.writeFileSync(targetPath, html, 'utf8');
console.log('✅ Integración en frontend/index.html finalizada con éxito.');
