/* ============================================
   巡夜人工作台 · 核心系统
   自定义光标、物理引擎、RAF 管理器、可见性处理
   ============================================ */

(function () {
  'use strict';

  // ==========================================
  // 全局命名空间
  // ==========================================
  window.NW = window.NW || {};

  // ==========================================
  // reduced-motion 检测
  // ==========================================
  NW.reducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ==========================================
  // RAF 动画管理器
  // 统一管理所有 requestAnimationFrame 循环
  // ==========================================
  NW.AnimManager = (function () {
    var loops = [];
    var rafId = null;
    var isPaused = false;

    function tick(ts) {
      if (isPaused) return;
      for (var i = 0; i < loops.length; i++) {
        try {
          loops[i].fn(ts);
        } catch (e) {
          // 静默失败，避免单个循环崩掉整个系统
        }
      }
      rafId = requestAnimationFrame(tick);
    }

    function start() {
      if (rafId === null && loops.length > 0) {
        rafId = requestAnimationFrame(tick);
      }
    }

    function stop() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    function add(id, fn) {
      // 防止重复添加
      for (var i = 0; i < loops.length; i++) {
        if (loops[i].id === id) {
          loops[i].fn = fn;
          return;
        }
      }
      loops.push({ id: id, fn: fn });
      start();
    }

    function remove(id) {
      for (var i = loops.length - 1; i >= 0; i--) {
        if (loops[i].id === id) {
          loops.splice(i, 1);
        }
      }
      if (loops.length === 0) {
        stop();
      }
    }

    function pause() {
      isPaused = true;
      stop();
    }

    function resume() {
      isPaused = false;
      if (loops.length > 0) {
        start();
      }
    }

    // 页面可见性切换
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        pause();
      } else {
        resume();
      }
    });

    // 页面卸载时清理
    window.addEventListener('beforeunload', function () {
      stop();
      loops = [];
    });

    return {
      add: add,
      remove: remove,
      pause: pause,
      resume: resume,
      isPaused: function () { return isPaused; }
    };
  })();

  // ==========================================
  // 定时器管理器
  // 统一管理 setTimeout，便于清理
  // ==========================================
  NW.TimerManager = (function () {
    var timers = {};
    var timerIdCounter = 0;

    function set(fn, delay) {
      var id = ++timerIdCounter;
      timers[id] = setTimeout(function () {
        delete timers[id];
        fn();
      }, delay);
      return id;
    }

    function clear(id) {
      if (timers[id]) {
        clearTimeout(timers[id]);
        delete timers[id];
      }
    }

    function clearAll() {
      for (var id in timers) {
        if (timers.hasOwnProperty(id)) {
          clearTimeout(timers[id]);
        }
      }
      timers = {};
    }

    window.addEventListener('beforeunload', clearAll);
    document.addEventListener('visibilitychange', function () {
      // 页面隐藏时不清除定时器，但减少不必要的回调
    });

    return { set: set, clear: clear, clearAll: clearAll };
  })();

  // ==========================================
  // 物理工具函数
  // ==========================================
  NW.Physics = {
    // 弹簧 Hooke 定律：F = -kx - dv
    // 返回加速度
    springAccel: function (position, target, stiffness, damping, velocity) {
      var force = -stiffness * (position - target);
      var dampingForce = -damping * velocity;
      return force + dampingForce;
    },

    // 阻尼衰减
    lerp: function (a, b, t) {
      return a + (b - a) * t;
    },

    // 约束值范围
    clamp: function (value, min, max) {
      return Math.max(min, Math.min(max, value));
    },

    // 磁吸反平方力
    magneticForce: function (distance, strength, minDist) {
      var d = Math.max(distance, minDist);
      return strength / (d * d);
    },

    // 角度差（带符号）
    angleDiff: function (a, b) {
      var diff = a - b;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      return diff;
    },

    // 缓动函数
    easeOutCubic: function (t) {
      return 1 - Math.pow(1 - t, 3);
    },

    easeOutElastic: function (t) {
      var c4 = (2 * Math.PI) / 3;
      return t === 0 ? 0 : t === 1 ? 1 :
        Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    },

    easeOutBack: function (t) {
      var c1 = 1.70158;
      var c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    },

    easeInOutCubic: function (t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
  };

  // ==========================================
  // 自定义光标
  // ==========================================
  NW.Cursor = (function () {
    var cursorEl = null;
    var ringEl = null;
    var dotEl = null;
    var glowEl = null;

    // 位置（目标位置 + 当前位置，带平滑）
    var targetX = window.innerWidth / 2;
    var targetY = window.innerHeight / 2;
    var currentX = targetX;
    var currentY = targetY;

    var isDragging = false;
    var isHovering = false;

    function init() {
      cursorEl = document.getElementById('cursor');
      if (!cursorEl) return;

      ringEl = cursorEl.querySelector('.cursor-ring');
      dotEl = cursorEl.querySelector('.cursor-dot');
      glowEl = cursorEl.querySelector('.cursor-glow');

      // 初始居中显示（使用 transform，与动画循环一致）
      cursorEl.style.opacity = '1';
      cursorEl.style.transform =
        'translate(' + targetX + 'px, ' + targetY + 'px) translate(-50%, -50%)';

      // 鼠标移动
      document.addEventListener('mousemove', onMouseMove, { passive: true });
      // 鼠标按下
      document.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mouseup', onMouseUp);
      // 鼠标离开窗口
      document.addEventListener('mouseleave', onMouseLeave);
      document.addEventListener('mouseenter', onMouseEnter);

      // 悬停交互元素检测
      setupHoverDetection();

      // 启动 RAF 平滑
      NW.AnimManager.add('cursor', update);
    }

    function onMouseMove(e) {
      targetX = e.clientX;
      targetY = e.clientY;
      cursorEl.style.opacity = '1';
    }

    function onMouseDown(e) {
      // 点击涟漪
      createRipple(e.clientX, e.clientY);
    }

    function onMouseUp() {
      // 点击释放
    }

    function onMouseLeave() {
      cursorEl.style.opacity = '0';
    }

    function onMouseEnter() {
      cursorEl.style.opacity = '1';
    }

    function update() {
      // 光标主体跟手（带一点滞后，更有质感）
      currentX += (targetX - currentX) * 0.25;
      currentY += (targetY - currentY) * 0.25;

      cursorEl.style.transform =
        'translate(' + currentX + 'px, ' + currentY + 'px) translate(-50%, -50%)';
    }

    function createRipple(x, y) {
      if (NW.reducedMotion) return;
      var ripple = document.createElement('div');
      ripple.className = 'cursor-click-ripple';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      document.body.appendChild(ripple);

      NW.TimerManager.set(function () {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 600);
    }

    function setupHoverDetection() {
      // 委托方式检测可交互元素
      document.addEventListener('mouseover', function (e) {
        var target = e.target;
        var interactive = target.closest(
          '[data-interactive], .rope-knob, .tower-lantern, .knife-lever, ' +
          '.watch-crown, .patrol-tag, .dimmer-knob, .widget-card'
        );
        if (interactive) {
          setHover(true);
        }
      });

      document.addEventListener('mouseout', function (e) {
        var target = e.target;
        var interactive = target.closest(
          '[data-interactive], .rope-knob, .tower-lantern, .knife-lever, ' +
          '.watch-crown, .patrol-tag, .dimmer-knob, .widget-card'
        );
        if (interactive) {
          // 检查是否真正离开了
          var related = e.relatedTarget;
          if (!related || !interactive.contains(related)) {
            setHover(false);
          }
        }
      });
    }

    function setHover(hovering) {
      isHovering = hovering;
      if (hovering) {
        cursorEl.classList.add('hover');
      } else {
        cursorEl.classList.remove('hover');
      }
    }

    function setDragging(dragging) {
      isDragging = dragging;
      if (dragging) {
        cursorEl.classList.add('dragging');
      } else {
        cursorEl.classList.remove('dragging');
      }
    }

    function getPosition() {
      return { x: currentX, y: currentY };
    }

    function getTargetPosition() {
      return { x: targetX, y: targetY };
    }

    return {
      init: init,
      setHover: setHover,
      setDragging: setDragging,
      getPosition: getPosition,
      getTargetPosition: getTargetPosition
    };
  })();

  // ==========================================
  // 工具函数
  // ==========================================
  NW.Utils = {
    // 获取元素相对视口的中心坐标
    getCenter: function (el) {
      var rect = el.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    },

    // 两点距离
    distance: function (x1, y1, x2, y2) {
      var dx = x2 - x1;
      var dy = y2 - y1;
      return Math.sqrt(dx * dx + dy * dy);
    },

    // 两点角度（弧度）
    angle: function (x1, y1, x2, y2) {
      return Math.atan2(y2 - y1, x2 - x1);
    },

    // 生成随机数
    random: function (min, max) {
      return Math.random() * (max - min) + min;
    },

    // 生成星星
    createStars: function (container, count) {
      if (!container) return;
      for (var i = 0; i < count; i++) {
        var star = document.createElement('div');
        star.className = 'star';
        star.style.left = NW.Utils.random(0, 100) + '%';
        star.style.top = NW.Utils.random(0, 60) + '%';
        star.style.animationDelay = NW.Utils.random(0, 3) + 's';
        star.style.animationDuration = NW.Utils.random(2, 4) + 's';
        container.appendChild(star);
      }
    },

    // 创建小尺寸星星（用于窗外）
    createSmallStars: function (container, count) {
      if (!container) return;
      for (var i = 0; i < count; i++) {
        var star = document.createElement('div');
        star.className = 'star-w';
        star.style.left = NW.Utils.random(0, 100) + '%';
        star.style.top = NW.Utils.random(0, 60) + '%';
        container.appendChild(star);
      }
    },

    // 防抖
    debounce: function (fn, delay) {
      var timer = null;
      return function () {
        var args = arguments;
        var ctx = this;
        if (timer) NW.TimerManager.clear(timer);
        timer = NW.TimerManager.set(function () {
          fn.apply(ctx, args);
        }, delay);
      };
    }
  };

})();
