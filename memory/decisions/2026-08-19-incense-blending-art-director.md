# Art Director Decision Log — 2026-08-19 合香配方 (incense-blending)

## 候选方向

| ID | Motif | Visual Source | Spatial Model | Primary Interaction | Signature | Novelty | Fit | Risk |
|----|-------|---------------|---------------|---------------------|-----------|---------|-----|------|
| A | 香料柜图鉴 | 药材屉柜 | cabinet_drawer_grid | pull_drawer_halfsheet | drawer_pull_reveal | 6 | 7 | MEDIUM |
| B | 合香天秤配方工作台 | 黄铜戥秤+陶瓷钵+旧方手稿 | workbench_scale_center | drag_material_onto_scale | balance_tilt_to_level | 9 | 9 | MEDIUM |
| C | 焚香时钟时间线 | 香篆+灰迹 | vertical_timeline | drag_set_duration | ash_trail_grow | 7 | 6 | LOW |
| D | 香篆打拓 | 铜模+香灰盘 | topdown_pattern_stencil | drag_stencil_lay_trail | ember_travel_along_path | 9 | 7 | HIGH |
| E | 香材地图产地溯源 | 海上丝路古地图 | map_first_navigation | tap_pin_trade_route | route_line_draw | 7 | 6 | MEDIUM |

## 排名与选择

Ranking: B > D > A > C > E

## 选择理由

选 B（合香天秤）：
1. **新颖性最高（9/10）**：戥秤称量交互在近 30 版 phone mock 中从未出现，与近期所有作品（钱币柜转动包浆、虫鸣录音识别、围棋打谱、冲浪潮汐游标等）完全正交。
2. **适配度最高（9/10）**：合香的核心行为就是"选材→称量→调配"，戥秤是这一行为的天然物理隐喻，产品逻辑从行为中生长。
3. **执行力可控（MEDIUM）**：秤杆倾斜用 atan2 + CSS transform 可实现，雷达用 Canvas 2D，拖拽用 pointer events，均在 vanilla 技术边界内。
4. **Pattern collision 最低**：cabinet/drawer（A）与钱币柜碰撞；timeline（C）与多条历史碰撞；map-first（E）与树木图鉴碰撞；pattern drawing（D）与临帖碰撞。B 的 balance-scale 交互无碰撞。

## 未选理由

- D（香篆打拓）虽新颖但 execution risk HIGH，路径燃烧动画在单文件 vanilla 中难以保证质量。
- A（香料柜）drawer 交互与近期钱币鉴赏柜高度重复。
- C（焚香时钟）交互较单一，产品深度不足。
- E（香材地图）map-first 与城市树木图鉴结构重复。

## 已接受模式

- workbench_scale_center: 首次使用，无压力
- drag_material_onto_scale: 首次使用，无压力
- balance_tilt_to_level: 首次使用，无压力
- canvas_radar_chart: 首次使用，无压力
- warm_incense_workshop_palette: 首次使用，无压力

## Form Factor

上一次 phone_mock（古钱币鉴赏柜）= 微信小程序 → 本次 = 原生 App
