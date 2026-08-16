/* ============================================================
   Footer - 页脚
   特色：
   - 迁徙飞线最终落点
   - 联系方式 + 社交链接
   - 回到顶部按钮（羽翼形）
   - 版权信息
   ============================================================ */

function Footer() {
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return React.createElement('footer', { className: 'footer' },
    // 顶部飞线装饰
    React.createElement('div', { className: 'footer__flyline', 'aria-hidden': 'true' },
      React.createElement('svg', { viewBox: '0 0 1440 120', preserveAspectRatio: 'none' },
        React.createElement('path', {
          d: 'M 0 80 C 300 20, 600 100, 900 40 S 1300 90, 1440 30',
          stroke: '#E4572E',
          strokeWidth: '1',
          fill: 'none',
          strokeDasharray: '4 6',
          opacity: '0.4'
        }),
        React.createElement('circle', { cx: '1440', cy: '30', r: '5', fill: '#E4572E' }),
        React.createElement('circle', { cx: '1440', cy: '30', r: '10', fill: 'none', stroke: '#E4572E', strokeWidth: '1', opacity: '0.5' }),
      )
    ),

    React.createElement('div', { className: 'container' },
      React.createElement('div', { className: 'footer__grid' },
        // 品牌
        React.createElement('div', { className: 'footer__brand' },
          React.createElement('a', {
            href: '#top',
            className: 'footer__logo',
            onClick: (e) => { e.preventDefault(); scrollTop(); },
            'data-cursor-hover': true,
          },
            React.createElement('span', { className: 'footer__logo-mark' },
              React.createElement('svg', { viewBox: '0 0 32 32', fill: 'none' },
                React.createElement('path', {
                  d: 'M4 20 C 10 18, 12 10, 18 10 C 24 10, 28 18, 28 22',
                  stroke: 'currentColor', strokeWidth: '1.2', strokeLinecap: 'round'
                }),
                React.createElement('path', {
                  d: 'M18 10 L 18 6 M22 13 L 24 9 M14 13 L 12 10',
                  stroke: 'currentColor', strokeWidth: '0.8', strokeLinecap: 'round'
                }),
                React.createElement('circle', { cx: '16', cy: '22', r: '1.5', fill: 'currentColor' })
              )
            ),
            React.createElement('span', null,
              React.createElement('span', { className: 'footer__logo-main' }, 'Migratory Atlas'),
              React.createElement('span', { className: 'footer__logo-sub mono' }, '迁徙观测站')
            )
          ),
          React.createElement('p', { className: 'footer__tagline' },
            '记录每一次振翅，守护每一条回家的路。'
          ),
          React.createElement('div', { className: 'footer__socials' },
            ['WeChat', 'Weibo', 'Bilibili', 'Email'].map((s) =>
              React.createElement('a', {
                key: s, href: '#',
                className: 'social-btn',
                'data-cursor-hover': true,
                onClick: (e) => e.preventDefault(),
              },
                React.createElement('span', { className: 'mono' }, s.slice(0, 2).toUpperCase()),
                React.createElement('span', { className: 'social-btn__full' }, s)
              )
            )
          )
        ),

        // 链接列
        React.createElement('div', { className: 'footer__col' },
          React.createElement('h4', { className: 'footer__col-title eyebrow' }, 'Explore'),
          React.createElement('ul', null,
            ['观测站介绍', '迁徙走廊', '物种图鉴', '观测日志'].map((item) =>
              React.createElement('li', { key: item },
                React.createElement('a', { href: '#', 'data-cursor-hover': true, onClick: (e) => e.preventDefault() }, item)
              )
            )
          )
        ),

        React.createElement('div', { className: 'footer__col' },
          React.createElement('h4', { className: 'footer__col-title eyebrow' }, 'Community'),
          React.createElement('ul', null,
            ['志愿者招募', '科研合作', '教育项目', '捐赠支持'].map((item) =>
              React.createElement('li', { key: item },
                React.createElement('a', { href: '#', 'data-cursor-hover': true, onClick: (e) => e.preventDefault() }, item)
              )
            )
          )
        ),

        // 订阅
        React.createElement('div', { className: 'footer__col footer__col--wide' },
          React.createElement('h4', { className: 'footer__col-title eyebrow' }, 'Newsletter'),
          React.createElement('p', { className: 'footer__newsletter-desc' },
            '订阅我们的月度迁徙简报，第一时间了解候鸟动态。'
          ),
          React.createElement('form', {
            className: 'footer__subscribe',
            onSubmit: (e) => {
              e.preventDefault();
              const input = e.target.querySelector('input');
              if (input && input.value) {
                input.value = '';
                input.placeholder = '已订阅，感谢关注';
              }
            }
          },
            React.createElement('input', {
              type: 'email', placeholder: 'your@email.com', required: true,
              'data-cursor-hover': true,
            }),
            React.createElement('button', {
              type: 'submit',
              className: 'btn btn--fill',
              'data-cursor-hover': true,
            }, '订阅',
              React.createElement('span', { className: 'btn__arrow' }, '→')
            )
          )
        )
      ),

      React.createElement('div', { className: 'footer__bottom' },
        React.createElement('div', { className: 'footer__copyright mono' },
          '© 2026 Migratory Atlas · 候鸟迁徙观测站 · All rights reserved'
        ),
        React.createElement('div', { className: 'footer__meta' },
          React.createElement('span', { className: 'mono' }, 'Est. 1987'),
          React.createElement('span', { className: 'footer__divider' }),
          React.createElement('span', { className: 'mono' }, 'N 39.92° / E 116.39°'),
          React.createElement('span', { className: 'footer__divider' }),
          React.createElement('span', { className: 'mono' }, '68 Stations')
        )
      )
    ),

    // 回到顶部
    React.createElement('button', {
      className: 'back-to-top',
      onClick: scrollTop,
      'data-cursor-hover': true,
      'data-cursor-label': '回到顶部',
      'aria-label': 'Back to top',
    },
      React.createElement('svg', { viewBox: '0 0 32 32', fill: 'none' },
        React.createElement('path', {
          d: 'M 16 26 L 16 10', stroke: 'currentColor', strokeWidth: '1.5', strokeLinecap: 'round'
        }),
        React.createElement('path', {
          d: 'M 10 16 L 16 10 L 22 16', stroke: 'currentColor', strokeWidth: '1.5',
          strokeLinecap: 'round', strokeLinejoin: 'round'
        }),
        React.createElement('path', {
          d: 'M 6 26 C 10 22, 12 18, 16 18 C 20 18, 22 22, 26 26',
          stroke: 'currentColor', strokeWidth: '0.8', opacity: '0.5'
        })
      )
    )
  );
}

