# 候鸟迁徙观测站 · Migratory Atlas

> 2026-08-16 · 网页设计（V1） · 单页可交互官网

一个虚构的候鸟迁徙观测组织官网：观测站介绍、当季迁徙走廊地图（4 大迁飞区）、6 种鸟类物种图鉴、实时观测日志（自动滚动 + 24h 柱状图）、志愿者招募。

![预览](./thumbnail.png)

## 设计说明

- **配色**：蛋壳米白 `#F5F1E8` + 炭黑 `#1C1B1A` + 落日茜红橙 `#E4572E`，辅以羽灰色阶，田野笔记式自然观感
- **字体**：Source Serif 4（展示）/ IBM Plex Sans（正文）/ JetBrains Mono（数据）
- **动效亮点**：羽毛粒子飘落、迁徙飞线描边、3 鸟编队沿路径巡航、罗盘视差、卡片 3D 倾斜 + 光泽扫过、打字机标题、数字计数、自定义光标（弹簧跟随 + 涟漪）
- 详见 [设计规范.md](./设计规范.md)

## 在线预览

飞书妙搭应用：https://dcniaqwtmoca.feishu.cn/page/DxLYm5VcId16p5aDWavcYAfTnkE

## 文件说明

| 文件 | 说明 |
|------|------|
| `index.html` | 入口（加载 CDN 与组件） |
| `styles/global.css` | 全局样式与设计令牌 |
| `src/*.jsx` | React 组件（13 个） |
| `设计规范.md` | 色彩 / 字体 / 组件 / 动效规范 |
| `thumbnail.png` | 页面截图 |

## 技术栈

React 18 + Babel Standalone + ECharts 5.6 + 纯 CSS，无构建步骤。
