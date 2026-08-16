// Kintsugi 金缮笔记 — 数据模块
// 器物修复档案、时间轴条目、设计 token、API 契约

const KIN_DATA = {
  relics: [
    {
      id: 'r1',
      name: '青瓷茶碗',
      furigana: 'せいじ ちゃわん',
      origin: '南宋 · 龙泉窑',
      material: '青釉瓷',
      crackedAt: '2024-03-12',
      startedAt: '2024-03-18',
      progress: 68,
      stage: 'middle', // early / middle / final
      crackCount: 5,
      fragments: 3,
      image: 'celadon',
      description: '器身三道主纹，口沿一处小崩。茶碗内壁留有经年茶渍，釉色温润如青玉。',
      emotion: '摔碎那天沉默了很久。后来决定，让裂痕成为它新的年轮。',
    },
    {
      id: 'r2',
      name: '萩烧徳利',
      furigana: 'はぎやき とっくり',
      origin: '江户晚期 · 萩藩窑',
      material: '软质陶',
      crackedAt: '2024-01-05',
      startedAt: '2024-01-20',
      progress: 92,
      stage: 'final',
      crackCount: 3,
      fragments: 2,
      image: 'hagi',
      description: '酒器德利，腹部一道横贯细纹，底足崩缺。萩烧特有火色窑变，胎土温润。',
      emotion: '祖父留下的德利。金缮完成那天，用它温了一杯清酒。',
    },
    {
      id: 'r3',
      name: '九谷焼皿',
      furigana: 'くたにやき ざら',
      origin: '明治期 · 加贺九谷',
      material: '彩绘瓷',
      crackedAt: '2024-05-30',
      startedAt: '2024-06-10',
      progress: 35,
      stage: 'early',
      crackCount: 7,
      fragments: 4,
      image: 'kutani',
      description: '圆形小皿，金襕手纹饰。盘缘四裂，中心一处网状细裂纹。彩绘繁复，修复时需保护色层。',
      emotion: '从外祖母的抽屉里翻出来的。碎成四片，仍舍不得扔。',
    },
    {
      id: 'r4',
      name: '備前焼宝瓶',
      furigana: 'びぜんやき ほうへい',
      origin: '大正期 · 冈山备前',
      material: '炻器',
      crackedAt: '2023-11-22',
      startedAt: '2023-12-01',
      progress: 100,
      stage: 'done',
      crackCount: 2,
      fragments: 2,
      image: 'bizen',
      description: '手捏宝瓶，盖沿一处横裂，肩部芝麻釉窑变。修复后使用如常，金线愈养愈亮。',
      emotion: '每天泡茶都用它。金线成了老朋友。',
    },
  ],

  // 时间轴日志（按器物）
  logs: {
    r1: [
      { date: '2024-03-18', title: '粘接第一道主纹', detail: '使用小麦糊与生漆调合，对合最大的一道裂纹。固定 72 小时。', type: 'join' },
      { date: '2024-03-25', title: '第二、三道裂纹接合', detail: '依次粘接剩余裂纹。注意错位，用橡皮筋固定。', type: 'join' },
      { date: '2024-04-02', title: '下地漆（パテ）填补', detail: '用刻刀修整不齐处，漆灰填补缝隙，打磨平整。', type: 'fill' },
      { date: '2024-04-10', title: '髹漆 · 朱漆下涂', detail: '沿裂纹施朱漆，作为金地的下地。阴干三日。', type: 'urushi' },
      { date: '2024-04-18', title: '毛描き · 漆线描绘', detail: '以细笔在裂纹上沿描金漆，准备最终金粉附着。', type: 'line' },
      { date: '2024-04-25', title: '研ぎ出し', detail: '金粉将附着处打磨，露出平滑金线。（进行中）', type: 'polish' },
    ],
    r2: [
      { date: '2024-01-20', title: '碎片对齐与清洗', detail: '两块碎片对齐，酒精清除旧胶。', type: 'join' },
      { date: '2024-01-28', title: '生漆粘接', detail: '生漆粘接，麻绳捆缚固定。', type: 'join' },
      { date: '2024-02-10', title: '地の粉 · 漆灰填补', detail: '底足崩缺处以漆灰塑形。', type: 'fill' },
      { date: '2024-02-22', title: '朱漆下涂', detail: '三道下涂，逐次打磨。', type: 'urushi' },
      { date: '2024-03-05', title: '飴色漆上涂', detail: '用飴色漆做面涂，为金粉增加深度。', type: 'urushi' },
      { date: '2024-03-15', title: '撒金 · 本金粉', detail: '用竹管吹撒本金消粉，细笔扫去多余。', type: 'gold' },
      { date: '2024-03-28', title: '最終研ぎ', detail: '炭研打磨金线，使之温润有光。', type: 'polish' },
    ],
    r3: [
      { date: '2024-06-10', title: '碎片清点与编号', detail: '共四片主要碎片，若干细小残渣。拍照记录。', type: 'join' },
      { date: '2024-06-17', title: '大碎片粘接', detail: '先粘接最大两片，作为基础。', type: 'join' },
      { date: '2024-06-24', title: '网状裂纹处理', detail: '中心网状细裂纹注入稀释漆液。', type: 'fill' },
    ],
    r4: [
      { date: '2023-12-01', title: '清洗与评估', detail: '盖沿横裂一处，胎土坚实。', type: 'join' },
      { date: '2023-12-08', title: '生漆粘接', detail: '对齐后纸绳固定。', type: 'join' },
      { date: '2023-12-20', title: '錆漆下地', detail: '錆漆填补缝隙，干燥后打磨。', type: 'fill' },
      { date: '2024-01-05', title: '金粉仕上げ', detail: '本金消粉仕上，炭研打磨。', type: 'gold' },
      { date: '2024-01-15', title: '完成', detail: '日常使用中，金线渐养渐润。', type: 'done' },
    ],
  },

  // 设计规范 token
  tokens: {
    colors: [
      { name: 'Urushi 漆黒', hex: '#0E0E10', role: '背景 / 基底' },
      { name: 'Urushi 深', hex: '#18171a', role: '次级背景' },
      { name: 'Kin 金', hex: '#D4A017', role: '强调色 / 金线' },
      { name: 'Kin 金（深）', hex: '#8a6808', role: '金线下地' },
      { name: 'Gofun 胡粉', hex: '#F5F0E6', role: '文字 / 卡片' },
      { name: 'Gofun 鈍', hex: '#e6e1d6', role: '次级文字' },
      { name: 'Beni 朱', hex: '#b2422a', role: '警示 / 朱漆' },
      { name: 'Sabi 錆', hex: '#6e6658', role: '辅助说明' },
    ],
    fonts: [
      { name: 'Shippori Mincho', usage: '展示字体 / 标题 / 金缮签名', weights: '400, 700, 900' },
      { name: 'Noto Serif JP', usage: '器物名称 / 日文注', weights: '300, 500, 700' },
      { name: 'Noto Sans JP', usage: '正文 / UI 文字', weights: '300, 400, 500, 700' },
    ],
    spacing: ['4px', '8px', '12px', '16px', '24px', '32px', '48px', '64px'],
    radius: ['0px', '4px', '8px', '16px', '24px', '999px'],
    effects: [
      { name: 'Glow · 金', desc: 'box-shadow 0 0 20px rgba(212,160,23,0.5)' },
      { name: 'Paper · 纸纹', desc: 'background 胡粉白 + 细微颗粒噪点' },
      { name: 'Stroke · 描金', desc: '1px 金线 + 外发光' },
      { name: 'Ripple · 漆波', desc: '点击扩散金色涟漪，500ms 消散' },
    ],
  },

  // REST API 契约
  apis: [
    {
      method: 'GET',
      path: '/api/v1/relics',
      summary: '获取器物列表',
      params: [
        { name: 'status', type: 'enum', desc: 'all / repairing / done', required: false },
        { name: 'page', type: 'number', desc: '页码，默认 1', required: false },
        { name: 'limit', type: 'number', desc: '每页数量，默认 20', required: false },
      ],
      response: `{
  "items": [
    {
      "id": "r1",
      "name": "青瓷茶碗",
      "origin": "南宋 · 龙泉窑",
      "progress": 68,
      "stage": "middle",
      "crackCount": 5,
      "startedAt": "2024-03-18"
    }
  ],
  "total": 4
}`,
    },
    {
      method: 'POST',
      path: '/api/v1/relics',
      summary: '创建修复档案',
      params: [],
      request: `{
  "name": "string",
  "origin": "string",
  "material": "string",
  "crackedAt": "ISO date",
  "description": "string",
  "emotion": "string",
  "fragments": number
}`,
      response: `{ "id": "r5", "createdAt": "ISO date" }`,
    },
    {
      method: 'GET',
      path: '/api/v1/relics/:id',
      summary: '获取器物详情',
      params: [{ name: 'id', type: 'string', desc: '器物 ID', required: true }],
      response: `{
  "id": "r1",
  "name": "青瓷茶碗",
  "origin": "南宋 · 龙泉窑",
  "material": "青釉瓷",
  "progress": 68,
  "stage": "middle",
  "crackCount": 5,
  "logs": [ ... ]
}`,
    },
    {
      method: 'GET',
      path: '/api/v1/relics/:id/logs',
      summary: '获取修复日志时间轴',
      params: [{ name: 'id', type: 'string', desc: '器物 ID', required: true }],
      response: `{
  "items": [
    {
      "date": "2024-03-18",
      "title": "粘接第一道主纹",
      "detail": "...",
      "type": "join"
    }
  ]
}`,
    },
    {
      method: 'POST',
      path: '/api/v1/relics/:id/logs',
      summary: '追加修复日志',
      params: [],
      request: `{
  "title": "string",
  "detail": "string",
  "type": "join | fill | urushi | gold | polish | done"
}`,
      response: `{ "id": "log_xxx", "createdAt": "ISO date" }`,
    },
  ],
};

// 裂纹 SVG 路径（示意性，不同器物有不同裂纹形态）
const CRACK_PATHS = {
  r1: [
    // 青瓷茶碗：3 道主纹 + 2 道支纹
    'M20,180 L80,120 L140,160 L200,100 L260,140 L320,90',
    'M60,260 L120,200 L180,240',
    'M220,280 L280,220 L340,260',
    'M140,160 L160,210',
    'M260,140 L240,190',
  ],
  r2: [
    // 萩烧徳利：1 道横贯
    'M20,180 L360,170',
    'M120,180 L150,230 L200,200',
    'M280,175 L300,220',
  ],
  r3: [
    // 九谷焼皿：4 道中心放射
    'M190,190 L60,120',
    'M190,190 L80,280',
    'M190,190 L320,110',
    'M190,190 L340,290',
    'M190,190 L140,240 L100,260',
    'M190,190 L260,230 L300,260',
    'M190,190 L200,140 L230,110',
  ],
  r4: [
    // 備前焼宝瓶：一道
    'M40,170 L180,190 L340,160',
    'M180,190 L200,240',
  ],
};

Object.assign(window, { KIN_DATA, CRACK_PATHS });