const footerStyles = `
.footer {
  background: var(--color-ink);
  color: var(--color-feather-mid);
  padding: 80px 0 30px;
  position: relative;
  overflow: hidden;
}
.footer__flyline {
  position: absolute;
  top: -1px;
  left: 0;
  width: 100%;
  height: 120px;
  overflow: hidden;
}
.footer__flyline svg {
  width: 100%;
  height: 100%;
}

.footer__grid {
  display: grid;
  grid-template-columns: 1.5fr 0.8fr 0.8fr 1.5fr;
  gap: 40px;
  padding-bottom: 60px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.footer__brand {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.footer__logo {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-eggshell);
}
.footer__logo-mark {
  width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  color: var(--color-sunset);
}
.footer__logo-mark svg { width: 28px; height: 28px; }
.footer__logo-main {
  display: block;
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 500;
  color: var(--color-eggshell);
}
.footer__logo-sub {
  display: block;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  color: var(--color-feather-dark);
  margin-top: 2px;
}
.footer__tagline {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1rem;
  color: var(--color-feather-mid);
  line-height: 1.6;
  max-width: 280px;
}
.footer__socials {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
}
.social-btn {
  position: relative;
  padding: 8px 14px;
  border: 1px solid rgba(255,255,255,0.15);
  background: transparent;
  font-size: 0.8rem;
  color: var(--color-feather-mid);
  transition: all 0.3s;
  overflow: hidden;
}
.social-btn:hover {
  border-color: var(--color-sunset);
  color: var(--color-sunset);
}
.social-btn__full {
  display: none;
}

.footer__col {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.footer__col-title {
  color: var(--color-eggshell);
  font-size: 0.7rem;
  letter-spacing: 0.15em;
}
.footer__col ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.footer__col li a {
  font-size: 0.9rem;
  color: var(--color-feather-mid);
  transition: color 0.25s, padding-left 0.25s;
  position: relative;
  padding-left: 0;
}
.footer__col li a:hover {
  color: var(--color-eggshell);
  padding-left: 10px;
}
.footer__col li a::before {
  content: '→';
  position: absolute;
  left: 0;
  opacity: 0;
  transition: opacity 0.25s;
  color: var(--color-sunset);
}
.footer__col li a:hover::before {
  opacity: 1;
}

.footer__newsletter-desc {
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--color-feather-mid);
  margin-bottom: 8px;
}
.footer__subscribe {
  display: flex;
  gap: 0;
  border: 1px solid rgba(255,255,255,0.15);
  transition: border-color 0.3s;
}
.footer__subscribe:focus-within {
  border-color: var(--color-sunset);
}
.footer__subscribe input {
  flex: 1;
  padding: 12px 14px;
  border: none;
  background: transparent;
  color: var(--color-eggshell);
  font-family: var(--font-body);
  font-size: 0.85rem;
  outline: none;
}
.footer__subscribe input::placeholder {
  color: var(--color-feather-dark);
}
.footer__subscribe .btn {
  border: none;
  border-left: 1px solid rgba(255,255,255,0.15);
  padding: 12px 18px;
  font-size: 0.7rem;
  color: var(--color-feather-mid);
}
.footer__subscribe .btn::before {
  background: var(--color-sunset);
}
.footer__subscribe .btn:hover {
  color: var(--color-eggshell);
  border-left-color: var(--color-sunset);
}

.footer__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24px;
  font-size: 0.7rem;
  color: var(--color-feather-dark);
  flex-wrap: wrap;
  gap: 12px;
}
.footer__copyright {
  letter-spacing: 0.05em;
}
.footer__meta {
  display: flex;
  align-items: center;
  gap: 12px;
}
.footer__divider {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--color-feather-dark);
}

/* 回到顶部 */
.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 48px;
  height: 48px;
  background: var(--color-eggshell);
  color: var(--color-ink);
  border: 1px solid var(--color-feather-light);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
  transition: all 0.4s var(--ease-out);
  opacity: 0;
  transform: translateY(20px);
  pointer-events: none;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}
.back-to-top.is-visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
.back-to-top:hover {
  background: var(--color-sunset);
  color: var(--color-eggshell);
  border-color: var(--color-sunset);
  transform: translateY(-4px);
}
.back-to-top svg {
  width: 20px;
  height: 20px;
  transition: transform 0.3s var(--ease-spring);
}
.back-to-top:hover svg {
  transform: translateY(-2px);
}

@media (max-width: 900px) {
  .footer__grid {
    grid-template-columns: 1fr 1fr;
    gap: 40px 30px;
  }
  .footer__brand { grid-column: 1 / -1; }
  .footer__col--wide { grid-column: 1 / -1; }
  .back-to-top {
    bottom: 20px;
    right: 20px;
    width: 42px;
    height: 42px;
  }
}
@media (max-width: 480px) {
  .footer__grid {
    grid-template-columns: 1fr;
  }
}
`;

(function injectFooterStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('footer-styles')) return;
  const style = document.createElement('style');
  style.id = 'footer-styles';
  style.textContent = footerStyles;
  document.head.appendChild(style);
})();

// 回到顶部显示控制
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', throttle(() => {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;
    if (window.scrollY > 600) btn.classList.add('is-visible');
    else btn.classList.remove('is-visible');
  }, 100));
}

Object.assign(window, { Footer });
