"use client";
import { Navbar } from "@/components/Navbar";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Book a drone now", href: "/book" },
  { label: "Airspace Map", href: "/map" },
  { label: "Fly with us", href: "/pilots" },
];

export default function GamePage() {
  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      <Navbar links={NAV_LINKS} hideCta={true} />
      <iframe
        src="/drone-game.html"
        style={{ marginTop: "64px", width: "100%", height: "calc(100vh - 64px)", border: "none", display: "block" }}
        title="3D Drone Simulator: Hyderabad Edition"
        allowFullScreen
      />
    </div>
  );
}
