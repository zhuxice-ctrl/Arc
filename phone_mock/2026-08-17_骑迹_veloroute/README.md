# 骑迹 VeloRoute · 骑行路线 App

> 日期：2026-08-17 · 方向：V2 手机 UI · 形态：原生 App · 主题：骑行路线与骑行记录

形态：原生 App

## 简介

统一手机外壳内的 8 页骑行路线与记录原生 App：发现路线、路线详情、骑行记录、装备库、骑行圈、个人主页，附设计规范页与 API 文档页。运动机能气质（信号橙 + 沥青灰 + 荧光黄 + 暖白 + 石灰绿）。原生交互含底部 TabBar（中央 FAB 凸起）、返回栈、模态弹窗、下拉刷新、毛玻璃导航、长按弹性卡片。

## 截图

![preview](./preview.png)

## 动效亮点

自定义光标、入场序列错峰、滚动视差缩放、环形进度、实时计时器/地图轨迹描绘、脉冲指示器、Tab 下划线过渡、FAB 发光、下拉刷新旋转器。

## 妙搭在线预览

https://dcniaqwtmoca.feishu.cn/page/VynRmj7RKdOWImaEsUDcLcJYnXf

## 文件说明

| 文件 | 说明 |
|------|------|
| index.html | 完整可运行源码（JSX/CSS 全内联） |
| components/ | 组件目录（由妙搭脚手架生成） |
| 设计规范.md | 色彩/字体/组件/动效/页面结构 |
| preview.png | 页面截图 |
| thumbnail.png | 平台缩略图 |
| README.md | 本说明 |

## 技术栈

React 18 + Babel standalone（全内联），原生 App 交互语言，支持 prefers-reduced-motion 与 visibilitychange 暂停。
