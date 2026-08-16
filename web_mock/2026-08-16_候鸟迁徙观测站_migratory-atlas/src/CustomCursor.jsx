/* ============================================================
   CustomCursor - 自定义光标
   特点：
   - 初始在屏幕中央
   - 白色粗环（difference 混合模式）+ 茜红内点 + 多层发光
   - 悬停可交互元素：放大、变色、显示标签
   - 点击涟漪
   - reduced-motion 下禁用
   ============================================================ */

function CustomCursor() {
  const cursorRef = React.useRef(null);
  const outerRef = React.useRef(null);
  const innerRef = React.useRef(null);
  const glowRef = React.useRef(null);
  const labelRef = React.useRef(null);

  React.useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (prefersReduced || isTouch) return;

    const cursor = cursorRef.current;
    const outer = outerRef.current;
    const inner = innerRef.current;
    const glow = glowRef.current;
    const label = labelRef.current;

    // 初始位置：屏幕中央
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    // 外环有延迟（弹簧跟随），内点即时跟随
    let outerX = mouseX;
    let outerY = mouseY;
    let glowX = mouseX;
    let glowY = mouseY;

    const springOuter = new Spring({ stiffness: 220, damping: 18, value: mouseX });
    const springOuterY = new Spring({ stiffness: 220, damping: 18, value: mouseY });
    const springGlow = new Spring({ stiffness: 120, damping: 14, value: mouseX });
    const springGlowY = new Spring({ stiffness: 120, damping: 14, value: mouseY });

    let isHover = false;
    let isClick = false;

    function onMouseMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // 内点即时
      inner.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      label.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -140%)`;
      springOuter.setTarget(mouseX);
      springOuterY.setTarget(mouseY);
      springGlow.setTarget(mouseX);
      springGlowY.setTarget(mouseY);
    }

    function onMouseOver(e) {
      const target = e.target.closest('a, button, [role="button"], [data-cursor-hover], input, textarea, summary');
      if (target) {
        isHover = true;
        cursor.classList.add('cursor--hover');
        const cursorLabel = target.getAttribute('data-cursor-label');
        if (cursorLabel) {
          label.textContent = cursorLabel;
          cursor.classList.add('cursor--label');
        }
      }
    }

    function onMouseOut(e) {
      const target = e.target.closest('a, button, [role="button"], [data-cursor-hover], input, textarea, summary');
      if (target) {
        isHover = false;
        cursor.classList.remove('cursor--hover');
        cursor.classList.remove('cursor--label');
      }
    }

    function onMouseDown(e) {
      isClick = true;
      cursor.classList.add('cursor--click');
      // 涟漪
      const ripple = document.createElement('div');
      ripple.className = 'cursor-ripple';
      ripple.style.left = mouseX + 'px';
      ripple.style.top = mouseY + 'px';
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    }

    function onMouseUp() {
      isClick = false;
      cursor.classList.remove('cursor--click');
    }

    function onVisibilityChange() {
      if (document.hidden) {
        RafManager.remove('custom-cursor');
      } else {
        RafManager.add('custom-cursor', animate);
      }
    }

    function animate(dt) {
      springOuter.step(dt);
      springOuterY.step(dt);
      springGlow.step(dt);
      springGlowY.step(dt);
      outer.style.transform = `translate(${springOuter.value}px, ${springOuterY.value}px) translate(-50%, -50%)`;
      glow.style.transform = `translate(${springGlow.value}px, ${springGlowY.value}px) translate(-50%, -50%)`;
    }

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('visibilitychange', onVisibilityChange);

    RafManager.add('custom-cursor', animate);

    // 初始内点位置设到中央
    inner.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    outer.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    glow.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    label.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -140%)`;

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      RafManager.remove('custom-cursor');
    };
  }, []);

  return React.createElement('div', { ref: cursorRef, className: 'custom-cursor', 'aria-hidden': 'true' },
    React.createElement('div', { ref: glowRef, className: 'cursor-glow' }),
    React.createElement('div', { ref: outerRef, className: 'cursor-outer' }),
    React.createElement('div', { ref: innerRef, className: 'cursor-inner' }),
    React.createElement('div', { ref: labelRef, className: 'cursor-label' }, ''),
  );
}

Object.assign(window, { CustomCursor });
