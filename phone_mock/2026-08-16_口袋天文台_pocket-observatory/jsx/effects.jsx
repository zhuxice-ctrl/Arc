/* =====================================================================
   口袋天文台 · 动效组件库 (effects.jsx)
   12+ 组件级特效：自定义光标、粒子、频谱、3D倾斜、滚动渐入、
   悬停发光、打字机、数字计数、涟漪、视差、光泽扫过、头像脉冲、
   星轨签名、潮汐波形、磁吸按钮
   ===================================================================== */

const { useState, useEffect, useRef, useCallback } = React;

/* ============================================================
   1. 自定义光标 Custom Cursor
   - 白色粗环 + 彗星橙内点 + 多层发光
   - z-index: 9999
   - 悬停可交互元素放大 + 变色 + 三态切换
   - 点击涟漪
   - visibilitychange 暂停
   ============================================================ */
function CustomCursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const rafRef = useRef(null);
  const hoverRef = useRef(false);
  const clickRef = useRef(0);
  const targetRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const currentRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  const initPos = useCallback(() => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    targetRef.current = { x: cx, y: cy };
    currentRef.current = { x: cx, y: cy };
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${cx}px, ${cy}px)`;
    }
  }, []);

  useEffect(() => {
    initPos();

    // 弹簧阻尼系数
    const SPRING = 0.18;
    const DAMPING = 0.82;
    const vel = { x: 0, y: 0 };

    const onMove = (e) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;

      // 悬停检测
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const isInteractive = el && el.closest('.interactive');
      if (isInteractive !== hoverRef.current) {
        hoverRef.current = isInteractive;
        if (ringRef.current) ringRef.current.classList.toggle('hover', isInteractive);
        if (dotRef.current) dotRef.current.classList.toggle('hover', isInteractive);
      }
    };

    const onDown = (e) => {
      if (!cursorRef.current) return;
      clickRef.current++;
      const ripple = document.createElement('div');
      ripple.className = 'cursor-ripple';
      ripple.style.animationDelay = '0s';
      cursorRef.current.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    };

    const tick = () => {
      const dx = targetRef.current.x - currentRef.current.x;
      const dy = targetRef.current.y - currentRef.current.y;
      vel.x = (vel.x + dx * SPRING) * DAMPING;
      vel.y = (vel.y + dy * SPRING) * DAMPING;
      currentRef.current.x += vel.x;
      currentRef.current.y += vel.y;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${currentRef.current.x}px, ${currentRef.current.y}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    const onVisible = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
    };
    const onHidden = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const onVis = () => {
      if (document.hidden) onHidden();
      else onVisible();
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    document.addEventListener('visibilitychange', onVis);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      document.removeEventListener('visibilitychange', onVis);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [initPos]);

  return (
    <div className="custom-cursor" ref={cursorRef}>
      <div className="cursor-ring" ref={ringRef}></div>
      <div className="cursor-dot" ref={dotRef}></div>
    </div>
  );
}

/* ============================================================
   2. 星空粒子 Starfield Particles
   - 视差多层
   - 缓慢漂移（惯性）
   - 闪烁（正弦叠加）
   ============================================================ */
function Starfield({ count = 80, speed = 0.3 }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const starsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // 三层星：近/中/远
    const layers = [
      { count: Math.floor(count * 0.2), size: [1.2, 2], speed: speed * 1.8, opacity: 0.9, color: '#F2EFE6' },
      { count: Math.floor(count * 0.4), size: [0.8, 1.4], speed: speed * 1, opacity: 0.6, color: '#C8C5B8' },
      { count: Math.floor(count * 0.4), size: [0.5, 1], speed: speed * 0.4, opacity: 0.35, color: '#8A8779' },
    ];

    const stars = [];
    layers.forEach((layer) => {
      for (let i = 0; i < layer.count; i++) {
        stars.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          size: layer.size[0] + Math.random() * (layer.size[1] - layer.size[0]),
          speed: layer.speed * (0.6 + Math.random() * 0.8),
          opacity: layer.opacity * (0.5 + Math.random() * 0.5),
          color: layer.color,
          twinkle: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.008 + Math.random() * 0.02,
          drift: (Math.random() - 0.5) * 0.15,
        });
      }
    });
    starsRef.current = stars;

    let t = 0;
    const tick = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      t++;
      stars.forEach((s) => {
        s.x += s.drift;
        s.y -= s.speed * 0.1;
        s.twinkle += s.twinkleSpeed;
        if (s.y < -2) {
          s.y = rect.height + 2;
          s.x = Math.random() * rect.width;
        }
        if (s.x < -2) s.x = rect.width + 2;
        if (s.x > rect.width + 2) s.x = -2;

        const flicker = 0.6 + Math.sin(s.twinkle) * 0.4;
        ctx.globalAlpha = s.opacity * flicker;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();

        // 近层加光晕
        if (s.size > 1.2) {
          ctx.globalAlpha = s.opacity * flicker * 0.3;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(tick);
    };

    const onVis = () => {
      if (document.hidden) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      } else {
        if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
      }
    };
    document.addEventListener('visibilitychange', onVis);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('visibilitychange', onVis);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [count, speed]);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
}

/* ============================================================
   3. 数字计数 CountUp
   - 弹簧式缓动
   ============================================================ */
function CountUp({ value, duration = 1500, decimals = 0, prefix = '', suffix = '', className = '' }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const startValueRef = useRef(0);

  useEffect(() => {
    const start = startValueRef.current;
    const end = value;
    startValueRef.current = end;
    startTimeRef.current = null;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    // easeOutQuart
    const ease = (t) => 1 - Math.pow(1 - t, 4);

    const step = (ts) => {
      if (!startTimeRef.current) startTimeRef.current = ts;
      const elapsed = ts - startTimeRef.current;
      const p = Math.min(elapsed / duration, 1);
      const v = start + (end - start) * ease(p);
      setDisplay(v);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(step);

    const onVis = () => {
      if (document.hidden) {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      } else {
        if (!startTimeRef.current || display !== value) {
          rafRef.current = requestAnimationFrame(step);
        }
      }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      document.removeEventListener('visibilitychange', onVis);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [value, duration]);

  return (
    <span className={className}>
      {prefix}{display.toFixed(decimals)}{suffix}
    </span>
  );
}

/* ============================================================
   4. 打字机 Typewriter
   - 变速度（模拟人类节奏）
   ============================================================ */
function Typewriter({ text, speed = 60, delay = 0, className = '', onDone }) {
  const [shown, setShown] = useState('');
  const timeoutRef = useRef(null);
  const idxRef = useRef(0);
  const doneRef = useRef(false);

  useEffect(() => {
    idxRef.current = 0;
    setShown('');
    doneRef.current = false;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const type = () => {
      if (idxRef.current < text.length) {
        idxRef.current++;
        setShown(text.slice(0, idxRef.current));
        // 变速：标点后停顿
        const ch = text[idxRef.current - 1];
        let wait = speed * (0.6 + Math.random() * 0.8);
        if (ch === '.' || ch === '。' || ch === '!' || ch === '?') wait = speed * 2.5;
        else if (ch === ',' || ch === '，') wait = speed * 1.4;
        timeoutRef.current = setTimeout(type, wait);
      } else {
        doneRef.current = true;
        if (onDone) onDone();
      }
    };

    timeoutRef.current = setTimeout(type, delay);

    const onVis = () => {
      if (document.hidden) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      } else {
        if (!doneRef.current && !timeoutRef.current) {
          timeoutRef.current = setTimeout(type, speed);
        }
      }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      document.removeEventListener('visibilitychange', onVis);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [text, speed, delay, onDone]);

  return (
    <span className={className}>
      {shown}
      <span style={{ display: 'inline-block', width: '2px', height: '1em', background: 'var(--comet)', verticalAlign: 'text-bottom', marginLeft: '2px', animation: 'blink 1s steps(2) infinite' }}></span>
    </span>
  );
}

/* ============================================================
   5. 3D 倾斜卡片 TiltCard
   - 磁性反平方引力（鼠标越近偏转越大）
   - 直接操作 DOM transform，不触发 setState
   ============================================================ */
function TiltCard({ children, maxTilt = 12, style = {}, className = '' }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      // 磁性反平方：距离越近力越大
      const force = 1 / (1 + dist * 1.2);
      const tiltX = -dy * maxTilt * force;
      const tiltY = dx * maxTilt * force;
      el.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(0)`;

      // 内部光泽跟随
      const gloss = el.querySelector('.tilt-gloss');
      if (gloss) {
        const gx = (e.clientX - rect.left) / rect.width * 100;
        const gy = (e.clientY - rect.top) / rect.height * 100;
        gloss.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.12) 0%, transparent 60%)`;
      }
    };

    const onLeave = () => {
      el.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
      const gloss = el.querySelector('.tilt-gloss');
      if (gloss) gloss.style.background = 'transparent';
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [maxTilt]);

  return (
    <div
      ref={cardRef}
      className={`interactive ${className}`}
      style={{
        position: 'relative',
        transition: 'transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1)',
        transformStyle: 'preserve-3d',
        ...style,
      }}
    >
      <div className="tilt-gloss" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 'inherit', zIndex: 10 }}></div>
      {children}
    </div>
  );
}

/* ============================================================
   6. 悬停发光 GlowCard
   ============================================================ */
function GlowCard({ children, color = 'var(--comet-glow)', style = {}, className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`interactive ${className}`}
      style={{
        position: 'relative',
        transition: 'box-shadow 0.4s ease, transform 0.3s ease',
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 4px 24px ${color}, 0 0 60px ${color}`;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {children}
    </div>
  );
}

