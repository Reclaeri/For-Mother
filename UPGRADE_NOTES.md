# FOR MOTHER — catatan upgrade gameplay dan audio

## Perubahan gameplay

- **Chapter 2:** ikon repair muncul di atas objek terdekat. Tekan **E**, cari kerusakan, pilih perlengkapan, lalu ikuti jalur gerakan bernomor. Gerak, munculnya kotoran baru, dan hitung mundur berhenti selama repair. ESC menyimpan langkah yang sudah dikerjakan. Pipa mempunyai dialog Lumi, efek `water_fixed_effect.png`, dan kebocoran berhenti setelah diperbaiki. Jendela menghentikan overlay debu dan menampilkan `window_light_effect.png`. Tempat sampah tetap memakai urutan tegakkan → kantong baru → bersihkan sekitar, tanpa pemilahan.
- **Chapter 4:** empat pasangan barang tetap dibawa ke tujuan masing-masing. Penempatan yang salah mendapat petunjuk Lumi sesuai barang yang sedang dibawa. Kursi dan rak menggunakan sistem repair yang sama serta `repair_success_fx.png`. Urutan debu sebelum lantai, bonus, dan dialog penutup tetap dipakai.
- **Chapter 5:** repair jendela, pemilahan sampah, membawa mainan ke tempatnya, membersihkan debu/lantai, Lumi Vision, inspeksi noda tersembunyi, dan kuman terakhir. Progress masing-masing langkah dan barang bawaan disimpan. Semua selesai memulai restorasi dengan `final_restoration_glow.png`, suara kilau dan pemulihan lembut, kemudian meneruskan edukasi, hasil, hadiah obat, dan rangkaian ending lama. Waktu awal Chapter 5 menjadi **100 detik**; Chapter 2/4 tetap **120 detik**. Repair dan restorasi menjeda timer.
- **Collision:** badan ilustrasi tidak menentukan tabrakan Andi. Collider kaki berukuran **22 × 12** unit logis, berpusat 75 unit di atas anchor sprite, bergeser 3 unit mengikuti arah hadap. Layer rintangan tak terlihat yang sudah mengikuti ruangan tetap dipakai; gerak diuji per langkah kecil agar tidak menembus penghalang. F2 menampilkan collider dan rintangan.

## Struktur kode

```text
index.html                  urutan pemuatan modul
script.js                   bootstrap, satu set input listener, public QA API
style.css                   tampilan game dan efek
js/
  core/
    gameState.js            konfigurasi, referensi asset, state awal, teks cerita
    save.js                 save/continue, migrasi save lama, settings
    audio.js                audio manager dan ambience
    scene.js                lifecycle, transisi, narasi, ending, game loop
  player/
    movement.js             gerak Andi/NPC, kamera, barang bawaan
    collision.js            collider kaki, rintangan, spawn aman, debug
  systems/
    dialog.js               dialog, Lumi, petunjuk, edukasi
    interaction.js          deteksi E, ikon repair, portal
    timer.js                timer, warning, bonus, penalti
    inventory.js            obat, perkembangan Ibu, buku Lumi
    cleaning.js             cleaning, investigasi, pemilahan
    repair.js               inspeksi, alat, progress, efek repair
    restoration.js          restorasi akhir
  chapters/
    chapter1.js
    chapter2.js
    chapter3.js
    chapter4.js
    chapter5.js
  ui/
    menu.js                 menu, credit, pengaturan, pause
    hud.js                  objective, status, feedback
    result.js               hasil chapter dan kartu edukasi
tools/test_gameplay.cjs      regresi melalui Chrome headless
```

Modul menggunakan script biasa sehingga tidak membutuhkan bundler atau dependency baru. Setiap modul menerima konteks runtime privat yang sama. Referensi sementara `window.ForMotherRuntime` dihapus setelah bootstrap. Nama/fungsi lama dipertahankan pada konteks tersebut; save tetap memakai key `forMother.save.v2`. Jangan mengubah urutan script di `index.html` tanpa memeriksa dependensinya.

## Audio dan asset yang benar-benar digunakan

Semua suara melewati **AudioManager**. Upgrade ini menambahkan kategori dan pemetaan event, bukan file rekaman baru. File yang tersedia adalah **`sfx-benar.mp3`**, bukan `sf-benar.mp3` pada brief.

