/* ============================================================
 * 级联选择器 Cascader — 组件 JS
 * 命名空间：Cascader (构造函数) + cs- (DOM 类名)
 * 抽取指引：复制本文件全部内容到目标项目，
 *   1. 改数据源（options 或 fetchChildren）
 *   2. 改挂载点（new Cascader(挂载元素, 配置)）
 *   3. 主题变量在 CSS 里改
 * ============================================================ */

(function (global) {
  'use strict';

  /* ---- 工具函数 ---- */
  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function createEl(tag, className, attrs) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (attrs) {
      for (var key in attrs) {
        if (attrs.hasOwnProperty(key)) {
          if (key === 'text') {
            el.textContent = attrs[key];
          } else if (key === 'html') {
            el.innerHTML = attrs[key];
          } else if (key in el && typeof el[key] !== 'function' && key.indexOf('aria-') !== 0 && key.indexOf('data-') !== 0) {
            el[key] = attrs[key];
          } else {
            el.setAttribute(key, attrs[key]);
          }
        }
      }
    }
    return el;
  }

  function debounce(fn, wait) {
    var timer = null;
    return function () {
      var ctx = this, args = arguments;
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        timer = null;
        fn.apply(ctx, args);
      }, wait);
    };
  }

  function escapeReg(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function highlightText(text, keyword) {
    if (!keyword) return text;
    try {
      var re = new RegExp(escapeReg(keyword), 'gi');
      return text.replace(re, function (m) {
        return '<span class="cs-cascader__highlight">' + m + '</span>';
      });
    } catch (e) {
      return text;
    }
  }

  /* ---- SVG 图标 ---- */
  var SVG_NS = 'http://www.w3.org/2000/svg';

  function iconArrowDown() {
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'cs-cascader__arrow');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    var path = document.createElementNS(SVG_NS, 'polyline');
    path.setAttribute('points', '6 9 12 15 18 9');
    svg.appendChild(path);
    return svg;
  }

  function iconArrowRight() {
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'cs-cascader__option-arrow');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    var path = document.createElementNS(SVG_NS, 'polyline');
    path.setAttribute('points', '9 6 15 12 9 18');
    svg.appendChild(path);
    return svg;
  }

  function iconClose() {
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2.5');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('width', '10');
    svg.setAttribute('height', '10');
    var line1 = document.createElementNS(SVG_NS, 'line');
    line1.setAttribute('x1', '6');
    line1.setAttribute('y1', '6');
    line1.setAttribute('x2', '18');
    line1.setAttribute('y2', '18');
    svg.appendChild(line1);
    var line2 = document.createElementNS(SVG_NS, 'line');
    line2.setAttribute('x1', '18');
    line2.setAttribute('y1', '6');
    line2.setAttribute('x2', '6');
    line2.setAttribute('y2', '18');
    svg.appendChild(line2);
    return svg;
  }

  function iconCheck() {
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'cs-cascader__check');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2.5');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    var path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', 'M5 12l5 5L20 7');
    svg.appendChild(path);
    return svg;
  }

  function iconSearch() {
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'cs-cascader__search-icon');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    var c = document.createElementNS(SVG_NS, 'circle');
    c.setAttribute('cx', '11');
    c.setAttribute('cy', '11');
    c.setAttribute('r', '7');
    svg.appendChild(c);
    var line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', '21');
    line.setAttribute('y1', '21');
    line.setAttribute('x2', '16.65');
    line.setAttribute('y2', '16.65');
    svg.appendChild(line);
    return svg;
  }

  /* ============================================================
   * Cascader 构造函数
   * ============================================================ */
  function Cascader(container, options) {
    if (!container) return;

    this.container = typeof container === 'string'
      ? document.querySelector(container)
      : container;

    if (!this.container) return;

    // 配置合并
    this.options = this._mergeOptions(options || {});

    // 内部状态
    this.state = {
      isOpen: false,
      isFocused: false,
      isError: false,
      errorMessage: '',
      selectedPath: [],     // [{value, label, level}]
      activePath: [],       // 当前展开路径，存每项的 index
      hoverIndex: -1,       // 当前列的 hover 索引
      searchKeyword: '',
      searchResults: [],
      isSearching: false,
      isLoading: false,
      columnLoadStates: {}, // key: level_index, value: 'loading'|'error'|'idle'
      disabled: this.options.disabled,
    };

    // 定时器管理
    this._timers = {};
    this._visible = true;

    // 初始化
    this._init();
  }

  Cascader.prototype._mergeOptions = function (opts) {
    var defaults = {
      data: [],
      fetchChildren: null,    // function(parentNode, callback)  异步加载子级
      searchable: true,
      placeholder: '请选择',
      disabled: false,
      clearable: true,
      separator: ' / ',
      leafSeparator: ' · ',
      fieldNames: {
        label: 'label',
        value: 'value',
        children: 'children',
        isLeaf: 'isLeaf',
      },
      onChange: null,         // function(selectedPath, selectedOptions)
      onSelect: null,         // 每次点击选项时
      errorMessage: '',
    };

    var result = {};
    for (var key in defaults) {
      if (defaults.hasOwnProperty(key)) {
        result[key] = opts.hasOwnProperty(key) ? opts[key] : defaults[key];
      }
    }
    return result;
  };

  Cascader.prototype._init = function () {
    this._buildDOM();
    this._bindEvents();
    this._bindVisibility();
  };

  /* ---- DOM 构建 ---- */
  Cascader.prototype._buildDOM = function () {
    var c = this.container;
    c.classList.add('cs-cascader');
    if (this.state.disabled) c.classList.add('is-disabled');
    c.setAttribute('data-cascader', '');

    // 触发器
    var trigger = createEl('div', 'cs-cascader__trigger', {
      role: 'combobox',
      'aria-haspopup': 'listbox',
      'aria-expanded': 'false',
      tabindex: this.state.disabled ? '-1' : '0',
      'aria-autocomplete': 'list',
    });

    var input = createEl('span', 'cs-cascader__input', {
      text: this.options.placeholder,
    });
    input.setAttribute('aria-live', 'polite');
    input.setAttribute('aria-atomic', 'true');

    var suffix = createEl('span', 'cs-cascader__suffix');

    // 清除按钮
    var clearBtn = createEl('span', 'cs-cascader__clear', {
      role: 'button',
      tabindex: '-1',
      'aria-label': '清除选择',
    });
    clearBtn.appendChild(iconClose());

    // 箭头
    suffix.appendChild(clearBtn);
    suffix.appendChild(iconArrowDown());

    trigger.appendChild(input);
    trigger.appendChild(suffix);

    c.appendChild(trigger);

    // 弹层面板
    var panel = createEl('div', 'cs-cascader__panel', {
      role: 'dialog',
      'aria-label': '级联选择面板',
    });

    // 搜索区
    if (this.options.searchable) {
      var header = createEl('div', 'cs-cascader__panel-header');
      var searchWrap = createEl('div', 'cs-cascader__search');
      searchWrap.appendChild(iconSearch());
      var searchInput = createEl('input', 'cs-cascader__search-input', {
        type: 'text',
        placeholder: '搜索山场…',
        autocomplete: 'off',
        role: 'searchbox',
        'aria-label': '搜索选项',
      });
      searchWrap.appendChild(searchInput);
      header.appendChild(searchWrap);
      panel.appendChild(header);
    }

    // 面板主体（多列容器）
    var panelBody = createEl('div', 'cs-cascader__panel-body');
    panelBody.setAttribute('data-panel-body', '');
    panel.appendChild(panelBody);

    // 错误提示文字（表单校验用）
    var errorText = createEl('div', 'cs-cascader__error-text', {
      role: 'alert',
      'aria-live': 'assertive',
    });

    c.appendChild(panel);
    c.appendChild(errorText);

    // 引用保存
    this.trigger = trigger;
    this.input = input;
    this.panel = panel;
    this.panelBody = panelBody;
    this.clearBtn = clearBtn;
    this.errorText = errorText;
    this.searchInput = this.options.searchable ? $('.cs-cascader__search-input', panel) : null;

    // 初始渲染第一列
    this._renderColumns(0);
  };

  /* ---- 事件绑定 ---- */
  Cascader.prototype._bindEvents = function () {
    var self = this;

    // 触发器点击
    this.trigger.addEventListener('click', function (e) {
      if (self.state.disabled) return;
      // 如果点了清除按钮，不走打开逻辑
      if (e.target.closest('.cs-cascader__clear')) return;
      self.toggle();
    });

    // 清除按钮
    this.clearBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (self.state.disabled) return;
      self.clear();
    });

    // 触发器键盘
    this.trigger.addEventListener('keydown', function (e) {
      if (self.state.disabled) return;
      self._onTriggerKeydown(e);
    });

    // 焦点
    this.trigger.addEventListener('focus', function () {
      if (self.state.disabled) return;
      self.container.classList.add('is-focused');
      self.state.isFocused = true;
    });

    this.trigger.addEventListener('blur', function () {
      self.container.classList.remove('is-focused');
      self.state.isFocused = false;
    });

    // 面板键盘（搜索框等）
    this.panel.addEventListener('keydown', function (e) {
      self._onPanelKeydown(e);
    });

    // 搜索
    if (this.searchInput) {
      this.searchInput.addEventListener('input', debounce(function () {
        self._onSearch(self.searchInput.value);
      }, 150));

      this.searchInput.addEventListener('keydown', function (e) {
        self._onSearchKeydown(e);
      });
    }

    // 外部点击关闭
    this._outsideHandler = function (e) {
      if (!self.container.contains(e.target)) {
        self.close();
      }
    };
    document.addEventListener('mousedown', this._outsideHandler);

    // 鼠标滚轮在面板上阻止冒泡（简单处理）
    this.panelBody.addEventListener('wheel', function (e) {
      // 让正常滚动行为工作
    }, { passive: true });
  };

  Cascader.prototype._bindVisibility = function () {
    var self = this;
    this._visibilityHandler = function () {
      self._visible = !document.hidden;
      if (document.hidden) {
        // 隐藏时清除所有定时器
        self._clearAllTimers();
      }
    };
    document.addEventListener('visibilitychange', this._visibilityHandler);
  };

  /* ---- 定时器管理 ---- */
  Cascader.prototype._setTimer = function (key, fn, delay) {
    if (!this._visible) return;
    if (this._timers[key]) {
      clearTimeout(this._timers[key]);
    }
    var self = this;
    this._timers[key] = setTimeout(function () {
      delete self._timers[key];
      fn();
    }, delay);
  };

  Cascader.prototype._clearTimer = function (key) {
    if (this._timers[key]) {
      clearTimeout(this._timers[key]);
      delete this._timers[key];
    }
  };

  Cascader.prototype._clearAllTimers = function () {
    for (var key in this._timers) {
      if (this._timers.hasOwnProperty(key)) {
        clearTimeout(this._timers[key]);
      }
    }
    this._timers = {};
  };

  /* ---- 打开 / 关闭 ---- */
  Cascader.prototype.open = function () {
    if (this.state.disabled || this.state.isOpen) return;
    this.state.isOpen = true;
    this.container.classList.add('is-open');
    this.trigger.setAttribute('aria-expanded', 'true');

    // 如果有选中项，滚动到对应位置
    var self = this;
    this._setTimer('open-focus', function () {
      if (self.searchInput) {
        self.searchInput.focus();
      }
      self._scrollActiveIntoView();
    }, 50);
  };

  Cascader.prototype.close = function () {
    if (!this.state.isOpen) return;
    this.state.isOpen = false;
    this.container.classList.remove('is-open');
    this.trigger.setAttribute('aria-expanded', 'false');

    // 清空搜索
    if (this.searchInput) {
      this.searchInput.value = '';
    }
    this.state.searchKeyword = '';
    this.state.isSearching = false;
    this.state.searchResults = [];
    this.state.hoverIndex = -1;

    // 重新渲染回正常列模式
    this._renderColumns(0);

    // 焦点归还
    this._setTimer('close-focus', function () {
      this.trigger.focus();
    }.bind(this), 50);
  };

  Cascader.prototype.toggle = function () {
    if (this.state.isOpen) {
      this.close();
    } else {
      this.open();
    }
  };

  /* ---- 数据操作 ---- */
  Cascader.prototype._getChildren = function (parentNode, level, callback) {
    var fn = this.options.fieldNames;

    // 有子级数据直接返回
    if (parentNode && parentNode[fn.children] && parentNode[fn.children].length > 0) {
      callback(null, parentNode[fn.children]);
      return;
    }

    // 叶子节点
    if (parentNode && parentNode[fn.isLeaf]) {
      callback(null, []);
      return;
    }

    // 根级
    if (!parentNode) {
      callback(null, this.options.data || []);
      return;
    }

    // 异步加载
    if (typeof this.options.fetchChildren === 'function') {
      this.options.fetchChildren(parentNode, function (err, children) {
        if (err) {
          callback(err);
        } else {
          if (parentNode) parentNode[fn.children] = children || [];
          callback(null, children || []);
        }
      });
      return;
    }

    callback(null, []);
  };

  /* ---- 渲染列 ---- */
  Cascader.prototype._renderColumns = function (fromLevel) {
    var body = this.panelBody;
    var self = this;
    var fn = this.options.fieldNames;

    // 移除 fromLevel 及之后的列
    var columns = body.querySelectorAll('.cs-cascader__column');
    for (var i = columns.length - 1; i >= fromLevel; i--) {
      if (columns[i].parentNode) {
        columns[i].parentNode.removeChild(columns[i]);
      }
    }

    // 获取 fromLevel 对应的数据
    var parentNode = null;
    if (fromLevel > 0 && this.state.activePath.length >= fromLevel) {
      // 沿 activePath 找到父节点
      var currentList = this.options.data;
      for (var l = 0; l < fromLevel; l++) {
        var idx = this.state.activePath[l];
        if (currentList && currentList[idx]) {
          if (l === fromLevel - 1) {
            parentNode = currentList[idx];
          } else {
            currentList = currentList[idx][fn.children] || [];
          }
        } else {
          break;
        }
      }
    }

    // 加载该列数据
    var loadKey = 'col_' + fromLevel;
    this.state.columnLoadStates[fromLevel] = 'loading';

    // 创建列骨架
    var column = createEl('div', 'cs-cascader__column', {
      role: 'listbox',
      'aria-label': '第 ' + (fromLevel + 1) + ' 级选项',
      'aria-busy': 'true',
    });
    column.setAttribute('data-level', fromLevel);
    body.appendChild(column);

    // 加载动画
    var loadingEl = createEl('div', 'cs-cascader__loading');
    var spinner = createEl('div', 'cs-cascader__spinner');
    loadingEl.appendChild(spinner);
    column.appendChild(loadingEl);

    this._getChildren(parentNode, fromLevel, function (err, children) {
      if (!self._visible) return;

      // 列可能已经被移除了
      if (!column.parentNode) return;

      // 清除 loading
      column.removeAttribute('aria-busy');
      if (loadingEl.parentNode) {
        loadingEl.parentNode.removeChild(loadingEl);
      }

      if (err) {
        self.state.columnLoadStates[fromLevel] = 'error';
        self._renderColumnError(column, fromLevel, parentNode);
        return;
      }

      self.state.columnLoadStates[fromLevel] = 'idle';
      self._renderColumnOptions(column, children, fromLevel);
    });
  };

  Cascader.prototype._renderColumnOptions = function (column, options, level) {
    var self = this;
    var fn = this.options.fieldNames;

    // 清空内容
    column.innerHTML = '';

    if (!options || options.length === 0) {
      var empty = createEl('div', 'cs-cascader__empty', {
        text: '暂无数据',
      });
      column.appendChild(empty);
      return;
    }

    for (var i = 0; i < options.length; i++) {
      (function (opt, index) {
        var optionEl = createEl('div', 'cs-cascader__option', {
          role: 'option',
          'aria-selected': 'false',
          tabindex: '-1',
        });
        optionEl.setAttribute('data-index', index);
        optionEl.setAttribute('data-level', level);

        var label = createEl('span', 'cs-cascader__option-label', {
          text: opt[fn.label],
        });
        optionEl.appendChild(label);

        // 判断是否有子级
        var hasChildren = opt[fn.children] && opt[fn.children].length > 0;
        var isLeaf = opt[fn.isLeaf] || (!hasChildren && typeof self.options.fetchChildren !== 'function');

        if (!isLeaf || hasChildren) {
          optionEl.appendChild(iconArrowRight());
        }

        // 选中态（完整路径匹配）
        if (self._isOptionSelected(opt, level)) {
          optionEl.classList.add('is-selected');
          optionEl.setAttribute('aria-selected', 'true');
          optionEl.appendChild(iconCheck());
        }

        // 激活态（active path）
        if (self.state.activePath[level] === index) {
          optionEl.classList.add('is-active');
        }

        // 禁用
        if (opt.disabled) {
          optionEl.classList.add('is-disabled');
          optionEl.setAttribute('aria-disabled', 'true');
        }

        // 鼠标事件：高频直接操作 DOM
        optionEl.addEventListener('mouseenter', function () {
          self._setHoverOption(column, optionEl, level, index, opt);
        });

        optionEl.addEventListener('click', function (e) {
          e.preventDefault();
          if (opt.disabled) return;
          self._selectOption(level, index, opt);
        });

        column.appendChild(optionEl);
      })(options[i], i);
    }

    // 列渲染完，设置 activedescendant
    var activeIdx = this.state.activePath[level];
    if (typeof activeIdx === 'number' && activeIdx >= 0) {
      var activeEl = column.querySelector('.cs-cascader__option[data-index="' + activeIdx + '"]');
      if (activeEl) {
        this.trigger.setAttribute('aria-activedescendant', 'cs-option-' + level + '-' + activeIdx);
        // 给选项一个 id
        activeEl.id = 'cs-option-' + level + '-' + activeIdx;
      }
    }
  };

  Cascader.prototype._renderColumnError = function (column, level, parentNode) {
    var self = this;
    column.innerHTML = '';
    var errEl = createEl('div', 'cs-cascader__column-error', {
      text: '加载失败 · 点击重试',
      role: 'button',
      tabindex: '0',
      'aria-label': '加载失败，点击重试',
    });
    errEl.addEventListener('click', function () {
      self._retryLoadColumn(level, parentNode);
    });
    errEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        self._retryLoadColumn(level, parentNode);
      }
    });
    column.appendChild(errEl);
  };

  Cascader.prototype._retryLoadColumn = function (level, parentNode) {
    // 清掉已缓存的失败数据，重新加载
    var fn = this.options.fieldNames;
    if (parentNode && parentNode[fn.children]) {
      delete parentNode[fn.children];
    }
    this._renderColumns(level);
  };

  Cascader.prototype._setHoverOption = function (column, optionEl, level, index, opt) {
    // 移除同列其他 hover
    var opts = column.querySelectorAll('.cs-cascader__option');
    for (var i = 0; i < opts.length; i++) {
      opts[i].classList.remove('is-hover');
    }
    optionEl.classList.add('is-hover');
    this.state.hoverIndex = index;
  };

  Cascader.prototype._selectOption = function (level, index, opt) {
    var self = this;
    var fn = this.options.fieldNames;

    // 更新 activePath
    this.state.activePath = this.state.activePath.slice(0, level);
    this.state.activePath[level] = index;

    // 刷新列高亮
    var columns = this.panelBody.querySelectorAll('.cs-cascader__column');
    if (columns[level]) {
      var opts = columns[level].querySelectorAll('.cs-cascader__option');
      for (var i = 0; i < opts.length; i++) {
        opts[i].classList.remove('is-active');
        opts[i].classList.remove('is-hover');
      }
      var active = columns[level].querySelector('.cs-cascader__option[data-index="' + index + '"]');
      if (active) active.classList.add('is-active');
    }

    // 判断是否叶子
    var hasChildren = opt[fn.children] && opt[fn.children].length > 0;
    var isLeaf = opt[fn.isLeaf] || (!hasChildren && typeof this.options.fetchChildren !== 'function');

    // 触发 onSelect 回调
    if (typeof this.options.onSelect === 'function') {
      var pathOptions = this._getActivePathOptions();
      this.options.onSelect(pathOptions, level + 1);
    }

    if (isLeaf) {
      // 叶子：选中
      this._confirmSelection();
    } else {
      // 非叶子：展开下一列
      this._renderColumns(level + 1);
    }
  };

  Cascader.prototype._getActivePathOptions = function () {
    var result = [];
    var currentList = this.options.data;
    var fn = this.options.fieldNames;

    for (var l = 0; l < this.state.activePath.length; l++) {
      var idx = this.state.activePath[l];
      if (currentList && currentList[idx]) {
        result.push(currentList[idx]);
        currentList = currentList[idx][fn.children] || [];
      } else {
        break;
      }
    }
    return result;
  };

  Cascader.prototype._isOptionSelected = function (opt, level) {
    if (this.state.selectedPath.length !== this.state.activePath.length &&
        this.state.selectedPath.length <= level) return false;
    if (this.state.selectedPath.length <= level) return false;
    return this.state.selectedPath[level] &&
           this.state.selectedPath[level].value === opt[this.options.fieldNames.value];
  };

  Cascader.prototype._confirmSelection = function () {
    var pathOptions = this._getActivePathOptions();
    var pathValues = [];
    var pathLabels = [];
    var fn = this.options.fieldNames;

    for (var i = 0; i < pathOptions.length; i++) {
      pathValues.push(pathOptions[i][fn.value]);
      pathLabels.push(pathOptions[i][fn.label]);
    }

    this.state.selectedPath = pathOptions.map(function (o, i) {
      return { value: o[fn.value], label: o[fn.label], level: i };
    });

    this._updateInputDisplay();
    this.container.classList.add('has-value');
    this.clearError();

    // 重绘（更新打勾）
    this._renderColumns(0);

    if (typeof this.options.onChange === 'function') {
      this.options.onChange(pathValues, pathOptions);
    }

    this.close();
  };

  Cascader.prototype._updateInputDisplay = function () {
    var fn = this.options.fieldNames;
    var sep = this.options.separator;
    var leafSep = this.options.leafSeparator;

    if (this.state.selectedPath.length === 0) {
      this.input.textContent = this.options.placeholder;
      this.input.classList.remove('is-selected');
      this.container.classList.remove('has-value');
      return;
    }

    var labels = this.state.selectedPath.map(function (p) { return p.label; });
    // 最后两级用 · 分隔，其余用 /
    var displayText = '';
    if (labels.length <= 2) {
      displayText = labels.join(sep);
    } else {
      var first = labels.slice(0, labels.length - 1).join(sep);
      displayText = first + leafSep + labels[labels.length - 1];
    }

    this.input.textContent = displayText;
    this.input.classList.add('is-selected');
    this.input.setAttribute('title', displayText);
  };

  /* ---- 搜索 ---- */
  Cascader.prototype._onSearch = function (keyword) {
    keyword = (keyword || '').trim();
    this.state.searchKeyword = keyword;

    if (!keyword) {
      this.state.isSearching = false;
      this.state.searchResults = [];
      this._renderColumns(0);
      return;
    }

    this.state.isSearching = true;
    var results = this._searchData(keyword);
    this.state.searchResults = results;
    this._renderSearchResults(results);
  };

  Cascader.prototype._searchData = function (keyword) {
    var results = [];
    var fn = this.options.fieldNames;
    var kw = keyword.toLowerCase();

    function walk(list, path) {
      if (!list) return;
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var label = item[fn.label] || '';
        var newPath = path.concat([item]);

        if (label.toLowerCase().indexOf(kw) !== -1) {
          results.push({
            item: item,
            pathOptions: newPath,
            pathLabels: newPath.map(function (o) { return o[fn.label]; }),
          });
        }

        // 继续深入子级
        if (item[fn.children] && item[fn.children].length > 0) {
          walk(item[fn.children], newPath);
        }
      }
    }

    walk(this.options.data, []);
    return results.slice(0, 50); // 限制数量
  };

  Cascader.prototype._renderSearchResults = function (results) {
    var body = this.panelBody;
    body.innerHTML = '';

    var column = createEl('div', 'cs-cascader__column', {
      role: 'listbox',
      'aria-label': '搜索结果',
      style: 'flex: 1 1 auto; width: 100%;',
    });

    if (results.length === 0) {
      var empty = createEl('div', 'cs-cascader__empty', {
        text: '未找到匹配的山场',
        role: 'status',
      });
      column.appendChild(empty);
    } else {
      for (var i = 0; i < results.length; i++) {
        (function (result, index) {
          var optionEl = createEl('div', 'cs-cascader__option cs-cascader__option--search', {
            role: 'option',
            'aria-selected': 'false',
            tabindex: '-1',
          });
          optionEl.setAttribute('data-search-index', index);

          var label = createEl('span', 'cs-cascader__option-label', {
            html: highlightText(result.item[this.options.fieldNames.label], this.state.searchKeyword),
          });
          optionEl.appendChild(label);

          var path = createEl('span', 'cs-cascader__option-path', {
            html: result.pathLabels.slice(0, -1).join(' / '),
          });
          optionEl.appendChild(path);

          optionEl.addEventListener('mouseenter', function () {
            var all = column.querySelectorAll('.cs-cascader__option');
            for (var j = 0; j < all.length; j++) all[j].classList.remove('is-hover');
            optionEl.classList.add('is-hover');
            this.state.hoverIndex = index;
          }.bind(this));

          optionEl.addEventListener('click', function (e) {
            e.preventDefault();
            this._selectSearchResult(result);
          }.bind(this));

          column.appendChild(optionEl);
        }.call(this, results[i], i));
      }
    }

    body.appendChild(column);
    this.state.hoverIndex = -1;
  };

  Cascader.prototype._selectSearchResult = function (result) {
    var fn = this.options.fieldNames;
    var pathOptions = result.pathOptions;

    this.state.selectedPath = pathOptions.map(function (o, i) {
      return { value: o[fn.value], label: o[fn.label], level: i };
    });

    // 同步 activePath
    this.state.activePath = [];
    var currentList = this.options.data;
    for (var l = 0; l < pathOptions.length; l++) {
      var idx = currentList.indexOf(pathOptions[l]);
      if (idx >= 0) {
        this.state.activePath.push(idx);
        currentList = pathOptions[l][fn.children] || [];
      }
    }

    this._updateInputDisplay();
    this.container.classList.add('has-value');
    this.clearError();

    if (typeof this.options.onChange === 'function') {
      var values = pathOptions.map(function (o) { return o[fn.value]; });
      this.options.onChange(values, pathOptions);
    }

    this.close();
  };

  /* ---- 键盘操作 · 触发器 ---- */
  Cascader.prototype._onTriggerKeydown = function (e) {
    var handled = false;

    switch (e.key) {
      case 'ArrowDown':
      case 'Enter':
      case ' ':
        e.preventDefault();
        this.open();
        // 打开后把焦点放第一项
        this._moveHover(0, 0, 1);
        handled = true;
        break;

      case 'Escape':
        if (this.state.isOpen) {
          e.preventDefault();
          this.close();
          handled = true;
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (this.state.isOpen) {
          this._moveHover(0, -1, -1);
        } else {
          this.open();
        }
        handled = true;
        break;

      case 'Backspace':
      case 'Delete':
        if (this.state.selectedPath.length > 0) {
          e.preventDefault();
          this.clear();
          handled = true;
        }
        break;

      default:
        // typeahead：字符键跳转
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          if (!this.state.isOpen) {
            this.open();
          }
          this._typeahead(e.key);
          handled = true;
        }
        break;
    }

    return !handled;
  };

  Cascader.prototype._onPanelKeydown = function (e) {
    // 搜索框里不拦截字符输入
    if (e.target === this.searchInput && e.key.length === 1) {
      return;
    }

    var handled = false;
    var currentLevel = this.state.isSearching ? -1 : Math.max(0, this.state.activePath.length - 1);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (this.state.isSearching) {
          this._moveSearchHover(1);
        } else {
          this._moveHover(currentLevel, 1, 1);
        }
        handled = true;
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (this.state.isSearching) {
          this._moveSearchHover(-1);
        } else {
          this._moveHover(currentLevel, -1, -1);
        }
        handled = true;
        break;

      case 'ArrowRight':
        e.preventDefault();
        if (!this.state.isSearching) {
          this._expandCurrentOption();
        }
        handled = true;
        break;

      case 'ArrowLeft':
        e.preventDefault();
        if (!this.state.isSearching) {
          this._collapseToParent();
        }
        handled = true;
        break;

      case 'Enter':
        e.preventDefault();
        if (this.state.isSearching) {
          if (this.state.hoverIndex >= 0 && this.state.searchResults[this.state.hoverIndex]) {
            this._selectSearchResult(this.state.searchResults[this.state.hoverIndex]);
          }
        } else {
          this._confirmCurrentOption(currentLevel);
        }
        handled = true;
        break;

      case 'Escape':
        e.preventDefault();
        this.close();
        handled = true;
        break;

      case 'Tab':
        this.close();
        break;

      default:
        // typeahead
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && !this.state.isSearching) {
          this._typeahead(e.key, currentLevel);
          handled = true;
        }
        break;
    }

    return !handled;
  };

  Cascader.prototype._onSearchKeydown = function (e) {
    // 搜索框特殊处理：↓ 进入结果列表，Esc 清空搜索
    if (e.key === 'Escape') {
      if (this.searchInput.value) {
        e.preventDefault();
        this.searchInput.value = '';
        this._onSearch('');
        this.searchInput.focus();
      } else {
        this.close();
      }
    }
  };

  Cascader.prototype._moveHover = function (level, direction, step) {
    var columns = this.panelBody.querySelectorAll('.cs-cascader__column');
    var column = columns[level];
    if (!column) return;

    var opts = column.querySelectorAll('.cs-cascader__option:not(.is-disabled)');
    if (opts.length === 0) return;

    var currentIdx = -1;
    for (var i = 0; i < opts.length; i++) {
      if (opts[i].classList.contains('is-hover') || opts[i].classList.contains('is-active')) {
        currentIdx = i;
        break;
      }
    }

    var newIdx = currentIdx + step;
    if (newIdx < 0) newIdx = opts.length - 1;
    if (newIdx >= opts.length) newIdx = 0;

    // 移除 hover/active
    for (var j = 0; j < opts.length; j++) {
      opts[j].classList.remove('is-hover');
    }

    opts[newIdx].classList.add('is-hover');
    this.state.hoverIndex = parseInt(opts[newIdx].getAttribute('data-index'), 10);

    // 滚动到可视区
    this._scrollOptionIntoView(opts[newIdx], column);

    // 更新 aria-activedescendant
    var optIndex = opts[newIdx].getAttribute('data-index');
    var optId = 'cs-option-' + level + '-' + optIndex;
    opts[newIdx].id = optId;
    this.trigger.setAttribute('aria-activedescendant', optId);
  };

  Cascader.prototype._moveSearchHover = function (step) {
    var results = this.state.searchResults;
    if (results.length === 0) return;

    var currentIdx = this.state.hoverIndex;
    var newIdx = currentIdx + step;
    if (newIdx < 0) newIdx = results.length - 1;
    if (newIdx >= results.length) newIdx = 0;

    var column = this.panelBody.querySelector('.cs-cascader__column');
    if (!column) return;

    var opts = column.querySelectorAll('.cs-cascader__option');
    for (var i = 0; i < opts.length; i++) {
      opts[i].classList.remove('is-hover');
    }
    if (opts[newIdx]) {
      opts[newIdx].classList.add('is-hover');
      this._scrollOptionIntoView(opts[newIdx], column);
    }
    this.state.hoverIndex = newIdx;
  };

  Cascader.prototype._expandCurrentOption = function () {
    var level = this.state.activePath.length - 1;
    if (level < 0) level = 0;

    var columns = this.panelBody.querySelectorAll('.cs-cascader__column');
    var column = columns[level];
    if (!column) return;

    var hoverEl = column.querySelector('.cs-cascader__option.is-hover');
    if (!hoverEl) return;

    var idx = parseInt(hoverEl.getAttribute('data-index'), 10);
    var fn = this.options.fieldNames;

    // 找到对应数据
    var currentList = this.options.data;
    for (var l = 0; l < level; l++) {
      var pIdx = this.state.activePath[l];
      if (currentList && currentList[pIdx]) {
        currentList = currentList[pIdx][fn.children] || [];
      }
    }
    var opt = currentList[idx];
    if (!opt) return;

    this._selectOption(level, idx, opt);
  };

  Cascader.prototype._collapseToParent = function () {
    if (this.state.activePath.length <= 1) return;

    this.state.activePath.pop();
    var newLevel = this.state.activePath.length - 1;
    this._renderColumns(newLevel + 1);

    // 让上一列重新获得 hover
    var columns = this.panelBody.querySelectorAll('.cs-cascader__column');
    if (columns[newLevel]) {
      var idx = this.state.activePath[newLevel];
      var opt = columns[newLevel].querySelector('.cs-cascader__option[data-index="' + idx + '"]');
      if (opt) {
        opt.classList.add('is-hover');
        this.state.hoverIndex = idx;
      }
    }
  };

  Cascader.prototype._confirmCurrentOption = function (level) {
    var columns = this.panelBody.querySelectorAll('.cs-cascader__column');
    var column = columns[level];
    if (!column) return;

    var hoverEl = column.querySelector('.cs-cascader__option.is-hover');
    var activeEl = column.querySelector('.cs-cascader__option.is-active');
    var targetEl = hoverEl || activeEl;
    if (!targetEl) return;

    var idx = parseInt(targetEl.getAttribute('data-index'), 10);
    var fn = this.options.fieldNames;

    // 找到对应数据
    var currentList = this.options.data;
    for (var l = 0; l < level; l++) {
      var pIdx = this.state.activePath[l];
      if (currentList && currentList[pIdx]) {
        currentList = currentList[pIdx][fn.children] || [];
      }
    }
    var opt = currentList[idx];
    if (!opt) return;

    this._selectOption(level, idx, opt);
  };

  Cascader.prototype._typeahead = function (char, level) {
    if (level === undefined) level = 0;
    var columns = this.panelBody.querySelectorAll('.cs-cascader__column');
    var column = columns[level];
    if (!column) return;

    var opts = column.querySelectorAll('.cs-cascader__option:not(.is-disabled)');
    var ch = char.toLowerCase();

    // 从当前位置开始找
    var startIdx = this.state.hoverIndex + 1;
    if (startIdx >= opts.length) startIdx = 0;

    for (var i = 0; i < opts.length; i++) {
      var idx = (startIdx + i) % opts.length;
      var label = opts[idx].querySelector('.cs-cascader__option-label');
      if (label) {
        var text = label.textContent.trim().toLowerCase();
        if (text.charAt(0) === ch) {
          opts[idx].classList.add('is-hover');
          for (var j = 0; j < opts.length; j++) {
            if (j !== idx) opts[j].classList.remove('is-hover');
          }
          var optIndex = parseInt(opts[idx].getAttribute('data-index'), 10);
          this.state.hoverIndex = optIndex;
          this._scrollOptionIntoView(opts[idx], column);
          break;
        }
      }
    }
  };

  Cascader.prototype._scrollOptionIntoView = function (option, column) {
    if (!option || !column) return;
    var optTop = option.offsetTop;
    var optBottom = optTop + option.offsetHeight;
    var viewTop = column.scrollTop;
    var viewBottom = viewTop + column.clientHeight;

    if (optTop < viewTop) {
      column.scrollTop = optTop;
    } else if (optBottom > viewBottom) {
      column.scrollTop = optBottom - column.clientHeight;
    }
  };

  Cascader.prototype._scrollActiveIntoView = function () {
    var columns = this.panelBody.querySelectorAll('.cs-cascader__column');
    for (var i = 0; i < columns.length; i++) {
      var active = columns[i].querySelector('.cs-cascader__option.is-active');
      if (active) {
        this._scrollOptionIntoView(active, columns[i]);
      }
    }
  };

  /* ---- 公共 API ---- */
  Cascader.prototype.getValue = function () {
    return this.state.selectedPath.map(function (p) { return p.value; });
  };

  Cascader.prototype.getSelectedOptions = function () {
    return this._getActivePathOptions();
  };

  Cascader.prototype.clear = function () {
    this.state.selectedPath = [];
    this.state.activePath = [];
    this.state.hoverIndex = -1;
    this._updateInputDisplay();
    this.container.classList.remove('has-value');
    this._renderColumns(0);

    if (typeof this.options.onChange === 'function') {
      this.options.onChange([], []);
    }
  };

  Cascader.prototype.setError = function (message) {
    this.state.isError = true;
    this.state.errorMessage = message || '';
    this.container.classList.add('is-error');
    this.container.classList.add('is-shake');
    this.errorText.textContent = message || '';

    var self = this;
    this._setTimer('shake', function () {
      self.container.classList.remove('is-shake');
    }, 350);
  };

  Cascader.prototype.clearError = function () {
    this.state.isError = false;
    this.state.errorMessage = '';
    this.container.classList.remove('is-error');
    this.container.classList.remove('is-shake');
    this.errorText.textContent = '';
    this._clearTimer('shake');
  };

  Cascader.prototype.setDisabled = function (disabled) {
    this.state.disabled = !!disabled;
    if (disabled) {
      this.container.classList.add('is-disabled');
      this.trigger.setAttribute('tabindex', '-1');
      if (this.state.isOpen) this.close();
    } else {
      this.container.classList.remove('is-disabled');
      this.trigger.setAttribute('tabindex', '0');
    }
  };

  Cascader.prototype.setOptions = function (opts) {
    for (var key in opts) {
      if (opts.hasOwnProperty(key)) {
        this.options[key] = opts[key];
      }
    }
    if (opts.placeholder !== undefined) {
      this._updateInputDisplay();
    }
    if (opts.disabled !== undefined) {
      this.setDisabled(opts.disabled);
    }
  };

  Cascader.prototype.destroy = function () {
    this._clearAllTimers();
    document.removeEventListener('mousedown', this._outsideHandler);
    document.removeEventListener('visibilitychange', this._visibilityHandler);
    this.container.innerHTML = '';
    this.container.classList.remove('cs-cascader');
  };

  // 导出
  global.Cascader = Cascader;

})(typeof window !== 'undefined' ? window : this);
