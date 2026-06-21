"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState, useCallback, type KeyboardEvent } from "react";
import { MapPin, Calendar, ChevronRight, Star, Shield, AlertTriangle, XCircle, CheckCircle, RefreshCw, Phone, Search, Loader2 } from "lucide-react";
import { FACILITIES } from "@/data/facilities";
import { generateZoneGeoJSON, checkPointZone } from "@/lib/airspace";
import type { ZoneCheckResult } from "@/lib/airspace";
import { Navbar } from "@/components/Navbar";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const BOOK_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Airspace Map", href: "/map" },
  { label: "Drone Sim", href: "/game" },
  { label: "Fly with us", href: "/pilots" },
];

// All zones active for display
const ALL_ZONES = new Set([
  "airport-red", "airport-inner-yellow", "airport-outer-yellow",
  "boundary", "temp-red", "helipad-red", "helipad-yellow",
  "abandoned-red", "abandoned-yellow",
] as any);

const SERVICES = [
  { id: "realestate", icon: "🏠", label: "Real Estate", price: 3500, description: "Property & land aerial photos" },
  { id: "wedding",    icon: "💍", label: "Wedding",     price: 5000, description: "Event & ceremony coverage" },
  { id: "construction", icon: "🏗️", label: "Construction", price: 3000, description: "Progress documentation" },
  { id: "agriculture",  icon: "🌾", label: "Agriculture",  price: 4000, description: "Land survey & spraying" },
];

const PILOTS = [
  { id: "p1", name: "Arjun Reddy",  initials: "AR", color: "#2563eb", rating: 4.8, reviews: 142, distance: "2.3 km", certs: ["DGCA RPC", "NPNT Enabled"], lat: 17.412, lng: 78.491 },
  { id: "p2", name: "Priya Sharma", initials: "PS", color: "#7c3aed", rating: 4.9, reviews: 89,  distance: "3.7 km", certs: ["DGCA RPC", "NPNT Enabled", "Night Ops"], lat: 17.368, lng: 78.472 },
  { id: "p3", name: "Kiran Naidu",  initials: "KN", color: "#0891b2", rating: 4.7, reviews: 204, distance: "5.1 km", certs: ["DGCA RPC"], lat: 17.395, lng: 78.512 },
];

type Step = 1 | 2 | 3;

function inr(n: number) { return `₹${n.toLocaleString("en-IN")}`; }

function ZoneBanner({ zone }: { zone: ZoneCheckResult | null }) {
  if (!zone || zone.zoneType === "green") return (
    <div className="flex items-start gap-2.5 bg-green-50 border border-green-200 rounded-xl p-3 text-sm">
      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-green-800">Green Zone — Clear to fly</p>
        <p className="text-green-700 text-xs mt-0.5">No permission required for standard drone operations below 400ft.</p>
      </div>
    </div>
  );

  if (zone.zoneType === "red" || zone.zoneType === "temporary_red_zone" || zone.zoneType === "boundary") return (
    <div className="flex items-start gap-2.5 bg-red-50 border border-red-300 rounded-xl p-3 text-sm">
      <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-red-800">Red Zone — Prohibited ⛔</p>
        <p className="text-red-700 text-xs mt-0.5">
          Within {zone.facilityName} restricted airspace. DGCA DigitalSky permission required.
          Your pilot will file the required clearance before flying.
        </p>
      </div>
    </div>
  );

  if (zone.zoneType === "approach") return (
    <div className="flex items-start gap-2.5 bg-orange-50 border border-orange-300 rounded-xl p-3 text-sm">
      <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-orange-800">Approach Path — ATC Coordination Required</p>
        <p className="text-orange-700 text-xs mt-0.5">
          Near {zone.facilityName} approach corridor. Pilot must coordinate with ATC before operating.
        </p>
      </div>
    </div>
  );

  // inner/outer yellow
  return (
    <div className="flex items-start gap-2.5 bg-yellow-50 border border-yellow-300 rounded-xl p-3 text-sm">
      <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-yellow-800">
          {zone.zoneType === "inner-yellow" ? "Yellow Zone — Permission Required ⚠️" : "Caution Zone — Notice Required ⚠️"}
        </p>
        <p className="text-yellow-800 text-xs mt-0.5">
          {zone.zoneType === "inner-yellow"
            ? `Within ${zone.facilityName} controlled airspace. Pilot needs DigitalSky approval before flying.`
            : `Near ${zone.facilityName} airspace boundary. Pilot will file a LAANC-equivalent notice.`}
        </p>
      </div>
    </div>
  );
}

