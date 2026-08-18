// 昆虫数据：6 种真实鸣虫
// 包含学名、鸣声特征、出现时段、形态特征等

const INSECTS = [
  {
    id: 'cricket',
    name: '蟋蟀',
    sciName: 'Gryllus chinensis',
    commonName: '蛐蛐',
    image: '/spark/app/app_17cctc5yr7y/runtime/api/v1/storage/object/bucket_aadkqsy2xveao_static/static%2Faadkqsiif4sgo_ve_miaoda',
    soundFeature: '清脆连续的「蛐蛐蛐」声，节奏均匀',
    soundDesc: '雄虫通过前翅摩擦发声，鸣声响亮清脆，常以 3-5 声为一组，间隔均匀，夜间最为活跃。',
    activeTime: '20:00 - 02:00',
    activeHours: [20, 21, 22, 23, 0, 1, 2],
    habitat: '草地、石缝、瓦砾下',
    season: '夏末至初秋',
    bodyLength: '约 20mm',
    description: '蟋蟀属直翅目蟋蟀科，是中国最常见的鸣虫之一。雄虫善鸣好斗，自古即为民间博戏的主角。鸣声随温度升高而加快，故有「虫鸣测温度」之说。',
    coloration: '体黑褐色，头部圆阔，触角细长丝状',
    diet: '杂食，以植物嫩芽、种子、小昆虫为食',
    distribution: '全国大部分地区均有分布',
    culturalNote: '蟋蟀在中国文化中历史悠久，《诗经》即有记载，唐宋以后斗蟋蟀之风盛行，被誉为「秋兴」之乐。'
  },
  {
    id: 'oilgourd',
    name: '油葫芦',
    sciName: 'Teleogryllus mitratus',
    commonName: '北方油葫芦',
    image: '/spark/app/app_17cctc5yr7y/runtime/api/v1/storage/object/bucket_aadkqsy2xveao_static/static%2Faadkqsfavbkeo_ve_miaoda',
    soundFeature: '低沉婉转的「呦呦呦」，如歌如诉',
    soundDesc: '鸣声悠扬婉转，如泣如诉，音量大且具有穿透力。常常先发出几声引子，随后转入连续的颤音，夜间聆听格外动人。',
    activeTime: '21:00 - 03:00',
    activeHours: [21, 22, 23, 0, 1, 2, 3],
    habitat: '田野、庭院、草丛',
    season: '夏末至秋',
    bodyLength: '约 22-28mm',
    description: '油葫芦体型较蟋蟀粗壮，通体乌黑油亮，因其形似油葫芦而得名。鸣声悠扬，被视为鸣虫中的「歌唱家」，广受鸣虫爱好者喜爱。',
    coloration: '体黑色有光泽，前胸背板有月牙形斑纹',
    diet: '植食为主，亦食其他昆虫',
    distribution: '北方为主，全国均有',
    culturalNote: '油葫芦因鸣声悠扬动听，常被作为鸣虫饲养，与蟋蟀、蝈蝈并称「三大鸣虫」。'
  },
  {
    id: 'katydid',
    name: '蝈蝈',
    sciName: 'Gampsocleis gratiosa',
    commonName: '叫哥哥',
    image: '/spark/app/app_17cctc5yr7y/runtime/api/v1/storage/object/bucket_aadkqsy2xveao_static/static%2Faadkqswdlnwfq_ve_miaoda',
    soundFeature: '洪亮急促的「蝈蝈蝈」，节奏明快',
    soundDesc: '鸣声极为洪亮，具有金属般的质感，「聒聒」声连续不断。白天也会鸣叫，但夜间鸣声更为深沉有力，是夏夜里最响亮的歌者。',
    activeTime: '18:00 - 24:00',
    activeHours: [18, 19, 20, 21, 22, 23, 0],
    habitat: '灌木、草丛、豆田',
    season: '盛夏至初秋',
    bodyLength: '约 35-45mm',
    description: '蝈蝈属于螽斯科，是大型鸣虫。雄虫前翅互相摩擦能发出响亮的声音。强健的后腿善于跳跃，触角长于体躯。',
    coloration: '翠绿色或褐绿色，体躯粗壮',
    diet: '肉食兼植食，捕食其他昆虫',
    distribution: '北方居多，尤以京津冀地区饲养传统深厚',
    culturalNote: '蝈蝈饲养历史已有数百年，清代宫廷与民间皆盛。冬季将蝈蝈养于葫芦中揣在怀内，听虫鸣赏冬景，是老北京一景。'
  },
  {
    id: 'meadowkatydid',
    name: '纺织娘',
    sciName: 'Mecopoda elongata',
    commonName: '络纬娘',
    image: '/spark/app/app_17cctc5yr7y/runtime/api/v1/storage/object/bucket_aadkqsy2xveao_static/static%2Faadkqsizoyqai_ve_miaoda',
    soundFeature: '「轧织轧织」似纺纱之声',
    soundDesc: '鸣声如纺车转动，「沙沙轧织」连绵不绝。前半段轻柔，后半段音量加大，如织娘彻夜纺织，其名亦由此而来。',
    activeTime: '22:00 - 04:00',
    activeHours: [22, 23, 0, 1, 2, 3, 4],
    habitat: '灌木丛、瓜棚、篱笆',
    season: '夏秋之交',
    bodyLength: '约 50-70mm',
    description: '纺织娘是螽斯科中体型较大的种类，体形似豆荚，前翅狭长如叶。跳跃能力强，善于伪装。鸣声独特，如纺纱织布之声。',
    coloration: '绿色或褐色，前翅有网状脉纹如叶',
    diet: '植食，喜食南瓜花、丝瓜花瓣',
    distribution: '江南、华南地区常见',
    culturalNote: '纺织娘古称「莎鸡」，《诗经·七月》有「六月莎鸡振羽」之句。因其鸣声如织，常引发闺中思妇之感，古诗词中多有吟咏。'
  },
  {
    id: 'bellcricket',
    name: '金钟儿',
    sciName: 'Homoeogryllus japonicus',
    commonName: '马铃',
    image: '/spark/app/app_17cctc5yr7y/runtime/api/v1/storage/object/bucket_aadkqsy2xveao_static/static%2Faadkqsnqb2gdq_ve_miaoda',
    soundFeature: '「叮铃叮铃」如铜钟轻鸣',
    soundDesc: '鸣声清越如铃，「叮铃叮铃」连续不断，声虽不高却有悠远之感。因其声音清脆悦耳，被誉为「鸣虫之皇后」。',
    activeTime: '20:00 - 01:00',
    activeHours: [20, 21, 22, 23, 0, 1],
    habitat: '草丛、落叶层、阴湿处',
    season: '夏末至秋',
    bodyLength: '约 15-18mm',
    description: '金钟儿体型小巧，体躯宽扁呈卵圆形，如一口小钟。通体黑色有光泽，触角极长。鸣声清脆如铃，是传统鸣虫中的珍品。',
    coloration: '体黑色有光泽，前胸背板呈马鞍形',
    diet: '植食，以植物嫩芽和腐烂果实为食',
    distribution: '南方各省，长江流域尤多',
    culturalNote: '金钟儿因鸣声清越，自古备受文人雅士喜爱，常被畜养于精致的虫盒中，置于案头夜听。'
  },
  {
    id: 'bamboocricket',
    name: '竹蛉',
    sciName: 'Oecanthus indicus',
    commonName: '印度树蟋',
    image: '/spark/app/app_17cctc5yr7y/runtime/api/v1/storage/object/bucket_aadkqsy2xveao_static/static%2Faadkqsjcb44dq_ve_miaoda',
    soundFeature: '「句句句」清脆如击竹',
    soundDesc: '鸣声极为清亮，「句句句」三声一组，节奏分明。声音穿透力强，夜间远远传来如敲竹之声，纤细而高扬。',
    activeTime: '19:00 - 23:00',
    activeHours: [19, 20, 21, 22, 23],
    habitat: '竹林、果树、灌木丛',
    season: '夏秋',
    bodyLength: '约 12-15mm',
    description: '竹蛉又名树蟋，体型纤细，通体浅绿色或嫩绿色，生活于竹树丛中。身体薄如叶片，鸣声却出乎意料地响亮。',
    coloration: '嫩绿色，体细长柔软，前翅薄而透明',
    diet: '植食，以植物嫩叶和蚜虫为食',
    distribution: '南方地区，竹林中常见',
    culturalNote: '竹蛉以清雅的鸣声著称，养蛉人常以竹筒或葫芦畜养，挂于檐下，夜听蛉声，是夏夜清赏的雅事。'
  }
];

