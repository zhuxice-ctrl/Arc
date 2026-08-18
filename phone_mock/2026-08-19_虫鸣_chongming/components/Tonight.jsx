// 今夜屏：当前时段鸣虫 + 大录音按钮

function Tonight({ onRecord, onOpenInsect }) {
  const { isCollected } = useBug();
  const [activeInsects, setActiveInsects] = React.useState([]);
  const [nowStr, setNowStr] = React.useState('');
  const [dateStr, setDateStr] = React.useState('');

  React.useEffect(() => {
    function update() {
      setActiveInsects(getActiveInsects());
      const now = new Date();
      setNowStr(now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }));
      setDateStr(now.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' }));
    }
    update();
    const t = setInterval(update, 30000);
    return () => clearInterval(t);
  }, []);

  // 根据当前时段给出问候性标题
  const greeting = React.useMemo(() => {
    const h = new Date().getHours();
    if (h >= 19 && h < 22) return '夜幕初降，虫声渐起';
    if (h >= 22 && h < 24) return '夜正深，虫鸣正酣';
    if (h >= 0 && h < 3) return '万籁俱寂，仍有歌者';
    if (h >= 3 && h < 6) return '黎明将至，余音袅袅';
    if (h >= 6 && h < 18) return '白日蛰伏，待夜而鸣';
    return '夏夜正长';
  }, [nowStr]);

  return (
    <div className="screen">
      <NavBar title="今夜" />
      <div className="content-wrap">
        {/* Hero */}
        <div className="tonight-hero">
          <div className="tonight-eyebrow">{dateStr} · {nowStr}</div>
          <h1 className="tonight-title">{greeting}</h1>
          <p className="tonight-subtitle">
            此刻共有 {activeInsects.length} 种鸣虫正在夜色中歌唱。
            长按下方萤火按钮，录下你听到的虫鸣。
          </p>
        </div>

        {/* 当前在鸣的虫 */}
        <div className="chirping-now">
          <div className="section-title">
            <span className="section-title-dot" />
            此刻在鸣
          </div>
          {activeInsects.length === 0 ? (
            <div style={{
              padding: '32px 16px',
              textAlign: 'center',
              color: 'var(--moon-400)',
              fontSize: '13px',
              background: 'var(--night-700)',
              borderRadius: '14px',
              border: '1px solid rgba(51, 64, 89, 0.5)'
            }}>
              这会儿虫儿们都休息了，夜晚再来听吧。
            </div>
          ) : (
            activeInsects.map(insect => (
              <div
                key={insect.id}
                className="insect-row"
                onClick={() => onOpenInsect(insect.id)}
              >
                <div className="insect-thumb">
                  <img src={insect.image} alt={insect.name} />
                </div>
                <div className="insect-row-info">
                  <div className="insect-row-name">
                    {insect.name}
                    {isCollected(insect.id) && (
                      <span className="insect-collected-badge" title="已收入虫谱">
                        <Icons.Check size={10} />
                      </span>
                    )}
                  </div>
                  <div className="insect-row-sci">{insect.sciName}</div>
                  <div className="insect-row-time">
                    <Icons.Clock size={12} />
                    {insect.activeTime}
                  </div>
                </div>
                <div className="insect-row-arrow">
                  <Icons.ChevronRight size={16} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* 录音按钮区 */}
        <div className="record-section">
          <div className="record-hint">长按萤火按钮录音</div>
          <div className="record-btn-wrap">
            <div className="record-ring ring1" />
            <div className="record-ring ring2" />
            <div className="record-ring ring3" />
            <button
              className="record-btn"
              onMouseDown={onRecord}
              onTouchStart={onRecord}
            >
              <Icons.Mic size={44} />
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--moon-400)', padding: '0 40px 20px' }}>
          识别结果会自动收入虫谱，并记录在你的夜晚手账里。
        </div>
      </div>
    </div>
  );
}

window.Tonight = Tonight;
