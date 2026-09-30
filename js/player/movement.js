/* For Mother - player/movement. Shared state stays inside the runtime closure. */
((game) => {
  "use strict";

  game.cameraTarget = function cameraTarget() {
    const camera = game.runtime.camera;
    if (!camera) return { x: 0, y: 0 };
    const lookX = game.player.moving
      ? game.player.dir === "left"
        ? -55
        : game.player.dir === "right"
          ? 55
          : 0
      : 0;
    const lookY = game.player.moving
      ? game.player.dir === "up"
        ? -38
        : game.player.dir === "down"
          ? 38
          : 0
      : 0;
    return {
      x: Math.max(
        game.W - game.W * camera.zoom,
        Math.min(0, game.W / 2 - (game.player.x + lookX) * camera.zoom),
      ),
      y: Math.max(
        game.H - game.H * camera.zoom,
        Math.min(0, game.H / 2 - (game.player.y + lookY) * camera.zoom),
      ),
    };
  };

  game.applyCamera = function applyCamera() {
    const camera = game.runtime.camera;
    if (!camera) return;
    const rect = game.els.view.getBoundingClientRect();
    const transform = `translate3d(${(camera.x * rect.width) / game.W}px,${(camera.y * rect.height) / game.H}px,0) scale(${camera.zoom})`;
    [game.els.bg, game.els.world, game.els.fx, game.els.debug].forEach(
      (layer) => {
        layer.style.transformOrigin = "0 0";
        layer.style.transform = transform;
      },
    );
  };

  game.initCamera = function initCamera() {
    game.runtime.camera = { x: 0, y: 0, zoom: 1.28 };
    const target = game.cameraTarget();
    game.runtime.camera.x = target.x;
    game.runtime.camera.y = target.y;
    game.applyCamera();
  };

  game.updateCamera = function updateCamera(dt) {
    if (!game.runtime.camera || !game.player.el) return;
    if (
      game.miniGameActive ||
      game.dialogActive ||
      game.cutsceneActive ||
      game.pauseActive
    ) {
      game.applyCamera();
      return;
    }
    const target = game.cameraTarget();
    const follow = game.state.settings.motion ? 1 - Math.exp(-dt * 8.5) : 1;
    if (Math.abs(target.x - game.runtime.camera.x) > 2)
      game.runtime.camera.x += (target.x - game.runtime.camera.x) * follow;
    if (Math.abs(target.y - game.runtime.camera.y) > 2)
      game.runtime.camera.y += (target.y - game.runtime.camera.y) * follow;
    game.applyCamera();
  };

  game.worldToScreen = function worldToScreen(x, y) {
    const camera = game.runtime.camera || { x: 0, y: 0, zoom: 1 };
    return { x: x * camera.zoom + camera.x, y: y * camera.zoom + camera.y };
  };

  game.screenToWorld = function screenToWorld(x, y) {
    const camera = game.runtime.camera || { x: 0, y: 0, zoom: 1 };
    return { x: (x - camera.x) / camera.zoom, y: (y - camera.y) / camera.zoom };
  };

  game.face = function face(a, b) {
    const dx = b.x - a.x,
      dy = b.y - a.y;
    a.dir =
      Math.abs(dx) > Math.abs(dy)
        ? dx < 0
          ? "left"
          : "right"
        : dy < 0
          ? "up"
          : "down";
  };

  game.addPlayer = function addPlayer(x, y, withLumi = false) {
    game.player.held = null;
    game.player.dir = "up";
    game.player.frame = 0;
    game.player.anim = 0;
    game.player.interactTimer = 0;
    game.player.moving = false;
    // Forest and Witch House use their authored entrance positions so the
    // portal and story staging always begin from the intended spot.
    const canRestorePosition = !["Forest", "WitchHouse"].includes(
      game.state.scene,
    );
    const savedPlayer =
      canRestorePosition &&
      game.state.resume?.scene === game.state.scene &&
      game.state.resume.player;
    if (
      savedPlayer &&
      Number.isFinite(savedPlayer.x) &&
      Number.isFinite(savedPlayer.y)
    ) {
      x = savedPlayer.x;
      y = savedPlayer.y;
      game.player.dir = savedPlayer.dir || game.player.dir;
    }
    const spawn = game.findSafeSpawn(x, y, game.player);
    x = spawn.x;
    y = spawn.y;
    game.player.x = x;
    game.player.y = y;
    game.runtime.entities.push(game.player);
    game.player.el = game.img(
      game.ASSETS.andi.idle.up,
      "entity andi",
      x,
      y,
      154,
      "andi",
    );
    game.initCamera();
    if (withLumi) game.addLumi();
  };

  game.addLumi = function addLumi() {
    const l = { x: game.player.x + 55, y: game.player.y + 30, solid: false };
    game.runtime.lumi = l;
    l.el = game.img(
      game.ASSETS.lumi.normal,
      "entity lumi",
      l.x,
      l.y,
      52,
      "lumi",
    );
  };

  game.npc = function npc(
    id,
    src,
    x,
    y,
    cls = "npc",
    patrol = null,
    folder = null,
  ) {
    const n = {
      id,
      x,
      y,
      w: 44,
      h: 28,
      dir: "down",
      solid: true,
      patrol,
      folder,
      frame: 0,
      wait: Math.random() * 2 + 1,
    };
    const isChild = cls.split(" ").includes("nina");
    n.el = game.img(src, "entity npc " + cls, x, y, isChild ? 142 : 158, id);
    game.runtime.entities.push(n);
    return n;
  };

  game.setVillageNPCIdle = function setVillageNPCIdle(n, wait = 2.5) {
    n.tx = null;
    n.ty = null;
    n.wait = wait;
    n.frame = 0;
    const idleSrc =
      n.id === "sari"
        ? game.ASSETS.npc.sari
        : n.id === "bima"
          ? game.ASSETS.npc.bima
          : n.id === "nina"
            ? game.ASSETS.npc.nina
            : null;
    if (idleSrc && n.el?.getAttribute("src") !== idleSrc) n.el.src = idleSrc;
    game.renderEntity(n);
  };

  game.renderEntity = function renderEntity(e) {
    if (!e.el) return;
    e.el.style.left = (e.x / game.W) * 100 + "%";
    e.el.style.top = (e.y / game.H) * 100 + "%";
    e.el.style.zIndex = Math.floor(e.y);
    if (e === game.player) {
      let src = game.ASSETS.andi.idle[e.dir];
      e.el.classList.toggle("interacting", e.interactTimer > 0);
      if (e.interactTimer <= 0 && e.moving)
        src = game.ASSETS.andi.walk[e.dir][Math.floor(e.frame) % 4];
      if (e.el.getAttribute("src") !== src) e.el.src = src;
    }
  };

  game.lock = function lock() {
    game.player.moving = false;
    game.AudioManager.stopSFX("footstep");
  };

  game.move = function move(dt) {
    if (
      !game.player.el ||
      game.dialogActive ||
      game.cutsceneActive ||
      game.runtime.chapterIntroActive ||
      game.transitionActive ||
      game.runtime.portalLock ||
      game.pauseActive ||
      game.miniGameActive ||
      game.runtime.completed
    ) {
      game.lock();
      return;
    }
    let dx =
        (game.keys.has("d") || game.keys.has("arrowright") ? 1 : 0) -
        (game.keys.has("a") || game.keys.has("arrowleft") ? 1 : 0),
      dy =
        (game.keys.has("s") || game.keys.has("arrowdown") ? 1 : 0) -
        (game.keys.has("w") || game.keys.has("arrowup") ? 1 : 0);
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;
    game.player.moving = !!(dx || dy);
    if (game.player.moving) {
      const beforeX = game.player.x,
        beforeY = game.player.y;
      game.player.dir =
        Math.abs(dx) > Math.abs(dy)
          ? dx < 0
            ? "left"
            : "right"
          : dy < 0
            ? "up"
            : "down";
      const distance =
        game.player.speed * (game.state.difficulty === "HARD" ? 1.3 : 1) * dt;
      const steps = Math.max(1, Math.ceil(distance / 8));
      for (let step = 0; step < steps; step++) {
        const nx = game.player.x + (dx * distance) / steps,
          ny = game.player.y + (dy * distance) / steps;
        if (game.valid(nx, game.player.y)) game.player.x = nx;
        if (game.valid(game.player.x, ny)) game.player.y = ny;
      }
      game.player.moving =
        Math.hypot(game.player.x - beforeX, game.player.y - beforeY) > 0.01;
      if (game.player.moving) game.player.frame += dt * 8;
      game.player.footstepClock = game.player.moving
        ? (game.player.footstepClock || 0) + dt
        : 0;
      if (game.player.moving && game.player.footstepClock >= 0.36) {
        game.player.footstepClock = 0;
        // Soft, rate-varied indoor step; throttled to the walking cadence.
        const outdoors = ["Village", "Forest", "WitchApproach"].includes(
          game.state.scene,
        );
        game.AudioManager.playSFX("footstep", {
          level: outdoors ? 0.1 : 0.075,
          rate: outdoors ? 0.8 : 0.65,
          vary: 0.05,
          cooldown: 260,
        });
      }
      if (!game.player.moving) game.AudioManager.stopSFX("footstep");
    } else {
      game.player.footstepClock = 0;
      game.AudioManager.stopSFX("footstep");
    }
    if (game.player.interactTimer > 0) game.player.interactTimer -= dt;
    game.renderEntity(game.player);
    game.updateHeldItemPosition();
    if (game.runtime.lumi) {
      game.runtime.lumi.x +=
        (game.player.x + 55 - game.runtime.lumi.x) * Math.min(1, dt * 5);
      game.runtime.lumi.y +=
        (game.player.y + 25 - game.runtime.lumi.y) * Math.min(1, dt * 5);
      game.renderEntity(game.runtime.lumi);
    }
  };

  game.updateHeldItemPosition = function updateHeldItemPosition() {
    if (!game.runtime.held?.e) return;
    const offset =
      game.HELD_ITEM_OFFSETS[game.player.dir] || game.HELD_ITEM_OFFSETS.down;
    game.runtime.held.e.style.left =
      ((game.player.x + offset.x) / game.W) * 100 + "%";
    game.runtime.held.e.style.top =
      ((game.player.y + offset.y) / game.H) * 100 + "%";
    game.runtime.held.e.style.zIndex = Math.floor(game.player.y) + offset.z;
  };

  game.chooseNPCPatrolTarget = function chooseNPCPatrolTarget(n) {
    const [left, top, width, height] = n.patrol;
    // Only pick destinations whose foot collision box is clear. This keeps NPCs
    // from ever intentionally walking through the red collision areas.
    for (let attempt = 0; attempt < 36; attempt++) {
      const x = left + Math.random() * width;
      const y = top + Math.random() * height;
      if (game.valid(x, y, n)) return { x, y };
    }
    return null;
  };

  game.updateNPC = function updateNPC(dt) {
    game.runtime.entities
      ?.filter((e) => e !== game.player && e.patrol)
      .forEach((n) => {
        if (game.dialogActive || game.pauseActive || game.runtime.lumiEducation)
          return;
        n.wait -= dt;
        if (n.wait <= 0) {
          const target = game.chooseNPCPatrolTarget(n);
          n.tx = target?.x ?? null;
          n.ty = target?.y ?? null;
          // Shorter pauses and larger patrol spaces make villagers feel alive,
          // rather than repeatedly pacing in one small spot.
          n.wait = target ? 1.1 + Math.random() * 2.1 : 0.8;
        }
        if (n.tx) {
          let dx = n.tx - n.x,
            dy = n.ty - n.y,
            l = Math.hypot(dx, dy);
          if (l > 8) {
            dx /= l;
            dy /= l;
            const beforeX = n.x,
              beforeY = n.y,
              distance = 55 * dt;
            const steps = Math.max(1, Math.ceil(distance / 7));
            for (let step = 0; step < steps; step++) {
              const nx = n.x + (dx * distance) / steps,
                ny = n.y + (dy * distance) / steps;
              if (game.valid(nx, n.y, n)) n.x = nx;
              if (game.valid(n.x, ny, n)) n.y = ny;
            }
            if (Math.hypot(n.x - beforeX, n.y - beforeY) < 0.2) {
              n.tx = null;
              n.ty = null;
              n.wait = 0.8 + Math.random();
            }
            game.face(n, { x: n.tx, y: n.ty });
            n.frame = (n.frame || 0) + dt * 7;
            if (n.folder) {
              const src =
                game.ASSETS.npc.walk[n.folder][n.dir][Math.floor(n.frame) % 4];
              if (n.el.getAttribute("src") !== src) n.el.src = src;
            }
            game.renderEntity(n);
          } else {
            n.tx = null;
            n.ty = null;
            const idleSrc =
              n.id === "sari"
                ? game.ASSETS.npc.sari
                : n.id === "bima"
                  ? game.ASSETS.npc.bima
                  : n.id === "nina"
                    ? game.ASSETS.npc.nina
                    : null;
            if (idleSrc && n.el.getAttribute("src") !== idleSrc)
              n.el.src = idleSrc;
            game.renderEntity(n);
          }
        }
      });
  };
})(window.ForMotherRuntime);
