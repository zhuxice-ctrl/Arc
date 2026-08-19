# Art Director Decision Log · 2026-08-20 · V1 Web

## 当日主题（随机抽取）
图书馆 · 书籍 · 汉字（内容型 / Exhibition-Tool 混合）

## 5 个正交候选

```json
{
  "candidates": [
    {
      "id": "A",
      "motif": "bookshelf_wall_sole_index",
      "concept_statement": "整站是一面中图法书架墙，书脊即导航，抽出书脊翻开阅读",
      "visual_source": "深夜图书馆木书架+绿玻璃台灯",
      "spatial_model": "bookshelf_wall_index",
      "primary_interaction": "pull_spine_open_book",
      "signature_moment": "抽书瞬间台灯光随书移",
      "novelty_score": 6,
      "fit_score": 8,
      "execution_risk": "LOW",
      "risk_reason": "书架网格与 cabinet_wall_index(百子柜抽屉) 相邻，轮廓有重复风险",
      "pattern_collisions": ["cabinet_wall_index 邻近——抽屉拉开 vs 书脊抽出，空间骨架同为墙面格子索引"]
    },
    {
      "id": "B",
      "motif": "continuous_scale_zoom_dive",
      "concept_statement": "整站是一次从图书馆大厅到纸纤维的连续缩放潜入，滚轮即显微镜调焦",
      "visual_source": "光学显微镜/显微镜载物台+深夜图书馆台灯光池",
      "spatial_model": "continuous_scale_zoom_dive",
      "primary_interaction": "wheel_or_pinch_continuous_zoom",
      "signature_moment": "从一页纸无缝潜入一个汉字的笔画墨色，墨变成新的夜空",
      "novelty_score": 9,
      "fit_score": 9,
      "execution_risk": "MEDIUM",
      "risk_reason": "多层场景连续缩放的性能与衔接；需克制层数并用 transform+opacity 插值",
      "pattern_collisions": []
    },
    {
      "id": "C",
      "motif": "book_sorting_conveyor_machine",
      "concept_statement": "整站是一台闭馆后运转的图书分拣机，传送带送书，扫描红光分类落格",
      "visual_source": "工业分拣线/钢/传送带/扫描仪红光",
      "spatial_model": "horizontal_conveyor_machine",
      "primary_interaction": "feed_book_watch_sorting_click_bin",
      "signature_moment": "扫描红光扫过书脊条码，格口翻板打开吞书",
      "novelty_score": 7,
      "fit_score": 6,
      "execution_risk": "MEDIUM",
      "risk_reason": "内容深度偏弱，机械装置容易炫技大于内容",
      "pattern_collisions": []
    },
    {
      "id": "D",
      "motif": "single_book_page_turn_reading",
      "concept_statement": "整站就是一本摊开的线装书，滚动/拖拽即翻页，页码即目录",
      "visual_source": "蝴蝶装古籍+书页翻动",
      "spatial_model": "book_spread_page_flip",
      "primary_interaction": "drag_page_corner_flip",
      "signature_moment": "页角掀起时纸背透光看到下一页字迹",
      "novelty_score": 6,
      "fit_score": 8,
      "execution_risk": "MEDIUM",
      "risk_reason": "翻页阅读本质仍是线性叙事，与历史大量 scroll 叙事相邻",
      "pattern_collisions": ["scroll_narrative 家族邻近"]
    },
    {
      "id": "E",
      "motif": "closing_time_floorplan_lights",
      "concept_statement": "整站是图书馆楼层平面图，闭馆广播后各阅览室灯逐盏熄灭，点击亮灯房间进入",
      "visual_source": "建筑平面图/疏散指示绿/夜间应急灯",
      "spatial_model": "floorplan_map_navigation",
      "primary_interaction": "click_lit_room_enter_lights_out_sequence",
      "signature_moment": "整层灯按闭馆顺序熄灭只剩应急出口绿灯",
      "novelty_score": 6,
      "fit_score": 7,
      "execution_risk": "LOW",
      "risk_reason": "平面图导航与 fullscreen_map_as_navigation(候鸟航线) 同族",
      "pattern_collisions": ["fullscreen_map_as_navigation 同族"]
    }
  ],
  "ranking": ["B", "A", "C", "D", "E"],
  "selection_reason": "B 的 continuous_scale_zoom_dive 在 43 条 web 指纹中零出现（无缩放尺度类空间模型），primary_interaction 也是全新的；题材适配度极高——图书馆→书架→书→页→行→字→笔画→纤维是天然的尺度链，内容可全部真实（中图法/真实古籍/《说文解字》字源/永字八法）。A 虽稳但与百子柜墙面格子索引轮廓相邻；C 内容薄；D 仍是线性叙事；E 与地图导航同族。",
  "decision_log": {
    "why_selected": "新颖性 9 + 适配 9 + 风险可控（纯 vanilla transform 插值即可实现）",
    "why_not_others": "A 轮廓撞百子柜；C 内容薄；D 线性翻页不新；E 地图导航同族",
    "accepted_patterns": []
  }
}
```

## Design Contract

### Core Idea
continuous_scale_zoom_dive「一字一世界」：整站是一次连续缩放潜入——从深夜图书馆大厅出发，经书架、书脊、摊开的书页、一行字、一个「書」字、一笔一画，最终潜到纸张纤维与墨色微观。滚轮/拖拽即显微镜调焦。

### Experience Goal
用户应感到自己在亲手转动显微镜的调焦旋钮，尺度是连续的、由我推动的；每潜一层，世界换一种质感（建筑→木→纸→墨→纤维）。

### Must Keep
1. 连续缩放为唯一主轴（wheel/drag/键盘 ±/倍率尺点击，四通道等价）
2. 8 个尺度层级，层间用 scale+opacity 连续插值，禁止跳切
3. 右侧倍率尺（×1 → ×10000）实时指示，可点击直达
4. 每层级内容真实：中图法分类、真实古籍书目、《说文解字》「書」字源、永字八法笔画、纸纤维
5. 自定义光圈光标开页即在屏幕中央、高对比、层级最高
6. 纯 vanilla 单文件，零 CDN

### Must Not Regress To
1. 竖向 section 堆叠 / Landing Page
2. 卡片网格 / Bento
3. 蓝紫渐变、米色宣纸+朱砂（历史高频配色）

### Primary Interaction
滚轮/触控板捏合/拖拽倍率尺/键盘 ± → 连续 zoom 值（带阻尼惯性），驱动舞台 transform 与层级 opacity 插值。

### Motion Language
光学调焦语言：景深模糊过渡、光圈呼吸、尘埃在台灯光柱中浮动、笔画描红（stroke dashoffset）、墨滴晕染扩散。所有动效符合"光与墨"的物理感。≥12 个组件级特效，禁整图缩放 Ken Burns（缩放必须是用户驱动的空间移动，不是自动播放的背景动效）。

### Signature Moment
从一页摊开的古籍无缝潜入「書」字的一笔——墨色在视野中涨满，化作新的夜空，纤维如星野浮现。

### Success Condition
- 仅用滚轮 10 秒内可从大厅连续潜到纤维层，无跳切感
- 灰度下层级成立（倍率尺+景深足以建立层级）
- 关掉动画，8 个层级的静态构图各自成立
- Browser QA 四尺寸无白屏/无致命 Error

### Technical Boundary
纯 vanilla 单 HTML 文件；RAF 随 visibilitychange 暂停、卸载取消；高频 wheel/pointer 事件直接操作 DOM transform，不进框架渲染循环；prefers-reduced-motion 降级为层级淡入；禁止任何外部图片/CDN/字体文件（系统字体栈）。
