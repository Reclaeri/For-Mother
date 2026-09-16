/* For Mother - chapters/chapter3. Shared state stays inside the runtime closure. */
((game) => {
  "use strict";

game.SCENES.Chapter3 = function Chapter3() {
      game.setupChapter(
        3,
        "Lumi Vision: Hidden Dirt Investigation",
        game.ASSETS.bg.c3,
        0,
      );
      const saved = game.state.chapterProgress.chapter3 ||= {};
      saved.stains ||= {};
      game.runtime.bonusFlags = saved.bonuses || {};
      game.runtime.phase = "INTRO";
      game.runtime.vision = false;
      game.runtime.visionEnergy = 100;
      game.runtime.marked = 0;
      game.runtime.cleaned = 0;
      game.runtime.hintClock = 0;
      game.runtime.revealStarted = false;
      const visionRadius = 315;
      const visionHud = document.createElement("div");
      visionHud.className = "vision-hud panel";
      visionHud.innerHTML =
        '<button class="vision-button" type="button">Q · LUMI VISION</button><div class="vision-energy"><i></i></div><small>ENERGI LUMI</small>';
      game.els.ui.append(visionHud);
      const visionParticles = document.createElement("div");
      visionParticles.className = "lumi-vision-particles";
      visionParticles.innerHTML = Array.from({ length: 16 }, (_, i) => `<i style="--i:${i};--x:${(i * 37) % 97}%;--y:${(i * 53) % 91}%"></i>`).join("");
      game.els.fx.append(visionParticles);
      const energyBar = visionHud.querySelector(".vision-energy i");
      const visionButton = visionHud.querySelector(".vision-button");
      const definitions = [
        {
          id: "corner-dust",
          name: "Debu di sudut",
          x: 565,
          y: 345,
          w: 125,
          h: 90,
          src: game.ASSETS.final.germ,
          tool: "cloth",
          help: "Gerakkan kemoceng perlahan di seluruh debu",
        },
        {
          id: "under-table",
          name: "Noda bawah meja",
          x: 720,
          y: 505,
          w: 155,
          h: 105,
          src: game.ASSETS.final.dark,
          tool: "cloth",
          help: "Gosok noda memanjang secara bolak-balik",
        },
        {
          id: "footprints",
          name: "Jejak kaki samar",
          x: 900,
          y: 400,
          w: 165,
          h: 100,
          src: game.ASSETS.water.foot,
          tool: "cloth",
          help: "Ikuti urutan jejak menggunakan kain",
        },
        {
          id: "hidden-trash",
          name: "Sampah tersembunyi",
          x: 1130,
          y: 520,
          w: 135,
          h: 105,
          src: game.ASSETS.dust.trashPile,
          tool: "cloth",
          help: "Gerakkan alat untuk mengangkat seluruh sampah",
        },
        {
          id: "water-mark",
          name: "Noda air",
          x: 520,
          y: 705,
          w: 155,
          h: 110,
          src: game.ASSETS.water.small,
          tool: "mop",
          help: "Dorong air menuju tepi dengan pel",
        },
        {
          id: "under-rug",
          name: "Debu bawah karpet",
          x: 820,
          y: 690,
          w: 170,
          h: 115,
          src: game.ASSETS.final.mud,
          tool: "cloth",
          help: "Bersihkan seluruh area di bawah karpet",
        },
        {
          id: "behind-box",
          name: "Noda belakang furnitur",
          x: 1240,
          y: 700,
          w: 150,
          h: 110,
          src: game.ASSETS.final.drink,
          tool: "mop",
          help: "Sikat noda membandel sampai seluruhnya pudar",
        },
      ];
      const count = game.difficulty().stains;
      const stainPositions = game.spawnLayout('stains',count,'spawnAreaStain',100);
      const selectedDefinitions = Array.from({length:count},(_,i)=>({...definitions[i%definitions.length],id:i<definitions.length?definitions[i].id:`stain-${i}`,name:`Noda ${i+1}`}));
      game.runtime.stains = selectedDefinitions.map((definition, index) => {
        const [x, y] = stainPositions[index];
        const data = { ...definition, x, y };
        const el = game.img(
          data.src,
          "object hidden-stain",
          data.x,
          data.y,
          82,
          data.id,
        );
        el.style.opacity = "0";
        const stain = {
          ...data,
          index,
          el,
          hidden: true,
          detected: false,
          marked: false,
          revealed: false,
          cleaned: false,
          progress: 0,
          ...saved.stains[data.id],
        };
        const marker = document.createElement("div");
        marker.className = "lumi-marker";
        marker.style.left = `${(data.x / game.W) * 100}%`;
        marker.style.top = `${(data.y / game.H) * 100}%`;
        game.els.fx.append(marker);
        stain.marker = marker;
        const inspect = game.interact(
          data.id,
          data.x,
          data.y,
          "Tandai noda",
          () => {
            if (
              game.runtime.phase !== "INVESTIGATION" ||
              !game.runtime.vision ||
              !stain.detected ||
              stain.marked
            )
              return;
            game.player.interactTimer = 0.22;
            markStain(stain);
          },
          false,
          el,
        );
        inspect.radius = 90;
        inspect.enabled = false;
        stain.inspect = inspect;
        return stain;
      });
      function setVision(on) {
        const allowed =
          game.runtime.phase === "INVESTIGATION" &&
          !game.dialogActive &&
          !game.cutsceneActive &&
          !game.pauseActive;
        const wasActive = game.runtime.vision;
        game.runtime.vision = !!on && allowed && game.runtime.visionEnergy > 0;
        if (game.runtime.vision && !wasActive)
          game.AudioManager.playSFX("lumi_vision_activate", {
            level: 0.75,
            cooldown: 350,
          });
        game.els.view.classList.toggle("lumi-vision-active", game.runtime.vision);
        visionParticles.classList.toggle("active", game.runtime.vision);
        game.runtime.lumi.el.classList.toggle("vision-glow", game.runtime.vision);
        visionButton.classList.toggle("active", game.runtime.vision);
        if (game.runtime.vision && !game.runtime.visionExplained) {
          game.runtime.visionExplained = true;
          game.toast("Lumi Vision menampilkan jejak debu halus dan kotoran tersembunyi.");
        }
      }
      function toggleVision() {
        if (
          game.runtime.phase !== "INVESTIGATION" ||
          game.dialogActive ||
          game.cutsceneActive ||
          game.pauseActive
        )
          return game.toast("Lumi Vision belum dapat digunakan.");
        if (!game.runtime.vision && game.runtime.visionEnergy < 8)
          return game.toast("Energi Lumi belum cukup.");
        setVision(!game.runtime.vision);
      }
      function markStain(stain) {
        if (stain.marked) return;
        game.resetLumiHint();
        stain.marked = true;
        game.playCorrectSfx();
        game.AudioManager.playSFX("hidden_dirt_found", {
          level: 0.8,
          vary: 0.03,
          cooldown: 120,
        });
        stain.hidden = false;
        stain.inspect.enabled = false;
        stain.marker.classList.add("marked");
        stain.el.style.opacity = "0";
        game.runtime.marked++;
        game.floatingFeedback("NODA DITEMUKAN!", stain.x, stain.y - 45, "magic");
        game.burst(stain.x, stain.y);
        game.objective(
          `Kotoran ditemukan: ${game.runtime.marked}/${game.runtime.stains.length}`,
        );
        game.runtime.hintClock = 0;
        game.save("Chapter3");
        if (game.runtime.marked === game.runtime.stains.length) {
          game.grantTimeBonus(3, "SEMUA NODA DITEMUKAN!");
          game.startLumiEducation(3, beginReveal);
        }
      }
      function beginReveal() {
        if (game.runtime.revealStarted) return;
        game.runtime.revealStarted = true;
        game.runtime.phase = "REVEAL";
        game.cutsceneActive = true;
        setVision(false);
        game.currentTarget = null;
        game.els.ui.querySelector(".prompt")?.remove();
        game.runtime.lumi.x = game.W / 2;
        game.runtime.lumi.y = game.H / 2;
        game.renderEntity(game.runtime.lumi);
        game.els.fx.classList.add("chapter3-reveal");
        game.runtime.stains.forEach((stain, i) =>
          game.sceneTimeout(
            () => {
              stain.revealed = true;
              stain.el.style.opacity = "1";
              stain.el.classList.add("revealed");
              stain.marker.classList.add("revealing");
            },
            100 + i * 100,
            `reveal-${i}`,
          ),
        );
        game.sceneTimeout(
          () =>
            game.startDialog(
              [
                { name: "Lumi", text: "Semua sumber kotoran sudah ditemukan!" },
                {
                  name: "Andi",
                  who: "andi",
                  p: "surprised",
                  text: "Jadi selama ini semua noda itu tersembunyi di ruangan ini?",
                },
                {
                  name: "Lumi",
                  text: "Benar. Sekarang cahayaku dapat memperlihatkan semuanya.",
                },
                {
                  name: "Andi",
                  who: "andi",
                  p: "determined",
                  text: "Baik. Saatnya membersihkannya sampai tuntas.",
                },
              ],
              beginCleaning,
            ),
          950,
          "chapter3RevealDialog",
        );
      }
      function beginCleaning() {
        game.cutsceneActive = false;
        game.runtime.phase = "CLEANING";
        game.els.fx.classList.remove("chapter3-reveal");
        game.runtime.lumi.x = game.player.x + 55;
        game.runtime.lumi.y = game.player.y + 25;
        game.renderEntity(game.runtime.lumi);
        visionButton.disabled = true;
        game.objective(`Noda dibersihkan: ${game.runtime.cleaned}/${game.runtime.stains.length}`);
        game.runtime.stains.forEach((stain) => {
          stain.marker.classList.remove("revealing");
          const clean = game.interact(
            `clean-${stain.id}`,
            stain.x,
            stain.y,
            `Bersihkan · ${stain.name}`,
            () => {
              if (game.runtime.phase !== "CLEANING" || stain.cleaned) return;
              if (stain.id === "hidden-trash") {
                game.startTrashSorting(() => {
                  stain.el.remove();
                  cleanStain(stain);
                }, 5);
                return;
              }
              const item = Object.assign(stain, {
                done: false,
                cleanSrc: null,
                interactable: clean,
                help: stain.help,
              });
              game.startCleaningSession({
                item,
                tool: stain.tool,
                onComplete: () => cleanStain(stain),
              });
            },
            false,
            stain.el,
          );
          stain.cleanInteraction = clean;
          if(stain.cleaned){stain.el.remove();clean.enabled=false;stain.marker.classList.add('cleaned');}
        });
      }
      function cleanStain(stain) {
        if (stain.cleaned) return;
        stain.cleaned = true;
        stain.cleanInteraction.enabled = false;
        stain.marker.classList.add("cleaned");
        stain.blocker?.classList.remove("shifted");
        game.runtime.cleaned++;
        if (game.runtime.cleaned === Math.ceil(game.runtime.stains.length / 2) && !game.runtime.bonusFlags?.chapter3HalfClean) {
          game.runtime.bonusFlags ||= {};
          game.runtime.bonusFlags.chapter3HalfClean = true;
          game.grantTimeBonus(2, "SETENGAH BERSIH!");
        }
        game.floatingFeedback("BERSIH! +10%", stain.x, stain.y - 45);
        game.updateClean(
          Math.round((game.runtime.cleaned / game.runtime.stains.length) * 100),
        );
        game.objective(`Noda dibersihkan: ${game.runtime.cleaned}/${game.runtime.stains.length}`);
        game.save("Chapter3");
        if (game.runtime.cleaned === game.runtime.stains.length) completeChapter3();
      }
      function completeChapter3() {
        if (game.runtime.phase === "COMPLETE") return;
        game.runtime.phase = "COMPLETE";
        game.runtime.completed = true;
        setVision(false);
        game.els.view.classList.add("chapter3-clean-complete");
        game.startDialog(
          [
            {
              name: "Andi",
              who: "andi",
              p: "relieved",
              text: "Sekarang aku mengerti. Ruangan yang terlihat bersih belum tentu benar-benar bersih.",
            },
            {
              name: "Lumi",
              text: "Karena itulah kita harus memeriksa tempat yang sering terlewat.",
            },
            {
              name: "Penyihir",
              who: "witch",
              text: "Ketelitianmu telah membuka jalan menuju obat ketiga.",
            },
          ],
          () => {
            game.runtime.completed = false;
            game.finishChapter(3);
          },
        );
      }
      game.runtime.onQ = toggleVision;
      game.runtime.onEmptyInteract = () => {
        if (game.runtime.phase === "INVESTIGATION" && game.runtime.vision)
          game.toast('Lumi: "Sepertinya tidak ada kotoran tersembunyi di sini."');
      };
      visionButton.onclick = toggleVision;
      game.addUpdater((dt) => {
        if (game.runtime.phase === "INVESTIGATION") {
          game.runtime.visionEnergy = Math.max(
            0,
            Math.min(
              100,
              game.runtime.visionEnergy + (game.runtime.vision ? -18 : 12) * dt,
            ),
          );
          if (game.runtime.visionEnergy <= 0 && game.runtime.vision) {
            setVision(false);
            game.toast("Energi Lumi habis. Tunggu hingga terisi kembali.");
          }
        }
        energyBar.style.width = `${game.runtime.visionEnergy}%`;
        const light = game.worldToScreen(game.runtime.lumi.x, game.runtime.lumi.y);
        game.els.view.style.setProperty("--vision-x", `${(light.x / game.W) * 100}%`);
        game.els.view.style.setProperty("--vision-y", `${(light.y / game.H) * 100}%`);
        game.runtime.stains.forEach((stain) => {
          if (game.runtime.phase !== "INVESTIGATION" || stain.marked) return;
          const near =
            game.runtime.vision && game.dist(game.runtime.lumi, stain) <= visionRadius;
          if (near) stain.detected = true;
          stain.el.style.opacity = near
            ? `${Math.max(0.25, 1 - game.dist(game.runtime.lumi, stain) / visionRadius)}`
            : "0";
          stain.el.classList.toggle("vision-detected", near);
          stain.inspect.enabled = near;
        });
      });
      game.runtime.marked = game.runtime.stains.filter(s=>s.marked).length;
      game.runtime.cleaned = game.runtime.stains.filter(s=>s.cleaned).length;
      game.runtime.captureChapterProgress = () => {
        saved.phase=game.runtime.phase; saved.bonuses=game.runtime.bonusFlags;
        game.runtime.stains.forEach(s=>{saved.stains[s.id]={marked:s.marked,cleaned:s.cleaned,progress:game.runtime.cleaning?.item.id===s.id?game.runtime.cleaning.item.progress:s.progress};});
      };
      const restoreCleaning = saved.phase === 'CLEANING' || saved.phase === 'REVEAL' || saved.phase === 'COMPLETE';
      game.save('Chapter3');
      game.startDialog(
        [
          {
            name: "Andi",
            who: "andi",
            p: "neutral",
            text: "Ruangan ini terlihat bersih. Apa ujiannya sudah selesai?",
          },
          {
            name: "Lumi",
            text: "Belum. Tidak semua kotoran dapat terlihat dengan mata biasa.",
          },
          {
            name: "Lumi",
            text: "Gunakan Lumi Vision dan periksa setiap sudut ruangan.",
          },
        ],
        () => {
          if(restoreCleaning || game.runtime.marked === game.runtime.stains.length) {
            game.runtime.stains.forEach(s=>{s.el.style.opacity='1';s.inspect.enabled=false;});
            beginCleaning();
            if(game.runtime.cleaned===game.runtime.stains.length) completeChapter3();
            return;
          }
          game.runtime.phase = "INVESTIGATION";
          game.objective(
            `Kotoran ditemukan: ${game.runtime.marked}/${game.runtime.stains.length} - Dekati noda dan tekan E untuk menandai.`,
          );
        },
      );
    };
})(window.ForMotherRuntime);
