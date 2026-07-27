"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl, { type GeoJSONSource, type Map as MapLibreMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  Aperture,
  Camera,
  ChevronRight,
  Clock3,
  Download,
  MapPin,
  Navigation,
  Plane,
  Plus,
  Route,
  ShieldAlert,
  Trash2,
  X,
} from "lucide-react";
import { FACILITIES, type ZoneFilterId } from "@/data/facilities";
import { checkPointZone, generateZoneGeoJSON, getZoneLayers, type ZoneCheckResult } from "@/lib/airspace";

type ShotType = "Photo" | "Panorama" | "Orbit";

type PhotoWaypoint = {
  id: number;
  name: string;
  coordinates: [number, number];
  altitude: number;
  heading: number;
  gimbal: number;
  shot: ShotType;
  zone: ZoneCheckResult;
};

const ALL_ZONES = new Set<ZoneFilterId>([
  "airport-red",
  "airport-inner",
  "airport-outer",
  "runway",
  "boundary",
  "temp-red",
  "helipad-red",
  "abandoned-red",
]);

const HYDERABAD: [number, number] = [78.3814, 17.4435];

function routeDistance(waypoints: PhotoWaypoint[]) {
  return waypoints.slice(1).reduce((total, point, index) => {
    const previous = waypoints[index];
    const lat1 = previous.coordinates[1] * Math.PI / 180;
    const lat2 = point.coordinates[1] * Math.PI / 180;
    const dLat = lat2 - lat1;
    const dLng = (point.coordinates[0] - previous.coordinates[0]) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return total + 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }, 0);
}

function zoneTone(zone: ZoneCheckResult) {
  if (zone.zoneType === "green") return { label: "Green zone", color: "#39d98a", className: "text-emerald-400" };
  if (zone.zoneType === "outer-yellow" || zone.zoneType === "inner-yellow") {
    return { label: "Permission required", color: "#f5b942", className: "text-amber-400" };
  }
  return { label: "Restricted", color: "#ff493d", className: "text-red-400" };
}

