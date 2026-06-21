"use client";

import { useEffect, useState } from "react";

export interface Notam {
  id: string;
  type: "N" | "R" | "C"; // New, Replaced, Cancelled
  fir: string;
  subject: string;
  scope: "A" | "E" | "W" | "K" | "O"; // Aerodrome, En-route, Nav Warning, Checklist, Other
  text: string;
  effectiveStart: string;
  effectiveEnd: string;
  coordinates?: { lat: number; lng: number };
  altitude?: string;
  parsed: boolean;
}

interface NotamPanelProps {
  visible: boolean;
  onClose: () => void;
  onFlyTo: (lat: number, lng: number, zoom?: number) => void;
}

export function NotamPanel({ visible, onClose, onFlyTo }: NotamPanelProps) {
  const [notams, setNotams] = useState<Notam[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<"all" | "N" | "R" | "C">("all");
  const [filterScope, setFilterScope] = useState<"all" | "A" | "E" | "W" | "K" | "O">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!visible) return;
    fetchNotams();
  }, [visible]);

  const fetchNotams = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/notams");
      if (!res.ok) throw new Error("Failed to fetch NOTAMs");
      const data = await res.json();
      setNotams(data.notams || []);
    } catch (err: any) {
      setError(err.message || "Failed to load NOTAMs");
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  const filteredNotams = notams.filter((n) => {
    if (filterType !== "all" && n.type !== filterType) return false;
    if (filterScope !== "all" && n.scope !== filterScope) return false;
    if (searchQuery && !n.text.toLowerCase().includes(searchQuery.toLowerCase()) && !n.subject.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const scopeLabels: Record<string, string> = {
    A: "Aerodrome",
    E: "En-route",
    W: "Nav Warning",
    K: "Checklist",
    O: "Other",
  };

  const typeLabels: Record<string, { label: string; color: string }> = {
    N: { label: "New", color: "bg-green-100 text-green-700" },
    R: { label: "Replaced", color: "bg-amber-100 text-amber-700" },
    C: { label: "Cancelled", color: "bg-red-100 text-red-700" },
  };

  return (
    <div className="absolute top-20 left-4 z-20 w-96 max-h-[70vh]">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col max-h-[70vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-sm font-semibold text-gray-800">NOTAMs</span>
            <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full font-medium">
              {notams.length} active
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filters */}
        <div className="px-4 py-3 border-b border-gray-100 space-y-2 flex-shrink-0">
          {/* Search */}
          <div className="relative">
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search NOTAMs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gray-200 focus:border-orange-300 focus:ring-1 focus:ring-orange-200 outline-none"
            />
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-1.5">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="text-[10px] rounded-md border border-gray-200 px-2 py-1 bg-white focus:border-orange-300 outline-none"
            >
              <option value="all">All Types</option>
              <option value="N">New</option>
              <option value="R">Replaced</option>
              <option value="C">Cancelled</option>
            </select>
            <select
              value={filterScope}
              onChange={(e) => setFilterScope(e.target.value as any)}
              className="text-[10px] rounded-md border border-gray-200 px-2 py-1 bg-white focus:border-orange-300 outline-none"
            >
              <option value="all">All Scopes</option>
              <option value="A">Aerodrome</option>
              <option value="E">En-route</option>
              <option value="W">Nav Warning</option>
              <option value="K">Checklist</option>
              <option value="O">Other</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin" />
                <span className="text-xs text-gray-500">Loading NOTAMs...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
                <p className="font-medium">Error loading NOTAMs</p>
                <p className="mt-1 text-red-500">{error}</p>
              </div>
              <button
                onClick={fetchNotams}
                className="mt-2 w-full py-2 text-xs font-medium bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && filteredNotams.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-xs text-gray-500">No NOTAMs found</p>
                {searchQuery && <p className="text-[10px] text-gray-400 mt-1">Try a different search</p>}
              </div>
            </div>
          )}

          {!loading && !error && filteredNotams.map((notam) => (
            <div
              key={notam.id}
              className="px-4 py-3 border-b border-gray-100 hover:bg-orange-50/50 transition-colors cursor-pointer"
              onClick={() => {
                if (notam.coordinates) {
                  onFlyTo(notam.coordinates.lat, notam.coordinates.lng, 10);
                }
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${typeLabels[notam.type]?.color || "bg-gray-100 text-gray-600"}`}>
                      {typeLabels[notam.type]?.label || notam.type}
                    </span>
                    <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-medium">
                      {scopeLabels[notam.scope] || notam.scope}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">{notam.fir}</span>
                  </div>
                  <p className="text-xs font-medium text-gray-800 truncate">{notam.subject}</p>
                  <p className="text-[11px] text-gray-600 mt-1 line-clamp-3 whitespace-pre-wrap">{notam.text}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-400">
                    <span>{notam.effectiveStart}</span>
                    <span>&rarr;</span>
                    <span>{notam.effectiveEnd}</span>
                  </div>
                  {notam.altitude && (
                    <div className="text-[10px] text-blue-500 mt-0.5">Alt: {notam.altitude}</div>
                  )}
                </div>
                {notam.coordinates && (
                  <svg className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
          <span className="text-[10px] text-gray-400">
            Showing {filteredNotams.length} of {notams.length} NOTAMs
          </span>
          <button
            onClick={fetchNotams}
            className="text-[10px] text-orange-600 hover:text-orange-700 font-medium"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
