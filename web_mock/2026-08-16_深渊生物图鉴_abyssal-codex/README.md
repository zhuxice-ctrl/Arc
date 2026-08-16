# 深渊生物图鉴 Abyssal Codex

> Arc 每日设计 Mock · 2026-08-16 batch5 · V1 网页设计

![预览](./preview.png)

## 在线预览

https://dcniaqwtmoca.feishu.cn/page/PLKRmbAhLdC5ofaNUkdcUiFVnKf

## 概述

一个真实可交互的深海生物图鉴杂志/科普官网。访客从刊头声呐波纹走进，依次浏览图鉴档案、深度带、荧光画廊、深渊科考史时间线、季刊订阅。博物学杂志气质 + 深海仪器读数感。

- **方向**：网页设计（杂志/科普官网）
- **主题**：深渊生物图鉴
- **配色**：暗墨绿黑 #04130d + 生物荧光青 #00e5a0 + 珊瑚粉 #ff5e7a + 深海银灰 #9fb3b0（无蓝紫渐变）
- **实现**：纯 vanilla 单文件 HTML+CSS+JS，无 React/Babel/CDN 依赖

## 交互说明

- 滚动浏览 6 大区块，内容渐入。
- 鼠标移动驱动背景海洋雪粒子漂流与生物卡片 3D 倾斜。
- 深度带切换：不同海洋深度层激活，深度读数弹簧插值。
- 荧光画廊悬停发光，CTA 按钮光泽扫过，点击涟漪。
- 自定义光标开页即显示在屏幕中央，悬停可交互元素形态变化。

## 动效原理

详见 [设计规范.md](./设计规范.md)。13 个组件级特效，基于物理模型（弹簧 Hooke、阻尼、easeOutCubic）与深海主题语义（海洋雪、声呐波、荧光脉冲、洋流漂流）。

## 健壮性

- RAF 随 visibilitychange 暂停，卸载统一取消。
- 高频 mousemove 直接操作 DOM transform。
- 支持 prefers-reduced-motion。
- 零未定义引用。

## 文件结构

```
2026-08-16_深渊生物图鉴_abyssal-codex/
├── index.html
├── preview.png
├── 设计规范.md
└── README.md
```

## 本地运行

直接用浏览器打开 `index.html`；或 `python3 -m http.server` 后访问。
