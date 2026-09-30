/* For Mother - systems/restoration. Shared state stays inside the runtime closure. */
((game) => {
  "use strict";

  game.startFinalRestoration = function startFinalRestoration(
    progress,
    onDone,
  ) {
    if (game.runtime.restoration) return;
    if (progress.restored) {
      onDone();
      return;
    }
    game.runtime.restoration = true;
    game.cutsceneActive = true;
    game.lock();
    game.AudioManager.stopAllLoops();
    game.AudioManager.playSFX("sparkle", { level: 0.45, cooldown: 500 });
    game.els.view.classList.add("restoration-active");
    game.els.fx.querySelector(".vision")?.remove();
    game.els.modal.innerHTML = `<section class="final-restoration"><img src="${game.A}final_restoration_glow.png" alt="Cahaya pemulihan menyelimuti rumah"><div><small>UJIAN TERAKHIR SELESAI</small><h1>Rumah kembali nyaman.</h1><p>Setiap kepedulian kecil membawa harapan baru.</p></div></section>`;
    game.sceneTimeout(
      () =>
        game.AudioManager.playSFX("healing", {
          level: 0.45,
          rate: 0.9,
          cooldown: 1000,
        }),
      650,
      "restoration-healing",
    );
    game.sceneTimeout(
      () => {
        progress.restored = true;
        game.runtime.restoration = false;
        game.cutsceneActive = false;
        game.els.modal.replaceChildren();
        game.save("Chapter5");
        onDone();
      },
      game.state.settings.motion ? 3400 : 1500,
      "final-restoration",
    );
  };
})(window.ForMotherRuntime);
