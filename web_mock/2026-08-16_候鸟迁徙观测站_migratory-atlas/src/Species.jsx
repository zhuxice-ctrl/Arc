/* ============================================================
   Species - 物种图鉴
   特色：
   - 3D 倾斜卡片（mousemove 直接操作 DOM transform）
   - 悬停时羽翼展开感（放大 + 发光）
   - 点击打开详情弹窗（动画展开）
   - 筛选标签（涉禽 / 游禽 / 猛禽 / 鸣禽）
   ============================================================ */

function Species() {
  const sectionRef = React.useRef(null);
  const [filter, setFilter] = React.useState('all');
  const [selected, setSelected] = React.useState(null);
  const modalRef = React.useRef(null);

  const filters = [
    { id: 'all', name: '全部', en: 'All' },
    { id: 'wading', name: '涉禽', en: 'Wading' },
    { id: 'waterfowl', name: '游禽', en: 'Waterfowl' },
    { id: 'raptor', name: '猛禽', en: 'Raptor' },
    { id: 'passerine', name: '鸣禽', en: 'Passerine' },
  ];

  const species = [
    {
      id: 'crane',
      name: '白鹤',
      en: 'Siberian Crane',
      latin: 'Leucogeranus leucogeranus',
      category: 'wading',
      status: '极危',
      wingspan: '210-250 cm',
      weight: '4.9-8.6 kg',
      distance: '5,000+ km',
      speed: '60-80 km/h',
      color: '#FFFFFF',
      accent: '#E4572E',
      desc: '白鹤是世界上最稀有的鹤类之一，全身雪白，仅初级飞羽为黑色。每年秋季从西伯利亚繁殖地南迁到中国鄱阳湖越冬，迁徙距离超过 5000 公里。',
      route: '西伯利亚 → 辽河平原 → 黄河三角洲 → 鄱阳湖',
      population: '约 3,500 只',
    },
    {
      id: 'spoonbill',
      name: '黑脸琵鹭',
      en: 'Black-faced Spoonbill',
      latin: 'Platalea minor',
      category: 'wading',
      status: '濒危',
      wingspan: '110-130 cm',
      weight: '1-1.5 kg',
      distance: '2,000 km',
      speed: '40-50 km/h',
      color: '#F5F1E8',
      accent: '#1C1B1A',
      desc: '黑脸琵鹭因扁平如琵琶的黑色喙而得名，是东亚特有鸟类。繁殖于朝鲜半岛西部海岸，冬季迁徙至中国南部沿海及台湾、越南北部。',
      route: '朝鲜半岛 → 山东半岛 → 长江口 → 台湾/海南',
      population: '约 6,000 只',
    },
    {
      id: 'goose',
      name: '斑头雁',
      en: 'Bar-headed Goose',
      latin: 'Anser indicus',
      category: 'waterfowl',
      status: '无危',
      wingspan: '140-160 cm',
      weight: '2-3 kg',
      distance: '3,000 km',
      speed: '60-70 km/h',
      color: '#D9D4CA',
      accent: '#1C1B1A',
      desc: '斑头雁是世界上飞得最高的鸟类之一，迁徙时飞越喜马拉雅山脉，最高飞行高度可达 8000 米以上。它们的血红蛋白能高效结合氧气，适应高原稀薄空气。',
      route: '青藏高原 → 横断山脉 → 印度次大陆',
      population: '约 80,000 只',
    },
    {
      id: 'swift',
      name: '普通雨燕',
      en: 'Common Swift',
      latin: 'Apus apus',
      category: 'passerine',
      status: '无危',
      wingspan: '40-44 cm',
      weight: '35-50 g',
      distance: '10,000+ km',
      speed: '110 km/h (max)',
      color: '#1C1B1A',
      accent: '#E4572E',
      desc: '雨燕是天空的精灵——除了筑巢产卵，它们几乎终生在空中度过，进食、饮水、甚至睡觉都在飞行中。北京雨燕每年迁徙至南非越冬，往返距离超过两万公里。',
      route: '北京 → 中亚 → 阿拉伯半岛 → 南非',
      population: '约 9,500 万只（全球）',
    },
    {
      id: 'eagle',
      name: '白尾海雕',
      en: 'White-tailed Eagle',
      latin: 'Haliaeetus albicilla',
      category: 'raptor',
      status: '近危',
      wingspan: '180-240 cm',
      weight: '3-7 kg',
      distance: '1,500 km',
      speed: '50-70 km/h',
      color: '#8A8680',
      accent: '#F5F1E8',
      desc: '白尾海雕是中国最大的猛禽之一，以鱼和水鸟为食。北部种群冬季南迁到中国东部沿海，是沿海湿地冬季的旗舰物种。',
      route: '西伯利亚东部 → 朝鲜半岛 → 华东沿海',
      population: '约 2,200 对（东亚）',
    },
    {
      id: 'oriole',
      name: '金黄鹂',
      en: 'Eurasian Golden Oriole',
      latin: 'Oriolus oriolus',
      category: 'passerine',
      status: '无危',
      wingspan: '43-47 cm',
      weight: '65-85 g',
      distance: '6,000 km',
      speed: '30-40 km/h',
      color: '#E4572E',
      accent: '#1C1B1A',
      desc: '金黄鹂鸣声清脆婉转，雄鸟通体金黄，翅膀黑色。它们是长距离迁徙鸣禽的代表，从欧洲和西亚的繁殖地飞往非洲南部越冬。',
      route: '欧洲 → 地中海 → 撒哈拉 → 南非',
      population: '约 1,400 万只（全球）',
    },
  ];

  const filteredSpecies = filter === 'all' ? species : species.filter((s) => s.category === filter);

  // 滚动渐入
  React.useEffect(() => {
    if (!sectionRef.current) return;
    // 用 setTimeout 等 DOM 更新
    const timer = setTimeout(() => {
      sectionRef.current.querySelectorAll('.reveal').forEach((el) => {
        RevealManager.observe(el);
      });
    }, 50);
    return () => clearTimeout(timer);
  }, [filter]);

  // 3D 倾斜
  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const rotateY = x * 12;
    const rotateX = -y * 12;
    card.style.transform = `perspective(900px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateY(-4px) scale(1.02)`;
    // 光泽层位置
    const gloss = card.querySelector('.species-card__gloss');
    if (gloss) {
      gloss.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.3) 0%, transparent 50%)`;
    }
  };

  const handleCardMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = '';
    const gloss = card.querySelector('.species-card__gloss');
    if (gloss) gloss.style.background = '';
  };

  const openModal = (s) => {
    setSelected(s);
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    setSelected(null);
    document.body.style.overflow = '';
  };

  // ESC 关闭
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && selected) closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  return React.createElement('section', {
    ref: sectionRef,
    className: 'species section',
    id: 'species',
  },
    React.createElement('div', { className: 'container' },
      React.createElement('div', { className: 'species__header reveal' },
        React.createElement('div', { className: 'species__header-top' },
          React.createElement(SectionIndex, { num: '03', total: '05', label: 'SPECIES' }),
          React.createElement('div', { className: 'species__count mono' }, `${species.length} / 327 species documented`),
        ),
        React.createElement('h2', { className: 'display-2 species__title' },
          '物种图鉴',
          React.createElement('span', { className: 'species__title-en' },
            ' — Species ',
            React.createElement('em', null, 'Atlas')
          )
        ),
        React.createElement('p', { className: 'species__desc' },
          '我们记录了 327 种候鸟的形态、习性与迁徙路线。以下是本站最具代表性的旗舰物种。'
        ),
      ),

      // 筛选
      React.createElement('div', { className: 'species__filters reveal' },
        filters.map((f) =>
          React.createElement('button', {
            key: f.id,
            className: `filter-btn ${filter === f.id ? 'is-active' : ''}`,
            onClick: () => setFilter(f.id),
            'data-cursor-hover': true,
          },
            React.createElement('span', { className: 'filter-btn__name' }, f.name),
            React.createElement('span', { className: 'filter-btn__en mono' }, f.en)
          )
        )
      ),

      // 卡片网格
      React.createElement('div', { className: 'species__grid' },
        filteredSpecies.map((s, i) =>
          React.createElement('div', {
            key: s.id,
            className: 'species-card reveal',
            style: { transitionDelay: `${i * 80}ms` },
            onMouseMove: handleCardMouseMove,
            onMouseLeave: handleCardMouseLeave,
            onClick: () => openModal(s),
            'data-cursor-hover': true,
            'data-cursor-label': '查看详情',
          },
            React.createElement('div', { className: 'species-card__gloss' }),
            React.createElement('div', {
              className: 'species-card__image',
              style: { background: s.color },
            },
              // 鸟剪影 SVG
              React.createElement(BirdSilhouette, { species: s.id, accent: s.accent }),
              React.createElement('span', { className: 'species-card__status mono', style: { background: s.accent } }, s.status)
            ),
            React.createElement('div', { className: 'species-card__body' },
              React.createElement('div', { className: 'species-card__name' },
                React.createElement('h3', null, s.name),
                React.createElement('span', { className: 'species-card__en' }, s.en)
              ),
              React.createElement('p', { className: 'species-card__latin' },
                React.createElement('em', null, s.latin)
              ),
              React.createElement('div', { className: 'species-card__stats' },
                React.createElement('div', { className: 'species-card__stat' },
                  React.createElement('span', { className: 'mono' }, 'WINGSPAN'),
                  React.createElement('strong', null, s.wingspan)
                ),
                React.createElement('div', { className: 'species-card__stat' },
                  React.createElement('span', { className: 'mono' }, 'MIGRATION'),
                  React.createElement('strong', null, s.distance)
                )
              )
            ),
            React.createElement('div', { className: 'species-card__arrow' },
              React.createElement('span', null, 'View profile'),
              React.createElement('span', null, '→')
            )
          )
        )
      )
    ),

    // 详情弹窗
    selected && React.createElement(SpeciesModal, {
      species: selected,
      onClose: closeModal,
      modalRef,
    })
  );
}

// 鸟剪影 SVG（风格化）
function BirdSilhouette({ species, accent = '#1C1B1A' }) {
  const paths = {
    crane: (
      // 白鹤 - 长颈长腿
      <g stroke={accent} strokeWidth="1.2" fill="none">
        <path d="M 80 120 Q 90 80, 95 50 L 100 30" strokeLinecap="round" />
        <path d="M 95 50 Q 110 45, 115 50" />
        <path d="M 80 120 Q 60 115, 40 100 Q 30 90, 35 80 Q 50 85, 70 105" />
        <path d="M 80 120 L 85 170 L 90 120" strokeLinecap="round" />
        <path d="M 85 170 L 78 175 M 85 170 L 92 175" strokeLinecap="round" />
        <path d="M 80 120 Q 100 110, 130 100 Q 150 95, 160 100 Q 155 110, 130 115 Q 100 120, 80 120" fill={accent} opacity="0.85" />
      </g>
    ),
    spoonbill: (
      // 黑脸琵鹭 - 琵琶嘴
      <g stroke={accent} strokeWidth="1.2" fill="none">
        <path d="M 90 110 L 90 70 Q 90 55, 100 50" strokeLinecap="round" />
        <path d="M 100 50 Q 115 48, 120 52 Q 122 56, 118 60 Q 110 62, 100 55" fill={accent} />
        <path d="M 90 110 Q 70 105, 50 90 Q 40 80, 45 70 Q 60 75, 80 95" />
        <path d="M 90 110 L 85 160 M 92 110 L 97 160" strokeLinecap="round" />
        <path d="M 85 160 L 78 165 M 85 160 L 88 165 M 97 160 L 92 165 M 97 160 L 102 165" strokeLinecap="round" />
        <path d="M 90 110 Q 110 100, 140 90 Q 160 85, 170 90 Q 165 100, 140 105 Q 110 110, 90 110" fill={accent} opacity="0.85" />
      </g>
    ),
    goose: (
      // 斑头雁 - 更粗壮
      <g stroke={accent} strokeWidth="1.2" fill="none">
        <path d="M 85 115 Q 80 85, 85 60 Q 87 50, 95 48" strokeLinecap="round" />
        <path d="M 95 48 L 110 46 Q 112 50, 108 53 L 95 55" fill={accent} />
        <path d="M 85 115 Q 60 110, 40 95 Q 35 85, 40 78 Q 55 82, 75 100" />
        <path d="M 85 115 L 82 155 L 78 158" strokeLinecap="round" />
        <path d="M 92 115 L 95 155 L 99 158" strokeLinecap="round" />
        <path d="M 85 115 Q 110 105, 145 95 Q 165 90, 175 95 Q 170 105, 145 110 Q 110 115, 85 115" fill={accent} opacity="0.85" />
        <path d="M 85 60 Q 80 62, 78 58 M 85 60 Q 90 62, 92 58" strokeLinecap="round" />
      </g>
    ),
    swift: (
      // 雨燕 - 流线型、镰刀翅
      <g stroke={accent} strokeWidth="1.2" fill={accent} opacity="0.9">
        <path d="M 100 100 Q 90 95, 85 85 Q 80 75, 75 70 Q 90 78, 98 90 Q 102 95, 105 90 Q 115 75, 125 70 Q 120 80, 115 90 Q 110 100, 100 100 Z" />
        <path d="M 95 100 Q 90 110, 85 120 Q 95 115, 100 105" />
        <path d="M 105 100 Q 110 110, 115 120 Q 105 115, 100 105" />
      </g>
    ),
    eagle: (
      // 海雕 - 宽翅
      <g stroke={accent} strokeWidth="1.2" fill="none">
        <path d="M 100 100 L 100 70 Q 100 55, 105 50" strokeLinecap="round" />
        <path d="M 105 50 Q 112 48, 115 55" fill={accent} />
        <path d="M 100 100 Q 60 95, 30 75 Q 25 70, 30 65 Q 60 75, 90 95" />
        <path d="M 100 100 Q 140 95, 170 75 Q 175 70, 170 65 Q 140 75, 110 95" />
        <path d="M 100 100 L 98 145 L 93 150 M 102 100 L 104 145 L 109 150" strokeLinecap="round" />
        <path d="M 96 150 Q 96 155, 92 158 M 106 150 Q 106 155, 110 158" strokeLinecap="round" />
      </g>
    ),
    oriole: (
      // 黄鹂 - 小巧
      <g stroke={accent} strokeWidth="1.2" fill="none">
        <path d="M 95 110 Q 92 85, 98 65 Q 100 58, 106 58" strokeLinecap="round" />
        <path d="M 106 58 L 115 56 Q 116 60, 112 62 L 106 63" fill={accent} />
        <path d="M 95 110 Q 75 105, 60 90 Q 55 82, 60 76 Q 75 82, 88 98" />
        <path d="M 95 110 Q 115 105, 130 90 Q 135 82, 130 76 Q 115 82, 102 98" />
        <path d="M 96 115 L 95 145 L 91 148 M 100 115 L 101 145 L 105 148" strokeLinecap="round" />
        <ellipse cx="100" cy="105" rx="15" ry="18" fill={accent} opacity="0.3" />
      </g>
    ),
  };

  return React.createElement(
    'svg',
    { viewBox: '0 0 200 180', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', className: 'bird-svg' },
    paths[species] || paths.swift
  );
}

// 详情弹窗
function SpeciesModal({ species, onClose, modalRef }) {
  const innerRef = React.useRef(null);

  React.useEffect(() => {
    // 进场动画
    const el = innerRef.current;
    if (el) {
      requestAnimationFrame(() => {
        el.classList.add('is-open');
      });
    }
  }, []);

  const handleClose = () => {
    const el = innerRef.current;
    if (el) {
      el.classList.remove('is-open');
      setTimeout(onClose, 300);
    } else {
      onClose();
    }
  };

  return React.createElement('div', {
    className: 'species-modal',
    onClick: handleClose,
    'data-cursor-hover': true,
  },
    React.createElement('div', {
      ref: innerRef,
      className: 'species-modal__inner',
      onClick: (e) => e.stopPropagation(),
      'data-cursor-hover': true,
    },
      React.createElement('button', {
        className: 'species-modal__close',
        onClick: handleClose,
        'aria-label': 'Close',
        'data-cursor-hover': true,
        'data-cursor-label': '关闭',
      },
        React.createElement('span', null),
        React.createElement('span', null)
      ),

      React.createElement('div', { className: 'species-modal__grid' },
        // 左侧大图
        React.createElement('div', {
          className: 'species-modal__image',
          style: { background: species.color }
        },
          React.createElement(BirdSilhouette, { species: species.id, accent: species.accent }),
          React.createElement('div', { className: 'species-modal__status', style: { background: species.accent } },
            species.status
          )
        ),

        // 右侧信息
        React.createElement('div', { className: 'species-modal__content' },
          React.createElement('span', { className: 'eyebrow' }, `SPECIES · ${species.category.toUpperCase()}`),
          React.createElement('h2', { className: 'species-modal__name display-2' }, species.name),
          React.createElement('div', { className: 'species-modal__en' }, species.en),
          React.createElement('p', { className: 'species-modal__latin' },
            React.createElement('em', null, species.latin)
          ),

          React.createElement('div', { className: 'divider-thin species-modal__divider' }),

          React.createElement('p', { className: 'species-modal__desc' }, species.desc),

          // 数据网格
          React.createElement('div', { className: 'species-modal__data' },
            [
              { label: '翼展', value: species.wingspan, sub: 'Wingspan' },
              { label: '体重', value: species.weight, sub: 'Weight' },
              { label: '迁徙距离', value: species.distance, sub: 'Migration' },
              { label: '飞行速度', value: species.speed, sub: 'Flight Speed' },
              { label: '种群数量', value: species.population, sub: 'Population' },
            ].map((d) =>
              React.createElement('div', { key: d.label, className: 'species-modal__datum' },
                React.createElement('span', { className: 'mono species-modal__datum-sub' }, d.sub),
                React.createElement('span', { className: 'species-modal__datum-value' }, d.value),
                React.createElement('span', { className: 'species-modal__datum-label' }, d.label)
              )
            )
          ),

          React.createElement('div', { className: 'species-modal__route' },
            React.createElement('span', { className: 'eyebrow' }, '迁徙路线'),
            React.createElement('p', null, species.route)
          )
        )
      )
    )
  );
}

const speciesStyles = `
.species {
  background: var(--color-eggshell);
}
.species__header {
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.species__header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.species__count {
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: var(--color-feather-dark);
}
.species__title em {
  font-style: italic;
  color: var(--color-sunset);
}
.species__title-en {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 300;
  font-size: 0.45em;
  color: var(--color-feather-dark);
}
.species__desc {
  color: var(--color-ink-soft);
  max-width: 560px;
}

.species__filters {
  display: flex;
  gap: 8px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}
.filter-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 20px;
  border: 1px solid var(--color-feather-light);
  background: transparent;
  transition: all 0.3s var(--ease-out);
  position: relative;
  overflow: hidden;
}
.filter-btn::after {
  content: '';
  position: absolute;
  bottom: 0; left: 50%;
  width: 0; height: 2px;
  background: var(--color-sunset);
  transform: translateX(-50%);
  transition: width 0.3s var(--ease-out);
}
.filter-btn:hover {
  border-color: var(--color-feather-mid);
}
.filter-btn.is-active {
  border-color: var(--color-ink);
  background: var(--color-eggshell-2);
}
.filter-btn.is-active::after {
  width: 60%;
}
.filter-btn__name {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-ink);
}
.filter-btn__en {
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  color: var(--color-feather-dark);
}

