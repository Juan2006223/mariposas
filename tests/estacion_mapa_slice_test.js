const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 Iniciando verificación del slice estacion_mapa...');

// 1. Verificar existencia y líneas de archivos
const files = [
  'frontend/src/features/estacion_mapa/dominio/MapaTerritorioData.js',
  'frontend/src/features/estacion_mapa/dominio/MapaState.js',
  'frontend/src/features/estacion_mapa/aplicacion/MapaActions.js',
  'frontend/src/features/estacion_mapa/infraestructura/ui/Mapa68View.js',
  'frontend/src/features/estacion_mapa/infraestructura/ui/Exploro912View.js',
  'frontend/src/features/estacion_mapa/infraestructura/loader.js',
];

files.forEach(f => {
  const full = path.join(__dirname, '..', f);
  assert(fs.existsSync(full), `Archivo no existe: ${f}`);
  const lines = fs.readFileSync(full, 'utf8').split('\n').length;
  assert(lines <= 200, `Archivo ${f} supera 200 líneas (${lines})`);
});
console.log('✅ Archivos existen y todos tienen <= 200 líneas.');

// 2. Simular entorno browser/DOM básico
global.window = {
  userName: 'Tester',
  muralFootprints: [],
  MAP_68_IMG: 'data:image/svg+xml;base64,map68',
  EXPLORO_MAP_IMG: 'data:image/svg+xml;base64,exploromap',
  PLAZA_CENTRAL_IMG: 'data:image/svg+xml;base64,plaza',
  setStation: function(n) { global.window.station = n; },
  render: function() {}
};

// Cargar módulos en orden
require(path.join(__dirname, '../frontend/src/features/estacion_mapa/dominio/MapaTerritorioData.js'));
require(path.join(__dirname, '../frontend/src/features/estacion_mapa/dominio/MapaState.js'));
require(path.join(__dirname, '../frontend/src/features/estacion_mapa/aplicacion/MapaActions.js'));
require(path.join(__dirname, '../frontend/src/features/estacion_mapa/infraestructura/ui/Mapa68View.js'));
require(path.join(__dirname, '../frontend/src/features/estacion_mapa/infraestructura/ui/Exploro912View.js'));

// 3. Verificar contratos de funciones requeridas en window
const expectedFns = [
  'station4_68',
  'visitarMapa68',
  'confirmMapFootprint',
  'station4_912',
  'openPlaceImgModal',
  'closePlaceImgModal',
  'selBarrio',
  'conocerHistoria',
  'exploroFavoriteScreen',
  'selFavoritePlace',
  'finishExploroFavorite',
  'exploroBadgeScreen'
];

expectedFns.forEach(fn => {
  assert.strictEqual(typeof global.window[fn], 'function', `window.${fn} debe ser una función`);
});
console.log('✅ Todas las 12 funciones públicas esperadas existen en window.');

// 4. Verificar que station4_68 retorna HTML válido
const html68 = global.window.station4_68();
assert(typeof html68 === 'string', 'station4_68 debe retornar un string');
assert(html68.includes('Explora el Mapa Mariposa'), 'station4_68 debe incluir el título');
assert(html68.includes('butterfly-map-img'), 'station4_68 debe incluir la imagen del mapa');
console.log('✅ station4_68() renderiza HTML esperado.');

// 5. Verificar que station4_912 retorna HTML válido en sus 3 etapas
const html912Map = global.window.station4_912();
assert(typeof html912Map === 'string', 'station4_912 debe retornar un string');
assert(html912Map.includes('Explora La Mariposa'), 'station4_912 debe incluir el título del mapa');

global.window.exploroStage = 'favorite';
const html912Fav = global.window.station4_912();
assert(html912Fav.includes('Mi lugar significativo'), 'station4_912 en stage favorite debe incluir pantalla de favorito');

global.window.exploroStage = 'badge';
const html912Badge = global.window.station4_912();
assert(html912Badge.includes('Insignia de Explorador/a de La Mariposa'), 'station4_912 en stage badge debe incluir la insignia');
console.log('✅ station4_912() renderiza HTML esperado en todas sus etapas.');

// 6. Verificar que las funciones fueron removidas de frontend/index.html
const indexHtml = fs.readFileSync(path.join(__dirname, '../frontend/index.html'), 'utf8');
assert(!indexHtml.includes('function station4_68()'), 'frontend/index.html no debe contener station4_68()');
assert(!indexHtml.includes('function station4_912()'), 'frontend/index.html no debe contener station4_912()');
assert(!indexHtml.includes('function exploroBadgeScreen()'), 'frontend/index.html no debe contener exploroBadgeScreen()');
console.log('✅ Las funciones de la Estación 4 fueron removidas de frontend/index.html.');

console.log('🎉 Todas las validaciones de estacion_mapa pasaron exitosamente.');
