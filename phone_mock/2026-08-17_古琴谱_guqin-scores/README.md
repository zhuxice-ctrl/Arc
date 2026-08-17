# 古琴谱 · 减字谱学习小程序

> 日期：2026-08-17 · 方向：V2 手机 UI · 形态：微信小程序 · 主题：古琴减字谱学习与曲库

形态：微信小程序

## 简介

「古琴谱」是一个微信小程序形态的古琴减字谱学习与曲库应用，以墨黑、朱砂红、米纸为主色调，还原古琴文化的古典美学。在统一手机外壳内可切换 8 个页面，包含琴曲库、减字谱解读、练习记录、琴人社区等，以及设计规范页和接口文档页。

## 截图

![古琴谱预览](./thumbnail.png)

## 配色

墨黑 `#1a1a1a` + 朱砂红 `#c8423c` + 米纸 `#f5ecd9`

## 小程序端侧交互

- 胶囊按钮自定义导航栏
- 底部 TabBar（5 Tab，选中弹起动效）
- 页面栈 push/pop 右滑返回
- 下拉刷新弹性回弹 + 墨滴动效
- 左滑列表操作（置顶/删除）
- ActionSheet 半屏弹层

## 动效亮点

- 墨粒漂浮背景粒子
- 朱印章盖印缩放效果
- 标题毛笔扫过揭示
- Tab 选中弹起过渡
- FAB 悬浮球菜单展开
- 减字谱字符点按缩放
- 练习圆环进度动画
- 骨架屏 shimmer 加载

## 文件说明

| 文件 | 说明 |
|------|------|
| `index.html` | 完整单文件源码（React JSX 内联） |
| `components/ios-frame.jsx` | 手机外壳组件（项目脚手架附带） |
| `设计规范.md` | 色彩系统、字体、组件、动效规范 |
| `thumbnail.png` | 页面预览截图 |
| `package.json` | 项目元数据 |

## 在线预览

[古琴谱 · 妙搭在线预览](https://dcniaqwtmoca.feishu.cn/page/H3a8miglNdvnYKaJSjMcWZ4YnAc)

## 技术栈

React 18 + Babel Standalone（miaoda CDN），JSX 内联在 `<script type="text/babel">` 中。requestAnimationFrame 统一管理 / visibilitychange 暂停 / prefers-reduced-motion 降级。
