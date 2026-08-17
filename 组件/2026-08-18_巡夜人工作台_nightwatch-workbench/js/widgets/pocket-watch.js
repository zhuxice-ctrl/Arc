/* ============================================
   展区 4：怀表上弦旋钮
   按住表冠拖拽旋转上弦，发条阻尼渐增
   物理模型：旋转阻尼 + 发条松紧度 + 指针走动
   ============================================ */

(function () {
  'use strict';

  var scene = null;
  var watchCrown = null;
  var hourHand = null;
  var minuteHand = null;
  var gaugeFill = null;
  var dialNumerals = null;
  var tickRipples = null;

  // 状态
  var isDragging = false;
  var currentAngle = 0;    // 表冠当前旋转角度
  var startAngle = 0;
  var startMouseAngle = 0;
  var lastAngle = 0;
  var lastTime = 0;
  var angularVelocity = 0;

  // 发条松紧度 0-100
  var springTension = 0;
  var MAX_TENSION = 100;

  // 指针角度
  var hourAngle = -90;     // 起点在 9 点位置（-90度），对应 9:00
  var minuteAngle = 0;     // 分针从 12 点开始

  // 自动走时
  var autoTickTimer = null;

  // 滴答波纹池
  var ripplePool = [];

  function init() {
    scene = document.getElementById('scene-pocket-watch');
    if (!scene) return;

    watchCrown = document.getElementById('watch-crown');
    hourHand = document.getElementById('hour-hand');
    minuteHand = document.getElementById('minute-hand');
    gaugeFill = document.getElementById('gauge-fill');
    dialNumerals = document.getElementById('dial-numerals');
    tickRipples = document.getElementById('tick-ripples');

    // 创建表盘刻度数字
    createDialNumerals();

    // 绑定事件
    watchCrown.addEventListener('mousedown', onDragStart);
    watchCrown.addEventListener('touchstart', onDragStart, { passive: false });

    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('mouseup', onDragEnd);
    document.addEventListener('touchend', onDragEnd);
    document.addEventListener('touchcancel', onDragEnd);

    watchCrown.setAttribute('data-interactive', 'true');

    // 初始指针位置
    updateHands();
    updateGauge();

    // 启动动画循环
    NW.AnimManager.add('pocket-watch', update);
  }

  function createDialNumerals() {
    var numerals = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
    var radius = 48;

    for (var i = 0; i < 12; i++) {
      var angle = (i * 30 - 90) * Math.PI / 180;
      var x = Math.cos(angle) * radius;
      var y = Math.sin(angle) * radius;

      var num = document.createElement('span');
      num.className = 'dial-numeral';
      num.textContent = numerals[i];
      num.style.transform = 'translate(' + x + 'px, ' + y + 'px) translate(-50%, -50%)';
      dialNumerals.appendChild(num);
    }
  }

  function onDragStart(e) {
    e.preventDefault();
    isDragging = true;
    NW.Cursor.setDragging(true);
    angularVelocity = 0;

    var clientX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
    var clientY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY;

    var crownCenter = NW.Utils.getCenter(watchCrown);
    startMouseAngle = Math.atan2(clientY - crownCenter.y, clientX - crownCenter.x);
    startAngle = currentAngle;
    lastAngle = currentAngle;
    lastTime = performance.now();
  }

  function onDragMove(e) {
    if (!isDragging) return;
    e.preventDefault();

    var clientX = e.clientX !== undefined ? e.clientX :
                  (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    var clientY = e.clientY !== undefined ? e.clientY :
                  (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

    var crownCenter = NW.Utils.getCenter(watchCrown);
    var currentMouseAngle = Math.atan2(clientY - crownCenter.y, clientX - crownCenter.x);

    var angleDiff = currentMouseAngle - startMouseAngle;
    var newAngle = startAngle + angleDiff * 180 / Math.PI;

    // 计算角速度
    var now = performance.now();
    var dt = Math.max(now - lastTime, 1);
    angularVelocity = (newAngle - lastAngle) / dt * 16;

    // 发条越紧，阻力越大（角度变化越小）
    var dampingFactor = 1 - (springTension / MAX_TENSION) * 0.6;
    var actualDelta = (newAngle - currentAngle) * dampingFactor;
    currentAngle += actualDelta;

    // 更新发条
    // 顺时针旋转增加发条
    var rotationAmount = Math.abs(actualDelta);
    if (Math.abs(angularVelocity) > 0.1) {
      // 只有顺时针才上弦（简化：两边都上，让用户体验更好）
      if (springTension < MAX_TENSION) {
        springTension = Math.min(MAX_TENSION, springTension + rotationAmount * 0.05);
        updateGauge();

        // 滴答效果
        if (Math.floor(currentAngle / 30) !== Math.floor(lastAngle / 30)) {
          triggerTickRipple();
          advanceHands();
        }
      }
    }

    lastAngle = newAngle;
    lastTime = now;
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    NW.Cursor.setDragging(false);
    // 松开后，表冠回弹一点点（发条反馈）
    if (springTension > 0) {
      angularVelocity = -angularVelocity * 0.2;
    }
  }

  function update() {
    if (!isDragging) {
      // 表冠惯性
      if (Math.abs(angularVelocity) > 0.05) {
        currentAngle += angularVelocity;
        angularVelocity *= 0.9;
      } else {
        angularVelocity = 0;
      }
    }

    // 更新表冠显示
    watchCrown.style.transform =
      'translateY(-50%) rotate(' + currentAngle + 'deg)';
  }

  function advanceHands() {
    // 上弦时指针走动
    // 分针走一小格（6度）
    minuteAngle += 6;
    if (minuteAngle >= 360) minuteAngle -= 360;

    // 时针按比例走
    hourAngle += 6 / 12; // 分针走 6 度，时针走 0.5 度

    updateHands();
  }

  function updateHands() {
    hourHand.style.transform = 'translateX(-50%) rotate(' + hourAngle + 'deg)';
    minuteHand.style.transform = 'translateX(-50%) rotate(' + minuteAngle + 'deg)';
  }

  function updateGauge() {
    gaugeFill.style.width = springTension + '%';
  }

  function triggerTickRipple() {
    if (NW.reducedMotion) return;

    var ripple = document.createElement('div');
    ripple.className = 'tick-ripple';
    tickRipples.appendChild(ripple);

    var duration = 800;
    ripple.style.transition = 'all ' + duration + 'ms ease-out';

    NW.TimerManager.set(function () {
      ripple.style.opacity = '1';
      ripple.style.transform = 'translate(-50%, -50%) scale(3)';
      ripple.style.width = '40px';
      ripple.style.height = '40px';
    }, 16);

    NW.TimerManager.set(function () {
      ripple.style.opacity = '0';
    }, duration * 0.6);

    NW.TimerManager.set(function () {
      if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
    }, duration);
  }

  NW.Widgets = NW.Widgets || {};
  NW.Widgets.pocketWatch = { init: init };

})();
