/* ============================================
   展区 3：黄铜闸刀拨杆开关
   向上推合闸刀，触点火花，指示灯亮
   物理模型：铰链摆动 + 弹簧回弹 + 火花粒子
   ============================================ */

(function () {
  'use strict';

  var scene = null;
  var knifeLever = null;
  var leverHandle = null;
  var indicatorLight = null;
  var indicatorGlow = null;
  var leftTerminal = null;
  var rightTerminal = null;
  var sparkContainer = null;
  var mechRipples = null;

  // 状态
  var isOn = false;
  var isDragging = false;
  var currentAngle = -35;   // 当前角度（度），负为下
  var angularVelocity = 0;
  var lastY = 0;
  var lastAngle = 0;
  var lastTime = 0;
  var startY = 0;
  var startAngle = 0;

  // 角度范围
  var ANGLE_OFF = -35;   // 断开位置
  var ANGLE_ON = 35;     // 合闸位置
  var ANGLE_MAX = 50;    // 最大角度

  // 物理参数
  var SNAP_FORCE = 0.4;   // 吸附力
  var DAMPING = 0.85;     // 阻尼

  // 火花粒子池
  var sparks = [];

  function init() {
    scene = document.getElementById('scene-knife-switch');
    if (!scene) return;

    knifeLever = document.getElementById('knife-lever');
    leverHandle = document.getElementById('lever-handle');
    indicatorLight = document.getElementById('indicator-light');
    indicatorGlow = document.getElementById('indicator-glow');
    leftTerminal = document.getElementById('contact-left-terminal');
    rightTerminal = document.getElementById('contact-right-terminal');
    sparkContainer = document.getElementById('spark-container');
    mechRipples = document.getElementById('mech-ripples');

    // 绑定事件
    knifeLever.addEventListener('mousedown', onDragStart);
    knifeLever.addEventListener('touchstart', onDragStart, { passive: false });

    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('mouseup', onDragEnd);
    document.addEventListener('touchend', onDragEnd);
    document.addEventListener('touchcancel', onDragEnd);

    knifeLever.setAttribute('data-interactive', 'true');

    // 初始状态
    updateLever();

    // 启动动画循环
    NW.AnimManager.add('knife-switch', update);
  }

  function onDragStart(e) {
    e.preventDefault();
    isDragging = true;
    NW.Cursor.setDragging(true);
    angularVelocity = 0;

    var clientY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY;
    startY = clientY;
    startAngle = currentAngle;
    lastY = clientY;
    lastAngle = currentAngle;
    lastTime = performance.now();
  }

  function onDragMove(e) {
    if (!isDragging) return;
    e.preventDefault();

    var clientY = e.clientY !== undefined ? e.clientY :
                  (e.touches && e.touches[0] ? e.touches[0].clientY : lastY);

    // 向上拖动 → 角度增加（更闭合）
    var dy = startY - clientY; // 向上为正
    var angleDelta = dy * 0.8; // 灵敏度

    var newAngle = NW.Physics.clamp(startAngle + angleDelta, ANGLE_OFF - 10, ANGLE_MAX);

    // 计算角速度
    var now = performance.now();
    var dt = Math.max(now - lastTime, 1);
    angularVelocity = (newAngle - lastAngle) / dt * 16;

    lastAngle = newAngle;
    lastY = clientY;
    lastTime = now;

    currentAngle = newAngle;
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    NW.Cursor.setDragging(false);

    // 判断是否越过中线，决定吸附到哪一侧
    var midPoint = (ANGLE_OFF + ANGLE_ON) / 2;
    var wasOn = isOn;

    if (currentAngle > midPoint) {
      isOn = true;
      // 吸附到 ON 位置
    } else {
      isOn = false;
      // 吸附到 OFF 位置
    }

    // 状态变化时的效果
    if (wasOn !== isOn) {
      triggerSpark();
      triggerMechRipple();
    }
  }

  function update() {
    if (!isDragging) {
      // 吸附到目标位置
      var targetAngle = isOn ? ANGLE_ON : ANGLE_OFF;

      // 弹簧式吸附
      var accel = NW.Physics.springAccel(
        currentAngle, targetAngle, 0.15, 0.6, angularVelocity
      );
      angularVelocity += accel;
      angularVelocity *= DAMPING;
      currentAngle += angularVelocity;

      // 接近目标时锁定
      if (Math.abs(currentAngle - targetAngle) < 0.5 &&
          Math.abs(angularVelocity) < 0.3) {
        currentAngle = targetAngle;
        angularVelocity = 0;
      }
    }

    updateLever();
    updateIndicator();

    // 更新火花
    updateSparks();
  }

  function updateLever() {
    knifeLever.style.transform =
      'translateX(-50%) rotate(' + currentAngle + 'deg)';
  }

  function updateIndicator() {
    if (isOn) {
      indicatorLight.classList.add('on');
      leftTerminal.classList.add('energized');
      rightTerminal.classList.add('energized');
    } else {
      indicatorLight.classList.remove('on');
      leftTerminal.classList.remove('energized');
      rightTerminal.classList.remove('energized');
    }
  }

  function triggerSpark() {
    if (NW.reducedMotion) return;

    // 在右触点位置生成火花
    var terminalRect = rightTerminal.getBoundingClientRect();
    var sceneRect = scene.getBoundingClientRect();

    var sparkX = terminalRect.left + terminalRect.width / 2 - sceneRect.left;
    var sparkY = terminalRect.top + terminalRect.height / 2 - sceneRect.top;

    for (var i = 0; i < 8; i++) {
      createSpark(sparkX, sparkY);
    }
  }

  function createSpark(x, y) {
    var spark = document.createElement('div');
    spark.className = 'spark';
    spark.style.left = x + 'px';
    spark.style.top = y + 'px';

    var angle = NW.Utils.random(-Math.PI / 2, Math.PI / 2); // 向上扇形
    var speed = NW.Utils.random(30, 80);

    sparkContainer.appendChild(spark);

    sparks.push({
      el: spark,
      x: x,
      y: y,
      vx: Math.cos(angle) * speed * 0.3,
      vy: -Math.abs(Math.sin(angle) * speed),
      life: 1,
      decay: NW.Utils.random(0.03, 0.06)
    });
  }

  function updateSparks() {
    for (var i = sparks.length - 1; i >= 0; i--) {
      var s = sparks[i];
      s.vy += 0.5; // 重力
      s.x += s.vx * 0.05;
      s.y += s.vy * 0.05;
      s.life -= s.decay;

      if (s.life <= 0) {
        if (s.el.parentNode) s.el.parentNode.removeChild(s.el);
        sparks.splice(i, 1);
        continue;
      }

      s.el.style.transform =
        'translate(' + s.x + 'px, ' + s.y + 'px) scale(' + s.life + ')';
      s.el.style.opacity = s.life;
    }
  }

  function triggerMechRipple() {
    if (NW.reducedMotion) return;

    var ripple = document.createElement('div');
    ripple.className = 'mech-ripple';
    mechRipples.appendChild(ripple);

    // CSS 动画驱动
    var duration = 1200;
    ripple.style.transition = 'all ' + duration + 'ms cubic-bezier(0.25, 0.46, 0.45, 0.94)';

    // 触发下一帧开始动画
    NW.TimerManager.set(function () {
      ripple.style.opacity = '1';
      ripple.style.transform = 'translateX(-50%) scale(6)';
      ripple.style.width = '40px';
      ripple.style.height = '40px';
    }, 20);

    NW.TimerManager.set(function () {
      ripple.style.opacity = '0';
    }, duration * 0.6);

    NW.TimerManager.set(function () {
      if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
    }, duration);
  }

  NW.Widgets = NW.Widgets || {};
  NW.Widgets.knifeSwitch = { init: init };

})();
