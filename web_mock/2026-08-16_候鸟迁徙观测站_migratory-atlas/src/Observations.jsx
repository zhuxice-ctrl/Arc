/* ============================================================
   Observations - 实时观测日志
   特色：
   - 日志列表（自动滚动加载 + 时间排序）
   - 新日志从顶部滑入（带涟漪效果）
   - 每小时/每分钟模拟新观测
   - 简单图表：24h 观测数量柱状图
   - 点击日志项展开详细信息
   ============================================================ */

function Observations() {
  const sectionRef = React.useRef(null);
  const chartRef = React.useRef(null);
  const [logs, setLogs] = React.useState([]);
  const [expanded, setExpanded] = React.useState(null);
  const addTimerRef = React.useRef(null);
  const rafKey = 'obs-chart';

  // 模拟日志数据模板
  const logTemplates = [
    { species: '白鹤', en: 'Siberian Crane', count: 12, location: '鄱阳湖大湖池', lat: '29.44°N', lon: '116.08°E', behavior: '栖息觅食', weather: '晴 / 东南风3级', station: '鄱阳湖站' },
    { species: '黑脸琵鹭', en: 'Black-faced Spoonbill', count: 3, location: '崇明东滩', lat: '31.53°N', lon: '121.96°E', behavior: '潮间带觅食', weather: '多云 / 东北风4级', station: '崇明站' },
    { species: '斑头雁', en: 'Bar-headed Goose', count: 86, location: '青海湖', lat: '36.96°N', lon: '100.11°E', behavior: '集群飞行', weather: '晴 / 西北风5级', station: '青海湖站' },
    { species: '普通雨燕', en: 'Common Swift', count: 340, location: '北京故宫', lat: '39.92°N', lon: '116.39°E', behavior: '空中觅食', weather: '晴 / 西南风2级', station: '北京站' },
    { species: '白尾海雕', en: 'White-tailed Eagle', count: 1, location: '盐城湿地', lat: '33.56°N', lon: '120.45°E', behavior: '栖息瞭望', weather: '阴 / 东风3级', station: '盐城站' },
    { species: '东方白鹳', en: 'Oriental Stork', count: 7, location: '黄河三角洲', lat: '37.76°N', lon: '119.09°E', behavior: '湿地觅食', weather: '晴 / 北风4级', station: '黄河口站' },
    { species: '大天鹅', en: 'Whooper Swan', count: 45, location: '荣成天鹅湖', lat: '37.16°N', lon: '122.42°E', behavior: '水面游荡', weather: '晴 / 西北风3级', station: '荣成站' },
    { species: '红隼', en: 'Common Kestrel', count: 2, location: '北戴河', lat: '39.84°N', lon: '119.59°E', behavior: '悬停捕猎', weather: '晴 / 西风2级', station: '北戴河站' },
  ];

  const initLogs = React.useCallback(() => {
    const now = Date.now();
    const initial = logTemplates.map((tpl, i) => ({
      id: `log-${i}`,
      ...tpl,
      time: new Date(now - i * (7 + Math.random() * 15) * 60000),
      observer: `观测员 ${String.fromCharCode(65 + i % 8)}${(i % 20).toString().padStart(2, '0')}`,
    }));
    return initial.sort((a, b) => b.time - a.time);
  }, []);

  React.useEffect(() => {
    setLogs(initLogs());
  }, [initLogs]);

  // 模拟实时新增日志
  React.useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let isVisible = !document.hidden;

    function addLog() {
      if (document.hidden) return;
      const tpl = logTemplates[Math.floor(Math.random() * logTemplates.length)];
      const newLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        ...tpl,
        time: new Date(),
        observer: `观测员 ${String.fromCharCode(65 + Math.floor(Math.random() * 10))}${Math.floor(Math.random() * 30).toString().padStart(2, '0')}`,
      };
      setLogs((prev) => [newLog, ...prev.slice(0, 19)]);
    }

    function scheduleNext() {
      if (addTimerRef.current) clearTimeout(addTimerRef.current);
      const delay = 8000 + Math.random() * 12000; // 8-20秒
      addTimerRef.current = setTimeout(() => {
        if (isVisible) addLog();
        scheduleNext();
      }, delay);
    }

    function onVisibilityChange() {
      isVisible = !document.hidden;
      if (isVisible) {
        scheduleNext();
      } else if (addTimerRef.current) {
        clearTimeout(addTimerRef.current);
        addTimerRef.current = null;
      }
    }

    scheduleNext();
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      if (addTimerRef.current) clearTimeout(addTimerRef.current);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  // ECharts 图表
  React.useEffect(() => {
    const chartEl = chartRef.current;
    if (!chartEl || typeof echarts === 'undefined') return;

    const chart = echarts.init(chartEl, null, { renderer: 'canvas' });
    const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
    const values = [8, 5, 3, 2, 1, 2, 8, 22, 45, 67, 78, 85, 72, 65, 58, 62, 70, 68, 55, 42, 30, 22, 15, 10];

    chart.setOption({
      backgroundColor: 'transparent',
      grid: { top: 20, right: 10, bottom: 30, left: 40 },
      xAxis: {
        type: 'category',
        data: hours,
        axisLine: { lineStyle: { color: '#D9D4CA' } },
        axisTick: { show: false },
        axisLabel: {
          color: '#8A8680',
          fontSize: 10,
          fontFamily: 'JetBrains Mono, monospace',
          interval: 3,
        },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#EDE8DC', type: 'dashed' } },
        axisLabel: {
          color: '#8A8680',
          fontSize: 10,
          fontFamily: 'JetBrains Mono, monospace',
        },
      },
      series: [{
        type: 'bar',
        data: values,
        barWidth: '55%',
        itemStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#E4572E' },
              { offset: 1, color: '#C4411F' },
            ]
          },
          borderRadius: [3, 3, 0, 0],
        },
        emphasis: {
          itemStyle: {
            color: '#1C1B1A',
          }
        }
      }],
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#1C1B1A',
        borderColor: 'transparent',
        textStyle: { color: '#F5F1E8', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 },
        formatter: (params) => `${params[0].axisValue}<br/>观测记录: <strong>${params[0].value}</strong> 条`,
      }
    });

    const resizeHandler = () => chart.resize();
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      chart.dispose();
    };
  }, []);

  // 滚动渐入
  React.useEffect(() => {
    if (!sectionRef.current) return;
    sectionRef.current.querySelectorAll('.reveal').forEach((el) => {
      RevealManager.observe(el);
    });
  }, []);

  const formatTime = (date) => {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    const s = date.getSeconds().toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  return React.createElement('section', {
    ref: sectionRef,
    className: 'observations section',
    id: 'observations',
  },
    React.createElement('div', { className: 'container' },
      React.createElement('div', { className: 'observations__header reveal' },
        React.createElement(SectionIndex, { num: '04', total: '05', label: 'LIVE LOG' }),
        React.createElement('h2', { className: 'display-2 observations__title' },
          '实时',
          React.createElement('em', null, '观测日志'),
          React.createElement('span', { className: 'pulse-dot' }),
        ),
        React.createElement('p', { className: 'observations__desc' },
          '来自 68 个野外观测站的实时数据流，每一条记录都经过双重验证。'
        ),
      ),

      React.createElement('div', { className: 'observations__grid' },
        // 日志列表
        React.createElement('div', { className: 'observations__list-wrap reveal' },
          React.createElement('div', { className: 'observations__list-header' },
            React.createElement('span', { className: 'mono' }, 'RECENT OBSERVATIONS'),
            React.createElement('span', { className: 'observations__live' },
              React.createElement('span', { className: 'live-dot' }),
              'LIVE'
            )
          ),
          React.createElement('div', { className: 'observations__list' },
            logs.map((log, idx) =>
              React.createElement('div', {
                key: log.id,
                className: `log-item ${expanded === log.id ? 'is-expanded' : ''} ${idx === 0 ? 'is-new' : ''}`,
                onClick: () => toggleExpand(log.id),
                'data-cursor-hover': true,
              },
                React.createElement('div', { className: 'log-item__main' },
                  React.createElement('div', { className: 'log-item__time mono' }, formatTime(log.time)),
                  React.createElement('div', { className: 'log-item__species' },
                    React.createElement('span', { className: 'log-item__name' }, log.species),
                    React.createElement('span', { className: 'log-item__en' }, log.en)
                  ),
                  React.createElement('div', { className: 'log-item__count' },
                    React.createElement('strong', null, log.count),
                    React.createElement('span', null, '只')
                  ),
                  React.createElement('div', { className: 'log-item__location' }, log.location)
                ),
                React.createElement('div', { className: 'log-item__detail' },
                  React.createElement('div', { className: 'log-item__detail-grid' },
                    React.createElement('div', null,
                      React.createElement('span', { className: 'mono log-item__detail-label' }, 'COORDINATES'),
                      React.createElement('span', null, `${log.lat} · ${log.lon}`)
                    ),
                    React.createElement('div', null,
                      React.createElement('span', { className: 'mono log-item__detail-label' }, 'BEHAVIOR'),
                      React.createElement('span', null, log.behavior)
                    ),
                    React.createElement('div', null,
                      React.createElement('span', { className: 'mono log-item__detail-label' }, 'WEATHER'),
                      React.createElement('span', null, log.weather)
                    ),
                    React.createElement('div', null,
                      React.createElement('span', { className: 'mono log-item__detail-label' }, 'OBSERVER'),
                      React.createElement('span', null, `${log.observer} · ${log.station}`)
                    ),
                  )
                )
              )
            )
          )
        ),

        // 右侧：24h 统计 + 站点状态
        React.createElement('div', { className: 'observations__side' },
          React.createElement('div', { className: 'chart-card reveal' },
            React.createElement('div', { className: 'chart-card__header' },
              React.createElement('span', { className: 'eyebrow' }, '24H ACTIVITY'),
              React.createElement('span', { className: 'chart-card__value' }, '1,247 ',
                React.createElement('span', { className: 'mono chart-card__unit' }, 'records today')
              )
            ),
            React.createElement('div', { ref: chartRef, className: 'chart-card__canvas' })
          ),

          React.createElement('div', { className: 'station-status reveal' },
            React.createElement('div', { className: 'station-status__header' },
              React.createElement('span', { className: 'eyebrow' }, 'STATION STATUS'),
              React.createElement('span', { className: 'mono station-status__count' }, '68 / 68 online')
            ),
            React.createElement('div', { className: 'station-status__list' },
              [
                { name: '北戴河站', count: 284, status: 'online' },
                { name: '鄱阳湖站', count: 312, status: 'online' },
                { name: '盐城站', count: 198, status: 'online' },
                { name: '崇明站', count: 267, status: 'online' },
                { name: '黄河口站', count: 156, status: 'online' },
                { name: '青海湖站', count: 143, status: 'weak' },
              ].map((s) =>
                React.createElement('div', { key: s.name, className: 'station-status__item' },
                  React.createElement('span', { className: `station-status__dot status-${s.status}` }),
                  React.createElement('span', { className: 'station-status__name' }, s.name),
                  React.createElement('span', { className: 'mono station-status__num' }, `${s.count} 种`)
                )
              )
            )
          )
        )
      )
    )
  );
}

