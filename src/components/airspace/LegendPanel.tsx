"use client";

import { ZONE_STYLES } from "@/data/facilities";

interface LegendPanelProps {
  onClose: () => void;
}

export function LegendPanel({ onClose }: LegendPanelProps) {
  return (
    <div className="absolute top-20 left-3 z-20 md:left-4 md:top-20 w-64">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span className="text-sm font-semibold text-gray-800">Map Legend</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-3 space-y-2">
          {Object.entries(ZONE_STYLES).map(([key, style]) => (
            <div key={key} className="flex items-start gap-2.5">
              <span
                className="w-5 h-3.5 rounded-sm flex-shrink-0 mt-0.5 border border-black/10"
                style={{
                  backgroundColor: style.color,
                  opacity: style.fillOpacity + 0.3,
                }}
              />
              <div>
                <p className="text-xs font-medium text-gray-800">{style.label}</p>
                <p className="text-[10px] text-gray-500 leading-snug">{style.description}</p>
              </div>
            </div>
          ))}

          {/* Extra legend items */}
          <div className="flex items-start gap-2.5">
            <span
              className="w-5 h-3.5 rounded-sm flex-shrink-0 mt-0.5 border border-black/10"
              style={{ backgroundColor: "#9c27b0", opacity: 0.6 }}
            />
            <div>
              <p className="text-xs font-medium text-gray-800">Custom Zone (KML)</p>
              <p className="text-[10px] text-gray-500 leading-snug">Imported from KML or GeoJSON files.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span
              className="w-5 h-3.5 rounded-full flex-shrink-0 mt-0.5 border border-black/10"
              style={{ backgroundColor: "#2196F3" }}
            />
            <div>
              <p className="text-xs font-medium text-gray-800">Live Aircraft</p>
              <p className="text-[10px] text-gray-500 leading-snug">Real-time ADS-B flight positions via OpenSky Network.</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-2 mt-2">
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Zone boundaries are approximate. Red zone = 5km radius around airports.
              Inner yellow = 8km, Outer yellow = 12km. Approach paths extend 15km from runway.
              Military bases have 5km red zones only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
