/* ============================================================
   app.jsx — Icecore Atlas main application
   Pages: Home (今日冰情) / Drill (钻探记录) / Samples (样本库)
          Profile (我的) / DesignSpec (设计规范) / API (接口文档)
   ============================================================ */

const PAGES = ['home', 'drill', 'samples', 'profile', 'designspec', 'api'];

function IcecoreApp({ defaults }) {
  const [page, setPage] = React.useState('home');
  const [t, setTweak] = useTweaks(defaults);

  // Initialize ambient effects once
  React.useEffect(() => {
    const disposers = [];
    const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduced && !t.reducedMotion) {
      const snowCleanup = initAmbientSnow();
      const cursorCleanup = initCustomCursor();
      if (snowCleanup) disposers.push(snowCleanup);
      if (cursorCleanup) disposers.push(cursorCleanup);
    }
    return () => disposers.forEach(fn => fn());
  }, [t.reducedMotion]);

  const reduced = t.reducedMotion;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      zIndex: 1,
      position: 'relative',
    }}>
      <IOSDevice dark width={390} height={844}>
        <AppContent page={page} setPage={setPage} t={t} />
      </IOSDevice>

      {/* Quick nav dots below phone */}
      <div style={{
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        zIndex: 1,
      }}>
        {['home', 'drill', 'samples', 'profile'].map(p => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className="interactive"
            style={{
              width: page === p ? '28px' : '8px',
              height: '8px',
              borderRadius: '4px',
              border: 'none',
              background: page === p ? 'var(--signal-orange)' : 'var(--frost-3)',
              cursor: 'pointer',
              transition: 'all 0.3s var(--ease-out)',
              padding: 0,
            }}
          />
        ))}
        <div style={{ width: '1px', height: '14px', background: 'var(--frost-4)', margin: '0 6px', opacity: 0.4 }} />
        <button
          onClick={() => setPage('designspec')}
          className="chip interactive"
          style={{
            padding: '4px 10px',
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.5px',
            borderRadius: '12px',
            border: '1px solid',
            borderColor: page === 'designspec' ? 'var(--signal-orange)' : 'var(--frost-4)',
            color: page === 'designspec' ? 'var(--signal-orange)' : 'var(--frost-3)',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          设计规范
        </button>
        <button
          onClick={() => setPage('api')}
          className="chip interactive"
          style={{
            padding: '4px 10px',
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.5px',
            borderRadius: '12px',
            border: '1px solid',
            borderColor: page === 'api' ? 'var(--signal-orange)' : 'var(--frost-4)',
            color: page === 'api' ? 'var(--signal-orange)' : 'var(--frost-3)',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          接口文档
        </button>
      </div>

      <TweaksPanel>
        <TweakSection label="动效" />
        <TweakToggle
          label="降低动效"
          value={t.reducedMotion}
          onChange={(v) => setTweak('reducedMotion', v)}
        />
        <TweakRadio
          label="密度"
          value={t.density}
          options={['compact', 'regular', 'comfy']}
          onChange={(v) => setTweak('density', v)}
        />
        <TweakToggle
          label="显示规范页入口"
          value={t.showSpecs}
          onChange={(v) => setTweak('showSpecs', v)}
        />
        <TweakSection label="关于" />
        <div style={{
          fontSize: '11px',
          color: 'var(--frost-4)',
          fontFamily: 'var(--font-mono)',
          lineHeight: 1.6,
        }}>
          Icecore Atlas v2.0<br />
          极地科考移动工作平台<br />
          12+ 物理模型动效
        </div>
      </TweaksPanel>
    </div>
  );
}

function AppContent({ page, setPage, t }) {
  // App screen background (ice-white) inside the phone
  const screenBg = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(180deg, #F0F4F6 0%, #E3EBEE 100%)',
    overflow: 'hidden',
  };

  // Safe area handling
  const contentStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    paddingTop: 'var(--ios-safe-top)',
    paddingBottom: 'var(--ios-safe-bottom)',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <div style={screenBg}>
      {/* Page transitions */}
      {page === 'home' && <HomePage t={t} />}
      {page === 'drill' && <DrillPage t={t} />}
      {page === 'samples' && <SamplesPage t={t} />}
      {page === 'profile' && <ProfilePage t={t} />}
      {page === 'designspec' && <DesignSpecPage t={t} />}
      {page === 'api' && <ApiPage t={t} />}

      {/* Bottom Nav */}
      {['home', 'drill', 'samples', 'profile'].includes(page) && (
        <BottomNav page={page} setPage={setPage} />
      )}
      {/* Back button for spec/api pages */}
      {['designspec', 'api'].includes(page) && (
        <button
          onClick={() => setPage('home')}
          className="interactive"
          style={{
            position: 'absolute',
            top: 'calc(var(--ios-safe-top) + 8px)',
            left: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(240, 244, 246, 0.8)',
            backdropFilter: 'blur(8px)',
            color: 'var(--deep-ink)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 50,
            boxShadow: '0 2px 8px rgba(22,35,43,0.1)',
          }}
        >
          <Icon.Chevron size={16} dir="left" />
        </button>
      )}
    </div>
  );
}

function BottomNav({ page, setPage }) {
  const items = [
    { key: 'home', label: '冰情', icon: Icon.Thermometer },
    { key: 'drill', label: '钻探', icon: Icon.Drill },
    { key: 'samples', label: '样本库', icon: Icon.Archive },
    { key: 'profile', label: '我的', icon: Icon.User },
  ];

  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      paddingBottom: 'var(--ios-safe-bottom)',
      background: 'rgba(240, 244, 246, 0.85)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(207, 218, 221, 0.6)',
      display: 'flex',
      justifyContent: 'space-around',
      zIndex: 20,
    }}>
      {items.map(item => {
        const isActive = page === item.key;
        const IconCmp = item.icon;
        return (
          <button
            key={item.key}
            onClick={() => setPage(item.key)}
            className="nav-item interactive"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 0 8px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: isActive ? 'var(--signal-orange)' : 'var(--frost-4)',
              transition: 'color 0.25s ease, transform 0.2s var(--ease-spring)',
              gap: '4px',
              position: 'relative',
            }}
          >
            <div style={{
              transform: isActive ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.3s var(--ease-spring)',
            }}>
              <IconCmp size={22} color="currentColor" />
            </div>
            <span style={{
              fontSize: '10px',
              fontFamily: 'var(--font-display)',
              fontWeight: isActive ? 600 : 400,
              letterSpacing: '0.3px',
            }}>
              {item.label}
            </span>
            {isActive && (
              <div style={{
                position: 'absolute',
                top: '4px',
                width: '4px',
                height: '4px',
                background: 'var(--signal-orange)',
                borderRadius: '50%',
                boxShadow: '0 0 6px var(--signal-orange)',
              }} />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ============================================================
// HOME PAGE — 今日冰情
// ============================================================
function HomePage({ t }) {
  const [scrollY, setScrollY] = React.useState(0);
  const scrollRef = React.useRef(null);

  const onScroll = (e) => {
    setScrollY(e.target.scrollTop);
  };

  const padding = t.density === 'compact' ? '12px' : t.density === 'comfy' ? '20px' : '16px';

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <ScrollProgressBar
        scrollTop={scrollY}
        scrollHeight={scrollRef.current ? scrollRef.current.scrollHeight - scrollRef.current.clientHeight : 1}
      />

      {/* Header */}
      <div style={{
        padding: `calc(var(--ios-safe-top) + 12px) ${padding} 12px`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 5,
      }}>
        <div>
          <div style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--steel-teal)',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            opacity: 0.7,
          }}>
            STATION ELLSWORTH · -34°C
          </div>
          <div style={{
            fontSize: '22px',
            fontWeight: 700,
            fontFamily: 'var(--font-display)',
            color: 'var(--deep-ink)',
            marginTop: '2px',
          }}>
            今日冰情
          </div>
        </div>
        <button className="interactive" style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: 'none',
          background: 'var(--ice-white)',
          boxShadow: 'var(--shadow-soft)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--steel-teal)',
          position: 'relative',
        }}>
          <Icon.Bell size={18} />
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '8px',
            height: '8px',
            background: 'var(--signal-orange)',
            borderRadius: '50%',
            border: '2px solid var(--ice-white)',
          }} />
        </button>
      </div>

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: `0 ${padding} 100px`,
          display: 'flex',
          flexDirection: 'column',
          gap: t.density === 'compact' ? '10px' : t.density === 'comfy' ? '18px' : '14px',
        }}
      >
        {/* Hero weather card with parallax + bubbles */}
        <RevealOnEnter>
          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-xl)',
            padding: '22px',
            background: 'linear-gradient(160deg, #33505C 0%, #16232B 100%)',
            color: 'var(--ice-white)',
            overflow: 'hidden',
            minHeight: '180px',
            cursor: 'pointer',
          }} className="interactive card-hover">
            <BubbleLayer count={14} color="rgba(240,244,246,0.15)" />

            {/* Parallax title */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              <ParallaxLayer strength={0.08}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}>
                  <div>
                    <div style={{
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      opacity: 0.6,
                      letterSpacing: '1.5px',
                    }}>
                      SECTOR 7G · DRILL SITE
                    </div>
                    <div style={{
                      fontSize: '52px',
                      fontWeight: 300,
                      fontFamily: 'var(--font-display)',
                      lineHeight: 1,
                      marginTop: '8px',
                    }}>
                      <CountUp value={-34.2} decimals={1} suffix="°" duration={1800} />
                    </div>
                    <div style={{
                      fontSize: '12px',
                      opacity: 0.7,
                      marginTop: '2px',
                    }}>
                      体感 -41°C · 风寒指数严重
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'rgba(255, 122, 26, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <PulseDot color="#FF7A1A" size={10} />
                    </div>
                    <div style={{
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      opacity: 0.6,
                      marginTop: '6px',
                    }}>
                      LIVE
                    </div>
                  </div>
                </div>
              </ParallaxLayer>

              <div style={{
                display: 'flex',
                gap: '14px',
                marginTop: '18px',
                position: 'relative',
                zIndex: 2,
              }}>
                <WeatherMini label="风速" value="18" unit="m/s" icon={<Icon.Wind size={14} />} />
                <WeatherMini label="气压" value="987" unit="hPa" icon={<Icon.Gear size={14} />} />
                <WeatherMini label="能见度" value="2.4" unit="km" icon={<Icon.Compass size={14} />} />
                <WeatherMini label="降雪" value="中" unit="级" icon={<Icon.Snowflake size={14} />} />
              </div>
            </div>
          </div>
        </RevealOnEnter>

        {/* Quick stats row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: t.density === 'compact' ? '10px' : '14px',
        }}>
          <RevealOnEnter delay={50}>
            <GlowCard delay={50} style={{ padding: '16px' }}>
              <div style={{
                fontSize: '11px',
                color: 'var(--steel-teal)',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.5px',
                opacity: 0.7,
              }}>
                ICE THICKNESS
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
                color: 'var(--deep-ink)',
                marginTop: '4px',
              }}>
                <CountUp value={1847} suffix=" m" duration={2000} />
              </div>
              <div style={{
                fontSize: '11px',
                color: 'var(--frost-4)',
                marginTop: '2px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                <span style={{ color: '#1F8A5B' }}>↑ 0.4m</span>
                较上季
              </div>
              <div style={{
                marginTop: '10px',
                paddingTop: '10px',
                borderTop: '1px solid var(--frost-1)',
              }}>
                <SpectrumBars count={12} height={20} color="#33505C" />
              </div>
            </GlowCard>
          </RevealOnEnter>

          <RevealOnEnter delay={100}>
            <GlowCard delay={100} style={{ padding: '16px' }}>
              <div style={{
                fontSize: '11px',
                color: 'var(--steel-teal)',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.5px',
                opacity: 0.7,
              }}>
                DRILL PROGRESS
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
                color: 'var(--deep-ink)',
                marginTop: '4px',
              }}>
                <CountUp value={73.6} decimals={1} suffix="%" duration={2000} />
              </div>
              <div style={{
                fontSize: '11px',
                color: 'var(--frost-4)',
                marginTop: '2px',
              }}>
                Core 07-G · 深度 1358m
              </div>
              <div style={{ marginTop: '14px' }}>
                <DrillProgress progress={73.6} height={6} color="#FF7A1A" />
              </div>
            </GlowCard>
          </RevealOnEnter>
        </div>

        {/* Section title */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '6px',
        }}>
          <div style={{
            fontSize: '15px',
            fontWeight: 600,
            color: 'var(--deep-ink)',
            fontFamily: 'var(--font-display)',
          }}>
            冰芯层理剖面
          </div>
          <button className="interactive" style={{
            fontSize: '12px',
            color: 'var(--signal-orange)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
          }}>
            全部 <Icon.Chevron size={12} />
          </button>
        </div>

        {/* Ice core scan card */}
        <RevealOnEnter delay={150}>
          <GlowCard delay={150} style={{ padding: 0, overflow: 'hidden' }}>
            <IceCoreScan />
          </GlowCard>
        </RevealOnEnter>

        {/* Alerts section */}
        <div style={{
          fontSize: '15px',
          fontWeight: 600,
          color: 'var(--deep-ink)',
          fontFamily: 'var(--font-display)',
          marginTop: '4px',
        }}>
          实时告警
        </div>

        {[
          { level: 'warning', title: '暴风雪预警', desc: '未来 6 小时风速可达 28m/s', time: '2 分钟前' },
          { level: 'info', title: '设备校准提醒', desc: '冰芯密度计 03 需校准', time: '18 分钟前' },
          { level: 'success', title: '钻探深度刷新', desc: 'Core 07-G 突破 1358m', time: '1 小时前' },
        ].map((alert, i) => (
          <RevealOnEnter key={i} delay={200 + i * 50}>
            <AlertRow alert={alert} delay={200 + i * 50} />
          </RevealOnEnter>
        ))}
      </div>
    </div>
  );
}

