// Indian Airspace Facility Data
// Based on DGCA DigitalSky airspace classification
// Zone radii in kilometers

export interface FacilityZone {
  radius: number;
  geojson?: GeoJSON.Geometry;
}

export interface ApproachPath {
  heading: number;       // degrees from north
  length: number;        // km
  width: number;         // km (half-width from centerline)
}

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  lat: number;
  lng: number;
  zones: {
    red?: FacilityZone;
    innerYellow?: FacilityZone;
    outerYellow?: FacilityZone;
    approach?: FacilityZone;
  };
  approachPaths?: ApproachPath[];
  icao?: string;
}

export type FacilityType =
  | "airport"
  | "domestic"
  | "military"
  | "naval"
  | "military-naval"
  | "boundary"
  | "temporary_red_zone"
  | "temp-red"
  | "government"
  | "abandoned"
  | "helipad"
  | "others";

export const DEFAULT_RADII: Record<FacilityType, { red: number; innerYellow: number; outerYellow: number }> = {
  airport: { red: 5, innerYellow: 8, outerYellow: 12 },
  domestic: { red: 5, innerYellow: 8, outerYellow: 12 },
  military: { red: 5, innerYellow: 0, outerYellow: 0 },
  naval: { red: 5, innerYellow: 0, outerYellow: 0 },
  "military-naval": { red: 5, innerYellow: 0, outerYellow: 0 },
  boundary: { red: 25, innerYellow: 0, outerYellow: 0 },
  temporary_red_zone: { red: 5, innerYellow: 0, outerYellow: 0 },
  "temp-red": { red: 5, innerYellow: 0, outerYellow: 0 },
  government: { red: 5, innerYellow: 0, outerYellow: 0 },
  abandoned: { red: 2, innerYellow: 0, outerYellow: 0 },
  helipad: { red: 1, innerYellow: 0, outerYellow: 0 },
  others: { red: 5, innerYellow: 0, outerYellow: 0 },
};

export const ZONE_STYLES: Record<string, { label: string; color: string; fillOpacity: number; description: string }> = {
  red: {
    label: "Red Zone",
    color: "#ff0505",
    fillOpacity: 0.4,
    description: "No-fly zone. Permission required from Central Government.",
  },
  innerYellow: {
    label: "Inner Yellow Zone",
    color: "#ff9800",
    fillOpacity: 0.3,
    description: "Permission required from ATC. Area 5-8km from airport.",
  },
  outerYellow: {
    label: "Outer Yellow Zone",
    color: "#ffeb3b",
    fillOpacity: 0.25,
    description: "Permission required from ATC. Area 8-12km from airport.",
  },
  approach: {
    label: "Approach Path",
    color: "#f76363",
    fillOpacity: 0.35,
    description: "Approach path zone. Permission required.",
  },
  boundary: {
    label: "International Boundary",
    color: "#d61e1e",
    fillOpacity: 0.3,
    description: "International Boundary Zone. Restricted Airspace.",
  },
  green: {
    label: "Green Zone",
    color: "#008a00",
    fillOpacity: 0.15,
    description: "No permission required for drones up to 500kg below 400ft.",
  },
};

