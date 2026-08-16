// Kintsugi 金缮笔记 App — 主入口
// 管理页面路由、底部导航、全局状态

function KintsugiApp() {
  const [page, setPage] = useState('home'); // home / detail / new / timeline / spec / api
  const [selectedRelicId, setSelectedRelicId] = useState(null);
  const [showingPage, setShowingPage] = useState('home');
  const reduced = useReducedMotion();

  // 过渡方向
  const [direction, setDirection] = useState('forward');

  const navigate = useCallback((target, opts = {}) => {
    const order = ['home', 'detail', 'new', 'timeline', 'spec', 'api'];
    const fromIdx = order.indexOf(page);
    const toIdx = order.indexOf(target);
    setDirection(toIdx > fromIdx ? 'forward' : 'backward');
    setShowingPage(target);
    // 先触发动画再切状态
    window.__kin?.setT(() => setPage(target), 50);
  }, [page]);

  const handleSelectRelic = (id) => {
    setSelectedRelicId(id);
    setDirection('forward');
    setShowingPage('detail');
    window.__kin?.setT(() => setPage('detail'), 50);
  };

  const handleBackFromDetail = () => {
    setDirection('backward');
    setShowingPage('home');
    window.__kin?.setT(() => setPage('home'), 50);
  };

  const handleBackFromNew = () => {
    setDirection('backward');
    setShowingPage('home');
    window.__kin?.setT(() => setPage('home'), 50);
  };

  const handleNewCreated = () => {
    setDirection('backward');
    setShowingPage('home');
    window.__kin?.setT(() => setPage('home'), 50);
  };

  // Tab 列表（首页、时间轴、新建、规范、API）
  const tabs = [
    {
      key: 'home', label: 'ホーム',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      key: 'timeline', label: '軌跡',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      key: 'new', label: '新 規',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      ),
    },
    {
      key: 'spec', label: '便覧',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        </svg>
      ),
    },
    {
      key: 'api', label: 'API',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
    },
  ];

  const handleTabChange = (key) => {
    if (key === page) return;
    navigate(key);
  };

  // 渲染当前页面
  const renderPage = (p) => {
    switch (p) {
      case 'home':
        return <HomePage onSelectRelic={handleSelectRelic} />;
      case 'detail':
        return selectedRelicId
          ? <DetailPage relicId={selectedRelicId} onBack={handleBackFromDetail} />
          : null;
      case 'new':
        return <NewRelicPage onBack={handleBackFromNew} onCreated={handleNewCreated} />;
      case 'timeline':
        return <TimelinePage />;
      case 'spec':
        return <SpecPage />;
      case 'api':
        return <ApiPage />;
      default:
        return null;
    }
  };

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: 'var(--kin-urushi)',
      overflow: 'hidden',
    }}>
      {/* 页面容器 */}
      <div style={{
        position: 'absolute', inset: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollbarWidth: 'none',
      }}
        onScroll={handleScroll}
      >
        {/* 两个页面做切换动画：当前页 + 正在进入的页 */}
        <div style={{
          position: 'relative',
          width: '100%',
          minHeight: '100%',
        }}>
          {/* 当前页面 */}
          <div
            key={page}
            style={{
              width: '100%',
              animation: reduced ? 'none'
                : `pageIn 450ms cubic-bezier(.2,.8,.2,1) both`,
              // direction 影响但简化处理统一淡入
            }}
          >
            {renderPage(page)}
          </div>
        </div>
      </div>

      {/* 底部导航（仅主 tab 页显示） */}
      {['home', 'timeline', 'spec', 'api'].includes(page) && (
        <KinBottomNav
          current={page}
          onChange={handleTabChange}
          tabs={tabs}
        />
      )}
      {/* 新建页面显示半高导航？简单处理：不显示底部 nav，靠返回按钮 */}
    </div>
  );
}

// 滚动渐入处理（简化：用 CSS animation 即可，此处预留）
function handleScroll() {
  // 不做复杂滚动监听，避免性能问题
}

// 注入页面切换 keyframes
(function injectPageKF() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pageIn {
      from {
        opacity: 0;
        transform: translateX(16px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    /* 滚动条隐藏 */
    ::-webkit-scrollbar { width: 0; height: 0; }
    * { scrollbar-width: none; }
  `;
  document.head.appendChild(style);
})();

// ─────────────────────────────────────────────────────────────
// 挂载
// ─────────────────────────────────────────────────────────────
function KintsugiAppShell() {
  return (
    <AndroidDevice dark width={390} height={844}>
      <KintsugiApp />
    </AndroidDevice>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  React.createElement(KintsugiAppShell)
);

Object.assign(window, { KintsugiApp, KintsugiAppShell });
