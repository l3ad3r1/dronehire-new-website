import { WHY_INTRO, WHY_POINTS } from "@/lib/content";

export function WhyUs() {
  return (
    <section className="relative py-10 lg:py-16 bg-[#121212] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-primary" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase">Why DroneHire</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-6">WE ONLY WORK WITH PILOTS YOU CAN TRUST</h2>
            <p className="text-base text-white/70 leading-relaxed mb-10">{WHY_INTRO}</p>
            <div className="space-y-6">
              {WHY_POINTS.map((pt) => (
                <div key={pt.title} className="flex gap-4">
                  <div className="h-px w-8 bg-primary mt-3 shrink-0" />
                  <div>
                    <h3 className="font-body text-base font-semibold mb-1">{pt.title}</h3>
                    <p className="text-sm text-white/60 leading-relaxed">{pt.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden group optical-bracket">
            <img src="/images/section-extra.webp" alt="Why DroneHire" className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" decoding="async" />
            {/* four corner brackets */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-white/40" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-white/40" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-white/40" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-white/40" />
          </div>
        </div>
      </div>
    </section>
  );
}
