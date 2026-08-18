// ===== TIDAL CURVE COMPONENT (SIGNATURE) =====
// Draggable time cursor on tidal curve - the signature interaction of 浪候

const { useRef, useEffect, useState, useCallback } = React;

function TidalCurve({
  tideData = TIDE_CURVE,
  hourlyData = HOURLY_FORECAST,
  currentHour = 8,
  width = 340,
  height = 180,
  theme = 'deepsea',
  onCursorChange,
  interactive = true,
  compact = false,
}) {
  const svgRef = useRef(null);
  const [cursorHour, setCursorHour] = useState(currentHour);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(false);
  const rafRef = useRef(null);
  const animRef = useRef(null);
  const reducedMotion = useRef(false);
  const [drawProgress, setDrawProgress] = useState(0);

  // Check reduced motion
  useEffect(() => {
    if (window.matchMedia) {
      reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }, []);

  // Animate curve drawing on mount
  useEffect(() => {
    if (reducedMotion.current) {
      setDrawProgress(1);
      return;
    }

    let startTime = null;
    const duration = 1200;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const t = Math.min((timestamp - startTime) / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDrawProgress(eased);
      if (t < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    const handleVis = () => {
      if (document.hidden) {
        if (animRef.current) cancelAnimationFrame(animRef.current);
      } else {
        if (drawProgress < 1) animRef.current = requestAnimationFrame(animate);
      }
    };

    document.addEventListener('visibilitychange', handleVis);
    const delay = setTimeout(() => {
      animRef.current = requestAnimationFrame(animate);
    }, 400);

    return () => {
      clearTimeout(delay);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      document.removeEventListener('visibilitychange', handleVis);
    };
  }, []);

  const padding = { 
    top: compact ? 12 : 20, 
    right: 8, 
    bottom: compact ? 20 : 28, 
    left: 8 
  };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Find min/max tide
  const maxTide = Math.max(...tideData.map(d => d.tide)) * 1.15;
  const minTide = Math.min(...tideData.map(d => d.tide)) * 0.85;

  // Map hour to x
  const hourToX = useCallback((h) => {
    return padding.left + (h / 24) * chartW;
  }, [chartW, padding.left]);

  // Map tide to y
  const tideToY = useCallback((t) => {
    return padding.top + chartH - ((t - minTide) / (maxTide - minTide)) * chartH;
  }, [chartH, maxTide, minTide, padding.top]);

  // Build path
  const pathPoints = tideData.map(d => ({
    x: hourToX(d.hour),
    y: tideToY(d.tide),
    hour: d.hour,
    tide: d.tide,
  }));

  // Smooth curve using Catmull-Rom to Bezier
  const buildSmoothPath = (points) => {
    if (points.length < 2) return '';
    let path = `M${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];
      
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      
      path += ` C${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }
    return path;
  };

  const linePath = buildSmoothPath(pathPoints);
  const areaPath = linePath + ` L${pathPoints[pathPoints.length - 1].x.toFixed(1)},${height - padding.bottom} L${pathPoints[0].x.toFixed(1)},${height - padding.bottom} Z`;

  // Cursor position
  const cursorX = hourToX(cursorHour);
  // Find tide at cursor hour via interpolation
  const cursorTide = (() => {
    const idx = Math.floor(cursorHour / (24 / (tideData.length - 1)));
    const frac = (cursorHour / (24 / (tideData.length - 1))) - idx;
    const d0 = tideData[Math.min(idx, tideData.length - 1)];
    const d1 = tideData[Math.min(idx + 1, tideData.length - 1)];
    return d0.tide + (d1.tide - d0.tide) * frac;
  })();
  const cursorY = tideToY(cursorTide);

  // Get hourly data at cursor
  const cursorHourIdx = Math.floor(cursorHour);
  const cursorHourData = hourlyData[Math.min(cursorHourIdx, hourlyData.length - 1)];

  // Handle drag
  const handleMove = useCallback((e) => {
    if (!interactive || !svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const xRatio = (clientX - rect.left) / rect.width;
    let h = xRatio * 24;
    h = Math.max(0, Math.min(24, h));
    
    // Snap to half-hour with damping when close
    const snapTarget = Math.round(h * 2) / 2;
    const dist = Math.abs(h - snapTarget);
    if (dist < 0.15) {
      h = snapTarget;
    }
    
    setCursorHour(h);
    if (onCursorChange && cursorHourData) {
      onCursorChange(h, cursorHourData);
    }
  }, [interactive, onCursorChange, cursorHourData]);

  const handleDown = useCallback((e) => {
    if (!interactive) return;
    dragRef.current = true;
    setIsDragging(true);
    handleMove(e);
    
    const moveHandler = (ev) => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        handleMove(ev);
        rafRef.current = null;
      });
    };
    
    const upHandler = () => {
      dragRef.current = false;
      setIsDragging(false);
      // Snap to nearest hour on release
      setCursorHour(h => {
        const snapped = Math.round(h * 2) / 2;
        return Math.max(0, Math.min(24, snapped));
      });
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseup', upHandler);
      document.removeEventListener('touchmove', moveHandler);
      document.removeEventListener('touchend', upHandler);
    };
    
    document.addEventListener('mousemove', moveHandler, { passive: true });
    document.addEventListener('mouseup', upHandler);
    document.addEventListener('touchmove', moveHandler, { passive: true });
    document.addEventListener('touchend', upHandler);
  }, [interactive, handleMove]);

  // High/low tide markers
  const findExtrema = () => {
    const extrema = [];
    for (let i = 1; i < tideData.length - 1; i++) {
      const prev = tideData[i - 1].tide;
      const curr = tideData[i].tide;
      const next = tideData[i + 1].tide;
      if (curr > prev && curr > next) {
        extrema.push({ type: 'high', hour: tideData[i].hour, tide: curr });
      } else if (curr < prev && curr < next) {
        extrema.push({ type: 'low', hour: tideData[i].hour, tide: curr });
      }
    }
    return extrema;
  };
  const extrema = findExtrema();

  // Clip path for draw animation
  const clipW = drawProgress * chartW;

  // Current time indicator
  const nowHour = new Date().getHours() + new Date().getMinutes() / 60;

  return (
    <div style={{ position: 'relative', width, height }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        style={{ display: 'block', touchAction: 'none', cursor: interactive ? 'grab' : 'default' }}
        onMouseDown={handleDown}
        onTouchStart={handleDown}
      >
        <defs>
          <clipPath id={`tide-clip-${theme}-${compact ? 'c' : 'f'}`}>
            <rect x={padding.left} y={0} width={clipW} height={height} />
          </clipPath>
          <linearGradient id={`tide-fill-${theme}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
            <stop offset="40%" stopColor="var(--secondary)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--secondary)" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id={`tide-line-${theme}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--secondary)" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.5, 1, 1.5, 2].map((tideLvl) => (
          <line
            key={tideLvl}
            x1={padding.left}
            y1={tideToY(tideLvl)}
            x2={width - padding.right}
            y2={tideToY(tideLvl)}
            stroke="var(--border)"
            strokeWidth="0.5"
            strokeDasharray="2,3"
          />
        ))}

        {/* Tide level labels */}
        {!compact && [1, 2].map((lvl) => (
          <text
            key={lvl}
            x={width - padding.right - 2}
            y={tideToY(lvl) + 3}
            textAnchor="end"
            fill="var(--text-muted)"
            fontSize="9"
            fontFamily="'JetBrains Mono', monospace"
          >
            {lvl}m
          </text>
        ))}

        {/* Hour markers */}
        {[0, 6, 12, 18, 24].map((h) => (
          <g key={h}>
            <line
              x1={hourToX(h)}
              y1={padding.top}
              x2={hourToX(h)}
              y2={height - padding.bottom}
              stroke="var(--border)"
              strokeWidth="0.5"
            />
            <text
              x={hourToX(h)}
              y={height - padding.bottom + 12}
              textAnchor="middle"
              fill="var(--text-muted)"
              fontSize="10"
              fontFamily="'JetBrains Mono', monospace"
            >
              {String(h).padStart(2, '0')}:00
            </text>
          </g>
        ))}

        {/* Filled area (ghost/base) */}
        <path d={areaPath} fill="var(--tide-fill, rgba(255,255,255,0.04))" />

        {/* Animated fill */}
        <g clipPath={`url(#tide-clip-${theme}-${compact ? 'c' : 'f'})`}>
          <path d={areaPath} fill={`url(#tide-fill-${theme})`} />
          <path
            d={linePath}
            fill="none"
            stroke={`url(#tide-line-${theme})`}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>

        {/* Base line (thin, always visible) */}
        <path
          d={linePath}
          fill="none"
          stroke="var(--text-muted)"
          strokeWidth="0.8"
          strokeOpacity="0.3"
        />

        {/* High/Low tide markers */}
        {extrema.map((ex, i) => (
          <g key={i} style={{ opacity: drawProgress > (ex.hour / 24) ? 1 : 0, transition: 'opacity 0.3s ease' }}>
            <circle
              cx={hourToX(ex.hour)}
              cy={tideToY(ex.tide)}
              r="4"
              fill={ex.type === 'high' ? 'var(--accent)' : 'var(--secondary)'}
              stroke="var(--bg-surface)"
              strokeWidth="1.5"
            />
            {!compact && (
              <text
                x={hourToX(ex.hour)}
                y={ex.type === 'high' ? tideToY(ex.tide) - 8 : tideToY(ex.tide) + 16}
                textAnchor="middle"
                fill="var(--text-secondary)"
                fontSize="9"
                fontFamily="'JetBrains Mono', monospace"
              >
                {ex.type === 'high' ? '高平潮' : '低平潮'} {ex.tide.toFixed(1)}m
              </text>
            )}
          </g>
        ))}

        {/* Now indicator */}
        {drawProgress > 0.3 && (
          <g>
            <line
              x1={hourToX(nowHour)}
              y1={padding.top}
              x2={hourToX(nowHour)}
              y2={height - padding.bottom}
              stroke="var(--foam)"
              strokeWidth="1"
              strokeDasharray="3,3"
              opacity="0.4"
            />
            <text
              x={hourToX(nowHour)}
              y={padding.top + 10}
              textAnchor="middle"
              fill="var(--foam)"
              fontSize="9"
              fontFamily="'JetBrains Mono', monospace"
              opacity="0.6"
            >
              现在
            </text>
          </g>
        )}

        {/* Draggable cursor */}
        {interactive && drawProgress >= (cursorHour / 24) && (
          <g style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
            {/* Vertical guide */}
            <line
              x1={cursorX}
              y1={padding.top}
              x2={cursorX}
              y2={height - padding.bottom}
              stroke="var(--accent)"
              strokeWidth="1"
              strokeOpacity="0.6"
            />

            {/* Cursor knob on curve */}
            <circle
              cx={cursorX}
              cy={cursorY}
              r={isDragging ? 7 : 5}
              fill="var(--accent)"
              stroke="var(--bg-surface)"
              strokeWidth="2"
              style={{ 
                transition: reducedMotion.current ? 'none' : 'r 0.15s ease',
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
              }}
            >
              {isDragging && !reducedMotion.current && (
                <animate attributeName="r" values="7;9;7" dur="1s" repeatCount="indefinite" />
              )}
            </circle>

            {/* Cursor tooltip */}
            <g transform={`translate(${cursorX}, ${padding.top + 4})`}>
              <rect
                x="-28"
                y="0"
                width="56"
                height="22"
                rx="6"
                fill="var(--accent)"
              />
              <text
                x="0"
                y="15"
                textAnchor="middle"
                fill="var(--bg)"
                fontSize="11"
                fontWeight={600}
                fontFamily="'JetBrains Mono', monospace"
              >
                {String(Math.floor(cursorHour)).padStart(2,'0')}:{String(Math.round((cursorHour % 1) * 60)).padStart(2,'0')}
              </text>
            </g>
          </g>
        )}
      </svg>

      {/* Bottom label */}
      {!compact && cursorHourData && interactive && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          padding: '6px 12px',
          background: 'var(--bg-card)',
          borderRadius: 20,
          border: '1px solid var(--border)',
          fontSize: 11,
          color: 'var(--text-secondary)',
          pointerEvents: 'none',
          opacity: isDragging ? 1 : 0,
          transition: 'opacity 0.2s ease',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          <span>浪高 <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{cursorHourData.waveHeight}m</strong></span>
          <span>·</span>
          <span>周期 <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{cursorHourData.period}s</strong></span>
          <span>·</span>
          <span>适宜 <strong style={{ color: cursorHourData.suitability >= 7 ? 'var(--accent)' : 'var(--text-primary)', fontWeight: 600 }}>{cursorHourData.suitability}</strong></span>
        </div>
      )}
    </div>
  );
}