/* ============================================================
   7. 星轨签名 Signature
   - SVG path 描边动画
   - 天体轨道主题
   ============================================================ */
function StarSignature() {
  const pathsRef = useRef([]);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 500);
    return () => clearTimeout(t);
  }, []);

  const paths = [
    { d: 'M 10,40 Q 30,5 60,30 Q 90,55 70,80 Q 50,95 30,75 Q 10,55 10,40 Z', stroke: '#FF7A1A', duration: 2.5, delay: 0 },
    { d: 'M 20,35 Q 50,20 80,40', stroke: '#E8D59B', duration: 1.8, delay: 0.6 },
    { d: 'M 25,60 Q 55,75 75,55', stroke: '#4CD6A7', duration: 2, delay: 1.2 },
  ];

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <svg viewBox="0 0 90 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
        <defs>
          <filter id="sigGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {paths.map((p, i) => (
          <path
            key={i}
            ref={(el) => (pathsRef.current[i] = el)}
            d={p.d}
            fill="none"
            stroke={p.stroke}
            strokeWidth="1.2"
            strokeLinecap="round"
            filter="url(#sigGlow)"
            style={{
              strokeDasharray: 400,
              strokeDashoffset: drawn ? 0 : 400,
              transition: `stroke-dashoffset ${p.duration}s cubic-bezier(0.65, 0, 0.35, 1)`,
              transitionDelay: `${p.delay}s`,
            }}
          />
        ))}
        {/* 节点星点 */}
        {[{ x: 10, y: 40 }, { x: 60, y: 30 }, { x: 70, y: 80 }, { x: 30, y: 75 }, { x: 80, y: 40 }].map((pt, i) => (
          <circle
            key={`pt-${i}`}
            cx={pt.x}
            cy={pt.y}
            r="1.8"
            fill="#F2EFE6"
            style={{
              opacity: drawn ? 1 : 0,
              transition: 'opacity 0.4s ease',
              transitionDelay: `${2 + i * 0.15}s`,
              filter: 'drop-shadow(0 0 3px rgba(242, 239, 230, 0.8))',
            }}
          />
        ))}
        {/* 最亮星 */}
        <circle cx="60" cy="30" r="3" fill="#FF7A1A" style={{
          opacity: drawn ? 1 : 0,
          transition: 'opacity 0.5s ease',
          transitionDelay: '2.3s',
          filter: 'drop-shadow(0 0 6px #FF7A1A) drop-shadow(0 0 12px rgba(255, 122, 26, 0.5))',
        }} />
      </svg>
    </div>
  );
}

