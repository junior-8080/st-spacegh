import { NextResponse } from "next/server";
import { preflight, withCors } from "@/lib/cors";
import { connectDB } from "@/lib/db";
import { handleError, ok } from "@/lib/http";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validators";
import { Message } from "@/models/Message";

export const runtime = "nodejs";

const MAX_PER_HOUR = 5;

export function OPTIONS(request: Request) {
  return preflight(request);
}

export async function POST(request: Request) {
  try {
    const { website, ...input } = contactSchema.parse(await request.json());

    // Honeypot filled in: pretend success so bots learn nothing, but store nothing.
    if (website) return withCors(request, ok({ received: true }, { status: 201 }));

    const limit = rateLimit(`contact:${getClientIp(request)}`, MAX_PER_HOUR, 60 * 60 * 1000);
    if (!limit.ok) {
      return withCors(
        request,
        NextResponse.json(
          { error: "Too many messages sent. Please try again later or call us directly." },
          { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
        ),
      );
    }

    await connectDB();
    await Message.create(input);
    return withCors(request, ok({ received: true }, { status: 201 }));
  } catch (error) {
    return withCors(request, handleError(error));
  }
}
