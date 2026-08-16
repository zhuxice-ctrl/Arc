/* ============================================================
   Custom Cursor Component
   - White ring + amber inner dot + multi-layer glow
   - Hover morph + click ripple
   - RAF-based smooth follow (lerp)
   - Respects prefers-reduced-motion
   ============================================================ */

const { useEffect, useRef, useState } = React;

function CustomCursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const ripplesRef = useRef([]);
  const rafRef = useRef(null);
  const visibleRef = useRef(true);
  const hoverRef = useRef(false);

  // Target + current position for lerp
  const targetRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const currentRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  const [ripples, setRipples] = useState([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    // Initialize at center
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    targetRef.current = { x: cx, y: cy };
    currentRef.current = { x: cx, y: cy };

    const onMove = (e) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
    };

    const onOver = (e) => {
      const el = e.target;
      const interactive = el.closest(
        'button, a, input, .slider-thumb, .nav-item, [data-interactive]'
      );
      hoverRef.current = !!interactive;
      if (ringRef.current) {
        ringRef.current.classList.toggle('hover', !!interactive);
      }
      if (dotRef.current) {
        dotRef.current.classList.toggle('hover', !!interactive);
      }
    };

    const onClick = (e) => {
      if (reducedMotion) return;
      const id = Date.now() + Math.random();
      const ripple = { id, x: e.clientX, y: e.clientY };
      setRipples((prev) => [...prev, ripple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    };

    const onVisibility = () => {
      visibleRef.current = document.visibilityState === 'visible';
      if (visibleRef.current && !rafRef.current) {
        loop();
      }
    };

    const loop = () => {
      if (!visibleRef.current) {
        rafRef.current = null;
        return;
      }

      const { x: tx, y: ty } = targetRef.current;
      const cur = currentRef.current;

      if (reducedMotion) {
        cur.x = tx;
        cur.y = ty;
      } else {
        // Lerp — ring follows more slowly than dot
        cur.x += (tx - cur.x) * 0.18;
        cur.y += (ty - cur.y) * 0.18;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${cur.x}px, ${cur.y}px) translate(-50%, -50%)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('click', onClick);
    document.addEventListener('visibilitychange', onVisibility);

    loop();

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('click', onClick);
      document.removeEventListener('visibilitychange', onVisibility);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [reducedMotion]);

  return React.createElement(
    'div',
    { className: 'cursor-wrap' },
    React.createElement('div', { ref: ringRef, className: 'cursor-ring' }),
    React.createElement('div', { ref: dotRef, className: 'cursor-dot' }),
    ripples.map((r) =>
      React.createElement('div', {
        key: r.id,
        className: 'cursor-ripple',
        style: {
          left: r.x + 'px',
          top: r.y + 'px',
        },
      })
    )
  );
}

window.CustomCursor = CustomCursor;
