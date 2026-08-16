// 设计规范页 — 色板/字体/组件/动效 token
function SpecPage() {
  const [tab, setTab] = useState('color'); // color / typography / spacing / component / motion

  const tabs = [
    { key: 'color', label: '色彩' },
    { key: 'type', label: '書体' },
    { key: 'space', label: '余白' },
    { key: 'comp', label: '部品' },
    { key: 'motion', label: '動き' },
  ];

  return (
    <div style={{ paddingBottom: 80 }}>
      <KinTopBar
        title="デザイン便覧"
        subtitle="design system · v2.0"
      />

      {/* Tab */}
      <div style={{
        padding: '4px 20px 16px',
        display: 'flex', gap: 4,
        overflowX: 'auto',
        scrollbarWidth: 'none',
        borderBottom: '1px solid rgba(212,160,23,0.08)',
        marginBottom: 16,
      }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            data-cursor="hover"
            className="kin-tab"
            style={{
              flexShrink: 0,
              padding: '8px 14px',
              background: 'none', border: 'none',
              color: tab === t.key ? 'var(--kin-gold)' : 'var(--kin-sabi)',
              fontSize: 12, fontWeight: tab === t.key ? 600 : 400,
              letterSpacing: '0.15em',
              cursor: 'pointer',
              fontFamily: "'Noto Sans JP', sans-serif",
              position: 'relative',
            }}
          >
            {t.label}
            {tab === t.key && (
              <div style={{
                position: 'absolute', bottom: -1, left: 14, right: 14,
                height: 2, background: 'var(--kin-gold)',
                boxShadow: '0 0 6px var(--kin-gold)', borderRadius: 2,
              }} />
            )}
          </button>
        ))}
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {tab === 'color' && <ColorSpec />}
        {tab === 'type' && <TypeSpec />}
        {tab === 'space' && <SpaceSpec />}
        {tab === 'comp' && <ComponentSpec />}
        {tab === 'motion' && <MotionSpec />}
      </div>
    </div>
  );
}

function ColorSpec() {
  const colors = KIN_DATA.tokens.colors;
  return (
    <>
      <SpecSection title="カラーパレット" subtitle="color palette">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {colors.map((c, i) => (
            <div key={c.name} style={{
              animation: `kinFadeInUp 400ms ease ${i * 60}ms both`,
            }}>
              <div style={{
                height: 72,
                background: c.hex,
                borderRadius: '10px 10px 0 0',
                border: c.hex === '#0E0E10' || c.hex === '#18171a'
                  ? '1px solid rgba(212,160,23,0.15)'
                  : '1px solid rgba(0,0,0,0.1)',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
                data-cursor="hover"
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(212,160,23,0.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {c.name.includes('金') && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
                    animation: 'kinShimmer 3s ease-in-out infinite',
                  }} />
                )}
              </div>
              <div style={{
                background: 'rgba(24,23,26,0.8)',
                border: '1px solid rgba(212,160,23,0.1)',
                borderTop: 'none',
                borderRadius: '0 0 10px 10px',
                padding: '8px 10px',
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 500,
                  color: 'var(--kin-gofun)',
                  letterSpacing: '0.05em',
                  marginBottom: 2,
                }}>{c.name}</div>
                <div style={{
                  fontSize: 10, color: 'var(--kin-sabi)',
                  fontFamily: 'monospace', letterSpacing: '0.05em',
                  marginBottom: 2,
                }}>{c.hex.toUpperCase()}</div>
                <div style={{
                  fontSize: 9, color: 'var(--kin-gold)',
                  opacity: 0.7, letterSpacing: '0.08em',
                }}>{c.role}</div>
              </div>
            </div>
          ))}
        </div>
      </SpecSection>
    </>
  );
}

