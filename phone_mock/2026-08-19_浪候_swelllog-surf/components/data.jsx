// ===== SURF APP DATA: 浪候 / SWELLLOG =====
// Realistic content for the surfing forecast & log app

const APP_NAME = '浪候';
const APP_SUBTITLE = 'SWELLLOG';

// Surf spots in China (real locations)
const SURF_SPOTS = [
  {
    id: 'wanning',
    name: '日月湾',
    location: '海南万宁',
    lat: 18.5,
    distance: 1.2, // km from user position
    rating: 4,
    waveHeight: { min: 1.2, max: 2.0 },
    period: 12,
    windDir: '东北风',
    windSpeed: 14,
    tide: '涨潮',
    bestWindow: '08:00-11:00',
    suitable: 'suitable', // good / suitable / fair / poor
    crowd: '适中',
    features: ['沙滩浪', '长板友好', '人多'],
  },
  {
    id: 'shimei',
    name: '石梅湾',
    location: '海南万宁',
    lat: 18.4,
    distance: 5.8,
    rating: 3,
    waveHeight: { min: 0.8, max: 1.4 },
    period: 10,
    windDir: '东风',
    windSpeed: 10,
    tide: '退潮',
    bestWindow: '14:00-17:00',
    suitable: 'fair',
    crowd: '较少',
    features: ['礁石浪', '快速管壁', '进阶友好'],
  },
  {
    id: 'gulong',
    name: '古龙湾',
    location: '海南陵水',
    lat: 18.3,
    distance: 24.5,
    rating: 5,
    waveHeight: { min: 1.8, max: 2.8 },
    period: 14,
    windDir: '东北风',
    windSpeed: 12,
    tide: '高平潮',
    bestWindow: '06:00-09:00',
    suitable: 'good',
    crowd: '稀少',
    features: ['离岸点浪', '长距离管壁', '高级']
  },
  {
    id: 'dadonghai',
    name: '大东海',
    location: '海南三亚',
    lat: 18.2,
    distance: 78.0,
    rating: 2,
    waveHeight: { min: 0.4, max: 0.8 },
    period: 8,
    windDir: '南风',
    windSpeed: 6,
    tide: '低平潮',
    bestWindow: '全天',
    suitable: 'poor',
    crowd: '很多',
    features: ['平缓沙滩', '新手友好', '教学区'],
  },
];

// Hourly forecast data for the primary spot (24 hours, tide + wave)
const HOURLY_FORECAST = (() => {
  const hours = [];
  for (let h = 0; h < 24; h++) {
    // Simulated tidal curve: high around 6am and 6pm, low around noon and midnight
    const tidePhase = (h - 6) * Math.PI / 12;
    const tide = 1.2 + 0.9 * Math.cos(tidePhase); // 0.3 - 2.1m
    // Wave height varies with tide and period
    const waveBase = 1.4 + 0.4 * Math.cos(tidePhase + 0.5);
    const waveVar = 0.2 * Math.sin(h * 0.7);
    const waveH = Math.max(0.6, waveBase + waveVar);
    // Period
    const period = 11 + 2 * Math.cos(tidePhase - 0.3);
    // Wind
    const windSpeed = 8 + 6 * Math.sin((h - 4) * Math.PI / 12);
    const windDir = ['东北风', '东风', '东南风', '南风', '西南风'][Math.floor((h + 2) / 5) % 5];
    // Suitability score 0-10
    const tideScore = tide > 1.0 && tide < 1.8 ? 3 : 1;
    const waveScore = waveH > 1.0 && waveH < 2.2 ? 3 : 1.5;
    const windScore = windSpeed < 15 ? 3 : windSpeed < 20 ? 2 : 1;
    const suitability = Math.min(10, tideScore + waveScore + windScore);
    
    hours.push({
      hour: h,
      time: `${String(h).padStart(2,'0')}:00`,
      tide: parseFloat(tide.toFixed(2)),
      waveHeight: parseFloat(waveH.toFixed(1)),
      period: Math.round(period),
      windSpeed: Math.round(windSpeed),
      windDir,
      suitability: Math.round(suitability * 10) / 10,
    });
  }
  return hours;
})();

// Tidal curve points (smoother, 48 points for 24h)
const TIDE_CURVE = (() => {
  const pts = [];
  for (let i = 0; i <= 48; i++) {
    const h = i / 2;
    const tidePhase = (h - 6) * Math.PI / 12;
    const tide = 1.2 + 0.9 * Math.cos(tidePhase);
    pts.push({ hour: h, tide });
  }
  return pts;
})();

