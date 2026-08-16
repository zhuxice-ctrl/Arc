// ── 通用 UI 组件 ──
// BottomTabBar, FermentCard, StageTimeline, NavHeader, etc.

// ============================================================
// BottomTabBar — 底部 Tab 栏（毛玻璃效果）
// ============================================================
function BottomTabBar({ active, onChange, dark = true }) {
  const tabs = [
    { key: 'home', label: '发酵', icon: (c) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C12 2 5 8 5 14a7 7 0 0 0 14 0c0-6-7-12-7-12z" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <ellipse cx="12" cy="18" rx="2" ry="1" fill={c} opacity="0.5"/>
      </svg>
    )},
    { key: 'explore', label: '探索', icon: (c) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.8"/>
        <path d="M15 9l-2 4-4 2 2-4 4-2z" fill={c}/>
      </svg>
    )},
    { key: 'new', label: '', icon: (c) => (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="13" fill={c}/>
        <path d="M14 9v10M9 14h10" stroke="#2B1D16" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ), center: true },
    { key: 'notes', label: '笔记', icon: (c) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M5 4h10l4 4v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M8 10h8M8 14h6M8 18h5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    )},
    { key: 'me', label: '我的', icon: (c) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke={c} strokeWidth="1.8"/>
        <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    )},
  ];

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      height: 88, paddingBottom: 34, // home indicator area
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      background: dark ? 'rgba(20,14,10,0.75)' : 'rgba(247,242,233,0.8)',
      borderTop: `0.5px solid ${dark ? 'rgba(217,164,65,0.15)' : 'rgba(43,29,22,0.08)'}`,
      zIndex: 30,
    }}>
      {tabs.map(tab => {
        const isActive = active === tab.key;
        const color = isActive ? '#D9A441' : (dark ? 'rgba(247,242,233,0.5)' : 'rgba(43,29,22,0.5)');
        if (tab.center) {
          return (
            <button
              key={tab.key}
              className="tab-btn interactive"
              onClick={() => onChange('new')}
              style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'transparent', border: 'none',
                marginTop: -20,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                filter: `drop-shadow(0 4px 12px rgba(217,164,65,0.4))`,
                transition: 'transform 200ms cubic-bezier(.2,.8,.2,1)',
              }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.92)'; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {tab.icon('#D9A441')}
            </button>
          );
        }
        return (
          <button
            key={tab.key}
            className="tab-btn interactive"
            onClick={() => onChange(tab.key)}
            style={{
              flex: 1, height: 60,
              background: 'transparent', border: 'none',
              cursor: 'pointer',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 3,
              transition: 'transform 150ms cubic-bezier(.2,.8,.2,1)',
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.9)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <div style={{
              transform: isActive ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 200ms cubic-bezier(.2,.8,.2,1)',
            }}>{tab.icon(color)}</div>
            <span style={{
              fontSize: 10, color,
              fontWeight: isActive ? 600 : 400,
              letterSpacing: '0.02em',
            }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ============================================================
// FermentCard — 发酵批次卡片
// ============================================================
function FermentCard({ batch, onClick, compact = false, dark = true }) {
  const type = FERMENT_TYPES[batch.type];
  const bg = dark ? 'rgba(247,242,233,0.06)' : 'rgba(255,255,255,0.8)';
  const text = dark ? '#F7F2E9' : '#2B1D16';
  const sub = dark ? 'rgba(247,242,233,0.5)' : 'rgba(43,29,22,0.5)';

  return (
    <div
      className="ferment-card interactive fade-item"
      onClick={onClick}
      style={{
        position: 'relative',
        background: bg,
        borderRadius: 20,
        padding: compact ? 14 : 18,
        cursor: 'pointer',
        overflow: 'hidden',
        border: `0.5px solid ${dark ? 'rgba(217,164,65,0.1)' : 'rgba(43,29,22,0.06)'}`,
        transition: 'transform 200ms cubic-bezier(.2,.8,.2,1), box-shadow 250ms',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
        e.currentTarget.style.boxShadow = `0 8px 24px ${hexToRgba(type.color, 0.15)}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Bubble field in card */}
      <BubbleField activity={batch.activity} color={type.color} count={10} />

      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: compact ? 44 : 52, height: compact ? 44 : 52,
          borderRadius: 14,
          background: `linear-gradient(135deg, ${hexToRgba(type.color, 0.25)}, ${hexToRgba(type.color, 0.08)})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: compact ? 20 : 24,
          flexShrink: 0,
          border: `1px solid ${hexToRgba(type.color, 0.3)}`,
        }}>
          <span style={{ filter: 'saturate(0.8)' }}>{type.emoji}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: compact ? 14 : 16, fontWeight: 600, color: text,
            marginBottom: 2, letterSpacing: '-0.01em',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{batch.name}</div>
          <div style={{ fontSize: 12, color: sub, marginBottom: compact ? 8 : 10 }}>
            {type.name} · {batch.recipe}
          </div>
          {/* Progress bar */}
          <div style={{ position: 'relative' }}>
            <div style={{
              height: 4, borderRadius: 4,
              background: dark ? 'rgba(247,242,233,0.08)' : 'rgba(43,29,22,0.08)',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${batch.progress * 100}%`, height: '100%',
                background: `linear-gradient(90deg, ${type.color}, ${hexToRgba(type.color, 0.7)})`,
                borderRadius: 4,
                transition: 'width 500ms cubic-bezier(.2,.8,.2,1)',
                boxShadow: `0 0 8px ${hexToRgba(type.color, 0.5)}`,
              }} />
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginTop: 4, fontSize: 11,
            }}>
              <span style={{ color: type.color, fontWeight: 500 }}>
                {Math.round(batch.progress * 100)}%
              </span>
              <span style={{ color: sub }}>
                第 {Math.floor(batch.progress * batch.totalStages) + 1}/{batch.totalStages} 阶段
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// NavHeader — 顶部导航栏
// ============================================================
function NavHeader({ title, subtitle, onBack, right, dark = true }) {
  const text = dark ? '#F7F2E9' : '#2B1D16';
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '12px 16px',
      paddingTop: 14,
      position: 'relative',
      zIndex: 5,
    }}>
      {onBack ? (
        <button
          className="interactive"
          onClick={onBack}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'transparent', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            marginLeft: -8,
            transition: 'transform 150ms cubic-bezier(.2,.8,.2,1), background 150ms',
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.9)'; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M13.5 5.5l-5 5.5 5 5.5" stroke={text} strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      ) : <div style={{ width: 36 }} />}
      <div style={{ flex: 1, textAlign: 'center' }}>
        <div style={{ fontSize: 17, fontWeight: 600, color: text, letterSpacing: '-0.01em' }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 12, color: dark ? 'rgba(247,242,233,0.5)' : 'rgba(43,29,22,0.5)', marginTop: 1 }}>
            {subtitle}
          </div>
        )}
      </div>
      <div style={{ width: 36, display: 'flex', justifyContent: 'flex-end' }}>
        {right}
      </div>
    </div>
  );
}

// ============================================================
// StageTimeline — 发酵阶段时间线
// ============================================================
function StageTimeline({ stages, currentIndex = 0, dark = true }) {
  const text = dark ? '#F7F2E9' : '#2B1D16';
  const sub = dark ? 'rgba(247,242,233,0.5)' : 'rgba(43,29,22,0.5)';
  const line = dark ? 'rgba(247,242,233,0.1)' : 'rgba(43,29,22,0.1)';
  const accent = '#D9A441';

  return (
    <div style={{ padding: '8px 0', position: 'relative' }}>
      {stages.map((stage, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;
        const dotColor = isDone || isCurrent ? accent : line;
        const lineColor = isDone ? accent : line;

        return (
          <div key={stage.key} style={{
            display: 'flex', gap: 14, padding: '10px 0',
            position: 'relative',
          }} className="fade-item">
            {/* Dot + line */}
            <div style={{
              width: 24, display: 'flex', flexDirection: 'column',
              alignItems: 'center', flexShrink: 0,
            }}>
              <div style={{
                width: isCurrent ? 14 : 10, height: isCurrent ? 14 : 10,
                borderRadius: '50%',
                background: isCurrent ? accent : 'transparent',
                border: `2px solid ${dotColor}`,
                boxShadow: isCurrent ? `0 0 12px ${hexToRgba(accent, 0.6)}` : 'none',
                transition: 'all 300ms',
                zIndex: 2,
                marginTop: 2,
              }} />
              {i < stages.length - 1 && (
                <div style={{
                  flex: 1, width: 2,
                  background: lineColor,
                  marginTop: 4,
                  minHeight: 14,
                }} />
              )}
            </div>
            {/* Content */}
            <div style={{ flex: 1, paddingBottom: 6 }}>
              <div style={{
                fontSize: 14, fontWeight: isCurrent ? 600 : 500,
                color: isDone || isCurrent ? text : sub,
                marginBottom: 2,
              }}>
                {stage.label}
                {isCurrent && (
                  <span style={{
                    marginLeft: 8, fontSize: 10, fontWeight: 500,
                    padding: '2px 8px', borderRadius: 10,
                    background: hexToRgba(accent, 0.15), color: accent,
                  }}>进行中</span>
                )}
              </div>
              <div style={{ fontSize: 12, color: sub }}>
                {formatDuration(stage.duration)} · {stage.temp}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// TempCurveChart — 温度曲线 (纯 SVG)
// ============================================================
function TempCurveChart({ data, width = 320, height = 120, color = '#D9A441', dark = true }) {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data) - 2;
  const max = Math.max(...data) + 2;
  const range = max - min || 1;
  const padding = { top: 10, right: 8, bottom: 20, left: 28 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const points = data.map((v, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartW;
    const y = padding.top + (1 - (v - min) / range) * chartH;
    return { x, y, v };
  });

  // Build smooth path
  let path = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const cpx1 = p0.x + (p1.x - p0.x) / 3;
    const cpx2 = p0.x + (p1.x - p0.x) * 2 / 3;
    path += ` C ${cpx1.toFixed(2)} ${p0.y.toFixed(2)} ${cpx2.toFixed(2)} ${p1.y.toFixed(2)} ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;
  }

  // Area path
  const areaPath = `${path} L ${points[points.length - 1].x.toFixed(2)} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`;

  const gridLines = 3;
  const gridColor = dark ? 'rgba(247,242,233,0.06)' : 'rgba(43,29,22,0.06)';
  const textColor = dark ? 'rgba(247,242,233,0.4)' : 'rgba(43,29,22,0.4)';

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="temp-area-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines + labels */}
      {[...Array(gridLines + 1)].map((_, i) => {
        const y = padding.top + (i / gridLines) * chartH;
        const val = max - (i / gridLines) * range;
        return (
          <g key={i}>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y}
                  stroke={gridColor} strokeWidth="0.5" strokeDasharray="2 3" />
            <text x={padding.left - 6} y={y + 3} fontSize="10" fill={textColor}
                  textAnchor="end" fontFamily="'JetBrains Mono', monospace">
              {val.toFixed(0)}°
            </text>
          </g>
        );
      })}
      {/* X-axis labels */}
      <text x={padding.left} y={height - 4} fontSize="9" fill={textColor}
            fontFamily="'JetBrains Mono', monospace">-24h</text>
      <text x={width - padding.right} y={height - 4} fontSize="9" fill={textColor}
            textAnchor="end" fontFamily="'JetBrains Mono', monospace">现在</text>

      {/* Area */}
      <path d={areaPath} fill="url(#temp-area-grad)" />
      {/* Line */}
      <path d={path} fill="none" stroke={color} strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            style={{ filter: `drop-shadow(0 0 4px ${hexToRgba(color, 0.5)})` }} />
      {/* Last point pulse */}
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="4" fill={color}
              style={{ filter: `drop-shadow(0 0 6px ${hexToRgba(color, 0.8)})` }} />
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="8"
              fill="none" stroke={color} strokeWidth="1" opacity="0.5">
        {!reducedMotion && (
          <animate attributeName="r" values="4;12;4" dur="2s" repeatCount="indefinite" />
        )}
        {!reducedMotion && (
          <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
        )}
      </circle>
    </svg>
  );
}

// ============================================================
// TagChip — 标签芯片
// ============================================================
function TagChip({ label, color = '#D9A441', dark = true }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 10px', borderRadius: 20,
      fontSize: 11, fontWeight: 500,
      background: hexToRgba(color, 0.12),
      color,
      border: `0.5px solid ${hexToRgba(color, 0.3)}`,
      marginRight: 6, marginBottom: 4,
    }}>
      {label}
    </span>
  );
}

// ============================================================
// StatRow — 统计数据行
// ============================================================
function StatRow({ label, value, unit, color = '#D9A441' }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 22, fontWeight: 700, color, letterSpacing: '-0.02em',
                    fontFamily: "'Fraunces', serif" }}>
        {value}<span style={{ fontSize: 12, fontWeight: 500, marginLeft: 2, opacity: 0.7 }}>{unit}</span>
      </div>
      <div style={{ fontSize: 11, color: 'rgba(247,242,233,0.5)', marginTop: 2 }}>{label}</div>
    </div>
  );
}

Object.assign(window, {
  BottomTabBar,
  FermentCard,
  NavHeader,
  StageTimeline,
  TempCurveChart,
  TagChip,
  StatRow,
});
