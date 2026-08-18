// 接口文档页
function ApiDocPage({ onBack }) {
  const { apiDoc } = window.LINCHI_DATA;
  const [expanded, setExpanded] = React.useState({});

  function toggle(key) {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  }

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
        <div className="title" style={{ fontSize: '16px' }}>接口文档</div>
        <div style={{ width: '36px' }}></div>
      </div>

      <div style={{ padding: '0 20px 12px' }}>
        <div style={{ fontSize: '13px', color: '#7a7268' }}>临池日课 v1.0.0 · REST API</div>
      </div>

      <div className="content">
        {apiDoc.map((group, gIdx) => (
          <div key={group.group} style={{ marginBottom: '16px' }}>
            <div
              style={{
                padding: '12px 20px',
                fontSize: '13px',
                color: '#b06a3b',
                fontWeight: 600,
                letterSpacing: '0.5px',
              }}
            >
              {group.group}
            </div>

            {group.apis.map((api, aIdx) => {
              const key = `${gIdx}-${aIdx}`;
              const isOpen = expanded[key];
              return (
                <div
                  key={api.path}
                  style={{
                    margin: '0 16px 8px',
                    background: '#2a241e',
                    border: '1px solid rgba(236,229,216,0.06)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    onClick={() => toggle(key)}
                    style={{
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 7px',
                      borderRadius: '4px',
                      background: api.method === 'GET' ? 'rgba(90, 160, 120, 0.2)' : 'rgba(176, 106, 59, 0.2)',
                      color: api.method === 'GET' ? '#5aa078' : '#b06a3b',
                      minWidth: '46px',
                      textAlign: 'center',
                    }}>
                      {api.method}
                    </span>
                    <span style={{ fontSize: '13px', color: '#ece5d8', flex: 1, fontFamily: 'monospace', fontSize: '12px' }}>
                      {api.path}
                    </span>
                    <svg
                      width="16" height="16" viewBox="0 0 16 16" fill="none"
                      style={{
                        color: '#7a7268',
                        transition: 'transform 0.2s',
                        transform: isOpen ? 'rotate(90deg)' : 'rotate(0)',
                      }}
                    >
                      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  {isOpen && (
                    <div style={{
                      padding: '0 16px 14px',
                      animation: 'fadeUp 0.2s ease-out',
                      borderTop: '1px solid rgba(236,229,216,0.06)',
                    }}>
                      <div style={{ fontSize: '13px', color: '#c8c0b0', marginTop: '12px', marginBottom: '6px' }}>{api.desc}</div>

                      <div style={{ fontSize: '12px', color: '#8a8278', marginTop: '10px', marginBottom: '4px' }}>请求</div>
                      <div style={{
                        background: '#1a1714',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        color: '#c8c0b0',
                        lineHeight: '1.6',
                        overflowX: 'auto',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                      }}>
                        {api.request}
                      </div>

                      <div style={{ fontSize: '12px', color: '#8a8278', marginTop: '10px', marginBottom: '4px' }}>响应</div>
                      <div style={{
                        background: '#1a1714',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        color: '#a0c8a0',
                        lineHeight: '1.6',
                        overflowX: 'auto',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                      }}>
                        {api.response}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* 状态码 */}
        <div style={{ margin: '0 16px 20px' }}>
          <div style={{
            padding: '12px 0',
            fontSize: '13px',
            color: '#b06a3b',
            fontWeight: 600,
          }}>
            状态码
          </div>
          <div className="card-dark" style={{ padding: '14px 16px', borderRadius: '12px', margin: 0 }}>
            {[
              { code: '200', desc: '请求成功' },
              { code: '201', desc: '创建成功' },
              { code: '400', desc: '请求参数错误' },
              { code: '401', desc: '未授权' },
              { code: '404', desc: '资源不存在' },
              { code: '500', desc: '服务器错误' },
            ].map(item => (
              <div key={item.code} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '6px 0',
                borderBottom: '1px solid rgba(236,229,216,0.04)',
                fontSize: '12px',
              }}>
                <span style={{ color: '#b06a3b', fontFamily: 'monospace' }}>{item.code}</span>
                <span style={{ color: '#c8c0b0' }}>{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: '20px' }}></div>
      </div>
    </div>
  );
}

window.ApiDocPage = ApiDocPage;
