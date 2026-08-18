// 临池日课 - 状态管理（全局 store + localStorage 持久化）

window.LINCHI_STORE = (function () {
  const STORAGE_KEY = 'linchi_app_state_v1';
  const TODAY = new Date().toISOString().split('T')[0];

  // 默认状态
  function getDefaultState() {
    return {
      // 用户
      user: {
        nickname: '墨池闲人',
        avatar: null,
      },
      // 日课连续天数
      streak: 3,
      lastPracticeDate: null,
      // 已临写的字（集字墙数据）
      // { char, steleId, steleName, score, imageData, date }
      collection: [],
      // 今日是否完成
      todayDone: false,
      todayChar: '永',
      todaySteleId: 'lanting',
      // 当前选中碑帖（用于碑帖→临写流程）
      currentSteleId: 'lanting',
      currentChar: '永',
      // 最近一次临写数据（用于叠影对比）
      lastWriting: null, // { imageData, char, steleId }
    };
  }

  // 加载状态
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // 初始化一些示例集字，让集字墙不为空
        const state = getDefaultState();
        state.collection = [
          { char: '之', steleId: 'lanting', steleName: '兰亭序', score: 82, date: '2026-08-17' },
          { char: '世', steleId: 'lanting', steleName: '兰亭序', score: 75, date: '2026-08-16' },
          { char: '九', steleId: 'jiucheng', steleName: '九成宫醴泉铭', score: 88, date: '2026-08-18' },
          { char: '泉', steleId: 'jiucheng', steleName: '九成宫醴泉铭', score: 79, date: '2026-08-15' },
          { char: '多', steleId: 'duobaota', steleName: '多宝塔碑', score: 71, date: '2026-08-14' },
        ];
        state.streak = 3;
        state.lastPracticeDate = '2026-08-18';
        // 如果昨天练过，今日 streak 保持
        saveState(state);
        return state;
      }
      const state = JSON.parse(raw);

      // 校验 streak 连续性
      if (state.lastPracticeDate && state.lastPracticeDate !== TODAY) {
        const last = new Date(state.lastPracticeDate);
        const today = new Date(TODAY);
        const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));
        if (diffDays > 1) {
          state.streak = 0; // 断了
        }
      }
      // 重置今日状态（如果是新的一天）
      if (state.lastPracticeDate !== TODAY) {
        state.todayDone = false;
      }
      return state;
    } catch (e) {
      console.error('loadState error:', e);
      return getDefaultState();
    }
  }

  // 保存状态
  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('saveState error:', e);
    }
  }

  // 简单的订阅发布
  let listeners = [];
  let state = loadState();

  function getState() {
    return state;
  }

  function setState(patch) {
    state = { ...state, ...patch };
    saveState(state);
    listeners.forEach(fn => fn(state));
  }

  function subscribe(fn) {
    listeners.push(fn);
    return () => {
      listeners = listeners.filter(f => f !== fn);
    };
  }

  // 动作：完成一次临写
  function completeWriting({ imageData, score }) {
    const newChar = state.currentChar;
    const stele = window.LINCHI_DATA.steles.find(s => s.id === state.currentSteleId);
    const newItem = {
      char: newChar,
      steleId: state.currentSteleId,
      steleName: stele ? stele.name : '',
      score: score || Math.floor(70 + Math.random() * 20),
      date: TODAY,
      imageData: imageData || null,
    };

    // 检查是否已在集字墙中（同碑帖同字只保留最好成绩）
    let collection = [...state.collection];
    const existingIdx = collection.findIndex(
      c => c.char === newChar && c.steleId === state.currentSteleId
    );
    if (existingIdx >= 0) {
      if (newItem.score > collection[existingIdx].score) {
        collection[existingIdx] = newItem;
      }
    } else {
      collection.push(newItem);
    }

    // 计算 streak
    let newStreak = state.streak;
    let todayDone = state.todayDone;
    let lastPracticeDate = state.lastPracticeDate;

    if (lastPracticeDate !== TODAY) {
      // 判断是否连续
      if (lastPracticeDate) {
        const last = new Date(lastPracticeDate);
        const today = new Date(TODAY);
        const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          newStreak = newStreak + 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }
      todayDone = true;
      lastPracticeDate = TODAY;
    }

    const newState = {
      ...state,
      collection,
      streak: newStreak,
      todayDone,
      lastPracticeDate,
      lastWriting: {
        imageData,
        char: newChar,
        steleId: state.currentSteleId,
        score: newItem.score,
      },
    };

    state = newState;
    saveState(state);
    listeners.forEach(fn => fn(state));
    return newItem;
  }

  // 重置（用于调试）
  function resetState() {
    localStorage.removeItem(STORAGE_KEY);
    state = getDefaultState();
    listeners.forEach(fn => fn(state));
  }

  return {
    getState,
    setState,
    subscribe,
    completeWriting,
    resetState,
    TODAY,
  };
})();
