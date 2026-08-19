# 2026-08-19 Art Director 决策日志 · V2 岸钓战术板

## 形态判定
phone_mock 最新子文件夹「2026-08-19_养蚕志_sangcan-journal」形态标记=原生 App → 本版交替为 **微信小程序**。

## 候选方向（5 个正交）—— 主题：钓鱼/岸钓日志

| ID | motif | spatial_model | primary_interaction | signature |
|----|-------|---------------|--------------------|-----------|
| A | 岸钓战术板 angler_tactical_board | 水情仪表板+作钓任务流 | 中鱼拖动收线→张力区波动→起鱼 | 收线张力绿/黄/红区波动起鱼 |
| B | 钓行手账 fishing_trip_journal | 时间轴式 | 钓行贴纸盖章入时间线 | 鱼获贴纸盖章入册 |
| C | 水下图鉴深度剖面 underwater_depth_profile | 垂直深度剖面 | 鱼获沉入对应水层 | 鱼获按水层沉入分布 |
| D | 鱼线深度标尺 depth_ruler | 垂直标尺 | 拖动钓钩设定深度 | 水深-鱼种落点 |
| E | 战利品墙 trophy_wall | 展览式 | 称重秤指针 | 重量排行战绩墙 |

## Novelty / Pattern Pressure 检查
- A 收线张力 signature：phone 库内 25+ 交互机制无 reel-in/tension 模式，正交。pattern_stats primary_interaction 无 drag_reel_tension。
- 签名去重：避免近期高频——stamp_drop(早餐摊/攀岩/弓道/方言/图书漂流)、timeline(手账/图书漂流/lifecycle)、wheel_rotate(节气)、cursor_on_curve(潮汐)、overlay_compare(临帖)、drop_stone_adsorb(围棋)、watering_can(阳台)、bowstring(弓道)、drag_herb_scale(中药秤)、pull_tape(纸胶带)、drag_leaf_feed(养蚕)。收线张力均不同。
- spatial：战术板+任务流组合，与近期 task_flow_4tabbar 略近但首屏为水情仪表（非通用首页模板），可接受。

## 排序与选择
ranking: [A, C, D, B, E]
- 选中 **A 岸钓战术板**：novelty_score 9（收线张力首次）、fit_score 9（岸钓 prep+catch 是真实高频闭环）、execution_risk MEDIUM（收线张力物理需调参，但单文件可实现）。
- 不选 C：深度剖面视觉强但"鱼获沉入"交互偏展示，catch 闭环弱；execution_risk HIGH。
- 不选 B：timeline 签名与近期图书漂流/lifecycle 重复，novelty 低。
- 不选 D：垂直标尺交互近潮汐游标，novelty 中。
- 不选 E：展览式偏收藏，作钓活动闭环弱。

## accepted_patterns
- 微信小程序端侧交互（capsule/bottom tabbar/half sheet/pull refresh/swipe action/page stack）—— 功能必需，非装饰。

---

## Design Contract

### Core Idea
岸钓者的随身战术板与鱼获日志微信小程序：看水情天气月相定宜钓→选钓点→抛竿作钓→中鱼收线（张力签名）→鱼获登记→图鉴与水深分布。

### Experience Goal
让岸钓者出门前一眼判断"今天值不值得去、去哪"，作钓时把"中鱼起鱼"这一情绪高点变成可触发的张力手势并自动沉淀鱼获数据。

### Must Keep
1. 微信小程序形态，端侧交互 ≥4 种（胶囊导航栏、底部 TabBar、半屏弹层、下拉刷新弹性、左滑操作、页面栈 push/pop 转场）
2. 完整 user flow：钓况首页→开始作钓→选钓点(半屏)→作钓中(抛竿)→中鱼收线→鱼获登记半屏→入图鉴，全程因果跳转
3. 收线张力签名动效：张力条绿(稳)/黄(挣扎)/红(断线风险)区波动，收满起鱼，挣扎强度自动带入登记
4. 真实鱼种内容（≥6 种本土岸钓/淡水鱼：鲫鱼/鲤鱼/草鱼/鲶鱼/翘嘴/鳊鱼 等），真实水情参数（水温/气压/风向风速/月相/水位）
5. localStorage 持久化鱼获与作钓记录；含设计规范页 + 接口文档页

### Must Not Regress To
1. 通用首页模板（问候语+搜索+Banner+分类图标+横卡+推荐+底部导航）
2. 假功能（点不了的搜索/空 Tab/装饰按钮/假筛选）
3. 网页缩进手机；蓝紫渐变；与近期 stamp/timeline/wheel/cursor 签名重复

### Primary Interaction
中鱼时进入收线面板：拖动/按住收线，张力条随鱼挣扎在绿黄红区波动；保持绿区收线进度增长，长时间顶红区→断线重来；收满→鱼跃出水面→鱼获登记半屏自动带出挣扎强度/预估重量。

### Motion Language
功能性反馈优先：收线张力阻尼与鱼挣扎随机扰动、月相气压数据缓动入场、半屏弹层弹簧、下拉刷新弹性回弹、鱼获入册水面涟漪、页面栈 push/pop 滑动转场。支持 prefers-reduced-motion。

### Signature Moment
收线起鱼——张力条在绿/黄/红区之间随鱼挣扎波动，用户拖动收线在"稳住张力"与"快速收线"间博弈，收满瞬间鱼跃出水面、水花溅起、入册涟漪扩散。

### Success Condition
1. 完整走通"钓况→开始作钓→选钓点→抛竿→中鱼收线→鱼获登记→图鉴查看"全流程，每步因果跳转真实
2. 收线张力真实可玩，断线/起鱼两条结果都成立
3. 无白屏、无 Console Error、390px 与邻近尺寸布局正常
4. ≥4 种微信小程序端侧交互真实工作
5. 内容真实（鱼种/水情/钓点均为可信数据），非 Lorem Ipsum
6. 删动画后信息层级仍成立；灰度下层级仍成立

### Technical Boundary
纯 vanilla 单文件 HTML（无 React/Babel/CDN 外部依赖）；微信小程序视觉约定（胶囊导航栏在右上、底部 TabBar）；390px 目标宽度 + 邻近尺寸 414px 自检；localStorage 持久化。
