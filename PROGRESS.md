# DroneHirePlatform — Progress

## Last completed
All audit bugs from Dronehire.md fixed across two rounds (commits `17525d4` and `0fcb2c4`):
- Payment copy unified to milestone model across STATS bar, Process step 3, FAQ #3
- Corporate & Events pricing tier added (4th card, ₹25,000+)
- Nav + footer "Fly with us" → "Pilot network"
- Service CTAs wired to `/book` (not WhatsApp)
- Hero pills converted to buttons dispatching `CustomEvent("dh:filter")`
- Services.tsx is now a client component with filter tabs that respond to that event
- WhyUs heading and body rewritten to "nightmares we prevent" angle
- WhatsApp float button z-index fixed (z-[99])
- AltitudeHud ceiling state: turns red at 400ft with DGCA tooltip
- Pricing grid updated to `md:grid-cols-2 lg:grid-cols-4`
- PlatformSection H3 casing lowercased
- Legal pages added: /privacy, /terms, /refund, /pilot-agreement

## Deployment
- Platform: Vercel (auto-deploys from `l3ad3r1/dronehire-new-website` master)
- Live: https://dronehire-new-website.vercel.app
- `next.config.ts`: minimal SSR config, no static export
- All changes pushed; Vercel build triggered on commit `0fcb2c4`

## Google Sheets pilot database (done in code)
- `apps-script/Code.gs`: doGet(?type=pilots) returns active pilots; doPost routes
  quote/booking/pilot writes; pilot signups auto-append to Pilots tab; setup() seeds 3 pilots.
- `src/lib/pilots.ts`: fetchPilots() (GET sheet) + FALLBACK_PILOTS seed + haversineKm.
- `src/app/book/page.tsx`: pilots now fetched from sheet (fallback to seed), markers plotted
  dynamically, ranked by real distance from pinned location; Accept & Book POSTs to Bookings tab.
- `SETUP-SHEETS.md`: deploy steps + sheet schema.

## ACTION REQUIRED (manual, needs user's Google account)
Redeploy the Apps Script so doGet works live:
1. Paste apps-script/Code.gs into the bound Apps Script project.
2. Run setup() once. 3. Deploy > Manage deployments > New version.
Until then the booking page falls back to the seed pilot list (works, but static).

## Next steps
- After redeploy, verify GET ?type=pilots returns JSON and a pilot signup lands in the sheet.
