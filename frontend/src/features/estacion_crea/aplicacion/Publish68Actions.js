// frontend/src/features/estacion_crea/aplicacion/Publish68Actions.js
// Captura y publicación confirmada de la mariposa pintada (6-8).
// Solo aparece en el mural cuando Cloudinary + Neon responden con éxito.
(function () {
  const BTN_LABEL = 'Tomar foto y publicar mi mariposa';
  const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());
  const notice = (msg, isError) => {
    if (typeof window.showPersistenceNotice === 'function') window.showPersistenceNotice(msg, isError);
  };
  const setStatus = (text) => {
    const el = document.getElementById('saveButterflyStatus68');
    if (el) el.innerText = text;
  };
  const setButton = (text, disabled) => {
    const btn = document.getElementById('publishButterflyBtn68');
    if (!btn) return;
    btn.innerText = text;
    btn.disabled = disabled;
  };

  // Mide cada tramo de la captura; se puede leer en consola como window.__butterflyTimings
  function captureButterflySvg68() {
    return new Promise((resolve, reject) => {
      const svg = document.getElementById('butterflySvg');
      if (!svg) {
        reject(new Error('No se encontró la mariposa.'));
        return;
      }
      const t0 = now();
      const clone = svg.cloneNode(true);
      clone.classList.remove('idle-shiver', 'zone-jump', 'flying');
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      const svgText = new XMLSerializer().serializeToString(clone);
      const url = URL.createObjectURL(new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' }));
      const t1 = now();
      const img = new Image();
      img.onload = () => {
        const t2 = now();
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 480;
        const c = canvas.getContext('2d');
        c.fillStyle = '#241242';
        c.fillRect(0, 0, canvas.width, canvas.height);
        c.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        const t3 = now();
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('No se pudo tomar la foto de la mariposa.'));
            return;
          }
          const t4 = now();
          window.__butterflyTimings = {
            serializarSvgMs: Math.round(t1 - t0), cargarImagenMs: Math.round(t2 - t1),
            dibujarCanvasMs: Math.round(t3 - t2), codificarMs: Math.round(t4 - t3),
            totalCapturaMs: Math.round(t4 - t0), bytes: blob.size,
          };
          resolve({ blob, previewUrl: URL.createObjectURL(blob) });
        }, 'image/jpeg', 0.9);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('No se pudo tomar la foto de la mariposa.'));
      };
      img.src = url;
    });
  }

  // El backend sigue recibiendo contenido.src como data URI (así sube a Cloudinary), pero se arma fuera del camino de la UI.
  function blobToDataUri(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error || new Error('No se pudo preparar la imagen.'));
      reader.readAsDataURL(blob);
    });
  }

  function readSavedContent(saved) {
    let cloud = saved.data && saved.data.contenido;
    if (typeof cloud === 'string') {
      try { cloud = JSON.parse(cloud); } catch (e) { cloud = null; }
    }
    return cloud && typeof cloud === 'object' ? cloud : {};
  }

  async function saveButterfly68(base, blob) {
    const t0 = now();
    const toDataUri = window.blobToDataUri || blobToDataUri;
    const src = await toDataUri(blob);
    const saved = typeof window.saveMuralArtifact === 'function'
      ? await window.saveMuralArtifact('mariposa', { ...base, src })
      : null;
    if (!saved || !saved.success) throw new Error('save-failed');
    const timings = window.__butterflyTimings || {};
    timings.guardarConfirmadoMs = Math.round(now() - t0);
    window.__butterflyTimings = timings;
    return { ...base, ...readSavedContent(saved) };
  }

  async function publishPaintedButterfly68() {
    if (window._publish68State === 'saving' || window._publish68State === 'done') return undefined;
    if (!window.selectedLanding68) {
      notice('Elige primero dónde aterriza tu mariposa.', true);
      return undefined;
    }
    setButton('Publicando...', true);
    setStatus('Tomando foto y guardando...');
    window._publish68State = 'saving';
    let shot;
    try {
      shot = await window.captureButterflySvg68();
    } catch (e) {
      notice(e.message || 'No se pudo tomar la foto de la mariposa.', true);
      setButton(BTN_LABEL, false);
      window._publish68State = 'idle';
      return undefined;
    }
    const base = {
      type: 'image',
      name: `${typeof userName !== 'undefined' ? userName : ''} ${typeof userLastName !== 'undefined' ? userLastName : ''}`.trim(),
      avatar: typeof userAvatar !== 'undefined' ? userAvatar : (window.userAvatar || 'mariposa'),
      butterflyName: 'Mi mariposa pintada',
      category: 'Mariposa 6-8',
      message: `Aterriza en ${window.selectedLanding68}`,
      place: window.selectedLanding68,
      colors: { ...(window.zoneColorMap || {}) },
    };
    try {
      setStatus('Guardando en Cloudinary y Neon...');
      const savedItem = await saveButterfly68(base, shot.blob);
      if (!window.muralButterflies) window.muralButterflies = [];
      window.muralButterflies.push(savedItem);
      setButton('Mariposa publicada', true);
      setStatus('Mariposa publicada. Ya quedó guardada para verla después.');
      const cont = document.getElementById('continueBlock2_68');
      if (cont) cont.style.display = 'block';
      notice('Mariposa guardada en el mural.', false);
      window._publish68State = 'done';
    } catch (e) {
      setButton(BTN_LABEL, false);
      setStatus('No se guardó. Revisa la conexión e intenta otra vez.');
      notice('No se guardó la mariposa. Intenta otra vez antes de continuar.', true);
      window._publish68State = 'idle';
    }
    if (shot.previewUrl && /^blob:/.test(shot.previewUrl) && typeof URL.revokeObjectURL === 'function') {
      setTimeout(() => URL.revokeObjectURL(shot.previewUrl), 3000);
    }
    return undefined;
  }

  window.captureButterflySvg68 = captureButterflySvg68;
  window.blobToDataUri = blobToDataUri;
  window.publishPaintedButterfly68 = publishPaintedButterfly68;
  window.Publish68Actions = { captureButterflySvg68, blobToDataUri, publishPaintedButterfly68 };
})();
