# EDGG Task Monitor — website edition

A single-file web app for the Enterprise Development and Growth Group of WRLD Capital Holdings: task register, Kanban, timeline, routines, unit pages, projects (team, completion, inventory, price list, categorised issues), org chart with JPDFs, weekly MANCOM report, member-file import and downloadable progress reports.

Everything is in `index.html`. There is no build step and no server of your own; shared data lives in a Firebase Realtime Database that you create once.

## 1. Put it on GitHub Pages (about 10 minutes)

1. Sign in to the work GitHub account (create one at github.com with your WRLD e-mail if it does not exist yet).
2. Click **New repository**. Name it, for example, `edgg-monitor`. Choose **Private** if the organisation has GitHub Pages on private repos (Pro/Team/Enterprise); otherwise **Public** — the page itself contains no company data, only the app. Tick nothing else and click **Create repository**.
3. On the empty repository page click **uploading an existing file**, drag in `index.html`, `README.md` and `.nojekyll`, and click **Commit changes**.
4. Go to **Settings → Pages**. Under *Build and deployment* choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
5. After a minute the page shows the address, in the form `https://<account>.github.io/edgg-monitor/`. That is the link to share with the four unit heads.

To update the app later, upload a new `index.html` over the old one (Add file → Upload files) and commit; Pages redeploys on its own.

## 2. Create the shared database (about 10 minutes, once)

1. Go to console.firebase.google.com with the work Google account and click **Add project**. Name it `edgg-monitor`; Google Analytics can be off.
2. In the project, open **Build → Realtime Database → Create Database**. Pick the Singapore region (`asia-southeast1`), start in **locked mode**, and click **Enable**.
3. Open the **Rules** tab, replace the contents with the block below, and **Publish**. Use a long, private workspace key instead of `edgg` (for example `edgg-7f3k92`); the same key goes into the app's Settings on every device.

   ```json
   {
     "rules": {
       "edgg-7f3k92": { ".read": true, ".write": true }
     }
   }
   ```

   Anyone who has the database URL and the workspace key can read and write directly, so treat both like a password and share the site link only inside WRLD. The app's own sign-in (section 3) controls what each person can change inside the app and stores passwords only as salted hashes; it is not a substitute for those two secrets. If you later want database-level security per user, Firebase Authentication can be added without changing the app's data.
4. Click the gear → **Project settings**, scroll to *Your apps*, click the **</>** (web) icon, register the app (no hosting needed), and copy the `firebaseConfig` object shown.
5. Open `index.html` in a text editor (Notepad is fine). Near the top there are two lines:

   ```js
   window.EDGG_FIREBASE = null;
   window.EDGG_WORKSPACE = "edgg";
   ```

   Replace `null` with the `firebaseConfig` object you copied and set the workspace key to the one in your rules. Save, and upload this `index.html` to the repository (step 1.3 or an update). From then on **every phone, tablet and laptop that opens the link is connected automatically** — nothing to paste on each device — and the sidebar indicator shows green ("live · shared").

   If you would rather not edit the file, Settings → Shared database lets each device paste the config instead.

Until Firebase is configured the app still works, but only on that browser (data is kept in the browser's storage and is not shared).

## How the sharing works

Every record (task, project, issue, seat, account) is one entry in the Firebase Realtime Database. When anyone saves a change, Firebase pushes it to every open copy of the site within about a second — the Director's Command Board on the projector updates while a unit head changes a status from a phone in the field. If a phone loses signal, changes made meanwhile are queued and sent when it reconnects. Nothing is stored on GitHub except the app itself; GitHub Pages only serves the page.

## 3. First run and accounts

- The first person to open the connected site creates the **administrator** account (the Director). After that, the entry screen is a sign-in.
- **Settings → Accounts** lists everyone named on the org chart. **Create missing accounts** makes one account per person with a username (initial + surname) and a temporary password, shown once with copy and CSV buttons; hand each line to the person privately. They set their own password at first sign-in, and can change it later from the sidebar.
- Levels: **Director** can change everything; **Department head** (the top seat of a department) can edit their department's tasks, projects and issues; **Member** can create and edit their own tasks, comment anywhere, log and update project issues, and read everything else. The level is set automatically from the seat's place on the chart and can be changed in the Accounts table. Reset password, disable and delete are there too.
- Every change is stamped with the person's name and seat and an Asia/Manila timestamp in the record's change log.
- To go back to the password-free role dropdown, set `window.EDGG_ACCOUNTS = false;` in `index.html`.
- **Settings → Load sample data** fills the app with 26 tasks, 12 seats, 3 projects and 11 issues, all tagged SAMPLE, so every page has something to show. **Clear SAMPLE records** removes them in one click when you are ready for real data.
- **Settings → Download backup** saves every record as one JSON file; keep one before large changes. **Restore from backup** puts it back.
- The ⤢ button in the sidebar switches the whole app to full screen for the MANCOM projector.

## 4. Optional: AI-assisted import

The Import page reads members' monitoring sheets (Excel, CSV, text) and proposes tasks to create and update. With no key it uses a column reader that expects a header row (title, status, due, owner, remarks). Paste a Claude API key in **Settings → AI-assisted import** and it will instead understand free-form sheets and match rows to existing tasks by meaning. The key is stored only in that browser and is sent only to `api.anthropic.com`; enter it on your own computer rather than on shared ones. Check the current model name in the Anthropic documentation if the default one is retired.

## Notes

- Downloads (CSV, progress reports, org chart HTML/SVG, backups) save straight to the browser's download folder.
- The app is one HTML file; the org chart, projects and reports are all inside it. Excel reading loads the SheetJS library from cdnjs on demand; Firebase loads from Google's CDN when configured.
- Data model, rules and page descriptions are documented in the Buknoy project note `edgg-task-monitor.md`.
