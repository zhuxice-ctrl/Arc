# 光影集 PhotoMuse · 编辑室 Editorial

- 日期：2026-08-16
- 方向：手机应用 UI（Editorial 编辑室）
- 主题：AI 人像修图 / 证件照 / 简历形象照 下单与管理 App

## 简介
致敬高端时尚杂志封面的多页 App：下单主页（8 章节完整下单流）、订单详情（进度条 + 四步节点动画 + 状态机流转）、管理登录、订单管理（7 状态 Tab + 审核三动作 + 交付图上传）。墨黑 + 暖米白骨架，低调琥珀金作单一高饱和锚点，衬线大标题 + 发丝线 + 极致留白贯穿始终。契约层 13 云函数 / 7 集合 / 订单状态机冻结，仅表现层分化。

## 截图
![光影集 PhotoMuse 预览](./preview.png)

## 动效亮点
- 页面进入 slideUp 淡入上滑（cubic-bezier(0.16,1,0.3,1)）
- 主按钮 hover 上浮 + 阴影加深、按下回弹；次/幽灵按钮 hover 反色填充
- 套餐行 / 订单卡 / 管理订单卡 hover 浅底 + 轻位移
- 风格 Tab 选中下划线渐显
- 上传照片与交付缩略图 hover 微放大
- 单选/复选勾选弹性缩放 + 对勾淡入
- 删除图标 hover 放大变红；管理端操作按钮 hover 实色反白
- 进度条与状态节点动画过渡；Toast 毛玻璃淡入淡出；全局 Loading 旋转 + shimmer
- 12+ 组件级特效，统一节奏，不破坏 Editorial 留白调性

## 布局丰富度
4 页中 4 种非重复布局：杂志开本分段下单流、状态进度沉浸详情、居中卡片登录、Tab + 统计卡 + 列表管理后台。

## 文件说明
| 文件 | 说明 |
|------|------|
| index.html | 自包含浏览页（内联全部 jsx，双击即可预览） |
| app.jsx | 主应用框架 + 设计令牌 + 全局状态 + 路由 |
| pages/index.jsx | 下单主页（8 章节 + 查询面板 + 我的订单） |
| pages/detail.jsx | 订单详情（进度条 + 状态机 + 补拍 + 大图预览） |
| pages/adminLogin.jsx | 管理登录 |
| pages/admin.jsx | 订单管理（7 状态 Tab + 审核 + 交付上传） |
| 设计规范.md | 色彩 / 字体 / 组件 / 动效 / 页面结构 |
| preview.png | App 截图 |

## 妙搭在线预览
https://dcniaqwtmoca.feishu.cn/page/FRoqmPyrhd1g7taVpREcsbDxnuc

## 技术栈
HTML + 内联 CSS + React（Babel standalone 内联 JSX）+ Playfair Display / Inter / JetBrains Mono。
