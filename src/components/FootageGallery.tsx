"use client";

import { useState } from "react";
import { GALLERY_INTRO, GALLERY_ITEMS } from "@/lib/pilots-content";
import { PlayIcon, MapPinIcon } from "@/components/icons";
import type { GalleryItem } from "@/types";

export function FootageGallery() {
  const [active, setActive] = useState<GalleryItem | null>(null);

  return (
    <section className="py-10 lg:py-16 bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-primary" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase">
            Pilot footage gallery
          </span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
          CAPTURED BY OUR PILOTS
        </h2>
        <p className="text-base text-white/60 leading-relaxed mb-12 max-w-xl">
          {GALLERY_INTRO}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GALLERY_ITEMS.map((item, i) => (
            <button
              key={item.title}
              onClick={() => setActive(item)}
              className={`relative group cursor-pointer overflow-hidden aspect-video ${
                i === 0 ? "sm:col-span-2 lg:col-span-2" : ""
              }`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-14 h-14 rounded-full border-2 border-white flex items-center justify-center text-white">
                  <PlayIcon />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                <span className="inline-flex items-center px-2 py-0.5 border border-white/30 rounded-sm font-mono text-[9px] tracking-wider uppercase text-white/80 mb-2">
                  {item.badge}
                </span>
                <h4 className="font-body text-sm font-semibold text-white">
                  {item.title}
                </h4>
                <div className="flex items-center gap-1 mt-1">
                  <MapPinIcon className="w-3 h-3 text-white/50" />
                  <span className="font-mono text-[10px] text-white/60">
                    {item.location}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div
          onClick={() => setActive(null)}
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6"
        >
          <button
            onClick={() => setActive(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white font-mono text-sm"
          >
            CLOSE ✕
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl aspect-video bg-black"
          >
            {active.videoId ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${active.videoId}?autoplay=1`}
                title={active.title}
                allow="autoplay; encrypted-media; picture-in-picture"
                sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
                allowFullScreen
              />
            ) : (
              <img
                src={active.image}
                alt={active.title}
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