// ===== WAVE HEIGHT VISUAL =====
// Small animated wave svg for cards
function WaveIcon({ height = 24, width = 40, color = 'currentColor', animated = true }) {
  return (
    <svg viewBox="0 0 40 24" width={width} height={height} fill="none" style={{ display: 'block' }}>
      <path
        d="M0 16 Q5 10 10 16 T20 16 T30 16 T40 16"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      >
        {animated && (
          <animate
            attributeName="d"
            values="M0 16 Q5 10 10 16 T20 16 T30 16 T40 16;M0 16 Q5 20 10 16 T20 16 T30 16 T40 16;M0 16 Q5 10 10 16 T20 16 T30 16 T40 16"
            dur="3s"
            repeatCount="indefinite"
          />
        )}
      </path>
      <path
        d="M0 20 Q5 14 10 20 T20 20 T30 20 T40 20"
        stroke={color}
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      >
        {animated && (
          <animate
            attributeName="d"
            values="M0 20 Q5 14 10 20 T20 20 T30 20 T40 20;M0 20 Q5 24 10 20 T20 20 T30 20 T40 20;M0 20 Q5 14 10 20 T20 20 T30 20 T40 20"
            dur="2.5s"
            repeatCount="indefinite"
            begin="0.5s"
          />
        )}
      </path>
    </svg>
  );
}

// Suitability bar
function SuitabilityBar({ value = 5, max = 10, height = 6 }) {
  const pct = (value / max) * 100;
  const color = value >= 8 ? 'var(--accent)' : value >= 6 ? 'var(--secondary)' : 'var(--text-muted)';
  
  return (
    <div style={{
      width: '100%',
      height,
      background: 'var(--chip-bg)',
      borderRadius: height / 2,
      overflow: 'hidden',
    }}>
      <div style={{
        width: `${pct}%`,
        height: '100%',
        background: color,
        borderRadius: height / 2,
        transition: 'width 0.6s ease',
      }}></div>
    </div>
  );
}

// Suitability label
function SuitabilityLabel({ level }) {
  const map = {
    good: { label: '极佳', color: 'var(--accent)' },
    suitable: { label: '适宜', color: 'var(--secondary)' },
    fair: { label: '一般', color: 'var(--text-secondary)' },
    poor: { label: '较差', color: 'var(--text-muted)' },
  };
  const info = map[level] || map.fair;
  return (
    <span style={{
      padding: '2px 8px',
      borderRadius: 4,
      background: info.color + '22',
      color: info.color,
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: 0.5,
    }}>
      {info.label}
    </span>
  );
}
