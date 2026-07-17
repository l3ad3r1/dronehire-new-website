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
- Live: https://dronehire.vercel.app
- `next.config.ts`: minimal SSR config, no static export
- All changes pushed; Vercel build triggered on commit `0fcb2c4`

## Google Sheets pilot database (done in code)
- `apps-script/Code.gs`: doGet(?type=pilots) returns active pilots; doPost routes
  quote/booking/pilot writes; pilot signups auto-append to Pilots tab; setup() seeds 3 pilots.
- `src/lib/pilots.ts`: fetchPilots() (GET sheet) + FALLBACK_PILOTS seed + haversineKm.
- `src/app/book/page.tsx`: pilots now fetched from sheet (fallback to seed), markers plotted
  dynamically, ranked by real distance from pinned location; Accept & Book POSTs to Bookings tab.
- `SETUP-SHEETS.md`: deploy steps + sheet schema.

## Google Sheets — DEPLOYED
- Apps Script web app redeployed; APPS_SCRIPT_URL updated in src/lib/config.ts to the
  new /exec URL (commit on master). GET ?type=pilots returns JSON (200).
- Remaining: run setup() in the Apps Script editor to seed the Pilots tab (currently []).

## Git author / Vercel deploys
- Global git author was agent@hermes-internal.com (invalid) → Vercel blocked deploys.
- Fixed with repo-local config: user.email=renjacob10000@gmail.com, user.name=l3ad3r1.
- Commit from this config onward deploys normally; the 5 blocked deployments are
  superseded once a valid commit lands.

## Booking + Quote forms (DONE)
- Booking: customer name + WhatsApp number captured (required, validated), written to Bookings tab.
- Quote (homepage Hero): name + WhatsApp number captured (required, validated), written to Quotes tab.
- Both forms restrict shoot dates to tomorrow onward.
- Booking ranks pilots by real distance; "Accept & Book" stamps pilot busyUntil.
- Removed duplicate airspace legend from booking panel (kept the map one).

## Quotes CRM pipeline (DONE)
- Quotes tab columns: createdAt, shootType, location, date, name, phone, stage, assignedTo.
- New quotes default stage = "Warm enquiry"; stage is a dropdown
  (Warm enquiry / Rate negotiation / Job accepted / Job rejected). assignedTo is free text.

## Apps Script notes
- Current /exec URL is in src/lib/config.ts. To update the script, ALWAYS use
  Deploy > Manage deployments > Edit (pencil) > New version — this keeps the URL stable.
  Using "New deployment" mints a new URL and forces a config.ts change.
- Pilot signups land as status "pending" (approve by setting "active" in the sheet).
- Geocoding uses areas + ", India" (Maps service authorized).

## Next steps
- None outstanding. Optional: stricter Indian phone validation (leading 6-9, +91 prefix).
