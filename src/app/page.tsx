import { Navbar } from "@/components/Navbar";
import { AltitudeHud } from "@/components/AltitudeHud";
import { Hero } from "@/components/Hero";
import { StatBar } from "@/components/StatBar";
import { Process } from "@/components/Process";
import { Services } from "@/components/Services";
import { WhyUs } from "@/components/WhyUs";
import { Pricing } from "@/components/Pricing";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { NAV_LINKS, WHATSAPP_URL, FAQS } from "@/lib/content";

const HOME_NAV_LINKS = [
  ...NAV_LINKS,
  { label: "Book Now", href: "/book" },
  { label: "Airspace Map", href: "/map" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar
        links={HOME_NAV_LINKS}
        ctaLabel="Book on WhatsApp →"
        ctaHref={WHATSAPP_URL}
        ctaExternal={true}
      />
      <AltitudeHud />
      <main>
        <Hero />
        <StatBar />
        <Process />
        <Services />
        <WhyUs />
        <Pricing />
        <Faq items={FAQS} />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
