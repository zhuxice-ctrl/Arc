# Art Director Decision Log — 2026-08-20 V1 Web（第七件）

## 当天随机主题
传统竹编（篾匠工艺）。随机抽取，全库零记录。

## 历史语境
- web.json 46 指纹；今日已产出 6 件：糖画摊（徒手绘糖）、街机考古（刷扫除尘）、风筝（收放线张力）、汉字缩放（滚轮调焦潜入）、菜市时辰志（滚动时间叙事）、盐田（拖日轨蒸发）。
- 交互已用：徒手绘制、刷扫、拖拽（游标/水位/抽屉/操纵杆/标尺/琴弦/日轨/木耙）、纵向下潜、横向长卷、敲击、翻牌、拨绳、灼烧按压、步进回放、转盘、收放线、滚轮缩放、滚动驱动。**未出现：经纬穿梭编织（interlace 挑压状态机）。**
- 空间模型已用密集：固定舞台、纵向下潜、横向长卷、径向轮盘、柜墙索引、控制台、俯视工作台、网格探方、天空高度轴、连续缩放、编辑式时间叙事、俯瞰田块。**未出现：经纬交织平面（编织面即内容即导航）。**
- 配色已密集：米纸墨朱砂、深靛夜空、黄铜、焦糖琥珀、牛皮纸磷光绿、天青麦秆、深墨蓝灯光、蒸发藻绿藻粉。**竹青+篾黄+桐油+瓷白（暖绿黄调）未出现。**

## 5 个正交候选

- A「经纬之间·活的编织面」：俯视竹编编织面为唯一主空间，点击/拖动纬篾穿梭于经篾挑压之间逐行生长，挑压规则真实（十字编/人字编/六角眼），纹样即导航——每种编法完成即解锁一件真实器物档案（瓷胎竹编茶壶/东阳六角眼提篮/嵊州竹编），锁边后平面卷立成器。spatial_model=interlaced_weave_plane_as_content_and_nav；novelty 9 / fit 10 / risk MEDIUM
- B「从竹到丝·剖竹工序纵轴」：一根竹子纵剖面长轴滚动推进刮青→分片→起层→刮篾→抽丝十二道工序。撞 continuous_vertical_cross_section（森林剖面）与纵向下潜系，novelty 5 / fit 8 / risk LOW
- C「六角眼穹窿·编织结构实验室」：3D 视角从平面到曲面成器、参数化看受力。仪器/实验室系撞 engineering_blueprint 与 console 系，3D 实现风险 HIGH，novelty 6 / fit 7 / risk HIGH
- D「纹样谱系·竹编纹档案馆」：纹样网格索引墙点击看挑压图解逐步演示。撞 cabinet_wall_index（中药柜）+ fixed_board_step_replay（围棋打谱），novelty 4 / fit 8 / risk LOW
- E「篾匠一日·工坊时辰志」：工坊从开料到收工的一天。与今日菜市时辰志 editorial_time_narrative 同日撞型，novelty 3 / fit 7 / risk LOW

## Novelty Check（候选 A）
- closest_matches：workbench_topdown_three_zone（活字印刷，similarity 0.31——同为俯视但编织面是连续交织内容非三区工作台）、rope_array_vertical_curtain（印加奇普，similarity 0.28——单向垂帘绳列 vs 正交织经纬）
- high_risk_patterns：无（全库 interlace 交互零记录）
- recommendation：PROCEED

## 选择
ranking: A > C > B > D > E。锁定 A。

- why_selected：interlace 挑压交互全库零记录且是竹编的本体动作（无挑压不成编）；「编织面即内容即导航」空间模型零记录；题材全库首次；竹青篾黄暖绿黄调平衡今日深色/高饱和作品；挑压规则自带真实内容深度（纹样数术+器物档案），题材不可无脑替换。
- why_not_others：B 撞纵向下潜/剖面系；C 撞仪器实验室系且 3D 风险高；D 撞柜墙索引+步进回放；E 与今日菜市同日撞型。
- accepted_patterns：无 SATURATED/HIGH 模式被接受。

## Design Contract
见 runs/2026-08-20-web-zhubian/design_contract.md（已锁定：俯视编织面唯一主空间 / 纬篾穿梭挑压核心交互 / 三真实纹样+三真实器物 / 锁边卷立成器记忆点 / 竹青篾黄桐油瓷白配色禁蓝紫渐变 / 纯 vanilla 单文件）。

## 状态：待 Designer 实现
