/* ============================================================
   PHOSPHOR Elastic Strings — 电磁拉丝
   - 多个锚点，拖拽拉出弹性贝塞尔曲线
   - Hooke 定律回弹 + 阻尼
   - 光丝有辉光、粗细变化、波动
   - 松手后弹簧振荡衰减
   ============================================================ */

(function () {
  'use strict';

  const canvas = document.getElementById('elasticCanvas');
  const anchorsContainer = document.getElementById('elasticAnchors');
  if (!canvas || !anchorsContainer) return;

  let ctx, w, h;
  let anchors = [];
  let strings = []; // 锚点之间的连接线
  let dragAnchor = null;
  let dragOffsetX = 0, dragOffsetY = 0;

  const ANCHOR_COUNT = 5;
  const SPRING_K = 0.06;       // 弹簧劲度
  const SPRING_DAMPING = 0.86; // 阻尼
  const WAVE_AMPLITUDE = 8;    // 弦波动幅度

  // ========== 初始化 ==========
  function init() {
    const info = PH.setupCanvas(canvas);
    ctx = info.ctx;
    w = info.w;
    h = info.h;

    // 清空旧锚点
    anchorsContainer.innerHTML = '';
    anchors = [];
    strings = [];

    // 创建锚点（水平排列，略有垂直随机）
    for (let i = 0; i < ANCHOR_COUNT; i++) {
      const x = (w / (ANCHOR_COUNT + 1)) * (i + 1);
      const y = h / 2 + PH.random(-60, 60);

      const anchor = {
        x: x,
        y: y,
        ox: x, // 原点
        oy: y,
        vx: 0,
        vy: 0,
        el: null,
        index: i
      };

      // DOM 锚点
      const el = document.createElement('div');
      el.className = 'elastic-anchor';
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.dataset.index = i;
      anchorsContainer.appendChild(el);
      anchor.el = el;

      anchors.push(anchor);
    }

    // 创建连线（相邻锚点之间一条弦）
    for (let i = 0; i < ANCHOR_COUNT - 1; i++) {
      strings.push({
        a: anchors[i],
        b: anchors[i + 1],
        segments: 30,
        wavePhase: PH.random(0, Math.PI * 2),
        waveSpeed: PH.random(0.8, 1.5)
      });
    }

    bindDragEvents();
  }

  // ========== 拖拽事件 ==========
  function bindDragEvents() {
    anchors.forEach(function (anchor) {
      anchor.el.addEventListener('mousedown', function (e) {
        e.preventDefault();
        dragAnchor = anchor;
        dragOffsetX = e.clientX - anchor.el.getBoundingClientRect().left - 10;
        dragOffsetY = e.clientY - anchor.el.getBoundingClientRect().top - 10;
        anchor.el.classList.add('is-dragging');
        PH.Cursor && PH.Cursor.setDrag(true);
      });
    });
  }

  window.addEventListener('mousemove', function (e) {
    if (!dragAnchor) return;
    const rect = canvas.getBoundingClientRect();
    dragAnchor.x = e.clientX - rect.left;
    dragAnchor.y = e.clientY - rect.top;
    // 限制在画布内
    dragAnchor.x = PH.clamp(dragAnchor.x, 10, w - 10);
    dragAnchor.y = PH.clamp(dragAnchor.y, 10, h - 10);
  }, { passive: true });

  window.addEventListener('mouseup', function () {
    if (dragAnchor) {
      dragAnchor.el.classList.remove('is-dragging');
      dragAnchor = null;
      PH.Cursor && PH.Cursor.setDrag(false);
    }
  });

  // ========== 物理更新 ==========
  function updateAnchors(dt) {
    const fdt = dt * 60;
    for (let i = 0; i < anchors.length; i++) {
      const a = anchors[i];
      if (a === dragAnchor) {
        // 被拖拽：直接设置位置，速度=位移
        // 但要给后续的弹簧一个初始速度
        continue;
      }

      // 胡克定律：向原点回归
      const dx = a.ox - a.x;
      const dy = a.oy - a.y;
      const ax = dx * SPRING_K;
      const ay = dy * SPRING_K;

      a.vx += ax * fdt;
      a.vy += ay * fdt;

      // 阻尼
      const dmp = Math.pow(SPRING_DAMPING, fdt);
      a.vx *= dmp;
      a.vy *= dmp;

      a.x += a.vx * fdt;
      a.y += a.vy * fdt;
    }

    // 更新 DOM 位置
    for (let i = 0; i < anchors.length; i++) {
      const a = anchors[i];
      a.el.style.transform = `translate(${a.x}px, ${a.y}px) translate(-50%, -50%)`;
    }
  }

  // ========== 绘制弹性弦 ==========
  function drawStrings(dt) {
    for (let i = 0; i < strings.length; i++) {
      const s = strings[i];
      const a = s.a;
      const b = s.b;

      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      const restLen = Math.sqrt(
        (b.ox - a.ox) * (b.ox - a.ox) + (b.oy - a.oy) * (b.oy - a.oy)
      );
      const stretch = (len - restLen) / restLen; // 拉伸比例

      // 弦的粗细与拉伸量相关（越拉越细）
      const baseWidth = Math.max(0.5, 3 - stretch * 8);

      // 弦的辉光强度
      const glowIntensity = Math.min(1, stretch * 3 + 0.2);

      // 计算波：距离两端距离越远，波幅越大（驻波基模）
      s.wavePhase += s.waveSpeed * dt * (1 + stretch * 2);

      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let seg = 0; seg <= s.segments; seg++) {
        const t = seg / s.segments;
        const px = a.x + dx * t;
        const py = a.y + dy * t;

        // 正弦波偏移（垂直于弦方向）
        // 驻波形态：sin(PI * t)，两端为0
        const wave = Math.sin(Math.PI * t) * Math.sin(s.wavePhase + t * 3) * WAVE_AMPLITUDE * (1 + stretch * 2);

        // 垂直方向
        const nx = -dy / len;
        const ny = dx / len;

        const wx = px + nx * wave;
        const wy = py + ny * wave;

        if (seg === 0) {
          ctx.moveTo(wx, wy);
        } else {
          ctx.lineTo(wx, wy);
        }
      }

      // 外发光（多次描边模拟）
      const hue = 170 + stretch * 20; // 拉伸越大越偏青
      ctx.shadowBlur = 20 * glowIntensity;
      ctx.shadowColor = `hsla(${hue}, 90%, 60%, ${glowIntensity * 0.8})`;
      ctx.strokeStyle = `hsla(${hue}, 95%, 75%, ${0.7 + glowIntensity * 0.3})`;
      ctx.lineWidth = baseWidth;
      ctx.stroke();

      // 内芯（更亮）
      ctx.shadowBlur = 0;
      ctx.strokeStyle = `hsla(${hue}, 100%, 90%, ${0.9})`;
      ctx.lineWidth = baseWidth * 0.4;
      ctx.stroke();
    }
  }

  // ========== 主循环 ==========
  let isActive = false;

  function elasticLoop(dt) {
    ctx.clearRect(0, 0, w, h);

    updateAnchors(dt);
    drawStrings(dt);
  }

  // ========== IntersectionObserver ==========
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        if (!isActive) {
          isActive = true;
          PH.RAF.add(elasticLoop);
        }
      } else {
        if (isActive) {
          isActive = false;
          PH.RAF.remove(elasticLoop);
          if (dragAnchor) {
            dragAnchor.el.classList.remove('is-dragging');
            dragAnchor = null;
            PH.Cursor && PH.Cursor.setDrag(false);
          }
        }
      }
    });
  }, { threshold: 0.1 });

  io.observe(canvas.parentElement);

  // ========== Resize ==========
  let resizeTimer = null;
  window.addEventListener('resize', function () {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (dragAnchor) {
        dragAnchor.el.classList.remove('is-dragging');
        dragAnchor = null;
      }
      init();
    }, 200);
  });

  init();

})();
