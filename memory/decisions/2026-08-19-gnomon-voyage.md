# 2026-08-19 Art Director 决策日志（V1 web · 本轮：过洋牵星图志）

## 当天差异化判断
今日（8-19）web_mock 已入库 30+ 版，题材密度集中在：传统中式工艺（大运河/制表/活字/年画/廊桥/日晷/算盘/药铺/游廊/茶焙/茶马/窑火/调香/金鱼/鼓声/皮影/蜀道/提线/物候环）、纸本水墨木色配色、拖拽主交互、scroll-descent 叙事、固定舞台、径向轮盘、横向长卷、剖面工程。
最近一批（地震波形档案、光污染勘测尺）刻意转向现代科学数据工具（控制台/磷光琥珀/深空黑），已使用「水平连续迹线+点击波至」「横向光尺+滑动变星空」两种模式。
→ 本轮 V1 继续走「古代科技/工具」差异化方向，但**避开「陆地」「水平单层」「滑动」**，转用「**海面+星空双层空间+牵星测量**」——明代郑和牵星过洋航海题材，全库零重复。

## V1 候选方向（5 个正交 motif）

| ID | motif | visual_source | spatial_model | primary_interaction | 状态 |
|----|-------|---------------|---------------|---------------------|------|
| A | **过洋牵星·郑和宝船星图志** | 明代《过洋牵星图》+ 牵星尺+铜罗盘+宝船+海图刻本 | horizontal_horizon_dual_layer | drag_gnomon_aim_star_measure_altitude | **选中** |
| B | 灵渠分水·秦代水利剖面 | 灵渠铧嘴/大小天平/泄水天平/陡门/飞来石 | cross_section_water_diversion | drag_water_level_diversion_ratio | 弃 |
| C | 九章算术·算筹演算图 | 竹筹+麻布+朱砂圈点+墨书题解 | counting_charts_on_cloth | drag_counting_rod_place_value | 弃 |
| D | 宋代瓦舍·清明上河汴河市井 | 《清明上河图》+ 招幌+酒肆+说书+时辰钟鼓 | horizontal_river_market_scroll | click_signboard_hour_change_buzz | 弃 |
| E | 走马灯·剪纸转动灯笼 | 纸灯+剪纸+轮轴+热气流 | cylindrical_drum_rotation | drag_handle_wind_lift_cutout_rotate | 弃 |

## 选择理由（novelty / fit / execution_risk）

