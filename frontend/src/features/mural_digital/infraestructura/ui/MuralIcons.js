// frontend/src/features/mural_digital/infraestructura/ui/MuralIcons.js
// Iconos propios del Mural: comillas de voz y estados vacíos de cada pestaña.
(function () {
  const C = { sol: '#FFC857', rosa: '#D946B5', vio: '#9B4DFF', lila: '#C9A0FF', rio: '#5B6FE8', verde: '#4FB286', cafe: '#B0793F', crema: '#FFF3D6', ink: '#2A0845' };

  window.registerIcons({
    cita: `<path d="M6 26C6 15 12 10 19 9L20 14C16 15 14 17 14 21H20V36H6Z" fill="${C.sol}"/><path d="M27 26C27 15 33 10 40 9L41 14C37 15 35 17 35 21H41V36H27Z" fill="${C.rosa}"/>`,
    // Estados vacíos: dibujos suaves, relacionados con cada actividad
    'vacio-mariposas': `<path d="M24 24C18 8 5 9 7 20C8 27 17 28 24 24Z" stroke-dasharray="4 4"/><path d="M24 24C30 8 43 9 41 20C40 27 31 28 24 24Z" stroke-dasharray="4 4"/>
      <path d="M24 25C17 27 10 30 13 37C16 42 22 37 24 30ZM24 25C31 27 38 30 35 37C32 42 26 37 24 30Z" stroke-dasharray="4 4"/>
      <path d="M24 16V35" stroke="${C.lila}" stroke-width="3"/><circle cx="38" cy="8" r="2.4" fill="${C.sol}" stroke="none"/><circle cx="9" cy="8" r="2" fill="${C.rosa}" stroke="none"/>`,
    'vacio-palabras': `<path d="M6 19C6 10 14 5 24 5C34 5 42 10 42 19C42 28 34 33 24 33C22 33 20 33 18 32L9 40L11 29C8 26 6 23 6 19Z" fill="${C.crema}" stroke-dasharray="4 4"/>
      <path d="M16 19H32M16 25H26" stroke="${C.lila}" stroke-width="3"/><path d="M40 33L41.5 37L45 38.5L41.5 40L40 44L38.5 40L35 38.5L38.5 37Z" fill="${C.sol}" stroke-width="1.8"/>`,
    'vacio-huellas': `<path d="M5 41C12 41 11 31 19 30C27 29 25 20 33 18" stroke="${C.lila}" stroke-width="3" stroke-dasharray="1 7"/>
      <path d="M34 22C30 22 28 26 29 29C30 32 33 30 34 30C35 30 38 32 39 29C40 26 38 22 34 22Z" fill="${C.cafe}"/>
      <ellipse cx="29" cy="20" rx="2.2" ry="3" fill="${C.cafe}"/><ellipse cx="34" cy="15" rx="2.2" ry="3" fill="${C.cafe}"/><ellipse cx="40" cy="20" rx="2.2" ry="3" fill="${C.cafe}"/>`,
    'vacio-descubrimientos': `<path d="M10 30C3 30 3 18 11 17C11 8 23 6 27 12C33 7 43 12 40 20C46 21 45 32 37 32Z" fill="${C.crema}" stroke-dasharray="4 4"/>
      <circle cx="21" cy="21" r="6.5" fill="${C.sol}"/><path d="M26 26L33 33" stroke="${C.cafe}" stroke-width="4"/>
      <circle cx="9" cy="39" r="3.2" fill="${C.crema}"/><circle cx="4" cy="45" r="2" fill="${C.crema}"/>`,
  });
})();
