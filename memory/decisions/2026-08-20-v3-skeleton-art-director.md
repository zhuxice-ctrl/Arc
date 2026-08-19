# 2026-08-20 V3 骨架屏 Art Director 决策记录

## 五个正交候选

| # | 组件 | 类别 | novelty | fit | risk |
|---|---|---|---|---|---|
| 1 | 骨架屏 Skeleton | 反馈 | 9 | 9 | 2 |
| 2 | Tooltip/Popover 智能定位 | 覆盖层 | 8 | 9 | 4 |
| 3 | 分段选择器 Segmented | 输入 | 7 | 8 | 1 |
| 4 | 抽屉 Drawer | 覆盖层 | 6 | 8 | 3 |
| 5 | 时间轴 Timeline | 数据展示 | 8 | 7 | 2 |

## 选择：骨架屏 Skeleton

**理由**：
- 历史复盘：反馈类此前只做过 toast，骨架屏是高频真实组件且空白。
- 与近期组件不重复（command palette / combobox / color-picker+rating / upload+button / pagination / OTP / accordion / bottom sheet / context-menu / date-range / drag-reorder / long-press / range-slider / swipe / tabs / tag-input / tree / modal / stepper 均无骨架屏）。
- 四种不同布局区块（主卡/网格/条/列表）天然验证模板表达力，状态机覆盖面广。
- execution risk 低，能一次做深做完整。

## Design Contract 摘要

- core_idea: 骨架屏异步加载反馈组件完整闭环
- 场景: 中文城市天气面板（杭州/成都/厦门）
- must_keep: 声明式7图元模板 / loading→success/error/empty流转 / shimmer+reduced-motion / aria-busy+role=status+aria-live / 键盘重试自动聚焦 / 20+ CSS变量 / 工厂API+destroy / 纯vanilla零依赖
- must_not_regress_to: 纯灰条堆叠无布局对应 / 只有loading无error/empty / 删动效后残缺 / 硬编码主题 / 多组件半成品

## 流水线结果

- Browser QA: PASS（std 66、无 console error、真实内容渲染、无 undefined）
- Critic: Contract Fidelity FULL，无 CRITICAL，MINOR 仅截图截到加载态混合（不影响功能）
- Quality Gate: PASS（Utility≥16 / State≥16 / Feel≥12 / Reuse≥11 / Tech≥8 / CRITICAL=0 全满足）
- verdict: PASS
