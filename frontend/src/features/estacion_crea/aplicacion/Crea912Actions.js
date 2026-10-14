// frontend/src/features/estacion_crea/aplicacion/Crea912Actions.js
(function () {
  function creaNext(total) {
    window._creaStep = Math.min((window._creaStep ?? 0) + 1, total - 1);
    if (typeof window.render === 'function') window.render();
  }

  function captureCreation(total) {
    window._creaName = (document.getElementById('butName') && document.getElementById('butName').value) || 'Mi mariposa';
    window._creaMsg = (document.getElementById('butMsg') && document.getElementById('butMsg').value) || '';
    const qualityEl = document.querySelector('#creaQualityRow .chip.sel');
    const catEl = document.querySelector('#creaCategoryRow .chip.sel');
    window._creaQuality = qualityEl ? qualityEl.innerText.trim() : '';
    window._creaCategory = catEl ? catEl.innerText.trim() : '';
    creaNext(total);
  }

  function rotateCreation(val) {
    window._creaRotate = val;
    const stage = document.getElementById('viewerStage');
    if (stage) stage.style.transform = `perspective(600px) rotateY(${val}deg)`;
  }

  function revealSymbol() {
    const el = document.getElementById('symbolReveal');
    if (el) el.innerText = window._creaMsg ? `Este símbolo representa: "${window._creaMsg}"` : 'Aún no escribiste tu mensaje.';
  }

  async function joinMural() {
    if (window._creaJoined) {
      window._creaStep = 5;
      if (typeof window.render === 'function') window.render();
      return;
    }
    const artifact = {
      type: 'image',
      src: window._creaImg,
      name: `${window.userName || ''} ${window.userLastName || ''}`.trim(),
      avatar: window.userAvatar || 'mariposa',
      butterflyName: window._creaName || 'Mi mariposa',
      quality: window._creaQuality || '',
      category: window._creaCategory || '',
      message: window._creaMsg || '',
    };
    const saved = typeof window.saveMuralArtifact === 'function'
      ? await window.saveMuralArtifact('dibujo', artifact)
      : null;
    if (!saved || !saved.success) return;
    if (!window.muralButterflies) window.muralButterflies = [];
    window.muralButterflies.push(artifact);
    window._creaJoined = true;
    window._creaStep = 5;
    if (typeof window.render === 'function') window.render();
  }

  async function captureAndPublishDirect912() {
    if (window._publish912State === 'saving' || window._publish912State === 'done') return;
    const btn = document.getElementById('publishDirectBtn912');
    const status = document.getElementById('publishDirectStatus912');
    const updateBtn = (text, disabled) => {
      if (!btn) return;
      btn.innerText = text;
      btn.disabled = disabled;
    };
    const updateStatus = (text, isError = false) => {
      if (!status) return;
      status.innerText = text;
      status.style.color = isError ? 'var(--rosa)' : 'var(--ink-soft)';
    };

    updateBtn('Publicando…', true);
    updateStatus('Tomando foto del lienzo...');
    window._publish912State = 'saving';

    const img = typeof window.captureCanvasImage === 'function' ? window.captureCanvasImage() : null;
    if (!img) {
      updateBtn('Reintentar publicación', false);
      updateStatus('No se pudo capturar el dibujo.', true);
      window._publish912State = 'idle';
      return;
    }
    window._creaImg = img;
    captureCreation();

    updateStatus('Guardando en Cloudinary y Neon...');
    const prevJoined = window._creaJoined;
    await joinMural();

    if (!window._creaJoined || window._creaJoined === prevJoined) {
      updateBtn('Reintentar publicación', false);
      updateStatus('No se guardó. Revisa la conexión e intenta otra vez.', true);
      window._publish912State = 'idle';
      return;
    }

    window._publish912State = 'done';
    updateBtn('Creación publicada', true);
    updateStatus('¡Creación publicada con éxito!');
  }

  function goToMuralFromCreation() {
    window._muralTab = 'mariposas';
    if (typeof window.setStation === 'function') window.setStation(5);
  }

  function creaGoNext() {
    if (window.CreaState && typeof window.CreaState.reset912 === 'function') {
      window.CreaState.reset912();
    } else {
      window._creaStep = 0;
      window._creaImg = null;
      window._creaName = null;
      window._creaQuality = null;
      window._creaCategory = null;
      window._creaMsg = null;
      window._creaRotate = 0;
      window._creaJoined = false;
    }
    if (typeof window.setStation === 'function') window.setStation(3);
  }

  // Compatibilidad global
  window.creaNext = creaNext;
  window.captureCreation = captureCreation;
  window.rotateCreation = rotateCreation;
  window.revealSymbol = revealSymbol;
  window.joinMural = joinMural;
  window.captureAndPublishDirect912 = captureAndPublishDirect912;
  window.goToMuralFromCreation = goToMuralFromCreation;
  window.creaGoNext = creaGoNext;

  window.Crea912Actions = {
    creaNext,
    captureCreation,
    rotateCreation,
    revealSymbol,
    joinMural,
    captureAndPublishDirect912,
    goToMuralFromCreation,
    creaGoNext,
  };
})();
