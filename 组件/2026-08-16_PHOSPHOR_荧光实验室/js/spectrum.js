/* ============================================================
   PHOSPHOR Spectrum — 磷光频谱
   - 64 根频谱柱组成的可视化频谱
   - 鼠标上下移动 → 激发对应频段（高频在上，低频在下）
   - 每根柱子独立做阻尼振荡（不同的阻尼系数 + 谐振频率）
   - 加入自然衰减的背景噪声（随机小幅跳动）
   - 物理：简谐振动 + 阻尼 + 外部激励
   ============================================================ */

(function () {
  'use strict';

  const canvas = document.getElementById('spectrumCanvas');
  if (!canvas) return;

  let ctx, w, h;
  let bars = [];
  const BAR_COUNT = 64;

  // 读数 DOM
  const freqEl = document.getElementById('specFreq');
  const ampEl = document.getElementById('specAmp');
  const decayEl = document.getElementById('specDecay');

  // ========== 频谱柱 ==========
  function SpectrumBar(index) {
    this.index = index;
    this.phase = Math.random() * Math.PI * 2;
    this.amplitude = 0;      // 当前振幅（0~1）
    this.velocity = 0;       // 振动速度
    this.resonance = 0.6 + Math.random() * 0.4; // 谐振频率系数
    this.damping = 0.96 + Math.random() * 0.025; // 阻尼系数
    this.baseNoise = 0.05 + Math.random() * 0.05; // 基础噪声幅度
    this.hue = 160 + (index / BAR_COUNT) * 40; // 从青到青蓝渐变
    this.width = 0;
    this.gap = 0;
  }

  SpectrumBar.prototype.update = function (dt, excitation) {
    const fdt = dt * 60;

    // 外部激励（鼠标位置激发）
    if (excitation > 0.01) {
      // 高斯激发：越靠近激发频率（鼠标Y位置）的频段响应越强
      const distFromExcitation = Math.abs(this.index / BAR_COUNT - excitation);
      const gaussExcitation = Math.exp(-distFromExcitation * distFromExcitation * 20) * 0.8;
      this.velocity += gaussExcitation * 0.3 * fdt;
    }

    // 自然噪声（布朗运动风格的小幅跳动）
    this.velocity += (Math.random() - 0.5) * this.baseNoise * 0.1 * fdt;

    // 简谐振动：向 0 回归
    this.velocity += -this.amplitude * this.resonance * 0.3 * fdt;

    // 阻尼
    const dmp = Math.pow(this.damping, fdt);
    this.velocity *= dmp;

    // 位置更新
    this.amplitude += this.velocity * fdt;

    // 限幅
    if (this.amplitude > 1) {
      this.amplitude = 1;
      this.velocity = -Math.abs(this.velocity) * 0.3; // 过阻尼反弹
    }
    if (this.amplitude < -0.3) {
      this.amplitude = -0.3;
      this.velocity = Math.abs(this.velocity) * 0.3;
    }
  };

  SpectrumBar.prototype.draw = function (x, barW, centerY, maxH) {
    const amp = Math.max(0, this.amplitude); // 只画正向
    const height = amp * maxH;

    if (height < 0.5) return;

    const hue = this.hue;
    const lightness = 50 + amp * 25;

    // 主体
    ctx.fillStyle = `hsla(${hue}, 90%, ${lightness}%, 0.9)`;
    ctx.shadowBlur = 8 + amp * 20;
    ctx.shadowColor = `hsla(${hue}, 95%, 60%, ${amp * 0.8})`;

    // 圆角矩形频谱柱
    const bw = barW * 0.7;
    const bx = x + (barW - bw) / 2;
    const by = centerY - height;

    roundRect(ctx, bx, by, bw, height, bw / 2);
    ctx.fill();

    // 顶部亮点
    ctx.beginPath();
    ctx.arc(x + barW / 2, by, bw * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${hue}, 100%, 85%, ${amp})`;
    ctx.fill();

    ctx.shadowBlur = 0;
  };

  function roundRect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // ========== 初始化 ==========
  function init() {
    const info = PH.setupCanvas(canvas);
    ctx = info.ctx;
    w = info.w;
    h = info.h;

    bars = [];
    for (let i = 0; i < BAR_COUNT; i++) {
      bars.push(new SpectrumBar(i));
    }
  }

  // ========== 鼠标激发位置 ==========
  function getCanvasMouse() {
    const rect = canvas.getBoundingClientRect();
    return {
      x: PH.mouse.x - rect.left,
      y: PH.mouse.y - rect.top,
      inView: PH.mouse.x >= rect.left && PH.mouse.x <= rect.right &&
              PH.mouse.y >= rect.top && PH.mouse.y <= rect.bottom
    };
  }

  // ========== 读数更新 ==========
  let readoutAcc = 0;
  function updateReadout(dt, excitation, avgAmp) {
    readoutAcc += dt;
    if (readoutAcc < 0.05) return;
    readoutAcc = 0;

    // 主频（根据鼠标位置映射）
    const freq = Math.round(excitation * 2000 * 10) / 10;
    if (freqEl) freqEl.textContent = freq.toFixed(1) + ' Hz';

    // 振幅
    if (ampEl) ampEl.textContent = avgAmp.toFixed(3);

    // 平均阻尼
    let avgDamp = 0;
    for (let i = 0; i < bars.length; i++) avgDamp += bars[i].damping;
    avgDamp /= bars.length;
    if (decayEl) decayEl.textContent = avgDamp.toFixed(3);
  }

  // ========== 主循环 ==========
  let isActive = false;
  let time = 0;

  function spectrumLoop(dt) {
    time += dt;
    ctx.clearRect(0, 0, w, h);

    const m = getCanvasMouse();
    // 鼠标Y映射到频段（顶部=高频=1，底部=低频=0）
    const excitation = m.inView ? 1 - (m.y / h) : 0.3; // 无鼠标时给基础低激发

    const barW = w / BAR_COUNT;
    const centerY = h * 0.7;
    const maxH = h * 0.55;

    let totalAmp = 0;

    for (let i = 0; i < bars.length; i++) {
      bars[i].update(dt, excitation);
      bars[i].draw(i * barW, barW, centerY, maxH);
      totalAmp += Math.abs(bars[i].amplitude);
    }

    const avgAmp = totalAmp / bars.length;
    updateReadout(dt, excitation, avgAmp);

    // 中线装饰
    ctx.strokeStyle = 'rgba(45, 225, 194, 0.1)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(w, centerY);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // ========== IntersectionObserver ==========
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        if (!isActive) {
          isActive = true;
          PH.RAF.add(spectrumLoop);
        }
      } else {
        if (isActive) {
          isActive = false;
          PH.RAF.remove(spectrumLoop);
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

  init();

})();
