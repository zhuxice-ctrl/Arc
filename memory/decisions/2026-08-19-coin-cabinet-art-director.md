# 2026-08-19 Art Director 决策日志 · V2 古钱币鉴赏柜

## 形态判定
phone_mock 最新子文件夹「2026-08-19_漆扇手作志_lacquerfan-atelier」形态标记=原生 App → 本版交替为 **微信小程序**。

## 饱和模式规避（pattern_stats.json + phone.json 近 20 条）
- spatial_model：4tabbar_pagestack 系高度饱和（native_app_4tabbar_pagestack last_10=2，各类 4tab 变体近 10 次内反复出现）→ 本版用 3 TabBar + 朝代年表导航 + 半屏弹层，降低 tab 密度
- signature：印章盖章（seal_stamp）近 10 次出现 5+ 次（古籍/早餐摊/攀岩/方言/图书漂流/旧书诊所）→ 本版禁用盖章类
- visual_material：暖纸/墨/朱砂/木质系（rice_paper、kaya、walnut、aged_paper、cinnabar、soil_brown）近 20 次占绝对主导 → 本版强制冷硬金属材质转向
- form_factor：wechat_miniprogram 与 native_app 交替正常，本版走微信小程序
- 已用签名清单（避重）：stamp_drop、timeline、wheel_rotate、cursor_on_curve、overlay_compare、drop_stone_adsorb、watering_can、bowstring、drag_herb_scale、pull_tape、drag_leaf_feed、reel_tension、mirror_flip、dip-pull-reveal(漆扇)、advance-lever(片夹)、pendulum(琴房)、scan_receive(漂流书)、drag_tide(冲浪)、drag_bowstring(弓道)

## 题材
古钱币鉴赏（钱币学/numismatics）。近 33 条 phone 记忆与 phone_mock 全量目录均无钱币/古钱/包浆主题，正交。

## 5 个正交候选

| ID | motif | spatial_model | primary_interaction | signature_moment | visual_source | novelty | fit | risk |
|----|-------|---------------|---------------------|------------------|---------------|---------|-----|------|
| A | 古钱币鉴赏柜 coin_cabinet | 收藏柜分格+朝代年表 | 转动钱币看包浆光泽 | 旋转包浆光泽流动(铜绿/银白/铁锈交替) | 铜钱包浆/天鹅绒展托/钱币学图录 | 9 | 9 | MEDIUM |
| B | 矿物标本硬度测试 | 硬度测试工作台+晶系柜 | 刻划测试摩氏硬度 | 刻划留痕判定硬度 | 水晶/晶洞/丝绒展柜 | 8 | 6 | MED-HIGH |
| C | 草木染配方色卡 | 色卡册+染料配方 | 层层浸染显色 | 浸染渐变显色 | 植物染料/棉布/色样册 | 7 | 7 | MEDIUM |
| D | 香道燃香烟迹 | 香炉舞台+香方册 | 燃香记录烟迹 | 烟迹飘散记录香气 | 沉香/铜炉/烟雾 | 7 | 6 | HIGH |
| E | 观云识天图鉴 | 天空高度图+云属速查 | 拖动高度尺揭示云属 | 高度尺拖动云层显现 | 云图/气象图录 | 8 | 5 | MEDIUM |

## Novelty / Pattern Pressure 检查
- A「转动钱币看包浆光泽」signature：phone 库 30+ 交互机制无 rotate-for-patina-sheen 模式，正交。pattern_stats phone.primary_interaction 无此项。
- 金属包浆材质：近 20 次 phone 作品无金属/铜锈/银光材质，与暖纸墨木完全错开。
- 空间：收藏柜分格 + 朝代年表导航，首屏=今日鉴赏柜（非通用首页模板）。
- 无 SATURATED 模式。form_factor=wechat_miniprogram 合理，转动钱币是小程序内 canvas 可实现的把玩交互。

## 排序与选择
ranking: [A, B, E, C, D]
- 选中 **A 古钱币鉴赏柜**：novelty_score 9（rotate-patina-sheen 首次、金属材质近 20 次首现）、fit_score 9（古钱鉴赏=识读钱文→转动看包浆→判品相→按朝代材质入册→速查行情 是真实闭环且每枚包浆独一无二，随身速查是小程序真实场景）、execution_risk MEDIUM（包浆光泽旋转用 canvas 径向渐变跟随角度可实现，可控）。
- 不选 B：刻划测试交互强但矿物收藏对小程序过小众，fit 低。
- 不选 E：观云识天材质清新但"日常观测"高频任务偏薄，小程序留存弱。
- 不选 C：浸染显色与近期漆扇 dip-pull-reveal 机制撞，novelty 碰撞。
- 不选 D：烟迹动画执行风险高（烟雾物理难控），且材质偏暖。

