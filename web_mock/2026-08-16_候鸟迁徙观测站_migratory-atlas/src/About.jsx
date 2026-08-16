/* ============================================================
   About - 观测站介绍
   特色：
   - 双栏：左侧文字（滚动渐入），右侧大事记时间线
   - 每段有羽毛分隔符
   - 年份数字放大 + 羽翼扫光
   ============================================================ */

function About() {
  const sectionRef = React.useRef(null);

  const milestones = [
    { year: '1987', title: '观测站成立', desc: '两位鸟类学家在北戴河建立首个民间候鸟观测点。' },
    { year: '1999', title: '全国联网', desc: '联合 12 个沿海城市组建迁徙观测网络。' },
    { year: '2012', title: '卫星追踪', desc: '首次为白鹤佩戴卫星追踪器，记录完整迁徙路径。' },
    { year: '2021', title: 'AI 识别上线', desc: '引入声纹 + 图像识别系统，日识别记录突破万条。' },
    { year: '2024', title: '全球数据共享', desc: '加入东亚-澳大利西亚迁飞区伙伴关系网络。' },
  ];

  React.useEffect(() => {
    if (!sectionRef.current) return;
    sectionRef.current.querySelectorAll('.reveal').forEach((el) => {
      RevealManager.observe(el);
    });
  }, []);

  return React.createElement('section', { ref: sectionRef, className: 'about section', id: 'about' },
    React.createElement('div', { className: 'container' },
      React.createElement('div', { className: 'about__header reveal' },
        React.createElement(SectionIndex, { num: '01', total: '05', label: 'ABOUT' }),
        React.createElement('h2', { className: 'about__title display-2' },
          '关于',
          React.createElement('em', null, ' Migratory Atlas'),
          React.createElement('br', null),
          '迁徙观测站'
        )
      ),

      React.createElement('div', { className: 'about__grid' },
        // 左侧介绍
        React.createElement('div', { className: 'about__text' },
          React.createElement('p', { className: 'body-lg reveal' },
            'Migratory Atlas 是一个独立的、非营利的候鸟迁徙观测组织。\n',
            '三十余年来，我们的观测员、志愿者和科学家们在东亚-澳大利西亚迁飞区沿线建立了 68 个野外观测站，',
            '追踪超过 300 种候鸟的年度迁徙。'
          ),
          React.createElement('div', { className: 'reveal about__divider' },
            React.createElement(FeatherDivider, null)
          ),
          React.createElement('p', { className: 'reveal' },
            '我们相信，每一次振翅都值得被记录。候鸟的迁徙路线是地球生态系统的脉搏，',
            '它们的来去连接着大陆与海洋，标记着季节与气候的变迁。',
            '通过持续的观测、严谨的数据和开放的共享，',
            '我们希望为这些天空的旅行者守住一条安全的回家路。'
          ),

          React.createElement('div', { className: 'about__stats reveal' },
            [
              { num: '37', unit: '年', label: '持续观测' },
              { num: '327', unit: '种', label: '记录物种' },
              { num: '12.8M', unit: '', label: '累计观测记录' },
              { num: '9', unit: '国', label: '国际协作' },
            ].map((s) =>
              React.createElement('div', { key: s.label, className: 'about__stat' },
                React.createElement('div', { className: 'about__stat-num' },
                  s.num,
                  React.createElement('span', { className: 'about__stat-unit' }, s.unit)
                ),
                React.createElement('div', { className: 'about__stat-label mono' }, s.label)
              )
            )
          )
        ),

        // 右侧时间线
        React.createElement('div', { className: 'about__timeline' },
          React.createElement('div', { className: 'about__timeline-title reveal' },
            React.createElement('span', { className: 'eyebrow' }, 'TIMELINE · 里程碑'),
          ),
          React.createElement('ul', { className: 'timeline' },
            milestones.map((m, i) =>
              React.createElement('li', {
                key: m.year,
                className: 'timeline__item reveal shimmer',
                style: { transitionDelay: `${i * 120}ms` },
                'data-cursor-hover': true,
              },
                React.createElement('span', { className: 'timeline__dot' }),
                React.createElement('div', { className: 'timeline__year display-2' }, m.year),
                React.createElement('div', { className: 'timeline__content' },
                  React.createElement('h4', { className: 'timeline__title' }, m.title),
                  React.createElement('p', { className: 'timeline__desc' }, m.desc)
                )
              )
            )
          )
        )
      )
    )
  );
}

const aboutStyles = `
.about {
  background: var(--color-eggshell);
}
.about__header {
  margin-bottom: 60px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.about__title em {
  font-style: italic;
  color: var(--color-sunset);
  font-weight: 300;
}
.about__grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 80px;
  align-items: start;
}
.about__text {
  display: flex;
  flex-direction: column;
  gap: 28px;
  color: var(--color-ink-soft);
  white-space: pre-line;
  line-height: 1.8;
}
.about__divider {
  color: var(--color-feather-mid);
  padding: 10px 0;
}
.about__divider svg { width: 160px; height: auto; }

.about__stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--color-feather-light);
}
.about__stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.about__stat-num {
  font-family: var(--font-display);
  font-size: 2.2rem;
  font-weight: 300;
  color: var(--color-ink);
  font-variation-settings: 'opsz' 40;
}
.about__stat-unit {
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--color-feather-dark);
  margin-left: 4px;
}
.about__stat-label {
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  color: var(--color-feather-dark);
  text-transform: uppercase;
}

/* 时间线 */
.about__timeline-title {
  margin-bottom: 24px;
}
.timeline {
  position: relative;
  list-style: none;
  padding-left: 0;
}
.timeline::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 10px;
  bottom: 10px;
  width: 1px;
  background: var(--color-feather-light);
}
.timeline__item {
  position: relative;
  padding: 16px 16px 16px 56px;
  margin-bottom: 8px;
  border-radius: 2px;
  transition: background 0.3s;
}
.timeline__item:hover {
  background: rgba(228, 87, 46, 0.04);
}
.timeline__dot {
  position: absolute;
  left: 14px;
  top: 24px;
  width: 13px;
  height: 13px;
  border: 1.5px solid var(--color-sunset);
  border-radius: 50%;
  background: var(--color-eggshell);
  transition: background 0.3s, transform 0.3s var(--ease-spring);
}
.timeline__item:hover .timeline__dot {
  background: var(--color-sunset);
  transform: scale(1.3);
}
.timeline__year {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 300;
  color: var(--color-sunset);
  font-variation-settings: 'opsz' 32;
  line-height: 1;
  margin-bottom: 6px;
}
.timeline__content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.timeline__title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-ink);
}
.timeline__desc {
  font-size: 0.9rem;
  color: var(--color-feather-dark);
  line-height: 1.6;
}

@media (max-width: 900px) {
  .about__grid {
    grid-template-columns: 1fr;
    gap: 60px;
  }
}
`;

(function injectAboutStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('about-styles')) return;
  const style = document.createElement('style');
  style.id = 'about-styles';
  style.textContent = aboutStyles;
  document.head.appendChild(style);
})();

Object.assign(window, { About });
