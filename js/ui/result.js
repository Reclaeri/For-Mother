/* For Mother - ui/result. Shared state stays inside the runtime closure. */
((game) => {
  "use strict";

game.calculateChapterRating = function calculateChapterRating(n, strategyStars = 0) {
    const limit = game.chapterTimeLimit(n);
    const timeLeft = Math.max(0, game.runtime.chapterTimer?.remaining ?? 0);
    const mistakes = Math.max(0, game.runtime.mistakes || 0);
    let stars =
      timeLeft >= 20 && mistakes <= 1
        ? 3
        : timeLeft >= 15 || mistakes <= 2
          ? 2
          : 1;
    return {
      stars,
      timeLeft: Math.ceil(timeLeft),
      timeUsed: Math.max(0, Math.round(limit - timeLeft)),
      mistakes,
      completionPercent: 100,
      completed: true,
    };
  };

game.completeCard = function completeCard(n, result, next) {
    game.runtime.completed = true;
    game.lock();
    game.AudioManager.playSFX("chapter_complete", { level: 0.9, cooldown: 1000 });
    const names = [
      "Pilah Sampah",
      "Hentikan Sumbernya",
      "Lumi Vision",
      "Strategi Membersihkan",
      "Ujian Terakhir",
    ];
    const health = game.MOTHER_PROGRESS[n];
    game.els.modal.innerHTML = `<div class="completion"><div class="card panel result-card"><small>CHAPTER SELESAI</small><h1>${names[n - 1]}</h1><div class="stars">${[1, 2, 3].map((star) => `<img style="--star-delay:${star * 0.16}s" src="${star <= result.stars ? game.ASSETS.ui.star1 : game.ASSETS.ui.star0}" alt="${star <= result.stars ? "Bintang" : "Kosong"}">`).join("")}</div><div class="result-grid"><span>Sisa waktu <b>${game.formatTime(result.timeLeft)}</b></span><span>Bonus waktu <b>+${game.runtime.chapterTimer?.bonus || 0} dtk</b></span><span>Kesalahan <b>${result.mistakes}</b></span><span>Kebersihan <b>${game.runtime.clean || 100}%</b></span><span>Kondisi Ibu <b>${health}%</b></span><span>Obat terkumpul <b>${Math.max(n, game.state.medicines.filter(Boolean).length)}/5</b></span></div><section class="chapter-lessons"><strong>YANG ANDI PELAJARI</strong><ul>${game.CHAPTER_LESSONS[n - 1].map((lesson) => `<li>${lesson}</li>`).join("")}</ul></section><button class="btn" id="continueResult">LANJUTKAN</button></div></div>`;
    game.$("#continueResult").onclick = next;
  };

game.showEducationCard = function showEducationCard(n, next) {
    const lessons = [
      [
        "Sampah dan Kesehatan",
        "Sampah yang dibiarkan menumpuk dapat menjadi sarang kuman dan menyebabkan penyakit. Buanglah sampah pada tempatnya dan pisahkan sesuai jenisnya.",
      ],
      [
        "Debu dan Pernapasan",
        "Debu dapat mengganggu pernapasan dan membuat ruangan tidak sehat. Bersihkan permukaan dan hentikan sumber debu secara rutin.",
      ],
      [
        "Kotoran yang Tak Terlihat",
        "Ruangan yang tampak bersih belum tentu bebas kotoran. Periksa sudut dan tempat tersembunyi dengan teliti.",
      ],
      [
        "Kerapian dan Keselamatan",
        "Barang yang tersusun rapi membuat rumah lebih nyaman serta mengurangi risiko tersandung dan terluka.",
      ],
      [
        "Rumah Bersih, Keluarga Sehat",
        "Kebiasaan menjaga kebersihan melindungi keluarga dari sampah, debu, genangan air, dan sumber penyakit.",
      ],
    ];
    const [title, text] = lessons[n - 1];
    game.els.modal.innerHTML = `<div class="education"><div class="education-card"><span class="education-label">PELAJARAN CHAPTER ${n}</span><img src="${game.ASSETS.edu[n - 1]}" alt=""><h1>${title}</h1><p>${text}</p><button class="btn" id="continueEducation">LANJUT</button></div></div>`;
    game.$("#continueEducation").onclick = next;
  };
})(window.ForMotherRuntime);
