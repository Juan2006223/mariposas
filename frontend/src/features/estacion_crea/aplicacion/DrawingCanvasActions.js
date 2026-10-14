// frontend/src/features/estacion_crea/aplicacion/DrawingCanvasActions.js
(function () {
  function setBrush(c, el) {
    window.brushColor = c;
    window.erasing = false;
    document.querySelectorAll('.brush-color').forEach((b) => b.classList.remove('sel'));
    if (el) el.classList.add('sel');
    selectStudioTool('pincel');
    if (typeof window.applyBrushStyle === 'function') window.applyBrushStyle();
    if (typeof window.updateBrushStatus === 'function') window.updateBrushStatus();
    if (typeof window.updateStrokePreview === 'function') window.updateStrokePreview();
  }

  function setBrushMode(mode, el) {
    window.brushMode = mode;
    window.erasing = false;
    document.querySelectorAll('[data-brush-mode]').forEach((b) => b.classList.remove('active'));
    if (el) el.classList.add('active');
    if (typeof window.applyBrushStyle === 'function') window.applyBrushStyle();
    if (typeof window.updateBrushStatus === 'function') window.updateBrushStatus();
    if (typeof window.updateStrokePreview === 'function') window.updateStrokePreview();
  }

  function setBrushSize(size) {
    window.brushSize = Number(size);
    const numEl = document.getElementById('brushSizeValue');
    if (numEl) numEl.innerText = size;
    if (typeof window.applyBrushStyle === 'function') window.applyBrushStyle();
    if (typeof window.updateBrushStatus === 'function') window.updateBrushStatus();
    if (typeof window.updateStrokePreview === 'function') window.updateStrokePreview();
  }

  function selectStudioTool(toolName) {
    window.activeStudioTool = toolName;
    document.querySelectorAll('.studio-tool-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.tool === toolName);
    });
    if (toolName === 'borrador') {
      window.erasing = true;
    } else {
      window.erasing = false;
      if (toolName === 'lapiz') { window.brushMode = 'round'; window.brushSize = 4; }
      else if (toolName === 'marcador') { window.brushMode = 'marker'; window.brushSize = 13; }
      else if (toolName === 'pincel') { window.brushMode = 'round'; }
      const slider = document.getElementById('brushSizeSlider');
      if (slider) slider.value = window.brushSize || 7;
      const numEl = document.getElementById('brushSizeValue');
      if (numEl) numEl.innerText = window.brushSize || 7;
    }
    if (typeof window.applyBrushStyle === 'function') window.applyBrushStyle();
    if (typeof window.updateBrushStatus === 'function') window.updateBrushStatus();
    if (typeof window.updateStrokePreview === 'function') window.updateStrokePreview();
  }

  function setEraser() { selectStudioTool('borrador'); }

  function clearCanvas() {
    const ctx = window.ctx;
    if (!ctx) return;
    if (!window.strokeHistory) window.strokeHistory = [];
    window.strokeHistory.push(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height));
    window.redoHistory = [];
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#FBF7FF';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (typeof window.applyBrushStyle === 'function') window.applyBrushStyle();
    if (typeof window.updateBrushStatus === 'function') window.updateBrushStatus();
    if (typeof window.updateStrokePreview === 'function') window.updateStrokePreview();
  }

  function undoLastStroke() {
    const ctx = window.ctx;
    if (!ctx || !window.strokeHistory || window.strokeHistory.length === 0) return;
    if (!window.redoHistory) window.redoHistory = [];
    window.redoHistory.push(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height));
    const last = window.strokeHistory.pop();
    ctx.putImageData(last, 0, 0);
  }

  function redoStroke() {
    const ctx = window.ctx;
    if (!ctx || !window.redoHistory || window.redoHistory.length === 0) return;
    if (!window.strokeHistory) window.strokeHistory = [];
    window.strokeHistory.push(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height));
    const next = window.redoHistory.pop();
    ctx.putImageData(next, 0, 0);
  }

  function setCanvasZoom(delta) {
    const current = window.canvasZoom || 100;
    const next = Math.max(50, Math.min(200, current + delta));
    window.canvasZoom = next;
    const label = document.getElementById('zoomValue');
    if (label) label.innerText = `${next} %`;
    const canvas = document.getElementById('drawCanvas');
    if (canvas) {
      canvas.style.transform = `scale(${next / 100})`;
      canvas.style.transformOrigin = 'center center';
    }
  }

  function finishDrawing(total) {
    const img = typeof window.captureCanvasImage === 'function' ? window.captureCanvasImage() : null;
    if (img) window._creaImg = img;
    if (typeof window.creaNext === 'function') window.creaNext(total);
  }

  // Compatibilidad global
  window.setBrush = setBrush;
  window.setBrushMode = setBrushMode;
  window.setBrushSize = setBrushSize;
  window.selectStudioTool = selectStudioTool;
  window.setEraser = setEraser;
  window.clearCanvas = clearCanvas;
  window.undoLastStroke = undoLastStroke;
  window.redoStroke = redoStroke;
  window.setCanvasZoom = setCanvasZoom;
  window.finishDrawing = finishDrawing;

  window.DrawingCanvasActions = {
    applyBrushStyle: () => (window.DrawingCanvasCore && window.DrawingCanvasCore.applyBrushStyle()),
    updateBrushStatus: () => (window.DrawingCanvasCore && window.DrawingCanvasCore.updateBrushStatus()),
    updateStrokePreview: () => (window.DrawingCanvasCore && window.DrawingCanvasCore.updateStrokePreview()),
    initCanvas: () => (window.DrawingCanvasCore && window.DrawingCanvasCore.initCanvas()),
    captureCanvasImage: () => (window.DrawingCanvasCore && window.DrawingCanvasCore.captureCanvasImage()),
    setBrush,
    setBrushMode,
    setBrushSize,
    selectStudioTool,
    setEraser,
    clearCanvas,
    undoLastStroke,
    redoStroke,
    setCanvasZoom,
    finishDrawing,
  };
})();
