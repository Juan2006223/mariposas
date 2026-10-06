// frontend/src/features/estacion_voz/infraestructura/ui/Abrazo68View.js
(function () {
  function station3_68() {
    const palabras = window.palabrasSimuladas || (window.VozData && window.VozData.PALABRAS_SIMULADAS) || [];
    const myWords = typeof window.myWordsHTML === 'function' ? window.myWordsHTML() : '';
    const list = window.muralVoices || [];

    return `
    <div class="station-title">¿Por qué te sientes bien viviendo aquí?</div>
    <div class="station-sub">"Para nosotras el lugar que es como un abrazo es la Mariposa." Presiona el micrófono y grábate contando, con tu propia voz, por qué te sientes bien viviendo aquí.</div>
    <div class="station-sub" style="margin-bottom:6px;">Estas son algunas palabras que puedes usar en tu respuesta:</div>
    <div class="word-bank-row" id="wordBankRow">
      ${palabras.map((p) => `<span class="wordbank-pill">${p}</span>`).join('')}
    </div>
    <div class="my-words-row" id="myWordsRow">${myWords}</div>
    <div class="abrazo-zone">
      <svg width="150" height="90" viewBox="0 0 150 90" class="abrazo-svg" id="abrazoSvg">
        <path id="armL" class="arm" d="M10 10 Q40 60 65 45" fill="none" stroke="#D946B5" stroke-width="14" stroke-linecap="round"/>
        <path id="armR" class="arm" d="M140 10 Q110 60 85 45" fill="none" stroke="#D946B5" stroke-width="14" stroke-linecap="round"/>
      </svg>
      <button class="mic-btn" id="micBtn" onclick="startVoiceSim()">${miIcon('microfono')}</button>
      <div class="rec-wave" id="recWave" style="display:none;">
        <span></span><span></span><span></span><span></span><span></span>
      </div>
      <div class="station-sub" id="recStatus" style="min-height:16px;">Toca el micrófono para grabar</div>
      <div class="chip-row" id="wordPicker" style="display:none; justify-content:center;"></div>
      <div class="jar">
        <div class="station-sub">Frasco colectivo (${list.length} voces)</div>
        <div class="jar-lights" id="jarLights">
          ${list.map(() => '<div class="firefly"></div>').join('') || '<span class="hint">Aún no hay voces</span>'}
        </div>
      </div>
      ${list.length > 0 ? `
      <div id="continueBlock3_68" style="margin-top:14px;">
        <button class="primary-btn" onclick="setStation(4)">Completar y continuar ➔</button>
      </div>` : ''}
    </div>
  `;
  }

  window.station3_68 = station3_68;
  window.Abrazo68View = {
    station3_68
  };
})();
