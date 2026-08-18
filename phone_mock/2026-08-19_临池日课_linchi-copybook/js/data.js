// 临池日课 - 数据层
// 碑帖内容均来自真实传世名作

window.LINCHI_DATA = (function () {
  // 碑帖库（真实）
  const steles = [
    {
      id: 'lanting',
      name: '兰亭序',
      author: '王羲之',
      dynasty: '东晋',
      desc: '被誉为"天下第一行书"，王羲之酒后挥毫所作，二十八行三百二十四字，笔法变化万千，同字异形处甚多。',
      characters: [
        { char: '永', meaning: '永久、长远', note: '王羲之《兰亭序》开篇首字，点画俱全，为"永字八法"所本。' },
        { char: '之', meaning: '助词，往', note: '《兰亭序》中"之"字凡二十余见，各有姿态，无一雷同。' },
        { char: '蘭', meaning: '兰花', note: '繁体"蘭"，草字头下"阑"，结构繁复，最见行笔功力。' },
        { char: '亭', meaning: '亭子', note: '宝盖头下"丁"，上密下疏，重心要稳。' },
        { char: '世', meaning: '世代、世间', note: '三横一竖折，横画间距需匀称。' },
      ],
    },
    {
      id: 'jiucheng',
      name: '九成宫醴泉铭',
      author: '欧阳询',
      dynasty: '唐',
      desc: '欧阳询晚年奉诏所书，楷书极则。结构险峻而不失稳正，法度森严，号称"天下第一楷书"。',
      characters: [
        { char: '九', meaning: '数名', note: '撇画舒展，横折弯钩要见力度，是欧体险绝的典型。' },
        { char: '成', meaning: '完成、成就', note: '戈钩是此字难点，需挺拔而有弹性。' },
        { char: '宫', meaning: '宫殿', note: '宝盖头宽窄得宜，两口上下呼应。' },
        { char: '泉', meaning: '泉水', note: '白字底加水，上下结构，上收下放。' },
        { char: '醴', meaning: '甜酒、甘泉', note: '酉字旁加豊，左右结构，笔画繁多需匀称。' },
      ],
    },
    {
      id: 'duobaota',
      name: '多宝塔碑',
      author: '颜真卿',
      dynasty: '唐',
      desc: '颜真卿中年所书，结字严密，点画规整，是颜体入门佳帖。端庄秀丽，法度整肃。',
      characters: [
        { char: '多', meaning: '众多', note: '两个"夕"字相叠，上小下大，重心略偏右。' },
        { char: '寶', meaning: '宝物', note: '繁体寶，宝盖头下"玉"，结构饱满，颜体浑厚之代表。' },
        { char: '塔', meaning: '佛塔', note: '土字旁加"荅"，左窄右宽，横画间距均匀。' },
        { char: '碑', meaning: '石碑', note: '石字旁加"卑"，左收右放，撇画舒展。' },
        { char: '萬', meaning: '数目，万', note: '繁体萬，草字头下"禺"，结构繁复需穿插得当。' },
      ],
    },
  ];

  // 设计规范
  const designSpec = {
    meta: [
      { label: '产品名称', value: '临池日课' },
      { label: '形态', value: '原生 App' },
      { label: '适用平台', value: 'iOS / Android' },
      { label: '设计尺寸', value: '390 × 844 (iPhone 13)' },
      { label: '版本', value: 'v1.0.0' },
    ],
    colors: [
      { name: '碑拓深炭', value: '#1a1714', role: '主背景 / 墨色' },
      { name: '拓白', value: '#ece5d8', role: '主文字 / 碑刻白' },
      { name: '赭石', value: '#b06a3b', role: '强调色 / 印章红' },
      { name: '宣纸米白', value: '#f2ead8', role: '卡片底 / 书写纸面' },
      { name: '墨灰', value: '#5a5249', role: '次级文字 / 分割线' },
      { name: '浅拓', value: '#c8c0b0', role: '辅助文字 / 占位' },
      { name: '赭石暗', value: '#8c5128', role: '按钮按下 / 激活态' },
    ],
    fonts: [
      { name: '展示字体', value: '"Ma Shan Zheng", "ZCOOL XiaoWei", serif', desc: '用于标题、碑帖名，呼应书法气质' },
      { name: '正文字体', value: '"Source Han Serif SC", "Noto Serif SC", serif', desc: '用于正文、说明文字' },
      { name: '功能字体', value: '"SF Pro Text", "PingFang SC", -apple-system, sans-serif', desc: '用于 Tab、按钮标签、数据数字' },
    ],
    spacing: [
      { name: 'xs', value: '4px' },
      { name: 's', value: '8px' },
      { name: 'm', value: '16px' },
      { name: 'l', value: '24px' },
      { name: 'xl', value: '32px' },
    ],
    radii: [
      { name: '小卡片', value: '12px' },
      { name: '卡片', value: '16px' },
      { name: '大卡片', value: '24px' },
      { name: '全屏弹层', value: '32px 32px 0 0' },
    ],
    components: ['大字符展示卡', '日课 Streak 卡', '碑帖列表项', '书写画布', '叠影滑杆', '集字格', '底部 TabBar', '顶部导航栏'],
    motionPrinciples: [
      '墨色晕染：颜色变化用 ease-out，模拟墨落纸上的扩散',
      '笔触回放：书写顺序按笔顺，速度有快慢变化',
      '纸张翻页：页面转场用位移+轻微旋转，模拟翻纸',
      '叠影渐变：透明度滑杆变化线性平滑，无突兀跳变',
      '克制：动效服务功能反馈，不作装饰性炫技',
    ],
  };

  // 接口文档
  const apiDoc = [
    {
      group: '日课相关',
      apis: [
        {
          method: 'GET',
          path: '/api/daily/today',
          desc: '获取今日日课',
          request: '无参数',
          response: `{
  "date": "2026-08-19",
  "character": "永",
  "stele_id": "lanting",
  "stele_name": "兰亭序",
  "meaning": "永久、长远",
  "note": "王羲之《兰亭序》开篇首字...",
  "streak": 7,
  "completed": false
}`,
        },
        {
          method: 'POST',
          path: '/api/daily/submit',
          desc: '提交今日临写',
          request: `{
  "character": "永",
  "stele_id": "lanting",
  "stroke_data": [...],
  "image_data": "data:image/png;base64,..."
}`,
          response: `{
  "success": true,
  "score": 87,
  "details": {
    "structure": 85,
    "stroke": 90,
    "proportion": 86
  },
  "streak": 8
}`,
        },
      ],
    },
    {
      group: '碑帖库',
      apis: [
        {
          method: 'GET',
          path: '/api/steles',
          desc: '获取碑帖列表',
          request: '无参数',
          response: `{
  "list": [
    {
      "id": "lanting",
      "name": "兰亭序",
      "author": "王羲之",
      "dynasty": "东晋",
      "char_count": 324,
      "cover": "..."
    }
  ]
}`,
        },
        {
          method: 'GET',
          path: '/api/steles/:id/characters',
          desc: '获取碑帖单字列表',
          request: '路径参数: id - 碑帖 ID',
          response: `{
  "stele_id": "lanting",
  "characters": [
    { "char": "永", "meaning": "永久", "note": "..." },
    ...
  ]
}`,
        },
      ],
    },
    {
      group: '集字墙',
      apis: [
        {
          method: 'GET',
          path: '/api/collection',
          desc: '获取用户集字墙',
          request: '无参数',
          response: `{
  "total": 12,
  "by_stele": {
    "lanting": { "name": "兰亭序", "count": 5, "items": [...] },
    "jiucheng": { "name": "九成宫", "count": 4, "items": [...] },
    "duobaota": { "name": "多宝塔碑", "count": 3, "items": [...] }
  }
}`,
        },
        {
          method: 'POST',
          path: '/api/collection/add',
          desc: '收入集字墙',
          request: `{
  "character": "永",
  "stele_id": "lanting",
  "score": 87,
  "image_data": "..."
}`,
          response: `{ "success": true, "total": 13 }`,
        },
      ],
    },
    {
      group: '用户',
      apis: [
        {
          method: 'GET',
          path: '/api/user/profile',
          desc: '获取用户信息',
          request: '无参数',
          response: `{
  "id": "u_xxx",
  "nickname": "墨池闲人",
  "avatar": "...",
  "streak": 7,
  "total_chars": 12,
  "level": 3,
  "level_name": "临池初学"
}`,
        },
      ],
    },
  ];

  // 用户等级
  const levels = [
    { level: 1, name: '提笔初识', minChars: 0 },
    { level: 2, name: '点画初成', minChars: 5 },
    { level: 3, name: '临池初学', minChars: 12 },
    { level: 4, name: '笔砚生香', minChars: 25 },
    { level: 5, name: '入木三分', minChars: 50 },
    { level: 6, name: '力透纸背', minChars: 100 },
  ];

  function getLevel(totalChars) {
    let current = levels[0];
    for (const lv of levels) {
      if (totalChars >= lv.minChars) current = lv;
    }
    return current;
  }

  function getNextLevel(totalChars) {
    for (const lv of levels) {
      if (totalChars < lv.minChars) return lv;
    }
    return null;
  }

  return { steles, designSpec, apiDoc, levels, getLevel, getNextLevel };
})();
