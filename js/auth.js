// Firebase migration: replace Auth module with Firebase Auth + ID token session validation.
const Auth = (() => {
  const sessionKey = 'hazmatSessionUserId';
  function signup(email, password) {
    const db = Storage.getDb();
    if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) throw new Error('Email already exists.');
    const user = { id: crypto.randomUUID(), email, password, role: 'student', createdAt: new Date().toISOString(), paid: false, profileComplete: false };
    db.users.push(user);
    db.studentProfiles.push({ userId: user.id, firstName: '', middleName: '', lastName: '', suffix: '', dateOfBirth: '', phone: '', address: '', city: '', state: '', zip: '', cdlOrClpNumber: '', licenseState: '', licenseUploadPlaceholder: '', consentToSubmitTPR: true, nameCertification: true });
    Storage.saveDb(db);
    return user;
  }
  function login(email, password) {
    const user = Storage.table('users').find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) throw new Error('Invalid credentials.');
    localStorage.setItem(sessionKey, user.id);
    return user;
  }
  function logout() { localStorage.removeItem(sessionKey); window.location.href = 'login.html'; }
  function currentUser() {
    try {
      const id = localStorage.getItem(sessionKey);
      if (!id) return null;
      const users = Storage.table('users');
      if (!Array.isArray(users)) return null;
      return users.find(u => u.id === id) || null;
    } catch { return null; }
  }
  function requireAuth(role) {
    const user = currentUser();
    if (!user) { logout(); return null; }
    if (role && user.role !== role) { window.location.href = user.role === 'admin' ? 'admin.html' : 'dashboard.html'; return null; }
    return user;
  }
  function requirePaidUser(role='student') {
    const user = requireAuth(role);
    if (!user) return null;
    if (user.paid !== true) { window.location.href = 'login.html'; return null; }
    return user;
  }
  return { signup, login, logout, currentUser, requireAuth, requirePaidUser };
})();
