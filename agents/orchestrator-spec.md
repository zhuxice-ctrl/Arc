# Art 项目｜Orchestrator 后半段完整设计规范

本规范承接已经确定的：

- Global Design Rules
- Web Rules
- Phone Rules
- Component Rules
- Design Memory
- Pattern Counter
- Art Director
- Candidate Selection
- Design Contract

本部分负责完整定义：

1. Browser QA
2. Critic
3. Repair
4. Restart
5. Quality Gate
6. Memory Writer
7. Orchestrator
8. 状态机
9. 文件结构
10. Agent 输入输出协议
11. Commit 条件
12. 失败处理
13. 第一版落地范围

最终目标不是建立一个复杂的 Multi-Agent Demo。

而是建立一条真正能够：

**提出创意 → 约束创意 → 实现 → 检查 → 淘汰 → 返修 → 入库 → 记忆**

的设计生产流水线。

---

# 一、整体架构

完整流程：

```text
TASK
 ↓
ROUTER
 ↓
LOAD RULES
 ↓
LOAD DESIGN MEMORY
 ↓
ART DIRECTOR
 ↓
5 CANDIDATES
 ↓
NOVELTY CHECK
 ↓
DIRECTION SELECTION
 ↓
DESIGN CONTRACT
 ↓
DESIGNER
 ↓
IMPLEMENTATION
 ↓
BROWSER QA
 ↓
DESIGN CRITIC
 ↓
REPAIR / RESTART
 ↓
QUALITY GATE
 ↓
COMMIT
 ↓
MEMORY WRITER
 ↓
PATTERN STATS UPDATE
 ↓
END
```

核心原则：

**每个 Agent 只拥有自己的职责。**

禁止所有角色都进行：

- 创意
- 评分
- 返修
- 决策
- 提交

否则最终仍然会退化成一个 AI 自问自答。

---

# 二、角色权限

## Orchestrator

负责：

- 调度
- 状态管理
- 输入拼装
- 结果解析
- 判断下一步
- 返修计数
- Restart
- 最终流程控制

不负责：

- 创作
- 美术决策
- 写页面
- 自己评分

---

## Art Director

负责：

- 理解主题
- 产生创意方向
- 历史避重
- 方向筛选
- Design Contract

不负责：

- 写完整代码
- 修 Bug
- 最终质量审核

---

## Designer

负责：

- 将 Contract 实现完整
- 完成视觉
- 完成交互
- 完成代码
- 响应 Repair

不负责：

- 重新产生 5 个方向
- 自己决定是否入库
- 自己给自己最终评分

---

## Browser QA

负责：

**客观事实。**

例如：

- 页面打不开
- Console Error
- 资源错误
- 滚动异常
- 交互失效
- Layout 爆炸

不评价：

- 漂不漂亮
- 创意够不够好
- 是否高级

---

## Critic

负责：

**设计问题。**

例如：

- 模板化
- 交互浅
- 产品逻辑弱
- 信息结构差
- 后半段质量下降
- 没有实现 Design Contract

不负责：

- 自己重新写完整项目
- 直接 Commit

---

## Quality Gate

负责：

最终判断：

```text
PASS
REPAIR
REJECT
```

它不创作。

不讨论。

不优化。

只裁决。

---

## Memory Writer

负责：

将最终设计转换为结构化 Design Fingerprint。

不负责创作，不负责评分。

---

# 三、Browser QA

Browser QA 必须在 Critic 之前执行。

原因：

如果页面本身都打不开，没有必要消耗 Critic 的推理能力讨论设计质量。

---

# 四、Browser QA 检查范围

必须实际运行页面。

不是阅读代码。

检查：

## Runtime

- 页面是否正常加载
- 是否出现白屏
- 是否存在致命 JS Error
- 是否存在未处理异常
- 页面是否能够完成初始化

---

## Resources

- 图片是否加载
- 字体是否加载
- CSS 是否加载
- JS 是否加载
- 相对路径是否正确
- 外部依赖是否有效

---

## Console

检查：

```text
error
uncaught
failed to load
404
reference error
type error
```

