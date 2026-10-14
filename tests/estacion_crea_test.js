const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('🧪 Iniciando verificación del slice estacion_crea...');

const root = path.join(__dirname, '..');
const creaDir = path.join(root, 'frontend/src/features/estacion_crea');

// 1. Verificar límites de líneas (ningún archivo > 200)
function checkLines(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((dirent) => {
    const full = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      checkLines(full);
    } else if (dirent.name.endsWith('.js')) {
      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split('\n').length;
      assert(lines <= 200, `Archivo ${dirent.name} excede 200 líneas (${lines})`);
      assert(!/[\uD83C-\uDBFF\uDC00-\uDFFF]/.test(content), `Archivo ${dirent.name} contiene emojis no permitidos`);
    }
  });
}
checkLines(creaDir);
console.log('✅ Todos los archivos de estacion_crea existen, tienen <= 200 líneas y cero emojis.');

// 2. Cargar en contexto navegador simulado
const domElements = {};
const mockDoc = {
  getElementById(id) {
    if (!domElements[id]) {
      domElements[id] = {
        id,
        style: {},
        classList: {
          classes: new Set(),
          add(c) { this.classes.add(c); },
          remove(c) { this.classes.delete(c); },
          contains(c) { return this.classes.has(c); },
          toggle(c, v) { if (v) this.add(c); else this.remove(c); }
        },
        getContext() {
          return {
            canvas: { width: 340, height: 200 },
            fillStyle: '',
            fillRect() {},
            getImageData() { return { data: [1, 2, 3] }; },
            putImageData() {},
            beginPath() {},
            moveTo() {},
            lineTo() {},
            bezierCurveTo() {},
            stroke() {},
            clearRect() {}
          };
        },
        getBoundingClientRect() { return { left: 0, top: 0, width: 340, height: 200 }; },
        toDataURL(fmt) { return `data:${fmt};base64,sampledrawingdata123`; }
      };
    }
    return domElements[id];
  },
  querySelectorAll() { return []; },
  querySelector() { return null; }
};

const sandbox = {
  console,
  document: mockDoc,
  window: null,
  addEventListener() {},
  registerIcons(defs) { Object.assign(this.registeredIcons || (this.registeredIcons = {}), defs); },
  miIcon: (name) => `<svg>${name}</svg>`,
  userName: 'Camila',
  userLastName: 'Rojas',
  userAvatar: 'mariposa',
  muralButterflies: [],
  saveMuralArtifact: async () => ({ success: true, data: { contenido: { src: 'https://res.cloudinary.com/test/image.jpg' } } })
};
sandbox.window = sandbox;
vm.createContext(sandbox);

const filesToLoad = [
  'infraestructura/ui/CreaIcons.js',
  'dominio/CreaPaletteData.js',
  'dominio/CreaState.js',
  'aplicacion/DrawingCanvasCore.js',
  'aplicacion/DrawingCanvasActions.js',
  'aplicacion/CreaActions.js',
  'aplicacion/Publish68Actions.js',
  'aplicacion/Crea912Actions.js',
  'infraestructura/ui/ButterflySvgView.js',
  'infraestructura/ui/Pinta68View.js',
  'infraestructura/ui/Crea912StepsView.js',
  'infraestructura/ui/Crea912View.js'
];

filesToLoad.forEach((rel) => {
  const code = fs.readFileSync(path.join(creaDir, rel), 'utf8');
  vm.runInContext(code, sandbox);
});

// 3. Probar inicialización del canvas y captura de dibujo
sandbox.initCanvas();
assert.strictEqual(typeof sandbox.captureCanvasImage, 'function');
const captured = sandbox.captureCanvasImage();
assert(captured.startsWith('data:image/jpeg;base64,'), 'Captura debe ser JPEG en base64');
console.log('✅ Canvas inicializado y captura optimizada a JPEG correcta.');

// 4. Probar deshacer y rehacer
sandbox.undoLastStroke();
sandbox.redoStroke();
console.log('✅ Deshacer y rehacer ejecutados correctamente.');

