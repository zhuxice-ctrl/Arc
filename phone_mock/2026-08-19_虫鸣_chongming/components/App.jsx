// 主 App：页面栈 + TabBar + 状态管理

function App() {
  // 当前 Tab
  const [activeTab, setActiveTab] = React.useState('tonight');
  // 页面栈（用于 push/pop 的子页面，如详情、规范、文档）
  const [stack, setStack] = React.useState([]);
  // 录音状态
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordPhase, setRecordPhase] = React.useState('idle'); // idle | recording | analyzing
  const [recordSeconds, setRecordSeconds] = React.useState(0);
  const [result, setResult] = React.useState(null);

  const collectionRef = React.useRef(null);
  const recordTimerRef = React.useRef(null);

  // 开始录音（按下）
  function startRecording() {
    if (isRecording) return;
    setIsRecording(true);
    setRecordPhase('recording');
    setRecordSeconds(0);

    let seconds = 0;
    recordTimerRef.current = setInterval(() => {
      seconds++;
      setRecordSeconds(seconds);
      // 最多录 8 秒自动结束
      if (seconds >= 8) {
        finishRecording();
      }
    }, 1000);
  }

  // 结束录音（松开）
  function finishRecording() {
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    // 至少录 1 秒才算有效
    if (recordSeconds < 1) {
      setIsRecording(false);
      setRecordPhase('idle');
      return;
    }
    setRecordPhase('analyzing');

    // 模拟识别：1.8 秒后出结果
    setTimeout(() => {
      const randomId = INSECTS[Math.floor(Math.random() * INSECTS.length)].id;
      const recognitionResult = simulateRecognition(randomId);
      setResult(recognitionResult);
      setIsRecording(false);
      setRecordPhase('idle');
    }, 1800);
  }

  function cancelRecording() {
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    setIsRecording(false);
    setRecordPhase('idle');
  }

  // 全局监听松开（防止拖出按钮后丢失 mouseup）
  React.useEffect(() => {
    if (!isRecording || recordPhase !== 'recording') return;

    function onUp() {
      finishRecording();
    }
    function onTouchEnd(e) {
      e.preventDefault();
      finishRecording();
    }

    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);
    return () => {
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [isRecording, recordPhase, recordSeconds]);

  // 加入虫谱（由 AppInner 包装，确保在 context 内）
  function handleAddToCollection() {
    // 空实现，实际在 AppInner 中执行
  }

  // 切换 Tab
  function handleTabChange(key) {
    setActiveTab(key);
    setStack([]); // 切 Tab 清空栈
    setResult(null);
  }

  // 推入子页面
  function pushPage(page, payload) {
    setStack(prev => [...prev, { page, payload }]);
  }

  function popPage() {
    setStack(prev => prev.slice(0, -1));
  }

  // 打开昆虫详情
  function openInsect(id) {
    pushPage('insectDetail', { insectId: id });
  }

  // 打开设计规范
  function openDesignSpec() {
    pushPage('designSpec');
  }

  // 打开接口文档
  function openApiDoc() {
    pushPage('apiDoc');
  }

  // 在结果里点击查看详情
  function handleViewDetailFromResult(id) {
    setResult(null);
    pushPage('insectDetail', { insectId: id });
  }

  // 渲染主 Tab 内容
  function renderTab() {
    switch (activeTab) {
      case 'tonight':
        return (
          <Tonight
            onRecord={startRecording}
            onOpenInsect={openInsect}
          />
        );
      case 'collection':
        return <Collection onOpenInsect={openInsect} />;
      case 'journal':
        return <Journal />;
      case 'profile':
        return (
          <Profile
            onOpenDesignSpec={openDesignSpec}
            onOpenApiDoc={openApiDoc}
          />
        );
      default:
        return null;
    }
  }

  // 渲染栈顶页面
  function renderStackTop() {
    if (stack.length === 0) return null;
    const top = stack[stack.length - 1];

    switch (top.page) {
      case 'insectDetail':
        return (
          <InsectDetail
            key={stack.length}
            insectId={top.payload.insectId}
            onBack={popPage}
          />
        );
      case 'designSpec':
        return (
          <DesignSpec
            key={stack.length}
            onBack={popPage}
          />
        );
      case 'apiDoc':
        return (
          <ApiDoc
            key={stack.length}
            onBack={popPage}
          />
        );
      default:
        return null;
    }
  }

  const hasStack = stack.length > 0;

  return (
    <BugProvider>
      <AppInner
        activeTab={activeTab}
        onTabChange={handleTabChange}
        renderTab={renderTab}
        stack={stack}
        renderStackTop={renderStackTop}
        hasStack={hasStack}
        isRecording={isRecording}
        recordSeconds={recordSeconds}
        recordPhase={recordPhase}
        result={result}
        setResult={setResult}
        collectionRef={collectionRef}
        handleAddToCollection={handleAddToCollection}
        handleViewDetailFromResult={handleViewDetailFromResult}
        cancelRecording={cancelRecording}
       />
    </BugProvider>
  );
}

// 内部组件以便使用 BugContext
function AppInner({
  activeTab, onTabChange, renderTab, stack, renderStackTop, hasStack,
  isRecording, recordSeconds, recordPhase, result, setResult,
  collectionRef, handleAddToCollection, handleViewDetailFromResult,
  cancelRecording
}) {
  const { addToCollection, addJournalEntry, isCollected } = useBug();

  // 包装加入虫谱，确保能访问 context
  const _handleAdd = React.useCallback(() => {
    if (!result) return;
    const insect = result.primary;
    const wasNew = !isCollected(insect.id);
    addToCollection(insect.id);
    if (wasNew) {
      addJournalEntry({
        id: 'jrn_' + Date.now(),
        insectId: insect.id,
        similarity: insect.similarity,
        timestamp: Date.now()
      });
    }
  }, [result, isCollected, addToCollection, addJournalEntry]);

  return (
    <>
      <AmbientStars />
      <AmbientFireflies />
      <FireflyCursor />

      <div className="screen-container">
        {/* 主 Tab 内容 */}
        {renderTab()}

        {/* 栈顶页面（覆盖在主页面上） */}
        {hasStack && renderStackTop()}

        {/* TabBar（仅在无栈时显示） */}
        {!hasStack && (
          <TabBar
            activeTab={activeTab}
            onTabChange={onTabChange}
            collectionRef={collectionRef}
          />
        )}

        {/* 录音覆盖层 */}
        <RecordOverlay
          isRecording={isRecording}
          seconds={recordSeconds}
          phase={recordPhase}
          onCancel={cancelRecording}
        />

        {/* 结果底部弹层 */}
        {result && (
          <ResultSheet
            result={result}
            isCollected={isCollected(result.primary.id)}
            onAdd={_handleAdd}
            onClose={() => setResult(null)}
            onViewDetail={handleViewDetailFromResult}
            collectionRef={collectionRef}
          />
        )}
      </div>
    </>
  );
}

window.App = App;
window.AppInner = AppInner;