| Event/kategori | Asset di `assets/audio/sfx/` | Perilaku |
| --- | --- | --- |
| Tombol menu, kembali, pause, setting, konfirmasi, lanjut dialog | `sfx-click.mp3` | Satu listener klik umum; dialog keyboard memakai jalur audio yang sama. Cooldown berdasarkan file mencegah suara ganda. |
| Sampah masuk tong benar, cleaning, repair selesai, penempatan benar | `sfx-benar.mp3` | Dipanggil pada perubahan status berhasil, bukan selama progress; gain sedikit lebih kuat di Chapter 5. |
| Alat bekerja | `wipe_clean.wav` | Fallback gesekan alat, loop hanya selama interaksi pointer pada jalur repair. |
| Baut / langkah / error | `ui_click.wav` | Fallback klik pendek dengan volume dan pitch berbeda. Langkah mengikuti perpindahan aktual, bukan sekadar tombol gerak ditahan. |
| Alat atau barang diambil | `trash_pickup.wav` | Satu kali ketika alat dipilih atau barang diambil. |
| Kantong plastik | `trash_dispose.wav` | Saat kantong baru dipilih. |
| Repair selesai / derit perabot / jendela ditutup | `window_close.wav` | Gain/pitch lebih lembut untuk fallback perabot dan repair; jendela memakai efek aslinya. |
| Kebocoran dan room tone | `mop_scrub.wav` | Fallback tekstur basah pelan, tidak berupa rekaman tetesan khusus. |
| Angin masuk | `wipe_clean.wav` | Fallback hembusan pelan; berhenti setelah jendela diperbaiki. |
| Lumi Vision / penemuan noda | `lumi_vision_activate.wav`, `hidden_dirt_found.wav` | Tetap mengikuti aktivasi dan penemuan. |
| Restorasi | `hidden_dirt_found.wav`, `medicine_obtained.wav` | Kilau lalu nada pemulihan lembut; tanpa ledakan. |
| Timer di bawah 15 detik | `sfx-timer.mp3` | Satu loop per interval warning, volume/rate meningkat perlahan; tidak restart tiap frame. |

Belum ada rekaman khusus langkah, angin, baut, kayu, atau lalat di folder audio. Fallback di atas menggunakan asset existing. Suara lalat tidak ditambahkan. Untuk mengganti dengan rekaman khusus nanti, cukup ubah pemetaan `AUDIO_ASSETS.sfx` di `js/core/gameState.js`.

Ambience Chapter 1–5 memakai room tone sangat pelan; Chapter 2 memiliki dua sumber terpisah. Suasana makin tenang seiring kebersihan. Dialog menurunkan ambience dan musik; repair/cleaning juga menurunkannya. Maksimum enam suara sekali-putar aktif. Loop, suara yang masih berjalan, dan fade tertunda dibersihkan saat ganti scene/restart. Pause menghentikan loop, dan mute/volume tetap berlaku selama fade.

## Perbaikan lifecycle

- Tidak menambahkan listener input atau audio global per chapter. Listener umum dipasang sekali di bootstrap. Handler repair/pemilahan melekat pada panel yang dibuang saat selesai atau batal.
- Loop alat berhenti saat tombol dilepas, fokus berpindah, panel ditutup, atau scene dibersihkan.
- Waktu habis membatalkan cleaning/investigasi/pemilahan. Callback pemilahan yang terlambat tidak dapat menyelesaikan objective sesudah dibatalkan.
- Warning timer bisa aktif kembali setelah unmute tanpa membuat loop ganda.
- Fade volume dari pause lama tidak dapat mengubah volume scene baru.
- Restart Chapter 2/4/5 menghapus progress lokal chapter, termasuk repair, barang bawaan, bonus, dan restorasi. Save format serta alur reward lama tetap dipakai.

## Testing

Jalankan dari folder proyek:

```powershell
node tools/test_gameplay.cjs
```

Tes menggunakan Chrome headless dengan profil sementara, server localhost, dan hook yang hanya disisipkan oleh server tes. Tidak menggunakan profil atau save browser pemain. Jika Chrome ada di lokasi lain, atur `CHROME_PATH`. Screenshot berada di `tools/qa-output/` dan diabaikan Git.

| Chapter | Pemeriksaan manual |
| --- | --- |
| 1 | Ambil dan buang enam sampah. Tong salah tidak mengambil barang. Dengarkan suara ambil, error, lalu success saat dibuang benar. Tahan gerak ke dinding: langkah tidak terus berbunyi. |
| 2 | Dekati pipa/jendela/tempat sampah sampai ikon muncul, tekan E. Pastikan dialog pipa muncul dan timer berlabel JEDA. Pilih alat salah/benar (cek popup dan penalti 5 detik); seret mengikuti nomor, lepas, ESC, lanjut lagi. Suara alat harus berhenti ketika dilepas. Sesudah sumber diperbaiki, efek dan ambience sumber berhenti. Cleaning terkunci sampai semua repair selesai. |
| 3 | Selesaikan dialog pembuka, tekan Q, dekati dan tandai tujuh noda. Lumi Vision tetap memakai energi. Selesaikan edukasi/reveal dan bersihkan semuanya; reward obat ketiga tetap tersedia. |
| 4 | Antar buku, kotak, mainan, dan bantal. Coba tujuan salah untuk petunjuk Lumi. Repair kursi dan rak. Coba mengepel sebelum debu: diblokir. Selesaikan urutan, cek bonus hanya sekali, lalu reload/continue. |
| 5 | Selesaikan repair, sorting, penataan, dan cleaning. Q membuka noda tersembunyi, yang masih perlu diinspeksi. Bersihkan kuman terakhir. Periksa glow restorasi, timer terjeda, suara pemulihan lembut, lalu lanjutkan reward hingga ending. |

