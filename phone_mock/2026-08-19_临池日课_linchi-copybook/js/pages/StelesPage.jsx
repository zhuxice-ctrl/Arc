// 碑帖库页面
function StelesPage({ onOpenStele }) {
  const { steles } = window.LINCHI_DATA;
  const [state, setState] = React.useState(window.LINCHI_STORE.getState());

  React.useEffect(() => {
    const unsub = window.LINCHI_STORE.subscribe(setState);
    return unsub;
  }, []);

  function getSteleProgress(steleId) {
    const stele = steles.find(s => s.id === steleId);
    const total = stele?.characters.length || 0;
    const collected = state.collection.filter(c => c.steleId === steleId).length;
    return { collected, total, percent: total ? Math.round((collected / total) * 100) : 0 };
  }

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

      {/* 标题 */}
      <div style={{ padding: '4px 20px 16px' }}>
        <div style={{ fontFamily: '"Ma Shan Zheng", serif', fontSize: '26px', color: '#ece5d8' }}>碑帖典藏</div>
        <div style={{ fontSize: '13px', color: '#8a8278', marginTop: '4px' }}>传世名帖 · 择一而临</div>
      </div>

      <div className="content">
        {steles.map((stele, idx) => {
          const prog = getSteleProgress(stele.id);
          return (
            <div
              key={stele.id}
              className="card fade-up"
              style={{
                animationDelay: `${idx * 0.1}s`,
                cursor: 'pointer',
                padding: '0',
                overflow: 'hidden',
                transition: 'transform 0.2s',
              }}
              onClick={() => onOpenStele(stele.id)}
            >
              {/* 碑帖封面区 */}
              <div
                style={{
                  background: `linear-gradient(135deg, ${idx === 0 ? '#3a2e22' : idx === 1 ? '#2a241e' : '#2e261e'} 0%, #1a1714 100%)`,
                  padding: '24px 20px',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center',
                }}
              >
                {/* 大字符装饰 */}
                <div
                  style={{
                    width: '72px', height: '96px',
                    background: 'rgba(242,234,216,0.05)',
                    border: '1px solid rgba(242,234,216,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: '"Ma Shan Zheng", serif',
                    fontSize: '52px',
                    color: '#ece5d8',
                    borderRadius: '4px',
                    flexShrink: 0,
                  }}
                >
                  {stele.characters[0].char}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: '"Ma Shan Zheng", serif', fontSize: '22px', color: '#ece5d8', marginBottom: '4px' }}>
                    {stele.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#c8c0b0', marginBottom: '10px' }}>
                    {stele.dynasty} · {stele.author}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span className="chip" style={{ background: 'rgba(176,106,59,0.15)', color: '#b06a3b' }}>
                      {stele.characters.length} 字
                    </span>
                    <span className="chip">
                      已临 {prog.collected}/{prog.total}
                    </span>
                  </div>
                </div>
              </div>

              {/* 简介 */}
              <div style={{ padding: '14px 20px', background: '#f2ead8' }}>
                <div style={{ fontSize: '13px', color: '#5a5249', lineHeight: '1.6' }}>
                  {stele.desc}
                </div>
                {/* 进度条 */}
                <div style={{ marginTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#8a8278', marginBottom: '4px' }}>
                    <span>集字进度</span>
                    <span>{prog.percent}%</span>
                  </div>
                  <div style={{ height: '3px', background: 'rgba(26,23,20,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        background: '#b06a3b',
                        borderRadius: '2px',
                        width: `${prog.percent}%`,
                        transition: 'width 0.5s ease-out',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div style={{ padding: '0 20px 20px', fontSize: '12px', color: '#7a7268', textAlign: 'center' }}>
          — 更多碑帖陆续更新中 —
        </div>
        <div style={{ height: '20px' }}></div>
      </div>
    </div>
  );
}

window.StelesPage = StelesPage;
