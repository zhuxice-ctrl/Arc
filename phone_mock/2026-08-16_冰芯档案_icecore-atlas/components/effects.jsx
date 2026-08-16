/* ============================================================
   effects.jsx — Icecore Atlas signature motion components
   All effects use physical models (Hooke's law, buoyancy,
   damped spring, gravity + drag) and RAF integrators.
   All timers/RAFs clean up on visibilitychange + unmount.
   ============================================================ */

// ------------------------
// Utility: RAF manager
// ------------------------
class RafManager {
  constructor() {
    this.rafId = null;
    this.callbacks = new Map();
    this.lastTime = 0;
    this.running = false;
    this._tick = this._tick.bind(this);
    this._onVisibility = this._onVisibility.bind(this);
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this._onVisibility);
    }
  }

  _onVisibility() {
    if (document.hidden) {
      this.pause();
    } else {
      this.resume();
    }
  }

  _tick(t) {
    if (!this.running) return;
    const dt = Math.min(32, t - this.lastTime) / 1000; // clamp to 32ms
    this.lastTime = t;
    this.callbacks.forEach((cb) => {
      try { cb(dt, t); } catch (e) { /* noop */ }
    });
    this.rafId = requestAnimationFrame(this._tick);
  }

  subscribe(key, cb) {
    this.callbacks.set(key, cb);
    if (!this.running && this.callbacks.size > 0) {
      this.resume();
    }
  }

  unsubscribe(key) {
    this.callbacks.delete(key);
    if (this.callbacks.size === 0 && this.running) {
      this.pause();
    }
  }

  resume() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this._tick);
  }

  pause() {
    this.running = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  destroy() {
    this.pause();
    this.callbacks.clear();
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this._onVisibility);
    }
  }
}

const globalRaf = typeof window !== 'undefined' ? new RafManager() : null;

// ------------------------
// Ambient Snow (background)
// Physics: gravity + horizontal wind + terminal velocity drag
// ------------------------
function initAmbientSnow() {
  if (typeof document === 'undefined') return null;
  const container = document.getElementById('ambientSnow');
  if (!container) return null;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return null;

  const flakes = [];
  const FLAKE_COUNT = 80;

  for (let i = 0; i < FLAKE_COUNT; i++) {
    const size = Math.random() * 3 + 1;
    const el = document.createElement('div');
    el.className = 'snowflake';
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.opacity = `${0.3 + Math.random() * 0.5}`;
    container.appendChild(el);
    flakes.push({
      el,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size,
      vy: 15 + Math.random() * 25, // px/s gravity
      vx: -8 + Math.random() * 16, // wind drift
      phase: Math.random() * Math.PI * 2,
      swayAmp: 8 + Math.random() * 16,
      swayFreq: 0.3 + Math.random() * 0.6,
    });
  }

  const key = 'ambient-snow';
  globalRaf.subscribe(key, (dt, t) => {
    for (const f of flakes) {
      f.phase += f.swayFreq * dt;
      f.x += f.vx * dt + Math.sin(f.phase) * f.swayAmp * dt;
      f.y += f.vy * dt;

      if (f.y > window.innerHeight + 10) {
        f.y = -10;
        f.x = Math.random() * window.innerWidth;
      }
      if (f.x > window.innerWidth + 10) f.x = -10;
      if (f.x < -10) f.x = window.innerWidth + 10;

      f.el.style.transform = `translate(${f.x}px, ${f.y}px)`;
    }
  });

  return () => {
    globalRaf.unsubscribe(key);
    flakes.forEach(f => f.el.remove());
  };
}

