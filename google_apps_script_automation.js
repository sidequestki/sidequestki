/**
 * =========================================================================
 * SIDEQUESTKI UKM - COMPLETE STATUS & AUTO-NOTIFICATION AUTOMATION
 * =========================================================================
 * Skrip ini dipasang di Google Sheets (Extensions -> Apps Script).
 * 
 * FUNGSI UTAMA:
 * 1. setupStatusSystem(): Membina dropdown Status (APPROVED, PROCESS, REJECTED)
 *    lengkap dengan warna & lajur Admin Remarks secara automatik.
 * 2. handleStatusChange(e): Menghantar emel rasmi kepada pemohon secara automatik
 *    apabila status ditukar kepada APPROVED, PROCESS, atau REJECTED.
 * 3. setupAutoTrigger(): Memasang installable trigger onEdit dengan 1 klik.
 * =========================================================================
 */

// -------------------------------------------------------------------------
// 1. FUNGSI PERSEDIAAN LAJUR & DROPDOWN STATUS (RUN SEKALI SAHAJA)
// -------------------------------------------------------------------------
function setupStatusSystem() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (!ss) {
    Logger.log("❌ RALAT: Sila pastikan Apps Script ini dibuka dari dalam Google Sheet!");
    Logger.log("Caranya: Buka Google Sheet -> Klik Extensions -> Apps Script.");
    return;
  }

  var sheet = ss.getActiveSheet();
  var lastCol = sheet.getLastColumn();
  
  if (lastCol === 0) {
    Logger.log("⚠️ Sila pastikan Google Sheet ini sudah mempunyai lajur soalan daripada Google Form!");
    return;
  }
  
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var statusCol = -1;
  var remarksCol = -1;
  var emailLogCol = -1;

  for (var i = 0; i < headers.length; i++) {
    var h = headers[i].toString().trim().toLowerCase();
    if (h === "status") statusCol = i + 1;
    if (h === "admin remarks") remarksCol = i + 1;
    if (h === "email sent") emailLogCol = i + 1;
  }

  // Tambah lajur jika belum wujud
  if (statusCol === -1) {
    statusCol = sheet.getLastColumn() + 1;
    sheet.getRange(1, statusCol).setValue("Status").setFontWeight("bold").setBackground("#E2E8F0");
  }
  if (remarksCol === -1) {
    remarksCol = sheet.getLastColumn() + 1;
    sheet.getRange(1, remarksCol).setValue("Admin Remarks").setFontWeight("bold").setBackground("#E2E8F0");
  }
  if (emailLogCol === -1) {
    emailLogCol = sheet.getLastColumn() + 1;
    sheet.getRange(1, emailLogCol).setValue("Email Sent").setFontWeight("bold").setBackground("#E2E8F0");
  }

  // Bina Data Validation Dropdown (APPROVED, PROCESS, REJECTED)
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["PROCESS", "APPROVED", "REJECTED"], true)
    .setAllowInvalid(false)
    .setHelpText("Pilih status: PROCESS (Kuning), APPROVED (Hijau), atau REJECTED (Merah)")
    .build();

  // Pasang Dropdown untuk baris 2 hingga 500
  var statusRange = sheet.getRange(2, statusCol, 499, 1);
  statusRange.setDataValidation(rule);

  // Pasang Pewarnaan Bersyarat (Conditional Formatting)
  var rules = sheet.getConditionalFormatRules();
  
  var ruleProcess = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("PROCESS")
    .setBackground("#FEF08A") // Kuning lembut
    .setFontColor("#854D0E")
    .setRanges([statusRange])
    .build();

  var ruleApproved = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("APPROVED")
    .setBackground("#BBF7D0") // Hijau lembut
    .setFontColor("#166534")
    .setRanges([statusRange])
    .build();

  var ruleRejected = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("REJECTED")
    .setBackground("#FECACA") // Merah lembut
    .setFontColor("#991B1B")
    .setRanges([statusRange])
    .build();

  rules.push(ruleProcess, ruleApproved, ruleRejected);
  sheet.setConditionalFormatRules(rules);

  Logger.log("===============================================================");
  Logger.log("✅ SISTEM STATUS BERJAYA DIPASANG!");
  Logger.log("===============================================================");
  Logger.log("1. Lajur 'Status' dengan dropdown (PROCESS, APPROVED, REJECTED) siap!");
  Logger.log("2. Lajur 'Admin Remarks' dan 'Email Sent' telah ditambah.");
  Logger.log("👉 Buka tab Google Sheet anda sekarang untuk melihat hasilnya!");
  Logger.log("===============================================================");
}

