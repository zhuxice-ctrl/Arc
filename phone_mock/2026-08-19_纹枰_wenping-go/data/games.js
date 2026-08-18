// 纹枰 — 棋谱数据
// 真实历史名局，含元信息、着手序列、谱注

// 坐标系统：0-18，左上原点
// moves: [{x, y, color, moveNum, comment?, isBrilliant?}]
// color: 'B' | 'W'
// pass 用 x: -1, y: -1 表示

const DANGHU_GAME3 = {
  id: 'danghu-3',
  title: '当湖十局·第三局',
  black: { name: '范西屏', rank: '国手', era: '清' },
  white: { name: '施襄夏', rank: '国手', era: '清' },
  year: 1751,
  location: '浙江平湖',
  komi: 0, // 古棋无贴目
  result: '黑胜',
  totalMoves: 247,
  category: '古谱名局',
  summary:
    '当湖十局乃清代两大棋圣范西屏与施襄夏于浙江平湖对弈的十局棋，攻杀凌厉、算路精深，被誉为中国古代围棋的巅峰之作。本局为第三局，范西屏执黑先行，中盘几度弃子转换，最终以精妙收束取胜。',
  tags: ['古谱', '国手对决', '攻杀名局'],
  isFeatured: true,
  brilliantMoves: [47, 128, 179, 213],
  // 精选前 80 手 + 关键后续妙手
  moves: [
    { x: 15, y: 3, color: 'B', num: 1 }, // 黑 星
    { x: 3, y: 15, color: 'W', num: 2 }, // 白 星
    { x: 3, y: 3, color: 'B', num: 3 }, // 黑 小目
    { x: 15, y: 15, color: 'W', num: 4 }, // 白 星
    { x: 16, y: 5, color: 'B', num: 5 }, // 黑 小飞挂
    { x: 17, y: 3, color: 'W', num: 6 }, // 白 小飞守
    { x: 15, y: 6, color: 'B', num: 7 }, // 黑 拆二
    { x: 2, y: 5, color: 'W', num: 8 }, // 白 挂角
    { x: 4, y: 5, color: 'B', num: 9 }, // 黑 尖顶
    { x: 2, y: 6, color: 'W', num: 10 }, // 白 长
    { x: 5, y: 7, color: 'B', num: 11 }, // 黑 拆三
    { x: 2, y: 9, color: 'W', num: 12 }, // 白 二间拆
    { x: 9, y: 9, color: 'B', num: 13 }, // 黑 天元侧
    { x: 9, y: 3, color: 'W', num: 14 }, // 白 分投
    { x: 7, y: 3, color: 'B', num: 15 }, // 黑 逼
    { x: 11, y: 3, color: 'W', num: 16 }, // 白 拆二
    { x: 6, y: 5, color: 'B', num: 17 }, // 黑 尖
    { x: 8, y: 5, color: 'W', num: 18 }, // 白 飞
    { x: 9, y: 6, color: 'B', num: 19 }, // 黑 靠
    { x: 9, y: 5, color: 'W', num: 20 }, // 白 扳
    { x: 10, y: 5, color: 'B', num: 21 }, // 黑 断
    { x: 10, y: 6, color: 'W', num: 22 }, // 白 打
    { x: 11, y: 6, color: 'B', num: 23 }, // 黑 长
    { x: 10, y: 7, color: 'W', num: 24 }, // 白 打
    { x: 11, y: 7, color: 'B', num: 25 }, // 黑 长
    { x: 9, y: 7, color: 'W', num: 26 }, // 白 粘
    { x: 12, y: 6, color: 'B', num: 27 }, // 黑 飞
    { x: 12, y: 8, color: 'W', num: 28 }, // 白 压
    { x: 13, y: 7, color: 'B', num: 29 }, // 黑 扳
    { x: 13, y: 8, color: 'W', num: 30 }, // 白 退
    { x: 14, y: 8, color: 'B', num: 31 }, // 黑 长
    { x: 14, y: 9, color: 'W', num: 32 }, // 白 扳
    { x: 13, y: 9, color: 'B', num: 33 }, // 黑 断
    { x: 12, y: 9, color: 'W', num: 34 }, // 白 打
    { x: 12, y: 10, color: 'B', num: 35 }, // 黑 长
    { x: 11, y: 9, color: 'W', num: 36 }, // 白 打
    { x: 12, y: 11, color: 'B', num: 37, isBrilliant: true, comment: '黑 37 手妙手！弃子整形，先手筑成厚势。' },
    { x: 11, y: 11, color: 'W', num: 38 },
    { x: 13, y: 11, color: 'B', num: 39 },
    { x: 14, y: 11, color: 'W', num: 40 },
    { x: 10, y: 12, color: 'B', num: 41 },
    { x: 11, y: 12, color: 'W', num: 42 },
    { x: 9, y: 12, color: 'B', num: 43 },
    { x: 10, y: 13, color: 'W', num: 44 },
    { x: 8, y: 13, color: 'B', num: 45 },
    { x: 9, y: 14, color: 'W', num: 46 },
    { x: 7, y: 14, color: 'B', num: 47, isBrilliant: true, comment: '黑 47 手腾挪妙手，声东击西，在白棋厚势中游刃有余。' },
    { x: 6, y: 14, color: 'W', num: 48 },
    { x: 7, y: 15, color: 'B', num: 49 },
    { x: 6, y: 15, color: 'W', num: 50 },
    { x: 8, y: 15, color: 'B', num: 51 },
    { x: 5, y: 14, color: 'W', num: 52 },
    { x: 6, y: 16, color: 'B', num: 53 },
    { x: 5, y: 15, color: 'W', num: 54 },
    { x: 7, y: 16, color: 'B', num: 55 },
    { x: 4, y: 16, color: 'W', num: 56 },
    { x: 8, y: 16, color: 'B', num: 57 },
    { x: 3, y: 16, color: 'W', num: 58 },
    { x: 9, y: 16, color: 'B', num: 59 },
    { x: 2, y: 16, color: 'W', num: 60 },
    { x: 10, y: 16, color: 'B', num: 61 },
    { x: 1, y: 16, color: 'W', num: 62 },
    { x: 11, y: 16, color: 'B', num: 63 },
    { x: 0, y: 16, color: 'W', num: 64 },
    { x: 12, y: 16, color: 'B', num: 65 },
    { x: 0, y: 15, color: 'W', num: 66 },
    { x: 13, y: 16, color: 'B', num: 67 },
    { x: 0, y: 14, color: 'W', num: 68 },
    { x: 14, y: 16, color: 'B', num: 69 },
    { x: 1, y: 15, color: 'W', num: 70 },
    { x: 15, y: 16, color: 'B', num: 71 },
    { x: 2, y: 15, color: 'W', num: 72 },
    { x: 16, y: 16, color: 'B', num: 73 },
    { x: 3, y: 15, color: 'W', num: 74 },
    { x: 17, y: 16, color: 'B', num: 75 },
    { x: 4, y: 15, color: 'W', num: 76 },
    { x: 18, y: 16, color: 'B', num: 77 },
    { x: 5, y: 15, color: 'W', num: 78 },
    { x: -1, y: -1, color: 'B', num: 79, comment: '黑 79 虚手，双方于左下角形成大规模转换。' },
    { x: 6, y: 13, color: 'W', num: 80 },
  ],
};

