# Google Sheets backend — setup

The booking flow and both forms use a single Google Sheet as their database,
reached through a Google Apps Script web app. No server or paid DB required.

## What lives where

| Tab        | Written by                        | Read by                |
|------------|-----------------------------------|------------------------|
| `Pilots`   | pilot signup form + `setup()` seed | booking page (pilot picker) |
| `Quotes`   | homepage "Get a quote" form        | — (you)                |
| `Bookings` | booking page "Accept & Book"       | — (you)                |

`Pilots` columns: `id, name, phone, initials, color, rating, reviews, lat, lng, certs, status, createdAt`
Only rows with `status = active` are offered to customers. New signups are added
as `active` automatically — change the value in `apps-script/Code.gs` (`appendPilot`)
to `pending` if you want to vet pilots before they go live.

## One-time deployment

1. Create a new Google Sheet (any name).
2. **Extensions → Apps Script**. Delete the stub, paste the contents of
   [`apps-script/Code.gs`](apps-script/Code.gs), save.
3. Run the `setup` function once (pick it in the toolbar dropdown, click **Run**).
   Authorise when prompted. This creates the three tabs and seeds three pilots.
4. **Deploy → New deployment → Web app**:
   - *Execute as*: **Me**
   - *Who has access*: **Anyone**
   - Deploy, then copy the `…/exec` URL.
5. Paste that URL into [`src/lib/config.ts`](src/lib/config.ts) as `APPS_SCRIPT_URL`,
   commit, and push (Vercel redeploys automatically).

## After editing the script

Apps Script serves the **last published version**, so changes don't take effect
until you redeploy: **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy.**

## How the app uses it

- Booking page calls `GET {APPS_SCRIPT_URL}?type=pilots` on load and ranks pilots
  by real distance from the pinned shoot location. If the request fails (offline,
  not yet deployed), it falls back to the seed list in `src/lib/pilots.ts`, so
  booking never breaks.
- The pilot signup form already `POST`s `{ formType: "pilot", … }`; the script
  turns that into a new `Pilots` row, so applicants become bookable with no manual step.
