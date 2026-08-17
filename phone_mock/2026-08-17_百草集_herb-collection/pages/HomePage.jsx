// Home Page - Herbal Discovery
const HomePage = ({ onNavigate, onHerbClick }) => {
  const heroImage = '/spark/app/app_17ca72j21fx/runtime/api/v1/storage/object/bucket_aadkqmc4y4ecw_static/static%2Faadkql55ytags_ve_miaoda';
  const collectionImg = '/spark/app/app_17ca72j21fx/runtime/api/v1/storage/object/bucket_aadkqmc4y4ecw_static/static%2Faadkql56m7agw_ve_miaoda';
  const solarImg = '/spark/app/app_17ca72j21fx/runtime/api/v1/storage/object/bucket_aadkqmc4y4ecw_static/static%2Faadkql5xvmymw_ve_miaoda';

  const featuredHerbs = HERBS_DATA.slice(0, 8);
  const currentTerm = SOLAR_TERMS[CURRENT_SOLAR_INDEX];

  return (
    <div className="screen" id="screen-home">
      <div className="large-nav">
        <div className="nav-inner">
          <h1>百草集</h1>
        </div>
      </div>
      <div className="scroll-content animate-in">
        {/* Hero Banner */}
        <div className="hero-banner" onClick={() => onHerbClick(HERBS_DATA[0])}>
          <img src={heroImage} alt="当归" />
          <div className="hero-overlay">
            <span className="hero-tag">立秋 · 时令草药</span>
            <h2 className="hero-title">当归 · 补血圣药</h2>
            <p className="hero-sub">补血活血，调经止痛，润肠通便</p>
          </div>
        </div>

        {/* Quick filters */}
        <div className="section-header">
          <h2 className="section-title">时令推荐</h2>
          <span className="section-more" onClick={() => onNavigate('solar')}>查看节气</span>
        </div>
        <div className="h-scroll">
          {featuredHerbs.slice(0, 6).map(herb => (
            <div key={herb.id} className="h-card" onClick={() => onHerbClick(herb)}>
              <div className="h-card-img">{herb.icon}</div>
              <div className="h-card-body">
                <div className="h-card-name">{herb.name}</div>
                <div className="h-card-nature">
                  <span className={`nature-tag nature-${
                    herb.nature.includes('温') ? 'warm' :
                    herb.nature.includes('寒') ? 'cool' :
                    herb.nature.includes('平') ? 'neutral' : 'pungent'
                  }`}>{herb.nature}</span>
                  {herb.category}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mosaic Grid */}
        <div className="section-header">
          <h2 className="section-title">探索分类</h2>
          <span className="section-more" onClick={() => onNavigate('pharma')}>全部药典</span>
        </div>
        <div className="mosaic-grid">
          <div className="mosaic-item tall" onClick={() => onNavigate('pharma')}>
            <img src={collectionImg} alt="百草图鉴" />
            <div className="mosaic-label">百草图鉴</div>
          </div>
          <div className="mosaic-item" onClick={() => onNavigate('solar')}>
            <img src={solarImg} alt="节气养生" style={{ minHeight: 100 }} />
            <div className="mosaic-label">节气养生</div>
          </div>
          <div className="mosaic-item" onClick={() => onNavigate('prescriptions')}>
            <div style={{ padding: '16px 12px', background: 'linear-gradient(135deg, #EDE2C7, #D4C093)', minHeight: 100, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 28 }}>📜</span>
              <span style={{ color: 'var(--ink-black)', fontWeight: 600, fontSize: 13 }}>经典药方</span>
            </div>
          </div>
          <div className="mosaic-item wide" onClick={() => onNavigate('cabinet')}>
            <div style={{ padding: '20px 16px', background: 'linear-gradient(135deg, #3A6B35, #2D5429)', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                🏺
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: 15, marginBottom: 2 }}>我的药柜</div>
                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>已收录 24 / 500 种草药</div>
              </div>
            </div>
          </div>
        </div>

        {/* Today knowledge */}
        <div className="section-header">
          <h2 className="section-title">每日一药</h2>
          <span className="section-more">更多</span>
        </div>
        <div style={{ margin: '0 20px', padding: 16, background: 'var(--rice-paper)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', display: 'flex', gap: 14 }}
             onClick={() => onHerbClick(HERBS_DATA[3])}>
          <div style={{ width: 60, height: 60, borderRadius: 'var(--radius-sm)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, flexShrink: 0 }}>
            {HERBS_DATA[3].icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 700, color: 'var(--ink-black)', marginBottom: 4 }}>
              {HERBS_DATA[3].name}
              <span style={{ fontSize: 11, color: 'var(--gray-brown)', fontWeight: 400, marginLeft: 6, fontStyle: 'italic' }}>
                {HERBS_DATA[3].pinyin}
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--gray-brown)', lineHeight: 1.5, marginBottom: 6 }}>
              {HERBS_DATA[3].effect}
            </div>
            <div style={{ fontSize: 11, color: 'var(--terracotta)', fontWeight: 500 }}>
              「百草之王 · 大补元气」
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '20px 0 8px', fontSize: 11, color: 'var(--gray-brown)' }}>
          — 草本精华 · 传承千年 —
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { HomePage });