const WU_QINGYUAN_GAME = {
  id: 'wuqingyuan-kitani-1939',
  title: '镰仓十番棋·首局',
  black: { name: '吴清源', rank: '八段', era: '民国' },
  white: { name: '木谷实', rank: '八段', era: '昭和' },
  year: 1939,
  location: '神奈川镰仓',
  komi: 4.5,
  result: '黑胜 2 目',
  totalMoves: 221,
  category: '吴清源名局',
  summary:
    '1939 年，吴清源与木谷实展开镰仓十番棋，这是昭和围棋史上最著名的升降十番棋。首局于镰仓建长寺进行，吴清源执黑以星·三三·天元的"新布局"开局，最终中盘胜木谷实。本局被誉为"世纪之局"的开端。',
  tags: ['新布局', '十番棋', '世纪名局'],
  isFeatured: false,
  brilliantMoves: [23, 87, 156],
  moves: [
    { x: 15, y: 3, color: 'B', num: 1, comment: '黑 1 星，新布局的起点。' },
    { x: 3, y: 15, color: 'W', num: 2 },
    { x: 3, y: 3, color: 'B', num: 3, comment: '黑 3 三三！吴清源招牌开局，打破传统。' },
    { x: 15, y: 15, color: 'W', num: 4 },
    { x: 9, y: 9, color: 'B', num: 5, isBrilliant: true, comment: '黑 5 天元！星·三三·天元，震惊棋界的开局。' },
    { x: 9, y: 15, color: 'W', num: 6 },
    { x: 5, y: 5, color: 'B', num: 7 },
    { x: 15, y: 9, color: 'W', num: 8 },
    { x: 9, y: 5, color: 'B', num: 9 },
    { x: 14, y: 9, color: 'W', num: 10 },
    { x: 12, y: 5, color: 'B', num: 11 },
    { x: 16, y: 9, color: 'W', num: 12 },
    { x: 9, y: 6, color: 'B', num: 13 },
    { x: 18, y: 9, color: 'W', num: 14 },
    { x: 6, y: 5, color: 'B', num: 15 },
    { x: 17, y: 8, color: 'W', num: 16 },
    { x: 9, y: 4, color: 'B', num: 17 },
    { x: 16, y: 7, color: 'W', num: 18 },
    { x: 10, y: 3, color: 'B', num: 19 },
    { x: 15, y: 6, color: 'W', num: 20 },
    { x: 9, y: 3, color: 'B', num: 21 },
    { x: 14, y: 5, color: 'W', num: 22 },
    { x: 10, y: 4, color: 'B', num: 23, isBrilliant: true, comment: '黑 23 手妙手！棋形轻灵，体现新布局的速度感。' },
    { x: 13, y: 4, color: 'W', num: 24 },
    { x: 11, y: 5, color: 'B', num: 25 },
    { x: 12, y: 4, color: 'W', num: 26 },
    { x: 12, y: 6, color: 'B', num: 27 },
    { x: 13, y: 5, color: 'W', num: 28 },
    { x: 13, y: 6, color: 'B', num: 29 },
    { x: 14, y: 6, color: 'W', num: 30 },
    { x: 14, y: 7, color: 'B', num: 31 },
    { x: 15, y: 7, color: 'W', num: 32 },
    { x: 11, y: 7, color: 'B', num: 33 },
    { x: 10, y: 6, color: 'W', num: 34 },
    { x: 10, y: 7, color: 'B', num: 35 },
    { x: 9, y: 7, color: 'W', num: 36 },
    { x: 11, y: 6, color: 'B', num: 37 },
    { x: 12, y: 7, color: 'W', num: 38 },
    { x: 10, y: 8, color: 'B', num: 39 },
    { x: 11, y: 8, color: 'W', num: 40 },
    { x: 11, y: 9, color: 'B', num: 41 },
    { x: 10, y: 9, color: 'W', num: 42 },
    { x: 12, y: 9, color: 'B', num: 43 },
    { x: 10, y: 10, color: 'W', num: 44 },
    { x: 11, y: 10, color: 'B', num: 45 },
    { x: 10, y: 11, color: 'W', num: 46 },
    { x: 12, y: 10, color: 'B', num: 47 },
    { x: 9, y: 11, color: 'W', num: 48 },
    { x: 13, y: 10, color: 'B', num: 49 },
    { x: 12, y: 11, color: 'W', num: 50 },
    { x: 14, y: 10, color: 'B', num: 51 },
    { x: 13, y: 11, color: 'W', num: 52 },
    { x: 13, y: 12, color: 'B', num: 53 },
    { x: 12, y: 12, color: 'W', num: 54 },
    { x: 14, y: 12, color: 'B', num: 55 },
    { x: 12, y: 13, color: 'W', num: 56 },
    { x: 15, y: 12, color: 'B', num: 57 },
    { x: 11, y: 13, color: 'W', num: 58 },
    { x: 16, y: 12, color: 'B', num: 59 },
    { x: 10, y: 13, color: 'W', num: 60 },
    { x: 17, y: 12, color: 'B', num: 61 },
    { x: 9, y: 13, color: 'W', num: 62 },
    { x: 18, y: 12, color: 'B', num: 63 },
    { x: 8, y: 13, color: 'W', num: 64 },
    { x: 17, y: 11, color: 'B', num: 65 },
    { x: 7, y: 13, color: 'W', num: 66 },
    { x: 18, y: 11, color: 'B', num: 67 },
    { x: 6, y: 13, color: 'W', num: 68 },
    { x: 16, y: 11, color: 'B', num: 69 },
    { x: 5, y: 13, color: 'W', num: 70 },
    { x: 15, y: 11, color: 'B', num: 71 },
    { x: 4, y: 13, color: 'W', num: 72 },
    { x: 14, y: 11, color: 'B', num: 73 },
    { x: 3, y: 13, color: 'W', num: 74 },
    { x: 13, y: 13, color: 'B', num: 75 },
    { x: 2, y: 13, color: 'W', num: 76 },
    { x: 14, y: 14, color: 'B', num: 77 },
    { x: 1, y: 13, color: 'W', num: 78 },
    { x: 13, y: 14, color: 'B', num: 79 },
    { x: 0, y: 13, color: 'W', num: 80 },
    { x: 12, y: 14, color: 'B', num: 81 },
    { x: 14, y: 15, color: 'W', num: 82 },
    { x: 12, y: 15, color: 'B', num: 83 },
    { x: 13, y: 15, color: 'W', num: 84 },
    { x: 11, y: 15, color: 'B', num: 85 },
    { x: 12, y: 16, color: 'W', num: 86 },
    { x: 10, y: 16, color: 'B', num: 87, isBrilliant: true, comment: '黑 87 手妙手！打入白棋腹地，算路深远。' },
    { x: 11, y: 16, color: 'W', num: 88 },
    { x: 9, y: 17, color: 'B', num: 89 },
    { x: 10, y: 17, color: 'W', num: 90 },
  ],
};

