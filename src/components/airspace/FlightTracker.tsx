"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { AircraftState } from "@/lib/airspace";

interface FlightTrackerProps {
  visible: boolean;
  onToggle: () => void;
}

export function FlightTracker({ visible, onToggle }: FlightTrackerProps) {
  const [flights, setFlights] = useState<AircraftState[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [expanded, setExpanded] = useState(false);

  const fetchFlights = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/flights");
      if (!res.ok) throw new Error("Failed to fetch flight data");
      const data = await res.json();
      setFlights(data.states || []);
      setIsDemo(!!data.demo);
      setLastUpdate(new Date());
    } catch (e: any) {
      setError(e.message || "Flight data unavailable");
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-refresh every 15 seconds
  useEffect(() => {
    if (visible && autoRefresh) {
      fetchFlights();
      intervalRef.current = setInterval(fetchFlights, 15000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [visible, autoRefresh, fetchFlights]);

  // Notify parent about flight count for the badge
  // (We use the visible prop + flight count to render aircraft on map)

  if (!visible) return null;

  return (
    <div className="absolute bottom-12 left-3 z-10 md:left-4 w-72">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-blue-200 overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-3 py-2.5 bg-blue-50 border-b border-blue-100"
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span className="text-xs font-semibold text-blue-800">
              Live Flights ({flights.length})
            </span>
            {isDemo && (
              <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">DEMO</span>
            )}
            {loading && (
              <div className="w-3 h-3 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            )}
          </div>
          <svg
            className={`w-3.5 h-3.5 text-blue-400 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expanded && (
          <div className="p-3 space-y-2">
            {/* Controls */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-[10px] text-gray-600">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded border-gray-300"
                />
                Auto-refresh (15s)
              </label>
              <button
                onClick={fetchFlights}
                disabled={loading}
                className="text-[10px] text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
              >
                Refresh
              </button>
            </div>

            {/* Status */}
            {lastUpdate && (
              <p className="text-[10px] text-gray-400">
                Last update: {lastUpdate.toLocaleTimeString()}
              </p>
            )}

            {isDemo && (
              <div className="text-[10px] text-amber-700 bg-amber-50 rounded px-2 py-1 border border-amber-100">
                Showing demo data. OpenSky API rate-limited — real data will appear when available.
              </div>
            )}

            {error && (
              <div className="text-[10px] text-red-600 bg-red-50 rounded px-2 py-1">
                {error} — OpenSky free API has rate limits. Try again in 30s.
              </div>
            )}

            {/* Flight list */}
            <div className="max-h-48 overflow-y-auto space-y-1">
              {flights.length === 0 && !loading && (
                <p className="text-[10px] text-gray-400 text-center py-3">
                  No flights detected in Indian airspace
                </p>
              )}
              {flights.slice(0, 50).map((flight, i) => (
                <div
                  key={`${flight.icao24}-${i}`}
                  className="flex items-center justify-between px-2 py-1.5 bg-gray-50 rounded-lg text-[10px]"
                >
                  <div>
                    <span className="font-semibold text-gray-800">
                      {flight.callsign || flight.icao24.toUpperCase()}
                    </span>
                    <span className="text-gray-400 ml-1">{flight.originCountry}</span>
                  </div>
                  <div className="text-right text-gray-500">
                    {flight.baroAltitude != null
                      ? `${Math.round(flight.baroAltitude * 3.281)}ft`
                      : flight.onGround
                      ? "Ground"
                      : "N/A"}
                    {flight.velocity != null && (
                      <span className="ml-1">
                        {Math.round(flight.velocity * 3.6)}km/h
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {flights.length > 50 && (
                <p className="text-[10px] text-gray-400 text-center">
                  +{flights.length - 50} more flights
                </p>
              )}
            </div>

            {/* Data source */}
            <p className="text-[9px] text-gray-300 text-center">
              Data from OpenSky Network (ADS-B)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
