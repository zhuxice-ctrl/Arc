/* ============================================================
   FeatherParticles - 羽毛粒子系统
   主题语义：羽翼/羽毛飘落，模拟空气阻力 + 轻微摆动
   粒子为简笔 SVG 羽毛形状，透明度低，营造氛围
   ============================================================ */

function FeatherParticles() {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let dpr = window.devicePixelRatio || 1;
    let w = 0, h = 0;
    let particles = [];
    let rafKey = 'feather-particles';
    let isVisible = !document.hidden;

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // 绘制单根羽毛（简笔）
    function drawFeather(ctx, x, y, size, angle, alpha, hueShift = 0) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalAlpha = alpha;

      // 羽轴
      ctx.strokeStyle = '#8A8680';
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(0, -size / 2);
      ctx.quadraticCurveTo(size * 0.1, 0, 0, size / 2);
      ctx.stroke();

      // 羽枝（一侧简化）
      ctx.strokeStyle = hueShift > 0 ? '#E4572E' : '#B5B0A8';
      ctx.lineWidth = 0.5;
      const barbCount = Math.floor(size / 3);
      for (let i = 0; i < barbCount; i++) {
        const t = i / barbCount;
        const yPos = -size / 2 + t * size;
        const barbLen = size * 0.3 * Math.sin(t * Math.PI);
        const sway = Math.sin(t * Math.PI * 1.5) * 1;
        ctx.beginPath();
        ctx.moveTo(sway, yPos);
        ctx.lineTo(barbLen + sway, yPos + barbLen * 0.4);
        ctx.stroke();
        // 另一侧
        ctx.beginPath();
        ctx.moveTo(sway * 0.5, yPos);
        ctx.lineTo(-barbLen * 0.6 + sway * 0.5, yPos + barbLen * 0.5);
        ctx.stroke();
      }

      ctx.restore();
    }

    class Feather {
      constructor() { this.reset(true); }
      reset(initial = false) {
        this.x = Math.random() * w;
        this.y = initial ? Math.random() * h : -30 - Math.random() * 100;
        this.size = 8 + Math.random() * 18;
        // 飘落速度（受空气阻力，大小不同速度不同）
        this.vy = 0.3 + this.size * 0.04 + Math.random() * 0.3;
        // 水平漂移
        this.vx = (Math.random() - 0.5) * 0.4;
        // 摆动角度（模拟气流）
        this.angle = (Math.random() - 0.5) * 0.5;
        this.angularVel = (Math.random() - 0.5) * 0.02;
        // 摆动相位
        this.swayPhase = Math.random() * Math.PI * 2;
        this.swaySpeed = 0.8 + Math.random() * 1.2;
        this.swayAmplitude = 0.3 + Math.random() * 0.5;
        // 透明度
        this.alpha = 0.12 + Math.random() * 0.22;
        // 少许茜红色羽毛点缀
        this.isSunset = Math.random() < 0.12;
        // 深度因子（越远越慢越淡）
        this.depth = 0.4 + Math.random() * 0.6;
      }
      update(dt, t) {
        // 垂直下落，带空气阻力感（缓慢加速）
        this.y += this.vy * this.depth * dt * 60;
        // 水平摆动（正弦气流）
        const sway = Math.sin(t * 0.001 * this.swaySpeed + this.swayPhase) * this.swayAmplitude;
        this.x += (this.vx + sway * 0.3) * this.depth * dt * 60;
        // 角度摆动
        this.angle += this.angularVel + Math.sin(t * 0.001 * this.swaySpeed + this.swayPhase) * 0.003;
        // 边界回收
        if (this.y > h + 40 || this.x < -40 || this.x > w + 40) {
          this.reset();
          this.y = -40;
        }
      }
      draw(ctx) {
        drawFeather(ctx, this.x, this.y, this.size, this.angle,
          this.alpha * this.depth, this.isSunset ? 1 : 0);
      }
    }

    function initParticles() {
      const count = Math.floor((w * h) / 18000); // 密度
      particles = [];
      for (let i = 0; i < Math.min(count, 50); i++) {
        particles.push(new Feather());
      }
    }

    let lastT = 0;
    function animate(dt, t) {
      if (!isVisible) return;
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.update(dt, t);
        p.draw(ctx);
      });
    }

    function onResize() {
      resize();
      initParticles();
    }

    function onVisibilityChange() {
      isVisible = !document.hidden;
      if (isVisible) {
        RafManager.add(rafKey, animate);
      } else {
        RafManager.remove(rafKey);
      }
    }

    resize();
    initParticles();
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibilityChange);
    RafManager.add(rafKey, animate);

    return () => {
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      RafManager.remove(rafKey);
    };
  }, []);

  return React.createElement('canvas', {
    ref: canvasRef,
    id: 'feather-canvas',
    'aria-hidden': 'true'
  });
}

Object.assign(window, { FeatherParticles });