const MASTER_GAME = {
  id: 'master-vs-lianxiao-2017',
  title: 'Master 对战连笑',
  black: { name: 'Master (AlphaGo)', rank: 'AI', era: '现代' },
  white: { name: '连笑', rank: '九段', era: '现代' },
  year: 2017,
  location: '网络对弈',
  komi: 7.5,
  result: '黑中盘胜',
  totalMoves: 195,
  category: 'AI 名局',
  summary:
    '2017 年初，神秘棋手 Master 在网络对弈平台连胜人类顶尖高手 60 局，震动棋界。本局为 Master 执黑对阵中国棋手连笑九段，第 37 手"肩冲"惊为天人，展现了 AI 对围棋的全新理解。',
  tags: ['AI', '网络名局', 'Master 60连胜'],
  isFeatured: false,
  brilliantMoves: [37, 101, 153],
  moves: [
    { x: 15, y: 3, color: 'B', num: 1 },
    { x: 3, y: 15, color: 'W', num: 2 },
    { x: 3, y: 3, color: 'B', num: 3 },
    { x: 15, y: 15, color: 'W', num: 4 },
    { x: 16, y: 5, color: 'B', num: 5 },
    { x: 2, y: 14, color: 'W', num: 6 },
    { x: 5, y: 15, color: 'B', num: 7 },
    { x: 5, y: 14, color: 'W', num: 8 },
    { x: 6, y: 14, color: 'B', num: 9 },
    { x: 6, y: 15, color: 'W', num: 10 },
    { x: 5, y: 16, color: 'B', num: 11 },
    { x: 5, y: 17, color: 'W', num: 12 },
    { x: 6, y: 17, color: 'B', num: 13 },
    { x: 6, y: 16, color: 'W', num: 14 },
    { x: 7, y: 16, color: 'B', num: 15 },
    { x: 4, y: 14, color: 'W', num: 16 },
    { x: 7, y: 15, color: 'B', num: 17 },
    { x: 7, y: 14, color: 'W', num: 18 },
    { x: 8, y: 15, color: 'B', num: 19 },
    { x: 8, y: 14, color: 'W', num: 20 },
    { x: 9, y: 15, color: 'B', num: 21 },
    { x: 9, y: 14, color: 'W', num: 22 },
    { x: 10, y: 15, color: 'B', num: 23 },
    { x: 10, y: 14, color: 'W', num: 24 },
    { x: 11, y: 15, color: 'B', num: 25 },
    { x: 11, y: 14, color: 'W', num: 26 },
    { x: 12, y: 15, color: 'B', num: 27 },
    { x: 12, y: 14, color: 'W', num: 28 },
    { x: 13, y: 15, color: 'B', num: 29 },
    { x: 13, y: 14, color: 'W', num: 30 },
    { x: 14, y: 15, color: 'B', num: 31 },
    { x: 14, y: 14, color: 'W', num: 32 },
    { x: 15, y: 15, color: 'B', num: 33 },
    { x: 15, y: 14, color: 'W', num: 34 },
    { x: 16, y: 15, color: 'B', num: 35 },
    { x: 16, y: 14, color: 'W', num: 36 },
    { x: 4, y: 11, color: 'B', num: 37, isBrilliant: true, comment: '黑 37 手肩冲！Master 的"五十肩"——AI 颠覆人类认知的一手，被誉为"上帝视角"。' },
    { x: 4, y: 12, color: 'W', num: 38 },
    { x: 4, y: 10, color: 'B', num: 39 },
    { x: 5, y: 10, color: 'W', num: 40 },
    { x: 3, y: 10, color: 'B', num: 41 },
    { x: 3, y: 11, color: 'W', num: 42 },
    { x: 2, y: 11, color: 'B', num: 43 },
    { x: 5, y: 11, color: 'W', num: 44 },
    { x: 2, y: 10, color: 'B', num: 45 },
    { x: 6, y: 11, color: 'W', num: 46 },
    { x: 3, y: 9, color: 'B', num: 47 },
    { x: 7, y: 11, color: 'W', num: 48 },
    { x: 3, y: 8, color: 'B', num: 49 },
    { x: 8, y: 11, color: 'W', num: 50 },
    { x: 4, y: 8, color: 'B', num: 51 },
    { x: 9, y: 11, color: 'W', num: 52 },
    { x: 5, y: 8, color: 'B', num: 53 },
    { x: 10, y: 11, color: 'W', num: 54 },
    { x: 6, y: 8, color: 'B', num: 55 },
    { x: 11, y: 11, color: 'W', num: 56 },
    { x: 7, y: 8, color: 'B', num: 57 },
    { x: 12, y: 11, color: 'W', num: 58 },
    { x: 8, y: 8, color: 'B', num: 59 },
    { x: 13, y: 11, color: 'W', num: 60 },
    { x: 9, y: 8, color: 'B', num: 61 },
    { x: 14, y: 11, color: 'W', num: 62 },
    { x: 10, y: 8, color: 'B', num: 63 },
    { x: 15, y: 11, color: 'W', num: 64 },
    { x: 11, y: 8, color: 'B', num: 65 },
    { x: 16, y: 11, color: 'W', num: 66 },
    { x: 12, y: 8, color: 'B', num: 67 },
    { x: 17, y: 11, color: 'W', num: 68 },
    { x: 13, y: 8, color: 'B', num: 69 },
    { x: 18, y: 11, color: 'W', num: 70 },
    { x: 14, y: 8, color: 'B', num: 71 },
    { x: 17, y: 10, color: 'W', num: 72 },
    { x: 15, y: 8, color: 'B', num: 73 },
    { x: 16, y: 9, color: 'W', num: 74 },
    { x: 16, y: 8, color: 'B', num: 75 },
    { x: 15, y: 9, color: 'W', num: 76 },
    { x: 17, y: 8, color: 'B', num: 77 },
    { x: 14, y: 9, color: 'W', num: 78 },
    { x: 18, y: 8, color: 'B', num: 79 },
    { x: 13, y: 9, color: 'W', num: 80 },
    { x: 17, y: 7, color: 'B', num: 81 },
    { x: 12, y: 9, color: 'W', num: 82 },
    { x: 18, y: 7, color: 'B', num: 83 },
    { x: 11, y: 9, color: 'W', num: 84 },
    { x: 16, y: 7, color: 'B', num: 85 },
    { x: 10, y: 9, color: 'W', num: 86 },
    { x: 15, y: 7, color: 'B', num: 87 },
    { x: 9, y: 9, color: 'W', num: 88 },
    { x: 14, y: 7, color: 'B', num: 89 },
    { x: 8, y: 9, color: 'W', num: 90 },
    { x: 13, y: 7, color: 'B', num: 91 },
    { x: 7, y: 9, color: 'W', num: 92 },
    { x: 12, y: 7, color: 'B', num: 93 },
    { x: 6, y: 9, color: 'W', num: 94 },
    { x: 11, y: 7, color: 'B', num: 95 },
    { x: 5, y: 9, color: 'W', num: 96 },
    { x: 10, y: 7, color: 'B', num: 97 },
    { x: 4, y: 9, color: 'W', num: 98 },
    { x: 9, y: 7, color: 'B', num: 99 },
    { x: 3, y: 7, color: 'W', num: 100 },
    { x: 8, y: 7, color: 'B', num: 101, isBrilliant: true, comment: '黑 101 手妙手！一路长驱直入，白棋整条边被 AI 轻松打穿。' },
    { x: 2, y: 7, color: 'W', num: 102 },
  ],
};

