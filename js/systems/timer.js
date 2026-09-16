/* For Mother - systems/timer. Shared state stays inside the runtime closure. */
((game) => {
  "use strict";

game.grantTimeBonus = function grantTimeBonus(seconds, label = "SMART CLEAN!") {
    const timer = game.runtime.chapterTimer;
    if (!timer || timer.expired || game.runtime.completed) return;
    const cap = 10;
    const available = Math.max(0, cap - (timer.bonus || 0));
    const gained = Math.min(seconds, available);
    if (!gained) return;
    timer.bonus = (timer.bonus || 0) + gained;
    timer.remaining += gained;
    game.updateChapterTimer();
    const popup = document.createElement("div");
    popup.className = "time-bonus-popup";
    popup.textContent = `+${gained} DETIK`;
    // Keep the reward in a dedicated top layer so HUD, objectives, and prompts
    // can never cover it.
    game.els.ui.append(popup);
    game.sceneTimeout(() => popup.remove(), game.state.settings.motion ? 1100 : 450);
    game.floatingFeedback(`${label} +${gained} DETIK`, game.player.x, game.player.y - 55, "bonus");
    game.AudioManager.playSFX("correct", { level: 0.55, rate: 1.15, cooldown: 180 });
    game.syncTimerWarning();
  };

game.formatTime = function formatTime(value) {
    const seconds = Math.max(0, Math.ceil(Number(value) || 0));
    return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  };

game.updateChapterTimer = function updateChapterTimer() {
    const timer = game.els.ui.querySelector(".chapter-timer");
    if (!timer || !game.runtime.chapterTimer) return;
    timer.textContent = game.formatTime(game.runtime.chapterTimer.remaining);
    const wrap = timer.closest(".timer-wrap");
    const critical = game.runtime.chapterTimer.remaining <= 15;
    wrap?.classList.toggle("warning", critical);
    if (critical && !game.runtime.chapterTimer.warningShown && game.runtime.chapterTimer.remaining <= 10) {
      game.runtime.chapterTimer.warningShown = true;
      game.floatingFeedback("WAKTU HAMPIR HABIS!", game.player.x, game.player.y - 70, "warning");
    }
    if (!critical) game.runtime.chapterTimer.warningShown = false;
  };

game.syncTimerWarning = function syncTimerWarning() {
    const timer = game.runtime.chapterTimer;
    const active = !!(timer && game.timerMayRun() && timer.remaining > 0 && timer.remaining < 15);
    if (active) {
      // Build urgency smoothly: quiet at 15 seconds, louder and faster as the
      // clock approaches zero. The player's SFX volume still caps the result.
      const urgency = Math.max(0, Math.min(1, (15 - timer.remaining) / 15));
      const sound = {
        level: 0.24 + urgency * 0.46,
        rate: 0.92 + urgency * 0.4,
      };
      timer.warningActive = true;
      // startLoop is idempotent, including after unmuting while already below 15s.
      game.AudioManager.startLoop("timer_warning", sound);
      game.AudioManager.updateLoop("timer_warning", sound);
    } else if (!active && timer?.warningActive) {
      timer.warningActive = false;
      game.AudioManager.stopLoop("timer_warning", 120);
    }
  };

game.timerMayRun = function timerMayRun(allowRepair = false) {
    return (
      game.runtime.chapterTimer?.started &&
      !game.runtime.chapterIntroActive &&
      !game.runtime.chapterTimer.expired &&
      !game.runtime.completed &&
      (!game.runtime.repair || allowRepair) &&
      !game.runtime.restoration &&
      !game.dialogActive &&
      !game.cutsceneActive &&
      !game.pauseActive &&
      !game.transitionActive &&
      !game.els.modal.children.length
    );
  };

game.updateChapterClock = function updateChapterClock(dt) {
    if (!game.timerMayRun()) {
      game.syncTimerWarning();
      return;
    }
    game.runtime.chapterTimer.remaining = Math.max(
      0,
      game.runtime.chapterTimer.remaining - dt,
    );
    game.updateChapterTimer();
    const timer = game.runtime.chapterTimer;
    game.syncTimerWarning();
    if (timer.remaining <= 15) {
      timer.lowTick = (timer.lowTick || 0) + dt;
      const interval = timer.remaining <= 5 ? 0.42 : 0.82;
      if (timer.lowTick >= interval) {
        timer.lowTick = 0;
        game.els.ui.querySelector(".timer-wrap")?.classList.add("timer-pulse");
        game.sceneTimeout(() => game.els.ui.querySelector(".timer-wrap")?.classList.remove("timer-pulse"), 180);
      }
    }
    if (game.runtime.chapterTimer.remaining <= 0) game.chapterTimeExpired();
  };

game.chapterTimeExpired = function chapterTimeExpired() {
    if (!game.runtime.chapterTimer || game.runtime.chapterTimer.expired) return;
    game.runtime.chapterTimer.expired = true;
    game.runtime.repair?.cancel?.(true);
    game.runtime.cleaning?.cancel?.(true, true);
    game.runtime.investigating?.cancel?.();
    game.runtime.trashSorting?.cancel?.();
    game.AudioManager.stopSceneAudio();
    game.miniGameActive = false;
    game.lock();
    const chapter = game.runtime.chapterTimer.chapter;
    game.els.modal.innerHTML = `<div class="completion time-up"><section class="card panel retry-card" role="dialog" aria-modal="true" aria-labelledby="retryTitle" aria-describedby="retryDescription"><div class="retry-emblem" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 7h20M14 41h20M17 7v9c0 4 7 8 7 8s7-4 7-8V7M17 41v-9c0-4 7-8 7-8s7 4 7 8v9"/><path d="m18 35 6-5 6 5z" fill="currentColor" stroke="none"/></svg></div><small class="retry-kicker">PERJALANAN BELUM BERAKHIR</small><h1 id="retryTitle">Waktu Habis</h1><p id="retryDescription">Ruangan belum selesai, tapi harapan untuk Ibu masih ada.<br>Tarik napas sejenak. Mari coba sekali lagi.</p><div class="retry-summary"><span>CHAPTER <b>${chapter}</b></span><span>MODE <b>${game.state.difficulty || 'MEDIUM'}</b></span><span>WAKTU <b>00:00</b></span></div><div class="retry-tip"><span aria-hidden="true">✦</span><p><strong>CATATAN LUMI</strong>Perhatikan urutan tugas dan petunjuk di layar. Hindari kesalahan agar waktumu tidak berkurang.</p></div><div class="retry-actions"><button class="btn" id="retryChapter" type="button"><span aria-hidden="true">↻</span> ULANGI CHAPTER</button><button class="btn secondary" id="timeMenu" type="button">KEMBALI KE MENU <span aria-hidden="true">→</span></button></div><small class="retry-footnote">Ulangi chapter ini dari awal dan coba strategi baru.</small></section></div>`;
    game.$("#retryChapter").onclick = game.restartChapter;
    game.$("#timeMenu").onclick = () => game.transition("MainMenu");
    game.$("#retryChapter").focus({preventScroll: true});
  };

game.recordMistake = function recordMistake(message) {
    const now = performance.now();
    if (game.runtime.lastMistake && now - game.runtime.lastMistake < 650) return false;
    game.runtime.lastMistake = now;
    game.runtime.mistakes = (game.runtime.mistakes || 0) + 1;
    if (game.runtime.chapterTimer && !game.runtime.chapterTimer.expired) {
      game.runtime.chapterTimer.remaining = Math.max(
        0,
        game.runtime.chapterTimer.remaining - 5,
      );
      game.updateChapterTimer();
      game.showTimePenalty(5);
    }
    game.toast(message || "Terjadi kesalahan.");
    game.floatingFeedback("AKSI SALAH! −5 DETIK", game.player.x, game.player.y - 55, "error");
    game.AudioManager.playSFX("error", { level: 0.22, rate: 0.7, cooldown: 400 });
    if (game.runtime.chapterTimer?.remaining <= 0) game.chapterTimeExpired();
    return true;
  };

game.showTimePenalty = function showTimePenalty(seconds) {
    const popup = document.createElement("div");
    popup.className = "time-penalty-popup";
    popup.innerHTML = `<strong>−${seconds}</strong><span>DETIK</span>`;
    game.els.ui.append(popup);
    game.sceneTimeout(() => popup.remove(), game.state.settings.motion ? 1150 : 650);
  };
})(window.ForMotherRuntime);
