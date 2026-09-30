/* For Mother - core/scene. Shared state stays inside the runtime closure. */
((game) => {
  "use strict";

  game.img = function img(src, cls = "object", x = 0, y = 0, w = 80, id = "") {
    const e = document.createElement("img");
    e.src = src;
    e.alt = "";
    e.className = cls;
    e.dataset.id = id;
    e.style.left = (x / game.W) * 100 + "%";
    e.style.top = (y / game.H) * 100 + "%";
    e.style.width = (w / game.W) * 100 + "%";
    e.style.zIndex = Math.floor(y);
    e.onerror = () => {
      e.style.display = "none";
      console.warn("Asset gagal dimuat:", src);
    };
    game.els.world.append(e);
    return e;
  };

  game.setBg = function setBg(src) {
    game.els.bg.src = src;
    game.els.bg.onerror = () => console.warn("Background gagal dimuat:", src);
  };

  game.clear = function clear() {
    game.cleanupScene();
    [game.els.bg, game.els.world, game.els.fx, game.els.debug].forEach(
      (layer) => {
        layer.style.transform = "";
        layer.style.transformOrigin = "";
      },
    );
    game.els.world.innerHTML = "";
    game.els.scene
      .querySelectorAll(".scene-video")
      .forEach((video) => video.remove());
    game.els.fx.innerHTML = "";
    game.els.ui.innerHTML = "";
    game.els.ui.classList.remove("hud-hidden");
    game.els.dialog.innerHTML = "";
    game.els.modal.innerHTML = "";
    game.els.debug.innerHTML = "";
    game.els.cleaning.innerHTML = "";
    game.els.cleaning.className = "";
    game.els.fx.className = "";
    game.els.view.classList.remove(
      "lumi-vision-active",
      "chapter3-clean-complete",
      "ending-active",
      "restoration-active",
      "mother-recovery-active",
    );
    game.els.scene.classList.remove("prologue-pan", "prologue-focus");
    game.els.view.style.removeProperty("--vision-x");
    game.els.view.style.removeProperty("--vision-y");
    game.els.view.style.removeProperty("--mother-warmth");
    game.els.view.style.removeProperty("--mother-sepia");
    game.els.view.style.removeProperty("--mother-saturation");
    game.els.view.style.removeProperty("--mother-brightness");
    game.currentTarget = null;
    game.runtime = {
      entities: [],
      interactables: [],
      portals: [],
      obstacles: [],
      dynamic: [],
      timers: {},
      cleanups: [],
      updaters: new Set(),
      completed: false,
      camera: null,
    };
    game.dialogActive =
      game.cutsceneActive =
      game.miniGameActive =
      game.pauseActive =
        false;
    game.keys.clear();
    game.sceneToken++;
  };

  game.cleanupScene = function cleanupScene() {
    if (!game.runtime) return;
    if (game.runtime.dialog?.typeAudio) game.runtime.dialog.typeAudio.pause();
    game.AudioManager.stopSceneAudio();
    game.runtime.investigating?.cancel?.();
    game.runtime.repair?.cancel?.(true);
    game.runtime.cleaning?.cancel?.(true, true);
    game.runtime.trashSorting?.cancel?.();
    (game.runtime.cleanups || []).splice(0).forEach((fn) => {
      try {
        fn();
      } catch (error) {
        console.warn("Scene cleanup gagal", error);
      }
    });
    Object.values(game.runtime.timers || {}).forEach((id) => clearTimeout(id));
  };

  game.sceneTimeout = function sceneTimeout(
    fn,
    ms,
    id = `timer-${performance.now()}-${Math.random()}`,
  ) {
    const token = game.sceneToken;
    const handle = setTimeout(() => {
      if (game.runtime.timers) delete game.runtime.timers[id];
      if (token === game.sceneToken) fn();
    }, ms);
    game.runtime.timers[id] = handle;
    return handle;
  };

  game.addCleanup = function addCleanup(fn) {
    game.runtime.cleanups.push(fn);
    return fn;
  };

  game.addUpdater = function addUpdater(fn) {
    game.runtime.updaters.add(fn);
    return game.addCleanup(() => game.runtime.updaters?.delete(fn));
  };

  game.cut = function cut(bg, lines, next) {
    game.clear();
    game.cutsceneActive = true;
    game.setBg(bg);
    game.els.fx.innerHTML = '<div class="cutshade"></div>';
    game.startDialog(lines, () => {
      game.cutsceneActive = false;
      next();
    });
  };

  game.transition = function transition(name) {
    if (game.transitionActive) return;
    game.transitionActive = true;
    if (/^(Forest|Chapter\d)$/.test(name))
      game.AudioManager.playSFX("portal_enter", { level: 0.8, cooldown: 500 });
    game.lock();
    game.els.fade.style.opacity = 1;
    setTimeout(() => {
      game.loadScene(name);
      requestAnimationFrame(() => {
        game.els.fade.style.opacity = 0;
        setTimeout(() => {
          game.transitionActive = false;
          game.els.fade.style.removeProperty("background");
        }, 430);
      });
    }, 420);
  };

  game.SCENES.Opening1 = function Opening1() {
    game.cut(game.ASSETS.prologue.home, game.openingLines[0], () =>
      game.transition("Opening2"),
    );
    game.els.scene.classList.add("prologue-pan");
  };

  game.SCENES.Opening2 = function Opening2() {
    game.cut(game.ASSETS.prologue.motherCough, game.openingLines[1], () =>
      game.transition("Opening3"),
    );
    game.els.scene.classList.add("prologue-focus");
  };

  game.SCENES.Opening3 = function Opening3() {
    game.cut(game.ASSETS.opening[0], game.motherBedLines, () =>
      game.transition("Opening4"),
    );
  };

  game.SCENES.Opening4 = function Opening4() {
    game.cut(game.ASSETS.opening[1], game.andiMotherLines, () =>
      game.transition("Opening5"),
    );
  };

  game.SCENES.Opening5 = function Opening5() {
    game.cut(game.ASSETS.opening[2], game.openingLines[2], () => {
      game.state.storyStage = 1;
      game.save("Village");
      game.transition("Village");
    });
  };

  game.SCENES.Village = function Village() {
    game.clear();
    game.state.scene = "Village";
    game.setBg(game.ASSETS.bg.village);
    game.bounds(28, 25, 1645, 930);
    /* Collision Desa mengikuti blok merah pada referensi. Kotak-kotak ini
         men-tile bentuk siku tanpa menutup jalan utama dan bukaan selatan. */
    game.obstacle(28, 25, 450, 225, "desa_kiri_atas");
    game.obstacle(478, 25, 500, 240, "desa_rumah_atas");
    game.obstacle(978, 25, 667, 140, "desa_hutan_atas");
    // Sisakan ruang bebas di sekitar portal supaya area portal tidak tertutup
    // collider merah hutan.
    game.obstacle(1225, 165, 30, 150, "desa_hutan_kiri_portal");
    game.obstacle(1495, 165, 150, 150, "desa_hutan_kanan_portal");
    game.obstacle(805, 25, 170, 140, "desa_batu_atas");

    game.obstacle(28, 250, 340, 95, "desa_atap_rumah_kiri");
    game.obstacle(28, 345, 445, 205, "desa_rumah_kiri");
    game.obstacle(28, 550, 35, 50, "desa_pagar_kiri");
    // Start a little lower so the red box hugs the well without reaching too
    // far above its roof; the stone rim and lower body stay fully blocked.
    game.obstacle(680, 350, 165, 145, "desa_sumur");
    game.obstacle(1128, 205, 120, 125, "desa_pagar_portal");

    game.obstacle(1360, 335, 285, 72, "desa_hutan_kanan_tengah");
    game.obstacle(1148, 420, 497, 220, "desa_rumah_kanan");
    game.obstacle(1298, 640, 347, 45, "desa_pagar_kanan_bawah");

    game.obstacle(0, 687, 660, 254, "desa_bawah_kiri");
    game.obstacle(896, 687, 776, 254, "desa_bawah_kanan");
    game.addPlayer(820, 790);
    const sari = game.npc("sari", game.ASSETS.npc.sari, 520, 520),
      bima = game.npc("bima", game.ASSETS.npc.bima, 910, 430),
      nina = game.npc("nina", game.ASSETS.npc.nina, 1100, 610, "nina");
    const portal = game.img(
      game.ASSETS.portal.village,
      "object portal",
      1420,
      125,
      185,
      "portal",
    );
    const villagePortalHalo = game.portalFx(1420, 125);
    const clue = (key, n, lines) =>
      game.followInteraction(
        game.interact(
          key,
          n.x,
          n.y,
          "Bicara",
          () => {
            game.face(game.player, n);
            game.face(n, game.player);
            // Freeze the villager in their neutral idle pose for the dialog.
            game.setVillageNPCIdle(n);
            game.startDialog(lines, () => {
              if (!game.state.clues[key]) {
                game.state.clues[key] = true;
                game.toast("Petunjuk ditemukan");
                game.AudioManager.playSFX("objective_complete", {
                  level: 0.7,
                  cooldown: 120,
                });
                if (Object.values(game.state.clues).every(Boolean))
                  game.AudioManager.playSFX("portal_activate", {
                    level: 0.8,
                    cooldown: 500,
                  });
                game.save("Village");
              }
              setupObjective();
            });
          },
          true,
          n.el,
        ),
        n,
      );
    clue("sari", sari, [
      {
        name: "Andi",
        who: "andi",
        p: "worried",
        text: "Bu Rina, apakah Ibu tahu tentang penyihir di ujung hutan?",
      },
      {
        name: "Bu Rina",
        who: "sari",
        text: "Tabib pernah bercerita tentang batu bertanda ungu. Carilah gerbang dengan tanda itu.",
      },
      {
        name: "Andi",
        who: "andi",
        p: "determined",
        text: "Terima kasih, Bu Rina. Aku akan mencarinya.",
      },
    ]);
    clue("bima", bima, [
      {
        name: "Andi",
        who: "andi",
        p: "worried",
        text: "Pak Bima, apakah Bapak pernah mendengar tentang penyihir di hutan?",
      },
      {
        name: "Pak Bima",
        who: "bima",
        text: "Penyihir di ujung hutan? Sudah lama aku tidak mendengar orang membicarakannya.",
      },
      {
        name: "Pak Bima",
        who: "bima",
        text: "Tapi aku pernah melihat cahaya aneh di sisi utara desa.",
      },
      {
        name: "Andi",
        who: "andi",
        p: "determined",
        text: "Terima kasih, Pak Bima. Petunjuk itu sangat membantu.",
      },
    ]);
    clue("nina", nina, [
      {
        name: "Andi",
        who: "andi",
        p: "worried",
        text: "Ratu, apakah kamu tahu tentang penyihir di ujung hutan?",
      },
      {
        name: "Ratu",
        who: "nina",
        text: "Aku pernah melihat gerbang batu dekat pepohonan.",
      },
      {
        name: "Ratu",
        who: "nina",
        text: "Aku tidak pernah berani mendekatinya.",
      },
      {
        name: "Andi",
        who: "andi",
        p: "relieved",
        text: "Terima kasih, Ratu. Aku akan berhati-hati saat mencarinya.",
      },
    ]);
    game.autoPortal(
      1420,
      255,
      () => {
        game.state.storyStage = 2;
        game.save("Forest");
        game.transition("Forest");
      },
      portal,
      () => Object.values(game.state.clues).every(Boolean),
    );
    game.runtime.portals[game.runtime.portals.length - 1].radius = 118;
    setupObjective();
    function setupObjective() {
      const c = game.state.clues;
      const portalReady = Object.values(c).every(Boolean);
      game.objective(
        portalReady
          ? "Temukan gerbang misterius"
          : "Cari informasi tentang penyihir",
        [
          ["Bicara dengan Bu Rina", c.sari],
          ["Bicara dengan Pak Bima", c.bima],
          ["Bicara dengan Ratu", c.nina],
        ],
      );
      // The village portal must remain a discovery, not a faint visible hint.
      portal.style.display = portalReady ? "" : "none";
      villagePortalHalo.style.display = portalReady ? "" : "none";
    }
  };

  game.SCENES.Forest = function Forest() {
    game.clear();
    game.state.scene = "Forest";
    game.setBg(game.ASSETS.bg.forest);
    game.bounds(45, 65, 1625, 915);
    game.obstacle(0, 0, 555, 420, "pepohonan_kiri_atas");
    game.obstacle(0, 420, 285, 255, "semak_kiri_tengah");
    game.obstacle(0, 885, 1672, 56, "batas_bawah");
    game.obstacle(510, 0, 500, 245, "pepohonan_atas_tengah");
    game.obstacle(1030, 0, 642, 270, "rumah_dan_hutan_atas");
    game.obstacle(1370, 270, 302, 275, "rumah_penyihir");
    game.obstacle(1280, 545, 392, 396, "hutan_kanan_bawah");
    game.obstacle(490, 735, 185, 150, "batu_bawah");
    game.obstacle(700, 760, 580, 181, "semak_bawah_tengah");
    game.obstacle(315, 430, 155, 120, "batu_kiri_jalur");
    game.obstacle(570, 300, 175, 125, "batu_tengah_atas");
    // Left-side entrance: clear of the lower bushes and boundary collider.
    game.addPlayer(110, 820);
    const door = { x: 1330, y: 395 };
    // Local forest effect: reveal once per visit, and let scene cleanup remove it.
    const fog = document.createElement("div");
    fog.className = "forest-house-fog";
    fog.setAttribute("aria-hidden", "true");
    fog.innerHTML = "<i></i><i></i><i></i>";
    game.els.fx.append(fog);
    let revealed = false,
      opacity = 1;
    const removeFogUpdater = game.addUpdater((dt) => {
      if (game.pauseActive || game.transitionActive) return;
      if (
        !revealed &&
        Math.hypot(game.player.x - door.x, game.player.y - door.y) <= 380
      )
        revealed = true;
      if (!revealed) return;
      opacity = Math.max(
        0,
        opacity - dt / (game.state.settings.motion ? 1.8 : 0.35),
      );
      fog.style.opacity = opacity;
      if (opacity === 0) {
        fog.remove();
        removeFogUpdater();
      }
    });
    game.interact(
      "witchDoor",
      door.x,
      door.y,
      "Dekati rumah",
      () => game.transition("WitchApproach"),
      true,
    );
    game.objective("Cari rumah penyihir");
    game.toast("Ikuti jalan bercahaya menuju rumah.");
  };

  game.SCENES.WitchApproach = function WitchApproach() {
    game.cut(
      game.ASSETS.witchCuts.approach,
      [
        {
          name: "Andi",
          who: "andi",
          p: "determined",
          text: "Aku tidak boleh terlambat. Ibu menungguku.",
        },
        {
          name: "Narator",
          text: "Andi berjalan menuju rumah tua di ujung hutan.",
        },
      ],
      () =>
        game.cut(
          game.ASSETS.witchCuts.meet,
          [
            {
              name: "Andi",
              who: "andi",
              p: "worried",
              text: "Aku datang mencari bantuan untuk menyembuhkan ibuku.",
            },
            {
              name: "Penyihir",
              who: "witch",
              text: "Aku memiliki lima ramuan yang dapat membantu ibumu.",
            },
            {
              name: "Penyihir",
              who: "witch",
              text: "Namun setiap ramuan harus kau dapatkan dengan menyelesaikan satu ujian.",
            },
            { name: "Andi", who: "andi", p: "determined", text: "Aku akan melakukannya demi Ibu." },
          ],
          () => game.transition("WitchMission"),
        ),
    );
  };

  game.SCENES.WitchMission = function WitchMission() {
    game.cut(
      game.ASSETS.witchCuts.mission,
      [
        {
          name: "Penyihir",
          who: "witch",
          text: "Bersihkan lima ruangan ajaib. Setiap ruangan yang selesai memberimu satu ramuan untuk Ibu.",
        },
        {
          name: "Andi",
          who: "andi",
          p: "neutral",
          text: "Mengapa aku harus membersihkannya?",
        },
        {
          name: "Penyihir",
          who: "witch",
          text: "Karena menjaga kebersihan juga berarti menjaga kesehatan orang yang kita sayangi.",
        },
      ],
      () => {
        game.state.storyStage = 3;
        game.save("WitchHouse");
        game.transition("WitchHouse");
      },
    );
  };

  game.SCENES.WitchHouse = function WitchHouse() {
    game.clear();
    game.state.scene = "WitchHouse";
    game.setBg(game.ASSETS.bg.witch);
    game.bounds(48, 22, 1625, 920);
    /* Perimeter bertingkat dan furnitur mengikuti anotasi rumah penyihir. */
    game.obstacle(48, 22, 395, 198, "witch_dinding_kiri_atas");
    game.obstacle(443, 22, 385, 198, "witch_jendela_atas");
    game.obstacle(828, 22, 155, 225, "witch_jendela_kanan");
    game.obstacle(983, 22, 650, 225, "witch_rak_atas_kanan");
    game.obstacle(48, 220, 315, 145, "witch_rak_kiri");
    game.obstacle(363, 220, 130, 65, "witch_lemari_kiri");
    game.obstacle(493, 220, 135, 45, "witch_peti_atas");
    game.obstacle(1135, 247, 83, 35, "witch_rak_kanan_step");
    game.obstacle(1218, 247, 415, 205, "witch_meja_racik_kanan");

    game.obstacle(48, 365, 175, 80, "witch_sudut_portal_atas");
    game.obstacle(48, 675, 170, 80, "witch_sudut_portal_bawah");
    game.obstacle(48, 755, 170, 165, "witch_dekorasi_kiri_bawah");
    game.obstacle(365, 590, 300, 115, "witch_meja_besar");
    game.obstacle(400, 705, 115, 85, "witch_bangku_meja");
    game.obstacle(218, 890, 955, 30, "witch_batas_bawah_tengah");

    game.obstacle(1218, 452, 125, 90, "witch_bangku_kanan");
    game.obstacle(1268, 612, 365, 70, "witch_meja_kanan_bawah");
    game.obstacle(1075, 660, 195, 205, "witch_peti_kanan_bawah");
    game.obstacle(1173, 865, 460, 55, "witch_batas_bawah_kanan");
    game.addPlayer(830, 790, true);
    /* Setiap kembali ke hub, Andi wajib menerima arahan chapter terbaru. */
    game.runtime.witchTalked = game.state.currentChapter > 5;
    const w = game.npc("witch", game.ASSETS.npc.witch, 900, 430, "witch");
    const p = game.img(
      game.ASSETS.portal.witch,
      "object portal",
      145,
      600,
      220,
      "portalWitch",
    );
    // Match the portal art and active area to the stone portal frame.
    const portalHalo = game.portalFx(145, 600, 10);
    p.style.display = "none";
    portalHalo.style.display = "none";
    game.followInteraction(
      game.interact(
        "witch",
        w.x,
        w.y,
        "Bicara",
        () =>
          game.startDialog(
            [
              {
                name: "Penyihir",
                who: "witch",
                text: `Selesaikan ujian ke-${game.state.currentChapter}. Satu ramuan lagi akan membawamu lebih dekat kepada kesembuhan Ibu.`,
              },
            ],
            () => {
              game.runtime.witchTalked = true;
              p.style.display = "";
              portalHalo.style.display = "";
              game.AudioManager.playSFX("portal_activate", {
                level: 0.82,
                cooldown: 500,
              });
              game.objective(
                `Masuki portal menuju ujian ke-${game.state.currentChapter}`,
              );
              game.toast("Portal telah terbuka. Masuklah saat kamu siap.");
            },
          ),
        false,
        w.el,
      ),
      w,
    );
    // The trigger sits just in front of the frame, not on top of the portal
    // artwork, so Andi can enter naturally from the open walkway.
    game.autoPortal(
      245,
      600,
      () => {
        if (game.state.currentChapter > 5)
          game.toast("Semua ujian telah selesai.");
        else game.transition("Chapter" + game.state.currentChapter);
      },
      p,
      () => game.runtime.witchTalked,
    );
    game.runtime.portals[game.runtime.portals.length - 1].radius = 72;
    game.addUpdater(() => {
      if (game.runtime.witchTalked) {
        game.els.ui.querySelector(".portal-locked-notice")?.remove();
        return;
      }
      const nearPortal = game.dist(game.player, { x: 245, y: 600 }) < 150;
      let notice = game.els.ui.querySelector(".portal-locked-notice");
      if (nearPortal && !notice) {
        notice = document.createElement("div");
        notice.className = "portal-locked-notice";
        notice.innerHTML = `<strong>PORTAL BELUM AKTIF</strong><span>Bicaralah dengan penyihir terlebih dahulu.</span>`;
        game.els.ui.append(notice);
      } else if (!nearPortal) notice?.remove();
    });
    game.objective(
      game.runtime.witchTalked
        ? `Masuki ujian ke-${game.state.currentChapter}`
        : "Bicaralah dengan penyihir sebelum memasuki portal",
    );
    if (game.state.currentChapter === 1 && !game.state.chapters[0])
      game.cutsceneActive = false;
  };

  game.SCENES.FinalWarning = function FinalWarning() {
    game.cut(
      game.ASSETS.bg.witch,
      [
        {
          name: "Penyihir",
          who: "witch",
          text: "Empat ruangan sebelumnya telah mengajarkanmu caranya.",
        },
        {
          name: "Penyihir",
          who: "witch",
          text: "Di ruangan terakhir, tidak ada lagi petunjuk.",
        },
        {
          name: "Andi",
          who: "andi",
          p: "determined",
          text: "Aku sudah siap.",
        },
        {
          name: "Penyihir",
          who: "witch",
          text: "Buktikan bahwa perjalananmu tidak sia-sia.",
        },
      ],
      () => game.transition("Chapter5"),
    );
  };

  game.SCENES.FinalMedicine = function FinalMedicine() {
    game.giveMedicine(5);
  };

  game.SCENES.EndingMontage = function EndingMontage() {
    game.clear();
    game.state.scene = "EndingMontage";
    game.cutsceneActive = true;
    let index = 0;
    game.setBg(game.ASSETS.ending.montage[index]);
    game.els.fx.innerHTML = '<div class="ending-montage-vignette"></div>';
    game.els.modal.innerHTML = `<section class="ending-montage"><div class="ending-montage-caption"></div><button class="ending-skip" type="button">LEWATI MONTAGE</button></section>`;
    const caption = game.els.modal.querySelector(".ending-montage-caption");
    const showFrame = () => {
      game.setBg(game.ASSETS.ending.montage[index]);
      game.els.bg.classList.remove("montage-frame");
      requestAnimationFrame(() => game.els.bg.classList.add("montage-frame"));
      caption.textContent =
        game.ENDING_MONTAGE_CAPTIONS[
          Math.min(
            game.ENDING_MONTAGE_CAPTIONS.length - 1,
            Math.floor(index / 4),
          )
        ];
      if (++index < game.ASSETS.ending.montage.length)
        game.sceneTimeout(
          showFrame,
          game.state.settings.motion ? 1250 : 250,
          "ending-montage-frame",
        );
      else
        game.sceneTimeout(
          finish,
          game.state.settings.motion ? 1500 : 250,
          "ending-montage-finish",
        );
    };
    const finish = () => {
      if (game.state.scene !== "EndingMontage") return;
      game.transition("EndingWitch");
    };
    game.els.modal.querySelector(".ending-skip").onclick = finish;
    showFrame();
  };

  game.SCENES.EndingWitch = function EndingWitch() {
    game.cut(game.ASSETS.witchCuts.mission, game.ENDING_WITCH_LINES, () => {
      game.els.modal.innerHTML =
        '<div class="ending-magic-farewell"><span>✦</span><span>✧</span><span>✦</span><p>Penyihir kembali ke dalam cahaya portal.</p></div>';
      game.AudioManager.playSFX("portal_activate", {
        level: 0.55,
        cooldown: 200,
      });
      game.sceneTimeout(
        () => game.transition("EndingLumi"),
        game.state.settings.motion ? 1500 : 200,
        "ending-witch-farewell",
      );
    });
  };

  game.SCENES.EndingLumi = function EndingLumi() {
    game.cut(game.ASSETS.ending.lumiFarewell, game.ENDING_LUMI_LINES, () => {
      game.els.modal.innerHTML = `<div class="ending-lumi-disappear"><img class="ending-lumi-goodbye" src="${game.ASSETS.ending.lumiGoodbye}" alt="Lumi"><img class="ending-lumi-particles" src="${game.ASSETS.ending.lumiParticles}" alt=""><p>Cahaya Lumi tetap tinggal sebagai pengingat.</p></div>`;
      game.AudioManager.playSFX("hidden_dirt_found", {
        level: 0.55,
        rate: 1.2,
        cooldown: 200,
      });
      game.sceneTimeout(
        () => game.transition("MotherRecovery"),
        game.state.settings.motion ? 1800 : 250,
        "ending-lumi-disappear",
      );
    });
  };

  game.SCENES.MotherRecovery = function MotherRecovery() {
    game.cut(
      game.ASSETS.mother[4],
      [
        { name: "Ibu", who: "mother", text: "Andi... kamu sudah pulang." },
        { name: "Andi", who: "andi", p: "emotional", text: "Ibu sudah bisa tersenyum lagi." },
        { name: "Ibu", who: "mother", text: "Karena kamu tidak pernah menyerah untuk Ibu." },
        {
          name: "Andi",
          who: "andi",
          p: "happy",
          text: "Semua perjalanan itu sepadan. Aku sayang Ibu.",
        },
        { name: "Ibu", who: "mother", text: "Ibu juga sayang Andi." },
      ],
      () => {
        game.state.gameCompleted = true;
        game.save("Ending");
        game.transition("Ending");
      },
    );
  };

  game.SCENES.Ending = function Ending() {
    game.clear();
    game.state.scene = "Ending";
    const endingVideo = document.createElement("video");
    endingVideo.className = "scene-video ending-video";
    endingVideo.src = game.ASSETS.ending.bg;
    endingVideo.autoplay = true;
    endingVideo.muted = true;
    endingVideo.loop = true;
    endingVideo.playsInline = true;
    endingVideo.preload = "auto";
    endingVideo.setAttribute("aria-hidden", "true");
    game.els.scene.prepend(endingVideo);
    endingVideo.play().catch(() => {});
    game.els.bg.removeAttribute("src");
    game.els.view.classList.add("ending-active");
    const totalStars = Object.values(game.state.ratings).reduce(
      (sum, rating) => sum + (rating.stars || 0),
      0,
    );
    const endingStars = Array.from(
      { length: 15 },
      (_, i) => `<i class="${i < totalStars ? "earned" : ""}">★</i>`,
    ).join("");
    game.els.modal.innerHTML = `<div class="ending ending-cinematic"><div class="ending-letterbox" aria-hidden="true"></div><div class="ending-sunlight" aria-hidden="true"></div><div class="ending-rays" aria-hidden="true"></div><div class="ending-particles" aria-hidden="true">${Array.from({ length: 24 }, (_, i) => `<i style="--i:${i}"></i>`).join("")}</div><div class="ending-vignette" aria-hidden="true"></div><section class="ending-card" role="dialog" aria-modal="true" aria-labelledby="endingTitle"><span class="ending-seal" aria-hidden="true">♥</span><header class="ending-header"><span class="ending-kicker">EPILOG · PERJALANAN ANDI</span><img class="ending-logo" src="${game.ASSETS.menu.logo}" alt="For Mother"><div class="ending-divider"><i></i><span>◆</span><i></i></div><h1 id="endingTitle">IBU TELAH PULIH</h1></header><blockquote><span aria-hidden="true">“</span>Setiap langkah Andi adalah bentuk kasih sayang untuk Ibu.<span aria-hidden="true">”</span></blockquote><p>Lima ujian, lima ramuan, dan satu janji yang akhirnya terpenuhi: Andi berhasil membawa kesehatan dan kehangatan kembali ke rumah.</p><div class="ending-star-score" aria-label="${totalStars} dari 15 bintang"><div>${endingStars}</div><small>${totalStars} BINTANG TERKUMPUL</small></div><div class="ending-stats"><span><small>PERJALANAN</small><b>5/5</b><em>Bab selesai</em></span><span><small>KONDISI IBU</small><b>100%</b><em>Sehat kembali</em></span><span><small>RAMUAN</small><b>5/5</b><em>Untuk Ibu</em></span></div><h2>Terima kasih telah membawa Andi kembali kepada Ibu.</h2><div class="ending-actions"><button class="btn ending-primary" id="replay"><span>↻</span> MAIN LAGI</button><button class="btn ending-secondary" id="menu">KEMBALI KE MENU</button></div></section><div class="ending-final-line">FOR MOTHER <span>·</span> SEBUAH PERJALANAN TENTANG KASIH SAYANG</div></div>`;
    game.$("#replay").onclick = () => game.playEndingLogoSequence("Opening1");
    game.$("#menu").onclick = () => game.playEndingLogoSequence("MainMenu");
  };

  game.playEndingLogoSequence = function playEndingLogoSequence(destination) {
    if (game.transitionActive || game.state.scene !== "Ending") return;
    game.transitionActive = true;
    game.lock();
    const teamLogo = '<img src="assets/Logo%20Tim.png" alt="Nexus Ananta">';
    const gameLogo = `<img src="${game.ASSETS.menu.logo}" alt="For Mother">`;
    game.els.modal.innerHTML = `<section class="ending-brand-sequence" aria-label="Penutup For Mother" tabindex="-1">
      <div class="ending-brand-stage ending-brand-team">${teamLogo}</div>
      <div class="ending-brand-stage ending-brand-game">${gameLogo}</div>
      <div class="ending-brand-stage ending-brand-pair"><div class="ending-brand-logos">${teamLogo}<span aria-hidden="true"></span>${gameLogo}</div><p>Dibuat dengan sepenuh hati.</p></div>
    </section>`;
    game.$(".ending-brand-sequence").focus({ preventScroll: true });
    let finished = false;
    game.addCleanup(() => {
      if (!finished) game.transitionActive = false;
    });
    game.sceneTimeout(
      () => {
        finished = true;
        if (destination === "Opening1") game.resetGame();
        game.transitionActive = false;
        game.transition(destination);
      },
      7200,
      "ending-brand-sequence",
    );
  };

  game.setupChapter = function setupChapter(n, title, bg, clean) {
    game.clear();
    game.state.scene = "Chapter" + n;
    game.setBg(bg);
    const savedRun =
      game.state.resume?.scene === game.state.scene &&
      game.state.resume.chapter === n
        ? game.state.resume
        : null;
    const restoredClean = Number.isFinite(savedRun?.clean)
      ? savedRun.clean
      : clean;
    game.bounds(55, 185, 1617, 885);
    game.obstacle(0, 0, 1672, 175, "dinding_atas");
    game.obstacle(0, 900, 1672, 41, "dinding_bawah");
    game.addChapterFurnitureCollisions(n);
    game.addPlayer(830, 815, true);
    game.chapterHud(n, title, restoredClean);
    game.runtime.clean = restoredClean;
    game.runtime.mistakes = savedRun?.mistakes || 0;
    game.runtime.chapterTimer = {
      chapter: n,
      limit: game.chapterTimeLimit(n),
      remaining: Math.max(
        0,
        Math.min(
          game.chapterTimeLimit(n),
          savedRun?.timerRemaining ?? game.chapterTimeLimit(n),
        ),
      ),
      started: !!savedRun?.timerStarted,
      expired: false,
    };
    game.runtime.chapterTimer.bonus = savedRun?.timerBonus || 0;
    game.runtime.chapterIntroActive = true;
    game.runtime.queuedDialog = {
      lines: [
        {
          name: "Andi — dalam hati",
          who: "andi",
          p: "determined",
          thought: true,
          text: game.ANDI_THOUGHTS[n],
        },
      ],
    };
    game.miniGameActive = false;
    game.runtime.lumi.el.src =
      n === 3
        ? game.ASSETS.lumi.normal
        : n === 5
          ? game.ASSETS.lumi.worried
          : game.ASSETS.lumi.normal;
    game.save("Chapter" + n);
    game.playChapterIntro(n);
  };

  game.finishChapter = function finishChapter(n, stars = 0) {
    if (game.runtime.completed) return;
    game.runtime.completed = true;
    game.AudioManager.stopAllLoops();
    game.punch();
    const result = game.calculateChapterRating(n, stars);
    game.state.ratings[`chapter${n}`] = result;
    if (!game.state.chapters[n - 1]) {
      game.state.chapters[n - 1] = true;
      game.state.currentChapter = Math.min(6, n + 1);
      game.save("WitchHouse");
    }
    game.save("WitchHouse");
    game.completeCard(n, result, () =>
      game.showEducationCard(n, () =>
        n === 5 ? game.transition("FinalMedicine") : game.giveMedicine(n),
      ),
    );
  };

  game.loadScene = function loadScene(name) {
    game.clear();
    document.body.classList.toggle(
      "reduced-motion",
      !game.state.settings.motion,
    );
    const fn = game.SCENES[name] || game.SCENES.MainMenu;
    fn();
    game.state.scene = name;
    const musicMap = {
      MainMenu: [game.AUDIO_ASSETS.music.calm, 1],
      Opening1: [game.AUDIO_ASSETS.music.sad, 0.88],
      Opening2: [game.AUDIO_ASSETS.music.emotional, 0.9],
      Opening3: [game.AUDIO_ASSETS.music.magical, 0.82],
      Opening4: [game.AUDIO_ASSETS.music.emotional, 0.86],
      Opening5: [game.AUDIO_ASSETS.music.magical, 0.82],
      Village: [game.AUDIO_ASSETS.music.exploration, 0.9],
      Forest: [game.AUDIO_ASSETS.music.emotional, 0.82],
      WitchApproach: [game.AUDIO_ASSETS.music.magical, 0.78],
      WitchMission: [game.AUDIO_ASSETS.music.magical, 0.76],
      WitchHouse: [game.AUDIO_ASSETS.music.magical, 0.76],
      FinalWarning: [game.AUDIO_ASSETS.music.magical, 0.76],
      FinalMedicine: [game.AUDIO_ASSETS.music.magical, 0.78],
      EndingMontage: [game.AUDIO_ASSETS.music.ending, 0.82],
      EndingWitch: [game.AUDIO_ASSETS.music.magical, 0.7],
      EndingLumi: [game.AUDIO_ASSETS.music.ending, 0.72],
      MotherRecovery: [game.AUDIO_ASSETS.music.ending, 0.95],
      Ending: [game.AUDIO_ASSETS.music.ending, 1],
    };
    const mapped =
      musicMap[name] ||
      (/^Chapter[1-5]$/.test(name)
        ? [game.AUDIO_ASSETS.music.exploration, 0.72]
        : null);
    if (mapped) game.AudioManager.playMusic(mapped[0], mapped[1]);
    /* Scene post-hooks keep recurring systems bounded and deterministic. */
    if (name === "Village") {
      const patrols = {
        // Wider patrol zones keep the village lively. Every target and movement
        // step is still checked by valid(), so red collision zones are avoided.
        sari: [[390, 385, 285, 275], "bu sari"],
        bima: [[840, 350, 275, 310], "pak bima"],
        nina: [[850, 465, 275, 205], "nina"],
      };
      game.runtime.entities
        .filter((e) => patrols[e.id])
        .forEach((e) => {
          e.patrol = patrols[e.id][0];
          e.folder = patrols[e.id][1];
          e.frame = 0;
        });
    }
  };

  game.restartChapter = function restartChapter() {
    const scene = game.state.scene;
    if (!/^Chapter[1-5]$/.test(scene)) return;
    game.pauseActive = false;
    game.AudioManager.setPaused(false);
    game.runtime.cleaning?.cancel?.(true, true);
    game.runtime.investigating?.cancel?.();
    game.runtime.trashSorting?.cancel?.();
    // Restart from the chapter defaults instead of restoring the previous run.
    delete game.state.chapterProgress[`chapter${scene.replace("Chapter", "")}`];
    game.state.resume = null;
    game.loadScene(scene);
  };

  game.loop = function loop(now) {
    const dt = Math.min(0.033, (now - game.last) / 1000);
    game.last = now;
    if (!game.pauseActive) {
      game.move(dt);
      game.updateNPC(dt);
      game.updateCamera(dt);
      game.updateCharacterBubbles();
      if (!game.runtime.lumiEducation)
        game.runtime.updaters?.forEach((update) => update(dt));
      game.updateChapterClock(dt);
      game.syncEnvironmentAudio();
      game.updateLumiHints(dt);
      game.showPrompt();
      if (game.debugCollisions) game.drawDebug();
    }
    requestAnimationFrame(game.loop);
  };
})(window.ForMotherRuntime);
