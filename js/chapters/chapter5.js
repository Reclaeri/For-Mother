/* For Mother - chapters/chapter5. Shared state stays inside the runtime closure. */
((game) => {
  "use strict";

game.SCENES.Chapter5 = function Chapter5() {
      game.setupChapter(5, "Ujian Terakhir", game.ASSETS.bg.c5, 0);
      const data = game.state.chapterProgress.chapter5 ||= {};
      data.flags = { source:false, trash:false, organize:false, dust:false, stain:false, puddle:false, hidden:false, last:false, ...data.flags };
      const extraCount = game.difficulty().final - 8;
      const extraIds = Array.from({length:extraCount},(_,i)=>`extra-${i}`);
      Object.keys(data.flags).filter(id=>id.startsWith('extra-') && !extraIds.includes(id)).forEach(id=>delete data.flags[id]);
      extraIds.forEach(id=>{data.flags[id] ||= false;});
      const positions = game.spawnLayout('final',game.difficulty().final-1,'spawnAreaCleaning',100,[[1070,650,90],[835,350,100]]);
      const [trashPos,toyPos,...cleanPositions]=positions;
      data.repairs ||= {};
      data.scrub ||= {};
      data.bonuses ||= {};
      game.runtime.flags = data.flags;
      game.runtime.visionSeen = !!data.visionSeen;
      const visibleDone = () => ["source", "trash", "organize", "dust", "stain", "puddle", ...extraIds].every(id => data.flags[id]);
      const allDone = () => Object.values(data.flags).every(Boolean);
      const items = [];
      game.runtime.captureChapterProgress = () => {
        items.forEach(item => { data.scrub[item.id] = item.progress; });
      };
      const complete = (id, x, y) => {
        if (data.flags[id]) return;
        data.flags[id] = true;
        const count = Object.values(data.flags).filter(Boolean).length;
        if ((count === 3 || count === 5) && !data.bonuses[count]) {
          data.bonuses[count] = true;
          game.grantTimeBonus(2, "BONUS KETEKUNAN!");
        }
        game.burst(x, y);
        refresh();
        game.save("Chapter5");
      };
      const window = game.img(data.flags.source ? game.ASSETS.dust.windowClosed : game.ASSETS.dust.windowOpen, "object", 835, 170, 255, "final-window");
      const repair = game.interact("source", 835, 350, "Perbaiki pengunci jendela", () => {
        game.startRepairSession("window", data.repairs.window ||= {}, () => {
          if (data.flags.source) return;
          window.src = game.ASSETS.dust.windowClosed;
          repair.enabled = false;
          game.AudioManager.playSFX("window_close", {level:.5});
          game.showRepairEffect(game.A + "window_light_effect.png", 835, 260, true);
          complete("source", 835, 350);
        });
      }, true, window);
      repair.repair = true;
      repair.enabled = !data.flags.source;
      if (data.flags.source) game.showRepairEffect(game.A + "window_light_effect.png", 835, 260, true);
      const trash = game.img(game.ASSETS.dust.trashPile, "object", ...trashPos, 85, "final-trash");
      const sort = game.interact("trash", ...trashPos, "Pilah sampah", () => game.startTrashSorting(() => {
        trash.remove(); sort.enabled = false; complete("trash", ...trashPos);
      }, 6), false, trash);
      if (data.flags.trash) { trash.remove(); sort.enabled = false; }
      const toys = game.img(data.flags.organize ? game.ASSETS.messy.neatToys : game.ASSETS.messy.toys, "object", data.flags.organize ? 1070 : toyPos[0], data.flags.organize ? 650 : toyPos[1], 85, "final-toys");
      const target = document.createElement("div");
      target.className = "organize-target";
      target.style.left = `${1070 / game.W * 100}%`; target.style.top = `${650 / game.H * 100}%`;
      target.innerHTML = "<span>Tempat mainan</span><small>Bawa mainan ke sini</small>";
      target.hidden = data.flags.organize;
      game.els.world.append(target);
      const pick = game.interact("organize", ...toyPos, "Ambil mainan", () => {
        if (game.runtime.held) return game.interactionHint("Antarkan barang yang sedang dibawa dahulu.");
        carry(); data.carried = true; game.AudioManager.playSFX("object_pickup", {level:.5}); game.save("Chapter5");
      }, false, toys);
      pick.enabled = !data.flags.organize;
      function carry() {
        game.runtime.held = {id:"final-toys", e:toys, it:pick};
        pick.enabled = false; toys.classList.add("held-item", "carried-trash");
        game.updateHeldItemPosition();
      }
      if (data.carried && !data.flags.organize) carry();
      const place = game.interact("place-final-toys", 1070, 650, "Letakkan mainan di tempatnya", () => {
        if (!game.runtime.held || game.runtime.held.id !== "final-toys") return game.interactionHint("Ambil mainan yang berantakan terlebih dahulu.");
        game.runtime.held = null; data.carried = false; target.hidden = true; place.enabled = false;
        toys.classList.remove("held-item", "carried-trash");
        toys.style.left = `${1070/game.W*100}%`; toys.style.top = `${650/game.H*100}%`; toys.style.zIndex = 650;
        toys.src = game.ASSETS.messy.neatToys;
        game.playCorrectSfx(); complete("organize", 1070, 650);
      }, false, target);
      place.enabled = !data.flags.organize;
      [
        ["dust", "Bersihkan debu", game.ASSETS.dust.window, game.ASSETS.dust.windowClean, "cloth", 930, 540],
        ["stain", "Hilangkan noda", game.ASSETS.final.mud, game.ASSETS.final.patch, "mop", 1120, 430],
        ["puddle", "Pel genangan", game.ASSETS.water.large, game.ASSETS.water.dry, "mop", 1230, 650],
        ["hidden", "Noda tersembunyi", game.ASSETS.final.dirty, game.ASSETS.final.clean, "cloth", 620, 470],
        ["last", "Kuman terakhir", game.ASSETS.final.germ, game.ASSETS.final.clean, "cloth", 840, 450],
      ].concat(extraIds.map((id,i)=>[id,`Noda tambahan ${i+1}`,i%2?game.ASSETS.final.drink:game.ASSETS.water.small,game.ASSETS.final.patch,i%2?'cloth':'mop'])).forEach(([id, name, src, cleanSrc, tool],index) => {
        const [x,y]=cleanPositions[index];
        const item = game.addCleanable({visualW:76,id, name, src, cleanSrc, tool, x, y, removeOnClean:true,
          progress:data.scrub[id] || 0, done:!!data.flags[id],
          canStart: () => {
            if (!data.flags.source) { game.interactionHint("Perbaiki sumber debu sebelum membersihkan."); return false; }
            return true;
          }, onComplete: () => complete(id,x,y),
        });
        items.push(item);
        if (id === "hidden") {
          item.marked = !!data.hiddenMarked;
          item.interactable.action = () => {
            const clean = () => game.startCleaningSession({item, tool, onComplete:()=>complete(id,x,y)});
            if (item.marked) clean();
            else game.startInvestigationSession(item, () => {
              data.hiddenMarked = true; item.marked = true; game.save("Chapter5"); clean();
            });
          };
          game.runtime.hiddenFinal = {e:item.el, it:item.interactable};
        }
        if (item.done) { item.el.remove(); item.interactable.enabled = false; }
      });
      game.runtime.onQ = () => {
        if (!visibleDone()) return game.interactionHint("Selesaikan semua misi yang terlihat terlebih dahulu.");
        if (data.visionSeen) return game.interactionHint("Periksa cahaya Lumi untuk menemukan nodanya.");
        data.visionSeen = game.runtime.visionSeen = true;
        game.AudioManager.playSFX("lumi_vision_activate", {level:.65, cooldown:500});
        game.els.fx.insertAdjacentHTML("beforeend", '<div class="vision"></div>');
        game.toast("Cahaya Lumi menunjukkan noda. Periksa lalu bersihkan.");
        refresh(); game.save("Chapter5");
      };
      function refresh() {
        const count = Object.values(data.flags).filter(Boolean).length;
        game.updateClean(allDone() ? 100 : Math.round(count / game.difficulty().final * 99));
        const hidden = items.find(item=>item.id === "hidden");
        const last = items.find(item=>item.id === "last");
        if (hidden && !hidden.done) {
          hidden.el.style.opacity = data.visionSeen ? "1" : "0";
          hidden.interactable.enabled = !!data.visionSeen;
        }
        if (last && !last.done) {
          last.el.style.opacity = data.flags.hidden ? "1" : "0";
          last.interactable.enabled = !!data.flags.hidden;
        }
        game.objective(visibleDone() && !data.visionSeen ? "Tekan Q untuk mencari noda tersembunyi" : "Satukan semua keterampilan Andi", [
          ["Sumber diperbaiki", data.flags.source], ["Sampah dipilah", data.flags.trash], ["Mainan ditata", data.flags.organize],
          ["Debu dan lantai bersih", data.flags.dust && data.flags.stain && data.flags.puddle],
          [`Pembersihan tambahan: ${extraIds.filter(id=>data.flags[id]).length}/${extraCount}`, extraIds.every(id=>data.flags[id])], ["Noda tersembunyi ditemukan", data.flags.hidden], ["Kuman terakhir dibersihkan", data.flags.last],
        ]);
      }
      refresh();
      game.save("Chapter5");
      game.addUpdater(() => {
        if (!game.timerMayRun() || game.runtime.finalClosing || !allDone()) return;
        game.runtime.finalClosing = true;
        game.startFinalRestoration(data, () => {
          const finish = () => game.finishChapter(5);
          if (!game.startLumiEducation(5, finish)) finish();
        });
      });
    };
})(window.ForMotherRuntime);
