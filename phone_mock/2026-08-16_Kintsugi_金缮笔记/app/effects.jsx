// 动效系统 — 金缮笔记
// 所有 RAF 循环统一注册到 window.__kinRAF 以便 visibilitychange 时暂停
// 所有定时器统一用 window.__kinTimers 跟踪

(function initEffectCore() {
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let rafs = new Map(); // id -> {fn, running, rafId}
  let timers = new Set();
  let visible = true;
  let rafCounter = 0;

  function registerRAF(fn) {
    const id = ++rafCounter;
    const entry = { fn, running: false, rafId: 0 };
    rafs.set(id, entry);
    if (visible && !REDUCED) startRAF(id);
    return id;
  }
  function startRAF(id) {
    const e = rafs.get(id);
    if (!e || e.running) return;
    e.running = true;
    const loop = () => {
      if (!e.running) return;
      e.fn();
      e.rafId = requestAnimationFrame(loop);
    };
    e.rafId = requestAnimationFrame(loop);
  }
  function stopRAF(id) {
    const e = rafs.get(id);
    if (!e || !e.running) return;
    e.running = false;
    cancelAnimationFrame(e.rafId);
    e.rafId = 0;
  }
  function unregisterRAF(id) {
    stopRAF(id);
    rafs.delete(id);
  }
  function setT(fn, ms) {
    const t = setTimeout(() => {
      timers.delete(t);
      fn();
    }, ms);
    timers.add(t);
    return t;
  }
  function clearT(t) {
    clearTimeout(t);
    timers.delete(t);
  }
  function pauseAll() {
    visible = false;
    rafs.forEach((_, id) => stopRAF(id));
  }
  function resumeAll() {
    if (visible) return;
    visible = true;
    if (REDUCED) return;
    rafs.forEach((_, id) => startRAF(id));
  }
  function cleanupAll() {
    rafs.forEach((_, id) => unregisterRAF(id));
    timers.forEach(t => clearTimeout(t));
    timers.clear();
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseAll();
    else resumeAll();
  });
  window.addEventListener('beforeunload', cleanupAll);

  window.__kin = {
    registerRAF, unregisterRAF, startRAF, stopRAF,
    setT, clearT,
    pauseAll, resumeAll, cleanupAll,
    REDUCED,
    get visible() { return visible; },
  };
})();

// ─────────────────────────────────────────────────────────────
// 自定义光标
// ─────────────────────────────────────────────────────────────
(function initCursor() {
  if (window.__kin.REDUCED) return;
  const ring = document.getElementById('cursorRing');
  const dot = document.getElementById('cursorDot');
  if (!ring || !dot) return;

  // 初始位置：屏幕中央
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let ringX = targetX, ringY = targetY;
  let dotX = targetX, dotY = targetY;

  // 弹簧参数
  const ringSpring = { stiffness: 0.14, damping: 0.7, mass: 1 };
  const dotSpring = { stiffness: 0.35, damping: 0.65, mass: 1 };
  let rvx = 0, rvy = 0;
  let dvx = 0, dvy = 0;

  function step() {
    // ring 缓动（带惯性/阻尼的弹簧模型）
    const rdx = targetX - ringX;
    const rdy = targetY - ringY;
    const rax = rdx * ringSpring.stiffness - rvx * ringSpring.damping;
    const ray = rdy * ringSpring.stiffness - rvy * ringSpring.damping;
    rvx += rax; rvy += ray;
    ringX += rvx; ringY += rvy;

    // dot 更紧的跟随
    const ddx = targetX - dotX;
    const ddy = targetY - dotY;
    const dax = ddx * dotSpring.stiffness - dvx * dotSpring.damping;
    const day = ddy * dotSpring.stiffness - dvy * dotSpring.damping;
    dvx += dax; dvy += day;
    dotX += dvx; dotY += dvy;

    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
  }

  const rafId = window.__kin.registerRAF(step);

  // 鼠标移动直接更新目标位置，不触发 React
  function onMove(e) {
    targetX = e.clientX;
    targetY = e.clientY;
  }
  window.addEventListener('mousemove', onMove, { passive: true });

  // hover 状态：事件委托
  function isInteractive(el) {
    if (!el) return false;
    if (el.closest) {
      if (el.closest('button, a, [data-cursor="hover"], input, textarea, select, .kin-card, .kin-tab, .kin-chip, .kin-nav-item, .kin-row')) return true;
    }
    return false;
  }
  function onOver(e) {
    if (isInteractive(e.target)) {
      ring.classList.add('hover');
    }
  }
  function onOut(e) {
    if (isInteractive(e.target)) {
      ring.classList.remove('hover');
    }
  }
  function onDown(e) {
    if (isInteractive(e.target)) {
      ring.classList.add('clicking');
      dot.classList.add('clicking');
      spawnClickRipple(e.clientX, e.clientY);
    }
  }
  function onUp() {
    ring.classList.remove('clicking');
    dot.classList.remove('clicking');
  }
  document.addEventListener('mouseover', onOver, true);
  document.addEventListener('mouseout', onOut, true);
  document.addEventListener('mousedown', onDown, true);
  document.addEventListener('mouseup', onUp, true);

  window.__kinCursorCleanup = function() {
    window.__kin.unregisterRAF(rafId);
    window.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseover', onOver, true);
    document.removeEventListener('mouseout', onOut, true);
    document.removeEventListener('mousedown', onDown, true);
    document.removeEventListener('mouseup', onUp, true);
  };
})();

