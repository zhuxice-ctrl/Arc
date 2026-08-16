/* =====================================================================
   口袋天文台 · 屏幕页面 (screens.jsx)
   页面: 今夜天象 / 星座辨认 / 行星追踪 / 观测日志 / 设计规范 / 接口文档
   ===================================================================== */

const { useState: useStateS, useEffect: useEffectS, useRef: useRefS } = React;

/* ============================================================
   通用：顶栏 + 底栏导航
   ============================================================ */
function AppTopBar({ title, subtitle, onBack, rightSlot }) {
  return (
    <div style={{
      padding: '14px 20px 10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {onBack && (
          <div
            className="interactive"
            onClick={onBack}
            style={{
              width: 32, height: 32, borderRadius: 10,
              background: 'rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--moonwhite)" strokeWidth="2" strokeLinecap="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </div>
        )}
        <div>
          <div style={{ fontSize: 11, color: 'var(--moonwhite-faint)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {subtitle}
          </div>
          <div className="font-display" style={{ fontSize: 22, fontWeight: 500, color: 'var(--moonwhite)', lineHeight: 1.2 }}>
            {title}
          </div>
        </div>
      </div>
      {rightSlot}
    </div>
  );
}

function BottomNav({ active, onChange }) {
  const items = [
    { key: 'tonight', label: '今夜', icon: 'M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41' },
    { key: 'constellations', label: '星座', icon: 'M12 2l2.4 7.2H22l-6 4.4 2.3 7.2-6.3-4.6-6.3 4.6 2.3-7.2-6-4.4h7.6z' },
    { key: 'planets', label: '行星', icon: 'M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0' },
    { key: 'log', label: '日志', icon: 'M4 4h16v16H4zM4 9h16M9 4v16' },
  ];

  return (
    <div style={{
      position: 'absolute',
      bottom: 'var(--ios-safe-bottom, 0)',
      left: 0, right: 0,
      padding: '10px 16px 18px',
      background: 'linear-gradient(to top, var(--midnight) 60%, transparent)',
      zIndex: 20,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      pointerEvents: 'none',
    }}>
      <div style={{
        width: '100%',
        background: 'rgba(13, 15, 20, 0.85)',
        backdropFilter: 'blur(20px)',
        borderRadius: 24,
        border: '1px solid rgba(255,255,255,0.08)',
        padding: '10px 16px',
        display: 'flex',
        justifyContent: 'space-around',
        pointerEvents: 'auto',
      }}>
        {items.map((item) => (
          <div
            key={item.key}
            className="interactive"
            onClick={() => onChange(item.key)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '6px 14px',
              borderRadius: 16,
              transition: 'all 0.3s ease',
              position: 'relative',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                 stroke={active === item.key ? 'var(--comet)' : 'var(--moonwhite-faint)'}
                 strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                 style={{ transition: 'stroke 0.3s' }}>
              <path d={item.icon} />
            </svg>
            <span style={{
              fontSize: 10,
              color: active === item.key ? 'var(--comet)' : 'var(--moonwhite-faint)',
              fontWeight: active === item.key ? 500 : 400,
              transition: 'color 0.3s',
              letterSpacing: '0.05em',
            }}>
              {item.label}
            </span>
            {active === item.key && (
              <div style={{
                position: 'absolute', bottom: 0,
                width: 4, height: 4, borderRadius: '50%',
                background: 'var(--comet)',
                boxShadow: '0 0 8px var(--comet)',
              }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   1. 今夜天象 Tonight
   ============================================================ */
function TonightScreen({ onNavigate }) {
  const planets = [
    { name: '木星', mag: -2.4, rise: '19:42', set: '05:18', color: '#E8D59B', size: 2.8, visible: true },
    { name: '土星', mag: 0.6, rise: '16:30', set: '02:05', color: '#C8A76E', size: 2.2, visible: true },
    { name: '火星', mag: 1.2, rise: '23:15', set: '11:40', color: '#D4634A', size: 2, visible: false },
    { name: '金星', mag: -3.9, rise: '04:22', set: '17:08', color: '#F2EFE6', size: 3, visible: false },
  ];

  const events = [
    { time: '21:34', title: '英仙座流星雨极大', tag: 'ACTIVE', desc: '每小时可达 110 颗' },
    { time: '22:17', title: '木星冲', tag: 'PLANET', desc: '距离地球最近，观测最佳' },
    { time: '00:48', title: '银河最高点', tag: 'MILKY WAY', desc: '银心位于正南 42°' },
    { time: '02:30', title: '土星合月', tag: 'CONJUNCTION', desc: '角距仅 1.8°' },
  ];

  return (
    <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}>
      <Starfield count={60} speed={0.2} />

      {/* 顶部信息 */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <AppTopBar
          subtitle="8月16日 · 星期六 · 农历七月十五"
          title="今夜天象"
          rightSlot={
            <div className="interactive" style={{
              width: 32, height: 32, borderRadius: 10,
              background: 'rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--moonwhite)" strokeWidth="2" strokeLinecap="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </div>
          }
        />

        {/* 月相卡 */}
        <div style={{ padding: '8px 20px 4px' }}>
          <TiltCard maxTilt={8} style={{ borderRadius: 20 }}>
            <div style={{
              background: 'linear-gradient(160deg, rgba(255, 122, 26, 0.12) 0%, rgba(13, 15, 20, 0.8) 70%)',
              border: '1px solid rgba(255, 122, 26, 0.2)',
              borderRadius: 20,
              padding: 20,
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {/* 月亮 */}
                <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #F2EFE6 0%, #C8C5B8 60%, #8A8779 100%)',
                    boxShadow: '0 0 30px rgba(242, 239, 230, 0.3), 0 0 60px rgba(242, 239, 230, 0.1)',
                    animation: 'float-y 5s ease-in-out infinite',
                  }}>
                    {/* 月海纹理 */}
                    <div style={{ position: 'absolute', top: '25%', left: '20%', width: 12, height: 8, borderRadius: '50%', background: 'rgba(138, 135, 121, 0.4)' }} />
                    <div style={{ position: 'absolute', top: '50%', left: '35%', width: 8, height: 6, borderRadius: '50%', background: 'rgba(138, 135, 121, 0.35)' }} />
                    <div style={{ position: 'absolute', top: '35%', left: '55%', width: 10, height: 7, borderRadius: '50%', background: 'rgba(138, 135, 121, 0.3)' }} />
                  </div>
                  {/* 满月光晕 */}
                  <div style={{
                    position: 'absolute', inset: -8, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(242, 239, 230, 0.15) 0%, transparent 70%)',
                  }} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: 'var(--comet)', letterSpacing: '0.12em', fontWeight: 500, marginBottom: 4 }}>
                    FULL MOON · 满月
                  </div>
                  <div className="font-display" style={{ fontSize: 28, fontWeight: 600, color: 'var(--moonwhite)', lineHeight: 1.1, marginBottom: 4 }}>
                    鱼篮月
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--moonwhite-dim)', lineHeight: 1.5 }}>
                    照度 99.7% · 地月距 362,184 km
                  </div>
                </div>
              </div>

              {/* 数据行 */}
              <div style={{ display: 'flex', gap: 12, marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div className="font-mono" style={{ fontSize: 11, color: 'var(--moonwhite-faint)', marginBottom: 4 }}>月出</div>
                  <div className="font-mono" style={{ fontSize: 16, color: 'var(--moonwhite)', fontWeight: 500 }}>18:47</div>
                </div>
                <div style={{ width: 1, background: 'rgba(255,255,255,0.08)' }} />
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div className="font-mono" style={{ fontSize: 11, color: 'var(--moonwhite-faint)', marginBottom: 4 }}>月落</div>
                  <div className="font-mono" style={{ fontSize: 16, color: 'var(--moonwhite)', fontWeight: 500 }}>06:02</div>
                </div>
                <div style={{ width: 1, background: 'rgba(255,255,255,0.08)' }} />
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div className="font-mono" style={{ fontSize: 11, color: 'var(--moonwhite-faint)', marginBottom: 4 }}>赤纬</div>
                  <div className="font-mono" style={{ fontSize: 16, color: 'var(--moonwhite)', fontWeight: 500 }}>+23.4°</div>
                </div>
              </div>
            </div>
          </TiltCard>
        </div>

        {/* 观测条件 */}
        <div style={{ padding: '16px 20px 0' }}>
          <div style={{ fontSize: 11, color: 'var(--moonwhite-faint)', letterSpacing: '0.08em', marginBottom: 10 }}>
            观测条件
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: '视宁度', value: '良好', sub: 'Seeing Ⅱ', color: 'var(--aurora)' },
              { label: '透明度', value: '极佳', sub: 'Trans 0.92', color: 'var(--comet)' },
              { label: '云量', value: '无云', sub: '0/8  oktas', color: 'var(--aurora)' },
              { label: '光污染', value: 'Bortle 4', sub: '乡村级', color: 'var(--zodiac)' },
            ].map((item, i) => (
              <Reveal key={item.label} delay={200 + i * 80} direction="up">
                <GlowCard color={item.color + '40'} style={{
                  background: 'var(--midnight-800)',
                  border: '1px solid var(--midnight-600)',
                  borderRadius: 14,
                  padding: 14,
                }}>
                  <div className="font-mono" style={{ fontSize: 10, color: 'var(--moonwhite-faint)', marginBottom: 6 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: item.color, marginBottom: 2 }}>
                    {item.value}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--moonwhite-faint)' }}>
                    {item.sub}
                  </div>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>

        {/* 可见行星 */}
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 11, color: 'var(--moonwhite-faint)', letterSpacing: '0.08em' }}>今晚可见行星</span>
            <span className="interactive font-mono" style={{ fontSize: 11, color: 'var(--comet)' }} onClick={() => onNavigate('planets')}>查看全部 →</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {planets.filter(p => p.visible).map((p, i) => (
              <Reveal key={p.name} delay={500 + i * 100}>
                <GlowCard color={p.color + '40'} style={{
                  flex: 1, background: 'var(--midnight-800)',
                  border: '1px solid var(--midnight-600)',
                  borderRadius: 14, padding: 12, textAlign: 'center',
                }} onClick={() => onNavigate('planets')}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: `radial-gradient(circle at 35% 30%, ${p.color} 0%, ${p.color}88 60%, transparent 100%)`,
                    margin: '0 auto 8px',
                    boxShadow: `0 0 16px ${p.color}40`,
                    animation: `float-y ${3 + i * 0.5}s ease-in-out infinite`,
                  }} />
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--moonwhite)', marginBottom: 2 }}>{p.name}</div>
                  <div className="font-mono" style={{ fontSize: 10, color: 'var(--moonwhite-faint)' }}>m {p.mag}</div>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>

        {/* 天文事件时间线 */}
        <div style={{ padding: '20px 20px 120px' }}>
          <div style={{ fontSize: 11, color: 'var(--moonwhite-faint)', letterSpacing: '0.08em', marginBottom: 10 }}>
            今夜天文事件
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {events.map((evt, i) => (
              <Reveal key={evt.title} delay={700 + i * 100}>
                <div
                  className="interactive"
                  style={{
                    display: 'flex', gap: 14, alignItems: 'center',
                    background: 'var(--midnight-800)',
                    border: '1px solid var(--midnight-600)',
                    borderRadius: 14,
                    padding: '14px 16px',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--comet)';
                    e.currentTarget.style.background = 'rgba(255, 122, 26, 0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--midnight-600)';
                    e.currentTarget.style.background = 'var(--midnight-800)';
                  }}
                >
                  <div className="font-mono" style={{
                    fontSize: 14, fontWeight: 500, color: 'var(--comet)',
                    width: 54, flexShrink: 0,
                  }}>
                    {evt.time}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--moonwhite)', marginBottom: 3 }}>
                      {evt.title}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--moonwhite-faint)' }}>
                      {evt.desc}
                    </div>
                  </div>
                  <div style={{
                    fontSize: 9, fontWeight: 600, letterSpacing: '0.1em',
                    padding: '4px 8px', borderRadius: 6,
                    background: evt.tag === 'ACTIVE' ? 'rgba(255, 122, 26, 0.15)' : 'rgba(255,255,255,0.05)',
                    color: evt.tag === 'ACTIVE' ? 'var(--comet)' : 'var(--moonwhite-faint)',
                  }}>
                    {evt.tag}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   2. 星座辨认 Constellations
   ============================================================ */
function ConstellationsScreen() {
  const [active, setActive] = useStateS('orion');

  const constellations = [
    { id: 'orion', name: '猎户座', en: 'Orion', abbrev: 'Ori', quadrant: 'EQ1', stars: '7 颗主星', season: '冬季', desc: '冬夜最辉煌的星座，腰带三星是显著标志。参宿四是一颗红超巨星，参宿七是蓝超巨星。' },
    { id: 'ursa', name: '大熊座', en: 'Ursa Major', abbrev: 'UMa', quadrant: 'NQ2', stars: '7 颗主星', season: '春季', desc: '北斗七星所在的星座，自古用于导航。天枢、天璇连线延伸即可找到北极星。' },
    { id: 'cassiopeia', name: '仙后座', en: 'Cassiopeia', abbrev: 'Cas', quadrant: 'NQ1', stars: '5 颗主星', season: '秋季', desc: '呈 W 形排列，与北斗七星隔北极星相望。位于银河之中，包含多个疏散星团。' },
    { id: 'leo', name: '狮子座', en: 'Leo', abbrev: 'Leo', quadrant: 'NQ2', stars: '9 颗主星', season: '春季', desc: '黄道十二星座之一，轩辕十四是其最亮星。狮子座流星雨每年 11 月达到极大。' },
    { id: 'scorpius', name: '天蝎座', en: 'Scorpius', abbrev: 'Sco', quadrant: 'SQ3', stars: '18 颗主星', season: '夏季', desc: '夏夜南天最壮观的星座，心宿二（心大星）是一颗红超巨星，宛如蝎子的心脏。' },
    { id: 'lyra', name: '天琴座', en: 'Lyra', abbrev: 'Lyr', quadrant: 'NQ4', stars: '5 颗主星', season: '夏季', desc: '织女星所在星座，呈小竖琴形状。与天鹰座牛郎星、天鹅座天津四组成夏季大三角。' },
  ];

  const current = constellations.find(c => c.id === active) || constellations[0];

  return (
    <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}>
      <Starfield count={80} speed={0.15} />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <AppTopBar subtitle="Constellation Atlas" title="星座图鉴" />

        {/* 星座展示区 */}
        <div style={{ padding: '0 20px', height: 280, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* 旋转星盘 */}
          <div style={{ position: 'relative', width: 240, height: 240 }}>
            {/* 外环 */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: '1px solid rgba(255, 122, 26, 0.2)',
              animation: 'rotate-slow 120s linear infinite',
            }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} style={{
                  position: 'absolute', left: '50%', top: 4, width: 2, height: 6,
                  background: 'var(--comet)',
                  transform: `translateX(-50%) rotate(${i * 30}deg)`,
                  transformOrigin: '50% 116px',
                  opacity: 0.5,
                }} />
              ))}
            </div>
            {/* 中环 */}
            <div style={{
              position: 'absolute', inset: 20, borderRadius: '50%',
              border: '1px dashed rgba(255,255,255,0.08)',
              animation: 'spin-reverse 180s linear infinite',
            }} />
            {/* 星座 SVG */}
            <div style={{
              position: 'absolute', inset: 40, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 122, 26, 0.05) 0%, transparent 70%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg viewBox="0 0 120 120" width="100%" height="100%">
                {/* 连线 */}
                <ConstellationLines id={active} />
                {/* 星点 */}
                <ConstellationStars id={active} />
              </svg>
            </div>
          </div>
        </div>

        {/* 当前星座信息 */}
        <div style={{ padding: '0 20px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: 'var(--comet)', letterSpacing: '0.2em', marginBottom: 4 }}>
            {current.en.toUpperCase()}
          </div>
          <div className="font-display" style={{ fontSize: 32, fontWeight: 600, color: 'var(--moonwhite)', marginBottom: 2 }}>
            {current.name}
          </div>
          <div className="font-mono" style={{ fontSize: 11, color: 'var(--moonwhite-faint)' }}>
            {current.quadrant} · {current.stars} · {current.season}
          </div>
        </div>

        {/* 描述 */}
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{
            background: 'var(--midnight-800)',
            border: '1px solid var(--midnight-600)',
            borderRadius: 16,
            padding: 16,
          }}>
            <Typewriter
              key={active}
              text={current.desc}
              speed={30}
              delay={200}
              style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--moonwhite-dim)' }}
            />
          </div>
        </div>

        {/* 星座列表 */}
        <div style={{ padding: '0 20px 120px' }}>
          <div style={{ fontSize: 11, color: 'var(--moonwhite-faint)', letterSpacing: '0.08em', marginBottom: 10 }}>
            全部星座 · 88
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {constellations.map((c, i) => (
              <div
                key={c.id}
                className="interactive"
                onClick={() => setActive(c.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: 12, borderRadius: 12,
                  background: active === c.id ? 'rgba(255, 122, 26, 0.08)' : 'var(--midnight-800)',
                  border: `1px solid ${active === c.id ? 'var(--comet)' : 'var(--midnight-600)'}`,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: active === c.id ? 'rgba(255, 122, 26, 0.15)' : 'rgba(255,255,255,0.04)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14,
                }}>
                  {c.abbrev.slice(0, 2)}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--moonwhite)' }}>{c.name}</div>
                  <div className="font-mono" style={{ fontSize: 10, color: 'var(--moonwhite-faint)' }}>{c.en}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* 星座连线 SVG */
function ConstellationLines({ id }) {
  const paths = {
    orion: 'M30,40 L50,60 L70,50 L90,35 M50,60 L50,85 M42,70 L58,70 M70,50 L70,80 L80,95',
    ursa: 'M25,45 L40,40 L55,48 L70,42 L80,55 L70,75 L55,72 L40,60 M40,40 L40,60 L55,72',
    cassiopeia: 'M20,60 L35,40 L50,55 L65,35 L80,55 L95,45',
    leo: 'M25,60 L40,50 L55,45 L70,50 L85,60 L75,75 L60,80 L45,75 L30,70 L25,60 M55,45 L50,55 L60,60',
    scorpius: 'M20,50 L35,45 L50,50 L65,45 L75,55 L70,70 L55,80 L40,85 L30,75 L35,60',
    lyra: 'M50,25 L60,50 L50,65 L40,50 L50,25 M60,50 L75,55 M40,50 L25,55 M50,65 L50,85',
  };

  return (
    <path
      d={paths[id] || paths.orion}
      fill="none"
      stroke="var(--comet)"
      strokeWidth="0.8"
      strokeOpacity="0.4"
      strokeLinecap="round"
    />
  );
}

function ConstellationStars({ id }) {
  const starSets = {
    orion: [[30, 40], [50, 60], [70, 50], [90, 35], [50, 85], [42, 70], [58, 70], [70, 80], [80, 95]],
    ursa: [[25, 45], [40, 40], [55, 48], [70, 42], [80, 55], [70, 75], [55, 72], [40, 60]],
    cassiopeia: [[20, 60], [35, 40], [50, 55], [65, 35], [80, 55], [95, 45]],
    leo: [[25, 60], [40, 50], [55, 45], [70, 50], [85, 60], [75, 75], [60, 80], [45, 75], [30, 70]],
    scorpius: [[20, 50], [35, 45], [50, 50], [65, 45], [75, 55], [70, 70], [55, 80], [40, 85], [30, 75]],
    lyra: [[50, 25], [60, 50], [50, 65], [40, 50], [75, 55], [25, 55], [50, 85]],
  };

  const stars = starSets[id] || starSets.orion;

  return stars.map(([cx, cy], i) => {
    const r = i === 2 ? 3 : 1.5 + Math.random() * 1.5;
    return (
      <g key={i}>
        <circle cx={cx} cy={cy} r={r * 2.5} fill="var(--moonwhite)" opacity="0.15" />
        <circle cx={cx} cy={cy} r={r} fill="var(--moonwhite)">
          <animate attributeName="opacity" values="1;0.6;1" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      </g>
    );
  });
}

/* ============================================================
   3. 行星追踪 Planets
   ============================================================ */
function PlanetsScreen() {
  const [selected, setSelected] = useStateS('jupiter');

  const planets = [
    { id: 'mercury', name: '水星', en: 'Mercury', mag: '-0.2', dist: '1.12 AU', period: '88 天', color: '#8A8779', size: 18 },
    { id: 'venus', name: '金星', en: 'Venus', mag: '-3.9', dist: '0.72 AU', period: '225 天', color: '#E8D59B', size: 28 },
    { id: 'mars', name: '火星', en: 'Mars', mag: '1.2', dist: '1.62 AU', period: '687 天', color: '#D4634A', size: 22 },
    { id: 'jupiter', name: '木星', en: 'Jupiter', mag: '-2.4', dist: '4.95 AU', period: '12 年', color: '#C8A76E', size: 40 },
    { id: 'saturn', name: '土星', en: 'Saturn', mag: '0.6', dist: '9.52 AU', period: '29 年', color: '#E8D59B', size: 36 },
    { id: 'uranus', name: '天王星', en: 'Uranus', mag: '5.8', dist: '19.2 AU', period: '84 年', color: '#A8D8E8', size: 26 },
    { id: 'neptune', name: '海王星', en: 'Neptune', mag: '7.9', dist: '30.1 AU', period: '165 年', color: '#5B8DB8', size: 25 },
  ];

  const current = planets.find(p => p.id === selected) || planets[3];

  return (
    <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}>
      <Starfield count={40} speed={0.1} />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <AppTopBar subtitle="Solar System" title="行星追踪" />

        {/* 行星轨道展示 */}
        <div style={{ padding: '10px 20px 20px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 280, height: 280, position: 'relative' }}>
            {/* 轨道环 */}
            {planets.slice(0, 6).map((p, i) => (
              <div
                key={`orbit-${p.id}`}
                style={{
                  position: 'absolute',
                  top: '50%', left: '50%',
                  width: 60 + i * 36,
                  height: 60 + i * 36,
                  transform: 'translate(-50%, -50%)',
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.06)',
                  animation: selected === p.id ? `spin-reverse ${15 + i * 5}s linear infinite` : 'none',
                }}
              >
                {/* 行星位置点 */}
                <div
                  className="interactive"
                  onClick={() => setSelected(p.id)}
                  style={{
                    position: 'absolute',
                    top: -p.size / 2,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: p.size,
                    height: p.size,
                    borderRadius: '50%',
                    background: `radial-gradient(circle at 30% 30%, ${p.color}ee, ${p.color}66 70%, transparent 100%)`,
                    boxShadow: selected === p.id ? `0 0 20px ${p.color}80, 0 0 40px ${p.color}40` : `0 0 10px ${p.color}20`,
                    transition: 'box-shadow 0.4s ease',
                    zIndex: selected === p.id ? 5 : 1,
                  }}
                />
              </div>
            ))}
            {/* 太阳在中心 */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 36, height: 36, borderRadius: '50%',
              background: 'radial-gradient(circle, #FFD700 0%, #FF7A1A 60%, #FF5500 100%)',
              boxShadow: '0 0 30px rgba(255, 122, 26, 0.6), 0 0 60px rgba(255, 122, 26, 0.3)',
              zIndex: 3,
            }} />
          </div>
        </div>

        {/* 当前行星信息 */}
        <div style={{ padding: '0 20px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: 'var(--moonwhite-faint)', letterSpacing: '0.2em', marginBottom: 4 }}>
            {current.en.toUpperCase()}
          </div>
          <div className="font-display" style={{ fontSize: 36, fontWeight: 600, color: 'var(--moonwhite)', marginBottom: 8 }}>
            {current.name}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
            <div>
              <div className="font-mono" style={{ fontSize: 10, color: 'var(--moonwhite-faint)', marginBottom: 2 }}>视星等</div>
              <div className="font-mono" style={{ fontSize: 18, color: current.color, fontWeight: 500 }}>{current.mag}</div>
            </div>
            <div>
              <div className="font-mono" style={{ fontSize: 10, color: 'var(--moonwhite-faint)', marginBottom: 2 }}>距离</div>
              <div className="font-mono" style={{ fontSize: 18, color: 'var(--moonwhite)', fontWeight: 500 }}>{current.dist}</div>
            </div>
            <div>
              <div className="font-mono" style={{ fontSize: 10, color: 'var(--moonwhite-faint)', marginBottom: 2 }}>公转</div>
              <div className="font-mono" style={{ fontSize: 18, color: 'var(--moonwhite)', fontWeight: 500 }}>{current.period}</div>
            </div>
          </div>
        </div>

        {/* 光谱 */}
        <div style={{ padding: '0 20px 16px' }}>
          <div style={{
            background: 'var(--midnight-800)',
            border: '1px solid var(--midnight-600)',
            borderRadius: 16,
            padding: '14px 16px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: 'var(--moonwhite-faint)' }}>光谱分析</span>
              <span className="font-mono" style={{ fontSize: 10, color: current.color }}>
                {current.name}大气 · 实时
              </span>
            </div>
            <SpectrumBars count={28} height={44} color={current.color} />
          </div>
        </div>

        {/* 行星快速选择 */}
        <div style={{ padding: '0 20px 120px' }}>
          <div style={{ fontSize: 11, color: 'var(--moonwhite-faint)', letterSpacing: '0.08em', marginBottom: 10 }}>
            八大行星
          </div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, margin: '0 -20px', paddingLeft: 20, paddingRight: 20 }}>
            {planets.map((p) => (
              <div
                key={p.id}
                className="interactive"
                onClick={() => setSelected(p.id)}
                style={{
                  flexShrink: 0,
                  width: 64,
                  textAlign: 'center',
                  padding: '10px 6px',
                  borderRadius: 12,
                  background: selected === p.id ? 'rgba(255, 122, 26, 0.1)' : 'var(--midnight-800)',
                  border: `1px solid ${selected === p.id ? p.color : 'var(--midnight-600)'}`,
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{
                  width: p.size * 0.7, height: p.size * 0.7,
                  margin: '0 auto 6px', borderRadius: '50%',
                  background: `radial-gradient(circle at 30% 30%, ${p.color}ee, ${p.color}66 70%, transparent 100%)`,
                  boxShadow: `0 0 8px ${p.color}40`,
                }} />
                <div style={{ fontSize: 11, color: 'var(--moonwhite)', fontWeight: 500 }}>{p.name}</div>
                <div className="font-mono" style={{ fontSize: 9, color: 'var(--moonwhite-faint)' }}>{p.mag} mag</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   4. 观测日志 Observation Log
   ============================================================ */
function LogScreen({ onNavigate }) {
  const [tab, setTab] = useStateS('entries');

  const entries = [
    { date: '08.15', title: '英仙座流星雨观测', target: '英仙座 Perseus', time: '02:00 - 04:30', count: 47, rating: 5, notes: '峰值时段，每小时约 110 颗。目视观测记录 47 颗，其中 3 颗亮度超过 -2 等。' },
    { date: '08.12', title: '木星及伽利略卫星', target: '木星 Jupiter', time: '21:00 - 22:15', count: 12, rating: 4, notes: '8 英寸反射镜，200x 放大。清晰看到大红斑及四颗伽利略卫星。' },
    { date: '08.08', title: '土星环观测', target: '土星 Saturn', time: '22:30 - 23:00', count: 5, rating: 5, notes: '环倾角 12.4°，卡西尼环缝隐约可见。土卫六 Titan 明显。' },
    { date: '07.30', title: '银河摄影', target: '银河中心', time: '00:00 - 02:00', count: 36, rating: 4, notes: 'ISO 3200, 20s x 120 张。后期叠加后信噪比良好。' },
  ];

  return (
    <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}>
      <Starfield count={30} speed={0.08} />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <AppTopBar
          subtitle="Observation Journal"
          title="观测日志"
          rightSlot={
            <div className="interactive" style={{
              width: 32, height: 32, borderRadius: 10,
              background: 'var(--comet)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 12px var(--comet-glow)',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--midnight)" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
          }
        />

        {/* 统计数据 */}
        <div style={{ padding: '4px 20px 16px' }}>
          <div style={{
            background: 'linear-gradient(160deg, rgba(76, 214, 167, 0.1) 0%, transparent 60%)',
            border: '1px solid rgba(76, 214, 167, 0.2)',
            borderRadius: 18,
            padding: '18px 20px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--moonwhite-faint)', marginBottom: 4 }}>累计观测</div>
                <div className="font-display" style={{ fontSize: 36, fontWeight: 600, color: 'var(--moonwhite)' }}>
                  <CountUp value={128} duration={2000} />
                  <span style={{ fontSize: 16, color: 'var(--moonwhite-faint)', marginLeft: 4 }}>次</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: 'var(--moonwhite-faint)', marginBottom: 4 }}>本月目标</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="font-display" style={{ fontSize: 24, color: 'var(--aurora)', fontWeight: 500 }}>78%</span>
                  <div style={{ width: 50, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: '78%', height: '100%', background: 'var(--aurora)', boxShadow: '0 0 8px var(--aurora-glow)' }} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16, marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {[
                { label: '天体数', value: 42 },
                { label: '总时长', value: 86, suffix: 'h' },
                { label: '照片', value: 312, suffix: '张' },
              ].map((s, i) => (
                <div key={s.label} style={{ flex: 1 }}>
                  <div className="font-mono" style={{ fontSize: 10, color: 'var(--moonwhite-faint)', marginBottom: 2 }}>
                    {s.label}
                  </div>
                  <div className="font-mono" style={{ fontSize: 16, color: 'var(--moonwhite)', fontWeight: 500 }}>
                    <CountUp key={s.label} value={s.value} duration={1500 + i * 200} />
                    <span style={{ fontSize: 11, color: 'var(--moonwhite-faint)', marginLeft: 2 }}>{s.suffix || ''}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ padding: '0 20px 12px', display: 'flex', gap: 8 }}>
          {[
            { key: 'entries', label: '观测记录' },
            { key: 'targets', label: '目标清单' },
            { key: 'equipment', label: '设备' },
          ].map((t) => (
            <div
              key={t.key}
              className="interactive"
              onClick={() => setTab(t.key)}
              style={{
                padding: '8px 14px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 500,
                transition: 'all 0.3s ease',
                background: tab === t.key ? 'var(--comet)' : 'transparent',
                color: tab === t.key ? 'var(--midnight)' : 'var(--moonwhite-faint)',
                border: `1px solid ${tab === t.key ? 'var(--comet)' : 'var(--midnight-600)'}`,
              }}
            >
              {t.label}
            </div>
          ))}
        </div>

        {/* 记录列表 */}
        <div style={{ padding: '0 20px 120px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {entries.map((entry, i) => (
            <Reveal key={entry.date} delay={i * 100}>
              <div
                className="interactive"
                style={{
                  background: 'var(--midnight-800)',
                  border: '1px solid var(--midnight-600)',
                  borderRadius: 16,
                  padding: 16,
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 122, 26, 0.4)';
                  e.currentTarget.style.transform = 'translateX(2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--midnight-600)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div className="font-mono" style={{ fontSize: 11, color: 'var(--comet)', marginBottom: 4 }}>
                      2026.{entry.date}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--moonwhite)' }}>
                      {entry.title}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {Array.from({ length: 5 }).map((_, si) => (
                      <svg key={si} width="12" height="12" viewBox="0 0 24 24"
                           fill={si < entry.rating ? 'var(--zodiac)' : 'transparent'}
                           stroke={si < entry.rating ? 'var(--zodiac)' : 'var(--midnight-500)'}
                           strokeWidth="1.5">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
                  <div className="font-mono" style={{ fontSize: 10, color: 'var(--moonwhite-faint)' }}>
                    <span style={{ color: 'var(--moonwhite-faint)' }}>目标：</span>{entry.target}
                  </div>
                  <div className="font-mono" style={{ fontSize: 10, color: 'var(--moonwhite-faint)' }}>
                    <span style={{ color: 'var(--moonwhite-faint)' }}>时长：</span>{entry.time}
                  </div>
                </div>

                <p style={{ fontSize: 12, color: 'var(--moonwhite-dim)', lineHeight: 1.6 }}>
                  {entry.notes}
                </p>

                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  marginTop: 12, paddingTop: 10,
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <span className="font-mono" style={{ fontSize: 10, color: 'var(--moonwhite-faint)' }}>
                    记录 {entry.count} 项数据
                  </span>
                  <span className="interactive" style={{ fontSize: 11, color: 'var(--comet)' }}>
                    查看详情 →
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   5. 设计规范页 Design System
   ============================================================ */
function DesignSystemScreen({ onBack }) {
  return (
    <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden', position: 'relative', background: 'var(--midnight)' }}>
      <Starfield count={20} speed={0.05} />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <AppTopBar subtitle="Design System" title="设计规范" onBack={onBack} />

        <div style={{ padding: '4px 20px 120px' }}>
          {/* 签名动效 */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ width: 120, height: 120, margin: '0 auto 12px' }}>
              <StarSignature />
            </div>
            <div style={{ fontSize: 10, color: 'var(--moonwhite-faint)', letterSpacing: '0.15em' }}>SIGNATURE MARK</div>
          </div>

          {/* 色彩系统 */}
          <SectionTitle>色彩系统</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
            {[
              { name: '午夜黑', hex: '#0D0F14', color: '#0D0F14', text: '#F2EFE6' },
              { name: '深岩灰', hex: '#2A2D35', color: '#2A2D35', text: '#F2EFE6' },
              { name: '月影灰', hex: '#4A5162', color: '#4A5162', text: '#F2EFE6' },
              { name: '月白', hex: '#F2EFE6', color: '#F2EFE6', text: '#0D0F14' },
              { name: '彗星橙', hex: '#FF7A1A', color: '#FF7A1A', text: '#0D0F14' },
              { name: '极光绿', hex: '#4CD6A7', color: '#4CD6A7', text: '#0D0F14' },
            ].map((c, i) => (
              <Reveal key={c.hex} delay={i * 60}>
                <GlowCard color={c.color + '40'} style={{ borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ background: c.color, height: 56, position: 'relative' }}>
                    {c.color === '#FF7A1A' && (
                      <div style={{
                        position: 'absolute', inset: 0,
                        boxShadow: 'inset 0 0 20px rgba(255,255,255,0.3)',
                        animation: 'pulse-ring 3s ease-in-out infinite',
                        borderRadius: 12,
                      }} />
                    )}
                  </div>
                  <div style={{ padding: 8, background: 'var(--midnight-800)' }}>
                    <div style={{ fontSize: 11, color: 'var(--moonwhite)', marginBottom: 2 }}>{c.name}</div>
                    <div className="font-mono" style={{ fontSize: 9, color: 'var(--moonwhite-faint)' }}>{c.hex}</div>
                  </div>
                </GlowCard>
              </Reveal>
            ))}
          </div>

          {/* 字体系统 */}
          <SectionTitle>字体系统</SectionTitle>
          <div style={{
            background: 'var(--midnight-800)',
            border: '1px solid var(--midnight-600)',
            borderRadius: 14,
            padding: 16,
            marginBottom: 20,
          }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: 'var(--moonwhite-faint)', letterSpacing: '0.1em', marginBottom: 8 }}>DISPLAY · Cormorant Garamond</div>
              <div className="font-display" style={{ fontSize: 32, fontWeight: 600, color: 'var(--moonwhite)', lineHeight: 1.1 }}>
                Cosmos Atlas
              </div>
              <div className="font-display" style={{ fontSize: 18, color: 'var(--moonwhite-dim)', fontStyle: 'italic', marginTop: 4 }}>
                观星者的终极伙伴
              </div>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14 }}>
              <div style={{ fontSize: 10, color: 'var(--moonwhite-faint)', letterSpacing: '0.1em', marginBottom: 8 }}>BODY · Inter</div>
              <div style={{ fontSize: 14, color: 'var(--moonwhite)', fontWeight: 500, marginBottom: 4 }}>Regular 14px · 正文内容</div>
              <div style={{ fontSize: 12, color: 'var(--moonwhite-dim)', lineHeight: 1.6 }}>
                口袋天文台以简洁克制的界面语言，将浩瀚星空收入掌中。
              </div>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14, marginTop: 14 }}>
              <div style={{ fontSize: 10, color: 'var(--moonwhite-faint)', letterSpacing: '0.1em', marginBottom: 8 }}>MONO · JetBrains Mono</div>
              <div className="font-mono" style={{ fontSize: 12, color: 'var(--comet)' }}>RA 05h 35m 17.4s · Dec +05° 23′ 27″</div>
            </div>
          </div>

          {/* 组件库 */}
          <SectionTitle>组件规范</SectionTitle>
          <div style={{
            background: 'var(--midnight-800)',
            border: '1px solid var(--midnight-600)',
            borderRadius: 14,
            padding: 16,
            marginBottom: 20,
          }}>
            <div style={{ fontSize: 11, color: 'var(--moonwhite-faint)', marginBottom: 10 }}>按钮 Buttons</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
              <MagneticButton>
                <div style={{
                  padding: '10px 20px', borderRadius: 22,
                  background: 'var(--comet)', color: 'var(--midnight)',
                  fontSize: 13, fontWeight: 600,
                  boxShadow: '0 2px 12px var(--comet-glow)',
                }}>
                  主要按钮
                </div>
              </MagneticButton>
              <div className="interactive" style={{
                padding: '10px 20px', borderRadius: 22,
                background: 'transparent', color: 'var(--moonwhite)',
                fontSize: 13, fontWeight: 500,
                border: '1px solid var(--midnight-500)',
              }}>
                次要按钮
              </div>
              <div className="interactive" style={{
                width: 36, height: 36, borderRadius: 12,
                background: 'var(--midnight-700)',
                border: '1px solid var(--midnight-500)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--moonwhite)',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
              </div>
            </div>

            <div style={{ fontSize: 11, color: 'var(--moonwhite-faint)', marginBottom: 10 }}>卡片 Cards</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{
                padding: 14, borderRadius: 14,
                background: 'var(--midnight-700)',
                border: '1px solid var(--midnight-600)',
              }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(255, 122, 26, 0.15)', marginBottom: 8 }} />
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--moonwhite)' }}>标准卡片</div>
                <div style={{ fontSize: 10, color: 'var(--moonwhite-faint)', marginTop: 2 }}>14px radius</div>
              </div>
              <div style={{
                padding: 14, borderRadius: 14,
                background: 'linear-gradient(160deg, rgba(255,122,26,0.12), transparent 60%)',
                border: '1px solid rgba(255, 122, 26, 0.2)',
              }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--comet)', marginBottom: 8 }} />
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--moonwhite)' }}>渐变高亮卡</div>
                <div style={{ fontSize: 10, color: 'var(--moonwhite-faint)', marginTop: 2 }}>Comet glow</div>
              </div>
            </div>
          </div>

          {/* 动效规范 */}
          <SectionTitle>动效规范</SectionTitle>
          <div style={{
            background: 'var(--midnight-800)',
            border: '1px solid var(--midnight-600)',
            borderRadius: 14,
            padding: 16,
            marginBottom: 20,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { name: 'Spring · 弹簧', curve: 'cubic-bezier(0.2, 0.9, 0.3, 1)', duration: '300ms' },
                { name: 'Ease · 缓出', curve: 'cubic-bezier(0.16, 1, 0.3, 1)', duration: '200ms' },
                { name: 'Float · 漂浮', curve: 'ease-in-out', duration: '3-5s' },
                { name: 'Orbit · 轨道', curve: 'linear', duration: '60-180s' },
              ].map((e, i) => (
                <div key={e.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--moonwhite)', fontWeight: 500 }}>{e.name}</div>
                    <div className="font-mono" style={{ fontSize: 10, color: 'var(--moonwhite-faint)' }}>{e.curve}</div>
                  </div>
                  <div className="font-mono" style={{ fontSize: 11, color: 'var(--comet)' }}>{e.duration}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 底部：签名 */}
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div className="font-display" style={{ fontSize: 14, color: 'var(--moonwhite-faint)', fontStyle: 'italic' }}>
              "Ad astra per aspera"
            </div>
            <div style={{ fontSize: 10, color: 'var(--moonwhite-faint)', marginTop: 4, letterSpacing: '0.1em' }}>
              POCKET OBSERVATORY · v2.0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{
      fontSize: 11, color: 'var(--moonwhite-faint)',
      letterSpacing: '0.12em', textTransform: 'uppercase',
      marginBottom: 10, marginTop: 4,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{ width: 16, height: 1, background: 'var(--comet)' }} />
      {children}
    </div>
  );
}

/* ============================================================
   6. 接口文档页 API Docs
   ============================================================ */
function ApiDocsScreen({ onBack }) {
  const [activeTab, setActiveTab] = useStateS('objects');

  const endpoints = {
    objects: [
      { method: 'GET', path: '/api/v2/objects/catalog', desc: '获取天体目录', status: 200 },
      { method: 'GET', path: '/api/v2/objects/:id', desc: '获取天体详情', status: 200 },
      { method: 'GET', path: '/api/v2/objects/tonight', desc: '今夜可见天体', status: 200 },
      { method: 'GET', path: '/api/v2/objects/search', desc: '天体搜索', status: 200 },
    ],
    events: [
      { method: 'GET', path: '/api/v2/events/astronomical', desc: '天文事件列表', status: 200 },
      { method: 'GET', path: '/api/v2/events/meteor', desc: '流星雨预报', status: 200 },
      { method: 'POST', path: '/api/v2/events/reminder', desc: '创建事件提醒', status: 201 },
    ],
    weather: [
      { method: 'GET', path: '/api/v2/weather/observing', desc: '观测天气', status: 200 },
      { method: 'GET', path: '/api/v2/weather/seeing', desc: '视宁度预报', status: 200 },
      { method: 'GET', path: '/api/v2/weather/cloud-cover', desc: '云量实时', status: 200 },
    ],
    log: [
      { method: 'GET', path: '/api/v2/log/entries', desc: '观测记录列表', status: 200 },
      { method: 'POST', path: '/api/v2/log/entries', desc: '创建观测记录', status: 201 },
      { method: 'PUT', path: '/api/v2/log/entries/:id', desc: '更新记录', status: 200 },
      { method: 'DELETE', path: '/api/v2/log/entries/:id', desc: '删除记录', status: 204 },
    ],
  };

  const responseExample = `{
  "id": "obj_orion_001",
  "type": "constellation",
  "name": {
    "zh": "猎户座",
    "en": "Orion",
    "abbrev": "Ori"
  },
  "position": {
    "ra": "05h 35m 17.4s",
    "dec": "+05° 23′ 27″",
    "az": 168.4,
    "alt": 42.7
  },
  "visibility": {
    "magnitude": 0.5,
    "visible": true,
    "rise_time": "18:32",
    "set_time": "05:47"
  },
  "stars": [
    { "id": "betelgeuse", "name": "参宿四", "mag": 0.42, "spectral": "M2Iab" },
    { "id": "rigel", "name": "参宿七", "mag": 0.13, "spectral": "B8Ia" }
  ],
  "updated_at": "2026-08-16T00:00:00Z"
}`;

  return (
    <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden', position: 'relative', background: 'var(--midnight)' }}>
      <Starfield count={15} speed={0.03} />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <AppTopBar subtitle="API Reference" title="接口文档" onBack={onBack} />

        <div style={{ padding: '4px 20px 120px' }}>
          {/* 版本信息 */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(76, 214, 167, 0.1), rgba(255, 122, 26, 0.05))',
            border: '1px solid rgba(76, 214, 167, 0.2)',
            borderRadius: 16,
            padding: '16px 18px',
            marginBottom: 16,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span className="font-display" style={{ fontSize: 18, fontWeight: 500, color: 'var(--moonwhite)' }}>Pocket Observatory API</span>
              <span style={{
                fontSize: 10, fontWeight: 600, padding: '3px 8px',
                background: 'var(--aurora)', color: 'var(--midnight)',
                borderRadius: 6, letterSpacing: '0.05em',
              }}>v2.0</span>
            </div>
            <div className="font-mono" style={{ fontSize: 11, color: 'var(--moonwhite-dim)' }}>
              Base URL: api.pocket-observatory.com/v2
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', color: 'var(--moonwhite-dim)' }}>REST</span>
              <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', color: 'var(--moonwhite-dim)' }}>JSON</span>
              <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', color: 'var(--moonwhite-dim)' }}>WebSocket</span>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto', paddingBottom: 4, margin: '0 -20px 14px', paddingLeft: 20, paddingRight: 20 }}>
            {[
              { key: 'objects', label: '天体' },
              { key: 'events', label: '事件' },
              { key: 'weather', label: '天气' },
              { key: 'log', label: '日志' },
            ].map((t) => (
              <div
                key={t.key}
                className="interactive"
                onClick={() => setActiveTab(t.key)}
                style={{
                  flexShrink: 0,
                  padding: '7px 14px',
                  borderRadius: 18,
                  fontSize: 12,
                  fontWeight: 500,
                  background: activeTab === t.key ? 'var(--midnight-700)' : 'transparent',
                  color: activeTab === t.key ? 'var(--comet)' : 'var(--moonwhite-faint)',
                  border: `1px solid ${activeTab === t.key ? 'var(--comet)' : 'var(--midnight-600)'}`,
                  transition: 'all 0.25s ease',
                }}
              >
                {t.label}
              </div>
            ))}
          </div>

          {/* 接口列表 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {endpoints[activeTab].map((ep, i) => (
              <Reveal key={ep.path} delay={i * 60}>
                <div
                  className="interactive"
                  style={{
                    background: 'var(--midnight-800)',
                    border: '1px solid var(--midnight-600)',
                    borderRadius: 12,
                    padding: 14,
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(76, 214, 167, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--midnight-600)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span className="font-mono" style={{
                      fontSize: 10, fontWeight: 700,
                      padding: '3px 7px', borderRadius: 5,
                      background: ep.method === 'GET' ? 'rgba(76, 214, 167, 0.15)' :
                        ep.method === 'POST' ? 'rgba(255, 122, 26, 0.15)' :
                        ep.method === 'PUT' ? 'rgba(232, 213, 155, 0.15)' :
                        'rgba(255, 100, 100, 0.15)',
                      color: ep.method === 'GET' ? 'var(--aurora)' :
                        ep.method === 'POST' ? 'var(--comet)' :
                        ep.method === 'PUT' ? 'var(--zodiac)' :
                        '#FF6464',
                    }}>
                      {ep.method}
                    </span>
                    <span className="font-mono" style={{ fontSize: 12, color: 'var(--moonwhite)' }}>
                      {ep.path}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--moonwhite-faint)' }}>
                    {ep.desc}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* 响应示例 */}
          <SectionTitle>响应示例</SectionTitle>
          <div style={{
            background: '#08090C',
            border: '1px solid var(--midnight-600)',
            borderRadius: 12,
            overflow: 'hidden',
            marginBottom: 20,
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 14px',
              background: 'var(--midnight-800)',
              borderBottom: '1px solid var(--midnight-600)',
            }}>
              <span className="font-mono" style={{ fontSize: 10, color: 'var(--moonwhite-faint)' }}>GET /objects/:id</span>
              <span style={{ fontSize: 10, color: 'var(--aurora)' }}>200 OK</span>
            </div>
            <pre style={{
              padding: '14px', fontSize: 11,
              color: 'var(--moonwhite-dim)',
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.7,
              overflowX: 'auto',
              margin: 0,
            }}>
              {responseExample}
            </pre>
          </div>

          {/* 速率限制 */}
          <SectionTitle>速率限制</SectionTitle>
          <div style={{
            background: 'var(--midnight-800)',
            border: '1px solid var(--midnight-600)',
            borderRadius: 12,
            padding: 14,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: 'var(--moonwhite)' }}>免费配额</span>
              <span className="font-mono" style={{ fontSize: 12, color: 'var(--comet)' }}>1,000 req/day</span>
            </div>
            <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: '34%', height: '100%', background: 'linear-gradient(90deg, var(--comet), var(--aurora))', boxShadow: '0 0 8px var(--comet-glow)' }} />
            </div>
            <div className="font-mono" style={{ fontSize: 10, color: 'var(--moonwhite-faint)', marginTop: 8 }}>
              X-RateLimit-Limit: 1000 · X-RateLimit-Remaining: 663
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   导出到 window
   ============================================================ */
Object.assign(window, {
  AppTopBar,
  BottomNav,
  TonightScreen,
  ConstellationsScreen,
  PlanetsScreen,
  LogScreen,
  DesignSystemScreen,
  ApiDocsScreen,
});
