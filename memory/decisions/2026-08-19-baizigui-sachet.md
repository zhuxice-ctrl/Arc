# Decision Log · 2026-08-19 · 百子柜·调香（V2 手机 UI · 原生 App）

## 形态判定
phone_mock/ 最新子文件夹 = 邻里工具箱（微信小程序）→ 本次交替 = 原生 App。

## 5 候选（正交）
| ID | motif | visual_source | spatial_model | primary_interaction |
|----|-------|---------------|---------------|--------------------|
| A | 渔获日志 | 水墨江河·银鳞 | 钓况卡+渔获时间线+钓点地图 | 拖水深水温曲线找窗口 |
| B | 陶艺烧制记录 | 陶土·釉色·窑火 | 工件状态机流程 | 拖窑温曲线 |
| C | 中药香囊调配 | 老药铺百子柜·药材纸包 | 抽屉墙+戥秤调配台 | 拖药材上戥秤称量 |
| D | 缝纫拼布工坊 | 棉布拼布·线迹 | 项目工位+布料拼贴板 | 拖布样上拼贴网格 |
| E | 邮票邮戳收藏 | 老邮票·齿孔·邮戳 | 集邮册翻页+收藏墙 | 拖邮戳盖戳 |

## 选择
- ranking: C > B > A > E > D
- why_selected: C 的「老药铺百子柜」首屏是历史从未出现的空间模型（抽屉网格墙），「戥秤称量平衡」是与产品强绑定的签名交互（调配香囊本质是按重量配比），产品逻辑闭环清晰，执行风险中等可控。
- why_not_others: B 釉色揭晓动态风险偏高；A 的水深曲线与近期冲浪「拖潮汐曲线」交互近似（pattern collision）；D 项目跟踪略通用；E 收藏机制偏静态。
- accepted_patterns: 抽屉墙(drawer-grid wall home) 历史 0 次，novelty 高，无 SATURATED 模式。

## 结果
- 实现：单文件 vanilla 原生 App，百子柜首屏 + 戥秤称量 + 朱砂封印封囊 + 方子册复配 + 设计规范页 + 接口文档页。
- Browser QA: PASS（0 console error / 0 404 / 无横向溢出 / 像素 std≈73 非空白 / 390+414 双尺寸）。
- 交互审计: PASS（TabBar 切换生效、16 抽屉可开、加药后调配台显示 5g+戥秤、空状态有引导、5 个真实 API 端点）。
- Contract Fidelity: FULL。Quality Gate: PASS。
- 状态: 已入库 memory/phone.json（fingerpint 追加），等待协调者质检后提交 GitHub。
