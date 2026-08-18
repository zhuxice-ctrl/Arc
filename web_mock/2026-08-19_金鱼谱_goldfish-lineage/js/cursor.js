/* ============================================
   自定义光标模块
   - 开页居中
   - hover 品种节点时变鱼眼形态
   - 点击态/文字态
   - 浅色背景上的适配
   - 支持 prefers-reduced-motion
   ============================================ */

(function() {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    document.documentElement.classList.add('reduced-motion');
    return;
  }

  const cursor = document.getElementById('custom-cursor');
  if (!cursor) return;

  const state = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    targetX: window.innerWidth / 2,
    targetY: window.innerHeight / 2,
    isFisheye: false,
    isClicking: false,
    isText: false,
    onLight: false,
    rafId: null,
    visible: true,
    pageVisible: true
  };

  // 初始位置：屏幕中央
  cursor.style.transform = `translate(${state.x}px, ${state.y}px) translate(-50%, -50%)`;

  function updateCursor() {
    if (!state.pageVisible || !state.visible) {
      state.rafId = null;
      return;
    }

    // 缓动跟随
    const ease = 0.2;
    state.x += (state.targetX - state.x) * ease;
    state.y += (state.targetY - state.y) * ease;

    cursor.style.transform = `translate(${state.x}px, ${state.y}px) translate(-50%, -50%)`;

    state.rafId = requestAnimationFrame(updateCursor);
  }

  function startRaf() {
    if (state.rafId) return;
    state.rafId = requestAnimationFrame(updateCursor);
  }

  function stopRaf() {
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
      state.rafId = null;
    }
  }

  // 鼠标移动（直接设置目标位置，不重渲染）
  document.addEventListener('mousemove', function(e) {
    state.targetX = e.clientX;
    state.targetY = e.clientY;
    if (!state.rafId && state.pageVisible && state.visible) {
      startRaf();
    }
  }, { passive: true });

  // 鼠标按下
  document.addEventListener('mousedown', function() {
    state.isClicking = true;
    cursor.classList.add('is-clicking');
  });

  // 鼠标抬起
  document.addEventListener('mouseup', function() {
    state.isClicking = false;
    cursor.classList.remove('is-clicking');
  });

  // 页面可见性变化
  document.addEventListener('visibilitychange', function() {
    state.pageVisible = !document.hidden;
    if (state.pageVisible && state.visible) {
      startRaf();
    } else {
      stopRaf();
    }
  });

  // 鼠标离开/进入窗口
  document.addEventListener('mouseleave', function() {
    state.visible = false;
    cursor.style.opacity = '0';
    stopRaf();
  });

  document.addEventListener('mouseenter', function() {
    state.visible = true;
    cursor.style.opacity = '1';
    startRaf();
  });

  // 利用事件委托处理 hover 状态
  document.addEventListener('mouseover', function(e) {
    const target = e.target;

    // 鱼眼态：鱼节点、可点击元素
    if (target.closest && target.closest('.fish-node, .control-btn, .nav-item, .timeline-handle, .panel-handle, .panel-close, .timeline-mark')) {
      state.isFisheye = true;
      cursor.classList.add('is-fisheye');
    }

    // 文字态：文本段落
    if (target.closest && target.closest('p, h1, h2, h3, h4, span, .desc-text, .feature-row, .info-item')) {
      // 只在非交互元素上显示文本光标
      if (!target.closest('.fish-node, button, .nav-item, [role="button"]')) {
        state.isText = true;
        cursor.classList.add('is-text');
      }
    }

    // 浅色背景检测（比较面板内）
    if (target.closest && target.closest('.panel-content, .panel-handle, .compare-panel')) {
      state.onLight = true;
      cursor.classList.add('on-light');
    }
  });

  document.addEventListener('mouseout', function(e) {
    const target = e.target;
    const related = e.relatedTarget;

    // 鱼眼态移除
    if (target.closest && target.closest('.fish-node, .control-btn, .nav-item, .timeline-handle, .panel-handle, .panel-close, .timeline-mark')) {
      if (!related || !related.closest || !related.closest('.fish-node, .control-btn, .nav-item, .timeline-handle, .panel-handle, .panel-close, .timeline-mark')) {
        state.isFisheye = false;
        cursor.classList.remove('is-fisheye');
      }
    }

    // 文字态移除
    if (target.closest && target.closest('p, h1, h2, h3, h4, span, .desc-text, .feature-row, .info-item')) {
      if (!related || !related.closest || !related.closest('p, h1, h2, h3, h4, span, .desc-text, .feature-row, .info-item')) {
        state.isText = false;
        cursor.classList.remove('is-text');
      }
    }

    // 浅色背景移除
    if (target.closest && target.closest('.panel-content, .panel-handle, .compare-panel')) {
      if (!related || !related.closest || !related.closest('.panel-content, .panel-handle, .compare-panel')) {
        state.onLight = false;
        cursor.classList.remove('on-light');
      }
    }
  });

  // 暴露 API
  window.GoldfishCursor = {
    setFisheye: function(val) {
      state.isFisheye = !!val;
      cursor.classList.toggle('is-fisheye', val);
    }
  };

  // 启动动画循环
  startRaf();

  // 页面卸载时清理
  window.addEventListener('beforeunload', stopRaf);
})();