export default function BookPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const pinMarkerRef = useRef<any>(null);
  const mapLibreRef = useRef<any>(null);

  const [step, setStep] = useState<Step>(1);
  const [selectedService, setSelectedService] = useState<typeof SERVICES[0] | null>(null);
  const [location, setLocation] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [locationSearching, setLocationSearching] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [date, setDate] = useState("");
  const [today, setToday] = useState("");
  const [zone, setZone] = useState<ZoneCheckResult | null>(null);
  const [matchedPilot, setMatchedPilot] = useState(PILOTS[0]);
  const [appearedPilots, setAppearedPilots] = useState<Set<string>>(new Set());
  const [booked, setBooked] = useState(false);

  useEffect(() => { setToday(new Date().toISOString().split("T")[0]); }, []);

  // Place a pin on the map at given coords
  const placePin = useCallback((lat: number, lng: number) => {
    const maplibregl = mapLibreRef.current;
    const map = mapInstanceRef.current;
    if (!maplibregl || !map) return;
    if (pinMarkerRef.current) {
      pinMarkerRef.current.setLngLat([lng, lat]);
    } else {
      const el = document.createElement("div");
      el.innerHTML = `<svg viewBox="0 0 24 36" width="28" height="42" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="#ff5500"/><circle cx="12" cy="12" r="5" fill="white"/></svg>`;
      el.style.cssText = "cursor:pointer;filter:drop-shadow(0 2px 4px rgba(0,0,0,.4))";
      pinMarkerRef.current = new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([lng, lat])
        .addTo(map);
    }
  }, []);

  // Forward geocode: type an address → fly map there + drop pin
  const forwardGeocode = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setLocationSearching(true);
    setLocationError("");
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ", Hyderabad, India")}&limit=1`,
        { headers: { "User-Agent": "DroneHire/1.0" } }
      );
      const data = await res.json();
      if (!data.length) { setLocationError("Location not found — try a landmark or area name"); return; }
      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);
      const label = data[0].display_name.split(",")[0];
      mapInstanceRef.current?.flyTo({ center: [lng, lat], zoom: 15, speed: 1.4 });
      placePin(lat, lng);
      setCoords({ lat, lng });
      setLocation(`${label}, Hyderabad`);
      setLocationQuery(`${label}, Hyderabad`);
    } catch {
      setLocationError("Search failed — try clicking the map instead");
    } finally {
      setLocationSearching(false);
    }
  }, [placePin]);

  // Zone check when coords change
  useEffect(() => {
    if (!coords) { setZone(null); return; }
    const result = checkPointZone(coords.lat, coords.lng, FACILITIES);
    setZone(result);
  }, [coords]);

  // Reverse geocode for human-readable location name
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        { headers: { "User-Agent": "DroneHire/1.0" } }
      );
      const data = await res.json();
      const addr = data.address;
      const name = addr?.suburb || addr?.neighbourhood || addr?.village || addr?.town || addr?.city || "Selected location";
      setLocation(`${name}, Hyderabad`);
    } catch {
      setLocation(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  }, []);

  // Init map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    let map: any;

    (async () => {
      const maplibregl = (await import("maplibre-gl")).default;
      mapLibreRef.current = maplibregl;

      map = new maplibregl.Map({
        container: mapRef.current!,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png", "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: "© OpenStreetMap",
            },
          },
          layers: [{ id: "osm", type: "raster", source: "osm" }],
        },
        center: [78.486, 17.385],
        zoom: 11,
      });

      mapInstanceRef.current = map;

      map.on("load", () => {
        // Generate and add airspace zone layers
        const zoneGeoJSON = generateZoneGeoJSON(FACILITIES, ALL_ZONES);

        map.addSource("zones", { type: "geojson", data: zoneGeoJSON });

        // Outer yellow fill
        map.addLayer({
          id: "zones-outer-yellow-fill",
          type: "fill",
          source: "zones",
          filter: ["==", ["get", "type"], "outer-yellow"],
          paint: { "fill-color": "#f59e0b", "fill-opacity": 0.08 },
        });
        map.addLayer({
          id: "zones-outer-yellow-line",
          type: "line",
          source: "zones",
          filter: ["==", ["get", "type"], "outer-yellow"],
          paint: { "line-color": "#f59e0b", "line-width": 1, "line-dasharray": [3, 2] },
        });

        // Inner yellow fill
        map.addLayer({
          id: "zones-inner-yellow-fill",
          type: "fill",
          source: "zones",
          filter: ["==", ["get", "type"], "inner-yellow"],
          paint: { "fill-color": "#fbbf24", "fill-opacity": 0.15 },
        });
        map.addLayer({
          id: "zones-inner-yellow-line",
          type: "line",
          source: "zones",
          filter: ["==", ["get", "type"], "inner-yellow"],
          paint: { "line-color": "#f59e0b", "line-width": 1.5 },
        });

        // Red fill
        map.addLayer({
          id: "zones-red-fill",
          type: "fill",
          source: "zones",
          filter: ["in", ["get", "type"], ["literal", ["red", "temporary_red_zone", "boundary"]]],
          paint: { "fill-color": "#ef4444", "fill-opacity": 0.2 },
        });
        map.addLayer({
          id: "zones-red-line",
          type: "line",
          source: "zones",
          filter: ["in", ["get", "type"], ["literal", ["red", "temporary_red_zone", "boundary"]]],
          paint: { "line-color": "#ef4444", "line-width": 2 },
        });

        // Pilot markers
        PILOTS.forEach((p) => {
          const el = document.createElement("div");
          el.style.cssText = `width:34px;height:34px;border-radius:50%;background:${p.color};border:2.5px solid white;box-shadow:0 2px 8px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:11px;cursor:pointer;`;
          el.textContent = p.initials;
          new maplibregl.Marker({ element: el })
            .setLngLat([p.lng, p.lat])
            .setPopup(new maplibregl.Popup({ offset: 16, closeButton: false })
              .setHTML(`<div style="font:13px sans-serif;padding:2px 0"><strong>${p.name}</strong><br/><span style="color:#f59e0b">★ ${p.rating}</span> · ${p.distance}</div>`))
            .addTo(map);
        });

        // Map click → pin location
        map.on("click", (e: any) => {
          const { lng, lat } = e.lngLat;
          placePin(lat, lng);
          setCoords({ lat, lng });
          reverseGeocode(lat, lng);
        });
      });
    })();

    return () => {
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }
    };
  }, [reverseGeocode, placePin]);

  // Searching animation
  useEffect(() => {
    if (step !== 2) return;
    PILOTS.forEach((p, i) => {
      const t = setTimeout(() => setAppearedPilots((prev) => new Set([...prev, p.id])), 500 + i * 400);
      return () => clearTimeout(t);
    });
    const adv = setTimeout(() => { setMatchedPilot(PILOTS[0]); setStep(3); }, 2200);
    return () => clearTimeout(adv);
  }, [step]);

  function handleFindPilots() {
    if (!selectedService || !coords) return;
    setAppearedPilots(new Set());
    setBooked(false);
    setStep(2);
  }

  const zoneLabel = zone
    ? zone.zoneType === "green" ? "green" : zone.zoneType.includes("yellow") ? "yellow" : "red"
    : null;

  const waMessage = encodeURIComponent(
    `Hi, I want to book a ${selectedService?.label || "drone"} shoot.\n` +
    `📍 Location: ${location || "Hyderabad"}\n` +
    `📅 Date: ${date || "TBD"}\n` +
    `💰 Budget: ${selectedService ? inr(selectedService.price) : ""}+\n` +
    (zone && zone.zoneType !== "green"
      ? `⚠️ Zone: ${zone.zoneLabel} — ${zone.facilityName}. Please arrange required clearance.\n`
      : `✅ Zone: Green — no restrictions.\n`) +
    `Pilot: ${matchedPilot.name}`
  );

  return (
    <>
    <Navbar links={BOOK_NAV_LINKS} hideCta={true} />
    <WhatsAppButton />
    <div className="flex" style={{ marginTop: "64px", height: "calc(100vh - 64px)" }}>
      {/* Left panel */}
      <aside className="flex-shrink-0 w-full md:w-[400px] h-full overflow-y-auto bg-[#fafafa] border-r border-border z-10 flex flex-col">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-border bg-[#121212]">
          <p className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase mb-1">Hyderabad · DGCA Zones Active</p>
          <h1 className="font-display text-lg font-bold text-white tracking-tight">BOOK A DRONE PILOT</h1>
          <p className="font-mono text-[10px] text-white/50 mt-1 tracking-wide">Click anywhere on the map to set your shoot location</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 bg-[#121212] border-b border-white/10">
          {([1, 2, 3] as Step[]).map((s) => (
            <div key={s} className="flex items-center gap-1">
              <div className={`w-6 h-6 flex items-center justify-center text-xs font-bold transition-colors ${step === s ? "bg-primary text-white" : step > s ? "bg-green-500 text-white" : "bg-white/10 text-white/40"}`}>
                {step > s ? "✓" : s}
              </div>
              <span className={`font-mono text-[10px] tracking-wide ${step === s ? "text-white" : "text-white/30"}`}>
                {s === 1 ? "Location & Service" : s === 2 ? "Finding Pilots" : "Confirm"}
              </span>
              {s < 3 && <ChevronRight className="w-3 h-3 text-white/20" />}
            </div>
          ))}
        </div>

        <div className="flex-1 px-5 py-4 flex flex-col gap-4">

          {/* STEP 1 */}
          {step === 1 && (
            <>
              {/* Location search */}
              <div>
                <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase mb-1.5">Shoot Location</p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={locationQuery}
                      onChange={(e) => { setLocationQuery(e.target.value); setLocationError(""); }}
                      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter") forwardGeocode(locationQuery); }}
                      placeholder="Type area, landmark or address…"
                      className="w-full h-11 pl-9 pr-3 border border-border bg-card text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <button
                    onClick={() => forwardGeocode(locationQuery)}
                    disabled={locationSearching}
                    className="h-11 px-3 bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-60"
                  >
                    {locationSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  </button>
                </div>
                {locationError && <p className="font-mono text-[10px] text-red-500 mt-1 tracking-wide">{locationError}</p>}
                {coords && (
                  <p className="font-mono text-[10px] text-primary mt-1 tracking-wide">
                    ✓ Pinned — or click the map to adjust
                  </p>
                )}
              </div>

              {/* Zone status */}
              {coords && <ZoneBanner zone={zone} />}

              {/* Map legend */}
              {!coords && (
                <div className="flex gap-3 font-mono text-[10px] tracking-wide text-muted-foreground bg-secondary p-3">
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />Red = Prohibited</div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />Yellow = Permission</div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />Green = Free</div>
                </div>
              )}

              {/* Service */}
              <div>
                <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase mb-1.5">Service</p>
                <div className="grid grid-cols-2 gap-2">
                  {SERVICES.map((svc) => (
                    <button key={svc.id} onClick={() => setSelectedService(svc)}
                      className={`p-3 border text-left transition-all ${selectedService?.id === svc.id ? "border-primary bg-[#121212] text-white" : "border-border hover:border-foreground/30 bg-card"}`}>
                      <div className="text-xl mb-1">{svc.icon}</div>
                      <p className="font-semibold text-sm">{svc.label}</p>
                      <p className={`text-xs mt-0.5 ${selectedService?.id === svc.id ? "text-white/50" : "text-muted-foreground"}`}>{svc.description}</p>
                      <p className="text-sm font-bold mt-1.5 text-primary">{inr(svc.price)}+</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div>
                <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase mb-1.5">Shoot Date</p>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-border bg-card text-sm focus:outline-none focus:border-primary transition-colors" />
                </div>
              </div>

              <button onClick={handleFindPilots} disabled={!selectedService || !coords}
                className="w-full py-3 bg-primary text-primary-foreground font-mono text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all mt-auto">
                Find Pilots Near Me <ChevronRight className="w-4 h-4" />
              </button>
              {!coords && <p className="font-mono text-[10px] text-center text-muted-foreground tracking-wide">Pin your location on the map first</p>}
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col items-center py-5 gap-3">
                <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-medium text-foreground">Searching pilots near {location}…</p>
                <p className="font-mono text-[10px] text-muted-foreground tracking-wide">{selectedService?.label} · {inr(selectedService?.price || 0)}</p>
              </div>
              <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">Available Pilots</p>
              {PILOTS.map((p) => (
                <div key={p.id} className={`flex items-center gap-3 bg-secondary border border-border p-3 transition-all duration-500 ${appearedPilots.has(p.id) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
                  <div className="w-10 h-10 flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: p.color }}>{p.initials}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{p.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground tracking-wide">⭐ {p.rating} · {p.distance}</p>
                  </div>
                  <span className="font-mono text-[10px] text-primary tracking-wide">Checking…</span>
                </div>
              ))}
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <div>
                <p className="font-mono text-[10px] tracking-[0.3em] text-green-600 uppercase mb-0.5">✓ Pilot Matched</p>
                <h2 className="font-display text-base font-bold tracking-tight">YOUR PILOT IS READY</h2>
              </div>

              {/* Zone reminder */}
              {zone && zone.zoneType !== "green" && <ZoneBanner zone={zone} />}

              {/* Pilot card */}
              <div className="border border-primary p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 flex items-center justify-center text-white font-bold text-xl flex-shrink-0" style={{ background: matchedPilot.color }}>{matchedPilot.initials}</div>
                  <div>
                    <p className="font-bold text-base">{matchedPilot.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground tracking-wide flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /> {matchedPilot.rating} · {matchedPilot.distance}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {matchedPilot.certs.map((c) => (
                    <span key={c} className="flex items-center gap-1 font-mono text-[10px] tracking-wide bg-primary/10 text-primary px-2 py-1"><Shield className="w-3 h-3" />{c}</span>
                  ))}
                  {(zone?.zoneType === "red" || zone?.zoneType?.includes("yellow")) && (
                    <span className="flex items-center gap-1 font-mono text-[10px] tracking-wide bg-orange-50 text-orange-700 px-2 py-1">
                      <AlertTriangle className="w-3 h-3" /> Zone-Cleared
                    </span>
                  )}
                </div>
                <div className="bg-secondary px-4 py-3 flex justify-between items-center">
                  <div>
                    <p className="font-mono text-[10px] tracking-wide text-muted-foreground">{selectedService?.icon} {selectedService?.label}</p>
                    <p className="font-mono text-[10px] tracking-wide text-muted-foreground/60">{date || "Date TBD"} · {location}</p>
                  </div>
                  <span className="font-display text-lg font-bold text-primary">{inr(selectedService?.price || 0)}</span>
                </div>
              </div>

              {/* Other pilots */}
              <div>
                <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase mb-2">Switch Pilot</p>
                {PILOTS.map((p) => (
                  <div key={p.id} onClick={() => setMatchedPilot(p)}
                    className={`flex items-center gap-3 p-2.5 mb-1.5 cursor-pointer border transition-all ${matchedPilot.id === p.id ? "border-primary bg-primary/5" : "border-transparent hover:bg-secondary"}`}>
                    <div className="w-9 h-9 flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: p.color }}>{p.initials}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{p.name}</p>
                      <p className="font-mono text-[10px] text-muted-foreground tracking-wide">⭐ {p.rating} · {p.distance}</p>
                    </div>
                    {matchedPilot.id === p.id && <CheckCircle className="w-4 h-4 text-primary" />}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2 mt-auto">
                {!booked ? (
                  <>
                    <button onClick={() => setBooked(true)} className="w-full py-3 bg-primary text-primary-foreground font-mono text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
                      Accept & Book <ChevronRight className="w-4 h-4" />
                    </button>
                    <button onClick={() => { setAppearedPilots(new Set()); setStep(2); }} className="w-full py-2.5 border border-border font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground flex items-center justify-center gap-2 hover:border-foreground transition-colors">
                      <RefreshCw className="w-3.5 h-3.5" /> Try Another
                    </button>
                  </>
                ) : (
                  <div className="bg-green-50 border border-green-200 p-4 text-center">
                    <p className="font-semibold text-green-800 mb-1">Booking Confirmed!</p>
                    <p className="text-xs text-green-700 mb-3">
                      {zone && zone.zoneType !== "green"
                        ? `Zone notice included — ${matchedPilot.name} will arrange clearance for ${zone.zoneLabel}.`
                        : `Connect with ${matchedPilot.name} to finalise shoot details.`}
                    </p>
                    <a href={`https://wa.me/919645179861?text=${waMessage}`} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                      <Phone className="w-4 h-4" /> Open WhatsApp
                    </a>
                    <button onClick={() => { setStep(1); setBooked(false); setSelectedService(null); setCoords(null); setZone(null); setLocation(""); setDate(""); if (pinMarkerRef.current) { pinMarkerRef.current.remove(); pinMarkerRef.current = null; } }}
                      className="block w-full mt-2 text-xs text-gray-500 hover:text-gray-700 underline">
                      Start a new booking
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Map */}
      <div className="flex-1 relative hidden md:flex flex-col">
        <div ref={mapRef} className="flex-1" />
        {/* Zone legend */}
        <div className="absolute top-3 right-3 bg-white/95 rounded-xl shadow-md px-3 py-2 text-xs space-y-1.5 z-10">
          <p className="font-semibold text-gray-700 text-[11px] uppercase tracking-wide mb-1">Airspace Zones</p>
          {[["bg-red-400", "Red — Prohibited"], ["bg-yellow-400", "Yellow — Permission req."], ["bg-green-400", "Green — Free to fly"]].map(([cls, label]) => (
            <div key={label} className="flex items-center gap-2"><span className={`w-3 h-3 rounded-full ${cls} opacity-70`} />{label}</div>
          ))}
        </div>
        {/* Click instruction */}
        {!coords && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs font-medium px-4 py-2 rounded-full z-10 backdrop-blur-sm">
            👆 Click anywhere on the map to pin your shoot location
          </div>
        )}
        {/* Zone badge on map */}
        {coords && zone && (
          <div className={`absolute bottom-5 left-1/2 -translate-x-1/2 text-xs font-semibold px-4 py-2 rounded-full z-10 ${
            zone.zoneType === "green" ? "bg-green-600 text-white" : zone.zoneType.includes("yellow") || zone.zoneType === "approach" ? "bg-yellow-500 text-black" : "bg-red-600 text-white"
          }`}>
            {zone.zoneType === "green" ? "✅ Green Zone" : zone.zoneType.includes("yellow") || zone.zoneType === "approach" ? `⚠️ ${zone.zoneLabel} — ${zone.facilityName}` : `⛔ ${zone.zoneLabel} — ${zone.facilityName}`}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
