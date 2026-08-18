# 纹枰 · 围棋打谱

**类别**：Phone Mock　**日期**：2026-08-19　**形态：原生 App**

## 主题
围棋爱好者的打谱工具——一方随身携带的榧木棋枰，逐手摆子研究古今名局，收藏妙手，生成棋谱笔记。

## 简介
原生 App 形态（自定义导航栏 + 页面栈 push/pop 转场 + 底部 TabBar，非微信小程序）。信息架构：今日 / 谱库 / 妙手集 / 我的。完整核心流程：今日一局推荐 → 谱库选棋 → 打谱页逐手落子（前进/后退/自动播放/跳手数/显隐手数）→ 长按查看变化图 → 收藏妙手飞入妙手集 → 编辑棋谱笔记。谱库含 6 局真实名谱（当湖十局两局、吴清源镰仓十番棋、Master 对连笑、AlphaGo 对李世石第四局、棋圣战），每局含真实棋手、年代、手数、谱注。辅助功能：每日一道死活题（可作答、查看正解）。

签名动效：落子从上方落下、阴影先至、吸附弹跳余震；提子旋转飞离棋盘；妙手到达时苔绿光晕脉动。

![纹枰 预览](./preview.png)

## 妙搭预览
https://dcniaqwtmoca.feishu.cn/page/Ez6mmAQfHdJ2zJarJOqc2TQunJn

## 文件说明
- `index.html` —— 入口（加载 React + Babel + 字体）
- `App.jsx` —— 根组件路由
- `pages/` —— Tabs、GameView、SpecPages 等页面
- `components/` —— GoBoard、AppShell、ios-frame 等组件
- `data/` —— 棋谱与死活题数据
- `设计规范.md` —— 色板、字体、动效系统、产品流程
- `preview.png` —— 390×844 截图

## 技术栈
- React 18 + Babel（飞书 miaoda CDN）
- 多文件 .jsx 组件结构
- 字体：Noto Serif SC、ZCOOL XiaoWei（miaoda fonts）
- 自定义光标；prefers-reduced-motion；390×844 与 360px 邻近尺寸不破版

## 设计要点
- 产品机制从打谱行为生长（摆子-研究-收藏-笔记闭环）
- 配色：榧木浅黄 + 墨黑 + 蛤白 + 苔绿（妙手语义）+ 朱砂（关键记号），无蓝紫渐变
- 中文文案为主；真实棋士与棋局背景
