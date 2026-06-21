import { NextResponse } from "next/server";

// NOTAMs API Route - fetches and parses NOTAMs for Indian FIRs
// Indian FIRs: VIDF (Delhi), VECF (Kolkata), VOMF (Chennai), VABF (Mumbai)

const INDIAN_FIRS = ["VIDF", "VECF", "VOMF", "VABF"];

interface CachedNotams {
  timestamp: number;
  data: any;
}

let notamCache: CachedNotams | null = null;
const CACHE_TTL = 300000; // 5 minutes cache

// Comprehensive sample NOTAMs for Indian airspace (used as fallback/primary data)
// These represent realistic NOTAMs that would be active for Indian airspace
const SAMPLE_NOTAMS = [
  {
    id: "A0231/24",
    type: "N",
    fir: "VIDF",
    subject: "VIDP - ILS RWY 11 U/S",
    scope: "A",
    text: "ILS RWY 11 AT DELHI (VIDP) UNSERVICEABLE.\nPILOTS ARE ADVISED TO USE VOR APPROACH.\nVALID: 2024-01-15 0600Z TO 2024-03-15 1800Z",
    effectiveStart: "2024-01-15 06:00Z",
    effectiveEnd: "2024-03-15 18:00Z",
    coordinates: { lat: 28.5562, lng: 77.1000 },
    altitude: "SFC-FL250",
    parsed: true,
  },
  {
    id: "A0456/24",
    type: "N",
    fir: "VABF",
    subject: "VABB - RWY 14/32 RESTRICTED",
    scope: "A",
    text: "RWY 14/32 AT MUMBAI (VABB) RESTRICTED TO ACFT MTOW 77000KG AND BELOW.\nDUE TO SURFACE CONDITION.\nVALID: 2024-02-01 0000Z TO 2024-04-30 2359Z",
    effectiveStart: "2024-02-01 00:00Z",
    effectiveEnd: "2024-04-30 23:59Z",
    coordinates: { lat: 19.0896, lng: 72.8656 },
    altitude: "SFC",
    parsed: true,
  },
  {
    id: "A0678/24",
    type: "N",
    fir: "VOMF",
    subject: "VOMM - PARACHUTE JUMPING",
    scope: "W",
    text: "PARACHUTE JUMPING ACTIVITY AT CHENNAI (VOMM).\nAREA: 5NM RADIUS OF 1258N08010E.\nFL050-FL150.\nCONTACT CHENNAI TWR 118.1 MHZ.\nVALID: 2024-01-20 0500Z TO 2024-01-20 0900Z DAILY",
    effectiveStart: "2024-01-20 05:00Z",
    effectiveEnd: "2024-01-20 09:00Z",
    coordinates: { lat: 12.994, lng: 80.1707 },
    altitude: "FL050-FL150",
    parsed: true,
  },
  {
    id: "A0890/24",
    type: "N",
    fir: "VIDF",
    subject: "NEW DELHI - AIR DISPLAY",
    scope: "W",
    text: "AIR DISPLAY OVER NEW DELHI.\nAREA: 5KM RADIUS OF 2837N07713E.\nSFC-FL200.\nALL ACFT REQUIRE PRIOR APPROVAL FROM ATC.\nVALID: 2024-01-26 0800Z TO 2024-01-26 1200Z",
    effectiveStart: "2024-01-26 08:00Z",
    effectiveEnd: "2024-01-26 12:00Z",
    coordinates: { lat: 28.6139, lng: 77.209 },
    altitude: "SFC-FL200",
    parsed: true,
  },
  {
    id: "A1023/24",
    type: "R",
    fir: "VECF",
    subject: "VECC - VOR CCU MAINTENANCE",
    scope: "E",
    text: "VOR 'CCU' AT KOLKATA (VECC) UNDER MAINTENANCE.\nDME SERVICEABLE.\nVALID: 2024-02-10 0200Z TO 2024-02-10 0800Z",
    effectiveStart: "2024-02-10 02:00Z",
    effectiveEnd: "2024-02-10 08:00Z",
    coordinates: { lat: 22.6547, lng: 88.4467 },
    altitude: "SFC-FL460",
    parsed: true,
  },
  {
    id: "A1155/24",
    type: "N",
    fir: "VABF",
    subject: "VOBL - RNAV APPROACH TRIAL",
    scope: "A",
    text: "RNAV (GNSS) APPROACH TRIAL AT BENGALURU (VOBL) RWY 09.\nPILOTS MAY BE REQUESTED TO PARTICIPATE.\nFEEDBACK TO AAI OPERATIONS.\nVALID: 2024-03-01 0000Z TO 2024-06-30 2359Z",
    effectiveStart: "2024-03-01 00:00Z",
    effectiveEnd: "2024-06-30 23:59Z",
    coordinates: { lat: 13.1986, lng: 77.7066 },
    altitude: "SFC-FL300",
    parsed: true,
  },
  {
    id: "A1289/24",
    type: "N",
    fir: "VIDF",
    subject: "VIDP - DEPARTURE PROCEDURE CHANGE",
    scope: "A",
    text: "REVISED DEPARTURE PROCEDURE RWY 11 AT DELHI (VIDP).\nCLIMB STRAIGHT AHEAD TO DME 3 VIDP THEN TURN RIGHT.\nALL DEPARTURES ON SID ROUTE.\nVALID: 2024-02-15 0000Z TO 2024-05-15 2359Z",
    effectiveStart: "2024-02-15 00:00Z",
    effectiveEnd: "2024-05-15 23:59Z",
    coordinates: { lat: 28.5562, lng: 77.1000 },
    altitude: "SFC-FL100",
    parsed: true,
  },
  {
    id: "A1340/24",
    type: "C",
    fir: "VOMF",
    subject: "VOCI - PREVIOUS NOTAM CANCELLED",
    scope: "A",
    text: "NOTAM A0987/24 REGARDING VOR 'COK' AT COCHIN (VOCI) IS CANCELLED.\nVOR SERVICEABLE.\nVALID: 2024-02-01 0000Z",
    effectiveStart: "2024-02-01 00:00Z",
    effectiveEnd: "2024-12-31 23:59Z",
    coordinates: { lat: 10.152, lng: 76.4019 },
    altitude: "SFC-FL450",
    parsed: true,
  },
  {
    id: "A1450/24",
    type: "N",
    fir: "VECF",
    subject: "MILITARY EXERCISE - BAY OF BENGAL",
    scope: "W",
    text: "MILITARY EXERCISE IN BAY OF BENGAL AREA.\nAREA: 150NM RADIUS OF 1500N08500E.\nFL100-FL550.\nALL CIVIL ACFT CONTACT KOLKATA ATC PRIOR TO ENTRY.\nVALID: 2024-03-05 0400Z TO 2024-03-08 1200Z",
    effectiveStart: "2024-03-05 04:00Z",
    effectiveEnd: "2024-03-08 12:00Z",
    coordinates: { lat: 15.0, lng: 85.0 },
    altitude: "FL100-FL550",
    parsed: true,
  },
  {
    id: "A1580/24",
    type: "N",
    fir: "VABF",
    subject: "UAV OPERATIONS - GUJARAT",
    scope: "W",
    text: "UAV OPERATIONS IN GUJARAT AREA.\nAREA: 10NM RADIUS OF 2215N07050E.\nSFC-FL050.\nDRONE OPERATIONS PROHIBITED WITHIN AREA.\nVALID: 2024-02-20 0500Z TO 2024-02-25 1500Z DAILY",
    effectiveStart: "2024-02-20 05:00Z",
    effectiveEnd: "2024-02-25 15:00Z",
    coordinates: { lat: 22.25, lng: 70.83 },
    altitude: "SFC-FL050",
    parsed: true,
  },
  {
    id: "A1620/24",
    type: "N",
    fir: "VIDF",
    subject: "CRANE OBSTRUCTION - JAIPUR",
    scope: "A",
    text: "CRANE ERECTED AT JAIPUR (VIJP) AIRPORT VICINITY.\nPOSITION: 2649N07549E.\nHEIGHT: 150FT AGL.\nLIT AT NIGHT.\nVALID: 2024-01-10 0000Z TO 2024-06-30 2359Z",
    effectiveStart: "2024-01-10 00:00Z",
    effectiveEnd: "2024-06-30 23:59Z",
    coordinates: { lat: 26.8267, lng: 75.8122 },
    altitude: "SFC-150FT AGL",
    parsed: true,
  },
  {
    id: "A1750/24",
    type: "N",
    fir: "VOMF",
    subject: "AIRSPACE RESTRICTION - CHENNAI",
    scope: "E",
    text: "TEMPORARY RESTRICTED AREA ESTABLISHED FOR VIP MOVEMENT.\nAREA: 10NM RADIUS OF 1300N08010E.\nFL000-FL250.\nALL FLIGHTS REQUIRE PRIOR PERMISSION FROM ATC.\nVALID: 2024-03-15 0800Z TO 2024-03-15 1400Z",
    effectiveStart: "2024-03-15 08:00Z",
    effectiveEnd: "2024-03-15 14:00Z",
    coordinates: { lat: 13.0, lng: 80.17 },
    altitude: "SFC-FL250",
    parsed: true,
  },
  {
    id: "A1890/24",
    type: "R",
    fir: "VIDF",
    subject: "VIDP - ILS RWY 29 MAINTENANCE",
    scope: "A",
    text: "ILS RWY 29 AT DELHI (VIDP) SCHEDULED MAINTENANCE.\nVOR APPROACH AVAILABLE AS ALTERNATIVE.\nVALID: 2024-03-20 0200Z TO 2024-03-20 0600Z",
    effectiveStart: "2024-03-20 02:00Z",
    effectiveEnd: "2024-03-20 06:00Z",
    coordinates: { lat: 28.5562, lng: 77.1000 },
    altitude: "SFC-FL200",
    parsed: true,
  },
  {
    id: "A2010/24",
    type: "N",
    fir: "VABF",
    subject: "VOHS - TAXIWAY CLOSURE",
    scope: "A",
    text: "TAXIWAY C AT HYDERABAD (VOHS) CLOSED DUE TO CONSTRUCTION.\nALL ACFT USE TAXIWAY D FOR RWY 09L/27R.\nVALID: 2024-02-01 0000Z TO 2024-04-30 2359Z",
    effectiveStart: "2024-02-01 00:00Z",
    effectiveEnd: "2024-04-30 23:59Z",
    coordinates: { lat: 17.2403, lng: 78.4294 },
    altitude: "SFC",
    parsed: true,
  },
  {
    id: "A2150/24",
    type: "N",
    fir: "VECF",
    subject: "ROCKET LAUNCH - SRIHARIKOTA",
    scope: "W",
    text: "ROCKET LAUNCH FROM SRIHARIKOTA SPACE CENTRE.\nDANGER AREA: 50NM RADIUS OF 1343N08014E.\nSFC-UNLIMITED.\nALL ACFT AVOID AREA DURING LAUNCH WINDOW.\nVALID: 2024-04-01 0800Z TO 2024-04-01 1000Z",
    effectiveStart: "2024-04-01 08:00Z",
    effectiveEnd: "2024-04-01 10:00Z",
    coordinates: { lat: 13.72, lng: 80.23 },
    altitude: "SFC-UNL",
    parsed: true,
  },
  {
    id: "A2280/24",
    type: "N",
    fir: "VOMF",
    subject: "TRICHY - APCH LIGHTING U/S",
    scope: "A",
    text: "APPROACH LIGHTING SYSTEM AT TRICHY (VOTR) UNSERVICEABLE.\nPILOTS ADVISED TO EXERCISE CAUTION.\nVALID: 2024-02-15 0000Z TO 2024-03-15 2359Z",
    effectiveStart: "2024-02-15 00:00Z",
    effectiveEnd: "2024-03-15 23:59Z",
    coordinates: { lat: 10.7614, lng: 78.7106 },
    altitude: "SFC",
    parsed: true,
  },
  {
    id: "A2400/24",
    type: "C",
    fir: "VIDF",
    subject: "LUCKNOW - NOTAM CANCELLED",
    scope: "A",
    text: "NOTAM A1100/24 REGARDING VOR 'LKO' AT LUCKNOW (VILK) IS CANCELLED.\nVOR SERVICEABLE AND AVAILABLE.\nVALID: 2024-02-01 0000Z",
    effectiveStart: "2024-02-01 00:00Z",
    effectiveEnd: "2024-12-31 23:59Z",
    coordinates: { lat: 26.7694, lng: 80.8833 },
    altitude: "SFC-FL450",
    parsed: true,
  },
];

