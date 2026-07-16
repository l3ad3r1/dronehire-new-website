"use client";

import { useState } from "react";

export function NotifyForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (submitted) {
    return (
      <p className="font-mono text-sm text-primary tracking-wide">
        ✓ You&apos;re on the list. We&apos;ll reach out when we launch.
      </p>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email") as string;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "marketplace" }),
      });
      if (!res.ok) throw new Error("failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        name="email"
        required
        placeholder="Your email address"
        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 bg-primary text-white font-mono text-xs tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors whitespace-nowrap disabled:opacity-60"
      >
        {loading ? "..." : "Notify me"}
      </button>
      {error && (
        <p className="w-full font-mono text-xs text-red-400 text-left mt-1">{error}</p>
      )}
    </form>
  );
}
