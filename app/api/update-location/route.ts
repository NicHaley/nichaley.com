import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

type UpdateLocationBody = {
  lat: number;
  lon: number;
};

const redisUrl = process.env.UPSTASH_REDIS_KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_KV_REST_API_TOKEN;

if (!redisUrl || !redisToken) {
  throw new Error("Missing Upstash Redis credentials");
}

const redis = new Redis({
  url: redisUrl,
  token: redisToken,
});

export async function POST(req: Request) {
  const expectedToken = process.env.UPDATE_LOCATION_TOKEN;
  const providedToken = req.headers.get("x-api-key");

  if (providedToken !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { lat, lon } = (body ?? {}) as Partial<UpdateLocationBody>;

  if (
    typeof lat !== "number" ||
    typeof lon !== "number" ||
    Number.isNaN(lat) ||
    Number.isNaN(lon)
  ) {
    return NextResponse.json(
      { error: "lat and lon must be numbers" },
      { status: 400 }
    );
  }

  const key = "current_location";
  const value = JSON.stringify({
    lat,
    lon,
    updatedAt: new Date().toISOString(),
  });

  await redis.set(key, value);

  return NextResponse.json({
    message: "Location updated",
  });
}
