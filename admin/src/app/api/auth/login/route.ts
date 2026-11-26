import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { SESSION_MAX_AGE, sessionCookieOptions, signSession } from "@/lib/auth";
import { SESSION_COOKIE } from "@/lib/constants";
import { fail, handleError } from "@/lib/http";
import { getClientIp, rateLimit, resetRateLimit } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validators";

export const runtime = "nodejs";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const key = `login:${getClientIp(request)}`;
    const limit = rateLimit(key, MAX_ATTEMPTS, WINDOW_MS);
    if (!limit.ok) {
      return NextResponse.json(
        { error: `Too many login attempts. Try again in ${Math.ceil(limit.retryAfter / 60)} minutes.` },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
      );
    }

    const { email, password } = loginSchema.parse(await request.json());
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPass = process.env.ADMIN_PASSWORD;
    if (!adminEmail || !adminPass) {
      return fail("Admin credentials are not configured on the server", 500);
    }

    const emailMatches = email === adminEmail
    // const passwordMatches = await bcrypt.compare(password, adminHash);\
    const passwordMatches = password === adminPass;
    console.log(email,adminEmail)
    if (!emailMatches || !passwordMatches) {
      return fail("Invalid email or password", 401);
    }

    resetRateLimit(key);
    const response = NextResponse.json({ data: { email: adminEmail } });
    response.cookies.set(SESSION_COOKIE, await signSession(adminEmail), {
      ...sessionCookieOptions,
      maxAge: SESSION_MAX_AGE,
    });
    return response;
  } catch (error) {
    return handleError(error);
  }
}