**选中 A 过洋牵星·郑和宝船星图志**：
- **novelty_score=9**：spatial_model `horizontal_horizon_dual_layer`（海面+星空双层）全库零重复；主交互 `drag_gnomon_aim_star_measure_altitude`（牵星测量）非拖拽时间游标、非 scroll-descent、非固定舞台、非径向轮盘，与今日 30+ 版主交互全部正交。
- **fit_score=9**：航海定位的本质就是「星辰+地平线+测量」三要素；双层空间是题材的内在需求，不是装饰；牵星术与罗盘双轨并行是明代航海真实状态（《郑和航海图》《过洋牵星图》原件即如此）。
- **execution_risk=中低**：海图作为底图（SVG）+ 星空作为上层（Canvas 星点）+ 牵星尺为互动层（DOM），三层叠加；真实牵星数据已有（牵星图四幅北辰/华盖/织女/牛郎/灯笼星/南十字等 12 颗指角数据）。
- **配色正交**：navy_midnight(#0D1B2A) + ivory_bone(#E8DCC0) + copper_brass(#B87333) + vermilion_route(#A33B26) + star_chalk_white(#F4E9D8)；禁蓝紫、禁纸本水墨、禁木色；与今日全部 palette 拉开。
- **真实内容丰富**：南京→古里→祖法儿→天方→亚丁→麻林地/慢八撒 6 个真实地名 + 北辰一指≈1.9°真实比例 + 12 颗指角数据 + 6 段真实航线经纬度。

## 弃选理由

- **B 灵渠**：与「蜀道栈道」「日晷」「制表」都属工程剖面/拆解类（pattern collision），今日工程剖面已 3 次。
- **C 算筹**：与「老账房珠算」同属古代计算（计算类工具），题材撞。
- **D 清明上河**：与「古运河」撞水运长卷题材（横向水运），与「街市/招幌/夜市」撞场景。
- **E 走马灯**：与「冰灯营造」「灯影戏台」「候光光影展」都属灯彩类；旋转类交互今日已多次出现（物候环/制表机芯/算盘拨珠）。

## Design Contract（锁定本轮）

### core_idea
过洋牵星·郑和宝船星图志——整页是一幅明代「过洋牵星图」，水平海图为骨架（朱砂航线+地名+水深+指北针），深蓝星图为上层（北辰/华盖/织女/牛郎/灯笼星/南十字 12 颗指角星）；用户拖动象牙色牵星尺，一端对准星辰，尺上刻度即显示指/角数（1 指 ≈ 1.9°，即 0°21'），由此反推当地纬度——亲手复现「看北辰星几指」的古代导航。

### experience_goal
用户像站在宝船船头，夜色初降，掌舵官取出牵星尺与罗盘，量度北辰星高度——"此处北辰四指，计北七度四分，已到锡兰山境。"每一次拖动都是一次真实的过洋定位。

### must_keep（5 条核心）
1. **水平海图为唯一骨架**，≥3 条明代真实航线（南京→古里/祖法儿/天方/亚丁/慢八撒）以朱砂绘制其上
2. **双层空间**：下层海图（朱砂航线+黄黑地名+水深刻度+指北针） + 上层星空（12 颗指角星+真实星等）
3. **牵星尺为唯一交互器**：拖动尺子一端对准星辰，尺上刻度显示指/角；与原图《过洋牵星图》四幅牵星场景完全一致
4. **真实牵星数据**：北辰/华盖/织女/牛郎/灯笼星/南十字 12 颗指角 + 6 段真实航线经纬度 + 锡兰山/古里/祖法儿/天方/亚丁/慢八撒 6 个真实地名
5. **自定义光标**：铜罗盘针式光标，开页居中，高对比，层级最高

### must_not_regress_to（3 条禁止）
- 竖向 section 堆叠
- 卡片网格
- 通用 Landing / 蓝紫渐变 / 拖拽时间游标 / 固定单舞台

### primary_interaction
**drag_gnomon_aim_star_measure_altitude**（拖动牵星尺对准星辰测高度）— 次级：rotate_compass_dial（拖动罗盘旋转指北）、click_waypoint_open_log（点击航段打开牵星记原文）

### motion_language
- star_twinkle（星辰呼吸闪烁，按视星等）
- compass_damped_rotate（罗盘缓动旋转，吸附指北）
- ship_along_route_lerp（宝船沿航线插值前进，实时显示航段）
- hour_advance_dawn_dusk（时辰推进，星空随时间变换）
- gnomon_snap_alignment（牵星尺一端吸附星辰，缓动到位）

### signature_moment
在锡兰山对正北辰牵四指，看到尺上读数显示「北辰四指 · 此处北七度」+ 罗盘指向西南 + 宝船自动沿航线插值进入"锡兰"航段 + 左侧牵星记原文同步浮现「见北辰星四指，看水六托」。

### success_condition
- 删动画后：海图骨架 + 12 颗指角星 + 牵星尺 + 航线说明 仍成立 ✓
- 灰度下：朱砂航线 vs 象牙牵星尺 vs 蓝黑夜空 仍可辨 ✓
- 轮廓：水平海图+星空双层，与今日 30+ 版的纵向叙事/卷轴/剖面/工作台/径向轮 全部无相似 ✓
- 首屏即答：这是明代牵星过洋航海图

### technical_boundary
纯 vanilla 单文件（HTML + CSS + Canvas + JS），零外部依赖（无 React/Babel/CDN），≥12 组件级动效符合物理/主题逻辑，RAF 随 `visibilitychange` 暂停且卸载清理，鼠标高频事件直接操作 DOM，支持 `prefers-reduced-motion`。

## 状态
Art Director 阶段完成 → 进入 Designer（app_builder html）。
