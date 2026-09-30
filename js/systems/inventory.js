/* For Mother - systems/inventory. Shared state stays inside the runtime closure. */
((game) => {
  "use strict";

  game.synchronizeCollections = function synchronizeCollections(
    progress = game.state,
  ) {
    // Saves made before the collection and book existed already know which
    // chapter the player reached. Backfill those earned rewards once, without
    // exposing any future chapter.
    const completedThrough = Math.max(
      progress.currentChapter - 1,
      progress.chapters.reduce(
        (last, done, index) => (done ? index + 1 : last),
        0,
      ),
    );
    for (let index = 0; index < Math.min(5, completedThrough); index++) {
      progress.medicines[index] = true;
      progress.knowledge[index] = true;
    }
    return progress;
  };

  game.unlockKnowledge = function unlockKnowledge(chapter) {
    if (!Number.isInteger(chapter) || game.state.knowledge[chapter - 1]) return;
    game.state.knowledge[chapter - 1] = true;
    game.save();
    game.toast("Ditambahkan ke Buku Lumi");
    game.floatingFeedback(
      "PENGETAHUAN BARU!",
      game.player.x,
      game.player.y - 72,
      "magic",
    );
    game.AudioManager.playSFX("hidden_dirt_found", {
      level: 0.5,
      rate: 1.16,
      cooldown: 180,
    });
  };

  game.giveMedicine = function giveMedicine(n) {
    if (game.state.medicines[n - 1]) return game.motherProgress(n);
    const witchRewards = [
      "Kau berhasil. Ramuan pertama ini akan menenangkan napas Ibumu.",
      "Kau menghentikan sumber kotoran. Ramuan kedua akan membantu Ibumu membuka mata.",
      "Ketelitianmu membuahkan hasil. Ramuan ketiga akan mengembalikan respons tubuh Ibumu.",
      "Kau bekerja dengan bijak. Ramuan keempat akan menguatkan tubuh Ibumu.",
      "Lima ujian telah selesai. Bawalah ramuan terakhir ini pulang kepada Ibumu.",
    ];
    const andiRewards = [
      "Obat pertama... Ibu, tunggu aku.",
      "Ibu mulai membaik. Aku harus terus maju.",
      "Aku bisa merasakan harapan itu semakin dekat.",
      "Ibu sudah jauh lebih kuat. Tinggal satu ramuan lagi.",
      "Akhirnya lengkap. Aku pulang, Bu.",
    ];
    game.cut(
      game.ASSETS.witchCuts.reward,
      [
        {
          name: "Penyihir",
          who: "witch",
          text: witchRewards[n - 1],
        },
        {
          name: "Andi",
          who: "andi",
          p: "relieved",
          text: andiRewards[n - 1],
        },
      ],
      () => {
        const before = game.MOTHER_PROGRESS[n - 1];
        const after = game.MOTHER_PROGRESS[n];
        game.els.modal.innerHTML = `<div class="medicine-reward"><div class="medicine-aura"></div><div class="lumi-particles">✦ ✧ ✦</div><span class="medicine-hope-label">SATU LANGKAH LEBIH DEKAT KEPADA IBU</span><img class="medicine reward-medicine" src="${game.ASSETS.meds[n - 1]}" alt="${game.MEDICINE_NAMES[n - 1]}"><h1>RAMUAN DIPEROLEH</h1><h2>${game.MEDICINE_NAMES[n - 1]}</h2><p>${game.MEDICINE_DESCRIPTIONS[n - 1]}</p><div class="medicine-mother-impact"><span>Kondisi Ibu</span><strong>${game.MOTHER_CONDITIONS[n]}</strong><small>${before}% <i>→</i> ${after}%</small></div><button class="btn" id="medNext">LIHAT KONDISI IBU</button></div>`;
        game.sceneTimeout(
          () => {
            game.AudioManager.playSFX("medicine_obtained", {
              level: 0.9,
              cooldown: 500,
            });
            game.state.medicines[n - 1] = true;
            game.state.motherProgress = n;
            game.save("WitchHouse");
            game.els.modal
              .querySelector(".reward-medicine")
              ?.classList.add("medicine-earned");
            game.$("#medNext").disabled = false;
          },
          game.state.settings.motion ? 1100 : 0,
          "medicine-reward",
        );
        game.$("#medNext").disabled = true;
        game.$("#medNext").onclick = () => game.motherProgress(n);
      },
    );
  };

  game.motherProgress = function motherProgress(n) {
    const progressLines = [
      {
        narrator: "Napas Ibu menjadi lebih tenang. Tubuhnya mulai menerima kekuatan ramuan pertama.",
        andi: "Bertahanlah, Bu. Aku akan membawa ramuan berikutnya.",
      },
      {
        narrator: "Perlahan, Ibu membuka mata. Cahaya hangat kembali memenuhi rumah.",
        andi: "Ibu mendengarku. Harapan kita masih ada.",
      },
      {
        narrator: "Ibu mulai merespons dan menggenggam tangan Andi. Wajahnya terlihat lebih tenang.",
        andi: "Sedikit lagi, Bu. Aku tidak akan menyerah.",
      },
      {
        narrator: "Ibu kini mampu duduk sendiri. Tenaganya telah kembali jauh lebih kuat.",
        andi: "Tinggal satu ramuan lagi. Aku pasti membawanya pulang.",
      },
      {
        narrator: "Ramuan terakhir bekerja. Warna kembali ke wajah Ibu dan senyumnya pun pulih.",
        andi: "Ibu sudah sembuh. Semua langkah ini benar-benar sampai kepadamu.",
      },
    ][n - 1];
    game.cut(
      game.ASSETS.mother[n - 1],
      [
        {
          name: "Narator",
          who: "narrator",
          text: progressLines.narrator,
        },
        { name: "Andi", who: "andi", p: n === 5 ? "emotional" : "relieved", text: progressLines.andi },
      ],
      () =>
        n < 5
          ? game.transition(n === 4 ? "FinalWarning" : "WitchHouse")
          : game.transition("EndingMontage"),
    );
    game.els.view.classList.add("mother-recovery-active");
    game.els.view.style.setProperty("--mother-warmth", `${0.16 + n * 0.1}`);
    game.els.view.style.setProperty("--mother-sepia", `${8 + n * 4}%`);
    game.els.view.style.setProperty("--mother-saturation", `${1 + n * 0.08}`);
    game.els.view.style.setProperty("--mother-brightness", `${0.96 + n * 0.015}`);
    game.els.fx.insertAdjacentHTML(
      "beforeend",
      `<div class="mother-warm-glow" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>`,
    );
    game.els.ui.innerHTML = `<aside class="mother-recovery-card" aria-live="polite"><div class="mother-recovery-heading"><span>RAMUAN ${n} DARI 5</span><strong>${game.MOTHER_CONDITIONS[n]}</strong></div><div class="mother-recovery-steps" aria-label="Progres pemulihan Ibu">${Array.from({ length: 5 }, (_, index) => `<i class="${index < n ? "reached" : ""}" aria-label="Tahap ${index + 1}${index < n ? " tercapai" : ""}">${index < n ? "♥" : index + 1}</i>`).join("")}</div><p>Usaha Andi membawa perubahan nyata bagi Ibu.</p></aside>`;
  };

  game.showMedicineCollection = function showMedicineCollection(
    returnToPause = false,
  ) {
    game.synchronizeCollections();
    game.save();
    game.pauseActive = returnToPause || /^Chapter/.test(game.state.scene);
    const found = game.state.medicines.filter(Boolean).length;
    game.els.modal.innerHTML = `<div class="collection-overlay"><section class="collection-card medicine-collection panel" role="dialog" aria-modal="true" aria-labelledby="medicineCollectionTitle"><header><span class="collection-emblem" aria-hidden="true">&#10023;</span><small>LIMA OBAT, SATU HARAPAN</small><h1 id="medicineCollectionTitle">Koleksi Obat</h1><div class="collection-subtitle">Setiap obat menyimpan satu langkah untuk kesembuhan Ibu.</div><div class="collection-mother-status"><img src="${found ? game.ASSETS.mother[found - 1] : game.ASSETS.portraits.mother}" alt="Kondisi Ibu"><span><small>KONDISI IBU SAAT INI</small><strong>${game.MOTHER_CONDITIONS[found]}</strong><em>${game.MOTHER_PROGRESS[found]}% pulih · ${found}/5 obat</em></span></div></header><div class="collection-progress" role="progressbar" aria-label="Obat terkumpul" aria-valuemin="0" aria-valuemax="5" aria-valuenow="${found}"><i style="width:${found * 20}%"></i></div><div class="medicine-collection-grid">${game.ASSETS.meds
      .map((src, index) => {
        const unlocked = game.state.medicines[index];
        return `<article class="medicine-entry ${unlocked ? "found" : "locked"}"><span class="medicine-chapter">CHAPTER 0${index + 1}</span><div class="medicine-art">${unlocked ? `<img src="${src}" alt="${game.MEDICINE_NAMES[index]}"><i>✦</i><i>✧</i>` : `<span>?</span>`}</div><strong>${unlocked ? game.MEDICINE_NAMES[index] : "BELUM DITEMUKAN"}</strong><small>${unlocked ? game.MEDICINE_DESCRIPTIONS[index] : `Selesaikan Chapter ${index + 1} untuk membuka obat ini`}</small><span class="medicine-state">${unlocked ? "TERKUMPUL" : "TERKUNCI"}</span></article>`;
      })
      .join(
        "",
      )}</div><button class="btn" id="closeCollection">← ${returnToPause ? "KEMBALI KE PERMAINAN" : "KEMBALI KE MENU"}</button></section></div>`;
    game.$("#closeCollection").onclick = () =>
      returnToPause ? game.pause() : game.loadScene("MainMenu");
  };

  game.showLumiBook = function showLumiBook(returnToPause = false) {
    game.synchronizeCollections();
    game.save();
    game.pauseActive = returnToPause || /^Chapter/.test(game.state.scene);
    const found = game.state.knowledge.filter(Boolean).length;
    const initialPage = Math.max(0, game.state.knowledge.lastIndexOf(true));
    const conclusionPage = game.LUMI_BOOK_DETAILS.length;
    const totalPages = conclusionPage + 1;
    game.els.modal.innerHTML = `<div class="collection-overlay"><section class="collection-card lumi-book panel" role="dialog" aria-modal="true" aria-labelledby="lumiBookTitle"><header class="lumi-book-cover"><span>✦</span><div><small>CATATAN CAHAYA LUMI</small><h1 id="lumiBookTitle">Buku Catatan Lumi</h1><p>Pengetahuan terkumpul <b>${found} / 5</b></p></div><span>✦</span></header><nav class="book-tabs" aria-label="Pilih halaman catatan">${Array.from({ length: totalPages }, (_, i) => `<button type="button" data-book-page="${i}" aria-label="${i === conclusionPage ? "Kesimpulan" : "Chapter " + (i + 1)}">${i === conclusionPage ? "Penutup" : "0" + (i + 1)}</button>`).join("")}</nav><div class="lumi-book-spread"></div><footer class="lumi-book-controls"><button class="book-turn" id="previousLumiPage" type="button">← SEBELUMNYA</button><span class="book-page-number"></span><button class="book-turn" id="nextLumiPage" type="button">BERIKUTNYA →</button></footer><button class="btn" id="closeLumiBook">← ${returnToPause ? "KEMBALI KE PERMAINAN" : "KEMBALI KE MENU"}</button></section></div>`;
    let pageIndex = initialPage;
    const spread = game.els.modal.querySelector(".lumi-book-spread");
    const pageNumber = game.els.modal.querySelector(".book-page-number");
    const previous = game.$("#previousLumiPage");
    const next = game.$("#nextLumiPage");
    const renderPage = () => {
      const isConclusion = pageIndex === conclusionPage;
      const unlocked = isConclusion
        ? game.state.knowledge.every(Boolean)
        : game.state.knowledge[pageIndex];
      const detail = game.LUMI_BOOK_DETAILS[pageIndex];
      if (isConclusion) {
        spread.innerHTML = unlocked
          ? `<article class="book-page book-page-left conclusion-page"><span class="book-chapter">HALAMAN PENUTUP</span><h2>Kesimpulan Lumi</h2><p>Perjalanan ini mengajarkan bahwa perubahan besar tidak selalu dimulai dari sesuatu yang besar.</p><p>Setiap langkah kecil yang dilakukan Andi menunjukkan bahwa kepedulian, keberanian, dan kasih sayang mampu membawa perubahan.</p><p>Rumah yang kembali bersih bukan hanya karena debu dan kotoran yang hilang, tetapi karena ada seseorang yang mau berusaha dan tidak menyerah.</p></article><article class="book-page book-page-right conclusion-page"><span class="book-label">CAHAYA YANG TERSISA</span><p>Setiap obat yang berhasil ditemukan bukan hanya menyembuhkan tubuh Ibu, tetapi juga membawa kembali harapan dalam keluarga.</p><p>Lumi percaya bahwa kebaikan sekecil apa pun akan selalu memiliki arti. Karena terkadang, hal sederhana yang dilakukan dengan hati yang tulus dapat menjadi cahaya terbesar bagi orang lain.</p><p class="book-conclusion">Rumah yang bersih mencerminkan kepedulian. Kasih sayang dan kerja keras mampu mengubah harapan menjadi kenyataan.</p><i>— Dengan cahaya dan kasih, Lumi ✦</i></article>`
          : `<article class="book-page book-page-left book-locked"><span class="book-chapter">HALAMAN PENUTUP</span><h2>Kesimpulan Lumi</h2><p>Halaman ini akan terbuka saat seluruh pelajaran bersama Lumi telah diselesaikan.</p></article><article class="book-page book-page-right book-locked"><div class="book-lock">🔒</div><p>Selesaikan semua Chapter untuk membaca catatan penutup Lumi.</p></article>`;
      } else {
        spread.innerHTML = unlocked
          ? `<article class="book-page book-page-left"><span class="book-chapter">CHAPTER ${pageIndex + 1}</span><h2>${game.KNOWLEDGE_TITLES[pageIndex]}</h2><p>${detail.intro}</p><p>${detail.detail}</p><i>— Catatan Lumi ✦</i></article><article class="book-page book-page-right"><span class="book-label">INGAT BAIK-BAIK</span><h3>Kebiasaan yang bisa kamu lakukan</h3><ul>${detail.points.map((point) => `<li>${point}</li>`).join("")}</ul><div class="book-lumi-mark">✦</div><small>Ringkasan singkatnya sudah kamu pelajari bersama Lumi. Halaman ini menyimpan penjelasan lebih lengkapnya.</small></article>`
          : `<article class="book-page book-page-left book-locked"><span class="book-chapter">CHAPTER ${pageIndex + 1}</span><h2>Halaman Tersegel</h2><p>Pengetahuan ini akan terbuka setelah kamu menyelesaikan sesi Belajar Bersama Lumi di chapter ini.</p></article><article class="book-page book-page-right book-locked"><div class="book-lock">🔒</div><p>Lumi akan menuliskan catatan lengkapnya di sini setelah pelajaran ditemukan.</p></article>`;
      }
      game.els.modal
        .querySelectorAll("[data-book-page]")
        .forEach((button) =>
          button.setAttribute(
            "aria-current",
            Number(button.dataset.bookPage) === pageIndex ? "page" : "false",
          ),
        );
      pageNumber.textContent = `Halaman ${pageIndex + 1} dari ${totalPages}`;
      previous.disabled = pageIndex === 0;
      next.disabled = pageIndex === totalPages - 1;
    };
    let turning = null;
    let gesture = null;
    const reducedMotion = () =>
      !game.state.settings.motion ||
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    spread.tabIndex = 0;
    spread.setAttribute(
      "aria-label",
      "Buku Lumi. Geser halaman atau gunakan tombol panah kiri dan kanan.",
    );
    pageNumber.setAttribute("aria-live", "polite");
    const hint = document.createElement("p");
    hint.className = "book-gesture-hint";
    hint.textContent =
      "Geser halaman untuk membuka catatan \u00b7 Bisa juga memakai tombol panah";
    spread.after(hint);

    const finishTurn = (commit = true) => {
      if (!turning) return;
      const current = turning;
      turning = null;
      current.animations?.forEach((animation) => animation.cancel());
      pageIndex = commit ? current.target : current.source;
      spread.classList.remove("book-is-turning");
      spread.style.removeProperty("height");
      spread.removeAttribute("aria-busy");
      renderPage();
    };
    const startTurn = (target) => {
      if (turning || target === pageIndex || target < 0 || target >= totalPages)
        return false;
      const source = pageIndex;
      const forward = target > source;
      const oldPages = [...spread.children].map((page) => page.cloneNode(true));
      const oldHeight = spread.getBoundingClientRect().height;
      const compact = matchMedia("(max-width:700px)").matches;
      pageIndex = target;
      renderPage();
      const newPages = [...spread.children].map((page) => page.cloneNode(true));
      const newHeight = spread.getBoundingClientRect().height;
      spread.style.height = `${Math.max(oldHeight, newHeight)}px`;
      const leaf = document.createElement("div");
      leaf.className = `book-turning-leaf ${forward ? "turn-forward" : "turn-backward"}${compact ? " turn-compact" : ""}`;
      leaf.setAttribute("aria-hidden", "true");
      const front = document.createElement("div");
      const back = document.createElement("div");
      front.className = "book-leaf-face book-leaf-front";
      back.className = "book-leaf-face book-leaf-back";
      if (compact) {
        front.append(...oldPages);
        back.append(...newPages);
      } else {
        const moving = forward ? 1 : 0;
        const stationary = forward ? 0 : 1;
        front.append(oldPages[moving]);
        back.append(newPages[stationary]);
        spread.children[stationary].replaceWith(oldPages[stationary]);
      }
      // Thin connected strips bend the printed sheet instead of rotating a rigid panel.
      const width = spread.clientWidth * (compact ? 1 : 0.5);
      const count = 18;
      const stripWidth = width / count;
      const strips = [];
      for (let i = 0; i < count; i++) {
        const strip = document.createElement("div");
        strip.className = "book-paper-strip";
        strip.style.width = `${stripWidth + 0.35}px`;
        strip.style.transformOrigin = forward ? "left center" : "right center";
        [front, back].forEach((face, side) => {
          const printedFace = face.cloneNode(true);
          const content = document.createElement("div");
          content.className = "book-slice-content";
          content.style.width = `${width}px`;
          const index = forward ? i : count - 1 - i;
          content.style.left = `${-(side ? count - 1 - index : index) * stripWidth}px`;
          content.append(...printedFace.childNodes);
          printedFace.append(content);
          strip.append(printedFace);
        });
        strips.push(strip);
        leaf.append(strip);
      }
      spread.append(leaf);
      spread.classList.add("book-is-turning");
      spread.setAttribute("aria-busy", "true");
      turning = {
        source,
        target,
        forward,
        leaf,
        compact,
        strips,
        width,
        stripWidth,
        progress: 0,
      };
      setTurnProgress(0);
      return true;
    };
    const paperTransforms = (current, progress) => {
      const sign = current.forward ? 1 : -1;
      let x = current.forward ? 0 : current.width;
      let z = 0;
      return current.strips.map((strip, index) => {
        const u = (index + 0.5) / current.strips.length;
        const angle =
          -sign *
          (Math.PI * progress +
            Math.sin(Math.PI * progress) * (u - 0.5) * 1.15);
        const transform = `translate3d(${x - (current.forward ? 0 : current.stripWidth)}px,0,${z}px) rotateY(${angle}rad)`;
        x += sign * current.stripWidth * Math.cos(angle);
        z -= sign * current.stripWidth * Math.sin(angle);
        return {
          transform,
          "--paper-shade": String(
            Math.sin(Math.PI * progress) * (0.04 + 0.14 * (1 - u)),
          ),
        };
      });
    };
    const setTurnProgress = (progress) => {
      if (!turning) return;
      turning.progress = Math.max(0, Math.min(1, progress));
      paperTransforms(turning, turning.progress).forEach((pose, index) => {
        Object.entries(pose).forEach(([property, value]) =>
          turning.strips[index].style.setProperty(property, value),
        );
      });
    };
    const settleTurn = (commit) => {
      if (!turning) return;
      const current = turning;
      const end = commit ? 1 : 0;
      if (commit)
        game.AudioManager.playSFX("page_flip", {
          level: 0.92,
          vary: 0.02,
          cooldown: 80,
        });
      if (reducedMotion()) {
        finishTurn(commit);
        return;
      }
      const frames = Array.from({ length: 33 }, (_, i) =>
        paperTransforms(
          current,
          current.progress + ((end - current.progress) * i) / 32,
        ),
      );
      current.animations = current.strips.map((strip, index) =>
        strip.animate(
          frames.map((frame) => frame[index]),
          {
            duration: Math.max(180, 900 * Math.abs(end - current.progress)),
            easing: "cubic-bezier(.25,.1,.25,1)",
            fill: "forwards",
          },
        ),
      );
      current.animations[0].onfinish = () => {
        if (turning === current) finishTurn(commit);
      };
    };
    const turnPage = (direction) => {
      if (!direction) return;
      // A new navigation choice completes the current leaf before starting another.
      finishTurn();
      if (startTurn(pageIndex + direction)) settleTurn(true);
    };
    spread.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || turning || event.target.closest("button, a"))
        return;
      gesture = { id: event.pointerId, x: event.clientX, y: event.clientY };
    });
    spread.addEventListener("pointermove", (event) => {
      if (!gesture || gesture.id !== event.pointerId) return;
      const dx = event.clientX - gesture.x;
      const dy = event.clientY - gesture.y;
      if (!turning) {
        if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) {
          gesture = null;
          return;
        }
        if (Math.abs(dx) < 12) return;
        if (!startTurn(pageIndex + (dx < 0 ? 1 : -1))) {
          gesture = null;
          return;
        }
        spread.setPointerCapture(event.pointerId);
      }
      const distance = turning.forward ? -dx : dx;
      setTurnProgress(
        distance / (spread.clientWidth * (turning.compact ? 0.85 : 0.5)),
      );
    });
    const releaseGesture = (event, cancelled = false) => {
      if (!gesture || gesture.id !== event.pointerId) return;
      gesture = null;
      if (turning) settleTurn(!cancelled && turning.progress > 0.2);
      if (spread.hasPointerCapture(event.pointerId))
        spread.releasePointerCapture(event.pointerId);
    };
    spread.addEventListener("pointerup", (event) => releaseGesture(event));
    spread.addEventListener("pointercancel", (event) =>
      releaseGesture(event, true),
    );
    spread.addEventListener("lostpointercapture", (event) =>
      releaseGesture(event, true),
    );
    spread.addEventListener("pointerleave", () => {
      if (!turning) gesture = null;
    });
    spread.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      event.stopPropagation();
      turnPage(event.key === "ArrowRight" ? 1 : -1);
    });
    game.els.modal.querySelectorAll("[data-book-page]").forEach((button) => {
      button.onclick = () =>
        turnPage(Number(button.dataset.bookPage) - pageIndex);
    });
    previous.onclick = () => turnPage(-1);
    next.onclick = () => turnPage(1);
    renderPage();
    game.$("#closeLumiBook").onclick = () => {
      finishTurn();
      returnToPause ? game.pause() : game.loadScene("MainMenu");
    };
  };
})(window.ForMotherRuntime);
