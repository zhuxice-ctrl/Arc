// ========== 页面组件 ==========

const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ========== 首页：收藏 ==========
function HomePage({ onAlbumClick, onPlay, albums }) {
  const [activeGenre, setActiveGenre] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid | list
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  const filteredAlbums = useMemo(() => {
    if (activeGenre === 'all') return albums;
    const genreMap = {
      jazz: ['Modern Jazz'],
      rock: ['Progressive Rock'],
      folk: ['Folk / Indie'],
      electronic: ['Ambient / Electronic'],
      soul: ['Soul / R&B'],
    };
    const genres = genreMap[activeGenre] || [];
    return albums.filter((a) => genres.some((g) => a.genre.includes(g)));
  }, [activeGenre, albums]);

  const featured = albums.find((a) => a.id === 'paper');

  return (
    <div
      data-screen-label="01"
      style={{
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        background: '#1a1814',
        scrollbarWidth: 'none',
      }}
    >
      <style>{`
        .home-scroll::-webkit-scrollbar { display: none; }
      `}</style>
      <div className="home-scroll" style={{ paddingBottom: 160 }}>
        {/* 顶部 */}
        <div
          style={{
            padding: 'var(--ios-safe-top) 20px 0',
            paddingTop: 'calc(var(--ios-safe-top) + 8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(-10px)',
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                color: '#C86A3E',
                letterSpacing: 0.15,
                textTransform: 'uppercase',
                marginBottom: 4,
              }}
            >
              My Collection
            </div>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 28,
                fontWeight: 600,
                color: '#E8D9C4',
                fontStyle: 'italic',
                letterSpacing: -0.5,
              }}
            >
              黑胶珍藏
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: 'rgba(232,217,196,0.08)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              className="view-toggle-btn"
            >
              <svg viewBox="0 0 24 24" width={18} height={18} fill="rgba(232,217,196,0.7)">
                {viewMode === 'grid' ? (
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                ) : (
                  <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
                )}
              </svg>
            </button>
            <button
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: 'rgba(232,217,196,0.08)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              className="search-btn"
            >
              <svg viewBox="0 0 24 24" width={18} height={18} fill="rgba(232,217,196,0.7)">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </button>
          </div>
        </div>

        {/* 今日推荐 */}
        <div
          style={{
            padding: '0 20px',
            marginBottom: 28,
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.1s',
          }}
        >
          <div
            onClick={() => onAlbumClick(featured)}
            style={{
              position: 'relative',
              borderRadius: 20,
              overflow: 'hidden',
              cursor: 'pointer',
              aspectRatio: '16 / 10',
            }}
            className="featured-card"
          >
            <img
              src={featured.cover}
              alt=""
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.6)',
                transform: 'scale(1.05)',
              }}
              draggable={false}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(26,24,20,0.2) 0%, rgba(26,24,20,0.85) 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '20px 20px 20px',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: 16,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 10,
                    fontFamily: "'DM Mono', monospace",
                    color: 'rgba(255,255,255,0.6)',
                    letterSpacing: 0.1,
                    textTransform: 'uppercase',
                    marginBottom: 6,
                  }}
                >
                  Today's Pick
                </div>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 22,
                    fontWeight: 600,
                    color: '#fff',
                    marginBottom: 4,
                    fontStyle: 'italic',
                  }}
                >
                  {featured.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.6)',
                  }}
                >
                  {featured.artist}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay(featured);
                }}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: '#C86A3E',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(200,106,62,0.4)',
                  flexShrink: 0,
                }}
                className="featured-play-btn"
              >
                <svg viewBox="0 0 24 24" width={24} height={24} fill="#fff" style={{ marginLeft: 2 }}>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 分类 Chip */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            padding: '0 20px',
            marginBottom: 20,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateX(0)' : 'translateX(-20px)',
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
          }}
        >
          <style>{`.chip-scroll::-webkit-scrollbar { display: none; }`}</style>
          <div className="chip-scroll" style={{ display: 'flex', gap: 8 }}>
            {GENRES.map((g) => (
              <Chip
                key={g.id}
                label={g.name}
                count={g.count}
                active={activeGenre === g.id}
                onClick={() => setActiveGenre(g.id)}
              />
            ))}
          </div>
        </div>

        {/* Section 标题 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            padding: '0 20px',
            marginBottom: 14,
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.4s ease 0.3s',
          }}
        >
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 20,
              fontWeight: 600,
              color: '#E8D9C4',
              fontStyle: 'italic',
            }}
          >
            最近添加
          </div>
          <button
            style={{
              fontSize: 12,
              color: '#C86A3E',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            查看全部
          </button>
        </div>

        {/* 唱片网格 */}
        {viewMode === 'grid' ? (
          <div
            style={{
              padding: '0 20px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px 14px',
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.35s',
            }}
          >
            {filteredAlbums.map((album, i) => (
              <div
                key={album.id}
                style={{
                  animation: `fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${0.4 + i * 0.08}s both`,
                }}
              >
                <AlbumCard
                  album={album}
                  size="auto"
                  onClick={() => onAlbumClick(album)}
                  showVinyl
                />
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '0 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.4s ease 0.35s',
            }}
          >
            {filteredAlbums.map((album, i) => (
              <div
                key={album.id}
                onClick={() => onAlbumClick(album)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '10px 8px',
                  borderRadius: 12,
                  cursor: 'pointer',
                  animation: `fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${0.4 + i * 0.06}s both`,
                }}
                className="album-list-item"
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 8,
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={album.cover}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    draggable={false}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: '#E8D9C4',
                      marginBottom: 3,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {album.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: 'rgba(232,217,196,0.5)',
                      display: 'flex',
                      gap: 8,
                      alignItems: 'center',
                    }}
                  >
                    <span>{album.artist}</span>
                    <span style={{ opacity: 0.5 }}>·</span>
                    <span>{album.year}</span>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: album.owned ? 'rgba(122,178,122,0.8)' : 'rgba(232,217,196,0.4)',
                    fontFamily: "'DM Mono', monospace",
                    flexShrink: 0,
                  }}
                >
                  {album.owned ? '已收藏' : '心愿单'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 全局动画 keyframes */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ========== 发现页 ==========
function DiscoverPage({ onAlbumClick, onPlay, albums }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  return (
    <div
      data-screen-label="02"
      style={{
        height: '100%',
        overflowY: 'auto',
        background: '#1a1814',
        scrollbarWidth: 'none',
      }}
    >
      <div style={{ paddingBottom: 160 }}>
        {/* 顶部 */}
        <div
          style={{
            padding: 'var(--ios-safe-top) 20px 0',
            paddingTop: 'calc(var(--ios-safe-top) + 8px)',
            marginBottom: 24,
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(-10px)',
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              color: '#C86A3E',
              letterSpacing: 0.15,
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            Discover
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 28,
              fontWeight: 600,
              color: '#E8D9C4',
              fontStyle: 'italic',
              marginBottom: 16,
              letterSpacing: -0.5,
            }}
          >
            探索新声音
          </div>

          {/* 搜索框 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 16px',
              background: 'rgba(232,217,196,0.06)',
              borderRadius: 14,
              border: '1px solid rgba(232,217,196,0.08)',
            }}
          >
            <svg viewBox="0 0 24 24" width={18} height={18} fill="rgba(232,217,196,0.5)">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <span
              style={{
                fontSize: 14,
                color: 'rgba(232,217,196,0.4)',
              }}
            >
              搜索唱片、艺人、厂牌...
            </span>
          </div>
        </div>

        {/* 精选歌单 */}
        <div style={{ marginBottom: 28, opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease 0.15s' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              padding: '0 20px',
              marginBottom: 14,
            }}
          >
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 18,
                fontWeight: 600,
                color: '#E8D9C4',
                fontStyle: 'italic',
              }}
            >
              精选歌单
            </div>
            <button
              style={{
                fontSize: 12,
                color: '#C86A3E',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              更多
            </button>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 14,
              padding: '0 20px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
            }}
          >
            {PLAYLISTS.map((pl, i) => (
              <div
                key={pl.name}
                style={{
                  width: 140,
                  flexShrink: 0,
                  cursor: 'pointer',
                  animation: `fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${0.2 + i * 0.1}s both`,
                }}
                className="playlist-card"
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '100%',
                    borderRadius: 14,
                    overflow: 'hidden',
                    marginBottom: 10,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                  }}
                >
                  <img
                    src={pl.cover}
                    alt=""
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    draggable={false}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'rgba(200,106,62,0.9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    }}
                  >
                    <svg viewBox="0 0 24 24" width={16} height={16} fill="#fff" style={{ marginLeft: 1 }}>
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#E8D9C4',
                    marginBottom: 3,
                  }}
                >
                  {pl.name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'rgba(232,217,196,0.5)',
                  }}
                >
                  {pl.count} 张 · {pl.mood}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 新碟上架 */}
        <div style={{ marginBottom: 28, opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease 0.3s' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              padding: '0 20px',
              marginBottom: 14,
            }}
          >
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 18,
                fontWeight: 600,
                color: '#E8D9C4',
                fontStyle: 'italic',
              }}
            >
              新碟上架
            </div>
            <button
              style={{
                fontSize: 12,
                color: '#C86A3E',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              更多
            </button>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 14,
              padding: '0 20px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
            }}
          >
            {[...albums].reverse().slice(0, 5).map((album, i) => (
              <div
                key={album.id}
                style={{
                  flexShrink: 0,
                  animation: `fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${0.35 + i * 0.08}s both`,
                }}
              >
                <AlbumCard
                  album={album}
                  size={120}
                  onClick={() => onAlbumClick(album)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 热门艺人 */}
        <div style={{ marginBottom: 28, opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease 0.45s' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              padding: '0 20px',
              marginBottom: 14,
            }}
          >
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 18,
                fontWeight: 600,
                color: '#E8D9C4',
                fontStyle: 'italic',
              }}
            >
              热门艺人
            </div>
            <button
              style={{
                fontSize: 12,
                color: '#C86A3E',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              更多
            </button>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 18,
              padding: '0 20px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
            }}
          >
            {albums.slice(0, 5).map((album, i) => (
              <div
                key={album.id}
                style={{
                  width: 68,
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  animation: `fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${0.5 + i * 0.08}s both`,
                }}
                className="artist-card"
              >
                <div
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid rgba(200,106,62,0.3)',
                    padding: 2,
                  }}
                >
                  <img
                    src={album.cover}
                    alt=""
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '50%',
                      filter: 'saturate(0.8)',
                    }}
                    draggable={false}
                  />
                </div>
                <span
                  style={{
                    fontSize: 11,
                    color: 'rgba(232,217,196,0.7)',
                    textAlign: 'center',
                    maxWidth: '100%',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {album.artist.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 趋势榜单 */}
        <div style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease 0.6s' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              padding: '0 20px',
              marginBottom: 14,
            }}
          >
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 18,
                fontWeight: 600,
                color: '#E8D9C4',
                fontStyle: 'italic',
              }}
            >
              本周趋势
            </div>
            <button
              style={{
                fontSize: 12,
                color: '#C86A3E',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              更多
            </button>
          </div>
          <div style={{ padding: '0 12px' }}>
            {albums.slice(0, 4).map((album, i) => (
              <div
                key={album.id}
                onClick={() => onAlbumClick(album)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '12px 8px',
                  borderRadius: 12,
                  cursor: 'pointer',
                  borderBottom: i < 3 ? '1px solid rgba(232,217,196,0.05)' : 'none',
                  animation: `fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${0.6 + i * 0.08}s both`,
                }}
                className="trend-item"
              >
                <div
                  style={{
                    width: 24,
                    textAlign: 'center',
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 16,
                    fontWeight: 700,
                    color: i < 3 ? '#C86A3E' : 'rgba(232,217,196,0.4)',
                    fontStyle: 'italic',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={album.cover}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    draggable={false}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#E8D9C4',
                      marginBottom: 2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {album.tracks[0].title}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: 'rgba(232,217,196,0.5)',
                    }}
                  >
                    {album.artist}
                  </div>
                </div>
                <Waveform active={i === 0} color={album.color} bars={8} height={20} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== 唱片详情页 ==========
function AlbumDetailPage({ album, onClose, onPlay, isPlaying, onToggleFavorite, isFavorite, progress, onSeek, currentTrackIndex, onTrackClick }) {
  const [scrollY, setScrollY] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const scrollRef = useRef(null);
  const headerHeight = 340;

  useEffect(() => {
    setTimeout(() => setShowContent(true), 50);
  }, []);

  const handleScroll = () => {
    if (scrollRef.current) {
      setScrollY(scrollRef.current.scrollTop);
    }
  };

  const headerScale = Math.max(1, 1 + (-scrollY) / 200);
  const headerOpacity = Math.max(0, 1 - scrollY / 200);
  const navOpacity = Math.min(1, Math.max(0, (scrollY - 200) / 100));

  // 将曲目按 side 分组
  const sides = useMemo(() => {
    const map = {};
    album.tracks.forEach((t) => {
      if (!map[t.side]) map[t.side] = [];
      map[t.side].push(t);
    });
    return map;
  }, [album]);

  const sideNames = Object.keys(sides).sort();

  return (
    <div
      data-screen-label="03"
      style={{
        position: 'absolute',
        inset: 0,
        background: '#1a1814',
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 滚动内容 */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          position: 'relative',
          scrollbarWidth: 'none',
        }}
      >
        {/* 大封面头图 */}
        <div
          style={{
            position: 'relative',
            height: headerHeight,
            overflow: 'hidden',
            transform: `scale(${headerScale})`,
            transformOrigin: 'center top',
          }}
        >
          <img
            src={album.cover}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.5) saturate(0.9)',
            }}
            draggable={false}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(26,24,20,0.3) 0%, rgba(26,24,20,0.6) 60%, #1a1814 100%)',
              opacity: headerOpacity,
            }}
          />
        </div>

        {/* 专辑信息 */}
        <div
          style={{
            padding: '0 20px 24px',
            marginTop: -60,
            position: 'relative',
            opacity: showContent ? 1 : 0,
            transform: showContent ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s',
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: '#C86A3E',
              letterSpacing: 0.15,
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            {album.genre} · {album.year}
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 32,
              fontWeight: 700,
              color: '#E8D9C4',
              fontStyle: 'italic',
              lineHeight: 1.1,
              marginBottom: 6,
              letterSpacing: -0.5,
            }}
          >
            {album.title}
          </h1>
          <div
            style={{
              fontSize: 15,
              color: 'rgba(232,217,196,0.6)',
              marginBottom: 20,
            }}
          >
            {album.artist}
          </div>

          {/* 操作按钮 */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <button
              onClick={() => onPlay(album)}
              style={{
                flex: 1,
                height: 48,
                borderRadius: 24,
                background: '#C86A3E',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: 'pointer',
                color: '#fff',
                fontSize: 15,
                fontWeight: 600,
                boxShadow: '0 4px 16px rgba(200,106,62,0.3)',
              }}
              className="detail-play-btn"
            >
              <svg viewBox="0 0 24 24" width={20} height={20} fill="#fff" style={{ marginLeft: -2 }}>
                {isPlaying ? (
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                ) : (
                  <path d="M8 5v14l11-7z" />
                )}
              </svg>
              {isPlaying ? '暂停' : '播放'}
            </button>
            <button
              onClick={onToggleFavorite}
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(232,217,196,0.08)',
                border: '1px solid rgba(232,217,196,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              className="fav-btn"
            >
              <svg
                viewBox="0 0 24 24"
                width={22}
                height={22}
                fill={isFavorite ? '#C86A3E' : 'none'}
                stroke={isFavorite ? '#C86A3E' : 'rgba(232,217,196,0.5)'}
                strokeWidth={2}
                style={{ transition: 'all 0.3s ease' }}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
            <button
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(232,217,196,0.08)',
                border: '1px solid rgba(232,217,196,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              className="more-btn"
            >
              <svg viewBox="0 0 24 24" width={22} height={22} fill="rgba(232,217,196,0.7)">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
          </div>

          {/* 专辑描述 */}
          <div
            style={{
              fontSize: 13,
              lineHeight: 1.7,
              color: 'rgba(232,217,196,0.65)',
              marginBottom: 28,
            }}
          >
            {album.description}
          </div>

          {/* 元数据网格 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '14px 16px',
              padding: '16px',
              background: 'rgba(232,217,196,0.04)',
              borderRadius: 14,
              marginBottom: 28,
              border: '1px solid rgba(232,217,196,0.06)',
            }}
          >
            {[
              { label: '唱片公司', value: album.label },
              { label: '编号', value: album.catalog },
              { label: '格式', value: album.format },
              { label: '转速', value: album.speed },
              { label: '时长', value: album.duration },
              { label: '品相', value: album.condition },
            ].map((item) => (
              <div key={item.label}>
                <div
                  style={{
                    fontSize: 10,
                    fontFamily: "'DM Mono', monospace",
                    color: 'rgba(232,217,196,0.4)',
                    letterSpacing: 0.1,
                    textTransform: 'uppercase',
                    marginBottom: 4,
                  }}
                >
                  {item.label}
                </div>
                <div style={{ fontSize: 13, color: '#E8D9C4', fontWeight: 500 }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* 曲目列表 — 按 Side 分组 */}
          {sideNames.map((sideName, sideIdx) => (
            <div key={sideName} style={{ marginBottom: sideIdx < sideNames.length - 1 ? 24 : 0 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 11,
                    color: '#C86A3E',
                    letterSpacing: 0.15,
                    fontWeight: 500,
                  }}
                >
                  SIDE {sideName}
                </div>
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: 'rgba(232,217,196,0.1)',
                  }}
                />
              </div>
              <div>
                {sides[sideName].map((track, idx) => {
                  const isCurrent = track.num === currentTrackIndex + 1 && isPlaying;
                  const trackGlobalIdx = album.tracks.findIndex((t) => t.num === track.num && t.side === track.side);
                  return (
                    <div
                      key={track.num}
                      onClick={() => onTrackClick(trackGlobalIdx)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '12px 4px',
                        cursor: 'pointer',
                        borderBottom: '1px solid rgba(232,217,196,0.04)',
                        transition: 'background 0.2s ease',
                      }}
                      className="track-row"
                    >
                      <div
                        style={{
                          width: 24,
                          textAlign: 'center',
                          fontSize: 12,
                          fontFamily: "'DM Mono', monospace",
                          color: isCurrent ? '#C86A3E' : 'rgba(232,217,196,0.4)',
                          fontWeight: isCurrent ? 500 : 400,
                        }}
                      >
                        {isCurrent ? (
                          <Waveform active color="#C86A3E" bars={5} height={14} />
                        ) : (
                          String(track.num).padStart(2, '0')
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 14,
                            color: isCurrent ? '#C86A3E' : '#E8D9C4',
                            fontWeight: isCurrent ? 600 : 400,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            transition: 'color 0.3s ease',
                          }}
                        >
                          {track.title}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          fontFamily: "'DM Mono', monospace",
                          color: 'rgba(232,217,196,0.4)',
                        }}
                      >
                        {track.duration}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* 底部间距 */}
          <div style={{ height: 40 }} />
        </div>
      </div>

      {/* 顶部导航栏（滚动出现） */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          paddingTop: 'var(--ios-safe-top)',
          height: 'calc(var(--ios-safe-top) + 44px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 8,
          paddingRight: 8,
          background: navOpacity > 0.5 ? 'rgba(26, 24, 20, 0.9)' : 'transparent',
          backdropFilter: navOpacity > 0.5 ? 'blur(20px)' : 'none',
          transition: 'all 0.3s ease',
          zIndex: 10,
          opacity: navOpacity,
          pointerEvents: navOpacity > 0.1 ? 'auto' : 'none',
        }}
      >
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: '#E8D9C4',
            flex: 1,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            padding: '0 44px',
          }}
        >
          {album.title}
        </div>
      </div>

      {/* 返回按钮 */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 'calc(var(--ios-safe-top) + 8px)',
          left: 12,
          width: 38,
          height: 38,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(10px)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 20,
        }}
        className="back-btn"
      >
        <svg viewBox="0 0 24 24" width={20} height={20} fill="#E8D9C4">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>

      {/* 底部播放控制条（详情页专用） */}
      {isPlaying && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            padding: '12px 20px calc(var(--ios-safe-bottom) + 12px)',
            background: 'rgba(26, 24, 20, 0.95)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(232,217,196,0.06)',
            zIndex: 10,
          }}
        >
          <ProgressBar
            progress={progress}
            color={album.color}
            onSeek={onSeek}
            height={3}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: 'rgba(232,217,196,0.5)' }}>
              {formatTime(progress * parseDuration(album.tracks[currentTrackIndex]?.duration || '0:00'))}
            </span>
            <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: 'rgba(232,217,196,0.5)' }}>
              {album.tracks[currentTrackIndex]?.duration || '0:00'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
            <button
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 8,
              }}
            >
              <svg viewBox="0 0 24 24" width={24} height={24} fill="rgba(232,217,196,0.7)">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>
            <button
              onClick={onPlay}
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: '#C86A3E',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(200,106,62,0.4)',
              }}
              className="detail-center-play"
            >
              <svg viewBox="0 0 24 24" width={26} height={26} fill="#fff">
                {isPlaying ? (
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                ) : (
                  <path d="M8 5v14l11-7z" style={{ marginLeft: 2 }} />
                )}
              </svg>
            </button>
            <button
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 8,
              }}
            >
              <svg viewBox="0 0 24 24" width={24} height={24} fill="rgba(232,217,196,0.7)">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 辅助函数
