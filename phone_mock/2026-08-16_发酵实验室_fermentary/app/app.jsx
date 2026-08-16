// ── 主应用组件 ──

function App({ defaults }) {
  const [t, setTweak] = useTweaks(defaults);

  // Page state
  const [page, setPage] = React.useState('home'); // home / detail / new / notes / explore / me / design / api
  const [selectedBatchId, setSelectedBatchId] = React.useState(null);
  const [tab, setTab] = React.useState('home');

  const [batches, setBatches] = React.useState(FERMENT_BATCHES);

  const goToBatch = (id) => {
    setSelectedBatchId(id);
    setPage('detail');
  };

  const handleTabChange = (newTab) => {
    if (newTab === 'new') {
      setPage('new');
      return;
    }
    setTab(newTab);
    setPage(newTab);
  };

  const goBack = () => {
    // Return to previous page/tab
    if (page === 'detail' || page === 'design' || page === 'api' || page === 'new') {
      setPage(tab);
    } else {
      setPage('home');
      setTab('home');
    }
  };

  const handleNewBatchSubmit = () => {
    // Simulate creating a new batch
    const newBatch = {
      id: 'b' + Date.now(),
      type: 'sourdough',
      name: '新建批次 · 酸种面包',
      recipe: '基础配方',
      startAt: Date.now(),
      currentStage: 'starter',
      progress: 0.01,
      flavor: [],
      notes: '',
      temp: 26,
      targetTemp: 26,
      ph: 5.5,
      activity: 'medium',
      totalStages: 10,
    };
    setBatches(prev => [newBatch, ...prev]);
    setSelectedBatchId(newBatch.id);
    setPage('detail');
  };

  const selectedBatch = batches.find(b => b.id === selectedBatchId);

  // Which pages show bottom tab bar
  const showTabBar = ['home', 'notes', 'explore', 'me'].includes(page);

  const dark = t.dark;

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomePage batches={batches} onBatchClick={goToBatch} onNewBatch={() => setPage('new')} dark={dark} t={t} />;
      case 'detail':
        return selectedBatch ? (
          <DetailPage batch={selectedBatch} onBack={goBack} dark={dark} t={t} />
        ) : null;
      case 'new':
        return <NewBatchPage onBack={goBack} onSubmit={handleNewBatchSubmit} dark={dark} t={t} />;
      case 'notes':
        return <NotesPage notes={FLAVOR_NOTES} batches={batches} dark={dark} t={t} />;
      case 'explore':
        return <ExplorePage recipes={RECIPES} dark={dark} t={t} />;
      case 'me':
        return (
          <MePage
            stats={USER_STATS}
            onGoToDesign={() => setPage('design')}
            onGoToApi={() => setPage('api')}
            dark={dark}
            t={t}
          />
        );
      case 'design':
        return <DesignSystemPage onBack={goBack} dark={dark} t={t} />;
      case 'api':
        return <ApiDocPage onBack={goBack} dark={dark} t={t} />;
      default:
        return null;
    }
  };

  return (
    <>
      <EffectStyles />
      <div style={{
        position: 'relative',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        width: '100%', height: '100%',
        gap: 24,
      }}>
        {/* Title / Caption */}
        <div style={{
          position: 'absolute', top: 28, left: 0, right: 0,
          textAlign: 'center', pointerEvents: 'none',
        }}>
          <div style={{
            fontSize: 11, color: 'rgba(247,242,233,0.35)',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            marginBottom: 4,
          }}>
            Arc 每日设计 Mock · V2
          </div>
          <div className="serif" style={{
            fontSize: 20, fontWeight: 600, color: '#F7F2E9',
            letterSpacing: '0.02em',
          }}>
            发酵实验室 <span style={{ color: '#D9A441' }}>· Fermentary</span>
          </div>
        </div>

        {/* Phone frame */}
        <div style={{
          marginTop: 70,
          filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.5))',
        }}>
          <IOSDevice dark={dark} width={390} height={844}>
            <div style={{
              position: 'relative',
              height: '100%',
              background: dark ? '#14100C' : '#F7F2E9',
            }}>
              <React.Fragment key={page}>
                {renderPage()}
              </React.Fragment>
              {showTabBar && (
                <BottomTabBar
                  active={tab}
                  onChange={handleTabChange}
                  dark={dark}
                />
              )}
            </div>
          </IOSDevice>
        </div>

        {/* Bottom label */}
        <div style={{
          fontSize: 11, color: 'rgba(247,242,233,0.25)',
          letterSpacing: '0.04em',
          paddingBottom: 8,
        }}>
          奶油白 · 深可可 · 黄油暖黄 · 8 个页面 · 12+ 动效
        </div>
      </div>

      {/* Tweaks Panel */}
      <TweaksPanel title="风格">
        <TweakSection label="色彩" />
        <TweakColor
          label="黄油暖黄"
          value={t.butter}
          options={['#D9A441', '#E8B84C', '#C48A3D', '#B87333']}
          onChange={(v) => setTweak('butter', v)}
        />
        <TweakColor
          label="焦糖棕"
          value={t.accent}
          options={['#B87333', '#A67C52', '#8B5A2B', '#6B4423']}
          onChange={(v) => setTweak('accent', v)}
        />
        <TweakColor
          label="奶白 / 可可"
          value={[t.cream, t.cocoa]}
          options={[
            ['#F7F2E9', '#2B1D16'],
            ['#EDE4D3', '#1A130E'],
            ['#FFF8EE', '#3D2B1F'],
          ]}
          onChange={(v) => setTweak({ cream: v[0], cocoa: v[1] })}
        />

        <TweakSection label="动效" />
        <TweakSlider
          label="面团呼吸幅度"
          value={t.doughScale}
          min={1.0}
          max={1.15}
          step={0.01}
          unit="x"
          onChange={(v) => setTweak('doughScale', v)}
        />
        <TweakSlider
          label="气泡活性倍率"
          value={t.bubbleRate}
          min={0.3}
          max={2.5}
          step={0.1}
          unit="x"
          onChange={(v) => setTweak('bubbleRate', v)}
        />
        <TweakSlider
          label="整体速度"
          value={t.speed}
          min={0.5}
          max={3}
          step={0.1}
          unit="x"
          onChange={(v) => setTweak('speed', v)}
        />

        <TweakSection label="模式" />
        <TweakToggle
          label="深色模式"
          value={t.dark}
          onChange={(v) => setTweak('dark', v)}
        />
      </TweaksPanel>
    </>
  );
}