const observationsStyles = `
.observations {
  background: linear-gradient(180deg, var(--color-eggshell-2) 0%, var(--color-eggshell) 100%);
}
.observations__header {
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 600px;
}
.observations__title {
  display: flex;
  align-items: center;
  gap: 14px;
}
.observations__title em {
  font-style: italic;
  color: var(--color-sunset);
  margin-right: 4px;
}
.pulse-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #E4572E;
  position: relative;
  transform: translateY(-4px);
}
.pulse-dot::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: #E4572E;
  animation: pulse-glow 2s ease-out infinite;
}
@keyframes pulse-glow {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(3); opacity: 0; }
}
.observations__desc {
  color: var(--color-ink-soft);
}

.observations__grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 30px;
}

.observations__list-wrap {
  border: 1px solid var(--color-feather-light);
  background: var(--color-eggshell);
  display: flex;
  flex-direction: column;
  max-height: 620px;
}
.observations__list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-feather-light);
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  color: var(--color-feather-dark);
}
.observations__live {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-sunset);
  font-weight: 600;
}
.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-sunset);
  animation: pulse 1.5s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.observations__list {
  flex: 1;
  overflow-y: auto;
}
.observations__list::-webkit-scrollbar { width: 6px; }
.observations__list::-webkit-scrollbar-track { background: transparent; }
.observations__list::-webkit-scrollbar-thumb {
  background: var(--color-feather-light);
  border-radius: 3px;
}

.log-item {
  padding: 14px 20px;
  border-bottom: 1px solid var(--color-feather-light);
  transition: background 0.25s;
  cursor: pointer;
}
.log-item:last-child { border-bottom: none; }
.log-item:hover {
  background: rgba(228, 87, 46, 0.03);
}
.log-item.is-new {
  animation: log-slide-in 0.6s var(--ease-out);
}
@keyframes log-slide-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
    background: rgba(228, 87, 46, 0.1);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    background: transparent;
  }
}
.log-item__main {
  display: grid;
  grid-template-columns: 80px 1.5fr 80px 1fr;
  gap: 16px;
  align-items: center;
}
.log-item__time {
  font-size: 0.75rem;
  color: var(--color-sunset);
  letter-spacing: 0.05em;
}
.log-item__species {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.log-item__name {
  font-weight: 600;
  color: var(--color-ink);
  font-size: 0.95rem;
}
.log-item__en {
  font-size: 0.75rem;
  font-style: italic;
  color: var(--color-feather-dark);
}
.log-item__count {
  display: flex;
  align-items: baseline;
  gap: 3px;
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 1.1rem;
  color: var(--color-ink);
}
.log-item__count span {
  font-size: 0.7rem;
  color: var(--color-feather-dark);
  font-family: var(--font-body);
}
.log-item__location {
  font-size: 0.85rem;
  color: var(--color-feather-dark);
  text-align: right;
}
.log-item__detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s var(--ease-out), padding-top 0.3s;
}
.log-item.is-expanded .log-item__detail {
  max-height: 200px;
  padding-top: 14px;
}
.log-item__detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 14px 16px;
  background: var(--color-eggshell-2);
  border: 1px solid var(--color-feather-light);
}
.log-item__detail-label {
  display: block;
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  color: var(--color-feather-dark);
  margin-bottom: 3px;
}

/* 右侧 */
.observations__side {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.chart-card {
  border: 1px solid var(--color-feather-light);
  background: var(--color-eggshell);
  padding: 20px;
}
.chart-card__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
}
.chart-card__value {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 300;
  color: var(--color-ink);
  font-variation-settings: 'opsz' 28;
}
.chart-card__unit {
  font-size: 0.7rem;
  font-family: var(--font-mono);
  color: var(--color-feather-dark);
  letter-spacing: 0.1em;
}
.chart-card__canvas {
  width: 100%;
  height: 200px;
}

.station-status {
  border: 1px solid var(--color-feather-light);
  background: var(--color-eggshell);
  padding: 20px;
}
.station-status__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.station-status__count {
  font-size: 0.7rem;
  color: var(--color-sunset);
  letter-spacing: 0.1em;
}
.station-status__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.station-status__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  border-bottom: 1px solid var(--color-feather-light);
}
.station-status__item:last-child { border-bottom: none; }
.station-status__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.station-status__dot.status-online {
  background: #1C1B1A;
  box-shadow: 0 0 0 2px rgba(28, 27, 26, 0.15);
}
.station-status__dot.status-weak {
  background: #E4572E;
  animation: weak-blink 2s ease-in-out infinite;
}
@keyframes weak-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.station-status__name {
  flex: 1;
  font-size: 0.85rem;
  color: var(--color-ink);
}
.station-status__num {
  font-size: 0.7rem;
  color: var(--color-feather-dark);
}

@media (max-width: 900px) {
  .observations__grid { grid-template-columns: 1fr; }
  .log-item__main { grid-template-columns: 70px 1fr 60px; }
  .log-item__location { display: none; }
}
`;

(function injectObsStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('obs-styles')) return;
  const style = document.createElement('style');
  style.id = 'obs-styles';
  style.textContent = observationsStyles;
  document.head.appendChild(style);
})();

Object.assign(window, { Observations });
