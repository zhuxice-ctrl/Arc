// 接口文档页 — REST API 契约
function ApiPage() {
  const [expanded, setExpanded] = useState(0); // 展开第 0 个

  const methodColors = {
    GET: '#6b8e7d',
    POST: '#D4A017',
    PUT: '#c89512',
    DELETE: '#b2422a',
    PATCH: '#8a7cbe',
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      <KinTopBar
        title="API 仕様書"
        subtitle="rest api · v1"
      />

      {/* Hero 介绍 */}
      <div style={{
        margin: '0 20px 16px',
        padding: 16,
        background: 'linear-gradient(135deg, rgba(212,160,23,0.1) 0%, rgba(14,14,16,0.9) 100%)',
        border: '1px solid rgba(212,160,23,0.2)',
        borderRadius: 14,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: -20, top: -20,
          width: 100, height: 100, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,160,23,0.25), transparent 70%)',
          animation: 'kinPulseGold 3s ease-in-out infinite',
        }} />
        <div style={{
          fontSize: 11, color: 'var(--kin-gold)',
          letterSpacing: '0.25em', marginBottom: 6,
        }}>BASE URL</div>
        <div style={{
          fontFamily: 'monospace', fontSize: 14,
          color: 'var(--kin-gofun)', letterSpacing: '0.02em',
        }}>https://api.kintsugi.app/v1</div>
        <div style={{
          fontSize: 11, color: 'var(--kin-sabi)',
          marginTop: 10, lineHeight: 1.7,
        }}>
          金繕ノートのバックエンド API。<br />
          器物の管理、修復記録の追加などに対応。
        </div>
      </div>

      {/* 端点列表 */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {KIN_DATA.apis.map((api, i) => {
          const isExpanded = expanded === i;
          const color = methodColors[api.method] || '#D4A017';
          return (
            <div key={i} style={{
              background: 'rgba(24,23,26,0.6)',
              border: '1px solid rgba(212,160,23,0.1)',
              borderRadius: 12,
              overflow: 'hidden',
              animation: `kinFadeInUp 400ms ease ${i * 60}ms both`,
            }}>
              {/* 头部 */}
              <button
                onClick={() => setExpanded(isExpanded ? -1 : i)}
                data-cursor="hover"
                className="kin-row"
                style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '14px 14px',
                  background: 'none', border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                }}
              >
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  padding: '3px 8px', borderRadius: 4,
                  background: `${color}22`,
                  color,
                  letterSpacing: '0.05em',
                  border: `1px solid ${color}44`,
                  minWidth: 50, textAlign: 'center',
                }}>{api.method}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'monospace', fontSize: 12,
                    color: 'var(--kin-gofun)',
                    overflow: 'hidden', textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>{api.path}</div>
                  <div style={{
                    fontSize: 10, color: 'var(--kin-sabi)',
                    marginTop: 2, letterSpacing: '0.05em',
                  }}>{api.summary}</div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2"
                  style={{
                    color: 'var(--kin-gold)',
                    transition: 'transform 300ms ease',
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
                    flexShrink: 0,
                  }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* 展开内容 */}
              {isExpanded && (
                <div style={{
                  padding: '0 14px 14px',
                  borderTop: '1px solid rgba(212,160,23,0.08)',
                  display: 'flex', flexDirection: 'column', gap: 12,
                  animation: 'kinFadeInUp 300ms ease both',
                }}>
                  {/* 参数表 */}
                  {api.params && api.params.length > 0 && (
                    <div>
                      <div style={{
                        fontSize: 10, color: 'var(--kin-gold)',
                        letterSpacing: '0.2em', margin: '12px 0 8px',
                      }}>パ ラ メ ー タ</div>
                      <div style={{
                        display: 'flex', flexDirection: 'column', gap: 4,
                      }}>
                        {api.params.map((p, pi) => (
                          <div key={pi} style={{
                            display: 'grid', gridTemplateColumns: '1fr auto',
                            gap: 6, padding: '6px 0',
                            borderBottom: '1px solid rgba(212,160,23,0.05)',
                          }}>
                            <div>
                              <span style={{
                                fontFamily: 'monospace', fontSize: 11,
                                color: 'var(--kin-gofun)',
                              }}>{p.name}</span>
                              <span style={{
                                fontSize: 9, color: 'var(--kin-sabi)',
                                marginLeft: 8,
                              }}>{p.type}</span>
                              {!p.required && (
                                <span style={{
                                  fontSize: 9, color: 'var(--kin-sabi)',
                                  marginLeft: 6, fontStyle: 'italic',
                                }}>optional</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Request Body */}
                  {api.request && (
                    <div>
                      <div style={{
                        fontSize: 10, color: 'var(--kin-gold)',
                        letterSpacing: '0.2em', margin: '12px 0 8px',
                      }}>リ ク エ ス ト ボ デ ィ</div>
                      <pre style={{
                        margin: 0, padding: '10px 12px',
                        background: 'rgba(0,0,0,0.4)',
                        border: '1px solid rgba(212,160,23,0.1)',
                        borderRadius: 8,
                        fontFamily: 'monospace',
                        fontSize: 11,
                        color: '#d4cfc0',
                        lineHeight: 1.6,
                        overflowX: 'auto',
                      }}>{api.request}</pre>
                    </div>
                  )}

                  {/* Response */}
                  {api.response && (
                    <div>
                      <div style={{
                        fontSize: 10, color: 'var(--kin-gold)',
                        letterSpacing: '0.2em', margin: '12px 0 8px',
                        display: 'flex', alignItems: 'center', gap: 8,
                      }}>
                        <span>レ ス ポ ン ス</span>
                        <span style={{
                          fontSize: 9, color: '#6b8e7d',
                          padding: '1px 6px', borderRadius: 3,
                          background: 'rgba(107,142,125,0.15)',
                          border: '1px solid rgba(107,142,125,0.3)',
                          letterSpacing: '0.05em',
                        }}>200 OK</span>
                      </div>
                      <pre style={{
                        margin: 0, padding: '10px 12px',
                        background: 'rgba(0,0,0,0.4)',
                        border: '1px solid rgba(212,160,23,0.1)',
                        borderRadius: 8,
                        fontFamily: 'monospace',
                        fontSize: 11,
                        color: '#d4cfc0',
                        lineHeight: 1.6,
                        overflowX: 'auto',
                        position: 'relative',
                      }}>{api.response}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 底部装饰签名 */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0 8px' }}>
        <KintsugiSignature width={160} height={24} />
      </div>
      <div style={{
        textAlign: 'center', fontSize: 10,
        color: 'var(--kin-sabi)', letterSpacing: '0.2em',
      }}>きんつぎ · api / v1</div>
    </div>
  );
}

Object.assign(window, { ApiPage });
