const VideoTracker = (() => {
  // SECURITY NOTE: Player events are mocked for GitHub Pages; integrate Vimeo Player API later.
  function mount(container, userId, module) {
    const existing = Api.getModuleProgress(userId, module.id);
    let watchedSeconds = existing?.watchedSeconds || 0;
    let maxSecondReached = watchedSeconds;
    const requiredSeconds = module.durationSeconds;

    container.innerHTML = `
      <div class="card">
        <h3>Module Video: ${module.title}</h3>
        <p class="muted">Mock player for POC. Skipping ahead is blocked to enforce watch integrity.</p>
        <video id="mockVideo" width="100%" controls>
          <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4">
        </video>
        <p>Watched: <span id="watchedSec">0</span>s / Required: ${requiredSeconds}s</p>
        <div class="progress-wrap"><div id="watchProgress" class="progress-bar"></div></div>
        <p id="watchStatus" class="muted"></p>
      </div>`;

    const video = document.getElementById('mockVideo');
    const watchedEl = document.getElementById('watchedSec');
    const progressEl = document.getElementById('watchProgress');
    const statusEl = document.getElementById('watchStatus');

    video.addEventListener('loadedmetadata', () => {
      const seekTo = Math.min(watchedSeconds, video.duration || watchedSeconds);
      video.currentTime = seekTo;
    });

    video.addEventListener('seeking', () => {
      if (video.currentTime > maxSecondReached + 1.5) video.currentTime = maxSecondReached;
    });

    let lastTick = Date.now();
    const ticker = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - lastTick) / 1000);
      lastTick = now;
      if (!video.paused && !video.ended && elapsed > 0) {
        const allowedRate = video.playbackRate <= 1.25;
        const currentSecond = Math.floor(video.currentTime);
        maxSecondReached = Math.max(maxSecondReached, video.currentTime);
        if (allowedRate && currentSecond <= Math.floor(maxSecondReached) + 1) {
          watchedSeconds = Math.min(requiredSeconds, watchedSeconds + elapsed);
        }
        persist();
      }
    }, 1000);

    video.addEventListener('ended', persist);
    window.addEventListener('beforeunload', () => clearInterval(ticker));

    function persist() {
      const percentWatched = Math.min(100, Math.round((watchedSeconds / requiredSeconds) * 100));
      const completed = percentWatched >= module.requiredWatchPercent;
      watchedEl.textContent = String(watchedSeconds);
      progressEl.style.width = `${percentWatched}%`;
      statusEl.textContent = completed ? 'Module complete. You can return to dashboard.' : `Watch at least ${module.requiredWatchPercent}% to complete.`;

      Api.saveModuleProgress({ userId, moduleId: module.id, startedAt: existing?.startedAt || new Date().toISOString(), completedAt: completed ? new Date().toISOString() : null, watchedSeconds, requiredSeconds, percentWatched, completed });
    }
    persist();
  }
  return { mount };
})();
