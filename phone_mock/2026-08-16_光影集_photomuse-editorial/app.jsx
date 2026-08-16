// ===== 光影集 PhotoMuse · 主应用框架 =====
// 契约层对齐：4 个页面 / 13 个云函数 / 订单状态机 / snake_case 字段
// 视觉方向：Editorial 编辑室（衬线大标题 + 发丝线 + 极致留白 + 杂志质感）

const { useState, useEffect, useCallback, useMemo, useRef } = React;

// ===== 设计令牌 Design Tokens =====
const PM = {
  // 页面底色
  pageBg: '#FAFAF8',
  surface: '#FFFFFF',
  surfaceAlt: '#F5F3EF',
  // 主色（墨黑）
  ink: '#1A1A1A',
  inkSecondary: '#3D3D38',
  inkTertiary: '#737169',
  inkFaint: '#B8B6AE',
  // 线条
  border: '#E0DED8',
  borderHover: '#B8B6AE',
  hairline: '#D0CEC6',
  divider: '#ECE9E1',
  // 强调色（低调琥珀金）
  accent: '#B8860B',
  accentSoft: '#F7EFE0',
  accentLight: '#D4AF6A',
  // 状态色
  success: '#2E6B3F',
  successSoft: '#E8F2EA',
  warning: '#C66A2E',
  warningSoft: '#FAECE0',
  error: '#B23A3A',
  errorSoft: '#F6E3E1',
  info: '#2C5A7A',
  infoSoft: '#E2ECF2',
  // 字体
  display: "'Playfair Display', 'Noto Serif SC', serif",
  serif: "'Playfair Display', 'Noto Serif SC', serif",
  body: "'Inter', 'Noto Sans SC', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

// ===== 配置常量（对齐 utils/ai-studio-config.js 契约） =====
const PRODUCTS = [
  { productId: 'id_photo_9_9', name: '证件照体验版', price: '¥3.9', desc: '单张出片 · AI 自动制作', deliveryCount: 1, productionLine: 'auto' },
  { productId: 'resume_photo_29_9', name: '简历形象照', price: '¥29.9', desc: '三张交付 · 半人工精修', deliveryCount: 3, productionLine: 'semi_auto' },
];

const STYLES = [
  { styleId: 'ID-01', name: '蓝底正装', subtitle: 'Blue · Formal', thumb: null },
  { styleId: 'ID-02', name: '红底经典', subtitle: 'Red · Classic', thumb: null },
  { styleId: 'ID-03', name: '白底简约', subtitle: 'White · Minimal', thumb: null },
];

const STATUS_LABELS = {
  waiting_photos: '待上传',
  photo_review: '审核中',
  queued: '队列中',
  generating: '生成中',
  qc: '质检中',
  delivered: '已交付',
  cancelled: '已取消',
  waiting_retake: '待补拍',
};

const PHOTO_CHECK_LABELS = {
  unchecked: '未审核',
  passed: '已通过',
  need_retake: '需补拍',
  rejected: '已拒绝',
};

// 订单状态筛选（管理端，与契约对齐 7 状态）
const ADMIN_STATUS_OPTIONS = [
  { value: 'photo_review', label: '待审核' },
  { value: 'queued', label: '队列中' },
  { value: 'generating', label: '生成中' },
  { value: 'qc', label: '质检中' },
  { value: 'delivered', label: '已交付' },
  { value: 'waiting_photos', label: '补拍中' },
  { value: 'cancelled', label: '已取消' },
];

const AUTHORIZATION_TEXT = [
  { field: 'isSelfOrAuthorized', text: '确认是本人或已获得授权' },
  { field: 'isAdult', text: '确认已年满 18 周岁' },
  { field: 'agreesProduction', text: '同意 AI 制作与服务条款' },
];

const BACKGROUND_OPTIONS = ['白底', '蓝底', '红底', '灰底'];
const CLOTHING_OPTIONS = ['保持原服装', '白衬衫', '深色西装'];
const SPEC_OPTIONS = ['一寸', '二寸', '考试报名', '社保照', '简历头像'];

// ===== 示例图片（项目内已有） =====
const IMG = {
  idBlue: '/spark/app/app_17c85bu20nu/runtime/api/v1/storage/object/bucket_aadkqg427v4ju_static/static%2Faadkqgn34a4go_ve_miaoda',
  idRed: '/spark/app/app_17c85bu20nu/runtime/api/v1/storage/object/bucket_aadkqg427v4ju_static/static%2Faadkqgt4kjsag_ve_miaoda',
  portrait: '/spark/app/app_17c85bu20nu/runtime/api/v1/storage/object/bucket_aadkqg427v4ju_static/static%2Faadkqgl2lxgfq_ve_miaoda',
  cinematic: '/spark/app/app_17c85bu20nu/runtime/api/v1/storage/object/bucket_aadkqg427v4ju_static/static%2Faadkqgucgdubi_ve_miaoda',
  magazine: '/spark/app/app_17c85bu20nu/runtime/api/v1/storage/object/bucket_aadkqg427v4ju_static/static%2Faadkqgr33tukq_ve_miaoda',
  polaroid: '/spark/app/app_17c85bu20nu/runtime/api/v1/storage/object/bucket_aadkqg427v4ju_static/static%2Faadkqgucgduai_ve_miaoda',
  studio: '/spark/app/app_17c85bu20nu/runtime/api/v1/storage/object/bucket_aadkqg427v4ju_static/static%2Faadkqgr33tukq_ve_miaoda',
};

// 产品效果范例
const PRODUCT_EXAMPLES = {
  id_photo_9_9: {
    subtitle: 'ID Photo · Standard',
    beforeImage: IMG.cinematic,
    afterImage: IMG.idBlue,
    features: [
      '智能识别五官与脸型',
      '自动替换证件照底色',
      '光线与肤色自然校准',
      '3 秒极速出片',
    ],
    tips: [
      '光线均匀，避免强烈侧光',
      '正脸直视镜头，表情自然',
      '头发不遮挡眉眼',
    ],
  },
  resume_photo_29_9: {
    subtitle: 'Business Portrait · Premium',
    beforeImage: IMG.magazine,
    afterImage: IMG.portrait,
    features: [
      '电影级光影重塑',
      '专业背景虚化处理',
      '服装与发型智能优化',
      '人工精修质检 · 2 小时交付',
    ],
    tips: [
      '选择纯色简洁背景',
      '肩膀放松，自然微笑',
      '光线从前方 45° 照射效果最佳',
    ],
  },
};

// ===== 全局 Hook =====
function useAppState() {
  // 路由：index / detail / adminLogin / admin
  const [page, setPage] = useState('index');
  const [pageStack, setPageStack] = useState(['index']);

  // 全局 Toast
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

  // 下单表单状态（对齐契约 data 字段）
  const [form, setForm] = useState({
    selectedProductId: PRODUCTS[0].productId,
    selectedStyleId: STYLES[0].styleId,
    backgroundIndex: 0,
    clothingIndex: 0,
    specIndex: 0,
    customerNote: '',
    contactPhone: '',
    queryPassword: '',
    photos: [],           // [{ id, url, size }]
    authorization: {
      isSelfOrAuthorized: false,
      isAdult: false,
      agreesProduction: false,
    },
    // 查询面板
    showQueryPanel: false,
    queryOrderId: '',
    queryContactPhone: '',
    queryOrderPassword: '',
  });

  // 订单列表
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // 当前订单（详情页）
  const [currentOrder, setCurrentOrder] = useState(null);
  const [currentOrderFiles, setCurrentOrderFiles] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [queryMode, setQueryMode] = useState(false);

  // 管理端
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminStatus, setAdminStatus] = useState('photo_review');
  const [adminLoading, setAdminLoading] = useState(true);
  const [actionOrderId, setActionOrderId] = useState(null);

  const showToast = useCallback((message, type = 'info', duration = 2200) => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), duration);
  }, []);

  const navigate = useCallback((newPage, params = {}) => {
    setPageStack(prev => [...prev, newPage]);
    setPage(newPage);
  }, []);

  const goBack = useCallback(() => {
    setPageStack(prev => {
      if (prev.length <= 1) return prev;
      const newStack = prev.slice(0, -1);
      setPage(newStack[newStack.length - 1]);
      return newStack;
    });
  }, []);

  const goHome = useCallback(() => {
    setPageStack(['index']);
    setPage('index');
  }, []);

  // 初始化：模拟加载订单列表
  useEffect(() => {
    setOrdersLoading(true);
    setTimeout(() => {
      const demoOrders = [
        {
          orderId: 'AIStudio-1730000000-abc123',
          productName: '证件照体验版',
          styleName: '蓝底正装',
          price: '¥3.9',
          order_status: 'delivered',
          photo_check: 'passed',
          reference_photo_count: 1,
          delivery_file_count: 1,
          reviewNote: '',
          createdAt: '2026-08-15T10:23:00Z',
          updatedAt: '2026-08-15T10:25:00Z',
          customerUrls: [IMG.cinematic],
          deliveryUrls: [IMG.idBlue],
        },
        {
          orderId: 'AIStudio-1729000000-def456',
          productName: '简历形象照',
          styleName: '白底简约',
          price: '¥29.9',
          order_status: 'photo_review',
          photo_check: 'unchecked',
          reference_photo_count: 2,
          delivery_file_count: 0,
          reviewNote: '',
          createdAt: '2026-08-14T14:05:00Z',
          updatedAt: '2026-08-14T14:06:00Z',
          customerUrls: [IMG.magazine, IMG.portrait],
          deliveryUrls: [],
        },
      ];
      setOrders(demoOrders);
      setOrdersLoading(false);
    }, 600);
  }, []);

  return {
    // 路由
    page, navigate, goBack, goHome, pageStack,
    // Toast
    toast, showToast,
    // 表单
    form, setForm,
    // 订单列表
    orders, setOrders, ordersLoading, setOrdersLoading,
    // 当前订单
    currentOrder, setCurrentOrder,
    currentOrderFiles, setCurrentOrderFiles,
    detailLoading, setDetailLoading,
    queryMode, setQueryMode,
    // 管理端
    adminPassword, setAdminPassword,
    isAdmin, setIsAdmin,
    adminOrders, setAdminOrders,
    adminStatus, setAdminStatus,
    adminLoading, setAdminLoading,
    actionOrderId, setActionOrderId,
  };
}

