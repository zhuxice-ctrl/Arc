// Design Specification Page
const DesignSpecPage = ({ onBack }) => {
  const colors = [
    { name: '草药绿（主色）', hex: '#3A6B35', bg: '#3A6B35' },
    { name: '暖木棕（辅助）', hex: '#8B6914', bg: '#8B6914' },
    { name: '赤陶红（强调）', hex: '#C65D3C', bg: '#C65D3C' },
    { name: '米纸色（表面）', hex: '#F5F0E1', bg: '#F5F0E1' },
    { name: '暖灰白（背景）', hex: '#FAF8F3', bg: '#FAF8F3', border: '1px solid var(--divider)' },
    { name: '墨黑（文字）', hex: '#2A2418', bg: '#2A2418' },
    { name: '灰棕（次文）', hex: '#7A6E5A', bg: '#7A6E5A' },
  ];

  const typography = [
    { sample: '大标题 34px Bold', label: 'Display', size: 34, weight: 700, font: 'serif' },
    { sample: '标题 20px Bold', label: 'H1', size: 20, weight: 700, font: 'serif' },
    { sample: '副标题 17px Semibold', label: 'H2', size: 17, weight: 600, font: 'serif' },
    { sample: '正文 14px Regular', label: 'Body', size: 14, weight: 400, font: 'sans' },
    { sample: '小字 12px Regular', label: 'Caption', size: 12, weight: 400, font: 'sans' },
  ];

  const spacings = [
    { label: 'xs  4px', value: 24 },
    { label: 'sm  8px', value: 48 },
    { label: 'md  12px', value: 72 },
    { label: 'lg  16px', value: 96 },
    { label: 'xl  24px', value: 120 },
    { label: '2xl  32px', value: 144 },
  ];

  const motions = [
    { name: '页面转场', desc: '350ms cubic-bezier(0.32, 0.72, 0, 1)' },
    { name: '列表项渐入', desc: '交错延迟 80ms / 项' },
    { name: '按钮按下', desc: '150ms ease, scale 0.94-0.97' },
    { name: '回弹动效', desc: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    { name: '视差滚动', desc: '随滚动线性插值' },
  ];

  return (
    <div className="screen" id="screen-spec">
      <div className="secondary-nav">
        <div className="back-btn" onClick={onBack}>
          <Icon.ChevronLeft size={20} color="var(--ink-black)" />
        </div>
        <div className="nav-title">设计规范</div>
        <div className="nav-spacer" />
      </div>

      <div className="spec-container">
        {/* Color System */}
        <div className="spec-section">
          <h2>配色系统</h2>
          <div className="color-grid">
            {colors.map((c, i) => (
              <div key={i} className="color-swatch">
                <div className="swatch" style={{ background: c.bg, border: c.border }} />
                <div className="info">
                  <div className="name">{c.name}</div>
                  <div className="hex">{c.hex}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div className="spec-section">
          <h2>字体系统</h2>
          <div className="typography-demo">
            {typography.map((t, i) => (
              <div key={i} className="type-line">
                <span
                  className="sample"
                  style={{
                    fontSize: t.size,
                    fontWeight: t.weight,
                    fontFamily: t.font === 'serif' ? 'var(--font-serif)' : 'var(--font-sans)'
                  }}
                >
                  {t.sample}
                </span>
                <span className="label">{t.label}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: 'var(--gray-brown)', marginTop: 8, lineHeight: 1.6 }}>
            展示字体：Noto Serif SC（思源宋体）<br />
            正文字体：Noto Sans SC（思源黑体）<br />
            设计理念：宋体承载中医文化厚重感，黑体保障正文可读性
          </p>
        </div>

        {/* Radius */}
        <div className="spec-section">
          <h2>圆角规范</h2>
          <div className="radius-demo">
            <div className="radius-item">
              <div className="radius-box" style={{ borderRadius: 8 }} />
              <span className="radius-label">sm 8px</span>
            </div>
            <div className="radius-item">
              <div className="radius-box" style={{ borderRadius: 12 }} />
              <span className="radius-label">md 12px</span>
            </div>
            <div className="radius-item">
              <div className="radius-box" style={{ borderRadius: 16 }} />
              <span className="radius-label">lg 16px</span>
            </div>
            <div className="radius-item">
              <div className="radius-box" style={{ borderRadius: 24 }} />
              <span className="radius-label">xl 24px</span>
            </div>
          </div>
        </div>

        {/* Spacing */}
        <div className="spec-section">
          <h2>间距规范</h2>
          <div className="spacing-demo">
            {spacings.map((s, i) => (
              <div key={i} className="spacing-row">
                <span className="spacing-label">{s.label}</span>
                <div className="spacing-bar" style={{ width: s.value }} />
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: 'var(--gray-brown)', marginTop: 8 }}>
            基于 4px 基线网格，确保视觉节奏统一
          </p>
        </div>

        {/* Motion */}
        <div className="spec-section">
          <h2>动效说明</h2>
          <div className="motion-demo">
            {motions.map((m, i) => (
              <div key={i} className="motion-item">
                <div className="motion-dot" />
                <div>
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--gray-brown)', marginTop: 2 }}>{m.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '8px 0', fontSize: 11, color: 'var(--gray-brown)' }}>
          百草集 Design System v2.0
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { DesignSpecPage });
