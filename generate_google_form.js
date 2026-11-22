/**
 * =========================================================================
 * SIDEQUESTKI UKM - AUTOMATED GOOGLE FORM BUILDER
 * =========================================================================
 * Skrip ini akan membina Google Form rasmi "Sidequestki & Mass Media UKM"
 * secara automatik dalam Google Drive anda dalam masa 5 saat.
 * 
 * CARA GUNA (3 LANGKAH MUDAH):
 * 1. Buka pelayar dan pergi ke: https://script.new
 * 2. Padam semua kod asal, dan tampal (PASTE) keseluruhan kod ini.
 * 3. Klik ikon simpan (💾) dan tekan butang "Run" (▶️).
 * 
 * Pautan Edit dan Pautan Paparan Borang akan dipaparkan di Execution Log!
 * =========================================================================
 */

function buildSidequestkiUKMForm() {
  // 1. Cipta Form Baru
  var form = FormApp.create("Sidequestki UKM | Borang Penyerahan Maklumat Program & Media");
  
  form.setDescription(
    "Selamat datang ke Borang Penyerahan Maklumat Program Siswa UKM (Sidequestki & Mass Media Hub).\n\n" +
    "Borang ini digunakan untuk mengumpul maklumat lengkap program bagi tujuan:\n" +
    "1. Kemasukan ke 'Live Campus Quest Board' (sidequestki.github.io)\n" +
    "2. Hebahan 'Monday Weekly Blast' dan poster media sosial rasmi\n" +
    "3. Liputan media dan penyelarasan kebajikan siswa (i-Star, pelepasan kuliah & logistik kolej)\n\n" +
    "Sila lengkapkan butiran di bawah dengan teliti."
  );

  form.setConfirmationMessage(
    "Terima kasih! Maklumat program anda telah selamat diterima oleh pasukan Sidequestki & Mass Media UKM.\n\n" +
    "Pasukan kurasi kami akan menyemak butiran ini dan menghubungi PIC dalam masa 24-48 jam.\n" +
    "Pantau status acara anda di portal rasmi: https://sidequestki.github.io/sidequestki/"
  );

  form.setAllowResponseEdits(true);
  form.setProgressBar(true);

  // -------------------------------------------------------------------------
  // SEKSYEN 1: MAKLUMAT PEMOHON & PENGANJUR
  // -------------------------------------------------------------------------
  var sec1 = form.addSectionHeaderItem();
  sec1.setTitle("BAHAGIAN 1: Maklumat Pemohon / Penganjur");

  form.addTextItem()
    .setTitle("1. Nama Penuh Pemohon")
    .setHelpText("Nama wakil program yang mengisi borang ini")
    .setRequired(true);

  form.addTextItem()
    .setTitle("2. Nombor Matrik UKM")
    .setHelpText("Contoh: A189021")
    .setRequired(true);

  form.addTextItem()
    .setTitle("3. No. Telefon WhatsApp Pemohon")
    .setHelpText("Contoh: 012-3456789 (Untuk pengesahan pihak media)")
    .setRequired(true);

  form.addListItem()
    .setTitle("4. Organisasi / Kelab / Kolej Penganjur")
    .setChoiceValues([
      "KMUKM (Kesatuan Mahasiswa Universiti Kebangsaan Malaysia)",
      "MEP Kolej Kediaman",
      "Persatuan Mahasiswa Fakulti (PMF)",
      "Kelab / Persatuan Pusat BHEPA",
      "Badan Beruniform / Sukan UKM",
      "Sekretariat / Jawatankuasa Khas",
      "Lain-lain"
    ])
    .setRequired(true);

  form.addTextItem()
    .setTitle("5. Jawatan Pemohon dalam Acara Ini")
    .setHelpText("Contoh: Pengarah Program / Timbalan Pengarah / Exco Publisiti & Media")
    .setRequired(true);

  // -------------------------------------------------------------------------
  // SEKSYEN 2: MAKLUMAT ASAS PROGRAM
  // -------------------------------------------------------------------------
  form.addPageBreakItem().setTitle("BAHAGIAN 2: Maklumat Asas Program");

  form.addTextItem()
    .setTitle("6. Nama Rasmi Program")
    .setHelpText("Nama penuh acara seperti yang diluluskan dalam kertas kerja")
    .setRequired(true);

  form.addTextItem()
    .setTitle("7. Tema / Tagline Program (Jika ada)")
    .setHelpText("Contoh: 'Melakar Inovasi Menjulang Warisan'");

  form.addMultipleChoiceItem()
    .setTitle("8. Tujuan Pengambilan / Hebahan")
    .setChoiceValues([
      "Mencari Peserta Sahaja",
      "Mencari Urusetia / AJK Pelaksana",
      "Hebahan Umum & Liputan Media Sahaja (Tiada pendaftaran)"
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle("9. Peringkat Program")
    .setHelpText("Peringkat penganjuran yang menentukan skop dan penarafan merit")
    .setChoiceValues([
      "Peringkat Kolej Kediaman",
      "Peringkat Fakulti",
      "Peringkat Universiti (Terbuka Seluruh UKM)",
      "Peringkat Kebangsaan / Antarabangsa / Terbuka Awam"
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle("10. Mod Pelaksanaan")
    .setChoiceValues([
      "Fizikal Sepenuhnya",
      "Dalam Talian (Online: Webex / Zoom / Google Meet)",
      "Hibrid (Gabungan Fizikal & Online)"
    ])
    .setRequired(true);

  form.addTextItem()
    .setTitle("11. Lokasi Spesifik / Venue / Platform Online")
    .setHelpText("Sila nyatakan aras & bangunan. Contoh: Dewan Anu Pusanika Aras 5 / Foyer Fakulti FSSK")
    .setRequired(true);

  form.addDateItem()
    .setTitle("12. Tarikh Mula Program")
    .setRequired(true);

  form.addDateItem()
    .setTitle("13. Tarikh Tamat Program (Jika Berterusan Lebih 1 Hari)")
    .setHelpText("Biarkan kosong jika program berlangsung hanya 1 hari sahaja");

  form.addTextItem()
    .setTitle("14. Masa Program (Mula hingga Tamat)")
    .setHelpText("Contoh: 8:00 AM – 5:00 PM / 8:00 PM – 10:30 PM")
    .setRequired(true);

  // -------------------------------------------------------------------------
  // SEKSYEN 3: SASARAN & KOLEJ KEDIAMAN UKM
  // -------------------------------------------------------------------------
  form.addPageBreakItem().setTitle("BAHAGIAN 3: Sasaran Peserta & Kolej Kediaman UKM");

  form.addMultipleChoiceItem()
    .setTitle("15. Skop Sasaran Kolej")
    .setHelpText("Pilih sama ada terbuka kepada kolej tertentu atau seluruh UKM")
    .setChoiceValues([
      "Tertutup (Kolej Penganjur Sahaja)",
      "Kolaborasi Antara Kolej Tertentu Sahaja",
      "Terbuka kepada Semua 13 Kolej Kediaman UKM",
      "Terbuka Seluruh UKM + Pelajar Luar Kampus (Non-Resident)"
    ])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle("16. Kolej Kediaman yang Disasarkan")
    .setHelpText("Tandakan kolej kediaman yang dibenarkan menyertai")
    .setChoiceValues([
      "TERBUKA SEMUA 13 KOLEJ KEDIAMAN",
      "KDO - Kolej Dato' Onn",
      "KAB - Kolej Aminuddin Baki",
      "KUO - Kolej Ungku Omar",
      "KBH - Kolej Burhanuddin Helmi",
      "KIY - Kolej Ibrahim Yaakub",
      "KRK - Kolej Rahim Kajai",
      "KIZ - Kolej Ibu Zain",
      "KKM - Kolej Keris Mas",
      "KPZ - Kolej Pendeta Za'ba",
      "KTHO - Kolej Tun Hussein Onn",
      "KTSN - Kolej Tun Syed Nasir (Kampus KL)",
      "KIAM - Kolej Idris Al-Marbawi (Seksyen 1 Bangi)",
      "KTAAB - Kolej Tun Abdullah Ahmad Badawi (Taman Tenaga Kajang)",
      "Pelajar Non-Resident (NR / Menyewa Luar)"
    ]);

  form.addCheckboxItem()
    .setTitle("17. Kategori Sasaran Siswa")
    .setChoiceValues([
      "Semua Mahasiswa Prasiswazah (Tahun 1 – 4)",
      "Hanya Pelajar Tahun 1 (Freshies)",
      "Mahasiswa Pascasiswazah (Master / PhD)",
      "Mahasiswa Antarabangsa (Sesi dwibahasa/BI)",
      "Pelajar Asasi / Kolej PERMATApintar",
      "Terbuka kepada Warga Luar / Awam"
    ])
    .setRequired(true);

  form.addTextItem()
    .setTitle("18. Had Kuota Penyertaan")
    .setHelpText("Contoh: 'Terhad 80 orang terawal' atau 'Tiada had'")
    .setRequired(true);

  // -------------------------------------------------------------------------
  // SEKSYEN 4: MANFAAT SISWA, MERIT I-STAR & LOGISTIK
  // -------------------------------------------------------------------------
  form.addPageBreakItem().setTitle("BAHAGIAN 4: Manfaat Siswa, Merit i-Star & Logistik");

  form.addMultipleChoiceItem()
    .setTitle("19. Penyediaan Merit i-Star")
    .setHelpText("Faktor penentu utama Siswa UKM untuk kelayakan kolej semester depan")
    .setChoiceValues([
      "Ada - Peringkat Kolej Kediaman",
      "Ada - Peringkat Fakulti",
      "Ada - Peringkat Universiti",
      "Ada - Peringkat Kebangsaan / Antarabangsa",
      "Tiada Merit i-Star"
    ])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle("20. Teras / Domain i-Star (Jika Ada)")
    .setChoiceValues([
      "Kepimpinan & Komunikasi",
      "Etika & Kerohanian",
      "Sukan & Rekreasi",
      "Keusahawanan",
      "Kesukarelawanan",
      "Inovasi & Penyelidikan",
      "Kebudayaan & Kesenian"
    ]);

  form.addMultipleChoiceItem()
    .setTitle("21. Surat Pelepasan Kuliah Disediakan?")
    .setChoiceValues([
      "Ada (Kelulusan Pusat Hal Ehwal Pelajar - HEP UKM)",
      "Ada (Kelulusan Dekan Fakulti)",
      "Ada (Kelulusan Pengetua Kolej)",
      "Tiada Surat Pelepasan"
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle("22. Sijil Penyertaan / Penghargaan")
    .setChoiceValues([
      "E-Sijil (Dihantar melalui emel)",
      "Sijil Fizikal (Bercetak)",
      "Tiada Sijil"
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle("23. Makan & Minum (F&B)")
    .setChoiceValues([
      "Disediakan (Makan Berat - Sarapan / Tengah Hari / Malam)",
      "Disediakan (Kudapan Ringan / Refreshment)",
      "Tiada Makanan Disediakan"
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle("24. Pengangkutan Bas UKM")
    .setChoiceValues([
      "Disediakan (Bas Ulang-alik UKM)",
      "Pengangkutan Sendiri / Tiada Pengangkutan"
    ])
    .setRequired(true);

  form.addTextItem()
    .setTitle("25. Titik Ambilan Bas (Jika Disediakan)")
    .setHelpText("Contoh: Foyer Pusanika / Stesen Komuter KTM UKM / Pintu Pagar Kolej");

  form.addMultipleChoiceItem()
    .setTitle("26. Isu Pintu Pagar Kolej / Curfew 11:00 Malam (Jika Program Malam)")
    .setChoiceValues([
      "Pas kebenaran pulang lewat ke kolej disediakan oleh penganjur",
      "Program tamat sebelum 10:30 malam (tiada isu curfew)",
      "Program siang / Tidak berkaitan"
    ]);

  // -------------------------------------------------------------------------
  // SEKSYEN 5: YURAN & PAUTAN PENDAFTARAN
  // -------------------------------------------------------------------------
  form.addPageBreakItem().setTitle("BAHAGIAN 5: Yuran & Pautan Pendaftaran");

  form.addTextItem()
    .setTitle("27. Yuran Penyertaan")
    .setHelpText("Tulis 'PERCUMA' atau jumlah bayaran (Contoh: RM5 Ahli Kolej / RM10 Kolej Luar)")
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle("28. Kaedah Pembayaran (Jika Berbayar)")
    .setHelpText("Sertakan nama bank, no akaun persatuan, atau arahan imbasan DuitNow QR");

  form.addTextItem()
    .setTitle("29. Pautan Rasmi Pendaftaran (URL Google Form / Siswa Portal)")
    .setHelpText("Pautan untuk peserta mendaftar masuk program")
    .setRequired(true);

  form.addTextItem()
    .setTitle("30. Tarikh & Masa Tutup Pendaftaran")
    .setHelpText("Contoh: 25 November 2026, 11:59 Malam")
    .setRequired(true);

  form.addTextItem()
    .setTitle("31. Pautan WhatsApp Group / Telegram Peserta (Jika Ada)")
    .setHelpText("Link saluran komunikasi selepas pelajar mendaftar");

  // -------------------------------------------------------------------------
  // SEKSYEN 6: ETIKA PAKAIAN & KHUSUS URUSETIA
  // -------------------------------------------------------------------------
  form.addPageBreakItem().setTitle("BAHAGIAN 6: Etika Pakaian & Khusus Pengambilan Urusetia");

  form.addCheckboxItem()
    .setTitle("32. Etika Pakaian (Dress Code)")
    .setChoiceValues([
      "Smart Casual (Kasut bertutup, berkolar)",
      "Formal / Baju Batik Rasmi",
      "Baju Sukan & Kasut Sukan (Riadah/Padang)",
      "Baju Korporat / Rasmi Kolej / Persatuan",
      "Sopan & Menutup Aurat (Peraturan UKM)"
    ])
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle("33. Barang / Keperluan Khas yang Perlu Dibawa")
    .setHelpText("Contoh: Komputer riba, botol air, telekung, tikar yoga, dll.");

  form.addCheckboxItem()
    .setTitle("34. Senarai Biro yang Dibuka (Jika Mencari Urusetia)")
    .setChoiceValues([
      "Protokol & Sambutan",
      "Publisiti, Media & Multimedia",
      "Logistik, Teknikal & Pengangkutan",
      "Makanan & Kebajikan",
      "Tugas-Tugas Khas (TTK)",
      "Tajaan & Keusahawanan",
      "Pendaftaran & Cenderamata",
      "TIDAK BERKAITAN (Hanya mencari peserta)"
    ]);

  form.addMultipleChoiceItem()
    .setTitle("35. Kaedah Pemilihan Urusetia (Jika Mencari Urusetia)")
    .setChoiceValues([
      "Penapisan Resume / Portfolio Sahaja",
      "Sesi Temuduga Atas Talian (Google Meet)",
      "Sesi Temuduga Fizikal",
      "Tiada Temuduga (Terus Diterima)",
      "Tidak Berkaitan"
    ]);

  // -------------------------------------------------------------------------
  // SEKSYEN 7: PEGAWAI PERHUBUNGAN (PIC) & BAHAN MEDIA
  // -------------------------------------------------------------------------
  form.addPageBreakItem().setTitle("BAHAGIAN 7: Pegawai Perhubungan (PIC) & Media");

  form.addTextItem()
    .setTitle("36. Pegawai Perhubungan 1 (PIC 1)")
    .setHelpText("Format: Nama Penuh + No. Telefon WhatsApp (Contoh: Danial - 012-3456789)")
    .setRequired(true);

  form.addTextItem()
    .setTitle("37. Pegawai Perhubungan 2 (PIC 2)")
    .setHelpText("Format: Nama Penuh + No. Telefon WhatsApp (Contoh: Aina - 018-9876543)")
    .setRequired(true);

  form.addTextItem()
    .setTitle("38. Akaun Media Sosial Penganjur")
    .setHelpText("Handle Instagram / TikTok (Contoh: @sidequestki / @kmukm_rasmi)");

  form.addTextItem()
    .setTitle("39. Pautan Google Drive Bahan Media (Poster / Logo / Tentatif)")
    .setHelpText("Pautan folder Google Drive mengandungi draf poster, logo kelab, atau kertas kerja (Pastikan akses: 'Anyone with the link can view')")
    .setRequired(true);

  // -------------------------------------------------------------------------
  // CETAK HASIL KE EXECUTION LOG
  // -------------------------------------------------------------------------
  Logger.log("===============================================================");
  Logger.log("🎉 GOOGLE FORM BERJAYA DICIPTA DALAM GOOGLE DRIVE ANDA!");
  Logger.log("===============================================================");
  Logger.log("🔗 EDIT URL (Untuk anda sunting / kemas kini):");
  Logger.log(form.getEditUrl());
  Logger.log("---------------------------------------------------------------");
  Logger.log("📋 PUBLISHED URL (Untuk dikongsi kepada kelab / kolej):");
  Logger.log(form.getPublishedUrl());
  Logger.log("===============================================================");
}
