# Art Director Decision Log — 2026-08-20 V1 Web · 八音筒

## 当天随机主题
机械音乐 / 音乐盒（Mechanical Music / Music Box）。随机抽取，全库 50+ web 作品零记录。

## 历史语境
- 今日（08-20）已产出 12 件 web：打铁花/汉字缩放/风筝/盐池/糖画/竹编/菜市/蜂巢/街机/锔瓷/冰晶晕象/电梯。
- 饱和模式：传统中式工艺、纸墨朱砂、横向长卷、纵向下潜、固定舞台控制台、拖拽揭示、径向轮盘。
- 需要完全不同的领域 + 不同的空间模型 + 不同的配色体系。

## 5 候选方向

### A — 八音筒·机械乐谱（Music Box Cylinder Score）
- motif: 机械八音筒的针齿奏乐
- concept: 整站是一只可拖拽旋转的黄铜八音筒，筒面针钉拨动钢梳奏出旋律，筒面展开即乐谱
- visual_source: 19世纪欧洲/日本自动机械八音盒，黄铜筒+钢梳+核桃木底座
- spatial_model: cylinder_stage_with_unrolled_score（3D水平旋转筒体 + 展开面2D乐谱面板）
- primary_interaction: 拖拽旋转筒体，针钉经过钢梳齿触发音符（Web Audio API 实际发声）
- signature_moment: 第一次拖动筒体听到第一个音符响起——意识到自己在"演奏"八音盒
- color_logic: 黄铜金(#B8860B) + 核桃木棕(#2A1810) + 钢灰(#5A6068) + 米纸(#F0E6D2) + 琥珀暖光(#FFA500)
- typography_logic: Georgia衬线标题 + Noto Sans SC正文 + JetBrains Mono音符编号
- material_logic: 黄铜金属光泽+木纹底座+钢梳冷光，暖光投射
- motion_language: 筒体惯性旋转物理 + 针钉接近高亮 + 钢梳齿振动 + 音符涟漪 + 暖光呼吸
- novelty_score: 9
- fit_score: 9
- execution_risk: MEDIUM
- risk_reason: CSS 3D筒体渲染 + Web Audio音符触发 + 筒面展开乐谱同步
- pattern_collisions: 无（rotation轴=筒长轴，非径向轮盘；drag产出声音，非纯视觉揭示）

### B — 旗语电报链（Semaphore Telegraph Chain）
- motif: 19世纪光学电报塔链
- concept: 山脊上一排信号塔，设第一塔臂位，消息沿链逐塔接力传递
- visual_source: 拿破仑时代 Chappe 信号塔，羊皮纸+棕褐+天际线剪影
- spatial_model: horizontal_tower_chain_relay
- primary_interaction: 设臂位编码 → 消息逐塔接力动画
- novelty_score: 8, fit_score: 7, execution_risk: MEDIUM
- 否决理由: 视觉可能偏干，链式动画易单调，情感冲击弱

### C — 吹玻璃熔炉舞台（Glassblowing Furnace Stage）
- motif: 玻璃吹制全过程
- concept: 固定熔炉舞台，吹气/旋转/冷却三步成型
- visual_source: 威尼斯穆拉诺岛玻璃工坊，熔融橙+琥珀+铬黄
- spatial_model: fixed_furnace_stage_transform
- primary_interaction: hold吹气膨胀 + drag旋转塑形 + release冷却定型
- novelty_score: 8, fit_score: 9, execution_risk: HIGH
- 否决理由: CSS/SVG模拟玻璃形变难度极高，效果难保证

### D — 摩氏硬度阶梯（Mohs Hardness Ladder）
- motif: 矿物硬度标作为物理阶梯
- concept: 对角上升阶梯，每级一种矿物，可互相刻划测试
- visual_source: 地质博物馆矿物柜，晶体折射光
- spatial_model: diagonal_staircase_mineral_index
- primary_interaction: 攀登阶梯 + 选矿物刻划测试
- novelty_score: 8, fit_score: 7, execution_risk: LOW
- 否决理由: 偏教科书信息图，情感性不足

### E — 书装缝帧架（Bookbinder's Sewing Frame）
- motif: 手工书装帧缝线过程
- concept: 固定缝帧架，拖针穿过帖眼，线迹交织成书芯
- visual_source: 中世纪修道院装帧坊，麻线+牛皮纸+木架
- spatial_model: vertical_sewing_frame_weave
- primary_interaction: 拖针穿过缝线模式，书芯逐帖成形
- novelty_score: 8, fit_score: 8, execution_risk: MEDIUM
- 否决理由: 视觉可能偏单调（线+纸），与近期纸墨材质重叠

## 排序
A(9/9/MED) > C(8/9/HIGH) > E(8/8/MED) > B(8/7/MED) > D(8/7/LOW)

## 选择：A — 八音筒·机械乐谱

### 选择理由
1. **新颖性最高(9)**: 全库 50+ web 从未结合机械工程+音乐+交互演奏
2. **适配度最高(9)**: 黄铜机械视觉极强，拖拽旋转=演奏的交互天然成立，真实旋律内容丰富
3. **空间模型全新**: cylinder_stage_with_unrolled_score——3D水平筒体旋转+展开面2D乐谱，pattern_stats 零记录
4. **多感官体验**: Web Audio API 实际发声，视觉+听觉双重反馈，超越纯视觉作品
5. **配色完全独立**: 黄铜金+核桃木+钢灰+暖琥珀，与近期纸墨朱砂/冰蓝/青绿全无重叠
6. **执行风险可控**: CSS 3D transforms 做筒体旋转，SVG 做针钉+钢梳，Web Audio 做音符，均为成熟技术
7. **避免饱和模式**: 非中式工艺、非纸墨、非横向长卷、非纵向下潜、非固定舞台控制台、非径向轮盘

### 未选其他的理由
- C 视觉潜力极高但玻璃形变模拟风险过高，一次实现难达标
- E 线+纸视觉偏单调，与近期纸墨材质有重叠
- B 链式动画易单调，情感冲击不足
- D 教科书气质，不够沉浸

## accepted_patterns
- cylinder_stage_with_unrolled_score (新，all_time=0)
- drag_rotate_play_audio (新，all_time=0)
- brass_wood_steel_material (新，all_time=0)
