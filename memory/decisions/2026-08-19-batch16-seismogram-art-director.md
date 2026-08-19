# 2026-08-19 Art Director 决策日志（V1 本轮）

## 当天差异化判断
今日（8-19）已入库 20+ 版 web，题材密度集中在：传统中式工艺（大运河/日晷/廊桥/活字/物候环/金鱼/游廊/药铺/年画/皮影/算盘/龙舟/茶马/蜀道/窑火/调香/潮汐/制表）、纸本水墨木色配色、拖拽类主交互、scroll-descent 叙事、固定舞台、径向轮盘。
→ 本轮 V1 刻意避开传统工艺 + 纸本配色 + 拖拽主交互，转向现代科学数据工具，空间模型取全库零重复的「水平多台网地震波形迹线脊柱」。

## V1 候选方向（5 个正交 motif）
1. **horizontal_seismogram_trace_spine** — 水平多台网地震波形迹线为页面脊柱；点击 P/S 波到达 → 展开震情档案 + 走时弧回放。（**选中**）
2. concentric_intensity_rings — 震中向外同心烈度圆衰减，点击圆环列受影响城市。（弃：径向变体，今日 radial_wheel 已 2 次）
3. subduction_cross_section — 俯冲带剖面，scroll=沿板块边界下潜，地震锚定深度。（弃：vertical descent 今日已 4 次饱和）
4. great_quake_timeline — 历史大震横向世纪时间轴。（弃：时间轴 cliché，且 horizontal_ruler 今日已被光污染尺使用）
5. early_warning_countdown_console — 实时预警倒计时控制台，P 波到达前抢秒确认城市。（弃：fixed_stage 今日已 5 次；游戏化偏离档案性质）

## 选择理由（novelty / fit / execution_risk）
- novelty_score=9：spatial_model `horizontal_seismogram_trace_spine` 全库零重复；主交互 click_wave_arrival 非拖拽、非 scroll-descent，与今日全部 20+ 版正交。
- fit_score=9：地震学最自然的表征就是多台站波形迹线；点击波至 = 天然查询动作；幅度承载震级、双迹分离承载 P/S 波——信息密度由内容结构而非装饰承担。
- execution_risk=中低：Canvas 多轨迹线 + 走时弧回放为成熟技术，单文件 vanilla 可承载；内容真实可信（汶川 8.0/唐山 7.8/东日本 9.0/尼泊尔 7.8/智利 9.5/印度洋 9.1 真实参数）。
- 配色正交：深近黑控制台 + 磷光琥珀迹线 + 次级青绿 S 波 + 峰值警示红 + 米白文字，禁蓝紫、禁纸本水墨、禁木色——与今日全部 palette 拉开。

## Design Contract（锁定本轮）
- core_idea：多台网地震波形档案——水平连续迹线为唯一脊柱，点击波至揭示震情，走时弧回放让"波如何到达台站"可被亲手触发。
- experience_goal：用户像在地震台网值班室翻阅历史大震的波形胶卷，每一次点击都是"这台站当时收到了什么"。
- must_keep：
  1. 水平多轨迹线为唯一脊柱（≥4 条台站轨），非竖向 section、非卡片网格、非固定单舞台
  2. 点击 P 波 / S 波到达点 → 真实震情档案（震级/深度/位置/时刻/伤亡）
  3. 走时弧回放签名时刻：点击后笔尖实时重绘该轨波形 + 震中→台站走时弧展开
  4. ≥6 次真实历史大震，参数全部真实
  5. 自定义光标开页居中、高对比、层级最高（十字准星指针）
  6. 动效≥12 组件级，符合地震波物理（波至突跳/衰减振荡/走时扩散），禁 Ken Burns
  7. 纯 vanilla 单文件，无 React/Babel/CDN；RAF 随可见性暂停且卸载取消；支持 prefers-reduced-motion
- must_not_regress_to：竖向 section 堆叠 / 卡片网格 / 蓝紫渐变 / 纸本水墨木色 / 通用 landing / 拖拽时间游标 / 固定单舞台
- signature_moment：点击东日本 9.0 那道刺破全轨的峰值，4 条台站轨按真实走时差依次重绘波形，走时弧从震中向各台站逐条点亮。
- success_condition：删动画后多轨迹线信息层级仍成立；灰度下 P/S 双迹与震级幅度仍可辨；轮廓与今日 20+ 版无相似；首屏即答"这是地震台网波形档案"。

## 状态
Art Director 阶段完成 → 进入 Designer（app_builder html）。
