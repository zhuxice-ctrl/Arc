/* ============================================================
   古籍鉴 · 屏幕组件
   ============================================================ */

const IMAGE_URLS = [
  '/spark/app/app_17ccp7c6zsk/runtime/api/v1/storage/object/bucket_aadkqsm5x2omu_static/static%2Faadkqsbuoiagg_ve_miaoda',
  '/spark/app/app_17ccp7c6zsk/runtime/api/v1/storage/object/bucket_aadkqsm5x2omu_static/static%2Faadkqsbyrbucg_ve_miaoda',
  '/spark/app/app_17ccp7c6zsk/runtime/api/v1/storage/object/bucket_aadkqsm5x2omu_static/static%2Faadkqscnhnwdi_ve_miaoda',
];

// ─────────────────────────────────────────────────────────────
// 启动页
// ─────────────────────────────────────────────────────────────

function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish && onFinish();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="screen" style={{
      background: 'linear-gradient(160deg, var(--xuan-paper-light) 0%, var(--xuan-paper) 50%, var(--xuan-paper-dark) 100%)',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* 纸质纹理 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        opacity: 0.05,
      }} />
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 2,
      }}>
        <SealStamp text="古籍鉴" size={96} style={{ marginBottom: 24 }} />
        
        <div className="fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div style={{
            fontFamily: '"Noto Serif SC", serif',
            fontSize: 32,
            fontWeight: 700,
            color: 'var(--ink-black)',
            letterSpacing: '0.3em',
            marginBottom: 8,
          }}>古籍鉴</div>
          <div style={{
            fontSize: 13,
            color: 'var(--ink-medium)',
            letterSpacing: '0.4em',
            textAlign: 'center',
          }}>版本鉴定工具</div>
        </div>

        <div className="fade-in-up" style={{
          marginTop: 80,
          animationDelay: '0.8s',
          fontSize: 12,
          color: 'var(--ink-faint)',
          letterSpacing: '0.2em',
        }}>
          纸寿千年 · 墨韵万载
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 首页
// ─────────────────────────────────────────────────────────────

