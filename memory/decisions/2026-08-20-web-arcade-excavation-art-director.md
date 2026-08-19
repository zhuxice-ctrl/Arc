# Art Director Decision Log — 2026-08-20 V1 Web（第二件）

## 当天随机主题
（游戏）街机厅像素考古。随机抽取。

## 历史语境
- 昨日（08-19）全天 30+ 件几乎全部为传统中式工艺/器物/档案题材（糖画/皮影/年画/活字/药铺/算盘/针灸铜人/建盏/调香/古琴/围棋），米纸+墨+朱砂配色体系高度密集。今日第一件为糖画摊（大理石+焦糖琥珀+铜，徒手绘糖一笔画）。
- 交互已用：徒手绘线、拖拽（游标/水位/抽屉/操纵杆/琴弦/标尺）、纵向下潜、横向长卷、敲击、翻牌、拨绳、灼烧、步进回放、转盘。**未出现：刷扫除尘（brush erase）、网格探方索引。**
- 空间模型已用密集：固定舞台、纵向下潜、横向长卷、径向轮盘、柜墙索引。**未出现：俯视考古探方网格+出土登记台账联动。**
- 深色荧光系已有（深渊/荧光真菌/灯塔/星谱），但 CRT 磷光绿+牛皮纸档案的「考古发掘报告」材质组合零记录。

## 5 个正交候选

```json
{
  "candidates": [
    {
      "id": "A",
      "motif": "街机厅遗址考古发掘报告",
      "concept_statement": "整站是一处废弃街机厅遗址的发掘现场档案：俯视探方网格覆盖遗址平面，用户持毛刷光标逐格刷去积尘，出土12台真实街机，每台点亮CRT屏幕并生成出土登记卡汇入台账",
      "visual_source": "田野考古发掘报告：探方网格拉线、牛皮纸档案卡、测绘墨线、出土登记签、毛刷手铲",
      "spatial_model": "excavation_grid_map + ledger_sync（俯视探方网格+台账联动）",
      "primary_interaction": "brush_dust_erase_reveal_machine（按压刷扫除尘，逐格揭示）",
      "signature_moment": "首台出土——积尘刷净后CRT从雪花噪点收敛为开机画面，磷光绿映亮周围探方",
      "color_logic": "卡其牛皮纸(档案)+测绘墨黑(结构)+出土登记红(签章语义)+CRT磷光绿(仅屏幕点亮语义)",
      "typography_logic": "仿宋/宋体档案体标题+等宽编号（考古报告形制）",
      "material_logic": "卡纸档案+墨线测绘+积尘+玻璃CRT四种材质贯穿",
      "motion_language": "刷尘粒子、CRT收敛开机、登记盖章、台账墨迹书写",
      "novelty_score": 9,
      "fit_score": 10,
      "execution_risk": "MEDIUM",
      "risk_reason": "逐格canvas除尘（destination-out）+CRT开机动画需精细调校；12台机台SVG内容量较大",
      "pattern_collisions": []
    },
    {
      "id": "B",
      "motif": "高分榜即全站索引",
      "concept_statement": "整站=一张街机厅高分排行CRT榜，榜单即目录，输入三字母签名打卡，展开条目为机台档案",
      "spatial_model": "ranking_board_as_index",
      "primary_interaction": "sort_rank_input_initials_expand_archive",
      "novelty_score": 8,
      "fit_score": 8,
      "execution_risk": "MEDIUM",
      "risk_reason": "深底磷光绿与近期深色荧光系（星谱/灯塔/索道）轮廓较近"
    },
    {
      "id": "C",
      "motif": "一枚代币的下落旅程",
      "concept_statement": "竖向滚动跟随一枚游戏币：兑换柜台→投币口下落通道→撞针机构→机台点亮",
      "spatial_model": "vertical_coin_drop_scroll",
      "primary_interaction": "scroll_coin_fall_mechanism",
      "novelty_score": 6,
      "fit_score": 8,
      "execution_risk": "LOW",
      "risk_reason": "纵向下潜/坠落模型近期密集（菌丝下潜/蜀道攀降/冰灯深入），轮廓重复风险高"
    },
    {
      "id": "D",
      "motif": "CRT显像管解剖台",
      "concept_statement": "固定舞台拆解CRT：电子枪→偏转线圈→荧光粉，调聚焦旋钮修复花屏",
      "spatial_model": "fixed_stage_deconstruct",
      "primary_interaction": "click_deconstruct_tune_knobs",
      "novelty_score": 5,
      "fit_score": 7,
      "execution_risk": "MEDIUM",
      "risk_reason": "与08-19制表师工坊 fixed_stage_deconstruct_index 直接撞型（last_20=1）"
    },
    {
      "id": "E",
      "motif": "像素分辨率编年尺",
      "concept_statement": "横向时间轴1978-2001，标尺刻度=像素密度进化，滚动穿越街机黄金年代",
      "spatial_model": "horizontal_timeline_ruler",
      "primary_interaction": "scroll_year_pixel_density_change",
      "novelty_score": 5,
      "fit_score": 7,
      "execution_risk": "LOW",
      "risk_reason": "横向标尺/光谱带模型已见（光污染勘测尺/星谱spectral_band），撞型"
    }
  ],
  "ranking": ["A", "B", "C", "D", "E"],
  "selection_reason": "A novelty 9 + fit 10：刷扫除尘交互动词全库零记录且就是'考古'本体动作；探方网格+台账联动的空间模型零记录；牛皮纸档案+磷光绿组合零记录；题材（街机厅/游戏考古）与昨日全天传统工艺序列形成强反差。B 高分榜新颖但深底磷光轮廓与近期深色荧光系接近；C 纵向下潜轮廓密集；D/E 直接撞已有空间模型。",
  "decision_log": {
    "why_selected": "brush_erase 交互零记录、excavation_grid 空间零记录、题材序列反差最大、浅色档案调平衡深色作品",
    "why_not_others": "B 深色荧光轮廓近；C 下潜模型重复；D 撞制表工坊；E 撞勘测尺",
    "accepted_patterns": []
  }
}
```

