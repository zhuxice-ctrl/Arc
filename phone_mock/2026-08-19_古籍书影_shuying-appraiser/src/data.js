/* ============================================================
   古籍鉴 · 数据层
   ——版本学真实术语与样本数据
   ============================================================ */

// 版本类型
const EDITION_TYPES = {
  SONG_KEBEN: { id: 'song_keben', name: '宋刻本', era: '宋代', description: '宋代雕版刻印的书籍，刻印精良，字体典雅，为历代藏书家所重。' },
  YUAN_KEBEN: { id: 'yuan_keben', name: '元刻本', era: '元代', description: '元代雕版刻印的书籍，字体趋于赵体，版式较为疏朗。' },
  MING_NEIFU: { id: 'ming_neifu', name: '明内府本', era: '明代', description: '明代宫廷内府刻印的书籍，用料讲究，校勘精审。' },
  DIAN_BEN: { id: 'dian_ben', name: '殿本', era: '清代', description: '清代武英殿刻印的书籍，即武英殿本，为官刻本之代表。' },
  YING_SONG: { id: 'ying_song', name: '影宋本', era: '清代', description: '以宋本为底本影摹刻印的版本，力求逼肖宋版风貌。' },
  HUO_ZI: { id: 'huo_zi', name: '活字本', era: '历代', description: '以活字排版印制的书籍，有泥活字、木活字、铜活字之分。' },
  CHAO_BEN: { id: 'chao_ben', name: '抄本', era: '历代', description: '以手写传抄的书籍，名家手抄本尤为珍贵。' },
  DIXIU: { id: 'dixiu', name: '递修本', era: '历代', description: '书版经多次修补重印的版本，版面新旧交叠。' },
  SANCHAO: { id: 'sanchao', name: '三朝本', era: '宋元明', description: '经宋元明三朝递修的版本，以南宋国子监书版为底本。' },
};

// 版式特征
const FEATURE_TYPES = {
  BAN_KUANG: { id: 'ban_kuang', name: '版框', description: '版面四周的边框' },
  YU_WEI: { id: 'yu_wei', name: '鱼尾', description: '版心中间形似鱼尾的标志' },
  JIE_HANG: { id: 'jie_hang', name: '界行', description: '版面各行之间的分隔线' },
  XIANG_BI: { id: 'xiang_bi', name: '象鼻', description: '版框上下边至鱼尾之间的黑线' },
  SHU_ER: { id: 'shu_er', name: '书耳', description: '版框外上角的小方格' },
  PAI_JI: { id: 'pai_ji', name: '牌记', description: '刻书的题记、商标等' },
  KUAN_SHI: { id: 'kuan_shi', name: '版式', description: '版面的行款、字数、边栏等' },
  ZI_TI: { id: 'zi_ti', name: '字体', description: '刊刻字体风格' },
  BI_HUI: { id: 'bi_hui', name: '避讳字', description: '避皇帝名讳的改字或缺笔' },
  ZHI_ZHANG: { id: 'zhi_zhang', name: '纸张', description: '用纸的材质、颜色、帘纹等' },
};

// 朝代
const DYNASTIES = [
  { id: 'song', name: '宋', color: '#8b6914' },
  { id: 'yuan', name: '元', color: '#6b5a44' },
  { id: 'ming', name: '明', color: '#2d4a5e' },
  { id: 'qing', name: '清', color: '#b3392e' },
  { id: 'minguo', name: '民国', color: '#4a6b80' },
];

