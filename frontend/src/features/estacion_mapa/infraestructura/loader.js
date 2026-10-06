// frontend/src/features/estacion_mapa/infraestructura/loader.js
(function () {
  const scripts = [
    'src/features/estacion_mapa/dominio/MapaTerritorioData.js',
    'src/features/estacion_mapa/dominio/MapaState.js',
    'src/features/estacion_mapa/aplicacion/MapaActions.js',
    'src/features/estacion_mapa/infraestructura/ui/Mapa68View.js',
    'src/features/estacion_mapa/infraestructura/ui/Exploro912View.js',
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
      console.error('Failed loading estacion_mapa script:', scripts[index], e);
      loadSequentially(index + 1, onComplete);
    };
    document.body.appendChild(script);
  }

  window.loadEstacionMapa = function (onComplete) {
    loadSequentially(0, onComplete);
  };
})();
