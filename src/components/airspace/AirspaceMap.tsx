"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { FACILITIES } from "@/data/facilities";
import type { ZoneFilterId } from "@/data/facilities";
import {
  MAP_STYLE_STANDARD,
  MAP_STYLE_SATELLITE,
  INDIA_CENTER,
  INDIA_DEFAULT_ZOOM,
  generateZoneGeoJSON,
  getZoneLayers,
  checkPointZone,
  type ZoneCheckResult,
  type AircraftState,
} from "@/lib/airspace";
import { ZoneControlPanel } from "./ZoneControlPanel";
import { SearchBar } from "./SearchBar";
import { InfoPanel } from "./InfoPanel";
import { WeatherWidget } from "./WeatherWidget";
import { LegendPanel } from "./LegendPanel";
import { KmlImport } from "./KmlImport";
import { FlightTracker } from "./FlightTracker";
import { MeasureTool, type Measurement } from "./MeasureTool";
import { NotamPanel } from "./NotamPanel";
import { UserPanel } from "./UserPanel";
import type { Feature } from "geojson";

// Haversine distance + bearing calculation
function calculateDistanceAndBearing(
  lat1: number, lng1: number, lat2: number, lng2: number
): { distanceKm: number; distanceNm: number; bearing: number } {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;
  const distanceNm = distanceKm * 0.539957;

  // Calculate bearing
  const y = Math.sin(dLng) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);
  const bearing = (toDeg(Math.atan2(y, x)) + 360) % 360;

  return { distanceKm, distanceNm, bearing };
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

function toDeg(rad: number): number {
  return rad * (180 / Math.PI);
}

