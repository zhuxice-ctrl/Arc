// 叠影对比页 - 签名交互
function ComparePage({ onBack, onDone }) {
  const [state, setState] = React.useState(window.LINCHI_STORE.getState());
  const [opacity, setOpacity] = React.useState(0.5); // 原帖透明度（叠在自己的字上）
  const [mode, setMode] = React.useState('overlay'); // overlay | side | swap

  const lastWriting = state.lastWriting;
  const stele = window.LINCHI_DATA.steles.find(s => s.id === state.currentSteleId);
  const charInfo = stele?.characters.find(c => c.char === state.currentChar);

  React.useEffect(() => {
    const unsub = window.LINCHI_STORE.subscribe(setState);
    return unsub;
  }, []);

  // 计算评分维度
  const score = lastWriting?.score || 85;
  const scoreDetails = {
    structure: Math.min(95, score - 3 + Math.floor(Math.random() * 8)),
    stroke: Math.min(95, score + 2 + Math.floor(Math.random() * 6)),
    proportion: Math.min(95, score - 1 + Math.floor(Math.random() * 7)),
  };

  if (!lastWriting) {
    return (
      <div className="page">
        <div className="status-bar"><span>9:41</span><div className="right"><div className="battery"><span></span></div></div></div>
        <div className="nav-bar">
          <button className="nav-btn" onClick={onBack}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="title">叠影对比</div>
          <div style={{ width: '36px' }}></div>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8a8278' }}>
          暂无临写数据
        </div>
      </div>
    );
  }

  const canvasSize = 320;

  return (
    <div className="page" style={{ background: '#1a1714' }}>
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
        <div className="title" style={{ fontSize: '16px' }}>叠影对比</div>
        <div style={{ width: '36px' }}></div>
      </div>

      <div className="content">
        {/* 模式切换 */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', padding: '4px 20px 16px' }}>
          {[
            { key: 'overlay', label: '叠影' },
            { key: 'side', label: '左右' },
            { key: 'swap', label: '切换' },
          ].map(item => (
            <button
              key={item.key}
              onClick={() => setMode(item.key)}
              style={{
                height: '30px',
                padding: '0 14px',
                borderRadius: '15px',
                border: 'none',
                background: mode === item.key ? '#b06a3b' : 'rgba(236,229,216,0.08)',
                color: mode === item.key ? '#f2ead8' : '#c8c0b0',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* 对比区 */}
        <div style={{
          padding: '0 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {mode === 'overlay' && (
            <OverlayCompare
              userImage={lastWriting.imageData}
              char={lastWriting.char}
              opacity={opacity}
              size={canvasSize}
            />
          )}
          {mode === 'side' && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <CharBox label="你的字" size={155} paperColor="#f2ead8">
                {lastWriting.imageData ? (
                  <img src={lastWriting.imageData} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <div style={{ fontFamily: '"Ma Shan Zheng", serif', fontSize: '90px', color: '#1a1714' }}>
                    {lastWriting.char}
                  </div>
                )}
              </CharBox>
              <CharBox label="原帖" size={155} paperColor="#f2ead8">
                <div style={{ fontFamily: '"Ma Shan Zheng", serif', fontSize: '110px', color: '#1a1714', lineHeight: 1 }}>
                  {lastWriting.char}
                </div>
              </CharBox>
            </div>
          )}
          {mode === 'swap' && (
            <SwapCompare
              userImage={lastWriting.imageData}
              char={lastWriting.char}
              size={canvasSize}
            />
          )}
        </div>

        {/* 透明度滑杆（只在叠影模式显示） */}
        {mode === 'overlay' && (
          <div style={{ padding: '20px 24px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#c8c0b0' }}>原帖叠影</span>
              <span style={{ fontSize: '13px', color: '#b06a3b', fontWeight: 500 }}>
                {Math.round(opacity * 100)}%
              </span>
            </div>
            <input
              type="range"
              className="slider"
              min="0"
              max="1"
              step="0.01"
              value={opacity}
              onChange={e => setOpacity(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#5a5249', marginTop: '4px' }}>
              <span>我的字</span>
              <span>对半</span>
              <span>原帖</span>
            </div>
          </div>
        )}

        {/* 评分卡 */}
        <div className="card card-dark fade-up" style={{ animationDelay: '0.3s', margin: '20px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              border: '3px solid #b06a3b',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{ fontFamily: '"Ma Shan Zheng", serif', fontSize: '24px', color: '#b06a3b' }}>{score}</span>
              <span style={{ fontSize: '9px', color: '#8a8278' }}>综合</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '15px', color: '#ece5d8', marginBottom: '2px' }}>
                {score >= 90 ? '形神兼备' : score >= 80 ? '笔意俱佳' : score >= 70 ? '初具形态' : '继续加油'}
              </div>
              <div style={{ fontSize: '12px', color: '#8a8278' }}>
                结构与原帖偏差 <span style={{ color: '#c8c0b0' }}>{Math.max(2, 100 - scoreDetails.structure)}%</span>
              </div>
            </div>
          </div>

          <div className="divider" style={{ margin: '14px 0' }}></div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <ScoreBar label="结构" value={scoreDetails.structure} tip="重心分布、间架比例" />
            <ScoreBar label="笔法" value={scoreDetails.stroke} tip="起收转折、提按顿挫" />
            <ScoreBar label="章法" value={scoreDetails.proportion} tip="疏密匀称、虚实相生" />
          </div>
        </div>

        {/* 字的释义 */}
        <div className="card fade-up" style={{ animationDelay: '0.4s' }}>
          <div className="card-title">字解 · {lastWriting.char}</div>
          <div style={{ fontSize: '13px', color: '#5a5249', lineHeight: '1.7' }}>
            {charInfo?.note || '此字出自' + stele?.name + '，是' + stele?.author + '的代表名作。'}
          </div>
          <div className="divider divider-light" style={{ margin: '12px 0' }}></div>
          <div style={{ fontSize: '12px', color: '#7a7268' }}>
            <span style={{ color: '#b06a3b' }}>释义：</span>{charInfo?.meaning}
          </div>
        </div>

        <div style={{ height: '20px' }}></div>
      </div>

      {/* 底部操作 */}
      <div style={{
        padding: '12px 20px 28px',
        background: 'rgba(26,23,20,0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '0.5px solid rgba(236,229,216,0.08)',
        display: 'flex',
        gap: '10px',
        flexShrink: 0,
      }}>
        <button
          className="btn btn-secondary"
          style={{ flex: 1, height: '48px', fontSize: '15px' }}
          onClick={onBack}
        >
          再写一次
        </button>
        <button
          className="btn btn-primary"
          style={{ flex: 1, height: '48px', fontSize: '15px' }}
          onClick={onDone}
        >
          收入集字墙
        </button>
      </div>
    </div>
  );
}

// 叠影模式
function OverlayCompare({ userImage, char, opacity, size }) {
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (userImage) {
      const img = new Image();
      img.onload = () => setLoaded(true);
      img.src = userImage;
    }
  }, [userImage]);

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      {/* 底层：用户的字 */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          background: '#f2ead8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {userImage ? (
          <img
            src={userImage}
            style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'opacity 0.3s' }}
          />
        ) : (
          <div style={{ fontFamily: '"Ma Shan Zheng", serif', fontSize: size * 0.7, color: '#1a1714' }}>
            {char}
          </div>
        )}
        {/* 米字格 */}
        <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ position: 'absolute', opacity: 0.2 }} preserveAspectRatio="none">
          <rect x="1" y="1" width="98" height="98" fill="none" stroke="#b06a3b" strokeWidth="1" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="#b06a3b" strokeWidth="0.5" strokeDasharray="3,3" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#b06a3b" strokeWidth="0.5" strokeDasharray="3,3" />
          <line x1="0" y1="0" x2="100" y2="100" stroke="#b06a3b" strokeWidth="0.5" strokeDasharray="3,3" />
          <line x1="100" y1="0" x2="0" y2="100" stroke="#b06a3b" strokeWidth="0.5" strokeDasharray="3,3" />
        </svg>
      </div>

      {/* 上层：原帖字，可调节透明度 */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: opacity,
          transition: 'opacity 0.15s ease-out',
          pointerEvents: 'none',
        }}
      >
        <div style={{
          fontFamily: '"Ma Shan Zheng", "ZCOOL XiaoWei", serif',
          fontSize: size * 0.72,
          color: '#c23b22', // 朱红色，便于区分
          lineHeight: 1,
          textShadow: '0 0 2px rgba(194, 59, 34, 0.3)',
        }}>
          {char}
        </div>
      </div>
    </div>
  );
}