function TypeSpec() {
  const fonts = KIN_DATA.tokens.fonts;
  return (
    <>
      <SpecSection title="タイポグラフィ" subtitle="typography">
        {fonts.map((f, i) => (
          <div key={f.name} style={{
            padding: '14px 0',
            borderBottom: i < fonts.length - 1 ? '1px solid rgba(212,160,23,0.08)' : 'none',
            animation: `kinFadeInUp 400ms ease ${i * 80}ms both`,
          }}>
            <div style={{
              fontFamily: f.name === 'Shippori Mincho' ? "'Shippori Mincho', serif"
                : f.name === 'Noto Serif JP' ? "'Noto Serif JP', serif"
                : "'Noto Sans JP', sans-serif",
              fontSize: 24, color: 'var(--kin-gofun)',
              marginBottom: 6,
              letterSpacing: '0.05em',
            }}>
              {f.name === 'Shippori Mincho' ? '金繕の美' : f.name === 'Noto Serif JP' ? '器の名前' : '修復記録'}
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ fontSize: 12, color: 'var(--kin-gofun-2)' }}>{f.name}</div>
              <div style={{ fontSize: 10, color: 'var(--kin-sabi)', letterSpacing: '0.1em' }}>{f.usage}</div>
            </div>
            <div style={{
              fontSize: 10, color: 'var(--kin-gold)',
              opacity: 0.6, marginTop: 4, letterSpacing: '0.1em',
            }}>weights: {f.weights}</div>
          </div>
        ))}
      </SpecSection>

      <SpecSection title="字 級 サ ン プ ル" subtitle="type scale">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { size: 32, weight: 700, label: 'Display / 見出し', font: "'Shippori Mincho', serif" },
            { size: 22, weight: 700, label: 'Title / 大見出し', font: "'Shippori Mincho', serif" },
            { size: 17, weight: 500, label: 'Heading / 中見出し', font: "'Noto Serif JP', serif" },
            { size: 14, weight: 500, label: 'Body / 本文強調', font: "'Noto Sans JP', sans-serif" },
            { size: 13, weight: 400, label: 'Body / 本文', font: "'Noto Sans JP', sans-serif" },
            { size: 11, weight: 400, label: 'Caption / 注釈', font: "'Noto Sans JP', sans-serif" },
            { size: 10, weight: 400, label: 'Label / ラベル', font: "'Noto Sans JP', sans-serif" },
          ].map((t, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'baseline', gap: 16,
              padding: '6px 0',
              borderBottom: '1px solid rgba(212,160,23,0.06)',
              animation: `kinFadeInUp 400ms ease ${i * 50}ms both`,
            }}>
              <span style={{
                fontSize: t.size, fontWeight: t.weight,
                fontFamily: t.font, color: 'var(--kin-gofun)',
                flex: 1, letterSpacing: '0.04em',
              }}>金繕 Kintsugi</span>
              <span style={{
                fontSize: 9, color: 'var(--kin-sabi)',
                letterSpacing: '0.08em', minWidth: 80, textAlign: 'right',
              }}>{t.size}px · {t.label}</span>
            </div>
          ))}
        </div>
      </SpecSection>
    </>
  );
}

function SpaceSpec() {
  const spacing = KIN_DATA.tokens.spacing;
  const radius = KIN_DATA.tokens.radius;
  return (
    <>
      <SpecSection title="ス ペ ー シ ン グ" subtitle="spacing scale">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {spacing.map((s, i) => (
            <div key={s}
              className="kin-row" data-cursor="hover"
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '6px 0',
                animation: `kinFadeInUp 400ms ease ${i * 50}ms both`,
              }}
            >
              <div style={{
                height: 20,
                width: s,
                background: 'linear-gradient(90deg, #8a6808, #D4A017)',
                borderRadius: 2,
                boxShadow: '0 0 6px rgba(212,160,23,0.3)',
                minWidth: 4,
              }} />
              <div style={{
                fontSize: 11, color: 'var(--kin-gofun-2)',
                fontFamily: 'monospace', minWidth: 60,
              }}>{`--space-${i}`}</div>
              <div style={{ fontSize: 10, color: 'var(--kin-sabi)' }}>{s}</div>
            </div>
          ))}
        </div>
      </SpecSection>

      <SpecSection title="角 丸 み" subtitle="border radius">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {radius.map((r, i) => (
            <div key={r} style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 6,
              animation: `kinFadeInUp 400ms ease ${i * 60}ms both`,
            }}>
              <div style={{
                width: 48, height: 48,
                background: 'rgba(212,160,23,0.15)',
                border: '1px solid rgba(212,160,23,0.3)',
                borderRadius: r,
              }} />
              <div style={{ fontSize: 10, color: 'var(--kin-sabi)', fontFamily: 'monospace' }}>{r}</div>
            </div>
          ))}
        </div>
      </SpecSection>
    </>
  );
}

function ComponentSpec() {
  return (
    <>
      <SpecSection title="ボ タ ン" subtitle="buttons">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <KinButton fullWidth variant="primary">Primary · 主な操作</KinButton>
          <KinButton fullWidth variant="secondary">Secondary · 次の操作</KinButton>
          <KinButton fullWidth variant="ghost">Ghost · 補助操作</KinButton>
        </div>
      </SpecSection>

      <SpecSection title="チ ッ プ" subtitle="chips">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <KinChip size="sm">filled · sm</KinChip>
          <KinChip size="md">filled · md</KinChip>
          <KinChip size="sm" variant="outline">outline</KinChip>
          <KinChip size="md" variant="solid">solid</KinChip>
        </div>
      </SpecSection>

      <SpecSection title="入 力 欄" subtitle="inputs">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <KinInput label="器の名前" placeholder="例：青瓷茶碗" value="青瓷茶碗" />
          <KinInput label="メモ" multiline rows={3} placeholder="修復のメモ..." value="三日間陰干し" />
        </div>
      </SpecSection>

      <SpecSection title="進 捗 環" subtitle="progress ring">
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '8px 0' }}>
          <ProgressRing progress={35} size={56} strokeWidth={3} />
          <ProgressRing progress={68} size={56} strokeWidth={3} />
          <ProgressRing progress={92} size={56} strokeWidth={3} />
          <ProgressRing progress={100} size={56} strokeWidth={3} />
        </div>
      </SpecSection>
    </>
  );
}