## accepted_patterns
- 微信小程序端侧交互（胶囊按钮+自定义导航栏、底部 TabBar、半屏弹层/ActionSheet、页面栈 push/pop、下拉刷新弹性、左滑操作）—— 功能必需，非装饰。

---

## Design Contract

### Core Idea
随身钱币鉴赏柜微信小程序——整个界面是一只分格抽屉的古钱收藏柜。核心对象是一枚古钱币：识读钱文→转动看包浆光泽(签名)→判品相→按朝代/材质入册→速查参考行情。围绕"转动包浆显光泽"这一鉴赏最核心的把玩动作展开，每枚钱币的包浆独一无二，转出不同的光泽流。

### Experience Goal
让用户体会古钱鉴赏最迷人的瞬间：转动钱币，包浆在光下流转变幻——铜绿锈色、银白光泽、铁锈红斑随旋转角度交替显现，像在掌心转动一枚真钱对着光看。整个小程序围绕"随身速查+把玩鉴赏"展开，从识读到入册，在转动那刻获得包浆流转的满足。

### Must Keep
1. 微信小程序形态，端侧交互 ≥4 种（胶囊按钮+自定义导航栏、底部 TabBar、半屏弹层/ActionSheet、页面栈 push/pop 转场、下拉刷新弹性、左滑操作）
2. 完整 user flow：鉴赏柜首页→点钱币半屏详情(正反/钱文/朝代/材质/品相)→转动看包浆签名→入册(选朝代材质填品相)→图谱速查钱文/朝代→行情参考，全程因果跳转
3. 转动包浆签名动效：拖动旋转钱币，包浆光泽随角度流动变化（铜绿/银白/铁锈随光线角度交替显现），转动速度影响光泽流动
4. 真实内容（≥6 种古钱：开元通宝/宋元通宝/崇宁通宝/永乐通宝/康熙通宝/乾隆通宝；真实品相术语：美品/极美品/近未流通；真实材质：青铜/铁/银/黄铜；真实朝代年表唐宋元明清）
5. localStorage 持久化鉴赏柜；含设计规范页 + 接口文档页

### Must Not Regress To
1. 通用首页模板（问候语+搜索+Banner+分类图标+横卡+推荐+底部导航）
2. 假功能（点不了的搜索/空 Tab/装饰按钮/假筛选/假社区）
3. 网页缩进手机；蓝紫渐变；盖章类签名动效；暖纸墨朱砂木质配色；与近期 stamp/timeline/wheel/cursor/mirror/reel/dip/bowstring/herb-scale/tape 签名重复

### Primary Interaction
钱币鉴赏：鉴赏柜首页点钱币→半屏弹层看详情(正反面/钱文/朝代/材质/品相)→在详情转动钱币(签名，拖动旋转)→包浆光泽随角度流动→判品相入册→图谱页速查钱文识读/朝代年表→行情页参考价。

### Motion Language
功能性反馈优先：钱币旋转阻尼、包浆光泽渐变流动、半屏弹层弹簧上升、页面栈 push/pop 滑动转场、下拉刷新弹性回弹、左滑操作弹簧。支持 prefers-reduced-motion（降级为静态包浆快照，旋转不可用但光泽固定一帧）。

### Signature Moment
转动包浆——拖动旋转古钱币，包浆在"光"下流转：铜绿锈色、银白光泽、铁锈红斑随旋转角度交替显现，像在掌心转动一枚真钱对着光看。每枚钱币的包浆分布不同，转出不同的光泽流。

### Success Condition
1. 完整走通"鉴赏柜→点币详情→转动包浆→入册→图谱速查→行情"全流程，每步因果跳转真实
2. 转动包浆真实可玩，旋转角度影响光泽流动，每枚光泽分布不同
3. 鉴赏柜可保存并在重新进入时恢复（localStorage）
4. 无白屏、无 Console Error、390px 与邻近尺寸 414px 布局正常
5. ≥4 种微信小程序端侧交互真实工作
6. 内容真实（钱币/品相/材质/朝代均为可信数据），非 Lorem Ipsum
7. 删动画后信息层级仍成立；灰度下层级仍成立；轮廓与近期作品可区分

### Technical Boundary
纯 vanilla 单文件 HTML（无 React/Babel/CDN 外部依赖）；微信小程序视觉约定（胶囊按钮+自定义导航栏、底部 TabBar、半屏弹层、页面栈 push/pop、下拉刷新、左滑操作）；390px 目标宽度 + 邻近尺寸 414px 自检；localStorage 持久化；canvas 实现包浆光泽旋转。
