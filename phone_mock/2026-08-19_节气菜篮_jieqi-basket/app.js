// ====== 全局状态 ======
const state = {
  currentTab: 'home',
  currentTermIndex: CURRENT_TERM_INDEX,
  pageStack: [], // pushed pages
  basket: [],
  currentIngredient: null,
  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  visible: true,
};

// ====== 工具函数 ======
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

function debounce(fn, wait) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

function showToast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 1500);
}

// ====== localStorage 菜篮持久化 ======
const BASKET_KEY = 'jieqi_cailan_basket_v2';
function loadBasket() {
  try {
    const raw = localStorage.getItem(BASKET_KEY);
    state.basket = raw ? JSON.parse(raw) : [];
  } catch { state.basket = []; }
}
function saveBasket() {
  try { localStorage.setItem(BASKET_KEY, JSON.stringify(state.basket)); } catch {}
}

// ====== 节气转盘 ======
const disc = {
  angle: 0, // 当前旋转角度(度)
  targetAngle: 0,
  dragging: false,
  lastAngle: 0,
  lastTime: 0,
  velocity: 0,
  rafId: null,
  damping: 0.95,
  snapDuration: 0,
};

function initDisc() {
  const svg = $('#discSvg');
  const termsGroup = $('#discTerms');
  const cx = 150, cy = 150;
  const rOuter = 128;
  const rInner = 95;

  // 渲染节气刻度和文字
  SOLAR_TERMS.forEach((term, i) => {
    const angle = (i / 24) * 360 - 90; // 从顶部开始
    const rad = angle * Math.PI / 180;

    // 刻度线
    const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    tick.setAttribute('x1', cx + Math.cos(rad) * rInner);
    tick.setAttribute('y1', cy + Math.sin(rad) * rInner);
    tick.setAttribute('x2', cx + Math.cos(rad) * (rOuter - 4));
    tick.setAttribute('y2', cy + Math.sin(rad) * (rOuter - 4));
    tick.setAttribute('class', 'term-tick');
    tick.setAttribute('data-index', i);
    termsGroup.appendChild(tick);

    // 节气文字
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', cx + Math.cos(rad) * rOuter);
    text.setAttribute('y', cy + Math.sin(rad) * rOuter);
    text.setAttribute('class', 'term-text');
    text.setAttribute('data-index', i);
    text.textContent = term.name;
    // 旋转文字使其径向朝外
    text.setAttribute('transform', `rotate(${angle + 90}, ${cx + Math.cos(rad) * rOuter}, ${cy + Math.sin(rad) * rOuter})`);
    termsGroup.appendChild(text);
  });

  // 初始角度：将当前节气转到顶部
  // 顶部(12点)对应索引 i，angle 需要满足 (index / 24) * 360 + angle ≡ -90
  // 简化：把节气 i 转到顶部需要旋转 90 - (i/24)*360 + 初始-90°... 
  // 刻度在 i=0 时 angle=-90 (顶部), 所以要让第 current 个到顶部，整体转 -(current/24)*360
  const initialAngle = -(state.currentTermIndex / 24) * 360;
  disc.angle = initialAngle;
  disc.targetAngle = initialAngle;
  updateDiscTransform();
  updateActiveTerm();

  // 拖拽
  const container = $('#discContainer');
  let startAngle = 0;
  let startPointerAngle = 0;
  let velocitySamples = [];

  function getPointerAngle(e) {
    const rect = svg.getBoundingClientRect();
    const px = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const py = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    const dx = px - rect.width / 2;
    const dy = py - rect.height / 2;
    return Math.atan2(dy, dx) * 180 / Math.PI;
  }

  function onStart(e) {
    if (state.reducedMotion) return;
    e.preventDefault();
    disc.dragging = true;
    svg.classList.add('dragging');
    startPointerAngle = getPointerAngle(e);
    startAngle = disc.angle;
    velocitySamples = [];
    cancelAnimationFrame(disc.rafId);
    disc.rafId = null;
  }

  function onMove(e) {
    if (!disc.dragging) return;
    e.preventDefault();
    const currentPointerAngle = getPointerAngle(e);
    let delta = currentPointerAngle - startPointerAngle;
    // 处理过零
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    const now = performance.now();
    const newAngle = startAngle + delta;
    disc.velocity = (newAngle - disc.lastAngle) / Math.max(1, now - disc.lastTime) * 16;
    disc.lastAngle = newAngle;
    disc.lastTime = now;

    disc.angle = newAngle;
    updateDiscTransform();
  }

  function onEnd() {
    if (!disc.dragging) return;
    disc.dragging = false;
    svg.classList.remove('dragging');

    // 惯性 + 吸附
    if (state.reducedMotion) {
      snapToNearestTerm();
      return;
    }
    startInertia();
  }

  container.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);
  container.addEventListener('touchstart', onStart, { passive: false });
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('touchend', onEnd);
}