Di setiap chapter, cek mute, volume SFX, pause/resume, restart, kembali menu, dan timer di bawah 15 detik. Dengarkan tingkat kenyamanan audio dengan speaker/headphone; tes otomatis memeriksa event/lifecycle, bukan kualitas subjektif rekaman fallback. Ending harus tetap menampilkan urutan logo tim → For Mother → keduanya setelah memilih Menu atau Main Lagi.


## Update interaksi repair

Repair sekarang menggunakan jalur gerakan bernomor, bukan progress berdasarkan lama menahan tombol. Pipa harus dioles lem, dipasangi plester, lalu diratakan; baut memakai gerakan melingkar, sedangkan bagian lain memakai gerakan angkat/pasang. Mouse dan sentuhan mengikuti titik jalur; keyboard menyediakan alternatif Enter/Spasi per gerakan (auto-repeat tidak dihitung).

Panel menampilkan tahapan, titik berikutnya, progress, dan instruksi gerakan. Salah memilih alat mengurangi waktu 5 detik melalui sistem penalti existing dan menampilkan popup di atas panel. Timer tetap dijeda selama repair; penalti tetap berlaku dan waktu nol langsung mengakhiri chapter. Progress gerakan disimpan setelah tiap titik. Tes gameplay diperbarui untuk memeriksa penalti, interaksi pointer, dan memastikan menunggu tidak menambah progress.


### Chapter 2: sampah diseret ke tong

Tahap ketiga tempat sampah sekarang berisi lima sampah terpisah (kertas, botol, kaleng, plastik, kulit pisang). Seret dengan mouse/sentuhan lalu lepaskan di tong; lepas di luar mengembalikan sampah ke posisi awal tanpa penalti tambahan. Tong menyala saat menjadi target drop. Keyboard: aktifkan sampah lalu aktifkan tong. Sampah yang sudah masuk tersimpan saat keluar/continue. Timer tetap dijeda, tahap tegakkan tong dan ganti kantong tetap wajib diselesaikan terlebih dahulu.

### Kabut rumah penyihir

Scene Forest memiliki kabut lokal yang menyamarkan rumah penyihir. Saat Andi berada dalam jarak 380 unit dari pintu, kabut memudar selama 1,8 detik (0,35 detik pada pengaturan gerakan minimal). Setelah tersingkap, kabut tetap hilang sampai kunjungan hutan berikutnya. Kabut tidak menghalangi input, collider, atau pintu; elemen dan updater mengikuti cleanup scene.

### Animasi baut

Tahap putar alat sekarang menampilkan kepala baut dan obeng yang berputar pada sumbu yang sama. Sudut mengikuti gerakan pointer mengelilingi baut, termasuk arah balik, sementara penyelesaian tetap mengikuti urutan titik. Keyboard memutar alat per langkah. Efek berhenti ketika drag dilepas; visual dibuat dengan CSS tanpa asset tambahan.


## Difficulty: EASY / MEDIUM / HARD

Konfigurasi terbaru ada di `js/core/difficulty.js` (menggantikan `CHAPTER_TIME_LIMITS` lama). Pilihan tampil setelah Mulai Perjalanan atau Skip Prolog. Batal tidak mengganti save; Mulai menyimpan mode baru. Continue dan replay ending mempertahankan mode tersimpan. Save lama tanpa difficulty memakai MEDIUM, tanpa menghapus chapter selesai, obat, pengetahuan, atau progress repair.

| Mode | Ch1 | Ch2 | Ch3 | Ch4 | Ch5 |
| --- | --- | --- | --- | --- | --- |
| EASY | 120 | 110 | 150 | 130 | 110 |
| MEDIUM | 90 | 80 | 105 | 90 | 75 |
| HARD | 60 | 55 | 75 | 60 | 50 |

Timer dalam detik; bonus/penalti serta jeda repair tetap berlaku. Save melanjutkan sisa waktu, bukan memberi timer baru.

| Jumlah | EASY | MEDIUM | HARD |
| --- | --- | --- | --- |
| Sampah Chapter 1 | 5 | 10 | 15 |
| Kebocoran pipa Chapter 2 | 1 | 2 | 3 |
| Sumber debu/pengunci jendela Chapter 2 | 2 | 3 | 5 |
| Noda Lumi Chapter 3 | 5 | 10 | 15 |
| Perabot repair Chapter 4 | 4 | 6 | 9 |
| Objective objek Chapter 5 | 12 | 23 | 35 |

