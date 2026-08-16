// ── 签名动效组件 ──
// 所有动效均基于物理模型或主题语义
// 支持 reduced-motion 降级
// 页面切换 / visibilitychange 自动暂停，卸载时统一取消

// 减少 motion 的查询结果（全局缓存）
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============================================================
// 1. BubbleField — CO2 气泡上升背景
//    气泡速度随发酵活跃度变化（activity: high/medium/low）
// ============================================================
function BubbleField({ activity = 'medium', color = '#D9A441', speedMul = 1, count = 24 }) {
  const canvasRef = React.useRef(null);
  const speedRef = React.useRef(speedMul);
  const activityRef = React.useRef(activity);
  const reducedRef = React.useRef(reducedMotion);

  React.useEffect(() => { speedRef.current = speedMul; }, [speedMul]);
  React.useEffect(() => { activityRef.current = activity; }, [activity]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    // Generate bubbles
    const speedByActivity = { high: 1.4, medium: 0.9, low: 0.45 };
    const countByActivity = { high: 32, medium: 22, low: 14 };

    let bubbles = [];
    const resetBubbles = () => {
      const rect = canvas.getBoundingClientRect();
      const n = Math.min(count, countByActivity[activityRef.current] || 22);
      bubbles = new Array(n).fill(0).map(() => spawnBubble(rect.width, rect.height, true));
    };

    function spawnBubble(w, h, randomY = false) {
      const size = 2 + Math.random() * 5;
      const act = activityRef.current || 'medium';
      const baseSpeed = speedByActivity[act] || 0.9;
      const vy = (baseSpeed + Math.random() * baseSpeed * 0.6) * (0.5 + size * 0.15);
      return {
        x: Math.random() * w,
        y: randomY ? Math.random() * h : h + size + 5,
        size,
        vy,
        vx: (Math.random() - 0.5) * 0.25,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.008 + Math.random() * 0.012,
        alpha: 0.15 + Math.random() * 0.45,
      };
    }

    resetBubbles();

    let rafId = null;
    let lastTs = 0;
    let running = true;

    const step = (ts) => {
      if (!running) return;
      const dt = lastTs ? Math.min((ts - lastTs) / 16.67, 2.5) : 1; // cap delta
      lastTs = ts;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width, h = rect.height;

      ctx.clearRect(0, 0, w, h);

      const smul = speedRef.current || 1;

      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];
        b.wobble += b.wobbleSpeed * dt;
        b.x += Math.sin(b.wobble) * b.vx * dt;
        b.y -= b.vy * smul * dt;

        // Gradient fill bubble
        const grad = ctx.createRadialGradient(
          b.x - b.size * 0.3, b.y - b.size * 0.3, b.size * 0.1,
          b.x, b.y, b.size
        );
        grad.addColorStop(0, hexToRgba(color, b.alpha * 1.2));
        grad.addColorStop(0.5, hexToRgba(color, b.alpha * 0.6));
        grad.addColorStop(1, hexToRgba(color, 0));

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Highlight
        ctx.beginPath();
        ctx.arc(b.x - b.size * 0.35, b.y - b.size * 0.35, b.size * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba('#FFFFFF', b.alpha * 0.8);
        ctx.fill();

        // Respawn at bottom when gone
        if (b.y < -b.size - 5) {
          Object.assign(b, spawnBubble(w, h, false));
          b.y = h + b.size + Math.random() * 20;
          b.x = Math.random() * w;
        }
      }

      rafId = requestAnimationFrame(step);
    };

    const onVis = () => {
      if (document.hidden) {
        running = false;
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      } else {
        running = true;
        lastTs = 0;
        rafId = requestAnimationFrame(step);
      }
    };

    const ro = new ResizeObserver(() => {
      resize();
      resetBubbles();
    });
    ro.observe(canvas);

    document.addEventListener('visibilitychange', onVis);

    if (reducedRef.current) {
      // Reduced motion: draw a few static bubbles
      (function drawStatic() {
        const rect = canvas.getBoundingClientRect();
        for (let i = 0; i < 6; i++) {
          const b = spawnBubble(rect.width, rect.height, true);
          const grad = ctx.createRadialGradient(
            b.x - b.size * 0.3, b.y - b.size * 0.3, b.size * 0.1,
            b.x, b.y, b.size
          );
          grad.addColorStop(0, hexToRgba(color, b.alpha));
          grad.addColorStop(1, hexToRgba(color, 0));
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }
      })();
    } else {
      rafId = requestAnimationFrame(step);
    }

    return () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', onVis);
      ro.disconnect();
    };
  }, [color, count]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}

