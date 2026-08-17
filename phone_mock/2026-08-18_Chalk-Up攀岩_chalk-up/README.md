# Chalk Up 攀岩社区

形态：原生 App

> 方向：V2 手机 UI · 日期：2026-08-18
> 主题：攀岩馆与攀岩爱好者社区原生手机 App

## 简介

「Chalk Up」是攀岩馆与攀岩爱好者社区的原生 App mock，统一手机外壳内 8 个页面可切换：首页信息流、线路墙（难度色标网格拼贴）、线路详情（全屏转场 + 视差）、约爬广场（3D 卡片堆叠）、训练打卡（环形进度）、个人中心（徽章墙）、设计规范页、接口文档页。内容围绕真实攀岩文化组织：V0-V7 / 5.8-5.13d 难度体系、岩馆与线路、岩友约爬帖与训练记录。岩壁赭红 + 镁粉米白 + 炭黑 + 松针绿的岩馆色系，佐以完整难度色标。

## 截图

![Chalk Up 预览](./thumbnail.png)

## 动效亮点

- 首页入场序列动画（Hero 渐入、统计卡错峰、feed 卡片 stagger）
- 训练打卡环形进度描边 + 周柱状图生长
- 约爬广场 3D 卡片堆叠拖拽 + FAB 旋转弹出菜单
- 下拉刷新弹性回弹、长按快捷菜单、模态底部抽屉
- 自定义光标开页居中：双环高对比，悬停放大、点击涟漪

## 文件说明

| 文件 | 说明 |
|---|---|
| `index.html` | 应用入口（React 内联 JSX），本地打开为入口页，实际预览走妙搭链接 |
| `设计规范.md` | 色彩 / 字体 / 圆角 / 页面结构 / 交互与动效系统 |
| `thumbnail.png` | 应用截图 |
| `README.md` | 本文件 |

## 在线预览

妙搭应用：https://dcniaqwtmoca.feishu.cn/page/KrGvm65Mad1xTAa26Qvcc0Wnntb

## 技术栈

React（JSX 内联于 index.html，Babel standalone），内联 CSS；RAF 动画与 DOM transform；`prefers-reduced-motion` 降级。