// 样本档案数据
const SAMPLE_ARCHIVES = [
  {
    id: 'arc_001',
    title: '南华真经',
    subtitle: '卷一同名卷',
    editionType: 'song_keben',
    era: '南宋',
    eraDetail: '南宋嘉定六年（1213）',
    confidence: 94,
    scannedAt: '2026-08-15',
    imageIndex: 0,
    features: {
      ban_kuang: '左右双边，上下单边',
      yu_wei: '双鱼尾，黑口',
      jie_hang: '半叶十行，行二十字',
      zi_ti: '欧体，笔画瘦劲',
      bi_hui: '避「玄」「朗」字缺笔',
      zhi_zhang: '麻纸，帘纹二指',
    },
    matchResults: [
      { rank: 1, name: '宋刻本·南华真经', era: '南宋嘉定', match: 94 },
      { rank: 2, name: '元覆宋本·庄子注', era: '元至正', match: 78 },
      { rank: 3, name: '明影宋抄本·南华经', era: '明万历', match: 65 },
    ],
    notes: '版心有刻工姓名，卷末有牌记一行「嘉定六年秋八月菉友书屋刊」。纸张为南宋典型楮皮纸，帘纹清晰。',
    tags: ['宋刻', '道家', '珍本'],
  },
  {
    id: 'arc_002',
    title: '资治通鉴',
    subtitle: '卷六十五',
    editionType: 'yuan_keben',
    era: '元代',
    eraDetail: '元至元二十三年（1286）',
    confidence: 87,
    scannedAt: '2026-08-12',
    imageIndex: 1,
    features: {
      ban_kuang: '四周双边',
      yu_wei: '单鱼尾，大黑口',
      jie_hang: '半叶十行，行二十一字',
      zi_ti: '赵体，圆润丰腴',
      bi_hui: '不避宋讳',
      zhi_zhang: '皮纸，质地坚韧',
    },
    matchResults: [
      { rank: 1, name: '元刻本·资治通鉴', era: '元至元', match: 87 },
      { rank: 2, name: '明覆元本·通鉴', era: '明正统', match: 72 },
      { rank: 3, name: '宋刻本·资治通鉴', era: '南宋绍兴', match: 58 },
    ],
    notes: '字体明显赵孟頫风格，为元代刻书典型特征。卷首有兴文署牌记，为元官刻本。',
    tags: ['元刻', '史部', '官刻'],
  },
  {
    id: 'arc_003',
    title: '周易本义',
    subtitle: '卷之二',
    editionType: 'ying_song',
    era: '清代',
    eraDetail: '清康熙内府影宋本',
    confidence: 91,
    scannedAt: '2026-08-08',
    imageIndex: 2,
    features: {
      ban_kuang: '左右双边',
      yu_wei: '双鱼尾，白口',
      jie_hang: '半叶七行，行十五字',
      zi_ti: '仿欧体，影摹宋刻',
      bi_hui: '避宋讳甚谨',
      zhi_zhang: '开化纸，洁白细腻',
    },
    matchResults: [
      { rank: 1, name: '清影宋本·周易本义', era: '清康熙', match: 91 },
      { rank: 2, name: '宋咸淳本·周易本义', era: '南宋咸淳', match: 85 },
      { rank: 3, name: '明刻本·周易传义', era: '明永乐', match: 62 },
    ],
    notes: '内府影宋精刻，字形逼肖宋版。纸用开化纸，为清内府刻书之上品。',
    tags: ['影宋', '经部', '内府'],
  },
  {
    id: 'arc_004',
    title: '梦溪笔谈',
    subtitle: '卷二十六',
    editionType: 'huo_zi',
    era: '明代',
    eraDetail: '明万历元年（1573）铜活字本',
    confidence: 82,
    scannedAt: '2026-08-05',
    imageIndex: 0,
    features: {
      ban_kuang: '四周单边',
      yu_wei: '单鱼尾，黑口',
      jie_hang: '半叶九行，行十七字',
      zi_ti: '宋体，字划整齐',
      bi_hui: '避明讳',
      zhi_zhang: '竹纸，色稍黄',
    },
    matchResults: [
      { rank: 1, name: '明铜活字本·梦溪笔谈', era: '明万历', match: 82 },
      { rank: 2, name: '明刻本·梦溪笔谈', era: '明嘉靖', match: 71 },
      { rank: 3, name: '清刻本·梦溪笔谈', era: '清乾隆', match: 55 },
    ],
    notes: '字划有轻微倾斜不齐，为活字本典型特征。版心下方无刻工名。',
    tags: ['活字本', '子部', '明版'],
  },
  {
    id: 'arc_005',
    title: '杜工部集',
    subtitle: '卷十',
    editionType: 'dian_ben',
    era: '清代',
    eraDetail: '清乾隆武英殿本',
    confidence: 96,
    scannedAt: '2026-07-30',
    imageIndex: 1,
    features: {
      ban_kuang: '四周双边',
      yu_wei: '双鱼尾，白口',
      jie_hang: '半叶十一行，行二十一字',
      zi_ti: '馆阁体，端正秀丽',
      bi_hui: '避清讳极严',
      zhi_zhang: '太史连纸，莹洁光润',
    },
    matchResults: [
      { rank: 1, name: '清殿本·杜工部集', era: '清乾隆', match: 96 },
      { rank: 2, name: '清钱谦益笺注本', era: '清康熙', match: 68 },
      { rank: 3, name: '宋刻本·杜工部集', era: '南宋', match: 52 },
    ],
    notes: '武英殿刻本，校勘极精。卷首有乾隆御制序，卷末有校勘官衔名。',
    tags: ['殿本', '集部', '清刻'],
  },
  {
    id: 'arc_006',
    title: '聊斋志异',
    subtitle: '卷三',
    editionType: 'chao_ben',
    era: '清代',
    eraDetail: '清乾隆抄本',
    confidence: 78,
    scannedAt: '2026-07-25',
    imageIndex: 2,
    features: {
      ban_kuang: '无版框（抄本）',
      yu_wei: '无（抄本）',
      jie_hang: '半叶八行，行二十字',
      zi_ti: '行书抄本，字迹工整',
      bi_hui: '避清讳',
      zhi_zhang: '毛边纸，质地较粗',
    },
    matchResults: [
      { rank: 1, name: '清抄本·聊斋志异', era: '清乾隆', match: 78 },
      { rank: 2, name: '清铸雪斋抄本', era: '清雍正', match: 71 },
      { rank: 3, name: '清刻本·聊斋志异', era: '清乾隆', match: 59 },
    ],
    notes: '乾隆时期抄本，有朱笔批校。卷端钤「历城张氏藏书」朱文印。',
    tags: ['抄本', '集部', '说部'],
  },
];

