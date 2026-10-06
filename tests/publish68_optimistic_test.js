const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 Verificando publicación optimista de la mariposa 6-8...');

const file = 'frontend/src/features/estacion_crea/aplicacion/Publish68Actions.js';
const lines = fs.readFileSync(path.join(__dirname, '..', file), 'utf8').split('\n').length;
assert(lines <= 200, `${file} supera 200 líneas (${lines})`);

const els = {
  saveButterflyStatus68: { innerText: '', style: {} },
  publishButterflyBtn68: { innerText: 'Tomar foto y publicar mi mariposa', disabled: false, style: {} },
  continueBlock2_68: { style: { display: 'none' } },
};
global.document = { getElementById: (id) => els[id] || null };
const notices = [];
const saves = [];
let releaseSave;
global.window = {
  selectedLanding68: 'Plaza Central',
  userName: 'Ana',
  userLastName: 'Cortez',
  zoneColorMap: { wingLU: '#9B4DFF', body: '#FFC857' },
  muralButterflies: [],
  showPersistenceNotice: (m, err) => notices.push({ m, err }),
  saveMuralArtifact: (tipo, contenido) => new Promise((resolve) => {
    saves.push({ tipo, contenido });
    releaseSave = resolve;
  }),
};
// La captura real necesita canvas: se simula una captura inmediata.
require('../frontend/src/features/estacion_crea/aplicacion/Publish68Actions.js');
window.captureButterflySvg68 = async () => ({ blob: { size: 4096 }, previewUrl: 'blob:vista-previa' });
window.blobToDataUri = async () => 'data:image/jpeg;base64,AAAA';
const tick = () => new Promise((r) => setImmediate(r));

(async () => {
  // 1. La UI se libera sin esperar a saveMuralArtifact
  await window.publishPaintedButterfly68();
  assert.strictEqual(window.muralButterflies.length, 1, 'la mariposa debe entrar al mural local antes de que responda la red');
  const item = window.muralButterflies[0];
  assert.strictEqual(item.src, 'blob:vista-previa');
  assert.strictEqual(item.pending, true);
  assert.strictEqual(els.continueBlock2_68.style.display, 'block', 'el botón continuar debe verse sin esperar la red');
  assert.strictEqual(els.saveButterflyStatus68.innerText, 'Publicando en segundo plano...');
  assert.notStrictEqual(els.publishButterflyBtn68.innerText, 'Tomando foto y publicando...');
  await tick();
  assert.strictEqual(saves.length, 1, 'saveMuralArtifact se llama en segundo plano');
  assert.strictEqual(saves[0].tipo, 'mariposa');
  assert.strictEqual(saves[0].contenido.src, 'data:image/jpeg;base64,AAAA', 'el backend sigue recibiendo la imagen en contenido.src');
  assert.strictEqual(saves[0].contenido.pending, undefined, 'no se envía estado local al backend');
  console.log('✅ El item local y el botón continuar aparecen antes de que resuelva la red.');

  // 2. Al resolver, el item local toma la URL de Cloudinary
  const job = window._publish68;
  releaseSave({ success: true, data: { contenido: { src: 'https://res.cloudinary.com/demo/mariposa.jpg', storage: 'cloudinary' } } });
  await job.done;
  assert.strictEqual(item.src, 'https://res.cloudinary.com/demo/mariposa.jpg');
  assert.strictEqual(item.pending, false);
  assert.strictEqual(els.publishButterflyBtn68.innerText, 'Mariposa publicada');
  assert.strictEqual(window.muralButterflies.length, 1, 'no se duplica el item');
  console.log('✅ El item local se actualiza con la URL de Cloudinary.');

  // 3. Si falla, la mariposa no se pierde y se puede reintentar
  window._publish68 = null;
  window.muralButterflies = [];
  await window.publishPaintedButterfly68();
  await tick();
  const failing = window._publish68;
  releaseSave({ success: false, error: 'sin red' });
  await failing.done;
  assert.strictEqual(window.muralButterflies.length, 1, 'la creación sigue en el mural local');
  assert.strictEqual(window.muralButterflies[0].failed, true);
  assert.strictEqual(els.publishButterflyBtn68.innerText, 'Reintentar publicación');
  assert.strictEqual(els.publishButterflyBtn68.disabled, false);
  assert(notices.some((n) => n.err), 'aviso no bloqueante de error');
  await window.publishPaintedButterfly68();
  await tick();
  assert.strictEqual(saves.length, 3, 'el reintento vuelve a guardar sin recapturar');
  releaseSave({ success: true, data: { contenido: { src: 'https://res.cloudinary.com/demo/reintento.jpg' } } });
  await failing.done;
  assert.strictEqual(window.muralButterflies[0].src, 'https://res.cloudinary.com/demo/reintento.jpg');
  assert.strictEqual(window.muralButterflies[0].failed, false);
  console.log('✅ Falla de red: aviso, reintento y sin pérdida de la creación.');
  console.log('🎉 Publicación optimista verificada.');
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
