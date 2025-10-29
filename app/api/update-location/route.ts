import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

type UpdateLocationBody = {
  lat: number;
  lon: number;
  city: string;
  country: string;
  state: string;
  label: string;
  region: string;
  updatedAt: string;
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

  const reverseGoeocodeResult = await fetch(
    `https://api.mapbox.com/search/geocode/v6/reverse?access_token=${process.env.MAPBOX_ACCESS_TOKEN}&longitude=${lon}&latitude=${lat}&types=place`
  );

  if (!reverseGoeocodeResult.ok) {
    return NextResponse.json(
      { error: "Failed to get reverse geocoding data" },
      { status: 500 }
    );
  }

  const reverseGoeocodeData = (await reverseGoeocodeResult.json()) as {
    features: {
      properties: {
        full_address: string;
        bbox: [number, number, number, number];
        coordinates: {
          latitude: number;
          longitude: number;
        };
      };
    }[];
  };

  await redis.set(key, {
    fullAddress: reverseGoeocodeData.features[0].properties.full_address,
    bbox: reverseGoeocodeData.features[0].properties.bbox,
    latitude: reverseGoeocodeData.features[0].properties.coordinates.latitude,
    longitude: reverseGoeocodeData.features[0].properties.coordinates.longitude,
  });

  return NextResponse.json({
    message: "Location updated",
  });
}
