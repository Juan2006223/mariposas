// frontend/src/features/app_shell/infraestructura/ui/ShellTerritoryIcons.js
// Personajes y elementos del territorio de La Mariposa: agua, cometas, olla, brote, hilo, caritas.
(function () {
  const C = { sol: '#FFC857', rosa: '#D946B5', vio: '#9B4DFF', lila: '#C9A0FF', rio: '#5B6FE8', verde: '#4FB286', cafe: '#B0793F', crema: '#FFF3D6', ink: '#2A0845' };
  const dot = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r || 1.9}" fill="${C.ink}" stroke="none"/>`;
  const face = (inner) => `<circle cx="24" cy="24" r="18" fill="${C.sol}"/>${inner}`;

  window.registerIcons({
    // Gotín: gota-personaje
    gota: `<path d="M24 4C24 4 9 20 9 29C9 38 16 44 24 44C32 44 39 38 39 29C39 20 24 4 24 4Z" fill="${C.rio}"/>
      <path d="M15 31C15 27 17 24 19 22" stroke="${C.crema}" stroke-width="2.4"/>${dot(21, 32)}${dot(29, 32)}<path d="M21 37C23 39 27 39 29 37" stroke-width="2"/>`,
    // Brisa: cometa con cola y viento
    cometa: `<path d="M27 4L41 18L27 36L13 18Z" fill="${C.sol}"/><path d="M27 4V36M13 18H41" stroke-width="2"/>
      <path d="M27 36C23 40 31 42 26 46" stroke="${C.rosa}" stroke-width="2.5"/><path d="M4 12H10M2 20H9" stroke="${C.rio}" stroke-width="3"/>
      <path d="M23 41L19 39V44Z" fill="${C.rosa}" stroke-width="1.8"/>`,
    // Abuela Olla: olla comunitaria con vapor
    olla: `<path d="M9 23H39C39 36 33 42 24 42C15 42 9 36 9 23Z" fill="${C.cafe}"/><path d="M10 23C10 15 38 15 38 23Z" fill="${C.sol}"/>
      <circle cx="24" cy="15" r="2.6" fill="${C.rosa}" stroke-width="2"/><path d="M9 26C4 26 4 32 9 32M39 26C44 26 44 32 39 32"/>
      <path d="M17 10C15 7 19 6 17 3M25 9C23 6 27 5 25 2" stroke="${C.lila}" stroke-width="2.5"/>${dot(19, 32, 1.7)}${dot(29, 32, 1.7)}`,
    // Brotín: brote con dos hojas
    brote: `<path d="M8 43C11 35 37 35 40 43Z" fill="${C.cafe}"/><path d="M24 38V22"/>
      <path d="M24 27C14 29 8 23 8 15C18 14 24 19 24 27Z" fill="${C.verde}"/><path d="M24 22C24 12 32 6 40 7C41 16 34 22 24 22Z" fill="#7FD6A8"/>`,
    // Lanita: ovillo de lana con hebra
    ovillo: `<circle cx="22" cy="26" r="16" fill="${C.rosa}"/>
      <path d="M8 22C17 29 28 29 36 18M7 30C17 36 29 36 37 28M14 13C20 22 28 34 31 40" stroke="${C.crema}" stroke-width="2"/>
      <path d="M35 36C41 40 39 44 45 44" stroke="${C.rosa}" stroke-width="3"/>`,
    fuego: `<path d="M24 3C27 13 38 17 36 30C35 38 30 43 24 43C18 43 12 38 12 30C12 24 16 22 17 16C20 19 21 21 22 22C24 18 25 11 24 3Z" fill="#FF8A4C"/>
      <path d="M24 23C28 28 30 30 30 34C30 38 27 40 24 40C21 40 18 38 18 34C18 30 22 28 24 23Z" fill="${C.sol}"/>`,
    casa: `<path d="M9 22L24 8L39 22V41H9Z" fill="${C.crema}"/><path d="M4 25L24 6L44 25Z" fill="${C.rosa}"/>
      <path d="M20 41V31C20 27 28 27 28 31V41Z" fill="${C.cafe}"/><rect x="12" y="27" width="6" height="6" rx="1.5" fill="${C.rio}" stroke-width="2"/>
      <rect x="31" y="27" width="6" height="6" rx="1.5" fill="${C.rio}" stroke-width="2"/>`,
    vecinos: `<circle cx="17" cy="15" r="6.5" fill="${C.sol}"/><circle cx="33" cy="18" r="5.5" fill="${C.rosa}"/>
      <path d="M4 42C4 31 9 27 17 27C25 27 29 31 29 42Z" fill="${C.vio}"/><path d="M25 42C25 33 28 29 33 29C39 29 44 33 44 42Z" fill="${C.rio}"/>`,
    arbol: `<path d="M21 30V43H27V30Z" fill="${C.cafe}"/>
      <path d="M24 4C31 4 36 9 35 15C41 16 44 23 40 28C37 32 32 32 28 31H20C15 32 9 31 7 26C5 20 9 15 13 15C12 9 17 4 24 4Z" fill="${C.verde}"/>`,
    flor: `<circle cx="24" cy="11" r="6.5" fill="${C.rosa}"/><circle cx="36" cy="20" r="6.5" fill="${C.rosa}"/><circle cx="31" cy="34" r="6.5" fill="${C.rosa}"/>
      <circle cx="17" cy="34" r="6.5" fill="${C.rosa}"/><circle cx="12" cy="20" r="6.5" fill="${C.rosa}"/><circle cx="24" cy="24" r="6.5" fill="${C.sol}"/>`,
    // Caritas para "¿cómo te sentiste?"
    'carita-feliz': face(`<path d="M13 20C15 16 19 16 21 20M27 20C29 16 33 16 35 20" stroke-width="3"/><path d="M14 28C17 38 31 38 34 28Z" fill="${C.ink}"/>`),
    'carita-amor': face(`<path d="M13 22C15 18 19 18 21 22M27 22C29 18 33 18 35 22" stroke-width="3"/><circle cx="12" cy="29" r="3.6" fill="${C.rosa}" stroke="none"/>
      <circle cx="36" cy="29" r="3.6" fill="${C.rosa}" stroke="none"/><path d="M19 30C21 35 27 35 29 30" stroke-width="3"/>
      <path d="M38 6C37 3 33 4 34 8C35 10 38 12 38 12C38 12 41 10 42 8C43 4 39 3 38 6Z" fill="${C.rosa}" stroke-width="1.8"/>`),
    'carita-asombro': face(`<path d="M12 14L20 12M36 14L28 12" stroke-width="2.4"/>${dot(18, 21, 2.8)}${dot(30, 21, 2.8)}<ellipse cx="24" cy="32" rx="4.2" ry="5.4" fill="${C.ink}"/>`),
    'carita-duda': face(`<path d="M12 15L20 14M28 11L36 15" stroke-width="2.4"/>${dot(18, 21, 2.4)}${dot(30, 21, 2.4)}<path d="M16 33C19 30 22 36 25 33C28 30 30 34 32 32" stroke-width="2.6"/>`),
    'carita-triste': face(`<path d="M12 15L20 18M36 15L28 18" stroke-width="2.4"/>${dot(18, 23, 2.4)}${dot(30, 23, 2.4)}<path d="M17 35C20 29 28 29 31 35" stroke-width="2.8"/>
      <path d="M33 28C31 31 31 34 33 35C36 34 36 31 33 28Z" fill="${C.rio}" stroke-width="1.8"/>`),
  });
})();
