// frontend/src/features/estacion_voz/infraestructura/ui/Pienso912View.js
(function () {
  function piensoLevel1() {
    return `
    <div class="mission-card">
      <h4>🔍 Activa tu misión</h4>
      <p>"La Mariposa ha dejado algunas huellas de su pasado. Tu misión es descubrir qué ocurrió, por qué cambió el territorio y cómo esos cambios afectan a las personas, las plantas y las mariposas."</p>
      <p style="margin-top:8px;">¿Qué pistas te ayudan a descubrirlo?</p>
      <div class="chip-row">
        ${['Llegó el acueducto', 'Se abrió un camino nuevo', 'Creció el colegio', 'Desapareció una quebrada'].map((c) => `<div class="chip" onclick="selChipLevel1(this)">${c}</div>`).join('')}
      </div>
    </div>
    <button class="primary-btn" id="level1ContinueBtn" style="display:none;" onclick="completePiensoLevel(1)">Completar huella 🐾</button>
  `;
  }

  function piensoLevel2() {
    return `
    <div class="mission-card">
      <h4>🕵️ ¿Por qué cambió?</h4>
      <div class="cause-effect">
        <div class="ce-box">🌳 Espacio natural</div>
        <div class="arrow">➔</div>
        <div class="ce-box">🏗️ Transformación</div>
        <div class="arrow">➔</div>
        <div class="ce-box">🏡 Nuevo uso</div>
      </div>
      <p style="margin-top:10px;">¿Cómo pudo afectar este cambio a las personas y a la naturaleza?</p>
      <div class="chip-row">
        ${['Se perdió un espacio de juego', 'Hubo más casas y vecinos', 'Cambió el paisaje del barrio'].map((c) => `<div class="chip" onclick="selChipLevel2(this)">${c}</div>`).join('')}
      </div>
    </div>
    <button class="primary-btn" id="level2ContinueBtn" style="display:none;" onclick="completePiensoLevel(2)">Completar huella 🗺️</button>
  `;
  }

  function piensoLevel3() {
    return `
    <div class="mission-card">
      <h4>🎧 Una voz que cuenta</h4>
      <p>Escucha el testimonio de una habitante del territorio.</p>
      <button class="primary-btn" onclick="togglePiensoAudio()"><span id="piensoPlayIcon">▶</span>&nbsp; Reproducir testimonio</button>
      <p style="margin-top:10px;">¿Qué cambio menciona la persona?</p>
      <div class="chip-row">
        ${['La llegada del acueducto', 'El crecimiento del colegio', 'La desaparición de las bandas'].map((c) => `<div class="chip" onclick="selChipLevel3(this)">${c}</div>`).join('')}
      </div>
    </div>
    <button class="primary-btn" id="level3ContinueBtn" style="display:none;" onclick="completePiensoLevel(3)">Completar huella 📜</button>
  `;
  }

  function piensoLevel4() {
    window.matchCorrectCount = 0;
    window.matchSelected = null;
    const pairs = (window.VozData && window.VozData.PIENSO_MATCH_PAIRS) || [];
    const plants = (window.VozData && window.VozData.PIENSO_MATCH_PLANTS) || [];
    return `
    <div class="mission-card">
      <h4>🌱 La naturaleza también cuenta</h4>
      <p>Cada mariposa depende de una planta específica de su lugar del territorio para sobrevivir. Toca una mariposa y luego la planta con la que crees que se relaciona.</p>
      <div class="match-row">
        <div class="match-col">
          ${pairs.map((m) => `<div class="match-card" data-side="mariposa" data-id="${m.id}" data-match="${m.matchPlant}" onclick="selMatch(this)">
            <span class="match-ico" style="background:${m.color};">${m.ico}</span><span class="match-label">${m.label}</span>
          </div>`).join('')}
        </div>
        <div class="match-col">
          ${plants.map((p) => `<div class="match-card" data-side="planta" data-id="${p.id}" onclick="selMatch(this)">
            <span class="match-ico">${p.ico}</span><span class="match-label">${p.label}</span>
          </div>`).join('')}
        </div>
      </div>
      <p style="margin-top:10px;" id="matchFeedback">¿Qué planta crees que necesita cada mariposa para vivir? (0 de 3 emparejadas)</p>
    </div>
    <button class="primary-btn" id="matchCompleteBtn" style="display:none;" onclick="completePiensoLevel(4)">Completar huella 🦋</button>
  `;
  }

  function piensoLevel5() {
    const items = (window.VozData && window.VozData.PIENSO_CHAIN_ITEMS) || [];
    const shuffled = items.map((t, i) => ({ t, i })).sort(() => Math.random() - 0.5);
    window._chainOrder = [];
    window._chainNext = 0;
    return `
    <div class="mission-card">
      <h4>🧩 Conecta las huellas</h4>
      <p>Toca las tarjetas EN EL ORDEN en que crees que ocurrieron los hechos. Si te equivocas de orden, te lo diremos para que lo intentes de nuevo.</p>
      <div class="chain-list" id="chainList">
        ${shuffled.map(({ t, i }) => `<div class="chain-card" data-i="${i}" onclick="tapChain(${i}, this)">${t}</div>`).join('')}
      </div>
      <div class="station-sub" id="chainProgress">0 de 5 conectadas en orden</div>
      <div id="chainSummary" style="display:none; margin-top:12px; padding:12px; border-radius:12px; background:var(--card2); border:1px solid var(--line);">
        <div style="font-weight:700; color:var(--violeta-suave); margin-bottom:4px;">✨ La frase completa:</div>
        <div id="chainFullPhrase" style="font-size:0.82rem; line-height:1.6;"></div>
        <div id="chainReflection" style="margin-top:8px; font-size:0.78rem; font-style:italic; color:var(--ink-soft);"></div>
      </div>
    </div>
    <button class="primary-btn" id="chainCompleteBtn" style="display:none;" onclick="completePiensoLevel(5)">Completar huella final 🧩</button>
  `;
  }

  function piensoLevelScreen(n) {
    const bodies = { 1: piensoLevel1, 2: piensoLevel2, 3: piensoLevel3, 4: piensoLevel4, 5: piensoLevel5 };
    return `
    <button class="tool-btn" onclick="pienso.level=null; render();">← Volver</button>
    ${bodies[n]()}
  `;
  }

  function piensoFinalScreen() {
    const p = window.pienso || { badges: [] };
    return `
    <div class="station-title" style="text-align:center;">Explorador/a de La Mariposa 🏆</div>
    <div style="text-align:center; font-size:2.2rem; margin:10px 0;">${p.badges.join(' ')}</div>
    <div class="station-sub" style="text-align:center;">Completaste las 5 huellas y descubriste cómo el territorio, las personas y las mariposas están conectados.</div>
    <div class="mission-card" style="margin-top:14px;">
      <h4>💬 Deja tu descubrimiento en el Mural</h4>
      <p>Escribe en una frase lo más importante que descubriste sobre La Mariposa.</p>
      <textarea id="piensoRefInput" class="reflect-input" maxlength="140" placeholder="Escribe aquí tu descubrimiento..."></textarea>
      <button class="primary-btn" id="saveReflectionBtn" onclick="savePiensoReflection()">Guardar en el Mural</button>
    </div>
    <div style="margin-top:16px;">
      <button class="primary-btn" onclick="setStation(4)">Completar y continuar ➔</button>
    </div>
  `;
  }

  function piensoMenuScreen() {
    const p = window.pienso || { completed: new Set(), unlocked: new Set([1]) };
    const levels = (window.VozData && window.VozData.PIENSO_LEVELS) || [];
    const detectiveImg = window.DETECTIVE_IMG || '';
    return `
    <div class="station-title">🦋 Exploradores de las huellas del territorio</div>
    <img src="${detectiveImg}" class="pienso-detective" alt="Detective explorador" />
    <div class="station-sub">Descubre las transformaciones de La Mariposa siguiendo las huellas del pasado.</div>
    <div class="station-sub" style="font-weight:700; color:var(--ink);">🐾 ${p.completed.size} de 5 huellas descubiertas</div>
    <div class="level-list">
      ${levels.map((l) => {
        const unlocked = p.unlocked.has(l.n);
        const done = p.completed.has(l.n);
        return `<div class="level-card ${unlocked ? '' : 'locked'} ${done ? 'done' : ''}" onclick="${unlocked ? `openPiensoLevel(${l.n})` : ''}">
          <span class="level-ico">${done ? '✅' : (unlocked ? l.ico : '🔒')}</span>
          <span class="level-name">${l.name}</span>
        </div>`;
      }).join('')}
    </div>
    ${p.completed.size >= 5 ? `<div style="margin-top:16px;"><button class="primary-btn" onclick="pienso.level='done'; render();">Ver mi mapa de huellas 🗺️</button></div>` : ''}
  `;
  }

  function station3_912() {
    const p = window.pienso || {};
    if (p.level === 'done') return piensoFinalScreen();
    if (p.level) return piensoLevelScreen(p.level);
    return piensoMenuScreen();
  }

  // Compatibilidad global requerida
  window.station3_912 = station3_912;
  window.piensoMenuScreen = piensoMenuScreen;
  window.piensoLevelScreen = piensoLevelScreen;
  window.piensoLevel1 = piensoLevel1;
  window.piensoLevel2 = piensoLevel2;
  window.piensoLevel3 = piensoLevel3;
  window.piensoLevel4 = piensoLevel4;
  window.piensoLevel5 = piensoLevel5;
  window.piensoFinalScreen = piensoFinalScreen;

  window.Pienso912View = {
    station3_912,
    piensoMenuScreen,
    piensoLevelScreen,
    piensoLevel1,
    piensoLevel2,
    piensoLevel3,
    piensoLevel4,
    piensoLevel5,
    piensoFinalScreen
  };
})();
