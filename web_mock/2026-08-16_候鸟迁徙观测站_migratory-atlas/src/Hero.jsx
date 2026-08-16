/* ============================================================
   Hero - 首屏
   包含：
   - 迁徙路径 SVG 动画（路径描边延伸）
   - 打字机大标题
   - 数字计数（观测物种数、站点数、志愿者数）
   - 罗盘装饰（视差跟随鼠标）
   - 羽翼扇动分隔动效
   ============================================================ */

function Hero() {
  const heroRef = React.useRef(null);
  const titleRef = React.useRef(null);
  const subtitleRef = React.useRef(null);
  const compassRef = React.useRef(null);
  const flylineRef = React.useRef(null);
  const countersRef = React.useRef([]);

  const [typed, setTyped] = React.useState('');
  const fullTitle = '候鸟迁徙观测站';
  const fullEn = 'Migratory Atlas';

  // 打字机效果
  React.useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setTyped(fullTitle);
      return;
    }

    let i = 0;
    let timer = null;
    const type = () => {
      if (i <= fullTitle.length) {
        setTyped(fullTitle.slice(0, i));
        i++;
        timer = setTimeout(type, 120 + Math.random() * 80);
      }
    };
    // 延迟启动
    const startTimer = setTimeout(type, 600);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(timer);
    };
  }, []);

  // 数字计数
  React.useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const counters = [
      { el: null, target: 327, suffix: '+', label: '观测物种' },
      { el: null, target: 68, suffix: '', label: '野外观测站' },
      { el: null, target: 2845, suffix: '+', label: '登记志愿者' },
    ];

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('.counter__num');
          items.forEach((el, idx) => {
            const target = parseInt(el.dataset.target, 10);
            const suffix = el.dataset.suffix || '';
            if (prefersReduced) {
              el.textContent = target + suffix;
              return;
            }
            animateCounter(el, target, suffix);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    if (countersRef.current) {
      observer.observe(countersRef.current);
    }

    function animateCounter(el, target, suffix) {
      const duration = 1800 + Math.random() * 600;
      const start = performance.now();
      const startVal = 0;

      function step(t) {
        const progress = Math.min((t - start) / duration, 1);
        const eased = Ease.outExpo(progress);
        const val = Math.floor(startVal + (target - startVal) * eased);
        el.textContent = val.toLocaleString() + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }
      requestAnimationFrame(step);
    }

    return () => observer.disconnect();
  }, []);

  // 迁徙飞线动画
  React.useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const path = flylineRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    if (prefersReduced) {
      path.style.strokeDashoffset = 0;
      return;
    }

    let startTime = null;
    const duration = 2500;

    function animate(t) {
      if (!startTime) startTime = t;
      const progress = Math.min((t - startTime) / duration, 1);
      const eased = Ease.outCubic(progress);
      path.style.strokeDashoffset = length * (1 - eased);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }
    const startTimer = setTimeout(() => {
      requestAnimationFrame(animate);
    }, 300);

    return () => clearTimeout(startTimer);
  }, []);

  // 罗盘视差（鼠标移动 → 罗盘倾斜）
  React.useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const compass = compassRef.current;
    if (!compass) return;

    let rafId = null;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let isVisible = !document.hidden;

    const onMouseMove = throttle((e) => {
      const rect = compass.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetX = (e.clientX - cx) / rect.width;
      targetY = (e.clientY - cy) / rect.height;
    }, 16);

    function tick() {
      if (!isVisible) { rafId = null; return; }
      // 弹簧跟随
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      compass.style.transform = `perspective(800px) rotateY(${currentX * 12}deg) rotateX(${-currentY * 12}deg)`;
      // 指针跟随
      const needle = compass.querySelector('.compass-needle');
      if (needle) {
        const angle = Math.atan2(currentY, currentX) * 180 / Math.PI;
        needle.style.transform = `rotate(${angle + 90}deg)`;
      }
      rafId = requestAnimationFrame(tick);
    }

    function onVisibilityChange() {
      isVisible = !document.hidden;
      if (isVisible && !rafId) {
        rafId = requestAnimationFrame(tick);
      } else if (!isVisible && rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
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

  // 滚动视差 - Hero 内容上移淡出
  React.useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const hero = heroRef.current;
    if (!hero) return;

    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const compass = compassRef.current;

    let rafId = null;
    let isVisible = !document.hidden;
    let scrollY = 0;

    const onScroll = throttle(() => {
      scrollY = window.scrollY;
    }, 16);

    function tick() {
      if (!isVisible) { rafId = null; return; }
      const h = hero.offsetHeight;
      const progress = Math.min(scrollY / h, 1);
      if (title) {
        title.style.transform = `translateY(${progress * -40}px)`;
        title.style.opacity = 1 - progress * 0.6;
      }
      if (subtitle) {
        subtitle.style.transform = `translateY(${progress * -20}px)`;
        subtitle.style.opacity = 1 - progress * 0.8;
      }
      if (compass) {
        compass.style.transform = `translateY(${progress * 60}px) scale(${1 + progress * 0.1})`;
        compass.style.opacity = 1 - progress * 0.7;
      }
      rafId = requestAnimationFrame(tick);
    }

    function onVisibilityChange() {
      isVisible = !document.hidden;
      if (isVisible && !rafId) rafId = requestAnimationFrame(tick);
      else if (!isVisible && rafId) { cancelAnimationFrame(rafId); rafId = null; }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return React.createElement('section', { ref: heroRef, className: 'hero', id: 'top' },
    // 背景迁徙飞线
    React.createElement('svg', {
      className: 'hero__flyline',
      viewBox: '0 0 1440 800',
      preserveAspectRatio: 'xMidYMid slice',
      'aria-hidden': 'true',
    },
      React.createElement('path', {
        ref: flylineRef,
        className: 'hero__flyline-path',
        d: 'M -50 500 C 200 300, 400 650, 600 450 S 1000 200, 1200 380 S 1500 550, 1600 300',
      }),
      // 飞线上的小候鸟光点
      React.createElement('circle', {
        className: 'hero__flyline-bird',
        cx: '0', cy: '0', r: '3',
        fill: '#E4572E',
      })
    ),

    // 网格背景（经纬度感）
    React.createElement('div', { className: 'hero__grid', 'aria-hidden': 'true' }),

    React.createElement('div', { className: 'hero__inner container' },
      React.createElement('div', { className: 'hero__content' },
        React.createElement('div', { className: 'hero__eyebrow eyebrow reveal' },
          'Est. 1987 · 全球候鸟迁徙观测网络'
        ),
        React.createElement('h1', {
          ref: titleRef,
          className: 'hero__title display-1',
        },
          React.createElement('span', { className: 'hero__title-zh' },
            typed,
            React.createElement('span', { className: 'hero__caret', 'aria-hidden': 'true' }, '|')
          ),
          React.createElement('span', { ref: subtitleRef, className: 'hero__title-en' },
            fullEn
          )
        ),
        React.createElement('p', { className: 'hero__desc body-lg reveal' },
          '我们追踪全球候鸟的飞行轨迹，记录它们穿越纬度的每一次振翅。\n' +
          '从西伯利亚到东南亚，从北极圈到赤道雨林——\n' +
          '每一只候鸟都是天空的信使，每一次迁徙都是生命的史诗。'
        ),
        React.createElement('div', { className: 'hero__actions reveal' },
          React.createElement('a', {
            href: '#migration',
            className: 'btn btn--fill shimmer',
            onClick: (e) => {
              e.preventDefault();
              document.getElementById('migration')?.scrollIntoView({ behavior: 'smooth' });
            },
            'data-cursor-hover': true,
            'data-cursor-label': 'Explore',
          },
            '探索迁徙走廊',
            React.createElement('span', { className: 'btn__arrow' }, '→')
          ),
          React.createElement('a', {
            href: '#species',
            className: 'btn shimmer',
            onClick: (e) => {
              e.preventDefault();
              document.getElementById('species')?.scrollIntoView({ behavior: 'smooth' });
            },
            'data-cursor-hover': true,
          },
            '浏览物种图鉴',
          ),
        ),

        // 计数数据
        React.createElement('div', { ref: countersRef, className: 'hero__counters reveal' },
          [
            { value: '327', suffix: '+', label: '观测物种', sub: 'Species' },
            { value: '68', suffix: '', label: '野外观测站', sub: 'Field Stations' },
            { value: '2,845', suffix: '+', label: '登记志愿者', sub: 'Volunteers' },
          ].map((c) =>
            React.createElement('div', { key: c.label, className: 'counter' },
              React.createElement('div', {
                className: 'counter__num display-2',
                'data-target': c.value.replace(/,/g, ''),
                'data-suffix': c.suffix,
              }, '0'),
              React.createElement('div', { className: 'counter__label' },
                React.createElement('span', null, c.label),
                React.createElement('span', { className: 'mono counter__sub' }, c.sub)
              )
            )
          )
        )
      ),

      // 罗盘装饰
      React.createElement('div', {
        ref: compassRef,
        className: 'hero__compass no-select',
        'aria-hidden': 'true',
      },
        React.createElement('svg', { viewBox: '0 0 300 300', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' },
          // 外圈刻度
          React.createElement('circle', { cx: '150', cy: '150', r: '140', stroke: 'var(--color-feather-light)', strokeWidth: '0.5' }),
          React.createElement('circle', { cx: '150', cy: '150', r: '120', stroke: 'var(--color-feather-light)', strokeWidth: '0.5' }),
          // 刻度线
          ...Array.from({ length: 36 }, (_, i) => {
            const angle = i * 10 * Math.PI / 180;
            const r1 = i % 9 === 0 ? 110 : 115;
            const r2 = 120;
            const x1 = 150 + r1 * Math.sin(angle);
            const y1 = 150 - r1 * Math.cos(angle);
            const x2 = 150 + r2 * Math.sin(angle);
            const y2 = 150 - r2 * Math.cos(angle);
            return React.createElement('line', {
              key: i, x1, y1, x2, y2,
              stroke: 'var(--color-feather-mid)', strokeWidth: i % 9 === 0 ? '1' : '0.5'
            });
          }),
          // 方向文字
          React.createElement('text', { x: '150', y: '35', textAnchor: 'middle', className: 'mono', fontSize: '11', fill: 'var(--color-ink)', fontWeight: '600' }, 'N'),
          React.createElement('text', { x: '265', y: '154', textAnchor: 'middle', className: 'mono', fontSize: '11', fill: 'var(--color-feather-dark)' }, 'E'),
          React.createElement('text', { x: '150', y: '273', textAnchor: 'middle', className: 'mono', fontSize: '11', fill: 'var(--color-feather-dark)' }, 'S'),
          React.createElement('text', { x: '35', y: '154', textAnchor: 'middle', className: 'mono', fontSize: '11', fill: 'var(--color-feather-dark)' }, 'W'),
          // 纬度圈标注
          React.createElement('text', { x: '150', y: '65', textAnchor: 'middle', className: 'mono', fontSize: '8', fill: 'var(--color-feather-dark)', letterSpacing: '1' }, '66.5° N'),
          React.createElement('text', { x: '150', y: '240', textAnchor: 'middle', className: 'mono', fontSize: '8', fill: 'var(--color-feather-dark)', letterSpacing: '1' }, '23.5° N'),
          // 指针（会跟随鼠标旋转）
          React.createElement('g', { className: 'compass-needle', style: { transformOrigin: '150px 150px', transition: 'transform 0.3s ease-out' } },
            React.createElement('path', { d: 'M150 50 L158 150 L150 160 L142 150 Z', fill: '#E4572E' }),
            React.createElement('path', { d: 'M150 250 L158 150 L150 140 L142 150 Z', fill: '#1C1B1A' }),
          ),
          // 中心圆
          React.createElement('circle', { cx: '150', cy: '150', r: '6', fill: 'var(--color-ink)' }),
          React.createElement('circle', { cx: '150', cy: '150', r: '3', fill: 'var(--color-eggshell)' }),
          // 迁徙路径指示（小弧线）
          React.createElement('path', {
            d: 'M 100 90 A 70 70 0 0 1 200 210',
            stroke: '#E4572E', strokeWidth: '0.8', strokeDasharray: '4 4', fill: 'none',
            opacity: '0.6'
          })
        )
      )
    ),

    // 底部滚动提示
    React.createElement('div', { className: 'hero__scroll-hint no-select' },
      React.createElement('span', { className: 'mono' }, 'SCROLL'),
      React.createElement('span', { className: 'hero__scroll-line' })
    )
  );
}

// Hero 样式
const heroStyles = `
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 120px 0 80px;
  overflow: hidden;
}
.hero__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--color-feather-light) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-feather-light) 1px, transparent 1px);
  background-size: 80px 80px;
  opacity: 0.3;
  mask-image: radial-gradient(ellipse at center, black 20%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse at center, black 20%, transparent 75%);
}
.hero__flyline {
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}
.hero__flyline-path {
  fill: none;
  stroke: var(--color-sunset);
  stroke-width: 1.2;
  filter: drop-shadow(0 0 8px rgba(228, 87, 46, 0.4));
}
.hero__flyline-bird {
  offset-path: path('M -50 500 C 200 300, 400 650, 600 450 S 1000 200, 1200 380 S 1500 550, 1600 300');
  animation: fly-along 6s linear infinite;
  filter: drop-shadow(0 0 4px rgba(228, 87, 46, 0.8));
}
@keyframes fly-along {
  0% { offset-distance: 0%; }
  100% { offset-distance: 100%; }
}

.hero__inner {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 60px;
  align-items: center;
  width: 100%;
}
.hero__content {
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.hero__eyebrow {
  color: var(--color-sunset);
}
.hero__title {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--color-ink);
}
.hero__title-zh {
  font-weight: 300;
}
.hero__title-en {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 300;
  font-size: clamp(1.2rem, 2vw, 2rem);
  color: var(--color-feather-dark);
  letter-spacing: 0.02em;
  margin-top: 4px;
}
.hero__caret {
  display: inline-block;
  color: var(--color-sunset);
  animation: blink 1s step-end infinite;
  margin-left: 2px;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.hero__desc {
  color: var(--color-ink-soft);
  max-width: 520px;
  white-space: pre-line;
}
.hero__actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 8px;
}
.btn__arrow {
  display: inline-block;
  transition: transform 0.3s var(--ease-out);
}
.btn:hover .btn__arrow {
  transform: translateX(4px);
}
.hero__counters {
  display: flex;
  gap: 40px;
  margin-top: 20px;
  padding-top: 24px;
  border-top: 1px solid var(--color-feather-light);
}
.counter {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.counter__num {
  font-family: var(--font-display);
  font-weight: 300;
  color: var(--color-ink);
  font-variation-settings: 'opsz' 40;
}
.counter__label {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.9rem;
  color: var(--color-ink);
}
.counter__sub {
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  color: var(--color-feather-dark);
  text-transform: uppercase;
}

/* 罗盘 */
.hero__compass {
  position: relative;
  width: 100%;
  max-width: 420px;
  justify-self: end;
  transition: transform 0.1s linear;
  transform-style: preserve-3d;
}
.hero__compass svg {
  width: 100%;
  height: auto;
}

/* 滚动提示 */
.hero__scroll-hint {
  position: absolute;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: var(--color-feather-dark);
  font-size: 0.65rem;
  letter-spacing: 0.25em;
  z-index: 2;
}
.hero__scroll-line {
  width: 1px;
  height: 40px;
  background: var(--color-feather-mid);
  position: relative;
  overflow: hidden;
}
.hero__scroll-line::after {
  content: '';
  position: absolute;
  top: -100%;
  left: 0;
  width: 100%;
  height: 50%;
  background: var(--color-sunset);
  animation: scroll-line-fall 2.5s ease-in-out infinite;
}
@keyframes scroll-line-fall {
  0% { top: -50%; }
  100% { top: 100%; }
}

@media (max-width: 900px) {
  .hero__inner {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .hero__compass {
    max-width: 280px;
    justify-self: center;
    opacity: 0.6;
    position: absolute;
    top: 25%;
    right: -10%;
    width: 60%;
    z-index: 0;
  }
  .hero__content {
    position: relative;
    z-index: 1;
  }
  .hero__counters {
    gap: 24px;
    flex-wrap: wrap;
  }
}
`;

(function injectHeroStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('hero-styles')) return;
  const style = document.createElement('style');
  style.id = 'hero-styles';
  style.textContent = heroStyles;
  document.head.appendChild(style);
})();

Object.assign(window, { Hero });