/* ============================================================
   8. 脉冲头像 PulseAvatar
   - 脉冲波
   ============================================================ */
function PulseAvatar({ src, size = 44, active = true, label }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      {active && (
        <>
          <span style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: '1.5px solid var(--comet)', opacity: 0.6,
            animation: 'pulse-ring 2s cubic-bezier(0.2, 0.9, 0.3, 1) infinite',
          }} />
          <span style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: '1.5px solid var(--comet)', opacity: 0.3,
            animation: 'pulse-ring 2s cubic-bezier(0.2, 0.9, 0.3, 1) infinite',
            animationDelay: '0.6s',
          }} />
        </>
      )}
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--midnight-600), var(--midnight-700))',
        border: '1.5px solid var(--midnight-500)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.4, fontWeight: 600, color: 'var(--moonwhite)',
        position: 'relative', zIndex: 1,
      }}>
        {label || '★'}
      </div>
    </div>
  );
}

/* ============================================================
   9. 频谱条 SpectrumBars
   - 模拟天体光谱/信号
   - 正弦 + 随机噪声
   ============================================================ */
function SpectrumBars({ count = 32, height = 60, color = 'var(--comet)' }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    const bars = [];
    for (let i = 0; i < count; i++) {
      bars.push({
        phase: Math.random() * Math.PI * 2,
        freq: 0.015 + Math.random() * 0.03,
        amp: 0.3 + Math.random() * 0.7,
        noise: 0,
        noiseSpeed: 0.05 + Math.random() * 0.1,
      });
    }

    let t = 0;
    const tick = () => {
      t++;
      ctx.clearRect(0, 0, rect.width, rect.height);
      const barW = rect.width / count - 2;

      bars.forEach((b, i) => {
        b.phase += b.freq;
        const base = Math.sin(b.phase) * 0.5 + 0.5;
        b.noise += (Math.random() - 0.5) * b.noiseSpeed;
        b.noise *= 0.9;
        const h = (base * b.amp + Math.abs(b.noise) * 0.4) * rect.height * 0.9;
        const x = i * (rect.width / count) + 1;
        const y = rect.height - h;

        const grad = ctx.createLinearGradient(0, y, 0, rect.height);
        grad.addColorStop(0, color);
        grad.addColorStop(1, 'rgba(255, 122, 26, 0.2)');
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barW, h);
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    const onVis = () => {
      if (document.hidden) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      } else {
        if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
      }
    };
    document.addEventListener('visibilitychange', onVis);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('visibilitychange', onVis);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [count, color]);

  return <canvas ref={canvasRef} style={{ width: '100%', height, display: 'block' }} />;
}

