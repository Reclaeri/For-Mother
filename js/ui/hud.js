/* For Mother - ui/hud. Shared state stays inside the runtime closure. */
((game) => {
  "use strict";

  game.portalFx = function portalFx(x, y, size = 15) {
    const halo = document.createElement("div");
    halo.className = "portal-halo";
    halo.style.left = `${(x / game.W) * 100}%`;
    halo.style.top = `${(y / game.H) * 100}%`;
    halo.style.width = `${size}%`;
    for (let i = 0; i < 7; i++) {
      const p = document.createElement("i");
      p.style.setProperty("--i", i);
      halo.append(p);
    }
    game.els.fx.append(halo);
    return halo;
  };

  game.toast = function toast(t) {
    const e = document.createElement("div");
    e.className = "toast";
    e.textContent = t;
    /* UI tidak mengikuti transform kamera, jadi pemberitahuan selalu terlihat. */
    game.els.ui.append(e);
    game.sceneTimeout(() => e.remove(), 1750);
  };

  game.floatingFeedback = function floatingFeedback(
    text,
    x = game.player.x,
    y = game.player.y,
    kind = "success",
  ) {
    const e = document.createElement("div");
    e.className = `floating-feedback ${kind}`;
    e.textContent = text;
    e.style.left = `${(x / game.W) * 100}%`;
    e.style.top = `${(y / game.H) * 100}%`;
    game.els.fx.append(e);
    game.sceneTimeout(
      () => e.remove(),
      game.state.settings.motion ? 1100 : 500,
    );
  };

  game.cleanlinessLabel = function cleanlinessLabel(value) {
    if (value >= 100) return "Bersih Sempurna";
    if (value >= 75) return "Hampir Selesai";
    if (value >= 50) return "Cukup Bersih";
    if (value >= 25) return "Mulai Bersih";
    return "Sangat Kotor";
  };

  game.objective = function objective(title, lines = []) {
    game.els.ui.querySelector(".objective")?.remove();
    const e = document.createElement("div");
    const minimized = !!game.state.settings.objectiveMinimized;
    e.className = `objective panel${minimized ? " minimized" : ""}`;
    e.innerHTML =
      `<div class="objective-head"><strong>TUJUAN</strong><button class="objective-toggle" type="button" aria-label="${minimized ? "Buka" : "Minimalkan"} tujuan" aria-expanded="${!minimized}">${minimized ? "+" : "−"}</button></div><div class="objective-body"><div class="objective-title">${title}</div>` +
      lines
        .map(
          (x) =>
            `<div class="goal"><img src="${x[1] ? game.ASSETS.ui.done : game.ASSETS.ui.empty}"><span>${x[0]}</span></div>`,
        )
        .join("") +
      `</div>`;
    e.querySelector(".objective-toggle").onclick = () => {
      game.state.settings.objectiveMinimized =
        !game.state.settings.objectiveMinimized;
      e.classList.toggle("minimized", game.state.settings.objectiveMinimized);
      const button = e.querySelector(".objective-toggle");
      button.textContent = game.state.settings.objectiveMinimized ? "+" : "−";
      button.setAttribute(
        "aria-expanded",
        String(!game.state.settings.objectiveMinimized),
      );
      button.setAttribute(
        "aria-label",
        `${game.state.settings.objectiveMinimized ? "Buka" : "Minimalkan"} tujuan`,
      );
      game.persistSettings();
    };
    game.els.ui.append(e);
  };

  game.chapterHud = function chapterHud(n, title, clean = null) {
    const medicineCount = game.state.medicines.filter(Boolean).length;
    const health = game.MOTHER_PROGRESS[medicineCount];
    const motherImage = medicineCount
      ? game.ASSETS.mother[medicineCount - 1]
      : game.ASSETS.portraits.mother;
    game.els.ui.innerHTML = `<div class="chapter-hud panel"><div class="hud-title"><small>CHAPTER ${n} · ${game.state.difficulty || "MEDIUM"}</small><strong>${title}</strong></div><div class="status cleanliness"><span>KEBERSIHAN <b>${clean ?? 0}%</b></span><div class="bar"><i style="width:${clean ?? 0}%"></i></div><small class="cleanliness-label">${game.cleanlinessLabel(clean ?? 0)}</small></div><div class="mother-status"><img src="${motherImage}" alt="Kondisi Ibu"><div><span>KONDISI IBU <b>${health}%</b></span><strong>${game.MOTHER_CONDITIONS[medicineCount]}</strong><div class="bar mother-bar"><i style="width:${health}%"></i></div></div></div><div class="medicine-slots" aria-label="${medicineCount} dari 5 obat untuk Ibu">${game.ASSETS.meds.map((src, i) => `<span class="medicine-slot" data-slot="${i}"><img src="${game.state.medicines[i] ? src : game.ASSETS.ui.slot}" alt="${game.state.medicines[i] ? `Obat ${i + 1} terkumpul` : `Slot obat ${i + 1} kosong`}"></span>`).join("")}</div><div class="timer-wrap"><small>WAKTU</small><strong class="chapter-timer">${game.formatTime(game.chapterTimeLimit(n))}</strong></div><button class="hud-pause" type="button" aria-label="Jeda dan pengaturan">⏸</button></div><button class="hud-clean-toggle" type="button" aria-label="Sembunyikan tampilan permainan" title="Sembunyikan UI (H)">◉</button>`;
    game.els.ui.querySelector(".hud-pause").onclick = game.pause;
    game.els.ui.querySelector(".hud-clean-toggle").onclick =
      game.toggleChapterHud;
  };

  game.toggleChapterHud = function toggleChapterHud() {
    if (
      !/^Chapter[1-5]$/.test(game.state.scene) ||
      game.runtime.chapterIntroActive
    )
      return;
    game.runtime.hudHidden = !game.runtime.hudHidden;
    game.els.ui.classList.toggle("hud-hidden", game.runtime.hudHidden);
    const button = game.els.ui.querySelector(".hud-clean-toggle");
    if (button) {
      button.textContent = game.runtime.hudHidden ? "◌" : "◉";
      button.title = game.runtime.hudHidden
        ? "Tampilkan UI (H)"
        : "Sembunyikan UI (H)";
      button.setAttribute("aria-label", button.title);
    }
  };

  game.updateClean = function updateClean(v) {
    const previous = game.runtime.clean || 0;
    game.runtime.clean = Math.max(0, Math.min(100, v));
    const b = game.els.ui.querySelector(".status b"),
      i = game.els.ui.querySelector(".bar i");
    if (b) b.textContent = game.runtime.clean + "%";
    if (i) i.style.width = game.runtime.clean + "%";
    const label = game.els.ui.querySelector(".cleanliness-label");
    if (label) label.textContent = game.cleanlinessLabel(game.runtime.clean);
    if (game.runtime.clean > previous) {
      game.resetLumiHint();
      game.floatingFeedback(
        `+${game.runtime.clean - previous} KEBERSIHAN`,
        game.player.x,
        game.player.y - 45,
      );
    }
  };

  game.playChapterIntro = function playChapterIntro(n) {
    const [title, objectiveText] = game.CHAPTER_INTROS[n];
    game.runtime.chapterIntroActive = true;
    game.cutsceneActive = true;
    game.els.modal.innerHTML = `<div class="chapter-intro" aria-live="polite"><div><small>CHAPTER ${n} ? ${game.state.difficulty || "MEDIUM"}</small><h1>${title}</h1><p><b>TUJUAN</b>${objectiveText}</p></div></div>`;
    game.els.scene.classList.add("intro-pan");
    game.sceneTimeout(
      () => {
        game.els.modal.innerHTML = "";
        game.els.scene.classList.remove("intro-pan");
        game.runtime.chapterIntroActive = false;
        game.cutsceneActive = false;
        game.keys.clear();
        const queued = game.runtime.queuedDialog;
        game.runtime.queuedDialog = null;
        if (queued) {
          game.startDialog(queued.lines, () => {
            queued.onEnd?.();
            if (game.runtime.chapterTimer?.chapter === n)
              game.runtime.chapterTimer.started = true;
          });
        } else if (game.runtime.chapterTimer?.chapter === n)
          game.runtime.chapterTimer.started = true;
      },
      game.state.settings.motion ? 2800 : 700,
      "chapter-intro",
    );
  };

  game.burst = function burst(x, y) {
    const wrap = document.createElement("div");
    wrap.className = "clean-burst";
    wrap.style.left = `${(x / game.W) * 100}%`;
    wrap.style.top = `${(y / game.H) * 100}%`;
    for (let i = 0; i < 8; i++) {
      const spark = document.createElement("i");
      spark.style.setProperty("--a", `${i * 45}deg`);
      wrap.append(spark);
    }
    game.els.fx.append(wrap);
    game.sceneTimeout(() => wrap.remove(), 850);
  };

  game.punch = function punch() {
    if (!game.state.settings.motion) return;
    game.els.scene.classList.remove("camera-punch");
    void game.els.scene.offsetWidth;
    game.els.scene.classList.add("camera-punch");
    game.sceneTimeout(
      () => game.els.scene.classList.remove("camera-punch"),
      360,
    );
  };
})(window.ForMotherRuntime);
