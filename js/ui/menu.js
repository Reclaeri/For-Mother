/* For Mother - ui/menu. Shared state stays inside the runtime closure. */
((game) => {
  "use strict";

game.showDifficulty = function(destination) {
    let choice = game.safeLoad()?.difficulty || game.state.difficulty || "MEDIUM";
    game.els.modal.innerHTML = `<div class="settings-overlay journey-overlay"><section class="settings-card panel difficulty-card journey-card" role="dialog" aria-modal="true" aria-labelledby="difficulty-title"><header class="journey-heading"><span class="journey-emblem" aria-hidden="true">&#10022;</span><small>SEBUAH PERJALANAN UNTUK IBU</small><h1 id="difficulty-title">Pilih tantanganmu</h1><p>Setiap langkah membawa Andi lebih dekat kepada Ibu.</p></header><div class="difficulty-options">${Object.entries(game.DIFFICULTIES).map(([key,value],index)=>`<button type="button" data-difficulty="${key}" aria-pressed="${choice===key}"><span class="difficulty-tag">${['NIKMATI CERITA','PENGALAMAN UTAMA','UJI KEMAMPUAN'][index]}</span><span class="difficulty-stars" aria-hidden="true">${'&#10022;'.repeat(index+1)}</span><strong>${key}</strong><span class="difficulty-description">${value.description}</span><span class="difficulty-details">${['Waktu lebih longgar<br>Objek lebih sedikit &middot; Lumi lebih sering membantu','Waktu dan tantangan seimbang<br>Petunjuk Lumi secukupnya','Waktu lebih singkat<br>Objek lebih banyak &middot; Petunjuk lebih sedikit'][index]}</span><span class="difficulty-selection"><i></i><span>${choice===key ? "MODE TERPILIH" : "PILIH MODE"}</span></span></button>`).join('')}</div><p class="journey-note">Mode tersimpan untuk Lanjutkan. Perjalanan baru akan mengganti progress sebelumnya.</p><footer class="journey-actions"><button class="btn secondary" id="cancelDifficulty">KEMBALI</button><button class="btn" id="startDifficulty">MULAI PERJALANAN <span aria-hidden="true">&#8594;</span></button></footer></section></div>`;
    game.els.modal.querySelectorAll('[data-difficulty]').forEach(button => button.onclick=()=> {
      choice=button.dataset.difficulty;
      game.els.modal.querySelectorAll('[data-difficulty]').forEach(b=> { b.setAttribute('aria-pressed',b===button); b.querySelector('.difficulty-selection span').textContent=b===button?'MODE TERPILIH':'PILIH MODE'; });
    });
    game.$('#cancelDifficulty').onclick=()=>game.loadScene('MainMenu');
    game.$('#startDifficulty').onclick=()=>game.startFromMenu(destination,()=>{
      game.resetGame();game.state.difficulty=choice;
      if(destination==='Village')game.state.storyStage=1;
      game.save(destination);
    });
    game.els.modal.querySelector(`[data-difficulty="${choice}"]`).focus();
  };

game.showHowToPlay = function showHowToPlay(returnToPause = false) {
    game.pauseActive = returnToPause || /^Chapter/.test(game.state.scene);
    const backLabel = returnToPause ? "KEMBALI KE PERMAINAN" : "KEMBALI KE MENU";
    game.els.modal.innerHTML = `<div class="settings-overlay how-overlay"><div class="how-card panel" role="dialog" aria-modal="true" aria-labelledby="howTitle"><header class="how-header"><span class="how-kicker">PANDUAN PERJALANAN</span><h1 id="howTitle">CARA MAIN</h1><p>Kuasai kontrol, temukan sumber masalah, dan pulihkan setiap ruangan sebelum waktu habis.</p><div class="how-at-a-glance" aria-label="Ringkasan permainan"><span><b>5</b><small>CHAPTER</small></span><span><b>15</b><small>BINTANG</small></span><span><b>+10</b><small>BONUS MAKS.</small></span></div></header><section class="how-controls" aria-label="Kontrol permainan"><article><div class="how-keys"><kbd>W</kbd><span><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd></span></div><div><strong>BERGERAK</strong><small>Gunakan juga tombol panah</small></div></article><article><div class="how-key-single"><kbd>E</kbd></div><div><strong>INTERAKSI</strong><small>Ambil atau gunakan benda</small></div></article><article><div class="how-key-single how-key-magic"><kbd>Q</kbd></div><div><strong>LUMI VISION</strong><small>Temukan kotoran tersembunyi</small></div></article><article><div class="how-key-single"><kbd>ESC</kbd></div><div><strong>JEDA</strong><small>Buka menu permainan</small></div></article></section><section class="how-mission"><div class="how-section-title"><span>✦</span><div><strong>ALUR MISI</strong><small>Lima langkah menuju rumah yang sehat</small></div><span>✦</span></div><ol><li><i>1</i><span><b>Pilah</b><small>Buang sampah sesuai jenisnya.</small></span></li><li><i>2</i><span><b>Cegah</b><small>Hentikan sumber kotoran.</small></span></li><li><i>3</i><span><b>Temukan</b><small>Gunakan Lumi Vision.</small></span></li><li><i>4</i><span><b>Bersihkan</b><small>Pilih strategi yang tepat.</small></span></li><li><i>5</i><span><b>Pulihkan</b><small>Satukan seluruh pelajaran.</small></span></li></ol></section><aside class="how-tip"><span>★</span><p><strong>RAIH 3 BINTANG</strong><small>Bergerak cepat dan hindari kesalahan. Sisa waktu menentukan hasil akhir.</small></p></aside><button class="btn how-back" id="closeHow">← ${backLabel}</button></div></div>`;
    game.els.modal.querySelector(".how-tip").insertAdjacentHTML(
      "beforebegin",
      `<section class="how-score-guide" aria-label="Bintang dan waktu">
        <div class="how-star-card star-three"><strong>★★★ 3 BINTANG</strong><small>Selesaikan cepat, sisakan minimal 20 detik, dan maksimal hanya melakukan 1 kali kesalahan.</small></div>
        <div class="how-star-card star-two"><strong>★★ 2 BINTANG</strong><small>Sisakan minimal 15 detik atau buat maksimal 2 kesalahan.</small></div>
        <div class="how-star-card star-one"><strong>★ 1 BINTANG</strong><small>Selesaikan chapter sampai tuntas meskipun waktu tinggal sedikit.</small></div>
        <div class="how-time-bonus"><strong>+ BONUS WAKTU</strong><small>Perbaiki sumber masalah, selesaikan objective penting, atau temukan semua noda Lumi untuk mendapat +3 sampai +5 detik.</small></div>
        <div class="how-time-safe"><strong>− HINDARI PENALTI</strong><small>Periksa jenis tong sampah dan urutan kerja sebelum beraksi. Kesalahan yang jelas dapat mengurangi 5 detik.</small></div>
      </section>`,
    );
    const guideSections = [game.els.modal.querySelector('.how-controls'), game.els.modal.querySelector('.how-mission'), game.els.modal.querySelector('.how-score-guide')];
    const guideNav = document.createElement('nav');
    guideNav.className = 'how-navigation';
    guideNav.setAttribute('aria-label', 'Bagian panduan');
    guideNav.innerHTML = ['Kontrol', 'Alur Misi', 'Bintang & Waktu'].map((label, index) => `<button type="button" data-guide="${index}" aria-pressed="${index === 0}" aria-controls="guide-section-${index}"><span>0${index + 1}</span>${label}</button>`).join('');
    game.els.modal.querySelector('.how-header').after(guideNav);
    guideSections.forEach((section, index) => { section.id = `guide-section-${index}`; section.hidden = index !== 0; });
    const guideNote = document.createElement('p');
    guideNote.className = 'how-control-note';
    guideNote.textContent = 'Dekati benda hingga petunjuk muncul, lalu tekan E. Saat mini-game, ikuti instruksi klik atau seret yang tampil di layar.';
    guideSections[0].append(guideNote);
    guideNav.querySelectorAll('button').forEach(button => { button.onclick = () => {
      const selected = Number(button.dataset.guide);
      guideSections.forEach((section, index) => { section.hidden = index !== selected; });
      guideNav.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', item === button));
    }; });
    game.$("#closeHow").onclick = () =>
      returnToPause ? game.pause() : game.loadScene("MainMenu");
    guideNav.querySelector('button').focus({preventScroll: true});
  };

game.showSettings = function showSettings(returnToPause = false) {
    game.pauseActive = returnToPause || /^Chapter/.test(game.state.scene);
    game.els.modal.innerHTML = `<div class="settings-overlay settings-screen"><div class="settings-card panel" role="dialog" aria-modal="true" aria-labelledby="settingsTitle"><header class="settings-header"><span class="settings-emblem" aria-hidden="true">⚙</span><div><span class="settings-kicker">SESUAIKAN PENGALAMANMU</span><h1 id="settingsTitle">PENGATURAN</h1><p>Atur kenyamanan bermain sesuai keinginanmu.</p></div></header><div class="settings-layout"><section class="settings-section"><div class="settings-section-title"><span aria-hidden="true">◈</span><div><strong>TAMPILAN & TEKS</strong><small>Kenyamanan visual dan membaca</small></div></div><label class="setting-row"><span><b>Animasi</b><small>Gerakan dan transisi layar</small></span><select id="motionSetting" aria-label="Animasi"><option value="on">Aktif</option><option value="off">Nonaktif</option></select></label><label class="setting-row"><span><b>Kecepatan teks</b><small>Kecepatan dialog ditampilkan</small></span><select id="textSpeed" aria-label="Kecepatan teks"><option value="slow">Lambat</option><option value="normal">Normal</option><option value="fast">Cepat</option></select></label><label class="setting-row"><span><b>Kursor</b><small>Pilih gaya penunjuk mouse</small></span><select id="cursorSetting" aria-label="Kursor">${Object.entries(game.CURSORS).map(([id, cursor]) => `<option value="${id}">${cursor.label}</option>`).join("")}</select></label><div class="cursor-preview" id="cursorPreview"><img id="cursorPreviewImage" alt="" hidden><span>Arahkan mouse ke sini untuk mencoba</span></div><button class="setting-fullscreen" id="fullscreenSetting" type="button"><span aria-hidden="true">⛶</span><span><b>Mode Layar Penuh</b><small>Main tanpa gangguan</small></span><i>BUKA</i></button></section><section class="settings-section audio-section"><div class="settings-section-title"><span aria-hidden="true">♪</span><div><strong>AUDIO</strong><small>Musik dan efek suara</small></div></div><label class="volume-row"><span><b>Volume utama</b><output class="volume-value" id="masterVolumeValue"></output></span><input id="masterVolume" type="range" min="0" max="100" step="1"></label><label class="volume-row"><span><b>Musik</b><output class="volume-value" id="musicVolumeValue"></output></span><input id="musicVolume" type="range" min="0" max="100" step="1"></label><label class="volume-row"><span><b>Efek suara</b><output class="volume-value" id="sfxVolumeValue"></output></span><input id="sfxVolume" type="range" min="0" max="100" step="1"></label><label class="mute-setting"><span><b>Bisukan semua audio</b><small>Matikan musik dan efek suara</small></span><input id="muteSetting" type="checkbox" role="switch"></label></section></div><footer class="settings-actions"><button class="btn secondary" id="cancelSettings">← KEMBALI</button><button class="btn" id="saveSettings">SIMPAN PENGATURAN</button></footer></div></div>`;
    game.$("#motionSetting").value = game.state.settings.motion ? "on" : "off";
    game.$("#textSpeed").value = game.state.settings.dialogSpeed;
    game.$("#cursorSetting").value = game.cursorChoice(game.state.settings.cursor);
    const previewCursor = () => {
      const choice = game.CURSORS[game.$("#cursorSetting").value];
      game.$("#cursorPreview").style.cursor = choice.css;
      const icon = game.$("#cursorPreviewImage");
      icon.hidden = !choice.image;
      if (choice.image) icon.src = choice.image;
    };
    game.$("#cursorSetting").onchange = previewCursor;
    previewCursor();
    [
      ["masterVolume", game.state.settings.masterVolume],
      ["musicVolume", game.state.settings.musicVolume],
      ["sfxVolume", game.state.settings.sfxVolume],
    ].forEach(([id, value]) => {
      const input = game.$("#" + id),
        output = game.$("#" + id + "Value");
      input.value = value;
      output.textContent = value + "%";
      input.oninput = () => (output.textContent = input.value + "%");
    });
    game.$("#muteSetting").checked = game.state.settings.muted;
    game.$("#fullscreenSetting").onclick = async () => {
      try {
        if (!document.fullscreenElement)
          await document.documentElement.requestFullscreen();
        else await document.exitFullscreen();
      } catch {
        game.toast("Mode layar penuh tidak didukung browser.");
      }
    };
    game.$("#saveSettings").onclick = () => {
      game.state.settings.motion = game.$("#motionSetting").value === "on";
      game.state.settings.dialogSpeed = game.$("#textSpeed").value;
      game.state.settings.cursor = game.$("#cursorSetting").value;
      game.state.settings.masterVolume = Number(game.$("#masterVolume").value);
      game.state.settings.musicVolume = Number(game.$("#musicVolume").value);
      game.state.settings.sfxVolume = Number(game.$("#sfxVolume").value);
      game.state.settings.muted = game.$("#muteSetting").checked;
      game.persistSettings();
      const loaded = game.safeLoad();
      if (loaded) game.save(game.state.scene);
      returnToPause ? game.pause() : game.loadScene("MainMenu");
    };
    game.$("#cancelSettings").onclick = () =>
      returnToPause ? game.pause() : game.loadScene("MainMenu");
  };

game.confirmReset = function confirmReset() {
    const progress = game.safeLoad();
    game.els.modal.innerHTML = `<div class="settings-overlay journey-overlay"><section class="settings-card panel journey-card reset-card" role="dialog" aria-modal="true" aria-labelledby="reset-title" aria-describedby="reset-description"><header class="journey-heading"><span class="journey-emblem reset-emblem" aria-hidden="true">&#8634;</span><small>LEMBARAN BARU</small><h1 id="reset-title">Mulai dari awal?</h1><p id="reset-description">Perjalanan Andi akan kembali ke awal.<br>Progress yang dihapus tidak bisa dikembalikan.</p></header><div class="reset-progress"><div><strong>${progress?.chapters.filter(Boolean).length || 0}<small>/ 5</small></strong><span>CHAPTER SELESAI</span></div><div><strong>${progress?.medicines.filter(Boolean).length || 0}<small>/ 5</small></strong><span>OBAT TERKUMPUL</span></div></div><p class="journey-note">Progress chapter, koleksi obat, dan Buku Lumi akan direset. Pengaturan audio dan tampilan tetap tersimpan.</p><footer class="journey-actions"><button class="btn secondary" id="cancelReset">SIMPAN PERJALANAN</button><button class="btn danger" id="confirmReset">RESET PROGRESS</button></footer></section></div>`;
    game.$('#cancelReset').focus();
    game.$("#cancelReset").onclick = () => game.loadScene("MainMenu");
    game.$("#confirmReset").onclick = () => {
      game.resetGame();
      game.loadScene("MainMenu");
      game.toast("Progress berhasil direset.");
    };
  };

game.showCredits = function showCredits() {
    const instagramIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>`;
    const members = game.CREDIT_INFO.members.map((member, index) => `
      <article class="credit-member">
        <span class="credit-avatar" aria-hidden="true">${member.initials}</span>
        <div class="credit-member-info"><small>ANGGOTA / 0${index + 1}</small><h3>${member.name}</h3><span>@${member.instagram}</span></div>
        <a class="credit-instagram" href="https://www.instagram.com/${member.instagram}/" target="_blank" rel="noopener noreferrer" aria-label="Buka Instagram ${member.name} (tab baru)" title="Instagram @${member.instagram}">${instagramIcon}</a>
      </article>`).join("");
    const supporters = [
      { role: 'MENTOR', name: 'Kemala Putri Oktaviani', instagram: 'kkml.la', initials: 'KP', note: 'Untuk arahan dan bimbingan sepanjang perjalanan.' },
      { role: 'SPECIAL THANKS', name: 'Muhammad Adli Irawan', instagram: 'mhmd_adli_i', initials: 'MA', note: 'Untuk dukungan yang ikut menghidupkan cerita ini.' },
    ].map(person => `<article class="credit-supporter"><div class="credit-supporter-top"><span class="credit-avatar" aria-hidden="true">${person.initials}</span><small>${person.role}</small><span class="credit-spark" aria-hidden="true">✦</span></div><h3>${person.name}</h3><p>${person.note}</p><a class="credit-social-button" href="https://www.instagram.com/${person.instagram}/" target="_blank" rel="noopener noreferrer" aria-label="Buka Instagram ${person.name} (tab baru)">${instagramIcon}<span>@${person.instagram}</span><span aria-hidden="true">↗</span></a></article>`).join('');
    const details = [
      ["GENRE GAME", "Petualangan edukasi / Puzzle / Fantasi"],
      ["WAKTU PEMBUATAN", game.CREDIT_INFO.created],
      ["TEKNOLOGI", game.CREDIT_INFO.technology],
      ["ASSET VISUAL", game.CREDIT_INFO.visualAssets],
      ["ASSET AUDIO", game.CREDIT_INFO.audioAssets],
      ["DEPLOYMENT", game.CREDIT_INFO.deployment],
    ].map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("");
    game.els.modal.innerHTML = `<div class="credits-overlay"><section class="credits-card panel" aria-labelledby="creditsTitle">
      <header class="credits-header"><span class="credits-kicker">SEBUAH PERJALANAN UNTUK IBU</span><div class="credits-logos"><img class="credits-team-logo" src="assets/Logo%20Tim.png" alt="Nexus Ananta — logo tim"><span class="credits-logo-divider" aria-hidden="true"></span><img src="${game.ASSETS.menu.logo}" alt="For Mother"></div><h1 id="creditsTitle">Di Balik Perjalanan</h1><p>Dibuat bersama, dengan sepenuh hati.</p></header>
      <div class="credits-team-heading"><h2>Kenali tim kami</h2><span>${game.CREDIT_INFO.creator}</span></div>
      <div class="credits-members">${members}</div>
      <div class="credits-production-heading"><span>YANG MENEMANI PERJALANAN</span></div>
      <div class="credits-supporters">${supporters}</div>
      <div class="credits-production-heading"><span>CATATAN PRODUKSI</span></div><dl class="credits-details">${details}</dl>
      <footer class="credits-footer"><p>Terima kasih telah menemani Andi dalam perjalanan menjaga kesehatan dan orang yang ia sayangi.</p><button class="btn" id="closeCredits" type="button">KEMBALI KE MENU</button></footer>
    </section></div>`;
    game.$("#closeCredits").onclick = () => game.loadScene("MainMenu");
    game.$("#closeCredits").focus({ preventScroll: true });
  };

game.startFromMenu = function startFromMenu(nextScene, beforeStart) {
    const menu = game.els.modal.querySelector(".menu, .difficulty-card");
    if (!menu || menu.classList.contains("menu-starting")) return;
    beforeStart?.();
    menu.classList.add("menu-starting");
    menu
      .querySelectorAll("button")
      .forEach((button) => (button.disabled = true));
    game.els.fade.style.background = "#070403";
    game.sceneTimeout(
      () => game.transition(nextScene),
      game.state.settings.motion ? 950 : 0,
      "menu-cinematic-start",
    );
  };

game.SCENES.MainMenu = function MainMenu() {
      game.clear();
      game.els.bg.removeAttribute("src");
      game.els.bg.onerror = null;
      game.state.scene = "MainMenu";
      const has = !!game.safeLoad();
      game.restoreSettings();
      game.els.modal.innerHTML = `<div class="menu"><div class="menu-ambience"></div><nav class="menu-utilities" aria-label="Menu bantuan"><button class="menu-icon-button" id="how" type="button" aria-label="Cara Main" data-tooltip="Cara Main"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 5.2c2.8-.8 5.5-.2 8.5 1.7v12c-3-1.9-5.7-2.5-8.5-1.7zM20.5 5.2c-2.8-.8-5.5-.2-8.5 1.7v12c3-1.9 5.7-2.5 8.5-1.7z"/><path d="M12 6.9v12"/></svg></button><button class="menu-icon-button" id="settings" type="button" aria-label="Pengaturan" data-tooltip="Pengaturan"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.7 3.4h4.6l.7 2.1c.5.2 1 .5 1.5.8l2.1-.5 2.3 4-1.5 1.6v1.2l1.5 1.6-2.3 4-2.1-.5c-.5.3-1 .6-1.5.8l-.7 2.1H9.7L9 18.5c-.5-.2-1-.5-1.5-.8l-2.1.5-2.3-4 1.5-1.6v-1.2L3.1 9.8l2.3-4 2.1.5c.5-.3 1-.6 1.5-.8z"/><circle cx="12" cy="12" r="3.2"/></svg></button></nav><section class="menu-content"><span class="menu-eyebrow">A FANTASY EDUCATIONAL JOURNEY</span><img class="logo" src="${game.ASSETS.menu.logo}" alt="For Mother"><p class="menu-tagline">Sebuah perjalanan kecil untuk cinta yang begitu besar.</p><div class="buttons menu-actions"><div class="menu-main-actions"><button class="btn menu-primary" id="new">MULAI PERJALANAN</button><button class="btn menu-continue" id="cont" ${has ? "" : "disabled"}>LANJUTKAN</button></div><button class="btn menu-skip" id="skipPrologue"><span>SKIP PROLOG</span><small>Mulai langsung dari Desa</small></button><div class="menu-secondary"><button class="menu-text-action danger" id="reset" type="button">RESET PROGRESS</button><span aria-hidden="true">•</span><button class="menu-text-action" id="credits" type="button">KREDIT</button></div></div></section><small class="menu-version">FOR MOTHER · 2026</small></div>`;
      game.els.modal.querySelector(".menu-utilities").insertAdjacentHTML(
        "beforeend",
        '<button class="menu-icon-button" id="medicineCollection" type="button" aria-label="Koleksi Obat" data-tooltip="Koleksi Obat">💊</button><button class="menu-icon-button" id="lumiBook" type="button" aria-label="Buku Lumi" data-tooltip="Buku Lumi">✦</button>',
      );
      const menuVideo = document.createElement("video");
      menuVideo.className = "menu-background-video";
      menuVideo.src = game.ASSETS.menu.bg;
      menuVideo.autoplay = true;
      menuVideo.muted = true;
      menuVideo.loop = true;
      menuVideo.playsInline = true;
      menuVideo.preload = "auto";
      menuVideo.setAttribute("aria-hidden", "true");
      game.els.modal.querySelector(".menu").prepend(menuVideo);
      menuVideo.play().catch(() => {});
      game.$("#new").onclick = () => {
        game.showDifficulty("Opening1");
      };
      game.$("#skipPrologue").onclick = () => {
        game.showDifficulty("Village");
      };
      game.$("#cont").onclick = () => {
        const loaded = game.safeLoad() || game.defaults();
        const allChaptersComplete = loaded.chapters.every(Boolean);
        const destination = allChaptersComplete
          ? "Ending"
          : loaded.scene === "MainMenu"
            ? "Opening1"
            : loaded.scene;
        game.startFromMenu(destination, () => {
          game.state = loaded;
          game.restoreSettings();
        });
      };
      game.$("#how").onclick = () => game.showHowToPlay();
      game.$("#settings").onclick = () => game.showSettings();
      game.$("#medicineCollection").onclick = () => game.showMedicineCollection();
      game.$("#lumiBook").onclick = () => game.showLumiBook();
      game.$("#reset").onclick = game.confirmReset;
      game.$("#credits").onclick = game.showCredits;
    };

game.pause = function pause() {
    if (game.state.scene === "MainMenu" || game.transitionActive || game.runtime.chapterIntroActive) return;
    game.runtime.repair?.cancel?.();
    if (game.runtime.captureChapterProgress) game.save(game.state.scene);
    game.pauseActive = true;
    game.AudioManager.setPaused(true);
    if (game.runtime.chapterTimer) game.runtime.chapterTimer.warningActive = false;
    game.lock();
    const chapter = game.state.scene.replace("Chapter", "") || "PERJALANAN";
    const remaining = game.runtime.chapterTimer ? game.formatTime(game.runtime.chapterTimer.remaining) : "—";
    game.els.modal.innerHTML = `<div class="pause"><section class="card panel pause-card"><div class="pause-glow" aria-hidden="true">✦</div><header class="pause-header"><img src="${game.ASSETS.andi.portrait.neutral}" alt="Andi"><div><small>PERJALANAN SEMENTARA DIJEDA</small><h1>JEDA</h1><p>Chapter ${chapter} <i>•</i> Waktu tersisa <b>${remaining}</b></p></div><img src="${game.ASSETS.lumi.happy}" alt="Lumi"></header><div class="pause-actions"><button class="btn" id="resume">▶ LANJUTKAN</button><button class="btn secondary" id="restart" ${/^Chapter/.test(game.state.scene) ? "" : "disabled"}>↻ ULANGI CHAPTER</button><button class="btn secondary" id="set">⚙ PENGATURAN</button><button class="btn secondary" id="home">⌂ MAIN MENU</button></div></section></div>`;
    game.els.modal.querySelector(".pause .card").insertAdjacentHTML(
      "beforeend",
      '<div class="pause-journals"><button type="button" id="pauseMedicine">💊 Koleksi Obat</button><button type="button" id="pauseLumiBook">✦ Buku Lumi</button></div>',
    );
    game.$("#resume").onclick = () => {
      game.pauseActive = false;
      game.AudioManager.setPaused(false);
      game.els.modal.innerHTML = "";
    };
    game.$("#pauseMedicine").onclick = () => game.showMedicineCollection(true);
    game.$("#pauseLumiBook").onclick = () => game.showLumiBook(true);
    game.$("#restart").onclick = game.restartChapter;
    game.$("#set").onclick = () => game.showSettings(true);
    game.$("#home").onclick = () => game.transition("MainMenu");
  };
})(window.ForMotherRuntime);
