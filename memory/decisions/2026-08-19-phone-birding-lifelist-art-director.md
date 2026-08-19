# Art Director 决策日志 · V2 手机 · 2026-08-19

## 任务参数
- category: phone
- form_factor: 原生 App（上一次 phone_mock「慢注咖啡」为微信小程序，按交替规则本次做原生 App）
- 技术边界: 纯 vanilla 单文件 HTML，localStorage 持久化，无外部 CDN
- 日期: 2026-08-19（周三）

## 历史避重扫描（phone.json 最近 36 条）
饱和/高频风险：
- 「印章/盖章/按压封印」类签名极度饱和（篆刻、钱币转动、方言印章、书漂足迹印章、射箭盖章、合香朱砂封印、便当封盖、行李封箱拉链…）→ 本次禁用任何「盖章/封印/按压落印」签名
- 暖纸墨/木器/陶土材质 + 朱砂赭石手作气质过度集中 → 本次避免暖纸+朱砂组合
- 「拖拽 X 上秤/入盘/入扇」式拖拽签名高频（戥秤×2、漆扇入水、便当装箱、行李贴纸、桑叶喂蚕…）→ 本次核心签名不使用拖拽
- 4-tabbar + pagestack + halfsheet 导航高频 → 本次仍可用 tabbar（原生 App 合理）但首屏结构需非通用模板，且配合一个非拖拽签名
- 已覆盖运动：射箭/攀岩/冲浪/夜跑/岸钓；自然：城市树/阳台菜园/家蚕；手作收藏：钱币/篆刻/漆扇/纸胶带/合香/蓝晒/书法/方言/灯谜/咖啡/便当

## 5 个正交候选

```json
{
  "candidates": [
    {
      "id": "A",
      "motif": "城市声景采集员",
      "concept_statement": "录制城市环境声→标注声景→落点声音地图，建立私人声景档案",
      "visual_source": "录音机/示波器声谱 + 田野地图等高线",
      "spatial_model": "map-first",
      "primary_interaction": "长按录音→实时波形→松手落点",
      "signature_moment": "声波涟漪在地图落点扩散",
      "color_logic": "仪器青绿+暗夜墨+暖橙声波",
      "novelty_score": 8, "fit_score": 6, "execution_risk": "MEDIUM",
      "risk_reason": "真实录音+地图落点+波形渲染在单文件内工程量与麦克风权限风险"
    },
    {
      "id": "B",
      "motif": "家庭三表抄表账本",
      "concept_statement": "每月抄水电燃气表→拨字轮输入读数→阶梯计费→趋势对比→异常预警",
      "visual_source": "老式机械字轮表 + 抄表员手账本",
      "spatial_model": "时间轴账本 + 字轮输入器",
      "primary_interaction": "拨动机械字轮输入读数自动算量算费",
      "signature_moment": "机械字轮滚动对位动画",
      "color_logic": "工业灰蓝+暖白账册+警示橙红",
      "novelty_score": 7, "fit_score": 4, "execution_risk": "LOW",
      "risk_reason": "产品骨架偏台账/管理类，命中 V2「禁止默认 B 端管理/台账模板」红线，题材性弱"
    },
    {
      "id": "C",
      "motif": "观鸟年表·听音辨鸟",
      "concept_statement": "随身观鸟图鉴：浏览图鉴→记录目击（地点/时间/数量）→点亮个人图鉴累积年表；每日「听音辨鸟」声谱挑战作为签名记忆点",
      "visual_source": "博物志手绘鸟类图鉴 + 田野笔记 + 声谱图（钢琴卷帘式）",
      "spatial_model": "field-guide-list + life-list-grid + year-timeline",
      "primary_interaction": "图鉴浏览→记录目击→点亮图鉴；听音辨鸟用 WebAudio 合成鸟鸣音型比对声谱",
      "signature_moment": "听音辨鸟：神秘鸟鸣以钢琴卷帘声谱流动播放，从候选声谱中辨认同种",
      "color_logic": "石青苔绿主调+赭橙鸟羽强调+冷雾米白底+候鸟迁徙红，规避暖纸朱砂与蓝紫",
      "typography_logic": "无衬线正文+衬线物种学名（拉丁文斜体）凸显博物图鉴气质",
      "material_logic": "雾纸田野笔记+手绘羽翼线稿，非木器陶土",
      "motion_language": "声谱流动/图鉴点亮墨点扩散/年表计数弹跳，皆为功能反馈非装饰",
      "novelty_score": 9, "fit_score": 9, "execution_risk": "MEDIUM",
      "risk_reason": "WebAudio 合成 + 声谱可视化 + 图鉴 + 年表统计同在单文件，需控范围",
      "pattern_collisions": []
    },
    {
      "id": "D",
      "motif": "酸种面包发酵烘焙日志",
      "concept_statement": "喂养酸种→发酵看膨胀→烘焙温时记录→配方复现",
      "visual_source": "烘焙笔记本 + 温控曲线",
      "spatial_model": "recipe-param-flow + reproduce",
      "primary_interaction": "记录发酵曲线与烘焙参数复现配方",
      "signature_moment": "面团膨胀可视化曲线",
      "color_logic": "麦麸棕+奶油白+焦糖",
      "novelty_score": 6, "fit_score": 7, "execution_risk": "LOW",
      "risk_reason": "「参数记录→复现」产品骨架与「慢注咖啡」高度重复，结构性撞车"
    },
    {
      "id": "E",
      "motif": "骑行爬坡路书",
      "concept_statement": "导入路线→分段坡度色阶→预估时间→骑行后段段复盘",
      "visual_source": "等高线地形图 + 坡度剖面",
      "spatial_model": "profile-curve-axis",
      "primary_interaction": "沿坡度剖面拖游标看每段海拔坡度",
      "signature_moment": "坡度剖面色彩渐变 + 海拔标尺",
      "color_logic": "地形等高线棕+林绿+警示",
      "novelty_score": 7, "fit_score": 8, "execution_risk": "MEDIUM",
      "risk_reason": "「拖游标沿曲线」签名与冲浪潮汐游标/岸钓张力区签名结构撞车"
    }
  ],
  "ranking": ["C", "E", "A", "D", "B"],
  "selection_reason": "选 C：观鸟是本集合唯一未覆盖的经典自然爱好品类，产品逻辑（图鉴→目击记录→点亮年表）扎实自洽且与近期手作收藏类不重复；签名交互用 WebAudio 听音辨鸟声谱比对，彻底避开饱和的「印章/拖拽」签名族；配色用石青苔绿+赭橙+冷雾米白，规避暖纸朱砂与蓝紫渐变。新颖性 9、适配 9、风险中（可控）。B 因命中台账红线 fit 低；D 与咖啡结构撞车；E 与冲浪/岸钓签名撞车；A 录音权限工程风险偏高。",
  "decision_log": {
    "why_selected": "领域全新+产品闭环强+签名非拖拽非印章+配色规避饱和",
    "why_not_others": "B 台账红线；D 结构撞咖啡；E 签名撞冲浪/岸钓；A 录音工程风险",
    "accepted_patterns": ["bottom_tabbar_native（原生App合理，但首屏非通用模板）", "page_stack_push_pop", "half_sheet"]
  }
}
```

