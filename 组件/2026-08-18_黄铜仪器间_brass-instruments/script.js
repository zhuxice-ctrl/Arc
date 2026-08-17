/* =========================================================
   黄铜仪器间 · V3 UX 交互设计 —— 主脚本
   纯 vanilla JS，无依赖
   ========================================================= */
(function () {
  'use strict';

  // ---------- 工具函数 ----------
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const mapRange = (v, inMin, inMax, outMin, outMax) =>
    outMin + ((v - inMin) / (inMax - inMin)) * (outMax - outMin);

  // 检测 prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- RAF 管理：visibilitychange 时暂停，卸载时清理 ----------
  const rafCallbacks = new Set();
  let rafId = null;
  let isPageVisible = true;

  function addRaf(fn) {
    rafCallbacks.add(fn);
    if (!rafId && isPageVisible && !prefersReducedMotion) {
      rafId = requestAnimationFrame(rafLoop);
    }
  }
  function removeRaf(fn) {
    rafCallbacks.delete(fn);
    if (rafCallbacks.size === 0 && rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }
  function rafLoop(ts) {
    rafId = null;
    if (!isPageVisible || prefersReducedMotion) return;
    rafCallbacks.forEach(fn => fn(ts));
    if (rafCallbacks.size > 0) {
      rafId = requestAnimationFrame(rafLoop);
    }
  }

  document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
    if (isPageVisible && rafCallbacks.size > 0 && !rafId && !prefersReducedMotion) {
      rafId = requestAnimationFrame(rafLoop);
    }
  });

  // 页面卸载时统一取消
  window.addEventListener('beforeunload', () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    rafCallbacks.clear();
  });

  /* =========================================================
     自定义光标
     ========================================================= */
  const cursor = $('#customCursor');
  const cursorRipple = $('#cursorRipple');

  const cursorState = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    targetX: window.innerWidth / 2,
    targetY: window.innerHeight / 2,
    state: 'default' // default / hover / drag
  };

  function updateCursor() {
    // 缓动跟随
    cursorState.x = lerp(cursorState.x, cursorState.targetX, 0.18);
    cursorState.y = lerp(cursorState.y, cursorState.targetY, 0.18);
    cursor.style.transform = `translate(${cursorState.x}px, ${cursorState.y}px)`;
  }
  addRaf(updateCursor);

  document.addEventListener('mousemove', (e) => {
    cursorState.targetX = e.clientX;
    cursorState.targetY = e.clientY;
    if (!cursor.classList.contains('visible')) {
      cursor.classList.add('visible');
    }
  }, { passive: true });

  // 初始就显示在屏幕中央
  cursor.style.transform = `translate(${cursorState.x}px, ${cursorState.y}px)`;

  // 点击涟漪
  document.addEventListener('mousedown', (e) => {
    cursorRipple.classList.remove('animate');
    // 强制 reflow 重启动画
    void cursorRipple.offsetWidth;
    cursorRipple.classList.add('animate');
  });

  // hover / drag 状态切换
  function setCursorState(state) {
    cursorState.state = state;
    cursor.classList.toggle('hover', state === 'hover');
    cursor.classList.toggle('drag', state === 'drag');
  }

  // 标记可交互元素（所有带 data-cursor 的 + 默认可拖拽元素）
  function setupCursorTargets() {
    const hoverSelectors = [
      '.cord-knob', '.knob', '.toggle-switch', '.key-assembly',
      '.lever-handle', '.pin', '.exhibit-card'
    ];
    const dragSelectors = [
      '.cord-knob', '.knob', '.key-assembly', '.lever-handle', '.pin'
    ];

    $$(hoverSelectors.join(', ')).forEach(el => {
      el.addEventListener('mouseenter', () => setCursorState('hover'));
      el.addEventListener('mouseleave', () => {
        if (cursorState.state === 'hover') setCursorState('default');
      });
    });

    $$(dragSelectors.join(', ')).forEach(el => {
      el.addEventListener('mousedown', () => setCursorState('drag'));
      el.addEventListener('touchstart', () => setCursorState('drag'), { passive: true });
    });

    document.addEventListener('mouseup', () => {
      if (cursorState.state === 'drag') setCursorState('hover');
    });
    document.addEventListener('touchend', () => {
      if (cursorState.state === 'drag') setCursorState('default');
    });
  }

  /* =========================================================
     滚动渐入
     ========================================================= */
  function setupReveal() {
    const cards = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
      cards.forEach(c => c.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // 错峰渐入
          const delay = (i % 3) * 0.12;
          entry.target.style.transitionDelay = `${delay}s`;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    cards.forEach(c => io.observe(c));
  }

  /* =========================================================
     视差（卡片轻微 3D 倾斜）
     高频 mousemove 直接操作 transform，不触发 React/重渲染
     ========================================================= */
  function setupParallax() {
    if (prefersReducedMotion) return;

    $$('.exhibit-card').forEach((card) => {
      let tx = 0, ty = 0, targetTx = 0, targetTy = 0;
      let active = false;
      let rafActive = false;

      function tick() {
        if (!active && Math.abs(targetTx - tx) < 0.05 && Math.abs(targetTy - ty) < 0.05) {
          rafActive = false;
          return;
        }
        tx = lerp(tx, targetTx, 0.1);
        ty = lerp(ty, targetTy, 0.1);
        card.style.transform = `perspective(800px) rotateX(${ty}deg) rotateY(${tx}deg) translateY(-2px)`;
        if (rafActive) requestAnimationFrame(tick);
      }

      card.addEventListener('mouseenter', () => {
        active = true;
        if (!rafActive) { rafActive = true; requestAnimationFrame(tick); }
      });

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        targetTx = x * 6;   // 左右倾斜
        targetTy = -y * 4;  // 上下倾斜（上=下俯）
      });

      card.addEventListener('mouseleave', () => {
        active = false;
        targetTx = 0;
        targetTy = 0;
        if (!rafActive) { rafActive = true; requestAnimationFrame(tick); }
        card.style.transform = '';
      });
    });
  }

  /* =========================================================
     展区 1：吊绳煤气灯
     拖拽拉绳 → 点亮/熄灭，光锥与光斑变化
     ========================================================= */
  function setupLamp() {
    const knob = $('#cordKnob');
    const wrap = $('#pullCordWrap');
    const cordPath = $('#cordPath');
    const bulb = $('#lampBulb');
    const cone = $('#lampCone');
    const halo = $('#lampHalo');
    const stateEl = $('#lampState');
    const svg = $('#pullCordSvg');

    let isOn = false;
    let isDragging = false;
    let dragOffsetY = 0;
    let animY = 0; // 当前位置
    let targetY = 0; // 目标位置
    let velocity = 0; // 松手后弹簧速度
    let springing = false;

    const minY = 0;
    const maxY = 160;
    const switchThreshold = 100; // 拉过这个距离触发开关

    // 初始位置
    let knobY = 0;
    updateCord(0);

    function updateCord(y) {
      // 绳子路径：从顶部 (40,0) 到把手 (40, y+22)
      // 中间做一点松弛曲线
      const topX = 40;
      const topY = 0;
      const botX = 40;
      const botY = y + 12; // 绳子接在把手顶部
      const midY = botY * 0.55;
      const sag = y * 0.08; // 自然下垂弧度
      const d = `M${topX} ${topY} Q ${topX + sag} ${midY} ${botX} ${botY}`;
      cordPath.setAttribute('d', d);
      knob.style.top = `${y}px`;
    }

    function onDown(e) {
      e.preventDefault();
      isDragging = true;
      springing = false;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const rect = knob.getBoundingClientRect();
      dragOffsetY = clientY - rect.top;

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onUp);
    }

    function onMove(e) {
      if (!isDragging) return;
      e.preventDefault();
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const wrapRect = wrap.getBoundingClientRect();
      let y = clientY - wrapRect.top - dragOffsetY;
      y = clamp(y, minY, maxY);
      knobY = y;
      targetY = y;
      animY = y;
      updateCord(y);
    }

    function onUp() {
      if (!isDragging) return;
      isDragging = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);

      // 触发开关
      if (knobY > switchThreshold) {
        isOn = !isOn;
        bulb.classList.toggle('on', isOn);
        cone.classList.toggle('on', isOn);
        halo.classList.toggle('on', isOn);
        stateEl.textContent = isOn ? '点 亮' : '熄 灭';
      }

      // 弹簧回弹
      velocity = 0;
      springing = true;
      targetY = 0;
      addRaf(springTick);
    }

    // 弹簧阻尼物理
    function springTick() {
      if (!springing) { removeRaf(springTick); return; }
      const springK = 0.12;
      const damping = 0.72;
      const force = (targetY - animY) * springK;
      velocity += force;
      velocity *= damping;
      animY += velocity;
      knobY = animY;
      updateCord(animY);

      if (Math.abs(velocity) < 0.05 && Math.abs(targetY - animY) < 0.5) {
        animY = targetY;
        knobY = targetY;
        updateCord(targetY);
        springing = false;
        removeRaf(springTick);
      }
    }

    knob.addEventListener('mousedown', onDown);
    knob.addEventListener('touchstart', onDown, { passive: false });

    // 键盘支持
    knob.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // 模拟拉动
        animY = switchThreshold + 20;
        updateCord(animY);
        setTimeout(() => {
          isOn = !isOn;
          bulb.classList.toggle('on', isOn);
          cone.classList.toggle('on', isOn);
          halo.classList.toggle('on', isOn);
          stateEl.textContent = isOn ? '点 亮' : '熄 灭';
          velocity = 0;
          springing = true;
          targetY = 0;
          addRaf(springTick);
        }, 150);
      }
    });
  }

  /* =========================================================
     展区 2：指针仪表
     拖拽旋钮 → 指针阻尼摆动 + 超调回稳
     ========================================================= */
  function setupGauge() {
    const knob = $('#gaugeKnob');
    const needle = $('#gaugeNeedle');
    const valueEl = $('#gaugeValue');
    const ticksEl = $('#gaugeTicks');
    const numbersEl = $('#gaugeNumbers');

    // 刻度范围（角度）：-135° 到 +135°，共 270°
    const minAngle = -135;
    const maxAngle = 135;
    const range = maxAngle - minAngle;

    // 生成刻度
    const tickCount = 27;
    for (let i = 0; i <= tickCount; i++) {
      const angle = minAngle + (i / tickCount) * range;
      const rad = (angle - 90) * Math.PI / 180;
      const isMajor = i % 3 === 0;
      const outerR = 80;
      const innerR = isMajor ? 66 : 72;
      const x1 = 90 + Math.cos(rad) * innerR;
      const y1 = 90 + Math.sin(rad) * innerR;
      const x2 = 90 + Math.cos(rad) * outerR;
      const y2 = 90 + Math.sin(rad) * outerR;

      const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      tick.setAttribute('x1', x1);
      tick.setAttribute('y1', y1);
      tick.setAttribute('x2', x2);
      tick.setAttribute('y2', y2);
      tick.setAttribute('stroke', isMajor ? '#2B2B28' : '#5a5550');
      tick.setAttribute('stroke-width', isMajor ? '2' : '1');
      tick.setAttribute('stroke-linecap', 'round');
      // 用 SVG 包裹
    }

    // 改用 HTML 刻度
    ticksEl.innerHTML = '';
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 180 180');
    svg.style.position = 'absolute';
    svg.style.inset = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    for (let i = 0; i <= tickCount; i++) {
      const angle = minAngle + (i / tickCount) * range;
      const rad = (angle - 90) * Math.PI / 180;
      const isMajor = i % 3 === 0;
      const outerR = 80;
      const innerR = isMajor ? 66 : 72;
      const x1 = 90 + Math.cos(rad) * innerR;
      const y1 = 90 + Math.sin(rad) * innerR;
      const x2 = 90 + Math.cos(rad) * outerR;
      const y2 = 90 + Math.sin(rad) * outerR;
      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', x1.toFixed(1));
      line.setAttribute('y1', y1.toFixed(1));
      line.setAttribute('x2', x2.toFixed(1));
      line.setAttribute('y2', y2.toFixed(1));
      line.setAttribute('stroke', isMajor ? '#2B2B28' : '#6a6560');
      line.setAttribute('stroke-width', isMajor ? '2' : '1');
      line.setAttribute('stroke-linecap', 'round');
      svg.appendChild(line);
    }
    ticksEl.appendChild(svg);

    // 刻度数字
    for (let i = 0; i <= 9; i++) {
      const angle = minAngle + (i / 9) * range;
      const rad = (angle - 90) * Math.PI / 180;
      const r = 56;
      const x = 90 + Math.cos(rad) * r;
      const y = 90 + Math.sin(rad) * r;
      const num = document.createElement('span');
      num.className = 'gauge-number';
      num.textContent = i * 10;
      num.style.left = `${x}px`;
      num.style.top = `${y}px`;
      numbersEl.appendChild(num);
    }

    // 旋钮旋转逻辑
    let knobAngle = minAngle; // 当前旋钮角度
    let needleAngle = minAngle; // 指针角度（带物理延迟）
    let needleVelocity = 0;
    let targetAngle = minAngle;
    let isDragging = false;
    let lastAngle = 0;

    // 直接 DOM 操作指针角度（不做 React 重渲染）
    needle.style.transformOrigin = '50% 100%';
    needle.style.transform = `rotate(${minAngle}deg)`;

    function onDown(e) {
      e.preventDefault();
      isDragging = true;
      const knobTop = knob.querySelector('.knob-top');
      const rect = knob.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      lastAngle = Math.atan2(clientY - cy, clientX - cx) * 180 / Math.PI;

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onUp);

      setCursorState('drag');
    }

    function onMove(e) {
      if (!isDragging) return;
      e.preventDefault();
      const rect = knob.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      let angle = Math.atan2(clientY - cy, clientX - cx) * 180 / Math.PI;
      let delta = angle - lastAngle;

      // 处理 180/-180 跳变
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;

      knobAngle = clamp(knobAngle + delta, minAngle, maxAngle);
      targetAngle = knobAngle;
      lastAngle = angle;

      // 更新旋钮外观
      const knobTop = knob.querySelector('.knob-top');
      knobTop.style.transform = `rotate(${knobAngle - minAngle}deg)`;
    }

    function onUp() {
      if (!isDragging) return;
      isDragging = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
      setCursorState('hover');
    }

    // 物理：二阶系统 — 带超调的阻尼摆动
    function needleTick() {
      // 弹簧 K + 阻尼 C + 质量 M
      const K = 0.08;     // 弹簧刚度
      const C = 0.78;     // 阻尼系数（<1 会有超调）
      const force = (targetAngle - needleAngle) * K;
      needleVelocity += force;
      needleVelocity *= C;
      needleAngle += needleVelocity;

      needle.style.transform = `rotate(${needleAngle}deg)`;

      // 更新数值显示
      const val = Math.round(mapRange(needleAngle, minAngle, maxAngle, 0, 100));
      valueEl.textContent = val;
      knob.setAttribute('aria-valuenow', val);
    }
    addRaf(needleTick);

    knob.addEventListener('mousedown', onDown);
    knob.addEventListener('touchstart', onDown, { passive: false });

    // 键盘支持
    knob.addEventListener('keydown', (e) => {
      const step = 15;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        knobAngle = clamp(knobAngle + step, minAngle, maxAngle);
        targetAngle = knobAngle;
        knob.querySelector('.knob-top').style.transform = `rotate(${knobAngle - minAngle}deg)`;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        knobAngle = clamp(knobAngle - step, minAngle, maxAngle);
        targetAngle = knobAngle;
        knob.querySelector('.knob-top').style.transform = `rotate(${knobAngle - minAngle}deg)`;
      }
    });
  }

  /* =========================================================
     展区 3：拨码开关
     主开关切换昼夜场景
     ========================================================= */
  function setupSwitches() {
    const toggles = $$('.toggle-switch');
    const sceneText = $('#sceneText');
    const switchState = $('#switchState');

    toggles.forEach((toggle, idx) => {
      toggle.addEventListener('click', () => {
        const isOn = toggle.classList.toggle('on');

        // 主开关（中间那个，idx 1）控制昼夜
        if (idx === 1) {
          if (isOn) {
            document.body.setAttribute('data-scene', 'night');
            sceneText.textContent = '夜 · 晚';
            switchState.textContent = '夜 间';
          } else {
            document.body.removeAttribute('data-scene');
            sceneText.textContent = '白 · 昼';
            switchState.textContent = '日 间';
          }
        }
      });

      // 键盘
      toggle.setAttribute('tabindex', '0');
      toggle.setAttribute('role', 'switch');
      toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle.click();
        }
      });
    });

    // 初始：第 0 号小开关打开（电源）
    toggles[0].classList.add('on');
  }

  /* =========================================================
     展区 4：发条钥匙
     向下拖拽钥匙 → 松手后齿轮惯性缓转
     ========================================================= */
  function setupKey() {
    const keyAssembly = $('#keyAssembly');
    const keyWrap = $('#keyWrap');
    const gearBig = $('#gearBig');
    const gearSmall = $('#gearSmall');
    const tensionEl = $('#keyTension');

    let isDragging = false;
    let dragY = 0;
    let startY = 0;
    let keyY = 0; // 当前钥匙位置 (0 ~ 140)
    let targetY = 0;

    // 齿轮旋转
    let gearAngle = 0;
    let gearVelocity = 0; // 角速度
    let spinning = false;

    const minY = 0;
    const maxY = 140;
    let lastDragTime = 0;
    let lastKeyY = 0;
    let releaseVelocity = 0;

    function onDown(e) {
      e.preventDefault();
      isDragging = true;
      spinning = false;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      startY = clientY - keyY;
      lastDragTime = performance.now();
      lastKeyY = keyY;

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onUp);
      setCursorState('drag');
    }

    function onMove(e) {
      if (!isDragging) return;
      e.preventDefault();
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      let y = clientY - startY;
      y = clamp(y, minY, maxY);

      const now = performance.now();
      const dt = now - lastDragTime;
      if (dt > 0) {
        releaseVelocity = (y - lastKeyY) / dt * 16; // 约等于每帧速度
      }
      lastDragTime = now;
      lastKeyY = y;

      keyY = y;
      keyAssembly.style.top = `${10 + y}px`;

      // 钥匙下拽时，齿轮也跟着转动（机械感）
      const turn = y * 3; // 每像素 3 度
      gearAngle = turn;
      updateGears();
      updateTension();
    }

    function onUp() {
      if (!isDragging) return;
      isDragging = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
      setCursorState('hover');

      // 开始惯性旋转，钥匙也弹簧回弹
      spinning = true;
      // 齿轮惯性：松手时给一个初速度，方向与拖拽方向有关
      // 但钥匙是向下拉，发条上紧 → 松手后齿轮回转
      const tensionRatio = keyY / maxY; // 0~1
      gearVelocity = tensionRatio * 8 + Math.max(0, releaseVelocity * 0.3);
      targetY = 0;

      addRaf(gearTick);
    }

    function updateGears() {
      gearBig.style.transform = `rotate(${gearAngle}deg)`;
      // 小齿轮反向、更快
      gearSmall.style.transform = `rotate(${-gearAngle * 1.8}deg)`;
    }

    function updateTension() {
      const t = Math.round(mapRange(keyY, minY, maxY, 0, 100));
      tensionEl.textContent = t;
    }

    // 惯性 + 摩擦 + 钥匙回弹
    function gearTick() {
      if (!spinning && keyY <= 0.1) { removeRaf(gearTick); return; }

      // 齿轮摩擦减速
      const friction = 0.975;
      gearVelocity *= friction;
      gearAngle += gearVelocity;

      // 钥匙弹簧回弹（缓慢）
      const springK = 0.05;
      const damping = 0.85;
      const springForce = (targetY - keyY) * springK;
      if (!isDragging) {
        keyY += springForce;
        keyY = Math.max(0, keyY);
        keyAssembly.style.top = `${10 + keyY}px`;
        updateTension();
      }

      updateGears();

      // 停转条件
      if (Math.abs(gearVelocity) < 0.05 && keyY < 0.5) {
        spinning = false;
        keyY = 0;
        keyAssembly.style.top = '10px';
        updateTension();
      }
    }

    keyAssembly.addEventListener('mousedown', onDown);
    keyAssembly.addEventListener('touchstart', onDown, { passive: false });
  }

  /* =========================================================
     展区 5：节流拉杆
     拖动拉杆 → 蒸汽粒子随开度变化
     ========================================================= */
  function setupLever() {
    const handle = $('#leverHandle');
    const rod = $('#leverRod');
    const steamContainer = $('#steamContainer');
    const flowEl = $('#leverFlow');

    const minY = -30;
    const maxY = 70;
    let leverY = -30; // 当前拉杆顶部位置
    let isDragging = false;
    let startY = 0;
    let handleOffset = 0;

    let steamTimer = null;
    let lastSteamTime = 0;

    function getFlow() {
      return mapRange(leverY, minY, maxY, 0, 100);
    }

    function updateLever() {
      rod.style.top = `${leverY}px`;
      flowEl.textContent = Math.round(getFlow());
    }

    function spawnSteamParticle() {
      const flow = getFlow();
      if (flow < 5) return;

      const particle = document.createElement('div');
      particle.className = 'steam-particle';

      const size = 8 + Math.random() * 14;
      const drift = (Math.random() - 0.5) * 60;
      const duration = 2 + Math.random() * 2;
      const startX = -20 + Math.random() * 40;

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.setProperty('--drift', `${drift}px`);
      particle.style.left = `calc(50% + ${startX}px)`;
      particle.style.animationDuration = `${duration}s`;
      particle.style.opacity = flow / 100 * 0.7;

      steamContainer.appendChild(particle);

      // 动画结束后移除
      setTimeout(() => {
        if (particle.parentNode) particle.parentNode.removeChild(particle);
      }, duration * 1000 + 100);
    }

    function steamTick(ts) {
      const flow = getFlow();
      if (flow < 2) return;

      // 粒子生成频率与流量正相关
      const interval = mapRange(flow, 0, 100, 400, 60);
      if (ts - lastSteamTime > interval) {
        spawnSteamParticle();
        // 大流量时一次生成多个
        if (flow > 60) spawnSteamParticle();
        if (flow > 85) spawnSteamParticle();
        lastSteamTime = ts;
      }
    }
    addRaf(steamTick);

    function onDown(e) {
      e.preventDefault();
      isDragging = true;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const rect = handle.getBoundingClientRect();
      handleOffset = clientY - rect.top;

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onUp);
      setCursorState('drag');
    }

    function onMove(e) {
      if (!isDragging) return;
      e.preventDefault();
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const valveBody = rod.parentElement;
      const bodyRect = valveBody.getBoundingClientRect();
      let y = clientY - bodyRect.top - handleOffset - 15;
      // 拉杆在阀体上方移动
      y = clamp(y, minY, maxY);
      leverY = y;
      updateLever();
    }

    function onUp() {
      if (!isDragging) return;
      isDragging = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
      setCursorState('hover');
    }

    handle.addEventListener('mousedown', onDown);
    handle.addEventListener('touchstart', onDown, { passive: false });

    updateLever();
  }

  /* =========================================================
     展区 6：磁吸图钉板
     拖拽图钉 → 松手后磁吸弹性归位
     ========================================================= */
  function setupPins() {
    const board = $('#pinBoard');
    const pins = $$('.pin');
    const slots = $$('.pin-slot');
    const homeEl = $('#pinsHome');

    const pinState = new Map();

    pins.forEach((pin, i) => {
      // 初始化状态
      const slot = slots[i];
      const slotX = parseFloat(getComputedStyle(slot).getPropertyValue('--x'));
      const slotY = parseFloat(getComputedStyle(slot).getPropertyValue('--y'));

      const state = {
        pinX: 0,   // 实际位置（百分比，0-100）
        pinY: 0,
        homeX: slotX,
        homeY: slotY,
        velX: 0,
        velY: 0,
        isDragging: false,
        isHoming: true,
        offsetX: 0,
        offsetY: 0,
      };
      pinState.set(pin, state);

      // 初始位置
      state.pinX = state.homeX;
      state.pinY = state.homeY;

      function onDown(e) {
        e.preventDefault();
        e.stopPropagation();
        state.isDragging = true;
        state.isHoming = false;
        pin.classList.add('dragging');

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const rect = board.getBoundingClientRect();

        // 计算鼠标在 pin 上的偏移（百分比）
        const mx = (clientX - rect.left) / rect.width * 100;
        const my = (clientY - rect.top) / rect.height * 100;
        state.offsetX = mx - state.pinX;
        state.offsetY = my - state.pinY;

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', onUp);
        setCursorState('drag');
      }

      function onMove(e) {
        if (!state.isDragging) return;
        e.preventDefault();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const rect = board.getBoundingClientRect();

        const mx = (clientX - rect.left) / rect.width * 100;
        const my = (clientY - rect.top) / rect.height * 100;

        state.pinX = clamp(mx - state.offsetX, 5, 95);
        state.pinY = clamp(my - state.offsetY, 5, 95);

        pin.style.left = `${state.pinX}%`;
        pin.style.top = `${state.pinY}%`;
      }

      function onUp() {
        if (!state.isDragging) return;
        state.isDragging = false;
        pin.classList.remove('dragging');
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onUp);

        // 松手 → 开始磁吸归位
        state.isHoming = true;
        setCursorState('hover');
      }

      pin.addEventListener('mousedown', onDown);
      pin.addEventListener('touchstart', onDown, { passive: false });
    });

    // 全局物理：弹簧磁吸归位
    function pinsTick() {
      let homeCount = 0;

      pins.forEach((pin) => {
        const s = pinState.get(pin);
        if (s.isDragging) return;

        if (s.isHoming) {
          // 弹簧力指向 home
          const dx = s.homeX - s.pinX;
          const dy = s.homeY - s.pinY;

          // 反平方磁吸感：越近力越大（但要防止爆炸）
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 0.3 && Math.abs(s.velX) < 0.05 && Math.abs(s.velY) < 0.05) {
            s.pinX = s.homeX;
            s.pinY = s.homeY;
            s.velX = 0;
            s.velY = 0;
            pin.style.left = `${s.pinX}%`;
            pin.style.top = `${s.pinY}%`;
            homeCount++;
            return;
          }

          const K = 0.12;       // 弹簧刚度
          const C = 0.72;       // 阻尼

          s.velX += dx * K;
          s.velY += dy * K;
          s.velX *= C;
          s.velY *= C;

          s.pinX += s.velX;
          s.pinY += s.velY;

          pin.style.left = `${s.pinX}%`;
          pin.style.top = `${s.pinY}%`;
        }

        // 检查是否归位（距离阈值）
        const dx = s.homeX - s.pinX;
        const dy = s.homeY - s.pinY;
        if (Math.sqrt(dx * dx + dy * dy) < 1.5) {
          homeCount++;
        }
      });

      homeEl.textContent = homeCount;
    }
    addRaf(pinsTick);
  }

  /* =========================================================
     初始化
     ========================================================= */
  function init() {
    setupCursorTargets();
    setupReveal();
    setupParallax();
    setupLamp();
    setupGauge();
    setupSwitches();
    setupKey();
    setupLever();
    setupPins();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
