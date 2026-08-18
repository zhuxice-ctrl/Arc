# 冰灯营造志 · Ice Lantern Chronicle

**类别**：Web Mock　**日期**：2026-08-19

## 主题
哈尔滨冰灯制作工艺——从松花江采冰到冰灯点亮的完整过程。

## 简介
一个沉浸式夜间冰灯公园漫步网站。滚动页面即步行深入公园，途经采冰场、雕琢工坊、浇筑现场、内嵌灯光站，最终到达点灯时刻的高潮。温暖灯光从半透明冰体内透出，与寒冷夜色形成强烈对比。尾声是冰灯消融——它们只存在40-60天。

## 截图

![preview](preview.png)

## 妙搭预览

https://dcniaqwtmoca.feishu.cn/page/UD7LmtyAHdndPqa4wfWcOb6TnVb

## 文件说明

| 文件 | 说明 |
|------|------|
| `index.html` | 完整单文件实现（HTML+CSS+JS 内联） |
| `preview.png` | 页面截图 |
| `设计规范.md` | 色彩、字体、动效系统详细规范 |

## 技术栈
纯 vanilla HTML + CSS + JS，无外部依赖。RAF 驱动动画，document.hidden 可见性暂停，prefers-reduced-motion 降级。

## 核心交互
- 滚动驱动的冰灯渐亮（光从冰体内部向外扩散）
- 六角冰晶自定义光标
- 采冰切割线绘制
- 数据数字滚动计数
- 鼠标视差（±5px）
- 尾声消融模糊
