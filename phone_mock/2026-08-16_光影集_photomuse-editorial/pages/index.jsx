// ===== 页面一：Index 下单主页 =====
// 对齐契约区块树：page-nav / hero / 套餐 / 效果范例 / 拍照引导 / 风格 / 制作要求 / 上传 / 授权 / 提交 / 查询订单 / 我的订单 / 管理入口

function IndexPage(props) {
  const s = PM;
  const {
    form, setForm,
    orders, setOrders, ordersLoading,
    navigate, showToast,
  } = props;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exampleImgLoaded, setExampleImgLoaded] = useState(false);

  const currentProduct = PRODUCTS.find(p => p.productId === form.selectedProductId) || PRODUCTS[0];
  const currentExample = PRODUCT_EXAMPLES[form.selectedProductId] || PRODUCT_EXAMPLES.id_photo_9_9;
  const currentStyle = STYLES.find(st => st.styleId === form.selectedStyleId) || STYLES[0];

  // ---- 交互方法（对齐行为契约） ----
  const [hoverProduct, setHoverProduct] = useState(null);
  const [hoverStyle, setHoverStyle] = useState(null);

  const selectProduct = (productId) => {
    setForm(prev => ({
      ...prev,
      selectedProductId: productId,
      // 选简历形象照时强制风格为白底简约（ID-03）
      selectedStyleId: productId === 'resume_photo_29_9' ? 'ID-03' : prev.selectedStyleId,
    }));
    setExampleImgLoaded(false);
  };

  const selectStyle = (styleId) => {
    setForm(prev => ({ ...prev, selectedStyleId: styleId }));
  };

  const setPickerIndex = (field, index) => {
    setForm(prev => ({ ...prev, [field]: index }));
  };

  const setField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleAuth = (field) => {
    setForm(prev => ({
      ...prev,
      authorization: { ...prev.authorization, [field]: !prev.authorization[field] },
    }));
  };

  const toggleQueryPanel = () => {
    setForm(prev => ({ ...prev, showQueryPanel: !prev.showQueryPanel }));
  };

  const choosePhotos = () => {
    if (form.photos.length >= 3) {
      showToast('最多上传 3 张参考照片', 'error');
      return;
    }
    const remaining = 3 - form.photos.length;
    const candidates = [IMG.cinematic, IMG.portrait, IMG.magazine];
    const newPhotos = [];
    for (let i = 0; i < remaining; i++) {
      const idx = (form.photos.length + i) % candidates.length;
      newPhotos.push({
        id: Date.now() + i,
        tempFilePath: candidates[idx],
        url: candidates[idx],
        size: 1024000 + Math.floor(Math.random() * 500000),
      });
    }
    setForm(prev => ({ ...prev, photos: [...prev.photos, ...newPhotos] }));
    showToast('照片已添加', 'success');
  };

  const removePhoto = (index) => {
    setForm(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const allAuthChecked = form.authorization.isSelfOrAuthorized
    && form.authorization.isAdult
    && form.authorization.agreesProduction;

  const submitOrder = () => {
    // 校验（对齐契约 VALIDATION_ERROR / AUTHORIZATION_REQUIRED / PHOTO_REQUIRED）
    if (form.photos.length === 0) {
      showToast('请至少上传 1 张正脸照片', 'error');
      return;
    }
    if (!form.contactPhone || !/^1\d{10}$/.test(form.contactPhone.replace(/\s/g, ''))) {
      showToast('请填写正确的手机号', 'error');
      return;
    }
    if (!form.queryPassword || form.queryPassword.length < 6) {
      showToast('查询密码至少 6 位', 'error');
      return;
    }
    if (!allAuthChecked) {
      showToast('请先确认本人/成年人授权', 'error');
      return;
    }

    setIsSubmitting(true);
    // 模拟三阶段：create → upload → submit
    setTimeout(() => {
      const newOrder = {
        orderId: `AIStudio-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        productName: currentProduct.name,
        styleName: currentStyle.name,
        price: currentProduct.price,
        order_status: 'photo_review',
        photo_check: 'unchecked',
        reference_photo_count: form.photos.length,
        delivery_file_count: 0,
        reviewNote: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        customerUrls: form.photos.map(p => p.url),
        deliveryUrls: [],
        background: BACKGROUND_OPTIONS[form.backgroundIndex],
        clothing: CLOTHING_OPTIONS[form.clothingIndex],
        spec: SPEC_OPTIONS[form.specIndex],
      };
      // 插入到订单列表顶部
      setOrders(prev => [newOrder, ...prev]);
      // 清表单（对齐契约）
      setForm(prev => ({
        ...prev,
        photos: [],
        customerNote: '',
        contactPhone: '',
        queryPassword: '',
        authorization: { isSelfOrAuthorized: false, isAdult: false, agreesProduction: false },
      }));
      setIsSubmitting(false);
      showToast('订单提交成功', 'success');
      // 跳详情
      setTimeout(() => {
        props.setCurrentOrder(newOrder);
        props.setCurrentOrderFiles([
          ...form.photos.map((p, i) => ({ fileId: `cust-${i}`, fileType: 'customer_photo', fileID: p.url, fileName: `photo-${i + 1}.jpg`, size: p.size, status: 'uploaded' })),
        ]);
        navigate('detail');
      }, 400);
    }, 1400);
  };

  // 查询订单
  const queryOrder = () => {
    if (!form.queryOrderId || !form.queryContactPhone || !form.queryOrderPassword) {
      showToast('请填写完整查询信息', 'error');
      return;
    }
    // 模拟查询
    const found = orders.find(o => o.orderId === form.queryOrderId);
    if (!found) {
      showToast('订单不存在或信息不匹配', 'error');
      return;
    }
    props.setCurrentOrder(found);
    props.setQueryMode(true);
    navigate('detail');
  };

  const openOrder = (order) => {
    props.setCurrentOrder(order);
    props.setQueryMode(false);
    navigate('detail');
  };

  const openAdminLogin = () => {
    navigate('adminLogin');
  };

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
      background: s.pageBg,
      color: s.ink,
      position: 'relative',
    }}>

      {/* 页面导航 */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: `${s.pageBg}`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '52px 24px 14px',
        }}>
          <div style={{ width: 32, height: 32 }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: s.serif,
              fontStyle: 'italic',
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: 0.3,
              color: s.ink,
            }}>PhotoMuse</div>
          </div>
          <div
            onClick={openAdminLogin}
            style={{
              width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={s.ink} strokeWidth="1">
              <circle cx="12" cy="8" r="4" />
              <path d="M6 21v-2a6 6 0 0 1 12 0v2" />
            </svg>
          </div>
        </div>
        <div style={{ height: 1, background: s.hairline, opacity: 0.4 }} />
      </div>

      {/* HERO */}
      <div style={{
        position: 'relative',
        padding: '48px 28px 56px',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        <div style={{
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: 3,
          textTransform: 'uppercase',
          color: s.inkTertiary,
          marginBottom: 18,
        }}>Issue No.01 — Portrait Studio</div>

        <h1 style={{
          fontFamily: s.display,
          fontSize: 68,
          fontWeight: 400,
          lineHeight: 0.92,
          letterSpacing: -1,
          color: s.ink,
          marginBottom: 4,
        }}>光影</h1>
        <h1 style={{
          fontFamily: s.display,
          fontSize: 68,
          fontWeight: 400,
          fontStyle: 'italic',
          lineHeight: 0.92,
          letterSpacing: -1,
          color: s.ink,
        }}>集</h1>

        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 14,
          margin: '24px 0 20px',
        }}>
          <div style={{ width: 32, height: 1, background: s.ink }} />
          <div style={{
            fontFamily: s.serif,
            fontStyle: 'italic',
            fontSize: 13,
            color: s.inkSecondary,
          }}>Est. 2026</div>
          <div style={{ width: 32, height: 1, background: s.ink }} />
        </div>

        <p style={{
          fontSize: 13,
          color: s.inkSecondary,
          lineHeight: 1.85,
          maxWidth: 280,
          margin: '0 auto',
          letterSpacing: 0.2,
        }}>
          为每一张肖像注入杂志封面的质感。<br />
          AI 专业人像修图，三秒出片。
        </p>
      </div>

      {/* 发丝线分隔 + 编号装饰 */}
      <SectionHeader number="02" title="选择套餐" subtitle="Packages" />

      {/* 套餐列表 */}
      <div style={{ padding: '0 28px', display: 'flex', flexDirection: 'column' }}>
        {PRODUCTS.map((p, i) => (
          <div
            key={p.productId}
            onClick={() => selectProduct(p.productId)}
            onMouseEnter={() => setHoverProduct(p.productId)}
            onMouseLeave={() => setHoverProduct(null)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '22px 12px',
              margin: '0 -12px',
              borderTop: i === 0 ? `1px solid ${s.border}` : 'none',
              borderBottom: `1px solid ${s.border}`,
              cursor: 'pointer',
              position: 'relative',
              background: hoverProduct === p.productId ? s.surfaceAlt : 'transparent',
              transition: 'background 0.25s ease, padding 0.25s ease',
              borderRadius: hoverProduct === p.productId ? 8 : 0,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                {form.selectedProductId === p.productId ? (
                  <div style={{
                    width: 20, height: 20,
                    borderRadius: '50%',
                    background: s.ink,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'fadeIn 0.3s ease',
                  }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <div style={{
                    width: 20, height: 20,
                    borderRadius: '50%',
                    border: `1px solid ${hoverProduct === p.productId ? s.inkTertiary : s.inkFaint}`,
                    transition: 'border-color 0.25s ease',
                  }} />
                )}
                <span style={{
                  fontSize: 16,
                  color: s.ink,
                  fontWeight: form.selectedProductId === p.productId ? 600 : hoverProduct === p.productId ? 500 : 400,
                  letterSpacing: 0.2,
                  transition: 'font-weight 0.2s ease',
                }}>{p.name}</span>
              </div>
              <div style={{
                fontSize: 12,
                color: s.inkSecondary,
                marginLeft: 30,
                letterSpacing: 0.1,
                marginTop: 2,
              }}>{p.desc}</div>
            </div>
            <div style={{
              fontFamily: s.display,
              fontStyle: 'italic',
              fontSize: 24,
              color: s.ink,
              transform: hoverProduct === p.productId ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.25s ease',
            }}>{p.price}</div>
          </div>
        ))}
      </div>

      {/* 效果范例 */}
      <SectionHeader number="03" title="效果范例" subtitle="Preview" />

      <div style={{ padding: '0 28px 16px' }}>
        <div style={{
          fontSize: 10,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: s.inkTertiary,
          marginBottom: 6,
          textAlign: 'center',
        }}>{currentExample.subtitle}</div>
        <h3 style={{
          fontFamily: s.serif,
          fontSize: 20,
          fontStyle: 'italic',
          fontWeight: 600,
          textAlign: 'center',
          color: s.ink,
          marginBottom: 20,
        }}>Before & After</h3>

        {/* 对比展示 */}
        <div style={{
          display: 'flex',
          alignItems: 'stretch',
          gap: 0,
          marginBottom: 24,
          position: 'relative',
        }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ aspectRatio: '3/4', overflow: 'hidden', position: 'relative' }}>
              <img
                src={currentExample.beforeImage}
                onLoad={() => setExampleImgLoaded(true)}
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  filter: 'grayscale(20%) contrast(0.95)',
                  transition: 'opacity 0.5s ease',
                  opacity: exampleImgLoaded ? 1 : 0,
                }}
              />
              <div style={{
                position: 'absolute', top: 12, left: 12,
                fontSize: 9,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.85)',
                background: 'rgba(0,0,0,0.2)',
                padding: '3px 8px',
                backdropFilter: 'blur(4px)',
              }}>Before</div>
            </div>
          </div>
          <div style={{
            width: 1,
            background: s.surface,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
            zIndex: 2,
          }}>
            <div style={{
              width: 28, height: 28,
              borderRadius: '50%',
              background: s.surface,
              border: `1px solid ${s.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'absolute',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={s.ink} strokeWidth="1.5">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ aspectRatio: '3/4', overflow: 'hidden', position: 'relative' }}>
              <img
                src={currentExample.afterImage}
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  transition: 'opacity 0.5s ease',
                  opacity: exampleImgLoaded ? 1 : 0,
                }}
              />
              <div style={{
                position: 'absolute', top: 12, right: 12,
                fontSize: 9,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.9)',
                background: 'rgba(0,0,0,0.25)',
                padding: '3px 8px',
                backdropFilter: 'blur(4px)',
              }}>After</div>
            </div>
          </div>
        </div>

        {/* 功能点 */}
        <div style={{
          padding: '4px 0 0',
        }}>
          {currentExample.features.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start',
              padding: '10px 0',
              borderBottom: i < currentExample.features.length - 1 ? `1px solid ${s.divider}` : 'none',
            }}>
              <div style={{
                width: 4, height: 4,
                borderRadius: '50%',
                background: s.accent,
                marginTop: 7,
                marginRight: 12,
                flexShrink: 0,
              }} />
              <span style={{ fontSize: 13, color: s.inkSecondary, lineHeight: 1.6 }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 拍照引导 */}
      <SectionHeader number="04" title="拍照引导" subtitle="Tips" />

      <div style={{ padding: '0 28px 28px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {currentExample.tips.map((tip, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 16,
              padding: '14px 0',
              borderBottom: i < currentExample.tips.length - 1 ? `1px solid ${s.divider}` : 'none',
            }}>
              <div style={{
                width: 24, height: 24,
                borderRadius: '50%',
                border: `1px solid ${s.hairline}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: s.display,
                fontStyle: 'italic',
                fontSize: 13,
                color: s.ink,
                flexShrink: 0,
              }}>{i + 1}</div>
              <div style={{ fontSize: 13, color: s.inkSecondary, lineHeight: 1.7, paddingTop: 3 }}>
                {tip}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 选择风格 */}
      <SectionHeader number="05" title="选择风格" subtitle="Styles" />

      <div style={{
        padding: '0 28px 28px',
        display: 'flex',
        gap: 0,
        borderBottom: `1px solid ${s.border}`,
      }}>
        {STYLES.map((st, i) => (
          <div
            key={st.styleId}
            onClick={() => selectStyle(st.styleId)}
            onMouseEnter={() => setHoverStyle(st.styleId)}
            onMouseLeave={() => setHoverStyle(null)}
            style={{
              flex: 1,
              padding: '16px 0 18px',
              textAlign: 'center',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.25s ease',
              background: hoverStyle === st.styleId && form.selectedStyleId !== st.styleId ? s.surfaceAlt : 'transparent',
            }}
          >
            <div style={{
              fontSize: 13,
              color: form.selectedStyleId === st.styleId ? s.ink : (hoverStyle === st.styleId ? s.inkSecondary : s.inkTertiary),
              fontWeight: form.selectedStyleId === st.styleId ? 600 : (hoverStyle === st.styleId ? 500 : 400),
              marginBottom: 3,
              letterSpacing: 0.2,
              transition: 'all 0.2s ease',
              transform: form.selectedStyleId === st.styleId ? 'translateY(-1px)' : 'translateY(0)',
            }}>{st.name}</div>
            <div style={{
              fontSize: 9,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              color: form.selectedStyleId === st.styleId ? s.inkSecondary : s.inkFaint,
              transition: 'color 0.2s ease',
            }}>{st.subtitle}</div>
            {form.selectedStyleId === st.styleId && (
              <div style={{
                position: 'absolute', bottom: -1, left: 0, right: 0,
                height: 1.5, background: s.ink,
                animation: 'fadeIn 0.3s ease',
              }} />
            )}
          </div>
        ))}
      </div>

      {/* 制作要求 */}
      <SectionHeader number="06" title="制作要求" subtitle="Specifications" />

      <div style={{ padding: '0 28px 8px', display: 'flex', flexDirection: 'column' }}>
        {/* 三个 picker 行 */}
        {[
          { label: '用途规格', value: SPEC_OPTIONS[form.specIndex], field: 'specIndex', options: SPEC_OPTIONS, onSelect: (idx) => setPickerIndex('specIndex', idx) },
          { label: '底色', value: BACKGROUND_OPTIONS[form.backgroundIndex], field: 'backgroundIndex', options: BACKGROUND_OPTIONS, onSelect: (idx) => setPickerIndex('backgroundIndex', idx) },
          { label: '服装', value: CLOTHING_OPTIONS[form.clothingIndex], field: 'clothingIndex', options: CLOTHING_OPTIONS, onSelect: (idx) => setPickerIndex('clothingIndex', idx) },
        ].map((row, i) => (
          <PickerRow key={i} label={row.label} value={row.value} options={row.options} onSelect={row.onSelect} />
        ))}

        {/* 手机号 & 查询密码 */}
        <TextInput label="手机号" type="tel" value={form.contactPhone} onChange={(v) => setField('contactPhone', v)} placeholder="请输入手机号" />
        <TextInput label="查询密码" type="password" value={form.queryPassword} onChange={(v) => setField('queryPassword', v)} placeholder="至少 6 位" />

        {/* 备注 */}
        <div style={{ padding: '16px 0', borderBottom: `1px solid ${s.border}` }}>
          <div style={{
            fontSize: 11,
            letterSpacing: 1,
            textTransform: 'uppercase',
            color: s.inkTertiary,
            marginBottom: 8,
          }}>补充要求</div>
          <textarea
            value={form.customerNote}
            onChange={(e) => setField('customerNote', e.target.value)}
            placeholder="可选，最多 300 字"
            maxLength={300}
            style={{
              width: '100%',
              minHeight: 76,
              padding: '4px 0',
              background: 'transparent',
              border: 'none',
              fontSize: 14,
              color: s.ink,
              outline: 'none',
              resize: 'none',
              fontFamily: s.body,
              lineHeight: 1.65,
            }}
          />
          <div style={{
            fontSize: 10,
            color: s.inkTertiary,
            textAlign: 'right',
            marginTop: 4,
            letterSpacing: 0.5,
          }}>{form.customerNote.length}/300</div>
        </div>

        <div style={{
          fontSize: 11,
          color: s.inkTertiary,
          lineHeight: 1.7,
          padding: '12px 0',
          letterSpacing: 0.1,
        }}>
          我们承诺不会将您的照片用于任何其他用途。制作完成后原图将在 7 天内自动删除。
        </div>
      </div>

      {/* 上传照片 */}
      <SectionHeader number="07" title="上传正脸照" subtitle="Upload" />

      <div style={{ padding: '0 28px 28px' }}>
        <div style={{
          display: 'flex',
          gap: 14,
          alignItems: 'flex-start',
          padding: '24px 20px',
          background: s.surfaceAlt,
          border: `1px solid ${s.border}`,
          marginBottom: 12,
          transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
          position: 'relative',
        }}>
          {form.photos.map((photo, index) => (
            <div key={photo.id} style={{
              width: 64, height: 80,
              position: 'relative',
              animation: 'fadeInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
              transition: 'transform 0.3s ease',
            }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
               onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <img src={photo.url} style={{
                width: '100%', height: '100%', objectFit: 'cover',
                border: `1px solid ${s.hairline}`,
              }} />
              <div
                onClick={(e) => { e.stopPropagation(); removePhoto(index); }}
                style={{
                  position: 'absolute', top: -7, right: -7,
                  width: 22, height: 22,
                  borderRadius: '50%',
                  background: s.ink,
                  color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 300,
                  transition: 'transform 0.2s ease, background 0.2s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.15)'; e.currentTarget.style.background = s.error; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = s.ink; }}
              >×</div>
              <div style={{
                position: 'absolute', bottom: -2, left: 0, right: 0,
                textAlign: 'center',
                fontSize: 9,
                color: s.inkTertiary,
              }}>{(photo.size / 1024 / 1024).toFixed(1)}MB</div>
            </div>
          ))}
          {form.photos.length < 3 && (
            <div
              onClick={choosePhotos}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = s.inkSecondary;
                e.currentTarget.style.background = s.surface;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = s.inkFaint;
                e.currentTarget.style.background = 'transparent';
              }}
              style={{
                width: 64, height: 80,
                border: `1px dashed ${s.inkFaint}`,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 5,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                background: 'transparent',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={s.inkSecondary} strokeWidth="1">
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span style={{ fontSize: 10, color: s.inkSecondary }}>添加照片</span>
            </div>
          )}
        </div>
        <div style={{ fontSize: 11, color: s.inkTertiary, lineHeight: 1.6, textAlign: 'center' }}>
          支持 JPG / PNG 格式，单张不超过 10MB，最多 3 张
        </div>
      </div>

      {/* 授权确认 */}
      <SectionHeader number="08" title="授权确认" subtitle="Authorization" />

      <div style={{
        padding: '0 28px 28px',
        borderBottom: `1px solid ${s.border}`,
      }}>
        {AUTHORIZATION_TEXT.map((item, i) => (
          <div
            key={item.field}
            onClick={() => toggleAuth(item.field)}
            style={{
              display: 'flex', alignItems: 'center',
              padding: '18px 0',
              borderBottom: i < AUTHORIZATION_TEXT.length - 1 ? `1px solid ${s.divider}` : 'none',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
          >
            <div style={{
              width: 22, height: 22,
              border: `1.5px solid ${form.authorization[item.field] ? s.ink : s.hairline}`,
              background: form.authorization[item.field] ? s.ink : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginRight: 14,
              flexShrink: 0,
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: form.authorization[item.field] ? 'scale(1)' : 'scale(0.98)',
            }}>
              {form.authorization[item.field] && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" style={{ animation: 'fadeInUp 0.25s ease' }}>
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span style={{ fontSize: 13, color: s.ink, lineHeight: 1.4, letterSpacing: 0.1 }}>{item.text}</span>
          </div>
        ))}
      </div>

      {/* 提交按钮 */}
      <div style={{ padding: '32px 28px 12px' }}>
        <button
          onClick={submitOrder}
          disabled={isSubmitting}
          style={{
            width: '100%',
            height: 58,
            background: isSubmitting ? s.inkSecondary : s.ink,
            border: 'none',
            color: '#fff',
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: 3,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 10,
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: isSubmitting ? 'none' : '0 4px 16px rgba(26,26,26,0.12)',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(26,26,26,0.18)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = isSubmitting ? 'none' : '0 4px 16px rgba(26,26,26,0.12)';
          }}
          onMouseDown={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(26,26,26,0.15)';
            }
          }}
        >
          {isSubmitting ? (
            <>
              <div style={{
                width: 14, height: 14,
                border: '1.5px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff',
                borderRadius: '50%',
                animation: 'spin-slow 0.8s linear infinite',
              }} />
              SUBMITTING
            </>
          ) : (
            <>
              提交订单
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </>
          )}
        </button>
      </div>

      {/* 查询订单 */}
      <div style={{ padding: '8px 28px 0' }}>
        <div
          onClick={toggleQueryPanel}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 0',
            borderTop: `1px solid ${s.border}`,
            cursor: 'pointer',
          }}
        >
          <div>
            <div style={{ fontSize: 13, color: s.ink, fontWeight: 500 }}>查询已有订单</div>
            <div style={{ fontSize: 11, color: s.inkTertiary, marginTop: 2 }}>
              凭订单号 + 手机号 + 密码查询
            </div>
          </div>
          <svg
            width="16" height="16"
            viewBox="0 0 24 24" fill="none" stroke={s.inkTertiary} strokeWidth="1"
            style={{
              transform: form.showQueryPanel ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>

        {form.showQueryPanel && (
          <div style={{
            animation: 'slideUp 0.3s ease',
            padding: '4px 0 20px',
            display: 'flex', flexDirection: 'column',
          }}>
            <TextInputSimple
              placeholder="订单号"
              value={form.queryOrderId}
              onChange={(v) => setField('queryOrderId', v)}
            />
            <TextInputSimple
              placeholder="下单手机号"
              value={form.queryContactPhone}
              onChange={(v) => setField('queryContactPhone', v)}
              type="tel"
            />
            <TextInputSimple
              placeholder="查询密码"
              value={form.queryOrderPassword}
              onChange={(v) => setField('queryOrderPassword', v)}
              type="password"
            />
            <button
              onClick={queryOrder}
              style={{
                marginTop: 16,
                height: 48,
                background: 'transparent',
                border: `1px solid ${s.ink}`,
                color: s.ink,
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: 2,
                cursor: 'pointer',
                textTransform: 'uppercase',
                borderRadius: 0,
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = s.ink;
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = s.ink;
              }}
            >
              查询订单
            </button>
          </div>
        )}
      </div>

      {/* 我的订单 */}
      <div style={{
        padding: '24px 28px',
        borderTop: `4px solid ${s.surfaceAlt}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{
            fontFamily: s.serif,
            fontSize: 22,
            fontStyle: 'italic',
            fontWeight: 600,
            color: s.ink,
          }}>我的订单</div>
          <div style={{
            fontSize: 9,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: s.inkTertiary,
          }}>My Orders</div>
        </div>

        {ordersLoading ? (
          <div style={{
            padding: '40px 0',
            textAlign: 'center',
            fontSize: 12,
            color: s.inkTertiary,
            letterSpacing: 1,
          }}>
            加载中...
          </div>
        ) : orders.length === 0 ? (
          <div style={{
            padding: '48px 0',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: s.display,
              fontStyle: 'italic',
              fontSize: 16,
              color: s.inkTertiary,
              marginBottom: 6,
            }}>暂无订单</div>
            <div style={{ fontSize: 11, color: s.inkFaint }}>上传第一张照片，开启制作</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {orders.map((order, idx) => (
              <div
                key={order.orderId}
                onClick={() => openOrder(order)}
                style={{
                  padding: '18px 12px',
                  margin: '0 -12px',
                  borderTop: idx === 0 ? 'none' : `1px solid ${s.divider}`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  borderRadius: 8,
                  background: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = s.surfaceAlt;
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* 缩略图 */}
                <div style={{
                  width: 48, height: 60,
                  flexShrink: 0,
                  overflow: 'hidden',
                  border: `1px solid ${s.border}`,
                }}>
                  {order.deliveryUrls.length > 0 ? (
                    <img src={order.deliveryUrls[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : order.customerUrls?.length > 0 ? (
                    <img src={order.customerUrls[0]} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(30%)' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: s.surfaceAlt }} />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: s.ink,
                    marginBottom: 3,
                  }}>{order.productName} · {order.styleName}</div>
                  <div style={{
                    fontSize: 10,
                    color: s.inkTertiary,
                    fontFamily: s.mono,
                    marginBottom: 5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>{order.orderId}</div>
                  {order.reviewNote && (
                    <div style={{
                      fontSize: 11,
                      color: s.warning,
                      background: s.warningSoft,
                      padding: '3px 8px',
                      display: 'inline-block',
                    }}>
                      审核意见：{order.reviewNote.slice(0, 20)}
                    </div>
                  )}
                </div>

                <div style={{
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: 6,
                }}>
                  <StatusBadge status={order.order_status} />
                  <div style={{
                    fontFamily: s.display,
                    fontStyle: 'italic',
                    fontSize: 14,
                    color: s.ink,
                  }}>{order.price}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 底部装饰文字 */}
      <div style={{
        textAlign: 'center',
        padding: '16px 28px 36px',
        fontSize: 10,
        color: s.inkFaint,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        fontFamily: s.serif,
        fontStyle: 'italic',
      }}>
        — PhotoMuse Studio · Since 2026 —
      </div>
    </div>
  );
}

// ===== 子组件 =====

// 章节标题
function SectionHeader({ number, title, subtitle }) {
  const s = PM;
  return (
    <div style={{
      padding: '32px 28px 18px',
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 14,
      }}>
        <span style={{
          fontFamily: s.display,
          fontStyle: 'italic',
          fontSize: 12,
          color: s.accent,
          letterSpacing: 1,
          fontWeight: 600,
        }}>№ {number}</span>
        <span style={{
          fontFamily: s.serif,
          fontSize: 24,
          fontStyle: 'italic',
          fontWeight: 600,
          color: s.ink,
          letterSpacing: 0.2,
        }}>{title}</span>
      </div>
      <span style={{
        fontSize: 10,
        letterSpacing: 2,
        textTransform: 'uppercase',
        color: s.inkTertiary,
        fontWeight: 500,
      }}>{subtitle}</span>
    </div>
  );
}

// 文本输入行（带下划线样式）
function TextInput({ label, value, onChange, type = 'text', placeholder }) {
  const s = PM;
  const [focused, setFocused] = useState(false);
  return (
    <div style={{
      padding: '14px 0',
      borderBottom: `1px solid ${focused ? s.ink : s.border}`,
      display: 'flex',
      alignItems: 'center',
      transition: 'border-color 0.25s ease',
    }}>
      <div style={{
        flex: '0 0 84px',
        fontSize: 11,
        letterSpacing: 1,
        textTransform: 'uppercase',
        color: focused ? s.ink : s.inkTertiary,
        fontWeight: focused ? 600 : 500,
        transition: 'all 0.2s ease',
      }}>{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{
          flex: 1,
          height: 28,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          fontSize: 14,
          color: s.ink,
          fontFamily: s.body,
          textAlign: 'right',
          letterSpacing: 0.2,
        }}
      />
    </div>
  );
}

// 简单文本输入框
function TextInputSimple({ value, onChange, type = 'text', placeholder }) {
  const s = PM;
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholder={placeholder}
      style={{
        height: 46,
        padding: '0 0',
        background: 'transparent',
        border: 'none',
        borderBottom: `1px solid ${focused ? s.ink : s.border}`,
        fontSize: 14,
        color: s.ink,
        outline: 'none',
        fontFamily: s.body,
        width: '100%',
        transition: 'border-color 0.25s ease',
      }}
    />
  );
}

// Picker 行（模拟选择器展开）
function PickerRow({ label, value, options, onSelect }) {
  const s = PM;
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${s.border}` }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px 0',
          cursor: 'pointer',
        }}
      >
        <div style={{
          flex: '0 0 84px',
          fontSize: 11,
          letterSpacing: 1,
          textTransform: 'uppercase',
          color: s.inkTertiary,
        }}>{label}</div>
        <div style={{ flex: 1, textAlign: 'right', fontSize: 14, color: s.ink }}>{value}</div>
        <svg
          width="14" height="14"
          viewBox="0 0 24 24" fill="none" stroke={s.inkTertiary} strokeWidth="1"
          style={{
            marginLeft: 10,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
      {open && (
        <div style={{
          animation: 'fadeIn 0.2s ease',
          padding: '0 0 16px 84px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
        }}>
          {options.map((opt, i) => (
            <div
              key={i}
              onClick={() => { onSelect(i); setOpen(false); }}
              style={{
                padding: '5px 12px',
                fontSize: 12,
                border: `1px solid ${value === opt ? s.ink : s.border}`,
                background: value === opt ? s.ink : 'transparent',
                color: value === opt ? '#fff' : s.inkSecondary,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 状态胶囊
function StatusBadge({ status }) {
  const s = PM;
  const map = {
    waiting_photos: { label: '待上传', color: s.inkTertiary, bg: s.surfaceAlt },
    photo_review: { label: '审核中', color: s.warning, bg: s.warningSoft },
    queued: { label: '队列中', color: s.info, bg: s.infoSoft },
    generating: { label: '生成中', color: s.info, bg: s.infoSoft },
    qc: { label: '质检中', color: s.info, bg: s.infoSoft },
    delivered: { label: '已交付', color: s.success, bg: s.successSoft },
    cancelled: { label: '已取消', color: s.error, bg: s.errorSoft },
  };
  const info = map[status] || map.photo_review;
  return (
    <span style={{
      fontSize: 10,
      fontWeight: 500,
      letterSpacing: 0.5,
      padding: '3px 8px',
      background: info.bg,
      color: info.color,
    }}>{info.label}</span>
  );
}

// 暴露
Object.assign(window, {
  IndexPage,
  SectionHeader,
  TextInput,
  TextInputSimple,
  PickerRow,
  StatusBadge,
});
