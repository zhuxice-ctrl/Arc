# V3 Art Director · 2026-08-19 · Tree 树形导航/选择组件

## 已覆盖组件盘点（新方向 V3）
- 输入类：OTP验证码、步进器、标签输入器、日期范围选择器（4）
- 导航类：命令面板（1）
- 反馈类：消息通知 Toast（1）
- 覆盖层类：右键菜单、Modal 确认对话框（2）
- 数据展示类：拖拽排序列表（1）
- 操作类：拖拽上传、长按确认按钮（2）

→ 导航类仅 1 个，且缺最高频刚需的「树形组件」。

## 5 候选方向（正交）

### A. Tree 树形组件（导航类）★选中
- motif: 文件管理器目录树 / 权限分配树 / 组织架构树
- visual_source: 现代代码编辑器文件树 + 账册目录索引——冷石板专业基调
- spatial_model: 编辑式（左侧树 + 右侧详情/选中态说明，展示页克制）
- primary_interaction: 点击展开收起 → checkbox 级联选择（含半选 indeterminate）→ 异步加载子节点 → 完整键盘导航
- signature: checkbox 级联半选方框填充动画 + 展开子项 stagger 入场 + 键盘焦点项滑动跟随
- novelty 8 / fit 10 / risk LOW-MEDIUM（级联逻辑+异步，纯 vanilla 可控）

### B. Segmented Control 分段选择器（输入类）
- motif: 滑动拇指分段
- novelty 7 / fit 8 / risk LOW — 未选：输入类已饱和（4个）

### C. Accordion 手风琴（导航类）
- motif: 折叠册页
- novelty 6 / fit 7 / risk LOW — 未选：状态机偏简单（展开/收起/焦点），State Completeness 门槛风险

### D. Progress 进度系统（反馈类）
- motif: 条形/环形/步骤三种形态
- novelty 7 / fit 8 / risk LOW — 未选：交互性弱（主要展示，用户不可操作），Interaction Feel 门槛 12/15 有风险

### E. Swipe-to-delete 滑动删除（操作类）
- motif: 触摸/鼠标拖拽阈值 + 撤销
- novelty 8 / fit 8 / risk MEDIUM — 未选：桌面端价值低，撤销逻辑与 Toast 重叠；操作类已有 2 个

## 排序与选择

ranking: [A, E, D, B, C]

selection_reason:
- A 真实需求最高：树形是文件管理器/组织架构/权限分配/分类导航/多级筛选等高频场景的核心控件，开发者搬到任何中后台/工具型项目都会用。
- A 状态机天然最丰富：collapsed/expanded/hover/focus/selected/loading(异步子节点)/indeterminate(半选)/checked-unchecked/disabled/empty——≥9 态，覆盖全部门槛状态。
- A 键盘交互最密集：↑↓移动焦点、←→展开收起、Enter/Space 选中、Home/End 首尾、* 展开同级——是可访问性的硬核考验，工程价值高。
- A 级联 checkbox 半选逻辑 + 异步加载是开发者高频出错点，做对即高复用价值。
- A 执行风险 LOW-MEDIUM：级联半选与异步逻辑复杂但纯 vanilla 可控，无物理/数学风险。

## Pattern Pressure 检查

- interaction_mechanism: tree_expand_collapse_cascade_checkbox_async_load——历史 0 次，LOW，无碰撞。
- 类别压力：导航类仅 command-palette 1 个，LOW。
- visual_material: 冷石板专业基调——近期 UI 组件多用 warm terracotta/amber/coral/cinnabar/moss 暖色；本版用 冷石板灰白 + 单一靛蓝重音（solid，非渐变），与近期暖色调明显区隔，无 SATURATED 模式。靛蓝为纯色 accent 不触犯「禁蓝紫渐变」。

## decision_log
- why_selected: 导航类未饱和 + 树形最高频刚需 + 状态机≥9态 + 键盘交互最密集 + 级联/异步是开发者高频痛点 + 执行风险可控
- why_not_others: B 输入类饱和；C 状态机偏简单；D 交互性弱；E 桌面端价值低且与 Toast 重叠
- accepted_patterns: []

