/* =========================================================
   工具函数 — 物理模型 / RAF 循环 / 观察者 / 类型判定
   所有动画循环统一注册，visibilitychange 时暂停/恢复
   ========================================================= */

(function () {
  'use strict';

  // ---- RAF 循环管理器 ----
  // 每个循环通过 token 注册，页面隐藏或卸载时统一取消
  const rafLoops = new Map(); // token -> { id, fn, running }
  let rafSuspended = false;

  function startLoop(token, fn) {
    // 重建前先取消旧的
    stopLoop(token);
    let lastT = performance.now();
    const entry = { id: 0, fn, running: true };

    function frame(t) {
      if (!entry.running) return;
      const dt = Math.min(64, t - lastT); // 限制最大步长
      lastT = t;
      fn(dt, t);
      entry.id = requestAnimationFrame(frame);
    }
    entry.id = requestAnimationFrame(frame);
    rafLoops.set(token, entry);
  }

  function stopLoop(token) {
    const entry = rafLoops.get(token);
    if (entry) {
      entry.running = false;
      cancelAnimationFrame(entry.id);
      rafLoops.delete(token);
    }
  }

  function pauseAllLoops() {
    rafSuspended = true;
    rafLoops.forEach((entry) => {
      if (entry.running) {
        cancelAnimationFrame(entry.id);
        entry.running = false;
        entry._paused = true;
      }
    });
  }

  function resumeAllLoops() {
    if (!rafSuspended) return;
    rafSuspended = false;
    rafLoops.forEach((entry) => {
      if (entry._paused) {
        entry._paused = false;
        entry.running = true;
        let lastT = performance.now();
        function frame(t) {
          if (!entry.running) return;
          const dt = Math.min(64, t - lastT);
          lastT = t;
          entry.fn(dt, t);
          entry.id = requestAnimationFrame(frame);
        }
        entry.id = requestAnimationFrame(frame);
      }
    });
  }

  // 监听可见性
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseAllLoops();
    else resumeAllLoops();
  });
  // 卸载时全清
  window.addEventListener('beforeunload', () => {
    rafLoops.forEach((entry) => cancelAnimationFrame(entry.id));
    rafLoops.clear();
  });

  // ---- 弹簧 Hooke 积分器 ----
  // x: 当前位置, v: 当前速度, target: 目标, k: 弹性系数, d: 阻尼, dt: 步长(ms)
  function springStep(state, target, k, d, dt) {
    const dtSec = dt / 1000;
    const ax = -k * (state.x - target) - d * state.v;
    state.v += ax * dtSec;
    state.x += state.v * dtSec;
    return state;
  }

  function makeSpring(initial, k, d) {
    return { x: initial, v: 0, _k: k, _d: d };
  }

  // ---- lerp / clamp / map ----
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function mapRange(v, a1, a2, b1, b2) {
    return b1 + (v - a1) * (b2 - b1) / (a2 - a1);
  }

  // ---- 减动效检测 ----
  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // ---- IntersectionObserver 通用封装 ----
  function observeReveal(selector, opts) {
    if (!('IntersectionObserver' in window)) {
      // 降级：直接显示
      document.querySelectorAll(selector).forEach(el => el.classList.add('is-visible'));
      return { disconnect() {} };
    }
    const options = { threshold: 0.15, rootMargin: '0px 0px -80px 0px', ...opts };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, options);
    document.querySelectorAll(selector).forEach(el => io.observe(el));
    return io;
  }

  // ---- 随机 ----
  function rand(min, max) { return min + Math.random() * (max - min); }
  function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  // ---- 节流（rAF 版，用于 mousemove 等高频事件） ----
  function rafThrottle(fn) {
    let ticking = false;
    let lastEvt = null;
    return function (e) {
      lastEvt = e;
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        fn(lastEvt);
        ticking = false;
      });
    };
  }

  // 暴露到 window
  Object.assign(window, {
    DH: {
      startLoop,
      stopLoop,
      pauseAllLoops,
      resumeAllLoops,
      springStep,
      makeSpring,
      lerp,
      clamp,
      mapRange,
      prefersReducedMotion,
      observeReveal,
      rand,
      randInt,
      pick,
      rafThrottle,
    }
  });
})();
