/* =====================================================================
   口袋天文台 · 主应用 (app.jsx)
   整合：设备外壳、页面切换、Tweaks面板、签名动效、菜单
   ===================================================================== */

const { useState: useStateA, useEffect: useEffectA, useRef: useRefA } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentColor": "#FF7A1A",
  "palette": ["#0D0F14", "#F2EFE6", "#FF7A1A"],
  "particleDensity": "medium",
  "animations": true,
  "showSignature": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [activeTab, setActiveTab] = useStateA('tonight');
  const [activeSub, setActiveSub] = useStateA(null); // 'design' | 'api' | null
  const [menuOpen, setMenuOpen] = useStateA(false);
  const [screenTransition, setScreenTransition] = useStateA(false);
  const transitionTimeoutRef = useRefA(null);

  // 页面切换过渡
  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setScreenTransition(true);

    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }

    transitionTimeoutRef.current = setTimeout(() => {
      setActiveTab(tab);
      setActiveSub(null);
      setScreenTransition(false);
    }, 200);
  };

  const handleSubNavigate = (sub) => {
    setScreenTransition(true);
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
    transitionTimeoutRef.current = setTimeout(() => {
      setActiveSub(sub);
      setScreenTransition(false);
    }, 200);
  };

  const handleBack = () => {
    setScreenTransition(true);
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
    transitionTimeoutRef.current = setTimeout(() => {
      setActiveSub(null);
      setScreenTransition(false);
    }, 200);
  };

  useEffectA(() => {
    // 宣告可升级
    const announce = () => {
      window.parent.postMessage({ type: 'miaoda:upgrade:available', kind: 'interactive-prototype' }, '*');
    };
    announce();
    if (document.readyState !== 'complete') {
      window.addEventListener('load', announce, { once: true });
    }

    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }
    };
  }, []);

  // CSS 变量注入（根据 tweak）
  useEffectA(() => {
    document.documentElement.style.setProperty('--comet', t.accentColor);
    document.documentElement.style.setProperty('--comet-glow', t.accentColor + '55');
  }, [t.accentColor]);

  const renderScreen = () => {
    if (activeSub === 'design') {
      return <DesignSystemScreen onBack={handleBack} />;
    }
    if (activeSub === 'api') {
      return <ApiDocsScreen onBack={handleBack} />;
    }

    switch (activeTab) {
      case 'tonight':
        return <TonightScreen onNavigate={handleTabChange} />;
      case 'constellations':
        return <ConstellationsScreen />;
      case 'planets':
        return <PlanetsScreen />;
      case 'log':
        return <LogScreen />;
      default:
        return <TonightScreen onNavigate={handleTabChange} />;
    }
  };

  return (
    <>
      <GlobalKeyframes />
      <CustomCursor />

      <div className="stage">
        {/* 侧菜单 */}
        {menuOpen && (
          <div
            className="interactive"
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 100,
              opacity: 1,
              animation: 'fade-in 0.3s ease',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                left: 0, top: 0, bottom: 0,
                width: 280,
                background: 'var(--midnight)',
                borderRight: '1px solid var(--midnight-600)',
                padding: '60px 24px 24px',
                animation: 'slide-in-left 0.4s cubic-bezier(0.2, 0.9, 0.3, 1)',
              }}
            >
              {/* Logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                <div style={{ width: 40, height: 40 }}>
                  <StarSignature />
                </div>
                <div>
                  <div className="font-display" style={{ fontSize: 20, fontWeight: 600, color: 'var(--moonwhite)' }}>
                    口袋天文台
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--moonwhite-faint)', letterSpacing: '0.1em' }}>
                    POCKET OBSERVATORY
                  </div>
                </div>
              </div>

              {/* 菜单项 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { key: 'design', label: '设计规范', icon: 'design' },
                  { key: 'api', label: '接口文档', icon: 'code' },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="interactive"
                    onClick={() => {
                      handleSubNavigate(item.key);
                      setMenuOpen(false);
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 14px',
                      borderRadius: 10,
                      transition: 'all 0.25s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 122, 26, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: 'rgba(255, 122, 26, 0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {item.icon === 'design' && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--comet)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="13.5" cy="6.5" r=".5" />
                          <circle cx="17.5" cy="10.5" r=".5" />
                          <circle cx="8.5" cy="7.5" r=".5" />
                          <circle cx="6.5" cy="12.5" r=".5" />
                          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
                        </svg>
                      )}
                      {item.icon === 'code' && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--comet)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="16 18 22 12 16 6" />
                          <polyline points="8 6 2 12 8 18" />
                        </svg>
                      )}
                    </div>
                    <span style={{ fontSize: 14, color: 'var(--moonwhite)' }}>{item.label}</span>
                  </div>
                ))}
              </div>

              <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24 }}>
                <div style={{
                  padding: 14, borderRadius: 12,
                  background: 'rgba(255, 122, 26, 0.06)',
                  border: '1px solid rgba(255, 122, 26, 0.15)',
                }}>
                  <div style={{ fontSize: 11, color: 'var(--comet)', fontWeight: 500, marginBottom: 4 }}>v2.0.0</div>
                  <div style={{ fontSize: 10, color: 'var(--moonwhite-faint)', lineHeight: 1.5 }}>
                    星图数据更新于 08.16<br />
                    88 星座 · 7,832 天体
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 设备外壳 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <IOSDevice dark width={390} height={844}>
            <div style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              background: 'var(--midnight)',
            }}>
              {/* 左滑菜单按钮 */}
              {!activeSub && (
                <div
                  className="interactive"
                  onClick={() => setMenuOpen(true)}
                  style={{
                    position: 'absolute',
                    top: 'calc(var(--ios-safe-top, 0px) + 12px)',
                    left: 16,
                    zIndex: 30,
                    width: 32, height: 32,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: 0.7,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--moonwhite)" strokeWidth="1.5" strokeLinecap="round">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </div>
              )}

              {/* 屏幕内容 */}
              <div
                style={{
                  position: 'absolute', inset: 0,
                  opacity: screenTransition ? 0 : 1,
                  transform: screenTransition ? 'scale(0.98)' : 'scale(1)',
                  transition: 'opacity 0.2s ease, transform 0.2s ease',
                }}
              >
                {renderScreen()}
              </div>

              {/* 底部导航 */}
              {!activeSub && (
                <BottomNav active={activeTab} onChange={handleTabChange} />
              )}
            </div>
          </IOSDevice>

          {/* 设备下方品牌 */}
          <div style={{ textAlign: 'center', marginTop: 4 }}>
            <div className="font-display" style={{ fontSize: 13, color: 'var(--moonwhite-faint)', fontStyle: 'italic', letterSpacing: '0.05em' }}>
              Pocket Observatory
            </div>
            <div style={{ fontSize: 9, color: 'var(--moonwhite-faint)', opacity: 0.5, marginTop: 2, letterSpacing: '0.15em' }}>
              V2 · MOBILE APP UI
            </div>
          </div>
        </div>

        {/* 侧边说明 */}
        <div style={{
          position: 'fixed',
          right: 24,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          alignItems: 'flex-end',
        }}>
          <div style={{
            padding: '12px 16px',
            borderRadius: 12,
            background: 'rgba(13, 15, 20, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.06)',
            maxWidth: 200,
          }}>
            <div style={{ fontSize: 10, color: 'var(--comet)', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 6 }}>
              V2 · MOBILE APP
            </div>
            <div className="font-display" style={{ fontSize: 18, color: 'var(--moonwhite)', fontWeight: 500, lineHeight: 1.3, marginBottom: 6 }}>
              口袋天文台
            </div>
            <div style={{ fontSize: 11, color: 'var(--moonwhite-faint)', lineHeight: 1.6 }}>
              星空观测 App<br />
              4 大主页面 · 13 项组件动效<br />
              设计规范 + 接口文档
            </div>
          </div>

          <div style={{
            padding: '10px 14px',
            borderRadius: 10,
            background: 'rgba(13, 15, 20, 0.6)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}>
            <div className="font-mono" style={{ fontSize: 9, color: 'var(--moonwhite-faint)', lineHeight: 1.8 }}>
              <div>↔ 底部导航切换</div>
              <div>☰ 菜单查看规范/文档</div>
              <div>✦ 悬停查看动效</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tweaks Panel */}
      <TweaksPanel>
        <TweakSection label="色彩" />
        <TweakColor
          label="强调色"
          value={t.accentColor}
          options={['#FF7A1A', '#4CD6A7', '#E8D59B', '#A78BFA', '#F472B6']}
          onChange={(v) => setTweak('accentColor', v)}
        />
        <TweakSection label="动效" />
        <TweakToggle
          label="启用动效"
          value={t.animations}
          onChange={(v) => setTweak('animations', v)}
        />
        <TweakRadio
          label="粒子密度"
          value={t.particleDensity}
          options={['low', 'medium', 'high']}
          onChange={(v) => setTweak('particleDensity', v)}
        />
        <TweakToggle
          label="显示签名"
          value={t.showSignature}
          onChange={(v) => setTweak('showSignature', v)}
        />
        <TweakSection label="关于" />
        <TweakButton label="查看设计规范" onClick={() => handleSubNavigate('design')} />
        <TweakButton label="查看接口文档" onClick={() => handleSubNavigate('api')} />
      </TweaksPanel>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in-left {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
