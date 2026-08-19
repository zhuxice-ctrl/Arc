# 2026-08-19 Art Director 决策日志 · V2 漆扇手作志

## 形态判定
phone_mock 最新子文件夹「2026-08-19_岸钓战术板_angling-tactical-board」形态标记=微信小程序 → 本版交替为 **原生 App**。

## 题材
大漆漂流扇 / 漆扇手作（非遗漆扇）。近 33 条 phone 记忆与 phone_mock 全量目录均无漆扇/大漆/漂流扇主题，正交。

## 5 个正交候选

| ID | motif | spatial_model | primary_interaction | signature_moment | visual_source | novelty | fit | risk |
|----|-------|---------------|---------------------|------------------|---------------|---------|-----|------|
| A | 漆扇手作工作台 lacquerfan_atelier | 工作台+扇册 | 拖扇入水提拉显纹 | 提扇瞬间漆纹转印显形 | 大漆/水盘/团扇/金箔 | 9 | 9 | MEDIUM |
| B | 漆色配方档案柜 | 档案/册页式 | 翻页浏览配方 | 朱漆晕透纸 | 漆器档案册 | 6 | 6 | LOW |
| C | 漆层叠加时间轴 | 时间轴/日志式 | 记录每层髹涂session | 漆层剖面累加 | 髹漆工序日志 | 7 | 6 | LOW-MED |
| D | 水流配色实验室 | 画布/实验式 | 调漆入水搅出纹理 | 搅动水面试色流动 | 漆水流动图谱 | 8 | 7 | MED-HIGH |
| E | 扇面纹样对比器 | 对比/分屏式 | 双扇并排对比纹样 | 红黑阴阳翻转 | 扇面收藏对比 | 6 | 5 | LOW |

## Novelty / Pattern Pressure 检查
- A「拖扇入水提拉显纹」signature：phone 库 25+ 交互机制无 dip-and-pull / fluid-transfer-reveal 模式，正交。pattern_stats phone.primary_interaction 无此项。
- 签名去重（避开近期高频）：stamp_drop(早餐摊/攀岩/弓道/方言/图书漂流)、timeline(手账/图书漂流/lifecycle/养蚕)、wheel_rotate(节气)、cursor_on_curve(潮汐)、overlay_compare(临帖)、drop_stone_adsorb(围棋)、watering_can(阳台)、bowstring(弓道)、drag_herb_scale(中药秤)、pull_tape(纸胶带)、drag_leaf_feed(养蚕)、reel_tension(岸钓)、mirror_flip(篆刻)。dip-pull-reveal 均不同。
- spatial：工作台+扇册组合，与近期 task_flow_4tabbar / timeline 不同首屏（首屏=今日水盘工作台，非通用首页模板）。
- 无 SATURATED 模式。form_factor=native_app last_20 中等，题材需要原生手势（拖拽入水+提拉），非装饰。

## 排序与选择
ranking: [A, D, C, B, E]
- 选中 **A 漆扇手作工作台**：novelty_score 9（dip-pull-reveal 首次）、fit_score 9（做漆扇=选扇→调漆→漂漆→蘸扇→显纹→入册 是真实高频闭环且每把唯一不可控，配方记录有复现价值）、execution_risk MEDIUM（水流漆色用 canvas 可实现，提拉显纹用 mask+clip 可控）。
- 不选 D：搅水试色交互强但缺"成品"闭环，易退化成纯演示装置；catch 闭环弱。
- 不选 C：髹漆时间轴与近期 timeline/journal 重复，novelty 低。
- 不选 B：档案册是近期高频结构，章法同质。
- 不选 E：对比器单一太薄，撑不起完整产品。

## accepted_patterns
- 原生 App 端侧交互（自定义导航栏+返回手势、底部 TabBar、半屏弹层、页面栈 push/pop 转场、长按/拖拽、下拉刷新）—— 功能必需，非装饰。

---

## Design Contract

