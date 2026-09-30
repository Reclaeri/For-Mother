/* For Mother - chapters/chapter2. Shared state stays inside the runtime closure. */
((game) => {
  "use strict";

  game.SCENES.Chapter2 = function Chapter2() {
    game.setupChapter(2, "Hentikan Sumbernya", game.ASSETS.bg.c2, 0);
    const data = (game.state.chapterProgress.chapter2 ||= {});
    data.sources = { window: false, pipe: false, bin: false, ...data.sources };
    data.repairs ||= {};
    game.runtime.sources = data.sources;
    game.runtime.dirt = [];
    game.runtime.spawnClock = 0;
    game.runtime.stableClock = 0;
    const allRepaired = () => Object.values(data.sources).every(Boolean);
    game.runtime.queuedDialog = {
      lines: [
        {
          name: "Lumi",
          who: "lumi",
          text: "Andi, ruangan ini terus menjadi kotor karena ada beberapa masalah yang belum diperbaiki.",
        },
        {
          name: "Lumi",
          who: "lumi",
          text: "Kita harus mencari penyebabnya terlebih dahulu sebelum membersihkan.",
        },
      ],
    };
    const dirtPoints = game.spawnLayout("dirt", 11, "spawnAreaCleaning", 100, [
      [1115, 465, 110],
      [1220, 465, 110],
      [770, 290, 110],
    ]);
    const spawnPoints = {
      dust: dirtPoints.slice(0, 3),
      water: dirtPoints.slice(3, 6),
      trash: dirtPoints.slice(6, 9),
      stain: dirtPoints.slice(9),
    };
    const sourceFor = { dust: "window", water: "pipe", trash: "bin" };
    [
      [
        "window",
        770,
        150,
        770,
        290,
        175,
        game.ASSETS.dust.windowOpen,
        game.ASSETS.dust.windowClosed,
      ],
      [
        "pipe",
        1135,
        365,
        1115,
        465,
        145,
        game.ASSETS.dust.pipeBroken,
        game.ASSETS.dust.pipeFixed,
      ],
      [
        "bin",
        1250,
        420,
        1220,
        465,
        120,
        game.ASSETS.dust.binFallen,
        game.ASSETS.dust.binUp,
      ],
    ].forEach(([id, x, y, ix, iy, width, broken, fixed]) => {
      const e = game.img(
        data.sources[id] ? fixed : broken,
        "object source-prop",
        x,
        y,
        width,
        id,
      );
      e.classList.toggle("source-emitting", !data.sources[id]);
      e.classList.toggle("source-fixed", data.sources[id]);
      if (id === "window" && data.sources[id])
        game.showRepairEffect(
          game.A + "window_light_effect.png",
          x,
          y + 80,
          true,
        );
      let emission = null;
      if (id !== "bin" && !data.sources[id]) {
        emission = document.createElement("div");
        emission.className = `source-emission ${id}`;
        emission.style.left = `${(ix / game.W) * 100}%`;
        emission.style.top = `${(iy / game.H) * 100}%`;
        emission.innerHTML =
          '<i style="--i:0"></i><i style="--i:1"></i><i style="--i:2"></i><i style="--i:3"></i>';
        if (id === "window")
          emission.insertAdjacentHTML(
            "afterbegin",
            `<img class="source-window-dust" src="${game.ASSETS.dust.window}" alt="">`,
          );
        game.els.world.append(emission);
      }
      const complete = () => {
        if (data.sources[id]) return;
        data.sources[id] = true;
        e.src = fixed;
        e.classList.remove("source-emitting");
        e.classList.add("source-fixed");
        emission?.remove();
        it.enabled = false;
        if (id === "pipe") game.AudioManager.stopLoop("water_leak");
        if (id === "pipe")
          game.showRepairEffect(game.A + "water_fixed_effect.png", ix, iy);
        if (id === "window") {
          game.AudioManager.stopLoop("wind");
          game.showRepairEffect(
            game.A + "window_light_effect.png",
            x,
            y + 80,
            true,
          );
        }
        if (id === "window")
          game.AudioManager.playSFX("window_close", { level: 0.7 });
        if (id === "bin")
          game.runtime.dirt
            .filter((d) => d.type === "trash")
            .forEach((d) => {
              d.done = true;
              d.progress = 100;
              d.el.remove();
              d.interactable.enabled = false;
            });
        game.burst(ix, iy);
        game.floatingFeedback("SUMBER DIPERBAIKI!", ix, iy - 45);
        game.grantTimeBonus(2, "REPAIR BERHASIL!");
        refresh();
        game.save("Chapter2");
        if (allRepaired()) {
          game.toast(
            "Semua sumber aman. Bersihkan debu, genangan, dan noda lantai.",
          );
          game.startLumiEducation(2);
        }
      };
      const open = () => {
        if (data.sources[id]) return;
        const run = () =>
          game.startRepairSession(id, (data.repairs[id] ||= {}), complete);
        if (
          (id === "window" || id === "pipe") &&
          !data.repairs[id]?.introduced
        ) {
          data.repairs[id] ||= {};
          data.repairs[id].introduced = true;
          game.save("Chapter2");
          game.startDialog(
            [
              {
                name: "Lumi",
                who: "lumi",
                text:
                  id === "pipe"
                    ? "Air yang terus menetes membuat ruangan menjadi lembab."
                    : "Debu dari luar masuk melalui jendela yang rusak.",
              },
            ],
            run,
          );
        } else run();
      };
      const it = game.interact(
        id,
        ix,
        iy,
        game.repairDefinition(id).title,
        open,
        true,
        e,
      );
      it.repair = true;
      it.enabled = !data.sources[id];
    });
    const cleaningAllowed = () => {
      if (allRepaired()) return true;
      game.interactionHint(
        "Perbaiki pipa, jendela, dan tempat sampah terlebih dahulu.",
      );
      return false;
    };
    const spawnDirt = (type, point, restored = {}) => {
      const [x, y] = point;
      const id = `${type}-${x}-${y}`;
      const assets = {
        dust: [
          game.ASSETS.dust.table,
          game.ASSETS.dust.tableClean,
          "cloth",
          "Bersihkan debu",
        ],
        water: [
          game.ASSETS.water.large,
          game.ASSETS.water.dry,
          "mop",
          "Pel genangan air",
        ],
        stain: [
          game.ASSETS.final.drink,
          game.ASSETS.final.patch,
          "cloth",
          "Gosok noda lantai",
        ],
        trash: [
          game.ASSETS.dust.trashPile,
          null,
          "cloth",
          "Sampah sekitar tempat sampah",
        ],
      }[type];
      const item = game.addCleanable({
        visualW: 76,
        id,
        type,
        x,
        y,
        src: assets[0],
        cleanSrc: assets[1],
        tool: assets[2],
        name: assets[3],
        progress: restored.progress || 0,
        done: !!restored.done,
        canStart:
          type === "trash"
            ? () => {
                game.toast("Kumpulkan sampah saat memperbaiki tempat sampah.");
                return false;
              }
            : cleaningAllowed,
        onComplete: () => {
          refresh();
          game.save("Chapter2");
        },
      });
      if (item.done || (type === "trash" && data.sources.bin)) {
        item.done = true;
        item.progress = 100;
        item.el.remove();
        item.interactable.enabled = false;
      }
      game.runtime.dirt.push(item);
    };
    game.runtime.captureChapterProgress = () => {
      data.dirt = game.runtime.dirt.map(({ type, x, y, progress, done }) => ({
        type,
        x,
        y,
        progress,
        done,
      }));
    };
    if (Array.isArray(data.dirt) && data.dirt.length) {
      data.dirt.forEach((d) => {
        if (spawnPoints[d.type]) spawnDirt(d.type, [d.x, d.y], d);
      });
    } else {
      Object.entries(spawnPoints).forEach(([type, points]) =>
        points.slice(0, 2).forEach((point) => spawnDirt(type, point)),
      );
    }
    refresh();
    game.save("Chapter2");
    game.addUpdater((dt) => {
      if (!game.timerMayRun()) return;
      game.runtime.spawnClock += dt;
      if (game.runtime.spawnClock >= 7) {
        game.runtime.spawnClock = 0;
        let spawned = false;
        Object.entries(sourceFor).forEach(([type, source]) => {
          if (data.sources[source]) return;
          const point = spawnPoints[type].find(
            ([x, y]) =>
              !game.runtime.dirt.some(
                (d) => d.type === type && d.x === x && d.y === y,
              ),
          );
          if (point) {
            spawnDirt(type, point);
            spawned = true;
          }
        });
        if (spawned) {
          refresh();
          game.save("Chapter2");
          game.toast("Sumber yang belum diperbaiki membuat kotoran baru!");
        }
      }
      const stable =
        allRepaired() &&
        game.runtime.dirt.every((d) => d.done) &&
        !game.runtime.cleaning;
      game.runtime.stableClock = stable ? game.runtime.stableClock + dt : 0;
      if (game.runtime.stableClock >= 1) game.finishChapter(2);
    });
    function refresh() {
      const repaired = Object.values(data.sources).filter(Boolean).length;
      const cleaned = game.runtime.dirt.reduce(
        (sum, d) => sum + (d.done ? 1 : d.progress / 100),
        0,
      );
      game.updateClean(
        Math.round(
          (repaired / 3) * 45 +
            (game.runtime.dirt.length
              ? cleaned / game.runtime.dirt.length
              : 0) *
              55,
        ),
      );
      const remaining = (type) =>
        game.runtime.dirt.filter((d) => d.type === type && !d.done).length;
      game.objective(
        allRepaired()
          ? "Bersihkan akibatnya · sumber sudah aman"
          : "Periksa dan perbaiki tiga sumber masalah",
        [
          ["Pipa ditambal", data.sources.pipe],
          ["Jendela diperbaiki", data.sources.window],
          ["Tempat sampah dan area sekitar", data.sources.bin],
          [`Sisa debu: ${remaining("dust")}`, remaining("dust") === 0],
          [`Sisa genangan: ${remaining("water")}`, remaining("water") === 0],
          [`Sisa noda lantai: ${remaining("stain")}`, remaining("stain") === 0],
        ],
      );
    }
  };
})(window.ForMotherRuntime);
