import { PRICING_TIERS, WHATSAPP_URL } from "@/lib/content";

export function Pricing() {
  return (
    <section id="pricing" className="py-10 lg:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-primary" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase">Transparent pricing</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-10">SIMPLE, NO-SURPRISE RATES</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`relative border p-8 flex flex-col h-full transition-colors ${
                tier.popular
                  ? "border-primary bg-card"
                  : "border-border bg-card hover:border-foreground/30"
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-8 bg-primary text-primary-foreground font-mono text-[10px] tracking-[0.2em] uppercase px-3 py-1">
                  Most popular
                </span>
              )}
              <h3 className="font-display text-sm font-bold tracking-[0.15em] uppercase mb-4">
                {tier.name}
              </h3>
              <div className="font-display text-3xl font-bold text-primary mb-3">
                {tier.price}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {tier.description}
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                    <span className="text-primary mt-0.5" aria-hidden>
                      ✓
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="/book"
                className={`w-full h-11 flex items-center justify-center font-mono text-xs tracking-[0.15em] uppercase transition-colors ${
                  tier.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-border text-foreground hover:bg-foreground hover:text-background"
                }`}
              >
                Book a Drone Now →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
