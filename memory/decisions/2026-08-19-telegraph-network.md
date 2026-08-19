# 2026-08-19 Art Director 决策日志（V1 web · 电报网络·摩尔斯收发局）

## 当天差异化判断
今日（8-19）web_mock 已入库 30+ 版，题材密度集中在：传统中式工艺（大运河/制表/活字/年画/廊桥/日晷/算盘/药铺/游廊/茶焙/茶马/窑火/调香/金鱼/鼓声/皮影/蜀道/提线/物候环）、纸本水墨木色配色、拖拽主交互、scroll-descent 叙事、固定舞台、径向轮盘、**横向单脊柱+滑动驱动**（今日已 ≥5 版：牵星/地震波/光污染尺/羽翼航线/轮渡）。
→ 本轮刻意避开「传统工艺」「纸本水墨」「横向脊柱+滑动」「拖拽揭示」全部饱和方向，转向**近代工业通信**题材——清末民初电报网络，主交互用**敲击电键编码摩尔斯**（全库零），空间模型用**电报网络节点图**（非脊柱/非滚动/非轮盘）。

## V1 候选方向（5 个正交 motif）

| ID | motif | visual_source | spatial_model | primary_interaction | 状态 |
|----|-------|---------------|---------------|---------------------|------|
| A | **电报网络·摩尔斯收发局** | 1871大北公司海底电缆+清末电报局网络+黄铜电键+电报纸带 | network_graph_node_link | tap_key_encode_morse_travel_pulse | **选中** |
| B | 古琴减字谱读谱台 | 减字谱手卷+七弦十三徽+指法字 | score_strip_string_alignment | step_fingering_highlight_string | 弃（音乐谱近声之形；纸本水墨SATURATED） |
| C | 城市行道树普查档案 | 行道树普查铭牌+树冠投影+街区方格地图 | city_block_grid_index | type_filter_species_season | 弃（筛选索引易退化为工具平台，违反web反平台） |
| D | 银盐暗房显影盘 | 红光暗房+显影盘+银盐相纸+放大机底片 | darkroom_tray_progressive_develop | rock_tilt_tray_reveal_image | 弃（渐进显影需真实源图，单文件实现风险高） |
| E | 铜版蚀刻压印工坊 | 铜版+蚀刻针+酸浴+压印机 | etching_plate_zoom_carve | drag_needle_carve_then_ink_press | 弃（拖拽刻线=近期饱和拖拽交互；铜色近黄铜撞A） |

## 选择理由（novelty / fit / execution_risk）

**选中 A 电报网络·摩尔斯收发局**：
- **novelty_score=9**：主交互 `tap_key_encode_morse_travel_pulse`（敲键编码摩尔斯，脉冲沿线路行进）全库零——与近期全部 drag/scroll/click-reveal/键盘攀爬正交；空间模型 `network_graph_node_link`（电报网络节点图）非水平脊柱、非滚动叙事、非径向轮盘、非固定舞台，全库零重复。
- **fit_score=9**：电报的本质就是「电键+铜线+电报局」三要素；网络节点图是题材内在空间结构，不是装饰；敲键编码摩尔斯是电报唯一真实操作方式。
- **execution_risk=中低**：SVG 绘网络图与线路路径 + requestAnimationFrame 驱动脉冲沿线行进 + 摩尔斯编解码逻辑 + 纸带匀速上移烙印，纯 vanilla 可控。
- **配色正交**：石墨灰#1E2226 + 黄铜#C8923E + 信号朱#D6453A + 电报纸米#EDE4D3——工业金属系，禁蓝紫、禁纸本水墨、禁深空琥珀、禁海图蓝，与今日全部 palette 拉开。
- **真实内容丰富**：津沪线(1881,3075里)/大北公司海底电缆(1871)/台湾线(1877,丁日昌)/四码电报/电报等级与资费/≥8真实电报局地名。

## pattern_collisions 处理
- brass(黄铜)：visual_material last_20≈2 → MEDIUM。justification：电报电键/发报机物理材质本就是黄铜，属功能理由（非审美）。整体 palette 用石墨+信号朱+电报纸米，与既有 brass_steel_silver_cream、navy_copper 区分。
- 其余所选 spatial_model/interaction 均为全库零重复，无 SATURATED。

## 弃用候选理由
- B 古琴：音乐谱近声之形；纸本水墨配色 SATURATED。
- C 行道树：筛选索引空间易退化为工具/数据平台，违反 web.md「反平台」「非工具罗列」。
- D 暗房：渐进显影需要一张真实可显影的源图，单文件无外部图风险高，fit-execution 平衡差。
- E 铜版：拖针刻线属近期饱和的 drag 交互；铜色与黄铜撞 A，差异不足。

## Design Contract（锁定，见正文）
核心：电报网络节点图为主体空间；黄铜电键敲击编码摩尔斯为唯一核心交互；脉冲沿线行进+纸带烙印+对端解码三段联动签名动效；真实清末民初电报史内容；工业石墨/黄铜/信号朱配色；纯vanilla单文件；自定义黄铜环光标。
