(function () {
  const scripts = [
    'src/features/mural_digital/infraestructura/ui/MuralIcons.js',
    'src/features/mural_digital/dominio/MuralState.js',
    'src/features/mural_digital/aplicacion/MuralActions.js',
    'src/features/mural_digital/infraestructura/ui/MuralView.js',
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

  window.loadMuralDigital = function (onComplete) {
    loadSequentially(0, onComplete);
  };
})();
