const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 Iniciando verificación del slice estacion_crea...');

// 1. Verificar existencia y líneas de archivos
const files = [
  'frontend/src/features/estacion_crea/dominio/CreaPaletteData.js',
  'frontend/src/features/estacion_crea/dominio/CreaState.js',
  'frontend/src/features/estacion_crea/aplicacion/DrawingCanvasActions.js',
  'frontend/src/features/estacion_crea/aplicacion/CreaActions.js',
  'frontend/src/features/estacion_crea/aplicacion/Publish68Actions.js',
  'frontend/src/features/estacion_crea/aplicacion/Crea912Actions.js',
  'frontend/src/features/estacion_crea/infraestructura/ui/ButterflySvgView.js',
  'frontend/src/features/estacion_crea/infraestructura/ui/Pinta68View.js',
  'frontend/src/features/estacion_crea/infraestructura/ui/Crea912View.js',
  'frontend/src/features/estacion_crea/infraestructura/loader.js',
];

files.forEach((f) => {
  const full = path.join(__dirname, '..', f);
  assert(fs.existsSync(full), `Archivo no existe: ${f}`);
  const lines = fs.readFileSync(full, 'utf8').split('\n').length;
  assert(lines <= 200, `Archivo ${f} supera 200 líneas (${lines})`);
});
console.log('✅ Todos los archivos de estacion_crea existen y tienen <= 200 líneas.');

// 2. Simular entorno browser/DOM básico
global.window = {
  userName: 'Tester',
  userLastName: 'Mariposa',
  userAvatar: '🦋',
  muralButterflies: [],
  setStation: function (n) { global.window.station = n; },
  render: function () {},
  saveMuralArtifact: async function () { return { success: true, data: {} }; },
};

// Cargar módulos en orden
require('./icons_setup.js');
require(path.join(__dirname, '../frontend/src/features/estacion_crea/dominio/CreaPaletteData.js'));
require(path.join(__dirname, '../frontend/src/features/estacion_crea/dominio/CreaState.js'));
require(path.join(__dirname, '../frontend/src/features/estacion_crea/aplicacion/DrawingCanvasActions.js'));
require(path.join(__dirname, '../frontend/src/features/estacion_crea/aplicacion/CreaActions.js'));
require(path.join(__dirname, '../frontend/src/features/estacion_crea/aplicacion/Publish68Actions.js'));
require(path.join(__dirname, '../frontend/src/features/estacion_crea/aplicacion/Crea912Actions.js'));
require(path.join(__dirname, '../frontend/src/features/estacion_crea/infraestructura/ui/ButterflySvgView.js'));
require(path.join(__dirname, '../frontend/src/features/estacion_crea/infraestructura/ui/Pinta68View.js'));
require(path.join(__dirname, '../frontend/src/features/estacion_crea/infraestructura/ui/Crea912View.js'));

// 3. Verificar que station2_68 y station2_912 existen en window
assert.strictEqual(typeof global.window.station2_68, 'function', 'window.station2_68 debe ser una función');
assert.strictEqual(typeof global.window.station2_912, 'function', 'window.station2_912 debe ser una función');
assert.strictEqual(typeof global.window.initCanvas, 'function', 'window.initCanvas debe ser una función');
assert.strictEqual(typeof global.window.butterflySvg, 'function', 'window.butterflySvg debe ser una función');
assert.strictEqual(typeof global.window.paintZone, 'function', 'window.paintZone debe ser una función');
assert.strictEqual(typeof global.window.pickColor, 'function', 'window.pickColor debe ser una función');
assert.strictEqual(typeof global.window.finishDrawing, 'function', 'window.finishDrawing debe ser una función');

console.log('✅ station2_68, station2_912, initCanvas y funciones de interacción existen en window.');

// 4. Verificar que ambas devuelven HTML string
const html68 = global.window.station2_68();
assert(typeof html68 === 'string', 'station2_68 debe retornar un string');
assert(html68.includes('La mariposa que cambia de humor'), 'station2_68 debe contener el título correspondiente');
assert(html68.includes('id="butterflySvg"'), 'station2_68 debe contener el SVG interactivo de la mariposa');
assert(html68.includes('18 partes'), 'station2_68 debe mostrar el total real de zonas pintables');
const svg68 = global.window.butterflySvg();
assert(svg68.includes('id="body" class="zone"'), 'el cuerpo debe ser zona pintable');
assert(svg68.includes('id="head" class="zone"'), 'la cabeza debe ser zona pintable');
assert(svg68.includes('id="antennaL" class="zone"'), 'la antena izquierda debe ser zona pintable');
assert(svg68.includes('id="antennaR" class="zone"'), 'la antena derecha debe ser zona pintable');
assert.strictEqual(global.window.ZONE_TOTAL_68, 18, 'el total de zonas pintables debe incluir alas, manchas, cabeza, antenas y cuerpo');

const html912Step0 = global.window.station2_912();
assert(typeof html912Step0 === 'string', 'station2_912 debe retornar un string');
assert(html912Step0.includes('CREO — Mi mariposa, mi historia, nuestra comunidad'), 'station2_912 debe contener el título correspondiente');
assert(html912Step0.includes('Mi misión: crear con sentido'), 'station2_912 step 0 debe contener texto de misión');

global.window._creaStep = 1;
const html912Step1 = global.window.station2_912();
assert(html912Step1.includes('drawCanvas'), 'station2_912 step 1 debe contener el canvas');
assert(html912Step1.includes('draw-studio'), 'station2_912 step 1 debe contener las herramientas de dibujo');

console.log('✅ station2_68() y station2_912() devuelven HTML strings válidos.');

// 5. Verificar que frontend/index.html ya no contiene function station2_68 ni function station2_912
const indexHtml = fs.readFileSync(path.join(__dirname, '../frontend/index.html'), 'utf8');
assert(!indexHtml.includes('function station2_68'), 'frontend/index.html no debe contener function station2_68');
assert(!indexHtml.includes('function station2_912'), 'frontend/index.html no debe contener function station2_912');
assert(!indexHtml.includes('function initCanvas'), 'frontend/index.html no debe contener function initCanvas');
assert(!indexHtml.includes('function paintZone'), 'frontend/index.html no debe contener function paintZone');
console.log('✅ frontend/index.html ya no contiene function station2_68 ni function station2_912 ni funciones de Estación 2.');

// 6. Verificar que bootstrap.js incluye carga de estacion_crea en el orden correcto
const bootstrapCode = fs.readFileSync(path.join(__dirname, '../frontend/src/features/app_shell/infraestructura/bootstrap.js'), 'utf8');
assert(bootstrapCode.includes('src/features/estacion_crea/infraestructura/loader.js'), 'bootstrap.js debe cargar loader de estacion_crea');
assert(bootstrapCode.includes('loadEstacionCrea'), 'bootstrap.js debe invocar loadEstacionCrea');

console.log('🎉 Todas las validaciones de estacion_crea pasaron exitosamente.');
