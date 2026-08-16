/* =========================================================
   Stories — 壁画故事
   Tab 切换 + 横向滑动惯性过渡
   ========================================================= */

const { useState, useEffect, useRef } = React;

const STORY_IMG = '/spark/app/app_17c7ssvjn08/runtime/api/v1/storage/object/bucket_aadkqgfafgseo_static/static%2Faadkqf5tlggkw_ve_miaoda';

const STORIES = [
  {
    id: 'nine-color-deer',
    tag: '本生故事',
    title: '九色鹿王本生',
    body: '恒河之畔，九色鹿救起溺水人。后国王悬赏捕鹿，溺水人贪利告密，引国王围猎。鹿向国王诉说始末，国王感其仁德，释放九色鹿并下令国中不得伤害。溺水人周身生疮，报应不爽。',
    dynasty: '北魏',
    cave: '第 257 窟',
    length: '共 9 幕',
  },
  {
    id: 'flying-apara',
    tag: '飞天伎乐',
    title: '反弹琵琶飞天',
    body: '飞天是敦煌壁画中最具代表性的形象之一。盛唐时期的飞天身姿曼妙，手持乐器凌空飞舞，其中反弹琵琶的形象最为著名——舞者背手弹奏琵琶，飘带随风舒展，尽显唐代艺术的雍容与灵动。',
    dynasty: '盛唐',
    cave: '第 320 窟',
    length: '共 12 身',
  },
  {
    id: 'five-hundred-bandits',
    tag: '经变故事',
    title: '五百强盗成佛',
    body: '五百强盗作乱，被国王讨伐、剜去双眼，放逐山林。佛以神力吹药使其双目复明，并为其说法。五百强盗幡然醒悟，剃度出家，终成阿罗汉果。壁画以连续画面展现了战争、酷刑、放逐、度化的全过程。',
    dynasty: '西魏',
    cave: '第 285 窟',
    length: '共 8 段',
  },
  {
    id: 'nirvana',
    tag: '涅槃经变',
    title: '释迦牟尼涅槃',
    body: '释迦牟尼佛在拘尸那伽城娑罗双树间入般涅槃。弟子们围绕佛床哀恸哭泣，诸天伎乐供养。壁画中佛身侧卧，神情安详，周围弟子与眷属的悲恸表情刻画入微，是盛唐涅槃经变的典范之作。',
    dynasty: '盛唐',
    cave: '第 148 窟',
    length: '全长 16 米',
  },
];

function Stories() {
  const [active, setActive] = useState(0);
  const panelRef = useRef(null);
  const slideRef = useRef(null);

  // Tab 切换时的滑动过渡
  const handleTabClick = (index) => {
    if (index === active) return;
    setActive(index);
  };

  const current = STORIES[active];

  return (
    <section className="section stories" id="stories" data-screen-label="stories">
      <div className="container">
        <div className="section-head reveal">
          <div className="section-eyebrow">
            <span className="num">02</span>
            <span>·</span>
            <span>壁画故事</span>
          </div>
          <h2 className="section-title">一壁一画<br />皆是一段千年故事</h2>
          <p className="section-desc">
            敦煌壁画不仅是艺术珍品，更是一部画在墙上的百科全书。
            本生、经变、史迹、供养——每一幅壁画背后，都藏着动人的故事与信仰。
          </p>
        </div>

        <div className="stories-tabs reveal delay-1" role="tablist">
          {STORIES.map((s, i) => (
            <button
              key={s.id}
              className={`story-tab ${i === active ? 'is-active' : ''}`}
              role="tab"
              aria-selected={i === active}
              onClick={() => handleTabClick(i)}
              data-interactive="true"
            >
              {s.title}
            </button>
          ))}
        </div>

        <div className="story-panel reveal delay-2" ref={panelRef}>
          <div className="story-panel-img" key={`img-${active}`} ref={slideRef}>
            <img src={STORY_IMG} alt={current.title} loading="lazy" />
          </div>
          <div className="story-panel-text" key={`text-${active}`}>
            <span className="story-tag">{current.tag}</span>
            <h3 className="story-title">{current.title}</h3>
            <p className="story-body">{current.body}</p>
            <div className="story-meta">
              <div className="story-meta-item">
                <div className="label">朝代</div>
                <div className="value">{current.dynasty}</div>
              </div>
              <div className="story-meta-item">
                <div className="label">洞窟</div>
                <div className="value">{current.cave}</div>
              </div>
              <div className="story-meta-item">
                <div className="label">规模</div>
                <div className="value">{current.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 过渡动画样式 */}
      <style>{`
        .story-panel-img,
        .story-panel-text {
          animation: story-slide-in 600ms cubic-bezier(.22,.61,.36,1) both;
        }
        .story-panel-text {
          animation-delay: 80ms;
        }
        @keyframes story-slide-in {
          from {
            opacity: 0;
            transform: translateX(30px);
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
            filter: blur(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .story-panel-img,
          .story-panel-text { animation: none; }
        }
      `}</style>
    </section>
  );
}

window.Stories = Stories;
