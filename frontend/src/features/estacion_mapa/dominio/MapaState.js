// frontend/src/features/estacion_mapa/dominio/MapaState.js
/**
 * Estado observable/reactivo para Estación 4.
 */
(function () {
  const mapVisited = (typeof window !== 'undefined' && window.mapVisited) || new Set();
  let mapFavIdx = (typeof window !== 'undefined' && window.mapFavIdx !== undefined) ? window.mapFavIdx : null;

  const placesVisited = (typeof window !== 'undefined' && window.placesVisited) || new Set();
  let exploroStage = (typeof window !== 'undefined' && window.exploroStage) || 'map';
  let favoritePlaceIdx = (typeof window !== 'undefined' && window.favoritePlaceIdx !== undefined) ? window.favoritePlaceIdx : null;

  if (typeof window !== 'undefined') {
    window.mapVisited = mapVisited;
    window.mapFavIdx = mapFavIdx;
    window.placesVisited = placesVisited;
    window.exploroStage = exploroStage;
    window.favoritePlaceIdx = favoritePlaceIdx;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { mapVisited, mapFavIdx, placesVisited, exploroStage, favoritePlaceIdx };
  }
})();
