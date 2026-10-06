// frontend/src/features/estacion_voz/aplicacion/PiensoChainActions.js
(function () {
  function showChainSummary() {
    const summary = document.getElementById('chainSummary');
    const full = document.getElementById('chainFullPhrase');
    const refl = document.getElementById('chainReflection');
    const items = window.PIENSO_CHAIN_ITEMS || (window.VozData && window.VozData.PIENSO_CHAIN_ITEMS) || [];
    if (full) full.innerText = items.join(' ➔ ');
    if (refl) refl.innerText = 'Así, un pequeño cambio en el territorio puede transformar la vida de las personas, las plantas y hasta las mariposas que lo habitan.';
    if (summary) summary.style.display = 'block';
  }

  function tapChain(i, el) {
    if (el.classList.contains('chained')) return;
    const progress = document.getElementById('chainProgress');
    if (i === window._chainNext) {
      el.classList.add('chained');
      if (!window._chainOrder) window._chainOrder = [];
      window._chainOrder.push(i);
      window._chainNext = (window._chainNext || 0) + 1;
      if (typeof window.playChime === 'function') window.playChime();
      if (progress) progress.innerText = `${window._chainOrder.length} de 5 conectadas en orden`;
      if (window._chainOrder.length >= 5) {
        const btn = document.getElementById('chainCompleteBtn');
        if (btn) btn.style.display = 'block';
        showChainSummary();
      }
    } else {
      el.classList.add('wrong');
      if (typeof window.playErrorSound === 'function') window.playErrorSound();
      if (progress) progress.innerText = 'Ese no es el siguiente paso todavía. Inténtalo de nuevo.';
      setTimeout(() => {
        el.classList.remove('wrong');
        if (progress) progress.innerText = `${(window._chainOrder || []).length} de 5 conectadas en orden`;
      }, 500);
    }
  }

  function showHuellaToast() {
    const toast = document.createElement('div');
    toast.className = 'huella-toast';
    toast.innerText = '¡Nueva huella descubierta!';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1800);
  }

  function completePiensoLevel(n) {
    if (!window.pienso) window.pienso = { level: null, unlocked: new Set([1]), completed: new Set(), badges: [] };
    window.pienso.completed.add(n);
    window.pienso.unlocked.add(n + 1);
    const badgeMap = (window.VozData && window.VozData.PIENSO_BADGE_MAP) || { 1: '🐾', 2: '🗺️', 3: '📜', 4: '🦋', 5: '🧩' };
    window.pienso.badges.push(badgeMap[n]);
    window.pienso.level = null;
    showHuellaToast();
    if (typeof window.render === 'function') window.render();
  }

  async function savePiensoReflection() {
    const input = document.getElementById('piensoRefInput');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    const reflection = { name: window.userName, text };
    const saved = typeof window.saveMuralArtifact === 'function'
      ? await window.saveMuralArtifact('reflexion', reflection)
      : null;
    if (!saved || !saved.success) return;
    if (!window.muralReflections) window.muralReflections = [];
    window.muralReflections.push(reflection);
    input.disabled = true;
    const btn = document.getElementById('saveReflectionBtn');
    if (btn) {
      btn.innerText = '¡Guardado en el Mural! ✓';
      btn.disabled = true;
    }
  }

  // Compatibilidad global requerida
  window.showChainSummary = showChainSummary;
  window.tapChain = tapChain;
  window.showHuellaToast = showHuellaToast;
  window.completePiensoLevel = completePiensoLevel;
  window.savePiensoReflection = savePiensoReflection;

  window.PiensoChainActions = {
    showChainSummary,
    tapChain,
    showHuellaToast,
    completePiensoLevel,
    savePiensoReflection
  };
})();
