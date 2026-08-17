# 巷往 · 城市漫步约伴小程序

形态：微信小程序

> 日期：2026-08-17 · 方向：V2 手机 UI · 形态：微信小程序 · 主题：城市漫步（citywalk）路线发现与同好约伴

## 简介

一个城市漫步路线发现与同好约伴的微信小程序，含首页路线卡片流、发现页瀑布流、路线详情时间轴、约伴活动左滑操作、个人中心环形进度、活动报名表单，以及设计规范页与接口文档页。砖红 + 鹅黄 + 深橄榄绿 + 奶油白配色，套在带胶囊按钮的统一手机外壳内。

## 截图

![巷往预览](./thumbnail.png)

## 动效亮点

- 首页入场序列动画（5 段延迟渐入）
- 路线详情页视差滚动 Hero
- 个人中心三环形进度动效
- 底部 TabBar 弹跳选中、下拉刷新弹性回弹、左滑列表操作、ActionSheet 半屏弹层
- 自定义光标：白环 + 砖红内点，悬停变鹅黄，点击涟漪

## 妙搭在线预览

https://dcniaqwtmoca.feishu.cn/page/Q0Vpmx5Fid6Vyya4CZycu11tnmc

## 文件说明

| 文件 | 说明 |
|---|---|
| index.html | 完整可运行入口（React + Babel 内联） |
| components/ | 源码组件（ios-frame.jsx、tweaks-panel.jsx） |
| 设计规范.md | 色彩系统、字体、端侧交互、页面结构、动效 |
| thumbnail.png | 页面截图 |
| README.md | 本说明文件 |

## 技术栈

React 18 + Babel standalone（JSX 内联于 index.html），纯前端单页，无后端依赖。