function updateDiscTransform() {
  const svg = $('#discSvg');
  svg.style.transform = `rotate(${disc.angle}deg)`;
}

function startInertia() {
  let vel = disc.velocity;
  const threshold = 0.05;

  function step() {
    if (!state.visible) {
      disc.rafId = requestAnimationFrame(step);
      return;
    }
    if (Math.abs(vel) < threshold) {
      snapToNearestTerm();
      return;
    }
    disc.angle += vel;
    vel *= disc.damping;
    updateDiscTransform();
    disc.rafId = requestAnimationFrame(step);
  }
  cancelAnimationFrame(disc.rafId);
  disc.rafId = requestAnimationFrame(step);
}

function snapToNearestTerm() {
  // 归一化角度到 [0, 360)
  let norm = ((disc.angle % 360) + 360) % 360;
  // 哪个节气在顶部？顶部对应 -90°(即 270°)的初始刻度位置
  // 第 i 个节气在 (i/24)*360 - 90 + disc.angle 的位置
  // 要让它在顶部 (-90°)，则 (i/24)*360 - 90 + disc.angle ≡ -90 (mod 360)
  // => disc.angle ≡ -(i/24)*360 (mod 360)
  let nearestI = 0;
  let minDiff = Infinity;
  for (let i = 0; i < 24; i++) {
    const target = (-(i / 24) * 360 % 360 + 360) % 360;
    let diff = Math.abs(norm - target);
    if (diff > 180) diff = 360 - diff;
    if (diff < minDiff) { minDiff = diff; nearestI = i; }
  }

  // 计算吸附目标（保持方向连续，不用 mod）
  const targetAngle = -(nearestI / 24) * 360;
  // 找最接近的等价角
  const turns = Math.round(disc.angle / 360);
  let snapTarget = targetAngle + turns * 360;
  if (Math.abs(snapTarget - disc.angle) > 180) {
    snapTarget += (disc.angle > snapTarget ? 360 : -360);
  }

  // 弹簧吸附动画
  const start = disc.angle;
  const dist = snapTarget - start;
  const duration = 500;
  const startTime = performance.now();

  function easeOutElastic(t) {
    if (t === 0 || t === 1) return t;
    const p = 0.3;
    return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
  }
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function anim() {
    if (!state.visible) {
      disc.rafId = requestAnimationFrame(anim);
      return;
    }
    const elapsed = performance.now() - startTime;
    const t = Math.min(1, elapsed / duration);
    const eased = easeOutCubic(t);
    disc.angle = start + dist * eased;
    updateDiscTransform();

    if (t < 1) {
      disc.rafId = requestAnimationFrame(anim);
    } else {
      disc.rafId = null;
      if (nearestI !== state.currentTermIndex) {
        state.currentTermIndex = nearestI;
        onTermChanged();
      }
    }
  }
  cancelAnimationFrame(disc.rafId);
  disc.rafId = requestAnimationFrame(anim);
}

function updateActiveTerm() {
  const i = state.currentTermIndex;
  $$('.term-text').forEach(t => {
    t.classList.toggle('active', parseInt(t.dataset.index) === i);
  });
  $$('.term-tick').forEach(t => {
    t.classList.toggle('active', parseInt(t.dataset.index) === i);
  });
}

function onTermChanged() {
  updateActiveTerm();
  const term = SOLAR_TERMS[state.currentTermIndex];

  // 更新标题季节
  const titleEl = $('.title-season');
  if (titleEl) {
    titleEl.style.transition = 'opacity 200ms ease';
    titleEl.style.opacity = '0';
    setTimeout(() => {
      titleEl.textContent = term.name;
      titleEl.style.opacity = '1';
    }, 200);
  }

  // 更新列表标题
  const termNameEl = $('#currentTermName');
  if (termNameEl) termNameEl.textContent = term.name;

  // 潮水刷新食材列表
  renderIngredients(true);
}

