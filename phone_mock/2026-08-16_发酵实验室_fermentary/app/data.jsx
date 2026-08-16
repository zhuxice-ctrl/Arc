// ── 发酵实验室 · 数据层 ──
// 所有假数据自包含，不依赖外部资源

const FERMENT_TYPES = {
  sourdough: {
    id: 'sourdough',
    name: '酸种面包',
    nameEn: 'Sourdough',
    emoji: '🍞',
    color: '#C48A3D',
    stages: [
      { key: 'starter', label: '起种', duration: 8 * 60, temp: '26°C' },
      { key: 'autolyse', label: '自溶', duration: 30, temp: '24°C' },
      { key: 'knead', label: '揉面', duration: 15, temp: '24°C' },
      { key: 'bulk', label: '基础发酵', duration: 4 * 60, temp: '25°C' },
      { key: 'fold', label: '折叠', duration: 2 * 60, temp: '24°C' },
      { key: 'shape', label: '整形', duration: 20, temp: '22°C' },
      { key: 'proof', label: '最终发酵', duration: 12 * 60, temp: '4°C' },
      { key: 'score', label: '割包', duration: 5, temp: '室温' },
      { key: 'bake', label: '烘烤', duration: 45, temp: '240°C' },
      { key: 'cool', label: '冷却', duration: 2 * 60, temp: '室温' },
    ],
  },
  kombucha: {
    id: 'kombucha',
    name: '康普茶',
    nameEn: 'Kombucha',
    emoji: '🫖',
    color: '#E8B84C',
    stages: [
      { key: 'brew', label: '泡茶', duration: 20, temp: '95°C' },
      { key: 'cool', label: '冷却', duration: 2 * 60, temp: '室温' },
      { key: 'scoby', label: '接种 SCOBY', duration: 5, temp: '24°C' },
      { key: 'ferment1', label: '一酿', duration: 7 * 24 * 60, temp: '24°C' },
      { key: 'flavor', label: '调味', duration: 30, temp: '室温' },
      { key: 'ferment2', label: '二酿', duration: 2 * 24 * 60, temp: '22°C' },
      { key: 'chill', label: '冷藏', duration: 24 * 60, temp: '4°C' },
    ],
  },
  miso: {
    id: 'miso',
    name: '味噌',
    nameEn: 'Miso',
    emoji: '🥣',
    color: '#A67C52',
    stages: [
      { key: 'soak', label: '浸泡大豆', duration: 12 * 60, temp: '室温' },
      { key: 'cook', label: '蒸煮', duration: 3 * 60, temp: '121°C' },
      { key: 'koji', label: '米曲混合', duration: 30, temp: '38°C' },
      { key: 'salt', label: '盐渍', duration: 20, temp: '室温' },
      { key: 'pack', label: '装坛', duration: 20, temp: '室温' },
      { key: 'age', label: '熟成', duration: 90 * 24 * 60, temp: '15°C' },
    ],
  },
  brew: {
    id: 'brew',
    name: '精酿',
    nameEn: 'Homebrew',
    emoji: '🍺',
    color: '#D97A2C',
    stages: [
      { key: 'mash', label: '糖化', duration: 90, temp: '68°C' },
      { key: 'sparge', label: '洗糟', duration: 20, temp: '76°C' },
      { key: 'boil', label: '煮沸', duration: 60, temp: '100°C' },
      { key: 'chill', label: '冷却', duration: 30, temp: '20°C' },
      { key: 'pitch', label: '接种酵母', duration: 10, temp: '20°C' },
      { key: 'primary', label: '主发酵', duration: 7 * 24 * 60, temp: '19°C' },
      { key: 'secondary', label: '二发', duration: 14 * 24 * 60, temp: '12°C' },
      { key: 'bottle', label: '装瓶', duration: 60, temp: '室温' },
      { key: 'condition', label: '瓶中熟化', duration: 14 * 24 * 60, temp: '20°C' },
    ],
  },
};

