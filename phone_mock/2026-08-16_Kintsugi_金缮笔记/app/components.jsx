// 公共组件 — 金缮笔记 App
// 顶部导航、底部 Tab、卡片、Chip、按钮、输入等

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ─────────────────────────────────────────────────────────────
// 通用工具
// ─────────────────────────────────────────────────────────────
function useReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = e => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

// ─────────────────────────────────────────────────────────────
// 顶部导航栏
// ─────────────────────────────────────────────────────────────
function KinTopBar({ title, subtitle, onBack, rightSlot }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 10,
      padding: '12px 16px 8px',
      background: 'linear-gradient(180deg, rgba(14,14,16,0.98) 0%, rgba(14,14,16,0.85) 70%, rgba(14,14,16,0) 100%)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
        {onBack && (
          <button
            onClick={onBack}
            data-cursor="hover"
            style={{
              width: 36, height: 36, borderRadius: '50%',
              border: '1px solid rgba(212,160,23,0.2)',
              background: 'rgba(212,160,23,0.06)',
              color: 'var(--kin-gold)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: "'Shippori Mincho', serif",
            fontSize: 17, fontWeight: 700,
            color: 'var(--kin-gofun)',
            letterSpacing: '0.08em',
            lineHeight: 1.2,
          }}>{title}</div>
          {subtitle && (
            <div style={{
              fontSize: 11, color: 'var(--kin-sabi)',
              letterSpacing: '0.15em', marginTop: 2,
            }}>{subtitle}</div>
          )}
        </div>
      </div>
      {rightSlot}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 底部 Tab 导航
// ─────────────────────────────────────────────────────────────
function KinBottomNav({ current, onChange, tabs }) {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      height: 64,
      background: 'rgba(14,14,16,0.92)',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid rgba(212,160,23,0.12)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '6px 0 12px',
      zIndex: 20,
    }}>
      {tabs.map(tab => {
        const active = current === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            data-cursor="hover"
            className="kin-nav-item"
            style={{
              flex: 1, background: 'none', border: 'none', padding: '6px 4px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              color: active ? 'var(--kin-gold)' : 'var(--kin-sabi)',
              cursor: 'pointer',
              position: 'relative',
              transition: 'color 250ms ease',
            }}
          >
            <div style={{
              width: 24, height: 24, position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {tab.icon}
              {active && (
                <div style={{
                  position: 'absolute', bottom: -2,
                  width: 4, height: 4, borderRadius: '50%',
                  background: 'var(--kin-gold)',
                  boxShadow: '0 0 8px var(--kin-gold)',
                }} />
              )}
            </div>
            <span style={{
              fontSize: 10, letterSpacing: '0.1em',
              fontWeight: active ? 500 : 400,
            }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 器物卡片（首页卡片流）
// ─────────────────────────────────────────────────────────────
function RelicCard({ relic, onClick, index = 0 }) {
  const cardRef = useRef(null);
  const tiltRef = useRef({ x: 0, y: 0, tx: 0, ty: 0, rafId: 0 });
  const reduced = useReducedMotion();

  // 3D 倾斜效果（纯 DOM 操作，不 setState）
  useEffect(() => {
    if (reduced) return;
    const card = cardRef.current;
    if (!card) return;
    const t = tiltRef.current;

    function onMove(e) {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      t.tx = -py * 6; // rotateX（上下倾斜）
      t.ty = px * 8;  // rotateY（左右倾斜）
    }
    function onLeave() {
      t.tx = 0; t.ty = 0;
    }

    function step() {
      // 弹簧式缓动
      t.x += (t.tx - t.x) * 0.15;
      t.y += (t.ty - t.y) * 0.15;
      card.style.transform = `perspective(600px) rotateX(${t.x}deg) rotateY(${t.y}deg)`;
      t.rafId = requestAnimationFrame(step);
    }
    t.rafId = requestAnimationFrame(step);

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(t.rafId);
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, [reduced]);

  // 金粉光泽扫过（独立节奏）
  useEffect(() => {
    if (reduced) return;
    const card = cardRef.current;
    if (!card) return;
    const sheen = card.querySelector('.card-sheen');
    if (!sheen) return;

    let rafId, startTime;
    const offset = index * 0.7; // 错峰
    function step(now) {
      if (!startTime) startTime = now + offset * 1000;
      const t = ((now - startTime) / 1000) % 6; // 6 秒一个周期
      // 正弦曲线，大部分时间看不见，偶尔扫过
      const phase = (t / 6) * Math.PI * 2;
      const shine = Math.max(0, Math.sin(phase)) * 0.15;
      sheen.style.opacity = shine;
      sheen.style.transform = `translateX(${Math.sin(phase) * 40}px)`;
      rafId = requestAnimationFrame(step);
    }
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [reduced, index]);

  const stageLabel = {
    early: '初期修复',
    middle: '中期金継',
    final: '仕上げ',
    done: '完 成',
  }[relic.stage];

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      data-cursor="hover"
      className="kin-card"
      style={{
        position: 'relative',
        background: 'linear-gradient(160deg, rgba(24,23,26,0.9) 0%, rgba(14,14,16,0.95) 100%)',
        border: '1px solid rgba(212,160,23,0.15)',
        borderRadius: 16,
        padding: 16,
        cursor: 'pointer',
        transformStyle: 'preserve-3d',
        transition: 'border-color 250ms ease, box-shadow 250ms ease',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(212,160,23,0.45)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.5), 0 0 24px rgba(212,160,23,0.15), inset 0 1px 0 rgba(255,255,255,0.06)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(212,160,23,0.15)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)';
      }}
    >
      {/* 光泽层 */}
      <div className="card-sheen" style={{
        position: 'absolute', top: 0, left: -40, right: -40, bottom: 0,
        background: 'linear-gradient(115deg, transparent 20%, rgba(212,160,23,0.25) 50%, transparent 80%)',
        pointerEvents: 'none',
        opacity: 0,
      }} />
      {/* 卡片头部 */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 12 }}>
        <RelicThumb relic={relic} size={56} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "'Noto Serif JP', serif",
            fontSize: 16, fontWeight: 700,
            color: 'var(--kin-gofun)',
            letterSpacing: '0.05em',
          }}>{relic.name}</div>
          <div style={{
            fontSize: 10, color: 'var(--kin-sabi)',
            letterSpacing: '0.1em', marginTop: 2,
          }}>{relic.furigana}</div>
          <div style={{
            fontSize: 10, color: 'rgba(212,160,23,0.7)',
            letterSpacing: '0.08em', marginTop: 4,
          }}>{relic.origin}</div>
        </div>
        <div style={{
          fontSize: 18, fontWeight: 700,
          fontFamily: "'Shippori Mincho', serif",
          color: 'var(--kin-gold)',
          textShadow: '0 0 12px rgba(212,160,23,0.4)',
        }}>{relic.progress}%</div>
      </div>
      {/* 进度条 */}
      <div style={{
        height: 3,
        background: 'rgba(212,160,23,0.1)',
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 10,
        position: 'relative',
      }}>
        <div style={{
          height: '100%',
          width: `${relic.progress}%`,
          background: 'linear-gradient(90deg, #8a6808, #D4A017, #ffe28a)',
          boxShadow: '0 0 8px rgba(212,160,23,0.7)',
          borderRadius: 2,
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: 20,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5))',
            animation: 'kinShimmer 2.5s ease-in-out infinite',
            animationDelay: `${index * 0.4}s`,
          }} />
        </div>
      </div>
      {/* 底部元信息 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <KinChip size="sm">{stageLabel}</KinChip>
          <KinChip size="sm" variant="outline">
            裂纹 {relic.crackCount}
          </KinChip>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          style={{ color: 'var(--kin-gold)', opacity: 0.6 }}>
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 器物缩略图（简化的 SVG 器物形状 + 金线）
// ─────────────────────────────────────────────────────────────
function RelicThumb({ relic, size = 48 }) {
  // 根据 image 类型生成不同轮廓
  const shapeMap = {
    celadon: (
      <ellipse cx="20" cy="22" rx="18" ry="14" />
    ),
    hagi: (
      <>
        <path d="M6 30 Q6 10 20 8 Q34 10 34 30 Q34 36 20 36 Q6 36 6 30 Z" />
        <path d="M10 12 Q20 10 30 12" stroke="#D4A017" strokeWidth="0.5" fill="none" />
      </>
    ),
    kutani: (
      <circle cx="20" cy="20" r="16" />
    ),
    bizen: (
      <>
        <path d="M6 28 Q8 12 20 10 Q32 12 34 28 Q34 34 20 34 Q6 34 6 28 Z" />
        <path d="M12 18 Q20 14 28 18" stroke="#D4A017" strokeWidth="0.5" fill="none" />
      </>
    ),
  };
  const bgColor = {
    celadon: '#6b8e7d',
    hagi: '#b58e76',
    kutani: '#c88a5c',
    bizen: '#7a3e2a',
  }[relic.image] || '#555';

  const crackPaths = CRACK_PATHS[relic.id] || [];
  const scale = size / 380; // crack paths 在 380 宽度坐标系
  // 缩略图裂纹：截取一部分缩放展示
  return (
    <div style={{
      width: size, height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle at 30% 30%, ${bgColor}, #1a1510 80%)`,
      border: '1px solid rgba(212,160,23,0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.1), 0 2px 8px rgba(0,0,0,0.5)',
    }}>
      <svg width={size} height={size} viewBox="0 0 40 40">
        {shapeMap[relic.image] || shapeMap.kutani}
      </svg>
      {/* 金线装饰点 */}
      <div style={{
        position: 'absolute', width: 3, height: 3, borderRadius: '50%',
        background: '#D4A017',
        boxShadow: '0 0 4px #D4A017',
        top: '40%', left: '55%',
      }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Chip 标签
// ─────────────────────────────────────────────────────────────
function KinChip({ children, size = 'md', variant = 'filled', color = 'gold' }) {
  const sizes = {
    sm: { fontSize: 10, padding: '3px 8px' },
    md: { fontSize: 12, padding: '5px 12px' },
  };
  const variants = {
    filled: {
      background: 'rgba(212,160,23,0.15)',
      color: 'var(--kin-gold)',
      border: '1px solid rgba(212,160,23,0.3)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--kin-gofun-2)',
      border: '1px solid rgba(245,240,230,0.15)',
    },
    solid: {
      background: 'var(--kin-gold)',
      color: 'var(--kin-urushi)',
      border: '1px solid var(--kin-gold)',
    },
  };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      borderRadius: 999,
      letterSpacing: '0.08em',
      fontWeight: 500,
      ...sizes[size],
      ...variants[variant],
    }}>{children}</span>
  );
}

// ─────────────────────────────────────────────────────────────
// 按钮
// ─────────────────────────────────────────────────────────────
function KinButton({ children, variant = 'primary', size = 'md', fullWidth = false, onClick, icon, disabled }) {
  const sizes = {
    sm: { fontSize: 12, padding: '8px 16px', gap: 6 },
    md: { fontSize: 14, padding: '12px 20px', gap: 8 },
    lg: { fontSize: 16, padding: '16px 28px', gap: 10 },
  };
  const variants = {
    primary: {
      background: 'linear-gradient(180deg, #e8b828 0%, #D4A017 50%, #a87e0c 100%)',
      color: 'var(--kin-urushi)',
      border: '1px solid #e8b828',
      boxShadow: '0 2px 12px rgba(212,160,23,0.35), inset 0 1px 0 rgba(255,255,255,0.4)',
      fontWeight: 600,
    },
    secondary: {
      background: 'rgba(212,160,23,0.08)',
      color: 'var(--kin-gold)',
      border: '1px solid rgba(212,160,23,0.3)',
      fontWeight: 500,
    },
    ghost: {
      background: 'transparent',
      color: 'var(--kin-gofun)',
      border: '1px solid rgba(245,240,230,0.15)',
      fontWeight: 400,
    },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      data-cursor="hover"
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 12,
        cursor: disabled ? 'not-allowed' : 'pointer',
        letterSpacing: '0.1em',
        fontFamily: "'Noto Sans JP', sans-serif",
        opacity: disabled ? 0.4 : 1,
        transition: 'transform 150ms ease, box-shadow 250ms ease',
        width: fullWidth ? '100%' : 'auto',
        ...sizes[size],
        ...variants[variant],
      }}
      onMouseDown={e => {
        if (disabled) return;
        e.currentTarget.style.transform = 'scale(0.97)';
      }}
      onMouseUp={e => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// 输入框
// ─────────────────────────────────────────────────────────────
function KinInput({ label, value, onChange, placeholder, type = 'text', rows, multiline }) {
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{
          fontSize: 11, color: 'var(--kin-sabi)',
          letterSpacing: '0.15em', paddingLeft: 2,
        }}>{label}</label>
      )}
      <Tag
        type={type}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        data-cursor="hover"
        style={{
          background: 'rgba(24,23,26,0.8)',
          border: '1px solid rgba(212,160,23,0.15)',
          borderRadius: 10,
          padding: multiline ? '12px 14px' : '12px 14px',
          color: 'var(--kin-gofun)',
          fontSize: 14,
          fontFamily: "'Noto Sans JP', sans-serif",
          outline: 'none',
          resize: multiline ? 'none' : 'none',
          transition: 'border-color 200ms ease, box-shadow 200ms ease',
          width: '100%',
        }}
        onFocus={e => {
          e.target.style.borderColor = 'rgba(212,160,23,0.5)';
          e.target.style.boxShadow = '0 0 0 3px rgba(212,160,23,0.1)';
        }}
        onBlur={e => {
          e.target.style.borderColor = 'rgba(212,160,23,0.15)';
          e.target.style.boxShadow = 'none';
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 金缮签名 SVG（作为装饰性分隔 / 页眉签名）
// ─────────────────────────────────────────────────────────────
function KintsugiSignature({ width = 200, height = 40, animate = true }) {
  const svgRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!animate || reduced) return;
    const svg = svgRef.current;
    if (!svg) return;
    const paths = svg.querySelectorAll('path.crack-line');
    if (!paths.length) return;
    // 延迟一点，等进入视口
    const timer = setTimeout(() => {
      kintsugiDrawSequence(Array.from(paths), { stagger: 200, duration: 1500 });
    }, 500);
    return () => clearTimeout(timer);
  }, [animate, reduced]);

  return (
    <svg ref={svgRef} width={width} height={height} viewBox="0 0 200 40" style={{ display: 'block' }}>
      <path
        className="crack-line"
        d="M10 20 Q30 8 50 18 T90 16 T130 22 T170 14 T190 20"
        stroke="#D4A017"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        className="crack-line"
        d="M40 20 L48 30"
        stroke="#D4A017"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        className="crack-line"
        d="M90 16 L86 6 L92 2"
        stroke="#D4A017"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        className="crack-line"
        d="M130 22 L138 32"
        stroke="#D4A017"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        className="crack-line"
        d="M160 16 L156 8"
        stroke="#D4A017"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
      />
      {/* 金点 */}
      <circle cx="50" cy="18" r="1.5" fill="#ffe28a" style={{ filter: 'blur(0.5px)' }} />
      <circle cx="90" cy="16" r="1.5" fill="#ffe28a" style={{ filter: 'blur(0.5px)' }} />
      <circle cx="130" cy="22" r="1.5" fill="#ffe28a" style={{ filter: 'blur(0.5px)' }} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 数字计数动画（显示修复进度等数字时使用）
// ─────────────────────────────────────────────────────────────
function KinCounter({ value, duration = 1200, suffix = '', decimals = 0 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef({ start: 0, rafId: 0, startTime: 0 });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    const r = ref.current;
    r.start = display;
    r.startTime = performance.now();

    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
    function tick(now) {
      const t = Math.min(1, (now - r.startTime) / duration);
      const eased = easeOutCubic(t);
      const v = r.start + (value - r.start) * eased;
      setDisplay(v);
      if (t < 1) r.rafId = requestAnimationFrame(tick);
    }
    r.rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(r.rafId);
  }, [value, duration, reduced]);

  return (
    <span>{display.toFixed(decimals)}{suffix}</span>
  );
}

// ─────────────────────────────────────────────────────────────
// 打字机效果文字
// ─────────────────────────────────────────────────────────────
function KinTypewriter({ text, speed = 50, delay = 0, onDone }) {
  const [shown, setShown] = useState('');
  const doneRef = useRef(false);

  useEffect(() => {
    setShown('');
    doneRef.current = false;
    let i = 0;
    let timer;
    const start = setTimeout(() => {
      function type() {
        if (doneRef.current) return;
        if (i < text.length) {
          setShown(text.slice(0, i + 1));
          i++;
          // 每个字符速度略有变化，更像手写
          timer = setTimeout(type, speed * (0.6 + Math.random() * 0.8));
        } else {
          onDone?.();
        }
      }
      type();
    }, delay);
    return () => {
      clearTimeout(start);
      clearTimeout(timer);
      doneRef.current = true;
    };
  }, [text, speed, delay]);

  return (
    <span>
      {shown}
      <span style={{
        display: 'inline-block', width: 2, height: '1em',
        background: 'var(--kin-gold)',
        verticalAlign: 'text-bottom',
        marginLeft: 2,
        animation: 'kinBlink 1s steps(2) infinite',
      }} />
    </span>
  );
}

// 注入 keyframes
(function injectBlinkKf() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes kinBlink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
    @keyframes kinShimmer {
      0%, 100% { transform: translateX(-30px); opacity: 0; }
      50% { transform: translateX(10px); opacity: 0.8; }
    }
    @keyframes kinFadeInUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes kinPulseGold {
      0%, 100% { box-shadow: 0 0 0 0 rgba(212,160,23,0.4); }
      50% { box-shadow: 0 0 0 8px rgba(212,160,23,0); }
    }
    @keyframes kinFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }
    @keyframes kinScrollIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
})();

Object.assign(window, {
  KinTopBar, KinBottomNav, RelicCard, RelicThumb,
  KinChip, KinButton, KinInput, KintsugiSignature,
  KinCounter, KinTypewriter, useReducedMotion,
});
