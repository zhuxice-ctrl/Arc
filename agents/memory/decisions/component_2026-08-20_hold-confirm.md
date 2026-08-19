# Decision Log: component_2026-08-20_hold-confirm-toast

## Date: 2026-08-20
## Category: V3 交互组件（当日第 2 件）

## Art Director 候选评估

### 候选列表（5 个正交方向）

1. **按住确认按钮 + 结果 Toast 组件对**（操作类+反馈类）
   - motif: 「确认的分量」——危险操作（删除/发布/支付）需要持续施压的物理重量感，而非一次误触即触发；Toast 承接操作结果形成「确认→反馈」完整闭环
   - visual_source: 工业安全规程中的「双手确认/延时闸」语义（抽象为 UI 语言，非拟物闸刀）
   - spatial_model: inline_component_showcase_vertical_scenes
   - primary_interaction: hold_press_damped_ring_fill_threshold_snap_release_decay
   - signature: 进度环阻尼填充至阈值瞬间的弹性咬合 + 中途松手的衰减回退
   - color_logic: 炭墨黑(按压态)+熔岩橙(危险/进行)+石灰白(底)+苔灰(辅助)——橙=危险语义、黑=重量、灰=禁用
   - novelty 9 | fit 10 | risk LOW-MEDIUM
   - pattern_collisions: 无（hold_press / toast_queue 机制历史 0 次）

2. **手风琴 Accordion + 空状态 Empty State**（导航类+反馈类）
   - motif: 「档案卷宗的展开」——FAQ/设置面板的真实场景
   - novelty 6 | fit 8 | risk LOW
   - 未选：手风琴交互机制（展开/收起）偏薄，签名时刻弱，容易退化成普通折叠面板

3. **评分 Rating + 步进器 Stepper**（输入类双件）
   - motif: 「刻度与增量」——电商评价与数量选择
   - novelty 6 | fit 8 | risk LOW
   - 未选：两组件均为单点点击交互，缺 Threshold/Continuous 层次，手感空间有限

4. **Bottom Sheet + 滑动删除**（覆盖层类+操作类）
   - motif: 「半屏浮层与手势驱逐」
   - novelty 7 | fit 7 | risk MEDIUM
   - 未选：swipe 手势在桌面端展示页难以真实呈现（无触屏），QA 难验证核心手感

5. **Toast 通知系统 + 骨架屏 Skeleton**（反馈类双件）
   - motif: 「等待与告知」
   - novelty 6 | fit 8 | risk LOW
   - 未选：Skeleton 是纯展示态无交互核心，作为组件其「状态机」天然单薄

### 排序与选择

ranking: [1, 4, 5, 2, 3]
selection_reason: 候选 1 三维度全胜——新颖性（hold-to-confirm 与 toast queue 机制在历史指纹中 0 次出现，与今早分页组件的「点击/键盘导航」机制完全正交）；适配度（删除确认是所有真实项目的硬需求，Toast 是反馈闭环必需品，实用性满分）；执行力（纯 vanilla 单文件可实现，阻尼填充+阈值触发的手感在鼠标与键盘下都可真实验证，风险低）。候选 4 的滑动手势在桌面 QA 环境无法验证核心手感，风险排除。

## Design Contract

### Core Idea
「确认的分量」：一套生产级「按住确认按钮（Hold-to-Confirm）+ 结果 Toast」组件对。危险操作不靠二次弹窗打断用户，而是让按钮本身要求持续施压——按住时进度环以阻尼曲线填充，填满瞬间阈值触发、弹性咬合确认；中途松手进度衰减归零。操作结果由 Toast 队列承接（成功/失败/可撤销），形成「施压确认→结果反馈」完整闭环。

### Experience Goal
开发者抽到项目里改不超过 3 处 CSS 变量即可用；用户按住的一秒里明确感到「这个动作有重量」，松手即安全取消，零误删焦虑。

### Must Keep
1. Hold 按钮完整状态机（≥7 态）：rest / hover / focus(可见焦点环) / pressing(进度填充) / success(触发后短暂成功态) / cancelled(松手衰减) / disabled / loading(异步执行中)
2. 阈值语义：默认按住 1200ms 触发；进度填充用阻尼曲线（先快后慢），触发瞬间弹性咬合（cubic-bezier 回弹 + 微缩放），松手进度 300ms 衰减归零
3. 键盘可操作：Tab 聚焦、按住 Space/Enter 等效触发、Esc 取消进行中的按压；焦点环始终可见；aria-disabled / aria-live / role=status(Toast) 正确
4. Toast 队列：多通知排队、悬停暂停倒计时、action 按钮（撤销）、手动关闭、4 种语义类型（success/error/info/loading）
5. CSS 变量主题化（--hcc-* 前缀，色值/圆角/时长/阻尼全暴露）+ 工厂 API（createHoldConfirm / toast.show）+ 纯 vanilla 单文件零依赖
6. prefers-reduced-motion 降级：进度改线性、取消弹性，功能不变

### Must Not Regress To
- 拟物化物理装置（不做闸刀/拉杆造型——只取「持续施压」的交互语义，不拟物）
- 蓝紫渐变 / 发光特效 / 装饰性粒子
- 展示页喧宾夺主（组件是主角）

### Primary Interaction
按住（指针或 Space/Enter）→ 进度环阻尼填充（Continuous）→ 达阈值瞬间弹性咬合+状态质变（Threshold）→ 松手衰减归零（Release/Decay）

### Motion Language
阻尼填充 cubic-bezier(0.22, 1, 0.36, 1) 1200ms；触发咬合 cubic-bezier(0.34, 1.56, 0.64, 1) 250ms；Toast 滑入 200ms ease-out；衰减 300ms linear。全部动画服务状态语义，无装饰动效。

### Signature Moment
进度环填满的「咬合瞬间」——环闭合、按钮微缩回弹、颜色从熔岩橙转为成功绿的连贯质变。

### Success Condition
1. 不看说明即可完成一次按住确认与一次中途取消；2. 键盘全程可达（Tab→Space 按住→触发）；3. 删掉所有过渡动画后功能完整；4. 抽出组件代码改 ≤3 处变量可换主题。

### Technical Boundary
纯 vanilla 单 HTML 文件（无 React/Babel/CDN/外部字体/图片）；CSS/JS 可独立抽取；定时器随可见性暂停、快速操作不叠加；高频事件直接操作 DOM。
