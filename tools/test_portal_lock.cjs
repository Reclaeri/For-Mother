const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");
let update,
  countdown,
  calls = 0;
const game = {
  runtime: { portals: [] },
  player: { x: 0, y: 0, moving: true, el: {} },
  keys: new Set(["d"]),
  AudioManager: { stopSFX() {} },
  collisionBox: (p) => ({ ...p, w: 12, h: 8 }),
  addUpdater: (fn) => {
    update = fn;
  },
  renderEntity() {},
  els: {
    ui: {
      querySelector: () => countdown,
      append: (node) => {
        countdown = node;
      },
    },
  },
};
const context = vm.createContext({
  window: { ForMotherRuntime: game },
  document: {
    createElement: () => ({
      remove() {
        countdown = null;
      },
    }),
  },
});
for (const file of ["js/player/movement.js", "js/systems/interaction.js"])
  vm.runInContext(fs.readFileSync(file, "utf8"), context);
game.renderEntity = () => {};
let enabled = false;
const portal = game.autoPortal(
  0,
  0,
  () => calls++,
  null,
  () => enabled,
);
update(0.1);
assert(!game.runtime.portalLock, "Disabled portal must not lock");
enabled = true;
update(0.1);
assert.equal(game.runtime.portalLock, portal);
assert.equal(game.player.moving, false);
assert.equal(game.keys.size, 0);
for (const key of [
  "w",
  "a",
  "s",
  "d",
  "arrowup",
  "arrowdown",
  "arrowleft",
  "arrowright",
]) {
  game.keys.add(key);
  game.move(0.1);
  assert.equal(game.player.x, 0);
  assert.equal(game.player.y, 0);
  game.keys.clear();
}
update(2.9);
update(1);
assert.equal(calls, 1);
assert.equal(game.runtime.portalLock, portal);
assert(!countdown);
console.log(
  "PASS: inactive portal stays unlocked; entry freezes movement in all directions; countdown triggers once and keeps lock.",
);
game.runtime = { portals: [] };
assert(!game.runtime.portalLock);
game.autoPortal(
  0,
  0,
  () => {},
  null,
  () => enabled,
);
update(0.1);
enabled = false;
update(0.1);
assert(!game.runtime.portalLock);
console.log(
  "PASS: new scene runtime releases lock; deactivated portal releases countdown lock.",
);
