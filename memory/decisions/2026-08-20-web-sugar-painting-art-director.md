# Art Director Decision Log — 2026-08-20 V1 Web

## 当天随机主题
民间街头手艺（folk street craft）。随机抽取，未指定具体门类，由候选竞争决定。

## 历史语境（web.json 共 40 条指纹）
- 近期题材密度：传统中式工艺/器物/档案占绝对多数（电报/蓝晒/古琴/奇普/铜人/翻牌钟/灯塔/星谱/围棋/索道/甲骨……），古代科技仪器与纸本水墨木色为主流。
- 交互词汇表已用：拖拽（时间游标/光束/水位/抽屉/操纵杆/标尺/琴弦）、纵向下潜、横向长卷、点击波至、敲击电键、翻牌、拨绳、按压灼烧、步进回放、转盘年/物候。**未出现：徒手自由画线（一笔画）。**
- 配色已密集：宣纸米+墨+朱砂、深靛夜空、黄铜钢灰、夯土骨白。**大理石纹白+液态焦糖琥珀+铜未出现。**
- pattern_stats：web 各维度压力全部 LOW（recent_20 ≤ 1）。freehand_draw 在 interaction 维度零记录。

## 5 个正交候选

```json
{
  "candidates": [
    {
      "id": "A",
      "motif": "糖画摊·铜勺琥珀一笔画",
      "concept_statement": "整站就是一张糖画摊：大理石板为案，铜勺盛着炭炉上化开的糖稀，用户转草靶转盘定题，执勺以一笔不断的手势浇出糖画——糖线当面从炽亮液态冷却成琥珀固体，铲起上草靶收藏",
      "visual_source": "成都街头糖画摊：大理石板、铜勺铜锅、炭炉、麦秆草靶、木转盘十二生肖",
      "spatial_model": "stall_workbench_fixed_stage（摊位工作台固定舞台+左侧转盘+右侧糖谱档案，单屏聚焦）",
      "primary_interaction": "freehand_draw_molten_sugar_single_stroke（按压拖动徒手绘糖，线宽随手速变化，断笔即失败重来）",
      "signature_moment": "冷却成画——炽亮糖线光泽扫过凝固为透亮琥珀，竹签压上，铲刀起糖时糖画轻微弯曲离板",
      "color_logic": "大理石白(案台)+焦糖琥珀(糖，随温度由亮橙转深珀)+铜(器具)+麦秆黄(草靶)+炭红微光(炉火，仅状态语义)",
      "typography_logic": "手写感榜书标题（幌子招幡）+宋体正文+等宽编号（糖谱条目）",
      "material_logic": "糖（半透明/光泽/脆）与石（哑光/纹脉）与铜（高光）三种材质贯穿全站",
      "motion_language": "液态物理：糖线流动光泽、冷却渐变、蒸汽上升、转盘惯性、铲起弹性弯曲",
      "novelty_score": 9,
      "fit_score": 10,
      "execution_risk": "MEDIUM",
      "risk_reason": "6-8 个一笔画 SVG 引导路径需手工编排；徒手绘糖的线宽/光泽渲染需 canvas 精细调校",
      "pattern_collisions": ["转盘与 phenology_wheel 同为旋转选择器（LOW 压力）——justification：木转盘抽签是糖画摊的标志性真实道具与行业规矩（'转到什么画什么'），是题材内在组件非装饰"]
    },
    {
      "id": "B",
      "motif": "锔瓷·金刚钻修复局",
      "concept_statement": "碎瓷碗在案上，用户持金刚钻沿裂缝定点打孔、嵌铜锔钉、敲平，'没有金刚钻别揽瓷器活'",
      "visual_source": "民国锔瓷挑子：青花碎瓷、金刚钻弓、铜锔钉、小锤",
      "spatial_model": "workbench_topdown_repair",
      "primary_interaction": "click_drill_points_along_crack_place_staples",
      "signature_moment": "裂缝两侧锔钉逐个咬合，碎碗重新盛水不漏",
      "novelty_score": 8,
      "fit_score": 8,
      "execution_risk": "MEDIUM",
      "risk_reason": "裂缝 SVG 生成与锔钉法向对齐计算较繁",
      "pattern_collisions": ["workbench_topdown 与 08-19 前某作同为俯视案台（all_time=1 LOW）"]
    },
    {
      "id": "C",
      "motif": "竹编·经纬篾席",
      "concept_statement": "平面篾席上用户逐根穿篾，挑一压一的经纬交错中万字纹逐渐浮现",
      "visual_source": "竹编作坊：青篾黄篾、刮刀、绷架",
      "spatial_model": "flat_weave_plane_expanding",
      "primary_interaction": "interlace_strip_over_under_weave",
      "signature_moment": "编至中段纹样突然可读——万字纹从乱篾中显现",
      "novelty_score": 8,
      "fit_score": 8,
      "execution_risk": "HIGH",
      "risk_reason": "挑压状态机×视觉层级（上下叠压光影）实现复杂，移动端操作精度差"
    },
    {
      "id": "D",
      "motif": "面塑·捏面人彩台",
      "concept_statement": "旋转台座上彩色面团，用户捏、搓、剪、点塑出孙大圣",
      "visual_source": "面人挑子：彩色面团、竹刀、拨子",
      "spatial_model": "rotating_pedestal_stage",
      "primary_interaction": "pinch_sculpt_color_layer",
      "novelty_score": 7,
      "fit_score": 7,
      "execution_risk": "HIGH",
      "risk_reason": "2D 表现 3D 捏塑手感几乎不可行；旋转台座与径向轮盘系轮廓相近"
    },
    {
      "id": "E",
      "motif": "吹糖人·一口气塑形",
      "concept_statement": "按压持续吹气，糖泡从糖团中鼓起，在爆裂阈值前塑形为鼠/牛",
      "visual_source": "吹糖人担：炭炉、糖团、木模",
      "spatial_model": "fixed_stall_stage",
      "primary_interaction": "press_hold_blow_inflate_mold",
      "novelty_score": 7,
      "fit_score": 8,
      "execution_risk": "MEDIUM",
      "risk_reason": "与 A 同为糖料材质但交互（长按吹气）较单薄，主题深度不及 A"
    }
  ],
  "ranking": ["A", "B", "E", "C", "D"],
  "selection_reason": "A 以 novelty 9 + fit 10 胜出：徒手绘糖一笔画是全库 40 件作品从未出现的交互动词（freehand_draw zero record），且它就是糖画这门手艺的本体——不是为页面找的交互，是题材自带的交互。B 锔瓷交互新颖但视觉是'修复案台'，与近期器物案台类（制表/铸字/药铺抽屉）轮廓较近；E 同为糖料但交互单薄；C 竹编交互正交但执行风险 HIGH 且平面纹样视觉天花板低；D 捏塑在 2D 中无法成立。",
  "decision_log": {
    "why_selected": "徒手一笔画交互全库零记录；大理石+液态琥珀材质组合全库零记录；浅色亮调作品可平衡近期大量深色系；糖画题材（民间街头手艺）全库首次",
    "why_not_others": "B 案台轮廓近期多；C 执行风险高；D 2D 捏塑不成立；E 交互单薄",
    "accepted_patterns": ["turntable_selector(LOW, justification=行业真实道具)"]
  }
}
```

## Design Contract（锁定 A）

见 runs/2026-08-20-web-sugar/design_contract.md

## 状态：待 Designer 实现
