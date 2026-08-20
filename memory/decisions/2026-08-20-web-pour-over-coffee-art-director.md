# Art Director Decision Log · 2026-08-20 V1 Web · 手冲咖啡冲煮

## 5 候选（正交）

| ID | motif | spatial_model | primary_interaction | novelty | fit | risk |
|----|-------|---------------|---------------------|---------|-----|------|
| A | 手冲咖啡注水萃取曲线 | horizontal_extraction_curve_spine + fixed_pour_cone | pulse_pour_drive_bloom_drip_curve | 9 | 9 | LOW |
| B | 矿物颜料水飞沉降分色 | vertical_settling_column_gravity_sort | stir_settle_draw_off_shade_ladder | 8 | 8 | MEDIUM |
| C | 树轮年代学径向扫描 | radial_ring_scan_outward | drag_scan_radius_ring_width_climate | 7 | 8 | MEDIUM |
| D | 植物蓝染浸染氧化显色 | vertical_dye_vat_depth + dip_count_shade | lower_raise_fabric_oxidize_green_to_blue | 7 | 7 | MEDIUM |
| E | 手工造纸抄造 | horizontal_vat_dip_lay | dip_lanform_sheet_press_dry | 7 | 7 | MEDIUM |

## 排序
A > B > C > E > D

## 选择：A 手冲咖啡注水萃取曲线

### why_selected
- **新颖性最高**：咖啡/饮品冲煮领域在 53 件历史 web 中 0 次出现；horizontal_extraction_curve_spine（时间×液量×浓度曲线为横向时间脊）空间模型未在 registry 出现。
- **适配度最高**：闷蒸膨胀、滴落、浓度曲线、风味轮全部咖啡专属，内容不可替换性强。
- **执行风险最低**：注水物理因果关系清晰，canvas+SVG 纯 vanilla 可实现，无抽象沉降/径向碰撞。

### why_not_others
- B 沉降为被动等待，交互不够主动；石绿调与近期 ink_green/water_green 有色相近邻风险。
- C 径向扫描与物候环 radial_wheel 轮廓近邻，scan 操作易混淆。
- D 蓝色调触碰"禁蓝紫渐变"红线，dip 仍偏被动。
- E 抄纸 dip 与染浸结构近邻，差异化不足。

### accepted_patterns
无 SATURATED 模式。horizontal_extraction_curve_spine 为全新登记。

## Pattern Collisions
无高重复模式。fixed_pour_cone 属"固定舞台"族，但近期固定舞台多为 stall/dome/wall/cylinder，pour_cone 滤杯形态与互动（注水液面+滴落）显著不同，不构成轮廓重复。

## Design Contract

### Core Idea
手冲咖啡冲煮过程空间化——玻璃滤杯为固定视觉中心，注水萃取曲线（时间×液量×浓度）为横向时间脊；用户分次脉冲注水驱动整杯冲煮：闷蒸膨胀、滴落、浓度曲线实时绘制，风味轮（酸/甜/苦/醇厚）随萃取区段显色联动。设计观点："咖啡是手艺也是测量"——温热有机的厨房静物质感（滤纸/玻璃滤杯/木托盘/咖啡液）与精密实验室色谱测量层（网格刻度/等宽数字/曲线）并置。

### Experience Goal
用户通过亲手注水，直观理解萃取如何从"萃取不足→黄金区→过萃"演变，风味如何随之改变。

### Must Keep
1. 注水是唯一输入，分次脉冲注水（含首次闷蒸）
2. 闷蒸膨胀隆起、表面冒细密CO₂气泡、缓缓塌陷——真实物理表现
3. 滴落+浓度曲线实时绘制为横向时间脊，可沿曲线回看任意时刻风味状态
4. 风味轮（酸/甜/苦/醇厚）随萃取区段显色联动
5. 温热静物质感 + 色谱网格测量层并置的双线视觉语言
6. ≥12 个咖啡物理动效（注水柱/液面/滴落溅起/闷蒸气泡/曲线stroke/风味轮填充/水滴光标/蒸汽/研磨粒/温度针/滴速脉冲/滤杯倾角）
7. 自定义水滴光标，开页居中，高对比，层级最高
8. 纯 vanilla 单文件

### Must Not Regress To
- 通用咖啡品牌 Landing Page
- 卡片网格 / Bento
- 蓝紫渐变
- 后半段质量下降
- 把萃取曲线做成纯装饰背景而非可回看的导航脊

### Primary Interaction
长按/拖拽注水 → 滤杯液面上升 → 闷蒸膨胀冒泡 → 滴落 → 浓度曲线沿时间脊绘制；可沿曲线拖动游标回看任意时刻的液量/浓度/风味状态。

### Motion Language
液体物理（注水柱、液面、滴落溅起、闷蒸气泡上升）+ 色谱测量（曲线 stroke 绘制、网格刻度、风味轮分段填充）+ 有机细节（蒸汽、研磨粒）。所有动效服务"手艺×测量"双线，禁整图缩放 Ken Burns。

### Signature Moment
闷蒸——首次注水后咖啡粉层膨胀隆起、表面冒出细密 CO₂ 气泡、缓缓塌陷。手冲最标志性的瞬间。

### Success Condition
- 注水可真实改变液面/滴速/曲线/风味轮
- 闷蒸可观察
- 曲线可回看
- 删动画后静物构图与测量信息仍成立
- 灰度下信息层级行
- 轮廓与近期 53 件不重复
- 纯 vanilla 单文件无白屏

### Technical Boundary
纯 vanilla 单文件 HTML，无 React/Babel/CDN；canvas + SVG；响应式（1440/1024/768/390）；prefers-reduced-motion 降级；RAF 随可见性暂停、卸载取消；快速操作不叠加定时器；高频鼠标事件直接操作 DOM。