警告可以存在。

但严重 Error 不允许进入下一阶段。

---

# 五、Layout QA

检查：

- 是否出现横向意外滚动
- 是否存在文字重叠
- 是否存在内容裁切
- fixed 是否遮挡内容
- sticky 是否异常
- viewport 是否错误
- 极端文本是否破坏布局

Web：

至少检查：

```text
1440px
1024px
768px
390px
```

Phone：

检查目标设备尺寸及至少一个邻近尺寸。

Component：

检查标准展示区域和缩放情况下核心交互是否正常。

---

# 六、Interaction QA

自动或人工模拟：

- Click
- Hover
- Pointer Move
- Drag
- Scroll
- Toggle
- Tabs
- Modal
- Dropdown
- Navigation
- Keyboard
- Touch / Pointer

根据项目实际存在的交互选择。

禁止为了 QA 构造不存在的操作。

---

# 七、Browser QA 输出协议

统一输出：

```json
{
  "status": "PASS",
  "runtime": {
    "page_loaded": true,
    "fatal_error": false,
    "console_errors": []
  },
  "resources": {
    "broken_images": [],
    "failed_fonts": [],
    "failed_requests": []
  },
  "layout": {
    "overflow": [],
    "overlap": [],
    "clipping": []
  },
  "interaction": {
    "tested": [],
    "failed": []
  },
  "severity": {
    "critical": [],
    "major": [],
    "minor": []
  }
}
```

status 只能：

```text
PASS
FAIL
```

---

# 八、Browser QA 失败处理

出现：

```text
CRITICAL
```

直接：

```text
ENGINEERING_REPAIR
```

例如：

- 白屏
- 主功能不能使用
- 页面打不开
- 关键 JS 崩溃

MAJOR：

允许进入工程 Repair。

MINOR：

记录。

可以继续进入 Critic。

---

# 九、Critic 的最高原则

Critic 不是：

> 这个作品挺不错，我给 88 分。

Critic 的使命是：

> **找出阻止这个作品成为优秀作品的具体原因。**

必须保持攻击性。

但攻击：

**作品。**

不是为了刻薄而刻薄。

---

# 十、Critic 必须优先读取 Design Contract

Critic 第一件事不是看：

“漂亮吗？”

而是检查：

```text
当初承诺了什么？
最终到底有没有做出来？
```

Design Contract 中尤其关注：

```text
core_idea
experience_goal
must_keep
must_not_regress_to
primary_interaction
motion_language
signature_moment
success_condition
```

---

# 十一、Contract Fidelity

Critic 必须判断：

```text
FULL
PARTIAL
FAILED
```

### FULL

核心设计完整实现。

### PARTIAL

实现了一部分，但中途出现模板退化。

### FAILED

最终作品已经基本失去最初设计概念。

FAILED 属于重大问题。

---

# 十二、Critic 问题分级

统一使用：

## CRITICAL

如果不解决：

**作品不能入库。**

例如：

- 核心产品逻辑不成立
- 核心交互没有实现
- 完全违背 Design Contract
- 明显模板复制
- 用户无法完成主要任务

---

## MAJOR

明显拉低作品质量。

必须优先修复。

例如：

- 页面后半段严重掉质量
- 交互反馈浅
- 结构重复
- 信息层级混乱
- 视觉语言断裂

---

## MINOR

可优化。

但不阻止入库。

例如：

- 局部间距
- 个别字级
- 次级 Hover
- 小范围动画节奏

---

# 十三、Critic 禁止行为

禁止：

```text
整体不错
视觉比较高级
可以进一步优化
增加一点动效
加强一下层次
```

这些没有执行价值。

问题必须可定位。

例如：

错误：

> 第二屏有点普通。

正确：

> 第二屏从原有的连续地层空间突然退化为三个独立圆角卡片，破坏了第一屏建立的连续剖面模型。

---

# 十四、Critic 必须给 Evidence

每一个 CRITICAL / MAJOR 问题必须包含：

```text
位置
现象
为什么是问题
违反什么原则
建议修复方向
```

