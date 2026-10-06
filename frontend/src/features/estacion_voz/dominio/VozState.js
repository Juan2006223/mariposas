// frontend/src/features/estacion_voz/dominio/VozState.js
(function () {
  // Estado 6-8 Voz y Abrazo
  window.vozSimIndex = window.vozSimIndex || 0;
  window.micBusy = window.micBusy || false;
  window.sessionWords = window.sessionWords || [];

  // Estado 9-12 Pienso y Huellas
  window.pienso = window.pienso || {
    level: null,
    unlocked: new Set([1]),
    completed: new Set(),
    badges: []
  };

  window.piensoAudioPlaying = window.piensoAudioPlaying || false;
  window.piensoUtterance = window.piensoUtterance || null;
  window.matchSelected = window.matchSelected || null;
  window.matchCorrectCount = window.matchCorrectCount || 0;
  window._chainOrder = window._chainOrder || [];
  window._chainNext = window._chainNext || 0;

  window.VozState = {
    reset68() {
      window.micBusy = false;
      window.sessionWords = [];
    },
    reset912() {
      window.pienso = {
        level: null,
        unlocked: new Set([1]),
        completed: new Set(),
        badges: []
      };
      window.piensoAudioPlaying = false;
      window.matchSelected = null;
      window.matchCorrectCount = 0;
      window._chainOrder = [];
      window._chainNext = 0;
    }
  };
})();
