# Art Director 决策记录 · 潮间带 Intertidal（V2 手机 UI · 原生 App）

**日期**：2026-08-19　**形态**：原生 App（上一版 phone_mock 最新「雪线滑雪图鉴」为微信小程序，按交替规则本轮做原生 App）

## 5 个正交候选

| # | 名称 | 母题 | motif |
|---|------|------|-------|
| 1 | 潮间带 Intertidal | 老式潮信表铅印册 + 滩涂，首页潮汐曲线仪表盘（选中） | intertidal_tide_gauge_foraging_log |
| 2 | 夜航 Night Beacon | 夜跑者路灯亮度地图 + 配速 | night_running_beacon |
| 3 | 书脊 Spine | 旧书店扫书脊建档 + 版本记录 | used_bookstore_spine_archive |
| 4 | 纸鸢 Kite Field | 风速场判断 + 风筝谱档案 | kite_flying_wind_field |
| 5 | 末班车 Last Train | 城市地铁末班车 + 运转记录 | metro_last_train_ops |

## novelty 检查（pattern_stats / phone.json）

- tide_gauge 类母题：phone 历史无；pattern_stats 中 tide_gauge 仅 web 出现 1 次（语义为潮位揭示叙事，非潮汐工具产品），不构成重复。
- gauge_dashboard_home 首页：phone 历史 40 条无此 spatial_model，SATURATED 风险低。
- 选定 motif `intertidal_tide_gauge_foraging_log` 为全新模式。

## 选择理由

- novelty_score 高（题材全新、母题全新）
- fit_score 高：赶海人确实看潮信表决策，产品逻辑从行为真实生长
- execution_risk 低：潮汐曲线可用 SVG 精确绘制，72h 时间尺拖动可行
- 与题材真实关联强，视觉来源（铅印潮信表）有据可循
- 配色天然避开蓝紫（潮汐题材禁默认海洋蓝，改用纸白/墨色/朱砂/滩涂褐/海苔绿）

第二候选：夜航（若本方向 RESTART 则启用）。

## Design Contract 要点

- core_idea：整本 App 像被翻旧的《潮信表》铅印册，首页即潮汐曲线仪表盘
- 签名交互：72h 时间尺拖动 → 曲线指针移动 + 窗口倒计时环 + 滩涂点位状态灯联动
- must_keep：原生 App / 首页非模板 / 完整 flow / 真实福建点位与物种 / 农历大小潮半日潮 / 规范页+接口文档 / localStorage / 无蓝紫
- must_not_regress_to：greeting+search+banner 模板 / 4tabbar / 假功能 / 网页缩进手机 / 蓝紫 / 卡片堆

## 最终裁决

Contract Fidelity：FULL（core_idea 全部实现，QA 验证 0 error / 全流程可用）
Quality Gate：PASS（CRITICAL=0，无 MAJOR）