例如：

```json
{
  "severity": "MAJOR",
  "location": "第二段内容区",
  "problem": "连续空间突然转化为三列卡片",
  "reason": "破坏了地层剖面的空间连续性",
  "violates": "Design Contract.must_not_regress_to.card_grid",
  "repair_direction": "将三个数据对象重新嵌入连续地层，并利用深度位置建立关系"
}
```

---

# 十五、Web Critic

Web Critic 必须重点攻击：

## Structure

- 是否还是 Landing Page
- 是否 Section 堆积
- 是否 Hero 套路
- 是否 Bento
- 是否 Card 堆积
- 是否所有网页结构相同

---

## Spatial Quality

检查：

- 页面空间关系
- 留白
- 密度
- 重心
- 节奏
- 章节过渡

---

## Typography

检查：

- 字级关系
- 行长
- 段落
- 数字
- Caption
- 标注
- 图文关系

---

## Content

重点检查：

> 如果把主题内容换掉，页面是否仍然完全成立？

如果答案是：

YES

说明题材性不足。

---

## Scroll

检查：

- 首屏强后面弱
- 滚动重复
- Stagger 重复
- 每段都是 Fade Up
- 页面长度是否注水
- 结尾是否草率

---

# 十六、Web 直接 Reject 条件

出现以下情况之一，需要强烈考虑 REJECT：

```text
明显通用 Landing Page 套壳
严重 Card 堆积
核心浏览方式未实现
后半页面明显失控
题材可完全无脑替换
主要 Design Contract 被放弃
```

---

# 十七、Phone Critic

重点攻击：

## Product Logic

问：

> 这个 App 为什么需要存在？

---

## Core Flow

必须走：

```text
打开
↓
主要入口
↓
任务
↓
操作
↓
结果
```

不能只是几张静态 Screen。

---

## Mobile Logic

检查：

- Thumb reach
- 页面返回
- Sheet
- Navigation
- Gesture
- 输入反馈
- 状态反馈

---

## Fake Feature

重点找：

- 点不了的搜索
- 没内容的 Tab
- 装饰按钮
- 假收藏
- 假筛选
- 假社区

---

# 十八、Phone 模板检查

重点检测：

```text
Greeting
+
Search
+
Banner
+
Category Icons
+
Horizontal Cards
+
Recommendation
+
Bottom Navigation
```

如果大量项目重复这套：

MAJOR。

---

# 十九、Phone 直接 Reject 条件

例如：

```text
只是网页缩进手机
页面之间没有 User Flow
核心按钮不能产生真实状态变化
产品结构高度通用
大量假功能
核心任务无法完成
```

---

# 二十、Component Critic

Component Critic 不应该把重点放在：

“漂不漂亮。”

而是：

> **开发者把它搬到自己项目里，会不会觉得好用？**

---

# 二十一、Component 六个重点

## Utility & Need Authenticity

这是真实项目会用的组件吗？
还是在造一个没人需要的演示装置？

---

## State Completeness

disabled / loading / error / empty / focus 都覆盖了吗？
至少 5 个状态。边界情况处理了吗？

---

## Accessibility

键盘能操作吗？焦点环可见吗？触屏可用吗？prefers-reduced-motion 降级了吗？

---

## Reusability

CSS 变量暴露了吗？JS 参数可配置吗？README 有用法文档吗？抽到别的项目改不超过 3 处就能用吗？

---

## Interaction Feel

动画时长 / 曲线符合组件语义吗？
弹簧用于弹性反馈、阻尼用于重量确认、线性仅用于过渡。
禁止 Ken Burns、禁止无关装饰特效。

---

## Code Extractability

CSS / JS 能独立抽取吗？组件代码有清晰边界吗？
还是和展示页耦合在一起、必须拆解才能用？

---

# 二十二、Component 直接 Reject 条件

例如：

```text
拟物化物理演示装置（天平/算盘/卷尺/换挡杆/转盘锁/风箱/弹弓等）
普通按钮加 glow
普通卡片加 hover
只有入场动画
状态不完整（无 disabled / loading / focus）
键盘完全不可操作
无法在别的项目中抽取复用
多个半成品组件堆叠
```

