# Decision Log: phone_2026-08-20_fangcun-seal

## Date: 2026-08-20
## Category: V2 手机 UI · 形态：微信小程序

## Art Director 候选评估

### 候选列表（5 个正交方向）

1. **方寸印稿 · 篆刻工坊** — 查篆字→设计印稿→长按钤印→收入印谱。视觉来源：印床/印泥/宣纸/九叠篆。签名=钤印力度档位决定印蜕浓淡飞白
   - novelty 9/10 | fit 9/10 | risk 4/10 | **selected**
2. **风筝志** — 骨架扎制步骤+风力窗口+放飞日志。novelty 7 | fit 7 | risk 4。未选：线轮拖拽与历史 rotary_dial/drag_wheel 模式接近
3. **信鸽竞翔日志** — 放飞归巢记录+血统册。novelty 7 | fit 6 | risk 3。未选：偏记录台账，弱签名交互
4. **昆曲水袖身段谱** — 身段分解+跟练打卡。novelty 6 | fit 6 | risk 6。未选：身段动画表现风险高，易退化成分页图鉴
5. **溪流飞钓毛钩绑制** — 毛钩配方+绑制步骤+钓获日志。novelty 7 | fit 7 | risk 5。未选：与昨日手冲咖啡（配方→步骤→日志）产品同构

### 选择理由

篆刻主题历史未出现，完全新颖；九叠篆是直角折线几何体天然适配 SVG 手绘（降低字形风险）；钤印力度档位交互与主题深度绑定且符合「逻辑动效」偏好；微信小程序形态（半屏弹层/ActionSheet/左滑/吸底）与工具型产品契合；配色（宣纸朱砂墨黑田黄石青灰）禁蓝紫且与近期（潮间带、手冲咖啡、观云图鉴）不雷同。

## Design Contract

- core_idea: 印床石章为视觉中心，查篆→布稿→钤印→留谱闭环，签名=长按力度档位决定印蜕浓淡飞白
- must_keep: 7页完整流程真实因果 / 签名钤印力度三档+随机飞白 / 20字九叠篆SVG字形 / 朱白文真实切换 / 7种端侧交互 / localStorage印谱+左滑ActionSheet / 设计规范页+接口文档页8接口 / 纯vanilla单文件
- must_not_regress_to: 通用App首页模板 / 蓝紫渐变 / 假功能 / 网页缩进手机
- success_condition: 3秒理解是刻印工具；不看提示走完查字→布稿→钤印→留谱；钤印一次后愿再钤比较

## Critic 评估结果

- Contract Fidelity: FULL
- Issues: 0 CRITICAL, 0 MAJOR, 1 MINOR（首页头部插画+标语略偏 banner 倾向，但视觉中心是印床石章、无搜索框/问候语/分类图标/横滑推荐，不构成模板）
- 无需 Repair

## Quality Gate

- CRITICAL: 0 → **PASS**

## Memory Fingerprint

- id: 2026-08-20-phone-001
- form_factor: 微信小程序
- spatial_model: seal_bed_workbench_centered + thread_bound_album_grid
- primary_interaction: long_press_stamp_pressure_tier_seal_print
- visual_material: rice_paper_cinnabar_seal_stone
- color_logic: rice_white_cinnabar_ink_tianhuang_stone_grey
