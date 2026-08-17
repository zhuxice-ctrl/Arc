/* ============================================
   展区 5：磁吸巡更牌
   拖拽铜质圆牌靠近挂钉，磁吸吸附归位
   物理模型：反平方引力 + 惯性 + 弹簧回弹 + 阻尼
   ============================================ */

(function () {
  'use strict';

  var scene = null;
  var patrolTag = null;
  var wallPeg = null;
  var pegMagnet = null;
  var magneticField = null;
  var trailDots = null;

  // 状态
  var isDragging = false;
  var isHooked = false;

  // 位置
  var tagX = 0;
  var tagY = 0;
  var targetX = 0;
  var targetY = 0;
  var velX = 0;
  var velY = 0;

  // 拖拽偏移
  var dragOffsetX = 0;
  var dragOffsetY = 0;

  // 物理参数
  var MAGNET_STRENGTH = 8000;   // 磁力强度
  var MAGNET_MIN_DIST = 20;     // 磁力最小距离（防止无限大）
  var MAGNET_RANGE = 100;       // 磁力生效范围
  var HOOK_DISTANCE = 15;       // 挂接判定距离
  var DAMPING = 0.88;           // 阻尼
  var BOUNCE = 0.3;             // 回弹系数

  // 挂钉位置（场景内相对坐标）
  var pegX = 0;
  var pegY = 0;

  // 轨迹点
  var trailHistory = [];
  var MAX_TRAIL = 8;

  function init() {
    scene = document.getElementById('scene-magnetic-tag');
    if (!scene) return;

    patrolTag = document.getElementById('patrol-tag');
    wallPeg = document.getElementById('wall-peg');
    pegMagnet = document.getElementById('peg-magnet');
    magneticField = document.getElementById('magnetic-field');
    trailDots = document.getElementById('trail-dots');

    // 初始化位置
    updatePegPosition();
    // 初始位置：左下角
    var sceneRect = scene.getBoundingClientRect();
    tagX = 90;
    tagY = 180;
    updateTagPosition();

    // 绑定事件
    patrolTag.addEventListener('mousedown', onDragStart);
    patrolTag.addEventListener('touchstart', onDragStart, { passive: false });

    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('mouseup', onDragEnd);
    document.addEventListener('touchend', onDragEnd);
    document.addEventListener('touchcancel', onDragEnd);

    // 窗口大小变化时更新挂钉位置
    window.addEventListener('resize', updatePegPosition);

    patrolTag.setAttribute('data-interactive', 'true');

    // 启动动画循环
    NW.AnimManager.add('magnetic-tag', update);
  }

  function updatePegPosition() {
    var sceneRect = scene.getBoundingClientRect();
    pegX = sceneRect.width / 2;
    pegY = sceneRect.height / 2;
  }

  function onDragStart(e) {
    e.preventDefault();
    e.stopPropagation();
    isDragging = true;
    isHooked = false;
    patrolTag.classList.remove('hooked');
    patrolTag.classList.add('dragging');
    NW.Cursor.setDragging(true);

    var clientX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
    var clientY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY;

    var sceneRect = scene.getBoundingClientRect();
    var mouseX = clientX - sceneRect.left;
    var mouseY = clientY - sceneRect.top;

    dragOffsetX = tagX - mouseX;
    dragOffsetY = tagY - mouseY;

    velX = 0;
    velY = 0;
    trailHistory = [];
  }

  function onDragMove(e) {
    if (!isDragging) return;
    e.preventDefault();

    var clientX = e.clientX !== undefined ? e.clientX :
                  (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    var clientY = e.clientY !== undefined ? e.clientY :
                  (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

    var sceneRect = scene.getBoundingClientRect();
    targetX = clientX - sceneRect.left + dragOffsetX;
    targetY = clientY - sceneRect.top + dragOffsetY;

    // 约束在场景内
    var tagSize = 56;
    targetX = NW.Physics.clamp(targetX, tagSize / 2, sceneRect.width - tagSize / 2);
    targetY = NW.Physics.clamp(targetY, tagSize / 2, sceneRect.height - tagSize / 2);
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    patrolTag.classList.remove('dragging');
    NW.Cursor.setDragging(false);
    // 释放后，物理引擎接管
  }

  function update() {
    var dist = NW.Utils.distance(tagX, tagY, pegX, pegY);
    var inMagnetRange = dist < MAGNET_RANGE;

    // 更新磁力场视觉
    if (inMagnetRange || isDragging) {
      magneticField.classList.add('active');
      pegMagnet.classList.add('active');
    } else {
      magneticField.classList.remove('active');
      pegMagnet.classList.remove('active');
    }

    if (isDragging) {
      // 拖拽中，平滑跟随鼠标
      var prevX = tagX;
      var prevY = tagY;

      tagX += (targetX - tagX) * 0.4;
      tagY += (targetY - tagY) * 0.4;

      // 计算速度
      velX = tagX - prevX;
      velY = tagY - prevY;

      // 添加轨迹点
      addTrailPoint(tagX, tagY);
    } else {
      // 物理模拟
      var dist = NW.Utils.distance(tagX, tagY, pegX, pegY);

      // 磁力（反平方律）
      if (dist < MAGNET_RANGE && dist > 1) {
        var force = NW.Physics.magneticForce(dist, MAGNET_STRENGTH, MAGNET_MIN_DIST);
        var angle = Math.atan2(pegY - tagY, pegX - tagX);

        velX += Math.cos(angle) * force * 0.01;
        velY += Math.sin(angle) * force * 0.01;
      }

      // 阻尼
      velX *= DAMPING;
      velY *= DAMPING;

      // 更新位置
      tagX += velX;
      tagY += velY;

      // 添加轨迹点（速度足够时）
      var speed = Math.sqrt(velX * velX + velY * velY);
      if (speed > 0.5) {
        addTrailPoint(tagX, tagY);
      }

      // 检测挂接
      if (dist < HOOK_DISTANCE && speed < 3) {
        isHooked = true;
        // 吸附到挂钉下方
        tagX = pegX;
        tagY = pegY + 25; // 挂在挂钉下方
        velX = 0;
        velY = 0;
        patrolTag.classList.add('hooked');
      }

      // 边界碰撞
      var sceneRect = scene.getBoundingClientRect();
      var tagSize = 56;
      var halfSize = tagSize / 2;

      if (tagX < halfSize) {
        tagX = halfSize;
        velX = -velX * BOUNCE;
      } else if (tagX > sceneRect.width - halfSize) {
        tagX = sceneRect.width - halfSize;
        velX = -velX * BOUNCE;
      }

      if (tagY < halfSize) {
        tagY = halfSize;
        velY = -velY * BOUNCE;
      } else if (tagY > sceneRect.height - halfSize) {
        tagY = sceneRect.height - halfSize;
        velY = -velY * BOUNCE;
      }
    }

    updateTagPosition();
    updateTrail();
  }

  function updateTagPosition() {
    patrolTag.style.left = (tagX - 28) + 'px'; // 56/2
    patrolTag.style.top = (tagY - 28) + 'px';
  }

  function addTrailPoint(x, y) {
    trailHistory.push({ x: x, y: y, age: 0 });
    if (trailHistory.length > MAX_TRAIL) {
      trailHistory.shift();
    }
  }

  function updateTrail() {
    // 清空并重建轨迹点
    while (trailDots.firstChild) {
      trailDots.removeChild(trailDots.firstChild);
    }

    for (var i = 0; i < trailHistory.length; i++) {
      var point = trailHistory[i];
      point.age += 0.1;

      var dot = document.createElement('div');
      dot.className = 'trail-dot';
      dot.style.left = point.x + 'px';
      dot.style.top = point.y + 'px';
      var alpha = (i / trailHistory.length) * 0.4;
      dot.style.opacity = alpha;
      dot.style.transform = 'translate(-50%, -50%) scale(' + (0.3 + i / trailHistory.length * 0.7) + ')';
      trailDots.appendChild(dot);
    }

    // 移除太老的点
    if (trailHistory.length > 0 && !isDragging) {
      var speed = Math.sqrt(velX * velX + velY * velY);
      if (speed < 0.3) {
        trailHistory.shift();
      }
    }
  }

  NW.Widgets = NW.Widgets || {};
  NW.Widgets.magneticTag = { init: init };

})();
