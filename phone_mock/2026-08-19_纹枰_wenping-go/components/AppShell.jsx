// 纹枰 — 应用外壳
// 自定义导航栏、底部 TabBar、页面栈 push/pop、自定义光标

const { useState, useEffect, useRef, useCallback } = React;

// 颜色变量（供 JS 直接使用）
const WENPING_COLORS = {
  paper: '#FAF7F0',
  ink: '#2C1810',
  deepBrown: '#5C3D2E',
  board: '#E8D4A8',
  moss: '#6B8E5A',
  mossLight: '#A8C49A',
  lineBrown: '#D4C4A8',
  stoneBlack: '#1A1A1A',
  stoneWhite: '#F5F1E8',
  boardDark: '#8B6914',
};

// 自定义光标
function CustomCursor() {
  const cursorRef = useRef(null);
  const [pressed, setPressed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const posRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const targetRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const rafRef = useRef(null);
  const visibleRef = useRef(true);

  useEffect(() => {
    // 初始位置
    const el = cursorRef.current;
    if (!el) return;

    const animate = () => {
      if (!visibleRef.current) return;
      const p = posRef.current;
      const t = targetRef.current;
      p.x += (t.x - p.x) * 0.25;
      p.y += (t.y - p.y) * 0.25;
      el.style.transform = `translate(${p.x - 14}px, ${p.y - 14}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    const onMove = (e) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      setHidden(false);
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    // 可见性暂停
    const onVis = () => {
      visibleRef.current = !document.hidden;
      if (visibleRef.current && !rafRef.current) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 28,
        height: 28,
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: hidden ? 0 : 1,
        transition: 'opacity 0.2s, width 0.15s, height 0.15s',
        willChange: 'transform',
      }}
    >
      <svg width={pressed ? 24 : 28} height={pressed ? 24 : 28} viewBox="0 0 28 28" style={{
        transition: 'width 0.1s, height 0.1s',
        display: 'block',
        margin: 'auto',
        marginTop: pressed ? 2 : 0,
      }}>
        {/* 外圈 - 墨色圆环 */}
        <circle cx="14" cy="14" r="12" fill="none" stroke="#2C1810" strokeWidth="1.5" opacity="0.6" />
        {/* 内点 - 苔绿点缀 */}
        <circle cx="14" cy="14" r={pressed ? 3 : 2} fill="#6B8E5A" />
        {/* 按压时的涟漪 */}
        {pressed && (
          <circle cx="14" cy="14" r="8" fill="none" stroke="#6B8E5A" strokeWidth="1" opacity="0.5" />
        )}
      </svg>
    </div>
  );
}

// 导航栏
function NavBar({ title, leftAction, rightAction, subtitle, onBack, dark }) {
  const bgColor = dark ? WENPING_COLORS.ink : WENPING_COLORS.paper;
  const textColor = dark ? WENPING_COLORS.stoneWhite : WENPING_COLORS.ink;
  const subColor = dark ? 'rgba(245,241,232,0.6)' : WENPING_COLORS.deepBrown;

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: bgColor,
        paddingTop: 'var(--ios-safe-top)',
        borderBottom: dark ? '1px solid rgba(245,241,232,0.1)' : `1px solid ${WENPING_COLORS.lineBrown}`,
      }}
    >
      <div
        style={{
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '0 12px',
        }}
      >
        {/* 左侧按钮 */}
        <div style={{ position: 'absolute', left: 8, display: 'flex', gap: 4 }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                width: 36,
                height: 36,
                border: 'none',
                background: 'transparent',
                color: textColor,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}
          {leftAction}
        </div>
        {/* 标题 */}
        <div style={{ textAlign: 'center', maxWidth: '60%' }}>
          <div style={{
            fontSize: 17,
            fontWeight: 600,
            color: textColor,
            fontFamily: '"Noto Serif SC", "Songti SC", serif',
            lineHeight: 1.2,
          }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: 11, color: subColor, marginTop: 1, fontFamily: '"LXGW WenKai", "KaiTi", serif' }}>
              {subtitle}
            </div>
          )}
        </div>
        {/* 右侧按钮 */}
        <div style={{ position: 'absolute', right: 8, display: 'flex', gap: 4 }}>
          {rightAction}
        </div>
      </div>
    </div>
  );
}

// 底部 TabBar
function TabBar({ activeTab, onTabChange, tabs }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: 'var(--ios-safe-bottom)',
        background: 'rgba(250, 247, 240, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: `1px solid ${WENPING_COLORS.lineBrown}`,
        zIndex: 20,
      }}
    >
      <div style={{ display: 'flex', height: 50 }}>
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                padding: 0,
                color: active ? WENPING_COLORS.ink : 'rgba(44, 24, 16, 0.4)',
                transition: 'color 0.2s, transform 0.2s',
                transform: active ? 'scale(1)' : 'scale(0.95)',
              }}
            >
              <div style={{
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: active ? 'translateY(-2px)' : 'translateY(0)',
              }}>
                {tab.icon(active)}
              </div>
              <span style={{
                fontSize: 10,
                fontFamily: '"LXGW WenKai", "KaiTi", serif',
                fontWeight: active ? 700 : 400,
                lineHeight: 1,
              }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// 页面栈容器 — 支持 push/pop 转场
function PageStack({ pages, onPop }) {
  // pages: [{ key, component, direction? }]
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {pages.map((page, idx) => {
        const isTop = idx === pages.length - 1;
        const offset = idx - pages.length + 1; // 最上层 0，下一层 -1
        return (
          <div
            key={page.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: WENPING_COLORS.paper,
              transform: `translateX(${offset * 30}%)`,
              opacity: isTop ? 1 : 0,
              transition: 'transform 0.32s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.32s ease',
              pointerEvents: isTop ? 'auto' : 'none',
              overflow: 'auto',
              willChange: 'transform, opacity',
            }}
          >
            {page.component}
          </div>
        );
      })}
    </div>
  );
}

// Tab 内容容器 — 带淡入切换
function TabContent({ activeTab, children }) {
  return (
    <div key={activeTab} style={{
      width: '100%',
      height: '100%',
      animation: 'tabFadeIn 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
    }}>
      {children}
    </div>
  );
}

// 通用按钮样式
function WenPingButton({ children, variant = 'primary', size = 'md', onClick, style, disabled }) {
  const sizes = {
    sm: { padding: '6px 12px', fontSize: 13 },
    md: { padding: '10px 18px', fontSize: 15 },
    lg: { padding: '14px 24px', fontSize: 16 },
  };
  const variants = {
    primary: {
      background: WENPING_COLORS.ink,
      color: WENPING_COLORS.stoneWhite,
      border: 'none',
    },
    secondary: {
      background: WENPING_COLORS.board,
      color: WENPING_COLORS.ink,
      border: `1px solid ${WENPING_COLORS.lineBrown}`,
    },
    ghost: {
      background: 'transparent',
      color: WENPING_COLORS.ink,
      border: `1px solid ${WENPING_COLORS.lineBrown}`,
    },
    moss: {
      background: WENPING_COLORS.moss,
      color: '#fff',
      border: 'none',
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        borderRadius: 10,
        fontWeight: 500,
        fontFamily: '"LXGW WenKai", "KaiTi", serif',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'transform 0.1s, opacity 0.2s, background 0.2s',
        ...sizes[size],
        ...variants[variant],
        ...style,
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(0.97)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {children}
    </button>
  );
}

// 卡片
function WenPingCard({ children, style, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        borderRadius: 12,
        border: `1px solid ${WENPING_COLORS.lineBrown}`,
        boxShadow: '0 2px 8px rgba(44, 24, 16, 0.06)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// 徽标 / Tag
function WenPingTag({ children, color = 'moss', size = 'sm' }) {
  const colors = {
    moss: { bg: 'rgba(107,142,90,0.12)', fg: WENPING_COLORS.moss },
    brown: { bg: 'rgba(92,61,46,0.1)', fg: WENPING_COLORS.deepBrown },
    ink: { bg: 'rgba(44,24,16,0.08)', fg: WENPING_COLORS.ink },
  };
  const sizes = { sm: { padding: '2px 8px', fontSize: 11 }, md: { padding: '4px 10px', fontSize: 12 } };
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: 999,
      background: colors[color].bg,
      color: colors[color].fg,
      fontFamily: '"LXGW WenKai", "KaiTi", serif',
      fontWeight: 500,
      ...sizes[size],
    }}>
      {children}
    </span>
  );
}

window.WENPING_COLORS = WENPING_COLORS;
window.CustomCursor = CustomCursor;
window.NavBar = NavBar;
window.TabBar = TabBar;
window.PageStack = PageStack;
window.TabContent = TabContent;
window.WenPingButton = WenPingButton;
window.WenPingCard = WenPingCard;
window.WenPingTag = WenPingTag;
