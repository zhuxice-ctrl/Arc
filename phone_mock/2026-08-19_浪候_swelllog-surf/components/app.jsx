// ===== APP SHELL =====
// Tab navigation, page routing, palette theming, log sheet state

const { useRef, useEffect, useState, useCallback } = React;

// ===== 3 PALETTES (no blue-purple gradients, all distinctly different) =====
const PALETTES = {
  deepsea: {
    name: '深海墨绿',
    bg: '#14342B',           // Deep sea ink green
    bgCard: '#1D3F34',       // Slightly lighter card
    bgSurface: '#0E2A22',    // Surface/tide chart area
    textPrimary: '#F7F4EC',  // Sea foam warm white
    textSecondary: 'rgba(247,244,236,0.6)',
    textMuted: 'rgba(247,244,236,0.35)',
    accent: '#FF6B4A',       // Coral orange (action/warning)
    secondary: '#D9A441',    // Sand gold
    foam: '#FFFFFF',         // Pure foam white
    border: 'rgba(247,244,236,0.08)',
    divider: 'rgba(247,244,236,0.06)',
    chipBg: 'rgba(247,244,236,0.08)',
    success: '#48C9A9',
    warning: '#D9A441',
    danger: '#E05A47',
    tabBg: 'rgba(14,42,34,0.92)',
  },
  dusk: {
    name: '椰林黄昏',
    bg: '#3D2834',           // Deep berry purple-brown
    bgCard: '#4A3340',       // Lighter berry card
    bgSurface: '#2E1E26',    // Darker surface
    textPrimary: '#F2D7C6',  // Warm sand pink
    textSecondary: 'rgba(242,215,198,0.6)',
    textMuted: 'rgba(242,215,198,0.35)',
    accent: '#E8875A',       // Sunset orange
    secondary: '#C2957B',    // Dune gold (warmer)
    foam: '#FAECE0',         // Cream foam
    border: 'rgba(242,215,198,0.08)',
    divider: 'rgba(242,215,198,0.06)',
    chipBg: 'rgba(242,215,198,0.08)',
    success: '#8B9A6D',
    warning: '#E8875A',
    danger: '#B85042',
    tabBg: 'rgba(46,30,38,0.92)',
  },
  night: {
    name: '深夜海',
    bg: '#0F1E23',           // Deep night teal-blue
    bgCard: '#1A2E35',       // Slightly lighter card
    bgSurface: '#08151A',    // Very dark surface
    textPrimary: '#E8EEF2',  // Moonlight pale blue white
    textSecondary: 'rgba(232,238,242,0.6)',
    textMuted: 'rgba(232,238,242,0.35)',
    accent: '#48C9A9',       // Bioluminescent green
    secondary: '#7FA4AD',    // Sea foam gray-blue
    foam: '#FFFFFF',         // Moon white
    border: 'rgba(232,238,242,0.08)',
    divider: 'rgba(232,238,242,0.06)',
    chipBg: 'rgba(232,238,242,0.08)',
    success: '#48C9A9',
    warning: '#D9A441',
    danger: '#E07A5F',
    tabBg: 'rgba(8,21,26,0.92)',
  },
};

