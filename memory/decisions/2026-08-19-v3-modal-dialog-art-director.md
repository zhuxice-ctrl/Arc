# V3 Art Director · 2026-08-19 · Modal 确认对话框

## 已覆盖组件盘点（新方向 V3）
- 输入类：OTP验证码、步进器、标签输入器
- 导航类：命令面板
- 反馈类：消息通知系统 Toast
- 覆盖层类：右键菜单（仅 1 个）
- 数据展示类：拖拽排序列表
- 操作类：拖拽上传区、长按确认按钮

→ 覆盖层类仅 1 个，Modal 确认对话框是覆盖层类最高频刚需、尚未覆盖。

## 5 候选方向（正交）
- A. Modal 确认对话框（覆盖层类）★选中 — 异步确认+焦点陷阱+危险确认，novelty 8 / fit 10 / risk LOW
- B. Slider 滑块（输入类）— 未选：输入类已覆盖 3 个
- C. Tabs 标签页（导航类）— 未选：状态机偏基础
- D. Rating 评分（输入类）— 未选：输入类已覆盖 3 个
- E. Drawer 抽屉（覆盖层类）— 未选：与 Modal 交互重叠，异步确认流转更具签名性

## 选择理由
覆盖层类未饱和（仅 context-menu）；Modal 是每个项目都需要的最高频覆盖层组件；焦点陷阱是开发者高频出错点；异步确认 loading→success 是真实状态机；危险确认（输入文字）是真实模式（GitHub 删仓库等）。状态机 ≥8 态：closed/opening/open/loading/success/error/closing/danger-awaiting。

## Design Contract 摘要
- core_idea: 生产级 Modal 确认对话框，焦点陷阱+异步确认流转+危险确认变体
- must_keep: 7态状态机、焦点陷阱+焦点恢复、键盘(Esc/Enter/Tab)、异步loading→success、危险输入确认、CSS变量主题化、纯vanilla
- must_not_regress_to: 简单alert壳、装饰特效堆叠、展示页喧宾夺主、蓝紫渐变
- signature: 确认按钮 loading→success 流转 + 危险操作输入文字确认
- success_condition: 7态可演示、焦点陷阱工作、异步流转真实、危险确认激活、CSS变量可换色、无白屏无Error

## 流水线结果
- app_id: app_17ce9p0gnka
- app_token: KZsjm2JwwdNvWJaCRGkcz9JXnuh
- 预览: https://dcniaqwtmoca.feishu.cn/page/KZsjm2JwwdNvWJaCRGkcz9JXnuh
