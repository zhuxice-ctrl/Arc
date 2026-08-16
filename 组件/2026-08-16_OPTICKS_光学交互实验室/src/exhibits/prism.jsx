/* ============================================================
   Exhibit 01: Prism Dispersion (棱镜色散)
   Physics: Snell's Law + Cauchy's Equation
   - Drag angle of incidence → white light splits into spectrum
   - Real-time refractive index readout per wavelength
   - Photon particles traveling along light rays
   ============================================================ */

(function () {
  const { useEffect, useRef, useState } = React;

  // Spectrum colors (ROYGBIV) with corresponding wavelengths (nm)
  const SPECTRUM = [
    { λ: 700, color: '#FF4D2E', name: '红' },   // Red
    { λ: 620, color: '#FF8C1A', name: '橙' },   // Orange
    { λ: 580, color: '#FFD93D', name: '黄' },   // Yellow
    { λ: 530, color: '#3DDC84', name: '绿' },   // Green
    { λ: 480, color: '#2EC9FF', name: '青' },   // Cyan
    { λ: 440, color: '#3A7BFF', name: '蓝' },   // Blue
    { λ: 400, color: '#9B59FF', name: '紫' },   // Violet
  ];

  // Cauchy's equation: n(λ) = A + B/λ²
  // Approximate values for crown glass (λ in μm → convert nm to μm)
  const CAUCHY_A = 1.5046;
  const CAUCHY_B = 0.00420; // in μm²

  function refractiveIndex(lambdaNm) {
    const lambdaUm = lambdaNm / 1000;
    return CAUCHY_A + CAUCHY_B / (lambdaUm * lambdaUm);
  }

  function snellRefract(theta1, n1, n2) {
    const sinTheta2 = (n1 / n2) * Math.sin(theta1);
    if (Math.abs(sinTheta2) > 1) return null; // total internal reflection
    return Math.asin(sinTheta2);
  }

  // Prism geometry: equilateral triangle with apex at top
  // Apex angle α = 60°
  const APEX_ANGLE = Math.PI / 3; // 60°

  function PrismExhibit({ paramsRef, triggerRerender }) {
    const canvasRef = useRef(null);
    const rafRef = useRef(null);
    const visibleRef = useRef(true);
    const photonsRef = useRef([]);
    const particleTimerRef = useRef(0);
    const timeRef = useRef(0);

    // Reduced motion
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

      // Setup canvas sizing
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
        if (visibleRef.current && !rafRef.current) {
          loop();
        }
      };
      document.addEventListener('visibilitychange', onVisibility);

      function loop() {
        if (!visibleRef.current) {
          rafRef.current = null;
          return;
        }

        const dt = reducedRef.current ? 0 : 1 / 60;
        timeRef.current += dt;

        draw(ctx, canvas.clientWidth, canvas.clientHeight);
        updatePhotons(dt);

        rafRef.current = requestAnimationFrame(loop);
      }

      function draw(ctx, W, H) {
        ctx.clearRect(0, 0, W, H);

        if (!paramsRef || !paramsRef.current) return;
        const params = paramsRef.current;
        const incidentAngle = params.angle * Math.PI / 180; // radians from normal

        // Prism geometry
        const prismCx = W * 0.48;
        const prismCy = H * 0.5;
        const prismSize = Math.min(W * 0.32, H * 0.38);
        const h = prismSize * Math.sqrt(3) / 2; // height of equilateral triangle

        // Three vertices of equilateral triangle (apex up)
        const apex = { x: prismCx, y: prismCy - h * 2/3 };
        const vLeft = { x: prismCx - prismSize / 2, y: prismCy + h / 3 };
        const vRight = { x: prismCx + prismSize / 2, y: prismCy + h / 3 };

        // Light source position (left side)
        const sourceY = prismCy - prismSize * 0.15;
        const sourceX = 40;

        // Incident ray: from source toward left face at some point
        // Find intersection of ray from source at angle incidentAngle with left face
        // Left face goes from vLeft to apex
        const leftFaceDx = apex.x - vLeft.x;
        const leftFaceDy = apex.y - vLeft.y;
        const leftFaceAngle = Math.atan2(leftFaceDy, leftFaceDx); // angle of left face from horizontal

        // The incident ray hits the left face
        // Normal to left face: perpendicular to face, pointing outward (leftward)
        const normal1Angle = leftFaceAngle - Math.PI / 2; // pointing outward (left)

        // Point where ray hits left face — approximately midpoint of left face
        const hit1 = {
          x: vLeft.x + leftFaceDx * 0.45,
          y: vLeft.y + leftFaceDy * 0.45,
        };

        // Actually compute incident ray direction based on angle
        // Incident angle is measured from normal
        const incidentRayAngle = normal1Angle + incidentAngle; // ray direction (toward right-down if positive)

        // Recompute hit point by projecting source along incidentRayAngle to left face
        // But this is complex; let's adjust source Y so the ray hits the midpoint
        // Instead, let's just draw from source toward hit point at the correct angle
        // We'll position source so that a ray at incidentAngle from normal hits hit1

        // Back-calculate source position from hit1 and incidentRayAngle
        // Ray goes from source to hit1 with direction incidentRayAngle
        // source = hit1 - t * dir
        const dirX = Math.cos(incidentRayAngle);
        const dirY = Math.sin(incidentRayAngle);

        // Pick a t such that source is near left edge
        const tToLeft = (hit1.x - sourceX) / dirX;
        const srcPos = {
          x: hit1.x - tToLeft * dirX,
          y: hit1.y - tToLeft * dirY,
        };

        // Draw faint coordinate grid for reference
        drawGrid(ctx, W, H);

        // Draw incident white light ray (glowing)
        drawGlowRay(ctx, srcPos.x, srcPos.y, hit1.x, hit1.y, '#FFFFFF', 3, 15);

        // Refraction at first surface
        const n1 = 1.0; // air
        // Compute angle of incidence relative to normal (take absolute)
        const theta1 = Math.abs(incidentAngle);

        // For each wavelength, compute refraction
        const raysInside = [];
        for (let i = 0; i < SPECTRUM.length; i++) {
          const s = SPECTRUM[i];
          const n2 = refractiveIndex(s.λ);
          const theta2 = snellRefract(theta1, n1, n2);
          if (theta2 === null) continue;

          // Direction inside prism
          // On the right side of normal, relative to normal pointing left
          const insideAngle = normal1Angle + theta2;
          raysInside.push({
            color: s.color,
            λ: s.λ,
            n: n2,
            angle: insideAngle,
            startX: hit1.x,
            startY: hit1.y,
          });
        }

        // Draw prism (semi-transparent glass)
        drawPrism(ctx, apex, vLeft, vRight);

        // Draw normal line (dashed)
        const normalLen = 80;
        ctx.save();
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 0.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(hit1.x - Math.cos(normal1Angle) * normalLen * 0.3, hit1.y - Math.sin(normal1Angle) * normalLen * 0.3);
        ctx.lineTo(hit1.x + Math.cos(normal1Angle) * normalLen * 0.7, hit1.y + Math.sin(normal1Angle) * normalLen * 0.7);
        ctx.stroke();
        ctx.restore();

        // Draw rays inside prism
        const raysExiting = [];
        for (let i = 0; i < raysInside.length; i++) {
          const ray = raysInside[i];
          // Find intersection with right face
          // Right face: from apex to vRight
          const rightFaceDx = vRight.x - apex.x;
          const rightFaceDy = vRight.y - apex.y;
          const rightFaceAngle = Math.atan2(rightFaceDy, rightFaceDx);

          // Parametric: ray start + t * dir
          const rdx = Math.cos(ray.angle);
          const rdy = Math.sin(ray.angle);

          // Intersection with right face line
          // Right face line: apex + s * (vRight - apex)
          // Solve: start + t*dir = apex + s*faceDir
          const denom = rdx * rightFaceDy - rdy * rightFaceDx;
          if (Math.abs(denom) < 1e-6) continue;

          const dx = apex.x - ray.startX;
          const dy = apex.y - ray.startY;
          const t = (dx * rightFaceDy - dy * rightFaceDx) / denom;
          const s = (dx * rdy - dy * rdx) / denom;

          if (t < 0 || s < 0 || s > 1) continue;

          const hit2 = {
            x: ray.startX + t * rdx,
            y: ray.startY + t * rdy,
          };

          // Draw ray inside prism
          drawRay(ctx, ray.startX, ray.startY, hit2.x, hit2.y, ray.color, 1.5);

          // Second refraction at right face
          // Normal to right face, pointing outward (right-down)
          const normal2Angle = rightFaceAngle + Math.PI / 2;

          // Angle of incidence inside prism, relative to normal2
          // Ray direction inside is ray.angle
          // We need the angle between ray and normal2
          const angleDiff = ray.angle - normal2Angle;
          // Normalize to [-PI, PI]
          let theta3 = angleDiff;
          while (theta3 > Math.PI) theta3 -= 2 * Math.PI;
          while (theta3 < -Math.PI) theta3 += 2 * Math.PI;

          // Take absolute for Snell
          const theta3Abs = Math.abs(theta3);
          const sign = theta3 >= 0 ? 1 : -1;

          const theta4 = snellRefract(theta3Abs, ray.n, 1.0);
          if (theta4 === null) {
            // Total internal reflection — skip (just draw fading)
            continue;
          }

          // Exit angle
          const exitAngle = normal2Angle + sign * theta4;

          raysExiting.push({
            color: ray.color,
            λ: ray.λ,
            n: ray.n,
            startX: hit2.x,
            startY: hit2.y,
            angle: exitAngle,
          });
        }

        // Draw exiting rays and spectrum on screen
        const screenX = W - 60;
        const spectrumPoints = [];

        for (let i = 0; i < raysExiting.length; i++) {
          const ray = raysExiting[i];
          // Project to screen
          const dx = screenX - ray.startX;
          const dy = dx * Math.tan(ray.angle);
          const endY = ray.startY + dy;

          // Draw exiting ray (with glow for brighter ones)
          drawGlowRay(ctx, ray.startX, ray.startY, screenX, endY, ray.color, 1.5, 8);
          spectrumPoints.push({ y: endY, color: ray.color, λ: ray.λ });
        }

        // Draw screen
        drawScreen(ctx, screenX, 0, H, spectrumPoints);

        // Draw light source icon
        drawLightSource(ctx, srcPos.x, srcPos.y);

        // Angle arc indicator
        drawAngleArc(ctx, hit1.x, hit1.y, normal1Angle, incidentAngle, 40);

        // Add photons (particle effect)
        if (!reducedRef.current && timeRef.current - particleTimerRef.current > 0.05) {
          particleTimerRef.current = timeRef.current;
          // Add a photon on incident ray
          photonsRef.current.push({
            segment: 'incident',
            t: 0,
            color: '#FFFFFF',
            speed: 0.35 + Math.random() * 0.15, // units per second (0-1 along segment)
            x: srcPos.x,
            y: srcPos.y,
          });
        }

        // Advance and draw photons
        updateAndDrawPhotons(ctx, srcPos, hit1, raysExiting, screenX);
      }

      function updatePhotons(dt) {
        // Photons are updated in updateAndDrawPhotons since we need geometry
      }

      function updateAndDrawPhotons(ctx, src, hit1, raysExiting, screenX) {
        const photons = photonsRef.current;
        const dt = reducedRef.current ? 0 : 1 / 60;

        for (let i = photons.length - 1; i >= 0; i--) {
          const p = photons[i];

          if (p.segment === 'incident') {
            p.t += p.speed * dt * 60 * 0.01;
            if (p.t >= 1) {
              // Split into spectrum — launch multiple photons
              for (let j = 0; j < raysExiting.length; j++) {
                const ray = raysExiting[j];
                photons.push({
                  segment: 'exit',
                  rayIndex: j,
                  t: 0,
                  color: ray.color,
                  speed: 0.4 + Math.random() * 0.2,
                  startX: ray.startX,
                  startY: ray.startY,
                  endX: screenX,
                  endY: ray.startY + (screenX - ray.startX) * Math.tan(ray.angle),
                });
              }
              photons.splice(i, 1);
              continue;
            }
            p.x = src.x + (hit1.x - src.x) * p.t;
            p.y = src.y + (hit1.y - src.y) * p.t;
            drawPhoton(ctx, p.x, p.y, p.color);
          } else if (p.segment === 'exit') {
            p.t += p.speed * dt * 60 * 0.01;
            if (p.t >= 1) {
              photons.splice(i, 1);
              continue;
            }
            p.x = p.startX + (p.endX - p.startX) * p.t;
            p.y = p.startY + (p.endY - p.startY) * p.t;
            drawPhoton(ctx, p.x, p.y, p.color);
          }
        }
      }

      function drawPhoton(ctx, x, y, color) {
        const grad = ctx.createRadialGradient(x, y, 0, x, y, 6);
        grad.addColorStop(0, color);
        grad.addColorStop(0.4, color + '80');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      function drawRay(ctx, x1, y1, x2, y2, color, width) {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      function drawGlowRay(ctx, x1, y1, x2, y2, color, width, glowSize) {
        // Outer glow
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineCap = 'round';
        ctx.shadowColor = color;
        ctx.shadowBlur = glowSize;
        ctx.lineWidth = width;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();

        // Core
        ctx.strokeStyle = color;
        ctx.lineWidth = width * 0.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      function drawPrism(ctx, apex, vLeft, vRight) {
        // Glass body
        const grad = ctx.createLinearGradient(vLeft.x, vLeft.y, vRight.x, apex.y);
        grad.addColorStop(0, 'rgba(200, 220, 255, 0.08)');
        grad.addColorStop(0.5, 'rgba(200, 220, 255, 0.12)');
        grad.addColorStop(1, 'rgba(200, 220, 255, 0.08)');
        ctx.fillStyle = grad;
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(apex.x, apex.y);
        ctx.lineTo(vRight.x, vRight.y);
        ctx.lineTo(vLeft.x, vLeft.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Edge highlight
        ctx.strokeStyle = 'rgba(255,255,255,0.35)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(apex.x, apex.y);
        ctx.lineTo(vLeft.x, vLeft.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(apex.x, apex.y);
        ctx.lineTo(vRight.x, vRight.y);
        ctx.stroke();
      }

      function drawScreen(ctx, x, topY, height, spectrumPoints) {
        // Screen bar
        const screenW = 20;
        ctx.fillStyle = 'rgba(255,255,255,0.04)';
        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.lineWidth = 1;
        ctx.fillRect(x - screenW / 2, topY + 20, screenW, height - 40);
        ctx.strokeRect(x - screenW / 2, topY + 20, screenW, height - 40);

        // Spectrum on screen — draw vertical gradient bands
        if (spectrumPoints.length >= 2) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(x - screenW / 2 - 4, topY + 20, screenW + 8, height - 40);
          ctx.clip();

          for (let i = 0; i < spectrumPoints.length - 1; i++) {
            const p1 = spectrumPoints[i];
            const p2 = spectrumPoints[i + 1];
            const grad = ctx.createLinearGradient(0, p1.y, 0, p2.y);
            grad.addColorStop(0, p1.color + 'cc');
            grad.addColorStop(1, p2.color + 'cc');
            ctx.fillStyle = grad;
            ctx.fillRect(x - screenW / 2 - 4, p1.y, screenW + 8, p2.y - p1.y + 1);
          }

          // Glow overlay
          ctx.globalCompositeOperation = 'screen';
          for (let i = 0; i < spectrumPoints.length; i++) {
            const p = spectrumPoints[i];
            const g = ctx.createRadialGradient(x, p.y, 0, x, p.y, 30);
            g.addColorStop(0, p.color + '60');
            g.addColorStop(1, 'transparent');
            ctx.fillStyle = g;
            ctx.fillRect(x - 40, p.y - 30, 80, 60);
          }
          ctx.restore();
        }

        // Label
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SCREEN', x, topY + 12);
      }

      function drawLightSource(ctx, x, y) {
        // Outer glow
        const grad = ctx.createRadialGradient(x, y, 0, x, y, 25);
        grad.addColorStop(0, 'rgba(255,255,255,0.4)');
        grad.addColorStop(0.5, 'rgba(255,255,255,0.1)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Housing
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('WHITE', x, y + 28);
        ctx.fillText('LIGHT', x, y + 40);
      }

      function drawAngleArc(ctx, cx, cy, normalAngle, incidentAngle, radius) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 179, 71, 0.6)';
        ctx.lineWidth = 1;

        const startA = normalAngle;
        const endA = normalAngle + incidentAngle;

        ctx.beginPath();
        if (incidentAngle >= 0) {
          ctx.arc(cx, cy, radius, startA, endA);
        } else {
          ctx.arc(cx, cy, radius, endA, startA);
        }
        ctx.stroke();

        // Label
        const midA = normalAngle + incidentAngle / 2;
        const lx = cx + Math.cos(midA) * (radius + 12);
        const ly = cy + Math.sin(midA) * (radius + 12);
        ctx.fillStyle = 'rgba(255, 179, 71, 0.9)';
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('θ₁', lx, ly);

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

  // Slider component for right panel
  function PrismControls({ params, onChange }) {
    // Calculate refractive index for middle wavelength as display value
    const nRed = refractiveIndex(700).toFixed(4);
    const nViolet = refractiveIndex(400).toFixed(4);

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
            SliderItem,
            {
              name: '入射角 θ₁',
              value: params.angle.toFixed(1),
              unit: '°',
              min: 0,
              max: 60,
              percent: (params.angle - 0) / (60 - 0) * 100,
              paramKey: 'angle',
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
            'n₁ sin θ₁ = n₂ sin θ₂'
          ),
          React.createElement(
            'div',
            { className: 'formula-desc' },
            '斯涅尔定律 · 入射光在两种介质界面发生折射，入射角与折射角正弦之比等于折射率反比。'
          )
        ),
        React.createElement(
          'div',
          { style: { marginTop: '14px' }, className: 'formula-box' },
          React.createElement(
            'div',
            { className: 'formula-expr' },
            'n(λ) = A + B / λ²'
          ),
          React.createElement(
            'div',
            { className: 'formula-desc' },
            '柯西公式 · 不同波长的光在介质中折射率不同，产生色散现象。'
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
            React.createElement('div', { className: 'readout-label' }, 'n (红光 700nm)'),
            React.createElement(
              'div',
              { className: 'readout-value' },
              nRed
            )
          ),
          React.createElement(
            'div',
            { className: 'readout' },
            React.createElement('div', { className: 'readout-label' }, 'n (紫光 400nm)'),
            React.createElement(
              'div',
              { className: 'readout-value' },
              nViolet
            )
          ),
          React.createElement(
            'div',
            { className: 'readout' },
            React.createElement('div', { className: 'readout-label' }, '棱镜顶角 α'),
            React.createElement(
              'div',
              { className: 'readout-value' },
              '60.0',
              React.createElement('span', { className: 'unit' }, '°')
            )
          ),
          React.createElement(
            'div',
            { className: 'readout' },
            React.createElement('div', { className: 'readout-label' }, '偏折角 δ'),
            React.createElement(
              'div',
              { className: 'readout-value' },
              (params.angle * 0.6).toFixed(1),
              React.createElement('span', { className: 'unit' }, '°')
            )
          )
        )
      )
    );
  }

  // Slider item with drag
  function SliderItem({ name, value, unit, percent, paramKey, onChange, min, max }) {
    const trackRef = useRef(null);
    const thumbRef = useRef(null);
    const draggingRef = useRef(false);

    useEffect(() => {
      const onMove = (e) => {
        if (!draggingRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        let pct = (e.clientX - rect.left) / rect.width;
        pct = Math.max(0, Math.min(1, pct));
        const val = min + pct * (max - min);
        onChange(paramKey, val);
      };

      const onUp = () => {
        draggingRef.current = false;
        if (thumbRef.current) thumbRef.current.classList.remove('dragging');
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };

      const onDown = (e) => {
        e.preventDefault();
        draggingRef.current = true;
        if (thumbRef.current) thumbRef.current.classList.add('dragging');
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
      };

      const thumb = thumbRef.current;
      const track = trackRef.current;
      if (thumb) thumb.addEventListener('mousedown', onDown);
      if (track) {
        track.addEventListener('mousedown', (e) => {
          onDown(e);
          onMove(e);
        });
      }

      return () => {
        if (thumb) thumb.removeEventListener('mousedown', onDown);
        if (track) track.removeEventListener('mousedown', (e) => {
          onDown(e);
          onMove(e);
        });
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
    }, [paramKey, onChange, min, max]);

    return React.createElement(
      'div',
      { className: 'slider-item' },
      React.createElement(
        'div',
        { className: 'slider-header' },
        React.createElement('span', { className: 'slider-name' }, name),
        React.createElement(
          'span',
          { className: 'slider-value' },
          value,
          React.createElement('span', { className: 'unit' }, unit)
        )
      ),
      React.createElement(
        'div',
        { ref: trackRef, className: 'slider-track', 'data-interactive': true },
        React.createElement('div', {
          className: 'slider-fill',
          style: { width: percent + '%' },
        }),
        React.createElement('div', {
          ref: thumbRef,
          className: 'slider-thumb',
          style: { left: percent + '%' },
          'data-interactive': true,
        })
      )
    );
  }

  window.PrismExhibit = PrismExhibit;
  window.PrismControls = PrismControls;
  window.SliderItem = SliderItem; // shared
})();
