# 邮驿 StampPost · 邮票收藏 App

> 日期：2026-08-17 ｜ 方向：V2 手机 UI ｜ 形态：原生 App ｜ 主题：邮票收藏与鉴赏

## 形态

形态：原生 App（iOS 风格）。交替判定：上一次 phone_mock（香料图鉴）为微信小程序，本次交替为原生 App。

## 简介

一个邮票收藏与鉴赏原生 App——在统一手机外壳内可切换 8 个页面，含经典邮票图鉴、发行背景故事、收藏册、市场行情、藏友社区等真实可信内容。邮差绿 + 羊皮纸米 + 邮戳红 + 黄铜金配色，营造邮政年代质感。

![预览](./thumbnail.png)

## 动效亮点

- 签名动效 1：邮戳盖印动画（详情页进入后红色邮戳放大→缩小→旋转盖下）
- 签名动效 2：齿孔撕纸质感卡片（SVG 齿孔边缘 + 光泽扫过）
- 原生端侧交互：大标题导航栏 / 返回栈、底部 TabBar、卡片信息流、全屏详情转场、模态弹窗、手势滑动、长按快捷菜单、下拉刷新、FAB
- 13 个组件级特效

## 文件说明

| 文件 | 说明 |
|------|------|
| index.html | 外壳入口 |
| phone_mock/index.html | 应用主体源码（JSX 全内联） |
| phone_mock/ios-frame.jsx | 手机外壳组件 |
| 设计规范.md | 色彩、字体、组件、动效、页面结构规范 |
| thumbnail.png | 页面截图 |

## 妙搭在线预览

https://dcniaqwtmoca.feishu.cn/page/Mjp6m8uVxdVSLSaahytcgXgKnLg

## 技术栈

React + Babel standalone（JSX 全内联单文件），无外部 src 引用。
