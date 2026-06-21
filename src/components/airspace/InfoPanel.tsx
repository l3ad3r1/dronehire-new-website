"use client";

import type { ZoneCheckResult } from "@/lib/airspace";

interface InfoPanelProps {
  zoneInfo: ZoneCheckResult;
  lat: number;
  lng: number;
  onClose: () => void;
}

const ZONE_COLORS: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-800", icon: "✅" },
  red: { bg: "bg-red-50", border: "border-red-200", text: "text-red-800", icon: "🚫" },
  "inner-yellow": { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-800", icon: "⚠️" },
  "outer-yellow": { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-800", icon: "⚠️" },
  boundary: { bg: "bg-red-50", border: "border-red-200", text: "text-red-800", icon: "🚫" },
  helipad: { bg: "bg-pink-50", border: "border-pink-200", text: "text-pink-800", icon: "🚁" },
  temporary_red_zone: { bg: "bg-red-50", border: "border-red-200", text: "text-red-800", icon: "🔴" },
  approach: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-800", icon: "✈️" },
};

export function InfoPanel({ zoneInfo, lat, lng, onClose }: InfoPanelProps) {
  const colors = ZONE_COLORS[zoneInfo.zoneType] || ZONE_COLORS.green;

  return (
    <div className="absolute bottom-12 left-3 z-10 md:left-4 w-80 max-w-[calc(100vw-24px)]">
      <div className={`bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border ${colors.border} overflow-hidden`}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-base">{colors.icon}</span>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Airspace Information</h3>
              <p className="text-[10px] text-gray-400">Spatial Data & Restrictions</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Zone info */}
        <div className="p-4 space-y-3">
          {/* Zone type badge */}
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text} ${colors.border} border`}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: zoneInfo.zoneType === "green" ? "#008a00" : zoneInfo.zoneType === "approach" ? "#f76363" : zoneInfo.zoneType.includes("yellow") ? "#ff9800" : "#ff0505" }} />
            {zoneInfo.zoneLabel}
          </div>

          {/* Details */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Facility</span>
              <span className="text-gray-800 font-medium text-right max-w-[60%] truncate">{zoneInfo.facilityName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Type</span>
              <span className="text-gray-800 font-medium capitalize">{zoneInfo.facilityType.replace(/-/g, " ")}</span>
            </div>
            {zoneInfo.distance > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Distance</span>
                <span className="text-gray-800 font-medium">{zoneInfo.distance.toFixed(1)} km from center</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Coordinates</span>
              <span className="text-gray-800 font-medium font-mono">
                {lat.toFixed(4)}, {lng.toFixed(4)}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className={`rounded-lg p-3 ${colors.bg} border ${colors.border}`}>
            <p className={`text-xs ${colors.text} leading-relaxed`}>
              {zoneInfo.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
