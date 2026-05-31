import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url param" }, { status: 400 });
  }

  // Optional: whitelist your own domains only
  const allowed = process.env.NEXT_PUBLIC_ASSET_DOMAINS?.split(",") ?? [];
  if (allowed.length > 0) {
    const { hostname } = new URL(url);
    if (!allowed.some((domain) => hostname.endsWith(domain.trim()))) {
      return NextResponse.json(
        { error: "Domain not allowed" },
        { status: 403 },
      );
    }
  }

  const res = await fetch(url, { cache: "force-cache" });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch asset" },
      { status: res.status },
    );
  }

  const blob = await res.arrayBuffer();
  const contentType =
    res.headers.get("content-type") ?? "application/octet-stream";

  return new NextResponse(blob, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      // Cache aggressively — these are static assets
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
