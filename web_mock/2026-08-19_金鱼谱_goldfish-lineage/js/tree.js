/* ============================================
   谱系树模块
   - SVG 绘制：墨线分支 + 鱼形剪影节点
   - 拖拽平移 + 缩放
   - 节点点击/hover 交互
   - 墨线生长动画
   - 鱼摆尾动效
   ============================================ */

(function() {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const data = window.GOLDFISH_DATA;
  const svg = document.getElementById('family-tree');
  const branchesGroup = document.getElementById('tree-branches');
  const nodesGroup = document.getElementById('tree-nodes');
  const stage = document.getElementById('tree-stage');

  if (!svg || !data) return;

  // 视口/变换状态
  const view = {
    scale: 1,
    minScale: 0.5,
    maxScale: 2.5,
    tx: 0,
    ty: 0,
    width: 0,
    height: 0
  };

  // 拖拽状态
  const drag = {
    isDragging: false,
    startX: 0,
    startY: 0,
    startTx: 0,
    startTy: 0,
    moved: false,
    rafId: null
  };

  // 节点数据（计算后）
  const nodeMap = {}; // id -> node element

  // ===== 鱼形 SVG 绘制函数 =====
  function createFishSvg(shape, color, options) {
    const opts = options || {};
    const isLarge = opts.large || false;
    const scale = isLarge ? 1.5 : 1;
    const bl = shape.bodyLength * scale;
    const bh = shape.bodyHeight * scale;
    const ts = shape.tailSize * scale;
    const es = shape.eyeSize * scale;
    const eb = shape.eyeBubble * scale;
    const hg = shape.headGrowth;

    // 鱼体中心 X: 让鱼尾在左侧，鱼头在右侧，尾部留空间
    const bodyX = ts + 5;

    // SVG 路径
    let paths = '';
    let extraPaths = '';

    // 身体轮廓（从尾柄上方开始，沿背到头部，再沿腹部回到尾柄）
    const backPeakY = -bh * (0.3 + shape.backCurve * 0.4);
    const bellyPeakY = bh * (0.3 + shape.bellyCurve * 0.4);
    const headEndX = bodyX + bl * 0.7;
    const mouthX = bodyX + bl * 0.75;
    const tailStartX = bodyX - bl * 0.25;

    // 背线
    const backPath = `
      M ${tailStartX} ${-bh * 0.15}
      Q ${bodyX + bl * 0.1} ${backPeakY - bh * 0.05}
        ${bodyX + bl * 0.45} ${backPeakY}
      Q ${headEndX} ${backPeakY * 0.6}
        ${headEndX + bl * 0.05} ${-bh * 0.1}
    `;

    // 腹线
    const bellyPath = `
      L ${mouthX} ${bh * 0.1}
      Q ${headEndX} ${bellyPeakY * 0.5}
        ${bodyX + bl * 0.45} ${bellyPeakY}
      Q ${bodyX + bl * 0.1} ${bellyPeakY - bh * 0.05}
        ${tailStartX} ${bh * 0.15}
    `;

    // 尾鳍
    let tailPath = '';
    const tailBaseY = -bh * 0.15;
    const tailBaseBottomY = bh * 0.15;

    if (shape.tailType === 'single') {
      // 单尾
      const tailTipX = tailStartX - ts;
      const tailTipY = 0;
      const tailMidX = tailStartX - ts * 0.5;
      tailPath = `
        M ${tailStartX} ${tailBaseY}
        Q ${tailMidX} ${-bh * 0.3} ${tailTipX} ${tailTipY}
        Q ${tailMidX} ${bh * 0.3} ${tailStartX} ${tailBaseBottomY}
      `;
    } else if (shape.tailType === 'double' || shape.tailType === 'fan') {
      // 双尾/扇尾：上下两叶
      const tailTipX = tailStartX - ts * 0.9;
      const upperTipY = -bh * 0.6;
      const lowerTipY = bh * 0.6;
      const midX = tailStartX - ts * 0.4;
      tailPath = `
        M ${tailStartX} ${tailBaseY}
        Q ${midX} ${-bh * 0.45} ${tailTipX} ${upperTipY}
        Q ${tailStartX - ts * 0.2} ${-bh * 0.1} ${tailStartX} ${-bh * 0.02}
        M ${tailStartX} ${tailBaseBottomY}
        Q ${midX} ${bh * 0.45} ${tailTipX} ${lowerTipY}
        Q ${tailStartX - ts * 0.2} ${bh * 0.1} ${tailStartX} ${bh * 0.02}
      `;
    } else if (shape.tailType === 'butterfly') {
      // 蝶尾：向上下展开如蝴蝶翅膀
      const tailTipX = tailStartX - ts * 0.6;
      const upperTipY = -bh * 0.9;
      const lowerTipY = bh * 0.9;
      const midX = tailStartX - ts * 0.2;
      tailPath = `
        M ${tailStartX} ${tailBaseY}
        Q ${midX} ${-bh * 0.5} ${tailTipX} ${upperTipY}
        Q ${tailStartX - ts * 0.1} ${-bh * 0.15} ${tailStartX} ${-bh * 0.02}
        M ${tailStartX} ${tailBaseBottomY}
        Q ${midX} ${bh * 0.5} ${tailTipX} ${lowerTipY}
        Q ${tailStartX - ts * 0.1} ${bh * 0.15} ${tailStartX} ${bh * 0.02}
      `;
    }

    // 背鳍
    let dorsalPath = '';
    if (shape.dorsalFin) {
      const dorsalX = bodyX + bl * 0.25;
      const dorsalH = bh * 0.4;
      const dorsalW = bl * 0.2;
      dorsalPath = `
        M ${dorsalX - dorsalW * 0.3} ${backPeakY - 1}
        Q ${dorsalX} ${backPeakY - dorsalH}
          ${dorsalX + dorsalW * 0.7} ${backPeakY - 1}
      `;
    }

    // 胸鳍
    const pectoralX = bodyX + bl * 0.35;
    const pectoralY = bh * 0.2;
    const pectoralPath = `
      M ${pectoralX - 4} ${pectoralY}
      Q ${pectoralX + 4} ${pectoralY + bh * 0.25}
        ${pectoralX + 12} ${pectoralY + bh * 0.15}
    `;

    // 眼睛
    const eyeX = headEndX + bl * 0.02;
    const eyeY = -bh * 0.12;

    let eyePaths = `
      <circle cx="${eyeX}" cy="${eyeY}" r="${es}" fill="#FFF" stroke="${color}" stroke-width="1"/>
      <circle cx="${eyeX + es * 0.3}" cy="${eyeY}" r="${es * 0.5}" fill="#2C2C2C"/>
    `;

    // 水泡眼
    if (eb > 0) {
      extraPaths += `
        <ellipse cx="${eyeX - eb * 0.3}" cy="${eyeY + eb * 0.7}" rx="${eb}" ry="${eb * 0.7}"
          fill="rgba(200, 220, 240, 0.5)" stroke="${color}" stroke-width="1" stroke-opacity="0.5"/>
      `;
    }

    // 头瘤/肉瘤
    if (hg > 0) {
      const tumorW = bl * 0.35 * hg;
      const tumorH = bh * 0.6 * hg;
      const tumorX = headEndX - tumorW * 0.3;
      const tumorY = backPeakY - tumorH * 0.5;
      extraPaths += `
        <ellipse cx="${tumorX}" cy="${tumorY}" rx="${tumorW}" ry="${tumorH}" fill="${color}" opacity="0.9"/>
        <ellipse cx="${tumorX - tumorW * 0.4}" cy="${tumorY + tumorH * 0.2}" rx="${tumorW * 0.5}" ry="${tumorH * 0.6}" fill="${color}" opacity="0.85"/>
        <ellipse cx="${tumorX + tumorW * 0.3}" cy="${tumorY + tumorH * 0.3}" rx="${tumorW * 0.4}" ry="${tumorH * 0.5}" fill="${color}" opacity="0.85"/>
      `;
    }

    // 珍珠鳞（身体上点缀小圆点）
    if (shape.pearlScales) {
      let pearls = '';
      const rows = 3;
      const cols = 6;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const px = bodyX + (c / cols - 0.1) * bl * 0.7 + (r % 2) * 6;
          const py = -bh * 0.1 + (r - 1) * bh * 0.25;
          pearls += `<circle cx="${px}" cy="${py}" r="${isLarge ? 3 : 2}" fill="${color}" opacity="0.7"/>`;
        }
      }
      extraPaths += pearls;
    }

    // 嘴巴
    const mouthPath = `<path d="M ${mouthX} ${0} L ${mouthX + 2} ${-2} M ${mouthX} ${0} L ${mouthX + 2} ${2}" stroke="${color}" stroke-width="1" stroke-linecap="round"/>`;

    // 鳃盖线
    const gillX = headEndX - bl * 0.05;
    const gillPath = `<path d="M ${gillX} ${-bh * 0.2} Q ${gillX - 5} ${0} ${gillX} ${bh * 0.2}" stroke="${color}" stroke-width="0.8" fill="none" opacity="0.5"/>`;

    const bodyFill = color;

    return {
      body: `<path d="${backPath} ${bellyPath} Z" fill="${bodyFill}" class="fish-body"/>`,
      tail: `<g class="fish-tail"><path d="${tailPath}" fill="${bodyFill}" opacity="0.9"/></g>`,
      dorsal: shape.dorsalFin ? `<path d="${dorsalPath}" fill="${bodyFill}" opacity="0.85"/>` : '',
      pectoral: `<path d="${pectoralPath}" fill="${bodyFill}" opacity="0.75"/>`,
      eye: eyePaths,
      extra: extraPaths,
      mouth: mouthPath,
      gill: gillPath
    };
  }

  // 将鱼形 SVG 片段组合成完整 SVG
  function assembleFish(shape, color, size, options) {
    const fish = createFishSvg(shape, color, options);
    const totalW = shape.bodyLength + shape.tailSize + 20;
    const totalH = shape.bodyHeight * 2.2;
    const offsetX = 0;
    const offsetY = -totalH / 2;

    return {
      svg: `
        <g transform="translate(${offsetX}, ${totalH / 2})">
          ${fish.tail}
          ${fish.dorsal}
          ${fish.body}
          ${fish.pectoral}
          ${fish.gill}
          ${fish.eye}
          ${fish.extra}
          ${fish.mouth}
        </g>
      `,
      width: totalW,
      height: totalH
    };
  }

  // ===== 谱系树布局计算 =====
  function computeLayout() {
    const varieties = data.varieties;
    const layout = data.treeLayout;
    const svgRect = svg.getBoundingClientRect();
    const W = svgRect.width;
    const H = svgRect.height;
    view.width = W;
    view.height = H;

    // 按朝代分组
    const byDynasty = {};
    varieties.forEach(function(v) {
      const d = v.dynasty || 'ancient';
      if (!byDynasty[d]) byDynasty[d] = [];
      byDynasty[d].push(v);
    });

    // 计算每层 Y 位置
    function getY(dynasty) {
      const pct = layout.layerY[dynasty] !== undefined ? layout.layerY[dynasty] : 0.5;
      return H * pct;
    }

    // 计算分支 X 位置（按品系分群）
    // 品系分支：草金(中心) → 文鱼 → 各分支
    // 左右分布：龙睛系(左偏)、文鱼系(中)、蛋种系(右偏)
    const branchConfig = {
      crucian: { x: 0.5 },
      grass: { x: 0.5 },
      wen: { x: 0.5 },
      'dragon-eye': { x: 0.32 },
      'butterfly-tail': { x: 0.22 },
      celestial: { x: 0.18 },
      'bubble-eye': { x: 0.42 },
      'lion-head': { x: 0.58 },
      'pearl-scale': { x: 0.68 },
      ryukin: { x: 0.78 },
      'pom-pom': { x: 0.88 }
    };

    const nodes = [];
    varieties.forEach(function(v) {
      const cfg = branchConfig[v.id] || { x: 0.5 };
      const dyn = v.dynasty || 'ancient';
      nodes.push({
        id: v.id,
        variety: v,
        x: W * cfg.x,
        y: getY(dyn),
        dynasty: dyn
      });
    });

    return nodes;
  }

  // ===== 绘制分支线 =====
  function drawBranches(nodes) {
    branchesGroup.innerHTML = '';

    const nodeById = {};
    nodes.forEach(function(n) { nodeById[n.id] = n; });

    // 延迟绘制动画：从根到梢
    const drawOrder = [];

    nodes.forEach(function(n) {
      const v = n.variety;
      if (!v.ancestor) return; // 根节点无分支
      const ancestor = nodeById[v.ancestor];
      if (!ancestor) return;

      // 画一条从祖先到当前节点的曲线
      const x1 = ancestor.x;
      const y1 = ancestor.y;
      const x2 = n.x;
      const y2 = n.y;

      // 控制点：先垂直下/上一段，再水平
      const midY = (y1 + y2) / 2;
      const cp1x = x1;
      const cp1y = midY;
      const cp2x = x2;
      const cp2y = midY;

      const pathD = `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathD);
      path.setAttribute('class', 'tree-branch');
      path.setAttribute('data-from', v.ancestor);
      path.setAttribute('data-to', v.id);

      // 计算路径长度用于动画
      const len = Math.abs(y1 - y2) + Math.abs(x2 - x1) * 0.6;
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;

      branchesGroup.appendChild(path);
      drawOrder.push({ path: path, len: len, dynasty: n.dynasty });
    });

    return drawOrder;
  }

  // ===== 绘制节点 =====
  function drawNodes(nodes) {
    nodesGroup.innerHTML = '';
    nodeMap.length = 0;

    nodes.forEach(function(n) {
      const v = n.variety;
      const shape = v.fishShape;
      const color = v.id === 'crucian' ? '#8A8A8A' : '#C0392B'; // 鲫鱼灰色，其余朱红

      const fishInfo = assembleFish(shape, color, 40, {});
      const fishW = fishInfo.width;
      const fishH = fishInfo.height;

      // 创建节点组
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'fish-node');
      g.setAttribute('data-id', v.id);
      g.setAttribute('data-dynasty', n.dynasty);
      g.setAttribute('transform', `translate(${n.x}, ${n.y})`);

      // 光晕
      const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      glow.setAttribute('class', 'node-glow');
      glow.setAttribute('cx', '0');
      glow.setAttribute('cy', '0');
      glow.setAttribute('r', '30');
      glow.setAttribute('fill', '#C0392B');
      glow.setAttribute('opacity', '0.3');
      glow.setAttribute('filter', 'blur(8px)');

      // 鱼形组（可放大）
      const fishGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      fishGroup.setAttribute('class', 'fish-node-group');
      fishGroup.setAttribute('transform', `translate(${-fishW * 0.35}, ${-fishH / 2})`);
      fishGroup.innerHTML = fishInfo.svg;

      // 标签
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('class', 'node-label');
      label.setAttribute('x', '0');
      label.setAttribute('y', fishH / 2 + 18);
      label.textContent = v.name;

      // 印章标注
      const stampGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      stampGroup.setAttribute('class', 'seal-stamp');
      stampGroup.setAttribute('transform', `translate(28, -${fishH / 2 + 8})`);

      const stampRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      stampRect.setAttribute('x', '-10');
      stampRect.setAttribute('y', '-12');
      stampRect.setAttribute('width', '20');
      stampRect.setAttribute('height', '24');
      stampRect.setAttribute('fill', '#C0392B');
      stampRect.setAttribute('rx', '2');
      stampRect.setAttribute('opacity', '0.9');

      const stampText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      stampText.setAttribute('class', 'seal-stamp-text');
      stampText.setAttribute('x', '0');
      stampText.setAttribute('y', '-4');
      stampText.setAttribute('text-anchor', 'middle');
      stampText.textContent = v.era;

      stampGroup.appendChild(stampRect);
      stampGroup.appendChild(stampText);

      // 组装
      g.appendChild(glow);
      g.appendChild(fishGroup);
      g.appendChild(label);
      g.appendChild(stampGroup);

      nodesGroup.appendChild(g);
      nodeMap[v.id] = g;
    });
  }

  // ===== 墨线生长动画 =====
  function animateBranches(drawOrder) {
    if (prefersReducedMotion) {
      drawOrder.forEach(function(item) {
        item.path.style.strokeDashoffset = '0';
      });
      return;
    }

    // 按层级依次播放
    const dynastyOrder = ['ancient', 'song', 'ming', 'qing', 'modern'];
    let delay = 200;

    dynastyOrder.forEach(function(dyn) {
      const items = drawOrder.filter(function(d) { return d.dynasty === dyn; });
      items.forEach(function(item) {
        setTimeout(function() {
          item.path.style.transition = `stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)`;
          item.path.style.strokeDashoffset = '0';
        }, delay);
        delay += 80;
      });
      delay += 150;
    });
  }

  // ===== 变换更新 =====
  function updateTransform() {
    svg.style.transformOrigin = '0 0';
    svg.style.transform = `translate(${view.tx}px, ${view.ty}px) scale(${view.scale})`;
  }

  // ===== 缩放 =====
  function zoomAt(factor, cx, cy) {
    const newScale = Math.max(view.minScale, Math.min(view.maxScale, view.scale * factor));
    if (newScale === view.scale) return;

    // 以鼠标位置为中心缩放
    const ratio = newScale / view.scale;
    view.tx = cx - (cx - view.tx) * ratio;
    view.ty = cy - (cy - view.ty) * ratio;
    view.scale = newScale;
    updateTransform();
  }

  function resetView() {
    view.scale = 1;
    view.tx = 0;
    view.ty = 0;
    updateTransform();
  }

  // ===== 聚焦节点 =====
  function focusNode(nodeId) {
    const node = nodeMap[nodeId];
    if (!node) return;

    const n = data.varieties.find(function(v) { return v.id === nodeId; });
    if (!n) return;

    // 计算目标位置：让节点移到画布中央偏左（留出右侧面板空间）
    const panelOffset = window.innerWidth < 1024 ? 0 : 200;
    const targetX = view.width / 2 - panelOffset - n.x * view.scale;
    const targetY = view.height / 2 - n.y * view.scale;

    // 计算缩放：放大到 1.5 倍
    const targetScale = 1.5;
    const scaleRatio = targetScale / view.scale;

    // 平滑过渡
    animateTransform(targetX / scaleRatio + view.tx * (1 - 1/scaleRatio),
                     targetY / scaleRatio + view.ty * (1 - 1/scaleRatio),
                     targetScale);
  }

  function animateTransform(targetTx, targetTy, targetScale) {
    if (prefersReducedMotion) {
      view.tx = targetTx;
      view.ty = targetTy;
      view.scale = targetScale;
      updateTransform();
      return;
    }

    const startTx = view.tx;
    const startTy = view.ty;
    const startScale = view.scale;
    const duration = 600;
    const startTime = performance.now();

    function step(now) {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out-cubic

      view.tx = startTx + (targetTx - startTx) * eased;
      view.ty = startTy + (targetTy - startTy) * eased;
      view.scale = startScale + (targetScale - startScale) * eased;
      updateTransform();

      if (t < 1) {
        drag.rafId = requestAnimationFrame(step);
      } else {
        drag.rafId = null;
      }
    }

    if (drag.rafId) cancelAnimationFrame(drag.rafId);
    drag.rafId = requestAnimationFrame(step);
  }

  // ===== 拖拽平移 =====
  function handleDragStart(e) {
    // 不处理节点点击
    if (e.target.closest && e.target.closest('.fish-node')) return;

    drag.isDragging = true;
    drag.moved = false;
    drag.startX = e.clientX;
    drag.startY = e.clientY;
    drag.startTx = view.tx;
    drag.startTy = view.ty;

    stage.style.cursor = 'grabbing';
  }

  function handleDragMove(e) {
    if (!drag.isDragging) return;

    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      drag.moved = true;
    }

    view.tx = drag.startTx + dx;
    view.ty = drag.startTy + dy;
    updateTransform();
  }

  function handleDragEnd() {
    drag.isDragging = false;
    stage.style.cursor = '';
  }

  // ===== 高亮朝代 =====
  function highlightDynasty(dynasty) {
    const allNodes = nodesGroup.querySelectorAll('.fish-node');
    const allBranches = branchesGroup.querySelectorAll('.tree-branch');

    if (dynasty === 'all') {
      allNodes.forEach(function(n) { n.classList.remove('is-dimmed'); });
      allBranches.forEach(function(b) {
        b.classList.remove('is-highlighted', 'is-dimmed');
      });
      return;
    }

    // 找出该朝代及之前的所有节点（演化路径上的）
    const dynOrder = ['ancient', 'song', 'ming', 'qing', 'modern'];
    const dynIdx = dynOrder.indexOf(dynasty);
    const activeIds = {};

    data.varieties.forEach(function(v) {
      const vIdx = dynOrder.indexOf(v.dynasty || 'ancient');
      if (vIdx <= dynIdx) {
        activeIds[v.id] = true;
      }
    });

    allNodes.forEach(function(n) {
      const id = n.getAttribute('data-id');
      if (activeIds[id]) {
        n.classList.remove('is-dimmed');
      } else {
        n.classList.add('is-dimmed');
      }
    });

    allBranches.forEach(function(b) {
      const to = b.getAttribute('data-to');
      const from = b.getAttribute('data-from');
      if (activeIds[to] && activeIds[from]) {
        b.classList.add('is-highlighted');
        b.classList.remove('is-dimmed');
      } else {
        b.classList.remove('is-highlighted');
        b.classList.add('is-dimmed');
      }
    });
  }

  // ===== 选中节点 =====
  let selectedId = null;

  function selectNode(nodeId) {
    // 取消之前选中
    if (selectedId && nodeMap[selectedId]) {
      nodeMap[selectedId].classList.remove('is-selected');
    }

    selectedId = nodeId;
    if (nodeMap[nodeId]) {
      nodeMap[nodeId].classList.add('is-selected');
    }
  }

  // ===== 事件绑定 =====
  function bindEvents() {
    // 画布拖拽
    stage.addEventListener('mousedown', handleDragStart);
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);

    // 触摸拖拽
    stage.addEventListener('touchstart', function(e) {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      if (e.target.closest && e.target.closest('.fish-node')) return;
      drag.isDragging = true;
      drag.moved = false;
      drag.startX = t.clientX;
      drag.startY = t.clientY;
      drag.startTx = view.tx;
      drag.startTy = view.ty;
    }, { passive: true });

    stage.addEventListener('touchmove', function(e) {
      if (!drag.isDragging || e.touches.length !== 1) return;
      const t = e.touches[0];
      const dx = t.clientX - drag.startX;
      const dy = t.clientY - drag.startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) drag.moved = true;
      view.tx = drag.startTx + dx;
      view.ty = drag.startTy + dy;
      updateTransform();
    }, { passive: true });

    stage.addEventListener('touchend', function() {
      drag.isDragging = false;
    });

    // 滚轮缩放
    stage.addEventListener('wheel', function(e) {
      e.preventDefault();
      const rect = stage.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      zoomAt(factor, cx, cy);
    }, { passive: false });

    // 缩放按钮
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const resetBtn = document.getElementById('reset-view');

    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', function() {
        zoomAt(1.25, view.width / 2, view.height / 2);
      });
    }
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', function() {
        zoomAt(0.8, view.width / 2, view.height / 2);
      });
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', resetView);
    }

    // 节点点击（事件委托）
    nodesGroup.addEventListener('click', function(e) {
      if (drag.moved) return; // 拖拽中不触发点击

      const nodeEl = e.target.closest('.fish-node');
      if (!nodeEl) return;

      const id = nodeEl.getAttribute('data-id');
      if (!id) return;

      selectNode(id);
      focusNode(id);
      createRipple(e.clientX, e.clientY);

      // 触发自定义事件
      const evt = new CustomEvent('goldfish:select', { detail: { id: id } });
      document.dispatchEvent(evt);
    });

    // 顶部导航切换
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(function(item) {
      item.addEventListener('click', function() {
        const dyn = item.getAttribute('data-dynasty');
        navItems.forEach(function(n) { n.classList.remove('active'); });
        item.classList.add('active');
        highlightDynasty(dyn);

        const evt = new CustomEvent('goldfish:dynasty', { detail: { dynasty: dyn } });
        document.dispatchEvent(evt);
      });
    });
  }

  // ===== 水波涟漪 =====
  function createRipple(x, y) {
    const container = document.getElementById('ripple-container');
    if (!container) return;

    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    container.appendChild(ripple);

    setTimeout(function() {
      ripple.remove();
    }, 800);
  }

  // ===== 初始化 =====
  let layoutNodes = [];
  let branchDrawOrder = [];

  function init() {
    layoutNodes = computeLayout();
    branchDrawOrder = drawBranches(layoutNodes);
    drawNodes(layoutNodes);
    bindEvents();

    // 延迟启动动画
    setTimeout(function() {
      animateBranches(branchDrawOrder);
    }, 300);
  }

  // 窗口大小变化时重新布局
  let resizeTimer = null;
  window.addEventListener('resize', function() {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      const savedSelected = selectedId;
      layoutNodes = computeLayout();
      branchDrawOrder = drawBranches(layoutNodes);
      drawNodes(layoutNodes);
      // 保持选中状态
      if (savedSelected && nodeMap[savedSelected]) {
        nodeMap[savedSelected].classList.add('is-selected');
      }
      // 重置视口
      resetView();
    }, 200);
  });

  // 暴露 API
  window.GoldfishTree = {
    init: init,
    selectNode: selectNode,
    focusNode: focusNode,
    highlightDynasty: highlightDynasty,
    resetView: resetView,
    createFishSvg: createFishSvg,
    assembleFish: assembleFish,
    getNodeMap: function() { return nodeMap; },
    getSelected: function() { return selectedId; }
  };

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
