// Solar Terms Page - Timeline layout with scroll-driven animations
const SolarTermsPage = () => {
  const itemsRef = React.useRef([]);
  const screenRef = React.useRef(null);
  const solarImg = '/spark/app/app_17ca72j21fx/runtime/api/v1/storage/object/bucket_aadkqmc4y4ecw_static/static%2Faadkql5xvmymw_ve_miaoda';

  const checkVisibility = () => {
    itemsRef.current.forEach((el) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        el.classList.add('visible');
      }
    });
  };

  React.useEffect(() => {
    const screen = screenRef.current;
    if (!screen) return;

    const onScroll = () => {
      requestAnimationFrame(checkVisibility);
    };

    screen.addEventListener('scroll', onScroll, { passive: true });
    checkVisibility();

    return () => screen.removeEventListener('scroll', onScroll);
  }, []);

  const currentTerm = SOLAR_TERMS[CURRENT_SOLAR_INDEX];

  return (
    <div className="screen" ref={screenRef} id="screen-solar">
      <div className="large-nav">
        <div className="nav-inner">
          <h1>节气养生</h1>
        </div>
      </div>
      <div className="scroll-content">
        {/* Hero */}
        <div className="solar-hero">
          <img src={solarImg} alt="节气养生" />
          <div className="solar-hero-overlay">
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.1em', marginBottom: 4 }}>
              当前节气 · 第 {CURRENT_SOLAR_INDEX + 1} 节
            </div>
            <h2 className="solar-current-term">{currentTerm.term}</h2>
            <p className="solar-current-sub">{currentTerm.tip}</p>
          </div>
        </div>

        {/* Section header */}
        <div style={{ padding: '24px 20px 8px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 700, color: 'var(--ink-black)' }}>
            二十四节气
          </h2>
          <p style={{ fontSize: 12, color: 'var(--gray-brown)', marginTop: 4 }}>
            顺时养生，应季调养
          </p>
        </div>

        {/* Timeline */}
        <div className="timeline">
          {SOLAR_TERMS.map((item, idx) => (
            <div
              key={idx}
              className="timeline-item"
              ref={el => itemsRef.current[idx] = el}
              style={{ transitionDelay: `${(idx % 4) * 0.05}s` }}
            >
              <div className="timeline-date">
                <div className="month">{item.month}</div>
                <div className="day">{item.date}</div>
              </div>
              <div className={`timeline-node ${idx === CURRENT_SOLAR_INDEX ? 'current' : ''}`} />
              <div className="timeline-content">
                <div className="timeline-term">{item.term}
                  {idx === CURRENT_SOLAR_INDEX && (
                    <span style={{
                      fontSize: 10,
                      marginLeft: 8,
                      padding: '2px 6px',
                      background: 'var(--terracotta-light)',
                      color: 'var(--terracotta)',
                      borderRadius: 4,
                      fontWeight: 600,
                      verticalAlign: 'middle'
                    }}>当前</span>
                  )}
                </div>
                <div className="timeline-herb">
                  <div className="timeline-herb-icon">{item.icon}</div>
                  <div>
                    <div className="timeline-herb-name">推荐：{item.herb}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray-brown)', marginTop: 2 }}>
                      {item.tip.split('，')[0]}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', padding: '8px 20px 20px', fontSize: 11, color: 'var(--gray-brown)' }}>
          — 顺应四时 · 颐养天年 —
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { SolarTermsPage });
