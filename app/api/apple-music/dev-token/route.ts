import { NextResponse } from "next/server";
import { generateAppleMusicDeveloperToken } from "@/lib/apple-music";

export async function GET() {
  const token = await generateAppleMusicDeveloperToken();
  return NextResponse.json(
    { token },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
