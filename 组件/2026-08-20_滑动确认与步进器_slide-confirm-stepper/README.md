# 滑动确认 Slide-to-Confirm + 步进器 Stepper

> Art 设计实验室 · V3 交互组件 · 2026-08-20

两个生产级可复用 UI 组件，演示场景为「山物集」土产小铺结算台：步进器调整商品数量、联动小计与合计，滑动确认提交订单并盖下「已确认」印章。

![预览](preview.png)

[妙搭在线预览](https://dcniaqwtmoca.feishu.cn/page/JVzrmImSsdtbvuaIVzZcJVUjnBW)

## 组件清单

| 组件 | 类别 | 解决的真实问题 | 状态机 |
|---|---|---|---|
| Stepper 步进器 | 输入类 | 商品数量、人数等整数输入 | rest / hover / focus / active / disabled / error（6 态） |
| Slide-to-Confirm 滑动确认 | 操作类 | 提交订单、删除、转账等「有分量的操作」的确认 | rest / hover / dragging / loading / success / error / disabled（7 态） |

## 用法

两个组件均为独立 IIFE 模块，复制对应 CSS 块（有 `COMPONENT: STEPPER` / `COMPONENT: SLIDE-CONFIRM` 注释边界）+ JS 闭包即可在其他项目中使用。

### Stepper

```html
<div class="stc-stepper" data-min="1" data-max="10" data-step="1" data-value="2">
  <button class="stc-stepper__btn stc-stepper__btn--dec" aria-label="减少">−</button>
  <input type="number" class="stc-stepper__input" aria-label="数量" />
  <button class="stc-stepper__btn stc-stepper__btn--inc" aria-label="增加">+</button>
</div>
<script>
  document.querySelectorAll('.stc-stepper').forEach(Stepper.init);
</script>
```

键盘：`↑`/`↓` 增减一步；`Shift+↑`/`↓` 增减十步；`Home`/`End` 跳到最小/最大值；`Enter` 确认；`Esc` 回退。
行为：长按 500ms 后启动加速重复（最高 5 倍速）；到界自动 disabled；手动输入非法值失焦校验、砖红抖动回退。

### Slide-to-Confirm

```html
<div class="stc-slide-confirm" id="confirm" role="slider"
     aria-label="确认提交" tabindex="0"
     aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
  <div class="stc-slide-confirm__fill"></div>
  <span class="stc-slide-confirm__hint">滑动确认</span>
  <div class="stc-slide-confirm__thumb"><!-- 箭头/对勾/叉号 SVG --></div>
</div>
<script>
  SlideConfirm.init(document.getElementById('confirm'), {
    threshold: 0.8,
    onConfirm: function (done) {
      // 异步操作，完成后调用 done(true|false)
      setTimeout(function () { done(true); }, 1500);
    }
  });
</script>
```

键盘：`←`/`→` 步进 10%；`Home`/`End` 到起点/末端；`Enter`/`Space` 从当前位置提交；`Esc` 取消回弹。
行为：拖拽全程跟手（pointer events + RAF 直写 DOM）；过 80% 阈值吸附触发 `onConfirm`；未达标弹簧回弹；error 态自动回弹可重试。

## 可配置项

### CSS 变量（抽取后只需覆盖变量即可换肤）

**Stepper**：`--stp-size`（按钮尺寸 32px）、`--stp-radius`、`--stp-input-w`、`--stp-accent`、`--stp-bg`、`--stp-line`、`--stp-error`、`--stp-dur` 等

**Slide-to-Confirm**：`--sc-height`（轨道高 56px）、`--sc-radius`、`--sc-thumb-size`、`--sc-accent`、`--sc-track-bg`、`--sc-track-fill`、`--sc-success`、`--sc-error`、`--sc-dur-*`、`--sc-ease-spring` 等

### JS 参数

- `Stepper.init(el, { min, max, step, value })`——缺省取 `data-*` 属性
- `SlideConfirm.init(el, { threshold, onConfirm, disabled })`——`onConfirm(done)` 回调中 `done(true)` 进 success、`done(false)` 进 error

## 定制方法

1. 换主题色：覆盖 `--stp-accent` / `--sc-accent`（或全局 `--accent`）即可，成功/错误色同理
2. 改手感：调整 `--sc-ease-spring` 曲线与 `--sc-dur-*` 时长
3. 改尺寸：步进器改 `--stp-size`，滑动确认改 `--sc-height` / `--sc-thumb-size`
4. 接入真实逻辑：在 `onConfirm` 里调用你的接口，按结果调 `done(true/false)`

## 文件说明

- `index.html`——完整单文件（展示页 + 两个组件 + 用法文档），纯 vanilla 零依赖，浏览器直接打开可运行
- `preview.png` / `preview-full.png`——首屏 / 整页截图
- `设计规范.md`——真实色值、字体栈、动效曲线、状态机、工程健壮性清单

## 技术栈

纯原生 HTML + CSS + JS 单文件；无 React / Babel / CDN / 外部图片字体。支持 `prefers-reduced-motion` 降级；aria-* 完整（`role="slider"`、`aria-valuenow` 实时同步、`aria-live` 播报）；RAF 与定时器随页面可见性暂停，`destroy()` 可完整清理。
