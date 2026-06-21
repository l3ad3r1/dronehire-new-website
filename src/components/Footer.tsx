import { FOOTER_COLUMNS, FOOTER_DISCLAIMER, FOOTER_LEGAL, FOOTER_TAGLINE } from "@/lib/content";
import { LEGAL_NAV_LINKS } from "@/lib/legal-content";

export function Footer() {
  return (
    <footer className="bg-[#121212] text-white/80">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/60">Ground Control · Online</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
          <div className="col-span-2">
            <div className="font-display text-sm font-bold tracking-[0.2em] uppercase text-white">DRONEHIRE</div>
            <p className="text-sm text-white/50 max-w-xs leading-relaxed mt-4">{FOOTER_TAGLINE}</p>
          </div>
          {FOOTER_COLUMNS.map(col => (
            <div key={col.title}>
              <h5 className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40 mb-4">{col.title}</h5>
              <div className="flex flex-col gap-2">
                {col.links.map(l => {
                  const isExternal = l.href.startsWith("http") || l.href.startsWith("mailto");
                  return (
                    <a
                      key={l.label}
                      href={l.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                      {...(isExternal
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {l.label}
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6">
            {LEGAL_NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="font-mono text-[10px] tracking-wider uppercase text-white/40 hover:text-white transition-colors">{link.label}</a>
            ))}
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <span className="font-mono text-[10px] tracking-wider text-white/40">{FOOTER_LEGAL}</span>
            <span className="font-mono text-[10px] tracking-wider text-white/40">{FOOTER_DISCLAIMER}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
