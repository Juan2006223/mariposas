// frontend/src/features/app_shell/infraestructura/ui/ShellNavIcons.js
// Iconos de navegación (estaciones) y avatares del explorador.
(function () {
  const C = { sol: '#FFC857', rosa: '#D946B5', vio: '#9B4DFF', lila: '#C9A0FF', rio: '#5B6FE8', verde: '#4FB286', cafe: '#B0793F', crema: '#FFF3D6', ink: '#2A0845' };
  const dot = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r || 1.8}" fill="${C.ink}" stroke="none"/>`;

  window.registerIcons({
    // Estación 1 · Escucha: oreja grande con ondas suaves
    escucha: `<path d="M19 41C13 41 11 35 11 29C11 17 19 8 28 8C35 8 39 14 37 21C36 27 30 28 30 33C30 37 26 41 19 41Z" fill="${C.sol}"/>
      <path d="M20 32C20 25 24 21 28 22C31 24 28 28 25 29" stroke-width="2.2"/>
      <path d="M42 15C45 19 45 24 42 28" stroke="${C.rosa}" stroke-width="3"/><path d="M6 19C4 22 4 26 6 29" stroke="${C.rio}" stroke-width="3"/>`,
    // Estación 2 · Pinta: pincel con ala de mural
    pinta: `<path d="M41 6C43 8 43 10 41 12L27 27L21 21L35 7C37 5 39 4 41 6Z" fill="${C.cafe}"/>
      <path d="M27 27L21 21L18 24L24 30Z" fill="${C.lila}"/>
      <path d="M18 24C10 24 6 30 7 36C8 41 13 43 17 40C22 37 25 31 24 30Z" fill="${C.rosa}"/>
      <path d="M6 17C5 10 12 6 17 10C15 15 11 18 6 17Z" fill="${C.sol}"/><path d="M12 12L14 9" stroke-width="2"/>`,
    // Estación 3 · Voz: burbuja orgánica con onda
    voz: `<path d="M7 20C7 11 15 6 25 6C35 6 42 12 42 20C42 29 34 34 25 34C23 34 21 34 19 33L10 41L12 30C9 27 7 24 7 20Z" fill="${C.rio}"/>
      <path d="M14 20C17 14 19 26 24 20C28 14 30 26 35 20" stroke="${C.crema}" stroke-width="3"/>`,
    // Estación 4 · Mapa: colina con camino curvo y punto territorial
    mapa: `<path d="M3 42C9 27 19 21 28 25C36 28 42 24 45 42Z" fill="${C.verde}"/>
      <path d="M13 43C13 36 29 38 27 32C25 27 19 29 21 23" stroke="${C.crema}" stroke-width="4.5"/>
      <path d="M21 24C15 18 14 15 14 12C14 7 17 4 21 4C25 4 28 7 28 12C28 15 27 18 21 24Z" fill="${C.sol}"/><circle cx="21" cy="12" r="3.2" fill="${C.rosa}"/>`,
    // Estación 5 · Mural: pared viva con piezas y brillo
    mural: `<rect x="5" y="9" width="38" height="31" rx="5" fill="${C.lila}"/>
      <path d="M5 19H43M5 29H43M19 9V19M33 19V29M15 29V40" stroke-width="2"/>
      <path d="M11 33C10 23 21 17 26 23C30 29 20 38 11 33Z" fill="${C.sol}"/><circle cx="35" cy="15" r="4.5" fill="${C.rosa}"/>
      <path d="M30 32L32 27L34 32L39 34L34 36L32 41L30 36L25 34Z" fill="${C.crema}" stroke-width="2"/>`,
    // Estación 6 · Galería: marco con montaña y sol
    galeria: `<rect x="5" y="7" width="38" height="31" rx="6" fill="${C.crema}"/>
      <rect x="10" y="12" width="28" height="21" rx="3" fill="${C.rio}"/>
      <path d="M10 33L20 19L26 27L30 22L38 33Z" fill="${C.verde}"/><circle cx="31" cy="18" r="3.4" fill="${C.sol}"/>
      <path d="M14 38L11 45M34 38L37 45"/>`,
    // Avatares
    mariposa: `<path d="M24 25C18 8 5 9 7 20C8 27 17 28 24 25Z" fill="${C.vio}"/><path d="M24 25C30 8 43 9 41 20C40 27 31 28 24 25Z" fill="${C.rosa}"/>
      <path d="M24 26C17 28 10 31 13 38C16 43 22 38 24 31Z" fill="${C.sol}"/><path d="M24 26C31 28 38 31 35 38C32 43 26 38 24 31Z" fill="${C.sol}"/>
      <circle cx="14" cy="17" r="2.4" fill="${C.crema}" stroke="none"/><circle cx="34" cy="17" r="2.4" fill="${C.crema}" stroke="none"/>
      <path d="M24 17V36" stroke-width="3.6"/><path d="M24 17C22 12 20 10 17 9M24 17C26 12 28 10 31 9"/>`,
    estrella: `<path d="M22 4C24 17 29 22 42 24C29 26 24 31 22 44C20 31 15 26 2 24C15 22 20 17 22 4Z" fill="${C.sol}"/>
      <path d="M38 5V13M34 9H42" stroke="${C.rosa}" stroke-width="3"/>
      <path d="M37 31C38 35 39 36 43 37C39 38 38 39 37 43C36 39 35 38 31 37C35 36 36 35 37 31Z" fill="${C.rio}" stroke-width="2"/>`,
    oruga: `<circle cx="9" cy="32" r="6" fill="${C.verde}"/><circle cx="18" cy="30" r="7" fill="${C.verde}"/><circle cx="28" cy="30" r="7" fill="${C.verde}"/>
      <circle cx="38" cy="26" r="8" fill="${C.sol}"/>${dot(35.5, 24.5)}${dot(41, 24.5)}<path d="M35 29C37 31 40 31 42 29" stroke-width="2"/>
      <path d="M35 19L32 14M41 19L44 14"/><path d="M9 38V42M18 37V42M28 37V42M38 34V42"/>`,
    colibri: `<path d="M11 31C10 21 20 16 28 20C34 17 39 18 42 20C39 22 37 24 36 26C36 34 28 40 21 38C15 37 11 34 11 31Z" fill="${C.verde}"/>
      <path d="M36 22L46 19" stroke="${C.cafe}" stroke-width="3"/><path d="M16 27C12 18 18 8 26 10C27 17 25 23 20 28Z" fill="${C.rosa}"/>
      <path d="M11 31L4 37L13 35" fill="${C.verde}"/>${dot(32, 23, 1.6)}<circle cx="38" cy="38" r="3" fill="${C.sol}" stroke-width="2"/>`,
    canelo: `<path d="M13 17C6 17 5 30 9 34C14 32 15 25 15 20Z" fill="#8A5A2B"/><path d="M35 17C42 17 43 30 39 34C34 32 33 25 33 20Z" fill="#8A5A2B"/>
      <circle cx="24" cy="26" r="14" fill="${C.cafe}"/><ellipse cx="24" cy="31" rx="7" ry="5.2" fill="${C.crema}"/>
      <ellipse cx="24" cy="28.5" rx="2.6" ry="1.8" fill="${C.ink}"/>${dot(18, 23)}${dot(30, 23)}
      <path d="M24 30.5V33M20.5 33C22 35 26 35 27.5 33" stroke-width="2"/><path d="M24 35V38" stroke="${C.rosa}" stroke-width="3"/>`,
    admin: `<rect x="6" y="27" width="9" height="16" rx="3" fill="${C.rio}"/><rect x="19" y="16" width="9" height="27" rx="3" fill="${C.sol}"/>
      <rect x="32" y="7" width="9" height="36" rx="3" fill="${C.rosa}"/><path d="M4 44H44"/>`,
    cerrar: `<path d="M12 12L36 36M36 12L12 36" stroke="currentColor" stroke-width="6"/>`,
  });
})();
