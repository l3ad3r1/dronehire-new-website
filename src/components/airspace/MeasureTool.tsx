"use client";

import { useState } from "react";

export interface Measurement {
  pointA: { lat: number; lng: number };
  pointB: { lat: number; lng: number };
  distanceKm: number;
  distanceNm: number;
  bearing: number;
}

interface MeasureToolProps {
  visible: boolean;
  measuring: boolean;
  measurement: Measurement | null;
  onToggleMeasure: () => void;
  onClearMeasurement: () => void;
  onClose: () => void;
  pointCount: number; // 0, 1, or 2 points placed
}

export function MeasureTool({
  visible,
  measuring,
  measurement,
  onToggleMeasure,
  onClearMeasurement,
  onClose,
  pointCount,
}: MeasureToolProps) {
  if (!visible) return null;

  return (
    <div className="absolute top-20 right-4 z-20 w-72">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-amber-50 border-b border-amber-200">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span className="text-sm font-semibold text-amber-800">Measure Distance</span>
          </div>
          <button
            onClick={onClose}
            className="text-amber-400 hover:text-amber-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-3">
          {/* Measure Mode Toggle */}
          <button
            onClick={onToggleMeasure}
            className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              measuring
                ? "bg-amber-500 text-white shadow-md"
                : "bg-amber-100 text-amber-700 hover:bg-amber-200"
            }`}
          >
            {measuring ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Measuring... Click {pointCount === 0 ? "first" : "second"} point
              </span>
            ) : (
              "Start Measuring"
            )}
          </button>

          {/* Instructions */}
          {measuring && (
            <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 space-y-1">
              <p className="font-medium text-gray-700">How to measure:</p>
              <p>1. Click on the map to place Point A</p>
              <p>2. Click again to place Point B</p>
              <p>3. Distance and bearing will be shown</p>
            </div>
          )}

          {/* Measurement Results */}
          {measurement && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 space-y-3 border border-amber-200">
              <div className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Results</div>

              {/* Points */}
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-green-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">A</span>
                  <div className="text-xs text-gray-600">
                    <span className="font-mono">{measurement.pointA.lat.toFixed(4)}, {measurement.pointA.lng.toFixed(4)}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">B</span>
                  <div className="text-xs text-gray-600">
                    <span className="font-mono">{measurement.pointB.lat.toFixed(4)}, {measurement.pointB.lng.toFixed(4)}</span>
                  </div>
                </div>
              </div>

              {/* Distance */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white rounded-lg p-2.5 text-center border border-amber-100">
                  <div className="text-lg font-bold text-amber-700">{measurement.distanceKm.toFixed(2)}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wide">Kilometers</div>
                </div>
                <div className="bg-white rounded-lg p-2.5 text-center border border-amber-100">
                  <div className="text-lg font-bold text-amber-700">{measurement.distanceNm.toFixed(2)}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wide">Nautical Miles</div>
                </div>
              </div>

              {/* Bearing */}
              <div className="bg-white rounded-lg p-2.5 flex items-center gap-3 border border-amber-100">
                <div className="w-10 h-10 rounded-full border-2 border-amber-300 flex items-center justify-center relative">
                  <div
                    className="w-0.5 h-4 bg-amber-600 rounded-full origin-bottom"
                    style={{
                      transform: `rotate(${measurement.bearing}deg)`,
                      transformOrigin: "50% 100%",
                    }}
                  />
                </div>
                <div>
                  <div className="text-sm font-bold text-amber-700">{measurement.bearing.toFixed(1)}&deg;</div>
                  <div className="text-[10px] text-gray-500">
                    {getBearingDirection(measurement.bearing)}
                  </div>
                </div>
              </div>

              {/* Clear */}
              <button
                onClick={onClearMeasurement}
                className="w-full py-2 px-3 rounded-lg text-xs font-medium bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 transition-colors"
              >
                Clear Measurement
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getBearingDirection(bearing: number): string {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(bearing / 22.5) % 16;
  return dirs[index];
}
