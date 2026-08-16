/* ============================================================
   Navigation - 顶部导航
   特点：
   - 透明初始，滚动后变纸质底
   - 左侧 Logo + 右侧导航项
   - 点击平滑滚动到对应章节
   - 3D 倾斜悬停（各导航项独立）
   ============================================================ */

function Navigation() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navRef = React.useRef(null);

  const navItems = [
    { id: 'about', label: '观测站', sub: 'ABOUT' },
    { id: 'migration', label: '迁徙走廊', sub: 'CORRIDOR' },
    { id: 'species', label: '物种图鉴', sub: 'SPECIES' },
    { id: 'observations', label: '观测日志', sub: 'LOG' },
    { id: 'volunteer', label: '加入我们', sub: 'JOIN' },
  ];

  React.useEffect(() => {
    const onScroll = throttle(() => {
      setScrolled(window.scrollY > 40);
    }, 16);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  // 3D 倾斜悬停（直接操作 DOM，不走 React setState）
  const handleItemMouseMove = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(400px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-1px)`;
  };
  const handleItemMouseLeave = (e) => {
    e.currentTarget.style.transform = '';
  };

  return React.createElement('header', {
    ref: navRef,
    className: `nav ${scrolled ? 'nav--scrolled' : ''} ${mobileOpen ? 'nav--mobile-open' : ''}`,
  },
    React.createElement('div', { className: 'nav__inner container' },
      // Logo
      React.createElement('a', {
        href: '#top',
        className: 'nav__logo',
        onClick: (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); },
        'data-cursor-hover': true,
        'data-cursor-label': 'Top',
      },
        React.createElement('span', { className: 'nav__logo-mark' },
          React.createElement('svg', { viewBox: '0 0 32 32', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' },
            React.createElement('path', {
              d: 'M4 20 C 10 18, 12 10, 18 10 C 24 10, 28 18, 28 22',
              stroke: 'currentColor', strokeWidth: '1.2', strokeLinecap: 'round'
            }),
            React.createElement('path', {
              d: 'M18 10 L 18 6 M22 13 L 24 9 M14 13 L 12 10',
              stroke: 'currentColor', strokeWidth: '0.8', strokeLinecap: 'round'
            }),
            React.createElement('circle', { cx: '16', cy: '22', r: '1.5', fill: 'currentColor' })
          )
        ),
        React.createElement('span', { className: 'nav__logo-text' },
          React.createElement('span', { className: 'nav__logo-main' }, 'Migratory Atlas'),
          React.createElement('span', { className: 'nav__logo-sub mono' }, '迁徙观测站 · est. 1987')
        )
      ),

      // Desktop Nav
      React.createElement('nav', { className: 'nav__items' },
        navItems.map((item) =>
          React.createElement('a', {
            key: item.id,
            href: `#${item.id}`,
            className: 'nav__item',
            onClick: (e) => handleNav(e, item.id),
            onMouseMove: handleItemMouseMove,
            onMouseLeave: handleItemMouseLeave,
            'data-cursor-hover': true,
          },
            React.createElement('span', { className: 'nav__item-label' }, item.label),
            React.createElement('span', { className: 'nav__item-sub mono' }, item.sub)
          )
        ),
        React.createElement('a', {
          href: '#volunteer',
          className: 'btn btn--fill nav__cta shimmer',
          onClick: (e) => handleNav(e, 'volunteer'),
          'data-cursor-hover': true,
          'data-cursor-label': '加入志愿',
        }, 'Become a Volunteer')
      ),

      // Mobile hamburger
      React.createElement('button', {
        className: 'nav__hamburger',
        onClick: () => setMobileOpen(!mobileOpen),
        'aria-label': 'Toggle menu',
        'data-cursor-hover': true,
      },
        React.createElement('span', null),
        React.createElement('span', null),
        React.createElement('span', null),
      )
    ),

    // Mobile menu
    React.createElement('div', { className: 'nav__mobile' },
      navItems.map((item) =>
        React.createElement('a', {
          key: item.id,
          href: `#${item.id}`,
          className: 'nav__mobile-item',
          onClick: (e) => handleNav(e, item.id),
          'data-cursor-hover': true,
        },
          React.createElement('span', { className: 'mono nav__mobile-num' }, item.sub),
          React.createElement('span', null, item.label)
        )
      )
    )
  );
}

