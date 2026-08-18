// 碑帖详情页 - 展示单碑的单字列表
function SteleDetailPage({ steleId, onBack, onWriteChar }) {
  const [state, setState] = React.useState(window.LINCHI_STORE.getState());

  React.useEffect(() => {
    const unsub = window.LINCHI_STORE.subscribe(setState);
    return unsub;
  }, []);

  const stele = window.LINCHI_DATA.steles.find(s => s.id === steleId);
  if (!stele) return null;

  const collectedChars = state.collection
    .filter(c => c.steleId === steleId)
    .map(c => c.char);

  function handleWrite(charObj) {
    window.LINCHI_STORE.setState({
      currentSteleId: steleId,
      currentChar: charObj.char,
    });
    onWriteChar();
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

      {/* 导航栏 */}
      <div className="nav-bar">
        <button className="nav-btn" onClick={onBack}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="title">{stele.name}</div>
        <div style={{ width: '36px' }}></div>
      </div>

      <div className="content">
        {/* 碑帖信息 */}
        <div className="card fade-up" style={{ animationDelay: '0.05s', background: '#2a241e', color: '#ece5d8' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{
              width: '64px', height: '84px',
              border: '1px solid rgba(242,234,216,0.15)',
              borderRadius: '4px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: '"Ma Shan Zheng", serif',
              fontSize: '44px', color: '#ece5d8',
              flexShrink: 0,
              background: 'rgba(242,234,216,0.03)',
            }}>
              {stele.characters[0].char}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: '"Ma Shan Zheng", serif', fontSize: '20px', color: '#ece5d8', marginBottom: '4px' }}>
                {stele.name}
              </div>
              <div style={{ fontSize: '12px', color: '#8a8278', marginBottom: '6px' }}>
                {stele.dynasty} · {stele.author}
              </div>
              <div style={{ fontSize: '11px', color: '#b06a3b' }}>
                已临 {collectedChars.length} / {stele.characters.length} 字
              </div>
            </div>
          </div>
          <div className="divider" style={{ margin: '14px 0' }}></div>
          <div style={{ fontSize: '13px', color: '#c8c0b0', lineHeight: '1.7' }}>
            {stele.desc}
          </div>
        </div>

        {/* 单字列表 */}
        <div style={{ padding: '4px 20px 12px' }}>
          <div style={{ fontFamily: '"Ma Shan Zheng", serif', fontSize: '18px', color: '#ece5d8' }}>选字临写</div>
          <div style={{ fontSize: '12px', color: '#7a7268', marginTop: '2px' }}>点击一字开始临写</div>
        </div>

        <div
          style={{
            padding: '0 16px 20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
          }}
        >
          {stele.characters.map((charObj, idx) => {
            const collected = collectedChars.includes(charObj.char);
            const charItem = state.collection.find(c => c.steleId === steleId && c.char === charObj.char);
            return (
              <div
                key={charObj.char}
                className="fade-up"
                style={{
                  animationDelay: `${idx * 0.05}s`,
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
                onClick={() => handleWrite(charObj)}
              >
                <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ position: 'absolute', opacity: 0.12 }} preserveAspectRatio="none">
                  <rect x="1" y="1" width="98" height="98" fill="none" stroke="#b06a3b" strokeWidth="1" />
                  <line x1="50" y1="0" x2="50" y2="100" stroke="#b06a3b" strokeWidth="0.5" strokeDasharray="2,2" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="#b06a3b" strokeWidth="0.5" strokeDasharray="2,2" />
                </svg>
                <div
                  style={{
                    fontFamily: '"Ma Shan Zheng", serif',
                    fontSize: '44px',
                    color: '#1a1714',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {charObj.char}
                </div>
                {collected && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      fontSize: '9px',
                      background: '#b06a3b',
                      color: '#f2ead8',
                      padding: '1px 5px',
                      borderRadius: '8px',
                      fontWeight: 600,
                    }}
                  >
                    {charItem?.score}分
                  </div>
                )}
                {!collected && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '4px',
                      fontSize: '10px',
                      color: '#8a8278',
                    }}
                  >
                    未临
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ height: '20px' }}></div>
      </div>
    </div>
  );
}

window.SteleDetailPage = SteleDetailPage;
