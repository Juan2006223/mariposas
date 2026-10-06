(function () {
  function getItems() {
    if (window.GaleriaTerritorioData && typeof window.GaleriaTerritorioData.getItems === 'function') {
      return window.GaleriaTerritorioData.getItems();
    }
    return window.GALERIA_TERRITORIO || [];
  }

  function openGalleryModal(index) {
    const items = getItems();
    const g = items[index];
    if (!g) return;

    const title = document.getElementById('galleryModalTitle');
    const media = document.getElementById('galleryModalMedia');
    const text = document.getElementById('galleryModalText');

    if (title) title.innerText = g.title || '';
    if (media) {
      media.innerHTML = `<img src="${g.img || ''}" style="width:100%; border-radius:12px; display:block;" alt="${g.title || ''}">`;
    }
    if (text) text.innerText = g.caption || '';

    const modal = document.getElementById('galleryModal');
    if (modal) modal.classList.add('show');
  }

  function closeGalleryModal() {
    const modal = document.getElementById('galleryModal');
    if (modal) modal.classList.remove('show');
  }

  // Compatibilidad global en window
  window.openGalleryModal = openGalleryModal;
  window.closeGalleryModal = closeGalleryModal;

  window.GaleriaTerritorioActions = {
    openGalleryModal,
    closeGalleryModal,
  };
})();