// ------------------------
// Custom Cursor
// Magnetic attraction on hover, three states (idle/hover/press)
// ------------------------
function initCustomCursor() {
  if (typeof document === 'undefined') return null;
  const ring = document.getElementById('cursorRing');
  const dot = document.getElementById('cursorDot');
  const container = document.getElementById('cursorContainer');
  if (!ring || !dot || !container) return null;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || window.innerWidth < 600) return null;

  // Physics: damped follow for ring, direct for dot
  const state = {
    targetX: window.innerWidth / 2,
    targetY: window.innerHeight / 2,
    ringX: window.innerWidth / 2,
    ringY: window.innerHeight / 2,
    dotX: window.innerWidth / 2,
    dotY: window.innerHeight / 2,
    isHover: false,
    isPress: false,
  };

  const DAMPING = 8; // ring follow smoothness (higher = tighter)

  const key = 'custom-cursor';
  globalRaf.subscribe(key, (dt) => {
    // Damped follow (ring lags behind dot)
    state.ringX += (state.targetX - state.ringX) * Math.min(1, DAMPING * dt);
    state.ringY += (state.targetY - state.ringY) * Math.min(1, DAMPING * dt);
    state.dotX = state.targetX;
    state.dotY = state.targetY;

    ring.style.transform = `translate(${state.ringX}px, ${state.ringY}px) translate(-50%, -50%)`;
    dot.style.transform = `translate(${state.dotX}px, ${state.dotY}px) translate(-50%, -50%)`;
  });

  const onMove = (e) => {
    state.targetX = e.clientX;
    state.targetY = e.clientY;
  };

  const onOver = (e) => {
    const target = e.target.closest('button, a, .interactive, [role="button"], .card-hover, .nav-item, .chip, .tab');
    if (target) {
      state.isHover = true;
      ring.classList.add('hover');
      dot.classList.add('hover');
    }
  };

  const onOut = (e) => {
    const target = e.target.closest('button, a, .interactive, [role="button"], .card-hover, .nav-item, .chip, .tab');
    if (target) {
      state.isHover = false;
      ring.classList.remove('hover');
      dot.classList.remove('hover');
    }
  };

  const onDown = (e) => {
    state.isPress = true;
    ring.classList.add('press');
    // Create ripple
    const ripple = document.createElement('div');
    ripple.className = 'cursor-ripple';
    ripple.style.left = `${state.targetX}px`;
    ripple.style.top = `${state.targetY}px`;
    container.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  };

  const onUp = () => {
    state.isPress = false;
    ring.classList.remove('press');
  };

  window.addEventListener('mousemove', onMove, { passive: true });
  window.addEventListener('mouseover', onOver);
  window.addEventListener('mouseout', onOut);
  window.addEventListener('mousedown', onDown);
  window.addEventListener('mouseup', onUp);

  return () => {
    globalRaf.unsubscribe(key);
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseover', onOver);
    window.removeEventListener('mouseout', onOut);
    window.removeEventListener('mousedown', onDown);
    window.removeEventListener('mouseup', onUp);
  };
}

// ------------------------
// Spring counter hook (damped numeric counter)
// ------------------------
function useSpringCounter(target, duration = 1500) {
  const [value, setValue] = React.useState(0);
  const rafRef = React.useRef(null);

  React.useEffect(() => {
    let start = null;
    const startValue = value;
    const diff = target - startValue;

    const step = (t) => {
      if (start === null) start = t;
      const elapsed = t - start;
      const progress = Math.min(1, elapsed / duration);
      // damped easeOut with slight overshoot
      const p = progress;
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p) * Math.cos(p * 6);
      setValue(Math.round(startValue + diff * eased * 100) / 100);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return value;
}

// ------------------------
// SnowParticleLayer (inside-app ambient snow)
// ------------------------
function SnowParticleLayer({ count = 30, speed = 1, color = 'rgba(240,244,246,0.5)' }) {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };
    resize();

    const flakes = [];
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    for (let i = 0; i < count; i++) {
      flakes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.8 + 0.4,
        vy: (15 + Math.random() * 25) * speed,
        vx: (-5 + Math.random() * 10) * speed,
        phase: Math.random() * Math.PI * 2,
        sway: 0.4 + Math.random() * 0.8,
      });
    }

    let rafKey = 'snow-' + Math.random().toString(36).slice(2);

    if (reduced) {
      // static render
      ctx.fillStyle = color;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      flakes.forEach(f => {
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      });
      return;
    }

    globalRaf.subscribe(rafKey, (dt) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      const dpr = window.devicePixelRatio;
      ctx.save();
      ctx.scale(dpr, dpr);
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      for (const f of flakes) {
        f.phase += f.sway * dt;
        f.x += f.vx * dt + Math.sin(f.phase) * 6 * dt;
        f.y += f.vy * dt;

        if (f.y > h + 5) { f.y = -5; f.x = Math.random() * w; }
        if (f.x > w + 5) f.x = -5;
        if (f.x < -5) f.x = w + 5;

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    const onResize = () => {
      resize();
      // reposition all
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      flakes.forEach(f => {
        if (f.x > w) f.x = Math.random() * w;
        if (f.y > h) f.y = Math.random() * h;
      });
    };
    window.addEventListener('resize', onResize);

    return () => {
      globalRaf.unsubscribe(rafKey);
      window.removeEventListener('resize', onResize);
    };
  }, [count, speed, color]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}