// Major Indian Airports & Facilities
export const FACILITIES: Facility[] = [
  // === MAJOR INTERNATIONAL AIRPORTS (with approach paths) ===
  { id: "DEL", name: "Indira Gandhi International Airport", type: "airport", lat: 28.5562, lng: 77.1000, icao: "VIDP", zones: {}, approachPaths: [{ heading: 95, length: 15, width: 2 }, { heading: 275, length: 15, width: 2 }] },
  { id: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport", type: "airport", lat: 19.0896, lng: 72.8656, icao: "VABB", zones: {}, approachPaths: [{ heading: 90, length: 15, width: 2 }, { heading: 270, length: 15, width: 2 }] },
  { id: "MAA", name: "Chennai International Airport", type: "airport", lat: 12.9940, lng: 80.1707, icao: "VOMM", zones: {}, approachPaths: [{ heading: 60, length: 15, width: 2 }, { heading: 240, length: 15, width: 2 }] },
  { id: "BLR", name: "Kempegowda International Airport", type: "airport", lat: 13.1986, lng: 77.7066, icao: "VOBL", zones: {}, approachPaths: [{ heading: 90, length: 15, width: 2 }, { heading: 270, length: 15, width: 2 }] },
  { id: "CCU", name: "Netaji Subhas Chandra Bose International Airport", type: "airport", lat: 22.6547, lng: 88.4467, icao: "VECC", zones: {}, approachPaths: [{ heading: 70, length: 15, width: 2 }, { heading: 250, length: 15, width: 2 }] },
  { id: "HYD", name: "Rajiv Gandhi International Airport", type: "airport", lat: 17.2403, lng: 78.4294, icao: "VOHS", zones: {}, approachPaths: [{ heading: 90, length: 15, width: 2 }, { heading: 270, length: 15, width: 2 }] },
  { id: "COK", name: "Cochin International Airport", type: "airport", lat: 10.1520, lng: 76.4019, icao: "VOCI", zones: {}, approachPaths: [{ heading: 80, length: 15, width: 2 }, { heading: 260, length: 15, width: 2 }] },
  { id: "GOI", name: "Manohar International Airport", type: "airport", lat: 15.9833, lng: 73.8500, icao: "VOPG", zones: {}, approachPaths: [{ heading: 60, length: 15, width: 2 }, { heading: 240, length: 15, width: 2 }] },
  { id: "JAI", name: "Jaipur International Airport", type: "airport", lat: 26.8267, lng: 75.8122, icao: "VIJP", zones: {}, approachPaths: [{ heading: 150, length: 15, width: 2 }, { heading: 330, length: 15, width: 2 }] },
  { id: "LKO", name: "Chaudhary Charan Singh International Airport", type: "airport", lat: 26.7694, lng: 80.8833, icao: "VILK", zones: {}, approachPaths: [{ heading: 90, length: 15, width: 2 }, { heading: 270, length: 15, width: 2 }] },

  // === DOMESTIC AIRPORTS (with approach paths) ===
  { id: "AMD", name: "Sardar Vallabhbhai Patel International Airport", type: "domestic", lat: 23.0772, lng: 72.6347, icao: "VAAH", zones: {}, approachPaths: [{ heading: 50, length: 12, width: 1.5 }, { heading: 230, length: 12, width: 1.5 }] },
  { id: "PNQ", name: "Pune Airport", type: "domestic", lat: 18.5822, lng: 73.9197, icao: "VAPO", zones: {}, approachPaths: [{ heading: 100, length: 12, width: 1.5 }, { heading: 280, length: 12, width: 1.5 }] },
  { id: "GAU", name: "Lokpriya Gopinath Bordoloi International Airport", type: "domestic", lat: 26.1061, lng: 91.5858, icao: "VEGT", zones: {} },
  { id: "BBI", name: "Biju Patnaik International Airport", type: "domestic", lat: 20.2494, lng: 85.8153, icao: "VEBS", zones: {} },
  { id: "TRV", name: "Trivandrum International Airport", type: "domestic", lat: 8.4812, lng: 76.9200, icao: "VOTV", zones: {} },
  { id: "CJB", name: "Coimbatore International Airport", type: "domestic", lat: 11.0322, lng: 77.0442, icao: "VOCB", zones: {} },
  { id: "IXC", name: "Chandigarh International Airport", type: "domestic", lat: 30.6736, lng: 76.7889, icao: "VICG", zones: {} },
  { id: "VNS", name: "Lal Bahadur Shastri International Airport", type: "domestic", lat: 25.4497, lng: 82.8550, icao: "VIBN", zones: {} },
  { id: "ATQ", name: "Sri Guru Ram Dass Jee International Airport", type: "domestic", lat: 31.7033, lng: 74.7978, icao: "VIAR", zones: {} },
  { id: "IDR", name: "Devi Ahilyabai Holkar Airport", type: "domestic", lat: 22.7217, lng: 75.8014, icao: "VAID", zones: {} },
  { id: "NAG", name: "Dr. Babasaheb Ambedkar International Airport", type: "domestic", lat: 21.0922, lng: 79.0472, icao: "VANP", zones: {} },
  { id: "PAT", name: "Jay Prakash Narayan International Airport", type: "domestic", lat: 25.5914, lng: 85.0881, icao: "VEPT", zones: {} },
  { id: "RPR", name: "Swami Vivekananda Airport", type: "domestic", lat: 21.1814, lng: 81.7389, icao: "VARP", zones: {} },
  { id: "IXB", name: "Bagdogra Airport", type: "domestic", lat: 26.6811, lng: 88.3286, icao: "VEBD", zones: {} },
  { id: "IXR", name: "Birsa Munda Airport", type: "domestic", lat: 23.3144, lng: 85.3219, icao: "VERC", zones: {} },
  { id: "BHO", name: "Raja Bhoj Airport", type: "domestic", lat: 23.2897, lng: 77.3372, icao: "VABP", zones: {} },
  { id: "SXR", name: "Sheikh ul-Alam International Airport", type: "domestic", lat: 33.9875, lng: 74.7731, icao: "VISR", zones: {} },
  { id: "GWL", name: "Rajmata Vijayaraje Scindia Airport", type: "domestic", lat: 26.2911, lng: 78.2292, icao: "VIGR", zones: {} },
  { id: "JLR", name: "Jabalpur Airport", type: "domestic", lat: 23.1764, lng: 80.0511, icao: "VAJB", zones: {} },
  { id: "IXM", name: "Madurai Airport", type: "domestic", lat: 9.8344, lng: 78.0933, icao: "VOMD", zones: {} },
  { id: "TRZ", name: "Tiruchirappalli International Airport", type: "domestic", lat: 10.7614, lng: 78.7106, icao: "VOTR", zones: {} },

  // === MILITARY AIRBASES ===
  { id: "AMB", name: "Ambala Air Force Station", type: "military", lat: 30.3744, lng: 76.8231, icao: "VIAM", zones: {} },
  { id: "HDO", name: "Hindon Air Force Station", type: "military", lat: 28.6383, lng: 77.4172, icao: "VIDX", zones: {} },
  { id: "AGC", name: "Agra Air Force Station", type: "military", lat: 27.1572, lng: 77.9608, icao: "VIAG", zones: {} },
  { id: "GWL_MIL", name: "Gwalior Air Force Station", type: "military", lat: 26.2886, lng: 78.2297, icao: "VIGR", zones: {} },
  { id: "JAI_MIL", name: "Jaipur Air Force Station", type: "military", lat: 26.9153, lng: 75.7989, zones: {} },
  { id: "PNE", name: "Pune Air Force Station", type: "military", lat: 18.5869, lng: 73.8608, zones: {} },
  { id: "BKN", name: "Bikaner Air Force Station", type: "military", lat: 28.0664, lng: 73.3614, zones: {} },
  { id: "JOD", name: "Jodhpur Air Force Station", type: "military", lat: 26.2511, lng: 73.0494, icao: "VIJO", zones: {} },
  { id: "MRC", name: "Murmuration Air Force Station", type: "military", lat: 13.2000, lng: 77.6700, zones: {} },
  { id: "CJM", name: "Car Nicobar Air Force Station", type: "military", lat: 9.1564, lng: 92.8264, icao: "VOCZ", zones: {} },

  // === NAVAL AIR STATIONS ===
  { id: "GOA_NAVAL", name: "INS Hansa (Naval Air Station)", type: "naval", lat: 15.3831, lng: 73.8283, icao: "VAGO", zones: {} },
  { id: "COCH_NAVAL", name: "INS Garuda (Naval Air Station)", type: "naval", lat: 9.9314, lng: 76.2672, icao: "VOCI", zones: {} },
  { id: "MUM_NAVAL", name: "INS Shikra (Naval Air Station)", type: "naval", lat: 18.9528, lng: 72.8361, zones: {} },
  { id: "VIZ_NAVAL", name: "INS Dega (Naval Air Station)", type: "naval", lat: 17.7214, lng: 83.2244, icao: "VOTZ", zones: {} },
  { id: "CHN_NAVAL", name: "INS Rajali (Naval Air Station)", type: "naval", lat: 12.4231, lng: 79.6889, icao: "VOLR", zones: {} },
  { id: "POR_NAVAL", name: "INS Utkrosh (Naval Air Station)", type: "naval", lat: 11.6153, lng: 92.7156, zones: {} },

  // === HELIPADS ===
  { id: "DEL_HELI", name: "Delhi Helipad", type: "helipad", lat: 28.6139, lng: 77.2090, zones: {} },
  { id: "MUM_HELI", name: "Mumbai Helipad", type: "helipad", lat: 19.0760, lng: 72.8777, zones: {} },
  { id: "SHM_HELI", name: "Shimla Helipad", type: "helipad", lat: 31.1048, lng: 77.1734, zones: {} },
  { id: "SRN_HELI", name: "Srinagar Helipad", type: "helipad", lat: 34.0837, lng: 74.7973, zones: {} },
  { id: "GNG_HELI", name: "Gangtok Helipad", type: "helipad", lat: 27.3389, lng: 88.6065, zones: {} },

  // === GOVERNMENT FACILITIES ===
  { id: "DEL_GOV", name: "New Delhi Government Restricted Zone", type: "government", lat: 28.6353, lng: 77.2250, zones: {} },
  { id: "MUM_GOV", name: "Mumbai Government Restricted Zone", type: "government", lat: 18.9220, lng: 72.8347, zones: {} },

  // === INTERNATIONAL BOUNDARY POINTS (simplified) ===
  { id: "BD_N", name: "Northern Boundary (Ladakh)", type: "boundary", lat: 34.5, lng: 77.5, zones: {} },
  { id: "BD_NE", name: "Northeastern Boundary (Arunachal)", type: "boundary", lat: 28.0, lng: 96.0, zones: {} },
  { id: "BD_W", name: "Western Boundary (Gujarat)", type: "boundary", lat: 23.5, lng: 68.5, zones: {} },
  { id: "BD_NW", name: "Northwestern Boundary (Rajasthan)", type: "boundary", lat: 27.5, lng: 70.0, zones: {} },
  { id: "BD_E", name: "Eastern Boundary (Manipur)", type: "boundary", lat: 24.0, lng: 94.5, zones: {} },

  // === TEMPORARY RED ZONES (examples) ===
  { id: "TEMP_RED_1", name: "Republic Day Restricted Zone (Temporary)", type: "temporary_red_zone", lat: 28.6200, lng: 77.2400, zones: {} },
  { id: "TEMP_RED_2", name: "Independence Day Restricted Zone (Temporary)", type: "temporary_red_zone", lat: 28.6200, lng: 77.2400, zones: {} },
];

// Helper to get zone radii for a facility (uses default if not specified)
export function getZoneRadii(facility: Facility) {
  const defaults = DEFAULT_RADII[facility.type] || DEFAULT_RADII.others;
  return {
    red: facility.zones.red?.radius ?? defaults.red,
    innerYellow: facility.zones.innerYellow?.radius ?? defaults.innerYellow,
    outerYellow: facility.zones.outerYellow?.radius ?? defaults.outerYellow,
  };
}

// Active zone filter types
export type ZoneFilterId =
  | "airport-red"
  | "airport-inner"
  | "airport-outer"
  | "runway"
  | "abandoned-red"
  | "temp-red"
  | "helipad-red"
  | "boundary"
  | "states";

export const ZONE_FILTERS: { id: ZoneFilterId; label: string; color: string; group: string }[] = [
  { id: "airport-red", label: "Red Zone", color: "#f44336", group: "Airport Zones" },
  { id: "airport-inner", label: "Inner Yellow Zone", color: "#ff9800", group: "Airport Zones" },
  { id: "airport-outer", label: "Outer Yellow Zone", color: "#ffeb3b", group: "Airport Zones" },
  { id: "runway", label: "Runway / Approach", color: "#f76363", group: "Approach" },
  { id: "abandoned-red", label: "Abandoned", color: "#d32f2f", group: "Other Zones" },
  { id: "temp-red", label: "Temporary Red Zone", color: "#ff0707", group: "Other Zones" },
  { id: "helipad-red", label: "Helipad", color: "#e91e63", group: "Other Zones" },
  { id: "boundary", label: "International Boundary", color: "#b04727", group: "Other Zones" },
  { id: "states", label: "State Restrictions", color: "#008a00", group: "Other Zones" },
];
