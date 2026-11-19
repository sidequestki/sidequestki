function testSendEmail() {
  var myEmail = Session.getActiveUser().getEmail();
  MailApp.sendEmail({
    to: myEmail,
    name: "Sidequestki Team",
    replyTo: myEmail,
    subject: "[Sidequestki] Test Email - Notification System Active",
    body: "Hi,\n\nThis is a test notification confirming that the Sidequestki automated email system is operational.\n\nBest regards,\nThe Sidequestki Team",
    htmlBody: "<div style='font-family: sans-serif; padding: 20px; color: #1F2937;'><h2 style='color:#2563EB;'>Sidequestki Notification Active</h2><p>This confirms that your Google Sheet email automation is operational and formatted cleanly.</p></div>"
  });
  Logger.log("Optimized test email sent to: " + myEmail);
}

function handleStatusChange(e) {
  if (!e || !e.range) return;

  var sheet = e.source.getActiveSheet();
  var range = e.range;
  var editedRow = range.getRow();
  var editedCol = range.getColumn();
  
  if (editedRow === 1) return;

  var lastCol = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  
  var statusColIndex = -1;
  var emailColIndex = -1;
  var eventNameColIndex = -1;
  var clubColIndex = -1;
  var emailLogColIndex = -1;

  for (var i = 0; i < headers.length; i++) {
    var h = headers[i].toString().trim().toLowerCase();
    if (h === "status") statusColIndex = i + 1;
    if (h.indexOf("email") !== -1) emailColIndex = i + 1;
    if (h.indexOf("event") !== -1 || h.indexOf("title") !== -1) eventNameColIndex = i + 1;
    if (h.indexOf("organizing") !== -1 || h.indexOf("club") !== -1) clubColIndex = i + 1;
    if (h === "email sent") emailLogColIndex = i + 1;
  }

  if (emailLogColIndex === -1) {
    emailLogColIndex = lastCol + 1;
    sheet.getRange(1, emailLogColIndex).setValue("Email Sent");
  }

  if (editedCol === statusColIndex) {
    var statusVal = range.getValue().toString().trim().toUpperCase();
    var emailLogVal = sheet.getRange(editedRow, emailLogColIndex).getValue().toString().trim();
    
    if (emailColIndex === -1) return;

    var targetEmail = sheet.getRange(editedRow, emailColIndex).getValue().toString().trim();
    var eventName = sheet.getRange(editedRow, eventNameColIndex).getValue() || "Your Campus Event";
    var clubName = sheet.getRange(editedRow, clubColIndex).getValue() || "Organizer";

    if (!targetEmail || targetEmail.indexOf("@") === -1) return;

    var adminEmail = Session.getActiveUser().getEmail();

    // -------------------------------------------------------------
    // 1. APPROVED EMAIL DISPATCH (Anti-Spam Optimized)
    // -------------------------------------------------------------
    if (statusVal === "APPROVED" && emailLogVal !== "SENT - APPROVED") {
      var subject = "[Sidequestki] Event Approved: " + eventName;
      
      var plainBody = "Hi " + clubName + ",\n\n" +
        "Great news! Your event submission for \"" + eventName + "\" has been approved by the Sidequestki team.\n\n" +
        "Your event is now queued to be featured on our live Quest Board and in our upcoming Monday Blast!\n\n" +
        "View the live schedule here:\n" +
        "https://sidequestki.github.io/sidequestki/\n\n" +
        "Thank you for bringing high-value programs to campus students.\n\n" +
        "Best regards,\n" +
        "The Sidequestki Team";

      var htmlBody = 
        "<div style='font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #0B0F19; color: #F3F4F6; border-radius: 12px; overflow: hidden; border: 1px solid #1F2937;'>" +
          "<div style='background: #1E293B; padding: 20px; text-align: center; border-bottom: 1px solid #374151;'>" +
            "<h2 style='margin: 0; font-size: 20px; color: #FFFFFF;'>SIDEQUESTKI</h2>" +
            "<p style='margin: 4px 0 0; font-size: 12px; color: #94A3B8;'>Campus & Youth Event Aggregator</p>" +
          "</div>" +
          "<div style='padding: 24px; line-height: 1.6; font-size: 14px; color: #D1D5DB;'>" +
            "<p>Hi <strong>" + clubName + "</strong>,</p>" +
            "<p>Great news! Your event submission for <strong style='color: #60A5FA;'>\"" + eventName + "\"</strong> has been reviewed and <strong style='color: #10B981;'>APPROVED</strong> by the Sidequestki curation team.</p>" +
            "<div style='background: #111827; border-left: 4px solid #10B981; padding: 12px 14px; margin: 18px 0; border-radius: 6px;'>" +
              "<p style='margin: 0; font-size: 13px; color: #E5E7EB;'>" +
                "🎉 <strong>Status:</strong> Queued for the upcoming Monday Blast.<br/>" +
                "📱 <strong>Live Sync:</strong> Your event is now visible on the live Quest Board." +
              "</p>" +
            "</div>" +
            "<p style='text-align: center; margin: 24px 0;'>" +
              "<a href='https://sidequestki.github.io/sidequestki/' style='background: #2563EB; color: #FFFFFF; text-decoration: none; padding: 12px 22px; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;'>" +
                "View Live Quest Board &rarr;" +
              "</a>" +
            "</p>" +
            "<p style='font-size: 12px; color: #9CA3AF; margin-top: 24px; border-top: 1px solid #1F2937; padding-top: 14px;'>" +
              "Questions? Simply reply to this email.<br/>" +
              "<em>The Sidequestki Team</em>" +
            "</p>" +
          "</div>" +
        "</div>";

      MailApp.sendEmail({
        to: targetEmail,
        name: "Sidequestki Team",
        replyTo: adminEmail,
        subject: subject,
        body: plainBody,
        htmlBody: htmlBody
      });

      sheet.getRange(editedRow, emailLogColIndex).setValue("SENT - APPROVED");
    }

    // -------------------------------------------------------------
    // 2. REJECTED EMAIL DISPATCH (Anti-Spam Optimized)
    // -------------------------------------------------------------
    else if (statusVal === "REJECTED" && emailLogVal !== "SENT - REJECTED") {
      var subject = "[Sidequestki] Update on your submission: " + eventName;
      
      var plainBody = "Hi " + clubName + ",\n\n" +
        "Thank you for submitting \"" + eventName + "\" to Sidequestki.\n\n" +
        "After review, we were unable to approve this event for the upcoming weekly drop. Common reasons include:\n" +
        "- The registration URL is private, broken, or restricted.\n" +
        "- Essential details (date, time, venue) were incomplete.\n" +
        "- The submission arrived past the Friday 11:59 PM cutoff.\n\n" +
        "You are welcome to update your details and submit again before our next Friday cutoff!\n\n" +
        "Best regards,\n" +
        "The Sidequestki Team";

      var htmlBody = 
        "<div style='font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #0B0F19; color: #F3F4F6; border-radius: 12px; overflow: hidden; border: 1px solid #1F2937;'>" +
          "<div style='background: #1E293B; padding: 20px; text-align: center;'>" +
            "<h2 style='margin: 0; font-size: 20px; color: #FFFFFF;'>SIDEQUESTKI</h2>" +
          "</div>" +
          "<div style='padding: 24px; line-height: 1.6; font-size: 14px; color: #D1D5DB;'>" +
            "<p>Hi <strong>" + clubName + "</strong>,</p>" +
            "<p>Thank you for submitting <strong style='color: #F87171;'>\"" + eventName + "\"</strong> to Sidequestki.</p>" +
            "<p>After review, we were unable to approve this event for the upcoming weekly drop. Common reasons include:</p>" +
            "<ul style='color: #9CA3AF; font-size: 13px;'>" +
              "<li>The registration URL is private, broken, or restricted.</li>" +
              "<li>Essential details (date, time, venue) were incomplete.</li>" +
              "<li>The submission arrived past the Friday 11:59 PM cutoff.</li>" +
            "</ul>" +
            "<p>You are welcome to update your details and submit again before our next Friday cutoff!</p>" +
            "<p style='font-size: 12px; color: #9CA3AF; margin-top: 24px; border-top: 1px solid #1F2937; padding-top: 14px;'>" +
              "Best regards,<br/>" +
              "<em>The Sidequestki Team</em>" +
            "</p>" +
          "</div>" +
        "</div>";

      MailApp.sendEmail({
        to: targetEmail,
        name: "Sidequestki Team",
        replyTo: adminEmail,
        subject: subject,
        body: plainBody,
        htmlBody: htmlBody
      });

      sheet.getRange(editedRow, emailLogColIndex).setValue("SENT - REJECTED");
    }
  }
}
