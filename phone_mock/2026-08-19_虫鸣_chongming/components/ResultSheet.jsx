// 识别结果底部弹层

function ResultSheet({ result, isCollected, onAdd, onClose, onViewDetail, collectionRef }) {
  const [showSim, setShowSim] = React.useState(false);
  const [flyParticle, setFlyParticle] = React.useState(null);

  React.useEffect(() => {
    if (result) {
      setTimeout(() => setShowSim(true), 100);
    } else {
      setShowSim(false);
    }
  }, [result]);

  if (!result) return null;

  const { primary, alternatives } = result;

  function handleAdd() {
    // 萤火飞入 TabBar 动效
    const btnRect = document.querySelector('.sheet-actions .btn-primary')?.getBoundingClientRect();
    const tabRect = collectionRef?.current?.getBoundingClientRect();

    if (btnRect && tabRect) {
      const startX = btnRect.left + btnRect.width / 2;
      const startY = btnRect.top + btnRect.height / 2;
      const endX = tabRect.left + tabRect.width / 2;
      const endY = tabRect.top + tabRect.height / 2;

      setFlyParticle({ x: startX, y: startY });
      requestAnimationFrame(() => {
        setTimeout(() => {
          setFlyParticle(p => p ? { ...p, x: endX, y: endY } : null);
        }, 20);
      });

      setTimeout(() => {
        setFlyParticle(null);
        onAdd();
      }, 1000);
    } else {
      onAdd();
    }
  }

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="bottom-sheet">
        <div className="sheet-handle" />

        <div className="result-card">
          <div className="result-image">
            <img src={primary.image} alt={primary.name} />
          </div>
          <h2 className="result-name">
            <span className="result-name-glow" />
            {primary.name}
            <span className="result-name-glow" />
          </h2>
          <div className="result-sci">{primary.sciName}</div>

          <div style={{ width: '100%' }}>
            <div className="similarity-label">匹配相似度</div>
            <div className="result-similarity">
              <div className="similarity-bar">
                <div
                  className="similarity-fill"
                  style={{ width: showSim ? `${primary.similarity}%` : '0%' }}
                />
              </div>
              <span className="similarity-num">{primary.similarity}%</span>
            </div>
          </div>

          <div className="result-info">
            <div className="result-info-row">
              <span className="result-info-label">
                <Icons.Clock size={13} /> 鸣叫时段
              </span>
              <span className="result-info-value">{primary.activeTime}</span>
            </div>
            <div className="result-info-row">
              <span className="result-info-label">
                <Icons.MapPin size={13} /> 栖息环境
              </span>
              <span className="result-info-value">{primary.habitat}</span>
            </div>
            <div className="result-info-row">
              <span className="result-info-label">
                <Icons.Volume size={13} /> 鸣声特征
              </span>
              <span className="result-info-value" style={{ fontSize: '12px' }}>{primary.soundFeature}</span>
            </div>
          </div>

          <div className="alt-matches">
            <div className="alt-matches-title">其他可能</div>
            {alternatives.map((alt, i) => (
              <div key={alt.id} className="alt-item" onClick={() => onViewDetail(alt.id)}>
                <div className="alt-thumb">
                  <img src={alt.image} alt={alt.name} />
                </div>
                <div className="alt-info">
                  <div className="alt-name">{alt.name}</div>
                </div>
                <span className="alt-pct">{alt.similarity}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sheet-actions">
          <button className="btn btn-secondary" onClick={() => onViewDetail(primary.id)}>
            查看详情
          </button>
          {isCollected ? (
            <button className="btn btn-primary" style={{ background: 'var(--night-500)', color: 'var(--moon-300)', boxShadow: 'none' }}>
              <Icons.Check size={16} /> 已在虫谱
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleAdd}>
              加入虫谱
            </button>
          )}
        </div>
      </div>

      {/* 飞入动效粒子 */}
      {flyParticle && (
        <div
          className="firefly-particle"
          style={{
            left: flyParticle.x,
            top: flyParticle.y,
            transform: 'translate(-50%, -50%)'
          }}
        />
      )}
    </>
  );
}

window.ResultSheet = ResultSheet;
