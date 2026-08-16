// 首页 — 修复中的器物卡片流
function HomePage({ onSelectRelic }) {
  const [greeting, setGreeting] = useState('');
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setGreeting('今日も一緒に、修繕を続けましょう。');
      return;
    }
  }, [reduced]);

  const stats = [
    { label: '修復中', value: KIN_DATA.relics.filter(r => r.stage !== 'done').length, icon: 'repair' },
    { label: '完 成', value: KIN_DATA.relics.filter(r => r.stage === 'done').length, icon: 'done' },
    { label: '累計ひび', value: KIN_DATA.relics.reduce((s, r) => s + r.crackCount, 0), icon: 'crack' },
  ];

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* 顶部 Hero */}
      <div style={{ padding: '16px 20px 12px' }}>
        <div style={{
          fontSize: 11, color: 'var(--kin-sabi)',
          letterSpacing: '0.25em', marginBottom: 4,
        }}>
          おかえりなさい
        </div>
        <div style={{
          fontFamily: "'Shippori Mincho', serif",
          fontSize: 22, fontWeight: 700,
          color: 'var(--kin-gofun)',
          letterSpacing: '0.08em',
          marginBottom: 4,
        }}>
          <KinTypewriter text="今日も金を継ぐ。" speed={90} delay={200} />
        </div>
        <div style={{
          fontSize: 11, color: 'var(--kin-sabi)',
          letterSpacing: '0.1em', lineHeight: 1.7,
        }}>
          四つの器が、修復の途中です。
        </div>
      </div>

      {/* 签名分隔 */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0 12px' }}>
        <KintsugiSignature width={260} height={28} />
      </div>

      {/* 统计卡 */}
      <div style={{ padding: '0 20px 20px', display: 'flex', gap: 10 }}>
        {stats.map((s, i) => (
          <div
            key={s.label}
            data-cursor="hover"
            style={{
              flex: 1,
              background: 'linear-gradient(180deg, rgba(24,23,26,0.7) 0%, rgba(14,14,16,0.9) 100%)',
              border: '1px solid rgba(212,160,23,0.12)',
              borderRadius: 12,
              padding: '14px 10px',
              textAlign: 'center',
              animation: `kinFadeInUp 500ms cubic-bezier(.2,.8,.2,1) ${i * 100}ms both`,
              transition: 'border-color 250ms ease, transform 250ms ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(212,160,23,0.35)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(212,160,23,0.12)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{
              fontFamily: "'Shippori Mincho', serif",
              fontSize: 22, fontWeight: 700,
              color: 'var(--kin-gold)',
              lineHeight: 1,
              textShadow: '0 0 10px rgba(212,160,23,0.3)',
            }}>
              <KinCounter value={s.value} duration={1400} />
            </div>
            <div style={{
              fontSize: 10, color: 'var(--kin-sabi)',
              letterSpacing: '0.2em', marginTop: 6,
            }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Section 标题 */}
      <div style={{
        padding: '8px 20px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{
          fontFamily: "'Noto Serif JP', serif",
          fontSize: 15, fontWeight: 500,
          color: 'var(--kin-gofun)',
          letterSpacing: '0.12em',
        }}>修復中の器</div>
        <span style={{ fontSize: 11, color: 'var(--kin-gold)', letterSpacing: '0.1em' }}>全 {KIN_DATA.relics.length} 件</span>
      </div>

      {/* 卡片列表 */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {KIN_DATA.relics.map((relic, i) => (
          <div
            key={relic.id}
            style={{
              animation: `kinScrollIn 600ms cubic-bezier(.2,.8,.2,1) ${150 + i * 120}ms both`,
            }}
          >
            <RelicCard relic={relic} index={i} onClick={() => onSelectRelic(relic.id)} />
          </div>
        ))}
      </div>

      {/* 底部留白 */}
      <div style={{ height: 20 }} />
    </div>
  );
}

Object.assign(window, { HomePage });
