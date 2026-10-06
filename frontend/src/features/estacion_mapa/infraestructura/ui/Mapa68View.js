// frontend/src/features/estacion_mapa/infraestructura/ui/Mapa68View.js
/**
 * Renderizado de Estación 4 para grupo 6-8 años.
 */
(function () {
  function station4_68() {
    const stops = window.MAPA_68_STOPS || [];
    const mapImg = typeof window !== 'undefined' && window.MAP_68_IMG ? window.MAP_68_IMG : '';

    return `
      <div class="station-title">Explora el Mapa Mariposa</div>
      <div class="station-sub">Toca los puntos brillantes del mapa para descubrir historias.</div>
      <div style="text-align:center; margin-bottom:8px;"><span class="tap-hint">Toca un punto</span></div>
      <div class="butterfly-map-wrap">
        <img src="${mapImg}" class="butterfly-map-img" alt="Mapa del territorio en forma de mariposa" />
        ${stops.map((s, i) => `<button class="map-pin map-pin-${i}" id="pin${i}" onclick="visitNode(${i})"><span class="pin-ico">${miIcon(s.ico)}</span></button>`).join('')}
      </div>
      <div class="map-dark">
        <div class="passport-row" id="passportRow">
          ${[0, 1, 2, 3].map(i => `<div class="stamp-slot" id="stampSlot${i}">?</div>`).join('')}
        </div>
        <div class="hito-text" id="hitoText">Toca un punto del mapa para comenzar el recorrido.</div>
      </div>
      <div id="favPickBlock4_68" style="display:none; margin-top:14px;">
        <div class="station-sub" style="text-align:center;">¿Cuál fue la parada que más te gustó? Elígela para dejarla en el Mural.</div>
        <div class="chip-row" id="favChips" style="justify-content:center;"></div>
      </div>
      <div id="continueBlock4_68" style="display:none; margin-top:14px;">
        <button class="primary-btn" onclick="confirmMapFootprint()">Completar y continuar ➔</button>
      </div>
    `;
  }

  if (typeof window !== 'undefined') {
    window.station4_68 = station4_68;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { station4_68 };
  }
})();
