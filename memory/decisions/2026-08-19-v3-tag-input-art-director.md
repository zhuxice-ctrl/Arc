# V3 Art Director · 2026-08-19 · Tag Input

## 5 候选方向（正交）

### A. Modal 确认对话框（覆盖层类）
- motif: 纸质档案盖章确认
- visual_source: 档案馆确认单 + 盖章
- spatial_model: 舞台式（居中浮层）
- primary_interaction: 打开→焦点陷阱→确认/取消/危险确认→异步 loading→结果
- signature: focus trap + 确认按钮 loading→success 状态流转
- novelty 7 / fit 9 / risk LOW

### B. 标签输入器 Tag Input + 异步自动补全（输入类）★选中
- motif: 编辑校样纸上的活字标签
- visual_source: 报刊校样 / 活字排版——骨纸 + 墨 + 单一森绿重音
- spatial_model: 编辑式（单列表单式，克制）
- primary_interaction: 键入→过滤建议→Enter/点击入槽→标签弹性落定→Backspace 删尾→重复/超限被拒抖动
- signature: 标签入槽弹簧咬合 + 重复/超限拒绝抖动
- novelty 8 / fit 10 / risk LOW

### C. 日期范围选择器（输入类）
- motif: 老式月历台历翻页
- visual_source: 桌面翻页台历
- spatial_model: 网格式（日历格子）
- primary_interaction: 翻月→点选起止→区间高亮→键盘方向键导航
- signature: 翻月过渡 + 区间拖选
- novelty 7 / fit 9 / risk MEDIUM（日历网格 + 范围逻辑 + 键盘导航复杂）

### D. 颜色选择器（输入类）
- motif: 染坊色卡取色
- visual_source: 染色色卡册
- spatial_model: 仪器式（HSV 平面 + 滑条）
- primary_interaction: 拖选色相/饱和度→hex/rgb 输入→历史色
- signature: 取色十字 + 实时 hex
- novelty 7 / fit 8 / risk MEDIUM（HSV 数学 + 多输入同步）

### E. 手风琴 FAQ（导航类）
- motif: 折叠册页
- visual_source: 折页小册子
- spatial_model: 时间轴式（纵向折叠段）
- primary_interaction: 点击展开/收起→单展开或全展开→键盘方向键
- signature: chevron 旋转 + 高度过渡
- novelty 6 / fit 8 / risk LOW（状态机偏简单）

## 排序与选择

ranking: [B, A, C, D, E]

selection_reason:
- B 新颖性最高：标签输入器在近期 UI 组件中尚未出现（近期为 OTP/命令面板/拖拽排序/Toast/拖拽上传/右键菜单/步进器/长按确认），自动补全 + 重复/超限处理带来的状态机天然丰富（rest/typing/suggestion-hover/focus/selected/duplicate-error/max-disabled/loading），键盘交互密集（Enter 加、Backspace 删、方向键导航建议、Esc 关闭、逗号分隔），是表单类项目高频真实需求。
- B 适配度最高：状态机 ≥6 个，覆盖 disabled/loading/error/empty/focus 全部门槛状态，复用成本极低（单输入框 + 建议下拉），抽到别的项目改 CSS 变量即可。
- B 执行风险 LOW：纯 vanilla 可控，无复杂物理/数学。
- A 同样高 fit 但状态机偏基础（open/loading/error），签名点 focus trap 工程价值高但视觉记忆点弱于 B 的入槽咬合。
- C/D 执行风险 MEDIUM，单版交付时间预算下质量难保证；E 状态机偏简单，State Completeness 门槛风险。

## Pattern Pressure 检查

- interaction_mechanism: tag_input_autocomplete_chip_settle——历史 0 次，LOW，无碰撞。
- visual_material: 纸墨编辑式——近期 UI 组件多用 warm terracotta/amber/orange + teal；本版用 骨纸 #F4EFE6 + 墨 #1A1816 + 森绿 #1B4332 + 琥珀焦点 #B8860B + 砖红错误 #B23A2E，与近期暖色调明显区隔，无 SATURATED 模式。

## decision_log
- why_selected: 未做过 + 状态机天然丰富 + 键盘交互密集 + 复用成本极低 + 执行风险低
- why_not_others: A 状态机偏基础；C/D 执行风险中；E 状态机偏简单
- accepted_patterns: []

# Design Contract

## Core Idea
标签输入器：一个表单里高频复用的「输入即建标签」组件。键入文本时下拉异步补全建议，Enter 或点击把文本变成一枚入槽的标签 chip；Backspace 在空输入时删除最后一枚；重复标签与超过上限时被拒绝并抖动。视觉语言是编辑校样纸上的活字标签——骨纸底、墨色字、单一森绿重音，克制专业，像设计系统里的真实一员而非艺术装置。

## Experience Goal
开发者把它复制到自己项目里，改几个 CSS 变量就能用；用户键入时有明确的过滤反馈、入槽咬合感、错误拒绝的分量感；键盘用户全程可用。

## Must Keep
1. 完整状态机：rest/empty、typing+建议过滤、suggestion-hover、focus 环、selected chip、duplicate-error 抖动、max-disabled、loading（异步建议）、removable-on-hover——至少 7 个。
2. 键盘：Enter 加标签、Backspace 空输入删尾、↑↓ 导航建议、Enter 选中建议、Esc 关闭建议、逗号分隔批量。
3. CSS 变量主题化：--tag-bg/--tag-fg/--tag-accent/--tag-error/--tag-radius/--tag-duration 等暴露，抽走改不超过 3 处。
4. 纯 vanilla 单文件，CSS/JS 可独立抽取，组件代码有清晰边界注释。
5. prefers-reduced-motion 降级；RAF/定时器随可见性暂停且卸载取消。

## Must Not Regress To
1. 拟物化活字物理装置（不要做铅字坠落/碰撞物理）——视觉是校样纸隐喻，交互是干净 UI 状态机。
2. 装饰特效堆叠（不要 Ken Burns / 无关粒子 / 整图缩放）。
3. 展示页喧宾夺主——组件是主角，展示页克制。

## Primary Interaction
键入 → 建议下拉过滤 → Enter/点击入槽（弹簧落定 cubic-bezier(0.34,1.56,0.64,1) 220ms）→ Backspace 删尾 → 重复/超限拒绝（线性抖动 300ms）。

## Motion Language
弹簧曲线用于入槽弹性反馈；线性仅用于建议 fade/抖动拒绝；时长：切换 200ms、入槽强调 220ms、拒绝 300ms。删动画后功能仍完整。

## Signature Moment
标签入槽瞬间的弹簧咬合（轻微 overshoot 后回正）+ 重复/超限时整枚标签的横向抖动拒绝。

## Success Condition
- 7 个状态全部可演示且键盘可达
- duplicate/max 触发抖动且不实际添加
- 焦点环可见，Tab 顺序合理
- 删 CSS 变量后组件仍可用（仅换色）
- 浏览器渲染无白屏无 Console Error，截图非空白

## Technical Boundary
纯 vanilla 单文件 HTML+CSS+JS，无 React/Babel/CDN，无外部字体/图片，相对路径，展示页可有品牌感但组件适应系统光标。
