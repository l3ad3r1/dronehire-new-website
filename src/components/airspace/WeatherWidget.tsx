"use client";

import { useEffect, useState, useRef } from "react";

interface WeatherData {
  temperature: string;
  windSpeed: string;
  visibility: string;
  weatherDescription: string;
}

interface WeatherWidgetProps {
  lat: number;
  lng: number;
  visible: boolean;
}

export function WeatherWidget({ lat, lng, visible }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const fetchedRef = useRef("");

  useEffect(() => {
    if (!visible) return;

    const key = `${lat.toFixed(2)},${lng.toFixed(2)}`;
    if (fetchedRef.current === key) return;
    fetchedRef.current = key;

    let cancelled = false;

    const fetchWeather = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);
        const data = await res.json();
        if (!cancelled) {
          setWeather(data);
        }
      } catch {
        // weather unavailable
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchWeather();

    return () => {
      cancelled = true;
    };
  }, [lat, lng, visible]);

  if (!visible) return null;

  return (
    <div className="absolute bottom-12 right-3 z-10 md:right-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 overflow-hidden w-52">
        <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Weather</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="w-4 h-4 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
          </div>
        ) : weather ? (
          <div className="p-3 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Condition</span>
              <span className="text-gray-800 font-medium">{weather.weatherDescription}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Temperature</span>
              <span className="text-gray-800 font-medium">{weather.temperature}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Wind</span>
              <span className="text-gray-800 font-medium">{weather.windSpeed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Visibility</span>
              <span className="text-gray-800 font-medium">{weather.visibility}</span>
            </div>
          </div>
        ) : (
          <div className="p-3 text-xs text-gray-400 text-center">Weather unavailable</div>
        )}
      </div>
    </div>
  );
}
