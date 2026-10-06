const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 Iniciando verificación del slice estacion_voz...');

const base = 'frontend/src/features/estacion_voz/';
const files = [
  'dominio/VozData.js',
  'dominio/VozState.js',
  'aplicacion/VozActions.js',
  'aplicacion/PiensoActions.js',
  'aplicacion/PiensoChainActions.js',
  'infraestructura/loader.js',
  'infraestructura/ui/Abrazo68View.js',
  'infraestructura/ui/Pienso912View.js',
].map((f) => base + f);

files.forEach((f) => {
  const full = path.join(__dirname, '..', f);
  assert(fs.existsSync(full), `Archivo no existe: ${f}`);
  const lines = fs.readFileSync(full, 'utf8').split('\n').length;
  assert(lines <= 200, `Archivo ${f} supera 200 líneas (${lines})`);
});
console.log('✅ Archivos de estacion_voz existen y tienen <= 200 líneas.');

global.window = {
  userName: 'Tester',
  userAvatar: '🦋',
  muralButterflies: [],
  muralVoices: [],
  muralReflections: [],
  render: function () {},
  saveMuralArtifact: async function () { return { success: true, data: {} }; },
};
global.document = {
  getElementById: () => null,
  querySelectorAll: () => [],
  createElement: () => ({}),
  body: { appendChild() {} },
};
Object.keys(global.window).forEach((k) => { if (!(k in global)) global[k] = global.window[k]; });

files.filter((f) => !f.endsWith('loader.js')).forEach((f) => require(path.join(__dirname, '..', f)));

assert.strictEqual(typeof window.station3_68, 'function', 'window.station3_68 debe existir');
assert.strictEqual(typeof window.station3_912, 'function', 'window.station3_912 debe existir');
assert.strictEqual(typeof window.openPiensoLevel, 'function', 'window.openPiensoLevel debe existir');
console.log('✅ station3_68, station3_912 y openPiensoLevel existen en window.');

assert.strictEqual(typeof window.station3_68(), 'string', 'station3_68 debe devolver string');
assert.strictEqual(typeof window.station3_912(), 'string', 'station3_912 debe devolver string');
console.log('✅ station3_68() y station3_912() devuelven HTML string.');

const indexHtml = fs.readFileSync(path.join(__dirname, '../frontend/index.html'), 'utf8');
assert(!indexHtml.includes('function station3_68'), 'index.html no debe contener function station3_68');
assert(!indexHtml.includes('function station3_912'), 'index.html no debe contener function station3_912');
console.log('✅ frontend/index.html ya no contiene station3_68 ni station3_912.');

const boot = fs.readFileSync(path.join(__dirname, '../frontend/src/features/app_shell/infraestructura/bootstrap.js'), 'utf8');
assert(boot.includes('estacion_voz/infraestructura/loader.js') && boot.includes('loadEstacionVoz'), 'bootstrap debe cargar estacion_voz');
console.log('🎉 Todas las validaciones de estacion_voz pasaron.');
