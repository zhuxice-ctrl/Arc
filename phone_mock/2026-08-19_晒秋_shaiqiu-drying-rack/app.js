/* =========================================
   晒秋 · 家庭风物晾晒管理
   核心逻辑
   ========================================= */
(function () {
  'use strict';

  // ========== 工具函数 ==========
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = 'ontouchstart' in window;

  // 颜色插值（hex）
  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  }
  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
  }
  function lerpColor(c1, c2, t) {
    const [r1, g1, b1] = hexToRgb(c1);
    const [r2, g2, b2] = hexToRgb(c2);
    return rgbToHex(lerp(r1, r2, t), lerp(g1, g2, t), lerp(b1, b2, t));
  }

  // ========== 数据模型 ==========
  const CATEGORIES = {
    larou: {
      id: 'larou',
      name: '腊肉',
      days: 14,
      baseWeight: 500,
      waterLoss: 0.35,
      colors: ['#C83C2A', '#A82A1A', '#8B1F14', '#6B1610'],
      desc: '五花肉经酱腌后风干，色泽由鲜红渐变为琥珀',
      saltOpts: ['light', 'mid', 'heavy']
    },
    jiangya: {
      id: 'jiangya',
      name: '酱鸭',
      days: 10,
      baseWeight: 800,
      waterLoss: 0.30,
      colors: ['#8B4513', '#6B3410', '#5A2A0D', '#4A2008'],
      desc: '整鸭酱制风干，表皮油亮酱香浓郁',
      saltOpts: ['mid', 'heavy']
    },
    luobogan: {
      id: 'luobogan',
      name: '萝卜干',
      days: 5,
      baseWeight: 1000,
      waterLoss: 0.75,
      colors: ['#D4A574', '#B8855A', '#9C6A42', '#7A5030'],
      desc: '白萝卜切条晾晒，清脆爽口下饭神器',
      saltOpts: ['light', 'mid']
    },
    manxiang: {
      id: 'manxiang',
      name: '鳗鲞',
      days: 7,
      baseWeight: 600,
      waterLoss: 0.40,
      colors: ['#E8D4B8', '#D4BE9A', '#BEA67E', '#A89068'],
      desc: '海鳗背开晾晒，风味独特鲜香扑鼻',
      saltOpts: ['mid', 'heavy']
    },
    shibing: {
      id: 'shibing',
      name: '柿饼',
      days: 20,
      baseWeight: 300,
      waterLoss: 0.55,
      colors: ['#E8915A', '#C8703A', '#A85528', '#8A421A'],
      desc: '柿子去皮挂晒，出霜后甜如蜜',
      saltOpts: ['light']
    }
  };

  const SALT_LEVELS = {
    light: { id: 'light', name: '淡口', desc: '盐量较少，适合佐餐直接食用', pct: 3 },
    mid: { id: 'mid', name: '标准', desc: '传统配比，咸鲜适中', pct: 6 },
    heavy: { id: 'heavy', name: '重盐', desc: '盐量充足，久存不易变质', pct: 10 }
  };

  // ========== 状态管理 ==========
  const STORE_KEY = 'shaiqiu_state_v1';
  let state = loadState();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('loadState failed', e);
    }
    return getDefaultState();
  }

  function getDefaultState() {
    const today = new Date();
    const isoDate = d => d.toISOString().slice(0, 10);
    const dMinus = n => { const d = new Date(today); d.setDate(d.getDate() - n); return isoDate(d); };

    return {
      items: [
        {
          id: uid(),
          category: 'larou',
          name: '五花腊肉',
          weight: 600,
          salt: 'mid',
          startDate: dMinus(3),
          flips: [dMinus(2), dMinus(1)],
          journal: [
            { date: dMinus(3), text: '新鲜五花肉上酱，挂于西阳台' }
          ],
          status: 'drying',
          harvested: null
        },
        {
          id: uid(),
          category: 'jiangya',
          name: '酱鸭',
          weight: 900,
          salt: 'mid',
          startDate: dMinus(5),
          flips: [dMinus(4), dMinus(3), dMinus(2), dMinus(1)],
          journal: [
            { date: dMinus(5), text: '老鸭一只，酱渍两日后上架' }
          ],
          status: 'drying',
          harvested: null
        },
        {
          id: uid(),
          category: 'luobogan',
          name: '萝卜干',
          weight: 1200,
          salt: 'light',
          startDate: dMinus(1),
          flips: [],
          journal: [
            { date: dMinus(1), text: '白萝卜切条，盐水略腌后铺开' }
          ],
          status: 'drying',
          harvested: null
        }
      ],
      weather: generateWeather(),
      createdAt: Date.now()
    };
  }

  function saveState() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('saveState failed', e);
    }
  }

  function generateWeather() {
    const today = new Date();
    const days = [];
    const conditions = [
      { name: '晴', icon: 'sun', humidity: 45, wind: '西北 3级', sun: 8.5, suit: 'good' },
      { name: '晴转多云', icon: 'partly', humidity: 58, wind: '西南 2级', sun: 6.2, suit: 'good' },
      { name: '多云', icon: 'cloud', humidity: 65, wind: '东南 3级', sun: 3.5, suit: 'mid' },
      { name: '小雨', icon: 'rain', humidity: 85, wind: '东北 4级', sun: 0.5, suit: 'bad' },
      { name: '阴', icon: 'overcast', humidity: 75, wind: '北风 2级', sun: 1.0, suit: 'mid' }
    ];
    for (let i = 0; i < 5; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const cond = conditions[(i + 1) % conditions.length];
      const high = 22 + Math.floor(Math.random() * 8);
      const low = high - 6 - Math.floor(Math.random() * 4);
      days.push({
        date: d.toISOString().slice(0, 10),
        weekday: ['周日','周一','周二','周三','周四','周五','周六'][d.getDay()],
        dayLabel: i === 0 ? '今天' : i === 1 ? '明天' : null,
        condition: cond.name,
        icon: cond.icon,
        high, low,
        humidity: cond.humidity + Math.floor(Math.random() * 10) - 5,
        wind: cond.wind,
        sunHours: cond.sun,
        suit: cond.suit
      });
    }
    return days;
  }

  // ========== 日期工具 ==========
  function daysBetween(startStr, endStr) {
    const s = new Date(startStr);
    const e = new Date(endStr);
    return Math.floor((e - s) / (1000 * 60 * 60 * 24));
  }

  function todayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  function getItemDays(item) {
    return daysBetween(item.startDate, todayStr());
  }

  function getFlipedToday(item) {
    return item.flips.includes(todayStr());
  }

  // 失水率
  function getWaterLoss(item) {
    const cat = CATEGORIES[item.category];
    const days = getItemDays(item);
    const progress = clamp(days / cat.days, 0, 1);
    // S 曲线
    const sigmoid = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    return Math.round(cat.waterLoss * sigmoid * 1000) / 10;
  }

  // 当前色泽
  function getCurrentColor(item) {
    const cat = CATEGORIES[item.category];
    const days = getItemDays(item);
    const progress = clamp(days / cat.days, 0, 1);
    const colors = cat.colors;
    const idx = progress * (colors.length - 1);
    const i = Math.floor(idx);
    const t = idx - i;
    if (i >= colors.length - 1) return colors[colors.length - 1];
    return lerpColor(colors[i], colors[i + 1], t);
  }

  // 进度百分比
  function getProgress(item) {
    const cat = CATEGORIES[item.category];
    return clamp(getItemDays(item) / cat.days * 100, 0, 100);
  }

  // ========== 风物 SVG ==========
  function getFoodSVG(category, color, size = 'normal') {
    const w = size === 'small' ? 40 : 100;
    const h = size === 'small' ? 80 : 160;
    let inner = '';
    const c = color;
    const dark = lerpColor(c, '#2D1810', 0.3);
    const light = lerpColor(c, '#FFE4C4', 0.2);

    switch (category) {
      case 'larou':
        // 腊肉：长条肉片，带肥膘纹理
        inner = `
          <rect x="30" y="5" width="40" height="${h - 10}" rx="8" fill="${c}"/>
          <rect x="34" y="8" width="6" height="${h - 16}" rx="3" fill="${light}" opacity="0.7"/>
          <rect x="50" y="12" width="5" height="${h - 24}" rx="2" fill="${light}" opacity="0.5"/>
          <rect x="60" y="6" width="4" height="${h - 12}" rx="2" fill="${light}" opacity="0.4"/>
          <rect x="38" y="${h*0.3}" width="3" height="${h*0.4}" rx="1" fill="${dark}" opacity="0.3"/>
          <ellipse cx="50" cy="${h*0.5}" rx="2" ry="4" fill="${dark}" opacity="0.4"/>
          <rect x="30" y="5" width="40" height="8" rx="4" fill="${dark}" opacity="0.3"/>
        `;
        break;
      case 'jiangya':
        // 酱鸭：整鸭形状
        inner = `
          <ellipse cx="50" cy="${h*0.5}" rx="30" ry="${h*0.42}" fill="${c}"/>
          <ellipse cx="50" cy="${h*0.35}" rx="22" ry="${h*0.18}" fill="${light}" opacity="0.3"/>
          <ellipse cx="35" cy="${h*0.45}" rx="8" ry="${h*0.25}" fill="${dark}" opacity="0.4"/>
          <ellipse cx="65" cy="${h*0.45}" rx="8" ry="${h*0.25}" fill="${dark}" opacity="0.4"/>
          <path d="M50 ${h*0.1} Q45 ${h*0.02} 50 -2 Q55 ${h*0.02} 50 ${h*0.1}" fill="${dark}" opacity="0.5"/>
          <ellipse cx="50" cy="${h*0.85}" rx="18" ry="${h*0.08}" fill="${dark}" opacity="0.3"/>
        `;
        break;
      case 'luobogan':
        // 萝卜干：多条条状
        inner = `
          <rect x="25" y="8" width="10" height="${h - 16}" rx="5" fill="${c}"/>
          <rect x="42" y="5" width="14" height="${h - 10}" rx="7" fill="${light}"/>
          <rect x="65" y="10" width="10" height="${h - 20}" rx="5" fill="${c}"/>
          <line x1="49" y1="15" x2="49" y2="${h-15}" stroke="${dark}" stroke-width="1" opacity="0.3"/>
          <line x1="30" y1="20" x2="30" y2="${h-20}" stroke="${dark}" stroke-width="0.8" opacity="0.3"/>
          <line x1="70" y1="18" x2="70" y2="${h-22}" stroke="${dark}" stroke-width="0.8" opacity="0.3"/>
        `;
        break;
      case 'manxiang':
        // 鳗鲞：扁平长鱼形
        inner = `
          <path d="M50 5 Q20 ${h*0.2} 15 ${h*0.5} Q20 ${h*0.8} 50 ${h-5} Q80 ${h*0.8} 85 ${h*0.5} Q80 ${h*0.2} 50 5Z" fill="${c}"/>
          <path d="M50 10 Q30 ${h*0.25} 25 ${h*0.5} Q30 ${h*0.75} 50 ${h-10}" stroke="${light}" stroke-width="2" fill="none" opacity="0.5"/>
          <path d="M50 10 Q70 ${h*0.25} 75 ${h*0.5} Q70 ${h*0.75} 50 ${h-10}" stroke="${dark}" stroke-width="1" fill="none" opacity="0.4"/>
          <ellipse cx="50" cy="15" rx="15" ry="4" fill="${dark}" opacity="0.4"/>
          <line x1="50" y1="8" x2="50" y2="${h-8}" stroke="${dark}" stroke-width="0.8" opacity="0.3" stroke-dasharray="3 4"/>
        `;
        break;
      case 'shibing':
        // 柿饼：扁圆带霜感
        inner = `
          <ellipse cx="50" cy="${h*0.5}" rx="32" ry="${h*0.38}" fill="${c}"/>
          <ellipse cx="50" cy="${h*0.4}" rx="24" ry="${h*0.15}" fill="${light}" opacity="0.4"/>
          <ellipse cx="50" cy="${h*0.45}" rx="8" ry="3" fill="white" opacity="0.5"/>
          <ellipse cx="38" cy="${h*0.55}" rx="4" ry="2" fill="white" opacity="0.4"/>
          <ellipse cx="62" cy="${h*0.5}" rx="5" ry="2" fill="white" opacity="0.35"/>
          <ellipse cx="45" cy="${h*0.35}" rx="3" ry="1.5" fill="white" opacity="0.45"/>
          <path d="M50 ${h*0.12} Q48 ${h*0.05} 50 0 Q52 ${h*0.05} 50 ${h*0.12}" fill="${dark}" opacity="0.5"/>
          <ellipse cx="50" cy="${h*0.75}" rx="20" ry="${h*0.08}" fill="${dark}" opacity="0.3"/>
        `;
        break;
      default:
        inner = `<rect x="20" y="5" width="60" height="${h-10}" rx="10" fill="${c}"/>`;
    }

    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  }

  // 天气图标 SVG
  function getWeatherSVG(icon) {
    const s = 32;
    let svg = '';
    switch (icon) {
      case 'sun':
        svg = `<svg viewBox="0 0 ${s} ${s}"><circle cx="16" cy="16" r="6" fill="#D96C2C"/><g stroke="#D96C2C" stroke-width="1.8" stroke-linecap="round"><line x1="16" y1="3" x2="16" y2="7"/><line x1="16" y1="25" x2="16" y2="29"/><line x1="3" y1="16" x2="7" y2="16"/><line x1="25" y1="16" x2="29" y2="16"/><line x1="6.5" y1="6.5" x2="9.5" y2="9.5"/><line x1="22.5" y1="22.5" x2="25.5" y2="25.5"/><line x1="6.5" y1="25.5" x2="9.5" y2="22.5"/><line x1="22.5" y1="9.5" x2="25.5" y2="6.5"/></g></svg>`;
        break;
      case 'partly':
        svg = `<svg viewBox="0 0 ${s} ${s}"><circle cx="11" cy="12" r="5" fill="#D96C2C"/><path d="M18 20 Q18 14 24 14 Q30 14 30 20 Z" fill="#FFF" stroke="#A5B2B5" stroke-width="1"/><path d="M14 18 Q14 13 19 13 Q24 13 24 18" fill="#FFF" stroke="#A5B2B5" stroke-width="1" opacity="0.7"/></svg>`;
        break;
      case 'cloud':
        svg = `<svg viewBox="0 0 ${s} ${s}"><path d="M8 22 Q8 15 14 15 Q16 10 22 12 Q28 12 28 19 Q28 24 22 24 L12 24 Q8 24 8 22Z" fill="#FFF" stroke="#7C8B8F" stroke-width="1.2"/></svg>`;
        break;
      case 'rain':
        svg = `<svg viewBox="0 0 ${s} ${s}"><path d="M6 18 Q6 12 12 12 Q14 7 20 9 Q26 9 26 16 Q26 21 20 21 L10 21 Q6 21 6 18Z" fill="#7C8B8F"/><g stroke="#4A7A9E" stroke-width="1.5" stroke-linecap="round"><line x1="10" y1="23" x2="9" y2="28"/><line x1="15" y1="23" x2="14" y2="29"/><line x1="20" y1="23" x2="19" y2="28"/></g></svg>`;
        break;
      case 'overcast':
        svg = `<svg viewBox="0 0 ${s} ${s}"><path d="M5 20 Q5 13 12 13 Q14 8 20 10 Q27 10 27 18 Q27 23 20 23 L9 23 Q5 23 5 20Z" fill="#A5B2B5"/><path d="M10 15 Q10 11 14 11 Q18 11 18 15" fill="#7C8B8F" opacity="0.5"/></svg>`;
        break;
      default:
        svg = `<svg viewBox="0 0 ${s} ${s}"><circle cx="16" cy="16" r="6" fill="#D96C2C"/></svg>`;
    }
    return svg;
  }

  // ========== 导航系统 ==========
  const pages = {
    home: $('#pageHome'),
    weather: $('#pageWeather'),
    journal: $('#pageJournal'),
    mine: $('#pageMine')
  };

  let currentTab = 'home';
  const modalStack = $('#modalStack');
  let modalPages = []; // 栈

  function switchTab(tab) {
    if (tab === 'add') {
      openNewDrying();
      return;
    }
    if (tab === currentTab) return;

    const oldPage = pages[currentTab];
    const newPage = pages[tab];

    if (!newPage) return;

    $$('.tab-item').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));

    const direction = ['home', 'weather', 'journal', 'mine'].indexOf(tab) > ['home', 'weather', 'journal', 'mine'].indexOf(currentTab) ? 1 : -1;

    oldPage.classList.add('leaving');
    newPage.classList.add('active');

    setTimeout(() => {
      oldPage.classList.remove('active', 'leaving');
    }, 350);

    currentTab = tab;

    // 刷新页面数据
    if (tab === 'home') renderStrings();
    if (tab === 'journal') renderJournal();
    if (tab === 'weather') renderWeather();
  }

  function pushModal(html, onReady) {
    const el = document.createElement('div');
    el.className = 'modal-page';
    el.innerHTML = html;
    modalStack.appendChild(el);

    modalPages.push(el);

    // 入场动画
    requestAnimationFrame(() => {
      el.classList.add('active');
    });

    // 绑定返回按钮
    const backBtn = el.querySelector('.back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => popModal());
    }

    if (onReady) setTimeout(() => onReady(el), 20);
    return el;
  }

  function popModal() {
    const el = modalPages.pop();
    if (!el) return;
    el.classList.remove('active');
    setTimeout(() => el.remove(), 350);
  }

  // ========== 首页：晾晒架 ==========
  function renderStrings() {
    const container = $('#strings');
    const dryingItems = state.items.filter(i => i.status === 'drying');

    if (dryingItems.length === 0) {
      container.innerHTML = `
        <div class="rack-empty">
          <div class="rack-empty-icon">
            <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </div>
          <div class="rack-empty-title">晾晒架空空如也</div>
          <div class="rack-empty-sub">第一批风物，从这里开始<br>记录阳光与时间的味道</div>
          <button class="rack-empty-btn" id="emptyAddBtn">开始晾晒</button>
        </div>
      `;
      const btn = $('#emptyAddBtn');
      if (btn) btn.addEventListener('click', openNewDrying);
      updateTipBanner();
      return;
    }

    container.innerHTML = dryingItems.map(item => {
      const cat = CATEGORIES[item.category];
      const color = getCurrentColor(item);
      const days = getItemDays(item);
      const flipped = getFlipedToday(item);
      const weightClass = item.weight > 800 ? 'heavy' : item.weight > 400 ? 'mid' : 'light';

      return `
        <div class="string-item weight-${weightClass}" data-id="${item.id}">
          <div class="string-rope"></div>
          <div class="string-clip"></div>
          <div class="string-body">
            ${getFoodSVG(item.category, color, 'normal')}
            ${!flipped ? '<div class="string-todo-dot"></div>' : ''}
          </div>
          <div class="string-label">
            ${item.name}
            <span class="day-tag">第${days + 1}天</span>
          </div>
        </div>
      `;
    }).join('');

    // 绑定点击
    $$('.string-item', container).forEach(el => {
      el.addEventListener('click', () => {
        const id = el.dataset.id;
        const item = state.items.find(i => i.id === id);
        if (item) openDetail(item.id);
      });
    });

    updateTipBanner();
  }

  function updateTipBanner() {
    const drying = state.items.filter(i => i.status === 'drying');
    const todoCount = drying.filter(i => !getFlipedToday(i)).length;
    const title = $('#tipTitle');
    const sub = $('#tipSub');
    const btn = $('#tipBtn');
    const w = state.weather[0];

    if (todoCount > 0) {
      title.textContent = `今日宜翻晒 ${todoCount} 串`;
      sub.textContent = `${w.wind} · 湿度 ${w.humidity}% · 趁好天气翻面`;
      btn.textContent = '去翻晒';
    } else if (drying.length > 0) {
      title.textContent = '今日翻晒已完成';
      sub.textContent = `${drying.length} 串风物正在风干中 · 明天见`;
      btn.textContent = '查看';
    } else {
      title.textContent = '开始你的第一批晾晒';
      sub.textContent = '点击下方按钮，选择风物品类';
      btn.textContent = '去新建';
    }
  }

  // ========== 详情页 ==========
  function openDetail(id) {
    const item = state.items.find(i => i.id === id);
    if (!item) return;
    const cat = CATEGORIES[item.category];
    const days = getItemDays(item);
    const progress = getProgress(item);
    const waterLoss = getWaterLoss(item);
    const color = getCurrentColor(item);
    const flipped = getFlipedToday(item);
    const currentWeight = Math.round(item.weight * (1 - waterLoss / 100));

    const html = `
      <div class="modal-header">
        <button class="back-btn">
          <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
        </button>
        <div class="modal-title">${item.name}</div>
        <div class="modal-header-right"></div>
      </div>

      <div class="detail-hero">
        <div class="detail-food-stage" id="detailStage">
          <div class="detail-food-svg" id="detailFood">
            ${getFoodSVG(item.category, color, 'normal')}
          </div>
        </div>
        <div class="detail-food-name">${item.name}</div>
        <div class="detail-food-meta">
          <span>第 <strong>${days + 1}</strong> / ${cat.days} 天</span>
          <span>失水 <strong>${waterLoss}%</strong></span>
          <span>现重 <strong>${currentWeight}g</strong></span>
        </div>
      </div>

      ${item.status === 'drying' ? `
      <div class="time-dial-wrap">
        <div class="time-dial-label">
          <span class="label-main">时光拨盘</span>
          <span class="label-day" id="dialDay">第 ${days + 1} 天</span>
        </div>
        <input type="range" class="time-dial-slider" id="timeDial" min="0" max="${cat.days}" value="${days}" step="0.1">
        <div class="time-dial-milestones">
          <span>挂晒</span>
          <span>转色</span>
          <span>出油</span>
          <span>收成</span>
        </div>
      </div>

      <div class="flip-action ${flipped ? 'done' : ''}" id="flipAction">
        <div class="flip-action-title">${flipped ? '今日已完成翻晒' : '今日翻晒打卡'}</div>
        <div class="flip-action-sub">${flipped ? '明天再来看看色泽变化吧' : '上滑翻面 · 让每一面都晒到阳光'}</div>
        <button class="flip-btn" id="flipBtn">
          <svg viewBox="0 0 24 24"><path d="M12 4v16M6 10l6-6 6 6M6 14l6 6 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
          <span>${flipped ? '已翻' : '翻晒'}</span>
        </button>
        <div class="grain-particles" id="grainParticles"></div>
      </div>
      ` : `
      <div class="flip-action done" style="background: linear-gradient(135deg, #E8F0E0 0%, #D4E5C8 100%);">
        <div class="flip-action-title">已收成分装</div>
        <div class="flip-action-sub">${item.harvested || ''} · ${currentWeight}g</div>
      </div>
      `}

      <div class="water-chart-section">
        <div class="water-chart-title">风干进度</div>
        <div class="water-chart-sub">失水率曲线 · 预测收成 ${Math.round(item.weight * (1 - cat.waterLoss))}g</div>
        <canvas class="water-chart-canvas" id="waterChart" width="310" height="140"></canvas>
        <div class="water-chart-legend">
          <div><strong>${waterLoss}%</strong>当前失水</div>
          <div><strong>${Math.round(progress)}%</strong>总进度</div>
          <div><strong>${cat.days - days}天</strong>预计剩余</div>
        </div>
      </div>

      <div class="detail-actions">
        ${item.status === 'drying' ? `
        <button class="btn-primary" id="harvestBtn">收成入库</button>
        <button class="btn-secondary btn-danger" id="removeBtn">放弃晾晒</button>
        ` : `
        <button class="btn-secondary" id="closeDetail">关闭</button>
        `}
      </div>
      <div style="height: 30px;"></div>
    `;

    pushModal(html, (el) => {
      initDetailInteractions(el, item);
    });
  }

  function initDetailInteractions(el, item) {
    const cat = CATEGORIES[item.category];
    const totalDays = cat.days;
    const startDays = getItemDays(item);

    const foodEl = $('#detailFood', el);
    const dial = $('#timeDial', el);
    const dialDay = $('#dialDay', el);

    // 时光拨盘
    if (dial) {
      dial.style.setProperty('--progress', (startDays / totalDays * 100) + '%');
      dial.addEventListener('input', () => {
        const d = parseFloat(dial.value);
        dialDay.textContent = `第 ${Math.floor(d) + 1} 天`;
        dial.style.setProperty('--progress', (d / totalDays * 100) + '%');

        // 计算对应颜色
        const progress = clamp(d / totalDays, 0, 1);
        const colors = cat.colors;
        const idx = progress * (colors.length - 1);
        const i = Math.floor(idx);
        const t = idx - i;
        let col;
        if (i >= colors.length - 1) col = colors[colors.length - 1];
        else col = lerpColor(colors[i], colors[i + 1], t);

        // 更新风物颜色
        const svg = foodEl.querySelector('svg');
        if (svg) {
          const fills = svg.querySelectorAll('[fill]');
          fills.forEach(el => {
            const fill = el.getAttribute('fill');
            if (fill && fill.startsWith('#') && fill.length === 7 && el.tagName.toLowerCase() !== 'svg') {
              // 判断是否是主色
              // 简化：找到 rect/path/ellipse 主色元素
            }
          });
        }

        // 更简单的方法：重绘 SVG
        foodEl.innerHTML = getFoodSVG(item.category, col, 'normal');

        // 盐霜效果（后半段）
        if (progress > 0.6) {
          const frostAmt = (progress - 0.6) / 0.4;
          addSaltFrost(foodEl, frostAmt);
        }
      });
    }

    // 翻晒手势
    const flipBtn = $('#flipBtn', el);
    const flipAction = $('#flipAction', el);
    if (flipBtn && item.status === 'drying') {
      let startY = 0;
      let currentY = 0;
      let isDragging = false;

      const onStart = (e) => {
        if (getFlipedToday(item)) return;
        isDragging = true;
        startY = e.touches ? e.touches[0].clientY : e.clientY;
        currentY = startY;
        flipBtn.style.transition = 'none';
      };

      const onMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        currentY = e.touches ? e.touches[0].clientY : e.clientY;
        const delta = startY - currentY;
        if (delta > 0) {
          const scale = 1 + Math.min(delta / 200, 0.2);
          const translateY = -Math.min(delta * 0.5, 40);
          flipBtn.style.transform = `translateY(${translateY}px) scale(${scale})`;
        }
      };

      const onEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        const delta = startY - currentY;
        flipBtn.style.transition = 'transform 0.4s var(--ease-bounce)';

        if (delta > 60) {
          // 翻晒成功
          doFlip(item, flipAction, flipBtn, foodEl);
        } else {
          flipBtn.style.transform = '';
        }
      };

      flipBtn.addEventListener('mousedown', onStart);
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onEnd);
      flipBtn.addEventListener('touchstart', onStart, { passive: true });
      flipBtn.addEventListener('touchmove', onMove, { passive: false });
      flipBtn.addEventListener('touchend', onEnd);
    }

    // 失水曲线图
    drawWaterChart($('#waterChart', el), item);

    // 收成按钮
    const harvestBtn = $('#harvestBtn', el);
    if (harvestBtn) {
      harvestBtn.addEventListener('click', () => {
        if (confirmHarvest(item)) {
          popModal();
          renderStrings();
        }
      });
    }

    // 放弃按钮
    const removeBtn = $('#removeBtn', el);
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        if (confirm('确定放弃这串晾晒吗？')) {
          state.items = state.items.filter(i => i.id !== item.id);
          saveState();
          popModal();
          renderStrings();
          showToast('已移除');
        }
      });
    }

    const closeBtn = $('#closeDetail', el);
    if (closeBtn) closeBtn.addEventListener('click', popModal);
  }

  function addSaltFrost(container, amount) {
    // 在食物表面叠加盐霜效果
    let frost = container.querySelector('.salt-frost');
    if (!frost) {
      frost = document.createElement('div');
      frost.className = 'salt-frost';
      frost.style.cssText = `
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse at center, rgba(255,255,255,${amount * 0.5}) 0%, transparent 70%);
        pointer-events: none;
        mix-blend-mode: screen;
        transition: opacity 0.3s;
      `;
      container.style.position = 'relative';
      container.appendChild(frost);
    } else {
      frost.style.background = `radial-gradient(ellipse at center, rgba(255,255,255,${amount * 0.5}) 0%, transparent 70%)`;
    }
  }

  function doFlip(item, flipAction, flipBtn, foodEl) {
    const today = todayStr();
    if (item.flips.includes(today)) return;

    item.flips.push(today);
    saveState();

    // 翻转动画
    foodEl.classList.add('flipping');

    setTimeout(() => {
      // 推进一天色泽
      const cat = CATEGORIES[item.category];
      const newDays = Math.min(getItemDays(item) + 0.5, cat.days);
      const progress = clamp(newDays / cat.days, 0, 1);
      const colors = cat.colors;
      const idx = progress * (colors.length - 1);
      const i = Math.floor(idx);
      const t = idx - i;
      const col = i >= colors.length - 1 ? colors[colors.length - 1] : lerpColor(colors[i], colors[i + 1], t);
      foodEl.innerHTML = getFoodSVG(item.category, col, 'normal');
    }, 250);

    setTimeout(() => {
      foodEl.classList.remove('flipping');
    }, 500);

    // 谷粒飘落
    spawnGrains($('#grainParticles', flipAction));

    // 状态切换
    setTimeout(() => {
      flipAction.classList.add('done');
      flipBtn.querySelector('span').textContent = '已翻';
      flipBtn.style.transform = '';
      showToast('翻晒完成 · +1 天');
    }, 300);

    // 刷新首页
    setTimeout(() => {
      renderStrings();
    }, 400);
  }

  function spawnGrains(container) {
    if (!container || reducedMotion) return;
    const count = 15;
    for (let i = 0; i < count; i++) {
      const g = document.createElement('div');
      g.className = 'grain';
      const size = 3 + Math.random() * 5;
      g.style.width = size + 'px';
      g.style.height = size * 1.3 + 'px';
      g.style.left = 20 + Math.random() * 60 + '%';
      g.style.top = -10 + 'px';
      g.style.background = Math.random() > 0.5 ? '#D96C2C' : '#E8A85A';
      g.style.animationDelay = Math.random() * 0.3 + 's';
      g.style.animationDuration = 1 + Math.random() * 0.8 + 's';
      g.style.borderRadius = '40%';
      container.appendChild(g);
      setTimeout(() => g.remove(), 2000);
    }
  }

  // ========== 失水曲线 Canvas ==========
  function drawWaterChart(canvas, item) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cat = CATEGORIES[item.category];
    const totalDays = cat.days;
    const totalLoss = cat.waterLoss * 100;
    const currentDay = getItemDays(item);

    const W = canvas.width;
    const H = canvas.height;
    const padL = 30, padR = 10, padT = 15, padB = 25;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;

    ctx.clearRect(0, 0, W, H);

    // 网格线
    ctx.strokeStyle = 'rgba(90, 58, 40, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padT + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(W - padR, y);
      ctx.stroke();
    }

    // Y 轴标签
    ctx.fillStyle = '#8B6B4A';
    ctx.font = '10px "Noto Sans SC"';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const val = Math.round(totalLoss - (totalLoss / 4) * i);
      const y = padT + (chartH / 4) * i + 3;
      ctx.fillText(val + '%', padL - 6, y);
    }

    // X 轴标签
    ctx.fillStyle = '#8B6B4A';
    ctx.textAlign = 'center';
    for (let i = 0; i <= 4; i++) {
      const day = Math.round((totalDays / 4) * i);
      const x = padL + (chartW / 4) * i;
      ctx.fillText(day + 'd', x, H - padB + 14);
    }

    // 计算 S 曲线点
    function sigmoidProgress(d) {
      const p = clamp(d / totalDays, 0, 1);
      return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    }

    const points = [];
    for (let d = 0; d <= totalDays; d += 0.5) {
      const loss = totalLoss * sigmoidProgress(d);
      const x = padL + (d / totalDays) * chartW;
      const y = padT + chartH - (loss / totalLoss) * chartH;
      points.push([x, y]);
    }

    // 渐变填充
    const gradient = ctx.createLinearGradient(0, padT, 0, H - padB);
    gradient.addColorStop(0, 'rgba(217, 108, 44, 0.3)');
    gradient.addColorStop(1, 'rgba(217, 108, 44, 0.02)');

    ctx.beginPath();
    ctx.moveTo(points[0][0], padT + chartH);
    points.forEach(p => ctx.lineTo(p[0], p[1]));
    ctx.lineTo(points[points.length - 1][0], padT + chartH);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // 描边动画
    const currentX = padL + (currentDay / totalDays) * chartW;
    const currentLoss = totalLoss * sigmoidProgress(currentDay);
    const currentY = padT + chartH - (currentLoss / totalLoss) * chartH;

    // 已完成段
    ctx.beginPath();
    ctx.strokeStyle = '#D96C2C';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    for (let i = 0; i < points.length; i++) {
      const [x, y] = points[i];
      if (x > currentX) break;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 未完成段（虚线）
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(139, 107, 74, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    let started = false;
    for (let i = 0; i < points.length; i++) {
      const [x, y] = points[i];
      if (x >= currentX) {
        if (!started) { ctx.moveTo(x, y); started = true; }
        else ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // 当前点
    ctx.beginPath();
    ctx.arc(currentX, currentY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#FFF';
    ctx.fill();
    ctx.strokeStyle = '#D96C2C';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // 今天标签
    ctx.fillStyle = '#D96C2C';
    ctx.font = 'bold 10px "Noto Sans SC"';
    ctx.textAlign = 'center';
    ctx.fillText('今天', currentX, currentY - 10);
  }

  function confirmHarvest(item) {
    const waterLoss = getWaterLoss(item);
    const finalWeight = Math.round(item.weight * (1 - waterLoss / 100));
    const result = confirm(`确认收成？\n\n最终重量约 ${finalWeight}g\n失水率 ${waterLoss}%\n\n收成后将入库存档`);
    if (result) {
      item.status = 'harvested';
      item.harvested = todayStr();
      item.finalWeight = finalWeight;
      item.journal.push({
        date: todayStr(),
        text: `收成入库 · ${finalWeight}g · 失水 ${waterLoss}%`
      });
      saveState();
      showToast('收成成功！已入库存档');
      return true;
    }
    return false;
  }

  // ========== 新建晾晒 ==========
  let newDraft = null;

  function openNewDrying() {
    newDraft = {
      step: 0, // 0:品类 1:重量 2:盐度 3:日期
      category: null,
      weight: 500,
      salt: 'mid',
      startDate: todayStr()
    };
    renderNewStep();
  }

  function renderNewStep() {
    const steps = [
      { title: '选一种风物', sub: '你今天要晒什么？' },
      { title: '有多重？', sub: '估个大概就行' },
      { title: '咸淡口味', sub: '选择你偏好的盐度' },
      { title: '哪天开始晒？', sub: '通常腌制后第一天挂晒' }
    ];
    const step = newDraft.step;
    const s = steps[step];

    let body = '';

    if (step === 0) {
      body = `
        <div class="new-category-grid">
          ${Object.values(CATEGORIES).map(cat => `
            <div class="new-category-card ${newDraft.category === cat.id ? 'selected' : ''}" data-cat="${cat.id}">
              ${getFoodSVG(cat.id, cat.colors[Math.floor(cat.colors.length / 2)], 'small')}
              <span>${cat.name}</span>
            </div>
          `).join('')}
        </div>
      `;
    } else if (step === 1) {
      const cat = CATEGORIES[newDraft.category];
      body = `
        <div class="new-stepper">
          <div class="stepper-display">
            <span class="stepper-value" id="weightVal">${newDraft.weight}</span>
            <span class="stepper-unit">克</span>
          </div>
          <div class="stepper-controls">
            <button class="stepper-btn" id="weightMinus">−</button>
            <button class="stepper-btn" id="weightPlus">+</button>
          </div>
          <div class="stepper-slider">
            <input type="range" class="stepper-range" id="weightRange"
              min="100" max="2000" step="50" value="${newDraft.weight}">
          </div>
          <div style="font-size: 12px; color: var(--cypress);">
            ${cat.name}参考重量：${cat.baseWeight}g / 串
          </div>
        </div>
      `;
    } else if (step === 2) {
      const cat = CATEGORIES[newDraft.category];
      const availableSalts = cat.saltOpts.map(id => SALT_LEVELS[id]);
      body = `
        <div class="salt-grid">
          ${availableSalts.map(s => `
            <div class="salt-card ${newDraft.salt === s.id ? 'selected' : ''}" data-salt="${s.id}">
              <div class="salt-icon">
                <svg viewBox="0 0 24 24"><path d="M12 2L4 12v8h16v-8z" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linejoin="round"/><path d="M8 14h8M8 18h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              </div>
              <div class="salt-info">
                <div class="salt-name">${s.name}</div>
                <div class="salt-desc">${s.desc} · 盐量 ${s.pct}%</div>
              </div>
              <div class="salt-check"></div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (step === 3) {
      body = `
        <div class="date-picker-wrap">
          <div class="date-calendar" id="calendar">
            <!-- JS 渲染 -->
          </div>
        </div>
      `;
    }

    const isFirst = step === 0;
    const isLast = step === 3;

    const html = `
      <div class="modal-header">
        <button class="back-btn">
          <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
        </button>
        <div class="modal-title">新建晾晒</div>
        <div class="modal-header-right"></div>
      </div>

      <div class="new-step-indicator">
        ${[0,1,2,3].map(i => `
          <div class="new-step-dot ${i === step ? 'active' : i < step ? 'done' : ''}"></div>
        `).join('')}
      </div>

      <div class="new-step-title">
        <h2>${s.title}</h2>
        <p>${s.sub}</p>
      </div>

      ${body}

      <div class="new-footer">
        <button class="btn-secondary" id="newPrev" ${isFirst ? 'style="visibility:hidden"' : ''}>上一步</button>
        <button class="btn-primary" id="newNext" ${!canProceed() ? 'style="opacity:0.5;pointer-events:none"' : ''}>
          ${isLast ? '开始晾晒' : '下一步'}
        </button>
      </div>
    `;

    // 清除旧的新建页（只保留一个）
    while (modalPages.length > 0) {
      const el = modalPages.pop();
      el.remove();
    }

    pushModal(html, (el) => {
      bindNewStepEvents(el);
    });
  }

  function canProceed() {
    const step = newDraft.step;
    if (step === 0) return !!newDraft.category;
    if (step === 1) return newDraft.weight > 0;
    if (step === 2) return !!newDraft.salt;
    if (step === 3) return !!newDraft.startDate;
    return false;
  }

  function bindNewStepEvents(el) {
    const step = newDraft.step;

    // 上一步
    const prev = $('#newPrev', el);
    if (prev) {
      prev.addEventListener('click', () => {
        if (newDraft.step > 0) {
          newDraft.step--;
          renderNewStep();
        }
      });
    }

    // 下一步
    const next = $('#newNext', el);
    if (next) {
      next.addEventListener('click', () => {
        if (!canProceed()) return;
        if (newDraft.step < 3) {
          newDraft.step++;
          renderNewStep();
        } else {
          submitNewDrying();
        }
      });
    }

    if (step === 0) {
      $$('.new-category-card', el).forEach(card => {
        card.addEventListener('click', () => {
          newDraft.category = card.dataset.cat;
          $$('.new-category-card', el).forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          // 更新下一步按钮状态
          const nextBtn = $('#newNext', el);
          nextBtn.style.opacity = '1';
          nextBtn.style.pointerEvents = 'auto';

          // 自动推进
          setTimeout(() => {
            newDraft.step++;
            // 设置默认重量
            const cat = CATEGORIES[newDraft.category];
            newDraft.weight = cat.baseWeight;
            renderNewStep();
          }, 250);
        });
      });
    } else if (step === 1) {
      const valEl = $('#weightVal', el);
      const range = $('#weightRange', el);
      const minus = $('#weightMinus', el);
      const plus = $('#weightPlus', el);

      const update = (v) => {
        v = clamp(Math.round(v / 50) * 50, 100, 2000);
        newDraft.weight = v;
        valEl.textContent = v;
        range.value = v;
      };

      range.addEventListener('input', e => update(parseInt(e.target.value)));
      minus.addEventListener('click', () => update(newDraft.weight - 50));
      plus.addEventListener('click', () => update(newDraft.weight + 50));

    } else if (step === 2) {
      $$('.salt-card', el).forEach(card => {
        card.addEventListener('click', () => {
          newDraft.salt = card.dataset.salt;
          $$('.salt-card', el).forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          // 自动推进
          setTimeout(() => {
            newDraft.step++;
            renderNewStep();
          }, 200);
        });
      });
    } else if (step === 3) {
      renderCalendar($('#calendar', el));
    }
  }

  function renderCalendar(container) {
    const today = new Date();
    let viewMonth = today.getMonth();
    let viewYear = today.getFullYear();

    function draw() {
      const firstDay = new Date(viewYear, viewMonth, 1);
      const lastDay = new Date(viewYear, viewMonth + 1, 0);
      const firstWeekday = firstDay.getDay();
      const daysInMonth = lastDay.getDate();
      const todayStrVal = todayStr();

      let daysHtml = '';
      // 前置空格
      for (let i = 0; i < firstWeekday; i++) {
        daysHtml += '<div class="cal-day other-month"></div>';
      }
      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const isToday = dateStr === todayStrVal;
        const isSelected = dateStr === newDraft.startDate;
        const isPast = dateStr < todayStrVal;
        daysHtml += `<div class="cal-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${isPast ? 'other-month' : ''}" data-date="${dateStr}">${d}</div>`;
      }

      const monthNames = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
      container.innerHTML = `
        <div class="cal-header">
          <div class="cal-title">${viewYear}年 ${monthNames[viewMonth]}</div>
          <div class="cal-nav">
            <button id="calPrev">‹</button>
            <button id="calNext">›</button>
          </div>
        </div>
        <div class="cal-weekdays">
          <div>日</div><div>一</div><div>二</div><div>三</div><div>四</div><div>五</div><div>六</div>
        </div>
        <div class="cal-days">${daysHtml}</div>
      `;

      $('#calPrev', container).addEventListener('click', () => {
        viewMonth--;
        if (viewMonth < 0) { viewMonth = 11; viewYear--; }
        draw();
      });
      $('#calNext', container).addEventListener('click', () => {
        viewMonth++;
        if (viewMonth > 11) { viewMonth = 0; viewYear++; }
        draw();
      });

      $$('.cal-day', container).forEach(d => {
        if (d.classList.contains('other-month') || !d.dataset.date) return;
        d.addEventListener('click', () => {
          newDraft.startDate = d.dataset.date;
          $$('.cal-day', container).forEach(x => x.classList.remove('selected'));
          d.classList.add('selected');
          // 启用下一步
          const nextBtn = document.querySelector('#newNext');
          if (nextBtn) {
            nextBtn.style.opacity = '1';
            nextBtn.style.pointerEvents = 'auto';
          }
        });
      });
    }

    draw();
  }

  function submitNewDrying() {
    const cat = CATEGORIES[newDraft.category];
    const item = {
      id: uid(),
      category: newDraft.category,
      name: cat.name,
      weight: newDraft.weight,
      salt: newDraft.salt,
      startDate: newDraft.startDate,
      flips: [],
      journal: [
        { date: newDraft.startDate, text: `挂晒开始 · ${newDraft.weight}g · ${SALT_LEVELS[newDraft.salt].name}口味` }
      ],
      status: 'drying',
      harvested: null
    };

    state.items.unshift(item);
    saveState();
    popModal();
    renderStrings();
    showToast(`${cat.name}已上架`);
  }

  // ========== 天时页 ==========
  function renderWeather() {
    const today = state.weather[0];
    $('#weatherTemp').textContent = today.high + '°';
    $('.temp-unit', $('#pageWeather')).textContent = '/ ' + today.low + '°';
    $('#weatherDesc').textContent = today.condition;
    $('#weatherLocation').textContent = '杭州 · 阳台朝向南';
    $('#suitValue').textContent =
      today.suit === 'good' ? '优 · 强烈推荐' :
      today.suit === 'mid' ? '良 · 可以晾晒' :
      '差 · 建议收回';
    $('#suitValue').className = 'suit-value suit-' + today.suit;
    $('#paramHumid').textContent = today.humidity + '%';
    $('#paramWind').textContent = today.wind;
    $('#paramSun').textContent = today.sunHours + 'h';

    const list = $('#forecastList');
    list.innerHTML = state.weather.map((d, i) => {
      const suitText = d.suit === 'good' ? '适宜' : d.suit === 'mid' ? '一般' : '不宜';
      return `
        <div class="forecast-item">
          <div class="forecast-day">
            ${d.dayLabel || d.date.slice(5)}
            <small>${d.weekday}</small>
          </div>
          <div class="forecast-icon">${getWeatherSVG(d.icon)}</div>
          <div class="forecast-temp">
            ${d.high}°
            <span class="low">${d.low}°</span>
          </div>
          <div class="forecast-suit ${d.suit}">${suitText}</div>
        </div>
      `;
    }).join('');
  }

  // ========== 手账页 ==========
  function renderJournal() {
    const drying = state.items.filter(i => i.status === 'drying');
    const done = state.items.filter(i => i.status === 'harvested');
    const totalDays = state.items.reduce((sum, i) => sum + getItemDays(i), 0);

    $('#statHanging').textContent = drying.length;
    $('#statDone').textContent = done.length;
    $('#statDays').textContent = totalDays;

    // 汇总所有手账条目
    const entries = [];
    state.items.forEach(item => {
      (item.journal || []).forEach(j => {
        entries.push({
          date: j.date,
          title: item.name,
          text: j.text,
          type: item.status === 'harvested' ? 'done' : 'normal',
          itemId: item.id
        });
      });
      // flips
      item.flips.forEach(f => {
        entries.push({
          date: f,
          title: item.name,
          text: '每日翻晒 · 翻面均匀风干',
          type: 'flip',
          itemId: item.id
        });
      });
    });

    entries.sort((a, b) => b.date.localeCompare(a.date));

    const list = $('#journalList');
    if (entries.length === 0) {
      list.innerHTML = `<div style="text-align:center; padding:40px 20px; color: var(--cypress); font-size: 13px;">
        还没有记录 · 去新建第一串晾晒吧
      </div>`;
      return;
    }

    list.innerHTML = entries.slice(0, 30).map((e, idx) => {
      const icon = e.type === 'done'
        ? '<svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>'
        : e.type === 'flip'
        ? '<svg viewBox="0 0 24 24"><path d="M4 12h16M12 4v16M7 7l10 10M17 7L7 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>'
        : '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      return `
        <div class="journal-entry" style="animation-delay: ${idx * 0.05}s">
          <div class="journal-dot ${e.type === 'done' ? 'done' : ''}">${icon}</div>
          <div class="journal-content">
            <div class="journal-date">${e.date}</div>
            <div class="journal-title">${e.title}</div>
            <div class="journal-desc">${e.text}</div>
          </div>
        </div>
      `;
    }).join('');

    // 点击跳转详情
    $$('.journal-entry', list).forEach((el, idx) => {
      el.addEventListener('click', () => {
        const e = entries[idx];
        if (e && e.itemId) openDetail(e.itemId);
      });
    });
  }

  // ========== 设计规范页 ==========
  function openSpecPage() {
    const html = `
      <div class="modal-header">
        <button class="back-btn">
          <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
        </button>
        <div class="modal-title">设计规范</div>
        <div class="modal-header-right"></div>
      </div>

      <div class="spec-page">
        <div class="spec-section">
          <h3>色彩系统</h3>
          <div class="color-grid">
            <div class="color-swatch light" style="background:#F6EFE3;"><div class="name">谷壳米白</div><div class="hex">#F6EFE3</div></div>
            <div class="color-swatch" style="background:#D96C2C;"><div class="name">柿橙</div><div class="hex">#D96C2C</div></div>
            <div class="color-swatch" style="background:#5A3A28;"><div class="name">酱色深棕</div><div class="hex">#5A3A28</div></div>
            <div class="color-swatch" style="background:#8B6B4A;"><div class="name">柏木</div><div class="hex">#8B6B4A</div></div>
            <div class="color-swatch" style="background:#B03A2E;"><div class="name">晒场红</div><div class="hex">#B03A2E</div></div>
            <div class="color-swatch" style="background:#7C8B8F;"><div class="name">天青灰</div><div class="hex">#7C8B8F</div></div>
          </div>
        </div>

        <div class="spec-section">
          <h3>字体排印</h3>
          <div class="spec-type-sample">
            <div class="type-sample-serif">晒秋 · 万物收藏</div>
            <div class="type-sample-sans">Noto Serif SC 用于标题与强调，承接秋日的厚重感；Noto Sans SC 用于正文与界面，保持清晰可读。字号层级分明，行距 1.6。</div>
            <div class="type-sample-caption">Display: Noto Serif SC / Body: Noto Sans SC</div>
          </div>
        </div>

        <div class="spec-section">
          <h3>按钮组件</h3>
          <div class="spec-component-grid">
            <div class="spec-component-card">
              <div class="label">主按钮</div>
              <div class="spec-btn-demo primary">主要操作</div>
            </div>
            <div class="spec-component-card">
              <div class="label">次按钮</div>
              <div class="spec-btn-demo secondary">次要操作</div>
            </div>
          </div>
        </div>

        <div class="spec-section">
          <h3>动效语言</h3>
          <div class="spec-type-sample" style="font-size: 13px; line-height: 1.8; color: var(--sauce-light);">
            <p><strong>轻摆：</strong>风物随「风」轻摆，不同重量摆幅不同——轻的快、重的慢。</p>
            <p><strong>翻转：</strong>翻晒时 3D 翻转 + 弹性落位，色泽即时推进一天变化。</p>
            <p><strong>飘落：</strong>打卡成功谷粒/桂花瓣飘落，秋日仪式感。</p>
            <p><strong>描边：</strong>失水曲线沿进度描边动画，S 型曲线模拟真实失水过程。</p>
            <p><strong>页面：</strong>页面 push/pop 滑入滑出，连续流畅。</p>
          </div>
        </div>

        <div class="spec-section">
          <h3>材质隐喻</h3>
          <div class="spec-type-sample" style="font-size: 13px; line-height: 1.8; color: var(--sauce-light);">
            <p>界面中的一切都来自「秋日晒场」的真实世界：</p>
            <p>木杆、竹夹、麻绳、谷粒、酱色——这些材质构成了独特的视觉语言，让 App 不像一个数字产品，而像一只真实的晒场。</p>
          </div>
        </div>
      </div>
    `;
    pushModal(html);
  }

  // ========== 接口文档页 ==========
  function openApiPage() {
    const endpoints = [
      {
        method: 'GET', path: '/api/v1/items',
        desc: '获取当前用户的所有晾晒项目列表，可按状态过滤。',
        params: 'status?: "drying" | "harvested"',
        response: `{
  "code": 0,
  "data": [
    {
      "id": "itm_abc123",
      "category": "larou",
      "name": "五花腊肉",
      "weight": 600,
      "salt_level": "mid",
      "start_date": "2026-08-16",
      "status": "drying",
      "current_water_loss": 12.5,
      "flipped_today": false,
      "progress_pct": 21.4
    }
  ]
}`
      },
      {
        method: 'POST', path: '/api/v1/items',
        desc: '新建一个晾晒项目，指定品类、重量、盐度和开始日期。',
        params: 'category, weight, salt_level, start_date, name?',
        response: `{
  "code": 0,
  "data": {
    "id": "itm_xyz789",
    "category": "jiangya",
    "name": "酱鸭",
    "weight": 800,
    "salt_level": "mid",
    "start_date": "2026-08-19",
    "status": "drying",
    "created_at": 1755849600
  }
}`
      },
      {
        method: 'GET', path: '/api/v1/items/:id',
        desc: '获取单个晾晒项目的详细信息，含每日翻晒记录与失水率曲线数据。',
        params: 'id (path)',
        response: `{
  "code": 0,
  "data": {
    "id": "itm_abc123",
    "category": "larou",
    "name": "五花腊肉",
    "weight": 600,
    "salt_level": "mid",
    "start_date": "2026-08-16",
    "status": "drying",
    "flips": ["2026-08-17", "2026-08-18"],
    "journal": [
      { "date": "2026-08-16", "text": "挂晒开始" }
    ],
    "water_curve": [0, 2.1, 5.8, 12.5],
    "predicted_final_weight": 390
  }
}`
      },
      {
        method: 'POST', path: '/api/v1/items/:id/flip',
        desc: '完成今日翻晒打卡。同一天重复调用返回成功但不重复记录。',
        params: 'id (path)',
        response: `{
  "code": 0,
  "data": {
    "flipped": true,
    "today_date": "2026-08-19",
    "water_loss_increment": 1.2,
    "new_progress_pct": 28.6
  }
}`
      },
      {
        method: 'POST', path: '/api/v1/items/:id/harvest',
        desc: '收成分装，项目状态转为 harvested，生成最终重量。',
        params: 'id (path), final_weight? (可选，手动称重)',
        response: `{
  "code": 0,
  "data": {
    "id": "itm_abc123",
    "status": "harvested",
    "harvest_date": "2026-08-30",
    "final_weight": 390,
    "total_water_loss": 35.0,
    "total_days": 14
  }
}`
      },
      {
        method: 'GET', path: '/api/v1/weather',
        desc: '获取未来 5 天天气及晾晒适宜度，用于天时页。',
        params: 'location?: string',
        response: `{
  "code": 0,
  "data": {
    "location": "杭州",
    "today": {
      "high": 26, "low": 18,
      "condition": "晴转多云",
      "humidity": 58,
      "wind": "西南 3 级",
      "sun_hours": 6.2,
      "suitability": "good"
    },
    "forecast": [ ... ]
  }
}`
      },
      {
        method: 'DELETE', path: '/api/v1/items/:id',
        desc: '删除（放弃）一个晾晒项目，不可恢复。',
        params: 'id (path)',
        response: `{
  "code": 0,
  "data": { "deleted_id": "itm_abc123" }
}`
      }
    ];

    const html = `
      <div class="modal-header">
        <button class="back-btn">
          <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
        </button>
        <div class="modal-title">接口文档</div>
        <div class="modal-header-right"></div>
      </div>

      <div class="api-page">
        <div class="api-intro">
          <strong>晒秋 REST API v1</strong><br>
          所有接口以 <code>/api/v1</code> 为前缀，返回 JSON 格式。
          认证使用 Bearer Token，放在请求头 <code>Authorization</code> 中。
        </div>

        ${endpoints.map(ep => `
          <div class="api-endpoint">
            <div class="api-endpoint-header">
              <span class="api-method ${ep.method.toLowerCase()}">${ep.method}</span>
              <span class="api-path">${ep.path}</span>
              <span class="api-arrow"></span>
            </div>
            <div class="api-endpoint-body">
              <div class="api-desc">${ep.desc}</div>
              <div class="api-desc"><strong>参数：</strong>${ep.params}</div>
              <div class="api-desc"><strong>响应示例：</strong></div>
              <pre class="api-code">${syntaxHighlight(ep.response)}</pre>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    pushModal(html, (el) => {
      $$('.api-endpoint-header', el).forEach(h => {
        h.addEventListener('click', () => {
          h.parentElement.classList.toggle('open');
        });
      });
      // 默认展开第一个
      const first = $('.api-endpoint', el);
      if (first) first.classList.add('open');
    });
  }

  function syntaxHighlight(json) {
    return json
      .replace(/"(\w+)":/g, '<span class="key">"$1"</span>:')
      .replace(/: "([^"]+)"/g, ': <span class="str">"$1"</span>')
      .replace(/: (\d+\.?\d*)/g, ': <span class="num">$1</span>')
      .replace(/: (true|false|null)/g, ': <span class="num">$1</span>');
  }

  // ========== 收成分装页 ==========
  function openStoragePage() {
    const harvested = state.items.filter(i => i.status === 'harvested');

    const html = `
      <div class="modal-header">
        <button class="back-btn">
          <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
        </button>
        <div class="modal-title">收成分装</div>
        <div class="modal-header-right"></div>
      </div>

      <div style="padding: 0 20px 40px;">
        ${harvested.length === 0 ? `
          <div style="text-align:center; padding: 60px 20px; color: var(--cypress);">
            <div style="font-size: 48px; margin-bottom: 16px;">🏺</div>
            <div style="font-family: var(--font-serif); font-size: 17px; color: var(--sauce); margin-bottom: 8px;">还没有收成</div>
            <div style="font-size: 13px; line-height: 1.6;">耐心等待阳光与时间<br>风物终会酿成美味</div>
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${harvested.map(item => {
              const cat = CATEGORIES[item.category];
              return `
                <div style="background: rgba(255,255,255,0.7); border-radius: 14px; padding: 14px; display: flex; gap: 12px; backdrop-filter: blur(10px);">
                  <div style="width: 56px; height: 56px; flex-shrink: 0;">
                    ${getFoodSVG(item.category, cat.colors[cat.colors.length - 1], 'small')}
                  </div>
                  <div style="flex: 1;">
                    <div style="font-weight: 600; color: var(--sauce); font-size: 15px;">${item.name}</div>
                    <div style="font-size: 12px; color: var(--cypress); margin-top: 4px;">收成：${item.harvested} · ${item.finalWeight || '?'}g</div>
                    <div style="font-size: 12px; color: var(--cypress); margin-top: 2px;">${getItemDays(item)}天 · 失水 ${getWaterLoss(item)}%</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;

    pushModal(html);
  }

  // ========== Toast ==========
  let toastTimer = null;
  function showToast(msg, icon = '') {
    const toast = $('#toast');
    toast.innerHTML = icon + msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2000);
  }

  // ========== 自定义光标 ==========
  function initCursor() {
    if (isTouch) return;
    const cursor = $('#customCursor');
    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    let tx = cx, ty = cy;
    let rafId = null;
    let visible = false;

    function animate() {
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      cursor.style.left = cx + 'px';
      cursor.style.top = cy + 'px';
      rafId = requestAnimationFrame(animate);
    }

    function onMove(e) {
      tx = e.clientX;
      ty = e.clientY;
      if (!visible) {
        visible = true;
        cursor.classList.add('visible');
      }
    }

    function onDown() {
      cursor.classList.add('clicking');
    }
    function onUp() {
      cursor.classList.remove('clicking');
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);

    // 可见性暂停
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        animate();
      }
    });

    animate();
  }

  // ========== 状态栏时间 ==========
  function updateStatusTime() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes().toString().padStart(2, '0');
    $('#statusTime').textContent = `${h}:${m}`;
  }

  // ========== 事件绑定 ==========
  function bindEvents() {
    // TabBar
    $$('.tab-item').forEach(tab => {
      tab.addEventListener('click', () => {
        switchTab(tab.dataset.tab);
      });
    });

    // 首页添加按钮
    $('#btnAddHome').addEventListener('click', openNewDrying);

    // 翻晒提示按钮
    $('#tipBtn').addEventListener('click', () => {
      const drying = state.items.filter(i => i.status === 'drying' && !getFlipedToday(i));
      if (drying.length > 0) {
        openDetail(drying[0].id);
      } else if (state.items.length > 0) {
        // 滚动查看
      } else {
        openNewDrying();
      }
    });

    // 手账页添加
    $('#btnJournalAdd').addEventListener('click', () => {
      showToast('功能开发中…');
    });

    // 我的页菜单
    $('#menuStorage').addEventListener('click', openStoragePage);
    $('#menuSpec').addEventListener('click', openSpecPage);
    $('#menuApi').addEventListener('click', openApiPage);

    // 键盘 ESC 返回
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (modalPages.length > 0) {
          popModal();
        }
      }
    });

    // 页面可见性
    document.addEventListener('visibilitychange', () => {
      // 刷新首页（可能日期变了）
      if (!document.hidden) {
        updateStatusTime();
        renderStrings();
      }
    });
  }

  // ========== 首页日期 ==========
  function updateHomeDate() {
    const now = new Date();
    const months = ['一','二','三','四','五','六','七','八','九','十','十一','十二'];
    const w = state.weather[0];
    $('#homeDate').textContent = `${months[now.getMonth()]}月${now.getDate()}日 · ${w.condition}`;
  }

  // ========== 升级宣告 ==========
  function announceUpgrade() {
    window.parent && window.parent.postMessage({ type: 'miaoda:upgrade:available', kind: 'interactive-prototype' }, '*');
  }
  if (document.readyState !== 'complete') {
    window.addEventListener('load', announceUpgrade, { once: true });
  } else {
    announceUpgrade();
  }

  // ========== 初始化 ==========
  function init() {
    bindEvents();
    updateStatusTime();
    updateHomeDate();
    renderStrings();
    renderWeather();
    renderJournal();
    initCursor();

    // 每分钟更新时间
    setInterval(updateStatusTime, 60000);
  }

  // 启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
