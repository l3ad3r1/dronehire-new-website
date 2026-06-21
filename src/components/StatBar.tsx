import { STATS } from "@/lib/content";

export function StatBar() {
  return (
    <section className="border-y border-border/50 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <div
              key={stat.value}
              className={`py-7 lg:py-10 px-4 lg:px-8${i > 0 ? " border-l border-border/50" : ""}`}
            >
              <div className="font-display text-xl lg:text-2xl font-bold tracking-[0.1em] text-primary mb-3">{stat.value}</div>
              <div className="h-px w-6 bg-border mb-3" />
              <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
