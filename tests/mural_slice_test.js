const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 Iniciando verificación del Vertical Slice mural_digital...');

// Simular entorno window y DOM
global.window = global;
global.document = {
  getElementById: (id) => {
    return {
      id,
      innerHTML: '',
      innerText: '',
      classList: {
        add: () => {},
        remove: () => {}
      },
      style: {}
    };
  }
};

// Cargar MuralState
require('../frontend/src/features/mural_digital/dominio/MuralState.js');
assert.ok(window.MuralState, 'MuralState debe estar definido en window');
assert.strictEqual(window.MuralState.getActiveTab(), 'mariposas');
window.MuralState.setActiveTab('voces');
assert.strictEqual(window.MuralState.getActiveTab(), 'voces');

// Cargar MuralActions
require('../frontend/src/features/mural_digital/aplicacion/MuralActions.js');
assert.strictEqual(typeof window.selMuralTab, 'function', 'selMuralTab debe estar en window');
assert.strictEqual(typeof window.openLightbox, 'function', 'openLightbox debe estar en window');
assert.strictEqual(typeof window.closeLightbox, 'function', 'closeLightbox debe estar en window');

// Cargar MuralView
require('../frontend/src/features/mural_digital/infraestructura/ui/MuralView.js');
assert.strictEqual(typeof window.muralScreen, 'function', 'muralScreen debe estar en window');
assert.strictEqual(typeof window.muralButterfliesHTML, 'function', 'muralButterfliesHTML debe estar en window');
assert.strictEqual(typeof window.muralVoicesHTML, 'function', 'muralVoicesHTML debe estar en window');
assert.strictEqual(typeof window.muralFootprintsHTML, 'function', 'muralFootprintsHTML debe estar en window');
assert.strictEqual(typeof window.muralReflectionsHTML, 'function', 'muralReflectionsHTML debe estar en window');
assert.strictEqual(typeof window.miniButterflySvg, 'function', 'miniButterflySvg debe estar en window');

// Validar renderizado de pantalla de mural
const screenHtml = window.muralScreen();
assert.ok(screenHtml.includes('Mural Digital Vivo'), 'muralScreen debe generar el título esperado');
assert.ok(screenHtml.includes('mural-tabs'), 'muralScreen debe incluir las pestañas');

// Validar SVG
const svg = window.miniButterflySvg({});
assert.ok(svg.includes('<svg'), 'miniButterflySvg debe generar SVG válido');

console.log('✅ Verificación de compatibilidad y contratos del slice mural_digital superada.');
