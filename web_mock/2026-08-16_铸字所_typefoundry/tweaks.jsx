/* 铸字所 — 风格调整面板 */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentColor": "#C03A2B",
  "leadColor": "#2B2F33",
  "paperColor": "#F5F0E6",
  "inkColor": "#1A1C1E",
  "density": "regular",
  "particles": true,
  "cursorEnabled": true,
  "fontSerif": "Noto Serif SC"
}/*EDITMODE-END*/;

const { useState, useEffect } = React;

function TweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // 应用色彩变量
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--vermilion', t.accentColor);
    root.style.setProperty('--lead', t.leadColor);
    root.style.setProperty('--paper', t.paperColor);
    root.style.setProperty('--ink', t.inkColor);
  }, [t.accentColor, t.leadColor, t.paperColor, t.inkColor]);

  // 粒子开关
  useEffect(() => {
    const particles = document.getElementById('particles');
    if (particles) {
      particles.style.display = t.particles ? 'block' : 'none';
    }
  }, [t.particles]);

  // 光标开关
  useEffect(() => {
    const outer = document.getElementById('cursorOuter');
    const inner = document.getElementById('cursorInner');
    if (outer && inner) {
      const display = t.cursorEnabled ? 'block' : 'none';
      outer.style.display = display;
      inner.style.display = display;
      if (!t.cursorEnabled) {
        document.body.style.cursor = 'auto';
      } else if (window.innerWidth > 768) {
        document.body.style.cursor = 'none';
      }
    }
  }, [t.cursorEnabled]);

  // 密度
  useEffect(() => {
    const sections = document.querySelectorAll('.section, .workshop, .font-collection, .contact, .quote-section');
    sections.forEach(s => {
      if (t.density === 'compact') {
        s.style.paddingTop = s.classList.contains('hero') ? '' : '80px';
        s.style.paddingBottom = s.classList.contains('hero') ? '' : '80px';
      } else if (t.density === 'comfy') {
        s.style.paddingTop = s.classList.contains('hero') ? '' : '200px';
        s.style.paddingBottom = s.classList.contains('hero') ? '' : '200px';
      } else {
        s.style.paddingTop = '';
        s.style.paddingBottom = '';
      }
    });
  }, [t.density]);

  // 字体
  useEffect(() => {
    document.body.style.fontFamily = `'${t.fontSerif}', 'Songti SC', serif`;
  }, [t.fontSerif]);

  return React.createElement(TweaksPanel, null,
    React.createElement(TweakSection, { label: "配色" }),
    React.createElement(TweakColor, {
      label: "朱砂红 (强调)",
      value: t.accentColor,
      options: ["#C03A2B", "#8B4513", "#2F6B57", "#5B3E8C", "#C89B3C"],
      onChange: v => setTweak('accentColor', v)
    }),
    React.createElement(TweakColor, {
      label: "铅灰 (主色)",
      value: t.leadColor,
      options: ["#2B2F33", "#3D3227", "#1F3A3A", "#2E2A3D", "#3A2E1F"],
      onChange: v => setTweak('leadColor', v)
    }),
    React.createElement(TweakColor, {
      label: "纸色 (背景)",
      value: t.paperColor,
      options: ["#F5F0E6", "#F0E8D8", "#EDE6DA", "#F2EDE3", "#E8E0CF"],
      onChange: v => setTweak('paperColor', v)
    }),
    React.createElement(TweakColor, {
      label: "油墨 (深底)",
      value: t.inkColor,
      options: ["#1A1C1E", "#1D1A14", "#141D1D", "#18141D", "#1C1A14"],
      onChange: v => setTweak('inkColor', v)
    }),
    React.createElement(TweakSection, { label: "排版" }),
    React.createElement(TweakRadio, {
      label: "密度",
      value: t.density,
      options: ["compact", "regular", "comfy"],
      onChange: v => setTweak('density', v)
    }),
    React.createElement(TweakSelect, {
      label: "衬线字体",
      value: t.fontSerif,
      options: ["Noto Serif SC", "Noto Sans SC", "Unna", "Songti SC"],
      onChange: v => setTweak('fontSerif', v)
    }),
    React.createElement(TweakSection, { label: "动效" }),
    React.createElement(TweakToggle, {
      label: "浮动粒子",
      value: t.particles,
      onChange: v => setTweak('particles', v)
    }),
    React.createElement(TweakToggle, {
      label: "自定义光标",
      value: t.cursorEnabled,
      onChange: v => setTweak('cursorEnabled', v)
    })
  );
}

const tweaksRoot = document.createElement('div');
tweaksRoot.id = 'tweaks-root';
document.body.appendChild(tweaksRoot);

if (window.ReactDOM && window.React) {
  ReactDOM.createRoot(tweaksRoot).render(React.createElement(TweaksApp));
}
