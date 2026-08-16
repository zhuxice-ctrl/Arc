/* =========================================================
   Hero — 首屏洞窟内景
   - 多层视差滚动（背景推进 + 标题逆推）
   - 打字机效果副标题
   - 滚动指示
   ========================================================= */

const { useEffect, useRef, useState } = React;

// 图片地址（generate_image 产出）
const HERO_IMG = '/spark/app/app_17c7ssvjn08/runtime/api/v1/storage/object/bucket_aadkqgfafgseo_static/static%2Faadkqf4rczoeu_ve_miaoda';

function Hero() {
  const bgRef = useRef(null);
  const contentRef = useRef(null);
  const [typed, setTyped] = useState('');

  // ---- 打字机效果 ----
  useEffect(() => {
    const text = '在沙岩深处，举一把火把，\n走入千年未散的颜料与光影。';
    let i = 0;
    let timerId = null;

    function typeNext() {
      if (i >= text.length) return;
      i++;
      setTyped(text.slice(0, i));
      // 随机节拍：换行处停顿，其余节奏变化
      const nextChar = text[i] || '';
      let delay = 60 + Math.random() * 80;
      if (nextChar === '\n') delay = 400;
      else if (nextChar === '，' || nextChar === '。') delay = 220 + Math.random() * 120;
      timerId = setTimeout(typeNext, delay);
    }

    // 初始延迟
    timerId = setTimeout(typeNext, 600);

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  // ---- 视差滚动（直接操作 DOM transform）----
  useEffect(() => {
    if (DH.prefersReducedMotion()) return;
    const bg = bgRef.current;
    const content = contentRef.current;
    if (!bg || !content) return;

    const onScroll = DH.rafThrottle(() => {
      const y = window.scrollY;
      if (y > window.innerHeight) return;
      // 背景：向上缓慢移动（推进感），同时略微放大
      const translateY = y * 0.4;
      const scale = 1 + y * 0.0003;
      bg.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
      // 内容：略微上移 + 淡出
      const opacity = Math.max(0, 1 - y / (window.innerHeight * 0.6));
      const contentY = y * 0.15;
      content.style.transform = `translate3d(0, ${contentY}px, 0)`;
      content.style.opacity = opacity;
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleCTA = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: DH.prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  return (
    <section className="hero" id="top" data-screen-label="hero">
      <div className="hero-bg" ref={bgRef} aria-hidden="true">
        <img src={HERO_IMG} alt="敦煌洞窟内景" />
      </div>

      <div className="container">
        <div className="hero-content" ref={contentRef}>
          <div className="hero-eyebrow reveal">
            Dunhuang Vault · 壁画数字展
          </div>
          <h1 className="hero-title reveal delay-1">
            敦 煌 <span className="accent">画窟</span>
          </h1>
          <p className="hero-subtitle reveal delay-2" style={{ whiteSpace: 'pre-line', minHeight: '5em' }}>
            {typed}
            <span className="caret" aria-hidden="true" style={{
              display: 'inline-block',
              width: '2px',
              height: '1.1em',
              background: '#C8963E',
              marginLeft: '2px',
              verticalAlign: '-0.15em',
              animation: 'blink 1.1s steps(1) infinite',
            }}></span>
          </p>
          <div className="hero-cta-row reveal delay-3">
            <a href="#caves" className="btn btn-primary" onClick={(e) => handleCTA(e, '#caves')}>
              <span>开启观览</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a href="#stories" className="btn btn-ghost" onClick={(e) => handleCTA(e, '#stories')}>
              壁画故事
            </a>
          </div>
        </div>
      </div>

      <div className="hero-scroll-indicator" aria-hidden="true">
        <span>向下探索</span>
        <div className="line"></div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          50.01%, 100% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}

window.Hero = Hero;
