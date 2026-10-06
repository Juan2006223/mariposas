const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('🧪 Verificando exposición global de ApiClient...');

const file = 'frontend/src/services/ApiClient.js';
const code = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
assert(code.split('\n').length <= 200, `${file} supera 200 líneas`);

const ctx = {
  console,
  window: { location: { origin: 'https://mariposas-frontend.vercel.app' } },
  fetch: async () => ({ ok: true, text: async () => '{"success":true,"data":[]}' }),
};
vm.createContext(ctx);
vm.runInContext(code, ctx, { filename: file });

assert.strictEqual(typeof ctx.window.ApiClient, 'object', 'ApiClient debe estar expuesto en window');
assert.strictEqual(typeof ctx.window.ApiClient.listarMural, 'function', 'window.ApiClient.listarMural debe existir');
assert.strictEqual(typeof ctx.window.ApiClient.guardarArtefactoMural, 'function', 'window.ApiClient.guardarArtefactoMural debe existir');

console.log('🎉 ApiClient disponible para app_shell.');
