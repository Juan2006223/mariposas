// frontend/src/features/estacion_crea/infraestructura/loader.js
(function () {
  const scripts = [
    'src/features/estacion_crea/infraestructura/ui/CreaIcons.js',
    'src/features/estacion_crea/dominio/CreaPaletteData.js',
    'src/features/estacion_crea/dominio/CreaState.js',
    'src/features/estacion_crea/aplicacion/DrawingCanvasActions.js',
    'src/features/estacion_crea/aplicacion/CreaActions.js',
    'src/features/estacion_crea/aplicacion/Crea912Actions.js',
    'src/features/estacion_crea/infraestructura/ui/ButterflySvgView.js',
    'src/features/estacion_crea/infraestructura/ui/Pinta68View.js',
    'src/features/estacion_crea/infraestructura/ui/Crea912View.js',
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

  window.loadEstacionCrea = function (onComplete) {
    loadSequentially(0, onComplete);
  };
})();
