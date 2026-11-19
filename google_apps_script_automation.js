/**
 * =========================================================================
 * SIDEQUESTKI AUTOMATED EMAIL DISPATCHER ⚔️
 * =========================================================================
 * How it works:
 * 1. Collects email address from your Google Form submissions.
 * 2. When you set the "Status" column to "APPROVED" in Google Sheets,
 *    it automatically sends an approval email to the organizer!
 * 3. When you set it to "REJECTED", it sends a polite rejection/resubmit email.
 * 4. Logs "SENT - APPROVED" so it never sends duplicates.
 * =========================================================================
 */

function onEdit(e) {
  if (!e || !e.range) return;

  const sheet = e.source.getActiveSheet();
  const range = e.range;
  const editedRow = range.getRow();
  const editedCol = range.getColumn();
  
  // Do not process edits on the header row
  if (editedRow === 1) return;

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Dynamically find column positions
  const statusColIndex = headers.findIndex(h => h.toString().trim().toLowerCase() === 'status') + 1;
  const emailColIndex = headers.findIndex(h => {
    const s = h.toString().trim().toLowerCase();
    return s.includes('email') || s.includes('e-mail');
  }) + 1;
  const eventNameColIndex = headers.findIndex(h => {
    const s = h.toString().trim().toLowerCase();
    return s.includes('event') || s.includes('title') || s.includes('program');
  }) + 1;
  const clubColIndex = headers.findIndex(h => {
    const s = h.toString().trim().toLowerCase();
    return s.includes('organizing') || s.includes('club') || s.includes('society');
  }) + 1;
  
  // Auto-create "Email Sent" tracking column if missing
  let emailLogColIndex = headers.findIndex(h => h.toString().trim().toLowerCase() === 'email sent') + 1;
  if (emailLogColIndex === 0) {
    emailLogColIndex = headers.length + 1;
    sheet.getRange(1, emailLogColIndex).setValue("Email Sent");
  }

  // Only run when the edited column is "Status"
  if (editedCol === statusColIndex) {
    const statusVal = range.getValue().toString().trim().toUpperCase();
    const emailLogVal = sheet.getRange(editedRow, emailLogColIndex).getValue().toString().trim();
    
    // Safety check: email column exists
    if (emailColIndex === 0) {
      Logger.log("Email column not found. Please ensure your form collects email addresses.");
      return;
    }

    const targetEmail = sheet.getRange(editedRow, emailColIndex).getValue().toString().trim();
    const eventName = sheet.getRange(editedRow, eventNameColIndex).getValue() || "Your Campus Event";
    const clubName = sheet.getRange(editedRow, clubColIndex).getValue() || "Organizer";

    if (!targetEmail || !targetEmail.includes("@")) return;

    // -------------------------------------------------------------
    // 1. APPROVED EMAIL DISPATCH
    // -------------------------------------------------------------
    if (statusVal === 'APPROVED' && emailLogVal !== 'SENT - APPROVED') {
      const subject = `⚔️ Your Sidequest has been APPROVED: ${eventName}`;
      
      const htmlBody = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0B0F19; color: #F3F4F6; border-radius: 14px; overflow: hidden; border: 1px solid #1F2937;">
          <div style="background: linear-gradient(135deg, #1E1B4B 0%, #1E3A8A 100%); padding: 24px; text-align: center; border-bottom: 1px solid #374151;">
            <h1 style="margin: 0; font-size: 22px; color: #FFFFFF; letter-spacing: -0.02em;">⚔️ SIDEQUESTKI</h1>
            <p style="margin: 6px 0 0; font-size: 13px; color: #93C5FD;">Campus & Youth Event Aggregator</p>
          </div>
          <div style="padding: 24px; line-height: 1.6; font-size: 14px; color: #D1D5DB;">
            <p>Hi <strong>${clubName}</strong>,</p>
            <p>Great news! Your event submission for <strong style="color: #60A5FA;">"${eventName}"</strong> has been reviewed and <strong style="color: #10B981;">APPROVED</strong> by the Sidequestki curation team.</p>
            
            <div style="background: #111827; border-left: 4px solid #10B981; padding: 14px; margin: 18px 0; border-radius: 6px;">
              <p style="margin: 0; font-size: 13px; color: #E5E7EB;">
                🎉 <strong>Status:</strong> Queued for the upcoming Monday Blast.<br/>
                📱 <strong>Live Sync:</strong> Your event is now visible on the live Quest Board!
              </p>
            </div>

            <p style="text-align: center; margin: 26px 0;">
              <a href="https://sidequestki.github.io/sidequestki/" style="background: #2563EB; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
                View Your Event on Sidequestki &rarr;
              </a>
            </p>

            <p style="font-size: 12px; color: #9CA3AF;">
              Thank you for bringing high-value programs to campus students!<br/>
              <em>— The Sidequestki Team</em>
            </p>
          </div>
        </div>
      `;

      MailApp.sendEmail({
        to: targetEmail,
        subject: subject,
        htmlBody: htmlBody
      });

      sheet.getRange(editedRow, emailLogColIndex).setValue("SENT - APPROVED");
    }

    // -------------------------------------------------------------
    // 2. REJECTED EMAIL DISPATCH
    // -------------------------------------------------------------
    else if (statusVal === 'REJECTED' && emailLogVal !== 'SENT - REJECTED') {
      const subject = `Update regarding your event submission: ${eventName}`;
      
      const htmlBody = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0B0F19; color: #F3F4F6; border-radius: 14px; overflow: hidden; border: 1px solid #1F2937;">
          <div style="background: #1E293B; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 20px; color: #FFFFFF;">SIDEQUESTKI</h1>
          </div>
          <div style="padding: 24px; line-height: 1.6; font-size: 14px; color: #D1D5DB;">
            <p>Hi <strong>${clubName}</strong>,</p>
            <p>Thank you for submitting <strong style="color: #F87171;">"${eventName}"</strong> to Sidequestki.</p>
            <p>After review, we were unable to approve this event for the upcoming weekly drop. Common reasons include:</p>
            <ul style="color: #9CA3AF; font-size: 13px;">
              <li>The registration URL is private, broken, or restricted.</li>
              <li>Essential logistics (date, time, venue) were incomplete.</li>
              <li>The submission arrived past the Friday 11:59 PM cutoff.</li>
            </ul>
            <p>You are welcome to fix your details and submit again before our next Friday cutoff!</p>
            <p style="font-size: 12px; color: #9CA3AF; margin-top: 24px;">
              Best regards,<br/>
              <em>The Sidequestki Team</em>
            </p>
          </div>
        </div>
      `;

      MailApp.sendEmail({
        to: targetEmail,
        subject: subject,
        htmlBody: htmlBody
      });

      sheet.getRange(editedRow, emailLogColIndex).setValue("SENT - REJECTED");
    }
  }
}
