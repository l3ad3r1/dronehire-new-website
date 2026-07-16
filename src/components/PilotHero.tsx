"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { PILOT_HERO_BENEFITS, EXPERIENCE_OPTIONS, PILOT_SHOOT_TYPES, APPLY_CONSENT } from "@/lib/pilots-content";
import { CalendarIcon, WalletIcon, MapPinIcon, SelectChevronIcon } from "@/components/icons";
import { APPS_SCRIPT_URL } from "@/lib/config";
import type { SVGProps } from "react";

// tiny helpers

const inputCls =
  "w-full h-11 px-3 bg-background border border-border text-sm focus:outline-none focus:border-primary transition-colors";

type FieldProps = { label: string; children: React.ReactNode };
function Field({ label, children }: FieldProps) {
  return (
    <div>
      <label className="block font-mono text-[11px] tracking-[0.2em] uppercase text-foreground/60 mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

type CustomSelectProps = { options: string[]; placeholder: string; name: string };
function CustomSelect({ options, placeholder, name }: CustomSelectProps) {
  const [value, setValue] = useState("");
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
    <div ref={wrapperRef} className="relative">
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full h-11 items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm"
      >
        <span className={value ? undefined : "text-muted-foreground"}>
          {value || placeholder}
        </span>
        <SelectChevronIcon className="opacity-50" />
      </button>
      {open && (
        <div className="absolute z-20 mt-1 w-full bg-card border border-border shadow-lg max-h-60 overflow-auto">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              className="w-full text-left px-3 py-2 text-sm hover:bg-muted"
              onClick={() => {
                setValue(opt);
                setOpen(false);
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const BENEFIT_ICONS: ((props: SVGProps<SVGSVGElement>) => React.ReactElement)[] = [
  CalendarIcon,
  WalletIcon,
  MapPinIcon,
];

// main component

export function PilotHero() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const fields = {
      name:       data.get("name")       as string,
      whatsapp:   data.get("whatsapp")   as string,
      areas:      data.get("areas")      as string,
      dgca:       data.get("dgca")       as string,
      experience: data.get("experience") as string,
      drone:      data.get("drone")      as string,
      shootTypes: data.get("shootTypes") as string,
      notes:      data.get("notes")      as string,
    };

    // POST to Google Sheets (fire-and-forget; safe to fail)
    if (APPS_SCRIPT_URL) {
      fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ formType: "pilot", ...fields }),
      }).catch(() => {});
    }

    // Persist to DB (fire-and-forget; safe to fail)
    fetch("/api/pilot/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name:        fields.name,
        whatsapp:    fields.whatsapp,
        areas:       fields.areas,
        dgcaId:      fields.dgca,
        experience:  fields.experience,
        droneModels: fields.drone,
        shootTypes:  fields.shootTypes,
        notes:       fields.notes,
      }),
    }).catch(() => {});

    // Build WhatsApp message
    const lines = [
      "*New Pilot Application - DroneHire*",
      `Name: ${fields.name}`,
      `WhatsApp: ${fields.whatsapp}`,
      `Areas: ${fields.areas}`,
      `DGCA #: ${fields.dgca}`,
      `Experience: ${fields.experience || "Not specified"}`,
      `Drone(s): ${fields.drone}`,
      `Shoot types: ${fields.shootTypes || "Not specified"}`,
      fields.notes ? `Notes: ${fields.notes}` : "",
    ].filter(Boolean);

    const waUrl = `https://wa.me/919645179861?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(waUrl, "_blank");
    setSubmitted(true);
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0 transition-transform duration-700 ease-out">
        <img
          src="/images/pilots/pilot-hero.webp"
          alt="Drone pilot in flight"
          className="w-full h-full object-cover object-[20%_center]" fetchPriority="high" decoding="sync"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/40" />
      </div>

      <div className="absolute top-[76px] left-6 lg:left-8 z-10">
        <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground/60">
          PILOT_RECRUITMENT_v2
        </span>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          <div className="animate-fade-up" style={{ animationDelay: "0ms" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-primary" />
              <span className="font-mono text-xs tracking-[0.2em] text-primary uppercase">
                For drone pilots in Hyderabad
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              FLY MORE.<br />
              <span className="text-primary">EARN MORE.</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-md leading-relaxed mb-8">
              Join DroneHire and get a steady stream of paid shoots — real estate, weddings,
              construction surveys — matched to your schedule and location.
            </p>

            <div className="space-y-5">
              {PILOT_HERO_BENEFITS.map((b, idx) => {
                const Icon = BENEFIT_ICONS[idx];
                return (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="shrink-0 w-10 h-10 border border-border/60 flex items-center justify-center text-primary">
                      <Icon className="w-[18px] h-[18px]" />
                    </div>
                    <div>
                      <h3 className="font-body text-base font-semibold mb-1">{b.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: "150ms" }}>
            {submitted ? (
              <div className="bg-white border border-border/50 p-8 shadow-2xl">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-6 mx-auto">
                  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-primary" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2 className="font-display text-sm font-bold tracking-[0.15em] uppercase text-center mb-3">
                  Application received!
                </h2>
                <p className="text-sm text-muted-foreground text-center leading-relaxed mb-6">
                  Your application is on its way via WhatsApp. Our team reviews every application and will get back to you within 24 hours.
                </p>
                <div className="border-t border-border pt-5 space-y-3">
                  {[
                    { n: "1", text: "Send the WhatsApp message (if not already sent)" },
                    { n: "2", text: "We review your DGCA cert & drone experience" },
                    { n: "3", text: "You get onboarded and start receiving shoot requests" },
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
                  Submit another application
                </button>
              </div>
            ) : (
              <form id="signup" onSubmit={handleSubmit} className="bg-white border border-border/50 p-8 shadow-2xl scroll-mt-20">
                <h2 className="font-display text-sm font-bold tracking-[0.15em] uppercase mb-1">
                  Apply to Join
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Takes 2 minutes. We&apos;ll be in touch within 24 hours.
                </p>

                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Full name *">
                      <input required name="name" type="text" placeholder="Arjun Reddy" className={inputCls} />
                    </Field>
                    <Field label="WhatsApp *">
                      <input required name="whatsapp" type="text" placeholder="9XXXXXXXXX" className={inputCls} />
                    </Field>
                  </div>

                  <Field label="Areas you fly in *">
                    <input required name="areas" type="text" placeholder="e.g. Gachibowli, Kondapur" className={inputCls} />
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="DGCA cert # *">
                      <input required name="dgca" type="text" placeholder="RPC-XXXX-XXXXXX" className={inputCls} />
                    </Field>
                    <Field label="Experience">
                      <CustomSelect name="experience" options={EXPERIENCE_OPTIONS} placeholder="Select" />
                    </Field>
                  </div>

                  <Field label="Drone model(s) *">
                    <input required name="drone" type="text" placeholder="e.g. DJI Mavic 3, DJI Air 3" className={inputCls} />
                  </Field>

                  <Field label="Shoot types">
                    <CustomSelect name="shootTypes" options={PILOT_SHOOT_TYPES} placeholder="Select primary type" />
                  </Field>

                  <Field label="Notes (optional)">
                    <textarea
                      name="notes"
                      placeholder="Portfolio link, post-processing skills..."
                      rows={3}
                      className={inputCls + " py-2 h-auto resize-none"}
                    />
                  </Field>

                  <label className="flex items-start gap-3 text-sm text-muted-foreground cursor-pointer">
                    <input required type="checkbox" className="mt-1 accent-primary" />
                    <span>{APPLY_CONSENT}</span>
                  </label>

                  <button
                    type="submit"
                    className="w-full h-12 bg-primary text-primary-foreground font-mono text-xs tracking-[0.15em] uppercase flex items-center justify-center hover:bg-primary/90 transition-colors"
                  >
                    Submit application →
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