// 版本学知识条目
const KNOWLEDGE_ITEMS = [
  {
    id: 'know_001',
    title: '如何辨别宋刻本',
    content: '宋刻本特征：字体多为欧柳颜体，版式多白口单鱼尾，纸张以麻纸皮纸为主，避讳严格。北宋刻本多左右双边，南宋逐渐转为四周双边。',
    category: '鉴定入门',
  },
  {
    id: 'know_002',
    title: '鱼尾的种类与作用',
    content: '鱼尾是版心中间的装饰性标志，有单鱼尾、双鱼尾、三鱼尾之分。黑口本多为元刻，白口本多为宋刻。鱼尾方向用于确定书页正倒。',
    category: '版式特征',
  },
  {
    id: 'know_003',
    title: '避讳字——断代的重要依据',
    content: '各朝避讳不同，宋讳最严，有改字、缺笔、空字诸法。如宋避「玄」「朗」「敬」等字，可据以判断刻本年代下限。',
    category: '鉴定方法',
  },
  {
    id: 'know_004',
    title: '活字本与刻本的区别',
    content: '活字本特征：字划倾斜不齐，行距字距不均，个别字大小不一，版心无刻工名，无断版漫漶现象。铜活字本多印于明代中后期。',
    category: '版本类型',
  },
];

// API 接口文档
const API_ENDPOINTS = [
  {
    method: 'POST',
    path: '/api/v1/scan/identify',
    description: '上传书影图片，启动版本识别流程。返回扫描任务ID，用于轮询识别进度。',
    params: [
      { name: 'image', type: 'file', desc: '书影图片文件，支持JPG/PNG' },
      { name: 'region', type: 'string', desc: '识别区域（可选，默认全图）' },
    ],
    response: '{ task_id: string, status: "processing" }',
  },
  {
    method: 'GET',
    path: '/api/v1/scan/:taskId/progress',
    description: '查询识别任务进度，返回当前阶段和已识别的特征。',
    params: [
      { name: 'taskId', type: 'string', desc: '扫描任务ID' },
    ],
    response: '{ status, progress, features: [], current_step }',
  },
  {
    method: 'GET',
    path: '/api/v1/scan/:taskId/result',
    description: '获取识别结果，包含版本判定、特征列表和比对结果。',
    params: [
      { name: 'taskId', type: 'string', desc: '扫描任务ID' },
    ],
    response: '{ verdict, confidence, features, matches, era }',
  },
  {
    method: 'GET',
    path: '/api/v1/archives',
    description: '获取用户的鉴定档案列表，支持按朝代、版本类型筛选。',
    params: [
      { name: 'dynasty', type: 'string', desc: '朝代筛选（可选）' },
      { name: 'type', type: 'string', desc: '版本类型（可选）' },
      { name: 'page', type: 'number', desc: '页码，默认1' },
      { name: 'pageSize', type: 'number', desc: '每页数量，默认20' },
    ],
    response: '{ items: [], total, page, pageSize }',
  },
  {
    method: 'POST',
    path: '/api/v1/archives',
    description: '将鉴定结果保存为档案。',
    params: [
      { name: 'taskId', type: 'string', desc: '扫描任务ID' },
      { name: 'title', type: 'string', desc: '书籍名称' },
      { name: 'notes', type: 'string', desc: '鉴定备注（可选）' },
      { name: 'tags', type: 'array', desc: '标签列表（可选）' },
    ],
    response: '{ id: string, saved_at: string }',
  },
  {
    method: 'GET',
    path: '/api/v1/archives/:id',
    description: '获取单条档案详情。',
    params: [
      { name: 'id', type: 'string', desc: '档案ID' },
    ],
    response: '{ id, title, edition, features, images, notes }',
  },
  {
    method: 'GET',
    path: '/api/v1/knowledge/list',
    description: '获取版本学知识条目列表。',
    params: [
      { name: 'category', type: 'string', desc: '分类（可选）' },
    ],
    response: '{ items: [], categories: [] }',
  },
  {
    method: 'GET',
    path: '/api/v1/stats/overview',
    description: '获取用户统计概览：鉴定总数、各朝代分布、版本类型统计。',
    params: [],
    response: '{ total_archives, by_dynasty, by_type, recent_count }',
  },
];

