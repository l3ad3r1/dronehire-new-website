"use client";

import { useState, useCallback } from "react";

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface SearchBarProps {
  onFlyTo: (lat: number, lng: number, zoom?: number) => void;
  onClose: () => void;
}

export function SearchBar({ onFlyTo, onClose }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async () => {
    if (!query.trim() || query.length < 2) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data.slice(0, 5) : []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") search();
  };

  return (
    <div className="absolute top-20 left-3 z-20 md:left-4 md:top-20 w-72">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search location in India..."
            className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
            autoFocus
          />
          {loading && (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          )}
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {results.length > 0 && (
          <div className="border-t border-gray-100 max-h-52 overflow-y-auto">
            {results.map((r) => (
              <button
                key={r.place_id}
                onClick={() => {
                  onFlyTo(parseFloat(r.lat), parseFloat(r.lon), 13);
                  setResults([]);
                  setQuery("");
                  onClose();
                }}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
              >
                <p className="text-xs text-gray-800 line-clamp-2">{r.display_name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {parseFloat(r.lat).toFixed(4)}, {parseFloat(r.lon).toFixed(4)}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
