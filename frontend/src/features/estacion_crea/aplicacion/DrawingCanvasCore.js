// frontend/src/features/estacion_crea/aplicacion/DrawingCanvasCore.js
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

  function updateStrokePreview() {
    const canvas = document.getElementById('strokePreviewCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const size = Number(window.brushSize || 7);
    const color = window.erasing ? '#FBF7FF' : (window.brushColor || '#9B4DFF');
    const mode = window.brushMode || 'round';
    ctx.lineCap = mode === 'marker' ? 'square' : 'round';
    ctx.lineWidth = window.erasing ? Math.max(14, size * 2) : Math.max(3, size);
    ctx.strokeStyle = color;
    ctx.globalAlpha = mode === 'soft' && !window.erasing ? 0.72 : 1;
    ctx.shadowBlur = mode === 'soft' && !window.erasing ? size * 1.2 : 0;
    ctx.shadowColor = color;
    ctx.beginPath();
    ctx.moveTo(14, canvas.height / 2 + 6);
    ctx.bezierCurveTo(45, canvas.height / 2 - 14, 85, canvas.height / 2 + 16, 126, canvas.height / 2 - 6);
    ctx.stroke();
  }

  function initCanvas() {
    const canvas = document.getElementById('drawCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    window.ctx = ctx;
    ctx.fillStyle = '#FBF7FF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    window.erasing = false;
    window.strokeHistory = [];
    window.redoHistory = [];
    window.canvasZoom = 100;
    applyBrushStyle();
    updateBrushStatus();
    updateStrokePreview();

    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / (rect.width || canvas.width);
      const scaleY = canvas.height / (rect.height || canvas.height);
      return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
    }

    function saveHistory() {
      if (!window.strokeHistory) window.strokeHistory = [];
      window.strokeHistory.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
      if (window.strokeHistory.length > 25) window.strokeHistory.shift();
      window.redoHistory = [];
    }

    let shapeStart = null;
    let shapeSnapshot = null;

    canvas.onpointerdown = (e) => {
      const tool = window.activeStudioTool || 'pincel';
      const p = getPos(e);

      if (tool === 'mover') return;

      if (tool === 'selector') {
        try {
          const pixel = ctx.getImageData(Math.floor(p.x), Math.floor(p.y), 1, 1).data;
          const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1).toUpperCase()}`;
          if (typeof window.setBrush === 'function') window.setBrush(hex);
        } catch (_) {}
        return;
      }

      if (tool === 'relleno') {
        saveHistory();
        ctx.fillStyle = window.brushColor || '#9B4DFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return;
      }

      if (tool === 'formas') {
        saveHistory();
        shapeSnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
        shapeStart = p;
        window.drawing = true;
        return;
      }

      // pincel, lapiz, marcador, borrador
      window.drawing = true;
      saveHistory();
      applyBrushStyle();
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + 0.1, p.y + 0.1);
      ctx.stroke();
    };

    canvas.onpointermove = (e) => {
      if (!window.drawing) return;
      const tool = window.activeStudioTool || 'pincel';
      const p = getPos(e);

      if (tool === 'formas' && shapeStart && shapeSnapshot) {
        ctx.putImageData(shapeSnapshot, 0, 0);
        applyBrushStyle();
        ctx.beginPath();
        const rx = (p.x - shapeStart.x) / 2;
        const ry = (p.y - shapeStart.y) / 2;
        ctx.ellipse(shapeStart.x + rx, shapeStart.y + ry, Math.abs(rx), Math.abs(ry), 0, 0, Math.PI * 2);
        ctx.stroke();
        return;
      }

      if (tool === 'mover' || tool === 'selector' || tool === 'relleno') return;

      applyBrushStyle();
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    };

    const stopDrawing = () => {
      window.drawing = false;
      shapeStart = null;
      shapeSnapshot = null;
    };
    canvas.onpointerup = stopDrawing;
    canvas.onpointercancel = stopDrawing;
    window.addEventListener('pointerup', stopDrawing);
  }

  function captureCanvasImage() {
    const canvas = document.getElementById('drawCanvas');
    if (!canvas) return null;
    return canvas.toDataURL('image/jpeg', 0.88);
  }

  window.applyBrushStyle = applyBrushStyle;
  window.updateBrushStatus = updateBrushStatus;
  window.updateStrokePreview = updateStrokePreview;
  window.initCanvas = initCanvas;
  window.captureCanvasImage = captureCanvasImage;

  window.DrawingCanvasCore = {
    applyBrushStyle,
    updateBrushStatus,
    updateStrokePreview,
    initCanvas,
    captureCanvasImage,
  };
})();
