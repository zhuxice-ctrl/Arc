# 街角修理铺 · Corner Repair

**类别**：Phone Mock　**日期**：2026-08-19　**形态**：微信小程序

## 主题
城市街角修理铺的微信小程序——修鞋、修伞、配钥匙、修表、换拉链这些「快消失的手艺」，做成一个有完整交易闭环的服务小程序。核心流程：选类目 → 拍照描述故障 → 师傅接单报价 → 修理进度时间线 → 到店取件码核销。

## 形态交替说明
上一版（2026-08-19 虫鸣）为原生 App，故本版做微信小程序形态，遵循交替规则。

## 预览
![preview](./preview.png)

妙搭在线预览：https://dcniaqwtmoca.feishu.cn/page/RrIemLN78dUlidaVeGycb0Zyn2g

## 核心交互
- 完整下单→报价→进度→取件交易闭环
- 缝线缝合进度签名动效
- 6 种小程序端侧语言（胶囊按钮/页面栈/TabBar/半屏弹层/吸底栏/左滑）
- localStorage 持久化订单

## 文件说明
- `index.html` —— 单文件应用（含内联 CSS/JS）
- `设计规范.md` —— 完整设计规范
- `preview.png` —— 390×844 截图

## 技术栈
单文件 HTML + 内联 CSS/JS（Babel 内联 JSX）。localStorage 持久化，支持 prefers-reduced-motion。
