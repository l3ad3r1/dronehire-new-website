"use client";

import { ZONE_FILTERS, type ZoneFilterId } from "@/data/facilities";
import { useState } from "react";

interface ZoneControlPanelProps {
  activeZones: Set<ZoneFilterId>;
  onToggleZone: (zoneId: ZoneFilterId) => void;
}

export function ZoneControlPanel({ activeZones, onToggleZone }: ZoneControlPanelProps) {
  const [isOpen, setIsOpen] = useState(true);

  const groups = ZONE_FILTERS.reduce<Record<string, typeof ZONE_FILTERS>>((acc, filter) => {
    if (!acc[filter.group]) acc[filter.group] = [];
    acc[filter.group].push(filter);
    return acc;
  }, {});

  return (
    <div className="absolute top-20 right-3 z-10 md:top-20 md:right-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 overflow-hidden w-56">
        {/* Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span className="text-sm font-semibold text-gray-800">Zone Controls</span>
          </div>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Zone toggles */}
        {isOpen && (
          <div className="p-3 space-y-3 max-h-80 overflow-y-auto">
            {Object.entries(groups).map(([groupName, filters]) => (
              <div key={groupName}>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 px-1">
                  {groupName}
                </p>
                <div className="space-y-1">
                  {filters.map((filter) => {
                    const isActive = activeZones.has(filter.id);
                    return (
                      <button
                        key={filter.id}
                        onClick={() => onToggleZone(filter.id)}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                          isActive
                            ? "text-white shadow-sm"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                        }`}
                        style={isActive ? { backgroundColor: filter.color } : {}}
                      >
                        <span
                          className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${
                            isActive ? "border-white" : ""
                          }`}
                          style={
                            isActive
                              ? { backgroundColor: "white", borderColor: "white" }
                              : { backgroundColor: filter.color, borderColor: filter.color }
                          }
                        />
                        <span className="truncate">{filter.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
