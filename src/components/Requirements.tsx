import {
  REQUIREMENTS,
  REQUIREMENTS_CALLOUT,
} from "@/lib/pilots-content";

export function Requirements() {
  return (
    <section id="requirements" className="py-10 lg:py-16 pb-28 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* LEFT col-span-2 */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-primary" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase">
                What we look for
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-8">
              REQUIREMENTS TO JOIN
            </h2>
            <div className="border border-border bg-muted/40 p-6">
              <h3 className="font-body text-base font-semibold mb-2">
                {REQUIREMENTS_CALLOUT.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {REQUIREMENTS_CALLOUT.body}
              </p>
            </div>
          </div>

          {/* RIGHT col-span-3 — requirements list */}
          <div className="lg:col-span-3 border-t border-border">
            {REQUIREMENTS.map((req, i) => (
              <div
                key={req.title}
                className="flex gap-5 py-5 border-b border-border"
              >
                <span className="font-mono text-xs text-primary pt-1 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-body text-base font-semibold mb-1">
                    {req.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {req.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
