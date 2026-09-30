/* Opening sequence and bounded image preloading; works without a server too. */
((game) => {
  "use strict";
  game.showBoot = async () => {
    const screen = document.getElementById("boot-screen");
    const root = document.getElementById("game");
    root.inert = true;
    game.bootLoading = true;
    const reduced =
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      game.state.settings.motion === false;
    screen.dataset.reduced = String(reduced);
    let skip;
    const skipped = new Promise((resolve) => {
      skip = resolve;
    });
    const button = document.getElementById("boot-skip");
    button.onclick = () => {
      skip();
      button.hidden = true;
    };
    const wait = (ms) =>
      Promise.race([
        new Promise((resolve) => setTimeout(resolve, ms)),
        skipped,
      ]);
    const urls = new Set([
      "assets/Logo Tim.png",
      "assets/ui/logo_for_mother.png",
      "assets/cutscenes/penyihir/cutscene_andi_go_to_witch_house.png",
    ]);
    const collect = (value) => {
      // Clean dust layers are optional, generated/handled by the cleaning system.
      if (
        typeof value === "string" &&
        /\.(png|jpe?g|webp)$/i.test(value) &&
        !/dust_(shelf|table|window)_clean\.png$/i.test(value)
      )
        urls.add(value);
      else if (value && typeof value === "object")
        Object.values(value).forEach(collect);
    };
    collect(game.ASSETS);
    let loaded = 0,
      failed = 0;
    const status = document.getElementById("boot-status");
    const message = document.getElementById("boot-message");
    const updateProgress = (percent) => {
      const stage = percent < 40 ? 0 : percent < 100 ? 1 : 2;
      screen.dataset.loadStage = stage;
      status.textContent = [
        "Membangunkan hutan",
        "Merangkai cerita dan kenangan",
        "Perjalanan siap dimulai",
      ][stage];
      message.textContent = [
        "Sebuah langkah kecil. Sebuah harapan besar.",
        "Bahkan di dalam gelap, kamu tidak sendiri.",
        "Ada seseorang yang menunggu kita pulang.",
      ][stage];
    };
    updateProgress(0);
    const preload = Promise.all(
      [...urls].map(
        (src) =>
          new Promise((resolve) => {
            const img = new Image();
            let settled = false;
            const done = (success) => {
              if (settled) return;
              settled = true;
              clearTimeout(timeout);
              if (!success) failed++;
              const percent = Math.round((++loaded / urls.size) * 100);
              screen.style.setProperty("--load", percent + "%");
              updateProgress(percent);
              screen
                .querySelector(".mobile-boot-track")
                .setAttribute("aria-valuenow", percent);
              document.getElementById("boot-percent").textContent =
                percent + "%";
              resolve();
            };
            const timeout = setTimeout(() => done(false), 12000);
            img.onload = () => done(true);
            img.onerror = () => done(false);
            img.src = src;
          }),
      ),
    );
    await wait(reduced ? 0 : 1100);
    screen.dataset.phase = "loading";
    button.hidden = true;
    await Promise.all([preload, wait(reduced ? 100 : 1800)]);
    status.textContent = "Perjalanan siap dimulai";
    if (failed) console.warn(`Boot: ${failed} aset belum berhasil dimuat.`);
    await wait(reduced ? 100 : 500);
    screen.classList.add("boot-exit");
    await new Promise((resolve) => setTimeout(resolve, reduced ? 0 : 650));
    screen.remove();
    root.inert = false;
    game.bootLoading = false;
    game.keys.clear();
  };
})(window.ForMotherRuntime);
