// 纹枰 — 围棋棋盘组件
// 19 路棋盘，支持落子、前进后退、长按变化图、妙手高亮
// 使用 SVG 渲染，确保 390px 宽度下可准确点选

const { useState, useEffect, useRef, useCallback, useMemo } = React;

// 常量
const BOARD_SIZE = 19;
const STAR_POINTS = [
  [3, 3], [3, 9], [3, 15],
  [9, 3], [9, 9], [9, 15],
  [15, 3], [15, 9], [15, 15],
];

// 棋盘组件
function GoBoard({
  moves = [],         // 已落子序列 [{x, y, color, num, comment?, isBrilliant?}]
  currentIndex = -1,  // 当前手数索引（-1 表示空盘）
  onMoveClick,        // 点击某手回调
  onCellClick,        // 点击空位回调（做题模式用）
  onCellLongPress,    // 长按交叉点回调
  showMoveNumbers = false,
  highlightBrilliant = false,
  lastMoveMark = true,
  initialStones = [], // 初始子（死活题用）
  readOnly = true,
  size = 340,
  boardColor = '#E8D4A8',
  reducedMotion = false,
}) {
  const svgRef = useRef(null);
  const longPressTimer = useRef(null);
  const longPressFired = useRef(false);
  const [animatingStone, setAnimatingStone] = useState(null);
  const [captureAnims, setCaptureAnims] = useState([]);

  const padding = size * 0.035; // 边距
  const innerSize = size - padding * 2;
  const lineGap = innerSize / (BOARD_SIZE - 1);
  const stoneR = lineGap * 0.48;

  // 坐标转换
  const cellToPx = useCallback((x, y) => ({
    cx: padding + x * lineGap,
    cy: padding + y * lineGap,
  }), [padding, lineGap]);

  // 当前盘面状态：board[y][x] = {color, num, isBrilliant, comment} | null
  const { board, captures } = useMemo(() => {
    const b = Array.from({ length: BOARD_SIZE }, () =>
      Array.from({ length: BOARD_SIZE }, () => null)
    );
    // 初始子
    initialStones.forEach((s, i) => {
      if (s.x >= 0 && s.x < BOARD_SIZE && s.y >= 0 && s.y < BOARD_SIZE) {
        b[s.y][s.x] = { color: s.color, num: 0, isInitial: true };
      }
    });
    let caps = [];
    const lastIdx = Math.min(currentIndex, moves.length - 1);
    for (let i = 0; i <= lastIdx; i++) {
      const m = moves[i];
      if (!m || m.x < 0 || m.y < 0) continue; // pass 手
      const x = m.x, y = m.y;
      if (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
        b[y][x] = {
          color: m.color,
          num: m.num,
          isBrilliant: m.isBrilliant,
          comment: m.comment,
        };
        // 简单提子检测（4方向，对方颜色）
        const opp = m.color === 'B' ? 'W' : 'B';
        const toCapture = [];
        const checkGroup = (gx, gy, visited = new Set()) => {
          const key = `${gx},${gy}`;
          if (visited.has(key)) return { stones: [], hasLiberty: false };
          if (gx < 0 || gx >= BOARD_SIZE || gy < 0 || gy >= BOARD_SIZE) return { stones: [], hasLiberty: false };
          const cell = b[gy][gx];
          if (!cell) return { stones: [], hasLiberty: true };
          if (cell.color !== opp) return { stones: [], hasLiberty: false };
          visited.add(key);
          let stones = [{ x: gx, y: gy }];
          const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
          for (const [dx, dy] of dirs) {
            const r = checkGroup(gx + dx, gy + dy, visited);
            if (r.hasLiberty) return { stones: [], hasLiberty: true };
            stones = stones.concat(r.stones);
          }
          return { stones, hasLiberty: false };
        };
        const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
        for (const [dx, dy] of dirs) {
          const r = checkGroup(x + dx, y + dy);
          if (!r.hasLiberty && r.stones.length > 0) {
            toCapture.push(...r.stones);
          }
        }
        if (toCapture.length > 0) {
          caps.push({ moveIndex: i, stones: toCapture });
          toCapture.forEach(({ x: cx, y: cy }) => {
            b[cy][cx] = null;
          });
        }
      }
    }
    return { board: b, captures: caps };
  }, [moves, currentIndex, initialStones]);

  // 最新一手落子动画
  useEffect(() => {
    if (currentIndex >= 0 && currentIndex < moves.length && !reducedMotion) {
      const m = moves[currentIndex];
      if (m && m.x >= 0 && m.y >= 0) {
        setAnimatingStone({ x: m.x, y: m.y, color: m.color, key: Date.now() });
        const t = setTimeout(() => setAnimatingStone(null), 400);
        return () => clearTimeout(t);
      }
    }
  }, [currentIndex, moves, reducedMotion]);

  // 提子动画
  useEffect(() => {
    if (reducedMotion) return;
    const lastCap = captures[captures.length - 1];
    if (lastCap && lastCap.moveIndex === currentIndex) {
      setCaptureAnims(lastCap.stones.map((s, i) => ({ ...s, key: `${Date.now()}-${i}` })));
      const t = setTimeout(() => setCaptureAnims([]), 500);
      return () => clearTimeout(t);
    }
  }, [captures, currentIndex, reducedMotion]);

  // 妙手到达时的脉冲效果
  const currentMove = currentIndex >= 0 ? moves[currentIndex] : null;
  const isBrilliantReached = currentMove && currentMove.isBrilliant && highlightBrilliant;

  // 点击 / 长按处理
  const handlePointerDown = (e, x, y) => {
    if (readOnly && !onCellLongPress) return;
    longPressFired.current = false;
    if (onCellLongPress) {
      longPressTimer.current = setTimeout(() => {
        longPressFired.current = true;
        onCellLongPress(x, y);
      }, 500);
    }
  };

  const handlePointerUp = (e, x, y) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (longPressFired.current) return;
    // 若点到了已有棋子
    const cell = board[y]?.[x];
    if (cell && cell.num > 0 && onMoveClick) {
      onMoveClick(cell.num);
      return;
    }
    if (onCellClick && !cell) {
      onCellClick(x, y);
    }
  };

  const handlePointerLeave = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // 渲染格子
  const cells = [];
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      const { cx, cy } = cellToPx(x, y);
      cells.push(
        <rect
          key={`cell-${x}-${y}`}
          x={cx - lineGap / 2}
          y={cy - lineGap / 2}
          width={lineGap}
          height={lineGap}
          fill="transparent"
          style={{ cursor: readOnly ? 'default' : 'pointer' }}
          onPointerDown={(e) => handlePointerDown(e, x, y)}
          onPointerUp={(e) => handlePointerUp(e, x, y)}
          onPointerLeave={handlePointerLeave}
        />
      );
    }
  }

  // 星位
  const starPoints = STAR_POINTS.map(([x, y]) => {
    const { cx, cy } = cellToPx(x, y);
    return <circle key={`star-${x}-${y}`} cx={cx} cy={cy} r={lineGap * 0.08} fill="#2C1810" />;
  });

  // 格线
  const lines = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    const { cx, cy } = cellToPx(i, i);
    lines.push(
      <line
        key={`h-${i}`}
        x1={padding}
        y1={cy}
        x2={size - padding}
        y2={cy}
        stroke="#2C1810"
        strokeWidth={i === 0 || i === BOARD_SIZE - 1 ? 1.5 : 0.8}
      />
    );
    lines.push(
      <line
        key={`v-${i}`}
        x1={cx}
        y1={padding}
        x2={cx}
        y2={size - padding}
        stroke="#2C1810"
        strokeWidth={i === 0 || i === BOARD_SIZE - 1 ? 1.5 : 0.8}
      />
    );
  }

  // 棋子
  const stoneEls = [];
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      const cell = board[y][x];
      if (!cell) continue;
      const { cx, cy } = cellToPx(x, y);
      const isLast = currentMove && cell.num === currentMove.num;
      stoneEls.push(
        <g key={`stone-${x}-${y}`}>
          {/* 阴影 */}
          <ellipse
            cx={cx + stoneR * 0.15}
            cy={cy + stoneR * 0.2}
            rx={stoneR * 0.9}
            ry={stoneR * 0.35}
            fill="rgba(44, 24, 16, 0.25)"
          />
          {/* 棋子 */}
          <circle
            cx={cx}
            cy={cy}
            r={stoneR}
            fill={cell.color === 'B' ? 'url(#blackStoneGrad)' : 'url(#whiteStoneGrad)'}
            stroke={cell.color === 'B' ? '#000' : '#C8BFA8'}
            strokeWidth={0.5}
          />
          {/* 高光 */}
          <ellipse
            cx={cx - stoneR * 0.3}
            cy={cy - stoneR * 0.35}
            rx={stoneR * 0.3}
            ry={stoneR * 0.15}
            fill={cell.color === 'B' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.6)'}
          />
          {/* 手数 */}
          {showMoveNumbers && cell.num > 0 && (
            <text
              x={cx}
              y={cy + stoneR * 0.3}
              textAnchor="middle"
              fontSize={stoneR * 0.8}
              fill={cell.color === 'B' ? '#F5F1E8' : '#2C1810'}
              fontFamily='"JetBrains Mono", monospace'
              fontWeight="600"
            >
              {cell.num}
            </text>
          )}
          {/* 最新一手标记 */}
          {isLast && lastMoveMark && !showMoveNumbers && (
            <circle
              cx={cx}
              cy={cy}
              r={stoneR * 0.3}
              fill="none"
              stroke={cell.color === 'B' ? '#F5F1E8' : '#2C1810'}
              strokeWidth={1.5}
            />
          )}
          {/* 妙手高亮 */}
          {cell.isBrilliant && highlightBrilliant && (
            <circle
              cx={cx}
              cy={cy}
              r={stoneR + 2}
              fill="none"
              stroke="#6B8E5A"
              strokeWidth={2}
              strokeDasharray="4 2"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from={`0 ${cx} ${cy}`}
                to={`360 ${cx} ${cy}`}
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>
          )}
        </g>
      );
    }
  }

  // 落子动画
  const animStoneEl = animatingStone && (() => {
    const { cx, cy } = cellToPx(animatingStone.x, animatingStone.y);
    return (
      <g key={animatingStone.key} style={{ pointerEvents: 'none' }}>
        {/* 阴影先至 */}
        <ellipse
          cx={cx + stoneR * 0.15}
          cy={cy + stoneR * 0.2}
          rx={0}
          ry={0}
          fill="rgba(44, 24, 16, 0.25)"
        >
          <animate attributeName="rx" from="0" to={stoneR * 0.9} dur="180ms" fill="freeze" />
          <animate attributeName="ry" from="0" to={stoneR * 0.35} dur="180ms" fill="freeze" />
        </ellipse>
        {/* 棋子落下 */}
        <circle
          cx={cx}
          cy={cy - size * 0.4}
          r={stoneR}
          fill={animatingStone.color === 'B' ? 'url(#blackStoneGrad)' : 'url(#whiteStoneGrad)'}
          stroke={animatingStone.color === 'B' ? '#000' : '#C8BFA8'}
          strokeWidth={0.5}
        >
          <animate
            attributeName="cy"
            values={`${cy - size * 0.4}; ${cy}; ${cy + stoneR * 0.15}; ${cy}`}
            keyTimes="0; 0.7; 0.85; 1"
            dur="320ms"
            fill="freeze"
            calcMode="spline"
            keySplines="0.34 1.56 0.64 1; 0.4 0 0.2 1; 0.4 0 0.2 1"
          />
        </circle>
        {/* 高光 */}
        <ellipse
          cx={cx - stoneR * 0.3}
          cy={cy - size * 0.4 - stoneR * 0.35}
          rx={stoneR * 0.3}
          ry={stoneR * 0.15}
          fill={animatingStone.color === 'B' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.6)'}
        >
          <animate
            attributeName="cy"
            values={`${cy - size * 0.4 - stoneR * 0.35}; ${cy - stoneR * 0.35}; ${cy - stoneR * 0.35 + stoneR * 0.15}; ${cy - stoneR * 0.35}`}
            keyTimes="0; 0.7; 0.85; 1"
            dur="320ms"
            fill="freeze"
            calcMode="spline"
            keySplines="0.34 1.56 0.64 1; 0.4 0 0.2 1; 0.4 0 0.2 1"
          />
        </ellipse>
      </g>
    );
  })();

  // 提子动画
  const captureEls = captureAnims.map((cap, i) => {
    const { cx, cy } = cellToPx(cap.x, cap.y);
    return (
      <g key={cap.key} style={{ pointerEvents: 'none' }}>
        <circle
          cx={cx}
          cy={cy}
          r={stoneR}
          fill={i % 2 === 0 ? 'url(#whiteStoneGrad)' : 'url(#blackStoneGrad)'}
          opacity={1}
        >
          <animate attributeName="cx" from={cx} to={cx + (i % 2 === 0 ? 30 : -30)} dur="450ms" fill="freeze" />
          <animate attributeName="cy" from={cy} to={cy - 60} dur="450ms" fill="freeze" />
          <animate attributeName="opacity" from="1" to="0" dur="450ms" fill="freeze" />
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${cx} ${cy}`}
            to={`${i % 2 === 0 ? 180 : -180} ${cx} ${cy}`}
            dur="450ms"
            fill="freeze"
          />
        </circle>
      </g>
    );
  });

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      {/* 妙手到达时的外发光 */}
      {isBrilliantReached && !reducedMotion && (
        <div
          style={{
            position: 'absolute',
            inset: -8,
            borderRadius: '50%',
            boxShadow: '0 0 40px 10px rgba(107, 142, 90, 0.4)',
            animation: 'brilliantPulse 1.2s ease-out',
            pointerEvents: 'none',
          }}
        />
      )}
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          display: 'block',
          borderRadius: 4,
          background: `linear-gradient(145deg, ${boardColor} 0%, ${boardColor}dd 100%)`,
          boxShadow: 'inset 0 2px 8px rgba(139, 105, 20, 0.2), 0 4px 12px rgba(44, 24, 16, 0.15)',
        }}
      >
        <defs>
          <radialGradient id="blackStoneGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#4A4A4A" />
            <stop offset="60%" stopColor="#1A1A1A" />
            <stop offset="100%" stopColor="#0A0A0A" />
          </radialGradient>
          <radialGradient id="whiteStoneGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFEF9" />
            <stop offset="70%" stopColor="#F5F1E8" />
            <stop offset="100%" stopColor="#E8E0CC" />
          </radialGradient>
          <pattern id="woodGrain" patternUnits="userSpaceOnUse" width="100" height="100">
            <rect width="100" height="100" fill={boardColor} />
            <path d="M0,20 Q25,18 50,22 T100,20" stroke="rgba(139,105,20,0.08)" strokeWidth="0.5" fill="none" />
            <path d="M0,50 Q30,48 60,53 T100,50" stroke="rgba(139,105,20,0.06)" strokeWidth="0.5" fill="none" />
            <path d="M0,80 Q20,82 45,78 T100,80" stroke="rgba(139,105,20,0.08)" strokeWidth="0.5" fill="none" />
          </pattern>
        </defs>

        {/* 木纹底 */}
        <rect x="0" y="0" width={size} height={size} fill="url(#woodGrain)" rx="4" />

        {/* 格线 */}
        {lines}

        {/* 星位 */}
        {starPoints}

        {/* 棋子 */}
        {stoneEls}

        {/* 落子动画 */}
        {animStoneEl}

        {/* 提子动画 */}
        {captureEls}

        {/* 点击层 */}
        {cells}
      </svg>
    </div>
  );
}

window.GoBoard = GoBoard;
