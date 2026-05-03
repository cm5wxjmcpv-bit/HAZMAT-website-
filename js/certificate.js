const CertificateService = (() => {
  function addBusinessDays(isoDate, days) {
    const d = new Date(isoDate); let added = 0;
    while (added < days) { d.setDate(d.getDate() + 1); const day = d.getDay(); if (day !== 0 && day !== 6) added++; }
    return d.toISOString();
  }

  function ensureCertificateAndTpr(userId, score, completionDateIso) {
    if (!Api.getCertificate(userId)) {
      const profile = Api.getUserProfile(userId);
      const cert = {
        userId,
        certificateId: `CERT-${Date.now()}`,
        issuedAt: new Date().toISOString(),
        trainingType: 'Hazmat ELDT Theory',
        providerName: APP_CONFIG.providerName,
        providerTprId: APP_CONFIG.providerTprId,
        studentName: [profile?.firstName, profile?.middleName, profile?.lastName, profile?.suffix].filter(Boolean).join(' '),
        cdlOrClpNumber: profile?.cdlOrClpNumber || '',
        licenseState: profile?.licenseState || '',
        completionDate: completionDateIso
      };
      Api.saveCertificate(cert);
    }
    if (!Api.getTprQueueRecord(userId)) {
      const profile = Api.getUserProfile(userId);
      Api.saveTprQueueRecord({
        userId,
        queueId: `TPR-${Date.now()}`,
        status: 'pending_review',
        createdAt: new Date().toISOString(),
        submittedAt: null,
        submittedBy: null,
        rejectionReason: '',
        tprConfirmation: '',
        dueDate: addBusinessDays(completionDateIso, 2),
        studentName: [profile?.firstName, profile?.middleName, profile?.lastName, profile?.suffix].filter(Boolean).join(' '),
        dateOfBirth: profile?.dateOfBirth || '',
        cdlOrClpNumber: profile?.cdlOrClpNumber || '',
        licenseState: profile?.licenseState || '',
        completionDate: completionDateIso,
        testScore: score
      });
    }
  }
  return { ensureCertificateAndTpr };
})();
