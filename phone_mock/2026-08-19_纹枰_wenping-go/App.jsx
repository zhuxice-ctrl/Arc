// 纹枰 — 主应用组件
// 整合所有页面，管理 Tab 切换、页面栈、全局状态

const { useState, useEffect, useCallback, useRef } = React;
const {
  WENPING_COLORS, CustomCursor, TabBar, PageStack, TabContent,
  TodayPage, LibraryPage, CollectionPage, ProfilePage,
  GameViewPage, TSGPage, DesignSpecPage, ApiDocPage,
} = window;

function WenPingApp() {
  // Tab 状态
  const [activeTab, setActiveTab] = useState('today');

  // 页面栈（每个 tab 独立维护栈）
  const [pageStacks, setPageStacks] = useState({
    today: [],
    library: [],
    collections: [],
    profile: [],
  });

  // 妙手收藏
  const [collections, setCollections] = useState(DEFAULT_COLLECTIONS);
  const [generateToast, setGenerateToast] = useState(false);

  // 统计
  const stats = {
    studiedGames: 42,
    collections: collections.length,
    streak: 15,
  };

  // 页面栈操作
  const pushPage = useCallback((tab, page) => {
    setPageStacks((prev) => ({
      ...prev,
      [tab]: [...prev[tab], page],
    }));
  }, []);

  const popPage = useCallback((tab) => {
    setPageStacks((prev) => ({
      ...prev,
      [tab]: prev[tab].slice(0, -1),
    }));
  }, []);

  // Tab 图标
  const tabIcons = {
    today: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    library: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    collections: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    profile: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  };

  const tabs = [
    { id: 'today', label: '今日', icon: tabIcons.today },
    { id: 'library', label: '谱库', icon: tabIcons.library },
    { id: 'collections', label: '妙手集', icon: tabIcons.collections },
    { id: 'profile', label: '我的', icon: tabIcons.profile },
  ];

  // 打开棋谱
  const handleOpenGame = (game) => {
    const tab = activeTab === 'library' ? 'library' : 'today';
    pushPage(tab, {
      key: `game-${game.id}-${Date.now()}`,
      component: (
        <GameViewPage
          game={game}
          onBack={() => popPage(tab)}
          onCollect={(item) => {
            const newItem = {
              id: `coll-${Date.now()}`,
              ...item,
              createdAt: Date.now(),
            };
            setCollections((prev) => [newItem, ...prev]);
          }}
          collections={collections}
        />
      ),
    });
  };

  // 打开死活题
  const handleOpenTSG = (problem) => {
    pushPage('today', {
      key: `tsg-${problem.id}-${Date.now()}`,
      component: (
        <TSGPage problem={problem} onBack={() => popPage('today')} />
      ),
    });
  };

  // 打开设计规范
  const handleOpenDesignSpec = () => {
    pushPage('profile', {
      key: `design-spec-${Date.now()}`,
      component: <DesignSpecPage onBack={() => popPage('profile')} />,
    });
  };

  // 打开接口文档
  const handleOpenApiDoc = () => {
    pushPage('profile', {
      key: `api-doc-${Date.now()}`,
      component: <ApiDocPage onBack={() => popPage('profile')} />,
    });
  };

  // 从妙手集打开棋谱
  const handleOpenCollection = (item) => {
    const game = ALL_GAMES.find((g) => g.id === item.gameId);
    if (!game) return;
    pushPage('collections', {
      key: `coll-game-${item.id}-${Date.now()}`,
      component: (
        <GameViewPage
          game={game}
          onBack={() => popPage('collections')}
          onCollect={(newItem) => {
            const newCol = {
              id: `coll-${Date.now()}`,
              ...newItem,
              createdAt: Date.now(),
            };
            setCollections((prev) => [newCol, ...prev]);
          }}
          collections={collections}
        />
      ),
    });
  };

  // 编辑笔记
  const handleEditNote = (item) => {
    const newNote = prompt('编辑笔记：', item.note || '');
    if (newNote !== null) {
      setCollections((prev) =>
        prev.map((c) => (c.id === item.id ? { ...c, note: newNote } : c))
      );
    }
  };

  // 删除收藏
  const handleDelete = (id) => {
    if (confirm('确定删除这条收藏？')) {
      setCollections((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // 生成棋谱笔记
  const handleGenerateNote = () => {
    setGenerateToast(true);
    setTimeout(() => setGenerateToast(false), 2000);
  };

  // 渲染当前 tab 内容
  const renderTabContent = () => {
    let tabContent;
    switch (activeTab) {
      case 'today':
        tabContent = (
          <TodayPage
            onOpenGame={handleOpenGame}
            onOpenTSG={handleOpenTSG}
            onOpenLibrary={() => setActiveTab('library')}
          />
        );
        break;
      case 'library':
        tabContent = <LibraryPage onOpenGame={handleOpenGame} />;
        break;
      case 'collections':
        tabContent = (
          <CollectionPage
            collections={collections}
            onOpenCollection={handleOpenCollection}
            onEditNote={handleEditNote}
            onDelete={handleDelete}
            onGenerateNote={handleGenerateNote}
          />
        );
        break;
      case 'profile':
        tabContent = (
          <ProfilePage
            onOpenDesignSpec={handleOpenDesignSpec}
            onOpenApiDoc={handleOpenApiDoc}
            stats={stats}
          />
        );
        break;
      default:
        tabContent = null;
    }

    const stack = pageStacks[activeTab] || [];
    const pages = [
      { key: `${activeTab}-root`, component: tabContent },
      ...stack,
    ];

    return <PageStack pages={pages} onPop={() => popPage(activeTab)} />;
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: WENPING_COLORS.paper,
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '"LXGW WenKai", "KaiTi", "STKaiti", serif',
    }}>
      <CustomCursor />

      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        marginBottom: 50,
        paddingBottom: 'var(--ios-safe-bottom)',
      }}>
        {renderTabContent()}
      </div>

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

      {/* 生成笔记 Toast */}
      {generateToast && (
        <div style={{
          position: 'absolute',
          bottom: 100,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(44, 24, 16, 0.92)',
          color: WENPING_COLORS.stoneWhite,
          padding: '10px 18px',
          borderRadius: 999,
          fontSize: 13,
          zIndex: 100,
          fontFamily: '"LXGW WenKai", "KaiTi", serif',
          animation: 'toastIn 0.3s ease-out',
          boxShadow: '0 4px 16px rgba(44,24,16,0.3)',
        }}>
          ✓ 棋谱笔记已生成
        </div>
      )}
    </div>
  );
}

window.WenPingApp = WenPingApp;
