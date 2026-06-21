import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { AltitudeHud } from "@/components/AltitudeHud";
import { PilotHero } from "@/components/PilotHero";
import { PilotJourney } from "@/components/PilotJourney";
import { EarningPotential } from "@/components/EarningPotential";
import { Requirements } from "@/components/Requirements";
import { FootageGallery } from "@/components/FootageGallery";
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
        <Faq items={PILOT_FAQS} />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
