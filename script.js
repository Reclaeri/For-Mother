/* For Mother bootstrap: modules register once before inputs and the game loop. */
((game) => {
  "use strict";
  if (!game || game.booted) return;
  game.booted = true;
addEventListener("keydown", (e) => {
    if (game.bootLoading || game.runtime.portalLock) return;
    const k = e.key.toLowerCase();
    if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k))
      e.preventDefault();
    game.keys.add(k);
    if (e.repeat) return;
    if (k === "f2") {
      e.preventDefault();
      game.debugCollisions = !game.debugCollisions;
      game.drawDebug();
      game.toast(`Debug collision ${game.debugCollisions ? "aktif" : "nonaktif"}`);
      return;
    }
    if (k === "h" && !game.dialogActive && !game.pauseActive && !game.miniGameActive) {
      game.toggleChapterHud();
      return;
    }
    if (k === "escape") {
      if (game.runtime.repair) {
        e.preventDefault();
        game.runtime.repair.cancel();
        return;
      }
      if (game.runtime.chapterIntroActive) {
        e.preventDefault();
        return;
      }
      if (game.runtime.lumiEducation) {
        e.preventDefault();
        return;
      }
      if (game.runtime.trashSorting) {
        game.runtime.trashSorting.cancel();
        return;
      }
      if (game.runtime.investigating) {
        game.runtime.investigating.cancel();
        return;
      }
      if (game.runtime.cleaning) {
        game.runtime.cleaning.cancel(true);
        return;
      }
      if (game.pauseActive) {
        game.pauseActive = false;
        game.AudioManager.setPaused(false);
        game.els.modal.innerHTML = "";
      } else game.pause();
      return;
    }
    if ((k === "e" || k === "enter" || k === " ") && game.dialogActive) {
      game.advanceDialog();
      return;
    }
    if ((k === "e" || k === "enter" || k === " ") && game.runtime.lumiEducation) {
      e.preventDefault();
      game.runtime.lumiEducation.advance();
      return;
    }
    if (k === "e" && !game.dialogActive && !game.pauseActive && !game.miniGameActive && !game.runtime.chapterIntroActive) {
      if (game.currentTarget) {
        game.player.interactTimer = 0.22;
        game.face(game.player, game.currentTarget);
        const t = game.currentTarget;
        game.currentTarget = null;
        if (t.oncePerScene) t.enabled = false;
        t.action();
      } else game.runtime.onEmptyInteract?.();
    }
    if (k === "r") game.releaseChapter1Trash?.();
    if (k === "q" && !game.dialogActive && !game.pauseActive && !game.miniGameActive && !game.runtime.chapterIntroActive) game.runtime.onQ?.();
  });

addEventListener("keyup", (e) => game.keys.delete(e.key.toLowerCase()));

addEventListener("blur", () => { game.keys.clear(); game.runtime.repair?.release?.(); });

game.els.dialog.addEventListener("click", (event) => {
    event.preventDefault();
    if (game.dialogActive) game.advanceDialog();
  });

addEventListener("pointerdown", () => game.AudioManager.unlock(), {
    capture: true,
  });

addEventListener("keydown", () => game.AudioManager.unlock(), { capture: true });

document.addEventListener(
    "click",
    (event) => {
      if (event.target.closest("button:not(:disabled)"))
        game.AudioManager.playSFX("ui_click", { level: 0.55, cooldown: 45 });
    },
    true,
  );

window.ForMotherQA = {
    W: game.W,
    H: game.H,
    INTERACTION_RADIUS: game.INTERACTION_RADIUS,
    ASSETS: game.ASSETS,
    getState: () => structuredClone(game.state),
    distancePrompt: (d) => d <= game.INTERACTION_RADIUS,
    valid: game.valid,
    loadScene: game.loadScene,
    getAudioState: () => ({
      ...game.AudioManager.snapshot(),
      track: game.AudioManager.currentTrack,
      unlocked: game.AudioManager.unlocked,
      settings: { ...game.state.settings },
    }),
  };

game.loadScene("MainMenu");
game.showBoot();

requestAnimationFrame(game.loop);
  delete window.ForMotherRuntime;
})(window.ForMotherRuntime);
