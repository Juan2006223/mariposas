(function () {
  function renderGalleryGrid(items) {
    if (!items || items.length === 0) {
      return `<div class="empty-state">Aún no hay fotos en la galería.<br>Muy pronto se irán agregando 📷</div>`;
    }
    const thumbs = items
      .map(
        (g, i) =>
          `<div class="gallery-thumb" onclick="openGalleryModal(${i})"><img src="${g.img || ''}" alt="${g.title || ''}"></div>`
      )
      .join('');
    return `<div class="gallery-grid">${thumbs}</div>`;
  }

  function station6() {
    const items =
      window.GaleriaTerritorioData && typeof window.GaleriaTerritorioData.getItems === 'function'
        ? window.GaleriaTerritorioData.getItems()
        : (window.GALERIA_TERRITORIO || []);

    return `
    <div class="station-title">Galería del territorio</div>
    <div class="station-sub">Fotos reales de los lugares de La Mariposa. Toca cualquiera para verla más grande. 📸</div>
    ${renderGalleryGrid(items)}
  `;
  }

  // Compatibilidad global en window
  window.station6 = station6;

  window.GaleriaTerritorioView = {
    renderGalleryGrid,
    station6,
  };
})();
