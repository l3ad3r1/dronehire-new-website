import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { AltitudeHud } from "@/components/AltitudeHud";
import { PilotHero } from "@/components/PilotHero";
import { PilotJourney } from "@/components/PilotJourney";
import { EarningPotential } from "@/components/EarningPotential";
import { Requirements } from "@/components/Requirements";
import { FootageGallery } from "@/components/FootageGallery";
import { GallerySubmitForm } from "@/components/GallerySubmitForm";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { PILOT_NAV_LINKS, PILOT_FAQS } from "@/lib/pilots-content";

export const metadata: Metadata = {
  title: "Fly With Us | DroneHire — Drone Pilots Hyderabad",
  description:
    "Join DroneHire and get a steady stream of paid drone shoots across Hyderabad — real estate, weddings, and construction surveys matched to your schedule.",
};

export default function PilotsPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar
        links={PILOT_NAV_LINKS}
        ctaLabel="Apply to fly →"
        ctaHref="#signup"
        ctaExternal={false}
      />
      <AltitudeHud />
      <main>
        <PilotHero />
        <PilotJourney />
        <EarningPotential />
        <Requirements />
        <FootageGallery />
        <section id="submit-footage" className="py-12 lg:py-16 bg-[#121212]">
          <div className="max-w-2xl mx-auto px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-primary" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase">Pilot portfolio</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              SHARE YOUR FOOTAGE
            </h2>
            <p className="font-mono text-xs text-white/50 mb-8 leading-relaxed">
              Showcase a clip from a recent shoot. Your footage appears in the gallery on this page and on the homepage,
              building trust with new customers — and helping you get more bookings.
            </p>
            <GallerySubmitForm />
          </div>
        </section>
        <Faq items={PILOT_FAQS} />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
