/* ============================================
   驯化时间轴模块
   - 可拖动滑块
   - 朝代标记高亮
   - 与谱系树联动
   ============================================ */

(function() {
  'use strict';

  const track = document.getElementById('timeline-track');
  const handle = document.getElementById('timeline-handle');
  const label = document.getElementById('timeline-label');
  const marks = document.querySelectorAll('.timeline-mark');

  if (!track || !handle) return;

  const state = {
    isDragging: false,
    percent: 0, // 0-100
    currentDynasty: 'all',
    rafId: null,
    pageVisible: true
  };

  const dynasties = [
    { era: 'song', percent: 20, label: '宋代' },
    { era: 'ming', percent: 45, label: '明代' },
    { era: 'qing', percent: 75, label: '清代' },
    { era: 'modern', percent: 95, label: '当代' }
  ];

  function getTrackRect() {
    return track.getBoundingClientRect();
  }

  function updateHandlePosition() {
    handle.style.top = state.percent + '%';
  }

  function updateLabel() {
    if (state.percent < 2) {
      label.textContent = '全朝代';
      state.currentDynasty = 'all';
    } else if (state.percent < 32) {
      label.textContent = '宋代';
      state.currentDynasty = 'song';
    } else if (state.percent < 60) {
      label.textContent = '明代';
      state.currentDynasty = 'ming';
    } else if (state.percent < 85) {
      label.textContent = '清代';
      state.currentDynasty = 'qing';
    } else {
      label.textContent = '当代';
      state.currentDynasty = 'modern';
    }
  }

  function updateMarks() {
    marks.forEach(function(mark) {
      const era = mark.getAttribute('data-era');
      const pct = parseFloat(mark.getAttribute('data-percent'));

      if (state.percent >= pct - 5) {
        mark.classList.add('is-active');
      } else {
        mark.classList.remove('is-active');
      }
    });
  }

  function setPercent(pct, animate) {
    state.percent = Math.max(0, Math.min(100, pct));
    updateHandlePosition();
    updateLabel();
    updateMarks();
  }

  function handleDragStart(e) {
    state.isDragging = true;
    handle.classList.add('is-dragging');

    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const rect = getTrackRect();
    const y = clientY - rect.top;
    const pct = (y / rect.height) * 100;
    setPercent(pct);
    emitDynastyChange();
  }

  function handleDragMove(e) {
    if (!state.isDragging) return;

    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const rect = getTrackRect();
    const y = clientY - rect.top;
    const pct = (y / rect.height) * 100;
    setPercent(pct);
  }

  let lastEmitDynasty = null;
  let emitThrottle = null;

  function emitDynastyChange() {
    const dyn = state.currentDynasty;
    if (dyn === lastEmitDynasty) return;

    if (emitThrottle) clearTimeout(emitThrottle);
    emitThrottle = setTimeout(function() {
      lastEmitDynasty = dyn;

      // 联动高亮
      if (window.GoldfishTree && window.GoldfishTree.highlightDynasty) {
        window.GoldfishTree.highlightDynasty(dyn);
      }

      // 同步顶部导航
      const navItems = document.querySelectorAll('.nav-item');
      navItems.forEach(function(item) {
        const d = item.getAttribute('data-dynasty');
        if (d === dyn) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      const evt = new CustomEvent('goldfish:timeline', { detail: { dynasty: dyn, percent: state.percent } });
      document.dispatchEvent(evt);
    }, 50);
  }

  function handleDragEnd() {
    if (!state.isDragging) return;
    state.isDragging = false;
    handle.classList.remove('is-dragging');

    // 吸附到最近的朝代节点
    if (state.percent < 2) {
      setPercent(0);
    } else {
      let closest = dynasties[0];
      let minDist = Math.abs(state.percent - closest.percent);
      dynasties.forEach(function(d) {
        const dist = Math.abs(state.percent - d.percent);
        if (dist < minDist) {
          minDist = dist;
          closest = d;
        }
      });

      // 平滑吸附
      const startPct = state.percent;
      const endPct = closest.percent;
      const duration = 300;
      const startTime = performance.now();

      function snapStep(now) {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setPercent(startPct + (endPct - startPct) * eased);
        if (t < 1) {
          state.rafId = requestAnimationFrame(snapStep);
        } else {
          state.rafId = null;
          emitDynastyChange();
        }
      }

      if (state.rafId) cancelAnimationFrame(state.rafId);
      state.rafId = requestAnimationFrame(snapStep);
    }

    emitDynastyChange();
  }

  function bindEvents() {
    // 鼠标拖拽
    handle.addEventListener('mousedown', function(e) {
      e.preventDefault();
      handleDragStart(e);
    });

    window.addEventListener('mousemove', function(e) {
      if (state.isDragging) {
        handleDragMove(e);
        emitDynastyChange();
      }
    });

    window.addEventListener('mouseup', handleDragEnd);

    // 触摸拖拽
    handle.addEventListener('touchstart', function(e) {
      e.preventDefault();
      handleDragStart(e);
    }, { passive: false });

    window.addEventListener('touchmove', function(e) {
      if (state.isDragging) {
        handleDragMove(e);
        emitDynastyChange();
      }
    }, { passive: true });

    window.addEventListener('touchend', handleDragEnd);

    // 点击轨道跳转
    track.addEventListener('click', function(e) {
      if (e.target === handle || handle.contains(e.target)) return;

      const rect = getTrackRect();
      const y = e.clientY - rect.top;
      const pct = (y / rect.height) * 100;

      // 找最近的朝代
      let closest = { era: 'song', percent: 0 };
      if (pct < 10) closest = { era: 'all', percent: 0 };
      else {
        let minDist = Infinity;
        dynasties.forEach(function(d) {
          const dist = Math.abs(pct - d.percent);
          if (dist < minDist) {
            minDist = dist;
            closest = d;
          }
        });
      }

      setPercent(closest.percent);
      emitDynastyChange();
    });

    // 点击标记
    marks.forEach(function(mark) {
      mark.addEventListener('click', function(e) {
        e.stopPropagation();
        const pct = parseFloat(mark.getAttribute('data-percent'));
        setPercent(pct);
        emitDynastyChange();
      });
    });

    // 页面可见性
    document.addEventListener('visibilitychange', function() {
      state.pageVisible = !document.hidden;
      if (!state.pageVisible && state.rafId) {
        cancelAnimationFrame(state.rafId);
        state.rafId = null;
      }
    });

    // 监听朝代变化事件（从顶部导航来的）
    document.addEventListener('goldfish:dynasty', function(e) {
      const dyn = e.detail.dynasty;
      if (dyn === 'all') {
        setPercent(0);
      } else {
        const d = dynasties.find(function(x) { return x.era === dyn; });
        if (d) setPercent(d.percent);
      }
      lastEmitDynasty = dyn;
    });
  }

  // 初始化
  function init() {
    setPercent(0);
    bindEvents();
  }

  window.GoldfishTimeline = {
    init: init,
    setDynasty: function(dyn) {
      if (dyn === 'all') {
        setPercent(0);
      } else {
        const d = dynasties.find(function(x) { return x.era === dyn; });
        if (d) setPercent(d.percent);
      }
      lastEmitDynasty = dyn;
    },
    getCurrentDynasty: function() { return state.currentDynasty; }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
