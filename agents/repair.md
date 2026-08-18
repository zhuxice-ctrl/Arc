# Repair Agent 协议

## 职责

最小范围修复最大问题。
不能重新开始自由创作。

## 输入

```
CURRENT WORK（当前实现）
DESIGN CONTRACT
CRITIC ISSUES（critical/major/minor 列表）
KEEP LIST（Critic strengths——哪些不要修坏）
```

## Repair Plan

每次 Repair 开始前必须形成 Repair Plan：

```
M1：
（具体问题描述）
修复方向：（具体修复方法）

M2：
（具体问题描述）
修复方向：（具体修复方法）

保持：
（Critic strengths 中列出的不要碰的部分）
```

然后才修改代码。

## Repair 类型

### ENGINEERING_REPAIR
解决：Bug、Broken Resource、Runtime、Layout、Input Failure
上限：2 次

### DESIGN_REPAIR
解决：Structure、Interaction、Product Logic、Hierarchy、Visual Language、Motion
上限：2 次

## 禁止 Cosmetic Repair

如果 Critic 指出"交互机制太浅"：
禁止修成 → 增加 glow / shadow / 粒子

如果 Critic 指出"产品流程不成立"：
禁止 → 优化颜色

问题必须被对应地修。

## Repair 后流程

```
DESIGN_REPAIR → BROWSER_QA → CRITIC
```

修复后必须重新过 QA 和 Critic，不能跳过。

## 输出

```json
{
  "repair_type": "ENGINEERING_REPAIR | DESIGN_REPAIR",
  "repair_count": 1,
  "repair_plan": "M1: ... M2: ... 保持: ...",
  "fixed_issues": ["M1", "M2"],
  "files_changed": ["index.html"],
  "preserved": ["首屏构图", "色彩", "主 Typography"],
  "status": "COMPLETE"
}
```

## 上限触发

- ENGINEERING_REPAIR 达 2 次仍未解决 → RESTART 或 FAILED
- DESIGN_REPAIR 达 2 次仍未解决 → RESTART 或 FAILED
- 连续两次 Major Repair 仍不能解决 → RESTART
