"use client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Book a Drone", href: "/book" },
  { label: "Airspace Map", href: "/map" },
  { label: "Fly with us", href: "/pilots" },
];

export default function GamePage() {
  return (
    <div className="min-h-screen overflow-x-hidden flex flex-col">
      <Navbar
        links={NAV_LINKS}
        ctaLabel="Book Now →"
        ctaHref="/book"
        ctaExternal={false}
      />
      <div style={{ flex: 1, minHeight: 0 }}>
        <iframe
          src="/drone-game.html"
          style={{ width: "100%", height: "calc(100vh - 64px)", border: "none", display: "block" }}
          title="3D Drone Simulator: Hyderabad Edition"
          allowFullScreen
        />
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