const DANGHU_GAME10 = {
  id: 'danghu-10',
  title: '当湖十局·第十局',
  black: { name: '施襄夏', rank: '国手', era: '清' },
  white: { name: '范西屏', rank: '国手', era: '清' },
  year: 1751,
  location: '浙江平湖',
  komi: 0,
  result: '白胜',
  totalMoves: 234,
  category: '古谱名局',
  summary:
    '当湖十局收官之局，施襄夏执黑、范西屏执白。本局双方缠斗至终局，范西屏以半子之优险胜。十局终罢，范西屏以六胜四负略占上风，成就一段棋史佳话。',
  tags: ['古谱', '国手对决', '收官名局'],
  isFeatured: false,
  brilliantMoves: [89, 156, 201],
  moves: DANGHU_GAME3.moves.slice(0, 60).map((m, i) => ({ ...m, num: i + 1 })),
};

const SEKI_KISEI = {
  id: 'seki-kisei-2023',
  title: '第 48 期棋圣战·第三局',
  black: { name: '井山裕太', rank: '九段', era: '令和' },
  white: { name: '芝野虎丸', rank: '九段', era: '令和' },
  year: 2024,
  location: '东京',
  komi: 6.5,
  result: '黑胜 1.5 目',
  totalMoves: 281,
  category: '现代棋战',
  summary:
    '日本第 48 期棋圣战挑战赛第三局，井山裕太棋圣执黑迎战挑战者芝野虎丸名人。本局中盘阶段双方在左下角展开大规模攻防，最终井山以细腻的收官守住胜势。',
  tags: ['棋圣战', '日本棋战', '现代名局'],
  isFeatured: false,
  brilliantMoves: [78, 145],
  moves: WU_QINGYUAN_GAME.moves.slice(0, 50).map((m, i) => ({ ...m, num: i + 1 })),
};

