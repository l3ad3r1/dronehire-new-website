"use client";

import { useState } from "react";
import { FAQS } from "@/lib/content";
import { ChevronDownIcon } from "@/components/icons";
import type { FaqItem } from "@/types";

interface FaqProps {
  items?: FaqItem[];
}

export function Faq({ items = FAQS }: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-10 lg:py-16 bg-background">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-primary" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase">Common questions</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-10">FREQUENTLY ASKED</h2>
        <div className="divide-y divide-border border-t border-b border-border">
          {items.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={item.question}>
                <button onClick={() => setOpenIndex(open ? null : i)} className="w-full flex items-center justify-between gap-4 py-6 text-left group" aria-expanded={open}>
                  <span className="font-body text-base font-medium group-hover:text-primary transition-colors">{item.question}</span>
                  <ChevronDownIcon className={`shrink-0 text-muted-foreground transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                </button>
                <div className={`grid transition-all duration-300 ease-out ${open ? 'grid-rows-[1fr] opacity-100 pb-6' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <p className="text-sm text-muted-foreground leading-relaxed pr-8">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