// -------------------------------------------------------------------------
// 2. PASANG TRIGGER AUTOMATIK (RUN SEKALI SAHAJA)
// -------------------------------------------------------------------------
function setupAutoTrigger() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (!ss) {
    Logger.log("❌ Sila buka Apps Script ini dari dalam Google Sheet (Extensions -> Apps Script).");
    return;
  }

  var triggers = ScriptApp.getProjectTriggers();
  
  // Semak jika trigger sudah ada
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === "handleStatusChange") {
      Logger.log("ℹ️ Trigger sudah sedia terpasang! Anda boleh terus gunakan.");
      return;
    }
  }

  // Bina trigger onEdit baharu
  ScriptApp.newTrigger("handleStatusChange")
    .forSpreadsheet(ss)
    .onEdit()
    .create();

  Logger.log("===============================================================");
  Logger.log("⚡ TRIGGER PENGHANTARAN EMEL AUTOMATIK BERJAYA DIPASANG!");
  Logger.log("===============================================================");
  Logger.log("Setiap kali anda menukar status di Google Sheet kepada:");
  Logger.log("• PROCESS  -> Emel 'Sedang Diproses' dihantar");
  Logger.log("• APPROVED -> Emel 'Tahniah / Diluluskan' dihantar");
  Logger.log("• REJECTED -> Emel 'Tidak Diluluskan' + Admin Remarks dihantar");
  Logger.log("===============================================================");
}

