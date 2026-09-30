/* For Mother - systems/cleaning. Shared state stays inside the runtime closure. */
((game) => {
  "use strict";

  game.startInvestigationSession = function startInvestigationSession(
    item,
    onComplete,
  ) {
    if (game.runtime.investigating || item.marked) return;
    game.miniGameActive = true;
    game.lock();
    const overlay = document.createElement("div");
    overlay.className = "investigation-session";
    overlay.innerHTML =
      '<div class="cleaning-help">Tahan cahaya Lumi tepat di noda selama 2 detik - ESC untuk batal</div><div class="investigation-zone"><i></i></div><div class="investigation-light"></div>';
    game.els.cleaning.replaceChildren(overlay);
    game.els.cleaning.className = "active investigation-active";
    const zone = overlay.querySelector(".investigation-zone");
    const light = overlay.querySelector(".investigation-light");
    const bar = zone.querySelector("i");
    const screen = game.worldToScreen(item.x, item.y);
    const zoom = game.runtime.camera?.zoom || 1;
    Object.assign(zone.style, {
      left: `${(screen.x / game.W) * 100}%`,
      top: `${(screen.y / game.H) * 100}%`,
      width: `${((item.w * zoom) / game.W) * 100}%`,
      height: `${((item.h * zoom) / game.H) * 100}%`,
    });
    let down = false,
      point = null,
      illuminatedSince = null,
      frame = 0,
      finished = false;
    const screenPoint = (event) => {
      const rect = game.els.view.getBoundingClientRect();
      return {
        x: ((event.clientX - rect.left) / rect.width) * game.W,
        y: ((event.clientY - rect.top) / rect.height) * game.H,
      };
    };
    const finish = (success) => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(frame);
      overlay.remove();
      game.els.cleaning.className = "";
      game.runtime.investigating = null;
      game.miniGameActive = false;
      if (success) onComplete();
    };
    const updateLight = (event) => {
      point = screenPoint(event);
      light.style.left = `${(point.x / game.W) * 100}%`;
      light.style.top = `${(point.y / game.H) * 100}%`;
    };
    const onDirt = () => {
      if (!down || !point) return false;
      const world = game.screenToWorld(point.x, point.y);
      return game.rectHit(world.x, world.y, 2, 2, {
        x: item.x - item.w / 2,
        y: item.y - item.h / 2,
        w: item.w,
        h: item.h,
      });
    };
    const resetExposure = () => {
      illuminatedSince = null;
      bar.style.width = "0%";
    };
    overlay.onpointerdown = (event) => {
      event.preventDefault();
      down = true;
      updateLight(event);
      illuminatedSince = onDirt() ? performance.now() : null;
      overlay.setPointerCapture?.(event.pointerId);
    };
    const release = () => {
      down = false;
      resetExposure();
    };
    overlay.onpointerup = release;
    overlay.onpointercancel = release;
    overlay.onlostpointercapture = release;
    overlay.onpointermove = (event) => {
      updateLight(event);
      if (!onDirt()) resetExposure();
      else if (illuminatedSince === null) illuminatedSince = performance.now();
    };
    const illuminate = (now) => {
      if (finished) return;
      if (document.hidden || !onDirt()) resetExposure();
      else {
        illuminatedSince ??= now;
        const progress = Math.min(100, ((now - illuminatedSince) / 2000) * 100);
        bar.style.width = `${progress}%`;
        if (progress >= 100) return finish(true);
      }
      frame = requestAnimationFrame(illuminate);
    };
    frame = requestAnimationFrame(illuminate);
    game.runtime.investigating = { cancel: () => finish(false), item };
  };

  game.startCleaningSession = function startCleaningSession({
    item,
    tool = "cloth",
    onComplete,
  }) {
    if (game.runtime.cleaning || item.done) return;
    game.miniGameActive = true;
    game.lock();
    const overlay = document.createElement("div");
    overlay.className = `cleaning-session ${tool}`;
    overlay.innerHTML = `<div class="cleaning-title">${item.name || item.type || "Area Kotor"}</div><div class="cleaning-help">${item.help || "Tahan dan gosok bolak-balik · ESC untuk batal"}</div><div class="cleaning-focus"><img class="cleaning-focus-item" src="${item.el?.src || game.ASSETS.final.germ}" alt=""><div class="cleaning-zone"><div class="cleaning-progress"><i></i></div></div></div><img class="cleaning-cursor" src="${tool === "mop" ? game.ASSETS.water.mop : game.ASSETS.dust.cloth}" alt="">`;
    game.els.cleaning.replaceChildren(overlay);
    game.els.cleaning.className = "active";
    const zone = overlay.querySelector(".cleaning-zone"),
      bar = overlay.querySelector(".cleaning-progress i"),
      cursor = overlay.querySelector(".cleaning-cursor"),
      focusItem = overlay.querySelector(".cleaning-focus-item");
    Object.assign(cursor.style, { left: "50%", top: "56%" });
    if (item.el) item.el.style.visibility = "hidden";
    let down = false,
      lastPoint = null,
      lastVector = null,
      loopActive = false;
    const scrubSound = tool === "mop" ? "mop_scrub" : "wipe_clean";
    let cursorX = game.W * 0.5,
      cursorY = game.H * 0.56,
      targetX = cursorX,
      targetY = cursorY;
    let cursorFrame = 0;
    const animateCursor = () => {
      cursorX += (targetX - cursorX) * 0.42;
      cursorY += (targetY - cursorY) * 0.42;
      cursor.style.left = `${(cursorX / game.W) * 100}%`;
      cursor.style.top = `${(cursorY / game.H) * 100}%`;
      cursorFrame = requestAnimationFrame(animateCursor);
    };
    cursorFrame = requestAnimationFrame(animateCursor);
    const paint = () => {
      bar.style.width = `${item.progress}%`;
      focusItem.style.opacity = `${Math.max(0.12, 1 - item.progress / 108)}`;
    };
    const end = (cancelled = false, silent = false) => {
      if (!game.runtime.cleaning) return;
      overlay.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointermove", onMove, true);
      document.removeEventListener("pointerup", onUp, true);
      document.removeEventListener("pointercancel", onUp, true);
      cancelAnimationFrame(cursorFrame);
      game.AudioManager.stopLoop(scrubSound);
      loopActive = false;
      game.els.cleaning.replaceChildren();
      game.els.cleaning.className = "";
      game.runtime.cleaning = null;
      game.miniGameActive = false;
      if (cancelled && item.el) {
        item.el.style.visibility = "";
        item.el.style.opacity = "1";
      }
      if (cancelled && !silent)
        game.toast(`Progress tersimpan: ${Math.round(item.progress)}%`);
      if (cancelled && !silent && game.runtime.captureChapterProgress)
        game.save(game.state.scene);
    };
    const finish = () => {
      item.progress = 100;
      item.done = true;
      paint();
      const removeDirt =
        item.removeOnClean ||
        item.el?.classList.contains("dirt") ||
        item.el?.classList.contains("hidden-stain") ||
        item.type === "dust" ||
        item.type === "water";
      if (removeDirt) item.el?.remove();
      else if (item.cleanSrc) {
        item.el.src = item.cleanSrc;
        item.el.style.visibility = "";
        item.el.style.opacity = "1";
      } else {
        item.el?.classList.add("cleaned");
        game.sceneTimeout(() => item.el?.remove(), 500);
      }
      item.interactable.enabled = false;
      game.burst(item.x, item.y);
      end(false);
      game.playCorrectSfx();
      game.AudioManager.playSFX("objective_complete", {
        level: 0.72,
        cooldown: 120,
      });
      onComplete?.(item);
    };
    const screenPoint = (event) => {
      const source = event.touches?.[0] || event.changedTouches?.[0] || event;
      const rect = game.els.view.getBoundingClientRect();
      return {
        x: ((source.clientX - rect.left) / rect.width) * game.W,
        y: ((source.clientY - rect.top) / rect.height) * game.H,
        clientX: source.clientX,
        clientY: source.clientY,
      };
    };
    const onDown = (event) => {
      event.preventDefault();
      down = true;
      lastPoint = screenPoint(event);
      if (event.pointerId !== undefined)
        overlay.setPointerCapture?.(event.pointerId);
    };
    const onUp = () => {
      down = false;
      lastPoint = lastVector = null;
      game.AudioManager.stopLoop(scrubSound);
      loopActive = false;
    };
    const onMove = (event) => {
      const screen = screenPoint(event);
      targetX = screen.x;
      targetY = screen.y;
      const pressed =
        down ||
        (typeof event.buttons === "number" && (event.buttons & 1) === 1) ||
        event.touches?.length > 0;
      if (!pressed) return;
      if (!lastPoint) {
        lastPoint = screen;
        return;
      }
      event.preventDefault();
      const visibleZone = zone.getBoundingClientRect();
      const inside =
        screen.clientX >= visibleZone.left &&
        screen.clientX <= visibleZone.right &&
        screen.clientY >= visibleZone.top &&
        screen.clientY <= visibleZone.bottom;
      if (!inside) {
        lastPoint = screen;
        game.AudioManager.stopLoop(scrubSound);
        loopActive = false;
        return;
      }
      const vx = screen.x - lastPoint.x,
        vy = screen.y - lastPoint.y,
        distance = Math.hypot(vx, vy);
      if (distance < 4) return;
      if (!loopActive) {
        game.AudioManager.startLoop(scrubSound, { level: 0.5 });
        loopActive = true;
      }
      cursor.style.setProperty(
        "--tool-angle",
        `${Math.max(-18, Math.min(18, vx * 0.45))}deg`,
      );
      const reversal =
        lastVector && vx * lastVector.x + vy * lastVector.y < 0 ? 1.32 : 1;
      item.progress = Math.min(
        100,
        item.progress + Math.min(distance, 42) * 0.16 * reversal,
      );
      lastVector = { x: vx, y: vy };
      lastPoint = screen;
      paint();
      if (item.progress >= 100) finish();
    };
    overlay.addEventListener("pointerdown", onDown);
    document.addEventListener("pointermove", onMove, {
      capture: true,
      passive: false,
    });
    document.addEventListener("pointerup", onUp, true);
    document.addEventListener("pointercancel", onUp, true);
    game.runtime.cleaning = { cancel: end, item };
    paint();
  };

  game.startTrashSorting = function startTrashSorting(onComplete, amount = 4) {
    if (game.runtime.trashSorting || game.runtime.chapterTimer?.expired) return;
    if (game.runtime.trashSorting) return;
    game.miniGameActive = true;
    game.lock();
    const catalog = [
      ["banana", "organic", "Kulit pisang"],
      ["food", "organic", "Sisa makanan"],
      ["paper", "nonorganic", "Kertas"],
      ["can", "nonorganic", "Kaleng"],
      ["bag", "nonorganic", "Plastik"],
      ["bottle", "nonorganic", "Botol plastik"],
    ];
    const picked = [...catalog]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.max(2, Math.min(amount, catalog.length)));
    const overlay = document.createElement("div");
    overlay.className = "trash-sort-session";
    overlay.innerHTML = `<section class="trash-sort-card"><h1>PILAH SAMPAH</h1><p>Seret setiap sampah ke tempat sampah yang sesuai.</p><div class="trash-sort-items">${picked.map(([id, type, label], i) => `<button class="trash-sort-item" draggable="true" data-index="${i}" data-type="${type}" aria-label="${label}"><img src="${game.ASSETS.trash[id]}" alt="${label}"><span>${label}</span></button>`).join("")}</div><div class="trash-sort-bins"><button class="trash-sort-bin" data-type="organic"><img src="${game.ASSETS.trash.organic}" alt=""><b>ORGANIK</b></button><button class="trash-sort-bin" data-type="nonorganic"><img src="${game.ASSETS.trash.nonorganic}" alt=""><b>ANORGANIK</b></button></div><small>Klik sampah lalu klik tong juga bisa digunakan.</small></section>`;
    game.els.cleaning.replaceChildren(overlay);
    game.els.cleaning.className = "active trash-sorting-active";
    let selected = null,
      remaining = picked.length,
      closed = false;
    const close = (success) => {
      if (closed) return;
      closed = true;
      game.els.cleaning.replaceChildren();
      game.els.cleaning.className = "";
      game.runtime.trashSorting = null;
      game.miniGameActive = false;
      if (success) {
        game.AudioManager.playSFX("objective_complete", {
          level: 0.72,
          cooldown: 120,
        });
        onComplete?.();
      }
    };
    const sortInto = (item, binType) => {
      if (closed || !item || item.dataset.sorted) return;
      if (item.dataset.type !== binType) {
        game.recordMistake("Tong sampahnya belum sesuai.");
        item.classList.add("wrong");
        game.sceneTimeout(() => item.classList.remove("wrong"), 420);
        return;
      }
      item.dataset.sorted = "1";
      item.classList.add("sorted");
      selected?.classList.remove("selected");
      selected = null;
      remaining--;
      game.playCorrectSfx();
      game.AudioManager.playSFX("trash_dispose", {
        level: 0.78,
        vary: 0.04,
        cooldown: 90,
      });
      if (!remaining) game.sceneTimeout(() => close(true), 380);
    };
    overlay.querySelectorAll(".trash-sort-item").forEach((item) => {
      item.addEventListener("dragstart", (event) =>
        event.dataTransfer.setData("text/plain", item.dataset.index),
      );
      item.onclick = () => {
        if (item.dataset.sorted) return;
        selected?.classList.remove("selected");
        selected = item;
        item.classList.add("selected");
      };
    });
    overlay.querySelectorAll(".trash-sort-bin").forEach((bin) => {
      bin.addEventListener("dragover", (event) => {
        event.preventDefault();
        bin.classList.add("over");
      });
      bin.addEventListener("dragleave", () => bin.classList.remove("over"));
      bin.addEventListener("drop", (event) => {
        event.preventDefault();
        bin.classList.remove("over");
        sortInto(
          overlay.querySelector(
            `.trash-sort-item[data-index="${event.dataTransfer.getData("text/plain")}"]`,
          ),
          bin.dataset.type,
        );
      });
      bin.onclick = () => sortInto(selected, bin.dataset.type);
    });
    game.runtime.trashSorting = { cancel: () => close(false) };
  };

  game.addCleanable = function addCleanable(config) {
    game.runtime.cleanables ||= [];
    const item = { progress: 0, done: false, w: 160, h: 120, ...config };
    item.el =
      config.el ||
      game.img(
        config.src,
        "object dirt",
        item.x,
        item.y,
        item.visualW || 115,
        item.id,
      );
    item.interactable = game.interact(
      item.id,
      item.x,
      item.y,
      "Bersihkan",
      () => {
        if (item.canStart && !item.canStart()) return;
        game.startCleaningSession({
          item,
          tool: item.tool,
          onComplete: item.onComplete,
        });
      },
      !!item.critical,
      item.el,
    );
    game.runtime.cleanables.push(item);
    return item;
  };
})(window.ForMotherRuntime);
