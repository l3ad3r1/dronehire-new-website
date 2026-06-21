import { EARNINGS } from "@/lib/pilots-content";

export function EarningPotential() {
  return (
    <section className="py-10 lg:py-16 bg-[#121212] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-primary" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase">
            Earning potential
          </span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-10">
          WHAT PILOTS TYPICALLY EARN
        </h2>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {EARNINGS.map((card) => (
            <div key={card.label} className="border border-white/10 p-8">
              <div className="font-display text-3xl lg:text-4xl font-bold text-primary mb-2">
                {card.amount}
              </div>
              <h3 className="font-body text-base font-semibold mb-3">{card.label}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
