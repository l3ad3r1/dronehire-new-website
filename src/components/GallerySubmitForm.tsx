"use client";

import { useState } from "react";
import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const BADGE_OPTIONS = [
  "Real estate",
  "Weddings",
  "Corporate",
  "Construction",
  "Cityscape",
  "Events",
  "Other",
];

type Status = "idle" | "submitting" | "success" | "error";

export function GallerySubmitForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    pilotName: "",
    badge: "Real estate",
    title: "",
    location: "",
    imageUrl: "",
    videoId: "",
  });

  function set(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          location: form.location || "Hyderabad",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const firstError = data.error
          ? Object.values(data.error as Record<string, string[]>).flat()[0]
          : "Submission failed. Please check your inputs.";
        setErrorMsg(String(firstError));
        setStatus("error");
        return;
      }

      setStatus("success");
      setForm({ pilotName: "", badge: "Real estate", title: "", location: "", imageUrl: "", videoId: "" });
    } catch {
      setErrorMsg("Network error — please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <CheckCircle className="w-12 h-12 text-green-500" />
        <h3 className="font-display text-lg font-bold tracking-tight text-white">Footage received</h3>
        <p className="font-mono text-xs text-white/50 max-w-xs">
          Your clip is pending review. We&apos;ll approve it and add it to the gallery shortly.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="font-mono text-xs tracking-[0.15em] text-primary underline"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Pilot name */}
      <div>
        <label className="font-mono text-[10px] tracking-[0.3em] text-white/50 uppercase block mb-1">
          Your name
        </label>
        <input
          required
          value={form.pilotName}
          onChange={(e) => set("pilotName", e.target.value)}
          placeholder="e.g. Aravind K."
          className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Title + badge row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="font-mono text-[10px] tracking-[0.3em] text-white/50 uppercase block mb-1">
            Clip title
          </label>
          <input
            required
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. Rooftop pool flyover"
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="font-mono text-[10px] tracking-[0.3em] text-white/50 uppercase block mb-1">
            Service type
          </label>
          <select
            value={form.badge}
            onChange={(e) => set("badge", e.target.value)}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-primary transition-colors"
          >
            {BADGE_OPTIONS.map((b) => (
              <option key={b} value={b} className="bg-[#121212]">{b}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="font-mono text-[10px] tracking-[0.3em] text-white/50 uppercase block mb-1">
          Shoot location
        </label>
        <input
          value={form.location}
          onChange={(e) => set("location", e.target.value)}
          placeholder="e.g. Banjara Hills, Hyderabad"
          className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Image URL */}
      <div>
        <label className="font-mono text-[10px] tracking-[0.3em] text-white/50 uppercase block mb-1">
          Thumbnail image URL <span className="normal-case">(required)</span>
        </label>
        <input
          required
          type="url"
          value={form.imageUrl}
          onChange={(e) => set("imageUrl", e.target.value)}
          placeholder="https://i.imgur.com/... or drive.google.com/..."
          className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors"
        />
        <p className="font-mono text-[9px] text-white/30 mt-1">
          Upload to Imgur, Google Drive, or any public host and paste the direct image link.
        </p>
      </div>

      {/* YouTube ID */}
      <div>
        <label className="font-mono text-[10px] tracking-[0.3em] text-white/50 uppercase block mb-1">
          YouTube video ID <span className="normal-case">(optional)</span>
        </label>
        <input
          value={form.videoId}
          onChange={(e) => set("videoId", e.target.value)}
          placeholder="e.g. dQw4w9WgXcQ (from youtube.com/watch?v=...)"
          className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors"
        />
        <p className="font-mono text-[9px] text-white/30 mt-1">
          Leave blank if you have only a photo. Video plays in a lightbox when visitors click your clip.
        </p>
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="font-mono text-xs">{errorMsg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full py-3 bg-primary text-white font-mono text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2"
      >
        {status === "submitting" ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
        ) : (
          <><Upload className="w-4 h-4" /> Submit footage</>
        )}
      </button>
    </form>
  );
}
