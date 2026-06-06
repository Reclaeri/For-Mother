const ASSETS = {
  background: {
    menu: "assets/background/menu/bg_main_menu_hospital_corridor.png",
    hospitalRoom: "assets/background/menu/bg_hospital_room.png",
    hospitalCorridor: "assets/background/menu/bg_hospital_corridor.png",
    endingHospital: "assets/background/menu/bg_ending_hospital_warm.png",
    witchHouse: "assets/background/rumah penyihir/bg_witch_house_topdown.png",
    portal: "assets/background/rumah penyihir/portal_topdown.png",
    chapters: {
      1: "assets/background/chapter background/bg_chapter_1_trash_room_topdown.png",
      2: "assets/background/chapter background/bg_chapter_2_dust_room_topdown.png",
      3: "assets/background/chapter background/bg_chapter_3_water_room_topdown.png",
      4: "assets/background/chapter background/bg_chapter_4_messy_room_topdown.png",
      5: "assets/background/chapter background/bg_chapter_5_final_room_topdown.png"
    }
  },
  andi: {
    idle_down: "assets/character/andi/andi_idle_down.png",
    idle_left: "assets/character/andi/andi_idle_left.png",
    idle_right: "assets/character/andi/andi_idle_right.png",
    idle_up: "assets/character/andi/andi_idle_up.png",
    walk_down: "assets/character/andi/andi_walk_down.png",
    walk_left: "assets/character/andi/andi_walk_left.png",
    walk_right: "assets/character/andi/andi_walk_right.png",
    walk_up: "assets/character/andi/andi_walk_up.png",
    interact_down: "assets/character/andi/andi_interact_down.png",
    interact_left: "assets/character/andi/andi_interact_left.png",
    interact_right: "assets/character/andi/andi_interact_right.png",
    interact_up: "assets/character/andi/andi_interact_up.png",
    neutral: "assets/character/andi/andi_expr_neutral.png",
    sad: "assets/character/andi/andi_expr_sad.png",
    worried: "assets/character/andi/andi_expr_worried.png",
    determined: "assets/character/andi/andi_expr_determined.png",
    tired: "assets/character/andi/andi_expr_tired.png",
    surprised: "assets/character/andi/andi_expr_surprised.png",
    relieved: "assets/character/andi/andi_expr_relieved.png",
    happy: "assets/character/andi/andi_expr_happy.png",
    emotional: "assets/character/andi/andi_expr_emotional.png",
    fullbody: "assets/character/andi/andi_fullbody_standing.png",
    holdingMedicine: "assets/character/andi/andi_holding_medicine.png",
    endingHappy: "assets/character/andi/andi_ending_happy_pose.png"
  },
  characters: {
    doctorPortrait: "assets/character/doctor/doctor_portrait_expression_sheet.png",
    doctorFullbody: "assets/character/doctor/doctor_fullbody.png",
    witchPortrait: "assets/character/witch/witch_portrait_expression_sheet.png",
    witchFullbody: "assets/character/witch/witch_fullbody.png",
    witchTopdown: "assets/character/witch/witch_topdown_npc.png",
    mother: "assets/character/mother/mother_character_base.png"
  },
  cutscenes: {
    opening: [
      "assets/cutscenes/opening/cutscene_mother_unconscious_opening.png",
      "assets/cutscenes/opening/cutscene_andi_beside_mother.png",
      "assets/cutscenes/opening/cutscene_andi_talk_doctor.png",
      "assets/background/menu/bg_hospital_corridor.png",
      "assets/cutscenes/opening/cutscene_andi_go_to_witch_house.png",
      "assets/cutscenes/opening/cutscene_andi_meet_witch.png",
      "assets/cutscenes/opening/cutscene_witch_give_mission.png",
      "assets/cutscenes/opening/cutscene_witch_open_portal.png",
      "assets/cutscenes/opening/cutscene_andi_receive_medicine.png"
    ],
    mother: {
      1: "assets/cutscenes/progres ibu/cutscene_mother_progress_1_unconscious.png",
      2: "assets/cutscenes/progres ibu/cutscene_mother_progress_2_waking_up.png",
      3: "assets/cutscenes/progres ibu/cutscene_mother_progress_3_small_response.png",
      4: "assets/cutscenes/progres ibu/cutscene_mother_progress_4_sitting.png",
      5: "assets/cutscenes/progres ibu/cutscene_mother_progress_5_recovered.png"
    },
    ending: "assets/cutscenes/ending/cutscene_ending_mother_and_andi.png",
    finalMessage: "assets/cutscenes/ending/final_message_panel.png"
  },
  ui: {
    logo: "assets/ui/logo_for_mother.png"
  },
  medicines: [
    "assets/medicines/medicine_01_awareness.png",
    "assets/medicines/medicine_02_voice.png",
    "assets/medicines/medicine_03_strength.png",
    "assets/medicines/medicine_04_warmth.png",
    "assets/medicines/medicine_05_recovery.png"
  ],
  medicineEmpty: "assets/medicines/medicine_slot_empty.png",
  edu: {
    trash: "assets/edu icons/edu_icon_trash.png",
    dust: "assets/edu icons/edu_icon_dust.png",
    water: "assets/edu icons/edu_icon_water.png",
    tidy: "assets/edu icons/edu_icon_tidy.png",
    health: "assets/edu icons/edu_icon_health.png"
  },
  mini: {
    trash: {
      binOrganic: "assets/mini game/trash/bin_organic.png",
      binNonorganic: "assets/mini game/trash/bin_nonorganic.png",
      banana: "assets/mini game/trash/trash_banana_peel.png",
      can: "assets/mini game/trash/trash_can.png",
      food: "assets/mini game/trash/trash_food_waste.png",
      paper: "assets/mini game/trash/trash_paper.png",
      plasticBag: "assets/mini game/trash/trash_plastic_bag.png",
      bottle: "assets/mini game/trash/trash_plastic_bottle.png"
    },
    dust: {
      cursor: "assets/mini game/dust/cursor_cloth.png",
      shelfClean: "assets/mini game/dust/dust_shelf_clean.png",
      shelfOverlay: "assets/mini game/dust/dust_shelf_overlay.png",
      tableClean: "assets/mini game/dust/dust_table_clean.png",
      tableOverlay: "assets/mini game/dust/dust_table_overlay.png",
      windowClean: "assets/mini game/dust/dust_window_clean.png",
      windowOverlay: "assets/mini game/dust/dust_window_overlay.png"
    },
    water: {
      cursor: "assets/mini game/water/cursor_mop.png",
      dry: "assets/mini game/water/dry_floor_patch.png.png",
      mosquito: "assets/mini game/water/mosquito_small.png",
      bucketClosed: "assets/mini game/water/water_bucket_closed.png",
      bucketOpen: "assets/mini game/water/water_bucket_open.png",
      large: "assets/mini game/water/water_puddle_large.png",
      medium: "assets/mini game/water/water_puddle_medium.png",
      small: "assets/mini game/water/water_puddle_small.png"
    },
    messy: {
      messBooks: "assets/mini game/messy/mess_books.png",
      messBox: "assets/mini game/messy/mess_box.png",
      messPillow: "assets/mini game/messy/mess_pillow.png",
      messToys: "assets/mini game/messy/mess_toys.png",
      neatBooks: "assets/mini game/messy/neat_books.png",
      neatBox: "assets/mini game/messy/neat_box.png",
      neatPillow: "assets/mini game/messy/neat_pillow.png",
      neatToys: "assets/mini game/messy/neat_toys.png"
    },
    final: {
      cleanAura: "assets/mini game/final/clean_aura.png",
      cleanPatch: "assets/mini game/final/clean_stain_patch.png",
      dirtyAura: "assets/mini game/final/dirty_aura.png",
      germ: "assets/mini game/final/germ_shadow.png",
      dark: "assets/mini game/final/stain_dark.png",
      drink: "assets/mini game/final/stain_drink.png",
      mud: "assets/mini game/final/stain_mud.png"
    }
  }
};

const CHAPTERS = {
  1: { name: "Chapter 1: Sampah", time: 120, edu: "trash", med: 0, mother: 2 },
  2: { name: "Chapter 2: Debu", time: 100, edu: "dust", med: 1, mother: 3 },
  3: { name: "Chapter 3: Genangan Air dan DBD", time: 80, edu: "water", med: 2, mother: 4 },
  4: { name: "Chapter 4: Ruangan Berantakan", time: 70, edu: "tidy", med: 3, mother: 5 },
  5: { name: "Chapter 5: Ruang Final", time: 60, edu: "health", med: 4, mother: 5 }
};

const EDU = {
  trash: ["Sampah dan Kesehatan", "Sampah yang dibiarkan menumpuk dapat menjadi sarang kuman dan menyebabkan penyakit. Buanglah sampah pada tempatnya dan pisahkan sesuai jenisnya.", ASSETS.edu.trash],
  dust: ["Debu dan Pernapasan", "Debu dapat mengganggu pernapasan dan membuat ruangan terasa tidak sehat. Membersihkan debu secara rutin membantu menjaga udara tetap bersih.", ASSETS.edu.dust],
  water: ["Genangan Air dan Nyamuk", "Air yang menggenang dapat menjadi tempat berkembang biak nyamuk. Keringkan genangan dan tutup wadah air untuk mencegah penyakit seperti DBD.", ASSETS.edu.water],
  tidy: ["Kerapian dan Keselamatan", "Barang yang berserakan dapat membuat orang tersandung atau terluka. Ruangan yang rapi membuat rumah lebih aman dan nyaman.", ASSETS.edu.tidy],
  health: ["Rumah Bersih, Keluarga Sehat", "Menjaga kebersihan rumah membantu melindungi keluarga dari kuman, debu, nyamuk, dan kecelakaan kecil.", ASSETS.edu.health]
};

