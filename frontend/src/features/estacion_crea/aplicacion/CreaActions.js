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

  // Compatibilidad global
  window.pickColor = pickColor;
  window.paintZone = paintZone;
  window.triggerZoneJump = triggerZoneJump;
  window.selLand = selLand;

  window.CreaActions = {
    pickColor,
    paintZone,
    triggerZoneJump,
    selLand,
  };
})();
