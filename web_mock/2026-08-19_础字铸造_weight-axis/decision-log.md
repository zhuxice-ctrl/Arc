# 2026-08-19 Art Director 决策日志（V1 web · 本轮：础字铸造·字重九重）

## 当天差异化判断
今日（8-19）web_mock 已入库 27 版，题材密度集中在：传统中式工艺（大运河/制表/活字/年画/廊桥/日晷/算盘/药铺/游廊/茶焙/茶马/窑火/调香/金鱼/鼓声/皮影/蜀道/提线/物候环）、纸本水墨木色配色、拖拽类主交互、scroll-descent 叙事、固定舞台、径向轮盘、横向长卷、剖面工程。最近两批（地震波形档案、光污染勘测尺、牵星过洋图）转向深空黑/琥珀/海图深蓝的科学控制台。
→ 本轮 V1 刻意避开：传统工艺 / 纸本水墨木色 / 深空黑琥珀 / 拖拽主交互 / 横向脊柱 / 垂直下降叙事 / 径向轮盘 / 固定舞台拆解。
→ 转向**品牌官网 + Editorial**类型（今日零出现），题材=**独立字体铸造厂**——Typography 本身即内容（web.md「Typography 必须成为主要设计工具」最强适配），主交互取全库零重复的**键盘驱动**，配色取全库零重复的**暖纸白+墨黑+铸字砖红**明亮现代系。

## 题材
独立字体铸造厂「础字铸造」发布中西文协调字族「础方」9 字重（Hairline 100 → Black 900）的品牌官网。用户以键盘 ↑↓ 沿字重轴攀爬，全屏中央巨字随字重实时变形，每个章节以当前字重呈现——字重即阅读节奏。

## 5 候选（正交 motif）

| ID | motif | visual_source | spatial_model | primary_interaction | novelty | fit | risk | 状态 |
|----|-------|---------------|---------------|--------------------|---------|-----|------|------|
| A | 字重轴垂直键盘攀爬·全屏实时铸字 | 现代字体样书·暖纸墨黑铸字红 | fullstage_weight_axis_vertical | keyboard_climb_weight + arrow_chapter | 9 | 9 | MED | **选中** |
| B | 印刷样书翻页·键盘左右翻 | 印刷装订样书·纸张堆叠厚度 | paginated_book_stack | keyboard_flip | 7 | 8 | MED | 弃：翻书物理+纸张堆叠工程量大，且 fixed/paginated 近期已多 |
| C | 字符矩阵·键盘输入过滤 | 字汇矩阵网格·铅字盘 | matrix_grid_keyboard_filter | keyboard_type_filter | 8 | 8 | LOW | 弃：网格型易退化为"工具平台罗列"，违反 web.md 反平台原则 |
| D | 编辑长读·侧轴目录 | 编辑杂志长读·现代版式 | editorial_longread_sidebar_index | scroll_read | 6 | 7 | LOW | 弃：编辑长读属常见 web 形态，novelty 不足，且 scroll 主交互近期饱和 |
| E | 字谷负空间滚动揭示 | 字符负空间·字谷形态 | counterform_reveal_scroll | scroll_reveal | 8 | 7 | MED | 弃：scroll 揭示近期饱和；负空间 SVG 控制风险中 |

### 正交性校验
spatial_model：A=fullstage垂直轴 / B=翻页书 / C=矩阵网格 / D=长读侧轴 / E=负空间揭示 —— 5 项全不同。
primary_interaction：A=键盘攀字重 / B=键盘翻页 / C=键盘过滤 / D=滚动阅读 / E=滚动揭示 —— 5 项全不同。
visual_source：A=现代样书 / B=印刷书 / C=铅字盘矩阵 / D=杂志 / E=负空间 —— 5 项全不同。
≥3 项互不相同：满足。

## 选择理由（A 而非其他）
- **novelty**：键盘驱动主交互全库零重复（现存全为 drag/scroll/click）；字重轴作为可攀爬的垂直参数轴是字体铸造厂灵魂——全库零重复。
- **fit**：字体铸造厂的核心体验就是"在一个字符上感受整个字重范围"，fullstage 巨字 + 字重轴是该题材的唯一正确空间模型，fit 满分。
- **execution_risk=MEDIUM 可控**：实时字重视觉用 font-weight(100→900) + -webkit-text-stroke 宽度同步缩放放大重量差异，纯 vanilla 可靠可见，不依赖外部可变字体文件。
- 弃 C：网格矩阵虽低风险但易退化成"字汇浏览工具"，web.md 明令反平台罗列；A 的品牌叙事+章节结构保证它是"完整网站"而非工具。
- 弃 D：编辑长读 novelty 不足，scroll 主交互近期饱和。

## Pattern Collisions
- fixed_stage：all=1,l20=1（LOW）。A 用 fullstage 但**非 deconstruct**——是字重参数轴攀爬，interaction(键盘)与既有 fixed_stage(deconstruct/puppet/light-shadow)完全正交。justification：字体铸造厂核心体验=单字符跨字重范围，必须固定全屏画布。
- keyboard primary_interaction：全库零出现，无碰撞。
- 暖纸白+墨黑+砖红：近期全为深色/土色/海图蓝，零碰撞。

## Decision Log
- why_selected: 键盘驱动+字重轴+品牌官网三重零重复，fit 满分，题材不可替换性强（换掉"字体"整个体验崩塌）。
- why_not_others: B 工程量大且 paginated 近期多；C 易退化为工具平台；D novelty 不足且 scroll 饱和；E scroll 饱和且 SVG 风险中。
- accepted_patterns: fixed_stage（带 justification，交互正交）

## Design Contract 见同目录 contract.md
