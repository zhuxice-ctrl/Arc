/* ============================================================
   PHOSPHOR Magnetic Buttons — 磁力按钮
   - 按钮被鼠标（荧光探针）以反平方引力吸附
   - 距离越近吸力越大，按距离平方衰减
   - 离开后弹簧阻尼归位
   - 每个按钮有不同的 strength 系数
   - 直接操作 transform，不触发 React 重渲
   ============================================================ */

(function () {
  'use strict';

  const grid = document.getElementById('magneticGrid');
  if (!grid) return;

  const buttons = Array.from(grid.querySelectorAll('.mag-btn'));

  // 按钮状态
  const btnStates = buttons.map(function (btn) {
    const strength = parseFloat(btn.dataset.strength) || 1.0;
    return {
      el: btn,
      x: 0,        // 当前偏移
      y: 0,
      tx: 0,       // 目标偏移（磁力计算结果）
      vx: 0,       // 速度
      vy: 0,
      strength: strength,
      maxOffset: 28 * strength, // 最大偏移量
      attractRadius: 150 * strength // 吸引半径
    };
  });

  // ========== 磁力计算 ==========
  function computeMagnetism(state, mouseX, mouseY, mouseInView) {
    if (!mouseInView) {
      state.tx = 0;
      state.ty = 0;
      return;
    }

    const rect = state.el.getBoundingClientRect();
    const btnCx = rect.left + rect.width / 2;
    const btnCy = rect.top + rect.height / 2;

    const dx = mouseX - btnCx;
    const dy = mouseY - btnCy;
    const distSq = dx * dx + dy * dy;
    const dist = Math.sqrt(distSq);

    if (dist < state.attractRadius && dist > 1) {
      // 反平方引力：越近越强
      // F = k * strength / (r² + 1) * direction
      const normDist = dist / state.attractRadius; // 0~1
      const force = (1 - normDist * normDist) * state.maxOffset; // 平方衰减

      const fdx = (dx / dist) * force;
      const fdy = (dy / dist) * force;

      state.tx = fdx;
      state.ty = fdy;
    } else {
      state.tx = 0;
      state.ty = 0;
    }
  }

  // ========== 弹簧更新（每帧直接 transform） ==========
  function updateButton(state, dt) {
    const fdt = dt * 60;

    // 弹簧向目标偏移
    const ax = (state.tx - state.x) * 0.15;
    const ay = (state.ty - state.y) * 0.15;
    state.vx += ax * fdt;
    state.vy += ay * fdt;

    // 阻尼
    const dmp = Math.pow(0.8, fdt);
    state.vx *= dmp;
    state.vy *= dmp;

    state.x += state.vx * fdt;
    state.y += state.vy * fdt;

    // 直接操作 transform，不引起重排
    state.el.style.transform = `translate(${state.x}px, ${state.y}px)`;
  }

  // ========== 内发光点跟随 ==========
  function updateGlow(state, mouseX, mouseY, mouseInView) {
    const glow = state.el.querySelector('.mag-btn__glow');
    if (!glow) return;
    if (!mouseInView) return;

    const rect = state.el.getBoundingClientRect();
    const lx = ((mouseX - rect.left) / rect.width) * 100;
    const ly = ((mouseY - rect.top) / rect.height) * 100;

    if (lx >= -10 && lx <= 110 && ly >= -10 && ly <= 110) {
      state.el.style.setProperty('--mx', lx + '%');
      state.el.style.setProperty('--my', ly + '%');
    }
  }

  // ========== 主循环 ==========
  let isActive = false;

  function magneticLoop(dt) {
    const mx = PH.mouse.x;
    const my = PH.mouse.y;

    // 判断鼠标是否在 grid 区域附近（扩大范围）
    const gridRect = grid.getBoundingClientRect();
    const pad = 200;
    const inView = mx >= gridRect.left - pad && mx <= gridRect.right + pad &&
                   my >= gridRect.top - pad && my <= gridRect.bottom + pad;

    for (let i = 0; i < btnStates.length; i++) {
      computeMagnetism(btnStates[i], mx, my, inView);
      updateButton(btnStates[i], dt);
      updateGlow(btnStates[i], mx, my, inView);
    }
  }

  // ========== IntersectionObserver ==========
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        if (!isActive) {
          isActive = true;
          PH.RAF.add(magneticLoop);
        }
      } else {
        if (isActive) {
          isActive = false;
          PH.RAF.remove(magneticLoop);
          // 重置所有按钮位置
          btnStates.forEach(function (s) {
            s.x = 0; s.y = 0; s.tx = 0; s.ty = 0; s.vx = 0; s.vy = 0;
            s.el.style.transform = '';
          });
        }
      }
    });
  }, { threshold: 0.1 });

  io.observe(grid.closest('.zone'));

  // ========== 按钮点击效果 ==========
  buttons.forEach(function (btn) {
    btn.addEventListener('mousedown', function (e) {
      // 点击涟漪
      const rect = btn.getBoundingClientRect();
      PH.createRipple(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        btn.classList.contains('mag-btn--accent') ? '#DFF6FF' : '#2DE1C2'
      );
    });
  });

  if (PH.reducedMotion) {
    // 降级：不吸附
    return;
  }

})();
