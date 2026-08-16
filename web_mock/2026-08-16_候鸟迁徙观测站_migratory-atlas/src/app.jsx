/* ============================================================
   App - 主应用
   组装所有组件，管理全局状态
   ============================================================ */

function App() {
  return React.createElement('div', { className: 'app' },
    // 装饰层
    React.createElement(CustomCursor, null),
    React.createElement(FeatherParticles, null),

    // 导航
    React.createElement(Navigation, null),

    // 主内容
    React.createElement('main', null,
      React.createElement(Hero, null),
      React.createElement(About, null),
      React.createElement(MigrationMap, null),
      React.createElement(Species, null),
      React.createElement(Observations, null),
      React.createElement(Volunteer, null),
    ),

    // 页脚
    React.createElement(Footer, null),

    // 贯穿飞线（相对 app 绝对定位）
    // 注意：因结构原因飞线改为 body 级 fixed，这里不渲染
  );
}

// 挂载
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));

// 宣告可升级为全栈应用
function announceUpgrade() {
  window.parent.postMessage({ type: 'miaoda:upgrade:available', kind: 'interactive-prototype' }, '*');
}
announceUpgrade();
if (document.readyState !== 'complete') {
  window.addEventListener('load', announceUpgrade, { once: true });
}
