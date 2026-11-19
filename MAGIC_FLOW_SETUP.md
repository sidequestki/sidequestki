# 🪄 The Sidequestki Magic Flow (Complete Setup)

This guide shows you how to connect **Google Forms $\rightarrow$ Google Sheets $\rightarrow$ Live Website** so you never have to type anything or download any files.

```
[Club fills Google Form] 
       │ (Auto-fills instantly)
       ▼
[Row appears in Google Sheet]
       │ (Admin selects "APPROVED" in dropdown)
       ▼
[Card appears LIVE on Sidequestki Website!]
```

---

## ⚡ 3-Minute Setup

### Step 1: Create the Google Form (2 mins)
1. Go to **[forms.google.com](https://forms.google.com)** and create a new form named:  
   **`Sidequestki | Weekly Event Submission`**
2. Add these exact questions:
   * **Title** *(Short answer)*
   * **Organizer** *(Short answer)*
   * **Day** *(Dropdown: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday)*
   * **Date** *(Date picker)*
   * **Time** *(Short answer, e.g. "2:00 PM – 5:00 PM")*
   * **Venue** *(Short answer, e.g. "Faculty Lab 2")*
   * **Description** *(Short answer — one sentence pitch)*
   * **Badges** *(Checkboxes: 🍔 Free Food, 🎖️ Merits, 📜 E-Cert, 🎟️ Free Entry)*
   * **Registration_URL** *(Link to their registration form)*

---

### Step 2: Connect Form to Google Sheets (10 seconds)
1. In your Google Form, click the **"Responses"** tab at the top.
2. Click the green **"Link to Sheets"** icon (top right).
3. Click **"Create"**. A new Google Sheet will open with all the form questions as columns!

---

### Step 3: Add the "Status" Approval Dropdown (30 seconds)
1. In your newly created Google Sheet, add one new column header at the end: **`Status`**.
2. Select that entire column $\rightarrow$ Click **Data** $\rightarrow$ **Data validation** $\rightarrow$ **Add rule**.
3. Under *Criteria*, choose **Dropdown**:
   * Option 1: `APPROVED` (Green)
   * Option 2: `PENDING` (Yellow)
   * Option 3: `REJECTED` (Red)
4. Click **Done**.

---

### Step 4: Publish to Web (20 seconds)
1. In your Google Sheet, click **File $\rightarrow$ Share $\rightarrow$ Publish to web**.
2. Under *Link*, change "Web page" to **Comma-separated values (.csv)**.
3. Click **Publish** and copy the link.
   *(It looks like: `https://docs.google.com/spreadsheets/d/e/.../pub?output=csv`)*

---

### Step 5: Connect to Sidequestki (10 seconds)
1. Open **`index.html`** in your browser.
2. Click the top button: **`⚙️ Sheet Sync`**.
3. Paste your link and click **"Connect & Sync Now"**.

---

## 🎯 That's It! How You Run It Every Week:
1. Clubs fill the form before **Friday at 11:59 PM**.
2. You open the Google Sheet on your phone during the weekend.
3. Click the dropdown and change valid events to **`APPROVED`**.
4. **Boom!** They are live on the website automatically. No downloads, no coding.
