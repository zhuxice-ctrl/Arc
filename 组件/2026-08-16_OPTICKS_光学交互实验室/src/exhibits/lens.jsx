/* ============================================================
   Exhibit 02: Convex Lens Imaging (凸透镜成像)
   Physics: 1/f = 1/u + 1/v  ;  m = -v/u
   - Drag object distance → image distance & size update
   - Ray tracing: 3 principal rays (parallel, center, focal)
   - Animated photons traveling along rays
   ============================================================ */

(function () {
  const { useEffect, useRef } = React;

  function LensExhibit({ paramsRef }) {
    const canvasRef = useRef(null);
    const rafRef = useRef(null);
    const visibleRef = useRef(true);
    const photonsRef = useRef([]);
    const particleTimerRef = useRef(0);
    const timeRef = useRef(0);
    const reducedRef = useRef(false);

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
        const f = params.focal;  // focal length in pixels
        const u = params.objDist; // object distance in pixels
        const h = params.objHeight; // object height in pixels

        // Lens at center
        const lensX = W * 0.5;
        const axisY = H * 0.55;

        // Object position (left of lens)
        const objX = lensX - u;
        const objTopY = axisY - h;

        // Image position via lens formula: 1/f = 1/u + 1/v  →  v = uf/(u-f)
        // If u < f: v is negative (virtual image, same side as object)
        let v = (u * f) / (u - f);
        let imgHeight = h * (-v / u); // magnification m = -v/u
        let isVirtual = v < 0;
        let imgX = lensX + Math.abs(v);
        if (isVirtual) imgX = lensX + v; // virtual image on left side

        // Draw optical axis
        drawOpticalAxis(ctx, 0, axisY, W, axisY);

        // Draw focal points
        drawFocalPoint(ctx, lensX - f, axisY, 'F');
        drawFocalPoint(ctx, lensX + f, axisY, "F'");
        drawFocalPoint(ctx, lensX - 2 * f, axisY, '2F');
        drawFocalPoint(ctx, lensX + 2 * f, axisY, "2F'");

        // Draw lens
        drawConvexLens(ctx, lensX, axisY, H * 0.32);

        // Draw object (arrow)
        drawArrow(ctx, objX, axisY, objX, objTopY, '#FFB347', 2.5, '物');

        // Draw image (arrow)
        const imgTopY = axisY + imgHeight;
        const imgColor = isVirtual ? 'rgba(255, 179, 71, 0.5)' : '#4ADE80';
        drawArrow(ctx, imgX, axisY, imgX, imgTopY, imgColor, 2.5, isVirtual ? '虚像' : '像', isVirtual);

        // Ray tracing — 3 principal rays
        const rays = [];

        // Ray 1: Parallel to axis from object top, then refracts through focal point on far side
        rays.push({
          segments: [
            { x1: objX, y1: objTopY, x2: lensX, y2: objTopY, color: '#FF6B6B', dashed: false },
            { x1: lensX, y1: objTopY, x2: imgX, y2: imgTopY, color: '#FF6B6B', dashed: isVirtual && imgX < lensX },
          ],
        });

        // Ray 2: Through optical center (undeviated)
        rays.push({
          segments: [
            { x1: objX, y1: objTopY, x2: imgX, y2: imgTopY, color: '#4ECDC4', dashed: false },
          ],
        });

        // Ray 3: Through near focal point, then parallel to axis
        if (u > f) {
          // From object top, through F (near focal point), hits lens, then parallel
          // Find where ray from objTop through F hits lens
          const rayAngle = Math.atan2(objTopY - axisY, objX - (lensX - f));
          const hitY = objTopY + (lensX - objX) * Math.tan(rayAngle);
          rays.push({
            segments: [
              { x1: objX, y1: objTopY, x2: lensX, y2: hitY, color: '#FFD93D', dashed: false },
              { x1: lensX, y1: hitY, x2: imgX, y2: hitY, color: '#FFD93D', dashed: false },
            ],
          });
        } else {
          // Virtual case: ray appears to come from F, hits lens, goes parallel
          // From F on object side: line through objTop? No — from object top going toward F on image side...
          // Actually: from object top, going toward near focal point direction, hits lens, then parallel
          const nearF = lensX - f;
          const rayAngle = Math.atan2(objTopY - axisY, objX - nearF);
          const hitY = objTopY + (lensX - objX) * Math.tan(rayAngle);
          // Then goes parallel on the far side
          // Virtual image appears where parallel ray meets undeviated ray (extrapolated backward)
          rays.push({
            segments: [
              { x1: objX, y1: objTopY, x2: lensX, y2: hitY, color: '#FFD93D', dashed: false },
              { x1: lensX, y1: hitY, x2: W * 0.95, y2: hitY, color: '#FFD93D', dashed: false },
              // Dashed virtual extension
              { x1: lensX, y1: hitY, x2: imgX, y2: imgTopY, color: 'rgba(255, 217, 61, 0.4)', dashed: true },
            ],
          });
        }

        // Draw all ray segments
        for (const ray of rays) {
          for (const seg of ray.segments) {
            if (seg.dashed) {
              drawDashedRay(ctx, seg.x1, seg.y1, seg.x2, seg.y2, seg.color, 1.2);
            } else {
              drawGlowRay(ctx, seg.x1, seg.y1, seg.x2, seg.y2, seg.color, 1.5, 8);
            }
          }
        }

        // Particle photons along parallel ray (ray 1 first segment)
        if (!reducedRef.current && timeRef.current - particleTimerRef.current > 0.08) {
          particleTimerRef.current = timeRef.current;
          photonsRef.current.push({
            t: 0,
            speed: 0.25 + Math.random() * 0.1,
            color: '#FF6B6B',
            // Follow ray 1 path: obj→lens→img
            pathSegment: 0,
            seg1: { x1: objX, y1: objTopY, x2: lensX, y2: objTopY },
            seg2: { x1: lensX, y1: objTopY, x2: imgX, y2: imgTopY },
          });
        }

        // Update and draw photons
        updatePhotons();
      }

      function updatePhotons() {
        const photons = photonsRef.current;
        const dt = reducedRef.current ? 0 : 1 / 60;
        for (let i = photons.length - 1; i >= 0; i--) {
          const p = photons[i];
          p.t += p.speed * dt * 60 * 0.01;

          let x, y;
          if (p.pathSegment === 0) {
            if (p.t >= 1) {
              p.pathSegment = 1;
              p.t = 0;
              continue;
            }
            x = p.seg1.x1 + (p.seg1.x2 - p.seg1.x1) * p.t;
            y = p.seg1.y1 + (p.seg1.y2 - p.seg1.y1) * p.t;
          } else {
            if (p.t >= 1) {
              photons.splice(i, 1);
              continue;
            }
            x = p.seg2.x1 + (p.seg2.x2 - p.seg2.x1) * p.t;
            y = p.seg2.y1 + (p.seg2.y2 - p.seg2.y1) * p.t;
          }

          drawPhoton(canvasRef.current.getContext('2d'), x, y, p.color);
        }
      }

      function drawPhoton(ctx, x, y, color) {
        const grad = ctx.createRadialGradient(x, y, 0, x, y, 5);
        grad.addColorStop(0, color);
        grad.addColorStop(0.5, color + '70');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      function drawGlowRay(ctx, x1, y1, x2, y2, color, width, glowSize) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineCap = 'round';
        ctx.shadowColor = color;
        ctx.shadowBlur = glowSize;
        ctx.lineWidth = width;
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();

        ctx.strokeStyle = color;
        ctx.lineWidth = width * 0.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      function drawDashedRay(ctx, x1, y1, x2, y2, color, width) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.setLineDash([6, 4]);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
      }

      function drawOpticalAxis(ctx, x1, y, x2) {
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1;
        ctx.setLineDash([8, 4]);
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Arrow at right end
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.beginPath();
        ctx.moveTo(x2, y);
        ctx.lineTo(x2 - 8, y - 4);
        ctx.lineTo(x2 - 8, y + 4);
        ctx.closePath();
        ctx.fill();
      }

      function drawFocalPoint(ctx, x, y, label) {
        ctx.fillStyle = '#FFB347';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 179, 71, 0.3)';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(label, x, y + 20);
      }

      function drawConvexLens(ctx, cx, cy, height) {
        // Double convex shape using two arcs
        const thickness = 24;
        const r = height * 0.8; // approximate radius of curvature

        ctx.save();

        // Lens body gradient
        const grad = ctx.createLinearGradient(cx - thickness / 2, 0, cx + thickness / 2, 0);
        grad.addColorStop(0, 'rgba(200, 220, 255, 0.1)');
        grad.addColorStop(0.3, 'rgba(200, 220, 255, 0.18)');
        grad.addColorStop(0.5, 'rgba(200, 220, 255, 0.22)');
        grad.addColorStop(0.7, 'rgba(200, 220, 255, 0.18)');
        grad.addColorStop(1, 'rgba(200, 220, 255, 0.1)');

        ctx.fillStyle = grad;
        ctx.strokeStyle = 'rgba(255,255,255,0.25)';
        ctx.lineWidth = 1;

        ctx.beginPath();
        // Left convex face
        ctx.arc(cx - r + thickness / 2, cy, r, -Math.PI / 2.5, Math.PI / 2.5, false);
        // Right convex face
        ctx.arc(cx + r - thickness / 2, cy, r, Math.PI - Math.PI / 2.5, Math.PI + Math.PI / 2.5, false);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Optical center dot
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.arc(cx, cy, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Principal plane line
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 0.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(cx, cy - height * 0.6);
        ctx.lineTo(cx, cy + height * 0.6);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      function drawArrow(ctx, x1, y1, x2, y2, color, width, label, dashed) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';

        if (dashed) {
          ctx.setLineDash([5, 4]);
        }

        // Shaft
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Arrow head (pointing up if y2 < y1, down if y2 > y1)
        const direction = y2 < y1 ? -1 : 1;
        const headSize = 10;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - headSize * 0.5, y2 - direction * headSize * 0.8);
        ctx.lineTo(x2 + headSize * 0.5, y2 - direction * headSize * 0.8);
        ctx.closePath();
        ctx.fill();

        // Label
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(label, x2, y2 - direction * 16);

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

  function LensControls({ params, onChange }) {
    const f = params.focal;
    const u = params.objDist;
    const v = (u * f) / (u - f);
    const m = -v / u;
    const isVirtual = v < 0;
    const imgType = isVirtual ? '虚像 / 正立 / 放大' : (u > 2 * f ? '实像 / 倒立 / 缩小' : (u === 2 * f ? '实像 / 倒立 / 等大' : '实像 / 倒立 / 放大'));

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
              name: '物距 u',
              value: params.objDist.toFixed(0),
              unit: 'px',
              min: 30,
              max: 320,
              percent: (params.objDist - 30) / (320 - 30) * 100,
              paramKey: 'objDist',
              onChange: onChange,
            }
          ),
          React.createElement(
            window.SliderItem,
            {
              name: '焦距 f',
              value: params.focal.toFixed(0),
              unit: 'px',
              min: 40,
              max: 150,
              percent: (params.focal - 40) / (150 - 40) * 100,
              paramKey: 'focal',
              onChange: onChange,
            }
          ),
          React.createElement(
            window.SliderItem,
            {
              name: '物高 h',
              value: params.objHeight.toFixed(0),
              unit: 'px',
              min: 20,
              max: 100,
              percent: (params.objHeight - 20) / (100 - 20) * 100,
              paramKey: 'objHeight',
              onChange: onChange,
            }
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'panel-section' },
        React.createElement('div', { className: 'panel-label' }, '物理公式 / Formula'),
        React.createElement(
          'div',
          { className: 'formula-box' },
          React.createElement(
            'div',
            { className: 'formula-expr' },
            '1/f = 1/u + 1/v'
          ),
          React.createElement(
            'div',
            { className: 'formula-desc' },
            '透镜成像公式 · 物距 u、像距 v 与焦距 f 三者满足倒数关系。'
          )
        ),
        React.createElement(
          'div',
          { style: { marginTop: '14px' }, className: 'formula-box' },
          React.createElement(
            'div',
            { className: 'formula-expr' },
            'm = − v / u'
          ),
          React.createElement(
            'div',
            { className: 'formula-desc' },
            '横向放大率 · 负号表示倒立；绝对值 > 1 为放大，< 1 为缩小。'
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
            React.createElement('div', { className: 'readout-label' }, '像距 v'),
            React.createElement(
              'div',
              { className: 'readout-value' },
              Math.abs(v).toFixed(1),
              React.createElement('span', { className: 'unit' }, 'px')
            )
          ),
          React.createElement(
            'div',
            { className: 'readout' },
            React.createElement('div', { className: 'readout-label' }, '放大率 m'),
            React.createElement(
              'div',
              { className: 'readout-value' },
              Math.abs(m).toFixed(2),
              React.createElement('span', { className: 'unit' }, '×')
            )
          ),
          React.createElement(
            'div',
            { className: 'readout', style: { gridColumn: 'span 2' } },
            React.createElement('div', { className: 'readout-label' }, '成像性质'),
            React.createElement(
              'div',
              { className: 'readout-value', style: { fontSize: '13px' } },
              imgType
            )
          )
        )
      )
    );
  }

  window.LensExhibit = LensExhibit;
  window.LensControls = LensControls;
})();
