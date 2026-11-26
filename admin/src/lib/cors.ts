import { NextResponse } from "next/server";

function allowedOrigins(): string[] {
  return (process.env.WEBSITE_ORIGIN ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("origin");
  const headers: Record<string, string> = { Vary: "Origin" };
  if (origin && allowedOrigins().includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type";
    headers["Access-Control-Max-Age"] = "86400";
  }
  return headers;
}

/** Adds CORS headers (restricted to WEBSITE_ORIGIN) to a public API response. */
export function withCors(request: Request, response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(corsHeaders(request))) {
    response.headers.set(key, value);
  }
  return response;
}

/** Handles the OPTIONS preflight for public routes. */
export function preflight(request: Request): NextResponse {
  return withCors(request, new NextResponse(null, { status: 204 }));
}
