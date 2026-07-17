import type { Facility, FacilityType, ZoneFilterId, ApproachPath } from "@/data/facilities";
import { FACILITIES, getZoneRadii, ZONE_FILTERS } from "@/data/facilities";
import type { FeatureCollection, Feature, Polygon, MultiPolygon, Point, LineString } from "geojson";
import { circle } from "@turf/circle";
import { point, lineString, polygon } from "@turf/helpers";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { destination } from "@turf/destination";
import { lineToPolygon } from "@turf/line-to-polygon";

// Map style using OpenStreetMap raster tiles (no API key needed)
export const MAP_STYLE_STANDARD: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: [
        "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution: "&copy; OpenStreetMap contributors",
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm",
      minzoom: 0,
      maxzoom: 24,
    },
  ],
};

export const MAP_STYLE_SATELLITE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    esri: {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution: "&copy; Esri",
      maxzoom: 18,
    },
  },
  layers: [
    {
      id: "esri",
      type: "raster",
      source: "esri",
      minzoom: 0,
      maxzoom: 24,
    },
  ],
};

export const INDIA_CENTER: [number, number] = [20.5937, 78.9629];
export const INDIA_DEFAULT_ZOOM = 5;

// Generate approach path polygon from a facility
function generateApproachPolygon(
  facility: Facility,
  approach: ApproachPath
): Feature<Polygon> | null {
  try {
    const center: [number, number] = [facility.lng, facility.lat];
    const centerPt = point(center);

    // Destination point at end of approach path
    const endPt = destination(centerPt, approach.length, approach.heading, {
      units: "kilometers",
    });

    // Perpendicular offsets at both ends
    const leftStart = destination(centerPt, approach.width, approach.heading - 90, {
      units: "kilometers",
    });
    const rightStart = destination(centerPt, approach.width, approach.heading + 90, {
      units: "kilometers" });
    const leftEnd = destination(endPt, approach.width, approach.heading - 90, {
      units: "kilometers",
    });
    const rightEnd = destination(endPt, approach.width, approach.heading + 90, {
      units: "kilometers",
    });

    const coords: [number, number][] = [
      leftStart.geometry.coordinates as [number, number],
      rightStart.geometry.coordinates as [number, number],
      rightEnd.geometry.coordinates as [number, number],
      leftEnd.geometry.coordinates as [number, number],
      leftStart.geometry.coordinates as [number, number],
    ];

    return {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [coords],
      },
      properties: {
        type: "approach",
        facilityId: facility.id,
        facilityName: facility.name,
        facilityType: facility.type,
        heading: approach.heading,
        length: approach.length,
        zoneLabel: "Approach Path",
      },
    };
  } catch (e) {
    console.error("Error generating approach polygon:", e);
    return null;
  }
}

// Generate GeoJSON zones from facility data using Turf.js circles
export function generateZoneGeoJSON(
  facilities: Facility[],
  activeZones: Set<ZoneFilterId>,
  customFeatures: Feature[] = []
): FeatureCollection {
  const features: Feature[] = [];

  // Add custom features from KML import
  features.push(...customFeatures);

  for (const facility of facilities) {
    const radii = getZoneRadii(facility);
    const center: [number, number] = [facility.lng, facility.lat];
    const facilityType = facility.type;

    // Determine which zones to show based on active filters and facility type
    const isAirport = ["airport", "domestic"].includes(facilityType);
    const isMilitary = ["military", "naval", "military-naval"].includes(facilityType);
    const isBoundary = facilityType === "boundary";
    const isTempRed = ["temporary_red_zone", "temp-red"].includes(facilityType);
    const isHelipad = facilityType === "helipad";
    const isAbandoned = facilityType === "abandoned";
    const isGovernment = facilityType === "government";
    const isOthers = facilityType === "others";

    // Generate Red Zone
    const shouldShowRed =
      (isAirport && activeZones.has("airport-red")) ||
      (isMilitary && activeZones.has("airport-red")) ||
      (isBoundary && activeZones.has("boundary")) ||
      (isTempRed && activeZones.has("temp-red")) ||
      (isHelipad && activeZones.has("helipad-red")) ||
      (isAbandoned && activeZones.has("abandoned-red")) ||
      (isGovernment && activeZones.has("airport-red")) ||
      (isOthers && activeZones.has("airport-red"));

    if (shouldShowRed && radii.red > 0) {
      try {
        const redCircle = circle(center, radii.red, {
          steps: 32,
          units: "kilometers",
          properties: {
            type: isBoundary ? "boundary" : isTempRed ? "temporary_red_zone" : isHelipad ? "helipad" : "red",
            facilityId: facility.id,
            facilityName: facility.name,
            facilityType: facility.type,
            radius: radii.red,
            zoneLabel: "Red Zone",
          },
        });
        features.push(redCircle);
      } catch (e) {
        console.error("Error generating red zone:", e);
      }
    }

    // Generate Inner Yellow Zone (only for airports)
    const shouldShowInnerYellow =
      isAirport && activeZones.has("airport-inner") && radii.innerYellow > 0;

    if (shouldShowInnerYellow && radii.innerYellow > 0) {
      try {
        const innerYellowCircle = circle(center, radii.innerYellow, {
          steps: 32,
          units: "kilometers",
          properties: {
            type: "inner-yellow",
            facilityId: facility.id,
            facilityName: facility.name,
            facilityType: facility.type,
            radius: radii.innerYellow,
            zoneLabel: "Inner Yellow Zone",
          },
        });
        features.push(innerYellowCircle);
      } catch (e) {
        console.error("Error generating inner yellow zone:", e);
      }
    }

    // Generate Outer Yellow Zone (only for airports)
    const shouldShowOuterYellow =
      isAirport && activeZones.has("airport-outer") && radii.outerYellow > 0;

    if (shouldShowOuterYellow && radii.outerYellow > 0) {
      try {
        const outerYellowCircle = circle(center, radii.outerYellow, {
          steps: 32,
          units: "kilometers",
          properties: {
            type: "outer-yellow",
            facilityId: facility.id,
            facilityName: facility.name,
            facilityType: facility.type,
            radius: radii.outerYellow,
            zoneLabel: "Outer Yellow Zone",
          },
        });
        features.push(outerYellowCircle);
      } catch (e) {
        console.error("Error generating outer yellow zone:", e);
      }
    }

    // Generate Approach Path Zones (only for airports with approach data)
    const shouldShowApproach =
      (isAirport || isMilitary) && activeZones.has("runway") && facility.approachPaths;

    if (shouldShowApproach && facility.approachPaths) {
      for (const approach of facility.approachPaths) {
        const approachPolygon = generateApproachPolygon(facility, approach);
        if (approachPolygon) {
          features.push(approachPolygon);
        }
      }
    }

    // Generate facility point marker
    const shouldShowPoint =
      shouldShowRed || shouldShowInnerYellow || shouldShowOuterYellow || shouldShowApproach;

    if (shouldShowPoint) {
      features.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: center,
        },
        properties: {
          type: "facility",
          facilityId: facility.id,
          facilityName: facility.name,
          facilityType: facility.type,
          icao: facility.icao || "",
        },
      });
    }
  }

  return {
    type: "FeatureCollection",
    features,
  };
}