function parseDuration(str) {
  const parts = str.split(':');
  return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ========== 全尺寸播放器 ==========
function FullPlayerPage({ album, onClose, isPlaying, onPlayPause, progress, onSeek, currentTrackIndex, onTrackNext, onTrackPrev }) {
  const [dragging, setDragging] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 20);
  }, []);

  if (!album) return null;

  const currentTrack = album.tracks[currentTrackIndex] || album.tracks[0];
  const totalSeconds = parseDuration(currentTrack.duration);
  const currentSeconds = progress * totalSeconds;

  return (
    <div
      data-screen-label="04"
      style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(180deg, ${album.color}22 0%, #1a1814 45%)`,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(100%)',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* 顶部 */}
      <div
        style={{
          padding: 'var(--ios-safe-top) 20px 0',
          paddingTop: 'calc(var(--ios-safe-top) + 8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <button
          onClick={onClose}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'rgba(232,217,196,0.08)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          className="player-close-btn"
        >
          <svg viewBox="0 0 24 24" width={20} height={20} fill="#E8D9C4">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: 10,
              fontFamily: "'DM Mono', monospace",
              color: 'rgba(232,217,196,0.5)',
              letterSpacing: 0.15,
              textTransform: 'uppercase',
            }}
          >
            Now Playing
          </div>
          <div
            style={{
              fontSize: 12,
              color: '#E8D9C4',
              marginTop: 2,
              fontWeight: 500,
            }}
          >
            {album.title}
          </div>
        </div>
        <button
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'rgba(232,217,196,0.08)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <svg viewBox="0 0 24 24" width={20} height={20} fill="#E8D9C4">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
      </div>

      {/* 唱片 + 封面 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px 40px',
        }}
      >
        <div style={{ position: 'relative', perspective: '1000px' }}>
          {/* 黑胶唱片（旋转） */}
          <div
            style={{
              width: 260,
              height: 260,
              position: 'relative',
              animation: isPlaying ? 'spin 12s linear infinite' : 'none',
              animationPlayState: isPlaying ? 'running' : 'paused',
            }}
          >
            {/* 黑胶本体 */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: `
                  radial-gradient(circle at center, transparent 22%, #0a0a0a 22.5%, #151515 26%, #0a0a0a 28%, #151515 30%, #0a0a0a 32%, #151515 34%, #0a0a0a 36%, #151515 38%, #0a0a0a 40%, #151515 42%, #0a0a0a 44%, #151515 46%, #0a0a0a 48%, #151515 50%)
                `,
                boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
              }}
            />
            {/* 中心标签 */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '45%',
                height: '45%',
                borderRadius: '50%',
                overflow: 'hidden',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)',
              }}
            >
              <img
                src={album.cover}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                draggable={false}
              />
            </div>
            {/* 中心孔 */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#1a1814',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8)',
                zIndex: 2,
              }}
            />
          </div>

          {/* 唱针 */}
          <div
            style={{
              position: 'absolute',
              top: -20,
              right: -10,
              width: 80,
              height: 120,
              transformOrigin: 'top right',
              transform: `rotate(${isPlaying ? '25deg' : '-10deg'})`,
              transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: 10,
            }}
          >
            {/* 唱针臂 */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 8,
                width: 4,
                height: 90,
                background: 'linear-gradient(180deg, #888, #444)',
                borderRadius: 2,
                transformOrigin: 'top center',
              }}
            />
            {/* 唱头 */}
            <div
              style={{
                position: 'absolute',
                bottom: 20,
                right: 0,
                width: 18,
                height: 10,
                background: '#333',
                borderRadius: 2,
              }}
            />
            {/* 转轴 */}
            <div
              style={{
                position: 'absolute',
                top: -4,
                right: 2,
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #aaa, #555)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            />
          </div>
        </div>
      </div>

      {/* 歌曲信息 */}
      <div style={{ padding: '0 24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: '#E8D9C4',
                marginBottom: 4,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {currentTrack.title}
            </div>
            <div style={{ fontSize: 14, color: 'rgba(232,217,196,0.5)' }}>
              {album.artist}
            </div>
          </div>
          <button
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'none',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="#C86A3E" strokeWidth={2}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 进度条 */}
      <div style={{ padding: '0 24px', marginBottom: 20 }}>
        <ProgressBar progress={progress} onSeek={onSeek} color={album.color} height={4} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 6,
            fontSize: 11,
            fontFamily: "'DM Mono', monospace",
            color: 'rgba(232,217,196,0.5)',
          }}
        >
          <span>{formatTime(currentSeconds)}</span>
          <span>{currentTrack.duration}</span>
        </div>
      </div>

      {/* 播放控制 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
          paddingBottom: 'calc(var(--ios-safe-bottom) + 24px)',
        }}
      >
        <button
          onClick={onTrackPrev}
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          className="prev-btn"
        >
          <svg viewBox="0 0 24 24" width={28} height={28} fill="#E8D9C4">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </button>
        <button
          onClick={onPlayPause}
          style={{
            width: 68,
            height: 68,
            borderRadius: '50%',
            background: '#C86A3E',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(200,106,62,0.4)',
            transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          className="main-play-btn"
        >
          <svg viewBox="0 0 24 24" width={32} height={32} fill="#fff">
            {isPlaying ? (
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            ) : (
              <path d="M8 5v14l11-7z" style={{ marginLeft: 2 }} />
            )}
          </svg>
        </button>
        <button
          onClick={onTrackNext}
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          className="next-btn"
        >
          <svg viewBox="0 0 24 24" width={28} height={28} fill="#E8D9C4">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
          </svg>
        </button>
      </div>

      {/* 底部辅助操作 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 40px 16px',
        }}
      >
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
          }}
        >
          <svg viewBox="0 0 24 24" width={20} height={20} fill="rgba(232,217,196,0.5)">
            <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
          </svg>
        </button>
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
          }}
        >
          <svg viewBox="0 0 24 24" width={20} height={20} fill="rgba(232,217,196,0.5)">
            <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
          </svg>
        </button>
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
          }}
        >
          <svg viewBox="0 0 24 24" width={20} height={20} fill="rgba(232,217,196,0.5)">
            <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM9 8h2v8H9zm4 2h2v6h-2zm-8-4h2v10H5z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ========== 动态页 ==========
function ActivityPage({ albums }) {
  const activities = [
    { type: 'play', album: albums[5], track: 'Daydream', time: '2 分钟前', user: '你' },
    { type: 'add', album: albums[2], time: '1 小时前', user: '你' },
    { type: 'friend_play', album: albums[0], track: 'Crimson Hours', time: '2 小时前', user: 'Sara Chen' },
    { type: 'new_release', album: albums[4], time: '今天', user: '系统' },
    { type: 'friend_fav', album: albums[3], time: '昨天', user: 'Marcus Lee' },
    { type: 'play', album: albums[1], track: 'Night Swim', time: '昨天', user: '你' },
    { type: 'friend_add', album: albums[5], time: '2 天前', user: 'Sophie Wang' },
  ];

  const getActivityText = (a) => {
    switch (a.type) {
      case 'play': return `正在播放《${a.track}》`;
      case 'add': return '新添加了这张唱片';
      case 'friend_play': return `${a.user} 在听《${a.track}》`;
      case 'new_release': return '新碟上架，快来听听';
      case 'friend_fav': return `${a.user} 收藏了这张`;
      case 'friend_add': return `${a.user} 添加了这张唱片`;
      default: return '';
    }
  };

  return (
    <div
      data-screen-label="05"
      style={{
        height: '100%',
        overflowY: 'auto',
        background: '#1a1814',
        scrollbarWidth: 'none',
      }}
    >
      <div style={{ paddingBottom: 160 }}>
        {/* 顶部 */}
        <div
          style={{
            padding: 'var(--ios-safe-top) 20px 0',
            paddingTop: 'calc(var(--ios-safe-top) + 8px)',
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              color: '#C86A3E',
              letterSpacing: 0.15,
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            Activity
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 28,
              fontWeight: 600,
              color: '#E8D9C4',
              fontStyle: 'italic',
              letterSpacing: -0.5,
            }}
          >
            动态
          </div>
        </div>

        {/* 时间线 */}
        <div style={{ position: 'relative', paddingLeft: 36 }}>
          {/* 时间线 */}
          <div
            style={{
              position: 'absolute',
              left: 24,
              top: 8,
              bottom: 0,
              width: 1,
              background: 'rgba(232,217,196,0.1)',
            }}
          />
          {activities.map((a, i) => (
            <div
              key={i}
              style={{
                position: 'relative',
                paddingBottom: 20,
                animation: `fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.06}s both`,
              }}
            >
              {/* 节点 */}
              <div
                style={{
                  position: 'absolute',
                  left: -24,
                  top: 16,
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: a.type === 'play' ? '#C86A3E' : 'rgba(232,217,196,0.3)',
                  border: '2px solid #1a1814',
                  zIndex: 2,
                }}
              />
              <div style={{ display: 'flex', gap: 14, paddingRight: 20 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 10,
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={a.album.cover}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    draggable={false}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: '#E8D9C4', marginBottom: 4, lineHeight: 1.4 }}>
                    {getActivityText(a)}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(232,217,196,0.4)' }}>
                    {a.album.title} · {a.time}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ========== 个人中心 ==========
function ProfilePage({ albums, onShowDesignSpecs, onShowApiDocs }) {
  const owned = albums.filter((a) => a.owned);

  return (
    <div
      data-screen-label="06"
      style={{
        height: '100%',
        overflowY: 'auto',
        background: '#1a1814',
        scrollbarWidth: 'none',
      }}
    >
      <div style={{ paddingBottom: 160 }}>
        {/* 顶部头像区 */}
        <div
          style={{
            padding: 'var(--ios-safe-top) 20px 24px',
            paddingTop: 'calc(var(--ios-safe-top) + 8px)',
            background: 'linear-gradient(180deg, rgba(200,106,62,0.15) 0%, transparent 100%)',
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              color: '#C86A3E',
              letterSpacing: 0.15,
              textTransform: 'uppercase',
              marginBottom: 12,
            }}
          >
            Profile
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #C86A3E, #8B4513)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Playfair Display', serif",
                fontSize: 28,
                fontWeight: 700,
                color: '#fff',
                fontStyle: 'italic',
              }}
            >
              VL
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: '#E8D9C4',
                  marginBottom: 2,
                }}
              >
                {USER.name}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: 'rgba(232,217,196,0.5)',
                  marginBottom: 4,
                }}
              >
                {USER.handle}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(232,217,196,0.4)' }}>
                {USER.bio}
              </div>
            </div>
          </div>

          {/* 数据统计 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 8,
              marginTop: 24,
            }}
          >
            {[
              { label: '收藏', value: USER.stats.collection },
              { label: '艺人', value: USER.stats.artists },
              { label: '厂牌', value: USER.stats.labels },
              { label: '曲风', value: USER.stats.genres },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 22,
                    fontWeight: 700,
                    color: '#E8D9C4',
                    fontStyle: 'italic',
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: 'rgba(232,217,196,0.5)',
                    marginTop: 2,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 我的收藏 */}
        <div style={{ padding: '0 20px', marginBottom: 24 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: 14,
            }}
          >
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 18,
                fontWeight: 600,
                color: '#E8D9C4',
                fontStyle: 'italic',
              }}
            >
              我的收藏
            </div>
            <button
              style={{
                fontSize: 12,
                color: '#C86A3E',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              全部
            </button>
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {owned.map((album, i) => (
              <div
                key={album.id}
                style={{
                  width: 72,
                  flexShrink: 0,
                  borderRadius: 8,
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                <img
                  src={album.cover}
                  alt=""
                  style={{ width: '100%', height: 72, objectFit: 'cover', display: 'block' }}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 功能列表 */}
        <div style={{ padding: '0 12px' }}>
          <ListRow
            icon="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            title="收藏夹"
            subtitle={`${USER.stats.collection} 张黑胶唱片`}
          />
          <ListRow
            icon="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
            title="播放历史"
            subtitle="本周 42 次播放"
          />
          <ListRow
            icon="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
            title="好友动态"
            subtitle="12 位好友"
          />
          <div style={{ height: 16 }} />

          {/* 设计相关入口 */}
          <div
            style={{
              fontSize: 11,
              fontFamily: "'DM Mono', monospace",
              color: 'rgba(232,217,196,0.4)',
              letterSpacing: 0.1,
              textTransform: 'uppercase',
              padding: '12px 16px 8px',
            }}
          >
            设计文档
          </div>
          <ListRow
            icon="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
            title="设计规范"
            subtitle="Design System & Tokens"
            onClick={onShowDesignSpecs}
          />
          <ListRow
            icon="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15.01l1.41 1.41L11 14.84V19h2v-4.16l1.59 1.59L16 15.01 12 11.01 8 15.01z"
            title="接口文档"
            subtitle="API Reference"
            onClick={onShowApiDocs}
          />

          <div style={{ height: 16 }} />
          <ListRow
            icon="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
            title="设置"
            subtitle="外观 · 通知 · 关于"
          />
        </div>
      </div>
    </div>
  );
}

// ========== 设计规范文档页 ==========
function DesignSpecsPage({ onClose, primaryColor }) {
  return (
    <div
      data-screen-label="07"
      style={{
        position: 'absolute',
        inset: 0,
        background: '#1a1814',
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div
        style={{
          padding: 'var(--ios-safe-top) 20px 0',
          paddingTop: 'calc(var(--ios-safe-top) + 8px)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          borderBottom: '1px solid rgba(232,217,196,0.06)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: 'rgba(232,217,196,0.08)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <svg viewBox="0 0 24 24" width={18} height={18} fill="#E8D9C4">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 600, color: '#E8D9C4' }}>
            设计规范
          </div>
          <div style={{ fontSize: 11, color: 'rgba(232,217,196,0.5)', marginTop: 1 }}>
            Design System v2.0
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 40px' }}>
        {/* 色彩 */}
        <SpecSection title="Color Palette" subtitle="色彩系统">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { name: 'Primary', hex: '#C86A3E', desc: '主品牌色' },
              { name: 'Surface', hex: '#1a1814', desc: '背景色' },
              { name: 'Surface 2', hex: '#2A261B', desc: '卡片背景' },
              { name: 'Text Primary', hex: '#E8D9C4', desc: '主文字' },
              { name: 'Text Secondary', hex: 'rgba(232,217,196,0.6)', desc: '次要文字' },
              { name: 'Accent', hex: '#8B4513', desc: '辅助色' },
            ].map((c) => (
              <div key={c.name} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: c.hex,
                    border: c.hex === '#1a1814' || c.hex === '#2A261B'
                      ? '1px solid rgba(232,217,196,0.1)'
                      : 'none',
                    flexShrink: 0,
                  }}
                />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#E8D9C4' }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(232,217,196,0.5)', fontFamily: "'DM Mono', monospace" }}>
                    {c.hex}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SpecSection>

        {/* 字体 */}
        <SpecSection title="Typography" subtitle="字体系统">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: 'rgba(232,217,196,0.4)', letterSpacing: 0.1, textTransform: 'uppercase', marginBottom: 6 }}>Display</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, color: '#E8D9C4', fontStyle: 'italic' }}>
                Playfair Display
              </div>
              <div style={{ fontSize: 11, color: 'rgba(232,217,196,0.5)', marginTop: 2 }}>
                用于标题、Hero 文字、大数字
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: 'rgba(232,217,196,0.4)', letterSpacing: 0.1, textTransform: 'uppercase', marginBottom: 6 }}>Body</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 400, color: '#E8D9C4' }}>
                Inter Regular
              </div>
              <div style={{ fontSize: 11, color: 'rgba(232,217,196,0.5)', marginTop: 2 }}>
                用于正文、按钮、列表
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: 'rgba(232,217,196,0.4)', letterSpacing: 0.1, textTransform: 'uppercase', marginBottom: 6 }}>Mono</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: '#E8D9C4' }}>
                DM Mono 0123
              </div>
              <div style={{ fontSize: 11, color: 'rgba(232,217,196,0.5)', marginTop: 2 }}>
                用于标签、时间、编号
              </div>
            </div>
          </div>
        </SpecSection>

        {/* 间距 */}
        <SpecSection title="Spacing" subtitle="间距系统">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[4, 8, 12, 16, 20, 24, 32].map((s) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 50, fontSize: 11, fontFamily: "'DM Mono', monospace", color: 'rgba(232,217,196,0.5)' }}>
                  {s}px
                </div>
                <div
                  style={{
                    height: 12,
                    width: s * 2,
                    background: 'rgba(200,106,62,0.3)',
                    borderRadius: 2,
                  }}
                />
              </div>
            ))}
          </div>
        </SpecSection>

        {/* 圆角 */}
        <SpecSection title="Radius" subtitle="圆角系统">
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { name: 'sm', value: 8 },
              { name: 'md', value: 12 },
              { name: 'lg', value: 16 },
              { name: 'xl', value: 20 },
              { name: 'full', value: 999 },
            ].map((r) => (
              <div key={r.name} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: r.value,
                    background: 'rgba(200,106,62,0.2)',
                    border: '1px solid rgba(200,106,62,0.3)',
                    marginBottom: 6,
                  }}
                />
                <div style={{ fontSize: 10, color: 'rgba(232,217,196,0.5)' }}>{r.name}</div>
              </div>
            ))}
          </div>
        </SpecSection>

        {/* 动效 */}
        <SpecSection title="Motion" subtitle="动效规范">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, color: 'rgba(232,217,196,0.7)', lineHeight: 1.6 }}>
            <div>
              <strong style={{ color: '#E8D9C4' }}>Easing</strong>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, marginTop: 4 }}>
                cubic-bezier(0.4, 0, 0.2, 1)
              </div>
            </div>
            <div>
              <strong style={{ color: '#E8D9C4' }}>时长</strong>
              <ul style={{ margin: 0, padding: '4px 0 0 16px', fontSize: 12 }}>
                <li>微交互：150 – 200ms</li>
                <li>页面过渡：300 – 400ms</li>
                <li>唱片旋转：8s / 12s 循环</li>
                <li>骨架/加载：600ms + 交错</li>
              </ul>
            </div>
            <div>
              <strong style={{ color: '#E8D9C4' }}>原则</strong>
              <ul style={{ margin: 0, padding: '4px 0 0 16px', fontSize: 12 }}>
                <li>动画应服务内容，不为炫技</li>
                <li>尊重 prefers-reduced-motion</li>
                <li>所有过渡使用统一 easing</li>
                <li>列表项使用交错进入动画</li>
              </ul>
            </div>
          </div>
        </SpecSection>

        {/* 组件清单 */}
        <SpecSection title="Components" subtitle="组件清单">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
            {[
              'AlbumCard — 唱片卡片（含 3D 倾斜 + 黑胶露出）',
              'VinylDisc — 旋转黑胶唱片组件',
              'MiniPlayer — 底部迷你播放器',
              'Waveform — 音频波形可视化',
              'ProgressBar — 可拖动进度条',
              'TabBar — 底部导航栏',
              'Chip — 分类标签按钮',
              'ListRow — 列表行组件',
              'Toast — 轻量提示',
            ].map((c) => (
              <div key={c} style={{ color: 'rgba(232,217,196,0.7)', fontSize: 12, paddingLeft: 12, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 7, width: 4, height: 4, borderRadius: '50%', background: '#C86A3E' }} />
                {c}
              </div>
            ))}
          </div>
        </SpecSection>
      </div>
    </div>
  );
}