// ── 正在发酵的批次 ──
const FERMENT_BATCHES = [
  {
    id: 'b001',
    type: 'sourdough',
    name: '乡村酸种 · 第 23 号',
    recipe: 'Tartine 基础配方',
    startAt: Date.now() - 2 * 60 * 60 * 1000, // 2 小时前开始
    currentStage: 'bulk',
    progress: 0.35,
    flavor: ['蜂蜜', '烤坚果', '微酸'],
    notes: '这次用了新到的法国 T65 面粉，吸水性偏强。',
    temp: 25,
    targetTemp: 25,
    ph: 4.2,
    activity: 'high', // high / medium / low
    totalStages: 10,
  },
  {
    id: 'b002',
    type: 'kombucha',
    name: '茉莉绿茶康普茶',
    recipe: '茉莉银毫 + 有机蔗糖',
    startAt: Date.now() - 4 * 24 * 60 * 60 * 1000 - 6 * 60 * 60 * 1000,
    currentStage: 'ferment1',
    progress: 0.62,
    flavor: ['花香', '清淡', '回甘'],
    notes: 'SCOBY 状态很好，表面有新的菌膜生成。',
    temp: 24,
    targetTemp: 24,
    ph: 3.8,
    activity: 'medium',
    totalStages: 7,
  },
  {
    id: 'b003',
    type: 'miso',
    name: '三年熟成白味噌',
    recipe: '米曲 100% · 北海道大豆',
    startAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    currentStage: 'age',
    progress: 0.33,
    flavor: ['鲜甜', '豆香', '温润'],
    notes: '第一个月，颜色已开始变深。',
    temp: 15,
    targetTemp: 15,
    ph: 5.6,
    activity: 'low',
    totalStages: 6,
  },
  {
    id: 'b004',
    type: 'brew',
    name: '西海岸 IPA · V3',
    recipe: 'Citra + Mosaic 干投',
    startAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    currentStage: 'primary',
    progress: 0.45,
    flavor: ['热带水果', '松针', '苦度适中'],
    notes: '发酵第四天，比重从 1.062 降到 1.024。',
    temp: 19,
    targetTemp: 19,
    ph: 4.5,
    activity: 'high',
    totalStages: 9,
  },
];

// ── 风味笔记 ──
const FLAVOR_NOTES = [
  {
    id: 'n001',
    batchId: 'b001',
    date: '第 3 天',
    type: 'taste',
    title: '折叠后品鉴',
    content: '面团弹性很好，表面有明显气泡感。折痕回弹速度中等，说明面筋发育良好。闻起来有轻微的乳酸味和谷物甜香。',
    rating: 4,
    tags: ['弹性好', '气泡感', '乳酸香'],
  },
  {
    id: 'n002',
    batchId: 'b001',
    date: '第 1 天',
    type: 'photo',
    title: '起种状态记录',
    content: '8 小时后涨至 2.5 倍高，顶部有明显的蜂窩状气孔。酵母活跃度 ★★★★☆',
    rating: 5,
    tags: ['起种', '高活性'],
  },
  {
    id: 'n003',
    batchId: 'b002',
    date: '第 3 天',
    type: 'temp',
    title: '温度曲线异常',
    content: '昨晚室温降到 20°C，发酵速度略有下降。已移到暖气旁，恢复至 24°C。',
    rating: 3,
    tags: ['温度', '调整位置'],
  },
  {
    id: 'n004',
    batchId: 'b004',
    date: '第 2 天',
    type: 'gravity',
    title: '高泡期',
    content: ' krausen 达到最高点，约 3cm 厚。气泡细密，有浓郁的酒花香气。',
    rating: 4,
    tags: ['高泡期', '香气足'],
  },
];

// ── 配方灵感 (探索页) ──
const RECIPES = [
  {
    id: 'r001',
    type: 'sourdough',
    title: '100% 全麦乡村面包',
    author: '老麦的厨房',
    duration: '18 小时',
    difficulty: '中等',
    likes: 2341,
    color: '#C48A3D',
  },
  {
    id: 'r002',
    type: 'kombucha',
    title: '桃子乌龙康普茶',
    author: '发酵实验室',
    duration: '9 天',
    difficulty: '简单',
    likes: 1892,
    color: '#E8B84C',
  },
  {
    id: 'r003',
    type: 'brew',
    title: '新英格兰 IPA',
    author: '酿酒老王',
    duration: '21 天',
    difficulty: '困难',
    likes: 3105,
    color: '#D97A2C',
  },
  {
    id: 'r004',
    type: 'miso',
    title: '快速味噌 · 2 周版',
    author: '味噌职人',
    duration: '14 天',
    difficulty: '简单',
    likes: 956,
    color: '#A67C52',
  },
  {
    id: 'r005',
    type: 'sourdough',
    title: '恰巴塔 Ciabatta',
    author: '意大利面包师',
    duration: '12 小时',
    difficulty: '困难',
    likes: 1456,
    color: '#C48A3D',
  },
  {
    id: 'r006',
    type: 'brew',
    title: '古斯酸啤 Gose',
    author: '酸啤爱好者',
    duration: '14 天',
    difficulty: '中等',
    likes: 782,
    color: '#D97A2C',
  },
];

