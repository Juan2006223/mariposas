// Carga el sistema de iconos del app_shell en el entorno simulado de cada test de slice.
const path = require('path');
const base = path.join(__dirname, '../frontend/src/features/app_shell/infraestructura/ui/');
['AppShellIcons', 'ShellNavIcons', 'ShellControlIcons', 'ShellTerritoryIcons', 'ShellLegacyIcons']
  .forEach((f) => require(base + f + '.js'));
['miIcon', 'miText', 'miPlain', 'miLabel', 'registerIcons'].forEach((k) => { global[k] = global.window[k]; });
