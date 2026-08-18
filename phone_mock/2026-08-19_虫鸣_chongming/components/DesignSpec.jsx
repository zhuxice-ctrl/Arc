// 设计规范页

function DesignSpec({ onBack }) {
  return (
    <div className="screen screen-push">
      <NavBar title="设计规范" showBack onBack={onBack} />
      <div className="content-wrap no-tab">
        <div className="doc-screen">
          <h1 className="doc-h1">虫鸣 · 设计规范</h1>
          <p className="doc-subtitle">
            形态：原生 App。为夜听虫鸣而生的暗色界面，
            萤火虫是唯一的亮色，识别成功的瞬间有「原来是你」的惊喜。
          </p>

          <h2 className="doc-h2">设计理念</h2>
          <p className="doc-p">
            像一位懂虫的朋友陪你走夜路：暗色护眼的夜幕界面，
            萤火虫是唯一的亮色。产品机制 = 夜晚场景驱动的
            「识别 → 图鉴 → 记录」完整闭环。
          </p>

          <h2 className="doc-h2">色彩系统</h2>
          <p className="doc-p">
            夜幕墨蓝黑（扁平，禁蓝紫渐变）+ 萤火黄绿 + 竹青 + 月白。
          </p>

          <div className="color-swatches">
            <div className="color-swatch" style={{ background: '#0a0e1a' }}>
              <span className="color-swatch-name">夜幕 900</span>
              <span className="color-swatch-hex">#0a0e1a</span>
            </div>
            <div className="color-swatch" style={{ background: '#0f1524' }}>
              <span className="color-swatch-name">夜幕 800</span>
              <span className="color-swatch-hex">#0f1524</span>
            </div>
            <div className="color-swatch" style={{ background: '#151c2e' }}>
              <span className="color-swatch-name">夜幕 700</span>
              <span className="color-swatch-hex">#151c2e</span>
            </div>
            <div className="color-swatch" style={{ background: '#c4e84a', color: '#0a0e1a' }}>
              <span className="color-swatch-name">萤火 500</span>
              <span className="color-swatch-hex">#c4e84a</span>
            </div>
            <div className="color-swatch" style={{ background: '#5aa886' }}>
              <span className="color-swatch-name">竹青 400</span>
              <span className="color-swatch-hex">#5aa886</span>
            </div>
            <div className="color-swatch" style={{ background: '#e8eef7', color: '#0a0e1a' }}>
              <span className="color-swatch-name">月白 100</span>
              <span className="color-swatch-hex">#e8eef7</span>
            </div>
          </div>

          <h3>语义使用</h3>
          <table className="doc-table">
            <thead>
              <tr>
                <th>颜色</th>
                <th>用途</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>夜幕 900</td>
                <td>页面底色、最深层背景</td>
              </tr>
              <tr>
                <td>夜幕 800</td>
                <td>屏幕主背景</td>
              </tr>
              <tr>
                <td>夜幕 700</td>
                <td>卡片、列表项背景</td>
              </tr>
              <tr>
                <td>萤火 500</td>
                <td>主按钮、强调、录音键、Tab 激活态</td>
              </tr>
              <tr>
                <td>竹青 400</td>
                <td>辅助强调、标签、次级信息</td>
              </tr>
              <tr>
                <td>月白 100</td>
                <td>主要正文、标题文字</td>
              </tr>
            </tbody>
          </table>

          <h2 className="doc-h2">字体排印</h2>
          <p className="doc-p">
            衬线体做标题与昆虫名，传达自然博物的文雅感；
            无衬线体做正文与功能文字，保证可读性。
          </p>

          <h3>字族</h3>
          <table className="doc-table">
            <thead>
              <tr>
                <th>角色</th>
                <th>字体</th>
                <th>使用场景</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>展示 / 标题</td>
                <td style={{ fontFamily: 'var(--serif)' }}>Noto Serif SC</td>
                <td>虫名、大标题、页面标题</td>
              </tr>
              <tr>
                <td>正文 / 功能</td>
                <td>Inter</td>
                <td>正文、按钮、标签、数据</td>
              </tr>
            </tbody>
          </table>

          <h3>字号层级</h3>
          <table className="doc-table">
            <thead>
              <tr>
                <th>用途</th>
                <th>字号</th>
                <th>字重</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>大标题</td>
                <td>28px</td>
                <td>500 (Serif)</td>
              </tr>
              <tr>
                <td>虫名（结果）</td>
                <td>26px</td>
                <td>500 (Serif)</td>
              </tr>
              <tr>
                <td>页面标题</td>
                <td>17px</td>
                <td>600 (Sans)</td>
              </tr>
              <tr>
                <td>列表名称</td>
                <td>17px</td>
                <td>Regular (Serif)</td>
              </tr>
              <tr>
                <td>正文</td>
                <td>14px</td>
                <td>Regular</td>
              </tr>
              <tr>
                <td>辅助 / 注释</td>
                <td>12px</td>
                <td>Regular</td>
              </tr>
              <tr>
                <td>Tab 标签</td>
                <td>10px</td>
                <td>Regular</td>
              </tr>
            </tbody>
          </table>

          <h2 className="doc-h2">动效语言</h2>
          <p className="doc-p">
            原生 App 功能动效：弹簧弹层、页面层级推入、
            Tab 切换连续关系、长按进度蓄力、声波涟漪、萤火漂浮微光。
          </p>

          <h3>签名动效</h3>
          <p className="doc-p">
            识别成功瞬间：声波涟漪收拢成一只萤火虫，
            点亮结果卡片上的虫名。「原来是你」的惊喜感由这一刻承载。
          </p>

          <h3>关键动效清单</h3>
          <table className="doc-table">
            <thead>
              <tr>
                <th>动效</th>
                <th>时长</th>
                <th>缓动</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>页面推入</td>
                <td>380ms</td>
                <td>cubic-bezier(0.32, 0.72, 0, 1)</td>
              </tr>
              <tr>
                <td>底部弹层</td>
                <td>400ms</td>
                <td>spring / 0.32 0.72 0 1</td>
              </tr>
              <tr>
                <td>按钮反馈</td>
                <td>150ms</td>
                <td>ease</td>
              </tr>
              <tr>
                <td>录音脉冲</td>
                <td>1.2s 循环</td>
                <td>ease-in-out</td>
              </tr>
              <tr>
                <td>声波涟漪</td>
                <td>1.5s 循环</td>
                <td>ease-out</td>
              </tr>
            </tbody>
          </table>

          <h2 className="doc-h2">组件规范</h2>

          <h3>按钮</h3>
          <div style={{ display: 'flex', gap: '12px', margin: '12px 0' }}>
            <button className="btn btn-primary" style={{ flex: 'none' }}>主按钮</button>
            <button className="btn btn-secondary" style={{ flex: 'none' }}>次按钮</button>
          </div>
          <p className="doc-p">
            高度 48px，圆角 14px。主按钮使用萤火色，
            带发光阴影；次按钮使用夜幕色加描边。
          </p>

          <h3>卡片</h3>
          <p className="doc-p">
            圆角 14-16px，背景夜幕 700，边框 0.5px 夜幕 500。
            用于列表项、统计面板、信息分组等。
          </p>

          <h3>底部弹层</h3>
          <p className="doc-p">
            顶部圆角 20px，带 4×36px 灰色指示条。
            最大高度 75% 屏幕，超出可滚动。
            背景半透明 + 毛玻璃。
          </p>

          <h2 className="doc-h2">端侧语言</h2>
          <p className="doc-p">
            作为原生 App 形态，遵循以下端侧设计语言：
          </p>
          <ul style={{ fontSize: '13px', color: 'var(--moon-200)', lineHeight: '1.7', paddingLeft: '20px' }}>
            <li>状态栏 + 安全区（刘海/底部指示条）</li>
            <li>底部 TabBar，固定切换四个主入口</li>
            <li>页面栈 push/pop，右滑返回语义</li>
            <li>底部弹层（Bottom Sheet）承载次级操作</li>
            <li>长按手势触发核心动作（录音）</li>
            <li>毛玻璃 + 深色模式的系统感</li>
          </ul>

          <h2 className="doc-h2">无障碍</h2>
          <ul style={{ fontSize: '13px', color: 'var(--moon-200)', lineHeight: '1.7', paddingLeft: '20px' }}>
            <li>支持 prefers-reduced-motion，减弱动效</li>
            <li>正文文字对比度 ≥ 4.5:1</li>
            <li>可点击目标 ≥ 44×44px</li>
            <li>色彩不承载唯一信息（辅以图标/文字）</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

window.DesignSpec = DesignSpec;