---

# 二十三、Critic 输出协议

统一输出：

```json
{
  "contract_fidelity": "PARTIAL",

  "summary": "一句话说明最大问题",

  "critical": [],

  "major": [
    {
      "id": "M1",
      "location": "",
      "problem": "",
      "reason": "",
      "violates": "",
      "repair_direction": ""
    }
  ],

  "minor": [],

  "strengths": [
    ""
  ],

  "repair_priority": [
    "M1",
    "M2"
  ],

  "restart_recommended": false
}
```

注意：

Critic 不直接给最终 Gate。

---

# 二十四、为什么保留 strengths

不是为了鼓励 Designer。

而是告诉 Repair：

> **哪些东西不要修坏。**

例如：

```text
保持：
主视觉层次非常好
核心拖拽手感已经成立
Typography 不需要重做
```

否则 Repair Agent 很容易：

修 A

把 B、C 一起毁掉。

---

# 二十五、Repair Agent

Repair 不能重新开始自由创作。

它的输入是：

```text
Current Work
+
Design Contract
+
Critic Issues
+
Keep List
```

它的目标：

**最小范围修复最大问题。**

---

# 二十六、Repair 输出策略

每次 Repair 开始前：

必须形成：

```text
Repair Plan
```

例如：

```text
M1：
重构第二屏的三卡片，使其重新进入地层连续空间。

M2：
为横向拖动增加分段吸附和深度指示。

保持：
首屏构图
色彩
主 Typography
岩层纹理
```

然后才修改代码。

---

# 二十七、禁止 Cosmetic Repair

如果 Critic 指出：

> 交互机制太浅。

禁止修成：

```text
增加 glow
增加 shadow
增加粒子
```

如果指出：

> 产品流程不成立。

禁止：

```text
优化颜色
```

问题必须被对应地修。

---

# 二十八、Repair 类型

统一分：

```text
ENGINEERING_REPAIR
DESIGN_REPAIR
```

---

## ENGINEERING_REPAIR

解决：

- Bug
- Broken Resource
- Runtime
- Layout
- Input Failure

---

## DESIGN_REPAIR

解决：

- Structure
- Interaction
- Product Logic
- Hierarchy
- Visual Language
- Motion

---

# 二十九、Repair 上限

推荐：

```text
ENGINEERING_REPAIR_MAX = 2
DESIGN_REPAIR_MAX = 2
```

不要无限循环。

---

# 三十、Restart

Restart 和 Repair 是两个完全不同的动作。

出现以下情况应该 Restart：

- 设计母题本身失败
- 核心交互没有价值
- 产品方向错误
- 与历史作品高度重复
- 设计 Contract 无法高质量落地
- 连续两次 Major Repair 仍不能解决

Restart 时：

```text
当前方向标记 FAILED
↓
记录失败原因
↓
回到 Art Director Candidate List
↓
选择下一候选
```

---

# 三十一、禁止 Restart 后重新随机生成五个方向

优先使用：

Candidate Ranking 中第二选择。

这样最初 Art Director 的工作不会浪费。

只有：

```text
全部候选都不成立
```

才重新 Ideate。

---

# 三十二、失败方向也应该写入 Decision Log

例如：

```json
{
  "candidate": "B",
  "status": "FAILED_IMPLEMENTATION",
  "reason": "横向地层模型在当前移动响应环境下无法保持阅读清晰度"
}
```

这不是 Design Memory。

是 Decision Memory。

以后 Art Director 可以知道：

> 这个方向为什么过去失败过。

---

# 三十三、Quality Gate

Quality Gate 是整个系统最后一个设计判断节点。

它不能长篇分析。

只允许：

```text
PASS
REPAIR
REJECT
```

---

# 三十四、Quality Gate 输入

输入：

```text
Design Contract
Final Screenshot / Runtime
Browser QA
Critic
Repair History
Novelty Report
Category Rubric
```

---

# 三十五、Quality Gate 输出

