/* ============================================================
   PHOSPHOR Core — 工具函数、物理引擎、RAF 管理器
   ============================================================ */

(function () {
  'use strict';

  // ========== 工具函数 ==========
  const PH = window.PH = window.PH || {};

  PH.clamp = function (v, min, max) {
    return v < min ? min : v > max ? max : v;
  };

  PH.lerp = function (a, b, t) {
    return a + (b - a) * t;
  };

  PH.map = function (v, inMin, inMax, outMin, outMax) {
    return outMin + (outMax - outMin) * ((v - inMin) / (inMax - inMin));
  };

  PH.distance = function (x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  };

  PH.distanceSq = function (x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return dx * dx + dy * dy;
  };

  PH.random = function (min, max) {
    return min + Math.random() * (max - min);
  };

  PH.randomInt = function (min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
  };

  PH.hsl = function (h, s, l, a) {
    a = (a === undefined) ? 1 : a;
    return `hsla(${h}, ${s}%, ${l}%, ${a})`;
  };

  // ========== 全局鼠标状态（高频 DOM 直写，不 setState） ==========
  PH.mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    targetX: window.innerWidth / 2,
    targetY: window.innerHeight / 2,
    vx: 0,
    vy: 0,
    lastX: window.innerWidth / 2,
    lastY: window.innerHeight / 2,
    isDown: false,
    speed: 0
  };

  // 鼠标位置直接用目标值（瞬时），vx/vy 用速度平滑
  let _lastMouseTime = performance.now();
  window.addEventListener('mousemove', function (e) {
    const now = performance.now();
    const dt = (now - _lastMouseTime) / 16.67;
    _lastMouseTime = now;

    PH.mouse.lastX = PH.mouse.x;
    PH.mouse.lastY = PH.mouse.y;
    PH.mouse.targetX = e.clientX;
    PH.mouse.targetY = e.clientY;
    // 直接赋值 x/y，canvas 场景用 targetX/targetY 精确值
    PH.mouse.x = e.clientX;
    PH.mouse.y = e.clientY;

    const dx = e.clientX - PH.mouse.lastX;
    const dy = e.clientY - PH.mouse.lastY;
    const speed = Math.sqrt(dx * dx + dy * dy) / Math.max(dt, 0.01);
    PH.mouse.vx = PH.lerp(PH.mouse.vx, dx / Math.max(dt, 0.01), 0.2);
    PH.mouse.vy = PH.lerp(PH.mouse.vy, dy / Math.max(dt, 0.01), 0.2);
    PH.mouse.speed = PH.lerp(PH.mouse.speed, speed, 0.15);
  }, { passive: true });

  window.addEventListener('mousedown', function () {
    PH.mouse.isDown = true;
  });
  window.addEventListener('mouseup', function () {
    PH.mouse.isDown = false;
  });

  // ========== RAF 循环管理器 ==========
  // 统一的 requestAnimationFrame 调度，页面隐藏时自动暂停
  let rafId = null;
  const rafCallbacks = [];
  let rafLastTime = 0;
  let rafRunning = false;
  let rafPaused = false;

  function rafTick(time) {
    rafId = null;
    if (rafPaused) return;

    const dt = Math.min((time - rafLastTime) / 1000, 0.05); // 最大 50ms 防止切后台后跳帧
    rafLastTime = time;

    const cbs = rafCallbacks.slice();
    for (let i = 0; i < cbs.length; i++) {
      try { cbs[i](dt, time); } catch (e) { console.error(e); }
    }

    if (rafCallbacks.length > 0 && !rafPaused) {
      rafId = requestAnimationFrame(rafTick);
    } else {
      rafRunning = false;
    }
  }

  function rafEnsureRunning() {
    if (!rafRunning && rafCallbacks.length > 0) {
      rafRunning = true;
      rafPaused = false;
      rafLastTime = performance.now();
      rafId = requestAnimationFrame(rafTick);
    }
  }

  function rafStop() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    rafRunning = false;
  }

  PH.RAF = {
    add: function (fn) {
      if (rafCallbacks.indexOf(fn) === -1) {
        rafCallbacks.push(fn);
      }
      rafEnsureRunning();
    },
    remove: function (fn) {
      const i = rafCallbacks.indexOf(fn);
      if (i > -1) rafCallbacks.splice(i, 1);
      if (rafCallbacks.length === 0) rafStop();
    },
    pause: function () {
      rafPaused = true;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      rafRunning = false;
    },
    resume: function () {
      if (rafPaused && rafCallbacks.length > 0) {
        rafPaused = false;
        rafLastTime = performance.now();
        rafRunning = true;
        rafId = requestAnimationFrame(rafTick);
      }
    }
  };

  // 页面可见性切换
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      PH.RAF.pause();
    } else {
      // 重新校准时间，防止 dt 过大
      rafLastTime = performance.now();
      PH.RAF.resume();
    }
  });

  // 页面卸载时清理
  window.addEventListener('beforeunload', function () {
    PH.RAF.pause();
    rafCallbacks.length = 0;
  });

  // ========== 弹簧积分器（Hooke 定律 + 阻尼） ==========
  // 使用 Verlet 风格的位置/速度积分
  PH.Spring = function (options) {
    options = options || {};
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.vx = options.vx || 0;
    this.vy = options.vy || 0;
    this.targetX = options.targetX !== undefined ? options.targetX : this.x;
    this.targetY = options.targetY !== undefined ? options.targetY : this.y;
    this.k = options.k || 0.08;        // 弹簧劲度系数
    this.damping = options.damping || 0.85; // 阻尼系数
    this.mass = options.mass || 1;     // 质量
  };

  PH.Spring.prototype.setTarget = function (tx, ty) {
    this.targetX = tx;
    this.targetY = ty;
  };

  PH.Spring.prototype.update = function (dt) {
    dt = dt || 1/60;
    const fdt = dt * 60; // 基于 60fps 归一化
    // 胡克定律: F = -k * x
    const ax = (this.targetX - this.x) * this.k / this.mass;
    const ay = (this.targetY - this.y) * this.k / this.mass;
    this.vx += ax * fdt;
    this.vy += ay * fdt;
    // 阻尼
    const dmp = Math.pow(this.damping, fdt);
    this.vx *= dmp;
    this.vy *= dmp;
    this.x += this.vx * fdt;
    this.y += this.vy * fdt;
  };

  // 1D 版本
  PH.Spring1D = function (options) {
    options = options || {};
    this.value = options.value || 0;
    this.velocity = options.velocity || 0;
    this.target = options.target !== undefined ? options.target : this.value;
    this.k = options.k || 0.08;
    this.damping = options.damping || 0.85;
    this.mass = options.mass || 1;
  };

  PH.Spring1D.prototype.setTarget = function (t) {
    this.target = t;
  };

  PH.Spring1D.prototype.update = function (dt) {
    dt = dt || 1/60;
    const fdt = dt * 60;
    const a = (this.target - this.value) * this.k / this.mass;
    this.velocity += a * fdt;
    const dmp = Math.pow(this.damping, fdt);
    this.velocity *= dmp;
    this.value += this.velocity * fdt;
  };

  // ========== 粒子基类 ==========
  PH.Particle = function (x, y) {
    this.x = x;
    this.y = y;
    this.ox = x; // 原点（归宿点）
    this.oy = y;
    this.vx = 0;
    this.vy = 0;
    this.size = 2;
    this.life = 1;
    this.active = true;
  };

  // ========== 涟漪 ==========
  PH.createRipple = function (x, y, color) {
    const layer = document.getElementById('rippleLayer');
    if (!layer) return;
    const el = document.createElement('div');
    el.className = 'ripple';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    if (color) el.style.borderColor = color;
    layer.appendChild(el);
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 800);
  };

  // ========== Reduced motion 检测 ==========
  PH.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 监听变化
  try {
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function (e) {
      PH.reducedMotion = e.matches;
    });
  } catch (e) { /* 老浏览器不支持 */ }

  // ========== FPS 计数器 ==========
  PH.fps = 60;
  let _fpsFrames = 0;
  let _fpsTime = 0;
  PH.RAF.add(function (dt) {
    _fpsFrames++;
    _fpsTime += dt;
    if (_fpsTime >= 0.5) {
      PH.fps = Math.round(_fpsFrames / _fpsTime);
      _fpsFrames = 0;
      _fpsTime = 0;
      const el = document.getElementById('fpsCounter');
      if (el) el.textContent = PH.fps + ' FPS';
    }
  });

  // 坐标显示
  let _coordTimer = 0;
  PH.RAF.add(function (dt) {
    _coordTimer += dt;
    if (_coordTimer >= 0.05) {
      _coordTimer = 0;
      const el = document.getElementById('coordDisplay');
      if (el) {
        const x = String(Math.round(PH.mouse.x)).padStart(4, '0');
        const y = String(Math.round(PH.mouse.y)).padStart(4, '0');
        el.textContent = 'X: ' + x + ' Y: ' + y;
      }
    }
  });

  // ========== 滚动渐入观察器 ==========
  PH.initReveal = function () {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    els.forEach(function (el) { io.observe(el); });
  };

  // ========== 画布尺寸管理 ==========
  PH.setupCanvas = function (canvas) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return {
      ctx: ctx,
      w: rect.width,
      h: rect.height,
      dpr: dpr
    };
  };

})();
