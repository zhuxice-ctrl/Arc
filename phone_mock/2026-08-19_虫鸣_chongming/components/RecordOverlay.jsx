// 录音覆盖层：声波动效 + 签名时刻

function RecordOverlay({ isRecording, seconds, phase, onComplete, onCancel }) {
  const [bars, setBars] = React.useState(() =>
    Array(32).fill(8)
  );
  const [fireflies, setFireflies] = React.useState([]);
  const rafRef = React.useRef(null);
  const visibleRef = React.useRef(true);

  // 声波波动：用 requestAnimationFrame
  React.useEffect(() => {
    if (!isRecording || phase !== 'recording') return;

    let lastTime = 0;
    function animate(time) {
      if (!visibleRef.current) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      if (time - lastTime > 80) {
        lastTime = time;
        setBars(prev => prev.map(() => 8 + Math.random() * 60));
      }
      rafRef.current = requestAnimationFrame(animate);
    }
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isRecording, phase]);

  // 页面可见性：暂停动画
  React.useEffect(() => {
    function onVisibilityChange() {
      visibleRef.current = !document.hidden;
    }
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  // 识别完成瞬间：声波化作流萤四散（签名动效）
  React.useEffect(() => {
    if (phase === 'analyzing' && fireflies.length === 0) {
      // 生成 20 只萤火虫
      const count = 20;
      const flies = [];
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
        const dist = 120 + Math.random() * 100;
        flies.push({
          id: i,
          tx: Math.cos(angle) * dist,
          ty: Math.sin(angle) * dist,
          delay: Math.random() * 0.3
        });
      }
      setFireflies(flies);
    }
  }, [phase]);

  if (!isRecording) return null;

  const timeStr = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <div className="record-overlay">
      {/* 流萤四散 */}
      {phase === 'analyzing' && (
        <div className="firefly-burst">
          {fireflies.map(f => (
            <span
              key={f.id}
              style={{
                left: '50%',
                top: '50%',
                '--tx': `${f.tx}px`,
                '--ty': `${f.ty}px`,
                animationDelay: `${f.delay}s`
              }}
            />
          ))}
        </div>
      )}

      {phase === 'recording' && (
        <>
          <div className="record-overlay-title">正在聆听…</div>
          <div className="record-overlay-timer">{timeStr}</div>

          {/* 声波 */}
          <div className="sound-wave">
            {bars.map((h, i) => (
              <div
                key={i}
                className="sound-bar"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>

          <div className="record-overlay-hint">请保持安静，对准虫鸣方向</div>
          <div style={{
            marginTop: '24px',
            fontSize: '12px',
            color: 'var(--moon-400)',
            padding: '8px 20px',
            border: '1px solid rgba(51, 64, 89, 0.5)',
            borderRadius: '20px',
            cursor: 'pointer'
          }} onClick={onCancel}>
            取消
          </div>
        </>
      )}

      {phase === 'analyzing' && (
        <>
          <div className="record-overlay-title" style={{ marginBottom: '24px' }}>
            识别中…
          </div>
          <div className="signature-moment">
            <div className="sig-firefly" />
          </div>
          <div style={{
            position: 'absolute',
            bottom: '25%',
            fontSize: '12px',
            color: 'var(--moon-300)',
            letterSpacing: '0.1em'
          }}>
            声纹比对中
          </div>
        </>
      )}
    </div>
  );
}

window.RecordOverlay = RecordOverlay;
