/* For Mother - chapters/chapter1. Shared state stays inside the runtime closure. */
((game) => {
  "use strict";

  game.SCENES.Chapter1 = function Chapter1() {
    game.setupChapter(1, "Pilah Sampah", game.ASSETS.bg.c1, 0);
    game.runtime.sorted = 0;
    const saved = (game.state.chapterProgress.chapter1 ||= {});
    saved.disposed ||= [];
    saved.positions ||= {};
    game.runtime.total = game.difficulty().trash;
    game.runtime.sorted = saved.disposed.length;
    game.runtime.captureChapterProgress = () => {
      saved.held = game.runtime.held?.id || null;
      saved.bonuses = game.runtime.bonusFlags;
    };
    game.runtime.bonusFlags = saved.bonuses || {};
    game.runtime.held = null;
    const releaseButton = document.createElement("button");
    releaseButton.type = "button";
    releaseButton.className = "organize-carry-label";
    releaseButton.style.pointerEvents = "auto";
    releaseButton.textContent = "[R] Lepas sampah";
    releaseButton.hidden = true;
    game.els.ui.append(releaseButton);
    game.releaseChapter1Trash = () => {
      if (
        game.state.scene !== "Chapter1" ||
        !game.runtime.held ||
        game.dialogActive ||
        game.pauseActive ||
        game.miniGameActive ||
        game.cutsceneActive ||
        game.transitionActive ||
        game.runtime.chapterIntroActive ||
        game.runtime.completed
      )
        return;
      const held = game.runtime.held;
      const { x, y } = game.player;
      game.runtime.held = null;
      saved.held = null;
      saved.positions[held.id] = [x, y];
      Object.assign(held.it, game.resolveInteractionPoint(x, y), {
        enabled: true,
      });
      held.e.classList.remove("held-item", "carried-trash");
      held.e.style.pointerEvents = "";
      held.e.style.left = (x / game.W) * 100 + "%";
      held.e.style.top = (y / game.H) * 100 + "%";
      held.e.style.zIndex = Math.floor(y);
      releaseButton.hidden = true;
      game.toast("Sampah dilepas. Bisa diambil lagi.");
      game.save("Chapter1");
    };
    releaseButton.onclick = () => game.releaseChapter1Trash();
    game.addUpdater(() => {
      releaseButton.hidden =
        !game.runtime.held ||
        game.dialogActive ||
        game.pauseActive ||
        game.miniGameActive ||
        game.cutsceneActive ||
        game.transitionActive ||
        game.runtime.chapterIntroActive ||
        game.runtime.completed;
    });
    const bins = [
      ["organic", 320, 330, game.ASSETS.trash.organic],
      ["nonorganic", 1350, 330, game.ASSETS.trash.nonorganic],
    ];
    bins.forEach(([type, x, y, src]) => {
      const e = game.img(src, "object", x, y, 145);
      const bin = game.interact(
        "bin_" + type,
        x,
        y,
        "Buang",
        () => dropTrash(type),
        true,
        e,
      );
      // Explicitly preserve the blue debug/interact area around each bin.
      bin.radius = 100;
    });
    const data = [
      ["banana", "organic", 520, 650],
      ["food", "organic", 720, 580],
      ["paper", "nonorganic", 900, 670],
      ["can", "nonorganic", 1080, 570],
      ["bag", "nonorganic", 660, 400],
      ["bottle", "nonorganic", 1120, 420],
    ];
    const activeTrashIds = new Set(
      Array.from(
        { length: game.runtime.total },
        (_, index) => `${data[index % data.length][0]}-${index}`,
      ),
    );
    saved.disposed = [...new Set(saved.disposed)].filter((id) =>
      activeTrashIds.has(id),
    );
    if (saved.held && !activeTrashIds.has(saved.held)) saved.held = null;
    Object.keys(saved.positions).forEach((id) => {
      if (!activeTrashIds.has(id)) delete saved.positions[id];
    });
    game.runtime.sorted = saved.disposed.length;
    const trashPositions = game.spawnLayout(
      "trash",
      game.runtime.total,
      "spawnAreaCleaning",
      80,
      [
        [320, 330, 110],
        [1350, 330, 110],
      ],
    );
    Array.from(
      { length: game.runtime.total },
      (_, index) => data[index % data.length],
    ).forEach(([asset, type], index) => {
      const id = `${asset}-${index}`;
      const [x, y] = saved.positions[id] || trashPositions[index];
      const e = game.img(game.ASSETS.trash[asset], "object", x, y, 64, id);
      const it = game.interact(
        id,
        x,
        y,
        "Ambil",
        () => {
          if (game.runtime.held)
            return game.toast("Kamu hanya dapat membawa satu benda.");
          game.runtime.held = { id, type, e, it };
          game.AudioManager.playSFX("trash_pickup", {
            level: 0.8,
            vary: 0.04,
            cooldown: 100,
          });
          it.enabled = false;
          e.classList.add("held-item", "carried-trash");
          e.style.pointerEvents = "none";
          game.updateHeldItemPosition();
          game.toast("Sampah diambil · Tekan R untuk melepas");
          game.save("Chapter1");
        },
        false,
        e,
      );
      if (saved.disposed.includes(id)) {
        e.remove();
        it.enabled = false;
      } else if (saved.held === id) {
        game.runtime.held = { id, type, e, it };
        it.enabled = false;
        e.classList.add("held-item", "carried-trash");
        game.updateHeldItemPosition();
      }
    });
    game.updateClean(
      Math.round((game.runtime.sorted / game.runtime.total) * 100),
    );
    game.save("Chapter1");
    game.objective("Pilah semua sampah dengan benar");
    function dropTrash(type) {
      if (!game.runtime.held)
        return game.toast("Ambil sampah terlebih dahulu.");
      if (game.runtime.held.type !== type)
        return game.recordMistake("Jenis tong salah. Sampah masih dibawa.");
      const held = game.runtime.held;
      game.runtime.held = null;
      saved.disposed.push(held.id);
      saved.held = null;
      game.AudioManager.playSFX("trash_dispose", {
        level: 0.8,
        vary: 0.04,
        cooldown: 100,
      });
      held.e.classList.add("trash-drop-success");
      game.sceneTimeout(
        () => held.e.remove(),
        game.state.settings.motion ? 360 : 0,
      );
      game.runtime.sorted = Math.min(
        game.runtime.total,
        game.runtime.sorted + 1,
      );
      game.playCorrectSfx();
      if (
        (game.runtime.sorted === 2 || game.runtime.sorted === 4) &&
        !game.runtime.bonusFlags?.[`trash-${game.runtime.sorted}`]
      ) {
        game.runtime.bonusFlags ||= {};
        game.runtime.bonusFlags[`trash-${game.runtime.sorted}`] = true;
        game.grantTimeBonus(2, "BONUS BERSIH!");
      }
      game.updateClean(
        Math.round((game.runtime.sorted / game.runtime.total) * 100),
      );
      game.save("Chapter1");
      if (game.runtime.sorted === game.runtime.total) {
        game.startLumiEducation(1, () => game.finishChapter(1));
      }
    }
  };
})(window.ForMotherRuntime);
