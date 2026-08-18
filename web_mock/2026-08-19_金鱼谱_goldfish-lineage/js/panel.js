/* ============================================
   对照阅读面板模块
   - 祖先 vs 变异品种并排对比
   - 变异特征对照表
   - 宣纸展开动画
   - 印章落下动画
   ============================================ */

(function() {
  'use strict';

  const data = window.GOLDFISH_DATA;
  const panel = document.getElementById('compare-panel');
  const panelContent = panel ? panel.querySelector('.panel-content') : null;
  const panelHandle = document.getElementById('panel-handle');
  const panelClose = document.getElementById('panel-close');
  const featureTable = document.getElementById('feature-table');
  const descText = document.getElementById('desc-text');

  if (!panel || !data) return;

  const state = {
    isOpen: false,
    currentId: null,
    animTimeout: null
  };

  // ===== 获取品种数据 =====
  function getVariety(id) {
    return data.varieties.find(function(v) { return v.id === id; });
  }

  function getAncestor(variety) {
    if (!variety.ancestor) return null;
    return getVariety(variety.ancestor);
  }

  // ===== 渲染鱼形 SVG =====
  function renderFish(containerId, variety) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const svgEl = container.querySelector('.fish-svg');
    if (!svgEl) return;

    const shape = variety.fishShape;
    const color = variety.id === 'crucian' ? '#8A8A8A' : '#C0392B';

    const fishInfo = window.GoldfishTree
      ? window.GoldfishTree.assembleFish(shape, color, 40, {})
      : { svg: '', width: 100, height: 50 };

    const totalW = fishInfo.width || 100;
    const totalH = fishInfo.height || 60;

    svgEl.setAttribute('viewBox', `0 ${-totalH/2} ${totalW} ${totalH}`);
    svgEl.innerHTML = fishInfo.svg;
  }

  // ===== 渲染品种信息 =====
  function renderInfo(variety, side) {
    const prefix = side === 'ancestor' ? 'ancestor' : 'variant';

    const nameEl = document.getElementById(prefix + '-name');
    const latinEl = document.getElementById(prefix + '-latin');
    const eraEl = document.getElementById(prefix + '-era');
    const colorEl = document.getElementById(prefix + '-color');

    if (nameEl) nameEl.textContent = variety.name;
    if (latinEl) latinEl.textContent = variety.latin;
    if (eraEl) eraEl.textContent = variety.era;
    if (colorEl) colorEl.textContent = variety.color;
  }

  // ===== 渲染特征对照表 =====
  function renderFeatures(variety) {
    if (!featureTable) return;
    featureTable.innerHTML = '';

    if (!variety.variantFeatures || variety.variantFeatures.length === 0) {
      // 根节点无变异特征
      const row = document.createElement('div');
      row.className = 'feature-row';
      row.innerHTML = `
        <span class="feature-name">原始</span>
        <span class="feature-val-ancestor">野生型</span>
        <span class="feature-val-variant">野生型</span>
      `;
      featureTable.appendChild(row);
      return;
    }

    variety.variantFeatures.forEach(function(f) {
      const row = document.createElement('div');
      row.className = 'feature-row';
      row.innerHTML = `
        <span class="feature-name">${f.feature}</span>
        <span class="feature-val-ancestor">${f.ancestor}</span>
        <span class="feature-val-variant">${f.variant}</span>
      `;
      // 悬停行时显示备注（作为 title）
      if (f.note) {
        row.title = f.note;
      }
      featureTable.appendChild(row);
    });
  }

  // ===== 渲染描述 =====
  function renderDescription(variety) {
    if (descText) {
      descText.textContent = variety.description || '';
    }
  }

  // ===== 打开面板 =====
  function openPanel(varietyId) {
    const variety = getVariety(varietyId);
    if (!variety) return;

    state.currentId = varietyId;
    const ancestor = getAncestor(variety) || variety; // 无根节点时显示自身

    // 渲染内容
    renderFish('ancestor-fish', ancestor);
    renderFish('variant-fish', variety);
    renderInfo(ancestor, 'ancestor');
    renderInfo(variety, 'variant');
    renderFeatures(variety);
    renderDescription(variety);

    // 打开面板
    panel.classList.add('is-open');
    state.isOpen = true;

    // 重新触发展开动画
    panelContent.classList.remove('panel-unfold');
    // 强制回流
    void panelContent.offsetWidth;
    panelContent.classList.add('panel-unfold');

    // 清除之前的超时
    if (state.animTimeout) {
      clearTimeout(state.animTimeout);
    }

    // 动画结束后移除 class
    state.animTimeout = setTimeout(function() {
      panelContent.classList.remove('panel-unfold');
      state.animTimeout = null;
    }, 800);
  }

  // ===== 关闭面板 =====
  function closePanel() {
    panel.classList.remove('is-open');
    state.isOpen = false;
    state.currentId = null;
  }

  function togglePanel() {
    if (state.isOpen) {
      closePanel();
    } else {
      // 如果有当前选中的品种，打开它；否则打开默认第一个
      const selected = window.GoldfishTree && window.GoldfishTree.getSelected();
      if (selected) {
        openPanel(selected);
      } else {
        openPanel('grass');
      }
    }
  }

  // ===== 事件绑定 =====
  function bindEvents() {
    // 面板手柄点击
    if (panelHandle) {
      panelHandle.addEventListener('click', function(e) {
        e.stopPropagation();
        togglePanel();
      });
    }

    // 关闭按钮
    if (panelClose) {
      panelClose.addEventListener('click', function(e) {
        e.stopPropagation();
        closePanel();
      });
    }

    // 监听品种选择事件
    document.addEventListener('goldfish:select', function(e) {
      openPanel(e.detail.id);
    });

    // 键盘 ESC 关闭
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && state.isOpen) {
        closePanel();
      }
    });
  }

  // ===== 初始化 =====
  function init() {
    bindEvents();
  }

  window.GoldfishPanel = {
    init: init,
    open: openPanel,
    close: closePanel,
    toggle: togglePanel,
    isOpen: function() { return state.isOpen; }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
