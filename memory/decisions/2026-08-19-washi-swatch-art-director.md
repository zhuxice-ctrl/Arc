# Art Director Decision Log — 2026-08-19 V2 Phone (微信小程序)

## Form Factor
上一次: 原生 App (片夹 film-canister) → 本次: 微信小程序

## Pattern Pressure Analysis
- spatial_model: 大部分模式 all_time=1, native_app_4tabbar_pagestack=2 (LOW-MEDIUM)
- primary_interaction: 全部 all_time=1 (LOW)
- visual_material: 全部 all_time=1 (LOW)
- color_logic: 暖纸棕+朱砂+墨黑+木色 近期高频 → 主动避开
- 端侧交互 (capsule/halfsheet/pull-refresh/swipe) 为形态要求, 不计入压力

## 5 候选方向

### A. 藏书票印刷所 (Bookplate Printshop)
- motif: letterpress bookplate 活字印刷
- spatial: workbench_printshop
- interaction: compose_type → roll_ink → press_reveal
- visual: oxblood_ink + cream_cardstock + brass_type + wood_press
- novelty: 8 | fit: 8 | risk: MEDIUM (press animation complex)

### B. 候鸟物候钟 (Migratory Bird Phenology Clock)
- motif: 候鸟迁徙物候轮盘
- spatial: radial_clock_wheel
- interaction: rotate_wheel_to_season → see_arrivals → log_sighting
- visual: muted_natural_ornithological
- novelty: 6 | fit: 7 | risk: LOW-MEDIUM
- collision: solar_term_wheel (phone) — MEDIUM

### C. 纸胶带试色簿 (Washi Tape Swatch Book) ← SELECTED
- motif: 纸胶带收藏试色手账
- spatial: swatch_book_pull_tear
- interaction: pull_tape_from_roll → tear_strip → place_on_card → tag_color → organize_collection
- visual: porcelain_white + sage_green + multicolor_tape_swatches
- novelty: 8 | fit: 9 | risk: LOW-MEDIUM
- signature: tape pull + fibrous tear edge

### D. 城市公共饮水点 (City Water Refill Atlas)
- motif: 公共饮水点地图
- spatial: map_first
- interaction: tap_pin → halfsheet_detail → report_status
- visual: aqua + concrete_grey + white (civic)
- novelty: 7 | fit: 7 | risk: LOW
- collision: tree_map_home, fullscreen_map — MEDIUM

### E. 布匹余料拼布 (Fabric Scrap Patchwork Planner)
- motif: 拼布余料规划
- spatial: grid_workbench
- interaction: drag_scrap → snap_to_grid → build_block
- visual: calico_textile_sewing_tones
- novelty: 7 | fit: 7 | risk: MEDIUM
- collision: bento_grid, 4x4_plot_grid — MEDIUM

## Ranking: C, A, D, E, B

## Selection Reason
选 C (纸胶带试色簿):
1. 新颖性高 — 纸胶带收藏试色是真实文具爱好, 历史无碰撞
2. 微信小程序适配度最高 — 快速拍照试色→整理→分享拼贴, 完美契合小程序轻量场景
3. 签名交互独特 — 胶带从卷轴拉出+撕断纤维边缘, 物理隐喻鲜明且服务产品核心
4. 配色全新 — 瓷白+sage绿+多色胶带, 彻底避开暖纸棕/朱砂/墨黑高频区
5. 执行风险可控 — tape pull/tear 用 CSS+SVG 可实现

## Design Contract

### Core Idea
纸胶带试色簿微信小程序: 拉胶带→撕断→落试色卡→标记色系→整理入册→拼贴手账, 围绕"试色"这一核心行为建立收藏体系。

### Experience Goal
用户像在文具店里拉出一卷胶带试色: 拉出、撕断、贴在卡上、归类收册, 享受纸质文具的触感反馈。

### Must Keep
1. 微信小程序形态 (胶囊导航+自定义导航栏+底部TabBar+半屏弹层+下拉刷新+左滑操作, ≥6种端侧交互)
2. 签名交互: 胶带从卷轴拉出→释放撕断→纤维毛边→落入试色卡 (物理隐喻, 服务产品核心)
3. 完整 user flow: 拉胶带试色→标记→入册→按色系浏览→拼贴手账预览
4. 真实内容: 8+种真实纸胶带设计(几何/花卉/条纹/纯色/和风), 真实色系分类, 真实宽度规格
5. localStorage 持久化 (试色卡册+拼贴方案)
6. 设计规范页 + 接口文档页

### Must Not Regress To
1. 通用 App 首页模板 (问候语+搜索+Banner+分类图标)
2. 假功能 (装饰按钮/点不了的搜索/空 Tab)
3. 网页缩进手机

### Primary Interaction
拖拽胶带卷轴拉出胶带条 → 释放时撕断(纤维毛边动画) → 胶带条落入试色卡 → 标记色系/图案/品牌/宽度 → 保存入册

### Motion Language
功能性物理反馈: 胶带拉伸弹性回弹、撕断纤维毛边、卡片落入吸附、下拉刷新胶带卷转动放卷。符合文具物理特性, 无装饰性特效。

### Signature Moment
胶带从卷轴拉出时的连续放卷旋转 + 释放撕断的纤维毛边撕裂 — 这是纸胶带最本质的物理行为。

### Success Condition
- 能从卷轴拉出胶带并撕断, 生成带真实图案的试色卡
- 试色卡可标记色系并归入色卡簿
- 色卡簿可按色系筛选浏览
- 可选多条胶带拼贴到手账预览页
- 6+种微信小程序端侧交互真实工作
- 无白屏/Console Error/假功能

### Technical Boundary
- 纯 vanilla 单文件 HTML (无 React/CDN)
- 微信小程序视觉约定 (375px 宽, 胶囊按钮右上角)
- 支持 prefers-reduced-motion
- localStorage 持久化

## Accepted Patterns
- 微信小程序端侧交互 (形态要求, 非 AI 模板)
- 4 TabBar (产品信息架构需要, 非默认套用)
