"use client";

import { useEffect, useState } from "react";

export function AltitudeHud() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const raw = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, raw)));
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const altitude = Math.round((progress / 100) * 400);

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center gap-2">
      <span className="font-mono text-[10px] text-primary tracking-wider">{altitude} ft</span>
      <div className="w-px h-32 bg-border relative">
        <div className="absolute bottom-0 left-0 w-full bg-primary transition-all duration-150" style={{ height: `${progress}%` }} />
      </div>
      <span className="font-mono text-[10px] text-muted-foreground tracking-wider">ALT</span>
    </div>
  );
}
