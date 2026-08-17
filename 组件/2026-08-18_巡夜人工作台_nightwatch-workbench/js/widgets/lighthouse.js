/* ============================================
   展区 2：灯塔光束转盘
   拖拽旋转灯塔灯室，光束扫过海面
   物理模型：旋转惯性 + 阻尼衰减
   ============================================ */

(function () {
  'use strict';

  var scene = null;
  var towerLantern = null;
  var lightBeam = null;
  var starsLayer = null;
  var reefs = [];
  var towerEl = null;

  // 状态
  var isDragging = false;
  var currentAngle = 30;   // 当前角度（度）
  var targetAngle = 30;
  var angularVelocity = 0; // 角速度（度/帧）
  var lastAngle = 0;
  var lastTime = 0;
  var startAngle = 0;
  var startMouseAngle = 0;

  // 物理参数
  var DAMPING = 0.94;      // 旋转阻尼
  var MIN_VELOCITY = 0.05; // 最小角速度

  function init() {
    scene = document.getElementById('scene-lighthouse');
    if (!scene) return;

    towerLantern = document.getElementById('tower-lantern');
    lightBeam = document.getElementById('light-beam');
    starsLayer = document.getElementById('stars-layer');
    towerEl = scene.querySelector('.lighthouse-tower');

    // 生成星空
    NW.Utils.createStars(starsLayer, 30);

    // 获取礁石
    reefs = Array.prototype.slice.call(scene.querySelectorAll('.reef'));

    // 绑定事件
    towerLantern.addEventListener('mousedown', onDragStart);
    towerLantern.addEventListener('touchstart', onDragStart, { passive: false });

    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('mouseup', onDragEnd);
    document.addEventListener('touchend', onDragEnd);
    document.addEventListener('touchcancel', onDragEnd);

    towerLantern.setAttribute('data-interactive', 'true');

    // 启动渲染循环
    NW.AnimManager.add('lighthouse', update);
  }

  function getBeamOrigin() {
    // 光束旋转中心 = 灯塔顶部灯室中心
    var towerRect = towerEl.getBoundingClientRect();
    return {
      x: towerRect.left + towerRect.width / 2,
      y: towerRect.top + 4 + 20 // 塔顶部 + 灯室垂直中心
    };
  }

  function onDragStart(e) {
    e.preventDefault();
    isDragging = true;
    NW.Cursor.setDragging(true);
    angularVelocity = 0;

    var clientX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
    var clientY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY;

    var origin = getBeamOrigin();
    startMouseAngle = Math.atan2(clientY - origin.y, clientX - origin.x);
    startAngle = currentAngle * Math.PI / 180;

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

    var origin = getBeamOrigin();
    var currentMouseAngle = Math.atan2(clientY - origin.y, clientX - origin.x);

    var angleDiff = currentMouseAngle - startMouseAngle;
    targetAngle = (startAngle + angleDiff) * 180 / Math.PI;

    // 计算角速度
    var now = performance.now();
    var dt = Math.max(now - lastTime, 1);
    angularVelocity = (targetAngle - lastAngle) / dt * 16;
    lastAngle = targetAngle;
    lastTime = now;

    currentAngle = targetAngle;
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    NW.Cursor.setDragging(false);
    // 惯性继续旋转
  }

  function update() {
    if (!isDragging) {
      // 惯性衰减
      if (Math.abs(angularVelocity) > MIN_VELOCITY) {
        currentAngle += angularVelocity;
        angularVelocity *= DAMPING;
      } else {
        angularVelocity = 0;
      }
    }

    // 更新灯室旋转（微小的视觉差异：灯室比光束略微滞后）
    towerLantern.style.transform =
      'translateX(-50%) rotate(' + currentAngle + 'deg)';

    // 更新光束旋转
    lightBeam.style.transform =
      'translateY(-50%) rotate(' + currentAngle + 'deg)';

    checkReefIllumination();
  }

  function checkReefIllumination() {
    if (!scene || !towerEl) return;
    var origin = getBeamOrigin();

    for (var i = 0; i < reefs.length; i++) {
      var reef = reefs[i];
      var reefRect = reef.getBoundingClientRect();
      var reefCx = reefRect.left + reefRect.width / 2;
      var reefCy = reefRect.top + reefRect.height / 2;

      // 计算礁石相对于光束原点的角度
      var reefAngle = Math.atan2(reefCy - origin.y, reefCx - origin.x) * 180 / Math.PI;

      // 计算角度差（归一化到 -180~180）
      var angleDiff = reefAngle - currentAngle;
      while (angleDiff > 180) angleDiff -= 360;
      while (angleDiff < -180) angleDiff += 360;
      angleDiff = Math.abs(angleDiff);

      // 光束宽度（角度）
      var beamWidth = 22;

      if (angleDiff < beamWidth) {
        reef.classList.add('lit');
        var dist = NW.Utils.distance(origin.x, origin.y, reefCx, reefCy);
        // 距离越近越亮
        var intensity = Math.max(0, 1 - dist / 350);
        var brightness = 1 + intensity * 1.2;
        var glowSize = 4 + intensity * 12;
        var glowAlpha = 0.2 + intensity * 0.6;
        reef.style.filter = 'brightness(' + brightness.toFixed(2) +
          ') drop-shadow(0 0 ' + glowSize.toFixed(1) +
          'px rgba(255, 210, 120, ' + glowAlpha.toFixed(2) + '))';
      } else {
        reef.classList.remove('lit');
        reef.style.filter = '';
      }
    }
  }

  NW.Widgets = NW.Widgets || {};
  NW.Widgets.lighthouse = { init: init };

})();