# Design Contract

## Core Idea
生产级树形组件：一个可展开收起的层级导航与多选控件。节点支持 checkbox 级联选择（父选全选子、子选更新父为全选/半选/未选）、异步加载子节点（展开触发 loading→延迟填充）、完整键盘导航。视觉是冷石板专业基调（像代码编辑器文件树/权限树），三套 CSS 变量主题（黎明/暮色/纸本）证明可换肤。像真实项目里的一员，不是艺术装置。

## Experience Goal
开发者 copy 到自己项目，改几个 CSS 变量 + 喂一份数据/一个 loader 就能用；用户键盘全程可达，展开/收起/选择手感利落；半选方框有明确语义反馈；异步加载有持续 loading 感。

## Must Keep
1. 完整状态机（≥9态）：collapsed-rest、expanded、hover、focus(焦点环+键盘当前位置)、selected(单选高亮)、loading(异步子节点 spinner)、indeterminate(半选)、checked/unchecked、disabled、empty(展开无子)。缺 disabled/loading/focus 直接 MAJOR。
2. 键盘：Tab 进入；↑↓ 移动焦点并滚动入视；→ 展开(已展开则进首子项)；← 收起(已收起则跳父项)；Enter/Space 选中或切换 checkbox；Home/End 首尾。
3. Checkbox 级联：选父全选子并级联向上更新；选子向上更新父为 checked/indeterminate/unchecked；disabled 项不参与级联。
4. 异步加载：节点 hasChildren 且未加载时，展开触发 loading→模拟延迟(800-1200ms)→填充子节点；可配置 loader。
5. CSS 变量主题化：--tree-bg/--tree-fg/--tree-accent/--tree-accent-bg/--tree-accent-fg/--tree-border/--tree-hover/--tree-selected/--tree-radius/--tree-indent/--tree-row-height/--tree-duration 等暴露；提供 黎明(light)/暮色(dark)/纸本(warm-neutral) 三套预设，一键切换证明换肤。
6. 纯 vanilla 单文件，CSS/JS 可独立抽取，组件代码有清晰边界注释；RAF/定时器随可见性暂停且卸载取消；prefers-reduced-motion 降级。

## Must Not Regress To
1. 拟物化物理装置（不要做书页翻开/抽屉滑出/活字物理）——视觉是冷石板专业 UI，交互是干净状态机。
2. 装饰特效堆叠（不要 Ken Burns/无关粒子/整图缩放/蓝紫渐变）。
3. 展示页喧宾夺主——组件是主角，右侧只放克制说明，不做花哨布局。

## Primary Interaction
点击展开/收起（高度过渡+子项 stagger）→ 点击 checkbox 级联选择（半选方框填充动画）→ 异步节点展开触发 loading→填充 → 键盘全程导航。

## Motion Language
展开高度过渡 200ms ease-out + 子项 stagger fade-in（每项 30ms 延迟，共 ≤300ms）；checkbox 勾选 spring 微弹 cubic-bezier(0.34,1.56,0.64,1) 180ms；loading spinner 线性旋转；焦点项高亮跟随。删动画后功能完整。

## Signature Moment
checkbox 半选(indeterminate)方框的水平线填充动画 + 展开时子项 stagger 入场 + 键盘↑↓时焦点项平滑滑动跟随。

## Success Condition
- ≥9 态全部可演示且键盘可达
- 级联半选逻辑正确（含 disabled 不参与）
- 异步加载 loading→填充真实
- 三套主题切换可换肤，删 accent 变量后组件仍可用（仅换色）
- 焦点环可见，Tab/方向键顺序合理
- 浏览器渲染无白屏无 Console Error，截图非空白

## Technical Boundary
纯 vanilla 单文件 HTML+CSS+JS，无 React/Babel/CDN，无外部字体/图片，相对路径，展示页可有品牌感但组件适应系统光标。真实中文内容（项目目录/权限/分类等真实场景示例）。
