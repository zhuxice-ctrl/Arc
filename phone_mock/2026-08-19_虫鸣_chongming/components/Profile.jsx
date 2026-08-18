// 我的页

function Profile({ onOpenDesignSpec, onOpenApiDoc }) {
  const { collection, journal, resetAll } = useBug();

  return (
    <div className="screen">
      <NavBar title="我的" />
      <div className="content-wrap">
        <div className="profile-header">
          <div className="profile-avatar">夜</div>
          <div style={{ flex: 1 }}>
            <div className="profile-name">夜行的人</div>
            <div className="profile-sub">
              收集了 {collection.length} 种鸣虫 · {journal.length} 条夜的记录
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 24px 4px' }}>
          <div className="section-title" style={{ fontSize: '12px' }}>
            <span className="section-title-dot" style={{ animation: 'none' }} />
            关于
          </div>
        </div>

        <div className="settings-list">
          <div className="settings-item" onClick={onOpenDesignSpec}>
            <div className="settings-icon">
              <Icons.Palette size={16} />
            </div>
            <span className="settings-label">设计规范</span>
            <Icons.ChevronRight size={16} />
          </div>
          <div className="settings-item" onClick={onOpenApiDoc}>
            <div className="settings-icon">
              <Icons.Code size={16} />
            </div>
            <span className="settings-label">接口文档</span>
            <Icons.ChevronRight size={16} />
          </div>
          <div className="settings-item">
            <div className="settings-icon">
              <Icons.Info size={16} />
            </div>
            <span className="settings-label">关于虫鸣</span>
            <Icons.ChevronRight size={16} />
          </div>
        </div>

        <div style={{ padding: '16px 24px 4px' }}>
          <div className="section-title" style={{ fontSize: '12px' }}>
            <span className="section-title-dot" style={{ animation: 'none' }} />
            设置
          </div>
        </div>

        <div className="settings-list">
          <div className="settings-item">
            <div className="settings-icon">
              <Icons.Settings size={16} />
            </div>
            <span className="settings-label">通用设置</span>
            <Icons.ChevronRight size={16} />
          </div>
          <div className="settings-item" onClick={() => {
            if (confirm('确认清空所有数据？虫谱和手账都将清空。')) {
              resetAll();
            }
          }}>
            <div className="settings-icon" style={{ color: '#e87a7a' }}>
              <Icons.Bug size={16} />
            </div>
            <span className="settings-label" style={{ color: '#e87a7a' }}>
              清空所有数据
            </span>
            <Icons.ChevronRight size={16} />
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          fontSize: '11px',
          color: 'var(--moon-400)',
          padding: '32px 24px 16px',
          letterSpacing: '0.1em'
        }}>
          虫鸣 · v2.0 · 夏夜听虫
        </div>
      </div>
    </div>
  );
}

window.Profile = Profile;