function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [detailSpot, setDetailSpot] = useState(null);
  const [showLogSheet, setShowLogSheet] = useState(false);
  const [designPage, setDesignPage] = useState(false);
  const [apiPage, setApiPage] = useState(false);
  const [logEntries, setLogEntries] = useState([...SURF_LOG]);
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [pageTransition, setPageTransition] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    if (window.matchMedia) {
      reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }, []);

  // Daily random palette (deterministic by date)
  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const palettes = ['deepsea', 'dusk', 'night'];
    const selected = palettes[dayOfYear % palettes.length];
    if (t.palette !== selected) {
      setTweak('palette', selected);
    }
  }, []);

  // Load log from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('langhou_log');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLogEntries(parsed);
        }
      }
    } catch (e) {}
  }, []);

  const palette = PALETTES[t.palette] || PALETTES.deepsea;

  // Navigate tabs
  const navigateTab = useCallback((tab) => {
    if (tab === currentTab) return;
    if (reducedMotion.current) {
      setCurrentTab(tab);
      setDetailSpot(null);
      setDesignPage(false);
      setApiPage(false);
      return;
    }
    setPageTransition(true);
    setTimeout(() => {
      setCurrentTab(tab);
      setDetailSpot(null);
      setDesignPage(false);
      setApiPage(false);
      setTimeout(() => setPageTransition(false), 50);
    }, 180);
  }, [currentTab]);

  const openSpotDetail = useCallback((spotId) => {
    if (reducedMotion.current) {
      setDetailSpot(spotId);
      return;
    }
    setPageTransition(true);
    setTimeout(() => {
      setDetailSpot(spotId);
      setTimeout(() => setPageTransition(false), 50);
    }, 180);
  }, []);

  const closeDetail = useCallback(() => {
    if (reducedMotion.current) {
      setDetailSpot(null);
      return;
    }
    setPageTransition(true);
    setTimeout(() => {
      setDetailSpot(null);
      setTimeout(() => setPageTransition(false), 50);
    }, 180);
  }, []);

  const openLogSheet = useCallback(() => {
    setShowLogSheet(true);
  }, []);

  const closeLogSheet = useCallback(() => {
    setShowLogSheet(false);
  }, []);

  const handleLogSubmit = useCallback((entry) => {
    setLogEntries(prev => {
      const updated = [entry, ...prev];
      try {
        localStorage.setItem('langhou_log', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setShowLogSheet(false);
    // Switch to log tab to show new entry
    setTimeout(() => {
      navigateTab('log');
    }, 200);
  }, [navigateTab]);

  const openDesign = useCallback(() => {
    setDesignPage(true);
  }, []);

  const openApi = useCallback(() => {
    setApiPage(true);
  }, []);

  // Determine current full page view
  const renderPage = () => {
    if (designPage) {
      return <DesignSpecPage theme={t.palette} onBack={() => setDesignPage(false)} />;
    }
    if (apiPage) {
      return <ApiDocsPage onBack={() => setApiPage(false)} />;
    }
    if (detailSpot) {
      return (
        <SpotDetailPage
          spotId={detailSpot}
          onBack={closeDetail}
          onLog={openLogSheet}
        />
      );
    }
    switch (currentTab) {
      case 'home':
        return (
          <HomePage
            theme={t.palette}
            onNavigate={navigateTab}
            onSpotClick={openSpotDetail}
          />
        );
      case 'log':
        return (
          <LogPage
            theme={t.palette}
            logEntries={logEntries}
            onNavigate={(target) => {
              if (target === 'logSheet') openLogSheet();
            }}
          />
        );
      case 'me':
        return (
          <MePage
            theme={t.palette}
            logEntries={logEntries}
            onDesignOpen={openDesign}
            onApiOpen={openApi}
          />
        );
      default:
        return (
          <HomePage
            theme={t.palette}
            onNavigate={navigateTab}
            onSpotClick={openSpotDetail}
          />
        );
    }
  };

  const showTabBar = !detailSpot && !designPage && !apiPage;

  return (
    <div
      className="app-root"
      style={{
        '--bg': palette.bg,
        '--bg-card': palette.bgCard,
        '--bg-surface': palette.bgSurface,
        '--text-primary': palette.textPrimary,
        '--text-secondary': palette.textSecondary,
        '--text-muted': palette.textMuted,
        '--accent': palette.accent,
        '--secondary': palette.secondary,
        '--foam': palette.foam,
        '--border': palette.border,
        '--divider': palette.divider,
        '--chip-bg': palette.chipBg,
        '--success': palette.success,
        '--warning': palette.warning,
        '--danger': palette.danger,
        '--tab-bg': palette.tabBg,
        '--tide-fill': 'rgba(255,255,255,0.03)',
        background: 'var(--bg)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Page content */}
      <div style={{
        height: '100%',
        opacity: pageTransition ? 0 : 1,
        transform: pageTransition ? 'translateX(12px)' : 'translateX(0)',
        transition: reducedMotion.current ? 'none' : 'opacity 0.18s ease, transform 0.18s ease',
      }}>
        {renderPage()}
      </div>

      {/* Log Sheet */}
      {showLogSheet && (
        <LogSheet
          onClose={closeLogSheet}
          onSubmit={handleLogSubmit}
          defaultSpot={detailSpot || 'wanning'}
        />
      )}

      {/* Tab bar */}
      {showTabBar && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--tab-bg)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--border)',
          paddingBottom: 'var(--ios-safe-bottom)',
          zIndex: 100,
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            height: 56,
          }}>
            {[
              { id: 'home', label: '浪报', icon: 'wave' },
              { id: 'spot', label: '浪点', icon: 'location' },
              { id: 'log', label: '浪账', icon: 'book' },
              { id: 'me', label: '我的', icon: 'user' },
            ].map(tab => {
              const active = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => navigateTab(tab.id)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 3,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '6px 0',
                    position: 'relative',
                  }}
                  className="tab-btn cursor-hover"
                >
                  <div style={{
                    position: 'relative',
                    transform: active ? 'scale(1.1)' : 'scale(1)',
                    transition: reducedMotion.current ? 'none' : 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}>
                    <TabIcon type={tab.icon} active={active} />
                    {active && (
                      <div style={{
                        position: 'absolute',
                        bottom: -6,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        background: 'var(--accent)',
                      }}></div>
                    )}
                  </div>
                  <span style={{
                    fontSize: 10,
                    color: active ? 'var(--accent)' : 'var(--text-muted)',
                    fontWeight: active ? 500 : 400,
                    transition: 'color 0.2s ease',
                  }}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tweaks panel */}
      <TweaksPanel>
        <TweakSection label="配色主题" />
        <TweakRadio
          label="每日轮换"
          value={t.palette}
          options={[
            { value: 'deepsea', label: '深海墨绿' },
            { value: 'dusk', label: '椰林黄昏' },
            { value: 'night', label: '深夜海' },
          ]}
          onChange={(v) => setTweak('palette', v)}
        />
        <TweakSection label="显示" />
        <TweakRadio
          label="密度"
          value={t.density || 'regular'}
          options={[
            { value: 'compact', label: '紧凑' },
            { value: 'regular', label: '标准' },
          ]}
          onChange={(v) => setTweak('density', v)}
        />
        <TweakSection label="关于" />
        <div style={{
          padding: '12px 16px',
          fontSize: 11,
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          fontFamily: "'Noto Sans SC', sans-serif",
        }}>
          浪候 SWELLLOG v2.0<br />
          原生 App 形态<br />
          每日自动切换配色主题<br />
          当前：{PALETTES[t.palette].name}
        </div>
      </TweaksPanel>
    </div>
  );
}

// Tab icons
function TabIcon({ type, active }) {
  const color = active ? 'var(--accent)' : 'var(--text-muted)';
  const sw = active ? 2.2 : 1.8;
  if (type === 'wave') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12 Q 6 6, 12 12 T 22 12" />
        <path d="M2 17 Q 6 11, 12 17 T 22 17" opacity="0.6" />
      </svg>
    );
  }
  if (type === 'location') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    );
  }
  if (type === 'book') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    );
  }
  if (type === 'user') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    );
  }
  return null;
}

