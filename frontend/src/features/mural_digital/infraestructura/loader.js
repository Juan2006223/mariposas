(function () {
  const scripts = [
    'src/features/mural_digital/infraestructura/ui/MuralIcons.js',
    'src/features/mural_digital/dominio/MuralState.js',
    'src/features/mural_digital/aplicacion/MuralActions.js',
    'src/features/mural_digital/infraestructura/ui/MuralView.js',
  ];

  function loadSequentially(index = 0, onComplete) {
    if (index >= scripts.length) {
      if (typeof onComplete === 'function') onComplete();
      return;
    }
    const script = document.createElement('script');
    script.src = scripts[index];
    script.onload = () => loadSequentially(index + 1, onComplete);
    document.body.appendChild(script);
  }

  window.loadMuralDigital = function (onComplete) {
    loadSequentially(0, onComplete);
  };
})();
