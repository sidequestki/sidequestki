# Centralized Student Program Schedule Hub

## 1. Problem Statement & Objective
Students frequently miss campus workshops, talks, and club activities because event posters are scattered across multiple WhatsApp groups, Telegram channels, and Instagram stories. 

**Objective:** Create a single, permanent link and QR code that serves as the central source of truth for weekly student programs, making it effortless for students to discover events and register in one tap.

---

## 2. User Journey & Core Architecture

1. **Discovery:** Students scan a permanent QR code (shared on campus posters, social media bios, and pinned group messages) or open a single master link.
2. **Landing Hub (Linktree):** The master link opens a clean Linktree page containing:
   * **This Week's Program Schedule** (Direct link to current schedule)
   * **Next Week's Program Schedule** (Direct link to upcoming schedule)
   * **Submit an Event** (Form link for clubs/organizers)
   * **Additional Student Resources** (Club directory, feedback form, etc.)
3. **Schedule View:** Clicking either schedule opens a mobile-readable **interactive PDF** (or lightweight web page) styled like a familiar weekly timetable. Each event block displays:
   * Program Name
   * Organizer / Club Name
   * Venue / Platform
   * Time Slot
   * **Clickable Registration / Info Link** directly beneath the program title.

---

## 3. Technical Solutions for Permanent Links
To avoid updating Linktree URLs or reprinting QR codes every week, the schedule links must remain static while the underlying file updates:

* **Option A: GitHub Pages (Recommended)**
  * Host the files in a free GitHub repository with GitHub Pages enabled (e.g., `yourorg.github.io/this-week.pdf` and `yourorg.github.io/next-week.pdf`).
  * Weekly updates simply involve uploading the new PDF with the **exact same filename** to overwrite the previous file.
* **Option B: Google Drive ("Manage Versions")**
  * Upload the initial PDF to Google Drive and copy its public viewing link.
  * For weekly updates, right-click the existing file $\rightarrow$ **File information** $\rightarrow$ **Manage versions** $\rightarrow$ **Upload new version**. The sharing URL remains identical.

---

## 4. Phased Implementation Roadmap

### Phase 1: Manual MVP (Weeks 1–3)
*Goal: Validate student adoption and refine the schedule format with zero coding.*
* Set up the Linktree hub and generate the permanent QR code.
* Design a clean, color-coded weekly template (e.g., in Canva or Google Sheets) exported as a clickable PDF.
* Assign an admin to update "This Week" and "Next Week" every Sunday evening using the permanent link workflow.
* Monitor mobile viewing experience (ensure PDF file sizes remain under $2\text{ MB}$ so mobile browsers open them smoothly without forcing slow downloads).

### Phase 2: Standardized Intake & Approval
*Goal: Streamline how club organizers submit event details.*
* Create a **Google Form** collecting standardized fields: *Program Name, Organizer, Date, Start Time, End Time, Venue, Registration URL, and Poster Link*.
* Connect responses to a **Google Sheet** with an added `Status` column (`Pending` / `Approved`).
* Admins review and approve submissions before adding them to the weekly schedule.

### Phase 3: Full Automation
*Goal: Eliminate manual graphic design every week.*
* Build a lightweight, mobile-friendly static web page hosted free on GitHub Pages.
* Connect the web page to read approved rows directly from the Google Sheet (via published CSV or Apps Script).
* **Layout Shift for Overlapping Events:** While a fixed grid works well for non-overlapping class timetables, multiple student clubs often host events simultaneously. The automated web view should render events as a clean **day-by-day card list** (Monday–Sunday) sorted chronologically so overlapping events never collide visually.

---

## 5. Immediate Next Steps
- [ ] Reserve a clean handle on Linktree (or similar link-in-bio tool).
- [ ] Set up a free GitHub repository or Google Drive folder for `this-week.pdf` and `next-week.pdf`.
- [ ] Create the first week's clickable PDF schedule template.
- [ ] Generate a high-resolution QR code pointing to the master Linktree URL and begin distribution.