import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { WHATSAPP_URL } from "@/lib/content";

export const metadata: Metadata = {
  title: "Page Not Found — DroneHire",
  description: "This page has left restricted airspace. Head back to DroneHire to book a DGCA-licensed drone pilot in Hyderabad.",
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-background px-6 pt-16">
        <div className="max-w-lg text-center">
          <p className="font-mono text-xs tracking-[0.2em] text-primary uppercase mb-4">
            NOTAM: Zone Restricted
          </p>
          <h1 className="font-display text-6xl md:text-7xl font-bold tracking-tight text-foreground mb-4">
            404
          </h1>
          <p className="text-muted-foreground text-base md:text-lg mb-10">
            This page has drifted outside our flight zone. Let&apos;s get you back on course.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-mono text-xs tracking-[0.12em] uppercase hover:bg-primary/90 transition-colors"
            >
              Return Home
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-foreground/15 text-foreground font-mono text-xs tracking-[0.12em] uppercase hover:border-foreground/30 transition-colors"
            >
              Book a Drone Now
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