function openingDialogue() {
  return [
    { art: ASSETS.cutscenes.opening[0], speaker: "Narator", text: "Malam itu, ruang rumah sakit terasa sangat sunyi." },
    { speaker: "Andi", text: "Ibu... kenapa Ibu belum bangun juga?", portrait: ASSETS.andi.sad, side: "left" },
    { speaker: "Andi", text: "Aku takut... tapi aku harus tetap kuat.", portrait: ASSETS.andi.worried, side: "left" },
    { art: ASSETS.cutscenes.opening[1], speaker: "Andi", text: "Ibu selalu menjaga rumah dan menjagaku. Sekarang giliranku menjaga Ibu.", portrait: ASSETS.andi.sad, side: "left" },
    { speaker: "Ibu", text: "Andi...", portrait: ASSETS.characters.mother, side: "right" },
    { speaker: "Andi", text: "Ibu? Ibu bisa dengar aku?", portrait: ASSETS.andi.surprised, side: "left" },
    { speaker: "Narator", text: "Ibu belum benar-benar sadar. Namun suara kecil itu membuat Andi yakin masih ada harapan." },
    { art: ASSETS.cutscenes.opening[2], speaker: "Dokter", text: "Andi, kondisi ibumu sangat lemah.", portrait: ASSETS.characters.doctorPortrait, side: "right" },
    { speaker: "Andi", text: "Apa Ibu bisa sembuh, Dok?", portrait: ASSETS.andi.worried, side: "left" },
    { speaker: "Dokter", text: "Kami sudah berusaha, tetapi tubuhnya membutuhkan pemulihan yang tidak biasa.", portrait: ASSETS.characters.doctorPortrait, side: "right" },
    { speaker: "Andi", text: "Tidak biasa? Maksud Dokter apa?", portrait: ASSETS.andi.sad, side: "left" },
    { speaker: "Dokter", text: "Ada cerita lama tentang penyihir bijak. Ia memahami hubungan antara kebersihan, kesehatan, dan kekuatan hidup.", portrait: ASSETS.characters.doctorPortrait, side: "right" },
    { speaker: "Andi", text: "Kalau itu bisa menyelamatkan Ibu, aku akan mencarinya.", portrait: ASSETS.andi.determined, side: "left" },
    { speaker: "Dokter", text: "Hati-hati, Andi. Jalan itu tidak mudah. Tapi tekadmu bisa menjadi kekuatan besar.", portrait: ASSETS.characters.doctorPortrait, side: "right" },
    { art: ASSETS.cutscenes.opening[4], speaker: "Andi", text: "Aku tidak boleh terlambat. Ibu menungguku.", portrait: ASSETS.andi.determined, side: "left" },
    { speaker: "Narator", text: "Andi berjalan menuju rumah tua di tengah hutan." },
    { art: ASSETS.cutscenes.opening[5], speaker: "Penyihir", text: "Kau datang dengan hati yang berat, Nak.", portrait: ASSETS.characters.witchPortrait, side: "right" },
    { speaker: "Andi", text: "Kamu tahu kenapa aku datang?", portrait: ASSETS.andi.surprised, side: "left" },
    { speaker: "Penyihir", text: "Aku melihat rasa sayangmu kepada ibumu. Tapi obat yang kau cari tidak bisa didapat dengan mudah.", portrait: ASSETS.characters.witchPortrait, side: "right" },
    { speaker: "Andi", text: "Aku siap melakukan apa saja.", portrait: ASSETS.andi.determined, side: "left" },
    { speaker: "Penyihir", text: "Bukan kekuatan besar yang kubutuhkan darimu. Aku membutuhkan ketekunan.", portrait: ASSETS.characters.witchPortrait, side: "right" },
    { art: ASSETS.cutscenes.opening[6], speaker: "Penyihir", text: "Ada lima ruangan ajaib yang dipenuhi kotoran, debu, genangan, dan kekacauan.", portrait: ASSETS.characters.witchPortrait, side: "right" },
    { speaker: "Andi", text: "Apa hubungannya membersihkan ruangan dengan menyembuhkan Ibu?", portrait: ASSETS.andi.worried, side: "left" },
    { speaker: "Penyihir", text: "Rumah yang kotor menyimpan kuman. Debu mengganggu napas. Air menggenang memanggil nyamuk. Barang berserakan membawa bahaya.", portrait: ASSETS.characters.witchPortrait, side: "right" },
    { speaker: "Andi", text: "Jadi kebersihan bisa menjaga kesehatan keluarga?", portrait: ASSETS.andi.worried, side: "left" },
    { speaker: "Penyihir", text: "Tepat. Setiap ruangan yang kau bersihkan akan memberimu satu obat.", portrait: ASSETS.characters.witchPortrait, side: "right" },
    { speaker: "Andi", text: "Aku akan membersihkan semuanya.", portrait: ASSETS.andi.determined, side: "left" },
    { art: ASSETS.cutscenes.opening[7], speaker: "Penyihir", text: "Masuklah ke portal ini. Waktu akan berjalan cepat di setiap ruangan.", portrait: ASSETS.characters.witchPortrait, side: "right" },
    { speaker: "Andi", text: "Berapa banyak waktu yang kupunya?", portrait: ASSETS.andi.neutral, side: "left" },
    { speaker: "Penyihir", text: "Tidak banyak. Tapi cukup untuk orang yang fokus dan tidak menyerah.", portrait: ASSETS.characters.witchPortrait, side: "right" },
    { art: ASSETS.cutscenes.opening[8], speaker: "Penyihir", text: "Ini hanyalah contoh cahaya obatnya. Obat yang sebenarnya harus kau dapatkan dari ruangan ajaib.", portrait: ASSETS.characters.witchPortrait, side: "right" },
    { speaker: "Andi", text: "Ibu... tunggu aku. Aku akan pulang membawa semuanya.", portrait: ASSETS.andi.emotional, side: "left" }
  ];
}

const HUB_DIALOGUES = {
  1: [
    ["Penyihir", "Ruangan pertama menguji kepedulianmu pada sampah."],
    ["Andi", "Aku harus memilah sampah dengan benar, kan?", ASSETS.andi.determined],
    ["Penyihir", "Benar. Sampah organik dan non-organik tidak boleh dicampur."]
  ],
  2: [
    ["Penyihir", "Ruangan berikutnya dipenuhi debu."],
    ["Andi", "Debu terlihat kecil, tapi bisa mengganggu napas.", ASSETS.andi.worried],
    ["Penyihir", "Kau mulai memahami maknanya."]
  ],
  3: [
    ["Penyihir", "Kali ini, perhatikan air yang menggenang."],
    ["Andi", "Karena genangan bisa menjadi tempat nyamuk berkembang.", ASSETS.andi.determined],
    ["Penyihir", "Tepat sekali."]
  ],
  4: [
    ["Penyihir", "Ruangan berantakan bisa terlihat sepele."],
    ["Andi", "Tapi bisa membuat orang tersandung atau terluka.", ASSETS.andi.neutral],
    ["Penyihir", "Kebersihan dan kerapian selalu berjalan bersama."]
  ],
  5: [
    ["Penyihir", "Ini ruangan terakhir. Semua pelajaranmu akan diuji."],
    ["Andi", "Aku sudah sampai sejauh ini. Aku tidak akan menyerah.", ASSETS.andi.determined]
  ],
  done: [
    ["Penyihir", "Kau telah mengumpulkan lima obat."],
    ["Andi", "Berarti Ibu bisa sembuh?", ASSETS.andi.emotional],
    ["Penyihir", "Pergilah. Ia menunggumu."]
  ]
};

const MISSIONS = {
  1: [
    { x: 250, y: 430, radius: 105, id: "banana", src: ASSETS.mini.trash.banana, type: "organic", title: "Kulit Pisang" },
    { x: 420, y: 320, radius: 105, id: "food", src: ASSETS.mini.trash.food, type: "organic", title: "Sisa Makanan" },
    { x: 610, y: 455, radius: 105, id: "bottle", src: ASSETS.mini.trash.bottle, type: "nonorganic", title: "Botol Plastik" },
    { x: 785, y: 335, radius: 105, id: "can", src: ASSETS.mini.trash.can, type: "nonorganic", title: "Kaleng" },
    { x: 955, y: 480, radius: 105, id: "paper", src: ASSETS.mini.trash.paper, type: "nonorganic", title: "Kertas" },
    { x: 1080, y: 325, radius: 105, id: "bag", src: ASSETS.mini.trash.plasticBag, type: "nonorganic", title: "Kantong Plastik" }
  ],
  2: [
    { x: 345, y: 420, radius: 115, id: "table", clean: ASSETS.mini.dust.tableClean, overlay: ASSETS.mini.dust.tableOverlay, src: ASSETS.mini.dust.tableOverlay, title: "Meja Berdebu", w: 560, h: 390 },
    { x: 640, y: 325, radius: 115, id: "window", clean: ASSETS.mini.dust.windowClean, overlay: ASSETS.mini.dust.windowOverlay, src: ASSETS.mini.dust.windowOverlay, title: "Jendela Berdebu", w: 510, h: 510 },
    { x: 960, y: 390, radius: 115, id: "shelf", clean: ASSETS.mini.dust.shelfClean, overlay: ASSETS.mini.dust.shelfOverlay, src: ASSETS.mini.dust.shelfOverlay, title: "Lemari Berdebu", w: 540, h: 540 },
    { x: 500, y: 555, radius: 105, id: "drawer", clean: ASSETS.mini.dust.tableClean, overlay: ASSETS.mini.dust.tableOverlay, src: ASSETS.mini.dust.tableOverlay, title: "Laci Berdebu", w: 560, h: 390, propWidth: 155 },
    { x: 805, y: 525, radius: 105, id: "small-shelf", clean: ASSETS.mini.dust.shelfClean, overlay: ASSETS.mini.dust.shelfOverlay, src: ASSETS.mini.dust.shelfOverlay, title: "Rak Kecil Berdebu", w: 540, h: 540, propWidth: 155 }
  ],
  3: [
    { x: 285, y: 460, radius: 110, id: "small", clean: ASSETS.mini.water.dry, overlay: ASSETS.mini.water.small, src: ASSETS.mini.water.small, title: "Genangan Kecil", w: 300, h: 210 },
    { x: 595, y: 370, radius: 110, id: "medium", clean: ASSETS.mini.water.dry, overlay: ASSETS.mini.water.medium, src: ASSETS.mini.water.medium, title: "Genangan Sedang", w: 390, h: 265 },
    { x: 890, y: 475, radius: 115, id: "large", clean: ASSETS.mini.water.dry, overlay: ASSETS.mini.water.large, src: ASSETS.mini.water.large, title: "Genangan Besar", w: 500, h: 305 },
    { x: 1010, y: 300, radius: 105, id: "bucket", src: ASSETS.mini.water.bucketOpen, title: "Ember Terbuka" },
    { x: 430, y: 560, radius: 105, id: "corner-small", clean: ASSETS.mini.water.dry, overlay: ASSETS.mini.water.small, src: ASSETS.mini.water.small, title: "Genangan Sudut", w: 300, h: 210 },
    { x: 760, y: 575, radius: 105, id: "door-medium", clean: ASSETS.mini.water.dry, overlay: ASSETS.mini.water.medium, src: ASSETS.mini.water.medium, title: "Genangan Dekat Pintu", w: 390, h: 265 }
  ],
  4: [
    { x: 285, y: 365, radius: 110, id: "books", src: ASSETS.mini.messy.messBooks, neat: ASSETS.mini.messy.neatBooks, type: "books", target: "Rak Buku", title: "Buku Berantakan" },
    { x: 545, y: 500, radius: 110, id: "toys", src: ASSETS.mini.messy.messToys, neat: ASSETS.mini.messy.neatToys, type: "toys", target: "Kotak Mainan", title: "Mainan Berantakan" },
    { x: 805, y: 365, radius: 110, id: "pillow", src: ASSETS.mini.messy.messPillow, neat: ASSETS.mini.messy.neatPillow, type: "pillow", target: "Sofa", title: "Bantal Jatuh" },
    { x: 1010, y: 500, radius: 110, id: "box", src: ASSETS.mini.messy.messBox, neat: ASSETS.mini.messy.neatBox, type: "box", target: "Area Penyimpanan", title: "Kotak Berantakan" }
  ],
  5: [
    { x: 520, y: 222, radius: 95, id: "final-table-dust", kind: "dust", clean: ASSETS.mini.dust.tableClean, overlay: ASSETS.mini.dust.tableOverlay, src: ASSETS.mini.dust.tableOverlay, title: "Meja Berdebu", w: 560, h: 390, propWidth: 150 },
    { x: 642, y: 132, radius: 96, id: "final-window-dust", kind: "dust", clean: ASSETS.mini.dust.windowClean, overlay: ASSETS.mini.dust.windowOverlay, src: ASSETS.mini.dust.windowOverlay, title: "Jendela Berdebu", w: 510, h: 510, propWidth: 150 },
    { x: 1094, y: 468, radius: 95, id: "final-water-small", kind: "water", clean: ASSETS.mini.water.dry, overlay: ASSETS.mini.water.small, src: ASSETS.mini.water.small, title: "Genangan Dekat Ember", w: 300, h: 210 },
    { x: 1118, y: 430, radius: 95, id: "final-bucket", kind: "water", src: ASSETS.mini.water.bucketOpen, title: "Ember Terbuka" },
    { x: 160, y: 642, radius: 92, id: "final-banana", kind: "trash", src: ASSETS.mini.trash.banana, type: "organic", title: "Kulit Pisang" },
    { x: 1048, y: 626, radius: 92, id: "final-bottle", kind: "trash", src: ASSETS.mini.trash.bottle, type: "nonorganic", title: "Botol Plastik" },
    { x: 646, y: 442, radius: 95, id: "mud", kind: "final", clean: ASSETS.mini.final.cleanPatch, overlay: ASSETS.mini.final.mud, src: ASSETS.mini.final.mud, title: "Noda Lumpur", w: 360, h: 300 },
    { x: 305, y: 450, radius: 95, id: "drink", kind: "final", clean: ASSETS.mini.final.cleanPatch, overlay: ASSETS.mini.final.drink, src: ASSETS.mini.final.drink, title: "Noda Minuman", w: 360, h: 300 },
    { x: 1000, y: 260, radius: 95, id: "dark", kind: "final", clean: ASSETS.mini.final.cleanPatch, overlay: ASSETS.mini.final.dark, src: ASSETS.mini.final.dark, title: "Noda Gelap", w: 360, h: 300 }
  ]
};

