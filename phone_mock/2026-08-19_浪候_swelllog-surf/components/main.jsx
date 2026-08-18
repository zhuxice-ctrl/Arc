// ===== MAIN ENTRY =====
// Renders app inside device frame + custom cursor + upgrade announcement

function Stage() {
  return (
    <div className="stage">
      <div className="stage-label">浪候 SWELLLOG · V2 原生 App</div>
      <IOSDevice dark width={390} height={844}>
        <App />
      </IOSDevice>
      <div className="stage-hint">拖动潮汐曲线游标 · 记一笔生成真实日志</div>
    </div>
  );
}

// ===== CUSTOM CURSOR =====
(function initCursor() {
  const cursor = document.getElementById('customCursor');
  const ring = document.getElementById('customCursorRing');
  
  if (!cursor || !ring) return;
  
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let rafId = null;
  let isVisible = true;

  // Direct DOM position for high-frequency moves
  const onMove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  };

  // Smooth ring follow with RAF
  const animate = () => {
    if (!isVisible) return;
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    rafId = requestAnimationFrame(animate);
  };

  const startRAF = () => {
    if (!rafId && isVisible) {
      rafId = requestAnimationFrame(animate);
    }
  };

  const stopRAF = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  // Pause on visibility change
  const onVisibility = () => {
    if (document.hidden) {
      isVisible = false;
      stopRAF();
    } else {
      isVisible = true;
      startRAF();
    }
  };

  // Hover states
  const onOver = (e) => {
    if (e.target.closest('.cursor-hover, button, a, [role="button"], input, textarea, select')) {
      cursor.classList.add('hover');
      ring.classList.add('hover');
    }
  };

  const onOut = (e) => {
    if (e.target.closest('.cursor-hover, button, a, [role="button"], input, textarea, select')) {
      cursor.classList.remove('hover');
      ring.classList.remove('hover');
    }
  };

  // Initialize at center of screen
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
  ring.style.left = mouseX + 'px';
  ring.style.top = mouseY + 'px';
  ringX = mouseX;
  ringY = mouseY;

  document.addEventListener('mousemove', onMove, { passive: true });
  document.addEventListener('mouseover', onOver);
  document.addEventListener('mouseout', onOut);
  document.addEventListener('visibilitychange', onVisibility);
  
  startRAF();

  window.__cleanupCursor = () => {
    stopRAF();
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseover', onOver);
    document.removeEventListener('mouseout', onOut);
    document.removeEventListener('visibilitychange', onVisibility);
  };
})();

// ===== ANNOUNCE UPGRADE =====
(function announceUpgrade() {
  try {
    window.parent.postMessage({ type: 'miaoda:upgrade:available', kind: 'interactive-prototype' }, '*');
  } catch (e) {}
})();
if (document.readyState !== 'complete') {
  window.addEventListener('load', function announce() {
    try {
      window.parent.postMessage({ type: 'miaoda:upgrade:available', kind: 'interactive-prototype' }, '*');
    } catch (e) {}
  }, { once: true });
}

// ===== ADDITIONAL GLOBAL STYLES =====
(function injectStyles() {
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    @keyframes pulse {
      0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
      50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes slideDown {
      from { opacity: 0; max-height: 0; overflow: hidden; }
      to { opacity: 1; max-height: 600px; overflow: visible; }
    }
    @keyframes waveFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }

    .page-scroll::-webkit-scrollbar { width: 0; display: none; }
    .page-scroll { -ms-overflow-style: none; scrollbar-width: none; }

    /* Hover effects */
    .hero-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
    .hero-card:hover { transform: translateY(-2px); }

    .spot-card { transition: transform 0.2s ease, border-color 0.2s ease; }
    .spot-card:hover { transform: translateX(4px); border-color: var(--accent); }

    .stat-card { transition: transform 0.2s ease; }
    .stat-card:hover { transform: translateY(-2px); }

    .board-card { transition: transform 0.25s ease, border-color 0.25s ease; }
    .board-card:hover { transform: translateY(-3px); border-color: var(--secondary); }

    .log-item { transition: background 0.15s ease; }
    .log-item:hover .log-item > div { background: var(--bg-surface); }

    .feed-item:hover { background: rgba(255,255,255,0.02); }

    .hourly-row { transition: background 0.15s ease; }
    .hourly-row:hover { background: rgba(255,255,255,0.02); }

    .menu-row { transition: background 0.15s ease; }
    .menu-row:hover { background: rgba(255,255,255,0.03); }

    .color-token { transition: transform 0.2s ease; }
    .color-token:hover { transform: scale(1.04); }

    .type-row { transition: background 0.15s ease; }
    .type-row:hover { background: rgba(255,255,255,0.02); }

    .spacing-bar { transition: transform 0.2s ease; transform-origin: bottom center; }
    .spacing-bar:hover { transform: scaleY(1.15); }

    .api-endpoint { transition: border-color 0.2s ease; }
    .api-endpoint:hover { border-color: var(--accent); }

    .chip { transition: transform 0.15s ease, opacity 0.15s ease; }
    .chip:hover { transform: scale(1.05); }

    .btn-primary { transition: transform 0.15s ease, box-shadow 0.2s ease; }
    .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,0,0,0.25); }
    .btn-primary:active { transform: translateY(0); box-shadow: none; }

    .btn-secondary { transition: border-color 0.15s ease, background 0.15s ease; }
    .btn-secondary:hover { border-color: var(--text-secondary); }

    .avatar { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
    .avatar:hover { transform: scale(1.08); }

    .achievement-card { transition: transform 0.2s ease; }
    .achievement-card:hover { transform: translateY(-2px) scale(1.02); }

    .tab-btn { transition: opacity 0.15s ease; }
    .tab-btn:active { opacity: 0.7; }

    .btn-log { transition: all 0.2s ease; }
    .btn-log:hover { background: var(--accent); color: var(--bg); transform: translateY(-1px); }

    .wave-height-num {
      font-variant-numeric: tabular-nums;
      background: linear-gradient(180deg, var(--text-primary) 0%, var(--text-secondary) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .training-card { transition: transform 0.2s ease; }
    .training-card:hover { transform: translateY(-2px); }

    .next-cp-card { transition: transform 0.2s ease, border-color 0.2s ease; }
    .next-cp-card:hover { transform: translateX(4px); border-color: var(--accent); }

    .section-card { transition: transform 0.2s ease; }
    .section-card:hover { transform: translateX(4px); }

    .countdown-card { transition: transform 0.3s ease; }
    .countdown-card:hover { transform: scale(1.01); }

    .aid-station-row { transition: background 0.15s ease; }
    .aid-station-row:hover { background: rgba(255,255,255,0.02); }

    .training-row { transition: background 0.15s ease; }
    .training-row:hover { background: rgba(255,255,255,0.02); }

    .tab-inner { transition: all 0.2s ease; }
  `;
  document.head.appendChild(styleEl);
})();

// ===== RENDER =====
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Stage />);
