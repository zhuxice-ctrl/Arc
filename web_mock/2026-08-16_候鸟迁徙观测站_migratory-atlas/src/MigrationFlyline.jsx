/* ============================================================
   MigrationFlyline - 贯穿页面的迁徙飞线（签名元素）
   一条 SVG 路径从 Hero 起笔，贯穿各章节
   光点（候鸟）沿路径飞行，途经各章节节点
   ============================================================ */

function MigrationFlyline() {
  const svgRef = React.useRef(null);

  React.useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const svg = svgRef.current;
    if (!svg) return;

    let isVisible = !document.hidden;
    let rafId = null;

    // 页面高度变化时更新 SVG 高度
    function updateHeight() {
      const h = document.documentElement.scrollHeight;
      svg.setAttribute('height', h);
      svg.style.height = h + 'px';

      // 根据章节位置生成路径
      const sections = ['about', 'migration', 'species', 'observations', 'volunteer'];
      const points = [];

      // 起点：Hero 下方约 80vh 处
      const hero = document.getElementById('top');
      if (hero) {
        const rect = hero.getBoundingClientRect();
        points.push({ x: window.innerWidth * 0.85, y: rect.bottom * 0.7 });
      }

      sections.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          const x = window.innerWidth * (0.15 + ((i % 3) * 0.3));
          points.push({ x, y: top + rect.height * 0.4 });
        }
      });

      // 终点：页脚
      const footer = document.querySelector('.footer');
      if (footer) {
        const rect = footer.getBoundingClientRect();
        points.push({ x: window.innerWidth * 0.75, y: rect.top + window.scrollY + 40 });
      }

      // 生成平滑贝塞尔路径
      if (points.length >= 2) {
        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
          const prev = points[i - 1];
          const curr = points[i];
          const cpx = (prev.x + curr.x) / 2;
          const cpy1 = prev.y + (curr.y - prev.y) * 0.4;
          const cpy2 = curr.y - (curr.y - prev.y) * 0.4;
          d += ` C ${cpx} ${cpy1}, ${cpx} ${cpy2}, ${curr.x} ${curr.y}`;
        }
        const path = svg.querySelector('.flyline-path');
        if (path) {
          path.setAttribute('d', d);

          // 沿路径的光点
          const birds = svg.querySelectorAll('.flyline-bird');
          birds.forEach((bird, idx) => {
            bird.style.offsetPath = `path('${d}')`;
          });
        }
      }
    }

    const resizeHandler = debounce(updateHeight, 200);
    const scrollHandler = throttle(() => {
      // 滚动时更新小鸟沿路径的位置（视差感）
      // 这里用 CSS offset 动画已经足够，不需要 JS 控制位置
    }, 100);

    function onVisibilityChange() {
      isVisible = !document.hidden;
    }

    // 初始化
    const initTimer = setTimeout(updateHeight, 1000);

    window.addEventListener('resize', resizeHandler);
    window.addEventListener('scroll', scrollHandler, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      clearTimeout(initTimer);
      window.removeEventListener('resize', resizeHandler);
      window.removeEventListener('scroll', scrollHandler);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return React.createElement('svg', {
    ref: svgRef,
    className: 'migration-flyline-page',
    'aria-hidden': 'true',
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      pointerEvents: 'none',
      zIndex: 1,
    }
  },
    React.createElement('path', {
      className: 'flyline-path',
      fill: 'none',
      stroke: '#E4572E',
      strokeWidth: '0.8',
      strokeDasharray: '3 7',
      opacity: '0.25',
    }),
    // 3 只沿路径飞的候鸟（不同速度/相位）
    React.createElement('circle', {
      className: 'flyline-bird flyline-bird--1',
      r: '2.5',
      fill: '#E4572E',
      style: { animation: 'flyline-fly 30s linear infinite' }
    }),
    React.createElement('circle', {
      className: 'flyline-bird flyline-bird--2',
      r: '1.8',
      fill: '#E4572E',
      style: { animation: 'flyline-fly 35s linear infinite', animationDelay: '-10s', opacity: '0.6' }
    }),
    React.createElement('circle', {
      className: 'flyline-bird flyline-bird--3',
      r: '1.8',
      fill: '#E4572E',
      style: { animation: 'flyline-fly 40s linear infinite', animationDelay: '-22s', opacity: '0.4' }
    }),
  );
}

// 飞线动画样式
const flylinePageStyles = `
.migration-flyline-page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
  z-index: 1;
}
.flyline-bird {
  offset-rotate: auto;
  filter: drop-shadow(0 0 4px rgba(228, 87, 46, 0.7));
}
@keyframes flyline-fly {
  0% { offset-distance: 0%; }
  100% { offset-distance: 100%; }
}
@media (prefers-reduced-motion: reduce) {
  .flyline-bird { animation: none; offset-distance: 50%; }
  .migration-flyline-page { display: none; }
}
`;

(function injectFlylineStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('flyline-page-styles')) return;
  const style = document.createElement('style');
  style.id = 'flyline-page-styles';
  style.textContent = flylinePageStyles;
  document.head.appendChild(style);
})();

Object.assign(window, { MigrationFlyline });
