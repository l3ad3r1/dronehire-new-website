import { NextResponse } from "next/server";

// OpenSky Network API - free, no auth required for basic access
const OPENSKY_API = "https://opensky-network.org/api/states/all";

// Bounding box for India and surrounding airspace
// lamin, lamax, lomin, lomax
const INDIA_BBOX = {
  lamin: 5,
  lamax: 38,
  lomin: 65,
  lomax: 100,
};

interface CachedData {
  timestamp: number;
  data: any;
}

let cache: CachedData | null = null;
const CACHE_TTL = 30000; // 30 seconds cache to reduce API calls

// Sample/demo flight data for when OpenSky is unavailable
const DEMO_FLIGHTS = [
  { icao24: "800f3f", callsign: "AIC101", originCountry: "India", lng: 77.1, lat: 28.5, baroAltitude: 10058, velocity: 240, heading: 270, onGround: false },
  { icao24: "800f44", callsign: "AIC203", originCountry: "India", lng: 72.8, lat: 19.0, baroAltitude: 8534, velocity: 220, heading: 90, onGround: false },
  { icao24: "800f50", callsign: "IGO612", originCountry: "India", lng: 78.4, lat: 17.2, baroAltitude: 11277, velocity: 250, heading: 180, onGround: false },
  { icao24: "800f55", callsign: "IGO733", originCountry: "India", lng: 80.1, lat: 12.9, baroAltitude: 9144, velocity: 230, heading: 360, onGround: false },
  { icao24: "800f60", callsign: "VTV881", originCountry: "India", lng: 88.4, lat: 22.6, baroAltitude: 10668, velocity: 245, heading: 45, onGround: false },
  { icao24: "800f65", callsign: "AIC404", originCountry: "India", lng: 77.7, lat: 13.1, baroAltitude: 9753, velocity: 235, heading: 0, onGround: false },
  { icao24: "800f70", callsign: "IGO456", originCountry: "India", lng: 75.8, lat: 26.8, baroAltitude: 8229, velocity: 215, heading: 135, onGround: false },
  { icao24: "800f75", callsign: "VTV992", originCountry: "India", lng: 73.8, lat: 15.9, baroAltitude: 7010, velocity: 200, heading: 315, onGround: false },
  { icao24: "800f80", callsign: "AIC555", originCountry: "India", lng: 72.6, lat: 23.0, baroAltitude: 10363, velocity: 248, heading: 180, onGround: false },
  { icao24: "800f85", callsign: "IGO221", originCountry: "India", lng: 85.8, lat: 20.2, baroAltitude: 8839, velocity: 225, heading: 270, onGround: false },
  { icao24: "800f90", callsign: "BA777", originCountry: "United Kingdom", lng: 77.2, lat: 28.4, baroAltitude: 11887, velocity: 260, heading: 95, onGround: false },
  { icao24: "800f95", callsign: "SIN321", originCountry: "Singapore", lng: 80.2, lat: 13.0, baroAltitude: 11277, velocity: 255, heading: 90, onGround: false },
  { icao24: "800fa0", callsign: "UAE501", originCountry: "UAE", lng: 72.9, lat: 19.1, baroAltitude: 10058, velocity: 240, heading: 270, onGround: false },
  { icao24: "800fa5", callsign: "DLH754", originCountry: "Germany", lng: 77.3, lat: 28.6, baroAltitude: 11887, velocity: 258, heading: 275, onGround: false },
  { icao24: "800fb0", callsign: "AIC810", originCountry: "India", lng: 78.9, lat: 26.7, baroAltitude: 8229, velocity: 210, heading: 90, onGround: false },
  { icao24: "800fb5", callsign: "IGO109", originCountry: "India", lng: 74.7, lat: 31.7, baroAltitude: 9144, velocity: 228, heading: 180, onGround: false },
  { icao24: "800fc0", callsign: "AIC301", originCountry: "India", lng: 88.3, lat: 26.7, baroAltitude: 10668, velocity: 242, heading: 315, onGround: false },
  { icao24: "800fc5", callsign: "VTV442", originCountry: "India", lng: 76.4, lat: 10.1, baroAltitude: 9753, velocity: 232, heading: 45, onGround: false },
  { icao24: "800fd0", callsign: "THA341", originCountry: "Thailand", lng: 93.0, lat: 24.5, baroAltitude: 11277, velocity: 255, heading: 270, onGround: false },
  { icao24: "800fd5", callsign: "SPO567", originCountry: "Sri Lanka", lng: 79.8, lat: 9.2, baroAltitude: 8534, velocity: 218, heading: 315, onGround: false },
];

export async function GET() {
  // Check cache
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  try {
    const url = `${OPENSKY_API}?lamin=${INDIA_BBOX.lamin}&lamax=${INDIA_BBOX.lamax}&lomin=${INDIA_BBOX.lomin}&lomax=${INDIA_BBOX.lomax}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "IndiaAirspaceMap/1.0",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      // If rate limited or server error, return cached data if available
      if (cache) {
        return NextResponse.json(cache.data);
      }
      // Fall back to demo data
      const result = { time: Math.floor(Date.now() / 1000), states: DEMO_FLIGHTS, count: DEMO_FLIGHTS.length, demo: true };
      cache = { timestamp: Date.now(), data: result };
      return NextResponse.json(result);
    }

    const data = await res.json();

    // Parse and filter the states array
    const states = (data.states || [])
      .filter((state: any[]) => {
        // Filter: must have position data
        return state[5] != null && state[6] != null;
      })
      .map((state: any[]) => ({
        icao24: state[0],
        callsign: state[1]?.trim() || "N/A",
        originCountry: state[2],
        lng: state[5],
        lat: state[6],
        baroAltitude: state[7],
        velocity: state[9],
        heading: state[10],
        onGround: state[8],
      }));

    const result = {
      time: data.time,
      states,
      count: states.length,
    };

    // Update cache
    cache = { timestamp: Date.now(), data: result };

    return NextResponse.json(result);
  } catch (error) {
    if (cache) {
      return NextResponse.json(cache.data);
    }
    // Fall back to demo data
    const result = { time: Math.floor(Date.now() / 1000), states: DEMO_FLIGHTS, count: DEMO_FLIGHTS.length, demo: true };
    cache = { timestamp: Date.now(), data: result };
    return NextResponse.json(result);
  }
}
