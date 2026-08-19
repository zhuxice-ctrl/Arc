# Art Director 决策日志 · V2 手机 · 2026-08-19

## 任务参数
- category: phone
- form_factor: 微信小程序（上一次 phone_mock「观鸟年表」为原生 App，按交替规则本次做微信小程序）
- 技术边界: 纯 vanilla 单文件 HTML，localStorage 持久化，无外部 CDN
- 日期: 2026-08-19（周三）

## 历史避重扫描（phone.json + decisions/）
饱和/高频风险：
- 「印章/盖章/按压封印」类签名极度饱和（篆刻、钱币、方言印章、书漂足迹、射箭盖章、合香朱砂、便当封盖、行李封箱…）→ 本次禁用任何「盖章/封印/按压落印」签名
- 暖纸墨/木器/陶土材质 + 朱砂赭石手作气质过度集中 → 本次避免暖纸+朱砂组合
- 「拖拽 X 上秤/入盘/入扇」式拖拽签名高频（戥秤×2、漆扇入水、便当装箱、行李贴纸…）→ 本次核心签名不使用拖拽上秤/入盘
- 4-tabbar + pagestack + halfsheet 导航高频 → 微信小程序合理保留 tabbar，但首屏需非通用模板
- 已覆盖手作收藏：钱币/篆刻/漆扇/纸胶带/合香/蓝晒/书法/方言/灯谜/咖啡/便当/古书/核雕未覆盖

## 5 个正交候选

```json
{
  "candidates": [
    {
      "id": "A",
      "motif": "掐丝珐琅手作志·路径描丝工坊",
      "concept_statement": "追踪掐丝珐琅作品从掐丝→点蓝→烧蓝→打磨→镀金完整工艺流水线，签名交互为掐丝阶段沿图样路径描铺铜丝",
      "visual_source": "景泰蓝工坊——铜丝/珐琅釉料/炉火/金箔 + 暗栗漆器底",
      "spatial_model": "stage_pipeline_home + 4tabbar_halfsheet_pagestack",
      "primary_interaction": "沿图样轮廓路径拖动描铺铜丝，路径闭合闪金属高光",
      "signature_moment": "掐丝完成瞬间——铜丝沿完整路径闭合，金属高光沿丝流过，线稿变铜丝立体",
      "color_logic": "暗栗漆底#1A1410+铜色#B87333+炉火橙#E8753A+珐琅宝石色(钴蓝/松石绿/胭脂红/鸡油黄)+金#D4A847，禁蓝紫渐变",
      "typography_logic": "无衬线正文+衬线纹样名/工艺名凸显器物气质",
      "material_logic": "铜丝金属质感+珐琅釉料玻璃光泽+炉火脉动+金箔，非纸非木非陶",
      "motion_language": "铜丝弹性吸附/釉料流动填充/炉火脉动光晕/打磨渐进光泽——皆材质功能反馈",
      "novelty_score": 9, "fit_score": 9, "execution_risk": "MEDIUM",
      "risk_reason": "路径描丝交互+多阶段流水线+点蓝填色+烧蓝温控同在单文件，需控范围",
      "pattern_collisions": []
    },
    {
      "id": "B",
      "motif": "皮影戏偶制作志",
      "concept_statement": "设计皮影人物→刻制关节→上色→组装操纵杆→操演记录",
      "visual_source": "皮影戏幕布/驴皮牛皮透光/雕花关节",
      "spatial_model": "character_builder_flow",
      "primary_interaction": "拖动操纵杆控制皮影关节动作",
      "signature_moment": "皮影在幕布光下投出剪影动起来",
      "color_logic": "幕布暖黄透光+皮褐+矿物色",
      "novelty_score": 8, "fit_score": 7, "execution_risk": "HIGH",
      "risk_reason": "皮影关节骨骼动画+透光剪影渲染工程复杂度高，单文件难保质量"
    },
    {
      "id": "C",
      "motif": "古建彩画测绘志",
      "concept_statement": "实地测绘古建彩画→记录纹样/色谱/年代→建档对比",
      "visual_source": "古建彩画/和玺彩画/旋子彩画/测绘图纸",
      "spatial_model": "archive_survey_flow",
      "primary_interaction": "在建筑剖面图上标注彩画位置",
      "signature_moment": "彩画纹样从线稿上色的过程",
      "color_logic": "青绿彩画+沥粉贴金+灰瓦",
      "novelty_score": 7, "fit_score": 6, "execution_risk": "MEDIUM",
      "risk_reason": "测绘标注产品骨架偏台账/档案管理类，题材性中等，与钱币柜/矿晶志结构撞"
    },
    {
      "id": "D",
      "motif": "绒花缠花手作志",
      "concept_statement": "选蚕丝→劈丝染色→缠绑造型→组装簪花→作品集",
      "visual_source": "绒花/缠花/蚕丝绒线/铜丝骨架",
      "spatial_model": "material_to_product_flow",
      "primary_interaction": "手指捻转缠丝",
      "signature_moment": "绒花在光下绒毛质感渐显",
      "color_logic": "绒线多色+铜丝骨架+米白底",
      "novelty_score": 7, "fit_score": 7, "execution_risk": "MEDIUM",
      "risk_reason": "缠丝手势交互与「拖拽」族结构接近，且绒线材质与毛线圈(yarnloop)撞"
    },
    {
      "id": "E",
      "motif": "琉璃烧制志",
      "concept_statement": "配料→熔炼→吹制/浇铸→退火→成品档案",
      "visual_source": "琉璃窑/玻璃熔液/吹管/退火炉",
      "spatial_model": "kiln_process_flow",
      "primary_interaction": "吹管转动控制琉璃形态",
      "signature_moment": "琉璃从熔液凝固成型的色彩渐变",
      "color_logic": "琉璃多彩+炉火橙+暗窑底",
      "novelty_score": 7, "fit_score": 7, "execution_risk": "HIGH",
      "risk_reason": "玻璃熔液流体渲染+吹管转动3D感在单文件难实现，且与窑炉面包/发酵实验室炉火题材撞"
    }
  ],
  "ranking": ["A", "D", "C", "B", "E"],
  "selection_reason": "选 A：掐丝珐琅是本集合唯一未覆盖的经典宫廷工艺品类，产品逻辑（选图样→掐丝→点蓝→烧蓝→打磨→镀金完整流水线）扎实自洽且与近期手作收藏类不重复；签名交互为沿路径描铺铜丝+闭合金属高光，彻底避开饱和的「印章/拖拽上秤」签名族；材质为铜丝/珐琅釉/炉火/金箔，规避暖纸朱砂木器陶土；配色暗栗漆底+铜色+炉火橙+珐琅宝石色，规避蓝紫渐变。新颖性 9、适配 9、风险中（可控）。B 皮影骨骼动画工程风险高；C 测绘偏台账与钱币柜撞；D 缠丝手势撞拖拽族且材质撞毛线圈；E 琉璃流体渲染难且炉火题材撞窑炉面包。",
  "decision_log": {
    "why_selected": "领域全新(宫廷珐琅工艺)+产品闭环强(五阶段流水线)+签名非拖拽非印章(路径描丝)+材质非纸非木非陶(铜珐琅炉火金)+配色规避蓝紫",
    "why_not_others": "B 骨骼动画工程风险高；C 偏台账与钱币柜撞；D 签名撞拖拽族且材质撞毛线圈；E 流体渲染难且炉火撞窑炉面包",
    "accepted_patterns": ["bottom_tabbar（微信小程序合理）", "capsule_nav", "half_screen_sheet", "pull_down_refresh", "left_swipe_action", "page_stack_push_pop"]
  }
}
```

