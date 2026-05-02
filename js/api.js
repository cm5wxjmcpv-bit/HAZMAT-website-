// SECURITY NOTE: This localStorage API emulates backend endpoints only for POC.
// In Firebase, enforce per-user data access with Firestore security rules.
const Api = (() => {
  const getUserProfile = userId => Storage.table('studentProfiles').find(p => p.userId === userId) || null;
  const saveUserProfile = profile => Storage.upsert('studentProfiles', profile, 'userId');

  const getModuleProgress = (userId, moduleId) => Storage.table('progress').find(p => p.userId === userId && p.moduleId === moduleId) || null;
  const saveModuleProgress = progress => {
    const key = `${progress.userId}_${progress.moduleId}`;
    progress._key = key;
    return Storage.upsert('progress', progress, '_key');
  };

  const getAllProgressForUser = userId => Storage.table('progress').filter(p => p.userId === userId);
  const getTestAttempts = userId => Storage.table('testAttempts').filter(a => a.userId === userId);
  const saveTestAttempt = attempt => Storage.insert('testAttempts', attempt);
  const getLatestPassedAttempt = userId => Storage.table('testAttempts').filter(a => a.userId === userId && a.passed).sort((a,b)=>new Date(b.completedAt)-new Date(a.completedAt))[0] || null;

  const getCertificate = userId => Storage.table('certificates').find(c => c.userId === userId) || null;
  const saveCertificate = cert => Storage.upsert('certificates', cert, 'userId');

  const getTprQueueRecord = userId => Storage.table('tprQueue').find(r => r.userId === userId) || null;
  const saveTprQueueRecord = rec => Storage.upsert('tprQueue', rec, 'userId');

  return { getUserProfile, saveUserProfile, getModuleProgress, saveModuleProgress, getAllProgressForUser, getTestAttempts, saveTestAttempt, getLatestPassedAttempt, getCertificate, saveCertificate, getTprQueueRecord, saveTprQueueRecord };
})();
