# 机械翻牌显示器·老式车站时刻牌

## 主题

光标驱动的拟物化翻牌显示器——拖拽分页鼓旋转，翻牌半翻显示下一字符，弹簧吸附+咔哒声还原老式车站时刻牌的机械触感。

## 简介

一个可把玩的机械翻牌显示器交互组件。用户用鼠标拖拽中央的分页鼓旋转，每旋转 180° 触发一次翻牌半翻，显示下一个字符。翻牌瞬间触发 WebAudio 咔哒声（方波脉冲，频率随机微变模拟机械不规则性）。松手后，鼓带有惯性旋转（velocity 衰减），随后弹簧物理将鼓吸附到最近的字符位，最后微小余震（aftershock 动画）收尾。

5 层反馈体验：光标接近变 grab 形态→按下变 grabbing→拖拽中实时跟随+持续咔哒→每 180° 翻面闪动→松手惯性→弹簧吸附→余震。自定义白色圆形光标开页即居中显示。

## 截图

![preview](preview.png)

## 妙搭预览

https://dcniaqwtmoca.feishu.cn/page/SPFgmwU24d38HpaygfJcDEl3nMd

## 文件说明

| 文件 | 说明 |
|------|------|
| index.html | 完整源码（HTML+CSS+JS 单文件） |
| 设计规范.md | 色彩/字体/动效/物理引擎/WebAudio 规范 |
| preview.png | 1200×800 桌面截图 |

## 技术栈

纯 vanilla 单文件（HTML+CSS+JS），无 React/Babel/CDN 依赖。requestAnimationFrame 物理引擎（velocity/friction/spring）。WebAudio API 咔哒声效。CSS 3D transform（rotateX）翻牌。支持 prefers-reduced-motion。

## 配色

黄铜+暗褐+米白的机械金属色调，不使用蓝紫渐变。
