/* ==========================================================
   邻里工具箱 · 微信小程序 V2
   交互逻辑：页面切换、下拉刷新、左滑操作、扫码动效、借用流程
   ========================================================== */

(function () {
  'use strict';

  // ========== 数据模型 ==========
  const TOOLS = [
    {
      id: 't001',
      name: '博世冲击电钻',
      emoji: '🔫',
      category: '电动工具',
      desc: '家用多功能冲击钻，配12件套钻头，钻墙钻木都能用。上次换了新碳刷，状态良好。',
      owner: '5栋老王',
      building: '5栋 3单元 602',
      ownerCredit: 820,
      status: 'available',
      creditRequired: 50,
      distance: 120,
      borrowDays: 3
    },
    {
      id: 't002',
      name: '折叠人字梯',
      emoji: '🪜',
      category: '家居维修',
      desc: '五步铝合金折叠梯，承重150kg。换灯泡、擦窗户、装窗帘必备。不用时折叠靠墙角不占地。',
      owner: '3栋张姐',
      building: '3栋 2单元 401',
      ownerCredit: 760,
      status: 'borrowed',
      creditRequired: 30,
      distance: 80,
      borrowDays: 2
    },
    {
      id: 't003',
      name: '家用缝纫机',
      emoji: '🧵',
      category: '家居维修',
      desc: '兄弟牌家用电动缝纫机，可锁边、钉扣、绗缝。附带各种压脚和线团一盒。',
      owner: '7栋李阿姨',
      building: '7栋 1单元 302',
      ownerCredit: 910,
      status: 'available',
      creditRequired: 40,
      distance: 200,
      borrowDays: 5
    },
    {
      id: 't004',
      name: '露营帐篷（4人）',
      emoji: '⛺',
      category: '户外露营',
      desc: '牧高笛冷山4人帐篷，双层防雨。周末露营回来刚洗干净，配件齐全（地钉、风绳、防潮垫）。',
      owner: '2栋大刘',
      building: '2栋 1单元 1203',
      ownerCredit: 850,
      status: 'available',
      creditRequired: 80,
      distance: 150,
      borrowDays: 3
    },
    {
      id: 't005',
      name: '锂电除草机',
      emoji: '🌿',
      category: '电动工具',
      desc: '博世18V锂电除草机，两块电池满电。修剪草坪、清理杂草利器。送除草刀片一副。',
      owner: '9栋陈叔',
      building: '9栋 2单元 101',
      ownerCredit: 880,
      status: 'soon',
      creditRequired: 60,
      distance: 300,
      borrowDays: 2
    },
    {
      id: 't006',
      name: '激光测距仪',
      emoji: '📏',
      category: '测量工具',
      desc: '博世50米激光测距仪，精度±1.5mm。装修量房、买家具量尺寸神器。附原厂便携包。',
      owner: '6栋小林',
      building: '6栋 3单元 805',
      ownerCredit: 790,
      status: 'available',
      creditRequired: 35,
      distance: 180,
      borrowDays: 1
    },
    {
      id: 't007',
      name: '管道疏通器',
      emoji: '🔧',
      category: '家居维修',
      desc: '电动管道疏通器，10米弹簧线。马桶、地漏、洗手池堵塞都能通。配专用手套一副。',
      owner: '4栋赵师傅',
      building: '4栋 2单元 201',
      ownerCredit: 835,
      status: 'available',
      creditRequired: 25,
      distance: 95,
      borrowDays: 1
    }
  ];

  // 我的借用记录
  const BORROW_RECORDS = [
    {
      id: 'b001',
      toolId: 't005',
      toolName: '锂电除草机',
      emoji: '🌿',
      owner: '9栋陈叔',
      building: '9栋 2单元 101',
      borrowDate: '2026-08-17',
      dueDate: '2026-08-19',
      status: 'ongoing',
      credit: 60,
      remaining: 0 // 小时
    },
    {
      id: 'b002',
      toolId: 't006',
      toolName: '激光测距仪',
      emoji: '📏',
      owner: '6栋小林',
      building: '6栋 3单元 805',
      borrowDate: '2026-08-18',
      dueDate: '2026-08-19',
      status: 'soon',
      credit: 35,
      remaining: 8 // 小时
    }
  ];

  // 信用记录
  const CREDIT_RECORDS = [
    { id: 'c001', icon: '✅', title: '归还冲击电钻', desc: '按时归还 +5 分', change: 5, time: '昨天 18:30', type: 'plus' },
    { id: 'c002', icon: '📤', title: '出借折叠人字梯', desc: '邻居张姐借用 +2 分', change: 2, time: '8月16日 09:15', type: 'plus' },
    { id: 'c003', icon: '🔍', title: '借用露营帐篷', desc: '申请借用 预扣80分', change: -80, time: '8月14日 14:20', type: 'minus' },
    { id: 'c004', icon: '✅', title: '归还管道疏通器', desc: '按时归还 +5 分', change: 5, time: '8月12日 20:05', type: 'plus' },
    { id: 'c005', icon: '⏰', title: '逾期归还缝纫机', desc: '逾期1天 -10 分', change: -10, time: '8月8日 11:30', type: 'minus' },
    { id: 'c006', icon: '🎉', title: '新用户注册', desc: '初始信用分 760', change: 0, time: '6月15日', type: 'info' }
  ];

  // ========== 状态 ==========
  let currentTab = 'plaza';
  let currentBorrowTab = 'ongoing';
  let creditScore = 785;
  let pageStack = ['plaza']; // 页面栈
  let isRefreshing = false;
  let pullStartY = 0;
  let pullDistance = 0;
  let swipeState = null;
  let activeSwipeItem = null;
  let rafId = null;
  let visibilityTimer = null;

  // ========== 自定义光标 ==========
  function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;

    // 初始在屏幕中央
    cursor.style.left = '50%';
    cursor.style.top = '50%';

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    function updateCursor() {
      // 平滑跟随
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      rafId = requestAnimationFrame(updateCursor);
    }

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // hover 状态
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('button, .tab-item, .tool-card, .menu-item, .cat-item, .borrow-tab, .nav-back, .scan-fab, .scanner-close, .empty-btn, .borrow-actions')) {
        cursor.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest('button, .tab-item, .tool-card, .menu-item, .cat-item, .borrow-tab, .nav-back, .scan-fab, .scanner-close, .empty-btn, .borrow-actions')) {
        cursor.classList.remove('cursor-hover');
      }
    });

    // 点击反馈
    document.addEventListener('mousedown', function () {
      cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
    });
    document.addEventListener('mouseup', function () {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    updateCursor();

    // 页面可见性变化时暂停/恢复
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      } else {
        if (!rafId) updateCursor();
      }
    });
  }

  // ========== Tab 切换 ==========
  function switchTab(tab) {
    if (currentTab === tab && pageStack.length <= 1) return;

    // 重置页面栈
    pageStack = [tab];

    const pages = document.querySelectorAll('.page');
    pages.forEach(function (p) {
      if (p.dataset.page === tab) {
        p.classList.add('page-active');
        p.classList.remove('page-detail');
      } else {
        p.classList.remove('page-active');
      }
    });

    // 更新 tab 样式
    const tabs = document.querySelectorAll('.tab-item');
    tabs.forEach(function (t) {
      if (t.dataset.tab === tab) {
        t.classList.add('tab-active');
      } else {
        t.classList.remove('tab-active');
      }
    });

    currentTab = tab;

    // 重新触发进入动画
    if (tab === 'plaza') {
      const cards = document.querySelectorAll('.tool-card');
      cards.forEach(function (c, i) {
        c.style.animation = 'none';
        // 强制 reflow
        void c.offsetWidth;
        c.style.animation = '';
        c.style.animationDelay = (i * 0.05 + 0.05) + 's';
      });
    }
  }

  // ========== 页面栈 push/pop ==========
  function showPage(pageName) {
    const targetPage = document.getElementById('page-' + pageName);
    if (!targetPage) return;

    pageStack.push(pageName);

    // 详情页用 push 动画
    targetPage.classList.add('page-detail', 'page-active');

    // 隐藏 tabBar（详情页）
    const tabBar = document.getElementById('tabBar');
    const scanFab = document.getElementById('scanFAB');
    if (tabBar) tabBar.style.opacity = '0';
    if (scanFab) scanFab.style.opacity = '0';
  }

  function goBack() {
    if (pageStack.length <= 1) return;

    const currentPageName = pageStack.pop();
    const currentPage = document.getElementById('page-' + currentPageName);
    if (currentPage) {
      currentPage.classList.remove('page-active');
    }

    // 回到 tab 页
    if (pageStack.length === 1) {
      const tabBar = document.getElementById('tabBar');
      const scanFab = document.getElementById('scanFAB');
      if (tabBar) tabBar.style.opacity = '1';
      if (scanFab) scanFab.style.opacity = '1';
    }
  }

  // ========== 工具列表渲染 ==========
  function renderToolList() {
    const list = document.getElementById('toolList');
    if (!list) return;

    list.innerHTML = '';
    TOOLS.forEach(function (tool) {
      const statusText = tool.status === 'available' ? '可借' :
                         tool.status === 'borrowed' ? '借出中' : '即将归还';
      const statusClass = tool.status === 'available' ? 'status-available' :
                          tool.status === 'borrowed' ? 'status-borrowed' : 'status-soon';

      const card = document.createElement('div');
      card.className = 'tool-card';
      card.dataset.toolId = tool.id;
      card.innerHTML = `
        <div class="tool-img">${tool.emoji}</div>
        <div class="tool-info">
          <div>
            <div class="tool-name">${tool.name}</div>
            <div class="tool-desc">${tool.category} · ${tool.distance}米</div>
          </div>
          <div class="tool-meta">
            <div class="tool-owner">${tool.owner} · ${tool.building.split(' ')[0]}</div>
            <div class="tool-credit">信用 ${tool.creditRequired} 分</div>
          </div>
        </div>
        <div class="tool-status ${statusClass}">${statusText}</div>
      `;
      card.addEventListener('click', function () {
        openToolDetail(tool);
      });
      list.appendChild(card);
    });
  }

  // ========== 借用列表渲染（带左滑） ==========
  function renderBorrowList() {
    const list = document.getElementById('borrowList');
    const empty = document.getElementById('borrowEmpty');
    if (!list) return;

    const filtered = BORROW_RECORDS.filter(function (r) {
      if (currentBorrowTab === 'ongoing') return r.status === 'ongoing';
      if (currentBorrowTab === 'soon') return r.status === 'soon';
      if (currentBorrowTab === 'overdue') return r.status === 'overdue';
      return false;
    });

    if (filtered.length === 0) {
      list.style.display = 'none';
      if (empty) empty.style.display = 'flex';
      return;
    }

    list.style.display = 'flex';
    if (empty) empty.style.display = 'none';

    list.innerHTML = '';
    filtered.forEach(function (record, index) {
      const wrap = document.createElement('div');
      wrap.className = 'borrow-item-wrap';
      wrap.style.animationDelay = (index * 0.08) + 's';

      const isDueSoon = record.status === 'soon';
      const dueText = isDueSoon ? `${record.remaining}小时后到期` : `还剩 ${record.remaining} 小时`;

      wrap.innerHTML = `
        <div class="borrow-actions" data-borrow-id="${record.id}">
          确认归还
        </div>
        <div class="borrow-item" data-borrow-id="${record.id}">
          <div class="borrow-tool-img">${record.emoji}</div>
          <div class="borrow-info">
            <div>
              <div class="borrow-name">${record.toolName}</div>
              <div class="borrow-from">出借人：${record.owner} · ${record.building}</div>
            </div>
            <div class="borrow-time">
              <span class="borrow-due ${isDueSoon ? 'due-warn' : ''}">到期：${record.dueDate}</span>
              <span class="borrow-countdown">⏱ ${dueText}</span>
            </div>
          </div>
        </div>
      `;

      list.appendChild(wrap);

      // 绑定左滑事件
      const item = wrap.querySelector('.borrow-item');
      const action = wrap.querySelector('.borrow-actions');

      initSwipe(item, action, record, wrap);
    });
  }

  // ========== 左滑操作 ==========
  function initSwipe(item, action, record, wrap) {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let isOpen = false;
    const maxSwipe = 80;

    function onStart(e) {
      const touch = e.touches ? e.touches[0] : e;
      startX = touch.clientX;
      isDragging = true;
      item.style.transition = 'none';
    }

    function onMove(e) {
      if (!isDragging) return;
      const touch = e.touches ? e.touches[0] : e;
      const diff = touch.clientX - startX;

      // 关闭其他已打开的项
      if (activeSwipeItem && activeSwipeItem !== item && isOpen === false) {
        closeSwipe(activeSwipeItem);
      }

      if (diff < 0) {
        // 左滑
        currentX = Math.max(diff, -maxSwipe);
        item.style.transform = 'translateX(' + currentX + 'px)';
      } else if (isOpen) {
        // 右滑关闭
        currentX = Math.min(-maxSwipe + diff, 0);
        item.style.transform = 'translateX(' + currentX + 'px)';
      }
    }

    function onEnd() {
      if (!isDragging) return;
      isDragging = false;
      item.style.transition = 'transform 0.25s ease';

      if (currentX < -maxSwipe / 2) {
        item.style.transform = 'translateX(-' + maxSwipe + 'px)';
        isOpen = true;
        activeSwipeItem = item;
      } else {
        item.style.transform = 'translateX(0)';
        isOpen = false;
        if (activeSwipeItem === item) activeSwipeItem = null;
      }
    }

    item.addEventListener('touchstart', onStart, { passive: true });
    item.addEventListener('touchmove', onMove, { passive: true });
    item.addEventListener('touchend', onEnd);

    // 鼠标模拟（桌面端测试）
    item.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      onStart(e);
      function mm(ev) { onMove(ev); }
      function mu() {
        onEnd();
        document.removeEventListener('mousemove', mm);
        document.removeEventListener('mouseup', mu);
      }
      document.addEventListener('mousemove', mm);
      document.addEventListener('mouseup', mu);
    });

    // 点击归还按钮
    action.addEventListener('click', function (e) {
      e.stopPropagation();
      confirmReturn(record.id, item, wrap);
    });
  }

  function closeSwipe(item) {
    item.style.transition = 'transform 0.25s ease';
    item.style.transform = 'translateX(0)';
    activeSwipeItem = null;
  }

  // ========== 确认归还 ==========
  function confirmReturn(borrowId, itemEl, wrapEl) {
    // 找到记录
    const recordIndex = BORROW_RECORDS.findIndex(function (r) { return r.id === borrowId; });
    if (recordIndex === -1) return;

    const record = BORROW_RECORDS[recordIndex];

    // 显示归还确认 toast
    showToast('归还成功', '✓', function () {
      // 移除记录
      BORROW_RECORDS.splice(recordIndex, 1);

      // 信用分返还
      updateCredit(record.credit + 5); // 归还 +5

      // 添加信用记录
      CREDIT_RECORDS.unshift({
        id: 'c_new_' + Date.now(),
        icon: '✅',
        title: '归还' + record.toolName,
        desc: '按时归还 +5 分',
        change: record.credit + 5,
        time: '刚刚',
        type: 'plus'
      });
      renderCreditRecords();

      // 移除 DOM 元素
      wrapEl.style.transition = 'all 0.3s ease';
      wrapEl.style.opacity = '0';
      wrapEl.style.transform = 'translateX(-100%)';
      setTimeout(function () {
        wrapEl.remove();
        renderBorrowList(); // 重新渲染以更新空状态
      }, 300);
    });
  }

  // ========== 信用分更新（数字滚动动效） ==========
  function updateCredit(newScore) {
    creditScore = newScore;

    const scoreEl = document.getElementById('creditScore');
    const miniEl = document.getElementById('miniCredit');

    if (scoreEl) {
      animateNumber(scoreEl, parseInt(scoreEl.textContent), newScore, 800);
    }
    if (miniEl) {
      animateNumber(miniEl, parseInt(miniEl.textContent), newScore, 800);
    }
  }

  function animateNumber(el, from, to, duration) {
    const startTime = performance.now();
    const diff = to - from;

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuart
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(from + diff * eased);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  // ========== 信用记录渲染 ==========
  function renderCreditRecords() {
    const list = document.getElementById('creditRecords');
    if (!list) return;

    list.innerHTML = '';
    CREDIT_RECORDS.slice(0, 8).forEach(function (record, index) {
      const item = document.createElement('div');
      item.className = 'credit-record-item';
      item.style.animationDelay = (index * 0.05) + 's';

      let changeText = '';
      let changeClass = '';
      if (record.change > 0) {
        changeText = '+' + record.change;
        changeClass = 'record-plus';
      } else if (record.change < 0) {
        changeText = record.change;
        changeClass = 'record-minus';
      } else {
        changeText = '';
      }

      item.innerHTML = `
        <div class="record-icon">${record.icon}</div>
        <div class="record-info">
          <div class="record-title">${record.title}</div>
          <div class="record-time">${record.time}</div>
        </div>
        <div class="record-change ${changeClass}">${changeText}</div>
      `;
      list.appendChild(item);
    });
  }

  // ========== 工具详情半屏弹层 ==========
  function openToolDetail(tool) {
    const sheet = document.getElementById('bottomSheet');
    const overlay = document.getElementById('sheetOverlay');
    const content = document.getElementById('sheetContent');
    const creditNum = document.getElementById('sheetCreditNum');
    const borrowBtn = document.getElementById('btnBorrow');

    if (!sheet || !content) return;

    const statusText = tool.status === 'available' ? '可借' :
                       tool.status === 'borrowed' ? '借出中' : '即将归还';
    const statusClass = tool.status === 'available' ? 'status-available' :
                        tool.status === 'borrowed' ? 'status-borrowed' : 'status-soon';

    const canBorrow = tool.status === 'available';

    content.innerHTML = `
      <div class="detail-header">
        <div class="detail-img">${tool.emoji}</div>
        <div class="detail-header-info">
          <div>
            <div class="detail-name">${tool.name}</div>
            <span class="detail-category">${tool.category}</span>
          </div>
          <div class="detail-status-tag ${statusClass}">${statusText}</div>
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-section-title">工具说明</div>
        <div class="detail-desc">${tool.desc}</div>
      </div>

      <div class="detail-section">
        <div class="detail-section-title">出借人</div>
        <div class="owner-card">
          <div class="owner-avatar-sm">${tool.owner.charAt(0)}</div>
          <div class="owner-info">
            <div class="owner-name">${tool.owner}</div>
            <div class="owner-meta">
              <span>${tool.building}</span>
              <span>·</span>
              <span class="owner-credit-badge">信用 ${tool.ownerCredit} 分</span>
            </div>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-section-title">借用规则</div>
        <div class="borrow-tip">
          借期 ${tool.borrowDays} 天，到期前会收到提醒。按时归还信用分返还并额外 +5 分，逾期每天扣 10 分。
        </div>
      </div>
    `;

    // 更新信用分
    if (creditNum) creditNum.textContent = tool.creditRequired;

    // 更新按钮状态
    if (borrowBtn) {
      if (canBorrow) {
        borrowBtn.disabled = false;
        borrowBtn.querySelector('span').textContent = '申请借用';
        borrowBtn.style.opacity = '1';
      } else {
        borrowBtn.disabled = true;
        borrowBtn.querySelector('span').textContent = '暂不可借';
        borrowBtn.style.opacity = '0.5';
      }
      borrowBtn.dataset.toolId = tool.id;
    }

    // 显示
    requestAnimationFrame(function () {
      sheet.classList.add('visible');
      overlay.classList.add('visible');
    });
  }

  function closeSheet() {
    const sheet = document.getElementById('bottomSheet');
    const overlay = document.getElementById('sheetOverlay');
    if (sheet) sheet.classList.remove('visible');
    if (overlay) overlay.classList.remove('visible');
  }

  // ========== 确认借用 ==========
  function confirmBorrow() {
    const borrowBtn = document.getElementById('btnBorrow');
    if (!borrowBtn || borrowBtn.disabled) return;

    const toolId = borrowBtn.dataset.toolId;
    const tool = TOOLS.find(function (t) { return t.id === toolId; });
    if (!tool) return;

    // 信用分预扣动画
    showCreditPopup('-' + tool.creditRequired, '信用预扣');

    // 关闭半屏
    setTimeout(function () {
      closeSheet();

      // 显示成功 toast
      setTimeout(function () {
        showToast('申请已提交', '✓', function () {
          // 更新工具状态
          tool.status = 'borrowed';
          renderToolList();

          // 添加借用记录
          const now = new Date();
          const dueDate = new Date(now.getTime() + tool.borrowDays * 24 * 60 * 60 * 1000);
          const formatDate = function (d) {
            return d.getFullYear() + '-' +
              String(d.getMonth() + 1).padStart(2, '0') + '-' +
              String(d.getDate()).padStart(2, '0');
          };

          BORROW_RECORDS.unshift({
            id: 'b_new_' + Date.now(),
            toolId: tool.id,
            toolName: tool.name,
            emoji: tool.emoji,
            owner: tool.owner,
            building: tool.building,
            borrowDate: formatDate(now),
            dueDate: formatDate(dueDate),
            status: 'ongoing',
            credit: tool.creditRequired,
            remaining: tool.borrowDays * 24
          });

          // 扣减信用分
          updateCredit(creditScore - tool.creditRequired);

          // 添加信用记录
          CREDIT_RECORDS.unshift({
            id: 'c_new_b_' + Date.now(),
            icon: '🔍',
            title: '借用' + tool.name,
            desc: '申请借用 预扣' + tool.creditRequired + '分',
            change: -tool.creditRequired,
            time: '刚刚',
            type: 'minus'
          });
          renderCreditRecords();

          // 切到借用页
          switchTab('borrow');
          currentBorrowTab = 'ongoing';
          updateBorrowTabs();
          renderBorrowList();
        });
      }, 200);
    }, 800);
  }

  // ========== 扫码功能 ==========
  function openScanner() {
    const overlay = document.getElementById('scannerOverlay');
    const result = document.getElementById('scanResult');
    const laser = document.getElementById('scannerLaser');

    if (!overlay) return;

    overlay.classList.add('visible');
    if (result) result.classList.remove('visible');
    if (laser) {
      laser.style.animation = 'scan 2s ease-in-out infinite';
    }

    // 2.5秒后模拟识别成功
    visibilityTimer = setTimeout(function () {
      simulateScanSuccess();
    }, 2500);
  }

  function closeScanner() {
    const overlay = document.getElementById('scannerOverlay');
    const result = document.getElementById('scanResult');

    if (visibilityTimer) {
      clearTimeout(visibilityTimer);
      visibilityTimer = null;
    }

    if (overlay) overlay.classList.remove('visible');
    if (result) result.classList.remove('visible');
  }

  function simulateScanSuccess() {
    const result = document.getElementById('scanResult');
    if (result) {
      result.classList.add('visible');
    }

    // 随机选一个可借工具
    const available = TOOLS.filter(function (t) { return t.status === 'available'; });
    const tool = available[Math.floor(Math.random() * available.length)];

    // 1秒后关闭扫码并打开详情
    visibilityTimer = setTimeout(function () {
      closeScanner();
      setTimeout(function () {
        openToolDetail(tool);
      }, 300);
    }, 1000);
  }

  // ========== Toast ==========
  function showToast(text, icon, callback) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toastText');
    const toastIcon = document.getElementById('toastIcon');

    if (!toast) return;

    if (toastText) toastText.textContent = text;
    if (toastIcon) toastIcon.textContent = icon || '✓';

    toast.classList.add('visible');

    setTimeout(function () {
      toast.classList.remove('visible');
      if (callback) callback();
    }, 1500);
  }

  // ========== 信用分浮动动效 ==========
  function showCreditPopup(num, label) {
    const popup = document.getElementById('creditPopup');
    const numEl = document.getElementById('creditPopupNum');
    const labelEl = document.getElementById('creditPopupLabel');

    if (!popup) return;

    if (numEl) numEl.textContent = num;
    if (labelEl) labelEl.textContent = label || '信用分';

    // 重启动画
    popup.classList.remove('animate');
    // 强制 reflow
    void popup.offsetWidth;
    popup.classList.add('animate');
  }

  // ========== 下拉刷新 ==========
  function initPullRefresh() {
    const plazaPage = document.getElementById('page-plaza');
    const pullEl = document.getElementById('pullRefresh');
    if (!plazaPage || !pullEl) return;

    let startY = 0;
    let pulling = false;
    const threshold = 60;

    plazaPage.addEventListener('touchstart', function (e) {
      if (plazaPage.scrollTop <= 0) {
        startY = e.touches[0].clientY;
        pulling = true;
      }
    }, { passive: true });

    plazaPage.addEventListener('touchmove', function (e) {
      if (!pulling) return;
      const diff = e.touches[0].clientY - startY;

      if (diff > 0 && plazaPage.scrollTop <= 0) {
        const distance = Math.min(diff * 0.5, 100);
        pullEl.style.transform = 'translateY(' + (distance - 40) + 'px)';
        pullEl.classList.add('visible');

        const pullIcon = pullEl.querySelector('.pull-icon');
        if (distance > threshold) {
          pullIcon.style.transform = 'rotate(180deg)';
          pullEl.querySelector('.pull-text').textContent = '松开刷新';
        } else {
          pullIcon.style.transform = 'rotate(0deg)';
          pullEl.querySelector('.pull-text').textContent = '下拉刷新';
        }
      }
    }, { passive: true });

    plazaPage.addEventListener('touchend', function () {
      if (!pulling) return;
      pulling = false;

      const currentTransform = pullEl.style.transform;
      const match = currentTransform.match(/translateY\(([^)]+)\)/);
      const distance = match ? parseFloat(match[1]) + 40 : 0;

      if (distance > threshold) {
        // 触发刷新
        triggerRefresh();
      } else {
        // 回弹
        pullEl.style.transform = 'translateY(-40px)';
        pullEl.classList.remove('visible');
      }
    });

    // 桌面端鼠标模拟
    let mouseDown = false;
    plazaPage.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      if (plazaPage.scrollTop <= 0) {
        startY = e.clientY;
        mouseDown = true;
      }
    });

    document.addEventListener('mousemove', function (e) {
      if (!mouseDown) return;
      const diff = e.clientY - startY;
      if (diff > 0 && plazaPage.scrollTop <= 0) {
        const distance = Math.min(diff * 0.5, 100);
        pullEl.style.transform = 'translateY(' + (distance - 40) + 'px)';
        pullEl.classList.add('visible');

        const pullIcon = pullEl.querySelector('.pull-icon');
        if (distance > threshold) {
          pullIcon.style.transform = 'rotate(180deg)';
          pullEl.querySelector('.pull-text').textContent = '松开刷新';
        } else {
          pullIcon.style.transform = 'rotate(0deg)';
          pullEl.querySelector('.pull-text').textContent = '下拉刷新';
        }
      }
    });

    document.addEventListener('mouseup', function () {
      if (!mouseDown) return;
      mouseDown = false;

      const currentTransform = pullEl.style.transform;
      const match = currentTransform.match(/translateY\(([^)]+)\)/);
      const distance = match ? parseFloat(match[1]) + 40 : 0;

      if (distance > threshold) {
        triggerRefresh();
      } else {
        pullEl.style.transform = 'translateY(-40px)';
        pullEl.classList.remove('visible');
      }
    });

    function triggerRefresh() {
      if (isRefreshing) return;
      isRefreshing = true;

      pullEl.classList.add('refreshing');
      pullEl.style.transform = 'translateY(20px)';
      pullEl.querySelector('.pull-text').textContent = '刷新中...';

      // 模拟刷新
      setTimeout(function () {
        isRefreshing = false;
        pullEl.classList.remove('refreshing');
        pullEl.style.transform = 'translateY(-40px)';
        pullEl.classList.remove('visible');

        showToast('已更新 7 件工具', '↻');
      }, 1500);
    }
  }

  // ========== 分类筛选 ==========
  function initCategories() {
    const cats = document.querySelectorAll('.cat-item');
    cats.forEach(function (cat) {
      cat.addEventListener('click', function () {
        cats.forEach(function (c) { c.classList.remove('cat-active'); });
        cat.classList.add('cat-active');
      });
    });
  }

  // ========== 借用页 tabs ==========
  function updateBorrowTabs() {
    const tabs = document.querySelectorAll('.borrow-tab');
    tabs.forEach(function (t) {
      if (t.dataset.tab === currentBorrowTab) {
        t.classList.add('borrow-tab-active');
      } else {
        t.classList.remove('borrow-tab-active');
      }
    });
  }

  function initBorrowTabs() {
    const tabs = document.querySelectorAll('.borrow-tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        currentBorrowTab = tab.dataset.tab;
        updateBorrowTabs();
        renderBorrowList();
      });
    });
  }

  // ========== TabBar 初始化 ==========
  function initTabBar() {
    const tabs = document.querySelectorAll('.tab-item');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        switchTab(tab.dataset.tab);
      });
    });
  }

  // ========== 页面可见性 ==========
  function initVisibility() {
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        // 页面隐藏时清理定时器
        if (visibilityTimer) {
          clearTimeout(visibilityTimer);
          visibilityTimer = null;
        }
      }
    });
  }

  // ========== 导出全局函数 ==========
  window.switchTab = switchTab;
  window.showPage = showPage;
  window.goBack = goBack;
  window.openScanner = openScanner;
  window.closeScanner = closeScanner;
  window.closeSheet = closeSheet;
  window.confirmBorrow = confirmBorrow;

  // ========== 初始化 ==========
  document.addEventListener('DOMContentLoaded', function () {
    initCustomCursor();
    renderToolList();
    renderBorrowList();
    renderCreditRecords();
    initPullRefresh();
    initCategories();
    initBorrowTabs();
    initTabBar();
    initVisibility();

    // 初始显示第一个tab
    switchTab('plaza');

    // 扫码遮罩点击关闭（除了扫描区域）
    const scannerOverlay = document.getElementById('scannerOverlay');
    if (scannerOverlay) {
      scannerOverlay.addEventListener('click', function (e) {
        if (e.target === scannerOverlay) {
          closeScanner();
        }
      });
    }
  });

})();
