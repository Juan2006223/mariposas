const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 Iniciando verificación del Vertical Slice galeria_territorio...');

// Simular entorno window y DOM
global.window = global;
global.window.GAL1_IMG = 'data:image/jpeg;base64,/9j/test1';
global.window.GAL2_IMG = 'data:image/jpeg;base64,/9j/test2';

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

// Cargar GaleriaTerritorioData
require('./icons_setup.js');
require('../frontend/src/features/galeria_territorio/dominio/GaleriaTerritorioData.js');
assert.ok(window.GaleriaTerritorioData, 'GaleriaTerritorioData debe estar definido en window');
assert.ok(Array.isArray(window.GALERIA_TERRITORIO), 'window.GALERIA_TERRITORIO debe ser un array');
assert.strictEqual(window.GALERIA_TERRITORIO.length, 15, 'Debe haber 15 fotos');
assert.strictEqual(window.GALERIA_TERRITORIO[0].img, 'data:image/jpeg;base64,/9j/test1');

// Cargar GaleriaTerritorioActions
require('../frontend/src/features/galeria_territorio/aplicacion/GaleriaTerritorioActions.js');
assert.strictEqual(typeof window.openGalleryModal, 'function', 'openGalleryModal debe estar en window');
assert.strictEqual(typeof window.closeGalleryModal, 'function', 'closeGalleryModal debe estar en window');

// Cargar GaleriaTerritorioView
require('../frontend/src/features/galeria_territorio/infraestructura/ui/GaleriaTerritorioView.js');
assert.strictEqual(typeof window.station6, 'function', 'station6 debe estar en window');

const viewHtml = window.station6();
assert.ok(viewHtml.includes('Galería del territorio'), 'station6 debe generar el título de la galería');
assert.ok(viewHtml.includes('gallery-grid'), 'station6 debe contener la grilla');
assert.ok(viewHtml.includes('openGalleryModal(0)'), 'station6 debe enlazar a openGalleryModal(0)');

console.log('✅ Verificación de compatibilidad y contratos de galeria_territorio superada.');
