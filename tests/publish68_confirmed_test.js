const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 Verificando publicación confirmada de la mariposa 6-8...');

const file = 'frontend/src/features/estacion_crea/aplicacion/Publish68Actions.js';
const lines = fs.readFileSync(path.join(__dirname, '..', file), 'utf8').split('\n').length;
assert(lines <= 200, `${file} supera 200 líneas (${lines})`);

const els = {
  saveButterflyStatus68: { innerText: '', style: {} },
  publishButterflyBtn68: { innerText: 'Tomar foto y publicar mi mariposa', disabled: false },
  continueBlock2_68: { style: { display: 'none' } },
};
global.document = { getElementById: (id) => els[id] || null };
const notices = [];
const saves = [];
let releaseSave;
global.userName = 'Ana';
global.userLastName = 'Cortez';
global.userAvatar = 'mariposa';
global.window = {
  selectedLanding68: 'Plaza Central',
  zoneColorMap: { wingLU: '#9B4DFF', body: '#FFC857' },
  muralButterflies: [],
  showPersistenceNotice: (m, err) => notices.push({ m, err }),
  saveMuralArtifact: (tipo, contenido) => new Promise((resolve) => {
    saves.push({ tipo, contenido });
    releaseSave = resolve;
  }),
};

require('../frontend/src/features/estacion_crea/aplicacion/Publish68Actions.js');
window.captureButterflySvg68 = async () => ({ blob: { size: 4096 }, previewUrl: 'blob:vista-previa' });
window.blobToDataUri = async () => 'data:image/jpeg;base64,AAAA';
const tick = () => new Promise((r) => setImmediate(r));

(async () => {
  const pending = window.publishPaintedButterfly68();
  await tick();
  assert.strictEqual(window.muralButterflies.length, 0, 'no entra al mural antes de confirmar backend');
  assert.strictEqual(els.continueBlock2_68.style.display, 'none', 'no deja continuar antes de confirmar backend');
  assert.strictEqual(saves[0].tipo, 'mariposa');
  assert.strictEqual(saves[0].contenido.src, 'data:image/jpeg;base64,AAAA');
  assert.strictEqual(saves[0].contenido.name, 'Ana Cortez');
  releaseSave({ success: true, data: { contenido: { src: 'https://res.cloudinary.com/demo/mariposa.jpg', storage: 'cloudinary' } } });
  await pending;
  assert.strictEqual(window.muralButterflies.length, 1, 'entra al mural solo después del éxito real');
  assert.strictEqual(window.muralButterflies[0].src, 'https://res.cloudinary.com/demo/mariposa.jpg');
  assert.strictEqual(els.continueBlock2_68.style.display, 'block');
  assert.strictEqual(els.publishButterflyBtn68.innerText, 'Mariposa publicada');
  assert(notices.some((n) => !n.err && n.m.includes('guardada')));
  console.log('✅ Éxito confirmado: solo publica después de Cloudinary + Neon.');

  window._publish68State = 'idle';
  window.muralButterflies = [];
  els.continueBlock2_68.style.display = 'none';
  const failed = window.publishPaintedButterfly68();
  await tick();
  releaseSave({ success: false, error: 'sin red' });
  await failed;
  assert.strictEqual(window.muralButterflies.length, 0, 'si falla no deja falso positivo en mural');
  assert.strictEqual(els.continueBlock2_68.style.display, 'none', 'si falla no permite continuar como guardado');
  assert(notices.some((n) => n.err));
  console.log('✅ Falla real: no hay falso positivo ni cola local.');
  console.log('🎉 Publicación confirmada verificada.');
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