function SpecSection({ title, subtitle, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: '#C86A3E', letterSpacing: 0.12, textTransform: 'uppercase' }}>
          {title}
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#E8D9C4', marginTop: 4 }}>
          {subtitle}
        </div>
      </div>
      <div
        style={{
          padding: 16,
          background: 'rgba(232,217,196,0.04)',
          borderRadius: 14,
          border: '1px solid rgba(232,217,196,0.06)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ========== 接口文档页 ==========
function ApiDocsPage({ onClose }) {
  const endpoints = [
    {
      method: 'GET',
      path: '/api/albums',
      desc: '获取唱片列表',
      params: [
        { name: 'genre', type: 'string', desc: '按流派筛选' },
        { name: 'page', type: 'number', desc: '页码，默认 1' },
        { name: 'limit', type: 'number', desc: '每页数量，默认 20' },
        { name: 'sort', type: 'string', desc: '排序：recent / plays / title' },
      ],
      response: '{ albums: Album[], total: number }',
    },
    {
      method: 'GET',
      path: '/api/albums/:id',
      desc: '获取唱片详情',
      params: [{ name: 'id', type: 'string', desc: '唱片 ID' }],
      response: 'Album { id, title, artist, tracks[], ... }',
    },
    {
      method: 'POST',
      path: '/api/albums/:id/favorite',
      desc: '收藏/取消收藏唱片',
      params: [
        { name: 'id', type: 'string', desc: '唱片 ID' },
        { name: 'favorite', type: 'boolean', desc: '是否收藏' },
      ],
      response: '{ success: boolean, favorite: boolean }',
    },
    {
      method: 'GET',
      path: '/api/playlists',
      desc: '获取歌单列表',
      params: [{ name: 'type', type: 'string', desc: 'featured / trending' }],
      response: '{ playlists: Playlist[] }',
    },
    {
      method: 'GET',
      path: '/api/search',
      desc: '搜索唱片、艺人、厂牌',
      params: [
        { name: 'q', type: 'string', desc: '搜索关键词' },
        { name: 'type', type: 'string', desc: 'album / artist / label' },
      ],
      response: '{ results: SearchResult[] }',
    },
    {
      method: 'GET',
      path: '/api/user/profile',
      desc: '获取用户个人信息',
      params: [],
      response: 'User { name, stats, bio, ... }',
    },
    {
      method: 'GET',
      path: '/api/user/activity',
      desc: '获取用户动态',
      params: [
        { name: 'limit', type: 'number', desc: '数量，默认 20' },
        { name: 'cursor', type: 'string', desc: '分页游标' },
      ],
      response: '{ activities: Activity[], nextCursor }',
    },
    {
      method: 'POST',
      path: '/api/play/start',
      desc: '开始播放记录',
      params: [
        { name: 'albumId', type: 'string', desc: '唱片 ID' },
        { name: 'trackIndex', type: 'number', desc: '曲目索引' },
      ],
      response: '{ playId: string, startTime: number }',
    },
  ];

  return (
    <div
      data-screen-label="08"
      style={{
        position: 'absolute',
        inset: 0,
        background: '#1a1814',
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div
        style={{
          padding: 'var(--ios-safe-top) 20px 0',
          paddingTop: 'calc(var(--ios-safe-top) + 8px)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          borderBottom: '1px solid rgba(232,217,196,0.06)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: 'rgba(232,217,196,0.08)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <svg viewBox="0 0 24 24" width={18} height={18} fill="#E8D9C4">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 600, color: '#E8D9C4' }}>
            接口文档
          </div>
          <div style={{ fontSize: 11, color: 'rgba(232,217,196,0.5)', marginTop: 1 }}>
            API Reference v2.0
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 40px' }}>
        {/* 概览 */}
        <div style={{ padding: 16, background: 'rgba(232,217,196,0.04)', borderRadius: 14, marginBottom: 20, border: '1px solid rgba(232,217,196,0.06)' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#E8D9C4', marginBottom: 8 }}>Base URL</div>
          <code style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: '#C86A3E' }}>
            https://api.vinylarc.app/v2
          </code>
          <div style={{ fontSize: 12, color: 'rgba(232,217,196,0.6)', marginTop: 12, lineHeight: 1.6 }}>
            所有请求需要在 Header 中携带 <code style={{ color: '#C86A3E' }}>Authorization: Bearer {`{token}`}</code>。
            返回格式统一为 JSON，错误响应包含 <code style={{ color: '#C86A3E' }}>code</code> 和 <code style={{ color: '#C86A3E' }}>message</code> 字段。
          </div>
        </div>

        {/* 接口列表 */}
        <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(232,217,196,0.5)', marginBottom: 12, paddingLeft: 4 }}>
          接口列表 · {endpoints.length} 个
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {endpoints.map((ep, i) => (
            <ApiCard key={i} endpoint={ep} />
          ))}
        </div>

        {/* 数据模型 */}
        <div style={{ marginTop: 28, marginBottom: 12, fontSize: 12, fontWeight: 600, color: 'rgba(232,217,196,0.5)', paddingLeft: 4 }}>
          数据模型
        </div>
        <div style={{ padding: 16, background: 'rgba(232,217,196,0.04)', borderRadius: 14, fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'rgba(232,217,196,0.7)', lineHeight: 1.7, border: '1px solid rgba(232,217,196,0.06)' }}>
          <div><span style={{ color: '#C86A3E' }}>interface</span> Album {'{'}</div>
          <div style={{ paddingLeft: 16 }}>id: string</div>
          <div style={{ paddingLeft: 16 }}>title: string</div>
          <div style={{ paddingLeft: 16 }}>artist: string</div>
          <div style={{ paddingLeft: 16 }}>cover: string</div>
          <div style={{ paddingLeft: 16 }}>genre: string</div>
          <div style={{ paddingLeft: 16 }}>year: number</div>
          <div style={{ paddingLeft: 16 }}>label: string</div>
          <div style={{ paddingLeft: 16 }}>catalog: string</div>
          <div style={{ paddingLeft: 16 }}>tracks: Track[]</div>
          <div style={{ paddingLeft: 16 }}>condition: string</div>
          <div style={{ paddingLeft: 16 }}>owned: boolean</div>
          <div style={{ paddingLeft: 16 }}>favorite: boolean</div>
          <div>{'}'}</div>
        </div>
      </div>
    </div>
  );
}

function ApiCard({ endpoint }) {
  const [expanded, setExpanded] = useState(false);
  const methodColors = {
    GET: '#5fa87c',
    POST: '#C86A3E',
    PUT: '#5c7aa8',
    DELETE: '#c84e4e',
  };

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{
        background: 'rgba(232,217,196,0.04)',
        borderRadius: 12,
        border: '1px solid rgba(232,217,196,0.06)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      className="api-card"
    >
      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: methodColors[endpoint.method],
            fontFamily: "'DM Mono', monospace",
            padding: '3px 8px',
            borderRadius: 4,
            background: `${methodColors[endpoint.method]}15`,
            flexShrink: 0,
          }}
        >
          {endpoint.method}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#E8D9C4', fontFamily: "'DM Mono', monospace" }}>
            {endpoint.path}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(232,217,196,0.5)', marginTop: 2 }}>
            {endpoint.desc}
          </div>
        </div>
        <svg
          viewBox="0 0 24 24"
          width={16}
          height={16}
          fill="rgba(232,217,196,0.4)"
          style={{
            transition: 'transform 0.3s ease',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            flexShrink: 0,
          }}
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </div>

      {expanded && (
        <div
          style={{
            padding: '0 16px 16px',
            borderTop: '1px solid rgba(232,217,196,0.06)',
            animation: 'expandDown 0.3s ease',
          }}
        >
          <div style={{ fontSize: 11, color: 'rgba(232,217,196,0.5)', marginTop: 12, marginBottom: 8 }}>
            参数
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {endpoint.params.length === 0 ? (
              <div style={{ fontSize: 12, color: 'rgba(232,217,196,0.4)', fontStyle: 'italic' }}>
                无参数
              </div>
            ) : (
              endpoint.params.map((p) => (
                <div key={p.name} style={{ display: 'flex', gap: 12, fontSize: 12 }}>
                  <span style={{ color: '#C86A3E', fontFamily: "'DM Mono', monospace", minWidth: 80 }}>
                    {p.name}
                  </span>
                  <span style={{ color: 'rgba(232,217,196,0.5)', minWidth: 60 }}>
                    {p.type}
                  </span>
                  <span style={{ color: 'rgba(232,217,196,0.6)', flex: 1 }}>
                    {p.desc}
                  </span>
                </div>
              ))
            )}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(232,217,196,0.5)', marginTop: 14, marginBottom: 6 }}>
            返回
          </div>
          <div style={{ fontSize: 11, color: 'rgba(232,217,196,0.7)', fontFamily: "'DM Mono', monospace", background: 'rgba(0,0,0,0.2)', padding: 10, borderRadius: 8 }}>
            {endpoint.response}
          </div>
        </div>
      )}
    </div>
  );
}

// 导出
Object.assign(window, {
  HomePage,
  DiscoverPage,
  AlbumDetailPage,
  FullPlayerPage,
  ActivityPage,
  ProfilePage,
  DesignSpecsPage,
  ApiDocsPage,
  SpecSection,
  parseDuration,
  formatTime,
});
