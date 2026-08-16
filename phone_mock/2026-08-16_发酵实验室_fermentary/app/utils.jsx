// ── 工具函数 ──

function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} 分钟`;
  if (minutes < 24 * 60) {
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    return m > 0 ? `${h} 小时 ${m} 分` : `${h} 小时`;
  }
  const d = Math.floor(minutes / (24 * 60));
  const h = Math.round((minutes % (24 * 60)) / 60);
  return h > 0 ? `${d} 天 ${h} 小时` : `${d} 天`;
}

function formatTimeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '刚刚';
  if (mins < 60) return `${mins} 分钟前`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} 小时前`;
  const days = Math.floor(hrs / 24);
  return `${days} 天前`;
}

// Spring easing: emulate a spring with given stiffness/damping
function springEase(t, stiffness = 120, damping = 14) {
  // Normalized spring: returns 1 at t=1 with a bit of overshoot
  const z = damping / (2 * Math.sqrt(stiffness));
  const w = Math.sqrt(stiffness - damping * damping / 4);
  if (t >= 1) return 1;
  if (t <= 0) return 0;
  const env = Math.exp(-z * t * 6);
  const osc = Math.cos(w * t * 6);
  return 1 - env * osc;
}

// Easing functions
const Ease = {
  outCubic: (t) => 1 - Math.pow(1 - t, 3),
  inOutCubic: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  outQuart: (t) => 1 - Math.pow(1 - t, 4),
  outBack: (t) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  outElastic: (t) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
};

// RAF animation helper with pause/resume on visibility change
function createRafLoop(cb) {
  let rafId = null;
  let running = false;
  let startTime = null;

  const step = (ts) => {
    if (!running) return;
    if (startTime === null) startTime = ts;
    cb(ts - startTime, ts);
    rafId = requestAnimationFrame(step);
  };

  const onVis = () => {
    if (document.hidden) {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    } else {
      running = true;
      startTime = null;
      rafId = requestAnimationFrame(step);
    }
  };

  const start = () => {
    if (running) return;
    running = true;
    startTime = null;
    document.addEventListener('visibilitychange', onVis);
    rafId = requestAnimationFrame(step);
  };

  const stop = () => {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    document.removeEventListener('visibilitychange', onVis);
  };

  return { start, stop };
}

// IntersectionObserver helper for scroll fade-ins
function observeFadeItems(container) {
  if (!container) return () => {};
  if (typeof IntersectionObserver === 'undefined') {
    container.querySelectorAll('.fade-item').forEach(el => el.classList.add('is-in'));
    return () => {};
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('is-in'), i * 40);
        io.unobserve(entry.target);
      }
    });
  }, { root: container, threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

  container.querySelectorAll('.fade-item').forEach(el => io.observe(el));
  return () => io.disconnect();
}

// Safe hex → rgba
function hexToRgba(hex, alpha = 1) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

Object.assign(window, {
  formatDuration,
  formatTimeAgo,
  springEase,
  Ease,
  createRafLoop,
  observeFadeItems,
  hexToRgba,
});
