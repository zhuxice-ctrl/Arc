/* =========================================================
   Caves — 洞窟展厅
   卡片 3D 倾斜（磁性反平方引力）+ 法线高光扫过
   ========================================================= */

const { useEffect, useRef } = React;

const CAVE_IMG = '/spark/app/app_17c7ssvjn08/runtime/api/v1/storage/object/bucket_aadkqgfafgseo_static/static%2Faadkqf5tlggkw_ve_miaoda';

const CAVES = [
  { id: 'cave-257', num: '第 257 窟', title: '九色鹿王本生', dynasty: '北魏 · 十六国晚期', size: 'large' },
  { id: 'cave-320', num: '第 320 窟', title: '飞天反弹琵琶', dynasty: '盛唐 · 开元年间', size: 'medium' },
  { id: 'cave-285', num: '第 285 窟', title: '五百强盗成佛', dynasty: '西魏 · 大统年间', size: 'medium' },
  { id: 'cave-112', num: '第 112 窟', title: '不空羂索观音', dynasty: '中唐 · 吐蕃时期', size: 'small' },
  { id: 'cave-057', num: '第 57 窟', title: '美人菩萨', dynasty: '初唐 · 贞观年间', size: 'small' },
  { id: 'cave-148', num: '第 148 窟', title: '涅槃经变', dynasty: '盛唐 · 大历年间', size: 'small' },
  { id: 'cave-003', num: '第 3 窟', title: '千手千眼观音', dynasty: '元代 · 至正年间', size: 'small' },
];

function CaveCard({ cave, index }) {
  const cardRef = useRef(null);
  const innerRef = useRef(null);
  const glossRef = useRef(null);

  useEffect(() => {
    if (DH.prefersReducedMotion()) return;
    const card = cardRef.current;
    const inner = innerRef.current;
    const gloss = glossRef.current;
    if (!card || !inner || !gloss) return;

    let targetRX = 0, targetRY = 0;
    let currentRX = 0, currentRY = 0;
    let targetGlossX = 50, targetGlossY = 50;
    let currentGlossX = 50, currentGlossY = 50;
    let rafId = null;
    let active = false;
    let paused = false;
    const MAX_TILT = 12; // 最大倾斜角度

    const onVisibility = () => {
      if (document.hidden) {
        paused = true;
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      } else {
        paused = false;
        if (active) tick();
      }
    };

    const onMove = DH.rafThrottle((e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;  // 0-1
      const py = (e.clientY - rect.top) / rect.height;  // 0-1

      // 磁性反平方：偏离中心越远，倾斜越大，但带阻尼衰减
      const dx = px - 0.5;
      const dy = py - 0.5;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const strength = Math.min(1, dist * 2); // 0-1

      targetRY = dx * MAX_TILT * 2 * strength;   // 水平位移 -> 绕 Y 轴
      targetRX = -dy * MAX_TILT * 2 * strength;  // 垂直位移 -> 绕 X 轴

      targetGlossX = px * 100;
      targetGlossY = py * 100;
    });

    const onEnter = () => {
      active = true;
      if (!rafId) tick();
    };

    const onLeave = () => {
      active = false;
      targetRX = 0;
      targetRY = 0;
      targetGlossX = 50;
      targetGlossY = 50;
    };

    function tick() {
      if (paused) { rafId = null; return; }
      // lerp 逼近
      currentRX += (targetRX - currentRX) * 0.12;
      currentRY += (targetRY - currentRY) * 0.12;
      currentGlossX += (targetGlossX - currentGlossX) * 0.15;
      currentGlossY += (targetGlossY - currentGlossY) * 0.15;

      inner.style.transform = `rotateX(${currentRX}deg) rotateY(${currentRY}deg)`;
      gloss.style.background = `radial-gradient(circle at ${currentGlossX}% ${currentGlossY}%, rgba(255, 230, 180, 0.35) 0%, transparent 50%)`;
      gloss.style.opacity = active ? '1' : Math.max(0, parseFloat(gloss.style.opacity || 0) - 0.03);

      // 接近归零且未激活时停止
      if (!active && Math.abs(currentRX) < 0.05 && Math.abs(currentRY) < 0.05) {
        inner.style.transform = 'rotateX(0) rotateY(0)';
        rafId = null;
        return;
      }
      rafId = requestAnimationFrame(tick);
    }

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mouseleave', onLeave);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseenter', onEnter);
      card.removeEventListener('mouseleave', onLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const sizeClass =
    cave.size === 'large' ? 'large' :
    cave.size === 'medium' ? 'medium' : 'small';

  return (
    <div
      className={`cave-card ${sizeClass} reveal`}
      ref={cardRef}
      data-interactive="true"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="card-inner" ref={innerRef}>
        <div className="card-img">
          <img src={CAVE_IMG} alt={cave.title} loading="lazy" />
        </div>
        <div className="card-overlay"></div>
        <div className="card-gloss" ref={glossRef}></div>
        <div className="card-info">
          <div className="card-num">{cave.num}</div>
          <h3 className="card-title">{cave.title}</h3>
          <div className="card-dynasty">{cave.dynasty}</div>
        </div>
      </div>
    </div>
  );
}

function Caves() {
  return (
    <section className="section caves" id="caves" data-screen-label="caves">
      <div className="container">
        <div className="section-head reveal">
          <div className="section-eyebrow">
            <span className="num">01</span>
            <span>·</span>
            <span>洞窟展厅</span>
          </div>
          <h2 className="section-title">七座代表性洞窟<br />一步一千年</h2>
          <p className="section-desc">
            从北魏到元代，精选莫高窟七座标志性洞窟，以超高清数字扫描重现壁画细节。
            每一处矿物颜料的斑驳、每一条线条的起伏，都被完整留存。
          </p>
        </div>

        <div className="caves-grid">
          {CAVES.map((cave, i) => (
            <CaveCard key={cave.id} cave={cave} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

window.Caves = Caves;