.species__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
@media (max-width: 1024px) {
  .species__grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .species__grid { grid-template-columns: 1fr; }
}

.species-card {
  position: relative;
  background: var(--color-eggshell);
  border: 1px solid var(--color-feather-light);
  overflow: hidden;
  transform-style: preserve-3d;
  transition: box-shadow 0.4s var(--ease-out), border-color 0.3s;
  cursor: pointer;
}
.species-card:hover {
  box-shadow: 0 20px 50px -20px rgba(28, 27, 26, 0.25);
  border-color: var(--color-feather-mid);
}
.species-card__gloss {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.3s;
}
.species-card:hover .species-card__gloss {
  opacity: 1;
}
.species-card__image {
  position: relative;
  aspect-ratio: 4 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: aspect-ratio 0.4s var(--ease-out);
}
.bird-svg {
  width: 60%;
  height: auto;
  transition: transform 0.5s var(--ease-spring);
  transform: translateZ(20px);
}
.species-card:hover .bird-svg {
  transform: translateZ(30px) scale(1.1) rotate(-3deg);
}
.species-card__status {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 4px 10px;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  color: var(--color-eggshell);
}
.species-card__body {
  padding: 20px 22px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transform: translateZ(10px);
}
.species-card__name {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.species-card__name h3 {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--color-ink);
  font-variation-settings: 'opsz' 28;
}
.species-card__en {
  font-size: 0.75rem;
  color: var(--color-feather-dark);
  font-style: italic;
}
.species-card__latin {
  font-size: 0.8rem;
  color: var(--color-feather-dark);
  font-style: italic;
  font-family: var(--font-display);
}
.species-card__stats {
  display: flex;
  gap: 20px;
  padding-top: 12px;
  border-top: 1px solid var(--color-feather-light);
}
.species-card__stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.species-card__stat span {
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  color: var(--color-feather-dark);
}
.species-card__stat strong {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-ink);
}
.species-card__arrow {
  position: absolute;
  bottom: 0;
  left: 0; right: 0;
  padding: 14px 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--color-ink);
  color: var(--color-eggshell);
  font-size: 0.8rem;
  font-weight: 500;
  transform: translateY(100%);
  transition: transform 0.4s var(--ease-out);
}
.species-card__arrow span:last-child {
  font-family: var(--font-mono);
  font-size: 0.9rem;
}
.species-card:hover .species-card__arrow {
  transform: translateY(0);
}

