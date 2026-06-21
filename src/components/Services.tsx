"use client";

import { useState, useEffect } from "react";
import { SERVICES } from "@/lib/content";

const FILTERS = ["All", "Real estate", "Weddings", "Construction", "Corporate"];

function matchesFilter(title: string, filter: string) {
  if (filter === "All") return true;
  const t = title.toLowerCase();
  if (filter === "Real estate") return t.includes("real estate");
  if (filter === "Weddings") return t.includes("wedding");
  if (filter === "Construction") return t.includes("construction");
  if (filter === "Corporate") return t.includes("corporate");
  return true;
}

export function Services() {
  const [active, setActive] = useState("All");

  useEffect(() => {
    function onFilter(e: Event) {
      const label = (e as CustomEvent<string>).detail;
      const mapped: Record<string, string> = {
        "Real estate": "Real estate",
        "Weddings": "Weddings",
        "Construction": "Construction",
        "Events": "Corporate",
      };
      setActive(mapped[label] ?? "All");
    }
    window.addEventListener("dh:filter", onFilter);
    return () => window.removeEventListener("dh:filter", onFilter);
  }, []);
  const visible = SERVICES.filter((s) => matchesFilter(s.title, active));

  return (
    <section id="services" className="py-10 lg:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-primary" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase">What we cover</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-6">BUILT FOR HYDERABAD&apos;S BUSIEST SHOOTS</h2>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-4 py-1.5 font-mono text-xs tracking-wider border transition-colors ${
                active === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-foreground/60 hover:border-primary hover:text-primary"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-12 lg:space-y-16">
          {visible.map((s, i) => {
            const reversed = i % 2 === 1;
            return (
              <div key={s.index} className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                {/* IMAGE cell */}
                <div className={`relative overflow-hidden group optical-bracket ${reversed ? "lg:order-2" : ""}`}>
                  <img src={s.image.replace(".png", ".webp")} alt={s.imageAlt} className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" decoding="async" />
                  <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-white/40" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-white/40" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-white/40" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-white/40" />
                </div>
                {/* TEXT cell */}
                <div className={reversed ? "lg:order-1" : ""}>
                  <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">{s.index}</span>
                  <h3 className="font-display text-2xl lg:text-3xl font-bold tracking-tight mt-3 mb-4">{s.title}</h3>
                  <p className="text-base text-muted-foreground leading-relaxed mb-6 max-w-md">{s.description}</p>
                  <a
                    href="/book"
                    className="inline-flex items-center gap-2 font-mono text-xs tracking-wider text-foreground hover:text-primary transition-colors"
                  >
                    {s.ctaLabel}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