// ------------------------
// BubbleLayer — ice-layer buoyancy bubbles
// Physics: buoyancy force (F = ρgV), drag proportional to velocity
// ------------------------
function BubbleLayer({ count = 12, color = 'rgba(240,244,246,0.35)' }) {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };
    resize();

    const bubbles = [];
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;

    // Buoyancy model: F_buoy = ρgV, F_drag = -k*v
    // Terminal velocity v_terminal = F_buoy / k
    const BUOYANCY_BASE = 40; // px/s² upward
    const DRAG = 0.8; // drag coefficient (per second)

    for (let i = 0; i < count; i++) {
      const radius = 1.5 + Math.random() * 4;
      const area = Math.PI * radius * radius;
      // buoyancy proportional to area (simulated)
      const buoyancy = BUOYANCY_BASE * (radius / 3);
      bubbles.push({
        x: Math.random() * W,
        y: H + Math.random() * H,
        r: radius,
        vy: -buoyancy / DRAG * (0.3 + Math.random() * 0.5), // start below terminal
        vx: 0,
        buoyancy,
        drag: DRAG + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
        sway: 5 + Math.random() * 12,
        swayFreq: 0.2 + Math.random() * 0.4,
      });
    }

    let rafKey = 'bubble-' + Math.random().toString(36).slice(2);

    if (reduced) {
      ctx.fillStyle = color;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      bubbles.forEach(b => {
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(b.x, b.y % H, b.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      return;
    }

    globalRaf.subscribe(rafKey, (dt) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const dpr = window.devicePixelRatio;
      ctx.save();
      ctx.scale(dpr, dpr);
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      for (const b of bubbles) {
        // Apply buoyancy (upward force = negative y)
        const ay = -b.buoyancy;
        // Drag opposes velocity
        const dragY = -b.drag * b.vy;
        b.vy += (ay + dragY) * dt;

        // Horizontal sway
        b.phase += b.swayFreq * dt;
        b.vx = Math.sin(b.phase) * b.sway * 0.5;

        b.x += b.vx * dt;
        b.y += b.vy * dt;

        // Wrap around
        if (b.y < -10) {
          b.y = h + 10;
          b.x = Math.random() * w;
          b.vy = -b.buoyancy / b.drag * 0.2;
        }
        if (b.x < -5) b.x = w + 5;
        if (b.x > w + 5) b.x = -5;

        // Draw bubble with highlight
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();

        // small highlight dot
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.beginPath();
        ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.25, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    return () => {
      globalRaf.unsubscribe(rafKey);
    };
  }, [count, color]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}

// ------------------------
// DrillProgress — damped drilling progress bar
// Physics: inertial mass + damper + thrust force
// ------------------------
function DrillProgress({ progress, height = 8, color = '#FF7A1A' }) {
  const fillRef = React.useRef(null);

  React.useEffect(() => {
    const el = fillRef.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let currentWidth = 0;
    let velocity = 0;
    const target = progress;
    const MASS = 1.2;
    const DAMPING = 6;
    const STIFFNESS = 30; // spring pull toward target

    let rafKey = 'drill-' + Math.random().toString(36).slice(2);

    if (reduced) {
      el.style.width = `${target}%`;
      return;
    }

    globalRaf.subscribe(rafKey, (dt) => {
      // Spring-damper system: a = (stiffness * (target - pos) - damping * velocity) / mass
      const displacement = target - currentWidth;
      const acceleration = (STIFFNESS * displacement - DAMPING * velocity) / MASS;
      velocity += acceleration * dt;
      currentWidth += velocity * dt;

      // Clamp
      if (currentWidth < 0) { currentWidth = 0; velocity = 0; }
      if (currentWidth > 100) { currentWidth = 100; velocity = 0; }

      el.style.width = `${currentWidth}%`;
    });

    return () => {
      globalRaf.unsubscribe(rafKey);
    };
  }, [progress]);

  return (
    <div style={{
      width: '100%',
      height,
      background: 'rgba(207, 218, 221, 0.3)',
      borderRadius: height / 2,
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div
        ref={fillRef}
        style={{
          height: '100%',
          width: '0%',
          background: `linear-gradient(90deg, ${color}, ${color}dd)`,
          borderRadius: height / 2,
          boxShadow: `0 0 8px ${color}66`,
          position: 'relative',
        }}
      >
        <div style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: '20px',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
          animation: 'sheenSweep 2.5s ease-in-out infinite',
        }} />
      </div>
    </div>
  );
}

// ------------------------
// ScanLine — ice core layer scan line animation
// ------------------------
function ScanLine({ active = true, direction = 'vertical', color = '#FF7A1A' }) {
  const lineRef = React.useRef(null);

  React.useEffect(() => {
    const el = lineRef.current;
    if (!el || !active) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let pos = 0;
    const speed = 35; // percent per second
    let rafKey = 'scanline-' + Math.random().toString(36).slice(2);

    globalRaf.subscribe(rafKey, (dt) => {
      pos += speed * dt;
      if (pos > 100) pos = 0;

      if (direction === 'vertical') {
        el.style.transform = `translateY(${pos}%)`;
      } else {
        el.style.transform = `translateX(${pos}%)`;
      }
    });

    return () => {
      globalRaf.unsubscribe(rafKey);
    };
  }, [active, direction, color]);

  const isVert = direction === 'vertical';

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: isVert ? '100%' : '2px',
      height: isVert ? '2px' : '100%',
      background: `linear-gradient(${isVert ? '90deg' : '180deg'}, transparent, ${color}, transparent)`,
      boxShadow: `0 0 12px ${color}, 0 0 24px ${color}80`,
      pointerEvents: 'none',
      zIndex: 3,
    }} ref={lineRef} />
  );
}