// 设计规范数据
const DESIGN_SPECS = {
  colors: [
    { name: '宣纸', hex: '#F0E6D2', role: '主背景' },
    { name: '深宣纸', hex: '#E2D5B8', role: '次级背景' },
    { name: '墨黑', hex: '#2D2419', role: '主要文字' },
    { name: '墨褐', hex: '#4A3C2A', role: '次级文字' },
    { name: '墨灰', hex: '#8A7A62', role: '辅助文字' },
    { name: '朱砂', hex: '#B3392E', role: '主强调色' },
    { name: '深朱砂', hex: '#8F2B22', role: '按压状态' },
    { name: '靛青', hex: '#2D4A5E', role: '次级强调' },
    { name: '金棕', hex: '#8B6914', role: '装饰点缀' },
  ],
  fonts: [
    { name: 'Noto Serif SC', role: '展示字体 / 标题', sample: '古籍版本鉴定' },
    { name: 'Noto Serif SC 正文', role: '正文字体 / 内容', sample: '宋刻本字体典雅，为历代藏书家所重。' },
  ],
  spacing: [
    { name: 'xs', value: 4 },
    { name: 'sm', value: 8 },
    { name: 'md', value: 12 },
    { name: 'lg', value: 16 },
    { name: 'xl', value: 20 },
    { name: '2xl', value: 24 },
    { name: '3xl', value: 32 },
  ],
  components: [
    '导航栏 NavBar',
    '底部标签栏 TabBar',
    '主按钮 Primary Button',
    '次按钮 Secondary Button',
    '档案卡片 Archive Card',
    '特征检测框 Feature Box',
    '底部弹窗 Bottom Sheet',
    '统计卡片 Stat Card',
    '筛选标签 Filter Chip',
    '进度条 Progress Bar',
  ],
  animations: [
    { name: '印章盖印动效', purpose: '签名动效，首页印章出现' },
    { name: '扫描线动效', purpose: '识别过程的视觉反馈' },
    { name: '特征框渐现', purpose: '检测到特征时的出现动画' },
    { name: '页面推入', purpose: '导航切换的空间关系' },
    { name: '底部弹起', purpose: 'Bottom Sheet 的进入动效' },
    { name: '墨晕扩散', purpose: '点击反馈的材质表现' },
    { name: '标签依次出现', purpose: '识别特征标签的序列动效' },
    { name: '按钮按压', purpose: '操作确认的即时反馈' },
    { name: '卡片出场', purpose: '列表元素的内容出现' },
    { name: '置信度填充', purpose: '结果页置信度的进度动画' },
    { name: '快门按下', purpose: '拍照动作的操作确认' },
    { name: 'Toast 弹出', purpose: '轻量提示的状态反馈' },
  ],
};

// 将数据挂到 window
Object.assign(window, {
  EDITION_TYPES,
  FEATURE_TYPES,
  DYNASTIES,
  SAMPLE_ARCHIVES,
  KNOWLEDGE_ITEMS,
  API_ENDPOINTS,
  DESIGN_SPECS,
});