export function MissionPlanner() {
  const mapNode = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [missionName, setMissionName] = useState("Hyderabad aerial photo mission");
  const [waypoints, setWaypoints] = useState<PhotoWaypoint[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showZones, setShowZones] = useState(true);
  const [showBuildings, setShowBuildings] = useState(true);
  const [mobilePanel, setMobilePanel] = useState(false);

  const activeWaypoint = waypoints.find((waypoint) => waypoint.id === selectedId) ?? null;
  const distance = useMemo(() => routeDistance(waypoints), [waypoints]);
  const estimatedMinutes = waypoints.length ? (distance / 8 + waypoints.length * 8) / 60 : 0;
  const restrictedCount = waypoints.filter((waypoint) => waypoint.zone.zoneType !== "green").length;

  useEffect(() => {
    if (!mapNode.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: mapNode.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: HYDERABAD,
      zoom: 15,
      pitch: 62,
      bearing: -24,
      maxPitch: 85,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "bottom-right");
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
    map.on("load", () => {
      mapRef.current = map;
      setMapReady(true);

      if (map.getLayer("building-3d")) {
        map.setPaintProperty("building-3d", "fill-extrusion-color", [
          "interpolate",
          ["linear"],
          ["coalesce", ["get", "render_height"], 6],
          0, "#d8d2ca",
          30, "#ba9e89",
          80, "#786d68",
          150, "#303438",
        ]);
        map.setPaintProperty("building-3d", "fill-extrusion-opacity", 0.88);
      }

      map.addSource("mission-plan", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      map.addLayer({
        id: "mission-route",
        type: "line",
        source: "mission-plan",
        filter: ["==", ["geometry-type"], "LineString"],
        paint: { "line-color": "#ff5a1f", "line-width": 4, "line-dasharray": [1.2, 1.2] },
      });
      map.addLayer({
        id: "mission-points",
        type: "circle",
        source: "mission-plan",
        filter: ["==", ["geometry-type"], "Point"],
        paint: {
          "circle-radius": ["case", ["==", ["get", "selected"], true], 11, 8],
          "circle-color": ["get", "color"],
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 3,
        },
      });
      map.addLayer({
        id: "mission-labels",
        type: "symbol",
        source: "mission-plan",
        filter: ["==", ["geometry-type"], "Point"],
        layout: {
          "text-field": ["get", "label"],
          "text-size": 11,
          "text-offset": [0, 1.5],
          "text-anchor": "top",
          "text-font": ["Noto Sans Regular"],
        },
        paint: { "text-color": "#111111", "text-halo-color": "#ffffff", "text-halo-width": 2 },
      });

      const zones = generateZoneGeoJSON(FACILITIES, ALL_ZONES);
      map.addSource("planner-zones", { type: "geojson", data: zones });
      for (const layer of getZoneLayers()) {
        map.addLayer({ ...layer, id: `planner-${layer.id}`, source: "planner-zones" } as maplibregl.LayerSpecification);
      }
    });

    map.on("click", (event) => {
      const pointFeatures = map.getLayer("mission-points")
        ? map.queryRenderedFeatures(event.point, { layers: ["mission-points"] })
        : [];
      if (pointFeatures[0]) {
        setSelectedId(Number(pointFeatures[0].properties?.id));
        return;
      }
      const coordinates: [number, number] = [event.lngLat.lng, event.lngLat.lat];
      const zone = checkPointZone(coordinates[1], coordinates[0], FACILITIES);
      const id = Date.now();
      setWaypoints((current) => [...current, {
        id,
        name: `Camera position ${current.length + 1}`,
        coordinates,
        altitude: current.at(-1)?.altitude ?? 80,
        heading: Math.round((map.getBearing() + 360) % 360),
        gimbal: -45,
        shot: "Photo",
        zone,
      }]);
      setSelectedId(id);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const source = mapRef.current.getSource("mission-plan") as GeoJSONSource | undefined;
    if (!source) return;
    const points = waypoints.map((waypoint, index) => ({
      type: "Feature" as const,
      properties: {
        id: waypoint.id,
        label: `${String(index + 1).padStart(2, "0")} · ${waypoint.shot}`,
        selected: waypoint.id === selectedId,
        color: zoneTone(waypoint.zone).color,
      },
      geometry: { type: "Point" as const, coordinates: waypoint.coordinates },
    }));
    const route = {
      type: "Feature" as const,
      properties: {},
      geometry: { type: "LineString" as const, coordinates: waypoints.map((waypoint) => waypoint.coordinates) },
    };
    source.setData({ type: "FeatureCollection", features: waypoints.length > 1 ? [route, ...points] : points });
  }, [mapReady, waypoints, selectedId]);

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    for (const layer of getZoneLayers()) {
      const id = `planner-${layer.id}`;
      if (mapRef.current.getLayer(id)) mapRef.current.setLayoutProperty(id, "visibility", showZones ? "visible" : "none");
    }
  }, [mapReady, showZones]);

  useEffect(() => {
    if (!mapReady || !mapRef.current?.getLayer("building-3d")) return;
    mapRef.current.setLayoutProperty("building-3d", "visibility", showBuildings ? "visible" : "none");
    mapRef.current.easeTo({ pitch: showBuildings ? 62 : 0, duration: 700 });
  }, [mapReady, showBuildings]);

  function updateWaypoint(changes: Partial<PhotoWaypoint>) {
    if (!selectedId) return;
    setWaypoints((current) => current.map((waypoint) => waypoint.id === selectedId ? { ...waypoint, ...changes } : waypoint));
  }

  function removeWaypoint(id: number) {
    setWaypoints((current) => current.filter((waypoint) => waypoint.id !== id));
    setSelectedId((current) => current === id ? null : current);
  }

  function clearMission() {
    setWaypoints([]);
    setSelectedId(null);
  }

  function exportMission() {
    const payload = {
      name: missionName,
      createdAt: new Date().toISOString(),
      routeDistanceMeters: Math.round(distance),
      estimatedFlightMinutes: Number(estimatedMinutes.toFixed(1)),
      waypoints: waypoints.map(({ id, zone, ...waypoint }, index) => ({
        sequence: index + 1,
        ...waypoint,
        airspace: { type: zone.zoneType, label: zone.zoneLabel, facility: zone.facilityName },
      })),
      notice: "Planning aid only. Verify DigitalSky, NOTAMs, local permissions, weather, terrain and site conditions before flight.",
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${missionName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "dronehire-mission"}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function bookMission() {
    if (waypoints[0]) {
      localStorage.setItem("dronehire-mission", JSON.stringify({
        name: missionName,
        location: { lat: waypoints[0].coordinates[1], lng: waypoints[0].coordinates[0] },
        routeDistanceMeters: Math.round(distance),
        waypointCount: waypoints.length,
        waypoints,
      }));
    }
    window.location.href = "/book?source=mission-planner";
  }

  return (
    <div className="relative h-full min-h-[700px] overflow-hidden bg-[#0a0a0a] text-white">
      <div ref={mapNode} className="absolute inset-0" />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start gap-3 p-4">
        <div className="pointer-events-auto flex items-center gap-3 border border-white/10 bg-[#111]/95 px-4 py-3 shadow-2xl backdrop-blur-xl">
          <div className="flex h-9 w-9 items-center justify-center bg-primary text-white"><Plane className="h-5 w-5" /></div>
          <div><strong className="font-display text-xs tracking-[0.16em]">MISSION STUDIO</strong><span className="block font-mono text-[9px] tracking-[0.14em] text-white/40">HYDERABAD · 3D PHOTO PLANNER</span></div>
        </div>
        <div className="pointer-events-auto ml-auto hidden items-center gap-2 md:flex">
          <button onClick={() => setShowZones(!showZones)} className={`border px-3 py-2 font-mono text-[10px] tracking-wider ${showZones ? "border-primary bg-primary text-white" : "border-white/10 bg-[#111]/90 text-white/60"}`}>AIRSPACE</button>
          <button onClick={() => setShowBuildings(!showBuildings)} className={`border px-3 py-2 font-mono text-[10px] tracking-wider ${showBuildings ? "border-primary bg-primary text-white" : "border-white/10 bg-[#111]/90 text-white/60"}`}>3D BUILDINGS</button>
        </div>
      </div>

      <aside className={`absolute inset-y-0 left-0 z-30 mt-[68px] flex w-[390px] max-w-[calc(100vw-24px)] flex-col border-r border-white/10 bg-[#0e0e0e]/97 shadow-2xl backdrop-blur-xl transition-transform md:translate-x-0 ${mobilePanel ? "translate-x-0" : "-translate-x-[105%]"}`}>
        <div className="border-b border-white/10 p-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[9px] tracking-[0.25em] text-primary">PRE-FLIGHT PLANNING</span>
            <button onClick={() => setMobilePanel(false)} className="text-white/40 md:hidden"><X className="h-4 w-4" /></button>
          </div>
          <input value={missionName} onChange={(event) => setMissionName(event.target.value)} aria-label="Mission name" className="w-full border-0 bg-transparent font-display text-xl font-bold tracking-tight text-white outline-none placeholder:text-white/25" />
          <p className="mt-2 font-mono text-[10px] leading-relaxed text-white/40">Click the map to position each drone photograph. Airspace status is checked automatically.</p>
        </div>

        <div className="grid grid-cols-3 border-b border-white/10">
          <Metric icon={<Route />} label="Route" value={distance > 999 ? `${(distance / 1000).toFixed(1)} km` : `${Math.round(distance)} m`} />
          <Metric icon={<Clock3 />} label="Est. flight" value={`${estimatedMinutes.toFixed(1)} min`} />
          <Metric icon={<Camera />} label="Positions" value={String(waypoints.length)} />
        </div>

        {restrictedCount > 0 && (
          <div className="flex items-start gap-3 border-b border-red-500/25 bg-red-500/10 p-4">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
            <p className="font-mono text-[9px] leading-relaxed text-red-200">{restrictedCount} position{restrictedCount === 1 ? "" : "s"} require permission or fall in restricted airspace. Review before booking.</p>
          </div>
        )}

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
            <span className="font-mono text-[9px] tracking-[0.2em] text-white/45">PHOTO POSITIONS</span>
            <span className="font-mono text-[9px] text-primary">CLICK MAP TO ADD</span>
          </div>
          <div className="max-h-[225px] overflow-y-auto border-b border-white/10">
            {waypoints.map((waypoint, index) => {
              const tone = zoneTone(waypoint.zone);
              return (
                <div key={waypoint.id} role="button" tabIndex={0} onClick={() => { setSelectedId(waypoint.id); mapRef.current?.flyTo({ center: waypoint.coordinates, zoom: 16, pitch: 65, bearing: waypoint.heading, duration: 900 }); }} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedId(waypoint.id); } }} className={`grid w-full cursor-pointer grid-cols-[26px_36px_1fr_24px] items-center gap-2 border-b border-white/5 px-4 py-3 text-left transition-colors ${selectedId === waypoint.id ? "bg-primary/10 shadow-[inset_3px_0_0_#ff5500]" : "hover:bg-white/5"}`}>
                  <span className="font-mono text-[9px] text-white/30">{String(index + 1).padStart(2, "0")}</span>
                  <span className="flex h-8 w-8 items-center justify-center border border-white/10 bg-white/5"><Camera className="h-4 w-4 text-primary" /></span>
                  <span className="min-w-0"><strong className="block truncate font-display text-xs">{waypoint.name}</strong><small className="mt-1 block truncate font-mono text-[8px] text-white/40">{waypoint.altitude}m · {waypoint.heading}° · <i className={`not-italic ${tone.className}`}>{tone.label}</i></small></span>
                  <button onClick={(event) => { event.stopPropagation(); removeWaypoint(waypoint.id); }} className="flex h-6 w-6 items-center justify-center text-white/30 hover:text-red-400" aria-label={`Remove ${waypoint.name}`}><X className="h-3.5 w-3.5" /></button>
                </div>
              );
            })}
            {!waypoints.length && (
              <div className="flex min-h-32 flex-col items-center justify-center px-8 text-center">
                <MapPin className="h-6 w-6 text-primary/60" />
                <strong className="mt-3 font-display text-xs tracking-wide text-white/65">NO POSITIONS PLACED</strong>
                <span className="mt-1 font-mono text-[9px] leading-relaxed text-white/30">Click a location on the 3D map to compose your first shot.</span>
              </div>
            )}
          </div>

          {activeWaypoint ? (
            <div className="overflow-y-auto p-5">
              <div className="mb-4 flex items-center justify-between"><span className="font-mono text-[9px] tracking-[0.2em] text-white/45">CAMERA SETUP</span><span className={`font-mono text-[9px] ${zoneTone(activeWaypoint.zone).className}`}>{zoneTone(activeWaypoint.zone).label.toUpperCase()}</span></div>
              <div className="grid grid-cols-3 gap-2">
                {(["Photo", "Panorama", "Orbit"] as ShotType[]).map((shot) => <button key={shot} onClick={() => updateWaypoint({ shot })} className={`border px-2 py-2 font-mono text-[9px] ${activeWaypoint.shot === shot ? "border-primary bg-primary text-white" : "border-white/10 text-white/50"}`}>{shot}</button>)}
              </div>
              <RangeControl label="Altitude" value={activeWaypoint.altitude} suffix=" m" min={20} max={120} step={5} onChange={(altitude) => updateWaypoint({ altitude })} />
              <RangeControl label="Aircraft heading" value={activeWaypoint.heading} suffix="°" min={0} max={359} step={1} onChange={(heading) => { updateWaypoint({ heading }); mapRef.current?.easeTo({ bearing: heading, duration: 120 }); }} />
              <RangeControl label="Gimbal pitch" value={activeWaypoint.gimbal} suffix="°" min={-90} max={0} step={5} onChange={(gimbal) => updateWaypoint({ gimbal })} />
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center p-6 text-center font-mono text-[9px] leading-relaxed text-white/25">Select a photo position to configure the aircraft and camera.</div>
          )}
        </div>

        <div className="grid grid-cols-[1fr_48px] gap-2 border-t border-white/10 p-4">
          <button disabled={!waypoints.length} onClick={exportMission} className="flex h-11 items-center justify-center gap-2 bg-primary font-mono text-[10px] tracking-[0.12em] text-white disabled:cursor-not-allowed disabled:opacity-35"><Download className="h-4 w-4" /> EXPORT PLAN</button>
          <button disabled={!waypoints.length} onClick={clearMission} aria-label="Clear mission" className="flex items-center justify-center border border-white/10 text-white/40 hover:border-red-500/50 hover:text-red-400 disabled:opacity-30"><Trash2 className="h-4 w-4" /></button>
          <button disabled={!waypoints.length} onClick={bookMission} className="col-span-2 flex h-11 items-center justify-between border border-white/15 px-4 font-mono text-[10px] tracking-[0.12em] text-white/80 hover:border-primary hover:text-white disabled:opacity-30"><span>BOOK A PILOT FOR THIS MISSION</span><ChevronRight className="h-4 w-4 text-primary" /></button>
        </div>
      </aside>

      <button onClick={() => setMobilePanel(true)} className="absolute left-4 top-20 z-20 flex items-center gap-2 bg-primary px-4 py-3 font-mono text-[10px] tracking-wider text-white shadow-xl md:hidden"><Aperture className="h-4 w-4" /> MISSION</button>

      <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 border border-white/10 bg-[#0b0b0b]/90 px-4 py-2 font-mono text-[9px] text-white/40 backdrop-blur md:block">
        PLANNING AID ONLY · VERIFY DIGITALSKY, NOTAMS, WEATHER, TERRAIN &amp; SITE PERMISSIONS
      </div>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactElement<{ className?: string }>; label: string; value: string }) {
  return <div className="border-r border-white/10 p-4 last:border-0"><div className="mb-2 text-primary">{icon && <span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>}</div><span className="block font-mono text-[8px] tracking-wider text-white/30">{label.toUpperCase()}</span><strong className="mt-1 block font-mono text-xs text-white">{value}</strong></div>;
}

function RangeControl({ label, value, suffix, min, max, step, onChange }: { label: string; value: number; suffix: string; min: number; max: number; step: number; onChange: (value: number) => void }) {
  return <label className="mt-4 block"><span className="flex items-center justify-between font-mono text-[9px] text-white/45"><span>{label.toUpperCase()}</span><b className="text-white">{value}{suffix}</b></span><input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-3 h-1 w-full cursor-pointer accent-primary" /></label>;
}
