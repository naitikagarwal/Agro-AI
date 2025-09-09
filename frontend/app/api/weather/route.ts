// app/api/weather/route.ts
import { NextResponse } from "next/server";

type CacheEntry = { ts: number; data: any };
const cache = new Map<string, CacheEntry>();
const TTL_MS = 60 * 1000; // 60s cache - tweak as needed

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const location = url.searchParams.get("location")?.trim();
    if (!location) {
      return NextResponse.json(
        { error: "location required (q param)" },
        { status: 400 },
      );
    }

    const apiKey = process.env.WEATHERAPI_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "server missing WEATHERAPI_KEY" },
        { status: 500 },
      );
    }

    // simple cache to reduce repeated calls for same location
    const key = location.toLowerCase();
    const cached = cache.get(key);
    if (cached && Date.now() - cached.ts < TTL_MS) {
      return NextResponse.json(
        { fromCache: true, data: cached.data },
        { status: 200 },
      );
    }

    const weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${encodeURIComponent(
      apiKey,
    )}&q=${encodeURIComponent(location)}&aqi=no`;

    const r = await fetch(weatherUrl);
    const data = await r.json();

    // On non-OK, forward the error code/message
    if (!r.ok) {
      return new Response(JSON.stringify({ error: data }), {
        status: r.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    // cache & return
    cache.set(key, { ts: Date.now(), data });
    return new Response(JSON.stringify({ fromCache: false, data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "unknown error" },
      { status: 500 },
    );
  }
}