function WeatherMini({ label, value, unit, icon }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '10px',
        opacity: 0.6,
        fontFamily: 'var(--font-mono)',
      }}>
        {icon}
        {label}
      </div>
      <div style={{
        fontSize: '18px',
        fontWeight: 500,
        fontFamily: 'var(--font-display)',
        marginTop: '4px',
      }}>
        {value}<span style={{ fontSize: '11px', opacity: 0.6, marginLeft: '2px' }}>{unit}</span>
      </div>
    </div>
  );
}

function IceCoreScan() {
  const [active, setActive] = React.useState(true);
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    };
    resize();

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    const layers = 28;
    const layerHeight = h / layers;

    // Layer colors (simulating ice core strata)
    const layerColors = [];
    for (let i = 0; i < layers; i++) {
      const t = i / layers;
      // Deeper = darker, with random variations
      const baseLightness = 85 - t * 35;
      const variation = (Math.sin(i * 1.7) * 0.5 + 0.5) * 15;
      const l = baseLightness - variation * 0.5;
      // Teal-blue tint gets stronger with depth
      const hue = 195 + t * 15;
      layerColors.push({
        color: `hsl(${hue}, ${20 + t * 15}%, ${l}%)`,
        thickness: layerHeight * (0.7 + Math.random() * 0.7),
        hasBubble: Math.random() > 0.5,
        isDust: Math.random() > 0.85,
        density: 0.3 + Math.random() * 0.7,
      });
    }

    // Draw static layers
    const drawLayers = () => {
      ctx.save();
      ctx.scale(dpr, dpr);

      let y = 0;
      for (let i = 0; i < layers; i++) {
        const layer = layerColors[i];
        const lh = layer.thickness;

        // Layer fill
        const grad = ctx.createLinearGradient(0, y, w, y);
        grad.addColorStop(0, layer.color);
        grad.addColorStop(1, `hsl(195, 25%, ${80 - i / layers * 30}%)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, y, w, lh);

        // Dust/ash layer
        if (layer.isDust) {
          ctx.fillStyle = 'rgba(139, 119, 101, 0.5)';
          ctx.fillRect(0, y + lh * 0.3, w, lh * 0.4);
        }

        // Bubbles in layer
        if (layer.hasBubble) {
          ctx.fillStyle = 'rgba(255,255,255,0.4)';
          for (let b = 0; b < 5; b++) {
            const bx = Math.random() * w;
            const by = y + Math.random() * lh;
            const br = 0.5 + Math.random() * 2;
            ctx.beginPath();
            ctx.arc(bx, by, br, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        y += lh;
      }

      ctx.restore();
    };

    drawLayers();

    let rafKey = 'icecore-scan-' + Math.random().toString(36).slice(2);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduced && active) {
      globalRaf.subscribe(rafKey, () => {});
    }

    return () => {
      globalRaf.unsubscribe(rafKey);
    };
  }, [active]);

  return (
    <div style={{
      position: 'relative',
      height: '200px',
      overflow: 'hidden',
    }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
      {active && <ScanLine direction="vertical" color="#FF7A1A" />}

      {/* Depth markers */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        color: 'var(--deep-ink)',
        fontSize: '10px',
        fontFamily: 'var(--font-mono)',
        background: 'rgba(240,244,246,0.8)',
        backdropFilter: 'blur(4px)',
        padding: '4px 8px',
        borderRadius: '6px',
      }}>
        CORE 07-G · 1284m
      </div>
      <div style={{
        position: 'absolute',
        bottom: '12px',
        right: '12px',
        color: 'var(--signal-orange)',
        fontSize: '10px',
        fontFamily: 'var(--font-mono)',
        background: 'rgba(22,35,43,0.6)',
        backdropFilter: 'blur(4px)',
        padding: '4px 8px',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <PulseDot color="#FF7A1A" size={6} />
        SCANNING
      </div>

      {/* Side scale */}
      <div style={{
        position: 'absolute',
        right: 0,
        top: 0,
        height: '100%',
        width: '32px',
        background: 'linear-gradient(90deg, transparent, rgba(22,35,43,0.6))',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '10px 4px',
      }}>
        {[1284, 1300, 1320, 1340, 1358].map(d => (
          <div key={d} style={{
            fontSize: '8px',
            fontFamily: 'var(--font-mono)',
            color: 'rgba(240,244,246,0.7)',
            textAlign: 'right',
          }}>
            {d}m
          </div>
        ))}
      </div>
    </div>
  );
}

function AlertRow({ alert, delay }) {
  const colors = {
    warning: { bg: 'rgba(255, 122, 26, 0.12)', dot: '#FF7A1A', text: 'var(--signal-orange)' },
    info: { bg: 'rgba(51, 80, 92, 0.1)', dot: '#33505C', text: 'var(--steel-teal)' },
    success: { bg: 'rgba(31, 138, 91, 0.1)', dot: '#1F8A5B', text: '#1F8A5B' },
  };
  const c = colors[alert.level];

  return (
    <div
      className="interactive card-hover"
      style={{
        display: 'flex',
        gap: '12px',
        padding: '14px',
        background: 'var(--ice-white)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-soft)',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: c.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <PulseDot color={c.dot} size={8} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--deep-ink)',
        }}>
          {alert.title}
        </div>
        <div style={{
          fontSize: '11px',
          color: 'var(--frost-4)',
          marginTop: '2px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {alert.desc}
        </div>
      </div>
      <div style={{
        fontSize: '10px',
        color: 'var(--frost-4)',
        fontFamily: 'var(--font-mono)',
        flexShrink: 0,
      }}>
        {alert.time}
      </div>
    </div>
  );
}

// ============================================================
// DRILL PAGE — 钻探记录
// ============================================================
function DrillPage({ t }) {
  const [selectedCore, setSelectedCore] = React.useState('07-G');
  const [drillActive, setDrillActive] = React.useState(true);
  const padding = t.density === 'compact' ? '12px' : t.density === 'comfy' ? '20px' : '16px';

  const cores = [
    { id: '07-G', depth: 1358, progress: 73.6, status: 'drilling', temp: -34.2 },
    { id: '06-F', depth: 1420, progress: 100, status: 'complete', temp: -32.8 },
    { id: '05-E', depth: 1205, progress: 64.2, status: 'paused', temp: -31.5 },
    { id: '04-D', depth: 1100, progress: 45.8, status: 'paused', temp: -30.1 },
  ];

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: `calc(var(--ios-safe-top) + 12px) ${padding} 12px`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <div style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--steel-teal)',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            opacity: 0.7,
          }}>
            DRILLING OPERATIONS
          </div>
          <div style={{
            fontSize: '22px',
            fontWeight: 700,
            fontFamily: 'var(--font-display)',
            color: 'var(--deep-ink)',
            marginTop: '2px',
          }}>
            钻探记录
          </div>
        </div>
        <button
          className="interactive"
          onClick={() => setDrillActive(!drillActive)}
          style={{
            padding: '8px 14px',
            borderRadius: '20px',
            border: 'none',
            background: drillActive ? 'var(--signal-orange)' : 'var(--frost-2)',
            color: drillActive ? '#fff' : 'var(--steel-teal)',
            fontSize: '12px',
            fontWeight: 600,
            fontFamily: 'var(--font-display)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.25s ease',
          }}
        >
          <PulseDot color={drillActive ? '#fff' : 'var(--steel-teal)'} size={6} active={drillActive} />
          {drillActive ? '钻进中' : '已暂停'}
        </button>
      </div>

      {/* Core tabs */}
      <div style={{
        padding: `0 ${padding}`,
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        {cores.map(core => (
          <button
            key={core.id}
            onClick={() => setSelectedCore(core.id)}
            className="chip interactive tab"
            style={{
              padding: '8px 14px',
              borderRadius: '16px',
              border: '1.5px solid',
              borderColor: selectedCore === core.id ? 'var(--signal-orange)' : 'var(--frost-2)',
              background: selectedCore === core.id ? 'var(--signal-orange)' : 'transparent',
              color: selectedCore === core.id ? '#fff' : 'var(--steel-teal)',
              fontSize: '12px',
              fontWeight: 500,
              fontFamily: 'var(--font-display)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)' }}>CORE {core.id}</span>
          </button>
        ))}
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: `14px ${padding} 100px`,
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}>
        {/* Drilling visualization */}
        <RevealOnEnter>
          <DrillVisualization active={drillActive} core={cores.find(c => c.id === selectedCore)} />
        </RevealOnEnter>

        {/* Stats grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
        }}>
          {[
            { label: '当前深度', value: '1,358.4', unit: 'm', icon: <Icon.Drill size={16} color="#FF7A1A" /> },
            { label: '钻进速率', value: '0.82', unit: 'm/h', icon: <Icon.Gear size={16} color="#33505C" /> },
            { label: '冰层温度', value: '-34.2', unit: '°C', icon: <Icon.Thermometer size={16} color="#33505C" /> },
            { label: '扭矩', value: '12.4', unit: 'N·m', icon: <Icon.Layers size={16} color="#33505C" /> },
          ].map((stat, i) => (
            <RevealOnEnter key={i} delay={50 + i * 50}>
              <GlowCard delay={50 + i * 50} style={{ padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{
                    fontSize: '10px',
                    color: 'var(--steel-teal)',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.5px',
                    opacity: 0.7,
                    textTransform: 'uppercase',
                  }}>
                    {stat.label}
                  </div>
                  {stat.icon}
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                  color: 'var(--deep-ink)',
                  marginTop: '6px',
                }}>
                  <CountUp value={parseFloat(stat.value.replace(/,/g, ''))} decimals={stat.value.includes('.') ? 1 : 0} duration={1500 + i * 200} />
                  <span style={{ fontSize: '12px', color: 'var(--frost-4)', fontWeight: 400, marginLeft: '4px' }}>{stat.unit}</span>
                </div>
              </GlowCard>
            </RevealOnEnter>
          ))}
        </div>

        {/* Drill progress bar detailed */}
        <RevealOnEnter delay={250}>
          <GlowCard delay={250}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}>
              <div style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--deep-ink)',
                fontFamily: 'var(--font-display)',
              }}>
                总进度
              </div>
              <div style={{
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--signal-orange)',
                fontWeight: 500,
              }}>
                73.6% · 目标 1847m
              </div>
            </div>
            <DrillProgress progress={73.6} height={10} color="#FF7A1A" />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '6px',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--frost-4)',
            }}>
              <span>0m</span>
              <span>1358.4m</span>
              <span>1847m</span>
            </div>
          </GlowCard>
        </RevealOnEnter>

        {/* Layer log */}
        <div style={{
          fontSize: '15px',
          fontWeight: 600,
          color: 'var(--deep-ink)',
          fontFamily: 'var(--font-display)',
          marginTop: '4px',
        }}>
          层理记录
        </div>

        {[
          { depth: '1358.2m', type: '密集冰', density: '0.912 g/cm³', color: '#33505C' },
          { depth: '1342.7m', type: '气泡冰', density: '0.876 g/cm³', color: '#7A98A3' },
          { depth: '1328.5m', type: '微粒层', density: '0.901 g/cm³', color: '#8B7765' },
          { depth: '1310.1m', type: '致密冰', density: '0.918 g/cm³', color: '#16232B' },
        ].map((layer, i) => (
          <RevealOnEnter key={i} delay={300 + i * 60}>
            <div
              className="interactive card-hover"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                background: 'var(--ice-white)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-soft)',
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: '4px',
                height: '40px',
                borderRadius: '2px',
                background: layer.color,
              }} />
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--deep-ink)',
                  fontFamily: 'var(--font-display)',
                }}>
                  {layer.type}
                </div>
                <div style={{
                  fontSize: '10px',
                  color: 'var(--frost-4)',
                  fontFamily: 'var(--font-mono)',
                  marginTop: '2px',
                }}>
                  {layer.density}
                </div>
              </div>
              <div style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--steel-teal)',
              }}>
                {layer.depth}
              </div>
            </div>
          </RevealOnEnter>
        ))}
      </div>
    </div>
  );
}

function DrillVisualization({ active, core }) {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    };
    resize();

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let rafKey = 'drill-vis-' + Math.random().toString(36).slice(2);

    if (reduced || !active) {
      drawDrill(ctx, dpr, canvas.offsetWidth, canvas.offsetHeight, core, 0);
      return;
    }

    let t = 0;
    globalRaf.subscribe(rafKey, (dt) => {
      t += dt;
      drawDrill(ctx, dpr, canvas.offsetWidth, canvas.offsetHeight, core, t);
    });

    return () => {
      globalRaf.unsubscribe(rafKey);
    };
  }, [active, core?.id]);

  return (
    <div style={{
      position: 'relative',
      height: '180px',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #E3EBEE 0%, #CFDADD 100%)',
    }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
      <BubbleLayer count={10} color="rgba(255,255,255,0.4)" />
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '14px',
        fontSize: '10px',
        fontFamily: 'var(--font-mono)',
        color: 'var(--steel-teal)',
        letterSpacing: '1px',
        textTransform: 'uppercase',
      }}>
        CORE {core?.id} · DRILLING
      </div>
    </div>
  );
}

function drawDrill(ctx, dpr, w, h, core, t) {
  ctx.save();
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);

  // Ice layers background
  const layers = 12;
  for (let i = 0; i < layers; i++) {
    const y = (i / layers) * h;
    const lh = h / layers;
    const hue = 195 + (i / layers) * 20;
    const lightness = 90 - (i / layers) * 20;
    ctx.fillStyle = `hsla(${hue}, 25%, ${lightness}%, 0.5)`;
    ctx.fillRect(0, y, w, lh);
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(0, y, w, 0.5);
  }

  // Drill hole (center)
  const cx = w / 2;
  const holeW = 30;
  ctx.fillStyle = 'rgba(22, 35, 43, 0.15)';
  ctx.fillRect(cx - holeW / 2, 0, holeW, h);

  // Drill pipe
  const progress = core ? (core.progress / 100) : 0.7;
  const drillY = progress * h + Math.sin(t * 15) * 1.5; // vibrate
  const pipeW = 6;
  const pipeGradient = ctx.createLinearGradient(cx - pipeW / 2, 0, cx + pipeW / 2, 0);
  pipeGradient.addColorStop(0, '#8B9598');
  pipeGradient.addColorStop(0.5, '#D0D8DB');
  pipeGradient.addColorStop(1, '#8B9598');
  ctx.fillStyle = pipeGradient;
  ctx.fillRect(cx - pipeW / 2, 0, pipeW, drillY);

  // Drill bit
  ctx.fillStyle = '#16232B';
  ctx.beginPath();
  ctx.moveTo(cx - 10, drillY);
  ctx.lineTo(cx + 10, drillY);
  ctx.lineTo(cx + 6, drillY + 14);
  ctx.lineTo(cx - 6, drillY + 14);
  ctx.closePath();
  ctx.fill();

  // Drill teeth
  ctx.fillStyle = '#FF7A1A';
  for (let i = 0; i < 4; i++) {
    const tx = cx - 6 + i * 4;
    ctx.fillRect(tx, drillY + 14, 2, 3);
  }

  // Rotation indicator lines
  ctx.strokeStyle = 'rgba(255, 122, 26, 0.4)';
  ctx.lineWidth = 1;
  const rotAngle = t * 12;
  for (let i = 0; i < 6; i++) {
    const a = rotAngle + (i / 6) * Math.PI * 2;
    const r1 = 12;
    const r2 = 16;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * r1, drillY + 7 + Math.sin(a) * r1);
    ctx.lineTo(cx + Math.cos(a) * r2, drillY + 7 + Math.sin(a) * r2);
    ctx.stroke();
  }

  // Debris particles falling from drill
  ctx.fillStyle = 'rgba(169, 189, 196, 0.6)';
  for (let i = 0; i < 15; i++) {
    const py = (drillY + 20 + ((t * 50 + i * 30) % (h - drillY - 20)));
    const px = cx - 10 + Math.sin(t * 3 + i) * 8 + i * 1.5;
    ctx.beginPath();
    ctx.arc(px, py, 1.5 + Math.sin(t * 2 + i) * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// ============================================================
// SAMPLES PAGE — 样本库
// ============================================================
function SamplesPage({ t }) {
  const [filter, setFilter] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const padding = t.density === 'compact' ? '12px' : t.density === 'comfy' ? '20px' : '16px';

  const samples = [
    { id: 'ICE-07-G-1284', depth: '1284.3m', type: '致密冰', year: '~1850', status: 'analyzed', color: '#33505C' },
    { id: 'ICE-07-G-1301', depth: '1301.7m', type: '气泡冰', year: '~1790', status: 'analyzing', color: '#7A98A3' },
    { id: 'ICE-07-G-1328', depth: '1328.5m', type: '微粒层', year: '~1720', status: 'stored', color: '#8B7765' },
    { id: 'ICE-06-F-1402', depth: '1402.1m', type: '冰层夹杂物', year: '~1650', status: 'analyzed', color: '#33505C' },
    { id: 'ICE-06-F-1420', depth: '1420.0m', type: '底冰', year: '~1580', status: 'stored', color: '#16232B' },
    { id: 'ICE-05-E-1185', depth: '1185.6m', type: '积雪冰', year: '~1910', status: 'analyzed', color: '#A9BDC4' },
  ];

  const filterOptions = [
    { key: 'all', label: '全部' },
    { key: 'analyzed', label: '已分析' },
    { key: 'analyzing', label: '分析中' },
    { key: 'stored', label: '已入库' },
  ];

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        padding: `calc(var(--ios-safe-top) + 12px) ${padding} 0`,
      }}>
        <div style={{
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--steel-teal)',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          opacity: 0.7,
        }}>
          ICE CORE ARCHIVE
        </div>
        <div style={{
          fontSize: '22px',
          fontWeight: 700,
          fontFamily: 'var(--font-display)',
          color: 'var(--deep-ink)',
          marginTop: '2px',
          marginBottom: '12px',
        }}>
          样本库
        </div>

        {/* Search bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 14px',
          background: 'var(--ice-white)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-soft)',
        }}>
          <Icon.Search size={16} color="var(--frost-4)" />
          <input
            type="text"
            placeholder="搜索样本编号、深度、类型..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="interactive"
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: '13px',
              color: 'var(--deep-ink)',
              outline: 'none',
              fontFamily: 'var(--font-body)',
              cursor: 'text',
            }}
          />
          <button className="interactive" style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            border: 'none',
            background: 'var(--frost-1)',
            color: 'var(--steel-teal)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <Icon.Layers size={14} />
          </button>
        </div>
      </div>

      {/* Filter chips */}
      <div style={{
        padding: `12px ${padding}`,
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        flexShrink: 0,
      }}>
        {filterOptions.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="chip interactive tab"
            style={{
              padding: '6px 14px',
              borderRadius: '14px',
              border: '1px solid',
              borderColor: filter === f.key ? 'var(--signal-orange)' : 'var(--frost-2)',
              background: filter === f.key ? 'var(--signal-orange)' : 'var(--ice-white)',
              color: filter === f.key ? '#fff' : 'var(--steel-teal)',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              fontFamily: 'var(--font-display)',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: `0 ${padding} 100px`,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        {/* Stats summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          marginBottom: '4px',
        }}>
          {[
            { label: '总样本', value: 2847, unit: '件' },
            { label: '分析完成', value: 1893, unit: '件' },
            { label: '本季新增', value: 342, unit: '件' },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'var(--ice-white)',
              borderRadius: 'var(--radius-md)',
              padding: '10px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-soft)',
            }}>
              <div style={{
                fontSize: '16px',
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
                color: 'var(--deep-ink)',
              }}>
                <CountUp value={s.value} duration={1500 + i * 300} />
              </div>
              <div style={{
                fontSize: '10px',
                color: 'var(--frost-4)',
                marginTop: '2px',
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Sample list */}
        {samples
          .filter(s => filter === 'all' || s.status === filter)
          .filter(s => s.id.toLowerCase().includes(search.toLowerCase()) || s.type.includes(search))
          .map((sample, i) => (
            <RevealOnEnter key={sample.id} delay={i * 60}>
              <SampleCard sample={sample} delay={i * 60} />
            </RevealOnEnter>
          ))}

        {/* Empty state */}
        {samples.filter(s => filter === 'all' || s.status === filter).filter(s => s.id.toLowerCase().includes(search.toLowerCase()) || s.type.includes(search)).length === 0 && (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: 'var(--frost-4)',
            fontSize: '13px',
          }}>
            未找到匹配的样本
          </div>
        )}
      </div>
    </div>
  );
}

function SampleCard({ sample, delay }) {
  const statusLabels = {
    analyzed: { label: '已分析', color: '#1F8A5B', bg: 'rgba(31, 138, 91, 0.1)' },
    analyzing: { label: '分析中', color: '#FF7A1A', bg: 'rgba(255, 122, 26, 0.12)' },
    stored: { label: '已入库', color: '#33505C', bg: 'rgba(51, 80, 92, 0.1)' },
  };
  const s = statusLabels[sample.status];

  return (
    <div
      className="interactive card-hover"
      style={{
        display: 'flex',
        gap: '12px',
        padding: '14px',
        background: 'var(--ice-white)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-soft)',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        opacity: 0,
        animation: `fadeSlideIn 0.5s ${delay}ms ease forwards`,
      }}
    >
      {/* Ice core visual */}
      <div style={{
        width: '40px',
        height: '72px',
        borderRadius: '8px',
        background: `linear-gradient(180deg, ${sample.color}dd, ${sample.color}66)`,
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        <div style={{
          position: 'absolute',
          top: '20%',
          left: 0,
          width: '100%',
          height: '1px',
          background: 'rgba(255,255,255,0.3)',
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          width: '100%',
          height: '1px',
          background: 'rgba(255,255,255,0.4)',
        }} />
        <div style={{
          position: 'absolute',
          top: '75%',
          left: 0,
          width: '100%',
          height: '1px',
          background: 'rgba(255,255,255,0.3)',
        }} />
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '30%',
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.5)',
        }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '12px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--steel-teal)',
          fontWeight: 500,
        }}>
          {sample.id}
        </div>
        <div style={{
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--deep-ink)',
          marginTop: '4px',
          fontFamily: 'var(--font-display)',
        }}>
          {sample.type}
        </div>
        <div style={{
          display: 'flex',
          gap: '10px',
          marginTop: '6px',
          fontSize: '10px',
          color: 'var(--frost-4)',
          fontFamily: 'var(--font-mono)',
        }}>
          <span>{sample.depth}</span>
          <span>·</span>
          <span>{sample.year}</span>
        </div>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{
          padding: '4px 8px',
          borderRadius: '10px',
          background: s.bg,
          color: s.color,
          fontSize: '10px',
          fontWeight: 500,
          fontFamily: 'var(--font-display)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <PulseDot color={s.color} size={5} active={sample.status === 'analyzing'} />
          {s.label}
        </div>
        <Icon.Chevron size={14} color="var(--frost-3)" />
      </div>
    </div>
  );
}

// ============================================================
// PROFILE PAGE — 我的
// ============================================================
function ProfilePage({ t }) {
  const padding = t.density === 'compact' ? '12px' : t.density === 'comfy' ? '20px' : '16px';

  const menuItems = [
    { icon: <Icon.Drill size={18} />, label: '我的任务', count: 8, color: '#FF7A1A' },
    { icon: <Icon.Archive size={18} />, label: '我上传的样本', count: 127, color: '#33505C' },
    { icon: <Icon.Doc size={18} />, label: '科考报告', count: 23, color: '#33505C' },
    { icon: <Icon.Gear size={18} />, label: '设备管理', count: 5, color: '#33505C' },
  ];

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflowY: 'auto',
    }}>
      {/* Header with avatar */}
      <div style={{
        position: 'relative',
        padding: `calc(var(--ios-safe-top) + 20px) ${padding} 24px`,
        background: 'linear-gradient(180deg, #33505C 0%, #16232B 100%)',
        color: 'var(--ice-white)',
        overflow: 'hidden',
      }}>
        <SnowParticleLayer count={25} speed={0.6} color="rgba(240,244,246,0.3)" />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}>
            {/* Avatar with pulse ring */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '-4px',
                left: '-4px',
                right: '-4px',
                bottom: '-4px',
                borderRadius: '50%',
                border: '2px solid rgba(255, 122, 26, 0.4)',
                animation: 'pulseRing 2.5s ease-out infinite',
              }} />
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FF7A1A 0%, #FF5500 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
                color: '#fff',
                boxShadow: '0 4px 16px rgba(255, 122, 26, 0.4)',
              }}>
                ZX
              </div>
            </div>
            <div>
              <div style={{
                fontSize: '18px',
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
              }}>
                朱曦策
              </div>
              <div style={{
                fontSize: '12px',
                opacity: 0.7,
                marginTop: '2px',
              }}>
                首席冰川学家 · 考察队队长
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '6px',
              }}>
                <PulseDot color="#1F8A5B" size={6} />
                <span style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  opacity: 0.8,
                }}>
                  ON-SITE · 第 47 天
                </span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginTop: '20px',
          }}>
            {[
              { label: '在站天数', value: 47 },
              { label: '钻取深度', value: 1358, unit: 'm' },
              { label: '样本贡献', value: 127 },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                }}>
                  <CountUp value={s.value} duration={1500 + i * 200} />
                  {s.unit && <span style={{ fontSize: '11px', fontWeight: 400, opacity: 0.7 }}> {s.unit}</span>}
                </div>
                <div style={{
                  fontSize: '10px',
                  opacity: 0.6,
                  marginTop: '2px',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.5px',
                }}>
                  {s.label.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Menu */}
      <div style={{
        padding: `16px ${padding} 100px`,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        {menuItems.map((item, i) => (
          <RevealOnEnter key={i} delay={i * 80}>
            <div
              className="interactive card-hover"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                background: 'var(--ice-white)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-soft)',
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: `${item.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: item.color,
              }}>
                {item.icon}
              </div>
              <div style={{ flex: 1, fontSize: '14px', fontWeight: 500, color: 'var(--deep-ink)' }}>
                {item.label}
              </div>
              <div style={{
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--frost-4)',
              }}>
                {item.count}
              </div>
              <Icon.Chevron size={14} color="var(--frost-3)" />
            </div>
          </RevealOnEnter>
        ))}

        {/* Team members */}
        <div style={{
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--deep-ink)',
          fontFamily: 'var(--font-display)',
          marginTop: '12px',
          marginBottom: '4px',
        }}>
          考察队成员
        </div>

        {[
          { name: '陈景明', role: '钻探工程师', status: 'online' },
          { name: '林雨桐', role: '冰川化学家', status: 'online' },
          { name: '王海峰', role: '设备维护', status: 'offline' },
        ].map((member, i) => (
          <RevealOnEnter key={i} delay={400 + i * 80}>
            <div
              className="interactive card-hover"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                background: 'var(--ice-white)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-soft)',
                cursor: 'pointer',
              }}
            >
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7A98A3 0%, #33505C 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-display)',
                }}>
                  {member.name.slice(0, 1)}
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: member.status === 'online' ? '#1F8A5B' : 'var(--frost-3)',
                  border: '2px solid var(--ice-white)',
                }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--deep-ink)' }}>
                  {member.name}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--frost-4)', marginTop: '1px' }}>
                  {member.role}
                </div>
              </div>
              <Icon.Chevron size={14} color="var(--frost-3)" />
            </div>
          </RevealOnEnter>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// DESIGN SPEC PAGE — 设计规范
