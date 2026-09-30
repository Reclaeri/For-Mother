/* For Mother - systems/repair. Shared state stays inside the runtime closure. */
((game) => {
  "use strict";

  game.repairDefinition = function repairDefinition(id) {
    const kit = game.A + "repair_kit_ch4.png";
    const definitions = {
      pipe: {
        title: "Pemeriksaan Pipa",
        src: game.ASSETS.dust.pipeBroken,
        hint: "Cari bagian yang bocor. Periksa sambungan pipa.",
        spots: [
          [53, 40, "Sambungan bocor", true],
          [30, 40, "Sambungan kiri", false],
          [73, 40, "Sambungan kanan", false],
        ],
        tools: [
          ["glue", "Lem pipa", game.A + "lem_pipa.png"],
          ["patch", "Plester pipa", game.A + "tambalan_pipa.png"],
        ],
        steps: [
          ["glue", "Oleskan lem pada kebocoran", 0],
          ["patch", "Pasang plester pada sambungan", 0],
          ["patch", "Ratakan plester hingga rapat", 0],
        ],
      },
      window: {
        title: "Pemeriksaan Jendela",
        src: game.ASSETS.dust.windowOpen,
        hint: "Cari pengunci dan engsel yang bermasalah.",
        spots: [
          [18, 66, "Pengunci longgar", true],
          [30, 31, "Engsel longgar", true],
          [50, 12, "Bingkai atas", false],
        ],
        tools: [
          [
            "windowKit",
            "Alat perbaikan jendela",
            game.A + "alat_perbaikan_jendela.png",
          ],
        ],
        steps: [
          ["windowKit", "Pasang baut pada engsel", 1],
          ["windowKit", "Kencangkan pengunci jendela", 0],
        ],
      },
      bin: {
        title: "Perawatan Tempat Sampah",
        src: game.ASSETS.dust.binFallen,
        hint: "Periksa tempat sampah yang jatuh dan kantong yang rusak.",
        spots: [[48, 50, "Tempat sampah jatuh", true]],
        tools: [
          ["hands", "Pegang tempat sampah", game.ASSETS.dust.binUp],
          ["bag", "Kantong sampah baru", game.A + "kantong_sampah_baru.png"],
          ["collect", "Kumpulkan sampah sekitar", game.ASSETS.dust.trashPile],
        ],
        steps: [
          ["hands", "Tegakkan tempat sampah", 0],
          ["bag", "Ganti kantong yang rusak", 0],
          ["collect", "Masukkan sampah sekitar ke kantong baru", 0],
        ],
      },
      chair: {
        title: "Perbaikan Kursi",
        src: game.A + "kursi_rusak_ch4.png",
        hint: "Periksa baut dan kaki kursi sebelum digunakan.",
        spots: [
          [53, 65, "Baut longgar", true],
          [75, 83, "Kaki kursi rusak", true],
          [64, 18, "Sandaran", false],
        ],
        tools: [["kit", "Repair kit", kit]],
        steps: [
          ["kit", "Kencangkan baut kursi", 0],
          ["kit", "Perbaiki dan kuatkan kaki kursi", 1],
        ],
      },
      shelf: {
        title: "Perbaikan Rak",
        src: game.A + "rak_rusak_ch4.png",
        hint: "Cari bagian penopang yang membuat rak tidak stabil.",
        spots: [
          [78, 86, "Penopang tidak stabil", true],
          [50, 25, "Papan atas", false],
        ],
        tools: [["kit", "Repair kit", kit]],
        steps: [
          ["kit", "Kuatkan penopang rak", 0],
          ["kit", "Luruskan posisi dan stabilkan rak", 0],
        ],
      },
    };
    const spec = definitions[id];
    if (
      game.runtime.chapterTimer?.chapter === 2 &&
      (id === "pipe" || id === "window")
    ) {
      const count = game.difficulty()[id];
      spec.spots = Array.from({ length: count }, (_, i) => [
        18 + i * (64 / Math.max(1, count - 1)),
        id === "pipe" ? 45 : 35 + (i % 2) * 25,
        `${id === "pipe" ? "Kebocoran" : "Sumber debu"} ${i + 1}`,
        true,
      ]);
      spec.steps = spec.spots.flatMap((_, i) =>
        id === "pipe"
          ? [
              ["glue", `Oles lem kebocoran ${i + 1}`, i],
              ["patch", `Pasang plester kebocoran ${i + 1}`, i],
              ["patch", `Ratakan plester ${i + 1}`, i],
            ]
          : [["windowKit", `Kencangkan pengunci sumber debu ${i + 1}`, i]],
      );
    }
    return spec;
  };

  game.startRepairSession = function startRepairSession(
    id,
    progress,
    onComplete,
  ) {
    if (
      game.runtime.repair ||
      game.miniGameActive ||
      game.runtime.chapterTimer?.expired
    )
      return;
    const spec = game.repairDefinition(id);
    if (id === "chair" || id === "shelf")
      game.AudioManager.playSFX("wood_creak", {
        level: 0.24,
        rate: 0.75,
        cooldown: 500,
      });
    progress.found ||= [];
    progress.step ||= 0;
    progress.amount ||= 0;
    if (progress.step >= spec.steps.length) {
      onComplete();
      return;
    }
    game.miniGameActive = true;
    game.lock();
    const overlay = document.createElement("section");
    overlay.className = "repair-session";
    overlay.setAttribute("aria-label", spec.title);
    overlay.innerHTML = `<div class="repair-panel"><header><div><small>PERIKSA / PERBAIKI</small><h2>${spec.title}</h2></div><button class="repair-close" type="button" aria-label="Tutup pemeriksaan">✕</button></header><p class="repair-instruction" aria-live="polite"></p><div class="repair-layout"><div class="repair-visual"><img class="repair-object" src="${spec.src}" alt="${spec.title}">${spec.spots.map(([x, y, label], i) => `<button type="button" class="repair-spot" style="left:${x}%;top:${y}%" data-spot="${i}" aria-label="Periksa ${label}">?</button>`).join("")}</div><aside class="repair-workbench"><small>PERLENGKAPAN</small><div class="repair-tools">${spec.tools.map(([key, label, src]) => `<button class="repair-tool" type="button" data-tool="${key}"><img src="${src}" alt=""><span>${label}</span></button>`).join("")}</div><p class="repair-status" aria-live="polite"></p><div class="repair-meter" role="progressbar" aria-label="Progress perbaikan" aria-valuemin="0" aria-valuemax="100"><i></i></div><strong class="repair-percent"></strong><small class="repair-help">Pilih alat sesuai urutan, lalu ikuti jalur bernomor.<br>Keyboard: fokus titik bercahaya, tekan Enter berulang untuk tiap gerakan.<br>ESC untuk keluar; progress disimpan.</small></aside></div></div>`;
    game.els.cleaning.replaceChildren(overlay);
    game.els.cleaning.className = "active repair-active";
    if (id === "chair" || id === "shelf")
      overlay.querySelector(".repair-visual").classList.add("repair-square");
    let selected = null,
      holding = false,
      closed = false,
      completing = false;
    let gestureStep = -1,
      nextNode = 0;
    let boltAngle = 0,
      lastBoltPointerAngle = null;
    let draggedTrash = null;
    const collecting = () => id === "bin" && progress.step === 2;
    const rubbish = [
      ["paper", "Kertas", 17, 32],
      ["bottle", "Botol", 40, 27],
      ["can", "Kaleng", 27, 60],
      ["bag", "Plastik", 48, 72],
      ["banana", "Kulit pisang", 13, 78],
    ];
    progress.collected ||= [];
    const resetTrash = () => {
      if (!draggedTrash) return;
      draggedTrash.style.left = draggedTrash.dataset.x + "%";
      draggedTrash.style.top = draggedTrash.dataset.y + "%";
      draggedTrash.classList.remove("dragging");
      draggedTrash.setAttribute("aria-pressed", "false");
      draggedTrash = null;
      task.querySelector(".repair-drop-bin")?.classList.remove("ready");
    };
    const depositTrash = () => {
      if (!draggedTrash || closed || completing || !game.timerMayRun(true))
        return;
      const key = draggedTrash.dataset.rubbish;
      if (progress.collected.includes(key)) return;
      progress.collected.push(key);
      resetTrash();
      progress.amount = (progress.collected.length / rubbish.length) * 100;
      game.AudioManager.playSFX("trash_dispose", { level: 0.5, cooldown: 100 });
      if (progress.collected.length === rubbish.length) {
        progress.step++;
        progress.amount = 0;
        completing = true;
        selected = null;
        game.sceneTimeout(finish, 350, "repair-complete");
      }
      persist();
      paint();
      if (!completing)
        task
          .querySelector("[data-rubbish]:not([hidden])")
          ?.focus({ preventScroll: true });
    };
    const paintCollection = () => {
      task.classList.add("repair-collection");
      visual.classList.add("collecting-rubbish");
      overlay.querySelector(".repair-help").textContent =
        "Seret dan lepas setiap sampah di tong. Keyboard: Enter pada sampah, lalu Enter pada tong. ESC menyimpan progress.";
      if (gestureStep !== progress.step) {
        gestureStep = progress.step;
        task.innerHTML = `<strong>BERSIHKAN SEKITAR TONG <span class="collection-count"></span></strong><button type="button" class="repair-drop-bin" aria-label="Masukkan sampah yang dipegang ke tong"><img src="${game.ASSETS.dust.binUp}" alt=""><span>LEPAS DI SINI</span></button>${rubbish.map(([key, label, x, y]) => `<button type="button" class="repair-rubbish" data-rubbish="${key}" data-x="${x}" data-y="${y}" style="left:${x}%;top:${y}%" aria-label="Ambil ${label}" aria-pressed="false"><img src="${game.ASSETS.trash[key]}" alt="${label}" draggable="false"></button>`).join("")}<small>Seret sampah ke tong. Keyboard: pilih sampah, lalu pilih tong.</small>`;
        task.querySelectorAll("[data-rubbish]").forEach((button) => {
          button.onclick = (event) => {
            if (event.detail !== 0 || !game.timerMayRun(true)) return;
            resetTrash();
            draggedTrash = button;
            button.classList.add("dragging");
            button.setAttribute("aria-pressed", "true");
            task.querySelector(".repair-drop-bin").classList.add("ready");
            task
              .querySelector(".repair-drop-bin")
              .focus({ preventScroll: true });
          };
        });
        task.querySelector(".repair-drop-bin").onclick = (event) => {
          if (event.detail === 0) depositTrash();
        };
      }
      task.querySelector(".collection-count").textContent =
        `${progress.collected.length}/${rubbish.length}`;
      task.querySelectorAll("[data-rubbish]").forEach((button) => {
        button.hidden = progress.collected.includes(button.dataset.rubbish);
      });
    };
    const visual = overlay.querySelector(".repair-visual");
    const task = document.createElement("div");
    task.className = "repair-action";
    visual.append(task);
    const stepsView = document.createElement("ol");
    stepsView.className = "repair-sequence";
    overlay.querySelector(".repair-instruction").after(stepsView);
    const gesture = () => {
      const key = spec.steps[progress.step]?.[0];
      if (key === "glue")
        return {
          name: "OLES LEM",
          hint: "Seret dari 1 sampai 5 untuk mengoles lem sepanjang retakan.",
          points: [
            [15, 55],
            [32, 40],
            [50, 55],
            [68, 40],
            [85, 55],
          ],
        };
      if (key === "patch" && progress.step % 3 === 1)
        return {
          name: "PASANG PLESTER",
          hint: "Tarik plester dari kiri ke kanan mengikuti jalur.",
          points: [
            [15, 50],
            [38, 50],
            [62, 50],
            [85, 50],
          ],
        };
      if (key === "patch")
        return {
          name: "RATAKAN",
          hint: "Gosok mengikuti jalur zig-zag untuk merapatkan plester.",
          points: [
            [20, 30],
            [80, 30],
            [20, 70],
            [80, 70],
          ],
        };
      if (key === "windowKit" || (key === "kit" && progress.step === 0))
        return {
          name: "PUTAR ALAT",
          rotate: true,
          hint: "Seret memutar searah jarum jam mengikuti nomor baut.",
          points: [
            [50, 18],
            [78, 50],
            [50, 82],
            [22, 50],
            [50, 18],
          ],
        };
      return {
        name: key === "collect" ? "KUMPULKAN" : "GESER & PASANG",
        hint: "Seret mengikuti nomor untuk mengangkat dan memasang bagian ini.",
        points: [
          [20, 78],
          [38, 58],
          [60, 38],
          [80, 20],
        ],
      };
    };
    const paintGesture = () => {
      task.hidden = !inspected() || !selected || completing;
      if (task.hidden) return;
      if (collecting()) {
        paintCollection();
        return;
      }
      const g = gesture();
      task.classList.toggle("bolt-workshop", !!g.rotate);
      task.style.setProperty("--tightness", `${progress.amount}%`);
      if (gestureStep !== progress.step) {
        gestureStep = progress.step;
        boltAngle = progress.amount * 3.6;
        lastBoltPointerAngle = null;
        nextNode = Math.min(
          g.points.length - 1,
          Math.floor((progress.amount / 100) * g.points.length),
        );
        task.innerHTML = `<strong>${g.name}</strong><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline points="${g.points.map((p) => p.join(",")).join(" ")}"/></svg>${g.points.map(([x, y], i) => `<span class="repair-node" style="left:${x}%;top:${y}%">${i + 1}</span>`).join("")}<small>${g.hint}</small>`;
      }
      if (id === "pipe") {
        task.classList.add("pipe-workshop");
        if (!task.querySelector(".pipe-closeup")) {
          task.insertAdjacentHTML(
            "afterbegin",
            `<div class="pipe-closeup" aria-hidden="true"><div class="pipe-metal"><i class="pipe-crack"></i><div class="pipe-glue"></div><div class="pipe-bandage"></div></div><div class="pipe-drips"><i></i><i></i><i></i></div></div><img class="pipe-working-tool" src="${spec.tools.find((t) => t[0] === selected)[2]}" alt="" draggable="false">`,
          );
        }
        const phase = progress.step % 3;
        task.dataset.pipePhase = phase;
        task.style.setProperty("--pipe-progress", progress.amount / 100);
        task.querySelector(".pipe-glue").style.clipPath =
          `inset(0 ${phase === 0 ? 100 - progress.amount : 0}% 0 0)`;
        task.querySelector(".pipe-bandage").style.clipPath =
          `inset(0 ${phase === 1 ? 100 - progress.amount : phase === 2 ? 0 : 100}% 0 0)`;
        task.querySelector(".pipe-working-tool").src = spec.tools.find(
          (t) => t[0] === selected,
        )[2];
        const point = g.points[Math.min(nextNode, g.points.length - 1)];
        task.querySelector(".pipe-working-tool").style.left = point[0] + "%";
        task.querySelector(".pipe-working-tool").style.top = point[1] + "%";
      }
      if (g.rotate && !task.querySelector(".repair-bolt-assembly")) {
        const assembly = document.createElement("div");
        assembly.className = "repair-bolt-assembly";
        assembly.setAttribute("aria-hidden", "true");
        assembly.innerHTML =
          '<div class="repair-bolt-plate"><i></i><i></i><i></i><i></i></div><div class="repair-bolt-washer"></div><div class="repair-bolt-head"><i></i></div><div class="repair-driver"><i class="repair-driver-shaft"></i><i class="repair-driver-grip"></i></div>';
        task.append(assembly);
      }
      task.style.setProperty("--bolt-angle", `${boltAngle}deg`);
      [...task.querySelectorAll(".repair-node")].forEach((node, i) => {
        node.classList.toggle("done", i < nextNode);
        node.classList.toggle("next", i === nextNode);
        node.hidden =
          i > nextNode &&
          g.points
            .slice(0, i)
            .some((p) => p[0] === g.points[i][0] && p[1] === g.points[i][1]);
      });
    };
    const required = spec.spots.flatMap((spot, i) => (spot[3] ? [i] : []));
    const inspected = () => required.every((i) => progress.found.includes(i));
    const instruction = overlay.querySelector(".repair-instruction");
    const clock = document.createElement("span");
    clock.className = "repair-clock";
    clock.setAttribute("aria-label", "Sisa waktu chapter");
    overlay
      .querySelector("header")
      .insertBefore(clock, overlay.querySelector(".repair-close"));
    const status = overlay.querySelector(".repair-status");
    const meter = overlay.querySelector(".repair-meter");
    const spots = [...overlay.querySelectorAll(".repair-spot")];
    const toolButtons = [...overlay.querySelectorAll(".repair-tool")];
    const persist = () => game.save(game.state.scene);
    const paint = () => {
      const step = spec.steps[progress.step];
      instruction.textContent = !inspected()
        ? spec.hint
        : step
          ? step[1]
          : "Perbaikan selesai!";
      status.textContent = !inspected()
        ? `Kerusakan ditemukan: ${progress.found.length}/${required.length}`
        : selected
          ? collecting()
            ? "Masukkan semua sampah ke tong yang sudah diperbaiki."
            : gesture().hint
          : "Kerusakan ditemukan. Ambil alat yang sesuai.";
      stepsView.innerHTML = spec.steps
        .map(
          (step, i) =>
            `<li class="${i < progress.step ? "done" : i === progress.step ? "current" : ""}"><b>${i < progress.step ? "\u2713" : i + 1}</b>${step[1]}</li>`,
        )
        .join("");
      paintGesture();
      const percent = Math.round(
        ((progress.step + progress.amount / 100) / spec.steps.length) * 100,
      );
      meter.setAttribute("aria-valuenow", percent);
      meter.querySelector("i").style.width = `${percent}%`;
      overlay.querySelector(".repair-percent").textContent = `${percent}%`;
      toolButtons.forEach((button) => {
        button.disabled = !inspected() || completing;
        button.classList.toggle("selected", button.dataset.tool === selected);
      });
      spots.forEach((button, i) => {
        const found = progress.found.includes(i);
        const active = inspected() && step?.[2] === i;
        button.classList.toggle("found", found);
        button.classList.toggle("work-target", active);
        button.textContent = active ? "◎" : found ? "✓" : "?";
        button.disabled =
          completing || collecting() || (inspected() && !active);
        button.setAttribute(
          "aria-label",
          active
            ? `Tekan berulang untuk gerakan: ${step[1]}`
            : `Periksa ${spec.spots[i][2]}`,
        );
      });
    };
    const release = () => {
      resetTrash();
      lastBoltPointerAngle = null;
      task.classList.remove("turning-bolt");
      if (!holding) return;
      holding = false;
      game.AudioManager.stopLoop("repair_tool", 60);
      if (!closed) persist();
    };
    const close = (silent = false) => {
      if (closed) return;
      closed = true;
      holding = false;
      removeUpdater();
      game.AudioManager.stopLoop("repair_tool", 0);
      overlay.remove();
      game.els.cleaning.className = "";
      game.runtime.repair = null;
      game.miniGameActive = false;
      if (!silent) {
        persist();
        game.toast("Progress repair disimpan.");
      }
    };
    const finish = () => {
      if (closed || game.runtime.chapterTimer?.expired) return;
      close(true);
      game.AudioManager.playSFX("repair_finish", {
        level: 0.22,
        rate: 1.4,
        cooldown: 150,
      });
      game.playCorrectSfx();
      game.showRepairEffect(
        game.A + "repair_success_fx.png",
        game.player.x,
        game.player.y - 65,
      );
      onComplete();
    };
    const removeUpdater = game.addUpdater((dt) => {
      clock.textContent =
        "JEDA · " + game.formatTime(game.runtime.chapterTimer.remaining);
      clock.classList.toggle(
        "urgent",
        game.runtime.chapterTimer.remaining <= 15,
      );
    });
    const advanceGesture = () => {
      if (
        closed ||
        completing ||
        collecting() ||
        !selected ||
        !game.timerMayRun(true)
      )
        return;
      const g = gesture();
      nextNode++;
      if (g.rotate && !holding) boltAngle = Math.max(0, nextNode - 1) * 90;
      progress.amount = (nextNode / g.points.length) * 100;
      game.AudioManager.playSFX("repair_bolt", { level: 0.22, cooldown: 60 });
      if (nextNode >= g.points.length) {
        release();
        progress.amount = 0;
        progress.step++;
        selected = null;
        completing = progress.step >= spec.steps.length;
        if (completing) game.sceneTimeout(finish, 350, "repair-complete");
      }
      persist();
      paint();
    };
    const trace = (event) => {
      if (collecting()) {
        if (!draggedTrash || !game.timerMayRun(true)) return;
        const box = task.getBoundingClientRect();
        draggedTrash.style.left =
          Math.max(
            0,
            Math.min(100, ((event.clientX - box.left) / box.width) * 100),
          ) + "%";
        draggedTrash.style.top =
          Math.max(
            0,
            Math.min(100, ((event.clientY - box.top) / box.height) * 100),
          ) + "%";
        const bin = task.querySelector(".repair-drop-bin");
        const r = bin.getBoundingClientRect();
        bin.classList.toggle(
          "ready",
          event.clientX >= r.left &&
            event.clientX <= r.right &&
            event.clientY >= r.top &&
            event.clientY <= r.bottom,
        );
        return;
      }
      if (!holding || closed || completing || !selected) return;
      const box = task.getBoundingClientRect();
      if (gesture().rotate && game.timerMayRun(true)) {
        const dx = (event.clientX - box.left) / box.width - 0.5;
        const dy = (event.clientY - box.top) / box.height - 0.5;
        // Ignore the centre where a tiny movement would flip the angle.
        if (Math.hypot(dx, dy) > 0.08) {
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
          if (lastBoltPointerAngle === null) lastBoltPointerAngle = angle;
          const delta = ((angle - lastBoltPointerAngle + 540) % 360) - 180;
          boltAngle += delta;
          lastBoltPointerAngle = angle;
          task.style.setProperty("--bolt-angle", `${boltAngle}deg`);
          task.classList.add("turning-bolt");
        }
      }
      if (id === "pipe") {
        const tool = task.querySelector(".pipe-working-tool");
        if (tool) {
          tool.style.left =
            ((event.clientX - box.left) / box.width) * 100 + "%";
          tool.style.top = ((event.clientY - box.top) / box.height) * 100 + "%";
        }
      }
      const [x, y] = gesture().points[nextNode];
      if (
        Math.hypot(
          event.clientX - (box.left + (x / 100) * box.width),
          event.clientY - (box.top + (y / 100) * box.height),
        ) <= Math.max(19, Math.min(box.width, box.height) * 0.12)
      )
        advanceGesture();
    };
    task.onpointerdown = (event) => {
      if (event.button !== 0 || !game.timerMayRun(true)) return;
      if (collecting()) {
        const button = event.target.closest("[data-rubbish]");
        if (!button || button.hidden || draggedTrash) return;
        event.preventDefault();
        draggedTrash = button;
        button.classList.add("dragging");
        button.setAttribute("aria-pressed", "true");
        task.setPointerCapture(event.pointerId);
        game.AudioManager.playSFX("trash_pickup", {
          level: 0.4,
          cooldown: 100,
        });
        return;
      }
      event.preventDefault();
      holding = true;
      task.setPointerCapture(event.pointerId);
      game.AudioManager.startLoop("repair_tool", { level: 0.2 });
      trace(event);
    };
    task.onpointermove = trace;
    task.onpointerup = (event) => {
      if (collecting() && draggedTrash) {
        const r = task
          .querySelector(".repair-drop-bin")
          .getBoundingClientRect();
        if (
          event.clientX >= r.left &&
          event.clientX <= r.right &&
          event.clientY >= r.top &&
          event.clientY <= r.bottom
        )
          depositTrash();
        else {
          resetTrash();
          status.textContent = "Belum masuk. Seret dan lepaskan tepat di tong.";
        }
      }
      release();
    };
    task.onpointercancel = task.onlostpointercapture = release;
    game.runtime.repair = { cancel: close, release };
    clock.textContent =
      "JEDA · " + game.formatTime(game.runtime.chapterTimer.remaining);
    overlay.querySelector(".repair-close").onclick = () => close();
    overlay.querySelector(".repair-close").focus({ preventScroll: true });
    toolButtons.forEach(
      (button) =>
        (button.onclick = () => {
          if (closed || !inspected() || completing) return;
          const step = spec.steps[progress.step];
          if (button.dataset.tool !== step[0]) {
            release();
            if (
              game.recordMistake(`Urutan salah! ${step[1]} terlebih dahulu.`) &&
              !closed
            ) {
              const penalty = document.createElement("div");
              penalty.className = "repair-penalty";
              penalty.textContent = "\u22125 DETIK - ALAT SALAH";
              overlay
                .querySelectorAll(".repair-penalty")
                .forEach((node) => node.remove());
              overlay.append(penalty);
              game.sceneTimeout(() => penalty.remove(), 1400);
              status.textContent = `Alat salah. ${step[1]} terlebih dahulu.`;
              clock.textContent =
                "JEDA \u00b7 " +
                game.formatTime(game.runtime.chapterTimer.remaining);
              persist();
            }
            return;
          }
          if (selected === button.dataset.tool) return;
          selected = button.dataset.tool;
          game.AudioManager.playSFX(
            selected === "bag" ? "plastic" : "object_pickup",
            { level: 0.3, cooldown: 150 },
          );
          paint();
        }),
    );
    spots.forEach((button, i) => {
      button.onclick = () => {
        if (closed || completing || inspected()) return;
        if (!spec.spots[i][3]) {
          game.recordMistake("Bagian ini masih baik. Periksa bagian lain.");
          return;
        }
        if (!progress.found.includes(i)) {
          progress.found.push(i);
          game.AudioManager.playSFX("hidden_dirt_found", {
            level: 0.55,
            cooldown: 100,
          });
          overlay
            .querySelector(".repair-visual")
            .classList.remove("damage-discovered");
          requestAnimationFrame(() => {
            if (!closed)
              overlay
                .querySelector(".repair-visual")
                .classList.add("damage-discovered");
          });
          persist();
          paint();
        }
      };
      const begin = () => {
        if (closed || completing || !inspected() || !game.timerMayRun(true))
          return;
        const step = spec.steps[progress.step];
        if (i !== step[2]) return;
        if (selected !== step[0]) {
          status.textContent = "Ambil alat yang sesuai terlebih dahulu.";
          return;
        }
        advanceGesture();
      };
      button.onpointerdown = () => {
        if (selected) status.textContent = gesture().hint;
      };
      button.onpointerup =
        button.onpointercancel =
        button.onlostpointercapture =
          release;
      button.onkeydown = (event) => {
        if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          if (!event.repeat) {
            button.click();
            begin();
          }
        }
      };
      button.onkeyup = (event) => {
        if (event.key === " " || event.key === "Enter") release();
      };
      button.onblur = release;
    });
    paint();
  };

  game.showRepairEffect = function showRepairEffect(
    src,
    x,
    y,
    persistent = false,
  ) {
    const effect = document.createElement("img");
    effect.src = src;
    effect.alt = "";
    effect.className = persistent
      ? "repair-world-effect repair-light"
      : "repair-world-effect";
    effect.style.left = `${(x / game.W) * 100}%`;
    effect.style.top = `${(y / game.H) * 100}%`;
    game.els.fx.append(effect);
    if (!persistent)
      game.sceneTimeout(
        () => effect.remove(),
        game.state.settings.motion ? 1300 : 700,
      );
    return effect;
  };
})(window.ForMotherRuntime);
