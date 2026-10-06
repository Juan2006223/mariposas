// frontend/src/features/app_shell/infraestructura/ui/ShellControlIcons.js
// Iconos de controles compartidos: audio, avance, estados y señales del recorrido.
(function () {
  const C = { sol: '#FFC857', rosa: '#D946B5', vio: '#9B4DFF', lila: '#C9A0FF', rio: '#5B6FE8', verde: '#4FB286', cafe: '#B0793F', crema: '#FFF3D6', ink: '#2A0845' };

  window.registerIcons({
    play: `<path d="M15 9C15 7 17 6 19 7L38 21C40 23 40 25 38 27L19 41C17 42 15 41 15 39Z" fill="${C.sol}"/>`,
    pause: `<rect x="10" y="9" width="10" height="30" rx="5" fill="${C.sol}"/><rect x="28" y="9" width="10" height="30" rx="5" fill="${C.sol}"/>`,
    volumen: `<path d="M5 19H13L23 10V38L13 29H5Z" fill="${C.sol}"/>
      <path d="M29 17C33 21 33 27 29 31" stroke="${C.rosa}" stroke-width="3"/><path d="M34 12C41 19 41 29 34 36" stroke="${C.rio}" stroke-width="3"/>`,
    microfono: `<rect x="16" y="4" width="16" height="26" rx="8" fill="${C.rosa}"/><path d="M21 11V19" stroke="${C.crema}" stroke-width="3"/>
      <path d="M10 23C10 33 17 38 24 38C31 38 38 33 38 23M24 38V43M17 43H31"/>`,
    flecha: `<path d="M8 24H37M26 12L38 24L26 36" stroke="currentColor" stroke-width="6"/>`,
    check: `<path d="M9 25L20 36L40 12" stroke="currentColor" stroke-width="6.5"/>`,
    listo: `<circle cx="24" cy="24" r="19" fill="${C.verde}"/><path d="M14 25L21 32L34 16" stroke="${C.crema}" stroke-width="5"/>`,
    candado: `<path d="M15 22V16C15 5 33 5 33 16V22"/><rect x="9" y="21" width="30" height="22" rx="7" fill="${C.lila}"/>
      <circle cx="24" cy="31" r="3.2" fill="${C.ink}"/><path d="M24 33V37" stroke-width="3"/>`,
    corazon: `<path d="M24 42C8 31 5 20 9 13C13 7 21 8 24 15C27 8 35 7 39 13C43 20 40 31 24 42Z" fill="${C.rosa}"/>
      <path d="M13 17C14 14 17 13 19 14" stroke="${C.crema}" stroke-width="2.5"/>`,
    huella: `<path d="M24 24C17 24 12 30 14 36C16 41 21 38 24 38C27 38 32 41 34 36C36 30 31 24 24 24Z" fill="${C.cafe}"/>
      <ellipse cx="12" cy="23" rx="3.6" ry="4.6" fill="${C.cafe}"/><ellipse cx="20" cy="14" rx="3.6" ry="4.8" fill="${C.cafe}"/>
      <ellipse cx="29" cy="14" rx="3.6" ry="4.8" fill="${C.cafe}"/><ellipse cx="37" cy="23" rx="3.6" ry="4.6" fill="${C.cafe}"/>`,
    pin: `<path d="M24 44C16 34 11 28 11 20C11 11 17 5 24 5C31 5 37 11 37 20C37 28 32 34 24 44Z" fill="${C.sol}"/><circle cx="24" cy="20" r="6" fill="${C.rosa}"/>`,
    idea: `<path d="M24 4C14 4 9 12 12 21C14 25 17 27 17 32H31C31 27 34 25 36 21C39 12 34 4 24 4Z" fill="${C.sol}"/>
      <rect x="17" y="34" width="14" height="5" rx="2.5" fill="${C.lila}"/><path d="M21 43H27M20 15C21 12 23 11 25 11" stroke-width="2.2"/>`,
    camara: `<path d="M15 14L18 8H30L33 14Z" fill="${C.lila}"/><rect x="5" y="13" width="38" height="27" rx="7" fill="${C.rio}"/>
      <circle cx="24" cy="27" r="9" fill="${C.crema}"/><circle cx="24" cy="27" r="4.5" fill="${C.vio}"/><circle cx="37" cy="19" r="2" fill="${C.sol}" stroke="none"/>`,
    pensamiento: `<path d="M12 28C5 28 4 17 11 16C11 8 22 6 26 11C31 6 41 10 38 18C45 19 44 30 36 30Z" fill="${C.crema}"/>
      <circle cx="12" cy="36" r="3.4" fill="${C.crema}"/><circle cx="6" cy="43" r="2.2" fill="${C.crema}"/>
      <path d="M17 21H31M17 25H27" stroke="${C.vio}" stroke-width="2.4"/>`,
    carpeta: `<path d="M5 14C5 11 7 9 10 9H19L23 14H38C41 14 43 16 43 19V35C43 38 41 40 38 40H10C7 40 5 38 5 35Z" fill="${C.lila}"/>
      <path d="M5 21H43"/><circle cx="24" cy="30" r="3.5" fill="${C.sol}" stroke-width="2"/>`,
    manos: `<path d="M3 20L13 16L19 30L9 34Z" fill="${C.rio}"/><path d="M45 20L35 16L29 30L39 34Z" fill="${C.rosa}"/>
      <path d="M13 17C18 14 23 15 26 18C29 15 32 15 35 17L30 30C27 35 21 35 18 30Z" fill="${C.sol}"/>
      <path d="M20 26L23 29M24 24L27 27M28 22L30 24" stroke-width="2"/>`,
  });
})();
