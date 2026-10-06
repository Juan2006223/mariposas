// frontend/src/features/estacion_mapa/infraestructura/ui/MapaIcons.js
// Iconos propios de los lugares del mapa: cultura, circo, burrito y reconocimientos.
(function () {
  const C = { sol: '#FFC857', rosa: '#D946B5', vio: '#9B4DFF', lila: '#C9A0FF', rio: '#5B6FE8', verde: '#4FB286', cafe: '#B0793F', crema: '#FFF3D6', ink: '#2A0845' };
  const dot = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r || 1.6}" fill="${C.ink}" stroke="none"/>`;

  window.registerIcons({
    // Fundación Cultural Manigua: dos máscaras de teatro
    teatro: `<path d="M5 8H27V22C27 31 22 36 16 36C10 36 5 31 5 22Z" fill="${C.sol}"/>${dot(11, 18)}${dot(21, 18)}<path d="M11 26C13 29 19 29 21 26" stroke-width="2"/>
      <path d="M20 17H42V31C42 40 37 45 31 45C25 45 20 40 20 31Z" fill="${C.rosa}"/>${dot(26, 27)}${dot(36, 27)}<path d="M26 38C28 35 34 35 36 38" stroke-width="2"/>`,
    // Fundación Forma Vida: carpa de circo social
    circo: `<path d="M24 5V1" /><path d="M5 21L24 5L43 21Z" fill="${C.rosa}"/><path d="M9 21H39V41H9Z" fill="${C.crema}"/>
      <path d="M18 21V41M30 21V41" stroke-width="2"/><path d="M20 41C20 31 28 31 28 41Z" fill="${C.vio}"/><path d="M24 1L29 3L24 5Z" fill="${C.sol}" stroke-width="1.6"/>`,
    // Canelo el burrito
    burrito: `<path d="M15 5C10 8 11 18 17 21C19 14 19 8 15 5Z" fill="${C.cafe}"/><path d="M33 5C38 8 37 18 31 21C29 14 29 8 33 5Z" fill="${C.cafe}"/>
      <path d="M12 23C12 14 36 14 36 23C36 30 34 33 33 38C32 44 16 44 15 38C14 33 12 30 12 23Z" fill="${C.cafe}"/>
      <ellipse cx="24" cy="35" rx="8.5" ry="6.5" fill="${C.crema}"/>${dot(21, 35, 1.4)}${dot(27, 35, 1.4)}${dot(18, 25)}${dot(30, 25)}
      <path d="M20 14C22 17 26 17 28 14" stroke="${C.vio}" stroke-width="3"/>`,
    // Reconocimiento del recorrido: medalla con cinta
    medalla: `<path d="M12 3H22L26 19H17Z" fill="${C.rio}"/><path d="M36 3H26L22 19H31Z" fill="${C.rosa}"/>
      <circle cx="24" cy="30" r="13" fill="${C.sol}"/><circle cx="24" cy="30" r="8" fill="${C.crema}" stroke-width="2"/>
      <path d="M24 25L25.8 28.6L29.6 29L26.8 31.6L27.6 35.4L24 33.5L20.4 35.4L21.2 31.6L18.4 29L22.2 28.6Z" fill="${C.sol}" stroke-width="1.6"/>`,
  });
})();