export async function GET(request: Request) {
  // Check cache
  if (notamCache && Date.now() - notamCache.timestamp < CACHE_TTL) {
    return NextResponse.json(notamCache.data);
  }

  try {
    // Try to fetch from the ICAO NOTAM API (if available)
    // The ICAO API at https://www.icao.int/safety/ais/ is not publicly accessible via API
    // DGCA DigitalSky also doesn't provide a public NOTAM API
    // We attempt the ICAO Easter NOTAM portal, but it typically requires authentication

    // For production, you would integrate with:
    // 1. AAI (Airports Authority of India) NOTAM service
    // 2. ICAO iSTARS NOTAM API (requires API key)
    // 3. DGCA DigitalSky API (when available)

    // Attempt to fetch from a public NOTAM source
    let notams: typeof SAMPLE_NOTAMS = [];

    try {
      // Try the public NOTAM feed (ICAO format)
      // Note: This is a best-effort attempt; many NOTAM APIs require authentication
      const fir = request.url ? new URL(request.url).searchParams.get("fir") : null;
      const firs = fir ? [fir] : INDIAN_FIRS;

      // Use the sample data as the primary source
      // In a production environment, this would be replaced with actual API calls
      notams = SAMPLE_NOTAMS.filter((n) => firs.includes(n.fir));
    } catch {
      notams = SAMPLE_NOTAMS;
    }

    const result = {
      notams,
      count: notams.length,
      firs: INDIAN_FIRS,
      source: "sample",
      note: "NOTAMs shown are sample data. For real-time NOTAMs, integrate with AAI or ICAO API.",
      lastUpdated: new Date().toISOString(),
    };

    notamCache = { timestamp: Date.now(), data: result };
    return NextResponse.json(result);
  } catch (error) {
    // Return sample data on error
    const result = {
      notams: SAMPLE_NOTAMS,
      count: SAMPLE_NOTAMS.length,
      firs: INDIAN_FIRS,
      source: "sample",
      note: "Using sample data due to API error.",
      lastUpdated: new Date().toISOString(),
    };

    notamCache = { timestamp: Date.now(), data: result };
    return NextResponse.json(result);
  }
}
