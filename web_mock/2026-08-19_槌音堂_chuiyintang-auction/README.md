# 槌音堂 · 春季拍卖会

**类别**：Web Mock　**日期**：2026-08-19

一间正在进行中的拍卖现场：丝绒帷幕后是三间拍卖厅（瓷器场 / 书画场 / 钟表场），9 件带完整来源年表的拍品依次登台。按住"举牌"，价格沿竞价阶梯机械翻动；松手定格，三声报价之后木槌落下——烫金的成交价定格在展台上方。

![预览](preview.png)

## 妙搭在线预览
https://dcniaqwtmoca.feishu.cn/page/BKSRmtJd2dQJHUa6RONcIVDLnce

## 核心体验
- 入场仪式：点击标题推开丝绒帷幕
- 场次房间制导航：01 瓷器场 / 02 书画场 / 03 钟表场
- 举牌竞价：按住举牌→价格阶梯跳动→松手出价→三声报价→落槌成交
- 拍品档案：编号 / 年代 / 品相 / 估价区间 / 来源 Provenance 流转年表（抽屉展开）
- 成交记录：实时写入侧栏

## 文件说明
- `index.html` — 完整实现（React + Babel 内联，单文件）
- `设计规范.md` — 色彩 / 字体 / 动效 / 交互系统
- `preview.png` — 首页截图（1440px）
- `thumbnail.png` — 应用缩略图
- `components/` — 应用构建副产物

## 技术栈
单 HTML 文件，React + Babel（JSX 内联）；自定义拍卖号牌光标；RAF 随可见性暂停；支持 prefers-reduced-motion。