// ===== 全局组件 =====
function Toast({ message, visible, type = 'info' }) {
  const bgMap = {
    info: 'rgba(26,26,26,0.92)',
    success: 'rgba(46,107,63,0.92)',
    error: 'rgba(178,58,58,0.92)',
    warning: 'rgba(198,106,46,0.92)',
  };
  return (
    <div style={{
      position: 'fixed',
      top: '38%',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '11px 22px',
      background: bgMap[type],
      backdropFilter: 'blur(12px)',
      color: '#fff',
      fontSize: 13,
      lineHeight: 1.5,
      borderRadius: 10,
      zIndex: 9999,
      opacity: visible ? 1 : 0,
      pointerEvents: 'none',
      transition: 'opacity 0.25s ease',
      textAlign: 'center',
      maxWidth: '78%',
      fontWeight: 400,
      letterSpacing: 0.2,
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    }}>
      {message}
    </div>
  );
}

// 发丝线分隔
function Hairline({ style }) {
  return <div style={{ height: 1, background: PM.hairline, opacity: 0.5, ...style }} />;
}

// 页面容器
function PageFrame({ children }) {
  return (
    <div style={{
      width: '100%',
      maxWidth: 480,
      height: '100%',
      margin: '0 auto',
      background: PM.pageBg,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {children}
    </div>
  );
}

// ===== 主 App =====
function App() {
  const state = useAppState();
  const { page, pageStack } = state;

  const renderPage = () => {
    const { IndexPage } = window;
    const { DetailPage } = window;
    const { AdminLoginPage } = window;
    const { AdminPage } = window;

    switch (page) {
      case 'detail': return <DetailPage {...state} />;
      case 'adminLogin': return <AdminLoginPage {...state} />;
      case 'admin': return <AdminPage {...state} />;
      default: return <IndexPage {...state} />;
    }
  };

  const pageKey = `${page}-${pageStack.length}`;

  return (
    <div style={{
      width: '100%', height: '100%',
      background: PM.pageBg,
      overflow: 'hidden',
    }}>
      <PageFrame>
        <div
          key={pageKey}
          style={{
            width: '100%',
            height: '100%',
            animation: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {renderPage()}
        </div>
      </PageFrame>
      <Toast message={state.toast.message} visible={state.toast.visible} type={state.toast.type} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

// 暴露到全局（页面组件通过 window 访问）
Object.assign(window, {
  PM,
  IMG,
  PRODUCTS,
  STYLES,
  STATUS_LABELS,
  PHOTO_CHECK_LABELS,
  ADMIN_STATUS_OPTIONS,
  AUTHORIZATION_TEXT,
  BACKGROUND_OPTIONS,
  CLOTHING_OPTIONS,
  SPEC_OPTIONS,
  PRODUCT_EXAMPLES,
  Hairline,
  PageFrame,
  Toast,
});