// 根据当前时间返回当前活跃的鸣虫列表
function getActiveInsects() {
  const now = new Date();
  const hour = now.getHours();
  return INSECTS.filter(insect => insect.activeHours.includes(hour));
}

// 根据 id 查找昆虫
function getInsectById(id) {
  return INSECTS.find(i => i.id === id);
}

// 模拟识别：基于给定的 id 生成匹配结果
function simulateRecognition(targetId) {
  const primary = getInsectById(targetId);
  const others = INSECTS.filter(i => i.id !== targetId);
  
  // 随机选 2 个作为备选
  const shuffled = others.sort(() => Math.random() - 0.5);
  const alt1 = shuffled[0];
  const alt2 = shuffled[1];
  
  // 主匹配相似度 78-95
  const primaryScore = Math.floor(Math.random() * 18) + 78;
  // 备选 45-70
  const alt1Score = Math.floor(Math.random() * 25) + 45;
  const alt2Score = Math.floor(Math.random() * 20) + 35;
  
  return {
    primary: { ...primary, similarity: primaryScore },
    alternatives: [
      { ...alt1, similarity: alt1Score },
      { ...alt2, similarity: alt2Score }
    ]
  };
}

window.INSECTS = INSECTS;
window.getActiveInsects = getActiveInsects;
window.getInsectById = getInsectById;
window.simulateRecognition = simulateRecognition;
