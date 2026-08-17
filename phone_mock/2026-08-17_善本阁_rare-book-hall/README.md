# 卷 · 古籍善本馆

形态：原生 App

> 日期：2026-08-17 · 方向：V2 手机 UI · 形态：原生 App（上一次为微信小程序，本次交替）· 主题：古籍善本阅读与收藏 App

## 简介

「卷 · 古籍善本馆」是一个以宣纸/墨色/朱砂印章为视觉语言的中国古籍阅读与收藏原生 App mock。围绕古籍善本组织真实可信内容（镇馆之宝、分类书架、善本详情、阅读体验、雅集社区、个人书斋），在统一手机外壳内提供 8 个可切换页面。

## 形态

原生 App（iOS 质感）——大标题导航栏 / 返回栈导航、底部 TabBar、卡片式信息流、模态弹窗、底部半屏抽屉、下拉刷新、悬浮操作球 FAB、大标题滚动收缩。

## 截图

![preview](./preview.png)

## 动效亮点

- 印章按压（主色朱砂按压反馈）
- 翻页 3D 旋转（阅读页入场）
- 环形进度描边（个人页书斋进度）
- Hero 视差缩放、下拉弹性旋转、FAB 浮动、列表错峰入场

## 文件说明

| 文件 | 说明 |
|---|---|
| index.html | 完整可运行源码（React + Babel 内联，含 ios-frame 组件内联） |
| components/ | 组件源码（ios-frame.jsx，已内联进 index.html） |
| preview.png | 页面截图 |
| thumbnail.png | 缩略图 |
| 设计规范.md | 色彩/字体/动效/页面结构规范（含形态标记） |

## 妙搭在线预览

https://dcniaqwtmoca.feishu.cn/page/AzvxmKrFFdITgIaEE8zcxoxUnhc

## 技术栈

React 18 + Babel standalone，JSX 全部内联于 `<script type="text/babel">`，CSS 内联。
