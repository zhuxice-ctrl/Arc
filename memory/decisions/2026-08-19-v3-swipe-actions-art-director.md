# V3 Art Director Decision — 滑动操作列表 SwipeActions

## 日期
2026-08-19

## 候选
- A. tooltip_popover_smart_placement — 覆盖层类 / novelty 8 / fit 9 / risk MEDIUM
- B. accordion_faq_spring_multi_mode — 导航类 / novelty 7 / fit 9 / risk LOW
- C. swipe_actions_row_threshold_undo — 操作类 / novelty 8 / fit 8 / risk MEDIUM ← **选中**
- D. segmented_control_sliding_pill — 输入类 / novelty 6 / fit 9 / risk LOW
- E. rating_stars_half_preview — 输入类 / novelty 7 / fit 8 / risk LOW

## 排序
C > A > B > E > D

## 选择理由
1. 操作类（滑动删除）在当前 V3 组件组合中完全空白——现有偏输入(OTP/标签/步进器/日期)、覆盖层(Modal/Sheet/右键/Tooltip候选)、导航(Tabs/树/命令面板)。选 C 补齐操作类，组合更均衡。
2. 五层体验映射最完整：预接触(行 hover 微露操作提示)→接触(按下)→持续(1:1 跟手)→阈值(40%咬合)→释放(弹簧回弹或吸合)，与 component.md「五层体验结构」天然契合。
3. 与已有「拖拽排序列表」机制正交：排序=垂直重排+占位，滑动=水平动作揭示+阈值+撤销，非换皮。
4. 真实项目价值高：邮箱/待办/购物车/消息列表通用，符合「方便利用到别的项目」的用户诉求。

## 未选理由
- A Tooltip：覆盖层 spatial_model(overlay) 已 MEDIUM-HIGH 压力；交互动效面偏薄，五层体验难做出 signature。
- B Accordion：方向稳妥但 novelty 一般，缺少一个强 signature moment。
- D Segmented：动效面薄，interaction feel 难达 12/15 门槛。
- E Rating：紧凑但交互深度有限。

## 模式压力检查
- swipe 机制在 component.json 中为 0（旧方向物理类拖拽不计入 UI 操作类），LOW。
- spatial_model = 操作列表行（inline_list_showcase），last_20=0，LOW。
- 无 SATURATED 冲突。

## 已接受模式
- pointer_events_unified_drag (新)
- threshold_snap_damped_spring_release (新，UI 版)
- undo_bar_countdown (新)

## 组件类型
operation_swipe_actions (新增 component_type)
