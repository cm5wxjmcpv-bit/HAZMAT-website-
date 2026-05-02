const TestEngine = (() => {
  const questions = Array.from({ length: 25 }).map((_, i) => ({
    id: i + 1,
    question: `Hazmat compliance placeholder question #${i + 1}?`,
    choices: ['Option A', 'Option B', 'Option C', 'Option D'],
    answer: 0
  }));

  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

  function render(container, userId) {
    const selected = new Map();
    const randomized = shuffle(questions);
    container.innerHTML = '<h2>Final Test</h2>' + randomized.map((q, idx) => `
      <div class="card"><p><strong>${idx + 1}. ${q.question}</strong></p>
      ${q.choices.map((c, ci) => `<label><input type="radio" name="q_${q.id}" value="${ci}"> ${c}</label>`).join('')}</div>
    `).join('') + '<button id="submitTestBtn">Submit Test</button><p id="testMessage"></p>';

    container.querySelectorAll('input[type="radio"]').forEach(i => i.addEventListener('change', e => selected.set(Number(e.target.name.split('_')[1]), Number(e.target.value))));

    document.getElementById('submitTestBtn').addEventListener('click', () => {
      const startedAt = new Date().toISOString();
      let correct = 0;
      const answers = randomized.map(q => ({ questionId: q.id, selected: selected.get(q.id) ?? null, correct: q.answer }));
      answers.forEach(a => { if (a.selected === a.correct) correct++; });
      const score = Math.round((correct / questions.length) * 100);
      const passed = score >= APP_CONFIG.passPercent;
      const completedAt = new Date().toISOString();
      Api.saveTestAttempt({ userId, attemptId: crypto.randomUUID(), score, passed, answers, startedAt, completedAt });

      if (passed) {
        CertificateService.ensureCertificateAndTpr(userId, score, completedAt);
      }
      document.getElementById('testMessage').textContent = passed ? `Passed with ${score}%. Certificate generated.` : `Scored ${score}%. Minimum passing score is ${APP_CONFIG.passPercent}%. You may retake.`;
    });
  }
  return { render };
})();
