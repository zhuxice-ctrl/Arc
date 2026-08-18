// 临池日课 - 主应用
// 负责页面栈管理、Tab 切换、导航转场

const { useState, useEffect, useRef, useCallback } = React;

function App() {
  const [activeTab, setActiveTab] = useState('today'); // today | steles | collection | me
  // 页面栈：支持 push/pop 的原生 App 导航
  const [stack, setStack] = useState([]); // [{ id, component, props }]
  const [transition, setTransition] = useState(null); // 'push' | 'pop' | null
  const [state, setState] = React.useState(window.LINCHI_STORE.getState());

  useEffect(() => {
    const unsub = window.LINCHI_STORE.subscribe(setState);
    return unsub;
  }, []);

  // push 新页面
  function pushPage(id, Comp, props = {}) {
    setTransition('push');
    setStack(prev => [...prev, { id, Comp, props }]);
    setTimeout(() => setTransition(null), 350);
  }

  // pop 页面
  function popPage() {
    if (stack.length === 0) return;
    setTransition('pop');
    setTimeout(() => {
      setStack(prev => prev.slice(0, -1));
      setTransition(null);
    }, 300);
  }

  // 切换 Tab 时清空栈
  function switchTab(tab) {
    if (stack.length > 0) {
      setStack([]);
    }
    setActiveTab(tab);
  }

  // 开始临写（从今日页或碑帖页进入）
  function startWrite() {
    pushPage('write', window.WritePage, {
      onBack: popPage,
      onCompare: () => {
        // 临写完成后进入叠影对比页（替换当前页，栈深度不变）
        // 先 pop 再 push，保证动画自然
        setTransition('pop');
        setTimeout(() => {
          setStack(prev => prev.slice(0, -1));
          setTransition('push');
          setStack(prev => [...prev, {
            id: 'compare',
            Comp: window.ComparePage,
            props: {
              onBack: () => {
                // 返回到临写页
                setTransition('pop');
                setTimeout(() => {
                  setStack(prev => prev.slice(0, -1));
                  setTransition(null);
                }, 300);
              },
              onDone: () => {
                // 收入集字墙，回到集字墙 Tab
                setStack([]);
                setTransition(null);
                setActiveTab('collection');
                window.showToast('已收入集字墙');
              },
            },
          }]);
          setTimeout(() => setTransition(null), 350);
        }, 300);
      },
    });
  }

  // 打开碑帖详情
  function openStele(steleId) {
    window.LINCHI_STORE.setState({ currentSteleId: steleId });
    pushPage('steleDetail', window.SteleDetailPage, {
      steleId,
      onBack: popPage,
      onWriteChar: startWrite,
    });
  }

  // 打开设计规范
  function openDesignSpec() {
    pushPage('designSpec', window.DesignSpecPage, { onBack: popPage });
  }

  // 打开接口文档
  function openApiDoc() {
    pushPage('apiDoc', window.ApiDocPage, { onBack: popPage });
  }

  // 查看集字墙中的字（跳转到叠影对比）
  function viewCollectionChar(item) {
    // 设置为当前字
    window.LINCHI_STORE.setState({
      currentSteleId: item.steleId,
      currentChar: item.char,
      lastWriting: {
        imageData: item.imageData || null,
        char: item.char,
        steleId: item.steleId,
        score: item.score,
      },
    });
    pushPage('compare', window.ComparePage, {
      onBack: popPage,
      onDone: popPage,
    });
  }

  // 当前 Tab 的主页
  let HomeComp;
  let homeProps = {};
  switch (activeTab) {
    case 'today':
      HomeComp = window.TodayPage;
      homeProps = { onStartWrite: startWrite };
      break;
    case 'steles':
      HomeComp = window.StelesPage;
      homeProps = { onOpenStele: openStele };
      break;
    case 'collection':
      HomeComp = window.CollectionPage;
      homeProps = { onViewChar: viewCollectionChar };
      break;
    case 'me':
      HomeComp = window.MePage;
      homeProps = {
        onOpenDesignSpec: openDesignSpec,
        onOpenApiDoc: openApiDoc,
        onReset: () => {},
      };
      break;
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Tab 主页（底层） */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          opacity: stack.length > 0 ? (transition === 'push' ? 0.6 : 0.6) : 1,
          transition: 'opacity 0.3s',
          transform: stack.length > 0 && transition === 'push' ? 'translateX(-20%)' :
                    stack.length > 0 && transition === 'pop' ? 'translateX(0)' :
                    stack.length > 0 ? 'translateX(-20%)' : 'translateX(0)',
          transition: 'all 0.35s cubic-bezier(0.22, 0.61, 0.36, 1)',
        }}
      >
        <HomeComp {...homeProps} />
        <TabBar active={activeTab} onChange={switchTab} />
      </div>

      {/* 页面栈（叠加在上） */}
      {stack.map((page, idx) => {
        const isTop = idx === stack.length - 1;
        const PageComp = page.Comp;
        return (
          <div
            key={`${page.id}-${idx}`}
            className={
              transition === 'push' && isTop && idx === stack.length - 1
                ? 'page-enter-right'
                : ''
            }
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '100%',
              zIndex: 10 + idx,
            }}
          >
            <PageComp {...page.props} />
          </div>
        );
      })}
    </div>
  );
}

