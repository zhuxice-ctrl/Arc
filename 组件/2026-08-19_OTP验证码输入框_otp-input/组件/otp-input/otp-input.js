/* ============================================================
 * OTP 验证码输入框 — otp-input.js
 * 纯 vanilla JS · 零依赖 · 自包含可抽取
 * 状态机：rest / hover / focus / active / disabled / loading / error / success / empty
 * 键盘可操作 · 粘贴整段 · 倒计时重发 · 错误抖动 · 成功反馈
 * ============================================================ */
(function (global) {
  'use strict';

  // ========== 工具函数 ==========
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  function rafThrottle(fn) {
    var ticking = false;
    var lastArgs = null;
    return function () {
      lastArgs = arguments;
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        fn.apply(null, lastArgs);
      });
    };
  }

  // ========== OTP 组件类 ==========
  function OtpInput(element, options) {
    if (!element) throw new Error('OtpInput: 需要一个根元素');
    this.root = element;
    this.opts = Object.assign({
      length: 6,
      label: '请输入验证码',
      sublabel: '',
      inputType: 'numeric',    // numeric | text
      mask: false,             // 是否默认遮罩
      resend: true,            // 是否显示重发
      resendSeconds: 60,       // 重发倒计时秒数
      autoSubmit: true,        // 填满自动提交
      validate: null,          // 自定义验证函数 (code) => boolean|string
      onSubmit: null,          // 提交回调
      onResend: null,          // 重发回调
      onInput: null,           // 输入回调
      theme: 'ink-copper',     // ink-copper | rice-paper | night-amber
    }, options || {});

    this.state = 'rest';       // rest | focus | loading | error | success | disabled
    this.code = '';
    this.activeIndex = 0;
    this.countdownTimer = null;
    this.countdownRemaining = 0;
    this._timers = [];         // 追踪所有定时器，便于清理
    this._visible = true;      // 页面可见性
    this._destroyed = false;

    this._init();
  }

  OtpInput.prototype._init = function () {
    this._buildDOM();
    this._bindEvents();
    this._setState('rest');

    // 页面可见性变化时暂停/恢复定时器
    var self = this;
    this._onVisibility = function () {
      self._visible = !document.hidden;
    };
    document.addEventListener('visibilitychange', this._onVisibility);
  };

  // ---------- DOM 构建 ----------
  OtpInput.prototype._buildDOM = function () {
    var opts = this.opts;
    var root = this.root;

    // 主题属性
    if (opts.theme && opts.theme !== 'ink-copper') {
      root.setAttribute('data-otp-theme', opts.theme);
    } else {
      root.setAttribute('data-otp-theme', 'ink-copper');
    }

    root.classList.add('otp');
    root.setAttribute('data-state', 'rest');
    root.setAttribute('data-focused', 'false');
    root.setAttribute('data-masked', opts.mask ? 'true' : 'false');

    // 标签
    if (opts.label) {
      var label = document.createElement('div');
      label.className = 'otp__label';
      label.textContent = opts.label;
      root.appendChild(label);
    }
    if (opts.sublabel) {
      var sub = document.createElement('div');
      sub.className = 'otp__sublabel';
      sub.textContent = opts.sublabel;
      root.appendChild(sub);
    }

    // 数字输入区容器
    var fields = document.createElement('div');
    fields.className = 'otp__fields';

    // 隐藏的真实 input（负责接收键盘输入）
    var realInput = document.createElement('input');
    realInput.className = 'otp__real-input';
    realInput.type = opts.inputType === 'numeric' ? 'tel' : 'text';
    realInput.inputMode = opts.inputType === 'numeric' ? 'numeric' : 'text';
    realInput.autoComplete = 'one-time-code';
    realInput.maxLength = opts.length;
    realInput.setAttribute('aria-label', opts.label || '验证码');
    realInput.setAttribute('role', 'textbox');
    fields.appendChild(realInput);
    this.realInput = realInput;

    // 生成数字格
    this.digits = [];
    for (var i = 0; i < opts.length; i++) {
      var digit = document.createElement('div');
      digit.className = 'otp__digit';
      digit.setAttribute('data-index', String(i));
      digit.setAttribute('data-filled', 'false');

      var caret = document.createElement('span');
      caret.className = 'otp__digit-caret';
      digit.appendChild(caret);

      var charEl = document.createElement('span');
      charEl.className = 'otp__digit-char';
      digit.appendChild(charEl);

      fields.appendChild(digit);
      this.digits.push(digit);
    }

    // 眼睛图标（显示/隐藏切换）
    var eyeBtn = document.createElement('button');
    eyeBtn.className = 'otp__toggle-visibility';
    eyeBtn.type = 'button';
    eyeBtn.setAttribute('aria-label', opts.mask ? '显示验证码' : '隐藏验证码');
    eyeBtn.innerHTML = this._eyeIcon(!opts.mask);
    fields.appendChild(eyeBtn);
    this.eyeBtn = eyeBtn;

    // 成功对勾（放在 fields 末尾）
    var checkWrap = document.createElement('span');
    checkWrap.className = 'otp__success-check';
    checkWrap.innerHTML = '<svg viewBox="0 0 24 24"><polyline points="4 12 10 18 20 6"></polyline></svg>';
    fields.appendChild(checkWrap);

    // 加载 spinner
    var spinner = document.createElement('span');
    spinner.className = 'otp__loading-spinner';
    fields.appendChild(spinner);

    root.appendChild(fields);
    this.fields = fields;

    // 底部：消息 + 重发
    var footer = document.createElement('div');
    footer.className = 'otp__footer';

    var msg = document.createElement('div');
    msg.className = 'otp__message';
    msg.textContent = '请输入 ' + opts.length + ' 位验证码';
    footer.appendChild(msg);
    this.message = msg;

    if (opts.resend) {
      var resendBtn = document.createElement('button');
      resendBtn.className = 'otp__resend';
      resendBtn.type = 'button';
      resendBtn.disabled = true;
      resendBtn.innerHTML =
        '<span class="otp__countdown-ring">' +
          '<svg viewBox="0 0 16 16">' +
            '<circle class="otp-ring-bg" cx="8" cy="8" r="6"></circle>' +
            '<circle class="otp-ring-fg" cx="8" cy="8" r="6"></circle>' +
          '</svg>' +
        '</span>' +
        '<span class="otp__resend-text"></span>';
      footer.appendChild(resendBtn);
      this.resendBtn = resendBtn;
      this.resendText = $('.otp__resend-text', resendBtn);
      this.ringFg = $('.otp-ring-fg', resendBtn);

      // 启动倒计时
      this._startCountdown(opts.resendSeconds);
    }

    root.appendChild(footer);
    this.footer = footer;

    // 初始高亮第一格
    this._updateActiveDigit();
  };

  OtpInput.prototype._eyeIcon = function (visible) {
    if (visible) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
    } else {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-10-7-10-7a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
    }
  };

  // ---------- 事件绑定 ----------
  OtpInput.prototype._bindEvents = function () {
    var self = this;

    // 点击组件 → 聚焦
    this.root.addEventListener('click', function (e) {
      if (self.state === 'disabled' || self.state === 'loading') return;
      // 眼睛按钮自己处理
      if (e.target.closest('.otp__toggle-visibility')) return;
      if (e.target.closest('.otp__resend')) return;
      self.focus();
    });

    // 真实 input 的输入事件
    this.realInput.addEventListener('input', function (e) {
      if (self.state === 'disabled' || self.state === 'loading') return;
      var val = self.realInput.value || '';

      // 过滤非数字
      if (self.opts.inputType === 'numeric') {
        val = val.replace(/\D/g, '');
      }

      var prevLen = self.code.length;
      var newLen = val.length;
      self.code = val.slice(0, self.opts.length);
      self.realInput.value = self.code;

      // 判断是输入还是删除
      if (newLen > prevLen) {
        // 新增字符（可能是粘贴）
        if (newLen - prevLen > 1) {
          // 粘贴了多个字符 → 级联效果
          self._renderAllDigits('pasted');
        } else {
          // 单字符输入
          var typedIdx = Math.min(prevLen, self.opts.length - 1);
          self._renderDigit(typedIdx, 'typed');
        }
      } else if (newLen < prevLen) {
        // 删除
        self._renderDigit(newLen, 'backspaced');
      }

      self.activeIndex = Math.min(self.code.length, self.opts.length - 1);
      self._updateActiveDigit();

      // 错误态下输入自动恢复
      if (self.state === 'error') {
        self._setState('rest');
        self._setMessage('');
      }

      // onInput 回调
      if (typeof self.opts.onInput === 'function') {
        self.opts.onInput(self.code);
      }

      // 填满自动提交
      if (self.opts.autoSubmit && self.code.length === self.opts.length) {
        self._doSubmit();
      }
    });

    // 聚焦 / 失焦
    this.realInput.addEventListener('focus', function () {
      self.root.setAttribute('data-focused', 'true');
      self.activeIndex = self.code.length < self.opts.length ? self.code.length : self.opts.length - 1;
      self._updateActiveDigit();
    });
    this.realInput.addEventListener('blur', function () {
      self.root.setAttribute('data-focused', 'false');
    });

    // 键盘导航
    this.realInput.addEventListener('keydown', function (e) {
      if (self.state === 'disabled' || self.state === 'loading') return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (self.activeIndex > 0) self.activeIndex--;
          self._updateActiveDigit();
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (self.activeIndex < self.opts.length - 1) self.activeIndex++;
          self._updateActiveDigit();
          break;
        case 'ArrowUp':
        case 'ArrowDown':
          e.preventDefault();
          break;
        case 'Home':
          e.preventDefault();
          self.activeIndex = 0;
          self._updateActiveDigit();
          break;
        case 'End':
          e.preventDefault();
          self.activeIndex = Math.min(self.code.length, self.opts.length - 1);
          self._updateActiveDigit();
          break;
        case 'Enter':
          e.preventDefault();
          if (self.code.length === self.opts.length) {
            self._doSubmit();
          }
          break;
        case 'Backspace':
          if (self.code.length === 0 && self.activeIndex === 0) {
            e.preventDefault();
            return;
          }
          break;
        case 'Delete':
          e.preventDefault();
          if (self.code.length > self.activeIndex) {
            self.code = self.code.slice(0, self.activeIndex) + self.code.slice(self.activeIndex + 1);
            self.realInput.value = self.code;
            self._renderDigit(self.activeIndex, 'backspaced');
            self._updateActiveDigit();
          }
          break;
        default:
          // 单字符键 → 在数字模式下过滤非数字
          if (self.opts.inputType === 'numeric' && e.key.length === 1) {
            if (!/^\d$/.test(e.key)) {
              e.preventDefault();
            }
          }
          break;
      }
    });

    // 粘贴
    this.realInput.addEventListener('paste', function (e) {
      if (self.state === 'disabled' || self.state === 'loading') {
        e.preventDefault();
        return;
      }
      // 让 input 事件处理
      setTimeout(function () {
        if (self.state === 'error') {
          self._setState('rest');
          self._setMessage('');
        }
      }, 0);
    });

    // 眼睛按钮
    if (this.eyeBtn) {
      this.eyeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var masked = self.root.getAttribute('data-masked') === 'true';
        var newMasked = !masked;
        self.root.setAttribute('data-masked', newMasked ? 'true' : 'false');
        self.eyeBtn.innerHTML = self._eyeIcon(!newMasked);
        self.eyeBtn.setAttribute('aria-label', newMasked ? '显示验证码' : '隐藏验证码');
        self.focus();
      });
    }

    // 重发按钮
    if (this.resendBtn) {
      this.resendBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (self.resendBtn.disabled) return;
        self._handleResend();
      });
    }

    // hover 状态（mouseenter/mouseleave 在根上）
    this.root.addEventListener('mouseenter', function () {
      if (self.state === 'disabled' || self.state === 'loading') return;
      if (window._otpCursor) window._otpCursor.setState('hover');
    });
    this.root.addEventListener('mouseleave', function () {
      if (window._otpCursor) window._otpCursor.setState('default');
    });
  };

  // ---------- 渲染 ----------
  OtpInput.prototype._renderAllDigits = function (animType) {
    for (var i = 0; i < this.digits.length; i++) {
      var digit = this.digits[i];
      var char = this.code[i] || '';
      var charEl = digit.querySelector('.otp__digit-char');
      charEl.textContent = char;
      digit.setAttribute('data-filled', char ? 'true' : 'false');
      if (animType === 'pasted' && char) {
        digit.setAttribute('data-pasted', 'true');
        this._clearAttrAfter(digit, 'data-pasted', 380 + i * 60);
      }
    }
  };

  OtpInput.prototype._renderDigit = function (index, animType) {
    if (index < 0 || index >= this.digits.length) return;
    var digit = this.digits[index];
    var char = this.code[index] || '';
    var charEl = digit.querySelector('.otp__digit-char');
    charEl.textContent = char;
    digit.setAttribute('data-filled', char ? 'true' : 'false');

    if (animType === 'typed' && char) {
      digit.setAttribute('data-just-typed', 'true');
      this._clearAttrAfter(digit, 'data-just-typed', 300);
    }
    if (animType === 'backspaced') {
      digit.setAttribute('data-backspaced', 'true');
      this._clearAttrAfter(digit, 'data-backspaced', 260);
    }
  };

  OtpInput.prototype._updateActiveDigit = function () {
    for (var i = 0; i < this.digits.length; i++) {
      var d = this.digits[i];
      if (i === this.activeIndex) {
        d.setAttribute('data-active', 'true');
      } else {
        d.removeAttribute('data-active');
      }
    }
  };

  OtpInput.prototype._clearAttrAfter = function (el, attr, ms) {
    var self = this;
    var t = setTimeout(function () {
      if (self._destroyed) return;
      el.removeAttribute(attr);
      var idx = self._timers.indexOf(t);
      if (idx > -1) self._timers.splice(idx, 1);
    }, ms);
    this._timers.push(t);
  };

  // ---------- 状态机 ----------
  OtpInput.prototype._setState = function (state) {
    if (this.state === state) return;
    this.state = state;
    this.root.setAttribute('data-state', state);

    if (state === 'rest' && this.code.length === 0) {
      this._setMessage('请输入 ' + this.opts.length + ' 位验证码');
    }
  };

  OtpInput.prototype._setMessage = function (text) {
    if (!this.message) return;
    this.message.textContent = text || '';
  };

  // ---------- 提交 ----------
  OtpInput.prototype._doSubmit = function () {
    var self = this;

    // 自定义验证
    if (typeof this.opts.validate === 'function') {
      var result = this.opts.validate(this.code);
      if (result === false) {
        this._setError('验证码错误，请重新输入');
        return;
      }
      if (typeof result === 'string' && result.length > 0) {
        this._setError(result);
        return;
      }
    }

    this._setState('loading');
    this._setMessage('验证中…');

    if (typeof this.opts.onSubmit === 'function') {
      // 回调可以返回 Promise
      var ret = this.opts.onSubmit(this.code);
      if (ret && typeof ret.then === 'function') {
        ret.then(function () {
          if (self._destroyed) return;
          self._setSuccess();
        }).catch(function (err) {
          if (self._destroyed) return;
          self._setError(err && err.message ? err.message : '验证失败，请重试');
        });
      }
    } else {
      // 无回调，直接模拟成功
      this._setTimeout(function () { self._setSuccess(); }, 800);
    }
  };

  OtpInput.prototype._setError = function (msg) {
    var self = this;
    this._setState('error');
    this._setMessage(msg);
    // 清空输入以便重新输入
    this.code = '';
    this.realInput.value = '';
    this.activeIndex = 0;
    this._renderAllDigits();
    this._updateActiveDigit();

    // 抖动结束后恢复聚焦
    this._setTimeout(function () {
      if (self._destroyed) return;
      self._setState('rest');
      self._setMessage('');
      self.focus();
    }, 560);
  };

  OtpInput.prototype._setSuccess = function () {
    this._setState('success');
    this._setMessage('验证成功');
    this.realInput.blur();
  };

  // ---------- 倒计时 ----------
  OtpInput.prototype._startCountdown = function (seconds) {
    var self = this;
    this._clearCountdown();
    this.countdownRemaining = seconds;
    if (this.resendBtn) this.resendBtn.disabled = true;
    this._updateCountdownUI();

    this.countdownTimer = setInterval(function () {
      if (self._destroyed) return;
      if (!self._visible) return; // 页面不可见时暂停
      self.countdownRemaining--;
      self._updateCountdownUI();
      if (self.countdownRemaining <= 0) {
        self._clearCountdown();
        if (self.resendBtn) {
          self.resendBtn.disabled = false;
          self.resendText.textContent = '重新发送';
        }
      }
    }, 1000);
  };

  OtpInput.prototype._updateCountdownUI = function () {
    if (!this.resendText) return;
    this.resendText.textContent = this.countdownRemaining + 's 后重发';
    if (this.ringFg) {
      var total = this.opts.resendSeconds;
      var progress = this.countdownRemaining / total;
      var circumference = 37.7;
      this.ringFg.style.strokeDashoffset = String(circumference * (1 - progress));
    }
  };

  OtpInput.prototype._clearCountdown = function () {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
  };

  OtpInput.prototype._handleResend = function () {
    if (typeof this.opts.onResend === 'function') {
      var ret = this.opts.onResend();
      if (ret && typeof ret.then === 'function') {
        var self = this;
        ret.then(function () {
          if (self._destroyed) return;
          self._startCountdown(self.opts.resendSeconds);
          self._setMessage('验证码已重新发送');
        }).catch(function (err) {
          if (self._destroyed) return;
          self._setMessage(err && err.message ? err.message : '发送失败，请稍后重试');
        });
      }
    } else {
      this._startCountdown(this.opts.resendSeconds);
      this._setMessage('验证码已重新发送');
    }
  };

  // ---------- 定时器管理 ----------
  OtpInput.prototype._setTimeout = function (fn, ms) {
    var self = this;
    var t = setTimeout(function () {
      if (self._destroyed) return;
      fn();
      var idx = self._timers.indexOf(t);
      if (idx > -1) self._timers.splice(idx, 1);
    }, ms);
    this._timers.push(t);
    return t;
  };

  // ---------- 公开 API ----------
  OtpInput.prototype.focus = function () {
    if (this.state === 'disabled' || this.state === 'loading') return;
    try { this.realInput.focus(); } catch (e) {}
  };

  OtpInput.prototype.blur = function () {
    try { this.realInput.blur(); } catch (e) {}
  };

  OtpInput.prototype.getValue = function () {
    return this.code;
  };

  OtpInput.prototype.setValue = function (val) {
    val = String(val || '');
    if (this.opts.inputType === 'numeric') val = val.replace(/\D/g, '');
    this.code = val.slice(0, this.opts.length);
    this.realInput.value = this.code;
    this._renderAllDigits();
    this.activeIndex = Math.min(this.code.length, this.opts.length - 1);
    this._updateActiveDigit();
  };

  OtpInput.prototype.clear = function () {
    this.setValue('');
    this._setState('rest');
    this._setMessage('');
  };

  OtpInput.prototype.setError = function (msg) {
    this._setError(msg);
  };

  OtpInput.prototype.setSuccess = function () {
    this._setSuccess();
  };

  OtpInput.prototype.setDisabled = function (disabled) {
    if (disabled) {
      this._setState('disabled');
      this.realInput.disabled = true;
    } else {
      this._setState('rest');
      this.realInput.disabled = false;
    }
  };

  OtpInput.prototype.setTheme = function (theme) {
    this.root.setAttribute('data-otp-theme', theme);
    this.opts.theme = theme;
  };

  OtpInput.prototype.destroy = function () {
    this._destroyed = true;
    this._clearCountdown();
    for (var i = 0; i < this._timers.length; i++) {
      clearTimeout(this._timers[i]);
    }
    this._timers = [];
    document.removeEventListener('visibilitychange', this._onVisibility);
    this.root.innerHTML = '';
    this.root.classList.remove('otp');
  };

  // ========== 自定义光标 ==========
  function CustomCursor() {
    this.el = null;
    this.state = 'default';
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
    this.targetX = this.x;
    this.targetY = this.y;
    this._rafId = null;
    this._visible = true;
    this._trails = [];
    this._trailTimer = null;
    this._reducedMotion = false;

    this._init();
  }

  CustomCursor.prototype._init = function () {
    // 减少动效偏好检查
    this._reducedMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var cursor = document.createElement('div');
    cursor.className = 'otp-custom-cursor';
    cursor.setAttribute('data-state', 'default');
    cursor.innerHTML =
      '<span class="otp-custom-cursor__ring"></span>' +
      '<span class="otp-custom-cursor__dot"></span>';
    document.body.appendChild(cursor);
    this.el = cursor;
    this.ring = cursor.querySelector('.otp-custom-cursor__ring');
    this.dot = cursor.querySelector('.otp-custom-cursor__dot');

    var self = this;

    // 鼠标移动（直接 DOM 操作，高频）
    var onMove = rafThrottle(function (e) {
      self.targetX = e.clientX;
      self.targetY = e.clientY;
    });
    document.addEventListener('mousemove', onMove);
    this._onMove = onMove;

    // 点击
    document.addEventListener('mousedown', function () {
      self.setState('click');
    });
    document.addEventListener('mouseup', function () {
      self.setState('default');
    });

    // 鼠标离开窗口
    document.addEventListener('mouseleave', function () {
      self.el.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function () {
      self.el.style.opacity = '1';
    });

    // 页面可见性
    this._onVisibility = function () {
      self._visible = !document.hidden;
      if (self._visible) {
        self._startRAF();
      } else {
        self._stopRAF();
      }
    };
    document.addEventListener('visibilitychange', this._onVisibility);

    this._startRAF();
  };

  CustomCursor.prototype.setState = function (state) {
    if (this.state === state) return;
    this.state = state;
    if (this.el) this.el.setAttribute('data-state', state);
  };

  CustomCursor.prototype._startRAF = function () {
    if (this._rafId) return;
    var self = this;
    function tick() {
      if (!self._visible) { self._rafId = null; return; }
      // 缓动跟随
      self.x += (self.targetX - self.x) * 0.18;
      self.y += (self.targetY - self.y) * 0.18;
      self.el.style.transform =
        'translate(' + self.x + 'px, ' + self.y + 'px) translate(-50%, -50%)';
      self._rafId = requestAnimationFrame(tick);
    }
    this._rafId = requestAnimationFrame(tick);
  };

  CustomCursor.prototype._stopRAF = function () {
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  };

  CustomCursor.prototype.destroy = function () {
    this._stopRAF();
    document.removeEventListener('visibilitychange', this._onVisibility);
    if (this._onMove) {
      document.removeEventListener('mousemove', this._onMove);
    }
    if (this.el && this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
    }
    this.el = null;
  };

  // ========== 自动初始化 ==========
  function autoInit() {
    var elements = $$('[data-otp]');
    elements.forEach(function (el) {
      if (el._otpInstance) return;
      var opts = {};
      if (el.dataset.otpLength) opts.length = parseInt(el.dataset.otpLength, 10);
      if (el.dataset.otpLabel !== undefined) opts.label = el.dataset.otpLabel;
      if (el.dataset.otpTheme) opts.theme = el.dataset.otpTheme;
      if (el.dataset.otpMask !== undefined) opts.mask = el.dataset.otpMask === 'true';
      if (el.dataset.otpResend !== undefined) opts.resend = el.dataset.otpResend === 'true';
      if (el.dataset.otpSeconds) opts.resendSeconds = parseInt(el.dataset.otpSeconds, 10);
      el._otpInstance = new OtpInput(el, opts);
    });
  }

  // 暴露到全局
  global.OtpInput = OtpInput;
  global.OtpCustomCursor = CustomCursor;
  global.OtpInit = autoInit;

  // DOM 就绪后自动初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

})(window);
