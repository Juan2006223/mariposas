// frontend/src/features/estacion_crea/infraestructura/ui/Crea912View.js
(function () {
  function renderStep0(total) {
    return `
      <div class="crea-card" style="background:var(--card2); border:1px solid var(--line); border-radius:18px; padding:16px; text-align:center;">
        <h4 style="font-family:'Baloo 2',sans-serif; color:var(--violeta-suave); margin:0 0 8px;">${miIcon('idea')} Mi misión: crear con sentido</h4>
        <p style="font-size:0.84rem; color:var(--ink-soft); margin:0 0 8px;">Diseña una mariposa que represente algo importante para ti sobre La Mariposa: ${miIcon('mariposa')} un color de esperanza, ${miIcon('casa')} una forma del territorio, ${miIcon('pin')} un símbolo de un lugar, ${miIcon('corazon')} una emoción, ${miIcon('brote')} algo que quieras que recuerden.</p>
        <p style="font-size:0.8rem; font-style:italic; color:var(--sol); margin:0 0 12px;">"Tu mariposa no tiene que ser perfecta. Lo importante es lo que quieres contar con ella."</p>
        <div class="step-card">Paso 1: cuando des clic, aparece tu lienzo para dibujar.</div>
        <button class="primary-btn" onclick="creaNext(${total})">Comenzar a dibujar</button>
      </div>`;
  }

  function renderStep1(total) {
    const brushColors = (window.CreaPaletteData && window.CreaPaletteData.BRUSH_COLORS_912) || [
      '#9B4DFF', '#D946B5', '#5B6FE8', '#FFC857', '#4FB286', '#1B0F30', '#2EC4B6', '#FF6B6B',
      '#E84393', '#74C0FC', '#A8E063', '#F4A261', '#264653', '#6B8E23', '#F7B6D2', '#8D99AE',
    ];
    const bColor = window.brushColor || '#9B4DFF';
    const bMode = window.brushMode || 'round';
    const bSize = window.brushSize || 7;
    const isErasing = window.erasing;

    return `
      <div class="step-card"><span class="action-nudge">${miIcon('dedo')} Toca el lienzo y arrastra tu dedo para pintar</span></div>
      <div class="draw-studio">
        <div class="draw-studio-head">
          <div class="draw-studio-title">${miIcon('pinta')} Mi mesa de dibujo</div>
          <div class="draw-status" id="brushStatus">Pincel redondo · tamaño 7</div>
        </div>
        <div class="canvas-wrap clickable-glow">
          <canvas id="drawCanvas" width="340" height="240"></canvas>
        </div>
        <div class="draw-tools">
          <div class="tool-group">
            <div class="tool-group-label">Colores</div>
            ${brushColors.map((c) => `<button class="brush-color ${bColor === c ? 'sel' : ''}" aria-label="Color ${c}" style="background:${c}" onclick="setBrush('${c}',this)"></button>`).join('')}
          </div>
          <div class="tool-group">
            <div class="tool-group-label">Pincel</div>
            <button class="tool-btn ${bMode === 'round' && !isErasing ? 'active' : ''}" data-mode="round" onclick="setBrushMode('round',this)">● Redondo</button>
            <button class="tool-btn ${bMode === 'soft' && !isErasing ? 'active' : ''}" data-mode="soft" onclick="setBrushMode('soft',this)">${miIcon('estrella')} Suave</button>
            <button class="tool-btn ${bMode === 'marker' && !isErasing ? 'active' : ''}" data-mode="marker" onclick="setBrushMode('marker',this)">▰ Marcador</button>
          </div>
          <div class="tool-group">
            <div class="tool-group-label">Tamaño</div>
            <button class="tool-btn size-chip ${bSize === 4 ? 'active' : ''}" onclick="setBrushSize(4,this)">Fino</button>
            <button class="tool-btn size-chip ${bSize === 7 ? 'active' : ''}" onclick="setBrushSize(7,this)">Medio</button>
            <button class="tool-btn size-chip ${bSize === 13 ? 'active' : ''}" onclick="setBrushSize(13,this)">Grande</button>
          </div>
          <div class="tool-group">
            <div class="tool-group-label">Ayuda</div>
            <button class="tool-btn big" id="eraserBtn" onclick="setEraser()">${miIcon('borrador')} Borrador</button>
            <button class="tool-btn big" onclick="undoLastStroke()">${miIcon('deshacer')} Deshacer</button>
            <button class="tool-btn big" onclick="clearCanvas()">${miIcon('escoba')} Limpiar</button>
          </div>
        </div>
      </div>
      <div class="hint">${miIcon('idea')} Dibuja alas, montañas, una casa, una flor o un símbolo de tu historia. El botón de abajo toma la foto de tu creación.</div>
      <button class="primary-btn" onclick="finishDrawing(${total})">${miIcon('listo')} Terminé mi dibujo</button>
    `;
  }

  function renderStep2(total) {
    return `
      <div class="crea-preview">
        <div class="station-sub">${miIcon('camara')} Capturo mi creación</div>
        <img id="previewImg" src="${window._creaImg || ''}" alt="mariposa dibujada"/>
      </div>
      <div class="step-card">Así se guardará para verla luego en el mural y en admin. Si quieres cambiar algo, vuelve con el botón del navegador y dibuja de nuevo.</div>
      <button class="primary-btn" onclick="creaNext(${total})">${miIcon('listo')} Sí, guardar datos de mi creación</button>
    `;
  }

  function renderStep3(total) {
    const qualities = (window.CreaPaletteData && window.CreaPaletteData.CREA_QUALITIES_912) || [];
    const categories = (window.CreaPaletteData && window.CreaPaletteData.CREA_CATEGORIES_912) || [];
    return `
      <div class="station-sub">${miIcon('mariposa')} Nombre de mi mariposa</div>
      <input class="input-field" id="butName" placeholder="Escribe un nombre para tu mariposa..."/>
      <div class="station-sub" style="margin-top:12px;">${miIcon('estrella')} Una cualidad de mi mariposa</div>
      <div class="chip-row" id="creaQualityRow">
        ${qualities.map((c) => `<div class="chip" onclick="selChip(this)">${miIcon(c.icon)} ${c.label}</div>`).join('')}
      </div>
      <div class="station-sub" style="margin-top:12px;">${miIcon('carpeta')} Categoría para el mural</div>
      <div class="chip-row" id="creaCategoryRow">
        ${categories.map((c) => `<div class="chip" onclick="selChip(this)">${miIcon(c.icon)} ${c.label}</div>`).join('')}
      </div>
      <div class="station-sub" style="margin-top:12px;">${miIcon('voz')} Mi mensaje</div>
      <textarea class="input-field" id="butMsg" rows="3" placeholder="¿Qué quieres contarle a otras personas con tu mariposa?"></textarea>
      <div class="step-card">Cuando presiones guardar, la foto del dibujo queda respaldada para este niño/a.</div>
      <button class="primary-btn" onclick="captureCreation(${total})">${miIcon('camara')} Guardar mi creación</button>
    `;
  }

  function renderStep4() {
    return `
      <div class="viewer-card">
        <div class="viewer-stage" id="viewerStage" style="transform: perspective(600px) rotateY(${window._creaRotate || 0}deg);">
          <img src="${window._creaImg || ''}" alt="mariposa"/>
        </div>
        <input type="range" min="-60" max="60" value="${window._creaRotate || 0}" oninput="rotateCreation(this.value)"/>
        <div class="station-sub">${miIcon('giro')} Gira tu mariposa para verla desde otro ángulo</div>
        <button class="tool-btn" onclick="revealSymbol()">${miIcon('estrella')} Pulsar sobre su símbolo</button>
        <div class="station-sub" id="symbolReveal" style="min-height:16px;"></div>
        <div class="station-sub" style="font-style:italic; margin-top:6px;">"Esta creación nació de tu imaginación y ahora forma parte de una experiencia colectiva."</div>
      </div>
      <div class="step-card">Último paso: toca este botón para que aparezca en la galería, en el mural y en el panel admin.</div>
      <button class="primary-btn" onclick="joinMural()">${miIcon('mural')} Guardar y poner en el Mural</button>
    `;
  }

  function renderStep5() {
    return `
      <div class="crea-card" style="background:var(--card2); border:1px solid var(--line); border-radius:18px; padding:16px; text-align:center;">
        <h4 style="font-family:'Baloo 2',sans-serif; color:var(--violeta-suave); margin:0 0 8px;">${miIcon('globo')} ¡Tu mariposa se unió a las demás!</h4>
        <p style="font-size:0.84rem; color:var(--ink-soft); margin:0 0 12px;">Tu creación ya forma parte del Mural Digital Vivo y quedó respaldada en la plataforma.</p>
        <button class="primary-btn" onclick="goToMuralFromCreation()">${miIcon('ojos')} Ver mi creación en el mural</button>
        <button class="tool-btn big" style="width:100%; margin-top:10px;" onclick="creaGoNext()">Seguir con la siguiente estación ➔</button>
      </div>`;
  }

  function station2_912() {
    window._creaStep = window._creaStep ?? 0;
    const total = 6;
    const dots = Array.from({ length: total }).map((_, i) => `<div class="step-dot ${i <= window._creaStep ? 'done' : ''}"></div>`).join('');
    let body = '';

    if (window._creaStep === 0) body = renderStep0(total);
    else if (window._creaStep === 1) body = renderStep1(total);
    else if (window._creaStep === 2) body = renderStep2(total);
    else if (window._creaStep === 3) body = renderStep3(total);
    else if (window._creaStep === 4) body = renderStep4();
    else if (window._creaStep === 5) body = renderStep5();

    return `
    <div class="station-title">CREO — Mi mariposa, mi historia, nuestra comunidad</div>
    <div class="station-sub">Dibuja y pinta tu propia mariposa como quieras.</div>
    <div class="steps-row">${dots}</div>
    ${body}
  `;
  }

  window.station2_912 = station2_912;
  window.Crea912View = {
    station2_912,
  };
})();
