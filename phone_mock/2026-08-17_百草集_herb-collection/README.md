形态：原生 App

# 百草集 Herb Collection · 中草药百科原生 App

**日期**：2026-08-17
**方向**：V2 手机 UI
**形态**：原生 App（iOS 原生应用产品形态与交互语言）
**主题**：传统中草药百科与药方管理应用

## 简介

百草集是一个面向中草药爱好者、中医药学习者的原生应用，功能涵盖草药百科浏览、药方收藏、炮制方法、节气养生、个人药柜管理。采用草药绿 + 暖木棕 + 赤陶红 + 米纸色的配色方案，营造传统草本文化氛围。包含 24 种真实中草药、6 个经典药方、24 节气养生建议。

## 截图

![百草集预览](./preview.png)

## 动效亮点

- 首页入场序列动画：节气 Hero → 轮播 → 网格分层渐入
- 详情页视差滚动：Hero 图随滚动缩放 + 模糊
- 药典页下拉刷新弹性回弹
- 个人页环形进度 SVG 绘制动画
- TabBar 选中态微动效
- 药方堆叠卡片左右滑动切换
- 长按快捷菜单弹出

## 文件说明

| 文件 | 说明 |
|------|------|
| index.html | 应用入口（含 Babel 内联 JSX） |
| app.jsx | 主应用组件 |
| components/ | 共享组件（Icon、ios-frame、tweaks-panel） |
| pages/ | 8 个页面组件 |
| data/herbs.js | 中草药数据 |
| preview.png | 应用截图 |
| 设计规范.md | 设计规范文档（含形态标记） |

## 在线预览

[百草集](https://dcniaqwtmoca.feishu.cn/page/Brufm17EKdk52wahoxVcsNHxnNf)

## 技术栈

- React + Babel Standalone（JSX 内联在 index.html）
- CSS 变量系统
- SVG 动画
- 触摸/鼠标事件交互
