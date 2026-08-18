// 纹枰 — 设计规范 & 接口文档页面

const { useState } = React;
const { WENPING_COLORS, NavBar, WenPingCard, WenPingTag } = window;

// ============ 设计规范页 ============
function DesignSpecPage({ onBack }) {
  const [activeSection, setActiveSection] = useState('colors');

  const sections = [
    { id: 'colors', label: '色板' },
    { id: 'typography', label: '字体' },
    { id: 'spacing', label: '间距' },
    { id: 'animations', label: '动效' },
    { id: 'components', label: '组件' },
  ];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: WENPING_COLORS.paper,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <NavBar title="设计规范" subtitle="纹枰 Design System v2" onBack={onBack} />

      {/* 分段 */}
      <div style={{
        display: 'flex',
        gap: 4,
        padding: '10px 12px',
        overflowX: 'auto',
        borderBottom: `1px solid ${WENPING_COLORS.lineBrown}`,
        flexShrink: 0,
      }}>
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            style={{
              flexShrink: 0,
              padding: '6px 12px',
              borderRadius: 8,
              border: 'none',
              background: activeSection === s.id ? WENPING_COLORS.ink : 'transparent',
              color: activeSection === s.id ? WENPING_COLORS.stoneWhite : WENPING_COLORS.deepBrown,
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: '"LXGW WenKai", "KaiTi", serif',
              transition: 'all 0.2s',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 12px 24px' }}>
        {/* 色板 */}
        {activeSection === 'colors' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{
              fontSize: 14, fontWeight: 600, color: WENPING_COLORS.ink,
              fontFamily: '"Noto Serif SC", "Songti SC", serif', marginBottom: 4,
            }}>
              主色系
            </div>
            {[
              { key: 'board', name: '榧木黄', desc: '棋盘主色，榧木色调' },
              { key: 'stoneBlack', name: '墨石黑', desc: '黑子颜色，墨玉深邃' },
              { key: 'stoneWhite', name: '蛤白', desc: '白子颜色，蛤贝质感' },
              { key: 'ink', name: '墨棕', desc: '主文字与深色块' },
              { key: 'paper', name: '宣纸白', desc: '页面背景，宣纸质感' },
              { key: 'moss', name: '苔绿', desc: '点缀强调色' },
              { key: 'deepBrown', name: '深棕', desc: '次级文字' },
              { key: 'lineBrown', name: '浅棕线', desc: '分割线与边框' },
            ].map((c) => {
              const color = DESIGN_TOKENS.colors[c.key] || {};
              const val = color.value || WENPING_COLORS[c.key];
              return (
                <div
                  key={c.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                    background: '#fff',
                    borderRadius: 10,
                    border: `1px solid ${WENPING_COLORS.lineBrown}`,
                  }}
                >
                  <div style={{
                    width: 40, height: 40,
                    borderRadius: 8,
                    background: val,
                    border: c.key === 'paper' ? `1px solid ${WENPING_COLORS.lineBrown}` : 'none',
                    flexShrink: 0,
                    boxShadow: c.key === 'board' ? 'inset 0 2px 4px rgba(139,105,20,0.2)' : 'none',
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 14, fontWeight: 600, color: WENPING_COLORS.ink,
                      fontFamily: '"Noto Serif SC", "Songti SC", serif',
                    }}>
                      {c.name}
                    </div>
                    <div style={{
                      fontSize: 11,
                      color: WENPING_COLORS.deepBrown,
                      fontFamily: '"JetBrains Mono", monospace',
                      marginTop: 2,
                    }}>
                      {val}
                    </div>
                    <div style={{
                      fontSize: 11,
                      color: WENPING_COLORS.deepBrown,
                      marginTop: 2,
                      fontFamily: '"LXGW WenKai", "KaiTi", serif',
                    }}>
                      {c.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 字体 */}
        {activeSection === 'typography' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              {
                name: '标题宋体',
                family: '"Noto Serif SC", "Songti SC", serif',
                usage: '页面大标题、重要数字、棋谱名称',
                sample: '纹枰论道',
                sizes: [
                  { size: 28, weight: 700, label: '大标题 H1' },
                  { size: 20, weight: 600, label: '标题 H2' },
                  { size: 16, weight: 600, label: '小标题 H3' },
                ],
              },
              {
                name: '正文楷体',
                family: '"LXGW WenKai", "KaiTi", "STKaiti", serif',
                usage: '正文、谱注、说明文字',
                sample: '琴棋书画，文人四艺',
                sizes: [
                  { size: 17, weight: 400, label: '正文' },
                  { size: 15, weight: 400, label: '次级正文' },
                  { size: 13, weight: 400, label: '辅助文字' },
                ],
              },
              {
                name: '数据等宽',
                family: '"JetBrains Mono", "SF Mono", monospace',
                usage: '手数、API 路径、代码示例',
                sample: 'Move 127',
                sizes: [
                  { size: 15, weight: 600, label: '数据强调' },
                  { size: 13, weight: 400, label: '数据正文' },
                  { size: 11, weight: 400, label: '数据辅助' },
                ],
              },
            ].map((font, idx) => (
              <div
                key={idx}
                style={{
                  padding: '14px',
                  background: '#fff',
                  borderRadius: 10,
                  border: `1px solid ${WENPING_COLORS.lineBrown}`,
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                  <div style={{
                    fontSize: 15, fontWeight: 600, color: WENPING_COLORS.ink,
                    fontFamily: '"Noto Serif SC", "Songti SC", serif',
                  }}>
                    {font.name}
                  </div>
                  <WenPingTag color="brown" size="sm">{idx === 0 ? 'Display' : idx === 1 ? 'Body' : 'Mono'}</WenPingTag>
                </div>
                <div style={{
                  fontSize: 22,
                  color: WENPING_COLORS.ink,
                  fontFamily: font.family,
                  marginBottom: 10,
                }}>
                  {font.sample}
                </div>
                <div style={{
                  fontSize: 11,
                  color: WENPING_COLORS.deepBrown,
                  marginBottom: 12,
                  fontFamily: '"LXGW WenKai", "KaiTi", serif',
                }}>
                  {font.usage}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {font.sizes.map((s, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                    }}>
                      <span style={{
                        fontSize: s.size,
                        fontWeight: s.weight,
                        fontFamily: font.family,
                        color: WENPING_COLORS.ink,
                      }}>
                        {font.sample}
                      </span>
                      <span style={{
                        fontSize: 10,
                        color: WENPING_COLORS.deepBrown,
                        fontFamily: '"JetBrains Mono", monospace',
                      }}>
                        {s.size}px {s.weight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 间距 */}
        {activeSection === 'spacing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{
              fontSize: 14, fontWeight: 600, color: WENPING_COLORS.ink,
              fontFamily: '"Noto Serif SC", "Songti SC", serif', marginBottom: 4,
            }}>
              间距刻度
            </div>
            {Object.entries(DESIGN_TOKENS.spacing).map(([name, val]) => (
              <div key={name} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '8px 12px',
                background: '#fff',
                borderRadius: 8,
                border: `1px solid ${WENPING_COLORS.lineBrown}`,
              }}>
                <div style={{
                  width: parseInt(val) * 2,
                  height: 16,
                  background: WENPING_COLORS.moss,
                  opacity: 0.6,
                  borderRadius: 2,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 13,
                    color: WENPING_COLORS.ink,
                    fontFamily: '"JetBrains Mono", monospace',
                  }}>
                    --space-{name}
                  </div>
                </div>
                <div style={{
                  fontSize: 12,
                  color: WENPING_COLORS.deepBrown,
                  fontFamily: '"JetBrains Mono", monospace',
                }}>
                  {val}
                </div>
              </div>
            ))}

            <div style={{
              fontSize: 14, fontWeight: 600, color: WENPING_COLORS.ink,
              fontFamily: '"Noto Serif SC", "Songti SC", serif',
              margin: '16px 0 4px',
            }}>
              圆角
            </div>
            <div style={{
              display: 'flex',
              gap: 12,
              padding: '12px',
              background: '#fff',
              borderRadius: 10,
              border: `1px solid ${WENPING_COLORS.lineBrown}`,
              flexWrap: 'wrap',
              justifyContent: 'space-around',
            }}>
              {Object.entries(DESIGN_TOKENS.radii).map(([name, val]) => (
                <div key={name} style={{ textAlign: 'center' }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    background: WENPING_COLORS.board,
                    borderRadius: val,
                    marginBottom: 4,
                  }} />
                  <div style={{
                    fontSize: 10,
                    color: WENPING_COLORS.deepBrown,
                    fontFamily: '"JetBrains Mono", monospace',
                  }}>
                    {name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 动效 */}
        {activeSection === 'animations' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{
              fontSize: 14, fontWeight: 600, color: WENPING_COLORS.ink,
              fontFamily: '"Noto Serif SC", "Songti SC", serif', marginBottom: 4,
            }}>
              动效参数
            </div>
            {Object.entries(DESIGN_TOKENS.animations).map(([key, anim]) => (
              <div key={key} style={{
                padding: '12px 14px',
                background: '#fff',
                borderRadius: 10,
                border: `1px solid ${WENPING_COLORS.lineBrown}`,
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 6,
                }}>
                  <span style={{
                    fontSize: 14, fontWeight: 600, color: WENPING_COLORS.ink,
                    fontFamily: '"Noto Serif SC", "Songti SC", serif',
                  }}>
                    {anim.name}
                  </span>
                  <WenPingTag color="moss" size="sm">{anim.duration}</WenPingTag>
                </div>
                <div style={{
                  fontSize: 11,
                  color: WENPING_COLORS.deepBrown,
                  marginBottom: 6,
                  fontFamily: '"JetBrains Mono", monospace',
                  wordBreak: 'break-all',
                }}>
                  {anim.easing}
                </div>
                <div style={{
                  fontSize: 12,
                  color: WENPING_COLORS.deepBrown,
                  fontFamily: '"LXGW WenKai", "KaiTi", serif',
                }}>
                  {anim.description}
                </div>
              </div>
            ))}
            <div style={{
              padding: '12px 14px',
              background: 'rgba(107, 142, 90, 0.08)',
              borderRadius: 10,
              border: `1px solid rgba(107,142,90,0.2)`,
              fontSize: 12,
              color: WENPING_COLORS.moss,
              fontFamily: '"LXGW WenKai", "KaiTi", serif',
              lineHeight: 1.5,
            }}>
              动效原则：有重量感，符合石子的性格。<br />
              禁止每屏大型入场动画。<br />
              支持 prefers-reduced-motion。
            </div>
          </div>
        )}

        {/* 组件 */}
        {activeSection === 'components' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{
              padding: '14px',
              background: '#fff',
              borderRadius: 10,
              border: `1px solid ${WENPING_COLORS.lineBrown}`,
            }}>
              <div style={{
                fontSize: 14, fontWeight: 600, color: WENPING_COLORS.ink,
                fontFamily: '"Noto Serif SC", "Songti SC", serif', marginBottom: 12,
              }}>
                按钮 Buttons
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <WenPingButton size="sm" variant="primary">主按钮</WenPingButton>
                <WenPingButton size="sm" variant="secondary">次按钮</WenPingButton>
                <WenPingButton size="sm" variant="ghost">幽灵</WenPingButton>
                <WenPingButton size="sm" variant="moss">苔绿</WenPingButton>
              </div>
            </div>

            <div style={{
              padding: '14px',
              background: '#fff',
              borderRadius: 10,
              border: `1px solid ${WENPING_COLORS.lineBrown}`,
            }}>
              <div style={{
                fontSize: 14, fontWeight: 600, color: WENPING_COLORS.ink,
                fontFamily: '"Noto Serif SC", "Songti SC", serif', marginBottom: 12,
              }}>
                徽标 Tags
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <WenPingTag color="moss" size="sm">苔绿</WenPingTag>
                <WenPingTag color="brown" size="sm">深棕</WenPingTag>
                <WenPingTag color="ink" size="sm">墨色</WenPingTag>
                <WenPingTag color="moss" size="md">苔绿中号</WenPingTag>
              </div>
            </div>

            <div style={{
              padding: '14px',
              background: '#fff',
              borderRadius: 10,
              border: `1px solid ${WENPING_COLORS.lineBrown}`,
            }}>
              <div style={{
                fontSize: 14, fontWeight: 600, color: WENPING_COLORS.ink,
                fontFamily: '"Noto Serif SC", "Songti SC", serif', marginBottom: 12,
              }}>
                棋子展示
              </div>
              <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #4A4A4A, #1A1A1A 60%, #0A0A0A)',
                    boxShadow: '2px 3px 6px rgba(0,0,0,0.3)',
                    margin: '0 auto 6px',
                  }} />
                  <div style={{ fontSize: 11, color: WENPING_COLORS.deepBrown }}>黑子</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #FFFEF9, #F5F1E8 70%, #E8E0CC)',
                    border: '1px solid #C8BFA8',
                    boxShadow: '2px 3px 6px rgba(44,24,16,0.2)',
                    margin: '0 auto 6px',
                  }} />
                  <div style={{ fontSize: 11, color: WENPING_COLORS.deepBrown }}>白子</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ 接口文档页 ============
function ApiDocPage({ onBack }) {
  const [selectedApi, setSelectedApi] = useState(null);
  const [codeTab, setCodeTab] = useState('response');

  const getMethodColor = (method) => {
    const colors = {
      GET: '#6B8E5A',
      POST: '#C4953A',
      PUT: '#5A7A8E',
      DELETE: '#B85450',
    };
    return colors[method] || WENPING_COLORS.deepBrown;
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: WENPING_COLORS.paper,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <NavBar
        title="接口文档"
        subtitle="RESTful API v2"
        onBack={onBack}
      />

      {!selectedApi ? (
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          <div style={{
            fontSize: 13,
            color: WENPING_COLORS.deepBrown,
            marginBottom: 10,
            fontFamily: '"LXGW WenKai", "KaiTi", serif',
          }}>
            共 {MOCK_APIS.length} 个接口
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {MOCK_APIS.map((api, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedApi(api)}
                style={{
                  padding: '12px 14px',
                  background: '#fff',
                  borderRadius: 10,
                  border: `1px solid ${WENPING_COLORS.lineBrown}`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  animation: `slideIn 0.3s ease-out ${idx * 0.03}s both`,
                }}
              >
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: getMethodColor(api.method),
                  fontFamily: '"JetBrains Mono", monospace',
                  width: 52,
                  flexShrink: 0,
                }}>
                  {api.method}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13,
                    color: WENPING_COLORS.ink,
                    fontFamily: '"JetBrains Mono", monospace',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {api.path}
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: WENPING_COLORS.deepBrown,
                    marginTop: 2,
                    fontFamily: '"LXGW WenKai", "KaiTi", serif',
                  }}>
                    {api.summary}
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={WENPING_COLORS.deepBrown} strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          <button
            onClick={() => setSelectedApi(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              border: 'none',
              background: 'transparent',
              color: WENPING_COLORS.deepBrown,
              fontSize: 13,
              cursor: 'pointer',
              marginBottom: 12,
              fontFamily: '"LXGW WenKai", "KaiTi", serif',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            返回列表
          </button>

          <div style={{
            padding: '14px',
            background: '#fff',
            borderRadius: 10,
            border: `1px solid ${WENPING_COLORS.lineBrown}`,
            marginBottom: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{
                fontSize: 12,
                fontWeight: 700,
                color: getMethodColor(selectedApi.method),
                background: `${getMethodColor(selectedApi.method)}15`,
                padding: '3px 8px',
                borderRadius: 4,
                fontFamily: '"JetBrains Mono", monospace',
              }}>
                {selectedApi.method}
              </span>
            </div>
            <div style={{
              fontSize: 14,
              color: WENPING_COLORS.ink,
              fontFamily: '"JetBrains Mono", monospace',
              wordBreak: 'break-all',
              marginBottom: 6,
            }}>
              {selectedApi.path}
            </div>
            <div style={{
              fontSize: 13,
              color: WENPING_COLORS.deepBrown,
              fontFamily: '"LXGW WenKai", "KaiTi", serif',
            }}>
              {selectedApi.summary}
            </div>
          </div>

          {/* 参数 */}
          {selectedApi.params && selectedApi.params.length > 0 && (
            <div style={{
              padding: '14px',
              background: '#fff',
              borderRadius: 10,
              border: `1px solid ${WENPING_COLORS.lineBrown}`,
              marginBottom: 12,
            }}>
              <div style={{
                fontSize: 14, fontWeight: 600, color: WENPING_COLORS.ink,
                fontFamily: '"Noto Serif SC", "Songti SC", serif', marginBottom: 10,
              }}>
                参数
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {selectedApi.params.map((p, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    gap: 8,
                    padding: '8px 0',
                    borderBottom: i < selectedApi.params.length - 1 ? `1px dashed ${WENPING_COLORS.lineBrown}` : 'none',
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: 12,
                        color: WENPING_COLORS.ink,
                        fontFamily: '"JetBrains Mono", monospace',
                        fontWeight: 600,
                      }}>
                        {p.name}
                        {p.required && <span style={{ color: '#B85450', marginLeft: 4 }}>*</span>}
                      </div>
                      <div style={{
                        fontSize: 11,
                        color: WENPING_COLORS.moss,
                        fontFamily: '"JetBrains Mono", monospace',
                        marginTop: 2,
                      }}>
                        {p.type}
                      </div>
                    </div>
                    <div style={{
                      fontSize: 12,
                      color: WENPING_COLORS.deepBrown,
                      fontFamily: '"LXGW WenKai", "KaiTi", serif',
                      flex: 1.5,
                    }}>
                      {p.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 请求体 / 响应 */}
          <div style={{
            background: '#fff',
            borderRadius: 10,
            border: `1px solid ${WENPING_COLORS.lineBrown}`,
            overflow: 'hidden',
          }}>
            <div style={{
              display: 'flex',
              borderBottom: `1px solid ${WENPING_COLORS.lineBrown}`,
            }}>
              {selectedApi.requestBody && (
                <button
                  onClick={() => setCodeTab('request')}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    border: 'none',
                    background: codeTab === 'request' ? 'rgba(44,24,16,0.05)' : 'transparent',
                    color: codeTab === 'request' ? WENPING_COLORS.ink : WENPING_COLORS.deepBrown,
                    fontSize: 12,
                    cursor: 'pointer',
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                >
                  请求体
                </button>
              )}
              <button
                onClick={() => setCodeTab('response')}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  border: 'none',
                  background: codeTab === 'response' ? 'rgba(44,24,16,0.05)' : 'transparent',
                  color: codeTab === 'response' ? WENPING_COLORS.ink : WENPING_COLORS.deepBrown,
                  fontSize: 12,
                  cursor: 'pointer',
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              >
                响应
              </button>
            </div>
            <pre style={{
              margin: 0,
              padding: '12px 14px',
              fontSize: 11,
              color: '#E8E0CC',
              background: '#2C1810',
              fontFamily: '"JetBrains Mono", monospace',
              lineHeight: 1.5,
              overflowX: 'auto',
              maxHeight: 320,
            }}>
              {codeTab === 'request' ? selectedApi.requestBody : selectedApi.response}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

window.DesignSpecPage = DesignSpecPage;
window.ApiDocPage = ApiDocPage;
