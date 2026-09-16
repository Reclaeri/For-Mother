/* For Mother - player/collision. Shared state stays inside the runtime closure. */
((game) => {
  "use strict";

game.dist = function dist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  };

game.rectHit = function rectHit(x, y, w, h, r) {
    return (
      x + w / 2 > r.x &&
      x - w / 2 < r.x + r.w &&
      y + h / 2 > r.y &&
      y - h / 2 < r.y + r.h
    );
  };

game.collisionBox = function collisionBox(who, x = who.x, y = who.y) {
    // Invisible floor collision: independent of the illustrated sprite bounds.
    // A small directional offset follows the leading foot without catching decor.
    if (who === game.player) {
      const offset = { up: [0, -3], down: [0, 3], left: [-3, 0], right: [3, 0] }[who.dir] || [0, 0];
      return { x: x + offset[0], y: y - 75 + offset[1], w: 22, h: 12 };
    }
    // NPCs use the same stable foot box, so their solid area matches what is visible.
    if (who.el && who.solid !== false) return { x, y: y - 75, w: 32, h: 26 };
    return { x, y, w: who.w, h: who.h };
  };

game.valid = function valid(x, y, who = game.player) {
    const box = game.collisionBox(who, x, y);
    if (
      box.x - box.w / 2 < game.runtime.bounds?.l ||
      box.x + box.w / 2 > game.runtime.bounds?.r ||
      box.y - box.h / 2 < game.runtime.bounds?.t ||
      box.y + box.h / 2 > game.runtime.bounds?.b
    )
      return false;
    if (game.runtime.obstacles.some((r) => game.rectHit(box.x, box.y, box.w, box.h, r)))
      return false;
    return !game.runtime.entities.some((e) => {
      if (e === who || e.solid === false) return false;
      const other = game.collisionBox(e);
      return (
        Math.abs(other.x - box.x) < (other.w + box.w) / 2 &&
        Math.abs(other.y - box.y) < (other.h + box.h) / 2
      );
    });
  };

game.obstacle = function obstacle(x, y, w, h, id) {
    game.runtime.obstacles.push({ x, y, w, h, id });
    game.drawDebug();
  };

game.bounds = function bounds(l = 55, t = 120, r = 1617, b = 900) {
    game.runtime.bounds = { l, t, r, b };
  };

game.findSafeSpawn = function findSafeSpawn(x, y, who) {
    if (game.valid(x, y, who)) return { x, y };
    const offsets = [24, 48, 72, 108, 150, 210, 285, 360];
    for (const radius of offsets) {
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
        const candidate = {
          x: x + Math.cos(angle) * radius,
          y: y + Math.sin(angle) * radius,
        };
        if (game.valid(candidate.x, candidate.y, who)) return candidate;
      }
    }
    const fallback = {
      x: Math.max(
        game.runtime.bounds.l + who.w,
        Math.min(game.runtime.bounds.r - who.w, x),
      ),
      y: Math.max(
        game.runtime.bounds.t + who.h,
        Math.min(game.runtime.bounds.b - who.h, y),
      ),
    };
    return game.valid(fallback.x, fallback.y, who)
      ? fallback
      : {
          x: (game.runtime.bounds.l + game.runtime.bounds.r) / 2,
          y: (game.runtime.bounds.t + game.runtime.bounds.b) / 2,
        };
  };

game.resolveInteractionPoint = function resolveInteractionPoint(x, y) {
    const isClear = (px, py) => {
      const box = game.collisionBox(game.player, px, py);
      return !game.runtime.obstacles.some((area) => game.rectHit(box.x, box.y, box.w, box.h, area));
    };
    if (isClear(x, y)) return { x, y };
    // A target is never placed inside a solid object. Search the nearby floor
    // once when it is created; this does not add work to the game loop.
    for (const distance of [42, 72, 104, 138, 174]) {
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
        const px = x + Math.cos(angle) * distance;
        const py = y + Math.sin(angle) * distance;
        if (isClear(px, py)) return { x: px, y: py };
      }
    }
    return { x, y };
  };

game.drawDebug = function drawDebug() {
    if (!game.els.debug || !game.runtime.obstacles) return;
    game.els.debug.innerHTML = "";
    game.els.debug.classList.toggle("active", game.debugCollisions);
    if (!game.debugCollisions) return;
    const rect = (x, y, w, h, label, cls = "debugrect") => {
      const d = document.createElement("div");
      d.className = cls;
      d.textContent = label || "";
      Object.assign(d.style, {
        left: `${(x / game.W) * 100}%`,
        top: `${(y / game.H) * 100}%`,
        width: `${(w / game.W) * 100}%`,
        height: `${(h / game.H) * 100}%`,
      });
      game.els.debug.append(d);
    };
    game.runtime.obstacles.forEach((r) => rect(r.x, r.y, r.w, r.h, r.id));
    if (game.runtime.bounds) {
      const b = game.runtime.bounds;
      rect(b.l, b.t, b.r - b.l, b.b - b.t, "bounds", "debugbounds");
    }
    game.runtime.entities
      .filter((e) => e !== game.player)
      .forEach((e) => {
        const box = game.collisionBox(e);
        rect(
          box.x - box.w / 2,
          box.y - box.h / 2,
          box.w,
          box.h,
          e.id || "NPC",
          "debugentity",
        );
      });
    const detector = game.interactionBox();
    rect(
      detector.x - detector.w / 2,
      detector.y - detector.h / 2,
      detector.w,
      detector.h,
      "Andi/interaksi / collision",
      "debugplayerinteraction",
    );
    game.runtime.interactables.forEach((i) => {
      const r = i.radius || 58;
      rect(i.x - r, i.y - r * 0.78, r * 2, r * 1.56, i.id, "debugcircle");
    });
    game.runtime.portals?.forEach((p) =>
      rect(
        p.x - p.radius,
        p.y - p.radius * 0.78,
        p.radius * 2,
        p.radius * 1.56,
        "portal/otomatis",
        "debugcircle",
      ),
    );
  };