// 左右模式下的字框
function CharBox({ label, size, children, paperColor = '#f2ead8' }) {
  return (
    <div style={{
      width: size,
      height: size,
      background: paperColor,
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
    }}>
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        {children}
        <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ position: 'absolute', opacity: 0.15 }} preserveAspectRatio="none">
          <rect x="1" y="1" width="98" height="98" fill="none" stroke="#b06a3b" strokeWidth="1" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="#b06a3b" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#b06a3b" strokeWidth="0.5" strokeDasharray="2,2" />
        </svg>
      </div>
      <div style={{
        height: '28px',
        background: 'rgba(26,23,20,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        color: '#5a5249',
      }}>
        {label}
      </div>
    </div>
  );
}

// 切换模式：点击切换
function SwapCompare({ userImage, char, size }) {
  const [showUser, setShowUser] = React.useState(true);

  return (
    <div
      onClick={() => setShowUser(!showUser)}
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%',
        background: '#f2ead8',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: showUser ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }}>
        {userImage ? (
          <img src={userImage} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        ) : (
          <div style={{ fontFamily: '"Ma Shan Zheng", serif', fontSize: size * 0.7, color: '#1a1714' }}>{char}</div>
        )}
        <div style={{
          position: 'absolute', top: '10px', left: '10px',
          fontSize: '11px', color: '#5a5249', background: 'rgba(242,234,216,0.8)',
          padding: '2px 8px', borderRadius: '10px',
        }}>你的字</div>
      </div>
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%',
        background: '#f2ead8',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: showUser ? 0 : 1,
        transition: 'opacity 0.2s ease',
      }}>
        <div style={{ fontFamily: '"Ma Shan Zheng", serif', fontSize: size * 0.7, color: '#1a1714' }}>{char}</div>
        <div style={{
          position: 'absolute', top: '10px', left: '10px',
          fontSize: '11px', color: '#5a5249', background: 'rgba(242,234,216,0.8)',
          padding: '2px 8px', borderRadius: '10px',
        }}>原帖</div>
      </div>
      {/* 米字格 */}
      <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ position: 'absolute', opacity: 0.2 }} preserveAspectRatio="none">
        <rect x="1" y="1" width="98" height="98" fill="none" stroke="#b06a3b" strokeWidth="1" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="#b06a3b" strokeWidth="0.5" strokeDasharray="3,3" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#b06a3b" strokeWidth="0.5" strokeDasharray="3,3" />
        <line x1="0" y1="0" x2="100" y2="100" stroke="#b06a3b" strokeWidth="0.5" strokeDasharray="3,3" />
        <line x1="100" y1="0" x2="0" y2="100" stroke="#b06a3b" strokeWidth="0.5" strokeDasharray="3,3" />
      </svg>
      <div style={{
        position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)',
        fontSize: '11px', color: '#7a7268', background: 'rgba(26,23,20,0.6)',
        padding: '4px 10px', borderRadius: '10px', color: '#ece5d8',
      }}>
        点击切换
      </div>
    </div>
  );
}

function ScoreBar({ label, value, tip }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '13px', color: '#ece5d8' }}>{label}</span>
        <span style={{ fontSize: '13px', color: '#b06a3b', fontWeight: 500 }}>{value}</span>
      </div>
      <div style={{ height: '4px', background: 'rgba(236,229,216,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #b06a3b, #c97e4a)',
            borderRadius: '2px',
            width: `${value}%`,
            transition: 'width 1s cubic-bezier(0.22, 0.61, 0.36, 1)',
          }}
        />
      </div>
      {tip && <div style={{ fontSize: '11px', color: '#6a6258', marginTop: '4px' }}>{tip}</div>}
    </div>
  );
}

window.ComparePage = ComparePage;