const COLLISION = {
  hub: {
    bounds: { minX: 120, maxX: 1160, minY: 150, maxY: 650 },
    obstacles: [
      { x: 570, y: 210, w: 170, h: 190 },
      { x: 860, y: 270, w: 125, h: 165 }
    ]
  },
  1: {
    bounds: { minX: 120, maxX: 1160, minY: 165, maxY: 650 },
    obstacles: [
      { x: 165, y: 180, w: 520, h: 85 },
      { x: 1100, y: 165, w: 55, h: 235 }
    ]
  },
  2: {
    bounds: { minX: 125, maxX: 1155, minY: 165, maxY: 650 },
    obstacles: [
      { x: 155, y: 520, w: 260, h: 125 },
      { x: 125, y: 185, w: 145, h: 210 },
      { x: 1015, y: 235, w: 135, h: 260 },
      { x: 925, y: 530, w: 230, h: 110 }
    ]
  },
  3: {
    bounds: { minX: 125, maxX: 1155, minY: 165, maxY: 650 },
    obstacles: [
      { x: 135, y: 190, w: 250, h: 205 }
    ]
  },
  4: {
    bounds: { minX: 125, maxX: 1155, minY: 165, maxY: 650 },
    obstacles: [
      { x: 125, y: 170, w: 245, h: 125 },
      { x: 880, y: 170, w: 260, h: 170 },
      { x: 120, y: 430, w: 185, h: 95 },
      { x: 1030, y: 520, w: 110, h: 95 }
    ]
  },
  5: {
    bounds: { minX: 125, maxX: 1155, minY: 165, maxY: 650 },
    obstacles: [
      { x: 155, y: 485, w: 265, h: 105 }
    ]
  }
};

function collisionForCurrentScene() {
  if (gameState.scene === "Witch House Hub") return COLLISION.hub;
  if (gameState.scene.includes("Exploration")) return COLLISION[gameState.chapter.number];
  return null;
}

const gameState = {
  scene: "Main Menu",
  currentChapter: 1,
  completedChapters: [],
  medicinesOwned: [],
  totalCleaningPoints: 0,
  totalEducationPoints: 0,
  openingSeen: false,
  player: { x: 640, y: 500, dir: "down", moving: false, interacting: false },
  chapter: null,
  witchTalked: false,
  dialogOpen: false
};

const game = document.getElementById("game");
const keys = new Set();
const CLEANING_CURSOR_ASSETS = {
  cloth: "assets/mini game/dust/cursor_cloth.png",
  mop: "assets/mini game/water/cursor_mop.png"
};
let sceneEl;
let raf;
let timer;
let dialogNext;
let typingTimer;
let activeTypingBox;
let activeTypingFullText = "";
let activeDialogueArt;
let cleaningCursorEl = null;
let cleaningCursorTarget = null;

const DEFAULT_SETTINGS = {
  musicVolume: 70,
  sfxVolume: 80,
  visualMode: "normal",
  textSize: "normal",
  timerWarning: true
};

function init() {
  loadGame();
  applySettings();
  initCleaningCursor();
  preloadAssets();
  resizeStage();
  addEventListener("resize", resizeStage);
  addEventListener("keydown", onKeyDown);
  addEventListener("keyup", e => keys.delete(e.key.toLowerCase()));
  showMainMenu();
}

function resizeStage() {
  document.documentElement.style.setProperty("--scale", Math.max(innerWidth / 1280, innerHeight / 720));
}

function onKeyDown(e) {
  const key = e.key.toLowerCase();
  keys.add(key);
  if (dialogNext && (key === "enter" || key === " " || key === "e")) {
    e.preventDefault();
    if (finishTypingIfNeeded()) return;
    dialogNext();
    return;
  }
  if (key === "e" && (gameState.scene.includes("Hub") || gameState.scene.includes("Exploration"))) {
    e.preventDefault();
    interact();
  }
}

function saveGame() {
  localStorage.setItem("forMotherSave", JSON.stringify({
    currentChapter: gameState.currentChapter,
    completedChapters: gameState.completedChapters,
    medicinesOwned: gameState.medicinesOwned,
    totalCleaningPoints: gameState.totalCleaningPoints,
    totalEducationPoints: gameState.totalEducationPoints,
    openingSeen: gameState.openingSeen
  }));
}

function loadGame() {
  try {
    const data = JSON.parse(localStorage.getItem("forMotherSave") || "{}");
    Object.assign(gameState, {
      currentChapter: data.currentChapter || 1,
      completedChapters: data.completedChapters || [],
      medicinesOwned: data.medicinesOwned || [],
      totalCleaningPoints: data.totalCleaningPoints || 0,
      totalEducationPoints: data.totalEducationPoints || 0,
      openingSeen: Boolean(data.openingSeen)
    });
  } catch {
    resetGame(false);
  }
}

function resetGame(render = true) {
  localStorage.removeItem("forMotherSave");
  gameState.currentChapter = 1;
  gameState.completedChapters = [];
  gameState.medicinesOwned = [];
  gameState.totalCleaningPoints = 0;
  gameState.totalEducationPoints = 0;
  gameState.openingSeen = false;
  gameState.chapter = null;
  if (render) showMainMenu();
}

function setScene(name, bg) {
  stopAll();
  gameState.scene = name;
  game.innerHTML = "";
  sceneEl = el("section", "scene");
  if (bg) sceneEl.style.backgroundImage = `url("${bg}")`;
  game.append(sceneEl);
  return sceneEl;
}

function stopAll() {
  hideCleaningCursor();
  closeSettingsModal();
  if (raf) cancelAnimationFrame(raf);
  if (timer) clearInterval(timer);
  if (typingTimer) clearInterval(typingTimer);
  raf = null;
  timer = null;
  typingTimer = null;
  activeTypingBox = null;
  activeTypingFullText = "";
  activeDialogueArt = null;
  gameState.dialogOpen = false;
  dialogNext = null;
}

function initCleaningCursor() {
  cleaningCursorEl = document.getElementById("cleaningCursor");
  if (!cleaningCursorEl) {
    cleaningCursorEl = document.createElement("div");
    cleaningCursorEl.id = "cleaningCursor";
    document.body.appendChild(cleaningCursorEl);
  }
}

function showCleaningCursor(type, targetElement) {
  initCleaningCursor();
  const assetPath = CLEANING_CURSOR_ASSETS[type];
  if (!assetPath) return;

  hideCleaningCursor();
  cleaningCursorEl.style.backgroundImage = `url("${assetPath}")`;
  cleaningCursorEl.classList.add("active");
  cleaningCursorTarget = targetElement || sceneEl?.querySelector(".mini") || document.body;
  cleaningCursorTarget.classList.add("cleaning-mode");

  cleaningCursorTarget.addEventListener("pointermove", handleCleaningCursorMove);
  cleaningCursorTarget.addEventListener("pointerdown", handleCleaningCursorDown);
  cleaningCursorTarget.addEventListener("pointerup", handleCleaningCursorUp);
  cleaningCursorTarget.addEventListener("pointercancel", handleCleaningCursorUp);
  cleaningCursorTarget.addEventListener("pointerleave", handleCleaningCursorUp);
}

function hideCleaningCursor() {
  if (!cleaningCursorEl) return;

  cleaningCursorEl.classList.remove("active", "scrubbing");
  cleaningCursorEl.style.backgroundImage = "";

  if (cleaningCursorTarget) {
    cleaningCursorTarget.classList.remove("cleaning-mode");
    cleaningCursorTarget.removeEventListener("pointermove", handleCleaningCursorMove);
    cleaningCursorTarget.removeEventListener("pointerdown", handleCleaningCursorDown);
    cleaningCursorTarget.removeEventListener("pointerup", handleCleaningCursorUp);
    cleaningCursorTarget.removeEventListener("pointercancel", handleCleaningCursorUp);
    cleaningCursorTarget.removeEventListener("pointerleave", handleCleaningCursorUp);
  }

  cleaningCursorTarget = null;
}

