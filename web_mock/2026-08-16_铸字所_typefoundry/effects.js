/* ============================================================
   铸字所 The Typefoundry — 交互与动效系统
   - 所有动画循环通过 RAF 调度器统一管理
   - 页面不可见时自动暂停（visibilitychange）
   - 卸载时统一取消，杜绝泄漏
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 工具 ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- RAF 调度器 ---------- */
  let rafId = null;
  const rafTasks = new Set();
  let pageVisible = !document.hidden;

  function rafLoop() {
    if (!pageVisible) { rafId = null; return; }
    rafTasks.forEach(fn => {
      try { fn(); } catch (e) { /* 静默 */ }
    });
    rafId = requestAnimationFrame(rafLoop);
  }

  function startRaf() {
    if (rafId || !pageVisible || rafTasks.size === 0) return;
    rafId = requestAnimationFrame(rafLoop);
  }

  function stopRaf() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  function addRafTask(fn) {
    rafTasks.add(fn);
    startRaf();
  }

  function removeRafTask(fn) {
    rafTasks.delete(fn);
    if (rafTasks.size === 0) stopRaf();
  }

  /* 页面可见性切换 */
  document.addEventListener('visibilitychange', () => {
    pageVisible = !document.hidden;
    if (pageVisible) {
      startRaf();
      // 重新启动间隔型动画
      startAllIntervals();
    } else {
      stopRaf();
      clearAllIntervals();
    }
  });

  /* 卸载清理 */
  window.addEventListener('beforeunload', () => {
    stopRaf();
    clearAllIntervals();
  });

  /* ---------- 定时器统一管理 ---------- */
  const intervals = new Map();
  let intervalIdCounter = 0;

  function addInterval(fn, delay) {
    const id = ++intervalIdCounter;
    const handle = setInterval(fn, delay);
    intervals.set(id, { fn, delay, handle });
    return id;
  }

  function clearIntervalById(id) {
    const item = intervals.get(id);
    if (item) { clearInterval(item.handle); intervals.delete(id); }
  }

  function clearAllIntervals() {
    intervals.forEach(item => clearInterval(item.handle));
    intervals.clear();
  }

  function startAllIntervals() {
    // 此处若需恢复精确间隔定时器，可遍历 intervals 重建；
    // 当前设计的间隔动画多为装饰性，重启即可。
  }

  /* ============================================================
     1. 自定义光标
     ============================================================ */
  const cursorOuter = $('#cursorOuter');
  const cursorInner = $('#cursorInner');

  if (cursorOuter && cursorInner && !prefersReducedMotion && window.innerWidth > 768) {
    // 弹簧物理模型：目标位置 → 当前位置（带阻尼）
    const cursor = {
      tx: window.innerWidth / 2,
      ty: window.innerHeight / 2,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: 0, vy: 0,
      k: 0.15,    // 弹簧刚度
      d: 0.6     // 阻尼
    };

    // 初始即显示在屏幕中央
    cursorOuter.style.left = cursor.x + 'px';
    cursorOuter.style.top = cursor.y + 'px';
    cursorInner.style.left = cursor.x + 'px';
    cursorInner.style.top = cursor.y + 'px';

    document.addEventListener('mousemove', (e) => {
      cursor.tx = e.clientX;
      cursor.ty = e.clientY;
    }, { passive: true });

    function updateCursor() {
      // Hooke 弹簧积分
      const dx = cursor.tx - cursor.x;
      const dy = cursor.ty - cursor.y;
      const ax = dx * cursor.k - cursor.vx * cursor.d;
      const ay = dy * cursor.k - cursor.vy * cursor.d;
      cursor.vx += ax;
      cursor.vy += ay;
      cursor.x += cursor.vx;
      cursor.y += cursor.vy;

      cursorOuter.style.transform = `translate(${cursor.x}px, ${cursor.y}px) translate(-50%, -50%)`;
      cursorInner.style.transform = `translate(${cursor.tx}px, ${cursor.ty}px) translate(-50%, -50%)`;
    }
    addRafTask(updateCursor);

    // 悬停可交互元素时形态变化
    const hoverSelector = 'a, button, .craft-card, .type-sample, .font-card, input, textarea, select, [data-tilt]';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverSelector)) {
        cursorOuter.classList.add('hover');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverSelector)) {
        cursorOuter.classList.remove('hover');
      }
    });

    // 点击涟漪
    document.addEventListener('mousedown', (e) => {
      const ripple = document.createElement('div');
      ripple.className = 'cursor-ripple';
      ripple.style.left = e.clientX + 'px';
      ripple.style.top = e.clientY + 'px';
      document.body.appendChild(ripple);
      setTimeout(() => { if (ripple.parentNode) ripple.remove(); }, 600);

      cursorOuter.classList.add('click');
      setTimeout(() => cursorOuter.classList.remove('click'), 150);
    });
  }

  /* ============================================================
     2. 粒子系统（浮动墨点 — 受鼠标轻微引力）
     ============================================================ */
  const particleContainer = $('#particles');

  if (particleContainer && !prefersReducedMotion && window.innerWidth > 768) {
    const PARTICLE_COUNT = 28;
    const particles = [];
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    document.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const el = document.createElement('div');
      el.className = 'particle';
      const size = 2 + Math.random() * 6;
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      particleContainer.appendChild(el);

      particles.push({
        el,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size,
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 0.5
      });
    }

    function updateParticles() {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 基础布朗运动
        p.phase += 0.005 * p.speed;
        p.vx += Math.sin(p.phase) * 0.01;
        p.vy += Math.cos(p.phase * 1.3) * 0.01;

        // 鼠标反平方引力（磁性吸引，但距离过近时推开 — 模拟磁偶极）
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);
        if (dist < 200 && dist > 1) {
          const force = 0.5 / (distSq * 0.001 + 1);
          if (dist < 60) {
            // 近距离排斥
            p.vx -= (dx / dist) * force * 0.3;
            p.vy -= (dy / dist) * force * 0.3;
          } else {
            // 中远距离吸引
            p.vx += (dx / dist) * force * 0.15;
            p.vy += (dy / dist) * force * 0.15;
          }
        }

        // 阻尼摩擦
        p.vx *= 0.98;
        p.vy *= 0.98;

        p.x += p.vx;
        p.y += p.vy;

        // 边界环绕
        if (p.x < -20) p.x = window.innerWidth + 20;
        if (p.x > window.innerWidth + 20) p.x = -20;
        if (p.y < -20) p.y = window.innerHeight + 20;
        if (p.y > window.innerHeight + 20) p.y = -20;

        p.el.style.transform = `translate(${p.x}px, ${p.y}px)`;
      }
    }
    addRafTask(updateParticles);
  }

  /* ============================================================
     3. 滚动渐入 (IntersectionObserver)
     ============================================================ */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    $$('.reveal').forEach(el => io.observe(el));
  } else {
    $$('.reveal').forEach(el => el.classList.add('visible'));
  }

  /* ============================================================
     4. 视差（活字大背景）
     ============================================================ */
  const parallaxEls = $$('[data-parallax]');

  if (parallaxEls.length && !prefersReducedMotion) {
    let scrollY = window.scrollY;
    let targetScrollY = scrollY;
    let rafActive = false;

    window.addEventListener('scroll', () => {
      targetScrollY = window.scrollY;
      if (!rafActive) {
        rafActive = true;
        requestAnimationFrame(updateParallax);
      }
    }, { passive: true });

    function updateParallax() {
      // 惯性阻尼
      scrollY += (targetScrollY - scrollY) * 0.1;

      parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.05;
        const rect = el.getBoundingClientRect();
        const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
        const y = -offset * speed;
        el.style.transform = `translateY(${y}px) rotate(${el.classList.contains('type-slab-1') ? -8 : el.classList.contains('type-slab-2') ? 5 : -3}deg)`;
      });

      if (Math.abs(targetScrollY - scrollY) > 0.5) {
        requestAnimationFrame(updateParallax);
      } else {
        rafActive = false;
      }
    }
    updateParallax();
  }

  /* ============================================================
     5. 卡片 3D 倾斜（直接操作 DOM transform，不触发重渲染）
     ============================================================ */
  const tiltCards = $$('[data-tilt]');

  if (tiltCards.length && !prefersReducedMotion && window.innerWidth > 768) {
    tiltCards.forEach(card => {
      let rafPending = false;
      let targetRx = 0, targetRy = 0;
      let curRx = 0, curRy = 0;

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        targetRy = ((x - cx) / cx) * 6;  // 左右倾斜
        targetRx = -((y - cy) / cy) * 4; // 上下倾斜
        if (!rafPending) {
          rafPending = true;
          requestAnimationFrame(animateTilt);
        }
      });

      card.addEventListener('mouseleave', () => {
        targetRx = 0;
        targetRy = 0;
        if (!rafPending) {
          rafPending = true;
          requestAnimationFrame(animateTilt);
        }
      });

      function animateTilt() {
        // 弹簧阻尼插值
        curRx += (targetRx - curRx) * 0.12;
        curRy += (targetRy - curRy) * 0.12;

        card.style.transform = `perspective(1000px) rotateX(${curRx}deg) rotateY(${curRy}deg) translateY(-8px)`;

        if (Math.abs(targetRx - curRx) > 0.05 || Math.abs(targetRy - curRy) > 0.05) {
          requestAnimationFrame(animateTilt);
        } else {
          card.style.transform = `perspective(1000px) rotateX(${targetRx}deg) rotateY(${targetRy}deg)`;
          rafPending = false;
        }
      }
    });
  }

  /* ============================================================
     6. 打字机效果（Hero 副标题）
     ============================================================ */
  const typewriterEl = $('#typewriter');

  if (typewriterEl) {
    const texts = [
      '让铅与火在纸上留下温度',
      '每一颗字都是手作的艺术品',
      '古法铸字 · 匠心传承',
      '排版之美，尽在方寸之间'
    ];
    let textIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typewriterTimer = null;

    function typeNext() {
      if (prefersReducedMotion) {
        typewriterEl.textContent = texts[0];
        return;
      }

      const currentText = texts[textIdx];

      if (!isDeleting) {
        charIdx++;
        typewriterEl.textContent = currentText.slice(0, charIdx);
        if (charIdx === currentText.length) {
          isDeleting = true;
          clearTimeout(typewriterTimer);
          typewriterTimer = setTimeout(typeNext, 2200);
          return;
        }
        clearTimeout(typewriterTimer);
        typewriterTimer = setTimeout(typeNext, 80 + Math.random() * 60);
      } else {
        charIdx--;
        typewriterEl.textContent = currentText.slice(0, charIdx);
        if (charIdx === 0) {
          isDeleting = false;
          textIdx = (textIdx + 1) % texts.length;
          clearTimeout(typewriterTimer);
          typewriterTimer = setTimeout(typeNext, 400);
          return;
        }
        clearTimeout(typewriterTimer);
        typewriterTimer = setTimeout(typeNext, 40);
      }
    }

    // 页面加载后延迟启动
    setTimeout(typeNext, 1800);

    // 卸载清理
    window.addEventListener('beforeunload', () => {
      if (typewriterTimer) clearTimeout(typewriterTimer);
    });
  }

  /* ============================================================
     7. 数字计数动画（工坊数据）
     ============================================================ */
  const counters = $$('[data-count]');

  if (counters.length) {
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          counterIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterIO.observe(el));
  }

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1800 + Math.random() * 600;
    const startTime = performance.now();
    let rafId = null;

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = value.toLocaleString();

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
      }
    }

    if (prefersReducedMotion) {
      el.textContent = target.toLocaleString();
    } else {
      rafId = requestAnimationFrame(step);
    }

    // 页面不可见时暂停（保存进度）
    function onVisibility() {
      if (document.hidden) {
        if (rafId) cancelAnimationFrame(rafId);
      }
    }
    document.addEventListener('visibilitychange', onVisibility, { once: true });
  }

  /* ============================================================
     8. 频谱条动画（工坊徽章装饰）
     ============================================================ */
  const spectrum = $('#spectrum');

  if (spectrum && !prefersReducedMotion) {
    const BAR_COUNT = 24;
    const bars = [];

    for (let i = 0; i < BAR_COUNT; i++) {
      const bar = document.createElement('div');
      bar.className = 'spectrum-bar';
      bar.style.height = '4px';
      spectrum.appendChild(bar);
      bars.push({
        el: bar,
        phase: Math.random() * Math.PI * 2,
        speed: 0.8 + Math.random() * 1.2,
        amp: 0.3 + Math.random() * 0.7
      });
    }

    let t = 0;
    function updateSpectrum() {
      t += 0.02;
      bars.forEach(b => {
        const h = 4 + Math.abs(Math.sin(t * b.speed + b.phase)) * 36 * b.amp;
        b.el.style.height = h + 'px';
        b.el.style.opacity = 0.4 + Math.abs(Math.sin(t * b.speed * 0.7 + b.phase)) * 0.6;
      });
    }
    addRafTask(updateSpectrum);
  }

  /* ============================================================
     9. 字体分类 Tab 切换
     ============================================================ */
  const fontData = {
    song: [
      { char: '永', name: '永字老宋', meta: 'No.1 · 初号' },
      { char: '墨', name: '墨香宋体', meta: 'No.2 · 一号' },
      { char: '春', name: '春日仿宋', meta: 'No.3 · 二号' },
      { char: '海', name: '海藏宋', meta: 'No.4 · 三号' }
    ],
    kai: [
      { char: '龍', name: '龙纹楷', meta: 'K-01 · 初号' },
      { char: '鳳', name: '凤翔楷', meta: 'K-02 · 一号' },
      { char: '虎', name: '虎跑楷', meta: 'K-03 · 二号' },
      { char: '雲', name: '云栖楷', meta: 'K-04 · 三号' }
    ],
    hei: [
      { char: '方', name: '方正黑', meta: 'H-01 · 初号' },
      { char: '圓', name: '圆融黑', meta: 'H-02 · 一号' },
      { char: '鐵', name: '铁线黑', meta: 'H-03 · 二号' },
      { char: '金', name: '金石黑', meta: 'H-04 · 三号' }
    ],
    fangsong: [
      { char: '竹', name: '竹简仿宋', meta: 'F-01 · 一号' },
      { char: '蘭', name: '兰若仿宋', meta: 'F-02 · 二号' },
      { char: '梅', name: '梅溪仿宋', meta: 'F-03 · 三号' },
      { char: '菊', name: '菊隐仿宋', meta: 'F-04 · 四号' }
    ]
  };

  const fontGrid = $('#fontGrid');
  const tabs = $$('.collection-tab');
  let currentTab = 'song';

  function renderFontCards(key) {
    if (!fontGrid || !fontData[key]) return;
    currentTab = key;

    // 淡出
    fontGrid.style.opacity = '0';
    fontGrid.style.transform = 'translateY(16px)';
    fontGrid.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

    setTimeout(() => {
      const data = fontData[key];
      fontGrid.innerHTML = data.map((item, i) => `
        <div class="font-card" style="transition-delay: ${i * 0.05}s">
          <div class="font-card-ink"></div>
          <div class="font-card-preview">${item.char}</div>
          <div class="font-card-footer">
            <div class="font-card-name">${item.name}</div>
            <div class="font-card-meta">${item.meta}</div>
          </div>
        </div>
      `).join('');

      // 强制重绘
      fontGrid.offsetHeight;
      fontGrid.style.opacity = '1';
      fontGrid.style.transform = 'translateY(0)';
    }, 300);
  }

  if (tabs.length && fontGrid) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderFontCards(tab.dataset.tab);
      });
    });
    // 初始渲染
    renderFontCards('song');
  }

  /* ============================================================
     10. 油墨晕染过渡（点击 CTA 按钮时）
     ============================================================ */
  const inkTransition = $('#inkTransition');

  function triggerInkTransition(x, y) {
    if (!inkTransition || prefersReducedMotion) return;
    inkTransition.style.setProperty('--ink-x', x + 'px');
    inkTransition.style.setProperty('--ink-y', y + 'px');
    inkTransition.classList.remove('active');
    // 强制重绘
    void inkTransition.offsetWidth;
    inkTransition.classList.add('active');
  }

  // 导航链接点击时触发
  $$('.nav-links a, .btn-primary, .nav-cta').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      triggerInkTransition(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  });

  /* ============================================================
     11. 光泽扫过（活字标本卡 hover 已有 CSS，此处增强）
     ============================================================ */
  // 已通过 CSS ::after + left 过渡实现，见 type-sample::after

  /* ============================================================
     12. 脉冲徽标
     ============================================================ */
  // 已通过 CSS @keyframes pulseRing 实现，见 .pulse-dot::after

  /* ============================================================
     13. 滚动提示线动画
     ============================================================ */
  // 已通过 CSS @keyframes scrollDown 实现

  /* ============================================================
     14. 表单提交交互
     ============================================================ */
  window.handleSubmit = function (e) {
    if (e && e.preventDefault) e.preventDefault();
    const btn = e ? e.target : null;
    if (!btn) return;

    const originalText = btn.textContent;
    btn.textContent = '提交中...';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = '✓ 已收到';
      btn.style.background = '#1F8A5B';
      btn.style.opacity = '1';

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 2500);
    }, 1200);
  };

  /* ============================================================
     15. 平滑滚动到节段
     ============================================================ */
  window.scrollToSection = function (id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 导航锚点平滑滚动
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ============================================================
     16. 导航滚动阴影
     ============================================================ */
  const nav = $('.nav');
  if (nav) {
    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
      lastScroll = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(() => {
          if (lastScroll > 50) {
            nav.style.boxShadow = '0 4px 24px rgba(26, 28, 30, 0.08)';
            nav.style.paddingTop = '16px';
            nav.style.paddingBottom = '16px';
          } else {
            nav.style.boxShadow = 'none';
            nav.style.paddingTop = '24px';
            nav.style.paddingBottom = '24px';
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ============================================================
     17. 活字标本行 hover 视差偏移
     ============================================================ */
  const typeSamples = $$('.type-sample');
  if (typeSamples.length && !prefersReducedMotion && window.innerWidth > 768) {
    typeSamples.forEach(sample => {
      sample.addEventListener('mousemove', (e) => {
        const rect = sample.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const pct = x / rect.width - 0.5;
        const text = sample.querySelector('.type-sample-text');
        if (text) {
          text.style.transform = `translateX(${pct * 12}px)`;
        }
      });
      sample.addEventListener('mouseleave', () => {
        const text = sample.querySelector('.type-sample-text');
        if (text) text.style.transform = 'translateX(0)';
      });
    });
  }

  /* ============================================================
     宣告可升级为全栈应用
     ============================================================ */
  function announceUpgrade() {
    try {
      window.parent.postMessage({ type: 'miaoda:upgrade:available', kind: 'interactive-prototype' }, '*');
    } catch (e) { /* 跨域忽略 */ }
  }
  announceUpgrade();
  if (document.readyState !== 'complete') {
    window.addEventListener('load', announceUpgrade, { once: true });
  }

})();