game.addChapterFurnitureCollisions = function addChapterFurnitureCollisions(n) {
    // These rectangles follow the baked-in furniture silhouettes. Large objects
    // cover their visible floor area so Andi cannot appear to walk on top of
    // them, while freestanding bins use only a short contact strip at the base.
    const collisionPresets = {
      1: [
        [0, 175, 115, 215, "c1_dinding_kiri_atas"],
        [128, 205, 145, 155, "c1_laci_kiri"],
        [258, 175, 212, 105, "c1_pintu_atas"],
        [470, 175, 425, 70, "c1_dinding_jendela"],
        // Leave the freestanding anorganic bin clear of the baked-in table and
        // bookshelf colliders; its own base strip below is the only solid area.
        [890, 175, 390, 185, "c1_meja_tempat_sampah_background"],
        [270, 382, 100, 32, "c1_kaki_tong_organik"],
        [1300, 382, 100, 32, "c1_kaki_tong_anorganik"],
        [1420, 175, 190, 250, "c1_rak_buku_kanan"],
        [0, 370, 100, 190, "c1_tanaman_kiri"],
        [0, 610, 315, 225, "c1_meja_kiri_bawah"],
        [272, 730, 100, 110, "c1_bangku_kiri_bawah"],
        [1490, 340, 182, 250, "c1_sapu_dan_keranjang_kanan"],
        [1490, 710, 182, 190, "c1_tanaman_kanan_bawah"],
      ],
      2: [
        [0, 175, 130, 275, "c2_dinding_kiri"],
        [140, 175, 365, 260, "c2_rak_buku_kiri"],
        [505, 175, 85, 100, "c2_tiang_jendela_kiri"],
        [590, 175, 405, 100, "c2_jendela"],
        [995, 175, 65, 120, "c2_tiang_jendela_kanan"],
        [1210, 175, 300, 270, "c2_lemari_kanan"],
        [1510, 175, 162, 285, "c2_dinding_kanan"],
        [0, 475, 375, 410, "c2_meja_kiri"],
        [320, 610, 115, 150, "c2_bangku_kiri"],
        [1360, 370, 130, 110, "c2_kotak_kanan"],
        [1330, 510, 342, 390, "c2_laci_kanan"],
      ],
      3: [
        [0, 175, 110, 300, "c3_dinding_kiri"],
        [210, 175, 335, 255, "c3_rak_buku_kiri"],
        [545, 175, 75, 105, "c3_tiang_jendela_kiri"],
        [620, 175, 430, 95, "c3_jendela"],
        [1050, 175, 70, 105, "c3_tiang_jendela_kanan"],
        [1205, 175, 310, 255, "c3_lemari_kanan"],
        [1515, 175, 157, 300, "c3_dinding_kanan"],
        [0, 435, 105, 130, "c3_celah_dinding_kiri"],
        [0, 625, 385, 275, "c3_area_peralatan_pel"],
        [1370, 350, 125, 110, "c3_kotak_kanan"],
        [1340, 480, 332, 420, "c3_laci_kanan"],
      ],
      4: [
        [0, 175, 110, 240, "c4_dinding_kiri"],
        [130, 175, 335, 205, "c4_rak_buku_kiri"],
        [465, 175, 680, 75, "c4_dinding_jendela"],
        [1240, 175, 330, 225, "c4_sofa"],
        [1570, 175, 102, 245, "c4_dinding_kanan"],
        [0, 390, 290, 310, "c4_meja_kiri"],
        [230, 530, 105, 125, "c4_bangku_kiri"],
        [0, 745, 120, 155, "c4_tanaman_kiri_bawah"],
        [1370, 390, 302, 275, "c4_peti_mainan"],
        [1505, 565, 167, 220, "c4_laci_kanan"],
        [1035, 695, 500, 205, "c4_deret_tempat_sampah"],
        [1535, 765, 137, 135, "c4_tanaman_kanan_bawah"],
      ],
      5: [
        [0, 175, 120, 310, "c5_dinding_kiri"],
        [220, 175, 285, 210, "c5_rak_buku_kiri"],
        [505, 175, 115, 95, "c5_sapu_dan_buku_atas"],
        [625, 190, 415, 105, "c5_meja_kristal"],
        [1040, 175, 105, 115, "c5_tanaman_atas"],
        [1145, 175, 240, 155, "c5_lemari_atas_kanan"],
        [1385, 175, 185, 255, "c5_pintu_kanan"],
        [1570, 175, 102, 315, "c5_dinding_kanan"],
        [0, 475, 120, 260, "c5_dinding_kiri_tengah"],
        [150, 490, 275, 200, "c5_meja_kiri"],
        [360, 665, 100, 100, "c5_bangku_kiri"],
        [40, 700, 180, 160, "c5_peti_kiri_bawah"],
        [1330, 475, 125, 135, "c5_peralatan_pel"],
        [1420, 550, 252, 185, "c5_meja_kanan"],
        [1200, 705, 240, 180, "c5_peti_kanan_bawah"],
        [1440, 700, 232, 200, "c5_peralatan_kanan_bawah"],
      ],
    };
    (collisionPresets[n] || []).forEach(([x, y, w, h, id]) =>
      game.obstacle(x, y, w, h, id),
    );
  };
})(window.ForMotherRuntime);
