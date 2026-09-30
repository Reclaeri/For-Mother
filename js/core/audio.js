/* For Mother - core/audio. Shared state stays inside the runtime closure. */
((game) => {
  "use strict";

  game.AudioManager = (() => {
    const music = new Audio();
    music.loop = true;
    music.preload = "auto";
    let currentTrack = "",
      baseMusicLevel = 1,
      duckFactor = 1,
      unlocked = false,
      switchToken = 0;
    const loops = new Map(),
      lastPlayed = new Map();
    const voices = new Set(),
      counts = new Map();
    let priorityFactor = 1,
      environmentFactor = 1,
      paused = false,
      mixToken = 0;
    const settings = () => game.state.settings || game.defaults().settings;
    const master = () =>
      settings().muted
        ? 0
        : Math.max(0, Math.min(1, settings().masterVolume / 100));
    const musicGain = () =>
      master() *
      Math.max(0, Math.min(1, settings().musicVolume / 100)) *
      baseMusicLevel *
      duckFactor *
      priorityFactor;
    const sfxGain = (level = 1, category = "interaction") =>
      master() *
      Math.max(0, Math.min(1, settings().sfxVolume / 100)) *
      level *
      (category === "ambience" ? environmentFactor : 1);
    const safePlay = (audio) => {
      const promise = audio.play();
      promise?.catch?.(() => {});
      return promise;
    };
    const ramp = (from, to, ms, update, done) => {
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / Math.max(1, ms));
        update(from + (to - from) * p);
        if (p < 1) requestAnimationFrame(tick);
        else done?.();
      };
      requestAnimationFrame(tick);
    };
    function applyVolumes() {
      music.volume = Math.max(0, Math.min(1, musicGain()));
      loops.forEach(
        ({ audio, level, category }) =>
          (audio.volume = sfxGain(level, category)),
      );
      voices.forEach((voice) => {
        voice.audio.volume = sfxGain(voice.level, voice.category);
      });
    }
    function unlock() {
      unlocked = true;
      if (currentTrack && music.paused) safePlay(music);
    }
    function playMusic(track, level = 1, fadeMs = 750) {
      baseMusicLevel = level;
      if (currentTrack === track) {
        applyVolumes();
        if (unlocked && music.paused) safePlay(music);
        return;
      }
      const token = ++switchToken;
      const change = () => {
        if (token !== switchToken) return;
        music.pause();
        music.src = track;
        music.currentTime = 0;
        currentTrack = track;
        music.volume = 0;
        if (unlocked) safePlay(music);
        ramp(0, 1, fadeMs, (v) => {
          if (token === switchToken)
            music.volume = Math.max(0, Math.min(1, musicGain() * v));
        });
      };
      if (currentTrack && !music.paused && music.volume > 0.01)
        ramp(
          music.volume,
          0,
          fadeMs * 0.55,
          (v) => {
            if (token === switchToken) music.volume = Math.min(v, musicGain());
          },
          change,
        );
      else change();
    }
    function playSFX(
      name,
      {
        level = 1,
        rate = 1,
        vary = 0,
        cooldown = 45,
        category = "interaction",
      } = {},
    ) {
      if (!unlocked || settings().muted) return null;
      const source = game.AUDIO_ASSETS.sfx[name];
      if (!source) return null;
      const now = performance.now();
      if (now - (lastPlayed.get(source) ?? -Infinity) < Math.max(45, cooldown))
        return null;
      lastPlayed.set(source, now);
      if (voices.size >= 6) {
        const oldest =
          [...voices].find((v) => v.category !== "dialog") ||
          voices.values().next().value;
        if (oldest) {
          oldest.audio.pause();
          voices.delete(oldest);
        }
      }
      const audio = new Audio(source);
      const voice = {
        audio,
        name,
        level,
        category: name === "dialog_type" ? "dialog" : category,
      };
      voices.add(voice);
      counts.set(name, (counts.get(name) || 0) + 1);
      const release = () => voices.delete(voice);
      audio.addEventListener("ended", release, { once: true });
      audio.addEventListener("error", release, { once: true });
      audio.preload = "auto";
      audio.volume = sfxGain(level, voice.category);
      audio.playbackRate = Math.max(0.5, rate + (Math.random() * 2 - 1) * vary);
      safePlay(audio);
      return audio;
    }
    function startLoop(
      name,
      { level = 0.55, rate = 1, category = "interaction" } = {},
    ) {
      if (
        loops.has(name) ||
        !unlocked ||
        settings().muted ||
        paused ||
        !game.AUDIO_ASSETS.sfx[name]
      )
        return;
      const audio = new Audio(game.AUDIO_ASSETS.sfx[name]);
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = sfxGain(level, category);
      audio.playbackRate = rate;
      loops.set(name, { audio, level, category });
      counts.set(name + ":loop", (counts.get(name + ":loop") || 0) + 1);
      safePlay(audio);
    }
    function updateLoop(name, { level, rate } = {}) {
      const entry = loops.get(name);
      if (!entry) return;
      if (typeof level === "number") {
        entry.level = level;
        entry.audio.volume = sfxGain(level, entry.category);
      }
      if (typeof rate === "number") entry.audio.playbackRate = rate;
    }
    function stopLoop(name, fadeMs = 100) {
      const entry = loops.get(name);
      if (!entry) return;
      loops.delete(name);
      if (fadeMs <= 0) {
        entry.audio.pause();
        entry.audio.currentTime = 0;
        return;
      }
      const from = entry.audio.volume;
      ramp(
        from,
        0,
        fadeMs,
        (v) => (entry.audio.volume = v),
        () => {
          entry.audio.pause();
          entry.audio.currentTime = 0;
        },
      );
    }
    function stopAllLoops() {
      [...loops.keys()].forEach((name) => stopLoop(name, 0));
    }
    function stopSceneAudio() {
      stopAllLoops();
      voices.forEach(({ audio }) => audio.pause());
      voices.clear();
      lastPlayed.clear();
      paused = false;
      mixToken++;
      duckFactor = priorityFactor = environmentFactor = 1;
      applyVolumes();
    }
    function stopSFX(name) {
      voices.forEach((voice) => {
        if (voice.name === name) {
          voice.audio.pause();
          voices.delete(voice);
        }
      });
    }
    function setPriority(dialog, interacting) {
      const next = dialog ? 0.35 : interacting ? 0.65 : 1;
      const ambient = dialog ? 0.18 : interacting ? 0.45 : 1;
      if (next === priorityFactor && ambient === environmentFactor) return;
      priorityFactor = next;
      environmentFactor = ambient;
      applyVolumes();
    }
    function setPaused(value) {
      paused = value;
      const token = ++mixToken;
      const from = duckFactor,
        to = paused ? 0.5 : 1;
      ramp(from, to, 240, (value) => {
        if (token !== mixToken) return;
        duckFactor = value;
        applyVolumes();
      });
      if (paused) stopAllLoops();
    }
    [
      "ui_click",
      "dialog_type",
      "trash_pickup",
      "trash_dispose",
      "wipe_clean",
      "mop_scrub",
      "objective_complete",
    ].forEach((name) => {
      const audio = new Audio(game.AUDIO_ASSETS.sfx[name]);
      audio.preload = "auto";
    });
    music.addEventListener("error", () =>
      console.warn("Audio musik gagal dimuat:", music.src),
    );
    return {
      unlock,
      playMusic,
      playSFX,
      startLoop,
      updateLoop,
      stopLoop,
      stopAllLoops,
      stopSceneAudio,
      stopSFX,
      setPriority,
      snapshot: () => ({
        loops: [...loops.keys()],
        voices: voices.size,
        counts: Object.fromEntries(counts),
        priorityFactor,
        environmentFactor,
      }),
      setPaused,
      applyVolumes,
      get currentTrack() {
        return currentTrack;
      },
      get unlocked() {
        return unlocked;
      },
    };
  })();

  game.playCorrectSfx = function playCorrectSfx() {
    game.AudioManager.playSFX("correct", {
      level: game.state.scene === "Chapter5" ? 0.8 : 0.68,
      vary: 0.03,
      cooldown: 90,
    });
  };

  game.syncEnvironmentAudio = function syncEnvironmentAudio() {
    game.AudioManager.setPriority(
      game.dialogActive || !!game.runtime.lumiEducation,
      !!game.runtime.repair || !!game.runtime.cleaning || game.miniGameActive,
    );
    const chapter = game.runtime.chapterTimer?.chapter;
    const active =
      chapter &&
      game.runtime.chapterTimer.started &&
      !game.runtime.completed &&
      !game.runtime.chapterTimer.expired &&
      !game.pauseActive &&
      !game.transitionActive &&
      !game.runtime.restoration;
    const conditions = [
      [
        "water_leak",
        active && chapter === 2 && !game.runtime.sources?.pipe,
        0.13,
        0.85,
      ],
      [
        "wind",
        active && chapter === 2 && !game.runtime.sources?.window,
        0.075,
        0.65,
      ],
      [
        "room_tone",
        active && chapter !== 2,
        chapter === 1 ? 0.045 : chapter === 3 ? 0.025 : 0.018,
        chapter === 3 ? 0.6 : 0.8,
      ],
    ];
    conditions.forEach(([name, enabled, level, rate]) => {
      if (enabled) {
        const gain = level * (1 - (game.runtime.clean || 0) / 180);
        game.AudioManager.startLoop(name, {
          level: gain,
          rate,
          category: "ambience",
        });
        game.AudioManager.updateLoop(name, { level: gain, rate });
      } else game.AudioManager.stopLoop(name, 80);
    });
  };
})(window.ForMotherRuntime);