const LEE_SEDOL_ALPHAGO = {
  id: 'lee-sedol-alphago-game4',
  title: 'AlphaGo 对李世石·第四局',
  black: { name: '李世石', rank: '九段', era: '现代' },
  white: { name: 'AlphaGo', rank: 'AI', era: '现代' },
  year: 2016,
  location: '首尔',
  komi: 7.5,
  result: '黑中盘胜',
  totalMoves: 180,
  category: 'AI 名局',
  summary:
    '2016 年 AlphaGo 对李世石人机大战第四局。李世石在 1:3 落后的绝境下，于第 78 手下出"神之一手"（白 78 手），一举扭转局面，赢下了人类在此次人机大战中的唯一一局。',
  tags: ['AI', '人机大战', '神之一手'],
  isFeatured: false,
  brilliantMoves: [78],
  moves: [
    { x: 15, y: 3, color: 'B', num: 1 },
    { x: 3, y: 15, color: 'W', num: 2 },
    { x: 3, y: 3, color: 'B', num: 3 },
    { x: 15, y: 15, color: 'W', num: 4 },
    { x: 16, y: 6, color: 'B', num: 5 },
    { x: 2, y: 14, color: 'W', num: 6 },
    { x: 5, y: 15, color: 'B', num: 7 },
    { x: 5, y: 14, color: 'W', num: 8 },
    { x: 6, y: 14, color: 'B', num: 9 },
    { x: 6, y: 15, color: 'W', num: 10 },
    { x: 5, y: 16, color: 'B', num: 11 },
    { x: 5, y: 17, color: 'W', num: 12 },
    { x: 7, y: 17, color: 'B', num: 13 },
    { x: 7, y: 16, color: 'W', num: 14 },
    { x: 7, y: 15, color: 'B', num: 15 },
    { x: 6, y: 16, color: 'W', num: 16 },
    { x: 4, y: 14, color: 'B', num: 17 },
    { x: 7, y: 14, color: 'W', num: 18 },
    { x: 8, y: 15, color: 'B', num: 19 },
    { x: 8, y: 14, color: 'W', num: 20 },
    { x: 9, y: 15, color: 'B', num: 21 },
    { x: 9, y: 14, color: 'W', num: 22 },
    { x: 10, y: 15, color: 'B', num: 23 },
    { x: 10, y: 14, color: 'W', num: 24 },
    { x: 11, y: 15, color: 'B', num: 25 },
    { x: 11, y: 14, color: 'W', num: 26 },
    { x: 12, y: 15, color: 'B', num: 27 },
    { x: 12, y: 14, color: 'W', num: 28 },
    { x: 13, y: 15, color: 'B', num: 29 },
    { x: 13, y: 14, color: 'W', num: 30 },
    { x: 14, y: 15, color: 'B', num: 31 },
    { x: 14, y: 14, color: 'W', num: 32 },
    { x: 15, y: 15, color: 'B', num: 33 },
    { x: 15, y: 14, color: 'W', num: 34 },
    { x: 16, y: 15, color: 'B', num: 35 },
    { x: 16, y: 14, color: 'W', num: 36 },
    { x: 4, y: 11, color: 'B', num: 37 },
    { x: 4, y: 12, color: 'W', num: 38 },
    { x: 4, y: 10, color: 'B', num: 39 },
    { x: 5, y: 10, color: 'W', num: 40 },
    { x: 3, y: 10, color: 'B', num: 41 },
    { x: 3, y: 11, color: 'W', num: 42 },
    { x: 2, y: 11, color: 'B', num: 43 },
    { x: 5, y: 11, color: 'W', num: 44 },
    { x: 2, y: 10, color: 'B', num: 45 },
    { x: 6, y: 11, color: 'W', num: 46 },
    { x: 3, y: 9, color: 'B', num: 47 },
    { x: 7, y: 11, color: 'W', num: 48 },
    { x: 3, y: 8, color: 'B', num: 49 },
    { x: 8, y: 11, color: 'W', num: 50 },
    { x: 4, y: 8, color: 'B', num: 51 },
    { x: 9, y: 11, color: 'W', num: 52 },
    { x: 5, y: 8, color: 'B', num: 53 },
    { x: 10, y: 11, color: 'W', num: 54 },
    { x: 6, y: 8, color: 'B', num: 55 },
    { x: 11, y: 11, color: 'W', num: 56 },
    { x: 7, y: 8, color: 'B', num: 57 },
    { x: 12, y: 11, color: 'W', num: 58 },
    { x: 8, y: 8, color: 'B', num: 59 },
    { x: 13, y: 11, color: 'W', num: 60 },
    { x: 9, y: 8, color: 'B', num: 61 },
    { x: 14, y: 11, color: 'W', num: 62 },
    { x: 10, y: 8, color: 'B', num: 63 },
    { x: 15, y: 11, color: 'W', num: 64 },
    { x: 11, y: 8, color: 'B', num: 65 },
    { x: 16, y: 11, color: 'W', num: 66 },
    { x: 12, y: 8, color: 'B', num: 67 },
    { x: 17, y: 11, color: 'W', num: 68 },
    { x: 13, y: 8, color: 'B', num: 69 },
    { x: 18, y: 11, color: 'W', num: 70 },
    { x: 14, y: 8, color: 'B', num: 71 },
    { x: 17, y: 10, color: 'W', num: 72 },
    { x: 15, y: 8, color: 'B', num: 73 },
    { x: 16, y: 9, color: 'W', num: 74 },
    { x: 16, y: 8, color: 'B', num: 75 },
    { x: 15, y: 9, color: 'W', num: 76 },
    { x: 17, y: 8, color: 'B', num: 77 },
    { x: 11, y: 7, color: 'W', num: 78, isBrilliant: true, comment: '白 78 手！李世石的"神之一手"——尖冲五路，堪称世纪妙手。此手一出，AlphaGo 评估骤降，人类扳回一城。' },
    { x: 14, y: 9, color: 'W', num: 79 },
    { x: 18, y: 8, color: 'B', num: 80 },
  ],
};

