/* ============================================================
   Exhibit 03: Double-Slit Interference (双缝干涉)
   Physics: I = I₀ · cos²(π·d·sinθ / λ)
   - Adjust slit distance & wavelength → fringe pattern updates
   - Real-time intensity curve on screen
   - Animated wavefronts propagating from slits
   ============================================================ */

(function () {
  const { useEffect, useRef } = React;

  // Wavelength → RGB color approximation (visible spectrum 380-750nm)
  function wavelengthToColor(wavelength) {
    let r, g, b;
    if (wavelength >= 380 && wavelength < 440) {
      r = -(wavelength - 440) / (440 - 380);
      g = 0;
      b = 1;
    } else if (wavelength >= 440 && wavelength < 490) {
      r = 0;
      g = (wavelength - 440) / (490 - 440);
      b = 1;
    } else if (wavelength >= 490 && wavelength < 510) {
      r = 0;
      g = 1;
      b = -(wavelength - 510) / (510 - 490);
    } else if (wavelength >= 510 && wavelength < 580) {
      r = (wavelength - 510) / (580 - 510);
      g = 1;
      b = 0;
    } else if (wavelength >= 580 && wavelength < 645) {
      r = 1;
      g = -(wavelength - 645) / (645 - 580);
      b = 0;
    } else if (wavelength >= 645 && wavelength <= 750) {
      r = 1;
      g = 0;
      b = 0;
    } else {
      r = 0; g = 0; b = 0;
    }

    // Intensity correction
    let factor;
    if (wavelength >= 380 && wavelength < 420) {
      factor = 0.3 + (0.7 * (wavelength - 380)) / (420 - 380);
    } else if (wavelength >= 420 && wavelength <= 700) {
      factor = 1;
    } else if (wavelength > 700 && wavelength <= 750) {
      factor = 0.3 + (0.7 * (750 - wavelength)) / (750 - 700);
    } else {
      factor = 0;
    }

    r = Math.round(255 * Math.pow(r * factor, 0.8));
    g = Math.round(255 * Math.pow(g * factor, 0.8));
    b = Math.round(255 * Math.pow(b * factor, 0.8));

    return `rgb(${r}, ${g}, ${b})`;
  }

  function SlitsExhibit({ paramsRef }) {
    const canvasRef = useRef(null);
    const rafRef = useRef(null);
    const visibleRef = useRef(true);
    const timeRef = useRef(0);
    const reducedRef = useRef(false);
    const wavefrontsRef = useRef([]);
    const waveTimerRef = useRef(0);

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
        const d = params.slitDist;       // slit distance (px)
        const L = params.screenDist;      // distance to screen (px)
        const λ = params.wavelength;      // wavelength (nm)
        const scale = params.scale;       // scale factor for visualization

        // Wavelength in px (for visualizing wavefronts — not to real scale!)
        const lambdaPx = λ / 10 * scale;  // visual wavelength

        // Layout
        const barrierX = W * 0.35;
        const screenX = barrierX + L;
        const centerY = H * 0.5;

        // Slit positions
        const slit1Y = centerY - d / 2;
        const slit2Y = centerY + d / 2;

        // Draw incident plane wave (left side)
        drawIncidentWave(ctx, 0, barrierX, centerY, lambdaPx);

        // Draw barrier with two slits
        drawBarrier(ctx, barrierX, H, slit1Y, slit2Y);

        // Draw propagating wavefronts from each slit
        if (!reducedRef.current) {
          updateWavefronts(dt, barrierX, slit1Y, slit2Y, lambdaPx, L);
          drawWavefronts(ctx, barrierX, slit1Y, slit2Y, lambdaPx);
        }

        // Draw screen
        drawScreen(ctx, screenX, 0, H);

        // Calculate and draw interference pattern on screen
        drawInterferencePattern(ctx, screenX, H, d, L, λ, centerY);

        // Draw intensity curve (on right side overlay)
        drawIntensityCurve(ctx, screenX - 200, 20, 180, H - 40, d, L, λ, centerY);

        // Labels
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('双缝', barrierX, H - 15);
        ctx.fillText('屏幕', screenX, H - 15);

        // Dimension indicators
        drawDimLine(ctx, barrierX, H - 40, screenX, H - 40, 'L = ' + L.toFixed(0) + 'px');
        drawDimLineVertical(ctx, barrierX - 20, slit1Y, slit2Y, 'd = ' + d.toFixed(0) + 'px');
      }

      function updateWavefronts(dt, bx, s1y, s2y, lambdaPx, L) {
        waveTimerRef.current += dt;
        // Emit new wavefront every few frames
        const emitInterval = 0.15;
        if (waveTimerRef.current > emitInterval) {
          waveTimerRef.current = 0;
          wavefrontsRef.current.push({ radius: lambdaPx * 0.5, life: 1 });
        }

        // Propagate
        const speed = lambdaPx * 3; // radial speed per second
        for (let i = wavefrontsRef.current.length - 1; i >= 0; i--) {
          const w = wavefrontsRef.current[i];
          w.radius += speed * dt;
          w.life = Math.max(0, 1 - w.radius / (L + 50));
          if (w.radius > L + 50) wavefrontsRef.current.splice(i, 1);
        }
      }

      function drawWavefronts(ctx, bx, s1y, s2y, lambdaPx) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        for (const w of wavefrontsRef.current) {
          const alpha = w.life * 0.15;

          ctx.strokeStyle = `rgba(255, 179, 71, ${alpha})`;
          ctx.lineWidth = 1;
          // Only draw right half (forward direction)
          ctx.beginPath();
          ctx.arc(bx, s1y, w.radius, -Math.PI / 2, Math.PI / 2);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(bx, s2y, w.radius, -Math.PI / 2, Math.PI / 2);
          ctx.stroke();
        }

        ctx.restore();
      }

      function drawIncidentWave(ctx, x1, x2, cy, lambdaPx) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 179, 71, 0.25)';
        ctx.lineWidth = 1;

        const offset = (timeRef.current * lambdaPx * 2) % lambdaPx;

        for (let x = x1 + offset; x < x2; x += lambdaPx) {
          ctx.beginPath();
          ctx.moveTo(x, 20);
          ctx.lineTo(x, cy - 80);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x, cy + 80);
          ctx.lineTo(x, canvasRef.current ? canvasRef.current.height : 600);
          ctx.stroke();
        }

        // Direction arrow
        ctx.fillStyle = 'rgba(255, 179, 71, 0.4)';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('入射波 →', (x1 + x2) / 2, 40);

        ctx.restore();
      }

      function drawBarrier(ctx, x, H, s1y, s2y) {
        // Barrier
        ctx.fillStyle = '#1a1a24';
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1;

        const bw = 12; // barrier width

        // Top segment
        ctx.fillRect(x - bw / 2, 20, bw, s1y - 20 - 3);
        ctx.strokeRect(x - bw / 2, 20, bw, s1y - 20 - 3);

        // Middle segment (between slits)
        ctx.fillRect(x - bw / 2, s1y + 3, bw, s2y - s1y - 6);
        ctx.strokeRect(x - bw / 2, s1y + 3, bw, s2y - s1y - 6);

        // Bottom segment
        const canvasH = canvasRef.current ? canvasRef.current.height : 600;
        ctx.fillRect(x - bw / 2, s2y + 3, bw, canvasH - s2y - 23);
        ctx.strokeRect(x - bw / 2, s2y + 3, bw, canvasH - s2y - 23);

        // Slit highlights
        ctx.fillStyle = 'rgba(255, 179, 71, 0.3)';
        ctx.fillRect(x - bw / 2 - 2, s1y - 3, bw + 4, 6);
        ctx.fillRect(x - bw / 2 - 2, s2y - 3, bw + 4, 6);

        // Slit glow
        const g1 = ctx.createRadialGradient(x, s1y, 0, x, s1y, 15);
        g1.addColorStop(0, 'rgba(255, 179, 71, 0.3)');
        g1.addColorStop(1, 'transparent');
        ctx.fillStyle = g1;
        ctx.beginPath();
        ctx.arc(x, s1y, 15, 0, Math.PI * 2);
        ctx.fill();

        const g2 = ctx.createRadialGradient(x, s2y, 0, x, s2y, 15);
        g2.addColorStop(0, 'rgba(255, 179, 71, 0.3)');
        g2.addColorStop(1, 'transparent');
        ctx.fillStyle = g2;
        ctx.beginPath();
        ctx.arc(x, s2y, 15, 0, Math.PI * 2);
        ctx.fill();
      }

      function drawScreen(ctx, x, topY, height) {
        ctx.fillStyle = 'rgba(255,255,255,0.03)';
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1;
        ctx.fillRect(x - 4, topY + 20, 8, height - 40);
        ctx.strokeRect(x - 4, topY + 20, 8, height - 40);
      }

      function drawInterferencePattern(ctx, screenX, H, d, L, lambdaNm, centerY) {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const lambdaPx = lambdaNm * 1e-6; // nm → px (rough visual scale)
        // We use real formula with visual scaling
        // For visual purposes, let's scale wavelength to produce visible fringes
        const lambdaVisual = lambdaNm / 500; // normalized so green ~1

        ctx.save();
        const patternW = 30;
        const patternLeft = screenX - patternW / 2;

        // Draw per-pixel intensity pattern
        const imageData = ctx.createImageData(patternW, H - 40);
        const data = imageData.data;

        const color = wavelengthToColor(lambdaNm);
        const [r, g, b] = color.match(/\d+/g).map(Number);

        for (let y = 0; y < H - 40; y++) {
          const yRel = y - (H - 40) / 2; // relative to center
          // sinθ ≈ tanθ = y/L for small angles
          const sinTheta = yRel / L;
          // Phase difference: δ = 2π·d·sinθ/λ
          // I = I₀ · cos²(π·d·sinθ/λ)
          const phase = Math.PI * d * sinTheta * lambdaVisual / 50;
          const intensity = Math.pow(Math.cos(phase), 2);
          // Add single-slit envelope (simplified)
          const envelope = 1; // skip for clarity

          const I = intensity * envelope;

          for (let x = 0; x < patternW; x++) {
            const idx = (y * patternW + x) * 4;
            data[idx] = Math.min(255, r * I);
            data[idx + 1] = Math.min(255, g * I);
            data[idx + 2] = Math.min(255, b * I);
            data[idx + 3] = 255 * I * 0.95;
          }
        }

        ctx.putImageData(imageData, patternLeft, 20);

        // Glow overlay
        ctx.globalCompositeOperation = 'screen';
        ctx.filter = 'blur(4px)';
        ctx.drawImage(canvas, patternLeft, 20, patternW, H - 40, patternLeft - 8, 20, patternW + 16, H - 40);
        ctx.filter = 'none';
        ctx.globalCompositeOperation = 'source-over';

        ctx.restore();
      }

      function drawIntensityCurve(ctx, x, y, w, h, d, L, lambdaNm, centerY) {
        const lambdaVisual = lambdaNm / 500;
        const color = wavelengthToColor(lambdaNm);

        ctx.save();

        // Axes
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(x, y + h);
        ctx.lineTo(x + w, y + h);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + h);
        ctx.stroke();

        // Curve
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.beginPath();

        const steps = 200;
        for (let i = 0; i <= steps; i++) {
          const yRel = (i / steps - 0.5) * h;
          const sinTheta = yRel / L * 1.5;
          const phase = Math.PI * d * sinTheta * lambdaVisual / 50;
          const I = Math.pow(Math.cos(phase), 2);

          const px = x + (1 - I) * w * 0.8 + w * 0.1;
          const py = y + i / steps * h;

          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Labels
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('I(y)', x + w / 2, y - 6);
        ctx.fillText('强度分布', x + w / 2, y + h + 14);

        ctx.restore();
      }

      function drawDimLine(ctx, x1, y, x2, y2, label) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 0.5;
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.textAlign = 'center';

        // Horizontal line
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();

        // Ticks
        ctx.beginPath();
        ctx.moveTo(x1, y - 4);
        ctx.lineTo(x1, y + 4);
        ctx.moveTo(x2, y - 4);
        ctx.lineTo(x2, y + 4);
        ctx.stroke();

        // Label (background pill)
        const tw = ctx.measureText(label).width + 8;
        ctx.fillStyle = 'rgba(10,10,15,0.8)';
        ctx.fillRect((x1 + x2) / 2 - tw / 2, y - 7, tw, 14);
        ctx.fillStyle = 'rgba(255, 179, 71, 0.8)';
        ctx.fillText(label, (x1 + x2) / 2, y + 3);

        ctx.restore();
      }

      function drawDimLineVertical(ctx, x, y1, y2, label) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.fillStyle = 'rgba(255, 179, 71, 0.8)';
        ctx.lineWidth = 0.5;
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.textAlign = 'right';

        // Vertical line
        ctx.beginPath();
        ctx.moveTo(x, y1);
        ctx.lineTo(x, y2);
        ctx.stroke();

        // Ticks
        ctx.beginPath();
        ctx.moveTo(x - 4, y1);
        ctx.lineTo(x + 4, y1);
        ctx.moveTo(x - 4, y2);
        ctx.lineTo(x + 4, y2);
        ctx.stroke();

        // Label
        ctx.fillText(label, x - 8, (y1 + y2) / 2 + 3);

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

  function SlitsControls({ params, onChange }) {
    const d = params.slitDist;
    const L = params.screenDist;
    const λ = params.wavelength;

    // Fringe spacing: Δy = λL/d
    // Visual fringe spacing (scaled)
    const fringeSpacing = (λ / 500) * L / d * 50; // visual approximation

    const color = wavelengthToColor(λ);

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
              name: '缝距 d',
              value: d.toFixed(0),
              unit: 'px',
              min: 10,
              max: 120,
              percent: (d - 10) / (120 - 10) * 100,
              paramKey: 'slitDist',
              onChange: onChange,
            }
          ),
          React.createElement(
            window.SliderItem,
            {
              name: '屏距 L',
              value: L.toFixed(0),
              unit: 'px',
              min: 150,
              max: 400,
              percent: (L - 150) / (400 - 150) * 100,
              paramKey: 'screenDist',
              onChange: onChange,
            }
          ),
          React.createElement(
            window.SliderItem,
            {
              name: '波长 λ',
              value: λ.toFixed(0),
              unit: 'nm',
              min: 380,
              max: 750,
              percent: (λ - 380) / (750 - 380) * 100,
              paramKey: 'wavelength',
              onChange: onChange,
            }
          )
        ),
        // Wavelength color preview
        React.createElement(
          'div',
          {
            style: {
              marginTop: '16px',
              height: '4px',
              borderRadius: '2px',
              background: 'linear-gradient(90deg, #8B5CF6, #3B82F6, #22D3EE, #4ADE80, #FACC15, #F97316, #EF4444)',
              position: 'relative',
            }
          },
          React.createElement('div', {
            style: {
              position: 'absolute',
              top: '-4px',
              left: ((λ - 380) / (750 - 380) * 100) + '%',
              transform: 'translateX(-50%)',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: color,
              boxShadow: `0 0 8px ${color}`,
              border: '1.5px solid rgba(255,255,255,0.6)',
            },
          })
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
            'δ = 2π · d sinθ / λ'
          ),
          React.createElement(
            'div',
            { className: 'formula-desc' },
            '相位差 · 从两缝到达屏上同一点的光程差决定干涉加强或相消。'
          )
        ),
        React.createElement(
          'div',
          { style: { marginTop: '14px' }, className: 'formula-box' },
          React.createElement(
            'div',
            { className: 'formula-expr' },
            'I = I₀ · cos²(π d sinθ / λ)'
          ),
          React.createElement(
            'div',
            { className: 'formula-desc' },
            '双缝干涉光强分布 · 余弦平方规律，明纹等间距分布。'
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
            React.createElement('div', { className: 'readout-label' }, '条纹间距 Δy'),
            React.createElement(
              'div',
              { className: 'readout-value' },
              fringeSpacing.toFixed(1),
              React.createElement('span', { className: 'unit' }, 'px')
            )
          ),
          React.createElement(
            'div',
            { className: 'readout' },
            React.createElement('div', { className: 'readout-label' }, '明纹级次 k'),
            React.createElement(
              'div',
              { className: 'readout-value' },
              '0, ±1, ±2…'
            )
          ),
          React.createElement(
            'div',
            { className: 'readout', style: { gridColumn: 'span 2' } },
            React.createElement('div', { className: 'readout-label' }, '光色'),
            React.createElement(
              'div',
              {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginTop: '4px',
                }
              }
            ),
            React.createElement(
              'div',
              {
                style: {
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: color,
                  boxShadow: `0 0 12px ${color}`,
                },
              }
            ),
            React.createElement(
              'span',
              { style: { fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-primary)' } },
              λ.toFixed(0) + ' nm'
            )
          )
        )
      )
    );
  }

  window.SlitsExhibit = SlitsExhibit;
  window.SlitsControls = SlitsControls;
  window.wavelengthToColor = wavelengthToColor;
})();
