"use client";

import { useState, useRef } from "react";
import type { Feature } from "geojson";

interface KmlImportProps {
  onImport: (features: Feature[]) => void;
  onClose: () => void;
}

export function KmlImport({ onImport, onClose }: KmlImportProps) {
  const [dragActive, setDragActive] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importedCount, setImportedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setImporting(true);
    setError(null);

    try {
      const text = await file.text();
      let features: Feature[] = [];

      const fileName = file.name.toLowerCase();

      if (fileName.endsWith(".kml")) {
        // Parse KML using DOMParser + convert
        const parser = new DOMParser();
        const kmlDoc = parser.parseFromString(text, "text/xml");

        // Check for parse errors
        const parseError = kmlDoc.querySelector("parsererror");
        if (parseError) {
          throw new Error("Invalid KML file format");
        }

        // Extract polygons from KML
        const placemarks = kmlDoc.querySelectorAll("Placemark");
        placemarks.forEach((pm) => {
          const name = pm.querySelector("name")?.textContent || "Imported Zone";

          // Process Polygon
          const polygons = pm.querySelectorAll("Polygon");
          polygons.forEach((poly) => {
            const coords = poly.querySelector("coordinates");
            if (coords?.textContent) {
              const parsedCoords = parseKMLCoordinates(coords.textContent);
              if (parsedCoords.length >= 4) {
                features.push({
                  type: "Feature",
                  geometry: {
                    type: "Polygon",
                    coordinates: [parsedCoords],
                  },
                  properties: {
                    type: "custom",
                    name,
                    zoneLabel: name,
                    source: "kml-import",
                  },
                });
              }
            }
          });

          // Process LineString
          const lineStrings = pm.querySelectorAll("LineString");
          lineStrings.forEach((ls) => {
            const coords = ls.querySelector("coordinates");
            if (coords?.textContent) {
              const parsedCoords = parseKMLCoordinates(coords.textContent);
              if (parsedCoords.length >= 2) {
                features.push({
                  type: "Feature",
                  geometry: {
                    type: "LineString",
                    coordinates: parsedCoords,
                  },
                  properties: {
                    type: "custom",
                    name,
                    zoneLabel: name,
                    source: "kml-import",
                  },
                });
              }
            }
          });

          // Process Points
          const points = pm.querySelectorAll("Point");
          points.forEach((pt) => {
            const coords = pt.querySelector("coordinates");
            if (coords?.textContent) {
              const parsedCoords = parseKMLCoordinates(coords.textContent);
              if (parsedCoords.length >= 1) {
                features.push({
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: parsedCoords[0],
                  },
                  properties: {
                    type: "custom",
                    name,
                    zoneLabel: name,
                    source: "kml-import",
                  },
                });
              }
            }
          });
        });
      } else if (fileName.endsWith(".geojson") || fileName.endsWith(".json")) {
        // Parse GeoJSON directly
        const parsed = JSON.parse(text);

        if (parsed.type === "FeatureCollection" && Array.isArray(parsed.features)) {
          features = parsed.features.map((f: Feature) => ({
            ...f,
            properties: {
              ...f.properties,
              type: f.properties?.type || "custom",
              zoneLabel: f.properties?.name || f.properties?.zoneLabel || "Imported Zone",
              source: "geojson-import",
            },
          }));
        } else if (parsed.type === "Feature") {
          features = [{
            ...parsed,
            properties: {
              ...(parsed.properties || {}),
              type: parsed.properties?.type || "custom",
              zoneLabel: parsed.properties?.name || "Imported Zone",
              source: "geojson-import",
            },
          }];
        } else {
          throw new Error("Unsupported GeoJSON structure. Expected FeatureCollection or Feature.");
        }
      } else {
        throw new Error("Unsupported file type. Please use .kml, .geojson, or .json files.");
      }

      if (features.length === 0) {
        throw new Error("No valid geographic features found in the file.");
      }

      setImportedCount(features.length);
      onImport(features);

      // Auto-close after successful import
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (e: any) {
      setError(e.message || "Failed to import file");
    } finally {
      setImporting(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="absolute top-20 left-3 z-20 md:left-4 md:top-20 w-80">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-purple-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-purple-50 border-b border-purple-100">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-sm font-semibold text-purple-800">Import KML / GeoJSON</span>
          </div>
          <button onClick={onClose} className="text-purple-400 hover:text-purple-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4">
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
              dragActive
                ? "border-purple-400 bg-purple-50"
                : "border-gray-300 hover:border-purple-300 hover:bg-gray-50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".kml,.geojson,.json"
              onChange={handleFileChange}
              className="hidden"
            />
            <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-xs text-gray-600 font-medium">
              {dragActive ? "Drop file here" : "Click or drag KML / GeoJSON file"}
            </p>
            <p className="text-[10px] text-gray-400 mt-1">.kml, .geojson, .json</p>
          </div>

          {/* Status */}
          {importing && (
            <div className="mt-3 flex items-center gap-2 text-xs text-purple-600">
              <div className="w-3 h-3 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
              Importing...
            </div>
          )}

          {importedCount > 0 && (
            <div className="mt-3 text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2 border border-green-100">
              Successfully imported {importedCount} feature{importedCount > 1 ? "s" : ""}!
            </div>
          )}

          {error && (
            <div className="mt-3 text-xs text-red-700 bg-red-50 rounded-lg px-3 py-2 border border-red-100">
              {error}
            </div>
          )}

          {/* Help */}
          <div className="mt-3 text-[10px] text-gray-400 leading-relaxed">
            <p className="font-medium text-gray-500 mb-1">How to get KML data:</p>
            <ul className="space-y-0.5 list-disc list-inside">
              <li>Export from Google Earth or DGCA DigitalSky</li>
              <li>Download restricted zone boundaries from AAI</li>
              <li>Create custom zones in GIS tools (QGIS, etc.)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Parse KML coordinate string into [lng, lat, alt?][] format
function parseKMLCoordinates(text: string): [number, number][] {
  const coords: [number, number][] = [];
  const pairs = text.trim().split(/\s+/);

  for (const pair of pairs) {
    const parts = pair.split(",").map(Number);
    if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      coords.push([parts[0], parts[1]]); // KML: lng,lat,alt
    }
  }

  return coords;
}
