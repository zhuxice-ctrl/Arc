/* ============================================================
   Volunteer - 志愿者招募
   特色：
   - 左右分栏：左侧招募介绍 + 右侧报名表单
   - 表单输入有底部线条展开动效 + 聚焦发光
   - 表单提交模拟（带加载态 + 成功涟漪）
   - 数字滚动：今年已招募 XXX 人
   ============================================================ */

function Volunteer() {
  const sectionRef = React.useRef(null);
  const [form, setForm] = React.useState({ name: '', email: '', role: 'field', city: '', message: '' });
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const countRef = React.useRef(null);

  const roles = [
    { id: 'field', name: '野外观测员', desc: '驻守观测站，记录候鸟种类与数量' },
    { id: 'data', name: '数据整理', desc: '整理观测数据，参与物种识别复核' },
    { id: 'edu', name: '科普志愿者', desc: '面向公众开展候鸟保护科普活动' },
    { id: 'tech', name: '技术支持', desc: '开发与维护观测平台与识别系统' },
  ];

  // 计数动画
  React.useEffect(() => {
    const el = countRef.current;
    if (!el) return;
    const target = 342;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          if (prefersReduced) {
            el.textContent = target;
            return;
          }
          let start = null;
          const duration = 1800;
          function step(t) {
            if (!start) start = t;
            const p = Math.min((t - start) / duration, 1);
            const eased = Ease.outExpo(p);
            el.textContent = Math.floor(target * eased);
            if (p < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 滚动渐入
  React.useEffect(() => {
    if (!sectionRef.current) return;
    sectionRef.current.querySelectorAll('.reveal').forEach((el) => {
      RevealManager.observe(el);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role) => {
    setForm((prev) => ({ ...prev, role }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting || submitted) return;
    setSubmitting(true);
    // 模拟提交
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1800);
  };

  const resetForm = () => {
    setSubmitted(false);
    setForm({ name: '', email: '', role: 'field', city: '', message: '' });
  };

  return React.createElement('section', {
    ref: sectionRef,
    className: 'volunteer section',
    id: 'volunteer',
  },
    React.createElement('div', { className: 'container' },
      React.createElement('div', { className: 'volunteer__grid' },
        // 左侧介绍
        React.createElement('div', { className: 'volunteer__intro reveal' },
          React.createElement(SectionIndex, { num: '05', total: '05', label: 'JOIN US' }),
          React.createElement('h2', { className: 'display-2 volunteer__title' },
            '加入我们，',
            React.createElement('br', null),
            '做一只 ',
            React.createElement('em', null, '候鸟的守护者')
          ),
          React.createElement('p', { className: 'volunteer__desc body-lg' },
            '我们的每一个观测站、每一条数据、每一次保护行动，都离不开志愿者的参与。',
            '无论你是鸟类爱好者、数据专家，还是只是想为候鸟出一份力——',
            '在这里都能找到属于你的位置。'
          ),

          React.createElement('div', { className: 'volunteer__stats' },
            React.createElement('div', { className: 'volunteer__stat' },
              React.createElement('div', { className: 'volunteer__stat-num display-1' },
                React.createElement('span', { ref: countRef }, '0'),
                React.createElement('span', { className: 'text-sunset' }, '+')
              ),
              React.createElement('div', { className: 'volunteer__stat-label' },
                React.createElement('span', null, '今年已有志愿者加入'),
                React.createElement('span', { className: 'mono volunteer__stat-sub' }, 'VOLUNTEERS IN 2026')
              )
            )
          ),

          React.createElement('div', { className: 'volunteer__benefits' },
            React.createElement('h4', null, '你将获得'),
            React.createElement('ul', null,
              ['专业鸟类识别培训', '野外观测装备使用', '志愿者证书与纪念徽章', '年度迁徙观测报告', '全国观测站互通网络'].map((b) =>
                React.createElement('li', { key: b },
                  React.createElement('span', { className: 'check-icon' },
                    React.createElement('svg', { viewBox: '0 0 16 16', fill: 'none' },
                      React.createElement('path', { d: 'M3 8.5 L 6.5 12 L 13 4.5', stroke: 'currentColor', strokeWidth: '1.5', strokeLinecap: 'round', strokeLinejoin: 'round' })
                    )
                  ),
                  b
                )
              )
            )
          )
        ),

        // 右侧表单
        React.createElement('div', { className: 'volunteer__form-wrap reveal' },
          submitted
            ? React.createElement('div', { className: 'form-success' },
                React.createElement('div', { className: 'form-success__icon' },
                  React.createElement('svg', { viewBox: '0 0 64 64', fill: 'none' },
                    React.createElement('circle', { cx: '32', cy: '32', r: '30', stroke: '#E4572E', strokeWidth: '1.5' }),
                    React.createElement('path', { d: 'M 20 33 L 29 42 L 45 24', stroke: '#E4572E', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round' })
                  )
                ),
                React.createElement('h3', null, '感谢你的申请！'),
                React.createElement('p', null,
                  '我们已收到你的志愿者申请，工作人员将在 3 个工作日内与你联系。',
                  React.createElement('br', null),
                  '愿你与候鸟的故事，从这里开始。'
                ),
                React.createElement('button', {
                  className: 'btn',
                  onClick: resetForm,
                  'data-cursor-hover': true,
                }, '再提交一份')
              )
            : React.createElement('form', { className: 'volunteer__form', onSubmit: handleSubmit },
                React.createElement('div', { className: 'form__header' },
                  React.createElement('span', { className: 'eyebrow' }, 'VOLUNTEER APPLICATION'),
                  React.createElement('h3', null, '志愿者申请表')
                ),

                React.createElement('div', { className: 'form__row form__row--2' },
                  React.createElement('div', { className: 'form__field' },
                    React.createElement('label', { htmlFor: 'name', className: 'form__label' }, '姓名'),
                    React.createElement('input', {
                      type: 'text', id: 'name', name: 'name',
                      value: form.name, onChange: handleChange, required: true,
                      className: 'form__input', 'data-cursor-hover': true,
                    }),
                    React.createElement('span', { className: 'form__line' })
                  ),
                  React.createElement('div', { className: 'form__field' },
                    React.createElement('label', { htmlFor: 'city', className: 'form__label' }, '所在城市'),
                    React.createElement('input', {
                      type: 'text', id: 'city', name: 'city',
                      value: form.city, onChange: handleChange,
                      className: 'form__input', 'data-cursor-hover': true,
                    }),
                    React.createElement('span', { className: 'form__line' })
                  )
                ),

                React.createElement('div', { className: 'form__field' },
                  React.createElement('label', { htmlFor: 'email', className: 'form__label' }, '邮箱'),
                  React.createElement('input', {
                    type: 'email', id: 'email', name: 'email',
                    value: form.email, onChange: handleChange, required: true,
                    className: 'form__input', 'data-cursor-hover': true,
                  }),
                  React.createElement('span', { className: 'form__line' })
                ),

                React.createElement('div', { className: 'form__field' },
                  React.createElement('label', { className: 'form__label' }, '志愿方向'),
                  React.createElement('div', { className: 'form__roles' },
                    roles.map((r) =>
                      React.createElement('button', {
                        key: r.id,
                        type: 'button',
                        className: `role-btn ${form.role === r.id ? 'is-active' : ''}`,
                        onClick: () => handleRoleChange(r.id),
                        'data-cursor-hover': true,
                      },
                        React.createElement('span', { className: 'role-btn__name' }, r.name),
                        React.createElement('span', { className: 'role-btn__desc' }, r.desc)
                      )
                    )
                  )
                ),

                React.createElement('div', { className: 'form__field' },
                  React.createElement('label', { htmlFor: 'message', className: 'form__label' }, '想说的话（选填）'),
                  React.createElement('textarea', {
                    id: 'message', name: 'message', rows: '3',
                    value: form.message, onChange: handleChange,
                    className: 'form__input form__input--textarea',
                    'data-cursor-hover': true,
                  }),
                  React.createElement('span', { className: 'form__line' })
                ),

                React.createElement('button', {
                  type: 'submit',
                  className: 'btn btn--fill form__submit shimmer',
                  disabled: submitting,
                  'data-cursor-hover': true,
                  'data-cursor-label': submitting ? '提交中…' : '提交申请',
                },
                  submitting
                    ? React.createElement(React.Fragment, null,
                        React.createElement('span', { className: 'btn-spinner' }),
                        '正在提交…'
                      )
                    : React.createElement(React.Fragment, null,
                        '提交申请',
                        React.createElement('span', { className: 'btn__arrow' }, '→')
                      )
                )
              )
        )
      )
    )
  );
}

const volunteerStyles = `
.volunteer {
  background: var(--color-eggshell-2);
  position: relative;
  overflow: hidden;
}
.volunteer::before {
  content: '';
  position: absolute;
  top: -200px; right: -200px;
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(228, 87, 46, 0.06) 0%, transparent 60%);
  pointer-events: none;
}
.volunteer__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: start;
}
.volunteer__intro {
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: sticky;
  top: 120px;
}
.volunteer__title em {
  font-style: italic;
  color: var(--color-sunset);
}
.volunteer__desc {
  color: var(--color-ink-soft);
  white-space: pre-line;
}
.volunteer__stats {
  padding: 24px 0;
  border-top: 1px solid var(--color-feather-light);
  border-bottom: 1px solid var(--color-feather-light);
}
.volunteer__stat {
  display: flex;
  align-items: baseline;
  gap: 20px;
}
.volunteer__stat-num {
  font-weight: 300;
  font-size: clamp(3rem, 6vw, 5rem);
  font-variation-settings: 'opsz' 60;
  line-height: 0.9;
}
.volunteer__stat-label {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.95rem;
  color: var(--color-ink);
}
.volunteer__stat-sub {
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  color: var(--color-feather-dark);
}
.volunteer__benefits h4 {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--color-ink);
}
.volunteer__benefits ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.volunteer__benefits li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: var(--color-ink-soft);
}
.check-icon {
  width: 18px; height: 18px;
  display: flex; align-items: center; justify-content: center;
  color: var(--color-sunset);
  flex-shrink: 0;
}
.check-icon svg { width: 14px; height: 14px; }

/* 表单 */
.volunteer__form-wrap {
  background: var(--color-eggshell);
  border: 1px solid var(--color-feather-light);
  padding: 40px;
}
.form__header {
  margin-bottom: 28px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form__header h3 {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 500;
  font-variation-settings: 'opsz' 28;
  color: var(--color-ink);
}
.form__row {
  display: flex;
  gap: 20px;
}
.form__row--2 > * { flex: 1; }
.form__field {
  position: relative;
  margin-bottom: 24px;
}
.form__label {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-feather-dark);
  margin-bottom: 6px;
  letter-spacing: 0.05em;
}
.form__input {
  width: 100%;
  border: none;
  border-bottom: 1px solid var(--color-feather-light);
  background: transparent;
  padding: 8px 0;
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--color-ink);
  transition: border-color 0.3s;
}
.form__input:focus {
  outline: none;
}
.form__input--textarea {
  resize: vertical;
  min-height: 60px;
}
.form__line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1.5px;
  background: var(--color-sunset);
  transition: width 0.4s var(--ease-out);
}
.form__input:focus + .form__line {
  width: 100%;
}

/* 角色选择 */
.form__roles {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 8px;
}
.role-btn {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px;
  border: 1px solid var(--color-feather-light);
  background: var(--color-eggshell);
  text-align: left;
  transition: all 0.3s var(--ease-out);
  position: relative;
  overflow: hidden;
}
.role-btn::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 3px; height: 100%;
  background: var(--color-sunset);
  transform: scaleY(0);
  transition: transform 0.3s var(--ease-out);
}
.role-btn:hover {
  border-color: var(--color-feather-mid);
  transform: translateY(-2px);
}
.role-btn.is-active {
  border-color: var(--color-ink);
  background: var(--color-eggshell-2);
}
.role-btn.is-active::before {
  transform: scaleY(1);
}
.role-btn__name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-ink);
}
.role-btn__desc {
  font-size: 0.75rem;
  color: var(--color-feather-dark);
  line-height: 1.4;
}

.form__submit {
  width: 100%;
  justify-content: center;
  margin-top: 8px;
  padding: 16px 24px;
  font-size: 0.8rem;
}
.form__submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid var(--color-eggshell);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 成功态 */
.form-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  padding: 40px 20px;
}
.form-success__icon {
  width: 80px; height: 80px;
  margin-bottom: 8px;
  animation: success-pop 0.6s var(--ease-spring);
}
.form-success__icon svg { width: 100%; height: 100%; }
@keyframes success-pop {
  0% { transform: scale(0); opacity: 0; }
  70% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}
.form-success h3 {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 500;
  color: var(--color-ink);
}
.form-success p {
  color: var(--color-feather-dark);
  line-height: 1.7;
  font-size: 0.9rem;
  max-width: 360px;
}

@media (max-width: 900px) {
  .volunteer__grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .volunteer__intro {
    position: static;
  }
  .volunteer__form-wrap {
    padding: 28px;
  }
  .form__roles {
    grid-template-columns: 1fr;
  }
  .form__row--2 {
    flex-direction: column;
    gap: 0;
  }
}
`;

(function injectVolunteerStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('volunteer-styles')) return;
  const style = document.createElement('style');
  style.id = 'volunteer-styles';
  style.textContent = volunteerStyles;
  document.head.appendChild(style);
})();

Object.assign(window, { Volunteer });
