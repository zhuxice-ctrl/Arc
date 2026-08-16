# Orbital 轨道天文台

- **日期**：2026-08-16
- **方向**：V1 网页设计（web_mock）
- **主题**：复古未来主义私人天文台官网——观星之夜预约、望远镜收藏、天象档案

![预览](./preview.png)

## 简介

深空黑底 + 熔岩橙 + 月白 + 黄铜的深色单页官网。全页三层视差星空 Canvas、4 层行星轨道环、周期流星，围绕天文语义组织全部动效。含真实可交互的观星预约日历（可翻月、可约/约满状态）、三栏天象档案 Tab、滚动计数统计带。

## 动效亮点

弹簧物理自定义光标（悬停三态 + 点击涟漪）、星空视差闪烁、轨道环差速旋转、流星尾迹衰减、打字机副标题、卡片 3D 倾斜 + 光泽扫过、IntersectionObserver 滚动渐入、数字计数等 13+ 组件级特效。

## 文件说明

| 文件 | 说明 |
|---|---|
| `index.html` | 完整单文件源码（JSX 内联，可直接浏览器打开） |
| `tweaks-panel.jsx` | 微调面板源码（已内联进 index.html） |
| `设计规范.md` | 色彩 / 字体 / 组件 / 动效 / Tweaks 规范 |
| `preview.png` / `thumbnail.png` | 页面截图 |
| `README.md` | 本文件 |

## 在线预览

妙搭链接：https://dcniaqwtmoca.feishu.cn/page/BhnEml5eLdE7hXaZZT7cO7XlnYc

## 技术栈

HTML + React 18（CDN）+ Babel standalone 内联 JSX + Canvas；Tweaks 面板 7 项实时调节；支持 prefers-reduced-motion。