export function AirspaceMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [isSatellite, setIsSatellite] = useState(false);
  const [activeZones, setActiveZones] = useState<Set<ZoneFilterId>>(
    new Set(["airport-red", "airport-inner", "airport-outer", "boundary"])
  );
  const [selectedPoint, setSelectedPoint] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [zoneInfo, setZoneInfo] = useState<ZoneCheckResult | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [showKmlImport, setShowKmlImport] = useState(false);
  const [showFlights, setShowFlights] = useState(false);
  const [showMeasure, setShowMeasure] = useState(false);
  const [showNotams, setShowNotams] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [customFeatures, setCustomFeatures] = useState<Feature[]>([]);
  const [flights, setFlights] = useState<AircraftState[]>([]);

  // Measure tool state
  const [measuring, setMeasuring] = useState(false);
  const [measurePoints, setMeasurePoints] = useState<
    { lat: number; lng: number }[]
  >([]);
  const [measurement, setMeasurement] = useState<Measurement | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const m = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLE_STANDARD,
      center: [INDIA_CENTER[1], INDIA_CENTER[0]],
      zoom: INDIA_DEFAULT_ZOOM,
      attributionControl: false,
    });

    m.addControl(new maplibregl.NavigationControl(), "bottom-right");
    m.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");

    m.on("load", () => {
      map.current = m;
      setMapReady(true);
    });

    // Click handler
    m.on("click", (e) => {
      const { lat, lng } = e.lngLat;

      // If in measure mode, handle measurement clicks
      if (measuring) {
        setMeasurePoints((prev) => {
          const newPoints = [...prev, { lat, lng }];

          if (newPoints.length === 2) {
            const result = calculateDistanceAndBearing(
              newPoints[0].lat,
              newPoints[0].lng,
              newPoints[1].lat,
              newPoints[1].lng
            );
            setMeasurement({
              pointA: newPoints[0],
              pointB: newPoints[1],
              ...result,
            });
            setMeasuring(false);
          }

          return newPoints;
        });
        return;
      }

      // Normal click - check zone
      setSelectedPoint({ lat, lng });
      const result = checkPointZone(lat, lng, FACILITIES);
      setZoneInfo(result);
      setShowInfo(true);
    });

    return () => {
      m.remove();
      map.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-attach click handler when measuring changes
  useEffect(() => {
    if (!map.current) return;
    // Update cursor style based on measure mode
    map.current.getCanvas().style.cursor = measuring ? "crosshair" : "";
  }, [measuring]);

  // Draw measurement line and points on map
  useEffect(() => {
    if (!map.current || !mapReady) return;

    const sourceId = "measure-source";
    const lineLayerId = "measure-line";
    const pointLayerId = "measure-points";

    const allPoints = [...measurePoints];

    // Build GeoJSON for measurement visualization
    const measureGeoJSON: any = {
      type: "FeatureCollection",
      features: [],
    };

    // Add points
    for (let i = 0; i < allPoints.length; i++) {
      measureGeoJSON.features.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [allPoints[i].lng, allPoints[i].lat],
        },
        properties: {
          label: i === 0 ? "A" : "B",
        },
      });
    }

    // Add line if two points
    if (allPoints.length === 2) {
      measureGeoJSON.features.push({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [
            [allPoints[0].lng, allPoints[0].lat],
            [allPoints[1].lng, allPoints[1].lat],
          ],
        },
        properties: {
          type: "measure-line",
        },
      });
    }

    // Update or add source and layers
    if (map.current.getSource(sourceId)) {
      (map.current.getSource(sourceId) as maplibregl.GeoJSONSource).setData(measureGeoJSON);
    } else if (allPoints.length > 0) {
      map.current.addSource(sourceId, {
        type: "geojson",
        data: measureGeoJSON,
      });

      // Measurement line
      map.current.addLayer({
        id: lineLayerId,
        type: "line",
        source: sourceId,
        filter: ["==", ["get", "type"], "measure-line"],
        paint: {
          "line-color": "#ff6d00",
          "line-width": 3,
          "line-dasharray": [2, 1],
        },
      });

      // Measurement points
      map.current.addLayer({
        id: pointLayerId,
        type: "circle",
        source: sourceId,
        filter: ["has", "label"],
        paint: {
          "circle-radius": 7,
          "circle-color": [
            "match",
            ["get", "label"],
            "A",
            "#4caf50",
            "B",
            "#f44336",
            "#ff6d00",
          ],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      // Point labels
      map.current.addLayer({
        id: "measure-labels",
        type: "symbol",
        source: sourceId,
        filter: ["has", "label"],
        layout: {
          "text-field": ["get", "label"],
          "text-size": 12,
          "text-offset": [0, 1.5],
          "text-anchor": "top",
          "text-allow-overlap": true,
        },
        paint: {
          "text-color": "#333333",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1,
        },
      });

      // Distance label at midpoint
      if (allPoints.length === 2 && measurement) {
        const midLat = (allPoints[0].lat + allPoints[1].lat) / 2;
        const midLng = (allPoints[0].lng + allPoints[1].lng) / 2;

        const midFeature: any = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: { type: "Point", coordinates: [midLng, midLat] },
              properties: {
                label: `${measurement.distanceKm.toFixed(1)} km`,
              },
            },
          ],
        };

        if (map.current.getSource("measure-mid-source")) {
          (map.current.getSource("measure-mid-source") as maplibregl.GeoJSONSource).setData(midFeature);
        } else {
          map.current.addSource("measure-mid-source", {
            type: "geojson",
            data: midFeature,
          });
          map.current.addLayer({
            id: "measure-mid-label",
            type: "symbol",
            source: "measure-mid-source",
            layout: {
              "text-field": ["get", "label"],
              "text-size": 13,
              "text-offset": [0, 0],
              "text-anchor": "center",
              "text-allow-overlap": true,
            },
            paint: {
              "text-color": "#e65100",
              "text-halo-color": "#ffffff",
              "text-halo-width": 2,
            },
          });
        }
      }
    }

    // Cleanup when no points
    if (allPoints.length === 0 && map.current.getSource(sourceId)) {
      try {
        if (map.current.getLayer(lineLayerId)) map.current.removeLayer(lineLayerId);
        if (map.current.getLayer(pointLayerId)) map.current.removeLayer(pointLayerId);
        if (map.current.getLayer("measure-labels")) map.current.removeLayer("measure-labels");
        if (map.current.getLayer("measure-mid-label")) map.current.removeLayer("measure-mid-label");
        map.current.removeSource(sourceId);
        if (map.current.getSource("measure-mid-source")) {
          map.current.removeSource("measure-mid-source");
        }
      } catch {}
    }
  }, [measurePoints, measurement, mapReady]);

  // Update zones when activeZones or customFeatures change
  useEffect(() => {
    if (!map.current || !mapReady) return;

    const geojson = generateZoneGeoJSON(FACILITIES, activeZones, customFeatures);

    const sourceId = "zones-source";

    if (map.current.getSource(sourceId)) {
      (map.current.getSource(sourceId) as maplibregl.GeoJSONSource).setData(geojson);
    } else {
      map.current.addSource(sourceId, {
        type: "geojson",
        data: geojson,
      });

      const layers = getZoneLayers();
      for (const layer of layers) {
        map.current.addLayer({
          id: layer.id,
          type: layer.type,
          source: sourceId,
          filter: layer.filter as any,
          paint: layer.paint as any,
        } as maplibregl.LayerSpecification);
      }

      // Popup on hover
      map.current.on("mouseenter", "facility-points", () => {
        map.current!.getCanvas().style.cursor = "pointer";
      });

      map.current.on("mouseleave", "facility-points", () => {
        map.current!.getCanvas().style.cursor = "";
      });

      map.current.on("click", "facility-points", (e) => {
        if (e.features && e.features[0]) {
          const props = e.features[0].properties;
          new maplibregl.Popup({ offset: 12 })
            .setLngLat(e.lngLat)
            .setHTML(
              `<div style="font-family:system-ui;padding:4px;">
                <strong>${props.facilityName}</strong><br/>
                <span style="color:#666;">Type: ${props.facilityType}</span>
                ${props.icao ? `<br/><span style="color:#666;">ICAO: ${props.icao}</span>` : ""}
              </div>`
            )
            .addTo(map.current!);
        }
      });
    }
  }, [activeZones, mapReady, customFeatures]);

  // Update flight positions on map
  useEffect(() => {
    if (!map.current || !mapReady || !showFlights) return;

    const sourceId = "flights-source";

    const flightGeoJSON = {
      type: "FeatureCollection" as const,
      features: flights.map((f) => ({
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: [f.lng, f.lat] as [number, number],
        },
        properties: {
          type: "aircraft",
          callsign: f.callsign,
          country: f.originCountry,
          altitude: f.baroAltitude,
          velocity: f.velocity,
          heading: f.heading,
          onGround: f.onGround,
          icao24: f.icao24,
        },
      })),
    };

    if (map.current.getSource(sourceId)) {
      (map.current.getSource(sourceId) as maplibregl.GeoJSONSource).setData(flightGeoJSON);
    } else {
      map.current.addSource(sourceId, {
        type: "geojson",
        data: flightGeoJSON,
      });

      map.current.addLayer({
        id: "aircraft-points",
        type: "circle",
        source: sourceId,
        filter: ["==", ["get", "type"], "aircraft"],
        paint: {
          "circle-radius": 4,
          "circle-color": "#2196F3",
          "circle-stroke-width": 1.5,
          "circle-stroke-color": "#ffffff",
        },
      });

      map.current.addLayer({
        id: "aircraft-labels",
        type: "symbol",
        source: sourceId,
        filter: ["==", ["get", "type"], "aircraft"],
        layout: {
          "text-field": ["get", "callsign"],
          "text-size": 10,
          "text-offset": [0, 1.2],
          "text-anchor": "top",
          "text-optional": true,
        },
        paint: {
          "text-color": "#1565C0",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1,
        },
      });

      map.current.on("click", "aircraft-points", (e) => {
        if (e.features && e.features[0]) {
          const props = e.features[0].properties;
          const alt = props.altitude
            ? `${Math.round(props.altitude * 3.281)} ft`
            : props.onGround
            ? "On Ground"
            : "N/A";
          const speed = props.velocity
            ? `${Math.round(props.velocity * 3.6)} km/h`
            : "N/A";
          const hdg = props.heading ? `${Math.round(props.heading)}°` : "N/A";

          new maplibregl.Popup({ offset: 12 })
            .setLngLat(e.lngLat)
            .setHTML(
              `<div style="font-family:system-ui;padding:6px;min-width:150px;">
                <div style="font-weight:700;color:#1565C0;margin-bottom:4px;">✈ ${props.callsign}</div>
                <div style="font-size:11px;color:#666;line-height:1.6;">
                  Country: ${props.country}<br/>
                  Altitude: ${alt}<br/>
                  Speed: ${speed}<br/>
                  Heading: ${hdg}<br/>
                  ICAO24: ${props.icao24?.toUpperCase()}
                </div>
              </div>`
            )
            .addTo(map.current!);
        }
      });

      map.current.on("mouseenter", "aircraft-points", () => {
        map.current!.getCanvas().style.cursor = "pointer";
      });
      map.current.on("mouseleave", "aircraft-points", () => {
        map.current!.getCanvas().style.cursor = "";
      });
    }
  }, [flights, mapReady, showFlights]);

  // Fetch flight data when tracker visible
  useEffect(() => {
    if (!showFlights) return;

    const fetchFlights = async () => {
      try {
        const res = await fetch("/api/flights");
        if (res.ok) {
          const data = await res.json();
          setFlights(data.states || []);
        }
      } catch {}
    };

    fetchFlights();
    const interval = setInterval(fetchFlights, 15000);
    return () => clearInterval(interval);
  }, [showFlights]);

  // Remove flight layers when hidden
  useEffect(() => {
    if (!map.current || !mapReady) return;
    if (!showFlights) {
      try {
        if (map.current.getLayer("aircraft-points")) {
          map.current.removeLayer("aircraft-points");
        }
        if (map.current.getLayer("aircraft-labels")) {
          map.current.removeLayer("aircraft-labels");
        }
        if (map.current.getSource("flights-source")) {
          map.current.removeSource("flights-source");
        }
      } catch {}
    }
  }, [showFlights, mapReady]);

  // Toggle map style
  const toggleMapStyle = useCallback(() => {
    if (!map.current) return;
    const newStyle = isSatellite ? MAP_STYLE_STANDARD : MAP_STYLE_SATELLITE;
    setIsSatellite(!isSatellite);
    map.current.setStyle(newStyle);

    map.current.once("style.load", () => {
      const geojson = generateZoneGeoJSON(FACILITIES, activeZones, customFeatures);
      map.current!.addSource("zones-source", {
        type: "geojson",
        data: geojson,
      });

      const layers = getZoneLayers();
      for (const layer of layers) {
        map.current!.addLayer({
          id: layer.id,
          type: layer.type,
          source: "zones-source",
          filter: layer.filter as any,
          paint: layer.paint as any,
        } as maplibregl.LayerSpecification);
      }

      // Re-add measurement layers if they exist
      if (measurePoints.length > 0) {
        setMeasurePoints([...measurePoints]); // trigger re-draw
      }
    });
  }, [isSatellite, activeZones, customFeatures, measurePoints]);

  const flyTo = useCallback((lat: number, lng: number, zoom?: number) => {
    if (!map.current) return;
    map.current.flyTo({
      center: [lng, lat],
      zoom: zoom || 12,
      speed: 1.2,
    });
  }, []);

  const toggleZone = useCallback((zoneId: ZoneFilterId) => {
    setActiveZones((prev) => {
      const next = new Set(prev);
      if (next.has(zoneId)) {
        next.delete(zoneId);
      } else {
        next.add(zoneId);
      }
      return next;
    });
  }, []);

  const handleKmlImport = useCallback((features: Feature[]) => {
    setCustomFeatures((prev) => [...prev, ...features]);
  }, []);

  const handleToggleMeasure = useCallback(() => {
    setMeasuring(true);
    setMeasurePoints([]);
    setMeasurement(null);
  }, []);

  const handleClearMeasurement = useCallback(() => {
    setMeasuring(false);
    setMeasurePoints([]);
    setMeasurement(null);
  }, []);

  const handleLoadZone = useCallback((features: any[]) => {
    setCustomFeatures((prev) => [...prev, ...features]);
  }, []);

  const getMapCenter = useCallback((): { lat: number; lng: number; zoom: number } | null => {
    if (!map.current) return null;
    const center = map.current.getCenter();
    return { lat: center.lat, lng: center.lng, zoom: map.current.getZoom() };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Map */}
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
        <div className="flex items-center gap-2 p-3 md:p-4 flex-wrap">
          <div className="pointer-events-auto bg-white/95 backdrop-blur-sm rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-3 border border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 leading-tight">India Airspace Map</h1>
              <p className="text-[10px] text-gray-500 leading-tight">DGCA Drone Zone Visualization</p>
            </div>
          </div>

          {/* Search */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="pointer-events-auto bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-2.5 border border-gray-100 hover:bg-gray-50 transition-colors"
            title="Search Location"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Legend */}
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="pointer-events-auto bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-2.5 border border-gray-100 hover:bg-gray-50 transition-colors"
            title="Legend"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </button>

          {/* KML Import */}
          <button
            onClick={() => setShowKmlImport(!showKmlImport)}
            className="pointer-events-auto bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-2.5 border border-purple-200 hover:bg-purple-50 transition-colors"
            title="Import KML/GeoJSON"
          >
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </button>

          {/* Flight Tracker */}
          <button
            onClick={() => setShowFlights(!showFlights)}
            className={`pointer-events-auto backdrop-blur-sm rounded-xl shadow-lg px-3 py-2.5 transition-colors text-xs font-medium flex items-center gap-1.5 ${
              showFlights
                ? "bg-blue-500 text-white border border-blue-400"
                : "bg-white/95 text-gray-700 border border-gray-100 hover:bg-gray-50"
            }`}
            title="Live Flight Tracker"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            {showFlights ? `${flights.length} Flights` : "Live Flights"}
          </button>

          {/* Measure Distance */}
          <button
            onClick={() => {
              if (showMeasure && !measuring) {
                handleClearMeasurement();
              }
              setShowMeasure(!showMeasure);
            }}
            className={`pointer-events-auto backdrop-blur-sm rounded-xl shadow-lg px-3 py-2.5 transition-colors text-xs font-medium flex items-center gap-1.5 ${
              showMeasure || measuring
                ? "bg-amber-500 text-white border border-amber-400"
                : "bg-white/95 text-gray-700 border border-gray-100 hover:bg-gray-50"
            }`}
            title="Measure Distance"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            {measuring ? "Click Map" : "Measure"}
          </button>

          {/* NOTAMs */}
          <button
            onClick={() => setShowNotams(!showNotams)}
            className={`pointer-events-auto backdrop-blur-sm rounded-xl shadow-lg px-3 py-2.5 transition-colors text-xs font-medium flex items-center gap-1.5 ${
              showNotams
                ? "bg-orange-500 text-white border border-orange-400"
                : "bg-white/95 text-gray-700 border border-gray-100 hover:bg-gray-50"
            }`}
            title="NOTAMs"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            NOTAMs
          </button>

          {/* User Profile */}
          <button
            onClick={() => setShowUser(!showUser)}
            className={`pointer-events-auto backdrop-blur-sm rounded-xl shadow-lg p-2.5 transition-colors ${
              showUser
                ? "bg-indigo-500 border border-indigo-400"
                : "bg-white/95 border border-gray-100 hover:bg-gray-50"
            }`}
            title="My Profile & Saved Data"
          >
            <svg className={`w-5 h-5 ${showUser ? "text-white" : "text-gray-700"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>

          {/* Satellite toggle */}
          <button
            onClick={toggleMapStyle}
            className="pointer-events-auto bg-white/95 backdrop-blur-sm rounded-xl shadow-lg px-3 py-2.5 border border-gray-100 hover:bg-gray-50 transition-colors text-xs font-medium text-gray-700"
          >
            {isSatellite ? "🗺️ Map" : "🛰️ Satellite"}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <SearchBar onFlyTo={flyTo} onClose={() => setShowSearch(false)} />
      )}

      {/* Legend */}
      {showLegend && <LegendPanel onClose={() => setShowLegend(false)} />}

      {/* KML Import */}
      {showKmlImport && (
        <KmlImport onImport={handleKmlImport} onClose={() => setShowKmlImport(false)} />
      )}

      {/* Measure Tool */}
      <MeasureTool
        visible={showMeasure}
        measuring={measuring}
        measurement={measurement}
        onToggleMeasure={handleToggleMeasure}
        onClearMeasurement={handleClearMeasurement}
        onClose={() => {
          handleClearMeasurement();
          setShowMeasure(false);
        }}
        pointCount={measurePoints.length}
      />

      {/* NOTAMs Panel */}
      <NotamPanel
        visible={showNotams}
        onClose={() => setShowNotams(false)}
        onFlyTo={flyTo}
      />

      {/* User Panel */}
      <UserPanel
        visible={showUser}
        onClose={() => setShowUser(false)}
        onFlyTo={flyTo}
        onLoadZone={handleLoadZone}
        currentCustomFeatures={customFeatures}
        getMapCenter={getMapCenter}
      />

      {/* Zone Controls */}
      <ZoneControlPanel activeZones={activeZones} onToggleZone={toggleZone} />

      {/* Info Panel */}
      {showInfo && zoneInfo && selectedPoint && (
        <InfoPanel
          zoneInfo={zoneInfo}
          lat={selectedPoint.lat}
          lng={selectedPoint.lng}
          onClose={() => setShowInfo(false)}
        />
      )}

      {/* Weather Widget */}
      {selectedPoint && (
        <WeatherWidget lat={selectedPoint.lat} lng={selectedPoint.lng} visible={showInfo} />
      )}

      {/* Flight Tracker Panel */}
      <FlightTracker visible={showFlights} onToggle={() => setShowFlights(!showFlights)} />

      {/* Measuring indicator */}
      {measuring && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 bg-amber-500 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium flex items-center gap-2 animate-pulse">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Click {measurePoints.length === 0 ? "Point A" : "Point B"} on the map
        </div>
      )}

      {/* Disclaimer */}
      <div className="absolute bottom-2 left-2 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-[10px] text-gray-500 max-w-xs border border-gray-100">
        Approximate data. Verify with{" "}
        <a
          href="https://digitalsky.dgca.gov.in/airspace-map/#/app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          DigitalSky (DGCA)
        </a>{" "}
        before flying.
      </div>
    </div>
  );
}
