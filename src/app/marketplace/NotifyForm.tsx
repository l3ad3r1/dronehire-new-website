"use client";

import { useState } from "react";

export function NotifyForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <p className="font-mono text-sm text-primary tracking-wide">
        ✓ You&apos;re on the list. We&apos;ll reach out when we launch.
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
    >
      <input
        type="email"
        required
        placeholder="Your email address"
        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-primary text-white font-mono text-xs tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors whitespace-nowrap"
      >
        Notify me
      </button>
    </form>
  );
}
