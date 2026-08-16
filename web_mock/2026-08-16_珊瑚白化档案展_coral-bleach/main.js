/* ============================================================
   Coral Bleach Archive — 交互与动效
   ============================================================ */

(function () {
  'use strict';

  // ============== 状态管理 ==============
  const state = {
    cursor: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    cursorTarget: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    isVisible: !document.hidden,
    rafIds: new Set(),
    timeouts: new Set(),
    scrollY: 0,
  };

  // ============== 工具函数 ==============
  function raf(fn) {
    const id = requestAnimationFrame(fn);
    state.rafIds.add(id);
    return id;
  }

  function cancelRaf(id) {
    cancelAnimationFrame(id);
    state.rafIds.delete(id);
  }

  function setT(fn, delay) {
    const id = setTimeout(fn, delay);
    state.timeouts.add(id);
    return id;
  }

  function clearT(id) {
    clearTimeout(id);
    state.timeouts.delete(id);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  // 弹簧积分器
  function makeSpring(target, stiffness, damping, mass) {
    return {
      value: target,
      target: target,
      velocity: 0,
      stiffness: stiffness || 180,
      damping: damping || 14,
      mass: mass || 1,
      update(dt) {
        const springForce = -this.stiffness * (this.value - this.target);
        const dampingForce = -this.damping * this.velocity;
        const acceleration = (springForce + dampingForce) / this.mass;
        this.velocity += acceleration * dt;
        this.value += this.velocity * dt;
        return this.value;
      }
    };
  }

  // ============== 自定义光标 ==============
  function initCursor() {
    if (state.reducedMotion) return;

    const cursor = document.getElementById('custom-cursor');
    const ripple = document.getElementById('cursor-ripple');
    if (!cursor) return;

    const springX = makeSpring(state.cursor.x, 220, 20, 1);
    const springY = makeSpring(state.cursor.y, 220, 20, 1);
    const ringSpring = makeSpring(32, 200, 18, 1);

    // 初始显示在屏幕中央
    cursor.style.display = 'block';

    function updateCursor(e) {
      state.cursorTarget.x = e.clientX;
      state.cursorTarget.y = e.clientY;
    }

    function animateCursor() {
      if (!state.isVisible) {
        raf(animateCursor);
        return;
      }

      springX.target = state.cursorTarget.x;
      springY.target = state.cursorTarget.y;

      const dt = 1 / 60;
      springX.update(dt);
      springY.update(dt);

      state.cursor.x = springX.value;
      state.cursor.y = springY.value;

      cursor.style.transform = `translate(${springX.value}px, ${springY.value}px)`;

      raf(animateCursor);
    }

    window.addEventListener('mousemove', updateCursor, { passive: true });

    // 悬停可交互元素
    const hoverables = document.querySelectorAll('[data-hoverable]');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });

    // 点击涟漪
    function handleClick(e) {
      if (!state.isVisible) return;
      cursor.classList.add('is-click');
      setTimeout(() => cursor.classList.remove('is-click'), 150);

      const newRipple = ripple.cloneNode(true);
      newRipple.id = '';
      newRipple.style.left = e.clientX + 'px';
      newRipple.style.top = e.clientY + 'px';
      newRipple.classList.add('is-active');
      document.body.appendChild(newRipple);

      setTimeout(() => newRipple.remove(), 650);
    }

    window.addEventListener('click', handleClick, { passive: true });

    raf(animateCursor);
  }

  // ============== 粒子系统 ==============
  function initParticles(canvas, opts) {
    if (state.reducedMotion) return;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];
    const count = opts.count || 80;
    const colors = opts.colors || ['#E8E4D9'];
    let w, h;
    let mouseInfluence = { x: 0, y: 0 };

    function resize() {
      const rect = canvas.getBoundingClientRect();
      w = canvas.width = rect.width * window.devicePixelRatio;
      h = canvas.height = rect.height * window.devicePixelRatio;
    }

    function createParticle() {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.2 - Math.random() * 0.4,
        size: (0.5 + Math.random() * 1.5) * window.devicePixelRatio,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.3 + Math.random() * 0.5,
        driftPhase: Math.random() * Math.PI * 2,
        driftSpeed: 0.5 + Math.random() * 1,
      };
    }

    function init() {
      resize();
      for (let i = 0; i < count; i++) {
        particles.push(createParticle());
      }
    }

    let lastTime = performance.now();
    function draw(now) {
      if (!state.isVisible) {
        raf(draw);
        return;
      }

      const dt = Math.min(now - lastTime, 33) / 16.67;
      lastTime = now;

      ctx.clearRect(0, 0, w, h);

      particles.forEach(p => {
        // 水平漂移（sin 波浪）
        p.driftPhase += 0.005 * p.driftSpeed * dt;
        p.x += p.vx * dt + Math.sin(p.driftPhase) * 0.2 * dt;
        p.y += p.vy * dt;

        // 鼠标轻微引力/排斥
        if (mouseInfluence.x !== 0) {
          const dx = mouseInfluence.x * window.devicePixelRatio - p.x;
          const dy = mouseInfluence.y * window.devicePixelRatio - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150 * window.devicePixelRatio) {
            const force = (1 - dist / (150 * window.devicePixelRatio)) * 0.3;
            p.x -= (dx / dist) * force * dt;
            p.y -= (dy / dist) * force * dt;
          }
        }

        // 循环
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      raf(draw);
    }

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouseInfluence.x = e.clientX - rect.left;
      mouseInfluence.y = e.clientY - rect.top;
    }

    function onMouseLeave() {
      mouseInfluence.x = 0;
      mouseInfluence.y = 0;
    }

    window.addEventListener('resize', resize);
    if (opts.interactive) {
      canvas.addEventListener('mousemove', onMouseMove);
      canvas.addEventListener('mouseleave', onMouseLeave);
    }

    init();
    raf(draw);
  }

  // ============== 导航滚动 ==============
  function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          state.scrollY = window.scrollY;
          if (state.scrollY > 50) {
            nav.classList.add('is-scrolled');
          } else {
            nav.classList.remove('is-scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ============== Hero 视差 ==============
  function initHeroParallax() {
    if (state.reducedMotion) return;
    const layers = document.querySelectorAll('.hero-layer');
    const lights = document.querySelectorAll('.hero-light');
    if (!layers.length) return;

    const springs = [];
    layers.forEach((layer, i) => {
      springs.push({
        x: makeSpring(0, 120, 12, 1),
        y: makeSpring(0, 120, 12, 1),
        el: layer,
        depth: parseFloat(layer.dataset.depth || '0.1'),
      });
    });

    const lightSprings = [];
    lights.forEach((light, i) => {
      lightSprings.push({
        x: makeSpring(0, 100, 10, 1),
        y: makeSpring(0, 100, 10, 1),
        el: light,
        depth: 0.05 + i * 0.02,
      });
    });

    let targetX = 0;
    let targetY = 0;

    function onMove(e) {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    }

    function animate() {
      if (!state.isVisible) {
        raf(animate);
        return;
      }

      const dt = 1 / 60;

      springs.forEach(s => {
        s.x.target = targetX * 40 * s.depth * 10;
        s.y.target = targetY * 30 * s.depth * 10;
        s.x.update(dt);
        s.y.update(dt);
        s.el.style.transform = `translate3d(${s.x.value}px, ${s.y.value}px, 0)`;
      });

      lightSprings.forEach(s => {
        s.x.target = targetX * 20 * s.depth * 10;
        s.y.target = targetY * 15 * s.depth * 10;
        s.x.update(dt);
        s.y.update(dt);
        const currentRotate = parseFloat(s.el.style.getPropertyValue('--rot') || 0);
        s.el.style.transform = `translate(${s.x.value}px, ${s.y.value}px) rotate(${currentRotate}deg)`;
      });

      raf(animate);
    }

    window.addEventListener('mousemove', onMove, { passive: true });
    raf(animate);
  }

  // ============== 数字计数动画 ==============
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const counterItems = [];

    counters.forEach(el => {
      const target = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimals || '0');
      const suffix = el.dataset.suffix || '';
      const duration = 1800 + Math.random() * 1200;

      counterItems.push({
        el,
        target,
        decimals,
        suffix,
        duration,
        started: false,
        startTime: 0,
        current: 0,
      });
    });

    function startCounter(item) {
      if (item.started) return;
      item.started = true;
      item.startTime = performance.now();

      function tick(now) {
        if (!state.isVisible) {
          raf(() => tick(performance.now()));
          return;
        }
        const elapsed = now - item.startTime;
        const progress = clamp(elapsed / item.duration, 0, 1);
        const eased = easeOutExpo(progress);
        item.current = item.target * eased;

        item.el.textContent = item.current.toFixed(item.decimals) + item.suffix;

        if (progress < 1) {
          raf(tick);
        }
      }

      raf(tick);
    }

    // IntersectionObserver
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const item = counterItems.find(c => c.el === entry.target);
          if (item) startCounter(item);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counterItems.forEach(item => io.observe(item.el));
  }

  // ============== 滚动渐入 ==============
  function initReveal() {
    const revealEls = document.querySelectorAll('[data-reveal]');
    if (!revealEls.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || (i * 100);
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, delay);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => io.observe(el));

    // 时间轴 item 的滚动渐入
    const timelineItems = document.querySelectorAll('.timeline-item');
    const tio = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, i * 120);
          tio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    timelineItems.forEach(el => tio.observe(el));

    // 章节卡片的滚动渐入
    const chapterCards = document.querySelectorAll('.chapter-card');
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '0';
          entry.target.style.transform = 'translateY(40px)';
          entry.target.style.transition = `opacity 0.8s cubic-bezier(0.22,1,0.36,1) ${i * 100}ms, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${i * 100}ms`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            });
          });
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    chapterCards.forEach(el => cio.observe(el));
  }

  // ============== 3D 倾斜卡片 ==============
  function initTiltCards() {
    if (state.reducedMotion) return;
    const cards = document.querySelectorAll('[data-tilt]');
    if (!cards.length) return;

    cards.forEach(card => {
      let rafId = null;
      let targetRotX = 0;
      let targetRotY = 0;
      let currentRotX = 0;
      let currentRotY = 0;
      let isHovering = false;

      const springX = makeSpring(0, 160, 16, 1);
      const springY = makeSpring(0, 160, 16, 1);

      function onMove(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        targetRotY = ((x - centerX) / centerX) * 8;
        targetRotX = -((y - centerY) / centerY) * 8;
      }

      function animate() {
        if (!state.isVisible || !isHovering) return;

        springX.target = targetRotX;
        springY.target = targetRotY;

        const dt = 1 / 60;
        springX.update(dt);
        springY.update(dt);

        card.style.transform = `perspective(1000px) rotateX(${springX.value}deg) rotateY(${springY.value}deg) translateY(-4px)`;

        rafId = raf(animate);
      }

      function onEnter() {
        isHovering = true;
        if (rafId) cancelRaf(rafId);
        rafId = raf(animate);
      }

      function onLeave() {
        isHovering = false;
        targetRotX = 0;
        targetRotY = 0;

        function reset() {
          springX.target = 0;
          springY.target = 0;
          const dt = 1 / 60;
          springX.update(dt);
          springY.update(dt);
          card.style.transform = `perspective(1000px) rotateX(${springX.value}deg) rotateY(${springY.value}deg) translateY(0)`;
          if (Math.abs(springX.value) > 0.05 || Math.abs(springY.value) > 0.05) {
            rafId = raf(reset);
          } else {
            card.style.transform = '';
          }
        }
        if (rafId) cancelRaf(rafId);
        rafId = raf(reset);
      }

      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
    });
  }

  // ============== 热点海域交互 ==============
  function initHotspots() {
    const cards = document.querySelectorAll('.hotspot-card');
    const dots = document.querySelectorAll('.hotspot-dots circle');

    if (!cards.length) return;

    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('is-active'));
        card.classList.add('is-active');

        const idx = card.dataset.idx;
        dots.forEach(dot => {
          dot.setAttribute('r', dot.dataset.idx === idx ? '10' : '6');
        });
      });
    });

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = dot.dataset.idx;
        const card = document.querySelector(`.hotspot-card[data-idx="${idx}"]`);
        if (card) {
          cards.forEach(c => c.classList.remove('is-active'));
          card.classList.add('is-active');
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    });
  }

  // ============== 海温频谱条 ==============
  function initSpectrum() {
    const container = document.getElementById('spectrumBars');
    const readingEl = document.getElementById('specReading');
    if (!container) return;

    // 生成 48 条（4 年 × 12 月）
    const barCount = 48;
    const bars = [];
    let animationId = null;

    // 数据：模拟 4 年海温异常值，逐渐上升
    const baseTemps = [];
    for (let i = 0; i < barCount; i++) {
      const trend = 0.3 + (i / barCount) * 1.3;
      const noise = Math.sin(i * 0.8) * 0.15 + Math.sin(i * 0.3) * 0.1;
      const seasonal = Math.sin((i % 12) / 12 * Math.PI * 2) * 0.2;
      baseTemps.push(clamp(trend + noise + seasonal, 0.2, 1.8));
    }

    for (let i = 0; i < barCount; i++) {
      const bar = document.createElement('div');
      bar.className = 'spec-bar';
      bar.style.height = '4px';
      bar.title = `月均异常: +${baseTemps[i].toFixed(2)}°C`;
      container.appendChild(bar);
      bars.push({
        el: bar,
        baseHeight: 20 + baseTemps[i] * 100,
        baseTemp: baseTemps[i],
        currentHeight: 4,
        targetHeight: 20 + baseTemps[i] * 100,
        oscillation: Math.random() * Math.PI * 2,
        speed: 0.8 + Math.random() * 0.6,
        amplitude: 2 + baseTemps[i] * 8,
      });
      updateBarColor(bar, baseTemps[i]);
    }

    function updateBarColor(bar, temp) {
      bar.classList.remove('spec-bar--alive', 'spec-bar--alert', 'spec-bar--extreme');
      if (temp >= 1.4) bar.classList.add('spec-bar--extreme');
      else if (temp >= 1.0) bar.classList.add('spec-bar--alert');
      else if (temp >= 0.7) bar.classList.add('spec-bar--alive');
    }

    // 滚动进入时启动
    let started = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !started) {
          started = true;
          startAnimation();
          // 渐入
          bars.forEach((bar, i) => {
            bar.targetHeight = 20 + baseTemps[i] * 100;
          });
        }
      });
    }, { threshold: 0.3 });

    io.observe(container);

    function startAnimation() {
      let time = 0;
      let reading = 0;
      let readingTarget = 1.52;

      function tick() {
        if (!state.isVisible) {
          animationId = raf(tick);
          return;
        }

        time += 1 / 60;

        bars.forEach((bar, i) => {
          // 每个频段基于 sin 振荡 + 随机脉冲
          bar.oscillation += bar.speed * 0.03;
          const wave = Math.sin(bar.oscillation) * bar.amplitude;
          const pulse = Math.max(0, Math.sin(time * 1.2 + i * 0.4)) * 6;
          const jitter = (Math.random() - 0.5) * 2;

          const newHeight = bar.baseHeight + wave + pulse + jitter;
          bar.el.style.height = Math.max(4, newHeight) + 'px';
        });

        // 读数小幅波动
        reading += (readingTarget + Math.sin(time * 0.8) * 0.03 - reading) * 0.05;
        readingEl.textContent = '+' + reading.toFixed(2);

        animationId = raf(tick);
      }

      animationId = raf(tick);
    }
  }

  // ============== 打字机效果 ==============
  function initTypewriter() {
    const textEl = document.getElementById('floatingStatusText');
    if (!textEl) return;

    const phrases = [
      '监测中… 太平洋海温 +1.52°C',
      '珊瑚礁健康度 24%',
      '大堡礁白化等级: Critical',
      'NOAA 数据实时同步',
      '本月新增 3 处白化海域',
      '全球珊瑚礁保护进度 12%',
    ];

    let currentIdx = 0;
    let timeoutId = null;

    function typePhrase(idx) {
      const phrase = phrases[idx];
      textEl.textContent = '';
      let i = 0;

      function typeChar() {
        if (i < phrase.length) {
          textEl.textContent += phrase[i];
          i++;
          timeoutId = setT(typeChar, 35 + Math.random() * 30);
        } else {
          // 停留后清除
          timeoutId = setT(clearPhrase, 3500);
        }
      }

      function clearPhrase() {
        const text = textEl.textContent;
        if (text.length > 0) {
          textEl.textContent = text.slice(0, -1);
          timeoutId = setT(clearPhrase, 20);
        } else {
          currentIdx = (currentIdx + 1) % phrases.length;
          timeoutId = setT(() => typePhrase(currentIdx), 500);
        }
      }

      typeChar();
    }

    // 延迟启动
    timeoutId = setT(() => typePhrase(0), 2000);
  }

  // ============== 光泽扫过（CTA 按钮等已有 ::before，这里加额外的） ==============
  // 已在 CSS 中实现按钮光泽扫过动效

  // ============== 页面可见性 ==============
  function initVisibility() {
    document.addEventListener('visibilitychange', () => {
      state.isVisible = !document.hidden;
    });
  }

  // ============== 平滑滚动锚点 ==============
  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#' || href.length < 2) return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ============== 卸载清理 ==============
  function cleanup() {
    state.rafIds.forEach(id => cancelAnimationFrame(id));
    state.rafIds.clear();
    state.timeouts.forEach(id => clearTimeout(id));
    state.timeouts.clear();
  }

  window.addEventListener('beforeunload', cleanup);

  // ============== 启动 ==============
  function init() {
    initVisibility();
    initCursor();
    initNav();
    initHeroParallax();
    initCounters();
    initReveal();
    initTiltCards();
    initHotspots();
    initSpectrum();
    initTypewriter();
    initSmoothScroll();

    // 粒子
    initParticles(document.getElementById('particles-canvas'), {
      count: 100,
      colors: ['#E8E4D9', '#C4D7B2', '#E8A87C', '#E85D2C'],
      interactive: true,
    });

    initParticles(document.getElementById('action-particles'), {
      count: 60,
      colors: ['#E8E4D9', '#C4D7B2'],
      interactive: false,
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 宣告可升级
  function announceUpgrade() {
    try {
      window.parent.postMessage({ type: 'miaoda:upgrade:available', kind: 'interactive-prototype' }, '*');
    } catch (e) { /* ignore */ }
  }
  announceUpgrade();
  if (document.readyState !== 'complete') {
    window.addEventListener('load', announceUpgrade, { once: true });
  } else {
    announceUpgrade();
  }
})();
