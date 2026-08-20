# Art Director Decision Log — 2026-08-20 V2 草木染谱

## 元信息
- 日期: 2026-08-20
- 类别: phone (V2 手机 UI)
- 形态判定: 上一次 phone_mock（信鸽竞翔 pigeon-compass）= 原生 App → 本次交替 = **微信小程序**
- 历史避重: 已翻阅 memory/phone.json 最近 20+ 指纹；今日已产出 信鸽/书场/木作/招领处/菜场/运转/菌谱/蜂箱/印稿，均无染织类。

## 五个正交候选方向（motif 真正不同，非换色/换皮）

### A. 草木染谱 — 染材配方库 + 染色档案微信小程序
- 母题: 植物染（草木染）配方册与色卡档案。
- 产品机制: 浏览染材(苏木/靛蓝/栀子/茶/五倍子/槐米)→查配方(媒染剂/温度/时长/浸染次数)→记录一次染色(步骤计时)→成品入色卡册→按染材/色系复现。
- 签名交互: **拖动「浸染次数」游标，色卡色块按该染材真实色阶实时渐深**——模拟草木染"多次浸染叠色"工艺，craft-true，非玩具。
- novelty: phone 记忆无染织类；与 web 的景泰蓝/合香/漆扇属不同工艺。
- execution_risk: 中（色卡颜色随浸染次数插值，canvas/CSS 可实现）。
- fit: 高（微信小程序端侧语言天然适配"配方册+档案"工具型产品）。

### B. 老城拓印志 — 散步拓印井盖/门牌纹样档案
- 母题: 城市纹样拓印收集。
- 产品机制: 地图找可拓印物→拓印动作(纸覆+扑墨填满)→纹样建档→纹样地图。
- 签名交互: 扑墨逐格填满纹理。
- novelty: 与 web 的拓片/印章有重叠风险（rubbing 类）。
- execution_risk: 中高。
- fit: 中。

### C. 老照相馆冲印预约 + 底片档案
- 母题: 暗房冲印。
- 产品机制: 预约冲印→选相纸/尺寸/冲洗参数→进度→底片册。
- 签名交互: 暗房显影进度（相纸在药液逐渐显影）。
- novelty: web 已有 darkroom_amber 视觉材质；phone 未做但材质重复风险高。
- execution_risk: 中。
- fit: 中。

### D. 草药铺抓药配方小程序
- 母题: 中药抓药。
- 产品机制: 选方→抓药(秤量互动)→煎法→服法档案。
- 签名交互: 杆秤拖动称量。
- novelty: web 有 apothecary_cabinet；杆秤偏拟物演示（V3 禁列边缘）。
- execution_risk: 中。
- fit: 中。

### E. 露天电影放映点小程序
- 母题: 城市露天放映。
- 产品机制: 找今晚放映点→标记到场→留观后感→放映足迹。
- 签名交互: 放映机胶片转动入场。
- novelty: 高，但产品机制偏"标记到场"，与早餐摊/图书漂流的"打卡足迹"结构同质。
- execution_risk: 低。
- fit: 中低（核心任务较单薄）。

## 排序与选择
按 novelty_score + fit_score + execution_risk 综合：

1. **A 草木染谱** — novelty 高 / fit 高 / risk 中 → **选定**
2. B 拓印志 — novelty 中 / fit 中 / risk 中高
3. C 照相馆 — novelty 中 / fit 中 / risk 中
4. E 露天电影 — novelty 高 / fit 中低 / risk 低
5. D 草药铺 — novelty 中 / fit 中 / risk 中（拟物边缘）

**选定 A。** 理由：染材配方+色卡档案是真正成立的工具型微信小程序产品；浸染次数游标驱动色阶是与工艺本体绑定的签名交互（非装饰）；天然多色植物染调色板规避蓝紫陈词；真实内容丰富（真实染材/媒染/色值/工艺步骤）；与近期作品无结构同质。

## Pattern Pressure 自检
- spatial_model: 新建 `dye_recipe_workbench_swatches_4tabbar_pagestack`，无 SATURATED。
- signature: 新建 `drag_dip_count_swatch_color_progression`，无重复。
- visual_material: 新建 `plant_dye_cloth_swatches`，无重复。
- tabbar+pagestack: 属微信小程序形态约定（非创意模板），可接受。

## 失败方向备查
- 若 A 的色阶插值在移动端性能不足或可读性差 → 转第二候选 B（拓印志）。

## Design Contract（锁定 Designer）
见同目录 design-brief-ranrancao.md。核心锁定项：
- core_idea: 草木染配方册 + 染色档案微信小程序
- 形态: 微信小程序（胶囊导航栏 + 底部4Tab + 半屏弹层 + 下拉刷新 + 左滑操作 + 吸底操作栏，≥4 端侧语言）
- must_keep: 完整 user flow（染材→配方→染色计时→入色卡册→复现）；浸染次数游标签名交互；6+ 真实染材含真实色值/配方；色卡册 localStorage 持久化；规范页+接口页；中文文案
- must_not_regress_to: 通用 App 首页模板（问候语+搜索+Banner）；网页缩进手机；假功能；蓝紫渐变
- success_condition: 能走完"选染材→查配方→拖游标看色阶→执行染色计时→成品入册→色卡册复现"完整闭环；删动画后设计仍成立；灰度下层级仍成立
