/* For Mother - systems/dialog. Shared state stays inside the runtime closure. */
((game) => {
  "use strict";

game.startLumiEducation = function startLumiEducation(chapter, onDone) {
    if (game.runtime.lumiEducation || game.runtime.educationShown || game.runtime.chapterIntroActive || game.dialogActive || game.cutsceneActive || game.pauseActive || game.runtime.completed) return false;
    const pages = game.LUMI_LESSONS[chapter];
    if (!pages?.length) return false;
    game.runtime.educationShown = true;
    game.miniGameActive = true;
    game.lock();
    game.els.ui.querySelector(".prompt")?.remove();
    const modal = document.createElement("section");
    modal.className = "lumi-education";
    modal.innerHTML = `<div class="lumi-education-dim"></div><div class="lumi-guide"><img src="${game.ASSETS.lumi.happy}" alt="Lumi"><i>✦</i><i>✧</i><i>✦</i><b>Belajar bersama Lumi</b></div><article class="lumi-bubble"><header><small>BELAJAR BERSAMA LUMI</small><strong>✦ Pengetahuan Baru</strong></header><p></p><footer><span class="lumi-page"></span><button class="btn lumi-next" type="button">LANJUT</button></footer></article>`;
    game.els.modal.replaceChildren(modal);
    const text = modal.querySelector(".lumi-bubble p");
    const page = modal.querySelector(".lumi-page");
    const next = modal.querySelector(".lumi-next");
    let index = 0, typed = 0, complete = !game.state.settings.motion, frame = 0;
    const render = () => {
      cancelAnimationFrame(frame);
      typed = 0;
      complete = !game.state.settings.motion;
      text.textContent = complete ? pages[index] : "";
      page.textContent = `${index + 1}/${pages.length}`;
      next.textContent = index === pages.length - 1 ? "MENGERTI" : "LANJUT";
      modal.querySelector(".lumi-bubble").classList.remove("page-change");
      requestAnimationFrame(() => modal.querySelector(".lumi-bubble")?.classList.add("page-change"));
      const type = () => {
        if (!game.runtime.lumiEducation || complete) return;
        typed = Math.min(pages[index].length, typed + 1);
        text.textContent = pages[index].slice(0, typed);
        if (typed % 3 === 0) game.AudioManager.playSFX("dialog_type", { level: 0.3, vary: 0.05, cooldown: 45 });
        if (typed < pages[index].length) frame = requestAnimationFrame(type);
        else complete = true;
      };
      if (!complete) frame = requestAnimationFrame(type);
    };
    const advance = () => {
      if (!complete) { complete = true; text.textContent = pages[index]; return; }
      game.AudioManager.playSFX("ui_click", { level: 0.45, cooldown: 60 });
      if (++index < pages.length) { render(); return; }
      cancelAnimationFrame(frame);
      modal.classList.add("leaving");
      game.sceneTimeout(() => {
        if (game.runtime.lumiEducation !== guide) return;
        game.els.modal.replaceChildren();
        game.runtime.lumiEducation = null;
        game.miniGameActive = false;
        game.AudioManager.playSFX("hidden_dirt_found", { level: 0.45, rate: 1.2, cooldown: 120 });
        game.unlockKnowledge(chapter);
        onDone?.();
      }, game.state.settings.motion ? 420 : 0, "lumi-education-exit");
    };
    const guide = { advance };
    game.runtime.lumiEducation = guide;
    next.onclick = advance;
    game.AudioManager.playSFX("lumi_vision_activate", { level: 0.45, rate: 1.08, cooldown: 100 });
    render();
    return true;
  };

game.resetLumiHint = function resetLumiHint() {
    if (!game.runtime) return;
    game.runtime.hintElapsed = 0;
    game.runtime.hintLevel = 0;
    game.runtime.hintCooldown = false;
  };

game.nextLumiHint = function nextLumiHint(chapter, level) {
    const hints = {
      1: ["Andi, masih ada sampah yang perlu dipilah.", "Coba periksa bagian tengah dan tepi ruangan dengan lebih teliti."],
      2: ["Hmm... sepertinya masih ada sesuatu yang membuat rumah ini kotor.", "Coba perhatikan sumber masalah di sekitar jendela, pipa, atau tempat sampah."],
      3: ["Aku merasakan jejak kotoran yang samar di ruangan ini.", "Gunakan Lumi Vision untuk melihat jejak yang sulit terlihat oleh mata biasa."],
      4: ["Kita perlu bekerja dengan urutan yang tepat agar ruangan cepat bersih.", "Perhatikan kembali langkah berikutnya sebelum mulai membersihkan."],
      5: ["Kita hampir sampai, Andi. Masih ada bagian ruangan yang memerlukan perhatian.", "Periksa kembali semua sudut, lalu gunakan Lumi Vision jika ada jejak samar."],
    };
    return hints[chapter]?.[Math.min(level, 1)] || null;
  };

game.showLumiHint = function showLumiHint(text) {
    game.els.ui.querySelector(".lumi-hint")?.remove();
    const hint = document.createElement("aside");
    hint.className = "lumi-hint";
    hint.innerHTML = `<img src="${game.ASSETS.lumi.happy}" alt="Lumi"><p><strong>LUMI</strong><span>${text}</span></p><button type="button" aria-label="Tutup petunjuk">×</button>`;
    game.els.ui.append(hint);
    game.runtime.lumiHintEl = hint;
    game.positionCharacterBubble(hint, "lumi");
    game.runtime.hintVisible = true;
    hint.querySelector("button").onclick = () => { hint.remove(); game.runtime.hintVisible = false; game.runtime.lumiHintEl = null; };
    game.sceneTimeout(() => { hint.remove(); game.runtime.hintVisible = false; game.runtime.lumiHintEl = null; }, game.state.settings.motion ? 5200 : 2500, "lumi-hint");
    game.AudioManager.playSFX("lumi_vision_activate", { level: 0.32, rate: 1.12, cooldown: 250 });
  };

game.getBubbleSpeakerElement = function getBubbleSpeakerElement(speaker) {
    if (speaker === "andi") return game.player.el;
    if (speaker === "lumi") return game.runtime.lumi?.el;
    return game.runtime.entities?.find((entity) => entity.id === speaker)?.el || null;
  };

game.positionCharacterBubble = function positionCharacterBubble(element, speaker) {
    const character = game.getBubbleSpeakerElement(speaker);
    if (!element?.isConnected || !character?.isConnected) return false;
    const viewport = game.els.view.getBoundingClientRect();
    const rect = character.getBoundingClientRect();
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    if (!viewport.width || !viewport.height || !width || !height) return false;

    const margin = 12;
    const gap = 14;
    const headX = rect.left - viewport.left + rect.width / 2;
    // Andi's sprite has more transparent space above the hair, so anchor his
    // inner-thought bubble a little lower than the floating Lumi bubble.
    const headRatio = speaker === "andi" ? 0.2 : 0.08;
    const headY = rect.top - viewport.top + rect.height * headRatio;
    const maxX = Math.max(margin + width / 2, viewport.width - margin - width / 2);
    const bubbleX = Math.max(margin + width / 2, Math.min(maxX, headX));
    const fitsAbove = headY - gap - height >= margin;
    const bubbleY = fitsAbove ? headY - gap : rect.bottom - viewport.top + gap;
    const tailX = Math.max(18, Math.min(width - 18, headX - (bubbleX - width / 2)));

    element.classList.toggle("bubble-below", !fitsAbove);
    element.style.left = `${bubbleX}px`;
    element.style.top = `${bubbleY}px`;
    element.style.setProperty("--tail-x", `${tailX}px`);
    return true;
  };

game.updateCharacterBubbles = function updateCharacterBubbles() {
    const line = game.runtime.dialog?.lines?.[game.runtime.dialog.index];
    const thought = line?.thought && game.els.dialog.querySelector(".andi-thought-bubble");
    if (thought) game.positionCharacterBubble(thought, "andi");
    if (game.runtime.lumiHintEl?.isConnected)
      game.positionCharacterBubble(game.runtime.lumiHintEl, "lumi");
  };

game.updateLumiHints = function updateLumiHints(dt) {
    const chapter = game.runtime.chapterTimer?.chapter;
    if (!chapter || !game.timerMayRun() || game.miniGameActive || game.runtime.lumiEducation || game.runtime.hintVisible) return;
    game.runtime.hintElapsed = (game.runtime.hintElapsed || 0) + dt;
    const threshold = game.difficulty().hint * (game.runtime.hintCooldown ? 1 : .75);
    if (game.runtime.hintElapsed < threshold) return;
    const level = Math.min(game.runtime.hintLevel || 0, 1);
    const text = game.nextLumiHint(chapter, level);
    if (!text) return;
    game.runtime.hintLevel = level + 1;
    game.runtime.hintElapsed = 0;
    game.runtime.hintCooldown = true;
    game.showLumiHint(text);
  };

game.startDialog = function startDialog(lines, onEnd) {
    if (game.runtime.chapterIntroActive) {
      // Chapter thoughts are queued before setup dialogue; preserve both rather
      // than allowing the later scene dialogue to replace the thought.
      game.runtime.queuedDialog = game.runtime.queuedDialog
        ? { lines: [...game.runtime.queuedDialog.lines, ...lines], onEnd: onEnd || game.runtime.queuedDialog.onEnd }
        : { lines, onEnd };
      return;
    }
    game.dialogActive = true;
    game.lock();
    game.runtime.dialog = {
      lines,
      index: 0,
      onEnd,
      typed: 0,
      complete: false,
      lockUntil: performance.now() + 140,
    };
    game.drawDialog();
  };

game.drawDialogLegacy = function drawDialogLegacy() {
    const d = game.runtime.dialog,
      l = d.lines[d.index],
      portraitByCharacter = {
        andi: l.p ? game.ASSETS.andi.portrait[l.p] : game.ASSETS.andi.idle.down,
        tabib: game.ASSETS.portraits.tabib,
        witch: game.ASSETS.portraits.witch || game.ASSETS.npc.witch,
        bima: game.ASSETS.portraits.bima,
        nina: game.ASSETS.portraits.nina,
        sari: game.ASSETS.portraits.sari,
        mother: game.ASSETS.portraits.mother,
      },
      portrait = l.who ? portraitByCharacter[l.who] || "" : "";
    game.els.dialog.innerHTML = `<div class="dialogbox ${portrait ? "" : "noportrait"}">${portrait ? `<img class="portrait" src="${portrait}">` : ""}<div class="name">${l.name || "Narator"}</div><div class="text">${l.text}</div><div class="next">E / ENTER ▾</div></div>`;
  };

game.drawDialog = function drawDialog() {
    const d = game.runtime.dialog,
      l = d.lines[d.index],
      speaker = l.who || (l.name === "Lumi" ? "lumi" : "");
    if (d.typeAudio) {
      d.typeAudio.pause();
      d.typeAudio = null;
    }
    const portraits = {
      narrator: game.ASSETS.portraits.narrator,
      lumi: game.ASSETS.lumi.happy,
      andi: l.p ? game.ASSETS.andi.portrait[l.p] : game.ASSETS.andi.portrait.neutral,
      tabib: game.ASSETS.portraits.tabib,
      witch: game.ASSETS.portraits.witch,
      bima: game.ASSETS.portraits.bima,
      nina: game.ASSETS.portraits.nina,
      sari: game.ASSETS.portraits.sari,
      mother: game.ASSETS.portraits.mother,
    };
    const portrait = speaker ? portraits[speaker] || "" : "";
    d.typed = 0;
    d.complete = !game.state.settings.motion;
    d.lockUntil = performance.now() + 120;
    game.els.dialog.innerHTML = l.thought
      ? `<div class="andi-thought-bubble"><img class="bubble-portrait" src="${portraits.andi}" alt="Andi"><div class="name"></div><div class="text"></div><div class="next">E / ENTER / SPACE &#9662;</div></div>`
      : `<div class="dialogbox ${portrait ? "" : "noportrait"} portrait-${speaker || "none"}">${portrait ? `<div class="portrait-wrap portrait-speaking"><img class="portrait" src="${portrait}" alt=""></div>` : ""}<div class="dialog-copy"><div class="name"></div><div class="text"></div></div><div class="next">E / ENTER / SPACE &#9662;</div></div>`;
    game.els.dialog.querySelector(".name").textContent = l.name || (l.thought ? "Andi — dalam hati" : "Narator");
    const textEl = game.els.dialog.querySelector(".text");
    if (d.complete) textEl.textContent = l.text;
    else {
      const token = game.sceneToken,
        line = d.index;
      const type = () => {
        if (
          token !== game.sceneToken ||
          !game.runtime.dialog ||
          game.runtime.dialog.index !== line
        )
          return;
        d.typed = Math.min(l.text.length, d.typed + 1);
        textEl.textContent = l.text.slice(0, d.typed);
        const char = l.text[d.typed - 1];
        if (d.typed % 2 === 0 && char && !/[\s.,!?;:'"()\-]/.test(char))
          d.typeAudio = game.AudioManager.playSFX("dialog_type", {
            level: 0.52,
            vary: 0.04,
            cooldown: 34,
          });
        d.complete = d.typed >= l.text.length;
        if (!d.complete)
          d.typeTimer = game.sceneTimeout(
            type,
            { slow: 42, normal: 22, fast: 10 }[game.state.settings.dialogSpeed] ||
              22,
            "dialogType",
          );
      };
      type();
    }
  };

game.advanceDialog = function advanceDialog() {
    if (!game.dialogActive || game.pauseActive) return;
    const d = game.runtime.dialog;
    if (!d || performance.now() < d.lockUntil) return;
    game.AudioManager.playSFX("ui_click", { level: .55, cooldown: 80 });
    if (!d.complete) {
      clearTimeout(d.typeTimer);
      if (d.typeAudio) {
        d.typeAudio.pause();
        d.typeAudio = null;
      }
      d.complete = true;
      game.els.dialog.querySelector(".text").textContent = d.lines[d.index].text;
      d.lockUntil = performance.now() + 100;
      return;
    }
    if (++d.index < d.lines.length) game.drawDialog();
    else {
      if (d.typeAudio) {
        d.typeAudio.pause();
        d.typeAudio = null;
      }
      game.AudioManager.playSFX("dialog_next", { level: 0.55, cooldown: 80 });
      game.dialogActive = false;
      game.els.dialog.innerHTML = "";
      const cb = d.onEnd;
      game.runtime.dialog = null;
      cb?.();
    }
  };
})(window.ForMotherRuntime);
