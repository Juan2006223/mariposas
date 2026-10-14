// frontend/src/features/estacion_crea/infraestructura/ui/Crea912View.js
(function () {
  function renderStep1(total) {
    const brushColors = (window.CreaPaletteData && window.CreaPaletteData.BRUSH_COLORS_912) || [
      '#9B4DFF', '#D946B5', '#5B6FE8', '#FFC857', '#4FB286', '#1B0F30', '#2EC4B6', '#FF6B6B',
      '#74C0FC', '#A8E063', '#F4A261', '#264653', '#6B8E23', '#F7B6D2', '#8D99AE',
    ];
    const bColor = window.brushColor || '#9B4DFF';
    const bMode = window.brushMode || 'round';
    const bSize = window.brushSize || 7;
    const currentTool = window.activeStudioTool || 'pincel';

    return `
      <div class="studio-topbar" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
        <button type="button" class="studio-icon-btn" onclick="creaNext(-1)" title="Volver" style="width:38px;height:38px;border-radius:10px;background:var(--card2);border:1px solid var(--line);color:var(--ink);display:flex;align-items:center;justify-content:center;cursor:pointer;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <div style="display:flex;align-items:center;gap:6px;">
          <span style="display:inline-flex;color:var(--sol);">${miIcon('pinta')}</span>
          <span style="font-family:'Baloo 2',sans-serif;font-weight:800;font-size:1.15rem;color:var(--ink);">Mi mesa de dibujo</span>
        </div>
        <button type="button" class="studio-icon-btn" onclick="captureAndPublishDirect912()" title="Guardar creación" style="width:38px;height:38px;border-radius:10px;background:var(--sol);border:none;color:var(--ink);display:flex;align-items:center;justify-content:center;cursor:pointer;">
          ${miIcon('guardar')}
        </button>
      </div>

      <div style="text-align:center;margin-bottom:10px;">
        <div class="action-nudge" style="background:#3b1e6d;border:1px solid #5a329e;color:#E7D4FF;padding:6px 14px;border-radius:999px;font-size:0.75rem;font-weight:700;display:inline-flex;align-items:center;gap:6px;">
          ${miIcon('dedo')} Toca el lienzo y arrastra tu dedo para pintar
        </div>
      </div>

      <div class="canvas-wrap" style="background:#ffffff;border-radius:16px;padding:8px;box-shadow:0 6px 20px rgba(0,0,0,0.35);overflow:hidden;position:relative;">
        <canvas id="drawCanvas" width="340" height="200" style="display:block;width:100%;height:190px;background:#ffffff;border-radius:12px;touch-action:none;cursor:crosshair;"></canvas>
      </div>

      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:10px;">
        <div style="display:flex;gap:6px;flex:1;">
          <button type="button" class="tool-action-pill" onclick="undoLastStroke()" style="flex:1;background:var(--card2);border:1px solid var(--line);color:var(--ink);border-radius:8px;padding:7px 8px;font-size:0.74rem;font-weight:700;display:flex;align-items:center;justify-content:center;gap:4px;cursor:pointer;">
            ${miIcon('deshacer')} Deshacer
          </button>
          <button type="button" class="tool-action-pill" onclick="redoStroke()" style="flex:1;background:var(--card2);border:1px solid var(--line);color:var(--ink);border-radius:8px;padding:7px 8px;font-size:0.74rem;font-weight:700;display:flex;align-items:center;justify-content:center;gap:4px;cursor:pointer;">
            ${miIcon('rehacer')} Rehacer
          </button>
        </div>
        <div style="display:flex;align-items:center;background:var(--card2);border:1px solid var(--line);border-radius:8px;padding:4px 8px;gap:6px;">
          <button type="button" onclick="setCanvasZoom(-10)" title="Alejar" style="background:none;border:none;color:var(--ink);cursor:pointer;display:flex;padding:2px;">${miIcon('zoom_menos')}</button>
          <span id="zoomValue" style="font-size:0.72rem;font-weight:700;color:var(--ink-soft);min-width:44px;text-align:center;">100 %</span>
          <button type="button" onclick="setCanvasZoom(10)" title="Acercar" style="background:none;border:none;color:var(--ink);cursor:pointer;display:flex;padding:2px;">${miIcon('zoom_mas')}</button>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:10px;background:var(--card2);border:1px solid var(--line);border-radius:12px;padding:10px;">
        <button type="button" class="studio-tool-btn ${currentTool === 'pincel' ? 'active' : ''}" data-tool="pincel" onclick="selectStudioTool('pincel')" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;border:none;border-radius:8px;padding:8px 4px;background:${currentTool === 'pincel' ? '#9B4DFF' : 'var(--card)'};color:var(--ink);cursor:pointer;box-shadow:${currentTool === 'pincel' ? '0 0 10px rgba(155,77,255,0.45)' : 'none'};">
          <span style="display:inline-flex;">${miIcon('pinta')}</span><span style="font-size:0.72rem;font-weight:700;">Pincel</span>
        </button>
        <button type="button" class="studio-tool-btn ${currentTool === 'lapiz' ? 'active' : ''}" data-tool="lapiz" onclick="selectStudioTool('lapiz')" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;border:none;border-radius:8px;padding:8px 4px;background:${currentTool === 'lapiz' ? '#9B4DFF' : 'var(--card)'};color:var(--ink);cursor:pointer;">
          <span style="display:inline-flex;">${miIcon('lapiz')}</span><span style="font-size:0.72rem;font-weight:700;">Lápiz</span>
        </button>
        <button type="button" class="studio-tool-btn ${currentTool === 'marcador' ? 'active' : ''}" data-tool="marcador" onclick="selectStudioTool('marcador')" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;border:none;border-radius:8px;padding:8px 4px;background:${currentTool === 'marcador' ? '#9B4DFF' : 'var(--card)'};color:var(--ink);cursor:pointer;">
          <span style="display:inline-flex;">${miIcon('marcador')}</span><span style="font-size:0.72rem;font-weight:700;">Marcador</span>
        </button>
        <button type="button" class="studio-tool-btn ${currentTool === 'borrador' ? 'active' : ''}" data-tool="borrador" onclick="selectStudioTool('borrador')" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;border:none;border-radius:8px;padding:8px 4px;background:${currentTool === 'borrador' ? '#9B4DFF' : 'var(--card)'};color:var(--ink);cursor:pointer;">
          <span style="display:inline-flex;">${miIcon('borrador')}</span><span style="font-size:0.72rem;font-weight:700;">Borrador</span>
        </button>
        <button type="button" class="studio-tool-btn ${currentTool === 'relleno' ? 'active' : ''}" data-tool="relleno" onclick="selectStudioTool('relleno')" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;border:none;border-radius:8px;padding:8px 4px;background:${currentTool === 'relleno' ? '#9B4DFF' : 'var(--card)'};color:var(--ink);cursor:pointer;">
          <span style="display:inline-flex;">${miIcon('relleno')}</span><span style="font-size:0.72rem;font-weight:700;">Relleno</span>
        </button>
        <button type="button" class="studio-tool-btn ${currentTool === 'formas' ? 'active' : ''}" data-tool="formas" onclick="selectStudioTool('formas')" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;border:none;border-radius:8px;padding:8px 4px;background:${currentTool === 'formas' ? '#9B4DFF' : 'var(--card)'};color:var(--ink);cursor:pointer;">
          <span style="display:inline-flex;">${miIcon('formas')}</span><span style="font-size:0.72rem;font-weight:700;">Formas</span>
        </button>
        <button type="button" class="studio-tool-btn ${currentTool === 'selector' ? 'active' : ''}" data-tool="selector" onclick="selectStudioTool('selector')" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;border:none;border-radius:8px;padding:8px 4px;background:${currentTool === 'selector' ? '#9B4DFF' : 'var(--card)'};color:var(--ink);cursor:pointer;">
          <span style="display:inline-flex;">${miIcon('selector')}</span><span style="font-size:0.72rem;font-weight:700;">Selector</span>
        </button>
        <button type="button" class="studio-tool-btn ${currentTool === 'mover' ? 'active' : ''}" data-tool="mover" onclick="selectStudioTool('mover')" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;border:none;border-radius:8px;padding:8px 4px;background:${currentTool === 'mover' ? '#9B4DFF' : 'var(--card)'};color:var(--ink);cursor:pointer;">
          <span style="display:inline-flex;">${miIcon('mover')}</span><span style="font-size:0.72rem;font-weight:700;">Mover</span>
        </button>
      </div>

      <div style="background:var(--card2);border:1px solid var(--line);border-radius:12px;padding:10px;margin-top:10px;">
        <div style="font-size:0.72rem;color:var(--ink-soft);font-weight:700;margin-bottom:6px;">Tipo de pincel</div>
        <div style="display:flex;gap:6px;">
          <button type="button" class="brush-mode-chip ${bMode === 'round' ? 'active' : ''}" data-brush-mode="round" onclick="setBrushMode('round',this)" style="flex:1;border:none;border-radius:8px;padding:7px;background:${bMode === 'round' ? '#9B4DFF' : 'var(--card)'};color:var(--ink);font-size:0.74rem;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px;">
            ● Redondo
          </button>
          <button type="button" class="brush-mode-chip ${bMode === 'soft' ? 'active' : ''}" data-brush-mode="soft" onclick="setBrushMode('soft',this)" style="flex:1;border:none;border-radius:8px;padding:7px;background:${bMode === 'soft' ? '#9B4DFF' : 'var(--card)'};color:var(--ink);font-size:0.74rem;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px;">
            ${miIcon('estrella')} Suave
          </button>
          <button type="button" class="brush-mode-chip ${bMode === 'marker' ? 'active' : ''}" data-brush-mode="marker" onclick="setBrushMode('marker',this)" style="flex:1;border:none;border-radius:8px;padding:7px;background:${bMode === 'marker' ? '#9B4DFF' : 'var(--card)'};color:var(--ink);font-size:0.74rem;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px;">
            ▰ Marcador
          </button>
        </div>

        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:10px;">
          <div style="flex:1;">
            <div style="display:flex;justify-content:space-between;font-size:0.72rem;color:var(--ink-soft);font-weight:700;margin-bottom:4px;">
              <span>Tamaño</span><span id="brushSizeValue">${bSize}</span>
            </div>
            <input id="brushSizeSlider" type="range" min="2" max="28" value="${bSize}" oninput="setBrushSize(this.value)" style="width:100%;accent-color:var(--violeta);cursor:pointer;"/>
          </div>
          <div style="background:var(--card);border:1px solid var(--line);border-radius:10px;padding:4px 6px;display:flex;align-items:center;justify-content:center;">
            <canvas id="strokePreviewCanvas" width="140" height="34" style="display:block;"></canvas>
          </div>
        </div>
      </div>

      <div style="background:var(--card2);border:1px solid var(--line);border-radius:12px;padding:10px;margin-top:10px;">
        <div style="font-size:0.72rem;color:var(--ink-soft);font-weight:700;margin-bottom:8px;">Colores</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
          ${brushColors.map((c) => `<button type="button" class="brush-color ${bColor === c ? 'sel' : ''}" aria-label="Color ${c}" style="background:${c};width:28px;height:28px;border-radius:50%;cursor:pointer;border:${bColor === c ? '2.5px solid #ffffff' : 'none'};box-shadow:${bColor === c ? '0 0 0 2px #9B4DFF' : 'none'};" onclick="setBrush('${c}',this)"></button>`).join('')}
          <button type="button" onclick="selectStudioTool('selector')" title="Más colores" style="width:28px;height:28px;border-radius:50%;border:1.5px dashed var(--line);background:transparent;color:var(--ink);display:flex;align-items:center;justify-content:center;cursor:pointer;">
            ${miIcon('mas')}
          </button>
        </div>
      </div>

      <div style="display:flex;gap:10px;align-items:center;margin-top:12px;">
        <button type="button" class="tool-btn" onclick="clearCanvas()" style="flex:1;background:var(--card2);border:1px solid var(--line);color:var(--ink);border-radius:8px;padding:10px;font-weight:700;font-size:0.84rem;display:flex;align-items:center;justify-content:center;gap:6px;cursor:pointer;">
          ${miIcon('escoba')} Limpiar
        </button>
        <button type="button" id="publishDirectBtn912" class="primary-btn" onclick="captureAndPublishDirect912()" style="flex:1.6;margin-top:0;background:#9B4DFF;border:none;border-radius:8px;padding:10px;font-weight:800;font-size:0.84rem;display:flex;align-items:center;justify-content:center;gap:6px;cursor:pointer;box-shadow:0 3px 10px rgba(155,77,255,0.4);">
          ${miIcon('guardar')} Guardar creación
        </button>
      </div>
      <div id="publishDirectStatus912" style="font-size:0.75rem;color:var(--ink-soft);text-align:center;margin-top:6px;min-height:16px;"></div>
    `;
  }

  function station2_912() {
    window._creaStep = window._creaStep ?? 0;
    const total = 6;
    const dots = Array.from({ length: total }).map((_, i) => `<div class="step-dot ${i <= window._creaStep ? 'done' : ''}"></div>`).join('');
    let body = '';
    const S = window.Crea912StepsView || {};

    if (window._creaStep === 0) body = typeof S.renderStep0 === 'function' ? S.renderStep0(total) : '';
    else if (window._creaStep === 1) body = renderStep1(total);
    else if (window._creaStep === 2) body = typeof S.renderStep2 === 'function' ? S.renderStep2(total) : '';
    else if (window._creaStep === 3) body = typeof S.renderStep3 === 'function' ? S.renderStep3(total) : '';
    else if (window._creaStep === 4) body = typeof S.renderStep4 === 'function' ? S.renderStep4() : '';
    else if (window._creaStep === 5) body = typeof S.renderStep5 === 'function' ? S.renderStep5() : '';

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
    renderStep1,
  };
})();