```json
{
  "decision": "PASS",

  "blocking_reasons": [],

  "scores": {
    "concept": 18,
    "structure": 13,
    "interaction": 14,
    "originality": 9,
    "technical": 10
  },

  "contract_fidelity": "FULL",

  "novelty_status": "PASS",

  "technical_status": "PASS"
}
```

---

# 三十六、Gate 不看平均分

这是非常重要的一点。

禁止：

```text
视觉 95
工程 40
平均 67
```

这种逻辑。

某些指标必须存在：

**最低门槛。**

---

# 三十七、Web Gate

建议关键门槛：

```text
Design Concept >= 16/20
Spatial Composition >= 12/15
Content Structure >= 12/15
Interaction & Motion >= 10/15
Technical Quality >= 8/10
```

并且：

```text
CRITICAL = 0
```

---

# 三十八、Phone Gate

```text
Product Logic >= 16/20
User Flow >= 16/20
Mobile Interaction >= 12/15
Information Architecture >= 12/15
Technical Quality >= 4/5
```

CRITICAL 必须为：

```text
0
```

---

# 三十九、Component Gate

```text
Utility & Need Authenticity >= 16/20
State Completeness >= 16/20
Interaction Feel >= 12/15
Reusability >= 11/15
Technical Quality >= 8/10
```

Component 可以视觉风格多样。

但：

**状态完整性和可复用性绝对不能低。**

---

# 四十、Gate 决策逻辑

## PASS

满足：

```text
Browser QA Pass
CRITICAL = 0
Contract Fidelity != FAILED
核心指标达到门槛
History Similarity 未严重重复
```

---

## REPAIR

出现：

- 1–2 个可修复 Major
- 核心方向仍成立
- 未超过 Repair Max

---

## REJECT

出现：

- Contract Failed
- 核心机制失败
- 高度模板重复
- 已超过 Repair Max
- Restart 仍失败

---

# 四十一、PASS 后才允许 Commit

禁止：

```text
Designer 完成
↓
直接 Git Commit
```

必须：

```text
QUALITY_GATE = PASS
```

才允许提交。

---

# 四十二、Memory Writer

作品 PASS 后执行。

它读取：

```text
Final Work
Design Contract
Critic
Decision Log
```

生成：

```text
Design Fingerprint
```

---

# 四十三、Memory Writer 原则

Memory 不是总结。

不要：

```text
这是一个非常漂亮的深海网站……
```

必须结构化。

例如：

```json
{
  "category": "web",

  "concept": {
    "motif": "deep_sea_sonar_station"
  },

  "structure": {
    "spatial_model": "fixed_stage_depth_scroll",
    "navigation": "depth_index"
  },

  "interaction": {
    "primary": "scroll_depth",
    "signature": "sonar_reveal"
  },

  "visual": {
    "material": "instrument_display",
    "density": "medium"
  }
}
```

---

# 四十四、Memory 不存什么

原则上不存：

```text
具体 padding
具体 margin
具体字号
具体 RGB
大量 DOM
大量 CSS
完整 README
完整代码
```

除非未来某项明确需要。

---

# 四十五、Pattern Counter

Memory Writer 完成后更新：

```text
pattern_stats.json
```

例如：

```json
{
  "web": {
    "spatial_model": {
      "vertical_sections": 18,
      "fixed_stage": 7,
      "horizontal_canvas": 4
    }
  }
}
```

---

# 四十六、Pattern Stats 最好增加 Recent Window

不仅统计总量。

还统计：

```text
all_time
last_10
last_20
last_50
```

因为：

5 个月前大量使用某模式

和：

最近连续使用 5 次

意义完全不同。

---

# 四十七、Pattern Pressure

返回 Art Director 的不是单纯次数。

可以转换：

```text
LOW
MEDIUM
HIGH
SATURATED
```

例如：

```json
{
  "pattern": "centered_hero",
  "recent_20": 9,
  "pressure": "SATURATED"
}
```

---

# 四十八、重要：SATURATED 不等于禁止

Art Director 仍然可以选择。

但必须给：

```text
justification
```