function MotionSpec() {
  const effects = KIN_DATA.tokens.effects;
  const motions = [
    { name: '描金成長', desc: 'stroke-dashoffset で金色の線がゆっくりと成長する', duration: '1.5–2.5s' },
    { name: 'バネ式カーソル', desc: 'リングとドットがバネ物理で独立追従', duration: '連続' },
    { name: '金粉粒子', desc: '背景に漂う金粉、マウス付近で反発', duration: '連続' },
    { name: '3D チルト', desc: 'カードがマウス位置に合わせて傾く', duration: '連続' },
    { name: 'クリック波紋', desc: 'クリック箇所から金色の輪が広がる', duration: '550ms' },
    { name: '光沢スイープ', desc: 'カード表面を金色の光が定期的になぞる', duration: '6s 周期' },
    { name: 'カウントアップ', desc: '数字が spring easing で目標値まで増加', duration: '1.2–1.5s' },
    { name: 'タイプライター', desc: '文字が一文字ずつ打たれるように出現', duration: '文字数 × 50ms' },
    { name: 'フェードイン', desc: '下からふわりと現れる', duration: '400–600ms' },
    { name: 'パルス', desc: '金色の脈動、重要な状態に使用', duration: '2s 周期' },
    { name: 'フロート', desc: '要素がゆっくりと上下に浮遊', duration: '4s 周期' },
    { name: 'スクロールイン', desc: 'リスト項目が順番に現れる', duration: '600ms + stagger' },
  ];

  return (
    <>
      <SpecSection title="動 き の 原 理" subtitle="motion principles">
        <div style={{
          fontSize: 12, color: 'var(--kin-gofun-2)',
          lineHeight: 1.9, letterSpacing: '0.04em',
        }}>
          金繕の動きは、<span style={{ color: 'var(--kin-gold)' }}>漆の粘性</span>と
          <span style={{ color: 'var(--kin-gold)' }}>金の輝き</span>をモチーフにしています。
          すべてのトランジションは easing を統一し、物理モデル（バネ・慣性・減衰）
          に基づいて自然な動きを再現しています。
        </div>
      </SpecSection>

      <SpecSection title="エ フ ェ ク ト 一 覧" subtitle="effect tokens">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {effects.map((e, i) => (
            <div key={e.name} style={{
              padding: '10px 12px',
              background: 'rgba(24,23,26,0.6)',
              border: '1px solid rgba(212,160,23,0.1)',
              borderRadius: 8,
              animation: `kinFadeInUp 400ms ease ${i * 50}ms both`,
            }}>
              <div style={{
                fontSize: 12, color: 'var(--kin-gold)',
                fontWeight: 500, marginBottom: 3,
                letterSpacing: '0.08em',
              }}>{e.name}</div>
              <div style={{
                fontSize: 10, color: 'var(--kin-sabi)',
                fontFamily: 'monospace',
              }}>{e.desc}</div>
            </div>
          ))}
        </div>
      </SpecSection>

      <SpecSection title="コ ン ポ ー ネ ン ト 別 動 き" subtitle="component motions">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {motions.map((m, i) => (
            <div key={m.name} style={{
              display: 'flex',
              justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0',
              borderBottom: '1px solid rgba(212,160,23,0.06)',
              animation: `kinFadeInUp 400ms ease ${i * 40}ms both`,
            }}
              className="kin-row" data-cursor="hover"
            >
              <div>
                <div style={{ fontSize: 12, color: 'var(--kin-gofun)', marginBottom: 2 }}>{m.name}</div>
                <div style={{ fontSize: 10, color: 'var(--kin-sabi)' }}>{m.desc}</div>
              </div>
              <div style={{
                fontSize: 10, color: 'var(--kin-gold)',
                fontFamily: 'monospace', letterSpacing: '0.05em',
              }}>{m.duration}</div>
            </div>
          ))}
        </div>
      </SpecSection>
    </>
  );
}

function SpecSection({ title, subtitle, children }) {
  return (
    <div style={{
      background: 'rgba(24,23,26,0.4)',
      border: '1px solid rgba(212,160,23,0.08)',
      borderRadius: 14,
      padding: 16,
    }}>
      <div style={{
        display: 'flex', alignItems: 'baseline',
        justifyContent: 'space-between',
        marginBottom: 12,
      }}>
        <div style={{
          fontSize: 13, fontWeight: 500,
          color: 'var(--kin-gofun)',
          letterSpacing: '0.15em',
          fontFamily: "'Noto Serif JP', serif",
        }}>{title}</div>
        <div style={{
          fontSize: 9, color: 'var(--kin-gold)',
          opacity: 0.6, letterSpacing: '0.2em',
        }}>{subtitle}</div>
      </div>
      {children}
    </div>
  );
}

Object.assign(window, { SpecPage });
