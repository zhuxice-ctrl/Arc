/* ============================================================
   古籍鉴 · 主应用
   形态：原生 App
   核心流程：拍照 → 识别 → 判定 → 归档
   ============================================================ */

function App() {
  // 屏幕状态
  const [screen, setScreen] = useState('splash'); // splash, main
  const [activeTab, setActiveTab] = useState('home');
  const [detailScreen, setDetailScreen] = useState(null); // null, 'camera', 'scan', 'result', 'archiveDetail', 'knowledge', 'spec', 'api'
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', icon: null });
  const [selectedArchive, setSelectedArchive] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  
  // 档案数据
  const [archives, setArchives] = useState(SAMPLE_ARCHIVES);
  
  // 动画方向
  const [navDirection, setNavDirection] = useState('right');
  
  // 页面可见性控制
  const [isVisible, setIsVisible] = useState(true);
  
  // 减少动画偏好
  const [reducedMotion, setReducedMotion] = useState(false);

  // ─── 页面可见性监听 ───
  useEffect(() => {
    const handleVisibility = () => {
      setIsVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // ─── 减少动画偏好 ───
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);

  // ─── 自定义光标 ───
  useEffect(() => {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor || reducedMotion) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let rafId = null;
    let visible = false;

    const animate = () => {
      if (!isVisible) { rafId = null; return; }
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      rafId = requestAnimationFrame(animate);
    };

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) {
        visible = true;
        cursor.classList.add('visible');
      }
      if (!rafId && isVisible) {
        rafId = requestAnimationFrame(animate);
      }
    };

    const onDown = () => cursor.classList.add('clicking');
    const onUp = () => cursor.classList.remove('clicking');
    
    const onOver = (e) => {
      const target = e.target;
      if (target.closest && (
        target.closest('button') || 
        target.closest('.tab-item') || 
        target.closest('.archive-item') ||
        target.closest('.knowledge-card') ||
        target.closest('.filter-chip') ||
        target.closest('.quick-action') ||
        target.closest('.stat-card') ||
        target.closest('.sheet-option') ||
        target.closest('.sheet-cancel') ||
        target.closest('.nav-btn') ||
        target.closest('.api-endpoint') ||
        target.closest('.comparison-item') ||
        target.closest('.shutter-btn') ||
        target.closest('.camera-side-btn') ||
        target.closest('.section-more')
      )) {
        cursor.classList.add('hover');
      }
    };
    
    const onOut = (e) => {
      const target = e.target;
      if (target.closest && (
        target.closest('button') || 
        target.closest('.tab-item') || 
        target.closest('.archive-item') ||
        target.closest('.knowledge-card') ||
        target.closest('.filter-chip') ||
        target.closest('.quick-action') ||
        target.closest('.stat-card') ||
        target.closest('.sheet-option') ||
        target.closest('.sheet-cancel') ||
        target.closest('.nav-btn') ||
        target.closest('.api-endpoint') ||
        target.closest('.comparison-item') ||
        target.closest('.shutter-btn') ||
        target.closest('.camera-side-btn') ||
        target.closest('.section-more')
      )) {
        cursor.classList.remove('hover');
      }
    };

    const onLeave = () => {
      visible = false;
      cursor.classList.remove('visible');
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    // 初始居中
    cursor.style.left = '50%';
    cursor.style.top = '50%';

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.addEventListener('mouseleave', onLeave);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('mouseleave', onLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isVisible, reducedMotion]);

  // ─── Toast 控制 ───
  const showToast = useCallback((message, icon = null) => {
    setToast({ show: true, message, icon });
    setTimeout(() => {
      setToast(t => ({ ...t, show: false }));
    }, 1800);
  }, []);

  // ─── 导航方法 ───
  const navigateTo = useCallback((target, direction = 'right') => {
    setNavDirection(direction);
    setDetailScreen(target);
  }, []);

  const goBack = useCallback(() => {
    setNavDirection('left');
    setDetailScreen(null);
  }, []);

  // ─── 核心流程 ───
  
  // 开始鉴定（拍照）
  const handleStartScan = useCallback(() => {
    setSheetOpen(true);
  }, []);

  // 从底部菜单选择拍照
  const handleSheetSelect = useCallback((option) => {
    setSheetOpen(false);
    setTimeout(() => {
      if (option.id === 'camera') {
        navigateTo('camera');
      } else if (option.id === 'album') {
        // 模拟从相册选图，直接进入扫描
        navigateTo('camera');
        setTimeout(() => {
          setSelectedArchive(SAMPLE_ARCHIVES[0]);
          setDetailScreen('scan');
        }, 400);
      }
    }, 200);
  }, [navigateTo]);

  // 拍照完成
  const handleCapture = useCallback(() => {
    // 随机选一个样本作为识别目标
    const randomIdx = Math.floor(Math.random() * SAMPLE_ARCHIVES.length);
    const target = SAMPLE_ARCHIVES[randomIdx];
    setSelectedArchive(target);
    setDetailScreen('scan');
  }, []);

  // 识别完成 → 结果页
  const handleScanComplete = useCallback((archive) => {
    setScanResult(archive);
    setDetailScreen('result');
  }, []);

  // 重新鉴定
  const handleReScan = useCallback(() => {
    setDetailScreen('camera');
    setTimeout(() => {
      const randomIdx = Math.floor(Math.random() * SAMPLE_ARCHIVES.length);
      const target = SAMPLE_ARCHIVES[randomIdx];
      setSelectedArchive(target);
      setDetailScreen('scan');
    }, 300);
  }, []);

  // 存入档案
  const handleSaveArchive = useCallback((archive) => {
    const newArchive = {
      ...archive,
      id: `arc_${Date.now()}`,
      scannedAt: new Date().toISOString().split('T')[0],
    };
    setArchives(prev => [newArchive, ...prev]);
    showToast('已存入鉴定档案', <Icon.Check size={16} color="var(--xuan-paper-light)" />);
    setTimeout(() => {
      setDetailScreen(null);
      setActiveTab('archive');
    }, 800);
  }, [showToast]);

  // 打开档案详情
  const handleOpenArchiveDetail = useCallback((archive) => {
    setSelectedArchive(archive);
    setDetailScreen('archiveDetail');
  }, []);

  // 从底部 tab 中心按钮进入
  const handleCenterBtn = useCallback(() => {
    setSheetOpen(true);
  }, []);

  // tab 切换
  const handleTabChange = useCallback((tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setDetailScreen(null);
  }, [activeTab]);

  // 查看知识页
  const handleViewKnowledge = useCallback(() => {
    setDetailScreen('knowledge');
  }, []);

  // 查看设计规范
  const handleViewSpec = useCallback(() => {
    setDetailScreen('spec');
  }, []);

  // 查看 API 文档
  const handleViewApi = useCallback(() => {
    setDetailScreen('api');
  }, []);

  // 查看档案页
  const handleViewArchive = useCallback(() => {
    setActiveTab('archive');
    setDetailScreen(null);
  }, []);

  // 底部菜单选项
  const sheetOptions = [
    { id: 'camera', title: '拍照鉴定', desc: '使用相机拍摄书影', icon: Icon.Camera },
    { id: 'album', title: '从相册选择', desc: '上传已有书影图片', icon: Icon.Image },
  ];

  // ─── 渲染主内容 ───
  const renderMainContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            onStartScan={handleStartScan}
            onViewArchive={handleViewArchive}
            onViewKnowledge={handleViewKnowledge}
            archives={archives}
          />
        );
      case 'archive':
        return (
          <ArchiveScreen
            archives={archives}
            onOpenDetail={handleOpenArchiveDetail}
            onStartScan={handleStartScan}
          />
        );
      case 'knowledge':
        return (
          <KnowledgeScreen onBack={() => setActiveTab('home')} />
        );
      case 'profile':
        return (
          <ProfileScreen
            onViewSpec={handleViewSpec}
            onViewApi={handleViewApi}
          />
        );
      default:
        return null;
    }
  };

  // 启动页
  if (screen === 'splash') {
    return (
      <IOSDevice width={402} height={874}>
        <SplashScreen onFinish={() => setScreen('main')} />
      </IOSDevice>
    );
  }

  // 主应用
  return (
    <IOSDevice width={402} height={874}>
      <div className="app-shell">
        {/* 主页面内容（带 Tab 栏） */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            {renderMainContent()}
          </div>
          {!detailScreen && <TabBar activeTab={activeTab} onTabChange={handleTabChange} onCenterClick={handleCenterBtn} />}
        </div>

        {/* 详情页覆盖层 */}
        {detailScreen && (
          <div 
            className={`screen ${navDirection === 'right' ? 'screen-enter-right' : 'screen-enter-left'}`}
            style={{ zIndex: 50, background: 'var(--xuan-paper)' }}
          >
            {detailScreen === 'camera' && (
              <CameraScreen
                onBack={goBack}
                onCapture={handleCapture}
                onPickImage={handleCapture}
              />
            )}
            {detailScreen === 'scan' && (
              <ScanScreen
                onBack={goBack}
                onComplete={handleScanComplete}
                targetArchive={selectedArchive}
              />
            )}
            {detailScreen === 'result' && scanResult && (
              <ResultScreen
                archive={scanResult}
                onBack={goBack}
                onSave={handleSaveArchive}
                onReScan={handleReScan}
                showConfidence
              />
            )}
            {detailScreen === 'archiveDetail' && selectedArchive && (
              <ArchiveDetailScreen
                archive={selectedArchive}
                onBack={goBack}
              />
            )}
            {detailScreen === 'knowledge' && (
              <KnowledgeScreen onBack={goBack} />
            )}
            {detailScreen === 'spec' && (
              <DesignSpecScreen onBack={goBack} />
            )}
            {detailScreen === 'api' && (
              <ApiDocsScreen onBack={goBack} />
            )}
          </div>
        )}

        {/* 底部 Sheet */}
        {sheetOpen && (
          <BottomSheet
            title="选择书影来源"
            options={sheetOptions}
            onClose={() => setSheetOpen(false)}
            onSelect={handleSheetSelect}
          />
        )}

        {/* Toast */}
        <Toast message={toast.message} show={toast.show} icon={toast.icon} />
      </div>
    </IOSDevice>
  );
}

// ─── 渲染 ───
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// 宣告可升级为全栈应用
function announceUpgrade() {
  window.parent?.postMessage?.({ type: 'miaoda:upgrade:available', kind: 'interactive-prototype' }, '*');
}
announceUpgrade();
if (document.readyState !== 'complete') {
  window.addEventListener('load', announceUpgrade, { once: true });
}
