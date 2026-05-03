const Storage = (() => {
  const emptyDb = () => ({ users: [], studentProfiles: [], progress: [], testAttempts: [], certificates: [], tprQueue: [] });

  function getDb() {
    const raw = localStorage.getItem(APP_CONFIG.localStorageKey);
    if (!raw) return emptyDb();
    try { return JSON.parse(raw); } catch { return emptyDb(); }
  }
  function saveDb(db) { localStorage.setItem(APP_CONFIG.localStorageKey, JSON.stringify(db)); }
  function init() {
    const db = getDb();
    if (!db.users.some(u => u.role === 'admin')) {
      db.users.push({ id: crypto.randomUUID(), email: 'admin@hazmat.local', password: 'admin123', role: 'admin', createdAt: new Date().toISOString(), paid: true, profileComplete: true });
    }
    saveDb(db);
  }
  function table(name) { return getDb()[name] || []; }
  function upsert(tableName, item, key = 'id') {
    const db = getDb();
    const idx = db[tableName].findIndex(x => x[key] === item[key]);
    if (idx >= 0) db[tableName][idx] = item; else db[tableName].push(item);
    saveDb(db);
    return item;
  }
  function insert(tableName, item) {
    const db = getDb(); db[tableName].push(item); saveDb(db); return item;
  }
  return { getDb, saveDb, init, table, upsert, insert };
})();
Storage.init();
