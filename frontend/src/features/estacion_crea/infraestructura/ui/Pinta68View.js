// frontend/src/features/estacion_crea/infraestructura/ui/Pinta68View.js
(function () {
  function station2_68() {
    window._publish68State = 'idle';
    if (window.CreaState && typeof window.CreaState.reset68 === 'function') {
      window.CreaState.reset68();
    } else {
      window.zonesPainted = new Set();
      const def = window.defaultZoneColors68 || (window.CreaPaletteData && window.CreaPaletteData.DEFAULT_ZONE_COLORS_68) || {};
      window.zoneColorMap = { ...def };
    }

    const paletteList = (window.CreaPaletteData && window.CreaPaletteData.PALETTE_COLORS_68) || [
      ['#9B4DFF', 'violeta'], ['#5B6FE8', 'rio'], ['#FFC857', 'sol'], ['#D946B5', 'rosa'],
      ['#4FB286', 'verde'], ['#B0793F', 'cafe'], ['#2FBFB0', 'turquesa'], ['#FF6F59', 'coral'],
      ['#F5EEFF', 'blanco'], ['#FF3B7A', 'fucsia'], ['#7CE7E1', 'celeste'], ['#C9F24B', 'lima'],
    ];

    const landingSpots = (window.CreaPaletteData && window.CreaPaletteData.LANDING_SPOTS_68) || [
      'Plaza Central', 'Las Primeras Casas', 'La Quebrada',
    ];

    const zoneTotal = window.ZONE_TOTAL_68 || 18;
    const svgHtml = typeof window.butterflySvg === 'function' ? window.butterflySvg() : '';

    return `
    <div class="station-title">La mariposa que cambia de humor</div>
    <div class="station-sub">Elige un color y usa el pincel sobre cada parte de la mariposa. Tiene ${zoneTotal} partes para combinar muchos colores, incluidas cabeza, antenas y cuerpo.</div>
    <div style="text-align:center; margin-bottom:8px;"><span class="action-nudge">1. Color -> 2. Pincel sobre el ala</span></div>
    <div class="paint-zone">
      ${svgHtml}
      <div class="palette" style="flex-wrap:wrap; justify-content:center; max-width:280px;">
        ${paletteList.map(([hex]) => `<button class="color-blob" style="background:${hex}" onclick="pickColor(this,'${hex}')"></button>`).join('')}
      </div>
      <div class="step-card">Usa el pincel: toca una parte oscura de la mariposa (alas, manchas, cabeza, antenas o cuerpo) para llenarla de color.</div>
      <div class="station-sub" id="soundHint" style="min-height:16px; margin-bottom:0;"></div>
      <div class="progress-mini" id="zoneProg">0 de ${zoneTotal} partes pintadas</div>
      <div class="missing-zone-hint" id="missingZoneHint68">${miIcon('ojos')} Faltan ${zoneTotal} partes. Las pendientes se marcarán con brillo.</div>
      <div id="landingBlock" style="display:none; width:100%;">
        <div class="station-sub">Tu mariposa cobró vida ${miIcon('estrella')} ¿dónde aterriza?</div>
        <div class="landing-map">
          ${landingSpots.map((spot) => `<div class="landing-spot" onclick="selLand(this)">${spot}</div>`).join('')}
        </div>
        <div id="saveButterflyBlock68" style="margin-top:14px;">
          <button class="primary-btn" id="publishButterflyBtn68" onclick="publishPaintedButterfly68(this)">Tomar foto y publicar mi mariposa</button>
          <div class="station-sub" id="saveButterflyStatus68" style="min-height:16px; margin-top:8px;"></div>
        </div>
        <div id="continueBlock2_68" style="display:none; margin-top:10px;">
          <button class="primary-btn" onclick="setStation(3)">Completar y continuar ➔</button>
        </div>
      </div>
    </div>
  `;
  }

  window.station2_68 = station2_68;
  window.Pinta68View = {
    station2_68,
  };
})();
