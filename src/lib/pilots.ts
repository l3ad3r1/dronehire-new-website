// Pilot data layer for the booking flow.
// Source of truth is the Google Sheet (via APPS_SCRIPT_URL doGet?type=pilots).
// FALLBACK_PILOTS is used offline / if the fetch fails, so booking never breaks.
import { APPS_SCRIPT_URL } from "@/lib/config";

export type Pilot = {
  id: string;
  name: string;
  initials: string;
  color: string;
  rating: number;
  reviews: number;
  lat: number;
  lng: number;
  certs: string[];
};

// Mirrors the seed rows in apps-script/Code.gs setup().
export const FALLBACK_PILOTS: Pilot[] = [
  { id: "p1", name: "Arjun Reddy",  initials: "AR", color: "#2563eb", rating: 4.8, reviews: 142, lat: 17.412, lng: 78.491, certs: ["DGCA RPC", "NPNT Enabled"] },
  { id: "p2", name: "Priya Sharma", initials: "PS", color: "#7c3aed", rating: 4.9, reviews: 89,  lat: 17.368, lng: 78.472, certs: ["DGCA RPC", "NPNT Enabled", "Night Ops"] },
  { id: "p3", name: "Kiran Naidu",  initials: "KN", color: "#0891b2", rating: 4.7, reviews: 204, lat: 17.395, lng: 78.512, certs: ["DGCA RPC"] },
];

/** Fetch active pilots from the sheet. Falls back to the seed list on any failure. */
export async function fetchPilots(): Promise<Pilot[]> {
  if (!APPS_SCRIPT_URL) return FALLBACK_PILOTS;
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?type=pilots`, { cache: "no-store" });
    if (!res.ok) return FALLBACK_PILOTS;
    const data = (await res.json()) as Pilot[];
    if (!Array.isArray(data) || data.length === 0) return FALLBACK_PILOTS;
    // Guard against rows with missing/garbage coordinates.
    return data.filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng));
  } catch {
    return FALLBACK_PILOTS;
  }
}

/** Great-circle distance in km between two lat/lng points. */
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
