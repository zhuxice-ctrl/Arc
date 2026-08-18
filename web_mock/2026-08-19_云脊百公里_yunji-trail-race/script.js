/* ============================================================
   云脊百公里 · V1 交互脚本
   海拔剖面 = 网站主轴 · 滚动 = 沿赛道行进
   ============================================================ */

(function() {
  'use strict';

  /* ---------- 工具函数 ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ---------- 配置 ---------- */
  const TOTAL_KM = 100;
  const MAX_ELEVATION = 2800; // 最大刻度
  const SVG_WIDTH = 6000;     // 剖面 SVG 逻辑宽度
  const SVG_HEIGHT = 600;     // 剖面 SVG 逻辑高度

  // 赛道海拔数据点 (km, elevation)
  // 手动定义关键节点，中间平滑插值
  const waypoints = [
    { km: 0,   elev: 820  },  // 起点
    { km: 12,  elev: 1380 },  // 青枫坡爬升段
    { km: 20,  elev: 1560 },  // 缓坡
    { km: 25,  elev: 1620 },  // CP1
    { km: 32,  elev: 1900 },  // 持续爬升
    { km: 38,  elev: 2150 },  // 山脊线
    { km: 42,  elev: 2280 },  // CP2
    { km: 48,  elev: 2100 },  // 小下降
    { km: 55,  elev: 2200 },  // 缓升
    { km: 58,  elev: 2400 },  // 主垭口前陡升
    { km: 60,  elev: 2550 },  // 更陡
    { km: 62,  elev: 2680 },  // 主垭口（最高点）
    { km: 64,  elev: 2580 },  // 垭口后陡降
    { km: 70,  elev: 1950 },  // 长下坡
    { km: 78,  elev: 1720 },  // CP3
    { km: 85,  elev: 1580 },  // 缓降
    { km: 88,  elev: 1450 },  // 夜林道
    { km: 94,  elev: 1200 },  // 接近终点
    { km: 100, elev: 980  }   // 终点
  ];

  // 生成 1000 个采样点的平滑剖面
  const elevationProfile = (function() {
    const points = [];
    const segments = 1000;
    for (let i = 0; i <= segments; i++) {
      const km = (i / segments) * TOTAL_KM;
      // 找到所在区间
      let segIdx = 0;
      for (let j = 0; j < waypoints.length - 1; j++) {
        if (km >= waypoints[j].km && km <= waypoints[j + 1].km) {
          segIdx = j;
          break;
        }
      }
      const a = waypoints[segIdx];
      const b = waypoints[segIdx + 1];
      const t = (km - a.km) / (b.km - a.km);
      // 使用 cos 插值让曲线更自然
      const smoothT = (1 - Math.cos(t * Math.PI)) / 2;
      const elev = lerp(a.elev, b.elev, smoothT);
      points.push({ km, elev });
    }
    return points;
  })();

  // 获取指定公里数的海拔
  function getElevationAtKm(km) {
    const idx = clamp(Math.round((km / TOTAL_KM) * (elevationProfile.length - 1)), 0, elevationProfile.length - 1);
    return elevationProfile[idx].elev;
  }

  // 获取指定公里数的坡度 (百分比，正=爬升，负=下降)
  function getSlopeAtKm(km) {
    const idx = clamp(Math.round((km / TOTAL_KM) * (elevationProfile.length - 1)), 1, elevationProfile.length - 2);
    const prev = elevationProfile[idx - 1];
    const next = elevationProfile[idx + 1];
    const dKm = next.km - prev.km;
    const dElev = next.elev - prev.elev;
    return (dElev / (dKm * 1000)) * 100; // 坡度百分比
  }

  /* ---------- 状态 ---------- */
  const state = {
    currentKm: 0,
    scrollProgress: 0,  // 0-1
    isPaused: false,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    rafId: null,
    ticking: false,
    lastScrollTop: 0,
    scrollDirection: 0,
    activeNode: null
  };

  /* ---------- DOM 引用 ---------- */
  const dom = {};

  function cacheDOM() {
    dom.body = document.body;
    dom.cursor = $('#cursor');
    dom.cursorDot = $('.cursor-dot', dom.cursor);
    dom.cursorRing = $('.cursor-ring', dom.cursor);
    dom.cursorLabel = $('#cursorLabel');
    dom.profileSvg = $('#profileSvg');
    dom.profileFillPath = $('#profileFillPath');
    dom.profileLinePath = $('#profileLinePath');
    dom.profileProgressPath = $('#profileProgressPath');
    dom.nodesGroup = $('#nodesGroup');
    dom.cursorVLine = $('#cursorVLine');
    dom.cursorDotEl = $('#cursorDot');
    dom.cursorMarker = $('#cursorMarker');
    dom.kmValue = $('#kmValue');
    dom.kmCounter = $('#kmCounter');
    dom.topBar = $('#topBar');
    dom.topNavLinks = $$('.top-nav a');
    dom.contourBg = $('#contourBg');
    dom.elevationScale = $('#elevationScale');
    dom.elevTicks = $$('.elev-tick');
    dom.kmScale = $('#kmScale');
    dom.nodeSections = $$('.node-section');
    dom.miniMap = $('#miniMap');
    dom.miniMapTrack = $('#miniMapTrack');
    dom.miniMapHandle = $('#miniMapHandle');
    dom.miniMapKm = $('#miniMapKm');
    dom.miniMapPath = $('#miniMapPath');
    dom.effortFill = $('#effortFill');
    dom.effortValue = $('#effortValue');
    dom.effortMeter = $('#effortMeter');
    dom.restartBtn = $('#restartBtn');
    dom.shareBtn = $('#shareBtn');
    dom.scrollBuffer = $('.scroll-buffer-bottom');
  }

  /* ---------- 配色：每日随机重抽 ---------- */
  const themes = ['theme-granite', 'theme-dune', 'theme-pine'];

  function getDailyTheme() {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    // 简单哈希
    let hash = seed;
    hash = ((hash >> 16) ^ hash) * 0x45d9f3b;
    hash = ((hash >> 16) ^ hash) * 0x45d9f3b;
    hash = (hash >> 16) ^ hash;
    return themes[Math.abs(hash) % themes.length];
  }

  function applyTheme() {
    const theme = getDailyTheme();
    themes.forEach(t => dom.body.classList.remove(t));
    dom.body.classList.add(theme);
  }

  /* ---------- 自定义光标 ---------- */
  const cursor = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    targetX: window.innerWidth / 2,
    targetY: window.innerHeight / 2,
    isHovering: false,
    labelText: '',
    lastMoveTime: 0
  };

  function initCursor() {
    if (window.matchMedia('(max-width: 768px)').matches) return;

    // 初始位置：屏幕中央
    cursor.x = window.innerWidth / 2;
    cursor.y = window.innerHeight / 2;
    cursor.targetX = cursor.x;
    cursor.targetY = cursor.y;
    updateCursorPosition();

    document.addEventListener('mousemove', onMouseMove, { passive: true });

    // 可交互元素的 hover 态
    document.addEventListener('mouseover', onMouseOver, true);
    document.addEventListener('mouseout', onMouseOut, true);

    // 点击效果
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
  }

  function onMouseMove(e) {
    // 高频事件：直接操作目标位置，实际移动交给 RAF 平滑
    cursor.targetX = e.clientX;
    cursor.targetY = e.clientY;
    cursor.lastMoveTime = performance.now();
  }

  function onMouseOver(e) {
    const target = e.target;
    if (target.closest('a, button, .node-marker, .mini-map-track, .tag')) {
      cursor.isHovering = true;
      dom.cursor.classList.add('hover');

      // 如果是节点 marker，显示公里数
      const marker = target.closest('.node-marker');
      if (marker) {
        const km = marker.getAttribute('data-km');
        if (km) {
          cursor.labelText = km + ' km';
          dom.cursorLabel.textContent = cursor.labelText;
          dom.cursor.classList.add('label');
        }
      }
    }
  }

  function onMouseOut(e) {
    const target = e.target;
    if (target.closest('a, button, .node-marker, .mini-map-track, .tag')) {
      cursor.isHovering = false;
      dom.cursor.classList.remove('hover');
      dom.cursor.classList.remove('label');
      cursor.labelText = '';
    }
  }

  function onMouseDown() {
    dom.cursor.classList.add('click');
  }

  function onMouseUp() {
    dom.cursor.classList.remove('click');
  }

  function updateCursorPosition() {
    if (state.reducedMotion) {
      cursor.x = cursor.targetX;
      cursor.y = cursor.targetY;
    } else {
      // 平滑跟随
      cursor.x = lerp(cursor.x, cursor.targetX, 0.15);
      cursor.y = lerp(cursor.y, cursor.targetY, 0.15);
    }
    dom.cursor.style.transform = `translate(${cursor.x}px, ${cursor.y}px) translate(-50%, -50%)`;
  }

  /* ---------- 剖面 SVG 生成 ---------- */
  function buildProfileSVG() {
    const points = elevationProfile;

    // 将点映射到 SVG 坐标
    const svgPoints = points.map(p => ({
      x: (p.km / TOTAL_KM) * SVG_WIDTH,
      y: SVG_HEIGHT - (p.elev / MAX_ELEVATION) * SVG_HEIGHT
    }));

    // 构建路径 d
    let lineD = `M ${svgPoints[0].x.toFixed(1)} ${svgPoints[0].y.toFixed(1)}`;
    for (let i = 1; i < svgPoints.length; i++) {
      lineD += ` L ${svgPoints[i].x.toFixed(1)} ${svgPoints[i].y.toFixed(1)}`;
    }

    // 填充路径（闭合到底部）
    const fillD = lineD + ` L ${SVG_WIDTH} ${SVG_HEIGHT} L 0 ${SVG_HEIGHT} Z`;

    dom.profileLinePath.setAttribute('d', lineD);
    dom.profileFillPath.setAttribute('d', fillD);
    dom.profileProgressPath.setAttribute('d', lineD);

    // 进度路径总长度
    const totalLength = dom.profileProgressPath.getTotalLength();
    dom.profileProgressPath.style.strokeDasharray = `0 ${totalLength}`;
    dom.profileProgressPath.dataset.totalLength = totalLength;

    return svgPoints;
  }

  /* ---------- 节点标记 ---------- */
  function buildNodeMarkers() {
    const nodeData = [
      { km: 0,   label: '起点', type: 'start' },
      { km: 12,  label: '12km', type: 'climb' },
      { km: 25,  label: 'CP1', type: 'aid' },
      { km: 38,  label: '38km', type: 'ridge' },
      { km: 42,  label: 'CP2', type: 'aid' },
      { km: 62,  label: '主垭口', type: 'summit' },
      { km: 70,  label: '70km', type: 'descent' },
      { km: 78,  label: 'CP3', type: 'aid' },
      { km: 88,  label: '88km', type: 'night' },
      { km: 100, label: '终点', type: 'finish' }
    ];

    // 清空
    dom.nodesGroup.innerHTML = '';

    const svgNS = 'http://www.w3.org/2000/svg';

    nodeData.forEach(node => {
      const x = (node.km / TOTAL_KM) * SVG_WIDTH;
      const y = SVG_HEIGHT - (getElevationAtKm(node.km) / MAX_ELEVATION) * SVG_HEIGHT;

      const g = document.createElementNS(svgNS, 'g');
      g.setAttribute('class', `node-marker node-${node.type}`);
      g.setAttribute('data-km', node.km);
      g.setAttribute('transform', `translate(${x.toFixed(1)}, ${y.toFixed(1)})`);
      g.style.pointerEvents = 'auto';

      const circle = document.createElementNS(svgNS, 'circle');
      circle.setAttribute('cx', '0');
      circle.setAttribute('cy', '0');

      if (node.type === 'aid' || node.type === 'summit' || node.type === 'start' || node.type === 'finish') {
        circle.setAttribute('r', '6');
        circle.setAttribute('fill', 'var(--rescue)');
        circle.setAttribute('stroke', 'var(--paper)');
        circle.setAttribute('stroke-width', '2');
      } else {
        circle.setAttribute('r', '4');
        circle.setAttribute('fill', 'var(--accent)');
      }

      const text = document.createElementNS(svgNS, 'text');
      text.setAttribute('x', '0');
      text.setAttribute('y', '-12');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', 'var(--text-soft)');
      text.setAttribute('font-size', '10');
      text.setAttribute('font-family', 'JetBrains Mono, monospace');
      text.textContent = node.label;

      // 主要节点文字放下面
      if (node.type === 'summit' || node.type === 'start' || node.type === 'finish') {
        text.setAttribute('y', '24');
        text.setAttribute('font-weight', '700');
        text.setAttribute('fill', 'var(--text)');
      }

      g.appendChild(circle);
      g.appendChild(text);

      g.addEventListener('click', () => {
        scrollToKm(node.km);
      });

      dom.nodesGroup.appendChild(g);
    });
  }

  /* ---------- 小地图 ---------- */
  function buildMiniMap() {
    // 竖版迷你剖面
    let d = '';
    const segments = 100;
    for (let i = 0; i <= segments; i++) {
      const km = (i / segments) * TOTAL_KM;
      const elev = getElevationAtKm(km);
      const x = 50 - ((elev / MAX_ELEVATION) * 40);  // 横向表示海拔
      const y = (i / segments) * 200;                // 纵向表示公里
      if (i === 0) d += `M ${x} ${y}`;
      else d += ` L ${x} ${y}`;
    }
    dom.miniMapPath.setAttribute('d', d);
  }

  /* ---------- 公里刻度 ---------- */
  function buildKmScale() {
    const marks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    dom.kmScale.innerHTML = marks.map(km =>
      `<span>${km.toString().padStart(3, '0')}</span>`
    ).join('');
  }

  /* ---------- 滚动处理 ---------- */
  function getScrollProgress() {
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return 0;
    return clamp(scrollTop / docHeight, 0, 1);
  }

  function onScroll() {
    state.scrollDirection = window.scrollY > state.lastScrollTop ? 1 : -1;
    state.lastScrollTop = window.scrollY;

    if (!state.ticking) {
      state.ticking = true;
      // 下一帧更新
      requestAnimationFrame(updateFromScroll);
    }
  }

  function updateFromScroll() {
    const progress = getScrollProgress();
    state.scrollProgress = progress;
    const km = progress * TOTAL_KM;
    state.currentKm = km;

    // 更新剖面游标位置
    updateProfileCursor(km);

    // 更新进度路径
    updateProgressPath(progress);

    // 更新公里计数器
    updateKmCounter(km);

    // 更新等高线视差
    updateContourParallax(km);

    // 更新节点激活状态
    updateActiveNodes(km);

    // 更新小地图
    updateMiniMap(km);

    // 更新爬坡强度
    updateEffortMeter(km);

    // 更新顶部导航
    updateTopNav(km);

    // 签名时刻判断
    updateSummitState(km);

    state.ticking = false;
  }

  function updateProfileCursor(km) {
    const x = (km / TOTAL_KM) * SVG_WIDTH;
    const y = SVG_HEIGHT - (getElevationAtKm(km) / MAX_ELEVATION) * SVG_HEIGHT;

    dom.cursorMarker.setAttribute('transform', `translate(${x.toFixed(1)}, 0)`);
    dom.cursorDotEl.setAttribute('cy', y.toFixed(1));

    // 调整垂直线高度（从 y 到底部）
    dom.cursorVLine.setAttribute('y1', y.toFixed(1));
    dom.cursorVLine.setAttribute('y2', SVG_HEIGHT);
  }

  function updateProgressPath(progress) {
    const totalLength = parseFloat(dom.profileProgressPath.dataset.totalLength || 0);
    if (totalLength <= 0) return;
    const currentLength = totalLength * progress;
    dom.profileProgressPath.style.strokeDasharray = `${currentLength} ${totalLength}`;
  }

  function updateKmCounter(km) {
    const formatted = km.toFixed(1).padStart(5, '0');
    if (dom.kmValue.textContent !== formatted) {
      // 数字变化时的翻牌效果（低强度触发）
      if (!state.reducedMotion && Math.random() < 0.15) {
        dom.kmValue.classList.add('flip');
        setTimeout(() => dom.kmValue.classList.remove('flip'), 300);
      }
      dom.kmValue.textContent = formatted;
    }
  }

  function updateContourParallax(km) {
    // 等高线随公里数偏移，营造行进感
    const offsetX = (km / TOTAL_KM) * 240;
    const offsetY = (getElevationAtKm(km) / MAX_ELEVATION) * 80;
    dom.contourBg.style.backgroundPosition = `-${offsetX.toFixed(0)}px -${offsetY.toFixed(0)}px`;
  }

  function updateActiveNodes(km) {
    let closest = null;
    let closestDist = Infinity;

    dom.nodeSections.forEach(section => {
      const nodeKm = parseFloat(section.dataset.km);
      const dist = Math.abs(km - nodeKm);

      // 激活范围：节点前后 5km
      if (dist < closestDist) {
        closestDist = dist;
        closest = section;
      }
    });

    dom.nodeSections.forEach(section => {
      const nodeKm = parseFloat(section.dataset.km);
      const dist = Math.abs(km - nodeKm);
      const isActive = dist < 6; // 6km 范围内逐渐激活

      if (isActive) {
        // 根据距离计算 opacity
        const opacity = 1 - (dist / 6) * 0.6;
        section.style.opacity = Math.max(0.4, opacity).toFixed(2);
        section.classList.add('active');
      } else {
        section.style.opacity = '';
        section.classList.remove('active');
      }
    });

    // 最近节点标记
    if (closest && closest !== state.activeNode) {
      if (state.activeNode) {
        const prevKm = state.activeNode.dataset.km;
        const prevMarker = dom.nodesGroup.querySelector(`[data-km="${prevKm}"]`);
        if (prevMarker) prevMarker.classList.remove('active');
      }
      const closestKm = closest.dataset.km;
      const closestMarker = dom.nodesGroup.querySelector(`[data-km="${closestKm}"]`);
      if (closestMarker) closestMarker.classList.add('active');

      // 首次激活时触发统计动画
      if (closestDist < 3) {
        triggerStatsAnimation(closest);
      }

      state.activeNode = closest;
    }
  }

  function triggerStatsAnimation(section) {
    if (section.dataset.animated === '1') return;
    section.dataset.animated = '1';

    const statVals = section.querySelectorAll('.stat-val');
    statVals.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('counting');
        setTimeout(() => el.classList.remove('counting'), 600);
      }, i * 100);
    });
  }

  function updateMiniMap(km) {
    const progress = km / TOTAL_KM;
    const trackHeight = dom.miniMapTrack.offsetHeight;
    const y = progress * trackHeight;
    dom.miniMapHandle.style.top = y + 'px';
    dom.miniMapKm.textContent = km.toFixed(1).padStart(5, '0') + ' km';
  }

  function updateEffortMeter(km) {
    const slope = getSlopeAtKm(km);
    // 坡度范围：-15% 到 +20%，映射到 0-100%
    const effort = clamp((slope + 15) / 35 * 100, 0, 100);
    dom.effortFill.style.width = effort.toFixed(0) + '%';
    dom.effortValue.textContent = Math.round(effort) + '%';

    // 高强度时脉动海拔刻度
    if (effort > 70 && !state.reducedMotion) {
      const tickIdx = Math.floor((getElevationAtKm(km) / MAX_ELEVATION) * 4);
      const tick = dom.elevTicks[4 - tickIdx];
      if (tick && !tick.dataset.pulsing) {
        tick.dataset.pulsing = '1';
        tick.classList.add('pulse');
        setTimeout(() => {
          tick.classList.remove('pulse');
          tick.dataset.pulsing = '';
        }, 800);
      }
    }
  }

  function updateTopNav(km) {
    dom.topNavLinks.forEach(link => {
      const linkKm = parseFloat(link.dataset.km);
      const dist = Math.abs(km - linkKm);
      if (dist < 4) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  function updateSummitState(km) {
    // 垭口附近（58-66km）视觉强化
    if (km >= 56 && km <= 66) {
      dom.body.classList.add('at-summit');
    } else {
      dom.body.classList.remove('at-summit');
    }

    // 夜间路段（78km 之后）
    if (km >= 78) {
      dom.body.classList.add('at-night');
    } else {
      dom.body.classList.remove('at-night');
    }
  }

  /* ---------- 跳转到指定公里 ---------- */
  function scrollToKm(km) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const targetScroll = (km / TOTAL_KM) * docHeight;
    window.scrollTo({
      top: targetScroll,
      behavior: state.reducedMotion ? 'auto' : 'smooth'
    });
  }

  /* ---------- 小地图拖拽 ---------- */
  function initMiniMapDrag() {
    let isDragging = false;

    function handleDrag(clientY) {
      const rect = dom.miniMapTrack.getBoundingClientRect();
      const y = clamp(clientY - rect.top, 0, rect.height);
      const progress = y / rect.height;
      const km = progress * TOTAL_KM;
      scrollToKm(km);
    }

    dom.miniMapTrack.addEventListener('mousedown', (e) => {
      isDragging = true;
      handleDrag(e.clientY);
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        handleDrag(e.clientY);
      }
    }, { passive: true });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // 触摸支持
    dom.miniMapTrack.addEventListener('touchstart', (e) => {
      isDragging = true;
      handleDrag(e.touches[0].clientY);
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (isDragging) {
        handleDrag(e.touches[0].clientY);
      }
    }, { passive: true });

    document.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  /* ---------- 顶部导航点击 ---------- */
  function initTopNav() {
    dom.topNavLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const km = parseFloat(link.dataset.km);
        scrollToKm(km);
      });
    });
  }

  /* ---------- 按钮交互 ---------- */
  function initButtons() {
    if (dom.restartBtn) {
      dom.restartBtn.addEventListener('click', () => {
        scrollToKm(0);
      });
    }

    if (dom.shareBtn) {
      dom.shareBtn.addEventListener('click', () => {
        // 模拟分享反馈
        const km = state.currentKm.toFixed(1);
        const original = dom.shareBtn.textContent;
        dom.shareBtn.textContent = `已复制 ${km}km 赛段链接`;
        setTimeout(() => {
          dom.shareBtn.textContent = original;
        }, 2000);
      });
    }
  }

  /* ---------- 顶部栏显示/隐藏（滚动方向） ---------- */
  function initTopBarHide() {
    let lastScrollY = 0;
    let hideTimer = null;

    window.addEventListener('scroll', () => {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollY;

      if (diff > 3 && currentY > 100) {
        // 向下滚动，隐藏顶栏
        dom.topBar.classList.add('hidden');
      } else if (diff < -3) {
        // 向上滚动，显示顶栏
        dom.topBar.classList.remove('hidden');
      }

      lastScrollY = currentY;
    }, { passive: true });
  }

  /* ---------- 可见性暂停 ---------- */
  function initVisibilityPause() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        state.isPaused = true;
        cancelAnimationFrame(state.rafId);
        state.rafId = null;
      } else {
        state.isPaused = false;
        if (!state.rafId) {
          animateLoop();
        }
      }
    });
  }

  /* ---------- RAF 动画循环 ---------- */
  function animateLoop() {
    if (state.isPaused) return;

    // 光标平滑
    updateCursorPosition();

    state.rafId = requestAnimationFrame(animateLoop);
  }

  /* ---------- 升级宣告 ---------- */
  function announceUpgrade() {
    try {
      window.parent.postMessage({
        type: 'miaoda:upgrade:available',
        kind: 'interactive-prototype'
      }, '*');
    } catch (e) { /* 跨域时忽略 */ }
  }

  /* ---------- 响应式处理 ---------- */
  function initResponsive() {
    function onResize() {
      // 重新计算 SVG 进度路径长度
      const totalLength = dom.profileProgressPath.getTotalLength();
      dom.profileProgressPath.dataset.totalLength = totalLength;
      updateFromScroll();
    }

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(onResize, 150);
    });
  }

  /* ---------- 节点滚动位置调整 ---------- */
  // 确保节点内容在剖面附近合理位置显示
  function positionNodeSections() {
    // 节点内容使用 CSS 固定间距布局，此处处理特殊定位
    // 我们已经用 CSS 做了基本布局，这里可以补充动态调整
  }

  /* ---------- 初始化 ---------- */
  function init() {
    cacheDOM();
    applyTheme();
    buildProfileSVG();
    buildNodeMarkers();
    buildMiniMap();
    buildKmScale();
    initCursor();
    initMiniMapDrag();
    initTopNav();
    initButtons();
    initTopBarHide();
    initVisibilityPause();
    initResponsive();

    // 滚动监听
    window.addEventListener('scroll', onScroll, { passive: true });

    // 初始状态
    updateFromScroll();

    // 启动动画循环
    animateLoop();

    // 宣告升级
    announceUpgrade();
    if (document.readyState !== 'complete') {
      window.addEventListener('load', announceUpgrade, { once: true });
    }

    // 清理
    window.addEventListener('beforeunload', cleanup);
  }

  function cleanup() {
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
      state.rafId = null;
    }
  }

  // DOM ready 后启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
