// 今日日课首页
const { useState, useEffect } = React;

function TodayPage({ onStartWrite }) {
  const [state, setState] = useState(window.LINCHI_STORE.getState());
  const [showDate, setShowDate] = useState('');

  useEffect(() => {
    const unsub = window.LINCHI_STORE.subscribe(setState);
    return unsub;
  }, []);

  useEffect(() => {
    const now = new Date();
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    setShowDate(`${now.getMonth() + 1}月${now.getDate()}日 · 星期${weekdays[now.getDay()]}`);
  }, []);

  const stele = window.LINCHI_DATA.steles.find(s => s.id === state.todaySteleId);
  const charInfo = stele?.characters.find(c => c.char === state.todayChar);
  const totalChars = state.collection.length;
  const level = window.LINCHI_DATA.getLevel(totalChars);
  const nextLevel = window.LINCHI_DATA.getNextLevel(totalChars);
  const progress = nextLevel
    ? Math.min(100, ((totalChars - level.minChars) / (nextLevel.minChars - level.minChars)) * 100)
    : 100;

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

      {/* 标题栏 */}
      <div style={{ padding: '4px 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontFamily: '"Ma Shan Zheng", serif', fontSize: '26px', color: '#ece5d8' }}>临池日课</div>
          <div style={{ fontSize: '13px', color: '#8a8278', marginTop: '4px' }}>{showDate}</div>
        </div>
        <div className="seal">日课</div>
      </div>

      {/* 主内容 */}
      <div className="content">
        {/* Streak 卡片 */}
        <div className="card fade-up" style={{ animationDelay: '0.05s', background: '#2a241e', color: '#ece5d8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '13px', color: '#8a8278', marginBottom: '4px' }}>连续临帖</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontFamily: '"Ma Shan Zheng", serif', fontSize: '42px', color: '#b06a3b' }}>{state.streak}</span>
                <span style={{ fontSize: '14px', color: '#c8c0b0' }}>天</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', color: '#8a8278', marginBottom: '8px' }}>本周</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['一', '二', '三', '四', '五', '六', '日'].map((d, i) => {
                  const filled = i < 5; // 前5天打了卡
                  const today = i === 4;
                  return (
                    <div key={d} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: filled ? '#b06a3b' : 'rgba(236,229,216,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          color: filled ? '#f2ead8' : '#5a5249',
                          border: today ? '1.5px solid #b06a3b' : 'none',
                        }}
                      >
                        {filled ? '•' : d}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* 等级进度 */}
          <div className="divider" style={{ margin: '14px 0' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#c8c0b0' }}>当前等级 · {level.name}</span>
            <span style={{ fontSize: '12px', color: '#8a8278' }}>{totalChars} 字</span>
          </div>
          <div style={{ height: '4px', background: 'rgba(236,229,216,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #b06a3b, #c97e4a)',
                borderRadius: '2px',
                width: `${progress}%`,
                transition: 'width 0.6s ease-out',
              }}
            />
          </div>
          {nextLevel && (
            <div style={{ fontSize: '11px', color: '#7a7268', marginTop: '6px', textAlign: 'right' }}>
              距「{nextLevel.name}」还差 {nextLevel.minChars - totalChars} 字
            </div>
          )}
        </div>

        {/* 今日一字 */}
        <div
          className="card fade-up"
          style={{
            animationDelay: '0.15s',
            padding: '24px 20px',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          onClick={onStartWrite}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#8a8278', marginBottom: '2px' }}>今日一字</div>
              <div className="card-title" style={{ marginBottom: '2px' }}>「{state.todayChar}」</div>
              <div style={{ fontSize: '12px', color: '#7a7268' }}>{stele?.name} · {stele?.author}</div>
            </div>
            <span className="chip" style={{ background: state.todayDone ? 'rgba(176,106,59,0.15)' : 'rgba(26,23,20,0.06)', color: state.todayDone ? '#b06a3b' : '#7a7268' }}>
              {state.todayDone ? '✓ 已完成' : '待临写'}
            </span>
          </div>

          <div
            style={{
              background: '#faf5e8',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '12px 0',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* 米字格背景 */}
            <svg width="200" height="200" viewBox="0 0 200 200" style={{ position: 'absolute', opacity: 0.2 }}>
              <rect x="1" y="1" width="198" height="198" fill="none" stroke="#b06a3b" strokeWidth="1.5" />
              <line x1="100" y1="0" x2="100" y2="200" stroke="#b06a3b" strokeWidth="0.5" strokeDasharray="4,4" />
              <line x1="0" y1="100" x2="200" y2="100" stroke="#b06a3b" strokeWidth="0.5" strokeDasharray="4,4" />
              <line x1="0" y1="0" x2="200" y2="200" stroke="#b06a3b" strokeWidth="0.5" strokeDasharray="4,4" />
              <line x1="200" y1="0" x2="0" y2="200" stroke="#b06a3b" strokeWidth="0.5" strokeDasharray="4,4" />
            </svg>
            <div
              className="big-char"
              style={{ fontSize: '140px', position: 'relative', zIndex: 1, animation: 'inkSpread 0.8s cubic-bezier(0.22, 0.61, 0.36, 1) both' }}
            >
              {state.todayChar}
            </div>
          </div>

          <div style={{ fontSize: '13px', color: '#5a5249', lineHeight: '1.6', marginTop: '4px' }}>
            {charInfo?.note}
          </div>

          <button
            className="btn btn-primary btn-full"
            style={{ marginTop: '16px', height: '52px', fontSize: '17px' }}
            onClick={(e) => { e.stopPropagation(); onStartWrite(); }}
          >
            {state.todayDone ? '再临一次' : '开始临写'}
          </button>
        </div>

        {/* 今日要领 */}
        <div className="card card-dark fade-up" style={{ animationDelay: '0.25s' }}>
          <div className="card-title">临写要领</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { title: '观察结构', desc: '先读帖，看清「永」字的点画位置与重心分布。' },
              { title: '意在笔先', desc: '落笔前想好起笔、行笔、收笔的完整路线。' },
              { title: '叠影对校', desc: '写完用叠影功能对比原帖，找出结构偏差。' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px' }}>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: 'rgba(176,106,59,0.2)', color: '#b06a3b',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 600, flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: '#ece5d8', fontWeight: 500, marginBottom: '2px' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: '#8a8278', lineHeight: '1.5' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: '20px' }}></div>
      </div>
    </div>
  );
}

window.TodayPage = TodayPage;
