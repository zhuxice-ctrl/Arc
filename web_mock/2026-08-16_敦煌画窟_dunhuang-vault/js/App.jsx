/* =========================================================
   App — 主应用
   组装所有区块，初始化 reveal 观察器
   ========================================================= */

const { useEffect } = React;

function App() {
  useEffect(() => {
    // 初始化滚动渐入（首屏元素立即显示）
    if (DH.prefersReducedMotion()) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
      return;
    }

    // 首屏元素立即显示
    const heroReveals = document.querySelectorAll('.hero .reveal');
    setTimeout(() => {
      heroReveals.forEach(el => el.classList.add('is-visible'));
    }, 200);

    // 其余元素通过 IntersectionObserver
    let io = null;
    // 延迟一点，等 DOM 完全稳定
    const initTimer = setTimeout(() => {
      io = DH.observeReveal('.section .reveal, .footer .reveal', {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px',
      });
    }, 400);

    return () => {
      clearTimeout(initTimer);
      if (io && io.disconnect) io.disconnect();
    };
  }, []);

  return (
    <>
      <TorchCursor />
      <Particles />
      <Nav />
      <main>
        <Hero />
        <Caves />
        <Stories />
        <Pigments />
        <Altar />
        <Caisson />
      </main>
      <Footer />
    </>
  );
}

// 挂载
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