// 5. Probar captura y publicación directa (flujo real)
(async () => {
  let saveCalls = 0;
  sandbox.saveMuralArtifact = async (tipo, art) => {
    saveCalls++;
    assert.strictEqual(tipo, 'dibujo');
    assert(art.src.startsWith('data:image/jpeg'), 'Artefacto debe enviar data URI del canvas al backend');
    assert.strictEqual(art.name, 'Camila Rojas');
    return { success: true, data: { contenido: { src: 'https://res.cloudinary.com/demo/image/upload/v123/crea.jpg' } } };
  };

  await sandbox.captureAndPublishDirect912();
  assert.strictEqual(saveCalls, 1, 'saveMuralArtifact debe llamarse una vez');
  assert.strictEqual(sandbox._creaJoined, true, '_creaJoined debe ser true tras guardado');
  assert.strictEqual(sandbox._publish912State, 'done', '_publish912State debe ser done');

  // Prevenir duplicados
  await sandbox.captureAndPublishDirect912();
  assert.strictEqual(saveCalls, 1, 'Segunda pulsación no debe disparar publicación duplicada');
  console.log('✅ Publicación directa conectada con saveMuralArtifact y prevención de duplicados.');

  // 6. Probar renderStep1 estructura visual
  const step1Html = sandbox.Crea912View.renderStep1(6);
  assert(step1Html.includes('Mi mesa de dibujo'), 'Debe contener título Mi mesa de dibujo');
  assert(step1Html.includes('drawCanvas'), 'Debe contener lienzo drawCanvas');
  assert(step1Html.includes('Deshacer') && step1Html.includes('Rehacer'), 'Debe tener botones Deshacer y Rehacer');
  assert(step1Html.includes('strokePreviewCanvas'), 'Debe tener canvas de preview de trazo');
  assert(step1Html.includes('publishDirectBtn912'), 'Debe tener botón de publicación directa');
  // 7. Probar flujo de guardado real y lectura en AdminDashboardParticipants
  const adminFile = path.join(root, 'frontend/src/features/telemetria_admin/infraestructura/ui/AdminDashboardParticipants.js');
  const adminCode = fs.readFileSync(adminFile, 'utf8');
  const adminSandbox = { console, window: null, escapeHtml: (s) => s, attrEscape: (s) => s, empty: () => '' };
  adminSandbox.window = adminSandbox;
  vm.createContext(adminSandbox);
  vm.runInContext(adminCode, adminSandbox);

  const mockArtifact = {
    id: 'art-99',
    tipo: 'dibujo',
    contenido: JSON.stringify({
      src: 'https://res.cloudinary.com/test-cloud/image/upload/v12345/dibujo.jpg',
      butterflyName: 'Mi dibujo territorial',
      place: 'Plaza Central'
    })
  };
  const adminHtml = adminSandbox.AdminDashboardParticipants.childSpace([], [mockArtifact], []);
  assert(adminHtml.includes('https://res.cloudinary.com/test-cloud/image/upload/v12345/dibujo.jpg'), 'Admin debe mostrar imagen de Cloudinary en src');
  assert(adminHtml.includes('Mi dibujo territorial'), 'Admin debe mostrar el título de la creación guardada');
  assert(adminHtml.includes('openAdminCreation'), 'Admin debe permitir abrir la imagen en visor grande al click');
  console.log('✅ Verificado: la creación guardada viaja con su URL de Cloudinary y el admin la muestra en Creaciones guardadas con visor.');

  // 8. Probar que si falla la persistencia, no se marca éxito y se permite reintentar
  sandbox._publish912State = 'idle';
  sandbox._creaJoined = false;
  let failCalled = false;
  sandbox.saveMuralArtifact = async () => {
    failCalled = true;
    return { success: false, error: 'Database timeout' };
  };
  await sandbox.captureAndPublishDirect912();
  assert.strictEqual(failCalled, true);
  assert.strictEqual(sandbox._publish912State, 'idle', 'Fallo debe mantener estado idle para reintentar');
  assert.strictEqual(sandbox._creaJoined, false, 'Fallo no debe marcarse como joined');
  console.log('✅ Verificado: fallo de persistencia no marca éxito y permite reintentar.');

  console.log('🎉 Todas las pruebas de estacion_crea pasaron con éxito.');
})().catch((err) => {
  console.error('❌ Error en pruebas:', err);
  process.exit(1);
});