// Navigation 样式
const navStyles = `
.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  padding: 18px 0;
  transition: background 0.4s var(--ease-out), padding 0.4s var(--ease-out),
              box-shadow 0.4s var(--ease-out), backdrop-filter 0.4s;
}
.nav--scrolled {
  padding: 12px 0;
  background: rgba(245, 241, 232, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 1px 0 var(--color-feather-light);
}
.nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
}
.nav__logo {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-ink);
}
.nav__logo-mark {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  color: var(--color-sunset);
  transition: transform 0.3s var(--ease-spring);
}
.nav__logo:hover .nav__logo-mark {
  transform: rotate(15deg) scale(1.1);
}
.nav__logo-mark svg { width: 28px; height: 28px; }
.nav__logo-text { display: flex; flex-direction: column; line-height: 1.1; }
.nav__logo-main {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: -0.01em;
}
.nav__logo-sub {
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  color: var(--color-feather-dark);
  margin-top: 2px;
}
.nav__items {
  display: flex;
  align-items: center;
  gap: 6px;
}
.nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 14px;
  color: var(--color-ink);
  line-height: 1.2;
  transition: color 0.25s;
  transform-style: preserve-3d;
}
.nav__item:hover {
  color: var(--color-sunset);
}
.nav__item-label {
  font-size: 0.88rem;
  font-weight: 500;
}
.nav__item-sub {
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  color: var(--color-feather-dark);
  margin-top: 2px;
  transition: color 0.25s;
}
.nav__item:hover .nav__item-sub {
  color: var(--color-sunset);
}
.nav__cta {
  margin-left: 12px;
  padding: 10px 18px;
  font-size: 0.7rem;
}

/* Hamburger */
.nav__hamburger {
  display: none;
  width: 40px; height: 40px;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
.nav__hamburger span {
  display: block;
  width: 22px; height: 1.5px;
  background: var(--color-ink);
  transition: transform 0.3s var(--ease-out), opacity 0.3s;
}
.nav--mobile-open .nav__hamburger span:nth-child(1) {
  transform: translateY(6.5px) rotate(45deg);
}
.nav--mobile-open .nav__hamburger span:nth-child(2) {
  opacity: 0;
}
.nav--mobile-open .nav__hamburger span:nth-child(3) {
  transform: translateY(-6.5px) rotate(-45deg);
}

/* Mobile menu */
.nav__mobile {
  display: none;
  position: fixed;
  top: 64px; left: 0; right: 0;
  background: var(--color-eggshell);
  padding: 20px var(--gutter) 30px;
  border-bottom: 1px solid var(--color-feather-light);
  flex-direction: column;
  gap: 4px;
  transform: translateY(-100%);
  opacity: 0;
  pointer-events: none;
  transition: transform 0.4s var(--ease-out), opacity 0.3s;
}
.nav--mobile-open .nav__mobile {
  transform: translateY(0);
  opacity: 1;
  pointer-events: auto;
}
.nav__mobile-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid var(--color-feather-light);
  font-size: 1.1rem;
  font-weight: 500;
}
.nav__mobile-num {
  color: var(--color-sunset);
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  min-width: 50px;
}

@media (max-width: 900px) {
  .nav__items { display: none; }
  .nav__hamburger { display: flex; }
  .nav__mobile { display: flex; }
  .nav__logo-sub { display: none; }
}
`;

// 注入样式
(function injectNavStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('nav-styles')) return;
  const style = document.createElement('style');
  style.id = 'nav-styles';
  style.textContent = navStyles;
  document.head.appendChild(style);
})();

Object.assign(window, { Navigation });
