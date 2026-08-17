// Pharmacopeia Page - Category browsing with sticky tabs and pull-to-refresh
const PharmacopeiaPage = ({ onHerbClick }) => {
  const [activeCategory, setActiveCategory] = React.useState('全部');
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [herbs, setHerbs] = React.useState(HERBS_DATA);
  const listRef = React.useRef(null);
  const touchStartY = React.useRef(0);
  const pullDistance = React.useRef(0);
  const [pullOffset, setPullOffset] = React.useState(0);

  const filteredHerbs = activeCategory === '全部'
    ? herbs
    : herbs.filter(h => h.category === activeCategory);

  const handleTouchStart = (e) => {
    if (listRef.current && listRef.current.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY;
    } else {
      touchStartY.current = null;
    }
  };

  const handleTouchMove = (e) => {
    if (touchStartY.current === null) return;
    const deltaY = e.touches[0].clientY - touchStartY.current;
    if (deltaY > 0 && listRef.current.scrollTop === 0) {
      pullDistance.current = Math.min(deltaY * 0.5, 80);
      setPullOffset(pullDistance.current);
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance.current > 50) {
      setIsRefreshing(true);
      setPullOffset(50);
      setTimeout(() => {
        setHerbs([...HERBS_DATA]);
        setIsRefreshing(false);
        setPullOffset(0);
        pullDistance.current = 0;
      }, 1200);
    } else {
      setPullOffset(0);
      pullDistance.current = 0;
    }
    touchStartY.current = null;
  };

  const getNatureClass = (nature) => {
    if (nature.includes('温')) return 'nature-warm';
    if (nature.includes('寒')) return 'nature-cool';
    if (nature.includes('平')) return 'nature-neutral';
    return 'nature-pungent';
  };

  return (
    <div className="screen" id="screen-pharma">
      <div className="large-nav">
        <div className="nav-inner">
          <h1>药典</h1>
        </div>
      </div>

      {/* Sticky filter tabs */}
      <div className="filter-tabs">
        {CATEGORIES.map(cat => (
          <div
            key={cat}
            className={`filter-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </div>
        ))}
      </div>

      {/* Pull indicator */}
      <div
        className="pull-indicator"
        style={{
          height: isRefreshing ? 50 : pullOffset,
          transition: isRefreshing ? 'none' : 'height 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        <Icon.Refresh size={18} color="var(--herb-green)" />
        {isRefreshing ? '正在刷新...' : pullOffset > 50 ? '松开刷新' : '下拉可以刷新'}
      </div>

      <div
        className="herb-list"
        ref={listRef}
        style={{
          paddingTop: 12,
          transform: `translateY(0)`,
          transition: isRefreshing ? 'none' : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {filteredHerbs.map(herb => (
          <div
            key={herb.id}
            className="herb-card"
            onClick={() => onHerbClick(herb)}
          >
            <div className="herb-thumb">{herb.icon}</div>
            <div className="herb-info">
              <div className="herb-name-row">
                <span className="herb-name">{herb.name}</span>
                <span className="herb-pinyin">{herb.pinyin}</span>
              </div>
              <div className="herb-tags">
                <span className={`nature-tag ${getNatureClass(herb.nature)}`}>{herb.nature}</span>
                <span className="nature-tag nature-neutral">{herb.taste}</span>
              </div>
              <div className="herb-effect">{herb.effect}</div>
            </div>
          </div>
        ))}

        {filteredHerbs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--gray-brown)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🌿</div>
            <div>暂无此类草药</div>
          </div>
        )}

        <div style={{ textAlign: 'center', padding: 20, fontSize: 12, color: 'var(--gray-brown)' }}>
          — 共 {filteredHerbs.length} 种草药 —
        </div>
      </div>

      {/* Bottom spacer for tab bar */}
      <div style={{ height: 100 }} />
    </div>
  );
};

Object.assign(window, { PharmacopeiaPage });
