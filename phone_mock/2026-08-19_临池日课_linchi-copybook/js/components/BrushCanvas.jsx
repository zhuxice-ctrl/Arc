// 临池日课 - 毛笔书写画布组件
// 特性：
// - 真实毛笔笔触：粗细随速度变化（快则细，慢则粗）
// - 墨色晕染：落笔处略粗，有晕染感
// - 支持触摸与鼠标

const { useRef, useEffect, useState, useImperativeHandle, forwardRef } = React;

const BrushCanvas = forwardRef(function BrushCanvas(
  { character = '永', showGuide = true, guideOpacity = 0.15, color = '#1a1714', onComplete, size = 300, paperColor = '#f2ead8' },
  ref
) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef(null);
  const lastTimeRef = useRef(0);
  const lastWidthRef = useRef(8);
  const strokesRef = useRef([]); // 记录所有笔画用于回放
  const currentStrokeRef = useRef([]);

  useImperativeHandle(ref, () => ({
    clear: () => clearCanvas(),
    undo: () => undoStroke(),
    getImageData: () => getImageData(),
    getStrokes: () => strokesRef.current,
    replay: () => replayStrokes(),
  }));

  // 初始化画布
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    // 初始化为宣纸色
    ctx.fillStyle = paperColor;
    ctx.fillRect(0, 0, size, size);
    // 画米字格
    drawGuideGrid(ctx, size);
    // 画底字（原帖参考）
    if (showGuide) {
      drawGuideChar(ctx, character, size, guideOpacity);
    }
  }, [character, size, showGuide, guideOpacity, paperColor]);

  function drawGuideGrid(ctx, s) {
    ctx.strokeStyle = 'rgba(176, 106, 59, 0.25)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    // 十字线
    ctx.beginPath();
    ctx.moveTo(s / 2, 0);
    ctx.lineTo(s / 2, s);
    ctx.moveTo(0, s / 2);
    ctx.lineTo(s, s / 2);
    // 对角线
    ctx.moveTo(0, 0);
    ctx.lineTo(s, s);
    ctx.moveTo(s, 0);
    ctx.lineTo(0, s);
    ctx.stroke();
    ctx.setLineDash([]);
    // 边框
    ctx.strokeStyle = 'rgba(176, 106, 59, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(1, 1, s - 2, s - 2);
  }

  function drawGuideChar(ctx, char, s, opacity) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.font = `${s * 0.75}px "Ma Shan Zheng", "ZCOOL XiaoWei", serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.fillText(char, s / 2, s / 2 + s * 0.04);
    ctx.restore();
  }

  function getPoint(e) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  // 计算毛笔笔触宽度：速度越快越细
  function getBrushWidth(p1, p2, dt) {
    const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const speed = dist / Math.max(dt, 1); // px/ms
    // 速度范围 0 ~ 3 px/ms 对应宽度 12 ~ 3
    const minW = 2.5;
    const maxW = 12;
    const normalizedSpeed = Math.min(speed / 2.5, 1);
    const w = maxW - normalizedSpeed * (maxW - minW);
    // 平滑过渡，避免突变
    const smoothed = lastWidthRef.current * 0.7 + w * 0.3;
    lastWidthRef.current = smoothed;
    return smoothed;
  }

  function drawBrushSegment(ctx, p1, p2, width) {
    // 用圆头线连接两点
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

    // 在端点加墨晕（用稍大一点的低透明度圆）
    if (width > 6) {
      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(p2.x, p2.y, width * 0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function startDraw(e) {
    e.preventDefault();
    drawingRef.current = true;
    const p = getPoint(e);
    lastPointRef.current = p;
    lastTimeRef.current = performance.now();
    lastWidthRef.current = 8;
    currentStrokeRef.current = [{ ...p, w: 8 }];

    // 落笔点：画一个墨点
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function moveDraw(e) {
    if (!drawingRef.current) return;
    e.preventDefault();
    const p = getPoint(e);
    const now = performance.now();
    const dt = now - lastTimeRef.current;
    const width = getBrushWidth(lastPointRef.current, p, dt);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    drawBrushSegment(ctx, lastPointRef.current, p, width);

    currentStrokeRef.current.push({ ...p, w: width });
    lastPointRef.current = p;
    lastTimeRef.current = now;
  }

  function endDraw(e) {
    if (!drawingRef.current) return;
    e.preventDefault();
    drawingRef.current = false;

    // 收笔：略细的尾端
    const p = lastPointRef.current;
    if (p && currentStrokeRef.current.length > 1) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.save();
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.7;
      const tailW = Math.max(lastWidthRef.current * 0.4, 1.5);
      ctx.beginPath();
      ctx.arc(p.x, p.y, tailW, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (currentStrokeRef.current.length > 0) {
      strokesRef.current.push([...currentStrokeRef.current]);
      currentStrokeRef.current = [];
    }
    lastPointRef.current = null;
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);
    ctx.fillStyle = paperColor;
    ctx.fillRect(0, 0, size, size);
    drawGuideGrid(ctx, size);
    if (showGuide) {
      drawGuideChar(ctx, character, size, guideOpacity);
    }
    strokesRef.current = [];
  }

  function undoStroke() {
    if (strokesRef.current.length === 0) return;
    strokesRef.current.pop();
    redrawAllStrokes();
  }

  function redrawAllStrokes() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);
    ctx.fillStyle = paperColor;
    ctx.fillRect(0, 0, size, size);
    drawGuideGrid(ctx, size);
    if (showGuide) {
      drawGuideChar(ctx, character, size, guideOpacity);
    }
    // 重绘所有笔画
    for (const stroke of strokesRef.current) {
      for (let i = 1; i < stroke.length; i++) {
        drawBrushSegment(ctx, stroke[i - 1], stroke[i], stroke[i].w);
      }
    }
  }

  function getImageData() {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    // 只导出字（不含参考字），所以重新画一张没有 guide 的
    const dpr = window.devicePixelRatio || 1;
    const off = document.createElement('canvas');
    off.width = size * dpr;
    off.height = size * dpr;
    const octx = off.getContext('2d');
    octx.scale(dpr, dpr);
    octx.fillStyle = paperColor;
    octx.fillRect(0, 0, size, size);
    // 重绘笔画
    for (const stroke of strokesRef.current) {
      for (let i = 1; i < stroke.length; i++) {
        drawBrushSegment(octx, stroke[i - 1], stroke[i], stroke[i].w);
      }
    }
    return off.toDataURL('image/png');
  }

  function replayStrokes() {
    // 回放所有笔画
    if (strokesRef.current.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    // 清屏
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);
    ctx.fillStyle = paperColor;
    ctx.fillRect(0, 0, size, size);
    drawGuideGrid(ctx, size);
    if (showGuide) {
      drawGuideChar(ctx, character, size, guideOpacity);
    }

    let strokeIdx = 0;
    let pointIdx = 0;

    function drawNext() {
      if (strokeIdx >= strokesRef.current.length) return;
      const stroke = strokesRef.current[strokeIdx];
      if (pointIdx === 0) {
        // 起笔
        ctx.save();
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(stroke[0].x, stroke[0].y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        pointIdx = 1;
        requestAnimationFrame(drawNext);
        return;
      }
      if (pointIdx < stroke.length) {
        drawBrushSegment(ctx, stroke[pointIdx - 1], stroke[pointIdx], stroke[pointIdx].w);
        pointIdx++;
        // 速度：每帧画 1-2 个点（模拟书写速度）
        setTimeout(drawNext, 16);
      } else {
        strokeIdx++;
        pointIdx = 0;
        // 笔画之间停顿
        setTimeout(drawNext, 150);
      }
    }
    drawNext();
  }

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          touchAction: 'none',
          cursor: 'crosshair',
        }}
        onMouseDown={startDraw}
        onMouseMove={moveDraw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={moveDraw}
        onTouchEnd={endDraw}
        onTouchCancel={endDraw}
      />
    </div>
  );
});

window.BrushCanvas = BrushCanvas;
