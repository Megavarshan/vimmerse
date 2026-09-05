import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

/**
 * GET /api/catalog
 * Agent-readable product catalog proxy — ACP/A2A compatible.
 * Forwards to the PRISM backend catalog endpoint.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category  = searchParams.get("category") || "";
  const max_price = searchParams.get("max_price") || "";

  const params = new URLSearchParams();
  if (category)  params.set("category",  category);
  if (max_price) params.set("max_price", max_price);

  try {
    const res = await fetch(`${BACKEND}/api/v1/catalog?${params.toString()}`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 30 }, // Cache for 30s
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Backend unavailable" }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=30",
        "X-Powered-By":  "Vimmerse PRISM v2.0",
        "X-Agent-Readable": "true",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "PRISM backend offline", hint: "Start FastAPI with: uvicorn main:app --reload --port 8000" },
      { status: 503 }
    );
  }
}
