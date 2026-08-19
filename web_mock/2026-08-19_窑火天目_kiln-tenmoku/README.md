# 窑火天目·建盏烧成

## 主题

建盏烧成可视化走廊 — 以宋代建窑天目盏为锚点，沿窑温梯度展示四种经典釉面。

## 简介

一个真实可交互的单页网站，以「温度梯度走廊」为核心空间模型：参观者以自定义窑火光标在 600°C→1350°C 的温区中穿行，沿途四盏建盏（兔毫、油滴、曜变、柿天目）锚定在各自烧成温度上，随光标接近实时呈现釉面纹路变化。背景色温、射灯光斑、温度计侧栏均随滚动联动。纯 vanilla 单文件实现，无外部依赖。

## 截图展示

![窑火天目预览](preview.png)

## 妙搭预览链接

https://dcniaqwtmoca.feishu.cn/page/FcTTmApqMdQOkraIISecDdicnKb

## 文件说明

| 文件 | 说明 |
|------|------|
| `index.html` | 完整源码（纯 vanilla 单文件，~69KB） |
| `preview.png` | 1440×900 桌面端截图 |
| `设计规范.md` | 色彩/字体/动效系统规范 |

## 技术栈

- 纯 vanilla HTML/CSS/JS 单文件
- Canvas 2D 绘制釉面粒子纹路
- CSS Custom Properties 设计令牌
- requestAnimationFrame + IntersectionObserver
- prefers-reduced-motion 降级
