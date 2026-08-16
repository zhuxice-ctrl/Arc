/* ============================================================
   PHOSPHOR Coda — 信号尾迹展区
   - 背景：流动的彗星粒子流（从左到右的荧光流线）
   - 打字机效果：实验编号文字逐字出现
   - 数字计数动画：数字从 0 滚动到目标值（缓动）
   - 重置按钮：光泽扫过效果 + 涟漪 + 重新触发计数
   ============================================================ */

(function () {
  'use strict';

  const canvas = document.getElementById('cometCanvas');
  if (!canvas) return;

  let ctx, w, h;
  let comets = [];
  const COMET_COUNT = 50;

  // ========== 彗星粒子 ==========
  function Comet() {
    this.reset(true);
  }

  Comet.prototype.reset = function (initial) {
    this.x = initial ? PH.random(-w, w) : -PH.random(50, 300);
    this.y = PH.random(0, h);
    this.speed = PH.random(40, 120); // px/s
    this.size = PH.random(0.5, 2.5);
    this.trailLength = PH.random(30, 80);
    this.hue = 165 + PH.random(-10, 25);
    this.brightness = 60 + PH.random(0, 25);
    this.alpha = PH.random(0.3, 0.8);
    this.waveAmp = PH.random(5, 25);
    this.waveFreq = PH.random(0.005, 0.02);
    this.phase = PH.random(0, Math.PI * 2);
    this.trail = []; // 历史位置
  };

  Comet.prototype.update = function (dt) {
    const fdt = dt * 60;
    this.x += this.speed * dt;
    this.phase += this.waveFreq * fdt;
    const yOffset = Math.sin(this.phase) * this.waveAmp;

    // 记录轨迹
    this.trail.unshift({ x: this.x, y: this.y + yOffset });
    if (this.trail.length > this.trailLength) {
      this.trail.pop();
    }

    // 超出右边界则重置
    if (this.x > w + 200) {
      this.reset(false);
    }
  };

  Comet.prototype.draw = function () {
    if (this.trail.length < 2) return;

    // 绘制拖尾（渐变透明度）
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (let i = 1; i < this.trail.length; i++) {
      const t = i / this.trail.length;
      const alpha = this.alpha * (1 - t) * 0.6;
      const width = this.size * (1 - t * 0.7);

      ctx.beginPath();
      ctx.moveTo(this.trail[i - 1].x, this.trail[i - 1].y);
      ctx.lineTo(this.trail[i].x, this.trail[i].y);
      ctx.strokeStyle = `hsla(${this.hue}, 90%, ${this.brightness}%, ${alpha})`;
      ctx.lineWidth = width;
      ctx.shadowBlur = width * 3;
      ctx.shadowColor = `hsla(${this.hue}, 95%, 60%, ${alpha * 0.7})`;
      ctx.stroke();
    }

    ctx.shadowBlur = 0;

    // 头部亮点
    if (this.trail.length > 0) {
      const head = this.trail[0];
      ctx.beginPath();
      ctx.arc(head.x, head.y, this.size * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, 85%, ${this.alpha})`;
      ctx.shadowBlur = this.size * 8;
      ctx.shadowColor = `hsla(${this.hue}, 95%, 60%, ${this.alpha * 0.8})`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  };

  // ========== 初始化 ==========
  function init() {
    const info = PH.setupCanvas(canvas);
    ctx = info.ctx;
    w = info.w;
    h = info.h;

    comets = [];
    const count = PH.reducedMotion ? 15 : COMET_COUNT;
    for (let i = 0; i < count; i++) {
      comets.push(new Comet());
    }
  }

  // ========== 主循环 ==========
  let isActive = false;

  function cometLoop(dt) {
    // 淡淡出（拖尾效果）
    ctx.fillStyle = 'rgba(10, 10, 13, 0.12)';
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < comets.length; i++) {
      comets[i].update(dt);
      comets[i].draw();
    }
  }

  // ========== IntersectionObserver ==========
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        if (!isActive) {
          isActive = true;
          PH.RAF.add(cometLoop);
          triggerAnimations();
        }
      } else {
        if (isActive) {
          isActive = false;
          PH.RAF.remove(cometLoop);
        }
      }
    });
  }, { threshold: 0.2 });

  io.observe(canvas.parentElement);

  // ========== Resize ==========
  let resizeTimer = null;
  window.addEventListener('resize', function () {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      init();
    }, 200);
  });

  // ========== 打字机效果 ==========
  const typewriterText = document.getElementById('typewriterText');
  const typewriterStrings = [
    'PHOSPHOR-V3.0',
    'FLUORESCENT.LAB',
    '实验编号 2847-XK',
    'GLYPH.DECONSTRUCT'
  ];
  let twIndex = 0;
  let twCharIndex = 0;
  let twMode = 'typing'; // typing | pausing | deleting
  let twTimer = null;

  function typewriterTick() {
    if (!typewriterText) return;

    const str = typewriterStrings[twIndex];

    if (twMode === 'typing') {
      twCharIndex++;
      typewriterText.textContent = str.substring(0, twCharIndex);
      if (twCharIndex >= str.length) {
        twMode = 'pausing';
        twTimer = setTimeout(typewriterTick, 2000 + PH.random(0, 500));
        return;
      }
      twTimer = setTimeout(typewriterTick, 80 + PH.random(0, 60));
    } else if (twMode === 'pausing') {
      twMode = 'deleting';
      twTimer = setTimeout(typewriterTick, 50);
    } else if (twMode === 'deleting') {
      twCharIndex--;
      typewriterText.textContent = str.substring(0, twCharIndex);
      if (twCharIndex <= 0) {
        twMode = 'typing';
        twIndex = (twIndex + 1) % typewriterStrings.length;
        twTimer = setTimeout(typewriterTick, 300);
        return;
      }
      twTimer = setTimeout(typewriterTick, 30 + PH.random(0, 20));
    }
  }

  function startTypewriter() {
    if (twTimer) clearTimeout(twTimer);
    twIndex = 0;
    twCharIndex = 0;
    twMode = 'typing';
    if (typewriterText) typewriterText.textContent = '';
    twTimer = setTimeout(typewriterTick, 500);
  }

  // ========== 数字计数动画 ==========
  function animateNumber(el, target, duration, easing) {
    if (!el) return;
    duration = duration || 2000;
    easing = easing || 'easeOutExpo';

    const start = 0;
    const startTime = performance.now();

    const easeFuncs = {
      easeOutExpo: function (t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); },
      easeOutCubic: function (t) { return 1 - Math.pow(1 - t, 3); },
      easeOutQuart: function (t) { return 1 - Math.pow(1 - t, 4); }
    };

    const ease = easeFuncs[easing] || easeFuncs.easeOutExpo;

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = ease(progress);
      const value = Math.floor(start + (target - start) * eased);
      el.textContent = value.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(tick);
  }

  function triggerCounters() {
    const bigNum = document.querySelector('.big-number__value');
    if (bigNum) {
      const target = parseInt(bigNum.dataset.target, 10) || 0;
      animateNumber(bigNum, target, 2800, 'easeOutExpo');
    }

    // 小数字稍延迟
    setTimeout(function () {
      const stats = document.querySelectorAll('.stat-value');
      stats.forEach(function (el, i) {
        setTimeout(function () {
          const target = parseInt(el.dataset.target, 10) || 0;
          animateNumber(el, target, 1500, 'easeOutCubic');
        }, i * 200);
      });
    }, 400);
  }

  // ========== 触发动画（首次进入可视区时） ==========
  let hasTriggered = false;

  function triggerAnimations() {
    if (hasTriggered) return;
    hasTriggered = true;

    if (!PH.reducedMotion) {
      startTypewriter();
    } else {
      if (typewriterText) typewriterText.textContent = typewriterStrings[0];
    }

    triggerCounters();
  }

  // ========== 重置按钮 ==========
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', function (e) {
      // 涟漪
      const rect = resetBtn.getBoundingClientRect();
      PH.createRipple(rect.left + rect.width / 2, rect.top + rect.height / 2, '#2DE1C2');
      PH.createRipple(rect.left + rect.width / 2, rect.top + rect.height / 2, '#DFF6FF');

      // 重新触发所有动画
      hasTriggered = false;
      triggerAnimations();
    });

    // 光泽扫过（CSS 已处理 hover，这里加一个自动周期扫过）
    // 由 CSS :hover 触发 shine 即可，不再额外加 JS 动画
  }

  // 初始
  init();

})();
