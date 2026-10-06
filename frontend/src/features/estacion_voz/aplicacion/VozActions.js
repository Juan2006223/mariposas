// frontend/src/features/estacion_voz/aplicacion/VozActions.js
(function () {
  function myWordsHTML() {
    const words = window.sessionWords || [];
    if (words.length === 0) return '';
    return words.map((w) => `<span class="word-pill">✨ ${w}</span>`).join('');
  }

  function renderMyWords() {
    const row = document.getElementById('myWordsRow');
    if (row) row.innerHTML = myWordsHTML();
  }

  function hugArms() {
    const svg = document.getElementById('abrazoSvg');
    if (!svg) return;
    svg.classList.remove('hugging');
    void svg.offsetWidth;
    svg.classList.add('hugging');
  }

  function reopenArms() {
    const svg = document.getElementById('abrazoSvg');
    if (svg) svg.classList.remove('hugging');
  }

  function updateJarUI() {
    const list = window.muralVoices || [];
    const jarLights = document.getElementById('jarLights');
    if (jarLights) {
      jarLights.innerHTML = list.map(() => '<div class="firefly"></div>').join('') || '<span class="hint">Aún no hay voces</span>';
    }
    const jarLabel = document.querySelector('.jar .station-sub');
    if (jarLabel) jarLabel.innerText = `Frasco colectivo (${list.length} voces)`;
    if (list.length > 0 && !document.getElementById('continueBlock3_68')) {
      const zone = document.querySelector('.abrazo-zone');
      if (zone) {
        const div = document.createElement('div');
        div.id = 'continueBlock3_68';
        div.style.marginTop = '14px';
        div.innerHTML = `<button class="primary-btn" onclick="setStation(4)">Completar y continuar ➔</button>`;
        zone.appendChild(div);
      }
    }
  }

  function showWordPicker() {
    const status = document.getElementById('recStatus');
    const picker = document.getElementById('wordPicker');
    if (!status || !picker) return;
    const palabras = window.palabrasSimuladas || (window.VozData && window.VozData.PALABRAS_SIMULADAS) || [];
    status.innerText = '¿Cuál de estas fue la palabra que dijiste?';
    picker.style.display = 'flex';
    picker.innerHTML = palabras.map((p) => `<div class="chip" onclick="pickSpokenWord('${p}')">${p}</div>`).join('');
  }

  function pickSpokenWord(word) {
    const picker = document.getElementById('wordPicker');
    if (picker) {
      picker.style.display = 'none';
      picker.innerHTML = '';
    }
    if (!window.sessionWords) window.sessionWords = [];
    window.sessionWords.push(word);
    renderMyWords();
    launchFirefly(word);
  }

  function startVoiceSim() {
    const micBtn = document.getElementById('micBtn');
    const wave = document.getElementById('recWave');
    const status = document.getElementById('recStatus');
    if (!micBtn || window.micBusy) return;
    window.micBusy = true;
    micBtn.disabled = true;
    micBtn.classList.add('active');
    wave.style.display = 'flex';
    status.innerText = 'Grabando tu voz...';
    const recordingTime = 3400 + Math.random() * 1000;
    setTimeout(() => {
      if (!document.getElementById('recWave')) return;
      wave.style.display = 'none';
      micBtn.classList.remove('active');
      micBtn.innerText = '✓';
      status.innerText = '¡Listo! Tu voz quedó grabada.';
      setTimeout(() => {
        if (!document.getElementById('micBtn')) return;
        showWordPicker();
      }, 500);
    }, recordingTime);
  }

  function launchFirefly(text) {
    const micBtn = document.getElementById('micBtn');
    const jarEl = document.getElementById('jarLights');
    const status = document.getElementById('recStatus');
    if (!micBtn || !jarEl) {
      window.micBusy = false;
      return;
    }

    hugArms();
    status.innerText = `"${text}" vuela hacia el frasco...`;

    const startRect = micBtn.getBoundingClientRect();
    const endRect = jarEl.getBoundingClientRect();
    const firefly = document.createElement('div');
    firefly.className = 'flying-firefly';
    const startX = startRect.left + startRect.width / 2 - 7;
    const startY = startRect.top + startRect.height / 2 - 7;
    firefly.style.left = startX + 'px';
    firefly.style.top = startY + 'px';
    document.body.appendChild(firefly);
    const dx = (endRect.left + endRect.width / 2) - (startRect.left + startRect.width / 2);
    const dy = (endRect.top + endRect.height / 2) - (startRect.top + startRect.height / 2);

    const anim = firefly.animate([
      { transform: 'translate(0,0) scale(1)', offset: 0 },
      { transform: `translate(${dx * 0.45}px, ${dy * 0.3 - 50}px) scale(1.3)`, offset: 0.5 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.5)`, opacity: 0.85, offset: 1 }
    ], { duration: 900, easing: 'ease-in-out', fill: 'forwards' });

    anim.onfinish = async () => {
      firefly.remove();
      if (typeof window.playChime === 'function') window.playChime();
      reopenArms();
      const voice = { name: window.userName, text };
      const saved = typeof window.saveMuralArtifact === 'function'
        ? await window.saveMuralArtifact('voz', voice)
        : null;
      if (!saved || !saved.success) {
        window.micBusy = false;
        const button = document.getElementById('micBtn');
        if (button) button.disabled = false;
        const message = document.getElementById('recStatus');
        if (message) message.innerText = 'No se guardó. Puedes volver a intentarlo.';
        return;
      }
      if (!window.muralVoices) window.muralVoices = [];
      window.muralVoices.push(voice);
      window.micBusy = false;
      if (document.getElementById('micBtn')) {
        document.getElementById('micBtn').disabled = false;
        document.getElementById('micBtn').innerText = '🎤';
        document.getElementById('recStatus').innerText = 'Toca el micrófono para grabar';
      }
      updateJarUI();
    };
  }

  // Compatibilidad global requerida
  window.myWordsHTML = myWordsHTML;
  window.renderMyWords = renderMyWords;
  window.startVoiceSim = startVoiceSim;
  window.showWordPicker = showWordPicker;
  window.pickSpokenWord = pickSpokenWord;
  window.launchFirefly = launchFirefly;
  window.hugArms = hugArms;
  window.reopenArms = reopenArms;
  window.updateJarUI = updateJarUI;

  window.VozActions = {
    myWordsHTML,
    renderMyWords,
    startVoiceSim,
    showWordPicker,
    pickSpokenWord,
    launchFirefly,
    hugArms,
    reopenArms,
    updateJarUI
  };
})();
