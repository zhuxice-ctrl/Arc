/* ============================================================
   PHOSPHOR Main — 导航、滚动联动、升级宣告
   ============================================================ */

(function () {
  'use strict';

  // ========== 侧边导航点击 ==========
  const navTicks = document.querySelectorAll('.nav-tick');
  const zones = document.querySelectorAll('.zone');

  navTicks.forEach(function (tick) {
    tick.addEventListener('click', function () {
      const target = parseInt(tick.dataset.target, 10);
      const zone = zones[target];
      if (zone) {
        zone.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ========== 滚动时高亮当前展区 ==========
  let currentZone = 0;

  function updateActiveNav() {
    const scrollY = window.scrollY + window.innerHeight * 0.4; // 以视口偏上位置判断

    let newZone = 0;
    zones.forEach(function (zone, i) {
      if (zone.offsetTop <= scrollY) {
        newZone = i;
      }
    });

    if (newZone !== currentZone) {
      currentZone = newZone;
      navTicks.forEach(function (tick, i) {
        if (i === newZone) {
          tick.classList.add('is-active');
        } else {
          tick.classList.remove('is-active');
        }
      });
    }
  }

  // 节流的滚动监听
  let scrollTick = false;
  window.addEventListener('scroll', function () {
    if (!scrollTick) {
      requestAnimationFrame(function () {
        updateActiveNav();
        scrollTick = false;
      });
      scrollTick = true;
    }
  }, { passive: true });

  // 初始
  updateActiveNav();

  // ========== 滚动渐入（给非 canvas 文字元素加 reveal 类） ==========
  // 给每个展区的标题、描述、meta 添加渐入效果
  zones.forEach(function (zone) {
    const meta = zone.querySelector('.zone-meta');
    const title = zone.querySelector('.zone-title, .hero-title');
    const desc = zone.querySelector('.zone-desc, .hero-desc');
    const extra = zone.querySelector('.magnetic-grid, .spectrum-readout, .coda-content, .scroll-hint');

    if (meta) { meta.classList.add('reveal'); meta.style.transitionDelay = '0s'; }
    if (title) { title.classList.add('reveal'); title.style.transitionDelay = '0.1s'; }
    if (desc) { desc.classList.add('reveal'); desc.style.transitionDelay = '0.2s'; }
    if (extra) { extra.classList.add('reveal'); extra.style.transitionDelay = '0.3s'; }
  });

  PH.initReveal();

  // ========== 隐藏原生光标（如果自定义光标可用） ==========
  // 已在 CSS 中通过 cursor: none 处理

  // ========== 宣告可升级为全栈应用 ==========
  function announceUpgrade() {
    try {
      window.parent.postMessage({ type: 'miaoda:upgrade:available', kind: 'interactive-prototype' }, '*');
    } catch (e) { /* 跨域失败忽略 */ }
  }
  announceUpgrade();
  if (document.readyState !== 'complete') {
    window.addEventListener('load', announceUpgrade, { once: true });
  }

  // ========== 鼠标离开窗口时隐藏光标 ==========
  document.addEventListener('mouseleave', function () {
    const cursor = document.getElementById('cursor');
    if (cursor) cursor.style.opacity = '0';
  });
  document.addEventListener('mouseenter', function () {
    const cursor = document.getElementById('cursor');
    if (cursor) cursor.style.opacity = '1';
  });

  // ========== 键盘导航 ==========
  document.addEventListener('keydown', function (e) {
    // 空格键 / 下箭头：下一展区
    if (e.code === 'Space' || e.code === 'ArrowDown' || e.code === 'PageDown') {
      e.preventDefault();
      const next = Math.min(currentZone + 1, zones.length - 1);
      zones[next].scrollIntoView({ behavior: 'smooth' });
    }
    // 上箭头：上一展区
    if (e.code === 'ArrowUp' || e.code === 'PageUp') {
      e.preventDefault();
      const prev = Math.max(currentZone - 1, 0);
      zones[prev].scrollIntoView({ behavior: 'smooth' });
    }
    // Home / End
    if (e.code === 'Home') {
      e.preventDefault();
      zones[0].scrollIntoView({ behavior: 'smooth' });
    }
    if (e.code === 'End') {
      e.preventDefault();
      zones[zones.length - 1].scrollIntoView({ behavior: 'smooth' });
    }
  });

  // ========== 视差滚动 ==========
  // 每个展区的文字叠加层以不同速度随滚动偏移，产生纵深感
  // 注意：canvas 不做视差移动，避免鼠标坐标错位
  if (!PH.reducedMotion) {
    const parallaxItems = [];
    zones.forEach(function (zone, i) {
      const overlay = zone.querySelector('.zone-overlay');
      if (!overlay) return;
      parallaxItems.push({
        el: overlay,
        speed: 0.08 + (i % 3) * 0.03 // 不同展区速度略有差异
      });
    });

    let parallaxTick = false;
    function updateParallax() {
      parallaxTick = false;
      for (let i = 0; i < parallaxItems.length; i++) {
        const item = parallaxItems[i];
        const rect = item.el.getBoundingClientRect();
        // 元素相对视口中心的偏移
        const offset = (rect.top + rect.height / 2) - window.innerHeight / 2;
        const translateY = offset * item.speed;
        item.el.style.transform = `translateY(${translateY}px)`;
      }
    }

    window.addEventListener('scroll', function () {
      if (!parallaxTick) {
        requestAnimationFrame(updateParallax);
        parallaxTick = true;
      }
    }, { passive: true });

    // 初始
    updateParallax();
  }

  // ========== 防止文字选中时的难看效果 ==========
  // 拖拽画布时禁用选中
  let dragPrevented = false;
  document.addEventListener('mousedown', function (e) {
    if (e.target.closest('.zone-canvas, .elastic-anchor')) {
      dragPrevented = true;
      document.body.style.userSelect = 'none';
    }
  });
  document.addEventListener('mouseup', function () {
    if (dragPrevented) {
      dragPrevented = false;
      document.body.style.userSelect = '';
    }
  });

})();
