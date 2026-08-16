/* ============================================================
   Exhibit 05: Mirror Array (反射镜阵)
   Physics: Law of Reflection — θ_i = θ_r
   - Drag each mirror angle → light path updates in real time
   - Multiple mirror relay (beam bouncing across the stage)
   - Animated photon particles traveling the full path
   - Target indicator showing where beam lands
   ============================================================ */

(function () {
  const { useEffect, useRef } = React;

  function MirrorsExhibit({ paramsRef }) {
    const canvasRef = useRef(null);
    const rafRef = useRef(null);
    const visibleRef = useRef(true);
    const timeRef = useRef(0);
    const reducedRef = useRef(false);
    const photonsRef = useRef([]);
    const photonTimerRef = useRef(0);

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

        // Define mirrors
        // Each mirror: {x, y, length, angle} (angle in radians from horizontal)
        const mirrors = [
          { x: W * 0.25, y: H * 0.6, length: 100, angle: params.m1Angle * Math.PI / 180 },
          { x: W * 0.5, y: H * 0.25, length: 100, angle: params.m2Angle * Math.PI / 180 },
          { x: W * 0.75, y: H * 0.55, length: 100, angle: params.m3Angle * Math.PI / 180 },
          { x: W * 0.6, y: H * 0.8, length: 100, angle: params.m4Angle * Math.PI / 180 },
        ];

        // Light source (bottom-left, shooting up-right)
        const sourceX = 40;
        const sourceY = H - 40;
        const sourceAngle = -Math.PI / 4 + params.sourceAngle * Math.PI / 180; // initial up-right

        // Compute ray path via reflections
        const path = computeRayPath(sourceX, sourceY, sourceAngle, mirrors, W, H);

        // Draw light source
        drawLightSource(ctx, sourceX, sourceY, sourceAngle);

        // Draw ray segments
        for (let i = 0; i < path.length - 1; i++) {
          const p1 = path[i];
          const p2 = path[i + 1];
          if (i === path.length - 2 && p2.hitWall) {
            // Final segment hitting wall - slightly dimmer
            drawGlowRay(ctx, p1.x, p1.y, p2.x, p2.y, 'rgba(255, 179, 71, 0.5)', 1.5, 6);
          } else {
            drawGlowRay(ctx, p1.x, p1.y, p2.x, p2.y, '#FFB347', 2, 12);
          }
        }

        // Draw target indicator at last point (if it hits a wall/edge)
        if (path.length > 1) {
          const last = path[path.length - 1];
          drawTarget(ctx, last.x, last.y, path.length - 1);
        }

        // Draw mirrors
        for (let i = 0; i < mirrors.length; i++) {
          drawMirror(ctx, mirrors[i], i + 1);
        }

        // Photon animation
        if (!reducedRef.current && path.length > 1) {
          photonTimerRef.current += 1 / 60;
          if (photonTimerRef.current > 0.25) {
            photonTimerRef.current = 0;
            photonsRef.current.push({
              t: 0,
              speed: 0.2 + Math.random() * 0.1,
              path: path.slice(),
              segIndex: 0,
            });
          }

          updatePhotons();
        }

        // Draw reflection normal at hit points
        for (let i = 1; i < path.length - 1; i++) {
          const pt = path[i];
          if (pt.mirrorIdx !== undefined) {
            const m = mirrors[pt.mirrorIdx];
            drawNormal(ctx, pt.x, pt.y, m.angle);
          }
        }
      }

      function computeRayPath(sx, sy, angle, mirrors, W, H) {
        const path = [{ x: sx, y: sy }];
        let x = sx;
        let y = sy;
        let dir = angle;
        const maxBounces = 8;

        for (let bounce = 0; bounce < maxBounces; bounce++) {
          // Find closest intersection with any mirror or wall
          let closest = null;
          let closestDist = Infinity;
          let closestMirror = -1;
          let closestNormal = 0;

          // Check each mirror
          for (let i = 0; i < mirrors.length; i++) {
            const m = mirrors[i];
            const hit = rayMirrorIntersect(x, y, dir, m);
            if (hit && hit.dist > 0.5 && hit.dist < closestDist) {
              closestDist = hit.dist;
              closest = hit;
              closestMirror = i;
              closestNormal = hit.normal;
            }
          }

          // Check walls
          const wallHit = rayWallIntersect(x, y, dir, W, H);
          if (wallHit && wallHit.dist < closestDist) {
            path.push({ x: wallHit.x, y: wallHit.y, hitWall: true });
            return path;
          }

          if (!closest) {
            // No mirror hit, go to wall
            if (wallHit) {
              path.push({ x: wallHit.x, y: wallHit.y, hitWall: true });
            }
            return path;
          }

          // Reflect off mirror
          path.push({ x: closest.x, y: closest.y, mirrorIdx: closestMirror });
          x = closest.x;
          y = closest.y;

          // Reflect direction: d' = d - 2(d·n)n
          const dx = Math.cos(dir);
          const dy = Math.sin(dir);
          const nx = Math.cos(closestNormal);
          const ny = Math.sin(closestNormal);
          const dot = dx * nx + dy * ny;
          const rdx = dx - 2 * dot * nx;
          const rdy = dy - 2 * dot * ny;
          dir = Math.atan2(rdy, rdx);

          // Nudge away from mirror to avoid self-intersection
          x += rdx * 0.5;
          y += rdy * 0.5;
        }

        return path;
      }

      function rayMirrorIntersect(rx, ry, rAngle, mirror) {
        const dx = Math.cos(rAngle);
        const dy = Math.sin(rAngle);

        // Mirror endpoints
        const halfLen = mirror.length / 2;
        const cosA = Math.cos(mirror.angle);
        const sinA = Math.sin(mirror.angle);
        const mx1 = mirror.x - halfLen * cosA;
        const my1 = mirror.y - halfLen * sinA;
        const mx2 = mirror.x + halfLen * cosA;
        const my2 = mirror.y + halfLen * sinA;

        // Intersection of ray with mirror line
        const mdx = mx2 - mx1;
        const mdy = my2 - my1;

        const denom = dx * mdy - dy * mdx;
        if (Math.abs(denom) < 1e-6) return null; // parallel

        const t = ((mx1 - rx) * mdy - (my1 - ry) * mdx) / denom;
        const s = ((mx1 - rx) * dy - (my1 - ry) * dx) / denom;

        if (t < 0 || s < 0 || s > 1) return null;

        const hitX = rx + t * dx;
        const hitY = ry + t * dy;

        // Normal angle (perpendicular to mirror)
        const normal = mirror.angle + Math.PI / 2;
        // Ensure normal faces the ray (dot negative)
        const nx = Math.cos(normal);
        const ny = Math.sin(normal);
        if (dx * nx + dy * ny > 0) {
          return { dist: t, x: hitX, y: hitY, normal: normal + Math.PI };
        }

        return { dist: t, x: hitX, y: hitY, normal: normal };
      }

      function rayWallIntersect(rx, ry, rAngle, W, H) {
        const dx = Math.cos(rAngle);
        const dy = Math.sin(rAngle);
        let minT = Infinity;
        let hitX, hitY;

        // Left wall
        if (dx < 0) {
          const t = (0 - rx) / dx;
          if (t > 0 && t < minT) {
            minT = t; hitX = 0; hitY = ry + t * dy;
          }
        }
        // Right wall
        if (dx > 0) {
          const t = (W - rx) / dx;
          if (t > 0 && t < minT) {
            minT = t; hitX = W; hitY = ry + t * dy;
          }
        }
        // Top wall
        if (dy < 0) {
          const t = (0 - ry) / dy;
          if (t > 0 && t < minT) {
            minT = t; hitX = rx + t * dx; hitY = 0;
          }
        }
        // Bottom wall
        if (dy > 0) {
          const t = (H - ry) / dy;
          if (t > 0 && t < minT) {
            minT = t; hitX = rx + t * dx; hitY = H;
          }
        }

        if (minT === Infinity) return null;
        return { dist: minT, x: hitX, y: hitY };
      }

      function updatePhotons() {
        const photons = photonsRef.current;
        const dt = reducedRef.current ? 0 : 1 / 60;
        const ctx = canvasRef.current.getContext('2d');

        for (let i = photons.length - 1; i >= 0; i--) {
          const p = photons[i];
          const path = p.path;
          if (p.segIndex >= path.length - 1) {
            photons.splice(i, 1);
            continue;
          }

          const segLen = Math.hypot(
            path[p.segIndex + 1].x - path[p.segIndex].x,
            path[p.segIndex + 1].y - path[p.segIndex].y
          );
          p.t += (p.speed * dt * 60 * 3) / segLen; // speed in px/frame

          if (p.t >= 1) {
            p.segIndex++;
            p.t = 0;
            if (p.segIndex >= path.length - 1) {
              photons.splice(i, 1);
              continue;
            }
          }

          const p1 = path[p.segIndex];
          const p2 = path[p.segIndex + 1];
          const x = p1.x + (p2.x - p1.x) * p.t;
          const y = p1.y + (p2.y - p1.y) * p.t;

          drawPhoton(ctx, x, y);
        }
      }

      function drawPhoton(ctx, x, y) {
        const grad = ctx.createRadialGradient(x, y, 0, x, y, 8);
        grad.addColorStop(0, '#FFFFFF');
        grad.addColorStop(0.3, '#FFB347');
        grad.addColorStop(0.6, 'rgba(255, 179, 71, 0.4)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      function drawGlowRay(ctx, x1, y1, x2, y2, color, width, glowSize) {
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

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = width * 0.4;
        ctx.lineCap = 'round';
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      function drawMirror(ctx, mirror, index) {
        const halfLen = mirror.length / 2;
        const cosA = Math.cos(mirror.angle);
        const sinA = Math.sin(mirror.angle);

        const x1 = mirror.x - halfLen * cosA;
        const y1 = mirror.y - halfLen * sinA;
        const x2 = mirror.x + halfLen * cosA;
        const y2 = mirror.y + halfLen * sinA;

        // Mirror body (thick)
        ctx.save();
        ctx.translate(mirror.x, mirror.y);
        ctx.rotate(mirror.angle);

        // Back side
        const backGrad = ctx.createLinearGradient(0, 0, 0, 6);
        backGrad.addColorStop(0, '#3a3a4a');
        backGrad.addColorStop(1, '#1a1a24');
        ctx.fillStyle = backGrad;
        ctx.fillRect(-halfLen, 2, mirror.length, 5);
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(-halfLen, 2, mirror.length, 5);

        // Reflective surface (top edge)
        const surfaceGrad = ctx.createLinearGradient(0, -2, 0, 2);
        surfaceGrad.addColorStop(0, 'rgba(255,255,255,0.9)');
        surfaceGrad.addColorStop(0.5, 'rgba(200,220,255,0.7)');
        surfaceGrad.addColorStop(1, 'rgba(150,170,200,0.3)');
        ctx.fillStyle = surfaceGrad;
        ctx.fillRect(-halfLen, -1.5, mirror.length, 2.5);

        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fillRect(-halfLen, -1.5, mirror.length, 0.8);

        // Pivot point
        ctx.fillStyle = '#FFB347';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();

        // Label
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('M' + index, mirror.x, mirror.y + 22);
      }

      function drawNormal(ctx, x, y, mirrorAngle) {
        const len = 18;
        const nx = Math.cos(mirrorAngle + Math.PI / 2);
        const ny = Math.sin(mirrorAngle + Math.PI / 2);

        ctx.save();
        ctx.strokeStyle = 'rgba(255, 179, 71, 0.35)';
        ctx.lineWidth = 0.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(x - nx * len * 0.5, y - ny * len * 0.5);
        ctx.lineTo(x + nx * len * 0.5, y + ny * len * 0.5);
        ctx.stroke();
        ctx.restore();
      }

      function drawLightSource(ctx, x, y, angle) {
        ctx.save();

        // Glow
        const grad = ctx.createRadialGradient(x, y, 0, x, y, 30);
        grad.addColorStop(0, 'rgba(255, 179, 71, 0.4)');
        grad.addColorStop(0.5, 'rgba(255, 179, 71, 0.1)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.fill();

        // Housing
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.fillStyle = '#252535';
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(-18, -10, 22, 20);
        ctx.fill();
        ctx.stroke();

        // Lens/port
        ctx.fillStyle = '#FFB347';
        ctx.shadowColor = '#FFB347';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(6, 0, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();

        // Label
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('LASER', x, y + 30);
      }

      function drawTarget(ctx, x, y, bounceCount) {
        const size = 12 + Math.sin(timeRef.current * 3) * 2;
        ctx.save();

        ctx.strokeStyle = 'rgba(255, 179, 71, 0.6)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255, 179, 71, 0.4)';
        ctx.beginPath();
        ctx.arc(x, y, size * 0.6, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#FFB347';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 179, 71, 0.9)';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'left';
        ctx.fillText(bounceCount + ' 次反射', x + size + 6, y + 3);

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

  function MirrorsControls({ params, onChange }) {
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
              name: '光源出射角',
              value: params.sourceAngle.toFixed(1),
              unit: '°',
              min: -30,
              max: 30,
              percent: (params.sourceAngle - (-30)) / (30 - (-30)) * 100,
              paramKey: 'sourceAngle',
              onChange: onChange,
            }
          ),
          React.createElement(
            window.SliderItem,
            {
              name: '反射镜 M1 角度',
              value: params.m1Angle.toFixed(0),
              unit: '°',
              min: -60,
              max: 60,
              percent: (params.m1Angle - (-60)) / (60 - (-60)) * 100,
              paramKey: 'm1Angle',
              onChange: onChange,
            }
          ),
          React.createElement(
            window.SliderItem,
            {
              name: '反射镜 M2 角度',
              value: params.m2Angle.toFixed(0),
              unit: '°',
              min: -60,
              max: 60,
              percent: (params.m2Angle - (-60)) / (60 - (-60)) * 100,
              paramKey: 'm2Angle',
              onChange: onChange,
            }
          ),
          React.createElement(
            window.SliderItem,
            {
              name: '反射镜 M3 角度',
              value: params.m3Angle.toFixed(0),
              unit: '°',
              min: -60,
              max: 60,
              percent: (params.m3Angle - (-60)) / (60 - (-60)) * 100,
              paramKey: 'm3Angle',
              onChange: onChange,
            }
          ),
          React.createElement(
            window.SliderItem,
            {
              name: '反射镜 M4 角度',
              value: params.m4Angle.toFixed(0),
              unit: '°',
              min: -60,
              max: 60,
              percent: (params.m4Angle - (-60)) / (60 - (-60)) * 100,
              paramKey: 'm4Angle',
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
            'θᵢ = θᵣ'
          ),
          React.createElement(
            'div',
            { className: 'formula-desc' },
            '反射定律 · 入射角等于反射角，入射光线、反射光线与法线共面。'
          )
        ),
        React.createElement(
          'div',
          { style: { marginTop: '14px' }, className: 'formula-box' },
          React.createElement(
            'div',
            { className: 'formula-expr' },
            "⃗r = ⃗d − 2(⃗d · ⃗n) ⃗n"
          ),
          React.createElement(
            'div',
            { className: 'formula-desc' },
            '向量反射公式 · 入射方向 d 在法线 n 上的反射方向 r。'
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'panel-section' },
        React.createElement('div', { className: 'panel-label' }, '操作提示 / Tips'),
        React.createElement(
          'div',
          {
            style: {
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              lineHeight: '1.8',
              color: 'var(--text-tertiary)',
              letterSpacing: '0.03em',
            }
          }
        ),
        '调整各镜面角度，让激光束经过尽可能多的反射镜接力。每面镜子都可以独立旋转，观察法线与入射角、反射角的关系。试试让光线打满所有 4 面镜子？'
      )
    );
  }

  window.MirrorsExhibit = MirrorsExhibit;
  window.MirrorsControls = MirrorsControls;
})();
