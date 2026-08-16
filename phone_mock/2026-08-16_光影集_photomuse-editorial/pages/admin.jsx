// ===== 页面四：Admin 订单管理页（运营看板） =====
// 对齐契约：7 状态 Tab / 审核操作（通过/重拍/拒单）/ 交付上传 / 图片预览 / actionOrderId

function AdminPage(props) {
  const s = PM;
  const {
    adminStatus, setAdminStatus,
    adminOrders, setAdminOrders,
    adminLoading, setAdminLoading,
    actionOrderId, setActionOrderId,
    goBack, navigate, showToast, setIsAdmin,
    adminPassword,
  } = props;

  const [deliveryOrderId, setDeliveryOrderId] = useState(null);
  const [deliveryFiles, setDeliveryFiles] = useState([]);
  const [isDelivering, setIsDelivering] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewList, setPreviewList] = useState([]);
  const [retakeReason, setRetakeReason] = useState('');
  const [showRetakeModal, setShowRetakeModal] = useState(null);

  // 守卫：未登录踢回
  useEffect(() => {
    if (!adminPassword || adminPassword.length === 0) {
      showToast('请先登录', 'error');
      setTimeout(() => navigate('adminLogin'), 300);
    }
  }, []);

  // 模拟加载订单（按状态筛选）
  useEffect(() => {
    setAdminLoading(true);
    setTimeout(() => {
      const demoOrders = buildDemoOrders(adminStatus);
      setAdminOrders(demoOrders);
      setAdminLoading(false);
    }, 500);
  }, [adminStatus]);

  const buildDemoOrders = (status) => {
    const base = [
      {
        orderId: 'AIStudio-1730000001-abc123',
        productName: '证件照体验版',
        styleName: '蓝底正装',
        price: '¥3.9',
        order_status: 'photo_review',
        photo_check: 'unchecked',
        reference_photo_count: 1,
        delivery_file_count: 0,
        reviewNote: '',
        customerUrls: [IMG.cinematic],
        deliveryUrls: [],
        createdAt: '2026-08-16T10:23:00Z',
      },
      {
        orderId: 'AIStudio-1730000002-def456',
        productName: '简历形象照',
        styleName: '白底简约',
        price: '¥29.9',
        order_status: 'photo_review',
        photo_check: 'unchecked',
        reference_photo_count: 2,
        delivery_file_count: 0,
        reviewNote: '',
        customerUrls: [IMG.magazine, IMG.portrait],
        deliveryUrls: [],
        createdAt: '2026-08-16T09:15:00Z',
      },
      {
        orderId: 'AIStudio-1730000003-ghi789',
        productName: '证件照体验版',
        styleName: '红底经典',
        price: '¥3.9',
        order_status: 'photo_review',
        photo_check: 'unchecked',
        reference_photo_count: 1,
        delivery_file_count: 0,
        reviewNote: '',
        customerUrls: [IMG.idRed],
        deliveryUrls: [],
        createdAt: '2026-08-16T08:42:00Z',
      },
      {
        orderId: 'AIStudio-1729999999-jkl012',
        productName: '简历形象照',
        styleName: '白底简约',
        price: '¥29.9',
        order_status: 'queued',
        photo_check: 'passed',
        reference_photo_count: 2,
        delivery_file_count: 0,
        reviewNote: '',
        customerUrls: [IMG.portrait, IMG.cinematic],
        deliveryUrls: [],
        createdAt: '2026-08-15T16:30:00Z',
      },
      {
        orderId: 'AIStudio-1729999998-mno345',
        productName: '证件照体验版',
        styleName: '蓝底正装',
        price: '¥3.9',
        order_status: 'generating',
        photo_check: 'passed',
        reference_photo_count: 1,
        delivery_file_count: 0,
        reviewNote: '',
        customerUrls: [IMG.cinematic],
        deliveryUrls: [],
        createdAt: '2026-08-15T14:20:00Z',
      },
      {
        orderId: 'AIStudio-1729999997-pqr678',
        productName: '证件照体验版',
        styleName: '蓝底正装',
        price: '¥3.9',
        order_status: 'delivered',
        photo_check: 'passed',
        reference_photo_count: 1,
        delivery_file_count: 1,
        reviewNote: '',
        customerUrls: [IMG.portrait],
        deliveryUrls: [IMG.idBlue],
        createdAt: '2026-08-15T10:00:00Z',
      },
      {
        orderId: 'AIStudio-1729999996-stu901',
        productName: '证件照体验版',
        styleName: '蓝底正装',
        price: '¥3.9',
        order_status: 'waiting_photos',
        photo_check: 'need_retake',
        reference_photo_count: 1,
        delivery_file_count: 0,
        reviewNote: '光线过暗，面部细节不清晰，请重新上传。',
        customerUrls: [IMG.cinematic],
        deliveryUrls: [],
        createdAt: '2026-08-15T09:30:00Z',
      },
      {
        orderId: 'AIStudio-1729999995-vwx234',
        productName: '证件照体验版',
        styleName: '蓝底正装',
        price: '¥3.9',
        order_status: 'cancelled',
        photo_check: 'rejected',
        reference_photo_count: 1,
        delivery_file_count: 0,
        reviewNote: '多次补拍仍不符合要求，订单已取消。',
        customerUrls: [IMG.cinematic],
        deliveryUrls: [],
        createdAt: '2026-08-14T18:00:00Z',
      },
      {
        orderId: 'AIStudio-1729999994-yza567',
        productName: '简历形象照',
        styleName: '白底简约',
        price: '¥29.9',
        order_status: 'qc',
        photo_check: 'passed',
        reference_photo_count: 2,
        delivery_file_count: 3,
        reviewNote: '',
        customerUrls: [IMG.magazine, IMG.portrait],
        deliveryUrls: [IMG.idBlue, IMG.portrait, IMG.magazine],
        createdAt: '2026-08-14T17:00:00Z',
      },
    ];
    return base.filter(o => o.order_status === status);
  };

  const selectStatus = (status) => {
    setAdminStatus(status);
  };

  const passReview = (orderId) => {
    setActionOrderId(orderId);
    setTimeout(() => {
      setAdminOrders(prev => prev.filter(o => o.orderId !== orderId));
      setActionOrderId(null);
      showToast('审核通过，已进入制作队列', 'success');
    }, 800);
  };

  const requestRetake = (orderId) => {
    setShowRetakeModal(orderId);
    setRetakeReason('光线不均匀，面部有阴影，建议在自然光下重新拍摄。');
  };

  const confirmRetake = () => {
    if (!retakeReason.trim()) {
      showToast('请填写补拍原因', 'error');
      return;
    }
    const orderId = showRetakeModal;
    setShowRetakeModal(null);
    setActionOrderId(orderId);
    setTimeout(() => {
      setAdminOrders(prev => prev.filter(o => o.orderId !== orderId));
      setActionOrderId(null);
      showToast('已通知用户补拍', 'success');
    }, 800);
  };

  const rejectOrder = (orderId) => {
    if (!confirm('确认拒绝该订单吗？')) return;
    setActionOrderId(orderId);
    setTimeout(() => {
      setAdminOrders(prev => prev.filter(o => o.orderId !== orderId));
      setActionOrderId(null);
      showToast('订单已拒绝', 'info');
    }, 800);
  };

  // 交付相关
  const openDelivery = (orderId) => {
    setDeliveryOrderId(orderId);
    setDeliveryFiles([]);
  };

  const closeDelivery = () => {
    setDeliveryOrderId(null);
    setDeliveryFiles([]);
  };

  const chooseDelivery = () => {
    const candidates = [IMG.idBlue, IMG.portrait, IMG.magazine];
    const newFiles = [];
    for (let i = 0; i < 3; i++) {
      newFiles.push({
        id: Date.now() + i,
        url: candidates[(deliveryFiles.length + i) % candidates.length],
        size: 2048000 + Math.floor(Math.random() * 1000000),
        fileName: `delivery-${deliveryFiles.length + i + 1}.jpg`,
      });
    }
    setDeliveryFiles(prev => [...prev, ...newFiles].slice(0, 9));
  };

  const removeDeliveryFile = (id) => {
    setDeliveryFiles(prev => prev.filter(f => f.id !== id));
  };

  const uploadDeliveryFiles = () => {
    if (deliveryFiles.length === 0) {
      showToast('请先选择交付图片', 'error');
      return;
    }
    setIsDelivering(true);
    setTimeout(() => {
      setAdminOrders(prev => prev.filter(o => o.orderId !== deliveryOrderId));
      setIsDelivering(false);
      setDeliveryOrderId(null);
      setDeliveryFiles([]);
      showToast('交付图已上传，订单已交付', 'success');
    }, 1500);
  };

  const previewImage = (url, urls) => {
    setPreviewUrl(url);
    setPreviewList(urls || [url]);
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    showToast('已退出登录', 'info');
    setTimeout(() => navigate('adminLogin'), 400);
  };

  const isPhotoReview = adminStatus === 'photo_review';
  const canDelivery = adminStatus === 'qc' || adminStatus === 'generating' || adminStatus === 'queued';

  return (
    <div style={{
      flex: 1, overflowY: 'auto', overflowX: 'hidden',
      background: s.pageBg, color: s.ink,
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* 顶栏 */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: s.pageBg,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '52px 24px 12px',
        }}>
          <div
            onClick={logoutAdmin}
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
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase' }}>
              Admin
            </div>
            <div style={{
              fontFamily: s.serif,
              fontStyle: 'italic',
              fontSize: 11,
              color: s.inkTertiary,
              marginTop: 1,
            }}>PhotoMuse Ops</div>
          </div>
          <div
            onClick={logoutAdmin}
            style={{
              fontSize: 12,
              color: s.error,
              cursor: 'pointer',
              fontWeight: 500,
              letterSpacing: 0.5,
            }}
          >退出</div>
        </div>
        <div style={{ height: 1, background: s.hairline, opacity: 0.4 }} />
      </div>

      {/* 统计卡片 */}
      <div style={{ padding: '20px 28px 0' }}>
        <div style={{
          display: 'flex',
          border: `1px solid ${s.border}`,
        }}>
          {[
            { label: '待审核', value: adminOrders.filter(o => o.order_status === 'photo_review').length, active: adminStatus === 'photo_review' },
            { label: '制作中', value: 5, border: true },
            { label: '今日交付', value: 12, border: true },
          ].map((stat, i) => (
            <div key={i} style={{
              flex: 1,
              padding: '18px 0',
              textAlign: 'center',
              borderLeft: i > 0 ? `1px solid ${s.border}` : 'none',
            }}>
              <div style={{
                fontFamily: s.display,
                fontStyle: 'italic',
                fontSize: 24,
                color: s.ink,
                marginBottom: 4,
                fontWeight: 400,
              }}>{stat.value}</div>
              <div style={{
                fontSize: 9,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                color: s.inkTertiary,
              }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 状态筛选 Tab */}
      <div style={{
        padding: '20px 28px 0',
        display: 'flex',
        gap: 0,
        overflowX: 'auto',
        borderBottom: `1px solid ${s.border}`,
      }}>
          {ADMIN_STATUS_OPTIONS.map(tab => {
            const count = tab.value === adminStatus ? adminOrders.length : null;
            return (
              <div
                key={tab.value}
                onClick={() => selectStatus(tab.value)}
                onMouseEnter={(e) => {
                  if (adminStatus !== tab.value) e.currentTarget.style.color = s.inkSecondary;
                }}
                onMouseLeave={(e) => {
                  if (adminStatus !== tab.value) e.currentTarget.style.color = s.inkTertiary;
                }}
                style={{
                  flexShrink: 0,
                  padding: '14px 0',
                  marginRight: 22,
                  fontSize: 12,
                  color: adminStatus === tab.value ? s.ink : s.inkTertiary,
                  fontWeight: adminStatus === tab.value ? 600 : 400,
                  cursor: 'pointer',
                  position: 'relative',
                  letterSpacing: 0.3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'color 0.2s ease',
                }}
              >
              {tab.label}
              {count !== null && (
                <span style={{
                  fontSize: 10,
                  color: adminStatus === tab.value ? s.ink : s.inkFaint,
                  fontFamily: s.display,
                  fontStyle: 'italic',
                }}>{count}</span>
              )}
              {adminStatus === tab.value && (
                <div style={{
                  position: 'absolute', bottom: -1, left: 0, right: -22,
                  height: 1.5, background: s.ink,
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* 订单列表 */}
      <div style={{ padding: '0 28px 28px', flex: 1 }}>
        {adminLoading ? (
          <div style={{
            padding: '60px 0',
            textAlign: 'center',
            fontSize: 12,
            color: s.inkTertiary,
            letterSpacing: 1,
          }}>加载中...</div>
        ) : adminOrders.length === 0 ? (
          <div style={{
            padding: '64px 20px',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: s.display,
              fontStyle: 'italic',
              fontSize: 20,
              color: s.ink,
              marginBottom: 6,
            }}>No Orders</div>
            <div style={{
              fontSize: 11,
              color: s.inkTertiary,
              letterSpacing: 1,
            }}>
              该状态下暂无订单
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {adminOrders.map((order, idx) => (
              <div
                key={order.orderId}
                style={{
                  padding: '20px 12px',
                  margin: '0 -12px',
                  borderBottom: idx < adminOrders.length - 1 ? `1px solid ${s.divider}` : 'none',
                  transition: 'background 0.25s ease',
                  borderRadius: 8,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = s.surfaceAlt; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                {/* 订单头 */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 14,
                }}>
                  <div style={{ flex: 1, minWidth: 0, marginRight: 10 }}>
                    <div style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: s.ink,
                      marginBottom: 3,
                    }}>
                      {order.productName} · {order.styleName}
                    </div>
                    <div style={{
                      fontSize: 10,
                      color: s.inkTertiary,
                      fontFamily: s.mono,
                      letterSpacing: 0.3,
                    }}>
                      {order.orderId}
                    </div>
                    <div style={{
                      fontSize: 10,
                      color: s.inkTertiary,
                      marginTop: 4,
                    }}>
                      参考照片：{order.reference_photo_count} 张
                    </div>
                  </div>
                  <div style={{
                    textAlign: 'right',
                    flexShrink: 0,
                  }}>
                    <div style={{
                      fontFamily: s.display,
                      fontStyle: 'italic',
                      fontSize: 18,
                      color: s.ink,
                      marginBottom: 4,
                    }}>{order.price}</div>
                    <StatusBadge status={order.order_status} />
                  </div>
                </div>

                {/* 审核意见（有则展示） */}
                {order.reviewNote && (
                  <div style={{
                    padding: '10px 12px',
                    background: s.warningSoft,
                    marginBottom: 14,
                    fontSize: 11,
                    color: s.warning,
                    lineHeight: 1.6,
                  }}>
                    <span style={{ fontWeight: 600 }}>审核意见：</span>{order.reviewNote}
                  </div>
                )}

                {/* 参考图 */}
                <div style={{
                  display: 'flex',
                  gap: 10,
                  marginBottom: 16,
                  alignItems: 'flex-start',
                }}>
                  {order.customerUrls?.map((url, i) => (
                    <div
                      key={i}
                      onClick={() => previewImage(url, order.customerUrls)}
                      style={{
                        width: 60, height: 76,
                        overflow: 'hidden',
                        border: `1px solid ${s.border}`,
                        cursor: 'zoom-in',
                        transition: 'transform 0.25s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                    >
                      <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                  {order.deliveryUrls?.length > 0 && (
                    <div style={{
                      marginLeft: 'auto',
                      display: 'flex',
                      gap: 6,
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                    }}>
                      <div style={{
                        fontSize: 10,
                        color: s.inkTertiary,
                        letterSpacing: 0.5,
                      }}>交付图</div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {order.deliveryUrls.slice(0, 3).map((url, i) => (
                          <div
                            key={i}
                            onClick={() => previewImage(url, order.deliveryUrls)}
                            style={{
                              width: 44, height: 56,
                              overflow: 'hidden',
                              border: `1px solid ${s.border}`,
                              cursor: 'zoom-in',
                            }}
                          >
                            <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 操作区 */}
                <div style={{
                  display: 'flex',
                  paddingTop: 14,
                  borderTop: `1px solid ${s.divider}`,
                  gap: 0,
                }}>
                  {isPhotoReview && (
                    <>
                      <AdminActionBtn
                        label="通过"
                        color={s.success}
                        onClick={() => passReview(order.orderId)}
                        loading={actionOrderId === order.orderId}
                      />
                      <AdminActionBtn
                        label="重拍"
                        color={s.warning}
                        onClick={() => requestRetake(order.orderId)}
                        loading={actionOrderId === order.orderId}
                      />
                      <AdminActionBtn
                        label="拒单"
                        color={s.error}
                        onClick={() => rejectOrder(order.orderId)}
                        loading={actionOrderId === order.orderId}
                      />
                    </>
                  )}
                  {canDelivery && (
                    <AdminActionBtn
                      label="上传交付"
                      color={s.ink}
                      onClick={() => openDelivery(order.orderId)}
                      full={!isPhotoReview}
                    />
                  )}
                  {adminStatus === 'delivered' && (
                    <AdminActionBtn
                      label="查看详情"
                      color={s.ink}
                      onClick={() => previewImage(order.deliveryUrls[0], order.deliveryUrls)}
                      full
                    />
                  )}
                  {adminStatus === 'cancelled' && (
                    <div style={{
                      flex: 1,
                      textAlign: 'center',
                      fontSize: 12,
                      color: s.inkTertiary,
                      padding: '8px 0',
                    }}>订单已取消</div>
                  )}
                  {adminStatus === 'waiting_photos' && (
                    <div style={{
                      flex: 1,
                      textAlign: 'center',
                      fontSize: 12,
                      color: s.warning,
                      padding: '8px 0',
                    }}>等待用户补拍</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 底部 */}
      <div style={{
        textAlign: 'center',
        paddingBottom: 32,
        fontSize: 9,
        color: s.inkFaint,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        fontFamily: s.serif,
        fontStyle: 'italic',
      }}>
        — Admin Console · v1.0 —
      </div>

      {/* ===== 交付上传弹层 ===== */}
      {deliveryOrderId && (
        <div
          onClick={closeDelivery}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'flex-end',
            animation: 'fadeIn 0.25s ease',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 480,
              margin: '0 auto',
              background: s.pageBg,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              padding: '24px 28px 28px',
              animation: 'slideUp 0.3s ease',
              maxHeight: '85vh',
              overflowY: 'auto',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}>
              <div>
                <div style={{
                  fontFamily: s.serif,
                  fontSize: 20,
                  fontStyle: 'italic',
                  fontWeight: 600,
                }}>上传交付图</div>
                <div style={{
                  fontSize: 10,
                  color: s.inkTertiary,
                  letterSpacing: 1,
                  marginTop: 2,
                }}>{deliveryOrderId}</div>
              </div>
              <div
                onClick={closeDelivery}
                style={{
                  width: 28, height: 28,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={s.ink} strokeWidth="1">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              marginBottom: 16,
              alignItems: 'flex-start',
            }}>
              {deliveryFiles.map((f, i) => (
                <div key={f.id} style={{ position: 'relative', width: 72, height: 90 }}>
                  <img src={f.url} style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    border: `1px solid ${s.border}`,
                  }} />
                  <div
                    onClick={() => removeDeliveryFile(f.id)}
                    style={{
                      position: 'absolute', top: -7, right: -7,
                      width: 20, height: 20,
                      borderRadius: '50%',
                      background: s.ink,
                      color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: 12,
                    }}
                  >×</div>
                  <div style={{
                    textAlign: 'center',
                    fontSize: 9,
                    color: s.inkTertiary,
                    marginTop: 2,
                  }}>{(f.size / 1024 / 1024).toFixed(1)}MB</div>
                </div>
              ))}
              {deliveryFiles.length < 9 && (
                <div
                  onClick={chooseDelivery}
                  style={{
                    width: 72, height: 90,
                    border: `1px dashed ${s.inkFaint}`,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: 5,
                    cursor: 'pointer',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={s.inkTertiary} strokeWidth="1">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  <span style={{ fontSize: 10, color: s.inkTertiary }}>添加图片</span>
                </div>
              )}
            </div>

            <div style={{
              fontSize: 11,
              color: s.inkTertiary,
              lineHeight: 1.6,
              padding: '10px 12px',
              background: s.surfaceAlt,
              marginBottom: 20,
            }}>
              最多上传 9 张交付图。上传后订单状态将自动更新为「已交付」。
            </div>

            <button
              onClick={uploadDeliveryFiles}
              disabled={isDelivering}
              style={{
                width: '100%',
                height: 52,
                background: isDelivering ? s.inkSecondary : s.ink,
                border: 'none',
                color: '#fff',
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: 3,
                cursor: isDelivering ? 'not-allowed' : 'pointer',
                textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8,
              }}
            >
              {isDelivering ? (
                <>
                  <div style={{
                    width: 12, height: 12,
                    border: '1.5px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    animation: 'spin-slow 0.8s linear infinite',
                  }} />
                  UPLOADING
                </>
              ) : '确认交付'}
            </button>
          </div>
        </div>
      )}

      {/* ===== 重拍原因弹层 ===== */}
      {showRetakeModal && (
        <div
          onClick={() => setShowRetakeModal(null)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 28px',
            animation: 'fadeIn 0.25s ease',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 360,
              background: s.pageBg,
              padding: '28px',
              animation: 'slideUp 0.3s ease',
            }}
          >
            <div style={{
              fontFamily: s.serif,
              fontSize: 20,
              fontStyle: 'italic',
              fontWeight: 600,
              marginBottom: 8,
            }}>要求补拍</div>
            <div style={{ fontSize: 12, color: s.inkSecondary, lineHeight: 1.7, marginBottom: 16 }}>
              请填写补拍原因，用户将收到通知。
            </div>

            <textarea
              value={retakeReason}
              onChange={(e) => setRetakeReason(e.target.value)}
              placeholder="请输入补拍原因"
              style={{
                width: '100%',
                minHeight: 100,
                padding: 12,
                background: s.surfaceAlt,
                border: `1px solid ${s.border}`,
                fontSize: 13,
                color: s.ink,
                outline: 'none',
                resize: 'none',
                fontFamily: s.body,
                lineHeight: 1.6,
                marginBottom: 16,
              }}
            />

            {/* 常用原因快捷 */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              marginBottom: 20,
            }}>
              {['光线过暗', '面部有遮挡', '角度不端正', '像素模糊'].map(reason => (
                <div
                  key={reason}
                  onClick={() => setRetakeReason(reason + '，请重新上传清晰正脸照。')}
                  style={{
                    padding: '4px 10px',
                    fontSize: 11,
                    border: `1px solid ${s.border}`,
                    color: s.inkSecondary,
                    cursor: 'pointer',
                  }}
                >{reason}</div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowRetakeModal(null)}
                style={{
                  flex: 1,
                  height: 46,
                  background: 'transparent',
                  border: `1px solid ${s.hairline}`,
                  color: s.inkTertiary,
                  fontSize: 12,
                  cursor: 'pointer',
                  letterSpacing: 1,
                }}
              >取消</button>
              <button
                onClick={confirmRetake}
                style={{
                  flex: 1,
                  height: 46,
                  background: s.warning,
                  border: 'none',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                  letterSpacing: 2,
                }}
              >确认重拍</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== 图片预览层 ===== */}
      {previewUrl && (
        <div
          onClick={() => setPreviewUrl(null)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.92)',
            zIndex: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.25s ease',
            cursor: 'zoom-out',
          }}
        >
          <img src={previewUrl} style={{
            maxWidth: '90%',
            maxHeight: '80%',
            objectFit: 'contain',
          }} />
          <div
            onClick={() => setPreviewUrl(null)}
            style={{
              position: 'absolute',
              top: 24, right: 24,
              width: 40, height: 40,
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

// 管理操作按钮
function AdminActionBtn({ label, color, onClick, loading, full = false }) {
  const s = PM;
  return (
    <button
      onClick={onClick}
      disabled={loading}
      onMouseEnter={(e) => {
        if (!loading) {
          e.currentTarget.style.background = color;
          e.currentTarget.style.color = '#fff';
          e.currentTarget.style.fontWeight = 600;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = color;
        e.currentTarget.style.fontWeight = 500;
      }}
      style={{
        flex: full ? 1 : undefined,
        flexGrow: 1,
        height: 40,
        background: 'transparent',
        border: 'none',
        color: color,
        fontSize: 12,
        cursor: loading ? 'not-allowed' : 'pointer',
        fontWeight: 500,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRight: full ? 'none' : `1px solid ${s.divider}`,
        padding: '0 8px',
        letterSpacing: 0.3,
        whiteSpace: 'nowrap',
        transition: 'all 0.2s ease',
        borderRadius: 4,
      }}
    >
      {loading ? '...' : label}
    </button>
  );
}

Object.assign(window, { AdminPage, AdminActionBtn });
