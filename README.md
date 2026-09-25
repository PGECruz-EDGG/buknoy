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

   Anyone who has the database URL and the workspace key can read and write, so treat both like a password. If you later want named logins with per-user rights, Firebase Authentication can be added without changing the app's data.
4. Click the gear → **Project settings**, scroll to *Your apps*, click the **</>** (web) icon, register the app (no hosting needed), and copy the `firebaseConfig` object shown.
5. Open the site, pick your role, go to **Settings**, paste the `firebaseConfig` object, enter the workspace key, and click **Save and connect**. The sidebar indicator turns green ("live · shared"). Each unit head does the same once on each device they use.

Until Firebase is configured the app still works, but only on that browser (data is kept in the browser's storage and is not shared).

## 3. First run

- Choose your role on the entry screen. There are no passwords; every change is stamped with the role and an Asia/Manila timestamp in the record's change log.
- **Settings → Load sample data** fills the app with 26 tasks, 12 seats, 3 projects and 11 issues, all tagged SAMPLE, so every page has something to show. **Clear SAMPLE records** removes them in one click when you are ready for real data.
- **Settings → Download backup** saves every record as one JSON file; keep one before large changes. **Restore from backup** puts it back.
- The ⤢ button in the sidebar switches the whole app to full screen for the MANCOM projector.

## 4. Optional: AI-assisted import

The Import page reads members' monitoring sheets (Excel, CSV, text) and proposes tasks to create and update. With no key it uses a column reader that expects a header row (title, status, due, owner, remarks). Paste a Claude API key in **Settings → AI-assisted import** and it will instead understand free-form sheets and match rows to existing tasks by meaning. The key is stored only in that browser and is sent only to `api.anthropic.com`; enter it on your own computer rather than on shared ones. Check the current model name in the Anthropic documentation if the default one is retired.

## Notes

- Downloads (CSV, progress reports, org chart HTML/SVG, backups) save straight to the browser's download folder.
- The app is one HTML file; the org chart, projects and reports are all inside it. Excel reading loads the SheetJS library from cdnjs on demand; Firebase loads from Google's CDN when configured.
- Data model, rules and page descriptions are documented in the Buknoy project note `edgg-task-monitor.md`.
