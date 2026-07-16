import { Navbar } from "@/components/Navbar";
import { AltitudeHud } from "@/components/AltitudeHud";
import { Hero } from "@/components/Hero";
import { StatBar } from "@/components/StatBar";
import { Process } from "@/components/Process";
import { Services } from "@/components/Services";
import { WhyUs } from "@/components/WhyUs";
import { FootageGallery } from "@/components/FootageGallery";
import { Pricing } from "@/components/Pricing";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { NAV_LINKS, WHATSAPP_URL, FAQS } from "@/lib/content";

const HOME_NAV_LINKS = [...NAV_LINKS];

function PlatformSection() {
  return (
    <section className="py-12 lg:py-16 bg-[#121212]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-primary" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase">Platform tools</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white mb-10">
          EVERYTHING YOU NEED IN ONE PLACE
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <a href="/marketplace" className="group border border-white/10 p-8 hover:border-primary transition-colors block">
            <div className="text-3xl mb-4">🛒</div>
            <h3 className="font-display text-sm font-bold tracking-[0.15em] uppercase text-white mb-3">
              DRONE MARKETPLACE
            </h3>
            <p className="font-mono text-xs text-white/50 leading-relaxed mb-6">
              Buy and sell drones, parts and accessories. Built for pilots, dealers and manufacturers. Streamlined marketplace connecting drone buyers, sellers, and service providers.
            </p>
            <span className="font-mono text-xs tracking-wider text-primary group-hover:underline">
              Coming soon →
            </span>
          </a>

          <a href="/map" className="group border border-white/10 p-8 hover:border-primary transition-colors block">
            <div className="text-3xl mb-4">🗺️</div>
            <h3 className="font-display text-sm font-bold tracking-[0.15em] uppercase text-white mb-3">
              Live airspace map
            </h3>
            <p className="font-mono text-xs text-white/50 leading-relaxed mb-6">
              Interactive map of all 55+ Indian airports and facilities with real DGCA red/yellow zone overlays. Check before you fly.
            </p>
            <span className="font-mono text-xs tracking-wider text-primary group-hover:underline">
              Open airspace map →
            </span>
          </a>

          <a href="/game" className="group border border-white/10 p-8 hover:border-primary transition-colors block">
            <div className="text-3xl mb-4">🎓</div>
            <h3 className="font-display text-sm font-bold tracking-[0.15em] uppercase text-white mb-3">
              DRONE TRAINING
            </h3>
            <p className="font-mono text-xs text-white/50 leading-relaxed mb-6">
              Practice drone operations in a risk-free 3D environment. Build flight skills, learn DGCA airspace rules, and prepare for your Remote Pilot Certificate exam.
            </p>
            <span className="font-mono text-xs tracking-wider text-primary group-hover:underline">
              Start training →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar
        links={HOME_NAV_LINKS}
        ctaLabel="BOOK A DRONE NOW →"
        ctaHref="/book"
        ctaExternal={false}
      />
      <AltitudeHud />
      <main>
        <Hero />
        <StatBar />
        <Process />
        <Services />
        <WhyUs />
        <FootageGallery />
        <Pricing />
        <Faq items={FAQS} />
        <PlatformSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
