/* =========================================================
   Particles — 矿物粉尘飘落粒子层
   物理模型：重力加速度 + 空气阻力阻尼 + 水平风扰动
   粒子从顶部随机生成，带随机大小、颜色、初速
   ========================================================= */

const { useEffect, useRef } = React;

function Particles() {
  const layerRef = useRef(null);

  useEffect(() => {
    if (DH.prefersReducedMotion()) return;

    const layer = layerRef.current;
    if (!layer) return;

    const COLORS = ['#C8963E', '#A8452C', '#3E6B50', '#E9DCC3', '#6B4A2B', '#F5EDD8'];
    const COUNT = 42;
    const particles = [];

    // 初始化粒子
    for (let i = 0; i < COUNT; i++) {
      const el = document.createElement('div');
      el.className = 'particle';
      const size = DH.rand(1.5, 4.5);
      const color = DH.pick(COLORS);
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      el.style.background = color;
      el.style.boxShadow = `0 0 ${size * 2}px ${color}`;
      layer.appendChild(el);

      particles.push({
        el,
        x: DH.rand(0, window.innerWidth),
        y: DH.rand(-window.innerHeight, 0),
        vx: DH.rand(-0.08, 0.08),  // 水平初速（px/ms）
        vy: DH.rand(0.01, 0.04),   // 下落初速
        size,
        gravity: DH.rand(0.00008, 0.00015), // 重力加速度 px/ms²
        drag: DH.rand(0.985, 0.995),       // 空气阻力（每帧衰减系数，60fps 基准）
        swayPhase: DH.rand(0, Math.PI * 2),
        swaySpeed: DH.rand(0.0005, 0.0015),
        swayAmp: DH.rand(0.02, 0.06),
        opacity: DH.rand(0.3, 0.8),
      });
      el.style.opacity = particles[i].opacity;
    }

    const TOKEN = 'particles-layer';
    DH.startLoop(TOKEN, (dt) => {
      const dtNorm = dt / 16.67; // 归一化到 60fps 步长

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 重力
        p.vy += p.gravity * dt;
        // 空气阻力
        p.vy *= Math.pow(p.drag, dtNorm);
        p.vx *= Math.pow(p.drag, dtNorm);

        // 水平摆动
        p.swayPhase += p.swaySpeed * dt;
        const sway = Math.sin(p.swayPhase) * p.swayAmp;

        // 位置更新
        p.x += (p.vx + sway) * dt;
        p.y += p.vy * dt;

        // 出界回收（从顶部重新进入）
        if (p.y > window.innerHeight + 20) {
          p.y = -20;
          p.x = DH.rand(0, window.innerWidth);
          p.vy = DH.rand(0.01, 0.04);
          p.vx = DH.rand(-0.08, 0.08);
        }
        if (p.x < -20) p.x = window.innerWidth + 20;
        if (p.x > window.innerWidth + 20) p.x = -20;

        p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      }
    });

    // 窗口尺寸变化时重置边界（不需要每帧读 innerWidth）
    const onResize = () => {
      // 超出右边界的粒子拉回
      particles.forEach((p) => {
        if (p.x > window.innerWidth) p.x = window.innerWidth * Math.random();
      });
    };
    window.addEventListener('resize', DH.rafThrottle(onResize));

    return () => {
      DH.stopLoop(TOKEN);
      window.removeEventListener('resize', DH.rafThrottle(onResize));
      // 清空 DOM
      while (layer.firstChild) layer.removeChild(layer.firstChild);
    };
  }, []);

  return <div className="particles-layer" ref={layerRef} aria-hidden="true"></div>;
}

window.Particles = Particles;
