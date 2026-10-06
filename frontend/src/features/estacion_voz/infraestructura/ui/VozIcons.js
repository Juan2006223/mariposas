// frontend/src/features/estacion_voz/infraestructura/ui/VozIcons.js
// Iconos propios de la estación Voz/Pienso: misiones, pistas, huellas y reconocimientos.
(function () {
  const C = { sol: '#FFC857', rosa: '#D946B5', vio: '#9B4DFF', lila: '#C9A0FF', rio: '#5B6FE8', verde: '#4FB286', cafe: '#B0793F', crema: '#FFF3D6', ink: '#2A0845' };

  window.registerIcons({
    lupa: `<circle cx="20" cy="20" r="13" fill="${C.crema}"/><path d="M13 17C14 13 17 11 21 11" stroke="${C.rio}" stroke-width="2.6"/>
      <path d="M30 30L43 43" stroke="${C.cafe}" stroke-width="6.5"/>`,
    detective: `<path d="M9 21C9 8 39 8 39 21Z" fill="${C.vio}"/><rect x="4" y="20" width="40" height="5.5" rx="2.7" fill="${C.rosa}"/>
      <path d="M12 26C12 41 36 41 36 26Z" fill="${C.crema}"/><circle cx="19" cy="31" r="3.6" fill="${C.sol}"/><circle cx="29" cy="31" r="3.6" fill="${C.sol}"/>
      <path d="M22.6 31H25.4M24 34V36"/>`,
    auricular: `<path d="M9 28V24C9 10 39 10 39 24V28" stroke-width="3.2"/><rect x="5" y="25" width="10" height="16" rx="5" fill="${C.rosa}"/>
      <rect x="33" y="25" width="10" height="16" rx="5" fill="${C.rosa}"/><path d="M24 14V20M20 17V20M28 17V20" stroke="${C.sol}" stroke-width="2.4"/>`,
    rompecabezas: `<path d="M7 14H19C16 8 21 4 24 4C27 4 32 8 29 14H38V21C44 18 47 22 47 26C47 30 44 34 38 31V43H7Z" fill="${C.sol}"/>
      <path d="M15 24C17 22 21 22 23 24" stroke-width="2"/>`,
    pergamino: `<path d="M13 8H37V36C37 41 40 43 40 43H15C11 43 11 39 11 37V10C11 8 12 8 13 8Z" fill="${C.crema}"/>
      <path d="M17 17H31M17 24H31M17 31H27" stroke="${C.vio}" stroke-width="2.4"/><path d="M13 8C9 8 9 13 13 13" />`,
    construccion: `<path d="M10 43V7H36" stroke-width="4"/><path d="M10 14L22 7M10 22L28 7" stroke-width="2"/><path d="M33 7V22"/>
      <rect x="26" y="22" width="14" height="10" rx="2.5" fill="${C.sol}"/><rect x="5" y="40" width="16" height="5" rx="2.5" fill="${C.rosa}"/>`,
    trofeo: `<path d="M14 5H34V18C34 25 29 30 24 30C19 30 14 25 14 18Z" fill="${C.sol}"/><path d="M14 10H8C8 18 10 21 15 22M34 10H40C40 18 38 21 33 22"/>
      <path d="M24 30V37"/><rect x="15" y="37" width="18" height="6" rx="3" fill="${C.cafe}"/><path d="M19 11V17" stroke="${C.crema}" stroke-width="2.6"/>`,
    uvas: `<path d="M24 6C24 12 27 14 33 13M24 6C20 4 17 6 16 10" stroke="${C.verde}" stroke-width="3"/>
      <circle cx="16" cy="19" r="5.6" fill="${C.vio}"/><circle cx="29" cy="19" r="5.6" fill="${C.vio}"/><circle cx="22.5" cy="28" r="5.6" fill="${C.vio}"/>
      <circle cx="11" cy="29" r="5.6" fill="${C.vio}"/><circle cx="34" cy="29" r="5.6" fill="${C.vio}"/><circle cx="23" cy="38" r="5.6" fill="${C.vio}"/>`,
    planta: `<path d="M24 44C24 32 24 20 26 6" stroke="${C.verde}" stroke-width="3"/>
      <path d="M24 34C15 34 9 30 8 22C16 22 23 26 24 34Z" fill="${C.verde}"/><path d="M25 25C25 16 31 11 39 11C40 19 34 25 25 25Z" fill="#7FD6A8"/>
      <path d="M25 40C32 40 37 37 38 31C31 31 26 34 25 40Z" fill="${C.verde}"/>`,
  });
})();
