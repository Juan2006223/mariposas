(function () {
  function selMuralTab(tab) {
    if (window.MuralState && typeof window.MuralState.setActiveTab === 'function') {
      window.MuralState.setActiveTab(tab);
    } else {
      window._muralTab = tab;
    }
    if (typeof window.render === 'function') {
      window.render();
    }
  }

  function openLightbox(index) {
    const butterflies = window.MuralState && typeof window.MuralState.getButterflies === 'function'
      ? window.MuralState.getButterflies()
      : (window.muralButterflies || []);
    const b = butterflies[index];
    if (!b) return;

    const media = document.getElementById('lightboxMedia');
    if (media) {
      if (b.type === 'image') {
        media.innerHTML = `<img src="${b.src}" alt="${b.name || ''}">`;
      } else {
        const svg = window.miniButterflySvg ? window.miniButterflySvg(b.colors) : '';
        media.innerHTML = svg;
      }
    }

    const nameEl = document.getElementById('lightboxName');
    if (nameEl) {
      nameEl.innerText = (b.name || 'Anónimo/a') + (b.butterflyName ? ' — "' + b.butterflyName + '"' : '');
    }

    const extra = document.getElementById('lightboxExtra');
    if (extra) {
      let html = '';
      if (b.quality) html += `<div>${miIcon('estrella')} ${miText(b.quality)}</div>`;
      if (b.category) html += `<div>${miIcon('carpeta')} ${miText(b.category)}</div>`;
      if (b.message) html += `<div style="margin-top:6px; font-style:italic;">${miIcon('voz')} "${b.message}"</div>`;
      extra.innerHTML = html;
    }

    const lightbox = document.getElementById('lightbox');
    if (lightbox) lightbox.classList.add('show');
  }

  function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) lightbox.classList.remove('show');
  }

  window.selMuralTab = selMuralTab;
  window.openLightbox = openLightbox;
  window.closeLightbox = closeLightbox;

  window.MuralActions = {
    selMuralTab,
    openLightbox,
    closeLightbox,
  };
})();
