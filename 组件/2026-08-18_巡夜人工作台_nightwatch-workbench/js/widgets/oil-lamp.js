/* ============================================
   展区 6：油灯调光阀
   旋转阀门调节火苗大小，房间照度与色温变化
   物理模型：旋转阻尼 + 火苗大小联动 + 昼夜过渡
   ============================================ */

(function () {
  'use strict';

  var scene = null;
  var dimmerKnob = null;
  var knobIndicator = null;
  var lampFlame = null;
  var flameInner = null;
  var flameOuter = null;
  var roomIllumination = null;
  var skyLayer = null;
  var moonSun = null;
  var starsWindow = null;
  var cloud1 = null;
  var cloud2 = null;

  // 状态
  var isDragging = false;
  var currentAngle = -90;     // 当前旋钮角度（度），-90 对应最小
  var startAngle = 0;
  var startMouseAngle = 0;

  // 角度范围
  var ANGLE_MIN = -135;   // 最小（关）
  var ANGLE_MAX = 135;    // 最大（最亮）

  // 火焰大小 0-1
  var flameLevel = 0.3;

  function init() {
    scene = document.getElementById('scene-oil-lamp');
    if (!scene) return;

    dimmerKnob = document.getElementById('dimmer-knob');
    knobIndicator = document.getElementById('knob-indicator');
    lampFlame = document.getElementById('lamp-flame');
    flameInner = lampFlame ? lampFlame.querySelector('.flame-inner') : null;
    flameOuter = lampFlame ? lampFlame.querySelector('.flame-outer') : null;
    roomIllumination = document.getElementById('room-illumination');
    skyLayer = document.getElementById('sky-layer');
    moonSun = document.getElementById('moon-sun');
    starsWindow = document.getElementById('stars-window');
    cloud1 = scene.querySelector('.cloud-1');
    cloud2 = scene.querySelector('.cloud-2');

    // 生成窗外星空
    NW.Utils.createSmallStars(starsWindow, 12);

    // 绑定事件
    dimmerKnob.addEventListener('mousedown', onDragStart);
    dimmerKnob.addEventListener('touchstart', onDragStart, { passive: false });

    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('mouseup', onDragEnd);
    document.addEventListener('touchend', onDragEnd);
    document.addEventListener('touchcancel', onDragEnd);

    dimmerKnob.setAttribute('data-interactive', 'true');

    // 初始状态
    currentAngle = -90;
    flameLevel = 0.3;
    updateKnob();
    updateFlame();
    updateIllumination();
    updateDayNight();

    // 启动动画循环
    NW.AnimManager.add('oil-lamp', update);
  }

  function onDragStart(e) {
    e.preventDefault();
    isDragging = true;
    NW.Cursor.setDragging(true);

    var clientX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
    var clientY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY;

    var knobCenter = NW.Utils.getCenter(dimmerKnob);
    startMouseAngle = Math.atan2(clientY - knobCenter.y, clientX - knobCenter.x);
    startAngle = currentAngle;
  }

  function onDragMove(e) {
    if (!isDragging) return;
    e.preventDefault();

    var clientX = e.clientX !== undefined ? e.clientX :
                  (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    var clientY = e.clientY !== undefined ? e.clientY :
                  (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

    var knobCenter = NW.Utils.getCenter(dimmerKnob);
    var currentMouseAngle = Math.atan2(clientY - knobCenter.y, clientX - knobCenter.x);

    var angleDiff = currentMouseAngle - startMouseAngle;
    var newAngle = startAngle + angleDiff * 180 / Math.PI;

    // 约束范围
    currentAngle = NW.Physics.clamp(newAngle, ANGLE_MIN, ANGLE_MAX);

    // 计算火焰等级
    var range = ANGLE_MAX - ANGLE_MIN;
    flameLevel = (currentAngle - ANGLE_MIN) / range;

    updateKnob();
    updateFlame();
    updateIllumination();
    updateDayNight();
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    NW.Cursor.setDragging(false);
  }

  function update() {
    // 空闲时，火焰有轻微随机抖动（已由 CSS animation 处理）
    // 这里可添加额外的动态效果
  }

  function updateKnob() {
    dimmerKnob.style.transform = 'rotate(' + currentAngle + 'deg)';
  }

  function updateFlame() {
    if (!flameInner || !flameOuter) return;

    // 火焰大小随旋钮变化
    var baseScale = 0.3 + flameLevel * 0.9;
    var heightScale = 0.4 + flameLevel * 0.8;

    flameInner.style.transform =
      'translateX(-50%) scaleX(' + baseScale + ') scaleY(' + heightScale + ')';
    flameOuter.style.transform =
      'translateX(-50%) scaleX(' + (baseScale * 1.1) + ') scaleY(' + (heightScale * 1.1) + ')';

    // 火焰颜色温度：越亮越偏白，越暗越偏红
    var hue = 30 + flameLevel * 15; // 从橙红到金黄
    var brightness = 60 + flameLevel * 30;
    flameInner.style.background =
      'linear-gradient(180deg, hsl(' + hue + ', 100%, ' + (brightness + 20) + '%), ' +
      'hsl(' + hue + ', 100%, ' + brightness + '%) 40%, ' +
      'hsl(' + (hue - 10) + ', 100%, ' + (brightness - 20) + '%) 100%)';

    // 火焰太小时降低不透明度
    var opacity = 0.3 + flameLevel * 0.7;
    lampFlame.style.opacity = flameLevel < 0.1 ? flameLevel * 3 : opacity;
  }

  function updateIllumination() {
    // 房间照度随火焰变化
    var intensity = flameLevel;
    var warmness = 0.5 + flameLevel * 0.5;

    roomIllumination.style.background =
      'radial-gradient(ellipse at 50% 65%, ' +
      'rgba(255, ' + Math.round(150 + warmness * 50) + ', ' +
      Math.round(60 + warmness * 40) + ', ' + (0.1 + intensity * 0.3) + ') 0%, ' +
      'rgba(255, ' + Math.round(120 + warmness * 30) + ', ' +
      Math.round(40 + warmness * 20) + ', ' + (0.05 + intensity * 0.1) + ') 30%, ' +
      'transparent 60%)';

    roomIllumination.style.opacity = 0.3 + intensity * 0.7;
  }

  function updateDayNight() {
    // 火焰越大，窗外越偏向白天（反向：灯越亮，反衬窗外越夜 → 改为灯越亮 → 天越亮的正向联想）
    // 设计：旋钮从最小到最大，窗外从深夜过渡到清晨
    var dayProgress = flameLevel; // 0 = 深夜, 1 = 清晨

    // 天空颜色
    var skyTop = lerpColor([10, 16, 32], [74, 138, 192], dayProgress);
    var skyMid = lerpColor([26, 32, 48], [122, 176, 216], dayProgress);
    var skyBottom = lerpColor([42, 48, 64], [168, 200, 224], dayProgress);

    skyLayer.style.background =
      'linear-gradient(180deg, ' +
      'rgb(' + skyTop[0] + ',' + skyTop[1] + ',' + skyTop[2] + ') 0%, ' +
      'rgb(' + skyMid[0] + ',' + skyMid[1] + ',' + skyMid[2] + ') 60%, ' +
      'rgb(' + skyBottom[0] + ',' + skyBottom[1] + ',' + skyBottom[2] + ') 100%)';

    // 月/日
    var sunAmount = dayProgress;
    if (sunAmount > 0.3) {
      moonSun.classList.add('sun');
    } else {
      moonSun.classList.remove('sun');
    }

    // 星星淡出
    if (dayProgress > 0.4) {
      starsWindow.classList.add('hidden');
    } else {
      starsWindow.classList.remove('hidden');
      starsWindow.style.opacity = 1 - dayProgress / 0.4;
    }

    // 云朵
    if (dayProgress > 0.5) {
      cloud1.classList.add('day');
      cloud2.classList.add('day');
    } else {
      cloud1.classList.remove('day');
      cloud2.classList.remove('day');
    }

    // 月亮/太阳位置
    // 月亮在夜晚居中，太阳在白天升高
    var moonY = 15 - dayProgress * 5;
    var sunY = 50 + (1 - dayProgress) * 50;
    // 简化：一个天体，从月相过渡到日相
    moonSun.style.top = (15 + dayProgress * -5) + 'px';
  }

  // 颜色线性插值
  function lerpColor(c1, c2, t) {
    return [
      Math.round(c1[0] + (c2[0] - c1[0]) * t),
      Math.round(c1[1] + (c2[1] - c1[1]) * t),
      Math.round(c1[2] + (c2[2] - c1[2]) * t)
    ];
  }

  NW.Widgets = NW.Widgets || {};
  NW.Widgets.oilLamp = { init: init };

})();