// ====== 食材列表 ======
function getIngredientEmoji(name) {
  const map = {
    '莲藕': '🪷', '菱角': '🌰', '茄子': '🍆', '毛豆': '🫛', '秋梨': '🍐',
    '葡萄': '🍇', '南瓜': '🎃', '芋头': '🥔', '秋葵': '🌱', '玉米': '🌽',
    '鸭肉': '🦆', '绿豆': '🫘', '白菜': '🥬', '山药': '🥔', '百合': '🌸',
    '柿子': '🍅', '春笋': '🎋', '荠菜': '🌿', '香椿': '🌳', '韭菜': '🌱',
    '豌豆苗': '🌿', '樱桃': '🍒', '草莓': '🍓', '芦笋': '🥦', '蚕豆': '🫘',
    '菠菜': '🥬', '马兰头': '🌿', '艾草': '🌿', '西瓜': '🍉', '桃子': '🍑',
    '黄瓜': '🥒', '番茄': '🍅', '苦瓜': '🥒', '冬瓜': '🥒', '丝瓜': '🥒',
    '杨梅': '🍓', '荔枝': '🍇', '芒果': '🥭', '空心菜': '🥬', '苋菜': '🥬',
    '板栗': '🌰', '山楂': '🍎', '猕猴桃': '🥝', '石榴': '🍎', '苹果': '🍎',
    '红薯': '🍠', '萝卜': '🥕', '茭白': '🌾', '莼菜': '🌿', '鳜鱼': '🐟',
    '螃蟹': '🦀', '白萝卜': '🥕', '胡萝卜': '🥕', '冬笋': '🎋', '腊肉': '🥓',
    '羊肉': '🍖', '牛肉': '🥩', '饺子': '🥟', '汤圆': '🍡', '腊八粥': '🍚',
    '年糕': '🍡',
  };
  return map[name] || '🥬';
}

function renderIngredients(wave = false) {
  const list = $('#ingredientsList');
  const ingredients = INGREDIENTS[state.currentTermIndex] || [];
  $('#ingredientCount').textContent = `${ingredients.length} 种`;

  if (wave) {
    // 潮水退去
    list.style.transition = 'opacity 200ms ease, transform 200ms ease';
    list.style.opacity = '0';
    list.style.transform = 'translateY(10px)';
    setTimeout(() => {
      doRender();
      list.style.opacity = '1';
      list.style.transform = 'translateY(0)';
    }, 200);
  } else {
    doRender();
  }

  function doRender() {
    list.innerHTML = '';
    ingredients.forEach((ing, idx) => {
      const card = document.createElement('div');
      card.className = 'ingredient-card';
      card.style.animationDelay = `${idx * 40}ms`;
      card.dataset.id = ing.id;
      card.innerHTML = `
        <span class="card-season-badge">${SOLAR_TERMS[state.currentTermIndex].season}季</span>
        <div class="card-illustration">${getIngredientEmoji(ing.name)}</div>
        <div class="card-name">${ing.name}</div>
        <div class="card-sub">${ing.sub}</div>
        <div class="card-origin">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${ing.origin}
        </div>
      `;
      card.addEventListener('click', () => openIngredientModal(ing));
      list.appendChild(card);
    });
  }
}

// ====== 食材详情弹层 ======
let modalState = {
  open: false,
  dragging: false,
  startY: 0,
  currentY: 0,
};

