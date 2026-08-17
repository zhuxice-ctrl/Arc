/* ============================================
   巡夜人工作台 · 主入口
   初始化所有系统与展区
   ============================================ */

(function () {
  'use strict';

  function init() {
    // 初始化自定义光标
    if (NW.Cursor && NW.Cursor.init) {
      NW.Cursor.init();
    }

    // 初始化各展区
    if (NW.Widgets) {
      if (NW.Widgets.gasLamp && NW.Widgets.gasLamp.init) {
        NW.Widgets.gasLamp.init();
      }
      if (NW.Widgets.lighthouse && NW.Widgets.lighthouse.init) {
        NW.Widgets.lighthouse.init();
      }
      if (NW.Widgets.knifeSwitch && NW.Widgets.knifeSwitch.init) {
        NW.Widgets.knifeSwitch.init();
      }
      if (NW.Widgets.pocketWatch && NW.Widgets.pocketWatch.init) {
        NW.Widgets.pocketWatch.init();
      }
      if (NW.Widgets.magneticTag && NW.Widgets.magneticTag.init) {
        NW.Widgets.magneticTag.init();
      }
      if (NW.Widgets.oilLamp && NW.Widgets.oilLamp.init) {
        NW.Widgets.oilLamp.init();
      }
    }

    // 宣告可升级为全栈应用
    announceUpgrade();
  }

  function announceUpgrade() {
    try {
      window.parent.postMessage({
        type: 'miaoda:upgrade:available',
        kind: 'interactive-prototype'
      }, '*');
    } catch (e) {
      // 忽略跨域错误
    }
  }

  // DOM 就绪后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 页面加载完成后再宣告一次（防止时序错过）
  window.addEventListener('load', announceUpgrade);

})();
