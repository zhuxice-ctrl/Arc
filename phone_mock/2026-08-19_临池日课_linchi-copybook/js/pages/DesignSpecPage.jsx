// 设计规范页
function DesignSpecPage({ onBack }) {
  const { designSpec } = window.LINCHI_DATA;
  const [activeSection, setActiveSection] = React.useState('colors');

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
        <div className="title" style={{ fontSize: '16px' }}>设计规范</div>
        <div style={{ width: '36px' }}></div>
      </div>

      {/* 形态标记 */}
      <div style={{ padding: '0 20px 12px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="seal">形态</span>
          <span style={{ fontSize: '14px', color: '#ece5d8' }}>原生 App</span>
        </div>
        <div style={{ fontSize: '12px', color: '#7a7268', marginTop: '4px' }}>
          临池日课 v1.0.0 · 设计文档
        </div>
      </div>

      {/* 分类 Tab */}
      <div style={{
        padding: '0 16px 12px',
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        {[
          { key: 'meta', label: '基础信息' },
          { key: 'colors', label: '配色' },
          { key: 'fonts', label: '字体' },
          { key: 'spacing', label: '间距' },
          { key: 'components', label: '组件' },
          { key: 'motion', label: '动效' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveSection(tab.key)}
            style={{
              flexShrink: 0,
              height: '30px',
              padding: '0 12px',
              borderRadius: '15px',
              border: 'none',
              background: activeSection === tab.key ? '#b06a3b' : 'rgba(236,229,216,0.08)',
              color: activeSection === tab.key ? '#f2ead8' : '#c8c0b0',
              fontSize: '13px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="content">
        {activeSection === 'meta' && (
          <div className="card card-dark fade-up">
            <div className="card-title">基础信息</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {designSpec.meta.map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(236,229,216,0.06)' }}>
                  <span style={{ fontSize: '13px', color: '#8a8278' }}>{item.label}</span>
                  <span style={{ fontSize: '13px', color: '#ece5d8' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'colors' && (
          <div style={{ padding: '0 16px' }}>
            <div style={{ fontFamily: '"Ma Shan Zheng", serif', fontSize: '18px', color: '#ece5d8', marginBottom: '12px' }}>
              色板
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {designSpec.colors.map((c, idx) => (
                <div
                  key={c.name}
                  className="fade-up"
                  style={{
                    animationDelay: `${idx * 0.05}s`,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: '#2a241e',
                    border: '1px solid rgba(236,229,216,0.06)',
                  }}
                >
                  <div style={{
                    height: '80px',
                    background: c.value,
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end',
                    padding: '8px',
                  }}>
                    <span style={{
                      fontSize: '10px',
                      color: ['#1a1714', '#ece5d8', '#f2ead8'].includes(c.value) ? '#1a1714' : '#f2ead8',
                      fontFamily: 'monospace',
                      background: 'rgba(255,255,255,0.2)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}>{c.value}</span>
                  </div>
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ fontSize: '13px', color: '#ece5d8', marginBottom: '2px' }}>{c.name}</div>
                    <div style={{ fontSize: '11px', color: '#7a7268' }}>{c.role}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: '20px', padding: '14px',
              borderRadius: '12px',
              background: 'rgba(176,106,59,0.1)',
              border: '1px solid rgba(176,106,59,0.2)',
            }}>
              <div style={{ fontSize: '12px', color: '#b06a3b', fontWeight: 500, marginBottom: '4px' }}>设计原则</div>
              <div style={{ fontSize: '12px', color: '#c8c0b0', lineHeight: '1.6' }}>
                以碑拓深炭为底，拓白为字，赭石为印。宣纸米白用于卡片与书写面，呼应文房纸墨之质。
              </div>
            </div>
          </div>
        )}

        {activeSection === 'fonts' && (
          <div style={{ padding: '0 16px' }}>
            <div style={{ fontFamily: '"Ma Shan Zheng", serif', fontSize: '18px', color: '#ece5d8', marginBottom: '12px' }}>
              字体家族
            </div>
            {designSpec.fonts.map((f, idx) => (
              <div
                key={f.name}
                className="fade-up card-dark"
                style={{
                  animationDelay: `${idx * 0.1}s`,
                  padding: '16px',
                  borderRadius: '12px',
                  marginBottom: '10px',
                  border: '1px solid rgba(236,229,216,0.06)',
                }}
              >
                <div style={{ fontSize: '12px', color: '#8a8278', marginBottom: '8px' }}>{f.name}</div>
                <div
                  style={{
                    fontFamily: f.value,
                    fontSize: '24px',
                    color: '#ece5d8',
                    marginBottom: '8px',
                  }}
                >
                  {f.name === '展示字体' ? '永字八法' : f.name === '正文字体' ? '临池学书，池水尽墨' : '1234567890'}
                </div>
                <div style={{ fontSize: '11px', color: '#7a7268', lineHeight: '1.5' }}>{f.desc}</div>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'spacing' && (
          <div style={{ padding: '0 16px' }}>
            <div style={{ fontFamily: '"Ma Shan Zheng", serif', fontSize: '18px', color: '#ece5d8', marginBottom: '12px' }}>
              间距尺度
            </div>
            <div className="card-dark" style={{ padding: '16px', borderRadius: '12px' }}>
              {designSpec.spacing.map(s => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', color: '#8a8278', width: '30px' }}>{s.name}</span>
                  <div
                    style={{
                      height: '12px',
                      background: '#b06a3b',
                      width: s.value,
                      borderRadius: '2px',
                    }}
                  />
                  <span style={{ fontSize: '11px', color: '#7a7268', marginLeft: 'auto' }}>{s.value}</span>
                </div>
              ))}
            </div>
            <div style={{ fontFamily: '"Ma Shan Zheng", serif', fontSize: '18px', color: '#ece5d8', margin: '20px 0 12px' }}>
              圆角尺度
            </div>
            <div className="card-dark" style={{ padding: '16px', borderRadius: '12px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {designSpec.radii.map(r => (
                <div key={r.name} style={{ flex: '0 0 calc(50% - 5px)', textAlign: 'center' }}>
                  <div
                    style={{
                      height: '60px',
                      background: 'rgba(176,106,59,0.2)',
                      border: '1px solid rgba(176,106,59,0.3)',
                      borderRadius: r.value,
                      marginBottom: '6px',
                    }}
                  />
                  <div style={{ fontSize: '11px', color: '#c8c0b0' }}>{r.name}</div>
                  <div style={{ fontSize: '10px', color: '#7a7268' }}>{r.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'components' && (
          <div style={{ padding: '0 16px' }}>
            <div style={{ fontFamily: '"Ma Shan Zheng", serif', fontSize: '18px', color: '#ece5d8', marginBottom: '12px' }}>
              组件清单
            </div>
            {designSpec.components.map((name, idx) => (
              <div
                key={name}
                className="fade-up"
                style={{
                  animationDelay: `${idx * 0.05}s`,
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: '#2a241e',
                  border: '1px solid rgba(236,229,216,0.06)',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div style={{
                  width: '24px', height: '24px', borderRadius: '6px',
                  background: 'rgba(176,106,59,0.15)', color: '#b06a3b',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 600,
                }}>
                  {idx + 1}
                </div>
                <span style={{ fontSize: '14px', color: '#ece5d8' }}>{name}</span>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'motion' && (
          <div style={{ padding: '0 16px' }}>
            <div style={{ fontFamily: '"Ma Shan Zheng", serif', fontSize: '18px', color: '#ece5d8', marginBottom: '12px' }}>
              动效原则
            </div>
            {designSpec.motionPrinciples.map((p, idx) => (
              <div
                key={idx}
                className="fade-up"
                style={{
                  animationDelay: `${idx * 0.08}s`,
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: '#2a241e',
                  border: '1px solid rgba(236,229,216,0.06)',
                  marginBottom: '8px',
                }}
              >
                <div style={{ fontSize: '13px', color: '#ece5d8', lineHeight: '1.6' }}>{p}</div>
              </div>
            ))}
            <div style={{
              marginTop: '16px', padding: '14px',
              borderRadius: '12px',
              background: 'rgba(176,106,59,0.1)',
              border: '1px solid rgba(176,106,59,0.2)',
            }}>
              <div style={{ fontSize: '12px', color: '#b06a3b', fontWeight: 500, marginBottom: '4px' }}>禁忌</div>
              <div style={{ fontSize: '12px', color: '#c8c0b0', lineHeight: '1.6' }}>
                禁止粒子光晕、整图缩放 Ken Burns 效果、网页缩进手机的漂浮感。
              </div>
            </div>
          </div>
        )}

        <div style={{ height: '20px' }}></div>
      </div>
    </div>
  );
}

window.DesignSpecPage = DesignSpecPage;