function openIngredientModal(ing) {
  state.currentIngredient = ing;
  const content = $('#ingredientModalContent');

  const inBasket = state.basket.find(b => b.id === ing.id);

  content.innerHTML = `
    <div class="ingredient-detail-header">
      <div class="detail-illustration">${getIngredientEmoji(ing.name)}</div>
      <div class="detail-info">
        <div class="detail-name">${ing.name}</div>
        <div class="detail-sub">${ing.sub}</div>
        <div class="detail-origin-row">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${ing.origin} · ${SOLAR_TERMS[state.currentTermIndex].name}时令
        </div>
      </div>
    </div>

    <div class="detail-section">
      <div class="detail-section-title"><span class="icon-dot"></span>挑选要点</div>
      <p>${ing.tip}</p>
    </div>

    <div class="detail-section">
      <div class="detail-section-title"><span class="icon-dot"></span>储存方法</div>
      <p>${ing.storage}</p>
    </div>

    <div class="detail-section">
      <div class="detail-section-title"><span class="icon-dot"></span>可食性提示</div>
      <div class="edibility-warning">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <p>${ing.edibility}</p>
      </div>
    </div>

    <div class="detail-section">
      <div class="detail-section-title"><span class="icon-dot"></span>家常做法</div>
      <div class="recipe-entry" id="recipeEntry">
        <div class="recipe-entry-left">
          <div class="recipe-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>
          </div>
          <span class="recipe-entry-text">${ing.recipe}</span>
        </div>
        <div class="recipe-entry-arrow">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </div>
      </div>
    </div>
  `;

  // 加入菜篮按钮状态
  const btn = $('#addBasketBtn');
  if (inBasket) {
    btn.classList.add('added');
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      已在菜篮
    `;
  } else {
    btn.classList.remove('added');
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      加入菜篮
    `;
  }

  // 做法入口
  setTimeout(() => {
    const entry = $('#recipeEntry');
    if (entry) {
      entry.onclick = () => {
        closeIngredientModal();
        setTimeout(() => openRecipePage(ing), 300);
      };
    }
  }, 0);

  // 打开弹层
  const mask = $('#ingredientModalMask');
  mask.classList.add('show');
  modalState.open = true;
}

function closeIngredientModal() {
  const mask = $('#ingredientModalMask');
  mask.classList.remove('show');
  modalState.open = false;
  state.currentIngredient = null;
}

// 弹层拖拽关闭
function initModalDrag() {
  const sheet = $('#ingredientModal');
  const mask = $('#ingredientModalMask');

  function onStart(e) {
    if (!modalState.open) return;
    // 只允许从上半部分拖拽
    const target = e.target;
    if (!target.closest('.modal-handle') && !target.closest('.ingredient-detail-header')) return;
    modalState.dragging = true;
    modalState.startY = e.touches ? e.touches[0].clientY : e.clientY;
    modalState.currentY = 0;
    sheet.style.transition = 'none';
  }
  function onMove(e) {
    if (!modalState.dragging) return;
    e.preventDefault();
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    let delta = y - modalState.startY;
    if (delta < 0) delta = 0; // 不能往上拖
    // 阻尼
    delta = delta * 0.7;
    modalState.currentY = delta;
    sheet.style.transform = `translateY(${delta}px)`;
  }
  function onEnd() {
    if (!modalState.dragging) return;
    modalState.dragging = false;
    sheet.style.transition = '';
    if (modalState.currentY > 120) {
      closeIngredientModal();
      sheet.style.transform = '';
    } else {
      sheet.style.transform = 'translateY(0)';
    }
    modalState.currentY = 0;
  }

  sheet.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);
  sheet.addEventListener('touchstart', onStart, { passive: true });
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('touchend', onEnd);

  // 点击遮罩关闭
  mask.addEventListener('click', (e) => {
    if (e.target === mask) closeIngredientModal();
  });

  // 加入菜篮按钮
  $('#addBasketBtn').addEventListener('click', () => {
    if (!state.currentIngredient) return;
    addToBasket(state.currentIngredient);
  });
}

