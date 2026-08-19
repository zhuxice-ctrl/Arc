# 2026-08-20 V3 开关与提示 Art Director + 流水线结果

## 五个正交候选

| # | 组件 | 类别 | novelty | fit | risk |
|---|---|---|---|---|---|
| A | Tooltip/Popover 智能定位 | 覆盖层 | 8 | 9 | MEDIUM |
| B | Toggle 开关（同步/异步回滚） | 输入 | 7 | 9 | LOW |
| C | Progress 进度家族 | 反馈 | 7 | 8 | LOW |
| D | Timeline 时间轴 | 数据展示 | 8 | 7 | MEDIUM |
| E | Kanban 跨列拖拽 | 数据展示 | 7 | 8 | HIGH（与 sortable-list 近亲） |

## 选择：A + B

**理由**：覆盖层 vs 输入双类别正交，均为真实项目 top 高频且历史未做；A 签名手感在智能翻转与延迟编组，B 签名手感在弹簧滑块与异步回滚，状态机均可 ≥7 态。E 近亲重复+高风险排除；C/D 手感或需求频率偏弱留待后续。

## Design Contract 摘要

- core_idea: Toggle（弹簧滑块+异步 loading/error 回滚）+ Tooltip（三触发+边缘智能翻转+箭头跟随）
- 场景: 「拾光手帐」通知与隐私设置面板（3 同步开关 + 3 异步开关：必成功/必失败回滚/随机）
- must_keep: Toggle 8 态含 loading/error 回滚 / Tooltip hover300+focus+touch+Esc / computePlace 四向翻转 / 25+ CSS 变量三主题 / 纯 vanilla / 键盘 Space/Enter/Esc / prefers-reduced-motion
- must_not_regress_to: 物理演示装置 / 按钮 glow / 蓝紫渐变 / 耦合不可抽取

## 流水线结果

- **Browser QA**: PASS — 1440px std 18.18、390px std 26.84 均非空白；Console 无 Error；无横向溢出（右边缘均值 251.6 近白）。
- **Critic**: Contract Fidelity FULL；无 CRITICAL。
  - MINOR-1：Toggle disabled+checked 态用 `--tg-disabled-bg`（灰）覆盖激活色，禁用但开 的开关视觉上偏 off，常规做法是保留强调色降透明度——非阻断。
  - MINOR-2：Tooltip `positionFor` 未对 `left` 做视口钳制，锚点贴近右边缘且浮层较宽时浮层可能贴边/箭头不再精确指向锚点中心——非阻断，因智能翻转已尽量避开。
- **Quality Gate**: PASS — Utility≈18/20 / State≈18/20（Toggle 8 态 + Tooltip focus/touch/disabled）/ Feel≈13/15 / Reuse≈13/15 / Tech≈9/10 / CRITICAL=0。
- **verdict**: PASS

## 工程亮点

- `PausableTimer` 工具统一管理所有 setTimeout：按 key 复用（同 key 先 clear 再 set，快速操作不叠加）、visibilitychange 隐藏 pauseAll/恢复 resumeAll。
- Tooltip 智能翻转 `computePlace()`：首选→对侧→正交→最大空间四级回退，箭头随 data-place 四向翻转。
- 组件 CSS / JS 与展示页用注释块 + 命名空间 IIFE 严格分区，抽取成本 ≤3 处变量。
