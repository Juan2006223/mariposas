// frontend/src/features/estacion_crea/aplicacion/CreaActions.js
(function () {
  function pickColor(el, color) {
    document.querySelectorAll('.color-blob').forEach((b) => b.classList.remove('sel'));
    if (el) el.classList.add('sel');
    window.currentColor68 = color;
    const soundEl = document.getElementById('soundHint');
    if (soundEl) {
      const sounds = window.soundBySon || (window.CreaPaletteData && window.CreaPaletteData.SOUND_BY_SON) || {};
      soundEl.innerHTML = miIcon('nota') + ' ' + (sounds[color] || 'sonido: color mágico');
    }
  }

  function triggerZoneJump(svg) {
    if (!svg) return;
    svg.classList.remove('zone-jump');
    void svg.offsetWidth;
    svg.classList.add('zone-jump');
  }

  function paintZone(id) {
    const z = document.getElementById(id);
    if (!z) return;
    const color = window.currentColor68 || '#9B4DFF';
    z.setAttribute('fill', color);
    if (!window.zoneColorMap) window.zoneColorMap = {};
    window.zoneColorMap[id] = color;

    const svg = document.getElementById('butterflySvg');
    if (!window.zonesPainted) window.zonesPainted = new Set();
    if (window.zonesPainted.size === 0 && svg) {
      svg.classList.remove('idle-shiver');
    }
    window.zonesPainted.add(id);

    const total = (svg && svg.querySelectorAll('.zone').length) || window.ZONE_TOTAL_68 || 13;
    const prog = document.getElementById('zoneProg');
    if (prog) prog.innerText = `${window.zonesPainted.size} de ${total} partes pintadas`;

    triggerZoneJump(svg);

    if (window.zonesPainted.size >= total && svg) {
      svg.classList.add('flying');
      setTimeout(() => {
        svg.classList.remove('flying');
        const landing = document.getElementById('landingBlock');
        if (landing) landing.style.display = 'block';
      }, 1700);
    }
  }

  async function selLand(el) {
    document.querySelectorAll('.landing-spot').forEach((s) => s.classList.remove('sel'));
    if (el) el.classList.add('sel');
    window.selectedLanding68 = el ? el.innerText : '';
    const block = document.getElementById('saveButterflyBlock68');
    const status = document.getElementById('saveButterflyStatus68');
    if (block) block.style.display = 'block';
    if (status) status.innerText = 'Listo. Ahora toma la foto para guardarla en el mural.';
  }

  function captureButterflySvg68() {
    return new Promise((resolve, reject) => {
      const svg = document.getElementById('butterflySvg');
      if (!svg) {
        reject(new Error('No se encontró la mariposa.'));
        return;
      }
      const clone = svg.cloneNode(true);
      clone.classList.remove('idle-shiver', 'zone-jump', 'flying');
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      const svgText = new XMLSerializer().serializeToString(clone);
      const url = URL.createObjectURL(new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' }));
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 680;
        canvas.height = 544;
        const c = canvas.getContext('2d');
        c.fillStyle = '#241242';
        c.fillRect(0, 0, canvas.width, canvas.height);
        c.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('No se pudo tomar la foto de la mariposa.'));
      };
      img.src = url;
    });
  }

  async function publishPaintedButterfly68(btn) {
    if (!window.selectedLanding68) {
      if (typeof window.showPersistenceNotice === 'function') {
        window.showPersistenceNotice('Elige primero dónde aterriza tu mariposa.', true);
      }
      return;
    }
    if (btn) {
      btn.disabled = true;
      btn.innerText = 'Tomando foto y publicando...';
    }
    const status = document.getElementById('saveButterflyStatus68');
    if (status) status.innerText = 'Tomando foto de tu mariposa pintada...';
    let src;
    try {
      src = await captureButterflySvg68();
    } catch (e) {
      if (typeof window.showPersistenceNotice === 'function') {
        window.showPersistenceNotice(e.message || 'No se pudo tomar la foto de la mariposa.', true);
      }
      if (btn) {
        btn.disabled = false;
        btn.innerText = 'Tomar foto y publicar mi mariposa';
      }
      return;
    }
    const artifact = {
      type: 'image',
      src,
      name: `${window.userName || ''} ${window.userLastName || ''}`.trim(),
      avatar: window.userAvatar || 'mariposa',
      butterflyName: 'Mi mariposa pintada',
      category: 'Mariposa 6-8',
      message: `Aterriza en ${window.selectedLanding68}`,
      place: window.selectedLanding68,
      colors: { ...(window.zoneColorMap || {}) },
    };
    const saved = typeof window.saveMuralArtifact === 'function'
      ? await window.saveMuralArtifact('mariposa', artifact)
      : null;
    if (!saved || !saved.success) {
      if (btn) {
        btn.disabled = false;
        btn.innerText = 'Tomar foto y publicar mi mariposa';
      }
      return;
    }
    const content = saved.data && saved.data.contenido ? saved.data.contenido : artifact;
    if (!window.muralButterflies) window.muralButterflies = [];
    window.muralButterflies.push(typeof content === 'string' ? artifact : { ...artifact, ...content });
    if (status) status.innerText = 'Mariposa publicada. Ya quedó guardada para verla después.';
    const cont = document.getElementById('continueBlock2_68');
    if (cont) cont.style.display = 'block';
  }

  // Compatibilidad global
  window.pickColor = pickColor;
  window.paintZone = paintZone;
  window.triggerZoneJump = triggerZoneJump;
  window.selLand = selLand;
  window.publishPaintedButterfly68 = publishPaintedButterfly68;
  window.captureButterflySvg68 = captureButterflySvg68;

  window.CreaActions = {
    pickColor,
    paintZone,
    triggerZoneJump,
    selLand,
    publishPaintedButterfly68,
    captureButterflySvg68,
  };
})();
