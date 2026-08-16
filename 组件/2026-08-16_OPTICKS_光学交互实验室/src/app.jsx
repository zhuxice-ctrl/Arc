/* ============================================================
   OPTICKS · Optical Interaction Lab — Main App
   5 exhibits + navigation + right panel controls
   ============================================================ */

(function () {
  const { useState, useRef, useEffect, useCallback } = React;

  const EXHIBITS = [
    {
      id: 'prism',
      num: '01',
      title: '棱镜色散',
      subtitle: 'Prism Dispersion',
      desc: '白光穿过三棱镜，按波长分解为七彩光谱',
      Exhibit: 'PrismExhibit',
      Controls: 'PrismControls',
      defaultParams: { angle: 30 },
    },
    {
      id: 'lens',
      num: '02',
      title: '凸透镜成像',
      subtitle: 'Convex Lens Imaging',
      desc: '物距与焦距决定像的大小、正倒与虚实',
      Exhibit: 'LensExhibit',
      Controls: 'LensControls',
      defaultParams: { objDist: 180, focal: 80, objHeight: 60 },
    },
    {
      id: 'slits',
      num: '03',
      title: '双缝干涉',
      subtitle: 'Double-Slit Interference',
      desc: '两束相干光叠加，明暗条纹等间距分布',
      Exhibit: 'SlitsExhibit',
      Controls: 'SlitsControls',
      defaultParams: { slitDist: 50, screenDist: 280, wavelength: 550, scale: 1 },
    },
    {
      id: 'shadow',
      num: '04',
      title: '阴影投影',
      subtitle: 'Shadow Projection',
      desc: '点光源锐利，面光源柔和——本影与半影',
      Exhibit: 'ShadowExhibit',
      Controls: 'ShadowControls',
      defaultParams: { lightX: 0, lightY: 30, lightSize: 8, objSize: 60 },
    },
    {
      id: 'mirrors',
      num: '05',
      title: '反射镜阵',
      subtitle: 'Mirror Array',
      desc: '多镜接力反射，入射角等于反射角',
      Exhibit: 'MirrorsExhibit',
      Controls: 'MirrorsControls',
      defaultParams: { sourceAngle: 0, m1Angle: -20, m2Angle: 25, m3Angle: -15, m4Angle: 30 },
    },
  ];

  function App() {
    const [activeIdx, setActiveIdx] = useState(0);
    const [rerenderKey, setRerenderKey] = useState(0);
    // Initialize params refs at first render (top-level, not in effect)
    const paramsRefs = useRef(null);
    if (paramsRefs.current === null) {
      paramsRefs.current = {};
      EXHIBITS.forEach((ex) => {
        paramsRefs.current[ex.id] = { ...ex.defaultParams };
      });
    }

    const active = EXHIBITS[activeIdx];
    const paramsRef = paramsRefs.current[active.id];

    const handleParamChange = useCallback((key, value) => {
      if (!paramsRef) return;
      paramsRef[key] = value;
      // Trigger minimal re-render for readouts (not the canvas)
      setRerenderKey((k) => k + 1);
    }, [paramsRef]);

    // Keyboard navigation
    useEffect(() => {
      const onKey = (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          setActiveIdx((i) => Math.min(EXHIBITS.length - 1, i + 1));
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          setActiveIdx((i) => Math.max(0, i - 1));
        } else if (e.key >= '1' && e.key <= '5') {
          setActiveIdx(parseInt(e.key) - 1);
        }
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, []);

    const ExhibitComp = window[active.Exhibit];
    const ControlsComp = window[active.Controls];

    return React.createElement(
      'div',
      { className: 'app' },
      React.createElement(window.CustomCursor),

      // Top bar
      React.createElement(
        'div',
        { className: 'top-bar' },
        React.createElement(
          'div',
          { className: 'brand' },
          React.createElement(
            'div',
            { className: 'brand-mark' },
            React.createElement(
              'svg',
              { viewBox: '0 0 28 28', fill: 'none' },
              // Prism + spectrum mark
              React.createElement('polygon', {
                points: '14,3 25,22 3,22',
                fill: 'none',
                stroke: '#FFB347',
                strokeWidth: '1.5',
                strokeLinejoin: 'round',
              }),
              React.createElement('line', { x1: '3', y1: '10', x2: '10', y2: '17', stroke: '#FFFFFF', strokeWidth: '1' }),
              // Spectrum lines exiting
              React.createElement('line', { x1: '18', y1: '20', x2: '23', y2: '25', stroke: '#FF4D2E', strokeWidth: '1' }),
              React.createElement('line', { x1: '19', y1: '20', x2: '24.5', y2: '25', stroke: '#FFD93D', strokeWidth: '1' }),
              React.createElement('line', { x1: '20', y1: '20', x2: '26', y2: '25', stroke: '#3DDC84', strokeWidth: '1' }),
            )
          ),
          React.createElement('span', { className: 'brand-name' }, 'OPTICKS'),
          React.createElement('span', { className: 'brand-sub' }, '/光学交互实验室')
        ),
        React.createElement(
          'div',
          { className: 'top-meta' },
          React.createElement(
            'div',
            { className: 'meta-item' },
            React.createElement('span', { className: 'meta-dot' }),
            'LIVE SIMULATION'
          ),
          React.createElement(
            'div',
            { className: 'meta-item' },
            active.num + ' / 05'
          )
        )
      ),

      // Left nav
      React.createElement(
        'div',
        { className: 'exhibit-nav' },
        EXHIBITS.map((ex, idx) =>
          React.createElement(
            'div',
            {
              key: ex.id,
              className: 'nav-item' + (idx === activeIdx ? ' active' : ''),
              onClick: () => setActiveIdx(idx),
              'data-interactive': true,
            },
            React.createElement('span', { className: 'nav-num' }, ex.num),
            React.createElement('span', { className: 'nav-label' }, ex.title)
          )
        )
      ),

      // Stage
      React.createElement(
        'div',
        { className: 'stage' },
        React.createElement(ExhibitComp, {
          key: active.id,
          paramsRef: paramsRef,
        })
      ),

      // Right panel
      React.createElement(
        'div',
        { className: 'right-panel', key: 'panel-' + active.id },
        React.createElement(
          'div',
          { className: 'panel-section panel-enter' },
          React.createElement('div', { className: 'panel-label' }, '展区 / Exhibit'),
          React.createElement('div', { className: 'exhibit-title' }, active.title),
          React.createElement('div', { className: 'exhibit-subtitle' }, active.subtitle),
          React.createElement(
            'div',
            {
              style: {
                marginTop: '12px',
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                lineHeight: '1.7',
                color: 'var(--text-secondary)',
              }
            },
            active.desc
          )
        ),
        React.createElement(
          'div',
          { key: 'ctrl-' + rerenderKey, className: 'panel-enter' },
          React.createElement(ControlsComp, {
            params: paramsRef || active.defaultParams,
            onChange: handleParamChange,
          })
        )
      ),

      // Bottom bar
      React.createElement(
        'div',
        { className: 'bottom-bar' },
        React.createElement(
          'div',
          { className: 'bottom-left' },
          React.createElement(
            'div',
            { className: 'progress-indicator' },
            React.createElement('span', { className: 'progress-label' }, '展区'),
            React.createElement(
              'div',
              { className: 'progress-dots' },
              EXHIBITS.map((ex, idx) =>
                React.createElement('div', {
                  key: ex.id,
                  className: 'progress-dot' + (idx === activeIdx ? ' active' : ''),
                })
              )
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'bottom-right' },
          React.createElement(
            'span',
            { className: 'hint-text' },
            React.createElement('kbd', null, '←'),
            React.createElement('kbd', null, '→'),
            ' 切换展区  ·  ',
            React.createElement('kbd', null, '1'),
            '–',
            React.createElement('kbd', null, '5'),
            ' 快速跳转'
          )
        )
      )
    );
  }

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(React.createElement(App));
})();
