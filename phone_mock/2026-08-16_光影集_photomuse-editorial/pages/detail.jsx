// ===== 页面二：Detail 订单详情页（客户视角） =====
// 对齐契约：状态卡 / 订单信息 / 补拍上传 / 交付图 / 进度 / queryMode

function DetailPage(props) {
  const s = PM;
  const {
    currentOrder, setCurrentOrder,
    currentOrderFiles, setCurrentOrderFiles,
    detailLoading, setDetailLoading,
    queryMode, setQueryMode,
    goBack, navigate, showToast,
  } = props;

  const [retakePhotos, setRetakePhotos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(65);
  const [previewUrl, setPreviewUrl] = useState(null);

  const order = currentOrder;
  const needRetake = order?.photo_check === 'need_retake';

  const customerFiles = currentOrderFiles.filter(f => f.fileType === 'customer_photo');
  const deliveryFiles = currentOrderFiles.filter(f => f.fileType === 'delivery');

  // 模拟生成中进度推进
  useEffect(() => {
    if (order && (order.order_status === 'queued' || order.order_status === 'generating')) {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setCurrentOrder(prev => prev ? {
              ...prev,
              order_status: 'delivered',
              delivery_file_count: 1,
            } : null);
            return 100;
          }
          return prev + 1.5;
        });
      }, 280);
      return () => clearInterval(timer);
    }
  }, [order?.order_status]);

  if (!order) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.inkTertiary }}>
        加载订单中...
      </div>
    );
  }

  const chooseRetakePhotos = () => {
    if (retakePhotos.length >= 3) { showToast('最多上传 3 张参考照片', 'error'); return; }
    const remaining = 3 - retakePhotos.length;
    const candidates = [IMG.portrait, IMG.idBlue, IMG.magazine];
    const newPhotos = [];
    for (let i = 0; i < remaining; i++) {
      newPhotos.push({
        id: Date.now() + i,
        tempFilePath: candidates[(retakePhotos.length + i) % candidates.length],
        url: candidates[(retakePhotos.length + i) % candidates.length],
        size: 800000 + Math.floor(Math.random() * 400000),
      });
    }
    setRetakePhotos(prev => [...prev, ...newPhotos]);
  };

  const removeRetakePhoto = (index) => {
    setRetakePhotos(prev => prev.filter((_, i) => i !== index));
  };

  const submitRetakePhotos = () => {
    if (retakePhotos.length === 0) { showToast('请至少上传 1 张正脸照片', 'error'); return; }
    setIsUploading(true);
    // 模拟 upload → submit
    setTimeout(() => {
      setCurrentOrder(prev => prev ? {
        ...prev,
        order_status: 'photo_review',
        photo_check: 'unchecked',
        reference_photo_count: prev.reference_photo_count + retakePhotos.length,
      } : null);
      setCurrentOrderFiles(prev => [
        ...prev,
        ...retakePhotos.map((p, i) => ({
          fileId: `retake-${Date.now()}-${i}`,
          fileType: 'customer_photo',
          fileID: p.url,
          fileName: `retake-${i + 1}.jpg`,
          size: p.size,
          status: 'uploaded',
        })),
      ]);
      setRetakePhotos([]);
      setIsUploading(false);
      showToast('补拍照片已提交', 'success');
    }, 1200);
  };

  const previewDelivery = (url) => {
    setPreviewUrl(url);
  };

  const closePreview = () => {
    setPreviewUrl(null);
  };

  const statusInfo = STATUS_LABELS[order.order_status] || '进行中';
  const photoCheckInfo = PHOTO_CHECK_LABELS[order.photo_check] || '未知';

  // 步骤进度
  const steps = [
    { label: '上传', done: order.order_status !== 'waiting_photos' },
    { label: '审核', done: order.order_status !== 'photo_review' && order.order_status !== 'waiting_photos' && order.photo_check !== 'need_retake' && order.photo_check !== 'unchecked', current: order.order_status === 'photo_review' || order.photo_check === 'need_retake' },
    { label: '制作', done: order.order_status === 'qc' || order.order_status === 'delivered' || order.order_status === 'cancelled', current: order.order_status === 'queued' || order.order_status === 'generating' },
    { label: '交付', done: order.order_status === 'delivered', current: order.order_status === 'qc' },
  ];

  const isActive = (order.order_status === 'queued' || order.order_status === 'generating' || order.order_status === 'qc');

  return (
    <div style={{
      flex: 1, overflowY: 'auto', overflowX: 'hidden',
      background: s.pageBg, color: s.ink,
    }}>

      {/* 顶栏 */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: s.pageBg,
      }}>
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
          <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase', color: s.ink }}>
            Order Detail
          </div>
          <div style={{ width: 32 }} />
        </div>
        <div style={{ height: 1, background: s.hairline, opacity: 0.4 }} />
      </div>

      {/* 状态大标题区 */}
      <div style={{ padding: '36px 28px 28px', textAlign: 'center' }}>
        <div style={{
          fontSize: 9,
          letterSpacing: 3,
          textTransform: 'uppercase',
          color: s.inkTertiary,
          marginBottom: 16,
          fontFamily: s.mono,
        }}>{order.orderId}</div>

        <h1 style={{
          fontFamily: s.display,
          fontSize: 48,
          fontWeight: 400,
          lineHeight: 0.95,
          marginBottom: 4,
        }}>
          {order.order_status === 'delivered' ? 'Ready' :
           needRetake ? 'Retake' :
           order.order_status === 'photo_review' ? 'In' :
           order.order_status === 'cancelled' ? 'Cancelled' :
           'In'}
        </h1>
        <h1 style={{
          fontFamily: s.display,
          fontSize: 48,
          fontWeight: 400,
          fontStyle: 'italic',
          lineHeight: 0.95,
        }}>
          {order.order_status === 'delivered' ? 'to View' :
           needRetake ? 'Required' :
           order.order_status === 'photo_review' ? 'Review' :
           order.order_status === 'cancelled' ? 'Order' :
           'Progress'}
        </h1>

        <div style={{
          width: 36, height: 1,
          background: s.ink,
          margin: '24px auto',
        }} />

        <p style={{
          fontSize: 13,
          color: s.inkSecondary,
          lineHeight: 1.75,
          maxWidth: 260,
          margin: '0 auto',
        }}>
          {order.order_status === 'delivered'
            ? '您的照片已制作完成，快来查看吧。'
            : needRetake
            ? '照片不符合要求，请重新上传清晰正脸照。'
            : order.order_status === 'photo_review'
            ? '工作人员正在审核您的照片，请稍候。'
            : order.order_status === 'cancelled'
            ? '订单已取消。'
            : '照片正在制作中，完成后会第一时间呈现。'}
        </p>
      </div>

      {/* 进度条与步骤节点（生成中显示） */}
      {isActive && (
        <div style={{ padding: '0 28px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: s.inkSecondary }}>制作进度</span>
            <span style={{
              fontFamily: s.serif,
              fontStyle: 'italic',
              fontSize: 16,
              color: s.ink,
            }}>{Math.floor(progress)}%</span>
          </div>
          <div style={{
            height: 2,
            background: s.divider,
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: s.ink,
              transition: 'width 0.3s ease',
            }} />
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 20,
          }}>
            {steps.map((step, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 8, height: 8,
                  borderRadius: '50%',
                  background: step.done ? s.ink : step.current ? s.ink : s.inkFaint,
                  margin: '0 auto 8px',
                  boxShadow: step.current ? `0 0 0 4px ${s.surfaceAlt}` : 'none',
                  transition: 'all 0.3s ease',
                }} />
                <div style={{
                  fontSize: 10,
                  color: step.done || step.current ? s.ink : s.inkTertiary,
                  fontWeight: step.current ? 600 : 400,
                  letterSpacing: 0.5,
                }}>{step.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 发丝线 */}
      <div style={{ height: 1, background: s.hairline, opacity: 0.4, margin: '0 28px' }} />

      {/* 凭证查询提示 */}
      {queryMode && (
        <div style={{
          margin: '20px 28px 0',
          padding: '12px 16px',
          background: s.infoSoft,
          color: s.info,
          fontSize: 12,
          lineHeight: 1.6,
        }}>
          您正在通过订单号 + 手机号 + 查询密码查看订单。
        </div>
      )}

      {/* 补拍上传区 */}
      {needRetake && (
        <div style={{ padding: '24px 28px' }}>
          <div style={{
            padding: '18px',
            border: `1px solid ${s.warning}`,
            marginBottom: 20,
          }}>
            <div style={{
              fontFamily: s.serif,
              fontSize: 15,
              fontStyle: 'italic',
              fontWeight: 600,
              color: s.warning,
              marginBottom: 8,
            }}>照片审核未通过</div>
            <div style={{ fontSize: 12, color: s.inkSecondary, lineHeight: 1.7 }}>
              {order.reviewNote || '照片不符合制作要求，请重新上传清晰正脸照。'}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{
              fontFamily: s.serif,
              fontSize: 18,
              fontStyle: 'italic',
              fontWeight: 600,
            }}>补拍上传</div>
            <div style={{ fontSize: 10, color: s.inkTertiary, letterSpacing: 1, textTransform: 'uppercase' }}>
              {retakePhotos.length}/3
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
            marginBottom: 16,
          }}>
            {retakePhotos.map((photo, i) => (
              <div key={photo.id} style={{ position: 'relative', width: 72, height: 90 }}>
                <img src={photo.url} style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  border: `1px solid ${s.hairline}`,
                }} />
                <div
                  onClick={() => removeRetakePhoto(i)}
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
              </div>
            ))}
            {retakePhotos.length < 3 && (
              <div
                onClick={chooseRetakePhotos}
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
                <span style={{ fontSize: 10, color: s.inkTertiary }}>补传照片</span>
              </div>
            )}
          </div>

          <button
            onClick={submitRetakePhotos}
            disabled={isUploading}
            style={{
              width: '100%',
              height: 52,
              background: isUploading ? s.inkSecondary : s.ink,
              border: 'none',
              color: '#fff',
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: 3,
              cursor: isUploading ? 'not-allowed' : 'pointer',
              textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 8,
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: isUploading ? 'none' : '0 4px 14px rgba(26,26,26,0.12)',
            }}
            onMouseEnter={(e) => {
              if (!isUploading) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(26,26,26,0.18)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = isUploading ? 'none' : '0 4px 14px rgba(26,26,26,0.12)';
            }}
          >
            {isUploading ? (
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
            ) : '提交补拍照片'}
          </button>
        </div>
      )}

      {/* 订单信息 */}
      <div style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{
            fontFamily: s.serif,
            fontSize: 20,
            fontStyle: 'italic',
            fontWeight: 600,
          }}>订单信息</div>
          <div style={{ fontSize: 9, color: s.inkTertiary, letterSpacing: 2, textTransform: 'uppercase' }}>Details</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            { label: '订单号', value: order.orderId },
            { label: '套餐', value: order.productName },
            { label: '风格', value: order.styleName },
            { label: '照片审核', value: photoCheckInfo, emphasize: order.photo_check === 'need_retake' },
            { label: '参考照片', value: `${order.reference_photo_count} 张` },
            { label: '交付数量', value: `${order.delivery_file_count} 张` },
            { label: '价格', value: order.price },
          ].map((row, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              padding: '14px 0',
              borderBottom: i < 6 ? `1px solid ${s.divider}` : 'none',
              gap: 16,
            }}>
              <span style={{
                flexShrink: 0,
                fontSize: 12,
                color: s.inkTertiary,
                letterSpacing: 0.5,
              }}>{row.label}</span>
              <span style={{
                fontSize: row.label === '价格' ? 18 : 13,
                color: row.emphasize ? s.warning : s.ink,
                textAlign: 'right',
                fontFamily: row.label === '价格' ? s.serif : s.body,
                fontStyle: row.label === '价格' ? 'italic' : 'normal',
                fontWeight: row.label === '价格' ? 600 : 400,
                wordBreak: 'break-all',
              }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* 审核意见 */}
        {order.reviewNote && (
          <div style={{
            marginTop: 16,
            padding: '14px 16px',
            background: s.warningSoft,
            borderLeft: `2px solid ${s.warning}`,
          }}>
            <div style={{ fontSize: 11, color: s.warning, marginBottom: 4, letterSpacing: 0.5 }}>审核意见</div>
            <div style={{ fontSize: 13, color: s.inkSecondary, lineHeight: 1.7 }}>{order.reviewNote}</div>
          </div>
        )}
      </div>

      {/* 发丝线分隔 */}
      <div style={{ height: 1, background: s.hairline, opacity: 0.4, margin: '0 28px' }} />

      {/* 参考照片 */}
      <div style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{
            fontFamily: s.serif,
            fontSize: 18,
            fontStyle: 'italic',
            fontWeight: 600,
          }}>参考照片</div>
          <div style={{ fontSize: 9, color: s.inkTertiary, letterSpacing: 2, textTransform: 'uppercase' }}>
            {customerFiles.length} Photos
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {customerFiles.map((f, i) => (
            <div key={f.fileId || i} style={{
              width: 72, height: 90,
              overflow: 'hidden',
              border: `1px solid ${s.border}`,
              cursor: 'pointer',
            }}>
              <img src={f.fileID || f.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
          {customerFiles.length === 0 && (
            <div style={{ fontSize: 12, color: s.inkTertiary, padding: '8px 0' }}>暂无照片</div>
          )}
        </div>
      </div>

      {/* 发丝线分隔 */}
      <div style={{ height: 1, background: s.hairline, opacity: 0.4, margin: '0 28px' }} />

      {/* 交付图 */}
      <div style={{ padding: '24px 28px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{
            fontFamily: s.serif,
            fontSize: 20,
            fontStyle: 'italic',
            fontWeight: 600,
          }}>交付作品</div>
          <div style={{ fontSize: 9, color: s.inkTertiary, letterSpacing: 2, textTransform: 'uppercase' }}>
            Delivered
          </div>
        </div>

        {order.delivery_file_count === 0 ? (
          <div style={{
            padding: '48px 20px',
            textAlign: 'center',
            background: s.surfaceAlt,
            border: `1px solid ${s.border}`,
          }}>
            <div style={{
              width: 44, height: 44,
              margin: '0 auto 14px',
              borderRadius: '50%',
              border: `1px solid ${s.hairline}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={s.inkTertiary} strokeWidth="1">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4l3 2" />
              </svg>
            </div>
            <div style={{ fontFamily: s.serif, fontStyle: 'italic', fontSize: 15, color: s.inkSecondary, marginBottom: 4 }}>
              Not yet
            </div>
            <div style={{ fontSize: 11, color: s.inkTertiary, letterSpacing: 1 }}>
              制作完成后将在此处展示
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 12,
          }}>
            {(order.deliveryUrls && order.deliveryUrls.length > 0
              ? order.deliveryUrls
              : [IMG.idBlue]
            ).map((url, i) => (
              <div
                key={i}
                onClick={() => previewDelivery(url)}
                style={{
                  aspectRatio: '3/4',
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'pointer',
                  animation: 'fadeInUp 0.5s ease',
                  transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: '20px 16px 14px',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.55))',
                  color: '#fff',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
                }}>
                  <div>
                    <div style={{
                      fontFamily: s.display,
                      fontStyle: 'italic',
                      fontSize: 18,
                      marginBottom: 2,
                    }}>Final</div>
                    <div style={{ fontSize: 10, opacity: 0.8 }}>点击查看大图</div>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1">
                    <path d="M7 17L17 7M17 7H8M17 7v9" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 底部装饰 */}
      <div style={{
        textAlign: 'center',
        paddingBottom: 40,
        fontSize: 10,
        color: s.inkFaint,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        fontFamily: s.serif,
        fontStyle: 'italic',
      }}>
        — PhotoMuse —
      </div>

      {/* 图片预览层 */}
      {previewUrl && (
        <div
          onClick={closePreview}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.92)',
            zIndex: 100,
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
            onClick={closePreview}
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

Object.assign(window, { DetailPage });
