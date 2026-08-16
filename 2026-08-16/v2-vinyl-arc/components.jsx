// ========== 共享组件 ==========

const { useState, useEffect, useRef, useCallback, useMemo } = React;

// --- 唱片旋转组件（带黑胶纹理）---
function VinylDisc({ src, spinning = false, size = 200, showLabel = true }) {
  return (
    <div
      className="vinyl-disc"
      style={{
        width: size,
        height: size,
        position: 'relative',
        animation: spinning ? 'spin 8s linear infinite' : 'none',
      }}
    >
      {/* 黑胶本体 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `
            radial-gradient(circle at center, transparent 18%, rgba(0,0,0,0.9) 18.5%, #111 28%, #0a0a0a 30%, #1a1a1a 32%, #0a0a0a 34%, #1a1a1a 36%, #0a0a0a 38%, #1a1a1a 40%, #0a0a0a 42%, #1a1a1a 44%, #0a0a0a 46%, #1a1a1a 48%, #0a0a0a 50%)
          `,
          boxShadow: '0 8px 32px rgba(0,0,0,0.6), inset 0 0 60px rgba(0,0,0,0.8)',
        }}
      />
      {/* 封面图（中心标签大小） */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '40%',
          height: '40%',
          borderRadius: '50%',
          overflow: 'hidden',
          background: '#222',
        }}
      >
        <img
          src={src}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          draggable={false}
        />
      </div>
      {/* 中心孔 */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#1a1814',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.8)',
        }}
      />
      {/* 唱针高光 */}
      <div
        style={{
          position: 'absolute',
          top: '12%',
          right: '12%',
          width: 3,
          height: 3,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.4)',
          filter: 'blur(1px)',
        }}
      />
    </div>
  );
}

// --- 唱片卡片 ---
function AlbumCard({ album, size = 140, onClick, showVinyl = false }) {
  const cardRef = useRef(null);
  const tiltRef = useRef(null);
  const vinylRef = useRef(null);
  const coverRef = useRef(null);
  const hoveredRef = useRef(false);
  const rafRef = useRef(null);
  const targetTiltRef = useRef({ x: 0, y: 0 });
  const currentTiltRef = useRef({ x: 0, y: 0 });
  const leaveTimerRef = useRef(null);

  // 使用 RAF 平滑插值，避免每次 mousemove 都触发重渲染
  const animateTilt = useCallback(() => {
    if (!tiltRef.current) return;
    const ct = currentTiltRef.current;
    const tt = targetTiltRef.current;
    ct.x += (tt.x - ct.x) * 0.2;
    ct.y += (tt.y - ct.y) * 0.2;
    tiltRef.current.style.transform = `perspective(600px) rotateX(${ct.x}deg) rotateY(${ct.y}deg)`;
    rafRef.current = requestAnimationFrame(animateTilt);
  }, []);

  const handleEnter = useCallback(() => {
    hoveredRef.current = true;
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    if (tiltRef.current) {
      tiltRef.current.style.transition = 'none';
    }
    if (vinylRef.current) {
      vinylRef.current.style.right = '-40%';
    }
    if (coverRef.current) {
      coverRef.current.style.boxShadow = '0 12px 32px rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.3)';
    }
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(animateTilt);
    }
  }, [animateTilt]);

  const handleMove = useCallback((e) => {
    if (!cardRef.current || !hoveredRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    targetTiltRef.current = { x: -dy * 6, y: dx * 8 };
  }, []);

  const handleLeave = useCallback(() => {
    hoveredRef.current = false;
    targetTiltRef.current = { x: 0, y: 0 };
    if (tiltRef.current) {
      tiltRef.current.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    }
    if (vinylRef.current) {
      vinylRef.current.style.right = '-15%';
    }
    if (coverRef.current) {
      coverRef.current.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    }
    // 缓慢回到 0 后停止 RAF
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    leaveTimerRef.current = setTimeout(() => {
      leaveTimerRef.current = null;
      if (!hoveredRef.current && rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        if (tiltRef.current) {
          tiltRef.current.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg)';
        }
      }
    }, 500);
  }, []);

  // 卸载时清理
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current);
        leaveTimerRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="album-card"
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        width: size,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        flexShrink: 0,
      }}
    >
      <div
        ref={tiltRef}
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '100%',
          transform: 'perspective(600px) rotateX(0deg) rotateY(0deg)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* 黑胶露出效果 */}
        {showVinyl && (
          <div
            ref={vinylRef}
            style={{
              position: 'absolute',
              top: 0,
              right: '-15%',
              width: '85%',
              height: '100%',
              borderRadius: '50%',
              transition: 'right 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              background: '#111',
              boxShadow: '2px 4px 16px rgba(0,0,0,0.4)',
            }}
          >
            <img
              src={album.cover}
              alt=""
              style={{
                position: 'absolute',
                top: '30%',
                left: '30%',
                width: '40%',
                height: '40%',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
              draggable={false}
            />
          </div>
        )}
        {/* 封面 */}
        <div
          ref={coverRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            transition: 'box-shadow 0.3s ease',
          }}
        >
          <img
            src={album.cover}
            alt={album.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            draggable={false}
          />
          {/* 收藏标记 */}
          {album.favorite && (
            <div
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: 'rgba(200,106,62,0.95)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              }}
            >
              <svg viewBox="0 0 24 24" width={14} height={14} fill="#fff">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
          )}
        </div>
      </div>
      <div style={{ paddingLeft: 2 }}>
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: 13,
            color: '#E8D9C4',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            letterSpacing: 0.2,
          }}
        >
          {album.title}
        </div>
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            fontSize: 11,
            color: 'rgba(232,217,196,0.55)',
            marginTop: 2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {album.artist}
        </div>
      </div>
    </div>
  );
}

