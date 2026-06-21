import { GUARANTEES } from "@/lib/content";

export function Guarantees() {
  return (
    <section className="py-10 lg:py-16 bg-[#121212] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-primary" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase">Our guarantees</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-10">
          WHAT EVERY BOOKING INCLUDES
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
          {GUARANTEES.map((g, i) => (
            <div key={g.title} className="bg-[#121212] p-8">
              <div className="font-mono text-xs text-primary mb-4">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="font-body text-base font-semibold mb-3">{g.title}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{g.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
