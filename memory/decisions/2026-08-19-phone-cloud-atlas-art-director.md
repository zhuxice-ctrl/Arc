# Art Director 决策档案 · 2026-08-19 V2 手机 UI（原生 App）

## 形态判定
phone_mock/ 最新作品「景蓝坊 cloisonne-atelier」README 形态标记 = 微信小程序 → 本次交替为 **原生 App**。

## 5 个正交候选

### A. 观云图鉴 · 天空手记（选中）
- motif: 抬头看云的人随身携带的野外气象手册
- concept_statement: 认云（对流层剖面高度尺拖游标定位云族）→ 读云属详情 → 记录今日天空 → 积累个人天象档案
- visual_source: 十九世纪气象观测手稿 + 世界气象组织国际云图十云属分类
- spatial_model: 仪器式（0–12km 对流层剖面高度尺）+ 档案式（观测日志）
- primary_interaction: 拖动高度游标在剖面上定位，云族按层（低/中/高）吸附
- signature_moment: 松手吸附入层"咔哒"定格，选中云以水彩笔触在剖面晕染显形
- color_logic: 观测纸米白档案底 + 云族三色（低云铅灰/中云灰蓝/高云冰白）+ 晚霞橙强调（记录/选中态）
- typography_logic: 云名衬线（博物图鉴感）+ UI 无衬线 + 高度/数据等宽
- material_logic: 纸张档案 + 水彩云形
- motion_language: 仪器式阻尼吸附 + 晕染显形，全部承担功能反馈
- novelty 9 / fit 9 / risk LOW-MEDIUM（SVG 云形绘制）
- pattern_collisions: 无

### B. 铁道运转手账 · 检票打孔
- primary: 检票钳打孔记录乘车；signature: 纸屑崩落孔洞透光
- novelty 8 / fit 8 / risk MEDIUM（真实车次内容成本高）
- 落选理由：内容真实性依赖大量车次数据，执行风险高于 A；打孔与历史 seal_stamp 家族邻近

### C. 风筝季 · 风力窗口与放飞日志
- primary: 拖风袋角度查适飞窗口
- 落选理由：「拖游标查窗口」与冲浪 App 潮汐游标、夜跑路灯地图同属"拖游标查条件"模式（last_20 高压），novelty 6

### D. 口袋乒乓 · 翻分牌记分台
- primary: 翻分牌翻动记分
- 落选理由：split-flap 翻牌已在 web 夜班车时刻表使用；产品纵深不足，core flow 单薄，novelty 6

### E. 家庭发酵室 · 翻缸计时与尝味曲线
- 落选理由：生命周期管理（今日该做什么→记录→时间线）与晾晒/养蚕/阳台种菜/茶宠高度同构，pattern SATURATED，novelty 5

## 选择
ranking: A > B > D > C > E
选中 A：云属分类自带"高度"这一天然连续变量，拖游标交互从题材内部生长出来而非外加；与 38 条历史指纹在 motif/交互/材质/配色四维度均无碰撞。

# Design Contract

## Core Idea
原生 App「观云图鉴 · 天空手记」——抬头看云的人随身携带的野外手册：拖对流层剖面高度尺认云 → 读云属详情 → 记录今日天空 → 积累个人天象档案。

## Experience Goal
用户感到手里是一台纸质的、可信任的天空仪器：剖面尺一拖，天上的云就有了名字；记录一条，档案就厚一页。

## Must Keep
1. 原生 App 形态（自定义导航栏、底部 TabBar、页面栈 push/pop、半屏详情，禁胶囊按钮等小程序语言）
2. 高度游标剖面签名交互：拖动连续变化、松手阻尼吸附入层、云形水彩晕染显形
3. 真实内容：国际云图 10 云属（积云/积雨云/层云/层积云/雨层云/高积云/高层云/卷云/卷积云/卷层云），每个含高度带、形态、天气预兆、辨认要点
4. 完整 User Flow：今日 → 认云 → 云属详情 → 记录今日天空 → 档案新增（盖章式观测印）→ 档案时间线可看
5. localStorage 持久化观测记录；空档案/已记录两种状态设计
6. 设计规范页 + 接口文档页（关于 Tab 内进入）

## Must Not Regress To
- 问候语+搜索框+Banner+分类 Icon+横滑卡片首页模板
- 网页缩进手机 / 蓝紫渐变 / 假功能假按钮

## Primary Interaction
在 0–12km 对流层垂直剖面上拖动高度游标：剖面云图随高度连续变化，经过云族高度带时游标产生吸附阻尼感，松手"咔哒"落入该层，层内云种列表潮水式刷新。

## Motion Language
仪器式：阻尼、吸附、定格；云形以水彩笔触晕染显形（stroke 绘制+透明度渐入）；页面转场为原生页面栈横滑。无装饰性粒子、无 Ken Burns。

## Signature Moment
高度游标松手吸附入层的瞬间：游标弹性定格、剖面该层云形水彩晕染显形、云属名以衬线大字浮现——"原来这叫鬃积雨云"。

## Success Condition
不看任何教程，30 秒内：拖动高度尺认出一种云 → 打开详情 → 完成一条"今日天空"记录 → 档案页出现这条记录（带观测印）。

## Technical Boundary
单文件 vanilla HTML/CSS/JS（禁 React/外部依赖/CDN 字体可用系统字体栈）；390×844 目标尺寸；RAF/定时器随页面可见性暂停；支持 prefers-reduced-motion；localStorage 持久化；零未定义引用。
