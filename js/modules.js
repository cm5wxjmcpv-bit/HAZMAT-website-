const Modules = (() => {
  const isModuleComplete = (userId, moduleId) => (Api.getModuleProgress(userId, moduleId)?.completed) || false;
  function isModuleUnlocked(userId, moduleId) {
    const module = MODULES.find(m => m.id === moduleId);
    if (!module) return false;
    if (module.id === MODULES[0].id) return true;
    const prev = MODULES.filter(m => m.id < module.id);
    return prev.every(m => isModuleComplete(userId, m.id));
  }
  const allModulesCompleted = userId => MODULES.every(m => isModuleComplete(userId, m.id));
  return { isModuleComplete, isModuleUnlocked, allModulesCompleted };
})();
