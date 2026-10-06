// frontend/src/features/estacion_voz/infraestructura/loader.js
(function () {
  const scripts = [
    'src/features/estacion_voz/infraestructura/ui/VozIcons.js',
    'src/features/estacion_voz/dominio/VozData.js',
    'src/features/estacion_voz/dominio/VozState.js',
    'src/features/estacion_voz/aplicacion/VozActions.js',
    'src/features/estacion_voz/aplicacion/PiensoActions.js',
    'src/features/estacion_voz/aplicacion/PiensoChainActions.js',
    'src/features/estacion_voz/infraestructura/ui/Abrazo68View.js',
    'src/features/estacion_voz/infraestructura/ui/Pienso912View.js'
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
      console.error('Failed loading estacion_voz script:', scripts[index], e);
      loadSequentially(index + 1, onComplete);
    };
    document.body.appendChild(script);
  }

  window.loadEstacionVoz = function (onComplete) {
    loadSequentially(0, onComplete);
  };
})();
