/* ============================================================
   灯市 · 元宵灯谜 — 微信小程序 Mock
   App Logic: 灯市 / 谜笺 / 猜谜 / 灯册 / 规范 / 接口
   ============================================================ */

(function () {
  'use strict';

  // ============ 灯谜数据 ============
  const RIDDLES = [
    {
      id: 'rd_001',
      question: '画时圆，写时方\n冬时短，夏时长',
      category: '字谜',
      hint: '打一字',
      answer: '日',
      explanation: '日即太阳，画时圆形，写时方形；冬天白昼短，夏天白昼长。',
      options: ['日', '月', '年', '天'],
      mode: 'choice'
    },
    {
      id: 'rd_002',
      question: '千条线，万条线\n落到水里看不见',
      category: '物谜',
      hint: '打一自然现象',
      answer: '雨',
      explanation: '雨丝如千万条线落下，落入水中便与水融为一体，看不见了。',
      options: ['雨', '雪', '雾', '露'],
      mode: 'choice'
    },
    {
      id: 'rd_003',
      question: '上边毛，下边毛\n中间一颗黑葡萄',
      category: '物谜',
      hint: '打一人体器官',
      answer: '眼睛',
      explanation: '上下睫毛如毛，中间的眼珠如黑葡萄，形象生动。',
      options: ['眼睛', '嘴巴', '耳朵', '鼻子'],
      mode: 'choice'
    },
    {
      id: 'rd_004',
      question: '有面没有口\n有脚没有手\n虽有四只脚\n自己不会走',
      category: '物谜',
      hint: '打一家具',
      answer: '桌子',
      explanation: '桌面如面无口，桌脚如脚无手，有四条腿但不会自己走。',
      options: ['桌子', '椅子', '柜子', '床'],
      mode: 'choice'
    },
    {
      id: 'rd_005',
      question: '身穿绿衣裳\n肚里水汪汪\n生的子儿多\n个个黑脸膛',
      category: '物谜',
      hint: '打一水果',
      answer: '西瓜',
      explanation: '西瓜皮是绿色的，水分充足，籽是黑色的。',
      options: ['西瓜', '黄瓜', '冬瓜', '南瓜'],
      mode: 'choice'
    },
    {
      id: 'rd_006',
      question: '一口咬掉牛尾巴',
      category: '字谜',
      hint: '打一字',
      answer: '告',
      explanation: '"牛"字下面的尾巴（竖）被"口"咬掉，换成"口"，合起来是"告"字。',
      options: ['告', '吉', '古', '口'],
      mode: 'choice'
    },
    {
      id: 'rd_007',
      question: '一点一横长\n一撇到南洋\n南洋有个人\n只有一寸长',
      category: '字谜',
      hint: '打一字',
      answer: '府',
      explanation: '一点一横一撇为"广"，里面一个"人"加"寸"，合为"府"字。',
      options: ['府', '底', '座', '庭'],
      mode: 'choice'
    },
    {
      id: 'rd_008',
      question: '白玉盘，真好看\n里头盛着珍珠饭\n谁能猜出这个谜\n赏他一吊压岁钱',
      category: '物谜',
      hint: '打一食物',
      answer: '汤圆',
      explanation: '碗如白玉盘，汤圆如珍珠饭，是元宵佳节的传统美食。',
      options: ['汤圆', '饺子', '包子', '元宵'],
      mode: 'choice'
    }
  ];

  // 花灯类型样式变体
  const LANTERN_VARIANTS = [
    { type: 'palace', width: 90, height: 110, shape: 'round' },
    { type: 'red', width: 80, height: 95, shape: 'round' },
    { type: 'lily', width: 70, height: 100, shape: 'tall' },
    { type: 'palace', width: 90, height: 110, shape: 'round' },
    { type: 'red', width: 85, height: 100, shape: 'round' },
    { type: 'lily', width: 75, height: 105, shape: 'tall' },
    { type: 'palace', width: 80, height: 95, shape: 'round' },
    { type: 'red', width: 90, height: 105, shape: 'round' }
  ];

  // ============ 状态管理 ============
  const STATE = {
    currentPage: 'market',
    currentRiddleId: null,
    selectedOption: null,
    inputAnswer: '',
    submitted: false,
    lastAnswerCorrect: false,
    collection: [],
    pinnedIds: new Set(),
    pullStartY: 0,
    pullDistance: 0,
    isPulling: false,
    isRefreshing: false,
    swipeState: { activeId: null, startX: 0, currentX: 0, swiped: false }
  };

  // ============ localStorage 持久化 ============
  const STORAGE_KEY = 'lantern_riddles_v2';

  function saveState() {
    try {
      const data = {
        collection: STATE.collection,
        pinnedIds: Array.from(STATE.pinnedIds)
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('localStorage save failed:', e);
    }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data.collection) STATE.collection = data.collection;
      if (data.pinnedIds) STATE.pinnedIds = new Set(data.pinnedIds);
    } catch (e) {
      console.warn('localStorage load failed:', e);
    }
  }

  function isLit(riddleId) {
    return STATE.collection.some(item => item.riddleId === riddleId);
  }

  function addToCollection(riddle, lanternIndex) {
    if (isLit(riddle.id)) return false;
    STATE.collection.unshift({
      id: 'cl_' + Date.now(),
      riddleId: riddle.id,
      riddle: riddle,
      lanternIndex: lanternIndex,
      unlockedAt: Date.now()
    });
    saveState();
    return true;
  }

  function removeFromCollection(itemId) {
    STATE.collection = STATE.collection.filter(it => it.id !== itemId);
    STATE.pinnedIds.delete(itemId);
    saveState();
  }

  function togglePin(itemId) {
    if (STATE.pinnedIds.has(itemId)) {
      STATE.pinnedIds.delete(itemId);
    } else {
      STATE.pinnedIds.add(itemId);
    }
    saveState();
  }

  function getSortedCollection() {
    return [...STATE.collection].sort((a, b) => {
      const aPinned = STATE.pinnedIds.has(a.id) ? 1 : 0;
      const bPinned = STATE.pinnedIds.has(b.id) ? 1 : 0;
      if (aPinned !== bPinned) return bPinned - aPinned;
      return b.unlockedAt - a.unlockedAt;
    });
  }

  // ============ 自定义光标 ============
  const cursor = {
    el: null,
    dot: null,
    ring: null,
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    ringX: 0,
    ringY: 0,
    rafId: null,
    visible: true
  };

  function initCursor() {
    cursor.el = document.getElementById('customCursor');
    cursor.dot = cursor.el.querySelector('.cursor-dot');
    cursor.ring = cursor.el.querySelector('.cursor-ring');

    // 初始居中
    cursor.x = window.innerWidth / 2;
    cursor.y = window.innerHeight / 2;
    cursor.targetX = cursor.x;
    cursor.targetY = cursor.y;
    cursor.ringX = cursor.x;
    cursor.ringY = cursor.y;
    updateCursor();

    document.addEventListener('mousemove', handleMouseMove);

    // 交互元素 hover 状态
    const phoneFrame = document.getElementById('phoneFrame');
    phoneFrame.addEventListener('mouseover', handleInteractiveOver);
    phoneFrame.addEventListener('mouseout', handleInteractiveOut);

    // 移动端 fallback
    if ('ontouchstart' in window) {
      cursor.el.style.display = 'none';
      document.body.style.cursor = 'auto';
    }

    animateCursor();
  }

  function handleMouseMove(e) {
    cursor.targetX = e.clientX;
    cursor.targetY = e.clientY;
  }

  function animateCursor() {
    if (!cursor.visible) {
      cursor.rafId = requestAnimationFrame(animateCursor);
      return;
    }
    // 点：即时跟随
    cursor.x += (cursor.targetX - cursor.x) * 0.6;
    cursor.y += (cursor.targetY - cursor.y) * 0.6;
    // 环：有延迟，带拖尾
    cursor.ringX += (cursor.targetX - cursor.ringX) * 0.18;
    cursor.ringY += (cursor.targetY - cursor.ringY) * 0.18;
    updateCursor();
    cursor.rafId = requestAnimationFrame(animateCursor);
  }

  function updateCursor() {
    cursor.dot.style.left = cursor.x + 'px';
    cursor.dot.style.top = cursor.y + 'px';
    cursor.ring.style.left = cursor.ringX + 'px';
    cursor.ring.style.top = cursor.ringY + 'px';
  }

  function handleInteractiveOver(e) {
    const target = e.target;
    if (target.closest('button, .riddle-paper, .option-item, .tab-item, .collection-item-swipe, .action-btn')) {
      cursor.el.classList.add('hover');
    }
    if (target.closest('.market-scroll, .collection-item-swipe')) {
      cursor.el.classList.add('grab');
    }
  }

  function handleInteractiveOut(e) {
    const target = e.target;
    if (target.closest('button, .riddle-paper, .option-item, .tab-item, .collection-item-swipe, .action-btn')) {
      cursor.el.classList.remove('hover');
    }
    if (target.closest('.market-scroll, .collection-item-swipe')) {
      cursor.el.classList.remove('grab');
    }
  }

  // 页面可见性暂停
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      cursor.visible = false;
      if (cursor.rafId) cancelAnimationFrame(cursor.rafId);
    } else {
      cursor.visible = true;
      animateCursor();
    }
  });

  // ============ 页面切换 ============
  function switchPage(pageName) {
    if (STATE.currentPage === pageName) return;

    document.querySelectorAll('.page').forEach(p => {
      p.classList.remove('active');
    });
    document.querySelector(`.page-${pageName}`).classList.add('active');

    document.querySelectorAll('.tab-item').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === pageName);
    });

    // 更新导航标题
    const titles = {
      market: '灯市',
      collection: '灯册',
      spec: '设计规范',
      api: '接口文档'
    };
    document.getElementById('navTitle').textContent = titles[pageName] || '';

    STATE.currentPage = pageName;
    closeRiddleSheet();

    // 切换页面时关闭所有左滑
    closeAllSwipe();
  }

  // ============ 灯市渲染 ============
  function renderMarket() {
    const street = document.getElementById('marketStreet');
    street.innerHTML = '';

    RIDDLES.forEach((riddle, index) => {
      const variant = LANTERN_VARIANTS[index % LANTERN_VARIANTS.length];
      const lit = isLit(riddle.id);

      const unit = document.createElement('div');
      unit.className = 'lantern-unit' + (lit ? ' lit' : '');
      unit.dataset.riddleId = riddle.id;
      unit.dataset.index = index;

      unit.innerHTML = `
        <div class="lantern-rope"></div>
        <div class="lantern-body" style="width:${variant.width}px;height:${variant.height}px">
          <div class="lantern-cap-top"></div>
          <div class="lantern-shape"></div>
          <div class="lantern-ribs"></div>
          <div class="lantern-zouma"><div class="zouma-pattern"></div></div>
          <div class="lantern-light"></div>
          <div class="lantern-cap-bottom"></div>
        </div>
        <div class="lantern-tassel"></div>
        <div class="riddle-paper" data-riddle-id="${riddle.id}">
          <div class="riddle-paper-content">${riddle.question.split('\n').join('')}</div>
        </div>
      `;

      // 谜笺点击
      const paper = unit.querySelector('.riddle-paper');
      paper.addEventListener('click', (e) => {
        e.stopPropagation();
        openRiddleSheet(riddle.id);
      });

      street.appendChild(unit);
    });

    renderProgress();
  }

  function renderProgress() {
    const progress = document.getElementById('lanternProgress');
    const litCount = document.getElementById('litCount');
    progress.innerHTML = '';
    let lit = 0;
    RIDDLES.forEach((r, i) => {
      const dot = document.createElement('div');
      dot.className = 'progress-dot' + (isLit(r.id) ? ' lit' : '');
      if (isLit(r.id)) lit++;
      progress.appendChild(dot);
    });
    litCount.textContent = lit;
    document.getElementById('totalCount').textContent = RIDDLES.length;
  }

  // 滚动时同步进度点 active 状态
  function syncProgressActive() {
    const scroll = document.getElementById('marketScroll');
    const units = document.querySelectorAll('.lantern-unit');
    const scrollLeft = scroll.scrollLeft;
    const containerWidth = scroll.clientWidth;
    const centerX = scrollLeft + containerWidth / 2;

    let activeIndex = 0;
    let minDist = Infinity;
    units.forEach((unit, i) => {
      const unitCenter = unit.offsetLeft + unit.offsetWidth / 2;
      const dist = Math.abs(unitCenter - centerX);
      if (dist < minDist) {
        minDist = dist;
        activeIndex = i;
      }
    });

    document.querySelectorAll('.progress-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
    });
  }

  // ============ 下拉刷新 ============
  function initPullRefresh() {
    const marketPage = document.querySelector('.page-market');
    const pullEl = document.getElementById('pullRefresh');
    const scroll = document.getElementById('marketScroll');

    let startY = 0;
    let startX = 0;
    let pulling = false;
    let pullDistance = 0;
    const THRESHOLD = 60;

    scroll.addEventListener('touchstart', handleStart, { passive: true });
    scroll.addEventListener('touchmove', handleMove, { passive: false });
    scroll.addEventListener('touchend', handleEnd);

    // 鼠标模拟（桌面端）
    scroll.addEventListener('mousedown', handleMouseDown);

    function handleStart(e) {
      if (scroll.scrollTop > 0) return;
      if (STATE.isRefreshing) return;
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
      pulling = true;
      pullDistance = 0;
    }

    function handleMove(e) {
      if (!pulling) return;
      const dy = e.touches[0].clientY - startY;
      const dx = Math.abs(e.touches[0].clientX - startX);

      // 横向滑动优先，不触发下拉
      if (dx > Math.abs(dy) * 1.5 && scroll.scrollWidth > scroll.clientWidth) {
        pulling = false;
        return;
      }

      if (dy > 0) {
        e.preventDefault();
        pullDistance = Math.min(dy * 0.5, 80); // 阻尼
        pullEl.style.top = (pullDistance - 60) + 'px';

        if (pullDistance >= THRESHOLD) {
          pullEl.classList.add('active');
          pullEl.querySelector('.pull-text').textContent = '释放换新谜';
        } else {
          pullEl.classList.remove('active');
          pullEl.querySelector('.pull-text').textContent = '下拉换新谜';
        }
      }
    }

    function handleEnd() {
      if (!pulling) return;
      pulling = false;

      if (pullDistance >= THRESHOLD) {
        triggerRefresh();
      } else {
        pullEl.style.top = '-60px';
        pullEl.classList.remove('active');
      }
    }

    // 桌面端鼠标
    let mouseDown = false;
    let mouseStartY = 0;

    function handleMouseDown(e) {
      if (STATE.isRefreshing) return;
      mouseDown = true;
      mouseStartY = e.clientY;
      pullDistance = 0;

      const onMouseMove = (ev) => {
        if (!mouseDown) return;
        const dy = ev.clientY - mouseStartY;
        if (dy > 0 && scroll.scrollTop <= 0) {
          pullDistance = Math.min(dy * 0.5, 80);
          pullEl.style.top = (pullDistance - 60) + 'px';
          if (pullDistance >= THRESHOLD) {
            pullEl.classList.add('active');
            pullEl.querySelector('.pull-text').textContent = '释放换新谜';
          } else {
            pullEl.classList.remove('active');
            pullEl.querySelector('.pull-text').textContent = '下拉换新谜';
          }
        }
      };

      const onMouseUp = () => {
        mouseDown = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        if (pullDistance >= THRESHOLD) {
          triggerRefresh();
        } else {
          pullEl.style.top = '-60px';
          pullEl.classList.remove('active');
        }
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
  }

  function triggerRefresh() {
    if (STATE.isRefreshing) return;
    STATE.isRefreshing = true;

    const pullEl = document.getElementById('pullRefresh');
    pullEl.classList.add('active', 'loading');
    pullEl.querySelector('.pull-text').textContent = '换谜中...';
    pullEl.style.top = '4px';

    // 模拟刷新：打乱灯谜顺序
    setTimeout(() => {
      shuffleRiddles();
      renderMarket();

      // 完成动画
      setTimeout(() => {
        pullEl.style.top = '-60px';
        pullEl.classList.remove('active', 'loading');
        pullEl.querySelector('.pull-text').textContent = '下拉换新谜';
        STATE.isRefreshing = false;
        showToast('灯市已换新谜');
      }, 400);
    }, 1200);
  }

  function shuffleRiddles() {
    // Fisher-Yates 打乱，但保持已点亮的状态
    for (let i = RIDDLES.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [RIDDLES[i], RIDDLES[j]] = [RIDDLES[j], RIDDLES[i]];
    }
  }

  // ============ 谜笺半屏弹层 ============
  function openRiddleSheet(riddleId) {
    const riddle = RIDDLES.find(r => r.id === riddleId);
    if (!riddle) return;

    STATE.currentRiddleId = riddleId;
    STATE.selectedOption = null;
    STATE.inputAnswer = '';
    STATE.submitted = false;
    STATE.lastAnswerCorrect = false;

    const mask = document.getElementById('sheetMask');
    const sheet = document.getElementById('riddleSheet');
    const content = document.getElementById('sheetContent');
    const actionBar = document.getElementById('sheetActionBar');

    // 渲染内容
    renderSheetContent(riddle);

    // 重置提交栏
    document.getElementById('actionHint').textContent = '选择谜底';
    const submitBtn = document.getElementById('actionSubmit');
    submitBtn.disabled = true;
    submitBtn.textContent = '提交';

    // 显示
    mask.classList.add('show');
    sheet.classList.add('show');
  }

  function closeRiddleSheet() {
    const mask = document.getElementById('sheetMask');
    const sheet = document.getElementById('riddleSheet');

    mask.classList.remove('show');
    sheet.classList.remove('show');

    STATE.currentRiddleId = null;
  }

  function renderSheetContent(riddle) {
    const content = document.getElementById('sheetContent');

    let optionsHtml = '';
    if (riddle.mode === 'choice' && riddle.options) {
      optionsHtml = `
        <div class="sheet-options" id="sheetOptions">
          ${riddle.options.map((opt, i) => `
            <div class="option-item" data-option="${opt}">
              <div class="option-circle"></div>
              <span class="option-text">${opt}</span>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      optionsHtml = `
        <div class="sheet-input-wrap">
          <input type="text" class="sheet-input" id="sheetInput" placeholder="请输入谜底..." maxlength="10">
        </div>
      `;
    }

    content.innerHTML = `
      <div class="sheet-riddle-header">
        <span class="sheet-riddle-category">${riddle.category} · ${riddle.hint}</span>
        <div class="sheet-riddle-question">
          ${riddle.question.split('\n').join('<br>')}
        </div>
        <div class="sheet-riddle-hint">— 猜一猜 —</div>
      </div>
      ${optionsHtml}
      <div style="height:80px"></div>
    `;

    // 绑定选项点击
    if (riddle.mode === 'choice') {
      content.querySelectorAll('.option-item').forEach(item => {
        item.addEventListener('click', () => {
          if (STATE.submitted) return;
          content.querySelectorAll('.option-item').forEach(o => o.classList.remove('selected'));
          item.classList.add('selected');
          STATE.selectedOption = item.dataset.option;
          document.getElementById('actionSubmit').disabled = false;
          document.getElementById('actionHint').textContent = '已选：' + STATE.selectedOption;
        });
      });
    } else {
      const input = content.querySelector('#sheetInput');
      input.addEventListener('input', (e) => {
        STATE.inputAnswer = e.target.value.trim();
        document.getElementById('actionSubmit').disabled = STATE.inputAnswer.length === 0;
        document.getElementById('actionHint').textContent = STATE.inputAnswer ?
          '已输入：' + STATE.inputAnswer : '请输入谜底';
      });
    }
  }

  function submitAnswer() {
    if (!STATE.currentRiddleId) return;
    if (STATE.submitted) return;

    const riddle = RIDDLES.find(r => r.id === STATE.currentRiddleId);
    if (!riddle) return;

    const userAnswer = riddle.mode === 'choice' ? STATE.selectedOption : STATE.inputAnswer;
    if (!userAnswer) return;

    STATE.submitted = true;
    const isCorrect = userAnswer === riddle.answer;
    STATE.lastAnswerCorrect = isCorrect;

    const content = document.getElementById('sheetContent');
    const submitBtn = document.getElementById('actionSubmit');
    const actionHint = document.getElementById('actionHint');

    // 标记选项对错
    if (riddle.mode === 'choice') {
      content.querySelectorAll('.option-item').forEach(item => {
        const opt = item.dataset.option;
        if (opt === riddle.answer) {
          item.style.borderColor = '#52c41a';
          item.style.background = 'rgba(82, 196, 26, 0.08)';
          const circle = item.querySelector('.option-circle');
          circle.style.borderColor = '#52c41a';
          circle.style.background = '#52c41a';
        } else if (opt === userAnswer && !isCorrect) {
          item.style.borderColor = '#ff4d4f';
          item.style.background = 'rgba(255, 77, 79, 0.08)';
          const circle = item.querySelector('.option-circle');
          circle.style.borderColor = '#ff4d4f';
          circle.style.background = '#ff4d4f';
        }
        item.style.pointerEvents = 'none';
      });
    }

    // 添加结果区
    const resultEl = document.createElement('div');
    resultEl.className = 'sheet-result' + (isCorrect ? '' : ' result-wrong');
    resultEl.innerHTML = `
      <div class="result-title ${isCorrect ? 'correct' : 'wrong'}">
        ${isCorrect ? '🏮 猜中了！' : '✗ 猜错了'}
      </div>
      <div class="result-answer">谜底：${riddle.answer}</div>
      <div class="result-explanation">${riddle.explanation}</div>
    `;

    // 插入到选项下方
    const optionsEl = content.querySelector('.sheet-options') || content.querySelector('.sheet-input-wrap');
    if (optionsEl) {
      optionsEl.insertAdjacentElement('afterend', resultEl);
    }

    // 更新操作栏
    if (isCorrect) {
      actionHint.textContent = '花灯即将点亮';
      submitBtn.disabled = false;
      submitBtn.textContent = '收入灯册';

      // 如果已经猜过，也显示结果但不重复添加
      const lanternIndex = RIDDLES.findIndex(r => r.id === riddle.id);
      const alreadyLit = isLit(riddle.id);

      submitBtn.onclick = () => {
        closeRiddleSheet();
        if (!alreadyLit) {
          addToCollection(riddle, lanternIndex);
          // 更新灯市状态
          updateLanternLit(riddle.id);
          // 播放揭晓动画
          showReveal(riddle);
        } else {
          showToast('此谜已收入灯册');
        }
      };
    } else {
      actionHint.textContent = '再试一次吧';
      submitBtn.disabled = false;
      submitBtn.textContent = '再猜一次';
      submitBtn.onclick = () => {
        // 重置
        STATE.submitted = false;
        STATE.selectedOption = null;
        STATE.inputAnswer = '';
        renderSheetContent(riddle);
        submitBtn.disabled = true;
        submitBtn.textContent = '提交';
        actionHint.textContent = '选择谜底';
        submitBtn.onclick = null;
      };
    }
  }

  function updateLanternLit(riddleId) {
    const unit = document.querySelector(`.lantern-unit[data-riddle-id="${riddleId}"]`);
    if (unit) {
      unit.classList.add('lit');
    }
    renderProgress();
    renderCollection();
  }

  // ============ 揭晓动画 ============
  function showReveal(riddle) {
    const overlay = document.getElementById('revealOverlay');
    const lanternEl = document.getElementById('revealLantern');

    // 构建花灯
    lanternEl.innerHTML = `
      <div class="reveal-lantern-cap top"></div>
      <div class="reveal-lantern-shape"></div>
      <div class="reveal-lantern-glow"></div>
      <div class="reveal-lantern-cap bottom"></div>
      <div class="reveal-lantern-tassel"></div>
    `;

    document.getElementById('revealTitle').textContent = '猜中了！';
    document.getElementById('revealSub').textContent = riddle.answer + ' · 已收入灯册';

    overlay.classList.add('show');
  }

  function closeReveal() {
    const overlay = document.getElementById('revealOverlay');
    overlay.classList.remove('show');
  }

  // ============ 灯册页 ============
  function renderCollection() {
    const list = document.getElementById('collectionList');
    const empty = document.getElementById('collectionEmpty');
    const items = getSortedCollection();

    if (items.length === 0) {
      list.innerHTML = '';
      empty.classList.add('show');
      return;
    }

    empty.classList.remove('show');
    list.innerHTML = '';

    items.forEach(item => {
      const pinned = STATE.pinnedIds.has(item.id);
      const date = new Date(item.unlockedAt);
      const dateStr = `${date.getMonth() + 1}月${date.getDate()}日`;

      const el = document.createElement('div');
      el.className = 'collection-item' + (pinned ? ' pinned' : '');
      el.dataset.itemId = item.id;

      el.innerHTML = `
        <div class="collection-actions">
          <button class="action-btn pin" data-action="pin">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 17v5M9 2h6l-1 7 3 3H7l3-3-1-7z"/>
            </svg>
            <span>${pinned ? '取消' : '置顶'}</span>
          </button>
          <button class="action-btn delete" data-action="delete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            </svg>
            <span>删除</span>
          </button>
        </div>
        <div class="collection-item-swipe">
          <div class="item-lantern">
            <div class="item-lantern-cap top"></div>
            <div class="item-lantern-shape"></div>
            <div class="item-lantern-cap bottom"></div>
          </div>
          <div class="item-info">
            <div class="item-question">${item.riddle.question.split('\n')[0]}</div>
            <div class="item-meta">
              <span class="item-answer-tag">${item.riddle.answer}</span>
              <span class="item-date">${dateStr} 收入</span>
              <span class="item-pin-icon">★ 置顶</span>
            </div>
          </div>
        </div>
      `;

      list.appendChild(el);

      // 绑定左滑
      initSwipeItem(el, item.id);

      // 绑定操作按钮
      el.querySelector('.action-btn.pin').addEventListener('click', (e) => {
        e.stopPropagation();
        togglePin(item.id);
        renderCollection();
      });
      el.querySelector('.action-btn.delete').addEventListener('click', (e) => {
        e.stopPropagation();
        removeFromCollection(item.id);
        renderCollection();
        renderMarket();
        showToast('已从灯册移除');
      });
    });
  }

  // ============ 左滑操作 ============
  function initSwipeItem(itemEl, itemId) {
    const swipeEl = itemEl.querySelector('.collection-item-swipe');
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let isDragging = false;
    let isHorizontal = false;
    let isVertical = false;
    const MAX_SWIPE = 144;

    swipeEl.addEventListener('touchstart', handleStart, { passive: true });
    swipeEl.addEventListener('touchmove', handleMove, { passive: false });
    swipeEl.addEventListener('touchend', handleEnd);

    // 鼠标支持
    swipeEl.addEventListener('mousedown', handleMouseDown);

    function handleStart(e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      currentX = itemEl.classList.contains('swiped') ? -MAX_SWIPE : 0;
      isDragging = true;
      isHorizontal = false;
      isVertical = false;
      swipeEl.style.transition = 'none';
    }

    function handleMove(e) {
      if (!isDragging) return;
      const dx = e.touches[0].clientX - startX;
      const dy = Math.abs(e.touches[0].clientY - startY);

      if (!isHorizontal && !isVertical) {
        if (Math.abs(dx) > 8 && Math.abs(dx) > dy) {
          isHorizontal = true;
          closeAllSwipe(itemId);
        } else if (dy > 8) {
          isVertical = true;
          isDragging = false;
          return;
        }
      }

      if (isHorizontal) {
        e.preventDefault();
        let newX = currentX + dx;
        // 限制范围
        if (newX > 0) newX = newX * 0.2; // 右拉阻尼
        if (newX < -MAX_SWIPE - 20) newX = -MAX_SWIPE - 20 + (newX + MAX_SWIPE + 20) * 0.2; // 左拉过度阻尼
        swipeEl.style.transform = `translateX(${newX}px)`;
      }
    }

    function handleEnd(e) {
      if (!isDragging) return;
      isDragging = false;
      swipeEl.style.transition = '';

      const endX = parseFloat(swipeEl.style.transform.replace('translateX(', '')) || 0;
      const threshold = -MAX_SWIPE / 2;

      if (isHorizontal) {
        if (endX < threshold) {
          itemEl.classList.add('swiped');
          swipeEl.style.transform = `translateX(${-MAX_SWIPE}px)`;
        } else {
          itemEl.classList.remove('swiped');
          swipeEl.style.transform = 'translateX(0)';
        }
      }
    }

    // 鼠标
    function handleMouseDown(e) {
      if (e.button !== 0) return;
      startX = e.clientX;
      startY = e.clientY;
      currentX = itemEl.classList.contains('swiped') ? -MAX_SWIPE : 0;
      isDragging = true;
      isHorizontal = false;
      isVertical = false;
      swipeEl.style.transition = 'none';

      const onMouseMove = (ev) => {
        if (!isDragging) return;
        const dx = ev.clientX - startX;
        const dy = Math.abs(ev.clientY - startY);

        if (!isHorizontal && !isVertical) {
          if (Math.abs(dx) > 6 && Math.abs(dx) > dy) {
            isHorizontal = true;
            closeAllSwipe(itemId);
          } else if (dy > 6) {
            isVertical = true;
            isDragging = false;
            return;
          }
        }

        if (isHorizontal) {
          let newX = currentX + dx;
          if (newX > 0) newX = newX * 0.2;
          if (newX < -MAX_SWIPE - 20) newX = -MAX_SWIPE - 20 + (newX + MAX_SWIPE + 20) * 0.2;
          swipeEl.style.transform = `translateX(${newX}px)`;
        }
      };

      const onMouseUp = () => {
        if (!isDragging) {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          return;
        }
        isDragging = false;
        swipeEl.style.transition = '';

        const transform = swipeEl.style.transform;
        const match = transform.match(/-?\d+\.?\d*/);
        const endX = match ? parseFloat(match[0]) : 0;

        if (isHorizontal) {
          if (endX < -MAX_SWIPE / 2) {
            itemEl.classList.add('swiped');
            swipeEl.style.transform = `translateX(${-MAX_SWIPE}px)`;
          } else {
            itemEl.classList.remove('swiped');
            swipeEl.style.transform = 'translateX(0)';
          }
        }

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
  }

  function closeAllSwipe(exceptId) {
    document.querySelectorAll('.collection-item.swiped').forEach(item => {
      if (exceptId && item.dataset.itemId === exceptId) return;
      item.classList.remove('swiped');
      const swipeEl = item.querySelector('.collection-item-swipe');
      if (swipeEl) swipeEl.style.transform = 'translateX(0)';
    });
  }

  // ============ Toast ============
  let toastTimer = null;
  function showToast(message, duration) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, duration || 1800);
  }

  // ============ 状态栏时间 ============
  function updateStatusTime() {
    const el = document.getElementById('statusTime');
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    el.textContent = `${h}:${m}`;
  }

  // ============ 初始化 ============
  function init() {
    loadState();
    initCursor();
    renderMarket();
    renderCollection();
    initPullRefresh();
    updateStatusTime();
    setInterval(updateStatusTime, 60000);

    // TabBar 切换
    document.querySelectorAll('.tab-item').forEach(tab => {
      tab.addEventListener('click', () => {
        switchPage(tab.dataset.tab);
      });
    });

    // 返回按钮
    document.getElementById('navBackBtn').addEventListener('click', closeRiddleSheet);

    // 遮罩点击关闭
    document.getElementById('sheetMask').addEventListener('click', closeRiddleSheet);

    // 提交按钮
    document.getElementById('actionSubmit').addEventListener('click', submitAnswer);

    // 揭晓关闭
    document.getElementById('revealClose').addEventListener('click', closeReveal);

    // 灯市滚动同步进度
    const scroll = document.getElementById('marketScroll');
    scroll.addEventListener('scroll', syncProgressActive, { passive: true });

    // 点击空白处关闭左滑
    document.querySelector('.page-collection').addEventListener('click', (e) => {
      if (!e.target.closest('.collection-item')) {
        closeAllSwipe();
      }
    });

    // 初始同步一次进度
    setTimeout(syncProgressActive, 100);

    // prefers-reduced-motion 处理
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      // 减少动画模式下，直接显示
      document.querySelectorAll('.lantern-light').forEach(el => {
        el.style.animation = 'none';
      });
    }
  }

  // 页面卸载清理
  window.addEventListener('beforeunload', () => {
    if (cursor.rafId) cancelAnimationFrame(cursor.rafId);
  });

  // 启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
