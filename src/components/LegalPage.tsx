import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import type { LegalPage as LegalPageData } from "@/lib/legal-content";

export function LegalPage({ page }: { page: LegalPageData }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Dark header: minimal nav + hero band */}
      <header className="bg-[#121212] text-white">
        <nav className="max-w-3xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16 border-b border-white/10">
          <a href="/" className="font-display text-sm font-bold tracking-[0.2em] uppercase text-white">DRONEHIRE</a>
          <a href="/" className="font-mono text-xs tracking-wider text-white/60 hover:text-white transition-colors">← Back to home</a>
        </nav>
        <div className="max-w-3xl mx-auto px-6 lg:px-8 pt-16 pb-14 lg:pt-20 lg:pb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-primary" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase">{page.eyebrow}</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">{page.title}</h1>
          <p className="font-mono text-xs tracking-wider text-white/50">{page.updated}</p>
        </div>
      </header>

      {/* Light prose body */}
      <main className="flex-1 bg-background">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
          <div className="legal-prose" dangerouslySetInnerHTML={{ __html: page.html }} />
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