例如：

> 当前作品是品牌发布页，中心 Hero 是信息表达最直接的方法，因此虽然属于高重复结构，但具有明确功能理由。

这个理由会进入 Decision Log。

---

# 四十九、Novelty Checker

Novelty 不比较表面。

推荐权重：

```text
Structure            30
Primary Interaction  25
Design Motif         15
Information Model    15
Visual Language      10
Color/Typography      5
```

---

# 五十、Novelty 输出

```json
{
  "overall": "MEDIUM",

  "closest_matches": [
    {
      "project": "",
      "similarity": 0.72,
      "collision": [
        "fixed_stage",
        "scroll_reveal"
      ]
    }
  ],

  "high_risk_patterns": [],

  "recommendation": "PROCEED"
}
```

recommendation：

```text
PROCEED
JUSTIFY
RETHINK
```

---

# 五十一、Orchestrator 状态

建议第一版固定：

```text
START
ROUTE
LOAD_CONTEXT
IDEATE
NOVELTY_CHECK
SELECT
CONTRACT
IMPLEMENT
BROWSER_QA
ENGINEERING_REPAIR
CRITIC
DESIGN_REPAIR
RESTART
QUALITY_GATE
COMMIT
WRITE_MEMORY
END
FAILED
```

---

# 五十二、Orchestrator 核心状态机

```text
START
 ↓
ROUTE
 ↓
LOAD_CONTEXT
 ↓
IDEATE
 ↓
NOVELTY_CHECK
 ↓
SELECT
 ↓
CONTRACT
 ↓
IMPLEMENT
 ↓
BROWSER_QA
```

Browser QA：

```text
PASS
 ↓
CRITIC
```

FAIL：

```text
ENGINEERING_REPAIR
 ↓
BROWSER_QA
```

超过最大次数：

```text
RESTART or FAILED
```

---

# 五十三、Critic 后状态

```text
CRITICAL + restart_recommended
        ↓
RESTART
```

```text
MAJOR
 ↓
DESIGN_REPAIR
 ↓
BROWSER_QA
 ↓
CRITIC
```

```text
MINOR only
 ↓
QUALITY_GATE
```

---

# 五十四、Gate 后

```text
PASS
 ↓
COMMIT
 ↓
WRITE_MEMORY
 ↓
END
```

```text
REPAIR
 ↓
DESIGN_REPAIR
```

```text
REJECT
 ↓
RESTART
```

如果无候选可 Restart：

```text
FAILED
```

---

# 五十五、允许 FAILED

这是系统成熟的一个重要标志。

FAILED 不代表系统坏了。

FAILED 代表：

> 今天这个创意没有达到入库标准。

正确行为：

```text
不 Commit
```

而不是为了“每日生成任务”强行塞作品。

---

# 五十六、建议增加 Run Manifest

每次执行创建：

```text
run.json
```

例如：

```json
{
  "run_id": "2026-08-19-web-001",
  "category": "web",
  "topic": "",
  "selected_candidate": "B",
  "state": "CRITIC",
  "engineering_repairs": 1,
  "design_repairs": 0,
  "restarts": 0,
  "started_at": "",
  "updated_at": ""
}
```

---

# 五十七、为什么需要 Run Manifest

如果流程中断：

下一次可以知道：

> 上一次做到哪里。

而不是重新跑。

它同时方便未来分析：

- 平均 Repair 次数
- 哪类作品最容易失败
- 哪些方向经常 Restart
- 哪种 Agent 最容易出问题

---

# 五十八、Decision Log

每轮 Art Director 都应该生成：

```text
decision_log.json
```

记录：

```text
为什么选 B
为什么没选 A
为什么 C 风险高
为什么接受某个重复 Pattern
为什么 Restart
```

---

# 五十九、Critic History

建议每次 Critic 输出保存：

```text
critic_v1.json
critic_v2.json
```

不要覆盖。

这样未来可以观察：

> Repair 到底有没有真的解决问题。

---

# 六十、Screenshot History

建议保存：

```text
preview/
  v1.png
  v2.png
  final.png
```

