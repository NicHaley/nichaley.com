import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing url", { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return new NextResponse("Invalid url", { status: 400 });
  }

  if (!(parsed.protocol === "http:" || parsed.protocol === "https:")) {
    return new NextResponse("Invalid protocol", { status: 400 });
  }

  // Optional: add SSRF protections here (block private IPs, etc.)
  const upstream = await fetch(parsed.toString(), {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; og-image-proxy/1.0)" },
    cache: "no-store",
    redirect: "follow",
  });

  if (!upstream.ok || !upstream.body) {
    return new NextResponse("Upstream error", { status: 502 });
  }

  const contentType =
    upstream.headers.get("content-type") ?? "application/octet-stream";
  if (!contentType.startsWith("image/")) {
    return new NextResponse("Not an image", { status: 400 });
  }

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