// ====== 菜篮 ======
function addToBasket(ing) {
  const existing = state.basket.find(b => b.id === ing.id);
  if (existing) {
    existing.quantity += 1;
    showToast(`已添加 ${ing.name} +1`);
  } else {
    state.basket.push({
      id: ing.id,
      name: ing.name,
      sub: ing.sub,
      quantity: 1,
      checked: false,
    });
    showToast(`已加入菜篮：${ing.name}`);
  }
  saveBasket();
  renderBasket();
  updateTabBadge();

  // 更新弹层按钮
  const btn = $('#addBasketBtn');
  btn.classList.add('added');
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    已在菜篮
  `;
}

function renderBasket() {
  const list = $('#basketList');
  const empty = $('#basketEmpty');
  const footer = $('#basketFooter');
  const sub = $('#basketSub');

  if (state.basket.length === 0) {
    list.innerHTML = '';
    empty.classList.add('show');
    footer.classList.remove('show');
    sub.textContent = '还没添加食材哦';
    return;
  }

  empty.classList.remove('show');
  footer.classList.add('show');
  sub.textContent = `共 ${state.basket.length} 种时令食材`;

  list.innerHTML = '';
  state.basket.forEach((item, idx) => {
    const el = document.createElement('div');
    el.className = 'basket-item' + (item.checked ? ' checked' : '');
    el.dataset.id = item.id;
    el.innerHTML = `
      <div class="item-checkbox ${item.checked ? 'checked' : ''}" data-action="check">
        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div class="item-emoji">${getIngredientEmoji(item.name)}</div>
      <div class="item-info">
        <div class="item-name">${item.name}</div>
        <div class="item-sub">${item.sub}</div>
      </div>
      <div class="item-qty">
        <button class="qty-btn" data-action="decrease">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <span class="qty-num">${item.quantity}</span>
        <button class="qty-btn" data-action="increase">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>
      <div class="item-delete-btn">删除</div>
    `;

    // 点击事件
    el.querySelector('[data-action="check"]').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleCheck(item.id);
    });
    el.querySelector('[data-action="decrease"]').addEventListener('click', (e) => {
      e.stopPropagation();
      changeQty(item.id, -1);
    });
    el.querySelector('[data-action="increase"]').addEventListener('click', (e) => {
      e.stopPropagation();
      changeQty(item.id, 1);
    });

    // 左滑删除
    initLeftSwipe(el, item.id);

    list.appendChild(el);
  });

  // 更新合计
  $('#basketTotal').textContent = state.basket.length;
  $('#basketChecked').textContent = state.basket.filter(b => b.checked).length;
}

function toggleCheck(id) {
  const item = state.basket.find(b => b.id === id);
  if (!item) return;
  item.checked = !item.checked;
  saveBasket();
  renderBasket();
}

function changeQty(id, delta) {
  const item = state.basket.find(b => b.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromBasket(id);
    return;
  }
  saveBasket();
  renderBasket();
  updateTabBadge();
}

function removeFromBasket(id) {
  state.basket = state.basket.filter(b => b.id !== id);
  saveBasket();
  renderBasket();
  updateTabBadge();
  showToast('已从菜篮移除');
}

function updateTabBadge() {
  const badge = $('#tabBadge');
  const total = state.basket.reduce((s, b) => s + b.quantity, 0);
  if (total > 0) {
    badge.style.display = 'flex';
    badge.textContent = total > 99 ? '99+' : total;
  } else {
    badge.style.display = 'none';
  }
}

// 左滑删除
function initLeftSwipe(el, id) {
  let startX = 0;
  let currentX = 0;
  let swiping = false;
  const threshold = 60;

  function onStart(e) {
    startX = e.touches ? e.touches[0].clientX : e.clientX;
    swiping = true;
    currentX = 0;
    el.style.transition = 'none';
  }
  function onMove(e) {
    if (!swiping) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    let delta = x - startX;
    if (delta > 0) delta = 0; // 只能左滑
    currentX = delta;
    el.style.transform = `translateX(${delta}px)`;
  }
  function onEnd() {
    if (!swiping) return;
    swiping = false;
    el.style.transition = '';
    if (currentX < -threshold) {
      // 确认删除
      el.style.transform = 'translateX(-80px)';
      setTimeout(() => {
        removeFromBasket(id);
      }, 200);
    } else {
      el.style.transform = 'translateX(0)';
    }
  }

  el.addEventListener('touchstart', onStart, { passive: true });
  el.addEventListener('touchmove', onMove, { passive: true });
  el.addEventListener('touchend', onEnd);

  // 鼠标也支持（便于桌面测试）
  el.addEventListener('mousedown', (e) => {
    if (e.target.closest('[data-action]')) return; // 不拦截按钮
    onStart(e);
    const move = (ev) => onMove(ev);
    const up = () => {
      onEnd();
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  });
}

// ====== Tab 切换 ======
function initTabs() {
  const tabs = $$('.tab-item');
  const indicator = $('#tabIndicator');

  function updateIndicator() {
    const active = $('.tab-item.tab-active');
    if (!active) return;
    const parentRect = active.parentElement.getBoundingClientRect();
    const rect = active.getBoundingClientRect();
    const left = rect.left - parentRect.left + rect.width / 2 - 10;
    indicator.style.left = `${left}px`;
    indicator.style.opacity = '1';
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      if (target === state.currentTab) return;

      tabs.forEach(t => t.classList.remove('tab-active'));
      tab.classList.add('tab-active');
      state.currentTab = target;
      updateIndicator();

      // 切换页面
      $$('.page').forEach(p => {
        if (p.classList.contains('page-pushed')) return;
        p.classList.remove('page-active');
      });
      $(`#page${capitalize(target)}`).classList.add('page-active');

      // 更新导航
      updateNavForTab(target);

      // 如果有推入的页面，先退栈
      while (state.pageStack.length) popPage();
    });
  });

  setTimeout(updateIndicator, 100);

  // 空状态跳转
  $('#emptyBtn').addEventListener('click', () => {
    $('.tab-item[data-tab="home"]').click();
  });
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function updateNavForTab(tab) {
  const titles = { home: '时令', basket: '菜篮', profile: '我的' };
  $('#navTitle').textContent = titles[tab] || '';
  $('#navBar').classList.remove('has-back');
}

