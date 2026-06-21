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

## Currently in progress
Nothing — all known audit items resolved.

## Next steps
- Verify the live Vercel deployment looks correct
- Address any new feedback or audit items
