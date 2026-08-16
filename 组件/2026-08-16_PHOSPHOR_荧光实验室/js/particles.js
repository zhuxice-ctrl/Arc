/* ============================================================
   PHOSPHOR Particles — 辉光粒子引力场
   - 200+ 粒子构成流线场
   - 鼠标（荧光探针）产生反平方斥力，推开粒子
   - 粒子有回归原位的弹簧力
   - 加入全局向量场（Perlin 噪声风格的流动）
   - 粒子连线（距离近时发光连线）
   - 物理：弹簧 + 反平方斥力 + 摩擦阻尼
   ============================================================ */

(function () {
  'use strict';

  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  let ctx, w, h;
  let particles = [];
  const PARTICLE_COUNT = PH.reducedMotion ? 60 : 220;
  const INFLUENCE_RADIUS = 180; // 鼠标影响半径
  const REPULSION_STRENGTH = 8000; // 反平方斥力系数

  const links = []; // 连线缓存

  // ========== 初始化 ==========
  function init() {
    const info = PH.setupCanvas(canvas);
    ctx = info.ctx;
    w = info.w;
    h = info.h;

    particles = [];
    // 在视窗内均匀散布粒子
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = PH.random(0, w);
      const y = PH.random(0, h);
      particles.push(new FlowParticle(x, y));
    }
  }

  // ========== 粒子类 ==========
  function FlowParticle(x, y) {
    this.ox = x; // 原点
    this.oy = y;
    this.x = x;
    this.y = y;
    this.vx = PH.random(-0.3, 0.3);
    this.vy = PH.random(-0.3, 0.3);
    this.size = PH.random(1, 2.5);
    this.baseHue = 170 + PH.random(-15, 25); // 荧光青系
    this.hueShift = 0;
    this.brightness = 60 + PH.random(0, 20);
    this.phase = PH.random(0, Math.PI * 2);
    this.speed = PH.random(0.3, 0.8);
    this.noiseOffset = PH.random(0, 1000);
  }

  FlowParticle.prototype.update = function (dt, mouseX, mouseY, mouseInView) {
    const fdt = dt * 60;

    // 1. 全局流动（伪 Perlin 噪声向量场）
    const nScale = 0.003;
    const nx = Math.sin(this.x * nScale + this.noiseOffset) * Math.cos(this.y * nScale * 0.7);
    const ny = Math.cos(this.x * nScale * 0.8) * Math.sin(this.y * nScale + this.noiseOffset * 1.3);
    this.vx += nx * 0.03 * this.speed * fdt;
    this.vy += ny * 0.03 * this.speed * fdt;

    // 2. 回归原位的弹簧力（弱）
    const dx = this.ox - this.x;
    const dy = this.oy - this.y;
    this.vx += dx * 0.002 * fdt;
    this.vy += dy * 0.002 * fdt;

    // 3. 鼠标反平方斥力
    if (mouseInView) {
      const mdx = this.x - mouseX;
      const mdy = this.y - mouseY;
      const distSq = mdx * mdx + mdy * mdy;
      const dist = Math.sqrt(distSq);

      if (dist < INFLUENCE_RADIUS && dist > 1) {
        // 反平方定律：F = k / r²
        const force = REPULSION_STRENGTH / Math.max(distSq, 400);
        const fx = (mdx / dist) * force;
        const fy = (mdy / dist) * force;
        this.vx += fx * 0.001 * fdt;
        this.vy += fy * 0.001 * fdt;
        // 靠近鼠标时色相偏移（变亮变饱和）
        const intensity = 1 - dist / INFLUENCE_RADIUS;
        this.hueShift = intensity * 30;
        this.brightness = 70 + intensity * 25;
      } else {
        this.hueShift *= 0.95;
        this.brightness = PH.lerp(this.brightness, 60 + Math.sin(this.phase) * 10, 0.05);
      }
    }

    // 4. 摩擦阻尼
    this.vx *= Math.pow(0.97, fdt);
    this.vy *= Math.pow(0.97, fdt);

    // 5. 位置更新
    this.x += this.vx * fdt;
    this.y += this.vy * fdt;

    // 6. 相位（呼吸感）
    this.phase += 0.02 * fdt;
  };

  FlowParticle.prototype.draw = function () {
    const hue = this.baseHue + this.hueShift;
    const alpha = 0.6 + Math.sin(this.phase) * 0.2;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${hue}, 90%, ${this.brightness}%, ${alpha})`;
    ctx.shadowBlur = this.size * 6;
    ctx.shadowColor = `hsla(${hue}, 95%, 65%, ${alpha * 0.7})`;
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  // ========== 连线 ==========
  const LINK_DISTANCE = 80;
  const MAX_LINKS = 400;

  function drawLinks() {
    let linkCount = 0;
    ctx.lineWidth = 0.5;

    for (let i = 0; i < particles.length && linkCount < MAX_LINKS; i++) {
      for (let j = i + 1; j < particles.length && linkCount < MAX_LINKS; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distSq = dx * dx + dy * dy;

        if (distSq < LINK_DISTANCE * LINK_DISTANCE) {
          const dist = Math.sqrt(distSq);
          const alpha = (1 - dist / LINK_DISTANCE) * 0.3;
          const hue = (particles[i].baseHue + particles[j].baseHue) / 2;

          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `hsla(${hue}, 85%, 65%, ${alpha})`;
          ctx.stroke();
          linkCount++;
        }
      }
    }
  }

  // ========== 鼠标在画布内的位置（展区坐标系） ==========
  function getCanvasMouse() {
    const rect = canvas.getBoundingClientRect();
    return {
      x: PH.mouse.x - rect.left,
      y: PH.mouse.y - rect.top,
      inView: PH.mouse.x >= rect.left && PH.mouse.x <= rect.right &&
              PH.mouse.y >= rect.top && PH.mouse.y <= rect.bottom
    };
  }

  // ========== 主循环 ==========
  let isActive = false;

  function particleLoop(dt) {
    // 轨迹淡出（拖尾感）
    ctx.fillStyle = 'rgba(16, 16, 20, 0.15)';
    ctx.fillRect(0, 0, w, h);

    const m = getCanvasMouse();

    // 更新粒子
    for (let i = 0; i < particles.length; i++) {
      particles[i].update(dt, m.x, m.y, m.inView);
    }

    // 绘制连线
    if (!PH.reducedMotion) {
      drawLinks();
    }

    // 绘制粒子
    for (let i = 0; i < particles.length; i++) {
      particles[i].draw();
    }

    // 鼠标影响范围光晕
    if (m.inView && !PH.reducedMotion) {
      const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, INFLUENCE_RADIUS);
      grad.addColorStop(0, 'rgba(45, 225, 194, 0.08)');
      grad.addColorStop(0.5, 'rgba(45, 225, 194, 0.03)');
      grad.addColorStop(1, 'rgba(45, 225, 194, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(m.x, m.y, INFLUENCE_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ========== IntersectionObserver 控制启停 ==========
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        if (!isActive) {
          isActive = true;
          PH.RAF.add(particleLoop);
        }
      } else {
        if (isActive) {
          isActive = false;
          PH.RAF.remove(particleLoop);
        }
      }
    });
  }, { threshold: 0.1 });

  io.observe(canvas.parentElement);

  // ========== Resize ==========
  let resizeTimer = null;
  window.addEventListener('resize', function () {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      init();
    }, 200);
  });

  // 初始
  init();
  // 始终先启动一次（首屏可见）
  isActive = true;
  PH.RAF.add(particleLoop);

})();
