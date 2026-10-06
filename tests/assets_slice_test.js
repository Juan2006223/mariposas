const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 Iniciando verificación del slice app_assets...');

// 1. Verificar existencia de archivos
const files = [
  'frontend/src/features/app_assets/dominio/AssetKeys.js',
  'frontend/src/features/app_assets/infraestructura/GalleryAssets.js',
  'frontend/src/features/app_assets/infraestructura/MapAssets.js',
  'frontend/src/features/app_assets/infraestructura/TerritoryAssets.js',
  'frontend/src/features/app_assets/infraestructura/EmbeddedAssets.js',
  'frontend/src/features/app_assets/infraestructura/loader.js',
];

files.forEach(f => {
  const full = path.join(__dirname, '..', f);
  assert(fs.existsSync(full), `Archivo no existe: ${f}`);
  const lines = fs.readFileSync(full, 'utf8').split('\n').length;
  assert(lines <= 200, `Archivo ${f} supera 200 líneas (${lines})`);
});
console.log('✅ Archivos existen y todos tienen <= 200 líneas.');

// 2. Mock de window para simular ejecución
global.window = {};

require(path.join(__dirname, '../frontend/src/features/app_assets/dominio/AssetKeys.js'));
require(path.join(__dirname, '../frontend/src/features/app_assets/infraestructura/GalleryAssets.js'));
require(path.join(__dirname, '../frontend/src/features/app_assets/infraestructura/MapAssets.js'));
require(path.join(__dirname, '../frontend/src/features/app_assets/infraestructura/TerritoryAssets.js'));
require(path.join(__dirname, '../frontend/src/features/app_assets/infraestructura/EmbeddedAssets.js'));

// 3. Verificar que AssetKeys está definido
assert(global.window.AssetKeys, 'AssetKeys debe estar expuesto en window');
assert(global.window.AssetKeys.GALLERY.length === 15, 'Debe haber 15 claves de galería');
assert(global.window.AssetKeys.MAPS.length === 2, 'Debe haber 2 claves de mapas');
assert(global.window.AssetKeys.TERRITORY.length === 10, 'Debe haber 10 claves de territorio');

// 4. Verificar que todas las constantes están expuestas en window y son data:image
const allKeys = [
  ...global.window.AssetKeys.GALLERY,
  ...global.window.AssetKeys.MAPS,
  ...global.window.AssetKeys.TERRITORY,
];

allKeys.forEach(k => {
  assert(typeof global.window[k] === 'string', `window.${k} debe ser string`);
  assert(global.window[k].startsWith('data:image'), `window.${k} debe empezar con data:image`);
});

const verification = global.window.verifyEmbeddedAssets();
assert(verification.allLoaded, 'verifyEmbeddedAssets debe reportar allLoaded: true');
console.log(`✅ Las 27 constantes de imágenes se cargaron correctamente en window.`);

// 5. Verificar que en frontend/index.html NO hay data:image
const html = fs.readFileSync(path.join(__dirname, '../frontend/index.html'), 'utf8');
const dataImgOccurrences = (html.match(/data:image/g) || []).length;
assert.strictEqual(dataImgOccurrences, 0, `frontend/index.html debe tener 0 ocurrencias de data:image, pero tiene ${dataImgOccurrences}`);
console.log('✅ frontend/index.html no contiene ninguna ocurrencia de data:image.');

console.log('🎉 Todas las pruebas del slice app_assets pasaron con éxito.');