/* ============================================================
   10. 光泽扫过 Shimmer
   ============================================================ */
function Shimmer({ children, style = {} }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', display: 'inline-block', ...style }}>
      {children}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(110deg, transparent 30%, rgba(255, 255, 255, 0.15) 50%, transparent 70%)',
        transform: 'translateX(-100%)',
        animation: 'shimmer-sweep 3s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

/* ============================================================
   11. 潮汐波形 Wave
   - 正弦叠加
   ============================================================ */
function TidalWave({ color = 'rgba(255, 122, 26, 0.15)', height = 40 }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    let t = 0;
    const tick = () => {
      t += 0.02;
      ctx.clearRect(0, 0, rect.width, rect.height);

      // 双层波
      [
        { amp: 8, freq: 0.02, speed: 1, color },
        { amp: 5, freq: 0.035, speed: 1.5, color: 'rgba(76, 214, 167, 0.1)' },
      ].forEach((w) => {
        ctx.beginPath();
        ctx.moveTo(0, rect.height);
        for (let x = 0; x <= rect.width; x += 2) {
          const y = rect.height / 2 + Math.sin(x * w.freq + t * w.speed) * w.amp
            + Math.sin(x * w.freq * 2.3 + t * w.speed * 0.7) * w.amp * 0.3;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(rect.width, rect.height);
        ctx.closePath();
        ctx.fillStyle = w.color;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    const onVis = () => {
      if (document.hidden) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      } else {
        if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
      }
    };
    document.addEventListener('visibilitychange', onVis);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('visibilitychange', onVis);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [color, height]);

  return <canvas ref={canvasRef} style={{ width: '100%', height, display: 'block' }} />;
}

/* ============================================================
   12. 磁吸按钮 MagneticButton
   - 反平方引力
   ============================================================ */
function MagneticButton({ children, style = {}, radius = 80, onClick, className = '' }) {
  const btnRef = useRef(null);

  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        // 反平方：距离越近吸力越强
        const force = Math.pow(1 - dist / radius, 2);
        const tx = dx * force * 0.35;
        const ty = dy * force * 0.35;
        el.style.transform = `translate(${tx}px, ${ty}px)`;
      } else {
        el.style.transform = 'translate(0, 0)';
      }
    };

    const reset = () => {
      el.style.transform = 'translate(0, 0)';
    };

    window.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', reset);

    return () => {
      window.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', reset);
    };
  }, [radius]);

  return (
    <div
      ref={btnRef}
      onClick={onClick}
      className={`interactive ${className}`}
      style={{
        display: 'inline-flex',
        transition: 'transform 0.15s cubic-bezier(0.2, 0.9, 0.3, 1)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ============================================================
   13. 滚动渐入 Reveal
   - 带阻尼
   ============================================================ */
function Reveal({ children, delay = 0, direction = 'up', className = '' }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const transform = {
    up: 'translateY(20px)',
    down: 'translateY(-20px)',
    left: 'translateX(20px)',
    right: 'translateX(-20px)',
  }[direction] || 'translateY(20px)';

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate(0, 0)' : transform,
        transition: `opacity 0.8s cubic-bezier(0.2, 0.9, 0.3, 1) ${delay}ms, transform 0.8s cubic-bezier(0.2, 0.9, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ============================================================
   全局关键帧
   ============================================================ */
const GlobalKeyframes = () => (
  <style>{`
    @keyframes pulse-ring {
      0% { transform: scale(1); opacity: 0.6; }
      70% { transform: scale(1.6); opacity: 0; }
      100% { transform: scale(1); opacity: 0; }
    }
    @keyframes shimmer-sweep {
      0% { transform: translateX(-100%); }
      60% { transform: translateX(100%); }
      100% { transform: translateX(100%); }
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    @keyframes float-y {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }
    @keyframes rotate-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes spin-reverse {
      from { transform: rotate(360deg); }
      to { transform: rotate(0deg); }
    }
  `}</style>
);

Object.assign(window, {
  CustomCursor,
  Starfield,
  CountUp,
  Typewriter,
  TiltCard,
  GlowCard,
  StarSignature,
  PulseAvatar,
  SpectrumBars,
  Shimmer,
  TidalWave,
  MagneticButton,
  Reveal,
  GlobalKeyframes,
});
