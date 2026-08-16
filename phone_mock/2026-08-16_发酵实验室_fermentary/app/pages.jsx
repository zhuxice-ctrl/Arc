// ── 页面组件 ──

// ============================================================
// 1. HomePage — 首页（发酵批次列表）
// ============================================================
function HomePage({ batches, onBatchClick, onNewBatch, dark, t }) {
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    const cleanup = observeFadeItems(scrollRef.current);
    return cleanup;
  }, [batches]);

  const activeCount = batches.filter(b => b.activity !== 'completed').length;

  return (
    <div
      ref={scrollRef}
      className="phone-scroll page-enter"
      style={{
        height: '100%', overflowY: 'auto',
        paddingTop: 'var(--ios-safe-top)',
        paddingBottom: 100,
      }}
    >
      {/* Header */}
      <div style={{ padding: '8px 20px 4px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 6,
        }}>
          <div>
            <div style={{
              fontSize: 12, color: hexToRgba(t.cream, 0.5),
              letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 4,
            }}>发酵实验室</div>
            <div className="serif" style={{
              fontSize: 28, fontWeight: 600, color: t.cream,
              letterSpacing: '-0.02em', lineHeight: 1.1,
            }}>
              你好，<span style={{ color: t.butter }}>烘焙师</span>
            </div>
          </div>
          <div className="interactive" style={{
            width: 40, height: 40, borderRadius: '50%',
            background: `linear-gradient(135deg, ${t.butter}, ${t.accent})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 600, color: t.cocoa,
            cursor: 'pointer',
          }}>
            曦
          </div>
        </div>
      </div>

      {/* Hero: Active batch overview with dough breathe */}
      <div className="fade-item" style={{
        margin: '16px 16px 20px', padding: 20,
        borderRadius: 24,
        background: `linear-gradient(160deg, ${hexToRgba(t.butter, 0.12)} 0%, ${hexToRgba(t.accent, 0.05)} 100%)`,
        border: `0.5px solid ${hexToRgba(t.butter, 0.2)}`,
        position: 'relative', overflow: 'hidden',
        cursor: 'pointer',
      }} onClick={() => onBatchClick(batches[0]?.id)}>
        <BubbleField activity={batches[0]?.activity || 'medium'} color={t.butter} count={18} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <DoughBreathe scale={t.doughScale} color={t.butter} size={90} speed={t.speed} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 11, color: t.butter, fontWeight: 600,
              letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4,
            }}>正在发酵</div>
            <div className="serif" style={{
              fontSize: 18, fontWeight: 600, color: t.cream,
              marginBottom: 2, lineHeight: 1.2,
            }}>{batches[0]?.name}</div>
            <div style={{ fontSize: 12, color: hexToRgba(t.cream, 0.55), marginBottom: 10 }}>
              基础发酵阶段 · 温度 {batches[0]?.temp}°C
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="mono" style={{
                fontSize: 20, fontWeight: 500, color: t.butter,
                fontVariantNumeric: 'tabular-nums',
              }}>
                02:36:00
              </div>
              <div style={{ fontSize: 11, color: hexToRgba(t.cream, 0.4) }}>
                剩余
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Type filter */}
      <div className="fade-item" style={{
        display: 'flex', gap: 8, padding: '0 16px',
        marginBottom: 16, overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        {[
          { key: 'all', label: '全部', count: batches.length },
          ...Object.values(FERMENT_TYPES).map(type => ({
            key: type.id, label: type.name,
            count: batches.filter(b => b.type === type.id).length,
          })),
        ].map((f, i) => (
          <button key={f.key} className="interactive" style={{
            flexShrink: 0, padding: '7px 14px',
            borderRadius: 100,
            border: `0.5px solid ${i === 0 ? hexToRgba(t.butter, 0.5) : hexToRgba(t.cream, 0.12)}`,
            background: i === 0 ? hexToRgba(t.butter, 0.12) : 'transparent',
            color: i === 0 ? t.butter : hexToRgba(t.cream, 0.7),
            fontSize: 13, fontWeight: i === 0 ? 600 : 400,
            cursor: 'pointer',
            transition: 'all 200ms',
          }}>
            {f.label} <span style={{ opacity: 0.6 }}>{f.count}</span>
          </button>
        ))}
      </div>

      {/* Batch list */}
      <div style={{ padding: '0 16px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 12,
        }}>
          <div className="serif" style={{
            fontSize: 18, fontWeight: 600, color: t.cream,
          }}>发酵中的批次</div>
          <div style={{ fontSize: 12, color: hexToRgba(t.cream, 0.5) }}>
            {activeCount} 个进行中
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {batches.map(batch => (
            <FermentCard
              key={batch.id}
              batch={batch}
              onClick={() => onBatchClick(batch.id)}
              dark={dark}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 2. DetailPage — 批次详情页
// ============================================================
function DetailPage({ batch, onBack, dark, t }) {
  const scrollRef = React.useRef(null);
  const type = FERMENT_TYPES[batch.type];
  const currentStageIdx = type.stages.findIndex(s => s.key === batch.currentStage);
  const tempData = React.useMemo(() => genTempCurve(42, batch.targetTemp, 2.5, 24), [batch.id, batch.targetTemp]);

  // Countdown
  const [elapsed, setElapsed] = React.useState(batch.progress * type.stages[currentStageIdx]?.duration * 60 || 0);

  React.useEffect(() => {
    if (reducedMotion) return;
    let timer = null;
    const total = type.stages[currentStageIdx]?.duration * 60 || 1;
    const tick = () => {
      setElapsed(prev => {
        if (prev >= total) return prev;
        return prev + 1;
      });
    };
    timer = setInterval(tick, 1000 / t.speed);
    return () => clearInterval(timer);
  }, [batch.id, t.speed]);

  React.useEffect(() => {
    const cleanup = observeFadeItems(scrollRef.current);
    return cleanup;
  }, [batch.id]);

  const currentStage = type.stages[currentStageIdx];
  const totalStageSec = (currentStage?.duration || 1) * 60;

  return (
    <div
      ref={scrollRef}
      className="phone-scroll page-enter"
      style={{
        height: '100%', overflowY: 'auto',
        paddingBottom: 50,
        background: `linear-gradient(180deg, ${hexToRgba(type.color, 0.15)} 0%, transparent 280px)`,
      }}
    >
      <div style={{ paddingTop: 'var(--ios-safe-top)' }}>
        <NavHeader
          title={type.name}
          subtitle={batch.recipe}
          onBack={onBack}
          dark={dark}
          right={
            <button className="interactive" style={{
              background: 'transparent', border: 'none',
              cursor: 'pointer', padding: 0, width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: t.cream,
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="4" r="1.5" fill="currentColor"/>
                <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
                <circle cx="10" cy="16" r="1.5" fill="currentColor"/>
              </svg>
            </button>
          }
        />
      </div>

      <div style={{ padding: '4px 20px 0' }}>
        <div className="serif fade-item" style={{
          fontSize: 24, fontWeight: 600, color: t.cream,
          letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 6,
        }}>{batch.name}</div>
        <div className="fade-item" style={{ fontSize: 13, color: hexToRgba(t.cream, 0.55), marginBottom: 20 }}>
          {formatTimeAgo(batch.startAt)} 开始 · 第 {currentStageIdx + 1}/{type.stages.length} 阶段
        </div>
      </div>

      {/* Countdown ring */}
      <div className="fade-item" style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: '8px 0 20px',
        position: 'relative',
      }}>
        <div style={{ position: 'relative' }}>
          <BubbleField activity={batch.activity} color={type.color} count={14} />
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: -1,
          }}>
            <div style={{ width: 220, height: 220 }}>
              <DoughBreathe scale={t.doughScale} color={hexToRgba(type.color, 0.2)} size={220} speed={t.speed * 0.5} />
            </div>
          </div>
          <CountdownRing
            totalSeconds={totalStageSec}
            elapsed={elapsed}
            size={180}
            strokeWidth={8}
            color={type.color}
            bgColor={hexToRgba(type.color, 0.1)}
            speedMul={t.bubbleRate}
            label="剩余时间"
          />
        </div>
      </div>

      {/* Quick stats */}
      <div className="fade-item" style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 10, padding: '0 16px', marginBottom: 20,
      }}>
        <div style={{
          padding: '14px 10px', borderRadius: 14,
          background: hexToRgba(t.cream, 0.05),
          textAlign: 'center',
          border: `0.5px solid ${hexToRgba(t.cream, 0.08)}`,
        }}>
          <div className="mono" style={{ fontSize: 18, fontWeight: 500, color: t.butter }}>
            {batch.temp}°C
          </div>
          <div style={{ fontSize: 11, color: hexToRgba(t.cream, 0.5), marginTop: 2 }}>温度</div>
        </div>
        <div style={{
          padding: '14px 10px', borderRadius: 14,
          background: hexToRgba(t.cream, 0.05),
          textAlign: 'center',
          border: `0.5px solid ${hexToRgba(t.cream, 0.08)}`,
        }}>
          <div className="mono" style={{ fontSize: 18, fontWeight: 500, color: t.butter }}>
            {batch.ph}
          </div>
          <div style={{ fontSize: 11, color: hexToRgba(t.cream, 0.5), marginTop: 2 }}>pH 值</div>
        </div>
        <div style={{
          padding: '14px 10px', borderRadius: 14,
          background: hexToRgba(t.cream, 0.05),
          textAlign: 'center',
          border: `0.5px solid ${hexToRgba(t.cream, 0.08)}`,
        }}>
          <div className="mono" style={{ fontSize: 18, fontWeight: 500, color: t.butter }}>
            {Math.round(batch.progress * 100)}%
          </div>
          <div style={{ fontSize: 11, color: hexToRgba(t.cream, 0.5), marginTop: 2 }}>总进度</div>
        </div>
      </div>

      {/* Temperature chart */}
      <div className="fade-item" style={{
        margin: '0 16px 20px', padding: '16px',
        borderRadius: 18,
        background: hexToRgba(t.cream, 0.04),
        border: `0.5px solid ${hexToRgba(t.cream, 0.08)}`,
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 12,
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: t.cream }}>温度曲线</div>
          <div style={{ fontSize: 11, color: hexToRgba(t.cream, 0.4) }}>过去 24 小时</div>
        </div>
        <TempCurveChart data={tempData} width={300} height={100} color={type.color} dark={dark} />
      </div>

      {/* Stage timeline */}
      <div className="fade-item" style={{
        margin: '0 16px 20px', padding: '16px 16px 4px',
        borderRadius: 18,
        background: hexToRgba(t.cream, 0.04),
        border: `0.5px solid ${hexToRgba(t.cream, 0.08)}`,
      }}>
        <div style={{
          fontSize: 14, fontWeight: 600, color: t.cream,
          marginBottom: 8,
        }}>发酵时间线</div>
        <StageTimeline stages={type.stages} currentIndex={currentStageIdx} dark={dark} />
      </div>

      {/* Flavor tags */}
      <div className="fade-item" style={{ padding: '0 16px 16px' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: t.cream, marginBottom: 10 }}>
          风味描述
        </div>
        <div>
          {batch.flavor.map(f => (
            <TagChip key={f} label={f} color={type.color} dark={dark} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 3. NewBatchPage — 新建批次
// ============================================================
function NewBatchPage({ onBack, onSubmit, dark, t }) {
  const [step, setStep] = React.useState(0);
  const [selectedType, setSelectedType] = React.useState(null);
  const [name, setName] = React.useState('');
  const [recipe, setRecipe] = React.useState('');

  const steps = ['选择类型', '基本信息', '设置阶段', '确认创建'];

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);
    setTimeout(() => setStep(1), 250);
  };

  return (
    <div className="phone-scroll page-enter" style={{
      height: '100%', overflowY: 'auto',
      paddingBottom: 50,
    }}>
      <div style={{ paddingTop: 'var(--ios-safe-top)' }}>
        <NavHeader title="新建发酵" subtitle={`步骤 ${step + 1} / ${steps.length}`} onBack={onBack} dark={dark} />
      </div>

      {/* Progress dots */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 6,
        padding: '0 0 16px',
      }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            width: i === step ? 24 : 6, height: 6, borderRadius: 3,
            background: i <= step ? t.butter : hexToRgba(t.cream, 0.15),
            transition: 'all 300ms cubic-bezier(.2,.8,.2,1)',
          }} />
        ))}
      </div>

      <div style={{ padding: '0 20px' }}>
        <div className="serif fade-item" style={{
          fontSize: 22, fontWeight: 600, color: t.cream,
          letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 4,
        }}>{steps[step]}</div>
        <div className="fade-item" style={{ fontSize: 13, color: hexToRgba(t.cream, 0.5), marginBottom: 24 }}>
          {step === 0 && '选择你想发酵的类型，开始新的旅程'}
          {step === 1 && '给你的批次起个名字，选择配方'}
          {step === 2 && '调整各阶段时长和温度参数'}
          {step === 3 && '确认信息，启动发酵'}
        </div>

        {/* Step 0: Type selection */}
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.values(FERMENT_TYPES).map((type, idx) => (
              <button
                key={type.id}
                className="interactive fade-item"
                onClick={() => handleTypeSelect(type.id)}
                style={{
                  position: 'relative',
                  padding: 18, borderRadius: 18,
                  background: hexToRgba(t.cream, 0.05),
                  border: `0.5px solid ${hexToRgba(type.color, 0.25)}`,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 14,
                  textAlign: 'left',
                  overflow: 'hidden',
                  transition: 'transform 200ms cubic-bezier(.2,.8,.2,1)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(4px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)'; }}
              >
                <BubbleField activity="medium" color={type.color} count={8} />
                <div style={{
                  position: 'relative',
                  width: 52, height: 52, borderRadius: 16,
                  background: `linear-gradient(135deg, ${hexToRgba(type.color, 0.3)}, ${hexToRgba(type.color, 0.1)})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26,
                  flexShrink: 0,
                }}>
                  {type.emoji}
                </div>
                <div style={{ position: 'relative', flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: t.cream, marginBottom: 2 }}>
                    {type.name}
                  </div>
                  <div style={{ fontSize: 12, color: hexToRgba(t.cream, 0.5), marginBottom: 6 }}>
                    {type.nameEn} · {type.stages.length} 个阶段
                  </div>
                  <div style={{ fontSize: 11, color: hexToRgba(t.cream, 0.35) }}>
                    {formatDuration(type.stages.reduce((s, st) => s + st.duration, 0))}
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" style={{
                  position: 'relative', flexShrink: 0,
                  color: hexToRgba(t.cream, 0.3),
                }}>
                  <path d="M5 2l6 6-6 6" stroke="currentColor" strokeWidth="1.8"
                        strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </button>
            ))}
          </div>
        )}

        {/* Step 1: Basic info */}
        {step === 1 && selectedType && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="fade-item">
              <label style={{ fontSize: 13, color: hexToRgba(t.cream, 0.6), marginBottom: 8, display: 'block' }}>
                批次名称
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={`我的${FERMENT_TYPES[selectedType].name}`}
                style={{
                  width: '100%', padding: '14px 16px',
                  borderRadius: 14,
                  background: hexToRgba(t.cream, 0.05),
                  border: `0.5px solid ${hexToRgba(t.cream, 0.1)}`,
                  color: t.cream, fontSize: 15,
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>
            <div className="fade-item">
              <label style={{ fontSize: 13, color: hexToRgba(t.cream, 0.6), marginBottom: 8, display: 'block' }}>
                配方
              </label>
              <input
                type="text"
                value={recipe}
                onChange={(e) => setRecipe(e.target.value)}
                placeholder="选择或输入配方名称"
                style={{
                  width: '100%', padding: '14px 16px',
                  borderRadius: 14,
                  background: hexToRgba(t.cream, 0.05),
                  border: `0.5px solid ${hexToRgba(t.cream, 0.1)}`,
                  color: t.cream, fontSize: 15,
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>
            <div className="fade-item">
              <label style={{ fontSize: 13, color: hexToRgba(t.cream, 0.6), marginBottom: 10, display: 'block' }}>
                推荐配方
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['基础配方', '经典配方', '进阶版', '快速版'].map(r => (
                  <button key={r} className="interactive"
                    onClick={() => setRecipe(r)}
                    style={{
                      padding: '6px 14px', borderRadius: 100,
                      background: recipe === r ? hexToRgba(t.butter, 0.15) : hexToRgba(t.cream, 0.05),
                      border: `0.5px solid ${recipe === r ? hexToRgba(t.butter, 0.4) : hexToRgba(t.cream, 0.1)}`,
                      color: recipe === r ? t.butter : hexToRgba(t.cream, 0.7),
                      fontSize: 12, cursor: 'pointer',
                    }}>{r}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Stage settings (simplified) */}
        {step === 2 && selectedType && (
          <div style={{
            background: hexToRgba(t.cream, 0.04),
            borderRadius: 18,
            border: `0.5px solid ${hexToRgba(t.cream, 0.08)}`,
            overflow: 'hidden',
          }}>
            {FERMENT_TYPES[selectedType].stages.map((stage, i) => (
              <div key={stage.key} className="fade-item" style={{
                padding: '14px 16px',
                display: 'flex', alignItems: 'center', gap: 12,
                borderBottom: i < FERMENT_TYPES[selectedType].stages.length - 1
                  ? `0.5px solid ${hexToRgba(t.cream, 0.06)}` : 'none',
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: hexToRgba(t.butter, 0.15),
                  color: t.butter, fontSize: 12, fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: t.cream, fontWeight: 500 }}>{stage.label}</div>
                  <div style={{ fontSize: 11, color: hexToRgba(t.cream, 0.45) }}>{stage.temp}</div>
                </div>
                <div className="mono" style={{ fontSize: 13, color: hexToRgba(t.cream, 0.7) }}>
                  {formatDuration(stage.duration)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && selectedType && (
          <div className="fade-item" style={{
            padding: 20, borderRadius: 20,
            background: `linear-gradient(160deg, ${hexToRgba(t.butter, 0.12)}, ${hexToRgba(t.accent, 0.04)})`,
            border: `0.5px solid ${hexToRgba(t.butter, 0.2)}`,
            textAlign: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            <BubbleField activity="high" color={FERMENT_TYPES[selectedType].color} count={16} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>
                {FERMENT_TYPES[selectedType].emoji}
              </div>
              <div className="serif" style={{
                fontSize: 20, fontWeight: 600, color: t.cream,
                marginBottom: 4,
              }}>{name || `我的${FERMENT_TYPES[selectedType].name}`}</div>
              <div style={{ fontSize: 13, color: hexToRgba(t.cream, 0.55), marginBottom: 16 }}>
                {recipe || '基础配方'}
              </div>
              <div style={{
                display: 'flex', justifyContent: 'center', gap: 20,
                paddingTop: 14,
                borderTop: `0.5px solid ${hexToRgba(t.butter, 0.2)}`,
              }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: t.butter }}>
                    {FERMENT_TYPES[selectedType].stages.length}
                  </div>
                  <div style={{ fontSize: 11, color: hexToRgba(t.cream, 0.5) }}>阶段</div>
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: t.butter }}>
                    {formatDuration(FERMENT_TYPES[selectedType].stages.reduce((s, st) => s + st.duration, 0))}
                  </div>
                  <div style={{ fontSize: 11, color: hexToRgba(t.cream, 0.5) }}>总时长</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div style={{
          display: 'flex', gap: 12, marginTop: 28,
          paddingBottom: 20,
        }}>
          {step > 0 && (
            <RippleButton
              variant="secondary"
              onClick={() => setStep(step - 1)}
              color={t.butter}
              style={{
                flex: 1, padding: '14px 20px', borderRadius: 14,
                fontSize: 15, fontWeight: 600,
              }}
            >上一步</RippleButton>
          )}
          {step < 3 ? (
            <RippleButton
              onClick={() => setStep(step + 1)}
              color={t.butter}
              style={{
                flex: step > 0 ? 1 : '100%', padding: '14px 20px', borderRadius: 14,
                fontSize: 15, fontWeight: 700,
              }}
            >{step === 2 ? '预览确认' : '下一步'}</RippleButton>
          ) : (
            <RippleButton
              onClick={onSubmit}
              color={t.butter}
              style={{
                flex: 1, padding: '14px 20px', borderRadius: 14,
                fontSize: 15, fontWeight: 700,
              }}
            >启动发酵</RippleButton>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 4. NotesPage — 风味笔记
// ============================================================
function NotesPage({ notes, batches, onNoteClick, dark, t }) {
  const scrollRef = React.useRef(null);
  const [filter, setFilter] = React.useState('all');

  React.useEffect(() => {
    const cleanup = observeFadeItems(scrollRef.current);
    return cleanup;
  }, [filter]);

  const filtered = filter === 'all' ? notes : notes.filter(n => n.type === filter);

  const typeIcons = {
    taste: { icon: '👅', label: '品鉴', color: '#D97A2C' },
    photo: { icon: '📷', label: '照片', color: '#E8B84C' },
    temp: { icon: '🌡️', label: '温度', color: '#C48A3D' },
    gravity: { icon: '📊', label: '比重', color: '#A67C52' },
  };

  return (
    <div ref={scrollRef} className="phone-scroll page-enter" style={{
      height: '100%', overflowY: 'auto',
      paddingTop: 'var(--ios-safe-top)',
      paddingBottom: 100,
    }}>
      <div style={{ padding: '8px 20px 4px' }}>
        <div style={{ fontSize: 12, color: hexToRgba(t.cream, 0.5), letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 4 }}>
          风味笔记
        </div>
        <div className="serif" style={{ fontSize: 28, fontWeight: 600, color: t.cream, letterSpacing: '-0.02em' }}>
          味觉<span style={{ color: t.butter }}>档案</span>
        </div>
        <div style={{ fontSize: 13, color: hexToRgba(t.cream, 0.5), marginTop: 4 }}>
          记录每一次发酵的风味记忆
        </div>
      </div>

      {/* Filter chips */}
      <div className="fade-item" style={{
        display: 'flex', gap: 8, padding: '16px 16px 12px',
        overflowX: 'auto', scrollbarWidth: 'none',
      }}>
        {[
          { key: 'all', label: '全部' },
          ...Object.entries(typeIcons).map(([k, v]) => ({ key: k, label: v.label })),
        ].map((f, i) => (
          <button key={f.key} className="interactive"
            onClick={() => setFilter(f.key)}
            style={{
              flexShrink: 0, padding: '7px 14px', borderRadius: 100,
              border: `0.5px solid ${filter === f.key ? hexToRgba(t.butter, 0.5) : hexToRgba(t.cream, 0.12)}`,
              background: filter === f.key ? hexToRgba(t.butter, 0.12) : 'transparent',
              color: filter === f.key ? t.butter : hexToRgba(t.cream, 0.7),
              fontSize: 13, fontWeight: filter === f.key ? 600 : 400,
              cursor: 'pointer',
            }}>{f.label}</button>
        ))}
      </div>

      {/* Notes list */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map((note, idx) => {
          const batch = batches.find(b => b.id === note.batchId);
          const meta = typeIcons[note.type] || typeIcons.taste;
          return (
            <div key={note.id} className="ferment-card interactive fade-item"
              onClick={() => onNoteClick && onNoteClick(note.id)}
              style={{
                position: 'relative',
                padding: 16, borderRadius: 18,
                background: hexToRgba(t.cream, 0.05),
                border: `0.5px solid ${hexToRgba(t.cream, 0.08)}`,
                cursor: 'pointer',
                overflow: 'hidden',
                transition: 'transform 200ms cubic-bezier(.2,.8,.2,1)',
              }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', position: 'relative' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: `linear-gradient(135deg, ${hexToRgba(meta.color, 0.3)}, ${hexToRgba(meta.color, 0.1)})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, flexShrink: 0,
                }}>{meta.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: t.cream }}>{note.title}</div>
                    <div style={{
                      display: 'flex', gap: 2, alignItems: 'center',
                    }}>
                      {[...Array(5)].map((_, s) => (
                        <span key={s} style={{
                          fontSize: 12, color: s < note.rating ? t.butter : hexToRgba(t.cream, 0.2),
                        }}>★</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: hexToRgba(t.cream, 0.5), marginBottom: 8 }}>
                    {batch?.name} · {note.date}
                  </div>
                  <div style={{ fontSize: 13, color: hexToRgba(t.cream, 0.75), lineHeight: 1.5, marginBottom: 10 }}>
                    {note.content.length > 60 ? note.content.slice(0, 60) + '…' : note.content}
                  </div>
                  <div>
                    {note.tags.map(tag => <TagChip key={tag} label={tag} color={meta.color} dark={dark} />)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// 5. ExplorePage — 探索（配方灵感）
// ============================================================
function ExplorePage({ recipes, onRecipeClick, dark, t }) {
  const scrollRef = React.useRef(null);
  const [activeCat, setActiveCat] = React.useState('all');

  React.useEffect(() => {
    const cleanup = observeFadeItems(scrollRef.current);
    return cleanup;
  }, [activeCat]);

  const filtered = activeCat === 'all' ? recipes : recipes.filter(r => r.type === activeCat);

  return (
    <div ref={scrollRef} className="phone-scroll page-enter" style={{
      height: '100%', overflowY: 'auto',
      paddingTop: 'var(--ios-safe-top)',
      paddingBottom: 100,
    }}>
      <div style={{ padding: '8px 20px 4px' }}>
        <div style={{ fontSize: 12, color: hexToRgba(t.cream, 0.5), letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 4 }}>
          探索
        </div>
        <div className="serif" style={{ fontSize: 28, fontWeight: 600, color: t.cream, letterSpacing: '-0.02em' }}>
          配方<span style={{ color: t.butter }}>灵感</span>
        </div>
      </div>

      {/* Search bar */}
      <div className="fade-item" style={{ padding: '14px 16px 4px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', borderRadius: 14,
          background: hexToRgba(t.cream, 0.06),
          border: `0.5px solid ${hexToRgba(t.cream, 0.08)}`,
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.5 }}>
            <circle cx="7" cy="7" r="5" stroke={t.cream} strokeWidth="1.5"/>
            <path d="M11 11l3 3" stroke={t.cream} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            type="text" placeholder="搜索配方、作者、标签…"
            style={{
              flex: 1, background: 'transparent', border: 'none',
              color: t.cream, fontSize: 14, outline: 'none',
              fontFamily: 'inherit',
            }}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="fade-item" style={{
        display: 'flex', gap: 8, padding: '14px 16px 12px',
        overflowX: 'auto', scrollbarWidth: 'none',
      }}>
        {[
          { key: 'all', label: '全部' },
          ...Object.values(FERMENT_TYPES).map(type => ({ key: type.id, label: type.name })),
        ].map(cat => (
          <button key={cat.key} className="interactive"
            onClick={() => setActiveCat(cat.key)}
            style={{
              flexShrink: 0, padding: '7px 14px', borderRadius: 100,
              border: `0.5px solid ${activeCat === cat.key ? hexToRgba(t.butter, 0.5) : hexToRgba(t.cream, 0.12)}`,
              background: activeCat === cat.key ? hexToRgba(t.butter, 0.12) : 'transparent',
              color: activeCat === cat.key ? t.butter : hexToRgba(t.cream, 0.7),
              fontSize: 13, fontWeight: activeCat === cat.key ? 600 : 400,
              cursor: 'pointer',
            }}>{cat.label}</button>
        ))}
      </div>

      {/* Recipe grid */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {filtered.map((recipe, idx) => (
            <div key={recipe.id}
              className="ferment-card interactive fade-item"
              onClick={() => onRecipeClick && onRecipeClick(recipe.id)}
              style={{
                position: 'relative',
                borderRadius: 16, overflow: 'hidden',
                background: hexToRgba(t.cream, 0.05),
                border: `0.5px solid ${hexToRgba(t.cream, 0.08)}`,
                cursor: 'pointer',
                transition: 'transform 200ms cubic-bezier(.2,.8,.2,1)',
              }}>
              <BubbleField activity="low" color={recipe.color} count={6} />
              {/* Cover */}
              <div style={{
                position: 'relative', height: 100,
                background: `linear-gradient(135deg, ${hexToRgba(recipe.color, 0.25)}, ${hexToRgba(recipe.color, 0.05)})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 40,
              }}>
                {FERMENT_TYPES[recipe.type].emoji}
              </div>
              {/* Info */}
              <div style={{ position: 'relative', padding: 12 }}>
                <div style={{
                  fontSize: 13, fontWeight: 600, color: t.cream,
                  marginBottom: 4, lineHeight: 1.3,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{recipe.title}</div>
                <div style={{ fontSize: 11, color: hexToRgba(t.cream, 0.45), marginBottom: 8 }}>
                  {recipe.author}
                </div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span style={{
                    fontSize: 10, padding: '2px 6px', borderRadius: 20,
                    background: hexToRgba(recipe.color, 0.15), color: recipe.color,
                  }}>{recipe.difficulty}</span>
                  <span style={{ fontSize: 11, color: hexToRgba(t.cream, 0.5) }}>
                    ♥ {recipe.likes > 1000 ? (recipe.likes / 1000).toFixed(1) + 'k' : recipe.likes}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 6. MePage — 我的（统计与收藏）
// ============================================================
function MePage({ stats, onGoToDesign, onGoToApi, dark, t }) {
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    const cleanup = observeFadeItems(scrollRef.current);
    return cleanup;
  }, []);

  return (
    <div ref={scrollRef} className="phone-scroll page-enter" style={{
      height: '100%', overflowY: 'auto',
      paddingTop: 'var(--ios-safe-top)',
      paddingBottom: 100,
    }}>
      {/* Profile header */}
      <div style={{ padding: '12px 20px 20px', position: 'relative', overflow: 'hidden' }}>
        <BubbleField activity="low" color={t.butter} count={12} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: `linear-gradient(135deg, ${t.butter}, ${t.accent})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, fontWeight: 700, color: t.cocoa,
          }}>曦</div>
          <div style={{ flex: 1 }}>
            <div className="serif" style={{ fontSize: 20, fontWeight: 600, color: t.cream }}>
              朱曦策
            </div>
            <div style={{ fontSize: 12, color: hexToRgba(t.cream, 0.5), marginTop: 2 }}>
              发酵爱好者 · Lv.5 面包师
            </div>
          </div>
          <button className="interactive" style={{
            width: 36, height: 36, borderRadius: '50%',
            background: hexToRgba(t.cream, 0.08),
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: t.cream,
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.5 3.5l1.4 1.4M13.1 13.1l1.4 1.4M3.5 14.5l1.4-1.4M13.1 4.9l1.4-1.4"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="fade-item" style={{
        margin: '0 16px 16px', padding: 20,
        borderRadius: 20,
        background: `linear-gradient(160deg, ${hexToRgba(t.butter, 0.12)} 0%, ${hexToRgba(t.accent, 0.04)} 100%)`,
        border: `0.5px solid ${hexToRgba(t.butter, 0.2)}`,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          <StatRow label="总批次" value={stats.totalBatches} unit="次" color={t.butter} />
          <StatRow label="发酵天数" value={stats.totalFermentDays} unit="天" color={t.butter} />
          <StatRow label="连续打卡" value={stats.longestStreak} unit="天" color={t.butter} />
        </div>
      </div>

      {/* Favorite types bar chart */}
      <div className="fade-item" style={{
        margin: '0 16px 16px', padding: 18,
        borderRadius: 18,
        background: hexToRgba(t.cream, 0.04),
        border: `0.5px solid ${hexToRgba(t.cream, 0.08)}`,
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: t.cream, marginBottom: 14 }}>
          发酵类型分布
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {stats.favoriteTypes.map(ft => {
            const type = FERMENT_TYPES[ft.type];
            return (
              <div key={ft.type}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: t.cream, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>{type.emoji}</span> {type.name}
                  </span>
                  <span style={{ fontSize: 11, color: hexToRgba(t.cream, 0.5) }}>{ft.count} 次 · {ft.pct}%</span>
                </div>
                <div style={{
                  height: 6, borderRadius: 3,
                  background: hexToRgba(t.cream, 0.08), overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${ft.pct}%`, height: '100%',
                    background: `linear-gradient(90deg, ${type.color}, ${hexToRgba(type.color, 0.6)})`,
                    borderRadius: 3,
                    boxShadow: `0 0 6px ${hexToRgba(type.color, 0.4)}`,
                    transition: 'width 800ms cubic-bezier(.2,.8,.2,1)',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Menu */}
      <div className="fade-item" style={{
        margin: '0 16px 16px',
        borderRadius: 18,
        background: hexToRgba(t.cream, 0.04),
        border: `0.5px solid ${hexToRgba(t.cream, 0.08)}`,
        overflow: 'hidden',
      }}>
        {[
          { icon: '⭐', label: '我的收藏', detail: stats.collection + ' 个配方' },
          { icon: '📝', label: '风味笔记', detail: FLAVOR_NOTES.length + ' 篇' },
          { icon: '🔔', label: '提醒设置', detail: '已开启' },
        ].map((item, i) => (
          <button key={item.label} className="interactive"
            style={{
              width: '100%', padding: '14px 16px',
              background: 'transparent', border: 'none',
              display: 'flex', alignItems: 'center', gap: 12,
              cursor: 'pointer',
              borderBottom: i < 2 ? `0.5px solid ${hexToRgba(t.cream, 0.06)}` : 'none',
              textAlign: 'left',
            }}>
            <div style={{ fontSize: 18 }}>{item.icon}</div>
            <div style={{ flex: 1, fontSize: 14, color: t.cream, fontWeight: 500 }}>{item.label}</div>
            <span style={{ fontSize: 12, color: hexToRgba(t.cream, 0.45) }}>{item.detail}</span>
            <svg width="14" height="14" viewBox="0 0 14 14" style={{ opacity: 0.3 }}>
              <path d="M4 2l6 5-6 5" stroke={t.cream} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </button>
        ))}
      </div>

      {/* Dev links */}
      <div className="fade-item" style={{
        margin: '0 16px 16px',
        borderRadius: 18,
        background: hexToRgba(t.cream, 0.04),
        border: `0.5px solid ${hexToRgba(t.cream, 0.08)}`,
        overflow: 'hidden',
      }}>
        <div style={{ padding: '14px 16px 6px', fontSize: 11, color: hexToRgba(t.cream, 0.35), letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          开发者
        </div>
        {[
          { icon: '🎨', label: '设计规范', onClick: onGoToDesign },
          { icon: '📡', label: '接口文档', onClick: onGoToApi },
        ].map((item, i) => (
          <button key={item.label} className="interactive"
            onClick={item.onClick}
            style={{
              width: '100%', padding: '14px 16px',
              background: 'transparent', border: 'none',
              display: 'flex', alignItems: 'center', gap: 12,
              cursor: 'pointer',
              borderBottom: i < 1 ? `0.5px solid ${hexToRgba(t.cream, 0.06)}` : 'none',
              textAlign: 'left',
            }}>
            <div style={{ fontSize: 18 }}>{item.icon}</div>
            <div style={{ flex: 1, fontSize: 14, color: t.cream, fontWeight: 500 }}>{item.label}</div>
            <svg width="14" height="14" viewBox="0 0 14 14" style={{ opacity: 0.3 }}>
              <path d="M4 2l6 5-6 5" stroke={t.cream} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// 7. DesignSystemPage — 设计规范页
// ============================================================
function DesignSystemPage({ onBack, dark, t }) {
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    const cleanup = observeFadeItems(scrollRef.current);
    return cleanup;
  }, []);

  const colors = [
    { name: '奶白', hex: t.cream, role: '主背景 / 正文' },
    { name: '深可可黑', hex: t.cocoa, role: '深色背景 / 强调' },
    { name: '黄油暖黄', hex: t.butter, role: '主强调色 / CTA' },
    { name: '焦糖棕', hex: t.accent, role: '辅助色 / 渐变' },
    { name: '面粉白', hex: '#EDE4D3', role: '分隔 / 次级' },
  ];

  const typeScale = [
    { name: '大标题', size: '28px', weight: '700', sample: '酸种实验室' },
    { name: '标题 1', size: '20px', weight: '600', sample: '今日发酵' },
    { name: '标题 2', size: '16px', weight: '600', sample: '批次详情' },
    { name: '正文', size: '14px', weight: '400', sample: '基础发酵阶段进行中' },
    { name: '辅助', size: '12px', weight: '400', sample: '2 小时前开始' },
    { name: '标签', size: '11px', weight: '500', sample: 'HIGH ACTIVITY' },
  ];

  return (
    <div ref={scrollRef} className="phone-scroll page-enter" style={{
      height: '100%', overflowY: 'auto',
      paddingBottom: 50,
    }}>
      <div style={{ paddingTop: 'var(--ios-safe-top)' }}>
        <NavHeader title="设计规范" subtitle="Design System" onBack={onBack} dark={dark} />
      </div>

      <div style={{ padding: '0 20px' }}>
        <div className="serif fade-item" style={{ fontSize: 22, fontWeight: 600, color: t.cream, letterSpacing: '-0.02em', marginBottom: 4 }}>
          发酵实验室
        </div>
        <div className="fade-item" style={{ fontSize: 12, color: hexToRgba(t.cream, 0.5), marginBottom: 24 }}>
          Fermentary Design System · v1.0
        </div>

        {/* Colors */}
        <section className="fade-item" style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: t.butter, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>
            01 · 色彩系统
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {colors.map(c => (
              <div key={c.hex} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: 10, borderRadius: 12,
                background: hexToRgba(t.cream, 0.04),
                border: `0.5px solid ${hexToRgba(t.cream, 0.08)}`,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: c.hex,
                  border: c.hex === t.cream ? `0.5px solid ${hexToRgba(t.cocoa, 0.2)}` : 'none',
                  boxShadow: `0 2px 8px ${hexToRgba(c.hex, 0.2)}`,
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.cream }}>{c.name}</div>
                  <div className="mono" style={{ fontSize: 10, color: hexToRgba(t.cream, 0.45) }}>{c.hex}</div>
                </div>
                <div style={{ fontSize: 10, color: hexToRgba(t.cream, 0.4), textAlign: 'right' }}>{c.role}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section className="fade-item" style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: t.butter, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>
            02 · 字体排印
          </div>
          <div style={{
            padding: 14, borderRadius: 14,
            background: hexToRgba(t.cream, 0.04),
            border: `0.5px solid ${hexToRgba(t.cream, 0.08)}`,
          }}>
            <div style={{ fontSize: 11, color: hexToRgba(t.cream, 0.4), marginBottom: 10 }}>
              展示字体 · Fraunces（衬线）
            </div>
            <div className="serif" style={{ fontSize: 32, fontWeight: 700, color: t.cream, letterSpacing: '-0.02em', marginBottom: 4 }}>
              The Quick Brown Fox
            </div>
            <div className="serif" style={{ fontSize: 18, color: hexToRgba(t.cream, 0.6), fontStyle: 'italic' }}>
              发酵是时间的艺术
            </div>
            <div style={{
              height: 1, margin: '14px 0',
              background: hexToRgba(t.cream, 0.08),
            }} />
            <div style={{ fontSize: 11, color: hexToRgba(t.cream, 0.4), marginBottom: 10 }}>
              正文字体 · Inter（无衬线）
            </div>
            <div style={{ fontSize: 15, color: t.cream, lineHeight: 1.6, marginBottom: 4 }}>
              记录每一次发酵的温度、时间与风味。
            </div>
            <div style={{ fontSize: 13, color: hexToRgba(t.cream, 0.55) }}>
              Fermentary helps you track every batch of sourdough, kombucha, miso and homebrew.
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            {typeScale.map(ts => (
              <div key={ts.name} style={{
                display: 'flex', alignItems: 'baseline',
                padding: '10px 0',
                borderBottom: `0.5px solid ${hexToRgba(t.cream, 0.06)}`,
              }}>
                <div className="serif" style={{
                  flex: 1,
                  fontSize: parseInt(ts.size),
                  fontWeight: parseInt(ts.weight),
                  color: t.cream,
                  letterSpacing: '-0.01em',
                }}>{ts.sample}</div>
                <div className="mono" style={{ fontSize: 10, color: hexToRgba(t.cream, 0.4), width: 70, textAlign: 'right' }}>
                  {ts.name} {ts.size}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Components */}
        <section className="fade-item" style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: t.butter, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>
            03 · 组件
          </div>
          <div style={{
            padding: 16, borderRadius: 14,
            background: hexToRgba(t.cream, 0.04),
            border: `0.5px solid ${hexToRgba(t.cream, 0.08)}`,
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <RippleButton color={t.butter} style={{ padding: '12px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600 }}>
              主要按钮
            </RippleButton>
            <RippleButton variant="secondary" color={t.butter} style={{ padding: '12px 20px', borderRadius: 12, fontSize: 14, fontWeight: 500 }}>
              次要按钮
            </RippleButton>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <TagChip label="高活性" color={t.butter} dark={dark} />
              <TagChip label="进行中" color="#8BC34A" dark={dark} />
              <TagChip label="等待中" color={t.accent} dark={dark} />
            </div>
            <div style={{ position: 'relative' }}>
              <BubbleField activity="medium" color={t.butter} count={12} />
              <div style={{ height: 60, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: hexToRgba(t.cream, 0.5) }}>
                气泡背景组件
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
              <DoughBreathe scale={t.doughScale} color={t.butter} size={60} speed={t.speed} />
            </div>
          </div>
        </section>

        {/* Motion principles */}
        <section className="fade-item" style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: t.butter, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>
            04 · 动效原则
          </div>
          <div style={{
            padding: 16, borderRadius: 14,
            background: hexToRgba(t.cream, 0.04),
            border: `0.5px solid ${hexToRgba(t.cream, 0.08)}`,
            fontSize: 12, color: hexToRgba(t.cream, 0.7), lineHeight: 1.7,
          }}>
            <p style={{ marginBottom: 10 }}><strong style={{ color: t.cream }}>物理真实：</strong>气泡上升速度与发酵活跃度成正比，面团呼吸模拟酵母产气的膨胀收缩。</p>
            <p style={{ marginBottom: 10 }}><strong style={{ color: t.cream }}>语义驱动：</strong>每个动效都承担信息功能——倒计时环 = 剩余时间，温度曲线 = 发酵状态。</p>
            <p><strong style={{ color: t.cream }}>弹簧曲线：</strong>统一使用 cubic-bezier(.2,.8,.2,1)，模拟酵母弹性与阻尼。</p>
          </div>
        </section>
      </div>
    </div>
  );
}

// ============================================================
// 8. ApiDocPage — 接口文档页
// ============================================================
function ApiDocPage({ onBack, dark, t }) {
  const scrollRef = React.useRef(null);
  const [activeIdx, setActiveIdx] = React.useState(0);

  React.useEffect(() => {
    const cleanup = observeFadeItems(scrollRef.current);
    return cleanup;
  }, [activeIdx]);

  const active = API_ENDPOINTS[activeIdx];

  const methodColors = {
    GET: '#6ECF78',
    POST: '#E8B84C',
    PUT: '#6BA8E8',
    DELETE: '#E86B6B',
  };

  return (
    <div ref={scrollRef} className="phone-scroll page-enter" style={{
      height: '100%', overflowY: 'auto',
      paddingBottom: 50,
      background: dark ? '#14100C' : t.cream,
    }}>
      <div style={{ paddingTop: 'var(--ios-safe-top)' }}>
        <NavHeader title="接口文档" subtitle="API Reference" onBack={onBack} dark={dark} />
      </div>

      {/* Endpoint list */}
      <div style={{ padding: '8px 16px 12px' }}>
        <div className="fade-item" style={{
          padding: 12, borderRadius: 14,
          background: hexToRgba(t.cream, 0.04),
          border: `0.5px solid ${hexToRgba(t.cream, 0.08)}`,
          marginBottom: 16,
        }}>
          <div className="mono" style={{ fontSize: 11, color: hexToRgba(t.cream, 0.4), marginBottom: 8 }}>Base URL</div>
          <div className="mono shimmer" style={{ fontSize: 13, color: t.butter, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            https://api.fermentary.app/v1
          </div>
        </div>

        <div style={{ fontSize: 11, color: t.butter, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 }} className="fade-item">
          接口列表
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
          {API_ENDPOINTS.map((ep, i) => (
            <button key={ep.path} className="interactive fade-item"
              onClick={() => setActiveIdx(i)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 14px', borderRadius: 10,
                background: activeIdx === i ? hexToRgba(t.butter, 0.12) : 'transparent',
                border: `0.5px solid ${activeIdx === i ? hexToRgba(t.butter, 0.3) : hexToRgba(t.cream, 0.06)}`,
                cursor: 'pointer', textAlign: 'left',
                transition: 'all 200ms',
              }}>
              <span className="mono" style={{
                fontSize: 10, fontWeight: 700,
                padding: '3px 6px', borderRadius: 4,
                background: hexToRgba(methodColors[ep.method], 0.15),
                color: methodColors[ep.method],
                flexShrink: 0, minWidth: 42, textAlign: 'center',
              }}>{ep.method}</span>
              <span className="mono" style={{
                flex: 1, fontSize: 11, color: t.cream,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{ep.path}</span>
            </button>
          ))}
        </div>

        {/* Active endpoint detail */}
        <div className="fade-item">
          <div style={{ fontSize: 11, color: t.butter, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 }}>
            接口详情
          </div>
          <div style={{
            padding: 14, borderRadius: 14,
            background: hexToRgba(t.cream, 0.04),
            border: `0.5px solid ${hexToRgba(t.cream, 0.08)}`,
            marginBottom: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span className="mono" style={{
                fontSize: 11, fontWeight: 700,
                padding: '4px 8px', borderRadius: 4,
                background: hexToRgba(methodColors[active.method], 0.15),
                color: methodColors[active.method],
              }}>{active.method}</span>
              <span className="mono" style={{ fontSize: 12, color: t.cream }}>{active.path}</span>
            </div>
            <div style={{ fontSize: 12, color: hexToRgba(t.cream, 0.6), lineHeight: 1.5 }}>
              {active.desc}
            </div>
          </div>

          {/* Parameters */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: t.cream, marginBottom: 8 }}>请求参数</div>
            {active.params.length > 0 ? (
              <div style={{
                borderRadius: 10, overflow: 'hidden',
                border: `0.5px solid ${hexToRgba(t.cream, 0.08)}`,
              }}>
                {active.params.map((p, i) => (
                  <div key={p.name} style={{
                    padding: '10px 12px',
                    background: hexToRgba(t.cream, 0.03),
                    borderBottom: i < active.params.length - 1 ? `0.5px solid ${hexToRgba(t.cream, 0.06)}` : 'none',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <span className="mono" style={{ fontSize: 12, color: t.butter, fontWeight: 500 }}>{p.name}</span>
                      <span className="mono" style={{ fontSize: 10, color: hexToRgba(t.cream, 0.4) }}>{p.type}</span>
                      {p.required && <span style={{ fontSize: 10, color: '#E86B6B' }}>必填</span>}
                    </div>
                    <div style={{ fontSize: 11, color: hexToRgba(t.cream, 0.55), lineHeight: 1.4 }}>
                      {p.desc}
                      {p.default && <span className="mono" style={{ color: hexToRgba(t.cream, 0.35) }}> · 默认: {p.default}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 12, color: hexToRgba(t.cream, 0.4), padding: '10px 0' }}>无参数</div>
            )}
          </div>

          {/* Response */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: t.cream, marginBottom: 8 }}>响应示例</div>
            <pre style={{
              margin: 0, padding: 12, borderRadius: 10,
              background: '#0D0906',
              border: '0.5px solid rgba(217,164,65,0.15)',
              fontSize: 11, color: '#E8D5B0',
              fontFamily: "'JetBrains Mono', monospace",
              lineHeight: 1.6,
              overflowX: 'auto',
            }}>{active.response}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  HomePage,
  DetailPage,
  NewBatchPage,
  NotesPage,
  ExplorePage,
  MePage,
  DesignSystemPage,
  ApiDocPage,
});