// -------------------------------------------------------------------------
// 3. FUNGSI UTAMA PENGHANTARAN EMEL STATUS (DIPANGGIL BILA STATUS DITUKAR)
// -------------------------------------------------------------------------
function handleStatusChange(e) {
  if (!e || !e.range) return;

  var sheet = e.source.getActiveSheet();
  var range = e.range;
  var editedRow = range.getRow();
  var editedCol = range.getColumn();
  
  // Abaikan baris header
  if (editedRow === 1) return;

  var lastCol = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  
  var statusColIndex = -1;
  var emailColIndex = -1;
  var eventNameColIndex = -1;
  var applicantNameColIndex = -1;
  var emailLogColIndex = -1;
  var remarksColIndex = -1;

  for (var i = 0; i < headers.length; i++) {
    var h = headers[i].toString().trim().toLowerCase();
    if (h === "status") statusColIndex = i + 1;
    if (h.indexOf("email") !== -1 || h.indexOf("emel") !== -1) emailColIndex = i + 1;
    if (h.indexOf("nama rasmi program") !== -1 || h.indexOf("event") !== -1 || h.indexOf("title") !== -1) eventNameColIndex = i + 1;
    if (h.indexOf("nama penuh pemohon") !== -1 || h.indexOf("organisasi") !== -1) applicantNameColIndex = i + 1;
    if (h === "email sent") emailLogColIndex = i + 1;
    if (h === "admin remarks") remarksColIndex = i + 1;
  }

  // Jika kolum email log tiada, wujudkan di hujung
  if (emailLogColIndex === -1) {
    emailLogColIndex = lastCol + 1;
    sheet.getRange(1, emailLogColIndex).setValue("Email Sent");
  }

  // Hanya bertindak jika lajur yang disunting adalah lajur STATUS
  if (editedCol === statusColIndex) {
    var statusVal = range.getValue().toString().trim().toUpperCase();
    var emailLogVal = sheet.getRange(editedRow, emailLogColIndex).getValue().toString().trim();
    
    // Dapatkan maklumat baris tersebut
    var targetEmail = emailColIndex !== -1 ? sheet.getRange(editedRow, emailColIndex).getValue().toString().trim() : "";
    var eventName = eventNameColIndex !== -1 ? sheet.getRange(editedRow, eventNameColIndex).getValue() : "Program Kampus Anda";
    var applicantName = applicantNameColIndex !== -1 ? sheet.getRange(editedRow, applicantNameColIndex).getValue() : "Penganjur";
    var adminRemarks = remarksColIndex !== -1 ? sheet.getRange(editedRow, remarksColIndex).getValue() : "";
    var adminEmail = Session.getActiveUser().getEmail();

    // Pastikan emel sah
    if (!targetEmail || targetEmail.indexOf("@") === -1) {
      Logger.log("Tiada emel sah dijumpai di baris " + editedRow);
      return;
    }

    // =======================================================================
    // KES 1: STATUS DITUKAR KEPADA "PROCESS" (Sedang Disemak)
    // =======================================================================
    if (statusVal === "PROCESS" && emailLogVal !== "SENT - PROCESS") {
      var subject = "[Sidequestki UKM] Status: Permohonan Program Sedang Diproses - " + eventName;
      
      var plainBody = "Salam sejahtera " + applicantName + ",\n\n" +
        "Permohonan maklumat program bagi \"" + eventName + "\" telah diterima dan kini sedang DIKEMASKINI & DISEMAK oleh pasukan kurasi Sidequestki & Mass Media UKM.\n\n" +
        "Status Semasa: DALAM PROSES (PROCESS)\n" +
        (adminRemarks ? "Catatan Urusetia: " + adminRemarks + "\n\n" : "\n") +
        "Pihak kami akan menyemak kesahihan butiran logistik, merit i-Star, dan pelepasan sebelum kelulusan penuh diberikan.\n\n" +
        "Salam hormat,\nPasukan Sidequestki & Mass Media UKM";

      var htmlBody = 
        "<div style='font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0B0F19; color: #F3F4F6; border-radius: 12px; overflow: hidden; border: 1px solid #1F2937;'>" +
          "<div style='background: #1E293B; padding: 20px; text-align: center; border-bottom: 1px solid #374151;'>" +
            "<h2 style='margin: 0; font-size: 20px; color: #FACC15;'>SIDEQUESTKI UKM</h2>" +
            "<p style='margin: 4px 0 0; font-size: 12px; color: #94A3B8;'>Sistem Maklumat & Media Kampus</p>" +
          "</div>" +
          "<div style='padding: 24px; line-height: 1.6; font-size: 14px; color: #D1D5DB;'>" +
            "<p>Salam sejahtera <strong>" + applicantName + "</strong>,</p>" +
            "<p>Permohonan hebahan untuk acara <strong style='color: #60A5FA;'>\"" + eventName + "\"</strong> telah diterima oleh sistem.</p>" +
            "<div style='background: #1E293B; border-left: 4px solid #FACC15; padding: 14px; margin: 18px 0; border-radius: 6px;'>" +
              "<p style='margin: 0; font-size: 14px; color: #FDE047;'><strong>Status Semasa: SEDANG DIPROSES (IN REVIEW)</strong></p>" +
              (adminRemarks ? "<p style='margin: 8px 0 0; font-size: 13px; color: #E5E7EB;'><strong>Catatan Urusetia:</strong> " + adminRemarks + "</p>" : "") +
            "</div>" +
            "<p>Pasukan Mass Media sedang menyemak butiran dan keserasian poster/jadual anda sebelum hebahan rasmi dikeluarkan.</p>" +
            "<p style='font-size: 12px; color: #9CA3AF; margin-top: 24px; border-top: 1px solid #1F2937; padding-top: 14px;'>" +
              "Sekiranya ada pertanyaan, sila balas terus emel ini.<br/><em>Pasukan Sidequestki UKM</em>" +
            "</p>" +
          "</div>" +
        "</div>";

      MailApp.sendEmail({
        to: targetEmail,
        name: "Sidequestki UKM Team",
        replyTo: adminEmail,
        subject: subject,
        body: plainBody,
        htmlBody: htmlBody
      });

      sheet.getRange(editedRow, emailLogColIndex).setValue("SENT - PROCESS");
    }

    // =======================================================================
    // KES 2: STATUS DITUKAR KEPADA "APPROVED" (Lulus & Masuk Web)
    // =======================================================================
    else if (statusVal === "APPROVED" && emailLogVal !== "SENT - APPROVED") {
      var subject = "🎉 [Sidequestki UKM] Tahniah! Program Diluluskan: " + eventName;
      
      var plainBody = "Tahniah " + applicantName + "!\n\n" +
        "Hebahan program \"" + eventName + "\" telah DILULUSKAN (APPROVED) oleh pasukan Sidequestki UKM.\n\n" +
        "Acara anda kini disenaraikan secara LIVE di Quest Board:\n" +
        "https://sidequestki.github.io/sidequestki/\n\n" +
        (adminRemarks ? "Catatan Tambahan: " + adminRemarks + "\n\n" : "\n") +
        "Program anda juga dimasukkan dalam senarai giliran Weekly Monday Blast ke media sosial rasmi UKM.\n\n" +
        "Terima kasih atas inisiatif menganjurkan program berkualiti untuk warga UKM!\n\n" +
        "Salam hormat,\nPasukan Sidequestki UKM";

      var htmlBody = 
        "<div style='font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0B0F19; color: #F3F4F6; border-radius: 12px; overflow: hidden; border: 1px solid #1F2937;'>" +
          "<div style='background: #1E293B; padding: 20px; text-align: center; border-bottom: 1px solid #374151;'>" +
            "<h2 style='margin: 0; font-size: 20px; color: #10B981;'>SIDEQUESTKI UKM</h2>" +
            "<p style='margin: 4px 0 0; font-size: 12px; color: #94A3B8;'>Sistem Maklumat & Media Kampus</p>" +
          "</div>" +
          "<div style='padding: 24px; line-height: 1.6; font-size: 14px; color: #D1D5DB;'>" +
            "<p>Tahniah <strong>" + applicantName + "</strong>,</p>" +
            "<p>Permohonan program <strong style='color: #60A5FA;'>\"" + eventName + "\"</strong> telah <strong style='color: #10B981;'>DILULUSKAN (APPROVED)</strong>.</p>" +
            "<div style='background: #111827; border-left: 4px solid #10B981; padding: 14px; margin: 18px 0; border-radius: 6px;'>" +
              "<p style='margin: 0; font-size: 13px; color: #E5E7EB;'>" +
                "✅ <strong>Status:</strong> Siap untuk Hebahan Rasmi.<br/>" +
                "📱 <strong>Paparan Langsung:</strong> Acara kini aktif di papan kenyataan digital." +
              "</p>" +
              (adminRemarks ? "<p style='margin: 8px 0 0; font-size: 13px; color: #A7F3D0;'><strong>Catatan:</strong> " + adminRemarks + "</p>" : "") +
            "</div>" +
            "<p style='text-align: center; margin: 24px 0;'>" +
              "<a href='https://sidequestki.github.io/sidequestki/' style='background: #10B981; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;'>" +
                "Lihat Paparan Live di Web &rarr;" +
              "</a>" +
            "</p>" +
            "<p style='font-size: 12px; color: #9CA3AF; margin-top: 24px; border-top: 1px solid #1F2937; padding-top: 14px;'>" +
              "Sekiranya terdapat sebarang kemas kini tarikh/lokasi, sila balas emel ini dengan segera.<br/><em>Pasukan Sidequestki UKM</em>" +
            "</p>" +
          "</div>" +
        "</div>";

      MailApp.sendEmail({
        to: targetEmail,
        name: "Sidequestki UKM Team",
        replyTo: adminEmail,
        subject: subject,
        body: plainBody,
        htmlBody: htmlBody
      });

      sheet.getRange(editedRow, emailLogColIndex).setValue("SENT - APPROVED");
    }

    // =======================================================================
    // KES 3: STATUS DITUKAR KEPADA "REJECTED" (Ditolak / Perlu Pembetulan)
    // =======================================================================
    else if (statusVal === "REJECTED" && emailLogVal !== "SENT - REJECTED") {
      var subject = "[Sidequestki UKM] Status: Permohonan Program Tidak Diluluskan - " + eventName;
      
      var plainBody = "Salam " + applicantName + ",\n\n" +
        "Terima kasih atas penyerahan program \"" + eventName + "\" ke Sidequestki UKM.\n\n" +
        "Dukacita dimaklumkan bahawa permohonan ini TIDAK DAPAT DILULUSKAN (REJECTED) atas sebab berikut:\n" +
        (adminRemarks ? "Sebab Penolakan / Catatan: " + adminRemarks + "\n\n" : "- Maklumat asas / poster / surat kelulusan tidak lengkap atau pautan pendaftaran tidak boleh diakses.\n\n") +
        "Anda dialu-alukan untuk membetulkan butiran tersebut dan menghantar semula borang baharu.\n\n" +
        "Salam hormat,\nPasukan Sidequestki UKM";

      var htmlBody = 
        "<div style='font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0B0F19; color: #F3F4F6; border-radius: 12px; overflow: hidden; border: 1px solid #1F2937;'>" +
          "<div style='background: #1E293B; padding: 20px; text-align: center; border-bottom: 1px solid #374151;'>" +
            "<h2 style='margin: 0; font-size: 20px; color: #EF4444;'>SIDEQUESTKI UKM</h2>" +
            "<p style='margin: 4px 0 0; font-size: 12px; color: #94A3B8;'>Sistem Maklumat & Media Kampus</p>" +
          "</div>" +
          "<div style='padding: 24px; line-height: 1.6; font-size: 14px; color: #D1D5DB;'>" +
            "<p>Salam <strong>" + applicantName + "</strong>,</p>" +
            "<p>Terima kasih atas penyerahan program <strong style='color: #F87171;'>\"" + eventName + "\"</strong>.</p>" +
            "<p>Dukacita dimaklumkan bahawa permohonan ini <strong style='color: #EF4444;'>TIDAK DAPAT DILULUSKAN</strong> buat masa ini.</p>" +
            "<div style='background: #1F1919; border-left: 4px solid #EF4444; padding: 14px; margin: 18px 0; border-radius: 6px;'>" +
              "<p style='margin: 0; font-size: 13px; color: #FCA5A5;'><strong>Sebab Penolakan / Tindakan Diperlukan:</strong></p>" +
              "<p style='margin: 6px 0 0; font-size: 13px; color: #E5E7EB;'>" +
                (adminRemarks ? adminRemarks : "Pautan pendaftaran tidak boleh dibuka, atau maklumat penting (tarikh/venue/merit) didapati bercanggah dengan kertas kerja.") +
              "</p>" +
            "</div>" +
            "<p>Anda boleh membetulkan butiran ini dan menghantar semula permohonan baharu.</p>" +
            "<p style='font-size: 12px; color: #9CA3AF; margin-top: 24px; border-top: 1px solid #1F2937; padding-top: 14px;'>" +
              "Sekiranya ini adalah kesilapan, sila hubungi kami semula dengan membalas emel ini.<br/><em>Pasukan Sidequestki UKM</em>" +
            "</p>" +
          "</div>" +
        "</div>";

      MailApp.sendEmail({
        to: targetEmail,
        name: "Sidequestki UKM Team",
        replyTo: adminEmail,
        subject: subject,
        body: plainBody,
        htmlBody: htmlBody
      });

      sheet.getRange(editedRow, emailLogColIndex).setValue("SENT - REJECTED");
    }
  }
}
