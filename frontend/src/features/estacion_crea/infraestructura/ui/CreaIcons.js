// frontend/src/features/estacion_crea/infraestructura/ui/CreaIcons.js
// Iconos propios de la estación Pinta/Crea: herramientas de dibujo y cualidades de la mariposa.
(function () {
  const C = { sol: '#FFC857', rosa: '#D946B5', vio: '#9B4DFF', lila: '#C9A0FF', rio: '#5B6FE8', verde: '#4FB286', cafe: '#B0793F', crema: '#FFF3D6', ink: '#2A0845' };

  window.registerIcons({
    // Herramientas
    borrador: `<path d="M8 31L25 13L39 25L27 40H15Z" fill="${C.rosa}"/><path d="M17 22L31 34" stroke="${C.crema}" stroke-width="3"/><path d="M5 43H25"/>`,
    deshacer: `<path d="M16 12L7 21L16 30" stroke="currentColor" stroke-width="5.5"/><path d="M8 21H28C37 21 41 27 41 36" stroke="currentColor" stroke-width="5.5"/>`,
    escoba: `<path d="M39 4L23 25" stroke="${C.cafe}" stroke-width="4.5"/><path d="M27 21L15 24C8 30 8 38 10 44C19 45 29 39 31 29Z" fill="${C.sol}"/>
      <path d="M15 31L19 40M21 28L24 38" stroke-width="2"/>`,
    giro: `<path d="M9 24H39M17 14L7 24L17 34M31 14L41 24L31 34" stroke="currentColor" stroke-width="5"/>`,
    dedo: `<path d="M19 23V9C19 4 26 4 26 9V21C27 18 32 18 32 22C33 19 38 19 38 24V32C38 39 33 44 25 44H24C18 44 14 39 12 33L8 27C7 24 11 22 14 25L19 30Z" fill="${C.crema}"/>`,
    nota: `<path d="M17 36V10L37 6V32" /><path d="M17 10L37 6V14L17 18Z" fill="${C.vio}"/>
      <ellipse cx="12.5" cy="37" rx="5.5" ry="4.6" fill="${C.rosa}"/><ellipse cx="32.5" cy="33" rx="5.5" ry="4.6" fill="${C.rosa}"/>`,
    globo: `<circle cx="24" cy="24" r="19" fill="${C.rio}"/>
      <path d="M12 15C17 10 25 12 23 19C21 25 14 24 12 29C9 24 9 19 12 15Z" fill="${C.verde}"/><path d="M28 28C33 26 39 30 36 37C33 42 27 39 28 28Z" fill="${C.verde}"/>`,
    ojos: `<ellipse cx="15" cy="24" rx="10" ry="12" fill="${C.crema}"/><ellipse cx="33" cy="24" rx="10" ry="12" fill="${C.crema}"/>
      <circle cx="17" cy="27" r="4.4" fill="${C.ink}"/><circle cx="35" cy="27" r="4.4" fill="${C.ink}"/>`,
    cerebro: `<path d="M24 8C18 4 8 8 9 16C4 18 4 28 10 30C10 37 18 40 24 36C30 40 38 37 38 30C44 28 44 18 39 16C40 8 30 4 24 8Z" fill="#E98CCB"/>
      <path d="M24 8V36M15 17C18 18 19 21 17 24M33 17C30 18 29 21 31 24" stroke-width="2.2"/>`,
    // Cualidades y categorías de la mariposa
    valiente: `<path d="M24 5L29 18L43 19L32 28L36 42L24 34L12 42L16 28L5 19L19 18Z" fill="${C.sol}"/>`,
    alegre: `<path d="M5 37C5 17 43 17 43 37" stroke="${C.rosa}" stroke-width="5.5"/><path d="M12 37C12 25 36 25 36 37" stroke="${C.sol}" stroke-width="5.5"/>
      <path d="M19 37C19 32 29 32 29 37" stroke="${C.rio}" stroke-width="5.5"/>`,
    girasol: `<path d="M24 28V44M24 38C18 38 15 35 14 31C20 31 24 33 24 38Z" fill="${C.verde}"/>
      <path d="M24 3L28 10L36 8L35 16L43 19L37 25L41 32L33 32L30 39L24 34L18 39L15 32L7 32L11 25L5 19L13 16L12 8L20 10Z" fill="${C.sol}"/>
      <circle cx="24" cy="21" r="7" fill="${C.cafe}"/>`,
    cohete: `<path d="M24 3C33 9 35 21 32 33H16C13 21 15 9 24 3Z" fill="${C.crema}"/><circle cx="24" cy="17" r="4.5" fill="${C.rio}"/>
      <path d="M16 26L8 37L17 34ZM32 26L40 37L31 34Z" fill="${C.rosa}"/><path d="M20 35L24 45L28 35Z" fill="${C.sol}"/>`,
  });
})();
