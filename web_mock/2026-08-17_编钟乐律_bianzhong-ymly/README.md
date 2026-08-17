# 编钟乐律 Bianzhong Ymly

> 日期：2026-08-17 · 方向：V1 网页设计 · 主题：中国古代编钟与乐律文化展示官网

## 简介

「编钟乐律」是一个以中国古代编钟文化为主题的沉浸式展示官网。网站围绕青铜绿+暗金的配色体系，呈现编钟的厚重质感与古文明韵味。包含 Hero 主视觉、馆藏珍品（曾侯乙编钟等）、五声音阶交互演示、铸造工艺时间线、虚拟敲钟互动、近期展览等 7 个区块。

## 截图展示

![编钟乐律预览](./preview.png)

## 动效亮点

- 自定义青铜光标（开页居中、悬停放大、点击涟漪）
- Hero 标题逐字浮现 + 青铜粒子上升
- 编钟卡片 3D 倾斜（鼠标位置驱动）
- 五声音阶点击振动 + Web Audio 合成钟声
- 声波扩散动画（同心圆波纹）
- 时间线滚动驱动金色进度展开
- 导航栏滚动吸顶变色

## 妙搭在线预览

https://dcniaqwtmoca.feishu.cn/page/BuTXmcHBNdBq5OacgT5cboBRnod

## 文件说明

| 文件 | 说明 |
|------|------|
| index.html | 完整源码（纯 HTML/CSS/JS 单文件） |
| preview.png | 页面截图 |
| thumbnail.png | 缩略图 |
| 设计规范.md | 设计规范文档 |

## 技术栈

- 纯 HTML/CSS/JS 单文件实现（无 React/Babel/外部 CDN 依赖）
- Web Audio API 合成五声音阶钟声
- IntersectionObserver 滚动检测
- 支持 prefers-reduced-motion 降级
