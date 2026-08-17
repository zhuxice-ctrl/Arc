// Prescriptions Page - Stacked cards with swipe
const PrescriptionsPage = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [dragX, setDragX] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [contextMenu, setContextMenu] = React.useState(null);
  const startX = React.useRef(0);
  const cardRef = React.useRef(null);
  const longPressTimer = React.useRef(null);

  const handleTouchStart = (e) => {
    startX.current = e.touches ? e.touches[0].clientX : e.clientX;
    setIsDragging(true);

    // Long press detection
    longPressTimer.current = setTimeout(() => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        setContextMenu({
          x: startX.current,
          y: rect.top + 80,
          prescription: PRESCRIPTIONS[currentIndex]
        });
      }
    }, 500);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const delta = clientX - startX.current;
    setDragX(delta);

    // Cancel long press if moved too much
    if (Math.abs(delta) > 10 && longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    setIsDragging(false);
    if (dragX > 80 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (dragX < -80 && currentIndex < PRESCRIPTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    setDragX(0);
  };

  const closeContextMenu = () => setContextMenu(null);

  const renderStackedCards = () => {
    const cards = [];
    const maxVisible = 3;

    for (let i = Math.min(currentIndex + maxVisible - 1, PRESCRIPTIONS.length - 1); i >= currentIndex; i--) {
      const offset = i - currentIndex;
      const rx = PRESCRIPTIONS[i];
      let translateX = 0;
      let translateY = offset * 12;
      let scale = 1 - offset * 0.04;
      let opacity = 1 - offset * 0.3;

      if (offset === 0) {
        translateX = dragX;
        const rotate = dragX * 0.03;
        return (
          <div
            key={rx.id}
            ref={cardRef}
            className="rx-card"
            style={{
              transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
              opacity: opacity,
              zIndex: 10 - offset
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseMove={isDragging ? handleTouchMove : undefined}
            onMouseUp={handleTouchEnd}
            onMouseLeave={isDragging ? handleTouchEnd : undefined}
          >
            <div className="rx-card-header">
              <h2 className="rx-name">{rx.name}</h2>
              <span className="rx-classic-tag">{rx.classic}</span>
            </div>
            <p className="rx-source">{rx.source}</p>
            <div className="rx-herbs">
              {rx.herbs.map((h, idx) => (
                <span key={idx} className="rx-herb-chip">
                  <span className="dot" />
                  {h}
                </span>
              ))}
            </div>
            <div className="rx-effect">
              <strong>功能主治</strong>
              {rx.effect}
            </div>
            <div className="rx-usage">
              <span style={{ color: 'var(--warm-wood)', fontWeight: 600 }}>用法：</span>
              {rx.usage}
            </div>
          </div>
        );
      }

      cards.push(
        <div
          key={rx.id}
          className="rx-card"
          style={{
            transform: `translateY(${translateY}px) scale(${scale})`,
            opacity: opacity,
            zIndex: 10 - offset,
            pointerEvents: 'none'
          }}
        >
          <div className="rx-card-header">
            <h2 className="rx-name">{rx.name}</h2>
          </div>
        </div>
      );
    }

    return cards;
  };

  return (
    <div className="screen" id="screen-prescriptions">
      <div className="large-nav">
        <div className="nav-inner">
          <h1>药方</h1>
        </div>
      </div>
      <div className="scroll-content">
        <div style={{ padding: '0 20px 12px' }}>
          <p style={{ fontSize: 13, color: 'var(--gray-brown)', lineHeight: 1.6 }}>
            精选经典名方，传承千年智慧。长按卡片可快捷操作。
          </p>
        </div>

        <div className="prescription-stack" style={{ minHeight: 460 }}>
          {renderStackedCards()}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '16px 0' }}>
          {PRESCRIPTIONS.map((_, idx) => (
            <div
              key={idx}
              className={`rx-dot ${idx === currentIndex ? 'active' : ''}`}
            />
          ))}
        </div>

        <p className="rx-hint">← 左右滑动切换药方 →</p>
        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--gray-brown)', marginTop: 4, opacity: 0.6 }}>
          长按卡片显示快捷操作
        </p>

        {/* Long press context menu */}
        {contextMenu && (
          <>
            <div className="context-overlay" onClick={closeContextMenu} />
            <div
              className="context-menu"
              style={{
                left: Math.min(contextMenu.x, 200),
                top: contextMenu.y
              }}
            >
              <div className="context-menu-item" onClick={closeContextMenu}>
                <span>📖</span> 查看详情
              </div>
              <div className="context-menu-item" onClick={closeContextMenu}>
                <span>⭐</span> 收藏药方
              </div>
              <div className="context-menu-item" onClick={closeContextMenu}>
                <span>🔖</span> 加入学习计划
              </div>
              <div className="context-menu-item" onClick={closeContextMenu}>
                <span>📤</span> 分享
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { PrescriptionsPage });
