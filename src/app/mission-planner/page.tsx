"use client";

import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";

const MissionPlanner = dynamic(
  () => import("@/components/mission/MissionPlanner").then((module) => ({ default: module.MissionPlanner })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-[#0a0a0a] text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="font-mono text-[10px] tracking-[0.25em] text-white/40">LOADING MISSION STUDIO</p>
        </div>
      </div>
    ),
  },
);

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Airspace Map", href: "/map" },
  { label: "Drone Training", href: "/game" },
  { label: "Fly with us", href: "/pilots" },
];

export default function MissionPlannerPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Navbar links={NAV_LINKS} ctaLabel="BOOK A PILOT →" ctaHref="/book" ctaExternal={false} />
      <div className="h-[calc(100vh-64px)] min-h-[700px] pt-16">
        <MissionPlanner />
      </div>
    </main>
  );
}
