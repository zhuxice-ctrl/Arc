/* ============================================
   主入口
   - 初始化所有模块
   - 页面可见性管理
   - 全局交互协调
   ============================================ */

(function() {
  'use strict';

  const data = window.GOLDFISH_DATA;

  // 页面可见性状态
  let pageVisible = true;

  // 全局 RAF 管理
  const rafIds = [];

  function registerRaf(id) {
    rafIds.push(id);
  }

  function pauseAllRaf() {
    rafIds.forEach(function(id) {
      if (id) cancelAnimationFrame(id);
    });
    rafIds.length = 0;
  }

  // 页面可见性监听
  document.addEventListener('visibilitychange', function() {
    pageVisible = !document.hidden;
    if (!pageVisible) {
      pauseAllRaf();
    }
  });

  // 防止快速点击叠加定时器（统一的防抖节流工具）
  window.GoldfishUtils = {
    throttle: function(fn, wait) {
      let last = 0;
      let timer = null;
      return function() {
        const now = Date.now();
        const args = arguments;
        const ctx = this;
        const remaining = wait - (now - last);

        if (remaining <= 0) {
          if (timer) {
            clearTimeout(timer);
            timer = null;
          }
          last = now;
          fn.apply(ctx, args);
        } else if (!timer) {
          timer = setTimeout(function() {
            last = Date.now();
            timer = null;
            fn.apply(ctx, args);
          }, remaining);
        }
      };
    },

    debounce: function(fn, wait) {
      let timer = null;
      return function() {
        const args = arguments;
        const ctx = this;
        if (timer) clearTimeout(timer);
        timer = setTimeout(function() {
          timer = null;
          fn.apply(ctx, args);
        }, wait);
      };
    }
  };

  // 初始化完成后自动选择第一个品种（草金）作为引导
  function autoShowFirst() {
    // 延迟一段时间，让墨线生长动画先播放
    setTimeout(function() {
      if (window.GoldfishTree) {
        // 不自动打开面板，保持探索感
        // 只给一个轻微的引导：让第一个变异节点轻微闪烁
        const nodeMap = window.GoldfishTree.getNodeMap();
        if (nodeMap && nodeMap['grass']) {
          nodeMap['grass'].classList.add('is-selected');
          setTimeout(function() {
            nodeMap['grass'].classList.remove('is-selected');
          }, 1500);
        }
      }
    }, 2500);
  }

  // 页面卸载清理
  window.addEventListener('beforeunload', function() {
    pauseAllRaf();
  });

  // 启动
  function start() {
    // 各模块会自行初始化（通过 DOMContentLoaded 或立即执行）
    // 这里做全局协调

    // 自动展示引导
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      autoShowFirst();
    }

    // 暴露全局 init 状态
    window.GoldfishApp = {
      version: '1.0.0',
      ready: true,
      data: data
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
