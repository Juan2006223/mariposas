// frontend/src/features/app_shell/infraestructura/ui/AppShellIcons.js
// Sistema de iconos propios de Alas de Mariposa: SVG inline en cuadrícula 48x48,
// trazo redondeado de tinta violeta y rellenos con la paleta de la app.
(function () {
  const defs = {};
  const legacy = {};
  const INK = '#2A0845';

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function register(map) {
    Object.keys(map).forEach((name) => { defs[name] = map[name]; });
  }

  // Asocia glifos heredados (guardados en datos antiguos) con el icono propio equivalente.
  function registerLegacy(map) {
    Object.keys(map).forEach((name) => {
      map[name].forEach((code) => { legacy[String.fromCodePoint(code)] = name; });
    });
  }

  function svg(name, size, extra) {
    const inner = defs[name];
    if (!inner) return '';
    const dim = size ? ` width="${size}" height="${size}"` : '';
    return `<svg class="mi mi-${name}${extra ? ' ' + extra : ''}" viewBox="0 0 48 48"${dim} aria-hidden="true" focusable="false">`
      + `<g fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${inner}</g></svg>`;
  }

  function stripSelectors(value) {
    return String(value || '').replace(/[︎️]/g, '');
  }

  // miIcon('mariposa') o miIcon('<glifo heredado>'): devuelve SVG; si no existe, el texto escapado.
  function miIcon(value, size, extra) {
    const key = stripSelectors(value);
    if (defs[key]) return svg(key, size, extra);
    if (legacy[key] && defs[legacy[key]]) return svg(legacy[key], size, extra);
    return esc(value == null ? '' : value);
  }

  function legacyRegex() {
    const keys = Object.keys(legacy).sort((a, b) => b.length - a.length);
    if (!keys.length) return null;
    return new RegExp('(' + keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')[\\uFE0E\\uFE0F]?', 'g');
  }

  // miText('texto con glifos heredados'): escapa el texto y cambia cada glifo por su icono propio.
  function miText(text) {
    const safe = esc(text == null ? '' : text);
    const re = legacyRegex();
    if (!re) return safe;
    return safe.replace(re, (m, g) => svg(legacy[g]) || '');
  }

  // Quita glifos heredados de un texto para guardarlo limpio (p. ej. "<glifo> Valiente" -> "Valiente").
  function miPlain(text) {
    const re = legacyRegex();
    const t = String(text == null ? '' : text);
    return (re ? t.replace(re, '') : t).replace(/^\s+/, '');
  }

  function miLabel(name, text) {
    return `${miIcon(name)} ${esc(text)}`;
  }

  window.AppIcons = { defs, register, registerLegacy, svg, miIcon, miText, miPlain, miLabel, INK };
  window.miIcon = miIcon;
  window.miText = miText;
  window.miPlain = miPlain;
  window.miLabel = miLabel;
  window.registerIcons = register;

  // Hidrata marcadores estáticos del HTML: <i data-mi="escucha"></i>
  function hydrate(root) {
    (root || document).querySelectorAll('[data-mi]').forEach((el) => {
      if (el.dataset.miDone) return;
      el.innerHTML = miIcon(el.dataset.mi, el.dataset.miSize || '');
      el.dataset.miDone = '1';
    });
  }
  window.hydrateIcons = hydrate;
})();
