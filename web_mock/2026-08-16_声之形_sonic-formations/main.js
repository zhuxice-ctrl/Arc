// Sonic Formations — 交互脚本
(function () {
  "use strict";

  /* -----------------------------------------------------------
     1. 导航滚动效果
  ----------------------------------------------------------- */
  const nav = document.getElementById("nav");
  const onScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
    updateScrollProgress();
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* -----------------------------------------------------------
     2. 滚动进度条
  ----------------------------------------------------------- */
  const scrollProgress = document.getElementById("scrollProgress");
  function updateScrollProgress() {
    if (!scrollProgress) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = percent + "%";
  }

  /* -----------------------------------------------------------
     3. 自定义光标 — 声波涟漪
  ----------------------------------------------------------- */
  const cursor = document.getElementById("cursorRipple");
  // 桌面端默认开启自定义光标，触屏设备关闭
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (cursor && !isTouch) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    // 立刻显示并启动渲染循环
    cursor.style.opacity = "1";
    cursor.style.display = "block";
    cursor.style.visibility = "visible";
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;

    // 标记body，CSS据此隐藏系统光标
    document.body.classList.add("custom-cursor-on");

    const renderCursor = () => {
      cursorX += (mouseX - cursorX) * 0.18;
      cursorY += (mouseY - cursorY) * 0.18;
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
      requestAnimationFrame(renderCursor);
    };
    // 立即启动，不等鼠标移动
    requestAnimationFrame(renderCursor);

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.opacity = "1";
    });

    // 鼠标离开窗口时隐藏
    document.addEventListener("mouseleave", () => {
      cursor.style.opacity = "0";
    });
    document.addEventListener("mouseenter", () => {
      cursor.style.opacity = "1";
    });

    // 悬浮在可交互元素上放大
    const hoverTargets = "a, button, input, .work-card, .theme-card, .artist-item, .tilt-wrap, .tilt-card, details summary, .partner-item, .timeline-card, .cd-unit";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(hoverTargets)) {
        cursor.classList.add("hovering");
      }
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(hoverTargets)) {
        cursor.classList.remove("hovering");
      }
    });

    // 点击涟漪
    document.addEventListener("mousedown", () => {
      cursor.classList.remove("clicking");
      void cursor.offsetWidth; // 强制回流重播
      cursor.classList.add("clicking");
    });
  }

  /* -----------------------------------------------------------
     4. 浮动光点粒子
  ----------------------------------------------------------- */
  const particlesContainer = document.getElementById("particles");
  if (particlesContainer) {
    const PARTICLE_COUNT = 60;
    const colors = [
      "var(--accent-teal)",
      "var(--accent-amber)",
      "var(--accent-orange)",
      "var(--accent-gold)",
      "rgba(255, 255, 255, 0.8)",
    ];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = document.createElement("span");
      p.className = "particle";
      const left = Math.random() * 100;
      const size = 1 + Math.random() * 5;
      const duration = 12 + Math.random() * 30;
      const delay = Math.random() * -40;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const drift = (Math.random() - 0.5) * 160;
      p.style.left = left + "%";
      p.style.bottom = "-10px";
      p.style.width = size + "px";
      p.style.height = size + "px";
      p.style.background = color;
      p.style.boxShadow = `0 0 ${size * 3}px ${color}`;
      p.style.animationDuration = duration + "s";
      p.style.animationDelay = delay + "s";
      p.style.setProperty("--drift", drift + "px");
      // 自定义飘移路径
      p.style.animationName = "particleFloatCustom";
      particlesContainer.appendChild(p);
    }

    // 注入自定义 keyframes（因为每颗粒子漂移不同，这里共用一个随机版本）
    const styleEl = document.createElement("style");
    styleEl.textContent = `
      @keyframes particleFloatCustom {
        0% { transform: translateY(0) translateX(0); opacity: 0; }
        10% { opacity: 0.7; }
        90% { opacity: 0.4; }
        100% { transform: translateY(-110vh) translateX(var(--drift, 40px)); opacity: 0; }
      }
    `;
    document.head.appendChild(styleEl);
  }

  /* -----------------------------------------------------------
     5. Hero 音频频谱条 — 随机节奏
  ----------------------------------------------------------- */
  const spectrum = document.getElementById("spectrum");
  if (spectrum) {
    const BAR_COUNT = 36;
    const bars = [];

    // 创建频谱条
    for (let i = 0; i < BAR_COUNT; i++) {
      const bar = document.createElement("span");
      // 中间条粗一点、两边细一点，模拟真实频谱分布
      const centerDist = Math.abs(i - (BAR_COUNT - 1) / 2);
      const baseWidth = 2 + (1 - centerDist / (BAR_COUNT / 2)) * 3;
      bar.style.width = baseWidth.toFixed(1) + "px";
      bar.style.height = (20 + Math.random() * 60) + "%";
      spectrum.appendChild(bar);
      bars.push({
        el: bar,
        height: 20 + Math.random() * 60,
        target: 20 + Math.random() * 60,
        speed: 0.08 + Math.random() * 0.15,
        baseWidth: baseWidth,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // 节拍脉冲：每隔一段时间来一下大的
    let beatTimer = 0;
    const BEAT_INTERVAL = 1200 + Math.random() * 800; // 1.2-2秒

    function animateSpectrum(delta) {
      beatTimer += delta;
      const beatPulse = Math.max(0, 1 - beatTimer / BEAT_INTERVAL); // 0到1

      bars.forEach((bar, i) => {
        // 缓慢游走的目标高度
        bar.phase += delta * 0.002 * (0.5 + Math.random() * 0.5);
        const sineOffset = Math.sin(bar.phase + i * 0.3) * 30;

        // 随机微扰
        if (Math.random() < 0.05) {
          bar.target = 15 + Math.random() * 80 + sineOffset;
        }

        // 节拍影响：节拍来临时，对应位置的条跳高
        const beatBoost = beatPulse * beatPulse * (30 + Math.random() * 40);

        // 缓动逼近目标
        bar.height += (bar.target + beatBoost - bar.height) * bar.speed;

        // 夹在范围里
        bar.height = Math.max(4, Math.min(100, bar.height));

        bar.el.style.height = bar.height + "%";
      });
    }

    // 用RAF驱动
    let lastTime = performance.now();
    function loop(now) {
      const delta = now - lastTime;
      lastTime = now;

      if (beatTimer > BEAT_INTERVAL) {
        beatTimer = 0;
      }

      animateSpectrum(delta);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  /* -----------------------------------------------------------
     6. 打字机效果 — Hero 标题
  ----------------------------------------------------------- */
  const typewriterEls = document.querySelectorAll("[data-typewriter]");
  typewriterEls.forEach((el, idx) => {
    const text = el.textContent;
    el.textContent = "";
    el.classList.add("typing");
    let i = 0;
    const startDelay = 800 + idx * 600;
    const speed = 140;

    setTimeout(() => {
      const type = () => {
        if (i < text.length) {
          el.textContent += text.charAt(i);
          i++;
          setTimeout(type, speed + Math.random() * 80);
        } else {
          // 打完后延迟移除光标
          setTimeout(() => el.classList.remove("typing"), 1500);
        }
      };
      type();
    }, startDelay);
  });

  /* -----------------------------------------------------------
     7. 数字计数动画
  ----------------------------------------------------------- */
  const countEls = document.querySelectorAll("[data-count]");
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute("data-count"), 10);
          animateCount(el, target);
          countObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );
  countEls.forEach((el) => countObserver.observe(el));

  function animateCount(el, target) {
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    };
    requestAnimationFrame(step);
  }

  /* -----------------------------------------------------------
     8. 作品卡片 3D 倾斜 + 光晕跟随
  ----------------------------------------------------------- */
  const tiltWraps = document.querySelectorAll(".tilt-wrap");
  tiltWraps.forEach((wrap) => {
    const card = wrap.querySelector(".work-card");
    const glow = card.querySelector(".card-glow");

    wrap.addEventListener("mousemove", (e) => {
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // 计算倾斜角度（±8度）
      const rotateY = ((x - centerX) / centerX) * 8;
      const rotateX = -((y - centerY) / centerY) * 8;

      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;

      if (glow) {
        glow.style.left = x + "px";
        glow.style.top = y + "px";
      }
    });

    wrap.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1200px) rotateX(0) rotateY(0) translateZ(0)";
      card.style.transition = "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)";
    });

    wrap.addEventListener("mouseenter", () => {
      card.style.transition = "none";
    });
  });

  /* -----------------------------------------------------------
     9. 按钮涟漪点击特效
  ----------------------------------------------------------- */
  document.querySelectorAll(".btn-ripple").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const ripple = document.createElement("span");
      ripple.className = "ripple-circle";
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  /* -----------------------------------------------------------
     10. 滚动出现动画
  ----------------------------------------------------------- */
  const revealTargets = [
    ".section-header",
    ".about-text",
    ".about-image",
    ".theme-card",
    ".artist-item",
    ".work-card",
    ".venue-info",
    ".ticket-card",
    ".footer-brand",
    ".footer-cols",
  ];

  const elements = document.querySelectorAll(revealTargets.join(","));
  elements.forEach((el) => el.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    elements.forEach((el) => observer.observe(el));
  } else {
    elements.forEach((el) => el.classList.add("visible"));
  }

  // 主题卡片错位动画
  const themeCards = document.querySelectorAll(".theme-card");
  themeCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 80}ms`;
  });

  // 艺术家卡片错位动画
  const artistItems = document.querySelectorAll(".artist-item");
  artistItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 60}ms`;
  });

  /* -----------------------------------------------------------
     11. 平滑滚动
  ----------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (targetId === "#" || targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.scrollY - 20;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    });
  });

  /* -----------------------------------------------------------
     12. 视差 — Hero 背景随鼠标轻微移动
  ----------------------------------------------------------- */
  const heroBg = document.querySelector(".hero-bg img");
  if (heroBg && window.matchMedia("(pointer: fine)").matches) {
    let bgX = 0, bgY = 0;
    let targetX = 0, targetY = 0;

    window.addEventListener("mousemove", (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 20;
      targetY = (e.clientY / window.innerHeight - 0.5) * 12;
    });

    const parallaxLoop = () => {
      bgX += (targetX - bgX) * 0.04;
      bgY += (targetY - bgY) * 0.04;
      heroBg.style.transform = `scale(1.08) translate(${bgX}px, ${bgY}px)`;
      requestAnimationFrame(parallaxLoop);
    };
    parallaxLoop();
  }

  /* -----------------------------------------------------------
     13. 展期倒计时
  ----------------------------------------------------------- */
  const clockEl = document.getElementById("countdownClock");
  if (clockEl) {
    // 目标日期：2026 年 9 月 15 日 10:00
    const targetDate = new Date("2026-09-15T10:00:00+08:00").getTime();

    const pad = (n) => String(n).padStart(2, "0");

    function updateCountdown() {
      const now = Date.now();
      let diff = Math.max(0, targetDate - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      diff -= days * 1000 * 60 * 60 * 24;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      diff -= hours * 1000 * 60 * 60;
      const minutes = Math.floor(diff / (1000 * 60));
      diff -= minutes * 1000 * 60;
      const seconds = Math.floor(diff / 1000);

      const dEl = clockEl.querySelector('[data-countdown="days"]');
      const hEl = clockEl.querySelector('[data-countdown="hours"]');
      const mEl = clockEl.querySelector('[data-countdown="minutes"]');
      const sEl = clockEl.querySelector('[data-countdown="seconds"]');

      if (dEl) dEl.textContent = pad(days);
      if (hEl) hEl.textContent = pad(hours);
      if (mEl) mEl.textContent = pad(minutes);
      if (sEl) sEl.textContent = pad(seconds);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  /* -----------------------------------------------------------
     14. 艺术家语录轮播
  ----------------------------------------------------------- */
  const slider = document.getElementById("quotesSlider");
  if (slider) {
    const track = slider.querySelector(".quotes-track");
    const dots = slider.querySelectorAll(".quotes-dots .dot");
    const total = dots.length;
    let current = 0;
    let timer = null;

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => {
        d.classList.toggle("active", i === current);
      });
    }

    function startAuto() {
      stopAuto();
      timer = setInterval(() => goTo(current + 1), 5000);
    }

    function stopAuto() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const idx = parseInt(dot.getAttribute("data-index"), 10);
        goTo(idx);
        startAuto();
      });
    });

    slider.addEventListener("mouseenter", stopAuto);
    slider.addEventListener("mouseleave", startAuto);

    startAuto();
  }

  /* -----------------------------------------------------------
     15. 补充滚动出现动画目标（新增板块）
  ----------------------------------------------------------- */
  const extraRevealTargets = [
    ".countdown-left",
    ".countdown-clock",
    ".timeline-item",
    ".quotes-slider",
    ".partner-item",
    ".faq-item",
  ];
  const extraEls = document.querySelectorAll(extraRevealTargets.join(","));
  extraEls.forEach((el) => el.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const extraObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            extraObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    extraEls.forEach((el) => extraObserver.observe(el));
  } else {
    extraEls.forEach((el) => el.classList.add("visible"));
  }

  // 时间线条目错位延迟
  const timelineItems = document.querySelectorAll(".timeline-item");
  timelineItems.forEach((item, i) => {
    item.style.transitionDelay = `${i * 100}ms`;
  });

  // 合作伙伴错位延迟
  const partnerItems = document.querySelectorAll(".partner-item");
  partnerItems.forEach((item, i) => {
    item.style.transitionDelay = `${i * 50}ms`;
  });

  // FAQ 错位延迟
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item, i) => {
    item.style.transitionDelay = `${i * 60}ms`;
  });
})();
