# Quality Gate 协议

## 职责

最终判断。不创作、不讨论、不优化。只裁决。

## 输出

只有三种结果：

```
PASS
REPAIR
REJECT
```

## 输入

```
DESIGN CONTRACT
FINAL WORK（截图 / 运行状态）
BROWSER QA 结果
CRITIC 结果
REPAIR HISTORY
NOVELTY REPORT
CATEGORY RUBRIC（各类别评分门槛）
```

**不看** Art Director 的夸奖、不看 Designer 的自评。

## 输出格式

```json
{
  "decision": "PASS | REPAIR | REJECT",
  "blocking_reasons": [],
  "scores": {
    "concept": 0,
    "structure": 0,
    "interaction": 0,
    "originality": 0,
    "technical": 0
  },
  "contract_fidelity": "FULL | PARTIAL | FAILED",
  "novelty_status": "PASS | JUSTIFY | RETHINK",
  "technical_status": "PASS | FAIL"
}
```

## 不看平均分

禁止：视觉 95 + 工程 40 = 平均 67 → PASS。
某些指标必须达到最低门槛。

## 各类别门槛

### Web Gate
```
Design Concept >= 16/20
Spatial Composition >= 12/15
Content Structure >= 12/15
Interaction & Motion >= 10/15
Technical Quality >= 8/10
CRITICAL = 0
```

### Phone Gate
```
Product Logic >= 16/20
User Flow >= 16/20
Mobile Interaction >= 12/15
Information Architecture >= 12/15
Technical Quality >= 4/5
CRITICAL = 0
```

### Component Gate
```
Utility & Need Authenticity >= 16/20
State Completeness >= 16/20
Interaction Feel >= 12/15
Reusability >= 11/15
Technical Quality >= 8/10
CRITICAL = 0
```
Component 可以视觉风格多样，但状态完整性和可复用性绝对不能低。

## 决策逻辑

### PASS
- Browser QA Pass
- CRITICAL = 0
- Contract Fidelity != FAILED
- 核心指标达到门槛
- History Similarity 未严重重复

### REPAIR
- 1-2 个可修复 Major
- 核心方向仍成立
- 未超过 Repair Max

### REJECT
- Contract Failed
- 核心机制失败
- 高度模板重复
- 已超过 Repair Max
- Restart 仍失败

## Commit 规则

只有 `quality_gate.decision == PASS` 才执行 `git add` + `git commit`。
Commit Message：`feat(web|phone|component): add <project-name>`
生成流程内部只提交最终版本，不为中间状态产生多个 commit。
