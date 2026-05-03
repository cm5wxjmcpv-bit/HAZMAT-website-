const CertificateService = (() => {
  // Firebase migration: move certificate issuance + PDF generation to Cloud Functions.
  function addBusinessDays(isoDate, days) { const d = new Date(isoDate); let added = 0; while (added < days) { d.setDate(d.getDate() + 1); const day = d.getDay(); if (day !== 0 && day !== 6) added++; } return d.toISOString(); }
  const norm = {
    up: s => (s || '').trim().toUpperCase(),
    cdl: s => (s || '').replace(/\s+/g, '').toUpperCase(),
    state: s => (s || '').trim().toUpperCase().slice(0,2)
  };
  function ensureCertificateAndTpr(userId, completionDateIso) {
    const user = Storage.table('users').find(u => u.id === userId);
    if (!user || user.paid !== true || !Modules.allModulesCompleted(userId)) return false;
    const passedAttempt = Api.getLatestPassedAttempt(userId);
    if (!passedAttempt || Number(passedAttempt.score) < APP_CONFIG.passPercent) return false;
    const profile = Api.getUserProfile(userId);
    if (!profile) return false;
    const firstName = norm.up(profile.firstName), lastName = norm.up(profile.lastName), cdlOrClpNumber = norm.cdl(profile.cdlOrClpNumber), licenseState = norm.state(profile.licenseState);
    if (!Api.getCertificate(userId)) Api.saveCertificate({ userId, certificateId: `CERT-${Date.now()}`, issuedAt: new Date().toISOString(), trainingType: 'Hazmat ELDT Theory', providerName: APP_CONFIG.providerName, providerTprId: APP_CONFIG.providerTprId, studentName: [firstName, norm.up(profile.middleName), lastName, norm.up(profile.suffix)].filter(Boolean).join(' '), cdlOrClpNumber, licenseState, completionDate: completionDateIso });
    if (!Api.getTprQueueRecord(userId)) {
      if (!firstName || !lastName || !cdlOrClpNumber || !licenseState || profile.consentToSubmitTPR !== true) return false;
      Api.saveTprQueueRecord({ userId, queueId: `TPR-${Date.now()}`, status: 'pending_review', createdAt: new Date().toISOString(), submittedAt: null, submittedBy: null, rejectionReason: '', tprConfirmation: '', dueDate: addBusinessDays(completionDateIso, 2), studentName: [firstName, norm.up(profile.middleName), lastName, norm.up(profile.suffix)].filter(Boolean).join(' '), dateOfBirth: (profile.dateOfBirth || '').trim(), cdlOrClpNumber, licenseState, completionDate: completionDateIso, testScore: passedAttempt.score });
    }
    return true;
  }
  return { ensureCertificateAndTpr };
})();
