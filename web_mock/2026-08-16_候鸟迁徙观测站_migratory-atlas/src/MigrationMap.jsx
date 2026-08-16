/* ============================================================
   MigrationMap - 迁徙走廊地图
   特色：
   - 交互式 SVG 世界地图（简化版）+ 迁飞路线
   - 可切换不同迁飞区
   - 路线有动态光点沿路径移动（候鸟编队）
   - 悬停站点显示信息
   - 地图有视差倾斜
   ============================================================ */

function MigrationMap() {
  const sectionRef = React.useRef(null);
  const mapRef = React.useRef(null);
  const [activeFlyway, setActiveFlyway] = React.useState('eAAF');

  const flyways = [
    { id: 'eAAF', name: '东亚-澳大利西亚', en: 'East Asian - Australasian', color: '#E4572E' },
    { id: 'cAF', name: '中亚', en: 'Central Asian', color: '#8A8680' },
    { id: 'wAAF', name: '西非-东亚', en: 'West Asian - East African', color: '#8A8680' },
    { id: 'aF', name: '美洲', en: 'Americas', color: '#8A8680' },
  ];

  // 迁徙路线数据（简化的 SVG 路径）
  const routes = {
    eAAF: [
      { id: 1, name: '白鹤路线', from: '西伯利亚', to: '鄱阳湖', path: 'M 280 120 C 340 160, 380 220, 420 300 S 440 400, 420 460' },
      { id: 2, name: '黑脸琵鹭路线', from: '朝鲜半岛', to: '台湾/海南', path: 'M 440 180 C 460 240, 470 300, 460 360 S 440 430, 430 470' },
      { id: 3, name: '斑头雁路线', from: '青藏高原', to: '印度次大陆', path: 'M 380 230 C 380 280, 390 330, 400 380' },
      { id: 4, name: '雨燕路线', from: '北京', to: '南非', path: 'M 430 210 C 380 280, 320 360, 300 450 S 280 550, 340 640' },
    ],
    cAF: [
      { id: 1, name: '中亚路线', from: '西伯利亚', to: '南亚', path: 'M 340 120 C 360 200, 380 280, 400 380' },
    ],
    wAAF: [
      { id: 1, name: '西亚路线', from: '北欧', to: '东非', path: 'M 260 100 C 280 200, 300 300, 320 420' },
    ],
    aF: [
      { id: 1, name: '美洲路线', from: '加拿大', to: '南美', path: 'M 140 120 C 130 200, 120 300, 140 420 S 180 520, 160 620' },
    ],
  };

  // 站点数据
  const stations = [
    { id: 1, name: '北戴河观测站', x: 430, y: 210, count: 284 },
    { id: 2, name: '鄱阳湖保护区', x: 420, y: 420, count: 312 },
    { id: 3, name: '盐城湿地', x: 440, y: 380, count: 198 },
    { id: 4, name: '崇明东滩', x: 450, y: 360, count: 267 },
    { id: 5, name: '香港米埔', x: 445, y: 445, count: 156 },
    { id: 6, name: '昆明滇池', x: 410, y: 430, count: 143 },
  ];

  const [hoveredStation, setHoveredStation] = React.useState(null);

  // 地图视差（鼠标移动倾斜）
  React.useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const map = mapRef.current;
    if (!map) return;

    let rafId = null;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let isVisible = !document.hidden;

    const onMouseMove = throttle((e) => {
      const rect = map.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetX = (e.clientX - cx) / rect.width;
      targetY = (e.clientY - cy) / rect.height;
    }, 16);

    function tick() {
      if (!isVisible) { rafId = null; return; }
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      map.style.transform = `perspective(1200px) rotateY(${currentX * 5}deg) rotateX(${-currentY * 5}deg)`;
      rafId = requestAnimationFrame(tick);
    }

    function onVisibilityChange() {
      isVisible = !document.hidden;
      if (isVisible && !rafId) rafId = requestAnimationFrame(tick);
      else if (!isVisible && rafId) { cancelAnimationFrame(rafId); rafId = null; }
    }

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('visibilitychange', onVisibilityChange);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // 滚动渐入
  React.useEffect(() => {
    if (!sectionRef.current) return;
    sectionRef.current.querySelectorAll('.reveal').forEach((el) => {
      RevealManager.observe(el);
    });
  }, [activeFlyway]);

  const activeRoutes = routes[activeFlyway] || [];
  const activeFlywayData = flyways.find((f) => f.id === activeFlyway);

  return React.createElement('section', {
    ref: sectionRef,
    className: 'migration section',
    id: 'migration',
  },
    React.createElement('div', { className: 'container' },
      React.createElement('div', { className: 'migration__header reveal' },
        React.createElement(SectionIndex, { num: '02', total: '05', label: 'CORRIDOR' }),
        React.createElement('h2', { className: 'display-2 migration__title' },
          '全球迁徙',
          React.createElement('em', null, '走廊'),
          React.createElement('br', null),
          React.createElement('span', { className: 'migration__title-en' }, 'Flyways of the World')
        ),
        React.createElement('p', { className: 'migration__desc' },
          '全球共有九大候鸟迁飞区，其中东亚-澳大利西亚迁飞区是物种最丰富、',
          '也最受威胁的一条。我们的观测站沿其核心通道分布。'
        ),
      ),

      // 迁飞区切换
      React.createElement('div', { className: 'migration__flyways reveal' },
        flyways.map((f) =>
          React.createElement('button', {
            key: f.id,
            className: `flyway-btn ${activeFlyway === f.id ? 'is-active' : ''}`,
            onClick: () => setActiveFlyway(f.id),
            'data-cursor-hover': true,
          },
            React.createElement('span', { className: 'flyway-btn__dot', style: { background: f.color } }),
            React.createElement('span', { className: 'flyway-btn__name' }, f.name),
            React.createElement('span', { className: 'flyway-btn__en mono' }, f.en)
          )
        )
      ),

      // 地图主体
      React.createElement('div', { className: 'migration__map-wrap reveal' },
        React.createElement('div', { ref: mapRef, className: 'migration__map' },
          React.createElement('svg', {
            viewBox: '0 0 600 700',
            fill: 'none',
            xmlns: 'http://www.w3.org/2000/svg',
            className: 'world-map',
          },
            // 简化的大陆轮廓（风格化，示意用）
            React.createElement('g', { className: 'continents', fill: '#EDE8DC', stroke: '#D9D4CA', strokeWidth: '0.8' },
              // 北美
              React.createElement('path', { d: 'M 60 80 Q 80 60, 140 70 Q 200 80, 220 130 Q 230 180, 200 230 Q 160 270, 130 250 Q 90 240, 70 200 Q 50 150, 60 80 Z' }),
              // 南美
              React.createElement('path', { d: 'M 140 350 Q 170 340, 190 380 Q 210 430, 190 500 Q 170 580, 140 620 Q 110 600, 100 540 Q 90 470, 110 400 Q 120 360, 140 350 Z' }),
              // 欧洲
              React.createElement('path', { d: 'M 260 90 Q 290 80, 310 100 Q 320 130, 300 160 Q 280 180, 250 170 Q 230 140, 240 110 Q 250 95, 260 90 Z' }),
              // 非洲
              React.createElement('path', { d: 'M 270 200 Q 310 190, 340 230 Q 370 290, 360 380 Q 340 460, 300 510 Q 260 540, 240 500 Q 220 430, 230 350 Q 240 270, 260 220 Q 265 205, 270 200 Z' }),
              // 亚洲
              React.createElement('path', { d: 'M 330 80 Q 400 60, 480 80 Q 530 100, 540 140 Q 550 190, 520 230 Q 500 260, 460 270 Q 420 280, 390 250 Q 360 230, 340 200 Q 320 160, 330 120 Q 335 95, 330 80 Z' }),
              // 东南亚/印尼
              React.createElement('path', { d: 'M 460 380 Q 500 370, 520 400 Q 530 440, 510 470 Q 480 490, 450 470 Q 430 440, 440 410 Q 445 390, 460 380 Z' }),
              // 澳大利亚
              React.createElement('path', { d: 'M 480 540 Q 530 530, 550 570 Q 560 610, 530 640 Q 490 650, 460 620 Q 440 590, 450 560 Q 460 545, 480 540 Z' }),
              // 北极圈冰面
              React.createElement('path', { d: 'M 100 30 Q 250 10, 450 30 L 450 50 Q 250 40, 100 50 Z', opacity: '0.5' }),
            ),

            // 经纬度网格（淡）
            React.createElement('g', { stroke: '#D9D4CA', strokeWidth: '0.3', opacity: '0.5' },
              ...Array.from({ length: 7 }, (_, i) =>
                React.createElement('line', {
                  key: `h${i}`,
                  x1: '0', y1: 100 * (i + 1), x2: '600', y2: 100 * (i + 1),
                  strokeDasharray: i === 3 ? '0' : '2 4',
                })
              ),
              ...Array.from({ length: 6 }, (_, i) =>
                React.createElement('line', {
                  key: `v${i}`,
                  x1: 100 * (i + 1), y1: '0', x2: 100 * (i + 1), y2: '700',
                  strokeDasharray: i === 3 ? '0' : '2 4',
                })
              ),
            ),

            // 迁徙路线
            React.createElement('g', { className: 'migration-routes' },
              activeRoutes.map((route) =>
                React.createElement('g', { key: route.id, className: 'migration-route' },
                  React.createElement('path', {
                    d: route.path,
                    stroke: activeFlywayData.color,
                    strokeWidth: '1.5',
                    fill: 'none',
                    strokeDasharray: '6 4',
                    opacity: '0.7',
                    className: 'route-path',
                  }),
                  // 沿路径移动的光点（候鸟）
                  React.createElement('circle', {
                    r: '2.5',
                    fill: activeFlywayData.color,
                    className: 'route-bird',
                    style: {
                      offsetPath: `path('${route.path}')`,
                      animationDelay: `${route.id * 0.8}s`,
                      filter: `drop-shadow(0 0 3px ${activeFlywayData.color})`,
                    }
                  }),
                  React.createElement('circle', {
                    r: '1.5',
                    fill: '#F5F1E8',
                    stroke: activeFlywayData.color,
                    strokeWidth: '0.8',
                    className: 'route-bird route-bird--2',
                    style: {
                      offsetPath: `path('${route.path}')`,
                      animationDelay: `${route.id * 0.8 + 0.3}s`,
                    }
                  }),
                  React.createElement('circle', {
                    r: '1.5',
                    fill: '#F5F1E8',
                    stroke: activeFlywayData.color,
                    strokeWidth: '0.8',
                    className: 'route-bird route-bird--3',
                    style: {
                      offsetPath: `path('${route.path}')`,
                      animationDelay: `${route.id * 0.8 + 0.6}s`,
                    }
                  })
                )
              )
            ),

            // 观测站点（只在 eAAF 显示主要站）
            activeFlyway === 'eAAF' && React.createElement('g', { className: 'stations' },
              stations.map((s) =>
                React.createElement('g', {
                  key: s.id,
                  className: `station ${hoveredStation === s.id ? 'is-hovered' : ''}`,
                  onMouseEnter: () => setHoveredStation(s.id),
                  onMouseLeave: () => setHoveredStation(null),
                  'data-cursor-hover': true,
                  style: { cursor: 'none' },
                },
                  React.createElement('circle', { cx: s.x, cy: s.y, r: '5', fill: 'var(--color-eggshell)', stroke: '#E4572E', strokeWidth: '1.5' }),
                  React.createElement('circle', { cx: s.x, cy: s.y, r: '2', fill: '#E4572E' }),
                  React.createElement('circle', {
                    cx: s.x, cy: s.y, r: '5', fill: 'none', stroke: '#E4572E', strokeWidth: '1',
                    className: 'station-pulse',
                  }),
                  // 标签
                  React.createElement('g', { className: 'station-label' },
                    React.createElement('text', {
                      x: s.x + 10, y: s.y - 6,
                      className: 'mono', fontSize: '8', fill: '#1C1B1A', fontWeight: '500'
                    }, s.name),
                    React.createElement('text', {
                      x: s.x + 10, y: s.y + 6,
                      className: 'mono', fontSize: '7', fill: '#E4572E'
                    }, `${s.count} 种`)
                  )
                )
              )
            ),

            // 方向指示 - 北
            React.createElement('g', { transform: 'translate(30, 40)', className: 'map-compass' },
              React.createElement('circle', { r: '15', fill: 'none', stroke: '#B5B0A8', strokeWidth: '0.5' }),
              React.createElement('path', { d: 'M 0 -12 L 3 0 L 0 3 L -3 0 Z', fill: '#E4572E' }),
              React.createElement('path', { d: 'M 0 12 L 3 0 L 0 -3 L -3 0 Z', fill: '#1C1B1A' }),
              React.createElement('text', { x: '0', y: '-18', textAnchor: 'middle', className: 'mono', fontSize: '7', fill: '#8A8680' }, 'N')
            )
          )
        ),

        // 图例
        React.createElement('div', { className: 'migration__legend' },
          React.createElement('div', { className: 'mono migration__legend-title' }, 'LEGEND'),
          React.createElement('div', { className: 'migration__legend-item' },
            React.createElement('span', { className: 'migration__legend-dot', style: { background: activeFlywayData.color } }),
            React.createElement('span', null, `${activeFlywayData.name}迁飞区路线`)
          ),
          React.createElement('div', { className: 'migration__legend-item' },
            React.createElement('span', { className: 'migration__legend-station' }),
            React.createElement('span', null, '野外观测站')
          ),
          React.createElement('div', { className: 'migration__legend-item' },
            React.createElement('span', { className: 'migration__legend-bird' }),
            React.createElement('span', null, '实时追踪鸟群')
          )
        )
      )
    )
  );
}

