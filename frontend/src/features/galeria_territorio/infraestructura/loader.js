(function () {
  const scripts = [
    'src/features/galeria_territorio/infraestructura/ui/GaleriaIcons.js',
    'src/features/galeria_territorio/dominio/GaleriaTerritorioData.js',
    'src/features/galeria_territorio/aplicacion/GaleriaTerritorioActions.js',
    'src/features/galeria_territorio/infraestructura/ui/GaleriaTerritorioView.js',
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

  window.loadGaleriaTerritorio = function (onComplete) {
    loadSequentially(0, onComplete);
  };
})();
