/* For Mother - chapters/chapter4. Shared state stays inside the runtime closure. */
((game) => {
  "use strict";

game.SCENES.Chapter4 = function Chapter4() {
      game.setupChapter(4, "Rapi dan Terawat", game.ASSETS.bg.c4, 0);
      const data = game.state.chapterProgress.chapter4 ||= {};
      data.placed ||= {};
      data.fixed ||= {};
      data.repairs ||= {};
      data.cleaned ||= {};
      data.scrub ||= {};
      data.bonuses ||= {};
      game.runtime.eff = data.eff ?? 100;
      game.runtime.step = 0;
      game.runtime.mopped = !!data.cleaned.floor;
      const definitions = [
        ["books", "Buku", game.ASSETS.messy.books, game.ASSETS.messy.neatBooks, 520, 550, 490, 370, "Rak buku"],
        ["box", "Kotak", game.ASSETS.messy.box, game.ASSETS.messy.neatBox, 690, 680, 400, 680, "Sudut penyimpanan"],
        ["toys", "Mainan", game.ASSETS.messy.toys, game.ASSETS.messy.neatToys, 960, 600, 1220, 550, "Tempat mainan"],
        ["pillow", "Bantal", game.ASSETS.messy.pillow, game.ASSETS.messy.neatPillow, 850, 410, 1090, 350, "Dekat sofa"],
      ];
      const arranged = () => definitions.every(([id]) => data.placed[id]);
      const repairIds = Array.from({length:game.difficulty().repairs},(_,i)=>i<2?['chair','shelf'][i]:`furniture-${i}`);
      const positions = game.spawnLayout('furniture',repairIds.length+7+game.difficulty().extraStains,'spawnAreaRepair',120,[[490,370,120],[400,680,120],[1220,550,120],[1090,350,120],[900,450,120],[500,470,120]]);
      definitions.forEach((d,i)=>{d[4]=positions[i][0];d[5]=positions[i][1];});
      const repaired = () => repairIds.every(id=>data.fixed[id]);
      const readyToClean = () => arranged() && repaired() && data.cleaned.trash;
      const dustDone = () => data.cleaned.dustShelf && data.cleaned.dustTable;
      game.runtime.queuedDialog = { lines: [
        { name: "Lumi", who: "lumi", text: "Rumah ini perlu dirapikan dan dirawat. Bawa setiap barang ke tempatnya, lalu perbaiki kursi dan rak." },
        { name: "Andi", who: "andi", text: "Setelah itu, bersihkan debu dari atas sebelum membersihkan lantai." },
      ] };
      const carryLabel = document.createElement("div");
      carryLabel.className = "organize-carry-label";
      game.els.ui.append(carryLabel);
      definitions.forEach(([id, name, messy, neat, x, y, tx, ty, targetName]) => {
        const placed = !!data.placed[id];
        const e = game.img(placed ? neat : messy, "object", placed ? tx : x, placed ? ty : y, 90, `organize-${id}`);
        const marker = document.createElement("div");
        marker.className = "organize-target";
        marker.style.left = `${tx / game.W * 100}%`;
        marker.style.top = `${ty / game.H * 100}%`;
        marker.innerHTML = `<span>${targetName}</span><small>${name}</small>`;
        marker.hidden = placed;
        game.els.world.append(marker);
        const pick = game.interact(`pick-${id}`, x, y, `Ambil ${name}`, () => {
          if (game.runtime.held) return game.interactionHint("Antarkan barang yang sedang dibawa terlebih dahulu.");
          data.carried = id;
          carry();
          game.AudioManager.playSFX("trash_pickup", { level: .65 });
          refresh();
          game.save("Chapter4");
        }, false, e);
        pick.enabled = !placed;
        const drop = game.interact(`place-${id}`, tx, ty, `Letakkan ${name} · ${targetName}`, () => {
          if (!game.runtime.held) return game.interactionHint(`Bawa ${name.toLowerCase()} ke sini.`);
          if (game.runtime.held.id !== id) {
            game.runtime.eff = Math.max(0, game.runtime.eff - 5);
            game.recordMistake("Tempat ini tidak cocok. Perhatikan nama tujuan barang.");
            if (!game.runtime.chapterTimer.expired) game.showLumiHint({
              books: "Buku lebih baik diletakkan di tempat yang mudah ditemukan. Cari rak buku.",
              box: "Simpan kotak di sudut penyimpanan agar jalan tetap lapang.",
              toys: "Kumpulkan mainan di tempat mainan agar tidak tercecer.",
              pillow: "Bantal akan membuat sofa lebih nyaman. Bawa ke dekat sofa.",
            }[game.runtime.held.id]);
            game.save("Chapter4");
            return;
          }
          game.runtime.held = null;
          data.carried = null;
          data.placed[id] = true;
          marker.hidden = true;
          drop.enabled = false;
          e.classList.remove("held-item", "carried-trash");
          e.style.left = `${tx / game.W * 100}%`;
          e.style.top = `${ty / game.H * 100}%`;
          e.style.zIndex = Math.floor(ty);
          e.src = neat;
          game.playCorrectSfx();
          game.burst(tx, ty);
          game.floatingFeedback("POSISI BENAR!", tx, ty - 45);
          refresh();
          game.save("Chapter4");
        }, false, marker);
        drop.enabled = !placed;
        function carry() {
          pick.enabled = false;
          game.runtime.held = { id, e, it: pick };
          e.classList.add("held-item", "carried-trash");
          e.style.pointerEvents = "none";
          game.updateHeldItemPosition();
        }
        if (!placed && data.carried === id) carry();
      });
      repairIds.forEach((id,index) => {
        const kind = index%2===0 ? 'chair':'shelf';
        const name = `${kind==='chair'?'Kursi':'Rak'} ${index+1}`;
        const [x,y]=positions[index+4];
        const broken=game.A+(kind==='chair'?'kursi_rusak_ch4.png':'rak_rusak_ch4.png');
        const fixed=game.A+(kind==='chair'?'kursi_normal_ch4.png':'rak_normal_ch4.png');
        const e = game.img(data.fixed[id] ? fixed : broken, "object repair-furniture", x, y, 115, `repair-${id}`);
        const it = game.interact(`repair-${id}`, x, y, `Perbaiki ${name}`, () => {
          if (!arranged()) return game.interactionHint("Rapikan keempat barang terlebih dahulu agar area kerja aman.");
          game.startRepairSession(kind, data.repairs[id] ||= {}, () => {
            if (data.fixed[id]) return;
            data.fixed[id] = true;
            e.src = fixed;
            e.classList.add("source-fixed");
            it.enabled = false;
            game.burst(x, y);
            game.floatingFeedback(`${name.toUpperCase()} SUDAH KOKOH!`, x, y - 45);
            refresh();
            game.save("Chapter4");
          });
        }, true, e);
        it.repair = true;
        it.enabled = !data.fixed[id];
      });
      // Retain the existing rubbish minigame; Chapter 2 uses bin repair instead.
      const [trashPoint,stainPoint,floorPoint] = positions.slice(repairIds.length+4);
      const trash = game.img(game.ASSETS.dust.trashPile, "object", ...trashPoint, 85, "ch4-trash");
      const trashInteraction = game.interact("ch4-trash", ...trashPoint, "Buang sampah", () => {
        if (!arranged() || !repaired()) return game.interactionHint("Rapikan barang dan perbaiki perabot terlebih dahulu.");
        game.startTrashSorting(() => {
          data.cleaned.trash = true;
          trash.remove();
          trashInteraction.enabled = false;
          refresh();
          game.save("Chapter4");
        }, game.difficulty().sorting);
      }, false, trash);
      if (data.cleaned.trash) { trash.remove(); trashInteraction.enabled = false; }
      const cleaningTasks = [
        ["dustShelf", "Debu rak", game.ASSETS.dust.shelf, game.ASSETS.dust.shelfClean, "cloth", 900, 450],
        ["dustTable", "Debu meja", game.ASSETS.dust.table, game.ASSETS.dust.tableClean, "cloth", 500, 470],
        ["stain", "Noda lantai", game.ASSETS.final.drink, game.ASSETS.final.patch, "cloth", ...stainPoint],
        ["floor", "Pel lantai", game.ASSETS.water.large, game.ASSETS.water.dry, "mop", ...floorPoint],
      ];
      for(let i=0;i<game.difficulty().extraStains;i++) {
        const [x,y]=positions[repairIds.length+7+i];
        cleaningTasks.push([`extra-${i}`,`Noda lantai ${i+2}`,game.ASSETS.final.drink,game.ASSETS.final.patch,'cloth',x,y]);
      }
      const scrubItems = [];
      cleaningTasks.forEach(([id, name, src, cleanSrc, tool, x, y]) => {
        const isDust = id.startsWith("dust");
        const item = game.addCleanable({ id: `ch4-${id}`, name, src, cleanSrc, tool, x, y,
          progress: data.scrub[id] || 0, done: !!data.cleaned[id], removeOnClean: true,
          canStart: () => {
            if (!readyToClean()) { game.interactionHint("Selesaikan penataan, repair, dan pembuangan sampah dahulu."); return false; }
            if (!isDust && !dustDone()) {
              game.runtime.eff = Math.max(0, game.runtime.eff - 5);
              game.recordMistake("Bersihkan dari atas ke bawah.");
              game.save("Chapter4");
              if (!game.runtime.chapterTimer.expired)
                game.startDialog([{ name: "Lumi", who: "lumi", text: "Debu masih bisa jatuh, Andi. Kita harus membersihkan dari atas terlebih dahulu." }]);
              return false;
            }
            return true;
          },
          onComplete: () => {
            data.cleaned[id] = true;
            if (id === "floor") game.runtime.mopped = true;
            if (dustDone() && !data.bonuses.dust) {
              data.bonuses.dust = true;
              game.grantTimeBonus(3, "URUTAN BENAR!");
              game.burst(x, y);
            }
            refresh();
            game.save("Chapter4");
          },
        });
        scrubItems.push([id, item]);
        if (item.done) { item.el.remove(); item.interactable.enabled = false; }
      });
      game.runtime.captureChapterProgress = () => {
        data.eff = game.runtime.eff;
        scrubItems.forEach(([id, item]) => { data.scrub[id] = item.progress; });
      };
      refresh();
      game.save("Chapter4");
      game.addUpdater(() => {
        if (!game.timerMayRun() || game.runtime.chapter4Closing || !readyToClean() || !cleaningTasks.every(([id]) => data.cleaned[id])) return;
        game.runtime.chapter4Closing = true;
        game.startDialog([
          { name: "Lumi", who: "lumi", text: "Andi, rumah ini sekarang jauh lebih nyaman." },
          { name: "Andi", who: "andi", text: "Aku mulai mengerti, menjaga rumah bukan hanya soal membersihkan. Tapi juga merawatnya." },
        ], () => {
          const finish = () => game.finishChapter(4, game.runtime.eff >= 90 ? 3 : game.runtime.eff >= 70 ? 2 : 1);
          if (!game.startLumiEducation(4, finish)) finish();
        });
      });
      function refresh() {
        const placed = definitions.filter(([id]) => data.placed[id]).length;
        const fixed = repairIds.filter(id => data.fixed[id]).length;
        const cleaned = ["trash", ...cleaningTasks.map(([id])=>id)].filter(id => data.cleaned[id]).length;
        game.runtime.step = placed + fixed + cleaned;
        game.updateClean(Math.round(game.runtime.step / (5 + cleaningTasks.length + repairIds.length) * 100));
        carryLabel.hidden = !game.runtime.held;
        carryLabel.textContent = game.runtime.held ? `Membawa ${definitions.find(([id]) => id === game.runtime.held.id)?.[1]} · antarkan ke tujuan yang sesuai` : "";
        game.objective(!arranged() ? "1 / 3 · Antarkan barang ke tempatnya" : !readyToClean() ? "2 / 3 · Rawat perabot dan buang sampah" : "3 / 3 · Debu dahulu, lalu lantai", [
          [`Barang tertata: ${placed}/4`, arranged()], [`Perabot diperbaiki: ${fixed}/${repairIds.length}`, repaired()],
          ["Sampah dibuang", !!data.cleaned.trash], ["Debu rak dan meja", !!dustDone()], [`Lantai bersih (${cleaningTasks.filter(([id])=>!id.startsWith("dust") && data.cleaned[id]).length}/${cleaningTasks.length-2})`, cleaningTasks.filter(([id])=>!id.startsWith("dust")).every(([id])=>data.cleaned[id])],
        ]);
      }
    };
})(window.ForMotherRuntime);
