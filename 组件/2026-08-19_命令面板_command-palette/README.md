# 命令面板 · Command Palette ⌘K

> 类别：V3 交互组件（导航类）｜日期：2026-08-19｜妙搭预览：https://dcniaqwtmoca.feishu.cn/page/MGLWmgdSfddgkBaIl8CclsDinXe

![preview](./preview.png)

## 主题与简介

生产级 ⌘K 命令面板——模糊搜索 + 分组结果 + 全键盘导航 + 完整状态机，实用可复用 UI 组件。按 ⌘K（Mac）/ Ctrl+K（Win）唤起，输入关键词模糊匹配命令，命中字符高亮，结果按「最近 / 命令 / 导航 / 搜索」分组，↑↓ 导航、Enter 执行、Esc 关闭。

这是 V3「实用可复用 UI 组件」方向——目的是方便利用到别的项目开发中，不是物理演示装置。配色为石墨灰 `#2B2D31` + 琥珀强调 `#F2A93B` + 米白 `#F4F2EE`（非蓝紫渐变）。

## 状态机（8 态全覆盖）

closed → open-empty（最近命令）→ open-typing → loading（异步命令）→ results（分组）→ no-results → error → disabled。底部状态演示按钮可逐一触发。

## 键盘交互

- `⌘K` / `Ctrl+K` 唤起，`Esc` 关闭
- `↑` `↓` 导航（跨分组循环），`Enter` 执行，`Home/End` 跳首尾
- 焦点环可见，`aria-*` 完整，hover 与键盘焦点同步

## 可复用性

- **主题化**：20+ CSS 变量（`--cmd-bg` / `--cmd-accent` / `--cmd-radius` / `--cmd-fg` 等），深浅双主题一键切换
- **配置化**：JS 通过 `commands` 数组配置（label / group / action / hotkey / keywords）
- **自包含**：组件代码与展示页边界清晰（`.cmd-` 前缀 + `CommandPalette` 类），复制到新项目改 ≤3 处即可运行
- **五层体验**：hover/focus 高亮（预接触）→ Enter 咬合 → ↑↓ 逐帧跟手 → 跨分组阈值 → Toast 余震收尾

## 用法（三步接入）

1. 复制 `index.html` 中组件区块的 CSS + HTML + JS
2. 在 `:root` 调整 `--cmd-bg` / `--cmd-fg` / `--cmd-accent` 等变量匹配你的主题
3. 注册你的命令数据到 `commands` 数组（含 label / group / action / keywords / hotkey）

## 真实命令内容（中文为主）

新建文档、切换深色模式、复制当前链接、跳转到设置、搜索：张三、导出为 PDF、邀请成员、查看快捷键等，分组：操作 / 导航 / 搜索 / 最近。

## 文件说明

- `index.html`——单文件源码（HTML + CSS + JS）
- `设计规范.md`——状态机 / 色值变量 / 字体 / 动效 / 可访问性
- `preview.png`——桌面 1280×820 截图
- `thumbnail.png`——妙搭缩略图

## 技术栈

纯 vanilla 单文件，无 React / Babel / CDN。所有 DOM 引用前判空，定时器集中管理（`_timers` Set + `destroy()` 清理），`visibilitychange` 监听，`prefers-reduced-motion` 降级，防抖搜索。零未定义引用，Console 无严重 Error。

## 设计自查

- ✅ 实用 UI 组件（非物理演示装置），真实项目高频复用
- ✅ 状态机完整：8 态可见（含 disabled / loading / error / focus）
- ✅ 全键盘可操作，焦点环可见，ARIA 完整
- ✅ CSS 变量主题化，深浅双主题，≤3 处可接入
- ✅ 删装饰动画后组件仍完整可用
- ✅ 配色石墨灰 + 琥珀强调（非蓝紫渐变），与 V1/V2 互斥
- ⏳ 等待协调者检查后提交 GitHub
