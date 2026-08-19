# 2026-08-19 Art Director 决策日志

## V1 网页设计 — 窑火天目·建盏烧成

### 候选方向（5 个正交）
1. thermal_gradient_corridor — 窑温梯度走廊，四盏建盏锚定温区（**选中**）
2. tea_ceremony_sequential_room — 茶室序列空间，每间一盏一茶
3. glaze_recipe_lab — 釉方实验室，拖拽调配矿物比例
4. kiln_cross_section_xray — 窑炉剖面X光，展示烧成物理过程
5. dynasty_timeline_glaze_evolution — 朝代轴釉色演变时间线

### 选择理由
thermal_gradient_corridor 空间模型在库内首次出现（pattern_stats: 无 thermal_gradient 模式），novelty_score 最高；fit_score 强（温度=空间隐喻天然支持滚动叙事）；execution_risk 中低（Canvas 粒子纹路成熟）。

### Design Contract 摘要
- core_idea: 窑温梯度走廊，四盏建盏（兔毫/油滴/曜变/柿天目）锚定 600°C→1350°C
- must_keep: 自定义窑火光标、温区背景色温联动、Canvas 釉面纹路
- must_not_regress_to: 普通产品展示页/图集画廊
- success_condition: 滚动时四盏建盏的 filter/纹路随温区实时变化

## V2 手机 UI — 弓道志·传统射箭训练日志

### 候选方向（5 个正交）
1. archery_training_bowstring_drag — 弓弦拖拽蓄力释放训练日志（**选中**）
2. ink_paint_mixing_app — 水墨调色练习 App
3. traditional_weaving_pattern_editor — 传统织锦纹样编辑器
4. go_board_review_replay — 围棋棋谱复盘 App
5. pottery_throwing_speed_monitor — 拉胚转速监测 App

### 选择理由
archery_training 在 phone 库内首次出现（产品类型无重复），弓弦拖拽签名动效与现有 17 种交互机制正交（无 drag_bowstring 模式）。上一次 phone_mock 为微信小程序，本次交替为原生 App。

### Design Contract 摘要
- core_idea: 原生 App，4 Tab，弓弦拖拽签名动效
- must_keep: 弓弦物理拖拽、靶环 SVG、训练记录 localStorage
- must_not_regress_to: 通用运动记录模板
- success_condition: 拖拽弓弦→蓄力→释放→振动→命中→自动记录

## V3 交互组件 — 拨浪鼓·甩珠击鼓

### 候选方向（5 个正交）
1. rattle_drum_pendulum_impact — 拨浪鼓摆锤冲击（**选中**）
2. abacus_bead_collision_counter — 算盘珠碰撞计数器
3. wind_chime_resonance_tuner — 风铃共振调音器
4. spinning_top_precession_nutation — 陀螺进动章动
5. hand_bell_crank_rocker — 手摇铃曲柄摇杆

### 选择理由
rattle_drum 的 pendulum+impact 组合在 component 库内首次出现（现有 16 种机制无此组合），与所有 spring/lever/cam 机制正交。满足 V3 方向约束（光标拖拽驱动、实体隐喻、非键盘、非公式演示）。

### Design Contract 摘要
- core_idea: 拖拽鼓身旋转→双珠摆锤→冲击鼓面→声效形变涟漪
- must_keep: 摆锤物理积分、冲击检测、WebAudio 合成、自定义光标
- must_not_regress_to: 物理公式演示/键盘交互
- success_condition: 不同拖拽力度产生不同冲击声效与视觉反馈
