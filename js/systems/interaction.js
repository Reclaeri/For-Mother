/* For Mother - systems/interaction. Shared state stays inside the runtime closure. */
((game) => {
  "use strict";

  game.interact = function interact(
    id,
    x,
    y,
    label,
    action,
    critical = false,
    el = null,
  ) {
    const point = game.resolveInteractionPoint(x, y);
    const it = {
      id,
      x: point.x,
      y: point.y,
      label,
      action,
      critical,
      enabled: true,
      el,
    };
    game.runtime.interactables.push(it);
    return it;
  };

  game.autoPortal = function autoPortal(
    x,
    y,
    action,
    el = null,
    enabled = () => true,
  ) {
    const portal = {
      x,
      y,
      radius: 120,
      elapsed: 0,
      triggered: false,
      action,
      el,
      enabled,
    };
    game.runtime.portals.push(portal);
    game.addUpdater((dt) => {
      if (game.runtime.portalLock && game.runtime.portalLock !== portal) return;
      if (portal.triggered) return;
      const active =
        enabled() &&
        !game.dialogActive &&
        !game.cutsceneActive &&
        !game.transitionActive &&
        !game.pauseActive &&
        !game.miniGameActive;
      const playerBox = game.collisionBox(game.player);
      const dx =
        Math.abs(playerBox.x - portal.x) / (portal.radius + playerBox.w / 2);
      const dy =
        Math.abs(playerBox.y - portal.y) /
        (portal.radius * 0.78 + playerBox.h / 2);
      const inside = active && dx * dx + dy * dy <= 1;
      let countdown = game.els.ui.querySelector(".portal-countdown");
      if (!inside) {
        if (game.runtime.portalLock === portal) game.runtime.portalLock = null;
        portal.elapsed = 0;
        countdown?.remove();
        return;
      }
      if (!game.runtime.portalLock) {
        game.runtime.portalLock = portal;
        game.keys.clear();
        game.player.interactTimer = 0;
        game.lock();
        game.renderEntity(game.player);
      }
      portal.elapsed = Math.min(3, portal.elapsed + dt);
      if (!countdown) {
        countdown = document.createElement("div");
        countdown.className = "portal-countdown";
        game.els.ui.append(countdown);
      }
      countdown.innerHTML = `<span>ANDA TELAH MASUK KE AREA PORTAL</span><strong>${Math.max(1, Math.ceil(3 - portal.elapsed))}</strong><small>Posisi terkunci · Bersiap untuk berpindah</small>`;
      if (portal.elapsed >= 3) {
        portal.triggered = true;
        countdown.remove();
        action();
      }
    });
    return portal;
  };

  game.interactionPoint = function interactionPoint() {
    const box = game.interactionBox();
    return { x: box.x, y: box.y };
  };

  game.interactionBox = function interactionBox() {
    // Keep interaction anchored to the same foot area; object radii remain unchanged.
    return game.collisionBox(game.player);
  };

  game.followInteraction = function followInteraction(it, owner) {
    it.owner = owner;
    it.x = owner.x;
    it.y = owner.y;
    it.radius = owner.id === "nina" ? 76 : 88;
    it.oncePerScene = true;
    return it;
  };

  game.showPrompt = function showPrompt() {
    let repairIcon = game.els.ui.querySelector(".repair-proximity-icon");
    if (
      game.runtime.chapterIntroActive ||
      game.miniGameActive ||
      game.dialogActive ||
      game.cutsceneActive ||
      game.pauseActive ||
      game.transitionActive ||
      game.runtime.completed
    ) {
      game.els.ui.querySelector(".prompt")?.remove();
      repairIcon?.remove();
      game.currentTarget = null;
      return;
    }
    let p = game.els.ui.querySelector(".prompt");
    game.runtime.interactables.forEach((i) => {
      if (i.owner) {
        i.x = i.owner.x;
        i.y = i.owner.y;
      }
    });
    const detector = game.interactionPoint();
    const available = game.runtime.interactables.filter(
      (i) =>
        i.enabled &&
        game.dist(detector, i) <= (i.radius || game.INTERACTION_RADIUS),
    );
    available.sort(
      (a, b) =>
        b.critical - a.critical ||
        game.dist(detector, a) - game.dist(detector, b),
    );
    game.currentTarget = available[0] || null;
    if (game.currentTarget) {
      if (!p) {
        p = document.createElement("div");
        p.className = "prompt";
        game.els.ui.append(p);
      }
      p.textContent = "[E] " + game.currentTarget.label;
      if (game.currentTarget.repair) {
        const icon = repairIcon || document.createElement("img");
        icon.className = "repair-proximity-icon";
        icon.src = game.A + "repair_interaction_icon.png";
        icon.alt = "Tekan E untuk memperbaiki";
        const rect = game.currentTarget.el?.getBoundingClientRect();
        const view = game.els.view.getBoundingClientRect();
        icon.style.left = `${rect ? rect.left - view.left + rect.width / 2 : view.width / 2}px`;
        icon.style.top = `${Math.max(35, rect ? rect.top - view.top : view.height / 2)}px`;
        if (!repairIcon) game.els.ui.append(icon);
      } else repairIcon?.remove();
    } else {
      p?.remove();
      repairIcon?.remove();
    }
  };

  game.interactionHint = function interactionHint(text) {
    game.AudioManager.playSFX("error", {
      level: 0.22,
      rate: 0.68,
      cooldown: 400,
    });
    game.toast(text);
  };
})(window.ForMotherRuntime);
