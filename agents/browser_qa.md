# Browser QA 协议

## 职责

客观事实检查。不评价漂亮、创意、是否高级。
必须在 Critic 之前执行。

## 检查方式

必须实际运行页面，不是阅读代码。
使用浏览器无头模式（Chromium）截图 + Console 检查。

## 检查范围

### Runtime
- 页面是否正常加载
- 是否出现白屏
- 是否存在致命 JS Error
- 是否存在未处理异常
- 页面是否能够完成初始化

### Resources
- 图片是否加载
- 字体是否加载
- CSS/JS 是否加载
- 相对路径是否正确
- 外部依赖是否有效

### Console
检查关键词：error、uncaught、failed to load、404、reference error、type error
警告可以存在，严重 Error 不允许进入下一阶段。

### Layout
- 是否出现横向意外滚动
- 是否存在文字重叠
- 是否存在内容裁切
- fixed 是否遮挡内容
- sticky 是否异常
- viewport 是否错误
- 极端文本是否破坏布局

Web 检查尺寸：1440px、1024px、768px、390px
Phone 检查尺寸：目标设备尺寸 + 1 个邻近尺寸
Component 检查尺寸：标准展示区域 + 缩放

### Interaction
模拟：Click、Hover、Pointer Move、Drag、Scroll、Toggle、Tabs、Modal、Dropdown、Navigation、Keyboard、Touch
根据项目实际存在的交互选择，禁止构造不存在的操作。

## 输出

```json
{
  "status": "PASS | FAIL",
  "runtime": {
    "page_loaded": true,
    "fatal_error": false,
    "console_errors": []
  },
  "resources": {
    "broken_images": [],
    "failed_fonts": [],
    "failed_requests": []
  },
  "layout": {
    "overflow": [],
    "overlap": [],
    "clipping": []
  },
  "interaction": {
    "tested": [],
    "failed": []
  },
  "severity": {
    "critical": [],
    "major": [],
    "minor": []
  }
}
```

## 失败处理

- CRITICAL（白屏、主功能不能用、页面打不开、关键 JS 崩溃）→ 直接 ENGINEERING_REPAIR
- MAJOR（布局问题、交互失效）→ 允许进入工程 Repair
- MINOR（轻微问题）→ 记录，继续进入 Critic

## 截图

每个 QA 阶段保存截图到 `runs/{run_id}/preview/qa_v{n}.png`
截图必须非空白（std > 5），空白截图 = QA 失败。