Pipa dan jendela tetap pada koordinat background. Jumlah masalah diterapkan pada titik repair di panel: masing-masing kebocoran harus dilem, diplester, lalu diratakan. Tempat sampah tetap menggunakan tiga tahap termasuk drag sampah. Chapter 4 mempertahankan empat pengantaran dan urutan cleaning. Chapter 5 mempertahankan delapan objective utama, ditambah 4/15/27 noda/genangan yang wajib dibersihkan sebelum Lumi Vision final. Jumlah final dihitung sebagai objective objek dunia, bukan potongan sampah di dalam minigame sorting.

Spawn memakai area lantai terbatas `spawnAreaCleaning`, `spawnAreaStain`, `spawnAreaRepair`, memeriksa collider dengan margin, jalur utama, pintu/tujuan penting, dan jarak antarobjek. Jarak minimum: sampah 80, noda 100, perabot 120 unit. Layout padat menggunakan kandidat berbaris selang-seling dengan offset dan pemilihan acak; validasi jarak tetap berlaku. Layout disimpan per chapter; Restart menghapus layout lalu membuat yang baru. Posisi objek background seperti jendela dan tujuan pengantaran tidak diacak. Semua objek acak non-solid, sehingga tidak menambah penghalang jalan.

Chapter 1 menyimpan sampah yang dibuang, barang bawaan, dan bonus. Chapter 3 menyimpan tanda Lumi, noda selesai, progress gosok, fase cleaning, dan bonus. Hint otomatis memakai interval dasar 10/20/40 detik pada EASY/MEDIUM/HARD; hint pertama setelah 75% interval. Dialog cerita dan petunjuk langsung terkait aksi tetap dipertahankan.

Verifikasi:
- `node tools/test_difficulty.cjs`: ketiga mode x lima chapter; masing-masing empat kali Restart/Continue, timer, jumlah, jarak/collider, keterjangkauan objective, pemilihan mode melalui menu, kompatibilitas save lama.
- `node tools/test_gameplay.cjs`: alur lengkap dengan konfigurasi MEDIUM, repair berurutan, drag sampah, penataan, Lumi Vision, restorasi, reward, kedua ending, audio, dan ukuran layar.

File yang berubah: `index.html`, `style.css`, `js/core/difficulty.js` (baru), `js/core/gameState.js`, `js/core/save.js`, `js/core/scene.js`, `js/systems/dialog.js`, `js/systems/repair.js`, kelima file chapter, `js/ui/menu.js`, `js/ui/hud.js`, `js/ui/result.js`, dan kedua skrip tes. Tidak menambah asset atau dependency.


## Update uji coba dan balancing terbaru

Menu utama menyediakan **UJI COBA CHAPTER**: pilih difficulty, lalu langsung buka Chapter 1-5. Saat uji coba, Pause menyediakan **PILIH CHAPTER UJI COBA**. HUD diberi label UJI COBA. Progress dan reward sesi ini hanya di memori; autosave/reset/restart tidak menulis atau menghapus save cerita. Kembali ke menu mengembalikan state cerita sebelum uji coba. Refresh browser mengakhiri sesi uji coba; Continue tetap membaca save cerita.

Balancing terbaru menggantikan jumlah sebelumnya:

| Pengaturan | EASY | MEDIUM | HARD |
| --- | --- | --- | --- |
| Sampah Chapter 1 | 5 | 9 | 14 |
| Titik pipa Chapter 2 | 1 | 2 | 3 |
| Titik jendela Chapter 2 | 2 | 3 | 4 |
| Noda Chapter 3 | 5 | 7 | 9 |
| Perabot repair Chapter 4 | 2 | 2 | 2 |
| Noda tambahan Chapter 4 (di luar empat tugas cleaning awal) | 0 | 1 | 2 |
| Sampah minigame Chapter 4 | 5 | 6 | 8 |
| Total objective objek Chapter 5 | 12 | 14 | 16 |

Timer tetap. Objective tambahan Chapter 5 dari save versi sebelumnya yang sudah tidak dipakai dibuang agar penyelesaian tidak terkunci. Pipa tetap memakai urutan lem, pasang plester, ratakan, dengan visual close-up pipa, air menetes, lapisan lem/plester mengikuti progress, dan alat yang mengikuti pointer. Gerakan minimal menonaktifkan animasi tetesan.

Tes difficulty mencakup masuk kelima chapter, mengganti mode, restart, pindah chapter melalui Pause, dan perbandingan isi save cerita sebelum/sesudah uji coba. Tes gameplay mencakup objective tambahan Chapter 4 dan jumlah Chapter 5 terbaru.
