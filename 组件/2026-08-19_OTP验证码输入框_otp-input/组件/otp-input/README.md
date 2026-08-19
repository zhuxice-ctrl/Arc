# OTP 验证码输入框

> 纯 vanilla JS · 零依赖 · CSS 变量主题化 · 自包含可抽取

## 特性总览

- **多格分离输入** — 每一位独立成格，视觉清晰，输入节奏感强
- **粘贴整段填充** — 复制整段验证码自动分配，带级联入场动画
- **倒计时重发** — SVG 圆环扫过进度，页面隐藏时自动暂停
- **错误抖动反馈** — 横向抖动 + 红色闪光，自动清空并重新聚焦
- **成功级联反馈** — 依次变绿脉冲 + 对勾描边动画
- **状态机完整** — rest / hover / focus / active / disabled / loading / error / success / empty（9 态）
- **键盘全可操作** — 方向键、Home/End、Enter、Backspace、Delete
- **显示/隐藏切换** — 眼睛图标切换数字遮罩
- **自定义光标** — 高对比双层光标，开页即显示在屏幕中央
- **减动效偏好** — 自动响应 `prefers-reduced-motion`
- **三版主题** — 墨玉铜光 / 素笺朱砂 / 夜航琥珀

## 文件结构

```
otp-input/
├── otp-input.css   # 组件样式（CSS 变量主题化）
├── otp-input.js    # 组件逻辑（纯 vanilla JS）
├── index.html      # 三主题演示页
└── README.md       # 本文档
```

## 快速开始

### 方式一：声明式（HTML data 属性）

直接在 HTML 中添加 `data-otp` 属性，脚本自动初始化：

```html
<link rel="stylesheet" href="otp-input.css">

<div data-otp
     data-otp-length="6"
     data-otp-label="请输入验证码"
     data-otp-sublabel="已发送至手机 138****8847"
     data-otp-theme="ink-copper"
     data-otp-resend="true"
     data-otp-seconds="60"></div>

<script src="otp-input.js"></script>
```

### 方式二：编程式（JS API）

```html
<link rel="stylesheet" href="otp-input.css">
<div id="my-otp"></div>
<script src="otp-input.js"></script>
<script>
  var otp = new OtpInput(document.getElementById('my-otp'), {
    length: 6,
    label: '请输入验证码',
    sublabel: '已发送至手机 138****8847',
    theme: 'ink-copper',
    mask: false,
    resend: true,
    resendSeconds: 60,
    autoSubmit: true,
    validate: function (code) {
      // 返回 false 或错误字符串表示验证失败
      if (code.length !== 6) return '请输入完整的 6 位验证码';
      return true;
    },
    onSubmit: function (code) {
      // 可以返回 Promise
      return fetch('/api/verify', {
        method: 'POST',
        body: JSON.stringify({ code: code })
      }).then(function (res) {
        if (!res.ok) throw new Error('验证失败');
      });
    },
    onResend: function () {
      // 重发验证码，可以返回 Promise
      return fetch('/api/resend', { method: 'POST' });
    },
    onInput: function (code) {
      console.log('当前输入:', code);
    }
  });
</script>
```

## 主题

| 主题名 | 说明 | 场景 |
|--------|------|------|
| `ink-copper`（默认） | 墨玉铜光 — 深色底 + 暖铜色 | 金融、企业级、商务 |
| `rice-paper` | 素笺朱砂 — 米白底 + 朱砂红 | 文化、国风、轻量 |
| `night-amber` | 夜航琥珀 — 深海蓝 + 琥珀霓虹 | 科技、工具、控制台 |

切换主题：

```js
otp.setTheme('rice-paper');
// 或直接改 data 属性
element.setAttribute('data-otp-theme', 'night-amber');
```