// ------------------------
// Typewriter text
// ------------------------
function TypewriterText({ text, speed = 40, delay = 0, onComplete }) {
  const [displayed, setDisplayed] = React.useState('');
  const timeoutRef = React.useRef(null);

  React.useEffect(() => {
    setDisplayed('');
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    let i = 0;
    const startDelay = delay;

    const type = () => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
        timeoutRef.current = setTimeout(type, speed + Math.random() * 30);
      } else if (onComplete) {
        onComplete();
      }
    };

    timeoutRef.current = setTimeout(type, startDelay);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, speed, delay]);

  return (
    <span style={{ fontFamily: 'var(--font-mono)' }}>
      {displayed}
      <span style={{
        display: 'inline-block',
        width: '8px',
        height: '14px',
        background: 'var(--signal-orange)',
        marginLeft: '2px',
        verticalAlign: 'baseline',
        animation: 'blink 0.9s step-end infinite',
      }} />
    </span>
  );
}

// ------------------------
// GlowCard — hover lift + glow sweep
// ------------------------
function GlowCard({ children, style, className = '', onClick, activeGlow = false, delay = 0 }) {
  const cardRef = React.useRef(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const t = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const onMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - y) * 6;
    const rotateY = (x - 0.5) * 6;
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    el.style.setProperty('--mx', `${x * 100}%`);
    el.style.setProperty('--my', `${y * 100}%`);
  };

  const onLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
  };

  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div
      ref={cardRef}
      className={`card-hover interactive ${className}`}
      onClick={onClick}
      onMouseMove={!reduced ? onMove : undefined}
      onMouseLeave={!reduced ? onLeave : undefined}
      style={{
        position: 'relative',
        background: 'var(--ice-white)',
        borderRadius: 'var(--radius-lg)',
        padding: '18px',
        boxShadow: activeGlow
          ? '0 8px 32px rgba(255, 122, 26, 0.2), 0 2px 8px rgba(22,35,43,0.06)'
          : 'var(--shadow-soft)',
        transition: 'box-shadow 0.3s ease, opacity 0.6s ease, transform 0.2s ease',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
        transformStyle: 'preserve-3d',
        cursor: onClick ? 'pointer' : 'default',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Gloss sweep overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(400px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.4), transparent 40%)',
        pointerEvents: 'none',
        opacity: activeGlow ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }} />
      {children}
    </div>
  );
}

