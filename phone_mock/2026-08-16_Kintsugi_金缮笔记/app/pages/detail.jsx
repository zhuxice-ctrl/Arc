// 器物详情页 — 裂纹金线进度可视化
function DetailPage({ relicId, onBack }) {
  const relic = KIN_DATA.relics.find(r => r.id === relicId);
  const logs = KIN_DATA.logs[relicId] || [];
  const crackPaths = CRACK_PATHS[relicId] || [];
  const svgRef = useRef(null);
  const reduced = useReducedMotion();
  const [activeTab, setActiveTab] = useState('overview'); // overview / logs

  // 金线描金动画
  useEffect(() => {
    if (reduced) return;
    const svg = svgRef.current;
    if (!svg) return;
    const paths = svg.querySelectorAll('path.crack-path');
    if (!paths.length) return;

    // 按进度决定画多少条
    const progressCount = Math.max(1, Math.ceil(paths.length * (relic.progress / 100)));
    const visiblePaths = Array.from(paths).slice(0, progressCount);

    const timer = setTimeout(() => {
      kintsugiDrawSequence(visiblePaths, { stagger: 500, duration: 1800 });
    }, 400);
    return () => clearTimeout(timer);
  }, [relicId, reduced, relic.progress]);

  if (!relic) return null;

  const stageText = {
    early: '初期修复',
    middle: '中期金継',
    final: '仕上げ',
    done: '完 成',
  }[relic.stage];

  return (
    <div style={{ paddingBottom: 80 }}>
      <KinTopBar
        title={relic.name}
        subtitle={relic.furigana}
        onBack={onBack}
        rightSlot={
          <button
            data-cursor="hover"
            style={{
              width: 36, height: 36, borderRadius: '50%',
              border: '1px solid rgba(212,160,23,0.2)',
              background: 'rgba(212,160,23,0.06)',
              color: 'var(--kin-gold)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>
        }
      />

      {/* 主视觉：器物 + 金线 */}
      <div style={{ padding: '8px 20px 16px' }}>
        <div style={{
          position: 'relative',
          borderRadius: 20,
          aspectRatio: '1 / 1',
          background: `radial-gradient(ellipse at 40% 35%, #1e1b18 0%, #0E0E10 70%)`,
          border: '1px solid rgba(212,160,23,0.2)',
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}>
          {/* 器物轮廓（大号 SVG） */}
          <svg ref={svgRef} viewBox="0 0 380 380" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
            {/* 器物主体阴影 */}
            <defs>
              <radialGradient id="vesselGrad" cx="40%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#3d362e" />
                <stop offset="60%" stopColor="#1a1714" />
                <stop offset="100%" stopColor="#0d0c0a" />
              </radialGradient>
              <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 不同器物不同外形 */}
            {relic.image === 'celadon' && (
              <ellipse cx="190" cy="200" rx="150" ry="120" fill="url(#vesselGrad)" />
            )}
            {relic.image === 'hagi' && (
              <path d="M80 240 Q70 120 190 90 Q310 120 300 240 Q300 300 190 310 Q80 300 80 240 Z" fill="url(#vesselGrad)" />
            )}
            {relic.image === 'kutani' && (
              <circle cx="190" cy="190" r="140" fill="url(#vesselGrad)" />
            )}
            {relic.image === 'bizen' && (
              <path d="M70 230 Q80 110 190 90 Q300 110 310 230 Q310 290 190 300 Q70 290 70 230 Z" fill="url(#vesselGrad)" />
            )}

            {/* 裂纹金线 */}
            <g filter="url(#goldGlow)">
              {crackPaths.map((d, i) => (
                <path
                  key={i}
                  className="crack-path"
                  d={d}
                  stroke="#D4A017"
                  strokeWidth={i === 0 ? 2.2 : 1.4}
                  fill="none"
                  strokeLinecap="round"
                />
              ))}
            </g>

            {/* 金粉点缀 */}
            {crackPaths.map((d, i) => {
              // 在路径中点放一个亮金点
              if (i > 2) return null;
              return (
                <circle key={`dot-${i}`} cx={100 + i * 80} cy={160 + (i % 2) * 40} r="2"
                  fill="#ffe28a" style={{
                    animation: `kinPulseGold 2s ease-in-out ${i * 0.5}s infinite`,
                  }}
                />
              );
            })}
          </svg>

          {/* 进度环 */}
          <div style={{
            position: 'absolute', top: 16, right: 16,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 2,
          }}>
            <ProgressRing progress={relic.progress} size={64} strokeWidth={4} />
          </div>

          {/* 阶段标签 */}
          <div style={{
            position: 'absolute', bottom: 16, left: 16,
          }}>
            <KinChip size="md" variant="solid">{stageText}</KinChip>
          </div>
          <div style={{
            position: 'absolute', bottom: 16, right: 16,
            fontSize: 10, color: 'var(--kin-sabi)', letterSpacing: '0.1em',
          }}>
            {relic.material}
          </div>
        </div>
      </div>

      {/* 基本信息 */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{
          fontSize: 12, color: 'var(--kin-sabi)',
          letterSpacing: '0.15em', marginBottom: 8,
        }}>由 来</div>
        <div style={{
          fontFamily: "'Noto Serif JP', serif",
          fontSize: 15, color: 'var(--kin-gofun)',
          lineHeight: 1.8, letterSpacing: '0.05em',
        }}>{relic.origin}</div>
      </div>

      {/* Tab 切换 */}
      <div style={{
        padding: '0 20px', display: 'flex', gap: 4,
        borderBottom: '1px solid rgba(212,160,23,0.1)',
        marginBottom: 16,
      }}>
        {[
          { key: 'overview', label: '詳 細' },
          { key: 'logs', label: '修復記録' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            data-cursor="hover"
            className="kin-tab"
            style={{
              padding: '10px 16px',
              background: 'none', border: 'none',
              color: activeTab === tab.key ? 'var(--kin-gold)' : 'var(--kin-sabi)',
              fontSize: 13, fontWeight: activeTab === tab.key ? 600 : 400,
              letterSpacing: '0.15em',
              cursor: 'pointer',
              position: 'relative',
              fontFamily: "'Noto Sans JP', sans-serif",
            }}
          >
            {tab.label}
            {activeTab === tab.key && (
              <div style={{
                position: 'absolute', bottom: -1, left: 16, right: 16,
                height: 2, background: 'var(--kin-gold)',
                boxShadow: '0 0 6px var(--kin-gold)',
                borderRadius: 2,
              }} />
            )}
          </button>
        ))}
      </div>

      {/* Tab 内容 */}
      {activeTab === 'overview' && (
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <InfoBlock title="器 の 状 態">
            <div style={{ fontSize: 13, lineHeight: 1.9, color: 'var(--kin-gofun-2)', letterSpacing: '0.04em' }}>
              {relic.description}
            </div>
          </InfoBlock>

          <InfoBlock title="修 復 メ モ">
            <div style={{
              fontSize: 13, lineHeight: 1.9,
              color: 'var(--kin-gofun-2)',
              fontStyle: 'italic',
              letterSpacing: '0.04em',
              borderLeft: '2px solid var(--kin-gold)',
              paddingLeft: 12,
            }}>
              「{relic.emotion}」
            </div>
          </InfoBlock>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <InfoStat label="破損日" value={relic.crackedAt} />
            <InfoStat label="開始日" value={relic.startedAt} />
            <InfoStat label="ひび数" value={`${relic.crackCount} 本`} />
            <InfoStat label="破片数" value={`${relic.fragments} 片`} />
          </div>

          <div style={{ paddingTop: 4 }}>
            <KinButton fullWidth variant="primary" icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            }>修復記録を追加</KinButton>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div style={{ padding: '0 20px 20px' }}>
          <TimelineMini logs={logs} compact />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 进度环
// ─────────────────────────────────────────────────────────────
function ProgressRing({ progress, size = 64, strokeWidth = 4 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  const reduced = useReducedMotion();
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (reduced) {
      setDisplayProgress(progress);
      return;
    }
    const startTime = performance.now();
    let rafId;
    function tick(now) {
      const t = Math.min(1, (now - startTime) / 1200);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayProgress(progress * eased);
      if (t < 1) rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [progress, reduced]);

  const animatedOffset = circumference - (displayProgress / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(212,160,23,0.15)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#D4A017"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={animatedOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ filter: 'drop-shadow(0 0 4px rgba(212,160,23,0.6))' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column',
      }}>
        <span style={{
          fontFamily: "'Shippori Mincho', serif",
          fontSize: 14, fontWeight: 700,
          color: 'var(--kin-gold)',
          lineHeight: 1,
        }}>{Math.round(displayProgress)}%</span>
      </div>
    </div>
  );
}

function InfoBlock({ title, children }) {
  return (
    <div>
      <div style={{
        fontSize: 10, color: 'var(--kin-gold)',
        letterSpacing: '0.3em', marginBottom: 8,
      }}>{title}</div>
      {children}
    </div>
  );
}

function InfoStat({ label, value }) {
  return (
    <div style={{
      background: 'rgba(24,23,26,0.6)',
      border: '1px solid rgba(212,160,23,0.1)',
      borderRadius: 10,
      padding: '12px 14px',
    }}>
      <div style={{
        fontSize: 10, color: 'var(--kin-sabi)',
        letterSpacing: '0.2em', marginBottom: 6,
      }}>{label}</div>
      <div style={{
        fontSize: 13, color: 'var(--kin-gofun)',
        fontWeight: 500,
      }}>{value}</div>
    </div>
  );
}

// 迷你时间轴（详情页用）
function TimelineMini({ logs, compact = false }) {
  const typeColors = {
    join: '#6e6658',
    fill: '#8a6808',
    urushi: '#b2422a',
    line: '#D4A017',
    gold: '#D4A017',
    polish: '#b58e76',
    done: '#D4A017',
  };
  return (
    <div style={{ position: 'relative', paddingLeft: 20 }}>
      {/* 竖线 */}
      <div style={{
        position: 'absolute', left: 6, top: 8, bottom: 8,
        width: 1,
        background: 'linear-gradient(180deg, rgba(212,160,23,0.4), rgba(212,160,23,0.05))',
      }} />
      {logs.map((log, i) => (
        <div key={i} style={{
          position: 'relative',
          paddingBottom: compact ? 14 : 18,
          animation: `kinFadeInUp 400ms ease ${i * 60}ms both`,
        }}>
          {/* 节点 */}
          <div style={{
            position: 'absolute', left: -17, top: 4,
            width: 10, height: 10, borderRadius: '50%',
            background: typeColors[log.type] || '#D4A017',
            border: '2px solid var(--kin-urushi)',
            boxShadow: `0 0 6px ${typeColors[log.type] || '#D4A017'}`,
          }} />
          <div style={{
            fontSize: 10, color: 'var(--kin-sabi)',
            letterSpacing: '0.1em', marginBottom: 3,
          }}>{log.date}</div>
          <div style={{
            fontSize: 13, fontWeight: 500,
            color: 'var(--kin-gofun)', marginBottom: 3,
          }}>{log.title}</div>
          {!compact && (
            <div style={{
              fontSize: 12, color: 'var(--kin-gofun-2)',
              lineHeight: 1.7,
            }}>{log.detail}</div>
          )}
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { DetailPage, ProgressRing, TimelineMini });
