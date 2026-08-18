// 我的页面
function MePage({ onOpenDesignSpec, onOpenApiDoc, onReset }) {
  const [state, setState] = React.useState(window.LINCHI_STORE.getState());
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);

  React.useEffect(() => {
    const unsub = window.LINCHI_STORE.subscribe(setState);
    return unsub;
  }, []);

  const totalChars = state.collection.length;
  const level = window.LINCHI_DATA.getLevel(totalChars);
  const nextLevel = window.LINCHI_DATA.getNextLevel(totalChars);
  const { steles } = window.LINCHI_DATA;

  // 统计
  const totalScore = state.collection.reduce((s, c) => s + (c.score || 0), 0);
  const avgScore = totalChars > 0 ? Math.round(totalScore / totalChars) : 0;
  const maxScore = totalChars > 0 ? Math.max(...state.collection.map(c => c.score || 0)) : 0;

  function handleReset() {
    window.LINCHI_STORE.resetState();
    setShowResetConfirm(false);
    showToast('已重置应用数据');
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

      <div style={{ padding: '4px 20px 12px' }}>
        <div style={{ fontFamily: '"Ma Shan Zheng", serif', fontSize: '26px', color: '#ece5d8' }}>我的</div>
      </div>

      <div className="content">
        {/* 用户卡片 */}
        <div className="card fade-up" style={{ animationDelay: '0.05s', background: '#2a241e', color: '#ece5d8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #b06a3b, #8c5128)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: '"Ma Shan Zheng", serif',
              fontSize: '26px',
              color: '#f2ead8',
            }}>
              墨
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#ece5d8', marginBottom: '2px' }}>
                {state.user.nickname}
              </div>
              <div style={{ fontSize: '13px', color: '#b06a3b' }}>
                Lv.{level.level} · {level.name}
              </div>
            </div>
            <div className="seal" style={{ fontSize: '11px' }}>临池</div>
          </div>

          <div className="divider" style={{ margin: '16px 0' }}></div>

          {/* 统计数据 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', textAlign: 'center' }}>
            <div>
              <div style={{ fontFamily: '"Ma Shan Zheng", serif', fontSize: '24px', color: '#b06a3b' }}>{state.streak}</div>
              <div style={{ fontSize: '11px', color: '#8a8278', marginTop: '2px' }}>连续天数</div>
            </div>
            <div style={{ borderLeft: '1px solid rgba(236,229,216,0.08)', borderRight: '1px solid rgba(236,229,216,0.08)' }}>
              <div style={{ fontFamily: '"Ma Shan Zheng", serif', fontSize: '24px', color: '#ece5d8' }}>{totalChars}</div>
              <div style={{ fontSize: '11px', color: '#8a8278', marginTop: '2px' }}>累计临字</div>
            </div>
            <div>
              <div style={{ fontFamily: '"Ma Shan Zheng", serif', fontSize: '24px', color: '#ece5d8' }}>{avgScore}</div>
              <div style={{ fontSize: '11px', color: '#8a8278', marginTop: '2px' }}>平均分</div>
            </div>
          </div>
        </div>

        {/* 功能列表 */}
        <div className="card card-dark fade-up" style={{ animationDelay: '0.15s', padding: '0' }}>
          <SettingItem icon="📐" label="设计规范" subtitle="查看 UI 设计语言与组件规范" onClick={onOpenDesignSpec} />
          <div style={{ height: '1px', background: 'rgba(236,229,216,0.06)', marginLeft: '52px' }}></div>
          <SettingItem icon="🔌" label="接口文档" subtitle="API 接口说明与数据结构" onClick={onOpenApiDoc} />
        </div>

        {/* 碑帖进度 */}
        <div className="card card-dark fade-up" style={{ animationDelay: '0.25s' }}>
          <div className="card-title">临帖进度</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {steles.map(stele => {
              const collected = state.collection.filter(c => c.steleId === stele.id).length;
              const percent = stele.characters.length ? Math.round((collected / stele.characters.length) * 100) : 0;
              return (
                <div key={stele.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', color: '#ece5d8' }}>{stele.name}</span>
                    <span style={{ fontSize: '12px', color: '#8a8278' }}>{collected}/{stele.characters.length}</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(236,229,216,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        background: '#b06a3b',
                        borderRadius: '2px',
                        width: `${percent}%`,
                        transition: 'width 0.6s ease-out',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 关于 */}
        <div className="card card-dark fade-up" style={{ animationDelay: '0.35s', padding: '0' }}>
          <SettingItem icon="ℹ️" label="关于临池日课" subtitle="版本 1.0.0" onClick={() => showToast('临池日课 v1.0.0 · 每日一字，临帖不辍')} />
          <div style={{ height: '1px', background: 'rgba(236,229,216,0.06)', marginLeft: '52px' }}></div>
          <SettingItem icon="🔄" label="重置数据" subtitle="清除所有临写记录与集字" onClick={() => setShowResetConfirm(true)} />
        </div>

        <div style={{ textAlign: 'center', fontSize: '11px', color: '#5a5249', padding: '20px 0' }}>
          — 临池学书，池水尽墨 —
        </div>
        <div style={{ height: '20px' }}></div>
      </div>

      {/* 重置确认弹窗 */}
      {showResetConfirm && (
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeUp 0.2s ease-out',
          }}
          onClick={() => setShowResetConfirm(false)}
        >
          <div
            style={{
              width: '280px',
              background: '#2a241e',
              borderRadius: '16px',
              padding: '24px 20px',
              border: '1px solid rgba(236,229,216,0.1)',
              animation: 'inkSpread 0.3s cubic-bezier(0.22, 0.61, 0.36, 1)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontFamily: '"Ma Shan Zheng", serif', fontSize: '18px', color: '#ece5d8', textAlign: 'center', marginBottom: '10px' }}>
              确认重置
            </div>
            <div style={{ fontSize: '13px', color: '#8a8278', textAlign: 'center', lineHeight: '1.6', marginBottom: '20px' }}>
              所有临写记录、集字墙与连续天数将被清除，此操作不可撤销。
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-secondary" style={{ flex: 1, height: '40px', fontSize: '14px' }} onClick={() => setShowResetConfirm(false)}>
                取消
              </button>
              <button className="btn btn-primary" style={{ flex: 1, height: '40px', fontSize: '14px' }} onClick={handleReset}>
                确认重置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingItem({ icon, label, subtitle, onClick }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 16px',
        cursor: 'pointer',
        transition: 'background 0.2s',
      }}
      onClick={onClick}
    >
      <div style={{
        width: '32px', height: '32px', borderRadius: '8px',
        background: 'rgba(176,106,59,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '16px',
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '15px', color: '#ece5d8' }}>{label}</div>
        {subtitle && <div style={{ fontSize: '12px', color: '#7a7268', marginTop: '2px' }}>{subtitle}</div>}
      </div>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: '#5a5249' }}>
        <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// Toast 全局函数
function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    el.classList.remove('show');
  }, 2000);
}

window.MePage = MePage;
window.showToast = showToast;