// ------------------------
// PulseDot — pulsing status dot
// ------------------------
function PulseDot({ color = '#FF7A1A', size = 8, active = true }) {
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div style={{
      position: 'relative',
      width: size,
      height: size,
      display: 'inline-block',
    }}>
      <div style={{
        width: size,
        height: size,
        background: color,
        borderRadius: '50%',
        boxShadow: `0 0 8px ${color}`,
      }} />
      {active && !reduced && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: size,
          height: size,
          background: color,
          borderRadius: '50%',
          opacity: 0.5,
          animation: 'pulseDot 2s ease-out infinite',
        }} />
      )}
    </div>
  );
}

// ------------------------
// CountUp — animated number
// ------------------------
function CountUp({ value, duration = 1200, decimals = 0, prefix = '', suffix = '' }) {
  const [display, setDisplay] = React.useState(0);
  const ref = React.useRef({ start: 0, current: 0, target: value, startTime: null, raf: null });

  React.useEffect(() => {
    const state = ref.current;
    state.start = state.current;
    state.target = value;
    state.startTime = null;

    if (state.raf) cancelAnimationFrame(state.raf);

    const step = (t) => {
      if (state.startTime === null) state.startTime = t;
      const elapsed = t - state.startTime;
      const progress = Math.min(1, elapsed / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      state.current = state.start + (state.target - state.start) * eased;
      setDisplay(state.current);
      if (progress < 1) {
        state.raf = requestAnimationFrame(step);
      }
    };

    state.raf = requestAnimationFrame(step);
    return () => {
      if (state.raf) cancelAnimationFrame(state.raf);
    };
  }, [value, duration]);

  const formatted = decimals > 0
    ? display.toFixed(decimals)
    : Math.round(display).toLocaleString();

  return <span>{prefix}{formatted}{suffix}</span>;
}

// ------------------------
// RevealOnEnter — fade/slide in when in view
// ------------------------
function RevealOnEnter({ children, delay = 0, direction = 'up' }) {
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => setShown(true), delay);
          obs.disconnect();
        }
      });
    }, { threshold: 0.1 });

    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  const initialTransform = direction === 'up' ? 'translateY(16px)' :
    direction === 'left' ? 'translateX(-16px)' : 'translateX(16px)';

  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translate(0)' : initialTransform,
        transition: 'opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out)',
      }}
    >
      {children}
    </div>
  );
}