// --- 音乐波形可视化组件 ---
function Waveform({ active = false, color = "#C86A3E", bars = 24, height = 28 }) {
  const [heights, setHeights] = useState(Array(bars).fill(0.3));

  useEffect(() => {
    if (!active) {
      setHeights(Array(bars).fill(0.3));
      return;
    }
    const interval = setInterval(() => {
      setHeights(
        Array(bars).fill(0).map(() => 0.25 + Math.random() * 0.75)
      );
    }, 180);
    return () => clearInterval(interval);
  }, [active, bars]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        height,
      }}
    >
      {heights.map((h, i) => (
        <div
          key={i}
          style={{
            width: 2,
            height: `${h * 100}%`,
            background: color,
            borderRadius: 1,
            transition: active ? 'height 0.12s ease' : 'height 0.4s ease',
            opacity: active ? 1 : 0.4,
          }}
        />
      ))}
    </div>
  );
}

// --- 进度条（可拖动）---
function ProgressBar({ progress = 0, onSeek, color = "#C86A3E", height = 3 }) {
  const [dragging, setDragging] = useState(false);
  const barRef = useRef(null);

  const handleClick = (e) => {
    if (!barRef.current || !onSeek) return;
    const rect = barRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(pct);
  };

  return (
    <div
      ref={barRef}
      onClick={handleClick}
      style={{
        width: '100%',
        height: height + 12,
        display: 'flex',
        alignItems: 'center',
        cursor: onSeek ? 'pointer' : 'default',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height,
          background: 'rgba(232,217,196,0.12)',
          borderRadius: height / 2,
          overflow: 'visible',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${progress * 100}%`,
            background: color,
            borderRadius: height / 2,
            transition: dragging ? 'none' : 'width 0.1s linear',
          }}
        />
        {/* 拇指 */}
        {onSeek && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: `${progress * 100}%`,
              transform: 'translate(-50%, -50%)',
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#E8D9C4',
              boxShadow: `0 2px 6px rgba(0,0,0,0.4), 0 0 0 2px ${color}`,
              transition: dragging ? 'none' : 'left 0.1s linear',
            }}
          />
        )}
      </div>
    </div>
  );
}

// --- 底部播放条（Mini Player）---
function MiniPlayer({ album, onOpen, onPlayPause, isPlaying, progress }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (album) {
      setTimeout(() => setShow(true), 50);
    } else {
      setShow(false);
    }
  }, [album]);

  if (!album) return null;

  return (
    <div
      className="mini-player"
      onClick={onOpen}
      style={{
        position: 'absolute',
        left: 12,
        right: 12,
        bottom: 72,
        height: 64,
        background: 'rgba(42, 38, 32, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 12px 0 8px',
        cursor: 'pointer',
        transform: show ? 'translateY(0)' : 'translateY(100%)',
        opacity: show ? 1 : 0,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        border: '1px solid rgba(232,217,196,0.08)',
        zIndex: 10,
      }}
    >
      {/* 封面 */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 10,
          overflow: 'hidden',
          flexShrink: 0,
          position: 'relative',
        }}
      >
        <img
          src={album.cover}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          draggable={false}
        />
      </div>

      {/* 标题 + 波形 */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#E8D9C4',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {album.tracks[0].title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Waveform active={isPlaying} color={album.color} bars={16} height={16} />
          <span
            style={{
              fontSize: 11,
              color: 'rgba(232,217,196,0.5)',
            }}
          >
            {album.artist}
          </span>
        </div>
      </div>

      {/* 进度条 */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: 'rgba(232,217,196,0.1)',
          borderRadius: '0 0 16px 16px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            background: album.color,
            transition: 'width 0.3s linear',
          }}
        />
      </div>

      {/* 播放按钮 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPlayPause();
        }}
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: album.color,
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'transform 0.2s ease',
        }}
        className="play-btn-mini"
      >
        {isPlaying ? (
          <svg viewBox="0 0 24 24" width={18} height={18} fill="#fff">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width={18} height={18} fill="#fff" style={{ marginLeft: 2 }}>
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </div>
  );
}

// --- Tab Bar 底部导航 ---
function TabBar({ active, onNavigate, dark = true }) {
  const tabs = [
    { id: 'home', label: '收藏', icon: 'collections' },
    { id: 'discover', label: '发现', icon: 'compass' },
    { id: 'player', label: '', icon: 'play', center: true },
    { id: 'activity', label: '动态', icon: 'activity' },
    { id: 'profile', label: '我的', icon: 'user' },
  ];

  const iconPath = {
    collections: 'M4 6h16v12H4zM2 8v8h2V8H2zm18 0v8h2V8h-2z',
    compass: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.5 7.5l-1 4-4 1 1-4 4-1z',
    play: 'M8 5v14l11-7z',
    activity: 'M13.5 3l-1.5 5h-3l-3 9h3l1.5-5h3l1.5 5h3l1.5-5h-2.5l-1.5-5z',
    user: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 72,
        background: dark ? 'rgba(26, 24, 20, 0.95)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: `1px solid ${dark ? 'rgba(232,217,196,0.06)' : 'rgba(0,0,0,0.06)'}`,
        display: 'flex',
        alignItems: 'flex-start',
        paddingTop: 8,
        zIndex: 20,
      }}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        const isCenter = tab.center;
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            style={{
              flex: isCenter ? 0 : 1,
              width: isCenter ? 56 : undefined,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 4,
              padding: '6px 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              position: isCenter ? 'relative' : 'static',
            }}
            className={`tab-btn tab-${tab.id}`}
          >
            {isCenter ? (
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #C86A3E, #8B4513)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(200,106,62,0.4)',
                  position: 'absolute',
                  top: -16,
                  transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <svg viewBox="0 0 24 24" width={22} height={22} fill="#fff" style={{ marginLeft: 2 }}>
                  <path d={iconPath[tab.icon]} />
                </svg>
              </div>
            ) : (
              <>
                <div style={{ position: 'relative' }}>
                  <svg
                    viewBox="0 0 24 24"
                    width={22}
                    height={22}
                    fill={isActive ? '#C86A3E' : (dark ? 'rgba(232,217,196,0.5)' : 'rgba(0,0,0,0.4)')}
                    style={{ transition: 'fill 0.2s ease' }}
                  >
                    <path d={iconPath[tab.icon]} />
                  </svg>
                  {isActive && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: -6,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        background: '#C86A3E',
                      }}
                    />
                  )}
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 500,
                    color: isActive ? '#C86A3E' : (dark ? 'rgba(232,217,196,0.5)' : 'rgba(0,0,0,0.4)'),
                    transition: 'color 0.2s ease',
                  }}
                >
                  {tab.label}
                </span>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}

// --- 切换按钮（芯片）---
function Chip({ label, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        borderRadius: 20,
        border: 'none',
        background: active ? '#C86A3E' : 'rgba(232,217,196,0.08)',
        color: active ? '#fff' : 'rgba(232,217,196,0.7)',
        fontSize: 12,
        fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        whiteSpace: 'nowrap',
      }}
      className="chip"
    >
      {label}
      {count !== undefined && (
        <span
          style={{
            fontSize: 10,
            opacity: active ? 0.8 : 0.5,
            fontFamily: "'DM Mono', monospace",
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

// --- 列表行 ---
function ListRow({ icon, title, subtitle, rightContent, onClick, chevron = true, dark = true }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 16px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background 0.2s ease',
        borderBottom: `1px solid ${dark ? 'rgba(232,217,196,0.05)' : 'rgba(0,0,0,0.05)'}`,
      }}
      className="list-row"
    >
      {icon && (
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: dark ? 'rgba(200,106,62,0.15)' : 'rgba(200,106,62,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg viewBox="0 0 24 24" width={18} height={18} fill="#C86A3E">
            <path d={icon} />
          </svg>
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: dark ? '#E8D9C4' : '#1a1814',
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: 12,
              color: dark ? 'rgba(232,217,196,0.5)' : 'rgba(0,0,0,0.5)',
              marginTop: 2,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
      {rightContent}
      {chevron && (
        <svg
          viewBox="0 0 24 24"
          width={16}
          height={16}
          fill={dark ? 'rgba(232,217,196,0.3)' : 'rgba(0,0,0,0.3)'}
          style={{ flexShrink: 0 }}
        >
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
        </svg>
      )}
    </div>
  );
}

// --- Toast 提示 ---
function Toast({ message, visible }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${visible ? 1 : 0.9})`,
        padding: '12px 24px',
        background: 'rgba(42, 38, 32, 0.95)',
        backdropFilter: 'blur(12px)',
        borderRadius: 12,
        color: '#E8D9C4',
        fontSize: 14,
        fontWeight: 500,
        opacity: visible ? 1 : 0,
        pointerEvents: 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 100,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        whiteSpace: 'nowrap',
      }}
    >
      {message}
    </div>
  );
}

// 导出
Object.assign(window, {
  VinylDisc,
  AlbumCard,
  Waveform,
  ProgressBar,
  MiniPlayer,
  TabBar,
  Chip,
  ListRow,
  Toast,
});