## Design Contract

### Core Idea
随身观鸟图鉴原生 App「羽志」。核心：浏览鸟类图鉴 → 记录目击（地点/时间/数量/备注）→ 点亮个人图鉴 → 累积观鸟年表；每日「听音辨鸟」声谱挑战作为独特交互记忆点。设计语言来自博物志手绘鸟类图鉴与田野笔记，非木器陶土手作气质。

### Experience Goal
用户像随身带一本会发声的博物图鉴：随手翻图鉴认鸟、记下今天看到的一只、听一段鸟鸣猜是谁，慢慢攒成自己的观鸟年表。

### Must Keep
1. 听音辨鸟用 WebAudio 真实合成鸟鸣音型（多频率序列）+ 钢琴卷帘式声谱可视化，候选声谱可播放比对，答对点亮图鉴——这是签名，必须真发声、真可视化，不能用静态图片假装。
2. 完整目击记录闭环：图鉴物种页 → 记录目击（地点/日期/数量/备注）→ 写入年表 → 图鉴点亮（未见→已见状态真实变化）→ 年表统计数字真实更新。
3. 图鉴至少 12 种鸟，含留鸟/候鸟/冬候/夏候季节标签与学名（拉丁文斜体），可按类群/季节筛选，筛选真实生效。
4. 田野笔记博物图鉴视觉语言：冷雾米白底、石青苔绿主色、赭橙鸟羽强调、候鸟迁徙红警示；物种页手绘羽翼线稿气质。
5. 数据 localStorage 持久化：目击记录、已见状态、听音挑战得分跨刷新保留。

### Must Not Regress To
- 不得退化为「问候语+搜索+Banner+分类Icon+横滑卡+推荐+底部Tab」通用 App 模板。
- 不得使用任何「印章/盖章/封印/按压落印」或「拖拽X上秤入盘」式签名（饱和）。
- 不得用暖纸+朱砂/木器陶土手作配色，不得用蓝紫渐变。

### Primary Interaction
图鉴浏览筛选 → 物种页记录目击 → 点亮图鉴 + 年表统计更新；听音辨鸟：播放神秘鸟鸣声谱 → 听 4 个候选声谱 → 选对点亮。

### Motion Language
声谱条流动播放（WebAudio 驱动，非装饰）、图鉴点亮墨点扩散、年表计数弹跳、候鸟迁徙提醒淡入——皆为状态/功能反馈，prefers-reduced-motion 下声谱改为静态高亮、其余降级。

### Signature Moment
听音辨鸟声谱挑战：一段神秘鸟鸣以钢琴卷帘声谱从左向右流动播放并真实发声，下方四个候选物种各带自己的声谱缩略可单独试听，选出与神秘声谱「音型」一致的那一种。

### Success Condition
听音辨鸟真发声且声谱流动可辨；目击记录写入后图鉴点亮状态与年表计数同步变化且刷新后保留；图鉴筛选真实过滤；4 个 Tab 间切换与页面栈 push/pop 正常；无白屏无 Console Error；截图非空白。

### Technical Boundary
纯 vanilla 单文件 HTML（无 React/Babel/CDN），WebAudio API 合成鸟鸣，localStorage 持久化，目标 390×844 设备尺寸及邻近尺寸正常显示，支持 prefers-reduced-motion。