function handleCleaningCursorMove(e) {
  if (!cleaningCursorEl) return;
  cleaningCursorEl.style.left = `${e.clientX}px`;
  cleaningCursorEl.style.top = `${e.clientY}px`;
}

function handleCleaningCursorDown(e) {
  if (!cleaningCursorEl) return;
  cleaningCursorEl.classList.add("scrubbing");
  handleCleaningCursorMove(e);
}

function handleCleaningCursorUp() {
  if (!cleaningCursorEl) return;
  cleaningCursorEl.classList.remove("scrubbing");
}

function preloadAssets() {
  const paths = [...document.documentElement.innerHTML.matchAll(/assets\/[^"')]+/g)].map(match => match[0]);
  Object.values(flattenAssets(ASSETS)).forEach(src => paths.push(src));
  [...new Set(paths)].forEach(src => {
    if (typeof src === "string" && src.startsWith("assets/")) {
      const imageAsset = new Image();
      imageAsset.src = src;
    }
  });
}

function flattenAssets(value, output = []) {
  if (typeof value === "string") output.push(value);
  else if (Array.isArray(value)) value.forEach(item => flattenAssets(item, output));
  else if (value && typeof value === "object") Object.values(value).forEach(item => flattenAssets(item, output));
  return output;
}

function showMainMenu() {
  const scene = setScene("Main Menu", ASSETS.background.menu);
  const menu = el("section", "main-menu-screen");
  const overlay = el("div", "menu-overlay");

  const content = el("div", "main-menu-content");
  const logo = img(ASSETS.ui.logo, "For Mother", "main-logo");

  const tagline = el("p", "menu-tagline", "A magical journey of love, courage, and cleanliness.");
  const subtitle = el("p", "menu-subtitle", "Bersihkan ruangan ajaib, kumpulkan obat, dan selamatkan Ibu.");

  const actions = el("div", "menu-buttons");
  const startBtn = btn("Mulai", () => gameState.openingSeen ? showWitchHouse() : showOpening(), "menu-btn primary");
  const howToPlayBtn = btn("Cara Main", showHowTo, "menu-btn");
  const settingBtn = btn("Setting", openSettingsModal, "menu-btn");
  const resetBtn = btn("Reset Progress", () => { resetGame(false); toast("Progress direset."); }, "menu-btn danger");
  startBtn.id = "startBtn";
  howToPlayBtn.id = "howToPlayBtn";
  settingBtn.id = "settingBtn";
  resetBtn.id = "resetBtn";
  actions.append(startBtn, howToPlayBtn, settingBtn, resetBtn);

  content.append(logo, tagline, subtitle, actions);
  menu.append(overlay, content, el("p", "menu-footer", "Kebersihan kecil hari ini, kesehatan besar untuk keluarga."));
  scene.append(menu);
}

function showHowTo() {
  closeModal();
  const shade = el("div", "shade");
  const card = el("div", "modal-card howto-card");
  card.innerHTML = `
    <div class="howto-badge">Panduan Singkat</div>
    <h2>Cara Main</h2>
    <div class="howto-grid">
      <div class="howto-step"><span class="howto-icon">WASD</span><strong>Bergerak</strong><p>Pakai WASD atau tombol panah untuk jalan di ruangan.</p></div>
      <div class="howto-step"><span class="howto-icon">E</span><strong>Interaksi</strong><p>Dekati objek bercahaya, lalu tekan E untuk mulai membersihkan.</p></div>
      <div class="howto-step"><span class="howto-icon">+</span><strong>Bersihkan</strong><p>Seret, gosok, atau klik sesuai jenis minigame yang muncul.</p></div>
      <div class="howto-step"><span class="howto-icon">00</span><strong>Kejar Waktu</strong><p>Selesaikan tiap chapter sebelum timer habis.</p></div>
      <div class="howto-step wide"><span class="howto-icon">5</span><strong>Kumpulkan Obat</strong><p>Dapatkan lima obat ajaib untuk membawa Ibu pulih kembali.</p></div>
    </div>
  `;
  card.append(btn("Mengerti", closeModal));
  shade.append(card);
  game.append(shade);
}

function loadSettings() {
  return {
    musicVolume: Number(localStorage.getItem("forMotherSettingMusicVolume") ?? DEFAULT_SETTINGS.musicVolume),
    sfxVolume: Number(localStorage.getItem("forMotherSettingSfxVolume") ?? DEFAULT_SETTINGS.sfxVolume),
    visualMode: localStorage.getItem("forMotherSettingVisualMode") || DEFAULT_SETTINGS.visualMode,
    textSize: localStorage.getItem("forMotherSettingTextSize") || DEFAULT_SETTINGS.textSize,
    timerWarning: localStorage.getItem("forMotherSettingTimerWarning") === null
      ? DEFAULT_SETTINGS.timerWarning
      : localStorage.getItem("forMotherSettingTimerWarning") === "true"
  };
}

function saveSettings(settings) {
  localStorage.setItem("forMotherSettingMusicVolume", String(settings.musicVolume));
  localStorage.setItem("forMotherSettingSfxVolume", String(settings.sfxVolume));
  localStorage.setItem("forMotherSettingVisualMode", settings.visualMode);
  localStorage.setItem("forMotherSettingTextSize", settings.textSize);
  localStorage.setItem("forMotherSettingTimerWarning", String(settings.timerWarning));
}

function applySettings(settings = loadSettings()) {
  document.body.classList.toggle("visual-cozy", settings.visualMode === "cozy");
  document.body.classList.toggle("text-large", settings.textSize === "large");
  window.forMotherSettings = settings;
}

function openSettingsModal() {
  let modal = document.getElementById("settingsModal");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "settingsModal";
    modal.className = "settings-modal-backdrop";
    modal.innerHTML = `
      <div class="settings-card">
        <div class="settings-header">
          <div>
            <p class="settings-label">Pengaturan</p>
            <h2>Setting Game</h2>
          </div>
          <button class="settings-close" id="settingsCloseBtn" aria-label="Tutup setting">&times;</button>
        </div>

        <div class="settings-row">
          <div>
            <h3>Volume Musik</h3>
            <p>Atur volume musik latar.</p>
          </div>
          <input type="range" id="musicVolumeSlider" min="0" max="100" value="70">
          <span id="musicVolumeValue">70%</span>
        </div>

        <div class="settings-row">
          <div>
            <h3>Volume Efek</h3>
            <p>Atur volume efek suara.</p>
          </div>
          <input type="range" id="sfxVolumeSlider" min="0" max="100" value="80">
          <span id="sfxVolumeValue">80%</span>
        </div>

        <div class="settings-row">
          <div>
            <h3>Mode Tampilan</h3>
            <p>Pilih tampilan normal atau lebih hangat.</p>
          </div>
          <select id="visualModeSelect">
            <option value="normal">Normal</option>
            <option value="cozy">Soft / Cozy</option>
          </select>
        </div>

        <div class="settings-row">
          <div>
            <h3>Teks Dialog</h3>
            <p>Perbesar teks dialog dan modal.</p>
          </div>
          <select id="textSizeSelect">
            <option value="normal">Normal</option>
            <option value="large">Besar</option>
          </select>
        </div>

        <div class="settings-row">
          <div>
            <h3>Timer Warning</h3>
            <p>Efek berkedip saat waktu hampir habis.</p>
          </div>
          <label class="switch">
            <input type="checkbox" id="timerWarningToggle" checked>
            <span class="switch-slider"></span>
          </label>
        </div>

        <p class="settings-note">
          Catatan: Jika musik atau efek suara belum tersedia, pengaturan volume akan disimpan dan diterapkan saat audio ditambahkan.
        </p>

        <div class="settings-actions">
          <button class="settings-btn secondary" id="settingsCancelBtn">Tutup</button>
          <button class="settings-btn" id="settingsSaveBtn">Simpan</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const settings = loadSettings();
  const musicSlider = document.getElementById("musicVolumeSlider");
  const musicValue = document.getElementById("musicVolumeValue");
  const sfxSlider = document.getElementById("sfxVolumeSlider");
  const sfxValue = document.getElementById("sfxVolumeValue");
  const visualMode = document.getElementById("visualModeSelect");
  const textSize = document.getElementById("textSizeSelect");
  const timerWarning = document.getElementById("timerWarningToggle");

  musicSlider.value = settings.musicVolume;
  musicValue.textContent = `${settings.musicVolume}%`;
  sfxSlider.value = settings.sfxVolume;
  sfxValue.textContent = `${settings.sfxVolume}%`;
  visualMode.value = settings.visualMode;
  textSize.value = settings.textSize;
  timerWarning.checked = settings.timerWarning;

  musicSlider.oninput = () => {
    musicValue.textContent = `${musicSlider.value}%`;
  };

  sfxSlider.oninput = () => {
    sfxValue.textContent = `${sfxSlider.value}%`;
  };

  document.getElementById("settingsCloseBtn").onclick = closeSettingsModal;
  document.getElementById("settingsCancelBtn").onclick = closeSettingsModal;
  document.getElementById("settingsSaveBtn").onclick = () => {
    const newSettings = {
      musicVolume: Number(musicSlider.value),
      sfxVolume: Number(sfxSlider.value),
      visualMode: visualMode.value,
      textSize: textSize.value,
      timerWarning: timerWarning.checked
    };

    saveSettings(newSettings);
    applySettings(newSettings);
    closeSettingsModal();
    toast("Setting tersimpan");
  };

  modal.classList.add("active");
}

function closeSettingsModal() {
  const modal = document.getElementById("settingsModal");
  if (modal) modal.classList.remove("active");
}

function showOpening() {
  setScene("Opening Story", ASSETS.cutscenes.opening[0]);
  showDialogue(openingDialogue(), () => {
    gameState.openingSeen = true;
    saveGame();
    showWitchHouse();
  });
}

function showOpeningStory() {
  showOpening();
}

function slideshow(name, slides, done) {
  let i = 0;
  const scene = setScene(name, slides[0].art);
  const art = img(slides[0].art, "", "cutscene");
  const box = dialog(slides[0]);
  scene.append(art, box);
  const next = () => {
    i++;
    if (i >= slides.length) {
      dialogNext = null;
      done();
      return;
    }
    art.src = slides[i].art;
    scene.style.backgroundImage = `url("${slides[i].art}")`;
    box.querySelector(".speaker").textContent = slides[i].speaker;
    updateDialogPortrait(box, slides[i]);
    typeDialogText(box, slides[i].text);
  };
  box.addEventListener("click", () => {
    if (finishTypingIfNeeded()) return;
    next();
  });
  dialogNext = next;
}

function showDialogue(dialogueArray, onComplete) {
  hideCleaningCursor();
  gameState.dialogOpen = true;
  let index = 0;
  const ensureArt = entry => {
    if (!entry.art && !entry.background) return;
    const src = entry.art || entry.background;
    sceneEl.style.backgroundImage = `url("${src}")`;
    if (!activeDialogueArt || !activeDialogueArt.isConnected) {
      activeDialogueArt = img(src, "", "cutscene");
      sceneEl.prepend(activeDialogueArt);
    }
    activeDialogueArt.src = src;
  };
  const current = dialogueArray[index];
  ensureArt(current);
  const box = dialog(current);
  sceneEl.append(box);
  const next = () => {
    if (finishTypingIfNeeded()) return;
    index++;
    if (index >= dialogueArray.length) {
      box.remove();
      dialogNext = null;
      gameState.dialogOpen = false;
      onComplete?.();
      return;
    }
    const entry = dialogueArray[index];
    ensureArt(entry);
    box.querySelector(".speaker").textContent = entry.speaker;
    updateDialogPortrait(box, entry);
    typeDialogText(box, entry.text);
  };
  box.addEventListener("click", next);
  dialogNext = next;
}

function showWitchHouse() {
  const scene = setScene("Witch House Hub", ASSETS.background.witchHouse);
  gameState.chapter = null;
  gameState.witchTalked = false;
  gameState.player = { x: 365, y: 500, dir: "down", moving: false, interacting: false };
  scene.append(img(ASSETS.characters.witchTopdown, "Penyihir", "sprite witch", 650, 320));
  scene.append(img(ASSETS.background.portal, "Portal", "sprite portal", 920, 360));
  const andi = img(ASSETS.andi.idle_down, "Andi", "sprite andi");
  const prompt = el("div", "prompt hidden", "E");
  scene.append(andi, prompt, note("Rumah Penyihir", "Bicaralah dengan penyihir dulu, lalu masuk portal."));
  moveLoop(andi, prompt, [
    { x: 650, y: 330, radius: 105, type: "witch" },
    { x: 920, y: 365, radius: 112, type: "portal" }
  ]);
}

function startChapter(chapterNumber) {
  gameState.currentChapter = chapterNumber;
  gameState.chapter = {
    number: chapterNumber,
    remaining: CHAPTERS[chapterNumber].time,
    max: CHAPTERS[chapterNumber].time,
    timerLabel: "Timer",
    cleaning: 0,
    progress: 0,
    paused: false,
    missionsDone: []
  };
  saveGame();
  setScene(`Chapter ${chapterNumber} Intro`, ASSETS.background.chapters[chapterNumber]);
  showDialogue(chapterIntroDialogue(chapterNumber), () => startExploration(chapterNumber));
}

function startExploration(chapterNumber) {
  const scene = setScene(`Chapter ${chapterNumber} Exploration`, ASSETS.background.chapters[chapterNumber]);
  const returnPlayer = gameState.chapter?.returnPlayer;
  gameState.player = returnPlayer ? { ...returnPlayer, moving: false, interacting: false } : { x: 640, y: 560, dir: "up", moving: false, interacting: false };
  const hud = renderHUD(chapterNumber);
  const andi = img(ASSETS.andi.idle_up, "Andi", "sprite andi");
  const prompt = el("div", "prompt hidden", "E");
  const spots = chapterSpots(chapterNumber);
  scene.append(hud);
  spots.forEach(p => {
    const spot = el("div", "spot");
    spot.style.left = `${p.x}px`;
    spot.style.top = `${p.y}px`;
    const prop = img(p.src || p.overlay, p.title || "Misi", "mission-prop");
    prop.style.left = `${p.x}px`;
    prop.style.top = `${p.y}px`;
    if (p.propWidth) prop.style.width = `${p.propWidth}px`;
    else if (chapterNumber === 2) prop.style.width = "185px";
    else if (chapterNumber === 3 || chapterNumber === 5) prop.style.width = "120px";
    scene.append(spot);
    scene.append(prop);
  });
  scene.append(andi, prompt);
  startTimer();
  moveLoop(andi, prompt, spots);
}

function chapterSpots(n) {
  return MISSIONS[n].map((mission, index) => ({ ...mission, missionIndex: index }))
    .filter(mission => !gameState.chapter?.missionsDone.includes(mission.missionIndex));
}

function moveLoop(andi, prompt, points) {
  function tick() {
    if (!gameState.chapter?.paused && !gameState.dialogOpen) {
      const p = gameState.player;
      let dx = 0, dy = 0;
      if (keys.has("arrowleft") || keys.has("a")) dx--;
      if (keys.has("arrowright") || keys.has("d")) dx++;
      if (keys.has("arrowup") || keys.has("w")) dy--;
      if (keys.has("arrowdown") || keys.has("s")) dy++;
      p.moving = dx || dy;
      if (p.moving) {
        const len = Math.hypot(dx, dy) || 1;
        movePlayer(dx / len * 4.2, dy / len * 4.2);
        p.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up");
      }
      andi.src = andiSprite();
      andi.style.left = `${p.x}px`;
      andi.style.top = `${p.y}px`;
      const near = points.find(point => dist(p, point) < point.radius);
      prompt.classList.toggle("hidden", !near);
      if (near) {
        prompt.style.left = `${near.promptX ?? near.x}px`;
        prompt.style.top = `${near.promptY ?? near.y - 48}px`;
      }
    }
    raf = requestAnimationFrame(tick);
  }
  sceneEl._points = points;
  tick();
}

function movePlayer(dx, dy) {
  const p = gameState.player;
  const collision = collisionForCurrentScene();
  const bounds = collision?.bounds || { minX: 40, maxX: 1240, minY: 82, maxY: 680 };
  const tryX = clamp(p.x + dx, bounds.minX, bounds.maxX);
  if (!pointBlocked(tryX, p.y, collision)) p.x = tryX;
  const tryY = clamp(p.y + dy, bounds.minY, bounds.maxY);
  if (!pointBlocked(p.x, tryY, collision)) p.y = tryY;
}

function pointBlocked(x, y, collision) {
  if (!collision) return false;
  return collision.obstacles.some(rect => x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h);
}

function andiSprite() {
  const mode = gameState.player.interacting ? "interact" : gameState.player.moving ? "walk" : "idle";
  return ASSETS.andi[`${mode}_${gameState.player.dir}`];
}

function interact() {
  const point = sceneEl?._points?.find(p => dist(gameState.player, p) < p.radius);
  if (!point) return;
  gameState.player.interacting = true;
  setTimeout(() => gameState.player.interacting = false, 250);
  if (gameState.scene === "Witch House Hub") {
    if (point.type === "witch") {
      gameState.witchTalked = true;
      showDialogue(hubDialogue(), () => {});
    } else if (gameState.completedChapters.length >= 5) {
      showEnding();
    } else if (!gameState.witchTalked) {
      tempDialog("Penyihir", "Bicaralah denganku dulu sebelum masuk ke portal.");
    } else {
      startChapter(gameState.currentChapter);
    }
  } else if (gameState.scene.includes("Exploration")) {
    gameState.chapter.returnPlayer = {
      x: gameState.player.x,
      y: gameState.player.y,
      dir: gameState.player.dir
    };
    startMinigame(gameState.chapter.number, point.missionIndex);
  }
}

function chapterIntroDialogue(chapterNumber) {
  const data = {
    1: [
      { speaker: "Andi", text: "Ruangan ini penuh sampah. Aku harus memilahnya dengan benar.", portrait: ASSETS.andi.determined, side: "left" },
      { speaker: "Penyihir", text: "Ingat, sampah organik berasal dari sisa makhluk hidup. Non-organik seperti plastik dan kaleng harus dipisahkan.", portrait: ASSETS.characters.witchPortrait, side: "right" }
    ],
    2: [
      { speaker: "Andi", text: "Debunya tebal sekali. Ruangan seperti ini pasti tidak sehat.", portrait: ASSETS.andi.worried, side: "left" },
      { speaker: "Penyihir", text: "Debu bisa mengganggu pernapasan. Bersihkan dengan teliti.", portrait: ASSETS.characters.witchPortrait, side: "right" }
    ],
    3: [
      { speaker: "Andi", text: "Lantainya basah. Ada ember terbuka juga.", portrait: ASSETS.andi.neutral, side: "left" },
      { speaker: "Penyihir", text: "Hati-hati. Genangan air bisa menjadi tempat nyamuk berkembang.", portrait: ASSETS.characters.witchPortrait, side: "right" },
      { speaker: "Andi", text: "Aku harus mengepel lantai dan menutup wadah air.", portrait: ASSETS.andi.determined, side: "left" }
    ],
    4: [
      { speaker: "Andi", text: "Barang-barang berserakan di mana-mana.", portrait: ASSETS.andi.neutral, side: "left" },
      { speaker: "Penyihir", text: "Ruangan yang berantakan bisa membuat orang tersandung atau terluka.", portrait: ASSETS.characters.witchPortrait, side: "right" },
      { speaker: "Andi", text: "Berarti merapikan ruangan juga bagian dari menjaga kesehatan.", portrait: ASSETS.andi.determined, side: "left" }
    ],
    5: [
      { speaker: "Penyihir", text: "Ini ruangan terakhir. Semua pelajaranmu akan diuji.", portrait: ASSETS.characters.witchPortrait, side: "right" },
      { speaker: "Andi", text: "Aku sudah belajar tentang sampah, debu, genangan, dan kerapian.", portrait: ASSETS.andi.determined, side: "left" },
      { speaker: "Penyihir", text: "Bersihkan sampah, debu, air, dan noda yang tersisa. Sekarang buktikan bahwa kau memahami maknanya.", portrait: ASSETS.characters.witchPortrait, side: "right" }
    ]
  };
  return data[chapterNumber];
}

function renderHUD(n) {
  const hud = el("div", "hud");
  hud.innerHTML = `
    <div><span class="label">Chapter</span><span class="value chapter-name">${CHAPTERS[n].name}</span></div>
    <div class="timer"><span class="label timer-label">Timer</span><span class="value time">00:00</span></div>
    <div><span class="label">Poin Bersih</span><span class="value clean">0</span></div>
    <div><span class="label">Poin Edu</span><span class="value edu-points">0</span></div>
    <div><span class="label">Progress</span><div class="bar"><div class="fill"></div></div></div>
    <div class="meds"></div>
  `;
  const pause = el("button", "pause-btn", "II");
  pause.title = "Pause";
  pause.addEventListener("click", pauseGame);
  hud.append(pause);
  return hud;
}

function startTimer() {
  if (timer) clearInterval(timer);
  updateHUD();
  timer = setInterval(() => {
    if (!gameState.chapter || gameState.chapter.paused) return;
    gameState.chapter.remaining--;
    updateHUD();
    if (gameState.chapter.remaining <= 0) failChapter();
  }, 1000);
}

function updateHUD() {
  const hud = sceneEl?.querySelector(".hud");
  if (!hud || !gameState.chapter) return;
  const s = Math.max(0, gameState.chapter.remaining);
  hud.querySelector(".timer-label").textContent = gameState.chapter.timerLabel || "Timer";
  hud.querySelector(".time").textContent = `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  hud.querySelector(".clean").textContent = gameState.chapter.cleaning;
  hud.querySelector(".edu-points").textContent = gameState.totalEducationPoints;
  hud.querySelector(".fill").style.width = `${gameState.chapter.progress}%`;
  const settings = window.forMotherSettings || loadSettings();
  hud.querySelector(".timer").classList.toggle("warn", s <= 30 && settings.timerWarning);
  const meds = hud.querySelector(".meds");
  meds.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    const slot = el("div", "slot");
    slot.style.backgroundImage = `url("${ASSETS.medicineEmpty}")`;
    if (gameState.medicinesOwned.includes(i)) slot.append(img(ASSETS.medicines[i], `Obat ${i + 1}`));
    meds.append(slot);
  }
}

function pauseGame() {
  if (!gameState.chapter) return;
  hideCleaningCursor();
  gameState.chapter.paused = true;
  const shade = el("div", "shade");
  const box = el("div", "pause");
  box.innerHTML = "<h2>Pause</h2><p>Permainan sedang dijeda.</p>";
  const actions = el("div", "actions");
  actions.append(
    btn("Lanjut", () => { gameState.chapter.paused = false; shade.remove(); }),
    btn("Kembali ke Menu", () => {
      saveGame();
      gameState.chapter = null;
      showMainMenu();
    }, "alt")
  );
  box.append(actions);
  shade.append(box);
  sceneEl.append(shade);
}

function failChapter() {
  hideCleaningCursor();
  gameState.chapter.paused = true;
  modal("Waktu habis!", "Chapter gagal. Coba ulangi dan selesaikan sebelum timer habis.", [
    btn("Ulangi Chapter", () => startChapter(gameState.chapter.number)),
    btn("Kembali ke Rumah Penyihir", showWitchHouse, "alt")
  ]);
}

function startMinigame(n, missionIndex) {
  if (raf) cancelAnimationFrame(raf);
  raf = null;
  gameState.scene = `Chapter ${n} Minigame`;
  sceneEl.innerHTML = "";
  sceneEl.append(renderHUD(n));
  updateHUD();
  const area = el("div", "mini");
  area.append(el("div", "mini-title", `${CHAPTERS[n].name} - ${MISSIONS[n][missionIndex].title}`));
  sceneEl.append(area);
  if (n === 1) trashGame(area, missionIndex);
  if (n === 2) dustGame(area, missionIndex);
  if (n === 3) waterGame(area, missionIndex);
  if (n === 4) messyGame(area, missionIndex);
  if (n === 5) finalChapterGame(area, missionIndex);
}

function trashGame(area, missionIndex) {
  const mission = MISSIONS[1][missionIndex];
  trashMissionGame(area, mission, 1, missionIndex);
}

function trashMissionGame(area, mission, chapterNumber, missionIndex) {
  const t = ASSETS.mini.trash;
  const items = [[mission.id, mission.src, mission.type, 430, 280]];
  const targets = [
    makeTarget("organic", t.binOrganic, "Organik", 950, 90),
    makeTarget("nonorganic", t.binNonorganic, "Non-Organik", 950, 310)
  ];
  targets.forEach(tg => area.append(tg.el));
  dragSet(area, items, targets, () => completeMission(chapterNumber, missionIndex));
}

function messyGame(area, missionIndex) {
  const mission = MISSIONS[4][missionIndex];
  const items = [[mission.id, mission.src, mission.type, 370, 280, mission.neat]];
  const targets = [makeTarget(mission.type, "", mission.target, 870, 220)];
  targets.forEach(t => area.append(t.el));
  dragSet(area, items, targets, () => {
    showNeatContinue(area, mission.title, () => completeMission(4, missionIndex));
  }, true);
}

function showNeatContinue(area, title, done) {
  const shade = el("div", "shade");
  const card = el("div", "modal-card");
  card.innerHTML = `<h2>Sudah Rapi</h2><p>${title} sudah dibereskan.</p>`;
  card.append(btn("Lanjut", () => {
    shade.remove();
    done();
  }));
  shade.append(card);
  area.append(shade);
}

function makeTarget(type, src, label, x, y) {
  const box = el("div", "target");
  box.dataset.type = type;
  box.style.left = `${x}px`;
  box.style.top = `${y}px`;
  if (src) box.append(img(src, label));
  box.append(document.createTextNode(label));
  return { type, el: box };
}

function dragSet(area, items, targets, done, showNeat = false) {
  const complete = new Set();
  items.forEach(item => {
    const [id, src, type, x, y, neat] = item;
    const obj = img(src, id, "drag");
    obj.style.left = `${x}px`;
    obj.style.top = `${y}px`;
    obj.dataset.homeX = x;
    obj.dataset.homeY = y;
    area.append(obj);
    attachDrag(obj, area, dropped => {
      const hit = targets.find(t => overlap(dropped.getBoundingClientRect(), t.el.getBoundingClientRect()));
      if (hit && hit.type === type) {
        complete.add(id);
        addClean(10);
        setProgress(complete.size, items.length);
        hit.el.classList.add("good");
        setTimeout(() => hit.el.classList.remove("good"), 450);
        if (showNeat) hit.el.prepend(img(neat, id));
        dropped.remove();
        toast("+10 Bersih!");
        if (complete.size === items.length) done();
      } else {
        addClean(-5);
        toast("Belum tepat. Coba target lain.");
        if (hit) {
          hit.el.classList.add("bad");
          setTimeout(() => hit.el.classList.remove("bad"), 450);
        }
        dropped.style.left = `${dropped.dataset.homeX}px`;
        dropped.style.top = `${dropped.dataset.homeY}px`;
      }
    });
  });
}

function attachDrag(obj, boundsEl, onDrop) {
  let ox = 0, oy = 0;
  obj.addEventListener("pointerdown", e => {
    e.preventDefault();
    obj.setPointerCapture(e.pointerId);
    obj.classList.add("dragging");
    const scale = getScale(boundsEl);
    const r = obj.getBoundingClientRect();
    ox = (e.clientX - r.left) / scale;
    oy = (e.clientY - r.top) / scale;
  });
  obj.addEventListener("pointermove", e => {
    if (!obj.classList.contains("dragging")) return;
    const scale = getScale(boundsEl);
    const b = boundsEl.getBoundingClientRect();
    obj.style.left = `${clamp((e.clientX - b.left) / scale - ox, 8, boundsEl.offsetWidth - obj.offsetWidth - 8)}px`;
    obj.style.top = `${clamp((e.clientY - b.top) / scale - oy, 54, boundsEl.offsetHeight - obj.offsetHeight - 8)}px`;
  });
  obj.addEventListener("pointerup", e => {
    if (!obj.classList.contains("dragging")) return;
    obj.releasePointerCapture(e.pointerId);
    obj.classList.remove("dragging");
    onDrop(obj);
  });
}

function dustGame(area, missionIndex) {
  const mission = MISSIONS[2][missionIndex];
  dustMissionGame(area, mission, 2, missionIndex);
}

function dustMissionGame(area, mission, chapterNumber, missionIndex) {
  area.style.cursor = `url("${ASSETS.mini.dust.cursor}") 12 12, pointer`;
  showCleaningCursor("cloth", area);
  scrubObject(area, [mission.clean, mission.overlay, 420, 135, mission.w, mission.h], missionIndex, new Set(), 1, () => completeMission(chapterNumber, missionIndex), true, area.style.cursor);
}

function waterGame(area, missionIndex) {
  const mission = MISSIONS[3][missionIndex];
  waterMissionGame(area, mission, 3, missionIndex);
}

function waterMissionGame(area, mission, chapterNumber, missionIndex) {
  area.style.cursor = `url("${ASSETS.mini.water.cursor}") 12 12, pointer`;
  const w = ASSETS.mini.water;
  if (!mission.id.includes("bucket")) {
    showCleaningCursor("mop", area);
    scrubObject(area, [mission.clean, mission.overlay, 390, 210, mission.w, mission.h], missionIndex, new Set(), 1, () => completeMission(chapterNumber, missionIndex), true, area.style.cursor);
    return;
  }
  const bucket = img(w.bucketOpen, "Ember terbuka", "bucket");
  bucket.style.left = "500px";
  bucket.style.top = "210px";
  const mosquito = img(w.mosquito, "Nyamuk", "mosquito");
  mosquito.style.left = "670px";
  mosquito.style.top = "190px";
  let closed = false;
  bucket.addEventListener("click", () => {
    if (closed) return;
    closed = true;
    bucket.src = w.bucketClosed;
    mosquito.remove();
    addClean(10);
    toast("Ember tertutup. Nyamuk pergi!");
    completeMission(chapterNumber, missionIndex);
  });
  area.append(bucket, mosquito);
}

function scrubSet(area, objects, done) {
  const completed = new Set();
  objects.forEach((o, i) => scrubObject(area, o, i, completed, objects.length, () => {
    if (completed.size === objects.length) done();
  }, true));
}

function scrubObject(area, obj, index, completed, total, done, callEach = false, cursor = "pointer") {
  const [cleanSrc, overlaySrc, x, y, w, h] = obj;
  const box = el("div", "scrub");
  box.style.left = `${x}px`;
  box.style.top = `${y}px`;
  box.style.width = `${w}px`;
  box.style.height = `${h}px`;
  box.style.cursor = cursor;
  const clean = img(cleanSrc, "");
  const overlay = img(overlaySrc, "");
  const badge = el("div", "badge", "0%");
  box.append(clean, overlay, badge);
  let active = false, progress = 0, lastX = 0, lastY = 0;
  const scrub = e => {
    if (!active || completed.has(index)) return;
    e.preventDefault();
    const scale = getScale(area);
    const dx = (e.clientX - lastX) / scale;
    const dy = (e.clientY - lastY) / scale;
    const moved = Math.hypot(dx, dy);
    lastX = e.clientX;
    lastY = e.clientY;
    if (moved < 3) return;
    progress = clamp(progress + moved * 0.12, 0, 100);
    overlay.style.opacity = `${1 - progress / 100}`;
    badge.textContent = `${Math.round(progress)}%`;
    if (progress >= 100) {
      completed.add(index);
      badge.textContent = "Bersih";
      addClean(10);
      toast("+10 Bersih!");
      setProgress(completed.size, total);
      if (callEach || completed.size === total) done();
    }
  };
  box.addEventListener("pointerdown", e => {
    e.preventDefault();
    box.setPointerCapture?.(e.pointerId);
    active = true;
    lastX = e.clientX;
    lastY = e.clientY;
  });
  box.addEventListener("pointermove", scrub);
  const endScrub = e => {
    active = false;
    if (e?.pointerId !== undefined && box.hasPointerCapture?.(e.pointerId)) {
      box.releasePointerCapture(e.pointerId);
    }
  };
  box.addEventListener("pointerup", endScrub);
  box.addEventListener("pointercancel", endScrub);
  box.addEventListener("pointerleave", endScrub);
  area.append(box);
}

function finalGame(area, missionIndex) {
  area.style.cursor = `url("${ASSETS.mini.dust.cursor}") 12 12, pointer`;
  showCleaningCursor("cloth", area);
  const f = ASSETS.mini.final;
  const aura = img(f.dirtyAura, "", "aura");
  const germ = img(f.germ, "Kuman", "germ");
  germ.style.left = "590px";
  germ.style.top = "210px";
  area.append(aura, germ);
  aura.style.opacity = `${1 - gameState.chapter.missionsDone.length / MISSIONS[5].length}`;
  const mission = MISSIONS[5][missionIndex];
  scrubObject(area, [mission.clean, mission.overlay, 450, 230, mission.w, mission.h], missionIndex, new Set(), 1, () => {
    germ.remove();
    aura.src = f.cleanAura;
    aura.style.opacity = "1";
    completeMission(5, missionIndex);
  }, true, area.style.cursor);
}

function finalChapterGame(area, missionIndex) {
  const mission = MISSIONS[5][missionIndex];
  if (mission.kind === "trash") {
    trashMissionGame(area, mission, 5, missionIndex);
    return;
  }
  if (mission.kind === "dust") {
    dustMissionGame(area, mission, 5, missionIndex);
    return;
  }
  if (mission.kind === "water") {
    waterMissionGame(area, mission, 5, missionIndex);
    return;
  }
  finalGame(area, missionIndex);
}

function showQuiz() {
  hideCleaningCursor();
  gameState.chapter.remaining = 60;
  gameState.chapter.max = 60;
  gameState.chapter.timerLabel = "Timer Quiz";
  startTimer();
  const questions = [
    ["Kenapa sampah tidak boleh dibiarkan menumpuk?", "Karena dapat menjadi sarang kuman.", ["Karena dapat menjadi sarang kuman.", "Karena membuat lantai lebih hangat.", "Karena menghemat tempat."]],
    ["Kenapa genangan air harus dikeringkan?", "Karena dapat menjadi tempat berkembang biak nyamuk.", ["Karena dapat menjadi tempat berkembang biak nyamuk.", "Karena membuat debu menempel.", "Karena membuat ruangan lebih gelap."]],
    ["Apa manfaat ruangan yang rapi?", "Mengurangi risiko tersandung dan membuat rumah lebih aman.", ["Mengurangi risiko tersandung dan membuat rumah lebih aman.", "Membuat sampah hilang sendiri.", "Membuat nyamuk cepat tidur."]]
  ];
  let i = 0;
  const quiz = el("div", "quiz");
  sceneEl.append(quiz);
  const render = () => {
    const q = questions[i];
    quiz.innerHTML = `<h2>Quiz Edukasi</h2><p>${q[0]}</p>`;
    const opts = el("div", "quiz-options");
    q[2].forEach(answer => opts.append(btn(answer, () => {
      if (answer === q[1]) {
        gameState.totalEducationPoints += 10;
        toast("+10 Edukasi!");
      } else {
        toast(`Jawaban benar: ${q[1]}`);
      }
      i++;
      setProgress(MISSIONS[5].length + i, MISSIONS[5].length + questions.length);
      if (i >= questions.length) {
        quiz.remove();
        completeChapter(5);
      } else render();
    }, "alt")));
    quiz.append(opts);
  };
  render();
}

function completeMission(chapterNumber, missionIndex) {
  if (!gameState.chapter.missionsDone.includes(missionIndex)) {
    gameState.chapter.missionsDone.push(missionIndex);
  }
  updateChapterProgress(chapterNumber);
  saveGame();
  const allDone = gameState.chapter.missionsDone.length >= MISSIONS[chapterNumber].length;
  if (chapterNumber === 5 && allDone) {
    showQuiz();
    return;
  }
  if (allDone) {
    completeChapter(chapterNumber);
    return;
  }
  startExploration(chapterNumber);
  toast("Area ini sudah bersih. Cari titik berikutnya.");
}

function updateChapterProgress(chapterNumber) {
  const total = chapterNumber === 5 ? MISSIONS[chapterNumber].length + 3 : MISSIONS[chapterNumber].length;
  gameState.chapter.progress = Math.round(gameState.chapter.missionsDone.length / total * 100);
  updateHUD();
}

function completeChapter(n) {
  if (!gameState.chapter || gameState.chapter.paused) return;
  gameState.chapter.paused = true;
  if (timer) clearInterval(timer);
  timer = null;
  const chapter = CHAPTERS[n];
  if (!gameState.completedChapters.includes(n)) {
    gameState.completedChapters.push(n);
    gameState.totalCleaningPoints += gameState.chapter.cleaning;
  }
  if (!gameState.medicinesOwned.includes(chapter.med)) gameState.medicinesOwned.push(chapter.med);
  gameState.currentChapter = Math.min(5, n + 1);
  saveGame();
  showDialogue(chapterRewardDialogue(n), () => showEduCard(chapter.edu, () => showLevelComplete(n, () => {
    if (n === 5) showEnding();
    else showMotherProgress(n, () => startChapter(n + 1));
  })));
}

function chapterRewardDialogue(n) {
  const data = {
    1: [
      { speaker: "Andi", text: "Satu ruangan berhasil bersih. Semoga ini membantu Ibu.", portrait: ASSETS.andi.relieved, side: "left" },
      { speaker: "Penyihir", text: "Kau telah mendapatkan Obat Kesadaran.", portrait: ASSETS.characters.witchPortrait, side: "right" }
    ],
    2: [
      { speaker: "Andi", text: "Menghapus debu ternyata butuh kesabaran.", portrait: ASSETS.andi.tired, side: "left" },
      { speaker: "Penyihir", text: "Ketekunanmu memberi hasil. Ini Obat Suara.", portrait: ASSETS.characters.witchPortrait, side: "right" }
    ],
    3: [
      { speaker: "Penyihir", text: "Kau mendapatkan Obat Kekuatan.", portrait: ASSETS.characters.witchPortrait, side: "right" }
    ],
    4: [
      { speaker: "Penyihir", text: "Kau mendapatkan Obat Kehangatan.", portrait: ASSETS.characters.witchPortrait, side: "right" }
    ],
    5: [
      { speaker: "Penyihir", text: "Kau berhasil, Andi. Ini Obat Pemulihan.", portrait: ASSETS.characters.witchPortrait, side: "right" },
      { speaker: "Andi", text: "Ini obat terakhir... Ibu bisa sembuh.", portrait: ASSETS.andi.emotional, side: "left" }
    ]
  };
  return data[n];
}

function showEduCard(type, done) {
  const c = EDU[type];
  modal(c[0], c[1], [btn("Lanjut", () => { closeModal(); done(); })], c[2]);
}

function showLevelComplete(n, done) {
  modal("Chapter Selesai", `Andi mendapatkan obat ajaib ke-${n}.`, [btn("Lanjut", () => { closeModal(); done(); })], ASSETS.medicines[n - 1]);
}

function showMotherProgress(n, done) {
  setScene("Mother Progress Cutscene", ASSETS.cutscenes.mother[CHAPTERS[n].mother]);
  showDialogue(motherProgressDialogue(n), done);
}

function motherProgressDialogue(n) {
  const art = ASSETS.cutscenes.mother[CHAPTERS[n].mother];
  const data = {
    1: [
      { art, speaker: "Andi", text: "Ibu... matanya bergerak!", portrait: ASSETS.andi.surprised, side: "left" },
      { speaker: "Ibu", text: "Andi...", portrait: ASSETS.characters.mother, side: "right" },
      { speaker: "Andi", text: "Ibu mulai sadar. Aku harus melanjutkan.", portrait: ASSETS.andi.emotional, side: "left" }
    ],
    2: [
      { art, speaker: "Ibu", text: "Andi... kamu di sini?", portrait: ASSETS.characters.mother, side: "right" },
      { speaker: "Andi", text: "Iya, Bu. Aku di sini.", portrait: ASSETS.andi.relieved, side: "left" },
      { speaker: "Ibu", text: "Terima kasih...", portrait: ASSETS.characters.mother, side: "right" },
      { speaker: "Andi", text: "Aku belum selesai. Aku akan membawa obat berikutnya.", portrait: ASSETS.andi.determined, side: "left" }
    ],
    3: [
      { art, speaker: "Ibu", text: "Andi... Ibu bisa duduk sekarang.", portrait: ASSETS.characters.mother, side: "right" },
      { speaker: "Andi", text: "Ibu semakin kuat!", portrait: ASSETS.andi.happy, side: "left" },
      { speaker: "Ibu", text: "Kamu pasti lelah.", portrait: ASSETS.characters.mother, side: "right" },
      { speaker: "Andi", text: "Tidak apa-apa, Bu. Aku akan menyelesaikan semuanya.", portrait: ASSETS.andi.determined, side: "left" }
    ],
    4: [
      { art, speaker: "Ibu", text: "Andi... Ibu merasa jauh lebih baik.", portrait: ASSETS.characters.mother, side: "right" },
      { speaker: "Andi", text: "Ibu hampir pulih.", portrait: ASSETS.andi.emotional, side: "left" },
      { speaker: "Ibu", text: "Kamu sudah berjuang banyak.", portrait: ASSETS.characters.mother, side: "right" },
      { speaker: "Andi", text: "Tinggal satu ruangan lagi, Bu.", portrait: ASSETS.andi.determined, side: "left" }
    ]
  };
  return data[n] || [{ art, speaker: "Andi", text: "Ibu semakin membaik.", portrait: ASSETS.andi.relieved, side: "left" }];
}

function showEnding() {
  showAestheticEnding();
}

function showAestheticEnding() {
  hideCleaningCursor();
  const lightScene = setScene("Ending Light", ASSETS.background.chapters[5]);
  lightScene.append(el("div", "ending-light"));
  setTimeout(() => {
    setScene("Ending", ASSETS.background.endingHospital);
    showDialogue(endingDialogue(), showFinalMessage);
  }, 950);
}

function endingDialogue() {
  return [
    { art: ASSETS.background.endingHospital, speaker: "Narator", text: "Cahaya dari obat terakhir menyelimuti tangan Andi. Untuk pertama kalinya setelah perjalanan panjang itu, langkahnya terasa ringan." },
    { art: ASSETS.cutscenes.ending, speaker: "Andi", text: "Ibu... aku pulang.", portrait: ASSETS.andi.worried, side: "left" },
    { speaker: "Ibu", text: "Andi...?", portrait: ASSETS.characters.mother, side: "right" },
    { speaker: "Andi", text: "Ibu... Ibu bisa bicara lagi?", portrait: ASSETS.andi.emotional, side: "left" },
    { speaker: "Ibu", text: "Ibu mendengar suaramu. Jauh sekali... seperti kamu terus memanggil Ibu untuk kembali.", portrait: ASSETS.characters.mother, side: "right" },
    { speaker: "Andi", text: "Aku takut terlambat, Bu.", portrait: ASSETS.andi.emotional, side: "left" },
    { speaker: "Ibu", text: "Tapi kamu tidak menyerah.", portrait: ASSETS.characters.mother, side: "right" },
    { speaker: "Andi", text: "Aku membersihkan ruangan-ruangan itu satu per satu. Sampah, debu, genangan air, barang berantakan... semuanya ternyata punya arti.", portrait: ASSETS.andi.emotional, side: "left" },
    { speaker: "Ibu", text: "Apa yang kamu pelajari, Nak?", portrait: ASSETS.characters.mother, side: "right" },
    { speaker: "Andi", text: "Aku belajar bahwa kebersihan bukan cuma membuat rumah terlihat indah. Kebersihan menjaga napas, menjaga langkah, dan menjaga orang yang kita sayangi.", portrait: ASSETS.andi.relieved, side: "left" },
    { speaker: "Ibu", text: "Kalau begitu, kamu bukan hanya membawa obat untuk Ibu.", portrait: ASSETS.characters.mother, side: "right" },
    { speaker: "Andi", text: "Maksud Ibu?", portrait: ASSETS.andi.relieved, side: "left" },
    { speaker: "Ibu", text: "Kamu membawa pulang pelajaran untuk hidup.", portrait: ASSETS.characters.mother, side: "right" },
    { speaker: "Penyihir", text: "Rumah yang bersih menyimpan kehangatan. Hati yang peduli menyimpan kekuatan.", portrait: ASSETS.characters.witchPortrait, side: "right" },
    { speaker: "Andi", text: "Mulai sekarang, aku akan menjaga rumah seperti Ibu menjagaku.", portrait: ASSETS.andi.happy, side: "left" },
    { speaker: "Ibu", text: "Dan Ibu akan menjaganya bersamamu.", portrait: ASSETS.characters.mother, side: "right" },
    { speaker: "Narator", text: "Di ruangan yang kini terasa hangat, Andi mengerti bahwa cinta tidak selalu hadir dalam hal besar. Kadang, cinta hadir dalam hal sederhana: merapikan, membersihkan, dan menjaga." }
  ];
}

function showFinalMessage() {
  hideCleaningCursor();
  const scene = setScene("Pesan Akhir", ASSETS.background.endingHospital);
  gameState.dialogOpen = true;
  scene.innerHTML = `
    <section class="final-message-screen fade-in">
      <div class="final-message-overlay"></div>
      <div class="final-message-card soft-glow">
        <p class="final-message-label">Pesan Akhir</p>
        <h1 class="final-message-title"></h1>
        <p class="final-message-subtitle"></p>
        <div class="final-message-buttons">
          <button class="game-btn" id="playAgainBtn">Main Lagi</button>
          <button class="game-btn secondary" id="backToMenuBtn">Kembali ke Menu</button>
        </div>
      </div>
    </section>
  `;

  const card = scene.querySelector(".final-message-card");
  const title = scene.querySelector(".final-message-title");
  const subtitle = scene.querySelector(".final-message-subtitle");
  const buttons = scene.querySelector(".final-message-buttons");
  const message = "Rumah yang bersih bukan hanya tempat untuk pulang,\ntetapi tempat di mana kesehatan, kasih sayang,\ndan harapan tumbuh bersama.";
  const subtitleText = "Jaga kebersihan. Jaga keluarga. Jaga kehidupan.";
  let index = 0;
  let finished = false;
  const completeText = () => {
    if (typingTimer) clearInterval(typingTimer);
    typingTimer = null;
    title.textContent = message;
    subtitle.textContent = subtitleText;
    card.classList.add("done");
    buttons.classList.add("show");
    finished = true;
    gameState.dialogOpen = false;
  };
  const next = () => {
    if (!finished) {
      completeText();
    }
  };
  typingTimer = setInterval(() => {
    index++;
    title.textContent = message.slice(0, index);
    if (index >= message.length) completeText();
  }, 34);
  scene.querySelector(".final-message-screen").addEventListener("click", next);
  dialogNext = next;

  scene.querySelector("#playAgainBtn").addEventListener("click", () => {
    resetGame(false);
    showOpening();
  });
  scene.querySelector("#backToMenuBtn").addEventListener("click", showMainMenu);
}

function addClean(v) {
  gameState.chapter.cleaning = Math.max(0, gameState.chapter.cleaning + v);
  updateHUD();
}

function setProgress(done, total) {
  gameState.chapter.progress = Math.round(done / total * 100);
  updateHUD();
}

function modal(title, text, actions, icon) {
  closeModal();
  const shade = el("div", "shade");
  const card = el("div", "modal-card");
  if (icon) card.append(img(icon, "", "edu-icon"));
  card.insertAdjacentHTML("beforeend", `<h2>${title}</h2><p>${text}</p>`);
  const row = el("div", "actions");
  actions.forEach(a => row.append(a));
  card.append(row);
  shade.append(card);
  game.append(shade);
}

function closeModal() {
  game.querySelector(".shade")?.remove();
}

function dialog(entry, text) {
  if (typeof entry === "string") entry = { speaker: entry, text };
  const box = el("div", "dialog");
  if (!entry.portrait) box.classList.add("no-portrait");
  if (entry.portrait && entry.side === "right") box.classList.add("portrait-right");
  const portrait = el("div", `portrait-wrap ${entry.portrait ? "" : "empty"} ${entry.side === "right" ? "right" : ""}`.trim());
  if (entry.portrait) portrait.append(img(entry.portrait, entry.speaker, "portrait"));
  const content = el("div", `dialog-content ${entry.side === "right" ? "right" : ""}`.trim());
  content.innerHTML = `<div class="speaker">${entry.speaker}</div><div class="dialog-text"></div><div class="hint">Klik / Enter / Space</div>`;
  box.append(portrait, content);
  typeDialogText(box, entry.text);
  return box;
}

function updateDialogPortrait(box, entry) {
  const oldPortrait = box.querySelector(".portrait-wrap");
  const oldContent = box.querySelector(".dialog-content");
  box.classList.toggle("no-portrait", !entry.portrait);
  box.classList.toggle("portrait-right", Boolean(entry.portrait && entry.side === "right"));
  oldPortrait.className = `portrait-wrap ${entry.portrait ? "" : "empty"} ${entry.side === "right" ? "right" : ""}`.trim();
  oldContent.className = `dialog-content ${entry.side === "right" ? "right" : ""}`.trim();
  oldPortrait.innerHTML = "";
  if (entry.portrait) oldPortrait.append(img(entry.portrait, entry.speaker, "portrait"));
}

function typeDialogText(box, text) {
  if (typingTimer) clearInterval(typingTimer);
  const target = box.querySelector(".dialog-text");
  const hint = box.querySelector(".hint");
  activeTypingBox = box;
  activeTypingFullText = text;
  target.textContent = "";
  if (hint) hint.textContent = "Mengetik...";
  let index = 0;
  typingTimer = setInterval(() => {
    index++;
    target.textContent = text.slice(0, index);
    if (index >= text.length) {
      clearInterval(typingTimer);
      typingTimer = null;
      activeTypingBox = null;
      activeTypingFullText = "";
      if (hint) hint.textContent = "Klik / Enter / E";
    }
  }, 24);
}

function finishTypingIfNeeded() {
  if (!typingTimer || !activeTypingBox) return false;
  clearInterval(typingTimer);
  typingTimer = null;
  activeTypingBox.querySelector(".dialog-text").textContent = activeTypingFullText;
  const hint = activeTypingBox.querySelector(".hint");
  if (hint) hint.textContent = "Klik / Enter / E";
  activeTypingBox = null;
  activeTypingFullText = "";
  return true;
}

function tempDialog(speaker, text) {
  sceneEl.querySelector(".dialog")?.remove();
  showDialogue([{ speaker, text, portrait: speaker === "Penyihir" ? ASSETS.characters.witchPortrait : null, side: "right" }], () => {});
}

function hubDialogue() {
  const key = gameState.completedChapters.length >= 5 ? "done" : gameState.currentChapter;
  return HUB_DIALOGUES[key].map(([speaker, text, andiPortrait]) => ({
    speaker,
    text,
    portrait: speaker === "Andi" ? (andiPortrait || ASSETS.andi.neutral) : ASSETS.characters.witchPortrait,
    side: speaker === "Andi" ? "left" : "right"
  }));
}

function note(title, text) {
  const n = el("div", "panel small-note");
  n.innerHTML = `<strong>${title}</strong><br>${text}`;
  return n;
}

function toast(text) {
  game.querySelector(".feedback")?.remove();
  const pop = el("div", "feedback", text);
  game.append(pop);
  setTimeout(() => pop.remove(), 950);
}

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text) node.textContent = text;
  return node;
}

function img(src, alt = "", cls = "", x, y) {
  const image = document.createElement("img");
  image.src = src;
  image.alt = alt;
  if (cls) image.className = cls;
  if (x !== undefined) image.style.left = `${x}px`;
  if (y !== undefined) image.style.top = `${y}px`;
  image.addEventListener("error", () => {
    image.style.background = "rgba(255,244,203,.65)";
    image.style.border = "2px dashed #9b7444";
  });
  return image;
}

function btn(text, fn, cls = "") {
  const b = el("button", `btn ${cls}`.trim(), text);
  b.addEventListener("click", fn);
  return b;
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function overlap(a, b) {
  return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
}

function getScale(node) {
  return node.getBoundingClientRect().width / node.offsetWidth || 1;
}

init();