// Check which zone a point falls into
export interface ZoneCheckResult {
  zoneType: "green" | "red" | "inner-yellow" | "outer-yellow" | "boundary" | "helipad" | "temporary_red_zone" | "approach";
  zoneLabel: string;
  facilityName: string;
  facilityType: string;
  distance: number;
  description: string;
}

export function checkPointZone(lat: number, lng: number, facilities: Facility[]): ZoneCheckResult {
  const pt = point([lng, lat]);
  let closest: ZoneCheckResult = {
    zoneType: "green",
    zoneLabel: "Green Zone",
    facilityName: "N/A",
    facilityType: "N/A",
    distance: 0,
    description: "No permission required for drones up to 500kg below 400ft.",
  };
  let minDistance = Infinity;

  for (const facility of facilities) {
    const radii = getZoneRadii(facility);
    const center: [number, number] = [facility.lng, facility.lat];

    // Check red zone (most restrictive) first so it wins ties in distance
    if (radii.red > 0) {
      try {
        const redPoly = circle(center, radii.red, { steps: 32, units: "kilometers" });
        if (booleanPointInPolygon(pt, redPoly)) {
          const dist = calculateDistance(lat, lng, facility.lat, facility.lng);
          if (dist < minDistance) {
            minDistance = dist;
            let zoneType: ZoneCheckResult["zoneType"] = "red";
            let label = "Red Zone";
            let desc = "No-fly zone. Permission required from Central Government.";

            if (facility.type === "boundary") {
              zoneType = "boundary";
              label = "International Boundary";
              desc = "International Boundary Zone. Restricted Airspace.";
            } else if (facility.type === "temporary_red_zone" || facility.type === "temp-red") {
              zoneType = "temporary_red_zone";
              label = "Temporary Red Zone";
              desc = "Strict No-Fly Area. Temporary restriction in effect.";
            } else if (facility.type === "helipad") {
              zoneType = "helipad";
              label = "Helipad Zone";
              desc = "Helipad restricted zone. Permission required.";
            }

            closest = {
              zoneType,
              zoneLabel: label,
              facilityName: facility.name,
              facilityType: facility.type,
              distance: dist,
              description: desc,
            };
          }
        }
      } catch {}
    }

    // Check inner yellow
    if (radii.innerYellow > 0) {
      try {
        const innerYellowPoly = circle(center, radii.innerYellow, { steps: 32, units: "kilometers" });
        if (booleanPointInPolygon(pt, innerYellowPoly)) {
          const dist = calculateDistance(lat, lng, facility.lat, facility.lng);
          if (dist < minDistance) {
            minDistance = dist;
            closest = {
              zoneType: "inner-yellow",
              zoneLabel: "Inner Yellow Zone",
              facilityName: facility.name,
              facilityType: facility.type,
              distance: dist,
              description: "Permission required from ATC. Area 5-8km from airport perimeter.",
            };
          }
        }
      } catch {}
    }

    // Check outer yellow
    if (radii.outerYellow > 0) {
      try {
        const outerYellowPoly = circle(center, radii.outerYellow, { steps: 32, units: "kilometers" });
        if (booleanPointInPolygon(pt, outerYellowPoly)) {
          const dist = calculateDistance(lat, lng, facility.lat, facility.lng);
          if (dist < minDistance) {
            minDistance = dist;
            closest = {
              zoneType: "outer-yellow",
              zoneLabel: "Outer Yellow Zone",
              facilityName: facility.name,
              facilityType: facility.type,
              distance: dist,
              description: "Permission required from ATC. Area 8-12km from airport perimeter.",
            };
          }
        }
      } catch {}
    }

    // Check approach paths
    if (facility.approachPaths) {
      for (const approach of facility.approachPaths) {
        const approachPoly = generateApproachPolygon(facility, approach);
        if (approachPoly) {
          try {
            if (booleanPointInPolygon(pt, approachPoly)) {
              const dist = calculateDistance(lat, lng, facility.lat, facility.lng);
              if (dist < minDistance) {
                minDistance = dist;
                closest = {
                  zoneType: "approach",
                  zoneLabel: "Approach Path",
                  facilityName: facility.name,
                  facilityType: facility.type,
                  distance: dist,
                  description: "Approach path zone. Permission required from ATC for drone operations.",
                };
              }
            }
          } catch {}
        }
      }
    }
  }

  return closest;
}

