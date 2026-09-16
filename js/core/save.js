/* For Mother - core/save. Shared state stays inside the runtime closure. */
((game) => {
  "use strict";

game.safeLoad = function safeLoad() {
    try {
      const x = JSON.parse(localStorage.getItem(game.SAVE_KEY));
      if (!x || typeof x !== "object") return null;
      const d = game.defaults();
      return game.synchronizeCollections({
        ...d,
        ...x,
        difficulty: game.DIFFICULTIES[x.difficulty] ? x.difficulty : "MEDIUM",
        clues: { ...d.clues, ...x.clues },
        chapters: d.chapters.map((v, i) => !!x.chapters?.[i]),
        medicines: d.medicines.map((v, i) => !!x.medicines?.[i]),
        knowledge: d.knowledge.map((v, i) => !!x.knowledge?.[i]),
        settings: { ...d.settings, ...x.settings },
        chapterProgress: { ...d.chapterProgress, ...x.chapterProgress },
        resume: x.resume && typeof x.resume === "object" ? x.resume : null,
      });
    } catch {
      return null;
    }
  };

game.captureResume = function captureResume() {
    if (!game.player.el || !game.state.scene || game.state.scene === "MainMenu") return;
    game.runtime.captureChapterProgress?.();
    game.state.resume = {
      scene: game.state.scene,
      player: { x: game.player.x, y: game.player.y, dir: game.player.dir },
      chapter: game.runtime.chapterTimer?.chapter || null,
      timerRemaining: game.runtime.chapterTimer?.remaining ?? null,
      timerBonus: game.runtime.chapterTimer?.bonus ?? 0,
      timerStarted: !!game.runtime.chapterTimer?.started,
      clean: game.runtime.clean ?? null,
      mistakes: game.runtime.mistakes ?? 0,
      savedAt: Date.now(),
    };
  };

game.save = function save(checkScene) {
    if (checkScene && checkScene !== "MainMenu") game.state.scene = checkScene;
    game.captureResume();
    localStorage.setItem(game.SAVE_KEY, JSON.stringify(game.state));
  };

game.resetGame = function resetGame() {
    const settings = { ...game.defaults().settings, ...game.state.settings };
    const difficulty = game.state.difficulty;
    game.state = game.defaults();
    game.state.difficulty = difficulty || "MEDIUM";
    game.state.settings = settings;
    localStorage.removeItem(game.SAVE_KEY);
  };

game.persistSettings = function persistSettings() {
    localStorage.setItem(game.SETTINGS_KEY, JSON.stringify(game.state.settings));
    document.body.classList.toggle("reduced-motion", !game.state.settings.motion);
    game.AudioManager.applyVolumes();
  };

game.restoreSettings = function restoreSettings() {
    try {
      game.state.settings = {
        ...game.defaults().settings,
        ...JSON.parse(localStorage.getItem(game.SETTINGS_KEY)),
      };
    } catch {
      game.state.settings = game.defaults().settings;
    }
    game.persistSettings();
  };
})(window.ForMotherRuntime);
