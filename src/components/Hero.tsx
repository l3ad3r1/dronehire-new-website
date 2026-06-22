"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { HERO_TAGS, SHOOT_TYPES, COORDINATES } from "@/lib/content";
import { APPS_SCRIPT_URL } from "@/lib/config";
import { SelectChevronIcon } from "@/components/icons";

type ShootTypeSelectProps = { value: string; onChange: (v: string) => void };
function ShootTypeSelect({ value, onChange }: ShootTypeSelectProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        className="flex w-full h-11 items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm"
        onClick={() => setOpen((prev) => !prev)}
      >
        {value}
        <SelectChevronIcon className="opacity-50" />
      </button>
      {open && (
        <div className="absolute z-20 mt-1 w-full bg-card border border-border shadow-lg">
          {SHOOT_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              className="w-full text-left px-3 py-2 text-sm hover:bg-muted"
              onClick={() => {
                onChange(type);
                setOpen(false);
              }}
            >
              {type}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Hero() {
  const [shootType, setShootType] = useState(SHOOT_TYPES[0]);
  const [submitted, setSubmitted] = useState(false);
  const [minDate, setMinDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [formError, setFormError] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Earliest selectable shoot date is tomorrow (no same-day or past dates)
    const t = new Date();
    t.setDate(t.getDate() + 1);
    const y = t.getFullYear();
    const m = String(t.getMonth() + 1).padStart(2, "0");
    const d = String(t.getDate()).padStart(2, "0");
    setMinDate(`${y}-${m}-${d}`);
  }, []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = nameRef.current?.value.trim() ?? "";
    const phone = phoneRef.current?.value ?? "";
    const location = locationRef.current?.value ?? "";
    const date = dateRef.current?.value ?? "";

    // Require a name and a valid 10-digit WhatsApp number
    if (!name || phone.replace(/\D/g, "").length < 10) {
      setFormError("Please enter your name and a valid WhatsApp number.");
      return;
    }
    setFormError("");

    // Reject any date earlier than tomorrow even if typed/pasted manually
    if (date && date < minDate) {
      setDateError("Please pick a date from tomorrow onwards.");
      return;
    }
    setDateError("");

    if (APPS_SCRIPT_URL) {
      fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ formType: "quote", name, phone, shootType, location, date }),
      }).catch(() => {});
    }

    const lines = [
      `*New Quote Request — DroneHire*`,
      `Name: ${name}`,
      `WhatsApp: ${phone}`,
      `Shoot type: ${shootType}`,
      location ? `Location: ${location}` : "",
      date ? `Date: ${date}` : "",
      `Please share availability and pricing.`,
    ].filter(Boolean);

    window.open(
      `https://wa.me/919645179861?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank"
    );
    setSubmitted(true);
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* background layer */}
      <div className="absolute inset-0 z-0 transition-transform duration-700 ease-out">
        <img src="/images/hero-cityscape.webp" alt="Aerial view of Hyderabad cityscape" className="w-full h-full object-cover" fetchPriority="high" decoding="sync" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/40" />
      </div>
      {/* coordinate label */}
      <div className="absolute top-[76px] left-6 lg:left-8 z-10">
        <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground/60">{COORDINATES}</span>
      </div>
      {/* content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT column */}
          <div className="animate-fade-up" style={{ animationDelay: "0s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-primary" />
              <span className="font-mono text-xs tracking-[0.2em] text-primary uppercase">Fast, reliable aerial photography in Hyderabad</span>
            </div>
            <h1
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6 animate-fade-up"
              style={{ animationDelay: "0.08s" }}
            >
              DRONE PILOTS,<br /><span className="text-primary">ON DEMAND</span>
            </h1>
            <p
              className="text-lg text-muted-foreground max-w-md leading-relaxed mb-8 animate-fade-up"
              style={{ animationDelay: "0.16s" }}
            >
              DGCA-licensed pilots for real estate shoots in Gachibowli, wedding films in Banjara Hills, and construction surveys across Hyderabad — booked in minutes.
            </p>
            <div className="flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: "0.24s" }}>
              {HERO_TAGS.map((tag) => (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent("dh:filter", { detail: tag.label }));
                    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-4 py-2 bg-foreground/5 border border-border/50 font-mono text-xs tracking-wider text-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer select-none"
                >
                  {tag.emoji} {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT column — Get a quote card */}
          <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
            {submitted ? (
              <div className="bg-white border border-border p-8 shadow-xl relative z-20">
                {/* tick */}
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-6 mx-auto">
                  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-primary" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2 className="font-display text-sm font-bold tracking-[0.15em] uppercase text-center mb-3">
                  Quote request received!
                </h2>
                <p className="text-sm text-muted-foreground text-center leading-relaxed mb-6">
                  We&apos;ve opened WhatsApp with your details pre-filled. Hit send and our team will reply with exact pricing within a few hours.
                </p>
                {/* what happens next */}
                <div className="border-t border-border pt-5 space-y-3">
                  {[
                    { n: "1", text: "Send the WhatsApp message (if not already sent)" },
                    { n: "2", text: "We confirm availability & share pricing" },
                    { n: "3", text: "Book with a 50% advance — rest after delivery" },
                  ].map(({ n, text }) => (
                    <div key={n} className="flex items-start gap-3">
                      <span className="font-mono text-[10px] text-primary/70 w-4 shrink-0 mt-0.5">{n}</span>
                      <span className="text-xs text-muted-foreground leading-relaxed">{text}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 w-full font-mono text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-primary transition-colors"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-border p-8 shadow-xl relative z-20">
                <h2 className="font-display text-sm font-bold tracking-[0.15em] uppercase mb-6">Get a quote</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block font-mono text-[11px] tracking-[0.2em] uppercase text-foreground/60 mb-2">Your name</label>
                    <input ref={nameRef} type="text" placeholder="e.g. Ravi Kumar" onChange={() => formError && setFormError("")} className="w-full h-11 px-3 bg-background border border-border text-sm focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] tracking-[0.2em] uppercase text-foreground/60 mb-2">WhatsApp number</label>
                    <input ref={phoneRef} type="tel" inputMode="tel" placeholder="e.g. 98765 43210" onChange={() => formError && setFormError("")} className="w-full h-11 px-3 bg-background border border-border text-sm focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] tracking-[0.2em] uppercase text-foreground/60 mb-2">Shoot type</label>
                    <ShootTypeSelect value={shootType} onChange={setShootType} />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] tracking-[0.2em] uppercase text-foreground/60 mb-2">Location in Hyderabad</label>
                    <input ref={locationRef} type="text" placeholder="e.g. Gachibowli, Banjara Hills…" className="w-full h-11 px-3 bg-background border border-border text-sm focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] tracking-[0.2em] uppercase text-foreground/60 mb-2">Shoot date</label>
                    <input ref={dateRef} type="date" min={minDate} onChange={() => dateError && setDateError("")} className="w-full h-11 px-3 bg-background border border-border text-sm focus:outline-none focus:border-primary transition-colors" />
                    {dateError && <p className="mt-2 font-mono text-[11px] text-red-500">{dateError}</p>}
                  </div>
                  {formError && <p className="font-mono text-[11px] text-red-500">{formError}</p>}
                  <button
                    type="submit"
                    className="w-full h-12 bg-primary text-primary-foreground font-mono text-xs tracking-[0.15em] uppercase flex items-center justify-center hover:bg-primary/90 transition-colors"
                  >
                    Get a quote on WhatsApp →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