// ============================================================
function DesignSpecPage({ t }) {
  const padding = t.density === 'compact' ? '12px' : t.density === 'comfy' ? '20px' : '16px';

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflowY: 'auto',
      background: 'var(--ice-white)',
    }}>
      <div style={{
        padding: `calc(var(--ios-safe-top) + 50px) ${padding} 40px`,
      }}>
        <div style={{
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--signal-orange)',
          letterSpacing: '2px',
          textTransform: 'uppercase',
        }}>
          DESIGN SYSTEM
        </div>
        <div style={{
          fontSize: '24px',
          fontWeight: 700,
          fontFamily: 'var(--font-display)',
          color: 'var(--deep-ink)',
          marginTop: '4px',
        }}>
          冰芯档案设计规范
        </div>
        <div style={{
          fontSize: '12px',
          color: 'var(--steel-teal)',
          marginTop: '6px',
          lineHeight: 1.6,
        }}>
          Icecore Atlas Design System v2.0
          <br />
          极地科考仪器质感 · 冷色调基底 · 信号橙高亮
        </div>

        {/* Color Palette */}
        <SpecSection title="色彩体系" subtitle="COLOR PALETTE">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              { name: 'Ice White', hex: '#F0F4F6', desc: '背景底色', dark: false },
              { name: 'Steel Teal', hex: '#33505C', desc: '主色/次级文字', dark: true },
              { name: 'Signal Orange', hex: '#FF7A1A', desc: '强调色/状态', dark: true },
              { name: 'Deep Ink', hex: '#16232B', desc: '深色/正文', dark: true },
            ].map(color => (
              <div key={color.name} style={{
                background: color.hex,
                borderRadius: '12px',
                padding: '14px',
                color: color.dark ? '#fff' : 'var(--deep-ink)',
                boxShadow: 'var(--shadow-soft)',
                position: 'relative',
                overflow: 'hidden',
              }} className="card-hover interactive">
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent 60%)`,
                  pointerEvents: 'none',
                }} />
                <div style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-display)' }}>{color.name}</div>
                <div style={{
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  opacity: 0.7,
                  marginTop: '4px',
                }}>{color.hex}</div>
                <div style={{
                  fontSize: '10px',
                  marginTop: '2px',
                  opacity: 0.6,
                }}>{color.desc}</div>
              </div>
            ))}
          </div>
        </SpecSection>

        {/* Typography */}
        <SpecSection title="字体系统" subtitle="TYPOGRAPHY">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              padding: '14px',
              background: 'var(--frost-1)',
              borderRadius: '12px',
            }}>
              <div style={{
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--steel-teal)',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}>Display · Space Grotesk</div>
              <div style={{
                fontSize: '32px',
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
                color: 'var(--deep-ink)',
                marginTop: '4px',
              }}>Icecore 123</div>
            </div>
            <div style={{
              padding: '14px',
              background: 'var(--frost-1)',
              borderRadius: '12px',
            }}>
              <div style={{
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--steel-teal)',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}>Body · Noto Sans SC</div>
              <div style={{
                fontSize: '14px',
                color: 'var(--deep-ink)',
                marginTop: '4px',
                lineHeight: 1.6,
              }}>
                极地冰芯科考队员的移动工作平台，用于记录、分析和归档冰芯样本数据。
              </div>
            </div>
            <div style={{
              padding: '14px',
              background: 'var(--frost-1)',
              borderRadius: '12px',
            }}>
              <div style={{
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--steel-teal)',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}>Mono · JetBrains Mono</div>
              <div style={{
                fontSize: '13px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--signal-orange)',
                marginTop: '4px',
              }}>
                CORE-07-G · 1358.4m · 73.6%
              </div>
            </div>
          </div>
        </SpecSection>

        {/* Components */}
        <SpecSection title="组件库" subtitle="COMPONENTS">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{
              padding: '14px',
              background: 'var(--ice-white)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-soft)',
            }}>
              <div style={{ fontSize: '11px', color: 'var(--frost-4)', marginBottom: '10px' }}>按钮 Buttons</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button className="interactive" style={{
                  padding: '8px 16px',
                  background: 'var(--signal-orange)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-display)',
                }}>主按钮</button>
                <button className="interactive" style={{
                  padding: '8px 16px',
                  background: 'var(--frost-1)',
                  color: 'var(--deep-ink)',
                  border: '1px solid var(--frost-2)',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-display)',
                }}>次按钮</button>
                <button className="interactive" style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  color: 'var(--signal-orange)',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-display)',
                }}>文字按钮</button>
              </div>
            </div>

            <div style={{
              padding: '14px',
              background: 'var(--ice-white)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-soft)',
            }}>
              <div style={{ fontSize: '11px', color: 'var(--frost-4)', marginBottom: '10px' }}>标签 Chips</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {['全部', '已分析', '分析中', '已入库'].map((label, i) => (
                  <div key={label} style={{
                    padding: '5px 12px',
                    borderRadius: '12px',
                    background: i === 1 ? 'var(--signal-orange)' : 'var(--frost-1)',
                    color: i === 1 ? '#fff' : 'var(--steel-teal)',
                    fontSize: '11px',
                    fontWeight: 500,
                    fontFamily: 'var(--font-display)',
                  }}>
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              padding: '14px',
              background: 'var(--ice-white)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-soft)',
            }}>
              <div style={{ fontSize: '11px', color: 'var(--frost-4)', marginBottom: '10px' }}>卡片 Cards</div>
              <div
                className="card-hover interactive"
                style={{
                  padding: '12px',
                  background: 'var(--frost-1)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'var(--signal-orange)',
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--deep-ink)' }}>卡片标题</div>
                  <div style={{ fontSize: '11px', color: 'var(--frost-4)' }}>辅助描述文字</div>
                </div>
              </div>
            </div>
          </div>
        </SpecSection>

        {/* Motion */}
        <SpecSection title="动效系统" subtitle="MOTION SYSTEM">
          <div style={{
            padding: '14px',
            background: 'var(--deep-ink)',
            borderRadius: '12px',
            color: 'var(--ice-white)',
          }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', opacity: 0.6, letterSpacing: '1px' }}>SIGNATURE EFFECTS</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}>
              {[
                { name: '冰芯层理扫描', desc: 'Ice Core Scan' },
                { name: '气泡浮力上浮', desc: 'Bubble Buoyancy' },
                { name: '钻取阻尼推进', desc: 'Damped Drilling' },
                { name: '雪花粒子飘落', desc: 'Snow Particles' },
              ].map(e => (
                <div key={e.name} style={{
                  padding: '10px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>
                  <div style={{ fontSize: '12px', fontWeight: 500 }}>{e.name}</div>
                  <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', opacity: 0.5, marginTop: '2px' }}>{e.desc}</div>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: '14px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              opacity: 0.5,
              lineHeight: 1.8,
            }}>
              Easing: cubic-bezier(0.175, 0.885, 0.32, 1.275) spring<br />
              Physics: Hooke's law · buoyancy · damping<br />
              Supports: prefers-reduced-motion · visibilitychange
            </div>
          </div>
        </SpecSection>
      </div>
    </div>
  );
}

function SpecSection({ title, subtitle, children }) {
  return (
    <div style={{ marginTop: '28px' }}>
      <div style={{
        fontSize: '10px',
        fontFamily: 'var(--font-mono)',
        color: 'var(--signal-orange)',
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
      }}>
        {subtitle}
      </div>
      <div style={{
        fontSize: '17px',
        fontWeight: 700,
        fontFamily: 'var(--font-display)',
        color: 'var(--deep-ink)',
        marginTop: '2px',
        marginBottom: '12px',
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

// ============================================================
// API PAGE — 接口文档
// ============================================================
function ApiPage({ t }) {
  const [activeTab, setActiveTab] = React.useState('endpoints');
  const [selectedEndpoint, setSelectedEndpoint] = React.useState(0);
  const padding = t.density === 'compact' ? '12px' : t.density === 'comfy' ? '20px' : '16px';

  const endpoints = [
    {
      method: 'GET',
      path: '/api/v2/ice/conditions',
      name: '获取当前冰情数据',
      desc: '返回指定站点的实时气象与冰层数据',
      params: [
        { name: 'station_id', type: 'string', required: true, desc: '站点编号' },
        { name: 'depth_range', type: 'string', required: false, desc: '深度范围，如 0-500' },
      ],
      response: `{
  "station": "ELLSWORTH",
  "temperature": -34.2,
  "wind_speed": 18.5,
  "ice_thickness": 1847,
  "visibility": 2.4,
  "timestamp": "2026-08-16T10:30:00Z"
}`,
    },
    {
      method: 'POST',
      path: '/api/v2/drill/record',
      name: '提交钻探记录',
      desc: '上传新的冰芯钻取数据点',
      params: [
        { name: 'core_id', type: 'string', required: true, desc: '冰芯编号' },
        { name: 'depth', type: 'float', required: true, desc: '当前深度 (m)' },
        { name: 'rate', type: 'float', required: false, desc: '钻进速率 (m/h)' },
      ],
      response: `{
  "id": "rec_7x8f2k",
  "core_id": "07-G",
  "depth": 1358.4,
  "status": "recorded",
  "created_at": "2026-08-16T10:32:15Z"
}`,
    },
    {
      method: 'GET',
      path: '/api/v2/samples',
      name: '查询样本列表',
      desc: '按条件检索冰芯样本档案',
      params: [
        { name: 'query', type: 'string', required: false, desc: '搜索关键词' },
        { name: 'status', type: 'enum', required: false, desc: '样本状态' },
        { name: 'page', type: 'int', required: false, desc: '页码，默认 1' },
      ],
      response: `{
  "total": 2847,
  "page": 1,
  "per_page": 20,
  "samples": [
    {
      "id": "ICE-07-G-1284",
      "depth": 1284.3,
      "type": "致密冰",
      "status": "analyzed"
    }
  ]
}`,
    },
    {
      method: 'GET',
      path: '/api/v2/core/{id}/scan',
      name: '冰芯扫描数据',
      desc: '获取指定冰芯的层理扫描结果',
      params: [
        { name: 'id', type: 'string', required: true, desc: '冰芯编号 (路径参数)' },
        { name: 'resolution', type: 'enum', required: false, desc: '分辨率: low/med/high' },
      ],
      response: `{
  "core_id": "07-G",
  "total_depth": 1358.4,
  "layers": [
    { "depth": 1284.3, "type": "致密冰", "density": 0.912 },
    { "depth": 1301.7, "type": "气泡冰", "density": 0.876 }
  ]
}`,
    },
  ];

  const methodColors = {
    GET: { bg: 'rgba(31, 138, 91, 0.15)', color: '#1F8A5B' },
    POST: { bg: 'rgba(255, 122, 26, 0.15)', color: '#FF7A1A' },
    PUT: { bg: 'rgba(42, 111, 219, 0.15)', color: '#2A6FDB' },
    DELETE: { bg: 'rgba(220, 53, 69, 0.15)', color: '#DC3545' },
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflowY: 'auto',
      background: 'var(--deep-ink)',
      color: 'var(--ice-white)',
    }}>
      <div style={{
        padding: `calc(var(--ios-safe-top) + 50px) ${padding} 40px`,
      }}>
        <div style={{
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--signal-orange)',
          letterSpacing: '2px',
          textTransform: 'uppercase',
        }}>
          API REFERENCE
        </div>
        <div style={{
          fontSize: '24px',
          fontWeight: 700,
          fontFamily: 'var(--font-display)',
          marginTop: '4px',
        }}>
          接口文档 v2.0
        </div>
        <div style={{
          fontSize: '11px',
          color: 'var(--frost-4)',
          marginTop: '6px',
          fontFamily: 'var(--font-mono)',
        }}>
          Base URL: api.icecore-atlas.com
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '4px',
          marginTop: '20px',
          padding: '4px',
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '10px',
        }}>
          {['endpoints', 'auth', 'errors'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="tab interactive"
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab ? 'var(--signal-orange)' : 'transparent',
                color: activeTab === tab ? '#fff' : 'var(--frost-3)',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
                transition: 'all 0.2s ease',
              }}
            >
              {tab === 'endpoints' ? '接口列表' : tab === 'auth' ? '鉴权' : '错误码'}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'endpoints' && (
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {endpoints.map((ep, i) => {
              const mc = methodColors[ep.method];
              const isExpanded = selectedEndpoint === i;
              return (
                <div
                  key={i}
                  className="interactive card-hover"
                  onClick={() => setSelectedEndpoint(isExpanded ? -1 : i)}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <div style={{
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      background: mc.bg,
                      color: mc.color,
                      fontSize: '10px',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.5px',
                    }}>
                      {ep.method}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '12px',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--ice-white)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {ep.path}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--frost-4)', marginTop: '2px' }}>
                        {ep.name}
                      </div>
                    </div>
                    <Icon.Chevron size={14} color="var(--frost-4)" dir={isExpanded ? 'up' : 'down'} />
                  </div>

                  {isExpanded && (
                    <div style={{
                      padding: '0 14px 14px',
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                      paddingTop: '12px',
                    }}>
                      <div style={{ fontSize: '11px', color: 'var(--frost-3)', marginBottom: '8px' }}>
                        {ep.desc}
                      </div>
                      <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--signal-orange)', marginBottom: '6px', letterSpacing: '1px' }}>
                        PARAMETERS
                      </div>
                      {ep.params.map(p => (
                        <div key={p.name} style={{
                          display: 'flex',
                          gap: '8px',
                          padding: '6px 0',
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          fontSize: '11px',
                        }}>
                          <span style={{
                            color: p.required ? '#FF7A1A' : 'var(--frost-3)',
                            fontFamily: 'var(--font-mono)',
                            minWidth: '80px',
                          }}>
                            {p.name}
                          </span>
                          <span style={{ color: 'var(--frost-4)', fontFamily: 'var(--font-mono)', minWidth: '50px' }}>
                            {p.type}
                          </span>
                          <span style={{ color: 'var(--frost-3)', flex: 1 }}>
                            {p.desc}
                          </span>
                        </div>
                      ))}
                      <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--signal-orange)', marginTop: '12px', marginBottom: '6px', letterSpacing: '1px' }}>
                        RESPONSE
                      </div>
                      <pre style={{
                        margin: 0,
                        padding: '10px',
                        background: 'rgba(0,0,0,0.3)',
                        borderRadius: '8px',
                        fontSize: '10px',
                        fontFamily: 'var(--font-mono)',
                        color: '#A9BDC4',
                        overflowX: 'auto',
                        lineHeight: 1.5,
                      }}>
                        {ep.response}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'auth' && (
          <div style={{ marginTop: '16px' }}>
            <div style={{
              padding: '16px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
            }}>
              <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                Bearer Token 鉴权
              </div>
              <div style={{ fontSize: '12px', color: 'var(--frost-3)', lineHeight: 1.6 }}>
                所有 API 请求需在 HTTP Header 中携带 Authorization 字段：
              </div>
              <pre style={{
                marginTop: '12px',
                padding: '10px',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '8px',
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                color: '#A9BDC4',
                overflowX: 'auto',
              }}>
{`Authorization: Bearer <your-token>
X-Station-ID: ELLSWORTH`}
              </pre>
            </div>

            <div style={{
              marginTop: '12px',
              padding: '16px',
              background: 'rgba(255, 122, 26, 0.08)',
              border: '1px solid rgba(255, 122, 26, 0.2)',
              borderRadius: '12px',
            }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#FF7A1A', marginBottom: '6px' }}>
                注意
              </div>
              <div style={{ fontSize: '11px', color: 'var(--frost-3)', lineHeight: 1.6 }}>
                Token 有效期 24 小时，过期请调用 /auth/refresh 接口刷新。
                科考站点的设备 token 权限受地理围栏限制。
              </div>
            </div>
          </div>
        )}

        {activeTab === 'errors' && (
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { code: 200, status: 'OK', desc: '请求成功' },
              { code: 201, status: 'Created', desc: '资源创建成功' },
              { code: 400, status: 'Bad Request', desc: '请求参数错误' },
              { code: 401, status: 'Unauthorized', desc: '未授权或 token 过期' },
              { code: 403, status: 'Forbidden', desc: '无权限访问该资源' },
              { code: 404, status: 'Not Found', desc: '资源不存在' },
              { code: 429, status: 'Too Many Requests', desc: '请求过于频繁' },
              { code: 500, status: 'Internal Server Error', desc: '服务器内部错误' },
            ].map(err => (
              <div key={err.code} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.06)',
              }} className="card-hover interactive">
                <span style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  color: err.code < 300 ? '#1F8A5B' : err.code < 500 ? '#FF7A1A' : '#DC3545',
                  minWidth: '40px',
                }}>
                  {err.code}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 500 }}>{err.status}</div>
                  <div style={{ fontSize: '11px', color: 'var(--frost-4)', marginTop: '1px' }}>{err.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Extra CSS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  @keyframes pulseDot {
    0% { transform: scale(1); opacity: 0.5; }
    100% { transform: scale(2.5); opacity: 0; }
  }
  @keyframes pulseRing {
    0% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.15); opacity: 0.3; }
    100% { transform: scale(1); opacity: 0.8; }
  }
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes sheenSweep {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(1000%); }
  }
`;
document.head.appendChild(styleSheet);
