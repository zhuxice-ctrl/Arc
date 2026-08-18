// 全局状态管理：虫谱收藏 + 夜晚手账
// 使用 localStorage 持久化

const COLLECTION_KEY = 'bugcall_collection';
const JOURNAL_KEY = 'bugcall_journal';

function useBugStore() {
  const [collection, setCollection] = React.useState(() => {
    try {
      const saved = localStorage.getItem(COLLECTION_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [journal, setJournal] = React.useState(() => {
    try {
      const saved = localStorage.getItem(JOURNAL_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // 持久化
  React.useEffect(() => {
    localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
  }, [collection]);

  React.useEffect(() => {
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(journal));
  }, [journal]);

  const addToCollection = React.useCallback((insectId, insectName) => {
    setCollection(prev => {
      if (prev.includes(insectId)) return prev;
      return [...prev, insectId];
    });
  }, []);

  const addJournalEntry = React.useCallback((entry) => {
    setJournal(prev => [entry, ...prev]);
  }, []);

  const resetAll = React.useCallback(() => {
    setCollection([]);
    setJournal([]);
  }, []);

  return {
    collection,
    journal,
    addToCollection,
    addJournalEntry,
    resetAll,
    isCollected: (id) => collection.includes(id)
  };
}

// 用 Context 跨组件传递
const BugContext = React.createContext(null);

function BugProvider({ children }) {
  const store = useBugStore();
  return <BugContext.Provider value={store}>{children}</BugContext.Provider>;
}

function useBug() {
  const ctx = React.useContext(BugContext);
  if (!ctx) throw new Error('useBug must be used within BugProvider');
  return ctx;
}

window.BugProvider = BugProvider;
window.useBug = useBug;
window.BugContext = BugContext;
