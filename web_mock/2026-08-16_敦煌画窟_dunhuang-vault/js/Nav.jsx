/* =========================================================
   Nav — 顶部导航
   滚动时收缩 + 背景玻璃化
   ========================================================= */

const { useState, useEffect } = React;

function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = DH.rafThrottle(() => {
      setScrolled(window.scrollY > 40);
    });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#caves', label: '洞窟展厅' },
    { href: '#stories', label: '壁画故事' },
    { href: '#pigments', label: '矿物颜料' },
    { href: '#altar', label: '数字档案' },
  ];

  const handleClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: DH.prefersReducedMotion() ? 'auto' : 'smooth' });
    }
  };

  return (
    <nav className={`nav ${scrolled ? 'is-scrolled' : ''}`} data-screen-label="nav">
      <div className="container nav-inner">
        <a href="#top" className="nav-logo" onClick={(e) => handleClick(e, '#top')}>
          <span className="nav-logo-mark" aria-hidden="true"></span>
          <span>敦煌画窟</span>
        </a>
        <ul className="nav-links">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={(e) => handleClick(e, link.href)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <button className="nav-cta" onClick={(e) => handleClick(e, '#caisson')}>
          入窟观览
        </button>
        <button className="nav-burger" aria-label="菜单">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}

window.Nav = Nav;
