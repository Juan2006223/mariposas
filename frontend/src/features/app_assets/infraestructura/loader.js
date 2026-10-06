// frontend/src/features/app_assets/infraestructura/loader.js
(function () {
  const scripts = [
    'src/features/app_assets/dominio/AssetKeys.js',
    'src/features/app_assets/infraestructura/GalleryAssets.js',
    'src/features/app_assets/infraestructura/MapAssets.js',
    'src/features/app_assets/infraestructura/TerritoryAssets.js',
    'src/features/app_assets/infraestructura/EmbeddedAssets.js',
  ];

  function loadSequentially(index = 0, onComplete) {
    if (index >= scripts.length) {
      if (typeof onComplete === 'function') onComplete();
      return;
    }
    const script = document.createElement('script');
    script.src = scripts[index];
    script.onload = () => loadSequentially(index + 1, onComplete);
    script.onerror = (e) => {
      console.error('Failed loading asset script:', scripts[index], e);
      loadSequentially(index + 1, onComplete);
    };
    document.body.appendChild(script);
  }

  window.loadAppAssets = function (onComplete) {
    loadSequentially(0, onComplete);
  };
})();
