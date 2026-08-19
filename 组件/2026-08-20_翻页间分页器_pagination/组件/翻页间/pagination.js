/* ============================================================
 * 翻页间 · 分页导航组件  Pagination Component
 * 可独立抽取的 JS 文件
 * 纯 vanilla JS，无依赖
 *
 * 用法：
 *   const pager = initPagination(el, {
 *     current: 1,
 *     total: 100,
 *     pageSize: 10,
 *     showInfo: true,
 *     showJumper: true,
 *     showSizeChanger: false,
 *     pageSizeOptions: [10, 20, 50],
 *     showIndicator: true,
 *     onChange: (page, pageSize) => {},
 *   });
 *   pager.setPage(3);
 *   pager.setTotal(200);
 *   pager.setPageSize(20);
 *   pager.setLoading(true);
 *   pager.destroy();
 * ============================================================ */

(function (global) {
  'use strict';

  /* ---------- 工具函数 ---------- */
  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function createEl(tag, className, attrs) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (attrs) {
      for (var key in attrs) {
        if (attrs.hasOwnProperty(key)) {
          if (key === 'text') el.textContent = attrs[key];
          else if (key === 'html') el.innerHTML = attrs[key];
          else el.setAttribute(key, attrs[key]);
        }
      }
    }
    return el;
  }

  /* ---------- 智能省略号算法 ----------
   * 输入：total（总页数）、current（当前页，1-based）
   * 输出：页码数组，'...' 表示省略号（可点击展开）
   * 规则：
   *   - 首尾页恒定显示
   *   - 当前页及其左右邻页展开
   *   - 当前页离首/尾近时，邻侧省略号退化
   *   - 总页数 <= 7 时全部显示
   */
  function buildPages(total, current) {
    var pages = [];
    if (total <= 1) return [1];
    if (total <= 7) {
      for (var i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    // 当前页邻域半径
    var left = Math.max(1, current - 1);
    var right = Math.min(total, current + 1);

    // 首部：第 1 页
    pages.push(1);

    // 左侧省略号判断
    if (left > 2) {
      pages.push('...left');  // 左侧省略号，点击展开到 first-half
    } else if (left === 2) {
      // 第 2 页直接显示
      pages.push(2);
    }

    // 中间展开页（跳过首尾已显示的）
    for (var p = left; p <= right; p++) {
      if (p !== 1 && p !== total) pages.push(p);
    }

    // 右侧省略号判断
    if (right < total - 1) {
      pages.push('...right'); // 右侧省略号
    } else if (right === total - 1) {
      // 倒数第二页直接显示
      // 注意：若 right 就是 total-1 且未在循环中加入，则补入
      if (pages.indexOf(total - 1) === -1) {
        pages.push(total - 1);
      }
    }

    // 尾部：最后一页
    if (total !== 1) pages.push(total);

    // 去重与顺序修正（因为上面逻辑可能导致重复）
    var seen = {};
    var result = [];
    for (var j = 0; j < pages.length; j++) {
      var item = pages[j];
      var key = typeof item === 'number' ? 'n' + item : item;
      if (!seen[key]) {
        seen[key] = true;
        result.push(item);
      }
    }
    return result;
  }

  /* ---------- 组件构造 ---------- */
  function initPagination(container, options) {
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
    if (!container) {
      throw new Error('翻页间：未找到容器元素');
    }

    /* --- 配置 --- */
    var opts = Object.assign({
      current: 1,
      total: 0,          // 总条数（与 pageSize 共同决定总页数）
      pageSize: 10,
      totalPages: null,  // 若直接指定总页数，优先使用
      showInfo: true,
      showJumper: true,
      showSizeChanger: false,
      pageSizeOptions: [10, 20, 50],
      showIndicator: true,
      onChange: null,    // function(page, pageSize)
      onLoadingChange: null,
      prevText: '',
      nextText: '',
      sizeLabel: '条/页',
      jumperLabel: '跳至',
      jumperUnit: '页',
      infoTemplate: '共 {total} 条',
    }, options || {});

    /* --- 状态 --- */
    var state = {
      current: clamp(parseInt(opts.current) || 1, 1, Infinity),
      pageSize: parseInt(opts.pageSize) || 10,
      total: parseInt(opts.total) || 0,
      totalPages: opts.totalPages,  // 可能为 null
      loading: false,
      destroyed: false,
      visible: true,
    };

    function getTotalPages() {
      if (state.totalPages !== null && state.totalPages !== undefined) {
        return Math.max(1, state.totalPages);
      }
      if (state.total <= 0) return 1;
      return Math.max(1, Math.ceil(state.total / state.pageSize));
    }

    /* --- DOM 构建 --- */
    var root = createEl('div', 'fyj-pagination', {
      role: 'navigation',
      'aria-label': '分页导航',
    });

    // 上一页按钮
    var prevBtn = createEl('button', 'fyj-pagination__btn fyj-pagination__btn--prev', {
      type: 'button',
      'aria-label': '上一页',
      title: '上一页',
    });
    var prevIcon = createEl('span', 'fyj-icon');
    prevBtn.appendChild(prevIcon);
    if (opts.prevText) {
      var prevLabel = createEl('span', 'fyj-pagination__btn-text', { text: opts.prevText });
      prevBtn.appendChild(prevLabel);
    }
    root.appendChild(prevBtn);

    // 页码容器（用于定位指示条）
    var pageList = createEl('span', 'fyj-pagination__pages');
    root.appendChild(pageList);

    // 下一页按钮
    var nextBtn = createEl('button', 'fyj-pagination__btn fyj-pagination__btn--next', {
      type: 'button',
      'aria-label': '下一页',
      title: '下一页',
    });
    var nextIcon = createEl('span', 'fyj-icon');
    nextBtn.appendChild(nextIcon);
    if (opts.nextText) {
      var nextLabel = createEl('span', 'fyj-pagination__btn-text', { text: opts.nextText });
      nextBtn.appendChild(nextLabel);
    }
    root.appendChild(nextBtn);

    // 每页条数
    var sizeSelect = null;
    if (opts.showSizeChanger && opts.pageSizeOptions.length) {
      sizeSelect = createEl('select', 'fyj-pagination__size-select', {
        'aria-label': '每页条数',
      });
      opts.pageSizeOptions.forEach(function (sz) {
        var opt = createEl('option', '', { value: String(sz), text: sz + ' ' + opts.sizeLabel });
        if (sz === state.pageSize) opt.selected = true;
        sizeSelect.appendChild(opt);
      });
      root.appendChild(sizeSelect);
    }

    // 跳页输入
    var jumperWrap = null;
    var jumperInput = null;
    var errorTip = null;
    if (opts.showJumper) {
      jumperWrap = createEl('span', 'fyj-pagination__jumper');
      var jumperLabelEl = createEl('span', '', { text: opts.jumperLabel });
      jumperInput = createEl('input', 'fyj-pagination__jumper-input', {
        type: 'text',
        inputmode: 'numeric',
        pattern: '[0-9]*',
        'aria-label': '跳转至页码',
      });
      var jumperUnitEl = createEl('span', '', { text: opts.jumperUnit });
      jumperWrap.appendChild(jumperLabelEl);
      jumperWrap.appendChild(jumperInput);
      jumperWrap.appendChild(jumperUnitEl);
      root.appendChild(jumperWrap);

      // 错误提示
      errorTip = createEl('span', 'fyj-pagination__error-tip');
      root.appendChild(errorTip);
    }

    // 信息文字
    var infoEl = null;
    if (opts.showInfo) {
      infoEl = createEl('span', 'fyj-pagination__info');
      root.appendChild(infoEl);
    }

    // 指示条（当前页"印章"滑动条）
    var indicator = null;
    if (opts.showIndicator) {
      indicator = createEl('span', 'fyj-pagination__indicator');
      root.appendChild(indicator);
      root.classList.add('has-indicator');
    }

    container.appendChild(root);

    /* --- 渲染 --- */
    var pageButtons = [];  // 缓存页码按钮元素，用于指示条定位
    var ellipsisButtons = [];

    function render() {
      if (state.destroyed) return;

      var totalPages = getTotalPages();
      state.current = clamp(state.current, 1, totalPages);

      // 更新 prev/next 禁用状态
      var atFirst = state.current <= 1;
      var atLast = state.current >= totalPages;
      prevBtn.disabled = atFirst || state.loading;
      nextBtn.disabled = atLast || state.loading;
      prevBtn.setAttribute('aria-disabled', String(atFirst || state.loading));
      nextBtn.setAttribute('aria-disabled', String(atLast || state.loading));

      // 清空页码列表
      while (pageList.firstChild) {
        pageList.removeChild(pageList.firstChild);
      }
      pageButtons = [];
      ellipsisButtons = [];

      var pages = buildPages(totalPages, state.current);

      pages.forEach(function (item, idx) {
        if (typeof item === 'number') {
          var btn = createEl('button', 'fyj-pagination__btn', {
            type: 'button',
            text: String(item),
            'aria-label': '第 ' + item + ' 页',
          });
          if (item === state.current) {
            btn.classList.add('is-current');
            btn.setAttribute('aria-current', 'page');
            btn.setAttribute('tabindex', '0');
          } else {
            btn.setAttribute('tabindex', '-1');
          }
          btn.dataset.page = item;
          pageList.appendChild(btn);
          pageButtons.push(btn);
        } else if (typeof item === 'string' && item.indexOf('...') === 0) {
          var side = item === '...left' ? 'left' : 'right';
          var ellip = createEl('button', 'fyj-pagination__ellipsis', {
            type: 'button',
            'aria-label': side === 'left' ? '向前展开更多页码' : '向后展开更多页码',
            title: side === 'left' ? '点击向前跳转' : '点击向后跳转',
            text: '···',
          });
          ellip.dataset.side = side;
          ellip.setAttribute('tabindex', '-1');
          pageList.appendChild(ellip);
          ellipsisButtons.push(ellip);
        }
      });

      // 更新信息
      if (infoEl) {
        var info = opts.infoTemplate
          .replace('{total}', state.total)
          .replace('{pageSize}', state.pageSize)
          .replace('{current}', state.current)
          .replace('{totalPages}', totalPages);
        infoEl.textContent = info;
      }

      // 更新 size select
      if (sizeSelect) {
        sizeSelect.value = String(state.pageSize);
        sizeSelect.disabled = state.loading;
      }

      // 更新 jumper
      if (jumperInput) {
        jumperInput.disabled = state.loading;
        jumperInput.value = String(state.current);
      }

      // 加载态
      if (state.loading) {
        root.classList.add('is-loading');
        root.setAttribute('aria-busy', 'true');
      } else {
        root.classList.remove('is-loading');
        root.removeAttribute('aria-busy');
      }

      // 更新指示条位置
      updateIndicator();
    }

    function updateIndicator() {
      if (!indicator || !opts.showIndicator) return;

      // 找到当前页按钮
      var currentBtn = pageList.querySelector('.fyj-pagination__btn.is-current');
      if (!currentBtn) {
        indicator.style.opacity = '0';
        return;
      }

      var listRect = pageList.getBoundingClientRect();
      var btnRect = currentBtn.getBoundingClientRect();
      var offsetX = btnRect.left - listRect.left;
      var width = btnRect.width;

      // 指示条放在 pageList 下方，但由于 pageList 在 flex 中，
      // 我们让 indicator 相对于 pageList 定位
      indicator.style.left = '0';
      indicator.style.transform = 'translateX(' + offsetX + 'px)';
      indicator.style.width = width + 'px';
      indicator.style.top = (listRect.height - 2) + 'px';
      indicator.style.opacity = '1';
    }

    /* --- 事件：页码按钮点击（事件委托） --- */
    function handlePageListClick(e) {
      if (state.loading || state.destroyed) return;

      var target = e.target;
      // 页码按钮
      var pageBtn = target.closest('.fyj-pagination__btn');
      if (pageBtn && pageBtn.dataset.page) {
        var pageNum = parseInt(pageBtn.dataset.page);
        if (!isNaN(pageNum) && pageNum !== state.current) {
          goToPage(pageNum);
        }
        return;
      }
      // 省略号点击
      var ellipBtn = target.closest('.fyj-pagination__ellipsis');
      if (ellipBtn && ellipBtn.dataset.side) {
        var totalPages = getTotalPages();
        if (ellipBtn.dataset.side === 'left') {
          // 向前跳 5 页（或到第 2 页）
          var targetLeft = Math.max(2, state.current - 5);
          goToPage(targetLeft);
        } else {
          // 向后跳 5 页（或到倒数第二页）
          var targetRight = Math.min(totalPages - 1, state.current + 5);
          goToPage(targetRight);
        }
        return;
      }
    }

    pageList.addEventListener('click', handlePageListClick);

    /* --- 上一页 / 下一页 --- */
    function handlePrev() {
      if (state.loading || state.destroyed) return;
      if (state.current <= 1) {
        bumpWall(prevBtn, 'left');
        return;
      }
      goToPage(state.current - 1);
    }

    function handleNext() {
      if (state.loading || state.destroyed) return;
      var totalPages = getTotalPages();
      if (state.current >= totalPages) {
        bumpWall(nextBtn, 'right');
        return;
      }
      goToPage(state.current + 1);
    }

    prevBtn.addEventListener('click', handlePrev);
    nextBtn.addEventListener('click', handleNext);

    /* --- 顶墙回弹动画 --- */
    var bumpTimer = null;
    function bumpWall(btn, direction) {
      if (bumpTimer) {
        btn.classList.remove('is-bump');
        // 强制重排以重启动画
        void btn.offsetWidth;
      }
      btn.classList.add('is-bump');
      clearTimeout(bumpTimer);
      bumpTimer = setTimeout(function () {
        btn.classList.remove('is-bump');
        bumpTimer = null;
      }, 300);
    }

    /* --- 每页条数切换 --- */
    if (sizeSelect) {
      sizeSelect.addEventListener('change', function () {
        if (state.loading || state.destroyed) return;
        var newSize = parseInt(sizeSelect.value);
        if (isNaN(newSize) || newSize === state.pageSize) return;

        // 计算新总页数，并尽量保持当前页首条数据仍在视野中
        var firstItemIndex = (state.current - 1) * state.pageSize + 1;
        state.pageSize = newSize;
        var newTotalPages = getTotalPages();
        var newCurrent = clamp(Math.ceil(firstItemIndex / newSize), 1, newTotalPages);
        state.current = newCurrent;
        render();
        triggerChange();
      });
    }

    /* --- 跳页输入 --- */
    var shakeTimer = null;
    var errorHideTimer = null;

    function showError(msg) {
      if (!errorTip || !jumperInput) return;
      errorTip.textContent = msg;
      errorTip.classList.add('is-visible');
      jumperInput.classList.add('is-error');

      // 重新触发抖动
      jumperInput.style.animation = 'none';
      void jumperInput.offsetWidth;
      jumperInput.style.animation = '';

      clearTimeout(errorHideTimer);
      errorHideTimer = setTimeout(hideError, 2000);
    }

    function hideError() {
      if (errorTip) errorTip.classList.remove('is-visible');
      if (jumperInput) jumperInput.classList.remove('is-error');
    }

    if (jumperInput) {
      jumperInput.addEventListener('focus', function () {
        root.classList.add('is-jump-editing');
        // 选中全部文字便于输入
        try { jumperInput.select(); } catch (e) {}
      });

      jumperInput.addEventListener('blur', function () {
        root.classList.remove('is-jump-editing');
        validateAndJump();
      });

      jumperInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          validateAndJump();
          jumperInput.blur();
        } else if (e.key === 'Escape') {
          jumperInput.value = String(state.current);
          jumperInput.blur();
          hideError();
        }
      });

      jumperInput.addEventListener('input', function () {
        hideError();
      });
    }

    function validateAndJump() {
      if (state.loading || state.destroyed) return;
      var val = jumperInput.value.trim();
      var totalPages = getTotalPages();

      if (val === '') {
        jumperInput.value = String(state.current);
        return;
      }

      var num = parseInt(val, 10);
      if (isNaN(num) || val !== String(num)) {
        showError('请输入有效的数字页码');
        jumperInput.value = String(state.current);
        return;
      }
      if (num < 1 || num > totalPages) {
        showError('请输入 1 到 ' + totalPages + ' 之间的页码');
        jumperInput.value = String(state.current);
        return;
      }
      if (num !== state.current) {
        goToPage(num);
      }
    }

    /* --- 跳转核心 --- */
    function goToPage(page) {
      var totalPages = getTotalPages();
      var newPage = clamp(page, 1, totalPages);
      if (newPage === state.current) return;
      state.current = newPage;
      render();
      triggerChange();
    }

    function triggerChange() {
      if (typeof opts.onChange === 'function') {
        try {
          opts.onChange(state.current, state.pageSize);
        } catch (e) {
          // 静默处理回调错误
        }
      }
    }

    /* --- 键盘导航 --- */
    function handleKeydown(e) {
      if (state.destroyed) return;
      // 仅当焦点在组件内时响应方向键
      if (!root.contains(document.activeElement)) return;
      // 输入框编辑态时，方向键给光标用
      if (document.activeElement === jumperInput) return;
      // select 展开时不拦截
      if (document.activeElement === sizeSelect) return;

      var totalPages = getTotalPages();
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (state.current > 1) {
            goToPage(state.current - 1);
            focusCurrentBtn();
          } else {
            bumpWall(prevBtn, 'left');
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (state.current < totalPages) {
            goToPage(state.current + 1);
            focusCurrentBtn();
          } else {
            bumpWall(nextBtn, 'right');
          }
          break;
        case 'Home':
          e.preventDefault();
          if (state.current !== 1) {
            goToPage(1);
            focusCurrentBtn();
          }
          break;
        case 'End':
          e.preventDefault();
          if (state.current !== totalPages) {
            goToPage(totalPages);
            focusCurrentBtn();
          }
          break;
        case 'Enter':
        case ' ':
          // 按钮的 Enter/Space 由浏览器默认处理
          break;
      }
    }

    function focusCurrentBtn() {
      var currentBtn = pageList.querySelector('.fyj-pagination__btn.is-current');
      if (currentBtn) {
        currentBtn.setAttribute('tabindex', '0');
        currentBtn.focus();
      }
    }

    // 整体键盘事件
    root.addEventListener('keydown', handleKeydown);

    // 焦点管理：Tab 进入时停在当前页按钮
    function updateTabOrder() {
      var btns = pageList.querySelectorAll('.fyj-pagination__btn');
      btns.forEach(function (btn) {
        if (btn.classList.contains('is-current')) {
          btn.setAttribute('tabindex', '0');
        } else {
          btn.setAttribute('tabindex', '-1');
        }
      });
      var ellipsis = pageList.querySelectorAll('.fyj-pagination__ellipsis');
      ellipsis.forEach(function (el) {
        el.setAttribute('tabindex', '-1');
      });
    }

    // 每次 render 后更新 Tab 顺序
    var originalRender = render;
    render = function () {
      originalRender();
      updateTabOrder();
    };

    /* --- 可见性暂停（RAF/定时器随页面可见性暂停） --- */
    function handleVisibility() {
      state.visible = !document.hidden;
      if (state.visible) {
        // 重新显示时刷新指示条位置（可能因布局变化位移）
        updateIndicator();
      }
    }
    document.addEventListener('visibilitychange', handleVisibility);

    /* --- 窗口尺寸变化时更新指示条 --- */
    var resizeTimer = null;
    function handleResize() {
      if (state.destroyed) return;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (!state.destroyed && state.visible) {
          updateIndicator();
        }
      }, 100);
    }
    window.addEventListener('resize', handleResize);

    /* --- 公共 API --- */
    var api = {
      setPage: function (page) {
        goToPage(page);
        return this;
      },
      setTotal: function (total) {
        state.total = Math.max(0, parseInt(total) || 0);
        state.totalPages = null;  // 改用 total 计算
        render();
        return this;
      },
      setTotalPages: function (totalPages) {
        state.totalPages = Math.max(1, parseInt(totalPages) || 1);
        render();
        return this;
      },
      setPageSize: function (size) {
        var newSize = parseInt(size);
        if (isNaN(newSize) || newSize <= 0) return this;
        var firstItemIndex = (state.current - 1) * state.pageSize + 1;
        state.pageSize = newSize;
        var newTotalPages = getTotalPages();
        state.current = clamp(Math.ceil(firstItemIndex / newSize), 1, newTotalPages);
        render();
        triggerChange();
        return this;
      },
      setLoading: function (loading) {
        state.loading = !!loading;
        render();
        if (typeof opts.onLoadingChange === 'function') {
          try { opts.onLoadingChange(state.loading); } catch (e) {}
        }
        return this;
      },
      getState: function () {
        return {
          current: state.current,
          pageSize: state.pageSize,
          total: state.total,
          totalPages: getTotalPages(),
          loading: state.loading,
        };
      },
      onChange: function (fn) {
        opts.onChange = fn;
        return this;
      },
      refresh: function () {
        render();
        return this;
      },
      destroy: function () {
        if (state.destroyed) return;
        state.destroyed = true;

        clearTimeout(bumpTimer);
        clearTimeout(shakeTimer);
        clearTimeout(errorHideTimer);
        clearTimeout(resizeTimer);

        pageList.removeEventListener('click', handlePageListClick);
        prevBtn.removeEventListener('click', handlePrev);
        nextBtn.removeEventListener('click', handleNext);
        root.removeEventListener('keydown', handleKeydown);
        document.removeEventListener('visibilitychange', handleVisibility);
        window.removeEventListener('resize', handleResize);

        if (container.contains(root)) {
          container.removeChild(root);
        }
      },
    };

    /* --- 初始渲染 --- */
    render();

    return api;
  }

  /* ---------- 导出 ---------- */
  global.initPagination = initPagination;

  // 同时暴露到 ES module 风格（若环境支持）
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = initPagination;
  }

})(typeof window !== 'undefined' ? window : this);

/* ============================================================
 * 组件 JS 结束
 * ============================================================ */
