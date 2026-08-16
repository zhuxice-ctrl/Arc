/* ============================================================
   PHOSPHOR Text Deconstruction — 荧光字形解构
   - 标题文字由像素点组成
   - 鼠标靠近时粒子被排斥、溃散
   - 鼠标远离时粒子由弹簧力收敛回原位
   - 物理：反平方斥力 + 弹簧回归 + 阻尼
   ============================================================ */

(function () {
  'use strict';

  const canvas = document.getElementById('textCanvas');
  if (!canvas) return;

  let ctx, w, h;
  let particles = [];
  let text = 'PHOSPHOR';
  const REPEL_RADIUS = 120;
  const REPEL_STRENGTH = 12000;

  // ========== 采样文字像素 ==========
  function sampleTextPixels() {
    const offscreen = document.createElement('canvas');
    const octx = offscreen.getContext('2d');

    // 根据画布尺寸选择字号
    const fontSize = Math.min(w * 0.18, 200);
    offscreen.width = w;
    offscreen.height = h;

    octx.fillStyle = '#fff';
    octx.font = `700 ${fontSize}px "Space Grotesk", sans-serif`;
    octx.textAlign = 'center';
    octx.textBaseline = 'middle';
    octx.fillText(text, w / 2, h / 2);

    const imageData = octx.getImageData(0, 0, w, h);
    const data = imageData.data;
    const pixels = [];

    // 采样间隔：控制粒子密度
    const step = Math.max(3, Math.floor(fontSize / 50));

    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const i = (y * w + x) * 4;
        if (data[i + 3] > 128) { // alpha > 50%
          pixels.push({
            x: x,
            y: y
          });
        }
      }
    }

    return pixels;
  }

  // ========== 粒子类 ==========
  function TextParticle(x, y) {
    this.ox = x;
    this.oy = y;
    this.x = x + PH.random(-2, 2);
    this.y = y + PH.random(-2, 2);
    this.vx = 0;
    this.vy = 0;
    this.size = PH.random(1, 2);
    this.hue = 170 + PH.random(-10, 15);
    this.brightness = 65;
    this.phase = PH.random(0, Math.PI * 2);
  }

  TextParticle.prototype.update = function (dt, mx, my, mouseInView) {
    const fdt = dt * 60;

    // 1. 弹簧回归
    const dx = this.ox - this.x;
    const dy = this.oy - this.y;
    this.vx += dx * 0.06 * fdt;
    this.vy += dy * 0.06 * fdt;

    // 2. 鼠标斥力
    if (mouseInView) {
      const mdx = this.x - mx;
      const mdy = this.y - my;
      const distSq = mdx * mdx + mdy * mdy;

      if (distSq < REPEL_RADIUS * REPEL_RADIUS && distSq > 1) {
        const dist = Math.sqrt(distSq);
        const force = REPEL_STRENGTH / Math.max(distSq, 100);
        const fx = (mdx / dist) * force;
        const fy = (mdy / dist) * force;
        this.vx += fx * 0.0008 * fdt;
        this.vy += fy * 0.0008 * fdt;

        // 被推开时变亮
        const intensity = 1 - dist / REPEL_RADIUS;
        this.brightness = 65 + intensity * 30;
      } else {
        this.brightness = PH.lerp(this.brightness, 65, 0.05);
      }
    }

    // 3. 阻尼
    this.vx *= Math.pow(0.88, fdt);
    this.vy *= Math.pow(0.88, fdt);

    // 4. 位置
    this.x += this.vx * fdt;
    this.y += this.vy * fdt;

    this.phase += 0.03 * fdt;
  };

  TextParticle.prototype.draw = function () {
    const alpha = 0.7 + Math.sin(this.phase) * 0.15;
    const size = this.size + Math.sin(this.phase) * 0.3;

    ctx.beginPath();
    ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, 90%, ${this.brightness}%, ${alpha})`;
    ctx.shadowBlur = size * 4;
    ctx.shadowColor = `hsla(${this.hue}, 95%, 60%, ${alpha * 0.6})`;
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  // ========== 初始化 ==========
  function init() {
    const info = PH.setupCanvas(canvas);
    ctx = info.ctx;
    w = info.w;
    h = info.h;

    const pixels = sampleTextPixels();
    particles = [];

    // 限制最大粒子数
    const maxParticles = PH.reducedMotion ? 400 : 1200;
    const stride = Math.max(1, Math.ceil(pixels.length / maxParticles));

    for (let i = 0; i < pixels.length; i += stride) {
      particles.push(new TextParticle(pixels[i].x, pixels[i].y));
    }
  }

  // ========== 鼠标位置 ==========
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

  function textLoop(dt) {
    // 拖尾淡出
    ctx.fillStyle = 'rgba(16, 16, 20, 0.18)';
    ctx.fillRect(0, 0, w, h);

    const m = getCanvasMouse();

    for (let i = 0; i < particles.length; i++) {
      particles[i].update(dt, m.x, m.y, m.inView);
      particles[i].draw();
    }
  }

  // ========== IntersectionObserver ==========
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        if (!isActive) {
          isActive = true;
          PH.RAF.add(textLoop);
        }
      } else {
        if (isActive) {
          isActive = false;
          PH.RAF.remove(textLoop);
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
    }, 250);
  });

  init();

})();