以后做视觉相似度分析会非常有价值。

---

# 六十一、推荐目录

```text
Art/
│
├── agents/
│   │
│   ├── global.md
│   │
│   ├── web.md
│   │
│   ├── phone.md
│   │
│   ├── component.md
│   │
│   ├── art_director.md
│   │
│   ├── designer.md
│   │
│   ├── critic/
│   │   ├── web.md
│   │   ├── phone.md
│   │   └── component.md
│   │
│   ├── browser_qa.md
│   ├── repair.md
│   ├── quality_gate.md
│   └── memory_writer.md
│
├── memory/
│   │
│   ├── web.json
│   ├── phone.json
│   ├── component.json
│   ├── pattern_stats.json
│   └── decisions/
│
├── pipeline/
│   │
│   ├── orchestrator
│   ├── router
│   ├── context_loader
│   ├── novelty_checker
│   ├── browser_qa
│   ├── memory_writer
│   └── git_gate
│
├── runs/
│   └── <run_id>/
│       ├── run.json
│       ├── candidates.json
│       ├── novelty.json
│       ├── design_contract.md
│       ├── browser_qa_v1.json
│       ├── critic_v1.json
│       ├── repair_v1.json
│       ├── quality_gate.json
│       └── decision_log.json
│
├── web_mock/
├── phone_mock/
└── 组件/
```

---

# 六十二、Project 自身只保留最终产物

不要把大量 Agent 临时文件塞入作品目录。

作品目录保持：

```text
index.html
README.md
设计规范.md
preview/
assets/
必要源码
```

Agent 中间过程：

进入：

```text
runs/
```

---

# 六十三、Designer 输入

每次 Designer 只收到：

```text
GLOBAL RULES
+
CATEGORY RULES
+
PROJECT REQUIREMENTS
+
DESIGN CONTRACT
+
TECHNICAL BOUNDARY
```

不要把所有 Candidate 给 Designer。

防止它犹豫或融合多个方案。

---

# 六十四、Designer 输出要求

Designer 完成后必须提供：

```text
implementation_status
files_changed
core_interaction_status
known_limitations
```

例如：

```json
{
  "status": "COMPLETE",
  "core_interaction": "IMPLEMENTED",
  "known_limitations": []
}
```

---

# 六十五、Critic 输入必须隔离 Designer 自评

Critic 不需要看到：

```text
Designer 说自己做得很好。
```

只看：

```text
Design Contract
Result
Browser QA
History Context
Category Rules
```

这样减少自我暗示。

---

# 六十六、Quality Gate 也不要看到 Art Director 的夸奖

只看事实：

- Contract
- Final
- QA
- Critic
- Novelty
- Threshold

---

# 六十七、Git Gate

只有：

```text
quality_gate.decision == PASS
```

才执行：

```text
git add
git commit
```

---

# 六十八、Commit Message

建议保持简单。

例如：

```text
feat(web): add <project-name>
```

Repair 后不要为同一个生成流程产生很多 commit。

生成流程内部尽量只提交最终版本。

---

# 六十九、不要让自动流水线直接 Push 每一个中间状态

推荐：

```text
Local/Workspace
↓
完成 QA
↓
Gate
↓
Commit
↓
Push
```

避免垃圾中间结果进入仓库历史。

---

# 七十、第一版千万不要做这些

暂时不要：

- Vector DB
- Embedding 服务
- 多模型投票
- 5 个 Critic
- 自动视觉大模型评分集群
- 强化学习
- 自动 Design Token 聚类
- 复杂 Agent Framework
- Event Bus
- 分布式调度

---

# 七十一、V1 只需要 7 个真正角色

```text
Orchestrator
Art Director
Designer
Browser QA
Critic
Quality Gate
Memory Writer
```

Novelty Checker 可以先做普通程序逻辑。

Router 也可以是普通逻辑。

---

# 七十二、V1 最小闭环

第一版做到：

