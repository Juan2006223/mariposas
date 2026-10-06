// frontend/src/features/estacion_mapa/infraestructura/ui/Exploro912View.js
/**
 * Renderizado de Estación 4 para grupo 9-12 años.
 */
(function () {
  function exploroFavoriteScreen() {
    const places = window.EXPLORO_PLACES || [];
    const visited = window.placesVisited || new Set();
    const favIdx = window.favoritePlaceIdx;

    return `
      <div class="station-title">Mi lugar significativo ${miIcon('corazon')}</div>
      <div class="station-sub">De todo lo que exploraste, ¿cuál es el lugar que más te gustó o te llamó la atención?</div>
      <div class="barrio-grid">
        ${places.map((b, i) => visited.has(i) ? `<div class="barrio ${favIdx === i ? 'sel' : ''}" style="background:${b.c}" onclick="selFavoritePlace(${i})">${miIcon(b.ico)}</div>` : `<div class="barrio" style="background:var(--line); opacity:0.4;">${miIcon(b.ico)}</div>`).join('')}
      </div>
      <div class="station-sub" id="favoritePlaceLabel" style="min-height:16px; font-weight:700; color:var(--ink);"></div>
      <textarea class="input-field" id="favoriteWhy" rows="3" placeholder="¿Por qué elegiste este lugar?"></textarea>
      <button class="primary-btn" onclick="finishExploroFavorite()">Guardar mi respuesta ${miIcon('medalla')}</button>
    `;
  }

  function exploroBadgeScreen() {
    const places = window.EXPLORO_PLACES || [];
    const visited = window.placesVisited || new Set();
    const favIdx = window.favoritePlaceIdx;
    const favName = (favIdx !== null && places[favIdx]) ? places[favIdx].name : 'tu lugar favorito';

    return `
      <div class="station-title" style="text-align:center;">¡Lo lograste! ${miIcon('medalla')}</div>
      <div style="text-align:center; font-size:3.5rem; margin:14px 0;">${miIcon('medalla')}${miIcon('mariposa')}</div>
      <div class="station-sub" style="text-align:center;">Insignia de Explorador/a de La Mariposa</div>
      <div class="station-sub" style="text-align:center;">Descubriste ${visited.size} lugares del territorio y elegiste a <strong>${favName}</strong> como tu lugar significativo.</div>
      <div id="continueBlock4_912" style="margin-top:18px;">
        <button class="primary-btn" onclick="setStation(5)">Completar y continuar ➔</button>
      </div>
    `;
  }

  function station4_912() {
    if (window.exploroStage === 'favorite') return exploroFavoriteScreen();
    if (window.exploroStage === 'badge') return exploroBadgeScreen();

    const places = window.EXPLORO_PLACES || [];
    const visited = window.placesVisited || new Set();
    const mapImg = typeof window !== 'undefined' && window.EXPLORO_MAP_IMG ? window.EXPLORO_MAP_IMG : '';

    return `
      <div class="station-title">Explora La Mariposa</div>
      <div class="station-sub">Cada lugar tiene una historia por descubrir. ${miIcon('mariposa')}</div>
      <div class="exploro-map-wrap">
        <img src="${mapImg}" class="exploro-map-img" alt="Mapa del territorio con sus siete zonas" />
        ${places.map((b, i) => `<button class="exploro-pin ${visited.has(i) ? 'visited' : ''}" style="left:${b.pos.left}; top:${b.pos.top}; background:${b.c};" onclick="selBarrio(${i})">${miIcon(b.ico)}</button>`).join('')}
      </div>
      <div class="progress-bar"><div class="progress-fill" id="progFill" style="width:${Math.round(visited.size / 8 * 100)}%;"></div></div>
      <div class="station-sub" id="progText">${visited.size} de 8 lugares descubiertos</div>
      <div class="modal-panel show" id="barrioPanel">Toca un punto de interés para ver su tarjeta, su historia y reflexionar sobre él.</div>
      <div id="reflectBlockExploro" style="display:none;">
        <div class="station-sub" style="font-weight:700; color:var(--ink);" id="reflectQuestion"></div>
        <div class="chip-row">
          ${[['carita-feliz', 'Me encanta'], ['carita-duda', 'Me hace pensar'], ['pensamiento', 'Quiero saber más'], ['corazon', 'Es importante'], ['brote', 'Lo cuidaría']].map(([i, t]) => `<div class="chip" onclick="this.classList.toggle('sel')">${miIcon(i)} ${t}</div>`).join('')}
        </div>
      </div>
      <div id="favoriteBtnBlock" style="display:${visited.size >= 3 ? 'block' : 'none'}; margin-top:16px;">
        <button class="primary-btn" onclick="window.exploroStage='favorite'; if(typeof render==='function') render();">${miIcon('corazon')} Mi lugar significativo</button>
      </div>
    `;
  }

  if (typeof window !== 'undefined') {
    window.exploroFavoriteScreen = exploroFavoriteScreen;
    window.exploroBadgeScreen = exploroBadgeScreen;
    window.station4_912 = station4_912;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { exploroFavoriteScreen, exploroBadgeScreen, station4_912 };
  }
})();