// User's surf log entries
const SURF_LOG = [
  {
    id: 1,
    date: '2026-08-17',
    spot: '日月湾',
    spotId: 'wanning',
    timeIn: '07:30',
    timeOut: '10:45',
    duration: 195, // minutes
    board: '长板 9\'2"',
    boardId: 'longboard1',
    waveCount: 28,
    bestWave: '第 14 道',
    rating: 4,
    selfRating: 3.5,
    conditions: '浪高 1.5m · 周期 11s · 东北风 12km/h',
    notes: '早浪很干净，右侧起飞。第三轮划水有点累，下次多练背肌。',
  },
  {
    id: 2,
    date: '2026-08-15',
    spot: '石梅湾',
    spotId: 'shimei',
    timeIn: '15:00',
    timeOut: '18:20',
    duration: 200,
    board: '短板 6\'4"',
    boardId: 'shortboard1',
    waveCount: 22,
    bestWave: '第 7 道',
    rating: 3,
    selfRating: 4,
    conditions: '浪高 1.2m · 周期 10s · 东风 8km/h',
    notes: '下午潮水合适，管壁比想象中厚。抓到一道左跑，走了 3 秒管。',
  },
  {
    id: 3,
    date: '2026-08-12',
    spot: '古龙湾',
    spotId: 'gulong',
    timeIn: '06:15',
    timeOut: '09:30',
    duration: 195,
    board: '枪板 7\'6"',
    boardId: 'gun1',
    waveCount: 15,
    bestWave: '第 9 道',
    rating: 5,
    selfRating: 5,
    conditions: '浪高 2.5m · 周期 14s · 东北风 10km/h',
    notes: '不虚此行！凌晨爬起来值了。第一道浪没敢下，第二道起就抓到了，骑了有 150 米。',
  },
  {
    id: 4,
    date: '2026-08-09',
    spot: '日月湾',
    spotId: 'wanning',
    timeIn: '08:00',
    timeOut: '11:30',
    duration: 210,
    board: '长板 9\'2"',
    boardId: 'longboard1',
    waveCount: 35,
    bestWave: '第 22 道',
    rating: 4,
    selfRating: 4,
    conditions: '浪高 1.8m · 周期 12s · 北风 10km/h',
    notes: '人不少但浪也多，节奏不错。cross-step 比上周稳了。',
  },
];

// Board quiver
const BOARD_QUIVER = [
  {
    id: 'longboard1',
    name: '浪游者',
    type: '长板',
    size: '9\'2" × 22¾" × 2⅞"',
    volume: '68L',
    material: '玻璃钢',
    fins: '单鳍',
    condition: '良好',
    purchaseDate: '2025-11',
    totalRides: 47,
    color: '#D9A441',
  },
  {
    id: 'shortboard1',
    name: '火石',
    type: '短板',
    size: '6\'4" × 19¼" × 2½"',
    volume: '32L',
    material: 'PU',
    fins: '三鳍 Thruster',
    condition: '有一处补修',
    purchaseDate: '2026-03',
    totalRides: 28,
    color: '#FF6B4A',
  },
  {
    id: 'gun1',
    name: '深海',
    type: '枪板',
    size: '7\'6" × 19" × 2⅝"',
    volume: '38L',
    material: '环氧树脂',
    fins: '四鳍 Quad',
    condition: '全新',
    purchaseDate: '2026-06',
    totalRides: 6,
    color: '#48C9A9',
  },
];

// User stats
const USER_STATS = {
  name: '林屿',
  avatar: '屿',
  level: '进阶冲浪者',
  totalSessions: 128,
  totalHours: 386,
  totalWaves: 2840,
  streak: 5, // 连续冲浪天数
  favoriteSpot: '日月湾',
  year2026: {
    sessions: 62,
    distance: 186, // km surfed
    calories: 58400,
  },
  achievements: [
    { id: 1, name: '第一道浪', desc: '完成首次起板', earned: true },
    { id: 2, name: '百浪斩', desc: '累计抓浪 100 道', earned: true },
    { id: 3, name: '日出追逐者', desc: '清晨 6 点前下海 10 次', earned: true },
    { id: 4, name: '三板客', desc: '拥有 3 块及以上浪板', earned: true },
    { id: 5, name: '连续一周', desc: '连续 7 天出浪', earned: false },
    { id: 6, name: '三米挑战', desc: '抓到 3 米以上浪高', earned: false },
  ],
};

