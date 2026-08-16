/* ============================================================
   Exhibit 04: Shadow Projection (阴影投影)
   Physics: Umbra / Penumbra — point light vs area light
   - Drag light source position & size
   - Shadow hardness/softness changes in real-time
   - Animated light rays from each point on area light
   ============================================================ */

(function () {
  const { useEffect, useRef } = React;

  function ShadowExhibit({ paramsRef }) {
    const canvasRef = useRef(null);
    const rafRef = useRef(null);
    const visibleRef = useRef(true);
    const timeRef = useRef(0);
    const reducedRef = useRef(false);
    const rayTimerRef = useRef(0);
    const raysRef = useRef([]);

    useEffect(() => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      reducedRef.current = mq.matches;
      const handler = (e) => { reducedRef.current = e.matches; };
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }, []);

    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const DPR = Math.min(window.devicePixelRatio || 1, 2);

      function resize() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * DPR;
        canvas.height = rect.height * DPR;
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      }
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(canvas);

      const onVisibility = () => {
        visibleRef.current = document.visibilityState === 'visible';
        if (visibleRef.current && !rafRef.current) loop();
      };
      document.addEventListener('visibilitychange', onVisibility);

      function loop() {
        if (!visibleRef.current) { rafRef.current = null; return; }
        const dt = reducedRef.current ? 0 : 1 / 60;
        timeRef.current += dt;
        draw(ctx, canvas.clientWidth, canvas.clientHeight);
        rafRef.current = requestAnimationFrame(loop);
      }

      function draw(ctx, W, H) {
        ctx.clearRect(0, 0, W, H);
        drawGrid(ctx, W, H);

        if (!paramsRef || !paramsRef.current) return;
        const params = paramsRef.current;
        const lightX = W * 0.25 + params.lightX;
        const lightY = H * 0.2 + params.lightY;
        const lightSize = params.lightSize;
        const objX = W * 0.55;
        const objY = H * 0.5;
        const objSize = params.objSize;
        const screenY = H - 60;

        // Draw ground line (where shadow falls)
        drawGround(ctx, screenY, W);

        // Draw shadow on ground
        drawShadow(ctx, lightX, lightY, lightSize, objX, objY, objSize, screenY, W);

        // Draw object (block/column silhouette)
        drawObject(ctx, objX, objY, objSize);

        // Draw light source
        drawLight(ctx, lightX, lightY, lightSize);

        // Draw shadow analysis rays (animated)
        if (!reducedRef.current) {
          updateRays(dt, lightX, lightY, lightSize, objX, objY, objSize, screenY);
          drawShadowRays(ctx);
        }

        // Labels
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('光源', lightX, lightY + lightSize / 2 + 20);
        ctx.fillText('遮挡物', objX, objY + objSize / 2 + 20);
        ctx.fillText('投影面', W / 2, screenY + 25);
      }

      function drawGround(ctx, y, W) {
        // Floor plane
        const grad = ctx.createLinearGradient(0, y, 0, y + 40);
        grad.addColorStop(0, 'rgba(255,255,255,0.06)');
        grad.addColorStop(1, 'rgba(255,255,255,0.02)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, y, W, 60);

        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      function drawLight(ctx, x, y, size) {
        // Area light (rectangular or circular)
        ctx.save();

        // Outer glow
        const glow = ctx.createRadialGradient(x, y, size * 0.5, x, y, size * 4);
        glow.addColorStop(0, 'rgba(255, 240, 200, 0.25)');
        glow.addColorStop(0.5, 'rgba(255, 200, 100, 0.08)');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Light source body
        const bodyGrad = ctx.createRadialGradient(x, y, 0, x, y, size / 2);
        bodyGrad.addColorStop(0, '#FFFFFF');
        bodyGrad.addColorStop(0.3, '#FFF4D6');
        bodyGrad.addColorStop(1, '#FFB347');
        ctx.fillStyle = bodyGrad;
        ctx.shadowColor = 'rgba(255, 179, 71, 0.8)';
        ctx.shadowBlur = 20;

        if (size < 4) {
          // Point light
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Area light (elongated horizontal)
          ctx.beginPath();
          ctx.ellipse(x, y, size, size * 0.4, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      function drawObject(ctx, x, y, size) {
        const h = size * 1.8;
        const w = size * 0.8;

        ctx.save();

        // Pillar/block
        const grad = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0);
        grad.addColorStop(0, '#1e1e28');
        grad.addColorStop(0.5, '#2a2a38');
        grad.addColorStop(1, '#1a1a24');
        ctx.fillStyle = grad;
        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.rect(x - w / 2, y - h / 2, w, h);
        ctx.fill();
        ctx.stroke();

        // Top cap
        ctx.fillStyle = '#252535';
        ctx.fillRect(x - w / 2 - 3, y - h / 2 - 5, w + 6, 5);
        ctx.strokeRect(x - w / 2 - 3, y - h / 2 - 5, w + 6, 5);

        ctx.restore();
      }

      function drawShadow(ctx, lightX, lightY, lightSize, objX, objY, objSize, screenY, W) {
        const h = objSize * 1.8;
        const w = objSize * 0.8;
        const objTop = objY - h / 2;
        const objLeft = objX - w / 2;
        const objRight = objX + w / 2;

        // For area light: shadow has umbra + penumbra
        // Approximate by sampling multiple point sources along the light

        const numSamples = 40;
        const shadowCanvas = document.createElement('canvas');
        shadowCanvas.width = W;
        shadowCanvas.height = 60;
        const sctx = shadowCanvas.getContext('2d');
        sctx.fillStyle = 'rgba(0,0,0,0)';
        sctx.fillRect(0, 0, W, 60);

        // Accumulate shadow from each sample point on light
        sctx.globalCompositeOperation = 'source-over';

        for (let i = 0; i < numSamples; i++) {
          const t = numSamples === 1 ? 0 : (i / (numSamples - 1) - 0.5);
          const lx = lightX + t * lightSize * 2;
          const ly = lightY;

          // Ray from light to left top of object → hits screen
          const leftRayDx = objLeft - lx;
          const leftRayDy = objTop - ly;
          const leftScreenT = (screenY - ly) / leftRayDy;
          const leftShadowX = lx + leftRayDx * leftScreenT;

          // Ray from light to right top of object → hits screen
          const rightRayDx = objRight - lx;
          const rightRayDy = objTop - ly;
          const rightScreenT = (screenY - ly) / rightRayDy;
          const rightShadowX = lx + rightRayDx * rightScreenT;

          // Draw soft shadow band
          const alpha = 0.06; // per sample contribution
          const grad = sctx.createLinearGradient(leftShadowX, 0, rightShadowX, 0);
          grad.addColorStop(0, `rgba(0,0,0,0)`);
          grad.addColorStop(0.3, `rgba(0,0,0,${alpha})`);
          grad.addColorStop(0.7, `rgba(0,0,0,${alpha})`);
          grad.addColorStop(1, `rgba(0,0,0,0)`);
          sctx.fillStyle = grad;
          sctx.fillRect(leftShadowX, 0, rightShadowX - leftShadowX, 60);
        }

        ctx.save();
        // Draw shadow on ground
        ctx.globalAlpha = 0.8;
        ctx.drawImage(shadowCanvas, 0, screenY);

        // Shadow blur / soft edge look
        ctx.filter = 'blur(1px)';
        ctx.globalAlpha = 0.4;
        ctx.drawImage(shadowCanvas, 0, screenY + 2);
        ctx.filter = 'none';

        ctx.restore();
      }

      function updateRays(dt, lightX, lightY, lightSize, objX, objY, objSize, screenY) {
        rayTimerRef.current += dt;
        const spawnInterval = 0.3;
        if (rayTimerRef.current > spawnInterval) {
          rayTimerRef.current = 0;

          const h = objSize * 1.8;
          const objTop = objY - h / 2;
          const objLeft = objX - objSize * 0.4;
          const objRight = objX + objSize * 0.4;

          // Spawn a few rays from random points on the light
          for (let i = 0; i < 3; i++) {
            const t = Math.random() - 0.5;
            const lx = lightX + t * lightSize * 2;
            const ly = lightY;

            // Hit the object edge (left or right top corner)
            const hitLeft = Math.random() < 0.5;
            const hitX = hitLeft ? objLeft : objRight;
            const hitY = objTop;

            // Continue to screen
            const dx = hitX - lx;
            const dy = hitY - ly;
            const screenT = (screenY - ly) / dy;
            const screenX = lx + dx * screenT;

            raysRef.current.push({
              t: 0,
              speed: 0.25 + Math.random() * 0.1,
              lx, ly,
              hitX, hitY,
              screenX, screenY,
              phase: 'toObj', // or 'toScreen'
            });
          }
        }

        // Update rays
        for (let i = raysRef.current.length - 1; i >= 0; i--) {
          const r = raysRef.current[i];
          r.t += r.speed * dt * 60 * 0.008;

          if (r.phase === 'toObj') {
            if (r.t >= 1) {
              r.phase = 'toScreen';
              r.t = 0;
            }
          } else {
            if (r.t >= 1) {
              raysRef.current.splice(i, 1);
            }
          }
        }
      }

      function drawShadowRays(ctx) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        for (const r of raysRef.current) {
          let x, y;
          if (r.phase === 'toObj') {
            x = r.lx + (r.hitX - r.lx) * r.t;
            y = r.ly + (r.hitY - r.ly) * r.t;
          } else {
            x = r.hitX + (r.screenX - r.hitX) * r.t;
            y = r.hitY + (r.screenY - r.hitY) * r.t;
          }

          const grad = ctx.createRadialGradient(x, y, 0, x, y, 4);
          grad.addColorStop(0, 'rgba(255, 220, 150, 0.9)');
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      function drawGrid(ctx, W, H) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
        ctx.lineWidth = 0.5;
        const step = 40;
        for (let x = 0; x < W; x += step) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, H);
          ctx.stroke();
        }
        for (let y = 0; y < H; y += step) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(W, y);
          ctx.stroke();
        }
        ctx.restore();
      }

      loop();

      return () => {
        ro.disconnect();
        document.removeEventListener('visibilitychange', onVisibility);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      };
    }, []);

    return React.createElement(
      'div',
      { className: 'exhibit-canvas-wrap exhibit-enter' },
      React.createElement('canvas', {
        ref: canvasRef,
        className: 'exhibit-canvas',
        style: { width: '100%', height: '100%' },
      })
    );
  }

  function ShadowControls({ params, onChange }) {
    const isPoint = params.lightSize < 3;
    const lightType = isPoint ? '点光源' : '面光源';

    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        'div',
        { className: 'panel-section' },
        React.createElement('div', { className: 'panel-label' }, '参数控制 / Controls'),
        React.createElement(
          'div',
          { className: 'slider-group' },
          React.createElement(
            window.SliderItem,
            {
              name: '光源水平位置',
              value: params.lightX.toFixed(0),
              unit: 'px',
              min: -100,
              max: 150,
              percent: (params.lightX - (-100)) / (150 - (-100)) * 100,
              paramKey: 'lightX',
              onChange: onChange,
            }
          ),
          React.createElement(
            window.SliderItem,
            {
              name: '光源高度',
              value: params.lightY.toFixed(0),
              unit: 'px',
              min: 0,
              max: 120,
              percent: (params.lightY - 0) / (120 - 0) * 100,
              paramKey: 'lightY',
              onChange: onChange,
            }
          ),
          React.createElement(
            window.SliderItem,
            {
              name: '光源尺寸',
              value: params.lightSize.toFixed(1),
              unit: 'px',
              min: 1,
              max: 60,
              percent: (params.lightSize - 1) / (60 - 1) * 100,
              paramKey: 'lightSize',
              onChange: onChange,
            }
          ),
          React.createElement(
            window.SliderItem,
            {
              name: '物体大小',
              value: params.objSize.toFixed(0),
              unit: 'px',
              min: 30,
              max: 100,
              percent: (params.objSize - 30) / (100 - 30) * 100,
              paramKey: 'objSize',
              onChange: onChange,
            }
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'panel-section' },
        React.createElement('div', { className: 'panel-label' }, '物理原理 / Principle'),
        React.createElement(
          'div',
          { className: 'formula-box' },
          React.createElement(
            'div',
            { className: 'formula-expr' },
            '本影 + 半影'
          ),
          React.createElement(
            'div',
            { className: 'formula-desc' },
            '点光源产生锐利阴影（本影）。面光源各点发出的光被遮挡程度不同，形成由深到浅的半影区，阴影边缘渐变柔化。'
          )
        ),
        React.createElement(
          'div',
          { style: { marginTop: '14px' }, className: 'formula-box' },
          React.createElement(
            'div',
            { className: 'formula-expr' },
            'd ∝ D · s / h'
          ),
          React.createElement(
            'div',
            { className: 'formula-desc' },
              '半影宽度 d 与光源尺寸 s、物屏距 D 成正比，与物体高度 h 成反比。光源越大、距离越远，阴影越柔和。'
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'panel-section' },
        React.createElement('div', { className: 'panel-label' }, '实时读数 / Readout'),
        React.createElement(
          'div',
          { className: 'readout-grid' },
          React.createElement(
            'div',
            { className: 'readout' },
            React.createElement('div', { className: 'readout-label' }, '光源类型'),
            React.createElement(
              'div',
              { className: 'readout-value', style: { fontSize: '13px' } },
              lightType
            )
          ),
          React.createElement(
            'div',
            { className: 'readout' },
            React.createElement('div', { className: 'readout-label' }, '阴影软硬度'),
            React.createElement(
              'div',
              { className: 'readout-value', style: { fontSize: '13px' } },
              params.lightSize < 3 ? '锐利' : (params.lightSize < 20 ? '微柔' : '柔和')
            )
          ),
          React.createElement(
            'div',
            { className: 'readout', style: { gridColumn: 'span 2' } },
            React.createElement('div', { className: 'readout-label' }, '阴影长度'),
            React.createElement(
              'div',
              { className: 'readout-value' },
              (params.objSize * 1.8 * 1.8 + params.lightX * 0.3).toFixed(0),
              React.createElement('span', { className: 'unit' }, 'px')
            )
          )
        )
      )
    );
  }

  window.ShadowExhibit = ShadowExhibit;
  window.ShadowControls = ShadowControls;
})();
