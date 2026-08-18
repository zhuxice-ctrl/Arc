// 纹枰 — 打谱页 & 死活题页

const { useState, useEffect, useMemo, useRef } = React;
const { WENPING_COLORS, NavBar, WenPingButton, WenPingTag } = window;

// ============ 打谱页 ============
function GameViewPage({ game, onBack, onCollect, collections }) {
  const [moveIndex, setMoveIndex] = useState(-1);
  const [showNumbers, setShowNumbers] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [variationOpen, setVariationOpen] = useState(false);
  const [variationMove, setVariationMove] = useState(null);
  const [jumpInput, setJumpInput] = useState('');
  const [jumpOpen, setJumpOpen] = useState(false);
  const [collected, setCollected] = useState(false);
  const [flyAnimation, setFlyAnimation] = useState(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [brilliantPulse, setBrilliantPulse] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mql.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const moves = game.moves;
  const currentMove = moveIndex >= 0 ? moves[moveIndex] : null;
  const totalMoves = moves.length;

  // 检查当前手是否已收藏
  useEffect(() => {
    if (currentMove && currentMove.num) {
      const isCollected = collections.some(
        (c) => c.gameId === game.id && c.moveNum === currentMove.num
      );
      setCollected(isCollected);
    }
  }, [currentMove, collections, game.id]);

  // 妙手到达时的脉冲
  useEffect(() => {
    if (currentMove && currentMove.isBrilliant) {
      setBrilliantPulse(true);
      const t = setTimeout(() => setBrilliantPulse(false), 1200);
      return () => clearTimeout(t);
    }
  }, [moveIndex]);

  // 前进/后退
  const goNext = () => {
    if (moveIndex < moves.length - 1) {
      setMoveIndex(moveIndex + 1);
      setShowComment(false);
    }
  };

  const goPrev = () => {
    if (moveIndex >= 0) {
      setMoveIndex(moveIndex - 1);
      setShowComment(false);
    }
  };

  const goFirst = () => {
    setMoveIndex(-1);
    setShowComment(false);
  };

  const goLast = () => {
    setMoveIndex(moves.length - 1);
  };

  // 自动播放
  const autoPlayRef = useRef(null);
  const [autoPlaying, setAutoPlaying] = useState(false);
  useEffect(() => {
    if (autoPlaying && moveIndex < moves.length - 1) {
      autoPlayRef.current = setTimeout(() => {
        setMoveIndex((i) => i + 1);
      }, 800);
    } else if (moveIndex >= moves.length - 1) {
      setAutoPlaying(false);
    }
    return () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    };
  }, [autoPlaying, moveIndex, moves.length]);

  // 进度条
  const progress = moveIndex < 0 ? 0 : ((moveIndex + 1) / totalMoves) * 100;

  const handleJump = () => {
    const num = parseInt(jumpInput, 10);
    if (num >= 1 && num <= totalMoves) {
      setMoveIndex(num - 1);
      setJumpOpen(false);
      setJumpInput('');
    }
  };

  // 长按某手查看变化图
  const handleCellLongPress = (x, y) => {
    if (moveIndex < 0) return;
    setVariationMove({ x, y, moveNum: currentMove.num });
    setVariationOpen(true);
  };

  // 收藏妙手
  const handleCollect = () => {
    if (!currentMove || !currentMove.num) return;
    if (collected) return;
    // 飞入动画
    setFlyAnimation(true);
    setTimeout(() => {
      setFlyAnimation(false);
      setCollected(true);
      onCollect({
        gameId: game.id,
        moveNum: currentMove.num,
        title: currentMove.comment ? currentMove.comment.slice(0, 12) + '…' : `第 ${currentMove.num} 手`,
        note: currentMove.comment || '',
      });
    }, 500);
  };

  // 键盘控制
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'Home') goFirst();
      else if (e.key === 'End') goLast();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [moveIndex, moves.length]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: WENPING_COLORS.paper,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      <NavBar
        title={game.title}
        subtitle={`${game.black.name} 执黑 · ${game.white.name} 执白`}
        onBack={onBack}
        rightAction={
          <button
            onClick={() => setShowNumbers(!showNumbers)}
            style={{
              border: 'none',
              background: 'transparent',
              color: WENPING_COLORS.ink,
              fontSize: 12,
              cursor: 'pointer',
              padding: '6px 8px',
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            {showNumbers ? '隐手数' : '显手数'}
          </button>
        }
      />

      {/* 棋盘区 */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        position: 'relative',
      }}>
        {brilliantPulse && !reducedMotion && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle, rgba(107,142,90,0.15) 0%, transparent 70%)',
            animation: 'brilliantFade 1.2s ease-out forwards',
            pointerEvents: 'none',
            zIndex: 2,
          }} />
        )}
        <window.GoBoard
          moves={moves}
          currentIndex={moveIndex}
          showMoveNumbers={showNumbers}
          highlightBrilliant={true}
          size={Math.min(340, window.innerWidth - 40)}
          onCellLongPress={handleCellLongPress}
          reducedMotion={reducedMotion}
          readOnly={true}
        />
        {/* 飞入收藏动画 */}
        {flyAnimation && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 40, height: 40,
            borderRadius: '50%',
            background: WENPING_COLORS.moss,
            animation: 'collectFly 0.5s ease-in forwards',
            pointerEvents: 'none',
            zIndex: 10,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '100%', height: '100%', color: '#fff', fontSize: 18,
            }}>★</div>
          </div>
        )}
      </div>

      {/* 谱注浮现 */}
      {currentMove && currentMove.comment && (
        <div
          onClick={() => setShowComment(!showComment)}
          style={{
            margin: '0 12px 10px',
            padding: '10px 12px',
            background: currentMove.isBrilliant
              ? 'rgba(107, 142, 90, 0.12)'
              : 'rgba(232, 212, 168, 0.3)',
            borderRadius: 10,
            border: `1px solid ${currentMove.isBrilliant ? 'rgba(107,142,90,0.3)' : WENPING_COLORS.lineBrown}`,
            cursor: 'pointer',
            transition: 'all 0.3s',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {currentMove.isBrilliant && <WenPingTag color="moss" size="sm">妙手</WenPingTag>}
            <span style={{
              fontSize: 12,
              color: WENPING_COLORS.deepBrown,
              fontFamily: '"JetBrains Mono", monospace',
            }}>
              第 {currentMove.num} 手
            </span>
            <span style={{ flex: 1 }} />
            <svg
              width="12" height="12"
              viewBox="0 0 24 24" fill="none" stroke={WENPING_COLORS.deepBrown} strokeWidth="2"
              style={{ transform: showComment ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
          <div style={{
            maxHeight: showComment ? 200 : 0,
            transition: 'max-height 0.35s ease',
            overflow: 'hidden',
          }}>
            <div style={{
              fontSize: 13,
              color: WENPING_COLORS.ink,
              lineHeight: 1.6,
              paddingTop: 8,
              fontFamily: '"LXGW WenKai", "KaiTi", serif',
            }}>
              {currentMove.comment}
            </div>
          </div>
        </div>
      )}

      {/* 进度条 */}
      <div style={{
        margin: '0 16px 10px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <span style={{
          fontSize: 11,
          color: WENPING_COLORS.deepBrown,
          fontFamily: '"JetBrains Mono", monospace',
          width: 36,
        }}>
          {moveIndex < 0 ? 0 : moveIndex + 1}
        </span>
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            const idx = Math.max(0, Math.min(totalMoves - 1, Math.floor(pct * totalMoves)));
            setMoveIndex(idx);
          }}
          style={{
            flex: 1,
            height: 4,
            background: WENPING_COLORS.lineBrown,
            borderRadius: 2,
            position: 'relative',
            cursor: 'pointer',
          }}
        >
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${progress}%`,
            background: WENPING_COLORS.ink,
            borderRadius: 2,
            transition: 'width 0.25s ease',
          }} />
          <div style={{
            position: 'absolute',
            left: `calc(${progress}% - 6px)`,
            top: -4,
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: WENPING_COLORS.ink,
            transition: 'left 0.25s ease',
          }} />
        </div>
        <span style={{
          fontSize: 11,
          color: WENPING_COLORS.deepBrown,
          fontFamily: '"JetBrains Mono", monospace',
          width: 36,
          textAlign: 'right',
        }}>
          {totalMoves}
        </span>
      </div>

      {/* 控制栏 */}
      <div style={{
        padding: '0 12px 16px',
        paddingBottom: 'calc(16px + var(--ios-safe-bottom))',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          gap: 4,
        }}>
          {[
            { icon: '⏮', label: '首手', onClick: goFirst },
            { icon: '◀', label: '上一手', onClick: goPrev },
            {
              icon: autoPlaying ? '⏸' : '▶',
              label: autoPlaying ? '暂停' : '自动',
              onClick: () => setAutoPlaying(!autoPlaying),
            },
            { icon: '▶', label: '下一手', onClick: goNext, flip: true },
            { icon: '⏭', label: '末手', onClick: goLast },
          ].map((btn, i) => (
            <button
              key={i}
              onClick={btn.onClick}
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                border: `1px solid ${WENPING_COLORS.lineBrown}`,
                background: '#fff',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                transition: 'transform 0.1s, background 0.15s',
              }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.94)'; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <span style={{
                fontSize: 16,
                transform: btn.flip ? 'scaleX(-1)' : 'none',
                display: 'inline-block',
              }}>
                {btn.icon}
              </span>
              <span style={{
                fontSize: 10,
                color: WENPING_COLORS.deepBrown,
                fontFamily: '"LXGW WenKai", "KaiTi", serif',
              }}>
                {btn.label}
              </span>
            </button>
          ))}
          <button
            onClick={handleCollect}
            disabled={moveIndex < 0}
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              border: 'none',
              background: collected ? WENPING_COLORS.moss : 'rgba(107, 142, 90, 0.15)',
              color: collected ? '#fff' : WENPING_COLORS.moss,
              cursor: collected ? 'default' : 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              transition: 'all 0.2s',
              opacity: moveIndex < 0 ? 0.4 : 1,
            }}
          >
            <span style={{ fontSize: 18 }}>★</span>
            <span style={{ fontSize: 10, fontFamily: '"LXGW WenKai", "KaiTi", serif' }}>
              {collected ? '已收藏' : '收藏'}
            </span>
          </button>
        </div>
      </div>

      {/* 跳手数弹层 */}
      {jumpOpen && (
        <div
          onClick={() => setJumpOpen(false)}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(44, 24, 16, 0.4)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: 14,
              padding: 20,
              width: 260,
              animation: 'modalIn 0.25s ease-out',
            }}
          >
            <div style={{
              fontSize: 16, fontWeight: 600, color: WENPING_COLORS.ink,
              fontFamily: '"Noto Serif SC", "Songti SC", serif',
              marginBottom: 12, textAlign: 'center',
            }}>
              跳到第几手
            </div>
            <input
              type="number"
              value={jumpInput}
              onChange={(e) => setJumpInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJump()}
              placeholder={`1 - ${totalMoves}`}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: 16,
                border: `1px solid ${WENPING_COLORS.lineBrown}`,
                borderRadius: 8,
                outline: 'none',
                boxSizing: 'border-box',
                textAlign: 'center',
                fontFamily: '"JetBrains Mono", monospace',
              }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button
                onClick={() => setJumpOpen(false)}
                style={{
                  flex: 1, padding: '10px',
                  borderRadius: 8, border: `1px solid ${WENPING_COLORS.lineBrown}`,
                  background: 'transparent',
                  color: WENPING_COLORS.ink,
                  cursor: 'pointer',
                  fontFamily: '"LXGW WenKai", "KaiTi", serif',
                }}
              >
                取消
              </button>
              <button
                onClick={handleJump}
                style={{
                  flex: 1, padding: '10px',
                  borderRadius: 8, border: 'none',
                  background: WENPING_COLORS.ink,
                  color: WENPING_COLORS.stoneWhite,
                  cursor: 'pointer',
                  fontFamily: '"LXGW WenKai", "KaiTi", serif',
                }}
              >
                跳转
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 变化图弹层 */}
      {variationOpen && variationMove && (
        <div
          onClick={() => setVariationOpen(false)}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(44, 24, 16, 0.4)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              background: '#fff',
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              padding: '20px 16px calc(20px + var(--ios-safe-bottom))',
              animation: 'slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
            }}
          >
            <div style={{
              width: 36, height: 4,
              borderRadius: 2,
              background: WENPING_COLORS.lineBrown,
              margin: '0 auto 14px',
            }} />
            <div style={{
              fontSize: 16, fontWeight: 600, color: WENPING_COLORS.ink,
              fontFamily: '"Noto Serif SC", "Songti SC", serif',
              marginBottom: 6, textAlign: 'center',
            }}>
              变化图
            </div>
            <div style={{
              fontSize: 12, color: WENPING_COLORS.deepBrown,
              textAlign: 'center', marginBottom: 14,
              fontFamily: '"LXGW WenKai", "KaiTi", serif',
            }}>
              第 {variationMove.moveNum} 手 · 位置 ({variationMove.x + 1}, {variationMove.y + 1})
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 14,
            }}>
              <window.GoBoard
                moves={moves.slice(0, moveIndex + 1)}
                currentIndex={moveIndex}
                size={220}
                readOnly={true}
                reducedMotion={true}
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <WenPingButton variant="ghost" size="md" style={{ flex: 1 }} onClick={() => setVariationOpen(false)}>
                关闭
              </WenPingButton>
              <WenPingButton variant="primary" size="md" style={{ flex: 1 }} onClick={handleCollect}>
                收藏此手
              </WenPingButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ 死活题页 ============
function TSGPage({ problem, onBack }) {
  const [userMoves, setUserMoves] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [result, setResult] = useState(null); // 'correct' | 'wrong' | null
  const [currentColor, setCurrentColor] = useState(problem.blackToMove ? 'B' : 'W');

  const boardSize = 260;

  const handleCellClick = (x, y) => {
    if (showAnswer) return;
    // 简化：只允许落一子
    if (userMoves.length > 0) {
      setUserMoves([{ x, y, color: currentColor, num: 1 }]);
    } else {
      const newMove = { x, y, color: currentColor, num: 1 };
      setUserMoves([newMove]);
      // 判定（简化：只看第一手是否在答案位置附近）
      const { answerMove } = problem;
      if (answerMove && x === answerMove.x && y === answerMove.y) {
        setResult('correct');
      } else {
        setResult('wrong');
      }
    }
  };

  const resetProblem = () => {
    setUserMoves([]);
    setResult(null);
    setShowAnswer(false);
    setCurrentColor(problem.blackToMove ? 'B' : 'W');
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: WENPING_COLORS.paper,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <NavBar
        title="每日一题"
        subtitle={problem.title}
        onBack={onBack}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}>
          <WenPingTag color="brown" size="sm">难度 {problem.difficulty}</WenPingTag>
          <WenPingTag color="moss" size="sm">
            {problem.blackToMove ? '黑先' : '白先'}
          </WenPingTag>
        </div>

        <div style={{
          fontSize: 14,
          color: WENPING_COLORS.ink,
          lineHeight: 1.6,
          marginBottom: 16,
          fontFamily: '"LXGW WenKai", "KaiTi", serif',
        }}>
          {problem.summary}
        </div>

        {/* 棋盘 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 16,
        }}>
          <window.GoBoard
            moves={showAnswer ? problem.solution : userMoves}
            currentIndex={showAnswer ? problem.solution.length - 1 : userMoves.length - 1}
            initialStones={problem.initialStones}
            size={boardSize}
            onCellClick={handleCellClick}
            readOnly={showAnswer}
            lastMoveMark={true}
          />
        </div>

        {/* 结果提示 */}
        {result && !showAnswer && (
          <div style={{
            padding: '12px 14px',
            borderRadius: 10,
            marginBottom: 14,
            background: result === 'correct'
              ? 'rgba(107, 142, 90, 0.12)'
              : 'rgba(184, 84, 80, 0.1)',
            border: `1px solid ${result === 'correct' ? 'rgba(107,142,90,0.3)' : 'rgba(184,84,80,0.3)'}`,
            color: result === 'correct' ? WENPING_COLORS.moss : '#B85450',
            textAlign: 'center',
            fontFamily: '"LXGW WenKai", "KaiTi", serif',
            fontSize: 14,
            animation: 'fadeIn 0.3s ease',
          }}>
            {result === 'correct' ? '✓ 答对了！好棋！' : '✗ 再想想…不对哦'}
          </div>
        )}

        {/* 正解揭示 */}
        {showAnswer && (
          <div style={{
            padding: '14px',
            borderRadius: 10,
            marginBottom: 14,
            background: 'rgba(107, 142, 90, 0.08)',
            border: `1px solid rgba(107,142,90,0.2)`,
            animation: 'fadeIn 0.4s ease',
          }}>
            <div style={{
              fontSize: 14,
              fontWeight: 600,
              color: WENPING_COLORS.moss,
              marginBottom: 8,
              fontFamily: '"Noto Serif SC", "Songti SC", serif',
            }}>
              正解
            </div>
            <div style={{
              fontSize: 13,
              color: WENPING_COLORS.ink,
              lineHeight: 1.7,
              fontFamily: '"LXGW WenKai", "KaiTi", serif',
            }}>
              {problem.answerComment}
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div style={{ display: 'flex', gap: 10 }}>
          <WenPingButton variant="secondary" size="md" style={{ flex: 1 }} onClick={resetProblem}>
            重来
          </WenPingButton>
          <WenPingButton
            variant={showAnswer ? 'moss' : 'primary'}
            size="md"
            style={{ flex: 1 }}
            onClick={() => setShowAnswer(!showAnswer)}
          >
            {showAnswer ? '隐藏答案' : '查看正解'}
          </WenPingButton>
        </div>
      </div>
    </div>
  );
}

window.GameViewPage = GameViewPage;
window.TSGPage = TSGPage;