## Design Contract（锁定 A）

### Core Idea
街机厅遗址考古发掘报告：俯视探方网格即全站唯一主空间，毛刷光标刷扫除尘出土 12 台真实街机，出土即点亮 CRT 并汇入出土登记台账。

### Experience Goal
用户像一名考古队员完成一次小型发掘：从面对一片积尘探方，到逐格揭示、逐台点亮、台账逐行登记，最终达成 12/12 发掘完成。

### Must Keep
1. 俯视探方网格为唯一主空间（4×3，拉线+编号 K01-K12）
2. 毛刷自定义光标，开页居中，按压刷扫真实除尘（canvas destination-out）
3. 12 台真实街机真实年代数据，出土阈值触发 CRT 开机动画
4. 出土登记台账实时联动（编号/名称/年代/类型/完残状况/状态）
5. 卡其档案+墨线+登记红+磷光绿配色，磷光绿仅用于屏幕语义

### Must Not Regress To
1. 竖向 section 堆叠 Landing Page
2. 卡片网格/Bento
3. 蓝紫渐变、通用深色霓虹风

### Primary Interaction
按压拖动毛刷在探方格内刷扫，积尘按笔触真实擦除；单格除尘率超阈值 → 该格 CRT 开机（雪花收敛→荧光亮起→游戏标题像素画面）。

### Motion Language
尘土粒子飞散、CRT 电子束收敛、磷光呼吸、登记章盖落、台账墨迹逐字书写；全部为「考古现场+CRT」语义，禁装饰性特效。

### Signature Moment
首台出土瞬间：积尘散尽，CRT 从雪花噪点收敛为一条亮线再展开为磷光绿开机画面，周围探方格被绿光映亮。

### Success Condition
- 12 格全部可刷、全部可点亮、台账 12 行全部可登记
- 不开动效时：网格/台账/图例信息层级仍完整成立
- 灰度下：已出土/未出土状态仍可区分（靠密度与墨线不靠色相）

### Technical Boundary
纯 vanilla 单文件 index.html，无 CDN/框架/外部字体；RAF 随可见性暂停；prefers-reduced-motion 降级；1440/1024/768/390 四档响应式。

## 状态：待 Designer 实现
