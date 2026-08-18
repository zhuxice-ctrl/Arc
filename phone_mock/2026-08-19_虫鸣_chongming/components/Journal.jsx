// 夜晚手账页

function Journal() {
  const { journal } = useBug();

  // 按日期分组
  const grouped = React.useMemo(() => {
    const groups = {};
    journal.forEach(entry => {
      const d = new Date(entry.timestamp);
      const key = d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
      if (!groups[key]) groups[key] = [];
      groups[key].push(entry);
    });
    return groups;
  }, [journal]);

  return (
    <div className="screen">
      <NavBar title="夜晚手账" />
      <div className="content-wrap">
        <div className="journal-header">
          <div className="tonight-eyebrow">夜晚手账</div>
          <h1 className="tonight-title" style={{ fontSize: '24px' }}>
            {journal.length === 0 ? '开一本新账' : `共 ${journal.length} 条夜的记录`}
          </h1>
        </div>
        <p className="journal-desc">
          每一次聆听都是与夏夜的对话。
          你遇见的虫、停留的时刻，都安放在这里。
        </p>

        {journal.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Icons.Book size={28} />
            </div>
            <div className="empty-title">手账还是空的</div>
            <div className="empty-desc">
              去「今夜」录下一段虫鸣，
              识别成功后会自动记入手账，
              留下这个夏天的声音。
            </div>
          </div>
        ) : (
          Object.entries(grouped).map(([date, entries]) => (
            <React.Fragment key={date}>
              <div style={{
                padding: '12px 24px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--firefly-500)',
                  boxShadow: '0 0 8px var(--firefly-glow)'
                }} />
                <span style={{
                  fontSize: '13px',
                  color: 'var(--bamboo-300)',
                  letterSpacing: '0.05em'
                }}>{date}</span>
              </div>
              {entries.map((entry, i) => {
                const insect = getInsectById(entry.insectId);
                if (!insect) return null;
                const timeStr = new Date(entry.timestamp).toLocaleTimeString('zh-CN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                });
                return (
                  <div key={i} className="journal-entry">
                    <div className="journal-date">
                      <span className="journal-date-dot" />
                      {timeStr}
                      <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--moon-400)' }}>
                        相似度 {entry.similarity}%
                      </span>
                    </div>
                    <div className="journal-entry-row">
                      <div className="journal-insect-img">
                        <img src={insect.image} alt={insect.name} />
                      </div>
                      <div className="journal-entry-info">
                        <div className="journal-entry-name">{insect.name}</div>
                        <div className="journal-entry-note">{insect.soundFeature}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
}

window.Journal = Journal;
