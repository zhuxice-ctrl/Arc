/* ============================================
   展区 1：拉绳汽灯
   向下拖拽拉绳点亮灯泡，松手回弹
   物理模型：弹簧回弹 + 开关状态切换
   ============================================ */

(function () {
  'use strict';

  var scene = null;
  var ropeKnob = null;
  var ropePath = null;
  var ropeSvg = null;
  var lampBulb = null;
  var lampGlow = null;
  var deskShadow = null;

  // 状态
  var isOn = false;
  var isDragging = false;
  var dragStartY = 0;
  var knobStartY = 0;
  var currentOffset = 0; // 当前下拉距离（px）
  var velocity = 0;
  var lastY = 0;
  var lastTime = 0;

  // 物理参数
  var SPRING_STIFFNESS = 0.08;   // 弹簧刚度
  var SPRING_DAMPING = 0.85;     // 阻尼
  var TRIGGER_DISTANCE = 40;     // 触发开关的下拉距离
  var MAX_PULL = 80;             // 最大下拉距离

  // 动画循环
  var animating = false;

  function init() {
    scene = document.getElementById('scene-gas-lamp');
    if (!scene) return;

    ropeKnob = document.getElementById('rope-knob');
    ropePath = document.getElementById('rope-path');
    ropeSvg = document.getElementById('rope-svg');
    lampBulb = document.getElementById('lamp-bulb');
    lampGlow = document.getElementById('lamp-glow');
    deskShadow = document.getElementById('desk-shadow');

    // 初始绳子状态
    updateRope(0);

    // 绑定事件
    ropeKnob.addEventListener('mousedown', onDragStart);
    ropeKnob.addEventListener('touchstart', onDragStart, { passive: false });

    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('mouseup', onDragEnd);
    document.addEventListener('touchend', onDragEnd);
    document.addEventListener('touchcancel', onDragEnd);

    // 标记为可交互
    ropeKnob.setAttribute('data-interactive', 'true');
  }

  function onDragStart(e) {
    e.preventDefault();
    isDragging = true;
    NW.Cursor.setDragging(true);
    animating = true;

    var clientY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY;
    dragStartY = clientY;
    knobStartY = currentOffset;
    velocity = 0;
    lastY = clientY;
    lastTime = performance.now();

    NW.AnimManager.add('gaslamp-drag', onFrame);
  }

  function onDragMove(e) {
    if (!isDragging) return;
    e.preventDefault();

    var clientY = e.clientY !== undefined ? e.clientY :
                  (e.touches && e.touches[0] ? e.touches[0].clientY : lastY);

    var dy = clientY - dragStartY;
    currentOffset = NW.Physics.clamp(knobStartY + dy, 0, MAX_PULL);

    // 计算速度
    var now = performance.now();
    var dt = Math.max(now - lastTime, 1);
    velocity = (clientY - lastY) / dt * 16; // 归一化到 60fps 帧
    lastY = clientY;
    lastTime = now;
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    NW.Cursor.setDragging(false);

    // 检查是否触发开关
    if (currentOffset >= TRIGGER_DISTANCE) {
      isOn = !isOn;
      updateLampState();
    }

    // 开始弹簧回弹动画
    velocity *= 0.3; // 释放时衰减一点
    NW.AnimManager.add('gaslamp-spring', springBack);
  }

  function onFrame() {
    if (isDragging) {
      updateRope(currentOffset);
    }
  }

  function springBack() {
    // 弹簧回弹：向 0 位置回弹
    var accel = NW.Physics.springAccel(currentOffset, 0, SPRING_STIFFNESS, SPRING_DAMPING, velocity);
    velocity += accel;
    velocity *= 0.92; // 阻尼
    currentOffset += velocity;

    // 接近目标时停止
    if (Math.abs(currentOffset) < 0.5 && Math.abs(velocity) < 0.5) {
      currentOffset = 0;
      velocity = 0;
      NW.AnimManager.remove('gaslamp-spring');
      animating = false;
    }

    updateRope(Math.max(0, currentOffset));
  }

  function updateRope(offset) {
    // 更新拉绳把手位置
    ropeKnob.style.transform = 'translateX(-50%) translateY(' + offset + 'px)';

    // 更新绳子曲线路径
    // 绳子从顶部 (30, 0) 延伸到底部把手位置
    var totalHeight = 180 + offset;
    ropeSvg.setAttribute('viewBox', '0 0 60 ' + totalHeight);
    ropeSvg.style.height = totalHeight + 'px';

    // 绳子有轻微摆动（基于 offset 的微小形变）
    var sway = Math.sin(offset * 0.1) * (offset * 0.1);
    var midX = 30 + sway * 0.5;
    var midY = totalHeight * 0.5;

    var d = 'M30 0 Q' + midX + ' ' + midY + ' 30 ' + (totalHeight - 12);
    ropePath.setAttribute('d', d);
  }

  function updateLampState() {
    if (isOn) {
      lampBulb.classList.add('on');
      lampGlow.classList.add('on');
      deskShadow.classList.add('lit');
    } else {
      lampBulb.classList.remove('on');
      lampGlow.classList.remove('on');
      deskShadow.classList.remove('lit');
    }
  }

  // 暴露给全局
  NW.Widgets = NW.Widgets || {};
  NW.Widgets.gasLamp = { init: init };

})();
