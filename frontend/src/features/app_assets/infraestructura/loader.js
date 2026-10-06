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
    // Descarga en paralelo y ejecuta en orden (async=false): evita una ida y vuelta por archivo
    let pending = scripts.length - index;
    if (pending <= 0) {
      if (typeof onComplete === 'function') onComplete();
      return;
    }
    const done = () => {
      pending -= 1;
      if (pending === 0 && typeof onComplete === 'function') onComplete();
    };
    scripts.slice(index).forEach((src) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.onload = done;
      script.onerror = (e) => {
        console.error('Failed loading script:', src, e);
        done();
      };
      document.body.appendChild(script);
    });
  }

  window.loadAppAssets = function (onComplete) {
    loadSequentially(0, onComplete);
  };
})();