### Core Idea
漆扇手作志：整个界面是一张正在被制作漆扇的水盘工作台。用户选扇胚→调漆色（朱砂/石黄/石青/松烟/金箔）→漂漆入水搅出纹理→拖扇入水蘸漆→提扇瞬间漆纹转印显形（signature）→晾干命名入扇册。每把漆扇唯一不可控，配方可记录复现。

### Experience Goal
让用户体会漆扇最迷人的瞬间：你永远不知道提起来是什么纹——但你能记下配方，下次再赌一把。整个 App 围绕"入水提拉显纹"这一不可控的惊喜展开，从调色到入册，最后在提扇那刻获得转印显形的满足。

### Must Keep
1. 原生 App 形态，端侧交互 ≥4 种（自定义导航栏+返回手势、底部 TabBar、半屏弹层/Bottom Sheet、页面栈 push/pop 转场、拖拽入水、下拉刷新弹性）
2. 完整 user flow：今日水盘→选扇胚(半屏)→调色盘选漆→漂漆入水搅纹→拖扇入水蘸漆→提扇显纹→晾干命名→入扇册，全程因果跳转
3. 提扇显纹签名动效：扇面从水盘提出，水面漆纹按提拉速度/角度转印到扇面，显形瞬间金箔/朱砂晕开；提拉速度影响纹样疏密
4. 真实内容（≥5 种大漆色：朱砂红/石黄/石青/松烟墨/金箔；≥3 种扇胚：素白团扇/生绢团扇/油纸折扇；真实工艺参数：水温/入水角度/提拉速度/搅拌方向）
5. localStorage 持久化扇册与配方；含设计规范页 + 接口文档页

### Must Not Regress To
1. 通用首页模板（问候语+搜索+Banner+分类图标+横卡+推荐+底部导航）
2. 假功能（点不了的搜索/空 Tab/装饰按钮/假筛选）
3. 网页缩进手机；蓝紫渐变；与近期 stamp/timeline/wheel/cursor/mirror/reel 签名重复

### Primary Interaction
水盘工作台：点选漆色滴入水盘→拖动手指/扇子搅出纹理→长按扇柄拖扇入水（扇面浸入）→提拉（向上拖动）→提拉过程中水面漆纹按速度转印到扇面→完全提出后扇面显形→晾干→命名入册。提拉速度直接影响纹样疏密（快=细密拉丝，慢=大片晕染）。

### Motion Language
功能性反馈优先：漆滴入水扩散晕开、搅水纹理流动、扇面浸入水面涟漪、提拉转印随速度变化、金箔颗粒漂浮、晾干进度由湿到干色彩饱和度回升、半屏弹层弹簧、页面栈 push/pop 滑动转场。支持 prefers-reduced-motion（降级为静态转印快照）。

### Signature Moment
提扇显纹——扇面从水盘被提起的瞬间，水面漂浮的漆纹按提拉速度/角度转印到扇面，朱砂与松烟在扇面上拉出独一无二的纹路，金箔碎点贴附，水珠滑落，纹路定形。这是每把漆扇"开盲盒"的高光。

### Success Condition
1. 完整走通"今日水盘→选扇胚→调色→漂漆搅纹→拖扇入水→提扇显纹→晾干命名→入扇册"全流程，每步因果跳转真实
2. 提扇显纹真实可玩，提拉速度影响纹样疏密，每把纹样不同
3. 配方可保存并在扇册复现（重新创作时带入配方）
4. 无白屏、无 Console Error、390px 与邻近尺寸 414px 布局正常
5. ≥4 种原生 App 端侧交互真实工作
6. 内容真实（漆色/扇胚/工艺参数均为可信数据），非 Lorem Ipsum
7. 删动画后信息层级仍成立；灰度下层级仍成立；轮廓与近期作品可区分

### Technical Boundary
纯 vanilla 单文件 HTML（无 React/Babel/CDN 外部依赖）；原生 App 视觉约定（状态栏区+大标题导航+底部 TabBar+返回手势）；390px 目标宽度 + 邻近尺寸 414px 自检；localStorage 持久化；canvas 实现水盘漆色与转印。
