/* ============================================
   金鱼品种数据
   含 11 个真实品种，含朝代、变异特征、形态描述
   谱系结构：野生鲫鱼 → 草金 → 文鱼 → 各品系分化
   ============================================ */

window.GOLDFISH_DATA = {
  // 品种列表（含祖先关系）
  varieties: [
    {
      id: 'crucian',
      name: '野生鲫鱼',
      latin: 'Carassius auratus',
      era: '宋代以前',
      dynasty: 'ancient',
      color: '银灰',
      bodyType: '纺锤形（侧扁）',
      tailType: '单尾（普通尾）',
      eyeType: '正常眼',
      scaleType: '普通鳞',
      headType: '正常头',
      ancestor: null, // 无祖先，为根节点
      description: '金鱼的原始祖先。野生鲫鱼体呈银灰色，纺锤形，侧扁，栖息于淡水水域中下层。性情温和，适应性强。金鱼即由野生鲫鱼经千年人工选育变异而来，所有品种均源自同一物种 Carassius auratus。',
      variantFeatures: [],
      // 鱼形参数（用于绘制 SVG 剪影）
      fishShape: {
        bodyLength: 100,
        bodyHeight: 30,
        tailType: 'single', // single/double/fan/butterfly
        tailSize: 25,
        eyeSize: 5,
        eyeBubble: 0,
        headGrowth: 0, // 0-1
        pearlScales: false,
        dorsalFin: true,
        backCurve: 0.3, // 0-1
        bellyCurve: 0.4
      }
    },
    {
      id: 'grass',
      name: '草金',
      latin: 'Carassius auratus var. grass',
      era: '南宋',
      dynasty: 'song',
      color: '金红/橙黄',
      bodyType: '纺锤形',
      tailType: '单尾（长尾）',
      eyeType: '正常眼',
      scaleType: '普通鳞',
      headType: '正常头',
      ancestor: 'crucian',
      description: '金鱼最古老的变异类型，由野生鲫鱼体色突变为金红色而来。南宋时期已被广泛饲养于池沼之中，是所有金鱼品种的起点。草金体形修长，适应力极强，尾鳍飘逸，游动迅速。',
      variantFeatures: [
        { feature: '体色', ancestor: '银灰', variant: '金红/橙黄', note: '色素细胞变异' },
        { feature: '尾鳍', ancestor: '普通短尾', variant: '飘逸长尾', note: '尾鳍延长' }
      ],
      fishShape: {
        bodyLength: 100,
        bodyHeight: 28,
        tailType: 'single',
        tailSize: 40,
        eyeSize: 5,
        eyeBubble: 0,
        headGrowth: 0,
        pearlScales: false,
        dorsalFin: true,
        backCurve: 0.25,
        bellyCurve: 0.35
      }
    },
    {
      id: 'wen',
      name: '文鱼',
      latin: 'Carassius auratus var. wen',
      era: '明代',
      dynasty: 'ming',
      color: '红/白/红白',
      bodyType: '短身纺锤形',
      tailType: '双尾（四开尾）',
      eyeType: '正常眼',
      scaleType: '普通鳞',
      headType: '正常头',
      ancestor: 'grass',
      description: '明代盆养盛行后出现的重要变异品种。文鱼身体短圆，尾鳍分叉为四叶，是金鱼从"草种"向"文种"演化的关键品种。其名"文"取其尾鳍展开如"文"字之形。文种金鱼是后世多数名贵品种的基础。',
      variantFeatures: [
        { feature: '体形', ancestor: '修长纺锤形', variant: '短身圆胖', note: '体长缩短' },
        { feature: '尾鳍', ancestor: '单尾', variant: '四开双尾', note: '尾鳍分叉变异' },
        { feature: '体色', ancestor: '金红', variant: '红/白/多彩', note: '色彩分化' }
      ],
      fishShape: {
        bodyLength: 85,
        bodyHeight: 38,
        tailType: 'double',
        tailSize: 35,
        eyeSize: 5,
        eyeBubble: 0,
        headGrowth: 0,
        pearlScales: false,
        dorsalFin: true,
        backCurve: 0.4,
        bellyCurve: 0.5
      }
    },
    {
      id: 'dragon-eye',
      name: '龙睛',
      latin: 'Carassius auratus var. dragon-eye',
      era: '明代',
      dynasty: 'ming',
      color: '红/黑/红白/蓝',
      bodyType: '短身',
      tailType: '双尾（蝶尾型）',
      eyeType: '外凸龙眼',
      scaleType: '普通鳞',
      headType: '正常头',
      ancestor: 'wen',
      description: '因眼球向外突出如传说中的龙眼而得名，是明代出现的经典变异品种。龙睛眼球突出眼眶之外，形态各异，有算盘珠眼、牛犄角眼、葡萄眼等不同类型。色彩丰富，以墨龙睛最为名贵。',
      variantFeatures: [
        { feature: '眼部', ancestor: '正常眼', variant: '眼球外凸', note: '眼眶骨变异' },
        { feature: '尾鳍', ancestor: '普通双尾', variant: '宽大蝶尾', note: '尾鳍加宽' },
        { feature: '体色', ancestor: '红/白', variant: '多彩多色', note: '黑/蓝/紫等' }
      ],
      fishShape: {
        bodyLength: 80,
        bodyHeight: 36,
        tailType: 'butterfly',
        tailSize: 45,
        eyeSize: 9,
        eyeBubble: 0,
        headGrowth: 0,
        pearlScales: false,
        dorsalFin: true,
        backCurve: 0.35,
        bellyCurve: 0.5
      }
    },
    {
      id: 'bubble-eye',
      name: '水泡眼',
      latin: 'Carassius auratus var. bubble-eye',
      era: '清代',
      dynasty: 'qing',
      color: '红/白/红白花',
      bodyType: '短身卵圆形',
      tailType: '双尾',
      eyeType: '水泡眼',
      scaleType: '普通鳞',
      headType: '正常头',
      ancestor: 'wen',
      description: '清代培育出的名贵品种，眼眶下方生有两个半透明的充满淋巴液的水泡，游动时随水轻轻晃动，极为雅致。水泡眼通常无背鳍，身形圆润。饲养需精心，水泡一旦破损难以复原。',
      variantFeatures: [
        { feature: '眼部', ancestor: '正常眼', variant: '双水泡', note: '淋巴液囊变异' },
        { feature: '背鳍', ancestor: '有背鳍', variant: '无背鳍', note: '背鳍退化' },
        { feature: '体形', ancestor: '纺锤形', variant: '卵圆形', note: '体高增加' }
      ],
      fishShape: {
        bodyLength: 75,
        bodyHeight: 40,
        tailType: 'double',
        tailSize: 30,
        eyeSize: 5,
        eyeBubble: 14,
        headGrowth: 0,
        pearlScales: false,
        dorsalFin: false,
        backCurve: 0.5,
        bellyCurve: 0.6
      }
    },
    {
      id: 'pearl-scale',
      name: '珍珠鳞',
      latin: 'Carassius auratus var. pearl-scale',
      era: '清代',
      dynasty: 'qing',
      color: '红/白/五花',
      bodyType: '球形（圆胖）',
      tailType: '双尾（短小）',
      eyeType: '正常眼',
      scaleType: '珍珠鳞（外凸）',
      headType: '正常头',
      ancestor: 'wen',
      description: '以其鳞片如珍珠般粒粒凸起而得名，是清代出现的珍稀品种。珍珠鳞金鱼身体圆滚如球，每片鳞片中央向外凸起，钙质沉积形成半球形突起，在光线照射下闪闪发光，宛若珍珠镶嵌全身。',
      variantFeatures: [
        { feature: '鳞片', ancestor: '平鳞', variant: '珍珠凸起鳞', note: '鳞片钙化变异' },
        { feature: '体形', ancestor: '纺锤形', variant: '球形', note: '体高显著增加' },
        { feature: '尾鳍', ancestor: '长尾', variant: '短小尾', note: '尾鳍缩短' }
      ],
      fishShape: {
        bodyLength: 70,
        bodyHeight: 48,
        tailType: 'fan',
        tailSize: 22,
        eyeSize: 5,
        eyeBubble: 0,
        headGrowth: 0,
        pearlScales: true,
        dorsalFin: true,
        backCurve: 0.6,
        bellyCurve: 0.7
      }
    },
    {
      id: 'lion-head',
      name: '狮头',
      latin: 'Carassius auratus var. lion-head',
      era: '清代',
      dynasty: 'qing',
      color: '红/橙红/红白',
      bodyType: '短身卵圆',
      tailType: '双尾',
      eyeType: '正常眼',
      scaleType: '普通鳞',
      headType: '头瘤（肉瘤）',
      ancestor: 'wen',
      description: '头顶及两颊生有发达的肉瘤，状如雄狮之头而得名，是清代培育的经典品种。头瘤由无数小突起组成，质地柔软，随年龄增长愈发丰满。优质狮头肉瘤饱满方正，眼嘴陷入瘤中，只露一面。',
      variantFeatures: [
        { feature: '头部', ancestor: '光滑头', variant: '肉瘤覆盖', note: '上皮组织增生' },
        { feature: '背鳍', ancestor: '有背鳍', variant: '无背鳍', note: '背鳍退化（高头有，狮头无）' },
        { feature: '体形', ancestor: '纺锤形', variant: '短身卵圆', note: '体幅加宽' }
      ],
      fishShape: {
        bodyLength: 78,
        bodyHeight: 42,
        tailType: 'double',
        tailSize: 28,
        eyeSize: 5,
        eyeBubble: 0,
        headGrowth: 0.9,
        pearlScales: false,
        dorsalFin: false,
        backCurve: 0.5,
        bellyCurve: 0.55
      }
    },
    {
      id: 'butterfly-tail',
      name: '蝶尾',
      latin: 'Carassius auratus var. butterfly-tail',
      era: '清代',
      dynasty: 'qing',
      color: '红/黑白/五花',
      bodyType: '短身',
      tail鳍: '蝶形尾（展开如蝶）',
      tailType: 'butterfly',
      eyeType: '正常眼（部分龙睛）',
      scaleType: '普通鳞',
      headType: '正常头',
      ancestor: 'dragon-eye',
      description: '尾鳍向左右平展如蝴蝶展翅，俯视角度下尤为美丽，是清代观赏金鱼的精品。蝶尾金鱼的尾鳍宽大舒展，边缘呈圆弧状，静止时如蝶栖枝头，游动时似蝶舞翩跹。常与龙睛结合形成"蝶尾龙睛"。',
      variantFeatures: [
        { feature: '尾鳍', ancestor: '四开双尾', variant: '蝶形展尾', note: '尾鳍极度加宽' },
        { feature: '尾柄', ancestor: '较长', variant: '细短', note: '尾柄缩短支撑' },
        { feature: '游姿', ancestor: '灵动', variant: '优雅缓慢', note: '尾重增加' }
      ],
      fishShape: {
        bodyLength: 72,
        bodyHeight: 38,
        tailType: 'butterfly',
        tailSize: 55,
        eyeSize: 6,
        eyeBubble: 0,
        headGrowth: 0,
        pearlScales: false,
        dorsalFin: true,
        backCurve: 0.35,
        bellyCurve: 0.5
      }
    },
    {
      id: 'ryukin',
      name: '琉金',
      latin: 'Carassius auratus var. ryukin',
      era: '明代（琉球传入）',
      dynasty: 'ming',
      color: '红/红白/白',
      bodyType: '圆短（背高）',
      tailType: '三尾/四尾',
      eyeType: '正常眼',
      scaleType: '普通鳞',
      headType: '正常头',
      ancestor: 'wen',
      description: '原产中国，经琉球群岛传入日本后培育定型，故曰"琉金"。其特征为背部高耸呈弧形，腹部圆润，头小而尖，整体近三角形。琉金是侧视观赏的代表品种，背峰高耸者为上品，姿态端庄。',
      variantFeatures: [
        { feature: '背型', ancestor: '平缓背弧', variant: '高耸驼峰', note: '背椎弯曲变异' },
        { feature: '头型', ancestor: '圆头', variant: '尖头三角形', note: '头长缩短' },
        { feature: '体形', ancestor: '卵圆形', variant: '三角近圆', note: '体高体宽皆增' }
      ],
      fishShape: {
        bodyLength: 75,
        bodyHeight: 50,
        tailType: 'double',
        tailSize: 32,
        eyeSize: 5,
        eyeBubble: 0,
        headGrowth: 0,
        pearlScales: false,
        dorsalFin: true,
        backCurve: 0.7,
        bellyCurve: 0.6
      }
    },
    {
      id: 'celestial',
      name: '朝天眼',
      latin: 'Carassius auratus var. celestial',
      era: '清代',
      dynasty: 'qing',
      color: '红/橙/白',
      bodyType: '短身蛋形',
      tailType: '双尾（短小）',
      eyeType: '朝天眼（翻转向天）',
      scaleType: '普通鳞',
      headType: '正常头',
      ancestor: 'dragon-eye',
      description: '又名"望天眼"，眼球向上翻转 90 度，瞳孔朝天，是清代出现的奇特品种。相传此鱼为宫廷所好，取"仰望天恩"之意。朝天眼通常无背鳍，身形圆短如蛋。因视线受限，游动姿态格外温文尔雅。',
      variantFeatures: [
        { feature: '眼部', ancestor: '外凸龙眼', variant: '翻转向天', note: '眼眶旋转 90°' },
        { feature: '背鳍', ancestor: '有背鳍', variant: '无背鳍', note: '背鳍退化' },
        { feature: '游姿', ancestor: '活泼', variant: '缓慢优雅', note: '视力受限' }
      ],
      fishShape: {
        bodyLength: 72,
        bodyHeight: 38,
        tailType: 'double',
        tailSize: 25,
        eyeSize: 8,
        eyeBubble: 0,
        headGrowth: 0,
        pearlScales: false,
        dorsalFin: false,
        backCurve: 0.45,
        bellyCurve: 0.55
      }
    },
    {
      id: 'pom-pom',
      name: '绒球',
      latin: 'Carassius auratus var. pom-pom',
      era: '清代',
      dynasty: 'qing',
      color: '红/橙/白/蓝',
      bodyType: '短身蛋形',
      tailType: '双尾',
      eyeType: '正常眼',
      scaleType: '普通鳞',
      headType: '鼻孔膜变异（绒球）',
      ancestor: 'wen',
      description: '鼻孔膜变异形成两枚肉球状绒团，位于吻端，状如绣球而得名。绒球金鱼的绒球肉质柔软，左右各一，大小对称者为上品。游动时绒球随水摆动，憨态可掬，是清代培育的趣味品种。',
      variantFeatures: [
        { feature: '鼻孔', ancestor: '正常鼻孔', variant: '绒球状变异', note: '鼻瓣组织增生' },
        { feature: '背鳍', ancestor: '有背鳍', variant: '蛋种无鳍', note: '背鳍退化' },
        { feature: '体形', ancestor: '纺锤形', variant: '蛋形', note: '体短而圆' }
      ],
      fishShape: {
        bodyLength: 76,
        bodyHeight: 38,
        tailType: 'double',
        tailSize: 28,
        eyeSize: 5,
        eyeBubble: 0,
        headGrowth: 0,
        pearlScales: false,
        dorsalFin: false,
        backCurve: 0.4,
        bellyCurve: 0.55
      }
    }
  ],

  // 朝代信息
  dynasties: {
    ancient: { name: '远古', label: '野生时代', percent: 0 },
    song: { name: '宋代', label: '初入池沼', percent: 20, years: '960-1279' },
    ming: { name: '明代', label: '盆养盛行', percent: 45, years: '1368-1644' },
    qing: { name: '清代', label: '百品争奇', percent: 75, years: '1644-1912' },
    modern: { name: '当代', label: '谱系大成', percent: 95, years: '1912-今' }
  },

  // 谱系树布局配置
  treeLayout: {
    // 按朝代分层，Y 轴位置由朝代决定
    // X 轴位置由品系分支决定
    layerY: {
      ancient: 0.88,  // 底部（根部）
      song: 0.72,
      ming: 0.52,
      qing: 0.30,
      modern: 0.12    // 顶部（枝梢）
    }
  }
};
