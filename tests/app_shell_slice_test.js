const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('🧪 Iniciando verificación del slice app_shell...');

const root = path.join(__dirname, '..');
const base = 'frontend/src/features/app_shell/';
const files = [
  'infraestructura/ui/AppShellIcons.js',
  'infraestructura/ui/ShellNavIcons.js',
  'infraestructura/ui/ShellControlIcons.js',
  'infraestructura/ui/ShellTerritoryIcons.js',
  'infraestructura/ui/ShellLegacyIcons.js',
  'dominio/AppAudioData.js',
  'dominio/AppState.js',
  'dominio/Station1Data.js',
  'aplicacion/PersistenceActions.js',
  'aplicacion/NavigationActions.js',
  'aplicacion/AudioLifecycleActions.js',
  'aplicacion/Station1Actions.js',
  'infraestructura/ui/AppShellView.js',
  'infraestructura/bootstrap.js',
].map((f) => base + f);
const componentFiles = [
  'frontend/src/components/OnboardingMuralCarousel.js',
  'frontend/src/components/OnboardingModal.js',
];

// 1. Ningún archivo JS del slice supera 200 líneas
const all = [];
(function walk(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (p.endsWith('.js')) all.push(p);
  });
})(path.join(root, base));
files.forEach((f) => assert(fs.existsSync(path.join(root, f)), `Archivo no existe: ${f}`));
componentFiles.forEach((f) => assert(fs.existsSync(path.join(root, f)), `Archivo no existe: ${f}`));
all.forEach((p) => {
  const lines = fs.readFileSync(p, 'utf8').split('\n').length;
  assert(lines <= 200, `${p} supera 200 líneas (${lines})`);
});
componentFiles.forEach((f) => {
  const lines = fs.readFileSync(path.join(root, f), 'utf8').split('\n').length;
  assert(lines <= 200, `${f} supera 200 líneas (${lines})`);
});
console.log('✅ Archivos de app_shell existen y tienen <= 200 líneas.');

// 2. Cargar como scripts clásicos en un contexto con window global
const noop = () => {};
const el = { style: {}, classList: { add: noop, remove: noop, toggle: noop }, appendChild: noop };
const ctx = {
  console, setTimeout, clearTimeout,
  document: {
    getElementById: () => null, querySelectorAll: () => [], querySelector: () => null,
    createElement: () => el, body: el, addEventListener: noop,
  },
};
ctx.window = ctx;
vm.createContext(ctx);
files.filter((f) => !f.endsWith('bootstrap.js')).forEach((f) => {
  vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
});

[
  'render', 'setStation', 'setGroup', 'submitName', 'chooseGroup', 'pickAvatar', 'pickAge',
  'finishSession', 'saveMuralArtifact', 'hydrateMuralFromApi', 'showPersistenceNotice',
  'clearFlyingFireflies', 'stopCharacterAudio', 'stopConozcoAudio', 'stopPiensoAudio',
  'miIcon', 'miText', 'hydrateIcons',
].forEach((n) => assert.strictEqual(typeof ctx.window[n], 'function', `window.${n} debe existir`));
console.log('✅ Funciones del app shell disponibles en window.');

// 3. index.html ya no contiene las funciones
const indexHtml = fs.readFileSync(path.join(root, 'frontend/index.html'), 'utf8');
['function render', 'function setStation', 'function submitName', 'function saveMuralArtifact'].forEach((s) =>
  assert(!indexHtml.includes(s), `frontend/index.html no debe contener ${s}`));
console.log('✅ frontend/index.html ya no contiene las funciones del app shell.');

// 4. bootstrap conserva el orden de carga
const boot = fs.readFileSync(path.join(root, files[files.length - 1]), 'utf8');
const order = ['app_assets', 'mural_digital', 'galeria_territorio', 'estacion_mapa', 'estacion_crea', 'estacion_voz'].map((n) => boot.indexOf(`features/${n}/infraestructura/loader.js`));
assert(order.every((v, i) => v >= 0 && (i === 0 || v > order[i - 1])), 'orden de slices en bootstrap');
assert(boot.includes('src/components/OnboardingMuralCarousel.js'), 'bootstrap debe cargar el carrusel del onboarding antes del modal');

// 5. Carrusel de onboarding usa datos ya hidratados del mural
vm.runInContext("muralButterflies = [{ type: 'image', src: 'https://res.cloudinary.com/demo/a.jpg', butterflyName: 'Ala Sol' }];", ctx);
ctx.window.muralButterflies = undefined;
vm.runInContext(fs.readFileSync(path.join(root, componentFiles[0]), 'utf8'), ctx, { filename: componentFiles[0] });
const carousel = ctx.window.onboardingMuralCarouselHTML();
assert(carousel.includes('Mural comunitario'), 'el carrusel debe titular el mural');
assert(carousel.includes('https://res.cloudinary.com/demo/a.jpg'), 'el carrusel debe mostrar imágenes ya hidratadas');
console.log('🎉 Todas las validaciones de app_shell pasaron.');
