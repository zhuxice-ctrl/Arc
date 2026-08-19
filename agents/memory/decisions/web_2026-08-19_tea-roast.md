# Decision Log: web_2026-08-19_tea-roast

## Date: 2026-08-19
## Category: V1 网页设计

## Art Director 候选评估

### 候选列表（5 个正交方向）

1. **茶焙志 · 焙笼纵剖** — 武夷岩茶焙火工艺，焙笼垂直截面=空间模型，热力梯度配色
   - novelty: 9/10 | fit: 9/10 | risk: 3/10 | **selected**

2. **盐田记 · 海水蒸发** — 古法晒盐，盐池俯视截面=空间模型，矿物色调
   - novelty: 7/10 | fit: 8/10 | risk: 4/10
   - 未选：盐主题在历史作品中出现 5 次，接近 SATURATED

3. **纸寿千年 · 手工造纸** — 古法造纸流程，水池→抄纸→烘干→压平=空间模型，素白调
   - novelty: 6/10 | fit: 8/10 | risk: 3/10
   - 未选：纸/纸浆主题出现 8 次，SATURATED

4. **苔痕上阶 · 苔藓生长** — 苔藓在石阶上的生长扩散，时间=空间模型，青绿调
   - novelty: 5/10 | fit: 7/10 | risk: 4/10
   - 未选：苔藓主题出现 4 次，压力中高

5. **火山博物 · 岩浆冷却** — 火山岩浆从喷发到冷却凝固，温度=时间=空间模型，红黑调
   - novelty: 6/10 | fit: 7/10 | risk: 5/10
   - 未选：火山主题出现 4 次，且与热力梯度配色方向与候选 1 重叠

### 选择理由

候选 1（茶焙志）在 novelty、fit、risk 三项均最优：
- 武夷岩茶焙火工艺从未在历史作品中出现，完全新颖
- 焙笼垂直截面天然适配网页垂直滚动空间模型
- 纯 vanilla 单文件实现风险低
- 热力梯度配色（绿→琥珀→棕→炭黑）与禁蓝紫渐变约束完美契合
- 耙灰控火交互与主题深度绑定，非装饰性

## Design Contract

- **core_idea**: 焙笼垂直截面作为页面空间模型，颜色=温度梯度，用户滚动=深入焙笼
- **must_keep**: 连续热梯度配色、耙灰控火 Canvas 交互、9 层烘焙 section、纯 vanilla 单文件
- **must_not_regress_to**: 3 列卡片网格、通用茶叶 Landing Page、蓝紫渐变
- **success_condition**: 用户滚动体验从鲜叶到炭火的温度渐变，可拨灰控火改变温度

## Critic 评估结果

- Contract Fidelity: FULL
- Issues found: 1 MAJOR（移动端 390px 水平滚动）+ 1 MINOR（"desired" 英文残留）
- Repair: DESIGN_REPAIR 1 次 → 修复 html overflow-x:hidden + ember-glow 响应式宽度 + 文案修正
- Re-QA: PASS（0 CRITICAL, 0 MAJOR, 0 MINOR）

## Quality Gate

- Score: 69/80（门槛 ≥64）
- CRITICAL: 0
- Result: **PASS**

## Memory Fingerprint

- id: web_2026-08-19_tea-roast
- spatial_model: vertical_cross_section
- color_palette: tea_heat_gradient
- primary_interaction: canvas_drag_raking
- motif: heat_gradient_as_depth
