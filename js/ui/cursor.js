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
  });

  game.cursorChoice = (value) => Object.hasOwn(game.CURSORS, value) ? value : "gold";

  game.applyCursor = () => {
    const choice = game.cursorChoice(game.state.settings.cursor);
    game.state.settings.cursor = choice;
    document.body.dataset.cursor = choice;
    document.body.style.setProperty("--game-cursor", game.CURSORS[choice].css);
  };
})(window.ForMotherRuntime);
