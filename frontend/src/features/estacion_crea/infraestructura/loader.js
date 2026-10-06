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
    if (index >= scripts.length) {
      if (typeof onComplete === 'function') onComplete();
      return;
    }
    const script = document.createElement('script');
    script.src = scripts[index];
    script.onload = () => loadSequentially(index + 1, onComplete);
    script.onerror = (e) => {
      console.error('Failed loading estacion_crea script:', scripts[index], e);
      loadSequentially(index + 1, onComplete);
    };
    document.body.appendChild(script);
  }

  window.loadEstacionCrea = function (onComplete) {
    loadSequentially(0, onComplete);
  };
})();
