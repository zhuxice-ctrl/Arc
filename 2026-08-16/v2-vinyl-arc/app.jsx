// ========== 主应用 ==========

const { useState, useEffect, useRef, useCallback } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentColor": "#C86A3E",
  "bgColor": "#1a1814",
  "textColor": "#E8D9C4",
  "themeStyle": "warm",
  "showCursor": true,
  "vinylAnimation": true,
  "interfaceDensity": "regular"
}/*EDITMODE-END*/;

function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [fullPlayerVisible, setFullPlayerVisible] = useState(false);
  const [showDesignSpecs, setShowDesignSpecs] = useState(false);
  const [showApiDocs, setShowApiDocs] = useState(false);

  // 播放状态
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [favorites, setFavorites] = useState({});
  const [toast, setToast] = useState({ message: '', visible: false });

  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // 进度条动画
  useEffect(() => {
    if (!isPlaying || !currentAlbum) return;
    const currentTrack = currentAlbum.tracks[currentTrackIndex];
    if (!currentTrack) return;

    const totalSec = parseDuration(currentTrack.duration);
    const interval = setInterval(() => {
      setProgress((p) => {
        const newP = p + 0.5 / totalSec;
        if (newP >= 1) {
          // 下一首
          if (currentTrackIndex < currentAlbum.tracks.length - 1) {
            setCurrentTrackIndex((i) => i + 1);
            return 0;
          } else {
            setIsPlaying(false);
            return 1;
          }
        }
        return newP;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying, currentAlbum, currentTrackIndex]);

  // 初始化 favorites
  useEffect(() => {
    const favs = {};
    ALBUMS.forEach((a) => {
      if (a.favorite) favs[a.id] = true;
    });
    setFavorites(favs);
  }, []);

  // 自定义光标
  useEffect(() => {
    if (!t.showCursor) return;
    const outer = document.getElementById('cursorOuter');
    const inner = document.getElementById('cursorInner');
    if (!outer || !inner) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outerX = mouseX;
    let outerY = mouseY;

    const handleMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      inner.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    };

    const animate = () => {
      outerX += (mouseX - outerX) * 0.18;
      outerY += (mouseY - outerY) * 0.18;
      outer.style.transform = `translate(${outerX}px, ${outerY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animate);
    };

    const handleOver = (e) => {
      const target = e.target.closest('button, .album-card, .chip, .list-row, .playlist-card, .artist-card, .trend-item, .track-row, .featured-card, .album-list-item, .api-card');
      if (target) {
        outer.classList.add('hover');
      }
    };
    const handleOut = (e) => {
      const target = e.target.closest('button, .album-card, .chip, .list-row, .playlist-card, .artist-card, .trend-item, .track-row, .featured-card, .album-list-item, .api-card');
      if (target) {
        outer.classList.remove('hover');
      }
    };

    window.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseout', handleOut);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
    };
  }, [t.showCursor]);

  const showToast = useCallback((message) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 2000);
  }, []);

  const handleAlbumClick = useCallback((album) => {
    setSelectedAlbum(album);
    setDetailVisible(true);
  }, []);

  const handlePlay = useCallback((album) => {
    setCurrentAlbum(album);
    setCurrentTrackIndex(0);
    setProgress(0);
    setIsPlaying(true);
    showToast(`正在播放：${album.tracks[0].title}`);
  }, [showToast]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying((p) => !p);
  }, []);

  const handleToggleFavorite = useCallback(() => {
    if (!selectedAlbum) return;
    setFavorites((prev) => {
      const next = { ...prev, [selectedAlbum.id]: !prev[selectedAlbum.id] };
      showToast(next[selectedAlbum.id] ? '已添加到收藏' : '已取消收藏');
      return next;
    });
  }, [selectedAlbum, showToast]);

  const handleSeek = useCallback((pct) => {
    setProgress(pct);
  }, []);

  const handleTrackClick = useCallback((idx) => {
    setCurrentTrackIndex(idx);
    setProgress(0);
    if (!isPlaying) setIsPlaying(true);
  }, [isPlaying]);

  const handleTrackNext = useCallback(() => {
    if (!currentAlbum) return;
    if (currentTrackIndex < currentAlbum.tracks.length - 1) {
      setCurrentTrackIndex((i) => i + 1);
      setProgress(0);
    }
  }, [currentAlbum, currentTrackIndex]);

  const handleTrackPrev = useCallback(() => {
    if (progress > 0.1) {
      setProgress(0);
      return;
    }
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex((i) => i - 1);
      setProgress(0);
    }
  }, [currentTrackIndex, progress]);

  const handleTabNavigate = useCallback((tab) => {
    if (tab === 'player') {
      if (currentAlbum) {
        setFullPlayerVisible(true);
      } else {
        showToast('先选一张唱片开始播放吧');
      }
      return;
    }
    setCurrentTab(tab);
  }, [currentAlbum, showToast]);

  const handleMiniPlayerClick = useCallback(() => {
    setFullPlayerVisible(true);
  }, []);

  // 根据 tweek 调整 CSS 变量
  const cssVars = {
    '--accent-color': t.accentColor,
    '--bg-color': t.bgColor,
    '--text-color': t.textColor,
  };

  return (
    <div style={{ ...cssVars, position: 'relative' }}>
      <IOSDevice width={390} height={844} dark>
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
          {/* 主页面 */}
          {currentTab === 'home' && (
            <HomePage
              onAlbumClick={handleAlbumClick}
              onPlay={handlePlay}
              albums={ALBUMS}
            />
          )}
          {currentTab === 'discover' && (
            <DiscoverPage
              onAlbumClick={handleAlbumClick}
              onPlay={handlePlay}
              albums={ALBUMS}
            />
          )}
          {currentTab === 'activity' && (
            <ActivityPage albums={ALBUMS} />
          )}
          {currentTab === 'profile' && (
            <ProfilePage
              albums={ALBUMS}
              onShowDesignSpecs={() => setShowDesignSpecs(true)}
              onShowApiDocs={() => setShowApiDocs(true)}
            />
          )}

          {/* 底部导航 */}
          <TabBar active={currentTab} onNavigate={handleTabNavigate} dark />

          {/* 迷你播放器 */}
          <MiniPlayer
            album={currentAlbum}
            onOpen={handleMiniPlayerClick}
            onPlayPause={handlePlayPause}
            isPlaying={isPlaying}
            progress={progress}
          />

          {/* 详情页 */}
          {detailVisible && selectedAlbum && (
            <AlbumDetailPage
              album={selectedAlbum}
              onClose={() => setDetailVisible(false)}
              onPlay={handlePlayPause}
              isPlaying={currentAlbum?.id === selectedAlbum.id && isPlaying}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={!!favorites[selectedAlbum.id]}
              progress={currentAlbum?.id === selectedAlbum.id ? progress : 0}
              onSeek={handleSeek}
              currentTrackIndex={currentAlbum?.id === selectedAlbum.id ? currentTrackIndex : 0}
              onTrackClick={handleTrackClick}
            />
          )}

          {/* 全尺寸播放器 */}
          {fullPlayerVisible && currentAlbum && (
            <FullPlayerPage
              album={currentAlbum}
              onClose={() => setFullPlayerVisible(false)}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              progress={progress}
              onSeek={handleSeek}
              currentTrackIndex={currentTrackIndex}
              onTrackNext={handleTrackNext}
              onTrackPrev={handleTrackPrev}
            />
          )}

          {/* 设计规范页 */}
          {showDesignSpecs && (
            <DesignSpecsPage
              onClose={() => setShowDesignSpecs(false)}
              primaryColor={t.accentColor}
            />
          )}

          {/* 接口文档页 */}
          {showApiDocs && (
            <ApiDocsPage onClose={() => setShowApiDocs(false)} />
          )}

          {/* Toast */}
          <Toast message={toast.message} visible={toast.visible} />
        </div>
      </IOSDevice>

      {/* Tweaks 面板 */}
      <TweaksPanel>
        <TweakSection label="配色" />
        <TweakColor
          label="强调色"
          value={t.accentColor}
          options={['#C86A3E', '#8B4513', '#5fa87c', '#c84e6e', '#7a5ae0']}
          onChange={(v) => setTweak('accentColor', v)}
        />
        <TweakRadio
          label="风格主题"
          value={t.themeStyle}
          options={['warm', 'cool', 'mono']}
          onChange={(v) => setTweak('themeStyle', v)}
        />

        <TweakSection label="动效" />
        <TweakToggle
          label="唱针光标"
          value={t.showCursor}
          onChange={(v) => setTweak('showCursor', v)}
        />
        <TweakToggle
          label="唱片旋转"
          value={t.vinylAnimation}
          onChange={(v) => setTweak('vinylAnimation', v)}
        />

        <TweakSection label="界面" />
        <TweakRadio
          label="密度"
          value={t.interfaceDensity}
          options={['compact', 'regular', 'comfy']}
          onChange={(v) => setTweak('interfaceDensity', v)}
        />
      </TweaksPanel>

      {/* 全局动画 */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes expandDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
