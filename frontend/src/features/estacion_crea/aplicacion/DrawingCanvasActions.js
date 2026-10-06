// frontend/src/features/estacion_crea/aplicacion/DrawingCanvasActions.js
(function () {
  function applyBrushStyle() {
    const ctx = window.ctx;
    if (!ctx) return;
    const erasing = window.erasing;
    const brushMode = window.brushMode;
    const brushSize = window.brushSize;
    const brushColor = window.brushColor;

    ctx.globalAlpha = erasing ? 1 : (brushMode === 'soft' ? 0.72 : 1);
    ctx.shadowBlur = erasing ? 0 : (brushMode === 'soft' ? brushSize * 1.3 : 0);
    ctx.shadowColor = brushColor;
    ctx.lineWidth = erasing ? Math.max(18, brushSize * 2.6) : brushSize;
    ctx.lineCap = brushMode === 'marker' ? 'square' : 'round';
    ctx.lineJoin = brushMode === 'marker' ? 'miter' : 'round';
    ctx.strokeStyle = erasing ? '#FBF7FF' : brushColor;
  }

  function updateBrushStatus() {
    const status = document.getElementById('brushStatus');
    if (!status) return;
    const erasing = window.erasing;
    const brushMode = window.brushMode;
    const brushSize = window.brushSize;
    const label = erasing ? 'Borrador' : (brushMode === 'soft' ? 'Pincel suave' : brushMode === 'marker' ? 'Marcador' : 'Pincel redondo');
    status.innerText = `${label} · tamaño ${brushSize}`;
  }

  function initCanvas() {
    const canvas = document.getElementById('drawCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    window.ctx = ctx;
    ctx.fillStyle = '#FBF7FF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    window.erasing = false;
    applyBrushStyle();
    updateBrushStatus();
    window.strokeHistory = [];

    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
    }

    canvas.onpointerdown = (e) => {
      window.drawing = true;
      if (!window.strokeHistory) window.strokeHistory = [];
      window.strokeHistory.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
      if (window.strokeHistory.length > 25) window.strokeHistory.shift();
      applyBrushStyle();
      const p = getPos(e);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
    };

    canvas.onpointermove = (e) => {
      if (!window.drawing) return;
      const p = getPos(e);
      ctx.lineTo(p.x, p.y);
      applyBrushStyle();
      ctx.stroke();
    };

    window.addEventListener('pointerup', () => { window.drawing = false; });
  }

  function setBrush(c, el) {
    window.brushColor = c;
    window.erasing = false;
    const eraserBtn = document.getElementById('eraserBtn');
    if (eraserBtn) eraserBtn.classList.remove('active');
    document.querySelectorAll('.brush-color').forEach((b) => b.classList.remove('sel'));
    if (el) el.classList.add('sel');
    applyBrushStyle();
    updateBrushStatus();
  }

  function setBrushMode(mode, el) {
    window.brushMode = mode;
    window.erasing = false;
    document.querySelectorAll('[data-mode]').forEach((b) => b.classList.remove('active'));
    if (el) el.classList.add('active');
    const eraserBtn = document.getElementById('eraserBtn');
    if (eraserBtn) eraserBtn.classList.remove('active');
    applyBrushStyle();
    updateBrushStatus();
  }

  function setBrushSize(size, el) {
    window.brushSize = size;
    document.querySelectorAll('.size-chip').forEach((b) => b.classList.remove('active'));
    if (el) el.classList.add('active');
    applyBrushStyle();
    updateBrushStatus();
  }

  function setEraser() {
    window.erasing = true;
    document.querySelectorAll('.brush-color').forEach((b) => b.classList.remove('sel'));
    const eraserBtn = document.getElementById('eraserBtn');
    if (eraserBtn) eraserBtn.classList.add('active');
    applyBrushStyle();
    updateBrushStatus();
  }

  function clearCanvas() {
    const ctx = window.ctx;
    if (!ctx) return;
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#FBF7FF';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    window.erasing = false;
    window.strokeHistory = [];
    const eraserBtn = document.getElementById('eraserBtn');
    if (eraserBtn) eraserBtn.classList.remove('active');
    applyBrushStyle();
    updateBrushStatus();
  }

  function undoLastStroke() {
    const ctx = window.ctx;
    if (!ctx || !window.strokeHistory || window.strokeHistory.length === 0) return;
    const last = window.strokeHistory.pop();
    ctx.putImageData(last, 0, 0);
  }

  function finishDrawing(total) {
    const canvas = document.getElementById('drawCanvas');
    if (canvas) {
      window._creaImg = canvas.toDataURL('image/jpeg', 0.86);
    }
    if (typeof window.creaNext === 'function') {
      window.creaNext(total);
    }
  }

  // Compatibilidad global
  window.applyBrushStyle = applyBrushStyle;
  window.updateBrushStatus = updateBrushStatus;
  window.initCanvas = initCanvas;
  window.setBrush = setBrush;
  window.setBrushMode = setBrushMode;
  window.setBrushSize = setBrushSize;
  window.setEraser = setEraser;
  window.clearCanvas = clearCanvas;
  window.undoLastStroke = undoLastStroke;
  window.finishDrawing = finishDrawing;

  window.DrawingCanvasActions = {
    applyBrushStyle,
    updateBrushStatus,
    initCanvas,
    setBrush,
    setBrushMode,
    setBrushSize,
    setEraser,
    clearCanvas,
    undoLastStroke,
    finishDrawing,
  };
})();