```text
① 用户给题目

② Router 判断目录

③ 读取最近 Memory

④ Art Director 产生 5 个方向

⑤ 选择 1 个

⑥ 生成 Design Contract

⑦ Designer 实现

⑧ Browser QA

⑨ Critic

⑩ 最多两轮 Repair

⑪ Quality Gate

⑫ PASS 后 Commit

⑬ Memory Writer 更新设计记忆
```

这已经足够验证整个系统价值。

---

# 七十三、第一次实验不要批量跑

第一轮建议分别选：

```text
1 个 Web
1 个 Phone
1 个 Component
```

和当前生成系统对照。

不要一次跑 30 个。

先观察：

- 是否真的更有创意
- 是否减少模板感
- Critic 是否能找到真问题
- Repair 是否真的提高质量
- Token 成本是否合理
- 整体耗时是否能接受

---

# 七十四、建议记录三个最关键指标

不要一开始统计 50 项 KPI。

先统计：

## First Pass Rate

第一次实现直接通过比例。

---

## Repair Effectiveness

Repair 后 Major 是否真的下降。

---

## Historical Novelty

与最近 20 个作品的结构重复是否下降。

---

# 七十五、长期可以增加一个 Failure Library

以后积累：

```text
failures/
```

例如：

```text
generic_landing_page
fake_mobile_flow
shallow_component_interaction
over_animation
card_everything
contract_regression
```

Critic 可以引用这些 Failure Pattern。

这样系统不仅记住：

> 什么作品做过。

还记住：

> 什么错误经常犯。

---

# 七十六、以后可以增加“成功模式”

但是不要做成模板。

记录的是：

```text
为什么成功
```

而不是：

```text
成功作品长什么样
```

例如：

好的：

> 核心交互和主题语义高度一致。

不好：

> 成功网页使用横向布局。

前者是原则。

后者会制造新模板。

---

# 七十七、系统最终应该具备两种记忆

## Design Memory

记住：

**做过什么。**

---

## Decision Memory

记住：

**为什么这样做。**

未来甚至可以增加：

## Failure Memory

记住：

**为什么失败。**

这三个组合起来，系统才会真正逐渐成熟。

---

# 七十八、Orchestrator 的最高原则

Orchestrator 必须始终遵守：

> 不追求每次都成功生成。

而追求：

> 每次入库的作品都值得留下。

---

# 七十九、Art Director 的最高原则

不是：

> 想一个炫酷创意。

而是：

> 找到一个既适合主题、又不同于历史、还能高质量实现的设计方向。

---

# 八十、Designer 的最高原则

不是：

> 自由发挥。

而是：

> 忠实完成已经锁定的设计观点，并把实现质量推到最高。

---

# 八十一、Critic 的最高原则

不是：

> 找几个可以优化的小点。

而是：

> 找出真正限制作品质量上限的问题。

---

# 八十二、Repair 的最高原则

不是：

> 继续装修。

而是：

> 修正结构性缺陷，同时保护已经成功的部分。

---

# 八十三、Quality Gate 的最高原则

不是：

> 尽可能让作品通过。

而是：

> 有勇气拒绝不值得入库的作品。

---

# 八十四、整个 Art 系统最终的核心逻辑

过去：

```text
Prompt
 ↓
AI
 ↓
HTML
 ↓
Commit
```

新的系统：

```text
题目
 ↓
理解
 ↓
历史
 ↓
创意竞争
 ↓
方向选择
 ↓
Contract
 ↓
高质量实现
 ↓
真实浏览器
 ↓
客观 QA
 ↓
独立设计 Critic
 ↓
精准 Repair
 ↓
Quality Gate
 ↓
只有真正合格的作品入库
 ↓
更新长期设计记忆
```

---

# 八十五、最终目标

这个系统不应该让 Art 变成：

**一个高产 UI 仓库。**

而应该逐渐变成：

**一个拥有设计判断、创作记忆和自我纠错能力的自动化数字设计实验室。**

真正衡量它是否成功的标准，不是：

> 今天生成了多少个页面。

而是：

> 第 100 个作品是否仍然能够明显区别于前 99 个，并且质量没有下降。

这是整个 Orchestrator 最终需要解决的问题。
