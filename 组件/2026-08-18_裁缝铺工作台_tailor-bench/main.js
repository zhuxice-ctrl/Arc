/* ============================================================
   V3 裁缝铺 · 拟物化组件实验室
   纯 vanilla JS — 零依赖
   ============================================================ */
(function () {
  'use strict';

  // ========= 工具函数 =========
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  // RAF 管理
  const rafRegistry = new Set();
  let rafRunning = false;
  let globalRafId = null;

  function rafLoop(ts) {
    globalRafId = requestAnimationFrame(rafLoop);
    rafRegistry.forEach(fn => {
      try { fn(ts); } catch (e) { console.warn(e); }
    });
  }

  function startRaf() {
    if (rafRunning) return;
    rafRunning = true;
    globalRafId = requestAnimationFrame(rafLoop);
  }

  function stopRaf() {
    if (!rafRunning) return;
    rafRunning = false;
    if (globalRafId) cancelAnimationFrame(globalRafId);
    globalRafId = null;
  }

  function addRaf(fn) {
    rafRegistry.add(fn);
    if (!isPageHidden && rafRegistry.size > 0) startRaf();
    return fn;
  }

  function removeRaf(fn) {
    rafRegistry.delete(fn);
    if (rafRegistry.size === 0) stopRaf();
  }

  // 页面可见性
  let isPageHidden = document.hidden;
  document.addEventListener('visibilitychange', () => {
    isPageHidden = document.hidden;
    if (isPageHidden) {
      stopRaf();
    } else {
      if (rafRegistry.size > 0) startRaf();
    }
  });

  // Reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ========= 自定义光标 =========
  const cursor = $('#cursor');
  const cursorRipple = $('#cursor-ripple');
  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;
  let targetX = cursorX;
  let targetY = cursorY;

  // 初始化在屏幕中央（使用 transform 定位，CSS 中 top/left 为 0）
  cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;

  function updateCursorPos(ts) {
    // 惯性平滑跟随
    cursorX = lerp(cursorX, targetX, 0.25);
    cursorY = lerp(cursorY, targetY, 0.25);
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
  }
  addRaf(updateCursorPos);

  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;

    // 悬停检测
    const hoverEl = document.elementFromPoint(e.clientX, e.clientY);
    if (hoverEl) {
      const interactive = hoverEl.closest('button, [data-cursor-hover], .tape-tip, .spool-wheel, .sewing-pedal, .chalk-fabric, .iron-tool, .button-item, .color-swatch, .nav-dot');
      if (interactive) {
        cursor.classList.add('is-hover');
      } else {
        cursor.classList.remove('is-hover');
      }
    }
  });

  // 点击涟漪
  let rippleTimer = null;
  document.addEventListener('mousedown', (e) => {
    cursor.classList.add('is-active');

    // 涟漪
    if (rippleTimer) clearTimeout(rippleTimer);
    cursorRipple.classList.remove('is-rippling');
    // 重排以重启动画
    void cursorRipple.offsetWidth;
    cursorRipple.style.left = e.clientX + 'px';
    cursorRipple.style.top = e.clientY + 'px';
    cursorRipple.classList.add('is-rippling');
    rippleTimer = setTimeout(() => {
      cursorRipple.classList.remove('is-rippling');
    }, 600);
  });

  document.addEventListener('mouseup', () => {
    cursor.classList.remove('is-active');
  });

  // 离开窗口时隐藏
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
  });

  // ========= 顶栏导航点 =========
  const workshopEl = $('.workshop');
  const navDots = $$('.nav-dot');
  const exhibits = $$('.exhibit');

  navDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetId = dot.dataset.target;
      const target = document.getElementById(targetId);
      if (target && workshopEl) {
        const targetLeft = target.offsetLeft - workshopEl.clientWidth / 2 + target.clientWidth / 2;
        workshopEl.scrollTo({ left: targetLeft, behavior: 'smooth' });
      }
    });
  });

  // 滚动同步导航点
  let scrollRafScheduled = false;
  function updateNavDots() {
    if (!workshopEl) return;
    const centerX = workshopEl.scrollLeft + workshopEl.clientWidth / 2;
    let closestIdx = 0;
    let closestDist = Infinity;
    exhibits.forEach((ex, i) => {
      const exCenter = ex.offsetLeft + ex.clientWidth / 2;
      const dist = Math.abs(exCenter - centerX);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    });
    navDots.forEach((d, i) => d.classList.toggle('is-active', i === closestIdx));
  }

  workshopEl.addEventListener('scroll', () => {
    if (scrollRafScheduled) return;
    scrollRafScheduled = true;
    requestAnimationFrame(() => {
      scrollRafScheduled = false;
      updateNavDots();
    });
  });
  updateNavDots();

  // ========= 展区 01: 拉皮尺 =========
  (function initMeasure() {
    const tapeTip = $('#tapeTip');
    const tapeSurface = $('#tapeSurface');
    const tapeEl = $('#measureTape');
    if (!tapeTip || !tapeSurface) return;

    const MAX_EXTEND = 260; // px
    const SPRING_K = 0.08;  // 弹簧劲度系数
    const DAMPING = 0.82;  // 阻尼
    let pullX = 0;          // 当前拉出长度
    let velX = 0;           // 速度
    let isDragging = false;
    let dragStartX = 0;
    let dragStartPull = 0;

    function renderTape() {
      const width = Math.max(0, pullX);
      tapeSurface.style.maxWidth = width + 'px';
      tapeTip.style.left = width + 'px';
    }
    renderTape();

    // 物理积分 — 松手弹簧回卷
    function springStep() {
      if (isDragging) return;
      if (pullX <= 0 && Math.abs(velX) < 0.1) {
        pullX = 0;
        velX = 0;
        renderTape();
        return;
      }
      // Hooke's law: F = -kx, 加上阻尼
      const force = -SPRING_K * pullX;
      velX = (velX + force) * DAMPING;
      pullX += velX;
      if (pullX < 0) pullX = 0;
      renderTape();
    }
    addRaf(springStep);

    tapeTip.addEventListener('mousedown', (e) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartPull = pullX;
      velX = 0;
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartX;
      pullX = clamp(dragStartPull + dx, 0, MAX_EXTEND);
      velX = dx > 0 ? 2 : -2; // 粗略方向速度用于回弹手感
      renderTape();
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        // 给一个初始回弹速度
        if (pullX > 10) velX = -3;
      }
    });

    // 触屏支持
    tapeTip.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      isDragging = true;
      dragStartX = t.clientX;
      dragStartPull = pullX;
      velX = 0;
      e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const t = e.touches[0];
      const dx = t.clientX - dragStartX;
      pullX = clamp(dragStartPull + dx, 0, MAX_EXTEND);
      renderTape();
    }, { passive: true });

    document.addEventListener('touchend', () => {
      if (isDragging) {
        isDragging = false;
        if (pullX > 10) velX = -3;
      }
    });
  })();

  // ========= 展区 02: 缝纫机 =========
  (function initSewing() {
    const pedal = $('#sewingPedal');
    const needleBar = $('.sewing-needle-bar');
    const wheel = $('.sewing-wheel');
    const stitchesEl = $('#fabricStitches');
    const fabricEl = $('#sewingFabric');
    if (!pedal || !needleBar) return;

    let isPressed = false;
    let needlePhase = 0;
    let speed = 0;
    const TARGET_SPEED = 0.35; // rad per frame
    const ACCEL = 0.02;
    const DECEL = 0.015;

    function sewingStep() {
      // 加速/减速
      if (isPressed) {
        speed = Math.min(speed + ACCEL, TARGET_SPEED);
      } else {
        speed = Math.max(speed - DECEL, 0);
      }

      if (speed > 0.001) {
        needlePhase += speed;
        // 针上下正弦运动
        const needleY = Math.sin(needlePhase) * 12;
        needleBar.style.transform = `translateX(-50%) translateY(${needleY}px)`;

        // 手轮旋转
        const rot = needlePhase * (180 / Math.PI);
        wheel.style.transform = `translateY(-50%) rotate(${rot}deg)`;

        // 布料送出 + 针迹滚动
        const scrollX = -needlePhase * 10;
        if (stitchesEl) {
          stitchesEl.style.transform = `translateY(-50%) translateX(${scrollX % 24}px)`;
        }
        if (fabricEl) {
          const fabricShift = (needlePhase * 2) % 8;
          fabricEl.style.transform = `translateY(${fabricShift}px)`;
        }
      }
    }
    addRaf(sewingStep);

    function pressPedal(e) {
      isPressed = true;
      pedal.classList.add('is-pressed');
      if (e) e.preventDefault();
    }

    function releasePedal() {
      isPressed = false;
      pedal.classList.remove('is-pressed');
    }

    pedal.addEventListener('mousedown', pressPedal);
    document.addEventListener('mouseup', releasePedal);
    pedal.addEventListener('mouseleave', releasePedal);

    // 触屏
    pedal.addEventListener('touchstart', pressPedal, { passive: false });
    pedal.addEventListener('touchend', releasePedal);
    pedal.addEventListener('touchcancel', releasePedal);
  })();

  // ========= 展区 03: 绕线轴 =========
  (function initSpool() {
    const spoolWheel = $('#spoolWheel');
    const spoolCore = $('#spoolCore');
    const spoolCount = $('#spoolCount');
    const colorSwatches = $$('.color-swatch');
    if (!spoolWheel || !spoolCore) return;

    let angle = 0;        // 当前角度 (rad)
    let angularVel = 0;   // 角速度
    let isDragging = false;
    let lastAngle = 0;
    let lastDragTime = 0;
    let turnCount = 0;    // 完整匝数
    let lastTurnAngle = 0;
    let threadColor = '#C84C5F';
    const FRICTION = 0.97;

    // 选中第一个色
    if (colorSwatches[0]) {
      colorSwatches[0].classList.add('is-selected');
      threadColor = colorSwatches[0].dataset.color;
      updateThreadColor();
    }

    colorSwatches.forEach(sw => {
      sw.addEventListener('click', () => {
        colorSwatches.forEach(s => s.classList.remove('is-selected'));
        sw.classList.add('is-selected');
        threadColor = sw.dataset.color;
        updateThreadColor();
      });
    });

    function updateThreadColor() {
      spoolCore.style.setProperty('--thread-color', threadColor);
      spoolCore.classList.add('has-thread');
      if (turnCount > 0) {
        spoolCore.style.background = `linear-gradient(90deg,
          var(--wood-500) 0%,
          ${threadColor} 15%,
          ${threadColor} 100%
        )`;
      }
    }

    function getAngleFromEvent(clientX, clientY) {
      const rect = spoolWheel.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      return Math.atan2(clientY - cy, clientX - cx);
    }

    function renderSpool() {
      spoolWheel.style.transform = `rotate(${angle}rad)`;
      // 线的厚度随匝数变化
      const threadRatio = clamp(turnCount / 50, 0, 1);
      if (threadRatio > 0 && spoolCore) {
        spoolCore.classList.add('has-thread');
        spoolCore.style.background = `linear-gradient(90deg,
          var(--wood-500) 0%,
          ${threadColor} ${10 + threadRatio * 40}%,
          ${threadColor} 100%
        )`;
      }
      if (spoolCount) spoolCount.textContent = Math.floor(turnCount);
    }

    function spoolStep() {
      if (isDragging) return;
      if (Math.abs(angularVel) < 0.001) return;

      angularVel *= FRICTION;
      angle += angularVel;

      // 累计匝数
      const deltaTurns = Math.abs(angularVel) / (2 * Math.PI);
      turnCount += deltaTurns;

      renderSpool();
    }
    addRaf(spoolStep);

    spoolWheel.addEventListener('mousedown', (e) => {
      isDragging = true;
      lastAngle = getAngleFromEvent(e.clientX, e.clientY);
      lastDragTime = performance.now();
      angularVel = 0;
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const curAngle = getAngleFromEvent(e.clientX, e.clientY);
      let delta = curAngle - lastAngle;
      // 处理跨越 -pi/pi
      if (delta > Math.PI) delta -= 2 * Math.PI;
      if (delta < -Math.PI) delta += 2 * Math.PI;

      angle += delta;
      const now = performance.now();
      const dt = Math.max(now - lastDragTime, 1);
      angularVel = delta / (dt / 16); // 近似每帧速度

      // 累计匝数
      turnCount += Math.abs(delta) / (2 * Math.PI);

      lastAngle = curAngle;
      lastDragTime = now;
      renderSpool();
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // 触屏
    spoolWheel.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      isDragging = true;
      lastAngle = getAngleFromEvent(t.clientX, t.clientY);
      lastDragTime = performance.now();
      angularVel = 0;
      e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const t = e.touches[0];
      const curAngle = getAngleFromEvent(t.clientX, t.clientY);
      let delta = curAngle - lastAngle;
      if (delta > Math.PI) delta -= 2 * Math.PI;
      if (delta < -Math.PI) delta += 2 * Math.PI;
      angle += delta;
      turnCount += Math.abs(delta) / (2 * Math.PI);
      lastAngle = curAngle;
      renderSpool();
    }, { passive: true });

    document.addEventListener('touchend', () => {
      isDragging = false;
    });

    renderSpool();
  })();

  // ========= 展区 04: 划粉片 =========
  (function initChalk() {
    const canvas = $('#chalkCanvas');
    const fabric = $('#chalkFabric');
    const clearBtn = $('#chalkClear');
    if (!canvas || !fabric) return;

    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let particles = [];

    function resizeCanvas() {
      const rect = fabric.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;
      return { x: clientX - rect.left, y: clientY - rect.top };
    }

    function drawLine(x1, y1, x2, y2) {
      // 画粉笔线 — 多条随机偏移的淡色线模拟粉笔颗粒
      const segments = 3;
      for (let i = 0; i < segments; i++) {
        ctx.strokeStyle = `rgba(200, 180, 150, ${0.3 + Math.random() * 0.3})`;
        ctx.lineWidth = 1.5 + Math.random() * 1.5;
        ctx.beginPath();
        ctx.moveTo(x1 + (Math.random() - 0.5) * 2, y1 + (Math.random() - 0.5) * 2);
        ctx.lineTo(x2 + (Math.random() - 0.5) * 2, y2 + (Math.random() - 0.5) * 2);
        ctx.stroke();
      }

      // 添加散落颗粒
      const dist = Math.hypot(x2 - x1, y2 - y1);
      const numParticles = Math.floor(dist / 4);
      for (let i = 0; i < numParticles; i++) {
        const t = i / numParticles;
        const px = lerp(x1, x2, t) + (Math.random() - 0.5) * 6;
        const py = lerp(y1, y2, t) + (Math.random() - 0.5) * 6;
        particles.push({
          x: px, y: py,
          size: 0.5 + Math.random() * 1.5,
          alpha: 0.4 + Math.random() * 0.4,
          decay: 0.002 + Math.random() * 0.003,
          vx: (Math.random() - 0.5) * 0.2,
          vy: -0.1 + Math.random() * 0.2
        });
      }
    }

    // 颗粒消散动画
    function chalkStep() {
      if (particles.length === 0) return;

      // 整体淡化
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.0015)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';

      // 颗粒更新
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.alpha -= p.decay;
        p.x += p.vx;
        p.y += p.vy;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }
    }
    addRaf(chalkStep);

    function startDraw(e) {
      isDrawing = true;
      const pos = getPos(e);
      lastX = pos.x;
      lastY = pos.y;
      e.preventDefault();
    }

    function moveDraw(e) {
      if (!isDrawing) return;
      const pos = getPos(e);
      drawLine(lastX, lastY, pos.x, pos.y);
      lastX = pos.x;
      lastY = pos.y;
    }

    function endDraw() {
      isDrawing = false;
    }

    fabric.addEventListener('mousedown', startDraw);
    fabric.addEventListener('mousemove', moveDraw);
    fabric.addEventListener('mouseup', endDraw);
    fabric.addEventListener('mouseleave', endDraw);

    // 触屏
    fabric.addEventListener('touchstart', startDraw, { passive: false });
    fabric.addEventListener('touchmove', (e) => {
      moveDraw(e);
      e.preventDefault();
    }, { passive: false });
    fabric.addEventListener('touchend', endDraw);

    // 清除
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles = [];
      });
    }
  })();

  // ========= 展区 05: 蒸汽熨斗 =========
  (function initIron() {
    const stage = $('.stage-iron');
    const ironTool = $('#ironTool');
    const fabric = $('#ironFabric');
    const wrinkles = $$('.wrinkle-row');
    if (!stage || !ironTool || !fabric) return;

    let ironX = 0;
    let ironY = 0;
    let targetIronX = 0;
    let targetIronY = 0;
    let isHovering = false;
    const ironedRows = new Set();

    function ironStep() {
      if (!isHovering) return;
      ironX = lerp(ironX, targetIronX, 0.15);
      ironY = lerp(ironY, targetIronY, 0.15);
      ironTool.style.left = ironX + 'px';
      ironTool.style.top = ironY + 'px';
    }
    addRaf(ironStep);

    stage.addEventListener('mouseenter', () => {
      isHovering = true;
      ironTool.classList.add('is-steaming');
      const rect = stage.getBoundingClientRect();
      targetIronX = rect.width / 2 - 45;
      targetIronY = rect.height / 2 - 50;
      ironX = targetIronX;
      ironY = targetIronY;
    });

    stage.addEventListener('mouseleave', () => {
      isHovering = false;
      ironTool.classList.remove('is-steaming');
    });

    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;
      targetIronX = localX - 45;
      targetIronY = localY - 80;

      // 检测熨烫的褶皱行
      const fabricRect = fabric.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      const fabricTop = fabricRect.top - stageRect.top;
      const fabricBottom = fabricTop + fabricRect.height;

      wrinkles.forEach((wr, i) => {
        const wrTop = parseFloat(getComputedStyle(wr).top);
        const wrY = fabricTop + wrTop + 9; // 行中心
        const ironBottom = localY + 20; // 熨斗底部
        const ironTop = localY - 20;

        if (ironBottom > wrY - 6 && ironTop < wrY + 6 &&
            localX > 40 && localX < rect.width - 40) {
          if (!ironedRows.has(i)) {
            ironedRows.add(i);
            wr.classList.add('is-ironed');
          }
        }
      });
    });

    // 重置按钮: 双击褶皱区域重新弄皱
    fabric.addEventListener('dblclick', () => {
      wrinkles.forEach(wr => wr.classList.remove('is-ironed'));
      ironedRows.clear();
    });
  })();

  // ========= 展区 06: 顶针纽扣盒 =========
  (function initThimble() {
    const slotsContainer = $('#buttonSlots');
    const scatterContainer = $('#buttonScatter');
    const spillBtn = $('#buttonSpill');
    const stage = $('.stage-thimble');
    if (!slotsContainer || !scatterContainer || !stage) return;

    const TOTAL_SLOTS = 18;
    const BUTTON_COLORS = [
      '#C84C5F', '#8B5A3C', '#DAA520',
      '#5C7A4F', '#2F4858', '#8B6914'
    ];

    const buttons = [];
    const slots = [];

    // 创建槽位
    for (let i = 0; i < TOTAL_SLOTS; i++) {
      const slot = document.createElement('div');
      slot.className = 'button-slot';
      slot.dataset.slotIdx = i;
      slotsContainer.appendChild(slot);
      slots.push({
        el: slot,
        filled: false,
        buttonIdx: null
      });
    }

    // 创建纽扣（初始全部在槽位里）
    for (let i = 0; i < TOTAL_SLOTS; i++) {
      const btn = document.createElement('div');
      btn.className = 'button-item';
      btn.style.background = `radial-gradient(circle at 30% 30%,
        ${BUTTON_COLORS[i % BUTTON_COLORS.length]},
        ${adjustColor(BUTTON_COLORS[i % BUTTON_COLORS.length], -30)}
      )`;
      btn.dataset.idx = i;
      scatterContainer.appendChild(btn);

      const slot = slots[i];
      const slotRect = () => slot.el.getBoundingClientRect();
      const scatterRect = () => scatterContainer.getBoundingClientRect();

      // 初始放入槽位
      const sr = slot.el.getBoundingClientRect();
      const scr = scatterContainer.getBoundingClientRect();
      btn.style.left = (sr.left - scr.left + 1) + 'px';
      btn.style.top = (sr.top - scr.top + 1) + 'px';
      slot.filled = true;
      slot.buttonIdx = i;

      buttons.push({
        el: btn,
        x: sr.left - scr.left + 1,
        y: sr.top - scr.top + 1,
        vx: 0, vy: 0,
        inSlot: true,
        slotIdx: i,
        isDragging: false,
        color: BUTTON_COLORS[i % BUTTON_COLORS.length]
      });
    }

    function adjustColor(hex, amount) {
      const num = parseInt(hex.slice(1), 16);
      const r = clamp((num >> 16) + amount, 0, 255);
      const g = clamp(((num >> 8) & 0x00FF) + amount, 0, 255);
      const b = clamp((num & 0x0000FF) + amount, 0, 255);
      return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
    }

    // 磁性吸附 — 反平方引力
    const MAGNETIC_STRENGTH = 150;
    const MAGNETIC_RANGE = 80;

    function thimbleStep() {
      const scr = scatterContainer.getBoundingClientRect();

      buttons.forEach((btn, idx) => {
        if (btn.isDragging) return;
        if (btn.inSlot) return;

        // 找最近的空槽位
        let nearestSlot = null;
        let nearestDist = Infinity;

        slots.forEach((slot, sIdx) => {
          if (slot.filled) return;
          const sr = slot.el.getBoundingClientRect();
          const slotCx = sr.left - scr.left + sr.width / 2;
          const slotCy = sr.top - scr.top + sr.height / 2;
          const btnCx = btn.x + 15;
          const btnCy = btn.y + 15;
          const dx = slotCx - btnCx;
          const dy = slotCy - btnCy;
          const dist = Math.hypot(dx, dy);

          if (dist < nearestDist && dist < MAGNETIC_RANGE) {
            nearestDist = dist;
            nearestSlot = { slot, sIdx, dx, dy, dist, slotCx, slotCy };
          }
        });

        if (nearestSlot) {
          // 反平方引力 F = k / r^2
          const r = Math.max(nearestSlot.dist, 5);
          const force = MAGNETIC_STRENGTH / (r * r);
          const fx = (nearestSlot.dx / r) * force;
          const fy = (nearestSlot.dy / r) * force;

          btn.vx += fx;
          btn.vy += fy;

          // 阻尼
          btn.vx *= 0.85;
          btn.vy *= 0.85;

          btn.x += btn.vx;
          btn.y += btn.vy;

          // 吸附到位
          if (nearestSlot.dist < 4) {
            btn.x = nearestSlot.slotCx - 15;
            btn.y = nearestSlot.slotCy - 15;
            btn.vx = 0;
            btn.vy = 0;
            btn.inSlot = true;
            btn.slotIdx = nearestSlot.sIdx;
            nearestSlot.slot.filled = true;
            nearestSlot.slot.buttonIdx = idx;
            btn.el.classList.add('is-snapped');
          }

          btn.el.style.left = btn.x + 'px';
          btn.el.style.top = btn.y + 'px';
        } else {
          // 没有附近槽位 — 惯性+摩擦慢慢停下
          btn.vx *= 0.95;
          btn.vy *= 0.95;
          if (Math.abs(btn.vx) < 0.05 && Math.abs(btn.vy) < 0.05) {
            btn.vx = 0;
            btn.vy = 0;
            return;
          }
          btn.x += btn.vx;
          btn.y += btn.vy;
          // 边界回弹
          const maxX = scr.width - 30;
          const maxY = scr.height - 30;
          if (btn.x < 0) { btn.x = 0; btn.vx = -btn.vx * 0.5; }
          if (btn.x > maxX) { btn.x = maxX; btn.vx = -btn.vx * 0.5; }
          if (btn.y < 0) { btn.y = 0; btn.vy = -btn.vy * 0.5; }
          if (btn.y > maxY) { btn.y = maxY; btn.vy = -btn.vy * 0.5; }
          btn.el.style.left = btn.x + 'px';
          btn.el.style.top = btn.y + 'px';
        }
      });

      // 高亮最近的槽位
      slots.forEach(s => s.el.classList.remove('is-highlight'));
      buttons.forEach(btn => {
        if (!btn.isDragging) return;
        let nearest = null;
        let nearestDist = Infinity;
        slots.forEach((slot, sIdx) => {
          if (slot.filled && slot.buttonIdx !== parseInt(btn.el.dataset.idx)) return;
          const sr = slot.el.getBoundingClientRect();
          const slotCx = sr.left - scr.left + sr.width / 2;
          const slotCy = sr.top - scr.top + sr.height / 2;
          const dist = Math.hypot(slotCx - (btn.x + 15), slotCy - (btn.y + 15));
          if (dist < nearestDist && dist < MAGNETIC_RANGE) {
            nearestDist = dist;
            nearest = slot;
          }
        });
        if (nearest) nearest.el.classList.add('is-highlight');
      });
    }
    addRaf(thimbleStep);

    // 拖拽逻辑
    let draggingBtn = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let lastDragX = 0;
    let lastDragY = 0;
    let dragVelX = 0;
    let dragVelY = 0;

    buttons.forEach(btn => {
      btn.el.addEventListener('mousedown', (e) => {
        const idx = parseInt(btn.el.dataset.idx);
        const button = buttons[idx];
        draggingBtn = button;
        button.isDragging = true;
        button.inSlot = false;
        button.el.classList.remove('is-snapped');

        // 释放槽位
        if (button.slotIdx !== null) {
          slots[button.slotIdx].filled = false;
          slots[button.slotIdx].buttonIdx = null;
        }

        const scr = scatterContainer.getBoundingClientRect();
        dragOffsetX = e.clientX - scr.left - button.x;
        dragOffsetY = e.clientY - scr.top - button.y;
        lastDragX = e.clientX;
        lastDragY = e.clientY;
        dragVelX = 0;
        dragVelY = 0;

        // 提升层级
        button.el.style.zIndex = '10';
        e.preventDefault();
      });
    });

    document.addEventListener('mousemove', (e) => {
      if (!draggingBtn) return;
      const scr = scatterContainer.getBoundingClientRect();
      const newX = e.clientX - scr.left - dragOffsetX;
      const newY = e.clientY - scr.top - dragOffsetY;

      dragVelX = (e.clientX - lastDragX) * 0.5;
      dragVelY = (e.clientY - lastDragY) * 0.5;
      lastDragX = e.clientX;
      lastDragY = e.clientY;

      draggingBtn.x = newX;
      draggingBtn.y = newY;
      draggingBtn.el.style.left = newX + 'px';
      draggingBtn.el.style.top = newY + 'px';
    });

    document.addEventListener('mouseup', () => {
      if (!draggingBtn) return;
      draggingBtn.isDragging = false;
      draggingBtn.vx = dragVelX * 0.1;
      draggingBtn.vy = dragVelY * 0.1;
      draggingBtn.el.style.zIndex = '';
      draggingBtn = null;
    });

    // 触屏
    buttons.forEach(btn => {
      btn.el.addEventListener('touchstart', (e) => {
        const t = e.touches[0];
        const idx = parseInt(btn.el.dataset.idx);
        const button = buttons[idx];
        draggingBtn = button;
        button.isDragging = true;
        button.inSlot = false;
        button.el.classList.remove('is-snapped');

        if (button.slotIdx !== null) {
          slots[button.slotIdx].filled = false;
          slots[button.slotIdx].buttonIdx = null;
        }

        const scr = scatterContainer.getBoundingClientRect();
        dragOffsetX = t.clientX - scr.left - button.x;
        dragOffsetY = t.clientY - scr.top - button.y;
        lastDragX = t.clientX;
        lastDragY = t.clientY;
        button.el.style.zIndex = '10';
        e.preventDefault();
      }, { passive: false });
    });

    document.addEventListener('touchmove', (e) => {
      if (!draggingBtn) return;
      const t = e.touches[0];
      const scr = scatterContainer.getBoundingClientRect();
      const newX = t.clientX - scr.left - dragOffsetX;
      const newY = t.clientY - scr.top - dragOffsetY;
      dragVelX = (t.clientX - lastDragX) * 0.5;
      dragVelY = (t.clientY - lastDragY) * 0.5;
      lastDragX = t.clientX;
      lastDragY = t.clientY;
      draggingBtn.x = newX;
      draggingBtn.y = newY;
      draggingBtn.el.style.left = newX + 'px';
      draggingBtn.el.style.top = newY + 'px';
    }, { passive: true });

    document.addEventListener('touchend', () => {
      if (!draggingBtn) return;
      draggingBtn.isDragging = false;
      draggingBtn.vx = dragVelX * 0.1;
      draggingBtn.vy = dragVelY * 0.1;
      draggingBtn.el.style.zIndex = '';
      draggingBtn = null;
    });

    // 倾倒按钮 — 把所有纽扣散落到四周
    if (spillBtn) {
      spillBtn.addEventListener('click', () => {
        const scr = scatterContainer.getBoundingClientRect();
        buttons.forEach((btn, i) => {
          if (btn.isDragging) return;
          // 释放槽位
          if (btn.slotIdx !== null) {
            slots[btn.slotIdx].filled = false;
            slots[btn.slotIdx].buttonIdx = null;
          }
          btn.inSlot = false;
          btn.el.classList.remove('is-snapped');

          // 随机散开位置
          const angle = (i / TOTAL_SLOTS) * Math.PI * 2 + Math.random() * 0.5;
          const radius = 60 + Math.random() * 40;
          const cx = scr.width / 2;
          const cy = scr.height / 2;

          btn.x = clamp(cx + Math.cos(angle) * radius - 15, 0, scr.width - 30);
          btn.y = clamp(cy + Math.sin(angle) * radius - 15, 0, scr.height - 30);
          btn.vx = Math.cos(angle) * (2 + Math.random() * 2);
          btn.vy = Math.sin(angle) * (2 + Math.random() * 2);
          btn.el.style.left = btn.x + 'px';
          btn.el.style.top = btn.y + 'px';
        });
      });
    }
  })();

  // ========= 升级为全栈应用宣告 =========
  function announceUpgrade() {
    try {
      window.parent.postMessage({ type: 'miaoda:upgrade:available', kind: 'interactive-prototype' }, '*');
    } catch (e) {}
  }
  announceUpgrade();
  if (document.readyState !== 'complete') {
    window.addEventListener('load', announceUpgrade, { once: true });
  }

  // ========= 页面卸载清理 =========
  window.addEventListener('beforeunload', () => {
    stopRaf();
    rafRegistry.clear();
  });

})();
