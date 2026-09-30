/* For Mother - core/gameState. Shared state stays inside the runtime closure. */
window.ForMotherRuntime = { SCENES: {} };
((game) => {
  "use strict";

  game.W = 1672;

  game.H = 941;

  game.INTERACTION_RADIUS = 100;

  game.DEBUG_COLLISIONS = false;

  game.SAVE_KEY = "forMother.save.v2";

  game.SETTINGS_KEY = "forMother.settings.v1";

  game.AUDIO = "assets/audio/";

  game.AUDIO_ASSETS = Object.freeze({
    music: {
      calm: game.AUDIO + "alex-morgan-calm-piano-541028.mp3.mpeg",
      emotional: game.AUDIO + "alex-morgan-emotional-545518.mp3.mpeg",
      sad:
        game.AUDIO +
        "alex-morgan-sad-piano-emotional-rain-story-575883.mp3.mpeg",
      exploration: game.AUDIO + "andriig-soft-soft-music-568206.mp3.mpeg",
      magical: game.AUDIO + "atlasaudio-emotional-piano-510218.mp3.mpeg",
      ending: game.AUDIO + "atlasaudio-sentimental-piano-512258.mp3.mpeg",
    },
    sfx: {
      ...Object.fromEntries(
        [
          "trash_pickup",
          "trash_dispose",
          "window_close",
          "ui_click",
          "mop_scrub",
          "wipe_clean",
          "dialog_type",
          "dialog_next",
          "objective_complete",
          "chapter_complete",
          "medicine_obtained",
          "lumi_vision_activate",
          "hidden_dirt_found",
          "portal_activate",
          "portal_enter",
        ].map((name) => [name, `${game.AUDIO}sfx/${name}.wav`]),
      ),
      ui_click: game.AUDIO + "sfx/sfx-click.mp3",
      dialog_next: game.AUDIO + "sfx/sfx-click.mp3",
      correct: game.AUDIO + "sfx/sfx-benar.mp3",
      timer_warning: game.AUDIO + "sfx/sfx-timer.mp3",
      page_flip: game.AUDIO + "sfx/sfx-page-flip.mp3",
      water_leak: game.AUDIO + "sfx/mop_scrub.wav",
      // Existing recordings are reused as quiet fallbacks; no replacement assets.
      repair_tool: game.AUDIO + "sfx/wipe_clean.wav",
      repair_bolt: game.AUDIO + "sfx/ui_click.wav",
      repair_finish: game.AUDIO + "sfx/window_close.wav",
      wind: game.AUDIO + "sfx/wipe_clean.wav",
      room_tone: game.AUDIO + "sfx/mop_scrub.wav",
      wood_creak: game.AUDIO + "sfx/window_close.wav",
      footstep: game.AUDIO + "sfx/ui_click.wav",
      error: game.AUDIO + "sfx/ui_click.wav",
      object_pickup: game.AUDIO + "sfx/trash_pickup.wav",
      plastic: game.AUDIO + "sfx/trash_dispose.wav",
      healing: game.AUDIO + "sfx/medicine_obtained.wav",
      sparkle: game.AUDIO + "sfx/hidden_dirt_found.wav",
    },
  });

  game.CHAPTER_INTROS = Object.freeze({
    1: ["LANGKAH PERTAMA", "Pilah seluruh sampah di ruangan."],
    2: ["SUMBER MASALAH", "Hentikan sumber kotoran, lalu bersihkan akibatnya."],
    3: [
      "NODA YANG TERSEMBUNYI",
      "Gunakan Lumi Vision untuk menemukan seluruh noda.",
    ],
    4: [
      "RAPI DAN TERAWAT",
      "Tata barang, perbaiki perabot, lalu bersihkan dari atas ke bawah.",
    ],
    5: ["UNTUK IBU", "Satukan semua pelajaran dan bersihkan ruangan terakhir."],
  });

  game.CHAPTER_LESSONS = Object.freeze([
    [
      "Sampah sebaiknya segera dibuang.",
      "Lingkungan bersih membuat rumah lebih nyaman.",
      "Pekerjaan kecil yang rutin mencegah kotoran menumpuk.",
    ],
    [
      "Cari sumber masalah sebelum membersihkan akibatnya.",
      "Kebocoran harus diperbaiki terlebih dahulu.",
      "Debu dan genangan perlu ditangani dengan benar.",
    ],
    [
      "Tidak semua kotoran mudah terlihat.",
      "Ketelitian membantu menemukan noda tersembunyi.",
      "Noda harus dibersihkan sampai benar-benar hilang.",
    ],
    [
      "Barang rapi membuat rumah lebih aman.",
      "Urutan yang tepat membuat pekerjaan lebih efektif.",
      "Kebiasaan baik menjaga rumah tetap nyaman.",
    ],
    [
      "Kebersihan melindungi orang yang kita sayangi.",
      "Setiap masalah perlu ditangani dari sumbernya.",
      "Ketelitian menyempurnakan hasil membersihkan.",
    ],
  ]);

  game.MOTHER_PROGRESS = Object.freeze([10, 25, 45, 65, 85, 100]);

  game.MOTHER_CONDITIONS = Object.freeze([
    "Masih sangat lemah",
    "Napas lebih tenang",
    "Mulai membuka mata",
    "Mulai merespons Andi",
    "Sudah mampu duduk",
    "Pulih sepenuhnya",
  ]);

  game.MEDICINE_NAMES = Object.freeze([
    "Eliksir Cahaya Harapan",
    "Serum Embun Kehidupan",
    "Kristal Penyembuh Lumi",
    "Ramuan Bintang Kehidupan",
    "Eliksir Fajar Abadi",
  ]);

  game.MEDICINE_DESCRIPTIONS = Object.freeze([
    "Ramuan pertama yang memberi energi lembut untuk membantu memulihkan kondisi Ibu.",
    "Ramuan penyembuhan alami yang diracik dari embun dan kekuatan kehidupan.",
    "Kristal ajaib yang diperkuat oleh energi cahaya Lumi.",
    "Ramuan langka yang memberi kekuatan bagi tubuh yang lemah.",
    "Eliksir terakhir berenergi murni yang membawa harapan baru.",
  ]);

  game.CREDIT_INFO = Object.freeze({
    creator: "Kelompok 2 · Kelas XII RPL 1",
    members: [
      { name: "Revan Oknanda", instagram: "navervan", initials: "RO" },
      {
        name: "Muhammad Carel Azzami",
        instagram: "mhmmdcrlazzam",
        initials: "MC",
      },
      { name: "Alya Nur Azizah", instagram: "norshallayya", initials: "AN" },
      {
        name: "Arzizah Dwiyanti Dasopang",
        instagram: "azizahhdwiyanti",
        initials: "AD",
      },
    ],
    created: "Agustus 2026 – September 2026",
    deployment: "",
    visualAssets: "Generated by ChatGPT dan Codex",
    audioAssets: "Suno AI, Codex dan Pixabay",
    technology: "HTML5, CSS3, dan JavaScript vanilla",
  });

  game.HELD_ITEM_OFFSETS = Object.freeze({
    up: { x: -2, y: -74, z: -1 },
    down: { x: 0, y: -43, z: 2 },
    left: { x: -34, y: -48, z: 2 },
    right: { x: 34, y: -48, z: 2 },
  });

  game.A = "assets/";

  game.ASSETS = {
    menu: {
      bg: game.A + "background/menu/menu awal.mp4",
      logo: game.A + "ui/logo_for_mother.png",
    },
    bg: {
      village: game.A + "background/desa/background_desa.png",
      forest: game.A + "background/hutan/background-hutan.png",
      witch: game.A + "background/rumah penyihir/bg_witch_house_topdown.png",
      c1:
        game.A +
        "background/chapter background/bg_chapter_1_trash_room_topdown.png",
      c2:
        game.A +
        "background/chapter background/bg_chapter_2_dust_room_topdown.png",
      c3:
        game.A +
        "background/chapter background/bg_chapter_3_water_room_topdown.png",
      c4:
        game.A +
        "background/chapter background/bg_chapter_4_messy_room_topdown.png",
      c5:
        game.A +
        "background/chapter background/bg_chapter_5_final_room_topdown.png",
    },
    opening: [
      game.A + "cutscenes/opening/opening_1.png",
      game.A + "cutscenes/opening/opening_2.png",
      game.A + "cutscenes/opening/opening_3.png",
    ],
    prologue: {
      home: game.A + "cutscenes/opening/bg_rumah_andi_kotor_prolog.png",
      motherCough:
        game.A + "cutscenes/opening/cutscene_ibu_batuk_lingkungan_kotor.png",
    },
    witchCuts: {
      approach:
        game.A + "cutscenes/penyihir/cutscene_andi_go_to_witch_house.png",
      meet: game.A + "cutscenes/penyihir/cutscene_andi_meet_witch.png",
      mission: game.A + "cutscenes/penyihir/cutscene_witch_give_mission.png",
      open: game.A + "cutscenes/penyihir/cutscene_witch_open_portal.png",
      reward: game.A + "cutscenes/penyihir/cutscene_andi_receive_medicine.png",
    },
    mother: [1, 2, 3, 4, 5].map(
      (n) =>
        game.A +
        `cutscenes/progres ibu/cutscene_mother_progress_${n}_${["unconscious", "waking_up", "small_response", "sitting", "recovered"][n - 1]}.png`,
    ),
    ending: {
      bg: game.A + "cutscenes/ending/cutscene_ending_mother_and_andi.mp4",
      panel: game.A + "cutscenes/ending/final_message_panel.png",
      montage: [
        "C1 KOTOR.jpg",
        "C1 MULAI BERSIH.jpg",
        "C2 KOTOR.jpg",
        "C2 MULAI BERSIH.jpg",
        "C3 KOTOR.jpg",
        "C3 HAMPIR BERSIH.jpg",
        "C4 KOTOR.jpg",
        "C4 HAMPIR BERSIH.jpg",
        "C5 KOTOR.jpg",
        "C5 HAMPIR BERSIH.jpg",
      ].map((name) => game.A + `cutscenes/ending/New folder (4)/${name}`),
      lumiFarewell:
        game.A +
        "cutscenes/ending/New folder (4)/cutscene_ending_andi_lumi_farewel.png",
      lumiGoodbye:
        game.A + "cutscenes/ending/New folder (4)/ending_lumi_goodbye_pose.png",
      lumiParticles:
        game.A +
        "cutscenes/ending/New folder (4)/ending_lumi_disappear_particles.png",
    },
    andi: {
      idle: {
        down: game.A + "character/andi/andi_idle_down.png",
        up: game.A + "character/andi/andi_idle_up.png",
        left: game.A + "character/andi/andi_idle_left.png",
        right: game.A + "character/andi/andi_idle_right.png",
      },
      walk: {},
      interact: {
        down: game.A + "character/andi/andi_interact_down.png",
        up: game.A + "character/andi/andi_interact_up.png",
        left: game.A + "character/andi/andi_interact_left.png",
        right: game.A + "character/andi/andi_interact_right.png",
      },
      portrait: {},
    },
    npc: {
      bima: game.A + "character/pak bima/idle.png",
      nina: game.A + "character/nina/idle.png",
      sari: game.A + "character/bu sari/idle.png",
      witch: game.A + "character/witch/witch_topdown_npc.png",
      mother: game.A + "character/mother/mother_character_base.png",
      walk: {},
    },
    portraits: {
      narrator: game.A + "character/narator/portrait_narrator.png",
      tabib: game.A + "character/tabib/potrait_dialog_tabib.png",
      witch: game.A + "character/witch/witch_portrait_expression_sheet.png",
      bima: game.A + "character/pak bima/pa_bima_potrait.png",
      nina: game.A + "character/nina/nina_potrait.png",
      sari: game.A + "character/bu sari/bu_sari_potrait.png",
      mother: game.A + "character/mother/mother_character_base.png",
    },
    lumi: {
      normal: game.A + "companion/lumi_orb.png",
      happy: game.A + "companion/lumi_orb_happy.png",
      worried: game.A + "companion/lumi_orb_worried.png",
    },
    portal: {
      village: game.A + "portal_desa.png",
      witch: game.A + "background/rumah penyihir/portal fiks.png",
    },
    trash: {
      banana: game.A + "mini game/trash/trash_banana_peel.png",
      food: game.A + "mini game/trash/trash_food_waste.png",
      paper: game.A + "mini game/trash/trash_paper.png",
      can: game.A + "mini game/trash/trash_can.png",
      bag: game.A + "mini game/trash/trash_plastic_bag.png",
      bottle: game.A + "mini game/trash/trash_plastic_bottle.png",
      organic: game.A + "mini game/trash/bin_organic.png",
      nonorganic: game.A + "mini game/trash/bin_nonorganic.png",
    },
    dust: {
      shelf: game.A + "mini game/dust/dust_shelf_overlay.png",
      table: game.A + "mini game/dust/dust_table_overlay.png",
      window: game.A + "mini game/dust/dust_window_overlay.png",
      shelfClean: game.A + "mini game/dust/dust_shelf_clean.png",
      tableClean: game.A + "mini game/dust/dust_table_clean.png",
      windowClean: game.A + "mini game/dust/dust_window_clean.png",
      cloth: game.A + "mini game/dust/cursor_cloth.png",
      windowOpen: game.A + "mini game/dust/chapter2_window_open.png",
      windowClosed: game.A + "mini game/dust/chapter2_window_closed.png",
      pipeBroken: game.A + "mini game/dust/pipa rusak.png",
      pipeFixed: game.A + "mini game/dust/pipa bener.png",
      binFallen: game.A + "mini game/dust/tempat sampah jatuh.png",
      binUp: game.A + "mini game/dust/tempat sampah benar.png",
      trashPile: game.A + "mini game/dust/sampah.png",
    },
    water: {
      small: game.A + "mini game/water/water_puddle_small.png",
      medium: game.A + "mini game/water/water_puddle_medium.png",
      large: game.A + "mini game/water/water_puddle_large.png",
      mop: game.A + "mini game/water/cursor_mop.png",
      foot: game.A + "mini game/water/chapter3_dirty_footprint.png",
      dry: game.A + "mini game/water/dry_floor_patch.png.png",
      mosquito: game.A + "mini game/water/mosquito_small.png",
      bucketOpen: game.A + "mini game/water/water_bucket_open.png",
      bucketClosed: game.A + "mini game/water/water_bucket_closed.png",
    },
    messy: {
      books: game.A + "mini game/messy/mess_books.png",
      box: game.A + "mini game/messy/mess_box.png",
      pillow: game.A + "mini game/messy/mess_pillow.png",
      toys: game.A + "mini game/messy/mess_toys.png",
      neatBooks: game.A + "mini game/messy/neat_books.png",
      neatBox: game.A + "mini game/messy/neat_box.png",
      neatPillow: game.A + "mini game/messy/neat_pillow.png",
      neatToys: game.A + "mini game/messy/neat_toys.png",
    },
    final: {
      germ: game.A + "mini game/final/germ_shadow.png",
      dirty: game.A + "mini game/final/dirty_aura.png",
      clean: game.A + "mini game/final/clean_aura.png",
      dark: game.A + "mini game/final/stain_dark.png",
      drink: game.A + "mini game/final/stain_drink.png",
      mud: game.A + "mini game/final/stain_mud.png",
      patch: game.A + "mini game/final/clean_stain_patch.png",
    },
    meds: [1, 2, 3, 4, 5].map(
      (n) =>
        game.A +
        `medicines/medicine_0${n}_${["awareness", "voice", "strength", "warmth", "recovery"][n - 1]}.png`,
    ),
    ui: {
      empty: game.A + "ui/icon_check_empty.png",
      done: game.A + "ui/icon_check_done.png",
      star0: game.A + "ui/icon_star_empty.png",
      star1: game.A + "ui/icon_star_filled.png",
      slot: game.A + "medicines/medicine_slot_empty.png",
    },
    edu: ["trash", "dust", "water", "tidy", "health"].map(
      (x) => game.A + `edu icons/edu_icon_${x}.png`,
    ),
  };

  ["down", "up", "left", "right"].forEach((d) => {
    game.ASSETS.andi.walk[d] = [1, 2, 3, 4].map(
      (n) => game.A + `character/andi/walk_${d}_${n}.png`,
    );
  });

  ["pak bima", "nina", "bu sari"].forEach((folder) => {
    game.ASSETS.npc.walk[folder] = {};
    ["down", "up", "left", "right"].forEach(
      (d) =>
        (game.ASSETS.npc.walk[folder][d] = [1, 2, 3, 4].map(
          (n) => game.A + `character/${folder}/walk_${d}_${n}.png`,
        )),
    );
  });

  [
    "neutral",
    "worried",
    "sad",
    "determined",
    "surprised",
    "relieved",
    "happy",
    "emotional",
    "tired",
  ].forEach(
    (x) =>
      (game.ASSETS.andi.portrait[x] =
        game.A + `character/andi/andi_expr_${x}.png`),
  );

  game.$ = (s) => document.querySelector(s);

  game.els = {
    view: game.$("#viewport"),
    scene: game.$("#scene"),
    bg: game.$("#bg"),
    world: game.$("#world"),
    fx: game.$("#fx"),
    debug: game.$("#debug"),
    cleaning: game.$("#cleaning"),
    ui: game.$("#ui"),
    dialog: game.$("#dialog"),
    modal: game.$("#modal"),
    fade: game.$("#fade"),
  };

  game.defaults = () => ({
    difficulty: "MEDIUM",
    scene: "MainMenu",
    storyStage: 0,
    currentChapter: 1,
    clues: { sari: false, bima: false, nina: false },
    chapters: [false, false, false, false, false],
    medicines: [false, false, false, false, false],
    knowledge: [false, false, false, false, false],
    motherProgress: 0,
    gameCompleted: false,
    ratings: {},
    chapterProgress: {},
    resume: null,
    settings: {
      motion: true,
      dialogSpeed: "normal",
      cursor: "gold",
      masterVolume: 100,
      musicVolume: 40,
      sfxVolume: 65,
      muted: false,
      objectiveMinimized: false,
    },
  });

  game.state = game.defaults();

  game.runtime = {};

  game.keys = new Set();

  game.pressed = new Set();

  game.last = performance.now();

  game.transitionActive = false;

  game.pauseActive = false;

  game.dialogActive = false;

  game.cutsceneActive = false;

  game.miniGameActive = false;

  game.currentTarget = null;

  game.debugCollisions = game.DEBUG_COLLISIONS;

  game.sceneToken = 0;

  game.player = {
    x: 820,
    y: 780,
    dir: "up",
    moving: false,
    speed: 205,
    w: 40,
    h: 20,
    frame: 0,
    anim: 0,
    interactTimer: 0,
    held: null,
  };

  game.LUMI_LESSONS = Object.freeze({
    1: [
      "Sampah yang dibiarkan terlalu lama dapat membuat rumah menjadi kotor dan tidak nyaman.",
      "Membersihkan sedikit demi sedikit secara rutin membuat pekerjaan menjadi lebih ringan.",
    ],
    2: [
      "Menutup jendela membantu mengurangi debu dari luar yang masuk ke dalam rumah.",
      "Kalau ada pipa bocor, sebaiknya perbaiki sumber kebocorannya terlebih dahulu agar genangan air tidak terus muncul.",
      "Menjaga kebersihan bukan hanya membersihkan kotoran yang terlihat, tetapi juga mencegah penyebabnya muncul kembali.",
    ],
    3: [
      "Tidak semua kotoran mudah terlihat.",
      "Sudut ruangan dan bagian yang jarang diperiksa sering menjadi tempat debu dan noda tertinggal.",
      "Karena itu, ketelitian juga penting saat menjaga kebersihan.",
    ],
    4: [
      "Merencanakan urutan membersihkan membuat pekerjaan lebih efektif.",
      "Merapikan, membuang sampah, lalu membersihkan debu dan lantai membantu ruangan tetap nyaman.",
    ],
    5: [
      "Kebersihan bukan pekerjaan yang dilakukan satu kali saja.",
      "Menjaga lingkungan tetap bersih membutuhkan kebiasaan dan ketekunan.",
      "Semua yang kamu pelajari bersama Andi dapat dilakukan dalam kehidupan sehari-hari.",
    ],
  });

  game.KNOWLEDGE_TITLES = Object.freeze([
    "Lingkungan Bersih",
    "Udara dan Kebersihan Rumah",
    "Jejak Kotoran Tersembunyi",
    "Kerapian yang Aman",
    "Kebiasaan Menjaga Rumah",
  ]);

  game.LUMI_BOOK_DETAILS = Object.freeze([
    {
      intro:
        "Rumah yang bersih membuat kita lebih nyaman untuk beristirahat, belajar, dan berkumpul. Sampah yang tertinggal dapat menimbulkan bau, mengundang serangga, dan membuat ruangan tampak tidak terawat.",
      detail:
        "Mulailah dari sampah yang paling mudah terlihat. Pisahkan sampah organik seperti sisa makanan dari sampah anorganik seperti plastik atau kaleng. Setelah itu, bersihkan bagian kecil secara rutin agar pekerjaan besar tidak menumpuk.",
      points: [
        "Pisahkan sampah sesuai jenisnya.",
        "Gunakan tempat sampah yang tertutup.",
        "Bersihkan sedikit setiap hari.",
      ],
    },
    {
      intro:
        "Debu dari luar mudah masuk melalui jendela yang terbuka. Debu dapat menempel di lantai, meja, dan benda-benda di rumah, sehingga ruangan terasa kurang nyaman.",
      detail:
        "Bila ada kebocoran, hentikan sumber airnya terlebih dahulu. Mengelap genangan tanpa memperbaiki pipa hanya membuat air kembali muncul. Setelah sumbernya aman, keringkan area tersebut agar lantai tidak licin.",
      points: [
        "Tutup jendela saat udara berdebu.",
        "Perbaiki sumber kebocoran lebih dulu.",
        "Keringkan lantai yang basah.",
      ],
    },
    {
      intro:
        "Kotoran tidak selalu berada di tempat yang mudah dilihat. Debu dan noda dapat tertinggal di sudut ruangan, bawah furnitur, atau area yang jarang dilewati.",
      detail:
        "Saat membersihkan, lakukan pemeriksaan dari satu sisi ruangan ke sisi lain agar tidak ada bagian yang terlewat. Perhatikan perubahan warna lantai, benda yang lembap, serta sudut yang tertutup. Ketelitian membuat hasil bersih lebih menyeluruh.",
      points: [
        "Periksa sudut dan tepi ruangan.",
        "Bersihkan bawah benda yang aman dipindahkan.",
        "Gunakan cahaya untuk melihat noda samar.",
      ],
    },
    {
      intro:
        "Membersihkan akan lebih ringan bila dilakukan dengan urutan yang tepat. Ruangan yang rapi juga lebih aman karena jalan tidak tertutup barang atau sampah.",
      detail:
        "Rapikan barang terlebih dahulu, buang sampah, lalu bersihkan debu pada permukaan. Terakhir, bersihkan lantai dari area paling jauh menuju pintu. Urutan ini mencegah area yang sudah bersih menjadi kotor kembali.",
      points: [
        "Rapikan sebelum menyapu atau mengepel.",
        "Bersihkan dari atas ke bawah.",
        "Akhiri dari sudut terjauh menuju pintu.",
      ],
    },
    {
      intro:
        "Kebersihan yang bertahan lama berasal dari kebiasaan kecil yang dilakukan bersama. Setiap orang di rumah dapat membantu sesuai kemampuannya.",
      detail:
        "Buat jadwal sederhana, misalnya membuang sampah setiap hari, memeriksa genangan air, dan merapikan barang setelah digunakan. Saat semua orang ikut menjaga, rumah menjadi lebih sehat, nyaman, dan menyenangkan untuk keluarga.",
      points: [
        "Kembalikan barang ke tempatnya.",
        "Jangan menunda membuang sampah.",
        "Saling mengingatkan dengan baik.",
      ],
    },
  ]);

  game.ANDI_THOUGHTS = Object.freeze({
    1: "Aku harus membersihkan tempat ini... Ibu membutuhkan obat itu.",
    2: "Rumah yang kotor seperti ini pasti membuat Ibu semakin tidak nyaman.",
    3: "Aku harus lebih teliti. Setiap noda yang kutemukan membawaku lebih dekat kepada obat Ibu.",
    4: "Aku sudah sejauh ini. Aku harus terus maju demi Ibu.",
    5: "Obat terakhir... setelah ini aku bisa kembali kepada Ibu.",
  });

  game.ENDING_MONTAGE_CAPTIONS = [
    "Perjalanan Andi dimulai hanya dengan satu keinginan: melihat Ibunya kembali sehat.",
    "Namun setiap ujian mengajarkannya bahwa pekerjaan kecil membutuhkan perhatian, kesabaran, dan ketekunan.",
    "Setiap langkah membawanya semakin dekat kepada orang yang paling ia sayangi.",
  ];

  game.ENDING_WITCH_LINES = [
    {
      name: "Penyihir",
      who: "witch",
      text: "Kau akhirnya menyelesaikan kelima ujian.",
    },
    {
      name: "Andi",
      who: "andi",
      p: "relieved",
      text: "Semua ini kulakukan agar Ibu bisa sehat lagi.",
    },
    {
      name: "Penyihir",
      who: "witch",
      text: "Kasih sayangmu membuatmu bertahan. Lima ramuan itu kini membawa harapanmu pulang.",
    },
    {
      name: "Penyihir",
      who: "witch",
      text: "Pulanglah, Andi. Ada seseorang yang menunggumu.",
    },
    { name: "Andi", who: "andi", p: "happy", text: "Terima kasih." },
  ];

  game.ENDING_LUMI_LINES = [
    { name: "Andi", who: "andi", p: "happy", text: "Ayo, Lumi. Kita pulang." },
    { name: "Lumi", text: "Andi... sepertinya aku tidak ikut." },
    { name: "Andi", who: "andi", p: "surprised", text: "Kenapa?" },
    { name: "Lumi", text: "Tugasku sudah selesai. Ibumu menunggumu pulang." },
    {
      name: "Andi",
      who: "andi",
      p: "sad",
      text: "Tapi aku masih membutuhkanmu.",
    },
    { name: "Lumi", text: "Kepedulian dan ketekunan itu sudah ada di dalam dirimu." },
    { name: "Andi", who: "andi", p: "emotional", text: "Lumi!" },
    {
      name: "Narator",
      who: "narrator",
      text: "Andi pulang membawa lima ramuan dan satu harapan: memeluk Ibu dalam keadaan sehat.",
    },
  ];

  game.openingLines = [
    [
      {
        name: "Narator",
        who: "narrator",
        text: "Rumah Andi dulu selalu hangat oleh senyum Ibu.",
      },
      {
        name: "Narator",
        who: "narrator",
        text: "Saat Ibu jatuh sakit, rumah pun perlahan tidak terawat.",
      },
      {
        name: "Narator",
        who: "narrator",
        text: "Andi sadar: rumah yang bersih akan membantu Ibu beristirahat dan pulih.",
      },
    ],
    [
      {
        name: "Narator",
        who: "narrator",
        text: "Hari demi hari, tubuh Ibu semakin lemah. Andi takut kehilangan senyumnya.",
      },
    ],
    [
      {
        name: "Andi",
        who: "andi",
        p: "worried",
        text: "Tabib, apakah Ibu bisa disembuhkan?",
      },
      {
        name: "Tabib",
        who: "tabib",
        text: "Aku sudah melakukan apa yang kubisa.",
      },
      {
        name: "Andi",
        who: "andi",
        p: "surprised",
        text: "Tidak ada cara lain?",
      },
      {
        name: "Tabib",
        who: "tabib",
        text: "Ada seorang penyihir tua di ujung hutan yang mungkin dapat membantumu.",
      },
      {
        name: "Tabib",
        who: "tabib",
        text: "Tanyakan jalannya kepada warga desa.",
      },
      {
        name: "Andi",
        who: "andi",
        p: "determined",
        text: "Aku akan mencarinya.",
      },
    ],
  ];

  game.motherBedLines = [
    {
      name: "Narator",
      who: "narrator",
      text: "Ibu semakin lemah, tetapi tetap berusaha tersenyum untuk Andi.",
    },
    { name: "Ibu", who: "mother", text: "Andi... jangan takut. Ibu percaya kepadamu." },
  ];

  game.andiMotherLines = [
    {
      name: "Andi",
      who: "andi",
      p: "worried",
      text: "Bu... bagaimana perasaan Ibu?",
    },
    { name: "Ibu", who: "mother", text: "Pergilah jika itu memberi kita harapan. Jaga dirimu, Nak." },
    {
      name: "Andi",
      who: "andi",
      p: "determined",
      text: "Aku akan pulang membawa obat untuk Ibu. Aku janji.",
    },
    {
      name: "Narator",
      who: "narrator",
      text: "Dengan janji itu, Andi memulai perjalanan demi orang yang paling ia sayangi.",
    },
  ];
})(window.ForMotherRuntime);
