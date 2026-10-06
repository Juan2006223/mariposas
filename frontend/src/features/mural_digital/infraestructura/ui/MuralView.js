(function () {
  function miniButterflySvg(colors) {
    const c = colors || {};
    return `<svg width="100%" height="100%" viewBox="0 0 200 160">
    <path d="M100,78 C80,30 30,18 15,45 C3,68 20,92 55,90 C75,89 92,85 100,78 Z" fill="${c.wingLU || '#ff6f91'}"/>
    <path d="M55,90 C35,95 15,105 18,128 C20,148 45,152 60,135 C70,123 78,108 100,100 C85,92 70,88 55,90 Z" fill="${c.wingLD || '#ff9671'}"/>
    <path d="M100,78 C120,30 170,18 185,45 C197,68 180,92 145,90 C125,89 108,85 100,78 Z" fill="${c.wingRU || '#ff6f91'}"/>
    <path d="M145,90 C165,95 185,105 182,128 C180,148 155,152 140,135 C130,123 122,108 100,100 C115,92 130,88 145,90 Z" fill="${c.wingRD || '#ff9671'}"/>
    <circle cx="28" cy="45" r="7" fill="${c.spotLU1 || '#22193A'}"/>
    <circle cx="60" cy="38" r="6" fill="${c.spotLU2 || '#22193A'}"/>
    <circle cx="28" cy="118" r="6" fill="${c.spotLD1 || '#22193A'}"/>
    <circle cx="62" cy="115" r="6" fill="${c.spotLD2 || '#22193A'}"/>
    <circle cx="172" cy="45" r="7" fill="${c.spotRU1 || '#22193A'}"/>
    <circle cx="140" cy="38" r="6" fill="${c.spotRU2 || '#22193A'}"/>
    <circle cx="172" cy="118" r="6" fill="${c.spotRD1 || '#22193A'}"/>
    <circle cx="138" cy="115" r="6" fill="${c.spotRD2 || '#22193A'}"/>
    <path d="M96,52 C88,35 78,28 74,18" stroke="#1B0F30" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M104,52 C112,35 122,28 126,18" stroke="#1B0F30" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="74" cy="18" r="2.5" fill="#1B0F30"/>
    <circle cx="126" cy="18" r="2.5" fill="#1B0F30"/>
    <ellipse cx="100" cy="90" rx="7" ry="32" fill="#1B0F30"/>
    <circle cx="100" cy="55" r="7" fill="#1B0F30"/>
  </svg>`;
  }

  function muralButterfliesHTML() {
    const list = window.MuralState && typeof window.MuralState.getButterflies === 'function'
      ? window.MuralState.getButterflies()
      : (window.muralButterflies || []);

    if (list.length === 0) {
      return `<div class="empty-state">Aún no hay mariposas en el mural.<br>Ve a la Estación "Pinta" y crea la tuya 🦋</div>`;
    }
    return `<div class="mural-grid">
    ${list.map((b, i) => {
      const label = b.name || 'Anónimo/a';
      if (b.type === 'image') {
        const artworkTitle = b.butterflyName || 'Mi creación';
        return `<div class="mural-card" onclick="openLightbox(${i})"><div class="mural-butterfly"><img src="${b.src}" alt="${artworkTitle} de ${label}"/></div><div class="mural-name">${artworkTitle}<br><span>${label}</span></div></div>`;
      }
      const c = b.colors;
      return `<div class="mural-card" onclick="openLightbox(${i})"><div class="mural-butterfly">${miniButterflySvg(c)}</div><div class="mural-name">${label}</div></div>`;
    }).join('')}
  </div>`;
  }

  function muralVoicesHTML() {
    const list = window.MuralState && typeof window.MuralState.getVoices === 'function'
      ? window.MuralState.getVoices()
      : (window.muralVoices || []);

    if (list.length === 0) {
      return `<div class="empty-state">Aún no hay palabras en el mural.<br>Ve a la Estación "Voz" y escribe la tuya 💬</div>`;
    }
    return list.map(v => `
    <div class="voice-item">
      <div class="voice-quote">✨ "${v.text}"</div>
      <div class="voice-author">— ${v.name || 'Anónimo/a'}</div>
    </div>
  `).join('');
  }

  function muralFootprintsHTML() {
    const list = window.MuralState && typeof window.MuralState.getFootprints === 'function'
      ? window.MuralState.getFootprints()
      : (window.muralFootprints || []);

    if (list.length === 0) {
      return `<div class="empty-state">Aún no hay huellas en el mural.<br>Ve a la Estación "Mapa" y recorre el camino con Canelo 🐾</div>`;
    }
    return `<div class="mural-grid">
    ${list.map(f => `
      <div class="mural-card">
        <div class="mural-butterfly">${f.ico}</div>
        <div class="mural-name">${f.name || 'Anónimo/a'}</div>
        <div class="mural-name" style="opacity:0.7; font-weight:400;">${f.place}</div>
      </div>
    `).join('')}
  </div>`;
  }

  function muralReflectionsHTML() {
    const list = window.MuralState && typeof window.MuralState.getReflections === 'function'
      ? window.MuralState.getReflections()
      : (window.muralReflections || []);

    if (list.length === 0) {
      return `<div class="empty-state">Aún no hay descubrimientos en el mural.<br>Ve a la Estación "Voz" (9-12) y completa las 5 huellas 💭</div>`;
    }
    return list.map(r => `
    <div class="voice-item">
      <div class="voice-quote">💭 "${r.text}"</div>
      <div class="voice-author">— ${r.name || 'Anónimo/a'}</div>
    </div>
  `).join('');
  }

  function muralScreen() {
    const activeTab = window.MuralState && typeof window.MuralState.getActiveTab === 'function'
      ? window.MuralState.getActiveTab()
      : (window._muralTab || 'mariposas');

    const butterflies = window.MuralState && typeof window.MuralState.getButterflies === 'function'
      ? window.MuralState.getButterflies() : (window.muralButterflies || []);
    const voices = window.MuralState && typeof window.MuralState.getVoices === 'function'
      ? window.MuralState.getVoices() : (window.muralVoices || []);
    const footprints = window.MuralState && typeof window.MuralState.getFootprints === 'function'
      ? window.MuralState.getFootprints() : (window.muralFootprints || []);
    const reflections = window.MuralState && typeof window.MuralState.getReflections === 'function'
      ? window.MuralState.getReflections() : (window.muralReflections || []);

    return `
    <div class="station-title">Mural Digital Vivo</div>
    <div class="station-sub">Aquí se integran las mariposas creadas, las voces grabadas y las huellas del recorrido de cada participante.</div>
    <div class="mural-tabs">
      <div class="mural-tab ${activeTab === 'mariposas' ? 'sel' : ''}" onclick="selMuralTab('mariposas')">🦋 Mariposas (${butterflies.length})</div>
      <div class="mural-tab ${activeTab === 'voces' ? 'sel' : ''}" onclick="selMuralTab('voces')">💬 Palabras (${voices.length})</div>
      <div class="mural-tab ${activeTab === 'huellas' ? 'sel' : ''}" onclick="selMuralTab('huellas')">🐾 Huellas (${footprints.length})</div>
      <div class="mural-tab ${activeTab === 'reflexiones' ? 'sel' : ''}" onclick="selMuralTab('reflexiones')">💭 Descubrimientos (${reflections.length})</div>
    </div>
    ${activeTab === 'mariposas' ? muralButterfliesHTML() : activeTab === 'voces' ? muralVoicesHTML() : activeTab === 'huellas' ? muralFootprintsHTML() : muralReflectionsHTML()}
  `;
  }

  window.miniButterflySvg = miniButterflySvg;
  window.muralButterfliesHTML = muralButterfliesHTML;
  window.muralVoicesHTML = muralVoicesHTML;
  window.muralFootprintsHTML = muralFootprintsHTML;
  window.muralReflectionsHTML = muralReflectionsHTML;
  window.muralScreen = muralScreen;

  window.MuralView = {
    miniButterflySvg,
    muralButterfliesHTML,
    muralVoicesHTML,
    muralFootprintsHTML,
    muralReflectionsHTML,
    muralScreen,
  };
})();
