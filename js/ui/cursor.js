/* Native CSS cursors keep mouse input and mini-game tool cursors intact. */
((game) => {
  "use strict";

  const cursor = (label, artwork) => {
    const image =
      "data:image/svg+xml," +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">${artwork}</svg>`,
      );
    return Object.freeze({ label, image, css: `url("${image}") 3 3, auto` });
  };

  game.CURSORS = Object.freeze({
    system: Object.freeze({ label: "Sistem", css: "auto" }),
    gold: cursor(
      "Emas",
      '<path d="M3 3 25 17 15 19 11 29Z" fill="#efd393" stroke="#382719" stroke-width="2" stroke-linejoin="round"/><path d="m6 7 7 12" stroke="#fff8dc" stroke-width="2"/>',
    ),
    lumi: cursor(
      "Lumi",
      '<path d="M3 3 25 16 15 19 11 29Z" fill="#bcefff" stroke="#3b3264" stroke-width="2" stroke-linejoin="round"/><path d="m23 2 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#f8e5ff" stroke="#765294"/>',
    ),
    leaf: cursor(
      "Daun",
      '<path d="M3 3C28 3 32 22 20 26 10 29 6 18 3 3Z" fill="#a8ce8b" stroke="#284936" stroke-width="2"/><path d="m4 4 19 23m-8-11 9 1m-5 3-1-8" fill="none" stroke="#426845" stroke-width="1.5" stroke-linecap="round"/>',
    ),
    heart: cursor(
      "Hati",
      '<path d="M3 3 12 27 16 18 26 14Z" fill="#ffe0e8" stroke="#68334c" stroke-width="2" stroke-linejoin="round"/><path d="M22 9C16 2 11 11 22 18 33 11 28 2 22 9Z" fill="#ed88a6" stroke="#68334c" stroke-width="1.5"/>',
    ),
    star: cursor(
      "Bintang",
      '<path d="M3 3 12 28 16 18 27 14Z" fill="#fff0b3" stroke="#68502b" stroke-width="2" stroke-linejoin="round"/><path d="m22 3 2.2 5 5.3.5-4 3.5 1.2 5.2-4.7-2.7-4.7 2.7 1.2-5.2-4-3.5 5.3-.5Z" fill="#f6c75c" stroke="#68502b" stroke-width="1.3" stroke-linejoin="round"/>',
    ),
    crystal: cursor(
      "Kristal",
      '<path d="m3 3 22 8 4 14-14 4Z" fill="#baacf0" stroke="#443460" stroke-width="2" stroke-linejoin="round"/><path d="m3 3 14 11 8-3M17 14l-2 15m2-15 12 11" fill="none" stroke="#7254a0" stroke-width="1.5"/><path d="m6 6 11 8-3 8Z" fill="#eee7ff"/>',
    ),
    potion: cursor(
      "Ramuan Ibu",
      '<path d="M3 3 10 24 14 15 23 11Z" fill="#efd393" stroke="#382719" stroke-width="2" stroke-linejoin="round"/><path d="M20 13v4c-8 5-6 12 2 12s10-7 2-12v-4" fill="#d8e7b0" stroke="#405139" stroke-width="1.7"/><path d="M17 23q5-2 10 0c0 6-10 6-10 0Z" fill="#88ab70"/><path d="M19 12h6v4h-6Z" fill="#ba8a55" stroke="#58432c" stroke-width="1.5"/><path d="m18 20-1 2" stroke="#fff8dc" stroke-width="2" stroke-linecap="round"/>',
    ),
    broom: cursor(
      "Sapu Kayu",
      '<path d="m3 3 17 17" stroke="#443326" stroke-width="5" stroke-linecap="round"/><path d="m3 3 17 17" stroke="#c69b62" stroke-width="2" stroke-linecap="round"/><path d="m18 15 7 4 5 9q-7 4-15-5Z" fill="#d6b779" stroke="#59432b" stroke-width="1.8" stroke-linejoin="round"/><path d="m18 19 8 9m-5-11 7 10m-12-6 5 7" stroke="#96703d" stroke-width="1.2"/><path d="m17 17 6 5" stroke="#72865a" stroke-width="3"/>',
    ),
    sprout: cursor(
      "Tunas Harapan",
      '<path d="M3 3 11 28 16 18 26 13Z" fill="#efe0b5" stroke="#493d28" stroke-width="2" stroke-linejoin="round"/><path d="M22 22V10" stroke="#45613e" stroke-width="2" stroke-linecap="round"/><path d="M22 15C15 16 13 11 14 7c5 0 9 3 8 8Z" fill="#a6bd78" stroke="#45613e" stroke-width="1.5"/><path d="M22 11c-1-6 3-8 8-8 0 5-3 9-8 8Z" fill="#c1d796" stroke="#45613e" stroke-width="1.5"/>',
    ),
  });

  // Preserve saved preferences when replacing the old cursor designs.
  const legacyCursors = Object.freeze({ feather: "potion", pixel: "broom" });
  game.cursorChoice = (value) => {
    const choice = Object.hasOwn(legacyCursors, value)
      ? legacyCursors[value]
      : value;
    return Object.hasOwn(game.CURSORS, choice) ? choice : "gold";
  };

  game.applyCursor = () => {
    const choice = game.cursorChoice(game.state.settings.cursor);
    game.state.settings.cursor = choice;
    document.body.dataset.cursor = choice;
    document.body.style.setProperty("--game-cursor", game.CURSORS[choice].css);
  };
})(window.ForMotherRuntime);
