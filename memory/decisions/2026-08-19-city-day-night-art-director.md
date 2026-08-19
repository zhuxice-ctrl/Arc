# 2026-08-19 Art Director 决策日志（V1 web · 城市日与夜·双轨平行阅读）

## 当天差异化判断
今日（8-19）web_mock 已入库 30+ 版。饱和方向：传统中式工艺（大运河/制表/活字/年画/廊桥/日晷/算盘/药铺/游廊/茶焙/茶马/窑火/调香/金鱼/鼓声/皮影/蜀道/提线/物候环）、纸本水墨木色配色、拖拽揭示主交互、scroll-descent 叙事、固定舞台、径向轮盘、横向单脊柱+滑动驱动（今日 ≥5 版：牵星/地震波/光污染尺/羽翼航线/轮渡）。
→ 本轮刻意避开「传统工艺」「纸本水墨/黄铜/深空/海图蓝」「横向脊柱+滑动」「拖拽揭示」「垂直下潜」「径向轮盘」「固定舞台」「节点图」全部饱和方向，转向**现代城市 Editorial 双轨对照**题材，空间模型用**分屏同步双轨**（全库零），主交互用**同步滚动+可拖拽昏分线**。

## V1 候选方向（5 个正交 motif）

| ID | motif | visual_source | spatial_model | primary_interaction | 状态 |
|----|-------|---------------|---------------|---------------------|------|
| A | 盐田色谱·浓度梯度彩池 | 盐田航拍彩池+卤水浓度生态 | top_down_concentration_gradient_grid | scrub_concentration_axis_ecology_shift | 弃（grid 易退化为数据平台；scrub≈近期 ruler 交互） |
| B | **城市日与夜·双轨平行阅读** | 城市摄影双联画+报纸双栏对版+昼夜天际线 | split_screen_sync_dual_track | scroll_synced_dual_track + drag_dusk_divider | **选中** |
| C | 沿海灯塔·光质节奏 | 灯塔光质(组闪/明灭/等明)+海图 | coastline_horizon_beacon_nodes | watch_realtime_flash_rhythm | 弃（map-ish；深色海图配色 SATURATED） |
| D | 钟楼·编钟报时共振 | 钟楼剖面+编钟+铸造 | vertical_tower_stack_bells | trigger_bell_strike_resonance | 弃（青铜/铸铁配色撞 brass；垂直塔≈垂直剖面） |
| E | 沉船水下考古·声呐揭示 | 水下考古+声呐+沉积层 | depth_descend_to_wreck | descend_dive + click_artifact_recover | 弃（深水暗色 SATURATED；下潜≈垂直 descent） |

## 选择理由（novelty / fit / execution_risk）

**选中 B 城市日与夜·双轨平行阅读**：
- **novelty_score=9**：空间模型 `split_screen_sync_dual_track`（分屏同步双轨）全库零——与近期横向脊柱/垂直下潜/径向轮盘/固定舞台/节点图/顶层抽屉全部正交；主交互 `scroll_synced_dual_track + drag_dusk_divider`（同步双轨滚动+可拖拽昏分线）全库零。
- **fit_score=9**：昼夜二元性是题材内在结构（不是装饰）——直接驱动分屏布局、同步滚动逻辑、内容对位、两侧配色、字体对照（清醒 vs 发光）、昏分线 UI、日月光标。删掉动画双栏对位阅读仍成立。
- **execution_risk=低**：CSS grid 双栏 + 滚动监听 + 拖拽改 grid-template-columns 比例 + 街灯 opacity 序列 + SVG 天际线，纯 vanilla 完全可控；无外部图片依赖（CSS/SVG 自绘）。
- **配色正交**：暖象牙#F4E8D6+赤陶#C75B3C vs 深青绿#0E2A28+钠光琥珀#E8A33D——高对比双色调，禁蓝紫、禁纸本水墨、禁深空琥珀、禁海图蓝、禁黄铜，与今日全部 palette 拉开。钠光琥珀为横跨昼夜唯一桥接色。
- **真实内容丰富**：7 对真实城市速写场景（菜场早市/烧烤摊、地铁/代驾、写字楼/便利店、外卖/网约车、太极/广场舞、放学/环卫、晚高峰/早班），气味/声音/光线/人物动作，无 Lorem Ipsum。

## pattern_collisions 处理
- 所选 spatial_model / primary_interaction / visual_material / color_logic 均为全库零重复，无 SATURATED。
- 滚动驱动：scroll 作为同步双轨的载体（非主交互本身），主交互是「同步双轨 + 可拖拽昏分线」，与近期单一脊柱滑动本质不同。

## 弃用候选理由
- A 盐田：top-down grid 易退化为数据平台（违反 web.md 反平台）；scrub 浓度轴≈近期 ruler 交互（光污染尺/星密度尺）。
- C 灯塔：coastline map-ish 近 flyway；深色海图配色 SATURATED（深空/海图蓝）。
- D 钟楼：青铜铸铁配色撞 brass；垂直塔剖面≈ mycelium 垂直剖面。
- E 沉船：深水暗色 SATURATED；下潜交互≈ vertical descent。

## Design Contract（锁定，见作品目录设计规范.md）
核心：分屏同步双轨为唯一空间模型；可拖拽昏分线驱动两侧比例；黄昏交叉时刻街灯逐盏点亮签名动效；7 对真实对位城市场景；暖象牙/赤陶 vs 深青绿/钠光琥珀配色（禁蓝紫）；自定义日月光标开页居中；纯 vanilla 单文件。

## 流水线结果
- Designer：忠实实现，14 项动效，自定义日月光标，7 对真实场景，纯 vanilla 单文件 57.6KB。
- Browser QA：PASS（1440px/390px 均 0 console 错误、0 失败请求；昏分线拖拽✓、滚动✓；横向溢出 1px 亚像素 MINOR；截图非空白 564KB）。
- Critic：Contract Fidelity = FULL；无 CRITICAL/MAJOR。
- Quality Gate：PASS。
- Memory Writer：指纹已追加 web.json（第 31 条），pattern_stats 已更新。