function HomeScreen({ onStartScan, onViewArchive, onViewKnowledge, archives }) {
  const totalArchives = archives.length;
  const songCount = archives.filter(a => a.editionType === 'song_keben' || a.era.includes('宋')).length;
  const types = new Set(archives.map(a => a.editionType)).size;

  return (
    <div className="screen scrollable paper-texture" style={{ paddingTop: 'var(--ios-safe-top, 0)' }}>
      {/* 顶部区域 */}
      <div className="home-hero fade-in-up">
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="home-seal">古籍鉴</div>
        </div>
        <h1 className="home-title">古籍版本鉴定</h1>
        <p className="home-subtitle">拍书影 · 辨版式 · 定版本</p>
      </div>

      {/* 快速操作 — 核心入口 */}
      <div 
        className="quick-action fade-in-up stagger-1"
        onClick={onStartScan}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="quick-action-title">开始鉴定</div>
          <div className="quick-action-desc">拍照或上传书影，AI 识别版式特征</div>
          <div className="quick-action-btn">
            <Icon.Camera size={16} />
            <span>拍书影鉴定</span>
          </div>
        </div>
      </div>

      {/* 统计数据 */}
      <div className="stats-row fade-in-up stagger-2">
        <div className="stat-card" onClick={onViewArchive}>
          <div className="stat-number stat-accent">{totalArchives}</div>
          <div className="stat-label">鉴定档案</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{songCount}</div>
          <div className="stat-label">宋版相关</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{types}</div>
          <div className="stat-label">版本类型</div>
        </div>
      </div>

      {/* 最近鉴定 */}
      <div className="knowledge-section fade-in-up stagger-3">
        <div className="section-header">
          <div className="section-title">最近鉴定</div>
          <div className="section-more" onClick={onViewArchive}>全部档案</div>
        </div>
        {archives.slice(0, 2).map((item, i) => (
          <div key={item.id} className="archive-item" style={{ marginBottom: 10, animationDelay: `${0.3 + i * 0.1}s` }} onClick={onViewArchive}>
            <div className="archive-item-thumb">
              <img src={IMAGE_URLS[item.imageIndex]} alt="" />
            </div>
            <div className="archive-item-info">
              <div>
                <div className="archive-item-title">{item.title}</div>
                <div className="archive-item-era">{EDITION_TYPES[item.editionType.toUpperCase()]?.name || item.era}</div>
              </div>
              <div className="archive-item-date">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Icon.Clock size={11} color="var(--ink-faint)" />
                  {item.scannedAt}
                </span>
              </div>
            </div>
            <div className="archive-item-badge">{item.confidence}%匹配</div>
          </div>
        ))}
      </div>

      {/* 版本学小知识 */}
      <div className="knowledge-section fade-in-up stagger-4">
        <div className="section-header">
          <div className="section-title">版本学小识</div>
          <div className="section-more" onClick={onViewKnowledge}>更多</div>
        </div>
        <div className="knowledge-list">
          {KNOWLEDGE_ITEMS.slice(0, 2).map((k, i) => (
            <div 
              key={k.id} 
              className="knowledge-card"
              onClick={onViewKnowledge}
              style={{ animationDelay: `${0.35 + i * 0.1}s` }}
            >
              <div style={{
                fontSize: 11,
                color: 'var(--cinnabar)',
                marginBottom: 4,
                letterSpacing: '0.1em',
              }}>{k.category}</div>
              <div className="knowledge-title">{k.title}</div>
              <div className="knowledge-text">{k.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 拍照页
// ─────────────────────────────────────────────────────────────

function CameraScreen({ onBack, onCapture, onPickImage }) {
  const [flash, setFlash] = useState(false);
  const [capturing, setCapturing] = useState(false);

  const handleShutter = () => {
    setCapturing(true);
    setTimeout(() => {
      setCapturing(false);
      onCapture && onCapture();
    }, 300);
  };

  return (
    <div className="screen" style={{ background: '#0a0806' }}>
      <NavBar 
        transparent 
        dark 
        onBack={onBack}
        rightElement={<Icon.Flash size={20} color={flash ? '#ffd700' : '#fff'} />}
      />

      {/* 取景器 */}
      <div className="camera-viewfinder" style={{ paddingTop: 'var(--ios-safe-top, 0)' }}>
        <img 
          src={IMAGE_URLS[0]} 
          alt="" 
          className="viewfinder-image"
          style={{ filter: `sepia(0.3) brightness(${flash ? 1.1 : 0.85})`, transition: 'filter 0.3s' }}
        />
        
        {/* 取景框 */}
        <div className="viewfinder-overlay">
          <div className="viewfinder-frame">
            <div className="viewfinder-corner tl" />
            <div className="viewfinder-corner tr" />
            <div className="viewfinder-corner bl" />
            <div className="viewfinder-corner br" />
          </div>
          
          <div className="viewfinder-guide">
            <span className="viewfinder-guide-text">将版框对齐取景框</span>
          </div>
        </div>

        {/* 拍摄白闪效果 */}
        {capturing && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: '#fff',
            zIndex: 20,
            animation: 'flashEffect 0.3s ease-out forwards',
          }} />
        )}

        {/* 相机控制 */}
        <div className="camera-controls">
          <div className="camera-side-btn" onClick={onPickImage}>
            <Icon.Image size={22} />
          </div>
          
          <div 
            className="shutter-btn" 
            onClick={handleShutter}
            style={{
              transform: capturing ? 'scale(0.88)' : 'scale(1)',
              transition: 'transform 0.15s var(--ease-out)',
            }}
          />
          
          <div className="camera-side-btn" onClick={() => setFlash(!flash)}>
            <Icon.Flash size={22} />
          </div>
        </div>
      </div>

      {/* CSS for flash */}
      <style>{`
        @keyframes flashEffect {
          0% { opacity: 0; }
          30% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 扫描/识别页
// ─────────────────────────────────────────────────────────────

function ScanScreen({ onBack, onComplete, targetArchive }) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [detectedFeatures, setDetectedFeatures] = useState([]);
  const [featureBoxes, setFeatureBoxes] = useState([]);
  const scanRef = useRef(null);

  const steps = [
    { text: '分析版式结构...', sub: '检测版框与版心' },
    { text: '识别版式特征...', sub: '版框 · 鱼尾 · 界行' },
    { text: '分析字体风格...', sub: '字体 · 刻工风格' },
    { text: '查找避讳字...', sub: '辨字 · 断代依据' },
    { text: '比对数据库...', sub: '宋元明清版本库' },
    { text: '生成鉴定结果...', sub: '置信度评估' },
  ];

  useEffect(() => {
    let mounted = true;
    let step = 0;
    
    const runStep = () => {
      if (!mounted) return;
      if (step >= steps.length) {
        setTimeout(() => {
          if (mounted) onComplete && onComplete(targetArchive);
        }, 400);
        return;
      }
      
      setCurrentStep(step);
      
      // 添加特征
      const newFeatures = [
        '版框', '鱼尾', '界行', '字体', '避讳字', '纸张'
      ];
      if (step < newFeatures.length && !detectedFeatures.includes(newFeatures[step])) {
        setTimeout(() => {
          if (mounted) {
            setDetectedFeatures(prev => [...prev, newFeatures[step]]);
            // 添加特征框
            const boxPositions = [
              { top: '28%', left: '18%', width: '64%', height: '50%', label: '版框' },
              { top: '34%', left: '45%', width: '10%', height: '8%', label: '鱼尾' },
              { top: '38%', left: '25%', width: '50%', height: '35%', label: '界行' },
              { top: '42%', left: '30%', width: '40%', height: '25%', label: '字体' },
              { top: '50%', left: '35%', width: '20%', height: '12%', label: '避讳字' },
              { top: '40%', left: '20%', width: '60%', height: '35%', label: '纸张' },
            ];
            if (step < boxPositions.length) {
              setFeatureBoxes(prev => [...prev, boxPositions[step]]);
            }
          }
        }, 200 + step * 100);
      }
      
      const targetProgress = ((step + 1) / steps.length) * 100;
      const startProgress = progress;
      const startTime = Date.now();
      const duration = 600 + step * 150;
      
      const animateProgress = () => {
        if (!mounted) return;
        const elapsed = Date.now() - startTime;
        const t = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        const current = startProgress + (targetProgress - startProgress) * ease;
        setProgress(current);
        
        if (t < 1) {
          requestAnimationFrame(animateProgress);
        } else {
          step++;
          setTimeout(runStep, 200);
        }
      };
      
      requestAnimationFrame(animateProgress);
    };
    
    setTimeout(runStep, 500);
    
    return () => { mounted = false; };
  }, []);

  return (
    <div className="scan-page" style={{ paddingTop: 'var(--ios-safe-top, 0)' }}>
      <NavBar transparent dark onBack={onBack} title="正在鉴定" />
      
      {/* 扫描区 */}
      <div className="scan-image-wrap">
        <img src={IMAGE_URLS[targetArchive?.imageIndex || 0]} alt="" className="scan-image" />
        <div className="scan-scanline" />
        
        {/* 特征检测框 */}
        {featureBoxes.map((box, i) => (
          <div
            key={i}
            className="feature-box"
            data-label={box.label}
            style={{
              top: `calc(${box.top} + var(--ios-safe-top, 0) * 0.3)`,
              left: box.left,
              width: box.width,
              height: box.height,
              animationDelay: `${0.1 + i * 0.1}s`,
            }}
          />
        ))}
      </div>
      
      {/* 进度区域 */}
      <div className="scan-progress">
        <div className="scan-status">
          <div className="scan-status-text">{steps[currentStep]?.text || '识别中...'}</div>
          <div className="scan-status-sub">{steps[currentStep]?.sub || ''}</div>
        </div>
        
        <div className="scan-bar">
          <div className="scan-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        
        <div className="scan-feature-list">
          {detectedFeatures.map((f, i) => (
            <span 
              key={f} 
              className="scan-feature-tag"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              ✓ {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 结果页
// ─────────────────────────────────────────────────────────────

function ResultScreen({ archive, onBack, onSave, onReScan, showConfidence }) {
  const [saved, setSaved] = useState(false);
  const [confidenceAnimated, setConfidenceAnimated] = useState(false);
  
  const editionInfo = EDITION_TYPES[archive.editionType.toUpperCase()];

  useEffect(() => {
    const timer = setTimeout(() => setConfidenceAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    if (saved) return;
    setSaved(true);
    setTimeout(() => {
      onSave && onSave(archive);
    }, 500);
  };

  const features = [
    { key: 'ban_kuang', label: '版框' },
    { key: 'yu_wei', label: '鱼尾' },
    { key: 'jie_hang', label: '行款' },
    { key: 'zi_ti', label: '字体' },
    { key: 'bi_hui', label: '避讳' },
    { key: 'zhi_zhang', label: '纸张' },
  ];

  return (
    <div className="screen result-page" style={{ paddingTop: 'var(--ios-safe-top, 0)' }}>
      <NavBar onBack={onBack} title="鉴定结果" rightElement={<Icon.More size={20} />} />
      
      {/* 判定结论 */}
      <div className="result-header fade-in-up">
        <div className="result-verdict">{archive.title}</div>
        <div className="result-verdict-en">{archive.eraDetail}</div>
        <div className="result-confidence">
          <span>置信度</span>
          <div className="confidence-bar">
            <div 
              className="confidence-bar-fill" 
              style={{ width: confidenceAnimated ? `${archive.confidence}%` : '0%' }}
            />
          </div>
          <span style={{ fontWeight: 600 }}>{archive.confidence}%</span>
        </div>
      </div>

      {/* 书影 */}
      <div className="result-book-image fade-in-up stagger-1">
        <img src={IMAGE_URLS[archive.imageIndex]} alt="" />
      </div>

      {/* 版本特征 */}
      <div className="result-features fade-in-up stagger-2">
        <div className="result-features-title">
          <Icon.Target size={16} color="var(--cinnabar)" />
          版式特征
        </div>
        <div className="feature-grid">
          {features.map((f, i) => (
            <div key={f.key} className="feature-item fade-in-up" style={{ animationDelay: `${0.25 + i * 0.05}s` }}>
              <div className="feature-item-label">{f.label}</div>
              <div className="feature-item-value">{archive.features[f.key]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 比对结果 */}
      <div className="result-comparison fade-in-up stagger-3">
        <div className="comparison-title">
          <Icon.Layers size={16} color="var(--cinnabar)" />
          版本比对
        </div>
        {archive.matchResults.map((m, i) => (
          <div 
            key={i} 
            className={`comparison-item rank-${m.rank} fade-in-up`}
            style={{ animationDelay: `${0.35 + i * 0.1}s` }}
          >
            <div className={`comparison-rank rank-${m.rank}`}>{m.rank}</div>
            <div className="comparison-info">
              <div className="comparison-name">{m.name}</div>
              <div className="comparison-era">{m.era}</div>
            </div>
            <div className="comparison-match">{m.match}%</div>
          </div>
        ))}
      </div>

      {/* 底部操作 */}
      <div className="result-actions">
        <button className="btn-secondary" onClick={onReScan}>
          <Icon.Scan size={16} />
          重新鉴定
        </button>
        <button 
          className="btn-primary" 
          onClick={handleSave}
          style={{ background: saved ? 'var(--success)' : undefined }}
        >
          {saved ? (
            <><Icon.Check size={18} /> 已存入档案</>
          ) : (
            <><Icon.Save size={16} /> 存入档案</>
          )}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 档案列表页
// ─────────────────────────────────────────────────────────────

function ArchiveScreen({ archives, onOpenDetail, onStartScan }) {
  const [filter, setFilter] = useState('all');
  
  const filters = [
    { id: 'all', label: '全部' },
    { id: 'song', label: '宋代' },
    { id: 'yuan', label: '元代' },
    { id: 'ming', label: '明代' },
    { id: 'qing', label: '清代' },
  ];

  const filtered = filter === 'all' 
    ? archives 
    : archives.filter(a => a.era.includes(filter === 'song' ? '宋' : filter === 'yuan' ? '元' : filter === 'ming' ? '明' : '清'));

  const byType = useMemo(() => {
    const count = {};
    archives.forEach(a => {
      const t = a.editionType;
      count[t] = (count[t] || 0) + 1;
    });
    return count;
  }, [archives]);

  const typeCount = Object.keys(byType).length;

  return (
    <div className="screen archive-page" style={{ paddingTop: 'var(--ios-safe-top, 0)' }}>
      <div style={{ padding: '8px 20px 0' }}>
        <h1 style={{
          fontFamily: '"Noto Serif SC", serif',
          fontSize: 28,
          fontWeight: 700,
          color: 'var(--ink-black)',
          margin: 0,
          letterSpacing: '0.1em',
        }}>鉴定档案</h1>
        <p style={{
          fontSize: 13,
          color: 'var(--ink-light)',
          marginTop: 4,
          marginBottom: 12,
        }}>共 {archives.length} 件鉴定记录</p>
      </div>

      {/* 统计 */}
      <div className="archive-stats" style={{ padding: '0 20px 16px' }}>
        <div className="archive-stat">
          <div className="archive-stat-num stat-accent">{archives.length}</div>
          <div className="archive-stat-label">总鉴定</div>
        </div>
        <div className="archive-stat">
          <div className="archive-stat-num">{typeCount}</div>
          <div className="archive-stat-label">版本类型</div>
        </div>
        <div className="archive-stat">
          <div className="archive-stat-num">{new Set(archives.map(a => a.era.replace(/代$/, '')).filter(Boolean)).size}</div>
          <div className="archive-stat-label">涉及朝代</div>
        </div>
      </div>

      {/* 筛选标签 */}
      <div className="filter-chips">
        {filters.map(f => (
          <div
            key={f.id}
            className={`filter-chip ${filter === f.id ? 'active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </div>
        ))}
      </div>

      {/* 档案列表 */}
      <div className="archive-list">
        {filtered.length === 0 ? (
          <div className="empty-state fade-in">
            <div className="empty-icon">
              <Icon.Bookmark size={40} />
            </div>
            <div className="empty-title">暂无鉴定记录</div>
            <div className="empty-desc">拍一张书影开始你的第一次鉴定</div>
            <button 
              className="btn-primary" 
              style={{ marginTop: 20, padding: '0 32px', flex: 'none' }}
              onClick={onStartScan}
            >
              <Icon.Camera size={16} />
              开始鉴定
            </button>
          </div>
        ) : (
          filtered.map((item, i) => (
            <div
              key={item.id}
              className="archive-item fade-in-up"
              style={{ animationDelay: `${i * 0.06}s` }}
              onClick={() => onOpenDetail(item)}
            >
              <div className="archive-item-thumb">
                <img src={IMAGE_URLS[item.imageIndex]} alt="" />
              </div>
              <div className="archive-item-info">
                <div>
                  <div className="archive-item-title">{item.title}</div>
                  <div className="archive-item-era">
                    {EDITION_TYPES[item.editionType.toUpperCase()]?.name || item.era}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="archive-item-date">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Icon.Clock size={11} color="var(--ink-faint)" />
                      {item.scannedAt}
                    </span>
                  </div>
                </div>
              </div>
              <div className="archive-item-badge">{item.confidence}%</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 档案详情页
// ─────────────────────────────────────────────────────────────

function ArchiveDetailScreen({ archive, onBack }) {
  if (!archive) return null;

  const editionInfo = EDITION_TYPES[archive.editionType.toUpperCase()];

  return (
    <div className="screen archive-detail" style={{ paddingTop: 'var(--ios-safe-top, 0)' }}>
      {/* 顶部导航 */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'transparent' }}>
        <NavBar 
          transparent 
          dark 
          onBack={onBack}
          rightElement={<Icon.More size={20} color="#fff" />}
          style={{ position: 'absolute' }}
        />
      </div>

      {/* Hero 图 */}
      <div className="detail-hero" style={{ marginTop: 'calc(var(--ios-safe-top, 0) * -1)' }}>
        <img src={IMAGE_URLS[archive.imageIndex]} alt="" />
        <div className="detail-hero-overlay" />
        <div className="detail-hero-title fade-in-up">
          <div className="name">{archive.title}</div>
          <div className="era">{archive.eraDetail} · {editionInfo?.name}</div>
        </div>
      </div>

      {/* 基本信息 */}
      <div className="detail-section fade-in-up stagger-1">
        <div className="detail-section-title">
          <Icon.Info size={16} color="var(--cinnabar)" />
          基本信息
        </div>
        <div className="detail-info-grid">
          <div className="detail-info-item">
            <span className="detail-info-label">版本类型</span>
            <span className="detail-info-value">{editionInfo?.name || '-'}</span>
          </div>
          <div className="detail-info-item">
            <span className="detail-info-label">朝代</span>
            <span className="detail-info-value">{archive.era}</span>
          </div>
          <div className="detail-info-item">
            <span className="detail-info-label">置信度</span>
            <span className="detail-info-value" style={{ color: 'var(--cinnabar)' }}>{archive.confidence}%</span>
          </div>
          <div className="detail-info-item">
            <span className="detail-info-label">鉴定日期</span>
            <span className="detail-info-value">{archive.scannedAt}</span>
          </div>
        </div>
      </div>

      {/* 版式特征 */}
      <div className="detail-section fade-in-up stagger-2">
        <div className="detail-section-title">
          <Icon.Target size={16} color="var(--cinnabar)" />
          版式特征
        </div>
        <div className="detail-info-grid">
          <div className="detail-info-item">
            <span className="detail-info-label">版框</span>
            <span className="detail-info-value">{archive.features.ban_kuang}</span>
          </div>
          <div className="detail-info-item">
            <span className="detail-info-label">鱼尾</span>
            <span className="detail-info-value">{archive.features.yu_wei}</span>
          </div>
          <div className="detail-info-item">
            <span className="detail-info-label">行款</span>
            <span className="detail-info-value">{archive.features.jie_hang}</span>
          </div>
          <div className="detail-info-item">
            <span className="detail-info-label">字体</span>
            <span className="detail-info-value">{archive.features.zi_ti}</span>
          </div>
          <div className="detail-info-item">
            <span className="detail-info-label">避讳</span>
            <span className="detail-info-value">{archive.features.bi_hui}</span>
          </div>
          <div className="detail-info-item">
            <span className="detail-info-label">纸张</span>
            <span className="detail-info-value">{archive.features.zhi_zhang}</span>
          </div>
        </div>
      </div>

      {/* 比对结果 */}
      <div className="detail-section fade-in-up stagger-3">
        <div className="detail-section-title">
          <Icon.Layers size={16} color="var(--cinnabar)" />
          比对结果
        </div>
        {archive.matchResults.map((m, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 0',
            borderBottom: i < archive.matchResults.length - 1 ? '1px solid rgba(45,36,25,0.06)' : 'none',
          }}>
            <div style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: m.rank === 1 ? 'var(--cinnabar)' : 'var(--ink-faint)',
              color: 'var(--xuan-paper-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 600,
              flexShrink: 0,
            }}>{m.rank}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: 'var(--ink-black)', fontWeight: 500 }}>{m.name}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-light)', marginTop: 2 }}>{m.era}</div>
            </div>
            <div style={{ 
              fontSize: 14, 
              fontWeight: 600, 
              color: m.rank === 1 ? 'var(--cinnabar)' : 'var(--ink-medium)',
            }}>{m.match}%</div>
          </div>
        ))}
      </div>

      {/* 鉴定备注 */}
      <div className="detail-section fade-in-up stagger-4">
        <div className="detail-section-title">
          <Icon.FileText size={16} color="var(--cinnabar)" />
          鉴定备注
        </div>
        <div className="detail-notes">{archive.notes}</div>
      </div>

      {/* 标签 */}
      <div className="detail-section fade-in-up stagger-5" style={{ paddingBottom: 40 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {archive.tags?.map((tag, i) => (
            <span key={i} style={{
              padding: '4px 10px',
              background: 'var(--cinnabar-faint)',
              color: 'var(--cinnabar)',
              borderRadius: 12,
              fontSize: 12,
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 知识页
// ─────────────────────────────────────────────────────────────

function KnowledgeScreen({ onBack }) {
  return (
    <div className="screen" style={{ 
      background: 'var(--xuan-paper)', 
      flexDirection: 'column',
      paddingTop: 'var(--ios-safe-top, 0)',
      overflowY: 'auto',
    }}>
      <NavBar onBack={onBack} title="版本学知识" />
      
      <div style={{ padding: '8px 20px 40px' }}>
        <h2 style={{
          fontFamily: '"Noto Serif SC", serif',
          fontSize: 24,
          fontWeight: 700,
          color: 'var(--ink-black)',
          margin: '8px 0 16px',
          letterSpacing: '0.1em',
        }}>版本学入门</h2>
        
        {KNOWLEDGE_ITEMS.map((item, i) => (
          <div 
            key={item.id} 
            className="knowledge-card fade-in-up"
            style={{ marginBottom: 12, animationDelay: `${i * 0.1}s` }}
          >
            <div style={{
              fontSize: 11,
              color: 'var(--cinnabar)',
              marginBottom: 4,
              letterSpacing: '0.1em',
              fontWeight: 500,
            }}>{item.category}</div>
            <div className="knowledge-title" style={{ marginBottom: 8 }}>{item.title}</div>
            <div className="knowledge-text" style={{
              display: 'block',
              WebkitLineClamp: 'unset',
            }}>{item.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 我的页
// ─────────────────────────────────────────────────────────────

function ProfileScreen({ onViewSpec, onViewApi }) {
  const menuItems = [
    { id: 'spec', title: '设计规范', desc: '查看组件与样式规范', icon: Icon.Settings },
    { id: 'api', title: '接口文档', desc: 'API 调用说明', icon: Icon.Code },
    { id: 'knowledge', title: '版本学知识', desc: '鉴定常识与术语', icon: Icon.Book },
    { id: 'about', title: '关于古籍鉴', desc: '版本 2.0.0', icon: Icon.Info },
  ];

  return (
    <div className="screen" style={{ 
      background: 'var(--xuan-paper)', 
      flexDirection: 'column',
      paddingTop: 'var(--ios-safe-top, 0)',
      overflowY: 'auto',
    }}>
      {/* 用户信息 */}
      <div style={{ padding: '20px 24px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'linear-gradient(145deg, var(--cinnabar), var(--cinnabar-dark))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--xuan-paper-light)',
          fontFamily: '"Noto Serif SC", serif',
          fontSize: 22,
          fontWeight: 600,
          boxShadow: '0 4px 12px rgba(179,57,46,0.3)',
        }}>藏</div>
        <div>
          <div style={{
            fontFamily: '"Noto Serif SC", serif',
            fontSize: 20,
            fontWeight: 600,
            color: 'var(--ink-black)',
          }}>云隐阁主人</div>
          <div style={{ fontSize: 13, color: 'var(--ink-light)', marginTop: 2 }}>
            版本鉴定 · 中级
          </div>
        </div>
      </div>

      {/* 统计卡 */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          padding: 16,
          background: 'var(--xuan-paper-light)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
        }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--cinnabar)', fontFamily: '"Noto Serif SC", serif' }}>6</div>
            <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>鉴定档案</div>
          </div>
          <div style={{ width: 1, background: 'rgba(45,36,25,0.08)' }} />
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink-black)', fontFamily: '"Noto Serif SC", serif' }}>4</div>
            <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>版本类型</div>
          </div>
          <div style={{ width: 1, background: 'rgba(45,36,25,0.08)' }} />
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink-black)', fontFamily: '"Noto Serif SC", serif' }}>92%</div>
            <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>平均置信度</div>
          </div>
        </div>
      </div>

      {/* 菜单列表 */}
      <div style={{ padding: '0 20px 40px' }}>
        <div style={{
          background: 'var(--xuan-paper-light)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}>
          {menuItems.map((item, i) => {
            const I = item.icon;
            return (
              <div 
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 16px',
                  borderBottom: i < menuItems.length - 1 ? '1px solid rgba(45,36,25,0.06)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onClick={() => {
                  if (item.id === 'spec') onViewSpec && onViewSpec();
                  if (item.id === 'api') onViewApi && onViewApi();
                }}
              >
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: 'var(--xuan-paper)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--cinnabar)',
                }}>
                  <I size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, color: 'var(--ink-black)' }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-light)', marginTop: 2 }}>{item.desc}</div>
                </div>
                <Icon.Chevron size={16} color="var(--ink-faint)" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 设计规范页
// ─────────────────────────────────────────────────────────────

function DesignSpecScreen({ onBack }) {
  return (
    <div className="screen spec-page" style={{ paddingTop: 'var(--ios-safe-top, 0)' }}>
      <NavBar onBack={onBack} title="设计规范" />
      
      {/* 设计理念 */}
      <div className="spec-section fade-in-up">
        <div className="spec-section-title">设计理念</div>
        <p style={{
          fontSize: 13,
          color: 'var(--ink-medium)',
          lineHeight: 1.8,
          margin: 0,
        }}>
          以宣纸、墨色、朱砂为视觉基调，将古籍版本学的文雅厚重融入现代 App 交互。
          核心是「拍书影→识别→判定→归档」的完整工具流，而非浏览型图鉴。
        </p>
      </div>

      {/* 色彩系统 */}
      <div className="spec-section fade-in-up stagger-1">
        <div className="spec-section-title">色彩系统</div>
        <div className="color-swatch-row">
          {DESIGN_SPECS.colors.map((c, i) => (
            <div key={i} className="color-swatch">
              <div className="color-swatch-circle" style={{ background: c.hex }} />
              <div className="color-swatch-name">{c.name}</div>
              <div className="color-swatch-hex">{c.hex}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 字体系统 */}
      <div className="spec-section fade-in-up stagger-2">
        <div className="spec-section-title">字体系统</div>
        <div className="font-display">
          <div className="font-label">展示字体 · Noto Serif SC</div>
          <div className="font-display-large">古籍版本鉴定</div>
        </div>
        <div className="font-display">
          <div className="font-label">正文</div>
          <div className="font-display-body">
            宋刻本字体典雅，为历代藏书家所重。版本鉴定需综合考察版框、鱼尾、界行、字体、避讳字、纸张等多重特征。
          </div>
        </div>
      </div>

      {/* 间距系统 */}
      <div className="spec-section fade-in-up stagger-3">
        <div className="spec-section-title">间距系统</div>
        {DESIGN_SPECS.spacing.map((s, i) => (
          <div key={s.name} className="spacing-row">
            <span className="spacing-label">{s.name}</span>
            <div className="spacing-bar" style={{ width: s.value * 2 }} />
            <span className="spacing-value">{s.value}px</span>
          </div>
        ))}
      </div>

      {/* 组件清单 */}
      <div className="spec-section fade-in-up stagger-4">
        <div className="spec-section-title">组件清单</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {DESIGN_SPECS.components.map((c, i) => (
            <span key={i} style={{
              padding: '6px 12px',
              background: 'var(--xuan-paper-light)',
              borderRadius: 12,
              fontSize: 12,
              color: 'var(--ink-dark)',
              border: '1px solid rgba(45,36,25,0.08)',
            }}>{c}</span>
          ))}
        </div>
      </div>

      {/* 动效清单 */}
      <div className="spec-section fade-in-up stagger-5">
        <div className="spec-section-title">动效系统（12+）</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {DESIGN_SPECS.animations.map((a, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 12px',
              background: 'var(--xuan-paper-light)',
              borderRadius: 'var(--radius-sm)',
            }}>
              <div style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: 'var(--cinnabar-faint)',
                color: 'var(--cinnabar)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 600,
                flexShrink: 0,
              }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: 'var(--ink-black)', fontWeight: 500 }}>{a.name}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-light)', marginTop: 2 }}>{a.purpose}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// API 文档页
// ─────────────────────────────────────────────────────────────

function ApiDocsScreen({ onBack }) {
  const [expanded, setExpanded] = useState(null);

  const methodClass = (method) => {
    switch (method) {
      case 'GET': return 'get';
      case 'POST': return 'post';
      case 'PUT': return 'put';
      case 'DELETE': return 'delete';
      default: return 'get';
    }
  };

  return (
    <div className="screen api-page" style={{ paddingTop: 'var(--ios-safe-top, 0)' }}>
      <NavBar onBack={onBack} title="接口文档" />
      
      <div style={{ padding: '12px 20px 16px' }}>
        <p style={{
          fontSize: 13,
          color: 'var(--ink-medium)',
          lineHeight: 1.7,
          margin: 0,
        }}>
          古籍鉴 App 的后端 API 基于 RESTful 设计。所有接口返回 JSON 格式数据。
        </p>
      </div>

      {API_ENDPOINTS.map((ep, i) => (
        <div 
          key={i} 
          className="api-endpoint fade-in-up"
          style={{ animationDelay: `${i * 0.05}s` }}
          onClick={() => setExpanded(expanded === i ? null : i)}
        >
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <span className={`api-method ${methodClass(ep.method)}`}>{ep.method}</span>
            <span className="api-path">{ep.path}</span>
          </div>
          <div className="api-desc">{ep.description}</div>
          
          {expanded === i && (
            <div className="api-params" style={{ animation: 'fadeInUp 0.3s var(--ease-out)' }}>
              {ep.params.length > 0 && (
                <>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-dark)', marginBottom: 8 }}>
                    参数
                  </div>
                  {ep.params.map((p, j) => (
                    <div key={j} className="api-param-row">
                      <span className="api-param-name">{p.name}</span>
                      <span className="api-param-type">{p.type}</span>
                      <span className="api-param-desc">{p.desc}</span>
                    </div>
                  ))}
                </>
              )}
              <div style={{ 
                marginTop: ep.params.length > 0 ? 12 : 0,
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--ink-dark)',
                marginBottom: 6,
              }}>返回</div>
              <div style={{
                fontSize: 11,
                color: 'var(--indigo)',
                fontFamily: 'monospace',
                background: 'var(--xuan-paper)',
                padding: 8,
                borderRadius: 4,
                lineHeight: 1.5,
              }}>
                {ep.response}
              </div>
            </div>
          )}
        </div>
      ))}
      
      <div style={{ height: 40 }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 导出到 window
// ─────────────────────────────────────────────────────────────

Object.assign(window, {
  SplashScreen,
  HomeScreen,
  CameraScreen,
  ScanScreen,
  ResultScreen,
  ArchiveScreen,
  ArchiveDetailScreen,
  KnowledgeScreen,
  ProfileScreen,
  DesignSpecScreen,
  ApiDocsScreen,
  IMAGE_URLS,
});