// 底部 TabBar
function TabBar({ active, onChange }) {
  const tabs = [
    {
      key: 'today',
      label: '今日',
      icon: (active) => (
        <svg viewBox="0 0 24 24" fill="none">
          {active ? (
            <>
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8 5.8 21.3l2.4-7.4L2 9.4h7.6L12 2z" fill="currentColor" />
            </>
          ) : (
            <>
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8 5.8 21.3l2.4-7.4L2 9.4h7.6L12 2z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
            </>
          )}
        </svg>
      ),
    },
    {
      key: 'steles',
      label: '碑帖',
      icon: (active) => (
        <svg viewBox="0 0 24 24" fill="none">
          {active ? (
            <rect x="4" y="3" width="16" height="18" rx="1" fill="currentColor" />
          ) : (
            <rect x="4" y="3" width="16" height="18" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
          )}
          {active ? (
            <path d="M8 7h8M8 11h8M8 15h5" stroke="#1a1714" strokeWidth="1.2" strokeLinecap="round" />
          ) : (
            <path d="M8 7h8M8 11h8M8 15h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          )}
        </svg>
      ),
    },
    {
      key: 'collection',
      label: '集字',
      icon: (active) => (
        <svg viewBox="0 0 24 24" fill="none">
          {active ? (
            <>
              <rect x="4" y="4" width="7" height="7" rx="1" fill="currentColor" />
              <rect x="13" y="4" width="7" height="7" rx="1" fill="currentColor" />
              <rect x="4" y="13" width="7" height="7" rx="1" fill="currentColor" />
              <rect x="13" y="13" width="7" height="7" rx="1" fill="currentColor" />
            </>
          ) : (
            <>
              <rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <rect x="13" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <rect x="4" y="13" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <rect x="13" y="13" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </>
          )}
        </svg>
      ),
    },
    {
      key: 'me',
      label: '我的',
      icon: (active) => (
        <svg viewBox="0 0 24 24" fill="none">
          {active ? (
            <>
              <circle cx="12" cy="8" r="4" fill="currentColor" />
              <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" fill="currentColor" />
            </>
          ) : (
            <>
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </>
          )}
        </svg>
      ),
    },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '83px',
        background: 'rgba(26,23,20,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '0.5px solid rgba(236,229,216,0.1)',
        display: 'flex',
        padding: '8px 0 28px',
        zIndex: 5,
      }}
    >
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            color: active === tab.key ? '#b06a3b' : '#7a7268',
            cursor: 'pointer',
            transition: 'color 0.2s',
            fontSize: '11px',
            border: 'none',
            background: 'none',
            fontFamily: 'inherit',
            padding: 0,
          }}
        >
          {tab.icon(active === tab.key)}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

// 渲染
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