// ── 用户统计 ──
const USER_STATS = {
  totalBatches: 47,
  completedBatches: 43,
  activeBatches: 4,
  totalFermentDays: 328,
  favoriteTypes: [
    { type: 'sourdough', count: 21, pct: 45 },
    { type: 'brew', count: 12, pct: 26 },
    { type: 'kombucha', count: 9, pct: 19 },
    { type: 'miso', count: 5, pct: 11 },
  ],
  longestStreak: 17, // 天
  avgRating: 4.3,
  collection: 28, // 收藏配方
};

// ── 温度历史 (用于详情页曲线) ──
function genTempCurve(seed, base, variance, points = 24) {
  const arr = [];
  let s = seed;
  for (let i = 0; i < points; i++) {
    s = (s * 9301 + 49297) % 233280;
    const rnd = s / 233280;
    arr.push(+((base - variance / 2) + rnd * variance).toFixed(1));
  }
  return arr;
}

// ── API 文档数据 ──
const API_ENDPOINTS = [
  { method: 'GET', path: '/api/v1/batches', desc: '获取发酵批次列表', params: [
    { name: 'status', type: 'string', desc: '状态筛选：active / completed / all', default: 'active' },
    { name: 'type', type: 'string', desc: '发酵类型：sourdough / kombucha / miso / brew', default: '' },
    { name: 'page', type: 'number', desc: '页码', default: '1' },
    { name: 'limit', type: 'number', desc: '每页数量', default: '20' },
  ], response: `{
  "code": 0,
  "data": {
    "total": 4,
    "list": [
      {
        "id": "b001",
        "type": "sourdough",
        "name": "乡村酸种 · 第 23 号",
        "currentStage": "bulk",
        "progress": 0.35,
        "temp": 25
      }
    ]
  }
}` },
  { method: 'POST', path: '/api/v1/batches', desc: '创建新发酵批次', params: [
    { name: 'type', type: 'string', desc: '发酵类型', required: true },
    { name: 'name', type: 'string', desc: '批次名称', required: true },
    { name: 'recipe', type: 'string', desc: '配方名称', required: false },
    { name: 'startAt', type: 'timestamp', desc: '开始时间', default: 'now' },
  ], response: `{
  "code": 0,
  "data": { "id": "b005", "createdAt": 1710000000 }
}` },
  { method: 'GET', path: '/api/v1/batches/:id', desc: '获取批次详情', params: [
    { name: 'id', type: 'string', desc: '批次 ID', required: true },
  ], response: `{
  "code": 0,
  "data": {
    "id": "b001",
    "type": "sourdough",
    "name": "乡村酸种 · 第 23 号",
    "stages": [...],
    "tempLog": [...],
    "notes": [...]
  }
}` },
  { method: 'POST', path: '/api/v1/batches/:id/notes', desc: '添加风味笔记', params: [
    { name: 'title', type: 'string', desc: '笔记标题', required: true },
    { name: 'content', type: 'string', desc: '笔记内容', required: true },
    { name: 'rating', type: 'number', desc: '评分 1-5', default: '5' },
    { name: 'tags', type: 'array', desc: '标签数组', required: false },
  ], response: `{
  "code": 0,
  "data": { "id": "n005", "createdAt": 1710000000 }
}` },
  { method: 'GET', path: '/api/v1/recipes', desc: '获取配方列表', params: [
    { name: 'type', type: 'string', desc: '发酵类型筛选', default: '' },
    { name: 'sort', type: 'string', desc: '排序：hot / new / rating', default: 'hot' },
  ], response: `{
  "code": 0,
  "data": { "total": 128, "list": [...] }
}` },
  { method: 'GET', path: '/api/v1/users/me/stats', desc: '获取用户统计数据', params: [], response: `{
  "code": 0,
  "data": {
    "totalBatches": 47,
    "completedBatches": 43,
    "activeBatches": 4,
    "streak": 17
  }
}` },
];

Object.assign(window, {
  FERMENT_TYPES,
  FERMENT_BATCHES,
  FLAVOR_NOTES,
  RECIPES,
  USER_STATS,
  genTempCurve,
  API_ENDPOINTS,
});
