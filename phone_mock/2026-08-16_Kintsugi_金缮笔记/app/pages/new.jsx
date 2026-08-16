// 新建修复档案页
function NewRelicPage({ onBack, onCreated }) {
  const [form, setForm] = useState({
    name: '',
    origin: '',
    material: '磁器',
    crackedAt: '2024-08-16',
    description: '',
    emotion: '',
    fragments: 2,
  });
  const [step, setStep] = useState(0); // 0: 基本信息, 1: 裂纹描述, 2: 情感手记, 3: 完成
  const [photoAngle, setPhotoAngle] = useState(0);
  const reduced = useReducedMotion();

  const update = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const steps = ['器の情報', '破損状況', '修復の想い', '完了'];

  // 步骤转场 + 照片视差
  const photoRef = useRef(null);
  useEffect(() => {
    if (reduced) return;
    const photo = photoRef.current;
    if (!photo) return;
    let rafId, start;
    function tick(now) {
      if (!start) start = now;
      const t = (now - start) / 1000;
      // 缓慢浮动 + 轻微 3D 摆动
      const y = Math.sin(t * 0.8) * 3;
      const rotY = Math.sin(t * 0.5) * 3 + photoAngle * 0.5;
      photo.style.transform = `translateY(${y}px) rotateY(${rotY}deg)`;
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [reduced, photoAngle]);

  function handleNext() {
    if (step < 3) setStep(step + 1);
    else {
      onCreated?.();
    }
  }
  function handlePrev() {
    if (step > 0) setStep(step - 1);
    else onBack?.();
  }

  return (
    <div style={{ paddingBottom: 100, minHeight: '100%' }}>
      <KinTopBar
        title="新しい修復"
        subtitle="あたらしい しゅうふく"
        onBack={onBack}
      />

      {/* 进度指示器 */}
      <div style={{
        padding: '12px 20px 20px',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        {steps.map((label, i) => (
          <React.Fragment key={i}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: i <= step ? 'var(--kin-gold)' : 'rgba(212,160,23,0.1)',
              color: i <= step ? 'var(--kin-urushi)' : 'var(--kin-sabi)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 600,
              border: i === step ? '2px solid rgba(212,160,23,0.5)' : 'none',
              transition: 'all 300ms ease',
              fontFamily: "'Shippori Mincho', serif",
              boxShadow: i === step ? '0 0 12px rgba(212,160,23,0.5)' : 'none',
            }}>
              {i < step ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: 2,
                background: i < step ? 'var(--kin-gold)' : 'rgba(212,160,23,0.1)',
                borderRadius: 2,
                transition: 'background 300ms ease',
              }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* 步骤内容 */}
      <div style={{ padding: '0 20px', position: 'relative' }}>
        {/* Step 0: 基本信息 */}
        {step === 0 && (
          <div style={{
            animation: 'kinFadeInUp 400ms cubic-bezier(.2,.8,.2,1) both',
            display: 'flex', flexDirection: 'column', gap: 16,
          }}>
            {/* 拍照占位 */}
            <div
              ref={photoRef}
              onClick={() => setPhotoAngle(a => a + 15)}
              data-cursor="hover"
              style={{
                height: 180,
                borderRadius: 16,
                background: `
                  radial-gradient(ellipse at 30% 30%, rgba(212,160,23,0.15), transparent 60%),
                  linear-gradient(180deg, #1a1918 0%, #0d0c0a 100%)
                `,
                border: '1px dashed rgba(212,160,23,0.3)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 10,
                cursor: 'pointer',
                transformStyle: 'preserve-3d',
                perspective: 600,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* 裂纹装饰 */}
              <svg width="120" height="60" viewBox="0 0 120 60" style={{ opacity: 0.7 }}>
                <path d="M10 30 Q30 10 50 30 T90 25 T115 32"
                  stroke="#D4A017" strokeWidth="1.2" fill="none" strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0 0 3px rgba(212,160,23,0.6))' }}
                />
                <circle cx="50" cy="30" r="2" fill="#ffe28a" />
                <circle cx="90" cy="25" r="1.5" fill="#ffe28a" />
              </svg>
              <div style={{
                fontSize: 12, color: 'var(--kin-gold)',
                letterSpacing: '0.15em',
              }}>タップして写真を追加</div>
              <div style={{
                fontSize: 10, color: 'var(--kin-sabi)',
                letterSpacing: '0.1em',
              }}>破損の様子を記録</div>
            </div>

            <KinInput
              label="器 の 名 前"
              value={form.name}
              onChange={v => update('name', v)}
              placeholder="例：青瓷茶碗"
            />
            <KinInput
              label="由 来 ・ 時 代"
              value={form.origin}
              onChange={v => update('origin', v)}
              placeholder="例：南宋 · 龙泉窑"
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <KinInput label="素 材" value={form.material} onChange={v => update('material', v)} />
              </div>
              <div style={{ flex: 1 }}>
                <KinInput label="破 損 日" type="date" value={form.crackedAt} onChange={v => update('crackedAt', v)} />
              </div>
            </div>
          </div>
        )}

        {/* Step 1: 破损描述 */}
        {step === 1 && (
          <div style={{
            animation: 'kinFadeInUp 400ms cubic-bezier(.2,.8,.2,1) both',
            display: 'flex', flexDirection: 'column', gap: 16,
          }}>
            <div style={{
              background: 'rgba(24,23,26,0.6)',
              border: '1px solid rgba(212,160,23,0.12)',
              borderRadius: 12,
              padding: 16,
            }}>
              <div style={{
                fontSize: 11, color: 'var(--kin-sabi)',
                letterSpacing: '0.15em', marginBottom: 10,
              }}>破片の数</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <button
                  onClick={() => update('fragments', Math.max(1, form.fragments - 1))}
                  data-cursor="hover"
                  style={{
                    width: 40, height: 40, borderRadius: '50%',
                    border: '1px solid rgba(212,160,23,0.3)',
                    background: 'rgba(212,160,23,0.08)',
                    color: 'var(--kin-gold)',
                    fontSize: 20, lineHeight: 1,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >−</button>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{
                    fontFamily: "'Shippori Mincho', serif",
                    fontSize: 32, fontWeight: 700,
                    color: 'var(--kin-gold)',
                    textShadow: '0 0 16px rgba(212,160,23,0.4)',
                  }}>
                    <KinCounter value={form.fragments} duration={400} />
                  </div>
                  <div style={{
                    fontSize: 11, color: 'var(--kin-sabi)',
                    letterSpacing: '0.2em', marginTop: 4,
                  }}>片（へん）</div>
                </div>
                <button
                  onClick={() => update('fragments', Math.min(10, form.fragments + 1))}
                  data-cursor="hover"
                  style={{
                    width: 40, height: 40, borderRadius: '50%',
                    border: '1px solid rgba(212,160,23,0.3)',
                    background: 'rgba(212,160,23,0.08)',
                    color: 'var(--kin-gold)',
                    fontSize: 20, lineHeight: 1,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >+</button>
              </div>
            </div>

            <KinInput
              label="ひ び の 様 子"
              multiline rows={4}
              value={form.description}
              onChange={v => update('description', v)}
              placeholder="裂纹的位置、形状、大小... 例如：器身三道主纹，口沿一处小崩"
            />

            {/* 裂纹类型 Chip 选择 */}
            <div>
              <div style={{
                fontSize: 11, color: 'var(--kin-sabi)',
                letterSpacing: '0.15em', marginBottom: 8, paddingLeft: 2,
              }}>ひびの種類</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['貫入', '貫割', '欠け', '割れ', 'ヒビ網', '高台割れ'].map(t => (
                  <span key={t} data-cursor="hover" className="kin-chip"
                    style={{
                      padding: '6px 12px',
                      fontSize: 11, letterSpacing: '0.1em',
                      borderRadius: 999,
                      background: 'rgba(212,160,23,0.08)',
                      color: 'var(--kin-gold)',
                      border: '1px solid rgba(212,160,23,0.25)',
                      cursor: 'pointer',
                    }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: 情感手记 */}
        {step === 2 && (
          <div style={{
            animation: 'kinFadeInUp 400ms cubic-bezier(.2,.8,.2,1) both',
            display: 'flex', flexDirection: 'column', gap: 16,
          }}>
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <KintsugiSignature width={180} height={30} />
              <div style={{
                marginTop: 12,
                fontFamily: "'Shippori Mincho', serif",
                fontSize: 15, color: 'var(--kin-gofun)',
                letterSpacing: '0.15em',
              }}>
                修復する想いを、書き残してください。
              </div>
            </div>

            <div style={{
              background: 'rgba(245,240,230,0.03)',
              border: '1px solid rgba(245,240,230,0.08)',
              borderRadius: 12,
              padding: 16,
              position: 'relative',
            }}>
              <div style={{
                fontSize: 11, color: 'var(--kin-gold)',
                letterSpacing: '0.2em', marginBottom: 10,
              }}>一 言 メ モ</div>
              <KinInput
                multiline rows={5}
                value={form.emotion}
                onChange={v => update('emotion', v)}
                placeholder="摔碎时的心情、修复它的理由、这器物对你意味着什么..."
              />
            </div>

            <div style={{
              fontSize: 11, color: 'var(--kin-sabi)',
              lineHeight: 1.8, letterSpacing: '0.05em',
              textAlign: 'center', padding: '8px 12px',
              fontStyle: 'italic',
            }}>
              "金繕は、傷を隠すのではなく、<br />その傷を器の歴史として祝福する技法です。"
            </div>
          </div>
        )}

        {/* Step 3: 完成 */}
        {step === 3 && (
          <div style={{
            animation: 'kinFadeInUp 500ms cubic-bezier(.2,.8,.2,1) both',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 16, padding: '20px 0',
          }}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(212,160,23,0.3) 0%, transparent 70%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                border: '2px solid var(--kin-gold)',
                background: 'rgba(212,160,23,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--kin-gold)',
                boxShadow: '0 0 30px rgba(212,160,23,0.5)',
                animation: 'kinPulseGold 2s ease-in-out infinite',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: "'Shippori Mincho', serif",
                fontSize: 20, fontWeight: 700,
                color: 'var(--kin-gofun)',
                letterSpacing: '0.1em',
                marginBottom: 8,
              }}>修復記録、作成しました</div>
              <div style={{
                fontSize: 12, color: 'var(--kin-sabi)',
                letterSpacing: '0.08em', lineHeight: 1.7,
              }}>
                {form.name || '新しい器'} · {form.origin || '不明'}<br />
                {form.fragments} 片の破片を、共に直していきましょう。
              </div>
            </div>

            <KintsugiSignature width={200} height={30} animate={true} />

            <div style={{
              fontSize: 11, color: 'var(--kin-gold)',
              letterSpacing: '0.2em',
            }}>きんつぎ · はじまり</div>
          </div>
        )}
      </div>

      {/* 底部按钮 */}
      <div style={{
        position: 'absolute', left: 20, right: 20, bottom: 76,
        display: 'flex', gap: 10,
      }}>
        {step > 0 && (
          <KinButton variant="secondary" onClick={handlePrev} style={{ flex: 1 }}>
            もどる
          </KinButton>
        )}
        <KinButton
          variant="primary"
          fullWidth
          onClick={handleNext}
          icon={step === 3 ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          )}
        >
          {step === 3 ? 'はじめる' : 'つぎへ'}
        </KinButton>
      </div>
    </div>
  );
}

Object.assign(window, { NewRelicPage });
