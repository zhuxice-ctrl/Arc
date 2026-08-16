// 修复时间轴页 — 所有器物的修复日志时间轴
function TimelinePage() {
  const [filter, setFilter] = useState('all'); // all / join / fill / urushi / gold / polish / done

  // 合并所有日志并按日期排序
  const allLogs = useMemo(() => {
    const list = [];
    KIN_DATA.relics.forEach(relic => {
      const logs = KIN_DATA.logs[relic.id] || [];
      logs.forEach(log => {
        list.push({ ...log, relicId: relic.id, relicName: relic.name });
      });
    });
    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, []);

  const filteredLogs = filter === 'all'
    ? allLogs
    : allLogs.filter(l => l.type === filter);

  const filterOptions = [
    { key: 'all', label: 'すべて' },
    { key: 'join', label: '接着' },
    { key: 'fill', label: '下地' },
    { key: 'urushi', label: '漆塗' },
    { key: 'gold', label: '金粉' },
    { key: 'polish', label: '研ぎ' },
    { key: 'done', label: '完成' },
  ];

  const typeLabels = {
    join: '接着',
    fill: '下地',
    urushi: '漆塗',
    line: '描線',
    gold: '金粉',
    polish: '研ぎ',
    done: '完成',
  };
  const typeColors = {
    join: '#6e6658',
    fill: '#8a6808',
    urushi: '#b2422a',
    line: '#c89512',
    gold: '#D4A017',
    polish: '#b58e76',
    done: '#D4A017',
  };
  const typeIcons = {
    join: 'M5 12h14M12 5l7 7-7 7',
    fill: 'M12 2v20M2 12h20',
    urushi: 'M12 2C8 8 4 12 4 16a8 8 0 0016 0c0-4-4-8-8-14z',
    line: 'M4 20L20 4',
    gold: 'M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z',
    polish: 'M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07',
    done: 'M20 6L9 17l-5-5',
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      <KinTopBar
        title="修復の軌跡"
        subtitle="しゅうふくの きせき"
      />

      {/* 筛选 chips */}
      <div style={{
        padding: '4px 20px 16px',
        display: 'flex', gap: 6,
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        {filterOptions.map(opt => (
          <button
            key={opt.key}
            onClick={() => setFilter(opt.key)}
            data-cursor="hover"
            className="kin-chip"
            style={{
              flexShrink: 0,
              padding: '6px 14px',
              fontSize: 11, letterSpacing: '0.15em',
              borderRadius: 999,
              background: filter === opt.key ? 'var(--kin-gold)' : 'rgba(212,160,23,0.08)',
              color: filter === opt.key ? 'var(--kin-urushi)' : 'var(--kin-gold)',
              border: `1px solid ${filter === opt.key ? 'var(--kin-gold)' : 'rgba(212,160,23,0.25)'}`,
              fontWeight: filter === opt.key ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 250ms ease',
              fontFamily: "'Noto Sans JP', sans-serif",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* 时间轴 */}
      <div style={{ padding: '8px 20px 20px', position: 'relative' }}>
        {/* 竖线 */}
        <div style={{
          position: 'absolute', left: 34, top: 8, bottom: 8,
          width: 1.5,
          background: 'linear-gradient(180deg, rgba(212,160,23,0.5), rgba(212,160,23,0.05))',
        }} />

        {filteredLogs.map((log, i) => {
          const color = typeColors[log.type] || '#D4A017';
          const iconPath = typeIcons[log.type] || '';
          return (
            <div key={i} style={{
              position: 'relative',
              paddingBottom: 18,
              paddingLeft: 56,
              animation: `kinFadeInUp 450ms cubic-bezier(.2,.8,.2,1) ${i * 50}ms both`,
            }}
              className="kin-row"
              data-cursor="hover"
            >
              {/* 节点 */}
              <div style={{
                position: 'absolute', left: 22, top: 2,
                width: 26, height: 26, borderRadius: '50%',
                background: 'var(--kin-urushi)',
                border: `1.5px solid ${color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 0 10px ${color}55`,
                transition: 'transform 250ms ease, box-shadow 250ms ease',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.2)';
                  e.currentTarget.style.boxShadow = `0 0 16px ${color}aa`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = `0 0 10px ${color}55`;
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={iconPath} />
                </svg>
              </div>

              {/* 内容卡片 */}
              <div style={{
                background: 'linear-gradient(180deg, rgba(24,23,26,0.8) 0%, rgba(14,14,16,0.9) 100%)',
                border: '1px solid rgba(212,160,23,0.12)',
                borderRadius: 12,
                padding: '12px 14px',
                cursor: 'pointer',
                transition: 'border-color 250ms ease, transform 250ms ease',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(212,160,23,0.35)';
                  e.currentTarget.style.transform = 'translateX(2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(212,160,23,0.12)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                }}>
                  <div style={{
                    fontSize: 10, color: 'var(--kin-sabi)',
                    letterSpacing: '0.15em',
                  }}>{log.date}</div>
                  <span style={{
                    fontSize: 10, color, letterSpacing: '0.15em',
                    padding: '2px 8px',
                    border: `1px solid ${color}44`,
                    borderRadius: 999,
                    background: `${color}11`,
                  }}>{typeLabels[log.type] || log.type}</span>
                </div>
                <div style={{
                  fontSize: 14, fontWeight: 500,
                  color: 'var(--kin-gofun)',
                  marginBottom: 4,
                }}>{log.title}</div>
                <div style={{
                  fontSize: 12, color: 'var(--kin-gofun-2)',
                  lineHeight: 1.6, marginBottom: 8,
                }}>{log.detail}</div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 11, color: 'var(--kin-gold)',
                  letterSpacing: '0.08em',
                }}>
                  <RelicThumb relic={KIN_DATA.relics.find(r => r.id === log.relicId)} size={18} />
                  {log.relicName}
                </div>
              </div>
            </div>
          );
        })}

        {filteredLogs.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            color: 'var(--kin-sabi)', fontSize: 12,
            letterSpacing: '0.15em',
          }}>
            この種類の記録は、まだありません。
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { TimelinePage });