// Design tokens
const DESIGN_TOKENS = {
  colorSystem: [
    { name: '主底色 bg', cssVar: '--bg', role: '页面底色' },
    { name: '卡片色 bg-card', cssVar: '--bg-card', role: '卡片/模块底' },
    { name: '海面色 bg-surface', cssVar: '--bg-surface', role: '潮汐/数据区底' },
    { name: '主文字 text-primary', cssVar: '--text-primary', role: '标题/正文' },
    { name: '次文字 text-secondary', cssVar: '--text-secondary', role: '辅助说明' },
    { name: '弱文字 text-muted', cssVar: '--text-muted', role: '标签/时间' },
    { name: '珊瑚橙 accent', cssVar: '--accent', role: '行动/警示' },
    { name: '沙金 secondary', cssVar: '--secondary', role: '次级强调' },
    { name: '浪沫白 foam', cssVar: '--foam', role: '高光/浪峰' },
    { name: '边框 border', cssVar: '--border', role: '分割线/描边' },
  ],
  typeScale: [
    { name: '大标题', size: '28px', weight: 700, sample: '今日浪报' },
    { name: '浪高数字', size: '56px', weight: 300, sample: '1.6', mono: true },
    { name: '标题 1', size: '20px', weight: 600, sample: '日月湾详情' },
    { name: '标题 2', size: '17px', weight: 600, sample: '逐时预报' },
    { name: '正文', size: '14px', weight: 400, sample: '早浪很干净，右侧起飞' },
    { name: '辅助', size: '12px', weight: 400, sample: '上次更新 12 分钟前' },
    { name: '标签', size: '10px', weight: 500, sample: '适宜下水' },
  ],
  spacing: [4, 8, 12, 16, 20, 24, 32],
  radius: [4, 8, 12, 16, 20],
};

// API docs data
const API_DOCS = {
  baseUrl: 'https://api.langhou.app/v2',
  endpoints: [
    {
      method: 'GET',
      path: '/forecast/today',
      desc: '获取今日综合浪报',
      params: [
        { name: 'spot_id', type: 'string', required: true, desc: '浪点 ID' },
        { name: 'date', type: 'string', required: false, desc: '日期 YYYY-MM-DD' },
      ],
      response: `{
  "spot_id": "wanning",
  "date": "2026-08-19",
  "wave_height": { "min": 1.2, "max": 2.0 },
  "period": 12,
  "wind": { "dir": "NE", "speed_kph": 14 },
  "tide": {
    "high": [{ "time": "06:24", "height": 2.1 }],
    "low":  [{ "time": "12:48", "height": 0.3 }]
  },
  "suitability": 8.2,
  "best_window": ["08:00", "11:00"]
}`
    },
    {
      method: 'GET',
      path: '/forecast/hourly',
      desc: '获取逐时预报数据',
      params: [
        { name: 'spot_id', type: 'string', required: true, desc: '浪点 ID' },
        { name: 'hours', type: 'int', required: false, desc: '返回小时数，默认24' },
      ],
      response: `{
  "spot_id": "wanning",
  "hours": [
    {
      "hour": 6,
      "wave_height": 1.8,
      "period": 12,
      "tide_m": 2.1,
      "wind": { "dir": "NE", "speed": 12 },
      "suitability": 9.1
    }
  ]
}`
    },
    {
      method: 'GET',
      path: '/spots/nearby',
      desc: '获取附近浪点列表',
      params: [
        { name: 'lat', type: 'float', required: true, desc: '纬度' },
        { name: 'lng', type: 'float', required: true, desc: '经度' },
        { name: 'radius_km', type: 'int', required: false, desc: '搜索半径' },
      ],
      response: `{
  "spots": [
    {
      "id": "wanning",
      "name": "日月湾",
      "distance_km": 1.2,
      "rating": 4,
      "wave_height": { "min": 1.2, "max": 2.0 },
      "suitability": "suitable"
    }
  ]
}`
    },
    {
      method: 'POST',
      path: '/log/session',
      desc: '记录一次出浪',
      params: [
        { name: 'spot_id', type: 'string', required: true, desc: '浪点 ID' },
        { name: 'time_in', type: 'string', required: true, desc: '入水时间 ISO' },
        { name: 'time_out', type: 'string', required: true, desc: '出水时间 ISO' },
        { name: 'board_id', type: 'string', required: false, desc: '使用板 ID' },
        { name: 'wave_count', type: 'int', required: false, desc: '抓浪数' },
        { name: 'rating', type: 'int', required: false, desc: '自评 1-5' },
        { name: 'notes', type: 'string', required: false, desc: '笔记' },
      ],
      response: `{
  "success": true,
  "session_id": "ses_20260819_0042",
  "duration_min": 195,
  "total_sessions": 129
}`
    },
  ]
};
