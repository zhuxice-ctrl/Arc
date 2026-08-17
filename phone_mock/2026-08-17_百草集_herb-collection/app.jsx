// Main App - orchestrates all screens, navigation, tab bar and transitions
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "regular",
  "theme": "classic",
  "animations": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [activeTab, setActiveTab] = React.useState('home');
  const [detailHerb, setDetailHerb] = React.useState(null);
  const [showSpec, setShowSpec] = React.useState(false);
  const [showApi, setShowApi] = React.useState(false);
  const [transitioning, setTransitioning] = React.useState(false);

  // Pause rAF when tab hidden
  React.useEffect(() => {
    const onVisibilityChange = () => {
      // Let child components read document.hidden
      document.dispatchEvent(new CustomEvent('visibility-change'));
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  const handleTabChange = (tab) => {
    if (transitioning) return;
    if (tab === activeTab) return;
    setTransitioning(true);
    setActiveTab(tab);
    setDetailHerb(null);
    setShowSpec(false);
    setShowApi(false);
    setTimeout(() => setTransitioning(false), 350);
  };

  const handleHerbClick = (herb) => {
    setDetailHerb(herb);
  };

  const handleBackFromDetail = () => {
    setDetailHerb(null);
  };

  const handleNavigate = (target) => {
    if (target === 'spec') {
      setShowSpec(true);
    } else if (target === 'api') {
      setShowApi(true);
    } else if (target === 'solar') {
      handleTabChange('solar');
    } else if (target === 'pharma') {
      handleTabChange('pharma');
    } else if (target === 'prescriptions') {
      handleTabChange('prescriptions');
    } else if (target === 'cabinet') {
      handleTabChange('cabinet');
    }
  };

  // Reduced motion support
  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const animEnabled = t.animations && !prefersReduced;

  const tabs = [
    { id: 'home', label: '首页', icon: Icon.Home },
    { id: 'pharma', label: '药典', icon: Icon.Book },
    { id: 'prescriptions', label: '药方', icon: Icon.Recipe },
    { id: 'solar', label: '节气', icon: Icon.Sun },
    { id: 'cabinet', label: '药柜', icon: Icon.User },
  ];

  const renderMainScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} onHerbClick={handleHerbClick} />;
      case 'pharma':
        return <PharmacopeiaPage onHerbClick={handleHerbClick} />;
      case 'prescriptions':
        return <PrescriptionsPage />;
      case 'solar':
        return <SolarTermsPage />;
      case 'cabinet':
        return <CabinetPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} onHerbClick={handleHerbClick} />;
    }
  };

  return (
    <div className="app-shell">
      {/* Main tab screen */}
      {renderMainScreen()}

      {/* Tab Bar */}
      <div className="tab-bar">
        {tabs.map(tab => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <div
              key={tab.id}
              className={`tab-item ${isActive ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              <IconComp size={24} color={isActive ? 'var(--herb-green)' : 'var(--gray-brown)'} />
              <span>{tab.label}</span>
            </div>
          );
        })}
      </div>

      {/* Detail page (overlays) */}
      {detailHerb && (
        <DetailPage
          herb={detailHerb}
          onBack={handleBackFromDetail}
        />
      )}

      {/* Design spec page (modal push) */}
      {showSpec && (
        <DesignSpecPage onBack={() => setShowSpec(false)} />
      )}

      {/* API docs page (modal push) */}
      {showApi && (
        <ApiDocsPage onBack={() => setShowApi(false)} />
      )}

      {/* Tweaks */}
      <TweaksPanel>
        <TweakSection label="显示" />
        <TweakRadio
          label="密度"
          value={t.density}
          options={['compact', 'regular', 'comfy']}
          onChange={(v) => setTweak('density', v)}
        />
        <TweakRadio
          label="主题"
          value={t.theme}
          options={['classic', 'warm', 'light']}
          onChange={(v) => setTweak('theme', v)}
        />
        <TweakToggle
          label="动画效果"
          value={t.animations}
          onChange={(v) => setTweak('animations', v)}
        />
        <TweakSection label="开发" />
        <TweakButton
          label="查看接口文档"
          onClick={() => setShowApi(true)}
        />
        <TweakButton
          label="设计规范"
          onClick={() => setShowSpec(true)}
        />
      </TweaksPanel>
    </div>
  );
}

// Render the app inside iOS device frame
function DeviceWrap() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <IOSDevice width={402} height={874}>
        <App />
      </IOSDevice>
      <div className="device-label">百草集 v2.0 · iOS 原生 App</div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('device-container'));
root.render(<DeviceWrap />);

// Announce upgrade capability
function announceUpgrade() {
  try {
    window.parent.postMessage({ type: 'miaoda:upgrade:available', kind: 'interactive-prototype' }, '*');
  } catch (e) {}
}
announceUpgrade();
if (document.readyState !== 'complete') {
  window.addEventListener('load', announceUpgrade, { once: true });
}
