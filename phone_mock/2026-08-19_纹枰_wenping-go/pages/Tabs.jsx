// 纹枰 — 各页面组件
// 今日 / 谱库 / 妙手集 / 我的 / 打谱页 / 设计规范 / 接口文档

const { useState, useEffect, useMemo, useRef } = React;
const {
  WENPING_COLORS, NavBar, TabContent, WenPingButton, WenPingCard, WenPingTag,
} = window;

// ============ 今日页面 ============
function TodayPage({ onOpenGame, onOpenTSG, onOpenLibrary }) {
  const [refreshing, setRefreshing] = useState(false);
  const todayGame = ALL_GAMES[0]; // 当湖十局第三局
  const todayTSG = TSGOKA_PROBLEMS[0];
  const quote = {
    text: '棋者，以正合其势，以权制其敌。',
    author: '《棋经十三篇·合战篇》',
  };
  const streak = 15;

  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: WENPING_COLORS.paper,
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>
      <NavBar
        title="今日"
        subtitle={new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })}
      />

      <div style={{ padding: '16px 16px 80px' }} onTouchEnd={handleRefresh}>
        {/* 下拉刷新提示 */}
        {refreshing && (
          <div style={{
            textAlign: 'center',
            padding: '8px 0',
            color: WENPING_COLORS.deepBrown,
            fontSize: 12,
            animation: 'spin 1s linear infinite',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </div>
        )}

        {/* 每日引言 */}
        <WenPingCard style={{
          padding: '20px 18px',
          marginBottom: 16,
          background: `linear-gradient(135deg, ${WENPING_COLORS.board} 0%, ${WENPING_COLORS.paper} 100%)`,
          border: `1px solid ${WENPING_COLORS.lineBrown}`,
        }}>
          <div style={{
            fontSize: 13,
            color: WENPING_COLORS.deepBrown,
            marginBottom: 8,
            fontFamily: '"LXGW WenKai", "KaiTi", serif',
          }}>
            每日一语
          </div>
          <div style={{
            fontSize: 18,
            color: WENPING_COLORS.ink,
            fontFamily: '"Noto Serif SC", "Songti SC", serif',
            fontWeight: 600,
            lineHeight: 1.6,
            marginBottom: 8,
          }}>
            「{quote.text}」
          </div>
          <div style={{
            fontSize: 12,
            color: WENPING_COLORS.deepBrown,
            textAlign: 'right',
            fontFamily: '"LXGW WenKai", "KaiTi", serif',
          }}>
            — {quote.author}
          </div>
        </WenPingCard>

        {/* 连续打卡 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          padding: '12px 16px',
          background: 'rgba(107, 142, 90, 0.08)',
          borderRadius: 12,
          border: `1px solid rgba(107,142,90,0.2)`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36,
              borderRadius: '50%',
              background: WENPING_COLORS.moss,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff',
              fontSize: 18,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: WENPING_COLORS.ink, fontFamily: '"LXGW WenKai", "KaiTi", serif' }}>
                连续打谱 {streak} 天
              </div>
              <div style={{ fontSize: 11, color: WENPING_COLORS.deepBrown }}>
                坚持下去，棋力日进
              </div>
            </div>
          </div>
          <div style={{
            fontSize: 24,
            fontWeight: 700,
            color: WENPING_COLORS.moss,
            fontFamily: '"JetBrains Mono", monospace',
          }}>
            {streak}
          </div>
        </div>

        {/* 今日一局 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}>
            <div style={{
              fontSize: 16,
              fontWeight: 700,
              color: WENPING_COLORS.ink,
              fontFamily: '"Noto Serif SC", "Songti SC", serif',
            }}>
              今日一局
            </div>
            <button onClick={onOpenLibrary} style={{
              fontSize: 12,
              color: WENPING_COLORS.moss,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: '"LXGW WenKai", "KaiTi", serif',
            }}>
              查看全部 →
            </button>
          </div>
          <WenPingCard
            onClick={() => onOpenGame(todayGame)}
            style={{
              padding: 0,
              cursor: 'pointer',
              overflow: 'hidden',
              transition: 'transform 0.2s',
            }}
          >
            {/* 棋盘缩略图 */}
            <div style={{
              height: 140,
              background: `linear-gradient(145deg, ${WENPING_COLORS.board}, #D4BE8A)`,
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {/* 装饰性棋盘格 */}
              <svg width="120" height="120" viewBox="0 0 100 100" style={{ opacity: 0.3 }}>
                {Array.from({ length: 11 }).map((_, i) => (
                  <React.Fragment key={i}>
                    <line x1={i * 10} y1="0" x2={i * 10} y2="100" stroke={WENPING_COLORS.ink} strokeWidth="0.5" />
                    <line x1="0" y1={i * 10} x2="100" y2={i * 10} stroke={WENPING_COLORS.ink} strokeWidth="0.5" />
                  </React.Fragment>
                ))}
                {/* 几个装饰棋子 */}
                <circle cx="30" cy="30" r="4" fill="#1A1A1A" />
                <circle cx="70" cy="70" r="4" fill="#F5F1E8" stroke="#C8BFA8" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="4" fill="#1A1A1A" />
                <circle cx="70" cy="30" r="4" fill="#F5F1E8" stroke="#C8BFA8" strokeWidth="0.5" />
              </svg>
              <div style={{
                position: 'absolute',
                top: 10,
                left: 12,
                display: 'flex',
                gap: 6,
              }}>
                <WenPingTag color="moss">推荐</WenPingTag>
                <WenPingTag color="brown">{todayGame.category}</WenPingTag>
              </div>
            </div>
            <div style={{ padding: '12px 14px 14px' }}>
              <div style={{
                fontSize: 17,
                fontWeight: 700,
                color: WENPING_COLORS.ink,
                fontFamily: '"Noto Serif SC", "Songti SC", serif',
                marginBottom: 6,
              }}>
                {todayGame.title}
              </div>
              <div style={{
                fontSize: 13,
                color: WENPING_COLORS.deepBrown,
                marginBottom: 8,
                fontFamily: '"LXGW WenKai", "KaiTi", serif',
              }}>
                {todayGame.black.name} 执黑 · 对 · {todayGame.white.name} 执白
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div style={{ display: 'flex', gap: 12, fontSize: 12, color: WENPING_COLORS.deepBrown }}>
                  <span>{todayGame.year} 年</span>
                  <span>共 {todayGame.totalMoves} 手</span>
                </div>
                <WenPingButton size="sm" variant="primary">
                  开始打谱
                </WenPingButton>
              </div>
            </div>
          </WenPingCard>
        </div>

        {/* 每日一题 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}>
            <div style={{
              fontSize: 16,
              fontWeight: 700,
              color: WENPING_COLORS.ink,
              fontFamily: '"Noto Serif SC", "Songti SC", serif',
            }}>
              每日一题
            </div>
            <WenPingTag color="ink" size="sm">难度 {todayTSG.difficulty}</WenPingTag>
          </div>
          <WenPingCard
            onClick={() => onOpenTSG(todayTSG)}
            style={{
              padding: '14px',
              cursor: 'pointer',
              display: 'flex',
              gap: 12,
              alignItems: 'center',
            }}
          >
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 8,
              background: WENPING_COLORS.board,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="36" height="36" viewBox="0 0 100 100">
                <rect x="10" y="10" width="80" height="80" fill="none" stroke={WENPING_COLORS.ink} strokeWidth="2" />
                <line x1="35" y1="10" x2="35" y2="90" stroke={WENPING_COLORS.ink} strokeWidth="0.8" />
                <line x1="65" y1="10" x2="65" y2="90" stroke={WENPING_COLORS.ink} strokeWidth="0.8" />
                <line x1="10" y1="35" x2="90" y2="35" stroke={WENPING_COLORS.ink} strokeWidth="0.8" />
                <line x1="10" y1="65" x2="90" y2="65" stroke={WENPING_COLORS.ink} strokeWidth="0.8" />
                <circle cx="50" cy="50" r="8" fill="#1A1A1A" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 15,
                fontWeight: 600,
                color: WENPING_COLORS.ink,
                fontFamily: '"Noto Serif SC", "Songti SC", serif',
                marginBottom: 4,
              }}>
                {todayTSG.title}
              </div>
              <div style={{
                fontSize: 12,
                color: WENPING_COLORS.deepBrown,
                fontFamily: '"LXGW WenKai", "KaiTi", serif',
                lineHeight: 1.4,
              }}>
                {todayTSG.summary}
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={WENPING_COLORS.deepBrown} strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </WenPingCard>
        </div>

        {/* 进度统计 */}
        <div>
          <div style={{
            fontSize: 16,
            fontWeight: 700,
            color: WENPING_COLORS.ink,
            fontFamily: '"Noto Serif SC", "Songti SC", serif',
            marginBottom: 10,
          }}>
            本周进度
          </div>
          <WenPingCard style={{ padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              {[
                { label: '已打谱', value: 7, total: 7 },
                { label: '做死活', value: 5, total: 7 },
                { label: '收藏妙手', value: 3, total: 0 },
              ].map((stat, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: WENPING_COLORS.ink,
                    fontFamily: '"JetBrains Mono", monospace',
                  }}>
                    {stat.value}
                    {stat.total > 0 && (
                      <span style={{ fontSize: 12, color: WENPING_COLORS.deepBrown, fontWeight: 400 }}>
                        /{stat.total}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: WENPING_COLORS.deepBrown, marginTop: 2, fontFamily: '"LXGW WenKai", "KaiTi", serif' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
            {/* 进度条 */}
            <div style={{ marginTop: 12, display: 'flex', gap: 3 }}>
              {Array.from({ length: 7 }).map((_, i) => {
                const filled = i < 5;
                return (
                  <div key={i} style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 3,
                    background: filled ? WENPING_COLORS.moss : WENPING_COLORS.lineBrown,
                    transition: 'background 0.3s',
                  }} />
                );
              })}
            </div>
          </WenPingCard>
        </div>
      </div>
    </div>
  );
}

// ============ 谱库页面 ============
function LibraryPage({ onOpenGame }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const filteredGames = useMemo(() => {
    return ALL_GAMES.filter((g) => {
      if (activeCategory !== 'all' && g.category !== activeCategory) return false;
      if (searchText) {
        const s = searchText.toLowerCase();
        return (
          g.title.toLowerCase().includes(s) ||
          g.black.name.toLowerCase().includes(s) ||
          g.white.name.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [activeCategory, searchText]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: WENPING_COLORS.paper,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <NavBar title="谱库" subtitle={`共 ${ALL_GAMES.length} 局名谱`} />

      {/* 搜索栏 */}
      <div style={{
        padding: '8px 12px 12px',
        background: WENPING_COLORS.paper,
        borderBottom: `1px solid ${WENPING_COLORS.lineBrown}`,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          background: '#fff',
          borderRadius: 10,
          border: `1px solid ${searchFocused ? WENPING_COLORS.moss : WENPING_COLORS.lineBrown}`,
          transition: 'border-color 0.2s',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={WENPING_COLORS.deepBrown} strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="搜索棋谱、棋手…"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: 14,
              color: WENPING_COLORS.ink,
              background: 'transparent',
              fontFamily: '"LXGW WenKai", "KaiTi", serif',
            }}
          />
          {searchText && (
            <button
              onClick={() => setSearchText('')}
              style={{
                border: 'none',
                background: 'transparent',
                color: WENPING_COLORS.deepBrown,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 分类 Tab */}
      <div style={{
        display: 'flex',
        gap: 8,
        padding: '10px 12px',
        overflowX: 'auto',
        background: WENPING_COLORS.paper,
        borderBottom: `1px solid ${WENPING_COLORS.lineBrown}`,
        flexShrink: 0,
      }}>
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                flexShrink: 0,
                padding: '6px 14px',
                borderRadius: 999,
                border: `1px solid ${active ? WENPING_COLORS.ink : WENPING_COLORS.lineBrown}`,
                background: active ? WENPING_COLORS.ink : 'transparent',
                color: active ? WENPING_COLORS.stoneWhite : WENPING_COLORS.ink,
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: '"LXGW WenKai", "KaiTi", serif',
                transition: 'all 0.2s',
              }}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* 棋谱列表 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px 80px' }}>
        {filteredGames.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: WENPING_COLORS.deepBrown }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⊡</div>
            <div style={{ fontSize: 14 }}>未找到相关棋谱</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredGames.map((game, idx) => (
              <div
                key={game.id}
                onClick={() => onOpenGame(game)}
                style={{
                  padding: '14px',
                  background: '#fff',
                  borderRadius: 12,
                  border: `1px solid ${WENPING_COLORS.lineBrown}`,
                  cursor: 'pointer',
                  animation: `slideIn 0.3s ease-out ${idx * 0.05}s both`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: WENPING_COLORS.ink,
                    fontFamily: '"Noto Serif SC", "Songti SC", serif',
                    flex: 1,
                  }}>
                    {game.title}
                  </div>
                  <WenPingTag color="brown" size="sm">{game.year}</WenPingTag>
                </div>
                <div style={{
                  fontSize: 13,
                  color: WENPING_COLORS.deepBrown,
                  marginBottom: 8,
                  fontFamily: '"LXGW WenKai", "KaiTi", serif',
                }}>
                  <span style={{ color: WENPING_COLORS.ink }}>{game.black.name}</span>
                  <span style={{ margin: '0 4px' }}>执黑</span>
                  <span style={{ margin: '0 4px' }}>·</span>
                  <span style={{ color: WENPING_COLORS.ink }}>{game.white.name}</span>
                  <span style={{ margin: '0 4px' }}>执白</span>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                  {game.tags.map((t, i) => (
                    <WenPingTag key={i} color={i === 0 ? 'moss' : 'ink'} size="sm">{t}</WenPingTag>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 12, color: WENPING_COLORS.deepBrown }}>
                    共 {game.totalMoves} 手 · {game.result}
                  </div>
                  <button style={{
                    background: 'transparent',
                    border: 'none',
                    color: WENPING_COLORS.moss,
                    fontSize: 13,
                    cursor: 'pointer',
                    fontFamily: '"LXGW WenKai", "KaiTi", serif',
                  }}>
                    打谱 →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============ 妙手集页面 ============
function CollectionPage({ collections, onOpenCollection, onEditNote, onDelete, onGenerateNote }) {
  const [viewMode, setViewMode] = useState('list'); // list | grid

  if (collections.length === 0) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        background: WENPING_COLORS.paper,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <NavBar title="妙手集" subtitle={`${collections.length} 手收藏`} />
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 30px',
        }}>
          <div style={{
            width: 80, height: 80,
            borderRadius: '50%',
            background: 'rgba(107, 142, 90, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16,
            fontSize: 36,
          }}>
            ★
          </div>
          <div style={{
            fontSize: 16,
            color: WENPING_COLORS.ink,
            marginBottom: 6,
            fontFamily: '"Noto Serif SC", "Songti SC", serif',
            fontWeight: 600,
          }}>
            还没有收藏妙手
          </div>
          <div style={{
            fontSize: 13,
            color: WENPING_COLORS.deepBrown,
            textAlign: 'center',
            marginBottom: 20,
            fontFamily: '"LXGW WenKai", "KaiTi", serif',
            lineHeight: 1.5,
          }}>
            打谱时长按某手，即可收藏妙手<br />并写下你的心得笔记
          </div>
          <WenPingButton variant="primary">去打谱</WenPingButton>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: WENPING_COLORS.paper,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <NavBar
        title="妙手集"
        subtitle={`${collections.length} 手收藏`}
        rightAction={
          collections.length >= 2 && (
            <button onClick={onGenerateNote} style={{
              border: 'none',
              background: 'transparent',
              color: WENPING_COLORS.moss,
              fontSize: 13,
              cursor: 'pointer',
              padding: '6px 8px',
              fontFamily: '"LXGW WenKai", "KaiTi", serif',
            }}>
              生成笔记
            </button>
          )
        }
      />

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 14px',
        borderBottom: `1px solid ${WENPING_COLORS.lineBrown}`,
      }}>
        <div style={{ fontSize: 13, color: WENPING_COLORS.deepBrown }}>
          按时间倒序排列
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={() => setViewMode('list')}
            style={{
              width: 30, height: 30,
              borderRadius: 6,
              border: `1px solid ${viewMode === 'list' ? WENPING_COLORS.ink : WENPING_COLORS.lineBrown}`,
              background: viewMode === 'list' ? WENPING_COLORS.ink : 'transparent',
              color: viewMode === 'list' ? '#fff' : WENPING_COLORS.ink,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              width: 30, height: 30,
              borderRadius: 6,
              border: `1px solid ${viewMode === 'grid' ? WENPING_COLORS.ink : WENPING_COLORS.lineBrown}`,
              background: viewMode === 'grid' ? WENPING_COLORS.ink : 'transparent',
              color: viewMode === 'grid' ? '#fff' : WENPING_COLORS.ink,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px 80px' }}>
        {viewMode === 'list' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {collections.map((item, idx) => {
              const game = ALL_GAMES.find((g) => g.id === item.gameId);
              return (
                <div
                  key={item.id}
                  style={{
                    padding: '14px',
                    background: '#fff',
                    borderRadius: 12,
                    border: `1px solid ${WENPING_COLORS.lineBrown}`,
                    animation: `slideIn 0.3s ease-out ${idx * 0.05}s both`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div
                      onClick={() => onOpenCollection(item)}
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: WENPING_COLORS.ink,
                        fontFamily: '"Noto Serif SC", "Songti SC", serif',
                        cursor: 'pointer',
                      }}
                    >
                      {item.title || `第 ${item.moveNum} 手`}
                    </div>
                    <WenPingTag color="moss" size="sm">第 {item.moveNum} 手</WenPingTag>
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: WENPING_COLORS.deepBrown,
                    marginBottom: 8,
                    fontFamily: '"LXGW WenKai", "KaiTi", serif',
                  }}>
                    {game?.title || ''}
                  </div>
                  {item.note && (
                    <div style={{
                      fontSize: 13,
                      color: WENPING_COLORS.ink,
                      lineHeight: 1.5,
                      padding: '8px 10px',
                      background: 'rgba(232, 212, 168, 0.2)',
                      borderRadius: 8,
                      marginBottom: 10,
                      fontFamily: '"LXGW WenKai", "KaiTi", serif',
                    }}>
                      {item.note}
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 11, color: WENPING_COLORS.deepBrown }}>
                      {new Date(item.createdAt).toLocaleDateString('zh-CN')}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => onEditNote(item)}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          color: WENPING_COLORS.deepBrown,
                          fontSize: 12,
                          cursor: 'pointer',
                          fontFamily: '"LXGW WenKai", "KaiTi", serif',
                        }}
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          color: '#B85450',
                          fontSize: 12,
                          cursor: 'pointer',
                          fontFamily: '"LXGW WenKai", "KaiTi", serif',
                        }}
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
          }}>
            {collections.map((item, idx) => {
              const game = ALL_GAMES.find((g) => g.id === item.gameId);
              return (
                <div
                  key={item.id}
                  onClick={() => onOpenCollection(item)}
                  style={{
                    padding: '12px',
                    background: '#fff',
                    borderRadius: 12,
                    border: `1px solid ${WENPING_COLORS.lineBrown}`,
                    cursor: 'pointer',
                    animation: `slideIn 0.3s ease-out ${idx * 0.05}s both`,
                  }}
                >
                  <div style={{
                    width: '100%',
                    aspectRatio: '1',
                    borderRadius: 8,
                    background: WENPING_COLORS.board,
                    marginBottom: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}>
                    <svg width="60" height="60" viewBox="0 0 100 100" style={{ opacity: 0.5 }}>
                      {Array.from({ length: 7 }).map((_, i) => (
                        <React.Fragment key={i}>
                          <line x1={i * 16 + 10} y1="10" x2={i * 16 + 10} y2="90" stroke={WENPING_COLORS.ink} strokeWidth="0.5" />
                          <line x1="10" y1={i * 16 + 10} x2="90" y2={i * 16 + 10} stroke={WENPING_COLORS.ink} strokeWidth="0.5" />
                        </React.Fragment>
                      ))}
                      <circle cx="42" cy="42" r="7" fill="#1A1A1A" />
                    </svg>
                    <WenPingTag color="moss" size="sm" style={{
                      position: 'absolute', top: 6, right: 6,
                    }}>
                      第{item.moveNum}手
                    </WenPingTag>
                  </div>
                  <div style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: WENPING_COLORS.ink,
                    fontFamily: '"Noto Serif SC", "Songti SC", serif',
                    marginBottom: 2,
                  }}>
                    {item.title || `第 ${item.moveNum} 手`}
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: WENPING_COLORS.deepBrown,
                    fontFamily: '"LXGW WenKai", "KaiTi", serif',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {game?.title || ''}
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

// ============ 我的页面 ============
function ProfilePage({ onOpenDesignSpec, onOpenApiDoc, stats }) {
  const user = {
    nickname: '棋中散人',
    level: '弈城 5 段',
    avatar: null,
  };

  const menuItems = [
    { id: 'design-spec', label: '设计规范', icon: '◈', onClick: onOpenDesignSpec },
    { id: 'api-doc', label: '接口文档', icon: '◫', onClick: onOpenApiDoc },
    { id: 'settings', label: '设置', icon: '⚙' },
    { id: 'about', label: '关于纹枰', icon: '○' },
    { id: 'feedback', label: '意见反馈', icon: '◇' },
  ];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: WENPING_COLORS.paper,
      overflowY: 'auto',
    }}>
      <NavBar title="我的" />

      {/* 个人信息 */}
      <div style={{
        padding: '20px 16px',
        background: `linear-gradient(180deg, ${WENPING_COLORS.board} 0%, ${WENPING_COLORS.paper} 100%)`,
        borderBottom: `1px solid ${WENPING_COLORS.lineBrown}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <div style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: WENPING_COLORS.ink,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: WENPING_COLORS.stoneWhite,
            fontSize: 22,
            fontFamily: '"Noto Serif SC", "Songti SC", serif',
            fontWeight: 600,
          }}>
            棋
          </div>
          <div>
            <div style={{
              fontSize: 18,
              fontWeight: 700,
              color: WENPING_COLORS.ink,
              fontFamily: '"Noto Serif SC", "Songti SC", serif',
              marginBottom: 4,
            }}>
              {user.nickname}
            </div>
            <WenPingTag color="brown" size="sm">{user.level}</WenPingTag>
          </div>
        </div>

        {/* 数据统计 */}
        <div style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.5)',
          borderRadius: 12,
          padding: '12px 8px',
          border: `1px solid ${WENPING_COLORS.lineBrown}`,
        }}>
          {[
            { label: '打谱局数', value: stats?.studiedGames || 42 },
            { label: '妙手收藏', value: stats?.collections || 128 },
            { label: '连续打卡', value: stats?.streak || 15 },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                fontSize: 20,
                fontWeight: 700,
                color: WENPING_COLORS.ink,
                fontFamily: '"JetBrains Mono", monospace',
              }}>
                {s.value}
              </div>
              <div style={{
                fontSize: 11,
                color: WENPING_COLORS.deepBrown,
                marginTop: 2,
                fontFamily: '"LXGW WenKai", "KaiTi", serif',
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 菜单列表 */}
      <div style={{ padding: '12px' }}>
        <div style={{
          background: '#fff',
          borderRadius: 12,
          border: `1px solid ${WENPING_COLORS.lineBrown}`,
          overflow: 'hidden',
        }}>
          {menuItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={item.onClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '14px 14px',
                borderBottom: idx < menuItems.length - 1 ? `1px solid ${WENPING_COLORS.lineBrown}` : 'none',
                cursor: item.onClick ? 'pointer' : 'default',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { if (item.onClick) e.currentTarget.style.background = 'rgba(232, 212, 168, 0.15)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: 'rgba(107, 142, 90, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
                fontSize: 14,
                color: WENPING_COLORS.moss,
              }}>
                {item.icon}
              </div>
              <div style={{
                flex: 1,
                fontSize: 15,
                color: WENPING_COLORS.ink,
                fontFamily: '"LXGW WenKai", "KaiTi", serif',
              }}>
                {item.label}
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={WENPING_COLORS.deepBrown} strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          ))}
        </div>

        {/* 版本号 */}
        <div style={{
          textAlign: 'center',
          marginTop: 24,
          fontSize: 11,
          color: WENPING_COLORS.deepBrown,
          fontFamily: '"JetBrains Mono", monospace',
        }}>
          纹枰 v2.0.0
        </div>
      </div>
    </div>
  );
}

window.TodayPage = TodayPage;
window.LibraryPage = LibraryPage;
window.CollectionPage = CollectionPage;
window.ProfilePage = ProfilePage;