const migrationStyles = `
.migration {
  background: linear-gradient(180deg, var(--color-eggshell) 0%, var(--color-eggshell-2) 100%);
  position: relative;
  overflow: hidden;
}
.migration::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: radial-gradient(circle at 20% 80%, rgba(228, 87, 46, 0.04), transparent 50%);
  pointer-events: none;
}
.migration__header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 48px;
  max-width: 640px;
}
.migration__title em {
  font-style: italic;
  color: var(--color-sunset);
}
.migration__title-en {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 300;
  font-size: 0.5em;
  color: var(--color-feather-dark);
  letter-spacing: 0.02em;
}
.migration__desc {
  color: var(--color-ink-soft);
  line-height: 1.7;
  max-width: 560px;
}

.migration__flyways {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 40px;
}
.flyway-btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 12px 20px;
  border: 1px solid var(--color-feather-light);
  background: var(--color-eggshell);
  transition: all 0.3s var(--ease-out);
  position: relative;
  overflow: hidden;
}
.flyway-btn::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 3px; height: 100%;
  background: var(--color-sunset);
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.3s var(--ease-out);
}
.flyway-btn:hover {
  border-color: var(--color-feather-mid);
  transform: translateY(-2px);
}
.flyway-btn.is-active {
  border-color: var(--color-ink);
  background: var(--color-eggshell-2);
}
.flyway-btn.is-active::before {
  transform: scaleY(1);
}
.flyway-btn__dot {
  width: 8px; height: 8px; border-radius: 50%;
  margin-bottom: 4px;
}
.flyway-btn__name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-ink);
}
.flyway-btn__en {
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: var(--color-feather-dark);
  text-transform: uppercase;
}

.migration__map-wrap {
  position: relative;
  border: 1px solid var(--color-feather-light);
  background: var(--color-eggshell);
  padding: 30px;
}
.migration__map {
  width: 100%;
  transform-style: preserve-3d;
  transition: transform 0.1s linear;
}
.migration__map svg {
  width: 100%;
  height: auto;
  display: block;
}

/* 路线动画 */
.route-path {
  stroke-dashoffset: 0;
  animation: route-dash 20s linear infinite;
}
@keyframes route-dash {
  to { stroke-dashoffset: -200; }
}
.route-bird {
  animation: fly-path 8s linear infinite;
}
.route-bird--2 { animation-duration: 8.2s; }
.route-bird--3 { animation-duration: 8.4s; }
@keyframes fly-path {
  0% { offset-distance: 0%; }
  100% { offset-distance: 100%; }
}

/* 站点 */
.station {
  cursor: pointer;
}
.station-pulse {
  transform-origin: center;
  animation: station-pulse 2s ease-out infinite;
}
@keyframes station-pulse {
  0% { r: 5; opacity: 0.6; }
  100% { r: 14; opacity: 0; }
}
.station-label {
  opacity: 0;
  transition: opacity 0.25s;
  pointer-events: none;
}
.station.is-hovered .station-label,
.station:hover .station-label {
  opacity: 1;
}
.station:hover circle:nth-child(1) {
  r: 7;
}

.migration__legend {
  position: absolute;
  top: 30px;
  right: 30px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: var(--color-eggshell);
  border: 1px solid var(--color-feather-light);
  font-size: 0.8rem;
}
.migration__legend-title {
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  color: var(--color-feather-dark);
  margin-bottom: 4px;
}
.migration__legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-ink-soft);
}
.migration__legend-dot {
  width: 20px; height: 2px;
  border-radius: 1px;
  background: var(--color-sunset);
}
.migration__legend-station {
  width: 10px; height: 10px;
  border-radius: 50%;
  background: var(--color-eggshell);
  border: 1.5px solid var(--color-sunset);
}
.migration__legend-bird {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--color-sunset);
  box-shadow: 0 0 4px var(--color-sunset);
}

@media (max-width: 768px) {
  .migration__legend {
    position: static;
    margin-top: 20px;
  }
  .migration__map-wrap {
    padding: 16px;
  }
}
`;

(function injectMigrationStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('migration-styles')) return;
  const style = document.createElement('style');
  style.id = 'migration-styles';
  style.textContent = migrationStyles;
  document.head.appendChild(style);
})();

Object.assign(window, { MigrationMap });
