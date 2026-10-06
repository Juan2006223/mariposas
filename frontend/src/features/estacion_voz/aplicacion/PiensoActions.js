// frontend/src/features/estacion_voz/aplicacion/PiensoActions.js
(function () {
  function openPiensoLevel(n) {
    if (!window.pienso) window.pienso = { level: null, unlocked: new Set([1]), completed: new Set(), badges: [] };
    window.pienso.level = n;
    if (typeof window.render === 'function') window.render();
  }

  function stopPiensoAudio() {
    const audio = document.getElementById('piensoAudio');
    if (audio) audio.pause();
    window.piensoAudioPlaying = false;
  }

  function togglePiensoAudio() {
    const icon = document.getElementById('piensoPlayIcon');
    let audio = document.getElementById('piensoAudio');
    if (!audio) {
      audio = document.createElement('audio');
      audio.id = 'piensoAudio';
      audio.src = window.PIENSO_TESTIMONY_AUDIO_SRC || '';
      audio.style.display = 'none';
      audio.onended = () => {
        window.piensoAudioPlaying = false;
        const ic = document.getElementById('piensoPlayIcon');
        if (ic) ic.innerText = '▶';
      };
      document.body.appendChild(audio);
    }
    if (window.piensoAudioPlaying) {
      audio.pause();
      window.piensoAudioPlaying = false;
      if (icon) icon.innerText = '▶';
      return;
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (typeof window.stopCharacterAudio === 'function') window.stopCharacterAudio();
    if (typeof window.stopConozcoAudio === 'function') window.stopConozcoAudio();
    audio.play().catch(() => {});
    window.piensoAudioPlaying = true;
    if (icon) icon.innerText = '⏸';
  }

  function selChipLevel1(el) {
    el.parentElement.querySelectorAll('.chip').forEach((c) => c.classList.remove('sel', 'chip-correct', 'chip-wrong'));
    const isCorrect = el.innerText.trim() === 'Desapareció una quebrada';
    el.classList.add('sel', isCorrect ? 'chip-correct' : 'chip-wrong');
    if (isCorrect) {
      if (typeof window.playChime === 'function') window.playChime();
      const btn = document.getElementById('level1ContinueBtn');
      if (btn) btn.style.display = 'block';
    } else {
      if (typeof window.playErrorSound === 'function') window.playErrorSound();
      setTimeout(() => el.classList.remove('chip-wrong'), 450);
    }
  }

  function selChipLevel2(el) {
    el.parentElement.querySelectorAll('.chip').forEach((c) => c.classList.remove('sel', 'chip-correct', 'chip-wrong'));
    const isCorrect = el.innerText.trim() === 'Cambió el paisaje del barrio';
    el.classList.add('sel', isCorrect ? 'chip-correct' : 'chip-wrong');
    if (isCorrect) {
      if (typeof window.playChime === 'function') window.playChime();
      const btn = document.getElementById('level2ContinueBtn');
      if (btn) btn.style.display = 'block';
    } else {
      if (typeof window.playErrorSound === 'function') window.playErrorSound();
      setTimeout(() => el.classList.remove('chip-wrong'), 450);
    }
  }

  function selChipLevel3(el) {
    el.parentElement.querySelectorAll('.chip').forEach((c) => c.classList.remove('sel', 'chip-correct', 'chip-wrong'));
    const isCorrect = el.innerText.trim() === 'La llegada del acueducto';
    el.classList.add('sel', isCorrect ? 'chip-correct' : 'chip-wrong');
    if (isCorrect) {
      if (typeof window.playChime === 'function') window.playChime();
      const btn = document.getElementById('level3ContinueBtn');
      if (btn) btn.style.display = 'block';
    } else {
      if (typeof window.playErrorSound === 'function') window.playErrorSound();
      setTimeout(() => el.classList.remove('chip-wrong'), 450);
    }
  }

  function selMatch(el) {
    if (el.classList.contains('matched')) return;
    if (!window.matchSelected) {
      el.classList.add('sel');
      window.matchSelected = el;
      return;
    }
    if (window.matchSelected === el) {
      el.classList.remove('sel');
      window.matchSelected = null;
      return;
    }
    if (window.matchSelected.dataset.side === el.dataset.side) {
      window.matchSelected.classList.remove('sel');
      el.classList.add('sel');
      window.matchSelected = el;
      return;
    }
    const mariposaEl = window.matchSelected.dataset.side === 'mariposa' ? window.matchSelected : el;
    const plantaEl = window.matchSelected.dataset.side === 'planta' ? window.matchSelected : el;
    const fb = document.getElementById('matchFeedback');
    mariposaEl.classList.remove('sel');
    if (mariposaEl.dataset.match === plantaEl.dataset.id) {
      mariposaEl.classList.add('matched');
      plantaEl.classList.add('matched');
      window.matchCorrectCount = (window.matchCorrectCount || 0) + 1;
      if (typeof window.playChime === 'function') window.playChime();
      if (window.matchCorrectCount >= 3) {
        if (fb) fb.innerText = '¡Uniste las 3 mariposas con su planta! Cada especie depende de un lugar y una planta específica para sobrevivir.';
        const btn = document.getElementById('matchCompleteBtn');
        if (btn) btn.style.display = 'block';
      } else if (fb) {
        const explains = window.PIENSO_MATCH_EXPLAIN || (window.VozData && window.VozData.PIENSO_MATCH_EXPLAIN) || {};
        fb.innerText = (explains[plantaEl.dataset.id] || '¡Correcto!') + ` (${window.matchCorrectCount} de 3 emparejadas)`;
      }
    } else {
      mariposaEl.classList.add('wrong');
      plantaEl.classList.add('wrong');
      if (typeof window.playErrorSound === 'function') window.playErrorSound();
      if (fb) fb.innerText = 'Esa pareja no es correcta. Cada mariposa vive cerca de una planta distinta: inténtalo de nuevo.';
      setTimeout(() => {
        mariposaEl.classList.remove('wrong');
        plantaEl.classList.remove('wrong');
      }, 500);
    }
    window.matchSelected = null;
  }

  // Compatibilidad global requerida
  window.openPiensoLevel = openPiensoLevel;
  window.stopPiensoAudio = stopPiensoAudio;
  window.togglePiensoAudio = togglePiensoAudio;
  window.selChipLevel1 = selChipLevel1;
  window.selChipLevel2 = selChipLevel2;
  window.selChipLevel3 = selChipLevel3;
  window.selMatch = selMatch;

  window.PiensoActions = {
    openPiensoLevel,
    stopPiensoAudio,
    togglePiensoAudio,
    selChipLevel1,
    selChipLevel2,
    selChipLevel3,
    selMatch
  };
})();
