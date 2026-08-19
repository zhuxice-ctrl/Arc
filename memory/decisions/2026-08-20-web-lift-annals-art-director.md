# Art Director Decision Log — 2026-08-20 V1 Web · 升降之间

## 历史语境
- 今日（08-20）已产出 10+ 件 web：糖画摊（徒手绘糖）/街机考古（刷扫除尘）/风筝（收放线）/汉字缩放（滚轮调焦）/菜市一日（滚动时间叙事）/盐田（拖日轨）/竹编（经纬穿梭）/锔瓷（裂纹铆合）/蜂巢（六边形花期轴）/冰晶晕象仪（冰晶取向拨杆）。
- 饱和：传统中式工艺、纸墨朱砂、横向长卷、纵向下潜、固定舞台控制台、拖拽揭示、径向轮盘。
- 全库零记录：建筑纵剖+电梯井道导航、半月表盘指针召梯交互、Art Deco 水磨石/玻璃砖材质。

## 5 个正交候选

| ID | motif | spatial_model | primary_interaction | visual_source | novelty | fit | risk |
|----|-------|---------------|--------------------|---------------|---------|-----|------|
| A | 老公寓百货·指针电梯垂直漫游 | elevator_shaft_building_section | drag_dial_pointer_call_lift_inertia_ride | art_deco_terrazzo_glassbrick_brass | 9 | 9 | MEDIUM |
| B | 连环画小人书翻页阅读器 | book_spread_page_flip | corner_drag_page_turn | lithograph_sepia_print | 7 | 8 | LOW（纸墨系饱和） |
| C | 电话交换台插塞接线 | switchboard_jack_matrix | plug_cord_connect_circuit | bakelite_brass_cord | 8 | 8 | MEDIUM（面板矩阵近柜墙） |
| D | 绿皮火车卧铺车厢夜行 | rail_car_section_night | berth_click_light_sway | train_green_leather_lamp | 6 | 8 | LOW（近横向长卷/纵剖系） |
| E | 城市地下管网剖面 | underground_utility_descent | scroll_descend_pipe_layers | concrete_pipe_cable | 5 | 7 | LOW（下潜系饱和） |

## 排序与选择
ranking: [A, C, B, D, E]
- 选中 **A**：电梯井道即楼层导航是题材本体（通过可替换性测试）；半月表盘指针召梯交互全库首次；Art Deco 水磨石/玻璃砖/黄铜材质与今日全部作品配色互斥；竖向但非"下潜叙事"——轿厢是移动取景框，方向可上可下。
- why_not_others：B 纸墨饱和；C 面板矩阵轮廓与柜墙索引相邻（作 Restart 备选）；D/E 撞已有空间系。
- accepted_patterns：无 SATURATED/HIGH 模式使用。vertical 方向 justification：电梯是唯一天然载体，机制（可上可下的移动取景框+召梯状态机）与下潜系（单向 scroll）完全不同。

## Design Contract（摘要）
- core_idea：整站=一栋六层民国 Art Deco 百货大楼纵剖，中央电梯井道贯通，半月黄铜指针表盘为唯一导航；拨指针/按楼层钮召梯，轿厢带惯性升降、到站铃、铁栅拉门开启揭示该层业态与档案。
- must_keep：井道+轿厢移动取景框；半月表盘可拖指针（阻尼+档位吸附）；铁栅拉门开合转场；6 层真实业态内容（大堂洋货/绸布/钟表眼镜/文具书籍/理发照相/屋顶花园）+上海四大百货真实史料；水磨石灰绿+奶油+铁灰+暖灯黄+少量霓虹朱红；黄铜指针光标居中初始化；≥12 组件级动效；纯 vanilla 单文件无 CDN。
- must_not_regress_to：landing page / 卡片网格 / 蓝紫渐变 / 单向 scroll 下潜 / 纸墨朱砂。
- success_condition：不开滚动条即可完成全楼六层浏览；指针拖动→轿厢运行→到站→开门链路全程有机械反馈；每层档案与该层场景联动。
