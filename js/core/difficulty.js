/* Difficulty and persisted, collision-checked room layouts. */
((game) => {
  "use strict";
  game.DIFFICULTIES = Object.freeze({
    EASY: {
      description: "Mode santai untuk menikmati cerita",
      timers: [120, 110, 150, 130, 110],
      trash: 5,
      pipe: 1,
      window: 2,
      stains: 5,
      repairs: 2,
      extraStains: 0,
      sorting: 5,
      final: 12,
      hint: 10,
    },
    MEDIUM: {
      description: "Pengalaman utama FOR MOTHER",
      timers: [90, 80, 105, 90, 75],
      trash: 9,
      pipe: 2,
      window: 3,
      stains: 7,
      repairs: 2,
      extraStains: 1,
      sorting: 6,
      final: 14,
      hint: 20,
    },
    HARD: {
      description: "Tantangan kebersihan terbaik",
      timers: [70, 65, 85, 70, 60],
      trash: 14,
      pipe: 3,
      window: 4,
      stains: 9,
      repairs: 2,
      extraStains: 2,
      sorting: 8,
      final: 16,
      hint: 40,
    },
  });
  game.difficulty = () =>
    game.DIFFICULTIES[game.state.difficulty] || game.DIFFICULTIES.MEDIUM;
  game.chapterTimeLimit = (n) => game.difficulty().timers[n - 1];
  game.spawnAreas = {
    spawnAreaCleaning: [280, 310, 1340, 830],
    spawnAreaStain: [390, 330, 1280, 800],
    spawnAreaRepair: [380, 330, 1290, 790],
  };
  game.spawnPositionValid = (point, spacing, others = [], reserved = []) => {
    const [x, y] = point;
    // Reserve the entrance and a continuous main walking lane.
    if ((x > 800 && x < 855) || Math.hypot(x - 830, y - 815) < 100)
      return false;
    if (!game.valid(x, y) || !game.valid(x, y + 55)) return false;
    if (game.runtime.obstacles.some((r) => game.rectHit(x, y - 20, 80, 80, r)))
      return false;
    return (
      !others.some((p) => Math.hypot(x - p[0], y - p[1]) < spacing) &&
      !reserved.some((p) => Math.hypot(x - p[0], y - p[1]) < (p[2] || 100))
    );
  };
  game.spawnLayout = (
    key,
    count,
    kind = "spawnAreaCleaning",
    spacing = 100,
    reserved = [],
  ) => {
    const chapter = game.runtime.chapterTimer.chapter;
    const data = (game.state.chapterProgress[`chapter${chapter}`] ||= {});
    data.layouts ||= {};
    if (data.layouts[key]?.length === count) return data.layouts[key];
    const [left, top, right, bottom] = game.spawnAreas[kind];
    // Retry a whole packing instead of silently violating spacing when crowded.
    for (let attempt = 0; attempt < 40; attempt++) {
      const points = [];
      if (count > 25) {
        const candidates = [];
        const offsetX = Math.random() * spacing,
          offsetY = Math.random() * spacing * 0.86;
        for (
          let row = 0, y = top + offsetY;
          y <= bottom;
          row++, y += spacing * 0.87
        ) {
          for (
            let x = left + offsetX + ((row % 2) * spacing) / 2;
            x <= right;
            x += spacing
          ) {
            const p = [Math.round(x), Math.round(y)];
            if (game.spawnPositionValid(p, spacing, [], reserved))
              candidates.push(p);
          }
        }
        for (let i = candidates.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
        }
        candidates.forEach((p) => {
          if (
            points.length < count &&
            game.spawnPositionValid(p, spacing, points, reserved)
          )
            points.push(p);
        });
      }
      for (let trial = 0; trial < 12000 && points.length < count; trial++) {
        const p = [
          Math.round(left + Math.random() * (right - left)),
          Math.round(top + Math.random() * (bottom - top)),
        ];
        if (game.spawnPositionValid(p, spacing, points, reserved))
          points.push(p);
      }
      if (points.length === count) {
        data.layouts[key] = points;
        return points;
      }
    }
    throw new Error(`Area spawn tidak cukup: ${key} (${count})`);
  };
})(window.ForMotherRuntime);