// ─────────────────────────────────────────────────────────────
// 点击涟漪
// ─────────────────────────────────────────────────────────────
function spawnClickRipple(x, y) {
  const layer = document.getElementById('cursorLayer');
  if (!layer) return;
  const ripple = document.createElement('div');
  ripple.style.cssText = `
    position:absolute;left:${x}px;top:${y}px;width:0;height:0;
    border:2px solid #D4A017;border-radius:50%;
    transform:translate(-50%,-50%);
    opacity:0.9;pointer-events:none;
    animation:kinRipple .55s cubic-bezier(.2,.8,.2,1) forwards;
    box-shadow: 0 0 18px rgba(212,160,23,0.6);
  `;
  layer.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}
// 注入 keyframes
(function injectRippleKf() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes kinRipple {
      0% { width: 0; height: 0; opacity: .9; }
      100% { width: 120px; height: 120px; opacity: 0; border-width: 1px; }
    }
  `;
  document.head.appendChild(style);
})();

// ─────────────────────────────────────────────────────────────
// 金粉粒子背景
// ─────────────────────────────────────────────────────────────
(function initParticles() {
  if (window.__kin.REDUCED) return;
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w = 0, h = 0, dpr = window.devicePixelRatio || 1;
  const particles = [];
  const COUNT = 60;

  function resize() {
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  // 初始化粒子
  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.15 - 0.05, // 轻微上升
      size: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.6 + 0.2,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      // 每个粒子有不同周期
      drift: Math.random() * 0.01 + 0.003,
    });
  }

  let mouseX = -9999, mouseY = -9999;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
  }, { passive: true });

  function step() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      // 磁性反平方引力（鼠标附近被轻轻推开）
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist2 = dx * dx + dy * dy;
      if (dist2 < 140 * 140 && dist2 > 1) {
        const f = 80 / dist2;
        p.vx += dx * f * 0.003;
        p.vy += dy * f * 0.003;
      }
      // 摩擦 / 阻尼
      p.vx *= 0.985;
      p.vy *= 0.985;
      // 基础漂移
      p.vx += Math.sin(p.y * 0.01 + p.twinkle) * p.drift;
      p.vy += -0.01;

      p.x += p.vx;
      p.y += p.vy;

      // 闪烁
      p.twinkle += p.twinkleSpeed;
      const a = p.alpha * (0.5 + 0.5 * Math.sin(p.twinkle));

      // 边界循环
      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
      if (p.y < -20) p.y = h + 20;
      if (p.y > h + 20) p.y = -20;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      // 金色径向渐变
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
      g.addColorStop(0, `rgba(255,220,120,${a})`);
      g.addColorStop(0.4, `rgba(212,160,23,${a * 0.5})`);
      g.addColorStop(1, 'rgba(212,160,23,0)');
      ctx.fillStyle = g;
      ctx.fillRect(p.x - p.size * 4, p.y - p.size * 4, p.size * 8, p.size * 8);
    }
  }
  window.__kin.registerRAF(step);
})();

// ─────────────────────────────────────────────────────────────
// 金缮签名描金动画（SVG path stroke-dashoffset 动画）
// ─────────────────────────────────────────────────────────────
// 在指定 SVG path 上执行描金生长动画。使用 RAF + 进度插值。
// 接受 path 元素与配置 { duration, delay, onComplete }
function kintsugiDrawPath(pathEl, { duration = 2200, delay = 0, easing = 'easeOutCubic' } = {}) {
  return new Promise((resolve) => {
    const len = pathEl.getTotalLength();
    pathEl.style.strokeDasharray = len;
    pathEl.style.strokeDashoffset = len;
    pathEl.style.fill = 'none';

    const easings = {
      easeOutCubic: t => 1 - Math.pow(1 - t, 3),
      easeOutQuart: t => 1 - Math.pow(1 - t, 4),
      easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    };
    const easeFn = easings[easing] || easings.easeOutCubic;

    const start = performance.now() + delay;
    let rafId;
    function tick(now) {
      const elapsed = now - start;
      if (elapsed < 0) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      const t = Math.min(1, elapsed / duration);
      const eased = easeFn(t);
      pathEl.style.strokeDashoffset = len * (1 - eased);
      // 金粉光泽：进度中段最亮
      const shine = Math.sin(eased * Math.PI);
      pathEl.style.filter = `drop-shadow(0 0 ${2 + shine * 4}px rgba(212,160,23,${0.4 + shine * 0.5}))`;

      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        resolve();
      }
    }
    rafId = requestAnimationFrame(tick);
    // 注册以便 visibility 暂停时能停止（简化处理：不暂停这些短动画）
  });
}

// 顺序执行一组路径的描金（一个接一个生长）
async function kintsugiDrawSequence(paths, config = {}) {
  const { stagger = 400, duration = 2000 } = config;
  for (let i = 0; i < paths.length; i++) {
    kintsugiDrawPath(paths[i], { duration: duration + Math.random() * 600, delay: i === 0 ? 0 : stagger * 0.5 + Math.random() * stagger * 0.5 });
  }
}

Object.assign(window, { kintsugiDrawPath, kintsugiDrawSequence, spawnClickRipple });
