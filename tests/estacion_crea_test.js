const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('🧪 Iniciando verificación del slice estacion_crea (Core y Herramientas)...');

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
            canvas: { width: 640, height: 400 },
            fillStyle: '',
            fillRect() {},
            getImageData() { return { data: [155, 77, 255, 255] }; },
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

// 5. Pruebas de cambio real de herramientas en el canvas
sandbox.selectStudioTool('lapiz');
assert.strictEqual(sandbox.activeStudioTool, 'lapiz', 'Herramienta activa debe ser lapiz');
assert.strictEqual(sandbox.brushSize, 3, 'Lápiz debe tener grosor fino de 3px');

sandbox.selectStudioTool('marcador');
assert.strictEqual(sandbox.activeStudioTool, 'marcador', 'Herramienta activa debe ser marcador');
assert.strictEqual(sandbox.brushMode, 'marker', 'Marcador debe activar brushMode marker');
assert.strictEqual(sandbox.brushSize, 14, 'Marcador debe tener grosor de 14px');

sandbox.selectStudioTool('borrador');
assert.strictEqual(sandbox.activeStudioTool, 'borrador', 'Herramienta activa debe ser borrador');
assert.strictEqual(sandbox.erasing, true, 'Borrador debe activar flag erasing');

sandbox.selectStudioTool('mover');
assert.strictEqual(sandbox.activeStudioTool, 'mover', 'Herramienta activa debe ser mover');
const mockCanvasEl = sandbox.document.getElementById('drawCanvas');
assert.strictEqual(mockCanvasEl.style.cursor, 'grab', 'Cursor debe ser grab para mover');

let drawStrokeCalled = false;
const originalStroke = sandbox.ctx.stroke;
sandbox.ctx.stroke = () => { drawStrokeCalled = true; };
mockCanvasEl.onpointerdown({ clientX: 10, clientY: 10 });
mockCanvasEl.onpointermove({ clientX: 20, clientY: 20 });
assert.strictEqual(drawStrokeCalled, false, 'Herramienta mover no debe pintar en canvas');
sandbox.ctx.stroke = originalStroke;

sandbox.selectStudioTool('selector');
assert.strictEqual(sandbox.activeStudioTool, 'selector', 'Herramienta activa debe ser selector');
mockCanvasEl.onpointerdown({ clientX: 10, clientY: 10 });
assert.strictEqual(sandbox.brushColor, '#9B4DFF', 'Selector debe tomar color del pixel del canvas');

// 6. Probar renderStep1 estructura visual y dimensiones responsive
const step1Html = sandbox.Crea912View.renderStep1(6);
assert(step1Html.includes('Mi mesa de dibujo'), 'Debe contener título Mi mesa de dibujo');
assert(step1Html.includes('width="640" height="400"'), 'Canvas debe tener resolución ampliada 640x400');
assert(step1Html.includes('Gira tu dispositivo para dibujar con más espacio.'), 'Debe contener aviso de rotación');
assert(step1Html.includes('Deshacer') && step1Html.includes('Rehacer'), 'Debe tener botones Deshacer y Rehacer');
assert(step1Html.includes('publishDirectBtn912'), 'Debe tener botón de publicación directa');

console.log('🎉 Pruebas de estacion_crea_test pasaron con éxito.');
