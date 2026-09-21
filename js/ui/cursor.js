/* Native CSS cursors keep mouse input and mini-game tool cursors intact. */
((game) => {
  "use strict";

  const cursor = (label, artwork) => {
    const image = "data:image/svg+xml," + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">${artwork}</svg>`,
    );
    return Object.freeze({ label, image, css: `url("${image}") 3 3, auto` });
  };

  game.CURSORS = Object.freeze({
    system: Object.freeze({ label: "Sistem", css: "auto" }),
    gold: cursor("Emas", '<path d="M3 3 25 17 15 19 11 29Z" fill="#efd393" stroke="#382719" stroke-width="2" stroke-linejoin="round"/><path d="m6 7 7 12" stroke="#fff8dc" stroke-width="2"/>'),
    lumi: cursor("Lumi", '<path d="M3 3 25 16 15 19 11 29Z" fill="#bcefff" stroke="#3b3264" stroke-width="2" stroke-linejoin="round"/><path d="m23 2 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#f8e5ff" stroke="#765294"/>'),
    leaf: cursor("Daun", '<path d="M3 3C28 3 32 22 20 26 10 29 6 18 3 3Z" fill="#a8ce8b" stroke="#284936" stroke-width="2"/><path d="m4 4 19 23m-8-11 9 1m-5 3-1-8" fill="none" stroke="#426845" stroke-width="1.5" stroke-linecap="round"/>'),
    heart: cursor("Hati", '<path d="M3 3 12 27 16 18 26 14Z" fill="#ffe0e8" stroke="#68334c" stroke-width="2" stroke-linejoin="round"/><path d="M22 9C16 2 11 11 22 18 33 11 28 2 22 9Z" fill="#ed88a6" stroke="#68334c" stroke-width="1.5"/>'),
    star: cursor("Bintang", '<path d="M3 3 12 28 16 18 27 14Z" fill="#fff0b3" stroke="#68502b" stroke-width="2" stroke-linejoin="round"/><path d="m22 3 2.2 5 5.3.5-4 3.5 1.2 5.2-4.7-2.7-4.7 2.7 1.2-5.2-4-3.5 5.3-.5Z" fill="#f6c75c" stroke="#68502b" stroke-width="1.3" stroke-linejoin="round"/>'),
    crystal: cursor("Kristal", '<path d="m3 3 22 8 4 14-14 4Z" fill="#baacf0" stroke="#443460" stroke-width="2" stroke-linejoin="round"/><path d="m3 3 14 11 8-3M17 14l-2 15m2-15 12 11" fill="none" stroke="#7254a0" stroke-width="1.5"/><path d="m6 6 11 8-3 8Z" fill="#eee7ff"/>'),
    feather: cursor("Bulu Pena", '<path d="M3 3C19 2 30 8 28 17S14 28 9 21Z" fill="#f3e6c9" stroke="#594838" stroke-width="2" stroke-linejoin="round"/><path d="m3 3 24 25m-13-14 8-1m-3 6 9-1m-12-3-1 7" fill="none" stroke="#a5835b" stroke-width="1.5" stroke-linecap="round"/>'),
    pixel: cursor("Piksel", '<path d="M3 3h4v4h4v4h4v4h4v4h-8v4H7v5H3Z" fill="#b3edda" stroke="#234b49" stroke-width="2" stroke-linejoin="miter"/><path d="M6 8v13m4-8v4" fill="none" stroke="#f0fff5" stroke-width="2"/><path d="M15 21h4v4h4v4h-4v-4h-4Z" fill="#75bfae" stroke="#234b49" stroke-width="1.5"/>'),
  });

  game.cursorChoice = (value) => Object.hasOwn(game.CURSORS, value) ? value : "gold";

  game.applyCursor = () => {
    const choice = game.cursorChoice(game.state.settings.cursor);
    game.state.settings.cursor = choice;
    document.body.dataset.cursor = choice;
    document.body.style.setProperty("--game-cursor", game.CURSORS[choice].css);
  };
})(window.ForMotherRuntime);
