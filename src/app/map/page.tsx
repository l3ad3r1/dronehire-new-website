"use client";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Book a Drone", href: "/book" },
  { label: "Drone Game", href: "/game" },
  { label: "Fly with us", href: "/pilots" },
];

const AirspaceMap = dynamic(
  () => import("@/components/airspace/AirspaceMap").then((m) => ({ default: m.AirspaceMap })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center bg-[#121212] text-white" style={{ height: "calc(100vh - 64px)" }}>
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#ff5500] border-t-transparent rounded-full mx-auto mb-3" />
          <p className="font-mono text-xs tracking-widest text-white/60 uppercase">Loading Airspace Map...</p>
        </div>
      </div>
    ),
  }
);

export default function MapPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar
        links={NAV_LINKS}
        ctaLabel="Book Now →"
        ctaHref="/book"
        ctaExternal={false}
      />
      <div className="bg-[#121212] border-b border-white/10 text-white/60 font-mono text-[10px] tracking-[0.2em] text-center py-2 px-4 uppercase">
        India Airspace — DGCA red/yellow zones for 55+ airports & facilities · Check before flying
      </div>
      <div style={{ height: "calc(100vh - 104px)" }}>
        <AirspaceMap />
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
