// frontend/src/features/galeria_territorio/infraestructura/ui/GaleriaIcons.js
// Iconos propios de la Galería del territorio.
(function () {
  const C = { sol: '#FFC857', rosa: '#D946B5', vio: '#9B4DFF', lila: '#C9A0FF', rio: '#5B6FE8', verde: '#4FB286', cafe: '#B0793F', crema: '#FFF3D6', ink: '#2A0845' };

  window.registerIcons({
    // Estado vacío: marco esperando su primera foto, con un brote asomando
    'vacio-galeria': `<rect x="5" y="7" width="38" height="31" rx="6" fill="${C.crema}" stroke-dasharray="4 4"/>
      <path d="M24 33V22" /><path d="M24 26C18 27 14 23 14 18C20 17 24 20 24 26Z" fill="${C.verde}"/><path d="M24 23C24 17 29 13 34 14C35 20 30 23 24 23Z" fill="#7FD6A8"/>
      <path d="M14 38L11 45M34 38L37 45"/><circle cx="37" cy="12" r="2.4" fill="${C.sol}" stroke="none"/>`,
  });
})();
