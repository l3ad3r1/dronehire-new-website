"use client";

import { useState } from "react";
import { NAV_LINKS, WHATSAPP_URL } from "@/lib/content";
import type { NavLink } from "@/types";

interface NavbarProps {
  links?: NavLink[];
  ctaLabel?: string;
  ctaHref?: string;
  ctaExternal?: boolean;
}

export function Navbar({
  links = NAV_LINKS,
  ctaLabel = "Book a shoot →",
  ctaHref = WHATSAPP_URL,
  ctaExternal = true,
}: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#121212]/95 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
        <a href="/" className="font-display text-sm font-bold tracking-[0.2em] uppercase text-white shrink-0">
          DRONEHIRE
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-mono text-xs tracking-wider text-white/65 hover:text-white transition-colors whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={ctaHref}
            {...(ctaExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-mono text-xs tracking-wider hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            {ctaLabel}
          </a>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1.5"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-white transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all ${open ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#121212] border-t border-white/10 px-6 py-4 flex flex-col gap-1">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-mono text-xs tracking-wider text-white/70 hover:text-white py-2.5 border-b border-white/5 last:border-0 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href={ctaHref}
            {...(ctaExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            onClick={() => setOpen(false)}
            className="mt-3 w-full h-11 flex items-center justify-center bg-primary text-primary-foreground font-mono text-xs tracking-wider"
          >
            {ctaLabel}
          </a>
        </div>
      )}
    </nav>
  );
}
