(function () {
  const scripts = [
    'src/features/galeria_territorio/infraestructura/ui/GaleriaIcons.js',
    'src/features/galeria_territorio/dominio/GaleriaTerritorioData.js',
    'src/features/galeria_territorio/aplicacion/GaleriaTerritorioActions.js',
    'src/features/galeria_territorio/infraestructura/ui/GaleriaTerritorioView.js',
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

  window.loadGaleriaTerritorio = function (onComplete) {
    loadSequentially(0, onComplete);
  };
})();
