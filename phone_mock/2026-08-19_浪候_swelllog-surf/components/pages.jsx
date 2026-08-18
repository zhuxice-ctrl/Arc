// ===== SURF APP PAGES: 浪候 / SWELLLOG =====
// 6 pages: 浪报首页, 浪点详情, 记一笔(弹层), 我的浪账, 设计规范, 接口文档

const { useRef, useEffect, useState, useCallback } = React;

// ===== 1. 浪报首页 =====
function HomePage({ theme, onNavigate, onSpotClick }) {
  const primarySpot = SURF_SPOTS[0]; // 日月湾 as default
  const avgSuitability = HOURLY_FORECAST.reduce((s, h) => s + h.suitability, 0) / HOURLY_FORECAST.length;

  return (
    <div className="page-scroll" style={{
      height: '100%',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    }}>
      {/* Header */}
      <div style={{
        padding: 'calc(var(--ios-safe-top) + 12px) 20px 8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div className="cursor-hover" style={{ cursor: 'pointer' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>
            当前位置
          </div>
          <div style={{ 
            fontSize: 17, 
            fontWeight: 600, 
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {primarySpot.location}
          </div>
        </div>
        <div style={{
          width: 40, height: 40,
          borderRadius: '50%',
          background: 'var(--bg-card)',
          border: '1.5px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--secondary)',
          cursor: 'pointer',
        }} className="avatar cursor-hover" onClick={() => onNavigate('log')}>
          {USER_STATS.avatar}
        </div>
      </div>

      {/* TODAY'S WAVE REPORT - HERO */}
      <div style={{ padding: '8px 20px 20px' }}>
        <div style={{
          background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-surface) 100%)',
          borderRadius: 20,
          padding: '20px 20px 16px',
          border: '1px solid var(--border)',
          position: 'relative',
          overflow: 'hidden',
        }} className="hero-card cursor-hover">
          
          {/* Decorative waves */}
          <div style={{
            position: 'absolute',
            bottom: -10,
            left: -20,
            right: -20,
            opacity: 0.08,
          }}>
            <WaveIcon width={400} height={60} color="var(--accent)" animated={true} />
          </div>

          <div style={{ position: 'relative' }}>
            {/* Top row: spot + suitability */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>今日浪报 · {primarySpot.name}</span>
              <SuitabilityLabel level={primarySpot.suitable} />
            </div>

            {/* Big wave height */}
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 4,
              marginBottom: 4,
            }}>
              <span style={{
                fontSize: 64,
                fontWeight: 300,
                color: 'var(--text-primary)',
                lineHeight: 1,
                letterSpacing: -2,
                fontFamily: "'JetBrains Mono', monospace",
                fontVariantNumeric: 'tabular-nums',
              }} className="wave-height-num">
                {primarySpot.waveHeight.min}
              </span>
              <span style={{
                fontSize: 24,
                fontWeight: 300,
                color: 'var(--text-muted)',
                lineHeight: 1,
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                ~{primarySpot.waveHeight.max}
              </span>
              <span style={{
                fontSize: 14,
                color: 'var(--text-muted)',
                marginLeft: 4,
              }}>
                米
              </span>
            </div>

            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
              周期 {primarySpot.period}s · {primarySpot.windDir} {primarySpot.windSpeed}km/h · {primarySpot.tide}
            </div>

            {/* Best window + action */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>最佳窗口</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--accent)', fontFamily: "'JetBrains Mono', monospace" }}>
                  {primarySpot.bestWindow}
                </div>
              </div>
              <button
                onClick={() => onSpotClick(primarySpot.id)}
                style={{
                  padding: '10px 18px',
                  background: 'var(--accent)',
                  border: 'none',
                  borderRadius: 20,
                  color: 'var(--bg)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }} className="btn-primary cursor-hover">
                查看详情
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tidal curve mini preview */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
            潮汐曲线
          </span>
          <span 
            style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}
            className="cursor-hover"
            onClick={() => onSpotClick(primarySpot.id)}
          >
            拖动查看 →
          </span>
        </div>
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: 12,
          padding: '12px 4px 8px',
          border: '1px solid var(--border)',
        }}>
          <TidalCurve
            tideData={TIDE_CURVE}
            hourlyData={HOURLY_FORECAST}
            currentHour={new Date().getHours()}
            width={312}
            height={110}
            theme={`${theme}-mini`}
            interactive={false}
            compact={true}
          />
        </div>
      </div>

      {/* Nearby spots */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
            附近浪点
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {SURF_SPOTS.length} 个
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SURF_SPOTS.map((spot) => (
            <div
              key={spot.id}
              onClick={() => onSpotClick(spot.id)}
              style={{
                background: 'var(--bg-card)',
                borderRadius: 14,
                padding: 14,
                border: '1px solid var(--border)',
                cursor: 'pointer',
                display: 'flex',
                gap: 12,
                alignItems: 'center',
              }} className="spot-card cursor-hover">
              {/* Wave indicator */}
              <div style={{
                width: 48, height: 48,
                borderRadius: 12,
                background: spot.suitable === 'good' ? 'var(--accent)' :
                           spot.suitable === 'suitable' ? 'var(--secondary)' : 'var(--chip-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                position: 'relative',
                overflow: 'hidden',
              }}>
                <WaveIcon width={36} height={24} color={spot.suitable === 'poor' ? 'var(--text-muted)' : 'var(--bg)'} animated={spot.suitable !== 'poor'} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 2,
                }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {spot.name}
                  </span>
                  <SuitabilityLabel level={spot.suitable} />
                </div>
                <div style={{
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  display: 'flex',
                  gap: 10,
                  alignItems: 'center',
                }}>
                  <span>{spot.waveHeight.min}-{spot.waveHeight.max}m</span>
                  <span>·</span>
                  <span>{spot.period}s</span>
                  <span>·</span>
                  <span>{spot.distance}km</span>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flexShrink: 0,
              }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{
                    fontSize: 12,
                    color: i < spot.rating ? 'var(--accent)' : 'var(--border)',
                  }}>★</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick log button */}
      <div style={{ padding: '0 20px 32px' }}>
        <button
          onClick={() => onNavigate('logSheet')}
          style={{
            width: '100%',
            padding: '16px 20px',
            background: 'var(--bg-card)',
            border: '1px solid var(--accent)',
            borderRadius: 14,
            color: 'var(--accent)',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }} className="btn-log cursor-hover">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          记一笔出浪
        </button>
      </div>
    </div>
  );
}

// ===== 2. 浪点详情 =====
function SpotDetailPage({ spotId, onBack, onLog }) {
  const spot = SURF_SPOTS.find(s => s.id === spotId) || SURF_SPOTS[0];
  const [cursorHour, setCursorHour] = useState(8);
  const [cursorData, setCursorData] = useState(HOURLY_FORECAST[8]);
  const [tab, setTab] = useState('tide'); // tide / wind / swell

  const handleCursorChange = useCallback((hour, data) => {
    setCursorHour(hour);
    if (data) setCursorData(data);
  }, []);

  return (
    <div className="page-scroll" style={{
      height: '100%',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    }}>
      {/* Header */}
      <div style={{
        padding: 'calc(var(--ios-safe-top) + 8px) 20px 12px',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 12,
        }}>
          <button
            onClick={onBack}
            style={{
              width: 36, height: 36,
              borderRadius: '50%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }} className="cursor-hover">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{spot.location}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{spot.name}</div>
          </div>
          <SuitabilityLabel level={spot.suitable} />
        </div>

        {/* Key stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 8,
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
              {spot.waveHeight.min}-{spot.waveHeight.max}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>浪高 m</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
              {spot.period}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>周期 s</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
              {spot.windSpeed}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>风速 km/h</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
              {spot.distance}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>距离 km</div>
          </div>
        </div>
      </div>

      {/* Signature: Tidal curve with draggable cursor */}
      <div style={{ padding: '20px 12px 8px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
          padding: '0 8px',
        }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>潮汐曲线</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>拖动游标查看逐时</span>
        </div>
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: 16,
          padding: '16px 4px 12px',
          border: '1px solid var(--border)',
        }}>
          <TidalCurve
            tideData={TIDE_CURVE}
            hourlyData={HOURLY_FORECAST}
            currentHour={cursorHour}
            width={340}
            height={200}
            theme={`${spotId}-detail`}
            onCursorChange={handleCursorChange}
            interactive={true}
            compact={false}
          />
        </div>
      </div>

      {/* Real-time data from cursor */}
      <div style={{ padding: '8px 20px 16px' }}>
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 12,
          padding: 14,
          border: '1px solid var(--border)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}>
            <span style={{ 
              fontSize: 14, 
              fontWeight: 600, 
              color: 'var(--text-primary)',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {String(Math.floor(cursorHour)).padStart(2,'0')}:{String(Math.round((cursorHour % 1) * 60)).padStart(2,'0')} 逐时预报
            </span>
            <span style={{
              fontSize: 12,
              color: cursorData && cursorData.suitability >= 7 ? 'var(--accent)' : 'var(--text-secondary)',
              fontWeight: 600,
            }}>
              适宜度 {cursorData?.suitability || '-'}
            </span>
          </div>
          <SuitabilityBar value={cursorData?.suitability || 5} />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 8,
            marginTop: 12,
          }}>
            <div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>浪高</div>
              <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
                {cursorData?.waveHeight || '-'}m
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>周期</div>
              <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
                {cursorData?.period || '-'}s
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>潮位</div>
              <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
                {cursorData?.tide?.toFixed(1) || '-'}m
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: 风 / 涌 */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{
          display: 'flex',
          background: 'var(--bg-card)',
          borderRadius: 10,
          padding: 4,
          marginBottom: 12,
          border: '1px solid var(--border)',
        }}>
          {[
            { id: 'tide', label: '逐时潮汐' },
            { id: 'wind', label: '风向' },
            { id: 'swell', label: '涌向' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1,
                padding: '8px 12px',
                background: tab === t.id ? 'var(--accent)' : 'transparent',
                border: 'none',
                borderRadius: 8,
                color: tab === t.id ? 'var(--bg)' : 'var(--text-secondary)',
                fontSize: 12,
                fontWeight: tab === t.id ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }} className="tab-inner cursor-hover">
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'tide' && (
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 12,
            border: '1px solid var(--border)',
            overflow: 'hidden',
          }}>
            {HOURLY_FORECAST.filter((_, i) => i % 2 === 0).map((h, idx, arr) => (
              <div key={h.hour} style={{
                padding: '10px 14px',
                borderBottom: idx < arr.length - 1 ? '1px solid var(--divider)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }} className="hourly-row cursor-hover">
                <span style={{
                  fontSize: 13,
                  color: 'var(--text-primary)',
                  fontFamily: "'JetBrains Mono', monospace",
                  width: 48,
                  flexShrink: 0,
                }}>
                  {h.time}
                </span>
                <WaveIcon width={30} height={18} color="var(--secondary)" animated={false} />
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1 }}>
                  {h.waveHeight}m · {h.period}s
                </span>
                <SuitabilityBar value={h.suitability} height={4} />
                <span style={{
                  fontSize: 11,
                  color: h.suitability >= 7 ? 'var(--accent)' : 'var(--text-muted)',
                  fontWeight: 600,
                  width: 30,
                  textAlign: 'right',
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {h.suitability}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === 'wind' && (
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 12,
            padding: 20,
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}>
            {/* Wind compass */}
            <div style={{
              width: 160, height: 160,
              borderRadius: '50%',
              border: '1px solid var(--border)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                position: 'absolute',
                top: 8,
                fontSize: 11,
                color: 'var(--text-muted)',
              }}>北</div>
              <div style={{
                position: 'absolute',
                bottom: 8,
                fontSize: 11,
                color: 'var(--text-muted)',
              }}>南</div>
              <div style={{
                position: 'absolute',
                left: 8,
                fontSize: 11,
                color: 'var(--text-muted)',
              }}>西</div>
              <div style={{
                position: 'absolute',
                right: 8,
                fontSize: 11,
                color: 'var(--text-muted)',
              }}>东</div>
              {/* Wind arrow */}
              <div style={{
                position: 'absolute',
                width: 2,
                height: 60,
                background: 'var(--accent)',
                transformOrigin: 'bottom center',
                transform: 'rotate(45deg)',
                top: 20,
                borderRadius: 2,
              }}>
                <div style={{
                  position: 'absolute',
                  top: -6,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '5px solid transparent',
                  borderRight: '5px solid transparent',
                  borderBottom: '8px solid var(--accent)',
                }}></div>
              </div>
              <div style={{
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
                  {spot.windSpeed}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>km/h</div>
              </div>
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              {spot.windDir} · 离岸风有利于保持浪面干净
            </div>
          </div>
        )}

        {tab === 'swell' && (
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 12,
            padding: 16,
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>主涌方向</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>东南涌 SE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>涌浪周期</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>{spot.period}秒</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>浪高范围</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>{spot.waveHeight.min}-{spot.waveHeight.max}m</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, quality: 'var(--text-muted)', color: 'var(--text-muted)' }}>浪型</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
                {spot.features[1]}
              </span>
            </div>
            <div style={{
              marginTop: 8,
              padding: 12,
              background: 'var(--bg-surface)',
              borderRadius: 8,
              fontSize: 12,
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
            }}>
              今日东南涌为主，周期较长，浪形较为厚实。配合东北离岸风，浪面干净，适合进阶练习。
            </div>
          </div>
        )}
      </div>

      {/* Spot features */}
      <div style={{ padding: '0 20px 32px' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 }}>
          浪点特点
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {spot.features.map((f) => (
            <span key={f} style={{
              padding: '5px 12px',
              borderRadius: 16,
              background: 'var(--chip-bg)',
              color: 'var(--text-secondary)',
              fontSize: 12,
            }} className="chip cursor-hover">
              {f}
            </span>
          ))}
        </div>

        <button
          onClick={onLog}
          style={{
            width: '100%',
            marginTop: 20,
            padding: '14px 20px',
            background: 'var(--accent)',
            border: 'none',
            borderRadius: 14,
            color: 'var(--bg)',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }} className="btn-primary cursor-hover">
          记一笔出浪
        </button>
      </div>
    </div>
  );
}

// ===== 3. 记一笔 (Bottom Sheet) =====
function LogSheet({ onClose, onSubmit, defaultSpot = 'wanning' }) {
  const [spotId, setSpotId] = useState(defaultSpot);
  const [boardId, setBoardId] = useState(BOARD_QUIVER[0].id);
  const [timeIn, setTimeIn] = useState('07:00');
  const [timeOut, setTimeOut] = useState('10:30');
  const [waveCount, setWaveCount] = useState(15);
  const [rating, setRating] = useState(4);
  const [notes, setNotes] = useState('');
  const sheetRef = useRef(null);

  const spot = SURF_SPOTS.find(s => s.id === spotId) || SURF_SPOTS[0];
  const board = BOARD_QUIVER.find(b => b.id === boardId) || BOARD_QUIVER[0];

  const handleSubmit = () => {
    const [inH, inM] = timeIn.split(':').map(Number);
    const [outH, outM] = timeOut.split(':').map(Number);
    const duration = (outH * 60 + outM) - (inH * 60 + inM);
    
    const entry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      spot: spot.name,
      spotId,
      timeIn,
      timeOut,
      duration: Math.max(0, duration),
      board: `${board.type} ${board.size.split(' × ')[0]}`,
      boardId,
      waveCount,
      rating,
      selfRating: rating,
      conditions: `${spot.waveHeight.min}-${spot.waveHeight.max}m · ${spot.period}s · ${spot.windDir} ${spot.windSpeed}km/h`,
      notes: notes || '今日感觉不错。',
    };
    onSubmit(entry);
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(0,0,0,0.4)',
      zIndex: 200,
      display: 'flex',
      alignItems: 'flex-end',
      animation: 'fadeIn 0.25s ease',
    }} onClick={onClose}>
      <div
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          background: 'var(--bg-card)',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          border: '1px solid var(--border)',
          borderBottom: 'none',
          padding: '8px 20px calc(var(--ios-safe-bottom) + 20px)',
          maxHeight: '85%',
          overflowY: 'auto',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
        {/* Grabber */}
        <div style={{
          width: 36,
          height: 4,
          borderRadius: 2,
          background: 'var(--border)',
          margin: '0 auto 16px',
        }}></div>

        {/* Title */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>记一笔出浪</span>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28,
              borderRadius: '50%',
              background: 'var(--chip-bg)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
            }} className="cursor-hover">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Spot selector */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>浪点</label>
          <div style={{
            display: 'flex',
            gap: 6,
            flexWrap: 'wrap',
          }}>
            {SURF_SPOTS.map(s => (
              <button
                key={s.id}
                onClick={() => setSpotId(s.id)}
                style={{
                  padding: '6px 12px',
                  background: spotId === s.id ? 'var(--accent)' : 'var(--chip-bg)',
                  border: 'none',
                  borderRadius: 16,
                  color: spotId === s.id ? 'var(--bg)' : 'var(--text-secondary)',
                  fontSize: 12,
                  fontWeight: spotId === s.id ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }} className="cursor-hover">
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Time */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>时间</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <input
                type="time"
                value={timeIn}
                onChange={(e) => setTimeIn(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  color: 'var(--text-primary)',
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              />
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, textAlign: 'center' }}>入水</div>
            </div>
            <div style={{ fontSize: 16, color: 'var(--text-muted)' }}>→</div>
            <div style={{ flex: 1 }}>
              <input
                type="time"
                value={timeOut}
                onChange={(e) => setTimeOut(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  color: 'var(--text-primary)',
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              />
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, textAlign: 'center' }}>出水</div>
            </div>
          </div>
        </div>

        {/* Board selector */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>使用浪板</label>
          <div style={{
            display: 'flex',
            gap: 8,
          }}>
            {BOARD_QUIVER.map(b => (
              <button
                key={b.id}
                onClick={() => setBoardId(b.id)}
                style={{
                  flex: 1,
                  padding: '10px 8px',
                  background: boardId === b.id ? 'var(--bg-surface)' : 'transparent',
                  border: boardId === b.id ? `1.5px solid ${b.color}` : '1px solid var(--border)',
                  borderRadius: 10,
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                }} className="cursor-hover">
                <div style={{
                  width: 24, height: 24,
                  borderRadius: '50%',
                  background: b.color,
                  margin: '0 auto 6px',
                }}></div>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{b.name}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{b.type}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Wave count */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label style={{ fontSize: 12, color: 'var(--text-muted)' }}>抓浪数</label>
            <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--accent)', fontFamily: "'JetBrains Mono', monospace" }}>
              {waveCount} 道
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="60"
            value={waveCount}
            onChange={(e) => setWaveCount(parseInt(e.target.value))}
            style={{
              width: '100%',
              accentColor: 'var(--accent)',
            }}
          />
        </div>

        {/* Rating */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>今日表现</label>
          <div style={{ display: 'flex', gap: 4 }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setRating(s)}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 24,
                  transition: 'transform 0.15s ease',
                }} className="cursor-hover">
                <span style={{ 
                  color: s <= rating ? 'var(--accent)' : 'var(--border)',
                }}>★</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>笔记</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="记录今天的感受..."
            style={{
              width: '100%',
              minHeight: 72,
              padding: '10px 12px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              color: 'var(--text-primary)',
              fontSize: 13,
              resize: 'none',
              fontFamily: 'inherit',
            }}
          ></textarea>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            padding: '14px 20px',
            background: 'var(--accent)',
            border: 'none',
            borderRadius: 14,
            color: 'var(--bg)',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
          }} className="btn-primary cursor-hover">
          保存记录
        </button>
      </div>
    </div>
  );
}

// ===== 4. 我的浪账 =====
function LogPage({ theme, logEntries, onNavigate }) {
  const totalSessions = logEntries.length;
  const totalHours = Math.round(logEntries.reduce((s, e) => s + e.duration, 0) / 60);
  const totalWaves = logEntries.reduce((s, e) => s + (e.waveCount || 0), 0);

  return (
    <div className="page-scroll" style={{
      height: '100%',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    }}>
      {/* Header */}
      <div style={{
        padding: 'calc(var(--ios-safe-top) + 12px) 20px 16px',
        background: 'linear-gradient(180deg, var(--bg-surface) 0%, var(--bg) 100%)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          marginBottom: 20,
        }}>
          <div style={{
            width: 56, height: 56,
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
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
              {USER_STATS.name}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {USER_STATS.level} · 连续出浪 {USER_STATS.streak} 天
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
        }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 12,
            padding: '14px 10px',
            textAlign: 'center',
            border: '1px solid var(--border)',
          }} className="stat-card cursor-hover">
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
              {totalSessions}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>次出浪</div>
          </div>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 12,
            padding: '14px 10px',
            textAlign: 'center',
            border: '1px solid var(--border)',
          }} className="stat-card cursor-hover">
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
              {totalHours}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>小时</div>
          </div>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 12,
            padding: '14px 10px',
            textAlign: 'center',
            border: '1px solid var(--border)',
          }} className="stat-card cursor-hover">
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
              {totalWaves}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>道浪</div>
          </div>
        </div>
      </div>

      {/* 2026 Summary */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 14,
          padding: 16,
          border: '1px solid var(--border)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>2026 年度</span>
            <span style={{ fontSize: 11, color: 'var(--accent)' }} className="cursor-hover">查看详情 →</span>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
                {USER_STATS.year2026.sessions}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>次出浪</div>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
                {USER_STATS.year2026.distance}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>冲浪 km</div>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
                {(USER_STATS.year2026.calories / 1000).toFixed(1)}k
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>卡路里</div>
            </div>
          </div>
        </div>
      </div>

      {/* Board Quiver */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>我的板库</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{BOARD_QUIVER.length} 块</span>
        </div>
        <div style={{
          display: 'flex',
          gap: 10,
          overflowX: 'auto',
          paddingBottom: 4,
        }}>
          {BOARD_QUIVER.map((board) => (
            <div key={board.id} style={{
              minWidth: 160,
              background: 'var(--bg-card)',
              borderRadius: 14,
              padding: 14,
              border: '1px solid var(--border)',
            }} className="board-card cursor-hover">
              <div style={{
                width: '100%',
                height: 50,
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {/* Stylized board shape */}
                <div style={{
                  width: 20,
                  height: 50,
                  background: board.color,
                  borderRadius: '50% 50% 40% 40% / 20% 20% 10% 10%',
                  position: 'relative',
                  opacity: 0.2,
                }}></div>
                <div style={{
                  position: 'absolute',
                  marginTop: 30,
                  fontSize: 10,
                  color: 'var(--text-muted)',
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {board.volume}
                </div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                {board.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>
                {board.size}
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 10,
                color: 'var(--text-muted)',
              }}>
                <span>{board.totalRides} 次使用</span>
                <span style={{ color: board.color }}>{board.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Timeline */}
      <div style={{ padding: '0 20px 32px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>出浪日志</span>
          <button
            onClick={() => onNavigate('logSheet')}
            style={{
              padding: '4px 10px',
              background: 'var(--accent)',
              border: 'none',
              borderRadius: 12,
              color: 'var(--bg)',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }} className="cursor-hover">
            <span style={{ fontSize: 12 }}>+</span> 新增
          </button>
        </div>

        <div style={{ position: 'relative' }}>
          {/* Timeline line */}
          <div style={{
            position: 'absolute',
            left: 7,
            top: 8,
            bottom: 8,
            width: 2,
            background: 'var(--border)',
          }}></div>

          {logEntries.map((entry, idx) => (
            <div key={entry.id} style={{
              position: 'relative',
              paddingLeft: 28,
              paddingBottom: idx < logEntries.length - 1 ? 16 : 0,
            }} className="log-item cursor-hover">
              {/* Timeline dot */}
              <div style={{
                position: 'absolute',
                left: 0,
                top: 6,
                width: 16, height: 16,
                borderRadius: '50%',
                background: 'var(--bg)',
                border: `2px solid ${idx === 0 ? 'var(--accent)' : 'var(--secondary)'}`,
                zIndex: 1,
              }}></div>

              <div style={{
                background: 'var(--bg-card)',
                borderRadius: 12,
                padding: 12,
                border: '1px solid var(--border)',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 4,
                }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {entry.spot}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                    {entry.date}
                  </span>
                </div>
                <div style={{
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  marginBottom: 8,
                  display: 'flex',
                  gap: 10,
                  flexWrap: 'wrap',
                }}>
                  <span>{entry.timeIn}-{entry.timeOut}</span>
                  <span>·</span>
                  <span>{Math.floor(entry.duration / 60)}h{entry.duration % 60}m</span>
                  <span>·</span>
                  <span>{entry.board}</span>
                </div>
                <div style={{
                  fontSize: 11,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  marginBottom: 8,
                }}>
                  {entry.notes}
                </div>
                <div style={{
                  display: 'flex',
                  gap: 12,
                  fontSize: 11,
                  color: 'var(--text-muted)',
                }}>
                  <span>🌊 {entry.waveCount || 0} 道</span>
                  <span>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{ color: i < (entry.rating || 0) ? 'var(--accent)' : 'var(--border)', fontSize: 10 }}>★</span>
                    ))}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== 5. 设计规范页 =====
function DesignSpecPage({ theme, onBack }) {
  return (
    <div className="page-scroll" style={{
      height: '100%',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    }}>
      <div style={{ padding: 'calc(var(--ios-safe-top) + 8px) 20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button
            onClick={onBack}
            style={{
              width: 36, height: 36,
              borderRadius: '50%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }} className="cursor-hover">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>设计规范</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
              浪候 Design System v2.0 · {PALETTES[theme]?.name || '深海'}主题
            </div>
          </div>
        </div>
      </div>

      {/* Signature interaction showcase */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, letterSpacing: 1 }}>
          签名交互
        </div>
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 14,
          padding: 14,
          border: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>
            潮汐曲线游标
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>
            拖动游标可实时查看逐时浪况，带阻尼手感与整点吸附，松手有轻微回弹。
          </div>
          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: 10,
            padding: '8px 2px',
          }}>
            <TidalCurve
              tideData={TIDE_CURVE}
              hourlyData={HOURLY_FORECAST}
              currentHour={10}
              width={280}
              height={130}
              theme={`spec-${theme}`}
              interactive={true}
              compact={false}
            />
          </div>
        </div>
      </div>

      {/* Color system */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, letterSpacing: 1 }}>
          色彩系统
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 8,
        }}>
          {DESIGN_TOKENS.colorSystem.map((token) => (
            <div key={token.name} style={{
              background: 'var(--bg-card)',
              borderRadius: 10,
              overflow: 'hidden',
              border: '1px solid var(--border)',
            }} className="color-token cursor-hover">
              <div style={{
                height: 44,
                background: token.cssVar,
                borderBottom: '1px solid var(--divider)',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute',
                  bottom: 4,
                  right: 6,
                  fontSize: 9,
                  color: 'var(--text-primary)',
                  fontFamily: "'JetBrains Mono', monospace",
                  mixBlendMode: 'difference',
                  opacity: 0.7,
                }}>
                  {token.cssVar}
                </div>
              </div>
              <div style={{ padding: '8px 10px' }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>
                  {token.name}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                  {token.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, letterSpacing: 1 }}>
          字体层级
        </div>
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 12,
          border: '1px solid var(--border)',
          overflow: 'hidden',
        }}>
          {DESIGN_TOKENS.typeScale.map((t, idx, arr) => (
            <div key={t.name} style={{
              padding: '12px 14px',
              borderBottom: idx < arr.length - 1 ? '1px solid var(--divider)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }} className="type-row cursor-hover">
              <span style={{
                fontSize: parseInt(t.size),
                fontWeight: t.weight,
                color: 'var(--text-primary)',
                flex: 1,
                fontFamily: t.mono ? "'JetBrains Mono', monospace" : 'inherit',
                letterSpacing: t.mono ? -1 : 0,
              }}>
                {t.sample}
              </span>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                  {t.name}
                </div>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                  {t.size} / w{t.weight}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spacing */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, letterSpacing: 1 }}>
          间距系统
        </div>
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 12,
          padding: 14,
          border: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 8 }}>
            {DESIGN_TOKENS.spacing.map((s, i) => (
              <div key={i} style={{
                width: Math.max(s * 1.2, 12),
                height: s * 2,
                background: i % 2 === 0 ? 'var(--accent)' : 'var(--secondary)',
                borderRadius: 2,
                opacity: 0.7,
              }} className="spacing-bar cursor-hover"></div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {DESIGN_TOKENS.spacing.map((s, i) => (
              <div key={i} style={{
                width: Math.max(s * 1.2, 12),
                textAlign: 'center',
                fontSize: 9,
                color: 'var(--text-muted)',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Components */}
      <div style={{ padding: '0 20px 32px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, letterSpacing: 1 }}>
          组件展示
        </div>
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 12,
          padding: 16,
          border: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}>
          <button style={{
            width: '100%',
            padding: '13px 20px',
            background: 'var(--accent)',
            border: 'none',
            borderRadius: 12,
            color: 'var(--bg)',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }} className="btn-primary cursor-hover">
            主要按钮
          </button>
          <button style={{
            width: '100%',
            padding: '12px 20px',
            background: 'transparent',
            border: '1.5px solid var(--border)',
            borderRadius: 12,
            color: 'var(--text-primary)',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
          }} className="btn-secondary cursor-hover">
            次要按钮
          </button>
          
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['极佳', '适宜', '一般', '较差'].map((label, i) => (
              <span key={label} style={{
                padding: '3px 10px',
                borderRadius: 4,
                fontSize: 11,
                fontWeight: 600,
                background: ['var(--accent)', 'var(--secondary)', 'var(--text-secondary)', 'var(--text-muted)'][i] + '22',
                color: ['var(--accent)', 'var(--secondary)', 'var(--text-secondary)', 'var(--text-muted)'][i],
              }} className="chip cursor-hover">
                {label}
              </span>
            ))}
          </div>

          <SuitabilityBar value={7.5} height={8} />

          <WaveIcon width={80} height={30} color="var(--accent)" />
        </div>
      </div>
    </div>
  );
}

// ===== 6. 接口文档页 =====
function ApiDocsPage({ onBack }) {
  const [expanded, setExpanded] = useState(0);

  const methodColors = {
    GET: 'var(--success)',
    POST: 'var(--accent)',
    PUT: 'var(--warning)',
    DELETE: 'var(--danger)',
  };

  return (
    <div className="page-scroll" style={{
      height: '100%',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      <div style={{ padding: 'calc(var(--ios-safe-top) + 8px) 20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button
            onClick={onBack}
            style={{
              width: 36, height: 36,
              borderRadius: '50%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }} className="cursor-hover">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Noto Sans SC', sans-serif" }}>接口文档</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              REST API · v2 · 浪候
            </div>
          </div>
        </div>

        <div style={{
          padding: '10px 14px',
          background: 'var(--bg-surface)',
          borderRadius: 8,
          border: '1px solid var(--border)',
          fontSize: 11,
          color: 'var(--text-secondary)',
          wordBreak: 'break-all',
        }}>
          <span style={{ color: 'var(--text-muted)' }}>Base URL: </span>
          <span style={{ color: 'var(--secondary)' }}>{API_DOCS.baseUrl}</span>
        </div>
      </div>

      <div style={{ padding: '0 20px 32px' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, letterSpacing: 1, fontFamily: "'Noto Sans SC', sans-serif" }}>
          接口列表
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {API_DOCS.endpoints.map((ep, idx) => (
            <div key={idx} style={{
              background: 'var(--bg-card)',
              borderRadius: 12,
              border: '1px solid var(--border)',
              overflow: 'hidden',
            }} className="api-endpoint cursor-hover">
              <div
                style={{
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                }}
                onClick={() => setExpanded(expanded === idx ? null : idx)}
              >
                <span style={{
                  padding: '3px 8px',
                  borderRadius: 4,
                  fontSize: 9,
                  fontWeight: 700,
                  background: methodColors[ep.method],
                  color: 'var(--bg)',
                  flexShrink: 0,
                  letterSpacing: 0.5,
                }}>
                  {ep.method}
                </span>
                <span style={{
                  fontSize: 11,
                  color: 'var(--text-primary)',
                  flex: 1,
                }}>
                  {ep.path}
                </span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--text-muted)"
                  strokeWidth="2"
                  style={{
                    transform: expanded === idx ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.2s ease',
                    flexShrink: 0,
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>

              {expanded === idx && (
                <div style={{
                  padding: '0 14px 14px',
                  borderTop: '1px solid var(--divider)',
                  animation: 'slideDown 0.25s ease',
                }}>
                  <div style={{
                    fontSize: 11,
                    color: 'var(--text-secondary)',
                    padding: '10px 0',
                    fontFamily: "'Noto Sans SC', sans-serif",
                  }}>
                    {ep.desc}
                  </div>

                  <div style={{ marginBottom: 10 }}>
                    <div style={{
                      fontSize: 10,
                      color: 'var(--text-muted)',
                      marginBottom: 6,
                      fontFamily: "'Noto Sans SC', sans-serif",
                    }}>参数</div>
                    {ep.params.map((p, pi) => (
                      <div key={pi} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 6,
                        padding: '3px 0',
                        fontSize: 10,
                        flexWrap: 'wrap',
                      }}>
                        <span style={{ color: 'var(--text-primary)', minWidth: 70 }}>{p.name}</span>
                        <span style={{ color: 'var(--secondary)', minWidth: 44 }}>{p.type}</span>
                        <span style={{
                          color: p.required ? 'var(--accent)' : 'var(--text-muted)',
                          minWidth: 30,
                          fontSize: 9,
                        }}>{p.required ? '必填' : '选填'}</span>
                        <span style={{
                          color: 'var(--text-muted)',
                          flex: '1 1 100%',
                          paddingLeft: 76,
                          fontFamily: "'Noto Sans SC', sans-serif",
                          marginTop: 2,
                        }}>{p.desc}</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div style={{
                      fontSize: 10,
                      color: 'var(--text-muted)',
                      marginBottom: 6,
                      fontFamily: "'Noto Sans SC', sans-serif",
                    }}>响应示例</div>
                    <pre style={{
                      background: 'var(--bg-surface)',
                      borderRadius: 8,
                      padding: 10,
                      fontSize: 9,
                      color: 'var(--text-secondary)',
                      overflowX: 'auto',
                      lineHeight: 1.5,
                      border: '1px solid var(--border)',
                      margin: 0,
                    }}>{ep.response}</pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