// ====== 页面栈（push/pop） ======
function pushPage(pageId, title) {
  state.pageStack.push(pageId);
  const page = $(`#page${capitalize(pageId)}`);
  if (!page) return;
  page.classList.add('page-active');
  $('#navTitle').textContent = title || '';
  $('#navBar').classList.add('has-back');
  // 隐藏 tabbar
  $('#tabBar').style.opacity = '0';
  $('#tabBar').style.pointerEvents = 'none';
  $('#tabBar').style.transition = 'opacity 200ms ease';
}

function popPage() {
  if (state.pageStack.length === 0) return;
  const pageId = state.pageStack.pop();
  const page = $(`#page${capitalize(pageId)}`);
  if (page) page.classList.remove('page-active');

  if (state.pageStack.length > 0) {
    // 还有上一层
    const prev = state.pageStack[state.pageStack.length - 1];
    const prevNames = { spec: '设计规范', api: '接口文档', recipe: '做法' };
    $('#navTitle').textContent = prevNames[prev] || '';
  } else {
    // 回到 tab
    $('#navBar').classList.remove('has-back');
    updateNavForTab(state.currentTab);
    $('#tabBar').style.opacity = '1';
    $('#tabBar').style.pointerEvents = '';
  }
}

function initNavBack() {
  $('#navBackBtn').addEventListener('click', () => {
    if (modalState.open) { closeIngredientModal(); return; }
    popPage();
  });
}

// ====== 做法页 ======
function openRecipePage(ing) {
  const content = $('#recipeContent');
  const steps = ing.recipeSteps || [];

  content.innerHTML = `
    <div class="recipe-header-img">${getIngredientEmoji(ing.name)}</div>
    <h1 class="recipe-title">${ing.recipe}</h1>
    <div class="recipe-meta">
      <span>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        ${steps * 5 + 10} 分钟
      </span>
      <span>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        2-3 人份
      </span>
      <span>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        家常
      </span>
    </div>

    <h3 class="recipe-section-title">所需食材</h3>
    <div class="ingredient-tags">
      <span class="ingredient-tag">${ing.name} 适量</span>
      <span class="ingredient-tag">姜 3片</span>
      <span class="ingredient-tag">葱 1根</span>
      <span class="ingredient-tag">盐 少许</span>
      <span class="ingredient-tag">生抽 1勺</span>
    </div>

    <h3 class="recipe-section-title">做法步骤</h3>
    <div class="steps-list">
      ${steps.map((s, i) => `
        <div class="step-item">
          <div class="step-number">${i + 1}</div>
          <div class="step-text">${s}</div>
        </div>
      `).join('')}
    </div>
  `;

  pushPage('recipe', ing.recipe);
}

// ====== 我的页跳转 ======
function initProfileLinks() {
  $$('.profile-item[data-goto]').forEach(item => {
    item.addEventListener('click', () => {
      const goto = item.dataset.goto;
      const titles = { spec: '设计规范', api: '接口文档' };
      pushPage(goto, titles[goto]);
    });
  });

  // 足迹
  renderFootprint();
}

function renderFootprint() {
  const list = $('#footprintList');
  list.innerHTML = FOOTPRINT.map(f => `
    <div class="footprint-item">
      <div class="footprint-emoji">${getIngredientEmoji(f.name)}</div>
      <div class="footprint-name">${f.name}</div>
      <div class="footprint-date">${f.date}</div>
    </div>
  `).join('');
}