## Design Contract

### Core Idea
掐丝珐琅手作志微信小程序「景蓝坊」。核心：选传统纹样 → 掐丝（沿路径描铺铜丝）→ 点蓝（填珐琅釉色）→ 烧蓝（温控曲线）→ 打磨（显光泽）→ 镀金（完成）完整工艺流水线，每阶段可记录进度，掐丝路径描丝为独特交互记忆点。设计语言来自景泰蓝工坊的铜丝、珐琅釉料、炉火与金箔。

### Experience Goal
用户像随身带一方珐琅工坊：选个纹样起一件作品，亲手描铜丝、填釉色、看炉火，慢慢攒成自己的珐琅作品集。

### Must Keep
1. 微信小程序形态：胶囊导航栏 + 底部 TabBar + 半屏弹层 + 下拉刷新 + 左滑操作 + 页面栈 push/pop（≥5 种端侧交互语言）。
2. 完整工艺流水线五阶段：掐丝→点蓝→烧蓝→打磨→镀金，每阶段有真实交互与进度记录，阶段间有因果递进（上阶段完成才能进下阶段）。
3. 签名交互——掐丝路径描丝：图样轮廓以淡色路径显示，用户沿路径拖动，铜色笔触实时跟随生成，路径闭合时铜丝闪金属高光、线稿变铜丝立体效果，进度百分比实时更新。必须真实可用不能假。
4. 真实内容：6 种传统纹样（牡丹纹/缠枝莲纹/宝相花纹/海水江崖纹/祥云纹/回纹）含名称/难度/推荐釉色；5 种珐琅釉色（钴蓝/松石绿/胭脂红/鸡油黄/翠玉绿）含名称/色值/用途；真实烧制参数（温度/时间/层数）。
5. localStorage 持久化：作品进度/阶段状态/掐丝完成度跨刷新保留。含设计规范页 + 接口文档页。

### Must Not Regress To
- 不得退化为「问候语+搜索+Banner+分类Icon+横滑卡+推荐+底部Tab」通用 App 模板。
- 不得使用任何「印章/盖章/封印/按压落印」或「拖拽X上秤入盘」式签名（饱和）。
- 不得用暖纸+朱砂/木器陶土手作配色，不得用蓝紫渐变。

### Primary Interaction
选图样新建作品 → 进入掐丝阶段沿路径描铺铜丝（签名）→ 完成掐丝进入点蓝填釉色 → 烧蓝温控 → 打磨显光泽 → 镀金完成入作品集。首页为当前作品工艺流水线进度，非通用任务列表。

### Motion Language
铜丝弹性吸附/釉料流动填充/炉火脉动光晕/打磨渐进光泽——皆为材质功能反馈，prefers-reduced-motion 下高光改静态、脉动停止。

### Signature Moment
掐丝完成瞬间：铜丝沿完整路径闭合，金属高光沿丝流过一遍，图样从淡色线稿变为铜色立体铜丝效果。

### Success Condition
掐丝描丝交互真实可用且手感成立（路径跟随+闭合高光+进度更新）；五阶段流水线有真实状态递进且 localStorage 持久化；点蓝填色真实切换釉色；作品集有真实内容；4 Tab 间切换与页面栈正常；无白屏无 Console Error；截图非空白。

### Technical Boundary
纯 vanilla 单文件 HTML（无 React/Babel/CDN），localStorage 持久化，目标 375×812 设备尺寸及邻近尺寸正常显示，支持 prefers-reduced-motion。