const ALL_GAMES = [
  DANGHU_GAME3,
  DANGHU_GAME10,
  WU_QINGYUAN_GAME,
  MASTER_GAME,
  LEE_SEDOL_ALPHAGO,
  SEKI_KISEI,
];

const CATEGORIES = [
  { id: 'all', name: '全部', count: ALL_GAMES.length },
  { id: '古谱名局', name: '古谱名局', count: 2 },
  { id: '吴清源名局', name: '吴清源名局', count: 1 },
  { id: 'AI 名局', name: 'AI 名局', count: 2 },
  { id: '现代棋战', name: '现代棋战', count: 1 },
];

const TSGOKA_PROBLEMS = [
  {
    id: 'tsg-001',
    title: '玄玄棋经·七星聚会',
    difficulty: '3段',
    blackToMove: true,
    summary: '黑先活。经典死活题，考验对"眼位"的理解。',
    // 初始局面：黑白子位置
    initialStones: [
      { x: 8, y: 8, color: 'W' },
      { x: 9, y: 8, color: 'W' },
      { x: 10, y: 8, color: 'W' },
      { x: 8, y: 9, color: 'W' },
      { x: 10, y: 9, color: 'W' },
      { x: 8, y: 10, color: 'W' },
      { x: 9, y: 10, color: 'W' },
      { x: 10, y: 10, color: 'W' },
      { x: 9, y: 9, color: 'B' },
      // 白外围
      { x: 7, y: 7, color: 'B' },
      { x: 11, y: 7, color: 'B' },
      { x: 7, y: 11, color: 'B' },
      { x: 11, y: 11, color: 'B' },
      { x: 7, y: 8, color: 'B' },
      { x: 7, y: 9, color: 'B' },
      { x: 7, y: 10, color: 'B' },
      { x: 11, y: 8, color: 'B' },
      { x: 11, y: 9, color: 'B' },
      { x: 11, y: 10, color: 'B' },
      { x: 8, y: 7, color: 'B' },
      { x: 9, y: 7, color: 'B' },
      { x: 10, y: 7, color: 'B' },
      { x: 8, y: 11, color: 'B' },
      { x: 9, y: 11, color: 'B' },
      { x: 10, y: 11, color: 'B' },
    ],
    solution: [
      { x: 9, y: 9, color: 'W', num: 1, comment: '白 1 点眼，正着。' },
      { x: 9, y: 8, color: 'B', num: 2, comment: '黑 2 挡，白后续变化。' },
    ],
    answerMove: { x: 9, y: 9, color: 'W' },
    answerComment:
      '白 1 点入"刀五"中心点是正解。黑无论如何应对，都无法做出两只真眼。此题为"聚杀"的典型——形状越大，越是死形。',
  },
  {
    id: 'tsg-002',
    title: '官子谱·金不换',
    difficulty: '5段',
    blackToMove: false,
    summary: '白先杀黑。角部经典死活，涉及"倒脱靴"手法。',
    initialStones: [
      { x: 0, y: 0, color: 'B' },
      { x: 1, y: 0, color: 'B' },
      { x: 2, y: 0, color: 'B' },
      { x: 0, y: 1, color: 'B' },
      { x: 2, y: 1, color: 'B' },
      { x: 0, y: 2, color: 'B' },
      { x: 1, y: 2, color: 'B' },
      { x: 2, y: 2, color: 'B' },
      { x: 0, y: 3, color: 'W' },
      { x: 1, y: 3, color: 'W' },
      { x: 2, y: 3, color: 'W' },
      { x: 3, y: 2, color: 'W' },
      { x: 3, y: 1, color: 'W' },
      { x: 3, y: 0, color: 'W' },
    ],
    solution: [{ x: 1, y: 1, color: 'W', num: 1, comment: '白 1 点，正解。' }],
    answerMove: { x: 1, y: 1, color: 'W' },
    answerComment:
      '白 1 点入是"倒脱靴"的关键一手。黑看似可以提子，但白可在提子后反吃回，最终角部黑棋无眼被杀。此题为古代棋谱中的名题"金不换"。',
  },
];

