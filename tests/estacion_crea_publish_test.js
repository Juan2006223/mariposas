const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('🧪 Iniciando verificación del slice estacion_crea (Publicación, Cloudinary, Neon y Admin)...');

const root = path.join(__dirname, '..');
const creaDir = path.join(root, 'frontend/src/features/estacion_crea');

const domElements = {};
const mockDoc = {
  getElementById(id) {
    if (!domElements[id]) {
      domElements[id] = {
        id,
        style: {},
        classList: { classes: new Set(), add(c) { this.classes.add(c); }, remove(c) { this.classes.delete(c); } },
        getContext() {
          return {
            canvas: { width: 640, height: 400 },
            fillStyle: '',
            fillRect() {},
            getImageData() { return { data: [1, 2, 3] }; },
            putImageData() {},
            beginPath() {},
            moveTo() {},
            lineTo() {},
            bezierCurveTo() {},
            ellipse() {},
            stroke() {},
            clearRect() {}
          };
        },
        getBoundingClientRect() { return { left: 0, top: 0, width: 640, height: 400 }; },
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

sandbox.initCanvas();

(async () => {
  // 1. Probar captura y publicación directa (flujo real)
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

  // Prevenir publicaciones duplicadas
  await sandbox.captureAndPublishDirect912();
  assert.strictEqual(saveCalls, 1, 'Segunda pulsación no debe disparar publicación duplicada');
  console.log('✅ Publicación directa conectada con saveMuralArtifact y prevención de duplicados.');

  // 2. Probar que si falla la persistencia, no se marca éxito y se permite reintentar
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

  // 3. Probar flujo de guardado real y lectura en AdminDashboardParticipants
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
  const mockEvt1 = { tipo_evento: 'VISITA_ESTACION', detalles: JSON.stringify({ estacion: 2 }) };
  const mockEvt2 = { tipo_evento: 'CREACION_MURAL', detalles: JSON.stringify({ tipo: 'dibujo' }) };
  const mockEvt3 = { tipo_evento: 'AVANCE_ESTACION', detalles: JSON.stringify({ estacion: 1 }) };

  const adminHtml = adminSandbox.AdminDashboardParticipants.childSpace([mockEvt1, mockEvt2, mockEvt3], [mockArtifact], []);
  assert(adminHtml.includes('https://res.cloudinary.com/test-cloud/image/upload/v12345/dibujo.jpg'), 'Admin debe mostrar imagen de Cloudinary en src');
  assert(adminHtml.includes('Mi dibujo territorial'), 'Admin debe mostrar el título de la creación guardada');
  assert(adminHtml.includes('openAdminCreation'), 'Admin debe permitir abrir la imagen en visor grande al click');
  assert(adminHtml.includes('Visitó una estación'), 'Debe traducir VISITA_ESTACION a Visitó una estación');
  assert(adminHtml.includes('Guardó una creación'), 'Debe traducir CREACION_MURAL a Guardó una creación');
  assert(adminHtml.includes('Avanzó en una estación'), 'Debe traducir AVANCE_ESTACION a Avanzó en una estación');
  assert(!adminHtml.includes('VISITA_ESTACION'), 'No debe mostrar código técnico VISITA_ESTACION');
  assert(adminHtml.includes('overflow-wrap:anywhere'), 'Debe prevenir recortes con overflow-wrap:anywhere');

  console.log('✅ Verificado: URL de Cloudinary en admin, textos en español claros y sin recortes.');
  console.log('🎉 Pruebas de estacion_crea_publish_test pasaron con éxito.');
})().catch((err) => {
  console.error('❌ Error en pruebas de publicación:', err);
  process.exit(1);
});
