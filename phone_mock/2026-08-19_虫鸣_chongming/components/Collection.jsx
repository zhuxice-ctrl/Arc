// 虫谱页

function Collection({ onOpenInsect }) {
  const { collection } = useBug();
  const total = INSECTS.length;
  const collectedCount = collection.length;
  const progress = Math.round((collectedCount / total) * 100);

  return (
    <div className="screen">
      <NavBar title="虫谱" />
      <div className="content-wrap">
        <div className="collection-header">
          <div className="tonight-eyebrow">我的虫谱</div>
          <h1 className="tonight-title" style={{ fontSize: '24px' }}>
            {collectedCount === 0 ? '空空如也' : `已收集 ${collectedCount} / ${total} 种`}
          </h1>
        </div>

        <div className="collection-stats">
          <div className="stat-card">
            <div className="stat-num">{collectedCount}</div>
            <div className="stat-label">已收集</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{progress}%</div>
            <div className="stat-label">完成度</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{total - collectedCount}</div>
            <div className="stat-label">待发现</div>
          </div>
        </div>

        <div style={{ padding: '12px 24px 8px' }}>
          <div className="section-title" style={{ marginBottom: '12px' }}>
            <span className="section-title-dot" style={{ animation: 'none', boxShadow: 'none' }} />
            全部鸣虫
          </div>
        </div>

        {collectedCount === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Icons.Bug size={28} />
            </div>
            <div className="empty-title">还没有收集到鸣虫</div>
            <div className="empty-desc">
              去「今夜」页听一听，录下你遇到的虫鸣，
              识别成功后就会自动加入虫谱。
            </div>
          </div>
        ) : (
          <div className="collection-grid">
            {INSECTS.map(insect => {
              const collected = collection.includes(insect.id);
              return (
                <div
                  key={insect.id}
                  className={`insect-card ${collected ? '' : 'locked'}`}
                  onClick={() => collected && onOpenInsect(insect.id)}
                >
                  <div className="insect-card-img">
                    <img src={insect.image} alt={insect.name} />
                  </div>
                  <div className="insect-card-info">
                    <div className="insect-card-name">
                      {collected ? insect.name : '未知鸣虫'}
                    </div>
                    <div className="insect-card-sci">
                      {collected ? insect.sciName : '去发现它'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

window.Collection = Collection;
