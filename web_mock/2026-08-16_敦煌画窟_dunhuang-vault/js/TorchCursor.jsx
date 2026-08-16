/* =========================================================
   TorchCursor — 火把光晕自定义光标
   物理模型：惯性动量 + 阻尼（lerp 逼近目标）
   三态：默认 / hover 交互元素 / clicking 点击
   点击位置产生涟漪
   ========================================================= */

const { useEffect, useRef, useState } = React;

function TorchCursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const flameRef = useRef(null);

  // 状态变量（避免 setState 重渲染高频 mousemove）
  const stateRef = useRef({
    tx: window.innerWidth / 2,  // 目标 x
    ty: window.innerHeight / 2, // 目标 y
    cx: window.innerWidth / 2,  // 当前 x（lerp 后）
    cy: window.innerHeight / 2, // 当前 y
    vx: 0, vy: 0,
    hover: false,
    clicking: false,
    flamePhase: 0,
  });

  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // 仅在支持 hover 的精细指针设备启用
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!canHover || DH.prefersReducedMotion()) {
      setEnabled(false);
      return;
    }
    setEnabled(true);
    document.body.classList.add('torch-enabled');

    const s = stateRef.current;

    // 初始位置：屏幕中央
    s.tx = window.innerWidth / 2;
    s.ty = window.innerHeight / 2;
    s.cx = s.tx;
    s.cy = s.ty;

    const onMove = DH.rafThrottle((e) => {
      s.tx = e.clientX;
      s.ty = e.clientY;
    });

    const onOver = (e) => {
      const target = e.target;
      if (target.closest && target.closest('a, button, [data-interactive], .cave-card, .pigment-swatch, .story-tab')) {
        s.hover = true;
      } else {
        s.hover = false;
      }
    };

    const onDown = (e) => {
      s.clicking = true;
      spawnRipple(e.clientX, e.clientY);
    };
    const onUp = () => { s.clicking = false; };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    // 启动动画循环
    const TOKEN = 'torch-cursor';
    DH.startLoop(TOKEN, (dt) => {
      // 阻尼跟随（指数衰减 lerp，dt 归一化）
      const ease = 1 - Math.exp(-dt / 90); // 阻尼系数
      s.cx += (s.tx - s.cx) * ease;
      s.cy += (s.ty - s.cy) * ease;

      // 焰心跳动（类正弦随机脉动）
      s.flamePhase += dt * 0.008;
      const flicker = 0.85 + Math.sin(s.flamePhase * 2.3) * 0.1 + Math.sin(s.flamePhase * 5.7) * 0.05;

      const cursor = cursorRef.current;
      if (!cursor) return;

      cursor.style.transform = `translate3d(${s.cx}px, ${s.cy}px, 0)`;

      // 环尺寸：默认 28px / hover 52px / clicking 20px
      let ringSize = 28;
      if (s.hover) ringSize = 52;
      if (s.clicking) ringSize = 20;
      ringRef.current.style.width = ringSize + 'px';
      ringRef.current.style.height = ringSize + 'px';

      // 焰心尺寸（带闪烁）
      const flameSize = (s.hover ? 14 : 10) * flicker;
      flameRef.current.style.width = flameSize + 'px';
      flameRef.current.style.height = flameSize + 'px';

      // hover 类名控制样式
      if (s.hover) cursor.classList.add('is-hover');
      else cursor.classList.remove('is-hover');
      if (s.clicking) cursor.classList.add('is-clicking');
      else cursor.classList.remove('is-clicking');
    });

    return () => {
      DH.stopLoop(TOKEN);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.body.classList.remove('torch-enabled');
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="torch-cursor" ref={cursorRef} aria-hidden="true">
      <div className="ring-outer" ref={ringRef}></div>
      <div className="flame" ref={flameRef}></div>
    </div>
  );
}

// 涟漪生成器
function spawnRipple(x, y) {
  if (DH.prefersReducedMotion()) return;
  const el = document.createElement('div');
  el.className = 'ripple';
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  // 随机大小，避免完全一致
  const size = 60 + Math.random() * 40;
  el.style.width = size + 'px';
  el.style.height = size + 'px';
  document.body.appendChild(el);
  // 动画结束后移除（700ms 与 CSS 对应）
  let timeoutId = null;
  const cleanup = () => {
    if (timeoutId) clearTimeout(timeoutId);
    if (el.parentNode) el.parentNode.removeChild(el);
  };
  timeoutId = setTimeout(cleanup, 720);
  el.addEventListener('animationend', cleanup, { once: true });
}

window.TorchCursor = TorchCursor;
window.spawnRipple = spawnRipple;
