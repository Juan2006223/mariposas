(function () {
  window.API_BASE = 'https://mariposas-production.up.railway.app/api';

  const shellScripts = [
    'dominio/AppAudioData.js',
    'dominio/AppState.js',
    'dominio/Station1Data.js',
    'aplicacion/PersistenceActions.js',
    'aplicacion/NavigationActions.js',
    'aplicacion/AudioLifecycleActions.js',
    'aplicacion/Station1Actions.js',
    'infraestructura/ui/AppShellView.js',
  ].map((f) => 'src/features/app_shell/' + f);

  const sliceLoaders = [
    ['src/features/app_assets/infraestructura/loader.js', 'loadAppAssets'],
    ['src/features/mural_digital/infraestructura/loader.js', 'loadMuralDigital'],
    ['src/features/galeria_territorio/infraestructura/loader.js', 'loadGaleriaTerritorio'],
    ['src/features/estacion_mapa/infraestructura/loader.js', 'loadEstacionMapa'],
    ['src/features/estacion_crea/infraestructura/loader.js', 'loadEstacionCrea'],
    ['src/features/estacion_voz/infraestructura/loader.js', 'loadEstacionVoz'],
  ];

  function loadScript(src, onload, onerror) {
    const script = document.createElement('script');
    script.src = src;
    if (onload) script.onload = onload;
    if (onerror) script.onerror = onerror;
    document.body.appendChild(script);
  }

  function loadSequential(srcs, done) {
    if (!srcs.length) return done();
    const next = () => loadSequential(srcs.slice(1), done);
    loadScript(srcs[0], next, () => {
      console.error('Failed loading script:', srcs[0]);
      next();
    });
  }

  function loadSlice(index, done) {
    if (index >= sliceLoaders.length) return done();
    const [src, fn] = sliceLoaders[index];
    loadScript(src, () => {
      const next = () => loadSlice(index + 1, done);
      if (typeof window[fn] === 'function') window[fn](next);
      else next();
    });
  }

  function trackStationVisit(n) {
    if (!window.ApiClient || !window.ApiClient.guardarProgreso) return;
    const run = async () => {
      const profile = window.profileSavePromise ? await window.profileSavePromise : null;
      if (!window.userId && profile && profile.success && profile.data) window.userId = profile.data.id;
      if (!window.userId) return;
      const result = await ApiClient.guardarProgreso({
        ninoId: window.userId,
        estacionNum: Number(n),
        nombreEstacion: `Estación ${n}`,
        datosActividad: { evento: 'VISITA_ESTACION', grupo: window.userGroup || '' },
        completado: false,
      });
      if (!result || !result.success) {
        showPersistenceNotice((result && result.error) || 'No se pudo guardar la actividad en Neon.', true);
      }
    };
    run();
  }

  function wireStationTelemetry() {
    const originalSetStation = window.setStation;
    window.setStation = function (n) {
      if (typeof originalSetStation === 'function') originalSetStation(n);
      trackStationVisit(n);
    };
  }

  // app_shell (estado/acciones) -> app_assets -> mural_digital -> galeria_territorio
  // -> estacion_mapa -> estacion_crea -> estacion_voz -> render
  loadSequential(shellScripts, () => {
    wireStationTelemetry();
    loadScript('src/services/ApiClient.js', () => hydrateMuralFromApi());
    loadScript('src/components/OnboardingModal.js', () => {
      if (typeof renderOnboardingModal === 'function') renderOnboardingModal();
    });
    loadScript('src/components/AdminDashboardV2.js');
    loadSlice(0, () => {
      if (typeof window.render === 'function') window.render();
    });
  });
})();
