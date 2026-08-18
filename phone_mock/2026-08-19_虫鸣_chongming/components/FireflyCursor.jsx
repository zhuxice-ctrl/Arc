// 萤火光标

function FireflyCursor() {
  const cursorRef = React.useRef(null);
  const posRef = React.useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const targetRef = React.useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const rafRef = React.useRef(null);
  const hoverRef = React.useRef(false);

  React.useEffect(() => {
    function updatePos() {
      const dx = targetRef.current.x - posRef.current.x;
      const dy = targetRef.current.y - posRef.current.y;
      posRef.current.x += dx * 0.15;
      posRef.current.y += dy * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.left = posRef.current.x + 'px';
        cursorRef.current.style.top = posRef.current.y + 'px';
      }
      rafRef.current = requestAnimationFrame(updatePos);
    }

    function onMove(e) {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
    }

    function onOver(e) {
      const target = e.target;
      if (target.closest('button, .tab-item, .insect-row, .insect-card, .settings-item, .alt-item, .nav-back, .record-btn')) {
        if (!hoverRef.current) {
          hoverRef.current = true;
          cursorRef.current?.classList.add('hover');
        }
      } else if (hoverRef.current) {
        hoverRef.current = false;
        cursorRef.current?.classList.remove('hover');
      }
    }

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    rafRef.current = requestAnimationFrame(updatePos);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <div ref={cursorRef} className="firefly-cursor" />;
}

// 环境星光和萤火虫
function AmbientStars() {
  const stars = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < 30; i++) {
      arr.push({
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        delay: Math.random() * 4 + 's',
        duration: 3 + Math.random() * 3 + 's'
      });
    }
    return arr;
  }, []);

  return (
    <div className="ambient-stars">
      {stars.map((s, i) => (
        <span
          key={i}
          style={{
            left: s.left,
            top: s.top,
            animationDelay: s.delay,
            animationDuration: s.duration
          }}
        />
      ))}
    </div>
  );
}

function AmbientFireflies() {
  const flies = React.useMemo(() => {
    return [
      { left: '15%', top: '30%', delay: '0s', duration: '10s' },
      { left: '80%', top: '20%', delay: '2s', duration: '12s' },
      { left: '25%', top: '70%', delay: '4s', duration: '8s' },
      { left: '70%', top: '60%', delay: '1s', duration: '11s' },
      { left: '50%', top: '85%', delay: '3s', duration: '9s' },
    ];
  }, []);

  return (
    <>
      {flies.map((f, i) => (
        <div
          key={i}
          className="ambient-firefly"
          style={{
            left: f.left,
            top: f.top,
            animationDelay: f.delay,
            animationDuration: f.duration
          }}
        />
      ))}
    </>
  );
}

window.FireflyCursor = FireflyCursor;
window.AmbientStars = AmbientStars;
window.AmbientFireflies = AmbientFireflies;
