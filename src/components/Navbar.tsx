import { NAV_LINKS, WHATSAPP_URL } from "@/lib/content";
import type { NavLink } from "@/types";

interface NavbarProps {
  links?: NavLink[];
  ctaLabel?: string;
  ctaHref?: string;
  /** When true (default) the CTA opens in a new tab (external link like WhatsApp). */
  ctaExternal?: boolean;
}

export function Navbar({
  links = NAV_LINKS,
  ctaLabel = "Book a shoot →",
  ctaHref = WHATSAPP_URL,
  ctaExternal = true,
}: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-[#121212]/90 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
        <a href="/" className="font-display text-sm font-bold tracking-[0.2em] uppercase text-white">DRONEHIRE</a>
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a key={link.label} href={link.href} className="font-mono text-xs tracking-wider text-white/65 hover:text-white transition-colors">{link.label}</a>
          ))}
        </div>
        <div className="hidden md:block">
          <a
            href={ctaHref}
            {...(ctaExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-mono text-xs tracking-wider hover:bg-primary/90 transition-colors"
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </nav>
  );
}
