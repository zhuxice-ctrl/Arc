/* =========================================================
   Pigments — 矿物颜料色谱
   悬停发光（径向渐变脉动呼吸）
   ========================================================= */

const PIGMENTS = [
  { name: '朱砂', code: 'Cinnabar', color: '#A8452C', glow: 'rgba(168, 69, 44, 0.8)' },
  { name: '石绿', code: 'Malachite', color: '#3E6B50', glow: 'rgba(62, 107, 80, 0.8)' },
  { name: '石青', code: 'Azurite', color: '#2E5A7C', glow: 'rgba(46, 90, 124, 0.8)' },
  { name: '赭黄', code: 'Ochre', color: '#C8963E', glow: 'rgba(200, 150, 62, 0.8)' },
  { name: '金粉', code: 'Gold Dust', color: '#D4A84B', glow: 'rgba(212, 168, 75, 0.9)' },
  { name: '炭黑', code: 'Carbon Black', color: '#1C1710', glow: 'rgba(28, 23, 16, 0.6)' },
  { name: '垩白', code: 'Chalk White', color: '#F5EDD8', glow: 'rgba(245, 237, 216, 0.7)' },
];

const PIGMENT_IMG = '/spark/app/app_17c7ssvjn08/runtime/api/v1/storage/object/bucket_aadkqgfafgseo_static/static%2Faadkqf5xt6gdu_ve_miaoda';

function Pigments() {
  return (
    <section className="section pigments" id="pigments" data-screen-label="pigments">
      <div className="container">
        <div className="section-head reveal">
          <div className="section-eyebrow">
            <span className="num">03</span>
            <span>·</span>
            <span>矿物颜料</span>
          </div>
          <h2 className="section-title">七色矿物<br />千年不褪的光彩</h2>
          <p className="section-desc">
            敦煌壁画的色彩取自天然矿石。朱砂、石绿、石青、金粉……
            历经千年风沙与岁月，这些矿物颜料依然在昏暗的洞窟中散发着温润的光泽。
          </p>
        </div>

        <div className="pigment-grid">
          {PIGMENTS.map((p, i) => (
            <div
              key={p.code}
              className={`pigment-swatch reveal delay-${Math.min(i, 4)}`}
              data-interactive="true"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div
                className="swatch-color"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${lighten(p.color, 15)} 0%, ${p.color} 55%, ${darken(p.color, 20)} 100%)`,
                }}
              ></div>
              <div className="swatch-glow" style={{ background: p.glow }}></div>
              <div className="swatch-label">
                <div className="swatch-name">{p.name}</div>
                <div className="swatch-code">{p.code}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 颜料静物图点缀 */}
        <div className="pigment-hero reveal delay-3" style={{
          marginTop: '80px',
          borderRadius: '4px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 30px 80px -20px rgba(0, 0, 0, 0.5)',
        }}>
          <img src={PIGMENT_IMG} alt="敦煌矿物颜料陈列" style={{
            width: '100%',
            filter: 'sepia(0.1) contrast(1.05)',
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, transparent 60%, rgba(28,23,16,0.5) 100%)',
            pointerEvents: 'none',
          }}></div>
          <div style={{
            position: 'absolute',
            left: '32px', bottom: '28px',
            color: 'var(--sand-light)',
            zIndex: 2,
          }}>
            <div className="mono" style={{ fontSize: '11px', letterSpacing: '0.25em', color: 'var(--gold)', marginBottom: '8px' }}>
              PIGMENT COLLECTION
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 600 }}>
              七种矿物颜料 · 取之山川，绘之千年
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 简单颜色调整函数
function lighten(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
  const B = Math.min(255, (num & 0x0000FF) + amt);
  return '#' + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
}
function darken(hex, percent) {
  return lighten(hex, -percent);
}

window.Pigments = Pigments;
