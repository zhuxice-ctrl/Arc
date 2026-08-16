# 熔岩玻璃工坊 Magma Glass Atelier

> Arc 每日设计 Mock · 2026-08-16 batch4 · V1 网页设计

![预览](./preview.png)

## 在线预览

https://dcniaqwtmoca.feishu.cn/page/Fd1bmyLjKdkOaiatGtccYGrvnQh

## 概述

一个真实可交互的熔岩玻璃手作工坊品牌官网。访客从门廊走进，依次浏览四段工艺、器皿藏品、匠人炉温、色彩光谱、到访预约。整站暖色单色叙事，以熔岩粒子背景与 3D 倾斜藏品为核心视觉。

- **方向**：网页设计（品牌官网）
- **主题**：熔岩玻璃工坊
- **配色**：炭黑底 + 熔岩橙红 #ff4d1a + 琥珀金 #e8a317（无蓝紫渐变）
- **实现**：纯 vanilla 单文件 HTML+CSS+JS，无依赖

## 交互说明

- 滚动浏览各 section，内容渐入。
- 鼠标移动驱动背景熔岩粒子扰动与藏品卡片 3D 倾斜。
- 悬停按钮/藏品有发光与光泽扫过；点击产生涟漪。
- 拖动色彩光谱滑块改变全局色调。
- 自定义光标开页即显示在屏幕中央，悬停可交互元素形态变化。

## 动效原理

详见 [设计规范.md](./设计规范.md)。12+ 组件级特效，基于物理模型（反平方引力、弹簧阻尼、RAF 积分器）与主题语义（熔岩气泡上浮、流光呼吸）。

## 健壮性

- requestAnimationFrame 随页面可见性暂停，卸载统一取消。
- 高频 mousemove 直接操作 DOM transform，不触发重渲染。
- 支持 prefers-reduced-motion。
- 零未定义引用。

## 文件结构

```
2026-08-16_熔岩玻璃工坊_magma-glass-atelier/
├── index.html       # 单文件源码
├── preview.png      # 截图
├── 设计规范.md
└── README.md
```

## 本地运行

直接用浏览器打开 `index.html` 即可；或 `python3 -m http.server` 后访问。
