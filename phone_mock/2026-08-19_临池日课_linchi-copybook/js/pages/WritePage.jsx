// 临写页 - 核心书写画布
function WritePage({ onBack, onCompare }) {
  const canvasRef = React.useRef(null);
  const [state, setState] = React.useState(window.LINCHI_STORE.getState());
  const [showGuide, setShowGuide] = React.useState(true);
  const [guideOpacity, setGuideOpacity] = React.useState(0.15);
  const [strokeCount, setStrokeCount] = React.useState(0);

  const stele = window.LINCHI_DATA.steles.find(s => s.id === state.currentSteleId);
  const charInfo = stele?.characters.find(c => c.char === state.currentChar);

  function handleClear() {
    if (canvasRef.current) {
      canvasRef.current.clear();
      setStrokeCount(0);
    }
  }

  function handleUndo() {
    if (canvasRef.current) {
      canvasRef.current.undo();
      const strokes = canvasRef.current.getStrokes();
      setStrokeCount(strokes.length);
    }
  }

  function handleComplete() {
    const strokes = canvasRef.current?.getStrokes() || [];
    if (strokes.length === 0) {
      window.showToast('请先书写一个字');
      return;
    }
    const imageData = canvasRef.current.getImageData();
    // 保存到 store，进入叠影对比
    const result = window.LINCHI_STORE.completeWriting({
      imageData,
      score: null, // 让 completeWriting 计算
    });
    window.showToast('已收入集字墙');
    onCompare();
  }

  // 监听 canvas 笔画变化（通过轮询或者点击按钮时刷新）
  // 简化：每次 touch/mouse 事件后更新
  React.useEffect(() => {
    // 初始计数为 0
    setStrokeCount(0);
  }, [state.currentChar]);

  return (
    <div className="page" style={{ background: '#1a1714' }}>
      {/* 状态栏 */}
      <div className="status-bar">
        <span>9:41</span>
        <div className="right">
          <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
            <rect x="0" y="8" width="3" height="4" rx="1" />
            <rect x="5" y="5" width="3" height="7" rx="1" />
            <rect x="10" y="2" width="3" height="10" rx="1" />
            <rect x="15" y="0" width="3" height="12" rx="1" />
          </svg>
          <div className="battery"><span></span></div>
        </div>
      </div>

      {/* 导航栏 */}
      <div className="nav-bar">
        <button className="nav-btn" onClick={onBack}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="title" style={{ fontSize: '16px' }}>临写 · {state.currentChar}</div>
        <button
          className="nav-btn"
          style={{ fontSize: '14px', width: 'auto', padding: '0 4px', color: '#b06a3b' }}
          onClick={handleComplete}
        >
          完成
        </button>
      </div>

      {/* 字信息条 */}
      <div style={{
        padding: '0 20px 12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: '12px', color: '#8a8278' }}>{stele?.name} · {stele?.author}</div>
          <div style={{ fontSize: '13px', color: '#c8c0b0', marginTop: '2px' }}>{charInfo?.meaning}</div>
        </div>
        <div className="chip">{strokeCount > 0 ? `${strokeCount} 笔` : '落笔'}</div>
      </div>

      {/* 书写区 */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 16px',
      }}>
        <div
          style={{
            position: 'relative',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
            overflow: 'hidden',
          }}
        >
          <BrushCanvas
            ref={canvasRef}
            character={state.currentChar}
            showGuide={showGuide}
            guideOpacity={guideOpacity}
            size={320}
            onStrokeChange={setStrokeCount}
          />
          {/* 笔画计数变化时更新 - 用一个隐藏的机制 */}
          <StrokeCounterSetter canvasRef={canvasRef} onChange={setStrokeCount} />
        </div>

        <div style={{ fontSize: '12px', color: '#5a5249', marginTop: '12px' }}>
          用鼠标或手指在纸上书写，速度慢处笔触粗
        </div>
      </div>

      {/* 底部工具区（Thumb Zone） */}
      <div style={{
        padding: '12px 20px 32px',
        background: '#1a1714',
        borderTop: '0.5px solid rgba(236,229,216,0.08)',
      }}>
        {/* 参考字透明度滑杆 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#c8c0b0' }}>原帖透明度</span>
            <span style={{ fontSize: '12px', color: '#8a8278' }}>{Math.round(guideOpacity * 100)}%</span>
          </div>
          <input
            type="range"
            className="slider"
            min="0"
            max="0.5"
            step="0.01"
            value={guideOpacity}
            onChange={e => setGuideOpacity(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        {/* 操作按钮行 */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn btn-secondary"
            style={{ flex: 1, height: '48px', fontSize: '15px' }}
            onClick={handleUndo}
          >
            ↶ 撤销
          </button>
          <button
            className="btn btn-secondary"
            style={{ flex: 1, height: '48px', fontSize: '15px' }}
            onClick={handleClear}
          >
            重写
          </button>
          <button
            className="btn btn-primary"
            style={{ flex: 1.5, height: '48px', fontSize: '15px' }}
            onClick={handleComplete}
          >
            完成临写
          </button>
        </div>

        {/* 辅助开关 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px', gap: '16px' }}>
          <button
            onClick={() => setShowGuide(!showGuide)}
            style={{
              background: 'transparent',
              border: 'none',
              color: showGuide ? '#b06a3b' : '#7a7268',
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span style={{
              width: '14px', height: '14px', borderRadius: '3px',
              border: `1px solid ${showGuide ? '#b06a3b' : '#5a5249'}`,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '10px',
            }}>
              {showGuide ? '✓' : ''}
            </span>
            显示原帖
          </button>
          <button
            onClick={() => canvasRef.current?.replay()}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#7a7268',
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            ▶ 回放
          </button>
        </div>
      </div>
    </div>
  );
}

// 辅助组件：轮询 canvas 的笔画数，更新到父组件
function StrokeCounterSetter({ canvasRef, onChange }) {
  const lastCountRef = React.useRef(0);

  React.useEffect(() => {
    let rafId;
    function check() {
      if (canvasRef.current) {
        const count = canvasRef.current.getStrokes().length;
        if (count !== lastCountRef.current) {
          lastCountRef.current = count;
          onChange(count);
        }
      }
      rafId = requestAnimationFrame(check);
    }
    rafId = requestAnimationFrame(check);
    return () => cancelAnimationFrame(rafId);
  }, [canvasRef, onChange]);

  return null;
}

window.WritePage = WritePage;
