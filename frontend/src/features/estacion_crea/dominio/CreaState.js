// frontend/src/features/estacion_crea/dominio/CreaState.js
(function () {
  // Estado 6-8
  const defaultColors = () => ({
    ...(window.defaultZoneColors68 || (window.CreaPaletteData && window.CreaPaletteData.DEFAULT_ZONE_COLORS_68) || {}),
  });

  window.currentColor68 = window.currentColor68 || '#9B4DFF';
  window.zonesPainted = window.zonesPainted || new Set();
  window.zoneColorMap = window.zoneColorMap || defaultColors();
  window.selectedLanding68 = window.selectedLanding68 || '';

  // Estado 9-12 lienzo
  window.ctx = window.ctx || null;
  window.drawing = window.drawing || false;
  window.brushColor = window.brushColor || '#9B4DFF';
  window.brushSize = window.brushSize || 7;
  window.brushMode = window.brushMode || 'round';
  window.erasing = window.erasing || false;
  window.strokeHistory = window.strokeHistory || [];

  // Pasos de creación 9-12
  window._creaStep = window._creaStep ?? 0;
  window._creaImg = window._creaImg || null;
  window._creaName = window._creaName || null;
  window._creaQuality = window._creaQuality || null;
  window._creaCategory = window._creaCategory || null;
  window._creaMsg = window._creaMsg || null;
  window._creaRotate = window._creaRotate || 0;
  window._creaJoined = window._creaJoined || false;

  window.CreaState = {
    reset68() {
      window.zonesPainted = new Set();
      window.zoneColorMap = defaultColors();
      window.selectedLanding68 = '';
      window.currentColor68 = '#9B4DFF';
    },
    reset912() {
      window._creaStep = 0;
      window._creaImg = null;
      window._creaName = null;
      window._creaQuality = null;
      window._creaCategory = null;
      window._creaMsg = null;
      window._creaRotate = 0;
      window._creaJoined = false;
    },
  };
})();
