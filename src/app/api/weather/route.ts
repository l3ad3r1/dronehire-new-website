import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json({ error: "lat and lng required" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,wind_speed_10m,visibility,weather_code&timezone=auto`,
      { next: { revalidate: 1800 } }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Weather API failed" }, { status: 502 });
    }

    const data = await res.json();
    const current = data.current;

    const visibility = current.visibility >= 1000
      ? `${(current.visibility / 1000).toFixed(1)} km`
      : `${current.visibility} m`;

    // WMO weather code interpretation
    const weatherDescriptions: Record<number, string> = {
      0: "Clear sky",
      1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
      45: "Foggy", 48: "Depositing rime fog",
      51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
      61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
      71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
      80: "Slight rain showers", 81: "Moderate rain showers", 82: "Violent rain showers",
      95: "Thunderstorm", 96: "Thunderstorm with slight hail", 99: "Thunderstorm with heavy hail",
    };

    return NextResponse.json({
      temperature: `${current.temperature_2m}°C`,
      windSpeed: `${current.wind_speed_10m} km/h`,
      visibility,
      weatherCode: current.weather_code,
      weatherDescription: weatherDescriptions[current.weather_code] || "Unknown",
    });
  } catch (error) {
    return NextResponse.json({ error: "Weather fetch failed" }, { status: 500 });
  }
}
