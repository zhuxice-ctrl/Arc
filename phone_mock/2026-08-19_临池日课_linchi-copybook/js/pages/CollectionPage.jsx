// 集字墙页面
function CollectionPage({ onViewChar }) {
  const [state, setState] = React.useState(window.LINCHI_STORE.getState());
  const [activeStele, setActiveStele] = React.useState('all');

  React.useEffect(() => {
    const unsub = window.LINCHI_STORE.subscribe(setState);
    return unsub;
  }, []);

  const { steles } = window.LINCHI_DATA;

  // 按碑帖分组
  const grouped = {};
  for (const stele of steles) {
    grouped[stele.id] = state.collection.filter(c => c.steleId === stele.id);
  }
  const allChars = state.collection;

  const displayChars = activeStele === 'all' ? allChars : grouped[activeStele] || [];

  return (
    <div className="page">
      {/* 状态栏 */}
      <div className="status-bar">
        <span>9:41</span>
        <div className="right">
          <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
            <rect x="0" y="8" width="3" height="4" rx="1" />
            <rect x="5" y="5" width="3" height="7" rx="1" />
            <rect x="10" y="2" width="3" height="10" rx="1" />
            <rect x="15" y="0" width="3" height="12" rx="1" />
          </svg>
          <div className="battery"><span></span></div>
        </div>
      </div>

      {/* 标题 + 统计 */}
      <div style={{ padding: '4px 20px 12px' }}>
        <div style={{ fontFamily: '"Ma Shan Zheng", serif', fontSize: '26px', color: '#ece5d8' }}>集字墙</div>
        <div style={{ fontSize: '13px', color: '#8a8278', marginTop: '4px' }}>
          已集 <span style={{ color: '#b06a3b', fontWeight: 600 }}>{allChars.length}</span> 字 · 来自 {steles.filter(s => grouped[s.id]?.length).length} 帖
        </div>
      </div>

      {/* 筛选 Tabs */}
      <div style={{ padding: '0 16px 12px', display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        <FilterChip
          active={activeStele === 'all'}
          label="全部"
          count={allChars.length}
          onClick={() => setActiveStele('all')}
        />
        {steles.map(stele => (
          <FilterChip
            key={stele.id}
            active={activeStele === stele.id}
            label={stele.name}
            count={grouped[stele.id]?.length || 0}
            onClick={() => setActiveStele(stele.id)}
          />
        ))}
      </div>

      <div className="content">
        {displayChars.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ fontFamily: '"Ma Shan Zheng", serif', fontSize: '60px', color: '#3a322a', marginBottom: '16px' }}>虚</div>
            <div style={{ fontSize: '15px', color: '#7a7268', marginBottom: '6px' }}>此处空空如也</div>
            <div style={{ fontSize: '13px', color: '#5a5249' }}>完成今日日课，收入第一个字吧</div>
          </div>
        ) : (
          <div
            style={{
              padding: '0 16px 20px',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
            }}
          >
            {displayChars.map((item, idx) => (
              <div
                key={`${item.steleId}-${item.char}-${idx}`}
                className="fade-up"
                style={{
                  animationDelay: `${idx * 0.04}s`,
                  aspectRatio: '1',
                  background: '#f2ead8',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
                onClick={() => onViewChar && onViewChar(item)}
              >
                {/* 米字格底 */}
                <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ position: 'absolute', opacity: 0.15 }} preserveAspectRatio="none">
                  <rect x="1" y="1" width="98" height="98" fill="none" stroke="#b06a3b" strokeWidth="1" />
                  <line x1="50" y1="0" x2="50" y2="100" stroke="#b06a3b" strokeWidth="0.5" strokeDasharray="2,2" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="#b06a3b" strokeWidth="0.5" strokeDasharray="2,2" />
                  <line x1="0" y1="0" x2="100" y2="100" stroke="#b06a3b" strokeWidth="0.5" strokeDasharray="2,2" />
                  <line x1="100" y1="0" x2="0" y2="100" stroke="#b06a3b" strokeWidth="0.5" strokeDasharray="2,2" />
                </svg>
                <div
                  style={{
                    fontFamily: '"Ma Shan Zheng", serif',
                    fontSize: '48px',
                    color: '#1a1714',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {item.char}
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '4px',
                    right: '4px',
                    fontSize: '10px',
                    color: '#b06a3b',
                    fontWeight: 600,
                  }}
                >
                  {item.score}分
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 成就展示 */}
        {allChars.length > 0 && (
          <div className="card card-dark fade-up" style={{ animationDelay: '0.3s', margin: '20px 16px' }}>
            <div className="card-title">集字成就</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <AchievementItem
                icon="初"
                title="初临池"
                desc="集齐 5 字"
                achieved={allChars.length >= 5}
              />
              <AchievementItem
                icon="勤"
                title="笔耕不辍"
                desc="连续 7 天"
                achieved={state.streak >= 7}
              />
              <AchievementItem
                icon="通"
                title="贯通一帖"
                desc="集齐一碑全字"
                achieved={steles.some(s => grouped[s.id]?.length >= s.characters.length)}
              />
            </div>
          </div>
        )}

        <div style={{ height: '20px' }}></div>
      </div>
    </div>
  );
}

function FilterChip({ active, label, count, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0,
        height: '32px',
        padding: '0 14px',
        borderRadius: '16px',
        border: 'none',
        background: active ? '#b06a3b' : 'rgba(236,229,216,0.08)',
        color: active ? '#f2ead8' : '#c8c0b0',
        fontSize: '13px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontFamily: 'inherit',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      <span>{label}</span>
      <span style={{
        fontSize: '11px',
        opacity: 0.7,
        background: active ? 'rgba(242,234,216,0.2)' : 'rgba(236,229,216,0.08)',
        padding: '1px 6px',
        borderRadius: '8px',
      }}>{count}</span>
    </button>
  );
}

function AchievementItem({ icon, title, desc, achieved }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '12px 4px',
      opacity: achieved ? 1 : 0.35,
    }}>
      <div style={{
        width: '44px', height: '44px', borderRadius: '50%',
        background: achieved ? 'rgba(176,106,59,0.2)' : 'rgba(236,229,216,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: '"Ma Shan Zheng", serif',
        fontSize: '22px',
        color: achieved ? '#b06a3b' : '#5a5249',
        marginBottom: '6px',
        border: achieved ? '1px solid rgba(176,106,59,0.3)' : '1px solid rgba(236,229,216,0.1)',
      }}>
        {icon}
      </div>
      <div style={{ fontSize: '12px', color: '#ece5d8', fontWeight: 500, marginBottom: '2px' }}>{title}</div>
      <div style={{ fontSize: '10px', color: '#7a7268' }}>{desc}</div>
    </div>
  );
}

window.CollectionPage = CollectionPage;