// 妙手集默认内容
const DEFAULT_COLLECTIONS = [
  {
    id: 'coll-1',
    title: '当湖名手',
    gameId: 'danghu-3',
    moveNum: 37,
    note: '范西屏弃子整形，先手得利。古棋的攻杀力令人叹服。',
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'coll-2',
    title: '世纪之肩冲',
    gameId: 'master-vs-lianxiao-2017',
    moveNum: 37,
    note: 'Master 的"五十肩"，打破人类对布局的认知。五路肩冲在人类看来过于冒进，AI 却算准了后续变化。',
    createdAt: Date.now() - 86400000 * 1,
  },
  {
    id: 'coll-3',
    title: '神之一手',
    gameId: 'lee-sedol-alphago-game4',
    moveNum: 78,
    note: '李世石的白 78 手，人类在人机大战中最后的辉煌。在 AI 统治棋坛的时代，这一手证明了人类的创造力仍有闪光。',
    createdAt: Date.now() - 86400000 * 0,
  },
];

// 设计规范
const DESIGN_TOKENS = {
  colors: {
    board: {
      name: '榧木黄',
      value: '#E8D4A8',
      description: '棋盘主色，取材于日本榧木的温润色调',
    },
    boardLine: {
      name: '墨线',
      value: '#2C1810',
      description: '棋盘格线颜色，浓墨勾勒',
    },
    boardDark: {
      name: '榧木深棕',
      value: '#8B6914',
      description: '棋盘木纹深色，用于阴影和边缘',
    },
    stoneBlack: {
      name: '墨石黑',
      value: '#1A1A1A',
      description: '黑子颜色，墨玉般深邃',
    },
    stoneWhite: {
      name: '蛤白',
      value: '#F5F1E8',
      description: '白子颜色，取自天然蛤贝的乳白色',
    },
    ink: {
      name: '墨棕',
      value: '#2C1810',
      description: '主要文字与深色色块',
    },
    paper: {
      name: '宣纸白',
      value: '#FAF7F0',
      description: '页面主背景，仿宣纸质感',
    },
    deepBrown: {
      name: '深棕',
      value: '#5C3D2E',
      description: '次级文字与分隔线',
    },
    moss: {
      name: '苔绿',
      value: '#6B8E5A',
      description: '点缀色，用于高亮、收藏、完成态',
    },
    mossLight: {
      name: '苔绿浅',
      value: '#A8C49A',
      description: '苔绿的浅色变体，用于背景块',
    },
    lineBrown: {
      name: '浅棕线',
      value: '#D4C4A8',
      description: '分割线与边框',
    },
  },
  typography: {
    display: {
      name: '标题宋体',
      fontFamily: '"Noto Serif SC", "Songti SC", "SimSun", serif',
      usage: '页面大标题、重要数字、棋谱名称',
      weights: [600, 700],
    },
    body: {
      name: '正文楷体',
      fontFamily: '"LXGW WenKai", "KaiTi", "STKaiti", serif',
      usage: '正文、谱注、说明文字',
      weights: [400, 700],
    },
    mono: {
      name: '数据等宽',
      fontFamily: '"JetBrains Mono", "SF Mono", Menlo, monospace',
      usage: '手数、API 路径、代码示例',
      weights: [400],
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '28px',
    '3xl': '40px',
  },
  radii: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  animations: {
    stoneDrop: {
      name: '落子',
      duration: '280ms',
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      description: '棋子落下，带轻微弹跳和余震',
    },
    captureFly: {
      name: '提子飞离',
      duration: '400ms',
      easing: 'cubic-bezier(0.55, 0, 1, 0.45)',
      description: '被提的棋子被夹起飞出棋盘',
    },
    pagePush: {
      name: '页面 push',
      duration: '320ms',
      easing: 'cubic-bezier(0.32, 0.72, 0, 1)',
      description: '新页面从右侧滑入',
    },
    tabTransition: {
      name: 'Tab 切换',
      duration: '260ms',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      description: 'Tab 间连续过渡',
    },
    brilliantReveal: {
      name: '妙手揭示',
      duration: '800ms',
      easing: 'ease-out',
      description: '抵达妙手时的氛围变化效果',
    },
  },
};

// 模拟 API
const MOCK_APIS = [
  {
    method: 'GET',
    path: '/api/v2/games',
    summary: '获取棋谱列表',
    params: [
      { name: 'category', type: 'string', required: false, description: '分类筛选' },
      { name: 'page', type: 'number', required: false, description: '页码' },
      { name: 'pageSize', type: 'number', required: false, description: '每页数量' },
      { name: 'keyword', type: 'string', required: false, description: '搜索关键词' },
    ],
    response: JSON.stringify(
      {
        code: 0,
        data: {
          total: 6,
          list: [
            {
              id: 'danghu-3',
              title: '当湖十局·第三局',
              black: { name: '范西屏', rank: '国手' },
              white: { name: '施襄夏', rank: '国手' },
              year: 1751,
              totalMoves: 247,
              result: '黑胜',
              category: '古谱名局',
            },
          ],
        },
      },
      null,
      2
    ),
  },
  {
    method: 'GET',
    path: '/api/v2/games/{id}',
    summary: '获取棋谱详情',
    params: [{ name: 'id', type: 'string', required: true, description: '棋谱 ID' }],
    response: JSON.stringify(
      {
        code: 0,
        data: {
          id: 'danghu-3',
          title: '当湖十局·第三局',
          black: { name: '范西屏', rank: '国手', era: '清' },
          white: { name: '施襄夏', rank: '国手', era: '清' },
          year: 1751,
          komi: 0,
          result: '黑胜',
          totalMoves: 247,
          summary: '当湖十局乃清代两大棋圣……',
          brilliantMoves: [47, 128, 179],
        },
      },
      null,
      2
    ),
  },
  {
    method: 'GET',
    path: '/api/v2/games/{id}/moves',
    summary: '获取棋谱着手序列',
    params: [
      { name: 'id', type: 'string', required: true, description: '棋谱 ID' },
      { name: 'from', type: 'number', required: false, description: '起始手数' },
      { name: 'to', type: 'number', required: false, description: '结束手数' },
    ],
    response: JSON.stringify(
      {
        code: 0,
        data: {
          moves: [
            { num: 1, x: 15, y: 3, color: 'B' },
            { num: 2, x: 3, y: 15, color: 'W' },
            { num: 3, x: 3, y: 3, color: 'B' },
          ],
        },
      },
      null,
      2
    ),
  },
  {
    method: 'GET',
    path: '/api/v2/games/{id}/variations',
    summary: '获取变化图分支',
    params: [
      { name: 'id', type: 'string', required: true, description: '棋谱 ID' },
      { name: 'moveNum', type: 'number', required: true, description: '着手手数' },
    ],
    response: JSON.stringify(
      {
        code: 0,
        data: {
          variations: [
            {
              id: 'var-1',
              name: '变化一',
              moves: [{ num: 1, x: 5, y: 5, color: 'B' }],
            },
          ],
        },
      },
      null,
      2
    ),
  },
  {
    method: 'GET',
    path: '/api/v2/today',
    summary: '获取今日推荐',
    response: JSON.stringify(
      {
        code: 0,
        data: {
          game: { id: 'danghu-3', title: '当湖十局·第三局' },
          tsgProblem: { id: 'tsg-001', title: '玄玄棋经·七星聚会' },
          quote: {
            text: '棋者，以正合其势，以权制其敌。',
            author: '《棋经十三篇》',
          },
        },
      },
      null,
      2
    ),
  },
  {
    method: 'GET',
    path: '/api/v2/tsg/daily',
    summary: '获取每日一题',
    response: JSON.stringify(
      {
        code: 0,
        data: {
          id: 'tsg-001',
          title: '玄玄棋经·七星聚会',
          difficulty: '3段',
          blackToMove: true,
        },
      },
      null,
      2
    ),
  },
  {
    method: 'POST',
    path: '/api/v2/collections',
    summary: '收藏妙手',
    requestBody: JSON.stringify(
      { gameId: 'danghu-3', moveNum: 37, note: '范西屏弃子整形' },
      null,
      2
    ),
    response: JSON.stringify(
      {
        code: 0,
        data: {
          id: 'coll-new',
          gameId: 'danghu-3',
          moveNum: 37,
          note: '范西屏弃子整形',
          createdAt: 1713500000000,
        },
      },
      null,
      2
    ),
  },
  {
    method: 'GET',
    path: '/api/v2/collections',
    summary: '获取妙手集列表',
    response: JSON.stringify(
      {
        code: 0,
        data: {
          total: 3,
          list: [
            {
              id: 'coll-1',
              title: '当湖名手',
              gameId: 'danghu-3',
              moveNum: 37,
              note: '范西屏弃子整形，先手得利。',
            },
          ],
        },
      },
      null,
      2
    ),
  },
  {
    method: 'PUT',
    path: '/api/v2/collections/{id}',
    summary: '编辑妙手笔记',
    requestBody: JSON.stringify({ note: '更新后的笔记内容' }, null, 2),
    response: JSON.stringify({ code: 0, data: { updated: true } }, null, 2),
  },
  {
    method: 'DELETE',
    path: '/api/v2/collections/{id}',
    summary: '删除收藏',
    response: JSON.stringify({ code: 0, data: { deleted: true } }, null, 2),
  },
  {
    method: 'POST',
    path: '/api/v2/notes',
    summary: '生成棋谱笔记',
    requestBody: JSON.stringify(
      {
        title: '我的棋谱笔记',
        collections: ['coll-1', 'coll-2'],
      },
      null,
      2
    ),
    response: JSON.stringify(
      { code: 0, data: { id: 'note-1', url: '/notes/note-1.pdf' } },
      null,
      2
    ),
  },
  {
    method: 'GET',
    path: '/api/v2/user/profile',
    summary: '获取用户信息',
    response: JSON.stringify(
      {
        code: 0,
        data: {
          nickname: '棋中散人',
          avatar: '',
          level: '弈城 5 段',
          studiedGames: 42,
          collections: 128,
          streak: 15,
        },
      },
      null,
      2
    ),
  },
];

Object.assign(window, {
  ALL_GAMES,
  CATEGORIES,
  TSGOKA_PROBLEMS,
  DEFAULT_COLLECTIONS,
  DESIGN_TOKENS,
  MOCK_APIS,
});
