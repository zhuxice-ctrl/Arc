# 夜市食图 NightBite

> 日期：2026-08-17 ｜ 方向：V2 手机 UI ｜ 形态：微信小程序 ｜ 主题：本地夜市美食地图小程序

形态：微信小程序

## 简介

一张可交互的本地夜市美食地图小程序，收录摊点、美食图鉴、夜市路线、收藏心愿单。统一手机外壳内 8 个页面可切换，配色取夜市霓虹灯牌与炭火暖光：午夜墨底 + 霓虹品红 + 琥珀金。

## 截图

![夜市食图预览](./thumbnail.png)

## 动效亮点

霓虹灯牌闪烁（两节奏）、灯笼摇摆、炭火摇曳、入场序列、标记点脉冲环、下拉刷新弹簧、Tab 弹性缩放、时间线渐进、头像环旋转、骨架屏 shimmer、自定义光标 lerp 跟随、收藏心形变色发光。基于弹簧/lerp/正弦物理模型。

## 小程序端侧交互

页面栈 push/pop 右滑返回、底部 TabBar（选中微动效）、半屏弹层筛选、下拉刷新弹性、左滑列表操作、吸顶 Tab 筛选。

## 在线预览

https://dcniaqwtmoca.feishu.cn/page/BexamBqKkdYysnaBdOacg67dnXd

## 文件说明

| 文件 | 说明 |
|---|---|
| index.html | 完整可运行单文件源码（JSX 内联） |
| 设计规范.md | 色彩/字体/页面结构/动效/端侧交互 |
| thumbnail.png | 页面截图预览 |
| README.md | 本说明 |

## 技术栈

React + Babel standalone（JSX 内联于 `<script type="text/babel">`，CSS 内联），单文件，无外部 src 引用。
