/* For Mother - systems/inventory. Shared state stays inside the runtime closure. */
((game) => {
  "use strict";

game.synchronizeCollections = function synchronizeCollections(progress = game.state) {
    // Saves made before the collection and book existed already know which
    // chapter the player reached. Backfill those earned rewards once, without
    // exposing any future chapter.
    const completedThrough = Math.max(
      progress.currentChapter - 1,
      progress.chapters.reduce((last, done, index) => (done ? index + 1 : last), 0),
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
    game.floatingFeedback("PENGETAHUAN BARU!", game.player.x, game.player.y - 72, "magic");
    game.AudioManager.playSFX("hidden_dirt_found", { level: 0.5, rate: 1.16, cooldown: 180 });
  };

game.giveMedicine = function giveMedicine(n) {
    if (game.state.medicines[n - 1]) return game.motherProgress(n);
    const witchRewards = [
      "Kau berhasil memilah sumber penyakit. Terimalah Eliksir Cahaya Harapan; semoga ia memberi energi lembut untuk Ibumu.",
      "Kau menghentikan kotoran dari sumbernya. Serum Embun Kehidupan ini diracik dari kekuatan alam untuk membantu penyembuhan.",
      "Ketelitianmu menemukan bahaya yang tersembunyi. Kristal Penyembuh Lumi telah diperkuat oleh cahaya Lumi.",
      "Kau membersihkan dengan urutan yang bijak. Ramuan Bintang Kehidupan akan memberi kekuatan bagi tubuh Ibumu yang lemah.",
      "Semua pelajaran telah kau satukan. Terimalah Eliksir Fajar Abadi, ramuan terakhir yang membawa harapan baru.",
    ];
    const andiRewards = [
      "Obat pertama... Ibu, tunggu aku.",
      "Obat kedua. Aku mulai melihat harapan.",
      "Obat ketiga. Aku tidak akan berhenti sekarang.",
      "Tinggal satu ujian lagi setelah ini.",
      "Akhirnya lengkap. Aku akan segera kembali kepada Ibu.",
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
        game.els.modal.innerHTML = `<div class="medicine-reward"><div class="medicine-aura"></div><div class="lumi-particles">✦ ✧ ✦</div><img class="medicine reward-medicine" src="${game.ASSETS.meds[n - 1]}" alt="${game.MEDICINE_NAMES[n - 1]}"><h1>RAMUAN DIPEROLEH</h1><h2>${game.MEDICINE_NAMES[n - 1]}</h2><p>${game.MEDICINE_DESCRIPTIONS[n - 1]}</p><p>KONDISI IBU <b>${before}% → ${after}%</b></p><button class="btn" id="medNext">LANJUT</button></div>`;
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
    game.cut(
      game.ASSETS.mother[n - 1],
      [
        {
          name: "Narator",
          text: [
            "Ibu masih terlelap, tetapi napasnya terasa lebih tenang.",
            "Perlahan, Ibu membuka matanya.",
            "Jari Ibu bergerak kecil. Harapan itu tumbuh.",
            "Ibu kini mampu duduk. Kehangatan kembali ke rumah.",
            "Warna kembali ke wajah Ibu. Ia telah pulih.",
          ][n - 1],
        },
      ],
      () =>
        n < 5
          ? game.transition(n === 4 ? "FinalWarning" : "WitchHouse")
          : game.transition("EndingMontage"),
    );
  };

game.showMedicineCollection = function showMedicineCollection(returnToPause = false) {
    game.synchronizeCollections();
    game.save();
    game.pauseActive = returnToPause || /^Chapter/.test(game.state.scene);
    const found = game.state.medicines.filter(Boolean).length;
    game.els.modal.innerHTML = `<div class="collection-overlay"><section class="collection-card medicine-collection panel" role="dialog" aria-modal="true" aria-labelledby="medicineCollectionTitle"><header><span class="collection-emblem" aria-hidden="true">&#10023;</span><small>LIMA OBAT, SATU HARAPAN</small><h1 id="medicineCollectionTitle">Koleksi Obat</h1><div class="collection-subtitle">Setiap obat menyimpan satu langkah untuk kesembuhan Ibu.</div><p>Obat terkumpul <b>${found} / 5</b></p></header><div class="collection-progress" role="progressbar" aria-label="Obat terkumpul" aria-valuemin="0" aria-valuemax="5" aria-valuenow="${found}"><i style="width:${found * 20}%"></i></div><div class="medicine-collection-grid">${game.ASSETS.meds.map((src, index) => { const unlocked = game.state.medicines[index]; return `<article class="medicine-entry ${unlocked ? "found" : "locked"}"><span class="medicine-chapter">CHAPTER 0${index + 1}</span><div class="medicine-art">${unlocked ? `<img src="${src}" alt="${game.MEDICINE_NAMES[index]}"><i>✦</i><i>✧</i>` : `<span>?</span>`}</div><strong>${unlocked ? game.MEDICINE_NAMES[index] : "BELUM DITEMUKAN"}</strong><small>${unlocked ? game.MEDICINE_DESCRIPTIONS[index] : `Selesaikan Chapter ${index + 1} untuk membuka obat ini`}</small><span class="medicine-state">${unlocked ? "TERKUMPUL" : "TERKUNCI"}</span></article>`; }).join("")}</div><button class="btn" id="closeCollection">← ${returnToPause ? "KEMBALI KE PERMAINAN" : "KEMBALI KE MENU"}</button></section></div>`;
    game.$("#closeCollection").onclick = () => returnToPause ? game.pause() : game.loadScene("MainMenu");
  };

game.showLumiBook = function showLumiBook(returnToPause = false) {
    game.synchronizeCollections();
    game.save();
    game.pauseActive = returnToPause || /^Chapter/.test(game.state.scene);
    const found = game.state.knowledge.filter(Boolean).length;
    const initialPage = Math.max(0, game.state.knowledge.lastIndexOf(true));
    const conclusionPage = game.LUMI_BOOK_DETAILS.length;
    const totalPages = conclusionPage + 1;
    game.els.modal.innerHTML = `<div class="collection-overlay"><section class="collection-card lumi-book panel" role="dialog" aria-modal="true" aria-labelledby="lumiBookTitle"><header class="lumi-book-cover"><span>✦</span><div><small>CATATAN CAHAYA LUMI</small><h1 id="lumiBookTitle">Buku Catatan Lumi</h1><p>Pengetahuan terkumpul <b>${found} / 5</b></p></div><span>✦</span></header><nav class="book-tabs" aria-label="Pilih halaman catatan">${Array.from({length:totalPages},(_,i)=>`<button type="button" data-book-page="${i}" aria-label="${i===conclusionPage ? "Kesimpulan" : "Chapter " + (i+1)}">${i===conclusionPage ? "Penutup" : "0"+(i+1)}</button>`).join("")}</nav><div class="lumi-book-spread"></div><footer class="lumi-book-controls"><button class="book-turn" id="previousLumiPage" type="button">← SEBELUMNYA</button><span class="book-page-number"></span><button class="book-turn" id="nextLumiPage" type="button">BERIKUTNYA →</button></footer><button class="btn" id="closeLumiBook">← ${returnToPause ? "KEMBALI KE PERMAINAN" : "KEMBALI KE MENU"}</button></section></div>`;
    let pageIndex = initialPage;
    const spread = game.els.modal.querySelector(".lumi-book-spread");
    const pageNumber = game.els.modal.querySelector(".book-page-number");
    const previous = game.$("#previousLumiPage");
    const next = game.$("#nextLumiPage");
    const renderPage = () => {
      const isConclusion = pageIndex === conclusionPage;
      const unlocked = isConclusion ? game.state.knowledge.every(Boolean) : game.state.knowledge[pageIndex];
      const detail = game.LUMI_BOOK_DETAILS[pageIndex];
      if (isConclusion) {
        spread.innerHTML = unlocked
          ? `<article class="book-page book-page-left conclusion-page"><span class="book-chapter">HALAMAN PENUTUP</span><h2>Kesimpulan Lumi</h2><p>Perjalanan ini mengajarkan bahwa perubahan besar tidak selalu dimulai dari sesuatu yang besar.</p><p>Setiap langkah kecil yang dilakukan Andi menunjukkan bahwa kepedulian, keberanian, dan kasih sayang mampu membawa perubahan.</p><p>Rumah yang kembali bersih bukan hanya karena debu dan kotoran yang hilang, tetapi karena ada seseorang yang mau berusaha dan tidak menyerah.</p></article><article class="book-page book-page-right conclusion-page"><span class="book-label">CAHAYA YANG TERSISA</span><p>Setiap obat yang berhasil ditemukan bukan hanya menyembuhkan tubuh Ibu, tetapi juga membawa kembali harapan dalam keluarga.</p><p>Lumi percaya bahwa kebaikan sekecil apa pun akan selalu memiliki arti. Karena terkadang, hal sederhana yang dilakukan dengan hati yang tulus dapat menjadi cahaya terbesar bagi orang lain.</p><p class="book-conclusion">Sayangilah dirimu dan orang-orang di sekitarmu. Mulailah dari menjaga rumah dan lingkungan di sekelilingmu, agar penyakit menjauh dan setiap orang yang pulang dapat merasa aman, sehat, dan nyaman.</p><i>— Dengan cahaya dan kasih, Lumi ✦</i></article>`
          : `<article class="book-page book-page-left book-locked"><span class="book-chapter">HALAMAN PENUTUP</span><h2>Kesimpulan Lumi</h2><p>Halaman ini akan terbuka saat seluruh pelajaran bersama Lumi telah diselesaikan.</p></article><article class="book-page book-page-right book-locked"><div class="book-lock">🔒</div><p>Selesaikan semua Chapter untuk membaca catatan penutup Lumi.</p></article>`;
      } else {
        spread.innerHTML = unlocked
          ? `<article class="book-page book-page-left"><span class="book-chapter">CHAPTER ${pageIndex + 1}</span><h2>${game.KNOWLEDGE_TITLES[pageIndex]}</h2><p>${detail.intro}</p><p>${detail.detail}</p><i>— Catatan Lumi ✦</i></article><article class="book-page book-page-right"><span class="book-label">INGAT BAIK-BAIK</span><h3>Kebiasaan yang bisa kamu lakukan</h3><ul>${detail.points.map((point) => `<li>${point}</li>`).join("")}</ul><div class="book-lumi-mark">✦</div><small>Ringkasan singkatnya sudah kamu pelajari bersama Lumi. Halaman ini menyimpan penjelasan lebih lengkapnya.</small></article>`
          : `<article class="book-page book-page-left book-locked"><span class="book-chapter">CHAPTER ${pageIndex + 1}</span><h2>Halaman Tersegel</h2><p>Pengetahuan ini akan terbuka setelah kamu menyelesaikan sesi Belajar Bersama Lumi di chapter ini.</p></article><article class="book-page book-page-right book-locked"><div class="book-lock">🔒</div><p>Lumi akan menuliskan catatan lengkapnya di sini setelah pelajaran ditemukan.</p></article>`;
      }
      game.els.modal.querySelectorAll("[data-book-page]").forEach(button => button.setAttribute("aria-current", Number(button.dataset.bookPage) === pageIndex ? "page" : "false"));
      pageNumber.textContent = `Halaman ${pageIndex + 1} dari ${totalPages}`;
      previous.disabled = pageIndex === 0;
      next.disabled = pageIndex === totalPages - 1;
    };
    const turnPage = (direction) => {
      const nextPage = pageIndex + direction;
      if (nextPage < 0 || nextPage >= totalPages) return;
      pageIndex = nextPage;
      spread.classList.remove("page-flip-next", "page-flip-previous");
      void spread.offsetWidth;
      spread.classList.add(direction > 0 ? "page-flip-next" : "page-flip-previous");
      game.AudioManager.playSFX("page_flip", { level: 0.92, vary: 0.02, cooldown: 80 });
      renderPage();
    };
    spread.addEventListener("animationend", () =>
      spread.classList.remove("page-flip-next", "page-flip-previous"),
    );
    game.els.modal.querySelectorAll("[data-book-page]").forEach(button => { button.onclick = () => turnPage(Number(button.dataset.bookPage) - pageIndex); });
    previous.onclick = () => turnPage(-1);
    next.onclick = () => turnPage(1);
    renderPage();
    game.$("#closeLumiBook").onclick = () => returnToPause ? game.pause() : game.loadScene("MainMenu");
  };
})(window.ForMotherRuntime);
