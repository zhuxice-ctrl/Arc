/* ============================================================
   PHOSPHOR Cursor — 自定义荧光光标 + 彗星光标拖尾
   特性：
   - 页面加载即显示在屏幕中央（不等鼠标移动）
   - 白色粗环 + 荧光青内点 + 多层发光
   - 悬停三态：idle / hover / click
   - 点击涟漪
   - 彗星光标拖尾（canvas 粒子拖尾）
   - 物理：位置用线性插值平滑（惯性）
   ============================================================ */

(function () {
  'use strict';

  if (PH.reducedMotion) return;

  const cursor = document.getElementById('cursor');
  const ring = cursor.querySelector('.cursor-ring');
  const dot = cursor.querySelector('.cursor-dot');
  const glow = cursor.querySelector('.cursor-glow');

  // 初始位置：屏幕中央
  let cx = window.innerWidth / 2;
  let cy = window.innerHeight / 2;
  let tx = window.innerWidth / 2;
  let ty = window.innerHeight / 2;

  // 平滑系数（惯性动量）
  const EASE_RING = 0.15;   // 外环跟得慢一点
  const EASE_DOT = 0.35;    // 内点跟得快一点
  const EASE_GLOW = 0.08;   // 光晕最柔和

  let ringX = cx, ringY = cy;
  let dotX = cx, dotY = cy;
  let glowX = cx, glowY = cy;

  // ========== 光标主体动画 ==========
  function updateCursor() {
    tx = PH.mouse.targetX;
    ty = PH.mouse.targetY;

    // 三环以不同 ease 跟随，形成拖后感
    ringX = PH.lerp(ringX, tx, EASE_RING);
    ringY = PH.lerp(ringY, ty, EASE_RING);
    dotX = PH.lerp(dotX, tx, EASE_DOT);
    dotY = PH.lerp(dotY, ty, EASE_DOT);
    glowX = PH.lerp(glowX, tx, EASE_GLOW);
    glowY = PH.lerp(glowY, ty, EASE_GLOW);

    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
    glow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
  }

  PH.RAF.add(updateCursor);

  // ========== 悬停检测 ==========
  const HOVER_SELECTORS = 'a, button, [role="button"], .nav-tick, .mag-btn, .reset-btn, .elastic-anchor';

  function checkHover() {
    const el = document.elementFromPoint(PH.mouse.targetX, PH.mouse.targetY);
    if (!el) return;
    const interactive = el.closest(HOVER_SELECTORS);
    if (interactive) {
      cursor.classList.add('is-hover');
    } else {
      cursor.classList.remove('is-hover');
    }
  }

  // 节流的悬停检测（每帧一次足够）
  let hoverCheckAcc = 0;
  PH.RAF.add(function (dt) {
    hoverCheckAcc += dt;
    if (hoverCheckAcc >= 0.016) {
      hoverCheckAcc = 0;
      checkHover();
    }
  });

  // ========== 点击态 ==========
  window.addEventListener('mousedown', function (e) {
    cursor.classList.add('is-click');
    // 涟漪
    PH.createRipple(e.clientX, e.clientY);
  });
  window.addEventListener('mouseup', function () {
    cursor.classList.remove('is-click');
  });

  // ========== 光标拖尾粒子（canvas 彗星效果） ==========
  // 独立 canvas，全屏覆盖
  const trailCanvas = document.createElement('canvas');
  trailCanvas.className = 'cursor-comet';
  trailCanvas.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    z-index: 9998;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(trailCanvas);

  let tctx, tw, th, tdpr;
  function resizeTrail() {
    tdpr = Math.min(window.devicePixelRatio || 1, 2);
    tw = window.innerWidth;
    th = window.innerHeight;
    trailCanvas.width = tw * tdpr;
    trailCanvas.height = th * tdpr;
    tctx = trailCanvas.getContext('2d');
    tctx.scale(tdpr, tdpr);
  }
  resizeTrail();
  window.addEventListener('resize', resizeTrail);

  // 拖尾粒子池
  const TRAIL_MAX = 40;
  const trailParticles = [];

  function spawnTrailParticle() {
    const speed = PH.mouse.speed;
    if (speed < 0.5) return; // 静止不产生
    if (trailParticles.length >= TRAIL_MAX) {
      // 复用最早的死亡粒子
      for (let i = 0; i < trailParticles.length; i++) {
        if (!trailParticles[i].active) {
          trailParticles[i].reset(dotX, dotY);
          return;
        }
      }
      return;
    }
    trailParticles.push(new TrailParticle(dotX, dotY));
  }

  function TrailParticle(x, y) {
    this.reset(x, y);
  }

  TrailParticle.prototype.reset = function (x, y) {
    this.x = x + PH.random(-3, 3);
    this.y = y + PH.random(-3, 3);
    this.vx = -PH.mouse.vx * 0.15 + PH.random(-0.5, 0.5);
    this.vy = -PH.mouse.vy * 0.15 + PH.random(-0.5, 0.5);
    this.size = PH.random(1.5, 3.5);
    this.life = 1;
    this.decay = PH.random(0.02, 0.05);
    this.active = true;
    this.hue = 170 + PH.random(-10, 20); // 偏荧光青
  };

  TrailParticle.prototype.update = function (dt) {
    if (!this.active) return;
    const fdt = dt * 60;
    this.x += this.vx * fdt;
    this.y += this.vy * fdt;
    // 摩擦
    this.vx *= Math.pow(0.96, fdt);
    this.vy *= Math.pow(0.96, fdt);
    this.life -= this.decay * fdt;
    this.size *= Math.pow(0.98, fdt);
    if (this.life <= 0) {
      this.active = false;
    }
  };

  TrailParticle.prototype.draw = function () {
    if (!this.active) return;
    const alpha = this.life * 0.8;
    tctx.beginPath();
    tctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    tctx.fillStyle = `hsla(${this.hue}, 85%, 70%, ${alpha})`;
    tctx.shadowBlur = this.size * 4;
    tctx.shadowColor = `hsla(${this.hue}, 90%, 60%, ${alpha * 0.8})`;
    tctx.fill();
    tctx.shadowBlur = 0;
  };

  let spawnAcc = 0;
  function trailLoop(dt) {
    // 轨迹淡出（拖尾效果）
    tctx.fillStyle = 'rgba(10, 10, 13, 0.15)';
    tctx.fillRect(0, 0, tw, th);

    // 生成新粒子（按速度调节生成频率）
    spawnAcc += dt;
    const interval = Math.max(0.008, 0.04 - PH.mouse.speed * 0.001);
    while (spawnAcc >= interval) {
      spawnAcc -= interval;
      spawnTrailParticle();
    }

    // 更新并绘制
    for (let i = 0; i < trailParticles.length; i++) {
      trailParticles[i].update(dt);
      trailParticles[i].draw();
    }
  }

  PH.RAF.add(trailLoop);

  // ========== 拖拽态 ==========
  window.addEventListener('mousedown', function () {
    // 拖拽时由各模块单独设置 is-drag
  });

  // 暴露给外部使用
  PH.Cursor = {
    setDrag: function (on) {
      if (on) cursor.classList.add('is-drag');
      else cursor.classList.remove('is-drag');
    },
    getX: function () { return dotX; },
    getY: function () { return dotY; }
  };

})();
