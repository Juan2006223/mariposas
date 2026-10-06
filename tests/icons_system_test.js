const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('🧪 Iniciando verificación del sistema de iconos propios...');

const root = path.join(__dirname, '..');
const iconFiles = [
  'app_shell/infraestructura/ui/AppShellIcons.js',
  'app_shell/infraestructura/ui/ShellNavIcons.js',
  'app_shell/infraestructura/ui/ShellControlIcons.js',
  'app_shell/infraestructura/ui/ShellTerritoryIcons.js',
  'app_shell/infraestructura/ui/ShellLegacyIcons.js',
  'estacion_mapa/infraestructura/ui/MapaIcons.js',
  'estacion_crea/infraestructura/ui/CreaIcons.js',
  'estacion_voz/infraestructura/ui/VozIcons.js',
  'mural_digital/infraestructura/ui/MuralIcons.js',
  'galeria_territorio/infraestructura/ui/GaleriaIcons.js',
].map((f) => 'frontend/src/features/' + f);

// 1. Archivos de iconos existen y no superan 200 líneas
iconFiles.forEach((f) => {
  const full = path.join(root, f);
  assert(fs.existsSync(full), `Archivo no existe: ${f}`);
  const lines = fs.readFileSync(full, 'utf8').split('\n').length;
  assert(lines <= 200, `${f} supera 200 líneas (${lines})`);
});
console.log('✅ Archivos de iconos existen y tienen <= 200 líneas.');

// 2. Cargar todos los iconos en un contexto tipo navegador
const ctx = { console };
ctx.window = ctx;
vm.createContext(ctx);
iconFiles.forEach((f) => vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f }));
const defs = ctx.AppIcons.defs;
const names = Object.keys(defs);
assert(names.length >= 70, `se esperaban >= 70 iconos propios, hay ${names.length}`);

// 3. Cada icono es SVG bien formado (etiquetas balanceadas, sin valores vacíos)
names.forEach((n) => {
  const out = ctx.AppIcons.svg(n, 24);
  assert(out.startsWith('<svg') && out.endsWith('</svg>'), `icono ${n}: SVG inválido`);
  assert(!/undefined|NaN/.test(out), `icono ${n}: contiene undefined/NaN`);
  const tags = out.match(/<\/?[a-zA-Z][^>]*>/g) || [];
  const stack = [];
  tags.forEach((t) => {
    if (t.endsWith('/>')) return;
    const name = t.replace(/[<>/]/g, ' ').trim().split(/\s+/)[0];
    if (t.startsWith('</')) assert.strictEqual(stack.pop(), name, `icono ${n}: etiqueta </${name}> mal cerrada`);
    else stack.push(name);
  });
  assert.strictEqual(stack.length, 0, `icono ${n}: etiquetas sin cerrar`);
});
console.log(`✅ ${names.length} iconos propios con SVG bien formado.`);

// 4. Todo nombre de icono usado en el código existe en el catálogo
const files = [];
(function walk(d) {
  fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(js|html)$/.test(p)) files.push(p);
  });
})(path.join(root, 'frontend/src'));
files.push(path.join(root, 'frontend/index.html'));

const usage = [
  /miIcon\('([\w-]+)'\)/g, /data-mi="([\w-]+)"/g, /\bico: '([\w-]+)'/g,
  /\bicon: '([\w-]+)'/g, /'(carita-[a-z]+)'/g, /registerIcons\(\{[^}]*\}/g,
];
const missing = [];
files.forEach((f) => {
  const src = fs.readFileSync(f, 'utf8');
  usage.slice(0, 5).forEach((re) => {
    for (const m of src.matchAll(re)) if (!defs[m[1]]) missing.push(`${path.relative(root, f)}: ${m[1]}`);
  });
});
assert.deepStrictEqual(missing, [], 'iconos usados pero no definidos:\n' + missing.join('\n'));
const vozData = fs.readFileSync(path.join(root, 'frontend/src/features/estacion_voz/dominio/VozData.js'), 'utf8');
for (const m of vozData.matchAll(/(?:ico: |\d: )'([\w-]+)'/g)) assert(defs[m[1]], `VozData usa icono inexistente: ${m[1]}`);
console.log('✅ Todos los nombres de icono usados existen en el catálogo.');

// 5. Compatibilidad con glifos heredados guardados en datos antiguos
const butterfly = String.fromCodePoint(0x1F98B);
assert(ctx.miIcon(butterfly).includes('mi-mariposa'), 'miIcon debe convertir el glifo heredado de mariposa');
assert(!ctx.miText(`${String.fromCodePoint(0x1F31F)} Valiente`).includes(String.fromCodePoint(0x1F31F)), 'miText debe cambiar glifos por iconos');
assert.strictEqual(ctx.miPlain(`${String.fromCodePoint(0x1F31F)} Valiente`), 'Valiente');
assert(ctx.miText('<b>x</b>').includes('&lt;b&gt;'), 'miText debe escapar HTML');
console.log('✅ Compatibilidad con datos antiguos y escape de texto.');

// 6. Ningún emoji usado como icono de interfaz en el código
const emoji = /\p{Extended_Pictographic}|[▶⏸✓✕➜✔↔↩]/u;
const offenders = files.filter((f) => emoji.test(fs.readFileSync(f, 'utf8')));
assert.deepStrictEqual(offenders.map((f) => path.relative(root, f)), [], 'archivos con emojis como UI');
console.log('✅ Sin emojis como iconografía de interfaz.');

// 7. Los iconos del shell se cargan en index.html (antes del bootstrap, para estar listos al primer render) y los de cada slice en su loader
const indexHtml = fs.readFileSync(path.join(root, 'frontend/index.html'), 'utf8');
assert(indexHtml.indexOf('ShellLegacyIcons.js') < indexHtml.indexOf('bootstrap.js'), 'los iconos del shell deben cargarse antes del bootstrap');
assert(indexHtml.includes('hydrateIcons()'), 'index.html debe hidratar los iconos estáticos');
['AppShellIcons', 'ShellNavIcons', 'ShellControlIcons', 'ShellTerritoryIcons', 'ShellLegacyIcons'].forEach((n) => assert(indexHtml.includes(n + '.js'), `index.html debe cargar ${n}`));
['estacion_mapa/MapaIcons', 'estacion_crea/CreaIcons', 'estacion_voz/VozIcons', 'mural_digital/MuralIcons', 'galeria_territorio/GaleriaIcons'].forEach((p) => {
  const [slice, file] = p.split('/');
  const loader = fs.readFileSync(path.join(root, `frontend/src/features/${slice}/infraestructura/loader.js`), 'utf8');
  assert(loader.includes(file + '.js'), `${slice}/loader.js debe cargar ${file}`);
});
console.log('🎉 Todas las validaciones del sistema de iconos pasaron.');