## 配置项（Options）

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `length` | number | `6` | 验证码位数 |
| `label` | string | `'请输入验证码'` | 主标签文字 |
| `sublabel` | string | `''` | 副标签（辅助说明） |
| `inputType` | string | `'numeric'` | 输入类型：`numeric` / `text` |
| `mask` | boolean | `false` | 是否默认遮罩显示 |
| `resend` | boolean | `true` | 是否显示重发按钮 |
| `resendSeconds` | number | `60` | 重发倒计时秒数 |
| `autoSubmit` | boolean | `true` | 填满后自动提交 |
| `theme` | string | `'ink-copper'` | 主题名 |
| `validate` | Function | `null` | 自定义验证函数，返回 `true` / `false` / 错误字符串 |
| `onSubmit` | Function | `null` | 提交回调，可返回 Promise |
| `onResend` | Function | `null` | 重发回调，可返回 Promise |
| `onInput` | Function | `null` | 每次输入时触发 |

## 公开 API

| 方法 | 说明 |
|------|------|
| `otp.focus()` | 聚焦输入框 |
| `otp.blur()` | 失焦 |
| `otp.getValue()` | 获取当前输入值 |
| `otp.setValue(val)` | 设置输入值 |
| `otp.clear()` | 清空并重置状态 |
| `otp.setError(msg)` | 设置错误态并显示消息 |
| `otp.setSuccess()` | 设置成功态 |
| `otp.setDisabled(bool)` | 设置禁用/启用 |
| `otp.setTheme(theme)` | 切换主题 |
| `otp.destroy()` | 销毁组件，清理 DOM 和定时器 |

## 动效清单（≥ 12 个组件级特效）

1. **光标闪烁** — 当前聚焦格内自定义光标，呼吸式明暗
2. **数字弹入** — 输入字符时 scale 弹跳入场
3. **聚焦发光** — 聚焦格外发光晕 + 柔光外扩
4. **悬停加深** — 鼠标悬停时边框与背景微变
5. **删除波纹** — 退格时数字缩小消散再回弹
6. **粘贴级联** — 多字符粘贴时依次下落弹跳
7. **错误抖动** — 逐格错位横向抖动 + 红色闪烁
8. **成功级联** — 从左到右依次变绿脉冲
9. **对勾描边** — 成功后对勾 SVG 逐笔描出
10. **加载呼吸** — 加载态边框明暗呼吸 + 旋转 spinner
11. **倒计时环** — 重发按钮 SVG 圆环扫过动画
12. **禁用降饱和** — 禁用态整体半透明
13. **数字遮罩切换** — 显示/隐藏时的 blur 过渡
14. **自定义光标** — 双层结构，hover 放大、点击收缩

## 自定义主题

通过覆盖 CSS 变量实现自定义主题：

```css
[data-otp-theme="my-theme"] {
  --otp-bg: #...;
  --otp-surface: #...;
  --otp-border: #...;
  --otp-text: #...;
  --otp-text-dim: #...;
  --otp-accent: #...;
  --otp-accent-hover: #...;
  --otp-accent-soft: rgba(..., 0.14);
  --otp-accent-glow: rgba(..., 0.35);
  --otp-success: #...;
  --otp-success-soft: rgba(..., 0.18);
  --otp-error: #...;
  --otp-error-soft: rgba(..., 0.18);
  --otp-radius-sm: 6px;
  --otp-radius-md: 10px;
  --otp-radius-lg: 14px;
  --otp-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --otp-ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

## 健壮性说明

- **零未定义引用** — 所有属性访问前做存在性检查
- **RAF/定时器管理** — 所有定时器集中追踪，`destroy()` 时统一清理
- **页面可见性暂停** — `visibilitychange` 事件暂停倒计时与动画帧
- **快速操作不叠加** — 状态切换时清理旧定时器，动画不会叠加
- **高频鼠标事件** — 鼠标移动使用 `requestAnimationFrame` 节流
- **减少动效** — 完全响应 `prefers-reduced-motion` 媒体查询

## 浏览器兼容

- Chrome / Edge 90+
- Firefox 88+
- Safari 14+
- 移动端 iOS Safari / Chrome Android

## 抽取方式

直接复制 `otp-input.css` 和 `otp-input.js` 两个文件到目标项目即可，无需任何构建工具或依赖。
