// Personal Cabinet Page - with circular progress and grid
const CabinetPage = ({ onNavigate }) => {
  const ringRef = React.useRef(null);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const TOTAL_HERBS = 500;
  const COLLECTED = 24;
  const progress = COLLECTED / TOTAL_HERBS;

  // Animate ring on mount
  React.useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;

    const circumference = 2 * Math.PI * 33;
    ring.style.strokeDasharray = `${circumference}`;
    ring.style.strokeDashoffset = `${circumference}`;

    const timer = setTimeout(() => {
      ring.style.strokeDashoffset = `${circumference * (1 - progress)}`;
    }, 300);

    return () => clearTimeout(timer);
  }, [progress]);

  const gridItems = [
    { icon: '⭐', label: '我的收藏' },
    { icon: '📜', label: '药方夹' },
    { icon: '📚', label: '学习计划' },
    { icon: '📝', label: '用药笔记' },
    { icon: '🔔', label: '提醒事项' },
    { icon: '🏆', label: '成就徽章' },
    { icon: '👨‍🏫', label: '中医课程' },
    { icon: '💬', label: '社区交流' },
  ];

  const listItems = [
    { icon: '🌿', text: '已收录草药', extra: `${COLLECTED} 种` },
    { icon: '📖', text: '阅读历史', extra: '128 篇' },
    { icon: '⚙️', text: '设置', extra: '' },
    { icon: '❓', text: '帮助与反馈', extra: '' },
    { icon: '🎨', text: '设计规范', extra: '' },
  ];

  return (
    <div className="screen" id="screen-cabinet">
      {/* Header with green background */}
      <div className="cabinet-header">
        <div className="cabinet-top">
          <div className="avatar">李</div>
          <div className="user-info">
            <h2>李时珍的药柜</h2>
            <p>Lv.3 药童 · 已打卡 12 天</p>
          </div>
        </div>

        <div className="progress-ring-wrap">
          <div className="progress-ring">
            <svg viewBox="0 0 80 80">
              <circle className="ring-bg" cx="40" cy="40" r="33" />
              <circle
                ref={ringRef}
                className="ring-fg"
                cx="40"
                cy="40"
                r="33"
              />
            </svg>
            <div className="ring-text">
              <span className="ring-num">{COLLECTED}</span>
              <span className="ring-label">已收录</span>
            </div>
          </div>
          <div className="progress-info">
            <h3>百草收录进度</h3>
            <p>目标收录 {TOTAL_HERBS} 种中草药，再收藏 476 种即可解锁「百草居士」成就。</p>
          </div>
        </div>
      </div>

      {/* Function grid */}
      <div className="cabinet-section-title">常用功能</div>
      <div className="cabinet-grid">
        {gridItems.map((item, idx) => (
          <div key={idx} className="cabinet-grid-item">
            <div className="cabinet-grid-icon">{item.icon}</div>
            <span className="cabinet-grid-label">{item.label}</span>
          </div>
        ))}
      </div>

      {/* List */}
      <div className="cabinet-section-title">更多服务</div>
      <div className="cabinet-list">
        {listItems.map((item, idx) => (
          <div
            key={idx}
            className="cabinet-list-item"
            onClick={() => {
              if (item.text === '设计规范') onNavigate('spec');
            }}
          >
            <div className="icon">{item.icon}</div>
            <span className="text">{item.text}</span>
            {item.extra && (
              <span style={{ fontSize: 12, color: 'var(--gray-brown)', marginRight: 8 }}>
                {item.extra}
              </span>
            )}
            <span className="arrow">
              <Icon.ChevronRight size={14} color="var(--gray-brown)" />
            </span>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', padding: '0 20px 24px', fontSize: 11, color: 'var(--gray-brown)' }}>
        百草集 v2.0.0 · 传承千年草本智慧
      </div>

      {/* FAB */}
      <div className="fab" onClick={() => setShowAddModal(true)}>
        <Icon.Plus size={26} color="white" />
      </div>

      {/* Add herb modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <h2 className="modal-title">添加至药柜</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{
                padding: 14,
                background: 'var(--rice-paper)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer'
              }}>
                <div style={{ fontSize: 28 }}>📷</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink-black)' }}>拍照识别</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-brown)', marginTop: 2 }}>
                    拍摄草药自动识别收录
                  </div>
                </div>
              </div>
              <div style={{
                padding: 14,
                background: 'var(--rice-paper)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer'
              }}>
                <div style={{ fontSize: 28 }}>🔍</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink-black)' }}>搜索添加</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-brown)', marginTop: 2 }}>
                    从药典中搜索手动添加
                  </div>
                </div>
              </div>
              <div style={{
                padding: 14,
                background: 'var(--rice-paper)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer'
              }}>
                <div style={{ fontSize: 28 }}>📝</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink-black)' }}>记录心得</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-brown)', marginTop: 2 }}>
                    写下你的用药体验与笔记
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom spacer */}
      <div style={{ height: 80 }} />
    </div>
  );
};

Object.assign(window, { CabinetPage });