// ====== 下拉弹性刷新（视觉效果） ======
function initPullRefresh() {
  const homePage = $('#pageHome');
  const pullEl = $('#pullRefresh');
  const pullText = $('#pullText');
  let startY = 0;
  let pulling = false;
  let pullDist = 0;

  homePage.addEventListener('touchstart', (e) => {
    if (homePage.scrollTop <= 0) {
      startY = e.touches[0].clientY;
      pulling = true;
    }
  });
  homePage.addEventListener('touchmove', (e) => {
    if (!pulling) return;
    const y = e.touches[0].clientY;
    let delta = y - startY;
    if (delta <= 0) {
      pullEl.classList.remove('show');
      return;
    }
    // 阻尼
    delta = Math.min(delta * 0.5, 80);
    pullDist = delta;
    pullEl.classList.add('show');
    pullEl.style.transform = `translateX(-50%) translateY(${delta - 30}px)`;
    pullText.textContent = delta > 50 ? '释放更新' : '下拉刷新';
  });
  homePage.addEventListener('touchend', () => {
    if (!pulling) return;
    pulling = false;
    if (pullDist > 50) {
      pullText.textContent = '已是最新时鲜';
      setTimeout(() => {
        pullEl.classList.remove('show');
        pullEl.style.transform = '';
      }, 800);
    } else {
      pullEl.classList.remove('show');
      pullEl.style.transform = '';
    }
    pullDist = 0;
  });

  // 桌面端鼠标模拟（便于测试）
  let mousePulling = false;
  homePage.addEventListener('mousedown', (e) => {
    if (homePage.scrollTop <= 0) {
      startY = e.clientY;
      mousePulling = true;
    }
  });
  window.addEventListener('mousemove', (e) => {
    if (!mousePulling) return;
    let delta = e.clientY - startY;
    if (delta <= 0) { pullEl.classList.remove('show'); return; }
    delta = Math.min(delta * 0.5, 80);
    pullDist = delta;
    pullEl.classList.add('show');
    pullEl.style.transform = `translateX(-50%) translateY(${delta - 30}px)`;
    pullText.textContent = delta > 50 ? '释放更新' : '下拉刷新';
  });
  window.addEventListener('mouseup', () => {
    if (!mousePulling) return;
    mousePulling = false;
    if (pullDist > 50) {
      pullText.textContent = '已是最新时鲜';
      setTimeout(() => {
        pullEl.classList.remove('show');
        pullEl.style.transform = '';
      }, 800);
    } else {
      pullEl.classList.remove('show');
      pullEl.style.transform = '';
    }
    pullDist = 0;
  });
}

// ====== 自定义光标 ======
function initCustomCursor() {
  const cursor = $('#customCursor');
  let visible = false;

  function move(x, y) {
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;
    if (!visible) {
      cursor.classList.add('show');
      visible = true;
    }
  }

  window.addEventListener('mousemove', (e) => move(e.clientX, e.clientY));

  // hover 可点元素
  document.addEventListener('mouseover', (e) => {
    const target = e.target;
    if (target.closest('button, .tab-item, .ingredient-card, .profile-item, .profile-card, .recipe-entry, .item-checkbox, .qty-btn, .empty-btn, .nav-back, .capsule-btn, .footprint-item')) {
      cursor.classList.add('hovering');
    }
  });
  document.addEventListener('mouseout', (e) => {
    const target = e.target;
    if (target.closest('button, .tab-item, .ingredient-card, .profile-item, .profile-card, .recipe-entry, .item-checkbox, .qty-btn, .empty-btn, .nav-back, .capsule-btn, .footprint-item')) {
      cursor.classList.remove('hovering');
    }
  });

  // 隐藏默认光标（在舞台上）
  document.body.style.cursor = 'none';
}

// ====== 可见性暂停 ======
document.addEventListener('visibilitychange', () => {
  state.visible = !document.hidden;
});

// ====== 胶囊按钮交互 ======
function initCapsule() {
  $('#capsuleMore').addEventListener('click', () => showToast('更多菜单'));
  $('#capsuleCircle').addEventListener('click', () => showToast('分享给好友'));
}

// ====== 初始化 ======
document.addEventListener('DOMContentLoaded', () => {
  loadBasket();
  initDisc();
  renderIngredients();
  renderBasket();
  updateTabBadge();
  initTabs();
  initNavBack();
  initModalDrag();
  initProfileLinks();
  initPullRefresh();
  initCustomCursor();
  initCapsule();

  // 初始光标位置
  setTimeout(() => {
    const phone = $('.phone-screen').getBoundingClientRect();
    const cursor = $('#customCursor');
    cursor.style.left = `${phone.left + phone.width / 2}px`;
    cursor.style.top = `${phone.top + phone.height / 2}px`;
    cursor.classList.add('show');
  }, 300);
});