// Calculate distance between two points in km (Haversine)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Flight tracking data types
export interface AircraftState {
  icao24: string;
  callsign: string;
  originCountry: string;
  lat: number;
  lng: number;
  baroAltitude: number | null;
  velocity: number | null;
  heading: number | null;
  onGround: boolean;
}

// MapLibre GL layer definitions for zones
export function getZoneLayers() {
  return [
    {
      id: "zones-outer-yellow-fill",
      type: "fill" as const,
      filter: ["==" as const, ["get" as const, "type"] as any, "outer-yellow" as any],
      paint: {
        "fill-color": "#ffeb3b",
        "fill-opacity": 0.25,
      },
    },
    {
      id: "zones-inner-yellow-fill",
      type: "fill" as const,
      filter: ["==" as const, ["get" as const, "type"] as any, "inner-yellow" as any],
      paint: {
        "fill-color": "#ff9800",
        "fill-opacity": 0.3,
      },
    },
    {
      id: "zones-red-fill",
      type: "fill" as const,
      filter: [
        "any" as const,
        ["==" as const, ["get" as const, "type"] as any, "red" as any],
        ["==" as const, ["get" as const, "type"] as any, "temporary_red_zone" as any],
      ],
      paint: {
        "fill-color": "#ff0505",
        "fill-opacity": 0.4,
      },
    },
    {
      id: "zones-boundary-fill",
      type: "fill" as const,
      filter: ["==" as const, ["get" as const, "type"] as any, "boundary" as any],
      paint: {
        "fill-color": "#d61e1e",
        "fill-opacity": 0.3,
      },
    },
    {
      id: "zones-helipad-fill",
      type: "fill" as const,
      filter: ["==" as const, ["get" as const, "type"] as any, "helipad" as any],
      paint: {
        "fill-color": "#e91e63",
        "fill-opacity": 0.35,
      },
    },
    {
      id: "zones-approach-fill",
      type: "fill" as const,
      filter: ["==" as const, ["get" as const, "type"] as any, "approach" as any],
      paint: {
        "fill-color": "#f76363",
        "fill-opacity": 0.3,
      },
    },
    {
      id: "zones-custom-fill",
      type: "fill" as const,
      filter: ["==" as const, ["get" as const, "type"] as any, "custom" as any],
      paint: {
        "fill-color": "#9c27b0",
        "fill-opacity": 0.35,
      },
    },
    // Zone outlines
    {
      id: "zones-outline",
      type: "line" as const,
      filter: [
        "all" as const,
        ["!=" as const, ["get" as const, "type"] as any, "facility" as any],
        ["!=" as const, ["get" as const, "type"] as any, "aircraft" as any],
      ],
      paint: {
        "line-color": [
          "match" as const,
          ["get" as const, "type"] as any,
          "red" as any, "#cc0000" as any,
          "inner-yellow" as any, "#ff9800" as any,
          "outer-yellow" as any, "#fdd835" as any,
          "boundary" as any, "#d61e1e" as any,
          "helipad" as any, "#e91e63" as any,
          "temporary_red_zone" as any, "#ff0505" as any,
          "approach" as any, "#f76363" as any,
          "custom" as any, "#9c27b0" as any,
          "#999999" as any,
        ],
        "line-width": 2,
        "line-opacity": 0.8,
      },
    },
    // Facility point markers
    {
      id: "facility-points",
      type: "circle" as const,
      filter: ["==" as const, ["get" as const, "type"] as any, "facility" as any],
      paint: {
        "circle-radius": 5,
        "circle-color": "#ffffff",
        "circle-stroke-width": 2,
        "circle-stroke-color": "#333333",
      },
    },
  ];
}
