# 羽踪 · 观鸟记录 App · 手机 UI Mock

> 日期：2026-08-18 · 方向：V2 手机 UI · 形态：原生 App · 主题：观鸟记录原生应用

![羽踪预览](./preview.png)

## 简介

「羽踪」是一款观鸟记录原生 App 的设计 mock，在统一手机外壳内可切换 8 个页面：首页今日观鸟、鸟种图鉴（瀑布流）、鸟种详情（视差+声波）、新增观测记录、观鸟地点（地图/列表双视图）、个人中心（环形进度）、设计规范、接口文档。原生交互含底部 TabBar、返回栈导航、下拉刷新、FAB、模态弹窗、长按快捷菜单、地图 Pin 脉冲。配色为深墨绿 + 暖橙 + 米白 + 羽灰，禁用蓝紫渐变。

## 形态标记

形态：原生 App（上一次为微信小程序，本次交替为原生 App）

## 动效亮点

- 自定义光标（阻尼跟随 + hover 放大 + 点击涟漪）、羽毛飘落粒子
- 首页入场序列（Hero 渐入+卡片级联+数字计数）、详情页视差滚动+吸附标题栏+声波条、个人页环形进度弹簧
- 地图 Pin 脉冲发光、FAB 呼吸脉冲、按钮光泽扫过、Toast 弹跳

## 文件说明

| 文件 | 说明 |
|------|------|
| index.html | 完整可运行源码（React，JSX 已内联于 text/babel 标签） |
| components/ | 源码组件副本（ios-frame.jsx、tweaks-panel.jsx） |
| 设计规范.md | 色彩/字体/组件/动效/页面结构规范（含形态标记） |
| preview.png | 页面截图 |

## 技术栈

React 18 + Babel standalone（JSX 内联），CDN 走飞书静态镜像。支持 `prefers-reduced-motion`，动画循环随 `visibilitychange` 暂停。

## 在线预览

[羽踪 · 妙搭在线预览](https://dcniaqwtmoca.feishu.cn/page/AkBFmTNPIdBlt7a0EvccJpOJn5f)
