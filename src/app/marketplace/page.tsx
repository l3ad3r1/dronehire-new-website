import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { NAV_LINKS } from "@/lib/content";
import { NotifyForm } from "./NotifyForm";

export const metadata: Metadata = {
  title: "Drone Marketplace — Coming Soon | DroneHire",
  description:
    "Buy and sell drones, parts and accessories. A streamlined marketplace for pilots, dealers and manufacturers — launching soon on DroneHire.",
};

const FEATURES = [
  {
    icon: "🚁",
    title: "Drones & frames",
    description: "New and used drones from verified sellers — DJI, Autel, custom FPV builds and commercial rigs.",
  },
  {
    icon: "🔧",
    title: "Parts & components",
    description: "Motors, ESCs, propellers, batteries, and everything in between. Source parts locally in Hyderabad.",
  },
  {
    icon: "📡",
    title: "Accessories & gear",
    description: "Gimbals, ND filters, carry cases, ground stations. Everything a professional pilot needs.",
  },
  {
    icon: "🏭",
    title: "Dealers & manufacturers",
    description: "Direct listings from authorised dealers and Indian manufacturers. No middlemen.",
  },
  {
    icon: "🛡️",
    title: "DGCA-verified sellers",
    description: "Seller verification tied to DGCA pilot IDs — buy with confidence from licensed operators.",
  },
  {
    icon: "📦",
    title: "Pan-India shipping",
    description: "Logistics integration for safe, insured delivery of drone hardware across India.",
  },
];

export default function MarketplacePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0a0a0a]">
      <Navbar
        links={NAV_LINKS}
        ctaLabel="BOOK A DRONE NOW →"
        ctaHref="/book"
        ctaExternal={false}
      />

      <main>
        {/* Hero */}
        <section className="relative flex flex-col items-center justify-center text-center px-6 pt-40 pb-24">
          {/* Background glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-4 py-1.5 rounded-full mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase">
                Coming soon
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-6">
              DRONE<br />
              <span className="text-primary">MARKETPLACE</span>
            </h1>

            <p className="text-lg text-white/60 max-w-xl mx-auto leading-relaxed mb-4">
              Buy and sell drones, parts and accessories. Built for pilots, dealers and manufacturers.
            </p>
            <p className="font-mono text-sm text-white/40 max-w-lg mx-auto leading-relaxed mb-12">
              A streamlined marketplace connecting drone buyers, sellers, and service providers — launching in Hyderabad first.
            </p>

            {/* Notify form */}
            <NotifyForm />
            <p className="font-mono text-[10px] text-white/30 mt-3 tracking-wide">
              Be the first to know when we launch. No spam.
            </p>
          </div>
        </section>

        {/* What's coming */}
        <section className="py-16 lg:py-24 bg-[#121212]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-primary" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase">
                What&apos;s coming
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white mb-12">
              EVERYTHING THE DRONE INDUSTRY NEEDS
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((f) => (
                <div key={f.title} className="border border-white/10 p-6 hover:border-primary/40 transition-colors">
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <h3 className="font-display text-sm font-bold tracking-[0.1em] uppercase text-white mb-2">
                    {f.title}
                  </h3>
                  <p className="font-mono text-xs text-white/50 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA strip */}
        <section className="py-16 bg-[#0a0a0a] text-center px-6">
          <p className="font-mono text-xs tracking-[0.3em] text-white/40 uppercase mb-4">
            While you wait
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white mb-6">
            NEED A DRONE SHOOT TODAY?
          </h2>
          <a
            href="/book"
            className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-primary text-white font-mono text-xs tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors"
          >
            BOOK A DRONE NOW →
          </a>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