// ------------------------
// SpectrumBars — audio-style spectrum animation
// ------------------------
function SpectrumBars({ count = 8, color = '#FF7A1A', height = 24 }) {
  const barsRef = React.useRef([]);

  React.useEffect(() => {
    const bars = barsRef.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const phases = Array.from({ length: count }, (_, i) => Math.random() * Math.PI * 2);
    const freqs = Array.from({ length: count }, (_, i) => 1.5 + Math.random() * 3);
    const amps = Array.from({ length: count }, (_, i) => 0.4 + Math.random() * 0.6);

    let rafKey = 'spectrum-' + Math.random().toString(36).slice(2);

    globalRaf.subscribe(rafKey, (dt) => {
      for (let i = 0; i < count; i++) {
        phases[i] += freqs[i] * dt;
        const v = 0.2 + (Math.sin(phases[i]) * 0.5 + 0.5) * amps[i] * 0.8;
        const h = v * height;
        if (bars[i]) {
          bars[i].style.height = `${h}px`;
        }
      }
    });

    return () => {
      globalRaf.unsubscribe(rafKey);
    };
  }, [count, color, height]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-end',
      gap: '3px',
      height,
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          ref={el => barsRef.current[i] = el}
          style={{
            width: '3px',
            height: '4px',
            background: color,
            borderRadius: '2px',
            boxShadow: `0 0 4px ${color}80`,
            transition: 'none',
          }}
        />
      ))}
    </div>
  );
}

// ------------------------
// ScrollProgressBar — top page progress
// ------------------------
function ScrollProgressBar({ scrollTop, scrollHeight, color = '#FF7A1A' }) {
  const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      height: '2px',
      width: `${pct}%`,
      background: color,
      boxShadow: `0 0 6px ${color}`,
      zIndex: 10,
      transition: 'width 0.1s linear',
    }} />
  );
}

// ------------------------
// ParallaxLayer — subtle parallax on mouse move
// ------------------------
function ParallaxLayer({ children, strength = 0.05, style }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [strength]);

  return (
    <div ref={ref} style={{ willChange: 'transform', transition: 'transform 0.1s linear', ...style }}>
      {children}
    </div>
  );
}

// ------------------------
// Icon components (inline SVG)
// ------------------------
const Icon = {
  Thermometer: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4a2 2 0 0 0-4 0v10.54a4 4 0 1 0 4 0V4z"/>
    </svg>
  ),
  Wind: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/>
      <path d="M9.6 4.6A2 2 0 1 1 11 8H2"/>
      <path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>
    </svg>
  ),
  Snowflake: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="22"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="m20 16-4-4 4-4"/>
      <path d="m4 8 4 4-4 4"/>
      <path d="m16 4-4 4-4-4"/>
      <path d="m8 20 4-4 4 4"/>
    </svg>
  ),
  Layers: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/>
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/>
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>
    </svg>
  ),
  Drill: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 9h5l2 4-2 4h-5"/>
      <path d="M14 13H4"/>
      <path d="M8 9v8"/>
      <path d="M3 21l5-5"/>
    </svg>
  ),
  Archive: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="5" x="2" y="3" rx="1"/>
      <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/>
      <path d="M10 12h4"/>
    </svg>
  ),
  User: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Compass: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
    </svg>
  ),
  Search: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.3-4.3"/>
    </svg>
  ),
  Chevron: ({ size = 20, color = 'currentColor', dir = 'right' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{
      transform: dir === 'down' ? 'rotate(90deg)' : dir === 'left' ? 'rotate(180deg)' : dir === 'up' ? 'rotate(-90deg)' : 'none',
    }}>
      <path d="m9 18 6-6-6-6"/>
    </svg>
  ),
  Gear: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
    </svg>
  ),
  Doc: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="8" y1="13" x2="16" y2="13"/>
      <line x1="8" y1="17" x2="13" y2="17"/>
    </svg>
  ),
  Code: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  Bell: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
    </svg>
  ),
};

// Expose to window for cross-file usage
Object.assign(window, {
  SnowParticleLayer,
  BubbleLayer,
  DrillProgress,
  ScanLine,
  TypewriterText,
  GlowCard,
  PulseDot,
  CountUp,
  RevealOnEnter,
  SpectrumBars,
  ScrollProgressBar,
  ParallaxLayer,
  Icon,
  globalRaf,
  initAmbientSnow,
  initCustomCursor,
});