// Simplified Me page (entry to design/api)
function MePage({ theme, logEntries, onDesignOpen, onApiOpen }) {
  return (
    <div className="page-scroll" style={{
      height: '100%',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    }}>
      <div style={{
        padding: 'calc(var(--ios-safe-top) + 16px) 20px 24px',
        background: 'var(--bg-surface)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 60, height: 60,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--secondary) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--bg)',
          }} className="avatar cursor-hover">
            {USER_STATS.avatar}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
              {USER_STATS.name}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {USER_STATS.level}
            </div>
          </div>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 6,
          marginTop: 20,
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
              {USER_STATS.totalSessions}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>出浪</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
              {USER_STATS.totalHours}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>小时</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
              {USER_STATS.streak}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>连续天数</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
              {BOARD_QUIVER.length}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>浪板</div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div style={{ padding: '16px 20px' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 }}>
          成就
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
        }}>
          {USER_STATS.achievements.map(a => (
            <div key={a.id} style={{
              background: 'var(--bg-card)',
              borderRadius: 12,
              padding: 12,
              textAlign: 'center',
              border: '1px solid var(--border)',
              opacity: a.earned ? 1 : 0.4,
            }} className="achievement-card cursor-hover">
              <div style={{
                width: 32, height: 32,
                borderRadius: '50%',
                background: a.earned ? 'var(--accent)' : 'var(--chip-bg)',
                margin: '0 auto 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                color: a.earned ? 'var(--bg)' : 'var(--text-muted)',
              }}>
                🏆
              </div>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>
                {a.name}
              </div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>
                {a.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 12,
          border: '1px solid var(--border)',
          overflow: 'hidden',
        }}>
          {[
            { label: '我的板库', value: `${BOARD_QUIVER.length} 块` },
            { label: '装备清单', value: '已完善' },
            { label: '紧急联系人', value: '已设置' },
            { label: '通知设置', value: '开' },
          ].map((item, idx, arr) => (
            <div key={item.label} style={{
              padding: '14px 16px',
              borderBottom: idx < arr.length - 1 ? '1px solid var(--divider)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }} className="menu-row cursor-hover">
              <span style={{ fontSize: 14, color: 'var(--text-primary)', flex: 1 }}>{item.label}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.value}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* Developer section */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, letterSpacing: 1 }}>
          开发者
        </div>
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 12,
          border: '1px solid var(--border)',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
          }} className="menu-row cursor-hover" onClick={onDesignOpen}>
            <span style={{ fontSize: 14, color: 'var(--text-primary)', flex: 1 }}>设计规范</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>Design System</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
          <div style={{ borderTop: '1px solid var(--divider)' }}></div>
          <div style={{
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
          }} className="menu-row cursor-hover" onClick={onApiOpen}>
            <span style={{ fontSize: 14, color: 'var(--text-primary)', flex: 1 }}>接口文档</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>REST API</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>
      </div>

      <div style={{ height: 32 }}></div>
    </div>
  );
}
