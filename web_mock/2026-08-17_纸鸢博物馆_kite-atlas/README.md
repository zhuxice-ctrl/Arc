# 纸鸢博物馆 Kite Atlas · 互动网站

> 日期：2026-08-17 · 方向：V1 网页设计 · 主题：世界纸鸢/风筝文化与制作工艺

## 简介

一个沉浸式互动网站，展示世界各地纸鸢/风筝的文化、制作工艺与飞行艺术。包含风筝历史时间线、制作四艺图解、世界风筝地图、互动飞行模拟器、风筝图鉴等六大板块。朱砂红+天青+宣纸米+墨黑+金赤配色，取自传统东方风筝的纸绢颜料。

## 妙搭在线预览

https://dcniaqwtmoca.feishu.cn/page/EGUEmdHRzdheEwaZWFKcpR8intb

## 截图

![纸鸢博物馆预览](./preview.png)

## 动效亮点

- 自定义光标：白环+金赤内点+多层发光，悬停放大，点击涟漪
- Hero 粒子系统：Canvas 粒子+连线+脉冲发光
- 漂浮风筝：视差滚动+CSS 飘动动画
- 3D 倾斜图鉴卡片：requestAnimationFrame 平滑跟随鼠标
- 风筝飞行物理模拟：风速/角度/张力实时计算
- 打字机效果、数字计数、卷轴渐入、光泽扫过等 15+ 组件级特效

## 文件说明

| 文件 | 说明 |
|------|------|
| index.html | 完整可运行的源代码（纯 vanilla HTML/CSS/JS 单文件） |
| 设计规范.md | 色彩系统、字体、组件、动效、页面结构规范 |
| preview.png | 页面截图预览 |
| thumbnail.png | 缩略图 |

## 技术栈

纯 vanilla HTML/CSS/JS 单文件，Canvas 2D 渲染粒子与飞行模拟。无 React/Babel/CDN 依赖。支持 prefers-reduced-motion。
