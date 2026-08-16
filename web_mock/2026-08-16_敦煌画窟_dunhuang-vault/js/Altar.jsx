/* =========================================================
   Altar — 数字档案统计区
   弹簧 Hooke 缓动数字计数
   ========================================================= */

const { useEffect, useRef, useState } = React;

const STATS = [
  { value: 735, suffix: '', unit: '窟', label: '数字化洞窟', sub: '覆盖北凉至元代' },
  { value: 45000, suffix: '+', unit: '㎡', label: '壁画面积', sub: '超高清扫描' },
  { value: 2400, suffix: '+', unit: '身', label: '彩塑造像', sub: '三维重建存档' },
  { value: 1650, suffix: '', unit: '年', label: '跨越历史', sub: '公元 366 — 2016' },
];

function StatNumber({ target, duration = 1800, start }) {
  const numRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!start || startedRef.current) return;
    startedRef.current = true;
    if (DH.prefersReducedMotion()) {
      numRef.current.textContent = target;
      return;
    }

    // 弹簧缓动计数（使用统一循环管理）
    const spring = DH.makeSpring(0, 6, 1.8); // k=6, d=1.8
    const startTime = performance.now();
    let elapsed = 0;
    const token = `stat-${target}-${Math.random().toString(36).slice(2, 8)}`;

    DH.startLoop(token, (dt) => {
      elapsed += dt;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const dynamicTarget = target * eased;

      DH.springStep(spring, dynamicTarget, spring._k, spring._d, dt);
      const display = Math.round(spring.x);
      if (numRef.current) {
        numRef.current.textContent = display.toLocaleString();
      }

      if (progress >= 1 && Math.abs(spring.v) < 0.1 && Math.abs(target - spring.x) < 0.5) {
        if (numRef.current) numRef.current.textContent = target.toLocaleString();
        DH.stopLoop(token);
      }
    });
    return () => {
      DH.stopLoop(token);
    };
  }, [start, target, duration]);

  return <span ref={numRef}>0</span>;
}

function Altar() {
  const [started, setStarted] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !('IntersectionObserver' in window)) {
      setStarted(true);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      });
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="section altar" id="altar" ref={sectionRef} data-screen-label="altar">
      <div className="container">
        <div className="section-head reveal" style={{ textAlign: 'center', margin: '0 auto 64px' }}>
          <div className="section-eyebrow" style={{ justifyContent: 'center' }}>
            <span className="num">04</span>
            <span>·</span>
            <span>数字档案</span>
          </div>
          <h2 className="section-title">千年石窟<br />以数字永存</h2>
        </div>

        <div className="altar-stats">
          {STATS.map((stat, i) => (
            <div key={stat.label} className={`altar-stat reveal delay-${i}`}>
              <div className="stat-num">
                <StatNumber target={stat.value} start={started} />
                <span className="unit">{stat.unit}{stat.suffix}</span>
              </div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-sub">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

window.Altar = Altar;
