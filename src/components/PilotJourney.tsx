import { PILOT_JOURNEY } from "@/lib/pilots-content";

export function PilotJourney() {
  return (
    <section id="how-it-works" className="py-10 lg:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-primary" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase">
            The pilot journey
          </span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-12">
          FROM APPLICATION TO FIRST PAID SHOOT
        </h2>
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* connector line sits above all step numbers */}
          <div className="hidden md:block absolute top-0 left-0 right-0 h-px bg-border" />
          {PILOT_JOURNEY.map((step) => (
            <div key={step.number} className="relative group pt-8">
              {/* orange tick on the line for each step */}
              <div className="hidden md:block absolute top-0 left-0 w-6 h-0.5 bg-primary" />
              <div className="font-mono text-5xl font-bold text-foreground/20 group-hover:text-primary/30 transition-colors duration-500 mb-6">
                {step.number}
              </div>
              <h3 className="font-body text-lg font-semibold mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
