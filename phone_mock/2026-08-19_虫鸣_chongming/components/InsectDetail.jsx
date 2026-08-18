// 昆虫详情页

function InsectDetail({ insectId, onBack }) {
  const insect = getInsectById(insectId);
  const { isCollected } = useBug();

  if (!insect) return null;

  const collected = isCollected(insect.id);

  return (
    <div className="screen screen-push">
      <div className="detail-hero">
        <img src={insect.image} alt={insect.name} />
        <NavBar title="" showBack onBack={onBack} transparent />
      </div>
      <div className="content-wrap no-tab" style={{ paddingTop: 0 }}>
        <div className="detail-body">
          <h1 className="detail-name">{insect.name}</h1>
          <div className="detail-sci">{insect.sciName}</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {collected ? (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                background: 'rgba(196, 232, 74, 0.15)',
                color: 'var(--firefly-400)',
                borderRadius: '20px',
                fontSize: '12px'
              }}>
                <Icons.Check size={12} />
                已收入虫谱
              </span>
            ) : (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                background: 'var(--night-600)',
                color: 'var(--moon-300)',
                borderRadius: '20px',
                fontSize: '12px'
              }}>
                尚未发现
              </span>
            )}
            <span style={{
              fontSize: '12px',
              color: 'var(--moon-300)'
            }}>又名：{insect.commonName}</span>
          </div>

          <div className="detail-section-title">
            <Icons.Clock size={13} /> 鸣叫时段
          </div>
          <div className="detail-section-content">{insect.activeTime}</div>

          <div className="detail-section-title">
            <Icons.Volume size={13} /> 鸣声特征
          </div>
          <div className="detail-section-content">{insect.soundDesc}</div>

          <div className="detail-section-title">
            <Icons.MapPin size={13} /> 栖息环境
          </div>
          <div className="detail-section-content">{insect.habitat}</div>

          <div className="detail-section-title">
            <Icons.Ruler size={13} /> 形态特征
          </div>
          <div className="detail-section-content">
            体长 {insect.bodyLength}。{insect.coloration}。
          </div>

          <div className="detail-section-title">食性</div>
          <div className="detail-section-content">{insect.diet}</div>

          <div className="detail-section-title">分布</div>
          <div className="detail-section-content">{insect.distribution}</div>

          <div className="detail-section-title">季节</div>
          <div className="detail-section-content">{insect.season}</div>

          <div className="detail-section-title">文化拾遗</div>
          <div className="detail-section-content">{insect.culturalNote}</div>
        </div>
      </div>
    </div>
  );
}

window.InsectDetail = InsectDetail;
