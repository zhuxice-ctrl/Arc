# Memory Writer 协议

## 职责

将最终设计转换为结构化 Design Fingerprint。
不负责创作，不负责评分。

## 触发时机

作品 PASS 后执行。

## 输入

```
FINAL WORK
DESIGN CONTRACT
CRITIC 结果
DECISION LOG
```

## 输出：Design Fingerprint

写入 `memory/{category}.json`（追加到数组末尾）：

```json
{
  "id": "2026-08-19-web-001",
  "category": "web | phone | component",
  "date": "2026-08-19",
  "concept": {
    "motif": "",
    "concept_statement": ""
  },
  "structure": {
    "spatial_model": "",
    "navigation": ""
  },
  "interaction": {
    "primary": "",
    "signature": ""
  },
  "visual": {
    "material": "",
    "density": "low | medium | high",
    "color_logic": "",
    "typography_logic": ""
  },
  "motion": {
    "language": "",
    "primary_effect": ""
  },
  "contract": {
    "core_idea": "",
    "must_keep": [],
    "must_not_regress_to": []
  }
}
```

## 不存什么

```
具体 padding
具体 margin
具体字号
具体 RGB
大量 DOM
大量 CSS
完整 README
完整代码
```

## Pattern Stats 更新

写入后同步更新 `memory/pattern_stats.json`：

```json
{
  "web": {
    "spatial_model": {
      "vertical_sections": { "all_time": 18, "last_10": 2, "last_20": 4, "last_50": 8 },
      "fixed_stage": { "all_time": 7, "last_10": 1, "last_20": 2, "last_50": 5 }
    }
  }
}
```

## Pattern Pressure 计算

返回 Art Director 时转换为压力等级：
- all_time < 5 且 recent_20 < 3 → LOW
- recent_20 3-5 → MEDIUM
- recent_20 6-8 → HIGH
- recent_20 >= 9 → SATURATED

SATURATED 不等于禁止，Art Director 仍可选，但需 justification。

## Decision Memory

失败方向写入 `memory/decisions/`：

```json
{
  "candidate": "B",
  "status": "FAILED_IMPLEMENTATION",
  "reason": "横向地层模型在当前移动响应环境下无法保持阅读清晰度",
  "date": "2026-08-19"
}
```

未来 Art Director 可以知道这个方向为什么过去失败过。