/* Modal */
.species-modal {
  position: fixed;
  inset: 0;
  background: rgba(28, 27, 26, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  animation: modal-fade 0.3s ease;
}
@keyframes modal-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
.species-modal__inner {
  position: relative;
  background: var(--color-eggshell);
  max-width: 960px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid var(--color-feather-light);
  opacity: 0;
  transform: scale(0.95) translateY(20px);
  transition: opacity 0.35s var(--ease-out), transform 0.35s var(--ease-spring);
}
.species-modal__inner.is-open {
  opacity: 1;
  transform: scale(1) translateY(0);
}
.species-modal__close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}
.species-modal__close span {
  position: absolute;
  width: 20px;
  height: 1.5px;
  background: var(--color-ink);
  transition: transform 0.3s var(--ease-spring);
}
.species-modal__close span:nth-child(1) { transform: rotate(45deg); }
.species-modal__close span:nth-child(2) { transform: rotate(-45deg); }
.species-modal__close:hover span:nth-child(1) { transform: rotate(135deg); }
.species-modal__close:hover span:nth-child(2) { transform: rotate(45deg); }

.species-modal__grid {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  min-height: 500px;
}
.species-modal__image {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
}
.species-modal__image .bird-svg {
  width: 80%;
}
.species-modal__status {
  position: absolute;
  top: 24px;
  left: 24px;
  padding: 5px 12px;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  color: var(--color-eggshell);
  text-transform: uppercase;
}
.species-modal__content {
  padding: 50px 48px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
}
.species-modal__name {
  font-weight: 500;
  font-variation-settings: 'opsz' 48;
}
.species-modal__en {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1.1rem;
  color: var(--color-feather-dark);
  margin-top: -4px;
}
.species-modal__latin {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 0.95rem;
  color: var(--color-feather-dark);
}
.species-modal__divider {
  margin: 10px 0;
}
.species-modal__desc {
  color: var(--color-ink-soft);
  line-height: 1.75;
  font-size: 0.95rem;
}
.species-modal__data {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 10px 0;
  padding: 20px 0;
  border-top: 1px solid var(--color-feather-light);
  border-bottom: 1px solid var(--color-feather-light);
}
.species-modal__datum {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.species-modal__datum-sub {
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  color: var(--color-feather-dark);
}
.species-modal__datum-value {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--color-ink);
  font-variation-settings: 'opsz' 24;
}
.species-modal__datum-label {
  font-size: 0.75rem;
  color: var(--color-feather-dark);
}
.species-modal__route {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.species-modal__route p {
  font-family: var(--font-display);
  font-style: italic;
  color: var(--color-ink-soft);
  font-size: 0.95rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .species-modal { padding: 16px; }
  .species-modal__grid { grid-template-columns: 1fr; }
  .species-modal__image {
    aspect-ratio: 16/10;
    padding: 40px;
  }
  .species-modal__content { padding: 32px 24px; }
  .species-modal__data { grid-template-columns: repeat(2, 1fr); }
}
`;

(function injectSpeciesStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('species-styles')) return;
  const style = document.createElement('style');
  style.id = 'species-styles';
  style.textContent = speciesStyles;
  document.head.appendChild(style);
})();

Object.assign(window, { Species, BirdSilhouette, SpeciesModal });
