// ===== 页面三：AdminLogin 管理登录页 =====
// 对齐契约：口令校验 / isChecking / errorMessage / 登录态写入

function AdminLoginPage(props) {
  const s = PM;
  const { goBack, navigate, showToast, setAdminPassword: setGlobalAdminPassword, setIsAdmin } = props;

  const [password, setPassword] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onPasswordInput = (value) => {
    setPassword(value.trim());
    if (errorMessage) setErrorMessage('');
  };

  const loginAdmin = () => {
    if (!password.trim()) {
      setErrorMessage('请输入管理口令');
      return;
    }
    if (password.trim().length < 4) {
      setErrorMessage('口令格式不正确');
      return;
    }
    setIsChecking(true);
    setErrorMessage('');
    // 模拟：调用 adminListAIStudioOrders 作口令探测
    setTimeout(() => {
      // 演示模式：任意非空口令通过
      setIsChecking(false);
      setGlobalAdminPassword(password);
      setIsAdmin(true);
      showToast('登录成功', 'success');
      setTimeout(() => navigate('admin'), 400);
    }, 1000);
  };

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      background: s.pageBg,
      color: s.ink,
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* 顶栏 */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '52px 24px 14px',
      }}>
        <div
          onClick={goBack}
          style={{
            width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={s.ink} strokeWidth="1">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </div>
        <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase' }}>
          Admin
        </div>
        <div style={{ width: 32 }} />
      </div>
      <div style={{ height: 1, background: s.hairline, opacity: 0.4 }} />

      {/* 登录卡片区 */}
      <div style={{
        flex: 1,
        padding: '60px 32px 32px',
        display: 'flex',
        flexDirection: 'column',
      }}>

        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            fontSize: 9,
            fontWeight: 500,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: s.accent,
            marginBottom: 18,
          }}>
            PhotoMuse · Ops
          </div>

          <h1 style={{
            fontFamily: s.display,
            fontSize: 40,
            fontWeight: 400,
            lineHeight: 0.95,
            marginBottom: 2,
          }}>Admin</h1>
          <h1 style={{
            fontFamily: s.display,
            fontSize: 40,
            fontWeight: 400,
            fontStyle: 'italic',
            lineHeight: 0.95,
          }}>Console</h1>

          <div style={{
            width: 32, height: 1,
            background: s.ink,
            margin: '22px auto',
          }} />

          <p style={{
            fontSize: 12,
            color: s.inkSecondary,
            lineHeight: 1.7,
            maxWidth: 240,
            margin: '0 auto',
          }}>
            请输入管理口令进入运营控制台。
          </p>
        </div>

        {/* 权限说明 */}
        <div style={{
          padding: '20px 0',
          borderTop: `1px solid ${s.border}`,
          borderBottom: `1px solid ${s.border}`,
          marginBottom: 32,
        }}>
          <div style={{
            fontSize: 10,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: s.inkTertiary,
            marginBottom: 14,
          }}>可管理内容</div>
          {[
            '审核订单与照片质量',
            '派发补拍与拒绝订单',
            '上传交付成品图',
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '7px 0',
              fontSize: 13,
              color: s.inkSecondary,
            }}>
              <div style={{
                width: 4, height: 4,
                borderRadius: '50%',
                background: s.accent,
                marginRight: 12,
                flexShrink: 0,
              }} />
              {item}
            </div>
          ))}
        </div>

        {/* 密码输入 */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            fontSize: 10,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: s.inkTertiary,
            marginBottom: 8,
          }}>管理口令</div>
          <input
            type="password"
            value={password}
            onChange={(e) => onPasswordInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && loginAdmin()}
            placeholder="请输入管理口令"
            autoFocus
            style={{
              width: '100%',
              height: 48,
              padding: '8px 0',
              background: 'transparent',
              border: 'none',
              borderBottom: `1px solid ${errorMessage ? s.error : s.border}`,
              fontSize: 15,
              color: s.ink,
              outline: 'none',
              fontFamily: s.body,
              letterSpacing: 1,
            }}
          />
          {errorMessage && (
            <div style={{
              marginTop: 12,
              padding: '10px 14px',
              background: s.errorSoft,
              color: s.error,
              fontSize: 12,
              lineHeight: 1.5,
            }}>{errorMessage}</div>
          )}
        </div>

        {/* 登录按钮 */}
        <button
          onClick={loginAdmin}
          disabled={isChecking}
          style={{
            height: 56,
            background: isChecking ? s.inkSecondary : s.ink,
            border: 'none',
            color: '#fff',
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: 3,
            cursor: isChecking ? 'not-allowed' : 'pointer',
            textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 10,
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: isChecking ? 'none' : '0 4px 16px rgba(26,26,26,0.12)',
          }}
          onMouseEnter={(e) => {
            if (!isChecking) {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(26,26,26,0.18)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = isChecking ? 'none' : '0 4px 16px rgba(26,26,26,0.12)';
          }}
        >
          {isChecking ? (
            <>
              <div style={{
                width: 14, height: 14,
                border: '1.5px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff',
                borderRadius: '50%',
                animation: 'spin-slow 0.8s linear infinite',
              }} />
              VERIFYING
            </>
          ) : 'Enter Console'}
        </button>

        <div style={{
          textAlign: 'center',
          marginTop: 20,
          fontSize: 10,
          color: s.inkTertiary,
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}>
          Demo Mode — Any password works
        </div>

        {/* 底部装饰 */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingBottom: 8,
        }}>
          <div style={{
            fontSize: 9,
            color: s.inkFaint,
            letterSpacing: 2,
            textTransform: 'uppercase',
            fontFamily: s.serif,
            fontStyle: 'italic',
          }}>
            — PhotoMuse Admin v1.0 —
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AdminLoginPage });
