/* ============================================================
   工具函数与小工具组件
   所有动画循环均遵循页面可见性切换暂停、卸载统一取消
   ============================================================ */

// ========== RAF 管理器 ==========
// 统一管理 requestAnimationFrame 循环
const RafManager = (() => {
  let callbacks = new Map();
  let rafId = null;
  let isPaused = false;
  let lastTime = 0;

  function tick(t) {
    if (isPaused) { rafId = null; return; }
    const dt = lastTime ? (t - lastTime) / 1000 : 0;
    lastTime = t;
    callbacks.forEach((cb) => {
      try { cb(dt, t); } catch (e) { /* 单个失败不影响其他 */ }
    });
    rafId = requestAnimationFrame(tick);
  }

  function start() {
    if (rafId || callbacks.size === 0) return;
    lastTime = 0;
    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
      lastTime = 0;
    }
  }

  function add(key, cb) {
    callbacks.set(key, cb);
    start();
  }

  function remove(key) {
    callbacks.delete(key);
    if (callbacks.size === 0) stop();
  }

  function pause() { isPaused = true; stop(); }
  function resume() {
    isPaused = false;
    if (callbacks.size > 0) start();
  }

  // 页面可见性监听
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) pause();
      else resume();
    });
    // 卸载时彻底清理
    window.addEventListener('beforeunload', stop);
  }

  return { add, remove, pause, resume, stop };
})();

// ========== 弹簧物理（Hooke 定律 + 阻尼） ==========
class Spring {
  constructor({ stiffness = 180, damping = 12, mass = 1, value = 0, target = 0 } = {}) {
    this.stiffness = stiffness;
    this.damping = damping;
    this.mass = mass;
    this.value = value;
    this.target = target;
    this.velocity = 0;
  }
  setTarget(t) { this.target = t; }
  setValue(v) { this.value = v; this.velocity = 0; }
  // 按 dt (秒) 积分一步，返回新值
  step(dt) {
    const k = this.stiffness;
    const d = this.damping;
    const m = this.mass;
    const force = -k * (this.value - this.target) - d * this.velocity;
    const accel = force / m;
    this.velocity += accel * dt;
    this.value += this.velocity * dt;
    return this.value;
  }
}

// ========== 惯性动量（带阻尼的速度） ==========
class Inertia {
  constructor({ damping = 0.92, value = 0 } = {}) {
    this.damping = damping;
    this.value = value;
    this.velocity = 0;
    this._target = value;
  }
  push(velocity) { this.velocity += velocity; }
  setTarget(t) {
    this.velocity += (t - this._target) * 0.15;
    this._target = t;
  }
  step(dt) {
    // 用阻尼衰减速度
    const decay = Math.pow(this.damping, dt * 60);
    this.velocity *= decay;
    this.value += this.velocity * dt * 60;
    return this.value;
  }
}

// ========== 缓动函数 ==========
const Ease = {
  outCubic: (t) => 1 - Math.pow(1 - t, 3),
  inOutCubic: (t) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2,
  outExpo: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  outBack: (t) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  lerp: (a, b, t) => a + (b - a) * t,
  clamp: (v, min, max) => Math.min(Math.max(v, min), max),
  mapRange: (v, inMin, inMax, outMin, outMax) =>
    outMin + (outMax - outMin) * ((v - inMin) / (inMax - inMin)),
};

// ========== IntersectionObserver 滚动渐入 ==========
const RevealManager = (() => {
  let observer = null;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    if (observer || prefersReducedMotion) return;
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  }

  function observe(el) {
    if (!el) return;
    init();
    if (prefersReducedMotion) {
      el.classList.add('is-visible');
      return;
    }
    observer.observe(el);
  }

  function observeAll(selector = '.reveal') {
    document.querySelectorAll(selector).forEach(observe);
  }

  return { observe, observeAll };
})();

// ========== 节流 / 防抖 ==========
function throttle(fn, limit = 16) {
  let inThrottle = false;
  let lastArgs = null;
  return function(...args) {
    if (inThrottle) { lastArgs = args; return; }
    fn.apply(this, args);
    inThrottle = true;
    setTimeout(() => {
      inThrottle = false;
      if (lastArgs) { fn.apply(this, lastArgs); lastArgs = null; }
    }, limit);
  };
}

function debounce(fn, delay = 150) {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ========== 小工具组件 ==========

// 章节编号（经纬度风格：N 32° 45′）
function SectionIndex({ num, total = '06', label }) {
  return React.createElement('div', { className: 'section-index no-select' },
    React.createElement('span', { className: 'section-index__num' }, `${num}/${total}`),
    label && React.createElement('span', { className: 'section-index__label mono' }, label)
  );
}

// 羽翼分隔符（SVG 羽毛剪影）
function FeatherDivider({ className = '' }) {
  return React.createElement('div', { className: `feather-divider ${className}` },
    React.createElement('svg', { viewBox: '0 0 200 40', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' },
      React.createElement('path', {
        d: 'M2 20 C 40 20, 60 5, 100 20 C 140 35, 160 20, 198 20',
        stroke: 'currentColor', strokeWidth: '0.8',
      }),
      React.createElement('path', {
        d: 'M100 20 L 100 8 M70 18 L72 10 M130 22 L128 12 M50 18 L52 13 M150 22 L148 14 M85 18 L86 12 M115 21 L114 13',
        stroke: 'currentColor', strokeWidth: '0.6', strokeLinecap: 'round'
      })
    )
  );
}

// 数据徽章
function DataBadge({ value, unit, label }) {
  return React.createElement('div', { className: 'data-badge' },
    React.createElement('div', { className: 'data-badge__value' },
      React.createElement('span', { className: 'num' }, value),
      unit && React.createElement('span', { className: 'unit mono' }, unit),
    ),
    label && React.createElement('div', { className: 'data-badge__label eyebrow' }, label)
  );
}

// 悬停涟漪
function useRipple() {
  const createRipple = (e) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    target.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };
  return createRipple;
}

// ========== 导出到全局 ==========
Object.assign(window, {
  RafManager, Spring, Inertia, Ease,
  RevealManager, throttle, debounce,
  SectionIndex, FeatherDivider, DataBadge, useRipple,
});
