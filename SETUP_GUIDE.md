# SIDEQUESTKI — Quick Setup & Deployment Guide ⚔️

Welcome to **Sidequestki**! Your project is already structured and ready to go.

---

## 📁 What Has Been Created in Your Workspace

1. **`index.html`**  
   The live mobile-responsive Quest Board web application. Features:
   * Real-time search by keyword (club, topic, venue).
   * Day tabs (`All`, `Today`, `Wed`, `Thu`, `Fri`, `Sat`, `Sun`).
   * Loot / Perk filter pills (`🍔 Free Makan`, `🎖️ Merits`, `📜 E-Cert`, `🎟️ Free Entry`).
   * **`+ Add to Calendar`** button (automatically creates a Google Calendar event with 1-hour pre-alerts).
   * **`Accept Quest`** direct registration button.
   * Organizer submission modal highlighting the **Friday 11:59 PM Cutoff**.

2. **`data/events.json`**  
   Pre-loaded with 6 sample campus events (workshops, sports, acoustic night, food drive) for instant testing.

3. **`SIDEQUESTKI_Project_Master_Blueprint.pdf`**  
   The executive master PDF blueprint with all operational rules, cutoff standards, intake forms, and risk protocols.

---

## 🚀 How to Preview Locally Right Now

You don't need any complex software:
* Simply **double-click `index.html`** in your file manager to open it in Chrome, Edge, or Brave.
* Or run this one-liner in your terminal to view it like a live website:
  ```powershell
  python -m http.server 8080
  ```
  Then open `http://localhost:8080` in your browser.

---

## 📊 Connecting to a Live Google Sheet (Zero-Code CMS)

To let your team add events from Google Sheets on your phone/laptop and have them appear live on the website:

### Step 1: Create Your Google Sheet
Create a sheet with these exact column headers in Row 1:
```text
Title | Organizer | Day | Date | Time | Venue | Description | Badges | Target | Registration_URL | Status
```

### Step 2: Publish the Sheet to Web (CSV)
1. In Google Sheets, click **File $\rightarrow$ Share $\rightarrow$ Publish to web**.
2. Under "Link", choose your sheet tab and select **Comma-separated values (.csv)**.
3. Click **Publish** and copy the generated link (looks like: `https://docs.google.com/spreadsheets/d/e/.../pub?output=csv`).

### Step 3: Paste into `index.html`
In `index.html`, replace the fetch URL in line 440 with your published CSV link using PapaParse or a simple CSV reader, or keep using `data/events.json` if you prefer GitHub commits!

---

## 🌐 Deploy Free on GitHub Pages (In 2 Minutes)

1. Create a free repository on GitHub called `sidequestki`.
2. Push or upload these files (`index.html`, `data/events.json`).
3. Go to **Settings $\rightarrow$ Pages $\rightarrow$ Source: Deploy from branch (`main` / root)**.
4. Your website is instantly live at:
   ```text
   https://<your-username>.github.io/sidequestki
   ```

---

## ⏰ The Golden Weekly Rules to Remember
* **Friday at 11:59 PM:** Intake closes for next week.
* **Saturday & Sunday:** Admin reviews links & toggles `APPROVED`.
* **Monday at 8:00 AM:** **The Monday Blast** goes live! Tag featured clubs for free organic reposts.
