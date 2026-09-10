"use client";

import { useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "BOOK A DRONE NOW", href: "/book" },
  { label: "Airspace Map", href: "/map" },
  { label: "Fly with us", href: "/pilots" },
];

const MODULES = [
  {
    step: "01",
    title: "Controlled takeoff",
    description: "Start the motors and rise gently to two metres with automatic stabilisation.",
  },
  {
    step: "02",
    title: "Stable hover",
    description: "Hold altitude between three and five metres while GPS braking keeps the aircraft steady.",
  },
  {
    step: "03",
    title: "Yaw and orientation",
    description: "Complete a full turn and learn how the aircraft nose changes your forward direction.",
  },
  {
    step: "04",
    title: "Beacon route",
    description: "Combine pitch, roll, yaw and altitude to fly a short three-point training route.",
  },
  {
    step: "05",
    title: "Safe landing",
    description: "Return to the home pad, brake the aircraft and finish with a slow, controlled descent.",
  },
  {
    step: "∞",
    title: "Free flight",
    description: "Change camera views, add light wind and explore the field after completing the basics.",
  },
];

export default function TrainingPage() {
  const simulatorRef = useRef<HTMLDivElement>(null);

  function scrollToSim() {
    simulatorRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0a0a0a]">
      <Navbar links={NAV_LINKS} hideCta={true} />

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-36 pb-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-primary" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase">Free · Browser-based · No download</span>
            <div className="h-px w-8 bg-primary" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-6">
            DRONE<br /><span className="text-primary">TRAINING</span>
          </h1>
          <p className="text-lg text-white/60 max-w-xl mx-auto leading-relaxed mb-3">
            Learn Mode 2 flight controls in a forgiving 3D training field before touching a real aircraft.
          </p>
          <p className="font-mono text-sm text-white/40 max-w-lg mx-auto leading-relaxed mb-10">
            Five guided lessons teach takeoff, hover, orientation, navigation and landing — with live telemetry on every flight.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToSim}
              className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-primary text-white font-mono text-xs tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors"
            >
              START TRAINING →
            </button>
            <span className="font-mono text-xs text-white/30 tracking-wide">Keyboard + touch controls · No signup needed</span>
          </div>
        </div>
      </section>

      {/* Training modules */}
      <section className="py-16 bg-[#121212]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-primary" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase">Training modules</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white mb-10">
            WHAT YOU'LL LEARN
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MODULES.map((m) => (
              <div key={m.title} className="border border-white/10 p-6 hover:border-primary/40 transition-colors">
                <div className="font-mono text-xs tracking-[0.2em] text-primary mb-4">MODULE / {m.step}</div>
                <h3 className="font-display text-sm font-bold tracking-[0.1em] uppercase text-white mb-2">
                  {m.title}
                </h3>
                <p className="font-mono text-xs text-white/50 leading-relaxed">{m.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Controls reference */}
      <section className="py-12 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-primary" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase">Controls</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { key: "W / S", action: "Altitude up / down" },
              { key: "A / D", action: "Turn left / right" },
              { key: "ARROWS", action: "Move in any direction" },
              { key: "SPACE", action: "Take off / land" },
              { key: "P", action: "Pause / resume" },
              { key: "C", action: "Change camera" },
              { key: "R", action: "Reset flight" },
              { key: "TOUCH", action: "Drag both sticks" },
            ].map(({ key, action }) => (
              <div key={key} className="border border-white/10 p-4 text-center">
                <p className="font-mono text-sm font-bold text-primary mb-1">{key}</p>
                <p className="font-mono text-[10px] text-white/40 leading-snug">{action}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simulator */}
      <div ref={simulatorRef} className="bg-[#fafafa] scroll-mt-16">
        <iframe
          src="/flight-lab/index.html"
          className="block h-[1950px] w-full border-0 sm:h-[1500px] lg:h-[1200px]"
          title="DroneHire Flight Lab — Mavic-style pilot trainer"
          allow="fullscreen"
          allowFullScreen
        />
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