// ============================================================
// 2. DoughBreathe — 面团呼吸膨胀收缩
//    模拟面团随温度/发酵进程的缓慢呼吸
// ============================================================
function DoughBreathe({ scale = 1.05, color = '#E8C07D', size = 180, speed = 1 }) {
  const svgRef = React.useRef(null);
  const reducedRef = React.useRef(reducedMotion);

  React.useEffect(() => {
    if (reducedRef.current) return;
    const svg = svgRef.current;
    if (!svg) return;
    const shape = svg.querySelector('#dough-shape');
    if (!shape) return;

    let rafId = null;
    let running = true;
    let startTime = null;

    // Base vertices for a soft blob shape (8 points)
    const basePts = [];
    const ptCount = 12;
    const baseR = size / 2 * 0.9;
    for (let i = 0; i < ptCount; i++) {
      const angle = (i / ptCount) * Math.PI * 2;
      basePts.push({
        angle,
        r: baseR * (0.92 + Math.sin(angle * 2) * 0.06 + Math.cos(angle * 3) * 0.03),
        wobbleOffset: Math.random() * Math.PI * 2,
      });
    }

    function buildPath(pts, center, scaleAmt) {
      if (pts.length === 0) return '';
      let d = '';
      const points = pts.map((p, i) => {
        const next = pts[(i + 1) % pts.length];
        const r = p.r * scaleAmt;
        const nx = center.x + Math.cos(p.angle) * r;
        const ny = center.y + Math.sin(p.angle) * r;
        return { x: nx, y: ny };
      });
      // Catmull-Rom → Bezier
      for (let i = 0; i < points.length; i++) {
        const p0 = points[(i - 1 + points.length) % points.length];
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];
        const p3 = points[(i + 2) % points.length];
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        if (i === 0) d += `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} `;
        d += `C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)} ${cp2x.toFixed(2)} ${cp2y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)} `;
      }
      d += 'Z';
      return d;
    }

    const step = (ts) => {
      if (!running) return;
      if (startTime === null) startTime = ts;
      const t = (ts - startTime) / 1000 * speed;

      // Slow breath: sin wave with period ~6s
      const breath = 1 + Math.sin(t * 1.05) * 0.025 * (scale - 1) * 40;
      // Subtle per-point wobble
      const pts = basePts.map((p, i) => ({
        angle: p.angle,
        r: p.r * breath + Math.sin(t * 0.7 + p.wobbleOffset) * 1.5,
        wobbleOffset: p.wobbleOffset,
      }));

      const center = { x: size / 2, y: size / 2 };
      const d = buildPath(pts, center, 1);
      shape.setAttribute('d', d);

      rafId = requestAnimationFrame(step);
    };

    const onVis = () => {
      if (document.hidden) {
        running = false;
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      } else {
        running = true;
        startTime = null;
        rafId = requestAnimationFrame(step);
      }
    };
    document.addEventListener('visibilitychange', onVis);

    // Draw initial shape
    const center = { x: size / 2, y: size / 2 };
    shape.setAttribute('d', buildPath(basePts, center, 1));
    rafId = requestAnimationFrame(step);

    return () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [size, speed, scale]);

  return (
    <svg ref={svgRef} width={size} height={size} viewBox={`0 0 ${size} ${size}`}
         style={{ display: 'block' }}>
      <defs>
        <radialGradient id="dough-grad" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor={color} stopOpacity="0.95" />
          <stop offset="60%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </radialGradient>
        <filter id="dough-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path id="dough-shape" d="" fill="url(#dough-grad)" filter="url(#dough-glow)" />
      {/* Surface highlights */}
      <ellipse cx={size * 0.38} cy={size * 0.3} rx={size * 0.15} ry={size * 0.08}
               fill="#fff" opacity="0.25" />
      <ellipse cx={size * 0.55} cy={size * 0.25} rx={size * 0.08} ry={size * 0.04}
               fill="#fff" opacity="0.18" />
    </svg>
  );
}

// ============================================================
// 3. CountdownRing — 倒计时环 + 数字滚动
//    环形进度，数字滚动动画
// ============================================================
function CountdownRing({
  totalSeconds, elapsed = 0, size = 200, strokeWidth = 10,
  color = '#D9A441', bgColor = 'rgba(217,164,65,0.15)',
  speedMul = 1, label = '',
}) {
  const ringRef = React.useRef(null);
  const numRef = React.useRef(null);
  const reducedRef = React.useRef(reducedMotion);

  const progress = Math.min(elapsed / totalSeconds, 1);
  const remaining = Math.max(0, totalSeconds - elapsed);

  const formatTime = (s) => {
    const hr = Math.floor(s / 3600);
    const min = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    if (hr > 0) return `${hr}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  React.useEffect(() => {
    if (reducedRef.current) return;
    const el = numRef.current;
    if (!el) return;
    // Number roll animation when value changes
    el.style.transition = 'transform 300ms cubic-bezier(.2,.8,.2,1), opacity 300ms';
  }, []);

  const circumference = Math.PI * (size - strokeWidth);
  const offset = circumference * (1 - progress);

  return (
    <div style={{
      position: 'relative', width: size, height: size,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
           style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2} cy={size / 2}
          r={(size - strokeWidth) / 2}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <circle
          ref={ringRef}
          cx={size / 2} cy={size / 2}
          r={(size - strokeWidth) / 2}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 600ms cubic-bezier(.2,.8,.2,1)',
            filter: `drop-shadow(0 0 8px ${hexToRgba(color, 0.6)})`,
          }}
        />
      </svg>
      <div style={{
        position: 'absolute', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        top: 0, left: 0, right: 0, bottom: 0,
      }}>
        <div ref={numRef} className="mono" style={{
          fontSize: size * 0.18, fontWeight: 500, color: color,
          letterSpacing: '0.02em', fontVariantNumeric: 'tabular-nums',
        }}>
          {formatTime(remaining)}
        </div>
        {label && (
          <div style={{ fontSize: 11, color: 'rgba(247,242,233,0.5)', marginTop: 2 }}>
            {label}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// 4. RollingNumber — 数字滚动动画组件
// ============================================================
function RollingNumber({ value, prefix = '', suffix = '', fontSize = 24, color = '#F7F2E9', duration = 600 }) {
  const [display, setDisplay] = React.useState(value);
  const prevRef = React.useRef(value);
  const rafRef = React.useRef(null);

  React.useEffect(() => {
    const prev = prevRef.current;
    const next = value;
    if (prev === next) return;
    if (reducedMotion) { setDisplay(next); prevRef.current = next; return; }

    const startTime = performance.now();
    const diff = next - prev;

    const tick = (ts) => {
      const elapsed = ts - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = Ease.outCubic(t);
      setDisplay(prev + diff * eased);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        prevRef.current = next;
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  const decimals = value % 1 !== 0 ? 1 : 0;

  return (
    <span style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize, fontWeight: 500, color,
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: '-0.01em',
    }}>
      {prefix}{display.toFixed(decimals)}{suffix}
    </span>
  );
}

// ============================================================
// 5. YeastBurst — 酵母爆裂动画（点击反馈）
// ============================================================
function YeastBurst({ trigger, color = '#D9A441' }) {
  const [bursts, setBursts] = React.useState([]);

  React.useEffect(() => {
    if (!trigger) return;
    const id = Date.now() + Math.random();
    setBursts(prev => [...prev, { id, x: trigger.x, y: trigger.y }]);
    setTimeout(() => {
      setBursts(prev => prev.filter(b => b.id !== id));
    }, 700);
  }, [trigger]);

  return (
    <>
      {bursts.map(b => (
        <div key={b.id} style={{
          position: 'absolute', left: b.x, top: b.y,
          width: 0, height: 0, pointerEvents: 'none',
        }}>
          {[...Array(8)].map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const dist = 20 + Math.random() * 15;
            return (
              <div key={i} style={{
                position: 'absolute',
                width: 5, height: 5, borderRadius: '50%',
                background: color,
                boxShadow: `0 0 6px ${color}`,
                animation: `yeastBurst-${i} 600ms cubic-bezier(.2,.8,.2,1) forwards`,
                // Inline via style tag below
                ['--bx' + i]: Math.cos(angle) * dist + 'px',
                ['--by' + i]: Math.sin(angle) * dist + 'px',
              }} />
            );
          })}
        </div>
      ))}
    </>
  );
}

// ============================================================
// 6. Ripple Button — 带涟漪效果的按钮
// ============================================================
function RippleButton({ children, onClick, color = '#D9A441', variant = 'primary', style = {}, ...rest }) {
  const [ripples, setRipples] = React.useState([]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now() + Math.random();
    setRipples(prev => [...prev, { id, x, y }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 600);
    if (onClick) onClick(e);
  };

  const baseStyle = {
    position: 'relative', overflow: 'hidden',
    border: 'none', cursor: 'pointer', fontFamily: 'inherit',
    transition: 'transform 150ms cubic-bezier(.2,.8,.2,1), box-shadow 200ms',
  };

  const variantStyle = variant === 'primary' ? {
    background: color,
    color: '#2B1D16',
    fontWeight: 600,
  } : variant === 'secondary' ? {
    background: 'rgba(247,242,233,0.08)',
    color: '#F7F2E9',
    border: `1px solid rgba(247,242,233,0.15)`,
  } : {
    background: 'transparent',
    color,
  };

  return (
    <button
      onClick={handleClick}
      className="interactive"
      style={{ ...baseStyle, ...variantStyle, ...style }}
      {...rest}
    >
      {ripples.map(r => (
        <span key={r.id} style={{
          position: 'absolute',
          left: r.x, top: r.y,
          width: 10, height: 10,
          marginLeft: -5, marginTop: -5,
          borderRadius: '50%',
          background: variant === 'primary' ? 'rgba(43,29,22,0.3)' : 'rgba(247,242,233,0.3)',
          pointerEvents: 'none',
          animation: 'rippleExpand 600ms ease-out forwards',
        }} />
      ))}
      {children}
    </button>
  );
}

// Add keyframes for ripple + yeast burst
const __EFFECT_STYLES = `
  @keyframes rippleExpand {
    0% { transform: scale(0); opacity: 0.6; }
    100% { transform: scale(40); opacity: 0; }
  }
  @keyframes yeastBurst-0 { to { transform: translate(calc(var(--bx0, 0)), calc(var(--by0, 0))) scale(0); opacity: 0; } }
  @keyframes yeastBurst-1 { to { transform: translate(calc(var(--bx1, 0)), calc(var(--by1, 0))) scale(0); opacity: 0; } }
  @keyframes yeastBurst-2 { to { transform: translate(calc(var(--bx2, 0)), calc(var(--by2, 0))) scale(0); opacity: 0; } }
  @keyframes yeastBurst-3 { to { transform: translate(calc(var(--bx3, 0)), calc(var(--by3, 0))) scale(0); opacity: 0; } }
  @keyframes yeastBurst-4 { to { transform: translate(calc(var(--bx4, 0)), calc(var(--by4, 0))) scale(0); opacity: 0; } }
  @keyframes yeastBurst-5 { to { transform: translate(calc(var(--bx5, 0)), calc(var(--by5, 0))) scale(0); opacity: 0; } }
  @keyframes yeastBurst-6 { to { transform: translate(calc(var(--bx6, 0)), calc(var(--by6, 0))) scale(0); opacity: 0; } }
  @keyframes yeastBurst-7 { to { transform: translate(calc(var(--bx7, 0)), calc(var(--by7, 0))) scale(0); opacity: 0; } }
`;

function EffectStyles() {
  return <style>{__EFFECT_STYLES}</style>;
}

Object.assign(window, {
  BubbleField,
  DoughBreathe,
  CountdownRing,
  RollingNumber,
  YeastBurst,
  RippleButton,
  EffectStyles,
  reducedMotion,
});
