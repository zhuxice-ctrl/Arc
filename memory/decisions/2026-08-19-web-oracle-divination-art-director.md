# Art Director Decision Log — 2026-08-19 V1 Web

## 历史语境（web.json 共 38 条指纹）
- 近期题材高度集中于：传统印刷（活字/年画/铸字×2）、戏曲戏台（皮影/木偶）、档案索引（百子柜/档案×n）、长卷/剖面滚动、径向轮盘/祭坛、仪器图纸。
- 交互词汇表已被使用：横向拖拽、纵向下潜、拨轮、拨珠、拖抽屉、拖操纵杆、拖水位、拖时间游标、击鼓、举牌、按压长按竞价、拨弦、拨绳、翻牌、扫光束。**未出现：灼烧-裂纹因果生成、抛掷、翻阅、徒手画线。**
- 配色近期密集使用：宣纸米+墨+朱砂系、深靛夜空系、黄铜钢灰系。**夯土黄+骨白+焦黑兆纹未出现。**

## 5 个正交候选

```json
{
  "candidates": [
    {
      "id": "A",
      "motif": "殷墟甲骨灼兆占卜台",
      "concept_statement": "整站是一座固定的贞人祭坛，用户执灼锥灼烧骨版钻凿处，兆纹当面迸裂生长，贞人据兆占断并刻辞——灼→裂→断的因果链即占卜本身",
      "visual_source": "殷墟祭祀坑夯土、牛肩胛骨/龟腹甲、青铜灼锥、朱砂填刻",
      "spatial_model": "fixed_ritual_altar_stage（固定祭坛+右侧卜辞档案+底部五骨索引，单屏无滚动）",
      "primary_interaction": "drag_poker_to_hollow_press_hold_heat_crack_branching_growth",
      "signature_moment": "兆纹当面迸裂生长→「王占曰」判词朱砂填入",
      "color_logic": "夯土黄(空间)+骨白(圣物)+焦黑(兆纹/文字)+朱砂(占断/印章)+灼橙(热力)",
      "typography_logic": "宋体标题（碑刻感）+楷体卜辞+无衬线释文+等宽编号",
      "material_logic": "夯土/骨/灼痕/朱砂贯穿全站",
      "motion_language": "热呼吸蓄能+裂纹dashoffset分叉生长+骨面微颤+朱砂填入",
      "novelty_score": 9,
      "fit_score": 9,
      "execution_risk": "MEDIUM",
      "risk_reason": "五套兆纹SVG路径需手工编排；蓄热-裂纹时序需精确",
      "pattern_collisions": ["fixed_stage 系近20出现4次(MEDIUM压力)——justification：灼兆是聚焦单一骨版的因果仪式，滚动无法承载蓄热-迸裂的因果聚焦，固定祭坛是功能必需非审美选择"]
    },
    {
      "id": "B",
      "motif": "投壶礼宴",
      "concept_statement": "庭院宴席固定舞台，拖拽抛物线投竹矢入青铜壶，依《投壶新格》算筹计分",
      "visual_source": "《礼记·投壶》、司马光《投壶新格》、青铜壶与竹矢",
      "spatial_model": "courtyard_banquet_stage",
      "primary_interaction": "drag_arc_projectile_throw",
      "signature_moment": "矢入壶口筹码翻转计分",
      "novelty_score": 8,
      "fit_score": 8,
      "execution_risk": "MEDIUM",
      "risk_reason": "抛掷物理手感调优成本高；宴席舞台构图与固定戏台系轮廓相近",
      "pattern_collisions": []
    },
    {
      "id": "C",
      "motif": "连环画翻阅台",
      "concept_statement": "一盏台灯一张翻阅台，小人书逐页翻看，放大镜细读画面细节",
      "visual_source": "1960年代连环画小人书、牛皮纸封面、装订线",
      "spatial_model": "book_page_flip_reader",
      "primary_interaction": "page_flip_loupe_inspect",
      "signature_moment": "翻页纸面弯曲+灯下阴影",
      "novelty_score": 7,
      "fit_score": 7,
      "execution_risk": "LOW",
      "risk_reason": "翻阅为单一手势，交互厚度不足，易沦为图片查看器",
      "pattern_collisions": []
    },
    {
      "id": "D",
      "motif": "糖画转盘摊",
      "concept_statement": "俯视大理石板工作台，转生肖转盘后执铜勺以糖稀徒手画线，起糖插签",
      "visual_source": "街头糖画摊、铜勺糖稀、大理石板",
      "spatial_model": "topdown_workbench",
      "primary_interaction": "drag_draw_sugar_line",
      "signature_moment": "糖线冷凝由亮转哑",
      "novelty_score": 7,
      "fit_score": 8,
      "execution_risk": "MEDIUM",
      "risk_reason": "俯视工作台轮廓与08-19活字印刷工作台(batch8)相近",
      "pattern_collisions": ["workbench_topdown_three_zone 近10已出现1次——轮廓风险"]
    },
    {
      "id": "E",
      "motif": "票证收藏册",
      "concept_statement": "1955-1993粮票布票票证册，翻页+抽出票根细看套色印刷细节",
      "visual_source": "计划经济票证、套色雕版印刷、公章",
      "spatial_model": "album_page_index",
      "primary_interaction": "flip_page_pull_coupon",
      "signature_moment": "票根抽出时光影",
      "novelty_score": 6,
      "fit_score": 7,
      "execution_risk": "LOW",
      "risk_reason": "档案索引轮廓与百子柜/档案系高度同质",
      "pattern_collisions": ["cabinet_wall_index/archive 系近20密集出现——HIGH 回避"]
    }
  ],
  "ranking": ["A", "B", "C", "D", "E"],
  "selection_reason": "A 的交互机制（灼烧-裂纹因果生成）在 38 条历史指纹中完全缺席，且机制与题材因果同构——灼→裂→断不是装饰，就是占卜本身；夯土+骨白+焦兆配色全新。B 抛掷机制同样新颖但宴席舞台轮廓与固定戏台系过近；C 交互单薄；D/E 轮廓撞车。",
  "decision_log": {
    "why_selected": "A：novelty 9 + fit 9，机制-题材因果同构，配色材质全新",
    "why_not_others": "B轮廓近似戏台系；C交互薄；D撞活字工作台；E撞档案索引系",
    "accepted_patterns": ["fixed_ritual_altar_stage(MEDIUM压力,功能性理由成立)"]
  }
}
```

## 落选存档
- B 投壶礼宴：抛掷物理+算筹计分有潜力，留存为未来候选；本轮因轮廓近似弃选。
