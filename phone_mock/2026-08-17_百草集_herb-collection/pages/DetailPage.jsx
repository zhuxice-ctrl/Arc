// Detail Page - Full screen hero with parallax + bottom action bar
const DetailPage = ({ herb, onBack }) => {
  const [scrollY, setScrollY] = React.useState(0);
  const [isFavorited, setIsFavorited] = React.useState(false);
  const [showAddPrescription, setShowAddPrescription] = React.useState(false);
  const screenRef = React.useRef(null);
  const rafId = React.useRef(null);
  const heroImgRef = React.useRef(null);

  const handleScroll = () => {
    if (!screenRef.current) return;
    const y = screenRef.current.scrollTop;
    setScrollY(y);
  };

  React.useEffect(() => {
    const screen = screenRef.current;
    if (!screen) return;
    screen.addEventListener('scroll', handleScroll, { passive: true });
    return () => screen.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax effect
  const parallaxScale = 1 + Math.max(0, scrollY) * 0.0005;
  const parallaxBlur = Math.min(8, Math.max(0, scrollY) * 0.02);
  const titleOpacity = Math.max(0, 1 - scrollY / 200);

  const ginsengImg = '/spark/app/app_17ca72j21fx/runtime/api/v1/storage/object/bucket_aadkqmc4y4ecw_static/static%2Faadkql6do56ew_ve_miaoda';
  const heroImg = herb?.id === 'renshen' ? ginsengImg : 
    herb?.id === 'danggui' ? '/spark/app/app_17ca72j21fx/runtime/api/v1/storage/object/bucket_aadkqmc4y4ecw_static/static%2Faadkql55ytags_ve_miaoda' :
    '/spark/app/app_17ca72j21fx/runtime/api/v1/storage/object/bucket_aadkqmc4y4ecw_static/static%2Faadkql56m7agw_ve_miaoda';

  if (!herb) return null;

  const getNatureClass = (nature) => {
    if (nature.includes('温')) return 'nature-warm';
    if (nature.includes('寒')) return 'nature-cool';
    if (nature.includes('平')) return 'nature-neutral';
    return 'nature-pungent';
  };

  return (
    <div className="screen detail-screen" ref={screenRef} id="screen-detail">
      {/* Hero */}
      <div className="detail-hero">
        <img
          ref={heroImgRef}
          src={heroImg}
          alt={herb.name}
          style={{
            transform: `scale(${parallaxScale})`,
            filter: `blur(${parallaxBlur}px)`,
          }}
        />
        <div className="detail-hero-overlay" />
        <div className="detail-back-btn" onClick={onBack}>
          <Icon.ChevronLeft size={22} color="white" />
        </div>
        <div className="detail-share-btn">
          <Icon.Share size={18} color="white" />
        </div>
        <div
          className="detail-title-area"
          style={{ opacity: titleOpacity, transform: `translateY(${scrollY * 0.3}px)` }}
        >
          <div className="detail-nature-tags">
            <span className={`nature-tag ${getNatureClass(herb.nature)}`} style={{ fontSize: 12, padding: '4px 10px' }}>
              {herb.nature}
            </span>
            <span className="nature-tag nature-neutral" style={{ fontSize: 12, padding: '4px 10px', background: 'rgba(255,255,255,0.3)', color: 'white' }}>
              {herb.taste}
            </span>
          </div>
          <h1 className="detail-name" style={{ marginTop: 10 }}>{herb.name}</h1>
          <p className="detail-pinyin">{herb.pinyin} · {herb.category}</p>
        </div>
      </div>

      {/* Body */}
      <div className="detail-body">
        {/* Description */}
        <div className="detail-section">
          <h2 className="detail-section-title">药材简介</h2>
          <p>{herb.description}</p>
        </div>

        {/* Nature grid */}
        <div className="detail-section">
          <h2 className="detail-section-title">性味归经</h2>
          <div className="nature-grid">
            <div className="nature-card">
              <div className="nature-card-label">药性</div>
              <div className="nature-card-value" style={{ color: 'var(--herb-green)' }}>{herb.nature}</div>
            </div>
            <div className="nature-card">
              <div className="nature-card-label">药味</div>
              <div className="nature-card-value" style={{ color: 'var(--warm-wood)' }}>{herb.taste}</div>
            </div>
            <div className="nature-card">
              <div className="nature-card-label">归经</div>
              <div className="nature-card-value" style={{ fontSize: 14, color: 'var(--terracotta)' }}>{herb.meridian}</div>
            </div>
            <div className="nature-card">
              <div className="nature-card-label">类别</div>
              <div className="nature-card-value" style={{ fontSize: 14 }}>{herb.category}</div>
            </div>
          </div>
        </div>

        {/* Effect */}
        <div className="detail-section">
          <h2 className="detail-section-title">功效主治</h2>
          <div style={{
            padding: '14px 16px',
            background: 'linear-gradient(135deg, var(--herb-green-light), rgba(58,107,53,0.03))',
            borderRadius: 'var(--radius-md)',
            borderLeft: '3px solid var(--herb-green)'
          }}>
            <p style={{ fontWeight: 500, color: 'var(--herb-green)', fontSize: 14 }}>{herb.effect}</p>
          </div>
        </div>

        {/* Processing */}
        <div className="detail-section">
          <h2 className="detail-section-title">炮制方法</h2>
          <p>{herb.processing}</p>
        </div>

        {/* Classic quote */}
        <div className="detail-section">
          <h2 className="detail-section-title">典籍记载</h2>
          <div style={{
            padding: '16px',
            background: 'var(--rice-paper)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            lineHeight: 1.8,
            color: 'var(--ink-black)',
            fontSize: 13,
            borderTop: '2px solid var(--warm-wood)',
            borderBottom: '2px solid var(--warm-wood)'
          }}>
            {herb.classic}
          </div>
        </div>

        {/* Taboo */}
        <div className="detail-section">
          <h2 className="detail-section-title">使用禁忌</h2>
          <div className="taboo-box">
            <p>⚠️ {herb.taboo}</p>
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '20px 0', fontSize: 11, color: 'var(--gray-brown)' }}>
          — 本文仅供参考，请遵医嘱 —
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="detail-bottom-bar">
        <div
          className={`icon-btn ${isFavorited ? 'active' : ''}`}
          onClick={() => setIsFavorited(!isFavorited)}
        >
          <Icon.Heart size={22} color={isFavorited ? 'var(--terracotta)' : 'var(--gray-brown)'} filled={isFavorited} />
        </div>
        <div className="icon-btn" onClick={() => setShowAddPrescription(true)}>
          <Icon.Recipe size={20} color="var(--gray-brown)" />
        </div>
        <div className="primary-btn" onClick={() => setShowAddPrescription(true)}>
          加入药柜
        </div>
      </div>

      {/* Add prescription modal */}
      {showAddPrescription && (
        <div className="modal-overlay" onClick={() => setShowAddPrescription(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <h2 className="modal-title">添加至药方</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['我的养生方', '气血双补方', '明目茶', '新建药方...'].map((name, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: 14,
                    background: 'var(--rice-paper)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                  onClick={() => setShowAddPrescription(false)}
                >
                  <span style={{ fontSize: 14, color: 'var(--ink-black)', fontWeight: 500 }}>
                    {idx === 3 ? '' : '📜 '}{name}
                  </span>
                  {idx < 3 && (
                    <span style={{ fontSize: 12, color: 'var(--gray-brown)' }}>
                      {Math.floor(Math.random() * 8) + 3} 味药
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Object.assign(window, { DetailPage });
