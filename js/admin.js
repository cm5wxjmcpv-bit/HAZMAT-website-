const AdminPage = (() => {
  function render(container, adminUser) {
    const db = Storage.getDb();
    const students = db.users.filter(u => u.role === 'student');

    const studentRows = students.map(u => {
      const profile = db.studentProfiles.find(p => p.userId === u.id);
      const attempts = db.testAttempts.filter(a => a.userId === u.id);
      const cert = db.certificates.find(c => c.userId === u.id);
      const tpr = db.tprQueue.find(t => t.userId === u.id);
      const progressCount = db.progress.filter(p => p.userId === u.id && p.completed).length;
      return `<tr>
        <td>${u.email}</td><td>${u.paid ? 'Yes' : 'No'} <button data-paid="${u.id}">${u.paid ? 'Set Unpaid' : 'Set Paid'}</button></td>
        <td>${profile ? `${profile.firstName} ${profile.lastName}` : '-'}</td>
        <td>${progressCount}/${MODULES.length}</td>
        <td>${attempts.length}</td>
        <td>${cert ? cert.certificateId : '-'}</td>
        <td>${tpr ? `<span class="badge status-${tpr.status}">${tpr.status}</span>` : '-'}</td>
        <td>${tpr ? `<button data-edit-tpr="${u.id}">Edit TPR</button>` : '-'}</td>
      </tr>`;
    }).join('');

    container.innerHTML = `<div class="card"><h2>Admin Panel</h2><p class="muted">Logged in as ${adminUser.email}</p>
      <div class="table-wrap"><table><thead><tr><th>Student</th><th>Paid</th><th>Name</th><th>Modules</th><th>Attempts</th><th>Certificate</th><th>TPR</th><th>Actions</th></tr></thead><tbody>${studentRows || '<tr><td colspan="8">No students yet.</td></tr>'}</tbody></table></div></div>
      <div id="tprEditor"></div>`;

    container.querySelectorAll('[data-paid]').forEach(btn => btn.onclick = () => {
      const user = db.users.find(x => x.id === btn.dataset.paid); user.paid = !user.paid; Storage.saveDb(db); render(container, adminUser);
    });
    container.querySelectorAll('[data-edit-tpr]').forEach(btn => btn.onclick = () => openTprEditor(container, btn.dataset.editTpr, adminUser));
  }

  function openTprEditor(container, userId, adminUser) {
    const tpr = Api.getTprQueueRecord(userId);
    if (!tpr) return;
    const editor = document.getElementById('tprEditor');
    editor.innerHTML = `<div class="card"><h3>Edit TPR Queue ${tpr.queueId}</h3>
      <label>Status</label><select id="tprStatus"><option>pending_review</option><option>ready_to_submit</option><option>submitted</option><option>rejected</option></select>
      <label>Rejection Reason</label><textarea id="tprRejection"></textarea>
      <label>Confirmation Notes</label><textarea id="tprConfirmation"></textarea>
      <button id="saveTprBtn">Save TPR Update</button></div>`;
    document.getElementById('tprStatus').value = tpr.status;
    document.getElementById('tprRejection').value = tpr.rejectionReason || '';
    document.getElementById('tprConfirmation').value = tpr.tprConfirmation || '';
    document.getElementById('saveTprBtn').onclick = () => {
      tpr.status = document.getElementById('tprStatus').value;
      tpr.rejectionReason = document.getElementById('tprRejection').value.trim();
      tpr.tprConfirmation = document.getElementById('tprConfirmation').value.trim();
      if (tpr.status === 'submitted') { tpr.submittedAt = new Date().toISOString(); tpr.submittedBy = adminUser.email; }
      Api.saveTprQueueRecord(tpr);
      render(container, adminUser);
    };
  }

  return { render };
})();
